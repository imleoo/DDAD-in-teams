import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"附录A：实用资源与模板库","description":"","frontmatter":{},"headers":[],"relativePath":"newbook/appendix/appendix-a-resources-and-templates.md","filePath":"newbook/appendix/appendix-a-resources-and-templates.md"}');
const _sfc_main = { name: "newbook/appendix/appendix-a-resources-and-templates.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="附录a-实用资源与模板库" tabindex="-1">附录A：实用资源与模板库 <a class="header-anchor" href="#附录a-实用资源与模板库" aria-label="Permalink to &quot;附录A：实用资源与模板库&quot;">​</a></h1><p>本附录提供了一系列可直接用于DDAD开发流程的工具、模板和评估指标，旨在帮助你的团队快速启动和规范化实践。</p><hr><h2 id="_1-核心工具速查" tabindex="-1">1. 核心工具速查 <a class="header-anchor" href="#_1-核心工具速查" aria-label="Permalink to &quot;1. 核心工具速查&quot;">​</a></h2><ul><li><strong>AI开发助手</strong>: <ul><li><code>Claude / ChatGPT</code>: 强大的对话式开发伙伴，适用于文档生成、代码实现和审查。</li><li><code>GitHub Copilot</code>: 日常编码的必备伙伴，极大提升代码补全效率。</li><li><code>Cursor / Codebuddy</code>: AI原生的IDE或插件，提供流畅的编码和重构体验。</li></ul></li><li><strong>版本控制</strong>: <code>Git</code>, 配合 <code>Git Worktrees</code> 进行高效的并行开发。</li><li><strong>文档协作</strong>: <code>Notion</code>, <code>Confluence</code>, 或直接在Git仓库中使用Markdown进行管理。</li><li><strong>部署与运维</strong>: <code>Docker</code>, <code>Docker Compose</code>, <code>GitHub Actions</code>。</li><li><strong>测试框架</strong>: <code>pytest</code> (Python), <code>Jest</code> (JavaScript), <code>Playwright</code> (E2E测试)。</li></ul><hr><h2 id="_2-ddad项目prompt模板库" tabindex="-1">2. DDAD项目Prompt模板库 <a class="header-anchor" href="#_2-ddad项目prompt模板库" aria-label="Permalink to &quot;2. DDAD项目Prompt模板库&quot;">​</a></h2><p>我们提供了一整套基于Prompt的文档生成模板，覆盖了从需求到部署的全过程。通过这些模板，团队可以快速、规范地创建所有必要的DDAD文档。</p><h3 id="需求分析模板" tabindex="-1">需求分析模板 <a class="header-anchor" href="#需求分析模板" aria-label="Permalink to &quot;需求分析模板&quot;">​</a></h3><p><strong>PRD生成模板</strong>:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>我要开发一个[项目名称]。请帮我生成一份完整的产品需求文档(PRD.md),包含:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1.  **产品概述**: 产品定位、目标用户、核心价值。</span></span>
<span class="line"><span>2.  **功能需求 (MoSCoW)**:</span></span>
<span class="line"><span>    - Must Have: [列出MVP核心功能]</span></span>
<span class="line"><span>    - Should Have: [列出V1.1功能]</span></span>
<span class="line"><span>    - Could Have: [列出锦上添花功能]</span></span>
<span class="line"><span>    - Won&#39;t Have: [明确不做]</span></span>
<span class="line"><span>3.  **非功能需求**: 性能、安全、可靠性等。</span></span>
<span class="line"><span>4.  **技术约束**: 核心技术栈、API风格等。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>请使用 Markdown 格式,确保结构清晰、内容专业。</span></span></code></pre></div><p><strong>用户故事生成模板</strong>:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>基于以下PRD文档，请生成用户故事文档(user-stories.md)。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**要求**:</span></span>
<span class="line"><span>1.  覆盖所有&quot;Must Have&quot;功能。</span></span>
<span class="line"><span>2.  遵循标准格式: &quot;作为[角色],我想要[功能],以便[价值]&quot;。</span></span>
<span class="line"><span>3.  为每个故事提供明确的验收标准(Acceptance Criteria)。</span></span>
<span class="line"><span>4.  给出优先级(P0/P1/P2)。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span>[粘贴PRD核心内容]</span></span>
<span class="line"><span>---</span></span></code></pre></div><h3 id="开发与审查模板" tabindex="-1">开发与审查模板 <a class="header-anchor" href="#开发与审查模板" aria-label="Permalink to &quot;开发与审查模板&quot;">​</a></h3><p><strong>模块规格 (Module Spec) 生成模板</strong>:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>请为[模块名称]模块编写一份详细的规格文档。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**要求**:</span></span>
<span class="line"><span>1.  **模块概述**: 职责、输入、输出。</span></span>
<span class="line"><span>2.  **核心实现要求**: 必须使用的技术方案、算法或约束。</span></span>
<span class="line"><span>3.  **接口定义**: 使用目标语言定义类/方法签名。</span></span>
<span class="line"><span>4.  **Prompt工程** (如果适用): 提供完整的Prompt模板。</span></span>
<span class="line"><span>5.  **测试用例**: 以表格形式提供至少5个覆盖核心逻辑和边界条件的测试用例。</span></span></code></pre></div><p><strong>标准代码审查模板</strong>:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>请以高级工程师视角审查以下代码,重点关注:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1.  **代码质量**: 是否遵循SOLID原则？可读性、可维护性如何？</span></span>
<span class="line"><span>2.  **性能问题**: 是否存在不必要的循环、低效的数据库查询？</span></span>
<span class="line"><span>3.  **安全漏洞**: 是否有潜在的注入风险、敏感信息泄露？</span></span>
<span class="line"><span>4.  **最佳实践**: 是否遵循了语言和框架的惯用法？错误处理是否完善？</span></span>
<span class="line"><span></span></span>
<span class="line"><span>请给出具体的修改建议和重构后的代码示例。</span></span></code></pre></div><h3 id="任务执行模板" tabindex="-1">任务执行模板 <a class="header-anchor" href="#任务执行模板" aria-label="Permalink to &quot;任务执行模板&quot;">​</a></h3><p><strong>模块开发任务模板</strong>:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>请根据以下模块规格，实现[模块名称]模块。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**约束**:</span></span>
<span class="line"><span>1.  使用[语言/框架]。</span></span>
<span class="line"><span>2.  代码必须包含完整的类型注解和Docstring。</span></span>
<span class="line"><span>3.  实现所有在规格中定义的接口。</span></span>
<span class="line"><span>4.  在代码末尾生成\`pytest\`单元测试，覆盖所有测试用例。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span>[粘贴模块规格的全部内容]</span></span>
<span class="line"><span>---</span></span></code></pre></div><hr><h2 id="_3-评估指标体系-metrics" tabindex="-1">3. 评估指标体系 (Metrics) <a class="header-anchor" href="#_3-评估指标体系-metrics" aria-label="Permalink to &quot;3. 评估指标体系 (Metrics)&quot;">​</a></h2><p>为了量化DDAD方法论的实施效果，我们建议跟踪以下四类核心指标：</p><h3 id="团队效能指标" tabindex="-1"><strong>团队效能指标</strong> <a class="header-anchor" href="#团队效能指标" aria-label="Permalink to &quot;**团队效能指标**&quot;">​</a></h3><ul><li><strong>需求交付周期 (Lead Time)</strong>: 从需求提出到功能上线的总时长。是衡量端到端效率的核心指标。</li><li><strong>代码提交频率 (Commit Frequency)</strong>: 反映团队的开发活跃度和迭代速度。</li><li><strong>AI采纳率</strong>: 团队成员使用AI工具完成开发任务的比例。</li></ul><h3 id="质量指标" tabindex="-1"><strong>质量指标</strong> <a class="header-anchor" href="#质量指标" aria-label="Permalink to &quot;**质量指标**&quot;">​</a></h3><ul><li><strong>单元测试覆盖率 (Test Coverage)</strong>: 衡量代码的健壮性，目标应 &gt; 80%。</li><li><strong>代码缺陷密度 (Defect Density)</strong>: 线上每千行代码的缺陷数量，反映交付质量。</li><li><strong>AI生成代码的返工率</strong>: AI生成的代码需要人工修改才能通过审查的比例，用于评估Prompt质量。</li></ul><h3 id="协作指标" tabindex="-1"><strong>协作指标</strong> <a class="header-anchor" href="#协作指标" aria-label="Permalink to &quot;**协作指标**&quot;">​</a></h3><ul><li><strong>文档一致性</strong>: 各阶段文档之间是否存在冲突或过时的信息。</li><li><strong>会议时长</strong>: 观察引入DDAD后，需求澄清和沟通会议的时间是否显著减少。</li></ul><h3 id="用户满意度" tabindex="-1"><strong>用户满意度</strong> <a class="header-anchor" href="#用户满意度" aria-label="Permalink to &quot;**用户满意度**&quot;">​</a></h3><ul><li><strong>NPS (Net Promoter Score)</strong>: 衡量最终用户对产品或功能的满意度。</li><li><strong>问题解决率</strong>: 智能客服等AI系统成功独立解决用户问题的比例。</li></ul><p>通过定期回顾这些指标，团队可以持续发现瓶颈、改进流程，并量化AI工具和DDAD方法论带来的真实价值。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("newbook/appendix/appendix-a-resources-and-templates.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const appendixAResourcesAndTemplates = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  appendixAResourcesAndTemplates as default
};
