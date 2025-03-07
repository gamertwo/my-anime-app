'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Download, Upload, Check, AlertCircle } from 'lucide-react';

export default function ManageData() {
  const [status, setStatus] = useState({ message: '', type: '' });

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
      <nav className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-center space-x-4">
          <Link href="/" className="text-gray-300 px-3 py-2 rounded-md hover:bg-gray-700 hover:text-blue-400 transition-all">Rate Anime</Link>
          <Link href="/leaderboard" className="text-gray-300 px-3 py-2 rounded-md hover:bg-gray-700 hover:text-blue-400 transition-all">Leaderboard</Link>
          <Link href="/manage-data" className="text-blue-400 px-3 py-2 rounded-md bg-gray-700">Manage Data</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-6">
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
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              <Download size={20} />
              Export Ratings
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-400">Import Data</h2>
            <p className="text-gray-400">Upload a previously exported JSON file to restore your ratings.</p>
            <label className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors cursor-pointer">
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
            <p className="text-gray-300">
              Total Ratings: {JSON.parse(localStorage.getItem('animes') || '[]').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
