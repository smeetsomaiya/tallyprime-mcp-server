const executeFunction = async ({ stockGroupName, stockAgeFrom, stockAgeTo }) => {
  const tallyURL = process.env.TALLY_URL || 'http://localhost';
  const tallyPort = process.env.TALLY_PORT || '9000';
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
      description: 'Returns the Stock Ageing Analysis from TallyPrime for a given stock group and date range, in XML format. Shows how long inventory batches have been held, useful for identifying slow-moving or expired stock. The stock group name must match exactly as defined in Tally.',
      parameters: {
        type: 'object',
        properties: {
          stockGroupName: {
            type: 'string',
            description: 'Exact name of the stock group to analyse (e.g. "Primary", "Finished Goods").',
          },
          stockAgeFrom: {
            type: 'string',
            description: 'Ageing period start date in YYYYMMDD format.',
          },
          stockAgeTo: {
            type: 'string',
            description: 'Ageing period end date in YYYYMMDD format.',
          },
        },
        required: ['stockGroupName', 'stockAgeFrom', 'stockAgeTo'],
      }
    }
  }
};

export { apiTool };