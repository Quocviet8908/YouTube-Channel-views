import { AppSettings } from '../types';

const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1FQWYa4qY0nSr9m8Y9Sjl6_teF8Ix9EtdeYVcpaF67cQ/export?format=csv';

// Default settings in case the sheet is missing some values
const DEFAULTS = {
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

const parseCSV = (csvText: string): Map<string, string> => {
  const rows = csvText.split(/\r?\n/);
  const settingsMap = new Map<string, string>();
  rows.forEach(row => {
    const firstCommaIndex = row.indexOf(',');
    if (firstCommaIndex > -1) {
      let key = row.substring(0, firstCommaIndex);
      let value = row.substring(firstCommaIndex + 1);

      // Handle CSV quotes that Google Sheets might add
      if (key.startsWith('"') && key.endsWith('"')) {
        key = key.slice(1, -1);
      }
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }

      key = key.trim();
      value = value.trim();

      if (key && value) {
        settingsMap.set(key, value);
      }
    }
  });
  return settingsMap;
};

export const getSettingsFromGoogleSheet = async (): Promise<AppSettings> => {
  try {
    const response = await fetch(GOOGLE_SHEET_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch Google Sheet: ${response.statusText}`);
    }
    const csvText = await response.text();
    const settingsMap = parseCSV(csvText);

    return {
      channelId: settingsMap.get('UID') || '',
      apiKey: settingsMap.get('API') || '',
      bannerImageUrl: settingsMap.get('CH Image Link') || DEFAULTS.bannerImageUrl,
      socialLinks: {
        facebook: settingsMap.get('FB Link') || DEFAULTS.socialLinks.facebook,
        twitter: settingsMap.get('X (Twitter) URL') || DEFAULTS.socialLinks.twitter,
        youtube: settingsMap.get('Youtube Link') || DEFAULTS.socialLinks.youtube,
      },
      styleSettings: DEFAULTS.styleSettings, // Style settings are not in the sheet, so we use defaults.
    };
  } catch (error) {
    console.error('Error fetching or parsing Google Sheet:', error);
    throw error;
  }
};