import { DoctorProfile, MedicineItem } from '../types/prescription';
import { TIMING_TRANSLATIONS, FREQUENCY_TRANSLATIONS } from '../data/medicineCatalog';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';

const DOCTOR_PROFILE_KEY = 'rx_maker_doctor_profile_v1';
const RX_COUNTER_KEY = 'rx_maker_counter_v1';

export const DEFAULT_DOCTOR_PROFILE: DoctorProfile = {
  clinicName: 'ABC MEDICAL CENTER',
  clinicTagline: 'Advanced Multi-Specialty Healthcare & Diagnostic Services',
  doctorName: 'Dr. Md. Rahman',
  degree: 'MBBS, FCPS (Medicine), MD',
  specialty: 'Medicine Specialist & Consultant Physician',
  registrationNumber: 'BMDC Reg. No: A-48291',
  phone: '+880 1712-345678 / +880 1819-876543',
  email: 'dr.rahman.med@gmail.com',
  address: 'Suite 402, Green Road Medical Tower, Dhanmondi, Dhaka-1205',
  visitingHours: 'Daily 5:00 PM – 9:30 PM (Friday Closed)',
  logoUrl: '',
  signatureUrl: '',
  showSignature: true,
  showLogo: true
};

export function loadDoctorProfile(): DoctorProfile {
  try {
    const raw = localStorage.getItem(DOCTOR_PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_DOCTOR_PROFILE, ...parsed };
    }
  } catch (err) {
    console.error('Failed to read doctor profile from localStorage:', err);
  }
  return DEFAULT_DOCTOR_PROFILE;
}

export function saveDoctorProfile(profile: DoctorProfile): void {
  try {
    localStorage.setItem(DOCTOR_PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save doctor profile to localStorage:', err);
  }
}

export function generateRxNumber(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');

  let count = 1;
  try {
    const stored = localStorage.getItem(RX_COUNTER_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === `${yy}${mm}${dd}`) {
        count = (parsed.count || 0) + 1;
      }
    }
    localStorage.setItem(RX_COUNTER_KEY, JSON.stringify({ date: `${yy}${mm}${dd}`, count }));
  } catch {
    count = Math.floor(Math.random() * 900) + 100;
  }

  const serial = String(count).padStart(3, '0');
  return `RX-${yy}${mm}${dd}-${serial}`;
}

