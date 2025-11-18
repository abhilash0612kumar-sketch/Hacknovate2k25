export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface SymptomOption {
  text: string;
  icon?: string; // An identifier for the icon
}

export interface SummaryData {
  prognosis: {
    potentialIssue: string;
    outlook: string;
    recovery: string;
    specialist: string;
    complications: string;
    improvement: string;
    criticalFinding?: string;
  };
  medication: {
    disclaimer: string;
    primary: string;
  };
  diet: {
    recommendations: string;
    prefer: string;
    avoid: string;
    lifestyle: string;
  };
}

export interface Message {
  role: Role;
  text: string;
  options?: SymptomOption[];
  summary?: SummaryData;
  imageUrl?: string;
}

export enum AppMode {
  WELCOME,
  USER_DETAILS,
  SYMPTOM_CHECKER,
  LAB_ANALYZER,
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Prefer not to say'
}