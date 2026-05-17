import QRCode from 'react-qr-code';
import Barcode from 'react-barcode';
import React from 'react';
import { ReceiptData } from '../types';

interface ReceiptPreviewProps {
  data: ReceiptData;
}

export default function ReceiptPreview({ data }: ReceiptPreviewProps) {
  const is58mm = data.paperSize === '58mm';
  
  const subtotal = data.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const taxableTotal = data.items.reduce((acc, item) => acc + (!item.taxExempt ? item.quantity * item.price : 0), 0);
  const vatAmount = taxableTotal - (taxableTotal / 1.16);
  const change = data.amountTend - subtotal;

  const divider = is58mm ? '-'.repeat(24) : '-'.repeat(42);
  const dividerString = <div className="text-center w-full truncate">{divider}</div>;

  return (
    <div 
      id="receipt-print-area"
      className={`bg-[#ffffff] shadow-[0_10px_40px_rgba(0,0,0,0.1)] ${is58mm ? 'w-[280px]' : 'w-[380px]'} p-6 flex flex-col items-center text-[#000000] font-mono text-[13px] leading-tight select-none print-receipt-container print:shadow-none print:p-4 shrink-0 mx-auto relative overflow-hidden`}
      style={{ fontFamily: '"JetBrains Mono", "Courier New", Courier, monospace' }}
    >
      {/* Receipt Header */}
      <div className="text-center w-full mb-4">
        {data.logo && (
          <img src={data.logo} alt="Store Logo" className="max-h-16 object-contain mb-2 filter grayscale mx-auto" />
        )}
        <div className="font-bold text-lg uppercase mb-1">{data.storeName}</div>
        <div className="uppercase mb-0.5">{data.branch}</div>
        <div className="uppercase mb-0.5">{data.address}</div>
        <div className="uppercase mb-0.5">PIN: {data.pinNo}</div>
        <div className="uppercase">VAT: {data.vatNo}</div>
        {data.receiptNo && (
          <div className="flex justify-center mt-3 mb-1">
            <Barcode 
              value={data.receiptNo} 
              width={is58mm ? 1.5 : 2} 
              height={40} 
              displayValue={false} 
              background="transparent" 
              lineColor="#000000" 
              margin={0} 
            />
          </div>
        )}
        <div className="mt-2 text-[#4b5563]">{dividerString}</div>
      </div>

      {/* Transaction Info */}
      <div className="w-full flex justify-between mb-3 text-[12px]">
        <div>
          <div className="mb-0.5">DATE: {data.date}</div>
          <div className="mb-0.5">TIME: {data.time}</div>
          <div>TILL: {data.tillNo}</div>
        </div>
        <div className="text-right">
          <div className="mb-0.5">RECEIPT NO: {data.receiptNo}</div>
          <div className="uppercase">CASHIER: {data.cashier}</div>
        </div>
      </div>

      {/* Items Table */}
      <div className="w-full mb-4">
        <div className="flex justify-between font-bold mb-2 border-b border-[#000000] border-dashed pb-1">
          <span className="w-1/2">DESCRIPTION</span>
          <span className="w-1/4 text-right">QTY</span>
          <span className="w-1/4 text-right">TOTAL</span>
        </div>
        <div className="mb-2 italic text-[12px] text-[#374151]">16.0% VAT INCLUSIVE</div>
        <div className="flex flex-col">
          {data.items.map((item) => (
            <div key={item.id} className="flex justify-between items-start mb-2">
              <span className="w-1/2 uppercase pr-1">
                <div>{item.description}{item.taxExempt ? ' (E)' : ''}</div>
                {item.quantity > 1 && (
                   <div className="text-[11px] text-[#6b7280] mt-0.5">@ {item.price.toFixed(2)}</div>
                )}
              </span>
              <span className="w-1/4 text-right">{item.quantity}</span>
              <span className="w-1/4 text-right">{(item.quantity * item.price).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-1 text-[#4b5563]">{dividerString}</div>
      </div>

      {/* Totals */}
      <div className="w-full flex flex-col mb-6 text-[15px]">
        <div className="flex justify-between font-bold mb-0.5">
          <span>SUB TOTAL</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>ITEMS COUNT</span>
          <span>{data.items.reduce((acc, item) => acc + item.quantity, 0)}</span>
        </div>
        <div className="flex justify-between border-t border-[#000000] pt-1.5 mt-1 font-black text-lg mb-2">
          <span>TOTAL</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>
        <div className="border-t border-dashed border-[#000000] pt-2 pb-1 mb-2">
          <div className="flex justify-between text-[14px] font-bold uppercase mb-1">
            <span>{data.paymentMethod}</span>
            <span>{data.amountTend.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[14px] font-bold">
            <span>CHANGE DUE</span>
            <span>{Math.max(0, change).toFixed(2)}</span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-dashed border-[#e5e7eb] text-[11px]">
           <div className="flex justify-between text-[#4b5563] mb-0.5">
             <span>VAT EXCLUSIVE</span>
             <span>{(subtotal - vatAmount).toFixed(2)}</span>
           </div>
           <div className="flex justify-between text-[#4b5563]">
             <span>VAT @ 16%</span>
             <span>{vatAmount.toFixed(2)}</span>
           </div>
        </div>
      </div>

      {/* KRA / Compliance */}
      {data.showKRA && (
        <div className="text-center w-full mb-3">
          <div className="text-[11px] font-bold mb-0.5">FISCAL SIGNATURE (KRA)</div>
          <div className="text-[10px] break-all uppercase mb-2">{data.cuNumber}</div>
          <div className="flex justify-center mb-1">
            <QRCode value={data.qrContent || data.cuNumber || 'NO CONTENT'} size={90} />
          </div>
        </div>
      )}

      {/* Footer / POS Info */}
      <div className="text-center w-full mt-2 text-[#000000]">
        <div className="text-[11px] font-bold tracking-widest uppercase mb-1">Thank you for shopping with us!</div>
        <div className="text-[10px] mb-1">GOODS ONCE SOLD ARE NOT RETURNABLE</div>
        <div className="text-[10px] text-[#4b5563] mt-2 pb-4">DEV: POS-TR-00129 / VER: 1.0.4</div>
      </div>

      {/* Decorative serrated edge at bottom */}
      <div className="absolute bottom-0 left-0 w-full flex overflow-hidden h-2 opacity-30">
         {[...Array(24)].map((_, i) => (
           <div key={i} className="flex-none w-4 h-4 bg-[#e5e7eb] rotate-45 transform translate-y-2"></div>
         ))}
      </div>
    </div>
  );
}
