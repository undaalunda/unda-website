'use client';

import { useState, useEffect } from 'react';
import supabase from '../../../lib/supabase'; 
import Link from 'next/link';

type StockProduct = {
  id: string;
  title: string;
  subtitle: string;
  stock: number;
  track_stock: boolean;
};

export default function StockManagement() {
  const [products, setProducts] = useState<StockProduct[]>([]);
  const [loading, setLoading] = useState(true);
  // ← ลบ const supabase = createClient();

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('Products')
      .select('*')
      .eq('track_stock', true)
      .order('id');
    
    if (error) {
      console.error('Error loading products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  }

  async function updateStock(id: string, newStock: number) {
    if (newStock < 0) {
      alert('Stock cannot be negative!');
      return;
    }

    const { error } = await supabase
      .from('Products')
      .update({ stock: newStock, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock!');
    } else {
      loadProducts();
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] text-[#f8fcdc]">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f8fcdc] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-[#dc9e63]">Stock Management</h1>
          <Link 
            href="/admin/orders" 
            className="text-[#dc9e63] hover:text-[#f8fcdc] transition-colors"
          >
            ← Back to Orders
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {products.map(product => (
            <div 
              key={product.id} 
              className={`p-4 rounded-lg border ${
                product.stock === 0 
                  ? 'border-red-500 bg-red-900/20' 
                  : product.stock < 10 
                  ? 'border-yellow-500 bg-yellow-900/20' 
                  : 'border-green-500 bg-green-900/20'
              }`}
            >
              <div className="text-xs text-[#f8fcdc]/60 mb-1">{product.id}</div>
              <div className="text-2xl font-bold">{product.stock}</div>
              <div className="text-xs mt-1">
                {product.stock === 0 ? (
                  <span className="text-red-400">SOLD OUT</span>
                ) : product.stock < 10 ? (
                  <span className="text-yellow-400">LOW STOCK</span>
                ) : (
                  <span className="text-green-400">IN STOCK</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-[#2a2a2a] rounded-lg overflow-hidden border border-[#dc9e63]/30">
          <table className="w-full">
            <thead className="bg-[#dc9e63]/20">
              <tr>
                <th className="text-left p-4 font-semibold">Product ID</th>
                <th className="text-left p-4 font-semibold">Title</th>
                <th className="text-center p-4 font-semibold">Current Stock</th>
                <th className="text-center p-4 font-semibold">Update Stock</th>
                <th className="text-center p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr 
                  key={product.id} 
                  className={`border-t border-[#dc9e63]/10 ${
                    index % 2 === 0 ? 'bg-[#2a2a2a]' : 'bg-[#1a1a1a]'
                  }`}
                >
                  <td className="p-4 font-mono text-sm">{product.id}</td>
                  <td className="p-4">
                    <div className="font-semibold">{product.title}</div>
                    <div className="text-xs text-[#f8fcdc]/60">{product.subtitle}</div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-2xl font-bold">{product.stock}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => updateStock(product.id, product.stock - 1)}
                        className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded text-white font-bold transition-colors"
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        defaultValue={product.stock}
                        className="w-20 bg-[#1a1a1a] border border-[#dc9e63]/30 rounded px-3 py-1 text-center focus:outline-none focus:border-[#dc9e63]"
                        onBlur={(e) => {
                          const newValue = parseInt(e.target.value);
                          if (!isNaN(newValue) && newValue !== product.stock) {
                            updateStock(product.id, newValue);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const newValue = parseInt(e.currentTarget.value);
                            if (!isNaN(newValue) && newValue !== product.stock) {
                              updateStock(product.id, newValue);
                            }
                          }
                        }}
                      />
                      <button
                        onClick={() => updateStock(product.id, product.stock + 1)}
                        className="w-8 h-8 bg-green-600 hover:bg-green-700 rounded text-white font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    {product.stock === 0 ? (
                      <span className="px-3 py-1 bg-red-600/30 border border-red-600 rounded text-red-300 text-xs font-semibold">
                        SOLD OUT
                      </span>
                    ) : product.stock < 10 ? (
                      <span className="px-3 py-1 bg-yellow-600/30 border border-yellow-600 rounded text-yellow-300 text-xs font-semibold">
                        LOW STOCK
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-600/30 border border-green-600 rounded text-green-300 text-xs font-semibold">
                        IN STOCK
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-[#dc9e63]/10 border border-[#dc9e63]/30 rounded-lg">
          <h3 className="font-semibold mb-2 text-[#dc9e63]">Instructions:</h3>
          <ul className="text-sm text-[#f8fcdc]/80 space-y-1">
            <li>• Use +/- buttons to adjust stock by 1</li>
            <li>• Type a number and press Enter or click outside to update</li>
            <li>• Stock cannot be negative</li>
            <li>• RED = Sold Out | YELLOW = Low Stock (&lt;10) | GREEN = In Stock</li>
          </ul>
        </div>
      </div>
    </div>
  );
}