/**
 * Function to check the current company in Tally.
 *
 * @param {Object} args - Arguments for the request.
 * @returns {Promise<Object>} - The response from the Tally server.
 */
const executeFunction = async () => {
  const TallyURL = 'http://localhost'; // will be provided by the user
  const TallyPort = '9000'; // will be provided by the user
  const requestBody = `
<ENVELOPE>
    <HEADER>
        <VERSION>1</VERSION>
        <TALLYREQUEST>Export</TALLYREQUEST>
        <TYPE>Collection</TYPE>
        <ID>CompanyInfo</ID>
    </HEADER>
    <BODY>
        <DESC>
            <STATICVARIABLES />
            <TDL>
                <TDLMESSAGE>
                    <OBJECT NAME="CurrentCompany">
                        <LOCALFORMULA>CurrentCompany:##SVCURRENTCOMPANY</LOCALFORMULA>
                    </OBJECT>
                    <COLLECTION NAME="CompanyInfo">
                        <OBJECTS>CurrentCompany</OBJECTS>
                    </COLLECTION>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>`;
  
  try {
    const url = `${TallyURL}:${TallyPort}`;
    
    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml'
      },
      body: requestBody
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
    console.error('Error checking current company in Tally:', error);
    return { error: 'An error occurred while checking the current company in Tally.' };
  }
};

/**
 * Tool configuration for checking the current company in Tally.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'check_current_company',
      description: 'Check the current company in Tally.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };