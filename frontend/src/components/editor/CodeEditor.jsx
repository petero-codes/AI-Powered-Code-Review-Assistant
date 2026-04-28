import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';

const CodeEditor = ({ onReviewSubmit, isLoading }) => {
  const [code, setCode] = useState('# Write your code here...\nfunction hello() {\n  console.log("Hello World");\n}');
  const [language, setLanguage] = useState('javascript');

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
  ];

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleSubmit = async () => {
    if (!code.trim()) return;
    await onReviewSubmit(code, language);
  };

  return (
    <div className="h-full flex flex-col bg-vscode-editor">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-vscode-sidebar border-b border-vscode-border">
        <div className="flex items-center gap-3">
          <span className="text-sm text-vscode-text-muted">Language:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-vscode-input border border-vscode-border rounded px-3 py-1 text-sm text-vscode-text focus:outline-none focus:ring-1 focus:ring-vscode-button"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value} className="bg-vscode-sidebar">
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
            isLoading
              ? 'bg-vscode-border text-vscode-text-muted cursor-not-allowed'
              : 'bg-vscode-button hover:bg-vscode-button-hover text-white'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Submit for Review
            </>
          )}
        </motion.button>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            glyphMargin: true,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
