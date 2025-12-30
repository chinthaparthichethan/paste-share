import { kv } from '@/lib/kv';
import { notFound } from 'next/navigation';

export default async function PastePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pasteData = await kv.get(`paste:${id}`);

  if (!pasteData) {
    notFound();
  }

  const paste = typeof pasteData === 'string' ? JSON.parse(pasteData) : pasteData;
  const currentTime = Date.now();

  if (paste.expires_at && currentTime >= paste.expires_at) {
    await kv.del(`paste:${id}`);
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
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
