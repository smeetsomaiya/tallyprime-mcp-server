/**
 * Function to get license information from Tally.
 *
 * @param {Object} args - Arguments for the license information request.
 * @returns {Promise<Object>} - The result of the license information request.
 */
const executeFunction = async () => {
  const TallyURL = 'http://localhost'; // will be provided by the user
  const TallyPort = '9000'; // will be provided by the user
  const xmlRequest = `
<ENVELOPE>
    <HEADER>
        <VERSION>1</VERSION>
        <TALLYREQUEST>Export</TALLYREQUEST>
        <TYPE>Collection</TYPE>
        <ID>LicenseInfo</ID>
    </HEADER>
    <BODY>
        <DESC>
            <STATICVARIABLES />
            <TDL>
                <TDLMESSAGE>
                    <OBJECT NAME="LicenseInfo">
                        <LOCALFORMULA>IsEducationalMode:  $$LicenseInfo:IsEducationalMode</LOCALFORMULA>
                        <LOCALFORMULA>IsSilver: $$LicenseInfo:IsSilver</LOCALFORMULA>
                        <LOCALFORMULA>IsGold: $$LicenseInfo:IsGold</LOCALFORMULA>
                        <LOCALFORMULA>PlanName: If $$LicenseInfo:IsEducationalMode Then "Educational Version" ELSE  If $$LicenseInfo:IsSilver Then "Silver" ELSE  If $$LicenseInfo:IsGold Then "Gold" else ""</LOCALFORMULA>
                        <LOCALFORMULA>SerialNumber: $$LicenseInfo:SerialNumber</LOCALFORMULA>
                        <LOCALFORMULA>AccountId:$$LicenseInfo:AccountID</LOCALFORMULA>
                        <LOCALFORMULA>IsIndian: $$LicenseInfo:IsIndian</LOCALFORMULA>
                        <LOCALFORMULA>RemoteSerialNumber: $$LicenseInfo:RemoteSerialNumber</LOCALFORMULA>
                        <LOCALFORMULA>IsRemoteAccessMode: $$LicenseInfo:IsRemoteAccessMode</LOCALFORMULA>
                        <LOCALFORMULA>IsLicClientMode: $$LicenseInfo:IsLicClientMode</LOCALFORMULA>
                        <LOCALFORMULA>AdminMailId:$$LicenseInfo:AdminEmailID</LOCALFORMULA>
                        <LOCALFORMULA>IsAdmin:$$LicenseInfo:IsAdmin</LOCALFORMULA>
                        <LOCALFORMULA>ApplicationPath:$$SysInfo:ApplicationPath</LOCALFORMULA>
                        <LOCALFORMULA>DataPath:##SVCurrentPath</LOCALFORMULA>
                        <LOCALFORMULA>UserLevel:$$cmpusername</LOCALFORMULA>
                    </OBJECT>
                    <COLLECTION NAME="LicenseInfo">
                        <OBJECTS>LicenseInfo</OBJECTS>
                    </COLLECTION>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>`;
  
  try {
    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/xml'
    };

    // Perform the fetch request
    const response = await fetch(`${TallyURL}:${TallyPort}`, {
      method: 'POST',
      headers,
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
    console.error('Error getting license information:', error);
    return { error: 'An error occurred while getting license information.' };
  }
};

/**
 * Tool configuration for getting license information from Tally.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_license_info',
      description: 'Get license information from Tally.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };