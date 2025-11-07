import React from 'react';
import { useI18n } from '../hooks/useI18n';

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
  confirmText,
  cancelText,
}) => {
  const { t } = useI18n();
  const finalConfirmText = confirmText || t('delete');
  const finalCancelText = cancelText || t('cancel');

  return (
    <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="confirmation-title">
      <div className="bg-secondary border border-primary rounded-lg p-8 w-full max-w-md shadow-2xl">
        <h2 id="confirmation-title" className="text-xl font-bold mb-4 text-primary">{title}</h2>
        <div className="text-secondary mb-6">{message}</div>
        <div className="flex justify-end space-x-4">
          <button onClick={onCancel} className="px-5 py-2 rounded-md font-semibold text-primary hover:bg-tertiary transition-colors duration-200">{finalCancelText}</button>
          <button onClick={onConfirm} className={`px-5 py-2 rounded-md text-white font-bold transition-colors duration-200 ${finalConfirmText.toLowerCase().includes('delete') || finalConfirmText.toLowerCase().includes('eliminar') ? 'bg-red-600 hover:bg-red-700' : 'bg-wha-blue hover:bg-blue-600'}`}>{finalConfirmText}</button>
        </div>
      </div>
    </div>
  );
};
