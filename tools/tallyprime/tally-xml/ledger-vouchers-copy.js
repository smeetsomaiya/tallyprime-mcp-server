/**
 * Function to fetch ledger vouchers from Tally.
 *
 * @param {Object} args - Arguments for the ledger vouchers request.
 * @param {string} args.Fromdate - The start date for the vouchers.
 * @param {string} args.ToDate - The end date for the vouchers.
 * @param {string} args.Company - The name of the company for which to fetch vouchers.
 * @returns {Promise<Object>} - The result of the ledger vouchers request.
 */
const executeFunction = async ({ Fromdate, ToDate, Company }) => {
  const TallyURL = 'http://localhost'; // base URL for Tally
  const TallyPort = '9000'; // port for Tally
  const xmlRequest = `
<ENVELOPE>
  <HEADER>
    <VERSION>1</VERSION>
    <TALLYREQUEST>Export</TALLYREQUEST>
    <TYPE>Collection</TYPE>
    <ID>Vouchers</ID>
  </HEADER>
  <BODY>
    <DESC>
      <STATICVARIABLES>
        <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
        <SVViewName>Accounting Voucher View</SVViewName>
        <SVFROMDATE>${Fromdate}</SVFROMDATE>
        <SVTODATE TYPE="Date">${ToDate}</SVTODATE>
      </STATICVARIABLES>
      <TDL>
        <TDLMESSAGE>
          <COLLECTION ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="Vouchers">
            <TYPE>Vouchers</TYPE>
            <Childof>${Company}</Childof>
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
        'Content-Type': 'application/xml',
      },
      body: xmlRequest,
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
      description: 'Fetch ledger vouchers from Tally.',
      parameters: {
        type: 'object',
        properties: {
          Fromdate: {
            type: 'string',
            description: 'The start date for the vouchers.'
          },
          ToDate: {
            type: 'string',
            description: 'The end date for the vouchers.'
          },
          Company: {
            type: 'string',
            description: 'The name of the company for which to fetch vouchers.'
          }
        },
        required: ['Fromdate', 'ToDate', 'Company']
      }
    }
  }
};

export { apiTool };