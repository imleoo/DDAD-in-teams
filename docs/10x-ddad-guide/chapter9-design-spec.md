# 第九章:设计规范

> **本章导读**
>
> 深入学习综合技术规格文档(design-spec.md)的编写方法,掌握视觉风格指南的系统化定义,理解Shadcn/ui组件库的集成与定制,以及如何实施WCAG 2.1 AA可访问性标准。

---

## 9.1 综合技术规格文档 (design-spec.md)

### 什么是设计规范?

**设计规范(Design Specification)**是项目的技术和视觉实现蓝图,定义了所有设计和技术决策的详细标准。

**为什么重要?**
- 🎨 **视觉一致性**: 确保整个应用的视觉语言统一
- 🤖 **AI友好**: 提供明确的设计约束,AI生成的代码符合规范
- 🔄 **可维护性**: 新功能开发时有明确的设计参考
- 👥 **团队协作**: 设计师和开发者有共同的设计语言

---

### 设计规范的四个层次

#### 层次1: 设计原则 (Design Principles)

**目标**: 定义项目的核心设计哲学和价值观

**TechMeet的设计原则**:

```markdown
# 设计原则 (Design Principles)

## 1. 专业而不严肃 (Professional, Not Formal)
**理念**: TechMeet是技术工具,应该专业可靠,但不需要企业软件的严肃感。

**实践**:
- ✅ 使用现代、简洁的设计语言
- ✅ 适度使用圆角(8px-12px)而非完全方正
- ✅ 友好的文案语气,避免过于正式的措辞
- ❌ 避免过于花哨或娱乐化的设计元素

**例子**:
- 按钮文案: "开始转录" 而非 "启动音频转录处理流程"
- 错误提示: "上传失败,请重试" 而非 "系统错误代码500"

---

## 2. 信息优先 (Content First)
**理念**: 设计服务于内容,而非装饰。用户的核心任务是查看和管理会议纪要。

**实践**:
- ✅ 大量留白,让内容呼吸
- ✅ 清晰的视觉层次(标题 > 正文 > 辅助信息)
- ✅ 最小化装饰性元素
- ❌ 避免过度使用渐变、阴影、动画

**例子**:
- Dashboard以会议列表为主,导航栏极简
- 会议详情页:转录文本占据主要视觉空间,功能按钮次要

---

## 3. 快速响应 (Fast Feedback)
**理念**: 所有交互都应该有即时反馈,用户不应该疑惑"系统在做什么"。

**实践**:
- ✅ 所有按钮有hover和active状态
- ✅ 加载状态明确(进度条、骨架屏)
- ✅ 表单验证即时反馈(而非提交后才显示错误)
- ❌ 避免长时间无反馈的操作

**例子**:
- 上传音频: 实时显示上传进度和预计剩余时间
- 转录处理: 显示"正在转录... 预计还需5分钟"
- 表单输入: 输入邮箱后立即验证格式,而非提交时才提示

---

## 4. 可访问优先 (Accessibility First)
**理念**: 可访问性不是附加功能,而是基础标准。

**实践**:
- ✅ 符合WCAG 2.1 AA标准
- ✅ 完整的键盘导航支持
- ✅ 颜色对比度 ≥ 4.5:1
- ✅ 所有交互元素有明确的focus状态

**例子**:
- 所有图标按钮都有aria-label
- 表单输入有明确的label和error提示
- 模态框有焦点陷阱(focus trap)
```

---

#### 层次2: 视觉风格系统 (Visual Style System)

**目标**: 定义颜色、字体、间距、阴影等基础设计Token

**完整的设计Token系统**:

```markdown
# 视觉风格系统 (Visual Style System)

## 1. 颜色系统 (Color System)

### 品牌色 (Brand Colors)
```css
:root {
  /* Primary - 蓝色系(专业、可信赖) */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;  /* 主品牌色 */
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;

  /* Secondary - 紫色系(创新、AI) */
  --secondary-50: #faf5ff;
  --secondary-100: #f3e8ff;
  --secondary-200: #e9d5ff;
  --secondary-300: #d8b4fe;
  --secondary-400: #c084fc;
  --secondary-500: #a855f7;  /* 次品牌色 */
  --secondary-600: #9333ea;
  --secondary-700: #7e22ce;
  --secondary-800: #6b21a8;
  --secondary-900: #581c87;
}
```

### 语义色 (Semantic Colors)
```css
:root {
  /* Success - 成功状态 */
  --success-50: #f0fdf4;
  --success-500: #22c55e;
  --success-700: #15803d;

  /* Warning - 警告状态 */
  --warning-50: #fffbeb;
  --warning-500: #f59e0b;
  --warning-700: #b45309;

  /* Error - 错误状态 */
  --error-50: #fef2f2;
  --error-500: #ef4444;
  --error-700: #b91c1c;

  /* Info - 信息状态 */
  --info-50: #f0f9ff;
  --info-500: #0ea5e9;
  --info-700: #0369a1;
}
```

### 中性色 (Neutral Colors)
```css
:root {
  /* Gray - 灰度系统 */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;

  /* 文本色 */
  --text-primary: var(--gray-900);
  --text-secondary: var(--gray-600);
  --text-tertiary: var(--gray-500);
  --text-disabled: var(--gray-400);

  /* 背景色 */
  --bg-primary: #ffffff;
  --bg-secondary: var(--gray-50);
  --bg-tertiary: var(--gray-100);

  /* 边框色 */
  --border-default: var(--gray-200);
  --border-strong: var(--gray-300);
}
```

### 颜色使用规范
```markdown
**主按钮(Primary Button)**:
- Background: var(--primary-500)
- Text: white
- Hover: var(--primary-600)
- Active: var(--primary-700)
- Disabled: var(--gray-300) with opacity 0.5

**次要按钮(Secondary Button)**:
- Background: transparent
- Border: var(--gray-300)
- Text: var(--gray-700)
- Hover: var(--gray-50)

**危险按钮(Danger Button)**:
- Background: var(--error-500)
- Text: white
- Hover: var(--error-600)

**链接(Links)**:
- Default: var(--primary-600)
- Hover: var(--primary-700)
- Visited: var(--primary-800)
```

---

## 2. 字体系统 (Typography System)

### 字体族 (Font Family)
```css
:root {
  /* 西文字体 */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
               Roboto, 'Helvetica Neue', Arial, sans-serif;

  /* 等宽字体(代码) */
  --font-mono: 'Fira Code', 'SF Mono', Monaco, 'Cascadia Code',
               'Roboto Mono', Consolas, monospace;

  /* 中文字体(如果需要) */
  --font-zh: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}
