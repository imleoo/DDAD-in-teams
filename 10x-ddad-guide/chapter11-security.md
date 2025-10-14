# 第十一章:安全与合规

> **本章导读**
>
> 深入学习认证授权的实现方法,掌握数据保护的核心策略,理解API安全的最佳实践,以及如何满足GDPR和隐私合规要求。

---

## 11.1 认证授权实现

### Supabase Auth完整集成

**Supabase Auth的优势**:
- ✅ 开箱即用的多种认证方式
- ✅ JWT token自动管理
- ✅ 行级安全(RLS)原生集成
- ✅ 无需自建认证系统,避免安全漏洞

---

#### 认证方式选择

**TechMeet支持的认证方式**:

```markdown
## 认证方式对比

| 认证方式 | 用户体验 | 安全性 | 实现难度 | 推荐场景 |
|---------|---------|--------|---------|---------|
| 邮箱+密码 | ⭐⭐⭐ | ⭐⭐⭐⭐ | 简单 | 通用场景,MVP首选 |
| Magic Link | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 简单 | 无密码体验,安全性高 |
| OAuth (Google) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 中等 | B2C产品,降低注册摩擦 |
| OAuth (GitHub) | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 中等 | 开发者工具,技术产品 |
| 手机号+验证码 | ⭐⭐⭐ | ⭐⭐⭐ | 复杂 | 中国市场,需要短信服务 |

**TechMeet MVP选择**: 邮箱+密码 + Google OAuth
```

---

#### Step 1: 邮箱密码认证实现(30分钟)

**Supabase Auth配置**:

```typescript
// lib/auth.ts
import { supabase } from '@/lib/supabase'

export type AuthError = {
  message: string
  code?: string
}

/**
 * 用户注册
 */
export async function signUp(
  email: string,
  password: string
): Promise<{ success: boolean; error?: AuthError }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          // 可选: 添加用户元数据
          full_name: '',
          avatar_url: '',
        },
      },
    })

    if (error) {
      return {
        success: false,
        error: {
          message: getErrorMessage(error.message),
          code: error.status?.toString(),
        },
      }
    }

    // Supabase默认需要邮箱验证
    // 可以在Dashboard关闭: Authentication → Providers → Email → Confirm email
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: { message: '注册失败,请稍后重试' },
    }
  }
}

/**
 * 用户登录
 */
export async function signIn(
  email: string,
  password: string
): Promise<{ success: boolean; error?: AuthError }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        success: false,
        error: {
          message: getErrorMessage(error.message),
          code: error.status?.toString(),
        },
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: { message: '登录失败,请稍后重试' },
    }
  }
}

/**
 * 用户登出
 */
export async function signOut(): Promise<{ success: boolean; error?: AuthError }> {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        success: false,
        error: { message: getErrorMessage(error.message) },
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: { message: '登出失败,请稍后重试' },
    }
  }
}

/**
 * 获取当前用户
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      return { user: null, error }
    }

    return { user, error: null }
  } catch (error) {
    return { user: null, error }
  }
}

/**
 * 友好的错误消息
 */
function getErrorMessage(error: string): string {
  const errorMap: Record<string, string> = {
    'Invalid login credentials': '邮箱或密码错误',
    'Email not confirmed': '请先验证邮箱',
    'User already registered': '该邮箱已被注册',
    'Password should be at least 6 characters': '密码至少6位',
    'Unable to validate email address': '邮箱格式不正确',
    'Signups not allowed': '注册功能已关闭',
  }

  return errorMap[error] || error
}
```

**注册页面实现**:

```tsx
// app/auth/signup/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircleIcon, LoaderIcon } from 'lucide-react'
import { signUp } from '@/lib/auth'

const signupSchema = z.object({
  email: z.string()
    .min(1, '请输入邮箱地址')
    .email('邮箱格式不正确'),
  password: z.string()
    .min(8, '密码至少8位')
    .regex(/[A-Z]/, '密码必须包含至少一个大写字母')
    .regex(/[a-z]/, '密码必须包含至少一个小写字母')
    .regex(/[0-9]/, '密码必须包含至少一个数字'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
})

type SignupFormData = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    setError(null)
    setIsLoading(true)

    const result = await signUp(data.email, data.password)

    if (!result.success) {
      setError(result.error?.message || '注册失败')
      setIsLoading(false)
      return
    }

    // 注册成功
    router.push('/auth/verify-email?email=' + encodeURIComponent(data.email))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            创建TechMeet账号
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            已有账号?{' '}
            <a href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
              立即登录
            </a>
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                邮箱地址
              </label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                placeholder="user@example.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-error-500" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                密码
              </label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby="password-requirements password-error"
                disabled={isLoading}
              />
              <p id="password-requirements" className="mt-1 text-xs text-gray-600">
                密码要求:至少8位,包含大小写字母和数字
              </p>
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-error-500" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                确认密码
              </label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p id="confirmPassword-error" className="mt-1 text-sm text-error-500" role="alert">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                注册中...
              </>
            ) : (
              '创建账号'
            )}
          </Button>

          {/* Terms */}
          <p className="text-xs text-center text-gray-600">
            注册即表示您同意我们的
            <a href="/terms" className="text-primary-600 hover:text-primary-500"> 服务条款 </a>
            和
            <a href="/privacy" className="text-primary-600 hover:text-primary-500"> 隐私政策</a>
          </p>
        </form>
      </div>
    </div>
  )
}
```

**登录页面实现**:

