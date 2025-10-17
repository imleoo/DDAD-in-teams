# 第七章：实用资源与模板（第一部分）

> **本章导读**
>
> 本章为DDAD方法论的实际应用提供完整的工具箱和资源库。我们将详细介绍核心工具的使用方法和选择标准，提供经过实战验证的文档生成模板和Prompt库，建立科学的评估指标体系来量化DDAD实施效果。

---

## 核心工具速查

在DDAD方法论的实施过程中，选择合适的工具组合是成功的关键。以下是经过实战验证的核心工具清单和使用建议。

### AI开发助手

**Claude**：
- **特点**：拥有200K token超长上下文，深度代码理解能力
- **适用场景**：复杂需求分析、架构设计、大型代码库重构
- **使用技巧**：
  ```bash
  # 项目级分析
  claude --file docs/requirements/PRD.md --file src/ "分析需求与代码实现的一致性"
  
  # 多文件协调编辑
  claude --file src/models/ --file src/api/ "确保API接口与数据模型的一致性"
  ```

**GitHub Copilot**：
- **特点**：广泛的语言支持，成熟的IDE集成
- **适用场景**：日常编码、代码补全、单元测试生成
- **配置建议**：
  ```json
  {
    "github.copilot.enable": {
      "*": true,
      "yaml": false,
      "plaintext": false
    },
    "github.copilot.advanced": {
      "length": 500,
      "temperature": 0.1
    }
  }
  ```

**Cursor**：
- **特点**：AI原生IDE，流畅的编码重构体验
- **适用场景**：快速原型开发、AI辅助重构、学习新技术
- **最佳实践**：
  - 使用Composer进行多文件编辑
  - 配置项目特定的AI规则
  - 利用Chat功能进行代码解释

### 版本控制与协作

**Git + Git Worktrees**：
- **并行开发支持**：多分支同时工作，避免频繁切换
- **使用模式**：
  ```bash
  # 创建功能分支工作树
  git worktree add ../feature-auth feature/auth
  git worktree add ../feature-payment feature/payment
  
  # 并行开发
  cd ../feature-auth && code .    # 开发认证功能
  cd ../feature-payment && code . # 开发支付功能
  
  # 定期同步
  git worktree list
  git pull origin main  # 在各个工作树中同步主分支
  ```

**文档协作平台选择**：

| 平台 | 优势 | 适用场景 | 集成能力 |
|------|------|----------|----------|
| **Notion** | 强大的数据库功能，丰富的模板 | 中小团队，快速原型 | API集成，自动化同步 |
| **Confluence** | 企业级功能，权限管理完善 | 大型企业，合规要求高 | Jira集成，企业SSO |
| **GitHub/GitLab Wiki** | 与代码仓库紧密集成 | 技术团队，开源项目 | CI/CD集成，版本控制 |
| **语雀/飞书文档** | 中文支持好，协作体验佳 | 国内团队，中文环境 | 钉钉/飞书集成 |

### 部署与运维工具

**容器化方案**：
```dockerfile
# Dockerfile示例
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml示例
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - database
      - redis
  
  database:
    image: postgres:14
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 测试框架选择

**单元测试**：
```python
# Python + pytest
import pytest
from myapp.services import UserService

class TestUserService:
    @pytest.fixture
    def user_service(self):
        return UserService()
    
    def test_create_user_success(self, user_service):
        user_data = {"name": "John", "email": "john@example.com"}
        user = user_service.create_user(user_data)
        assert user.id is not None
        assert user.name == "John"
    
    @pytest.mark.asyncio
    async def test_async_user_validation(self, user_service):
        is_valid = await user_service.validate_user_async("john@example.com")
        assert is_valid is True
```

---

## DDAD项目模板与Prompt库

### 需求分析模板

**PRD生成模板**：
```markdown
我要开发一个[项目类型]项目：[项目简述]

请帮我生成一份完整的产品需求文档（PRD.md），包含：

## 1. 产品概述
- **产品定位**：[一句话描述产品价值主张]
- **目标用户**：[核心用户画像，包括角色、需求、痛点]
- **核心价值**：[关键优势，最好有量化指标，如"降低70%成本"]
- **成功指标**：[可衡量的成功标准]

