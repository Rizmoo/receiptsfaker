import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useState } from 'react';
import ReceiptForm from './components/ReceiptForm';
import ReceiptPreview from './components/ReceiptPreview';
import { DEFAULT_RECEIPT_DATA, ReceiptData } from './types';

export default function App() {
  const [receiptData, setReceiptData] = useState<ReceiptData>(DEFAULT_RECEIPT_DATA);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('receipt-print-area');
    if (!element) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 3, // High resolution
        useCORS: true, 
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdfWidth = receiptData.paperSize === '58mm' ? 58 : 80;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Receipt_${receiptData.receiptNo || 'Download'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#eef1f5] font-sans text-gray-800 overflow-hidden">
      {/* Left Sidebar: Controls */}
      <aside className="w-3/4 bg-white border-r border-gray-300 flex flex-col shrink-0 z-10 print:hidden h-full">
        <ReceiptForm data={receiptData} onChange={setReceiptData} />
      </aside>

      {/* Main Content: Preview Area */}
      <main className="w-1/4 flex flex-col print:h-auto print:overflow-visible relative h-full">
        {/* Header */}
        <header className="h-14 bg-white border-b border-gray-300 flex items-center justify-between px-8 sticky top-0 z-10 shrink-0 print:hidden">
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-300 rounded-sm"></div> Zoom: 100%
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded uppercase tracking-widest active:scale-95 transition-transform mr-2 disabled:opacity-50"
            >
              {isGenerating ? 'Saving...' : 'Save PDF'}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1 bg-gray-800 text-white text-xs font-bold rounded uppercase tracking-widest active:scale-95 transition-transform"
            >
              Print
            </button>
          </div>
        </header>

        {/* The Receipt Preview Container */}
        <div className="flex-1 bg-gray-200 relative overflow-y-auto flex items-start justify-center p-12 print:p-0 print:bg-white print:block">
          <div className="my-auto mx-auto pb-12 print:pb-0">
            <ReceiptPreview data={receiptData} />
          </div>
        </div>
      </main>
    </div>
  );
}