```tsx
// app/auth/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircleIcon, LoaderIcon } from 'lucide-react'
import { signIn } from '@/lib/auth'

const loginSchema = z.object({
  email: z.string().min(1, '请输入邮箱地址').email('邮箱格式不正确'),
  password: z.string().min(1, '请输入密码'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'

  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setError(null)
    setIsLoading(true)

    const result = await signIn(data.email, data.password)

    if (!result.success) {
      setError(result.error?.message || '登录失败')
      setIsLoading(false)
      return
    }

    // 登录成功,跳转
    router.push(redirectTo)
    router.refresh() // 刷新服务端组件
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            登录TechMeet
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            还没有账号?{' '}
            <a href="/auth/signup" className="font-medium text-primary-600 hover:text-primary-500">
              立即注册
            </a>
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                邮箱地址
              </label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                placeholder="user@example.com"
                disabled={isLoading}
                autoComplete="email"
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-error-500" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  密码
                </label>
                <a
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  忘记密码?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                {...register('password')}
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : undefined}
                disabled={isLoading}
                autoComplete="current-password"
              />
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-error-500" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                登录中...
              </>
            ) : (
              '登录'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
```

---

#### Step 2: OAuth认证(Google)实现(45分钟)

**Supabase Dashboard配置**:

```markdown
# Google OAuth配置步骤

## 1. 创建Google OAuth应用(15分钟)

### 访问Google Cloud Console
https://console.cloud.google.com/apis/credentials

### 创建OAuth 2.0客户端ID
1. 点击"创建凭据" → "OAuth客户端ID"
2. 应用类型: Web应用
3. 名称: TechMeet
4. 已授权的重定向URI:
   - https://[your-project-ref].supabase.co/auth/v1/callback
   - http://localhost:3000/auth/callback (开发环境)

### 获取凭据
- Client ID: 123456789-abcdefg.apps.googleusercontent.com
- Client Secret: GOCSPX-xxxxxxxxxxxxx

## 2. 配置Supabase(10分钟)

### 访问Supabase Dashboard
https://supabase.com/dashboard/project/[your-project-ref]/auth/providers

### 启用Google Provider
1. Authentication → Providers → Google
2. Enable Google provider: ON
3. Client ID: [粘贴Google Client ID]
4. Client Secret: [粘贴Google Client Secret]
5. Redirect URL: 自动生成,复制到Google Console
6. Save

## 3. 测试OAuth流程(5分钟)
- 点击"Test connection"验证配置
- 测试登录流程是否正常
```

**前端集成Google OAuth**:

```tsx
// components/GoogleSignInButton.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LoaderIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        console.error('Google sign-in error:', error)
        setIsLoading(false)
      }
      // 如果成功,用户会被重定向到Google,无需设置isLoading = false
    } catch (error) {
      console.error('Unexpected error:', error)
      setIsLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
          正在跳转...
        </>
      ) : (
        <>
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          使用Google登录
        </>
      )}
    </Button>
  )
}
```

**OAuth回调处理**:

```tsx
// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/dashboard'

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })

    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=oauth_callback_failed`
      )
    }
  }

  // 成功后重定向
  return NextResponse.redirect(`${requestUrl.origin}${redirectTo}`)
}
```

**在登录/注册页面添加Google按钮**:

```tsx
// app/auth/login/page.tsx (添加到表单后)

{/* 或者使用Google登录 */}
<div className="relative my-6">
  <div className="absolute inset-0 flex items-center">
    <span className="w-full border-t border-gray-300" />
  </div>
  <div className="relative flex justify-center text-sm">
    <span className="bg-gray-50 px-2 text-gray-600">或</span>
  </div>
</div>

<GoogleSignInButton />
```

---

#### Step 3: 中间件保护路由(30分钟)

**Next.js中间件实现**:

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 定义受保护的路由
  const protectedPaths = ['/dashboard', '/meetings', '/upload', '/settings']
  const authPaths = ['/auth/login', '/auth/signup']

  const isProtectedPath = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  )
  const isAuthPath = authPaths.some((path) => req.nextUrl.pathname.startsWith(path))

  // 未登录访问受保护路由 → 重定向到登录
  if (isProtectedPath && !session) {
    const redirectUrl = new URL('/auth/login', req.url)
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // 已登录访问认证页面 → 重定向到Dashboard
  if (isAuthPath && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

**服务端组件中获取用户**:

```tsx
// app/dashboard/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  const user = session.user

  return (
    <div>
      <h1>欢迎, {user.email}</h1>
      {/* Dashboard内容 */}
    </div>
  )
}
```

---

### Session管理和Token刷新

**Session生命周期**:

```
用户登录
  ↓
生成Access Token (1小时有效)
  ↓
生成Refresh Token (30天有效)
  ↓
Access Token过期 → 自动刷新(Supabase处理)
  ↓
Refresh Token过期 → 需要重新登录
```

**自动Token刷新配置**:

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true, // 自动刷新token(默认true)
    persistSession: true, // 持久化session到localStorage(默认true)
    detectSessionInUrl: true, // 从URL检测session(OAuth回调需要)
    flowType: 'pkce', // 使用PKCE flow提升安全性(推荐)
  },
})
```

**监听认证状态变化**:

```tsx
// components/AuthProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // 获取当前session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)

      // 刷新服务端组件
      router.refresh()
    })

    return () => subscription.unsubscribe()
  }, [router])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

**在根布局中使用**:

```tsx
// app/layout.tsx
import { AuthProvider } from '@/components/AuthProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

---

### 密码重置流程

**重置密码请求**:

```typescript
// lib/auth.ts (添加)

/**
 * 请求重置密码
 */
export async function requestPasswordReset(
  email: string
): Promise<{ success: boolean; error?: AuthError }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      return {
        success: false,
        error: { message: getErrorMessage(error.message) },
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: { message: '请求失败,请稍后重试' },
    }
  }
}

/**
 * 更新密码
 */
export async function updatePassword(
  newPassword: string
): Promise<{ success: boolean; error?: AuthError }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      return {
        success: false,
        error: { message: getErrorMessage(error.message) },
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: { message: '密码更新失败' },
    }
  }
}
```

**忘记密码页面**:

