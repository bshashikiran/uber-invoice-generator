import React, { forwardRef } from 'react';
import { InvoicePreview } from './InvoicePreview';
import type { InvoiceData } from '../types';

interface BulkInvoicePreviewProps {
  invoices: InvoiceData[];
}

// Forward ref for PDF export
export const BulkInvoicePreview = forwardRef<HTMLDivElement, BulkInvoicePreviewProps>(({ invoices }, ref) => (
  <div ref={ref}>
    {invoices.map((inv, idx) => (
      <div key={inv.invoiceNumber} className="mb-8 break-after-page">
        <InvoicePreview data={inv} />
      </div>
    ))}
  </div>
));
