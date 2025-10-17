# 第七章:技术栈选择

> **本章导读**
>
> 深入学习如何选择AI友好的现代技术栈,掌握Starter kit的使用方法,理解测试框架配置的最佳实践,以及如何编写技术决策文档(ADR)。

---

## 7.1 现代AI友好技术栈选择

### AI友好技术栈的三大标准

#### 标准1: 文档丰富,AI训练数据充足

**为什么重要?**
- AI(如Claude, GPT-4)的代码生成能力取决于训练数据
- 流行框架 = 更多Stack Overflow问答 = AI生成代码质量更高

**评估方法**:
```markdown
## 框架流行度评估

### 数据来源
- Stack Overflow Questions: 问题数量
- GitHub Stars: 社区活跃度
- NPM Weekly Downloads: 实际使用量
- Google Trends: 搜索热度

### React vs Vue vs Svelte (2024数据)

| 框架 | SO问题数 | GitHub Stars | NPM周下载 | AI代码质量 |
|------|---------|-------------|----------|-----------|
| React | 480K+ | 220K | 20M | ⭐⭐⭐⭐⭐ |
| Vue | 95K+ | 200K | 4.5M | ⭐⭐⭐⭐ |
| Svelte | 7K+ | 75K | 500K | ⭐⭐⭐ |

结论: React的AI代码生成质量最高,因为训练数据最丰富
```

**实战测试**:
```
Prompt: "用React创建一个带表单验证的登录组件"
→ Claude生成: 完整的组件,包含useState, 表单验证, 错误处理

Prompt: "用Svelte创建一个带表单验证的登录组件"
→ Claude生成: 基础组件,但validation逻辑需要手动补充

差异原因: React的训练数据量是Svelte的10倍以上
```

---

#### 标准2: 类型安全,减少AI错误

**TypeScript vs JavaScript**:

```typescript
// TypeScript - AI理解上下文更准确
interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

function getUser(id: string): Promise<User> {
  // AI知道返回类型必须是User
  // AI知道id必须是string
  // 类型检查自动捕获错误
}

// JavaScript - AI容易产生类型错误
function getUser(id) {
  // AI不确定id是什么类型
  // AI不确定返回什么
  // 运行时才发现错误
}
```

**数据支持**:
- 使用TypeScript的项目,AI生成代码的首次可用率: 82%
- 使用JavaScript的项目,AI生成代码的首次可用率: 64%
- 来源: GitHub Copilot内部数据(2024)

**选择建议**:
```
✅ 强烈推荐: TypeScript (React, Vue, Node.js)
✅ 推荐: 有类型提示的语言(Python with Type Hints)
⚠️ 谨慎: 纯动态语言(JavaScript, Ruby without types)
```

---

#### 标准3: 开箱即用,减少配置

**传统技术栈的痛点**:
```bash
# 传统MERN栈setup (2-3天)
1. 搭建Express服务器 (配置middleware, routing)
2. 配置MongoDB连接 (设置连接池, 错误处理)
3. 实现用户认证 (JWT, bcrypt, session管理)
4. 配置CORS, 安全headers
5. 设置开发和生产环境
6. 配置部署(Docker, Nginx, PM2)

总耗时: 2-3天纯配置,还没写业务逻辑
```

**现代AI友好栈的优势**:
```bash
# Supabase + Vercel (30分钟)
1. 创建Supabase项目 (3分钟)
   → 自动获得: PostgreSQL + Auth + Storage + Realtime

2. npx create-next-app (2分钟)
   → 自动获得: React + TypeScript + 开发服务器

3. 连接Supabase (5分钟)
   → 复制环境变量到.env.local

4. 部署到Vercel (5分钟)
   → 连接GitHub, 自动CI/CD

总耗时: 30分钟就有完整的开发和生产环境
```

---

### 10xDevelopers推荐技术栈深度解析

#### 前端框架: React 18+ with TypeScript

**为什么选择React?**

1. **AI代码生成质量最高**
   - 训练数据最丰富(Stack Overflow 480K+问题)
   - 社区最大,AI能找到几乎所有问题的解决方案

2. **生态系统成熟**
   - UI组件库: Shadcn/ui, Material-UI, Ant Design
   - 状态管理: React Query, Zustand, Redux
   - 表单: React Hook Form, Formik
   - 路由: React Router, Next.js内置

3. **Server Components支持(Next.js 13+)**
   - 减少JavaScript bundle大小
   - 提升首屏加载性能
   - SEO友好

4. **企业采用率高**
   - Meta, Netflix, Airbnb等大厂使用
   - 长期支持和更新保证