```tsx
// app/auth/forgot-password/page.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'z od'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircleIcon, LoaderIcon } from 'lucide-react'
import { requestPasswordReset } from '@/lib/auth'

const forgotPasswordSchema = z.object({
  email: z.string().min(1, '请输入邮箱地址').email('邮箱格式不正确'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null)
    setIsLoading(true)

    const result = await requestPasswordReset(data.email)

    if (!result.success) {
      setError(result.error?.message || '请求失败')
      setIsLoading(false)
      return
    }

    setSuccess(true)
    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full">
          <Alert>
            <CheckCircleIcon className="h-4 w-4" />
            <AlertDescription>
              密码重置邮件已发送,请检查您的邮箱。
            </AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <a href="/auth/login" className="text-primary-600 hover:text-primary-500">
              返回登录
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            重置密码
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            输入您的邮箱地址,我们将发送重置链接
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              邮箱地址
            </label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              aria-invalid={errors.email ? 'true' : 'false'}
              placeholder="user@example.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error-500" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                发送中...
              </>
            ) : (
              '发送重置邮件'
            )}
          </Button>

          <div className="text-center">
            <a href="/auth/login" className="text-sm text-primary-600 hover:text-primary-500">
              返回登录
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
```

---

## 11.2 数据保护策略

### Row Level Security (RLS) 完整实现

**RLS的核心优势**:
- 🛡️ 数据库级别强制执行,无法绕过
- 🔒 每个用户只能访问自己的数据
- 🚀 无需在API层实现权限检查
- 🧪 RLS策略可以独立测试

---

#### TechMeet完整RLS策略

```sql
-- supabase/migrations/20241013_complete_rls.sql

-- ============================================
-- 启用RLS (Row Level Security)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Profiles表RLS策略
-- ============================================

-- 用户可以查看自己的profile
CREATE POLICY "Users can view own profile"
ON profiles
FOR SELECT
USING (auth.uid() = id);

-- 用户可以更新自己的profile
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
USING (auth.uid() = id);

-- 注册时自动创建profile (通过trigger,不需要INSERT策略)
-- 用户不能删除自己的profile (无DELETE策略)

-- ============================================
-- Meetings表RLS策略
-- ============================================

-- 用户可以查看自己的会议
CREATE POLICY "Users can view own meetings"
ON meetings
FOR SELECT
USING (auth.uid() = user_id);

-- 用户可以创建会议
CREATE POLICY "Users can create own meetings"
ON meetings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 用户可以更新自己的会议
CREATE POLICY "Users can update own meetings"
ON meetings
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id); -- 确保不能将user_id改为其他用户

-- 用户可以删除自己的会议
CREATE POLICY "Users can delete own meetings"
ON meetings
FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- Insights表RLS策略
-- ============================================

-- 用户可以查看自己会议的insights
CREATE POLICY "Users can view insights of own meetings"
ON insights
FOR SELECT
USING (
  meeting_id IN (
    SELECT id FROM meetings WHERE user_id = auth.uid()
  )
);

-- 用户可以为自己的会议创建insights (通常由Edge Function创建)
CREATE POLICY "Users can create insights for own meetings"
ON insights
FOR INSERT
WITH CHECK (
  meeting_id IN (
    SELECT id FROM meetings WHERE user_id = auth.uid()
  )
);

-- 用户可以更新自己会议的insights
CREATE POLICY "Users can update insights of own meetings"
ON insights
FOR UPDATE
USING (
  meeting_id IN (
    SELECT id FROM meetings WHERE user_id = auth.uid()
  )
);

-- 用户可以删除自己会议的insights
CREATE POLICY "Users can delete insights of own meetings"
ON insights
FOR DELETE
USING (
  meeting_id IN (
    SELECT id FROM meetings WHERE user_id = auth.uid()
  )
);

-- ============================================
-- User Settings表RLS策略
-- ============================================

-- 用户可以查看自己的设置
CREATE POLICY "Users can view own settings"
ON user_settings
FOR SELECT
USING (auth.uid() = user_id);

-- 用户可以插入自己的设置(首次创建)
CREATE POLICY "Users can insert own settings"
ON user_settings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 用户可以更新自己的设置
CREATE POLICY "Users can update own settings"
ON user_settings
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Service Role绕过RLS (Edge Functions使用)
-- ============================================

-- Edge Functions使用service_role_key时绕过RLS
-- 示例: 转录完成后更新meetings表
-- 确保Edge Function中使用createClient(url, service_role_key)
```

**RLS策略测试**:

```sql
-- supabase/tests/rls_test.sql

-- 测试准备: 创建两个测试用户
INSERT INTO auth.users (id, email) VALUES
  ('user-1-uuid', 'user1@test.com'),
  ('user-2-uuid', 'user2@test.com');

INSERT INTO meetings (id, user_id, title) VALUES
  ('meeting-1-uuid', 'user-1-uuid', 'User 1 Meeting'),
  ('meeting-2-uuid', 'user-2-uuid', 'User 2 Meeting');

-- ============================================
-- 测试1: 用户只能查看自己的会议
-- ============================================

-- 设置当前用户为user-1
SET LOCAL jwt.claims.sub = 'user-1-uuid';

-- 应该只返回User 1的会议
SELECT * FROM meetings;
-- 期望结果: 1行 (meeting-1-uuid)

-- 尝试访问user-2的会议(应该失败)
SELECT * FROM meetings WHERE id = 'meeting-2-uuid';
-- 期望结果: 0行

-- ============================================
-- 测试2: 用户不能修改其他用户的会议
-- ============================================

SET LOCAL jwt.claims.sub = 'user-1-uuid';

-- 尝试修改user-2的会议(应该失败)
UPDATE meetings
SET title = 'Hacked Title'
WHERE id = 'meeting-2-uuid';
-- 期望结果: 0 rows affected

-- ============================================
-- 测试3: 用户不能删除其他用户的会议
-- ============================================

SET LOCAL jwt.claims.sub = 'user-1-uuid';

-- 尝试删除user-2的会议(应该失败)
DELETE FROM meetings WHERE id = 'meeting-2-uuid';
-- 期望结果: 0 rows affected

-- ============================================
-- 测试4: 用户不能创建其他用户的会议
-- ============================================

SET LOCAL jwt.claims.sub = 'user-1-uuid';

-- 尝试为user-2创建会议(应该失败)
INSERT INTO meetings (user_id, title)
VALUES ('user-2-uuid', 'Fake Meeting');
-- 期望结果: ERROR - new row violates row-level security policy

-- ============================================
-- 清理测试数据
-- ============================================

DELETE FROM meetings WHERE id IN ('meeting-1-uuid', 'meeting-2-uuid');
DELETE FROM auth.users WHERE id IN ('user-1-uuid', 'user-2-uuid');
```

