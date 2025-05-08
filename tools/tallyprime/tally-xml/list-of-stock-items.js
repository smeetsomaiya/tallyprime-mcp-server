/**
 * Function to list stock items from Tally.
 *
 * @param {Object} args - Arguments for the stock items request.
 * @returns {Promise<Object>} - The result of the stock items request.
 */
const executeFunction = async () => {
  const TallyURL = 'http://localhost'; // will be provided by the user
  const TallyPort = '9000'; // will be provided by the user
  const requestData = `
<ENVELOPE>
    <HEADER>
        <VERSION>1</VERSION>
        <TALLYREQUEST>Export</TALLYREQUEST>
        <TYPE>Collection</TYPE>
        <ID>Custom List of StockItems</ID>
    </HEADER>
    <BODY>
        <DESC>
            <STATICVARIABLES />
            <TDL>
                <TDLMESSAGE>
                    <COLLECTION ISMODIFY="No" ISFIXED="No" ISINITIALIZE="Yes" ISOPTION="No" ISINTERNAL="No" NAME="Custom List of StockItems">
                        <TYPE>StockItem</TYPE>
                        <NATIVEMETHOD>MasterID</NATIVEMETHOD>
                        <NATIVEMETHOD>GUID</NATIVEMETHOD>
                    </COLLECTION>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>`;
  
  try {
    // Construct the URL
    const url = `${TallyURL}:${TallyPort}`;

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml'
      },
      body: requestData
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
    console.error('Error listing stock items:', error);
    return { error: 'An error occurred while listing stock items.' };
  }
};

/**
 * Tool configuration for listing stock items from Tally.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'list_stock_items',
      description: 'List stock items from Tally.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };