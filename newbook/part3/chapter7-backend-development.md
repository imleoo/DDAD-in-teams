# 第七章：后端服务开发实战

> **本章导读**
>
> 在上一章，我们成功创建了第一个核心模块`IntentClassifier`。本章，我们将乘胜追击，运用同样的DDAD流程，完成智能客服Agent后端服务的其余核心模块：知识库检索器（Knowledge Retriever）和对话管理器（Dialog Manager）。最终，我们会将所有模块组装起来，构建一个完整、可工作的FastAPI应用。

---

## 7.1 项目初始化与技术栈落地

根据我们在PRD中定义的技术架构，我们将使用Python的FastAPI框架来构建后端服务。

### 7.1.1 项目结构

一个良好的项目结构是可维护性的基础。我们为Agent服务定义如下结构：

```
customer-mind-api/
├── src/
│   ├── agent/
│   │   ├── __init__.py
│   │   ├── intent_classifier.py    # 意图分类器 (已完成)
│   │   ├── knowledge_retriever.py  # 知识库检索器
│   │   └── dialog_manager.py       # 对话管理器
│   ├── api/
│   │   ├── __init__.py
│   │   └── endpoints.py            # API端点
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py               # 配置管理
│   └── main.py                     # FastAPI应用入口
├── docs/
│   ├── 01-requirements/
│   ├── 02-design/
│   └── 03-development/
│       └── specs/                  # 存放所有模块规格文档
├── tests/
│   └── ...
├── .env                            # 环境变量
└── requirements.txt                # Python依赖
```

### 7.1.2 AI辅助初始化

我们可以让AI帮助我们快速生成项目的基础设施代码。

**指令 (Prompt):**
```
请为一个基于FastAPI的Python项目生成初始化文件。
项目结构如上。
- `main.py`需要包含FastAPI应用的基本设置。
- `core/config.py`需要使用Pydantic来管理环境变量（如OPENAI_API_KEY, DATABASE_URL）。
- `api/endpoints.py`需要包含一个健康的检查端点`/health`。
- `requirements.txt`需要包含`fastapi`, `uvicorn`, `pydantic`, `openai`。
```

这个指令可以在几秒钟内为我们搭建好整个项目的骨架，让我们能立刻专注于业务逻辑的开发。

---

## 7.2 核心模块二：知识库检索器 (Knowledge Retriever)

此模块的职责是根据用户问题，从我们的知识库（向量数据库）中检索最相关的信息。

### 7.2.1 模块规格 (Module Spec)

**`docs/03-development/specs/knowledge_retriever.md`**
```markdown
# 模块规格: KnowledgeRetriever

## 1. 模块概述
- **职责**: 将用户问题转化为向量，并在向量数据库中搜索最相关的知识片段，为AI生成答案提供上下文。
- **输入**: `query: str` (用户的问题)
- **输出**: `List[str]` (一个包含N个最相关知识文本片段的列表)

## 2. 核心实现要求
- **向量化**: 使用OpenAI的Embedding API (`text-embedding-ada-002`模型)将文本转换为向量。
- **数据库**: 使用Supabase的pgvector扩展进行向量存储和相似度搜索。
- **检索逻辑**: 返回相似度最高的Top 3个知识片段。
- **空结果处理**: 如果未检索到任何相关内容（或相似度低于阈值0.75），返回空列表。

## 3. 接口定义 (Python)
```python
class KnowledgeRetriever:
    def __init__(self, supabase_url: str, supabase_key: str):
        """初始化，连接到Supabase。"""
        pass

    def retrieve(self, query: str, top_k: int = 3) -> List[str]:
        """
        根据查询检索知识。
        :param query: 用户问题。
        :param top_k: 返回最相关的片段数量。
        :return: 相关知识文本列表。
        """
        pass
```

## 4. 测试用例
| 输入查询 | 预期输出 (包含片段) |
|:---|:---|
| "退货流程是怎样的？" | 包含"7天无理由退货"、"联系客服申请"等文本 |
| "这件T恤是什么材质" | 包含"100%纯棉"、"透气性好"等文本 |
| "今天天气如何" | `[]` (空列表) |
```

### 7.2.2 AI生成代码

**指令 (Prompt):**
```
请根据以下模块规格，为`src/agent/knowledge_retriever.py`生成完整代码。
- 使用`supabase-py`库与Supabase交互。
- 包含完整的类型注解、Docstring和异常处理。
- 向量搜索需要调用Supabase的RPC函数来实现。
- 在文件末尾提供`pytest`单元测试的框架。

---
[粘贴 `knowledge_retriever.md` 的全部内容]
---
```

AI将生成包含Supabase客户端初始化、文本向量化、调用远程过程（RPC）进行向量搜索等功能的完整代码。开发者的工作是审查代码逻辑，并填入真实的Supabase连接信息。

