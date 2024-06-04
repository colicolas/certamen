import React from 'react';

type FormButtonProps = {
  text: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  style?: string;
};

const FormButton: React.FC<FormButtonProps> = ({ text, onClick, type = 'submit', style = ''}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`border py-2 px-4 rounded transition duration-300 ${style}`}
    >
      {text}
    </button>
  );
};

export default FormButton;
