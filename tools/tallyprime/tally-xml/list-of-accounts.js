const executeFunction = async ({ fromDate, toDate }) => {
  const tallyURL = process.env.TALLY_URL || 'http://localhost';
  const tallyPort = process.env.TALLY_PORT || '9000';
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
      description: 'Returns the full chart of accounts (List of Accounts) from TallyPrime as XML, showing all groups and ledgers in their hierarchy. The date range sets the reporting period context but does not filter the list itself. Use YYYYMMDD format for dates (e.g. 20240401).',
      parameters: {
        type: 'object',
        properties: {
          fromDate: {
            type: 'string',
            description: 'Period start date in YYYYMMDD format (e.g. 20240401).',
          },
          toDate: {
            type: 'string',
            description: 'Period end date in YYYYMMDD format (e.g. 20250331).',
          },
        },
        required: ['fromDate', 'toDate'],
      }
    }
  }
};

export { apiTool };