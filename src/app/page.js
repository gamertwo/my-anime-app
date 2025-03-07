'use client';
import { useRouter } from 'next/navigation';

export default function Welcome() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950 text-gray-200">
      <div className="text-center space-y-8">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          AnimeScore
        </h1>
        
        <p className="text-xl text-gray-400">
          Rate and track your favorite anime series
        </p>

        <button
          onClick={() => router.push('/rank-anime')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-lg 
                   hover:from-blue-700 hover:to-purple-700 transition-all transform 
                   hover:scale-[1.02] active:scale-[0.98] font-bold shadow-lg"
        >
          Start Rating
        </button>
      </div>
    </div>
  );
}