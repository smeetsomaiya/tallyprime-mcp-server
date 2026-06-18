const executeFunction = async () => {
  const tallyURL = process.env.TALLY_URL || 'http://localhost';
  const tallyPort = process.env.TALLY_PORT || '9000';
  const xmlData = `<ENVELOPE>
    <HEADER>
      <VERSION>1</VERSION>
      <TALLYREQUEST>Export</TALLYREQUEST>
      <TYPE>Collection</TYPE>
      <ID>List of Companies</ID>
    </HEADER>
    <BODY>
      <DESC>
        <STATICVARIABLES>
          <SVIsSimpleCompany>No</SVIsSimpleCompany>
        </STATICVARIABLES>
        <TDL>
          <TDLMESSAGE>
            <COLLECTION ISMODIFY="No" ISFIXED="No" ISINITIALIZE="Yes" ISOPTION="No" ISINTERNAL="No" NAME="List of Companies">
              <TYPE>Company</TYPE>
              <NATIVEMETHOD>Name</NATIVEMETHOD>
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
      body: xmlData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData);
    }

    return await response.text();
  } catch (error) {
    console.error('Error listing companies:', error);
    return { error: 'An error occurred while listing companies.' };
  }
};

const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_companies',
      description: 'Returns the names of all companies currently available in TallyPrime. Use this to discover valid company names before running any company-specific query. No parameters required.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
};

export { apiTool };