**配置建议**:

```json
// package.json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0", // 推荐使用Next.js而非纯React
    "typescript": "^5.2.0"
  }
}

// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "strict": true, // 严格模式,帮助AI生成更准确的代码
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true
  }
}
```

---

#### 样式方案: Tailwind CSS + Shadcn/ui

**为什么选择Tailwind CSS?**

1. **AI友好**
   - Utility-first,AI容易理解和生成
   - 一致的命名规范(text-sm, px-4, bg-blue-500)
   - 不需要写CSS类名,减少命名困扰

2. **快速开发**
   - 不需要切换文件(HTML/CSS分离)
   - 响应式设计简单(md:, lg:前缀)
   - 组件复用容易

3. **性能优化**
   - 自动删除未使用的样式(PurgeCSS)
   - 生产环境CSS < 10KB(gzipped)

**Shadcn/ui的优势**:

```bash
# 不是传统的组件库,而是复制到项目中
npx shadcn-ui@latest add button

# 得到的是源代码,完全可定制
components/
  ui/
    button.tsx  # 你的项目中的文件,可以随意修改

# 好处:
# ✅ 完全控制组件代码
# ✅ 没有依赖黑盒库
# ✅ AI可以直接修改组件源码
# ✅ TypeScript类型完整
# ✅ 可访问性(a11y)内建
```

**配置示例**:

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // 支持深色模式
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // Shadcn/ui的设计系统
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

---

#### 后端服务: Supabase (PostgreSQL + Auth + Storage)

**为什么选择Supabase?**

1. **开箱即用的功能**
   ```
   创建Supabase项目 (3分钟) →
   自动获得:
   ✅ PostgreSQL数据库 (1GB免费)
   ✅ 用户认证 (邮箱+密码, OAuth, Magic Link)
   ✅ 文件存储 (1GB免费)
   ✅ 实时订阅 (WebSocket)
   ✅ Edge Functions (Serverless)
   ✅ RESTful API (自动生成)
   ✅ GraphQL API (可选)
   ```

2. **行级安全(RLS)**
   ```sql
   -- 用户只能访问自己的数据,数据库级别保护
   CREATE POLICY "Users can only access their own meetings"
   ON meetings
   FOR SELECT
   USING (auth.uid() = user_id);

   -- 好处:
   -- ✅ 不需要在API层实现权限检查
   -- ✅ 安全性更高(数据库强制执行)
   -- ✅ 减少代码量
   ```

3. **AI友好**
   - 自动生成TypeScript类型定义
   - 简单的JavaScript/TypeScript SDK
   - AI可以直接生成Supabase查询代码

4. **性能和扩展性**
   - 基于PostgreSQL,性能强劲
   - 支持0-1000+并发用户
   - 自动备份和扩展

**配置示例**:

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase' // 自动生成的类型

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// 使用示例
const { data: meetings, error } = await supabase
  .from('meetings')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })

// TypeScript自动提示meetings的类型
// AI可以生成这样的代码,因为Supabase API简单一致
```

**类型生成**:
```bash
# 从Supabase数据库schema生成TypeScript类型
npx supabase gen types typescript --project-id your-project-id > types/supabase.ts

# 得到完整的类型定义
export interface Database {
  public: {
    Tables: {
      meetings: {
        Row: {
          id: string
          user_id: string
          title: string
          audio_url: string
          transcript: string | null
          created_at: string
        }
        Insert: { ... }
        Update: { ... }
      }
    }
  }
}
```

---

#### 部署平台: Vercel

**为什么选择Vercel?**

1. **零配置部署**
   ```bash
   # 传统部署 (2-3小时)
   - 购买服务器
   - 配置Nginx
   - 设置SSL证书
   - 配置CI/CD
   - 设置监控

   # Vercel部署 (5分钟)
   1. 连接GitHub仓库
   2. 点击"Deploy"
   3. 完成!
   ```

2. **自动优化**
   - 自动压缩和优化图片
   - 自动代码分割(Code Splitting)
   - 全球CDN(Edge Network)
   - 自动HTTPS证书

3. **开发体验**
   - 每个PR自动生成预览URL
   - 实时日志和错误追踪
   - 零停机部署

4. **Next.js原生支持**
   - Vercel是Next.js的开发公司
   - 最佳性能和兼容性

**配置示例**:

```json
// vercel.json (可选,大多数情况自动检测)
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

**环境变量配置**:
```bash
# 在Vercel Dashboard配置环境变量
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # 仅服务端,不暴露到前端
OPENAI_API_KEY=sk-...
```

---

### 替代方案对比

