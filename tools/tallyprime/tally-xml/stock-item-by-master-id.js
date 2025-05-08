/**
 * Function to get voucher based on MasterID from Tally.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.Masterid - The MasterID to filter the voucher.
 * @returns {Promise<Object>} - The response from the Tally API.
 */
const executeFunction = async ({ Masterid }) => {
  const TallyURL = 'http://localhost'; // will be provided by the user
  const TallyPort = '9000'; // will be provided by the user
  const xmlRequest = `
<ENVELOPE>
  <HEADER>
    <VERSION>1</VERSION>
    <TALLYREQUEST>Export</TALLYREQUEST>
    <TYPE>Collection</TYPE>
    <ID>CustColl</ID>
  </HEADER>
  <BODY>
    <DESC>
      <STATICVARIABLES>
        <!-- * Static variables like scfrom,svto,svexport format will not work -->
      </STATICVARIABLES>
      <TDL>
        <TDLMESSAGE>
          <COLLECTION ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="CustColl">
            <TYPE>masters</TYPE>
            <!-- * will fetch all fields if you want specific fields you can specify -->
            <NATIVEMETHOD>*</NATIVEMETHOD>
            <FILTERS>filter</FILTERS>
          </COLLECTION>
          <!-- You can change filter to other than name also -->
          <!-- to get any Master based on name replace $Masterid with $Name -->
          <!-- Replace 1122 with Masterid you want to search -->
          <SYSTEM TYPE="Formulae" NAME="filter">$Masterid=${Masterid}</SYSTEM>
        </TDLMESSAGE>
      </TDL>
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
    console.error('Error fetching voucher by MasterID:', error);
    return { error: 'An error occurred while fetching the voucher.' };
  }
};

/**
 * Tool configuration for getting voucher based on MasterID from Tally.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'StockItem_ByMasterID',
      description: 'Gets Voucher Based on MasterID.',
      parameters: {
        type: 'object',
        properties: {
          Masterid: {
            type: 'string',
            description: 'The MasterID to filter the voucher.'
          }
        },
        required: ['Masterid']
      }
    }
  }
};

export { apiTool };