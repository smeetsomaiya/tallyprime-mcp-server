/**
 * Function to get a voucher from Tally based on voucher number and date.
 *
 * @param {Object} args - Arguments for the voucher request.
 * @param {string} args.voucherNumber - The voucher number to search for.
 * @param {string} args.date - The date of the voucher in 'DD-MMM-YYYY' format.
 * @param {string} [args.company="ABC Company"] - The company name for the request.
 * @returns {Promise<Object>} - The result of the voucher request.
 */
const executeFunction = async ({ voucherNumber, date, company = 'ABC Company' }) => {
  const TallyPort = '9000';
  const TallyURL = 'http://localhost';
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
      description: 'Get a voucher from Tally based on voucher number and date.',
      parameters: {
        type: 'object',
        properties: {
          voucherNumber: {
            type: 'string',
            description: 'The voucher number to search for.'
          },
          date: {
            type: 'string',
            description: 'The date of the voucher in DD-MMM-YYYY format.'
          },
          company: {
            type: 'string',
            description: 'The company name for the request.'
          }
        },
        required: ['voucherNumber', 'date']
      }
    }
  }
};

export { apiTool };