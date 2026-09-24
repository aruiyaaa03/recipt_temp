import React from 'react';
import { X, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { CLINICAL_TEMPLATES, ClinicalTemplate } from '../data/templates';
import { PrescriptionData } from '../types/prescription';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: ClinicalTemplate) => void;
  language: 'en' | 'bn';
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  language
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-700" />
              <span>{language === 'bn' ? 'ক্লিনিক্যাল প্রেসক্রিপশন টেমপ্লেট' : 'Clinical Prescription Templates'}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'bn' 
                ? 'এক ক্লিকে দ্রুত প্রেসক্রিপশন তৈরি করার জন্য প্রিসেট বেছে নিন।' 
                : 'Choose a clinically vetted starting preset to quickly generate prescriptions.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
          {CLINICAL_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => {
                onSelectTemplate(tpl);
                onClose();
              }}
              className="p-4 rounded-xl border border-slate-200 hover:border-teal-600 hover:bg-teal-50/30 cursor-pointer transition-all flex items-start justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {tpl.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-900">
                    {language === 'bn' ? tpl.nameBn : tpl.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {tpl.description}
                </p>
                <div className="text-[11px] text-teal-800 font-medium pt-1">
                  {tpl.data.medicines?.length || 0} Medicines · {tpl.data.adviceList?.length || 0} Advices
                </div>
              </div>

              <div className="text-slate-300 group-hover:text-teal-700 transition-colors shrink-0 mt-2">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>{language === 'bn' ? 'টেমপ্লেট লোড করলে বর্তমান ডেটা প্রতিস্থাপিত হবে।' : 'Loading a template replaces current editor inputs.'}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-slate-700 hover:bg-slate-200/60 rounded-md font-medium"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
