import { Loader } from 'lucide-react';

interface Canvas3DLoaderProps {
  message?: string;
}

/**
 * Loading fallback for 3D canvas Suspense boundaries.
 * Shows a simple spinner while Three.js assets are loading.
 */
export function Canvas3DLoader({ message = 'Loading 3D scene...' }: Canvas3DLoaderProps) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-900/80">
      <div className="flex flex-col items-center gap-3">
        <Loader className="h-8 w-8 animate-spin text-amber-400 motion-reduce:animate-none" />
        <p className="text-sm text-slate-400">{message}</p>
      </div>
    </div>
  );
}

export default Canvas3DLoader;
