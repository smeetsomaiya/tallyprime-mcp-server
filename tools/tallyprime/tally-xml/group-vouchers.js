/**
 * Function to fetch group vouchers from Tally.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.Fromdate - The start date for the voucher export.
 * @param {string} args.ToDate - The end date for the voucher export.
 * @param {string} args.TallyURL - The base URL for the Tally server.
 * @param {number} args.TallyPort - The port number for the Tally server.
 * @returns {Promise<Object>} - The response from the Tally server.
 */
const executeFunction = async ({ Fromdate, ToDate, TallyURL, TallyPort }) => {
  const url = `${TallyURL}:${TallyPort}`;
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
              <TYPE> Vouchers : Group</TYPE>
              <Childof>Sales Accounts</Childof>
              <NATIVEMETHOD>*</NATIVEMETHOD>
            </COLLECTION>
          </TDLMESSAGE>
        </TDL>
      </DESC>
    </BODY>
  </ENVELOPE>`;

  try {
    const response = await fetch(url, {
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
    console.error('Error fetching group vouchers:', error);
    return { error: 'An error occurred while fetching group vouchers.' };
  }
};

/**
 * Tool configuration for fetching group vouchers from Tally.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'fetch_group_vouchers',
      description: 'Fetch all Sales Vouchers for the current period from Tally.',
      parameters: {
        type: 'object',
        properties: {
          Fromdate: {
            type: 'string',
            description: 'The start date for the voucher export.'
          },
          ToDate: {
            type: 'string',
            description: 'The end date for the voucher export.'
          },
          TallyURL: {
            type: 'string',
            description: 'The base URL for the Tally server.'
          },
          TallyPort: {
            type: 'number',
            description: 'The port number for the Tally server.'
          }
        },
        required: ['Fromdate', 'ToDate', 'TallyURL', 'TallyPort']
      }
    }
  }
};

export { apiTool };