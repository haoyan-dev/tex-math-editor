'use client';

import { FONT_OPTIONS, DEFAULT_FONT, type FontOption } from '@/lib/constants';

interface FontSelectorProps {
  value: FontOption;
  onChange: (font: FontOption) => void;
}

export default function FontSelector({ value, onChange }: FontSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2.5">
        Font
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as FontOption)}
        className="input-base w-full"
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

