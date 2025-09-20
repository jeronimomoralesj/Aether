"use client";

import { useState, useRef } from "react";
import { QrCode, Camera, Upload, MapPin, CheckCircle, AlertCircle, Eye, Scan, RefreshCw } from "lucide-react";

export default function QR() {
  const [scanMode, setScanMode] = useState<'webcam' | 'file' | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    item_id: string;
    name: string;
    current_location: { facility: string; sub_location: string };
    success: boolean;
    message: string;
  } | null>(null);
  const [newLocation, setNewLocation] = useState({
    facility: "",
    sub_location: ""
  });
  const [updateMode, setUpdateMode] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const facilities = [
    "Moon Station",
    "Warehouse Hawthorne", 
    "Mars Base Alpha",
    "ISS",
    "Lunar Gateway"
  ];

  const mockItems: Record<string, any> = {
    "O2T-001": {
      item_id: "O2T-001",
      name: "Oxygen Tank",
      mass_kg: 1.25,
      volume_m3: 0.0175,
      criticality: 10,
      category: "Life Support",
      facility: "Moon Station",
      sub_location: "Bay 1",
      mission_id: "Artemis III"
    },
    "WR-002": {
      item_id: "WR-002",
      name: "Water Recycler",
      mass_kg: 45.5,
      volume_m3: 0.125,
      criticality: 9,
      category: "Life Support",
      facility: "Warehouse Hawthorne",
      sub_location: "Bay 2",
      mission_id: null
    }
  };

  const startWebcamScan = async () => {
    try {
      setScanMode('webcam');
      setScanning(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Simulate QR detection after 3 seconds
      setTimeout(() => {
        simulateQRDetection("O2T-001");
        stopWebcam();
      }, 3000);

    } catch (error) {
      alert("Camera access denied or not available");
      setScanMode(null);
      setScanning(false);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setScanMode('file');
    setScanning(true);

    // Simulate QR processing from image
    setTimeout(() => {
      simulateQRDetection("WR-002");
      setScanning(false);
    }, 2000);
  };

  const simulateQRDetection = (itemId: string) => {
    const item = mockItems[itemId];
    if (item) {
      setScanResult({
        item_id: itemId,
        name: item.name,
        current_location: {
          facility: item.facility,
          sub_location: item.sub_location
        },
        success: true,
        message: "QR code successfully scanned and decoded"
      });
      setNewLocation({
        facility: item.facility,
        sub_location: item.sub_location
      });
    } else {
      setScanResult({
        item_id: itemId,
        name: "Unknown Item",
        current_location: { facility: "Unknown", sub_location: "Unknown" },
        success: false,
        message: "Item not found in inventory database"
      });
    }
  };

  const updateLocation = async () => {
    if (!scanResult || !newLocation.facility || !newLocation.sub_location) {
      alert("Please fill in both facility and sub-location");
      return;
    }

    setScanning(true);

    try {
      // Simulate API call to update location
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update mock data
      if (mockItems[scanResult.item_id]) {
        mockItems[scanResult.item_id].facility = newLocation.facility;
        mockItems[scanResult.item_id].sub_location = newLocation.sub_location;
      }

      alert(`${scanResult.item_id} moved to ${newLocation.facility} - ${newLocation.sub_location}`);
      
      // Reset states
      setScanResult(null);
      setNewLocation({ facility: "", sub_location: "" });
      setUpdateMode(false);
      setScanMode(null);

    } catch (error) {
      alert("Failed to update location. Please try again.");
    } finally {
      setScanning(false);
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setScanMode(null);
    setNewLocation({ facility: "", sub_location: "" });
    setUpdateMode(false);
    setScanning(false);
    stopWebcam();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-yellow-500/20 rounded-lg">
          <QrCode className="w-6 h-6 text-yellow-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">QR Scanner</h2>
          <p className="text-gray-400">Scan items to track location changes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner Panel */}
        <div className="space-y-6">
          {/* Scan Options */}
          {!scanMode && !scanResult && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Choose Scan Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={startWebcamScan}
                  className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-500/20 to-blue-600/20 
                           border border-blue-500/30 rounded-xl hover:from-blue-500/30 hover:to-blue-600/30
                           transition-all duration-200 group"
                >
                  <Camera className="w-12 h-12 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="text-white font-medium mb-1">Camera Scan</h4>
                  <p className="text-gray-400 text-sm text-center">Use device camera to scan QR codes in real-time</p>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center p-6 bg-gradient-to-br from-green-500/20 to-green-600/20 
                           border border-green-500/30 rounded-xl hover:from-green-500/30 hover:to-green-600/30
                           transition-all duration-200 group"
                >
                  <Upload className="w-12 h-12 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="text-white font-medium mb-1">Upload Image</h4>
                  <p className="text-gray-400 text-sm text-center">Upload a photo containing a QR code</p>
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Webcam View */}
          {scanMode === 'webcam' && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Scan className="w-5 h-5 text-blue-400 mr-2" />
                  Camera Scanner
                </h3>
                <button
                  onClick={stopWebcam}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                
                {/* Scanning Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-yellow-400 bg-yellow-400/10 rounded-lg relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-yellow-400"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-yellow-400"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-yellow-400"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-yellow-400"></div>
                    
                    {scanning && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-pulse w-4 h-4 bg-yellow-400 rounded-full mx-auto mb-2"></div>
                          <p className="text-yellow-400 text-sm font-medium">Scanning...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm text-center mt-4">
                Position the QR code within the scanning area
              </p>
            </div>
          )}

          {/* File Upload Processing */}
          {scanMode === 'file' && scanning && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
              <div className="text-center">
                <div className="animate-spin w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-white mb-2">Processing Image</h3>
                <p className="text-gray-400">Analyzing uploaded image for QR codes...</p>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Eye className="w-5 h-5 text-gray-400 mr-2" />
              Scanner Tips
            </h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• Ensure QR code is clearly visible and well-lit</p>
              <p>• Hold device steady for better recognition</p>
              <p>• QR codes work best when filling the scan area</p>
              <p>• Clean camera lens if having trouble scanning</p>
              <p>• Both webcam and file upload methods supported</p>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {scanResult && (
            <>
              {/* Scan Result */}
              <div className={`bg-gray-800/50 border rounded-xl p-6 ${
                scanResult.success 
                  ? 'border-green-500/50' 
                  : 'border-red-500/50'
              }`}>
                <div className="flex items-center space-x-3 mb-4">
                  {scanResult.success ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-400" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-white">Scan Result</h3>
                    <p className={`text-sm ${scanResult.success ? 'text-green-400' : 'text-red-400'}`}>
                      {scanResult.message}
                    </p>
                  </div>
                </div>

                {scanResult.success && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-700/30 rounded-lg">
                      <div>
                        <p className="text-gray-400 text-sm">Item ID</p>
                        <p className="text-blue-400 font-mono font-medium">{scanResult.item_id}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Name</p>
                        <p className="text-white font-medium">{scanResult.name}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-700/30 rounded-lg">
                      <p className="text-gray-400 text-sm mb-2">Current Location</p>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-yellow-400" />
                        <span className="text-white">
                          {scanResult.current_location.facility} - {scanResult.current_location.sub_location}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Location Update */}
              {scanResult.success && (
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <MapPin className="w-5 h-5 text-yellow-400 mr-2" />
                    Update Location
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        New Facility
                      </label>
                      <select
                        value={newLocation.facility}
                        onChange={(e) => setNewLocation({...newLocation, facility: e.target.value})}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white 
                                 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      >
                        <option value="">Select facility</option>
                        {facilities.map(facility => (
                          <option key={facility} value={facility}>{facility}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        New Sub-Location
                      </label>
                      <input
                        type="text"
                        value={newLocation.sub_location}
                        onChange={(e) => setNewLocation({...newLocation, sub_location: e.target.value})}
                        placeholder="e.g., Bay 1, Rack A3, Storage Unit 5"
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white 
                                 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <button
                        onClick={updateLocation}
                        disabled={scanning || !newLocation.facility || !newLocation.sub_location}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2
                                  ${scanning || !newLocation.facility || !newLocation.sub_location
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black hover:shadow-lg hover:shadow-yellow-500/25'
                                  }`}
                      >
                        {scanning ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4" />
                            <span>Update Location</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={resetScan}
                        className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 
                                 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* No Results State */}
          {!scanResult && !scanMode && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-12 text-center">
              <QrCode className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Ready to Scan</h3>
              <p className="text-gray-400 mb-6">
                Choose a scanning method to start tracking item locations.
              </p>
              <div className="text-left bg-gray-900/50 rounded-lg p-4 text-sm text-gray-300">
                <h4 className="font-medium text-white mb-2">Scanner capabilities:</h4>
                <ul className="space-y-1">
                  <li>• Real-time webcam QR recognition</li>
                  <li>• Upload and process QR code images</li>
                  <li>• Instant item identification and lookup</li>
                  <li>• Update facility and sub-location tracking</li>
                  <li>• Automatic audit logging for compliance</li>
                </ul>
              </div>
            </div>
          )}

          {/* Recent Scans (Mock) */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Recent Scans</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">O2T-001 moved to Moon Station - Bay 2</p>
                    <p className="text-gray-400 text-xs">5 minutes ago</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">WR-002 scanned in Warehouse Hawthorne</p>
                    <p className="text-gray-400 text-xs">12 minutes ago</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">SP-003 moved to Mars Base Alpha - Solar Array</p>
                    <p className="text-gray-400 text-xs">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}