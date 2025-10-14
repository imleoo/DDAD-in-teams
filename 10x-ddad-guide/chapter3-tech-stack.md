# 第三章:技术栈与工具生态

> **本章导读**
>
> 了解10xDevelopers推荐的现代AI友好技术栈全景,掌握AI编码工具的选择标准,深入理解Subagents和MCP协议,以及开发环境配置最佳实践。

---

## 3.1 推荐技术栈全景

### 10xDevelopers黄金技术栈

基于10xDevelopers.dev社区的广泛实践和数据验证,以下技术栈组合被证明最适合AI驱动的快速MVP开发:

```
┌─────────────────────────────────────────────────────┐
│                  开发工作流层                        │
├─────────────────────────────────────────────────────┤
│ Lovable.dev         │ 快速UI原型(70-80%核心功能)   │
│ Cursor AI           │ AI深度集成IDE(20-30%增强)   │
│ Claude Code         │ Subagents并行开发            │
├─────────────────────────────────────────────────────┤
│                    前端层                            │
├─────────────────────────────────────────────────────┤
│ React 18+           │ UI框架                        │
│ TypeScript          │ 类型安全                      │
│ Tailwind CSS        │ 实用优先的样式框架            │
│ Shadcn/ui           │ 可访问的组件库                │
│ React Query         │ 服务器状态管理                │
│ Zustand             │ 客户端状态管理                │
├─────────────────────────────────────────────────────┤
│                    后端层                            │
├─────────────────────────────────────────────────────┤
│ Supabase            │ BaaS平台(PostgreSQL + Auth)  │
│ PostgreSQL          │ 关系型数据库                  │
│ Supabase Auth       │ 认证服务(OAuth + Magic Link)  │
│ Supabase Storage    │ 文件存储                      │
│ Supabase Functions  │ Edge Functions(Deno)         │
├─────────────────────────────────────────────────────┤
│                  部署与运维层                        │
├─────────────────────────────────────────────────────┤
│ Vercel              │ 零配置部署                    │
│ Vercel Edge Network │ 全球CDN                       │
│ Vercel Analytics    │ Web性能分析                   │
│ GitHub Actions      │ CI/CD自动化                   │
├─────────────────────────────────────────────────────┤
│                    测试层                            │
├─────────────────────────────────────────────────────┤
│ Vitest              │ 单元测试(比Jest更快)          │
│ React Testing Lib   │ React组件测试                 │
│ Playwright          │ E2E测试和浏览器自动化         │
├─────────────────────────────────────────────────────┤
│                  监控与日志层                        │
├─────────────────────────────────────────────────────┤
│ Supabase Logs       │ 后端日志                      │
│ Vercel Logs         │ 前端和Edge日志                │
│ Sentry (可选)       │ 错误追踪和性能监控            │
└─────────────────────────────────────────────────────┘
```

### 技术选型的三大原则

#### 1. AI友好性 (AI-Friendly)

**定义**: 技术栈应该易于AI理解和生成代码

**评估标准**:
- ✅ **文档质量**: 官方文档详尽,AI训练数据中覆盖广
- ✅ **社区活跃**: Stack Overflow问答多,AI学习样本丰富
- ✅ **代码模式**: 统一的代码风格和最佳实践
- ✅ **类型安全**: TypeScript等类型系统帮助AI理解上下文

**示例对比**:

| 技术 | AI友好性 | 理由 |
|------|---------|------|
| **React** | ⭐⭐⭐⭐⭐ | 文档完善,社区最大,AI训练数据最多 |
| **Vue** | ⭐⭐⭐⭐ | 文档好,但训练数据相对少 |
| **Svelte** | ⭐⭐⭐ | 较新,AI训练数据有限 |
| **TypeScript** | ⭐⭐⭐⭐⭐ | 类型提示帮助AI理解,减少错误 |
| **JavaScript** | ⭐⭐⭐ | 动态类型,AI推断难度大 |

#### 2. MVP速度 (MVP Speed)

**定义**: 从零到可用产品的时间

**评估标准**:
- ⚡ **开箱即用**: Supabase提供认证、数据库、存储,无需自建
- ⚡ **零配置部署**: Vercel自动检测框架,一键部署
- ⚡ **组件库丰富**: Shadcn/ui提供开箱即用的可访问组件
- ⚡ **集成便捷**: 技术栈之间无缝集成,减少配置时间