---

## 7.3 核心模块三：对话管理器 (Dialog Manager)

对话管理器是整个Agent的大脑，它负责编排其他模块，决定每一步该做什么。

### 7.3.1 模块规格 (Module Spec)

**`docs/03-development/specs/dialog_manager.py`**
```markdown
# 模块规格: DialogManager

## 1. 模块概述
- **职责**: 作为Agent的核心控制器，接收用户消息，调度`IntentClassifier`和`KnowledgeRetriever`，并最终生成回复。
- **输入**: `session_id: str`, `message: str`
- **输出**: `response: str` (给用户的最终回复)

## 2. 核心工作流
1.  接收用户消息。
2.  调用`IntentClassifier`判断用户意图。
3.  **分支逻辑**:
    -   如果意图是`query_*` (查询类):
        a. 调用`KnowledgeRetriever`检索相关知识。
        b. 构建一个包含【用户问题】和【相关知识】的Prompt。
        c. 调用LLM（大型语言模型）生成答案。
    -   如果意图是`request_human_support`:
        a. 返回固定话术，如“好的，正在为您转接人工客服。”
        b. 触发转人工流程（调用外部接口）。
    -   如果意图是`greeting`:
        a. 返回友好的问候语。
    -   如果意图是`other`:
        a. 返回“抱歉，我暂时无法理解您的问题，您可以换个方式提问，或输入‘人工客服’。”
4.  记录对话历史（用户消息和Agent回复）。
5.  返回最终回复。

## 3. 接口定义 (Python)
```python
class DialogManager:
    def __init__(self, classifier: IntentClassifier, retriever: KnowledgeRetriever):
        """注入依赖的模块。"""
        pass

    def handle_message(self, session_id: str, message: str) -> str:
        """处理单条用户消息，并返回回复。"""
        pass
```
```

### 7.3.2 AI生成代码

**指令 (Prompt):**
```
请根据以下模块规格，为`src/agent/dialog_manager.py`生成完整代码。
- 注入`IntentClassifier`和`KnowledgeRetriever`实例。
- 实现规格中定义的完整工作流和分支逻辑。
- 对话历史可以暂时用一个内存中的字典来模拟。

---
[粘贴 `dialog_manager.md` 的全部内容]
---
```

AI生成的`DialogManager`将清晰地展示整个系统的控制流程。代码审查的重点在于确认分支逻辑是否正确、Prompt构建是否合理、以及依赖注入是否正确实现。

---

## 7.4 组装与API暴露

现在，我们拥有了所有核心模块。最后一步是将它们在FastAPI应用中组装起来，并通过API端点暴露服务。

**`src/main.py` (部分代码):**
```python
from fastapi import FastAPI
from .core.config import settings
from .agent.intent_classifier import IntentClassifier
from .agent.knowledge_retriever import KnowledgeRetriever
from .agent.dialog_manager import DialogManager

# --- 1. 初始化应用和核心模块 ---
app = FastAPI()

classifier = IntentClassifier(api_key=settings.OPENAI_API_KEY)
retriever = KnowledgeRetriever(
    supabase_url=settings.SUPABASE_URL,
    supabase_key=settings.SUPABASE_KEY
)
dialog_manager = DialogManager(classifier=classifier, retriever=retriever)

# --- 2. 定义API请求和响应模型 ---
from pydantic import BaseModel

class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    response: str

# --- 3. 创建API端点 ---
@app.post("/api/v1/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    接收用户消息，并返回Agent的回复。
    """
    # 调用对话管理器处理消息
    response_text = dialog_manager.handle_message(
        session_id=request.session_id,
        message=request.message
    )
    return ChatResponse(response=response_text)

@app.get("/health")
async def health_check():
    return {"status": "ok"}
```

这段代码的编写同样可以由AI辅助完成。我们只需向AI提供所有模块的接口定义，并告诉它我们的目标：创建一个FastAPI端点`/api/v1/chat`，它接收`ChatRequest`，调用`DialogManager`，并返回`ChatResponse`。

---

## 7.5 本章小结

通过本章的实践，我们体验了DDAD在后端开发中的强大威力：
1.  **分而治之**: 复杂的Agent系统被拆解为三个独立的、职责清晰的模块。
2.  **规格驱动**: 每个模块的开发都始于一份详尽的规格文档，这为AI高质量地生成代码奠定了基础。
3.  **高效集成**: 清晰的接口定义使得最后将所有模块组装在一起的过程变得简单而直接。

我们没有花费大量时间在编写模板代码或基础逻辑上，而是将精力集中在**设计模块职责、定义工作流程和审查AI生成的代码**上。这正是AI时代后端开发的核心变化。

**下一章**，我们将探讨如何为这个系统构建一个简单的前端界面，并完成端到端的测试与部署，让我们的智能客服Agent真正上线服务。