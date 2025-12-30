'use client';

import { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [ttlSeconds, setTtlSeconds] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [pasteUrl, setPasteUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPasteUrl('');
    setLoading(true);

    const body: any = { content };
    if (ttlSeconds) body.ttl_seconds = parseInt(ttlSeconds);
    if (maxViews) body.max_views = parseInt(maxViews);

    try {
      const res = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create paste');
        setLoading(false);
        return;
      }

      setPasteUrl(data.url);
      setContent('');
      setTtlSeconds('');
      setMaxViews('');
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-gray-800">Paste Share</h1>
        <p className="text-gray-600 mb-8">Share text snippets with optional expiry</p>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Text
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your text here..."
              className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expire After (seconds)
              </label>
              <input
                type="number"
                value={ttlSeconds}
                onChange={(e) => setTtlSeconds(e.target.value)}
                placeholder="Optional"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Views
              </label>
              <input
                type="number"
                value={maxViews}
                onChange={(e) => setMaxViews(e.target.value)}
                placeholder="Optional"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition"
          >
            {loading ? 'Creating...' : 'Create Paste'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {pasteUrl && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded-lg">
            <p className="font-semibold mb-2 text-green-800">✓ Paste created successfully!</p>
            <a href={pasteUrl} className="text-blue-600 hover:text-blue-800 underline break-all">
              {pasteUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
