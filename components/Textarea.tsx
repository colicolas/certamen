import React from 'react';

interface TextareaProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  id: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  rows?: number;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  value,
  onChange,
  id,
  required = false,
  disabled = false,
  className = '',
  rows = 4
}) => (
  <div className="mb-4">
    {label && (
      <label htmlFor={id} className="block text-gray-700 text-xs font-bold mb-2 uppercase">
        {label}
      </label>
    )}
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${className}`}
      required={required}
      rows={rows}
    />
  </div>
);

export default Textarea;
