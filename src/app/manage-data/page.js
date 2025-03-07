'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Upload, Check, AlertCircle } from 'lucide-react';

export default function ManageData() {
  const [status, setStatus] = useState({ message: '', type: '' });
  const [totalRatings, setTotalRatings] = useState(0);

  useEffect(() => {
    const animes = JSON.parse(localStorage.getItem('animes') || '[]');
    setTotalRatings(animes.length);
  }, []);

  const exportData = () => {
    const animes = JSON.parse(localStorage.getItem('animes') || '[]');
    const dataStr = JSON.stringify(animes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `anime-ratings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setStatus({ message: 'Data exported successfully!', type: 'success' });
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (Array.isArray(importedData)) {
          localStorage.setItem('animes', JSON.stringify(importedData));
          setTotalRatings(importedData.length);
          setStatus({ message: 'Data imported successfully!', type: 'success' });
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        setStatus({ message: 'Error importing data. Please check file format.', type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-200">
      <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                AnimeScore
              </span>
            </div>
            <div className="hidden md:flex space-x-4">
              <Link href="/" className="px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-blue-400 transition-all">
                Rate Anime
              </Link>
              <Link href="/leaderboard" className="px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-blue-400 transition-all">
                Leaderboard
              </Link>
              <Link href="/manage-data" className="px-3 py-2 rounded-md text-blue-400 bg-gray-700 transition-all hover:bg-gray-600">
                Export
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Manage Your Anime Ratings Data
        </h1>

        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 space-y-8">
          {status.message && (
            <div className={`p-4 rounded-lg flex items-center ${
              status.type === 'success' ? 'bg-green-900/30 border border-green-700 text-green-400' : 'bg-red-900/30 border border-red-700 text-red-400'
            }`}>
              {status.type === 'success' ? <Check size={20} className="mr-2" /> : <AlertCircle size={20} className="mr-2" />}
              {status.message}
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-400">Export Data</h2>
            <p className="text-gray-400">Download your anime ratings as a JSON file for backup.</p>
            <button
              onClick={exportData}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg"
            >
              <Download size={20} />
              Export Ratings
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-400">Import Data</h2>
            <p className="text-gray-400">Upload a previously exported JSON file to restore your ratings.</p>
            <label className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-lg">
              <Upload size={20} />
              Import Ratings
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
          </div>

          <div className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <h3 className="font-semibold text-blue-400">Current Data Stats</h3>
            <div className="mt-2 space-y-2">
              <p className="text-gray-300">
                Total Ratings: {totalRatings}
              </p>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500" 
                  style={{width: `${Math.min(totalRatings * 2, 100)}%`}}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
