---
name: bootstrap
description: Initialize project with CLAUDE.md, settings, and documentation structure
disable-model-invocation: true
---

# Initialize Project Documentation

Set up a comprehensive Claude Code documentation structure for the current project.

## Instructions

Execute these steps in order:

### 1. Review Best Practices
Read the best practices reference at `.claude/skills/claude-code-bootstrap/references/claude-md-best-practices.md`. Apply these recommendations throughout the initialization, particularly:
- WHAT/WHY/HOW structure
- Keep under 60 lines
- Use file:line references instead of code snippets
- Only include universally-applicable instructions

### 2. Detect Project Information
Detect project type by checking for manifest/config files:
- **Node.js**: package.json → npm, yarn, pnpm, bun
- **Rust**: Cargo.toml → cargo
- **Python**: pyproject.toml, setup.py, requirements.txt → pip, poetry, uv
- **C#/.NET**: *.csproj, *.sln → dotnet
- **Java**: pom.xml → maven | build.gradle → gradle
- **Go**: go.mod → go
- **C/C++**: CMakeLists.txt → cmake | Makefile → make
- **Ruby**: Gemfile → bundler

Extract from detected manifest:
- Project name
- Tech stack/framework
- Build system / package manager
- Available scripts/commands (if defined)

### 3. Analyze Project Context
Perform a deeper analysis to understand the project's purpose and architecture:

**Read key documentation:**
- README.md (project description, features, purpose)
- CONTRIBUTING.md, docs/ folder (existing guidelines)

**Analyze project structure:**
- Top-level directory layout (identify architecture pattern)
- Source directory organization (feature-based, layered, etc.)
- Key entry points (main.ts, index.ts, app.module.ts, etc.)

**Extract domain context:**
- Core concepts from folder/file names
- Main features from component/service names
- Business domain terminology

**Scope limits:**
- Focus on top-level structure, avoid deep file reading
- Prioritize README and entry points
- Skip node_modules, dist, build artifacts

### 4. Create .claude Directory
```bash
mkdir -p .claude/docs
```

### 5. Create CLAUDE.md
Create `.claude/CLAUDE.md` with a living document header and following the WHAT/WHY/HOW structure:

```markdown
<!-- Keep this file and .claude/docs/ updated when project structure, conventions, or tooling changes -->

# Project Name
```

**WHAT** - Technical overview:
- Project name and purpose (1 line)
- Tech stack summary

**WHY** - Commands section:
- Essential build/test/lint commands from project manifest or common conventions:
  - Node.js: from `scripts` in package.json
  - Rust: `cargo build`, `cargo test`, `cargo clippy`
  - Python: `pytest`, `ruff`, build commands
  - C#/.NET: `dotnet build`, `dotnet test`, `dotnet run`
  - Java: `mvn compile`, `mvn test` or `gradle build`, `gradle test`
  - Go: `go build`, `go test`, `go vet`
  - C/C++: `cmake --build`, `make`, `ctest`

**HOW** - Documentation section:
- Include a `## Documentation` section with header: "Read the relevant doc before making changes:"
- List only the docs that were created (see Step 7)
- Use task-oriented descriptions that tell Claude WHEN to read each doc:
  - `coding-guidelines.md` → "For new features, refactoring, code structure"
  - `testing.md` → "For writing or modifying tests"
  - `styling.md` → "For UI components, CSS, visual changes"
  - `architecture.md` → "For understanding project structure, data flow"

**Best practices (from reference file):**
- Keep under 60 lines total
- Only universally applicable instructions
- Use file:line references, not code snippets
- Reference separate doc files for details

### 6. Create .claude/settings.json
Use the template from `.claude/skills/claude-code-bootstrap/templates/settings.json` as a base. Customize the allow list based on the detected project type:
- **Node.js/Angular**: `npm run`, `npx`, `yarn`, `pnpm`
- **Rust**: `cargo build`, `cargo test`, `cargo run`, `cargo clippy`
- **Python**: `pytest`, `pip`, `poetry`, `uv`, `ruff`, `mypy`
- **C#/.NET**: `dotnet build`, `dotnet test`, `dotnet run`, `dotnet restore`
- **Java/Maven**: `mvn compile`, `mvn test`, `mvn package`
- **Java/Gradle**: `gradle build`, `gradle test`, `gradlew`
- **Go**: `go build`, `go test`, `go run`, `go vet`, `golangci-lint`
- **C/C++**: `cmake`, `make`, `ctest`, `ninja`
- **Ruby**: `bundle`, `rake`, `rspec`

### 7. Create Documentation Files

Create documentation files based on project type:

**Always create:**
- `coding-guidelines.md` - Use template from `.claude/skills/claude-code-bootstrap/templates/docs/coding-guidelines.md`, replacing [PROJECT NAME] with actual project name

**Create if applicable:**
- `testing.md` - If test framework detected (Karma, Jest, pytest, cargo test, go test, etc.)
- `styling.md` - If frontend project (Angular, React, Vue, or has CSS/SCSS files)
- `architecture.md` - If project has meaningful structure worth documenting

**IMPORTANT:** The Documentation section in CLAUDE.md must only list docs that were created. Use task-oriented descriptions for each (see Step 5).

### 8. Verify Structure
List all created files and confirm the structure is correct:
```bash
find .claude -type f -name "*.md" -o -name "*.json" | head -20
```