#### 何时不用10x推荐栈?

**场景1: 需要完全控制后端**
```
问题: Supabase功能受限,无法实现复杂业务逻辑
替代: 自建后端(FastAPI/Express) + PostgreSQL + Vercel部署

示例:
- 复杂的数据分析和报表
- 复杂的权限系统(不是简单的RLS)
- 需要自定义缓存策略
```

**场景2: 数据主权要求**
```
问题: 企业要求数据必须在自己的服务器
替代: 自建Supabase(Supabase是开源的) + 私有云部署

步骤:
1. 使用Supabase Docker镜像
2. 部署到AWS/Azure/GCP
3. 配置自己的PostgreSQL集群
```

**场景3: 移动应用优先**
```
问题: 需要原生移动应用性能
替代: React Native + Firebase/AWS Amplify

理由:
- Supabase移动支持较新
- Firebase移动SDK更成熟
- 离线同步支持更好
```

**场景4: Python后端团队**
```
问题: 团队只熟悉Python,不想学Node.js
替代: React前端 + FastAPI后端 + PostgreSQL + Railway部署

配置:
- 前端: React + TypeScript + Vercel
- 后端: FastAPI + SQLAlchemy + Railway
- 数据库: Railway PostgreSQL或Supabase(只用数据库)
```

---

## 7.2 Starter Kit使用指南

### 什么是Starter Kit?

**Starter Kit(脚手架)**是预配置好的项目模板,包含:
- ✅ 技术栈配置(React, TypeScript, Tailwind)
- ✅ 项目结构
- ✅ 代码规范和Linter
- ✅ 常用功能(认证、数据库)
- ✅ 部署配置

**好处**:
- 节省配置时间(从2-3天到10分钟)
- 最佳实践内建
- AI更容易理解一致的结构

---

### 推荐Starter Kits

#### 1. Next.js + Supabase Starter

**官方starter** (推荐):
```bash
npx create-next-app -e with-supabase my-app
cd my-app

# 自动获得:
# ✅ Next.js 14 + App Router
# ✅ TypeScript配置
# ✅ Tailwind CSS配置
# ✅ Supabase客户端配置
# ✅ 认证页面示例
# ✅ 中间件(Middleware)配置
```

**包含的功能**:
```
my-app/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   └── callback/  # OAuth回调
│   ├── protected/     # 需要认证的页面示例
│   └── page.tsx       # 首页
├── components/
│   ├── AuthButton.tsx # 登录/登出按钮
│   └── ...
├── utils/
│   ├── supabase/
│   │   ├── client.ts  # 客户端Supabase
│   │   ├── server.ts  # 服务端Supabase
│   │   └── middleware.ts # 认证中间件
├── .env.local.example # 环境变量示例
└── README.md
```

**配置步骤**:
```bash
# 1. 创建项目
npx create-next-app -e with-supabase my-app

# 2. 创建Supabase项目(在Supabase Dashboard)
# 3. 复制环境变量
cp .env.local.example .env.local
# 编辑.env.local,填入Supabase URL和Key

# 4. 启动开发服务器
npm run dev

# 5. 访问 http://localhost:3000
# 已经有完整的认证功能!
```

---

#### 2. Lovable.dev导出项目

**使用场景**: 快速UI原型 → 导出 → Cursor增强

**流程**:
```
1. 在Lovable.dev用自然语言描述应用
   → "创建一个任务管理应用,支持用户注册、创建任务、标记完成"

2. Lovable自动生成完整应用(10-30分钟)
   → React + Tailwind + Shadcn/ui
   → Supabase后端(数据库表 + RLS策略)
   → 基础CRUD功能

3. 导出到GitHub
   → 点击"Export to GitHub"
   → 选择仓库名称
   → 自动创建GitHub仓库

4. Clone到本地,在Cursor中增强
   git clone https://github.com/yourusername/your-app
   code your-app # 或使用Cursor打开
```

**Lovable项目结构**:
```
lovable-export/
├── src/
│   ├── components/
│   │   ├── ui/          # Shadcn/ui组件
│   │   └── ...          # 应用组件
│   ├── pages/
│   ├── lib/
│   │   └── supabase.ts
│   └── types/
├── supabase/
│   ├── migrations/      # 数据库migration
│   └── seed.sql         # 测试数据
├── package.json
└── README.md
```

**Lovable的优势**:
- ✅ 70-80%的MVP功能自动生成
- ✅ 响应式设计自动实现
- ✅ Supabase集成开箱即用
- ✅ 代码质量高(TypeScript + ESLint)

