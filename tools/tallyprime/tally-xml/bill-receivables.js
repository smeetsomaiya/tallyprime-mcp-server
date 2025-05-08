/**
 * Function to fetch Bills Receivable data from Tally.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.fromDate - The start date for the data export.
 * @param {string} args.toDate - The end date for the data export.
 * @param {string} args.company - The name of the company for which data is being fetched.
 * @returns {Promise<Object>} - The result of the data fetch from Tally.
 */
const executeFunction = async ({ fromDate, toDate, company }) => {
  const tallyURL = 'http://localhost'; // Base URL for Tally
  const tallyPort = '9000'; // Port for Tally
  const xmlRequest = `
<ENVELOPE>
    <HEADER>
        <TALLYREQUEST>Export Data</TALLYREQUEST>
    </HEADER>
    <BODY>
        <EXPORTDATA>
            <REQUESTDESC>
                <STATICVARIABLES>
                    <SVViewName>Accounting Voucher View</SVViewName>
                    <SVFROMDATE>${fromDate}</SVFROMDATE>
                    <SVTODATE>${toDate}</SVTODATE>
                    <SVEXPORTFORMAT>$$SysName:xml</SVEXPORTFORMAT>
                    <SVCURRENTCOMPANY>${company}</SVCURRENTCOMPANY>
                </STATICVARIABLES>
                <REPORTNAME>Bills Receivable</REPORTNAME>
            </REQUESTDESC>
        </EXPORTDATA>
    </BODY>
</ENVELOPE>`;
  
  try {
    // Perform the fetch request
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
    console.error('Error fetching Bills Receivable data:', error);
    return { error: 'An error occurred while fetching Bills Receivable data.' };
  }
};

/**
 * Tool configuration for fetching Bills Receivable data from Tally.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'fetch_bills_receivable',
      description: 'Fetch Bills Receivable data from Tally.',
      parameters: {
        type: 'object',
        properties: {
          fromDate: {
            type: 'string',
            description: 'The start date for the data export in format DD-MMM-YYYY.'
          },
          toDate: {
            type: 'string',
            description: 'The end date for the data export in format DD-MMM-YYYY.'
          },
          company: {
            type: 'string',
            description: 'The name of the company for which data is being fetched.'
          }
        },
        required: ['fromDate', 'toDate', 'company']
      }
    }
  }
};

export { apiTool };