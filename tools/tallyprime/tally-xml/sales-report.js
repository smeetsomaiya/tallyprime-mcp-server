const executeFunction = async ({ fromDate, toDate, company }) => {
  const tallyURL = process.env.TALLY_URL || 'http://localhost';
  const tallyPort = process.env.TALLY_PORT || '9000';
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
    const response = await fetch(`${tallyURL}:${tallyPort}`, {
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
      description: 'Returns all Sales vouchers from TallyPrime\'s Voucher Register for a given company and date range, in XML format. Equivalent to Gateway of Tally → Display → Account Books → Sales Register. Each voucher includes buyer details, line items, amounts, and tax entries.',
      parameters: {
        type: 'object',
        properties: {
          fromDate: {
            type: 'string',
            description: 'Period start date in YYYYMMDD format (e.g. "20240401").',
          },
          toDate: {
            type: 'string',
            description: 'Period end date in YYYYMMDD format (e.g. "20250331").',
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