'use client';
import { useState, KeyboardEvent } from 'react';
import { X } from '@phosphor-icons/react';

interface Props {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export default function TagInput({ tags, onChange, placeholder = 'Type and press Enter...' }: Props) {
  const [input, setInput] = useState('');

  const add = () => {
    const val = input.trim().toLowerCase();
    if (val && !tags.includes(val)) {
      onChange([...tags, val]);
    }
    setInput('');
  };

  const remove = (tag: string) => onChange(tags.filter((t) => t !== tag));

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add();
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      remove(tags[tags.length - 1]);
    }
  };

  return (
    <div className="min-h-[44px] flex flex-wrap gap-2 items-center px-3 py-2 border border-border rounded-lg focus-within:border-navy transition-colors bg-white">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1.5 bg-navy text-white text-xs font-medium px-2.5 py-1 rounded-full"
        >
          {tag}
          <button
            type="button"
            onClick={() => remove(tag)}
            className="hover:text-gold transition-colors"
          >
            <X size={10} weight="bold" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKey}
        onBlur={add}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] text-sm outline-none bg-transparent text-navy placeholder:text-muted/60"
      />
    </div>
  );
}
