# 第十二章:部署与运维

> **本章导读**
>
> 深入学习Vercel生产部署的完整流程,掌握环境配置管理的最佳实践,理解监控告警系统的搭建方法,以及如何实施性能优化策略。

---

## 12.1 Vercel生产部署

### 为什么选择Vercel?

**Vercel的核心优势**:
- ⚡ **零配置部署**: 连接GitHub仓库即可自动部署
- 🌍 **全球CDN**: Edge Network覆盖全球,毫秒级响应
- 🔄 **自动CI/CD**: 每次Git push自动构建和部署
- 🔒 **HTTPS自动化**: 自动配置SSL证书
- 📊 **Analytics内建**: 开箱即用的性能分析
- 💰 **慷慨免费额度**: Hobby计划足够MVP使用

**Vercel vs 传统部署对比**:

| 维度 | 传统部署 (AWS/DigitalOcean) | Vercel |
|------|---------------------------|---------|
| 初始配置 | 2-3天(服务器、Nginx、SSL) | 5分钟(连接GitHub) |
| CI/CD | 需要配置GitHub Actions | 自动内建 |
| CDN | 需要CloudFront/配置 | 自动全球分发 |
| HTTPS | 手动申请Let's Encrypt | 自动配置 |
| 回滚 | 手动执行脚本 | 一键回滚到任意版本 |
| Preview环境 | 需要手动配置 | 每个PR自动生成 |
| 月度成本(MVP) | $20-50 | $0 |

---

### Step 1: 准备项目代码 (15分钟)

#### 检查项目配置

**确保package.json包含必要的scripts**:

```json
// package.json
{
  "name": "techmeet",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

**Vercel构建配置(可选)**:

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "regions": ["iad1"], // 可选:指定部署区域 (iad1 = 美国东部)
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30 // API路由最大执行时间(秒)
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**环境变量检查清单**:

```bash
# .env.example (提交到Git作为模板)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# .env.local (不提交,仅本地开发)
# 复制.env.example到.env.local并填入真实值
```

**Git忽略配置**:

```gitignore
# .gitignore
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env.production

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

---

### Step 2: Vercel项目创建与连接 (10分钟)

#### 方式1: Vercel Dashboard (推荐新手)

**1. 创建Vercel账号**:
```
访问: https://vercel.com/signup
选择: Continue with GitHub (推荐)
授权: Vercel访问你的GitHub仓库
```

**2. 导入项目**:
```
1. 点击 "Add New Project"
2. 从GitHub仓库列表选择 "techmeet" (或你的项目名)
3. 如果看不到仓库,点击 "Adjust GitHub App Permissions"
```

**3. 配置项目**:

```
Project Name: techmeet (默认使用仓库名)

Framework Preset: Next.js (自动检测)

Root Directory: ./ (默认)

Build Command: npm run build (自动检测)

Output Directory: .next (自动检测)

Install Command: npm install (自动检测)
```

**4. 配置环境变量**:

在"Environment Variables"部分添加:

| Name | Value | Environment |
|------|-------|-------------|
| NEXT_PUBLIC_SUPABASE_URL | https://xxx.supabase.co | Production, Preview |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | eyJhbGc... | Production, Preview |
| SUPABASE_SERVICE_ROLE_KEY | eyJhbGc... | Production only |
| OPENAI_API_KEY | sk-... | Production only |
| UPSTASH_REDIS_REST_URL | https://xxx.upstash.io | Production, Preview |
| UPSTASH_REDIS_REST_TOKEN | AXX... | Production, Preview |

**重要提示**:
- ✅ `NEXT_PUBLIC_*`变量会暴露到浏览器,可以用于Production和Preview
- ⚠️ `SERVICE_ROLE_KEY`和`API_KEY`仅用于Production,不暴露到客户端

**5. 开始部署**:
```
点击 "Deploy" 按钮

等待构建过程 (通常2-5分钟):
→ Cloning repository
→ Installing dependencies
→ Building application
→ Uploading to Edge Network
→ Deployment ready! ✅

获得部署URL: https://techmeet.vercel.app
```

---

#### 方式2: Vercel CLI (推荐高级开发者)

**安装Vercel CLI**:

```bash
npm install -g vercel

# 登录
vercel login
# 选择GitHub登录
```

**部署项目**:

```bash
# 在项目根目录
cd techmeet

# 首次部署(交互式)
vercel

# Vercel会询问:
# ? Set up and deploy "~/techmeet"? [Y/n] y
# ? Which scope do you want to deploy to? Your Username
# ? Link to existing project? [y/N] n
# ? What's your project's name? techmeet
# ? In which directory is your code located? ./
# ? Want to override the settings? [y/N] n

# 开始构建和部署...
# ✅ Preview: https://techmeet-xxx.vercel.app
```