**MVP时间对比**:

| 架构 | MVP时间 | 原因 |
|------|---------|------|
| **10x Stack (Lovable+Supabase+Vercel)** | 2-4周 | 70%功能Lovable生成,Supabase提供后端,Vercel零配置 |
| **MERN (MongoDB+Express+React+Node)** | 2-3个月 | 需自建认证、API、部署配置 |
| **Django+React** | 1.5-2.5个月 | 后端需手动实现,但Django提供admin面板 |
| **Rails+React** | 1.5-2.5个月 | Rails脚手架快,但前后端分离增加复杂度 |

#### 3. 可扩展性 (Scalability)

**定义**: 从MVP到生产级应用的平滑过渡能力

**评估维度**:

| 维度 | 10x Stack表现 | 说明 |
|------|-------------|------|
| **用户规模** | 0 → 100K+ | Supabase免费到10K,付费无上限;Vercel自动扩展 |
| **数据量** | GB → TB | PostgreSQL支持分区表,Supabase提供连接池 |
| **并发请求** | 100 → 10K+ | Vercel Edge Functions全球分布,低延迟 |
| **功能复杂度** | MVP → 企业级 | 从Supabase Functions平滑迁移到自建微服务 |
| **团队规模** | 1人 → 20人 | Git工作流,DDAD文档支持多人协作 |

**迁移路径**:
```
MVP阶段 (0-10K用户)
→ Supabase免费层 + Vercel Hobby计划
→ 成本: $0/月

成长阶段 (10K-100K用户)
→ Supabase Pro ($25/月) + Vercel Pro ($20/月)
→ 成本: $45/月

规模化阶段 (100K+ 用户)
→ Supabase Team + Vercel Enterprise
→ 或迁移到自建Kubernetes + PostgreSQL集群
```

### 技术栈组合推荐

#### 推荐A: 10xDevelopers标准栈(快速MVP)

**适用场景**: SaaS应用、内部工具、MVP验证

```yaml
前端:
  框架: React 18 + TypeScript
  样式: Tailwind CSS + Shadcn/ui
  状态: React Query + Zustand
  构建: Vite

后端:
  平台: Supabase (全托管)
  数据库: PostgreSQL (via Supabase)
  认证: Supabase Auth
  存储: Supabase Storage
  API: Supabase Auto-generated REST + GraphQL

开发工具:
  UI原型: Lovable.dev
  主IDE: Cursor AI
  AI助手: Claude Code (with Subagents)
  版本控制: Git + GitHub

部署:
  平台: Vercel
  CI/CD: GitHub Actions + Vercel自动部署
  监控: Vercel Analytics + Supabase Dashboard
```

**优势**:
- ✅ MVP时间: 2-4周
- ✅ 初始成本: $0(免费层足够MVP)
- ✅ AI生成代码占比: 70-80%
- ✅ 扩展能力: 支持到100K+用户

**限制**:
- ⚠️ 深度定制受限(受Supabase能力约束)
- ⚠️ 复杂业务逻辑需要Edge Functions或外部服务

---

#### 推荐B: 混合栈(平衡定制与速度)

**适用场景**: 需要更多后端控制,复杂业务逻辑

```yaml
前端:
  框架: Next.js 14 (App Router) + TypeScript
  样式: Tailwind CSS + Shadcn/ui
  状态: React Query + Zustand

后端:
  框架: Next.js API Routes / Supabase Functions
  数据库: Supabase PostgreSQL
  认证: NextAuth.js (更灵活) 或 Supabase Auth
  缓存: Redis (Upstash)

开发工具:
  同推荐A

部署:
  平台: Vercel
  数据库: Supabase
  Redis: Upstash
```

**优势**:
- ✅ MVP时间: 3-5周
- ✅ 更强的后端控制
- ✅ 支持Server Components(Next.js 14+)
- ✅ 更灵活的认证策略

**适用于**: 需要复杂业务逻辑、第三方API深度集成的应用

---

#### 推荐C: 全栈自主栈(最大控制)

**适用场景**: 企业应用、严格合规要求、需要完全控制

