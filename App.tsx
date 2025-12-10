import React, { useState, useEffect, useCallback } from 'react';
import MainPage from './components/MainPage';
import { YouTubeVideo, AppSettings, YouTubePlaylist } from './types';
import { getVideosByChannelId, getPlaylistsByChannelId } from './services/youtubeService';
import { getSettingsFromGoogleSheet } from './services/googleSheetService';

const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [playlists, setPlaylists] = useState<YouTubePlaylist[]>([]);
  const [videoNextPageToken, setVideoNextPageToken] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const sheetSettings = await getSettingsFromGoogleSheet();
        setSettings(sheetSettings);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(`Failed to load configuration from Google Sheet: ${errorMessage}`);
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const fetchInitialData = useCallback(async () => {
    if (!settings || !settings.channelId || !settings.apiKey) {
        if(settings) { // if settings are loaded but incomplete
            setError("Channel ID or API Key is missing in the Google Sheet configuration. Displaying sample data.");
            const { videos: mockVideos } = await getVideosByChannelId('', '', 30);
            const { playlists: mockPlaylists } = await getPlaylistsByChannelId('', '');
            setVideos(mockVideos);
            setPlaylists(mockPlaylists);
        }
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
  }, [settings]);
  
  const handleLoadMore = useCallback(async () => {
    if (!videoNextPageToken || isLoadingMore || !settings) return;

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
  }, [settings, videoNextPageToken, isLoadingMore]);


  useEffect(() => {
    if (settings) {
      fetchInitialData();
    }
  }, [fetchInitialData, settings]);


  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="container mx-auto p-4 md:p-8">
        {settings && (
            <MainPage
                videos={videos}
                playlists={playlists}
                settings={settings}
                isLoading={isLoading}
                isLoadingMore={isLoadingMore}
                error={error}
                onLoadMore={handleLoadMore}
                hasNextPage={!!videoNextPageToken}
            />
        )}
        {!settings && isLoading && (
            <div className="flex flex-col items-center justify-center h-96">
                <p className="mt-4 text-gray-400">Loading Configuration...</p>
            </div>
        )}
         {!settings && !isLoading && error && (
            <div className="flex flex-col items-center justify-center text-center text-red-400 bg-red-900/20 rounded-lg p-6">
                <p className="mt-4 font-semibold">Fatal Error</p>
                <p className="text-red-300 mt-1 text-sm max-w-2xl">{error}</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default App;