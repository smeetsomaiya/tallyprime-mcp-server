/**
 * Function to get ledger information from Tally.
 *
 * @param {Object} args - Arguments for the ledger request.
 * @param {string} args.ledgerName - The name of the ledger to search for.
 * @returns {Promise<Object>} - The result of the ledger request.
 */
const executeFunction = async ({ ledgerName }) => {
  const TallyURL = 'http://localhost'; // Base URL for Tally
  const TallyPort = '9000'; // Port for Tally
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
    const response = await fetch(`${TallyURL}:${TallyPort}`, {
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
      description: 'Get ledger information from Tally based on ledger name.',
      parameters: {
        type: 'object',
        properties: {
          ledgerName: {
            type: 'string',
            description: 'The name of the ledger to search for.'
          }
        },
        required: ['ledgerName']
      }
    }
  }
};

export { apiTool };