const executeFunction = async ({ voucherNumber, date, company }) => {
  const tallyURL = process.env.TALLY_URL || 'http://localhost';
  const tallyPort = process.env.TALLY_PORT || '9000';
  const xmlRequest = `<ENVELOPE>
    <HEADER>
      <VERSION>1</VERSION>
      <TALLYREQUEST>EXPORT</TALLYREQUEST>
      <TYPE>Object</TYPE>
      <SUBTYPE>VOUCHER</SUBTYPE>
      <ID TYPE="Name">Date:'${date}':VoucherNumber:'${voucherNumber}'</ID>
    </HEADER>
    <BODY>
      <DESC>
        <STATICVARIABLES>
          <SVCURRENTCOMPANY>${company}</SVCURRENTCOMPANY>
          <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
          <SVViewName>Accounting Voucher View</SVViewName>
        </STATICVARIABLES>
        <FETCHLIST>
          <FETCH>*</FETCH>
        </FETCHLIST>
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
    console.error('Error fetching voucher:', error);
    return { error: 'An error occurred while fetching the voucher.' };
  }
};

/**
 * Tool configuration for getting a voucher from Tally.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_voucher_by_number',
      description: 'Fetches a single voucher from TallyPrime by its voucher number and date, returning all fields in XML. Use this when you have the voucher number (e.g. "Sal/001") from a report output. Date must be in DD-MMM-YYYY format (e.g. "01-Apr-2024").',
      parameters: {
        type: 'object',
        properties: {
          voucherNumber: {
            type: 'string',
            description: 'Voucher number as it appears in TallyPrime (e.g. "Sal/001", "PUR/0042").',
          },
          date: {
            type: 'string',
            description: 'Voucher date in DD-MMM-YYYY format (e.g. "01-Apr-2024").',
          },
          company: {
            type: 'string',
            description: 'Exact company name as it appears in TallyPrime.',
          },
        },
        required: ['voucherNumber', 'date', 'company'],
      }
    }
  }
};

export { apiTool };