```

### 字体大小和行高 (Font Size & Line Height)
```css
:root {
  /* Display - 大标题 */
  --text-display-2xl: 4.5rem;    /* 72px */
  --text-display-xl: 3.75rem;    /* 60px */
  --text-display-lg: 3rem;       /* 48px */
  --text-display-md: 2.25rem;    /* 36px */
  --text-display-sm: 1.875rem;   /* 30px */

  /* Heading - 标题 */
  --text-h1: 2.25rem;    /* 36px */
  --text-h2: 1.875rem;   /* 30px */
  --text-h3: 1.5rem;     /* 24px */
  --text-h4: 1.25rem;    /* 20px */
  --text-h5: 1.125rem;   /* 18px */
  --text-h6: 1rem;       /* 16px */

  /* Body - 正文 */
  --text-xl: 1.25rem;    /* 20px */
  --text-lg: 1.125rem;   /* 18px */
  --text-base: 1rem;     /* 16px - 基础字号 */
  --text-sm: 0.875rem;   /* 14px */
  --text-xs: 0.75rem;    /* 12px */

  /* Line Height */
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}
```

### 字重 (Font Weight)
```css
:root {
  --font-thin: 100;
  --font-extralight: 200;
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
  --font-black: 900;
}
```

### 字体使用规范
```markdown
**页面主标题**:
- Font Size: var(--text-h1) 或 var(--text-display-sm)
- Font Weight: var(--font-bold)
- Line Height: var(--leading-tight)
- Color: var(--text-primary)

**章节标题**:
- Font Size: var(--text-h2)
- Font Weight: var(--font-semibold)
- Line Height: var(--leading-snug)
- Color: var(--text-primary)

**正文**:
- Font Size: var(--text-base)
- Font Weight: var(--font-normal)
- Line Height: var(--leading-relaxed)
- Color: var(--text-secondary)

**辅助文字**:
- Font Size: var(--text-sm)
- Font Weight: var(--font-normal)
- Line Height: var(--leading-normal)
- Color: var(--text-tertiary)

**代码块**:
- Font Family: var(--font-mono)
- Font Size: var(--text-sm)
- Line Height: var(--leading-normal)
```

---

## 3. 间距系统 (Spacing System)

### 间距Scale (基于4px网格)
```css
:root {
  --spacing-0: 0;
  --spacing-0_5: 0.125rem;   /* 2px */
  --spacing-1: 0.25rem;      /* 4px */
  --spacing-1_5: 0.375rem;   /* 6px */
  --spacing-2: 0.5rem;       /* 8px */
  --spacing-2_5: 0.625rem;   /* 10px */
  --spacing-3: 0.75rem;      /* 12px */
  --spacing-3_5: 0.875rem;   /* 14px */
  --spacing-4: 1rem;         /* 16px */
  --spacing-5: 1.25rem;      /* 20px */
  --spacing-6: 1.5rem;       /* 24px */
  --spacing-7: 1.75rem;      /* 28px */
  --spacing-8: 2rem;         /* 32px */
  --spacing-9: 2.25rem;      /* 36px */
  --spacing-10: 2.5rem;      /* 40px */
  --spacing-11: 2.75rem;     /* 44px */
  --spacing-12: 3rem;        /* 48px */
  --spacing-14: 3.5rem;      /* 56px */
  --spacing-16: 4rem;        /* 64px */
  --spacing-20: 5rem;        /* 80px */
  --spacing-24: 6rem;        /* 96px */
  --spacing-32: 8rem;        /* 128px */
  --spacing-40: 10rem;       /* 160px */
  --spacing-48: 12rem;       /* 192px */
  --spacing-56: 14rem;       /* 224px */
  --spacing-64: 16rem;       /* 256px */
}
```

### 间距使用规范
```markdown
**组件内部间距** (Padding):
- 按钮: px-4 py-2 (16px × 8px)
- 输入框: px-3 py-2 (12px × 8px)
- 卡片: p-6 (24px all sides)
- 模态框: p-6 md:p-8 (24px mobile, 32px desktop)

**组件间间距** (Margin/Gap):
- 段落间距: mb-4 (16px)
- 表单字段间距: space-y-4 (16px vertical gap)
- 卡片列表: gap-6 (24px grid gap)
- 章节间距: mb-12 (48px)

**布局间距**:
- 页面左右padding: px-4 md:px-6 lg:px-8 (16px/24px/32px responsive)
- 页面顶部padding: pt-20 (80px - 留出导航栏空间)
- 内容最大宽度容器: max-w-7xl mx-auto (1280px centered)
```

---

## 4. 阴影系统 (Shadow System)

### 阴影Scale
```css
:root {
  /* Elevation shadows */
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1),
               0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1),
               0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1),
               0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1),
               0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

  /* Inner shadow */
  --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);

  /* No shadow */
  --shadow-none: 0 0 #0000;
}
```

### 阴影使用规范
```markdown
**卡片(Card)**: shadow-sm
- 示例: Dashboard的会议卡片

**按钮(Button) Hover**: shadow-md
- 示例: 主按钮悬停时抬升

**模态框(Modal)**: shadow-2xl
- 示例: 上传确认对话框

**下拉菜单(Dropdown)**: shadow-lg
- 示例: 用户头像下拉菜单

**输入框 Focus**: shadow-md + ring
- 示例: 表单输入框聚焦时
```

---

## 5. 圆角系统 (Border Radius)

### 圆角Scale
```css
:root {
  --radius-none: 0;
  --radius-sm: 0.125rem;    /* 2px */
  --radius-base: 0.25rem;   /* 4px */
  --radius-md: 0.375rem;    /* 6px */
  --radius-lg: 0.5rem;      /* 8px */
  --radius-xl: 0.75rem;     /* 12px */
  --radius-2xl: 1rem;       /* 16px */
  --radius-3xl: 1.5rem;     /* 24px */
  --radius-full: 9999px;    /* Pill shape */
}
```

### 圆角使用规范
```markdown
**按钮**: radius-md (6px)
**输入框**: radius-md (6px)
**卡片**: radius-lg (8px)
**模态框**: radius-xl (12px)
**头像**: radius-full (circle)
**标签(Tag/Badge)**: radius-full (pill)
```

---

## 6. 动画系统 (Animation System)

### 缓动函数 (Easing)
```css
:root {
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* Custom easing */
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-smooth: cubic-bezier(0.4, 0, 0.6, 1);
}
```

### 过渡时长 (Duration)
```css
:root {
  --duration-75: 75ms;
  --duration-100: 100ms;
  --duration-150: 150ms;
  --duration-200: 200ms;
  --duration-300: 300ms;
  --duration-500: 500ms;
  --duration-700: 700ms;
  --duration-1000: 1000ms;
}
```

### 动画使用规范
```markdown
**交互反馈** (Hover, Focus, Active):
- Duration: 150ms
- Easing: ease-in-out
- 示例: 按钮hover状态变化

**页面切换**:
- Duration: 300ms
- Easing: ease-out
- 示例: Dashboard到会议详情页过渡

**模态框进入/退出**:
- Duration: 200ms
- Easing: ease-out (进入), ease-in (退出)
- 示例: 上传文件模态框

**加载动画**:
- Duration: 1000ms
- Easing: linear
- 示例: 转录进度条动画

**避免过度动画**:
- 不要同时有多个动画
- 动画应该增强体验,而非分散注意力
- 提供"减少动画"选项(prefers-reduced-motion)
```
```

---

#### 层次3: 组件规范 (Component Specifications)

**目标**: 定义每个UI组件的视觉和交互标准

**完整的组件规范示例**:

```markdown
# 组件规范 (Component Specifications)

## Button 组件

### 变体 (Variants)
```tsx
// components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  // Base styles - 所有按钮共享
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700",
        destructive: "bg-error-500 text-white hover:bg-error-600",
        outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50",
        secondary: "bg-secondary-500 text-white hover:bg-secondary-600",
        ghost: "text-gray-700 hover:bg-gray-100",
        link: "text-primary-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
