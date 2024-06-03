import React from 'react';

interface InputProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
}

const Input: React.FC<InputProps> = ({ label, type, value, onChange, id }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-gray-700 text-xs font-bold mb-2 uppercase">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>
);

export default Input;
