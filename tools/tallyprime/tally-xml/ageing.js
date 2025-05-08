/**
 * Function to send a request to Tally for exporting data.
 *
 * @param {Object} args - Arguments for the Tally request.
 * @param {string} args.reportName - The name of the report to export.
 * @param {string} args.fromDate - The start date for the export.
 * @param {string} args.toDate - The end date for the export.
 * @param {string} args.costCentreName - The name of the cost centre (employee) to filter by.
 * @returns {Promise<Object>} - The response from the Tally server.
 */
const executeFunction = async ({ reportName, fromDate, toDate, costCentreName }) => {
  const tallyURL = 'http://localhost'; // will be provided by the user
  const tallyPort = '9000'; // will be provided by the user
  const xmlRequest = `
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Export Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <EXPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>${reportName}</REPORTNAME>
        <STATICVARIABLES>
          <SVEXPORTFORMAT>$$SysName:pdf</SVEXPORTFORMAT>
          <SVFROMDATE>${fromDate}</SVFROMDATE>
          <SVTODATE>${toDate}</SVTODATE>
          <CostCentreName>${costCentreName}</CostCentreName>
        </STATICVARIABLES>
      </REQUESTDESC>
    </EXPORTDATA>
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
    console.error('Error sending request to Tally:', error);
    return { error: 'An error occurred while sending the request to Tally.' };
  }
};

/**
 * Tool configuration for sending requests to Tally.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'send_tally_request',
      description: 'Send a request to Tally for exporting data.',
      parameters: {
        type: 'object',
        properties: {
          reportName: {
            type: 'string',
            description: 'The name of the report to export.'
          },
          fromDate: {
            type: 'string',
            description: 'The start date for the export.'
          },
          toDate: {
            type: 'string',
            description: 'The end date for the export.'
          },
          costCentreName: {
            type: 'string',
            description: 'The name of the cost centre (employee) to filter by.'
          }
        },
        required: ['reportName', 'fromDate', 'toDate', 'costCentreName']
      }
    }
  }
};

export { apiTool };