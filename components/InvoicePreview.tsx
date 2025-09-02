import React, { useRef } from 'react';
import type { InvoiceData } from '../types';
import esign from '../images/esign.png';

interface InvoicePreviewProps {
    data: InvoiceData;
}

const PrintIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm7-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
);

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data }) => {
    const invoiceRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };
    
    const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

    return (
        <div>
            <div className="flex justify-end mb-4 print:hidden">
                <button
                    onClick={handlePrint}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <PrintIcon />
                    Print / Save as PDF
                </button>
            </div>
            <div ref={invoiceRef} className="bg-white p-8 sm:p-12 shadow-lg rounded-lg border border-gray-200 text-sm font-['ui-sans-serif', 'system-ui', 'sans-serif'] text-black print:shadow-none print:border-none print:rounded-none print:w-[210mm] print:min-h-[297mm] print:p-[1.5cm] print:flex print:flex-col">
                <div>
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h3 className="font">{data.customerName}</h3>
                            <p className="break-words max-w-xs print:max-w-xs whitespace-pre-line">Pick up address: {data.pickupAddress}</p>
                        </div>
                        <h2 className="text-xl font text-right">Tax Invoice</h2>
                    </div>

                    <div className="flex justify-between mb-10">
                        <div>
                            <p><span className="font">Invoice number:</span> {data.invoiceNumber}</p>
                            <p><span className="font">Invoice date:</span> {data.formattedDate}</p>
                            <p><span className="font">Place of supply (Name of state):</span> Karnataka</p>
                            <p><span className="font">HSN Code:</span> 996412</p>
                            <p><span className="font">Category of services:</span> Passenger Transport Services</p>
                            <p><span className="font">Tax is payable on reverse charge basis:</span> No</p>
                        </div>
                        <div className="text-right">
                            <p>Invoice issued by Uber India Systems Private</p>
                            <p>Limited on behalf of:</p>
                            <p className="font mt-2">{data.driverName.toUpperCase()}</p>
                            <p>Bangalore</p>
                            <p>India</p>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="border-b-2 border-black mb-1">
                        <div className="grid grid-cols-12 gap-2 font-bold py-2">
                            <div className="col-span-3">Tax Point Date</div>
                            <div className="col-span-3">Description</div>
                            <div className="col-span-1 text-center">Qty</div>
                            <div className="col-span-2">Tax</div>
                            <div className="col-span-1 text-right">Tax Amount</div>
                            <div className="col-span-2 text-right">Net amount</div>
                        </div>
                    </div>
                    <div className="border-b border-black">
                         <div className="grid grid-cols-12 gap-2 py-2">
                            <div className="col-span-3">{data.formattedDate}</div>
                            <div className="col-span-3">Transportation service fare</div>
                            <div className="col-span-1 text-center">1</div>
                            <div className="col-span-2">
                                <p>SGST/UTGST 2.5%</p>
                                <p>CGST 2.5%</p>
                            </div>
                            <div className="col-span-1 text-right">
                               <p>{formatCurrency(data.sgst)}</p>
                               <p>{formatCurrency(data.cgst)}</p>
                            </div>
                            <div className="col-span-2 text-right">
                                <p>{formatCurrency(data.netAmount)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Totals Section */}
                    <div className="flex justify-end mt-4">
                        <div className="w-full max-w-xs space-y-2">
                            <div className="flex justify-between">
                                <span>Total net amount</span>
                                <span>{formatCurrency(data.netAmount)}</span>
                            </div>
                             <div className="flex justify-between">
                                <span>Total CGST 2.5%</span>
                                <span>{formatCurrency(data.cgst)}</span>
                            </div>
                             <div className="flex justify-between">
                                <span>Total SGST/UTGST 2.5%</span>
                                <span>{formatCurrency(data.sgst)}</span>
                            </div>
                            <div className="flex justify-between font-bold pt-2 border-t border-black">
                                <span>Total amount payable</span>
                                <span>{formatCurrency(data.totalAmount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Signature */}
                    <div className="flex justify-end mt-16">
                        <div className="text-center">
                            <img src={esign} alt="E-Signature" className="w-48 mx-auto" />
                            <p className="text-xs mt-1">Authorised Signatory</p>
                        </div>
                    </div>
                </div>


                {/* Footer */}
                <div className="mt-24 print:mt-auto text-center text-xs text-gray-600">
                    <p className="font-bold">Details of ECO under GST:</p>
                    <p>Uber India Systems Private Limited / Prabhas Legacy, 2nd Floor, # 77, Survey no. 124/2 N.A.L Wind Tunnel Road, Murugeshpalya, H.A.L POST Bangalore, Karnataka / GST: 29AABCU6223H2Z9</p>
                </div>
            </div>
        </div>
    );
};