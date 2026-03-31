'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { getIconComponent, getAllIconNames } from '@/lib/icon-map';

interface IconSelectorProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
}

export default function IconSelector({ value, onChange, label }: IconSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const allIcons = getAllIconNames();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = search
    ? allIcons.filter((name) => name.toLowerCase().includes(search.toLowerCase()))
    : allIcons;

  const SelectedIcon = getIconComponent(value);

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="block text-sm font-medium text-white/70 mb-2">{label}</label>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm hover:border-white/20 transition-colors"
      >
        <SelectedIcon size={18} className="text-[#00e92c] shrink-0" />
        <span className="flex-1 text-left">{value || 'Select icon...'}</span>
        <ChevronDown size={14} className={`text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-white/10">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search icons..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#00e92c]/50"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-4 gap-1 p-2 max-h-60 overflow-y-auto">
            {filtered.map((name) => {
              const Icon = getIconComponent(name);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => { onChange(name); setOpen(false); setSearch(''); }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-colors ${
                    value === name
                      ? 'bg-[#00e92c]/20 text-[#00e92c] border border-[#00e92c]/30'
                      : 'text-white/60 hover:bg-white/10 border border-transparent'
                  }`}
                  title={name}
                >
                  <Icon size={20} />
                  <span className="truncate w-full text-center text-[10px]">{name}</span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="col-span-4 text-center text-white/30 text-sm py-4">No icons found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
