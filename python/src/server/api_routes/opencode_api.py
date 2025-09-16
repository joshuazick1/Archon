"""
OpenCode Integration API Routes

Provides endpoints for managing OpenCode agent files, configurations,
and repository connections within the Archon ecosystem.
"""

import asyncio
import json
from typing import Dict, List, Optional, Any

from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field

# Import unified logging
from ..config.logfire_config import get_logger

# Get logger for this module
logger = get_logger(__name__)

router = APIRouter()

# Mock data for development - in production this would scan actual OpenCode repositories
MOCK_AGENT_FILES = [
    {
        "id": "docs-agent",
        "name": "docs.md",
        "path": ".opencode/agent/docs.md",
        "type": "agent",
        "description": "ALWAYS use this when writing docs",
        "content": """---
description: ALWAYS use this when writing docs
---

You are an expert technical documentation writer

You are not verbose

The title of the page should be a word or a 2-3 word phrase

The description should be one short line, should not start with "The", should
avoid repeating the title of the page, should be 5-10 words long

Chunks of text should not be more than 2 sentences long

Each section is spearated by a divider of 3 dashes

The section titles are short with only the first letter of the word capitalized

The section titles are in the imperative mood

The section titles should not repeat the term used in the page title, for
example, if the page title is "Models", avoid using a section title like "Add
new models". This might be unavoidable in some cases, but try to avoid it.

Check out the /packages/web/src/content/docs/docs/index.mdx as an example.

For JS or TS code snippets remove trailing semicolons and any trailing commas
that might not be needed.

If you are making a commit prefix the commit message with `docs:`

For whatever you build.""",
        "metadata": {
            "provider": "anthropic",
            "model": "claude-3-sonnet-20240229",
            "permissions": ["read", "write"]
        }
    },
    {
        "id": "git-committer",
        "name": "git-committer.md",
        "path": ".opencode/agent/git-committer.md",
        "type": "subagent",
        "description": "Use this agent when you are asked to commit and push code changes",
        "content": """---
description: Use this agent when you are asked to commit and push code changes to a git repository.
mode: subagent
---

You commit and push to git

Commit messages should be brief since they are used to generate release notes.

Messages should say WHY the change was made and not WHAT was changed.""",
        "metadata": {
            "provider": "openai",
            "model": "gpt-4",
            "permissions": ["git"]
        }
    },
    {
        "id": "commit-command",
        "name": "commit.md",
        "path": ".opencode/command/commit.md",
        "type": "command",
        "description": "Git commit and push command",
        "content": """commit and push

make sure it includes a prefix like
docs:
tui:
core:
ci:
ignore:
wip:""",
        "metadata": {
            "provider": "openai",
            "model": "gpt-3.5-turbo",
            "permissions": ["git", "shell"]
        }
    }
]

class AgentFileModel(BaseModel):
    """Model for agent file data"""
    id: str = Field(..., description="Unique identifier for the agent file")
    name: str = Field(..., description="Filename of the agent file")
    path: str = Field(..., description="Relative path to the agent file")
    type: str = Field(..., description="Type of agent file (agent, subagent, command)")
    description: str = Field(..., description="Description of when to use this agent")
    content: str = Field(..., description="Raw content of the agent file")
    metadata: Dict[str, Any] = Field(..., description="Configuration metadata")

class RepositoryConnectModel(BaseModel):
    """Model for repository connection request"""
    repository_url: str = Field(..., description="URL of the OpenCode repository")
    branch: str = Field(default="main", description="Branch to connect to")
    access_token: Optional[str] = Field(None, description="Access token for private repositories")

@router.get("/agents", response_model=List[Dict[str, Any]])
async def get_agent_files():
    """
    Get all available OpenCode agent files.

    Returns a list of agent files with their configurations and metadata.
    In production, this would scan connected OpenCode repositories.
    """
    try:
        # In production, this would:
        # 1. Scan connected repositories
        # 2. Parse .opencode directories
        # 3. Extract agent files and metadata
        # 4. Return structured data

        return MOCK_AGENT_FILES
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch agent files: {str(e)}")

@router.get("/agents/{agent_id}", response_model=Dict[str, Any])
async def get_agent_file(agent_id: str):
    """
    Get a specific agent file by ID.

    Args:
        agent_id: Unique identifier of the agent file

    Returns:
        Detailed agent file information
    """
    try:
        agent = next((a for a in MOCK_AGENT_FILES if a["id"] == agent_id), None)
        if not agent:
            raise HTTPException(status_code=404, detail="Agent file not found")

        return agent
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch agent file: {str(e)}")

@router.put("/agents/{agent_id}", response_model=Dict[str, Any])
async def update_agent_configuration(
    agent_id: str,
    configuration: Dict[str, Any]
):
    """
    Update the configuration of a specific agent file.

    Args:
        agent_id: Unique identifier of the agent file
        configuration: Updated configuration metadata

    Returns:
        Updated agent file information
    """
    try:
        agent_index = next((i for i, a in enumerate(MOCK_AGENT_FILES) if a["id"] == agent_id), None)
        if agent_index is None:
            raise HTTPException(status_code=404, detail="Agent file not found")

        # Update the agent configuration
        updated_agent = {
            **MOCK_AGENT_FILES[agent_index],
            "metadata": {
                **MOCK_AGENT_FILES[agent_index]["metadata"],
                **configuration
            }
        }

        MOCK_AGENT_FILES[agent_index] = updated_agent

        # In production, this would:
        # 1. Update the agent file in the repository
        # 2. Commit and push changes
        # 3. Update local cache

        return updated_agent
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update agent configuration: {str(e)}")

@router.post("/repositories/connect")
async def connect_repository(
    request: RepositoryConnectModel,
    background_tasks: BackgroundTasks
):
    """
    Connect to an OpenCode repository and scan for agent files.

    Args:
        request: Repository connection details

    Returns:
        Connection status and initial scan results
    """
    try:
        # In production, this would:
        # 1. Clone or pull the repository
        # 2. Scan for .opencode directory
        # 3. Parse agent files
        # 4. Store configuration in database
        # 5. Set up file watchers for changes

        # For now, simulate the connection process
        background_tasks.add_task(
            simulate_repository_scan,
            request.repository_url,
            request.branch
        )

        return {
            "success": True,
            "message": "Repository connection initiated",
            "repository_url": request.repository_url,
            "branch": request.branch,
            "status": "connecting"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to connect repository: {str(e)}")

@router.get("/repositories")
async def get_connected_repositories():
    """
    Get list of connected OpenCode repositories.

    Returns:
        List of connected repositories with their status
    """
    try:
        # In production, this would query the database for connected repositories
        return [
            {
                "id": "opencode-main",
                "url": "https://github.com/sst/opencode",
                "branch": "main",
                "last_sync": "2025-09-16T18:00:00Z",
                "agent_count": len(MOCK_AGENT_FILES),
                "status": "connected"
            }
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch repositories: {str(e)}")

async def simulate_repository_scan(repository_url: str, branch: str):
    """
    Simulate repository scanning process.

    In production, this would:
    - Clone/pull repository
    - Scan .opencode directories
    - Parse agent files
    - Update database
    """
    try:
        # Simulate processing time
        await asyncio.sleep(2)

        # Log successful scan
        print(f"✅ Successfully scanned repository: {repository_url} ({branch})")
        print(f"📄 Found {len(MOCK_AGENT_FILES)} agent files")

    except Exception as e:
        print(f"❌ Failed to scan repository {repository_url}: {str(e)}")

# Export the router for use in main FastAPI app
opencode_router = router