**Lovable的局限**:
- ❌ 复杂业务逻辑支持有限
- ❌ 高级UI交互需要手动实现
- ❌ 性能优化需要后续手动做

**最佳实践**: Lovable 70% + Cursor 30%

---

#### 3. T3 Stack (高级开发者)

**T3 Stack包含**:
- Next.js 14 (App Router)
- TypeScript (严格模式)
- tRPC (类型安全的API)
- Prisma (类型安全的ORM)
- NextAuth.js (认证)
- Tailwind CSS

**为什么选择T3?**
- ✅ **端到端类型安全**: 从数据库到前端,全程TypeScript
- ✅ **无需写API路由**: tRPC自动生成类型安全的API
- ✅ **开发体验极佳**: 自动补全,重构安全

**创建项目**:
```bash
npm create t3-app@latest my-app

# 选择:
# ✅ TypeScript
# ✅ tRPC
# ✅ Prisma
# ✅ NextAuth.js
# ✅ Tailwind CSS
```

**示例代码**:
```typescript
// server/api/routers/meeting.ts
export const meetingRouter = createTRPCRouter({
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.meeting.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: { createdAt: 'desc' },
      });
    }),

  create: protectedProcedure
    .input(z.object({
      title: z.string(),
      audioUrl: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.meeting.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    }),
});

// 前端使用 - 完全类型安全!
import { api } from '@/utils/api';

function MeetingList() {
  const { data: meetings } = api.meeting.getAll.useQuery();
  // meetings的类型自动推断,无需手动定义

  const createMeeting = api.meeting.create.useMutation();

  return (
    <div>
      {meetings?.map(m => <div key={m.id}>{m.title}</div>)}
      <button onClick={() => createMeeting.mutate({
        title: 'New Meeting',
        audioUrl: '...',
      })}>
        Create
      </button>
    </div>
  );
}
```

**T3 vs Next.js+Supabase**:
| 维度 | T3 Stack | Next.js+Supabase |
|------|---------|-----------------|
| 学习曲线 | 陡峭(需要学tRPC, Prisma) | 平缓(Supabase API简单) |
| 类型安全 | 端到端完美 | 前端类型安全,后端需手动维护 |
| 开发速度 | 中(需要写Prisma schema) | 快(Supabase自动生成API) |
| 部署复杂度 | 中(需要数据库服务器) | 低(Supabase托管) |
| 适用场景 | 中大型应用,团队协作 | MVP快速验证,个人项目 |

**建议**:
- MVP阶段: Next.js + Supabase (快速验证)
- 产品化阶段: 考虑迁移到T3 Stack (更好的维护性)

---

### Starter Kit定制

#### 从Starter Kit到项目特定结构

**初始Starter Kit结构**:
```
my-app/
├── app/
├── components/
├── lib/
└── public/
```

**定制为DDAD文档驱动结构**:
```bash
# 1. 添加docs/目录
mkdir -p docs/{01-requirements,02-design,03-implementation,04-testing}

# 2. 创建CLAUDE.md
touch CLAUDE.md

# 3. 添加.claude/目录(Subagents配置)
mkdir -p .claude/agents

# 4. 组织测试
mkdir -p tests/{unit,integration,e2e}

# 最终结构:
my-app/
├── docs/                     # DDAD文档
│   ├── 01-requirements/
│   ├── 02-design/
│   ├── 03-implementation/
│   └── 04-testing/
├── .claude/                  # AI配置
│   ├── agents/
│   └── prompts/
├── app/                      # Next.js应用
├── components/               # React组件
├── lib/                      # 工具函数
├── tests/                    # 测试文件
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── CLAUDE.md                 # AI协作上下文
├── Tasks.md                  # 任务清单
└── Plan.md                   # 项目规划
```

---

## 7.3 测试框架配置

### 测试金字塔

```
         /\
        /  \  E2E Tests (5-10%)
       /────\
      /      \  Integration Tests (20-30%)
     /────────\
    /          \  Unit Tests (60-70%)
   /────────────\
```

**原则**:
- 单元测试最多(快速,稳定,便宜)
- 集成测试适中(测试模块间交互)
- E2E测试最少(慢,脆弱,昂贵)

---

### 单元测试: Vitest

**为什么选择Vitest而非Jest?**
- ⚡ **更快**: 利用Vite的快速启动
- 🔧 **零配置**: 与Vite项目完美集成
- 🧪 **兼容Jest API**: 迁移成本低
- 🎯 **更好的TypeScript支持**

**安装配置**:
```bash
npm install -D vitest @vitejs/plugin-react jsdom
npm install -D @testing-library/react @testing-library/jest-dom
```

