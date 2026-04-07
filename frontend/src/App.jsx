import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, RefreshCw, Download, Globe, Sparkles, Zap, Layers } from 'lucide-react';

function App() {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('kn');
  const [status, setStatus] = useState('idle'); // idle, processing, done, error
  const [downloadUrl, setDownloadUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const validExtensions = ['ppt', 'pptx', 'pdf', 'docx', 'doc', 'txt'];
    const extension = file.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(extension)) {
      setErrorMsg('Invalid file format. Please upload a PPTX, DOCX, TXT, or PDF file.');
      setStatus('error');
      return;
    }

    setStatus('processing');
    setErrorMsg('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_language', language);

    // Dynamically uses Vercel's Environment Variable if published, otherwise falls back to localhost!
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    try {
      const response = await fetch(`${API_URL}/api/translate`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Connection failed (Failed to fetch). If using a free cloud backend, it might take 50 seconds to wake up! Please try again in a minute.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus('done');

    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
      setStatus('error');
    }
  };

  const resetState = () => {
    setFile(null);
    setStatus('idle');
    setDownloadUrl('');
    setErrorMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white relative flex flex-col font-sans overflow-hidden">

      {/* Dynamic Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      {/* Header */}
      <header className={`relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-xl transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.4)]">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white/70">
              B G Kempar PPT Translator
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Instant AI</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Layout Preserved</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-5xl mx-auto px-6 py-16 w-full flex flex-col items-center justify-center">

        <div className={`text-center mb-12 transition-all duration-1000 delay-100 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-blue-300 mb-6 drop-shadow-md">
            <Globe className="w-4 h-4" />
            Next-Gen Presentation Localization
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Translate magic <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-pulse-slow">
              without losing your design.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Upload your `.pptx`, `.docx`, `.txt`, or `.pdf` files. We extract the text, run it through AI translation, and seamlessly piece it back together—perfect formats guaranteed for PPTX and DOCX!
          </p>
        </div>

        {/* Glassmorphism Card */}
        <div className={`w-full max-w-3xl bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-1000 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

          <div className="p-8 md:p-12 relative">
            {/* Top Glow bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-80" />

            {/* Config & Language Row */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Configuration</h3>
                <p className="text-slate-400 text-sm">Select your desired output language</p>
              </div>
              <div className="relative group min-w-[200px]">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 text-white rounded-xl px-4 py-3.5 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer font-medium"
                    disabled={status === 'processing'}
                  >
                    <option value="kn">Kannada (ಕನ್ನಡ)</option>
                    <option value="hi">Hindi (हिंदी)</option>
                    <option value="te">Telugu (తెలుగు)</option>
                    <option value="ta">Tamil (தமிழ்)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Status Area */}
            {status === 'idle' || status === 'error' ? (
              <div className="animate-float">
                <div
                  className={`relative group border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer min-h-[320px] overflow-hidden
                    ${dragActive
                      ? 'border-blue-400 bg-blue-900/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".ppt,.pptx,.pdf,.docx,.doc,.txt"
                    onChange={handleChange}
                  />

                  {!file ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      <div className="bg-slate-800/50 p-6 rounded-full border border-white/5 mb-6 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-black/20">
                        <UploadCloud className="w-12 h-12 text-blue-400 group-hover:text-blue-300 transition-colors" />
                      </div>
                      <p className="text-2xl font-bold text-white mb-3">Drop presentation here</p>
                      <p className="text-slate-400 text-center font-medium max-w-[250px]">
                        Or click to browse from your computer. Supports PPTX, DOCX, TXT, and PDF.
                      </p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                      <div className="relative">
                        <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-lg" />
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-full border border-white/10 mb-6 shadow-xl relative z-10 transform scale-110">
                          <FileText className="w-12 h-12 text-white" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-white mb-2 text-center max-w-[300px] truncate">{file.name}</p>
                      <span className="px-3 py-1 bg-slate-800 rounded-full text-sm font-medium text-slate-300 border border-white/5 shadow-inner">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  )}
                </div>

                {errorMsg && (
                  <div className="mt-6 p-4 bg-red-900/30 border border-red-500/30 rounded-2xl flex items-start gap-4 backdrop-blur-sm animate-in fade-in slide-in-from-top-4">
                    <div className="bg-red-500/20 p-2 rounded-full mt-0.5">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h4 className="text-red-200 font-semibold mb-1">Translation Blocked</h4>
                      <p className="text-sm text-red-300/80 leading-relaxed">{errorMsg}</p>
                    </div>
                  </div>
                )}

                <div className="mt-10 flex justify-end">
                  <button
                    onClick={handleUpload}
                    disabled={!file}
                    className={`relative overflow-hidden px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3
                      ${file
                        ? 'bg-white text-slate-900 hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)]'
                        : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'}`}
                  >
                    {!file ? (
                      <>Select a file to begin</>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-blue-600" />
                        Commence Transformation
                      </>
                    )}
                    {file && (
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-[150%] hover:animate-[shimmer_2s_infinite]" />
                    )}
                  </button>
                </div>
              </div>
            ) : status === 'processing' ? (
              <div className="flex flex-col items-center justify-center py-24 animate-in fade-in duration-500">
                <div className="relative flex justify-center items-center w-32 h-32 mb-10">
                  {/* Outer glowing rings */}
                  <div className="absolute inset-0 border-t-2 border-l-2 border-blue-500 rounded-full animate-spin [animation-duration:3s]" />
                  <div className="absolute inset-2 border-b-2 border-r-2 border-purple-500 rounded-full animate-spin [animation-duration:2s] [animation-direction:reverse]" />
                  <div className="absolute inset-4 border-t-2 border-indigo-400 rounded-full animate-spin [animation-duration:1.5s]" />

                  {/* Center icon */}
                  <div className="bg-slate-800/80 backdrop-blur border border-white/10 rounded-full p-4 relative z-10 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                    <RefreshCw className="w-10 h-10 text-blue-400 animate-spin [animation-duration:4s]" />
                  </div>
                </div>

                <h3 className="text-3xl font-extrabold text-white mb-3">AI Engine Processing</h3>
                <p className="text-slate-400 text-lg font-light text-center max-w-sm">
                  Deconstructing layouts, injecting new languages, and re-rendering structure...
                </p>

                {/* Progress bar simulation */}
                <div className="w-64 h-1.5 bg-slate-800 rounded-full mt-10 overflow-hidden relative">
                  <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-[pulse_2s_ease-in-out_infinite] scale-x-50 origin-left" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full scale-150 animate-pulse" />
                  <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-6 rounded-full shadow-2xl shadow-green-500/30 relative z-10 border border-green-300/30">
                    <CheckCircle className="w-14 h-14 text-white" />
                  </div>
                </div>

                <h3 className="text-4xl font-extrabold text-white mb-4">Mission Accomplished!</h3>
                <p className="text-slate-400 text-lg font-light mb-10 max-w-md mx-auto">
                  Your beautifully translated `.{file?.name.split('.').pop()}` is polished and perfectly aligned. Ready for presentation.
                </p>

                <div className="flex flex-col sm:flex-row gap-5 w-full justify-center">
                  <button
                    onClick={resetState}
                    className="px-8 py-4 rounded-2xl font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-lg"
                  >
                    Translate New
                  </button>
                  <a
                    href={downloadUrl}
                    download={`Localized_${file?.name}`}
                    className="px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.4)] flex items-center justify-center gap-3 transition-all hover:scale-105 hover:-translate-y-1 text-lg border border-blue-400/30"
                  >
                    <Download className="w-6 h-6" />
                    Download Masterpiece
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Footer minimal */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-slate-500 text-sm mt-auto">
        <p>Built with ❤️ by Shiva.</p>
      </footer>

    </div>
  );
}

export default App;
