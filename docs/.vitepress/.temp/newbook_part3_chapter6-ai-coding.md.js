import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"第六章：AI辅助编码——从规格到代码","description":"","frontmatter":{},"headers":[],"relativePath":"newbook/part3/chapter6-ai-coding.md","filePath":"newbook/part3/chapter6-ai-coding.md"}');
const _sfc_main = { name: "newbook/part3/chapter6-ai-coding.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="第六章-ai辅助编码——从规格到代码" tabindex="-1">第六章：AI辅助编码——从规格到代码 <a class="header-anchor" href="#第六章-ai辅助编码——从规格到代码" aria-label="Permalink to &quot;第六章：AI辅助编码——从规格到代码&quot;">​</a></h1><blockquote><p><strong>本章导读</strong></p><p>欢迎来到DDAD流程中最高效、最激动人心的阶段。在拥有了清晰的PRD和设计文档后，我们将亲自演示如何指挥AI，将这些“蓝图”转化为高质量、可运行的代码。本章，你将学习到DDAD的核心技巧——编写“模块规格”（Module Specs），并见证AI如何基于这些规格，以前所未有的速度和准确性完成编码、测试乃至代码审查工作。</p></blockquote><hr><h2 id="_6-1-编码的革命-从-写-代码到-生成-代码" tabindex="-1">6.1 编码的革命：从“写”代码到“生成”代码 <a class="header-anchor" href="#_6-1-编码的革命-从-写-代码到-生成-代码" aria-label="Permalink to &quot;6.1 编码的革命：从“写”代码到“生成”代码&quot;">​</a></h2><p>在传统开发中，编码阶段是整个项目中最耗时、最繁琐的环节。开发者需要逐行编写逻辑、处理异常、编写测试。</p><p>在DDAD的新范式下，开发者的角色发生了根本性转变：</p><table tabindex="0"><thead><tr><th style="${ssrRenderStyle({ "text-align": "left" })}">传统开发者</th><th style="${ssrRenderStyle({ "text-align": "left" })}">DDAD开发者 (AI时代的10x开发者)</th></tr></thead><tbody><tr><td style="${ssrRenderStyle({ "text-align": "left" })}"><strong>角色</strong>: 编码者、实现者</td><td style="${ssrRenderStyle({ "text-align": "left" })}"><strong>角色</strong>: <strong>设计者、审查者、AI指挥家</strong></td></tr><tr><td style="${ssrRenderStyle({ "text-align": "left" })}"><strong>主要工作</strong>: 手动编写代码</td><td style="${ssrRenderStyle({ "text-align": "left" })}"><strong>主要工作</strong>: 编写模块规格、审查AI生成的代码、处理复杂决策</td></tr><tr><td style="${ssrRenderStyle({ "text-align": "left" })}"><strong>效率瓶颈</strong>: 打字速度、对框架的熟悉度</td><td style="${ssrRenderStyle({ "text-align": "left" })}"><strong>效率瓶颈</strong>: <strong>思考深度、设计质量</strong></td></tr></tbody></table><p>这个转变的核心，在于我们引入了一个关键步骤：<strong>在写真正的业务代码之前，先为核心模块编写一份详细的规格说明书（Module Spec）。</strong></p><hr><h2 id="_6-2-模块规格-module-spec-给ai的-代码说明书" tabindex="-1">6.2 模块规格 (Module Spec)：给AI的“代码说明书” <a class="header-anchor" href="#_6-2-模块规格-module-spec-给ai的-代码说明书" aria-label="Permalink to &quot;6.2 模块规格 (Module Spec)：给AI的“代码说明书”&quot;">​</a></h2><p><strong>模块规格</strong>是连接“设计”与“编码”最关键的桥梁。它是一份极其详尽的技术文档，用清晰的语言定义了一个独立模块（如一个Python类或一组函数）的全部行为。</p><blockquote><p><strong>核心理念</strong>：我们不直接让AI写代码，而是先让AI（或我们自己）为每一个核心模块编写一份“代码说明书”。这份说明书将开发任务分解到了函数级别，几乎消除了编码过程中的不确定性。<strong>有了它，AI生成代码的准确率能从60%提升到95%以上。</strong></p></blockquote><h3 id="模块规格实战-intentclassifier" tabindex="-1">模块规格实战：<code>IntentClassifier</code> <a class="header-anchor" href="#模块规格实战-intentclassifier" aria-label="Permalink to &quot;模块规格实战：\`IntentClassifier\`&quot;">​</a></h3><p>让我们为智能客服Agent的核心模块之一——<code>IntentClassifier</code>（意图分类器）来编写一份模块规格。</p><p><strong><code>docs/03-development/specs/intent_classifier.md</code></strong></p><div class="language-markdown vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">markdown</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}"># 模块规格: IntentClassifier</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">## 1. 模块概述</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-light-font-weight": "bold", "--shiki-dark": "#E1E4E8", "--shiki-dark-font-weight": "bold" })}"> **职责**</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: 负责接收用户的单句输入，并将其分类到预定义的意图类型中。这是Agent理解用户需求的第一步。</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-light-font-weight": "bold", "--shiki-dark": "#E1E4E8", "--shiki-dark-font-weight": "bold" })}"> **输入**</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">\`message: str\`</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> (用户的原始文本消息)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-light-font-weight": "bold", "--shiki-dark": "#E1E4E8", "--shiki-dark-font-weight": "bold" })}"> **输出**</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">\`intent: str\`</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> (预定义的意图标签之一)</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">## 2. 支持的意图类型</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">本模块必须能够识别以下意图：</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">\`\`\`python</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">SUPPORTED_INTENTS</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}"> =</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">    &quot;query_order_status&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: </span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&quot;查询订单状态&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">,</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">    &quot;query_product_info&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: </span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&quot;查询商品信息&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">,</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">    &quot;request_return_policy&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: </span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&quot;咨询退货政策&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">,</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">    &quot;request_human_support&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: </span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&quot;请求人工客服&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">,</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">    &quot;greeting&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: </span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&quot;打招呼&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">,</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">    &quot;other&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">: </span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&quot;其他无法分类的意图&quot;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">}</span></span></code></pre></div><h2 id="_3-核心实现要求" tabindex="-1">3. 核心实现要求 <a class="header-anchor" href="#_3-核心实现要求" aria-label="Permalink to &quot;3. 核心实现要求&quot;">​</a></h2><ul><li><strong>技术方案</strong>: 必须使用大语言模型（如Claude或GPT）进行零样本（Zero-shot）分类。</li><li><strong>置信度控制</strong>: 如果模型对分类的置信度低于 <code>0.8</code>，或无法明确匹配任何意图，则必须返回 <code>&quot;other&quot;</code>。</li><li><strong>异常处理</strong>: 必须能优雅地处理API调用失败、超时等网络问题。</li></ul><h2 id="_4-接口定义-python" tabindex="-1">4. 接口定义 (Python) <a class="header-anchor" href="#_4-接口定义-python" aria-label="Permalink to &quot;4. 接口定义 (Python)&quot;">​</a></h2><p>模块必须以一个名为 <code>IntentClassifier</code> 的类实现，并包含以下方法：</p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">class</span><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}"> IntentClassifier</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">    &quot;&quot;&quot;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">    使用大语言模型对用户输入进行意图分类。</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">    &quot;&quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">    def</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}"> __init__</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">(self, api_key: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">str</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">):</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">        &quot;&quot;&quot;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">        初始化分类器，配置API密钥。</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">        &quot;&quot;&quot;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">        pass</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">    def</span><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}"> classify</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">(self, message: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">str</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">) -&gt; </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">str</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">        &quot;&quot;&quot;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">        对单条消息进行分类。</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">        :param message: 用户输入的文本消息。</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">        :return: 预定义的意图标签。</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">        &quot;&quot;&quot;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">        pass</span></span></code></pre></div><h2 id="_5-prompt工程" tabindex="-1">5. Prompt工程 <a class="header-anchor" href="#_5-prompt工程" aria-label="Permalink to &quot;5. Prompt工程&quot;">​</a></h2><p>用于分类的Prompt模板如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>你是一个专业的意图分类机器人。你的任务是分析用户输入，并将其分类到以下几种意图之一。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[支持的意图列表]</span></span>
<span class="line"><span>{{SUPPORTED_INTENTS}}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>请只返回最匹配的意图标签，不要添加任何解释。如果用户输入与所有意图都不匹配，请返回 &quot;other&quot;。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>用户输入: &quot;{{message}}&quot;</span></span>
<span class="line"><span>意图:</span></span></code></pre></div><h2 id="_6-测试用例" tabindex="-1">6. 测试用例 <a class="header-anchor" href="#_6-测试用例" aria-label="Permalink to &quot;6. 测试用例&quot;">​</a></h2><table tabindex="0"><thead><tr><th style="${ssrRenderStyle({ "text-align": "left" })}">输入消息</th><th style="${ssrRenderStyle({ "text-align": "left" })}">预期输出意图</th></tr></thead><tbody><tr><td style="${ssrRenderStyle({ "text-align": "left" })}">&quot;我的订单到哪了？&quot;</td><td style="${ssrRenderStyle({ "text-align": "left" })}"><code>query_order_status</code></td></tr><tr><td style="${ssrRenderStyle({ "text-align": "left" })}">&quot;这件衣服还有黑色的吗&quot;</td><td style="${ssrRenderStyle({ "text-align": "left" })}"><code>query_product_info</code></td></tr><tr><td style="${ssrRenderStyle({ "text-align": "left" })}">&quot;怎么退货&quot;</td><td style="${ssrRenderStyle({ "text-align": "left" })}"><code>request_return_policy</code></td></tr><tr><td style="${ssrRenderStyle({ "text-align": "left" })}">&quot;找人工&quot;</td><td style="${ssrRenderStyle({ "text-align": "left" })}"><code>request_human_support</code></td></tr><tr><td style="${ssrRenderStyle({ "text-align": "left" })}">&quot;你好&quot;</td><td style="${ssrRenderStyle({ "text-align": "left" })}"><code>greeting</code></td></tr><tr><td style="${ssrRenderStyle({ "text-align": "left" })}">&quot;今天天气怎么样&quot;</td><td style="${ssrRenderStyle({ "text-align": "left" })}"><code>other</code></td></tr></tbody></table><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>这份文档就是我们指挥AI进行编码的“剧本”。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 6.3 从规格到代码：AI驱动的核心编码</span></span>
<span class="line"><span></span></span>
<span class="line"><span>当详细的模块规格准备就绪后，编码就成了一件水到渠成的事情。我们可以使用任何支持长上下文的AI编码工具（如Cursor, Codebuddy, 或Claude CLI）来完成。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**核心指令 (Prompt):**</span></span></code></pre></div><p>请根据以下架构设计和模块规格，为 <code>src/agent/intent_classifier.py</code> 生成完整、可运行的Python代码。</p><p><strong>约束条件:</strong></p><ol><li>代码必须严格遵循模块规格中的所有要求。</li><li>使用Python 3.10+，并包含完整的类型注解。</li><li>为所有公共类和方法编写详细的Docstring。</li><li>包含完整的异常处理逻辑（如API请求失败、超时）。</li><li>在文件末尾，为<code>IntentClassifier</code>类生成基础的<code>pytest</code>单元测试代码，覆盖规格中定义的所有测试用例。</li></ol><hr><h2 id="粘贴-architecture-md-的核心内容" tabindex="-1">[粘贴 <code>architecture.md</code> 的核心内容] <a class="header-anchor" href="#粘贴-architecture-md-的核心内容" aria-label="Permalink to &quot;[粘贴 \`architecture.md\` 的核心内容]&quot;">​</a></h2><h2 id="粘贴-module-specs-intent-classifier-md-的全部内容" tabindex="-1">[粘贴 <code>module-specs/intent-classifier.md</code> 的全部内容] <a class="header-anchor" href="#粘贴-module-specs-intent-classifier-md-的全部内容" aria-label="Permalink to &quot;[粘贴 \`module-specs/intent-classifier.md\` 的全部内容]&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>**AI生成的代码 (\`src/agent/intent_classifier.py\`):**</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`python</span></span>
<span class="line"><span># src/agent/intent_classifier.py</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import os</span></span>
<span class="line"><span>import openai</span></span>
<span class="line"><span>from typing import Dict, List</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 根据模块规格定义支持的意图</span></span>
<span class="line"><span>SUPPORTED_INTENTS: Dict[str, str] = {</span></span>
<span class="line"><span>    &quot;query_order_status&quot;: &quot;查询订单状态&quot;,</span></span>
<span class="line"><span>    &quot;query_product_info&quot;: &quot;查询商品信息&quot;,</span></span>
<span class="line"><span>    &quot;request_return_policy&quot;: &quot;咨询退货政策&quot;,</span></span>
<span class="line"><span>    &quot;request_human_support&quot;: &quot;请求人工客服&quot;,</span></span>
<span class="line"><span>    &quot;greeting&quot;: &quot;打招呼&quot;,</span></span>
<span class="line"><span>    &quot;other&quot;: &quot;其他无法分类的意图&quot;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class IntentClassifier:</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span>    使用大语言模型对用户输入进行意图分类。</span></span>
<span class="line"><span>    &quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def __init__(self, api_key: str = None):</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        初始化分类器，配置API密钥。</span></span>
<span class="line"><span>        如果未提供api_key，将尝试从环境变量&#39;OPENAI_API_KEY&#39;读取。</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        self.api_key = api_key or os.getenv(&quot;OPENAI_API_KEY&quot;)</span></span>
<span class="line"><span>        if not self.api_key:</span></span>
<span class="line"><span>            raise ValueError(&quot;OpenAI API key not provided or found in environment variables.&quot;)</span></span>
<span class="line"><span>        openai.api_key = self.api_key</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def _build_prompt(self, message: str) -&gt; str:</span></span>
<span class="line"><span>        &quot;&quot;&quot;构建用于分类的Prompt。&quot;&quot;&quot;</span></span>
<span class="line"><span>        intent_list = &quot;\\n&quot;.join([f&#39;- {key}: {desc}&#39; for key, desc in SUPPORTED_INTENTS.items()])</span></span>
<span class="line"><span>        return f&quot;&quot;&quot;你是一个专业的意图分类机器人。你的任务是分析用户输入，并将其分类到以下几种意图之一。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[支持的意图列表]</span></span>
<span class="line"><span>{intent_list}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>请只返回最匹配的意图标签，不要添加任何解释。如果用户输入与所有意图都不匹配，请返回 &quot;other&quot;。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>用户输入: &quot;{message}&quot;</span></span>
<span class="line"><span>意图:&quot;&quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    def classify(self, message: str) -&gt; str:</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        对单条消息进行分类。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        :param message: 用户输入的文本消息。</span></span>
<span class="line"><span>        :return: 预定义的意图标签。</span></span>
<span class="line"><span>        &quot;&quot;&quot;</span></span>
<span class="line"><span>        prompt = self._build_prompt(message)</span></span>
<span class="line"><span>        try:</span></span>
<span class="line"><span>            response = openai.Completion.create(</span></span>
<span class="line"><span>                engine=&quot;text-davinci-003&quot;, # 或者其他合适的模型</span></span>
<span class="line"><span>                prompt=prompt,</span></span>
<span class="line"><span>                max_tokens=10,</span></span>
<span class="line"><span>                temperature=0.0,</span></span>
<span class="line"><span>                stop=[&quot;\\n&quot;]</span></span>
<span class="line"><span>            )</span></span>
<span class="line"><span>            intent = response.choices[0].text.strip()</span></span>
<span class="line"><span>            return intent if intent in SUPPORTED_INTENTS else &quot;other&quot;</span></span>
<span class="line"><span>        except openai.error.OpenAIError as e:</span></span>
<span class="line"><span>            print(f&quot;Error calling OpenAI API: {e}&quot;)</span></span>
<span class="line"><span>            return &quot;other&quot; # API调用失败时，默认为&#39;other&#39;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># --- Pytest单元测试 ---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import pytest</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@pytest.fixture</span></span>
<span class="line"><span>def classifier():</span></span>
<span class="line"><span>    # 此处需要一个有效的API密钥用于测试，或使用mock</span></span>
<span class="line"><span>    # 为避免在文档中暴露密钥，我们假设已在环境中设置</span></span>
<span class="line"><span>    if not os.getenv(&quot;OPENAI_API_KEY&quot;):</span></span>
<span class="line"><span>        pytest.skip(&quot;OPENAI_API_KEY not set, skipping integration tests.&quot;)</span></span>
<span class="line"><span>    return IntentClassifier()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@pytest.mark.parametrize(&quot;message, expected_intent&quot;, [</span></span>
<span class="line"><span>    (&quot;我的订单到哪了？&quot;, &quot;query_order_status&quot;),</span></span>
<span class="line"><span>    (&quot;这件衣服还有黑色的吗&quot;, &quot;query_product_info&quot;),</span></span>
<span class="line"><span>    (&quot;怎么退货&quot;, &quot;request_return_policy&quot;),</span></span>
<span class="line"><span>    (&quot;找人工&quot;, &quot;request_human_support&quot;),</span></span>
<span class="line"><span>    (&quot;你好&quot;, &quot;greeting&quot;),</span></span>
<span class="line"><span>    (&quot;今天天气怎么样&quot;, &quot;other&quot;),</span></span>
<span class="line"><span>])</span></span>
<span class="line"><span>def test_classify_intents(classifier, message, expected_intent, mocker):</span></span>
<span class="line"><span>    # 使用mocker来模拟API调用，避免真实的网络请求和费用</span></span>
<span class="line"><span>    mock_response = mocker.Mock()</span></span>
<span class="line"><span>    mock_response.choices = [mocker.Mock()]</span></span>
<span class="line"><span>    mock_response.choices[0].text.strip.return_value = expected_intent</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    mocker.patch(&#39;openai.Completion.create&#39;, return_value=mock_response)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    result = classifier.classify(message)</span></span>
<span class="line"><span>    assert result == expected_intent</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def test_classify_api_error(classifier, mocker):</span></span>
<span class="line"><span>    mocker.patch(&#39;openai.Completion.create&#39;, side_effect=openai.error.APIError(&quot;Test API Error&quot;))</span></span>
<span class="line"><span>    result = classifier.classify(&quot;any message&quot;)</span></span>
<span class="line"><span>    assert result == &quot;other&quot;</span></span></code></pre></div><p>这份由AI生成的代码，不仅完全实现了规格要求，还包含了专业的错误处理、Docstring，甚至连单元测试都一并生成了。开发者的工作，就是审查这份代码，确认其符合预期，然后运行测试。</p><hr><h2 id="_6-4-ai即是同事-辅助代码审查" tabindex="-1">6.4 AI即是同事：辅助代码审查 <a class="header-anchor" href="#_6-4-ai即是同事-辅助代码审查" aria-label="Permalink to &quot;6.4 AI即是同事：辅助代码审查&quot;">​</a></h2><p>AI不仅能写代码，还能像一位资深同事一样审查代码，帮助我们发现潜在问题。</p><p><strong>指令 (Prompt):</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>请以高级工程师的视角，审查以下Python代码。重点关注：</span></span>
<span class="line"><span>1.  潜在的性能问题。</span></span>
<span class="line"><span>2.  不符合Python最佳实践的地方。</span></span>
<span class="line"><span>3.  可以改进的可读性或可维护性。</span></span>
<span class="line"><span>4.  安全漏洞。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>请给出具体的修改建议和代码示例。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span>[粘贴 \`src/agent/intent_classifier.py\` 的代码]</span></span>
<span class="line"><span>---</span></span></code></pre></div><p><strong>AI可能的审查意见:</strong></p><blockquote><p><strong>审查报告: <code>intent_classifier.py</code></strong></p><p>整体代码质量不错，但有几点可以改进：</p><ol><li><p><strong>性能问题</strong>: <code>classify</code>方法每次调用都会向OpenAI发起一次网络请求。如果需要批量处理消息，这会非常低效。</p><ul><li><strong>建议</strong>: 增加一个<code>classify_batch</code>方法，将多个消息打包在一次请求中处理，或并行发起请求。</li></ul></li><li><p><strong>可维护性</strong>: 模型名称<code>&quot;text-davinci-003&quot;</code>硬编码在代码中。如果未来需要更换模型，需要修改代码。</p><ul><li><strong>建议</strong>: 将模型名称作为<code>__init__</code>的一个可选参数，或放在配置文件中。</li></ul></li><li><p><strong>最佳实践</strong>: <code>__init__</code>方法中直接执行<code>openai.api_key = self.api_key</code>会影响全局的<code>openai</code>对象，这在大型应用中可能导致副作用。</p><ul><li><strong>建议</strong>: 在每次API调用时，通过<code>openai.Completion.create(..., api_key=self.api_key)</code>来传递密钥，而不是设置全局密钥。</li></ul></li></ol><p><strong>重构后的代码示例:</strong></p><div class="language-python vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">python</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">class</span><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}"> IntentClassifier</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">    def</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}"> __init__</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">(self, api_key: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">str</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}"> =</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}"> None</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">, model: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">str</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}"> =</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}"> &quot;text-davinci-003&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">):</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">        # ...</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">        self</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">.model </span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">=</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> model</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">    def</span><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}"> classify</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">(self, message: </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">str</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">) -&gt; </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">str</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">        # ...</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">        try</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">            response </span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">=</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> openai.Completion.create(</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">                engine</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">=</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">self</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">.model,</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">                prompt</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">=</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">prompt,</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">                api_key</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">=</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">self</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">.api_key, </span><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}"># 传递密钥而非全局设置</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">                # ...</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">            )</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">            # ...</span></span></code></pre></div></blockquote><hr><h2 id="_6-5-本章小结" tabindex="-1">6.5 本章小结 <a class="header-anchor" href="#_6-5-本章小结" aria-label="Permalink to &quot;6.5 本章小结&quot;">​</a></h2><p>本章，我们完整地实践了DDAD开发阶段的核心流程：</p><ol><li><strong>定义规格 (Spec)</strong>: 我们没有直接开始编码，而是先为<code>IntentClassifier</code>模块编写了一份详细的说明书。</li><li><strong>生成代码 (Generate)</strong>: 基于这份说明书，我们指挥AI生成了功能完整、包含测试的高质量代码。</li><li><strong>审查与重构 (Review &amp; Refactor)</strong>: 我们利用AI作为“代码审查员”，发现了潜在的改进点，并完成了代码的优化。</li></ol><p>在这个过程中，开发者的价值得到了极大的提升。我们不再是代码的“搬运工”，而是系统的“设计师”和质量的“把关人”。通过为AI提供清晰、无歧义的指令（模块规格），我们将开发效率提升了数倍。</p><p><strong>下一章</strong>，我们将继续沿着这条高效的路径，完成智能客服Agent后端服务的其他核心模块，并最终将它们集成在一起。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("newbook/part3/chapter6-ai-coding.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const chapter6AiCoding = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  chapter6AiCoding as default
};
