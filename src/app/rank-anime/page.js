'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Save, Trash2, Info, AlertTriangle, Search, ExternalLink, Filter, ChevronsUpDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const [animeData, setAnimeData] = useState({
    name: '',
    plot: '',
    story: '',
    characters: '',
    soundtracks: '',
    animation: '',
    worldBuilding: '',
    genres: [],
    releaseYear: '',
    studio: '',
    episodes: '',
    notes: '',
    image: ''
  });
  
  const [isSaved, setIsSaved] = useState(false);
  const [recentRatings, setRecentRatings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [sortOrder, setSortOrder] = useState('newest');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedAnimes = JSON.parse(localStorage.getItem('animes') || '[]');
    setRecentRatings(storedAnimes.slice(-5).reverse());
    
    // Check for dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  const validateForm = () => {
    const errors = {};
    
    if (!animeData.name.trim()) {
      errors.name = "Anime name is required";
    }
    
    // Validate ratings
    ['plot', 'story', 'characters', 'soundtracks', 'animation', 'worldBuilding'].forEach(field => {
      if (!animeData[field]) {
        errors[field] = `Please rate the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = document.querySelector('.error-message');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    const average = (
      Number(animeData.plot) +
      Number(animeData.story) +
      Number(animeData.characters) +
      Number(animeData.soundtracks) +
      Number(animeData.animation) +
      Number(animeData.worldBuilding)
    ) / 6;

    const animeWithAverage = {
      ...animeData,
      average: average.toFixed(2),
      dateAdded: new Date().toISOString()
    };

    const existingAnimes = JSON.parse(localStorage.getItem('animes') || '[]');
    localStorage.setItem('animes', JSON.stringify([...existingAnimes, animeWithAverage]));

    setRecentRatings([animeWithAverage, ...recentRatings.slice(0, 4)]);
    
    // Show success message with animation
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);

    // Reset form
    setAnimeData({
      name: '',
      plot: '',
      story: '',
      characters: '',
      soundtracks: '',
      animation: '',
      worldBuilding: '',
      genres: [],
      releaseYear: '',
      studio: '',
      episodes: '',
      notes: '',
      image: ''
    });
    
    setFormErrors({});
  };

  const handleGenreChange = (genre) => {
    if (animeData.genres.includes(genre)) {
      setAnimeData({
        ...animeData,
        genres: animeData.genres.filter(g => g !== genre)
      });
    } else {
      setAnimeData({
        ...animeData,
        genres: [...animeData.genres, genre]
      });
    }
  };

  const removeRating = (dateAdded) => {
    const existingAnimes = JSON.parse(localStorage.getItem('animes') || '[]');
    const updatedAnimes = existingAnimes.filter(anime => anime.dateAdded !== dateAdded);
    localStorage.setItem('animes', JSON.stringify(updatedAnimes));
    
    setRecentRatings(recentRatings.filter(anime => anime.dateAdded !== dateAdded));
  };
  
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim().length > 2) {
      setIsSearching(true);
      
      // Simulating API call to an anime database
      setTimeout(() => {
        // This would be replaced with actual API call
        const mockResults = [
          { id: 1, title: "Naruto", year: 2002, image: "https://via.placeholder.com/50" },
          { id: 2, title: "Attack on Titan", year: 2013, image: "https://via.placeholder.com/50" },
          { id: 3, title: "Death Note", year: 2006, image: "https://via.placeholder.com/50" },
          { id: 4, title: "One Piece", year: 1999, image: "https://via.placeholder.com/50" },
          { id: 5, title: "My Hero Academia", year: 2016, image: "https://via.placeholder.com/50" }
        ].filter(anime => anime.title.toLowerCase().includes(query.toLowerCase()));
        
        setSearchResults(mockResults);
        setIsSearching(false);
        setShowSearchResults(true);
      }, 500);
    } else {
      setShowSearchResults(false);
    }
  };
  
  const selectAnime = (anime) => {
    setAnimeData({
      ...animeData,
      name: anime.title,
      releaseYear: anime.year,
      image: anime.image
    });
    setShowSearchResults(false);
    setSearchQuery('');
  };
  
  const handleSortChange = (order) => {
    setSortOrder(order);
    
    const storedAnimes = JSON.parse(localStorage.getItem('animes') || '[]');
    let sortedAnimes = [...storedAnimes];
    
    if (order === 'highest') {
      sortedAnimes.sort((a, b) => b.average - a.average);
    } else if (order === 'lowest') {
      sortedAnimes.sort((a, b) => a.average - b.average);
    } else {
      // Default to newest
      sortedAnimes.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    }
    
    setRecentRatings(sortedAnimes.slice(0, 5));
  };

  const genres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 
    'Horror', 'Mecha', 'Music', 'Mystery', 'Psychological', 
    'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller',
    'Isekai', 'Shounen', 'Shoujo', 'Seinen', 'Josei'
  ];
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
      
      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-4">
        <Link href="/" className="px-3 py-2 rounded-md text-blue-400 bg-gray-700 transition-all hover:bg-gray-600">
          Rate Anime
        </Link>
        <Link href="/leaderboard" className="px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-blue-400 transition-all">
          Leaderboard
        </Link>
        <Link href="/stats" className="px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-blue-400 transition-all">
          Stats
        </Link>
        <Link href="/manage-data" className="px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-blue-400 transition-all">
          Export
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none"
        >
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </div>

    {/* Mobile Menu Dropdown */}
    {isMobileMenuOpen && (
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link 
            href="/" 
            className="block px-3 py-2 rounded-md text-base font-medium text-blue-400 bg-gray-700"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Rate Anime
          </Link>
          <Link 
            href="/leaderboard" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-blue-400"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Leaderboard
          </Link>
          <Link 
            href="/stats" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-blue-400"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Stats
          </Link>
          <Link 
            href="/manage-data" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-blue-400"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Export
          </Link>
        </div>
      </div>
    )}
  </div>
</nav>

      <div className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Rate Your Anime</h1>
          
          <AnimatePresence>
            {isSaved && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded-lg flex items-center shadow-lg"
              >
                <Save className="mr-2" size={20} />
                Rating saved successfully!
              </motion.div>
            )}
          </AnimatePresence>
          
          <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <div className="relative">
              <div className="flex items-center">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for an anime..."
                  className="w-full p-3 pl-10 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              
              {showSearchResults && (
                <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {isSearching ? (
                    <div className="flex justify-center items-center p-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <ul>
                      {searchResults.map(anime => (
                        <li 
                          key={anime.id} 
                          className="p-2 hover:bg-gray-700 cursor-pointer flex items-center"
                          onClick={() => selectAnime(anime)}
                        >
                          <img src={anime.image} alt={anime.title} className="w-8 h-8 mr-2 rounded" />
                          <div>
                            <div className="font-medium">{anime.title}</div>
                            <div className="text-xs text-gray-400">{anime.year}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-3 text-gray-400 text-center">No results found</div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <label className="block mb-1 text-sm">Anime Name</label>
                <input
                  type="text"
                  placeholder="Enter Anime Name"
                  className={`w-full p-3 rounded-lg bg-gray-700 border ${formErrors.name ? 'border-red-500' : 'border-gray-600'} focus:border-blue-400 focus:outline-none`}
                  value={animeData.name}
                  onChange={(e) => {
                    setAnimeData({...animeData, name: e.target.value});
                    if (formErrors.name) {
                      setFormErrors({...formErrors, name: ''});
                    }
                  }}
                />
                {formErrors.name && <p className="text-red-500 text-sm mt-1 error-message">{formErrors.name}</p>}
              </div>
              
              <div className="md:w-1/3">
                <label className="block mb-1 text-sm">Release Year</label>
                <input
                  type="number"
                  placeholder="Year"
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none"
                  value={animeData.releaseYear}
                  onChange={(e) => setAnimeData({...animeData, releaseYear: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <label className="block mb-1 text-sm">Studio</label>
                <input
                  type="text"
                  placeholder="Animation Studio"
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none"
                  value={animeData.studio}
                  onChange={(e) => setAnimeData({...animeData, studio: e.target.value})}
                />
              </div>
              
              <div className="md:w-1/3">
                <label className="block mb-1 text-sm">Episodes</label>
                <input
                  type="number"
                  placeholder="Episodes"
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none"
                  value={animeData.episodes}
                  onChange={(e) => setAnimeData({...animeData, episodes: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Genres:</label>
              <div className="flex flex-wrap gap-2">
                {genres.map(genre => (
                  <button
                    type="button"
                    key={genre}
                    onClick={() => handleGenreChange(genre)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      animeData.genres.includes(genre)
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
              <h3 className="font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Rating Categories</h3>
              
              {Object.keys(formErrors).some(key => ['plot', 'story', 'characters', 'soundtracks', 'animation', 'worldBuilding'].includes(key)) && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg flex items-start">
                  <AlertTriangle className="text-red-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                  <p className="text-red-400 text-sm">Please rate all categories</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  ['Plot', 'plot', 'The overall storyline structure and twists. How well does the narrative flow and keep you engaged?'],
                  ['Story', 'story', 'The depth and delivery of the narrative. How meaningful and impactful is the story?'],
                  ['Characters', 'characters', 'Character development, personality, and memorable qualities. Do you connect with them?'],
                  ['Soundtracks', 'soundtracks', 'Music, voice acting quality, and sound effects that enhance the viewing experience.'],
                  ['Animation', 'animation', 'Visual quality, art style, fluidity of motion, and consistency across episodes.'],
                  ['World Building', 'worldBuilding', 'Setting, lore, universe creation, and how well the world feels cohesive and believable.']
                ].map(([label, key, tooltip]) => (
                  <div key={key} className={`bg-gray-800 p-3 rounded-lg border ${formErrors[key] ? 'border-red-500' : 'border-gray-700'} transition-all hover:border-gray-600`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <label className="font-medium">{label}</label>
                        <div className="relative group ml-2">
                          <Info size={14} className="text-gray-400 cursor-help" />
                          <div className="absolute hidden group-hover:block bg-gray-900 text-xs p-2 rounded shadow-lg -left-2 top-6 w-52 z-10 border border-gray-700">
                            {tooltip}
                          </div>
                        </div>
                      </div>
                      <span className={`font-bold ${animeData[key] >= 8 ? 'text-green-400' : animeData[key] >= 5 ? 'text-blue-400' : animeData[key] > 0 ? 'text-orange-400' : 'text-gray-400'}`}>
                        {animeData[key] || '0'}/10
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      value={animeData[key] || '0'}
                      onChange={(e) => {
                        setAnimeData({...animeData, [key]: e.target.value});
                        if (formErrors[key]) {
                          setFormErrors({...formErrors, [key]: ''});
                        }
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Poor</span>
                      <span>Average</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Notes:</label>
              <textarea
                placeholder="Add your thoughts about this anime..."
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-400 focus:outline-none min-h-32"
                value={animeData.notes}
                onChange={(e) => setAnimeData({...animeData, notes: e.target.value})}
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center font-bold shadow-lg"
            >
              <Star className="mr-2" size={20} />
              Submit Rating
            </button>
          </form>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Your Ratings</h2>
              
              <div className="relative">
                <button 
                  type="button" 
                  className="flex items-center text-sm text-gray-300 hover:text-blue-400"
                  onClick={() => document.getElementById('sort-dropdown').classList.toggle('hidden')}
                >
                  <Filter size={14} className="mr-1" />
                  Sort
                  <ChevronsUpDown size={14} className="ml-1" />
                </button>
                <div id="sort-dropdown" className="hidden absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                  <ul>
                    {[
                      ['newest', 'Newest First'],
                      ['highest', 'Highest Rated'],
                      ['lowest', 'Lowest Rated'],
                    ].map(([value, label]) => (
                      <li key={value}>
                        <button
                          type="button"
                          className={`block w-full text-left px-4 py-2 text-sm ${sortOrder === value ? 'text-blue-400' : 'text-gray-300'} hover:bg-gray-700`}
                          onClick={() => {
                            handleSortChange(value);
                            document.getElementById('sort-dropdown').classList.add('hidden');
                          }}
                        >
                          {label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {recentRatings.length > 0 ? (
              <div className="space-y-4">
                {recentRatings.map((anime, index) => (
                  <motion.div
                    key={anime.dateAdded}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-750 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold">{anime.name}</h3>
                      <button 
                        onClick={() => removeRating(anime.dateAdded)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        title="Remove rating"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="mt-2 flex items-center">
                      <span className={`text-2xl font-bold mr-2 ${
                        anime.average >= 8 ? 'text-green-400' : 
                        anime.average >= 6 ? 'text-blue-400' : 
                        anime.average >= 4 ? 'text-orange-400' : 'text-red-400'
                      }`}>
                        {anime.average}
                      </span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={16} 
                            className={star <= Math.round(anime.average / 2) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-xs text-gray-400">
                      {anime.studio && (
                        <div>
                          <span className="font-medium">Studio:</span> {anime.studio}
                        </div>
                      )}
                      {anime.releaseYear && (
                        <div>
                          <span className="font-medium">Year:</span> {anime.releaseYear}
                        </div>
                      )}
                      {anime.episodes && (
                        <div>
                          <span className="font-medium">Episodes:</span> {anime.episodes}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Added:</span> {formatDate(anime.dateAdded)}
                      </div>
                    </div>
                    
                    {anime.genres && anime.genres.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {anime.genres.map((genre, idx) => (
                          <span key={idx} className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {anime.notes && (
                      <div className="mt-3 text-sm text-gray-300 bg-gray-800 p-2 rounded-lg border border-gray-700">
                        <div className="font-medium mb-1">Notes:</div>
                        <div className="line-clamp-3">{anime.notes}</div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-750 rounded-lg border border-gray-700">
                <div className="text-gray-400 mb-2">No ratings yet</div>
                <p className="text-sm text-gray-500">Start rating your favorite anime!</p>
              </div>
            )}
            
            {recentRatings.length > 0 && (
              <div className="mt-4 text-center">
                <Link href="/leaderboard" className="text-blue-400 text-sm inline-flex items-center hover:underline">
                  View all ratings <ExternalLink size={12} className="ml-1" />
                </Link>
              </div>
            )}
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Rating Guide</h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start">
                <div className="bg-green-400 w-3 h-3 rounded-full mt-1.5 mr-2"></div>
                <div>
                  <div className="font-medium text-green-400">8-10: Excellent</div>
                  <p className="text-sm text-gray-400">Masterpieces that excel in all areas</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-400 w-3 h-3 rounded-full mt-1.5 mr-2"></div>
                <div>
                  <div className="font-medium text-blue-400">6-7.9: Good</div>
                  <p className="text-sm text-gray-400">Strong content with minor flaws</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-orange-400 w-3 h-3 rounded-full mt-1.5 mr-2"></div>
                <div>
                  <div className="font-medium text-orange-400">4-5.9: Average</div>
                  <p className="text-sm text-gray-400">Decent but lacks distinction</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-red-400 w-3 h-3 rounded-full mt-1.5 mr-2"></div>
                <div>
                  <div className="font-medium text-red-400">0-3.9: Poor</div>
                  <p className="text-sm text-gray-400">Significant flaws outweigh positives</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-700">
              <h3 className="font-medium mb-2 text-blue-400">Tips</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <div className="text-blue-400 mr-2">•</div>
                  <span>Be consistent with your rating scale across all anime</span>
                </li>
                <li className="flex items-start">
                  <div className="text-blue-400 mr-2">•</div>
                  <span>Consider all aspects, not just your favorite elements</span>
                </li>
                <li className="flex items-start">
                  <div className="text-blue-400 mr-2">•</div>
                  <span>Compare with similar anime in the same genre</span>
                </li>
                <li className="flex items-start">
                  <div className="text-blue-400 mr-2">•</div>
                  <span>Rate after completing the series for a fair assessment</span>
                </li>
                <li className="flex items-start">
                  <div className="text-blue-400 mr-2">•</div>
                  <span>Add detailed notes to remember your thoughts later</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Stats Overview</h2>
            
            {recentRatings.length > 0 ? (
              <>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Total Anime Rated</span>
                      <span className="font-medium">{JSON.parse(localStorage.getItem('animes') || '[]').length}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{width: '100%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Average Rating</span>
                      <span className="font-medium">
                        {(JSON.parse(localStorage.getItem('animes') || '[]').reduce((sum, anime) => sum + Number(anime.average), 0) / 
                          (JSON.parse(localStorage.getItem('animes') || '[]').length || 1)).toFixed(2)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" 
                        style={{
                          width: `${(JSON.parse(localStorage.getItem('animes') || '[]').reduce((sum, anime) => sum + Number(anime.average), 0) / 
                            (JSON.parse(localStorage.getItem('animes') || '[]').length || 1)) * 10}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Top Genre</span>
                      <span className="font-medium">
                        {(() => {
                          const genreCounts = JSON.parse(localStorage.getItem('animes') || '[]')
                            .flatMap(anime => anime.genres || [])
                            .reduce((counts, genre) => {
                              counts[genre] = (counts[genre] || 0) + 1;
                              return counts;
                            }, {});
                          const entries = Object.entries(genreCounts);
                          return entries.length > 0 
                            ? entries.sort((a, b) => b[1] - a[1])[0][0] 
                            : 'None';
                        })()}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        style={{
                          width: `${
                            (() => {
                              const genreCounts = JSON.parse(localStorage.getItem('animes') || '[]')
                                .flatMap(anime => anime.genres || [])
                                .reduce((counts, genre) => {
                                  counts[genre] = (counts[genre] || 0) + 1;
                                  return counts;
                                }, {});
                              const entries = Object.entries(genreCounts);
                              return entries.length > 0 
                                ? (entries.sort((a, b) => b[1] - a[1])[0][1] / JSON.parse(localStorage.getItem('animes') || '[]').length) * 100
                                : 0;
                            })()
                          }%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <Link href="/stats" className="text-blue-400 text-sm inline-flex items-center hover:underline">
                    View detailed statistics <ExternalLink size={12} className="ml-1" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="text-gray-400 mb-2">No statistics available</div>
                <p className="text-sm text-gray-500">Rate some anime to see your stats!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <footer className="mt-12 bg-gray-800 border-t border-gray-700 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
              AnimeScore
            </div>
            <p className="text-sm text-gray-400">Track, rate, and discover anime efficiently</p>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0">
            <Link href="/" className="text-gray-300 hover:text-blue-400 transition-colors">Home</Link>
            <Link href="/leaderboard" className="text-gray-300 hover:text-blue-400 transition-colors">Leaderboard</Link>
            <Link href="/stats" className="text-gray-300 hover:text-blue-400 transition-colors">Stats</Link>
            <Link href="/recommendations" className="text-gray-300 hover:text-blue-400 transition-colors">Recommendations</Link>
          </div>
          
          <div className="mt-4 md:mt-0 text-xs text-gray-500">
            &copy; {new Date().getFullYear()} AnimeScore App
          </div>
        </div>
      </footer>
      
      {/* Optional: Back to top button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-4 right-4 bg-gray-800 p-2 rounded-full shadow-lg border border-gray-700 hover:bg-gray-700 transition-colors"
        aria-label="Back to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}