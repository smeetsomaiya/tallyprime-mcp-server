/**
 * Function to get voucher data from Tally based on MasterID.
 *
 * @param {Object} args - Arguments for the voucher request.
 * @param {string} args.id - The MasterID of the voucher to fetch.
 * @returns {Promise<Object>} - The result of the voucher request.
 */
const executeFunction = async ({ id }) => {
  const TallyURL = 'http://localhost'; // will be provided by the user
  const TallyPort = '9000'; // will be provided by the user
  const requestData = `
<ENVELOPE>
\t<HEADER>
\t\t<VERSION>1</VERSION>
\t\t<TALLYREQUEST>EXPORT</TALLYREQUEST>
\t\t<TYPE>Object</TYPE>
\t\t<SUBTYPE>VOUCHER</SUBTYPE>
\t\t<ID TYPE="Name">ID:'${id}'</ID>
\t</HEADER>
\t<BODY>
\t\t<DESC>
\t\t\t<STATICVARIABLES>
\t\t\t<SVCURRENTCOMPANY>ABC Company</SVCURRENTCOMPANY>
\t\t\t\t<SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
\t\t\t\t<SVViewName>Accounting Voucher View</SVViewName>
\t\t\t</STATICVARIABLES>
\t\t\t<FETCHLIST>
\t\t\t\t<FETCH>*</FETCH>
\t\t\t</FETCHLIST>
\t\t</DESC>
\t</BODY>
</ENVELOPE>
  `;
  
  try {
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
    console.error('Error fetching voucher data:', error);
    return { error: 'An error occurred while fetching voucher data.' };
  }
};

/**
 * Tool configuration for fetching voucher data from Tally.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_voucher',
      description: 'Fetch voucher data from Tally based on MasterID.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The MasterID of the voucher to fetch.'
          }
        },
        required: ['id']
      }
    }
  }
};

export { apiTool };