```

### 使用示例
```tsx
// 主按钮
<Button>上传会议</Button>

// 次要按钮
<Button variant="outline">取消</Button>

// 危险操作
<Button variant="destructive">删除会议</Button>

// 小尺寸按钮
<Button size="sm">保存</Button>

// 图标按钮
<Button size="icon" variant="ghost">
  <SearchIcon className="h-4 w-4" />
</Button>

// 加载状态
<Button disabled>
  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
  上传中...
</Button>
```

### 可访问性要求
```markdown
- [ ] 所有按钮有明确的文本或aria-label
- [ ] 图标按钮必须有aria-label: `<Button aria-label="搜索">`
- [ ] Focus状态明显可见(ring-2)
- [ ] 键盘可访问(Tab导航, Enter激活)
- [ ] 禁用状态有视觉指示(opacity-50)
- [ ] 颜色对比度 ≥ 4.5:1(WCAG AA)
```

---

## Input 组件

### 基础实现
```tsx
// components/ui/input.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, ...props }, ref) => {
    const id = React.useId()

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
            "placeholder:text-gray-400",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-error-500 focus-visible:ring-error-500",
            className
          )}
          ref={ref}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${id}-error`}
            className="mt-1 text-sm text-error-500"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
```

### 使用示例
```tsx
// 基础输入框
<Input placeholder="输入邮箱地址" />

// 带标签
<Input
  label="邮箱地址"
  type="email"
  placeholder="user@example.com"
/>

// 错误状态
<Input
  label="邮箱地址"
  error="请输入有效的邮箱地址"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// 禁用状态
<Input
  label="用户ID"
  value={userId}
  disabled
/>
```

### 验证规范
```markdown
**即时验证触发时机**:
- onBlur: 用户离开输入框时验证
- onChange: 对于邮箱、密码等,输入过程中实时验证

**错误提示要求**:
- ✅ 具体说明错误: "邮箱格式不正确" 而非 "输入无效"
- ✅ 提供修正建议: "密码至少8位,包含大小写字母和数字"
- ✅ 错误信息用role="alert"标记,屏幕阅读器可读

**成功状态**:
- 验证通过后显示绿色对勾图标(可选)
- 不需要显式的"正确"文案,避免视觉噪音
```

---

## Card 组件

### 基础实现
```tsx
// components/ui/card.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-gray-200 bg-white shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

### TechMeet会议卡片实现
```tsx
// components/MeetingCard.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, ClockIcon, CheckCircleIcon, LoaderIcon } from 'lucide-react'

interface Meeting {
  id: string
  title: string
  date: string
  duration: number
  status: 'processing' | 'completed' | 'failed'
  decisionCount: number
  actionItemCount: number
}

export function MeetingCard({ meeting }: { meeting: Meeting }) {
  const statusConfig = {
    processing: {
      label: '处理中',
      color: 'bg-warning-100 text-warning-800',
      icon: LoaderIcon,
    },
    completed: {
      label: '已完成',
      color: 'bg-success-100 text-success-800',
      icon: CheckCircleIcon,
    },
    failed: {
      label: '失败',
      color: 'bg-error-100 text-error-800',
      icon: null,
    },
  }

  const config = statusConfig[meeting.status]
  const StatusIcon = config.icon

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-2">{meeting.title}</CardTitle>
          <Badge className={config.color}>
            {StatusIcon && <StatusIcon className="mr-1 h-3 w-3" />}
            {config.label}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-4 mt-2">
          <span className="flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" />
            {meeting.date}
          </span>
          <span className="flex items-center gap-1">
            <ClockIcon className="h-3 w-3" />
            {meeting.duration}分钟
          </span>
        </CardDescription>
      </CardHeader>

      {meeting.status === 'completed' && (
        <CardContent>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>📋 {meeting.decisionCount} 个决策</span>
            <span>✅ {meeting.actionItemCount} 个行动项</span>
          </div>
        </CardContent>
      )}

      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full">
          查看详情
        </Button>
      </CardFooter>
    </Card>
  )
}
```

---

## Modal/Dialog 组件

### 基础实现(使用Radix UI)
```tsx
// components/ui/dialog.tsx
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white p-6 shadow-2xl duration-200",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        "sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:pointer-events-none">
        <X className="h-4 w-4" />
        <span className="sr-only">关闭</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-gray-600", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
}
```

### 使用示例:删除确认对话框
```tsx
// components/DeleteMeetingDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TrashIcon } from "lucide-react"