export function getTodayFormattedDate(): string {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function getCurrentFormattedTime(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function buildAutoInstruction(
  medicine: Partial<MedicineItem>,
  lang: 'en' | 'bn' = 'en'
): string {
  const form = medicine.form || 'Tablet';
  const qty = medicine.doseQuantity || '1';
  const timing = medicine.timing || 'After Food';
  const pattern = medicine.frequencyPattern;
  const semantic = medicine.frequencySemantic || 'Twice Daily';
  const durVal = medicine.durationValue || '5';
  const durUnit = medicine.durationUnit || 'Days';

  if (lang === 'bn') {
    const timingBn = TIMING_TRANSLATIONS[timing]?.bn || 'খাবারের পর';
    const formBnMap: Record<string, string> = {
      Tablet: 'ট্যাবলেট',
      Capsule: 'ক্যাপসুল',
      Syrup: 'চামচ সিরাপ',
      Suspension: 'চামচ সাসপেনশন',
      Injection: 'ভায়াল ইনজেকশন',
      Drop: 'ফোঁটা',
      'Eye Drops': 'ফোঁটা চোখে',
      'Ear Drops': 'ফোঁটা কানে',
      Inhaler: 'পাফ',
      Ointment: 'মলম লাগাবেন',
      Cream: 'ক্রিম লাগাবেন',
      'Powder/Sachet': 'স্যাচেট গুলিয়ে',
      Suppository: 'সাপোজিটরি মলদ্বারে',
      Solution: 'মিশ্রণ',
      Custom: 'মাত্রায়'
    };
    const formBn = formBnMap[form] || form;

    let doseText = '';
    if (pattern && pattern.trim()) {
      doseText = `${pattern} নিয়মে`;
    } else {
      const freqBn = FREQUENCY_TRANSLATIONS[semantic as keyof typeof FREQUENCY_TRANSLATIONS]?.bn || semantic;
      doseText = `${qty}টি ${formBn} ${freqBn}`;
    }

    let durationText = '';
    if (durUnit === 'Continue') {
      durationText = 'চলবে';
    } else if (durUnit === 'Until finished') {
      durationText = 'শেষ না হওয়া পর্যন্ত';
    } else {
      const unitBnMap: Record<string, string> = {
        Days: 'দিন',
        Weeks: 'সপ্তাহ',
        Months: 'মাস',
        Custom: ''
      };
      durationText = `${durVal} ${unitBnMap[durUnit] || durUnit}`;
    }

    return `${doseText} — ${timingBn} (${durationText})`;
  }

  // English instruction
  const timingEn = TIMING_TRANSLATIONS[timing]?.en || 'After Food';
  let doseEn = '';
  if (pattern && pattern.trim()) {
    doseEn = `Take as (${pattern})`;
  } else {
    doseEn = `Take ${qty} ${form.toLowerCase()}(s) ${semantic.toLowerCase()}`;
  }

  let durationEn = '';
  if (durUnit === 'Continue') {
    durationEn = 'continue as advised';
  } else if (durUnit === 'Until finished') {
    durationEn = 'until finished';
  } else {
    durationEn = `for ${durVal} ${durUnit.toLowerCase()}`;
  }

  return `${doseEn} ${timingEn.toLowerCase()} ${durationEn}.`;
}

export async function exportPrescriptionToPdf(elementId: string, filename: string): Promise<void> {
  const printRoot = document.getElementById('prescription-print-root');
  
  // Prefer the clean print sheet; fall back to interactive wrapper if needed
  const targetElement = document.getElementById(elementId) || 
                        document.getElementById('prescription-clean-print-sheet') || 
                        document.getElementById('prescription-print-wrapper');

  if (!targetElement) {
    throw new Error('Prescription element not found');
  }

  // Ensure all web fonts (Hind Siliguri, Plus Jakarta Sans, etc.) are fully settled
  if (document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore font loading timeouts
    }
  }

  // Enable high-fidelity capture state: 100% opacity in normal coordinate space
  if (printRoot) {
    printRoot.classList.add('pdf-capturing');
  }

  try {
    // Brief frame wait so layout and SVG icons render completely
    await new Promise(resolve => setTimeout(resolve, 100));

    let imgData: string | null = null;

    try {
      // Primary High-Fidelity Engine: html-to-image
      // Uses browser's native SVG ForeignObject renderer, perfectly supporting oklch colors and Bengali fonts
      imgData = await toPng(targetElement, {
        quality: 0.98,
        pixelRatio: 2.2, // Crisp retina resolution for small medicine text & doctor seals
        backgroundColor: '#ffffff',
        skipFonts: true, // Prevents CORS SecurityError when inspecting cross-origin Google Fonts stylesheets
        filter: (node) => {
          if (node instanceof HTMLElement) {
            if (node.classList.contains('no-print')) return false;
            if (node.tagName === 'BUTTON') return false;
            if (node.tagName === 'INPUT' && (node as HTMLInputElement).type === 'file') return false;
          }
          return true;
        }
      });
    } catch (primaryErr) {
      console.warn('Primary html-to-image rendering issue, attempting sanitized canvas fallback:', primaryErr);

      // Secondary Fallback Engine: html2canvas with oklch-to-rgb translation
      const canvas = await html2canvas(targetElement, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          // Resolve modern CSS colors (oklch) to standard rgb for html2canvas
          const helper = clonedDoc.createElement('div');
          clonedDoc.body.appendChild(helper);
          const elements = clonedDoc.querySelectorAll('*');
          elements.forEach(el => {
            const htmlEl = el as HTMLElement;
            const comp = window.getComputedStyle(el);
            ['color', 'backgroundColor', 'borderColor'].forEach(prop => {
              const val = comp[prop as any];
              if (typeof val === 'string' && val.includes('oklch')) {
                try {
                  helper.style[prop as any] = val;
                  htmlEl.style[prop as any] = window.getComputedStyle(helper)[prop as any] || '#000000';
                } catch {
                  // ignore
                }
              }
            });
          });
          helper.remove();
        }
      });

      imgData = canvas.toDataURL('image/png', 0.98);
    }

    if (!imgData || imgData === 'data:,' || imgData.length < 500) {
      throw new Error('Generated canvas image was empty');
    }

    // Initialize standard A4 PDF (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    const safeFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    pdf.save(safeFilename);
  } finally {
    if (printRoot) {
      printRoot.classList.remove('pdf-capturing');
    }
  }
}
