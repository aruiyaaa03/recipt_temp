import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  RefreshCw, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Activity, 
  Stethoscope, 
  Pill, 
  FileText, 
  Calendar, 
  Building,
  User,
  Sliders,
  Check,
  Tag,
  Upload,
  Sparkles
} from 'lucide-react';
import { 
  PrescriptionData, 
  MedicineItem, 
  MedicineForm, 
  FoodTiming, 
  DurationUnit,
  Gender,
  AgeUnit 
} from '../types/prescription';
import { 
  COMMON_MEDICINES, 
  COMMON_INVESTIGATIONS, 
  COMMON_ADVICES,
  TIMING_TRANSLATIONS,
  FREQUENCY_TRANSLATIONS 
} from '../data/medicineCatalog';
import { generateRxNumber, buildAutoInstruction, saveDoctorProfile } from '../utils/prescriptionUtils';

interface PrescriptionEditorProps {
  data: PrescriptionData;
  onChange: (updater: (prev: PrescriptionData) => PrescriptionData) => void;
  language: 'en' | 'bn';
}

const COMMON_STRENGTHS = ['500 mg', '650 mg', '250 mg', '100 mg', '50 mg', '20 mg', '10 mg', '5 mg', '1 gm', '200 mg', '400 mg', '120 mg', '250 mg/5ml', '100 mcg'];
const COMMON_FORMS: MedicineForm[] = ['Tablet', 'Capsule', 'Syrup', 'Suspension', 'Injection', 'Drop', 'Eye Drops', 'Inhaler', 'Ointment', 'Cream', 'Powder/Sachet', 'Suppository'];
const SHORTHAND_DOSES = ['1+0+1', '1+1+1', '0+0+1', '1+0+0', '0+1+0', '1+1+1+1', '1/2+0+1/2', '1+0+0+1'];
const SEMANTIC_FREQUENCIES = [
  'Once Daily',
  'Twice Daily',
  'Three Times Daily',
  'Four Times Daily',
  'Every 4 Hours',
  'Every 6 Hours',
  'Every 8 Hours',
  'Every 12 Hours',
  'As Needed',
  'At Bedtime',
  'Custom'
];
const FOOD_TIMINGS: FoodTiming[] = [
  'After Food',
  'Before Food',
  'With Food',
  'Empty Stomach',
  'Before Bed',
  'Anytime',
  'As Needed'
];
const DURATION_UNITS: DurationUnit[] = ['Days', 'Weeks', 'Months', 'Until finished', 'Continue', 'Custom'];

