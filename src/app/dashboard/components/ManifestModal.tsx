"use client";

import { X, Download } from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ManifestItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  weight: number;
  dimensions: string;
  priority: string;
  location: string;
  status: string;
  description?: string;
}

interface ManifestModalProps {
  isOpen: boolean;
  onClose: () => void;
  manifest: {
    id: string;
    name: string;
    items: ManifestItem[];
    totalWeight: number;
    totalItems: number;
    createdDate: string;
    mission: string;
  };
}

export default function ManifestModal({ isOpen, onClose, manifest }: ManifestModalProps) {
  if (!isOpen) return null;

  const downloadAsPDF = async () => {
    const element = document.getElementById('manifest-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${manifest.name}_manifest.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Manifest Details</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={downloadAsPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                       text-white rounded-lg transition-colors duration-200"
            >
              <Download size={16} />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 
                       transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div id="manifest-content" className="bg-white text-black p-8 rounded-lg">
            {/* Manifest Header */}
            <div className="mb-8 border-b border-gray-300 pb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{manifest.name}</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Mission:</span>
                  <p className="text-gray-900">{manifest.mission}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Created:</span>
                  <p className="text-gray-900">{manifest.createdDate}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Total Items:</span>
                  <p className="text-gray-900">{manifest.totalItems}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Total Weight:</span>
                  <p className="text-gray-900">{manifest.totalWeight} kg</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Item Name</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Category</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Quantity</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Weight (kg)</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Dimensions</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Priority</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Location</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {manifest.items.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          {item.description && (
                            <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-900">{item.category}</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-900">{item.quantity}</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-900">{item.weight}</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-900">{item.dimensions}</td>
                      <td className="border border-gray-300 px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.priority === 'High' ? 'bg-red-100 text-red-800' :
                          item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-900">{item.location}</td>
                      <td className="border border-gray-300 px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Loaded' ? 'bg-green-100 text-green-800' :
                          item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="mt-8 pt-6 border-t border-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{manifest.totalItems}</div>
                  <div className="text-gray-600">Total Items</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{manifest.totalWeight} kg</div>
                  <div className="text-gray-600">Total Weight</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{manifest.items.filter(item => item.status === 'Loaded').length}</div>
                  <div className="text-gray-600">Items Loaded</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}