import { kv } from '@vercel/kv';
import { notFound } from 'next/navigation';

export default async function PastePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pasteData = await kv.get(`paste:${id}`);

  if (!pasteData) {
    notFound();
  }

  const paste = JSON.parse(pasteData as string);
  const currentTime = Date.now();

  if (paste.expires_at && currentTime >= paste.expires_at) {
    await kv.del(`paste:${id}`);
    notFound();
  }

  if (paste.remaining_views !== null && paste.remaining_views <= 0) {
    await kv.del(`paste:${id}`);
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Shared Paste</h1>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre className="whitespace-pre-wrap break-words text-gray-800 font-mono text-sm">
              {paste.content}
            </pre>
          </div>
          {paste.remaining_views !== null && (
            <p className="mt-4 text-sm text-gray-600">
              Remaining views: {paste.remaining_views}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
