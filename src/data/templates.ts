import { PrescriptionData } from '../types/prescription';
import { DEFAULT_DOCTOR_PROFILE, generateRxNumber, getTodayFormattedDate, getCurrentFormattedTime } from '../utils/prescriptionUtils';

export interface ClinicalTemplate {
  id: string;
  name: string;
  nameBn: string;
  category: string;
  description: string;
  data: Partial<PrescriptionData>;
}

export const CLINICAL_TEMPLATES: ClinicalTemplate[] = [
  {
    id: 'fever_cold',
    name: 'Fever & Common Cold (জ্বর ও সর্দি-কাশি)',
    nameBn: 'জ্বর ও সর্দি-কাশি',
    category: 'General Medicine',
    description: 'Paracetamol, Antihistamine, Vitamin C, Hydration advice',
    data: {
      patient: {
        name: 'Mohammad Rahim',
        age: '32',
        ageUnit: 'Years',
        gender: 'Male',
        weight: '68',
        phone: '01712-345678',
        bloodPressure: '120/80',
        temperature: '101°F',
        pulse: '84'
      },
      clinical: {
        chiefComplaint: 'Fever with chills for 3 days, runny nose, dry cough, body ache.',
        diagnosis: 'Acute Viral Pharyngitis / Upper Respiratory Tract Infection (URTI)',
        investigation: 'CBC with ESR, Dengue NS1 Ag (if fever persists > 3 days)',
        selectedTests: ['CBC with ESR']
      },
      medicines: [
        {
          id: 'med-1',
          name: 'Paracetamol (Napa Extra)',
          strength: '500 mg + 65 mg',
          form: 'Tablet',
          doseQuantity: '1',
          doseUnit: 'Tablet',
          frequencyPattern: '1+0+1',
          frequencySemantic: 'Twice Daily',
          timeOfDay: { morning: true, noon: false, afternoon: false, evening: false, night: true },
          timing: 'After Food',
          durationValue: '5',
          durationUnit: 'Days',
          instruction: '১টি ট্যাবলেট দিনে ২ বার ভরা পেটে ৫ দিন খাবেন (জ্বর বা ব্যথার জন্য)।'
        },
        {
          id: 'med-2',
          name: 'Fexofenadine (Fexo)',
          strength: '120 mg',
          form: 'Tablet',
          doseQuantity: '1',
          doseUnit: 'Tablet',
          frequencyPattern: '0+0+1',
          frequencySemantic: 'Once Daily',
          timeOfDay: { morning: false, noon: false, afternoon: false, evening: false, night: true },
          timing: 'After Food',
          durationValue: '7',
          durationUnit: 'Days',
          instruction: '১টি ট্যাবলেট রাতে শোবার আগে ৭ দিন খাবেন (সর্দি-হাঁচির জন্য)।'
        },
        {
          id: 'med-3',
          name: 'Pantoprazole',
          strength: '20 mg',
          form: 'Tablet',
          doseQuantity: '1',
          doseUnit: 'Tablet',
          frequencyPattern: '1+0+1',
          frequencySemantic: 'Twice Daily',
          timeOfDay: { morning: true, noon: false, afternoon: false, evening: false, night: true },
          timing: 'Before Food',
          durationValue: '7',
          durationUnit: 'Days',
          instruction: '১টি ট্যাবলেট সকালে ও রাতে খাবারের ৩০ মিনিট আগে খাবেন।'
        }
      ],
      adviceList: [
        'পর্যাপ্ত পরিমাণ বিশ্রাম নিন।',
        'বেশি করে কুসুম গরম পানি ও তরল খাবার গ্রহণ করুন।',
        'ঠান্ডা পানি ও আইসক্রিম পরিহার করুন।'
      ],
      adviceText: 'Avoid chilled beverages. Gargle with warm salt water twice daily.',
      followUp: {
        type: 'days',
        value: '5',
        customText: 'জ্বর না কমলে ৫ দিন পর রিপোর্টসহ দেখা করবেন।'
      }
    }
  },
  {
    id: 'acid_peptic',
    name: 'Acid Peptic Disease / GERD (গ্যাস্ট্রিক ও বুকজ্বালা)',
    nameBn: 'গ্যাস্ট্রিক ও এসিডিটি',
    category: 'Gastroenterology',
    description: 'PPI, Prokinetic, Antacid gel with dietary advice',
    data: {
      patient: {
        name: 'Fatema Begum',
        age: '45',
        ageUnit: 'Years',
        gender: 'Female',
        weight: '62',
        phone: '01823-456789',
        bloodPressure: '130/85',
        pulse: '76'
      },
      clinical: {
        chiefComplaint: 'Epigastric burning pain, acid regurgitation, nausea after oily meals for 2 weeks.',
        diagnosis: 'Gastroesophageal Reflux Disease (GERD) with Dyspepsia',
        investigation: 'Endoscopy of Upper GI Tract (if symptoms persist), USG of Whole Abdomen',
        selectedTests: ['USG of Whole Abdomen', 'Serum Creatinine']
      },
      medicines: [
        {
          id: 'med-apd-1',
          name: 'Esomeprazole',
          strength: '40 mg',
          form: 'Tablet',
          doseQuantity: '1',
          doseUnit: 'Tablet',
          frequencyPattern: '1+0+1',
          frequencySemantic: 'Twice Daily',
          timeOfDay: { morning: true, noon: false, afternoon: false, evening: false, night: true },
          timing: 'Before Food',
          durationValue: '14',
          durationUnit: 'Days',
          instruction: '১টি করে ট্যাবলেট সকাল এবং রাতে খাবারের ৩০ মিনিট আগে ১৪ দিন সেব্য।'
        },
        {
          id: 'med-apd-2',
          name: 'Domperidone',
          strength: '10 mg',
          form: 'Tablet',
          doseQuantity: '1',
          doseUnit: 'Tablet',
          frequencyPattern: '1+0+1',
          frequencySemantic: 'Twice Daily',
          timeOfDay: { morning: true, noon: false, afternoon: false, evening: false, night: true },
          timing: 'Before Food',
          durationValue: '7',
          durationUnit: 'Days',
          instruction: '১টি করে ট্যাবলেট খাবারের ১৫ মিনিট আগে দিনে ২ বার ৭ দিন।'
        },
        {
          id: 'med-apd-3',
          name: 'Antacid Plus',
          strength: '200 ml',
          form: 'Suspension',
          doseQuantity: '2 spoons',
          doseUnit: 'Spoon',
          frequencyPattern: '1+1+1',
          frequencySemantic: 'Three Times Daily',
          timeOfDay: { morning: true, noon: true, afternoon: false, evening: false, night: true },
          timing: 'After Food',
          durationValue: '7',
          durationUnit: 'Days',
          instruction: '২ চামচ করে দিনে ৩ বার প্রধান খাবারের ১ ঘণ্টা পরে খাবেন।'
        }
      ],
      adviceList: [
        'তৈলাক্ত, অতিরিক্ত ঝাল ও ভাজাপোড়া খাবার পরিহার করুন।',
        'খাবার পরপরই শুয়ে পড়বেন না, অন্তত ২ ঘণ্টা পর ঘুমাবেন।'
      ],
      adviceText: 'Eat smaller, frequent meals. Elevate head end of bed slightly.',
      followUp: {
        type: 'weeks',
        value: '2',
        customText: '২ সপ্তাহ পর ফলোআপের জন্য আসবেন।'
      }
    }
  },
  {
    id: 'hypertension_dm',
    name: 'Hypertension & Type 2 Diabetes (উচ্চ রক্তচাপ ও ডায়াবেটিস)',
    nameBn: 'উচ্চ রক্তচাপ ও ডায়াবেটিস',
    category: 'Endocrinology / Cardiology',
    description: 'ARB, Metformin, Statin, regular monitoring & lifestyle',
    data: {
      patient: {
        name: 'Abdul Malek',
        age: '56',
        ageUnit: 'Years',
        gender: 'Male',
        weight: '74',
        phone: '01911-223344',
        bloodPressure: '145/92',
        pulse: '72'
      },
      clinical: {
        chiefComplaint: 'Occasional morning headache, fatigue, excessive thirst, known diabetic for 4 years.',
        diagnosis: 'Essential Hypertension Stage 1 + Type 2 Diabetes Mellitus (Uncontrolled)',
        investigation: 'HbA1c, Fasting Blood Sugar, 2HABF, Serum Creatinine, Lipid Profile, ECG',
        selectedTests: ['HbA1c', 'Blood Sugar (Fasting & 2HABF)', 'Lipid Profile', 'ECG (12 Leads)', 'Serum Creatinine']
      },
      medicines: [
        {
          id: 'med-htn-1',
          name: 'Losartan Potassium',
          strength: '50 mg',
          form: 'Tablet',
          doseQuantity: '1',
          doseUnit: 'Tablet',
          frequencyPattern: '1+0+0',
          frequencySemantic: 'Once Daily',
          timeOfDay: { morning: true, noon: false, afternoon: false, evening: false, night: false },
          timing: 'After Food',
          durationValue: '1',
          durationUnit: 'Continue',
          instruction: '১টি ট্যাবলেট প্রতিদিন সকালে নাস্তার পর নিয়মিত খাবেন (চলবে)।'
        },
        {
          id: 'med-htn-2',
          name: 'Metformin',
          strength: '500 mg',
          form: 'Tablet',
          doseQuantity: '1',
          doseUnit: 'Tablet',
          frequencyPattern: '1+0+1',
          frequencySemantic: 'Twice Daily',
          timeOfDay: { morning: true, noon: false, afternoon: false, evening: false, night: true },
          timing: 'With Food',
          durationValue: '1',
          durationUnit: 'Continue',
          instruction: '১টি ট্যাবলেট সকাল ও রাতে প্রধান খাবারের সাথে খাবেন (চলবে)।'
        },
        {
          id: 'med-htn-3',
          name: 'Atorvastatin',
          strength: '10 mg',
          form: 'Tablet',
          doseQuantity: '1',
          doseUnit: 'Tablet',
          frequencyPattern: '0+0+1',
          frequencySemantic: 'Once Daily',
          timeOfDay: { morning: false, noon: false, afternoon: false, evening: false, night: true },
          timing: 'Before Bed',
          durationValue: '1',
          durationUnit: 'Continue',
          instruction: '১টি ট্যাবলেট প্রতিদিন রাতে ঘুমানোর পূর্বে খাবেন (চলবে)।'
        }
      ],
      adviceList: [
        'খাবারে কাঁচা লবণ ও অতিরিক্ত লবণ খাওয়া পরিহার করুন।',
        'চিনি, মিষ্টি ও অতিরিক্ত শর্করা জাতীয় খাবার এড়িয়ে চলুন।',
        'প্রতিদিন অন্তত ৩০ থেকে ৪৫ মিনিট নিয়মিত হাঁটুন।'
      ],
      adviceText: 'Record daily fasting and 2hr post-prandial blood sugar in a diary.',
      followUp: {
        type: 'months',
        value: '1',
        customText: '১ মাস পর ল্যাব টেস্ট রিপোর্ট সহ দেখা করবেন।'
      }
    }
  }
];

