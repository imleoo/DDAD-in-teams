import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"第七章：后端服务开发实战","description":"","frontmatter":{},"headers":[],"relativePath":"newbook/part3/chapter7-backend-development.md","filePath":"newbook/part3/chapter7-backend-development.md"}');
const _sfc_main = { name: "newbook/part3/chapter7-backend-development.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="第七章-后端服务开发实战" tabindex="-1">第七章：后端服务开发实战 <a class="header-anchor" href="#第七章-后端服务开发实战" aria-label="Permalink to &quot;第七章：后端服务开发实战&quot;">​</a></h1><blockquote><p><strong>本章导读</strong></p><p>在上一章，我们成功创建了第一个核心模块<code>IntentClassifier</code>。本章，我们将乘胜追击，运用同样的DDAD流程，完成智能客服Agent后端服务的其余核心模块：知识库检索器（Knowledge Retriever）和对话管理器（Dialog Manager）。最终，我们会将所有模块组装起来，构建一个完整、可工作的FastAPI应用。</p></blockquote><hr><h2 id="_7-1-项目初始化与技术栈落地" tabindex="-1">7.1 项目初始化与技术栈落地 <a class="header-anchor" href="#_7-1-项目初始化与技术栈落地" aria-label="Permalink to &quot;7.1 项目初始化与技术栈落地&quot;">​</a></h2><p>根据我们在PRD中定义的技术架构，我们将使用Python的FastAPI框架来构建后端服务。</p><h3 id="_7-1-1-项目结构" tabindex="-1">7.1.1 项目结构 <a class="header-anchor" href="#_7-1-1-项目结构" aria-label="Permalink to &quot;7.1.1 项目结构&quot;">​</a></h3><p>一个良好的项目结构是可维护性的基础。我们为Agent服务定义如下结构：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>customer-mind-api/</span></span>
<span class="line"><span>├── src/</span></span>
<span class="line"><span>│   ├── agent/</span></span>
<span class="line"><span>│   │   ├── __init__.py</span></span>
<span class="line"><span>│   │   ├── intent_classifier.py    # 意图分类器 (已完成)</span></span>
<span class="line"><span>│   │   ├── knowledge_retriever.py  # 知识库检索器</span></span>
<span class="line"><span>│   │   └── dialog_manager.py       # 对话管理器</span></span>
<span class="line"><span>│   ├── api/</span></span>
<span class="line"><span>│   │   ├── __init__.py</span></span>
<span class="line"><span>│   │   └── endpoints.py            # API端点</span></span>
<span class="line"><span>│   ├── core/</span></span>
<span class="line"><span>│   │   ├── __init__.py</span></span>
<span class="line"><span>│   │   └── config.py               # 配置管理</span></span>
<span class="line"><span>│   └── main.py                     # FastAPI应用入口</span></span>
<span class="line"><span>├── docs/</span></span>
<span class="line"><span>│   ├── 01-requirements/</span></span>
<span class="line"><span>│   ├── 02-design/</span></span>
<span class="line"><span>│   └── 03-development/</span></span>
<span class="line"><span>│       └── specs/                  # 存放所有模块规格文档</span></span>
<span class="line"><span>├── tests/</span></span>
<span class="line"><span>│   └── ...</span></span>
<span class="line"><span>├── .env                            # 环境变量</span></span>
<span class="line"><span>└── requirements.txt                # Python依赖</span></span></code></pre></div><h3 id="_7-1-2-ai辅助初始化" tabindex="-1">7.1.2 AI辅助初始化 <a class="header-anchor" href="#_7-1-2-ai辅助初始化" aria-label="Permalink to &quot;7.1.2 AI辅助初始化&quot;">​</a></h3><p>我们可以让AI帮助我们快速生成项目的基础设施代码。</p><p><strong>指令 (Prompt):</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>请为一个基于FastAPI的Python项目生成初始化文件。</span></span>
<span class="line"><span>项目结构如上。</span></span>
<span class="line"><span>- \`main.py\`需要包含FastAPI应用的基本设置。</span></span>
<span class="line"><span>- \`core/config.py\`需要使用Pydantic来管理环境变量（如OPENAI_API_KEY, DATABASE_URL）。</span></span>
<span class="line"><span>- \`api/endpoints.py\`需要包含一个健康的检查端点\`/health\`。</span></span>
<span class="line"><span>- \`requirements.txt\`需要包含\`fastapi\`, \`uvicorn\`, \`pydantic\`, \`openai\`。</span></span></code></pre></div><p>这个指令可以在几秒钟内为我们搭建好整个项目的骨架，让我们能立刻专注于业务逻辑的开发。</p><hr><h2 id="_7-2-核心模块二-知识库检索器-knowledge-retriever" tabindex="-1">7.2 核心模块二：知识库检索器 (Knowledge Retriever) <a class="header-anchor" href="#_7-2-核心模块二-知识库检索器-knowledge-retriever" aria-label="Permalink to &quot;7.2 核心模块二：知识库检索器 (Knowledge Retriever)&quot;">​</a></h2><p>此模块的职责是根据用户问题，从我们的知识库（向量数据库）中检索最相关的信息。</p><h3 id="_7-2-1-模块规格-module-spec" tabindex="-1">7.2.1 模块规格 (Module Spec) <a class="header-anchor" href="#_7-2-1-模块规格-module-spec" aria-label="Permalink to &quot;7.2.1 模块规格 (Module Spec)&quot;">​</a></h3><p><strong><code>docs/03-development/specs/knowledge_retriever.md</code></strong></p><div class="language-markdown vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">markdown</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}"># 模块规格: KnowledgeRetriever</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">## 1. 模块概述</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-light-font-weight": "bold", "--shiki-dark": "#E1E4E8", "--shiki-dark-font-weight": "bold" })}"> **职责**</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: 将用户问题转化为向量，并在向量数据库中搜索最相关的知识片段，为AI生成答案提供上下文。</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-light-font-weight": "bold", "--shiki-dark": "#E1E4E8", "--shiki-dark-font-weight": "bold" })}"> **输入**</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">\`query: str\`</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> (用户的问题)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-light-font-weight": "bold", "--shiki-dark": "#E1E4E8", "--shiki-dark-font-weight": "bold" })}"> **输出**</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">\`List[str]\`</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> (一个包含N个最相关知识文本片段的列表)</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">## 2. 核心实现要求</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-light-font-weight": "bold", "--shiki-dark": "#E1E4E8", "--shiki-dark-font-weight": "bold" })}"> **向量化**</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: 使用OpenAI的Embedding API (</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">\`text-embedding-ada-002\`</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">模型)将文本转换为向量。</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-light-font-weight": "bold", "--shiki-dark": "#E1E4E8", "--shiki-dark-font-weight": "bold" })}"> **数据库**</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: 使用Supabase的pgvector扩展进行向量存储和相似度搜索。</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-light-font-weight": "bold", "--shiki-dark": "#E1E4E8", "--shiki-dark-font-weight": "bold" })}"> **检索逻辑**</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: 返回相似度最高的Top 3个知识片段。</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-light-font-weight": "bold", "--shiki-dark": "#E1E4E8", "--shiki-dark-font-weight": "bold" })}"> **空结果处理**</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: 如果未检索到任何相关内容（或相似度低于阈值0.75），返回空列表。</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">## 3. 接口定义 (Python)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">\`\`\`python</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">class</span><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}"> KnowledgeRetriever</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">    def</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}"> __init__</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">(self, supabase_url: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">str</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">, supabase_key: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">str</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">):</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">        &quot;&quot;&quot;初始化，连接到Supabase。&quot;&quot;&quot;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">        pass</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">    def</span><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}"> retrieve</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">(self, query: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">str</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">, top_k: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">int</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}"> =</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}"> 3</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">) -&gt; List[</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">str</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">]:</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">        &quot;&quot;&quot;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">        根据查询检索知识。</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">        :param query: 用户问题。</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">        :param top_k: 返回最相关的片段数量。</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">        :return: 相关知识文本列表。</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">        &quot;&quot;&quot;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">        pass</span></span></code></pre></div><h2 id="_4-测试用例" tabindex="-1">4. 测试用例 <a class="header-anchor" href="#_4-测试用例" aria-label="Permalink to &quot;4. 测试用例&quot;">​</a></h2><table tabindex="0"><thead><tr><th style="${ssrRenderStyle({ "text-align": "left" })}">输入查询</th><th style="${ssrRenderStyle({ "text-align": "left" })}">预期输出 (包含片段)</th></tr></thead><tbody><tr><td style="${ssrRenderStyle({ "text-align": "left" })}">&quot;退货流程是怎样的？&quot;</td><td style="${ssrRenderStyle({ "text-align": "left" })}">包含&quot;7天无理由退货&quot;、&quot;联系客服申请&quot;等文本</td></tr><tr><td style="${ssrRenderStyle({ "text-align": "left" })}">&quot;这件T恤是什么材质&quot;</td><td style="${ssrRenderStyle({ "text-align": "left" })}">包含&quot;100%纯棉&quot;、&quot;透气性好&quot;等文本</td></tr><tr><td style="${ssrRenderStyle({ "text-align": "left" })}">&quot;今天天气如何&quot;</td><td style="${ssrRenderStyle({ "text-align": "left" })}"><code>[]</code> (空列表)</td></tr></tbody></table><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>### 7.2.2 AI生成代码</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**指令 (Prompt):**</span></span></code></pre></div><p>请根据以下模块规格，为<code>src/agent/knowledge_retriever.py</code>生成完整代码。</p><ul><li>使用<code>supabase-py</code>库与Supabase交互。</li><li>包含完整的类型注解、Docstring和异常处理。</li><li>向量搜索需要调用Supabase的RPC函数来实现。</li><li>在文件末尾提供<code>pytest</code>单元测试的框架。</li></ul><hr><h2 id="粘贴-knowledge-retriever-md-的全部内容" tabindex="-1">[粘贴 <code>knowledge_retriever.md</code> 的全部内容] <a class="header-anchor" href="#粘贴-knowledge-retriever-md-的全部内容" aria-label="Permalink to &quot;[粘贴 \`knowledge_retriever.md\` 的全部内容]&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>AI将生成包含Supabase客户端初始化、文本向量化、调用远程过程（RPC）进行向量搜索等功能的完整代码。开发者的工作是审查代码逻辑，并填入真实的Supabase连接信息。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 7.3 核心模块三：对话管理器 (Dialog Manager)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>对话管理器是整个Agent的大脑，它负责编排其他模块，决定每一步该做什么。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 7.3.1 模块规格 (Module Spec)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**\`docs/03-development/specs/dialog_manager.py\`**</span></span>
<span class="line"><span>\`\`\`markdown</span></span>
<span class="line"><span># 模块规格: DialogManager</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 1. 模块概述</span></span>
<span class="line"><span>- **职责**: 作为Agent的核心控制器，接收用户消息，调度\`IntentClassifier\`和\`KnowledgeRetriever\`，并最终生成回复。</span></span>
<span class="line"><span>- **输入**: \`session_id: str\`, \`message: str\`</span></span>
<span class="line"><span>- **输出**: \`response: str\` (给用户的最终回复)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 2. 核心工作流</span></span>
<span class="line"><span>1.  接收用户消息。</span></span>
<span class="line"><span>2.  调用\`IntentClassifier\`判断用户意图。</span></span>
<span class="line"><span>3.  **分支逻辑**:</span></span>
<span class="line"><span>    -   如果意图是\`query_*\` (查询类):</span></span>
<span class="line"><span>        a. 调用\`KnowledgeRetriever\`检索相关知识。</span></span>
<span class="line"><span>        b. 构建一个包含【用户问题】和【相关知识】的Prompt。</span></span>
<span class="line"><span>        c. 调用LLM（大型语言模型）生成答案。</span></span>
<span class="line"><span>    -   如果意图是\`request_human_support\`:</span></span>
<span class="line"><span>        a. 返回固定话术，如“好的，正在为您转接人工客服。”</span></span>
<span class="line"><span>        b. 触发转人工流程（调用外部接口）。</span></span>
<span class="line"><span>    -   如果意图是\`greeting\`:</span></span>
<span class="line"><span>        a. 返回友好的问候语。</span></span>
<span class="line"><span>    -   如果意图是\`other\`:</span></span>
<span class="line"><span>        a. 返回“抱歉，我暂时无法理解您的问题，您可以换个方式提问，或输入‘人工客服’。”</span></span>
<span class="line"><span>4.  记录对话历史（用户消息和Agent回复）。</span></span>
<span class="line"><span>5.  返回最终回复。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 3. 接口定义 (Python)</span></span>
<span class="line"><span>\`\`\`python</span></span>
<span class="line"><span>class DialogManager:</span></span>
<span class="line"><span>    def __init__(self, classifier: IntentClassifier, retriever: KnowledgeRetriever):</span></span>
<span class="line"><span>        &quot;&quot;&quot;注入依赖的模块。&quot;&quot;&quot;</span></span>
<span class="line"><span>        pass</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def handle_message(self, session_id: str, message: str) -&gt; str:</span></span>
<span class="line"><span>        &quot;&quot;&quot;处理单条用户消息，并返回回复。&quot;&quot;&quot;</span></span>
<span class="line"><span>        pass</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>### 7.3.2 AI生成代码</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**指令 (Prompt):**</span></span></code></pre></div><p>请根据以下模块规格，为<code>src/agent/dialog_manager.py</code>生成完整代码。</p><ul><li>注入<code>IntentClassifier</code>和<code>KnowledgeRetriever</code>实例。</li><li>实现规格中定义的完整工作流和分支逻辑。</li><li>对话历史可以暂时用一个内存中的字典来模拟。</li></ul><hr><h2 id="粘贴-dialog-manager-md-的全部内容" tabindex="-1">[粘贴 <code>dialog_manager.md</code> 的全部内容] <a class="header-anchor" href="#粘贴-dialog-manager-md-的全部内容" aria-label="Permalink to &quot;[粘贴 \`dialog_manager.md\` 的全部内容]&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>AI生成的\`DialogManager\`将清晰地展示整个系统的控制流程。代码审查的重点在于确认分支逻辑是否正确、Prompt构建是否合理、以及依赖注入是否正确实现。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 7.4 组装与API暴露</span></span>
<span class="line"><span></span></span>
<span class="line"><span>现在，我们拥有了所有核心模块。最后一步是将它们在FastAPI应用中组装起来，并通过API端点暴露服务。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**\`src/main.py\` (部分代码):**</span></span>
<span class="line"><span>\`\`\`python</span></span>
<span class="line"><span>from fastapi import FastAPI</span></span>
<span class="line"><span>from .core.config import settings</span></span>
<span class="line"><span>from .agent.intent_classifier import IntentClassifier</span></span>
<span class="line"><span>from .agent.knowledge_retriever import KnowledgeRetriever</span></span>
<span class="line"><span>from .agent.dialog_manager import DialogManager</span></span>
<span class="line"><span></span></span>
<span class="line"><span># --- 1. 初始化应用和核心模块 ---</span></span>
<span class="line"><span>app = FastAPI()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>classifier = IntentClassifier(api_key=settings.OPENAI_API_KEY)</span></span>
<span class="line"><span>retriever = KnowledgeRetriever(</span></span>
<span class="line"><span>    supabase_url=settings.SUPABASE_URL,</span></span>
<span class="line"><span>    supabase_key=settings.SUPABASE_KEY</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>dialog_manager = DialogManager(classifier=classifier, retriever=retriever)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># --- 2. 定义API请求和响应模型 ---</span></span>
<span class="line"><span>from pydantic import BaseModel</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class ChatRequest(BaseModel):</span></span>
<span class="line"><span>    session_id: str</span></span>
<span class="line"><span>    message: str</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class ChatResponse(BaseModel):</span></span>
<span class="line"><span>    response: str</span></span>
<span class="line"><span></span></span>
<span class="line"><span># --- 3. 创建API端点 ---</span></span>
<span class="line"><span>@app.post(&quot;/api/v1/chat&quot;, response_model=ChatResponse)</span></span>
<span class="line"><span>async def chat_endpoint(request: ChatRequest):</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span>    接收用户消息，并返回Agent的回复。</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span>    # 调用对话管理器处理消息</span></span>
<span class="line"><span>    response_text = dialog_manager.handle_message(</span></span>
<span class="line"><span>        session_id=request.session_id,</span></span>
<span class="line"><span>        message=request.message</span></span>
<span class="line"><span>    )</span></span>
<span class="line"><span>    return ChatResponse(response=response_text)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@app.get(&quot;/health&quot;)</span></span>
<span class="line"><span>async def health_check():</span></span>
<span class="line"><span>    return {&quot;status&quot;: &quot;ok&quot;}</span></span></code></pre></div><p>这段代码的编写同样可以由AI辅助完成。我们只需向AI提供所有模块的接口定义，并告诉它我们的目标：创建一个FastAPI端点<code>/api/v1/chat</code>，它接收<code>ChatRequest</code>，调用<code>DialogManager</code>，并返回<code>ChatResponse</code>。</p><hr><h2 id="_7-5-本章小结" tabindex="-1">7.5 本章小结 <a class="header-anchor" href="#_7-5-本章小结" aria-label="Permalink to &quot;7.5 本章小结&quot;">​</a></h2><p>通过本章的实践，我们体验了DDAD在后端开发中的强大威力：</p><ol><li><strong>分而治之</strong>: 复杂的Agent系统被拆解为三个独立的、职责清晰的模块。</li><li><strong>规格驱动</strong>: 每个模块的开发都始于一份详尽的规格文档，这为AI高质量地生成代码奠定了基础。</li><li><strong>高效集成</strong>: 清晰的接口定义使得最后将所有模块组装在一起的过程变得简单而直接。</li></ol><p>我们没有花费大量时间在编写模板代码或基础逻辑上，而是将精力集中在<strong>设计模块职责、定义工作流程和审查AI生成的代码</strong>上。这正是AI时代后端开发的核心变化。</p><p><strong>下一章</strong>，我们将探讨如何为这个系统构建一个简单的前端界面，并完成端到端的测试与部署，让我们的智能客服Agent真正上线服务。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("newbook/part3/chapter7-backend-development.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const chapter7BackendDevelopment = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  chapter7BackendDevelopment as default
};
