import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'DDAD 图书馆',
  description: '三本图书的文档驱动敏捷开发知识库',
  srcDir: '.',
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: 'DDAD 团队实践指南', link: '/ddad-in-teams/' },
      { text: '10x DDAD 实践指南', link: '/10x-ddad-guide/' },
      { text: '新书体验', link: '/newbook/' }
    ],
    sidebar: {
      '/ddad-in-teams/': [
        {
          text: 'DDAD 团队实践指南',
          items: [
            { text: '前言', link: '/ddad-in-teams/' },
            { text: '序言', link: '/ddad-in-teams/序言' },
            { text: '第一章：引言', link: '/ddad-in-teams/chapter1' },
            { text: '第一章（续）', link: '/ddad-in-teams/chapter1-part2' },
            { text: '第二章：核心概念解析', link: '/ddad-in-teams/chapter2' },
            { text: '第三章：工具与基础操作', link: '/ddad-in-teams/chapter3' },
            { text: '第四章：团队协作流程', link: '/ddad-in-teams/chapter4' },
            { text: '第五章：实战案例', link: '/ddad-in-teams/chapter5' },
            { text: '第六章：最佳实践与展望', link: '/ddad-in-teams/chapter6' },
            { text: '第七章：实用资源（上）', link: '/ddad-in-teams/chapter7-part1' },
            { text: '第七章：实用资源（下）', link: '/ddad-in-teams/chapter7-part2' },
            { text: '附录：10x Developers实践指南', link: '/ddad-in-teams/appendix' },
            { text: '结语', link: '/ddad-in-teams/conclusion' }
          ]
        }
      ],
      '/10x-ddad-guide/': [
        {
          text: '10x DDAD 实践指南',
          collapsed: false,
          items: [
            { text: '前言', link: '/10x-ddad-guide/' }
          ]
        },
        {
          text: '第一部分：基础理念',
          collapsed: true,
          items: [
            { text: '第一章：10x开发革命', link: '/10x-ddad-guide/chapter1-revolution' },
            { text: '第二章：DDAD方法论详解', link: '/10x-ddad-guide/chapter2-ddad-methodology' },
            { text: '第三章：技术栈与工具生态', link: '/10x-ddad-guide/chapter3-tech-stack' }
          ]
        },
        {
          text: '第二部分：结构化开发流程',
          collapsed: true,
          items: [
            { text: '第四章：寻找构建目标', link: '/10x-ddad-guide/chapter4-find' },
            { text: '第五章：快速规划', link: '/10x-ddad-guide/chapter5-planning' },
            { text: '第六章：需求细化', link: '/10x-ddad-guide/chapter6-requirements' },
            { text: '第七章：技术栈选择', link: '/10x-ddad-guide/chapter7-tech-stack-selection' },
            { text: '第八章：应用流程设计', link: '/10x-ddad-guide/chapter8-app-flow' },
            { text: '第九章：设计规范', link: '/10x-ddad-guide/chapter9-design-spec' },
            { text: '第十章：实施阶段', link: '/10x-ddad-guide/chapter10-implementation' },
            { text: '第十一章：安全实施', link: '/10x-ddad-guide/chapter11-security' },
            { text: '第十二章：部署上线', link: '/10x-ddad-guide/chapter12-deployment' },
            { text: '第十三章：文档与维护', link: '/10x-ddad-guide/chapter13-documentation' }
          ]
        },
        {
          text: '第三部分：高级实践',
          collapsed: true,
          items: [
            { text: '第十四章：Spec-Driven Subagents', link: '/10x-ddad-guide/chapter14-adr' },
            { text: '第十五章：迭代优化', link: '/10x-ddad-guide/chapter15-iterative-optimization' },
            { text: '第十六章：性能优化', link: '/10x-ddad-guide/chapter16-performance-optimization' }
          ]
        },
        {
          text: '第四部分：实战案例与资源',
          collapsed: true,
          items: [
            { text: '第十七章：完整项目实战', link: '/10x-ddad-guide/chapter17-case-study' },
            { text: '第十八章：工具与资源', link: '/10x-ddad-guide/chapter18-resources' }
          ]
        }
      ],
      '/newbook/': [
        {
          text: '新书体验',
          items: [
            { text: '前言', link: '/newbook/' }
          ]
        },
        {
          text: '第一部分：理念与基础',
          collapsed: true,
          items: [
            { text: '第一章：AI驱动的开发革命', link: '/newbook/part1/chapter1-revolution' },
            { text: '第二章：DDAD方法论详解', link: '/newbook/part1/chapter2-ddad-methodology' },
            { text: '第三章：现代化技术栈与AI工具链', link: '/newbook/part1/chapter3-tech-stack' }
          ]
        },
        {
          text: '第二部分：项目规划与设计',
          collapsed: true,
          items: [
            { text: '第四章：定义目标', link: '/newbook/part2/chapter4-define-goal' },
            { text: '第五章：AI辅助规划与PRD生成', link: '/newbook/part2/chapter5-planning-and-prd' }
          ]
        },
        {
          text: '第三部分：AI辅助编码实战',
          collapsed: true,
          items: [
            { text: '第六章：AI辅助编码', link: '/newbook/part3/chapter6-ai-coding' },
            { text: '第七章：后端服务开发实战', link: '/newbook/part3/chapter7-backend-development' }
          ]
        },
        {
          text: '第四部分：集成、测试与部署',
          collapsed: true,
          items: [
            { text: '第八章：前端开发与集成', link: '/newbook/part4/chapter8-frontend-development' },
            { text: '第九章：测试与质量保证', link: '/newbook/part4/chapter9-testing-and-qa' },
            { text: '第十章：部署与CI/CD', link: '/newbook/part4/chapter10-deployment-and-cicd' }
          ]
        },
        {
          text: '第五部分：高效团队与最佳实践',
          collapsed: true,
          items: [
            { text: '第十二章：DDAD团队协作流程', link: '/newbook/part5/chapter12-team-collaboration' },
            { text: '第十三章：AI协作治理与最佳实践', link: '/newbook/part5/chapter13-governance-and-best-practices' },
            { text: '第十四章：10x Developers实践指南', link: '/newbook/part5/chapter14-10x-developer-guide' },
            { text: '第十五章：总结与展望', link: '/newbook/part5/chapter15-summary-and-outlook' }
          ]
        },
        {
          text: '附录',
          collapsed: true,
          items: [
            { text: '附录A：实用资源与模板库', link: '/newbook/appendix/appendix-a-resources-and-templates' },
            { text: '附录B：DDAD采纳度调研问卷', link: '/newbook/appendix/appendix-b-survey' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/leoobai/jiwu-project' }
    ]
  }
})
