import { YouTubeVideo, YouTubePlaylist } from '../types';

const MOCK_VIDEOS: YouTubeVideo[] = [
  {
    id: 'mock1',
    title: 'Mastering TypeScript Generics',
    description: 'Unlock the full potential of TypeScript by mastering generics for creating reusable and type-safe components and functions.',
    thumbnailUrl: 'https://placehold.co/480x360/1a202c/718096.png?text=TypeScript',
  },
  {
    id: 'mock2',
    title: 'Designing for the Future: AI in UX',
    description: 'Explore how artificial intelligence is reshaping user experience design, from personalization to predictive interfaces.',
    thumbnailUrl: 'https://placehold.co/480x360/1a202c/718096.png?text=AI+in+UX',
  },
  {
    id: 'mock3',
    title: 'The Art of Micro-interactions',
    description: 'Discover how small, thoughtful animations and feedback can significantly improve the user experience and make your app feel alive.',
    thumbnailUrl: 'https://placehold.co/480x360/1a202c/718096.png?text=Micro-interactions',
  },
  {
    id: 'mock4',
    title: 'React State Management in 2024',
    description: 'A deep dive into modern state management libraries for React, including Zustand, Jotai, and Recoil. Which one is right for your project?',
    thumbnailUrl: 'https://placehold.co/480x360/1a202c/718096.png?text=React+State',
  },
  {
    id: 'mock5',
    title: 'WebAssembly: The Next Frontier',
    description: 'A look into the potential of WebAssembly (Wasm) to bring near-native performance to web applications.',
    thumbnailUrl: 'https://placehold.co/480x360/1a202c/718096.png?text=Wasm',
  },
  {
    id: 'mock6',
    title: 'Building a Design System with Tailwind CSS',
    description: 'Learn the fundamentals of creating a scalable and maintainable design system using the power of Tailwind CSS utility classes.',
    thumbnailUrl: 'https://placehold.co/480x360/1a202c/718096.png?text=Tailwind+CSS',
  },
  {
    id: 'mock7',
    title: 'A Guide to Server-Side Rendering (SSR)',
    description: 'Understand the benefits and trade-offs of SSR with frameworks like Next.js and Remix for better SEO and performance.',
    thumbnailUrl: 'https://placehold.co/480x360/1a202c/718096.png?text=SSR',
  },
  {
    id: 'mock8',
    title: 'Accessibility in Modern Web Development',
    description: 'Essential techniques and best practices for building inclusive web applications that are usable by everyone.',
    thumbnailUrl: 'https://placehold.co/480x360/1a202c/718096.png?text=A11y',
  },
];

const MOCK_PLAYLISTS: YouTubePlaylist[] = [
  {
    id: 'PL_mock1',
    title: 'Getting Started with React',
    description: 'A complete series for beginners to learn React from scratch, covering hooks, state, props, and more.',
    thumbnailUrl: 'https://placehold.co/480x360/2d3748/e2e8f0.png?text=React+Playlist',
  },
  {
    id: 'PL_mock2',
    title: 'Advanced CSS Techniques',
    description: 'Dive deep into modern CSS features like Grid, Flexbox, Custom Properties, and animations.',
    thumbnailUrl: 'https://placehold.co/480x360/2d3748/e2e8f0.png?text=CSS+Playlist',
  },
  {
    id: 'PL_mock3',
    title: 'Node.js Backend Development',
    description: 'Learn how to build robust and scalable server-side applications with Node.js, Express, and MongoDB.',
    thumbnailUrl: 'https://placehold.co/480x360/2d3748/e2e8f0.png?text=Node.js+Playlist',
  },
    {
    id: 'PL_mock4',
    title: 'Full-Stack Project Builds',
    description: 'Follow along as we build complete, real-world applications from front-end to back-end.',
    thumbnailUrl: 'https://placehold.co/480x360/2d3748/e2e8f0.png?text=Full-Stack',
  },
];


interface VideoResponse {
  videos: YouTubeVideo[];
  nextPageToken: string | null;
  error: string | null;
}

export const getVideosByChannelId = async (
    channelId: string, 
    apiKey: string, 
    maxResults: number,
    pageToken?: string
): Promise<VideoResponse> => {
  if (!apiKey) {
    const errorMsg = 'YouTube API key is not provided. Please add one in the admin settings. Displaying sample data.';
    console.warn(errorMsg);
    return { videos: MOCK_VIDEOS.slice(0, maxResults), nextPageToken: null, error: errorMsg };
  }
  
  if (!channelId) {
    return { videos: [], nextPageToken: null, error: null };
  }

  let YOUTUBE_API_URL = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}&type=video`;
  if(pageToken) {
    YOUTUBE_API_URL += `&pageToken=${pageToken}`;
  }

  try {
    const response = await fetch(YOUTUBE_API_URL);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API Error:', errorData);
      const errorMessage = errorData.error?.message || `API request failed with status ${response.status}`;
      const fullError = `Failed to fetch videos from YouTube. Reason: ${errorMessage}. Displaying sample data.`;
      return { videos: MOCK_VIDEOS, nextPageToken: null, error: fullError };
    }

    const data = await response.json();

    if (!data.items) {
      return { videos: [], nextPageToken: null, error: null };
    }
    
    const nextPageToken = data.nextPageToken || null;

    const videos: YouTubeVideo[] = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high.url,
    }));

    return { videos, nextPageToken, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    const fullError = `Network or parsing error when fetching videos: ${errorMessage}. Displaying sample data.`;
    console.error(fullError, error);
    return { videos: MOCK_VIDEOS, nextPageToken: null, error: fullError };
  }
};

interface PlaylistResponse {
    playlists: YouTubePlaylist[];
    error: string | null;
}

export const getPlaylistsByChannelId = async (channelId: string, apiKey: string): Promise<PlaylistResponse> => {
    if (!apiKey) {
        return { playlists: MOCK_PLAYLISTS, error: 'YouTube API key not provided. Displaying sample playlists.' };
    }
    if (!channelId) {
        return { playlists: [], error: null };
    }

    const YOUTUBE_PLAYLIST_API_URL = `https://www.googleapis.com/youtube/v3/playlists?key=${apiKey}&channelId=${channelId}&part=snippet&maxResults=25`;

    try {
        const response = await fetch(YOUTUBE_PLAYLIST_API_URL);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('YouTube API Error (Playlists):', errorData);
            const errorMessage = errorData.error?.message || `API request failed with status ${response.status}`;
            const fullError = `Failed to fetch playlists. Reason: ${errorMessage}. Displaying sample data.`;
            return { playlists: MOCK_PLAYLISTS, error: fullError };
        }
        const data = await response.json();

        if (!data.items) {
            return { playlists: [], error: null };
        }

        const playlists: YouTubePlaylist[] = data.items.map((item: any) => ({
            id: item.id,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnailUrl: item.snippet.thumbnails.high.url,
        }));
        
        return { playlists, error: null };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        const fullError = `Network or parsing error when fetching playlists: ${errorMessage}. Displaying sample data.`;
        console.error(fullError, error);
        return { playlists: MOCK_PLAYLISTS, error: fullError };
    }
};