---

### 数据加密策略

#### 传输加密 (Encryption in Transit)

**HTTPS强制**:

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 生产环境强制HTTPS
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

**Supabase连接**:
- Supabase自动使用TLS 1.2+加密所有连接
- 无需额外配置,默认安全

---

#### 静态加密 (Encryption at Rest)

**Supabase数据库加密**:
- PostgreSQL数据库使用AES-256加密
- 自动备份也使用相同加密
- Storage的文件使用AES-256加密

**敏感字段加密** (如果需要额外加密):

```sql
-- supabase/migrations/20241013_pgcrypto.sql

-- 启用pgcrypto扩展
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 创建加密函数
CREATE OR REPLACE FUNCTION encrypt_text(plaintext TEXT, key TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(
    pgp_sym_encrypt(plaintext, key),
    'base64'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建解密函数
CREATE OR REPLACE FUNCTION decrypt_text(ciphertext TEXT, key TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN pgp_sym_decrypt(
    decode(ciphertext, 'base64'),
    key
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 示例: 加密用户的敏感备注
ALTER TABLE meetings ADD COLUMN private_notes_encrypted TEXT;

-- 使用示例(在应用层)
-- 加密: SELECT encrypt_text('敏感信息', 'encryption-key');
-- 解密: SELECT decrypt_text(private_notes_encrypted, 'encryption-key') FROM meetings;
```

**应用层加密密钥管理**:

```typescript
// lib/encryption.ts
import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY! // 32字节hex字符串
const ALGORITHM = 'aes-256-gcm'

export function encrypt(text: string): { encrypted: string; iv: string; authTag: string } {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    iv
  )

  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  const authTag = cipher.getAuthTag()

  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  }
}

export function decrypt(encrypted: string, iv: string, authTag: string): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    Buffer.from(iv, 'hex')
  )

  decipher.setAuthTag(Buffer.from(authTag, 'hex'))

  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}
```

---

### API密钥和环境变量管理

#### 环境变量最佳实践

**环境变量组织**:

```bash
# .env.local (本地开发,不提交)
# ====================
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# OpenAI
OPENAI_API_KEY=sk-...

# 加密
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef

# Notion (可选)
NOTION_API_KEY=secret_...
NOTION_DATABASE_ID=...
```

```bash
# .env.example (提交到Git,作为模板)
# ====================
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# 加密
ENCRYPTION_KEY=your_32_byte_hex_encryption_key

# Notion (可选)
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_database_id
```

**.gitignore配置**:

```gitignore
# 环境变量
.env.local
.env.*.local
.env.production.local

# 敏感文件
*.key
*.pem
secrets/
```

---

#### Vercel环境变量配置

**Vercel Dashboard配置步骤**:

```markdown
# Vercel环境变量配置

## 1. 访问项目设置
https://vercel.com/your-username/techmeet/settings/environment-variables

## 2. 添加环境变量

### Production环境
| Name | Value | Environment |
|------|-------|-------------|
| NEXT_PUBLIC_SUPABASE_URL | https://xxx.supabase.co | Production |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | eyJhbGc... | Production |
| SUPABASE_SERVICE_ROLE_KEY | eyJhbGc... | Production |
| OPENAI_API_KEY | sk-... | Production |
| ENCRYPTION_KEY | 0123... | Production |

### Preview环境(可选,使用测试数据库)
| Name | Value | Environment |
|------|-------|-------------|
| NEXT_PUBLIC_SUPABASE_URL | https://test-xxx.supabase.co | Preview |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | eyJhbGc... | Preview |
| ... | ... | Preview |

## 3. 敏感变量保护
- ✅ 勾选"Sensitive"隐藏值
- ✅ 不要在客户端暴露SERVICE_ROLE_KEY
- ✅ 定期轮换API密钥

## 4. 重新部署
更新环境变量后,需要重新部署才能生效
```

---

#### 代码中访问环境变量

**服务端(安全)**:

```typescript
// app/api/transcribe/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // ✅ 正确: 服务端可以访问所有环境变量
  const openaiKey = process.env.OPENAI_API_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // 使用密钥调用API...

  return NextResponse.json({ success: true })
}
```

**客户端(受限)**:

```typescript
// components/MeetingList.tsx
'use client'

import { supabase } from '@/lib/supabase'

export function MeetingList() {
  // ✅ 正确: 只能访问NEXT_PUBLIC_前缀的变量
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // ❌ 错误: 客户端无法访问(返回undefined)
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY // undefined!

  // ...
}
```

**安全规则**:
```markdown
✅ 客户端可以访问:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- 其他NEXT_PUBLIC_*前缀的变量

❌ 客户端不能访问:
- SUPABASE_SERVICE_ROLE_KEY
- OPENAI_API_KEY
- ENCRYPTION_KEY
- 其他没有NEXT_PUBLIC_前缀的变量
```

---

### 敏感数据处理规范

#### PII (Personally Identifiable Information) 处理

**TechMeet的PII数据**:
```markdown
## 个人识别信息(PII)清单

### 直接PII (必须保护)
- 邮箱地址 (email)
- 全名 (full_name)
- 头像URL (avatar_url)

### 间接PII (可能识别用户)
- 会议标题 (可能包含公司/项目名称)
- 转录文本 (可能包含姓名、电话等)
- IP地址 (Vercel自动记录)

### 非PII
- 用户ID (UUID,不可逆)
- 创建时间
- 统计数据(会议数量等)
```

