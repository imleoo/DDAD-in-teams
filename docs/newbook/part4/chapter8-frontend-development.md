# 第八章：前端开发与集成

> **本章导读**
>
> 我们的智能客服Agent后端服务已经准备就绪，但它还需要一个用户界面才能与真实用户交互。本章，我们将快速构建一个简约而实用的前端应用，并将其与后端API集成。你将看到，在DDAD流程中，前端开发同样可以被AI极大地加速。

---

## 8.1 前端技术选型与快速原型

对于一个以功能验证为核心的MVP，前端的目标是**快速、简洁、可用**。我们遵循在PRD中定义的技术栈。

- **框架**: React (使用Next.js或Vite)
- **UI组件库**: Shadcn/ui + Tailwind CSS
- **状态管理**: Zustand 或 React Context
- **数据请求**: React Query

### AI辅助原型设计 (v0.dev)

在动手编码前，我们可以使用AI UI生成工具（如Vercel的v0.dev）来快速生成界面原型。

**指令 (Prompt for v0.dev):**
```
Create a chat interface component. It should have:
1. A scrollable message area displaying user and bot messages. User messages are on the right, bot messages are on the left.
2. A text input field at the bottom with a "Send" button.
3. The component should be built with React, TypeScript, and Tailwind CSS.
```

v0.dev可以在几分钟内生成一个高质量的React组件代码，我们可以直接将其复制到项目中作为起点，这能节省数小时的UI布局和样式编写时间。

---

## 8.2 核心组件开发

我们的前端应用主要由几个核心组件构成。

### 8.2.1 `ChatInterface` 组件

这是用户交互的核心。AI生成的代码为我们提供了良好的基础，我们只需在此之上添加业务逻辑。

**`src/components/ChatInterface.tsx` (关键逻辑):**
```typescript
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

// API调用函数
const sendMessageToServer = async (message: string) => {
    const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: 'session_123', message }),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export function ChatInterface() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const mutation = useMutation({
        mutationFn: sendMessageToServer,
        onSuccess: (data) => {
            // 将机器人的回复添加到消息列表
            setMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
        },
        onError: (error) => {
            setMessages(prev => [...prev, { sender: 'bot', text: '抱歉，服务暂时无法连接。' }]);
        }
    });

    const handleSend = () => {
        if (input.trim()) {
            // 将用户消息添加到列表
            setMessages(prev => [...prev, { sender: 'user', text: input }]);
            // 调用API
            mutation.mutate(input);
            setInput('');
        }
    };

    // ... JSX for rendering messages and input form ...
}
```
**DDAD价值**:
- **API契约驱动**: 前端开发无需等待后端完成。只要`api-spec.md`文档确定，前端就可以基于这份“契约”进行开发，甚至可以Mock API响应来进行独立测试。
- **AI辅助逻辑**: 我们可以让AI辅助编写`sendMessageToServer`函数，或使用React Query处理API请求的加载、成功、失败状态。

---

## 8.3 与后端API集成

前后端的顺畅集成是项目成功的关键。

### 8.3.1 API客户端

我们可以让AI根据`api-spec.md`自动生成一个类型安全的API客户端。

**指令 (Prompt):**
```
请根据以下OpenAPI 3.0规格，使用TypeScript和fetch API生成一个API客户端。

---
[粘贴 `api-spec.md` 的内容]
---
```
AI将生成一个包含所有端点、请求/响应类型定义的`apiClient.ts`文件，前端可以直接导入并使用，极大地减少了手动编写API调用代码的工作量和出错率。

### 8.3.2 跨域问题 (CORS)

在开发环境中，前后端通常运行在不同端口上，会遇到跨域问题。我们需要在FastAPI后端进行配置。

**`src/main.py` (CORS配置):**
```python
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ... 其他代码 ...

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # 允许的前端地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ... API端点 ...
```
**DDAD价值**: 这个问题是开发中的常见问题。我们可以将解决方案记录在`docs/03-development/troubleshooting.md`中，当团队新成员遇到同样问题时，AI或人类开发者可以快速查阅并解决，这就是知识传承的力量。

---

## 8.4 本章小结

在本章中，我们快速构建并集成了一个前端应用。DDAD和AI工具在其中发挥了巨大作用：
1.  **快速原型**: 使用v0.dev等工具，将UI设计时间从数小时缩短到几分钟。
2.  **契约驱动开发**: 基于API规格，前后端可以完全并行开发，互不阻塞。
3.  **代码自动生成**: AI可以根据API规格自动生成类型安全的客户端代码。
4.  **知识沉淀**: 将开发中遇到的问题（如CORS）记录为文档，形成可复用的知识库。

现在，我们拥有了一个可以实际操作的、端到端的产品雏形。用户可以在界面上输入问题，并从后端获得AI生成的答案。

**下一章**，我们将为这个系统建立坚实的质量防线——编写单元测试、集成测试和端到端测试，确保我们的Agent稳定、可靠。