**配置环境变量(CLI)**:

```bash
# 添加Production环境变量
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# 粘贴值: https://xxx.supabase.co

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# 粘贴值: eyJhbGc...

vercel env add OPENAI_API_KEY production
# 粘贴值: sk-...

# 添加Preview环境变量
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
# 粘贴值: https://test-xxx.supabase.co (测试环境)

# 查看所有环境变量
vercel env ls
```

**部署到生产环境**:

```bash
# 部署到Production (techmeet.vercel.app)
vercel --prod

# 或使用别名
vercel alias set techmeet-xxx.vercel.app techmeet.vercel.app
```

---

### Step 3: 自定义域名配置 (20分钟)

#### 购买域名 (可选)

**推荐域名注册商**:
- Namecheap: $8-12/年
- GoDaddy: $10-15/年
- Cloudflare Registrar: $8-10/年(最便宜,无隐藏费用)

**示例**: 购买 `techmeet.io` 或 `yourdomain.com`

---

#### 在Vercel添加自定义域名

**1. 在Vercel Dashboard添加域名**:

```
Settings → Domains → Add Domain

输入域名: techmeet.io
或子域名: app.techmeet.io

点击 "Add"
```

**2. 配置DNS记录**:

Vercel会提供DNS配置选项:

**选项A: CNAME记录 (子域名,如app.techmeet.io)**:

```
在你的域名注册商(Namecheap/GoDaddy)添加:

Type: CNAME
Name: app
Value: cname.vercel-dns.com
TTL: 3600 (或自动)
```

**选项B: A记录 (根域名,如techmeet.io)**:

```
Type: A
Name: @
Value: 76.76.21.21 (Vercel提供的IP)
TTL: 3600

同时添加www子域:
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**3. 验证DNS配置**:

```bash
# 检查DNS是否生效 (可能需要等待5-30分钟)
dig techmeet.io
dig app.techmeet.io

# 或使用在线工具
# https://dnschecker.org/
```

**4. Vercel自动配置SSL**:

```
DNS生效后,Vercel自动:
✅ 申请Let's Encrypt SSL证书
✅ 配置HTTPS
✅ 设置HTTP到HTTPS重定向

