'use client';

const BRAND_COLORS = [
  { value: '#00e92c', label: 'Green' },
  { value: '#00ffff', label: 'Cyan' },
  { value: '#00d4aa', label: 'Teal' },
  { value: '#00b8ff', label: 'Sky' },
  { value: '#00ff88', label: 'Mint' },
  { value: '#0088ff', label: 'Blue' },
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2">
      {BRAND_COLORS.map((color) => (
        <button
          key={color.value}
          type="button"
          onClick={() => onChange(color.value)}
          className={`w-10 h-10 rounded-lg border-2 transition-all cursor-pointer ${
            value === color.value
              ? 'border-[#00e92c] scale-110 shadow-[0_0_8px_rgba(0,233,44,0.4)]'
              : 'border-white/10 hover:border-white/30'
          }`}
          style={{ backgroundColor: color.value }}
          title={color.label}
        />
      ))}
      <span className="text-sm text-white/50 ml-2">
        {BRAND_COLORS.find((c) => c.value === value)?.label || value}
      </span>
    </div>
  );
}
