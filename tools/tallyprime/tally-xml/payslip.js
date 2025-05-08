/**
 * Function to fetch payslip data from Tally.
 *
 * @param {Object} args - Arguments for the payslip request.
 * @param {string} args.employeeName - The name of the employee for whom the payslip is requested.
 * @param {string} [args.fromDate] - The start date for the payslip data in YYYYMMDD format.
 * @param {string} [args.toDate] - The end date for the payslip data in YYYYMMDD format.
 * @returns {Promise<Object>} - The result of the payslip request.
 */
const executeFunction = async ({ employeeName, fromDate, toDate }) => {
  const TallyURL = 'http://localhost'; // will be provided by the user
  const TallyPort = '9000'; // will be provided by the user
  const xmlRequest = `
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Export Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <EXPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>SelectiveEmployeePaySlip</REPORTNAME>
        <STATICVARIABLES>
          <SVEXPORTFORMAT>$$SysName:pdf</SVEXPORTFORMAT>
          <SVFROMDATE>${fromDate || '20200801'}</SVFROMDATE>
          <SVTODATE>${toDate || '20210831'}</SVTODATE>
          <CostCentreName>${employeeName}</CostCentreName>
        </STATICVARIABLES>
      </REQUESTDESC>
    </EXPORTDATA>
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
    console.error('Error fetching payslip data:', error);
    return { error: 'An error occurred while fetching payslip data.' };
  }
};

/**
 * Tool configuration for fetching payslip data from Tally.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'fetch_payslip',
      description: 'Fetch payslip data for a specific employee from Tally.',
      parameters: {
        type: 'object',
        properties: {
          employeeName: {
            type: 'string',
            description: 'The name of the employee for whom the payslip is requested.'
          },
          fromDate: {
            type: 'string',
            description: 'The start date for the payslip data in YYYYMMDD format.'
          },
          toDate: {
            type: 'string',
            description: 'The end date for the payslip data in YYYYMMDD format.'
          }
        },
        required: ['employeeName']
      }
    }
  }
};

export { apiTool };