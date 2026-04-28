import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('anthropic_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('anthropic_api_key', apiKey.trim());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } else {
      localStorage.removeItem('anthropic_api_key');
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-vscode-bg">
      <div className="p-8 max-w-md w-full">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-vscode-sidebar flex items-center justify-center">
          <SettingsIcon size={32} className="text-vscode-text-muted" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2 text-center">Settings</h1>
        <p className="text-vscode-text-muted mb-8 text-center text-sm">
          Configure your API keys to enable authentic code reviews.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-vscode-text mb-2">
              Anthropic API Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key size={16} className="text-vscode-text-muted" />
              </div>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-vscode-input border border-vscode-border rounded py-2 pl-10 pr-4 text-vscode-text focus:outline-none focus:border-vscode-button focus:ring-1 focus:ring-vscode-button transition-colors"
                placeholder="sk-ant-..."
              />
            </div>
            <p className="mt-2 text-xs text-vscode-text-muted">
              Your API key is stored securely in your browser's local storage and is sent directly to the backend.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="submit"
              className="bg-vscode-button hover:bg-vscode-button-hover text-white px-6 py-2 rounded font-medium transition-colors"
            >
              Save Configuration
            </button>
            <AnimatePresence>
              {isSaved && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-green-400 text-sm"
                >
                  <Check size={16} />
                  <span>Saved!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
