
import React from 'react';
import { YouTubeVideo, StyleSettings } from '../types';

interface VideoCardProps {
  video: YouTubeVideo;
  styles: StyleSettings;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, styles }) => {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="flex flex-col gap-3">
        <div className="aspect-video overflow-hidden rounded-lg bg-gray-800 shadow-lg">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div>
          <h3 className={`font-semibold text-base leading-snug transition-colors ${styles.titleColor}`}>
            {video.title}
          </h3>
          <p className={`text-sm mt-1 leading-relaxed transition-colors ${styles.descriptionColor}`}>
            {video.description}
          </p>
        </div>
      </div>
    </a>
  );
};

export default VideoCard;
