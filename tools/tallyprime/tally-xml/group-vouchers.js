const executeFunction = async ({ fromDate, toDate }) => {
  const tallyURL = process.env.TALLY_URL || 'http://localhost';
  const tallyPort = process.env.TALLY_PORT || '9000';
  const xmlRequest = `<ENVELOPE>
    <HEADER>
      <VERSION>1</VERSION>
      <TALLYREQUEST>Export</TALLYREQUEST>
      <TYPE>Collection</TYPE>
      <ID>Vouchers</ID>
    </HEADER>
    <BODY>
      <DESC>
        <STATICVARIABLES>
          <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
          <SVViewName>Accounting Voucher View</SVViewName>
          <SVFROMDATE>${fromDate}</SVFROMDATE>
          <SVTODATE TYPE="Date">${toDate}</SVTODATE>
        </STATICVARIABLES>
        <TDL>
          <TDLMESSAGE>
            <COLLECTION ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="Vouchers">
              <TYPE> Vouchers : Group</TYPE>
              <Childof>Sales Accounts</Childof>
              <NATIVEMETHOD>*</NATIVEMETHOD>
            </COLLECTION>
          </TDLMESSAGE>
        </TDL>
      </DESC>
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
    console.error('Error fetching Sales Accounts group vouchers:', error);
    return { error: 'An error occurred while fetching Sales Accounts group vouchers.' };
  }
};

const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'fetch_group_vouchers',
      description: 'Returns all vouchers under the "Sales Accounts" account group for a given date range, in XML format. Fetches the full accounting voucher view for every transaction booked under any ledger that belongs to the Sales Accounts group.',
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
        },
        required: ['fromDate', 'toDate'],
      },
    },
  },
};

export { apiTool };