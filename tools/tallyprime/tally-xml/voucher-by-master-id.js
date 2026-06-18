const executeFunction = async ({ id, company }) => {
  const tallyURL = process.env.TALLY_URL || 'http://localhost';
  const tallyPort = process.env.TALLY_PORT || '9000';
  const xmlRequest = `
<ENVELOPE>
  <HEADER>
    <VERSION>1</VERSION>
    <TALLYREQUEST>EXPORT</TALLYREQUEST>
    <TYPE>Object</TYPE>
    <SUBTYPE>VOUCHER</SUBTYPE>
    <ID TYPE="Name">ID:'${id}'</ID>
  </HEADER>
  <BODY>
    <DESC>
      <STATICVARIABLES>
        <SVCURRENTCOMPANY>${company}</SVCURRENTCOMPANY>
        <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
        <SVViewName>Accounting Voucher View</SVViewName>
      </STATICVARIABLES>
      <FETCHLIST>
        <FETCH>*</FETCH>
      </FETCHLIST>
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
    console.error('Error retrieving voucher by MasterID:', error);
    return { error: 'An error occurred while retrieving the voucher.' };
  }
};

const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_voucher_by_master_id',
      description: 'Fetches a single voucher from TallyPrime by its internal MasterID, returning all voucher fields in XML. Use this when you have a MasterID from a prior list or collection result. Returns the full accounting entry including ledger entries, amounts, and narration.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The numeric MasterID of the voucher (e.g. "12345"). Obtain this from list_vouchers or fetch_vouchers_by_type.',
          },
          company: {
            type: 'string',
            description: 'Exact company name as it appears in TallyPrime.',
          },
        },
        required: ['id', 'company'],
      },
    },
  },
};

export { apiTool };