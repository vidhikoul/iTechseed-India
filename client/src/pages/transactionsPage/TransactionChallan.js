import { Card, CardContent } from './card';
import { Download, Printer } from "lucide-react"; // Import Printer icon
import Sidebar from "../../components/Sidebar";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./challan.css";

const TransactionChallan = () => {
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

  const handlePrint = () => {
    const input = document.getElementById("right_content");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const printWindow = window.open("");
      printWindow.document.write(`<img src="${imgData}" onload="window.print();" />`);
      printWindow.document.close();
    });
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
            <h2 className="font-bold" style={{ fontSize: '30px' }}>Transaction Challan</h2>
            <div className="flex gap-2">
              <Printer onClick={handlePrint} style={{ cursor: "pointer" }} className="w-6 h-6" />
              <Download onClick={handleDownloadPDF} style={{ cursor: "pointer" }} className="w-6 h-6" />
            </div>
          </div>

          <h3 className="font-bold text-lg mb-2" style={{ fontSize: '16px' }}><strong style={{ fontWeight: '700' }}>Challan ID:</strong> ABC123456789</h3>

          {/* Vendor & Challan Info */}
          <table className="w-full text-sm border-1 border-black border-collapse">
            <tbody className="border-black border-1">
              <tr>
                <td className="p-1 align-top border-0 w-1/2">
                  <div className="p-0 m-0" style={{ fontWeight: '700' }}>Vendor: 202758</div>
                  <div className="p-0 m-0">John Deere India Pvt Ltd</div>
                  <div className="p-0 m-0">Gat no. 166-167 and 271-291 Sanaswadi</div>
                  <div className="p-0 m-0">Pune-412208</div>
                  <div className="p-0 m-0">GSTIN No.: XXXXXXXX</div>
                  <div className="p-0 m-0">PAN No.: AAACJ4233B</div>
                </td>
                <td className="p-1 align-top border-0 w-1/2 text-right">
                  <div className="p-0 m-0"><strong style={{ fontWeight: '700' }}>Challan No.:</strong> 4348402774</div>
                  <div className="p-0 m-0"><strong style={{ fontWeight: '700' }}>Challan Date:</strong> 03/01/2025</div>
                  <div className="p-0 m-0"><strong style={{ fontWeight: '700' }}>Vehicle No.:</strong> XYZ1234</div>
                  <div className="p-0 m-0"><strong style={{ fontWeight: '700' }}>Transporter:</strong> ABC Logistics</div>
                  <div className="p-0 m-0"><strong style={{ fontWeight: '700' }}>EMP Code:</strong> 1253822</div>
                  <div className="p-0 m-0"><strong style={{ fontWeight: '700' }}>Name:</strong> Mr. KADAM MAYUR ASHOK</div>
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
                  <td style={{ textAlign: 'center' }} className="border-1 border-black p-1" rowSpan="2">01</td>
                  <td style={{ textAlign: 'center' }} className="border-1 border-black p-1" rowSpan="2">ABCD123456789</td>
                  <td style={{ textAlign: 'center' }} className="border-1 border-black p-1" rowSpan="2">PALLET 5E/5B/5R AXLE</td>
                  <td style={{ textAlign: 'center' }} className="border-1 border-black p-1" rowSpan="2">12345678</td>
                  <td style={{ textAlign: 'center' }} className="border-1 border-black p-1" rowSpan="2">EA</td>
                  <td style={{ textAlign: 'center' }} className="border-1 border-black p-1" rowSpan="2">10.00</td>
                  <td style={{ textAlign: 'center' }} className="border-1 border-black p-1" rowSpan="2">02/07/2025</td>
                  <td style={{ textAlign: 'center' }} className="border-1 border-black p-1" rowSpan="2">135,000.00</td>
                  <td style={{ textAlign: 'center' }} className="border-1 border-black p-1">9%</td>
                  <td style={{ textAlign: 'center' }} className="border-1 border-black p-1">9%</td>
                  <td style={{ textAlign: 'center' }} className="border-1 border-black p-1">NA</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }} className="border-1 border-black p-1">12,150.00</td>
                  <td style={{ textAlign: 'center' }} className="border-1 border-black p-1">12,150.00</td>
                  <td style={{ textAlign: 'center' }} className="border-1 border-black p-1">0.00</td>
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
                  <p className='p-0 m-0'>One Lakh Fifty Nine Thousand Three Hundred Rupees Only</p>
                </td>
                <td className="border border-black p-1 w-1/4 align-top">Basic Amount</td>
                <td style={{ textAlign: 'center' }} className="border border-black p-1 w-1/4 text-right align-top">135,000.00</td>
              </tr>
              <tr>
                <td className="border border-black p-1 w-1/4 align-top">CGST Amount</td>
                <td style={{ textAlign: 'center' }} className="border border-black p-1 w-1/4 text-right align-top">12,150.00</td>
              </tr>
              <tr>
                <td className="border border-black p-1 w-1/4 align-top">SGST Amount</td>
                <td style={{ textAlign: 'center' }} className="border border-black p-1 w-1/4 text-right align-top">12,150.00</td>
              </tr>
              <tr>
                <td className="border border-black p-1 w-1/4 align-top">IGST Amount</td>
                <td style={{ textAlign: 'center' }} className="border border-black p-1 w-1/4 text-right align-top">0.00</td>
              </tr>
              <tr>
                <td style={{ fontWeight: '700' }} className="border border-black p-1 w-1/4 align-top font-bold">Total</td>
                <td style={{ fontWeight: '700', textAlign: 'center' }} className="border border-black p-1 w-1/4 text-right align-top font-bold">159,300.00</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

export default TransactionChallan;