export function DeleteMeetingDialog({ meetingId, meetingTitle, onDelete }: {
  meetingId: string
  meetingTitle: string
  onDelete: (id: string) => Promise<void>
}) {
  const [open, setOpen] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete(meetingId)
      setOpen(false)
    } catch (error) {
      console.error('Delete failed:', error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <TrashIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>删除会议纪要?</DialogTitle>
          <DialogDescription>
            您确定要删除 "{meetingTitle}" 吗?此操作无法撤销。
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={deleting}
          >
            取消
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? '删除中...' : '确认删除'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### 可访问性要求
```markdown
- [ ] 模态框打开时,焦点自动移到模态框内(Radix UI自动处理)
- [ ] 焦点陷阱(Focus Trap): Tab键只在模态框内循环(Radix UI自动处理)
- [ ] Esc键关闭模态框(Radix UI自动处理)
- [ ] 背景内容inert(无法交互)(Radix UI自动处理)
- [ ] 关闭按钮有明确的aria-label: "关闭"
- [ ] DialogTitle用于屏幕阅读器识别模态框标题
- [ ] 危险操作(删除)需要二次确认,避免误操作
```
```

---

#### 层次4: 实施指南 (Implementation Guidelines)

**目标**: 为开发者提供具体的实施步骤和最佳实践

```markdown
# 实施指南 (Implementation Guidelines)

## 1. 设置Tailwind CSS配置

### tailwind.config.js完整配置
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          700: '#15803d',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          700: '#b45309',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          700: '#b91c1c',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### globals.css配置
```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 210 40% 98%;

    --secondary: 270 95.2% 63.1%;
    --secondary-foreground: 270 100% 98%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 217.2 91.2% 59.8%;

    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 210 40% 98%;

    --secondary: 270 95.2% 63.1%;
    --secondary-foreground: 270 100% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 217.2 91.2% 59.8%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

/* Custom scrollbar */
@layer utilities {
  .scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: rgb(203 213 225) transparent;
  }

  .scrollbar-thin::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: rgb(203 213 225);
    border-radius: 4px;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background-color: rgb(148 163 184);
  }
}
```

---

## 2. 组件开发工作流

### Step 1: 安装Shadcn/ui CLI
```bash
npx shadcn-ui@latest init
```

**配置选项**:
```
Would you like to use TypeScript? yes
Which style would you like to use? › Default
Which color would you like to use as base color? › Slate
Where is your global CSS file? › app/globals.css
Would you like to use CSS variables for colors? › yes
Where is your tailwind.config.js located? › tailwind.config.js
Configure the import alias for components: › @/components
Configure the import alias for utils: › @/lib/utils
Are you using React Server Components? › yes
```

### Step 2: 添加需要的组件
```bash
# 基础组件
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add toast

# 复杂组件
npx shadcn-ui@latest add form
npx shadcn-ui@latest add table
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add dropdown-menu
```

### Step 3: 定制组件
```tsx
// 基于Shadcn/ui Button,添加TechMeet特定样式
// components/ui/button.tsx (修改后)

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700",
        destructive: "bg-error-500 text-white hover:bg-error-600",
        outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50",
        secondary: "bg-secondary-500 text-white hover:bg-secondary-600",
        ghost: "text-gray-700 hover:bg-gray-100",
        link: "text-primary-600 underline-offset-4 hover:underline",
        // 新增: TechMeet特定变体
        ai: "bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        // 新增: 更大的号召性按钮
        xl: "h-14 rounded-md px-10 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### Step 4: 创建组合组件
```tsx
// components/MeetingCard.tsx
// 组合Card, Badge, Button等基础组件

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function MeetingCard({ meeting }: { meeting: Meeting }) {
  // 组合多个Shadcn/ui组件
  return (
    <Card>
      <CardHeader>
        <CardTitle>{meeting.title}</CardTitle>
        <CardDescription>{meeting.date}</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge>{meeting.status}</Badge>
      </CardContent>
      <CardFooter>
        <Button>查看详情</Button>
      </CardFooter>
    </Card>
  )
}
```

---

## 3. 设计Token验证

### 颜色对比度检查
```bash
# 安装对比度检查工具
npm install -D @adobe/leonardo-contrast-colors

# 或使用在线工具
# https://webaim.org/resources/contrastchecker/
```

**手动检查清单**:
```markdown
## 颜色对比度验证 (WCAG AA要求)

### 文本色 vs 背景色
- [ ] 主文本(gray-900) vs 白色背景: 对比度 ≥ 4.5:1 ✅
- [ ] 次要文本(gray-600) vs 白色背景: 对比度 ≥ 4.5:1 ✅
- [ ] 辅助文本(gray-500) vs 白色背景: 对比度 ≥ 4.5:1 (需要检查)

### 按钮色 vs 文本色
- [ ] Primary按钮(primary-500) vs 白色文本: 对比度 ≥ 4.5:1 ✅
- [ ] Success按钮(success-500) vs 白色文本: 对比度 ≥ 4.5:1 ✅
- [ ] Error按钮(error-500) vs 白色文本: 对比度 ≥ 4.5:1 ✅

### 链接色 vs 背景色
- [ ] 链接(primary-600) vs 白色背景: 对比度 ≥ 4.5:1 ✅
- [ ] 链接hover(primary-700) vs 白色背景: 对比度 ≥ 4.5:1 ✅
```

### 间距一致性检查
```bash
# 使用ESLint规则检查Tailwind类名一致性
npm install -D eslint-plugin-tailwindcss

# .eslintrc.js配置
module.exports = {
  plugins: ['tailwindcss'],
  rules: {
    'tailwindcss/classnames-order': 'warn', // 类名顺序
    'tailwindcss/no-custom-classname': 'warn', // 禁止自定义类名
    'tailwindcss/no-contradicting-classname': 'error', // 冲突类名
  },
}
```

---

## 4. 设计规范文档维护

### 版本控制
```markdown
# design-spec.md版本历史

## v1.0.0 (2025-10-12)
- 初始设计系统定义
- 颜色、字体、间距、阴影系统
- Button, Input, Card, Dialog基础组件规范

## v1.1.0 (2025-10-20)
- 新增AI按钮变体(variant="ai")
- 新增XL按钮尺寸(size="xl")
- 更新颜色对比度,确保WCAG AA合规
- 新增MeetingCard组合组件

## v1.2.0 (TBD)
- 深色模式完整支持
- 动画系统完善
- 新增Table, Form组合组件
```

### 设计审查流程
```markdown
## 新组件设计审查清单

### 设计阶段
- [ ] 符合TechMeet设计原则(4条)
- [ ] 使用设计Token(颜色、字体、间距)
- [ ] 提供Figma设计稿(如果有设计师)

### 开发阶段
- [ ] 基于Shadcn/ui基础组件(如果适用)
- [ ] TypeScript类型完整
- [ ] 响应式(mobile, tablet, desktop)
- [ ] 可访问性(WCAG AA)

### 测试阶段
- [ ] 单元测试覆盖率 >80%
- [ ] Storybook故事(所有变体)
- [ ] 可访问性测试通过(axe-core)

### 文档阶段
- [ ] 更新design-spec.md
- [ ] 使用示例代码
- [ ] 可访问性要求文档
```
```

---

## 9.2 视觉风格指南

### 色彩心理学与应用

**TechMeet的色彩策略**:

```markdown
# 色彩心理学 (Color Psychology)

## 主色调: 蓝色(Primary Blue)
**心理联想**: 专业、可靠、冷静、科技感

**使用场景**:
- ✅ 主按钮(CTA): "开始转录", "上传会议"
- ✅ 链接和导航元素
- ✅ 主要交互元素(checkbox选中状态, radio选中状态)
- ✅ 进度条、加载指示器
- ❌ 避免: 大面积背景(过于冷淡)

**配色建议**:
- 与白色背景对比: 清爽专业
- 与灰色背景对比: 温和内敛
- 与紫色(次要色)搭配: 创新科技感

---

## 次要色: 紫色(Secondary Purple)
**心理联想**: 创新、AI、未来感、神秘

**使用场景**:
- ✅ AI功能标记: "AI生成", "智能分析"
- ✅ 高级功能徽章: "Pro", "Premium"
- ✅ 装饰性元素(渐变背景, 图标)
- ❌ 避免: 关键交互按钮(可能混淆用户)

**配色建议**:
- 用于强调AI驱动功能
- 与蓝色形成渐变(from-primary-500 to-secondary-500)
- 小面积使用,点睛作用

---

## 成功色: 绿色(Success Green)
**心理联想**: 成功、安全、完成、肯定

**使用场景**:
- ✅ 成功提示: "上传成功", "转录完成"
- ✅ 状态徽章: "已完成"
- ✅ 对勾图标
- ❌ 避免: 过度使用导致"圣诞树效应"

**使用原则**:
- 仅在真正的成功反馈时使用
- 配合CheckCircleIcon等图标
- Toast通知的成功状态

---

## 警告色: 橙色(Warning Orange)
**心理联想**: 注意、警告、中等优先级

**使用场景**:
- ✅ 警告提示: "文件较大,处理可能较慢"
- ✅ 状态徽章: "处理中", "即将到期"
- ✅ 中等优先级行动项
- ❌ 避免: 与错误色混淆

**使用原则**:
- 用于需要注意但非紧急的情况
- 不应该阻止用户操作
- 提供明确的下一步行动建议

---

## 错误色: 红色(Error Red)
**心理联想**: 错误、危险、停止、高优先级

**使用场景**:
- ✅ 错误提示: "上传失败", "格式不支持"
- ✅ 表单验证错误
- ✅ 危险操作: "删除会议"按钮
- ✅ 高优先级行动项
- ❌ 避免: 正常信息提示(误导用户)

**使用原则**:
- 仅用于真正的错误或危险操作
- 总是提供解决方案:"上传失败,请重试"
- 危险操作需要二次确认

---

## 中性色: 灰色(Neutral Gray)
**心理联想**: 中立、专业、背景

**使用场景**:
- ✅ 文本层次(primary/secondary/tertiary)
- ✅ 边框和分隔线
- ✅ 背景层次
- ✅ 禁用状态

**灰度使用规范**:
```css
/* 文本层次 */
--text-primary: var(--gray-900);    /* 主标题、重要文字 */
--text-secondary: var(--gray-600);  /* 正文、描述文字 */
--text-tertiary: var(--gray-500);   /* 辅助文字、时间戳 */
--text-disabled: var(--gray-400);   /* 禁用文字 */

/* 背景层次 */
--bg-primary: #ffffff;              /* 主背景 */
--bg-secondary: var(--gray-50);     /* 次要背景、卡片背景 */
--bg-tertiary: var(--gray-100);     /* 输入框、代码块背景 */

/* 边框 */
--border-default: var(--gray-200);  /* 默认边框 */
--border-strong: var(--gray-300);   /* 强调边框 */
```
```

### 图标系统

**TechMeet使用Lucide React图标库**:

```bash
npm install lucide-react
```

**图标使用规范**:

```tsx
import {
  UploadIcon,
  FileAudioIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  LoaderIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  XIcon,
  TrashIcon,
  EditIcon,
  DownloadIcon,
  ShareIcon,
  CalendarIcon,
  ClockIcon,
  MicIcon,
  PlayIcon,
  PauseIcon,
} from 'lucide-react'

// 图标尺寸规范
const iconSizes = {
  xs: 'h-3 w-3',   // 12px - 内联文字旁边
  sm: 'h-4 w-4',   // 16px - 按钮内图标、列表图标
  base: 'h-5 w-5', // 20px - 默认尺寸
  lg: 'h-6 w-6',   // 24px - 页面标题图标
  xl: 'h-8 w-8',   // 32px - 空状态图标
  '2xl': 'h-12 w-12', // 48px - Hero section图标
}

// 图标颜色规范
const iconColors = {
  default: 'text-gray-600',    // 默认灰色
  primary: 'text-primary-500', // 主题色
  success: 'text-success-500', // 成功状态
  warning: 'text-warning-500', // 警告状态
  error: 'text-error-500',     // 错误状态
  muted: 'text-gray-400',      // 弱化图标
}
```

**图标使用示例**:

```tsx
// 1. 按钮内图标
<Button>
  <UploadIcon className="mr-2 h-4 w-4" />
  上传会议
</Button>

// 2. 图标按钮
<Button size="icon" variant="ghost" aria-label="搜索">
  <SearchIcon className="h-4 w-4" />
</Button>

// 3. 加载状态图标
<LoaderIcon className="h-4 w-4 animate-spin" />

// 4. 列表项图标
<div className="flex items-center gap-2">
  <FileAudioIcon className="h-4 w-4 text-gray-600" />
  <span>meeting-recording.mp3</span>
</div>

// 5. 状态图标
<div className="flex items-center gap-1">
  <CheckCircleIcon className="h-4 w-4 text-success-500" />
  <span>转录完成</span>
</div>

// 6. 空状态图标
<div className="text-center">
  <FileAudioIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
  <p>还没有会议纪要,上传您的第一个会议录音吧!</p>
</div>
```

**图标可访问性**:

```tsx
// ❌ 错误: 图标按钮没有aria-label
<Button size="icon">
  <SearchIcon className="h-4 w-4" />
</Button>

// ✅ 正确: 图标按钮有明确的aria-label
<Button size="icon" aria-label="搜索会议">
  <SearchIcon className="h-4 w-4" />
</Button>

// ✅ 正确: 装饰性图标有aria-hidden
<div>
  <UploadIcon className="h-4 w-4" aria-hidden="true" />
  <span>上传会议</span> {/* 文本已说明,图标为装饰 */}
</div>
```

---

### 图片和插图系统

**TechMeet的视觉资产策略**:

```markdown
# 图片使用规范

## 1. 占位图(Placeholder Images)
**用途**: 开发阶段、空状态展示

**推荐服务**:
- Unsplash Source: `https://source.unsplash.com/random/800x600?tech,meeting`
- Lorem Picsum: `https://picsum.photos/800/600`

**使用示例**:
```tsx
<Image
  src="https://source.unsplash.com/random/1200x600?technology"
  alt="Hero image showing modern office meeting"
  width={1200}
  height={600}
  priority
/>
```

---

## 2. 空状态插图(Empty State Illustrations)
**用途**: 没有数据时的友好提示

**推荐风格**: 线条插图(Line illustrations), 扁平风格

**实现方式**:
```tsx
// components/EmptyState.tsx
export function EmptyMeetingsState() {
  return (
    <div className="text-center py-12">
      {/* 使用Lucide图标作为简单插图 */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <FileAudioIcon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        还没有会议纪要
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        上传您的第一个会议录音,让AI帮您生成纪要
      </p>
      <Button>
        <UploadIcon className="mr-2 h-4 w-4" />
        上传会议
      </Button>
    </div>
  )
}
```

---

## 3. Logo设计规范
**TechMeet Logo要求**:
- 简洁: 可在16×16px清晰识别
- 可扩展: SVG格式,支持任意尺寸
- 多版本: 完整版(Logo + 文字), 简版(仅图标), 深色/浅色变体

**Logo文件组织**:
```
public/
├── logo-full.svg          # 完整Logo(导航栏用)
├── logo-icon.svg          # 图标Logo(favicon用)
├── logo-full-dark.svg     # 深色模式Logo
└── favicon.ico            # 浏览器favicon
```

**Next.js中使用Logo**:
```tsx
// components/Logo.tsx
import Image from 'next/image'

export function Logo({ variant = 'full' }: { variant?: 'full' | 'icon' }) {
  const src = variant === 'full' ? '/logo-full.svg' : '/logo-icon.svg'
  const width = variant === 'full' ? 150 : 40
  const height = 40

  return (
    <Image
      src={src}
      alt="TechMeet Logo"
      width={width}
      height={height}
      priority
    />
  )
}
```

---

## 4. 图片优化
**Next.js Image组件最佳实践**:
```tsx
import Image from 'next/image'

// ✅ 正确: 使用Next.js Image组件优化
<Image
  src="/meeting-hero.jpg"
  alt="Team members in a productive meeting"
  width={1200}
  height={600}
  priority // 首屏图片优先加载
  placeholder="blur" // 加载时显示模糊占位
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..." // 模糊占位数据
/>

// ❌ 错误: 直接使用img标签
<img src="/meeting-hero.jpg" alt="Meeting" />
```

**图片尺寸建议**:
```markdown
- Hero banner: 1920×600 (16:5)
- 会议卡片缩略图: 600×400 (3:2)
- 头像: 200×200 (1:1)
- Open Graph图片: 1200×630 (1.91:1)
```

**图片格式选择**:
- 照片: WebP优先, JPEG后备
- 插图/图标: SVG优先, PNG后备
- 动画: GIF或视频(< 5MB)
```

---

## 9.3 组件库设计 (Shadcn/ui深度定制)

### Shadcn/ui组件完整集成

**已安装的Shadcn/ui组件清单**:

```bash
# 基础组件(MVP必需)
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add progress

# 表单组件
npx shadcn-ui@latest add form
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea

# 导航组件
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add navigation-menu

# 数据展示组件
npx shadcn-ui@latest add table
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add skeleton

# 反馈组件
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add alert-dialog
npx shadcn-ui@latest add tooltip
```

### TechMeet特定组合组件

**组合组件1: 上传区域组件**

```tsx
// components/UploadZone.tsx
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadIcon, FileAudioIcon, XIcon, AlertCircleIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface UploadZoneProps {
  onUpload: (file: File) => Promise<void>
  maxSize?: number // MB
  acceptedFormats?: string[]
}

export function UploadZone({
  onUpload,
  maxSize = 200,
  acceptedFormats = ['audio/mpeg', 'audio/wav', 'audio/m4a']
}: UploadZoneProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

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
  })

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setProgress(0)

    try {
      // 模拟上传进度
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return 95
          }
          return prev + 5
        })
      }, 100)

      await onUpload(file)

      clearInterval(interval)
      setProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败,请重试')
    } finally {
      setUploading(false)
    }
  }

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
                <p className="text-sm text-gray-600 text-center">
                  上传中... {progress}%
                </p>
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

