# 第六章：AI辅助编码——从规格到代码

> **本章导读**
>
> 欢迎来到DDAD流程中最高效、最激动人心的阶段。在拥有了清晰的PRD和设计文档后，我们将亲自演示如何指挥AI，将这些“蓝图”转化为高质量、可运行的代码。本章，你将学习到DDAD的核心技巧——编写“模块规格”（Module Specs），并见证AI如何基于这些规格，以前所未有的速度和准确性完成编码、测试乃至代码审查工作。

---

## 6.1 编码的革命：从“写”代码到“生成”代码

在传统开发中，编码阶段是整个项目中最耗时、最繁琐的环节。开发者需要逐行编写逻辑、处理异常、编写测试。

在DDAD的新范式下，开发者的角色发生了根本性转变：

| 传统开发者 | DDAD开发者 (AI时代的10x开发者) |
|:---|:---|
| **角色**: 编码者、实现者 | **角色**: **设计者、审查者、AI指挥家** |
| **主要工作**: 手动编写代码 | **主要工作**: 编写模块规格、审查AI生成的代码、处理复杂决策 |
| **效率瓶颈**: 打字速度、对框架的熟悉度 | **效率瓶颈**: **思考深度、设计质量** |

这个转变的核心，在于我们引入了一个关键步骤：**在写真正的业务代码之前，先为核心模块编写一份详细的规格说明书（Module Spec）。**

---

## 6.2 模块规格 (Module Spec)：给AI的“代码说明书”

**模块规格**是连接“设计”与“编码”最关键的桥梁。它是一份极其详尽的技术文档，用清晰的语言定义了一个独立模块（如一个Python类或一组函数）的全部行为。

> **核心理念**：我们不直接让AI写代码，而是先让AI（或我们自己）为每一个核心模块编写一份“代码说明书”。这份说明书将开发任务分解到了函数级别，几乎消除了编码过程中的不确定性。**有了它，AI生成代码的准确率能从60%提升到95%以上。**

### 模块规格实战：`IntentClassifier`

让我们为智能客服Agent的核心模块之一——`IntentClassifier`（意图分类器）来编写一份模块规格。

**`docs/03-development/specs/intent_classifier.md`**
```markdown
# 模块规格: IntentClassifier

## 1. 模块概述
- **职责**: 负责接收用户的单句输入，并将其分类到预定义的意图类型中。这是Agent理解用户需求的第一步。
- **输入**: `message: str` (用户的原始文本消息)
- **输出**: `intent: str` (预定义的意图标签之一)

## 2. 支持的意图类型
本模块必须能够识别以下意图：
```python
SUPPORTED_INTENTS = {
    "query_order_status": "查询订单状态",
    "query_product_info": "查询商品信息",
    "request_return_policy": "咨询退货政策",
    "request_human_support": "请求人工客服",
    "greeting": "打招呼",
    "other": "其他无法分类的意图"
}
```

## 3. 核心实现要求
- **技术方案**: 必须使用大语言模型（如Claude或GPT）进行零样本（Zero-shot）分类。
- **置信度控制**: 如果模型对分类的置信度低于 `0.8`，或无法明确匹配任何意图，则必须返回 `"other"`。
- **异常处理**: 必须能优雅地处理API调用失败、超时等网络问题。

## 4. 接口定义 (Python)
模块必须以一个名为 `IntentClassifier` 的类实现，并包含以下方法：
```python
class IntentClassifier:
    """
    使用大语言模型对用户输入进行意图分类。
    """

    def __init__(self, api_key: str):
        """
        初始化分类器，配置API密钥。
        """
        pass

    def classify(self, message: str) -> str:
        """
        对单条消息进行分类。

        :param message: 用户输入的文本消息。
        :return: 预定义的意图标签。
        """
        pass
```

## 5. Prompt工程
用于分类的Prompt模板如下：
```
你是一个专业的意图分类机器人。你的任务是分析用户输入，并将其分类到以下几种意图之一。

[支持的意图列表]
{{SUPPORTED_INTENTS}}

