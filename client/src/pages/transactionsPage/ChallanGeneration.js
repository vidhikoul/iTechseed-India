import React, { useState, useEffect } from 'react';
import './ChallanGeneration.css';
import Sidebar from '../../components/Sidebar';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import axios from 'axios';

function ChallanGeneration() {
  const [customers, setCustomers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [nextChallanNo, setNextChallanNo] = useState('');

  const [formData, setFormData] = useState({
    challan_no: '',
    challan_date: new Date().toISOString().split('T')[0],
    customer_id: '',
    vendor_code: '',
    vendor_name: '',
    vendor_address: '',
    gstin_no: '',
    pan_no: '',
    vehicle_no: '',
    transporter: '',
    emp_code: '',
    emp_name: '',
    material_code: '',
    material_description: '',
    hsn_code: '',
    pallet_count: '',
    basic_amount: 0,
    taxable_amount: 0,
    cgst_rate: 0,
    sgst_rate: 0,
    igst_rate: 0,
    cgst_amount: 0,
    sgst_amount: 0,
    igst_amount: 0,
    total_amount: 0,
    remarks: '',
    digitally_signed_by: 'System Admin',
    signed_on: new Date().toISOString(),
    authorised_by: 'Dana India Pvt. Ltd.'
  });

  // Fetch customers, materials, and next challan number on component mount
  useEffect(() => {
    fetchCustomers();
    fetchMaterials();
    fetchNextChallanNo();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api/clients');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api/materials');
      setMaterials(response.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const fetchNextChallanNo = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api/challans/next-number');
      const nextNo = response.data.nextChallanNo;
      setNextChallanNo(nextNo);
      setFormData(prev => ({ ...prev, challan_no: nextNo }));
    } catch (error) {
      console.error('Error fetching next challan number:', error);
      // Fallback: generate a default challan number
      const defaultNo = `CH${Date.now()}`;
      setNextChallanNo(defaultNo);
      setFormData(prev => ({ ...prev, challan_no: defaultNo }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-fill customer details when customer is selected
    if (name === 'customer_id') {
      const selectedCustomer = customers.find(customer => customer.customer_id === value);
      if (selectedCustomer) {
        setFormData(prev => ({
          ...prev,
          vendor_code: selectedCustomer.customer_id,
          vendor_name: selectedCustomer.customer_name,
          vendor_address: `${selectedCustomer.address_1}, ${selectedCustomer.address_2}, ${selectedCustomer.city}, ${selectedCustomer.postal_code}`,
          gstin_no: selectedCustomer.gstin,
          pan_no: selectedCustomer.pan_no
        }));
      }
    }

    // Auto-fill material details when material is selected
    if (name === 'material_code') {
      const selectedMaterial = materials.find(material => material.material_code === value);
      if (selectedMaterial) {
        setFormData(prev => ({
          ...prev,
          material_description: selectedMaterial.material_description,
          hsn_code: selectedMaterial.hsn_code,
          basic_amount: selectedMaterial.unit_price || 0,
          cgst_rate: selectedMaterial.cgst_rate || 9,
          sgst_rate: selectedMaterial.sgst_rate || 9,
          igst_rate: selectedMaterial.igst_rate || 0
        }));
      }
    }

    // Calculate amounts when quantity or rates change
    if (name === 'pallet_count' || name === 'basic_amount' || name === 'cgst_rate' || name === 'sgst_rate' || name === 'igst_rate') {
      calculateAmounts();
    }
  };

  const calculateAmounts = () => {
    setTimeout(() => {
      setFormData(prev => {
        const quantity = parseFloat(prev.pallet_count) || 0;
        const basicAmount = parseFloat(prev.basic_amount) || 0;
        const cgstRate = parseFloat(prev.cgst_rate) || 0;
        const sgstRate = parseFloat(prev.sgst_rate) || 0;
        const igstRate = parseFloat(prev.igst_rate) || 0;

        const taxableAmount = quantity * basicAmount;
        const cgstAmount = (taxableAmount * cgstRate) / 100;
        const sgstAmount = (taxableAmount * sgstRate) / 100;
        const igstAmount = (taxableAmount * igstRate) / 100;
        const totalAmount = taxableAmount + cgstAmount + sgstAmount + igstAmount;

        return {
          ...prev,
          taxable_amount: taxableAmount,
          cgst_amount: cgstAmount,
          sgst_amount: sgstAmount,
          igst_amount: igstAmount,
          total_amount: totalAmount
        };
      });
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8800/api/challans', formData);
      alert("Challan generated successfully!");
      // Reset form and fetch next challan number
      setFormData({
        challan_no: '',
        challan_date: new Date().toISOString().split('T')[0],
        customer_id: '',
        vendor_code: '',
        vendor_name: '',
        vendor_address: '',
        gstin_no: '',
        pan_no: '',
        vehicle_no: '',
        transporter: '',
        emp_code: '',
        emp_name: '',
        material_code: '',
        material_description: '',
        hsn_code: '',
        pallet_count: '',
        basic_amount: 0,
        taxable_amount: 0,
        cgst_rate: 0,
        sgst_rate: 0,
        igst_rate: 0,
        cgst_amount: 0,
        sgst_amount: 0,
        igst_amount: 0,
        total_amount: 0,
        remarks: '',
        digitally_signed_by: 'System Admin',
        signed_on: new Date().toISOString(),
        authorised_by: 'Dana India Pvt. Ltd.'
      });
      fetchNextChallanNo();
    } catch (err) {
      console.error("Error generating challan", err);
      alert("Failed to generate challan");
    }
  };

  return (
    <div className="d-flex">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="content-container flex-grow-1 p-3">
        <div className="container">
          <h2 className="title">Generate Delivery Challan</h2>
          
          <Form id="challan_form" onSubmit={handleSubmit}>
            {/* Challan Basic Info */}
            <Row className="mb-3">
              <Col>
                <Form.Label>Challan No.</Form.Label>
                <Form.Control 
                  name="challan_no" 
                  value={formData.challan_no} 
                  onChange={handleChange}
                  readOnly
                  style={{ backgroundColor: '#f8f9fa' }}
                />
              </Col>
              <Col>
                <Form.Label>Challan Date</Form.Label>
                <Form.Control 
                  type="date"
                  name="challan_date" 
                  value={formData.challan_date} 
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col>
                <Form.Label>Customer</Form.Label>
                <Form.Select 
                  name="customer_id" 
                  value={formData.customer_id} 
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map(customer => (
                    <option key={customer.customer_id} value={customer.customer_id}>
                      {customer.customer_name} ({customer.customer_id})
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            {/* Customer Details (Auto-filled) */}
            <Row className="mb-3">
              <Col>
                <Form.Label>Vendor Code</Form.Label>
                <Form.Control 
                  name="vendor_code" 
                  value={formData.vendor_code} 
                  onChange={handleChange}
                  readOnly
                  style={{ backgroundColor: '#f8f9fa' }}
                />
              </Col>
              <Col>
                <Form.Label>Vendor Name</Form.Label>
                <Form.Control 
                  name="vendor_name" 
                  value={formData.vendor_name} 
                  onChange={handleChange}
                  readOnly
                  style={{ backgroundColor: '#f8f9fa' }}
                />
              </Col>
              <Col>
                <Form.Label>GSTIN No.</Form.Label>
                <Form.Control 
                  name="gstin_no" 
                  value={formData.gstin_no} 
                  onChange={handleChange}
                  readOnly
                  style={{ backgroundColor: '#f8f9fa' }}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Vendor Address</Form.Label>
                <Form.Control 
                  as="textarea"
                  rows={2}
                  name="vendor_address" 
                  value={formData.vendor_address} 
                  onChange={handleChange}
                  readOnly
                  style={{ backgroundColor: '#f8f9fa' }}
                />
              </Col>
              <Col>
                <Form.Label>PAN No.</Form.Label>
                <Form.Control 
                  name="pan_no" 
                  value={formData.pan_no} 
                  onChange={handleChange}
                  readOnly
                  style={{ backgroundColor: '#f8f9fa' }}
                />
              </Col>
            </Row>

            {/* Transport Details */}
            <Row className="mb-3">
              <Col>
                <Form.Label>Vehicle No.</Form.Label>
                <Form.Control 
                  name="vehicle_no" 
                  value={formData.vehicle_no} 
                  onChange={handleChange}
                  placeholder="e.g., MH12AB1234"
                  required
                />
              </Col>
              <Col>
                <Form.Label>Transporter</Form.Label>
                <Form.Control 
                  name="transporter" 
                  value={formData.transporter} 
                  onChange={handleChange}
                  placeholder="Transporter Name"
                  required
                />
              </Col>
              <Col>
                <Form.Label>Employee Code</Form.Label>
                <Form.Control 
                  name="emp_code" 
                  value={formData.emp_code} 
                  onChange={handleChange}
                  placeholder="EMP001"
                  required
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Employee Name</Form.Label>
                <Form.Control 
                  name="emp_name" 
                  value={formData.emp_name} 
                  onChange={handleChange}
                  placeholder="Employee Name"
                  required
                />
              </Col>
            </Row>

            {/* Material Details */}
            <Row className="mb-3">
              <Col>
                <Form.Label>Material Code</Form.Label>
                <Form.Select 
                  name="material_code" 
                  value={formData.material_code} 
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Material</option>
                  {materials.map(material => (
                    <option key={material.material_code} value={material.material_code}>
                      {material.material_code} - {material.material_description}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col>
                <Form.Label>Material Description</Form.Label>
                <Form.Control 
                  name="material_description" 
                  value={formData.material_description} 
                  onChange={handleChange}
                  readOnly
                  style={{ backgroundColor: '#f8f9fa' }}
                />
              </Col>
              <Col>
                <Form.Label>HSN Code</Form.Label>
                <Form.Control 
                  name="hsn_code" 
                  value={formData.hsn_code} 
                  onChange={handleChange}
                  readOnly
                  style={{ backgroundColor: '#f8f9fa' }}
                />
              </Col>
            </Row>

            {/* Quantity and Pricing */}
            <Row className="mb-3">
              <Col>
                <Form.Label>Quantity (Pallets)</Form.Label>
                <Form.Control 
                  type="number"
                  name="pallet_count" 
                  value={formData.pallet_count} 
                  onChange={handleChange}
                  placeholder="0"
                  min="1"
                  required
                />
              </Col>
              <Col>
                <Form.Label>Unit Price</Form.Label>
                <Form.Control 
                  type="number"
                  step="0.01"
                  name="basic_amount" 
                  value={formData.basic_amount} 
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </Col>
              <Col>
                <Form.Label>Taxable Amount</Form.Label>
                <Form.Control 
                  type="number"
                  step="0.01"
                  name="taxable_amount" 
                  value={formData.taxable_amount.toFixed(2)} 
                  readOnly
                  style={{ backgroundColor: '#f8f9fa' }}
                />
              </Col>
            </Row>

            {/* Tax Details */}
            <Row className="mb-3">
              <Col>
                <Form.Label>CGST Rate (%)</Form.Label>
                <Form.Control 
                  type="number"
                  step="0.01"
                  name="cgst_rate" 
                  value={formData.cgst_rate} 
                  onChange={handleChange}
                  placeholder="9"
                />
              </Col>
              <Col>
                <Form.Label>CGST Amount</Form.Label>
                <Form.Control 
                  type="number"
                  step="0.01"
                  name="cgst_amount" 
                  value={formData.cgst_amount.toFixed(2)} 
                  readOnly
                  style={{ backgroundColor: '#f8f9fa' }}
                />
              </Col>
              <Col>
                <Form.Label>SGST Rate (%)</Form.Label>
                <Form.Control 
                  type="number"
                  step="0.01"
                  name="sgst_rate" 
                  value={formData.sgst_rate} 
                  onChange={handleChange}
                  placeholder="9"
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>SGST Amount</Form.Label>
                <Form.Control 
                  type="number"
                  step="0.01"
                  name="sgst_amount" 
                  value={formData.sgst_amount.toFixed(2)} 
                  readOnly
                  style={{ backgroundColor: '#f8f9fa' }}
                />
              </Col>
              <Col>
                <Form.Label>IGST Rate (%)</Form.Label>
                <Form.Control 
                  type="number"
                  step="0.01"
                  name="igst_rate" 
                  value={formData.igst_rate} 
                  onChange={handleChange}
                  placeholder="0"
                />
              </Col>
              <Col>
                <Form.Label>IGST Amount</Form.Label>
                <Form.Control 
                  type="number"
                  step="0.01"
                  name="igst_amount" 
                  value={formData.igst_amount.toFixed(2)} 
                  readOnly
                  style={{ backgroundColor: '#f8f9fa' }}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Total Amount</Form.Label>
                <Form.Control 
                  type="number"
                  step="0.01"
                  name="total_amount" 
                  value={formData.total_amount.toFixed(2)} 
                  readOnly
                  style={{ backgroundColor: '#f8f9fa', fontSize: '16px', fontWeight: 'bold' }}
                />
              </Col>
              <Col md={8}>
                <Form.Label>Remarks</Form.Label>
                <Form.Control 
                  as="textarea"
                  rows={2}
                  name="remarks" 
                  value={formData.remarks} 
                  onChange={handleChange}
                  placeholder="Additional remarks or notes"
                />
              </Col>
            </Row>

            {/* Digital Signature Info */}
            <Row className="mb-3">
              <Col>
                <Form.Label>Digitally Signed By</Form.Label>
                <Form.Control 
                  name="digitally_signed_by" 
                  value={formData.digitally_signed_by} 
                  onChange={handleChange}
                />
              </Col>
              <Col>
                <Form.Label>Authorised By</Form.Label>
                <Form.Control 
                  name="authorised_by" 
                  value={formData.authorised_by} 
                  onChange={handleChange}
                />
              </Col>
              <Col className="d-flex align-items-end">
                <Button variant="primary" type="submit" size="lg">
                  Generate Challan
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default ChallanGeneration;