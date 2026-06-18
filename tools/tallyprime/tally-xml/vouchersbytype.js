const executeFunction = async ({ fromDate, toDate, company, voucherType }) => {
  const tallyURL = process.env.TALLY_URL || 'http://localhost';
  const tallyPort = process.env.TALLY_PORT || '9000';
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
                    <SYSTEM TYPE="Formulae" NAME="VoucherType">$VoucherTypeName = "${voucherType}"</SYSTEM>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>`;

  try {
    const response = await fetch(`${tallyURL}:${tallyPort}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: xmlRequest,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData);
    }

    return await response.text();
  } catch (error) {
    console.error('Error fetching vouchers by type:', error);
    return { error: 'An error occurred while fetching vouchers by type.' };
  }
};

const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'fetch_vouchers_by_type',
      description: 'Returns all vouchers of a specific type for a company and date range, in XML format. Each row includes MasterID, voucher number, and date. Common voucher types: "Sales", "Purchase", "Payment", "Receipt", "Journal", "Contra", "Attendance". The voucherType must match exactly as defined in TallyPrime.',
      parameters: {
        type: 'object',
        properties: {
          fromDate: {
            type: 'string',
            description: 'Period start date in YYYYMMDD format (e.g. "20240401").',
          },
          toDate: {
            type: 'string',
            description: 'Period end date in YYYYMMDD format (e.g. "20250331").',
          },
          company: {
            type: 'string',
            description: 'Exact company name as it appears in TallyPrime.',
          },
          voucherType: {
            type: 'string',
            description: 'Voucher type name exactly as defined in TallyPrime (e.g. "Sales", "Purchase", "Payment", "Receipt", "Attendance").',
          },
        },
        required: ['fromDate', 'toDate', 'company', 'voucherType'],
      },
    },
  },
};

export { apiTool };