通常在DNS生效后5分钟内完成
```

**5. 验证部署**:

```
访问: https://techmeet.io
验证: HTTPS正常,无证书警告
检查: 重定向工作(http://techmeet.io → https://techmeet.io)
```

---

### Step 4: 自动部署与CI/CD工作流 (已自动配置)

**Vercel Git集成自动完成**:

```
当你push到GitHub时:

main分支 → Production环境
├─ 触发: git push origin main
├─ 构建: Vercel自动构建
├─ 部署: 更新 techmeet.vercel.app
└─ 通知: GitHub commit状态更新

其他分支 → Preview环境
├─ 触发: git push origin feature/auth
├─ 构建: Vercel自动构建
├─ 部署: 生成 techmeet-git-feature-auth.vercel.app
└─ 通知: GitHub commit状态更新

Pull Request → Preview环境
├─ 触发: 创建或更新PR
├─ 构建: Vercel为每个PR构建
├─ 部署: 唯一的preview URL
├─ 评论: Vercel bot在PR中评论preview链接
└─ 更新: 每次PR更新重新部署
```

**GitHub集成详情**:

```yaml
# Vercel自动在GitHub创建以下状态检查:

checks:
  - name: "Vercel - Production"
    status: "✅ Deployed"
    url: "https://techmeet.vercel.app"

  - name: "Vercel - Preview"
    status: "✅ Ready"
    url: "https://techmeet-git-feature-auth.vercel.app"

notifications:
  - type: "commit_status"
    description: "Your deployment is ready"

  - type: "pr_comment"
    content: |
      ✅ Preview deployment ready!
      🔗 https://techmeet-git-feature-auth.vercel.app

      Changes detected:
      - app/auth/login/page.tsx
      - components/AuthForm.tsx
```

---

### 部署验证清单

```markdown
## 部署成功验证

### 基础验证
- [ ] Production URL可访问 (https://techmeet.vercel.app)
- [ ] 自定义域名正常 (https://techmeet.io)
- [ ] HTTPS证书有效,无浏览器警告
- [ ] HTTP自动重定向到HTTPS

### 功能验证
- [ ] 首页正常加载,无JS错误
- [ ] 用户注册和登录功能正常
- [ ] Supabase连接成功(检查Network tab)
- [ ] 环境变量正确加载(API调用成功)
- [ ] 文件上传功能正常(Supabase Storage)

### 性能验证
- [ ] Lighthouse Score > 90 (Performance)
- [ ] 首屏加载时间 < 2秒
- [ ] 图片自动优化(WebP格式)
- [ ] 代码分割正常(查看Network waterfall)

### SEO验证
- [ ] Meta标签正确(title, description)
- [ ] Open Graph标签存在(og:image, og:title)
- [ ] robots.txt可访问 (/robots.txt)
- [ ] sitemap.xml可访问 (/sitemap.xml)

### 错误处理
- [ ] 404页面正常显示
- [ ] 500错误有友好提示
- [ ] API错误有正确的错误消息
```

---

## 12.2 环境配置管理

### 环境分层策略

**三层环境架构**:

```
Development (本地开发)
├─ 数据: 本地PostgreSQL或Supabase测试项目
├─ API: 测试API Key
├─ URL: http://localhost:3000
└─ 目的: 快速迭代,频繁变更

Preview (预览环境)
├─ 数据: Supabase测试项目
├─ API: 测试API Key或生产Key(根据需要)
├─ URL: https://techmeet-git-*.vercel.app
└─ 目的: PR review,功能验证

Production (生产环境)
├─ 数据: Supabase生产项目
├─ API: 生产API Key
├─ URL: https://techmeet.io
└─ 目的: 真实用户,稳定性优先
```

---

### Development环境配置

**本地开发环境变量**:

```bash
# .env.local (不提交到Git)

# Supabase (开发环境)
NEXT_PUBLIC_SUPABASE_URL=https://dev-xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# 使用开发项目的service_role_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# OpenAI (开发)
OPENAI_API_KEY=sk-... # 可以用测试账号或生产账号

# Upstash (开发)
UPSTASH_REDIS_REST_URL=https://dev-xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXX...

# 开发特定配置
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**开发环境Supabase配置**:

```sql
-- 在Supabase开发项目中设置更宽松的限制

-- 开发环境允许更多请求
ALTER DATABASE postgres SET statement_timeout = '60s';

-- 关闭邮箱验证(开发时)
-- Dashboard → Authentication → Providers → Email
-- Enable email confirmation: OFF

-- 添加测试数据
INSERT INTO profiles (id, email, full_name) VALUES
  ('test-user-1', 'test1@example.com', 'Test User 1'),
  ('test-user-2', 'test2@example.com', 'Test User 2');

INSERT INTO meetings (user_id, title, status) VALUES
  ('test-user-1', 'Sample Meeting 1', 'completed'),
  ('test-user-1', 'Sample Meeting 2', 'processing');
```

---

### Preview环境配置

**Vercel Preview环境变量**:

在Vercel Dashboard设置Preview专用变量:

```
Environment: Preview

NEXT_PUBLIC_SUPABASE_URL=https://preview-xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

OPENAI_API_KEY=sk-... (可以用生产Key)

UPSTASH_REDIS_REST_URL=https://preview-xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXX...

NEXT_PUBLIC_APP_URL=https://techmeet-git-*.vercel.app
```

**Preview环境特点**:
- ✅ 使用测试数据库,避免污染生产数据
- ✅ 可以测试破坏性操作(删除、重置)
- ✅ Rate limiting可以设置更宽松
- ✅ 错误日志更详细(调试友好)

---

### Production环境配置

**Vercel Production环境变量**:

```
Environment: Production

NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (生产密钥,严格保密)

OPENAI_API_KEY=sk-... (生产账号)

UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXX...

# 生产专用配置
NEXT_PUBLIC_APP_URL=https://techmeet.io
NODE_ENV=production

# 监控和错误追踪(后续配置)
SENTRY_DSN=https://xxx@sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

**生产环境安全配置**:

```typescript
// lib/env.ts - 环境变量验证

import { z } from 'zod'

const envSchema = z.object({
  // Public variables (exposed to browser)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),

  // Private variables (server-only)
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().startsWith('sk-'),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
})

// Validate at build time
export const env = envSchema.parse(process.env)

// Usage example
import { env } from '@/lib/env'

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL // ✅ Type-safe
```

---

### 环境变量管理最佳实践

#### 1. 分离敏感和公开变量

```bash
# ✅ 正确:使用NEXT_PUBLIC_前缀
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
# 可以在浏览器访问: process.env.NEXT_PUBLIC_SUPABASE_URL

# ❌ 错误:敏感密钥使用PUBLIC前缀
NEXT_PUBLIC_SERVICE_ROLE_KEY=eyJhbGc... # 会暴露到浏览器!

# ✅ 正确:敏感密钥不用PUBLIC前缀
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
# 只能在服务端访问
```

#### 2. 使用环境特定的值

```bash
# .env.development
DATABASE_URL=postgresql://localhost:5432/techmeet_dev
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# .env.production
DATABASE_URL=postgresql://prod-db.supabase.co:5432/techmeet
NEXT_PUBLIC_API_URL=https://techmeet.io/api
```

#### 3. 永不提交敏感信息到Git

```gitignore
# .gitignore

# 环境变量文件
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# 但保留模板
# .env.example (可以提交)
```

#### 4. 提供环境变量模板

```bash
# .env.example (提交到Git)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Upstash Redis
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# App Configuration
NEXT_PUBLIC_APP_URL=your_app_url
```

#### 5. 环境变量轮换策略

```markdown
## 密钥轮换时间表

### 每3个月轮换:
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] OPENAI_API_KEY
- [ ] UPSTASH_REDIS_REST_TOKEN

### 轮换步骤:
1. 在服务提供商生成新密钥
2. 在Vercel添加新环境变量
3. 重新部署应用
4. 验证新密钥工作正常
5. 撤销旧密钥
6. 更新团队的.env.local文件

### 紧急轮换(密钥泄露):
1. 立即撤销泄露的密钥
2. 生成新密钥
3. 更新Vercel环境变量
4. 强制重新部署 (vercel --prod --force)
5. 通知团队更新本地环境
```

---

## 12.3 监控告警系统

### 为什么需要监控?

**生产环境的现实**:

```
没有监控的场景:
❌ 用户:"你的网站挂了!" (你才发现)
❌ 性能下降50%,你不知道
❌ API错误率10%,你不知道
❌ 数据库连接泄漏,直到系统崩溃

有监控的场景:
✅ 系统在用户发现前告警
✅ 性能下降5%就收到通知
✅ API错误率>1%立即告警
✅ 资源异常提前预警
```

---

### 监控层次

```
Layer 1: 应用性能监控 (APM)
├─ 响应时间
├─ 错误率
├─ 请求量
└─ 用户体验指标

Layer 2: 错误追踪
├─ JavaScript错误
├─ API错误
├─ 未捕获的异常
└─ 错误堆栈和上下文

Layer 3: 基础设施监控
├─ 服务器健康
├─ 数据库性能
├─ CDN状态
└─ 第三方服务可用性

Layer 4: 业务指标监控
├─ 用户注册量
├─ 活跃用户数
├─ 转化率
└─ 收入指标
```

---

### Vercel Analytics (内建)

**Vercel Analytics自动提供**:

```
Real Experience Score (RES):
├─ First Contentful Paint (FCP): 首次内容绘制
├─ Largest Contentful Paint (LCP): 最大内容绘制
├─ Cumulative Layout Shift (CLS): 累积布局偏移
├─ First Input Delay (FID): 首次输入延迟
└─ Time to First Byte (TTFB): 首字节时间

性能评分:
├─ Good: 75-100分 (✅ 绿色)
├─ Needs Improvement: 50-74分 (⚠️ 黄色)
└─ Poor: 0-49分 (❌ 红色)
```

**启用Vercel Analytics**:

```bash
# 1. 安装
npm install @vercel/analytics

# 2. 集成到应用
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <Analytics /> {/* ✅ 添加这一行 */}
      </body>
    </html>
  )
}
```

**查看Analytics**:

```
Vercel Dashboard → 项目 → Analytics

