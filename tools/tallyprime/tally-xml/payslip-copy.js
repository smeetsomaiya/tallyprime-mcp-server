/**
 * Function to send a request to Tally for fetching payslip data.
 *
 * @param {Object} args - Arguments for the payslip request.
 * @param {string} args.fromDate - The start date for the data export.
 * @param {string} args.toDate - The end date for the data export.
 * @returns {Promise<Object>} - The response from the Tally server.
 */
const executeFunction = async ({ fromDate, toDate }) => {
  const TallyURL = 'http://localhost'; // Base URL for Tally
  const TallyPort = '9000'; // Port for Tally
  const requestBody = `
    <ENVELOPE>
      <HEADER>
        <VERSION>1</VERSION>
        <TALLYREQUEST>Export</TALLYREQUEST>
        <TYPE>Data</TYPE>
        <ID>HostController</ID>
      </HEADER>
      <BODY>
        <DESC>
          <STATICVARIABLES>
            <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
            <SVFROMDATE>${fromDate}</SVFROMDATE>
            <SVTODATE>${toDate}</SVTODATE>
          </STATICVARIABLES>
          <TDL>
            <TDLMESSAGE>
              <REPORT Name="HostController">
                <FORM>HostController</FORM>
              </REPORT>
              <FORM Name="HostController">
                <PART>HostController</PART>
              </FORM>
              <PART Name="HostController">
                <LINE>HostController</LINE>
                <SCROLLED>Vertical</SCROLLED>
              </PART>
              <LINE Name="HostController">
                <FIELD>NameField</FIELD>
                <LOCAL>Field:Name Field:setas:$$TriggerReportExport</LOCAL>
              </LINE>
              <FUNCTION Name="TriggerReportExport">
                <ACTION>02:SET:SvExportFormat:$$SysName:pdf</ACTION>
                <ACTION>03:SET:SvPrintFileName:test.pdf</ACTION>
                <ACTION>04:SET:SVOpenFileAfterExport:No</ACTION>
                <ACTION>05:EXPORT REPORT:TargetPayslip:True</ACTION>
                <ACTION>06:Return:"Process Completed"</ACTION>
              </FUNCTION>
              <REPORT Name="TargetPayslip">
                <USE>SelectiveEmployeePaySlip</USE>
              </REPORT>
            </TDLMESSAGE>
          </TDL>
        </DESC>
      </BODY>
    </ENVELOPE>
  `;

  try {
    const response = await fetch(`${TallyURL}:${TallyPort}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml'
      },
      body: requestBody
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
      name: 'fetch_payslip_data',
      description: 'Fetch payslip data from Tally.',
      parameters: {
        type: 'object',
        properties: {
          fromDate: {
            type: 'string',
            description: 'The start date for the data export in format YYYYMMDD.'
          },
          toDate: {
            type: 'string',
            description: 'The end date for the data export in format YYYYMMDD.'
          }
        },
        required: ['fromDate', 'toDate']
      }
    }
  }
};

export { apiTool };