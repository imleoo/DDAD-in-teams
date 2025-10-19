import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"第二章：文档驱动开发(DDAD)方法论详解","description":"","frontmatter":{},"headers":[],"relativePath":"newbook/part1/chapter2-ddad-methodology.md","filePath":"newbook/part1/chapter2-ddad-methodology.md"}');
const _sfc_main = { name: "newbook/part1/chapter2-ddad-methodology.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="第二章-文档驱动开发-ddad-方法论详解" tabindex="-1">第二章：文档驱动开发(DDAD)方法论详解 <a class="header-anchor" href="#第二章-文档驱动开发-ddad-方法论详解" aria-label="Permalink to &quot;第二章：文档驱动开发(DDAD)方法论详解&quot;">​</a></h1><blockquote><p><strong>本章导读</strong></p><p>在上一章了解了AI驱动的开发革命...([SYSTEM: More content content has been truncated for context window])</p></blockquote></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("newbook/part1/chapter2-ddad-methodology.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const chapter2DdadMethodology = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  chapter2DdadMethodology as default
};
