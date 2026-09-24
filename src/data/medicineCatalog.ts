export interface CommonMedicineSuggestion {
  name: string;
  strength: string;
  form: import('../types/prescription').MedicineForm;
  generic: string;
  commonDosePattern: string;
  commonTiming: import('../types/prescription').FoodTiming;
  defaultDuration: string;
}

export const COMMON_MEDICINES: CommonMedicineSuggestion[] = [
  { name: 'Paracetamol', strength: '500 mg', form: 'Tablet', generic: 'Paracetamol', commonDosePattern: '1+0+1', commonTiming: 'After Food', defaultDuration: '3' },
  { name: 'Paracetamol (Napa Extra)', strength: '500 mg + 65 mg', form: 'Tablet', generic: 'Paracetamol + Caffeine', commonDosePattern: '1+0+1', commonTiming: 'After Food', defaultDuration: '3' },
  { name: 'Pantoprazole', strength: '20 mg', form: 'Tablet', generic: 'Pantoprazole', commonDosePattern: '1+0+1', commonTiming: 'Before Food', defaultDuration: '14' },
  { name: 'Omeprazole', strength: '20 mg', form: 'Capsule', generic: 'Omeprazole', commonDosePattern: '1+0+1', commonTiming: 'Before Food', defaultDuration: '14' },
  { name: 'Esomeprazole', strength: '20 mg', form: 'Tablet', generic: 'Esomeprazole', commonDosePattern: '1+0+1', commonTiming: 'Before Food', defaultDuration: '14' },
  { name: 'Rabeprazole', strength: '20 mg', form: 'Tablet', generic: 'Rabeprazole', commonDosePattern: '1+0+0', commonTiming: 'Before Food', defaultDuration: '14' },
  { name: 'Montelukast', strength: '10 mg', form: 'Tablet', generic: 'Montelukast Sodium', commonDosePattern: '0+0+1', commonTiming: 'Before Bed', defaultDuration: '30' },
  { name: 'Azithromycin', strength: '500 mg', form: 'Tablet', generic: 'Azithromycin', commonDosePattern: '1+0+0', commonTiming: 'Empty Stomach', defaultDuration: '5' },
  { name: 'Cefixime', strength: '200 mg', form: 'Capsule', generic: 'Cefixime', commonDosePattern: '1+0+1', commonTiming: 'After Food', defaultDuration: '7' },
  { name: 'Amoxicillin + Clavulanic Acid', strength: '625 mg', form: 'Tablet', generic: 'Co-Amoxiclav', commonDosePattern: '1+0+1', commonTiming: 'With Food', defaultDuration: '7' },
  { name: 'Ciprofloxacin', strength: '500 mg', form: 'Tablet', generic: 'Ciprofloxacin', commonDosePattern: '1+0+1', commonTiming: 'After Food', defaultDuration: '5' },
  { name: 'Fexofenadine', strength: '120 mg', form: 'Tablet', generic: 'Fexofenadine HCl', commonDosePattern: '0+0+1', commonTiming: 'After Food', defaultDuration: '7' },
  { name: 'Cetirizine', strength: '10 mg', form: 'Tablet', generic: 'Cetirizine HCl', commonDosePattern: '0+0+1', commonTiming: 'Before Bed', defaultDuration: '5' },
  { name: 'Metformin', strength: '500 mg', form: 'Tablet', generic: 'Metformin HCl', commonDosePattern: '1+0+1', commonTiming: 'With Food', defaultDuration: '30' },
  { name: 'Gliclazide', strength: '80 mg', form: 'Tablet', generic: 'Gliclazide', commonDosePattern: '1+0+0', commonTiming: 'Before Food', defaultDuration: '30' },
  { name: 'Losartan Potassium', strength: '50 mg', form: 'Tablet', generic: 'Losartan', commonDosePattern: '1+0+0', commonTiming: 'After Food', defaultDuration: '30' },
  { name: 'Amlodipine', strength: '5 mg', form: 'Tablet', generic: 'Amlodipine Besylate', commonDosePattern: '0+0+1', commonTiming: 'After Food', defaultDuration: '30' },
  { name: 'Atorvastatin', strength: '10 mg', form: 'Tablet', generic: 'Atorvastatin Calcium', commonDosePattern: '0+0+1', commonTiming: 'Before Bed', defaultDuration: '30' },
  { name: 'Rosuvastatin', strength: '10 mg', form: 'Tablet', generic: 'Rosuvastatin Calcium', commonDosePattern: '0+0+1', commonTiming: 'Before Bed', defaultDuration: '30' },
  { name: 'Domperidone', strength: '10 mg', form: 'Tablet', generic: 'Domperidone', commonDosePattern: '1+0+1', commonTiming: 'Before Food', defaultDuration: '5' },
  { name: 'Alverine Citrate', strength: '60 mg', form: 'Capsule', generic: 'Alverine Citrate', commonDosePattern: '1+0+1', commonTiming: 'Before Food', defaultDuration: '7' },
  { name: 'Antacid Plus', strength: '200 ml', form: 'Suspension', generic: 'Magaldrate + Simethicone', commonDosePattern: '1+1+1', commonTiming: 'After Food', defaultDuration: '7' },
  { name: 'Salbutamol Inhaler', strength: '100 mcg', form: 'Inhaler', generic: 'Salbutamol', commonDosePattern: '2 puffs', commonTiming: 'As Needed', defaultDuration: '30' },
  { name: 'Budecort Inhaler', strength: '200 mcg', form: 'Inhaler', generic: 'Budesonide', commonDosePattern: '1+0+1', commonTiming: 'After Food', defaultDuration: '30' },
  { name: 'Clobetasol Propionate', strength: '0.05%', form: 'Ointment', generic: 'Clobetasol', commonDosePattern: '1+0+1', commonTiming: 'Anytime', defaultDuration: '14' },
  { name: 'Moxifloxacin Eye Drops', strength: '0.5%', form: 'Eye Drops', generic: 'Moxifloxacin', commonDosePattern: '1 drop 3 times', commonTiming: 'Anytime', defaultDuration: '7' },
  { name: 'Oral Rehydration Salt (ORS)', strength: 'Sachet', form: 'Powder/Sachet', generic: 'Oral Electrolytes', commonDosePattern: '1 sachet in 500ml', commonTiming: 'As Needed', defaultDuration: '3' },
  { name: 'Vitamin B Complex', strength: 'Standard', form: 'Tablet', generic: 'Vitamin B1, B6, B12', commonDosePattern: '1+0+1', commonTiming: 'After Food', defaultDuration: '30' },
  { name: 'Calcium + Vitamin D3', strength: '500 mg + 200 IU', form: 'Tablet', generic: 'Calcium Carbonate + D3', commonDosePattern: '0+0+1', commonTiming: 'After Food', defaultDuration: '30' }
];

