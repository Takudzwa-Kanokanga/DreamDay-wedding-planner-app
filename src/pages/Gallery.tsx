import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  category: string;
  is_favorite: boolean;
}

export default function Gallery() {
  const [savedPhotos, setSavedPhotos] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { user } = useAuth();

  const inspirationPhotos = [
    {
      url: 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Wedding ceremony',
      category: 'Ceremony',
    },
    {
      url: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Wedding rings',
      category: 'Details',
    },
    {
      url: 'https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Bridal bouquet',
      category: 'Florals',
    },
    {
      url: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Outdoor ceremony setup',
      category: 'Venue',
    },
    {
      url: 'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Wedding cake',
      category: 'Reception',
    },
    {
      url: 'https://images.pexels.com/photos/265705/pexels-photo-265705.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Couple portrait',
      category: 'Portraits',
    },
    {
      url: 'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Table setting',
      category: 'Reception',
    },
    {
      url: 'https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'First dance',
      category: 'Reception',
    },
    {
      url: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Wedding dress',
      category: 'Details',
    },
    {
      url: 'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Ceremony arch',
      category: 'Ceremony',
    },
    {
      url: 'https://images.pexels.com/photos/2788488/pexels-photo-2788488.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Champagne toast',
      category: 'Reception',
    },
    {
      url: 'https://images.pexels.com/photos/1857075/pexels-photo-1857075.jpeg?auto=compress&cs=tinysrgb&w=800',
      alt: 'Wedding shoes',
      category: 'Details',
    },
  ];

  useEffect(() => {
    if (user) {
      fetchSavedPhotos();
    }
  }, [user]);

  const fetchSavedPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedPhotos(data || []);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    }
  };

  const savePhoto = async (photo: typeof inspirationPhotos[0]) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('gallery_items').insert([
        {
          user_id: user.id,
          title: photo.alt,
          image_url: photo.url,
          category: photo.category,
          is_favorite: false,
        },
      ]);

      if (error) throw error;
      fetchSavedPhotos();
    } catch (error) {
      console.error('Error saving photo:', error);
    }
  };

  const toggleFavorite = async (itemId: string, currentFavorite: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('gallery_items')
        .update({ is_favorite: !currentFavorite })
        .eq('id', itemId);

      if (error) throw error;
      fetchSavedPhotos();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const displayPhotos = user && savedPhotos.length > 0 ? savedPhotos : inspirationPhotos;
  const categories = ['All', 'Ceremony', 'Reception', 'Details', 'Florals', 'Venue', 'Portraits'];

  const filteredPhotos =
    selectedCategory === 'All'
      ? displayPhotos
      : displayPhotos.filter((photo) => {
          return 'category' in photo
            ? photo.category === selectedCategory
            : 'image_url' in photo && false;
        });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-gray-900 mb-4">Wedding Gallery</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {user
              ? 'Your saved wedding inspiration and ideas.'
              : 'Browse beautiful wedding moments and ideas to help plan your celebration.'}
          </p>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-pink-300 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {user && savedPhotos.length > 0 ? (
            filteredPhotos.map((photo) => {
              const item = photo as GalleryItem;
              return (
                <div
                  key={item.id}
                  className="group relative aspect-square overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <p className="font-medium mb-1">{item.title}</p>
                      <p className="text-sm text-gray-200">{item.category}</p>
                    </div>
                    <button
                      onClick={() => toggleFavorite(item.id, item.is_favorite)}
                      className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          item.is_favorite ? 'text-pink-300 fill-pink-300' : 'text-pink-300'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            inspirationPhotos.map((photo, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="font-medium mb-1">{photo.alt}</p>
                    <p className="text-sm text-gray-200">{photo.category}</p>
                  </div>
                  {user && (
                    <button
                      onClick={() => savePhoto(photo)}
                      className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                    >
                      <Heart className="w-5 h-5 text-pink-300" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {!user && (
          <div className="mt-12 text-center bg-pink-50 rounded-2xl p-8">
            <p className="text-gray-700 mb-4">
              Sign in to save your favorite wedding inspiration photos!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