**vitest.config.ts**:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // 模拟浏览器环境
    globals: true, // 全局API(describe, it, expect)
    setupFiles: './tests/setup.ts', // 测试setup文件
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.ts',
        '**/*.d.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**tests/setup.ts**:
```typescript
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// 扩展expect matchers
expect.extend(matchers)

// 每个测试后清理
afterEach(() => {
  cleanup()
})
```

**示例测试**:
```typescript
// components/AuthForm.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthForm } from './AuthForm'

describe('AuthForm', () => {
  it('renders login form', () => {
    render(<AuthForm mode="login" />)

    expect(screen.getByPlaceholderText('邮箱地址')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('密码')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument()
  })

  it('validates email format', async () => {
    render(<AuthForm mode="login" />)

    const emailInput = screen.getByPlaceholderText('邮箱地址')
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.blur(emailInput)

    await waitFor(() => {
      expect(screen.getByText('请输入有效的邮箱地址')).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const mockSignIn = vi.fn()
    render(<AuthForm mode="login" onSignIn={mockSignIn} />)

    fireEvent.change(screen.getByPlaceholderText('邮箱地址'), {
      target: { value: 'user@example.com' }
    })
    fireEvent.change(screen.getByPlaceholderText('密码'), {
      target: { value: 'SecurePass123' }
    })

    fireEvent.click(screen.getByRole('button', { name: '登录' }))

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('user@example.com', 'SecurePass123')
    })
  })
})
```

**运行测试**:
```bash
# 运行所有测试
npm run test

# 监听模式(文件变化自动重跑)
npm run test:watch

# 生成覆盖率报告
npm run test:coverage

# 运行特定测试文件
npm run test AuthForm.test.tsx
```

---

### E2E测试: Playwright

**为什么选择Playwright?**
- 🌐 **多浏览器支持**: Chrome, Firefox, Safari
- 📸 **自动截图和视频**: 失败时自动记录
- 🔍 **强大的Selector**: 自动等待元素
- ⚡ **快速**: 并行执行测试

**安装配置**:
```bash
npm init playwright@latest

# 选择:
# ✅ TypeScript
# ✅ tests/ 目录
# ✅ GitHub Actions workflow
# ✅ 安装浏览器
```

**playwright.config.ts**:
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true, // 并行执行
  forbidOnly: !!process.env.CI, // CI中禁止test.only
  retries: process.env.CI ? 2 : 0, // CI中失败重试2次
  workers: process.env.CI ? 1 : undefined, // CI中串行,本地并行
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry', // 失败时记录trace
    screenshot: 'only-on-failure', // 失败时截图
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // 移动端测试
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

**示例E2E测试**:
```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('User Authentication', () => {
  test('user can register and login', async ({ page }) => {
    // 访问首页
    await page.goto('/')

    // 点击注册按钮
    await page.click('text=注册')

    // 填写注册表单
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'SecurePass123')
    await page.fill('input[name="confirmPassword"]', 'SecurePass123')

    // 提交表单
    await page.click('button[type="submit"]')

    // 验证成功提示
    await expect(page.locator('text=注册成功')).toBeVisible()

    // 验证跳转到Dashboard
    await expect(page).toHaveURL('/dashboard')

    // 验证用户邮箱显示
    await expect(page.locator('text=test@example.com')).toBeVisible()
  })

  test('shows error for invalid email', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[name="email"]', 'invalid-email')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    // 验证错误提示
    await expect(page.locator('text=请输入有效的邮箱地址')).toBeVisible()

    // 验证没有跳转
    await expect(page).toHaveURL('/login')
  })

  test('complete user journey: upload and view meeting', async ({ page }) => {
    // 1. 登录
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'SecurePass123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')

    // 2. 上传音频
    await page.click('text=上传会议')
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('./tests/fixtures/sample-meeting.mp3')

    // 3. 等待上传完成
    await expect(page.locator('text=上传成功')).toBeVisible({ timeout: 30000 })

    // 4. 等待转录完成(可能需要1-2分钟)
    await expect(page.locator('text=转录完成')).toBeVisible({ timeout: 120000 })

    // 5. 查看纪要
    await page.click('text=查看纪要')

    // 6. 验证纪要内容
    await expect(page.locator('h2:has-text("架构决策")')).toBeVisible()
    await expect(page.locator('h2:has-text("行动项")')).toBeVisible()

    // 7. 导出到Notion
    await page.click('text=导出到Notion')
    await expect(page.locator('text=已复制到剪贴板')).toBeVisible()
  })
})
```

