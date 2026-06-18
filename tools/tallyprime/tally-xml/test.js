const executeFunction = async () => {
  const tallyURL = process.env.TALLY_URL || 'http://localhost';
  const tallyPort = process.env.TALLY_PORT || '9000';
  try {
    const response = await fetch(`${tallyURL}:${tallyPort}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData);
    }

    return await response.text();
  } catch (error) {
    console.error('Error checking Tally status:', error);
    return { error: 'Tally is not reachable. Ensure TallyPrime is running and the XML server is enabled on the configured port.' };
  }
};

const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'check_tally_status',
      description: 'Pings the TallyPrime XML server to verify it is running and reachable. Call this first before any other tool to confirm connectivity. Returns Tally version and server info on success, or a connection error if Tally is not running.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
};

export { apiTool };