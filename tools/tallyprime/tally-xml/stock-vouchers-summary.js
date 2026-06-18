const executeFunction = async ({ stockItemName }) => {
  const tallyURL = process.env.TALLY_URL || 'http://localhost';
  const tallyPort = process.env.TALLY_PORT || '9000';
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
    const response = await fetch(`${tallyURL}:${tallyPort}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: xmlRequest,
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
      description: 'Returns a summary of all stock vouchers (purchases, sales, journals, etc.) for a specific inventory item by exact name, in XML format. Shows the full movement history of a single stock item across all voucher types.',
      parameters: {
        type: 'object',
        properties: {
          stockItemName: {
            type: 'string',
            description: 'Exact name of the stock item as it appears in TallyPrime.',
          },
        },
        required: ['stockItemName'],
      }
    }
  }
};

export { apiTool };