**运行Playwright测试**:
```bash
# 运行所有E2E测试
npx playwright test

# 运行特定浏览器
npx playwright test --project=chromium

# Debug模式(单步调试)
npx playwright test --debug

# UI模式(可视化调试)
npx playwright test --ui

# 查看HTML报告
npx playwright show-report
```

---

### API测试: Supertest (可选)

**如果有自建API**:
```bash
npm install -D supertest @types/supertest
```

**示例**:
```typescript
// tests/api/meetings.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/server'

describe('Meetings API', () => {
  let authToken: string
  let testMeetingId: string

  beforeAll(async () => {
    // 获取测试用户token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
    authToken = res.body.token
  })

  it('POST /api/meetings - creates a new meeting', async () => {
    const res = await request(app)
      .post('/api/meetings')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Meeting',
        audioUrl: 'https://example.com/audio.mp3',
      })
      .expect(201)

    expect(res.body).toHaveProperty('id')
    expect(res.body.title).toBe('Test Meeting')

    testMeetingId = res.body.id
  })

  it('GET /api/meetings - returns user meetings', async () => {
    const res = await request(app)
      .get('/api/meetings')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)

    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })

  it('GET /api/meetings/:id - returns specific meeting', async () => {
    const res = await request(app)
      .get(`/api/meetings/${testMeetingId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)

    expect(res.body.id).toBe(testMeetingId)
    expect(res.body.title).toBe('Test Meeting')
  })

  it('returns 404 for non-existent meeting', async () => {
    await request(app)
      .get('/api/meetings/non-existent-id')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404)
  })

  afterAll(async () => {
    // 清理测试数据
    await request(app)
      .delete(`/api/meetings/${testMeetingId}`)
      .set('Authorization', `Bearer ${authToken}`)
  })
})
```

---

## 7.4 技术决策文档(ADR)

### 什么是ADR?

**Architecture Decision Record (ADR)**是记录重要技术决策的文档。

**为什么需要ADR?**
- 📝 **记录决策过程**: 为什么选A而不选B?
- 🧠 **团队记忆**: 新成员快速了解历史决策
- 🔄 **决策回顾**: 定期review决策是否仍然合理
- 🤖 **AI上下文**: AI理解项目架构和约束

---

### ADR模板

**文件命名**: `docs/02-design/adr/NNNN-title.md`

例如:
- `0001-use-supabase-for-backend.md`
- `0002-choose-react-over-vue.md`
- `0003-adopt-tailwind-css.md`

**ADR模板**:
```markdown
# ADR-NNNN: [决策标题]

**状态**: [提议中 | 已接受 | 已废弃 | 已替代]
**决策日期**: YYYY-MM-DD
**决策者**: [姓名或团队]
**相关人员**: [相关利益方]

---

## 背景 (Context)

描述促使这个决策的背景和问题:
- 当前面临什么问题?
- 有什么约束条件?
- 业务需求是什么?

[2-3段话描述背景]

---

## 决策 (Decision)

我们决定: [明确的决策陈述]

例如: "我们将使用Supabase作为后端服务,而不是自建Express + PostgreSQL"

---

## 理由 (Rationale)

为什么做出这个决策?考虑了哪些因素?

### 选项分析

#### 选项1: [选项名称]
**优点**:
- [优点1]
- [优点2]

**缺点**:
- [缺点1]
- [缺点2]

**成本**: [时间/金钱成本]

#### 选项2: [选项名称]
**优点**:
- [优点1]

**缺点**:
- [缺点1]

**成本**: [时间/金钱成本]

### 决策矩阵

| 标准 | 权重 | 选项1 | 选项2 | 选项3 |
|------|-----|-------|-------|-------|
| 开发速度 | 30% | 8 | 5 | 7 |
| 成本 | 25% | 9 | 6 | 8 |
| 可扩展性 | 20% | 7 | 9 | 7 |
| 团队熟悉度 | 15% | 6 | 8 | 7 |
| 社区支持 | 10% | 9 | 7 | 8 |
| **加权总分** | | **7.85** | **6.85** | **7.35** |

### 最终选择理由

[基于上述分析,为什么选择了这个选项]

---

## 后果 (Consequences)

### 正面影响
- [正面影响1]
- [正面影响2]

### 负面影响/权衡
- [负面影响1]
- [如何缓解]

### 对其他系统的影响
- [影响1]
- [影响2]

---

## 实施计划 (Implementation)

1. [步骤1]
2. [步骤2]
3. [步骤3]

**预计时间**: [时间估算]
**负责人**: [姓名]

---

## 验证标准 (Validation)

如何验证这个决策是正确的?

