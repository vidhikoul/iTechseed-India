import { Card, CardContent } from './card';
import { Download } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./challan.css";

const Challan = () => {
  const handleDownloadPDF = () => {
    const input = document.getElementById("right_content");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("transaction_challan.pdf");
    });
  };

  const handleClearForm = () => {
    document.querySelectorAll("input, textarea").forEach((field) => (field.value = ""));
  };

  return (
    <div id="continer" className="flex font-medium">
      {/* Sidebar */}
      <div id="left_content" className="w-1/4 bg-gray-200 min-h-screen p-4">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div id="right_content" className="w-3/4 p-6 bg-white">
        <Card className="p-6 shadow-lg border rounded-md relative" style={{ width: "210mm", minHeight: "297mm" }}>
          {/* Header Section */}
          <div className="d-flex justify-content-between align-items-center mb-3 mx-10">
            <h2 className="font-bold" style={{ fontSize: '30px' }}>New Challan</h2>
            <Download onClick={handleDownloadPDF} style={{ cursor: "pointer" }} className="w-6 h-6" />
          </div>

          <h3 className="font-bold text-lg mb-2" style={{ fontSize: '16px' }}>
            <strong style={{ fontWeight: '700' }}>Challan ID: </strong>
            <input type="text" placeholder="Enter Challan ID" className="border p-1" />
          </h3>

          {/* Top Header and Logo */}
          <div style={{ textAlign: "center", marginBottom: "5px", fontSize: "12px" }}>
            <strong>Original for Buyer</strong>
            <br />
            <img
              src="Danalogo.png"
              alt="Dana Logo"
              style={{ height: "40px", marginTop: "5px" }}
            />
            <br />
            <strong>DANA INDIA PRIVATE LIMITED</strong>
            <br />
            <span>
              VILLAGE BHAMBOLI, TALUKA - KHED, PUNE, MAHARASHTRA GAT NO. 51/1,<br />
              51/2, 51/3, 52, 53,54, 56, 57, 58, 59 Pune 410501 Maharashtra India<br />
              CIN No. : U74999PN2000PTC015131 &nbsp; PAN No. : AABCD1873A
            </span>
            <br />
            <h3 style={{ margin: "5px 0", fontWeight: "bold", fontSize: "16px" }}>Delivery Challan</h3>
          </div>

          {/* Vendor & Challan Info with Reduced Font */}
          <table className="w-full text-sm border-1 border-black border-collapse">
            <tbody className="border-black border-1">
              <tr>
                <td className="p-1 align-top border-0 w-1/2">
                  <div className="p-0 m-0" style={{ fontWeight: '700', fontSize: '10px' }}>
                    Vendor: <input type="text" placeholder="Enter Vendor ID" className="border p-1" style={{ fontSize: '10px' }} />
                  </div>
                  <div className="p-0 m-0" style={{ fontSize: '10px' }}>
                    <textarea 
                      className="w-full border p-1" 
                      rows="5" 
                      cols="40" 
                      placeholder={`Enter Vendor Details
Ex:
John Deere India Pvt Ltd
Gat no. 166-167 and 271-291 Sanaswadi
Pune-412208
GSTIN No.: XXXXXXXX
PAN No.: AAACJ4233B`} 
                      style={{ fontSize: '10px' }}
                    />
                  </div>
                </td>
                <td className="p-1 align-top border-0 w-1/2 text-right" style={{ fontSize: '10px' }}>
                  <div className="p-0 m-0" style={{ fontSize: '10px' }}>
                    <strong style={{ fontWeight: '700', fontSize: '10px' }}>Challan No.:</strong> 
                    <input type="text" placeholder="Challan No." className="border p-1" style={{ fontSize: '10px' }} />
                  </div>
                  <div className="p-0 m-0" style={{ fontSize: '10px' }}>
                    <strong style={{ fontWeight: '700', fontSize: '10px' }}>Challan Date:</strong> 
                    <input type="date" className="border p-1" style={{ fontSize: '10px' }} />
                  </div>
                  <div className="p-0 m-0" style={{ fontSize: '10px' }}>
                    <strong style={{ fontWeight: '700', fontSize: '10px' }}>Vehicle No.:</strong> 
                    <input type="text" placeholder="Vehicle Reg. No." className="border p-1" style={{ fontSize: '10px' }} />
                  </div>
                  <div className="p-0 m-0" style={{ fontSize: '10px' }}>
                    <strong style={{ fontWeight: '700', fontSize: '10px' }}>Transporter:</strong> 
                    <input type="text" placeholder="Transporter Name" className="border p-1" style={{ fontSize: '10px' }} />
                  </div>
                  <div className="p-0 m-0" style={{ fontSize: '10px' }}>
                    <strong style={{ fontWeight: '700', fontSize: '10px' }}>EMP Code:</strong> 
                    <input type="text" placeholder="EMP Code" className="border p-1" style={{ fontSize: '10px' }} />
                  </div>
                  <div className="p-0 m-0" style={{ fontSize: '10px' }}>
                    <strong style={{ fontWeight: '700', fontSize: '10px' }}>Name:</strong> 
                    <input type="text" placeholder="Customer Name" className="border p-1" style={{ fontSize: '10px' }} />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Table of Items */}
          <div className="overflow-x-auto my-4">
            <table
              className="w-full border-collapse border-1 border-black text-sm mt-2"
              style={{ fontSize: "12px" }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f0f0f0", textAlign: "center", fontWeight: "bold" }}>
                  <th className="border-1 border-black p-1">Sr No</th>
                  <th className="border-1 border-black p-1">Material Code</th>
                  <th className="border-1 border-black p-1">Material Description</th>
                  <th className="border-1 border-black p-1">HSN Code</th>
                  <th className="border-1 border-black p-1">Unit</th>
                  <th className="border-1 border-black p-1">Qty</th>
                  <th className="border-1 border-black p-1">Expected<br />Return Date</th>
                  <th className="border-1 border-black p-1">Taxable<br />Amount</th>
                  <th className="border-1 border-black p-1">CGST<br />Rate</th>
                  <th className="border-1 border-black p-1">---------<br />Amount</th>
                  <th className="border-1 border-black p-1">SGST<br />Rate</th>
                  <th className="border-1 border-black p-1">---------<br />Amount</th>
                  <th className="border-1 border-black p-1">IGST<br />Rate</th>
                  <th className="border-1 border-black p-1">---------<br />Amount</th>
                </tr>
              </thead>
              <tbody>
                {/* Row 1 */}
                <tr style={{ textAlign: "center" }}>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="01" size="2" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="NVFB101010497" size="12" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="JD 2WD 4 AXLE PALLET" size="20" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="73089090" size="8" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="EA" size="2" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="8.000" size="4" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="10.09.2025" size="10" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="76,000.00" size="10" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="9%" size="2" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="6,840.00" size="8" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="9%" size="2" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="6,840.00" size="8" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="NA" size="2" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="0.00" size="6" />
                  </td>
                </tr>
                {/* Row 2 */}
                <tr style={{ textAlign: "center" }}>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="02" size="2" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="NVFB101010498" size="12" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="JD 5D MFWD AXLE PALLET (KRISH 4WD)" size="30" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="73089090" size="8" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="EA" size="2" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="9.000" size="4" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="10.09.2025" size="10" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="31,500.00" size="10" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="9%" size="2" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="2,835.00" size="8" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="9%" size="2" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="2,835.00" size="8" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="NA" size="2" />
                  </td>
                  <td className="border-1 border-black p-1">
                    <input type="text" className="border p-1" placeholder="0.00" size="6" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer Summary */}
          <table className="w-full border-collapse border-1 border-black mt-2" style={{ fontSize: "12px" }}>
            <tbody>
              <tr>
                <td className="border-1 border-black p-1 align-top" rowSpan="5" style={{ width: "50%", verticalAlign: "top" }}>
                  <strong>Delivery Challan Value in Words :</strong>
                  <br />
                  <input
                    type="text"
                    className="border p-1 mt-1"
                    style={{ width: "95%" }}
                    placeholder="One Lakh Twenty Six Thousand Eight Hundred Fifty Rupees Only"
                  />
                  <br /><br />
                  <strong>Remarks :</strong>
                  <br />
                  <textarea
                    className="border p-1"
                    rows="2"
                    style={{ width: "95%" }}
                    placeholder="Material sent on returnable basis."
                  />
                </td>
                <td className="border-1 border-black p-1" style={{ width: "25%" }}>
                  Basic Amount
                </td>
                <td className="border-1 border-black p-1 text-right" style={{ width: "25%" }}>
                  <input type="text" className="border p-1" placeholder="107,500.00" style={{ textAlign: "right" }} />
                </td>
              </tr>
              <tr>
                <td className="border-1 border-black p-1">CGST Amount</td>
                <td className="border-1 border-black p-1 text-right">
                  <input type="text" className="border p-1" placeholder="9,675.00" style={{ textAlign: "right" }} />
                </td>
              </tr>
              <tr>
                <td className="border-1 border-black p-1">SGST Amount</td>
                <td className="border-1 border-black p-1 text-right">
                  <input type="text" className="border p-1" placeholder="9,675.00" style={{ textAlign: "right" }} />
                </td>
              </tr>
              <tr>
                <td className="border-1 border-black p-1">IGST Amount</td>
                <td className="border-1 border-black p-1 text-right">
                  <input type="text" className="border p-1" placeholder="0.00" style={{ textAlign: "right" }} />
                </td>
              </tr>
              <tr>
                <td className="border-1 border-black p-1 font-bold">Total</td>
                <td className="border-1 border-black p-1 text-right font-bold">
                  <input type="text" className="border p-1" placeholder="126,850.00" style={{ textAlign: "right", fontWeight: "bold" }} />
                </td>
              </tr>
            </tbody>
          </table>

          {/* Signature Section */}
          <div style={{ fontSize: "12px", marginTop: "10px" }}>
            <div>Signature Not Verified</div>
            <br />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
              <span>Receivers Sign</span>
              <span>Prepared By</span>
              <span>Authorised By</span>
            </div>
          </div>

          {/* Registered Office Footer */}
          <div style={{ fontSize: "10px", marginTop: "10px" }}>
            Registered Office: Dana India Private Limited Survey No. 279/1, Raisoni Ind. Park, Hinjawadi Phase-II Village : Maan, Tal:
          </div>

          {/* Buttons */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              type="button"
              style={{
                color: '#FFFFFF',
                backgroundColor: '#373F51',
                padding: '8px 20px',
                borderRadius: '20px',
                width: '160px',
                border: 'none',
                marginRight: '20px'
              }}
            >
              SAVE
            </button>
            <button
              onClick={handleClearForm}
              style={{
                backgroundColor: '#D8DBE2',
                borderRadius: '20px',
                padding: '8px 20px',
                width: '160px',
                border: 'none'
              }}
            >
              CLEAR
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Challan;