export const COMMON_INVESTIGATIONS = [
  'CBC with ESR',
  'Blood Sugar (Fasting & 2HABF)',
  'Random Blood Sugar (RBS)',
  'HbA1c',
  'Serum Creatinine',
  'Serum Uric Acid',
  'Lipid Profile',
  'SGPT / ALT',
  'Urine Routine Examination (R/E)',
  'X-Ray Chest P/A View',
  'USG of Whole Abdomen',
  'ECG (12 Leads)',
  'Serum Electrolytes (Na+, K+, Cl-)',
  'Thyroid Profile (TSH)',
  'Stool R/E',
  'Dengue NS1 Antigen / IgG, IgM',
  'Widal Test',
  'Echocardiogram'
];

export interface QuickAdvice {
  en: string;
  bn: string;
}

export const COMMON_ADVICES: QuickAdvice[] = [
  { en: 'Take adequate rest.', bn: 'পর্যাপ্ত পরিমাণ বিশ্রাম নিন।' },
  { en: 'Drink plenty of safe drinking water (at least 2.5–3 liters daily).', bn: 'পর্যাপ্ত বিশুদ্ধ পানি পান করুন (প্রতিদিন অন্তত ২.৫–৩ লিটার)।' },
  { en: 'Avoid oily, spicy, and junk food.', bn: 'তৈলাক্ত, অতিরিক্ত ঝাল ও ভাজাপোড়া খাবার পরিহার করুন।' },
  { en: 'Walk for at least 30–45 minutes every day.', bn: 'প্রতিদিন অন্তত ৩০ থেকে ৪৫ মিনিট হাঁটার অভ্যাস করুন।' },
  { en: 'Avoid smoking and consumption of alcohol or tobacco.', bn: 'ধূমপান, তামাক ও জর্দা সম্পূর্ণ বর্জন করুন।' },
  { en: 'Maintain a low salt and low sodium diet.', bn: 'খাবারে কাঁচা লবণ ও অতিরিক্ত লবণ খাওয়া পরিহার করুন।' },
  { en: 'Avoid sugar, sweets, and high glycemic carbohydrate foods.', bn: 'চিনি, মিষ্টি ও অতিরিক্ত শর্করা জাতীয় খাবার এড়িয়ে চলুন।' },
  { en: 'Eat plenty of green leafy vegetables and fresh seasonal fruits.', bn: 'প্রচুর পরিমাণে সবুজ শাকসবজি এবং তাজা মৌসুমি ফলমূল খান।' },
  { en: 'Check and record blood pressure regularly.', bn: 'নিয়মিত রক্তচাপ মাপুন এবং লিখে রাখুন।' },
  { en: 'Check blood glucose level before breakfast and after meals.', bn: 'সকালে খালি পেটে ও খাবার ২ ঘণ্টা পর সুগার মাপুন।' },
  { en: 'Take all prescribed medicines in full course on exact time.', bn: 'সব ঔষধ নির্ধারিত সময়ে সঠিক নিয়মে নিয়মিত সেবন করবেন।' },
  { en: 'Do not stop antibiotics before completing the full course.', bn: 'সম্পূর্ণ কোর্স শেষ করার আগে অ্যান্টিবায়োটিক বন্ধ করবেন না।' }
];

