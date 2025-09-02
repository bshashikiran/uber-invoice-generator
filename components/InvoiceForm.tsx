import React, { useState } from 'react';
import { getRandomDriverName } from './randomDriverName';
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
        customerName: '',
        pickupAddress: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        driverName: '',
        price: '',
    });
    const [errors, setErrors] = useState<{ [K in keyof InvoiceFormData]?: string }>({});
    const [minPrice, setMinPrice] = useState(100);
    const [maxPrice, setMaxPrice] = useState(200);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMinPrice(Number(e.target.value));
    };
    const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMaxPrice(Number(e.target.value));
    };

    const handleRandomPrice = () => {
        const min = Math.min(minPrice, maxPrice);
        const max = Math.max(minPrice, maxPrice);
        const random = (Math.random() * (max - min) + min);
        setFormData(prev => ({ ...prev, price: random.toFixed(2) }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: { [K in keyof InvoiceFormData]?: string } = {};
        if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required.';
        if (!formData.pickupAddress.trim()) newErrors.pickupAddress = 'Pickup address is required.';
        if (!formData.driverName.trim()) newErrors.driverName = 'Driver name is required.';
        if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) newErrors.price = 'Valid price is required.';
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;
        onGenerate(formData);
    };
    
    const handleRandomDriver = async () => {
        const name = await getRandomDriverName();
        setFormData(prev => ({ ...prev, driverName: name }));
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Invoice Details</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <InputField label="Customer Name" name="customerName" value={formData.customerName} onChange={handleChange} />
                                    {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
                                </div>
                                <div>
                                    <InputField label="Pickup Address" name="pickupAddress" value={formData.pickupAddress} onChange={handleChange} />
                                    {errors.pickupAddress && <p className="text-red-500 text-xs mt-1">{errors.pickupAddress}</p>}
                                </div>
                                <div className="flex items-end gap-2">
                                    <div className="flex-1">
                                        <InputField label="Driver Name" name="driverName" value={formData.driverName} onChange={handleChange} />
                                        {errors.driverName && <p className="text-red-500 text-xs mt-1">{errors.driverName}</p>}
                                    </div>
                                    <button type="button" onClick={handleRandomDriver} className="mb-1 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-xs font-semibold border border-gray-300">Random Driver Name</button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="flex flex-col w-full">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Price (INR)</label>
                                        <div className="flex gap-2 items-end mb-2 w-full flex-nowrap">
                                            <input
                                                type="number"
                                                name="minPrice"
                                                value={minPrice}
                                                onChange={handleMinPriceChange}
                                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                                min={0}
                                                placeholder="Min"
                                            />
                                            <span>-</span>
                                            <input
                                                type="number"
                                                name="maxPrice"
                                                value={maxPrice}
                                                onChange={handleMaxPriceChange}
                                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                                min={0}
                                                placeholder="Max"
                                            />
                                            <button type="button" onClick={handleRandomPrice} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs font-semibold border border-gray-300 whitespace-nowrap">Random Price</button>
                                        </div>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            required
                                        />
                                        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                                    </div>
                                </div>
                                                    <div className="flex flex-col w-full">
                                                        <InputField label="Date" name="invoiceDate" type="date" value={formData.invoiceDate} onChange={handleChange} />
                                                                                <div className="flex justify-center gap-4 mt-2">
                                                                                                            <button
                                                                                                                type="button"
                                                                                                                aria-label="Previous Day"
                                                                                                                className="px-1 py-0.5 bg-gray-200 rounded hover:bg-gray-300 text-base font-bold border border-gray-300"
                                                                                                                style={{ minWidth: '28px', minHeight: '28px' }}
                                                                                                                onClick={() => {
                                                                                                                    const d = new Date(formData.invoiceDate);
                                                                                                                    d.setDate(d.getDate() - 1);
                                                                                                                    setFormData(prev => ({ ...prev, invoiceDate: d.toISOString().split('T')[0] }));
                                                                                                                }}
                                                                                                            >&#8592;</button>
                                                                                                            <button
                                                                                                                type="button"
                                                                                                                aria-label="Next Day"
                                                                                                                className="px-1 py-0.5 bg-gray-200 rounded hover:bg-gray-300 text-base font-bold border border-gray-300"
                                                                                                                style={{ minWidth: '28px', minHeight: '28px' }}
                                                                                                                onClick={() => {
                                                                                                                    const d = new Date(formData.invoiceDate);
                                                                                                                    d.setDate(d.getDate() + 1);
                                                                                                                    setFormData(prev => ({ ...prev, invoiceDate: d.toISOString().split('T')[0] }));
                                                                                                                }}
                                                                                                            >&#8594;</button>
                                                                                </div>
                                                    </div>
                                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                                        Generate Invoice
                                </button>
                        </form>
        </div>
    );
};