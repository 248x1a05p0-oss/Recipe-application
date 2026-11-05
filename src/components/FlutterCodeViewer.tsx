import { useState } from 'react';
import { Copy, Check, FileCode, Layers, Info } from 'lucide-react';
import { FLUTTER_CODE_SNIPPETS } from '../data/flutterCode';

export function FlutterCodeViewer() {
  const [selectedFile, setSelectedFile] = useState(FLUTTER_CODE_SNIPPETS[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Flutter & Dart Architecture
              </h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Clean architecture with Material 3, sliver app bars, reactive models, and responsive grids.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="min-h-[44px] px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium text-xs flex items-center gap-2 transition-colors shadow-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied File' : 'Copy File Content'}
            </button>
          </div>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left File Tree Sidebar */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-2">
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Project Structure
          </div>

          {FLUTTER_CODE_SNIPPETS.map((file) => {
            const isSelected = selectedFile.filename === file.filename;
            return (
              <button
                key={file.filename}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between min-h-[44px] ${
                  isSelected
                    ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-semibold border border-orange-200/60 dark:border-orange-900/40'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileCode className="w-4 h-4 shrink-0" />
                  <span className="text-xs truncate">{file.filename}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-normal px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 shrink-0">
                  {file.category}
                </span>
              </button>
            );
          })}

          <div className="mt-4 p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/40 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              This codebase is structured for direct integration into any standard Flutter 3.3+ project.
            </span>
          </div>
        </div>

        {/* Right Code Display */}
        <div className="lg:col-span-8 bg-slate-950 text-slate-100 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          {/* File Tab Header */}
          <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-300 font-medium">
                {selectedFile.filename}
              </span>
            </div>

            <span className="text-xs text-slate-400">
              {selectedFile.description}
            </span>
          </div>

          {/* Syntax Display */}
          <pre className="p-5 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-slate-300 max-h-[600px] selection:bg-orange-600/30">
            <code>{selectedFile.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
