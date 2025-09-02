import React, { useState, useCallback } from 'react';
import type { InvoiceFormData, InvoiceData } from './types';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';

function App() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  const generateInvoiceNumber = () => {
    const randomPart = Math.floor(100000 + Math.random() * 900000);
    return `FFCDCBIA24${randomPart}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Adjust for timezone offset to prevent date from changing
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);

    return adjustedDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
  };

  const handleGenerateInvoice = useCallback((formData: InvoiceFormData) => {
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    const totalAmount = price;
    const netAmount = totalAmount / 1.05;
    const cgst = netAmount * 0.025;
    const sgst = netAmount * 0.025;

    setInvoiceData({
      ...formData,
      totalAmount,
      netAmount,
      cgst,
      sgst,
      invoiceNumber: generateInvoiceNumber(),
      formattedDate: formatDate(formData.invoiceDate),
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="bg-white shadow-sm print:hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Uber Invoice Generator</h1>
          <p className="text-gray-500 mt-1">Create professional-looking ride invoices instantly.</p>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:max-w-none">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 print:block">
          <div className="lg:col-span-2 print:hidden">
            <InvoiceForm onGenerate={handleGenerateInvoice} />
          </div>
          <div className="lg:col-span-3">
            {invoiceData ? (
              <InvoicePreview data={invoiceData} />
            ) : (
              <div className="flex items-center justify-center bg-white h-full rounded-lg shadow-md border border-gray-200 min-h-[600px]">
                <div className="text-center p-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  <h2 className="mt-4 text-xl font-medium text-gray-900">Invoice Preview</h2>
                  <p className="mt-1 text-sm text-gray-500">Fill out the form to see your invoice here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;