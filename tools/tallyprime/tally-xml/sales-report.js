/**
 * Function to fetch sales report from Tally.
 *
 * @param {Object} args - Arguments for the sales report request.
 * @param {string} [args.fromDate] - The start date for the report in YYYYMMDD format.
 * @param {string} [args.toDate] - The end date for the report in YYYYMMDD format.
 * @param {string} [args.company] - The name of the company for which the report is generated.
 * @returns {Promise<Object>} - The result of the sales report request.
 */
const executeFunction = async ({ fromDate, toDate, company }) => {
  const TallyPort = '9000';
  const TallyURL = 'http://localhost';
  const xmlData = `
<ENVELOPE>
  <HEADER>
    <VERSION>1</VERSION>
    <TALLYREQUEST>EXPORT</TALLYREQUEST>
    <TYPE>DATA</TYPE>
    <ID>Voucher Register</ID>
  </HEADER>
  <BODY>
    <DESC>
      <STATICVARIABLES>
        <SVEXPORTFORMAT>$$SysName:xml</SVEXPORTFORMAT>
        <SVFROMDATE TYPE="DATE">${fromDate || '20200801'}</SVFROMDATE>
        <SVTODATE TYPE="DATE">${toDate || '20210831'}</SVTODATE>
        <SVCURRENTCOMPANY>${company || 'ABC Company'}</SVCURRENTCOMPANY>
        <VOUCHERTYPENAME TYPE="STRING">Sales</VOUCHERTYPENAME>
      </STATICVARIABLES>
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
    console.error('Error fetching sales report:', error);
    return { error: 'An error occurred while fetching the sales report.' };
  }
};

/**
 * Tool configuration for fetching sales report from Tally.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'fetch_sales_report',
      description: 'Fetches all Sales Vouchers for Current Period from Tally.',
      parameters: {
        type: 'object',
        properties: {
          fromDate: {
            type: 'string',
            description: 'The start date for the report in YYYYMMDD format.'
          },
          toDate: {
            type: 'string',
            description: 'The end date for the report in YYYYMMDD format.'
          },
          company: {
            type: 'string',
            description: 'The name of the company for which the report is generated.'
          }
        }
      }
    }
  }
};

export { apiTool };