
import React from 'react';

interface ConfirmationModalProps {
  title: string;
  message: string;
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
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  return (
    <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50">
      <div className="bg-secondary border border-primary rounded-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-secondary mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button onClick={onCancel} className="px-5 py-2 rounded-md text-primary hover:bg-tertiary">{cancelText}</button>
          <button onClick={onConfirm} className="px-5 py-2 rounded-md bg-red-600 text-white font-bold">{confirmText}</button>
        </div>
      </div>
    </div>
  );
};
