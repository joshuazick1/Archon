import React, { useState, useEffect } from 'react';
import { AgentFileBrowser } from './components/AgentFileBrowser';
import { AgentConfigurationPanel } from './components/AgentConfigurationPanel';
import { AgentPreview } from './components/AgentPreview';
import { AgentFile } from './types';

export const OpenCodePage: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentFile | null>(null);
  const [agentFiles, setAgentFiles] = useState<AgentFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAgentFiles();
  }, []);

  const loadAgentFiles = async () => {
    try {
      // Connect to Archon's MCP server to fetch OpenCode agent files
      const response = await fetch('/api/opencode/agents', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (response.ok) {
        const files = await response.json();
        setAgentFiles(files);
      } else {
        console.error('Failed to load agent files:', response.status, response.statusText);
        // Fallback to mock data for development
        setAgentFiles(getMockAgentFiles());
      }
    } catch (error) {
      console.error('Failed to load agent files:', error);
      // Fallback to mock data for development
      setAgentFiles(getMockAgentFiles());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockAgentFiles = () => [
    {
      id: 'docs-agent',
      name: 'docs.md',
      path: '.opencode/agent/docs.md',
      type: 'agent',
      description: 'ALWAYS use this when writing docs',
      content: '---\ndescription: ALWAYS use this when writing docs\n---\n\nYou are an expert technical documentation writer...',
      metadata: {
        provider: 'anthropic',
        model: 'claude-3-sonnet-20240229',
        permissions: ['read', 'write']
      }
    },
    {
      id: 'git-committer',
      name: 'git-committer.md',
      path: '.opencode/agent/git-committer.md',
      type: 'subagent',
      description: 'Use this agent when you are asked to commit and push code changes',
      content: '---\ndescription: Use this agent when you are asked to commit and push code changes to a git repository.\nmode: subagent\n---\n\nYou commit and push to git...',
      metadata: {
        provider: 'openai',
        model: 'gpt-4',
        permissions: ['git']
      }
    }
  ];

  const handleAgentSelect = (agent: AgentFile) => {
    setSelectedAgent(agent);
  };

  const handleConfigurationUpdate = (agentId: string, config: Partial<AgentFile['metadata']>) => {
    setAgentFiles(prev =>
      prev.map(agent =>
        agent.id === agentId
          ? { ...agent, metadata: { ...agent.metadata, ...config } }
          : agent
      )
    );

    if (selectedAgent?.id === agentId) {
      setSelectedAgent(prev => prev ? { ...prev, metadata: { ...prev.metadata, ...config } } : null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">OpenCode Agent Configuration</h1>
        <p className="text-sm text-gray-600 mt-1">
          Configure and manage your OpenCode agents and subagents
        </p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Agent File Browser */}
        <div className="w-80 border-r border-gray-200">
          <AgentFileBrowser
            agentFiles={agentFiles}
            selectedAgent={selectedAgent}
            onAgentSelect={handleAgentSelect}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {selectedAgent ? (
            <>
              {/* Configuration Panel */}
              <div className="border-b border-gray-200 p-4">
                <AgentConfigurationPanel
                  agent={selectedAgent}
                  onConfigurationUpdate={handleConfigurationUpdate}
                />
              </div>

              {/* Agent Preview */}
              <div className="flex-1 overflow-hidden">
                <AgentPreview agent={selectedAgent} />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-4">📄</div>
                <p>Select an agent file to configure</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};