**组合组件2: 会议纪要展示组件**

```tsx
// components/MeetingInsights.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { FileTextIcon, Scale, CheckCircle2, Code2 } from 'lucide-react'

interface Insight {
  type: 'decision' | 'trade_off' | 'action_item' | 'code_snippet'
  content: any
  timestamp?: string
}

interface MeetingInsightsProps {
  transcript: string
  insights: Insight[]
}

export function MeetingInsights({ transcript, insights }: MeetingInsightsProps) {
  const decisions = insights.filter(i => i.type === 'decision')
  const tradeOffs = insights.filter(i => i.type === 'trade_off')
  const actionItems = insights.filter(i => i.type === 'action_item')
  const codeSnippets = insights.filter(i => i.type === 'code_snippet')

  return (
    <Tabs defaultValue="transcript" className="w-full">
      <TabsList className="grid w-full grid-cols-4 lg:w-auto">
        <TabsTrigger value="transcript" className="flex items-center gap-2">
          <FileTextIcon className="h-4 w-4" />
          <span className="hidden sm:inline">转录文本</span>
        </TabsTrigger>
        <TabsTrigger value="decisions" className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span className="hidden sm:inline">架构决策</span>
          <Badge variant="secondary" className="ml-1">{decisions.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="tradeoffs" className="flex items-center gap-2">
          <Scale className="h-4 w-4" />
          <span className="hidden sm:inline">技术权衡</span>
          <Badge variant="secondary" className="ml-1">{tradeOffs.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="actions" className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span className="hidden sm:inline">行动项</span>
          <Badge variant="secondary" className="ml-1">{actionItems.length}</Badge>
        </TabsTrigger>
      </TabsList>

      {/* 转录文本 */}
      <TabsContent value="transcript" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>完整转录</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {transcript}
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* 架构决策 */}
      <TabsContent value="decisions" className="mt-6 space-y-4">
        {decisions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              未识别到明确的架构决策
            </CardContent>
          </Card>
        ) : (
          decisions.map((insight, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">
                    {insight.content.decision}
                  </CardTitle>
                  {insight.timestamp && (
                    <Badge variant="outline">{insight.timestamp}</Badge>
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
        {tradeOffs.map((insight, index) => (
          <Card key={index}>
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
              {actionItems.map((insight, index) => (
                <div
                  key={index}
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
    </Tabs>
  )
}
```

