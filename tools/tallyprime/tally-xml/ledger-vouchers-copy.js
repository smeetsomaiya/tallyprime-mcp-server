const executeFunction = async ({ fromDate, toDate, accountGroup }) => {
  const tallyURL = process.env.TALLY_URL || 'http://localhost';
  const tallyPort = process.env.TALLY_PORT || '9000';
  const xmlRequest = `
<ENVELOPE>
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
            <TYPE>Vouchers</TYPE>
            <Childof>${accountGroup}</Childof>
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
    console.error('Error fetching vouchers by group:', error);
    return { error: 'An error occurred while fetching vouchers by account group.' };
  }
};

const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'fetch_vouchers_by_group',
      description: 'Returns all vouchers whose parent account matches the given group or ledger name (accountGroup), for a given date range, in XML format. Works for any account group — e.g. pass "Sundry Debtors" to get all sales-related vouchers, or "Bank Accounts" for bank transactions. Group name must match exactly as defined in TallyPrime.',
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
          accountGroup: {
            type: 'string',
            description: 'Exact name of the account group or ledger to filter by (e.g. "Sundry Debtors", "Sales Accounts", "Bank Accounts").',
          },
        },
        required: ['fromDate', 'toDate', 'accountGroup'],
      },
    },
  },
};

export { apiTool };