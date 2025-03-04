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
      <div id='right_content' className="w-3/4 p-6 bg-white">
        <Card className="p-6 shadow-lg border rounded-md relative">
          <div className="d-flex justify-content-between align-items-center mb-3 mx-10">
            <h2 className="font-bold" style={{ fontSize: '30px' }}>New Challan</h2>
            <Download onClick={handleDownloadPDF} style={{ cursor: "pointer" }} className="w-6 h-6" />
          </div>

          <h3 className="font-bold text-lg mb-2" style={{ fontSize: '16px' }}><strong style={{ fontWeight: '700' }}>Challan ID: </strong><input type="text" placeholder='Enter Challan ID' className="border p-1" /></h3>

          {/* Vendor & Challan Info */}
            <table className="w-full text-sm border-1 border-black border-collapse">
                <tbody className="border-black border-1">
                    <tr>
                    <td className="p-1 align-top border-0 w-1/2">
                        <div className="p-0 m-0" style={{ fontWeight: '700' }}>Vendor: <input type="text" placeholder='Enter Vendor ID' className="border p-1" /></div>
                        <div className="p-0 m-0"><textarea className="w-full border p-1" rows="5" cols="40" placeholder={`Enter Vendor Details\nEx:\nJohn Deere India Pvt Ltd\nGat no. 166-167 and 271-291 Sanaswadi\nPune-412208\nGSTIN No.: XXXXXXXX\nPAN No.: AAACJ4233B`} /></div>
                    </td>
                    <td className="p-1 align-top border-0 w-1/2 text-right">
                        <div className="p-0 m-0"><strong style={{ fontWeight: '700' }}>Challan No.:</strong> <input type="text" placeholder="Challan No." className="border p-1" /></div>
                        <div className="p-0 m-0"><strong style={{ fontWeight: '700' }}>Challan Date:</strong> <input type="date" className="border p-1" /></div>
                        <div className="p-0 m-0"><strong style={{ fontWeight: '700' }}>Vehicle No.:</strong> <input type="text" placeholder="Vehicle Reg. No." className="border p-1" /></div>
                        <div className="p-0 m-0"><strong style={{ fontWeight: '700' }}>Transporter:</strong> <input type="text" placeholder="Transporter Name" className="border p-1" /></div>
                        <div className="p-0 m-0"><strong style={{ fontWeight: '700' }}>EMP Code:</strong> <input type="text" placeholder="EMP Code" className="border p-1" /></div>
                        <div className="p-0 m-0"><strong style={{ fontWeight: '700' }}>Name:</strong> <input type="text" placeholder="Customer Name" className="border p-1" /></div>
                    </td>
                    </tr>
                </tbody>
            </table>

        {/* Table */}
        <div className="overflow-x-auto my-6">
          <table className="w-full border-collapse border-1 border-black text-sm text-left bg-white mt-4">
            <thead className="bg-gray-200">
                <tr>
                <th style={{ fontWeight: '600', textAlign: 'center' }} className="border-1 border-black p-1" rowSpan="2">Sr No.</th>
                <th style={{ fontWeight: '600', textAlign: 'center' }} className="border-1 border-black p-1" rowSpan="2">Material Code</th>
                <th style={{ fontWeight: '600', textAlign: 'center' }} className="border-1 border-black p-1" rowSpan="2">Material Description</th>
                <th style={{ fontWeight: '600', textAlign: 'center' }} className="border-1 border-black p-1" rowSpan="2">HSN Code</th>
                <th style={{ fontWeight: '600', textAlign: 'center' }} className="border-1 border-black p-1" rowSpan="2">Unit</th>
                <th style={{ fontWeight: '600', textAlign: 'center' }} className="border-1 border-black p-1" rowSpan="2">Qty</th>
                <th style={{ fontWeight: '600', textAlign: 'center' }} className="border-1 border-black p-1" rowSpan="2">Expected Return Date</th>
                <th style={{ fontWeight: '600', textAlign: 'center' }} className="border-1 border-black p-1" rowSpan="2">Taxable Amount</th>
                <th style={{ fontWeight: '600', textAlign: 'center' }} className="border-1 border-black p-1">CGST Rate</th>
                <th style={{ fontWeight: '600', textAlign: 'center' }} className="border-1 border-black p-1">SGST Rate</th>
                <th style={{ fontWeight: '600', textAlign: 'center' }} className="border-1 border-black p-1">IGST Rate</th>
                </tr>
                <tr>
                <th style={{ fontWeight: '600', textAlign: 'center' }} className="border-1 border-black p-1">Amount</th>
                <th style={{ fontWeight: '600', textAlign: 'center' }} className="border-1 border-black p-1">Amount</th>
                <th style={{ fontWeight: '600', textAlign: 'center' }} className="border-1 border-black p-1">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td style={{ textAlign: 'center' }} className="border-1 border-black p-1" rowSpan="2"><input type="text" placeholder="01" size="2" className="border p-1" /></td>
                <td style={{ textAlign: 'center' }} className="border-1 border-black p-1" rowSpan="2"><input type="text" placeholder="ABCD123456789" size="13" className="border p-1" /></td>
                <td style={{ textAlign: 'center' }} className="border-1 border-black p-1" rowSpan="2"><input type="text" placeholder="PALLET 5E/5B/5R AXLE" size="19" className="border p-1" /></td>
                <td style={{ textAlign: 'center' }} className="border-1 border-black p-1" rowSpan="2"><input type="text" placeholder="12345678" size="5" className="border p-1" /></td>
                <td style={{ textAlign: 'center' }} className="border-1 border-black p-1" rowSpan="2"><input type="text" placeholder="EA" size="2" className="border p-1" /></td>
                <td style={{ textAlign: 'center' }} className="border-1 border-black p-1" rowSpan="2"><input type="text" placeholder="10" size="2" className="border p-1" /></td>
                <td style={{ textAlign: 'center' }} className="border-1 border-black p-1" rowSpan="2"><input type="date" size="2" className="border p-1" /></td>
                <td style={{ textAlign: 'center' }} className="border-1 border-black p-1" rowSpan="2"><input type="text" placeholder="135,000.00" size="9" className="border p-1" /></td>
                <td style={{ textAlign: 'center' }} className="border-1 border-black p-1"><input type="text" placeholder="9%" size="2" className="border p-1" /></td>
                <td style={{ textAlign: 'center' }} className="border-1 border-black p-1"><input type="text" placeholder="9%" size="2" className="border p-1" /></td>
                <td style={{ textAlign: 'center' }} className="border-1 border-black p-1"><input type="text" placeholder="NA" size="2" className="border p-1" /></td>
                </tr>
                <tr>
                <td style={{ textAlign: 'center' }} className="border-1 border-black p-1"><input type="text" placeholder="12,150.00" size="7" className="border p-1" /></td>
                <td style={{ textAlign: 'center' }} className="border-1 border-black p-1"><input type="text" placeholder="12,150.00" size="7" className="border p-1" /></td>
                <td style={{ textAlign: 'center' }} className="border-1 border-black p-1"><input type="text" placeholder="0.00" size="7" className="border p-1" /></td>
                </tr>
            </tbody>
            </table>
          </div>

          {/* Summary & Amount Details */}
          <table className="w-full border-4 border-black border-collapse mt-4 text-sm">
                <tbody>
                    <tr>
                    <td rowSpan="5" className="border border-black p-2 w-1/2 align-top">
                        <p className="font-bold p-0 m-0" style={{ fontWeight: '700' }}>Delivery Challan Value in Words:</p>
                        <p className='p-0 m-0'><input type="text" placeholder="One Lakh Fifty Nine Thousand Three Hundred Rupees Only" size="50" className="border p-1" /></p>
                    </td>
                    <td className="border border-black p-1 w-1/4 align-top">Basic Amount</td>
                    <td style={{ textAlign: 'center' }} className="border border-black p-1 w-1/4 text-right align-top"><input type="text" placeholder="135,000.00" size="10" className="border p-1" /></td>
                    </tr>
                    <tr>
                    <td className="border border-black p-1 w-1/4 align-top">CGST Amount</td>
                    <td style={{ textAlign: 'center' }} className="border border-black p-1 w-1/4 text-right align-top"><input type="text" placeholder="12,150.00" size="10" className="border p-1" /></td>
                    </tr>
                    <tr>
                    <td className="border border-black p-1 w-1/4 align-top">SGST Amount</td>
                    <td style={{ textAlign: 'center' }} className="border border-black p-1 w-1/4 text-right align-top"><input type="text" placeholder="12,150.00" size="10" className="border p-1" /></td>
                    </tr>
                    <tr>
                    <td className="border border-black p-1 w-1/4 align-top">IGST Amount</td>
                    <td style={{ textAlign: 'center' }} className="border border-black p-1 w-1/4 text-right align-top"><input type="text" placeholder="00.00" size="10" className="border p-1" /></td>
                    </tr>
                    <tr>
                    <td style={{ fontWeight: '700' }} className="border border-black p-1 w-1/4 align-top font-bold">Total</td>
                    <td style={{ fontWeight: '700', textAlign: 'center' }} className="border border-black p-1 w-1/4 text-right align-top font-bold"><input style={{ fontWeight: "700" }} type="text" placeholder="159,300.00" size="10" className="border p-1" /></td>
                    </tr>
                </tbody>
            </table>
            <div style={{ alignContent: 'center', padding: '20px', marginLeft: '35%', marginTop: '20px' }}>
              <button
                type="button"
                style={{
                  color: '#FFFFFF',
                  backgroundColor: '#373F51',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  width: '160px',
                  border: 'none'
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
                  border: 'none',
                  marginLeft: '20px'
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