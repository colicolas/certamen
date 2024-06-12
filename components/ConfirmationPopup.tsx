import React from 'react';
import FormButton from '@/components/FormButton';

type ConfirmationPopupProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-beige-300 p-6 rounded-lg text-center">
        <h2 className="text-xl mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-center space-x-4">
          <FormButton text="Yes" onClick={onConfirm} style="border border-indigo-600 bg-beige-300 text-gray-800 hover:bg-beige-500" />
          <FormButton text="No" onClick={onCancel} style="bg-indigo-600 text-white hover:bg-indigo-400" />
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
