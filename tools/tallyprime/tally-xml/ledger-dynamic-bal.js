const executeFunction = async ({ fromDate, toDate, ledgerName }) => {
  const tallyURL = process.env.TALLY_URL || 'http://localhost';
  const tallyPort = process.env.TALLY_PORT || '9000';
  const xmlRequest = `
<ENVELOPE>
  <HEADER>
    <VERSION>1</VERSION>
    <TALLYREQUEST>Export</TALLYREQUEST>
    <TYPE>Collection</TYPE>
    <ID>Ledgers</ID>
  </HEADER>
  <BODY>
    <DESC>
      <STATICVARIABLES>
        <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
        <SVFROMDATE TYPE="Date">${fromDate}</SVFROMDATE>
        <SVTODATE TYPE="Date">${toDate}</SVTODATE>
      </STATICVARIABLES>
      <TDL>
        <TDLMESSAGE>
          <COLLECTION ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="Ledgers">
            <TYPE>Ledger</TYPE>
            <NATIVEMETHOD>Address</NATIVEMETHOD>
            <NATIVEMETHOD>*</NATIVEMETHOD>
            <FILTERS>Ledgerfilter</FILTERS>
          </COLLECTION>
          <SYSTEM TYPE="Formulae" NAME="Ledgerfilter">$Name="${ledgerName}"</SYSTEM>
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
    console.error('Error fetching ledger balance data:', error);
    return { error: 'An error occurred while fetching ledger balance data.' };
  }
};

const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_ledger_balance',
      description: 'Returns the balance and details for a named ledger over a given date range from TallyPrime, in XML format. Unlike get_ledger (which returns static master data), this query scopes to a reporting period and is suitable for computing period-specific balances.',
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
          ledgerName: {
            type: 'string',
            description: 'Exact name of the ledger as it appears in TallyPrime (e.g. "Cash", "Sundry Debtors").',
          },
        },
        required: ['fromDate', 'toDate', 'ledgerName'],
      },
    },
  },
};

export { apiTool };