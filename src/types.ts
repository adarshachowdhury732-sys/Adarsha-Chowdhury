export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'text' | 'other';
  mimeType: string;
  data: string; // Base64 data string
  size?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  attachments?: Attachment[];
  suggestions?: string[]; // Analytical suggestions or follow-up questions
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

export interface PresetPrompt {
  id: string;
  label: string;
  prompt: string;
  icon: string;
  subject: string;
}
