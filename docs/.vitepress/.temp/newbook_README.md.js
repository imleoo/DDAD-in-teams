import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"前言：AI时代的团队开发新范式","description":"","frontmatter":{},"headers":[],"relativePath":"newbook/README.md","filePath":"newbook/README.md"}');
const _sfc_main = { name: "newbook/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="前言-ai时代的团队开发新范式" tabindex="-1">前言：AI时代的团队开发新范式 <a class="header-anchor" href="#前言-ai时代的团队开发新范式" aria-label="Permalink to &quot;前言：AI时代的团队开发新范式&quot;">​</a></h1><p>欢迎来到AI驱动的软件开发新时代。</p><p>传统的软件开发模式正在被颠覆。过去，我们依赖于漫长的会议、繁琐的文档交接和线性的开发流程。如今，以大型语言模型（LLM）为核心的AI工具链，正以前所未有的方式赋能开发者和团队，让我们能够以10倍的效率构建、测试和部署高质量的软件。</p><p>本书旨在为你和你的团队提供一套系统、完整且可立即上手的开发方法论——<strong>文档驱动应用开发（Documentation-Driven Application Development, DDAD）</strong>。</p><p>这套方法论融合了<code>10xDevelopers.dev</code>社区前沿的<strong>Vibe Coding</strong>实践和文档驱动的核心思想，并以一个贯穿全书的实战项目——<strong>“智能客服Agent”</strong>——为例，手把手带你走完从需求构思到上线部署的全过程。</p><p><strong>你将从本书中学到：</strong></p><ol><li><strong>一种全新的思维模式</strong>：如何将AI从一个“辅助工具”转变为一个全天候、不知疲倦的“团队伙伴”，让开发者从繁重的编码工作中解放出来，专注于系统设计和业务创新。</li><li><strong>一套结构化的流程</strong>：学习从项目启动、AI辅助规划、规格驱动开发到自动化部署的10个核心阶段，确保项目在高速迭代中不失控。</li><li><strong>一个真实的完整案例</strong>：跟随我们一起，利用DDAD方法论和现代化AI工具，从零开始构建一个功能完备的智能客服Agent，体验四周内交付一个MVP的极速开发流程。</li><li><strong>一套高效的团队协作方案</strong>：了解如何通过文档和规范来同步团队认知，减少沟通成本，实现前后端、产品与开发之间的高效并行协作。</li><li><strong>一系列可复用的模板与资源</strong>：获取我们为你精心准备的需求文档、设计规范、API规格、项目计划等模板，以及一份详尽的AI工具链推荐列表。</li></ol><p>无论你是一名寻求效率突破的独立开发者，还是一个希望提升团队整体战斗力的技术负责人，本书都将为你提供清晰的指引和强大的武器。</p><p>让我们一起拥抱这场变革，成为AI时代的10倍效能团队。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("newbook/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