查看指标:
├─ Real Experience Score (用户真实体验)
├─ Page Views (页面浏览量)
├─ Unique Visitors (独立访客)
├─ Top Pages (最受欢迎页面)
└─ Devices (设备分布)
```

---

### Sentry错误追踪 (推荐)

**为什么需要Sentry?**

```
用户报告:"登录失败"

没有Sentry:
❌ 不知道错误详情
❌ 无法重现问题
❌ 不知道影响多少用户
❌ 靠猜测修复

有Sentry:
✅ 完整错误堆栈
✅ 用户操作路径
✅ 浏览器和设备信息
✅ 影响用户数量
✅ 错误趋势图
```

---

#### 配置Sentry

**1. 创建Sentry账号**:

```
访问: https://sentry.io/signup/
选择: Start Free (免费5K错误/月)
创建项目: techmeet
平台: Next.js
```

**2. 安装Sentry SDK**:

```bash
npm install @sentry/nextjs
```

**3. 运行配置向导**:

```bash
npx @sentry/wizard@latest -i nextjs

# 向导会自动:
# ✅ 创建sentry.client.config.ts
# ✅ 创建sentry.server.config.ts
# ✅ 创建sentry.edge.config.ts
# ✅ 更新next.config.js
# ✅ 添加.sentryclirc
```

**4. 配置Sentry**:

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 环境
  environment: process.env.NODE_ENV,

  // 采样率
  tracesSampleRate: 1.0, // 开发环境100%,生产环境建议0.1-0.2

  // 性能监控
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ["localhost", "techmeet.io", /^\//],
    }),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Session回放采样率
  replaysSessionSampleRate: 0.1, // 10%的正常session
  replaysOnErrorSampleRate: 1.0, // 100%的错误session

  // 过滤敏感信息
  beforeSend(event, hint) {
    // 移除敏感数据
    if (event.request) {
      delete event.request.cookies
      delete event.request.headers
    }

    // 过滤特定错误
    if (event.exception) {
      const error = hint.originalException
      if (error instanceof Error && error.message.includes('ResizeObserver')) {
        // 忽略ResizeObserver警告(浏览器bug)
        return null
      }
    }

    return event
  },
})
```

