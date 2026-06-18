#!/usr/bin/env node

import { randomUUID } from 'node:crypto';
import dotenv from 'dotenv';
import express from 'express';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError } from '@modelcontextprotocol/sdk/types.js';
import { discoverTools } from './lib/tools.js';

dotenv.config();

function transformTools(tools) {
  return tools.map((tool) => {
    const fn = tool.definition?.function;
    if (!fn) return null;
    return { name: fn.name, description: fn.description, inputSchema: fn.parameters };
  }).filter(Boolean);
}

function createMcpServer(tools) {
  const server = new Server(
    { name: 'tallyprime-mcp-server', version: '1.0.0' },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: transformTools(tools),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args = {} } = request.params;
    const tool = tools.find((t) => t.definition.function.name === name);

    if (!tool) {
      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }

    const required = tool.definition?.function?.parameters?.required || [];
    for (const param of required) {
      if (!(param in args)) {
        throw new McpError(ErrorCode.InvalidParams, `Missing required parameter: ${param}`);
      }
    }

    try {
      const result = await tool.function(args);
      return {
        content: [{ type: 'text', text: typeof result === 'string' ? result : JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      throw new McpError(ErrorCode.InternalError, `Tool error: ${error.message}`);
    }
  });

  return server;
}

async function runStdio(tools) {
  const server = createMcpServer(tools);
  const transport = new StdioServerTransport();
  process.on('SIGINT', async () => { await server.close(); process.exit(0); });
  await server.connect(transport);
}

async function runHttp(tools, port) {
  const app = express();
  app.use(express.json());

  // sessionId -> StreamableHTTPServerTransport
  const transports = new Map();

  async function handleMcp(req, res) {
    const sessionId = req.headers['mcp-session-id'];

    if (sessionId) {
      const transport = transports.get(sessionId);
      if (!transport) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }
      await transport.handleRequest(req, res, req.body);
      return;
    }

    // Only POST can open a new session (initialization request)
    if (req.method !== 'POST') {
      res.status(400).json({ error: 'Mcp-Session-Id header required' });
      return;
    }

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (id) => transports.set(id, transport),
    });

    transport.onclose = () => {
      if (transport.sessionId) transports.delete(transport.sessionId);
    };

    const server = createMcpServer(tools);
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  }

  app.post('/mcp', handleMcp);
  app.get('/mcp', handleMcp);
  app.delete('/mcp', handleMcp);

  process.on('SIGINT', async () => {
    for (const transport of transports.values()) await transport.close().catch(() => {});
    process.exit(0);
  });

  app.listen(port, () => {
    console.log(`[MCP] Streamable HTTP server listening on http://0.0.0.0:${port}/mcp`);
  });
}

async function run() {
  const tools = await discoverTools();
  const args = process.argv.slice(2);

  if (args.includes('--http')) {
    await runHttp(tools, parseInt(process.env.PORT || '3001', 10));
  } else {
    await runStdio(tools);
  }
}

run().catch(console.error);