**PII最小化原则**:

```typescript
// ✅ 正确: 只返回必要字段
export async function GET Public Profile(userId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url') // 不返回email
    .eq('id', userId)
    .single()

  return data
}

// ❌ 错误: 返回所有字段(包括email)
export async function getPublicProfile(userId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('*') // 包含email!
    .eq('id', userId)
    .single()

  return data
}
```

---

#### 日志中的敏感数据过滤

**日志安全实践**:

```typescript
// lib/logger.ts
type LogLevel = 'info' | 'warn' | 'error' | 'debug'

const SENSITIVE_FIELDS = ['password', 'token', 'apiKey', 'secret', 'email', 'phone']

/**
 * 过滤敏感字段
 */
function sanitize(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitize)
  }

  const sanitized: any = {}
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase()

    // 检查是否是敏感字段
    const isSensitive = SENSITIVE_FIELDS.some((field) =>
      lowerKey.includes(field.toLowerCase())
    )

    if (isSensitive) {
      sanitized[key] = '[REDACTED]'
    } else if (typeof value === 'object') {
      sanitized[key] = sanitize(value)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}

/**
 * 安全日志函数
 */
export function log(level: LogLevel, message: string, data?: any) {
  const sanitizedData = data ? sanitize(data) : undefined

  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    data: sanitizedData,
  }

  // 生产环境发送到日志服务(如Sentry, Datadog)
  // 开发环境输出到console
  if (process.env.NODE_ENV === 'production') {
    // 发送到日志服务
    // sendToLogService(logEntry)
  } else {
    console.log(JSON.stringify(logEntry, null, 2))
  }
}

// 使用示例
log('info', 'User logged in', {
  userId: '123',
  email: 'user@example.com', // 会被过滤为[REDACTED]
  timestamp: Date.now(),
})
```

---

## 11.3 API安全最佳实践

### Rate Limiting (速率限制)

**为什么需要Rate Limiting?**
- 🛡️ 防止DDoS攻击
- 💰 控制API成本(OpenAI, Whisper等按量计费)
- ⚖️ 公平资源分配
- 🚫 防止滥用和爬虫

---

#### Vercel Edge Functions的Rate Limiting

**使用Upstash Redis实现**:

```bash
npm install @upstash/redis @upstash/ratelimit
```

**Upstash Redis配置**:
```markdown
# 1. 创建Upstash账号
https://upstash.com/

# 2. 创建Redis数据库
- Name: techmeet-ratelimit
- Region: 选择最近的区域

# 3. 获取凭据
- UPSTASH_REDIS_REST_URL
- UPSTASH_REDIS_REST_TOKEN

# 4. 添加到Vercel环境变量
```

**Rate Limiting中间件**:

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// 创建Redis客户端
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// 创建rate limiter
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10请求/10秒
  analytics: true, // 开启分析
  prefix: 'techmeet',
})

// 针对不同端点的限制器
export const uploadRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '60 s'), // 上传: 3次/分钟
  prefix: 'techmeet:upload',
})

export const transcribeRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '3600 s'), // 转录: 5次/小时
  prefix: 'techmeet:transcribe',
})
```

**在API路由中使用**:

```typescript
// app/api/meetings/route.ts
import { NextResponse } from 'next/server'
import { ratelimit } from '@/lib/rate-limit'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: Request) {
  // 1. 获取用户
  const { user } = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  // 2. Rate limiting检查
  const identifier = user.id // 基于用户ID限制
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier)

  // 3. 添加rate limit headers
  const headers = {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': reset.toString(),
  }

  if (!success) {
    return NextResponse.json(
      {
        error: '请求过于频繁,请稍后重试',
        retryAfter: Math.ceil((reset - Date.now()) / 1000),
      },
      { status: 429, headers }
    )
  }

  // 4. 处理正常请求
  // ...

  return NextResponse.json({ success: true }, { headers })
}
```

**上传API的严格限制**:

```typescript
// app/api/upload/route.ts
import { uploadRatelimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const { user } = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  // 更严格的限制: 3次/分钟
  const { success } = await uploadRatelimit.limit(user.id)

  if (!success) {
    return NextResponse.json(
      { error: '上传过于频繁,请等待1分钟后重试' },
      { status: 429 }
    )
  }

  // 处理文件上传...
}
```

---

### 输入验证和清理

#### Zod Schema验证

**API输入验证**:

```typescript
// lib/validations/meeting.ts
import * as z from 'zod'

export const createMeetingSchema = z.object({
  title: z.string()
    .min(1, '标题不能为空')
    .max(200, '标题最长200字符')
    .trim(),
  audioUrl: z.string()
    .url('音频URL格式不正确')
    .refine((url) => {
      // 只允许Supabase Storage的URL
      return url.startsWith(process.env.NEXT_PUBLIC_SUPABASE_URL!)
    }, '音频URL必须来自Supabase Storage'),
  duration: z.number()
    .positive('时长必须为正数')
    .max(7200, '音频最长120分钟')
    .optional(),
})

export const updateMeetingSchema = z.object({
  title: z.string()
    .min(1, '标题不能为空')
    .max(200, '标题最长200字符')
    .trim()
    .optional(),
  transcript: z.string()
    .max(100000, '转录文本过长')
    .optional(),
  is_starred: z.boolean().optional(),
})