export const TIMING_TRANSLATIONS = {
  'Before Food': { en: 'Before Food', bn: 'খাবারের আগে' },
  'After Food': { en: 'After Food', bn: 'খাবারের পরে' },
  'With Food': { en: 'With Food', bn: 'খাবারের সাথে' },
  'Empty Stomach': { en: 'Empty Stomach', bn: 'খালি পেটে' },
  'Before Bed': { en: 'Before Bed', bn: 'ঘুমানোর আগে' },
  'Anytime': { en: 'Anytime', bn: 'যেকোনো সময়' },
  'As Needed': { en: 'As Needed', bn: 'প্রয়োজনে' }
};

export const FREQUENCY_TRANSLATIONS = {
  'Once Daily': { en: 'Once daily', bn: 'দিনে ১ বার' },
  'Twice Daily': { en: 'Twice daily', bn: 'দিনে ২ বার' },
  'Three Times Daily': { en: 'Three times daily', bn: 'দিনে ৩ বার' },
  'Four Times Daily': { en: 'Four times daily', bn: 'দিনে ৪ বার' },
  'Every 4 Hours': { en: 'Every 4 hours', bn: 'প্রতি ৪ ঘণ্টা পরপর' },
  'Every 6 Hours': { en: 'Every 6 hours', bn: 'প্রতি ৬ ঘণ্টা পরপর' },
  'Every 8 Hours': { en: 'Every 8 hours', bn: 'প্রতি ৮ ঘণ্টা পরপর' },
  'Every 12 Hours': { en: 'Every 12 hours', bn: 'প্রতি ১২ ঘণ্টা পরপর' },
  'As Needed': { en: 'As needed', bn: 'প্রয়োজনে' },
  'At Bedtime': { en: 'At bedtime', bn: 'ঘুমানোর আগে' },
  'Custom': { en: 'As directed', bn: 'নির্দেশনা অনুযায়ী' }
};
