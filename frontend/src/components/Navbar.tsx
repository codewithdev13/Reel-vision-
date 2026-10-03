import React, { useState } from 'react';
import { Film, Key, Sparkles, CheckCircle, Wifi, WifiOff, Wand2, X } from 'lucide-react';

interface NavbarProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  onLoadDemo: () => void;
  isLoading: boolean;
  activeTab?: string;
  onSelectTab?: (tab: 'single' | 'compare' | 'batch' | 'tools') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  apiKey,
  setApiKey,
  onLoadDemo,
  isLoading,
  activeTab,
  onSelectTab,
}) => {
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(tempKey);
    setShowKeyInput(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab && onSelectTab('single')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/15 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Film className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">ReelVision</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">
                PRO 1.5
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">AI Reel & Short Video Analyzer</p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-3">
          
          {/* Creator Tools Direct Button */}
          {onSelectTab && (
            <button
              onClick={() => onSelectTab('tools')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                activeTab === 'tools'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
                  : 'bg-white text-slate-600 border-gray-200 hover:bg-gray-50 hover:text-slate-900'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Creator Tools</span>
            </button>
          )}

          {/* Sample Demo Button */}
          <button
            onClick={onLoadDemo}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 transition-all disabled:opacity-50"
            title="Load realistic demo reel analysis instantly"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-500 animate-pulse" />
            <span className="hidden sm:inline">Try Sample Demo</span>
          </button>

          {/* API Connectivity Pill */}
          <div className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            apiKey
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            {apiKey ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-500" />
                <span>Gemini Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-amber-500" />
                <span>No API Key</span>
              </>
            )}
          </div>

          {/* API Key Config Button */}
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              apiKey
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-white text-slate-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{apiKey ? 'Key Saved' : 'API Key'}</span>
            {apiKey && <CheckCircle className="w-3 h-3 text-emerald-500" />}
          </button>
        </div>
      </div>

      {/* Modal / Dropdown for Gemini API Key */}
      {showKeyInput && (
        <div className="border-t border-gray-200 bg-gray-50/90 backdrop-blur-md p-4 shadow-sm transition-all">
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSaveKey} className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
                  <Key className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Google Gemini API Key (Optional)</span>
                </label>
                <span className="text-[11px] text-slate-500">Key stays in your local browser</span>
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                >
                  Save Key
                </button>
                {apiKey && (
                  <button
                    type="button"
                    onClick={() => {
                      setApiKey('');
                      setTempKey('');
                    }}
                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-medium transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                If left blank, the backend environment key or sample analysis mode will be used automatically.
              </p>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
