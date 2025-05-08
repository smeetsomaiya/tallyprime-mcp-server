/**
 * Function to send XML requests to Tally for exporting vouchers by type.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.fromDate - The start date for the voucher export.
 * @param {string} args.toDate - The end date for the voucher export.
 * @param {string} args.company - The name of the company for the export.
 * @returns {Promise<Object>} - The result of the voucher export request.
 */
const executeFunction = async ({ fromDate, toDate, company }) => {
  const TallyURL = 'http://localhost'; // Base URL for Tally
  const TallyPort = '9000'; // Port for Tally
  const xmlRequest = `
<ENVELOPE>
    <HEADER>
        <VERSION>1</VERSION>
        <TALLYREQUEST>Export</TALLYREQUEST>
        <TYPE>Data</TYPE>
        <ID>List Of Vouchers</ID>
    </HEADER>
    <BODY>
        <DESC>
            <STATICVARIABLES>
                <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                <SVCURRENTCOMPANY>${company}</SVCURRENTCOMPANY>
                <SVFROMDATE TYPE="Date">${fromDate}</SVFROMDATE>
                <SVTODATE TYPE="Date">${toDate}</SVTODATE>
            </STATICVARIABLES>
            <TDL>
                <TDLMESSAGE>
                    <REPORT ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="List Of Vouchers">
                        <FORMS>List Of Vouchers</FORMS>
                    </REPORT>
                    <FORM ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="List Of Vouchers">
                        <TOPPARTS>List Of Vouchers</TOPPARTS>
                        <XMLTAG>ListOfVouchers</XMLTAG>
                    </FORM>
                    <PART ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="List Of Vouchers">
                        <TOPLINES>List Of Vouchers</TOPLINES>
                        <REPEAT>List Of Vouchers : FormList Of Vouchers</REPEAT>
                        <SCROLLED>Vertical</SCROLLED>
                    </PART>
                    <LINE ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="List Of Vouchers">
                        <LEFTFIELDS>MASTERID</LEFTFIELDS>
                        <LEFTFIELDS>VoucherNumber</LEFTFIELDS>
                        <LEFTFIELDS>Date</LEFTFIELDS>
                    </LINE>
                    <FIELD ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="MASTERID">
                        <SET>$MASTERID</SET>
                        <XMLTAG>MASTERID</XMLTAG>
                    </FIELD>
                    <FIELD ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="VoucherNumber">
                        <SET>$VoucherNumber</SET>
                        <XMLTAG>VoucherNumber</XMLTAG>
                    </FIELD>
                    <FIELD ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="Date">
                        <SET>$Date</SET>
                        <XMLTAG>Date</XMLTAG>
                    </FIELD>
                    <COLLECTION ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No" NAME="FormList Of Vouchers">
                        <TYPE>Voucher</TYPE>
                        <FILTERS>VoucherType</FILTERS>
                    </COLLECTION>
                    <SYSTEM TYPE="Formulae" NAME="VoucherType">$VoucherTypeName = "Attendance"</SYSTEM>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>`;

  try {
    // Perform the fetch request
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
    console.error('Error exporting vouchers:', error);
    return { error: 'An error occurred while exporting vouchers.' };
  }
};

/**
 * Tool configuration for exporting vouchers by type from Tally.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'vouchersbytype',
      description: 'Export vouchers by type from Tally.',
      parameters: {
        type: 'object',
        properties: {
          fromDate: {
            type: 'string',
            description: 'The start date for the voucher export in YYYYMMDD format.'
          },
          toDate: {
            type: 'string',
            description: 'The end date for the voucher export in YYYYMMDD format.'
          },
          company: {
            type: 'string',
            description: 'The name of the company for the export.'
          }
        },
        required: ['fromDate', 'toDate', 'company']
      }
    }
  }
};

export { apiTool };