**5. 添加环境变量**:

```bash
# Vercel Dashboard → Settings → Environment Variables

# Production & Preview
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_AUTH_TOKEN=sntrys_xxx (从Sentry获取)
SENTRY_ORG=your-org
SENTRY_PROJECT=techmeet
```

**6. 测试Sentry集成**:

```typescript
// 测试页面: app/sentry-test/page.tsx
'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function SentryTestPage() {
  const testError = () => {
    try {
      throw new Error('Sentry test error - 测试错误追踪')
    } catch (error) {
      Sentry.captureException(error)
    }
  }

  const testMessage = () => {
    Sentry.captureMessage('Sentry test message - 测试消息', 'info')
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Sentry测试页面</h1>

      <div className="space-y-4">
        <button
          onClick={testError}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          测试错误捕获
        </button>

        <button
          onClick={testMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          测试消息发送
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        点击按钮后,访问Sentry Dashboard查看是否收到事件
      </p>
    </div>
  )
}
```

**7. 在Sentry Dashboard查看**:

```
Issues → 应该看到 "Sentry test error"

点击错误查看:
├─ 错误堆栈 (Stack Trace)
├─ 面包屑 (Breadcrumbs) - 用户操作路径
├─ 设备信息 (Device)
├─ 浏览器信息 (Browser)
├─ 用户信息 (User) - 如果设置了userId
└─ 额外上下文 (Additional Data)
```

---

#### Sentry最佳实践

**1. 设置用户上下文**:

```typescript
// 在用户登录后设置
import * as Sentry from '@sentry/nextjs'

async function handleLogin(user: User) {
  // 设置Sentry用户上下文
  Sentry.setUser({
    id: user.id,
    email: user.email, // 生产环境考虑隐私,可以用hash
    username: user.full_name,
  })
}

async function handleLogout() {
  // 清除用户上下文
  Sentry.setUser(null)
}
```

**2. 添加自定义标签和上下文**:

```typescript
// 为错误添加业务上下文
import * as Sentry from '@sentry/nextjs'

async function uploadMeeting(file: File) {
  Sentry.setTag('feature', 'meeting-upload')
  Sentry.setContext('upload', {
    fileSize: file.size,
    fileName: file.name,
    fileType: file.type,
  })

  try {
    await uploadToSupabase(file)
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        action: 'upload',
        status: 'failed',
      },
      extra: {
        fileSize: file.size,
        fileName: file.name,
      },
    })

    throw error
  }
}
```

**3. 性能监控**:

```typescript
// 监控关键操作性能
import * as Sentry from '@sentry/nextjs'

async function transcribeAudio(meetingId: string) {
  // 创建性能transaction
  const transaction = Sentry.startTransaction({
    op: 'transcribe',
    name: 'Audio Transcription',
  })

  try {
    // 子操作1: 下载音频
    const downloadSpan = transaction.startChild({
      op: 'download',
      description: 'Download audio from Supabase',
    })
    const audioData = await downloadAudio(meetingId)
    downloadSpan.finish()

    // 子操作2: 调用Whisper API
    const transcribeSpan = transaction.startChild({
      op: 'api-call',
      description: 'Call Whisper API',
    })
    const transcript = await callWhisperAPI(audioData)
    transcribeSpan.finish()

    // 子操作3: 保存结果
    const saveSpan = transaction.startChild({
      op: 'database',
      description: 'Save transcript to database',
    })
    await saveTranscript(meetingId, transcript)
    saveSpan.finish()

    transaction.finish()

    return transcript
  } catch (error) {
    transaction.setStatus('internal_error')
    transaction.finish()
    throw error
  }
}
```

---

### Uptime监控

**使用UptimeRobot (免费)**:

```
1. 访问: https://uptimerobot.com/
2. 创建Monitor:
   - Type: HTTPS
   - URL: https://techmeet.io
   - Monitoring Interval: 5分钟
   - Alert Contacts: 你的邮箱

3. 高级配置:
   - Keyword Check: 检查页面包含特定文本
   - Response Time Threshold: >2秒时告警
   - SSL Certificate: 证书过期前7天告警
```

**使用Checkly (更强大)**:

```bash
# 安装Checkly CLI
npm install -g checkly

# 创建检查配置
```

```typescript
// checkly.config.ts
import { defineConfig } from 'checkly'

export default defineConfig({
  projectName: 'TechMeet',
  logicalId: 'techmeet-checks',
  checks: {
    locations: ['us-east-1', 'eu-west-1', 'ap-southeast-1'],
    runtimeId: '2023.09',
    checkMatch: '**/*.check.ts',
    frequency: 5, // 每5分钟
    alertChannels: [
      {
        email: {
          address: 'alerts@techmeet.io',
        },
      },
    ],
  },
})
```

```typescript
// checks/homepage.check.ts
import { ApiCheck } from 'checkly/constructs'

new ApiCheck('homepage-check', {
  name: 'Homepage Check',
  request: {
    url: 'https://techmeet.io',
    method: 'GET',
    assertions: [
      {
        source: 'STATUS_CODE',
        comparison: 'EQUALS',
        target: 200,
      },
      {
        source: 'RESPONSE_TIME',
        comparison: 'LESS_THAN',
        target: 2000, // 2秒
      },
      {
        source: 'TEXT_BODY',
        comparison: 'CONTAINS',
        target: 'TechMeet', // 确保页面内容正确
      },
    ],
  },
})
```

---

### 日志聚合 (可选)

**使用Logtail (BetterStack)**:

```bash
npm install @logtail/node @logtail/winston
```

```typescript
// lib/logger.ts
import { Logtail } from '@logtail/node'
import winston from 'winston'
import { LogtailTransport } from '@logtail/winston'

const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN!)

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'techmeet' },
  transports: [
    // 开发环境输出到console
    ...(process.env.NODE_ENV === 'development'
      ? [new winston.transports.Console()]
      : []),

    // 生产环境发送到Logtail
    ...(process.env.NODE_ENV === 'production'
      ? [new LogtailTransport(logtail)]
      : []),
  ],
})

export { logger }

// 使用示例
import { logger } from '@/lib/logger'

logger.info('Meeting uploaded', {
  meetingId: 'xxx',
  userId: 'yyy',
  fileSize: 12345,
})

logger.error('Transcription failed', {
  meetingId: 'xxx',
  error: error.message,
  stack: error.stack,
})
```

---

### 告警配置

**Sentry告警规则**:

```
Sentry Dashboard → Settings → Alerts → New Alert Rule

规则1: 错误率突增
├─ Condition: Error rate > 5% in 5 minutes
├─ Action: Send email + Slack notification
└─ Priority: High

规则2: 新错误出现
├─ Condition: New issue detected
├─ Filter: Environment = production
├─ Action: Send Slack notification
└─ Priority: Medium

规则3: 性能下降
├─ Condition: P95 response time > 3 seconds
├─ Duration: 10 minutes
├─ Action: Send email
└─ Priority: High
```

**UptimeRobot告警**:

```
告警类型:
├─ Down: 网站无法访问
├─ Up: 网站恢复
├─ SSL Expiry: SSL证书即将过期
└─ Keyword: 关键词检查失败

通知渠道:
├─ Email: 立即通知
├─ SMS: 可选(付费)
├─ Slack: Webhook集成
└─ Webhook: 自定义处理
```

---

## 12.4 性能优化策略

### Next.js内建优化

**Next.js自动优化**:

```typescript
// 1. 图片自动优化
import Image from 'next/image'

export function MeetingThumbnail({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt="Meeting thumbnail"
      width={400}
      height={300}
      // ✅ Next.js自动:
      // - 转换为WebP/AVIF格式
      // - 响应式图片(srcset)
      // - 懒加载(loading="lazy")
      // - 图片压缩
    />
  )
}

// ❌ 不要用普通img标签
// <img src={src} alt="..." /> // 无优化
```

**2. 字体优化**:

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // 字体加载策略
  variable: '--font-inter',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}

// ✅ Next.js自动:
// - 字体自托管(no external request)
// - 预加载关键字体
// - 字体子集化(只包含需要的字符)
```

**3. 代码分割和懒加载**:

```typescript
// Dynamic import for code splitting
import dynamic from 'next/dynamic'

// ✅ 懒加载重型组件
const MeetingInsights = dynamic(() => import('@/components/MeetingInsights'), {
  loading: () => <div>Loading insights...</div>,
  ssr: false, // 可选:禁用SSR
})

