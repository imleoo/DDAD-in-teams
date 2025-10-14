# 第十章:实施阶段

> **本章导读**
>
> 深入学习Lovable→Cursor→Testing的完整开发工作流,掌握AI Pair Programming的最佳实践,理解代码质量保证体系,以及如何配置高效的持续集成环境。

---

## 10.1 Lovable→Cursor→Testing完整工作流

### 什么是10x开发工作流?

**10x开发工作流**是一种AI原生的开发方法论,通过三个工具的协同使用,实现开发效率的数量级提升:

```
Lovable.dev (70% UI生成)
    ↓
Cursor (30% 逻辑增强)
    ↓
Testing (质量保证)
    ↓
Production Ready
```

**为什么是这个组合?**
- 🎨 **Lovable**: 擅长UI和基础CRUD,不擅长复杂逻辑
- 🧠 **Cursor**: 擅长业务逻辑、优化、重构,配合人类更高效
- ✅ **Testing**: 确保质量,支持持续迭代

---

### 阶段1: Lovable.dev快速原型(Day 1-2)

#### Step 1: 需求输入和项目初始化(30分钟)

**在Lovable.dev中输入**:

```markdown
# 项目描述
创建TechMeet应用 - AI会议纪要工具

## 核心功能
1. 用户认证(邮箱+密码)
2. 音频文件上传(MP3/WAV/M4A,最大200MB)
3. Dashboard展示会议列表
4. 会议详情页显示:
   - 转录文本
   - 架构决策
   - 技术权衡
   - 行动项
5. 导出到Notion(Markdown格式)

## 技术栈
- Frontend: React + TypeScript + Tailwind CSS
- UI Components: Shadcn/ui
- Backend: Supabase (Auth + Database + Storage)
- Deployment: Vercel

## 设计要求
- 现代简洁风格
- 主色调:蓝色(#3b82f6)
- 响应式设计,支持移动端
- 遵循WCAG 2.1 AA可访问性标准
```

**Lovable生成过程**:

```
⏳ Analyzing requirements... (30秒)
✅ Creating project structure
✅ Setting up Supabase backend
✅ Generating UI components
✅ Configuring routing
✅ Setting up authentication

🎉 Project ready! (约5分钟)
```

---

#### Step 2: Lovable生成的项目结构(自动)

**Lovable自动创建的文件结构**:

```
techmeet/
├── src/
│   ├── components/
│   │   ├── ui/                    # Shadcn/ui基础组件
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── AuthButton.tsx         # 登录/登出按钮
│   │   ├── MeetingCard.tsx        # 会议卡片组件
│   │   └── UploadZone.tsx         # 文件上传区域
│   ├── pages/
│   │   ├── Index.tsx              # 首页(Landing)
│   │   ├── Login.tsx              # 登录页
│   │   ├── Dashboard.tsx          # 会议列表
│   │   ├── Upload.tsx             # 上传页面
│   │   └── MeetingDetail.tsx      # 会议详情
│   ├── lib/
│   │   ├── supabase.ts            # Supabase客户端
│   │   └── utils.ts               # 工具函数
│   ├── hooks/
│   │   ├── useAuth.ts             # 认证Hook
│   │   └── useMeetings.ts         # 会议数据Hook
│   └── types/
│       └── database.ts            # TypeScript类型(自动生成)
├── supabase/
│   ├── migrations/
│   │   └── 20241012_initial.sql  # 初始数据库Schema
│   └── config.toml
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

#### Step 3: 检查Lovable生成的代码质量(15分钟)

**检查清单**:

```markdown
✅ TypeScript配置
- [ ] strict模式启用
- [ ] 所有组件有完整类型定义
- [ ] 没有any类型(或有明确注释)

✅ Supabase集成
- [ ] 环境变量正确配置(.env.example提供)
- [ ] RLS(Row Level Security)策略已设置
- [ ] 数据库表结构符合PRD

✅ UI组件质量
- [ ] Shadcn/ui组件正确集成
- [ ] Tailwind CSS配置包含设计Token
- [ ] 响应式类正确使用(sm:, md:, lg:)

✅ 认证流程
- [ ] 注册/登录页面功能完整
- [ ] 受保护路由有中间件
- [ ] 登出功能正常

✅ 代码规范
- [ ] ESLint配置存在
- [ ] Prettier配置存在
- [ ] Git ignore正确配置
```

**实际检查示例**:

```bash
# 1. 检查TypeScript严格模式
cat tsconfig.json | grep strict
# 期望输出: "strict": true

# 2. 检查环境变量
cat .env.example
# 期望输出:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 3. 检查Supabase表结构
cat supabase/migrations/20241012_initial.sql
```

**Lovable生成的Supabase Schema示例**:

```sql
-- Lovable自动生成的数据库结构

-- 用户Profile表
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 会议表
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  transcript TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 会议洞察表
CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('decision', 'trade_off', 'action_item', 'code_snippet')),
  content JSONB NOT NULL,
  timestamp TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS策略
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

-- 用户只能访问自己的数据
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own meetings" ON meetings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own meetings" ON meetings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meetings" ON meetings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meetings" ON meetings
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view insights of own meetings" ON insights
  FOR SELECT USING (
    meeting_id IN (
      SELECT id FROM meetings WHERE user_id = auth.uid()
    )
  );

-- 创建索引提升查询性能
CREATE INDEX idx_meetings_user_id ON meetings(user_id);
CREATE INDEX idx_meetings_created_at ON meetings(created_at DESC);
CREATE INDEX idx_insights_meeting_id ON insights(meeting_id);
CREATE INDEX idx_insights_type ON insights(type);
```

---

#### Step 4: 本地运行Lovable项目(10分钟)

**导出项目到GitHub**:

```bash
# 在Lovable界面点击"Export to GitHub"
# 1. 授权GitHub账号
# 2. 输入仓库名:techmeet-app
# 3. 选择Private
# 4. 点击Create Repository

# 等待导出完成(约1分钟)
# ✅ Repository created: github.com/yourusername/techmeet-app
```

**Clone到本地**:

```bash
# Clone仓库
git clone https://github.com/yourusername/techmeet-app.git
cd techmeet-app

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env.local

# 编辑.env.local,填入Supabase凭据
# VITE_SUPABASE_URL=https://xxxxx.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJhbGc...

# 启动开发服务器
pnpm dev

# 访问 http://localhost:5173
```

**初次运行验证**:

```markdown
✅ 首页加载成功
✅ 可以访问登录页
✅ 注册新用户
✅ 登录成功后跳转到Dashboard
✅ Dashboard显示空状态(暂无会议)
✅ 可以访问上传页面
```

---

### 阶段2: Cursor增强复杂逻辑(Day 3-4)

#### Step 1: 在Cursor中打开项目(5分钟)

```bash
# 方式1: 命令行
cursor .

