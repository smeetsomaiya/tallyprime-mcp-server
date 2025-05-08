/**
 * Function to get a voucher based on MasterID from Tally.
 *
 * @param {Object} args - Arguments for the voucher request.
 * @param {string} args.id - The MasterID of the voucher to retrieve.
 * @returns {Promise<Object>} - The result of the voucher request.
 */
const executeFunction = async ({ id }) => {
  const TallyURL = 'http://localhost'; // will be provided by the user
  const TallyPort = '9000'; // will be provided by the user
  const company = 'ABC Company'; // will be provided by the user

  const xmlRequest = `
<ENVELOPE>
  <HEADER>
    <VERSION>1</VERSION>
    <TALLYREQUEST>EXPORT</TALLYREQUEST>
    <TYPE>Object</TYPE>
    <SUBTYPE>VOUCHER</SUBTYPE>
    <ID TYPE="Name">ID:'${id}'</ID>
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
    console.error('Error retrieving voucher:', error);
    return { error: 'An error occurred while retrieving the voucher.' };
  }
};

/**
 * Tool configuration for retrieving a voucher from Tally.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'Voucher_ByMasterID',
      description: 'Gets Voucher Based on MasterID from Tally.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The MasterID of the voucher to retrieve.'
          }
        },
        required: ['id']
      }
    }
  }
};

export { apiTool };