import { useState, useRef } from "react";
import { Upload, Download, AlertCircle, CheckCircle, FileText, X } from "lucide-react";

interface Mission {
  name: string;
  destination: string;
  startDate: string;
  durationDays: number;
  shipId: string;
  passengerCount: number;
  launchLocation: string;
  coverImage: string;
}

interface Ship {
  name: string;
  image: string;
  cargoCapacity: number;
  volumeCapacity: number;
}

interface CsvFormProps {
  activeTab: 'missions' | 'ships';
  onSubmit: (items: Mission[] | Ship[]) => void;
  onCancel: () => void;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export default function CsvForm({ activeTab, onSubmit, onCancel }: CsvFormProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CSV Headers for each type
  const missionHeaders = ['name', 'destination', 'startDate', 'durationDays', 'shipId', 'passengerCount', 'launchLocation', 'coverImage'];
  const shipHeaders = ['name', 'image', 'cargoCapacity', 'volumeCapacity'];
  
  const currentHeaders = activeTab === 'missions' ? missionHeaders : shipHeaders;

  // Generate sample CSV data
  const generateSampleCSV = () => {
    if (activeTab === 'missions') {
      return `name,destination,startDate,durationDays,shipId,passengerCount,launchLocation,coverImage
Mars Explorer,Mars,2025-12-01T10:00:00Z,365,ship-001,4,Kennedy Space Center,
Jupiter Survey,Jupiter,2026-03-15T14:30:00Z,730,ship-002,6,Baikonur Cosmodrome,
Moon Base Alpha,Moon,2025-10-20T08:00:00Z,90,ship-003,8,Cape Canaveral,`;
    } else {
      return `name,image,cargoCapacity,volumeCapacity
Starship Alpha,,50000,1000
Cosmic Voyager,,75000,1500
Nebula Explorer,,60000,1200`;
    }
  };

  const downloadSampleCSV = () => {
    const csvContent = generateSampleCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sample_${activeTab}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const validateData = (data: any[]): ValidationError[] => {
    const validationErrors: ValidationError[] = [];
    
    data.forEach((row, index) => {
      const rowNumber = index + 2; // +2 because index starts at 0 and we skip header row
      
      // Check required fields
      if (!row.name || !row.name.trim()) {
        validationErrors.push({
          row: rowNumber,
          field: 'name',
          message: 'Name is required'
        });
      }

      if (activeTab === 'missions') {
        // Mission-specific validations
        if (!row.destination || !row.destination.trim()) {
          validationErrors.push({
            row: rowNumber,
            field: 'destination',
            message: 'Destination is required'
          });
        }

        if (!row.startDate || !row.startDate.trim()) {
          validationErrors.push({
            row: rowNumber,
            field: 'startDate',
            message: 'Start date is required'
          });
        } else {
          // Validate date format
          const date = new Date(row.startDate);
          if (isNaN(date.getTime())) {
            validationErrors.push({
              row: rowNumber,
              field: 'startDate',
              message: 'Invalid date format. Use ISO format (YYYY-MM-DDTHH:mm:ssZ)'
            });
          }
        }

        // Validate numeric fields
        if (row.durationDays && isNaN(parseInt(row.durationDays))) {
          validationErrors.push({
            row: rowNumber,
            field: 'durationDays',
            message: 'Duration days must be a number'
          });
        }

        if (row.passengerCount && isNaN(parseInt(row.passengerCount))) {
          validationErrors.push({
            row: rowNumber,
            field: 'passengerCount',
            message: 'Passenger count must be a number'
          });
        }
      } else {
        // Ship-specific validations
        if (row.cargoCapacity && isNaN(parseFloat(row.cargoCapacity))) {
          validationErrors.push({
            row: rowNumber,
            field: 'cargoCapacity',
            message: 'Cargo capacity must be a number'
          });
        }

        if (row.volumeCapacity && isNaN(parseFloat(row.volumeCapacity))) {
          validationErrors.push({
            row: rowNumber,
            field: 'volumeCapacity',
            message: 'Volume capacity must be a number'
          });
        }
      }
    });

    return validationErrors;
  };

  const parseCSV = (csvText: string): any[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const row: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index]?.trim() || '';
        
        // Convert numeric fields
        if (activeTab === 'missions') {
          if (header === 'durationDays' || header === 'passengerCount') {
            row[header] = value ? parseInt(value) : 0;
          } else {
            row[header] = value;
          }
        } else {
          if (header === 'cargoCapacity' || header === 'volumeCapacity') {
            row[header] = value ? parseFloat(value) : 0;
          } else {
            row[header] = value;
          }
        }
      });
      
