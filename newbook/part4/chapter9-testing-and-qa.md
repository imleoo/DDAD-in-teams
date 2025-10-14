# 第九章：测试与质量保证

> **本章导读**
>
> 一个没有经过充分测试的系统是脆弱的。在DDAD流程中，测试同样是文档驱动和AI辅助的。本章，我们将为智能客服Agent构建一个从单元测试、集成测试到端到端测试的完整质量保证体系。你将学会如何利用AI大规模生成测试用例，并将其集成到自动化流程中。

---

## 9.1 测试策略与金字塔模型

我们遵循经典的“测试金字塔”模型，它为我们分配测试投入提供了清晰的指引。

- **单元测试 (Unit Tests)**: 构成金字塔的底层，数量最多。专注于测试单个模块或函数，速度快，隔离性好。
- **集成测试 (Integration Tests)**: 中间层。测试多个模块协同工作的正确性，例如测试`DialogManager`是否能正确调用`IntentClassifier`和`KnowledgeRetriever`。
- **端到端测试 (End-to-End Tests)**: 塔尖，数量最少。模拟真实用户操作，从UI交互到数据库验证，确保整个系统的流程正确。

---

## 9.2 单元测试：AI辅助下的效率革命

单元测试是保证代码质量的基础。在DDAD流程中，由于我们有详细的模块规格，AI生成单元测试的效率和覆盖率都极高。

### 9.2.1 AI生成测试用例

回顾第六章，当我们要求AI生成`IntentClassifier`的代码时，我们就明确指示它**同时生成`pytest`单元测试**。

**指令 (Prompt)回顾:**
```
...
5. 在文件末尾，为`IntentClassifier`类生成基础的`pytest`单元测试代码，覆盖规格中定义的所有测试用例。
```

AI基于模块规格中的“测试用例”部分，为我们生成了覆盖所有核心场景的测试代码。

**`tests/agent/test_intent_classifier.py` (AI生成):**
```python
import pytest
from src.agent.intent_classifier import IntentClassifier

# ... (fixture and test cases from Chapter 6) ...

@pytest.mark.parametrize("message, expected_intent", [
    ("我的订单到哪了？", "query_order_status"),
    ("怎么退货", "request_return_policy"),
    ("今天天气怎么样", "other"),
])
def test_classify_intents(classifier, message, expected_intent, mocker):
    # 使用mocker来模拟API调用
    mock_response = mocker.Mock()
    mock_response.choices = [mocker.Mock()]
    mock_response.choices[0].text.strip.return_value = expected_intent
    
    mocker.patch('openai.Completion.create', return_value=mock_response)

    result = classifier.classify(message)
    assert result == expected_intent
```
**DDAD价值**:
- **测试左移**: 测试不再是编码后的一个独立阶段，而是在编码时就一并完成。
- **文档驱动测试**: 模块规格中的“测试用例”部分直接成为了自动化测试的输入，确保了需求、规格和测试的高度一致。
- **覆盖率保障**: AI可以轻松地为所有分支、异常和边界条件生成测试用例，这是手动编写时很容易忽略的。

---

## 9.3 集成测试：验证模块间的协作

集成测试的重点是验证模块之间的“契约”是否被正确遵守。

### 9.3.1 `DialogManager`的集成测试

我们将测试`DialogManager`是否能正确地调度其他模块。

**`tests/agent/test_dialog_manager.py`:**
```python
import pytest
from src.agent.dialog_manager import DialogManager
from src.agent.intent_classifier import IntentClassifier
from src.agent.knowledge_retriever import KnowledgeRetriever

def test_handle_message_query_flow(mocker):
    # 1. Mock依赖模块
    mock_classifier = mocker.Mock(spec=IntentClassifier)
    mock_retriever = mocker.Mock(spec=KnowledgeRetriever)
    
    # 2. 定义Mock行为
    mock_classifier.classify.return_value = "query_product_info"
    mock_retriever.retrieve.return_value = ["这款T恤是100%纯棉的。"]
    
    # Mock LLM调用
    mocker.patch('openai.Completion.create', return_value=mocker.Mock(
        choices=[mocker.Mock(text="当然，这款T恤是100%纯棉的，非常舒适。")]
    ))

    # 3. 初始化被测对象
    dialog_manager = DialogManager(classifier=mock_classifier, retriever=mock_retriever)

    # 4. 执行测试
    response = dialog_manager.handle_message("session_1", "这件T恤是什么材质？")

    # 5. 断言
    # 验证IntentClassifier被正确调用
    mock_classifier.classify.assert_called_once_with("这件T恤是什么材质？")
    # 验证KnowledgeRetriever被正确调用
    mock_retriever.retrieve.assert_called_once_with("这件T恤是什么材质？")
    # 验证最终回复符合预期
    assert "100%纯棉" in response
```
**DDAD价值**:
- **依赖注入**: `DialogManager`的设计（通过`__init__`注入依赖）使得测试非常容易，我们可以用Mock对象替换真实的分类器和检索器。
- **场景化测试**: 集成测试让我们能模拟一个完整的业务场景（用户查询商品信息），并验证整个调用链的正确性。

---

## 9.4 端到端(E2E)测试：模拟真实用户

E2E测试从用户的视角出发，验证整个系统的功能。我们将使用`pytest`和`httpx`库来模拟API客户端。

**`tests/e2e/test_chat_api.py`:**
```python
import pytest
import httpx
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_e2e_order_status_query():
    # 模拟一个完整的对话流程
    session_id = "e2e_test_session_123"

    # 第一次交互：用户问候
    response = client.post("/api/v1/chat", json={
        "session_id": session_id,
        "message": "你好"
    })
    assert response.status_code == 200
    assert "你好" in response.json()["response"]

    # 第二次交互：用户查询订单
    response = client.post("/api/v1/chat", json={
        "session_id": session_id,
        "message": "我的订单12345到哪了？"
    })
    assert response.status_code == 200
    # 这里的断言需要依赖Mock的知识库和LLM返回的特定内容
    assert "正在派送中" in response.json()["response"] 

    # 第三次交互：用户请求转人工
    response = client.post("/api/v1/chat", json={
        "session_id": session_id,
        "message": "转人工"
    })
    assert response.status_code == 200
    assert "正在为您转接" in response.json()["response"]
```
**DDAD价值**:
- **业务流程验证**: E2E测试直接验证了`user-stories.md`中定义的用户旅程，确保最终产品符合用户预期。
- **系统健康检查**: E2E测试是系统能否上线的最后一道防线。一个通过的E2E测试套件能给团队带来极大的信心。

---

## 9.5 本章小结

通过本章的实践，我们为智能客服Agent构建了坚实的质量保障体系。
1.  **AI赋能单元测试**: 利用AI和详细的模块规格，我们可以快速生成高覆盖率的单元测试，极大地提升了开发效率和代码质量。
2.  **分层测试策略**: 我们运用测试金字塔模型，合理分配测试资源，从模块内部逻辑、模块间协作到完整的用户流程，层层设防。
3.  **文档驱动测试**: 无论是单元测试的测试用例，还是E2E测试的业务流程，其源头都来自于我们在规划和设计阶段创建的文档。这保证了开发与测试的最终目标始终统一。

一个经过充分测试的系统，是能够持续、稳定交付价值的基础。

**下一章**，我们将进入项目的最后阶段：部署与持续集成。我们将把应用打包、部署到云端，并建立自动化的CI/CD流水线，实现代码提交后的自动测试与部署。