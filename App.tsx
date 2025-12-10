import React, { useState, useEffect, useCallback } from 'react';
import MainPage from './components/MainPage';
import AdminPage from './components/AdminPage';
import LoginPage from './components/LoginPage';
import { YouTubeVideo, AppSettings, YouTubePlaylist } from './types';
import { getVideosByChannelId, getPlaylistsByChannelId } from './services/youtubeService';

type Location = 'main' | 'login' | 'admin';

const DEFAULT_SETTINGS: AppSettings = {
  channelId: 'UC-lHJZR3Gqxm24_Vd_AJ5Yw', // Google's channel
  apiKey: '',
  styleSettings: {
    titleColor: 'text-white',
    descriptionColor: 'text-gray-400',
  },
  bannerImageUrl: 'https://placehold.co/1200x400/1a202c/1a202c.png?text=+',
  socialLinks: {
    facebook: '',
    twitter: '',
    youtube: '',
  },
};

const App: React.FC = () => {
  const [location, setLocation] = useState<Location>('main');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [playlists, setPlaylists] = useState<YouTubePlaylist[]>([]);
  const [videoNextPageToken, setVideoNextPageToken] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('youtubeAppSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (err) {
      console.error('Failed to load settings from localStorage', err);
      setSettings(DEFAULT_SETTINGS);
    }
  }, []);

  const fetchInitialData = useCallback(async () => {
    if (!settings.channelId) {
      setVideos([]);
      setPlaylists([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    const { videos: fetchedVideos, nextPageToken, error: videoError } = await getVideosByChannelId(settings.channelId, settings.apiKey, 30);
    setVideos(fetchedVideos);
    setVideoNextPageToken(nextPageToken);
    
    const { playlists: fetchedPlaylists, error: playlistError } = await getPlaylistsByChannelId(settings.channelId, settings.apiKey);
    setPlaylists(fetchedPlaylists);

    if (videoError || playlistError) {
      setError(videoError || playlistError);
    }
    
    setIsLoading(false);
  }, [settings.channelId, settings.apiKey]);
  
  const handleLoadMore = useCallback(async () => {
    if (!videoNextPageToken || isLoadingMore) return;

    setIsLoadingMore(true);
    const { videos: newVideos, nextPageToken: newNextPageToken, error: fetchError } = await getVideosByChannelId(
        settings.channelId,
        settings.apiKey,
        50,
        videoNextPageToken
    );
    if(fetchError) {
        setError(fetchError);
    } else {
        setVideos(prev => [...prev, ...newVideos]);
        setVideoNextPageToken(newNextPageToken);
    }
    setIsLoadingMore(false);
  }, [settings.channelId, settings.apiKey, videoNextPageToken, isLoadingMore]);


  useEffect(() => {
    if (location === 'main') {
      fetchInitialData();
    }
  }, [fetchInitialData, location]);

  const handleLogin = (password: string) => {
    if (password === '1234567890') {
      setIsAuthenticated(true);
      setLocation('admin');
      setAuthError(null);
    } else {
      setAuthError('Incorrect password. Please try again.');
    }
  };
  
  const handleLogout = () => {
      setIsAuthenticated(false);
      setLocation('main');
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('youtubeAppSettings', JSON.stringify(newSettings));
    } catch (err) {
      console.error('Failed to save settings to localStorage', err);
    }
    setLocation('main');
  };

  const renderContent = () => {
    if (location === 'admin') {
      if (isAuthenticated) {
        return (
          <AdminPage
            currentSettings={settings}
            onSave={handleSaveSettings}
            onCancel={() => setLocation('main')}
            onLogout={handleLogout}
          />
        );
      }
      // if not authenticated, redirect to login
      setLocation('login');
      return null;
    }

    if (location === 'login') {
      return <LoginPage onLogin={handleLogin} error={authError} />;
    }

    return (
      <MainPage
        videos={videos}
        playlists={playlists}
        settings={settings}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        error={error}
        onNavigateToLogin={() => setLocation('login')}
        onLoadMore={handleLoadMore}
        hasNextPage={!!videoNextPageToken}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;