```yaml
前端:
  同推荐A或B

后端:
  框架: FastAPI (Python) / Express (Node.js)
  数据库: PostgreSQL (自托管或RDS)
  认证: 自建JWT + OAuth
  队列: Redis + Bull/Celery
  缓存: Redis

开发工具:
  IDE: Cursor AI
  AI助手: Claude Code (Subagents for backend/frontend separation)
  容器化: Docker

部署:
  前端: Vercel
  后端: AWS ECS / Google Cloud Run / Railway
  数据库: AWS RDS / Google Cloud SQL
  监控: DataDog / New Relic
```

**优势**:
- ✅ 完全控制
- ✅ 适合复杂业务
- ✅ 符合企业合规要求

**劣势**:
- ❌ MVP时间: 2-3个月
- ❌ 运维复杂度高
- ❌ 初始和持续成本高

**何时选择**: 当Supabase的能力无法满足需求,或有严格的数据主权要求时

---

## 3.2 AI编码工具对比与选择

### 主流AI编码工具全景

| 工具 | 类型 | 核心优势 | 最佳场景 | 价格 |
|------|------|----------|---------|------|
| **Lovable.dev** | AI原生开发平台 | 自然语言 → 完整应用,快速原型 | MVP构建,UI快速迭代 | $20-50/月 |
| **Cursor AI** | AI-first IDE | Claude/GPT-4集成,多文件编辑,Subagents | 全流程开发,代码增强 | $20/月 |
| **Claude Code** | CLI + IDE集成 | Anthropic官方,长上下文(200K),工具调用 | 复杂项目,架构分析 | Claude Pro $20/月 |
| **GitHub Copilot** | AI代码助手 | GitHub集成,代码补全 | 日常编码辅助 | $10/月 |
| **Codeium** | AI代码助手 | 免费,多IDE支持 | 预算有限的个人开发者 | 免费/$12/月 |
| **v0.dev** | AI UI生成 | Vercel出品,生成React组件 | UI组件快速生成 | 免费/按使用付费 |
| **Bolt.new** | AI全栈平台 | StackBlitz出品,浏览器内开发 | 快速原型,教学演示 | 免费/付费层 |

### 详细对比:Lovable vs Cursor vs Claude Code

#### Lovable.dev: 快速MVP构建器

**核心能力**:
- 🎨 自然语言描述 → 完整React应用
- 🏗️ 自动生成响应式UI和基础功能
- 🔗 内置Supabase集成
- 📤 一键导出到GitHub

**适用阶段**: 项目初期(Week 1-2)

**典型工作流**:
```
1. 用自然语言描述应用: "构建一个任务管理应用,支持用户注册、创建任务、标记完成"
2. Lovable生成完整应用(前端 + Supabase后端)
3. 在Lovable中迭代优化UI和功能
4. 导出代码到GitHub
5. 在Cursor中进行高级增强
```

**优势**:
- ✅ **快速**:数小时内生成可用应用
- ✅ **完整**:包含认证、数据库、UI组件
- ✅ **现代**:自动使用React + TypeScript + Tailwind

**限制**:
- ❌ 复杂业务逻辑支持有限
- ❌ 深度定制需要导出到IDE
- ❌ 不适合大型团队协作(单人使用)

**最佳实践**:
```
Lovable构建70-80%核心功能 → 导出代码 → Cursor增强20-30%复杂功能
```

---

#### Cursor AI: 全能AI IDE

**核心能力**:
- 💬 **Composer**: 多文件编辑,自然语言描述变更
- 🔍 **Codebase Indexing**: 理解整个项目上下文
- 🤖 **AI Models**: Claude 3.5 Sonnet, GPT-4, GPT-4o
- 🧑‍💻 **Subagents**: 专业化AI代理并行工作(需配置)
- ⚡ **Tab Autocomplete**: 实时代码补全

**适用阶段**: 项目中期和长期(Week 2+)

**典型工作流**:
```
1. 在Cursor中打开从Lovable导出的代码
2. 使用Cmd+K: "添加用户资料编辑功能,使用Shadcn表单组件"
3. Cursor自动修改多个文件(组件、API、类型)
4. 使用Cmd+L聊天: "这个组件性能有问题吗?如何优化?"
5. 应用建议的优化
```

**优势**:
- ✅ **上下文理解**: 理解整个项目,跨文件编辑
- ✅ **多模型支持**: 可切换Claude/GPT-4
- ✅ **IDE功能完整**: 基于VSCode,插件生态丰富

**限制**:
- ❌ 需要一定学习曲线
- ❌ 长上下文能力不如Claude Code
- ❌ Subagents配置复杂(需手动设置)

