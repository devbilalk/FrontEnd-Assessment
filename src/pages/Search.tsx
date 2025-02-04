import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, LogOut, Search as SearchIcon, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getBreeds, searchDogs, getDogs, generateMatch, logout } from '../api';
import type { Dog } from '../types';
import { Button } from '../components/Button';
import { Select } from '../components/Select';
import { cn } from '../utils';

export function Search() {
  const navigate = useNavigate();
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [prevPage, setPrevPage] = useState<number | null>(null);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const breedList = await getBreeds();
        setBreeds(breedList);
      } catch (error) {
        toast.error('Failed to fetch breeds');
      }
    };

    fetchBreeds();
  }, []);

  const fetchDogs = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const params: any = {
        sort: `breed:${sortOrder}`,
        from: (page - 1) * 18,
        size: 18,
      };

      if (selectedBreed) {
        params.breeds = [selectedBreed];
      }

      const response = await searchDogs(params);
      const dogList = await getDogs(response.resultIds);

      setDogs(dogList);
      setNextPage(response.next ? page + 1 : null);
      setPrevPage(page > 1 ? page - 1 : null);
      setTotalResults(response.total);
    } catch (error) {
      toast.error('Failed to fetch dogs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDogs();
  }, [selectedBreed, sortOrder]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const toggleFavorite = (dogId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(dogId)) {
        next.delete(dogId);
      } else {
        next.add(dogId);
      }
      return next;
    });
  };

  const handleMatch = async () => {
    if (favorites.size === 0) {
      toast.error('Please select at least one dog to match');
      return;
    }

    try {
      const match = await generateMatch(Array.from(favorites));
      const [dog] = await getDogs([match.match]);
      setMatchedDog(dog);
      toast.success("It's a match! 🎉");
    } catch (error) {
      toast.error('Failed to generate match');
    }
  };

  const DogCard = ({ dog, showFavorite = true }: { dog: Dog; showFavorite?: boolean }) => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <img
        src={dog.img}
        alt={dog.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{dog.name}</h3>
            <p className="text-sm text-gray-500">{dog.breed}</p>
          </div>
          {showFavorite && (
            <button
              onClick={() => toggleFavorite(dog.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Heart
                className={cn('h-6 w-6', {
                  'fill-current text-red-500': favorites.has(dog.id),
                })}
              />
            </button>
          )}
        </div>
        <div className="mt-4 flex justify-between text-sm text-gray-500">
          <span>{dog.age} years old</span>
          <span>{dog.zip_code}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <SearchIcon className="h-6 w-6 text-gray-500" />
            <h1 className="text-2xl font-bold text-gray-900">Find a Dog</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              onClick={handleMatch}
              disabled={favorites.size === 0}
            >
              Generate Match ({favorites.size})
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {matchedDog && (
          <div className="mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-blue-900">Your Perfect Match!</h2>
                <button
                  onClick={() => setMatchedDog(null)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="max-w-sm mx-auto">
                <DogCard dog={matchedDog} showFavorite={false} />
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-4 mb-8">
          <div className="w-64">
            <Select
              value={selectedBreed}
              onChange={(e) => setSelectedBreed(e.target.value)}
            >
              <option value="">All Breeds</option>
              {breeds.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </Select>
          </div>
          <Select
            className="w-48"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          >
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
          </div>

        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dogs.map((dog) => (
                <DogCard key={dog.id} dog={dog} />
              ))}
            </div>

            <div className="mt-8 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {dogs.length} of {totalResults} results
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => fetchDogs(prevPage ?? 1)}
                  disabled={prevPage === null}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => fetchDogs(nextPage ?? 1)}
                  disabled={nextPage === null}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
