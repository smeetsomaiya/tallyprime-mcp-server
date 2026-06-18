# TallyPrime MCP Server

> Connect Claude, ChatGPT, Codex, Perplexity, and any MCP-compatible AI directly to a live TallyPrime instance. Query ledgers, pull vouchers, run reports, and interrogate your books in plain English — no exports, no copy-paste.

Built by [Smeet Somaiya](https://github.com/smeetsomaiya) · MIT License · Contributions welcome

---

## What This Is

[TallyPrime](https://tallysolutions.com/) is the dominant accounting software in India. It exposes a local XML/HTTP API that lets external programs query live company data. This project wraps that API as an [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) server, making every piece of your Tally data accessible to Claude, ChatGPT, Codex, Perplexity, and any other MCP-compatible AI client.

Once connected, you can ask things like:

- *"What is the closing balance of my Sundry Debtors ledger for FY 2024-25?"*
- *"Show me all sales vouchers for April where the amount exceeds ₹1 lakh."*
- *"List all stock items and their MasterIDs."*
- *"Fetch the payslip for Rahul Sharma for March 2025."*
- *"Which companies are currently loaded in Tally?"*

The AI figures out which tool to call, with which parameters, and interprets the XML response for you.

---

## Prerequisites

### 1. TallyPrime with XML Server enabled

The server communicates with Tally over HTTP on a local port (default: `9000`). You must enable this in TallyPrime:

1. Open TallyPrime → press **F1** (Help) → **Settings**
2. Go to **Connectivity → Client/Server configuration**
3. Set **TallyPrime acts as** = `Server`
4. Set **Port** = `9000` (or any port you prefer — update `.env` to match)
5. Press **Enter** to save — no restart needed

> **Verify it works:** Open a browser and go to `http://localhost:9000`. You should see a Tally XML response — not a "connection refused" error.

> **Note:** Avoid the Educational version of TallyPrime. It has date range restrictions that cause incomplete or incorrect data to be returned to the AI.

### 2. Node.js v18+

Go to [nodejs.org](https://nodejs.org/) and click **Download Node.js (LTS)**. Run the `.msi` installer and click through — all defaults are fine. This installs both Node.js and npm in one go.

Once done, open a fresh Command Prompt and confirm it worked:

```cmd
node --version
```

It should print `v18.x` or higher.

---

## Download & Setup

### Step 1 — Download

Go to [github.com/smeetsomaiya/tallyprime-mcp-server](https://github.com/smeetsomaiya/tallyprime-mcp-server), click the green **Code** button, and select **Download ZIP**.

Extract the ZIP to a folder on your computer — for example:
```
C:\Users\YourName\Documents\tallyprime-mcp-server
```

### Step 2 — Open a terminal in that folder

In **File Explorer**, navigate to the extracted folder. Click the **address bar** at the top (where it shows the folder path), type `cmd`, and press **Enter**. This opens a Command Prompt already inside the folder.

### Step 3 — Install dependencies

In the Command Prompt window, run:

```cmd
npm install
```

This downloads the required packages. It takes about a minute and only needs to be done once.

### Step 4 — Configure the Tally connection

Open the `.env` file in the folder with Notepad. The defaults work if Tally is running on the same computer:

```
TALLY_URL=http://localhost
TALLY_PORT=9000
```

Change `TALLY_URL` to the IP address of the Tally machine if it runs on a different computer on your network.

### Step 5 — Verify everything is working

With TallyPrime open and its XML server enabled, run:

```cmd
npm run list-tools
```

You should see a list of 24 tools printed without any errors. If you see a connection error, check that the Tally XML server is enabled (see Prerequisites above).

---

## Configuration

The `.env` file at the project root controls how the server connects to Tally:

```env
# TallyPrime XML Server connection
TALLY_URL=http://localhost   # change to IP/hostname if Tally runs on a different machine
TALLY_PORT=9000              # change if you configured a non-default port in Tally
```

**Tally on the same machine?** The defaults work as-is.

**Tally on a different machine on your LAN?** Set `TALLY_URL=http://192.168.x.x` (the IP of the machine running Tally).

**Tally behind a corporate proxy or VPN?** Use the reachable hostname or IP. Tally's XML server must be network-accessible from wherever you run this MCP server.

---

## Supported Clients

| Platform | Local setup | Remote / Cloud |
|----------|:-----------:|:--------------:|
| Claude Desktop | ✅ | ✅ |
| Perplexity Desktop | ✅ | ✅ |
| ChatGPT | | ✅ |
| Codex | | ✅ |

**Local setup** means the MCP server runs on the same Windows machine as TallyPrime — no internet required. **Remote / Cloud** means the server is hosted somewhere and accessed over HTTP (see [HTTP Server mode](#http-server-mode) below).

---

## Local Setup — Claude Desktop

This is the recommended setup for most users. Claude Desktop launches the MCP server automatically in the background.

### Step 1 — Find your Node.js path

Open a Command Prompt and run:

```cmd
where node
```

Copy the path it prints. It will look something like:
```
C:\Program Files\nodejs\node.exe
```

### Step 2 — Find the full path to `mcpServer.js`

In the same Command Prompt window, navigate to the folder where you extracted the files and run:

```cmd
echo %cd%\mcpServer.js
```

Copy that full path. It will look something like:
```
C:\Users\YourName\Documents\tallyprime-mcp-server\mcpServer.js
```

### Step 3 — Edit the Claude Desktop config

Open File Explorer and paste the following into the address bar, then press **Enter**:
```
%APPDATA%\Claude
```

Open `claude_desktop_config.json` with Notepad. Add the `tallyprime` block below — substituting your two paths from above:

```json
{
  "mcpServers": {
    "tallyprime": {
      "command": "C:\\Program Files\\nodejs\\node.exe",
      "args": ["C:\\Users\\YourName\\Documents\\tallyprime-mcp-server\\mcpServer.js"]
    }
  }
}
```

> **Important:** Every backslash in a Windows path must be written as `\\` in the JSON file. A single `\` will break the config silently.

If the config already has other MCP servers, add `tallyprime` inside the existing `mcpServers` block — don't create a second one.

### Step 4 — Restart Claude Desktop

Close Claude Desktop completely (File → Exit) and reopen it. Click the tools icon — TallyPrime should appear in the list.

To confirm everything is working end-to-end, ask Claude:

> *"Is Tally running?"*

It will call `check_tally_status` and report back. If TallyPrime is open and the XML server is enabled, you'll get a confirmation with Tally's version info.

---

## Local Setup — Perplexity Desktop

Perplexity Desktop (Mac) supports local MCP with the same JSON config format as Claude Desktop. Refer to the [Perplexity MCP setup guide](https://www.perplexity.ai/help-center/en/articles/11502712-local-and-remote-mcps-for-perplexity) for the config file location, then paste the same JSON block from Step 3 above.

---

## HTTP Server Mode

For clients that can't run a local subprocess — **ChatGPT, Codex**, or any browser-based AI tool — you need to run the MCP server yourself and expose it over HTTP.

Start the server:

```cmd
npm start
```

This starts a Streamable HTTP server on port `3001`. Point your AI client to:

```
http://your-machine-ip:3001/mcp
```

For cloud-hosted access (so ChatGPT or Codex can reach it), you'll need to either deploy this server to a hosting provider or expose your local port securely using a tunnel tool like [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) or [ngrok](https://ngrok.com/).

---

## Tool Reference

24 tools across 7 categories. All tools return raw XML from TallyPrime — the AI parses and interprets this for you.

### System

| Tool | Description | Parameters |
|------|-------------|------------|
| `check_tally_status` | Pings Tally to confirm it is running. Call this first to verify connectivity before using any other tool. | — |
| `get_license_info` | Returns license details: plan type (Silver/Gold/Educational), serial number, account ID, admin email, data path. | — |

---

### Company & Context

| Tool | Description | Parameters |
|------|-------------|------------|
| `check_current_company` | Returns the name of the company currently active in Tally. | — |
| `list_companies` | Lists all companies available in TallyPrime. Use this to discover valid company names before any company-specific query. | — |
| `create_company` | **Write operation.** Creates a new company in TallyPrime. | `companyName`, `startingFrom` (YYYYMMDD), `booksFrom` (YYYYMMDD) |

---

### Master Data

| Tool | Description | Parameters |
|------|-------------|------------|
| `list_groups` | Returns all account groups (e.g. "Sundry Debtors", "Fixed Assets") with their parent group. Use to understand the chart-of-accounts hierarchy. | — |
| `list_accounts` | Returns the full chart of accounts — all groups and ledgers in hierarchy. Date range sets reporting period context but does not filter results. | `fromDate` (YYYYMMDD), `toDate` (YYYYMMDD) |
| `list_ledgers` | Returns all ledgers for a company including MasterID, parent group, and address. | `company` |
| `get_ledger` | Returns the master record for a single named ledger. Exact name match required. | `ledgerName` |
| `list_stock_items` | Returns all stock items with name, MasterID, and GUID. | — |

---

### Ledger Queries

| Tool | Description | Parameters |
|------|-------------|------------|
| `get_ledger_balance` | Returns balance and details for a named ledger over a date range. Scopes to a reporting period — use this for period-specific balances rather than static master data. | `ledgerName`, `fromDate` (YYYYMMDD), `toDate` (YYYYMMDD) |
| `fetch_bills_receivable` | Returns the Bills Receivable report — all outstanding customer invoices including bill reference, party, amount, and due date. | `company`, `fromDate` (DD-MMM-YYYY), `toDate` (DD-MMM-YYYY) |

---

### Vouchers — Collections

| Tool | Description | Parameters |
|------|-------------|------------|
| `fetch_sales_report` | Returns all Sales vouchers from the Voucher Register (equivalent to Sales Register in Tally). Includes buyer, line items, amounts, and tax entries. | `company`, `fromDate` (YYYYMMDD), `toDate` (YYYYMMDD) |
| `fetch_sales_group_vouchers` | Returns raw voucher collection data for all vouchers under the "Sales" account group. Use `fetch_sales_report` for the formatted register; use this for raw collection access. | `fromDate` (YYYYMMDD), `toDate` (YYYYMMDD) |
| `fetch_group_vouchers` | Returns all vouchers under the "Sales Accounts" parent group for a date range. | `fromDate` (YYYYMMDD), `toDate` (YYYYMMDD) |
| `fetch_vouchers_by_group` | Returns all vouchers whose parent account matches any group or ledger name you specify. The most flexible voucher collection tool — pass any account group name. | `accountGroup`, `fromDate` (YYYYMMDD), `toDate` (YYYYMMDD) |
| `fetch_vouchers_by_type` | Returns all vouchers of a specific type (e.g. "Sales", "Purchase", "Payment", "Receipt", "Journal"). Each row includes MasterID, voucher number, and date. | `company`, `voucherType`, `fromDate` (YYYYMMDD), `toDate` (YYYYMMDD) |

---

### Vouchers — Lookup

| Tool | Description | Parameters |
|------|-------------|------------|
| `get_voucher_by_master_id` | Fetches a single voucher by its internal MasterID. Returns all fields including ledger entries and narration. | `id`, `company` |
| `get_voucher_by_number` | Fetches a single voucher by its voucher number and date (e.g. "Sal/001", "01-Apr-2024"). | `voucherNumber`, `date` (DD-MMM-YYYY), `company` |
| `get_master_by_id` | Fetches any master record — stock item, ledger, group, or cost centre — by numeric MasterID. | `masterId` |

---

### Inventory

| Tool | Description | Parameters |
|------|-------------|------------|
| `fetch_stock_vouchers_summary` | Returns all vouchers (purchases, sales, journals, etc.) for a specific stock item by name. Shows full movement history of one item. | `stockItemName` |
| `fetch_stock_ageing` | Returns the Stock Ageing Analysis for a stock group and date range. Shows how long inventory batches have been held. | `stockGroupName`, `stockAgeFrom` (YYYYMMDD), `stockAgeTo` (YYYYMMDD) |

---

### HR & Payroll

| Tool | Description | Parameters |
|------|-------------|------------|
| `fetch_payslip` | Exports a payslip PDF for a named employee (Cost Centre) for a pay period. Employee name must match the Cost Centre name exactly as configured in Tally. | `employeeName`, `fromDate` (YYYYMMDD), `toDate` (YYYYMMDD) |
| `export_tally_report_pdf` | Exports any named TallyPrime report as PDF for a date range, optionally filtered by cost centre. Report name must be a valid Tally report identifier. | `reportName`, `fromDate` (YYYYMMDD), `toDate` (YYYYMMDD), `costCentreName` |

---

## Architecture

```
tallyprime-mcp-server/
├── mcpServer.js              # MCP server — stdio (default) and Streamable HTTP (--http)
├── index.js                  # CLI entry point (node index.js tools)
├── lib/
│   └── tools.js              # Discovers and loads all tool modules
├── tools/
│   ├── paths.js              # Registry — list of active tool file paths
│   └── tallyprime/
│       └── tally-xml/        # One file per tool, each exports an apiTool object
│           ├── test.js
│           ├── sales-report.js
│           └── ...           # 24 tools total
└── .env                      # TALLY_URL and TALLY_PORT
```

Each tool file in `tools/tallyprime/tally-xml/` exports a single `apiTool` object with two keys:

- `function` — async function that builds the XML payload, calls `TALLY_URL:TALLY_PORT`, and returns the response
- `definition` — the MCP tool schema (name, description, parameters) that the AI sees

To register or deregister a tool, edit `tools/paths.js`.

---

## Adding New Tools

1. Create a new file in `tools/tallyprime/tally-xml/` following the pattern of any existing tool
2. Export an `apiTool` object with `function` and `definition` keys
3. Add the file path to the array in `tools/paths.js`
4. Run `npm run list-tools` to confirm it loads correctly

Use `TALLY_URL` and `TALLY_PORT` from `process.env` — never hardcode the connection:

```js
const tallyURL = process.env.TALLY_URL || 'http://localhost';
const tallyPort = process.env.TALLY_PORT || '9000';
```

---

## Forking & Building On Top

This project is MIT licensed. You are free to fork it, extend it, and build commercial products on top of it.

**If you fork or build on this project, please:**
- Keep the credits section in your README attributing the original work to [Smeet Somaiya](https://github.com/smeetsomaiya)
- Star this repo if it was useful to you
- Consider opening a PR if you build a tool that would benefit others

---

## Contributing

Pull requests are welcome. Areas that would add the most value:

- **New tools** — purchase register, trial balance, P&L, balance sheet, GST reports, stock summary
- **Write operations** — creating/modifying vouchers, ledgers, and other masters
- **Response parsing** — a helper that converts Tally XML into clean JSON
- **Error handling** — better messages when Tally returns error envelopes

For significant changes, open an issue first to discuss the approach.

---

## Credits

**Original author:** [Smeet Somaiya](https://github.com/smeetsomaiya)

Initial tool scaffolding generated with the [Postman Agent Generator](https://postman.com/explore/agent-generator). All tools have been rewritten, fixed, and documented by hand for production use.

---

## License

MIT — see [LICENSE](LICENSE) for details.
