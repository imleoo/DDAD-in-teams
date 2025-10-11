# 智能客服Agent开发指南（基于DDAD + Claude CLI）

## 📋 前置准备

### 1. 安装Claude CLI
```bash
# 使用 npm 安装
npm install -g @anthropic-ai/claude-cli

# 或使用 pip 安装
pip install claude-cli

# 配置 API Key
export ANTHROPIC_API_KEY='your-api-key-here'
```

### 2. Claude CLI 基础交互命令
```bash
# 单次对话
claude "你的问题"

# 交互式对话
claude chat

# 处理文件内容
claude --file document.md "分析这个文档"

# 使用特定模型
claude --model claude-sonnet-4 "你的问题"

# 保存对话历史
claude chat --save-history conversation.json
```

---

## 🚀 DDAD 开发流程

### Phase 1: 需求阶段（01-requirements/）

#### **提示词 1.1: 生成PRD.md**
```bash
claude chat
```

**输入以下提示词：**
```
我要开发一个智能客服Agent系统。请帮我生成一份完整的产品需求文档（PRD.md），包含：

1. 产品概述
   - 产品定位
   - 目标用户
   - 核心价值

2. 功能需求
   - 自然语言理解
   - 意图识别与分类
   - 知识库检索
   - 多轮对话管理
   - 情感分析
   - 人工转接机制

3. 非功能需求
   - 响应时间 < 2秒
   - 准确率 > 85%
   - 并发支持 1000+
   - 可扩展性

4. 技术约束
   - 使用 Claude API
   - Python 后端
   - RESTful API

请使用 Markdown 格式，结构清晰，可直接保存为 docs/01-requirements/PRD.md
```

#### **提示词 1.2: 生成用户故事**
```
基于上面的PRD，请生成 user-stories.md，包含：

1. 核心用户故事（至少8个）
   格式：作为[角色]，我想要[功能]，以便[价值]
   
2. 验收标准（每个故事的AC）

3. 优先级标注（P0/P1/P2）

示例格式：
## US-001: 用户发起咨询
**作为** 网站访客  
**我想要** 通过对话框发起咨询  
**以便** 快速获得问题解答

**验收标准：**
- [ ] 能够输入文本消息
- [ ] 3秒内收到首次回复
- [ ] 支持中英文输入

**优先级：** P0
```

---

### Phase 2: 设计阶段（02-design/）

#### **提示词 2.1: 架构设计**
```
基于上述需求，请设计系统架构（architecture.md），包含：

1. 系统分层架构
   - 表现层（API Gateway）
   - 业务层（Agent Core）
   - 数据层（Knowledge Base）
   
2. 核心组件
   - Intent Classifier（意图分类器）
   - Dialog Manager（对话管理器）
   - Knowledge Retriever（知识检索器）
   - Response Generator（响应生成器）

3. 技术栈选型
   - 框架：FastAPI
   - 向量数据库：Pinecone/Milvus
   - 缓存：Redis
   - 日志：ELK Stack

4. 数据流图（使用 Mermaid 语法）

请生成完整的 Markdown 文档
```

#### **提示词 2.2: API规格设计**
```
设计 RESTful API 规格（api-spec.md），遵循 OpenAPI 3.0 标准：

**必需的接口：**
1. POST /api/v1/chat/message - 发送消息
2. GET /api/v1/chat/history/{session_id} - 获取历史
3. POST /api/v1/chat/session - 创建会话
4. DELETE /api/v1/chat/session/{session_id} - 结束会话
5. POST /api/v1/knowledge/upload - 上传知识库
6. GET /api/v1/analytics/metrics - 获取统计

**每个接口包含：**
- 请求方法、路径、参数
- Request Body（JSON Schema）
- Response 示例（成功/失败）
- 状态码说明
- 认证方式（Bearer Token）

格式参考：
```yaml
paths:
  /api/v1/chat/message:
    post:
      summary: 发送聊天消息
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                session_id: string
                message: string
                user_id: string
```
```

#### **提示词 2.3: 数据模型设计**
```
设计核心数据模型（data-models.md），使用 Python Pydantic 或类图表示：

**必需的模型：**
1. ChatSession（会话模型）
2. Message（消息模型）
3. Intent（意图模型）
4. KnowledgeItem（知识条目）
5. User（用户模型）

**每个模型包含：**
- 字段定义（类型、约束、默认值）
- 关系定义（一对多、多对多）
- 索引策略
- 示例数据

格式示例：
```python
from pydantic import BaseModel, Field
from datetime import datetime

