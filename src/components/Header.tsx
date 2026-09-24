import React from 'react';
import { 
  FilePlus, 
  Printer, 
  Download, 
  Settings, 
  FileText, 
  Check, 
  Globe
} from 'lucide-react';

interface HeaderProps {
  onNewPrescription: () => void;
  onOpenSettings: () => void;
  onOpenTemplates: () => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  isGeneratingPdf: boolean;
  language: 'en' | 'bn';
  onToggleLanguage: () => void;
  activeMobileTab: 'editor' | 'preview';
  onSelectMobileTab: (tab: 'editor' | 'preview') => void;
  rxNumber: string;
}

export const Header: React.FC<HeaderProps> = ({
  onNewPrescription,
  onOpenSettings,
  onOpenTemplates,
  onPrint,
  onDownloadPdf,
  isGeneratingPdf,
  language,
  onToggleLanguage,
  activeMobileTab,
  onSelectMobileTab,
  rxNumber
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark / Brand title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            Rx
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
              RxMaker
            </h1>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Clinical Prescription Studio
            </p>
          </div>
        </div>

        {/* Center: Mobile View Switcher (Hidden on Desktop) */}
        <div className="flex md:hidden items-center bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => onSelectMobileTab('editor')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeMobileTab === 'editor'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'bn' ? 'এডিটর' : 'Editor'}
          </button>
          <button
            type="button"
            onClick={() => onSelectMobileTab('preview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeMobileTab === 'preview'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'bn' ? 'প্রিভিউ' : 'Live Preview'}
          </button>
        </div>

        {/* Center: Quick rx label & language toggle */}
        <div className="hidden lg:flex items-center gap-4 text-xs text-slate-500">
          <div className="font-mono bg-slate-100 px-2.5 py-1 rounded text-slate-700">
            {rxNumber}
          </div>
          <button
            type="button"
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-teal-700 bg-slate-50 hover:bg-teal-50 border border-slate-200 rounded-md transition-colors"
            title="Toggle Language / ভাষা পরিবর্তন"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'বাংলা (BN)' : 'English (EN)'}</span>
          </button>
        </div>

        {/* Zone 3: Primary Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Templates Button */}
          <button
            type="button"
            onClick={onOpenTemplates}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 text-teal-600" />
            <span>{language === 'bn' ? 'টেমপ্লেট' : 'Templates'}</span>
          </button>

          {/* New Prescription Button */}
          <button
            type="button"
            onClick={onNewPrescription}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
            title="Start new prescription"
          >
            <FilePlus className="w-3.5 h-3.5 text-slate-600" />
            <span>{language === 'bn' ? 'নতুন Rx' : 'New Rx'}</span>
          </button>

          {/* Settings Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 sm:px-3 sm:py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
            title="Doctor & Clinic Settings"
          >
            <Settings className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">{language === 'bn' ? 'সেটিংস' : 'Settings'}</span>
          </button>

          {/* Print Button */}
          <button
            type="button"
            onClick={onPrint}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors whitespace-nowrap"
            title="Print Prescription (A4)"
          >
            <Printer className="w-4 h-4 text-teal-700" />
            <span>{language === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
          </button>

          {/* Download PDF Button */}
          <button
            type="button"
            onClick={onDownloadPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 active:bg-teal-900 rounded-lg shadow-xs transition-colors whitespace-nowrap disabled:opacity-50"
            title="Download PDF Document"
          >
            {isGeneratingPdf ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{language === 'bn' ? 'PDF ডাউনলোড' : 'Download PDF'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
