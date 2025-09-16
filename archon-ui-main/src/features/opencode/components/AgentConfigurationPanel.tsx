import React, { useState } from 'react';
import { AgentFile, PROVIDER_CONFIGS, COMMON_PERMISSIONS } from '../types';

interface AgentConfigurationPanelProps {
  agent: AgentFile;
  onConfigurationUpdate: (agentId: string, config: Partial<AgentFile['metadata']>) => void;
}

export const AgentConfigurationPanel: React.FC<AgentConfigurationPanelProps> = ({
  agent,
  onConfigurationUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempConfig, setTempConfig] = useState(agent.metadata);

  const handleProviderChange = (provider: string) => {
    const providerConfig = PROVIDER_CONFIGS[provider];
    setTempConfig({
      ...tempConfig,
      provider: provider as any,
      model: providerConfig.defaultModel,
    });
  };

  const handleModelChange = (model: string) => {
    setTempConfig({ ...tempConfig, model });
  };

  const handlePermissionToggle = (permission: string) => {
    const currentPermissions = tempConfig.permissions || [];
    const newPermissions = currentPermissions.includes(permission)
      ? currentPermissions.filter(p => p !== permission)
      : [...currentPermissions, permission];

    setTempConfig({ ...tempConfig, permissions: newPermissions });
  };

  const handleSave = () => {
    onConfigurationUpdate(agent.id, tempConfig);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempConfig(agent.metadata);
    setIsEditing(false);
  };

  const currentProviderConfig = PROVIDER_CONFIGS[tempConfig.provider];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Configuration</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>
        ) : (
          <div className="space-x-2">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Provider Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Provider
          </label>
          {isEditing ? (
            <select
              value={tempConfig.provider}
              onChange={(e) => handleProviderChange(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(PROVIDER_CONFIGS).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
              {PROVIDER_CONFIGS[tempConfig.provider]?.name || tempConfig.provider}
            </div>
          )}
        </div>

        {/* Model Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model
          </label>
          {isEditing ? (
            <select
              value={tempConfig.model}
              onChange={(e) => handleModelChange(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {currentProviderConfig?.models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
              {tempConfig.model}
            </div>
          )}
        </div>

        {/* Temperature */}
        {currentProviderConfig?.supportsTemperature && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temperature
            </label>
            {isEditing ? (
              <input
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={tempConfig.temperature || 0.7}
                onChange={(e) => setTempConfig({ ...tempConfig, temperature: parseFloat(e.target.value) })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                {tempConfig.temperature || 0.7}
              </div>
            )}
          </div>
        )}

        {/* Max Tokens */}
        {currentProviderConfig?.supportsMaxTokens && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Tokens
            </label>
            {isEditing ? (
              <input
                type="number"
                min="1"
                max="32768"
                value={tempConfig.maxTokens || 4096}
                onChange={(e) => setTempConfig({ ...tempConfig, maxTokens: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                {tempConfig.maxTokens || 4096}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Permissions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Permissions
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {COMMON_PERMISSIONS.map((permission) => {
            const isSelected = tempConfig.permissions?.includes(permission) || false;
            return (
              <label key={permission} className="flex items-center space-x-2">
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handlePermissionToggle(permission)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                ) : (
                  <div className={`w-4 h-4 rounded border-2 ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                    {isSelected && <div className="w-full h-full rounded-sm bg-white scale-50"></div>}
                  </div>
                )}
                <span className="text-sm text-gray-700 capitalize">{permission}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Custom Fields for Local Provider */}
      {tempConfig.provider === 'local' && currentProviderConfig?.customFields && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Local Model Settings</h4>
          {currentProviderConfig.customFields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              {isEditing ? (
                <input
                  type={field.type}
                  value={tempConfig.customSettings?.[field.name] || ''}
                  onChange={(e) => setTempConfig({
                    ...tempConfig,
                    customSettings: {
                      ...tempConfig.customSettings,
                      [field.name]: e.target.value
                    }
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={field.required}
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                  {tempConfig.customSettings?.[field.name] || 'Not set'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};