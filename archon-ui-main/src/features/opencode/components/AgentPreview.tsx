import React, { useState } from 'react';
import { AgentFile } from '../types';

interface AgentPreviewProps {
  agent: AgentFile;
}

export const AgentPreview: React.FC<AgentPreviewProps> = ({ agent }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'metadata' | 'parsed'>('content');

  const parseFrontmatter = (content: string) => {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontmatterMatch) return { frontmatter: {}, body: content };

    const frontmatterStr = frontmatterMatch[1];
    const body = frontmatterMatch[2];

    const frontmatter: Record<string, any> = {};
    frontmatterStr.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim();
        frontmatter[key.trim()] = value;
      }
    });

    return { frontmatter, body };
  };

  const { frontmatter, body } = parseFrontmatter(agent.content);

  const renderContent = () => {
    switch (activeTab) {
      case 'content':
        return (
          <div className="h-full overflow-auto">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap p-4 bg-gray-50 rounded-lg border">
              {agent.content}
            </pre>
          </div>
        );

      case 'metadata':
        return (
          <div className="h-full overflow-auto p-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">File Information</h4>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Name:</span>
                    <span className="text-sm font-medium">{agent.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Path:</span>
                    <span className="text-sm font-medium">{agent.path}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="text-sm font-medium capitalize">{agent.type}</span>
                  </div>
                  {agent.size && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Size:</span>
                      <span className="text-sm font-medium">{agent.size} bytes</span>
                    </div>
                  )}
                  {agent.lastModified && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Modified:</span>
                      <span className="text-sm font-medium">
                        {agent.lastModified.toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Configuration</h4>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Provider:</span>
                    <span className="text-sm font-medium capitalize">{agent.metadata.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Model:</span>
                    <span className="text-sm font-medium">{agent.metadata.model}</span>
                  </div>
                  {agent.metadata.temperature && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Temperature:</span>
                      <span className="text-sm font-medium">{agent.metadata.temperature}</span>
                    </div>
                  )}
                  {agent.metadata.maxTokens && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Max Tokens:</span>
                      <span className="text-sm font-medium">{agent.metadata.maxTokens}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Permissions:</span>
                    <div className="flex flex-wrap gap-1">
                      {agent.metadata.permissions.map((perm) => (
                        <span key={perm} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'parsed':
        return (
          <div className="h-full overflow-auto p-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Frontmatter</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <pre className="text-sm text-gray-800">
                    {JSON.stringify(frontmatter, null, 2)}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Content Body</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-800 whitespace-pre-wrap">
                    {body}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          {[
            { id: 'content', label: 'Raw Content', icon: '📄' },
            { id: 'metadata', label: 'Metadata', icon: 'ℹ️' },
            { id: 'parsed', label: 'Parsed', icon: '🔍' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};