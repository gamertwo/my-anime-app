'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Clock, Award, Star, TrendingUp, Filter, Calendar, Bookmark } from 'lucide-react';

export default function Stats() {
  const [animes, setAnimes] = useState([]);
  const [genreData, setGenreData] = useState([]);
  const [ratingDistribution, setRatingDistribution] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topAnime, setTopAnime] = useState(null);
  const [statsSummary, setStatsSummary] = useState({
    totalAnime: 0,
    avgRating: 0,
    mostRatedGenre: '',
    highestRated: '',
    recentlyAdded: ''
  });
  
  // Colors for charts
  const COLORS = ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE', '#1E40AF', '#1D4ED8', '#2563EB'];
  
  useEffect(() => {
    const storedAnimes = JSON.parse(localStorage.getItem('animes') || '[]');
    setAnimes(storedAnimes);
    
    // Process data for visualizations
    if (storedAnimes.length > 0) {
      // Create summary stats
      const summary = {
        totalAnime: storedAnimes.length,
        avgRating: (storedAnimes.reduce((sum, anime) => sum + parseFloat(anime.average || 0), 0) / storedAnimes.length).toFixed(2),
        highestRated: storedAnimes.sort((a, b) => b.average - a.average)[0].name,
        recentlyAdded: storedAnimes.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))[0].name
      };
      
      // Genre distribution
      const genreCounts = {};
      storedAnimes.forEach(anime => {
        if (anime.genres && anime.genres.length) {
          anime.genres.forEach(genre => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
          });
        }
      });
      
      const genreArray = Object.keys(genreCounts).map(genre => ({
        name: genre,
        count: genreCounts[genre]
      })).sort((a, b) => b.count - a.count);
      
      // Find most rated genre
      if (genreArray.length > 0) {
        summary.mostRatedGenre = genreArray[0].name;
      }
      
      setStatsSummary(summary);
      setGenreData(genreArray);
      
      // Rating distribution
      const ratingBuckets = {
        '0-2': 0, 
        '2-4': 0, 
        '4-6': 0, 
        '6-8': 0, 
        '8-10': 0
      };
      
      storedAnimes.forEach(anime => {
        const rating = parseFloat(anime.average);
        if (rating < 2) ratingBuckets['0-2']++;
        else if (rating < 4) ratingBuckets['2-4']++;
        else if (rating < 6) ratingBuckets['4-6']++;
        else if (rating < 8) ratingBuckets['6-8']++;
        else ratingBuckets['8-10']++;
      });
      
      const ratingArray = Object.keys(ratingBuckets).map(range => ({
        name: range,
        count: ratingBuckets[range]
      }));
      
      setRatingDistribution(ratingArray);
      
      // Year distribution
      const yearCounts = {};
      storedAnimes.forEach(anime => {
        if (anime.releaseYear) {
          yearCounts[anime.releaseYear] = (yearCounts[anime.releaseYear] || 0) + 1;
        }
      });
      
      const yearArray = Object.keys(yearCounts)
        .filter(year => year !== '')
        .map(year => ({
          name: year,
          count: yearCounts[year]
        }))
        .sort((a, b) => a.name - b.name);
      
      setYearData(yearArray);
      
      // Calculate average scores by category
      const totals = {
        plot: 0,
        story: 0,
        characters: 0,
        soundtracks: 0,
        animation: 0,
        worldBuilding: 0
      };
      
      storedAnimes.forEach(anime => {
        totals.plot += parseFloat(anime.plot || 0);
        totals.story += parseFloat(anime.story || 0);
        totals.characters += parseFloat(anime.characters || 0);
        totals.soundtracks += parseFloat(anime.soundtracks || 0);
        totals.animation += parseFloat(anime.animation || 0);
        totals.worldBuilding += parseFloat(anime.worldBuilding || 0);
      });
      
      const categoryArray = [
        { name: 'Plot', value: totals.plot / storedAnimes.length },
        { name: 'Story', value: totals.story / storedAnimes.length },
        { name: 'Characters', value: totals.characters / storedAnimes.length },
        { name: 'Soundtracks', value: totals.soundtracks / storedAnimes.length },
        { name: 'Animation', value: totals.animation / storedAnimes.length },
        { name: 'World Building', value: totals.worldBuilding / storedAnimes.length }
      ];
      
      setCategoryData(categoryArray);
      
      // Get the top rated anime for detailed display
      setTopAnime(storedAnimes.sort((a, b) => b.average - a.average)[0]);
    }
  }, []);
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-2 border border-gray-700 rounded shadow">
          <p className="font-bold">{`${label}`}</p>
          <p className="text-blue-400">{`Count: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  
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
            <Link href="/leaderboard" className="px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-blue-400 transition-colors">
              Leaderboard
            </Link>
            <Link href="/stats" className="px-3 py-2 rounded-md text-blue-400 bg-gray-700">
              Stats
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-400">Anime Statistics</h1>
        
        {animes.length > 0 ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 flex items-center">
                <div className="p-3 rounded-full bg-blue-500 text-white mr-4">
                  <Bookmark size={24} />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Total Anime</div>
                  <div className="text-2xl font-bold">{statsSummary.totalAnime}</div>
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 flex items-center">
                <div className="p-3 rounded-full bg-blue-500 text-white mr-4">
                  <Star size={24} />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Average Rating</div>
                  <div className="text-2xl font-bold">{statsSummary.avgRating}</div>
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 flex items-center">
                <div className="p-3 rounded-full bg-blue-500 text-white mr-4">
                  <Award size={24} />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Top Genre</div>
                  <div className="text-2xl font-bold truncate max-w-32">{statsSummary.mostRatedGenre || "N/A"}</div>
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 flex items-center">
                <div className="p-3 rounded-full bg-blue-500 text-white mr-4">
                  <Clock size={24} />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Recently Added</div>
                  <div className="text-2xl font-bold truncate max-w-32">{statsSummary.recentlyAdded}</div>
                </div>
              </div>
            </div>
          
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Top Anime */}
              {topAnime && (
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                  <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center">
                    <Award className="mr-2" size={20} />
                    Top Rated Anime
                  </h2>
                  <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-xl">{topAnime.name}</h3>
                      <div className="flex items-center bg-blue-600 px-3 py-1 rounded-full">
                        <span className="text-xl font-bold text-white">{topAnime.average}</span>
                      </div>
                    </div>
                    
                    {topAnime.genres && topAnime.genres.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {topAnime.genres.map((genre, idx) => (
                          <span key={idx} className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="flex flex-col items-center bg-gray-800 p-2 rounded border border-gray-700">
                        <span className="text-sm text-gray-400">Plot</span>
                        <span className="text-lg font-bold">{topAnime.plot}</span>
                      </div>
                      <div className="flex flex-col items-center bg-gray-800 p-2 rounded border border-gray-700">
                        <span className="text-sm text-gray-400">Story</span>
                        <span className="text-lg font-bold">{topAnime.story}</span>
                      </div>
                      <div className="flex flex-col items-center bg-gray-800 p-2 rounded border border-gray-700">
                        <span className="text-sm text-gray-400">Characters</span>
                        <span className="text-lg font-bold">{topAnime.characters}</span>
                      </div>
                      <div className="flex flex-col items-center bg-gray-800 p-2 rounded border border-gray-700">
                        <span className="text-sm text-gray-400">Soundtracks</span>
                        <span className="text-lg font-bold">{topAnime.soundtracks}</span>
                      </div>
                      <div className="flex flex-col items-center bg-gray-800 p-2 rounded border border-gray-700">
                        <span className="text-sm text-gray-400">Animation</span>
                        <span className="text-lg font-bold">{topAnime.animation}</span>
                      </div>
                      <div className="flex flex-col items-center bg-gray-800 p-2 rounded border border-gray-700">
                        <span className="text-sm text-gray-400">World</span>
                        <span className="text-lg font-bold">{topAnime.worldBuilding}</span>
                      </div>
                    </div>
                    
                    {topAnime.notes && (
                      <div className="mt-4 text-gray-300 text-sm bg-gray-800 p-3 rounded border border-gray-700">
                        <div className="font-bold mb-1">Notes:</div>
                        {topAnime.notes}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Rating Distribution */}
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 col-span-1 lg:col-span-2">
                <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center">
                  <Star className="mr-2" size={20} />
                  Rating Distribution
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={ratingDistribution}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Genre Distribution */}
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center">
                  <Filter className="mr-2" size={20} />
                  Genre Distribution
                </h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genreData.slice(0, 8)} // Limit to top 8 for legibility
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {genreData.slice(0, 8).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Year Distribution */}
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center">
                  <Calendar className="mr-2" size={20} />
                  Anime by Year
                </h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={yearData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" fill="#60A5FA" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Category Radar Chart */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 mb-6">
              <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center">
                <TrendingUp className="mr-2" size={20} />
                Average Scores by Category
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={categoryData}>
                    <PolarGrid stroke="#4B5563" />
                    <PolarAngleAxis dataKey="name" stroke="#9CA3AF" />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#9CA3AF" />
                    <Radar name="Average Score" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700 text-center">
            <h2 className="text-xl font-bold mb-4 text-blue-400">No Data Available</h2>
            <p className="text-gray-400 mb-6">Start rating anime to see detailed statistics and insights.</p>
            <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block">
              Rate Your First Anime
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}