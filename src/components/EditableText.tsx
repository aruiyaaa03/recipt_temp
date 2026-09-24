import React, { useState, useRef, useEffect } from 'react';

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  placeholder = 'Click to edit...',
  multiline = false,
  className = '',
  style = {},
  disabled = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (currentValue !== value) {
      onChange(currentValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') {
      setIsEditing(false);
      if (currentValue !== value) {
        onChange(currentValue);
      }
    } else if (e.key === 'Escape') {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  if (disabled) {
    return <span className={className} style={style}>{value || placeholder}</span>;
  }

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={Math.max(2, currentValue.split('\n').length)}
          className={`w-full bg-teal-50/60 text-slate-900 border border-teal-500 rounded px-1.5 py-0.5 outline-none focus:ring-1 focus:ring-teal-600 font-inherit resize-none ${className}`}
          style={style}
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`bg-teal-50/60 text-slate-900 border border-teal-500 rounded px-1.5 py-0.5 outline-none focus:ring-1 focus:ring-teal-600 font-inherit ${className}`}
        style={style}
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      title="Click to edit directly on paper"
      className={`group/edit cursor-text relative inline-block rounded transition-all hover:bg-teal-50/70 hover:outline-dashed hover:outline-1 hover:outline-teal-400 px-0.5 ${className}`}
      style={style}
    >
      {value ? (
        value
      ) : (
        <span className="text-slate-400 italic font-normal">{placeholder}</span>
      )}
    </span>
  );
};