- [ ] [验证标准1]
- [ ] [验证标准2]
- [ ] [验证标准3]

**回顾时间**: [3个月后 / 6个月后]

---

## 参考资料 (References)

- [相关文档链接]
- [研究资料]
- [竞品分析]

---

## 修订历史 (History)

| 日期 | 修改内容 | 修改人 |
|------|---------|--------|
| YYYY-MM-DD | 初稿 | 张三 |
| YYYY-MM-DD | 添加选项3 | 李四 |
```

---

### ADR实战示例

#### ADR-0001: 使用Supabase作为后端服务

```markdown
# ADR-0001: 使用Supabase作为后端服务

**状态**: 已接受 ✅
**决策日期**: 2025-10-12
**决策者**: 技术团队
**相关人员**: 产品经理, 开发团队

---

## 背景 (Context)

我们正在开发TechMeet(AI会议纪要工具),需要后端服务支持:
- 用户认证(邮箱+密码, OAuth)
- 文件存储(音频文件,最大200MB)
- 数据库(用户、会议、纪要数据)
- 实时更新(转录任务状态)

**约束条件**:
- MVP需要在4周内完成
- 团队只有2名开发者
- 初期预算 < $100/月
- 需要支持0-1000用户无架构调整

**时间点**: 2025年10月,项目启动阶段

---

## 决策 (Decision)

我们决定使用**Supabase**作为后端服务,而不是自建Express/FastAPI + PostgreSQL。

---

## 理由 (Rationale)

### 选项分析

#### 选项1: Supabase (BaaS)
**优点**:
- ✅ 开箱即用: Auth + Database + Storage + Realtime
- ✅ 快速开发: 无需编写API代码
- ✅ 行级安全(RLS): 数据库级别权限控制
- ✅ 自动扩展: 支持0-1000+用户无需架构调整
- ✅ 成本低: 前10K MAU免费,$25/月Pro计划

**缺点**:
- ⚠️ 功能受限: 复杂业务逻辑需要Edge Functions
- ⚠️ 厂商锁定: 迁移成本较高(但Supabase是开源的,可自建)

**成本**:
- 开发时间: 2天(配置 + 集成)
- 运营成本: $0-25/月

#### 选项2: 自建Express + PostgreSQL
**优点**:
- ✅ 完全控制: 可以实现任意复杂逻辑
- ✅ 无厂商锁定: 完全自主

**缺点**:
- ❌ 开发慢: 需要手写Auth, API, 文件上传等
- ❌ 运维负担: 需要管理服务器、数据库、备份
- ❌ 安全风险: 自己实现Auth容易出漏洞

**成本**:
- 开发时间: 1-2周(Auth + API + 部署)
- 运营成本: $20-50/月(服务器 + 数据库)

#### 选项3: Firebase
**优点**:
- ✅ Google背书,稳定性高
- ✅ 移动端SDK成熟

**缺点**:
- ⚠️ NoSQL(Firestore): 不适合复杂查询
- ⚠️ 价格: 相比Supabase更贵
- ⚠️ SQL支持差: 我们需要PostgreSQL的关系型能力

### 决策矩阵

| 标准 | 权重 | Supabase | Express自建 | Firebase |
|------|-----|---------|-----------|---------|
| 开发速度 | 30% | 9 | 4 | 8 |
| MVP成本 | 25% | 10 | 6 | 7 |
| 可扩展性 | 20% | 8 | 9 | 8 |
| 团队熟悉度 | 15% | 7 | 8 | 6 |
| SQL支持 | 10% | 10 | 10 | 3 |
| **加权总分** | | **8.7** | **6.4** | **7.2** |

### 最终选择理由

Supabase在MVP阶段具有压倒性优势:
1. **开发速度**: 节省1-2周开发时间,这对4周MVP至关重要
2. **成本效益**: 初期免费,扩展后也只需$25/月
3. **PostgreSQL**: 关系型数据库支持复杂查询,符合我们的数据模型
4. **RLS**: 行级安全简化权限管理,减少安全漏洞风险

虽然功能受限,但MVP阶段的功能需求Supabase完全可以满足。如果未来需要复杂逻辑,可以使用Supabase Edge Functions或迁移到自建(Supabase是开源的,迁移路径清晰)。

---

## 后果 (Consequences)

### 正面影响
- ✅ **加速MVP**: 节省1-2周开发时间,确保4周内上线
- ✅ **降低成本**: 初期$0成本,扩展成本可控
- ✅ **提高安全性**: RLS和内建Auth减少安全漏洞
- ✅ **简化运维**: 无需管理服务器和数据库

