'use client';

import { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [ttlSeconds, setTtlSeconds] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [loading, setLoading] = useState(false);
  const [pasteUrl, setPasteUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPasteUrl('');

    const response = await fetch('/api/pastes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        ttl_seconds: ttlSeconds ? parseInt(ttlSeconds) : undefined,
        max_views: maxViews ? parseInt(maxViews) : undefined,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setPasteUrl(data.url);
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pasteUrl);
    alert('Link copied to clipboard');
  };

  const downloadPaste = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paste-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Left Panel - Editor */}
      <div className="w-1/2 flex flex-col p-12">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">Paste Share</h1>
          <p className="text-slate-400 text-lg">Secure code and text sharing</p>
        </div>

        <div className="flex-1 flex flex-col">
          <label className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 px-5 py-4 bg-slate-800/50 backdrop-blur-sm rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-base shadow-2xl mb-6"
            placeholder="Enter your code or text here"
            required
          />

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                Expiration Time
              </label>
              <input
                type="number"
                value={ttlSeconds}
                onChange={(e) => setTtlSeconds(e.target.value)}
                className="w-full px-5 py-3 bg-slate-800/50 backdrop-blur-sm rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                placeholder="Seconds"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                View Limit
              </label>
              <input
                type="number"
                value={maxViews}
                onChange={(e) => setMaxViews(e.target.value)}
                className="w-full px-5 py-3 bg-slate-800/50 backdrop-blur-sm rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                placeholder="Views"
                min="1"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-4 rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Paste...' : 'Create Paste'}
          </button>
        </div>
      </div>

      {/* Right Panel - Output */}
      <div className="w-1/2 bg-white p-12 flex flex-col justify-center">
        {pasteUrl ? (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Success</h2>
              <p className="text-slate-600 text-lg">Your paste has been created and is ready to share</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                Share Link
              </label>
              <input
                type="text"
                value={pasteUrl}
                readOnly
                className="w-full px-5 py-4 bg-slate-50 rounded-xl text-slate-900 font-mono text-sm shadow-inner"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={copyToClipboard}
                className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-xl transition-all duration-200 shadow-md"
              >
                Copy Link
              </button>
              <a
                href={pasteUrl}
                target="_blank"
                className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-xl transition-all duration-200 text-center shadow-md"
              >
                Open Paste
              </a>
              <button
                onClick={downloadPaste}
                className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-md"
              >
                Download
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-slate-100 rounded-2xl mx-auto"></div>
            <h2 className="text-2xl font-bold text-slate-900">Ready to Share</h2>
            <p className="text-slate-600 text-lg max-w-md mx-auto">
              Create your paste to generate a secure shareable link
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
