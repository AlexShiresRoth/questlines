'use client';
import { CornerUpLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  const goBack = () => router.back();
  return (
    <button
      className="flex items-center gap-2 rounded-md bg-white/20 text-orange-50 px-2 py-1 hover:text-orange-700 transition-colors"
      onClick={() => goBack()}
    >
      <CornerUpLeft size={16} />
    </button>
  );
}
