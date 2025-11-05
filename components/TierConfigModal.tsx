import React, { useState, useEffect } from 'react';
import { Tier, TierConfig } from '../types';
import { PROJECT_CATEGORIES } from '../constants';

interface TierConfigModalProps {
    currentConfig: TierConfig;
    onSave: (newConfig: TierConfig) => void;
    onClose: () => void;
}

export const TierConfigModal: React.FC<TierConfigModalProps> = ({ currentConfig, onSave, onClose }) => {
    const [config, setConfig] = useState<TierConfig>(() => JSON.parse(JSON.stringify(currentConfig)));

    const getCategoryTier = (category: string): string => {
        const tier = config.find(t => t.categories.includes(category));
        return tier ? tier.id : 'unassigned';
    };

    const handleCategoryChange = (category: string, newTierId: string) => {
        setConfig(prevConfig => {
            const newConfig = JSON.parse(JSON.stringify(prevConfig));
            // Remove from old tier
            newConfig.forEach(tier => {
                tier.categories = tier.categories.filter((c: string) => c !== category);
            });
            // Add to new tier if it's not 'unassigned'
            if (newTierId !== 'unassigned') {
                const targetTier = newConfig.find((t: Tier) => t.id === newTierId);
                if (targetTier) {
                    targetTier.categories.push(category);
                }
            }
            return newConfig;
        });
    };

    const handleAddTier = () => {
        const newTierName = `Tier ${config.length + 1}`;
        const newTierId = `tier-${Date.now()}`;
        setConfig([...config, { id: newTierId, name: newTierName, categories: [] }]);
    };
    
    const handleRemoveTier = (tierId: string) => {
        if (config.length <= 1) return; // Don't allow removing the last tier
        setConfig(config.filter(t => t.id !== tierId && t.categories.length === 0));
    }
    
    const handleRenameTier = (tierId: string, newName: string) => {
        setConfig(config.map(t => t.id === tierId ? { ...t, name: newName } : t));
    }

    return (
        <div className="fixed inset-0 bg-modal-overlay flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="tier-config-title">
            <div className="bg-secondary border border-primary rounded-lg p-8 w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-6 flex-shrink-0">
                    <h2 id="tier-config-title" className="text-2xl font-bold">Timeline Layout</h2>
                    <button onClick={onClose} className="text-secondary hover:text-primary text-3xl leading-none" aria-label="Close form">&times;</button>
                </div>
                
                <div className="overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-primary border-b border-primary pb-2 mb-3">Tiers</h3>
                            <div className="space-y-2">
                                {config.map((tier, index) => (
                                     <div key={tier.id} className="flex items-center space-x-2">
                                         <input 
                                             type="text"
                                             value={tier.name}
                                             onChange={(e) => handleRenameTier(tier.id, e.target.value)}
                                             className="flex-grow px-2 py-1 bg-input border border-primary rounded-md focus:ring-2 focus:ring-wha-blue focus:outline-none"
                                         />
                                         <button 
                                             onClick={() => handleRemoveTier(tier.id)}
                                             disabled={config.length <= 1 || tier.categories.length > 0}
                                             className="px-2 py-1 text-sm rounded-md bg-tertiary text-secondary hover:bg-red-800 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                             title={tier.categories.length > 0 ? "Cannot remove a tier with categories assigned" : "Remove Tier"}
                                         >&times;</button>
                                     </div>
                                ))}
                                <button onClick={handleAddTier} className="w-full mt-2 px-4 py-2 text-sm font-semibold rounded-md bg-tertiary hover:bg-wha-blue hover:text-white transition">
                                    + Add New Tier
                                </button>
                            </div>
                        </div>

                        <div>
                             <h3 className="text-lg font-semibold text-primary border-b border-primary pb-2 mb-3">Category Assignments</h3>
                            <div className="space-y-2">
                                {PROJECT_CATEGORIES.map(category => (
                                    <div key={category} className="flex justify-between items-center">
                                        <label htmlFor={`cat-${category}`} className="text-primary">{category}</label>
                                        <select 
                                            id={`cat-${category}`}
                                            value={getCategoryTier(category)}
                                            onChange={(e) => handleCategoryChange(category, e.target.value)}
                                            className="px-3 py-1 bg-input border border-primary rounded-lg focus:ring-2 focus:ring-wha-blue focus:outline-none transition duration-200"
                                        >
                                            <option value="unassigned">Unassigned</option>
                                            <optgroup label="Tiers">
                                                {config.map(tier => (
                                                    <option key={tier.id} value={tier.id}>{tier.name}</option>
                                                ))}
                                            </optgroup>
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 mt-auto flex-shrink-0">
                    <button type="button" onClick={onClose} className="px-5 py-2 rounded-md text-primary hover:bg-tertiary transition">
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => onSave(config)}
                        className="px-5 py-2 rounded-md bg-wha-blue text-white font-bold hover:bg-blue-600 transition"
                    >
                        Save Layout
                    </button>
                </div>
            </div>
        </div>
    )
}