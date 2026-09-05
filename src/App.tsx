import { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Languages, 
  Stethoscope, 
  Pill, 
  AlertCircle, 
  UserPlus, 
  Search, 
  Video, 
  ClipboardList, 
  Volume2, 
  MapPin, 
  PhoneCall, 
  Car, 
  CheckCircle2, 
  Home, 
  Users, 
  FileText 
} from 'lucide-react';

const translations = {
  en: {
    appTitle: "Village Health Helper",
    subtitle: "Gramin Arogya Sahayak",
    dashboard: "Dashboard",
    findMedicine: "Find My Medicine",
    smartGuide: "Smart Guide & Video Doctor",
    sosButton: "Red SOS Button",
    online: "Online",
    offline: "Offline Mode (Saving locally)",
    villageName: "Village: Vadgaon",
    todayVisits: "Today's Visits",
    patientLookup: "Patient Lookup / Register",
    searchPlaceholder: "Enter Name or ABHA ID",
    medicineDesc: "Check nearby stock & directions",
    triageDesc: "Triage & Teleconsultation",
    sosDesc: "Emergency Escalation",
    medicineSelect: "Select Medicine",
    stockStatus: "Nearby Stock Status",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    away: "away",
    symptomSelect: "Select Primary Symptom",
    mildCough: "Mild Cough",
    chestPain: "Chest Pain / High Fever",
    recommendPHC: "Recommend: Treat at PHC",
    bypassHospital: "Bypass to District Hospital",
    startVideo: "Start Video Consult",
    healthDiary: "Digital Health Diary",
    triggerEmergency: "TRIGGER EMERGENCY 108",
    ambulanceETA: "Ambulance ETA: 12 mins",
    bedReserved: "Emergency Bed Reserved at Civil Hospital",
    scanQR: "Show this QR Pass to Ambulance Driver",
    playAudioDesc: "Play Audio Instructions",
    syncing: "Syncing records...",
    synced: "All records synced!",
    saveRecord: "Save Patient Record"
  },
  mr: {
    appTitle: "ग्राम आरोग्य सहाय्यक",
    subtitle: "Village Health Helper",
    dashboard: "डॅशबोर्ड",
    findMedicine: "माझे औषध शोधा",
    smartGuide: "स्मार्ट मार्गदर्शक आणि व्हिडिओ डॉक्टर",
    sosButton: "लाल SOS बटण (तातडीची मदत)",
    online: "ऑनलाइन",
    offline: "ऑफलाइन मोड (स्थानिक जतन करत आहे)",
    villageName: "गाव: वडगाव",
    todayVisits: "आजच्या भेटी",
    patientLookup: "रुग्ण शोधा / नोंदणी करा",
    searchPlaceholder: "नाव किंवा ABHA आयडी प्रविष्ट करा",
    medicineDesc: "जवळचा साठा आणि दिशानिर्देश तपासा",
    triageDesc: "प्राथमिक तपासणी आणि टेलिकन्सल्टेशन",
    sosDesc: "आणीबाणी वाढवणे",
    medicineSelect: "औषध निवडा",
    stockStatus: "जवळचा साठा स्थिती",
    inStock: "साठ्यात आहे",
    outOfStock: "साठा संपला आहे",
    away: "दूर",
    symptomSelect: "प्राथमिक लक्षण निवडा",
    mildCough: "सौम्य खोकला",
    chestPain: "छातीत दुखणे / तीव्र ताप",
    recommendPHC: "शिफारस: PHC मध्ये उपचार करा",
    bypassHospital: "जिल्हा रुग्णालयात पाठवा",
    startVideo: "व्हिडिओ सल्ला सुरू करा",
    healthDiary: "डिजिटल आरोग्य डायरी",
    triggerEmergency: "आणीबाणी 108 ट्रिगर करा",
    ambulanceETA: "रुग्णवाहिका येण्याची वेळ: 12 मिनिटे",
    bedReserved: "सिव्हिल हॉस्पिटलमध्ये आणीबाणीचा बेड राखून ठेवला आहे",
    scanQR: "हा QR पास रुग्णवाहिका चालकाला दाखवा",
    playAudioDesc: "ऑडिओ सूचना ऐका",
    syncing: "रेकॉर्ड सिंक करत आहे...",
    synced: "सर्व रेकॉर्ड सिंक केले!",
    saveRecord: "रुग्ण नोंद जतन करा"
  },
  hi: {
    appTitle: "ग्राम स्वास्थ्य सहायक",
    subtitle: "Village Health Helper",
    dashboard: "डैशबोर्ड",
    findMedicine: "मेरी दवा खोजें",
    smartGuide: "स्मार्ट गाइड और वीडियो डॉक्टर",
    sosButton: "लाल SOS बटन (आपातकाल)",
    online: "ऑनलाइन",
    offline: "ऑफ़लाइन मोड (स्थानीय रूप से सहेजा जा रहा है)",
    villageName: "गाँव: वडगाँव",
    todayVisits: "आज की मुलाकातें",
    patientLookup: "मरीज़ खोजें / पंजीकरण करें",
    searchPlaceholder: "नाम या ABHA आईडी दर्ज करें",
    medicineDesc: "आसपास के स्टॉक और दिशा-निर्देश जांचें",
    triageDesc: "प्राथमिक जांच और टेलीकंसल्टेशन",
    sosDesc: "आपातकालीन वृद्धि",
    medicineSelect: "दवा चुनें",
    stockStatus: "आसपास का स्टॉक",
    inStock: "स्टॉक में",
    outOfStock: "स्टॉक खत्म",
    away: "दूर",
    symptomSelect: "प्राथमिक लक्षण चुनें",
    mildCough: "हल्की खांसी",
    chestPain: "छाती में दर्द / तेज बुखार",
    recommendPHC: "सिफारिश: PHC में इलाज करें",
    bypassHospital: "जिला अस्पताल भेजें",
    startVideo: "वीडियो परामर्श शुरू करें",
    healthDiary: "डिजिटल स्वास्थ्य डायरी",
    triggerEmergency: "आपातकाल 108 ट्रिगर करें",
    ambulanceETA: "एम्बुलेंस आगमन का समय: 12 मिनट",
    bedReserved: "सिविल अस्पताल में आपातकालीन बिस्तर आरक्षित",
    scanQR: "यह QR पास एम्बुलेंस चालक को दिखाएं",
    playAudioDesc: "ऑडियो निर्देश सुनें",
    syncing: "रिकॉर्ड सिंक हो रहे हैं...",
    synced: "सभी रिकॉर्ड सिंक हो गए!",
    saveRecord: "मरीज़ रिकॉर्ड सहेजें"
  }
};

