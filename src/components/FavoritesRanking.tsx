import React, { useState, useEffect } from 'react';
import { Heart, ThumbsUp, MessageCircle, Share } from 'lucide-react';
import { storage } from '../utils/localStorage';
import { Skater } from '../types';
import Card from './Card';

interface SkaterPost {
  skater: Skater;
  likes: number;
  isLiked: boolean;
}

const FavoritesRanking: React.FC = () => {
  const [posts, setPosts] = useState<SkaterPost[]>([]);

  useEffect(() => {
    // Get active skaters with photos
    const skaters = storage.getSkaters()
      .filter(skater => skater.estado && skater.fotoBase64)
      .slice(0, 3); // Show only top 3

    // Initialize posts with random likes for demo
    const initialPosts = skaters.map(skater => ({
      skater,
      likes: Math.floor(Math.random() * 500) + 50,
      isLiked: false
    }));

    // Sort by likes (highest first)
    initialPosts.sort((a, b) => b.likes - a.likes);
    setPosts(initialPosts);
  }, []);

  const handleLike = (index: number) => {
    setPosts(prev => prev.map((post, i) => {
      if (i === index) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleShare = (skaterName: string) => {
    if (navigator.share) {
      navigator.share({
        title: `Check out ${skaterName} on SkatePark Pro!`,
        text: `Amazing skater performing at X Games style events!`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart size={48} className="mx-auto text-gray-600 mb-4" />
        <p className="text-gray-400">No hay participantes con fotos para mostrar en el ranking</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Ranking de Favoritos</h2>
        <p className="text-gray-300">Los skaters más populares de la comunidad</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <Card key={post.skater.id} className="overflow-hidden p-0 bg-white/10 backdrop-blur-md">
            {/* Header */}
            <div className="p-4 flex items-center space-x-3">
              <div className="relative">
                <img 
                  src={post.skater.fotoBase64} 
                  alt={post.skater.nombre}
                  className="w-10 h-10 rounded-full object-cover border-2 border-orange-500/50"
                />
                {index === 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-black">👑</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm">{post.skater.nombre}</h3>
                <p className="text-gray-400 text-xs">{post.skater.especialidad} • {post.skater.nacionalidad}</p>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-orange-400 text-xs font-bold">#{index + 1}</span>
              </div>
            </div>

            {/* Image */}
            <div className="relative aspect-square">
              <img 
                src={post.skater.fotoBase64} 
                alt={`${post.skater.nombre} performing`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              
              {/* Overlay info */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-white text-sm font-medium mb-1">
                    🛹 {post.skater.anos_experiencia} años de experiencia
                  </p>
                  <p className="text-gray-300 text-xs">
                    "Pushing limits at X Games style events!"
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(index)}
                    className={`flex items-center space-x-1 transition-all duration-200 ${
                      post.isLiked 
                        ? 'text-red-500 scale-110' 
                        : 'text-gray-400 hover:text-red-400'
                    }`}
                  >
                    <Heart 
                      size={20} 
                      className={post.isLiked ? 'fill-current' : ''} 
                    />
                  </button>
                  
                  <button className="text-gray-400 hover:text-blue-400 transition-colors">
                    <MessageCircle size={20} />
                  </button>
                  
                  <button 
                    onClick={() => handleShare(post.skater.nombre)}
                    className="text-gray-400 hover:text-green-400 transition-colors"
                  >
                    <Share size={20} />
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <ThumbsUp size={16} className="text-orange-400" />
                  <span className="text-orange-400 text-sm font-medium">
                    {post.likes.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Like count */}
              <div className="text-white text-sm">
                <span className="font-semibold">{post.likes.toLocaleString()}</span>
                <span className="text-gray-400"> likes</span>
              </div>

              {/* Caption */}
              <div className="text-sm">
                <span className="font-semibold text-white">{post.skater.nombre}</span>
                <span className="text-gray-300 ml-2">
                  Living the dream at {post.skater.edad} years old! 
                  <span className="text-orange-400"> #{post.skater.especialidad.toLowerCase()}</span>
                  <span className="text-blue-400"> #xgames</span>
                  <span className="text-green-400"> #skateboarding</span>
                </span>
              </div>

              {/* Comments preview */}
              <div className="text-xs text-gray-400 space-y-1">
                <p>
                  <span className="font-semibold text-white">skater_fan_01</span> Incredible skills! 🔥
                </p>
                <p>
                  <span className="font-semibold text-white">pro_skater_23</span> Keep pushing the limits! 
                </p>
                <button className="text-gray-500 hover:text-gray-300">
                  View all {Math.floor(Math.random() * 50) + 10} comments
                </button>
              </div>

              {/* Time */}
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                {Math.floor(Math.random() * 24) + 1} hours ago
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FavoritesRanking;