class ChatSession(BaseModel):
    session_id: str = Field(..., description="会话唯一标识")
    user_id: str
    created_at: datetime
    status: str = Field(default="active", enum=["active", "closed"])
    context: dict = {}
```
```

---

### Phase 3: 开发阶段（03-development/）

#### **提示词 3.1: 编码规范**
```
生成项目编码规范（coding-standards.md），包含：

1. Python 代码风格
   - 遵循 PEP 8
   - 使用 Black 格式化
   - 类型注解要求

2. 命名约定
   - 类名：PascalCase
   - 函数：snake_case
   - 常量：UPPER_CASE

3. 注释规范
   - Docstring 格式（Google Style）
   - 复杂逻辑必须注释

4. 错误处理
   - 自定义异常层级
   - 日志级别使用

5. 代码审查 Checklist

示例：
```python
from typing import Optional

class IntentClassifier:
    """意图分类器
    
    使用Claude API进行用户意图识别
    
    Attributes:
        model_name: 使用的模型名称
        threshold: 置信度阈值
    """
    
    def classify(self, message: str) -> Optional[str]:
        """分类用户消息
        
        Args:
            message: 用户输入的消息
            
        Returns:
            识别到的意图类别，未识别返回None
            
        Raises:
            APIError: API调用失败时抛出
        """
        pass
```
```

---

### **提示词 3.2: 模块规格 - Intent Classifier**

```
为 Intent Classifier 模块编写详细规格（module-specs/intent-classifier.md）：

## 1. 模块概述
- 职责：识别用户消息的意图类别
- 输入：用户文本消息
- 输出：意图标签 + 置信度

## 2. 支持的意图类型
```python
INTENT_TYPES = {
    "product_inquiry": "产品咨询",
    "order_status": "订单查询", 
    "complaint": "投诉建议",
    "technical_support": "技术支持",
    "return_refund": "退换货",
    "other": "其他"
}
```

## 3. 实现要求
- 使用 Claude API 进行零样本分类
- 提供 prompt 模板
- 置信度低于0.7时标记为"需人工"
- 支持批量分类（提升性能）

## 4. 接口定义
```python
class IntentClassifier:
    def classify_single(self, message: str) -> IntentResult
    def classify_batch(self, messages: List[str]) -> List[IntentResult]
    def update_prompt_template(self, template: str) -> None
```

## 5. Prompt 工程
提供完整的 Claude prompt 模板，包括：
- System prompt
- Few-shot examples
- 输出格式约束

## 6. 测试用例
提供至少10个测试样本及预期结果
```

---

### **提示词 3.3: 模块规格 - Dialog Manager**

```
为 Dialog Manager 模块编写规格（module-specs/dialog-manager.md）：

## 核心功能
1. 上下文管理
   - 维护多轮对话历史
   - 跟踪对话状态机
   - 上下文窗口管理（最近N轮）

2. 状态转换
   定义对话状态图（使用 Mermaid）：
   - 初始化 -> 意图识别 -> 信息收集 -> 响应生成 -> 结束/继续

3. 槽位填充（Slot Filling）
   针对订单查询等需多轮交互的场景

## 实现要点
- 使用 Redis 存储会话状态
- 超时机制（30分钟无活动自动关闭）
- 支持对话回滚

## 数据结构
```python
class DialogState(BaseModel):
    session_id: str
    current_intent: Optional[str]
    slots: Dict[str, Any] = {}
    history: List[Message] = []
    turn_count: int = 0
    
class DialogManager:
    def process_turn(self, session_id: str, message: str) -> DialogState
    def reset_session(self, session_id: str) -> None
```

提供完整的状态转换逻辑和示例对话流程
```

---

### **提示词 3.4: 模块规格 - Knowledge Retriever**

```
为 Knowledge Retriever 编写规格（module-specs/knowledge-retriever.md）：

## 检索策略
1. 语义检索（Embedding-based）
   - 使用 Claude Embeddings API
   - 向量数据库：Pinecone
   - Top-K 检索（K=5）

2. 混合检索
   - 结合关键词匹配（BM25）
   - 重排序（Reranking）

3. 缓存策略
   - 高频问题缓存到 Redis
   - TTL: 1小时

## 知识库结构
```python
class KnowledgeItem(BaseModel):
    id: str
    question: str
    answer: str
    category: str
    tags: List[str]
    embedding: List[float]
    priority: int  # 用于相同分数时的排序
