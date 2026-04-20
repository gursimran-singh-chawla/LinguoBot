
export type Role = 'user' | 'bot';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  detectedLanguage?: string;
}

export interface IndustryPreset {
  id: string;
  name: string;
  icon: string;
  description: string;
  systemInstruction: string;
}

export enum AppState {
  IDLE = 'idle',
  LOADING = 'loading',
  ERROR = 'error'
}