# 方式2: Cursor菜单
# File → Open Folder → 选择techmeet-app目录
```

**Cursor初始配置**:

```json
// .cursor/settings.json (Cursor会提示创建)
{
  "cursor.ai.enabled": true,
  "cursor.ai.model": "claude-3.5-sonnet",
  "cursor.composer.enabled": true,
  "editor.inlineSuggest.enabled": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

#### Step 2: 添加音频上传到Supabase Storage(1-2小时)

**Lovable的局限**:
- ✅ Lovable生成了上传UI
- ❌ 但没有实现真正的Supabase Storage集成
- ❌ 没有上传进度显示
- ❌ 没有错误处理和重试

**在Cursor中使用Composer增强**:

**Cursor Prompt**:

```
增强src/components/UploadZone.tsx,实现完整的Supabase Storage上传:

需求:
1. 集成@supabase/storage-js上传API
2. 实时显示上传进度(百分比)
3. 文件验证:格式(MP3/WAV/M4A)和大小(<200MB)
4. 上传完成后自动创建meetings记录
5. 错误处理:网络失败、格式错误、大小超限
6. 支持取消上传
7. 上传成功后跳转到会议详情页

参考:
- docs/02-design/design-spec.md中的UploadZone组件设计
- Supabase Storage文档:https://supabase.com/docs/guides/storage
```

**Cursor自动生成的增强代码**:

```typescript
// src/components/UploadZone.tsx (Cursor增强版)

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import { UploadIcon, FileAudioIcon, XIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface UploadZoneProps {
  maxSize?: number // MB
  acceptedFormats?: string[]
}

export function UploadZone({
  maxSize = 200,
  acceptedFormats = ['audio/mpeg', 'audio/wav', 'audio/m4a']
}: UploadZoneProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [uploadController, setUploadController] = useState<AbortController | null>(null)

  const { toast } = useToast()
  const navigate = useNavigate()

  // 文件选择处理
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    if (!selectedFile) return

    // 验证文件大小
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setError(`文件太大,请上传小于${maxSize}MB的文件`)
      return
    }

    // 验证文件格式
    if (!acceptedFormats.includes(selectedFile.type)) {
      setError('不支持的文件格式,请上传MP3、WAV或M4A文件')
      return
    }

    setFile(selectedFile)
    setError(null)
  }, [maxSize, acceptedFormats])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a']
    },
    maxFiles: 1,
    multiple: false
  })

  // 上传处理
  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setProgress(0)
    setError(null)

    // 创建AbortController用于取消上传
    const controller = new AbortController()
    setUploadController(controller)

    try {
      // 1. 获取当前用户
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('请先登录')
      }

      // 2. 生成唯一文件名
      const timestamp = Date.now()
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const fileName = `${user.id}/${timestamp}-${sanitizedFileName}`

      // 3. 上传到Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100
            setProgress(Math.round(percent))
          },
        })

      if (uploadError) throw uploadError

      // 4. 创建会议记录
      const { data: meeting, error: dbError } = await supabase
        .from('meetings')
        .insert({
          user_id: user.id,
          title: file.name.replace(/\.[^/.]+$/, ''), // 移除文件扩展名
          audio_url: uploadData.path,
          status: 'pending',
        })
        .select()
        .single()

      if (dbError) throw dbError

      // 5. 成功提示
      toast({
        title: '上传成功!',
        description: '正在处理您的会议录音...',
        duration: 3000,
      })

      // 6. 跳转到会议详情页
      navigate(`/meetings/${meeting.id}`)

    } catch (err: any) {
      console.error('Upload error:', err)

      if (err.name === 'AbortError') {
        setError('上传已取消')
      } else if (err.message?.includes('network')) {
        setError('网络连接失败,请检查网络后重试')
      } else if (err.message?.includes('storage')) {
        setError('存储服务暂时不可用,请稍后重试')
      } else {
        setError(err.message || '上传失败,请重试')
      }

      toast({
        title: '上传失败',
        description: error,
        variant: 'destructive',
        duration: 5000,
      })
    } finally {
      setUploading(false)
      setUploadController(null)
    }
  }

  // 取消上传
  const handleCancel = () => {
    if (uploadController) {
      uploadController.abort()
      setUploading(false)
      setProgress(0)
      toast({
        title: '上传已取消',
        duration: 2000,
      })
    }
  }

  // 移除文件
  const handleRemove = () => {
    setFile(null)
    setProgress(0)
    setError(null)
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* 拖拽上传区域 */}
      {!file && (
        <Card>
          <CardContent className="p-0">
            <div
              {...getRootProps()}
              className={`
                flex flex-col items-center justify-center
                min-h-[300px] p-8
                border-2 border-dashed rounded-lg
                cursor-pointer transition-colors
                ${isDragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                }
              `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100">
                  <UploadIcon className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 mb-1">
                    {isDragActive ? '释放文件以上传' : '拖拽音频文件到这里'}
                  </p>
                  <p className="text-sm text-gray-600">
                    或点击选择文件
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  支持格式: MP3, WAV, M4A • 最大{maxSize}MB
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 文件预览和上传 */}
      {file && (
        <Card>
          <CardContent className="p-6 space-y-4">
            {/* 文件信息 */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                  <FileAudioIcon className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!uploading && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleRemove}
                  aria-label="移除文件"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* 上传进度 */}
            {uploading && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <p className="text-gray-600">
                    上传中... {progress}%
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancel}
                  >
                    取消
                  </Button>
                </div>
              </div>
            )}

            {/* 上传按钮 */}
            {!uploading && (
              <Button
                onClick={handleUpload}
                className="w-full"
                size="lg"
              >
                <UploadIcon className="mr-2 h-5 w-5" />
                开始上传并转录
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* 错误提示 */}
      {error && (
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
```

**改进要点**:
- ✅ 完整的Supabase Storage集成
- ✅ 实时上传进度显示
- ✅ 文件验证(格式、大小)
- ✅ 错误处理和用户友好提示
- ✅ 支持取消上传
- ✅ 上传成功后自动创建会议记录并跳转

---

#### Step 3: 添加AI转录集成(2-3小时)

**需求**: 音频上传后,自动触发Whisper API转录

**架构设计**:

```
音频上传成功
    ↓
创建meetings记录(status: 'pending')
    ↓
触发Supabase Edge Function
    ↓
Edge Function调用Whisper API
    ↓
更新meetings记录(status: 'completed', transcript: '...')
    ↓
前端Realtime订阅自动更新UI
```

**在Cursor中创建Edge Function**:

**Cursor Prompt**:

```
创建Supabase Edge Function用于AI转录:

文件位置: supabase/functions/transcribe-audio/index.ts

需求:
1. 接收meetingId和audioPath参数
2. 从Supabase Storage下载音频文件
3. 调用OpenAI Whisper API转录
4. 更新meetings表的transcript字段
5. 更新status为'completed'或'failed'
6. 错误处理和重试逻辑(最多3次)
7. 日志记录所有关键步骤

技术细节:
- 使用Deno运行时
- OpenAI API: whisper-1模型
- 环境变量: OPENAI_API_KEY
- Supabase客户端使用service_role_key
```

**Cursor生成的Edge Function**:

```typescript
// supabase/functions/transcribe-audio/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface TranscribeRequest {
  meetingId: string
  audioPath: string
}

// 使用service_role_key创建Supabase客户端(绕过RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

serve(async (req) => {
  try {
    // 1. 解析请求
    const { meetingId, audioPath }: TranscribeRequest = await req.json()

    console.log(`[${meetingId}] Starting transcription for: ${audioPath}`)

    // 2. 更新状态为processing
    await supabase
      .from('meetings')
      .update({ status: 'processing' })
      .eq('id', meetingId)

    // 3. 从Supabase Storage下载音频文件
    const { data: audioData, error: downloadError } = await supabase.storage
      .from('audio-files')
      .download(audioPath)

    if (downloadError) {
      throw new Error(`Download failed: ${downloadError.message}`)
    }

    console.log(`[${meetingId}] Audio downloaded: ${audioData.size} bytes`)

    // 4. 准备Whisper API请求
    const formData = new FormData()
    formData.append('file', audioData, 'audio.mp3')
    formData.append('model', 'whisper-1')
    formData.append('language', 'en') // MVP阶段只支持英文
    formData.append('response_format', 'verbose_json') // 获取时间戳信息

    // 5. 调用Whisper API(带重试)
    let transcript = ''
    let retries = 0
    const maxRetries = 3

    while (retries < maxRetries) {
      try {
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: formData,
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Whisper API error: ${response.status} ${errorText}`)
        }

        const result = await response.json()
        transcript = result.text

        console.log(`[${meetingId}] Transcription completed: ${transcript.length} characters`)
        break

      } catch (error) {
        retries++
        console.error(`[${meetingId}] Transcription attempt ${retries} failed:`, error)

        if (retries >= maxRetries) {
          throw error
        }

        // 指数退避重试
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)))
      }
    }

    // 6. 更新meetings记录
    const { error: updateError } = await supabase
      .from('meetings')
      .update({
        transcript,
        status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', meetingId)

    if (updateError) {
      throw new Error(`Database update failed: ${updateError.message}`)
    }

    console.log(`[${meetingId}] Meeting updated with transcript`)

    // 7. 返回成功响应
    return new Response(
      JSON.stringify({
        success: true,
        meetingId,
        transcriptLength: transcript.length,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error: any) {
    console.error('Transcription failed:', error)

    // 更新会议状态为failed
    if (req.json) {
      try {
        const { meetingId } = await req.json()
        await supabase
          .from('meetings')
          .update({
            status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', meetingId)
      } catch (e) {
        console.error('Failed to update meeting status:', e)
      }
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
```

**部署Edge Function**:

```bash
# 1. 安装Supabase CLI
npm install -g supabase

# 2. 登录Supabase
supabase login

# 3. 关联项目
supabase link --project-ref your-project-ref

# 4. 设置环境变量(在Supabase Dashboard)
# Settings → Edge Functions → Environment Variables
# OPENAI_API_KEY=sk-...

# 5. 部署函数
supabase functions deploy transcribe-audio

# 6. 测试函数
supabase functions invoke transcribe-audio \
  --body '{"meetingId":"xxx","audioPath":"user-id/timestamp-file.mp3"}'
```

---

#### Step 4: 前端集成Realtime更新(1小时)

**需求**: 用户上传后,自动订阅会议状态更新,无需刷新页面

**在Cursor中增强MeetingDetail页面**:

**Cursor Prompt**:

```
增强src/pages/MeetingDetail.tsx,添加Supabase Realtime订阅:

需求:
1. 组件加载时订阅meetings表的UPDATE事件
2. 当status从'processing'变为'completed'时,自动更新UI
3. 显示实时处理进度(如果可用)
4. 组件卸载时取消订阅
5. 优雅的加载状态和错误处理

参考:
- Supabase Realtime文档
- docs/03-implementation/realtime-updates.md
```

**Cursor生成的增强代码**:

```typescript
// src/pages/MeetingDetail.tsx

import { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'
import { Loader2Icon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'

interface Meeting {
  id: string
  user_id: string
  title: string
  audio_url: string
  transcript: string | null
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
  updated_at: string
}

export function MeetingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    // 初始加载
    loadMeeting()

    // Realtime订阅
    const channel: RealtimeChannel = supabase
      .channel(`meeting-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'meetings',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          console.log('Meeting updated via Realtime:', payload.new)
          setMeeting(payload.new as Meeting)

          // 如果状态变为completed,触发通知
          if (payload.new.status === 'completed' && meeting?.status !== 'completed') {
            showCompletionNotification()
          }
        }
      )
      .subscribe()

    // 清理订阅
    return () => {
      supabase.removeChannel(channel)
    }
  }, [id])

  const loadMeeting = async () => {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      if (!data) {
        setError('会议不存在')
        return
      }

      setMeeting(data)
    } catch (err: any) {
      console.error('Load meeting error:', err)
      setError(err.message || '加载失败')
    } finally {
      setLoading(false)
    }
  }

  const showCompletionNotification = () => {
    // 使用浏览器通知API
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('转录完成!', {
        body: `${meeting?.title} 的转录已完成`,
        icon: '/logo.png',
      })
    }
  }

  // 加载状态
  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  // 错误状态
  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>加载失败</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  // 会议不存在
  if (!meeting) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{meeting.title}</h1>
        <p className="text-sm text-gray-600 mt-1">
          创建于 {new Date(meeting.created_at).toLocaleString('zh-CN')}
        </p>
      </div>

      {/* 处理状态 */}
      {meeting.status === 'pending' && (
        <Alert>
          <Loader2Icon className="h-4 w-4 animate-spin" />
          <AlertTitle>准备处理</AlertTitle>
          <AlertDescription>
            您的会议录音已上传,正在排队等待处理...
          </AlertDescription>
        </Alert>
      )}

      {meeting.status === 'processing' && (
        <Alert>
          <Loader2Icon className="h-4 w-4 animate-spin" />
          <AlertTitle>正在转录</AlertTitle>
          <AlertDescription>
            AI正在转录您的会议录音,这通常需要几分钟时间。您可以离开此页面,转录完成后会发送通知。
          </AlertDescription>
        </Alert>
      )}

      {meeting.status === 'failed' && (
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>处理失败</AlertTitle>
          <AlertDescription>
            转录过程出现错误,请重新上传或联系支持团队。
          </AlertDescription>
        </Alert>
      )}

      {meeting.status === 'completed' && (
        <>
          {/* 成功提示 */}
          <Alert>
            <CheckCircleIcon className="h-4 w-4 text-success-500" />
            <AlertTitle>转录完成</AlertTitle>
            <AlertDescription>
              AI已成功转录您的会议录音。
            </AlertDescription>
          </Alert>

          {/* 转录文本 */}
          <Card>
            <CardHeader>
              <CardTitle>转录文本</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {meeting.transcript}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* TODO: 添加智能提取的纪要内容(Chapter 10.2) */}
        </>
      )}
    </div>
  )
}
```

**改进要点**:
- ✅ Supabase Realtime实时订阅
- ✅ 自动更新UI无需刷新
- ✅ 浏览器通知API集成
- ✅ 优雅的加载和错误状态
- ✅ 骨架屏提升用户体验

---

### 阶段3: 测试与质量保证(Day 5)

#### Step 1: E2E测试with Playwright(2-3小时)

**在Cursor中创建E2E测试**:

**Cursor Prompt**:

```
创建Playwright E2E测试套件,测试完整的用户旅程:

文件位置: tests/e2e/upload-flow.spec.ts

测试场景:
1. 用户登录
2. 上传音频文件
3. 等待转录完成(使用Supabase Realtime或轮询)
4. 验证转录文本显示
5. 验证可以导出纪要

技术细节:
- 使用Playwright fixtures
- 设置测试用户(beforeAll)
- 清理测试数据(afterAll)
- 使用page.waitForSelector等待异步更新
- 设置合理的超时时间(转录可能需要2分钟)
```

**Cursor生成的E2E测试**:

```typescript
// tests/e2e/upload-flow.spec.ts

import { test, expect } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import path from 'path'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 用于测试清理
)

test.describe('Upload and Transcription Flow', () => {
  let testUserId: string
  let testMeetingId: string

  test.beforeAll(async () => {
    // 创建测试用户
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'test@techmeet.com',
      password: 'SecureTestPassword123',
    })

    if (authError) throw authError
    testUserId = authData.user!.id
  })

  test.afterAll(async () => {
    // 清理测试数据
    if (testUserId) {
      // 删除测试用户创建的会议
      await supabase
        .from('meetings')
        .delete()
        .eq('user_id', testUserId)

      // 删除测试用户
      await supabase.auth.admin.deleteUser(testUserId)
    }
  })

  test('complete user journey: login → upload → transcribe → view', async ({ page }) => {
    // 1. 访问首页
    await page.goto('/')
    await expect(page).toHaveTitle(/TechMeet/)

    // 2. 点击登录
    await page.click('text=登录')
    await expect(page).toHaveURL('/login')

    // 3. 填写登录表单
    await page.fill('input[name="email"]', 'test@techmeet.com')
    await page.fill('input[name="password"]', 'SecureTestPassword123')
    await page.click('button[type="submit"]')

    // 4. 验证跳转到Dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('我的会议')

    // 5. 点击上传按钮
    await page.click('text=上传会议')
    await expect(page).toHaveURL('/upload')

    // 6. 上传音频文件
    const fileInput = page.locator('input[type="file"]')
    const testAudioPath = path.join(__dirname, '../fixtures/sample-meeting-30s.mp3')
    await fileInput.setInputFiles(testAudioPath)

    // 7. 等待文件预览显示
    await expect(page.locator('text=sample-meeting-30s.mp3')).toBeVisible()

    // 8. 点击上传按钮
    await page.click('text=开始上传并转录')

    // 9. 等待上传完成提示
    await expect(page.locator('text=上传成功')).toBeVisible({ timeout: 30000 })

    // 10. 验证跳转到会议详情页
    await expect(page).toHaveURL(/\/meetings\/[a-z0-9-]+/)

    // 提取meetingId用于清理
    const url = page.url()
    testMeetingId = url.split('/').pop()!

    // 11. 验证显示"正在转录"状态
    await expect(page.locator('text=正在转录')).toBeVisible()

    // 12. 等待转录完成(最多2分钟)
    await expect(page.locator('text=转录完成')).toBeVisible({ timeout: 120000 })

    // 13. 验证转录文本显示
    await expect(page.locator('h2:has-text("转录文本")')).toBeVisible()
    const transcriptText = await page.locator('.prose p').textContent()
    expect(transcriptText).not.toBeNull()
    expect(transcriptText!.length).toBeGreaterThan(0)

    // 14. 验证可以导出(简化版,只检查按钮存在)
    // 完整导出功能在后续实现
    // await expect(page.locator('text=导出到Notion')).toBeVisible()
  })

  test('handles upload validation errors correctly', async ({ page }) => {
    // 登录
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@techmeet.com')
    await page.fill('input[name="password"]', 'SecureTestPassword123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')

    // 访问上传页面
    await page.goto('/upload')

    // 尝试上传不支持的文件格式(PDF)
    const fileInput = page.locator('input[type="file"]')
    const invalidFilePath = path.join(__dirname, '../fixtures/invalid-file.pdf')
    await fileInput.setInputFiles(invalidFilePath)

    // 验证错误提示
    await expect(page.locator('text=不支持的文件格式')).toBeVisible()
  })

  test('handles network errors gracefully', async ({ page, context }) => {
    // 登录
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@techmeet.com')
    await page.fill('input[name="password"]', 'SecureTestPassword123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')

    // 访问上传页面
    await page.goto('/upload')

    // 选择文件
    const fileInput = page.locator('input[type="file"]')
    const testAudioPath = path.join(__dirname, '../fixtures/sample-meeting-30s.mp3')
    await fileInput.setInputFiles(testAudioPath)

    // 模拟网络失败
    await context.setOffline(true)

    // 尝试上传
    await page.click('text=开始上传并转录')

    // 验证错误提示
    await expect(page.locator('text=网络连接失败')).toBeVisible({ timeout: 10000 })

    // 恢复网络
    await context.setOffline(false)

    // 验证可以重试(点击重试按钮或重新上传)
    // 这里简化处理,实际应该测试重试功能
  })
})
```

**运行E2E测试**:

```bash
# 安装Playwright
pnpm add -D @playwright/test

# 安装浏览器
npx playwright install

# 运行测试
npx playwright test

# UI模式(可视化调试)
npx playwright test --ui

# 只运行upload-flow测试
npx playwright test upload-flow
```

---

### 工作流总结

**时间分配**:

| 阶段 | 工具 | 时间 | 产出 |
|------|------|------|------|
| 原型生成 | Lovable | 0.5天 | 70% UI + 基础CRUD |
| 逻辑增强 | Cursor | 1.5天 | 复杂业务逻辑 + AI集成 |
| 测试验证 | Playwright | 0.5天 | E2E测试 + 质量保证 |
| **总计** | | **2.5天** | **MVP可上线** |

**vs 传统开发**:

| 维度 | 传统开发 | 10x工作流 | 效率提升 |
|------|---------|----------|---------|
| UI开发 | 3-5天 | 0.5天 (Lovable) | 6-10x |
| 后端集成 | 2-3天 | 1天 (Supabase自动) | 2-3x |
| AI集成 | 2-3天 | 1天 (Cursor辅助) | 2-3x |
| 测试编写 | 1-2天 | 0.5天 (Playwright生成) | 2-4x |
| **总计** | **8-13天** | **2.5-3天** | **3-5x** |

---

## 10.2 AI Pair Programming最佳实践

### 什么是AI Pair Programming?

**AI Pair Programming**是指开发者与AI助手(如Cursor)协作编程,AI作为"结对编程伙伴"辅助代码编写、重构和问题解决。

**与传统结对编程对比**:

| 维度 | 传统结对编程 | AI Pair Programming |
|------|-------------|-------------------|
| 成本 | 需要两名开发者 | 单个开发者 + AI订阅 |
| 响应速度 | 即时讨论 | 即时生成(1-5秒) |
| 专业广度 | 受限于伙伴经验 | AI知识覆盖极广 |
| 上下文理解 | 人类理解更深 | AI需要明确指令 |
| 创意想法 | 人类更有创造力 | AI提供大量模式参考 |

**最佳搭配**: 开发者创意和架构决策 + AI执行和模式应用

---

### Cursor Composer核心功能

#### 功能1: Multi-file Editing(多文件编辑)

**使用场景**: 跨多个文件的重构、功能添加

**示例: 添加会议收藏功能**:

**Cursor Prompt**:

```
添加会议收藏功能,涉及多个文件:

数据库层:
- 在meetings表添加is_starred字段(boolean, default false)
- 创建migration文件

API层:
- 在src/lib/supabase.ts添加toggleMeetingStar函数

UI层:
- 在src/components/MeetingCard.tsx添加收藏按钮
- 在src/pages/Dashboard.tsx添加"收藏"筛选标签

需求:
- 点击星标按钮切换收藏状态
- 收藏的会议在Dashboard可以筛选显示
- 使用Lucide React的StarIcon和StarOffIcon
- 乐观更新UI(点击立即反馈,不等待API)
- 错误时回滚状态

请一次性修改所有相关文件。
```

**Cursor的响应**:

Cursor Composer会同时打开并编辑4个文件:

**文件1: supabase/migrations/20241013_add_starred.sql**

```sql
-- Add is_starred column to meetings table
ALTER TABLE meetings
ADD COLUMN is_starred BOOLEAN DEFAULT FALSE;

-- Create index for faster filtering
CREATE INDEX idx_meetings_starred ON meetings(user_id, is_starred)
WHERE is_starred = TRUE;
```

**文件2: src/lib/supabase.ts**

```typescript
// 添加到现有文件末尾

/**
 * 切换会议收藏状态
 */
export async function toggleMeetingStar(
  meetingId: string,
  currentStarred: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('meetings')
      .update({ is_starred: !currentStarred })
      .eq('id', meetingId)

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error('Toggle star error:', error)
    return { success: false, error: error.message }
  }
}
```

**文件3: src/components/MeetingCard.tsx**

```typescript
// 在现有MeetingCard组件中添加收藏功能

import { useState } from 'react'
import { StarIcon } from 'lucide-react'
import { toggleMeetingStar } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export function MeetingCard({ meeting, onUpdate }: MeetingCardProps) {
  const [isStarred, setIsStarred] = useState(meeting.is_starred)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleToggleStar = async (e: React.MouseEvent) => {
    e.stopPropagation() // 防止触发卡片点击

    // 乐观更新
    const previousStarred = isStarred
    setIsStarred(!isStarred)
    setIsUpdating(true)

    const { success, error } = await toggleMeetingStar(meeting.id, previousStarred)

    setIsUpdating(false)

    if (!success) {
      // 回滚状态
      setIsStarred(previousStarred)
      toast({
        title: '操作失败',
        description: error || '请稍后重试',
        variant: 'destructive',
      })
    } else {
      // 通知父组件更新数据
      onUpdate?.()
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      {/* ... 现有卡片内容 ... */}

      {/* 新增:收藏按钮 */}
      <div className="absolute top-4 right-4">
        <Button
          size="icon"
          variant="ghost"
          onClick={handleToggleStar}
          disabled={isUpdating}
          aria-label={isStarred ? '取消收藏' : '收藏'}
        >
          <StarIcon
            className={`h-5 w-5 ${
              isStarred
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-400'
            }`}
          />
        </Button>
      </div>
    </Card>
  )
}
```

**文件4: src/pages/Dashboard.tsx**

```typescript
// 在Dashboard组件中添加筛选功能

import { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

type FilterType = 'all' | 'starred' | 'recent'

export function DashboardPage() {
  const [filter, setFilter] = useState<FilterType>('all')
  const [meetings, setMeetings] = useState<Meeting[]>([])

  useEffect(() => {
    loadMeetings()
  }, [filter])

  const loadMeetings = async () => {
    let query = supabase
      .from('meetings')
      .select('*')
      .order('created_at', { ascending: false })

    // 根据筛选条件调整查询
    if (filter === 'starred') {
      query = query.eq('is_starred', true)
    } else if (filter === 'recent') {
      // 最近7天
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      query = query.gte('created_at', sevenDaysAgo.toISOString())
    }

    const { data, error } = await query

    if (!error && data) {
      setMeetings(data)
    }
  }

  return (
    <div className="container max-w-7xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">我的会议</h1>

      {/* 筛选标签 */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
        <TabsList>
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="starred">收藏</TabsTrigger>
          <TabsTrigger value="recent">最近</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          {meetings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {filter === 'starred' ? '还没有收藏的会议' : '暂无会议'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meetings.map(meeting => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onUpdate={loadMeetings}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

**改进要点**:
- ✅ 一次Prompt完成4个文件修改
- ✅ 数据库migration自动生成
- ✅ 乐观更新提升用户体验
- ✅ 错误处理和回滚机制
- ✅ 代码风格与现有项目一致

---

#### 功能2: Context-Aware Suggestions(上下文感知建议)

**Cursor如何理解上下文**:

```
项目上下文:
├── 当前打开的文件
├── 相关imports的文件
├── 项目package.json(依赖)
├── TypeScript类型定义
└── @符号引用的特定文件
```

**示例: 智能提取纪要内容**:

**Cursor Prompt** (使用@符号引用上下文):

```
@src/pages/MeetingDetail.tsx
@docs/02-design/feature-spec.md

在MeetingDetail页面添加智能提取的纪要内容展示:

需求参考feature-spec.md中的F3功能描述:
- 架构决策(Architecture Decisions)
- 技术权衡(Technical Trade-offs)
- 行动项(Action Items)
- 代码片段(Code Snippets)

实现:
1. 创建新的insights表查询函数
2. 使用Tabs组件展示不同类型的insights
3. 每种类型有专门的展示卡片
4. 代码片段使用语法高亮(react-syntax-highlighter)
5. 时间戳可点击(未来跳转到音频位置,v1.1功能)

风格:
- 遵循现有MeetingDetail.tsx的设计语言
- 使用Shadcn/ui组件(Card, Tabs, Badge)
- 响应式布局(mobile/desktop)
```

**Cursor理解的上下文**:

```typescript
// Cursor自动读取并理解:
// 1. MeetingDetail.tsx的现有结构和导入
// 2. feature-spec.md中的详细需求
// 3. Shadcn/ui组件API(从node_modules)
// 4. TypeScript insights表类型(从types/database.ts)
// 5. 项目的Tailwind配置和设计Token
```

**Cursor生成的代码**(完全符合上下文):

```typescript
// src/pages/MeetingDetail.tsx (追加部分)

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript'

// 注册语言
SyntaxHighlighter.registerLanguage('typescript', typescript)

interface Insight {
  id: string
  meeting_id: string
  type: 'decision' | 'trade_off' | 'action_item' | 'code_snippet'
  content: any
  timestamp: string | null
  created_at: string
}

export function MeetingDetailPage() {
  // ... 现有代码 ...

  const [insights, setInsights] = useState<Insight[]>([])

  useEffect(() => {
    if (meeting?.status === 'completed') {
      loadInsights()
    }
  }, [meeting?.status])

  const loadInsights = async () => {
    const { data, error } = await supabase
      .from('insights')
      .select('*')
      .eq('meeting_id', id)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setInsights(data)
    }
  }

  // 按类型分组insights
  const decisions = insights.filter(i => i.type === 'decision')
  const tradeOffs = insights.filter(i => i.type === 'trade_off')
  const actionItems = insights.filter(i => i.type === 'action_item')
  const codeSnippets = insights.filter(i => i.type === 'code_snippet')

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-6">
      {/* ... 现有状态显示 ... */}

      {meeting.status === 'completed' && (
        <Tabs defaultValue="decisions" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="decisions" className="flex items-center gap-2">
              <span className="hidden sm:inline">架构决策</span>
              <Badge variant="secondary">{decisions.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="tradeoffs" className="flex items-center gap-2">
              <span className="hidden sm:inline">技术权衡</span>
              <Badge variant="secondary">{tradeOffs.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center gap-2">
              <span className="hidden sm:inline">行动项</span>
              <Badge variant="secondary">{actionItems.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <span className="hidden sm:inline">代码</span>
              <Badge variant="secondary">{codeSnippets.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* 架构决策 */}
          <TabsContent value="decisions" className="mt-6 space-y-4">
            {decisions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  未识别到明确的架构决策
                </CardContent>
              </Card>
            ) : (
              decisions.map((insight) => (
                <Card key={insight.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">
                        {insight.content.decision}
                      </CardTitle>
                      {insight.timestamp && (
                        <Badge variant="outline" className="cursor-pointer">
                          {insight.timestamp}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">决策理由</h4>
                      <p className="text-sm text-gray-600">{insight.content.rationale}</p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">影响范围</h4>
                      <p className="text-sm text-gray-600">{insight.content.impact}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* 技术权衡 */}
          <TabsContent value="tradeoffs" className="mt-6 space-y-4">
            {tradeOffs.map((insight) => (
              <Card key={insight.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">
                      {insight.content.option_a} vs {insight.content.option_b}
                    </CardTitle>
                    {insight.timestamp && (
                      <Badge variant="outline">{insight.timestamp}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  {/* Option A */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-primary-600">
                      {insight.content.option_a}
                    </h4>
                    <div>
                      <p className="text-xs font-semibold text-success-700 uppercase mb-1">优点</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {insight.content.pros_a.map((pro: string, i: number) => (
                          <li key={i}>• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-error-700 uppercase mb-1">缺点</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {insight.content.cons_a.map((con: string, i: number) => (
                          <li key={i}>• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Option B */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-secondary-600">
                      {insight.content.option_b}
                    </h4>
                    <div>
                      <p className="text-xs font-semibold text-success-700 uppercase mb-1">优点</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {insight.content.pros_b.map((pro: string, i: number) => (
                          <li key={i}>• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-error-700 uppercase mb-1">缺点</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {insight.content.cons_b.map((con: string, i: number) => (
                          <li key={i}>• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 最终选择 */}
                  <div className="md:col-span-2 pt-4 border-t">
                    <Badge variant="default" className="mb-2">最终选择</Badge>
                    <p className="text-sm font-medium text-gray-900">
                      {insight.content.final_choice}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* 行动项 */}
          <TabsContent value="actions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>行动项清单</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {actionItems.map((insight) => (
                    <div
                      key={insight.id}
                      className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {insight.content.task}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                          {insight.content.assignee && (
                            <span>👤 {insight.content.assignee}</span>
                          )}
                          {insight.content.deadline && (
                            <span>📅 {insight.content.deadline}</span>
                          )}
                          {insight.content.priority && (
                            <Badge
                              variant={insight.content.priority === 'high' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {insight.content.priority}
                            </Badge>
                          )}
                          {insight.timestamp && (
                            <span className="text-xs text-gray-500">
                              ⏱️ {insight.timestamp}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 代码片段 */}
          <TabsContent value="code" className="mt-6 space-y-4">
            {codeSnippets.map((insight) => (
              <Card key={insight.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">
                      {insight.content.context || '代码片段'}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {insight.content.language || 'typescript'}
                      </Badge>
                      {insight.timestamp && (
                        <Badge variant="outline">{insight.timestamp}</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <SyntaxHighlighter
                    language={insight.content.language || 'typescript'}
                    style={githubGist}
                    customStyle={{
                      borderRadius: '0.5rem',
                      padding: '1rem',
                    }}
                  >
                    {insight.content.code}
                  </SyntaxHighlighter>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
```

**Context-Aware的优势**:
- ✅ 自动匹配现有组件库(Shadcn/ui)
- ✅ 代码风格与MeetingDetail.tsx完全一致
- ✅ TypeScript类型自动推断正确
- ✅ 响应式类名自动添加(hidden sm:inline, md:grid-cols-2)
- ✅ 完全符合feature-spec.md的需求描述

---

#### 功能3: Intelligent Refactoring(智能重构)

**使用场景**: 代码优化、性能提升、可维护性改进

**示例: 优化API调用性能**:

**Cursor Prompt**:

```
@src/pages/Dashboard.tsx

优化Dashboard的数据加载性能:

当前问题:
- 每次切换filter标签都会重新请求所有会议数据
- 没有loading状态,用户体验差
- 没有缓存机制,重复请求浪费资源

优化方案:
1. 使用React Query管理API请求
2. 启用缓存,避免重复请求
3. 添加loading和error状态
4. 实现乐观更新(收藏操作)
5. 使用SWR的stale-while-revalidate模式

技术细节:
- 安装@tanstack/react-query
- 创建queryClient配置
- 使用useQuery hook
- 设置缓存时间(staleTime: 30000)
- 添加Skeleton loading状态
```

**Cursor的重构过程**:

**步骤1: 安装依赖**

Cursor会提示运行:
```bash
pnpm add @tanstack/react-query
```

**步骤2: 配置QueryClient**

```typescript
// src/main.tsx (或app.tsx)

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// 创建QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30秒内数据视为fresh
      cacheTime: 5 * 60 * 1000, // 5分钟后清除缓存
      refetchOnWindowFocus: false, // 窗口聚焦时不自动refetch
      retry: 1, // 失败重试1次
    },
  },
})

// 包裹App
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {/* ... your app ... */}
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

**步骤3: 重构Dashboard使用useQuery**

```typescript
// src/pages/Dashboard.tsx (重构后)

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'

type FilterType = 'all' | 'starred' | 'recent'

export function DashboardPage() {
  const [filter, setFilter] = useState<FilterType>('all')
  const queryClient = useQueryClient()

  // 使用React Query管理会议数据
  const {
    data: meetings = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['meetings', filter], // 基于filter的缓存key
    queryFn: async () => {
      let query = supabase
        .from('meetings')
        .select('*')
        .order('created_at', { ascending: false })

      if (filter === 'starred') {
        query = query.eq('is_starred', true)
      } else if (filter === 'recent') {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        query = query.gte('created_at', sevenDaysAgo.toISOString())
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    },
    staleTime: 30000, // 30秒内切换标签不重新请求
  })

  // 收藏操作的mutation(乐观更新)
  const toggleStarMutation = useMutation({
    mutationFn: async ({ meetingId, currentStarred }: { meetingId: string; currentStarred: boolean }) => {
      const { error } = await supabase
        .from('meetings')
        .update({ is_starred: !currentStarred })
        .eq('id', meetingId)

      if (error) throw error
    },
    // 乐观更新
    onMutate: async ({ meetingId, currentStarred }) => {
      // 取消进行中的query
      await queryClient.cancelQueries({ queryKey: ['meetings'] })

      // 保存之前的数据用于回滚
      const previousMeetings = queryClient.getQueryData(['meetings', filter])

      // 乐观更新缓存
      queryClient.setQueryData(['meetings', filter], (old: Meeting[] = []) =>
        old.map(m =>
          m.id === meetingId ? { ...m, is_starred: !currentStarred } : m
        )
      )

      return { previousMeetings }
    },
    // 失败时回滚
    onError: (err, variables, context) => {
      if (context?.previousMeetings) {
        queryClient.setQueryData(['meetings', filter], context.previousMeetings)
      }
      toast({
        title: '操作失败',
        description: '请稍后重试',
        variant: 'destructive',
      })
    },
    // 成功或失败后都刷新数据
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] })
    },
  })

  // Loading状态
  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto py-8">
        <Skeleton className="h-10 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    )
  }

  // Error状态
  if (isError) {
    return (
      <div className="container max-w-7xl mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>加载失败</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : '未知错误'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">我的会议</h1>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
        <TabsList>
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="starred">收藏</TabsTrigger>
          <TabsTrigger value="recent">最近</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          {meetings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {filter === 'starred' ? '还没有收藏的会议' : '暂无会议'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meetings.map(meeting => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onToggleStar={(currentStarred) =>
                    toggleStarMutation.mutate({
                      meetingId: meeting.id,
                      currentStarred,
                    })
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

**重构效果对比**:

| 维度 | 重构前 | 重构后 | 改进 |
|------|-------|--------|-----|
| 切换filter请求次数 | 每次都请求 | 30秒内使用缓存 | 减少67%+ |
| Loading状态 | 无(体验差) | Skeleton优雅加载 | UX提升 |
| 收藏操作反馈 | 等待API(500ms+) | 乐观更新(<50ms) | 10x快 |
| 错误处理 | Toast提示 | Alert + 自动回滚 | 更健壮 |
| 代码可维护性 | useState散乱 | React Query统一 | 更清晰 |

---

### Cursor Prompt Engineering技巧

#### 技巧1: 明确输入和输出

```markdown
❌ 不好的Prompt:
"优化这个函数"

✅ 好的Prompt:
"优化src/utils/calculatePrice.ts中的calculateTotalPrice函数:

当前问题:
- O(n²)时间复杂度,处理1000+订单时超过5秒
- 没有处理边界情况(空数组、null价格)

优化目标:
- 降低到O(n)时间复杂度
- 添加输入验证和错误处理
- 添加JSDoc注释
- 保持现有API不变(向后兼容)

期望输出:
- 优化后的函数代码
- 性能对比注释
- 单元测试用例"
```

#### 技巧2: 使用@引用提供完整上下文

```markdown
✅ 充分利用@符号:

@src/components/MeetingCard.tsx
@src/types/database.ts
@docs/02-design/design-spec.md

在MeetingCard添加会议分享功能:
- 生成分享链接(公开访问)
- 显示分享按钮(Shadcn/ui Button + ShareIcon)
- 复制链接到剪贴板
- Toast提示"链接已复制"

参考:
- design-spec.md的Button组件规范
- database.ts的Meeting类型
- MeetingCard.tsx现有的样式和布局
```

#### 技巧3: 分步骤指导复杂任务

```markdown
✅ 拆分复杂任务:

步骤1: 数据库Schema设计
在supabase/migrations创建shared_meetings表:
- id (uuid)
- meeting_id (fk)
- share_token (unique)
- created_by (uuid)
- expires_at (timestamp, nullable)

步骤2: API层
在src/lib/supabase.ts添加:
- createShareLink(meetingId) → { token, url }
- getSharedMeeting(token) → Meeting or null
- revokeShareLink(token) → void

步骤3: UI组件
在MeetingCard.tsx添加分享按钮
在新页面src/pages/SharedMeeting.tsx展示公开会议

请按步骤实现,每步都给出完整代码。
```

#### 技巧4: 指定代码风格和约束

```markdown
✅ 明确约束:

代码风格要求:
- TypeScript strict mode
- 函数式组件(不用class)
- Hooks优于HOC
- 命名:驼峰(camelCase)用于变量,大写(PascalCase)用于组件
- 注释:JSDoc for public functions only

性能约束:
- 避免过早优化
- 使用React.memo仅在必要时(避免过度re-render)
- 大列表使用虚拟滚动(react-window)

可访问性:
- 所有图标按钮有aria-label
- 表单输入有关联label
- Focus状态可见(ring-2 ring-primary-500)

请严格遵守以上约束生成代码。
```

---

## 10.3 代码质量保证

### ESLint + Prettier配置

#### Step 1: 安装和配置ESLint(30分钟)

**安装依赖**:

```bash
pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
pnpm add -D eslint-plugin-react eslint-plugin-react-hooks
pnpm add -D eslint-plugin-jsx-a11y eslint-plugin-import
```

**ESLint配置文件**:

```javascript
// .eslintrc.cjs

module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime', // React 17+ 不需要import React
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended', // 可访问性规则
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    // TypeScript规则
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',

    // React规则
    'react/prop-types': 'off', // TypeScript已提供类型检查
    'react/react-in-jsx-scope': 'off', // React 17+不需要
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // 可访问性规则
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',

    // Import规则
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-unresolved': 'error',
    'import/no-cycle': 'warn',

    // 通用规则
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
  },
}
```

**运行ESLint**:

```bash
# 检查所有文件
pnpm eslint .

# 自动修复可修复的问题
pnpm eslint . --fix

# 检查特定文件
pnpm eslint src/components/UploadZone.tsx
```

**在package.json中添加scripts**:

```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "type-check": "tsc --noEmit"
  }
}
```

---

#### Step 2: 配置Prettier(15分钟)

**安装Prettier**:

```bash
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier
```

**Prettier配置文件**:

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always",
  "endOfLine": "lf",
  "jsxSingleQuote": false,
  "bracketSpacing": true,
  "jsxBracketSameLine": false
}
```

**Prettier忽略文件**:

```
# .prettierignore
node_modules
dist
build
.next
coverage
*.md
pnpm-lock.yaml
package-lock.json
```

**集成ESLint和Prettier**:

```javascript
// .eslintrc.cjs (更新extends部分)
module.exports = {
  // ... 其他配置
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended', // 必须放在最后
  ],
  // ... 其他配置
}
```

**运行Prettier**:

```bash
# 检查格式
pnpm prettier --check .

# 自动格式化
pnpm prettier --write .

# 格式化特定文件
pnpm prettier --write src/**/*.{ts,tsx}
```

**在package.json中添加scripts**:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

---

#### Step 3: Git Hooks with Husky(20分钟)

**安装Husky和lint-staged**:

```bash
pnpm add -D husky lint-staged
pnpm exec husky init
```

**配置lint-staged**:

```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,scss,md}": [
      "prettier --write"
    ]
  }
}
```

**配置pre-commit hook**:

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
pnpm type-check
```

**配置commit-msg hook**(可选 - 规范commit message):

```bash
# 安装commitlint
pnpm add -D @commitlint/cli @commitlint/config-conventional

# 创建commitlint配置
echo "module.exports = { extends: ['@commitlint/config-conventional'] }" > commitlint.config.js

# 配置commit-msg hook
echo "pnpm commitlint --edit \$1" > .husky/commit-msg
chmod +x .husky/commit-msg
```

**Commit Message规范**:

```
类型(scope): 简短描述

详细描述(可选)

Footer(可选)

类型:
- feat: 新功能
- fix: Bug修复
- docs: 文档更新
- style: 代码格式(不影响代码运行)
- refactor: 重构(既不是新功能也不是修复)
- perf: 性能优化
- test: 测试相关
- chore: 构建过程或辅助工具变动

示例:
feat(upload): add progress indicator for file upload
fix(auth): resolve token expiration issue
docs(readme): update installation instructions
```

---

### 测试策略

#### 单元测试 with Vitest

**安装Vitest**:

```bash
pnpm add -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**Vitest配置**:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
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

**测试设置文件**:

```typescript
// src/test/setup.ts
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

// 每个测试后清理
afterEach(() => {
  cleanup()
})
```

**示例单元测试**:

```typescript
// src/components/__tests__/MeetingCard.test.tsx

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MeetingCard } from '../MeetingCard'

describe('MeetingCard', () => {
  const mockMeeting = {
    id: '123',
    title: 'System Architecture Discussion',
    created_at: '2025-10-12T10:00:00Z',
    status: 'completed',
    is_starred: false,
  }

  it('renders meeting title and date', () => {
    render(<MeetingCard meeting={mockMeeting} />)

    expect(screen.getByText('System Architecture Discussion')).toBeInTheDocument()
    expect(screen.getByText(/2025-10-12/)).toBeInTheDocument()
  })

  it('toggles star status on click', async () => {
    const onUpdate = vi.fn()
    render(<MeetingCard meeting={mockMeeting} onUpdate={onUpdate} />)

    const starButton = screen.getByLabelText('收藏')
    fireEvent.click(starButton)

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled()
    })
  })

  it('shows correct status badge', () => {
    render(<MeetingCard meeting={mockMeeting} />)

    expect(screen.getByText('已完成')).toBeInTheDocument()
  })

  it('is accessible via keyboard', () => {
    render(<MeetingCard meeting={mockMeeting} />)

    const starButton = screen.getByLabelText('收藏')
    starButton.focus()

    expect(starButton).toHaveFocus()
  })
})
```

**运行测试**:

```bash
# 运行所有测试
pnpm vitest

# UI模式
pnpm vitest --ui

# 覆盖率报告
pnpm vitest --coverage

# Watch模式
pnpm vitest --watch
```

---

### Code Review实践

**Code Review Checklist**:

```markdown
## 功能性
- [ ] 代码实现了PRD/Issue中的所有需求
- [ ] 边界情况得到处理(空值、错误输入、网络失败)
- [ ] 没有明显的Bug或逻辑错误

## 代码质量
- [ ] 遵循项目代码风格(ESLint通过)
- [ ] 函数和变量命名清晰、语义化
- [ ] 没有重复代码(DRY原则)
- [ ] 复杂逻辑有注释说明

## 性能
- [ ] 没有不必要的re-render(React.memo、useMemo使用恰当)
- [ ] 大列表使用虚拟滚动或分页
- [ ] 图片和资源已优化
- [ ] API调用有适当缓存

## 安全性
- [ ] 用户输入得到验证和清理
- [ ] 敏感数据不暴露在客户端
- [ ] API调用有适当的权限检查
- [ ] 没有XSS、SQL注入等漏洞

## 可访问性
- [ ] 所有交互元素可键盘访问
- [ ] 图标按钮有aria-label
- [ ] 表单输入有label
- [ ] 颜色对比度符合WCAG AA

## 测试
- [ ] 单元测试覆盖核心逻辑
- [ ] E2E测试覆盖关键用户路径
- [ ] 所有测试通过
- [ ] 测试覆盖率 ≥ 70%

## 文档
- [ ] 复杂功能有README或注释说明
- [ ] API变更更新了文档
- [ ] Breaking changes有migration guide
```

**Pull Request模板**:

```markdown
## 变更描述
简要描述这个PR做了什么

## 变更类型
- [ ] 新功能
- [ ] Bug修复
- [ ] 性能优化
- [ ] 重构
- [ ] 文档更新
- [ ] 其他:

## 测试
- [ ] 单元测试通过
- [ ] E2E测试通过
- [ ] 手动测试场景:
  - 场景1: ...
  - 场景2: ...

## 截图/演示
(如果是UI变更,提供截图或GIF)

## Checklist
- [ ] 代码遵循项目规范(ESLint通过)
- [ ] 自我review代码
- [ ] 添加/更新了测试
- [ ] 更新了相关文档
- [ ] 没有新的warnings
- [ ] 可访问性检查通过

## 相关Issue
Closes #xxx
Related to #yyy
```

---

## 10.4 持续集成配置

### GitHub Actions工作流

**基础CI工作流**:

```yaml
# .github/workflows/ci.yml

name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run ESLint
        run: pnpm lint

      - name: Run TypeScript check
        run: pnpm type-check

      - name: Run Prettier check
        run: pnpm format:check

      - name: Run unit tests
        run: pnpm vitest --run

      - name: Generate coverage report
        run: pnpm vitest --coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella

  e2e-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 15

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: techmeet_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps

      - name: Setup Supabase CLI
        run: |
          npm install -g supabase
          supabase --version

      - name: Start Supabase local
        run: supabase start

      - name: Run database migrations
        run: supabase db reset

      - name: Build application
        run: pnpm build
        env:
          VITE_SUPABASE_URL: ${{ secrets.TEST_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.TEST_SUPABASE_ANON_KEY }}

      - name: Run E2E tests
        run: pnpm exec playwright test
        env:
          VITE_SUPABASE_URL: ${{ secrets.TEST_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.TEST_SUPABASE_ANON_KEY }}

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  build:
    runs-on: ubuntu-latest
    needs: [lint-and-test]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build production bundle
        run: pnpm build
        env:
          NODE_ENV: production

      - name: Check build size
        run: |
          echo "Build size:"
          du -sh dist/
          echo "Main bundle:"
          ls -lh dist/assets/*.js | head -5

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: dist/
```

---

### Vercel部署配置

**Vercel配置文件**:

```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "vite",
  "outputDirectory": "dist",
  "env": {
    "VITE_SUPABASE_URL": "@supabase-url",
    "VITE_SUPABASE_ANON_KEY": "@supabase-anon-key"
  },
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  },
  "headers": [
    {
      "source": "/assets/(.*)",
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

**环境变量配置**:

```bash
# .env.example (提交到Git)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# .env.local (不提交,本地开发)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# .env.production (Vercel环境变量)
# 在Vercel Dashboard中配置
```

**自动部署工作流**:

```yaml
# .github/workflows/deploy.yml

name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./
```

**Preview部署** (Pull Request):

```yaml
# .github/workflows/preview.yml

name: Deploy Preview

on:
  pull_request:
    branches: [main]

jobs:
  preview:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to Vercel (Preview)
        uses: amondnet/vercel-action@v25
        id: vercel-deploy
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./

      - name: Comment PR with preview URL
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.name,
              body: `✅ Preview deployed to: ${{ steps.vercel-deploy.outputs.preview-url }}`
            })
```

---

### 质量门禁

**Branch Protection Rules** (GitHub Settings):

```markdown
## main分支保护规则

✅ 必需规则:
- [ ] Require pull request before merging
  - [ ] Require approvals: 1
  - [ ] Dismiss stale reviews when new commits are pushed
- [ ] Require status checks to pass before merging
  - [ ] lint-and-test
  - [ ] e2e-tests
  - [ ] build
- [ ] Require branches to be up to date before merging
- [ ] Require conversation resolution before merging

🚫 限制:
- [ ] Do not allow bypassing the above settings
- [ ] Restrict who can push to matching branches
```

**自动化质量检查**:

```yaml
# .github/workflows/quality-gate.yml

name: Quality Gate

on:
  pull_request:
    branches: [main, develop]

jobs:
  quality-check:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # 获取完整历史用于diff

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Check test coverage
        run: |
          pnpm vitest --coverage
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          echo "Coverage: $COVERAGE%"
          if (( $(echo "$COVERAGE < 70" | bc -l) )); then
            echo "❌ Coverage below 70% threshold"
            exit 1
          fi
          echo "✅ Coverage meets threshold"

      - name: Check bundle size
        run: |
          pnpm build
          BUNDLE_SIZE=$(du -sk dist | cut -f1)
          MAX_SIZE=2048 # 2MB limit
          echo "Bundle size: ${BUNDLE_SIZE}KB"
          if [ $BUNDLE_SIZE -gt $MAX_SIZE ]; then
            echo "❌ Bundle size exceeds ${MAX_SIZE}KB limit"
            exit 1
          fi
          echo "✅ Bundle size within limit"

      - name: Check for TODO/FIXME in new code
        run: |
          git diff origin/main...HEAD | grep -E '^\+.*\/\/.*TODO|FIXME' && exit 1 || echo "✅ No TODO/FIXME in new code"

      - name: Check for console.log in new code
        run: |
          git diff origin/main...HEAD -- '*.ts' '*.tsx' | grep -E '^\+.*console\.log' && exit 1 || echo "✅ No console.log in new code"
```

---

## 10.5 本章小结

实施阶段的核心要点:

1. **10x开发工作流**:
   - Lovable.dev快速生成70% UI原型(Day 1-2)
   - Cursor增强30%复杂逻辑(Day 3-4)
   - Playwright E2E测试保证质量(Day 5)
   - 总时间2.5天 vs 传统开发8-13天(3-5x提速)

2. **AI Pair Programming核心能力**:
   - Multi-file Editing: 一次Prompt修改4+文件
   - Context-Aware: @符号引用实现上下文感知
   - Intelligent Refactoring: React Query性能优化示例
   - Prompt Engineering: 明确输入输出、分步骤、指定约束

3. **代码质量保证体系**:
   - ESLint + Prettier: 代码风格一致性
   - Husky + lint-staged: Git Hooks自动检查
   - Vitest单元测试 + Playwright E2E: 测试覆盖≥70%
   - Code Review Checklist: 功能、质量、性能、安全、可访问性

4. **持续集成配置**:
   - GitHub Actions: lint → test → build → deploy
   - Vercel自动部署: main分支生产环境 + PR预览环境
   - Branch Protection: 质量门禁强制执行
   - 自动化质量检查: 覆盖率、包大小、代码规范

**关键洞察**:
> "实施阶段不是纯手工编码,而是人类创意 + AI执行的协同过程。Lovable构建界面基础,Cursor实现复杂逻辑,自动化测试保证质量,CI/CD确保每次提交都可部署。从PRD到生产环境,10x开发者用2-3天完成传统开发者2周的工作量,质量不降反升。"

**实践建议**:
1. **Lovable First**: 先用Lovable验证UI/UX,再用Cursor实现逻辑
2. **Context-Aware Prompts**: 充分利用@符号提供上下文
3. **质量内建**: 从第一行代码开始就有ESLint、测试、CI
4. **小步快跑**: 频繁提交、持续集成、快速反馈

**下一章**: 我们将学习安全与合规(Security & Compliance),包括认证授权实现、数据保护策略、API安全最佳实践,以及GDPR/隐私合规指南。

---

**思考题**:
1. 你的项目使用了AI辅助开发吗?效率提升了多少?
2. 如何平衡AI生成代码的速度和人工审查的质量?
3. 你的CI/CD流程中有哪些质量门禁?是否足够严格?

👉 [下一章:安全与合规](chapter11-security.md)