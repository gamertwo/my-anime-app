'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, Search, Filter, Calendar, TrendingUp, TrendingDown, UserPlus } from 'lucide-react';

export default function Leaderboard() {
  const [animes, setAnimes] = useState([]);
  const [filteredAnimes, setFilteredAnimes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('average');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedGenre, setSelectedGenre] = useState('All');
  
  useEffect(() => {
    const storedAnimes = JSON.parse(localStorage.getItem('animes') || '[]');
    setAnimes(storedAnimes);
    setFilteredAnimes(storedAnimes);
  }, []);
  
  useEffect(() => {
    let result = [...animes];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(anime => 
        anime.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply genre filter
    if (selectedGenre !== 'All') {
      result = result.filter(anime => 
        anime.genres && anime.genres.includes(selectedGenre)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'releaseYear') {
        return sortOrder === 'asc'
          ? a.releaseYear - b.releaseYear
          : b.releaseYear - a.releaseYear;
      } else {
        return sortOrder === 'asc'
          ? a[sortBy] - b[sortBy]
          : b[sortBy] - a[sortBy];
      }
    });
    
    setFilteredAnimes(result);
  }, [animes, searchTerm, sortBy, sortOrder, selectedGenre]);
  
  const toggleSortOrder = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };
  
  // Get all unique genres from anime list
  const allGenres = ['All', ...new Set(animes.flatMap(anime => anime.genres || []))].sort();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-blue-400">AnimeScore</span>
          </div>
          <div className="flex space-x-4">
            <Link href="/" className="px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-blue-400 transition-colors">
              Rate Anime
            </Link>
            <Link href="/leaderboard" className="px-3 py-2 rounded-md text-blue-400 bg-gray-700">
              Leaderboard
            </Link>
            <Link href="/stats" className="px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-blue-400 transition-colors">
              Stats
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-400">Anime Leaderboard</h1>
        
        <div className="mb-6 bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                placeholder="Search anime..."
                className="w-full pl-10 p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative md:w-60">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="text-gray-400" size={20} />
              </div>
              <select
                className="w-full pl-10 p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none appearance-none"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                {allGenres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => toggleSortOrder('average')}
              className={`px-3 py-1.5 rounded-lg text-sm flex items-center ${
                sortBy === 'average' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              <Star className="mr-1" size={16} />
              Rating
              {sortBy === 'average' && (
                sortOrder === 'desc' ? <TrendingDown className="ml-1" size={16} /> : <TrendingUp className="ml-1" size={16} />
              )}
            </button>
            
            <button
              onClick={() => toggleSortOrder('name')}
              className={`px-3 py-1.5 rounded-lg text-sm flex items-center ${
                sortBy === 'name' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              <span>Name</span>
              {sortBy === 'name' && (
                sortOrder === 'desc' ? <TrendingDown className="ml-1" size={16} /> : <TrendingUp className="ml-1" size={16} />
              )}
            </button>
            
            <button
              onClick={() => toggleSortOrder('releaseYear')}
              className={`px-3 py-1.5 rounded-lg text-sm flex items-center ${
                sortBy === 'releaseYear' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              <Calendar className="mr-1" size={16} />
              Year
              {sortBy === 'releaseYear' && (
                sortOrder === 'desc' ? <TrendingDown className="ml-1" size={16} /> : <TrendingUp className="ml-1" size={16} />
              )}
            </button>
            
            <button
              onClick={() => toggleSortOrder('dateAdded')}
              className={`px-3 py-1.5 rounded-lg text-sm flex items-center ${
                sortBy === 'dateAdded' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              <UserPlus className="mr-1" size={16} />
              Date Added
              {sortBy === 'dateAdded' && (
                sortOrder === 'desc' ? <TrendingDown className="ml-1" size={16} /> : <TrendingUp className="ml-1" size={16} />
              )}
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
          {filteredAnimes.length > 0 ? (
            filteredAnimes.map((anime, index) => (
              <div 
                key={index}
                className="p-4 border-b border-gray-700 hover:bg-gray-750 transition-colors"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <span className="font-medium text-lg">
                        {anime.name}
                        {anime.releaseYear && <span className="text-gray-400 text-sm ml-2">({anime.releaseYear})</span>}
                      </span>
                    </div>
                    
                    {anime.genres && anime.genres.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {anime.genres.map((genre, idx) => (
                          <span key={idx} className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {anime.studio && (
                      <div className="mt-1 text-gray-400 text-sm">
                        Studio: {anime.studio}
                        {anime.episodes && <span className="ml-3">Episodes: {anime.episodes}</span>}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end justify-center">
                    <div className="flex items-center">
                      <span className="text-3xl font-bold text-blue-400 mr-2">{anime.average}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={18} 
                            className={star <= Math.round(anime.average / 2) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1 mt-2 text-xs">
                      <div className="text-center">
                        <div className="font-bold text-gray-400">Plot</div>
                        <div>{anime.plot}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-gray-400">Story</div>
                        <div>{anime.story}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-gray-400">Chars</div>
                        <div>{anime.characters}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-gray-400">Sound</div>
                        <div>{anime.soundtracks}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-gray-400">Anim</div>
                        <div>{anime.animation}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-gray-400">World</div>
                        <div>{anime.worldBuilding}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {anime.notes && (
                  <div className="mt-3 text-gray-400 text-sm bg-gray-750 p-3 rounded border border-gray-700">
                    <div className="font-bold mb-1">Notes:</div>
                    {anime.notes}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400">
              {searchTerm || selectedGenre !== 'All' ? 
                'No anime match your search criteria. Try adjusting your filters.' : 
                'No anime have been rated yet. Start by adding some ratings!'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}