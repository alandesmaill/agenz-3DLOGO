'use client';

import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface ArrayEditorProps {
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  placeholder?: string;
}

export default function ArrayEditor({ value, onChange, label, placeholder = 'Add item...' }: ArrayEditorProps) {
  const [input, setInput] = useState('');

  function addItem() {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInput('');
    }
  }

  function removeItem(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-white/70 mb-2">{label}</label>
      )}

      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
            <span className="flex-1 text-sm text-white">{item}</span>
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="text-white/40 hover:text-red-400 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#00e92c]/50"
          />
          <button
            type="button"
            onClick={addItem}
            className="px-3 py-2 bg-[#00e92c]/20 border border-[#00e92c]/30 rounded-lg text-[#00e92c] hover:bg-[#00e92c]/30 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
