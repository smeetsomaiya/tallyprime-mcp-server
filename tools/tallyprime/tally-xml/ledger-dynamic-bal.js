/**
 * Function to get ledger data from Tally.
 *
 * @param {Object} args - Arguments for the ledger request.
 * @param {string} args.fromDate - The starting date for the ledger data.
 * @param {string} args.toDate - The ending date for the ledger data.
 * @param {string} args.company - The name of the company for which to fetch ledger data.
 * @returns {Promise<Object>} - The result of the ledger request.
 */
const executeFunction = async ({ fromDate, toDate, company }) => {
  const tallyURL = 'http://localhost'; // Base URL for Tally
  const tallyPort = '9000'; // Port for Tally
  const xmlRequest = `
<ENVELOPE>
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
        <SVFROMDATE TYPE="Date">${fromDate}</SVFROMDATE>
        <SVTODATE TYPE="Date">${toDate}</SVTODATE>
      </STATICVARIABLES>
      <TDL>
        <TDLMESSAGE>
          <COLLECTION ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="Ledgers">
            <TYPE>Ledger</TYPE>
            <NATIVEMETHOD>Address</NATIVEMETHOD>
            <NATIVEMETHOD>*</NATIVEMETHOD>
            <FILTERS>Ledgerfilter</FILTERS>
          </COLLECTION>
          <SYSTEM TYPE="Formulae" NAME="Ledgerfilter">$Name="${company}"</SYSTEM>
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
    console.error('Error fetching ledger data:', error);
    return { error: 'An error occurred while fetching ledger data.' };
  }
};

/**
 * Tool configuration for fetching ledger data from Tally.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'ledger_dynamic_bal',
      description: 'Fetch ledger data based on ledger name.',
      parameters: {
        type: 'object',
        properties: {
          fromDate: {
            type: 'string',
            description: 'The starting date for the ledger data.'
          },
          toDate: {
            type: 'string',
            description: 'The ending date for the ledger data.'
          },
          company: {
            type: 'string',
            description: 'The name of the company for which to fetch ledger data.'
          }
        },
        required: ['fromDate', 'toDate', 'company']
      }
    }
  }
};

export { apiTool };