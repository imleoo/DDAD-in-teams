import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'DDAD 图书馆',
  description: '三本图书的文档驱动敏捷开发知识库',
  srcDir: '.',
  ignoreDeadLinks: true,
  themeConfig: {

    nav: [
      { text: 'DDAD 团队实践指南', link: 'ddad-in-teams/' },
      { text: '10x DDAD 实践指南', link: '10x-ddad-guide/' },
      { text: '新书体验', link: 'newbook/' }
    ],
    sidebar: {
      '/ddad-in-teams/': [
        {
          text: 'DDAD 团队实践指南',
          items: [
            { text: '前言', link: './' },
            { text: '序言', link: './序言.md' },
            { text: '第一章：引言', link: './chapter1.md' },
            { text: '第一章（续）', link: './chapter1-part2.md' },
            { text: '第二章：核心概念解析', link: './chapter2.md' },
            { text: '第三章：工具与基础操作', link: './chapter3.md' },
            { text: '第四章：团队协作流程', link: './chapter4.md' },
            { text: '第五章：实战案例', link: './chapter5.md' },
            { text: '第六章：最佳实践与展望', link: './chapter6.md' },
            { text: '第七章：实用资源（上）', link: './chapter7-part1.md' },
            { text: '第七章：实用资源（下）', link: './chapter7-part2.md' },
            { text: '附录：10x Developers实践指南', link: './appendix.md' },
            { text: '结语', link: './conclusion.md' }
            ]
        }
      ],
      '/10x-ddad-guide/': [
        {
          text: '10x DDAD 实践指南',
          collapsed: false,
          items: [
            { text: '前言', link: './' }
          ]
        },
        {
          text: '第一部分：基础理念',
          collapsed: true,
          items: [
            { text: '第一章：10x开发革命', link: './chapter1-revolution.md' },
            { text: '第二章：DDAD方法论详解', link: './chapter2-ddad-methodology.md' },
            { text: '第三章：技术栈与工具生态', link: './chapter3-tech-stack.md' }
            ]
        },
        {
          text: '第二部分：实战方法论',
          collapsed: true,
          items: [
            { text: '第四章：寻找构建目标', link: './chapter4-find.md' },
            { text: '第五章：快速规划', link: './chapter5-planning.md' },
            { text: '第六章：需求细化', link: './chapter6-requirements.md' },
            { text: '第七章：技术栈选择', link: './chapter7-tech-stack-selection.md' },
            { text: '第八章：应用流程设计', link: './chapter8-app-flow.md' },
            { text: '第九章：设计规范', link: './chapter9-design-spec.md' },
            { text: '第十章：实施阶段', link: './chapter10-implementation.md' },
            { text: '第十一章：安全实施', link: './chapter11-security.md' },
            { text: '第十二章：部署上线', link: './chapter12-deployment.md' },
            { text: '第十三章：文档与维护', link: './chapter13-documentation.md' }
            ]
        },
        {
          text: '第三部分：高级实践',
          collapsed: true,
          items: [
            { text: '第十四章：Spec-Driven Subagents', link: './chapter14-adr.md' },
            { text: '第十五章：迭代优化', link: './chapter15-iterative-optimization.md' },
            { text: '第十六章：性能优化', link: './chapter16-performance-optimization.md' }
            ]
        },
        {
          text: '第四部分：总结与资源',
          collapsed: true,
          items: [
            { text: '第十七章：完整项目实战', link: './chapter17-case-study.md' },
            { text: '第十八章：工具与资源', link: './chapter18-resources.md' }
            ]
        }
      ],
      '/newbook/': [
        {
          text: '新书体验',
          items: [
            { text: '前言', link: './' }
          ]
        },
        {
          text: '第一部分：基础理念',
          collapsed: true,
          items: [
            { text: '第一章：AI驱动的开发革命', link: './part1/chapter1-revolution.md' },
            { text: '第二章：DDAD方法论详解', link: './part1/chapter2-ddad-methodology.md' },
            { text: '第三章：现代化技术栈与AI工具链', link: './part1/chapter3-tech-stack.md' }
            ]
        },
        {
          text: '第二部分：规划与设计',
          collapsed: true,
          items: [
            { text: '第四章：定义目标', link: './part2/chapter4-define-goal.md' },
            { text: '第五章：AI辅助规划与PRD生成', link: './part2/chapter5-planning-and-prd.md' }
            ]
        },
        {
          text: '第三部分：开发实战',
          collapsed: true,
          items: [
            { text: '第六章：AI辅助编码', link: './part3/chapter6-ai-coding.md' },
            { text: '第七章：后端服务开发实战', link: './part3/chapter7-backend-development.md' }
            ]
        },
        {
          text: '第四部分：测试与部署',
          collapsed: true,
          items: [
            { text: '第八章：前端开发与集成', link: './part4/chapter8-frontend-development.md' },
            { text: '第九章：测试与质量保证', link: './part4/chapter9-testing-and-qa.md' },
            { text: '第十章：部署与CI/CD', link: './part4/chapter10-deployment-and-cicd.md' }
            ]
        },
        {
          text: '第五部分：团队协作与展望',
          collapsed: true,
          items: [
            { text: '第十二章：DDAD团队协作流程', link: './part5/chapter12-team-collaboration.md' },
            { text: '第十三章：AI协作治理与最佳实践', link: './part5/chapter13-governance-and-best-practices.md' },
            { text: '第十四章：10x Developers实践指南', link: './part5/chapter14-10x-developer-guide.md' },
            { text: '第十五章：总结与展望', link: './part5/chapter15-summary-and-outlook.md' }
            ]
        },
        {
          text: '附录',
          collapsed: true,
          items: [
            { text: '附录A：实用资源与模板库', link: './appendix/appendix-a-resources-and-templates.md' },
            { text: '附录B：DDAD采纳度调研问卷', link: './appendix/appendix-b-survey.md' }
            ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/leoobai/jiwu-project' }
    ]
  }
})
