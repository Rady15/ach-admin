import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const DataTable = ({ columns, data, actions }) => {
    const { t } = useLanguage();

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="text-right text-slate-400 text-sm border-b border-glass-border">
                        {columns.map((col, index) => (
                            <th key={index} className="pb-3 px-4">{t(col.label)}</th>
                        ))}
                        {actions && <th className="pb-3 px-4">{t('actions')}</th>}
                    </tr>
                </thead>
                <tbody className="text-white text-sm">
                    {data.map((item, rowIndex) => (
                        <tr key={rowIndex} className="border-b border-glass-border last:border-0 hover:bg-white/5 transition-colors">
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} className={`py-3 px-4 ${col.className || ''}`}>
                                    {col.render ? col.render(item) : item[col.key]}
                                </td>
                            ))}
                            {actions && (
                                <td className="py-3 px-4">
                                    {actions(item)}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
