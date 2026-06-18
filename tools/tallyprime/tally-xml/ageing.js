const executeFunction = async ({ reportName, fromDate, toDate, costCentreName }) => {
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
      headers: { 'Content-Type': 'application/xml' },
      body: xmlRequest,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData);
    }

    return await response.text();
  } catch (error) {
    console.error('Error exporting Tally report:', error);
    return { error: 'An error occurred while exporting the Tally report.' };
  }
};

const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'export_tally_report_pdf',
      description: 'Exports any named TallyPrime report as PDF for a given date range, optionally filtered by cost centre (employee). The reportName must be a valid TallyPrime report identifier (e.g. "Ageing Analysis", "SelectiveEmployeePaySlip"). Returns the raw PDF export response from Tally.',
      parameters: {
        type: 'object',
        properties: {
          reportName: {
            type: 'string',
            description: 'TallyPrime report name to export (e.g. "Ageing Analysis", "SelectiveEmployeePaySlip").',
          },
          fromDate: {
            type: 'string',
            description: 'Period start date in YYYYMMDD format.',
          },
          toDate: {
            type: 'string',
            description: 'Period end date in YYYYMMDD format.',
          },
          costCentreName: {
            type: 'string',
            description: 'Cost centre name to filter by (e.g. employee name for payslips, or leave blank for company-wide reports).',
          },
        },
        required: ['reportName', 'fromDate', 'toDate', 'costCentreName'],
      },
    },
  },
};

export { apiTool };