import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

export default function SAPDataImport() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (file) {
      // Handle file upload logic here
      console.log('File uploaded:', file);
    } else {
      console.log('No file selected');
    }
  };

  const handleBackNavigation = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Removed Header */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 bg-gray-50 overflow-auto">
          <div className="bg-white shadow-lg rounded-2xl p-6 h-full w-full flex-grow flex items-center justify-center" style={{ minHeight: '600px', maxHeight: '1000px', marginLeft: '300px' }}>
            <div className="w-full flex flex-col items-center justify-center h-full">
              {/* Back Navigation */}
              <div className="text-lg font-bold flex items-center mb-4" style={{ justifyContent: 'flex-start', width: '100%' }} onClick={handleBackNavigation}>
                ← SAP DATA IMPORT
              </div>

              {/* Content */}
              <div className="flex flex-col items-center justify-center text-center">
                <a
                  href="#"
                  className="text-lg font-bold text-black hover:underline flex items-center justify-center mb-4"
                >
                  Import from SAP <span className="ml-1">🔗</span>
                </a>
                <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="mb-4" />
                <button
                  onClick={handleFileUpload}
                  className="text-lg font-semibold text-black hover:underline flex items-center justify-center mb-8"
                >
                  Upload File
                </button>
                <p className="text-gray-600 mt-1">Sync inventory data seamlessly.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/** Navigation Item Component */
function NavItem({ name, icon, active, disabled }) {
  return (
    <div
      className={`flex items-center space-x-2 p-2 rounded-md ${
        active
          ? 'bg-white text-teal-700 font-bold'
          : disabled
          ? 'text-gray-400 cursor-not-allowed'
          : 'hover:bg-teal-600 cursor-pointer'
      }`}
    >
      <span>{icon}</span>
      <span>{name}</span>
    </div>
  );
}