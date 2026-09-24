import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Trash2, 
  PenTool, 
  Building, 
  User, 
  FileBadge, 
  Phone, 
  MapPin, 
  Clock, 
  Check, 
  Sparkles,
  Palette
} from 'lucide-react';
import { DoctorProfile, PrescriptionTheme } from '../types/prescription';

interface DoctorSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: DoctorProfile;
  onSaveProfile: (profile: DoctorProfile) => void;
  currentTheme: PrescriptionTheme;
  onChangeTheme: (theme: PrescriptionTheme) => void;
  currentColor: string;
  onChangeColor: (color: string) => void;
  language: 'en' | 'bn';
}

const THEME_OPTIONS: { id: PrescriptionTheme; name: string; nameBn: string; desc: string }[] = [
  { id: 'classic', name: 'Classic Clinical', nameBn: '১. ক্লাসিক ক্লিনিক্যাল (সাদা ব্যাকগ্রাউন্ড)', desc: 'Traditional two-column layout with left clinical findings, clean divider, and right Rx medicines.' },
  { id: 'modern_banner', name: 'Modern Executive Banner', nameBn: '২. মডার্ন এক্সিকিউটিভ (রঙিন হেডার ব্যানার)', desc: 'Full-width rich colored header bar, crisp white typography, modern patient cards, colored medicine table.' },
  { id: 'minimal', name: 'Minimalist Clean', nameBn: '৩. মিনিমালিস্ট এলিগ্যান্ট (পরিচ্ছন্ন ও মার্জিত)', desc: 'High typographic hierarchy, refined hairline borders, serene spacing, clean underlined patient row.' },
  { id: 'hospital_pad', name: 'Hospital Formal Pad', nameBn: '৪. হসপিটাল ফর্মাল প্যাড (অফিসিয়াল লেটারহেড)', desc: 'Official medical center style with vertical accent stripe, structured patient vitals grid, formal stamp seal.' },
  { id: 'framed_royal', name: 'Framed Royal Border', nameBn: '৫. রয়্যাল ফ্রেমড (নিরাপত্তা ডাবল বর্ডার)', desc: 'Prestigious double-framed margin, centered clinic emblem, regal clinical header, watermark background.' },
  { id: 'dual_tint', name: 'Dual-Tone Healthcare', nameBn: '৬. কর্পোরেট হেলথকেয়ার (ডুয়াল টোন প্যানেল)', desc: 'Soft pastel tinted panels for patient and clinical findings, highlighted frequency chips, high readability.' }
];

const COLOR_PRESETS = [
  { name: 'Teal Medical', hex: '#0f766e' },
  { name: 'Ocean Navy', hex: '#1e3a8a' },
  { name: 'Slate Gray', hex: '#334155' },
  { name: 'Emerald Green', hex: '#047857' },
  { name: 'Deep Crimson', hex: '#991b1b' },
  { name: 'Royal Indigo', hex: '#4338ca' }
];

