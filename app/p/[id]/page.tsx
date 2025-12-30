import { kv } from '@vercel/kv';
import { notFound } from 'next/navigation';

interface Paste {
  id: string;
  content: string;
  created_at: number;
  expires_at: number | null;
  max_views: number | null;
  remaining_views: number | null;
}

export default async function PastePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pasteData = await kv.get(`paste:${id}`);

  if (!pasteData) {
    notFound();
  }

  // Check if pasteData is already an object or a string
  const paste: Paste = typeof pasteData === 'string' ? JSON.parse(pasteData) : pasteData as Paste;
  
  const currentTime = Date.now();

  if (paste.expires_at && currentTime >= paste.expires_at) {
    await kv.del(`paste:${id}`);
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Paste Content</h1>
            {paste.remaining_views !== null && (
              <p className="text-sm text-gray-600">
                Remaining views: {paste.remaining_views}
              </p>
            )}
            {paste.expires_at && (
              <p className="text-sm text-gray-600">
                Expires at: {new Date(paste.expires_at).toLocaleString()}
              </p>
            )}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <pre className="whitespace-pre-wrap break-words text-gray-800 font-mono text-sm">
              {paste.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