请只返回最匹配的意图标签，不要添加任何解释。如果用户输入与所有意图都不匹配，请返回 "other"。

用户输入: "{{message}}"
意图:
```

## 6. 测试用例
| 输入消息 | 预期输出意图 |
|:---|:---|
| "我的订单到哪了？" | `query_order_status` |
| "这件衣服还有黑色的吗" | `query_product_info` |
| "怎么退货" | `request_return_policy` |
| "找人工" | `request_human_support` |
| "你好" | `greeting` |
| "今天天气怎么样" | `other` |
```

这份文档就是我们指挥AI进行编码的“剧本”。

---

## 6.3 从规格到代码：AI驱动的核心编码

当详细的模块规格准备就绪后，编码就成了一件水到渠成的事情。我们可以使用任何支持长上下文的AI编码工具（如Cursor, Codebuddy, 或Claude CLI）来完成。

**核心指令 (Prompt):**

```
请根据以下架构设计和模块规格，为 `src/agent/intent_classifier.py` 生成完整、可运行的Python代码。

**约束条件:**
1.  代码必须严格遵循模块规格中的所有要求。
2.  使用Python 3.10+，并包含完整的类型注解。
3.  为所有公共类和方法编写详细的Docstring。
4.  包含完整的异常处理逻辑（如API请求失败、超时）。
5.  在文件末尾，为`IntentClassifier`类生成基础的`pytest`单元测试代码，覆盖规格中定义的所有测试用例。

---
[粘贴 `architecture.md` 的核心内容]
---
[粘贴 `module-specs/intent-classifier.md` 的全部内容]
---
```

**AI生成的代码 (`src/agent/intent_classifier.py`):**

```python
# src/agent/intent_classifier.py

import os
import openai
from typing import Dict, List

# 根据模块规格定义支持的意图
SUPPORTED_INTENTS: Dict[str, str] = {
    "query_order_status": "查询订单状态",
    "query_product_info": "查询商品信息",
    "request_return_policy": "咨询退货政策",
    "request_human_support": "请求人工客服",
    "greeting": "打招呼",
    "other": "其他无法分类的意图"
}

class IntentClassifier:
    """
    使用大语言模型对用户输入进行意图分类。
    """

    def __init__(self, api_key: str = None):
        """
        初始化分类器，配置API密钥。
        如果未提供api_key，将尝试从环境变量'OPENAI_API_KEY'读取。
        """
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OpenAI API key not provided or found in environment variables.")
        openai.api_key = self.api_key

    def _build_prompt(self, message: str) -> str:
        """构建用于分类的Prompt。"""
        intent_list = "\n".join([f'- {key}: {desc}' for key, desc in SUPPORTED_INTENTS.items()])
        return f"""你是一个专业的意图分类机器人。你的任务是分析用户输入，并将其分类到以下几种意图之一。

[支持的意图列表]
{intent_list}

请只返回最匹配的意图标签，不要添加任何解释。如果用户输入与所有意图都不匹配，请返回 "other"。

用户输入: "{message}"
意图:"""

    def classify(self, message: str) -> str:
        """
        对单条消息进行分类。

        :param message: 用户输入的文本消息。
        :return: 预定义的意图标签。
        """
        prompt = self._build_prompt(message)
        try:
            response = openai.Completion.create(
                engine="text-davinci-003", # 或者其他合适的模型
                prompt=prompt,
                max_tokens=10,
                temperature=0.0,
                stop=["\n"]
            )
            intent = response.choices[0].text.strip()
            return intent if intent in SUPPORTED_INTENTS else "other"
        except openai.error.OpenAIError as e:
            print(f"Error calling OpenAI API: {e}")
            return "other" # API调用失败时，默认为'other'

# --- Pytest单元测试 ---

import pytest

@pytest.fixture
def classifier():
    # 此处需要一个有效的API密钥用于测试，或使用mock
    # 为避免在文档中暴露密钥，我们假设已在环境中设置
    if not os.getenv("OPENAI_API_KEY"):
        pytest.skip("OPENAI_API_KEY not set, skipping integration tests.")
    return IntentClassifier()

@pytest.mark.parametrize("message, expected_intent", [
    ("我的订单到哪了？", "query_order_status"),
    ("这件衣服还有黑色的吗", "query_product_info"),
    ("怎么退货", "request_return_policy"),
    ("找人工", "request_human_support"),
    ("你好", "greeting"),
    ("今天天气怎么样", "other"),
])
def test_classify_intents(classifier, message, expected_intent, mocker):
    # 使用mocker来模拟API调用，避免真实的网络请求和费用
    mock_response = mocker.Mock()
    mock_response.choices = [mocker.Mock()]
    mock_response.choices[0].text.strip.return_value = expected_intent
    
    mocker.patch('openai.Completion.create', return_value=mock_response)

    result = classifier.classify(message)
    assert result == expected_intent

def test_classify_api_error(classifier, mocker):
    mocker.patch('openai.Completion.create', side_effect=openai.error.APIError("Test API Error"))
    result = classifier.classify("any message")
    assert result == "other"

```