---

## 9.4 可访问性标准 (WCAG 2.1 AA)

### WCAG 2.1 AA核心原则

**POUR原则**:

```markdown
# POUR原则 (Perceivable, Operable, Understandable, Robust)

## 1. Perceivable (可感知)
用户必须能够感知呈现给他们的信息和用户界面组件

### 1.1 文本替代
**标准**: 为所有非文本内容提供文本替代

**实施**:
```tsx
// ❌ 错误: 图片没有alt
<img src="/meeting.jpg" />

// ✅ 正确: 图片有描述性alt
<img
  src="/meeting.jpg"
  alt="Team members collaborating in a bright conference room"
/>

// ✅ 正确: 装饰性图片alt为空
<img
  src="/decorative-pattern.svg"
  alt=""
  role="presentation"
/>

// ❌ 错误: 图标按钮没有标签
<button>
  <SearchIcon />
</button>

// ✅ 正确: 图标按钮有aria-label
<button aria-label="搜索会议">
  <SearchIcon />
</button>
```

### 1.2 时基媒体替代
**标准**: 为音频和视频提供替代内容

**TechMeet实施**:
- ✅ 音频文件自动生成文本转录(核心功能)
- ✅ 转录文本可下载为纯文本
- ✅ 未来考虑:字幕文件生成(.srt格式)

### 1.3 可适应性
**标准**: 创建可以以不同方式呈现的内容,而不丢失信息或结构

**实施**:
```tsx
// ✅ 正确: 语义化HTML
<header>
  <nav>
    <ul>
      <li><a href="/dashboard">Dashboard</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>会议标题</h1>
    <section>
      <h2>转录文本</h2>
      <p>...</p>
    </section>
  </article>
</main>

<footer>
  <p>&copy; 2025 TechMeet</p>
</footer>

// ❌ 错误: 过度使用div
<div class="header">
  <div class="nav">
    <div class="nav-item">Dashboard</div>
  </div>
</div>
```

### 1.4 可辨别性
**标准**: 使用户更容易看到和听到内容,包括将前景与背景分离

**颜色对比度**:
```css
/* ✅ WCAG AA标准: 正文文本对比度 ≥ 4.5:1 */
--text-primary: #111827;  /* gray-900 */
--bg-primary: #ffffff;
/* 对比度: 16.18:1 ✅ 超过4.5:1 */

/* ✅ WCAG AA标准: 大文本(18px+)对比度 ≥ 3:1 */
--text-secondary: #4b5563; /* gray-600 */
--bg-primary: #ffffff;
/* 对比度: 7.08:1 ✅ 超过3:1 */

/* ⚠️ 需要验证 */
--text-tertiary: #6b7280; /* gray-500 */
--bg-primary: #ffffff;
/* 对比度: 4.67:1 ✅ 刚好符合4.5:1 */
```

**验证工具**:
```bash
# 安装axe-core进行可访问性测试
npm install -D @axe-core/react

# 在开发环境启用
// _app.tsx
if (process.env.NODE_ENV !== 'production') {
  import('@axe-core/react').then((axe) => {
    axe.default(React, ReactDOM, 1000)
  })
}
```

---

## 2. Operable (可操作)
用户界面组件和导航必须是可操作的

### 2.1 键盘可访问
**标准**: 所有功能都可通过键盘访问

**实施**:
```tsx
// ✅ 正确: 自定义下拉菜单支持键盘
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" aria-label="用户菜单">
      <UserIcon className="h-5 w-5" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onSelect={() => router.push('/settings')}>
      设置
    </DropdownMenuItem>
    <DropdownMenuItem onSelect={() => signOut()}>
      登出
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

