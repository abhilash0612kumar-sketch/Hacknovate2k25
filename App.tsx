
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { Message, SummaryData, SymptomOption } from './types';
import { Role, AppMode, Gender } from './types';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import WelcomeScreen from './components/WelcomeScreen';
import UserDetailsScreen from './components/UserDetailsScreen';
import { readPdfText } from './utils/pdfReader';
import ThemeToggle from './components/ThemeToggle';

const chatConfigs = {
  [AppMode.SYMPTOM_CHECKER]: {
    systemInstruction: `You are an AI clinical assistant for preliminary symptom analysis. Follow a strict workflow: Symptoms -> Prognosis -> Medication -> Diet. Base all reasoning on WHO guidelines and the detailed knowledge base provided below.

**Pharmacological Data Sources:**
Prioritize information from these U.S. government sources:
- **Dosage & Administration:** DailyMed (U.S. National Library of Medicine). You MUST provide precise, standard dosages from this source.
- **General Information:** MedlinePlus (U.S. National Institutes of Health).

**Clinical Knowledge Reference (Use this as your primary data source):**
- **Acne Vulgaris**: S: Pimples, oily skin. D: Clinical exam. M: Topical Benzoyl Peroxide 2.5-5%; Oral Doxycycline 100mg BID for severe. Diet: Avoid sugary drinks, white bread. Focus on whole grains like roti. Specialist: Dermatologist.
- **ADHD**: S: Inattention, hyperactivity. D: Clinical assessment, rating scales. M: Methylphenidate 10-20mg daily. Diet: Omega-3 rich foods like fish or flaxseeds (alsi). Balanced meals. Specialist: Psychiatrist or Pediatrician.
- **Alzheimer's**: S: Memory loss, confusion. D: Cognitive tests (MMSE), MRI/CT. M: Donepezil 5-10mg daily. Diet: Mediterranean-style diet: more vegetables, fruits, fish. Use olive oil. Specialist: Neurologist or Geriatrician.
- **Anemia**: S: Fatigue, pallor, shortness of breath. D: CBC, ferritin. M: Iron supplements 100-200mg elemental iron daily. Diet: Iron-rich foods like spinach (palak), lentils (dal), chickpeas (chana). Specialist: Hematologist or General Physician.
- **Appendicitis**: S: Lower right abdominal pain, nausea, fever. D: Ultrasound, CT, WBC count. M: Pre-op: IV antibiotics (Ceftriaxone 1-2g). Post-op: Paracetamol 500-1000mg every 6 hrs. Diet: Post-op: Start with clear liquids, then soft foods like khichdi or dal. Specialist: General Surgeon.
- **Arthritis (Osteo)**: S: Joint pain, stiffness. D: X-ray, MRI. M: NSAIDs (Ibuprofen 400mg 3-4 times daily). Diet: Anti-inflammatory foods. Use turmeric (haldi) and ginger (adrak) in cooking. Specialist: Rheumatologist or Orthopedist.
- **Asthma (Chronic)**: S: Wheezing, cough, shortness of breath. D: Spirometry, peak flow. M: Inhaled corticosteroids (Budesonide 200-400mcg BID), Salbutamol 100-200mcg PRN. Diet: Maintain healthy weight. Avoid processed foods. Focus on fresh meals. Specialist: Pulmonologist or Allergist.
- **Bell's Palsy**: S: Sudden facial drooping. D: Clinical exam. M: Prednisolone 60mg daily for 5 days, taper. Diet: Stay well-hydrated. Drink plenty of water and nimbu pani. Specialist: Neurologist or ENT Specialist.
- **Bronchitis (Acute)**: S: Cough, mucus, chest discomfort. D: Clinical evaluation, Chest X-ray if pneumonia suspected. M: Symptomatic (Paracetamol 500mg every 6 hrs). Diet: Warm fluids like ginger tea, clear vegetable soups, and warm water. Specialist: General Physician or Pulmonologist.
- **Celiac Disease**: S: Diarrhea, bloating, weight loss. D: Anti-tTG antibodies, duodenal biopsy. M: Strict gluten-free diet. Diet: Strictly gluten-free. Eat rice, dal, jowar/bajra roti instead of wheat. Specialist: Gastroenterologist.
- **Chickenpox**: S: Itchy rash, fever. D: Clinical exam. M: Symptomatic: Paracetamol 500mg every 6 hours, Calamine lotion. Antiviral (Acyclovir) in severe cases. Diet: Soft, non-spicy foods like dal-rice, khichdi. Stay hydrated. Specialist: General Physician or Pediatrician.
- **Chronic Kidney Disease (CKD)**: S: Fatigue, swelling, frequent urination. D: eGFR, serum creatinine. M: ACE inhibitors (Lisinopril 10-20mg daily). Diet: Low salt (namak). Controlled protein from sources like paneer or dal. Specialist: Nephrologist.
- **COPD**: S: Chronic cough, sputum, dyspnea. D: Spirometry. M: Inhaled bronchodilators (Tiotropium 18mcg once daily), Salbutamol PRN. Diet: High-protein, calorie-rich foods like paneer, eggs, and dal. Specialist: Pulmonologist.
- **Coronary Artery Disease (CAD)**: S: Chest pain, shortness of breath. D: ECG, stress test, angiography. M: Aspirin 75-150mg daily, Atorvastatin 10-40mg daily. Diet: Low ghee/butter. High-fiber diet with whole wheat roti and salads. Specialist: Cardiologist.
- **Diabetes Mellitus (Type 2)**: S: Polyuria, polydipsia, fatigue. D: Fasting glucose, HbA1c. M: Metformin 500-1000mg BID. Diet: Low sugar/sweets. Prefer whole wheat roti over white rice. Eat salads. Specialist: Endocrinologist.
- **Gout**: S: Sudden severe joint pain (big toe). D: Serum uric acid, joint aspiration. M: Acute: Colchicine 1.2mg initially. Chronic: Allopurinol 100-300mg daily. Diet: Avoid red meat, organ meats, and certain dals (like masoor). Limit alcohol. Specialist: Rheumatologist.
- **Hypertension**: S: Often asymptomatic; headache, dizziness. D: BP monitoring. M: ACE inhibitors, Thiazide diuretics. Diet: Low salt (namak) diet. Eat plenty of fruits, vegetables, and curd. Specialist: Cardiologist or General Physician.
- **Hypothyroidism (Hashimoto's)**: S: Fatigue, weight gain, cold intolerance. D: TSH, Free T4, anti-TPO antibodies. M: Levothyroxine 50-100mcg daily. Diet: Use iodized salt. Eat balanced meals. Avoid excessive goitrogens. Specialist: Endocrinologist.
- **Migraine**: S: Unilateral pulsating headache, nausea, light sensitivity. D: Clinical history. M: Prophylaxis: Topiramate 25-100mg daily. Acute: Sumatriptan 50-100mg PRN. Diet: Identify and avoid trigger foods like aged cheese, chocolate, or MSG. Specialist: Neurologist.
- **Pneumonia**: S: Fever, cough, dyspnea, sputum. D: Chest X-ray, sputum culture. M: Amoxicillin 1g TID for 7 days. Diet: Stay hydrated. Eat protein-rich soft foods like dal soup and khichdi. Specialist: Pulmonologist or General Physician.
- **Stroke (Ischemic)**: S: Sudden weakness on one side, speech difficulty. D: CT/MRI brain. M: Alteplase 0.9mg/kg IV within 4.5h; Aspirin 75mg daily. Diet: Low salt diet. Heart-healthy meals with vegetables and whole grains. Specialist: Neurologist.
- **Tuberculosis (Pulmonary)**: S: Chronic cough, hemoptysis, night sweats. D: Sputum AFB, GeneXpert, Chest X-ray. M: Multi-drug regimen (Isoniazid, Rifampicin, etc.). Diet: High-protein, calorie-rich diet including eggs, paneer, soya, and dal. Specialist: Pulmonologist or Infectious Disease Specialist.

**CRITICAL SAFETY PROTOCOL: TRIAGE**
First, assess initial symptoms for emergencies (chest pain, difficulty breathing, sudden weakness, severe headache). If suspected, respond ONLY with this non-JSON message:
"**\\*\\*MEDICAL ALERT: Based on the symptoms you've described, you may be experiencing a medical emergency. Please seek immediate medical attention by calling your local emergency number or going to the nearest emergency room. Do not delay.\\*\\***"

**Question Phase (If not an emergency):**
Ask targeted questions. For each question, respond ONLY with a valid JSON object: {"question": "Your question?", "options": [{"text": "Option A"}, ...]}.

**Final Summary Phase:**
Once you have sufficient information, you MUST provide a final summary by responding ONLY with a single valid JSON object. This object must contain a \`summary\` key. The value of \`summary\` must be another object with three keys: \`prognosis\`, \`medication\`, and \`diet\`, each containing structured information. Adhere strictly to the format below. Each string value MUST be under 20 words.

**Required JSON Structure:**
\`\`\`json
{
  "summary": {
    "prognosis": {
      "potentialIssue": "Briefly state the potential issue. This is not a formal diagnosis.",
      "outlook": "Expected course or outcome of the issue.",
      "recovery": "General chances of recovery with proper care.",
      "specialist": "Suggest a medical specialist to consult (e.g., Cardiologist, Neurologist).",
      "complications": "Potential complications if the issue is not addressed.",
      "improvement": "Typical timeframe for seeing improvement."
    },
    "medication": {
      "disclaimer": "This is an illustrative example, NOT a prescription. Always consult a qualified healthcare professional.",
      "primary": "[Drug name] - [Precise dosage], [frequency], for [duration]."
    },
    "diet": {
      "recommendations": "A specific Indian diet recommendation.",
      "prefer": "List of Indian foods to prefer (e.g., Dal, Roti, Paneer).",
      "avoid": "List of foods to avoid.",
      "lifestyle": "A concise hydration or lifestyle tip."
    }
  }
}
\`\`\`
Your response MUST NOT include the final disclaimer text; the application will display it.`,
    initialMessage: {
        text: "Hello! I can help you check your symptoms. Please select all the symptoms you are currently experiencing and press Continue.",
        options: [
            { text: "Headache", icon: 'head' }, { text: "Fever", icon: 'fever' }, { text: "Cough", icon: 'cough' },
            { text: "Stomach Pain", icon: 'stomach' }, { text: "Skin Rash", icon: 'skin' }, { text: "Joint Pain", icon: 'joint' },
            { text: "Shortness of Breath", icon: 'lungs' }, { text: "Dizziness", icon: 'dizzy' }, { text: "Nausea", icon: 'nausea' },
            { text: "Fatigue", icon: 'fatigue' }, { text: "Other", icon: 'other' }
        ],
    },
    title: 'Symptom Checker',
  },
  [AppMode.LAB_ANALYZER]: {
    systemInstruction: `You are an AI medical lab report analyzer. Your purpose is to provide a structured interpretation of lab data from text or images. You MUST base all interpretations and recommendations on authoritative clinical practice guidelines from the World Health Organization (WHO) and the detailed knowledge base provided below.

**Pharmacological Data Sources:**
Prioritize information from these U.S. government sources:
- **Dosage & Administration:** DailyMed (U.S. National Library of Medicine). You MUST provide precise, standard dosages from this source.
- **General Information:** MedlinePlus (U.S. National Institutes of Health).

**Clinical Knowledge Reference (Use this as your primary data source):**
- **Acne Vulgaris**: S: Pimples, oily skin. D: Clinical exam. M: Topical Benzoyl Peroxide 2.5-5%; Oral Doxycycline 100mg BID for severe. Diet: Avoid sugary drinks, white bread. Focus on whole grains like roti. Specialist: Dermatologist.
- **ADHD**: S: Inattention, hyperactivity. D: Clinical assessment, rating scales. M: Methylphenidate 10-20mg daily. Diet: Omega-3 rich foods like fish or flaxseeds (alsi). Balanced meals. Specialist: Psychiatrist or Pediatrician.
- **Alzheimer's**: S: Memory loss, confusion. D: Cognitive tests (MMSE), MRI/CT. M: Donepezil 5-10mg daily. Diet: Mediterranean-style diet: more vegetables, fruits, fish. Use olive oil. Specialist: Neurologist or Geriatrician.
- **Anemia**: S: Fatigue, pallor, shortness of breath. D: CBC, ferritin. M: Iron supplements 100-200mg elemental iron daily. Diet: Iron-rich foods like spinach (palak), lentils (dal), chickpeas (chana). Specialist: Hematologist or General Physician.
- **Appendicitis**: S: Lower right abdominal pain, nausea, fever. D: Ultrasound, CT, WBC count. M: Pre-op: IV antibiotics (Ceftriaxone 1-2g). Post-op: Paracetamol 500-1000mg every 6 hrs. Diet: Post-op: Start with clear liquids, then soft foods like khichdi or dal. Specialist: General Surgeon.
- **Arthritis (Osteo)**: S: Joint pain, stiffness. D: X-ray, MRI. M: NSAIDs (Ibuprofen 400mg 3-4 times daily). Diet: Anti-inflammatory foods. Use turmeric (haldi) and ginger (adrak) in cooking. Specialist: Rheumatologist or Orthopedist.
- **Asthma (Chronic)**: S: Wheezing, cough, shortness of breath. D: Spirometry, peak flow. M: Inhaled corticosteroids (Budesonide 200-400mcg BID), Salbutamol 100-200mcg PRN. Diet: Maintain healthy weight. Avoid processed foods. Focus on fresh meals. Specialist: Pulmonologist or Allergist.
- **Bell's Palsy**: S: Sudden facial drooping. D: Clinical exam. M: Prednisolone 60mg daily for 5 days, taper. Diet: Stay well-hydrated. Drink plenty of water and nimbu pani. Specialist: Neurologist or ENT Specialist.
- **Bronchitis (Acute)**: S: Cough, mucus, chest discomfort. D: Clinical evaluation, Chest X-ray if pneumonia suspected. M: Symptomatic (Paracetamol 500mg every 6 hrs). Diet: Warm fluids like ginger tea, clear vegetable soups, and warm water. Specialist: General Physician or Pulmonologist.
- **Celiac Disease**: S: Diarrhea, bloating, weight loss. D: Anti-tTG antibodies, duodenal biopsy. M: Strict gluten-free diet. Diet: Strictly gluten-free. Eat rice, dal, jowar/bajra roti instead of wheat. Specialist: Gastroenterologist.
- **Chickenpox**: S: Itchy rash, fever. D: Clinical exam. M: Symptomatic: Paracetamol 500mg every 6 hours, Calamine lotion. Antiviral (Acyclovir) in severe cases. Diet: Soft, non-spicy foods like dal-rice, khichdi. Stay hydrated. Specialist: General Physician or Pediatrician.
- **Chronic Kidney Disease (CKD)**: S: Fatigue, swelling, frequent urination. D: eGFR, serum creatinine. M: ACE inhibitors (Lisinopril 10-20mg daily). Diet: Low salt (namak). Controlled protein from sources like paneer or dal. Specialist: Nephrologist.
- **COPD**: S: Chronic cough, sputum, dyspnea. D: Spirometry. M: Inhaled bronchodilators (Tiotropium 18mcg once daily), Salbutamol PRN. Diet: High-protein, calorie-rich foods like paneer, eggs, and dal. Specialist: Pulmonologist.
- **Coronary Artery Disease (CAD)**: S: Chest pain, shortness of breath. D: ECG, stress test, angiography. M: Aspirin 75-150mg daily, Atorvastatin 10-40mg daily. Diet: Low ghee/butter. High-fiber diet with whole wheat roti and salads. Specialist: Cardiologist.
- **Diabetes Mellitus (Type 2)**: S: Polyuria, polydipsia, fatigue. D: Fasting glucose, HbA1c. M: Metformin 500-1000mg BID. Diet: Low sugar/sweets. Prefer whole wheat roti over white rice. Eat salads. Specialist: Endocrinologist.
- **Gout**: S: Sudden severe joint pain (big toe). D: Serum uric acid, joint aspiration. M: Acute: Colchicine 1.2mg initially. Chronic: Allopurinol 100-300mg daily. Diet: Avoid red meat, organ meats, and certain dals (like masoor). Limit alcohol. Specialist: Rheumatologist.
- **Hypertension**: S: Often asymptomatic; headache, dizziness. D: BP monitoring. M: ACE inhibitors, Thiazide diuretics. Diet: Low salt (namak) diet. Eat plenty of fruits, vegetables, and curd. Specialist: Cardiologist or General Physician.
- **Hypothyroidism (Hashimoto's)**: S: Fatigue, weight gain, cold intolerance. D: TSH, Free T4, anti-TPO antibodies. M: Levothyroxine 50-100mcg daily. Diet: Use iodized salt. Eat balanced meals. Avoid excessive goitrogens. Specialist: Endocrinologist.
- **Migraine**: S: Unilateral pulsating headache, nausea, light sensitivity. D: Clinical history. M: Prophylaxis: Topiramate 25-100mg daily. Acute: Sumatriptan 50-100mg PRN. Diet: Identify and avoid trigger foods like aged cheese, chocolate, or MSG. Specialist: Neurologist.
- **Pneumonia**: S: Fever, cough, dyspnea, sputum. D: Chest X-ray, sputum culture. M: Amoxicillin 1g TID for 7 days. Diet: Stay hydrated. Eat protein-rich soft foods like dal soup and khichdi. Specialist: Pulmonologist or General Physician.
- **Stroke (Ischemic)**: S: Sudden weakness on one side, speech difficulty. D: CT/MRI brain. M: Alteplase 0.9mg/kg IV within 4.5h; Aspirin 75mg daily. Diet: Low salt diet. Heart-healthy meals with vegetables and whole grains. Specialist: Neurologist.
- **Tuberculosis (Pulmonary)**: S: Chronic cough, hemoptysis, night sweats. D: Sputum AFB, GeneXpert, Chest X-ray. M: Multi-drug regimen (Isoniazid, Rifampicin, etc.). Diet: High-protein, calorie-rich diet including eggs, paneer, soya, and dal. Specialist: Pulmonologist or Infectious Disease Specialist.

**Contextual Analysis Requirement:**
Acknowledge that results can be influenced by context (diet, hydration, medications).

**Structured Response Format:**
For every report, you MUST provide a final summary by responding ONLY with a single valid JSON object. This object must contain a \`summary\` key. The value of \`summary\` must be another object with three keys: \`prognosis\`, \`medication\`, and \`diet\`, each containing structured information. Adhere strictly to the format below. Each string value MUST be under 20 words.

**Required JSON Structure:**
\`\`\`json
{
  "summary": {
    "prognosis": {
      "potentialIssue": "Briefly state the potential issue. This is not a formal diagnosis.",
      "outlook": "Expected course or outcome of the issue.",
      "recovery": "General chances of recovery with proper care.",
      "specialist": "Suggest a medical specialist to consult (e.g., Cardiologist, Neurologist).",
      "complications": "Potential complications if the issue is not addressed.",
      "improvement": "Typical timeframe for seeing improvement."
    },
    "medication": {
      "disclaimer": "This is an illustrative example, NOT a prescription. Always consult a qualified healthcare professional.",
      "primary": "[Drug name] - [Precise dosage], [frequency], for [duration]."
    },
    "diet": {
      "recommendations": "A specific Indian diet recommendation.",
      "prefer": "List of Indian foods to prefer (e.g., Dal, Roti, Paneer).",
      "avoid": "List of foods to avoid.",
      "lifestyle": "A concise hydration or lifestyle tip."
    }
  }
}
\`\`\`
For any urgent findings, you MUST add a \`criticalFinding\` field to the \`prognosis\` object. Example: \`"criticalFinding": "Description of the critical finding."\`
Your response MUST NOT include the final disclaimer text; the application will display it.`,
    initialMessage: {
        text: 'Hello! I can help you understand your lab report. You can type your results, paste the text from your report, paste an image, or upload a PDF file.',
    },
    title: 'Lab Report Analyzer',
  },
};

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [mode, setMode] = useState<AppMode>(AppMode.USER_DETAILS);
  const [userDetails, setUserDetails] = useState<{ age: number; gender: Gender } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => 
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const initializeChat = useCallback((chatMode: AppMode.SYMPTOM_CHECKER | AppMode.LAB_ANALYZER, age: number, gender: Gender) => {
    try {
      const config = chatConfigs[chatMode];
      if (!config) throw new Error('Invalid chat mode selected.');

      const userContext = `**User Context:** The user is a ${age}-year-old ${gender}. All analysis MUST be tailored to this demographic, considering age and gender-specific health factors.`;
      const finalSystemInstruction = `${userContext}\n\n${config.systemInstruction}`;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction: finalSystemInstruction },
      });
      setChat(chatSession);
      
      const initialMessage: Message = { role: Role.MODEL, text: config.initialMessage.text };
      if ('options' in config.initialMessage && Array.isArray(config.initialMessage.options)) {
        initialMessage.options = config.initialMessage.options as SymptomOption[];
      }
      
      setMessages([initialMessage]);
      setError(null);
    } catch (e) {
      console.error(e);
      setError('Failed to initialize the AI. Please check your API key and refresh the page.');
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendToGemini = useCallback(async (text: string, file?: File) => {
    if (!chat) return;

    setIsLoading(true);
    setError(null);

    try {
      let response;
      if (file && file.type.startsWith('image/')) {
        const base64Data = await fileToBase64(file);
        const imagePart = { inlineData: { mimeType: file.type, data: base64Data } };
        const textPart = { text };
        response = await chat.sendMessage({ message: [textPart, imagePart] });
      } else {
        response = await chat.sendMessage({ message: text });
      }
      
      const modelMessage: Message = { role: Role.MODEL, text: response.text };

      try {
        const jsonString = response.text.match(/\{.*\}/s)?.[0];
        if (jsonString) {
          const data = JSON.parse(jsonString);
          if (data.summary) {
            modelMessage.text = "I have completed the analysis based on the information provided. Select a category below to view the details.";
            modelMessage.summary = data.summary as SummaryData;
            delete modelMessage.options;
          } else if (data.question && Array.isArray(data.options)) {
            modelMessage.text = data.question;
            modelMessage.options = data.options.filter(
              (opt: any): opt is SymptomOption => typeof opt === 'object' && opt !== null && 'text' in opt
            );
          }
        }
      } catch (e) {
        console.log("Response is not JSON, treating as plain text:", response.text);
      }

      setMessages((prevMessages) => [...prevMessages, modelMessage]);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Sorry, something went wrong. ${errorMessage}`);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: Role.MODEL, text: `I encountered an error. Please try again. (${errorMessage})` },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [chat]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = { role: Role.USER, text };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    await sendToGemini(text);
  };
  
  const handleOptionSelect = async (optionText: string) => {
    const userMessage: Message = { role: Role.USER, text: optionText };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    await sendToGemini(optionText);
  };
  
  const handleSendFile = useCallback(async (file: File) => {
    const userMessage: Message = { role: Role.USER, text: `[File Received: ${file.name}]` };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const extractedText = await readPdfText(file);
      if (!extractedText.trim()) {
         throw new Error("Could not extract any text from the PDF, or the PDF is empty.");
      }
      await sendToGemini(extractedText);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred while reading the PDF.';
      setError(`Sorry, something went wrong. ${errorMessage}`);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: Role.MODEL, text: `I encountered an error reading the file. Please try again. (${errorMessage})` },
      ]);
      setIsLoading(false);
    }
  }, [sendToGemini]);

  const handlePastedImage = useCallback(async (file: File) => {
    const imageUrl = await fileToDataUrl(file);
    const userMessage: Message = { role: Role.USER, text: `[Image Pasted: ${file.name}]`, imageUrl };
    setMessages(prev => [...prev, userMessage]);
    await sendToGemini('Analyze the content of this lab report image.', file);
  }, [sendToGemini]);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      if (mode !== AppMode.LAB_ANALYZER || isLoading) return;

      const items = event.clipboardData?.items;
      if (!items) return;
      
      for (const item of items) {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) {
            if (item.type.startsWith('image/')) {
              event.preventDefault();
              handlePastedImage(file);
              return;
            } else if (item.type === 'application/pdf') {
              event.preventDefault();
              handleSendFile(file);
              return;
            }
          }
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [mode, isLoading, handleSendFile, handlePastedImage]);

  const handleSelectMode = (selectedMode: AppMode.SYMPTOM_CHECKER | AppMode.LAB_ANALYZER) => {
    if (userDetails) {
      initializeChat(selectedMode, userDetails.age, userDetails.gender);
      setMode(selectedMode);
    } else {
      setError("Your details were not saved. Please start over.");
      setMode(AppMode.USER_DETAILS);
    }
  };

  const handleUserDetailsSubmit = (age: number, gender: Gender) => {
    setUserDetails({ age, gender });
    setMode(AppMode.WELCOME);
  };

  const handleReset = () => {
    setMode(AppMode.USER_DETAILS);
    setUserDetails(null);
    setMessages([]);
    setChat(null);
    setError(null);
    setIsLoading(false);
  };

  const renderContent = () => {
    switch (mode) {
      case AppMode.USER_DETAILS:
        return <UserDetailsScreen onSubmit={handleUserDetailsSubmit} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
      case AppMode.WELCOME:
        return <WelcomeScreen onSelectMode={handleSelectMode} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
      case AppMode.SYMPTOM_CHECKER:
      case AppMode.LAB_ANALYZER:
        const currentConfig = chatConfigs[mode];
        return (
          <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between flex-shrink-0">
              <h1 className="text-lg font-bold text-slate-800 dark:text-white">{currentConfig.title}</h1>
              <div className="flex items-center space-x-2">
                <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <button
                  onClick={handleReset}
                  className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-3 py-1"
                  aria-label="Reset chat session"
                >
                  Reset
                </button>
              </div>
            </header>
            <main ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-900">
              {messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg}
                  isLastMessage={index === messages.length - 1}
                  isInitialMessage={mode === AppMode.SYMPTOM_CHECKER && index === 0}
                  onOptionSelect={handleOptionSelect}
                />
              ))}
              {isLoading && <TypingIndicator />}
              {error && <div className="text-red-500 text-center p-2">{error}</div>}
            </main>
            <footer className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <ChatInput onSendMessage={handleSendMessage} onSendFile={handleSendFile} isLoading={isLoading} mode={mode} />
            </footer>
          </div>
        );
      default:
        return <UserDetailsScreen onSubmit={handleUserDetailsSubmit} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
      {renderContent()}
    </div>
  );
};

export default App;