const executeFunction = async ({ ledgerName }) => {
  const tallyURL = process.env.TALLY_URL || 'http://localhost';
  const tallyPort = process.env.TALLY_PORT || '9000';
  const xmlRequest = `<ENVELOPE>
    <HEADER>
      <VERSION>1</VERSION>
      <TALLYREQUEST>Export</TALLYREQUEST>
      <TYPE>Collection</TYPE>
      <ID>Ledgers</ID>
    </HEADER>
    <BODY>
      <DESC>
        <STATICVARIABLES>
        </STATICVARIABLES>
        <TDL>
          <TDLMESSAGE>
            <COLLECTION ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="Ledgers">
              <TYPE>masters</TYPE>
              <NATIVEMETHOD>Address</NATIVEMETHOD>
              <NATIVEMETHOD>*</NATIVEMETHOD>
              <FILTERS>Ledgerfilter</FILTERS>
            </COLLECTION>
            <SYSTEM TYPE="Formulae" NAME="Ledgerfilter">$Name="${ledgerName}"</SYSTEM>
          </TDLMESSAGE>
        </TDL>
      </DESC>
    </BODY>
  </ENVELOPE>`;
  
  try {
    const response = await fetch(`${tallyURL}:${tallyPort}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml'
      },
      body: xmlRequest
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const data = await response.text();
    return data;
  } catch (error) {
    console.error('Error fetching ledger information:', error);
    return { error: 'An error occurred while fetching ledger information.' };
  }
};

/**
 * Tool configuration for getting ledger information from Tally.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_ledger',
      description: 'Returns the master record for a single named ledger from TallyPrime, including address, parent group, opening balance, and all stored fields. Performs an exact name match — the ledger name must match exactly as it appears in Tally.',
      parameters: {
        type: 'object',
        properties: {
          ledgerName: {
            type: 'string',
            description: 'Exact name of the ledger as it appears in TallyPrime (e.g. "Cash", "State Bank of India").',
          },
        },
        required: ['ledgerName'],
      }
    }
  }
};

export { apiTool };