export type CreateMeetingInput = z.infer<typeof createMeetingSchema>
export type UpdateMeetingInput = z.infer<typeof updateMeetingSchema>
```

**在API中使用**:

```typescript
// app/api/meetings/route.ts
import { createMeetingSchema } from '@/lib/validations/meeting'
import { ZodError } from 'zod'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 验证输入
    const validatedData = createMeetingSchema.parse(body)

    // 使用验证后的数据
    const { data, error } = await supabase
      .from('meetings')
      .insert({
        user_id: user.id,
        title: validatedData.title,
        audio_url: validatedData.audioUrl,
        duration: validatedData.duration,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: '输入数据格式错误',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
```

---

#### SQL注入防护

**Supabase自动防护**:
```typescript
// ✅ 正确: Supabase自动参数化查询,防止SQL注入
const { data } = await supabase
  .from('meetings')
  .select('*')
  .eq('title', userInput) // 安全,自动转义

// ✅ 正确: 使用.filter()也是安全的
const { data } = await supabase
  .from('meetings')
  .select('*')
  .filter('title', 'ilike', `%${userInput}%`) // 安全

// ❌ 危险: 直接拼接SQL(Supabase不允许)
// 以下代码无法执行,Supabase API不支持原始SQL
// const query = `SELECT * FROM meetings WHERE title = '${userInput}'`
```

**如果必须使用原始SQL** (Supabase Edge Functions):

```typescript
// supabase/functions/advanced-query/index.ts
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: Request) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const userInput = await req.json().term

  // ✅ 正确: 使用参数化查询
  const { data, error } = await supabase.rpc('search_meetings', {
    search_term: userInput, // 参数化,安全
  })

  // ❌ 危险: 直接拼接SQL
  // const query = `SELECT * FROM meetings WHERE title LIKE '%${userInput}%'`
  // 会导致SQL注入漏洞!

  return new Response(JSON.stringify(data))
}
```

**创建安全的RPC函数**:

```sql
-- supabase/migrations/20241013_search_function.sql

CREATE OR REPLACE FUNCTION search_meetings(search_term TEXT)
RETURNS SETOF meetings
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM meetings
  WHERE
    user_id = auth.uid() AND
    (
      title ILIKE '%' || search_term || '%' OR
      transcript ILIKE '%' || search_term || '%'
    )
  ORDER BY created_at DESC;
END;
$$;
```

---

### CORS配置

**Next.js API Routes CORS配置**:

```typescript
// lib/cors.ts
import { NextResponse } from 'next/server'

const ALLOWED_ORIGINS = [
  'https://techmeet.com',
  'https://www.techmeet.com',
  process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : null,
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null,
].filter(Boolean) as string[]

export function cors(request: Request) {
  const origin = request.headers.get('origin')

  // 检查origin是否允许
  const isAllowed = origin && ALLOWED_ORIGINS.includes(origin)

  const headers = {
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24小时
  }

  return headers
}

export function handleOptions(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: cors(request),
  })
}
```

**在API路由中使用**:

```typescript
// app/api/meetings/route.ts
import { cors, handleOptions } from '@/lib/cors'

export async function OPTIONS(request: Request) {
  return handleOptions(request)
}

export async function GET(request: Request) {
  // 处理GET请求...
  const data = { /* ... */ }

  return NextResponse.json(data, {
    headers: cors(request),
  })
}

export async function POST(request: Request) {
  // 处理POST请求...
  const result = { /* ... */ }

  return NextResponse.json(result, {
    headers: cors(request),
  })
}
```

---

### XSS (跨站脚本攻击) 防护

**React自动防护**:
```tsx
// ✅ React自动转义HTML,防止XSS
function MeetingTitle({ title }: { title: string }) {
  return <h1>{title}</h1>
  // 即使title = "<script>alert('XSS')</script>"
  // React会转义为: &lt;script&gt;alert('XSS')&lt;/script&gt;
}

// ❌ 危险: dangerouslySetInnerHTML绕过保护
function MeetingTitle({ title }: { title: string }) {
  return <h1 dangerouslySetInnerHTML={{ __html: title }} />
  // 如果title包含脚本,会被执行!
}
```

**DOMPurify清理HTML**(如果必须渲染HTML):

```bash
npm install dompurify
npm install -D @types/dompurify
```

```tsx
// components/SafeHTML.tsx
'use client'

import DOMPurify from 'dompurify'

interface SafeHTMLProps {
  html: string
  className?: string
}

export function SafeHTML({ html, className }: SafeHTMLProps) {
  // 清理HTML,移除危险标签和属性
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'title'],
    ALLOW_DATA_ATTR: false,
  })

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}
```

**Content Security Policy (CSP)**:

```typescript
// next.config.js
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-scripts.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

---

## 11.4 GDPR/隐私合规指南

### GDPR核心要求

**GDPR (General Data Protection Regulation) 关键原则**:

```markdown
# GDPR 7项核心原则

## 1. 合法、公平、透明 (Lawfulness, Fairness, Transparency)
✅ 需要: 清晰的隐私政策,用户知情同意

## 2. 目的限制 (Purpose Limitation)
✅ 需要: 明确数据收集目的,不得用于其他用途

## 3. 数据最小化 (Data Minimisation)
✅ 需要: 只收集必要的数据

## 4. 准确性 (Accuracy)
✅ 需要: 保持数据准确,提供更新机制

## 5. 存储限制 (Storage Limitation)
✅ 需要: 定义数据保留期限,到期删除

## 6. 完整性和机密性 (Integrity and Confidentiality)
✅ 需要: 数据加密,访问控制

## 7. 可问责性 (Accountability)
✅ 需要: 记录合规措施,定期审计
```

---

### 用户数据权利实现

#### 1. 数据访问权 (Right to Access)

**用户可以请求查看自己的所有数据**:

```typescript
// app/api/user/data-export/route.ts
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  // 1. 获取用户profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 2. 获取用户的所有会议
  const { data: meetings } = await supabase
    .from('meetings')
    .select('*')
    .eq('user_id', user.id)

  // 3. 获取用户设置
  const { data: settings } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // 4. 组装完整数据
  const userData = {
    exportDate: new Date().toISOString(),
    profile,
    meetings,
    settings,
    auth: {
      id: user.id,
      email: user.email,
      createdAt: user.created_at,
      lastSignIn: user.last_sign_in_at,
    },
  }

  // 5. 返回JSON文件
  return new NextResponse(JSON.stringify(userData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="techmeet-data-${user.id}.json"`,
    },
  })
}
```

**前端下载按钮**:

```tsx
// components/DownloadDataButton.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DownloadIcon, LoaderIcon } from 'lucide-react'

