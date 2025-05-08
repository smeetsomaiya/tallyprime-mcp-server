/**
 * Function to fetch ledger vouchers from Tally.
 *
 * @param {Object} args - Arguments for the ledger voucher request.
 * @param {string} args.fromDate - The start date for the voucher period in YYYYMMDD format.
 * @param {string} args.toDate - The end date for the voucher period in YYYYMMDD format.
 * @param {string} args.company - The name of the company for which to fetch vouchers.
 * @returns {Promise<Object>} - The result of the ledger voucher fetch.
 */
const executeFunction = async ({ fromDate, toDate, company }) => {
  const TallyURL = 'http://localhost'; // will be provided by the user
  const TallyPort = '9000'; // will be provided by the user
  const xmlRequest = `
<ENVELOPE>
    <HEADER>
        <VERSION>1</VERSION>
        <TALLYREQUEST>Export</TALLYREQUEST>
        <TYPE>COLLECTION</TYPE>
        <ID>CustColl</ID>
    </HEADER>
    <BODY>
        <DESC>
            <STATICVARIABLES>
                <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
            </STATICVARIABLES>
            <TDL>
                <TDLMESSAGE>
                    <Function NAME="CustFunc">
                    </Function>
                    <COLLECTION ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="CustColl">
                        <TYPE>Group</TYPE>
                        <Childof>$$GroupCurrentAssets</Childof>
                        <FETCH>Name</FETCH>
                    </COLLECTION>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>`;
  
  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/xml'
    };

    // Perform the fetch request
    const response = await fetch(`${TallyURL}:${TallyPort}`, {
      method: 'POST',
      headers,
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
    console.error('Error fetching ledger vouchers:', error);
    return { error: 'An error occurred while fetching ledger vouchers.' };
  }
};

/**
 * Tool configuration for fetching ledger vouchers from Tally.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'fetch_ledger_vouchers',
      description: 'Fetches ledger vouchers from Tally.',
      parameters: {
        type: 'object',
        properties: {
          fromDate: {
            type: 'string',
            description: 'The start date for the voucher period in YYYYMMDD format.'
          },
          toDate: {
            type: 'string',
            description: 'The end date for the voucher period in YYYYMMDD format.'
          },
          company: {
            type: 'string',
            description: 'The name of the company for which to fetch vouchers.'
          }
        },
        required: ['fromDate', 'toDate', 'company']
      }
    }
  }
};

export { apiTool };