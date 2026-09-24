import React, { useState, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Printer, 
  Download, 
  Building, 
  Phone, 
  Clock, 
  MapPin, 
  Edit2, 
  Mail, 
  Upload, 
  Trash2, 
  Image as ImageIcon,
  Palette,
  Check,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { PrescriptionData, MedicineItem, PrescriptionTheme } from '../types/prescription';
import { EditableText } from './EditableText';
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
  { id: 'classic', name: 'Classic White', nameBn: '১. ক্লাসিক ক্লিনিক্যাল', color: '#0f766e' },
  { id: 'modern_banner', name: 'Modern Banner', nameBn: '২. মডার্ন ব্যানার', color: '#1e3a8a' },
  { id: 'minimal', name: 'Minimalist Clean', nameBn: '৩. মিনিমালিস্ট এলিগ্যান্ট', color: '#334155' },
  { id: 'hospital_pad', name: 'Hospital Pad', nameBn: '৪. হসপিটাল অফিসিয়াল', color: '#047857' },
  { id: 'framed_royal', name: 'Royal Framed', nameBn: '৫. রয়্যাল ফ্রেমড', color: '#831843' },
  { id: 'dual_tint', name: 'Dual-Tone Mint', nameBn: '৬. ডুয়াল টোন হেলথকেয়ার', color: '#0284c7' }
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

  const { doctor, patient, clinical, medicines, adviceList, adviceText, followUp, labels, primaryColor, theme } = data;

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(140, Math.max(60, prev + delta)));
  };

  const resetZoom = () => {
    setZoomLevel(100);
  };

  // State updater helpers for direct preview editing
  const updateDoctor = (field: keyof typeof doctor, value: any) => {
    if (!onChange) return;
    onChange(prev => {
      const updatedDoc = { ...prev.doctor, [field]: value };
      saveDoctorProfile(updatedDoc);
      return { ...prev, doctor: updatedDoc };
    });
  };

  const updateLabel = (field: keyof typeof labels, value: string) => {
    if (!onChange) return;
    onChange(prev => ({
      ...prev,
      labels: {
        ...(prev.labels || {}),
        [field]: value
      }
    }));
  };

  const updatePatient = (field: keyof typeof patient, value: any) => {
    if (!onChange) return;
    onChange(prev => ({
      ...prev,
      patient: { ...prev.patient, [field]: value }
    }));
  };

  const updateClinical = (field: keyof typeof clinical, value: any) => {
    if (!onChange) return;
    onChange(prev => ({
      ...prev,
      clinical: { ...prev.clinical, [field]: value }
    }));
  };

  const updateMedicineItem = (index: number, updates: Partial<MedicineItem>) => {
    if (!onChange) return;
    onChange(prev => {
      const copy = [...prev.medicines];
      copy[index] = { ...copy[index], ...updates };
      return { ...prev, medicines: copy };
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
        alert(language === 'bn' ? 'লোগো সাইজ ২.৫ মেগাবাইট-এর কম হতে হবে।' : 'Logo image must be smaller than 2.5MB.');
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

  const removeLogo = () => {
    updateDoctor('logoUrl', '');
  };

  const hasClinicalNotes = clinical.chiefComplaint || clinical.diagnosis || (clinical.selectedTests && clinical.selectedTests.length > 0) || clinical.investigation;

  // Render Logo Box (Custom uploaded logo or friendly upload trigger)
  const renderLogoBox = (whiteBg: boolean = false) => {
    return (
      <div className="relative group/logo shrink-0">
        <input
          type="file"
          ref={logoInputRef}
          accept="image/*"
          onChange={handleLogoFileChange}
          className="hidden"
        />

        {doctor.logoUrl ? (
          <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg p-1 border flex items-center justify-center overflow-hidden shadow-xs ${
            whiteBg ? 'bg-white border-white/40' : 'bg-white border-slate-200'
          }`}>
            <img
              src={doctor.logoUrl}
              alt="Clinic Logo"
              className="max-h-full max-w-full object-contain"
            />
            {/* Quick action buttons on hover */}
            <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center gap-1.5 no-print">
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="p-1 bg-white text-slate-800 rounded hover:bg-teal-50"
                title="Change Logo / লোগো পরিবর্তন"
              >
                <Upload className="w-3.5 h-3.5 text-teal-700" />
              </button>
              <button
                type="button"
                onClick={removeLogo}
                className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                title="Remove Logo / লোগো মুছুন"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-all p-1 no-print ${
              whiteBg 
                ? 'border-white/60 bg-white/10 text-white hover:bg-white/20' 
                : 'border-teal-300 bg-teal-50/40 text-teal-700 hover:bg-teal-50 hover:border-teal-500'
            }`}
            title="Click to Upload Clinic Logo / ক্লিনিক লোগো আপলোড করুন"
          >
            <Upload className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] font-bold text-center leading-tight">
              {language === 'bn' ? '+ লোগো দিন' : '+ Add Logo'}
            </span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
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
          {/* THE REAL A4 SHEET (Styles dynamically applied based on selected theme) */}
          <div
            id="prescription-print-wrapper"
            className={`w-[210mm] min-h-[297mm] bg-white shadow-xl text-slate-900 flex flex-col justify-between font-sans print-page-a4 relative box-border ${
              theme === 'framed_royal' ? 'border-[3px] border-double p-[10mm]' : 'p-[12mm_14mm]'
            }`}
            style={{
              borderColor: primaryColor
            }}
          >
            {/* THEME 5: ROYAL FRAMED CORNER EMBELLISHMENT & WATERMARK */}
            {theme === 'framed_royal' && (
              <div 
                className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.035] select-none text-[160mm] font-serif font-black"
                style={{ color: primaryColor }}
              >
                ℞
              </div>
            )}

            {/* 🩺 HEADER SECTION: RENDERED PER THEME */}
            {/* THEME 2: MODERN EXECUTIVE BANNER (Full-width colored bar) */}
            {theme === 'modern_banner' ? (
              <header 
                className="rounded-xl p-5 mb-4 text-white shadow-sm flex items-start justify-between gap-4 avoid-break"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="flex items-start gap-4 flex-1">
                  {renderLogoBox(true)}
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase leading-tight text-white">
                      <EditableText
                        value={doctor.clinicName}
                        onChange={(val) => updateDoctor('clinicName', val)}
                        placeholder="ENTER CLINIC NAME"
                        disabled={!isDirectEditEnabled}
                        className="text-white hover:bg-white/20"
                      />
                    </h2>
                    <div className="text-xs text-white/90 font-medium mt-0.5">
                      <EditableText
                        value={doctor.clinicTagline}
                        onChange={(val) => updateDoctor('clinicTagline', val)}
                        placeholder="Add clinic tagline..."
                        disabled={!isDirectEditEnabled}
                        className="text-white/90 hover:bg-white/20"
                      />
                    </div>
                    <div className="text-[10px] text-white/80 mt-1.5 space-y-0.5">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 shrink-0" />
                        <EditableText
                          value={doctor.address}
                          onChange={(val) => updateDoctor('address', val)}
                          placeholder="Clinic Address"
                          disabled={!isDirectEditEnabled}
                          className="text-white/80 hover:bg-white/20"
                        />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Mail className="w-2.5 h-2.5 shrink-0" />
                          <EditableText
                            value={doctor.email}
                            onChange={(val) => updateDoctor('email', val)}
                            placeholder="Gmail / Email"
                            disabled={!isDirectEditEnabled}
                            className="text-white/80 hover:bg-white/20"
                          />
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5 shrink-0" />
                          <EditableText
                            value={doctor.phone}
                            onChange={(val) => updateDoctor('phone', val)}
                            placeholder="Hotline / Phone"
                            disabled={!isDirectEditEnabled}
                            className="text-white/80 hover:bg-white/20"
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-1 max-w-[45%] flex flex-col items-end">
                  <h3 className="text-base font-bold text-white leading-tight">
                    <EditableText
                      value={doctor.doctorName}
                      onChange={(val) => updateDoctor('doctorName', val)}
                      placeholder="Doctor Name"
                      disabled={!isDirectEditEnabled}
                      className="text-white hover:bg-white/20"
                    />
                  </h3>
                  <div className="text-xs font-semibold text-white/90 mt-0.5">
                    <EditableText
                      value={doctor.degree}
                      onChange={(val) => updateDoctor('degree', val)}
                      placeholder="Qualifications"
                      disabled={!isDirectEditEnabled}
                      className="text-white/90 hover:bg-white/20"
                    />
                  </div>
                  <div className="text-[11px] font-bold text-white/95 mt-0.5">
                    <EditableText
                      value={doctor.specialty}
                      onChange={(val) => updateDoctor('specialty', val)}
                      placeholder="Specialty"
                      disabled={!isDirectEditEnabled}
                      className="text-white/95 hover:bg-white/20"
                    />
                  </div>
                  <div className="text-[10px] text-white/80 font-mono mt-0.5">
                    <EditableText
                      value={doctor.registrationNumber}
                      onChange={(val) => updateDoctor('registrationNumber', val)}
                      placeholder="Reg. No."
                      disabled={!isDirectEditEnabled}
                      className="text-white/80 hover:bg-white/20"
                    />
                  </div>
                  <div className="text-[10px] text-white/80 mt-1 flex items-center justify-end gap-1">
                    <Clock className="w-2.5 h-2.5 shrink-0" />
                    <EditableText
                      value={doctor.visitingHours}
                      onChange={(val) => updateDoctor('visitingHours', val)}
                      placeholder="Visiting hours"
                      disabled={!isDirectEditEnabled}
                      className="text-white/80 hover:bg-white/20"
                    />
                  </div>
                </div>
              </header>
            ) : theme === 'hospital_pad' ? (
              /* THEME 4: HOSPITAL FORMAL PAD (Official letterhead with department badge) */
              <header className="border-b-2 pb-3 mb-3 avoid-break" style={{ borderColor: primaryColor }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1">
                    {renderLogoBox()}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-[9.5px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded"
                          style={{ backgroundColor: primaryColor }}
                        >
                          Govt. Reg. Healthcare
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          ID: {data.rxNumber}
                        </span>
                      </div>
                      <h2 
                        className="text-lg sm:text-xl font-black tracking-tight uppercase leading-tight mt-1"
                        style={{ color: primaryColor }}
                      >
                        <EditableText
                          value={doctor.clinicName}
                          onChange={(val) => updateDoctor('clinicName', val)}
                          placeholder="ENTER CLINIC NAME"
                          disabled={!isDirectEditEnabled}
                        />
                      </h2>
                      <div className="text-[11px] text-slate-600 font-medium">
                        <EditableText
                          value={doctor.clinicTagline}
                          onChange={(val) => updateDoctor('clinicTagline', val)}
                          placeholder="Clinic Tagline"
                          disabled={!isDirectEditEnabled}
                        />
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-3">
                        <span>
                          <EditableText
                            value={doctor.address}
                            onChange={(val) => updateDoctor('address', val)}
                            placeholder="Address"
                            disabled={!isDirectEditEnabled}
                          />
                        </span>
                        <span>·</span>
                        <span>
                          <EditableText
                            value={doctor.email}
                            onChange={(val) => updateDoctor('email', val)}
                            placeholder="Email"
                            disabled={!isDirectEditEnabled}
                          />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-1 max-w-[45%] border-l-2 pl-3 border-slate-200 flex flex-col items-end">
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      <EditableText
                        value={doctor.doctorName}
                        onChange={(val) => updateDoctor('doctorName', val)}
                        placeholder="Doctor Name"
                        disabled={!isDirectEditEnabled}
                      />
                    </h3>
                    <div className="text-xs font-semibold text-slate-700 mt-0.5">
                      <EditableText
                        value={doctor.degree}
                        onChange={(val) => updateDoctor('degree', val)}
                        placeholder="Degree"
                        disabled={!isDirectEditEnabled}
                      />
                    </div>
                    <div 
                      className="text-[11px] font-bold mt-0.5"
                      style={{ color: primaryColor }}
                    >
                      <EditableText
                        value={doctor.specialty}
                        onChange={(val) => updateDoctor('specialty', val)}
                        placeholder="Specialty"
                        disabled={!isDirectEditEnabled}
                      />
                    </div>
                    <div className="text-[10px] text-slate-600 font-mono mt-0.5">
                      <EditableText
                        value={doctor.registrationNumber}
                        onChange={(val) => updateDoctor('registrationNumber', val)}
                        placeholder="Registration No."
                        disabled={!isDirectEditEnabled}
                      />
                    </div>
                  </div>
                </div>
              </header>
            ) : theme === 'framed_royal' ? (
              /* THEME 5: FRAMED ROYAL (Centered crest & regal layout) */
              <header className="border-b pb-3 mb-3 text-center avoid-break" style={{ borderColor: primaryColor }}>
                <div className="flex flex-col items-center justify-center">
                  {renderLogoBox()}
                  <h2 
                    className="text-xl sm:text-2xl font-serif font-black tracking-wide uppercase leading-tight mt-1.5"
                    style={{ color: primaryColor }}
                  >
                    <EditableText
                      value={doctor.clinicName}
                      onChange={(val) => updateDoctor('clinicName', val)}
                      placeholder="ENTER CLINIC NAME"
                      disabled={!isDirectEditEnabled}
                    />
                  </h2>
                  <div className="text-xs text-slate-600 italic tracking-wider">
                    <EditableText
                      value={doctor.clinicTagline}
                      onChange={(val) => updateDoctor('clinicTagline', val)}
                      placeholder="Medical center tagline"
                      disabled={!isDirectEditEnabled}
                    />
                  </div>
                  <div className="w-24 h-0.5 my-1.5 opacity-60 mx-auto" style={{ backgroundColor: primaryColor }} />
                  <div className="flex items-center justify-center gap-3 text-xs text-slate-800 font-medium">
                    <span>
                      <strong className="font-bold text-slate-900">
                        <EditableText
                          value={doctor.doctorName}
                          onChange={(val) => updateDoctor('doctorName', val)}
                          placeholder="Doctor Name"
                          disabled={!isDirectEditEnabled}
                        />
                      </strong>{' '}
                      —{' '}
                      <EditableText
                        value={doctor.degree}
                        onChange={(val) => updateDoctor('degree', val)}
                        placeholder="Degrees"
                        disabled={!isDirectEditEnabled}
                      />
                    </span>
                    <span>·</span>
                    <span style={{ color: primaryColor }} className="font-bold">
                      <EditableText
                        value={doctor.specialty}
                        onChange={(val) => updateDoctor('specialty', val)}
                        placeholder="Specialty"
                        disabled={!isDirectEditEnabled}
                      />
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-center gap-3">
                    <span>
                      <EditableText
                        value={doctor.address}
                        onChange={(val) => updateDoctor('address', val)}
                        placeholder="Address"
                        disabled={!isDirectEditEnabled}
                      />
                    </span>
                    <span>·</span>
                    <span>
                      <EditableText
                        value={doctor.phone}
                        onChange={(val) => updateDoctor('phone', val)}
                        placeholder="Phone"
                        disabled={!isDirectEditEnabled}
                      />
                    </span>
                    <span>·</span>
                    <span>
                      <EditableText
                        value={doctor.email}
                        onChange={(val) => updateDoctor('email', val)}
                        placeholder="Gmail / Email"
                        disabled={!isDirectEditEnabled}
                      />
                    </span>
                  </div>
                </div>
              </header>
            ) : (
              /* THEMES 1, 3, 6 (Classic, Minimalist, Dual-Tone) */
              <header className="border-b-2 pb-3 mb-3 avoid-break" style={{ borderColor: primaryColor }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {renderLogoBox()}
                    <div className="flex-1">
                      <h2 
                        className={`font-black tracking-tight uppercase leading-tight ${
                          theme === 'minimal' ? 'text-lg font-serif' : 'text-lg sm:text-xl'
                        }`}
                        style={{ color: primaryColor }}
                      >
                        <EditableText
                          value={doctor.clinicName}
                          onChange={(val) => updateDoctor('clinicName', val)}
                          placeholder="ENTER CLINIC NAME"
                          disabled={!isDirectEditEnabled}
                        />
                      </h2>
                      <div className="text-[11px] text-slate-600 font-medium tracking-wide mt-0.5">
                        <EditableText
                          value={doctor.clinicTagline}
                          onChange={(val) => updateDoctor('clinicTagline', val)}
                          placeholder="Add clinic tagline or specialty services..."
                          disabled={!isDirectEditEnabled}
                        />
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 space-y-0.5 leading-tight">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                          <EditableText
                            value={doctor.address}
                            onChange={(val) => updateDoctor('address', val)}
                            placeholder="Clinic Address (e.g. Green Road, Dhanmondi, Dhaka)"
                            disabled={!isDirectEditEnabled}
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                          <EditableText
                            value={doctor.email}
                            onChange={(val) => updateDoctor('email', val)}
                            placeholder="Gmail / Email"
                            disabled={!isDirectEditEnabled}
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                          <EditableText
                            value={doctor.phone}
                            onChange={(val) => updateDoctor('phone', val)}
                            placeholder="Phone / Hotline"
                            disabled={!isDirectEditEnabled}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-1 max-w-[50%] flex flex-col items-end">
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      <EditableText
                        value={doctor.doctorName}
                        onChange={(val) => updateDoctor('doctorName', val)}
                        placeholder="Doctor Name"
                        disabled={!isDirectEditEnabled}
                      />
                    </h3>
                    <div className="text-xs font-semibold text-slate-700 leading-snug mt-0.5">
                      <EditableText
                        value={doctor.degree}
                        onChange={(val) => updateDoctor('degree', val)}
                        placeholder="Qualifications"
                        disabled={!isDirectEditEnabled}
                      />
                    </div>
                    <div 
                      className="text-[11px] font-bold tracking-wide mt-0.5"
                      style={{ color: primaryColor }}
                    >
                      <EditableText
                        value={doctor.specialty}
                        onChange={(val) => updateDoctor('specialty', val)}
                        placeholder="Specialty"
                        disabled={!isDirectEditEnabled}
                      />
                    </div>
                    <div className="text-[10px] text-slate-600 font-mono mt-0.5">
                      <EditableText
                        value={doctor.registrationNumber}
                        onChange={(val) => updateDoctor('registrationNumber', val)}
                        placeholder="BMDC Reg. No."
                        disabled={!isDirectEditEnabled}
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-end gap-1">
                      <Clock className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                      <EditableText
                        value={doctor.visitingHours}
                        onChange={(val) => updateDoctor('visitingHours', val)}
                        placeholder="Visiting hours"
                        disabled={!isDirectEditEnabled}
                      />
                    </div>
                  </div>
                </div>
              </header>
            )}

            {/* 👤 PATIENT INFORMATION STRIP (Styled per Theme) */}
            <div className={`px-3.5 py-2 mb-4 text-xs text-slate-800 avoid-break ${
              theme === 'modern_banner'
                ? 'bg-slate-50 rounded-lg border-l-4 shadow-2xs'
                : theme === 'dual_tint'
                ? 'bg-teal-50/70 border border-teal-200 rounded-lg'
                : theme === 'minimal'
                ? 'border-b border-t border-slate-200 bg-transparent px-1'
                : theme === 'hospital_pad'
                ? 'border border-slate-300 rounded bg-slate-50/50'
                : 'bg-slate-50 border border-slate-200/80 rounded-md'
            }`}
            style={{
              borderLeftColor: theme === 'modern_banner' ? primaryColor : undefined
            }}
            >
              <div className="grid grid-cols-12 gap-y-1.5 gap-x-2 items-center">
                <div className="col-span-5 flex items-center gap-1.5 truncate">
                  <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider shrink-0">
                    <EditableText
                      value={labels?.patientLabel || 'Patient:'}
                      onChange={(val) => updateLabel('patientLabel', val)}
                      disabled={!isDirectEditEnabled}
                    />
                  </span>
                  <span className="font-bold text-slate-900 truncate">
                    <EditableText
                      value={patient.name}
                      onChange={(val) => updatePatient('name', val)}
                      placeholder="— Patient Name —"
                      disabled={!isDirectEditEnabled}
                    />
                  </span>
                </div>

                <div className="col-span-2 flex items-center gap-1">
                  <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider shrink-0">
                    <EditableText
                      value={labels?.ageLabel || 'Age:'}
                      onChange={(val) => updateLabel('ageLabel', val)}
                      disabled={!isDirectEditEnabled}
                    />
                  </span>
                  <span className="font-semibold text-slate-900">
                    <EditableText
                      value={patient.age ? `${patient.age} ${patient.ageUnit === 'Years' ? (language === 'bn' ? 'বছর' : 'Y') : patient.ageUnit}` : ''}
                      onChange={(val) => updatePatient('age', val.replace(/[^0-9]/g, ''))}
                      placeholder="Age"
                      disabled={!isDirectEditEnabled}
                    />
                  </span>
                </div>

                <div className="col-span-2 flex items-center gap-1">
                  <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider shrink-0">
                    <EditableText
                      value={labels?.genderLabel || 'Sex:'}
                      onChange={(val) => updateLabel('genderLabel', val)}
                      disabled={!isDirectEditEnabled}
                    />
                  </span>
                  <span className="font-semibold text-slate-900">
                    <EditableText
                      value={patient.gender}
                      onChange={(val) => updatePatient('gender', val as any)}
                      disabled={!isDirectEditEnabled}
                    />
                  </span>
                </div>

                <div className="col-span-3 flex items-center gap-1 justify-end font-mono text-[11px]">
                  <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider shrink-0">
                    <EditableText
                      value={labels?.dateLabel || 'Date:'}
                      onChange={(val) => updateLabel('dateLabel', val)}
                      disabled={!isDirectEditEnabled}
                    />
                  </span>
                  <span className="font-semibold text-slate-900">
                    <EditableText
                      value={data.date}
                      onChange={(val) => onChange && onChange(prev => ({ ...prev, date: val }))}
                      disabled={!isDirectEditEnabled}
                    />
                  </span>
                </div>

                {/* Second Row: Weight, Phone, Rx No */}
                <div className="col-span-3 flex items-center gap-1 text-[11px]">
                  <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider shrink-0">
                    <EditableText
                      value={labels?.weightLabel || 'Weight:'}
                      onChange={(val) => updateLabel('weightLabel', val)}
                      disabled={!isDirectEditEnabled}
                    />
                  </span>
                  <span className="font-medium text-slate-900">
                    <EditableText
                      value={patient.weight ? `${patient.weight} kg` : ''}
                      onChange={(val) => updatePatient('weight', val.replace('kg', '').trim())}
                      placeholder="— kg"
                      disabled={!isDirectEditEnabled}
                    />
                  </span>
                </div>

                <div className="col-span-4 flex items-center gap-1 text-[11px] truncate">
                  <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider shrink-0">
                    <EditableText
                      value={labels?.phoneLabel || 'Phone:'}
                      onChange={(val) => updateLabel('phoneLabel', val)}
                      disabled={!isDirectEditEnabled}
                    />
                  </span>
                  <span className="font-medium text-slate-900 truncate">
                    <EditableText
                      value={patient.phone}
                      onChange={(val) => updatePatient('phone', val)}
                      placeholder="— Phone —"
                      disabled={!isDirectEditEnabled}
                    />
                  </span>
                </div>

                <div className="col-span-5 flex items-center gap-1 justify-end font-mono text-[11px]">
                  <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider shrink-0">
                    <EditableText
                      value={labels?.rxNoLabel || 'Rx No:'}
                      onChange={(val) => updateLabel('rxNoLabel', val)}
                      disabled={!isDirectEditEnabled}
                    />
                  </span>
                  <span className="font-bold text-slate-900">
                    <EditableText
                      value={data.rxNumber}
                      onChange={(val) => onChange && onChange(prev => ({ ...prev, rxNumber: val }))}
                      disabled={!isDirectEditEnabled}
                    />
                  </span>
                </div>

                {/* Optional Vitals */}
                {(patient.bloodPressure || patient.pulse || patient.temperature) && (
                  <div className="col-span-12 pt-1 border-t border-slate-200/60 flex items-center gap-4 text-[10.5px] text-slate-600">
                    {patient.bloodPressure && (
                      <div>
                        <strong className="text-slate-700">BP:</strong>{' '}
                        <EditableText
                          value={patient.bloodPressure}
                          onChange={(val) => updatePatient('bloodPressure', val)}
                          disabled={!isDirectEditEnabled}
                        />
                      </div>
                    )}
                    {patient.pulse && (
                      <div>
                        <strong className="text-slate-700">Pulse:</strong>{' '}
                        <EditableText
                          value={patient.pulse}
                          onChange={(val) => updatePatient('pulse', val)}
                          disabled={!isDirectEditEnabled}
                        />
                      </div>
                    )}
                    {patient.temperature && (
                      <div>
                        <strong className="text-slate-700">Temp:</strong>{' '}
                        <EditableText
                          value={patient.temperature}
                          onChange={(val) => updatePatient('temperature', val)}
                          disabled={!isDirectEditEnabled}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 💊 MAIN BODY WORKSPACE (Clinical Findings + Rx Medicines) */}
            <div className="flex-1 flex gap-4 min-h-[170mm]">
              {/* LEFT COLUMN: Clinical Notes, Diagnosis, Investigations (30% width) */}
              <div className={`w-[30%] pr-3.5 space-y-4 text-xs ${
                theme === 'dual_tint' 
                  ? 'bg-slate-50/70 p-3 rounded-lg border border-slate-200' 
                  : 'border-r border-slate-200/90'
              }`}>
                {/* Chief Complaint */}
                {(clinical.chiefComplaint || isDirectEditEnabled) && (
                  <div>
                    <h4 
                      className="text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"
                      style={{ color: primaryColor }}
                    >
                      <EditableText
                        value={labels?.ccLabel || 'C/C (Chief Complaint)'}
                        onChange={(val) => updateLabel('ccLabel', val)}
                        disabled={!isDirectEditEnabled}
                      />
                    </h4>
                    <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-line pl-1 border-l-2 border-slate-300">
                      <EditableText
                        multiline
                        value={clinical.chiefComplaint}
                        onChange={(val) => updateClinical('chiefComplaint', val)}
                        placeholder="Click to type complaints..."
                        disabled={!isDirectEditEnabled}
                      />
                    </p>
                  </div>
                )}

                {/* Diagnosis */}
                {(clinical.diagnosis || isDirectEditEnabled) && (
                  <div>
                    <h4 
                      className="text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"
                      style={{ color: primaryColor }}
                    >
                      <EditableText
                        value={labels?.dxLabel || 'D/X (Diagnosis)'}
                        onChange={(val) => updateLabel('dxLabel', val)}
                        disabled={!isDirectEditEnabled}
                      />
                    </h4>
                    <p className="text-[11px] font-bold text-slate-800 leading-snug pl-1 border-l-2 border-slate-300">
                      <EditableText
                        multiline
                        value={clinical.diagnosis}
                        onChange={(val) => updateClinical('diagnosis', val)}
                        placeholder="Click to type diagnosis..."
                        disabled={!isDirectEditEnabled}
                      />
                    </p>
                  </div>
                )}

                {/* Investigations */}
                {( (clinical.selectedTests && clinical.selectedTests.length > 0) || clinical.investigation || isDirectEditEnabled ) && (
                  <div>
                    <h4 
                      className="text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"
                      style={{ color: primaryColor }}
                    >
                      <EditableText
                        value={labels?.invLabel || 'Inv (Investigations)'}
                        onChange={(val) => updateLabel('invLabel', val)}
                        disabled={!isDirectEditEnabled}
                      />
                    </h4>
                    <ul className="text-[11px] text-slate-700 space-y-1 pl-2">
                      {clinical.selectedTests?.map((test, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-1 leading-tight">
                          <span className="text-slate-400 font-bold">▫</span>
                          <span>{test}</span>
                        </li>
                      ))}
                      <li className="flex items-start gap-1 leading-tight mt-1 text-slate-800 font-medium">
                        <span className="text-slate-400 font-bold">▫</span>
                        <EditableText
                          value={clinical.investigation}
                          onChange={(val) => updateClinical('investigation', val)}
                          placeholder="Type other tests..."
                          disabled={!isDirectEditEnabled}
                        />
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: The Rx Symbol & Medicine List (70% width) */}
              <div className="w-[70%] pl-2 flex flex-col justify-between">
                <div>
                  {/* Traditional Rx Symbol */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <span 
                      className="text-2xl sm:text-3xl font-serif font-black italic select-none"
                      style={{ color: primaryColor }}
                    >
                      <EditableText
                        value={labels?.rxSymbol || '℞'}
                        onChange={(val) => updateLabel('rxSymbol', val)}
                        disabled={!isDirectEditEnabled}
                      />
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <EditableText
                        value={labels?.medicineSectionLabel || 'Prescribed Medicines'}
                        onChange={(val) => updateLabel('medicineSectionLabel', val)}
                        disabled={!isDirectEditEnabled}
                      />
                    </span>
                  </div>

                  {/* Medicines List */}
                  <div className="space-y-3.5">
                    {medicines.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
                        {language === 'bn' ? 'কোনো ঔষধ যোগ করা হয়নি।' : 'No medicines added yet.'}
                      </div>
                    ) : (
                      medicines.map((med, idx) => (
                        <div 
                          key={med.id || idx} 
                          className={`avoid-break text-xs pb-1 ${
                            theme === 'modern_banner'
                              ? 'p-2 rounded-lg bg-slate-50/70 border-l-2'
                              : theme === 'dual_tint'
                              ? 'p-2 rounded-lg border border-slate-200/80 bg-white shadow-2xs'
                              : ''
                          }`}
                          style={{
                            borderLeftColor: theme === 'modern_banner' ? primaryColor : undefined
                          }}
                        >
                          {/* Medicine Name Line */}
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-slate-900 text-xs w-4 shrink-0 font-mono">
                              {idx + 1}.
                            </span>
                            <span className="text-[10.5px] uppercase font-semibold text-slate-500 shrink-0">
                              <EditableText
                                value={med.form}
                                onChange={(val) => updateMedicineItem(idx, { form: val as any })}
                                disabled={!isDirectEditEnabled}
                              />
                            </span>
                            <span className="text-sm font-bold text-slate-900">
                              <EditableText
                                value={med.name}
                                onChange={(val) => updateMedicineItem(idx, { name: val })}
                                placeholder="Medicine Name"
                                disabled={!isDirectEditEnabled}
                              />
                            </span>
                            <span className="text-xs font-semibold text-slate-700 font-mono">
                              <EditableText
                                value={med.strength}
                                onChange={(val) => updateMedicineItem(idx, { strength: val })}
                                placeholder="Strength"
                                disabled={!isDirectEditEnabled}
                              />
                            </span>
                          </div>

                          {/* Dosage, Timing & Duration Line */}
                          <div className="pl-6 pt-1 text-xs text-slate-800 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                            <span 
                              className={`font-mono font-bold text-[11px] px-1.5 py-0.5 rounded ${
                                theme === 'dual_tint'
                                  ? 'text-white'
                                  : 'text-slate-900 bg-slate-100'
                              }`}
                              style={{
                                backgroundColor: theme === 'dual_tint' ? primaryColor : undefined
                              }}
                            >
                              <EditableText
                                value={med.frequencyPattern || med.frequencySemantic}
                                onChange={(val) => updateMedicineItem(idx, { frequencyPattern: val })}
                                placeholder="1+0+1"
                                disabled={!isDirectEditEnabled}
                                className={theme === 'dual_tint' ? 'text-white' : undefined}
                              />
                            </span>

                            <span className="text-slate-400">—</span>

                            <span className="font-medium text-slate-700">
                              <EditableText
                                value={med.timing}
                                onChange={(val) => updateMedicineItem(idx, { timing: val as any })}
                                placeholder="Food Timing"
                                disabled={!isDirectEditEnabled}
                              />
                            </span>

                            <span className="text-slate-400">—</span>

                            <span className="font-semibold text-slate-900">
                              <EditableText
                                value={med.durationUnit === 'Continue' 
                                  ? 'Continue' 
                                  : med.durationUnit === 'Until finished'
                                  ? 'Until finished'
                                  : `${med.durationValue} ${med.durationUnit}`}
                                onChange={(val) => {
                                  const parts = val.split(' ');
                                  if (parts.length > 1) {
                                    updateMedicineItem(idx, { durationValue: parts[0], durationUnit: parts[1] as any });
                                  } else {
                                    updateMedicineItem(idx, { durationValue: val });
                                  }
                                }}
                                placeholder="Duration"
                                disabled={!isDirectEditEnabled}
                              />
                            </span>
                          </div>

                          {/* Doctor Specific Instruction */}
                          <div className="pl-6 pt-0.5 text-[11px] text-slate-600 italic">
                            <EditableText
                              value={med.instruction}
                              onChange={(val) => updateMedicineItem(idx, { instruction: val })}
                              placeholder="Doctor instruction..."
                              disabled={!isDirectEditEnabled}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* ADVICE & FOLLOW-UP SECTION */}
                <div className="pt-4 mt-6 border-t border-slate-200/90 space-y-2.5">
                  <div className="avoid-break">
                    <h4 
                      className="text-[11px] font-bold uppercase tracking-wider mb-1"
                      style={{ color: primaryColor }}
                    >
                      <EditableText
                        value={labels?.adviceLabel || 'Advice / উপদেশ:'}
                        onChange={(val) => updateLabel('adviceLabel', val)}
                        disabled={!isDirectEditEnabled}
                      />
                    </h4>
                    <ul className="text-xs text-slate-800 space-y-1 pl-2">
                      {adviceList.map((adv, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-1.5 leading-snug">
                          <span style={{ color: primaryColor }} className="font-bold shrink-0">✓</span>
                          <span>{adv}</span>
                        </li>
                      ))}
                      <li className="flex items-start gap-1.5 leading-snug text-slate-800 font-medium">
                        <span style={{ color: primaryColor }} className="font-bold shrink-0">✓</span>
                        <EditableText
                          multiline
                          value={adviceText}
                          onChange={(val) => onChange && onChange(prev => ({ ...prev, adviceText: val }))}
                          placeholder="Type or edit clinical advice here..."
                          disabled={!isDirectEditEnabled}
                        />
                      </li>
                    </ul>
                  </div>

                  {/* Follow-up */}
                  <div className="avoid-break text-xs pt-1">
                    <span className="font-bold text-slate-700 uppercase text-[10.5px] tracking-wide mr-1.5">
                      <EditableText
                        value={labels?.followUpLabel || 'Follow Up:'}
                        onChange={(val) => updateLabel('followUpLabel', val)}
                        disabled={!isDirectEditEnabled}
                      />
                    </span>
                    <span className="font-bold text-slate-900">
                      <EditableText
                        value={followUp.customText || `After ${followUp.value} ${followUp.type}`}
                        onChange={(val) => onChange && onChange(prev => ({
                          ...prev,
                          followUp: { ...prev.followUp, customText: val }
                        }))}
                        placeholder="Click to edit follow-up..."
                        disabled={!isDirectEditEnabled}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ✍️ BOTTOM FOOTER & SIGNATURE AREA */}
            <footer className="pt-4 mt-4 border-t border-slate-200 avoid-break">
              <div className="flex items-end justify-between">
                {/* Notice text */}
                <div className="text-[10px] text-slate-400 space-y-0.5">
                  <p>
                    •{' '}
                    <EditableText
                      value={labels?.footerNote1 || 'This prescription is digitally generated.'}
                      onChange={(val) => updateLabel('footerNote1', val)}
                      disabled={!isDirectEditEnabled}
                    />
                  </p>
                  <p>
                    •{' '}
                    <EditableText
                      value={labels?.footerNote2 || 'In case of emergency, contact the nearest hospital immediately.'}
                      onChange={(val) => updateLabel('footerNote2', val)}
                      disabled={!isDirectEditEnabled}
                    />
                  </p>
                </div>

                {/* Doctor Signature & Verification Seal Box */}
                <div className={`text-right flex flex-col items-end min-w-[200px] ${
                  theme === 'hospital_pad' ? 'border border-slate-300 p-2 rounded bg-slate-50/40' : ''
                }`}>
                  {doctor.showSignature && doctor.signatureUrl ? (
                    <div className="h-14 mb-1 flex items-end justify-end">
                      <img
                        src={doctor.signatureUrl}
                        alt="Doctor Signature"
                        className="max-h-12 max-w-[160px] object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-10 border-b border-slate-400 w-36 mb-1" />
                  )}

                  <div className="pt-0.5 border-t border-slate-300 w-full text-right">
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      <EditableText
                        value={doctor.doctorName}
                        onChange={(val) => updateDoctor('doctorName', val)}
                        disabled={!isDirectEditEnabled}
                      />
                    </p>
                    <p className="text-[10px] text-slate-600 font-medium leading-tight">
                      <EditableText
                        value={doctor.degree}
                        onChange={(val) => updateDoctor('degree', val)}
                        disabled={!isDirectEditEnabled}
                      />
                    </p>
                    <p className="text-[9.5px] text-slate-500 font-mono leading-tight">
                      <EditableText
                        value={doctor.registrationNumber}
                        onChange={(val) => updateDoctor('registrationNumber', val)}
                        disabled={!isDirectEditEnabled}
                      />
                    </p>
                    {theme === 'hospital_pad' && (
                      <p className="text-[8.5px] font-bold text-emerald-800 uppercase tracking-widest mt-0.5">
                        Verified Practitioner
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};
