const executeFunction = async ({ companyName, startingFrom, booksFrom }) => {
  const tallyURL = process.env.TALLY_URL || 'http://localhost';
  const tallyPort = process.env.TALLY_PORT || '9000';
  const xmlRequest = `
<ENVELOPE>
  <HEADER>
    <VERSION>1</VERSION>
    <TALLYREQUEST>Import</TALLYREQUEST>
    <TYPE>Data</TYPE>
    <ID>All Masters</ID>
  </HEADER>
  <BODY>
    <DESC>
      <STATICVARIABLES />
    </DESC>
    <DATA>
      <TALLYMESSAGE>
        <COMPANY NAME="${companyName}" Action="Create">
          <NAME>${companyName}</NAME>
          <STARTINGFROM>${startingFrom}</STARTINGFROM>
          <BOOKSFROM>${booksFrom}</BOOKSFROM>
          <MAILINGNAME TYPE="String">INR</MAILINGNAME>
        </COMPANY>
      </TALLYMESSAGE>
    </DATA>
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
    console.error('Error creating company in Tally:', error);
    return { error: 'An error occurred while creating the company in Tally.' };
  }
};

const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_company',
      description: 'Creates a new company in TallyPrime by importing a company master record. This is a write operation — use with caution. Requires the company name, financial year start date, and books-from date. Returns Tally\'s acknowledgement XML on success.',
      parameters: {
        type: 'object',
        properties: {
          companyName: {
            type: 'string',
            description: 'Name for the new company (e.g. "Acme Pvt Ltd").',
          },
          startingFrom: {
            type: 'string',
            description: 'Financial year start date in YYYYMMDD format (e.g. "20240401").',
          },
          booksFrom: {
            type: 'string',
            description: 'Date from which books of accounts are maintained, in YYYYMMDD format.',
          },
        },
        required: ['companyName', 'startingFrom', 'booksFrom'],
      },
    },
  },
};

export { apiTool };