export function DownloadDataButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/user/data-export')

      if (!response.ok) {
        throw new Error('下载失败')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `techmeet-data-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
      alert('下载失败,请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleDownload} disabled={isLoading} variant="outline">
      {isLoading ? (
        <>
          <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
          导出中...
        </>
      ) : (
        <>
          <DownloadIcon className="mr-2 h-4 w-4" />
          下载我的数据
        </>
      )}
    </Button>
  )
}
```

---

#### 2. 数据删除权 (Right to Erasure / Right to be Forgotten)

**用户可以请求删除所有数据**:

```typescript
// app/api/user/delete-account/route.ts
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  try {
    // 1. 删除用户的所有会议(CASCADE会自动删除insights)
    const { error: meetingsError } = await supabase
      .from('meetings')
      .delete()
      .eq('user_id', user.id)

    if (meetingsError) throw meetingsError

    // 2. 删除用户设置
    const { error: settingsError } = await supabase
      .from('user_settings')
      .delete()
      .eq('user_id', user.id)

    if (settingsError) throw settingsError

    // 3. 删除用户profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id)

    if (profileError) throw profileError

    // 4. 删除Supabase Auth用户(需要admin API)
    // 这一步需要在Supabase Edge Function中完成
    const deleteAuthResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/delete-auth-user`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ userId: user.id }),
      }
    )

    if (!deleteAuthResponse.ok) {
      throw new Error('删除认证用户失败')
    }

    return NextResponse.json({ success: true, message: '账号已删除' })
  } catch (error: any) {
    console.error('Delete account error:', error)
    return NextResponse.json(
      { error: '删除失败,请联系支持' },
      { status: 500 }
    )
  }
}
```

**Edge Function删除Auth用户**:

```typescript
// supabase/functions/delete-auth-user/index.ts
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: Request) {
  // 验证请求来源
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    })
  }

  const { userId } = await req.json()

  if (!userId) {
    return new Response(JSON.stringify({ error: 'userId required' }), {
      status: 400,
    })
  }

  // 使用service_role删除用户
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { error } = await supabase.auth.admin.deleteUser(userId)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  })
}
```

**删除账号确认Dialog**:

```tsx
// components/DeleteAccountDialog.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircleIcon, LoaderIcon } from 'lucide-react'