export function MeetingDetail({ meetingId }: { meetingId: string }) {
  const [showInsights, setShowInsights] = useState(false)

  return (
    <div>
      <button onClick={() => setShowInsights(true)}>
        Show Insights
      </button>

      {/* 只在需要时加载 */}
      {showInsights && <MeetingInsights meetingId={meetingId} />}
    </div>
  )
}
```

---

### 数据库查询优化

**1. 使用索引**:

```sql
-- supabase/migrations/20241014_performance_indexes.sql

-- 为常用查询添加索引
CREATE INDEX idx_meetings_user_created ON meetings(user_id, created_at DESC);
CREATE INDEX idx_meetings_status ON meetings(status) WHERE status != 'completed';
CREATE INDEX idx_insights_meeting_type ON insights(meeting_id, type);

-- 复合索引用于排序查询
CREATE INDEX idx_meetings_user_starred_created
ON meetings(user_id, is_starred, created_at DESC);

-- 部分索引(只索引特定条件的行)
CREATE INDEX idx_meetings_processing
ON meetings(user_id, created_at DESC)
WHERE status = 'processing';
```

**2. 优化查询**:

```typescript
// ❌ 不好:N+1查询问题
async function getMeetingsWithInsights(userId: string) {
  const { data: meetings } = await supabase
    .from('meetings')
    .select('*')
    .eq('user_id', userId)

  // N+1问题:为每个meeting单独查询insights
  for (const meeting of meetings!) {
    const { data: insights } = await supabase
      .from('insights')
      .select('*')
      .eq('meeting_id', meeting.id)

    meeting.insights = insights
  }

  return meetings
}

// ✅ 好:使用JOIN一次查询
async function getMeetingsWithInsights(userId: string) {
  const { data } = await supabase
    .from('meetings')
    .select(`
      *,
      insights (
        id,
        type,
        content,
        timestamp
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return data
}
```

**3. 分页和限制**:

```typescript
// ✅ 分页加载
async function getMeetingsPaginated(
  userId: string,
  page: number = 1,
  pageSize: number = 20
) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('meetings')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to)

  return {
    meetings: data,
    totalCount: count,
    totalPages: Math.ceil((count || 0) / pageSize),
    currentPage: page,
  }
}
```

---

### React性能优化

**1. React.memo防止无效re-render**:

```typescript
// ❌ 不好:每次父组件更新都re-render
function MeetingCard({ meeting }: { meeting: Meeting }) {
  console.log('MeetingCard rendered')
  return <div>{meeting.title}</div>
}

// ✅ 好:使用React.memo
import { memo } from 'react'

export const MeetingCard = memo(function MeetingCard({ meeting }: { meeting: Meeting }) {
  console.log('MeetingCard rendered')
  return <div>{meeting.title}</div>
})

// 只在meeting变化时re-render
```

**2. useMemo缓存计算结果**:

```typescript
import { useMemo } from 'react'

function MeetingStats({ meetings }: { meetings: Meeting[] }) {
  // ❌ 不好:每次render都重新计算
  const stats = calculateStats(meetings)

  // ✅ 好:只在meetings变化时计算
  const stats = useMemo(() => calculateStats(meetings), [meetings])

  return <div>{stats.total} meetings</div>
}
```

**3. useCallback稳定函数引用**:

```typescript
import { useState, useCallback } from 'react'

function MeetingList() {
  const [meetings, setMeetings] = useState<Meeting[]>([])

  // ❌ 不好:每次render创建新函数
  const handleDelete = (id: string) => {
    setMeetings(meetings.filter(m => m.id !== id))
  }

  // ✅ 好:使用useCallback
  const handleDelete = useCallback((id: string) => {
    setMeetings(prev => prev.filter(m => m.id !== id))
  }, []) // 依赖为空,函数引用稳定

  return (
    <div>
      {meetings.map(meeting => (
        <MeetingCard
          key={meeting.id}
          meeting={meeting}
          onDelete={handleDelete} // 函数引用稳定,MeetingCard不会因此re-render
        />
      ))}
    </div>
  )
}
```

---

### 缓存策略

**1. React Query缓存(已在Chapter 10实现)**:

```typescript
// lib/queries.ts
import { useQuery } from '@tanstack/react-query'

export function useMeetings() {
  return useQuery({
    queryKey: ['meetings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('meetings')
        .select('*')
        .order('created_at', { ascending: false })

      return data
    },
    staleTime: 30 * 1000, // 30秒内数据视为fresh
    cacheTime: 5 * 60 * 1000, // 5分钟后清除缓存
  })
}

// 使用
function Dashboard() {
  const { data: meetings, isLoading } = useMeetings()

  // 30秒内再次访问,直接使用缓存,不发请求
}
```

**2. HTTP缓存头(Vercel自动配置)**:

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
    ]
  },
}
```

**3. Supabase缓存(Edge Functions)**:

```typescript
// supabase/functions/get-meeting-summary/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CACHE_TTL = 300 // 5分钟

