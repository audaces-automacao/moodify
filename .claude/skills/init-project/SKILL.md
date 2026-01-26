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
- Essential build/test/lint commands from project manifest or common conventions:
  - Node.js: from `scripts` in package.json
  - Rust: `cargo build`, `cargo test`, `cargo clippy`
  - Python: `pytest`, `ruff`, build commands
  - C#/.NET: `dotnet build`, `dotnet test`, `dotnet run`
  - Java: `mvn compile`, `mvn test` or `gradle build`, `gradle test`
  - Go: `go build`, `go test`, `go vet`
  - C/C++: `cmake --build`, `make`, `ctest`

**HOW** - References:
- Links to detailed docs using progressive disclosure

**Best practices (from web analysis):**
- Keep under 60 lines total
- Only universally applicable instructions
- Use file:line references, not code snippets
- Reference separate doc files for details

### 5. Create .claude/settings.json
Use the template from `.claude/skills/init-project/templates/settings.json` as a base. Customize the allow list based on the detected project type:
- **Node.js/Angular**: `npm run`, `npx`, `yarn`, `pnpm`
- **Rust**: `cargo build`, `cargo test`, `cargo run`, `cargo clippy`
- **Python**: `pytest`, `pip`, `poetry`, `uv`, `ruff`, `mypy`
- **C#/.NET**: `dotnet build`, `dotnet test`, `dotnet run`, `dotnet restore`
- **Java/Maven**: `mvn compile`, `mvn test`, `mvn package`
- **Java/Gradle**: `gradle build`, `gradle test`, `gradlew`
- **Go**: `go build`, `go test`, `go run`, `go vet`, `golangci-lint`
- **C/C++**: `cmake`, `make`, `ctest`, `ninja`
- **Ruby**: `bundle`, `rake`, `rspec`

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