```

## 检索流程
1. 查询预处理（去停用词、同义词扩展）
2. 向量检索
3. 过滤与重排
4. 返回 Top-3 结果

## 性能要求
- 检索延迟 < 200ms (P95)
- 召回率 > 80%

提供 prompt 模板，让 Claude 基于检索结果生成最终答案
```

---

### **提示词 3.5: 核心代码生成**

```
现在开始实现代码。请生成以下文件的完整代码：

1. src/agent/intent_classifier.py
   - 实现 IntentClassifier 类
   - 包含完整的 Claude API 调用
   - 异常处理和日志记录

2. src/agent/dialog_manager.py
   - 实现 DialogManager 类
   - Redis 集成
   - 状态持久化

3. src/agent/knowledge_retriever.py
   - 实现 KnowledgeRetriever 类
   - Pinecone 集成
   - 缓存逻辑

4. src/api/routes.py
   - FastAPI 路由定义
   - 请求验证和响应格式化

5. src/config.py
   - 配置管理（使用 Pydantic Settings）
   - 环境变量加载

要求：
- 完整可运行的代码
- 类型注解
- 详细注释
- 错误处理
- 单元测试（使用 pytest）

每个文件分别生成，包含使用示例。
```

---

### Phase 4: 测试阶段（04-testing/）

#### **提示词 4.1: 测试计划**

```
生成测试计划（test-plan.md），包含：

## 1. 测试策略
- 单元测试（覆盖率 > 80%）
- 集成测试
- 端到端测试
- 性能测试
- 压力测试

## 2. 测试环境
- 开发环境
- 预发布环境
- 生产环境镜像

## 3. 测试工具
- pytest（单元测试）
- locust（压力测试）
- postman（API测试）

## 4. 测试数据准备
- Mock Claude API 响应
- 测试知识库（100+条目）
- 用户对话样本（50+场景）

## 5. 回归测试策略
- 每次代码提交触发单元测试
- 每日集成测试
- 发布前全量测试

## 6. 缺陷管理
- 严重等级定义
- 修复时间SLA
```

#### **提示词 4.2: 测试用例**

```
生成详细测试用例（test-cases.md），使用表格格式：

| 用例ID | 模块 | 测试场景 | 输入 | 预期输出 | 优先级 |
|--------|------|----------|------|----------|--------|
| TC-001 | Intent Classifier | 产品咨询识别 | "你们有什么手机型号" | intent="product_inquiry", confidence>0.8 | P0 |
| TC-002 | Dialog Manager | 多轮对话 | 3轮订单查询对话 | 成功收集订单号并查询 | P0 |
| TC-003 | Knowledge Retriever | 知识检索 | "如何退货" | 返回退货流程相关答案 | P0 |

至少覆盖50个测试用例，包括：
- 正常流程
- 异常场景（如API超时、无效输入）
- 边界条件
- 性能测试用例

并生成对应的 pytest 代码示例：
```python
# tests/test_intent_classifier.py
import pytest
from src.agent.intent_classifier import IntentClassifier

@pytest.fixture
def classifier():
    return IntentClassifier()

def test_product_inquiry_intent(classifier):
    result = classifier.classify_single("你们有什么手机型号")
    assert result.intent == "product_inquiry"
    assert result.confidence > 0.7

# 提供完整的测试代码
```
```

---

### Phase 5: 部署阶段（05-deployment/）

#### **提示词 5.1: 部署指南**

```
生成部署指南（deployment-guide.md），包含：

## 1. 环境准备
```bash
# 系统要求
OS: Ubuntu 22.04 LTS
Python: 3.11+
RAM: 8GB+
CPU: 4 cores+

# 依赖安装
sudo apt update
sudo apt install python3.11 python3-pip redis-server
```

## 2. 应用部署
### 2.1 使用 Docker
```dockerfile
# Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2.2 使用 Docker Compose
提供完整的 docker-compose.yml，包含：
- FastAPI 服务
- Redis
- Nginx（反向代理）

## 3. 配置管理
- 环境变量列表
- 配置文件模板
- 密钥管理（使用 AWS Secrets Manager）

## 4. 健康检查
- /health 端点实现
- 启动探针和就绪探针

## 5. 蓝绿部署策略
- 部署流程图
- 回滚方案

## 6. 监控告警
- Prometheus metrics 暴露
- Grafana 面板配置
- 告警规则设置
```

#### **提示词 5.2: 运维手册**

```
生成运维手册（operations.md），包含：

## 1. 日常运维
### 1.1 服务启动/停止
```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 查看日志
docker-compose logs -f app
```

