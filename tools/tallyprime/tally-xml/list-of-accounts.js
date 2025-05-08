/**
 * Function to fetch the list of accounts from Tally.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.fromDate - The start date for the data export in 'yymmdd' format.
 * @param {string} args.toDate - The end date for the data export in 'yymmdd' format.
 * @returns {Promise<Object>} - The response from the Tally API.
 */
const executeFunction = async ({ fromDate, toDate }) => {
  const TallyURL = 'http://localhost'; // will be provided by the user
  const TallyPort = '9000'; // will be provided by the user
  const xmlRequest = `
<ENVELOPE>
    <HEADER>
        <TALLYREQUEST>Export data</TALLYREQUEST>
    </HEADER>
    <BODY>
        <EXPORTDATA>
            <REQUESTDESC>
                <REPORTNAME>List of Accounts</REPORTNAME>
                <STATICVARIABLES>
                    <SVFROMDATE>${fromDate}</SVFROMDATE>
                    <SVTODATE>${toDate}</SVTODATE>
                    <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                </STATICVARIABLES>
            </REQUESTDESC>
        </EXPORTDATA>
    </BODY>
</ENVELOPE>`;

  try {
    // Set up the URL for the request
    const url = `${TallyURL}:${TallyPort}`;

    // Perform the fetch request
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
    console.error('Error fetching accounts from Tally:', error);
    return { error: 'An error occurred while fetching accounts from Tally.' };
  }
};

/**
 * Tool configuration for fetching the list of accounts from Tally.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_accounts',
      description: 'Fetch the list of accounts from Tally.',
      parameters: {
        type: 'object',
        properties: {
          fromDate: {
            type: 'string',
            description: 'The start date for the data export in yymmdd format.'
          },
          toDate: {
            type: 'string',
            description: 'The end date for the data export in yymmdd format.'
          }
        },
        required: ['fromDate', 'toDate']
      }
    }
  }
};

export { apiTool };