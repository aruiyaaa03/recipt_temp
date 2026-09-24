import React, { useState, useEffect } from 'react';
import { 
  getInitialPrescriptionData, 
  ClinicalTemplate 
} from './data/templates';
import { 
  PrescriptionData, 
  DoctorProfile, 
  PrescriptionTheme 
} from './types/prescription';
import { 
  loadDoctorProfile, 
  saveDoctorProfile, 
  exportPrescriptionToPdf,
  generateRxNumber
} from './utils/prescriptionUtils';
import { Header } from './components/Header';
import { PrescriptionEditor } from './components/PrescriptionEditor';
import { PrescriptionPreview } from './components/PrescriptionPreview';
import { DoctorSettingsModal } from './components/DoctorSettingsModal';
import { TemplatesModal } from './components/TemplatesModal';
import { NewPrescriptionConfirmModal } from './components/NewPrescriptionConfirmModal';
import { 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Printer, 
  Download, 
  FileText, 
  Eye, 
  Edit3,
  Sliders,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionData>(() => {
    const initial = getInitialPrescriptionData();
    const savedDoctor = loadDoctorProfile();
    return { ...initial, doctor: savedDoctor };
  });

  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [activeMobileTab, setActiveMobileTab] = useState<'editor' | 'preview'>('editor');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isNewConfirmOpen, setIsNewConfirmOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync language with prescription data
  useEffect(() => {
    setPrescriptionData(prev => ({ ...prev, language }));
  }, [language]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Doctor profile update & persist to localStorage
  const handleSaveDoctorProfile = (updatedProfile: DoctorProfile) => {
    saveDoctorProfile(updatedProfile);
    setPrescriptionData(prev => ({ ...prev, doctor: updatedProfile }));
    showToast(language === 'bn' ? 'ডাক্তার প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে!' : 'Doctor settings saved to browser storage!');
  };

  // Change theme
  const handleChangeTheme = (theme: PrescriptionTheme) => {
    setPrescriptionData(prev => ({ ...prev, theme }));
  };

  // Change primary color
  const handleChangeColor = (color: string) => {
    setPrescriptionData(prev => ({ ...prev, primaryColor: color }));
  };

  // Start fresh prescription
  const handleConfirmNewPrescription = () => {
    const savedDoctor = loadDoctorProfile();
    const fresh = getInitialPrescriptionData();
    setPrescriptionData({
      ...fresh,
      doctor: savedDoctor,
      theme: prescriptionData.theme,
      primaryColor: prescriptionData.primaryColor,
      language
    });
    showToast(language === 'bn' ? 'নতুন প্রেসক্রিপশন তৈরি হয়েছে।' : 'New prescription started.');
  };

  // Load clinical template
  const handleSelectTemplate = (template: ClinicalTemplate) => {
    setPrescriptionData(prev => ({
      ...prev,
      rxNumber: generateRxNumber(),
      patient: template.data.patient ? { ...prev.patient, ...template.data.patient } : prev.patient,
      clinical: template.data.clinical ? { ...prev.clinical, ...template.data.clinical } : prev.clinical,
      medicines: template.data.medicines ? [...template.data.medicines] : prev.medicines,
      adviceList: template.data.adviceList ? [...template.data.adviceList] : prev.adviceList,
      adviceText: template.data.adviceText || '',
      followUp: template.data.followUp ? { ...prev.followUp, ...template.data.followUp } : prev.followUp
    }));
    showToast(language === 'bn' ? `"${template.nameBn}" টেমপ্লেট লোড হয়েছে!` : `Loaded "${template.name}" template!`);
  };

  // Print prescription
  const handlePrint = () => {
    window.print();
  };

  // Download PDF
  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const filename = `Prescription_${prescriptionData.rxNumber || 'RX'}.pdf`;
      await exportPrescriptionToPdf('prescription-print-wrapper', filename);
      showToast(language === 'bn' ? `${filename} ডাউনলোড সম্পন্ন!` : `Saved ${filename} successfully!`);
    } catch (err) {
      console.error('PDF export failed:', err);
      showToast(language === 'bn' ? 'PDF তৈরি করতে ব্যর্থ হয়েছে। অনুগ্রহ করে প্রিন্ট অপশন ব্যবহার করুন।' : 'PDF generation error. You can also use Print -> Save as PDF.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/80 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        onNewPrescription={() => setIsNewConfirmOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onPrint={handlePrint}
        onDownloadPdf={handleDownloadPdf}
        isGeneratingPdf={isGeneratingPdf}
        language={language}
        onToggleLanguage={() => setLanguage(prev => (prev === 'en' ? 'bn' : 'en'))}
        activeMobileTab={activeMobileTab}
        onSelectMobileTab={setActiveMobileTab}
        rxNumber={prescriptionData.rxNumber}
      />

      {/* Main Dual-Pane Workspace */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANE: PRESCRIPTION EDITOR (50% on desktop) */}
        <section 
          className={`lg:col-span-6 space-y-4 ${
            activeMobileTab === 'editor' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Editor Header Banner & Quick Jump Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between no-print">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-teal-700" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {language === 'bn' ? 'প্রেসক্রিপশন এডিটর' : 'Prescription Editor'}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{language === 'bn' ? 'লাইভ সেভ হচ্ছে' : 'Live Sync Active'}</span>
            </div>
          </div>

          {/* Core Interactive Editor */}
          <PrescriptionEditor
            data={prescriptionData}
            onChange={setPrescriptionData}
            language={language}
          />
        </section>

        {/* RIGHT PANE: LIVE PRESCRIPTION PREVIEW (50% on desktop) */}
        <section 
          className={`lg:col-span-6 sticky top-20 ${
            activeMobileTab === 'preview' ? 'block' : 'hidden lg:block'
          } h-[calc(100vh-5.5rem)]`}
        >
          <div className="h-full bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <PrescriptionPreview
              data={prescriptionData}
              onChange={setPrescriptionData}
              onPrint={handlePrint}
              onDownloadPdf={handleDownloadPdf}
              isGeneratingPdf={isGeneratingPdf}
              language={language}
            />
          </div>
        </section>
      </main>

      {/* Mobile Floating Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 flex items-center justify-around gap-2 no-print shadow-lg">
        <button
          type="button"
          onClick={() => setActiveMobileTab(prev => prev === 'editor' ? 'preview' : 'editor')}
          className="flex-1 py-2 px-3 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
        >
          {activeMobileTab === 'editor' ? (
            <>
              <Eye className="w-4 h-4 text-teal-700" />
              <span>{language === 'bn' ? 'প্রিভিউ দেখুন' : 'View Preview'}</span>
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4 text-teal-700" />
              <span>{language === 'bn' ? 'এডিটে ফিরুন' : 'Back to Edit'}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="py-2 px-4 text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-lg flex items-center gap-1.5 transition-colors"
        >
          <Printer className="w-4 h-4 text-teal-700" />
          <span>{language === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="py-2 px-4 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>PDF</span>
        </button>
      </div>

      {/* Modals */}
      <DoctorSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={prescriptionData.doctor}
        onSaveProfile={handleSaveDoctorProfile}
        currentTheme={prescriptionData.theme}
        onChangeTheme={handleChangeTheme}
        currentColor={prescriptionData.primaryColor}
        onChangeColor={handleChangeColor}
        language={language}
      />

      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        language={language}
      />

      <NewPrescriptionConfirmModal
        isOpen={isNewConfirmOpen}
        onClose={() => setIsNewConfirmOpen(false)}
        onConfirm={handleConfirmNewPrescription}
        language={language}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 right-4 sm:bottom-6 sm:right-6 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
