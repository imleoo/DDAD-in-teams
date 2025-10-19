import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"第七章：实用资源与模板","description":"","frontmatter":{},"headers":[],"relativePath":"ddad-in-teams/chapter7.md","filePath":"ddad-in-teams/chapter7.md"}');
const _sfc_main = { name: "ddad-in-teams/chapter7.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="第七章-实用资源与模板" tabindex="-1">第七章：实用资源与模板 <a class="header-anchor" href="#第七章-实用资源与模板" aria-label="Permalink to &quot;第七章：实用资源与模板&quot;">​</a></h1><p>本章提供了一系列可直接用于DDAD开发流程的工具、模板和评估指标，旨在帮助团队快速启动和规范化实践。</p><h2 id="_1-核心工具速查" tabindex="-1">1. 核心工具速查 <a class="header-anchor" href="#_1-核心工具速查" aria-label="Permalink to &quot;1. 核心工具速查&quot;">​</a></h2><ul><li><strong>AI开发助手</strong>: <ul><li><code>Claude CLI</code>: 强大的对话式开发工具，适用于文档生成、代码实现和审查。</li><li><code>GitHub Copilot</code>: 日常编码的必备伙伴，极大提升代码补全效率。</li><li><code>Cursor</code>: AI原生的IDE，提供流畅的编码和重构体验。</li></ul></li><li><strong>版本控制</strong>: <code>Git</code>, 配合 <code>Git Worktrees</code> 进行高效的并行开发。</li><li><strong>文档协作</strong>: <code>Notion</code>, <code>Confluence</code>, 或直接在Git仓库中使用Markdown进行管理。</li><li><strong>部署与运维</strong>: <code>Docker</code>, <code>Docker Compose</code>, <code>Kubernetes</code>。</li><li><strong>测试框架</strong>: <code>pytest</code> (Python), <code>Jest</code> (JavaScript), <code>locust</code> (性能测试)。</li></ul><hr><h2 id="_2-ddad项目模板与prompt库" tabindex="-1">2. DDAD项目模板与Prompt库 <a class="header-anchor" href="#_2-ddad项目模板与prompt库" aria-label="Permalink to &quot;2. DDAD项目模板与Prompt库&quot;">​</a></h2><p>我们提供了一整套基于Prompt的文档生成模板，覆盖了从需求到部署的全过程。通过这些模板，团队可以快速、规范地创建所有必要的DDAD文档。</p><p><strong>模板库位置</strong>: <code>工具模板/</code> 目录</p><p><strong>核心模板列表</strong>:</p><ul><li><strong>需求阶段</strong>: <ul><li><code>PRD生成提示词</code>: 快速生成专业的产品需求文档。</li><li><code>用户故事生成提示词</code>: 将需求分解为可执行的敏捷单元。</li></ul></li><li><strong>设计阶段</strong>: <ul><li><code>系统架构设计提示词</code>: 生成分层架构图和技术选型。</li><li><code>API规格设计提示词</code>: 创建标准化的RESTful API文档。</li></ul></li><li><strong>开发阶段</strong>: <ul><li><code>模块规格设计提示词</code>: 定义具体到函数的开发规范，是高质量代码生成的关键。</li><li><code>代码审查提示词</code>: 利用AI自动发现代码中的潜在问题。</li></ul></li><li><strong>测试与部署阶段</strong>: <ul><li><code>测试计划与用例生成提示词</code>: 确保测试的全面性。</li><li><code>部署与运维手册生成提示词</code>: 降低交付和维护的复杂度。</li></ul></li></ul><h3 id="prompt模板详解" tabindex="-1">Prompt模板详解 <a class="header-anchor" href="#prompt模板详解" aria-label="Permalink to &quot;Prompt模板详解&quot;">​</a></h3><p>以下是经过实战验证的Prompt模板，遵循&quot;<strong>明确目标+结构化输出+验收标准</strong>&quot;的设计原则：</p><h4 id="需求分析模板" tabindex="-1">需求分析模板 <a class="header-anchor" href="#需求分析模板" aria-label="Permalink to &quot;需求分析模板&quot;">​</a></h4><p><strong>PRD生成模板</strong>:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>我要开发一个[项目名称]。请帮我生成一份完整的产品需求文档(PRD.md),包含:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. **产品概述**</span></span>
<span class="line"><span>   - 产品定位: [一句话描述产品价值]</span></span>
<span class="line"><span>   - 目标用户: [核心用户画像]</span></span>
<span class="line"><span>   - 核心价值: [关键优势,例如:降低70%成本]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. **功能需求**</span></span>
<span class="line"><span>   - [列出核心功能模块及子功能]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. **非功能需求**</span></span>
<span class="line"><span>   - 性能: [例如:P95响应时间 &lt; 2秒]</span></span>
<span class="line"><span>   - 准确率/并发性/可扩展性等</span></span>
<span class="line"><span></span></span>
<span class="line"><span>4. **技术与环境约束**</span></span>
<span class="line"><span>   - 核心技术、后端技术栈、API风格</span></span>
<span class="line"><span></span></span>
<span class="line"><span>请使用 Markdown 格式,确保结构清晰、内容专业。</span></span></code></pre></div><p><strong>用户故事生成模板</strong>:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>基于PRD文档,请生成用户故事文档(user-stories.md):</span></span>
<span class="line"><span></span></span>
<span class="line"><span>要求:</span></span>
<span class="line"><span>1. 覆盖核心功能</span></span>
<span class="line"><span>2. 标准格式: 作为[角色],我想要[功能],以便[价值]</span></span>
<span class="line"><span>3. 验收标准(AC): 可验证的条件清单</span></span>
<span class="line"><span>4. 优先级: P0/P1/P2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>请至少生成8个用户故事。</span></span></code></pre></div><h4 id="代码审查模板" tabindex="-1">代码审查模板 <a class="header-anchor" href="#代码审查模板" aria-label="Permalink to &quot;代码审查模板&quot;">​</a></h4><p><strong>标准代码审查Prompt</strong>:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>请以高级工程师视角审查代码,重点关注:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 代码质量: 可读性、可维护性</span></span>
<span class="line"><span>2. 性能问题: 算法复杂度、资源使用</span></span>
<span class="line"><span>3. 安全漏洞: SQL注入、XSS、敏感信息泄露</span></span>
<span class="line"><span>4. 最佳实践: 语言/框架惯用法、错误处理</span></span>
<span class="line"><span></span></span>
<span class="line"><span>给出具体修改建议和代码示例。</span></span></code></pre></div><p><strong>架构一致性审查Prompt</strong>:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>请审查代码是否符合项目架构设计:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. 依赖方向检查: 是否违反分层架构</span></span>
<span class="line"><span>2. 接口规范: API接口是否符合规格文档</span></span>
<span class="line"><span>3. 技术栈合规: 是否引入未批准的第三方库</span></span>
<span class="line"><span></span></span>
<span class="line"><span>给出合规性报告和整改建议。</span></span></code></pre></div><h4 id="任务执行模板" tabindex="-1">任务执行模板 <a class="header-anchor" href="#任务执行模板" aria-label="Permalink to &quot;任务执行模板&quot;">​</a></h4><p><strong>模块开发任务Prompt</strong>:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>请实现[模块名称]模块:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>功能需求: [核心功能描述]</span></span>
<span class="line"><span>技术要求: [语言、设计模式、必须包含的元素]</span></span>
<span class="line"><span>接口定义: [类/方法签名]</span></span>
<span class="line"><span>测试要求: pytest单元测试,覆盖率&gt;80%</span></span>
<span class="line"><span></span></span>
<span class="line"><span>请生成完整可运行的代码。</span></span></code></pre></div><p><strong>API接口开发Prompt</strong>:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>请实现RESTful API接口:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>接口信息: HTTP方法、路径、认证方式</span></span>
<span class="line"><span>请求/响应格式: JSON Schema</span></span>
<span class="line"><span>实现要求: 框架、参数验证、错误处理、文档注释、测试</span></span>
<span class="line"><span></span></span>
<span class="line"><span>请生成完整代码实现。</span></span></code></pre></div><p>详细的模板内容请参考 <code>工具模板/</code> 目录。</p><hr><h2 id="_3-评估指标体系-metrics" tabindex="-1">3. 评估指标体系 (Metrics) <a class="header-anchor" href="#_3-评估指标体系-metrics" aria-label="Permalink to &quot;3. 评估指标体系 (Metrics)&quot;">​</a></h2><p>为了量化DDAD方法论的实施效果，我们建议跟踪以下四类核心指标：</p><h3 id="团队效能指标" tabindex="-1"><strong>团队效能指标</strong> <a class="header-anchor" href="#团队效能指标" aria-label="Permalink to &quot;**团队效能指标**&quot;">​</a></h3><ul><li><strong>需求交付周期 (Lead Time)</strong>: 从需求提出到功能上线的总时长。是衡量端到端效率的核心指标。</li><li><strong>代码提交频率 (Commit Frequency)</strong>: 反映团队的开发活跃度和迭代速度。</li><li><strong>AI采纳率</strong>: 团队成员使用AI工具完成开发任务的比例。</li></ul><h3 id="质量指标" tabindex="-1"><strong>质量指标</strong> <a class="header-anchor" href="#质量指标" aria-label="Permalink to &quot;**质量指标**&quot;">​</a></h3><ul><li><strong>单元测试覆盖率 (Test Coverage)</strong>: 衡量代码的健壮性，目标应 &gt; 80%。</li><li><strong>代码缺陷密度 (Defect Density)</strong>: 线上每千行代码的缺陷数量，反映交付质量。</li><li><strong>AI生成代码的返工率</strong>: AI生成的代码需要人工修改才能通过审查的比例，用于评估Prompt质量。</li></ul><h3 id="协作指标" tabindex="-1"><strong>协作指标</strong> <a class="header-anchor" href="#协作指标" aria-label="Permalink to &quot;**协作指标**&quot;">​</a></h3><ul><li><strong>文档一致性</strong>: 各阶段文档之间是否存在冲突或过时的信息。</li><li><strong>会议时长</strong>: 观察引入DDAD后，需求澄清和沟通会议的时间是否显著减少。</li></ul><h3 id="用户满意度" tabindex="-1"><strong>用户满意度</strong> <a class="header-anchor" href="#用户满意度" aria-label="Permalink to &quot;**用户满意度**&quot;">​</a></h3><ul><li><strong>NPS (Net Promoter Score)</strong>: 衡量最终用户对产品或功能的满意度。</li><li><strong>问题解决率</strong>: 智能客服等AI系统成功独立解决用户问题的比例。</li></ul><p>通过定期回顾这些指标，团队可以持续发现瓶颈、改进流程，并量化AI工具和DDAD方法论带来的真实价值。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("ddad-in-teams/chapter7.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const chapter7 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  chapter7 as default
};
