import { useState } from 'react';
import { Plus, Trash2, ShoppingCart, Check } from 'lucide-react';
import type { ShoppingItem } from '../types';

interface ShoppingListProps {
  items: ShoppingItem[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ShoppingList({ items, onAdd, onToggle, onDelete }: ShoppingListProps) {
  const [inputText, setInputText] = useState('');

  const handleAdd = () => {
    const text = inputText.trim();
    if (!text) return;
    onAdd(text);
    setInputText('');
  };

  const unchecked = items.filter(i => !i.checked);
  const checked = items.filter(i => i.checked);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart size={18} className="text-green-500" />
        <h2 className="font-bold text-gray-800">買い物リスト</h2>
        <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {unchecked.length}件
        </span>
      </div>

      {/* Add item */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="アイテムを追加..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
        />
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-4 py-2.5 rounded-xl hover:bg-green-600 transition-colors flex items-center gap-1.5 text-sm font-medium"
        >
          <Plus size={16} /> 追加
        </button>
      </div>

      {/* Item list */}
      <div className="flex-1 overflow-y-auto space-y-1.5">
        {unchecked.length === 0 && checked.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <ShoppingCart size={40} className="mb-3 opacity-30" />
            <p className="text-sm">リストは空です</p>
          </div>
        )}

        {unchecked.map(item => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-green-200 group transition-colors"
          >
            <button
              onClick={() => onToggle(item.id)}
              className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-green-400 flex items-center justify-center flex-shrink-0 transition-colors"
            />
            <span className="flex-1 text-sm text-gray-700">{item.text}</span>
            <button
              onClick={() => onDelete(item.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}

        {checked.length > 0 && (
          <>
            <div className="pt-3 pb-1">
              <p className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                <Check size={12} /> 購入済み ({checked.length}件)
              </p>
            </div>
            {checked.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group opacity-60"
              >
                <button
                  onClick={() => onToggle(item.id)}
                  className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0"
                >
                  <Check size={11} className="text-white" />
                </button>
                <span className="flex-1 text-sm text-gray-400 line-through">{item.text}</span>
                <button
                  onClick={() => onDelete(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
