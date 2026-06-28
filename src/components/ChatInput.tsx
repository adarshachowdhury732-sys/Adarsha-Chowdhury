import React, { useRef, useState, useEffect } from 'react';
import { Paperclip, Send, X, Mic, MicOff, AlertCircle, Trash2 } from 'lucide-react';
import { Attachment } from '../types';

interface ChatInputProps {
  onSendMessage: (content: string, attachments: Attachment[]) => void;
  isGenerating: boolean;
  themePreset: 'rose' | 'tulip' | 'dandelion';
  currentModel: string;
  onChangeModel: (model: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isGenerating,
  themePreset,
  currentModel,
  onChangeModel,
}) => {
  const [inputText, setInputText] = useState('');
  const [stagedFiles, setStagedFiles] = useState<Attachment[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-grow textarea height as content expands
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [inputText]);

  // Removed auto-focus to prevent mobile keyboard from popping up unexpectedly

  // Setup Browser Native Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? prev + ' ' + transcript : transcript));
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error", e);
        setErrorMessage("Speech recognition failed or permission denied.");
        setTimeout(() => setErrorMessage(''), 3000);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const container = document.getElementById('model-selector-container');
      const dropdown = document.getElementById('model-dropdown');
      if (container && !container.contains(event.target as Node) && dropdown) {
        dropdown.classList.add('hidden');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleVoice = () => {
    if (!recognitionRef.current) {
      setErrorMessage("Speech recognition is not supported on this browser.");
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // Convert files to base64 attachment format
  const processFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      // Constraints: restrict files over 15MB
      if (file.size > 15 * 1024 * 1024) {
        setErrorMessage(`File ${file.name} is too large. Max size is 15MB.`);
        setTimeout(() => setErrorMessage(''), 4000);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string;
        
        let type: 'image' | 'pdf' | 'text' | 'other' = 'other';
        if (file.type.startsWith('image/')) {
          type = 'image';
        } else if (file.type === 'application/pdf') {
          type = 'pdf';
        } else if (
          file.type.startsWith('text/') || 
          file.name.endsWith('.js') || 
          file.name.endsWith('.ts') || 
          file.name.endsWith('.tsx') || 
          file.name.endsWith('.py') || 
          file.name.endsWith('.json') || 
          file.name.endsWith('.csv')
        ) {
          type = 'text';
        }

        const newAttachment: Attachment = {
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          type,
          mimeType: file.type || 'text/plain',
          data: base64Data,
          size: file.size,
        };

        setStagedFiles((prev) => [...prev, newAttachment]);
      };

      reader.onerror = () => {
        setErrorMessage(`Could not read file: ${file.name}`);
        setTimeout(() => setErrorMessage(''), 3000);
      };

      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        reader.readAsDataURL(file);
      } else {
        // Plain texts can also be read as DataURL to retain mime type parsing easily
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveStagedFile = (id: string) => {
    setStagedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (isGenerating || (!trimmed && stagedFiles.length === 0)) return;

    onSendMessage(trimmed, stagedFiles);
    setInputText('');
    setStagedFiles([]);

    // Reset height of textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4">
      {/* Upload Zone container with file drag overlay */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-[28px] border border-sky-100/80 bg-white shadow-xl shadow-sky-900/5 transition-all duration-200 ${
          isDragOver ? 'ring-2 ring-sky-400/80 border-transparent bg-sky-50/10' : ''
        }`}
      >
        {/* Error Notification Toast (In-Bar for clean non-intrusive layout) */}
        {errorMessage && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-rose-50 border border-rose-200 text-rose-700 text-xs py-2 px-4 rounded-xl flex items-center gap-2 shadow-xs z-50 animate-fade-in">
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        {/* Drag Over Hint */}
        {isDragOver && (
          <div className="absolute inset-0 bg-sky-500/5 rounded-3xl flex items-center justify-center pointer-events-none z-30">
            <p className="text-sm font-semibold text-sky-600 animate-pulse">
              Drop your documents and files here to upload
            </p>
          </div>
        )}

        {/* 1. Staged Files Thumbnail Shelf */}
        {stagedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 pt-3 border-b border-slate-100 select-none pb-2">
            {stagedFiles.map((file) => (
              <div
                key={file.id}
                className="group relative flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 pr-2"
              >
                {file.type === 'image' ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-200 flex-shrink-0">
                    <img src={file.data} alt="Upload preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 flex-shrink-0">
                    <span className="text-[10px] font-bold text-sky-700">
                      {file.type.toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-700 truncate max-w-[100px]">{file.name}</p>
                  <p className="text-[8px] text-slate-400 font-medium">Staged</p>
                </div>
                <button
                  onClick={() => handleRemoveStagedFile(file.id)}
                  id={`remove-staged-file-${file.id}`}
                  className="p-0.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 active:scale-90 transition-all cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() => setStagedFiles([])}
              id="clear-all-staged-btn"
              className="flex items-center gap-1 hover:text-red-500 text-slate-400 text-[10px] font-semibold py-1 px-2 rounded-lg hover:bg-red-50 hover:border-red-100 border border-transparent transition-all cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear Staged</span>
            </button>
          </div>
        )}

        {/* 2. Text Input area */}
        <div className="flex flex-col px-4 py-3">
          {/* Core Text Box */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Barsha about pyqs, coding, literature..."
            className="w-full resize-none bg-transparent border-0 py-1.5 mb-2 focus:ring-0 text-slate-700 text-sm md:text-base placeholder-slate-400 max-h-[180px] focus:outline-none min-h-[24px]"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {/* Custom Model Selector */}
              <div className="relative" id="model-selector-container">
                <button
                  onClick={() => {
                    const el = document.getElementById('model-dropdown');
                    if (el) el.classList.toggle('hidden');
                  }}
                  className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs text-slate-600 py-1.5 px-3 rounded-lg focus:outline-none transition-all font-semibold mr-1 cursor-pointer"
                >
                  {currentModel === 'gemini-1.5-flash' ? 'Barsha Spark' : 
                   currentModel === 'gemini-2.0-flash' ? 'Barsha Spark 2.0' : 
                   'Barsha Pro'}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div 
                  id="model-dropdown" 
                  className="hidden absolute bottom-full left-0 mb-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200/60 overflow-hidden z-50 origin-bottom-left"
                >
                  <div className="p-1">
                    <button
                      onClick={() => {
                        onChangeModel('gemini-2.0-flash');
                        document.getElementById('model-dropdown')?.classList.add('hidden');
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer ${currentModel === 'gemini-2.0-flash' ? 'bg-sky-50' : ''}`}
                    >
                      <div className="font-semibold text-sm text-slate-700 flex justify-between items-center">
                        Barsha Spark 2.0
                        {currentModel === 'gemini-2.0-flash' && <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">Next-gen fastest model for everyday tasks and casual searches</div>
                    </button>
                    <button
                      onClick={() => {
                        onChangeModel('gemini-1.5-flash');
                        document.getElementById('model-dropdown')?.classList.add('hidden');
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer ${currentModel === 'gemini-1.5-flash' ? 'bg-sky-50' : ''}`}
                    >
                      <div className="font-semibold text-sm text-slate-700 flex justify-between items-center">
                        Barsha Spark
                        {currentModel === 'gemini-1.5-flash' && <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">Fast, efficient, and reliable for standard queries</div>
                    </button>
                    <button
                      onClick={() => {
                        onChangeModel('gemini-1.5-pro');
                        document.getElementById('model-dropdown')?.classList.add('hidden');
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer ${currentModel === 'gemini-1.5-pro' ? 'bg-sky-50' : ''}`}
                    >
                      <div className="font-semibold text-sm text-slate-700 flex justify-between items-center">
                        Barsha Pro
                        {currentModel === 'gemini-1.5-pro' && <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">Advanced reasoning for complex academic analysis</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Attachment trigger */}
              <button
                onClick={() => fileInputRef.current?.click()}
                id="attachment-trigger-btn"
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 active:scale-95 transition-all flex-shrink-0 cursor-pointer"
                title="Attach images, PDFs, text"
              >
                <Paperclip className="w-4.5 h-4.5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileInputChange}
                id="hidden-file-selector"
                className="hidden"
                accept="image/*,application/pdf,text/*,.js,.ts,.tsx,.py,.json,.csv"
              />

              {/* Native microphone trigger */}
              <button
                onClick={handleToggleVoice}
                id="voice-dictation-btn"
                className={`p-2 rounded-full active:scale-95 transition-all flex-shrink-0 cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
                title={isListening ? "Listening... click to stop" : "Dictate prompt"}
              >
                {isListening ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
              </button>
            </div>

            {/* Send Action */}
            <button
              onClick={handleSend}
              id="send-message-btn"
              disabled={isGenerating || (!inputText.trim() && stagedFiles.length === 0)}
              className={`p-2.5 rounded-2xl flex-shrink-0 transition-all cursor-pointer ${
                isGenerating || (!inputText.trim() && stagedFiles.length === 0)
                  ? 'bg-slate-100 text-slate-300 pointer-events-none'
                  : themePreset === 'rose'
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-200 active:scale-95'
                  : themePreset === 'tulip'
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-200 active:scale-95'
                  : 'bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-200 active:scale-95'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
