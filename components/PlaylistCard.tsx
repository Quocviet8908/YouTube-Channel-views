import React from 'react';
import { YouTubePlaylist, StyleSettings } from '../types';

interface PlaylistCardProps {
  playlist: YouTubePlaylist;
  styles: StyleSettings;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, styles }) => {
  return (
    <a
      href={`https://www.youtube.com/playlist?list=${playlist.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="flex flex-col gap-3">
        <div className="aspect-video overflow-hidden rounded-lg bg-gray-800 shadow-lg">
          <img
            src={playlist.thumbnailUrl}
            alt={playlist.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div>
          <h3 className={`font-semibold text-base leading-snug transition-colors ${styles.titleColor}`}>
            {playlist.title}
          </h3>
          <p className={`text-sm mt-1 leading-relaxed transition-colors ${styles.descriptionColor} line-clamp-2`}>
            {playlist.description || "No description available."}
          </p>
        </div>
      </div>
    </a>
  );
};

export default PlaylistCard;