**最佳实践**:
```
使用Composer进行功能开发 → Cmd+L咨询优化建议 → Tab补全加速编码
```

---

#### Claude Code: 命令行AI伙伴

**核心能力**:
- 📚 **超长上下文**: 200K tokens(相当于~50万字代码)
- 🛠️ **原生工具调用**: Bash, Read, Write, Edit, MultiEdit等
- 🎭 **Subagents**: 专业化代理(backend/frontend/test/security)
- 🧩 **MCP协议**: 与外部工具深度集成

**适用阶段**: 全阶段,特别适合复杂架构分析和多模块重构

**典型工作流**:
```bash
# 项目初始化
claude-code "基于docs/PRD.md,生成完整的项目架构和实施计划"

# 并行开发(Subagents)
claude-code "使用subagents并行开发:
1. backend-python: 实现用户认证API
2. frontend-react: 实现登录UI
3. test-engineer: 编写E2E测试"

# 代码审查
claude-code "审查最近的PR,检查是否符合docs/design-spec.md"

# 架构分析
claude-code "分析当前架构,识别性能瓶颈和改进机会"
```

**优势**:
- ✅ **最长上下文**: 可以理解整个大型项目
- ✅ **Subagents强大**: 真正的并行开发和专业化
- ✅ **深度集成**: MCP协议支持浏览器自动化、文档查询等

**限制**:
- ❌ 命令行交互(不是图形IDE)
- ❌ 需要熟悉prompt engineering
- ❌ 配置Subagents有学习曲线

**最佳实践**:
```
大型架构设计和分析 → 使用Claude Code
日常功能开发 → 使用Cursor
快速UI原型 → 使用Lovable
```

---

### 工具组合策略

#### 阶段1: MVP构建(Week 1-2)

**主工具**: Lovable.dev + ChatGPT Voice

**工作流**:
```
1. ChatGPT Voice头脑风暴需求
2. 编写PRD.md和design-spec.md
3. Lovable根据spec快速构建70-80%功能
4. 在Lovable中迭代UI和基础功能
5. 导出代码到GitHub
```

**输出**: 可用的MVP原型,部署在Vercel

---

#### 阶段2: 功能增强(Week 2-3)

**主工具**: Cursor AI

**工作流**:
```
1. 从GitHub clone代码到本地
2. 在Cursor中打开项目
3. 使用Composer添加复杂功能
4. 使用Chat咨询性能和安全优化
5. 持续部署到Vercel staging环境
```

**输出**: 完整功能的应用,准备测试

---

#### 阶段3: 测试与优化(Week 4)

**主工具**: Claude Code + Cursor

**工作流**:
```
1. Claude Code生成全面测试计划
2. Test Subagent生成并执行测试
3. 在Cursor中修复发现的问题
4. Claude Code进行安全审计
5. 性能优化和代码审查
```

**输出**: 生产就绪的应用

---

## 3.3 Subagents和MCP协议

### 什么是Subagents?

**定义**: Subagents是Claude Code的高级功能,允许创建专业化的AI代理,每个代理有独立的上下文窗口、工具权限和系统提示。

**核心概念**:
```
主Claude会话 (Orchestrator)
      ↓ 任务分发
   ┌────┴────┬────┴────┬────┴────┐
   │         │         │         │
Backend   Frontend   Test   Security
Agent      Agent    Agent    Agent
   │         │         │         │
   ↓         ↓         ↓         ↓
Python    React    PyTest   Security
Code      Code     Tests    Audit
```

**与传统多Agent系统的区别**:

| 特性 | Subagents (Claude Code) | 传统Multi-Agent (LangChain/CrewAI) |
|------|------------------------|----------------------------------|
| **上下文管理** | 每个agent独立200K上下文 | 共享上下文,容易冲突 |
| **工具权限** | 细粒度控制(Read-only/Full) | 通常全局权限 |
| **通信方式** | 主会话协调,结构化返回 | Agent间点对点通信,难控制 |
| **专业化** | 强制专业化(系统提示约束) | 专业化可选 |
| **token效率** | 高(独立上下文,无重复) | 低(上下文重复,冗余通信) |

### Subagents配置实战

#### 基础配置结构

在项目中创建`.claude/agents/`目录:

