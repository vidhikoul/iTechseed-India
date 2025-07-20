import { Card, CardContent } from './card';
import { Download } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./Challan.css";

const Challan = () => {
  // PDF generation function - now takes an ID parameter to identify which challan to download
  const handleDownloadPDF = (challanId) => {
    const input = document.getElementById(challanId);
    
    // Set specific dimensions to match A4 size
    const a4Width = 210; // A4 width in mm
    const a4Height = 297; // A4 height in mm
    
    html2canvas(input, {
      scale: 2,         // Higher scale for better quality
      useCORS: true,    // Enable cross-origin images
      logging: false,   // Disable logging
      letterRendering: true, // Improve text rendering
      allowTaint: true  // Allow tainted canvas if needed
    }).then((canvas) => {
      // Create new PDF with A4 dimensions (portrait)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      // Get canvas aspect ratio
      const canvasAspectRatio = canvas.height / canvas.width;
      
      // Calculate dimensions to fit content properly on A4
      const imgWidth = a4Width - 20; // Leave some margin
      const imgHeight = imgWidth * canvasAspectRatio;
      
      // Center the content on the page
      const posX = 10; // 10mm margin from left
      const posY = 10; // 10mm margin from top
      
      // Add the image with proper positioning
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        posX,
        posY,
        imgWidth,
        imgHeight,
        undefined,
        'FAST' // Use fast compression
      );
      
      // Determine file name based on challan type
      let fileName = "transaction_challan.pdf";
      if (challanId === "challan-content-original") {
        fileName = "transaction_challan_original.pdf";
      } else if (challanId === "challan-content-duplicate") {
        fileName = "transaction_challan_duplicate.pdf";
      } else if (challanId === "challan-content-triplicate") {
        fileName = "transaction_challan_triplicate.pdf";
      }
      
      pdf.save(fileName);
    });
  };

  // Function to create a challan component with specified type
  const createChallan = (type, id, title) => {
    return (
      <Card className="p-4 shadow-lg border rounded-md relative mb-8" style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header with Title and Download Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <Download onClick={() => handleDownloadPDF(id)} className="w-6 h-6 cursor-pointer" />
        </div>
        
        {/* Challan Content - Styled to match reference image */}
        <div id={id} style={{ width: "100%", border: "1px solid #000" }}>
          {/* Header Row - Two Columns: Left for Dana Logo, Right for Address & Heading */}
          <div style={{ display: "flex", borderBottom: "1px solid #000" }}>
            {/* Left Column - Dana Logo */}
            <div style={{ width: "40%", textAlign: "center", padding: "15px", borderRight: "1px solid #000", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <img
                src="Danalogo.png"
                alt="Dana Logo"
                style={{ width: "100%", maxHeight: "100px", objectFit: "contain" }}
              />
            </div>
            {/* Right Column - Company Address with Original for Buyer at top */}
            <div style={{ width: "60%", textAlign: "center", padding: "10px" }}>
              <div style={{ fontSize: "12px", marginBottom: "5px" }}>{type}</div>
              <div style={{ fontSize: "16px", fontWeight: "bold" }}>DANA INDIA PRIVATE LIMITED</div>
              <div style={{ fontSize: "11px", margin: "5px 0" }}>
                VILLAGE BHAMBOLI, TALUKA - KHED, PUNE, MAHARASHTRA GAT NO. 51/1,<br />
                51/2, 51/3, 52, 53-54, 56, 57, 58, 59 Pune 410501 Maharashtra India<br />
                CIN No. :U74999PN2000PTC015131 PAN No. :AABCD1873A
              </div>
            </div>
          </div>
          
          {/* Separate row for "Delivery Challan" heading */}
          <div style={{ borderBottom: "1px solid #000", padding: "8px", textAlign: "center" }}>
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>Delivery Challan</div>
          </div>

          {/* Vendor & Challan Info - Two column layout */}
          <div style={{ display: "flex", borderBottom: "1px solid #000" }}>
            {/* Left Column - Vendor Info */}
            <div style={{ width: "50%", padding: "10px", borderRight: "1px solid #000", fontSize: "12px" }}>
              <div style={{ fontWeight: "bold" }}>Vendor 202758</div>
              <div>John Deere India Private Limit</div>
              <div>Gat no.166-167 and 271-291 Sanasw</div>
              <div>Pune-412208</div>
              <div>412208</div>
              <div>GSTIN No. :</div>
              <div>PAN No. :AAACJ4233B</div>
            </div>
            {/* Right Column - Challan Details */}
            <div style={{ verticalAlign: "top", width: "50%", padding: "10px", fontSize: "12px" }}>
              <div style={{ fontSize: "12px" }}>
                <strong>Challan No.</strong> :4954628378
              </div>
              <div style={{ fontSize: "12px" }}>
                <strong>Challan Date</strong> :14.03.2025
              </div>
              <div style={{ fontSize: "12px" }}>
                <strong>Vechicle No</strong> :
              </div>
              <div style={{ fontSize: "12px" }}>
                <strong>Transporter</strong> :
              </div>
              <div style={{ fontSize: "12px" }}>
                <strong>Emp. Code</strong> :1302775
              </div>
              <div style={{ fontSize: "12px" }}>
                <strong>Name</strong> :Mr. RASKAR MAYUR ASHOK
              </div>
            </div>
          </div>

          {/* Main Items Table - Removed "Tax Rates" title and fixed structure */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #000", padding: "4px", textAlign: "center", fontWeight: "bold" }} rowSpan="2">Sr No</th>
                <th style={{ border: "1px solid #000", padding: "4px", textAlign: "center", fontWeight: "bold" }} rowSpan="2">Material Code</th>
                <th style={{ border: "1px solid #000", padding: "4px", textAlign: "center", fontWeight: "bold" }} rowSpan="2">Material Description</th>
                <th style={{ border: "1px solid #000", padding: "4px", textAlign: "center", fontWeight: "bold" }} rowSpan="2">HSN Code</th>
                <th style={{ border: "1px solid #000", padding: "4px", textAlign: "center", fontWeight: "bold" }} rowSpan="2">Unit</th>
                <th style={{ border: "1px solid #000", padding: "4px", textAlign: "center", fontWeight: "bold" }} rowSpan="2">Qty</th>
                <th style={{ border: "1px solid #000", padding: "4px", textAlign: "center", fontWeight: "bold" }} rowSpan="2">Expected Return Date</th>
                <th style={{ border: "1px solid #000", padding: "4px", textAlign: "center", fontWeight: "bold" }} rowSpan="2">Taxable Amount</th>
                <th style={{ border: "1px solid #000", padding: "4px", textAlign: "center", fontWeight: "bold" }}>CGST Rate</th>
                <th style={{ border: "1px solid #000", padding: "4px", textAlign: "center", fontWeight: "bold" }}>SGST Rate</th>
                <th style={{ border: "1px solid #000", padding: "4px", textAlign: "center", fontWeight: "bold" }}>IGST Rate</th>
              </tr>
              <tr>
                <th style={{ border: "1px solid #000", padding: "4px", textAlign: "center", fontWeight: "bold" }}>Amount</th>
                <th style={{ border: "1px solid #000", padding: "4px", textAlign: "center", fontWeight: "bold" }}>Amount</th>
                <th style={{ border: "1px solid #000", padding: "4px", textAlign: "center", fontWeight: "bold" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {/* First Item */}
              <tr>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }} rowSpan="2">01</td>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }} rowSpan="2">NVFB101010497</td>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }} rowSpan="2">JD 2WD 4 AXLE PALLET</td>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }} rowSpan="2">73089090</td>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }} rowSpan="2">EA</td>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }} rowSpan="2">8.000</td>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }} rowSpan="2">10.09.2025</td>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }} rowSpan="2">76,000.00</td>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }}>9%</td>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }}>9%</td>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }}>NA</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }}>6,840.00</td>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }}>6,840.00</td>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }}>0.00</td>
              </tr>
              {/* Second Item */}
              <tr>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }} rowSpan="2">02</td>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }} rowSpan="2">NVFB101010498</td>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }} rowSpan="2">JD 5D MFWD AXLE PALLET (KRISH 4WD)</td>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }} rowSpan="2">73089090</td>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }} rowSpan="2">EA</td>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }} rowSpan="2">9.000</td>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }} rowSpan="2">10.09.2025</td>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }} rowSpan="2">31,500.00</td>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }}>9%</td>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }}>9%</td>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }}>NA</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }}>2,835.00</td>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }}>2,835.00</td>
                <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }}>0.00</td>
              </tr>
            </tbody>
          </table>

          {/* Amount Info */}
          <div style={{ display: "flex", borderTop: "1px solid #000" }}>
            {/* Left Column - Amount in Words */}
            <div style={{ width: "50%", padding: "10px", borderRight: "1px solid #000", fontSize: "12px" }}>
              <div><strong>Delivery Challan Value in Words :-</strong></div>
              <div>One Lakh Twenty Six Thousand Eight Hundred Fifty Rupees Only</div>
            </div>
            {/* Right Column - Amount Details */}
            <div style={{ width: "50%" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #000" }}>Basic Amount</td>
                    <td style={{ padding: "5px", textAlign: "right", borderBottom: "1px solid #000" }}>107,500.00</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #000" }}>CGST Amount</td>
                    <td style={{ padding: "5px", textAlign: "right", borderBottom: "1px solid #000" }}>9,675.00</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #000" }}>SGST Amount</td>
                    <td style={{ padding: "5px", textAlign: "right", borderBottom: "1px solid #000" }}>9,675.00</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", borderBottom: "1px solid #000" }}>IGST Amount</td>
                    <td style={{ padding: "5px", textAlign: "right", borderBottom: "1px solid #000" }}>0.00</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px", fontWeight: "bold" }}>Total</td>
                    <td style={{ padding: "5px", textAlign: "right", fontWeight: "bold" }}>126,850.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Remarks */}
          <div style={{ borderTop: "1px solid #000", padding: "10px", fontSize: "12px" }}>
            <strong>Remarks : </strong>Material sent on returnable basis.
          </div>

          {/* Large Blank Area for Signatures */}
          <div style={{ height: "200px", borderTop: "1px solid #000" }}></div>

          {/* Signature Footer */}
          <div style={{ borderTop: "1px solid #000", padding: "10px" }}>
            <div style={{ marginBottom: "10px", fontSize: "12px" }}>
              <div style={{ fontSize: "11px", marginTop: "5px" }}>
                Digitally Signed By:<br />
                DS DANA INDIA PRIVATE LIMITED 1<br />
                Fri 14-Mar-2025 14:12:03 IST<br />
                Navnit Satyam
              </div>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", fontSize: "12px" }}>
              <span>Authorised By</span>
              <span>Prepared By</span>
              <span>Receivers Sign</span>
            </div>
          </div>

          {/* Footer Text */}
          <div style={{ borderTop: "1px solid #000", padding: "10px", fontSize: "10px", textAlign: "center" }}>
            Registered Office: Dana India Private Limited Survey No. 279/1, Raisoni Ind. Park, Hinjawadi Phase-II Village : Maan, Tal:
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div id="continer" className="flex font-medium">
      {/* Sidebar */}
      <div id="left_content" className="w-1/4 bg-gray-200 min-h-screen p-4">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div id="right_content" className="w-3/4 p-6 bg-white">
        <h1 className="text-2xl font-bold mb-6 text-center">Transaction Challans</h1>
        
        {/* Original for Buyer Challan */}
        {createChallan("Original for Buyer", "challan-content-original", "Original for Buyer")}
        
        {/* Duplicate for Transporter Challan */}
        {createChallan("Duplicate for Transporter", "challan-content-duplicate", "Duplicate for Transporter")}
        
        {/* Triplicate Challan */}
        {createChallan("Triplicate", "challan-content-triplicate", "Triplicate")}
      </div>
    </div>
  );
};

export default Challan;