      data.push(row);
    }

    return data;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFileUpload = async (uploadedFile: File) => {
    if (!uploadedFile.name.toLowerCase().endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    setFile(uploadedFile);
    setIsProcessing(true);
    setErrors([]);

    try {
      const text = await uploadedFile.text();
      const parsedData = parseCSV(text);
      
      if (parsedData.length === 0) {
        alert('CSV file appears to be empty or invalid');
        return;
      }

      const validationErrors = validateData(parsedData);
      
      setCsvData(parsedData);
      setErrors(validationErrors);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      alert('Error parsing CSV file. Please check the format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleSubmit = () => {
    if (errors.length > 0) {
      alert('Please fix validation errors before submitting');
      return;
    }

    if (csvData.length === 0) {
      alert('No data to submit');
      return;
    }

    onSubmit(csvData);
  };

  const removeFile = () => {
    setFile(null);
    setCsvData([]);
    setErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-400 mb-2">CSV Upload Instructions</h3>
        <p className="text-gray-300 mb-3">
          Upload a CSV file with the following columns for {activeTab}:
        </p>
        <div className="bg-gray-800/50 rounded p-3 mb-3">
          <code className="text-sm text-green-400">
            {currentHeaders.join(', ')}
          </code>
        </div>
        <button
          onClick={downloadSampleCSV}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
        >
          <Download size={16} />
          Download Sample CSV
        </button>
      </div>

      {/* File Upload Area */}
      <div
        onDrop={handleDrop}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-500/10'
            : file
            ? 'border-green-400 bg-green-500/10'
            : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
        }`}
      >
        {!file ? (
          <div>
            <Upload size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium text-white mb-2">
              Drop your CSV file here
            </p>
            <p className="text-gray-400 mb-4">or click to browse</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
            >
              Choose File
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <FileText size={24} className="text-green-400" />
            <div className="text-left">
              <p className="font-medium text-white">{file.name}</p>
              <p className="text-sm text-gray-400">
                {csvData.length} records found
              </p>
            </div>
            <button
              onClick={removeFile}
              className="p-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <p className="text-gray-400 mt-2">Processing CSV file...</p>
        </div>
      )}

      {/* Validation Results */}
      {file && !isProcessing && (
        <div className="space-y-4">
          {errors.length === 0 ? (
            <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle size={20} className="text-green-400" />
              <span className="text-green-400 font-medium">
                Validation successful! {csvData.length} records ready to import.
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle size={20} className="text-red-400" />
                <span className="text-red-400 font-medium">
                  {errors.length} validation error(s) found:
                </span>
              </div>
              
              <div className="max-h-40 overflow-y-auto space-y-1">
                {errors.map((error, index) => (
                  <div key={index} className="text-sm text-red-300 bg-red-500/5 p-2 rounded">
                    Row {error.row}, {error.field}: {error.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Data Preview */}
      {csvData.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Data Preview</h4>
          <div className="overflow-x-auto bg-gray-800/30 rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  {currentHeaders.map(header => (
                    <th key={header} className="text-left p-3 text-gray-300 font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.slice(0, 5).map((row, index) => (
                  <tr key={index} className="border-b border-gray-700/50">
                    {currentHeaders.map(header => (
                      <td key={header} className="p-3 text-gray-300">
                        {row[header]?.toString() || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {csvData.length > 5 && (
              <p className="text-center text-gray-400 py-2 text-sm">
                ... and {csvData.length - 5} more records
              </p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-700/50">
        <button
          onClick={handleSubmit}
          disabled={!file || errors.length > 0 || csvData.length === 0}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white rounded-lg hover:from-blue-500/30 hover:to-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Import {csvData.length} {activeTab}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 py-3 px-4 bg-gray-700/50 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/70 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}