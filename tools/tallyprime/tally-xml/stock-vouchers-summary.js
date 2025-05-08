/**
 * Function to fetch Stock Vouchers Summary from Tally.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.stockItemName - The name of the stock item to filter the vouchers.
 * @returns {Promise<Object>} - The result of the Stock Vouchers Summary request.
 */
const executeFunction = async ({ stockItemName }) => {
  const TallyURL = 'http://localhost'; // will be provided by the user
  const TallyPort = '9000'; // will be provided by the user
  const xmlRequest = `
<ENVELOPE>
  <HEADER>
    <VERSION>1</VERSION>
    <TALLYREQUEST>Export</TALLYREQUEST>
    <TYPE>Data</TYPE>
    <ID>Stock Vouchers</ID>
  </HEADER>
  <BODY>
    <DESC>
      <STATICVARIABLES>
        <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
        <ExplodeVNum>Yes</ExplodeVNum>
        <EXPLODEFLAG>No</EXPLODEFLAG>
        <StockItemName>${stockItemName}</StockItemName>
      </STATICVARIABLES>
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
    console.error('Error fetching Stock Vouchers Summary:', error);
    return { error: 'An error occurred while fetching Stock Vouchers Summary.' };
  }
};

/**
 * Tool configuration for fetching Stock Vouchers Summary from Tally.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'fetch_stock_vouchers_summary',
      description: 'Fetches Stock Vouchers Summary from Tally.',
      parameters: {
        type: 'object',
        properties: {
          stockItemName: {
            type: 'string',
            description: 'The name of the stock item to filter the vouchers.'
          }
        },
        required: ['stockItemName']
      }
    }
  }
};

export { apiTool };