export const PrescriptionEditor: React.FC<PrescriptionEditorProps> = ({
  data,
  onChange,
  language
}) => {
  const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showVitals, setShowVitals] = useState<boolean>(false);
  const [showClinicDoctorHeader, setShowClinicDoctorHeader] = useState<boolean>(true);
  const [showCustomLabels, setShowCustomLabels] = useState<boolean>(false);
  const [showClinicalNotes, setShowClinicalNotes] = useState<boolean>(true);

  // Helper to update doctor profile & save to storage
  const updateDoctor = (field: keyof typeof data.doctor, value: any) => {
    onChange(prev => {
      const updatedDoctor = { ...prev.doctor, [field]: value };
      saveDoctorProfile(updatedDoctor);
      return {
        ...prev,
        doctor: updatedDoctor
      };
    });
  };

  // Helper to update custom labels
  const updateLabel = (field: keyof typeof data.labels, value: string) => {
    onChange(prev => ({
      ...prev,
      labels: {
        ...(prev.labels || {}),
        [field]: value
      }
    }));
  };

  // Helper to update patient
  const updatePatient = (field: keyof typeof data.patient, value: any) => {
    onChange(prev => ({
      ...prev,
      patient: { ...prev.patient, [field]: value }
    }));
  };

  // Helper to update clinical info
  const updateClinical = (field: keyof typeof data.clinical, value: any) => {
    onChange(prev => ({
      ...prev,
      clinical: { ...prev.clinical, [field]: value }
    }));
  };

  // Update specific medicine
  const updateMedicine = (index: number, updates: Partial<MedicineItem>, regenerateInstruction = true) => {
    onChange(prev => {
      const updatedMeds = [...prev.medicines];
      const current = updatedMeds[index];
      const merged = { ...current, ...updates };

      if (regenerateInstruction && !('instruction' in updates)) {
        merged.instruction = buildAutoInstruction(merged, prev.language);
      }

      updatedMeds[index] = merged;
      return { ...prev, medicines: updatedMeds };
    });
  };

  const addMedicine = () => {
    const newMed: MedicineItem = {
      id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: '',
      strength: '500 mg',
      form: 'Tablet',
      doseQuantity: '1',
      doseUnit: 'Tablet',
      frequencyPattern: '1+0+1',
      frequencySemantic: 'Twice Daily',
      timeOfDay: { morning: true, noon: false, afternoon: false, evening: false, night: true },
      timing: 'After Food',
      durationValue: '5',
      durationUnit: 'Days',
      instruction: language === 'bn' ? '১টি ট্যাবলেট দিনে ২ বার খাবারের পর ৫ দিন খাবেন।' : 'Take 1 tablet twice daily after food for 5 days.'
    };

    onChange(prev => ({
      ...prev,
      medicines: [...prev.medicines, newMed]
    }));
  };

  const duplicateMedicine = (index: number) => {
    onChange(prev => {
      const target = prev.medicines[index];
      const cloned: MedicineItem = {
        ...target,
        id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
      };
      const copy = [...prev.medicines];
      copy.splice(index + 1, 0, cloned);
      return { ...prev, medicines: copy };
    });
  };

  const removeMedicine = (index: number) => {
    onChange(prev => {
      const copy = prev.medicines.filter((_, i) => i !== index);
      return { ...prev, medicines: copy };
    });
  };

  const handleSelectMedicineSuggestion = (index: number, suggestion: typeof COMMON_MEDICINES[0]) => {
    const isShorthand = suggestion.commonDosePattern.includes('+');
    const updates: Partial<MedicineItem> = {
      name: suggestion.name,
      strength: suggestion.strength,
      form: suggestion.form,
      timing: suggestion.commonTiming,
      durationValue: suggestion.defaultDuration,
      durationUnit: 'Days'
    };

    if (isShorthand) {
      updates.frequencyPattern = suggestion.commonDosePattern;
    } else {
      updates.frequencyPattern = '';
      updates.frequencySemantic = suggestion.commonDosePattern;
    }

    updateMedicine(index, updates, true);
    setActiveSearchIndex(null);
    setSearchQuery('');
  };

  const toggleInvestigationTest = (test: string) => {
    onChange(prev => {
      const current = prev.clinical.selectedTests || [];
      const exists = current.includes(test);
      const nextTests = exists ? current.filter(t => t !== test) : [...current, test];
      return {
        ...prev,
        clinical: {
          ...prev.clinical,
          selectedTests: nextTests
        }
      };
    });
  };

  const toggleAdviceChip = (adviceText: string) => {
    onChange(prev => {
      const current = prev.adviceList || [];
      const exists = current.includes(adviceText);
      const nextAdvice = exists ? current.filter(a => a !== adviceText) : [...current, adviceText];
      return {
        ...prev,
        adviceList: nextAdvice
      };
    });
  };

  const regenerateRxNum = () => {
    onChange(prev => ({
      ...prev,
      rxNumber: generateRxNumber()
    }));
  };

  return (
    <div className="space-y-5 pb-24">
      {/* 🏥 SECTION 0: DOCTOR & CLINIC HEADER (Fully In-Place Editable) */}
      <section className="bg-white rounded-xl border border-teal-200/80 p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-teal-700" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {language === 'bn' ? 'ক্লিনিক ও ডাক্তার তথ্য (Header Editor)' : 'Clinic & Doctor Info (Header)'}
            </h3>
            <span className="text-[10px] bg-teal-50 text-teal-700 font-semibold px-2 py-0.5 rounded-full border border-teal-200">
              {language === 'bn' ? 'সম্পূর্ণ এডিটেবল' : 'Fully Editable'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowClinicDoctorHeader(!showClinicDoctorHeader)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            title="Toggle clinic details"
          >
            {showClinicDoctorHeader ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showClinicDoctorHeader && (
          <div className="space-y-4 pt-3">
            {/* 📷 CLINIC LOGO UPLOAD SYSTEM */}
            <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-200/70 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                {data.doctor.logoUrl ? (
                  <div className="relative w-16 h-16 rounded-lg bg-white border border-teal-300 p-1 flex items-center justify-center overflow-hidden shadow-xs">
                    <img
                      src={data.doctor.logoUrl}
                      alt="Uploaded Logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg border-2 border-dashed border-teal-300 bg-white flex flex-col items-center justify-center text-teal-600">
                    <Building className="w-5 h-5" />
                    <span className="text-[9px] mt-0.5 font-bold">No Logo</span>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {language === 'bn' ? 'ক্লিনিকের লোগো (Clinic Logo)' : 'Clinic Logo Upload'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {language === 'bn' ? 'প্রেসক্রিপশন হেডারে আপনার ক্লিনিকের লোগো প্রদর্শিত হবে।' : 'Upload custom clinic or hospital brand logo (PNG, JPG, SVG).'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{data.doctor.logoUrl ? (language === 'bn' ? 'লোগো পরিবর্তন' : 'Change Logo') : (language === 'bn' ? 'লোগো আপলোড' : 'Upload Logo')}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          if (typeof evt.target?.result === 'string') {
                            updateDoctor('logoUrl', evt.target.result);
                            updateDoctor('showLogo', true);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>

                {data.doctor.logoUrl && (
                  <button
                    type="button"
                    onClick={() => updateDoctor('logoUrl', '')}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                    title="Remove Logo / লোগো মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* 🎨 6 THEMES QUICK SELECTOR */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                  <span>{language === 'bn' ? 'প্রেসক্রিপশন টেমপ্লেট থিম নির্বাচন (Themes)' : 'Prescription Theme Style'}</span>
                </label>
                <span className="text-[10px] text-slate-500 font-medium">৬টি প্রফেশনাল ডিজাইন</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'classic', name: '১. ক্লাসিক সাদা', color: '#0f766e' },
                  { id: 'modern_banner', name: '২. মডার্ন ব্যানার', color: '#1e3a8a' },
                  { id: 'minimal', name: '৩. মিনিমালিস্ট', color: '#334155' },
                  { id: 'hospital_pad', name: '৪. হসপিটাল প্যাড', color: '#047857' },
                  { id: 'framed_royal', name: '৫. রয়্যাল ফ্রেমড', color: '#831843' },
                  { id: 'dual_tint', name: '৬. ডুয়াল টোন', color: '#0284c7' }
                ].map((th) => {
                  const isCurrent = data.theme === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => onChange(prev => ({ ...prev, theme: th.id as any, primaryColor: th.color }))}
                      className={`px-2.5 py-1.5 rounded-lg border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                        isCurrent
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate">{th.name}</span>
                      <span className="w-2 h-2 rounded-full shrink-0 ml-1" style={{ backgroundColor: th.color }} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clinic Name & Tagline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'ক্লিনিক / হাসপাতালের নাম' : 'Hospital / Clinic Name'}
                </label>
                <input
                  type="text"
                  value={data.doctor.clinicName}
                  onChange={(e) => updateDoctor('clinicName', e.target.value)}
                  placeholder="e.g. ABC MEDICAL CENTER"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 font-bold text-teal-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'ট্যাগলাইন / উপশিরোনাম' : 'Clinic Tagline / Subtitle'}
                </label>
                <input
                  type="text"
                  value={data.doctor.clinicTagline}
                  onChange={(e) => updateDoctor('clinicTagline', e.target.value)}
                  placeholder="e.g. Advanced Multi-Specialty Healthcare Services"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            {/* Address, Gmail / Email, Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'চেম্বার / ক্লিনিকের ঠিকানা' : 'Clinic Address'}
                </label>
                <input
                  type="text"
                  value={data.doctor.address}
                  onChange={(e) => updateDoctor('address', e.target.value)}
                  placeholder="e.g. Green Road, Dhanmondi, Dhaka"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'জিমেইল / ইমেইল অ্যাড্রেস' : 'Gmail / Email Address'}
                </label>
                <input
                  type="text"
                  value={data.doctor.email}
                  onChange={(e) => updateDoctor('email', e.target.value)}
                  placeholder="e.g. dr.rahman.med@gmail.com"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'ফোন / সিরিয়াল নম্বর' : 'Phone / Hotline'}
                </label>
                <input
                  type="text"
                  value={data.doctor.phone}
                  onChange={(e) => updateDoctor('phone', e.target.value)}
                  placeholder="e.g. +880 1712-345678"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            {/* Doctor Name, Degrees, Specialty, Reg No, Visiting Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'ডাক্তারের পুরো নাম' : 'Doctor Full Name'}
                </label>
                <input
                  type="text"
                  value={data.doctor.doctorName}
                  onChange={(e) => updateDoctor('doctorName', e.target.value)}
                  placeholder="e.g. Dr. Md. Rahman"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'ডিগ্রি ও শিক্ষাগত যোগ্যতা' : 'Qualifications / Degree'}
                </label>
                <input
                  type="text"
                  value={data.doctor.degree}
                  onChange={(e) => updateDoctor('degree', e.target.value)}
                  placeholder="e.g. MBBS, FCPS (Medicine)"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'বিশেষজ্ঞতা (Specialty)' : 'Specialty'}
                </label>
                <input
                  type="text"
                  value={data.doctor.specialty}
                  onChange={(e) => updateDoctor('specialty', e.target.value)}
                  placeholder="e.g. Medicine Specialist"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-teal-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'রেজিস্ট্রেশন নম্বর' : 'BMDC Reg. No.'}
                </label>
                <input
                  type="text"
                  value={data.doctor.registrationNumber}
                  onChange={(e) => updateDoctor('registrationNumber', e.target.value)}
                  placeholder="e.g. BMDC Reg. No: A-48291"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'রোগী দেখার সময় (Visiting Hours)' : 'Visiting / Consultation Hours'}
                </label>
                <input
                  type="text"
                  value={data.doctor.visitingHours}
                  onChange={(e) => updateDoctor('visitingHours', e.target.value)}
                  placeholder="e.g. Daily 5:00 PM – 9:30 PM (Friday Closed)"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 🏷️ SECTION: CUSTOM LABELS & HEADINGS (Full Text Customization) */}
      <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-teal-700" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {language === 'bn' ? 'লেবেল ও হেডিং কাস্টমাইজেশন (Custom Headings)' : 'Custom Labels & Headings'}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowCustomLabels(!showCustomLabels)}
            className="text-[11px] font-medium text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            <span>{showCustomLabels ? (language === 'bn' ? 'সংকোচন' : 'Collapse') : (language === 'bn' ? 'হেডিং পরিবর্তন করুন' : 'Edit Headings')}</span>
            {showCustomLabels ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showCustomLabels && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                {language === 'bn' ? 'উপসর্গ হেডিং (C/C Label)' : 'Chief Complaint (C/C) Heading'}
              </label>
              <input
                type="text"
                value={data.labels?.ccLabel || 'C/C (Chief Complaint)'}
                onChange={(e) => updateLabel('ccLabel', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                {language === 'bn' ? 'রোগ নির্ণয় হেডিং (D/X Label)' : 'Diagnosis (D/X) Heading'}
              </label>
              <input
                type="text"
                value={data.labels?.dxLabel || 'D/X (Diagnosis)'}
                onChange={(e) => updateLabel('dxLabel', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                {language === 'bn' ? 'পরীক্ষা হেডিং (Inv Label)' : 'Investigation (Inv) Heading'}
              </label>
              <input
                type="text"
                value={data.labels?.invLabel || 'Inv (Investigations)'}
                onChange={(e) => updateLabel('invLabel', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                {language === 'bn' ? 'ঔষধ হেডিং (Rx Section Label)' : 'Medicine Section Heading'}
              </label>
              <input
                type="text"
                value={data.labels?.medicineSectionLabel || 'Prescribed Medicines'}
                onChange={(e) => updateLabel('medicineSectionLabel', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                {language === 'bn' ? 'উপদেশ হেডিং (Advice Label)' : 'Advice Section Heading'}
              </label>
              <input
                type="text"
                value={data.labels?.adviceLabel || 'Advice / উপদেশ'}
                onChange={(e) => updateLabel('adviceLabel', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                {language === 'bn' ? 'ফলোআপ হেডিং (Follow-up Label)' : 'Follow-up Section Heading'}
              </label>
              <input
                type="text"
                value={data.labels?.followUpLabel || 'Follow-up / পরবর্তী সাক্ষাত'}
                onChange={(e) => updateLabel('followUpLabel', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                {language === 'bn' ? 'ফুটার নোটিস ১ (Footer Notice)' : 'Footer Notice 1'}
              </label>
              <input
                type="text"
                value={data.labels?.footerNote1 || 'This prescription is digitally generated.'}
                onChange={(e) => updateLabel('footerNote1', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                {language === 'bn' ? 'ফুটার নোটিস ২ (জরুরি যোগাযোগ)' : 'Footer Notice 2 (Emergency)'}
              </label>
              <input
                type="text"
                value={data.labels?.footerNote2 || 'In case of emergency, contact the nearest hospital immediately.'}
                onChange={(e) => updateLabel('footerNote2', e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>
        )}
      </section>

      {/* 🧾 SECTION 1: PRESCRIPTION META (Rx No, Date, Time) */}
      <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                {language === 'bn' ? 'প্রেসক্রিপশন নম্বর (Rx No)' : 'Prescription No.'}
              </label>
              <button
                type="button"
                onClick={regenerateRxNum}
                className="text-[11px] text-teal-700 hover:text-teal-900 flex items-center gap-1 font-medium"
                title="Generate new Rx number"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{language === 'bn' ? 'নতুন কোড' : 'New'}</span>
              </button>
            </div>
            <input
              type="text"
              value={data.rxNumber}
              onChange={(e) => onChange(prev => ({ ...prev, rxNumber: e.target.value }))}
              className="w-full font-mono font-medium text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              {language === 'bn' ? 'তারিখ (Date)' : 'Date'}
            </label>
            <input
              type="text"
              value={data.date}
              onChange={(e) => onChange(prev => ({ ...prev, date: e.target.value }))}
              placeholder="DD/MM/YYYY"
              className="w-full font-mono text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              {language === 'bn' ? 'সময় (Time)' : 'Time'}
            </label>
            <input
              type="text"
              value={data.time}
              onChange={(e) => onChange(prev => ({ ...prev, time: e.target.value }))}
              placeholder="10:30 AM"
              className="w-full font-mono text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
        </div>
      </section>

      {/* 👤 SECTION 2: PATIENT INFORMATION */}
      <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {language === 'bn' ? 'রোগীর প্রয়োজনীয় তথ্য' : 'Patient Information'}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowVitals(!showVitals)}
            className="text-[11px] font-medium text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{showVitals ? (language === 'bn' ? 'ভাইটালস লুকান' : 'Hide Vitals') : (language === 'bn' ? '+ ভাইটালস (BP/Pulse)' : '+ Add Vitals (BP, Pulse)')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Patient Name */}
          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'bn' ? 'রোগীর নাম (Patient Name) *' : 'Patient Name *'}
            </label>
            <input
              type="text"
              value={data.patient.name}
              onChange={(e) => updatePatient('name', e.target.value)}
              placeholder="e.g. Mohammad Rahim"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent font-medium"
            />
          </div>

          {/* Age & Unit */}
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'bn' ? 'বয়স (Age)' : 'Age'}
            </label>
            <div className="flex gap-1.5">
              <input
                type="number"
                min="0"
                max="120"
                value={data.patient.age}
                onChange={(e) => updatePatient('age', e.target.value)}
                placeholder="35"
                className="w-16 px-2.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono"
              />
              <select
                value={data.patient.ageUnit}
                onChange={(e) => updatePatient('ageUnit', e.target.value as AgeUnit)}
                className="flex-1 px-2 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
              >
                <option value="Years">{language === 'bn' ? 'বছর' : 'Years'}</option>
                <option value="Months">{language === 'bn' ? 'মাস' : 'Months'}</option>
                <option value="Days">{language === 'bn' ? 'দিন' : 'Days'}</option>
              </select>
            </div>
          </div>

          {/* Gender */}
          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'bn' ? 'লিঙ্গ (Gender)' : 'Gender'}
            </label>
            <div className="flex items-center gap-2 pt-1">
              {(['Male', 'Female', 'Other'] as Gender[]).map((g) => (
                <label key={g} className="flex items-center gap-1 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={data.patient.gender === g}
                    onChange={() => updatePatient('gender', g)}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  <span>
                    {g === 'Male' ? (language === 'bn' ? 'পুরুষ' : 'Male') : 
                     g === 'Female' ? (language === 'bn' ? 'মহিলা' : 'Female') : 
                     (language === 'bn' ? 'অন্যান্য' : 'Other')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Weight & Phone */}
          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'bn' ? 'ওজন (Weight)' : 'Weight (kg)'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={data.patient.weight}
                onChange={(e) => updatePatient('weight', e.target.value)}
                placeholder="65"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400">kg</span>
            </div>
          </div>

          <div className="sm:col-span-8">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'bn' ? 'রোগীর মোবাইল নম্বর (Phone)' : 'Phone Number'}
            </label>
            <input
              type="text"
              value={data.patient.phone}
              onChange={(e) => updatePatient('phone', e.target.value)}
              placeholder="e.g. 01712-XXXXXX"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
        </div>

        {/* Vitals */}
        {showVitals && (
          <div className="pt-2 mt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-teal-50/40 p-3 rounded-lg">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                BP (রক্তচাপ)
              </label>
              <input
                type="text"
                value={data.patient.bloodPressure || ''}
                onChange={(e) => updatePatient('bloodPressure', e.target.value)}
                placeholder="120/80 mmHg"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Pulse (নাড়ী)
              </label>
              <input
                type="text"
                value={data.patient.pulse || ''}
                onChange={(e) => updatePatient('pulse', e.target.value)}
                placeholder="78 bpm"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Temp (তাপমাত্রা)
              </label>
              <input
                type="text"
                value={data.patient.temperature || ''}
                onChange={(e) => updatePatient('temperature', e.target.value)}
                placeholder="98.6 °F"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                SpO2 (অক্সিজেন)
              </label>
              <input
                type="text"
                value={data.patient.spo2 || ''}
                onChange={(e) => updatePatient('spo2', e.target.value)}
                placeholder="98%"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>
        )}
      </section>

      {/* 🩺 SECTION 3: CLINICAL INFORMATION */}
      <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-teal-700" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {language === 'bn' ? 'ক্লিনিক্যাল তথ্য (Chief Complaint & Diagnosis)' : 'Clinical Notes'}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowClinicalNotes(!showClinicalNotes)}
            className="text-slate-400 hover:text-slate-600"
          >
            {showClinicalNotes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showClinicalNotes && (
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {data.labels?.ccLabel || (language === 'bn' ? 'প্রধান উপসর্গ (Chief Complaint / C/C)' : 'Chief Complaint (C/C)')}
              </label>
              <textarea
                rows={2}
                value={data.clinical.chiefComplaint}
                onChange={(e) => updateClinical('chiefComplaint', e.target.value)}
                placeholder="e.g. Fever for 3 days, dry cough, weakness..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {data.labels?.dxLabel || (language === 'bn' ? 'রোগ নির্ণয় (Diagnosis / D/X)' : 'Diagnosis (Provisional / Final)')}
              </label>
              <input
                type="text"
                value={data.clinical.diagnosis}
                onChange={(e) => updateClinical('diagnosis', e.target.value)}
                placeholder="e.g. Acute Bronchitis, Essential Hypertension"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>
        )}
      </section>

      {/* 💊 SECTION 4: MEDICINE BUILDER */}
      <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-teal-700" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {data.labels?.medicineSectionLabel || (language === 'bn' ? 'ঔষধ তালিকা (Medicines / Rx)' : 'Medicine Builder (Rx)')}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {data.medicines.length}
            </span>
          </div>

          <button
            type="button"
            onClick={addMedicine}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? '+ ঔষধ যোগ করুন' : '+ Add Medicine'}</span>
          </button>
        </div>

        {/* Medicines List */}
        <div className="space-y-4">
          {data.medicines.map((med, index) => {
            const filteredSuggestions = searchQuery.trim()
              ? COMMON_MEDICINES.filter(m => 
                  m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  m.generic.toLowerCase().includes(searchQuery.toLowerCase())
                ).slice(0, 6)
              : COMMON_MEDICINES.slice(0, 6);

            return (
              <div 
                key={med.id} 
                className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:border-slate-300 transition-all space-y-3 relative"
              >
                {/* Medicine Header Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-[11px] font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {med.name || (language === 'bn' ? `ঔষধ #${index + 1}` : `Medicine #${index + 1}`)}
                    </span>
                    {med.strength && (
                      <span className="text-[11px] text-slate-500 font-medium">({med.strength})</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => duplicateMedicine(index)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-md transition-colors"
                      title="Duplicate Medicine"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeMedicine(index)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete Medicine"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Medicine Name with Search */}
                <div className="relative">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {language === 'bn' ? 'ঔষধের নাম (Medicine Name) *' : 'Medicine Name *'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={med.name}
                      onFocus={() => {
                        setActiveSearchIndex(index);
                        setSearchQuery(med.name || '');
                      }}
                      onChange={(e) => {
                        updateMedicine(index, { name: e.target.value });
                        setSearchQuery(e.target.value);
                      }}
                      placeholder={language === 'bn' ? 'টাইপ বা সার্চ করুন (যেমন: Paracetamol, Pantoprazole)' : 'Search or type medicine name...'}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white font-medium"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                  </div>

                  {/* Autocomplete Dropdown */}
                  {activeSearchIndex === index && (
                    <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto custom-scrollbar">
                      <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                        <span>{language === 'bn' ? 'দ্রুত পরামর্শ (Quick Presets)' : 'Suggested Medicines'}</span>
                        <button
                          type="button"
                          onClick={() => setActiveSearchIndex(null)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          ✕
                        </button>
                      </div>
                      {filteredSuggestions.map((item, sIdx) => (
                        <div
                          key={sIdx}
                          onClick={() => handleSelectMedicineSuggestion(index, item)}
                          className="px-3 py-2 hover:bg-teal-50 cursor-pointer border-b border-slate-100 last:border-0 flex items-center justify-between text-xs transition-colors"
                        >
                          <div>
                            <span className="font-semibold text-slate-800">{item.name}</span>
                            <span className="text-[11px] text-slate-500 ml-1.5">({item.strength} · {item.form})</span>
                          </div>
                          <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-mono">
                            {item.commonDosePattern}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form, Strength, Dose Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      {language === 'bn' ? 'ফর্ম (Form)' : 'Form'}
                    </label>
                    <select
                      value={med.form}
                      onChange={(e) => updateMedicine(index, { form: e.target.value as MedicineForm })}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                    >
                      {COMMON_FORMS.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      {language === 'bn' ? 'পাওয়ার / মাত্রা (Strength)' : 'Strength'}
                    </label>
                    <input
                      type="text"
                      list={`strengths-${index}`}
                      value={med.strength}
                      onChange={(e) => updateMedicine(index, { strength: e.target.value })}
                      placeholder="500 mg"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white font-mono"
                    />
                    <datalist id={`strengths-${index}`}>
                      {COMMON_STRENGTHS.map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      {language === 'bn' ? 'ডোজ পরিমাণ (Dose Qty)' : 'Dose (e.g. 1 / 5ml)'}
                    </label>
                    <input
                      type="text"
                      value={med.doseQuantity}
                      onChange={(e) => updateMedicine(index, { doseQuantity: e.target.value })}
                      placeholder="1"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white font-mono"
                    />
                  </div>
                </div>

                {/* Frequency & Timing */}
                <div className="space-y-2 pt-1 border-t border-slate-200/60">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-slate-700">
                      {language === 'bn' ? 'খাওয়ার নিয়ম / ফ্রিকোয়েন্সি (Frequency)' : 'Frequency (Dose Schedule)'}
                    </label>
                  </div>

                  {/* Fast Shorthand Buttons */}
                  <div className="flex flex-wrap gap-1.5">
                    {SHORTHAND_DOSES.map((shorthand) => {
                      const isSelected = med.frequencyPattern === shorthand;
                      return (
                        <button
                          key={shorthand}
                          type="button"
                          onClick={() => {
                            updateMedicine(index, {
                              frequencyPattern: shorthand,
                              frequencySemantic: ''
                            });
                          }}
                          className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md border transition-all ${
                            isSelected
                              ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-teal-500'
                          }`}
                        >
                          {shorthand}
                        </button>
                      );
                    })}
                  </div>

                  {/* Semantic Frequency & Food Timing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">
                        {language === 'bn' ? 'শব্দে ফ্রিকোয়েন্সি' : 'Semantic frequency'}
                      </label>
                      <select
                        value={med.frequencySemantic || 'Twice Daily'}
                        onChange={(e) => {
                          updateMedicine(index, {
                            frequencySemantic: e.target.value,
                            frequencyPattern: ''
                          });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                      >
                        {SEMANTIC_FREQUENCIES.map((freq) => (
                          <option key={freq} value={freq}>
                            {language === 'bn' ? FREQUENCY_TRANSLATIONS[freq as keyof typeof FREQUENCY_TRANSLATIONS]?.bn || freq : freq}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">
                        {language === 'bn' ? 'খাবারের সময় (Food Timing)' : 'Food Timing'}
                      </label>
                      <select
                        value={med.timing}
                        onChange={(e) => updateMedicine(index, { timing: e.target.value as FoodTiming })}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white font-medium"
                      >
                        {FOOD_TIMINGS.map((timing) => (
                          <option key={timing} value={timing}>
                            {language === 'bn' ? `${TIMING_TRANSLATIONS[timing]?.bn} (${timing})` : timing}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Duration & Instruction */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      {language === 'bn' ? 'কতদিন খাবেন (Duration)' : 'Duration'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={med.durationValue}
                        onChange={(e) => updateMedicine(index, { durationValue: e.target.value })}
                        placeholder="5"
                        className="w-20 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white font-mono"
                      />
                      <select
                        value={med.durationUnit}
                        onChange={(e) => updateMedicine(index, { durationUnit: e.target.value as DurationUnit })}
                        className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                      >
                        {DURATION_UNITS.map((u) => (
                          <option key={u} value={u}>
                            {u === 'Days' ? (language === 'bn' ? 'দিন (Days)' : 'Days') :
                             u === 'Weeks' ? (language === 'bn' ? 'সপ্তাহ (Weeks)' : 'Weeks') :
                             u === 'Months' ? (language === 'bn' ? 'মাস (Months)' : 'Months') :
                             u === 'Until finished' ? (language === 'bn' ? 'শেষ না হওয়া পর্যন্ত' : 'Until finished') :
                             u === 'Continue' ? (language === 'bn' ? 'চলবে (Continue)' : 'Continue') : u}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-700">
                        {language === 'bn' ? 'চূড়ান্ত নির্দেশনা (Instruction)' : 'Patient Instruction (Editable)'}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const refreshed = buildAutoInstruction(med, language);
                          updateMedicine(index, { instruction: refreshed }, false);
                        }}
                        className="text-[10px] text-teal-700 hover:text-teal-900 flex items-center gap-0.5"
                        title="Regenerate instruction"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        <span>{language === 'bn' ? 'পুনরায় বানান' : 'Regen'}</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={med.instruction}
                      onChange={(e) => updateMedicine(index, { instruction: e.target.value }, false)}
                      placeholder="e.g. Take 1 tablet twice daily after meals for 5 days."
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                    />
                  </div>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={addMedicine}
            className="w-full py-3 border-2 border-dashed border-teal-300 hover:border-teal-600 rounded-xl text-xs font-bold text-teal-800 hover:bg-teal-50/50 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'bn' ? '+ নতুন ঔষধ যুক্ত করুন (Add Medicine)' : '+ Add Another Medicine'}</span>
          </button>
        </div>
      </section>

      {/* 📝 SECTION 5: ADVICE */}
      <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-700" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {data.labels?.adviceLabel || (language === 'bn' ? 'পরামর্শ ও উপদেশ (Advice)' : 'Clinical Advice')}
            </h3>
          </div>
        </div>

        {/* Quick Advice Chips */}
        <div className="flex flex-wrap gap-1.5">
          {COMMON_ADVICES.map((adv, idx) => {
            const advDisplay = language === 'bn' ? adv.bn : adv.en;
            const isSelected = data.adviceList.includes(advDisplay);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleAdviceChip(advDisplay)}
                className={`px-2.5 py-1 text-xs rounded-lg border transition-all text-left flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
                <span>{advDisplay}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Advice */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            {language === 'bn' ? 'অতিরিক্ত উপদেশ লিখুন (Additional Custom Advice)' : 'Additional Custom Advice'}
          </label>
          <textarea
            rows={2}
            value={data.adviceText}
            onChange={(e) => onChange(prev => ({ ...prev, adviceText: e.target.value }))}
            placeholder={language === 'bn' ? 'যেমন: ঠান্ডা পানি পরিহার করবেন। প্রতিদিন সকালে লবণ-কুসুম পানি দিয়ে গার্গল করবেন...' : 'e.g. Avoid oily and cold food. Gargle twice daily with warm saline...'}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
      </section>

      {/* 🔬 SECTION 6: INVESTIGATION */}
      <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-700" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {data.labels?.invLabel || (language === 'bn' ? 'ল্যাব পরীক্ষা / ইনভেস্টিগেশন (Investigation)' : 'Investigations / Tests')}
            </h3>
          </div>
        </div>

        {/* Quick Investigation Chips */}
        <div className="flex flex-wrap gap-1.5">
          {COMMON_INVESTIGATIONS.map((test) => {
            const isSelected = (data.clinical.selectedTests || []).includes(test);
            return (
              <button
                key={test}
                type="button"
                onClick={() => toggleInvestigationTest(test)}
                className={`px-2.5 py-1 text-xs rounded-lg border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
                <span>{test}</span>
              </button>
            );
          })}
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            {language === 'bn' ? 'অন্যান্য পরীক্ষা লিখুন (Other Investigations)' : 'Other Investigations'}
          </label>
          <input
            type="text"
            value={data.clinical.investigation}
            onChange={(e) => updateClinical('investigation', e.target.value)}
            placeholder="e.g. Serum Ferritin, Vitamin D3, 24h Urinary Protein..."
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
      </section>

      {/* 📆 SECTION 7: FOLLOW-UP */}
      <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-700" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {data.labels?.followUpLabel || (language === 'bn' ? 'ফলোআপ / পরবর্তী সাক্ষাত (Follow-up)' : 'Follow-up Schedule')}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              {language === 'bn' ? 'সময়কাল (After)' : 'After'}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={data.followUp.value}
                onChange={(e) => onChange(prev => ({
                  ...prev,
                  followUp: { ...prev.followUp, value: e.target.value }
                }))}
                className="w-20 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono"
              />
              <select
                value={data.followUp.type}
                onChange={(e) => onChange(prev => ({
                  ...prev,
                  followUp: { ...prev.followUp, type: e.target.value as any }
                }))}
                className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
              >
                <option value="days">{language === 'bn' ? 'দিন পর (Days)' : 'Days'}</option>
                <option value="weeks">{language === 'bn' ? 'সপ্তাহ পর (Weeks)' : 'Weeks'}</option>
                <option value="months">{language === 'bn' ? 'মাস পর (Months)' : 'Months'}</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              {language === 'bn' ? 'বা কাস্টম ফলোআপ নির্দেশ (Custom Instruction)' : 'Or Custom Follow-up Instruction'}
            </label>
            <input
              type="text"
              value={data.followUp.customText}
              onChange={(e) => onChange(prev => ({
                ...prev,
                followUp: { ...prev.followUp, customText: e.target.value }
              }))}
              placeholder={language === 'bn' ? 'যেমন: রক্ত পরীক্ষার রিপোর্ট সহ ৭ দিন পর দেখা করবেন' : 'e.g. See with blood test reports after 7 days'}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