```
项目根目录/
├── .claude/
│   ├── agents/
│   │   ├── backend-python.json
│   │   ├── frontend-react.json
│   │   ├── test-engineer.json
│   │   └── security-auditor.json
│   └── config.json
├── docs/
│   └── [DDAD文档体系]
└── [源代码]
```

#### 示例1: Backend Python Agent

**文件**: `.claude/agents/backend-python.json`

```json
{
  "name": "backend-python",
  "description": "Python后端开发专家,负责FastAPI应用和数据库交互",
  "systemPrompt": "你是一个高级Python后端开发工程师,专注于:\n\n**核心职责**:\n- FastAPI应用开发(RESTful API)\n- SQLAlchemy数据库操作(PostgreSQL)\n- Pydantic数据验证\n- 异步编程(async/await)\n- 错误处理和日志记录\n\n**开发规范**:\n- 遵循PEP 8编码规范\n- 类型提示(Type Hints)必选\n- 所有函数必须有Docstring\n- 错误处理使用自定义异常类\n- 数据库操作使用Repository模式\n\n**文档参考**:\n- 设计规范: `docs/02-design/design-spec.md`\n- API规范: `docs/02-design/api-spec.md`\n- 数据模型: `docs/02-design/data-models.md`\n\n**验收标准**:\n- [ ] 代码通过pylint检查(评分>9.0)\n- [ ] 类型检查通过(mypy)\n- [ ] 单元测试覆盖率 > 80%\n- [ ] API响应时间 < 200ms\n\n**禁止事项**:\n- ❌ 不要使用`Any`类型\n- ❌ 不要裸露异常(必须有错误处理)\n- ❌ 不要在代码中硬编码配置(使用环境变量)\n- ❌ 不要绕过Pydantic验证\n\n只有当所有验收标准都满足时,才标记任务为完成。",

  "allowedTools": [
    "Read",
    "Write",
    "Edit",
    "MultiEdit",
    "Bash",
    "Grep",
    "Glob"
  ],

  "temperature": 0.3,

  "workingDirectory": "backend/",

  "contextFiles": [
    "docs/02-design/api-spec.md",
    "docs/02-design/data-models.md",
    "backend/requirements.txt"
  ]
}
```

**关键设计点**:
- ✅ **系统提示详细**: 明确职责、规范、验收标准
- ✅ **工具权限受限**: 只能访问backend/目录和相关文档
- ✅ **低temperature**: 0.3确保代码一致性
- ✅ **上下文文件**: 自动加载相关设计文档

---

#### 示例2: Frontend React Agent

**文件**: `.claude/agents/frontend-react.json`

```json
{
  "name": "frontend-react",
  "description": "React前端开发专家,负责UI组件和用户交互",
  "systemPrompt": "你是一个高级React前端工程师,专注于:\n\n**核心职责**:\n- React 18+组件开发(函数组件 + Hooks)\n- TypeScript类型安全\n- Tailwind CSS样式实现\n- React Query数据获取和缓存\n- 表单处理(React Hook Form)\n- 可访问性(WCAG 2.1 AA标准)\n\n**开发规范**:\n- 所有组件必须是TypeScript函数组件\n- Props接口必须导出并文档化\n- 使用Shadcn/ui组件库作为基础\n- 响应式设计(mobile-first)\n- 所有按钮和表单元素必须可键盘导航\n\n**文档参考**:\n- 设计规范: `docs/02-design/design-spec.md`\n- API规范: `docs/02-design/api-spec.md`(理解后端接口)\n- UI原型: `docs/02-design/ui-mockups/`\n\n**验收标准**:\n- [ ] TypeScript类型检查通过(0 errors)\n- [ ] 组件有配套测试(React Testing Library)\n- [ ] 响应式在mobile/tablet/desktop都工作正常\n- [ ] 可访问性检查通过(axe DevTools)\n- [ ] 无console.log或警告\n\n**禁止事项**:\n- ❌ 不要使用class组件\n- ❌ 不要使用inline styles(使用Tailwind)\n- ❌ 不要直接操作DOM(使用React refs)\n- ❌ 不要忽略key prop(列表渲染)\n\n只有当所有验收标准都满足时,才标记任务为完成。",

  "allowedTools": [
    "Read",
    "Write",
    "Edit",
    "MultiEdit",
    "Grep",
    "Glob"
  ],

  "temperature": 0.2,

  "workingDirectory": "frontend/src/",

  "contextFiles": [
    "docs/02-design/design-spec.md",
    "frontend/package.json",
    "frontend/tailwind.config.js"
  ]
}
```

