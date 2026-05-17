import { Image, Plus, Trash2 } from 'lucide-react';
import React, { ChangeEvent } from 'react';
import { ReceiptData, ReceiptItem } from '../types';

interface ReceiptFormProps {
  data: ReceiptData;
  onChange: (data: ReceiptData) => void;
}

export default function ReceiptForm({ data, onChange }: ReceiptFormProps) {
  const handleChange = (field: keyof ReceiptData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('logo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleItemChange = (id: string, field: keyof ReceiptItem, value: any) => {
    const newItems = data.items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    handleChange('items', newItems);
  };

  const removeItem = (id: string) => {
    handleChange('items', data.items.filter(item => item.id !== id));
  };

  const addItem = () => {
    const newItem: ReceiptItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: 'New Item',
      quantity: 1,
      price: 0,
    };
    handleChange('items', [newItem, ...data.items]);
  };

  return (
    <>
      <div className="p-6 border-b border-gray-100 shrink-0">
        <h1 className="text-xl font-bold tracking-tight text-blue-900">
          ReceiptGen <span className="text-xs font-normal bg-blue-100 text-blue-700 px-2 py-1 rounded ml-2">v2.4</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">Thermal Printer Emulation System</p>
      </div>
      
      <div className="flex-1 p-6 space-y-8 overflow-y-auto pb-12">
        {/* Size Selection */}
        <div>
          <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 block">Paper Width</label>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => handleChange('paperSize', '80mm')}
              className={`py-2 px-4 shadow-sm transition-colors text-sm rounded-md ${data.paperSize === '80mm' ? 'border-2 border-blue-600 bg-blue-50 text-blue-700 font-semibold' : 'border border-gray-200 text-gray-500 font-medium hover:bg-gray-50'}`}
            >
              80mm Standard
            </button>
            <button 
              onClick={() => handleChange('paperSize', '58mm')}
              className={`py-2 px-4 shadow-sm transition-colors text-sm rounded-md ${data.paperSize === '58mm' ? 'border-2 border-blue-600 bg-blue-50 text-blue-700 font-semibold' : 'border border-gray-200 text-gray-500 font-medium hover:bg-gray-50'}`}
            >
              58mm Narrow
            </button>
          </div>
        </div>

        {/* Print Settings */}
        <div className="space-y-3">
          <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-0">Print Settings</label>
          
          <div className="grid grid-cols-2 gap-2 h-auto text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Density</span>
              <select 
                value={data.printDensity}
                onChange={(e) => handleChange('printDensity', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none text-gray-700"
              >
                <option value="Light">Light</option>
                <option value="Normal">Normal</option>
                <option value="Dark">Dark</option>
                <option value="Darkest">Darkest</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Speed</span>
              <select 
                value={data.printSpeed}
                onChange={(e) => handleChange('printSpeed', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none text-gray-700"
              >
                <option value="Slow">Slow</option>
                <option value="Normal">Normal</option>
                <option value="Fast">Fast</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Rotation</span>
            <select 
              value={data.printRotation}
              onChange={(e) => handleChange('printRotation', e.target.value)}
              className="w-full p-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none text-gray-700"
            >
              <option value="0°">0° (No Rotation)</option>
              <option value="90°">90°</option>
              <option value="180°">180°</option>
              <option value="270°">270°</option>
            </select>
          </div>
        </div>

        {/* Store Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-0">Store Information</label>
            <div className="relative overflow-hidden cursor-pointer group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                title="Upload custom logo"
              />
              <span className={`text-[10px] uppercase font-bold tracking-wider ${data.logo ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`}>
                {data.logo ? 'Change Logo' : '+ Add Logo'}
              </span>
            </div>
          </div>
          
          <input 
            value={data.storeName}
            onChange={(e) => handleChange('storeName', e.target.value)}
            placeholder="Store Name"
            className="w-full p-2.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none uppercase placeholder:normal-case font-medium"
          />
          <input 
            value={data.branch}
            onChange={(e) => handleChange('branch', e.target.value)}
            placeholder="Branch"
            className="w-full p-2.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none uppercase placeholder:normal-case"
          />
          <input 
            value={data.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Address / P.O Box"
            className="w-full p-2.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none uppercase placeholder:normal-case"
          />
          <div className="grid grid-cols-2 gap-2">
            <input 
              value={data.pinNo}
              onChange={(e) => handleChange('pinNo', e.target.value)}
              placeholder="PIN No"
              className="w-full p-2.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none uppercase placeholder:normal-case"
            />
            <input 
              value={data.vatNo}
              onChange={(e) => handleChange('vatNo', e.target.value)}
              placeholder="VAT No"
              className="w-full p-2.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none uppercase placeholder:normal-case"
            />
          </div>
          {data.logo && (
             <div className="flex items-center gap-2 mt-1 py-1 px-2 bg-gray-50 rounded border border-gray-100">
               <Image size={14} className="text-gray-500" />
               <span className="text-xs text-gray-600 flex-1 truncate">Custom logo uploaded</span>
               <button onClick={() => handleChange('logo', null)} className="text-[10px] text-red-500 hover:text-red-700 uppercase font-bold">Remove</button>
             </div>
          )}
        </div>

        {/* Operation Settings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-0">Transaction Details</label>
            <input 
              type="datetime-local"
              title="Set Custom Timestamp"
              onChange={(e) => {
                if (e.target.value) {
                  const d = new Date(e.target.value);
                  handleChange('date', d.toLocaleDateString('en-GB'));
                  handleChange('time', d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
                }
              }}
              className="text-xs text-blue-600 outline-none cursor-pointer bg-transparent font-medium"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input 
              value={data.date}
              onChange={(e) => handleChange('date', e.target.value)}
              placeholder="Date (e.g. 24/05/2024)"
              className="w-full p-2.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <input 
              value={data.time}
              onChange={(e) => handleChange('time', e.target.value)}
              placeholder="Time (e.g. 14:45:22)"
              className="w-full p-2.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input 
              value={data.tillNo}
              onChange={(e) => handleChange('tillNo', e.target.value)}
              placeholder="Till No"
              className="w-full p-2.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none uppercase placeholder:normal-case"
            />
            <input 
              value={data.cashier}
              onChange={(e) => handleChange('cashier', e.target.value)}
              placeholder="Cashier"
              className="w-full p-2.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none uppercase placeholder:normal-case"
            />
          </div>
          <input 
            value={data.receiptNo}
            onChange={(e) => handleChange('receiptNo', e.target.value)}
            placeholder="Receipt No"
            className="w-full p-2.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none uppercase placeholder:normal-case"
          />
        </div>

        {/* Items List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-0">Line Items</label>
            <button 
              onClick={addItem}
              className="text-[10px] uppercase font-bold text-blue-600 hover:text-blue-700 tracking-wider"
            >
              + Add Item
            </button>
          </div>
          
          <div className="space-y-2">
            {data.items.map((item, index) => (
              <div key={item.id} className="p-3 bg-gray-50 border border-gray-200 rounded flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500">#{index + 1}</span>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <input 
                  value={item.description}
                  onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                  placeholder="Description"
                  className="w-full p-2.5 text-sm border border-gray-200 rounded outline-none uppercase"
                />
                <div className="flex gap-2">
                  <input 
                    type="number" min="0.01" step="any"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    placeholder="Qty"
                    className="w-1/3 p-2.5 text-sm border border-gray-200 rounded outline-none"
                  />
                  <input 
                    type="number" min="0" step="any"
                    value={item.price}
                    onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                    placeholder="Price"
                    className="w-full text-sm border border-gray-200 rounded outline-none p-2.5"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Tax Exempt</span>
                  <button
                    type="button"
                    onClick={() => handleItemChange(item.id, 'taxExempt', !item.taxExempt)}
                    className={`w-7 h-4 rounded-full relative transition-colors ${item.taxExempt ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${item.taxExempt ? 'translate-x-3.5' : 'translate-x-0.5'}`}></div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-0">Payment & KRA</label>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Show KRA</span>
              <button
                type="button"
                onClick={() => handleChange('showKRA', !data.showKRA)}
                className={`w-8 h-4 rounded-full relative transition-colors ${data.showKRA ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${data.showKRA ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input 
              value={data.paymentMethod}
              onChange={(e) => handleChange('paymentMethod', e.target.value)}
              placeholder="Method (e.g. CASH)"
              className="w-full p-2.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none uppercase placeholder:normal-case"
            />
            <input 
              type="number"
              value={data.amountTend}
              onChange={(e) => handleChange('amountTend', parseFloat(e.target.value) || 0)}
              placeholder="Amt Tendered"
              className="w-full p-2.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          {data.showKRA && (
            <>
              <input 
                value={data.cuNumber}
                onChange={(e) => handleChange('cuNumber', e.target.value)}
                placeholder="Fiscal Signature / CU Number"
                className="w-full p-2.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none uppercase placeholder:normal-case"
              />
              <input 
                value={data.qrContent}
                onChange={(e) => handleChange('qrContent', e.target.value)}
                placeholder="QR Code URL / Content"
                className="w-full p-2.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </>
          )}
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-gray-100 shrink-0">
        <div className="flex gap-2 items-center">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-[10px] text-gray-600 uppercase font-medium">Printer Emulation Active</span>
        </div>
      </div>
    </>
  );
}
