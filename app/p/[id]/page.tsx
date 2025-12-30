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

  if (paste.remaining_views !== null && paste.remaining_views <= 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-12">
      <div className="w-full max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Paste Share</h1>
          <p className="text-slate-600">Viewing shared content</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="mb-6 flex items-center justify-between pb-4 border-b border-slate-200">
            <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Shared Content</span>
            <div className="flex gap-4 text-sm text-slate-600">
              {paste.remaining_views !== null && (
                <span>Views remaining: <strong className="text-slate-900">{paste.remaining_views}</strong></span>
              )}
              {paste.expires_at && (
                <span>Expires: <strong className="text-slate-900">{new Date(paste.expires_at).toLocaleString()}</strong></span>
              )}
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 shadow-inner">
            <pre className="whitespace-pre-wrap break-words text-slate-900 font-mono text-sm leading-relaxed">
              {paste.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