---

#### 示例3: Test Engineer Agent

**文件**: `.claude/agents/test-engineer.json`

```json
{
  "name": "test-engineer",
  "description": "测试工程师,负责生成测试用例和执行验证",
  "systemPrompt": "你是一个专业的测试工程师,负责确保代码质量:\n\n**核心职责**:\n- 编写单元测试(pytest/vitest)\n- 编写集成测试(关键用户旅程)\n- 执行测试并分析失败原因\n- 生成测试覆盖率报告\n- 识别边界条件和异常场景\n\n**测试策略**:\n- 单元测试:所有函数和组件(>80%覆盖率)\n- 集成测试:完整用户旅程(注册→登录→使用→登出)\n- 边界测试:空值、极大值、特殊字符、并发\n- 错误场景:网络失败、认证失效、权限不足\n\n**验收标准(严格)**:\n- [ ] 单元测试覆盖率 > 80%\n- [ ] 所有测试必须通过(0 failures)\n- [ ] 关键路径有集成测试\n- [ ] 每个错误处理分支有测试\n\n**重要原则**:\n⚠️ **绝不能为了完成任务而降低标准**\n- 如果测试失败,必须报告给对应的coding agent修复\n- 如果覆盖率不足,必须补充测试用例\n- 只有当所有测试通过且覆盖率达标,才能标记为完成\n\n**禁止事项**:\n- ❌ 不要跳过失败的测试\n- ❌ 不要降低覆盖率要求\n- ❌ 不要使用.only运行部分测试后就认为完成\n\n**工作流程**:\n1. 阅读实现代码\n2. 生成全面的测试用例\n3. 执行测试\n4. 如果失败,分析原因并报告\n5. 重复直到所有测试通过",

  "allowedTools": [
    "Read",
    "Write",
    "Bash",
    "Grep"
  ],

  "temperature": 0.2,

  "canModifyProductionCode": false,

  "contextFiles": [
    "docs/02-design/design-spec.md",
    "docs/04-testing/test-plan.md"
  ]
}
```

**关键特性**:
- ✅ **只读生产代码**: `canModifyProductionCode: false`确保不会意外修改被测代码
- ✅ **严格验收标准**: 明确不能为了完成而降低标准
- ✅ **验证循环**: 测试失败→报告→修复→重新测试

---

### Subagents协作模式

#### 模式1: 顺序协作(Pipeline)

**适用场景**: 有明确依赖关系的任务

```
Backend Agent → Frontend Agent → Test Agent
  (生成API)     (调用API)      (测试整合)
```

**Claude Code命令**:
```bash
claude-code "
按顺序执行以下任务:

1. backend-python: 实现用户认证API(POST /api/auth/login)
   - 参考: docs/02-design/api-spec.md
   - 输出: backend/api/auth.py

2. frontend-react: 实现登录表单组件
   - 调用上述API
   - 参考: docs/02-design/design-spec.md
   - 输出: frontend/src/components/LoginForm.tsx

3. test-engineer: 编写E2E测试验证登录流程
   - 测试完整用户旅程
   - 确保>80%覆盖率
"
```

---

#### 模式2: 并行协作(Parallel)

**适用场景**: 独立模块可以同时开发

```
      主会话
     /   |   \
Backend  |  Frontend
Agent    |   Agent
         |
      Test Agent
      (等前两者完成)
```

**Claude Code命令**:
```bash
claude-code "
并行执行(前两个agent同时工作):

并行任务:
- backend-python: 实现用户资料API(GET/PUT /api/users/profile)
- frontend-react: 实现用户资料编辑页面(使用Mock数据)

顺序任务(等上述完成后):
- test-engineer: 集成测试整个用户资料功能
"
```

**优势**: 节省50%时间(原本6小时→3小时)

---

#### 模式3: 迭代协作(Iterative)

**适用场景**: 需要多轮优化的任务

```
Backend Agent → Test Agent → Backend Agent(修复) → Test Agent(验证)
```

**Claude Code命令**:
```bash
claude-code "
迭代开发用户认证功能:

Round 1:
1. backend-python: 实现基础认证逻辑
2. test-engineer: 执行测试

Round 2 (如果测试失败):
1. 分析test-engineer的失败报告
2. backend-python: 修复问题
3. test-engineer: 重新执行测试

重复直到所有测试通过
"
```

