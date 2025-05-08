/**
 * Function to fetch stock ageing data from Tally.
 *
 * @param {Object} args - Arguments for the stock ageing request.
 * @param {string} args.stockGroupName - The name of the stock group to filter by.
 * @param {string} args.stockAgeFrom - The start date for stock ageing.
 * @param {string} args.stockAgeTo - The end date for stock ageing.
 * @returns {Promise<Object>} - The result of the stock ageing request.
 */
const executeFunction = async ({ stockGroupName, stockAgeFrom, stockAgeTo }) => {
  const TallyURL = 'http://localhost'; // will be provided by the user
  const TallyPort = '9000'; // will be provided by the user
  const xmlRequest = `
<ENVELOPE>
  <HEADER>
    <VERSION>1</VERSION>
    <TALLYREQUEST>Export</TALLYREQUEST>
    <TYPE>Data</TYPE>
    <ID>StockAgeing</ID>
  </HEADER>
  <BODY>
    <DESC>
      <STATICVARIABLES>
        <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
        <StockGroupName>${stockGroupName}</StockGroupName>
        <StockAgeFrom>${stockAgeFrom}</StockAgeFrom>
        <StockAgeTo>${stockAgeTo}</StockAgeTo>
      </STATICVARIABLES>
    </DESC>
  </BODY>
</ENVELOPE>`;

  try {
    const response = await fetch(`${TallyURL}:${TallyPort}`, {
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
    console.error('Error fetching stock ageing data:', error);
    return { error: 'An error occurred while fetching stock ageing data.' };
  }
};

/**
 * Tool configuration for fetching stock ageing data from Tally.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'fetch_stock_ageing',
      description: 'Fetch stock ageing data from Tally.',
      parameters: {
        type: 'object',
        properties: {
          stockGroupName: {
            type: 'string',
            description: 'The name of the stock group to filter by.'
          },
          stockAgeFrom: {
            type: 'string',
            description: 'The start date for stock ageing.'
          },
          stockAgeTo: {
            type: 'string',
            description: 'The end date for stock ageing.'
          }
        },
        required: ['stockGroupName', 'stockAgeFrom', 'stockAgeTo']
      }
    }
  }
};

export { apiTool };