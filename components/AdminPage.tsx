import React, { useState } from 'react';
import { AppSettings, StyleSettings } from '../types';

interface AdminPageProps {
  currentSettings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onCancel: () => void;
  onLogout: () => void;
}

const colorOptions = [
  { name: 'White', value: 'text-white' },
  { name: 'Light Gray', value: 'text-gray-300' },
  { name: 'Gray', value: 'text-gray-400' },
  { name: 'Cyan', value: 'text-cyan-400' },
  { name: 'Yellow', value: 'text-yellow-300' },
  { name: 'Green', value: 'text-green-400' },
];

const AdminPage: React.FC<AdminPageProps> = ({ currentSettings, onSave, onCancel, onLogout }) => {
  const [settings, setSettings] = useState(currentSettings);

  const handleSave = () => {
    if (settings.channelId.trim()) {
      onSave(settings);
    } else {
      alert('Channel ID cannot be empty.');
    }
  };

  const handleStyleChange = (key: keyof StyleSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      styleSettings: { ...prev.styleSettings, [key]: value },
    }));
  };
  
  const handleSocialChange = (key: keyof AppSettings['socialLinks'], value: string) => {
    setSettings(prev => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [key]: value },
    }));
  };

  const ColorSelector: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
  }> = ({ label, value, onChange }) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {colorOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 text-sm rounded-md transition-all duration-200 ${
              value === option.value
                ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-800 scale-105'
                : 'bg-gray-700 hover:bg-gray-600'
            } ${option.value}`}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
  
  const InputField: React.FC<{
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    helpText?: string;
  }> = ({ label, id, value, onChange, placeholder, type = 'text', helpText }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
            {label}
        </label>
        <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
        {helpText && <p className="mt-2 text-xs text-gray-500">{helpText}</p>}
    </div>
  );


  return (
    <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Admin Settings</h2>
        <button onClick={onLogout} className="text-sm text-indigo-400 hover:text-indigo-300">Logout</button>
      </div>
      
      <div className="space-y-8">
        <div className="p-6 bg-gray-900/50 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">YouTube Configuration</h3>
          <div className="space-y-4">
            <InputField
              label="YouTube Channel ID"
              id="channelId"
              value={settings.channelId}
              onChange={(e) => setSettings({ ...settings, channelId: e.target.value })}
              placeholder="Enter YouTube Channel ID"
            />
            <InputField
              label="YouTube API Key"
              id="apiKey"
              type="password"
              value={settings.apiKey}
              onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
              placeholder="Enter your YouTube API Key"
              helpText="Your API key is stored locally in your browser and is required to fetch videos."
            />
          </div>
        </div>

        <div className="p-6 bg-gray-900/50 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Appearance</h3>
           <div className="space-y-6">
            <InputField
              label="Banner Image URL"
              id="bannerUrl"
              value={settings.bannerImageUrl}
              onChange={(e) => setSettings({ ...settings, bannerImageUrl: e.target.value })}
              placeholder="https://example.com/banner.jpg"
            />
            <ColorSelector
              label="Title Color"
              value={settings.styleSettings.titleColor}
              onChange={(color) => handleStyleChange('titleColor', color)}
            />
            <ColorSelector
              label="Description Color"
              value={settings.styleSettings.descriptionColor}
              onChange={(color) => handleStyleChange('descriptionColor', color)}
            />
           </div>
        </div>
        
        <div className="p-6 bg-gray-900/50 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Social Links</h3>
          <div className="space-y-4">
            <InputField
              label="Facebook URL"
              id="facebookUrl"
              value={settings.socialLinks.facebook}
              onChange={(e) => handleSocialChange('facebook', e.target.value)}
              placeholder="https://facebook.com/your-page"
            />
            <InputField
              label="X (Twitter) URL"
              id="twitterUrl"
              value={settings.socialLinks.twitter}
              onChange={(e) => handleSocialChange('twitter', e.target.value)}
              placeholder="https://x.com/your-handle"
            />
            <InputField
              label="YouTube Channel URL"
              id="youtubeUrl"
              value={settings.socialLinks.youtube}
              onChange={(e) => handleSocialChange('youtube', e.target.value)}
              placeholder="https://youtube.com/your-channel"
            />
          </div>
        </div>

      </div>

      <div className="mt-8 flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
