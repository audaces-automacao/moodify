---
name: init-project
description: Initialize project with CLAUDE.md, settings, and documentation structure
disable-model-invocation: true
---

# Initialize Project Documentation

Set up a comprehensive Claude Code documentation structure for the current project.

## Instructions

Execute these steps in order:

### 1. Fetch Best Practices
Use WebFetch to analyze https://www.humanlayer.dev/blog/writing-a-good-claude-md and extract current best practices for CLAUDE.md files. Apply these recommendations throughout the initialization.

### 2. Detect Project Information
- Read package.json, Cargo.toml, pyproject.toml, or similar to identify:
  - Project name
  - Tech stack (Angular, React, Node, Rust, Python, etc.)
  - Package manager (npm, yarn, pnpm, bun)
  - Available scripts/commands

### 3. Create .claude Directory
```bash
mkdir -p .claude/docs
```

### 4. Create CLAUDE.md
Create `.claude/CLAUDE.md` following the WHAT/WHY/HOW structure:

**WHAT** - Technical overview:
- Project name and purpose (1 line)
- Tech stack summary

**WHY** - Commands section:
- Essential build/test/lint commands from package.json

**HOW** - References:
- Links to detailed docs using progressive disclosure

**Best practices (from web analysis):**
- Keep under 60 lines total
- Only universally applicable instructions
- Use file:line references, not code snippets
- Reference separate doc files for details

### 5. Create .claude/settings.json
Use the template from `.claude/skills/init-project/templates/settings.json` as a base. Customize the allow list based on the detected project type:
- For Angular: include `npx ng` commands
- For Node.js: include `npm run` commands
- For Python: include `pytest`, `pip` commands
- For Rust: include `cargo` commands

### 6. Create Documentation Files
Create `.claude/docs/coding-guidelines.md` using the template from `.claude/skills/init-project/templates/docs/coding-guidelines.md`, replacing [PROJECT NAME] with the actual project name.

Create additional doc files as appropriate for the project:
- `testing.md` - Test patterns and commands
- `architecture.md` - Detailed system design
- `styling.md` - Design system (if frontend project)

### 7. Verify Structure
List all created files and confirm the structure is correct:
```bash
find .claude -type f -name "*.md" -o -name "*.json" | head -20
```
