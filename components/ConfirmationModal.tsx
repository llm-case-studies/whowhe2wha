
import React from 'react';

interface ConfirmationModalProps {
  title: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Delete',
  cancelText = 'Cancel',
}) => {
  return (
    <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="confirmation-title">
      <div className="bg-secondary border border-primary rounded-lg p-8 w-full max-w-md shadow-2xl">
        <h2 id="confirmation-title" className="text-xl font-bold mb-4 text-primary">{title}</h2>
        <div className="text-secondary mb-6">{message}</div>
        <div className="flex justify-end space-x-4">
          <button onClick={onCancel} className="px-5 py-2 rounded-md font-semibold text-primary hover:bg-tertiary transition-colors duration-200">{cancelText}</button>
          <button onClick={onConfirm} className="px-5 py-2 rounded-md bg-red-600 text-white font-bold hover:bg-red-700 transition-colors duration-200">{confirmText}</button>
        </div>
      </div>
    </div>
  );
};