---

### MCP协议深入

**MCP (Model Context Protocol)**是Anthropic开发的协议,允许Claude与外部工具和数据源深度集成。

#### MCP架构

```
Claude Code (Host)
      ↓ MCP Protocol
   ┌──┴───┬───┴───┬───┴───┐
   │      │       │       │
Playwright Context7 Filesystem  Database
  MCP      MCP     MCP       MCP
 Server   Server  Server    Server
   │      │       │         │
Browser  Docs   Files      Data
```

#### 常用MCP服务器

##### 1. Playwright MCP (浏览器自动化)

**用途**: E2E测试、网页抓取、UI验证

**示例**:
```bash
claude-code "使用Playwright:
1. 打开 http://localhost:3000
2. 填写注册表单
3. 提交并验证成功消息
4. 截图保存为 test-results/registration-success.png
"
```

**配置** (`.claude/mcp-config.json`):
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"],
      "enabled": true
    }
  }
}
```

---

##### 2. Context7 MCP (文档查询)

**用途**: 查询官方文档、库API、最佳实践

**示例**:
```bash
claude-code "使用Context7查询:
1. React 18 的 useTransition hook最佳实践
2. Supabase RLS策略配置示例
3. 将结果应用到我们的代码中
"
```

---

##### 3. Filesystem MCP (文件操作)

**用途**: 批量文件操作、项目结构重组

**示例**:
```bash
claude-code "使用Filesystem MCP:
1. 将所有组件从 src/components/ 移动到 src/components/ui/
2. 更新所有import路径
3. 验证应用仍然正常运行
"
```

---

## 3.4 开发环境配置最佳实践

### 标准开发环境

#### 必备工具清单

```yaml
核心工具:
  - IDE: Cursor AI (推荐) 或 VSCode + Claude Code Extension
  - Node.js: v18.0+ (推荐v20 LTS)
  - Package Manager: pnpm (推荐) / npm / yarn
  - Git: 最新版本
  - Docker: (可选,用于本地数据库测试)

AI工具:
  - Claude Pro订阅 ($20/月)
  - Lovable.dev账号 (用于快速原型)
  - GitHub Copilot (可选, $10/月)

浏览器扩展:
  - React Developer Tools
  - axe DevTools (可访问性测试)
  - JSON Viewer

CLI工具:
  - supabase CLI: brew install supabase/tap/supabase
  - vercel CLI: npm i -g vercel
  - playwright CLI: npm i -g @playwright/test
```

---

### 项目初始化模板

#### 使用10xDevelopers Starter Kit

```bash
# 方法1: 使用官方starter (推荐)
npx create-next-app@latest my-app --example with-supabase

# 方法2: 从Lovable导出
# 1. 在Lovable.dev创建项目
# 2. 导出到GitHub
# 3. git clone <repo-url>

# 方法3: 手动配置(完全控制)
# 详见下文
```

#### 手动配置完整项目

**项目结构**:
```
my-app/
├── .claude/                    # Claude Code配置
│   ├── agents/                 # Subagents定义
│   │   ├── backend-python.json
│   │   ├── frontend-react.json
│   │   ├── test-engineer.json
│   │   └── security-auditor.json
│   ├── mcp-config.json         # MCP服务器配置
│   └── prompts/                # 常用Prompt模板
│
├── docs/                       # DDAD文档体系
│   ├── 01-requirements/
│   │   ├── PRD.md
│   │   ├── user-stories.md
│   │   └── feature-priorities.md
│   ├── 02-design/
│   │   ├── architecture.md
│   │   ├── design-spec.md
│   │   ├── api-spec.md
│   │   └── data-models.md
│   ├── 03-implementation/
│   │   ├── implementation-plan.md
│   │   └── tech-stack.md
│   └── 04-testing/
│       └── test-plan.md
│
├── frontend/                   # 前端应用
│   ├── src/
│   │   ├── components/         # React组件
│   │   ├── hooks/              # 自定义Hooks
│   │   ├── lib/                # 工具函数
│   │   ├── pages/              # 页面组件
│   │   └── styles/             # 全局样式
│   ├── public/                 # 静态资源
│   ├── tests/                  # 测试文件
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.js
│
├── backend/ (可选,如果不用Supabase)
│   ├── api/                    # API端点
│   ├── models/                 # 数据模型
│   ├── services/               # 业务逻辑
│   ├── tests/                  # 测试文件
│   └── requirements.txt / package.json
│
├── tests/                      # E2E测试
│   └── e2e/
│       └── *.spec.ts
│
├── .env.local                  # 本地环境变量
├── .env.example                # 环境变量示例(提交到git)
├── .gitignore
├── CLAUDE.md                   # AI协作上下文
├── Tasks.md                    # 任务清单
├── Plan.md                     # 项目规划
└── README.md
```

---

### 环境变量配置

#### `.env.example` (提交到Git)

```bash
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # 仅服务端使用,不要暴露到前端!

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# 第三方服务
OPENAI_API_KEY=sk-...  # 如果应用需要调用OpenAI
STRIPE_SECRET_KEY=sk_test_...  # 如果集成支付

