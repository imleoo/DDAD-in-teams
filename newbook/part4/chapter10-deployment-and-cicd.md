# 第十章：部署与持续集成 (CI/CD)

> **本章导读**
>
> 开发和测试完成后，我们的智能客服Agent已经准备好上线服务了。本章是DDAD流程的“最后一公里”，我们将把应用打包、部署到云端，并建立一套自动化的CI/CD（持续集成/持续部署）流水线。你将学会如何利用AI生成部署脚本和配置文件，实现高效、可靠的自动化交付。

---

## 10.1 部署策略：容器化与云原生

为了实现环境一致性、简化部署并具备良好的扩展性，我们选择**容器化**作为核心部署策略。

- **Docker**: 我们将使用Docker将我们的FastAPI应用及其所有Python依赖打包成一个标准的、可移植的镜像。
- **云平台**: MVP阶段，我们可以选择任何支持容器的云平台，如AWS ECS, Google Cloud Run, 或是一个简单的云服务器（VPS）。

### 10.1.1 AI生成Dockerfile

我们可以让AI为我们的Python应用生成一个优化的`Dockerfile`。

**指令 (Prompt):**
```
请为我的FastAPI项目生成一个多阶段构建的Dockerfile。

**要求:**
1.  使用Python 3.10官方镜像。
2.  第一阶段用于安装依赖，以利用Docker的层缓存。
3.  第二阶段构建一个更小的生产镜像，只包含必要的代码和依赖。
4.  使用非root用户运行应用，以增强安全性。
5.  应用通过`uvicorn src.main:app --host 0.0.0.0 --port 8000`启动。
```

**AI生成的 `Dockerfile`:**
```dockerfile
# ---- Stage 1: Build ----
# 使用官方Python镜像作为构建环境
FROM python:3.10-slim as builder

WORKDIR /app

# 安装Poetry（或pip），并配置虚拟环境
RUN pip install poetry
COPY poetry.lock pyproject.toml ./
RUN poetry config virtualenvs.in-project true && poetry install --no-dev

# ---- Stage 2: Production ----
# 使用一个更小的基础镜像
FROM python:3.10-slim

WORKDIR /app

# 创建非root用户
RUN useradd --create-home appuser
USER appuser

# 从构建阶段复制虚拟环境和源代码
COPY --from=builder /app/.venv ./.venv
COPY src/ ./src

# 设置PATH，让我们可以直接运行venv中的命令
ENV PATH="/app/.venv/bin:$PATH"

# 暴露端口
EXPOSE 8000

# 启动应用的命令
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```
**DDAD价值**: AI不仅能生成一个可用的`Dockerfile`，还能融入多阶段构建、非root用户等最佳实践，这是初级开发者手动编写时容易忽略的。这份文档化的部署配置，保证了任何环境下的部署都是一致和可复现的。

---

## 10.2 持续集成 (CI)：自动化质量门禁

CI的核心思想是，每当有代码提交到主分支时，都自动运行一系列检查，以确保新的代码没有破坏现有功能。

### 10.2.1 CI流水线设计

我们将使用GitHub Actions来构建我们的CI流水线。

**`.github/workflows/ci.yml`**
```yaml
name: Continuous Integration

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test-and-lint:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Set up Python 3.10
      uses: actions/setup-python@v3
      with:
        python-version: '3.10'

    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        pip install pytest flake8

    - name: Lint with flake8
      run: |
        # 检查代码风格
        flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics

    - name: Test with pytest
      run: |
        # 运行所有测试
        pytest
      env:
        OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
        SUPABASE_KEY: ${{ secrets.SUPABASE_KEY }}
```
**DDAD价值**:
- **自动化门禁**: 这份CI配置文件将我们的质量标准（代码风格、单元测试）固化为自动化流程。任何不符合标准的代码提交都会被立即阻止，保证了`main`分支的纯洁性。
- **快速反馈**: 开发者在提交PR后几分钟内就能得到反馈，而不是等到集成阶段才发现问题。

---

## 10.3 持续部署 (CD)：一键发布

CD是CI的延伸，当代码通过所有CI检查后，自动将其部署到生产（或预发布）环境。

### 10.3.1 CD流水线设计

我们扩展`ci.yml`，增加一个只有在`main`分支有推送时才触发的部署任务。

**`.github/workflows/ci.yml` (增加部署部分):**
```yaml
# ... (ci jobs) ...

  deploy:
    # 只有在test-and-lint任务成功后才运行
    needs: test-and-lint
    # 只有在推送到main分支时才运行
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKERHUB_USERNAME }}
        password: ${{ secrets.DOCKERHUB_TOKEN }}

    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: your-dockerhub-repo/customer-mind-api:latest

    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USERNAME }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          # 登录到Docker Hub
          docker login -u ${{ secrets.DOCKERHUB_USERNAME }} -p ${{ secrets.DOCKERHUB_TOKEN }}
          # 拉取最新镜像
          docker pull your-dockerhub-repo/customer-mind-api:latest
          # 停止并删除旧容器（如果存在）
          docker stop customer-mind-container || true
          docker rm customer-mind-container || true
          # 运行新容器
          docker run -d --name customer-mind-container -p 8000:8000 \
            -e OPENAI_API_KEY=${{ secrets.OPENAI_API_KEY }} \
            --restart always \
            your-dockerhub-repo/customer-mind-api:latest
```
**DDAD价值**:
- **发布即文档**: `ci.yml`本身就是一份精确、可执行的部署手册。它消除了手动部署的复杂性和风险。
- **敏捷交付**: 任何合并到`main`分支的功能，都可以在几分钟内自动上线，这使得我们可以以极高的频率发布新功能和修复，快速响应用户反馈。

---

## 10.4 本章小结

我们成功地为智能客服Agent项目画上了句号，实现了从代码到服务的完整闭环。
1.  **容器化部署**: 通过Docker，我们实现了“一次构建，到处运行”，保证了开发、测试和生产环境的一致性。
2.  **CI/CD自动化**: 我们利用GitHub Actions建立了自动化的质量门禁和一键发布流程，极大地提升了交付速度和可靠性。
3.  **AI贯穿始终**: 从生成`Dockerfile`到CI/CD的配置文件，AI在部署阶段同样扮演了“专家顾问”和“高效执行者”的角色。

至此，我们不仅交付了一个可工作的智能客服Agent，更重要的是，我们建立了一套高效、可靠、自动化的**软件交付工厂**。这套工厂能源源不断地将新的想法和需求，快速转化为高质量的线上服务。

**下一部分**，我们将对DDAD方法论进行总结，并展望它在未来软件开发中的巨大潜力。