"use client";

import { useState, useRef } from "react";
import { Upload, FileText, Download, AlertCircle, CheckCircle, X, Eye, FileSpreadsheet } from "lucide-react";

export default function Bulk() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: number;
    errors: Array<{ row: number; message: string }>;
    preview?: Array<any>;
  } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const csvTemplate = `name,mass_kg,volume_m3,criticality,category,unit,facility,sub_location,mission_id,is_reserve
Oxygen Tank,1.25,0.0175,10,Life Support,kg,Moon Station,Bay 1,Artemis III,false
Water Recycler,45.5,0.125,9,Life Support,kg,Moon Station,Bay 2,Artemis III,false
Solar Panel,12.8,0.085,8,Power Systems,units,Warehouse Hawthorne,Rack A3,,false
Navigation Computer,3.2,0.012,9,Navigation,units,Moon Station,Control Room,Artemis III,true
Emergency Beacon,0.8,0.005,10,Communication,units,Moon Station,Bay 1,Artemis III,false`;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }
    setFile(selectedFile);
    setUploadResult(null);
  };

  const validateCsvRow = (row: any, rowIndex: number) => {
    const errors = [];
    
    if (!row.name?.trim()) errors.push(`Row ${rowIndex + 2}: Name is required`);
    if (!row.mass_kg || isNaN(parseFloat(row.mass_kg)) || parseFloat(row.mass_kg) <= 0) {
      errors.push(`Row ${rowIndex + 2}: Mass must be a positive number`);
    }
    if (!row.volume_m3 || isNaN(parseFloat(row.volume_m3)) || parseFloat(row.volume_m3) <= 0) {
      errors.push(`Row ${rowIndex + 2}: Volume must be a positive number`);
    }
    if (!row.criticality || isNaN(parseInt(row.criticality)) || parseInt(row.criticality) < 1 || parseInt(row.criticality) > 10) {
      errors.push(`Row ${rowIndex + 2}: Criticality must be between 1-10`);
    }
    if (!row.category?.trim()) errors.push(`Row ${rowIndex + 2}: Category is required`);
    if (!row.facility?.trim()) errors.push(`Row ${rowIndex + 2}: Facility is required`);
    if (!row.sub_location?.trim()) errors.push(`Row ${rowIndex + 2}: Sub-location is required`);
    
    return errors;
  };

  const processFile = async () => {
    if (!file) return;

    setUploading(true);
    
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV file must contain header and at least one data row');
      }

      // Parse CSV (simple implementation - for production use Papa Parse)
      const headers = lines[0].split(',').map(h => h.trim());
      const requiredHeaders = ['name', 'mass_kg', 'volume_m3', 'criticality', 'category', 'unit', 'facility', 'sub_location'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
      }

      const rows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });

      // Validate data
      const allErrors: Array<{ row: number; message: string }> = [];
      const validRows: any[] = [];

      rows.forEach((row, index) => {
        const errors = validateCsvRow(row, index);
        if (errors.length > 0) {
          errors.forEach(error => allErrors.push({ row: index + 2, message: error }));
        } else {
          // Generate mock item ID
          const itemId = `${row.category.substring(0, 2).toUpperCase()}T-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
          validRows.push({ ...row, item_id: itemId });
        }
      });

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setUploadResult({
        success: validRows.length,
        errors: allErrors,
        preview: validRows.slice(0, 10) // Show first 10 items
      });

      if (validRows.length > 0) {
        // Simulate successful upload
        alert(`Successfully uploaded ${validRows.length} items! QR codes generated and saved to S3.`);
      }

    } catch (error) {
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setUploadResult({ success: 0, errors: [{ row: 0, message: error instanceof Error ? error.message : 'Unknown error' }] });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const downloadQRCodes = () => {
    alert('QR codes would be downloaded as ZIP file from S3');
  };

  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Upload className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Bulk Upload</h2>
          <p className="text-gray-400">Upload multiple inventory items via CSV file</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Instructions and Template Download */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <FileSpreadsheet className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">CSV Format Requirements</h3>
              <div className="space-y-2 text-gray-300 text-sm">
                <p>• File must be in CSV format with comma separators</p>
                <p>• Maximum file size: 10MB (approximately 10,000+ items)</p>
                <p>• Required columns: name, mass_kg, volume_m3, criticality, category, unit, facility, sub_location</p>
                <p>• Optional columns: mission_id, is_reserve</p>
                <p>• Criticality must be between 1-10</p>
                <p>• Mass and volume must be positive numbers</p>
              </div>
              <button
                onClick={downloadTemplate}
                className="mt-4 flex items-center px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 
                         text-blue-400 rounded-lg transition-colors duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </button>
            </div>
          </div>
        </div>

        {/* File Upload Area */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
                      ${dragActive 
                        ? 'border-blue-400 bg-blue-400/10' 
                        : file 
                          ? 'border-green-400 bg-green-400/10' 
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="space-y-4">
              {file ? (
                <div className="flex items-center justify-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                  <div className="text-left">
                    <p className="text-green-400 font-medium">{file.name}</p>
                    <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className={`w-12 h-12 mx-auto ${dragActive ? 'text-blue-400' : 'text-gray-400'}`} />
                  <div>
                    <p className="text-white font-medium">
                      {dragActive ? 'Drop your CSV file here' : 'Drag & drop your CSV file here'}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      or <span className="text-blue-400 hover:text-blue-300 cursor-pointer">browse files</span>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Upload Actions */}
          {file && (
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={() => {
                  setFile(null);
                  setUploadResult(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 
                         transition-colors duration-200"
              >
                Remove File
              </button>
              <button
                onClick={processFile}
                disabled={uploading}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2
                          ${uploading 
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/25'
                          }`}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload & Process</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Upload Results */}
        {uploadResult && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Upload Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-green-400 font-medium">Successfully Added</p>
                    <p className="text-2xl font-bold text-white">{uploadResult.success}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                  <div>
                    <p className="text-red-400 font-medium">Errors</p>
                    <p className="text-2xl font-bold text-white">{uploadResult.errors.length}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {uploadResult.success > 0 && (
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={downloadQRCodes}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 
                             hover:from-green-600 hover:to-green-700 text-white rounded-xl
                             transition-all duration-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Codes (ZIP)
                  </button>
                  {uploadResult.preview && (
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="flex items-center px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 
                               text-blue-400 rounded-xl transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Errors */}
            {uploadResult.errors.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-red-400 mb-4">Validation Errors</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {uploadResult.errors.map((error, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-red-500/5 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-300 text-sm">{error.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preview */}
            {showPreview && uploadResult.preview && uploadResult.preview.length > 0 && (
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Preview (First 10 items)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-700/30">
                      <tr className="text-left">
                        <th className="px-3 py-2 text-gray-300">Item ID</th>
                        <th className="px-3 py-2 text-gray-300">Name</th>
                        <th className="px-3 py-2 text-gray-300">Mass</th>
                        <th className="px-3 py-2 text-gray-300">Category</th>
                        <th className="px-3 py-2 text-gray-300">Facility</th>
                        <th className="px-3 py-2 text-gray-300">Mission</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/30">
                      {uploadResult.preview.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-700/20">
                          <td className="px-3 py-2 text-blue-400 font-mono text-xs">{item.item_id}</td>
                          <td className="px-3 py-2 text-white">{item.name}</td>
                          <td className="px-3 py-2 text-gray-300">{item.mass_kg} {item.unit}</td>
                          <td className="px-3 py-2 text-gray-300">{item.category}</td>
                          <td className="px-3 py-2 text-gray-300">{item.facility}</td>
                          <td className="px-3 py-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                              ${item.mission_id 
                                ? 'text-green-400 bg-green-500/20' 
                                : 'text-gray-400 bg-gray-500/20'
                              }`}>
                              {item.mission_id || "Unassigned"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-3">Need Help?</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <h5 className="font-medium text-white mb-2">Common Issues:</h5>
              <ul className="space-y-1">
                <li>• Ensure CSV uses comma separators</li>
                <li>• Check for missing required columns</li>
                <li>• Verify numeric values are valid</li>
                <li>• Remove special characters from text fields</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-white mb-2">Processing:</h5>
              <ul className="space-y-1">
                <li>• Each item gets a unique UUID</li>
                <li>• QR codes generated automatically</li>
                <li>• Items logged to audit trail</li>
                <li>• Failed items can be fixed and re-uploaded</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}