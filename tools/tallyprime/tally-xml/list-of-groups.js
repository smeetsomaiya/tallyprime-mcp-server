/**
 * Function to list groups from Tally.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.fromDate - The start date for the data retrieval in YYYYMMDD format.
 * @param {string} args.toDate - The end date for the data retrieval in YYYYMMDD format.
 * @param {string} args.company - The name of the company to retrieve data for.
 * @returns {Promise<Object>} - The response from the Tally API.
 */
const executeFunction = async ({ fromDate, toDate, company }) => {
  const tallyURL = 'http://localhost'; // Assuming localhost for Tally
  const tallyPort = '9000'; // Default Tally port
  const xmlRequest = `
<ENVELOPE>
  <HEADER>
    <VERSION>1</VERSION>
    <TALLYREQUEST>Export</TALLYREQUEST>
    <TYPE>Collection</TYPE>
    <ID>Collection of Ledgers</ID>
  </HEADER>
  <BODY>
    <DESC>
      <TDL>
        <TDLMESSAGE>
          <OBJECT NAME="LicenseInfo" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
            <LOCALFORMULA>IsEducationalMode: $SV_LICENSE_TRIAL</LOCALFORMULA>
            <LOCALFORMULA>IsSilver: $SV_LICENSE_SILVER</LOCALFORMULA>
            <LOCALFORMULA>Folderpath:$SVCURRENTCOMPANY</LOCALFORMULA>
            <LOCALFORMULA>LicenseName:
              If $SV_LICENSE_TRIAL Then $$LocaleString:"Educational Version"  
              ELSE
              If $SV_LICENSE_SILVER Then $$LocaleString:"Silver" 
              ELSE
              If $SV_LICENSE_GOLD Then $$LocaleString:"Gold" 
              else ""</LOCALFORMULA>
          </OBJECT>
          <COLLECTION NAME="Collection of Ledgers" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
            <OBJECTS> LicenseInfo</OBJECTS>  
            <NATIVEMETHOD>IsEducationalMode</NATIVEMETHOD>
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
      body: xmlRequest
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
    console.error('Error fetching groups from Tally:', error);
    return { error: 'An error occurred while fetching groups from Tally.' };
  }
};

/**
 * Tool configuration for listing groups from Tally.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_groups',
      description: 'List groups from Tally.',
      parameters: {
        type: 'object',
        properties: {
          fromDate: {
            type: 'string',
            description: 'The start date for the data retrieval in YYYYMMDD format.'
          },
          toDate: {
            type: 'string',
            description: 'The end date for the data retrieval in YYYYMMDD format.'
          },
          company: {
            type: 'string',
            description: 'The name of the company to retrieve data for.'
          }
        },
        required: ['fromDate', 'toDate', 'company']
      }
    }
  }
};

export { apiTool };