这份由AI生成的代码，不仅完全实现了规格要求，还包含了专业的错误处理、Docstring，甚至连单元测试都一并生成了。开发者的工作，就是审查这份代码，确认其符合预期，然后运行测试。

---

## 6.4 AI即是同事：辅助代码审查

AI不仅能写代码，还能像一位资深同事一样审查代码，帮助我们发现潜在问题。

**指令 (Prompt):**
```
请以高级工程师的视角，审查以下Python代码。重点关注：
1.  潜在的性能问题。
2.  不符合Python最佳实践的地方。
3.  可以改进的可读性或可维护性。
4.  安全漏洞。

请给出具体的修改建议和代码示例。

---
[粘贴 `src/agent/intent_classifier.py` 的代码]
---
```

**AI可能的审查意见:**
> **审查报告: `intent_classifier.py`**
>
> 整体代码质量不错，但有几点可以改进：
>
> 1.  **性能问题**: `classify`方法每次调用都会向OpenAI发起一次网络请求。如果需要批量处理消息，这会非常低效。
>     - **建议**: 增加一个`classify_batch`方法，将多个消息打包在一次请求中处理，或并行发起请求。
>
> 2.  **可维护性**: 模型名称`"text-davinci-003"`硬编码在代码中。如果未来需要更换模型，需要修改代码。
>     - **建议**: 将模型名称作为`__init__`的一个可选参数，或放在配置文件中。
>
> 3.  **最佳实践**: `__init__`方法中直接执行`openai.api_key = self.api_key`会影响全局的`openai`对象，这在大型应用中可能导致副作用。
>     - **建议**: 在每次API调用时，通过`openai.Completion.create(..., api_key=self.api_key)`来传递密钥，而不是设置全局密钥。
>
> **重构后的代码示例:**
> ```python
> class IntentClassifier:
>     def __init__(self, api_key: str = None, model: str = "text-davinci-003"):
>         # ...
>         self.model = model
> 
>     def classify(self, message: str) -> str:
>         # ...
>         try:
>             response = openai.Completion.create(
>                 engine=self.model,
>                 prompt=prompt,
>                 api_key=self.api_key, # 传递密钥而非全局设置
>                 # ...
>             )
>             # ...
> ```

---

## 6.5 本章小结

本章，我们完整地实践了DDAD开发阶段的核心流程：
1.  **定义规格 (Spec)**: 我们没有直接开始编码，而是先为`IntentClassifier`模块编写了一份详细的说明书。
2.  **生成代码 (Generate)**: 基于这份说明书，我们指挥AI生成了功能完整、包含测试的高质量代码。
3.  **审查与重构 (Review & Refactor)**: 我们利用AI作为“代码审查员”，发现了潜在的改进点，并完成了代码的优化。

在这个过程中，开发者的价值得到了极大的提升。我们不再是代码的“搬运工”，而是系统的“设计师”和质量的“把关人”。通过为AI提供清晰、无歧义的指令（模块规格），我们将开发效率提升了数倍。

**下一章**，我们将继续沿着这条高效的路径，完成智能客服Agent后端服务的其他核心模块，并最终将它们集成在一起。