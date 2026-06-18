const executeFunction = async ({ employeeName, fromDate, toDate }) => {
  const tallyURL = process.env.TALLY_URL || 'http://localhost';
  const tallyPort = process.env.TALLY_PORT || '9000';
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
      description: 'Exports a payslip PDF for a named employee from TallyPrime\'s HR/Payroll module for a given pay period. The employee name must match the Cost Centre name exactly as configured in Tally. Returns the raw PDF export response from Tally.',
      parameters: {
        type: 'object',
        properties: {
          employeeName: {
            type: 'string',
            description: 'Exact Cost Centre name for the employee as defined in TallyPrime (e.g. "John Smith").',
          },
          fromDate: {
            type: 'string',
            description: 'Pay period start date in YYYYMMDD format (e.g. "20240401").',
          },
          toDate: {
            type: 'string',
            description: 'Pay period end date in YYYYMMDD format (e.g. "20240430").',
          },
        },
        required: ['employeeName'],
      }
    }
  }
};

export { apiTool };