# claude-code-bootstrap

A Claude Code skill that initializes comprehensive project documentation with CLAUDE.md and supporting files.

## Features

- Auto-detects project type (Node.js, Rust, Python, C#/.NET, Java, Go, C/C++, Ruby)
- Creates CLAUDE.md following best practices (WHAT/WHY/HOW structure, under 60 lines)
- Generates .claude/settings.json with sensible command permissions
- Creates documentation files (coding-guidelines.md, testing.md, styling.md, architecture.md)

## Why use this instead of `/init`?

Claude Code's built-in `/init` command provides a quick start, but this skill creates more effective documentation by:

- **Following research-backed practices** - WHAT/WHY/HOW structure, keeping CLAUDE.md under 60 lines for optimal LLM attention
- **Progressive disclosure** - Detailed guidelines in separate docs instead of one large file
- **Command permissions** - Pre-configured settings.json with safe defaults
- **Project-aware** - Auto-detects your tech stack and generates relevant documentation

## Installation

### macOS / Linux

```bash
git clone https://github.com/YOUR_USERNAME/claude-code-bootstrap ~/.claude/skills/claude-code-bootstrap
```

### Windows

```cmd
git clone https://github.com/YOUR_USERNAME/claude-code-bootstrap %USERPROFILE%\.claude\skills\claude-code-bootstrap
```

### Verify Installation

In Claude Code, type `/bootstrap` - it should appear in the autocomplete.

## Usage

Navigate to any project and run:

```
/bootstrap
```

Claude will:
1. Detect your project type from manifest files
2. Analyze project structure and documentation
3. Create `.claude/` directory with:
   - `CLAUDE.md` - Main project documentation
   - `settings.json` - Command permissions
   - `docs/` - Additional documentation files

## What Gets Generated

| File | Purpose |
|------|---------|
| `.claude/CLAUDE.md` | Project overview, commands, documentation references |
| `.claude/settings.json` | Build/test/lint command permissions |
| `.claude/docs/coding-guidelines.md` | Code style and architecture guidelines |
| `.claude/docs/testing.md` | Testing conventions (if test framework detected) |
| `.claude/docs/styling.md` | UI/CSS guidelines (if frontend project) |
| `.claude/docs/architecture.md` | Project structure documentation |

## Understanding the Default Settings

The generated `settings.json` uses **conservative defaults**:

**Allowed by default:**
- Build commands (`npm run build`, `cargo build`, etc.)
- Test commands (`npm test`, `pytest`, etc.)
- Lint commands (`npm run lint`, `eslint`, etc.)

**Denied by default:**
- `git commit` - Requires explicit user action
- `git push` - Prevents accidental remote changes
- `git rebase` - Destructive operation
- `git reset --hard` - Can lose uncommitted work
- `git push --force` - Can overwrite remote history

This design philosophy ensures Claude helps with development tasks while leaving version control decisions to you.

## Customization

### Modify Templates

Edit files in the `templates/` directory to customize generated content for your preferences.

The `templates/docs/coding-guidelines.md` includes principles we find effective, but you should adapt them to match your team's experience and coding philosophy.

### Customize Permissions

The `templates/settings.json` file controls default command permissions. Customize based on your workflow:

**Trust Claude with commits (remove git restrictions):**
```json
{
  "permissions": {
    "allow": [
      "Bash(npm run build:*)",
      "Bash(npm test:*)",
      "Bash(git commit:*)",
      "Bash(git push:*)"
    ],
    "deny": []
  }
}
```

**Maximum caution (review everything):**
```json
{
  "permissions": {
    "allow": [],
    "deny": []
  }
}
```

**Keep defaults (recommended for most users):**
Use the template as-is - it allows development commands while requiring approval for git operations.

### Add Project Types

Edit `SKILL.md` Step 2 to add detection for additional manifest files or build systems.

## Updating

```bash
cd ~/.claude/skills/claude-code-bootstrap
git pull
```

## Uninstalling

```bash
rm -rf ~/.claude/skills/claude-code-bootstrap
```

## Credits & Acknowledgments

The best practices in `references/claude-md-best-practices.md` are based on insights from:
- [Writing a Good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md) by HumanLayer

Thank you to the HumanLayer team for their research on effective Claude Code documentation.

## License

MIT
