# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chinese-language documentation project about **DDAD (Document-Driven Agile Development)** methodology, combining Vibe Coding practices with AI-assisted team collaboration. The content is structured as a comprehensive guide/book with chapters, case studies, templates, and practical examples.

**Target Audience**: Development teams, technical leaders, project managers, and engineers looking to integrate AI tools into their workflows.

## Repository Structure

```
DDAD-in-teams/
├── 主文档/              # Main content (7 chapters)
│   ├── chapter1.md      # Introduction & AI coding evolution
│   ├── chapter2.md      # Core concepts (Vibe Coding, team efficiency)
│   ├── chapter3.md      # Tools & operations (Codebuddy, Claude Code, Cursor)
│   ├── chapter4.md      # Team collaboration workflows
│   ├── chapter5.md      # Practical case studies
│   ├── chapter6.md      # Best practices & future outlook
│   ├── chapter7.md      # Templates & resources
│   ├── SUMMARY.md       # Table of contents (navigation guide)
│   └── README.md        # Chapter overview
├── 附录/               # Appendices (presentations, tool comparisons)
├── 案例研究/            # Case studies (e.g., intelligent customer service)
├── 工具模板/            # Prompt templates (requirements, code review, tasks)
├── 调研问卷/            # Team assessment surveys
├── 项目文件/            # Example project structures
├── develop-a-agent.md  # Claude CLI practical development guide
├── DDAD-Vibe-Coding-PPT.md  # Presentation version
└── README.md           # Project overview
```

## Content Architecture

### Chapter Progression
1. **Chapter 1**: Introduction - AI tool evolution, traditional challenges, DDAD philosophy
2. **Chapter 2**: Core Concepts - Vibe Coding paradigm, risk assessment, team efficiency models
3. **Chapter 3**: Tools & Operations - AI tool ecosystem (Codebuddy, Claude Code, Cursor, Copilot)
4. **Chapter 4**: Team Collaboration - Requirements analysis, parallel development, code review
5. **Chapter 5**: Practical Cases - Full workflow examples with documentation standards
6. **Chapter 6**: Best Practices - Risk strategies, DX optimization, governance frameworks
7. **Chapter 7**: Tools & Resources - Quick reference, prompt templates, evaluation metrics

### Key Content Types
- **Prompt Templates** (`工具模板/`): Ready-to-use templates for PRD generation, user stories, code reviews
- **Case Studies** (`案例研究/`): Real-world implementation examples with complete workflows
- **Development Guide** (`develop-a-agent.md`): Comprehensive Claude CLI tutorial for building AI agents

## Working with This Project

### Content Editing Guidelines

1. **Language**: All content is in **Simplified Chinese**. Maintain consistent terminology:
   - DDAD (Document-Driven Agile Development) → 文档驱动敏捷开发
   - Vibe Coding → Vibe Coding (kept in English as a named concept)
   - AI编码工具, 智能体协作, 产品架构设计, etc.

2. **Structure Consistency**:
   - Use clear heading hierarchy (`#`, `##`, `###`)
   - Keep parallel structures across chapters
   - Update `主文档/SUMMARY.md` when adding/reorganizing sections

3. **Cross-References**:
   - Reference templates: `工具模板/需求分析模板.md`
   - Reference case studies: `案例研究/智能客服开发案例.md`
   - Ensure file paths remain valid when restructuring

4. **Writing Style**:
   - Professional but accessible tone
   - Include practical examples and data-driven insights
   - Use bullet points and structured formatting for clarity
   - Incorporate metrics and industry data where relevant

### Common Operations

#### Adding New Content
- **New chapter**: Add to `主文档/` and update `SUMMARY.md`
- **New template**: Add to `工具模板/` with clear usage instructions
- **New case study**: Add to `案例研究/` with complete workflow documentation

#### Reviewing Content
- Check terminology consistency across all files
- Verify cross-references are valid
- Ensure code examples (prompt templates) are complete and runnable
- Validate that case studies follow DDAD methodology phases

#### Restructuring
- Always update `SUMMARY.md` to reflect new organization
- Check all internal markdown links (`[text](path.md)`)
- Maintain the core structure: 主文档 → 附录 → 案例研究 → 工具模板

### Key Concepts to Preserve

**DDAD Methodology Core Elements**:
- Document-driven development (structured documentation as single source of truth)
- AI智能体协作 (AI as development partner)
- Vibe Coding理念 (psychological safety, creative collaboration)
- Quantifiable evaluation metrics (lead time, AI adoption rate, defect density)

**AI Tools Referenced**:
- **Claude Code/Claude CLI**: Primary tool for code generation, document analysis
- **Codebuddy**: Product matrix (plugins, CLI, IDE)
- **Cursor**: AI-native IDE for coding and refactoring
- **GitHub Copilot**: Code completion assistant

**Workflow Phases** (used throughout templates and case studies):
1. 需求阶段 (Requirements): PRD, user stories
2. 设计阶段 (Design): Architecture, API specs, data models
3. 开发阶段 (Development): Module specs, coding standards, implementation
4. 测试阶段 (Testing): Test plans, test cases, coverage
5. 部署阶段 (Deployment): Deployment guides, operations manuals

### When Working with Templates

Templates in `工具模板/` are **prompt-based**: they contain instructions for AI tools (especially Claude) to generate specific documents. When editing:
- Preserve the prompt structure (clear objectives, requirements, output format)
- Include complete examples showing expected output format
- Maintain Markdown code blocks for prompts (```...```)
- Keep usage instructions (使用说明) clear and actionable

### Integration with Other Tools

The project documents integration with:
- **Git**: Version control for documentation and code
- **Claude CLI**: Primary AI development assistant
- **Docker/Docker Compose**: Deployment examples in case studies
- **Testing frameworks**: pytest, Jest, locust (referenced in templates)

## Quality Standards

- **Documentation completeness**: All phases (requirements → deployment) should be covered
- **Template usability**: Prompts should be copy-paste ready for immediate use
- **Example clarity**: Code snippets and prompts must be syntactically correct
- **Cross-file consistency**: Terminology and structure should align across all documents
- **Practical applicability**: Content should be immediately actionable for development teams

## Navigation Tips

- Start with `README.md` for project overview
- Use `主文档/SUMMARY.md` as the main navigation guide
- Reference `CODEBUDDY.md` for additional codebase context
- Check `develop-a-agent.md` for complete Claude CLI workflow examples
- Find reusable templates in `工具模板/` directory

## Update Protocol

When making significant changes:
1. Update relevant chapter files in `主文档/`
2. Modify `SUMMARY.md` if structure changes
3. Update cross-references in affected files
4. Check consistency across templates and case studies
5. Update the main `README.md` if adding major sections
6. Maintain the update record (更新记录) in `README.md`

---

**Note**: This is a living documentation project. Content should evolve to reflect latest AI development practices while maintaining the core DDAD methodology principles.