### 1.2 日志管理
- 日志路径：/var/log/customer-agent/
- 轮转策略：每日轮转，保留30天
- 日志级别调整

## 2. 故障排查
### 常见问题和解决方案表格

| 问题 | 症状 | 排查步骤 | 解决方案 |
|------|------|----------|----------|
| Claude API 超时 | 响应时间>5s | 检查网络、API key | 增加超时时间/切换备用key |
| Redis 连接失败 | 500错误 | 检查Redis状态 | 重启Redis服务 |

## 3. 性能优化
- 数据库查询优化
- 缓存命中率提升
- API 限流配置

## 4. 备份恢复
- 知识库备份（每日）
- 对话历史归档（每周）
- 恢复流程SOP

## 5. 安全加固
- API 访问控制
- 敏感信息脱敏
- 定期安全扫描

## 6. 容量规划
- 当前QPS：100
- 扩容阈值：CPU > 70%
- 水平扩展方案（K8s HPA）
```

---

## 🎯 Claude CLI 实战工作流

### **完整开发流程示例**

```bash
# Step 1: 创建项目目录结构
mkdir -p customer-agent-ai/{docs,src,tests}
cd customer-agent-ai

# Step 2: 初始化文档目录
mkdir -p docs/{01-requirements,02-design,03-development/module-specs,04-testing,05-deployment}

# Step 3: 使用Claude生成PRD
claude chat --save-history prd-session.json
# 输入提示词 1.1，复制输出到 docs/01-requirements/PRD.md

# Step 4: 生成用户故事
claude --file docs/01-requirements/PRD.md "基于这个PRD生成用户故事" > docs/01-requirements/user-stories.md

# Step 5: 设计阶段（逐个生成设计文档）
claude chat
# 输入提示词 2.1、2.2、2.3，分别保存

# Step 6: 代码生成
claude --file docs/02-design/architecture.md --file docs/02-design/api-spec.md "根据这些设计文档生成 src/agent/intent_classifier.py 的完整代码"

# Step 7: 测试用例生成
claude --file docs/03-development/module-specs/ "为所有模块生成pytest测试用例"

# Step 8: 部署配置生成
claude "生成包含FastAPI、Redis、Nginx的docker-compose.yml"
```

---

## 💡 高级技巧

### **1. 使用项目上下文（Projects功能）**
```bash
# 将整个项目作为上下文
claude --project customer-agent-ai chat

# Claude会自动读取项目文件，提供更精准的建议
```

### **2. 迭代优化**
```
# 第一轮：生成基础代码
"生成 IntentClassifier 的基础实现"

# 第二轮：添加功能
"在现有代码基础上添加批量处理功能"

# 第三轮：优化性能
"优化代码性能，添加缓存机制"

# 第四轮：补充测试
"为刚才的代码生成完整的单元测试"
```

### **3. 代码审查**
```bash
claude --file src/agent/dialog_manager.py "审查这段代码，指出潜在问题和改进建议，包括：
1. 代码质量（可读性、可维护性）
2. 性能问题
3. 安全漏洞
4. 最佳实践遵循情况
给出具体的修改建议和代码示例"
```

---

## 📚 参考资料模板

创建 `docs/README.md`:
```markdown
# 智能客服Agent项目文档

## 文档导航
- [需求文档](01-requirements/PRD.md)
- [架构设计](02-design/architecture.md)
- [API规格](02-design/api-spec.md)
- [编码规范](03-development/coding-standards.md)
- [测试计划](04-testing/test-plan.md)
- [部署指南](05-deployment/deployment-guide.md)

## 快速开始
```bash
git clone <repo>
cd customer-agent-ai
docker-compose up -d
```

## 贡献指南
遵循 [编码规范](03-development/coding-standards.md)
```

---

## ✅ 验收检查清单

完成开发后，使用以下提示词进行最终验收：

```
请作为高级技术专家，审查整个智能客服Agent项目，包括：

1. **文档完整性**
   - 所有 DDAD 文档是否齐全
   - 文档之间是否一致

2. **代码质量**
   - 是否遵循编码规范
   - 测试覆盖率是否达标
   - 异常处理是否完善

3. **功能完整性**
   - 所有用户故事是否实现
   - API 是否符合规格
   - 性能是否达标

4. **生产就绪度**
   - 部署文档是否可执行
   - 监控告警是否配置
   - 安全措施是否到位

给出评分（1-10分）和具体改进建议。
```

---

开始你的第一步吧！先运行 `claude chat`，输入提示词 1.1 生成PRD，逐步构建你的智能客服Agent! 🚀