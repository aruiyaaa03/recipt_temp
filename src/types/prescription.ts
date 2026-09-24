export type Gender = 'Male' | 'Female' | 'Other';

export type AgeUnit = 'Years' | 'Months' | 'Days';

export type MedicineForm = 
  | 'Tablet' 
  | 'Capsule' 
  | 'Syrup' 
  | 'Suspension' 
  | 'Injection' 
  | 'Drop' 
  | 'Eye Drops'
  | 'Ear Drops'
  | 'Inhaler' 
  | 'Ointment' 
  | 'Cream' 
  | 'Powder/Sachet' 
  | 'Suppository' 
  | 'Solution' 
  | 'Custom';

export type FoodTiming = 
  | 'After Food' 
  | 'Before Food' 
  | 'With Food' 
  | 'Empty Stomach' 
  | 'Before Bed' 
  | 'Anytime' 
  | 'As Needed';

export type DurationUnit = 'Days' | 'Weeks' | 'Months' | 'Until finished' | 'Continue' | 'Custom';

export type PrescriptionTheme = 
  | 'classic' 
  | 'modern_banner' 
  | 'minimal' 
  | 'hospital_pad' 
  | 'framed_royal' 
  | 'dual_tint';

export interface DoctorProfile {
  clinicName: string;
  clinicTagline: string;
  doctorName: string;
  degree: string;
  specialty: string;
  registrationNumber: string;
  phone: string;
  email: string; // e.g. Gmail or contact email
  address: string;
  visitingHours: string;
  logoUrl: string; // base64 or URL
  signatureUrl: string; // base64 or URL
  showSignature: boolean;
  showLogo: boolean;
}

export interface CustomLabels {
  patientLabel: string;
  ageLabel: string;
  genderLabel: string;
  dateLabel: string;
  weightLabel: string;
  phoneLabel: string;
  rxNoLabel: string;
  ccLabel: string;
  dxLabel: string;
  invLabel: string;
  rxSymbol: string;
  medicineSectionLabel: string;
  adviceLabel: string;
  followUpLabel: string;
  footerNote1: string;
  footerNote2: string;
}

export interface PatientInfo {
  name: string;
  age: string;
  ageUnit: AgeUnit;
  gender: Gender;
  weight: string; // in kg
  phone: string;
  bloodPressure?: string;
  pulse?: string;
  temperature?: string;
  spo2?: string;
}

export interface MedicineItem {
  id: string;
  name: string;
  strength: string;
  form: MedicineForm;
  doseQuantity: string; // e.g. "1", "2", "5ml"
  doseUnit: string; // e.g. "Tablet", "Capsule", "Spoon", "ml", "Puff"
  frequencyPattern: string; // "1+0+1", "1+1+1", "0+0+1", "1+0+0", "0+1+0", etc.
  frequencySemantic: string; // "Twice Daily", "Once Daily", "Three Times Daily", etc.
  timeOfDay: {
    morning: boolean;
    noon: boolean;
    afternoon: boolean;
    evening: boolean;
    night: boolean;
  };
  timing: FoodTiming;
  durationValue: string; // "5"
  durationUnit: DurationUnit;
  instruction: string; // Doctor's final instruction (editable)
}

export interface ClinicalInfo {
  chiefComplaint: string;
  diagnosis: string;
  investigation: string;
  selectedTests: string[];
  historyNotes?: string;
}

export interface FollowUpInfo {
  type: 'days' | 'weeks' | 'months' | 'date' | 'custom';
  value: string;
  customText: string;
}

export interface PrescriptionData {
  rxNumber: string;
  date: string;
  time: string;
  doctor: DoctorProfile;
  labels: CustomLabels;
  patient: PatientInfo;
  clinical: ClinicalInfo;
  medicines: MedicineItem[];
  adviceList: string[];
  adviceText: string;
  followUp: FollowUpInfo;
  theme: PrescriptionTheme;
  primaryColor: string;
  language: 'en' | 'bn';
}