export const DEFAULT_CUSTOM_LABELS = {
  patientLabel: 'Patient Name',
  ageLabel: 'Age',
  genderLabel: 'Sex',
  dateLabel: 'Date',
  weightLabel: 'Weight',
  phoneLabel: 'Phone',
  rxNoLabel: 'Rx No',
  ccLabel: 'C/C (Chief Complaint)',
  dxLabel: 'D/X (Diagnosis)',
  invLabel: 'Inv (Investigations)',
  rxSymbol: '℞',
  medicineSectionLabel: 'Prescribed Medicines',
  adviceLabel: 'Advice / উপদেশ',
  followUpLabel: 'Follow-up / পরবর্তী সাক্ষাত',
  footerNote1: 'This prescription is digitally generated.',
  footerNote2: 'In case of emergency, contact the nearest hospital immediately.'
};

export function getInitialPrescriptionData(): PrescriptionData {
  return {
    rxNumber: generateRxNumber(),
    date: getTodayFormattedDate(),
    time: getCurrentFormattedTime(),
    doctor: DEFAULT_DOCTOR_PROFILE,
    labels: { ...DEFAULT_CUSTOM_LABELS },
    patient: {
      name: '',
      age: '',
      ageUnit: 'Years',
      gender: 'Male',
      weight: '',
      phone: '',
      bloodPressure: '',
      pulse: '',
      temperature: '',
      spo2: ''
    },
    clinical: {
      chiefComplaint: '',
      diagnosis: '',
      investigation: '',
      selectedTests: [],
      historyNotes: ''
    },
    medicines: [
      {
        id: 'med-init-1',
        name: 'Paracetamol',
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
        instruction: '১টি ট্যাবলেট দিনে ২ বার খাবারের পর ৫ দিন খাবেন।'
      }
    ],
    adviceList: ['পর্যাপ্ত পরিমাণ বিশ্রাম নিন।', 'বেশি করে বিশুদ্ধ পানি পান করুন।'],
    adviceText: '',
    followUp: {
      type: 'days',
      value: '7',
      customText: '৭ দিন পর প্রয়োজনে দেখা করবেন।'
    },
    theme: 'classic',
    primaryColor: '#0f766e', // Deep medical teal
    language: 'en'
  };
}
