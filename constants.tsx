
import React from 'react';
import { IndustryPreset } from './types';

export const INDUSTRY_PRESETS: IndustryPreset[] = [
  {
    id: 'general',
    name: 'General Support',
    icon: '🌐',
    description: 'All-purpose multilingual assistance.',
    systemInstruction: 'You are a general-purpose multilingual assistant. Automatically detect the user\'s language and respond in the same language. Be helpful and professional.'
  },
  {
    id: 'banking',
    name: 'Banking & Finance',
    icon: '🏦',
    description: 'Support for transactions and financial queries.',
    systemInstruction: 'You are a professional banking assistant. Assist with transaction queries, account information, and financial services. Detect the user\'s language automatically and reply in that language.'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🏥',
    description: 'Patient consultation and health info.',
    systemInstruction: 'You are a helpful healthcare assistant. Provide general health information, appointment scheduling guidance, and patient support. Always detect the user\'s language and reply in it. Note: Advise seeking professional medical help for emergencies.'
  },
  {
    id: 'education',
    name: 'Education',
    icon: '🎓',
    description: 'E-learning and student support.',
    systemInstruction: 'You are an educational support bot. Help students with course information, e-learning guidance, and academic queries. Detect the user\'s language and respond accordingly.'
  },
  {
    id: 'governance',
    name: 'E-Governance',
    icon: '🏛️',
    description: 'Citizen assistance for government services.',
    systemInstruction: 'You are an e-governance assistant. Help citizens navigate public information systems, service portals, and government documentation. Automatically detect and reply in the user\'s native language.'
  }
];