// Radix UI DropdownMenu自动处理:
// - Tab/Shift+Tab: 焦点进出菜单
// - Enter/Space: 激活触发器
// - 方向键: 在菜单项之间导航
// - Esc: 关闭菜单
// - Home/End: 跳到第一个/最后一个项
```

**键盘导航测试清单**:
```markdown
- [ ] Tab键可以访问所有交互元素(按钮、链接、输入框)
- [ ] Tab顺序符合视觉流程(从左到右,从上到下)
- [ ] Focus状态清晰可见(ring-2 ring-primary-500)
- [ ] Shift+Tab反向导航
- [ ] Enter/Space激活按钮和链接
- [ ] Esc关闭模态框和下拉菜单
- [ ] 方向键在列表、菜单、标签页中导航
- [ ] 没有键盘陷阱(用户可以Tab离开任何元素)
```

### 2.2 充足时间
**标准**: 提供用户完成任务所需的时间

**TechMeet实施**:
```tsx
// ✅ 正确: 会话超时前提示用户
function SessionTimeoutWarning() {
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    // 会话55分钟后显示警告(60分钟超时)
    const warningTimer = setTimeout(() => {
      setShowWarning(true)
    }, 55 * 60 * 1000)

    return () => clearTimeout(warningTimer)
  }, [])

  return (
    <Dialog open={showWarning} onOpenChange={setShowWarning}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>会话即将超时</DialogTitle>
          <DialogDescription>
            您的会话将在5分钟后超时。点击"继续"保持登录状态。
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowWarning(false)}>
            继续
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### 2.3 癫痫和身体反应
**标准**: 不要设计会导致癫痫发作或身体反应的内容

**实施**:
```css
/* ❌ 避免: 快速闪烁动画(每秒超过3次) */
@keyframes flash {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0; }
}
.flash-fast {
  animation: flash 0.3s infinite; /* 每秒3.3次,超过安全阈值 */
}

/* ✅ 安全: 慢速动画 */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
.pulse-safe {
  animation: pulse 2s ease-in-out infinite; /* 每秒0.5次 */
}

/* ✅ 尊重用户偏好 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 2.4 导航能力
**标准**: 提供帮助用户导航、查找内容和确定他们所在位置的方法

**面包屑导航**:
```tsx
// components/Breadcrumbs.tsx
import Link from 'next/link'
import { ChevronRightIcon } from 'lucide-react'

interface Breadcrumb {
  label: string
  href?: string
}

export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav aria-label="面包屑导航">
      <ol className="flex items-center gap-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRightIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="text-gray-600 hover:text-gray-900 hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-gray-900" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// 使用示例
<Breadcrumbs
  items={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: '会议纪要', href: '/dashboard?filter=meetings' },
    { label: '系统架构讨论' }, // 当前页面,无href
  ]}
/>
```

**Skip Links(跳过导航)**:
```tsx
// components/SkipLink.tsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="
        sr-only focus:not-sr-only
        focus:absolute focus:top-4 focus:left-4 focus:z-50
        focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white
        focus:rounded-md focus:shadow-lg
      "
    >
      跳到主内容
    </a>
  )
}

// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <SkipLink />
        <header>...</header>
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <footer>...</footer>
      </body>
    </html>
  )
}
```

---

## 3. Understandable (可理解)
信息和用户界面操作必须是可理解的

### 3.1 可读性
**标准**: 使文本内容可读和可理解

**语言声明**:
```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN"> {/* 声明页面主要语言 */}
      <body>{children}</body>
    </html>
  )
}

// 对于多语言内容,指定语言变化
<p>
  这是中文内容。
  <span lang="en">This is English content.</span>
  继续中文内容。
</p>
```

### 3.2 可预测性
**标准**: 使网页以可预测的方式出现和操作

**表单提交**:
```tsx
// ✅ 正确: 明确的提交行为
<form onSubmit={handleSubmit}>
  <Input label="邮箱" type="email" required />
  <Button type="submit">登录</Button>
</form>

// ❌ 错误: 焦点变化触发提交(不可预测)
<form>
  <Input
    onBlur={() => form.submit()} // 用户离开输入框就提交,太突然
  />
</form>