### 负面影响/权衡
- ⚠️ **功能受限**: 复杂业务逻辑需要Edge Functions,性能可能不如自建
  - **缓解**: MVP阶段功能简单,暂时不是问题;v2.0可以评估迁移

- ⚠️ **厂商锁定**: 迁移到其他平台有成本
  - **缓解**: Supabase是开源的,可以自建部署;数据是标准PostgreSQL,导出容易

### 对其他系统的影响
- **前端**: 使用Supabase JS SDK,代码简洁
- **部署**: Vercel + Supabase完美集成,零配置
- **测试**: 需要配置测试数据库(Supabase提供测试项目)

---

## 实施计划 (Implementation)

1. ✅ 创建Supabase项目 (完成于2025-10-12)
2. ✅ 配置数据库schema和RLS策略 (预计1天)
3. ✅ 集成Supabase Auth到Next.js (预计0.5天)
4. ✅ 配置Storage用于音频文件上传 (预计0.5天)
5. ⏳ 实现前端与Supabase的集成 (预计1天)

**预计总时间**: 3天
**负责人**: 张三(后端), 李四(前端)

---

## 验证标准 (Validation)

MVP结束时(Week 4),验证:
- [ ] 用户认证成功率 > 99%
- [ ] 文件上传成功率 > 95%
- [ ] API响应时间 < 500ms (P95)
- [ ] 月度成本 < $25
- [ ] 无重大安全漏洞

**回顾时间**: 2026年1月(MVP上线3个月后)

如果以下情况发生,考虑重新评估:
- 用户量突破1000,性能出现瓶颈
- 需要实现复杂业务逻辑,Edge Functions无法满足
- 成本超过$100/月

---

## 参考资料 (References)

- [Supabase官方文档](https://supabase.com/docs)
- [Supabase vs Firebase对比](https://supabase.com/alternatives/supabase-vs-firebase)
- [PostgreSQL vs NoSQL讨论](...)
- [团队内部技术评审会议纪要](docs/meetings/2025-10-10-tech-review.md)

---

## 修订历史 (History)

| 日期 | 修改内容 | 修改人 |
|------|---------|--------|
| 2025-10-12 | 初稿 | 张三 |
| 2025-10-13 | 添加成本分析 | 李四 |
```

---

## 7.5 本章小结

技术栈选择阶段的核心要点:

1. **AI友好技术栈三大标准**:
   - 文档丰富: React > Vue > Svelte (训练数据量)
   - 类型安全: TypeScript首次可用率82% vs JavaScript 64%
   - 开箱即用: Supabase 30分钟 vs 传统栈2-3天

2. **10xDevelopers推荐栈**:
   - 前端: React 18 + TypeScript + Next.js 14
   - 样式: Tailwind CSS + Shadcn/ui
   - 后端: Supabase (PostgreSQL + Auth + Storage)
   - 部署: Vercel (零配置,全球CDN)

3. **Starter Kit使用**:
   - 官方: `npx create-next-app -e with-supabase`
   - Lovable: 自然语言 → 导出GitHub → Cursor增强
   - T3 Stack: 端到端类型安全(tRPC + Prisma)

4. **测试框架配置**:
   - 单元测试: Vitest (比Jest更快,零配置)
   - E2E测试: Playwright (多浏览器,自动截图)
   - 测试金字塔: 60-70%单元 + 20-30%集成 + 5-10% E2E

5. **技术决策文档(ADR)**:
   - 记录所有重要技术决策
   - 包含: 背景、决策、理由、后果、验证
   - 帮助团队记忆和AI理解架构

**关键洞察**:
> "技术栈选择不只是技术问题,更是效率问题。选择AI友好的技术栈,可以让AI代码生成质量从60%提升到85%,相当于团队效率提升40%。"

**实践建议**:
1. **MVP阶段**: 优先选择AI友好和开箱即用的技术栈(Supabase + Vercel)
2. **测试先行**: 在项目开始就配置好测试框架,而非等到后期
3. **记录决策**: 每个重要技术选择都写ADR,3个月后review
4. **Starter Kit**: 不要从零配置,使用官方Starter Kit节省2-3天

**下一章**: 我们将学习应用流程设计,包括站点地图设计、Lovable.dev快速UI原型、用户旅程映射,以及响应式设计规划。

---

**思考题**:
1. 你当前的技术栈是否AI友好?如果用Claude生成代码,首次可用率如何?
2. 如果重新选择技术栈,会选择什么?为什么?(用ADR格式写下来)
3. 你的项目是否有完整的测试配置?测试覆盖率是多少?

👉 [下一章:应用流程设计](chapter8-app-flow.md)
