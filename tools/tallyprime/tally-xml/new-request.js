/**
 * Function to send XML requests to Tally.
 *
 * @param {Object} args - Arguments for the Tally request.
 * @param {string} args.companyName - The name of the company to create in Tally.
 * @param {string} args.startingFrom - The starting date for the company.
 * @param {string} args.booksFrom - The date from which books are maintained.
 * @returns {Promise<Object>} - The response from the Tally server.
 */
const executeFunction = async ({ companyName, startingFrom, booksFrom }) => {
  const TallyURL = 'http://localhost'; // will be provided by the user
  const TallyPort = '9000'; // will be provided by the user
  const xmlRequest = `
<ENVELOPE>
  <HEADER>
    <VERSION>1</VERSION>
    <TALLYREQUEST>Import</TALLYREQUEST>
    <TYPE>Data</TYPE>
    <ID>All Masters</ID>
  </HEADER>
  <BODY>
    <DESC>
      <STATICVARIABLES />
    </DESC>
    <DATA>
      <TALLYMESSAGE>
        <COMPANY NAME="${companyName}" Action="Create">
          <NAME>${companyName}</NAME>
          <STARTINGFROM>${startingFrom}</STARTINGFROM>
          <BOOKSFROM>${booksFrom}</BOOKSFROM>
          <MAILINGNAME TYPE="String">INR</MAILINGNAME>
        </COMPANY>
      </TALLYMESSAGE>
    </DATA>
  </BODY>
</ENVELOPE>`;

  try {
    const url = `${TallyURL}:${TallyPort}`;
    
    // Perform the fetch request
    const response = await fetch(url, {
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
    console.error('Error sending request to Tally:', error);
    return { error: 'An error occurred while sending the request to Tally.' };
  }
};

/**
 * Tool configuration for sending XML requests to Tally.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'send_tally_request',
      description: 'Send XML requests to Tally for creating a company.',
      parameters: {
        type: 'object',
        properties: {
          companyName: {
            type: 'string',
            description: 'The name of the company to create in Tally.'
          },
          startingFrom: {
            type: 'string',
            description: 'The starting date for the company.'
          },
          booksFrom: {
            type: 'string',
            description: 'The date from which books are maintained.'
          }
        },
        required: ['companyName', 'startingFrom', 'booksFrom']
      }
    }
  }
};

export { apiTool };