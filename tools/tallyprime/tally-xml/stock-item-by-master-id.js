const executeFunction = async ({ masterId }) => {
  const tallyURL = process.env.TALLY_URL || 'http://localhost';
  const tallyPort = process.env.TALLY_PORT || '9000';
  const xmlRequest = `
<ENVELOPE>
  <HEADER>
    <VERSION>1</VERSION>
    <TALLYREQUEST>Export</TALLYREQUEST>
    <TYPE>Collection</TYPE>
    <ID>CustColl</ID>
  </HEADER>
  <BODY>
    <DESC>
      <STATICVARIABLES />
      <TDL>
        <TDLMESSAGE>
          <COLLECTION ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="CustColl">
            <TYPE>masters</TYPE>
            <NATIVEMETHOD>*</NATIVEMETHOD>
            <FILTERS>filter</FILTERS>
          </COLLECTION>
          <SYSTEM TYPE="Formulae" NAME="filter">$Masterid=${masterId}</SYSTEM>
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
    console.error('Error fetching master record by MasterID:', error);
    return { error: 'An error occurred while fetching the master record.' };
  }
};

const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_master_by_id',
      description: 'Fetches any TallyPrime master record (stock item, ledger, group, cost centre, etc.) by its numeric MasterID, returning all fields in XML. Use this when you have a MasterID from a prior list or collection result and need the complete master record.',
      parameters: {
        type: 'object',
        properties: {
          masterId: {
            type: 'string',
            description: 'The numeric MasterID of the record to retrieve (e.g. "1122"). Obtain this from list_stock_items or list_ledgers.',
          },
        },
        required: ['masterId'],
      },
    },
  },
};

export { apiTool };