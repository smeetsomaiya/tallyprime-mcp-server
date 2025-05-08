/**
 * Function to fetch all Sales Vouchers for the current period from Tally.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.Fromdate - The start date for the vouchers in YYYYMMDD format.
 * @param {string} args.ToDate - The end date for the vouchers in YYYYMMDD format.
 * @param {string} args.Company - The name of the company for which to fetch vouchers.
 * @returns {Promise<Object>} - The response from the Tally API.
 */
const executeFunction = async ({ Fromdate, ToDate, Company }) => {
  const TallyURL = 'http://localhost'; // will be provided by the user
  const TallyPort = '9000'; // will be provided by the user
  const xmlRequest = `<ENVELOPE>
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
              <Childof>Sales</Childof>
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
    console.error('Error fetching vouchers:', error);
    return { error: 'An error occurred while fetching vouchers.' };
  }
};

/**
 * Tool configuration for fetching Sales Vouchers from Tally.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'fetch_sales_vouchers',
      description: 'Fetch all Sales Vouchers for the current period from Tally.',
      parameters: {
        type: 'object',
        properties: {
          Fromdate: {
            type: 'string',
            description: 'The start date for the vouchers in YYYYMMDD format.'
          },
          ToDate: {
            type: 'string',
            description: 'The end date for the vouchers in YYYYMMDD format.'
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