type Lang = 'en' | 'mr' | 'hi';
type View = 'dashboard' | 'medicine' | 'triage' | 'sos';

export default function App() {
  const [lang, setLang] = useState<Lang>('en');
  const [isOffline, setIsOffline] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [syncMessage, setSyncMessage] = useState('');
  
  const t = translations[lang];

  // Mock toggle offline mode
  const toggleOffline = () => {
    if (isOffline) {
      // Coming back online
      setIsOffline(false);
      setSyncMessage(t.syncing);
      setTimeout(() => {
        setSyncMessage(t.synced);
        setTimeout(() => setSyncMessage(''), 3000);
      }, 1500);
    } else {
      setIsOffline(true);
    }
  };

  const navItems = [
    { id: 'dashboard', icon: Home, label: t.dashboard },
    { id: 'medicine', icon: Pill, label: t.findMedicine },
    { id: 'triage', icon: Stethoscope, label: t.smartGuide },
    { id: 'sos', icon: AlertCircle, label: t.sosButton },
  ];

  return (
    <div className="flex h-screen bg-gray-bg overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <div className="w-24 md:w-64 bg-primary text-white flex flex-col shadow-xl z-10 transition-all duration-300">
        <div className="p-4 md:p-6 flex flex-col items-center md:items-start border-b border-white/20">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3">
            <ClipboardList className="text-primary w-7 h-7" />
          </div>
          <h1 className="hidden md:block font-bold text-xl leading-tight">{t.appTitle}</h1>
          <p className="hidden md:block text-xs opacity-80">{t.subtitle}</p>
        </div>
        
        <div className="flex-1 py-6 flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={`flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 p-4 mx-2 rounded-2xl transition-colors ${
                currentView === item.id ? 'bg-white text-primary shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              <item.icon className="w-7 h-7 md:w-6 md:h-6" />
              <span className="text-xs md:text-base font-semibold text-center md:text-left">
                {item.id === 'sos' ? (
                  <span className={currentView === 'sos' ? 'text-red-500' : 'text-red-200'}>{item.label}</span>
                ) : item.label}
              </span>
            </button>
          ))}
        </div>
        
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="w-5 h-5 opacity-80" />
            <span className="hidden md:block font-medium">{t.todayVisits}: 14</span>
          </div>
          <div className="hidden md:block text-center text-xs opacity-70">
            {t.villageName}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col relative h-full overflow-y-auto">
        
        {/* HEADER BAR */}
        <header className="bg-white px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleOffline}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all border-2 ${
                isOffline ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'
              }`}
            >
              {isOffline ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
              <span className="hidden sm:inline">{isOffline ? t.offline : t.online}</span>
            </button>
            {syncMessage && (
              <span className="text-sm font-medium text-blue-600 animate-pulse bg-blue-50 px-3 py-1 rounded-full">
                {syncMessage}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-full">
            {(['en', 'mr', 'hi'] as Lang[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-full text-sm font-bold uppercase transition-all ${
                  lang === l ? 'bg-white shadow text-primary' : 'text-gray-500'
                }`}
              >
                {l}
              </button>
            ))}
            <Languages className="w-5 h-5 text-gray-400 ml-2 mr-2" />
          </div>
        </header>

        {/* DYNAMIC CONTENT */}
        <main className="p-4 md:p-8 flex-1">
          {currentView === 'dashboard' && <DashboardView t={t} setView={setCurrentView} />}
          {currentView === 'medicine' && <MedicineView t={t} />}
          {currentView === 'triage' && <TriageView t={t} />}
          {currentView === 'sos' && <SOSView t={t} />}
        </main>
      </div>
    </div>
  );
}

