'use client';
import { Plus, Trash } from '@phosphor-icons/react';

export interface SizeEntry {
  size: string;
  quantity: number;
}

interface Props {
  sizes: SizeEntry[];
  onChange: (sizes: SizeEntry[]) => void;
}

const COMMON_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42', '7', '8', '9', '10', '11', '12'];

export default function SizeManager({ sizes, onChange }: Props) {
  const addSize = () => onChange([...sizes, { size: '', quantity: 0 }]);

  const addPreset = (preset: string) => {
    if (sizes.some((s) => s.size === preset)) return;
    onChange([...sizes, { size: preset, quantity: 1 }]);
  };

  const update = (i: number, field: 'size' | 'quantity', value: string | number) => {
    const updated = [...sizes];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  };

  const remove = (i: number) => onChange(sizes.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      {/* Common size presets */}
      <div>
        <p className="text-xs text-muted mb-2 font-medium">Quick add common sizes:</p>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addPreset(s)}
              disabled={sizes.some((e) => e.size === s)}
              className="text-xs px-2.5 py-1 border border-border rounded-lg hover:border-navy hover:text-navy disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Size rows */}
      <div className="space-y-2">
        {sizes.map((entry, i) => (
          <div key={i} className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Size (e.g. M, 32)"
              value={entry.size}
              onChange={(e) => update(i, 'size', e.target.value)}
              className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-navy transition-colors"
            />
            <div className="flex items-center gap-1">
              <label className="text-xs text-muted whitespace-nowrap">Qty:</label>
              <input
                type="number"
                min={0}
                value={entry.quantity}
                onChange={(e) => update(i, 'quantity', parseInt(e.target.value) || 0)}
                className="w-20 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-navy transition-colors"
              />
            </div>
            {entry.quantity === 0 && (
              <span className="text-xs text-muted/60 italic whitespace-nowrap">hidden on site</span>
            )}
            <button
              type="button"
              onClick={() => remove(i)}
              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addSize}
        className="flex items-center gap-2 text-sm text-navy font-medium hover:text-gold transition-colors"
      >
        <Plus size={16} weight="bold" />
        Add custom size
      </button>
    </div>
  );
}