// ✅ 正确: 导航前确认
function navigateAway() {
  if (hasUnsavedChanges) {
    const confirmed = confirm('有未保存的更改,确定要离开吗?')
    if (!confirmed) return
  }
  router.push('/dashboard')
}
```

### 3.3 输入帮助
**标准**: 帮助用户避免和纠正错误

**表单验证和错误提示**:
```tsx
// components/LoginForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const loginSchema = z.object({
  email: z.string()
    .min(1, '请输入邮箱地址')
    .email('邮箱格式不正确'),
  password: z.string()
    .min(8, '密码至少8位')
    .regex(/[A-Z]/, '密码必须包含至少一个大写字母')
    .regex(/[a-z]/, '密码必须包含至少一个小写字母')
    .regex(/[0-9]/, '密码必须包含至少一个数字'),
})

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    try {
      await signIn(data.email, data.password)
    } catch (error) {
      // 错误处理
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 邮箱输入 */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          邮箱地址
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={`
            w-full px-3 py-2 border rounded-md
            ${errors.email ? 'border-error-500' : 'border-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-primary-500
          `}
          placeholder="user@example.com"
        />
        {errors.email && (
          <p
            id="email-error"
            className="mt-1 text-sm text-error-500"
            role="alert"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* 密码输入 */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          密码
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          aria-invalid={errors.password ? 'true' : 'false'}
          aria-describedby="password-requirements password-error"
          className={`
            w-full px-3 py-2 border rounded-md
            ${errors.password ? 'border-error-500' : 'border-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-primary-500
          `}
        />
        <p id="password-requirements" className="mt-1 text-xs text-gray-600">
          密码要求:至少8位,包含大小写字母和数字
        </p>
        {errors.password && (
          <p
            id="password-error"
            className="mt-1 text-sm text-error-500"
            role="alert"
          >
            {errors.password.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full">
        登录
      </Button>
    </form>
  )
}
```

---

## 4. Robust (健壮性)
内容必须足够健壮,可以由各种用户代理(包括辅助技术)可靠地解释

### 4.1 兼容性
**标准**: 最大化与当前和未来用户代理(包括辅助技术)的兼容性

**ARIA属性正确使用**:
```tsx
// ✅ 正确: 模态框ARIA标记
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent
    role="dialog"
    aria-modal="true"
    aria-labelledby="dialog-title"
    aria-describedby="dialog-description"
  >
    <DialogHeader>
      <DialogTitle id="dialog-title">删除会议</DialogTitle>
      <DialogDescription id="dialog-description">
        确定要删除此会议吗?此操作无法撤销。
      </DialogDescription>
    </DialogHeader>
    <div className="flex justify-end gap-3">
      <Button variant="outline" onClick={() => setOpen(false)}>
        取消
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
        确认删除
      </Button>
    </div>
  </DialogContent>
</Dialog>

// ✅ 正确: 加载状态ARIA标记
<div role="status" aria-live="polite" aria-busy="true">
  <LoaderIcon className="h-5 w-5 animate-spin" />
  <span className="sr-only">正在加载...</span>
</div>

// ✅ 正确: 错误提示ARIA标记
<Alert variant="destructive" role="alert">
  <AlertCircleIcon className="h-4 w-4" />
  <AlertDescription>
    上传失败,请检查网络连接后重试。
  </AlertDescription>
</Alert>
```

**HTML5语义化**:
```tsx
// ✅ 正确: 使用HTML5语义化标签
<header>
  <nav aria-label="主导航">
    <ul>
      <li><Link href="/dashboard">Dashboard</Link></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <header>
      <h1>会议标题</h1>
      <p>2025-10-12 • 45分钟</p>
    </header>
    <section aria-labelledby="transcript-heading">
      <h2 id="transcript-heading">转录文本</h2>
      <p>...</p>
    </section>
    <section aria-labelledby="decisions-heading">
      <h2 id="decisions-heading">架构决策</h2>
      <ul>...</ul>
    </section>
  </article>
</main>

<footer>
  <p>&copy; 2025 TechMeet. All rights reserved.</p>
</footer>
```
```

---

### 可访问性测试清单

**TechMeet完整可访问性测试清单**:

```markdown
# TechMeet WCAG 2.1 AA 可访问性测试清单

## 自动化测试
- [ ] 使用axe DevTools扫描每个页面,无严重错误
- [ ] 使用Lighthouse Accessibility审计,分数 ≥ 90
- [ ] 使用WAVE工具检测,无对比度错误

## 键盘导航测试
- [ ] **Tab键导航**: 所有交互元素可Tab访问
- [ ] **Tab顺序**: 符合视觉流程(左→右,上→下)
- [ ] **Focus可见**: 所有元素focus状态清晰(ring-2)
- [ ] **Enter/Space**: 激活按钮和链接
- [ ] **Esc键**: 关闭模态框和下拉菜单
- [ ] **方向键**: 在Tab/Dropdown中导航
- [ ] **Home/End**: 跳到列表首/尾
- [ ] **无键盘陷阱**: 可以Tab离开任何元素

## 屏幕阅读器测试
- [ ] **macOS VoiceOver**: 测试Safari浏览器
- [ ] **Windows NVDA**: 测试Firefox浏览器
- [ ] **Windows JAWS**: 测试Chrome浏览器
- [ ] **图片alt**: 所有图片有描述性alt或alt=""
- [ ] **表单label**: 所有输入框有关联的label
- [ ] **错误提示**: 错误信息用role="alert"标记
- [ ] **页面标题**: 每个页面有唯一的<title>
- [ ] **Landmark**: header, nav, main, footer正确使用

## 颜色对比度测试
- [ ] **正文文本**: 对比度 ≥ 4.5:1
- [ ] **大文本(18px+)**: 对比度 ≥ 3:1
- [ ] **图标和图形**: 对比度 ≥ 3:1
- [ ] **表单边框**: 对比度 ≥ 3:1
- [ ] **Focus指示器**: 对比度 ≥ 3:1

## 响应式和缩放测试
- [ ] **200%缩放**: 页面可用,无横向滚动
- [ ] **320px宽度**: 移动端最小宽度可用
- [ ] **文本间距**: 行高至少1.5倍字体大小
- [ ] **自定义字体**: 用户调整字体大小时页面仍可用

## 表单可访问性测试
- [ ] **必填字段**: 有required属性或aria-required
- [ ] **错误识别**: 错误字段有清晰的视觉和文本提示
- [ ] **错误建议**: 提供具体的修正建议
- [ ] **输入格式说明**: 复杂格式有示例说明
- [ ] **提交前确认**: 危险操作有确认对话框

## 多媒体可访问性测试
- [ ] **音频转录**: 音频内容有文本转录(核心功能)
- [ ] **自动播放**: 无自动播放音频/视频
- [ ] **媒体控制**: 音频/视频有暂停/停止控制

## 测试工具清单
- [Axe DevTools Chrome扩展](https://chrome.google.com/webstore/detail/axe-devtools/lhdoppojpmngadmnindnejefpokejbdd)
- [WAVE Chrome扩展](https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh)
- [Lighthouse (Chrome内置)](chrome://lighthouse/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [macOS VoiceOver (内置)](按Cmd+F5启动)
- [NVDA Screen Reader (Windows免费)](https://www.nvaccess.org/)
```

---

## 9.5 本章小结

设计规范阶段的核心要点:

1. **设计规范四个层次**:
   - 设计原则: 定义项目核心设计哲学(专业而不严肃、信息优先、快速响应、可访问优先)
   - 视觉风格系统: 完整的Design Token(颜色、字体、间距、阴影、圆角、动画)
   - 组件规范: 每个UI组件的视觉和交互标准,基于Shadcn/ui
   - 实施指南: Tailwind配置、组件开发工作流、验证方法

2. **视觉风格指南**:
   - 色彩心理学应用(蓝色专业、紫色AI、绿色成功、橙色警告、红色错误)
   - 图标系统(Lucide React,5种尺寸,5种颜色语义)
   - 图片和插图系统(占位图、空状态、Logo、优化策略)

3. **Shadcn/ui组件库深度定制**:
   - 完整的Shadcn/ui CLI工作流(init → add → customize)
   - TechMeet特定组合组件(UploadZone文件上传、MeetingInsights纪要展示)
   - 组件开发工作流(安装→定制→组合→验证)

4. **WCAG 2.1 AA可访问性标准**:
   - POUR原则(Perceivable感知、Operable操作、Understandable理解、Robust健壮)
   - 键盘导航完整支持(Tab/方向键/Esc/Enter)
   - 屏幕阅读器兼容(ARIA标记、语义化HTML、alt文本)
   - 颜色对比度验证(正文≥4.5:1,大文本≥3:1)
   - 完整测试清单(自动化工具+手动测试)

**关键洞察**:
> "设计规范不是束缚创造力,而是确保一致性和可访问性的系统。通过Design Token和组件库,AI(Lovable/Cursor/Claude Code)可以生成符合规范的代码,开发者可以专注于业务逻辑,而非反复调整样式。可访问性不是附加功能,而是从设计Token到组件实现的每个层级都要考虑的基础标准。"

**实践建议**:
1. **Token First**: 在写任何组件前,先定义完整的Design Token系统
2. **Shadcn/ui优先**: 优先使用Shadcn/ui基础组件,减少从零实现
3. **可访问性内建**: 在组件开发时同步考虑ARIA标记和键盘导航,而非事后补充
4. **自动化测试**: 集成axe-core到CI/CD,每次部署前自动检测可访问性问题

**下一章**: 我们将学习实施阶段(Implementation Phase)的完整工作流,包括Lovable→Cursor→Testing的系统化开发过程,AI Pair Programming最佳实践,以及代码质量保证方法。

---

**思考题**:
1. 你的项目是否有完整的Design Token系统?颜色、字体、间距是否都有明确定义?
2. 如果现在要求你的应用符合WCAG 2.1 AA标准,需要修改哪些地方?
3. 你的组件库是否支持键盘导航和屏幕阅读器?如何验证?

👉 [下一章:实施阶段](chapter10-implementation.md)