serve(async (req) => {
  const { meetingId } = await req.json()

  // 检查缓存
  const cacheKey = `meeting:${meetingId}:summary`
  const cached = await redis.get(cacheKey)

  if (cached) {
    return new Response(cached, {
      headers: {
        'Content-Type': 'application/json',
        'X-Cache': 'HIT',
      },
    })
  }

  // 生成summary
  const summary = await generateSummary(meetingId)

  // 写入缓存
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(summary))

  return new Response(JSON.stringify(summary), {
    headers: {
      'Content-Type': 'application/json',
      'X-Cache': 'MISS',
    },
  })
})
```

---

### 性能监控和诊断

**1. Lighthouse CI**:

```bash
# 安装
npm install -g @lhci/cli

# 配置
```

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'https://techmeet.io',
        'https://techmeet.io/dashboard',
        'https://techmeet.io/meetings/sample',
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
```

```bash
# 运行Lighthouse CI
lhci autorun
```

**2. Web Vitals监控**:

```typescript
// app/layout.tsx
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // 发送到分析服务
    console.log(metric)

    // 发送到Vercel Analytics
    if (window.va) {
      window.va('event', {
        name: metric.name,
        value: metric.value,
        label: metric.id,
      })
    }

    // 发送到Sentry
    if (metric.value > threshold[metric.name]) {
      Sentry.captureMessage(`Poor ${metric.name}: ${metric.value}`, {
        level: 'warning',
        tags: {
          metric: metric.name,
        },
        extra: {
          value: metric.value,
          rating: metric.rating,
        },
      })
    }
  })

  return null
}

const threshold = {
  FCP: 2000,
  LCP: 2500,
  FID: 100,
  CLS: 0.1,
  TTFB: 600,
}
```

---

## 12.5 本章小结

部署与运维阶段的核心要点:

1. **Vercel生产部署**:
   - 零配置部署流程(5分钟从代码到上线)
   - 自动CI/CD(Git push → 自动构建部署)
   - Preview环境(每个PR自动生成预览)
   - 自定义域名配置和SSL自动化
   - 一键回滚和版本管理

2. **环境配置管理**:
   - 三层环境架构(Development/Preview/Production)
   - 环境变量分离和安全管理
   - NEXT_PUBLIC_前缀规则(公开vs私密)
   - 环境变量验证(Zod schema)
   - 密钥轮换策略(每3个月)

3. **监控告警系统**:
   - Vercel Analytics(RES性能监控)
   - Sentry错误追踪(完整堆栈和用户上下文)
   - Uptime监控(UptimeRobot/Checkly)
   - 日志聚合(Logtail可选)
   - 告警配置(错误率、性能下降、服务中断)

4. **性能优化策略**:
   - Next.js内建优化(图片、字体、代码分割)
   - 数据库查询优化(索引、JOIN、分页)
   - React性能优化(memo、useMemo、useCallback)
   - 多层缓存策略(React Query、HTTP、Redis)
   - 性能监控(Lighthouse CI、Web Vitals)

**关键洞察**:
> "部署不是结束,而是开始。现代云平台(Vercel)让部署变得微不足道,真正的挑战在于持续监控、快速响应和不断优化。通过完善的监控告警系统,我们在用户发现问题前就能主动解决;通过性能优化策略,我们确保应用始终保持最佳状态。"

**实践建议**:
1. **持续部署**: 每次commit自动部署到Preview环境,验证后合并到main
2. **监控先行**: 部署第一天就配置Sentry和Uptime监控,不要事后补充
3. **性能预算**: 设定性能基线(如Lighthouse >90分),低于阈值时告警
4. **定期审查**: 每周查看Sentry错误报告,每月review性能趋势
5. **文档化**: 记录部署流程、环境变量清单、告警处理SOP

**下一章**: 我们将学习文档维护(Documentation Maintenance),包括如何保持DDAD文档与代码同步、API文档自动生成、用户文档编写最佳实践,以及技术债务管理策略。

---

**思考题**:
1. 你的应用是否配置了错误追踪?能否在5分钟内定位生产环境的错误根因?
2. 如果你的网站半夜2点宕机,你多久能知道?如何快速恢复?
3. 你的应用Lighthouse性能分数是多少?有哪些优化空间?

👉 [下一章:文档维护](chapter13-documentation.md)
