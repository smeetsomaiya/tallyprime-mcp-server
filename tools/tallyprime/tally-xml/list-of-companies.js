/**
 * Function to list companies from Tally.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} [args.fromDate] - The starting date for the request in YYYYMMDD format.
 * @param {string} [args.toDate] - The ending date for the request in YYYYMMDD format.
 * @returns {Promise<Object>} - The result of the list companies request.
 */
const executeFunction = async ({ fromDate, toDate }) => {
  const TallyURL = 'http://localhost'; // will be provided by the user
  const TallyPort = '9000'; // will be provided by the user
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
            <ExportHeader>EmpId:5989</ExportHeader>
          </TDLMESSAGE>
        </TDL>
      </DESC>
    </BODY>
  </ENVELOPE>`;
  
  try {
    const response = await fetch(`${TallyURL}:${TallyPort}`, {
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
    console.error('Error listing companies:', error);
    return { error: 'An error occurred while listing companies.' };
  }
};

/**
 * Tool configuration for listing companies from Tally.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_companies',
      description: 'List companies from Tally.',
      parameters: {
        type: 'object',
        properties: {
          fromDate: {
            type: 'string',
            description: 'The starting date for the request in YYYYMMDD format.'
          },
          toDate: {
            type: 'string',
            description: 'The ending date for the request in YYYYMMDD format.'
          }
        }
      }
    }
  }
};

export { apiTool };