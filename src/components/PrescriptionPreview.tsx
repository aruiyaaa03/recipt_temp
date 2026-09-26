import React, { useState, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Printer, 
  Download, 
  Edit2, 
  Palette, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { PrescriptionData, PrescriptionTheme } from '../types/prescription';
import { PrescriptionSheet } from './PrescriptionSheet';
import { saveDoctorProfile } from '../utils/prescriptionUtils';

interface PrescriptionPreviewProps {
  data: PrescriptionData;
  onChange?: (updater: (prev: PrescriptionData) => PrescriptionData) => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  isGeneratingPdf: boolean;
  language: 'en' | 'bn';
}

const THEMES_LIST: { id: PrescriptionTheme; name: string; nameBn: string; color: string }[] = [
  { id: 'classic', name: 'Classic White', nameBn: '১. ক্লাসিক সাদা', color: '#0f766e' },
  { id: 'modern_banner', name: 'Modern Banner', nameBn: '২. মডার্ন ব্যানার', color: '#1e3a8a' },
  { id: 'minimal', name: 'Minimalist Clean', nameBn: '৩. মিনিমালিস্ট', color: '#334155' },
  { id: 'hospital_pad', name: 'Hospital Pad', nameBn: '৪. হসপিটাল প্যাড', color: '#047857' },
  { id: 'framed_royal', name: 'Royal Framed', nameBn: '৫. রয়্যাল ফ্রেমড', color: '#831843' },
  { id: 'dual_tint', name: 'Dual-Tone Mint', nameBn: '৬. ডুয়াল টোন', color: '#0284c7' }
];

const PRESET_COLORS = [
  { name: 'Teal', hex: '#0f766e' },
  { name: 'Navy', hex: '#1e3a8a' },
  { name: 'Emerald', hex: '#047857' },
  { name: 'Slate', hex: '#334155' },
  { name: 'Maroon', hex: '#831843' },
  { name: 'Indigo', hex: '#4338ca' }
];

export const PrescriptionPreview: React.FC<PrescriptionPreviewProps> = ({
  data,
  onChange,
  onPrint,
  onDownloadPdf,
  isGeneratingPdf,
  language
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isDirectEditEnabled, setIsDirectEditEnabled] = useState<boolean>(true);
  const [showColorPalette, setShowColorPalette] = useState<boolean>(false);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const { theme, primaryColor } = data;

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(140, Math.max(60, prev + delta)));
  };

  const resetZoom = () => {
    setZoomLevel(100);
  };

  const updateDoctor = (field: keyof typeof data.doctor, value: any) => {
    if (!onChange) return;
    onChange(prev => {
      const updatedDoc = { ...prev.doctor, [field]: value };
      saveDoctorProfile(updatedDoc);
      return { ...prev, doctor: updatedDoc };
    });
  };

  const handleThemeChange = (newTheme: PrescriptionTheme) => {
    if (!onChange) return;
    const matched = THEMES_LIST.find(t => t.id === newTheme);
    onChange(prev => ({
      ...prev,
      theme: newTheme,
      primaryColor: matched ? matched.color : prev.primaryColor
    }));
  };

  const handleColorChange = (newColor: string) => {
    if (!onChange) return;
    onChange(prev => ({ ...prev, primaryColor: newColor }));
    setShowColorPalette(false);
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2.5 * 1024 * 1024) {
        alert(language === 'bn' ? 'লোগো সাইজ ২.৫ মেগাবাইটের কম হতে হবে।' : 'Logo image must be smaller than 2.5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          updateDoctor('logoUrl', event.target.result);
          updateDoctor('showLogo', true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Hidden file input for logo */}
      <input
        type="file"
        ref={logoInputRef}
        accept="image/*"
        onChange={handleLogoFileChange}
        className="hidden"
      />

      {/* 🎨 TOP PREVIEW TOOLBAR WITH 6 THEME TABS & ACTIONS */}
      <div className="px-3 py-2 bg-slate-100/90 border-b border-slate-200/90 text-xs no-print rounded-t-xl shrink-0 space-y-2">
        {/* Row 1: Themes switcher */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-0.5">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              <span>{language === 'bn' ? 'টেমপ্লেট থিম:' : 'Theme:'}</span>
            </span>

            {THEMES_LIST.map((t) => {
              const isActive = theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleThemeChange(t.id)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-all shrink-0 flex items-center gap-1 ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                  <span>{language === 'bn' ? t.nameBn : t.name}</span>
                </button>
              );
            })}
          </div>

          {/* Color Preset Palette */}
          <div className="relative shrink-0 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowColorPalette(!showColorPalette)}
              className="p-1.5 bg-white border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 flex items-center gap-1"
              title="Change Accent Color / কালার পরিবর্তন"
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: primaryColor }} />
            </button>

            {showColorPalette && (
              <div className="absolute right-0 top-full mt-1 z-30 p-2 bg-white rounded-lg shadow-xl border border-slate-200 flex items-center gap-1.5 animate-in fade-in zoom-in-95">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => handleColorChange(c.hex)}
                    className="w-5 h-5 rounded-full border border-black/20 hover:scale-110 transition-transform relative flex items-center justify-center"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {primaryColor.toLowerCase() === c.hex.toLowerCase() && (
                      <Check className="w-3 h-3 text-white drop-shadow" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Secondary Controls (Zoom, Edit Mode, Print, PDF) */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-medium">
              A4 Portrait · {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={() => setIsDirectEditEnabled(!isDirectEditEnabled)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md border transition-colors ${
                isDirectEditEnabled
                  ? 'bg-teal-50 text-teal-800 border-teal-300'
                  : 'bg-white text-slate-500 border-slate-200 hover:text-slate-700'
              }`}
            >
              <Edit2 className="w-3 h-3 text-teal-700" />
              <span>{language === 'bn' ? 'সরাসরি এডিট চালু' : 'Click-to-Edit ON'}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <button
              type="button"
              onClick={() => handleZoom(-10)}
              className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={resetZoom}
              className="px-1.5 py-0.5 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
              title="Reset Zoom"
            >
              100%
            </button>
            <button
              type="button"
              onClick={() => handleZoom(10)}
              className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="h-4 w-px bg-slate-300 mx-1" />
            <button
              type="button"
              onClick={onPrint}
              className="px-2.5 py-1 text-xs font-semibold text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-md border border-teal-200 transition-colors flex items-center gap-1"
              title="Print Prescription"
            >
              <Printer className="w-3.5 h-3.5 text-teal-700" />
              <span className="hidden sm:inline">{language === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
            </button>
            <button
              type="button"
              onClick={onDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-2.5 py-1 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md transition-colors flex items-center gap-1 disabled:opacity-50"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* 📄 A4 PREVIEW CANVAS CONTAINER */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-200/70 flex justify-center custom-scrollbar">
        <div 
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-100 ease-out"
        >
          <PrescriptionSheet
            data={data}
            isEditable={isDirectEditEnabled}
            onChange={onChange}
            onLogoUploadClick={() => logoInputRef.current?.click()}
            onLogoRemove={() => updateDoctor('logoUrl', '')}
            id="prescription-print-wrapper"
            className="shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};
