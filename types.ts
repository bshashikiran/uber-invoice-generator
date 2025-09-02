export interface InvoiceFormData {
  customerName: string;
  pickupAddress: string;
  invoiceDate: string;
  driverName: string;
  price: string;
}

export interface InvoiceData {
  customerName: string;
  pickupAddress: string;
  invoiceDate: string;
  formattedDate: string;
  driverName: string;
  totalAmount: number;
  netAmount: number;
  cgst: number;
  sgst: number;
  invoiceNumber: string;
}
