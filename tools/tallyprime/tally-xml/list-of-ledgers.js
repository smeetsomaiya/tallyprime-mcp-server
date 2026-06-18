const executeFunction = async ({ company }) => {
  const tallyURL = process.env.TALLY_URL || 'http://localhost';
  const tallyPort = process.env.TALLY_PORT || '9000';
  const xmlData = `<ENVELOPE>
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
          <SVCURRENTCOMPANY>${company}</SVCURRENTCOMPANY>
        </STATICVARIABLES>
        <TDL>
          <TDLMESSAGE>
            <COLLECTION ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="Ledgers">
              <TYPE>Ledger</TYPE>
              <NATIVEMETHOD>Address</NATIVEMETHOD>
              <NATIVEMETHOD>Masterid</NATIVEMETHOD>
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
    console.error('Error fetching ledgers:', error);
    return { error: 'An error occurred while fetching ledgers.' };
  }
};

/**
 * Tool configuration for listing ledgers from Tally.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_ledgers',
      description: 'Returns all ledgers defined for a company in TallyPrime, including address, MasterID, parent group, and all stored fields, in XML format. Use this to get the full list of ledger accounts for a company before fetching balances or vouchers.',
      parameters: {
        type: 'object',
        properties: {
          company: {
            type: 'string',
            description: 'Exact company name as it appears in TallyPrime (e.g. "ABC Enterprises").',
          },
        },
        required: ['company'],
      }
    }
  }
};

export { apiTool };