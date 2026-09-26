import React from 'react';
import { 
  Building, 
  MapPin, 
  Phone, 
  Clock, 
  Mail, 
  Upload, 
  Trash2 
} from 'lucide-react';
import { PrescriptionData, MedicineItem } from '../types/prescription';
import { EditableText } from './EditableText';
import { saveDoctorProfile } from '../utils/prescriptionUtils';

interface PrescriptionSheetProps {
  data: PrescriptionData;
  isEditable?: boolean;
  onChange?: (updater: (prev: PrescriptionData) => PrescriptionData) => void;
  onLogoUploadClick?: () => void;
  onLogoRemove?: () => void;
  id?: string;
  className?: string;
}

export const PrescriptionSheet: React.FC<PrescriptionSheetProps> = ({
  data,
  isEditable = false,
  onChange,
  onLogoUploadClick,
  onLogoRemove,
  id = 'prescription-print-wrapper',
  className = ''
}) => {
  const { doctor, patient, clinical, medicines, adviceList, adviceText, followUp, labels, primaryColor, theme } = data;

  const updateDoctor = (field: keyof typeof doctor, value: any) => {
    if (!onChange || !isEditable) return;
    onChange(prev => {
      const updatedDoc = { ...prev.doctor, [field]: value };
      saveDoctorProfile(updatedDoc);
      return { ...prev, doctor: updatedDoc };
    });
  };

  const updateLabel = (field: keyof typeof labels, value: string) => {
    if (!onChange || !isEditable) return;
    onChange(prev => ({
      ...prev,
      labels: {
        ...(prev.labels || {}),
        [field]: value
      }
    }));
  };

  const updatePatient = (field: keyof typeof patient, value: any) => {
    if (!onChange || !isEditable) return;
    onChange(prev => ({
      ...prev,
      patient: { ...prev.patient, [field]: value }
    }));
  };

  const updateClinical = (field: keyof typeof clinical, value: any) => {
    if (!onChange || !isEditable) return;
    onChange(prev => ({
      ...prev,
      clinical: { ...prev.clinical, [field]: value }
    }));
  };

  const updateMedicineItem = (index: number, updates: Partial<MedicineItem>) => {
    if (!onChange || !isEditable) return;
    onChange(prev => {
      const copy = [...prev.medicines];
      copy[index] = { ...copy[index], ...updates };
      return { ...prev, medicines: copy };
    });
  };

  // Render logo box
  const renderLogo = (whiteBg: boolean = false) => {
    if (doctor.logoUrl) {
      return (
        <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg p-1 border flex items-center justify-center overflow-hidden shrink-0 shadow-xs ${
          whiteBg ? 'bg-white border-white/40' : 'bg-white border-slate-200'
        }`}>
          <img
            src={doctor.logoUrl}
            alt="Clinic Logo"
            className="max-h-full max-w-full object-contain"
          />
          {isEditable && (
            <div className="absolute inset-0 bg-slate-900/70 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 no-print">
              {onLogoUploadClick && (
                <button
                  type="button"
                  onClick={onLogoUploadClick}
                  className="p-1 bg-white text-slate-800 rounded hover:bg-teal-50"
                  title="Change Logo"
                >
                  <Upload className="w-3.5 h-3.5 text-teal-700" />
                </button>
              )}
              {onLogoRemove && (
                <button
                  type="button"
                  onClick={onLogoRemove}
                  className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                  title="Remove Logo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      );
    }

    if (isEditable && onLogoUploadClick) {
      return (
        <button
          type="button"
          onClick={onLogoUploadClick}
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-all p-1 no-print shrink-0 ${
            whiteBg 
              ? 'border-white/60 bg-white/10 text-white hover:bg-white/20' 
              : 'border-teal-300 bg-teal-50/40 text-teal-700 hover:bg-teal-50 hover:border-teal-500'
          }`}
          title="Upload Clinic Logo"
        >
          <Upload className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-bold text-center leading-tight">
            + Logo
          </span>
        </button>
      );
    }

    return null;
  };

  return (
    <div
      id={id}
      className={`w-[210mm] min-h-[297mm] bg-white text-slate-900 flex flex-col justify-between font-sans print-page-a4 relative box-border ${
        theme === 'framed_royal' ? 'border-[3px] border-double p-[10mm]' : 'p-[12mm_14mm]'
      } ${className}`}
      style={{
        borderColor: primaryColor
      }}
    >
      {/* THEME 5: ROYAL WATERMARK */}
      {theme === 'framed_royal' && (
        <div 
          className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.035] select-none text-[160mm] font-serif font-black"
          style={{ color: primaryColor }}
        >
          ℞
        </div>
      )}

      {/* 🩺 HEADER SECTION */}
      {theme === 'modern_banner' ? (
        <header 
          className="rounded-xl p-5 mb-4 text-white shadow-sm flex items-start justify-between gap-4 avoid-break"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="flex items-start gap-4 flex-1">
            {renderLogo(true)}
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase leading-tight text-white">
                <EditableText
                  value={doctor.clinicName}
                  onChange={(val) => updateDoctor('clinicName', val)}
                  placeholder="ENTER CLINIC NAME"
                  disabled={!isEditable}
                  className="text-white hover:bg-white/20"
                />
              </h2>
              <div className="text-xs text-white/90 font-medium mt-0.5">
                <EditableText
                  value={doctor.clinicTagline}
                  onChange={(val) => updateDoctor('clinicTagline', val)}
                  placeholder="Add clinic tagline..."
                  disabled={!isEditable}
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
                    disabled={!isEditable}
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
                      disabled={!isEditable}
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
                      disabled={!isEditable}
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
                disabled={!isEditable}
                className="text-white hover:bg-white/20"
              />
            </h3>
            <div className="text-xs font-semibold text-white/90 mt-0.5">
              <EditableText
                value={doctor.degree}
                onChange={(val) => updateDoctor('degree', val)}
                placeholder="Qualifications"
                disabled={!isEditable}
                className="text-white/90 hover:bg-white/20"
              />
            </div>
            <div className="text-[11px] font-bold text-white/95 mt-0.5">
              <EditableText
                value={doctor.specialty}
                onChange={(val) => updateDoctor('specialty', val)}
                placeholder="Specialty"
                disabled={!isEditable}
                className="text-white/95 hover:bg-white/20"
              />
            </div>
            <div className="text-[10px] text-white/80 font-mono mt-0.5">
              <EditableText
                value={doctor.registrationNumber}
                onChange={(val) => updateDoctor('registrationNumber', val)}
                placeholder="Reg. No."
                disabled={!isEditable}
                className="text-white/80 hover:bg-white/20"
              />
            </div>
            <div className="text-[10px] text-white/80 mt-1 flex items-center justify-end gap-1">
              <Clock className="w-2.5 h-2.5 shrink-0" />
              <EditableText
                value={doctor.visitingHours}
                onChange={(val) => updateDoctor('visitingHours', val)}
                placeholder="Visiting hours"
                disabled={!isEditable}
                className="text-white/80 hover:bg-white/20"
              />
            </div>
          </div>
        </header>
      ) : theme === 'hospital_pad' ? (
        <header className="border-b-2 pb-3 mb-3 avoid-break" style={{ borderColor: primaryColor }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5 flex-1">
              {renderLogo()}
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
                    disabled={!isEditable}
                  />
                </h2>
                <div className="text-[11px] text-slate-600 font-medium">
                  <EditableText
                    value={doctor.clinicTagline}
                    onChange={(val) => updateDoctor('clinicTagline', val)}
                    placeholder="Clinic Tagline"
                    disabled={!isEditable}
                  />
                </div>
                <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-3">
                  <span>
                    <EditableText
                      value={doctor.address}
                      onChange={(val) => updateDoctor('address', val)}
                      placeholder="Address"
                      disabled={!isEditable}
                    />
                  </span>
                  <span>·</span>
                  <span>
                    <EditableText
                      value={doctor.email}
                      onChange={(val) => updateDoctor('email', val)}
                      placeholder="Email"
                      disabled={!isEditable}
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
                  disabled={!isEditable}
                />
              </h3>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">
                <EditableText
                  value={doctor.degree}
                  onChange={(val) => updateDoctor('degree', val)}
                  placeholder="Degree"
                  disabled={!isEditable}
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
                  disabled={!isEditable}
                />
              </div>
              <div className="text-[10px] text-slate-600 font-mono mt-0.5">
                <EditableText
                  value={doctor.registrationNumber}
                  onChange={(val) => updateDoctor('registrationNumber', val)}
                  placeholder="Registration No."
                  disabled={!isEditable}
                />
              </div>
            </div>
          </div>
        </header>
      ) : theme === 'framed_royal' ? (
        <header className="border-b pb-3 mb-3 text-center avoid-break" style={{ borderColor: primaryColor }}>
          <div className="flex flex-col items-center justify-center">
            {renderLogo()}
            <h2 
              className="text-xl sm:text-2xl font-serif font-black tracking-wide uppercase leading-tight mt-1.5"
              style={{ color: primaryColor }}
            >
              <EditableText
                value={doctor.clinicName}
                onChange={(val) => updateDoctor('clinicName', val)}
                placeholder="ENTER CLINIC NAME"
                disabled={!isEditable}
              />
            </h2>
            <div className="text-xs text-slate-600 italic tracking-wider">
              <EditableText
                value={doctor.clinicTagline}
                onChange={(val) => updateDoctor('clinicTagline', val)}
                placeholder="Medical center tagline"
                disabled={!isEditable}
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
                    disabled={!isEditable}
                  />
                </strong>{' '}
                —{' '}
                <EditableText
                  value={doctor.degree}
                  onChange={(val) => updateDoctor('degree', val)}
                  placeholder="Degrees"
                  disabled={!isEditable}
                />
              </span>
              <span>·</span>
              <span style={{ color: primaryColor }} className="font-bold">
                <EditableText
                  value={doctor.specialty}
                  onChange={(val) => updateDoctor('specialty', val)}
                  placeholder="Specialty"
                  disabled={!isEditable}
                />
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-center gap-3">
              <span>
                <EditableText
                  value={doctor.address}
                  onChange={(val) => updateDoctor('address', val)}
                  placeholder="Address"
                  disabled={!isEditable}
                />
              </span>
              <span>·</span>
              <span>
                <EditableText
                  value={doctor.phone}
                  onChange={(val) => updateDoctor('phone', val)}
                  placeholder="Phone"
                  disabled={!isEditable}
                />
              </span>
              <span>·</span>
              <span>
                <EditableText
                  value={doctor.email}
                  onChange={(val) => updateDoctor('email', val)}
                  placeholder="Gmail / Email"
                  disabled={!isEditable}
                />
              </span>
            </div>
          </div>
        </header>
      ) : (
        <header className="border-b-2 pb-3 mb-3 avoid-break" style={{ borderColor: primaryColor }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              {renderLogo()}
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
                    disabled={!isEditable}
                  />
                </h2>
                <div className="text-[11px] text-slate-600 font-medium tracking-wide mt-0.5">
                  <EditableText
                    value={doctor.clinicTagline}
                    onChange={(val) => updateDoctor('clinicTagline', val)}
                    placeholder="Add clinic tagline or specialty services..."
                    disabled={!isEditable}
                  />
                </div>
                <div className="text-[10px] text-slate-500 mt-1 space-y-0.5 leading-tight">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                    <EditableText
                      value={doctor.address}
                      onChange={(val) => updateDoctor('address', val)}
                      placeholder="Clinic Address (e.g. Green Road, Dhanmondi, Dhaka)"
                      disabled={!isEditable}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                    <EditableText
                      value={doctor.email}
                      onChange={(val) => updateDoctor('email', val)}
                      placeholder="Gmail / Email"
                      disabled={!isEditable}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                    <EditableText
                      value={doctor.phone}
                      onChange={(val) => updateDoctor('phone', val)}
                      placeholder="Phone / Hotline"
                      disabled={!isEditable}
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
                  disabled={!isEditable}
                />
              </h3>
              <div className="text-xs font-semibold text-slate-700 leading-snug mt-0.5">
                <EditableText
                  value={doctor.degree}
                  onChange={(val) => updateDoctor('degree', val)}
                  placeholder="Qualifications"
                  disabled={!isEditable}
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
                  disabled={!isEditable}
                />
              </div>
              <div className="text-[10px] text-slate-600 font-mono mt-0.5">
                <EditableText
                  value={doctor.registrationNumber}
                  onChange={(val) => updateDoctor('registrationNumber', val)}
                  placeholder="BMDC Reg. No."
                  disabled={!isEditable}
                />
              </div>
              <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-end gap-1">
                <Clock className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                <EditableText
                  value={doctor.visitingHours}
                  onChange={(val) => updateDoctor('visitingHours', val)}
                  placeholder="Visiting hours"
                  disabled={!isEditable}
                />
              </div>
            </div>
          </div>
        </header>
      )}

      {/* 👤 PATIENT INFORMATION STRIP */}
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
                disabled={!isEditable}
              />
            </span>
            <span className="font-bold text-slate-900 truncate">
              <EditableText
                value={patient.name}
                onChange={(val) => updatePatient('name', val)}
                placeholder="— Patient Name —"
                disabled={!isEditable}
              />
            </span>
          </div>

          <div className="col-span-2 flex items-center gap-1">
            <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider shrink-0">
              <EditableText
                value={labels?.ageLabel || 'Age:'}
                onChange={(val) => updateLabel('ageLabel', val)}
                disabled={!isEditable}
              />
            </span>
            <span className="font-semibold text-slate-900">
              <EditableText
                value={patient.age ? `${patient.age} ${patient.ageUnit === 'Years' ? 'Y' : patient.ageUnit}` : ''}
                onChange={(val) => updatePatient('age', val.replace(/[^0-9]/g, ''))}
                placeholder="Age"
                disabled={!isEditable}
              />
            </span>
          </div>

          <div className="col-span-2 flex items-center gap-1">
            <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider shrink-0">
              <EditableText
                value={labels?.genderLabel || 'Sex:'}
                onChange={(val) => updateLabel('genderLabel', val)}
                disabled={!isEditable}
              />
            </span>
            <span className="font-semibold text-slate-900">
              <EditableText
                value={patient.gender}
                onChange={(val) => updatePatient('gender', val as any)}
                disabled={!isEditable}
              />
            </span>
          </div>

          <div className="col-span-3 flex items-center gap-1 justify-end font-mono text-[11px]">
            <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider shrink-0">
              <EditableText
                value={labels?.dateLabel || 'Date:'}
                onChange={(val) => updateLabel('dateLabel', val)}
                disabled={!isEditable}
              />
            </span>
            <span className="font-semibold text-slate-900">
              <EditableText
                value={data.date}
                onChange={(val) => onChange && onChange(prev => ({ ...prev, date: val }))}
                disabled={!isEditable}
              />
            </span>
          </div>

          {/* Second Row */}
          <div className="col-span-3 flex items-center gap-1 text-[11px]">
            <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider shrink-0">
              <EditableText
                value={labels?.weightLabel || 'Weight:'}
                onChange={(val) => updateLabel('weightLabel', val)}
                disabled={!isEditable}
              />
            </span>
            <span className="font-medium text-slate-900">
              <EditableText
                value={patient.weight ? `${patient.weight} kg` : ''}
                onChange={(val) => updatePatient('weight', val.replace('kg', '').trim())}
                placeholder="— kg"
                disabled={!isEditable}
              />
            </span>
          </div>

          <div className="col-span-4 flex items-center gap-1 text-[11px] truncate">
            <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider shrink-0">
              <EditableText
                value={labels?.phoneLabel || 'Phone:'}
                onChange={(val) => updateLabel('phoneLabel', val)}
                disabled={!isEditable}
              />
            </span>
            <span className="font-medium text-slate-900 truncate">
              <EditableText
                value={patient.phone}
                onChange={(val) => updatePatient('phone', val)}
                placeholder="— Phone —"
                disabled={!isEditable}
              />
            </span>
          </div>

          <div className="col-span-5 flex items-center gap-1 justify-end font-mono text-[11px]">
            <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider shrink-0">
              <EditableText
                value={labels?.rxNoLabel || 'Rx No:'}
                onChange={(val) => updateLabel('rxNoLabel', val)}
                disabled={!isEditable}
              />
            </span>
            <span className="font-bold text-slate-900">
              <EditableText
                value={data.rxNumber}
                onChange={(val) => onChange && onChange(prev => ({ ...prev, rxNumber: val }))}
                disabled={!isEditable}
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
                    disabled={!isEditable}
                  />
                </div>
              )}
              {patient.pulse && (
                <div>
                  <strong className="text-slate-700">Pulse:</strong>{' '}
                  <EditableText
                    value={patient.pulse}
                    onChange={(val) => updatePatient('pulse', val)}
                    disabled={!isEditable}
                  />
                </div>
              )}
              {patient.temperature && (
                <div>
                  <strong className="text-slate-700">Temp:</strong>{' '}
                  <EditableText
                    value={patient.temperature}
                    onChange={(val) => updatePatient('temperature', val)}
                    disabled={!isEditable}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 💊 MAIN BODY WORKSPACE (Clinical Findings + Rx Medicines) */}
      <div className="flex-1 flex gap-4 min-h-[170mm]">
        {/* LEFT COLUMN: Clinical Notes (30% width) */}
        <div className={`w-[30%] pr-3.5 space-y-4 text-xs ${
          theme === 'dual_tint' 
            ? 'bg-slate-50/70 p-3 rounded-lg border border-slate-200' 
            : 'border-r border-slate-200/90'
        }`}>
          {/* Chief Complaint */}
          {(clinical.chiefComplaint || isEditable) && (
            <div>
              <h4 
                className="text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"
                style={{ color: primaryColor }}
              >
                <EditableText
                  value={labels?.ccLabel || 'C/C (Chief Complaint)'}
                  onChange={(val) => updateLabel('ccLabel', val)}
                  disabled={!isEditable}
                />
              </h4>
              <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-line pl-1 border-l-2 border-slate-300">
                <EditableText
                  multiline
                  value={clinical.chiefComplaint}
                  onChange={(val) => updateClinical('chiefComplaint', val)}
                  placeholder="Click to type complaints..."
                  disabled={!isEditable}
                />
              </p>
            </div>
          )}

          {/* Diagnosis */}
          {(clinical.diagnosis || isEditable) && (
            <div>
              <h4 
                className="text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"
                style={{ color: primaryColor }}
              >
                <EditableText
                  value={labels?.dxLabel || 'D/X (Diagnosis)'}
                  onChange={(val) => updateLabel('dxLabel', val)}
                  disabled={!isEditable}
                />
              </h4>
              <p className="text-[11px] font-bold text-slate-800 leading-snug pl-1 border-l-2 border-slate-300">
                <EditableText
                  multiline
                  value={clinical.diagnosis}
                  onChange={(val) => updateClinical('diagnosis', val)}
                  placeholder="Click to type diagnosis..."
                  disabled={!isEditable}
                />
              </p>
            </div>
          )}

          {/* Investigations */}
          {( (clinical.selectedTests && clinical.selectedTests.length > 0) || clinical.investigation || isEditable ) && (
            <div>
              <h4 
                className="text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"
                style={{ color: primaryColor }}
              >
                <EditableText
                  value={labels?.invLabel || 'Inv (Investigations)'}
                  onChange={(val) => updateLabel('invLabel', val)}
                  disabled={!isEditable}
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
                    disabled={!isEditable}
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
                  disabled={!isEditable}
                />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <EditableText
                  value={labels?.medicineSectionLabel || 'Prescribed Medicines'}
                  onChange={(val) => updateLabel('medicineSectionLabel', val)}
                  disabled={!isEditable}
                />
              </span>
            </div>

            {/* Medicines List */}
            <div className="space-y-3.5">
              {medicines.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
                  No medicines added yet.
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
                          disabled={!isEditable}
                        />
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        <EditableText
                          value={med.name}
                          onChange={(val) => updateMedicineItem(idx, { name: val })}
                          placeholder="Medicine Name"
                          disabled={!isEditable}
                        />
                      </span>
                      <span className="text-xs font-semibold text-slate-700 font-mono">
                        <EditableText
                          value={med.strength}
                          onChange={(val) => updateMedicineItem(idx, { strength: val })}
                          placeholder="Strength"
                          disabled={!isEditable}
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
                          disabled={!isEditable}
                          className={theme === 'dual_tint' ? 'text-white' : undefined}
                        />
                      </span>

                      <span className="text-slate-400">—</span>

                      <span className="font-medium text-slate-700">
                        <EditableText
                          value={med.timing}
                          onChange={(val) => updateMedicineItem(idx, { timing: val as any })}
                          placeholder="Food Timing"
                          disabled={!isEditable}
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
                          disabled={!isEditable}
                        />
                      </span>
                    </div>

                    {/* Specific Instruction */}
                    <div className="pl-6 pt-0.5 text-[11px] text-slate-600 italic">
                      <EditableText
                        value={med.instruction}
                        onChange={(val) => updateMedicineItem(idx, { instruction: val })}
                        placeholder="Doctor instruction..."
                        disabled={!isEditable}
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
                  disabled={!isEditable}
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
                    disabled={!isEditable}
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
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
                disabled={!isEditable}
              />
            </p>
            <p>
              •{' '}
              <EditableText
                value={labels?.footerNote2 || 'In case of emergency, contact the nearest hospital immediately.'}
                onChange={(val) => updateLabel('footerNote2', val)}
                disabled={!isEditable}
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
                  disabled={!isEditable}
                />
              </p>
              <p className="text-[10px] text-slate-600 font-medium leading-tight">
                <EditableText
                  value={doctor.degree}
                  onChange={(val) => updateDoctor('degree', val)}
                  disabled={!isEditable}
                />
              </p>
              <p className="text-[9.5px] text-slate-500 font-mono leading-tight">
                <EditableText
                  value={doctor.registrationNumber}
                  onChange={(val) => updateDoctor('registrationNumber', val)}
                  disabled={!isEditable}
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
  );
};
