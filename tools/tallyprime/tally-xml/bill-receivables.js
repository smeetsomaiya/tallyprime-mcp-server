const executeFunction = async ({ fromDate, toDate, company }) => {
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
      description: 'Returns the Bills Receivable report for a company and date range in XML format. Lists all outstanding customer invoices not yet received/settled, including bill reference, party name, amount, and due date. Use date format DD-MMM-YYYY (e.g. "01-Apr-2024").',
      parameters: {
        type: 'object',
        properties: {
          fromDate: {
            type: 'string',
            description: 'Period start date in DD-MMM-YYYY format (e.g. "01-Apr-2024").',
          },
          toDate: {
            type: 'string',
            description: 'Period end date in DD-MMM-YYYY format (e.g. "31-Mar-2025").',
          },
          company: {
            type: 'string',
            description: 'Exact company name as it appears in TallyPrime.',
          },
        },
        required: ['fromDate', 'toDate', 'company'],
      }
    }
  }
};

export { apiTool };