import type { Localized } from "@/i18n";

/**
 * Every string the farmer registration flow shows, in all three languages.
 * Kept beside the component rather than in the global dictionaries so the
 * whole feature lives in one folder and can be lifted into the production
 * app intact.
 */
export const REG = {
  /* ---------- header ---------- */
  step: { en: "Step 01", hi: "चरण 01", te: "దశ 01" },
  eyebrow: {
    en: "Farmer registration & verification",
    hi: "किसान पंजीकरण और सत्यापन",
    te: "రైతు నమోదు & ధృవీకరణ",
  },
  title: {
    en: "Register once. Verify once.",
    hi: "एक बार पंजीकरण। एक बार सत्यापन।",
    te: "ఒకసారి నమోదు. ఒకసారి ధృవీకరణ.",
  },
  core: {
    en: "Register once. Verify once. Access a coordinated procurement journey.",
    hi: "एक बार पंजीकरण करें। एक बार सत्यापन करें। एक समन्वित खरीद यात्रा का लाभ उठाएँ।",
    te: "ఒకసారి నమోదు చేయండి. ఒకసారి ధృవీకరించండి. సమన్వయంతో కూడిన సేకరణ ప్రయాణాన్ని పొందండి.",
  },
  demoTag: { en: "Prototype demonstration", hi: "प्रोटोटाइप प्रदर्शन", te: "ప్రోటోటైప్ ప్రదర్శన" },
  fillDemo: { en: "Fill demo data", hi: "डेमो डेटा भरें", te: "డెమో డేటా నింపండి" },
  clear: { en: "Clear form", hi: "फ़ॉर्म साफ़ करें", te: "ఫారం క్లియర్ చేయండి" },
  demoNote: {
    en: "Demonstration data — not a real registered farmer.",
    hi: "डेमो डेटा — कोई वास्तविक पंजीकृत किसान नहीं।",
    te: "డెమో డేటా — నిజమైన నమోదిత రైతు కాదు.",
  },

  /* ---------- progress rail ---------- */
  railProfile: { en: "Farmer profile", hi: "किसान प्रोफ़ाइल", te: "రైతు ప్రొఫైల్" },
  railIdentity: { en: "Proof of identity", hi: "पहचान का प्रमाण", te: "గుర్తింపు రుజువు" },
  railLand: { en: "Land records", hi: "भूमि अभिलेख", te: "భూమి రికార్డులు" },
  railBank: { en: "Bank details", hi: "बैंक विवरण", te: "బ్యాంక్ వివరాలు" },
  railVerify: { en: "Verification", hi: "सत्यापन", te: "ధృవీకరణ" },
  railComplete: { en: "Registration complete", hi: "पंजीकरण पूर्ण", te: "నమోదు పూర్తి" },

  /* ---------- profile ---------- */
  profileSub: {
    en: "Who the farmer is, where they farm, and which centre they will deliver to.",
    hi: "किसान कौन है, कहाँ खेती करता है और किस केंद्र पर उपज देगा।",
    te: "రైతు ఎవరు, ఎక్కడ సాగు చేస్తారు, ఏ కేంద్రానికి పంట అందిస్తారు.",
  },
  fName: { en: "Farmer name", hi: "किसान का नाम", te: "రైతు పేరు" },
  fMobile: { en: "Mobile number", hi: "मोबाइल नंबर", te: "మొబైల్ నంబర్" },
  fVillage: { en: "Village", hi: "गाँव", te: "గ్రామం" },
  fSubHint: {
    en: "Called Mandal, Taluk, Tehsil or Block depending on the state",
    hi: "राज्य के अनुसार मंडल, तालुक, तहसील या ब्लॉक कहलाता है",
    te: "రాష్ట్రాన్ని బట్టి మండలం, తాలూకా, తహసీల్ లేదా బ్లాక్ అంటారు",
  },
  fDistrict: { en: "District", hi: "ज़िला", te: "జిల్లా" },
  fState: { en: "State", hi: "राज्य", te: "రాష్ట్రం" },
  fCrop: { en: "Crop", hi: "फसल", te: "పంట" },
  fCentre: { en: "Preferred procurement centre", hi: "पसंदीदा खरीद केंद्र", te: "ఇష్టపడే సేకరణ కేంద్రం" },

  /* ---------- identity ---------- */
  idSub: {
    en: "Verify the farmer's identity before procurement registration.",
    hi: "खरीद पंजीकरण से पहले किसान की पहचान सत्यापित करें।",
    te: "సేకరణ నమోదుకు ముందు రైతు గుర్తింపును ధృవీకరించండి.",
  },
  fDocType: { en: "Document type", hi: "दस्तावेज़ का प्रकार", te: "పత్రం రకం" },
  fDocNumber: { en: "Document number", hi: "दस्तावेज़ संख्या", te: "పత్రం సంఖ్య" },
  docAadhaar: { en: "Aadhaar", hi: "आधार", te: "ఆధార్" },
  docVoter: { en: "Voter ID", hi: "मतदाता पहचान पत्र", te: "ఓటరు ఐడీ" },
  docPan: { en: "PAN card", hi: "पैन कार्ड", te: "పాన్ కార్డ్" },
  docDl: { en: "Driving licence", hi: "ड्राइविंग लाइसेंस", te: "డ్రైవింగ్ లైసెన్స్" },
  uploadId: { en: "Upload identity proof", hi: "पहचान प्रमाण अपलोड करें", te: "గుర్తింపు రుజువు అప్‌లోడ్ చేయండి" },
  uploadedId: { en: "Identity document uploaded", hi: "पहचान दस्तावेज़ अपलोड हुआ", te: "గుర్తింపు పత్రం అప్‌లోడ్ అయింది" },

  /* ---------- land ---------- */
  landSub: {
    en: "Provide land ownership or cultivation details used for procurement eligibility and centre mapping.",
    hi: "खरीद पात्रता और केंद्र मैपिंग के लिए भूमि स्वामित्व या खेती का विवरण दें।",
    te: "సేకరణ అర్హత, కేంద్ర అనుసంధానం కోసం భూమి యాజమాన్యం లేదా సాగు వివరాలు ఇవ్వండి.",
  },
  fSurvey: { en: "Survey / Khasra number", hi: "सर्वे / खसरा संख्या", te: "సర్వే / ఖస్రా నంబర్" },
  fLandArea: { en: "Land area", hi: "भूमि क्षेत्रफल", te: "భూమి విస్తీర్ణం" },
  acres: { en: "acres", hi: "एकड़", te: "ఎకరాలు" },
  uploadLand: { en: "Upload land record", hi: "भूमि अभिलेख अपलोड करें", te: "భూమి రికార్డు అప్‌లోడ్ చేయండి" },
  uploadedLand: { en: "Land record uploaded", hi: "भूमि अभिलेख अपलोड हुआ", te: "భూమి రికార్డు అప్‌లోడ్ అయింది" },

  /* ---------- bank ---------- */
  bankSub: {
    en: "Add the bank account where procurement payments will be received.",
    hi: "वह बैंक खाता जोड़ें जिसमें खरीद भुगतान प्राप्त होगा।",
    te: "సేకరణ చెల్లింపులు జమ అయ్యే బ్యాంక్ ఖాతాను జోడించండి.",
  },
  fHolder: { en: "Account holder name", hi: "खाताधारक का नाम", te: "ఖాతాదారు పేరు" },
  fBank: { en: "Bank name", hi: "बैंक का नाम", te: "బ్యాంక్ పేరు" },
  fAccount: { en: "Account number", hi: "खाता संख्या", te: "ఖాతా సంఖ్య" },
  fAccountConfirm: { en: "Confirm account number", hi: "खाता संख्या की पुष्टि करें", te: "ఖాతా సంఖ్యను నిర్ధారించండి" },
  fIfsc: { en: "IFSC code", hi: "IFSC कोड", te: "IFSC కోడ్" },

  /* ---------- uploads ---------- */
  chooseFile: { en: "Choose file", hi: "फ़ाइल चुनें", te: "ఫైల్ ఎంచుకోండి" },
  useSample: { en: "Use sample document", hi: "नमूना दस्तावेज़ लें", te: "నమూనా పత్రం వాడండి" },
  uploading: { en: "Uploading…", hi: "अपलोड हो रहा है…", te: "అప్‌లోడ్ అవుతోంది…" },
  replace: { en: "Replace", hi: "बदलें", te: "మార్చండి" },
  fileHint: {
    en: "PDF, JPG or PNG · up to 5 MB · stays on this device",
    hi: "PDF, JPG या PNG · 5 MB तक · इसी डिवाइस पर रहती है",
    te: "PDF, JPG లేదా PNG · 5 MB వరకు · ఈ పరికరంలోనే ఉంటుంది",
  },
  prototypeVerification: { en: "Prototype verification", hi: "प्रोटोटाइप सत्यापन", te: "ప్రోటోటైప్ ధృవీకరణ" },

  /* ---------- status ---------- */
  statusPending: { en: "Pending", hi: "लंबित", te: "పెండింగ్" },
  statusReady: { en: "Ready", hi: "तैयार", te: "సిద్ధం" },
  statusVerified: { en: "Verified", hi: "सत्यापित", te: "ధృవీకరించబడింది" },
  statusSubmitted: { en: "Submitted", hi: "जमा किया गया", te: "సమర్పించబడింది" },
  statusAdded: { en: "Added", hi: "जोड़ा गया", te: "జోడించబడింది" },

  /* ---------- footer ---------- */
  maskNote: {
    en: "Sensitive information is masked in this prototype.",
    hi: "इस प्रोटोटाइप में संवेदनशील जानकारी छिपाई गई है।",
    te: "ఈ ప్రోటోటైప్‌లో సున్నితమైన సమాచారం మాస్క్ చేయబడింది.",
  },
  archLabel: { en: "Prototype security architecture", hi: "प्रोटोटाइप सुरक्षा आर्किटेक्चर", te: "ప్రోటోటైప్ భద్రతా ఆర్కిటెక్చర్" },
  archNote: {
    en: "Production deployment will use secure authentication, encryption, role-based access and audit logging.",
    hi: "उत्पादन तैनाती में सुरक्षित प्रमाणीकरण, एन्क्रिप्शन, भूमिका-आधारित पहुँच और ऑडिट लॉगिंग का उपयोग होगा।",
    te: "ఉత్పత్తి అమలులో సురక్షిత ప్రామాణీకరణ, ఎన్‌క్రిప్షన్, పాత్ర ఆధారిత ప్రవేశం, ఆడిట్ లాగింగ్ ఉపయోగించబడతాయి.",
  },
  submit: { en: "Submit for verification", hi: "सत्यापन के लिए जमा करें", te: "ధృవీకరణకు సమర్పించండి" },
  verifying: { en: "Verifying…", hi: "सत्यापन हो रहा है…", te: "ధృవీకరిస్తోంది…" },
  needsAttention: {
    en: "{n} fields need attention",
    hi: "{n} फ़ील्ड पर ध्यान दें",
    te: "{n} ఫీల్డ్‌లను సరిచేయాలి",
  },

  /* ---------- completion ---------- */
  statusHeading: { en: "Registration status", hi: "पंजीकरण की स्थिति", te: "నమోదు స్థితి" },
  completeTitle: { en: "Farmer registration completed", hi: "किसान पंजीकरण पूर्ण हुआ", te: "రైతు నమోదు పూర్తయింది" },
  completeSub: {
    en: "A verified, procurement-ready farmer profile.",
    hi: "एक सत्यापित, खरीद के लिए तैयार किसान प्रोफ़ाइल।",
    te: "ధృవీకరించబడిన, సేకరణకు సిద్ధమైన రైతు ప్రొఫైల్.",
  },
  demoComplete: {
    en: "Demo verification complete — no government or bank system was contacted.",
    hi: "डेमो सत्यापन पूर्ण — किसी सरकारी या बैंक प्रणाली से संपर्क नहीं किया गया।",
    te: "డెమో ధృవీకరణ పూర్తి — ఏ ప్రభుత్వ లేదా బ్యాంక్ వ్యవస్థనూ సంప్రదించలేదు.",
  },
  farmerId: { en: "Farmer ID", hi: "किसान आईडी", te: "రైతు ఐడీ" },
  nextMapped: { en: "Centre mapped", hi: "केंद्र मैप हुआ", te: "కేంద్రం అనుసంధానమైంది" },
  nextBook: { en: "Book procurement slot", hi: "खरीद स्लॉट बुक करें", te: "సేకరణ స్లాట్ బుక్ చేయండి" },
  edit: { en: "Edit registration", hi: "पंजीकरण संपादित करें", te: "నమోదును సవరించండి" },

  /* ---------- validation ---------- */
  errRequired: { en: "Required", hi: "आवश्यक", te: "తప్పనిసరి" },
  errMobile: {
    en: "Enter a 10-digit Indian mobile number starting 6–9",
    hi: "6–9 से शुरू होने वाला 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें",
    te: "6–9తో మొదలయ్యే 10 అంకెల భారతీయ మొబైల్ నంబర్ ఇవ్వండి",
  },
  errAadhaar: {
    en: "Aadhaar is 12 digits and does not start with 0 or 1",
    hi: "आधार 12 अंकों का होता है और 0 या 1 से शुरू नहीं होता",
    te: "ఆధార్ 12 అంకెలు, 0 లేదా 1తో మొదలవదు",
  },
  errVoter: {
    en: "Format: 3 letters followed by 7 digits",
    hi: "प्रारूप: 3 अक्षर और फिर 7 अंक",
    te: "ఫార్మాట్: 3 అక్షరాలు, తర్వాత 7 అంకెలు",
  },
  errPan: { en: "Format: ABCDE1234F", hi: "प्रारूप: ABCDE1234F", te: "ఫార్మాట్: ABCDE1234F" },
  errDl: {
    en: "Enter a valid licence number",
    hi: "मान्य लाइसेंस संख्या दर्ज करें",
    te: "సరైన లైసెన్స్ సంఖ్య ఇవ్వండి",
  },
  errSurvey: {
    en: "Letters, numbers, / and - only",
    hi: "केवल अक्षर, अंक, / और -",
    te: "అక్షరాలు, అంకెలు, / మరియు - మాత్రమే",
  },
  errArea: {
    en: "Enter an area greater than 0",
    hi: "0 से अधिक क्षेत्रफल दर्ज करें",
    te: "0 కంటే ఎక్కువ విస్తీర్ణం ఇవ్వండి",
  },
  errAccount: {
    en: "Account numbers are 9 to 18 digits",
    hi: "खाता संख्या 9 से 18 अंकों की होती है",
    te: "ఖాతా సంఖ్య 9 నుండి 18 అంకెలు",
  },
  errMatch: {
    en: "Account numbers do not match",
    hi: "खाता संख्याएँ मेल नहीं खातीं",
    te: "ఖాతా సంఖ్యలు సరిపోలలేదు",
  },
  errIfsc: {
    en: "IFSC is 11 characters, e.g. SBIN0001234",
    hi: "IFSC 11 अक्षरों का होता है, जैसे SBIN0001234",
    te: "IFSC 11 అక్షరాలు, ఉదా. SBIN0001234",
  },
  errUpload: {
    en: "Upload a document to continue",
    hi: "आगे बढ़ने के लिए दस्तावेज़ अपलोड करें",
    te: "కొనసాగడానికి పత్రం అప్‌లోడ్ చేయండి",
  },
  errFileType: {
    en: "Use a PDF, JPG or PNG file",
    hi: "PDF, JPG या PNG फ़ाइल चुनें",
    te: "PDF, JPG లేదా PNG ఫైల్ వాడండి",
  },
  errFileSize: {
    en: "File is larger than 5 MB",
    hi: "फ़ाइल 5 MB से बड़ी है",
    te: "ఫైల్ 5 MB కంటే పెద్దది",
  },
} satisfies Record<string, Localized>;

export type RegCopyKey = keyof typeof REG;