/* =========================================
   VIEW COMPONENTS
   ========================================= */

function DashboardView({ t, setView }: { t: any, setView: (v: View) => void }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 fade-in">
      {/* Patient Lookup Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <UserPlus className="text-primary" /> {t.patientLookup}
        </h2>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-4 text-lg focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <button className="bg-primary hover:bg-primary/90 text-white px-8 rounded-2xl font-bold text-lg transition-colors">
            Go
          </button>
        </div>
      </div>

      {/* Action Pathways Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        
        <PathwayCard 
          icon={Pill}
          title={t.findMedicine}
          desc={t.medicineDesc}
          colorClass="bg-blue-50 text-blue-700 border-blue-200"
          iconBg="bg-blue-100"
          onClick={() => setView('medicine')}
        />

        <PathwayCard 
          icon={Video}
          title={t.smartGuide}
          desc={t.triageDesc}
          colorClass="bg-purple-50 text-purple-700 border-purple-200"
          iconBg="bg-purple-100"
          onClick={() => setView('triage')}
        />

        <PathwayCard 
          icon={AlertCircle}
          title={t.sosButton}
          desc={t.sosDesc}
          colorClass="bg-red-50 text-red-700 border-red-200 shadow-sm shadow-red-100"
          iconBg="bg-red-100 text-red-600"
          onClick={() => setView('sos')}
        />
        
      </div>
    </div>
  );
}

function MedicineView({ t }: { t: any }) {
  const [selectedMed, setSelectedMed] = useState('');

  return (
    <div className="max-w-3xl mx-auto space-y-6 fade-in">
      <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <Pill className="text-primary w-8 h-8" />
          {t.findMedicine}
        </h2>
        
        <div>
          <label className="block text-gray-600 font-medium mb-2">{t.medicineSelect}</label>
          <select 
            className="w-full bg-gray-50 p-4 rounded-xl border border-gray-200 text-lg font-medium focus:ring-2 focus:ring-primary outline-none"
            value={selectedMed}
            onChange={(e) => setSelectedMed(e.target.value)}
          >
            <option value="">-- Choose --</option>
            <option value="paracetamol">Paracetamol 500mg</option>
            <option value="ors">ORS Packets</option>
            <option value="amoxicillin">Amoxicillin (Antibiotic)</option>
            <option value="insulin">Insulin (Cold Chain)</option>
          </select>
        </div>

        {selectedMed && (
          <div className="mt-4 border-t pt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{t.stockStatus}</h3>
            <div className="space-y-4">
              
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <CheckCircle2 />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">PHC Khed</h4>
                    <p className="text-green-700 font-medium">{t.inStock} (45 strips)</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-gray-500 mb-1">
                    <MapPin className="w-4 h-4" /> 4 km {t.away}
                  </div>
                  <button className="text-sm bg-white text-primary font-bold px-3 py-1 rounded-lg border border-primary/20">
                    Route
                  </button>
                </div>
              </div>

              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center justify-between opacity-75">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                    <AlertCircle />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">Sub-Centre Vadgaon</h4>
                    <p className="text-red-600 font-medium">{t.outOfStock} (0)</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-gray-500 mb-1">
                    <MapPin className="w-4 h-4" /> 1 km {t.away}
                  </div>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-md font-bold">Predictive Alert: Stockout</span>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TriageView({ t }: { t: any }) {
  const [symptom, setSymptom] = useState('');

  return (
    <div className="max-w-5xl mx-auto fade-in">
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Left: Triage Logic */}
        <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Stethoscope className="text-primary w-8 h-8" />
            {t.smartGuide}
          </h2>
          
          <div>
            <label className="block text-gray-600 font-medium mb-3">{t.symptomSelect}</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setSymptom('mild')}
                className={`p-4 rounded-xl border-2 font-bold transition-all ${
                  symptom === 'mild' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-green-300'
                }`}
              >
                {t.mildCough}
              </button>
              <button 
                onClick={() => setSymptom('severe')}
                className={`p-4 rounded-xl border-2 font-bold transition-all ${
                  symptom === 'severe' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-red-300'
                }`}
              >
                {t.chestPain}
              </button>
            </div>
          </div>

          {symptom && (
            <div className={`mt-2 p-4 rounded-2xl border-l-4 ${symptom === 'mild' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                {symptom === 'mild' ? <CheckCircle2 className="text-green-500" /> : <AlertCircle className="text-red-500" />}
                {symptom === 'mild' ? t.recommendPHC : t.bypassHospital}
              </h3>
              
              <button className="mt-4 w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                <Video className="w-5 h-5" />
                {t.startVideo}
              </button>

              <button className="mt-3 w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                <Volume2 className="w-5 h-5 text-blue-500" />
                {t.playAudioDesc}
              </button>
            </div>
          )}
        </div>

        {/* Right: Health Diary Context */}
        <div className="bg-primary-light rounded-3xl p-6 shadow-sm border border-primary/20">
          <h2 className="text-xl font-bold text-primary flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6" />
            {t.healthDiary}
          </h2>
          
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-4 border-b pb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                <UserPlus className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-xl">Ramesh Patil</h3>
                <p className="text-gray-500">Age: 45 | ABHA: 12-3456-7890</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">History</h4>
              <p className="font-medium text-gray-700">Hypertension, Diabetes Type 2</p>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">Vitals Today</h4>
              <div className="flex gap-4">
                <div className="bg-red-50 text-red-700 p-2 rounded-lg font-bold">BP: 150/95</div>
                <div className="bg-green-50 text-green-700 p-2 rounded-lg font-bold">Temp: 98.6F</div>
              </div>
            </div>

            <button className="w-full bg-primary/10 text-primary font-bold py-3 rounded-xl mt-4">
              {t.saveRecord}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function SOSView({ t }: { t: any }) {
  const [triggered, setTriggered] = useState(false);

  return (
    <div className="max-w-2xl mx-auto text-center fade-in">
      {!triggered ? (
        <div className="bg-white rounded-3xl p-10 shadow-sm border-2 border-red-100 flex flex-col items-center gap-8">
          <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
            <AlertCircle className="w-16 h-16 text-red-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-red-600 mb-2">Emergency Escalation</h2>
            <p className="text-gray-500 text-lg">For critical cases (Trauma, Snakebite, Maternal)</p>
          </div>
          
          <button 
            onClick={() => setTriggered(true)}
            className="w-full py-6 bg-red-600 hover:bg-red-700 text-white text-2xl font-black rounded-3xl shadow-lg shadow-red-200 transition-transform transform active:scale-95"
          >
            {t.triggerEmergency}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-red-500 flex flex-col gap-6 text-left">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white">
              <PhoneCall className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-red-600">108 Dispatched</h2>
              <p className="font-medium text-gray-600">Status: En Route</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex items-center gap-4">
            <Car className="w-10 h-10 text-blue-500" />
            <div>
              <h3 className="font-bold text-blue-900 text-xl">{t.ambulanceETA}</h3>
              <p className="text-blue-700">Driver: Suresh (9876543210)</p>
            </div>
          </div>

          <div className="bg-green-50 p-5 rounded-2xl border border-green-100 flex items-center gap-4">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
            <div>
              <h3 className="font-bold text-green-900 text-xl">{t.bedReserved}</h3>
              <p className="text-green-700">Pre-Arrival Notification Sent</p>
            </div>
          </div>

          <div className="mt-4 text-center border-t border-dashed pt-6">
            <div className="w-40 h-40 bg-gray-200 mx-auto rounded-xl flex items-center justify-center text-gray-400 mb-3">
              [ QR CODE ]
            </div>
            <p className="font-bold text-gray-700">{t.scanQR}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function PathwayCard({ icon: Icon, title, desc, colorClass, iconBg, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`text-left p-6 rounded-3xl border-2 transition-transform transform hover:-translate-y-1 hover:shadow-lg ${colorClass}`}
    >
      <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center mb-6`}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold mb-2 leading-tight">{title}</h3>
      <p className="text-sm opacity-90 font-medium">{desc}</p>
    </button>
  );
}
