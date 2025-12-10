import React from 'react';
import VideoCard from './VideoCard';
import PlaylistCard from './PlaylistCard';
import { YouTubeVideo, AppSettings, YouTubePlaylist } from '../types';
import { LoadingSpinner, ErrorIcon, FacebookIcon, TwitterIcon, YoutubeIcon } from './Icons';

interface MainPageProps {
  videos: YouTubeVideo[];
  playlists: YouTubePlaylist[];
  settings: AppSettings;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  onLoadMore: () => void;
  hasNextPage: boolean;
}

const MainPage: React.FC<MainPageProps> = ({ 
  videos, 
  playlists,
  settings, 
  isLoading, 
  isLoadingMore,
  error, 
  onLoadMore,
  hasNextPage
}) => {
  const { styleSettings, bannerImageUrl, socialLinks } = settings;
  
  const renderVideoGrid = () => {
    if (!isLoading && videos.length === 0) {
      return (
        <div className="text-center h-64 flex items-center justify-center">
          <p className="text-gray-500">No videos found for this channel.</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} styles={styleSettings} />
        ))}
      </div>
    );
  };

  const renderPlaylistGrid = () => {
    if (!isLoading && playlists.length === 0) {
      return (
         <div className="text-center h-32 flex items-center justify-center">
          <p className="text-gray-500">No playlists found for this channel.</p>
        </div>
      )
    }
    return (
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} styles={styleSettings} />
        ))}
      </div>
    )
  }

  return (
    <main>
       <header className="relative mb-8 md:mb-12">
        <div className="aspect-[3/1] w-full bg-gray-800 rounded-lg overflow-hidden">
          <img src={bannerImageUrl} alt="Channel banner" className="w-full h-full object-cover"/>
        </div>
      </header>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-96">
          <LoadingSpinner />
          <p className="mt-4 text-gray-400">Loading Content...</p>
        </div>
      ) : (
        <>
          {error && (
            <div className="flex flex-col items-center justify-center text-center text-red-400 bg-red-900/20 rounded-lg p-6 mb-8">
              <ErrorIcon />
              <p className="mt-4 font-semibold">Could Not Fetch Live Data</p>
              <p className="text-red-300 mt-1 text-sm max-w-2xl">{error}</p>
            </div>
          )}
          
          <h2 className="text-3xl font-bold text-white mb-6">Latest Videos</h2>
          {renderVideoGrid()}

          {hasNextPage && (
            <div className="text-center mt-12">
              <button
                onClick={onLoadMore}
                disabled={isLoadingMore}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-md transition-all duration-200 disabled:bg-indigo-900/50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
              >
                {isLoadingMore ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-2">Loading...</span>
                  </>
                ) : (
                  'Load More Videos'
                )}
              </button>
            </div>
          )}
          
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-6">Playlists</h2>
            {renderPlaylistGrid()}
          </div>
        </>
      )}

      <footer className="mt-16 pt-8 border-t border-gray-800 flex justify-center items-center gap-6">
        {socialLinks.facebook && (
          <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
            <FacebookIcon className="h-6 w-6" />
          </a>
        )}
        {socialLinks.twitter && (
          <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
            <TwitterIcon className="h-6 w-6" />
          </a>
        )}
        {socialLinks.youtube && (
          <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
            <YoutubeIcon className="h-6 w-6" />
          </a>
        )}
      </footer>
    </main>
  );
};

export default MainPage;