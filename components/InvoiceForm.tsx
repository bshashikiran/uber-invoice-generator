import React, { useState } from 'react';
import type { InvoiceFormData } from '../types';

interface InvoiceFormProps {
    onGenerate: (data: InvoiceFormData) => void;
}

// Define props for the InputField component
interface InputFieldProps {
    label: string;
    name: keyof InvoiceFormData;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    required?: boolean;
}

// Moved InputField outside InvoiceForm to prevent it from being re-created on every render, which caused focus loss.
const InputField: React.FC<InputFieldProps> = ({ label, name, type = 'text', value, onChange, required = true }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            required={required}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
    </div>
);

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ onGenerate }) => {
    const [formData, setFormData] = useState<InvoiceFormData>({
        customerName: 'Shashi Kiran',
        pickupAddress: 'Shivaji Nagar, Bengaluru, Karnataka 560001, India',
        invoiceDate: new Date().toISOString().split('T')[0],
        driverName: 'NARENDRAN NARENDRAN',
        price: '43.40',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onGenerate(formData);
    };
    
    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Invoice Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <InputField label="Customer Name" name="customerName" value={formData.customerName} onChange={handleChange} />
                <InputField label="Pickup Address" name="pickupAddress" value={formData.pickupAddress} onChange={handleChange} />
                <InputField label="Driver Name" name="driverName" value={formData.driverName} onChange={handleChange} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InputField label="Date" name="invoiceDate" type="date" value={formData.invoiceDate} onChange={handleChange} />
                    <InputField label="Total Price (INR)" name="price" type="number" value={formData.price} onChange={handleChange} />
                </div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                    Generate Invoice
                </button>
            </form>
        </div>
    );
};