## 2. 功能需求
- **核心功能模块**：[P0优先级，MVP必需]
- **重要功能模块**：[P1优先级，重要但非必需]
- **增强功能模块**：[P2优先级，锦上添花]

## 3. 非功能需求
- **性能要求**：[如P95响应时间 < 2秒，并发用户数 > 1000]
- **可用性要求**：[如99.9%可用率，故障恢复时间 < 30分钟]
- **安全要求**：[数据加密、访问控制、合规要求]
- **可扩展性**：[用户增长预期，系统扩展能力]

## 4. 技术与环境约束
- **技术栈偏好**：[前端、后端、数据库技术选择]
- **部署环境**：[云服务商、容器化、CI/CD要求]
- **集成要求**：[第三方服务、API依赖]
- **合规要求**：[GDPR、SOC2等合规标准]

请使用Markdown格式，确保结构清晰、内容专业，可直接保存为docs/01-requirements/PRD.md
```

**用户故事生成模板**：
```markdown
基于以下PRD文档：[粘贴PRD内容或文件路径]

请生成用户故事文档（user-stories.md）：

## 要求：
1. **故事格式**：严格遵循"作为[角色]，我想要[功能]，以便[价值]"的格式
2. **覆盖范围**：覆盖PRD中的所有核心功能
3. **验收标准**：每个故事都要有明确的、可验证的验收标准（AC）
4. **优先级划分**：P0（MVP必需）、P1（重要）、P2（增强）
5. **工作量估算**：用故事点（1、2、3、5、8）估算复杂度
6. **依赖关系**：明确故事之间的前置依赖

## 输出格式示例：
### US-001: [故事标题]
**作为** [用户角色]
**我想要** [具体功能]
**以便** [业务价值]

**验收标准：**
- [ ] [可验证的条件1]
- [ ] [可验证的条件2]
- [ ] [可验证的条件3]

**优先级：** P0
**故事点：** 3
**依赖：** 无
**备注：** [额外说明]

请至少生成8个核心用户故事，确保覆盖主要用户旅程。
```

### 设计阶段模板

**系统架构设计模板**：
```markdown
基于以下需求文档：[PRD文档路径]

请设计系统架构（architecture.md），包含：

## 1. 架构概览
- **架构风格**：[单体/微服务/Serverless等，并说明选择理由]
- **核心设计原则**：[如高可用、可扩展、安全性等]
- **技术栈选择**：[前端、后端、数据库、中间件等，说明选择依据]

## 2. 系统分层
- **表现层**：[前端应用、API Gateway等]
- **业务层**：[核心业务逻辑、服务组件]
- **数据层**：[数据库、缓存、消息队列]
- **外部服务层**：[第三方API、外部系统集成]

## 3. 核心组件
对每个核心组件说明：
- **组件名称**：[如用户服务、订单服务]
- **职责描述**：[该组件负责什么功能]
- **主要接口**：[对外提供的API]
- **依赖关系**：[依赖哪些其他组件]
- **数据模型**：[主要的数据实体]

## 4. 部署架构
- **环境规划**：[开发、测试、生产环境]
- **容器化策略**：[Docker、K8s部署方案]
- **监控与日志**：[监控指标、日志收集策略]

请确保架构设计符合PRD中的性能和可扩展性要求。
```

**API设计模板**：
```markdown
基于系统架构设计，请生成API规格文档（api-spec.md）：

## 要求：
1. **标准遵循**：严格遵循OpenAPI 3.0标准
2. **RESTful设计**：使用标准HTTP方法和状态码
3. **安全考虑**：包含认证、授权、数据验证
4. **错误处理**：统一的错误响应格式
5. **版本管理**：API版本控制策略

## 核心接口（至少包含）：
- 用户认证相关接口
- 核心业务实体的CRUD操作
- 查询和搜索接口
- 批量操作接口

## 输出格式：
### POST /api/v1/users
**描述**：创建新用户

**请求参数**：
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "created_at": "datetime"
  }
}
```

**状态码**：
- 200: 创建成功
- 400: 参数错误
- 409: 邮箱已存在

请确保API设计符合业务需求和技术架构。