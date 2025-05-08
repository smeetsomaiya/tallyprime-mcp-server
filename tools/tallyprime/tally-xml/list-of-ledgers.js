/**
 * Function to list ledgers from Tally.
 *
 * @param {Object} args - Arguments for the ledger request.
 * @param {string} args.company - The name of the company to fetch ledgers for.
 * @returns {Promise<Object>} - The result of the ledger request.
 */
const executeFunction = async ({ company }) => {
  const TallyURL = 'http://localhost'; // will be provided by the user
  const TallyPort = '9000'; // will be provided by the user
  const xmlData = `<ENVELOPE>
    <HEADER>
      <VERSION>1</VERSION>
      <TALLYREQUEST>Export</TALLYREQUEST>
      <TYPE>Collection</TYPE>
      <ID>Ledgers</ID>
    </HEADER>
    <BODY>
      <DESC>
        <STATICVARIABLES>
          <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
          <SVCURRENTCOMPANY>${company}</SVCURRENTCOMPANY>
        </STATICVARIABLES>
        <TDL>
          <TDLMESSAGE>
            <COLLECTION ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="Ledgers">
              <TYPE>Ledger</TYPE>
              <NATIVEMETHOD>Address</NATIVEMETHOD>
              <NATIVEMETHOD>Masterid</NATIVEMETHOD>
              <NATIVEMETHOD>*</NATIVEMETHOD>
            </COLLECTION>
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
      body: xmlData
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
    console.error('Error fetching ledgers:', error);
    return { error: 'An error occurred while fetching ledgers.' };
  }
};

/**
 * Tool configuration for listing ledgers from Tally.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_ledgers',
      description: 'Fetch a list of ledgers from Tally.',
      parameters: {
        type: 'object',
        properties: {
          company: {
            type: 'string',
            description: 'The name of the company to fetch ledgers for.'
          }
        },
        required: ['company']
      }
    }
  }
};

export { apiTool };