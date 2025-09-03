import React, { useState } from 'react';
import { getRandomDriverName } from './randomDriverName';
import type { InvoiceFormData } from '../types';

interface BulkInvoiceFormProps {
  onBulkGenerate: (data: InvoiceFormData[]) => void;
}

export const BulkInvoiceForm: React.FC<BulkInvoiceFormProps> = ({ onBulkGenerate }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [minPrice, setMinPrice] = useState(100);
  const [maxPrice, setMaxPrice] = useState(200);
  const [count, setCount] = useState(10);
  const [customerName, setCustomerName] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [excludeWeekends, setExcludeWeekends] = useState(true);
  const [customExcludeDates, setCustomExcludeDates] = useState<string[]>([]);
  const [customDateInput, setCustomDateInput] = useState('');
  const [info, setInfo] = useState('');

  const getRandomPrice = () => {
    const min = Math.min(minPrice, maxPrice);
    const max = Math.max(minPrice, maxPrice);
    return (Math.random() * (max - min) + min).toFixed(2);
  };

  const getDatesInRange = (start: string, end: string) => {
    const dates = [];
    let current = new Date(start);
    const last = new Date(end);
    while (current <= last) {
      const day = current.getDay();
      const isWeekend = (day === 0 || day === 6);
      const dateStr = current.toISOString().split('T')[0];
      if ((excludeWeekends ? !isWeekend : true) && !customExcludeDates.includes(dateStr)) {
        dates.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const handleAddCustomExcludeDate = () => {
    if (customDateInput && !customExcludeDates.includes(customDateInput)) {
      setCustomExcludeDates(prev => [...prev, customDateInput]);
      setCustomDateInput('');
    }
  };

  const handleRemoveCustomExcludeDate = (date: string) => {
    setCustomExcludeDates(prev => prev.filter(d => d !== date));
  };

  const handleBulkGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setInfo('');
    const dates = getDatesInRange(fromDate, toDate);
    if (dates.length === 0) {
      alert('No valid dates available for invoice generation.');
      setLoading(false);
      return;
    }
    let actualCount = count;
    let infoMsg = '';
    if (count > dates.length) {
      actualCount = dates.length;
      infoMsg = `Only ${dates.length} invoices generated as there are only ${dates.length} eligible dates in the selected range.`;
    }
    // Shuffle dates to randomize selection
    const shuffledDates = [...dates];
    for (let i = shuffledDates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledDates[i], shuffledDates[j]] = [shuffledDates[j], shuffledDates[i]];
    }
    const invoices: InvoiceFormData[] = await Promise.all(
      Array.from({ length: actualCount }).map(async (_, i) => {
        const date = shuffledDates[i];
        const driverName = await getRandomDriverName();
        return {
          customerName,
          pickupAddress,
          invoiceDate: date.toISOString().split('T')[0],
          driverName,
          price: getRandomPrice(),
        };
      })
    );
    setLoading(false);
    if (infoMsg) setInfo(infoMsg);
    else setInfo('');
    onBulkGenerate(invoices);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border border-gray-200 mt-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Bulk Invoice Generation</h2>
      {info && (
        <div className="mb-2 p-2 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded text-sm">
          {info}
        </div>
      )}
      <form onSubmit={handleBulkGenerate} className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={excludeWeekends}
              onChange={e => setExcludeWeekends(e.target.checked)}
              className="form-checkbox"
            />
            Exclude weekends
          </label>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Custom dates to exclude (optional)</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={customDateInput}
              onChange={e => setCustomDateInput(e.target.value)}
              className="px-2 py-1 border rounded"
            />
            <button type="button" onClick={handleAddCustomExcludeDate} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs font-semibold border border-gray-300">Add</button>
          </div>
          {customExcludeDates.length > 0 && (
            <ul className="flex flex-wrap gap-2 mt-1">
              {customExcludeDates.map(date => (
                <li key={date} className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center gap-1">
                  {date}
                  <button type="button" onClick={() => handleRemoveCustomExcludeDate(date)} className="ml-1 text-red-500 hover:text-red-700">&times;</button>
                </li>
              ))}
            </ul>
          )}
        </div>
  
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From Date</label>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Date</label>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
            <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pickup Address</label>
            <input type="text" value={pickupAddress} onChange={e => setPickupAddress(e.target.value)} required className="mt-1 block w-full px-3 py-2 border rounded" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Min Price</label>
            <input type="number" value={minPrice} onChange={e => setMinPrice(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Price</label>
            <input type="number" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Invoices</label>
            <input type="number" value={count} min={1} max={100} onChange={e => setCount(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 border rounded" />
          </div>
        </div>
        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Bulk Invoices'}
        </button>
      </form>
    </div>
  );
};