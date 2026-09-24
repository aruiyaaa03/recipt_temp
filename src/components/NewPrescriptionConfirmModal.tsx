import React from 'react';
import { AlertCircle } from 'lucide-react';

interface NewPrescriptionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  language: 'en' | 'bn';
}

export const NewPrescriptionConfirmModal: React.FC<NewPrescriptionConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  language
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          {language === 'bn' ? 'নতুন প্রেসক্রিপশন শুরু করবেন?' : 'Start a new prescription?'}
        </h3>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          {language === 'bn' 
            ? 'বর্তমান রোগীর সকল তথ্য ও ওষুধের তালিকা মুছে একটি ফ্রেশ প্রেসক্রিপশন তৈরি হবে। ডাক্তারের প্রোফাইল সেটিংস অক্ষুণ্ণ থাকবে।' 
            : 'This will reset patient details and medicines to generate a fresh prescription. Your doctor profile & clinic settings will be preserved.'}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {language === 'bn' ? 'বাতিল' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors"
          >
            {language === 'bn' ? 'হ্যাঁ, নতুন প্রেসক্রিপশন' : 'New Prescription'}
          </button>
        </div>
      </div>
    </div>
  );
};
