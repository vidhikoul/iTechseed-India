import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from './card';
import { Download } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const TransactionChallan = () => {
  const { challan_no } = useParams();
  const [challan, setChallan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!challan_no || challan_no === "undefined") {
      setError("Invalid challan number");
      setLoading(false);
      return;
    }

    const fetchChallan = async () => {
      try {
        // Try primary endpoint first
        let response = await fetch(`http://localhost:8800/api/challans/${challan_no}`);
        
        if (response.status === 404) {
          // Fallback to alternative endpoint if primary fails
          response = await fetch(`http://localhost:8800/api/getopenChallanDetails/${challan_no}`);
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setChallan(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallan();
  }, [challan_no]);

  // PDF generation function - takes an ID parameter to identify which challan to download
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
      
      // Extract challan number for filename
      const challanNoMatch = challanId.match(/challan-(\d+)-(original|duplicate|triplicate)/);
      let fileName = "transaction_challan.pdf";
      
      if (challanNoMatch) {
        const challanNo = challanNoMatch[1];
        const copyType = challanNoMatch[2];
        fileName = `transaction_challan_${challanNo}_${copyType}.pdf`;
      }
      
      pdf.save(fileName);
    });
  };

  // Convert number to words function
  const convertToWords = (amount) => {
    // This is a simplified implementation - you might want to use a proper library
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const numStr = amount.toString();
    const decimal = numStr.indexOf('.');
    const wholePart = decimal === -1 ? numStr : numStr.substring(0, decimal);
    const decimalPart = decimal === -1 ? '00' : numStr.substring(decimal + 1).padEnd(2, '0').substring(0, 2);
    
    const num = parseInt(wholePart);
    
    if (num === 0) return 'Zero Rupees';
    
    const getWords = (n) => {
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + getWords(n % 100) : '');
      if (n < 100000) return getWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + getWords(n % 1000) : '');
      if (n < 10000000) return getWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + getWords(n % 100000) : '');
      return getWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + getWords(n % 10000000) : '');
    };
    
    return getWords(num) + ' Rupees' + (parseInt(decimalPart) > 0 ? ' and ' + getWords(parseInt(decimalPart)) + ' Paise' : ' Only');
  };

  // Function to create a challan component with specified type
  const createChallan = (challan, type, id) => {
    if (!challan) return null;
    
    // Format challan date
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    };
    
    // Get title based on type
    let title = "Original for Buyer";
    if (type === "Duplicate for Transporter") {
      title = "Duplicate for Transporter";
    } else if (type === "Triplicate") {
      title = "Triplicate";
    }
    
    return (
      <div className="challan-container" style={{ 
        width: "100%", 
        maxWidth: "210mm", // A4 width
        margin: "0 auto 2rem auto",
        aspectRatio: "210/297", // A4 aspect ratio
        minHeight: "297mm" // A4 height
      }}>
        <Card className="p-4 shadow-lg border rounded-md relative h-full" style={{ 
          backgroundColor: "white",
          breakInside: "avoid"
        }}>
          {/* Header with Title and Download Button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <Download onClick={() => handleDownloadPDF(id)} className="w-6 h-6 cursor-pointer hover:text-blue-600" />
          </div>
          
          {/* Challan Content - Styled to match reference image */}
          <div id={id} style={{ 
            width: "100%", 
            border: "1px solid #000",
            backgroundColor: "white",
            fontSize: "12px",
            lineHeight: "1.2"
          }}>
            {/* Header Row - Two Columns: Left for Dana Logo, Right for Address & Heading */}
            <div style={{ display: "flex", borderBottom: "1px solid #000" }}>
              {/* Left Column - Dana Logo */}
              <div style={{ 
                width: "40%", 
                textAlign: "center", 
                padding: "15px", 
                borderRight: "1px solid #000", 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "center", 
                alignItems: "center",
                minHeight: "120px"
              }}>
                <img
                  src="/Danalogo.png"
                  alt="Dana Logo"
                  style={{ width: "100%", maxHeight: "100px", objectFit: "contain" }}
                />
              </div>
              {/* Right Column - Company Address with Original for Buyer at top */}
              <div style={{ width: "60%", textAlign: "center", padding: "10px" }}>
                <div style={{ fontSize: "12px", marginBottom: "5px", fontWeight: "bold" }}>{type}</div>
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
                <div style={{ fontWeight: "bold" }}>Customer Code: {challan.vendor_code}</div>
                <div>{challan.vendor_name}</div>
                <div>{challan.vendor_address}</div>
                <div>{challan.gstin_no}</div>
                <div>GSTIN No.: </div>
                <div>PAN No.: {challan.pan_no}</div>
              </div>
              {/* Right Column - Challan Details */}
              <div style={{ verticalAlign: "top", width: "50%", padding: "10px", fontSize: "12px" }}>
                <div style={{ fontSize: "12px" }}>
                  <strong>Challan No.</strong>: {challan.challan_no}
                </div>
                <div style={{ fontSize: "12px" }}>
                  <strong>Challan Date</strong>: {formatDate(challan.challan_date)}
                </div>
                <div style={{ fontSize: "12px" }}>
                  <strong>Vechicle No</strong>: {challan.vehicle_no}
                </div>
                <div style={{ fontSize: "12px" }}>
                  <strong>Transporter</strong>: {challan.transporter}
                </div>
                <div style={{ fontSize: "12px" }}>
                  <strong>Emp. Code</strong>: {challan.emp_code}
                </div>
                <div style={{ fontSize: "12px" }}>
                  <strong>Name</strong>:{challan.emp_name}
                </div>
              </div>
            </div>

            {/* Main Items Table */}
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
                <tr>
                  <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }} rowSpan="2">01</td>
                  <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }} rowSpan="2">{challan.material_code}</td>
                  <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }} rowSpan="2">{challan.material_description}</td>
                  <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }} rowSpan="2">{challan.hsn_code}</td>
                  <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }} rowSpan="2">EA</td>
                  <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }} rowSpan="2">{challan.pallet_count}.000</td>
                  <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }} rowSpan="2">
                    {/* Calculate return date: add 6 months to challan date */}
                    {(() => {
                      const date = new Date(challan.challan_date);
                      date.setMonth(date.getMonth() + 6);
                      return formatDate(date);
                    })()}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }} rowSpan="2">
                    {challan.taxable_amount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }}>{challan.cgst_rate}%</td>
                  <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }}>{challan.sgst_rate}%</td>
                  <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }}>
                    {challan.igst_rate > 0 ? `${challan.igst_rate}%` : 'NA'}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }}>
                    {challan.cgst_amount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }}>
                    {challan.sgst_amount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "4px", textAlign: "center" }}>
                    {challan.igst_amount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Amount Info */}
            <div style={{ display: "flex", borderTop: "1px solid #000" }}>
              {/* Left Column - Amount in Words */}
              <div style={{ width: "50%", padding: "10px", borderRight: "1px solid #000", fontSize: "12px" }}>
                <div><strong>Delivery Challan Value in Words :-</strong></div>
                <div>{convertToWords(challan.total_amount)}</div>
              </div>
              {/* Right Column - Amount Details */}
              <div style={{ width: "50%" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: "5px", borderBottom: "1px solid #000" }}>Basic Amount</td>
                      <td style={{ padding: "5px", textAlign: "right", borderBottom: "1px solid #000" }}>
                        {challan.basic_amount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "5px", borderBottom: "1px solid #000" }}>CGST Amount</td>
                      <td style={{ padding: "5px", textAlign: "right", borderBottom: "1px solid #000" }}>
                        {challan.cgst_amount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "5px", borderBottom: "1px solid #000" }}>SGST Amount</td>
                      <td style={{ padding: "5px", textAlign: "right", borderBottom: "1px solid #000" }}>
                        {challan.sgst_amount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "5px", borderBottom: "1px solid #000" }}>IGST Amount</td>
                      <td style={{ padding: "5px", textAlign: "right", borderBottom: "1px solid #000" }}>
                        {challan.igst_amount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "5px", fontWeight: "bold" }}>Total</td>
                      <td style={{ padding: "5px", textAlign: "right", fontWeight: "bold" }}>
                        {challan.total_amount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Remarks */}
            <div style={{ borderTop: "1px solid #000", padding: "10px", fontSize: "12px" }}>
              <strong>Remarks : </strong>{challan.remarks}
            </div>

            {/* Large Blank Area for Signatures */}
            <div style={{ height: "150px", borderTop: "1px solid #000" }}></div>

            {/* Signature Footer */}
            <div style={{ borderTop: "1px solid #000", padding: "10px" }}>
              <div style={{ marginBottom: "10px", fontSize: "12px" }}>
                <div style={{ fontSize: "11px", marginTop: "5px" }}>
                  Digitally Signed By:<br />
                  {challan.digitally_signed_by}<br />
                  {new Date(challan.signed_on).toLocaleString('en-IN', { 
                    weekday: 'short', 
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                  })}<br />
                  {challan.authorised_by}
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
      </div>
    );
  };

  // Show loading or error state
  if (loading) {
    return (
      <div className="flex font-medium min-h-screen">
        <div className="w-1/4 bg-gray-200 min-h-screen p-4 fixed left-0 top-0">
          <Sidebar />
        </div>
        <div className="w-3/4 ml-[25%] p-6 bg-white flex justify-center items-center">
          <p>Loading challan data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex font-medium min-h-screen">
        <div className="w-1/4 bg-gray-200 min-h-screen p-4 fixed left-0 top-0">
          <Sidebar />
        </div>
        <div className="w-3/4 ml-[25%] p-6 bg-white flex justify-center items-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!challan) {
    return (
      <div className="flex font-medium min-h-screen">
        <div className="w-1/4 bg-gray-200 min-h-screen p-4 fixed left-0 top-0">
          <Sidebar />
        </div>
        <div className="w-3/4 ml-[25%] p-6 bg-white flex justify-center items-center">
          <p>No challan found with ID: {challan_no}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex font-medium min-h-screen">
      {/* Fixed Sidebar */}
      <div className="w-1/4 bg-gray-200 min-h-screen p-4 fixed left-0 top-0 z-10">
        <Sidebar />
      </div>

      {/* Main Content - with left margin to account for fixed sidebar */}
      <div className="w-3/4 ml-[25%] bg-white">
        {/* Centered container for all content - moved more to the right */}
        <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4 ml-16">
          <h1 className="text-2xl font-bold mb-6 text-center">Transaction Challans</h1>
          
          {/* Challans Container - Centered */}
          <div className="challans-wrapper w-full max-w-4xl flex flex-col items-center">
            {/* Original for Buyer Challan */}
            {createChallan(challan, "Original for Buyer", `challan-${challan.challan_no}-original`)}
            
            {/* Duplicate for Transporter Challan */}
            {createChallan(challan, "Duplicate for Transporter", `challan-${challan.challan_no}-duplicate`)}
            
            {/* Triplicate Challan */}
            {createChallan(challan, "Triplicate", `challan-${challan.challan_no}-triplicate`)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionChallan;