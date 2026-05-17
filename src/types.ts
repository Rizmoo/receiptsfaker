export interface ReceiptItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  taxExempt?: boolean;
}

export interface ReceiptData {
  logo: string | null;
  storeName: string;
  branch: string;
  address: string;
  pinNo: string;
  vatNo: string;
  date: string;
  time: string;
  tillNo: string;
  cashier: string;
  receiptNo: string;
  items: ReceiptItem[];
  paymentMethod: string;
  amountTend: number;
  cuNumber: string;
  qrContent: string;
  paperSize: '58mm' | '80mm';
  showKRA: boolean;
  printDensity: 'Light' | 'Normal' | 'Dark' | 'Darkest';
  printSpeed: 'Slow' | 'Normal' | 'Fast';
  printRotation: '0°' | '90°' | '180°' | '270°';
}

export const DEFAULT_RECEIPT_DATA: ReceiptData = {
  logo: null,
  storeName: 'NAIVAS SUPERMARKET',
  branch: 'WESTLANDS BRANCH',
  address: 'P.O BOX 61600-00200, NAIROBI',
  pinNo: 'P0510000000A',
  vatNo: '0100000M',
  date: new Date().toLocaleDateString('en-GB'),
  time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
  tillNo: '04',
  cashier: 'JANE DOE',
  receiptNo: '01234567',
  items: [
    { id: '1', description: 'Unga wa Dola 2KG', quantity: 2, price: 198 },
    { id: '2', description: 'Menengai Soap 1KG', quantity: 1, price: 180 },
    { id: '3', description: 'Fresh Milk 500ml', quantity: 4, price: 65 },
    { id: '4', description: 'Bread 400G', quantity: 1, price: 65 }
  ],
  paymentMethod: 'MPESA',
  amountTend: 1000,
  cuNumber: 'KRA1234567890',
  qrContent: 'https://itax.kra.go.ke/KRA-Portal/invoiceChk.htm?actionCode=loadPage&invoiceNo=KRA1234567890',
  paperSize: '80mm',
  showKRA: true,
  printDensity: 'Normal',
  printSpeed: 'Normal',
  printRotation: '0°',
};