# 监控和分析
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=...
SENTRY_DSN=...  # (可选) 错误追踪
```

#### `.env.local` (本地开发,不提交)

```bash
# 从Supabase Dashboard获取真实值
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# 本地开发配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

### VSCode/Cursor配置

#### `.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },

  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,

  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^\"'`]*)(?:'|\"|`)"]
  ],

  "files.associations": {
    "*.css": "tailwindcss"
  },

  "jest.autoRun": "off",
  "jest.showCoverageOnLoad": true,

  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.next": true,
    "**/coverage": true
  }
}
```

#### `.vscode/extensions.json` (推荐扩展)

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-playwright.playwright",
    "supabase.supabase-vscode"
  ]
}
```

---

### Git配置

#### `.gitignore`

```bash
# 依赖
node_modules/
.pnp
.pnp.js

# 测试
coverage/
.nyc_output/

# 构建产物
.next/
out/
dist/
build/

# 环境变量
.env.local
.env.development.local
.env.test.local
.env.production.local

# 日志
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# IDE
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
.idea/
*.swp
*.swo
.DS_Store

# Vercel
.vercel

# Playwright
test-results/
playwright-report/
playwright/.cache/

# Supabase
**/supabase/.temp/
```

---

## 3.5 本章小结

技术栈与工具生态的核心要点:

1. **10xDevelopers黄金技术栈**:
   - UI原型: Lovable.dev (70-80%核心功能)
   - 开发增强: Cursor AI (20-30%复杂功能)
   - 后端服务: Supabase (PostgreSQL + Auth + Storage)
   - 部署平台: Vercel (零配置部署 + CDN)

2. **技术选型三大原则**:
   - AI友好性: 文档完善,社区活跃,类型安全
   - MVP速度: 开箱即用,零配置,组件丰富
   - 可扩展性: 0→100K+用户,平滑迁移路径

3. **AI工具组合策略**:
   - MVP阶段: Lovable快速原型
   - 功能增强: Cursor日常开发
   - 复杂分析: Claude Code架构审查
   - 并行开发: Subagents专业化协作

4. **Subagents核心价值**:
   - 独立上下文(200K tokens/agent)
   - 专业化分工(backend/frontend/test/security)
   - 并行执行(节省50%时间)
   - 验证循环(确保质量)

5. **MCP协议集成**:
   - Playwright: 浏览器自动化和E2E测试
   - Context7: 官方文档查询
   - Filesystem: 批量文件操作

6. **开发环境最佳实践**:
   - 标准工具链(Cursor + Claude + Supabase + Vercel)
   - DDAD文档体系
   - 环境变量管理
   - Git工作流配置

**关键洞察**:
> "正确的工具组合可以让一个开发者完成过去需要5人团队的工作。Lovable构建原型,Cursor增强功能,Claude Code架构优化,Subagents并行开发——这是AI时代的'一人公司'标准配置。"

**下一章**: 我们将进入第二部分"结构化开发流程",从第一步"寻找构建目标"开始,详细讲解10xDevelopers的10阶段开发流程。

---

**思考题**:
1. 您当前的技术栈与10xDevelopers黄金栈有哪些差异?迁移的最大障碍是什么?
2. 如果在您的项目中引入Subagents,您会如何分配角色?
3. Lovable vs Cursor vs Claude Code,您会在什么场景下选择哪个工具?

👉 [下一章:寻找构建目标](chapter4-find.md)
