import React from 'react';
import { AgentFile } from '../types';

interface AgentFileBrowserProps {
  agentFiles: AgentFile[];
  selectedAgent: AgentFile | null;
  onAgentSelect: (agent: AgentFile) => void;
}

export const AgentFileBrowser: React.FC<AgentFileBrowserProps> = ({
  agentFiles,
  selectedAgent,
  onAgentSelect,
}) => {
  const getAgentIcon = (type: AgentFile['type']) => {
    switch (type) {
      case 'agent':
        return '🤖';
      case 'subagent':
        return '⚙️';
      case 'command':
        return '💻';
      default:
        return '📄';
    }
  };

  const getTypeColor = (type: AgentFile['type']) => {
    switch (type) {
      case 'agent':
        return 'bg-blue-100 text-blue-800';
      case 'subagent':
        return 'bg-green-100 text-green-800';
      case 'command':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Agent Files</h2>
        <p className="text-sm text-gray-600 mt-1">
          {agentFiles.length} files available
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {agentFiles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-2xl mb-2">📂</div>
              <p>No agent files found</p>
              <p className="text-xs mt-1">Connect to an OpenCode repository</p>
            </div>
          ) : (
            <div className="space-y-1">
              {agentFiles.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => onAgentSelect(agent)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedAgent?.id === agent.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-lg">{getAgentIcon(agent.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {agent.name}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(agent.type)}`}>
                          {agent.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {agent.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs text-gray-500">
                          {agent.metadata.provider}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {agent.metadata.model}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          Connect Repository
        </button>
      </div>
    </div>
  );
};