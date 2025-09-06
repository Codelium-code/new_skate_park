import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  website: string;
  description: string;
}

const SponsorsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const sponsors: Sponsor[] = [
    {
      id: 'vans',
      name: 'Vans',
      logo: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop',
      website: 'https://www.vans.com',
      description: 'Off The Wall since 1966'
    },
    {
      id: 'nike-sb',
      name: 'Nike SB',
      logo: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop',
      website: 'https://www.nike.com/skateboarding',
      description: 'Just Do It - Skateboarding'
    },
    {
      id: 'thrasher',
      name: 'Thrasher',
      logo: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop',
      website: 'https://www.thrashermagazine.com',
      description: 'Skate and Destroy'
    },
    {
      id: 'element',
      name: 'Element',
      logo: 'https://images.pexels.com/photos/1619654/pexels-photo-1619654.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop',
      website: 'https://www.elementbrand.com',
      description: 'Nature, Skateboarding, Music, Art'
    },
    {
      id: 'independent',
      name: 'Independent',
      logo: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop',
      website: 'https://www.independenttrucks.com',
      description: 'Built to Grind'
    },
    {
      id: 'spitfire',
      name: 'Spitfire',
      logo: 'https://images.pexels.com/photos/1670045/pexels-photo-1670045.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop',
      website: 'https://www.spitfirewheels.com',
      description: 'Burn Forever'
    },
    {
      id: 'bones',
      name: 'Bones Bearings',
      logo: 'https://images.pexels.com/photos/1670046/pexels-photo-1670046.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop',
      website: 'https://www.bonesbearings.com',
      description: 'The Best Skateboard Bearings'
    },
    {
      id: 'santa-cruz',
      name: 'Santa Cruz',
      logo: 'https://images.pexels.com/photos/1670048/pexels-photo-1670048.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop',
      website: 'https://www.santacruzskateboards.com',
      description: 'Screaming Hand Since 1973'
    }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === sponsors.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isHovered, sponsors.length]);

  const handleSponsorClick = (sponsor: Sponsor) => {
    // For now, we'll just log the click. Later this will navigate to a dedicated page
    console.log(`Clicked on sponsor: ${sponsor.name}`);
    // TODO: Navigate to sponsor detail page
    // navigate(`/sponsor/${sponsor.id}`);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === sponsors.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? sponsors.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Nuestros Auspiciadores</h2>
        <p className="text-gray-300">Marcas que apoyan la cultura del skateboarding</p>
      </div>

      <div 
        className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Carousel */}
        <div className="relative h-32 flex items-center justify-center">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {sponsors.map((sponsor, index) => (
              <div
                key={sponsor.id}
                className="w-full flex-shrink-0 flex items-center justify-center px-4"
              >
                <button
                  onClick={() => handleSponsorClick(sponsor)}
                  className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/20 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 w-64 h-24 flex items-center justify-center"
                >
                  {/* Logo placeholder with brand styling */}
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {sponsor.name.charAt(0)}
                      </span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-bold text-lg group-hover:text-orange-400 transition-colors">
                        {sponsor.name}
                      </h3>
                      <p className="text-gray-400 text-xs group-hover:text-gray-300 transition-colors">
                        {sponsor.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* External link icon */}
                  <ExternalLink 
                    size={16} 
                    className="absolute top-2 right-2 text-gray-400 group-hover:text-orange-400 transition-colors opacity-0 group-hover:opacity-100" 
                  />
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-orange-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2 mt-6">
          {sponsors.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-orange-400 w-6' 
                  : 'bg-gray-600 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Sponsor Grid Preview (visible on larger screens) */}
        <div className="hidden lg:block mt-8 pt-6 border-t border-white/10">
          <div className="grid grid-cols-4 gap-4">
            {sponsors.slice(0, 4).map((sponsor) => (
              <button
                key={`preview-${sponsor.id}`}
                onClick={() => handleSponsorClick(sponsor)}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/30 rounded-lg p-3 transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {sponsor.name.charAt(0)}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm font-medium group-hover:text-orange-400 transition-colors">
                      {sponsor.name}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Auto-scroll indicator */}
        <div className="absolute bottom-2 left-4 text-xs text-gray-500">
          {isHovered ? 'Paused' : 'Auto-scrolling'}
        </div>
      </div>
    </div>
  );
};

export default SponsorsCarousel;