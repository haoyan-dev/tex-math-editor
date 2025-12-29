'use client';

import { FONT_OPTIONS, DEFAULT_FONT, type FontOption } from '@/lib/constants';

interface FontSelectorProps {
  value: FontOption;
  onChange: (font: FontOption) => void;
}

export default function FontSelector({ value, onChange }: FontSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Font
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as FontOption)}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {FONT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