export function DeleteAccountDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirmation !== 'DELETE') {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('删除失败')
      }

      // 删除成功,跳转到首页
      router.push('/?message=account-deleted')
    } catch (error) {
      console.error('Delete error:', error)
      alert('删除失败,请联系支持')
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">删除账号</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>删除账号</DialogTitle>
          <DialogDescription>
            此操作无法撤销。将永久删除您的账号和所有数据,包括:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>个人资料</li>
            <li>所有会议纪要</li>
            <li>上传的音频文件</li>
            <li>用户设置</li>
          </ul>

          <div className="bg-error-50 border border-error-200 rounded-lg p-4 flex gap-3">
            <AlertCircleIcon className="h-5 w-5 text-error-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-error-700">
              <p className="font-semibold mb-1">警告:此操作不可逆</p>
              <p>删除后无法恢复任何数据</p>
            </div>
          </div>

          <div>
            <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700 mb-1">
              输入 <span className="font-mono font-bold">DELETE</span> 以确认
            </label>
            <Input
              id="confirmation"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="输入DELETE"
              disabled={isDeleting}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isDeleting}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={confirmation !== 'DELETE' || isDeleting}
            >
              {isDeleting ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  删除中...
                </>
              ) : (
                '确认删除'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

---

#### 3. 数据可携带权 (Right to Data Portability)

**已在"数据访问权"实现,返回标准JSON格式**

用户可以:
- 下载JSON格式数据
- 导入到其他服务
- 备份到本地

---

### Cookie同意和隐私政策

#### Cookie Banner实现

```tsx
// components/CookieBanner.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const COOKIE_CONSENT_KEY = 'cookie-consent'

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // 检查是否已经同意过
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
    setShowBanner(false)

    // 启用分析(如Google Analytics)
    // window.gtag('consent', 'update', { analytics_storage: 'granted' })
  }

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="max-w-4xl mx-auto p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              Cookie和隐私
            </h3>
            <p className="text-sm text-gray-600">
              我们使用Cookie来改善您的体验。继续使用本网站即表示您同意我们的
              <a href="/privacy" className="text-primary-600 hover:underline ml-1">
                隐私政策
              </a>
              和
              <a href="/cookies" className="text-primary-600 hover:underline ml-1">
                Cookie政策
              </a>
              。
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleDecline}>
              拒绝
            </Button>
            <Button onClick={handleAccept}>
              接受
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
```

**在根布局中使用**:

```tsx
// app/layout.tsx
import { CookieBanner } from '@/components/CookieBanner'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
```

---

#### 隐私政策页面

```tsx
// app/privacy/page.tsx
export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        隐私政策
      </h1>

      <div className="prose prose-sm max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. 数据收集</h2>
          <p className="text-gray-700 leading-relaxed">
            TechMeet收集以下个人数据:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li><strong>账号信息</strong>: 邮箱地址、姓名(可选)、头像(可选)</li>
            <li><strong>会议数据</strong>: 上传的音频文件、转录文本、会议标题</li>
            <li><strong>使用数据</strong>: 访问日志、IP地址、设备信息</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. 数据使用</h2>
          <p className="text-gray-700 leading-relaxed">
            我们使用您的数据用于:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>提供AI会议纪要服务</li>
            <li>改善产品功能和用户体验</li>
            <li>发送重要通知(如系统更新)</li>
            <li>防止欺诈和滥用</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. 数据共享</h2>
          <p className="text-gray-700 leading-relaxed">
            我们<strong>不会</strong>出售您的个人数据。我们仅在以下情况共享数据:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li><strong>服务提供商</strong>: Supabase(数据库)、OpenAI(转录)</li>
            <li><strong>法律要求</strong>: 遵守法律义务或法院命令</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. 数据保护</h2>
          <p className="text-gray-700 leading-relaxed">
            我们采取以下安全措施保护您的数据:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>TLS/HTTPS加密传输</li>
            <li>AES-256数据库加密</li>
            <li>行级安全(RLS)访问控制</li>
            <li>定期安全审计</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. 您的权利(GDPR)</h2>
          <p className="text-gray-700 leading-relaxed">
            根据GDPR,您有以下权利:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li><strong>访问权</strong>: 下载您的所有数据</li>
            <li><strong>更正权</strong>: 更新不准确的数据</li>
            <li><strong>删除权</strong>: 删除您的账号和所有数据</li>
            <li><strong>可携带权</strong>: 以JSON格式导出数据</li>
            <li><strong>反对权</strong>: 反对数据处理</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            您可以在<a href="/settings/privacy" className="text-primary-600 hover:underline">账号设置</a>中行使这些权利。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. 数据保留</h2>
          <p className="text-gray-700 leading-relaxed">
            我们保留您的数据直到:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>您删除账号</li>
            <li>您的账号被标记为不活跃(3年未登录)</li>
            <li>法律要求删除</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookie</h2>
          <p className="text-gray-700 leading-relaxed">
            我们使用以下Cookie:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li><strong>必要Cookie</strong>: 认证、session管理(无需同意)</li>
            <li><strong>分析Cookie</strong>: 统计访问数据(需要同意)</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            详细信息请参见<a href="/cookies" className="text-primary-600 hover:underline">Cookie政策</a>。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. 儿童隐私</h2>
          <p className="text-gray-700 leading-relaxed">
            TechMeet不面向13岁以下儿童。如果您发现我们收集了儿童的数据,请联系我们。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. 政策更新</h2>
          <p className="text-gray-700 leading-relaxed">
            我们可能会不时更新本隐私政策。重大变更将通过邮件通知您。
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <strong>最后更新</strong>: 2025年10月13日
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. 联系我们</h2>
          <p className="text-gray-700 leading-relaxed">
            如有隐私相关问题,请联系:
          </p>
          <p className="text-gray-700 mt-2">
            <strong>邮箱</strong>: privacy@techmeet.com<br />
            <strong>地址</strong>: [您的公司地址]
          </p>
        </section>
      </div>
    </div>
  )
}
```

---

### 数据保留政策

**自动清理不活跃数据**:

```sql
-- supabase/migrations/20241013_data_retention.sql

-- 创建函数:删除不活跃用户数据(3年未登录)
CREATE OR REPLACE FUNCTION cleanup_inactive_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 删除3年未登录的用户的所有会议
  DELETE FROM meetings
  WHERE user_id IN (
    SELECT id FROM profiles
    WHERE last_sign_in_at < NOW() - INTERVAL '3 years'
  );

  -- 删除3年未登录的用户profile
  DELETE FROM profiles
  WHERE last_sign_in_at < NOW() - INTERVAL '3 years';

  -- 日志记录
  RAISE NOTICE 'Cleanup completed at %', NOW();
END;
$$;

-- 创建cron job(每月1日凌晨2点执行)
-- 需要启用pg_cron扩展
SELECT cron.schedule(
  'cleanup-inactive-users',
  '0 2 1 * *', -- 每月1日凌晨2点
  'SELECT cleanup_inactive_users();'
);
```

---

## 11.5 本章小结

安全与合规阶段的核心要点:

1. **认证授权实现**:
   - Supabase Auth集成:邮箱+密码、Google OAuth、Magic Link
   - JWT token自动管理和刷新
   - Next.js中间件保护路由
   - Session管理和状态监听
   - 密码重置流程

2. **数据保护策略**:
   - Row Level Security (RLS):数据库级别权限控制
   - RLS策略测试和验证
   - 传输加密(HTTPS/TLS)和静态加密(AES-256)
   - 敏感字段加密(pgcrypto)
   - 环境变量管理(Vercel配置)
   - PII数据最小化和日志过滤

3. **API安全最佳实践**:
   - Rate Limiting (Upstash Redis):防止DDoS和滥用
   - 输入验证(Zod Schema):防止恶意输入
   - SQL注入防护(Supabase自动参数化)
   - CORS配置:限制跨域访问
   - XSS防护(React自动转义、DOMPurify)
   - Content Security Policy (CSP)

4. **GDPR/隐私合规**:
   - 用户数据权利:访问权(数据导出)、删除权(账号删除)、可携带权
   - Cookie同意Banner
   - 隐私政策页面(10个必备章节)
   - 数据保留政策(自动清理不活跃用户)

**关键洞察**:
> "安全不是功能,而是基础架构。通过Supabase RLS,我们在数据库层强制执行权限,即使API被绕过也无法访问他人数据。通过Rate Limiting,我们保护API不被滥用,控制成本。通过GDPR合规,我们尊重用户数据权利,建立信任。"

**实践建议**:
1. **安全内建**: 从第一天就启用RLS,不要事后补充
2. **最小权限**: 只授予必需的访问权限,默认拒绝
3. **纵深防御**: 多层安全措施(RLS + Rate Limiting + 输入验证)
4. **定期审计**: 每季度review RLS策略和API安全配置
5. **透明沟通**: 清晰的隐私政策,让用户知情

**下一章**: 我们将学习部署与运维(Deployment & Operations),包括Vercel生产部署、环境配置管理、监控告警系统,以及性能优化策略。

---

**思考题**:
1. 你的应用是否实现了RLS?如果没有,谁可以访问其他用户的数据?
2. 你的API是否有Rate Limiting?如果被DDoS攻击,成本会是多少?
3. 如果用户要求删除数据,你需要多长时间?能否真正删除所有数据?

👉 [下一章:部署与运维](chapter12-deployment.md)
