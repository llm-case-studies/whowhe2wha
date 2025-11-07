import React, { useState, useEffect } from 'react';
import { useI18n } from '../hooks/useI18n';

interface ShareModalProps {
    url: string;
    onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ url, onClose }) => {
    const { t } = useI18n();
    const [copyButtonText, setCopyButtonText] = useState(t('copyLink'));

    useEffect(() => {
        // Reset button text if the language changes while the modal is open
        setCopyButtonText(t('copyLink'));
    }, [t]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (copyButtonText === t('copied')) {
            timer = setTimeout(() => {
                setCopyButtonText(t('copyLink'));
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [copyButtonText, t]);

    const handleCopy = () => {
        navigator.clipboard.writeText(url).then(() => {
            setCopyButtonText(t('copied'));
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            setCopyButtonText(t('failedToCopy'));
        });
    };

    return (
        <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
            <div className="bg-secondary border border-primary rounded-lg p-8 w-full max-w-lg shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 id="share-modal-title" className="text-xl font-bold text-primary">{t('shareProject')}</h2>
                    <button onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none">&times;</button>
                </div>
                <p className="text-secondary mb-4 text-sm">{t('shareProjectMsg')}</p>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={url}
                        readOnly
                        className="w-full px-3 py-2 bg-input border border-primary rounded-lg text-sm truncate"
                        onFocus={(e) => e.target.select()}
                    />
                    <button
                        onClick={handleCopy}
                        className="px-5 py-2 rounded-md bg-wha-blue text-white font-bold hover:bg-blue-600 transition-colors duration-200 w-32 text-center"
                    >
                        {copyButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};