export const DoctorSettingsModal: React.FC<DoctorSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  currentTheme,
  onChangeTheme,
  currentColor,
  onChangeColor,
  language
}) => {
  const [formData, setFormData] = useState<DoctorProfile>(profile);
  const [activeTab, setActiveTab] = useState<'doctor' | 'clinic' | 'branding' | 'theme'>('doctor');
  const [isDrawingSignature, setIsDrawingSignature] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPaintingRef = useRef(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof DoctorProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size exceeds 2MB limit. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (typeof uploadEvent.target?.result === 'string') {
          handleChange('logoUrl', uploadEvent.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size exceeds 2MB limit. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (typeof uploadEvent.target?.result === 'string') {
          handleChange('signatureUrl', uploadEvent.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Canvas signature drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isPaintingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isPaintingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isPaintingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveCanvasSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    handleChange('signatureUrl', dataUrl);
    setIsDrawingSignature(false);
  };

  const handleSave = () => {
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {language === 'bn' ? 'ডাক্তার ও চেম্বার সেটিংস' : 'Doctor & Clinic Settings'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'bn' 
                ? 'একবার সেট করলে প্রতিটি প্রেসক্রিপশনে স্বয়ংক্রিয়ভাবে সংযুক্ত হবে।' 
                : 'Configure once, automatically populates every new prescription.'}
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 gap-6 text-xs font-semibold bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('doctor')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'doctor'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'ডাক্তার পরিচিতি' : 'Doctor Info'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('clinic')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'clinic'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'চেম্বার ও ক্লিনিক' : 'Clinic Details'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('branding')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'branding'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'লোগো ও স্বাক্ষর' : 'Logo & Signature'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('theme')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'theme'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'থিম ও কালার' : 'Theme & Style'}</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          {/* TAB 1: DOCTOR INFO */}
          {activeTab === 'doctor' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'ডাক্তারের পুরো নাম *' : 'Doctor Full Name *'}
                </label>
                <input
                  type="text"
                  value={formData.doctorName}
                  onChange={(e) => handleChange('doctorName', e.target.value)}
                  placeholder="e.g. Dr. Md. Rahman"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'ডিগ্রি ও শিক্ষাগত যোগ্যতা *' : 'Qualifications & Degrees *'}
                </label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => handleChange('degree', e.target.value)}
                  placeholder="e.g. MBBS, FCPS (Medicine), MD"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'bn' ? 'বিশেষজ্ঞতা (Specialty)' : 'Specialty'}
                  </label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => handleChange('specialty', e.target.value)}
                    placeholder="e.g. Medicine Specialist"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'bn' ? 'রেজিস্ট্রেশন নম্বর (Reg. No) *' : 'Medical Registration No. *'}
                  </label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => handleChange('registrationNumber', e.target.value)}
                    placeholder="e.g. BMDC Reg. No: A-48291"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'ব্যক্তিগত ফোন বা ইমেইল' : 'Doctor Phone / Contact'}
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="e.g. +880 1712-345678"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* TAB 2: CLINIC DETAILS */}
          {activeTab === 'clinic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'হাসপাতাল / ক্লিনিক / চেম্বারের নাম *' : 'Hospital / Clinic / Chamber Name *'}
                </label>
                <input
                  type="text"
                  value={formData.clinicName}
                  onChange={(e) => handleChange('clinicName', e.target.value)}
                  placeholder="e.g. ABC MEDICAL CENTER"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'ক্লিনিক ট্যাগলাইন (ঐচ্ছিক)' : 'Clinic Tagline / Subtitle'}
                </label>
                <input
                  type="text"
                  value={formData.clinicTagline}
                  onChange={(e) => handleChange('clinicTagline', e.target.value)}
                  placeholder="e.g. Advanced Multi-Specialty Healthcare Services"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'চেম্বার ও ক্লিনিকের ঠিকানা *' : 'Chamber & Clinic Address *'}
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="e.g. Suite 402, Green Road Medical Tower, Dhanmondi, Dhaka"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'bn' ? 'রোগী দেখার সময়সূচী' : 'Consultation / Visiting Hours'}
                  </label>
                  <input
                    type="text"
                    value={formData.visitingHours}
                    onChange={(e) => handleChange('visitingHours', e.target.value)}
                    placeholder="e.g. 5:00 PM – 9:30 PM (Friday Closed)"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {language === 'bn' ? 'সিরিয়াল ও যোগাযোগ নম্বর' : 'Appointment / Hotline Phone'}
                  </label>
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="e.g. Hotline: 01819-876543 / dr.med@gmail.com"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BRANDING (LOGO & SIGNATURE) */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              {/* Logo Section */}
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      {language === 'bn' ? 'ক্লিনিক লোগো (Clinic Logo)' : 'Clinic Logo'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {language === 'bn' ? 'প্রেসক্রিপশনের শীর্ষে প্রদর্শিত হবে।' : 'Displayed at the top header of the prescription.'}
                    </p>
                  </div>
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showLogo}
                      onChange={(e) => handleChange('showLogo', e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>{language === 'bn' ? 'প্রদর্শন করুন' : 'Show Logo'}</span>
                  </label>
                </div>

                <div className="flex items-center gap-4">
                  {formData.logoUrl ? (
                    <div className="relative w-20 h-20 rounded-lg border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden">
                      <img
                        src={formData.logoUrl}
                        alt="Clinic Logo"
                        className="max-h-full max-w-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => handleChange('logoUrl', '')}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md shadow-xs hover:bg-red-700"
                        title="Remove Logo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 bg-white">
                      <Building className="w-6 h-6 stroke-1" />
                      <span className="text-[10px] mt-1">No Logo</span>
                    </div>
                  )}

                  <div className="flex-1">
                    <label className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'লোগো ফাইল আপলোড' : 'Upload Logo File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, SVG up to 2MB</p>
                  </div>
                </div>
              </div>

              {/* Signature Section */}
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      {language === 'bn' ? 'ডাক্তারের স্বাক্ষর (Doctor Signature)' : 'Doctor Signature'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {language === 'bn' ? 'প্রেসক্রিপশনের নিচে স্বয়ংক্রিয়ভাবে সিল ও স্বাক্ষর বসবে।' : 'Appears automatically above doctor name seal.'}
                    </p>
                  </div>
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showSignature}
                      onChange={(e) => handleChange('showSignature', e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>{language === 'bn' ? 'প্রদর্শন করুন' : 'Show Signature'}</span>
                  </label>
                </div>

                {isDrawingSignature ? (
                  <div className="space-y-2">
                    <div className="border border-slate-300 rounded-lg bg-white overflow-hidden">
                      <canvas
                        ref={canvasRef}
                        width={400}
                        height={120}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-28 cursor-crosshair bg-slate-50/40"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md"
                      >
                        {language === 'bn' ? 'মুছে ফেলুন' : 'Clear Canvas'}
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsDrawingSignature(false)}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900"
                        >
                          {language === 'bn' ? 'বাতিল' : 'Cancel'}
                        </button>
                        <button
                          type="button"
                          onClick={saveCanvasSignature}
                          className="px-3 py-1 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md"
                        >
                          {language === 'bn' ? 'স্বাক্ষর সংরক্ষণ' : 'Save Drawing'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    {formData.signatureUrl ? (
                      <div className="relative w-36 h-20 rounded-lg border border-slate-200 bg-white p-2 flex items-center justify-center overflow-hidden">
                        <img
                          src={formData.signatureUrl}
                          alt="Doctor Signature"
                          className="max-h-full max-w-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => handleChange('signatureUrl', '')}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md shadow-xs hover:bg-red-700"
                          title="Remove Signature"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-36 h-20 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 bg-white">
                        <PenTool className="w-5 h-5 stroke-1" />
                        <span className="text-[10px] mt-1">No Signature</span>
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors shadow-xs">
                          <Upload className="w-3 h-3" />
                          <span>{language === 'bn' ? 'ছবি আপলোড' : 'Upload Image'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleSignatureUpload}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsDrawingSignature(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
                        >
                          <PenTool className="w-3 h-3 text-teal-700" />
                          <span>{language === 'bn' ? 'প্যাডে আঁকুন' : 'Draw Live'}</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {language === 'bn' ? 'স্বাক্ষরের স্পষ্ট ছবি অথবা সরাসরি স্ক্রিনে আঁকুন' : 'Upload signature image or draw directly'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: THEME & COLOR */}
          {activeTab === 'theme' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  {language === 'bn' ? 'প্রেসক্রিপশন থিম নির্বাচন (Layout Theme)' : 'Prescription Theme Style'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {THEME_OPTIONS.map((theme) => {
                    const isSelected = currentTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => onChangeTheme(theme.id)}
                        className={`p-3 text-left rounded-xl border transition-all ${
                          isSelected
                            ? 'border-teal-700 bg-teal-50/50 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900">
                            {language === 'bn' ? theme.nameBn : theme.name}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-teal-700" />}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{theme.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  {language === 'bn' ? 'প্রধান রং (Primary Brand Color)' : 'Primary Accent Color'}
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  {COLOR_PRESETS.map((c) => {
                    const isSelected = currentColor.toLowerCase() === c.hex.toLowerCase();
                    return (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => onChangeColor(c.hex)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-slate-900 bg-slate-100 shadow-xs ring-1 ring-slate-900'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="text-slate-800">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            {language === 'bn' ? 'বাতিল' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{language === 'bn' ? 'সেভ করুন' : 'Save & Apply'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
