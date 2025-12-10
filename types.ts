export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
}

export interface StyleSettings {
  titleColor: string;
  descriptionColor: string;
}

export interface SocialLinks {
  facebook: string;
  twitter: string;
  youtube: string;
}

export interface AppSettings {
  channelId: string;
  apiKey: string;
  styleSettings: StyleSettings;
  bannerImageUrl: string;
  socialLinks: SocialLinks;
}