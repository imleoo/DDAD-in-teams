# 第七章：测试部署与质量保证

> **本章导读**
>
> 在AI驱动的开发流程中，如何确保代码质量和系统稳定性？本章将深入探讨DDAD环境下的测试部署与质量保证体系，包括AI辅助测试策略、自动化部署流程、生产环境监控，以及如何建立可持续的质量保证机制。我们将学习如何让AI生成的代码在生产环境中稳定可靠地运行。

---

## 7.1 AI驱动的测试策略

### 7.1.1 测试范式转变

传统测试流程往往是开发完成后的"事后检验"，而在DDAD模式下，我们需要建立"测试前置"的新范式：

#### 传统测试 vs AI驱动测试

| 维度 | 传统测试 | AI驱动测试 |
|------|----------|------------|
| **测试用例生成** | 手动编写，耗时长 | AI自动生成，覆盖率高 |
| **测试数据准备** | 手动构造，场景有限 | AI生成多样化测试数据 |
| **回归测试** | 手动执行，容易遗漏 | 自动化执行，全面覆盖 |
| **性能测试** | 定期执行，反馈滞后 | 持续监控，实时预警 |
| **缺陷分析** | 人工分析，主观性强 | AI辅助分析，客观准确 |

#### DDAD测试核心原则

1. **测试即文档**：测试用例本身就是最准确的功能规格说明
2. **质量内建**：从第一行代码开始就有完整的测试覆盖
3. **持续验证**：每次代码变更都触发全面的质量检查
4. **智能分析**：利用AI分析测试结果，预测潜在问题

### 7.1.2 AI辅助测试用例生成

#### 基于需求的测试用例生成

使用AI从PRD和用户故事中自动生成测试用例：

**Prompt模板：测试用例生成**

```markdown
# 测试用例生成提示词

## 角色设定
你是一位资深的测试工程师，擅长从需求文档中提取测试场景，设计全面的测试用例。

## 任务描述
基于以下功能需求，生成完整的测试用例集合，包括正常流程、异常流程和边界条件测试。

## 输入信息
**功能需求**：{功能描述}
**验收标准**：{验收条件}
**技术约束**：{技术限制}

## 输出要求
1. **功能测试用例**
   - 正常流程测试（Happy Path）
   - 异常流程测试（Error Cases）
   - 边界值测试（Boundary Testing）

2. **非功能测试用例**
   - 性能测试场景
   - 安全测试场景
   - 兼容性测试场景

3. **测试数据设计**
   - 有效数据集
   - 无效数据集
   - 边界数据集

## 输出格式
使用标准的测试用例格式，包含：测试ID、测试标题、前置条件、测试步骤、预期结果、优先级。
```

#### 实际应用示例：TechMeet音频上传功能

**输入需求**：
```markdown
功能：用户可以上传音频文件进行会议转录
验收标准：
- 支持MP3、WAV、M4A格式
- 文件大小限制100MB
- 上传过程显示进度
- 上传失败时显示错误信息
```

**AI生成的测试用例**：

```typescript
// tests/upload.test.ts
describe('音频上传功能测试', () => {
  // 正常流程测试
  describe('正常流程', () => {
    test('TC001: 成功上传MP3文件', async () => {
      const file = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' });
      const result = await uploadAudio(file);
      
      expect(result.success).toBe(true);
      expect(result.fileUrl).toBeDefined();
      expect(result.meetingId).toBeDefined();
    });

    test('TC002: 上传过程显示进度', async () => {
      const file = new File(['audio content'], 'test.wav', { type: 'audio/wav' });
      const progressCallback = jest.fn();
      
      await uploadAudio(file, { onProgress: progressCallback });
      
      expect(progressCallback).toHaveBeenCalled();
      expect(progressCallback).toHaveBeenCalledWith(expect.objectContaining({
        loaded: expect.any(Number),
        total: expect.any(Number)
      }));
    });
  });

  // 异常流程测试
  describe('异常流程', () => {
    test('TC003: 不支持的文件格式', async () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      
      await expect(uploadAudio(file)).rejects.toThrow('不支持的文件格式');
    });

    test('TC004: 文件大小超限', async () => {
      const largeContent = 'x'.repeat(100 * 1024 * 1024 + 1); // 超过100MB
      const file = new File([largeContent], 'large.mp3', { type: 'audio/mpeg' });
      
      await expect(uploadAudio(file)).rejects.toThrow('文件大小不能超过100MB');
    });

    test('TC005: 网络错误处理', async () => {
      // 模拟网络错误
      jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network Error'));
      
      const file = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' });
      
      await expect(uploadAudio(file)).rejects.toThrow('上传失败，请检查网络连接');
    });
  });

  // 边界值测试
  describe('边界值测试', () => {
    test('TC006: 最大允许文件大小', async () => {
      const maxContent = 'x'.repeat(100 * 1024 * 1024); // 恰好100MB
      const file = new File([maxContent], 'max.mp3', { type: 'audio/mpeg' });
      
      const result = await uploadAudio(file);
      expect(result.success).toBe(true);
    });

    test('TC007: 最小文件大小', async () => {
      const file = new File(['x'], 'min.mp3', { type: 'audio/mpeg' });
      
      const result = await uploadAudio(file);
      expect(result.success).toBe(true);
    });
  });
});
```

### 7.1.3 智能测试数据生成

#### AI生成真实测试数据

传统的测试数据往往过于简单，无法覆盖真实场景的复杂性。使用AI可以生成更贴近真实业务的测试数据：

```typescript
// lib/test-data-generator.ts
import { faker } from '@faker-js/faker';

export class AITestDataGenerator {
  // 生成用户测试数据
  static generateUsers(count: number = 10) {
    return Array.from({ length: count }, () => ({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      createdAt: faker.date.past(),
      preferences: {
        language: faker.helpers.arrayElement(['zh-CN', 'en-US', 'ja-JP']),
        timezone: faker.location.timeZone(),
        notifications: faker.datatype.boolean()
      }
    }));
  }

  // 生成会议测试数据
  static generateMeetings(userIds: string[], count: number = 20) {
    return Array.from({ length: count }, () => ({
      id: faker.string.uuid(),
      title: faker.company.catchPhrase(),
      description: faker.lorem.paragraph(),
      hostId: faker.helpers.arrayElement(userIds),
      participants: faker.helpers.arrayElements(userIds, { min: 2, max: 8 }),
      startTime: faker.date.future(),
      duration: faker.number.int({ min: 30, max: 180 }), // 30-180分钟
      status: faker.helpers.arrayElement(['scheduled', 'in_progress', 'completed', 'cancelled']),
      audioFile: {
        url: faker.internet.url(),
        size: faker.number.int({ min: 1024 * 1024, max: 100 * 1024 * 1024 }), // 1MB-100MB
        format: faker.helpers.arrayElement(['mp3', 'wav', 'm4a'])
      }
    }));
  }

  // 生成AI分析结果测试数据
  static generateInsights(meetingId: string) {
    return {
      meetingId,
      transcription: faker.lorem.paragraphs(5),
      summary: faker.lorem.paragraph(),
      keyPoints: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => 
        faker.lorem.sentence()
      ),
      actionItems: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
        id: faker.string.uuid(),
        description: faker.lorem.sentence(),
        assignee: faker.person.fullName(),
        dueDate: faker.date.future(),
        priority: faker.helpers.arrayElement(['high', 'medium', 'low'])
      })),
      decisions: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => ({
        id: faker.string.uuid(),
        description: faker.lorem.sentence(),
        context: faker.lorem.paragraph(),
        impact: faker.helpers.arrayElement(['high', 'medium', 'low'])
      }))
    };
  }
}
```

#### 数据驱动测试

使用生成的测试数据进行参数化测试：

```typescript
// tests/meeting-analysis.test.ts
describe('会议分析功能', () => {
  let testUsers: any[];
  let testMeetings: any[];

  beforeAll(() => {
    testUsers = AITestDataGenerator.generateUsers(50);
    testMeetings = AITestDataGenerator.generateMeetings(
      testUsers.map(u => u.id), 
      100
    );
  });

  test.each(testMeetings.slice(0, 10))('分析会议: $title', async (meeting) => {
    const insights = await analyzeMeeting(meeting.id);
    
    expect(insights).toMatchObject({
      meetingId: meeting.id,
      transcription: expect.any(String),
      summary: expect.any(String),
      keyPoints: expect.arrayContaining([expect.any(String)]),
      actionItems: expect.arrayContaining([
        expect.objectContaining({
          description: expect.any(String),
          assignee: expect.any(String)
        })
      ])
    });
  });
});
```

---

## 7.2 自动化测试体系

### 7.2.1 分层测试策略

采用测试金字塔模型，建立分层的自动化测试体系：

```
        /\
       /  \
      / E2E \     <- 少量端到端测试
     /______\
    /        \
   /Integration\ <- 适量集成测试
  /__________\
 /            \
/  Unit Tests  \   <- 大量单元测试
/______________\
```

#### 单元测试（Unit Tests）

**覆盖率要求**：≥ 80%
**执行频率**：每次代码提交
**测试范围**：函数、类、组件的独立功能

```typescript
// tests/unit/audio-processor.test.ts
import { AudioProcessor } from '@/lib/audio-processor';

describe('AudioProcessor', () => {
  let processor: AudioProcessor;

  beforeEach(() => {
    processor = new AudioProcessor();
  });

  describe('validateFile', () => {
    test('应该接受有效的音频文件', () => {
      const validFile = new File(['content'], 'test.mp3', { type: 'audio/mpeg' });
      
      expect(() => processor.validateFile(validFile)).not.toThrow();
    });

    test('应该拒绝无效的文件格式', () => {
      const invalidFile = new File(['content'], 'test.txt', { type: 'text/plain' });
      
      expect(() => processor.validateFile(invalidFile))
        .toThrow('不支持的文件格式');
    });

    test('应该拒绝超大文件', () => {
      const largeFile = new File(['x'.repeat(101 * 1024 * 1024)], 'large.mp3', { 
        type: 'audio/mpeg' 
      });
      
      expect(() => processor.validateFile(largeFile))
        .toThrow('文件大小不能超过100MB');
    });
  });

  describe('extractMetadata', () => {
    test('应该提取音频文件元数据', async () => {
      const file = new File(['mock audio data'], 'test.mp3', { type: 'audio/mpeg' });
      
      const metadata = await processor.extractMetadata(file);
      
      expect(metadata).toMatchObject({
        duration: expect.any(Number),
        format: 'mp3',
        size: expect.any(Number)
      });
    });
  });
});
```

#### 集成测试（Integration Tests）

**覆盖率要求**：≥ 60%
**执行频率**：每次PR合并
**测试范围**：模块间交互、API集成、数据库操作

```typescript
// tests/integration/meeting-workflow.test.ts
import { createTestClient } from '@/lib/test-utils';
import { setupTestDatabase, cleanupTestDatabase } from '@/lib/test-db';

describe('会议工作流集成测试', () => {
  let client: any;
  let testUser: any;

  beforeAll(async () => {
    await setupTestDatabase();
    client = createTestClient();
    testUser = await client.createUser({
      name: 'Test User',
      email: 'test@example.com'
    });
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  test('完整的会议处理流程', async () => {
    // 1. 创建会议
    const meeting = await client.createMeeting({
      title: '测试会议',
      hostId: testUser.id
    });

    expect(meeting.id).toBeDefined();
    expect(meeting.status).toBe('created');

    // 2. 上传音频文件
    const audioFile = new File(['mock audio'], 'test.mp3', { type: 'audio/mpeg' });
    const uploadResult = await client.uploadAudio(meeting.id, audioFile);

    expect(uploadResult.success).toBe(true);
    expect(uploadResult.fileUrl).toBeDefined();

    // 3. 触发AI分析
    const analysisResult = await client.analyzeMeeting(meeting.id);

    expect(analysisResult.status).toBe('processing');

    // 4. 等待分析完成（模拟异步处理）
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 5. 获取分析结果
    const insights = await client.getMeetingInsights(meeting.id);

    expect(insights).toMatchObject({
      transcription: expect.any(String),
      summary: expect.any(String),
      keyPoints: expect.any(Array),
      actionItems: expect.any(Array)
    });

    // 6. 验证数据库状态
    const updatedMeeting = await client.getMeeting(meeting.id);
    expect(updatedMeeting.status).toBe('analyzed');
  });
});
```

#### 端到端测试（E2E Tests）

**覆盖率要求**：≥ 30%（关键用户路径）
**执行频率**：每日构建
**测试范围**：完整用户场景、跨浏览器兼容性

```typescript
// tests/e2e/meeting-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('会议管理端到端测试', () => {
  test('用户可以创建会议并上传音频', async ({ page }) => {
    // 1. 登录
    await page.goto('/login');
    await page.fill('[data-testid=email]', 'test@example.com');
    await page.fill('[data-testid=password]', 'password123');
    await page.click('[data-testid=login-button]');

    // 2. 导航到会议页面
    await page.click('[data-testid=meetings-nav]');
    await expect(page).toHaveURL('/meetings');

    // 3. 创建新会议
    await page.click('[data-testid=create-meeting-button]');
    await page.fill('[data-testid=meeting-title]', '端到端测试会议');
    await page.fill('[data-testid=meeting-description]', '这是一个自动化测试会议');
    await page.click('[data-testid=save-meeting-button]');

    // 4. 验证会议创建成功
    await expect(page.locator('[data-testid=meeting-title]')).toContainText('端到端测试会议');

    // 5. 上传音频文件
    const fileInput = page.locator('[data-testid=audio-upload-input]');
    await fileInput.setInputFiles('tests/fixtures/sample-audio.mp3');

    // 6. 验证上传进度
    await expect(page.locator('[data-testid=upload-progress]')).toBeVisible();
    
    // 7. 等待上传完成
    await expect(page.locator('[data-testid=upload-success]')).toBeVisible({ timeout: 30000 });

    // 8. 验证分析开始
    await expect(page.locator('[data-testid=analysis-status]')).toContainText('分析中');

    // 9. 等待分析完成
    await expect(page.locator('[data-testid=transcription]')).toBeVisible({ timeout: 60000 });

    // 10. 验证分析结果
    await expect(page.locator('[data-testid=summary]')).toBeVisible();
    await expect(page.locator('[data-testid=action-items]')).toBeVisible();
  });

  test('用户可以查看和编辑行动项', async ({ page }) => {
    // 前置条件：已有分析完成的会议
    await page.goto('/meetings/test-meeting-id');

    // 1. 查看行动项列表
    await expect(page.locator('[data-testid=action-items-list]')).toBeVisible();

    // 2. 编辑第一个行动项
    await page.click('[data-testid=action-item-edit]:first-child');
    await page.fill('[data-testid=action-item-description]', '更新的行动项描述');
    await page.selectOption('[data-testid=action-item-priority]', 'high');
    await page.click('[data-testid=save-action-item]');

    // 3. 验证更新成功
    await expect(page.locator('[data-testid=action-item-description]:first-child'))
      .toContainText('更新的行动项描述');
    await expect(page.locator('[data-testid=action-item-priority]:first-child'))
      .toContainText('高优先级');
  });
});
```

### 7.2.2 性能测试自动化

#### 前端性能测试

使用Lighthouse CI进行自动化性能测试：

```yaml
# .github/workflows/performance.yml
name: Performance Testing

on:
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *' # 每日凌晨2点执行

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        
      - name: Start server
        run: npm start &
        
      - name: Wait for server
        run: npx wait-on http://localhost:3000
        
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

**Lighthouse配置文件**：

```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3000",
        "http://localhost:3000/meetings",
        "http://localhost:3000/meetings/new"
      ],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", {"minScore": 0.8}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["warn", {"minScore": 0.8}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

#### 后端性能测试

使用K6进行API性能测试：

```javascript
// tests/performance/api-load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// 自定义指标
export const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 10 }, // 预热
    { duration: '5m', target: 50 }, // 正常负载
    { duration: '2m', target: 100 }, // 峰值负载
    { duration: '5m', target: 100 }, // 持续峰值
    { duration: '2m', target: 0 }, // 降负载
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95%的请求响应时间小于500ms
    http_req_failed: ['rate<0.1'], // 错误率小于10%
    errors: ['rate<0.1'],
  },
};

const BASE_URL = 'http://localhost:3000/api';

export function setup() {
  // 创建测试用户
  const loginRes = http.post(`${BASE_URL}/auth/login`, {
    email: 'test@example.com',
    password: 'password123'
  });
  
  return { token: loginRes.json('token') };
}

export default function(data) {
  const headers = {
    'Authorization': `Bearer ${data.token}`,
    'Content-Type': 'application/json',
  };

  // 测试场景1：获取会议列表
  const meetingsRes = http.get(`${BASE_URL}/meetings`, { headers });
  check(meetingsRes, {
    '获取会议列表成功': (r) => r.status === 200,
    '响应时间合理': (r) => r.timings.duration < 300,
  }) || errorRate.add(1);

  sleep(1);

  // 测试场景2：创建会议
  const createMeetingRes = http.post(`${BASE_URL}/meetings`, JSON.stringify({
    title: `性能测试会议 ${Date.now()}`,
    description: '这是一个性能测试会议'
  }), { headers });
  
  check(createMeetingRes, {
    '创建会议成功': (r) => r.status === 201,
    '响应时间合理': (r) => r.timings.duration < 500,
  }) || errorRate.add(1);

  const meetingId = createMeetingRes.json('id');

  sleep(1);

  // 测试场景3：上传音频文件（模拟）
  const uploadRes = http.post(`${BASE_URL}/meetings/${meetingId}/upload`, {
    file: http.file('sample-audio.mp3', 'mock audio content', 'audio/mpeg')
  }, { headers });

  check(uploadRes, {
    '上传音频成功': (r) => r.status === 200,
    '响应时间合理': (r) => r.timings.duration < 2000,
  }) || errorRate.add(1);

  sleep(2);
}
```

---

## 7.3 自动化部署流程

### 7.3.1 CI/CD流水线设计

建立完整的CI/CD流水线，实现从代码提交到生产部署的全自动化：

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # 代码质量检查
  quality-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Lint check
        run: npm run lint
        
      - name: Type check
        run: npm run type-check
        
      - name: Format check
        run: npm run format:check

  # 单元测试和集成测试
  test:
    runs-on: ubuntu-latest
    needs: quality-check
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: techmeet_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
          
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run unit tests
        run: npm run test:unit
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/techmeet_test
          REDIS_URL: redis://localhost:6379
          
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/techmeet_test
          REDIS_URL: redis://localhost:6379
          
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  # E2E测试
  e2e-test:
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'pull_request'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright
        run: npx playwright install --with-deps
        
      - name: Build application
        run: npm run build
        
      - name: Start application
        run: npm start &
        
      - name: Wait for application
        run: npx wait-on http://localhost:3000
        
      - name: Run E2E tests
        run: npm run test:e2e
        
      - name: Upload E2E test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: e2e-test-results
          path: test-results/

  # 构建Docker镜像
  build:
    runs-on: ubuntu-latest
    needs: [test]
    if: github.ref == 'refs/heads/main'
    
    outputs:
      image: ${{ steps.image.outputs.image }}
      digest: ${{ steps.build.outputs.digest }}
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v2
        
      - name: Login to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}
            
      - name: Build and push Docker image
        id: build
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          
      - name: Output image
        id: image
        run: |
          echo "image=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}" >> $GITHUB_OUTPUT

  # 部署到预发布环境
  deploy-staging:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: staging
    
    steps:
      - name: Deploy to staging
        run: |
          echo "Deploying ${{ needs.build.outputs.image }} to staging environment"
          # 这里可以集成具体的部署脚本
          # 例如：kubectl, helm, terraform等
          
  # 部署到生产环境
  deploy-production:
    runs-on: ubuntu-latest
    needs: [build, deploy-staging]
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - name: Deploy to production
        run: |
          echo "Deploying ${{ needs.build.outputs.image }} to production environment"
          # 生产环境部署脚本
```

### 7.3.2 多环境部署策略

#### 环境配置管理

使用环境变量和配置文件管理不同环境的配置：

```typescript
// lib/config.ts
export interface AppConfig {
  app: {
    name: string;
    version: string;
    env: 'development' | 'staging' | 'production';
    port: number;
  };
  database: {
    url: string;
    maxConnections: number;
  };
  redis: {
    url: string;
  };
  ai: {
    openaiApiKey: string;
    model: string;
  };
  storage: {
    supabaseUrl: string;
    supabaseKey: string;
    bucket: string;
  };
  monitoring: {
    sentryDsn?: string;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
}

function loadConfig(): AppConfig {
  const env = process.env.NODE_ENV as AppConfig['app']['env'] || 'development';
  
  const baseConfig: AppConfig = {
    app: {
      name: 'TechMeet',
      version: process.env.npm_package_version || '1.0.0',
      env,
      port: parseInt(process.env.PORT || '3000', 10),
    },
    database: {
      url: process.env.DATABASE_URL || 'postgresql://localhost:5432/techmeet',
      maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10),
    },
    redis: {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    },
    ai: {
      openaiApiKey: process.env.OPENAI_API_KEY || '',
      model: process.env.OPENAI_MODEL || 'gpt-4',
    },
    storage: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_ANON_KEY || '',
      bucket: process.env.SUPABASE_BUCKET || 'audio-files',
    },
    monitoring: {
      sentryDsn: process.env.SENTRY_DSN,
      logLevel: (process.env.LOG_LEVEL as any) || 'info',
    },
  };

  // 环境特定配置
  const envConfigs = {
    development: {
      monitoring: {
        ...baseConfig.monitoring,
        logLevel: 'debug' as const,
      },
    },
    staging: {
      ai: {
        ...baseConfig.ai,
        model: 'gpt-3.5-turbo', // 预发布环境使用更便宜的模型
      },
    },
    production: {
      database: {
        ...baseConfig.database,
        maxConnections: 50, // 生产环境增加连接数
      },
    },
  };

  return {
    ...baseConfig,
    ...envConfigs[env],
  };
}

export const config = loadConfig();
```

#### Docker多阶段构建

```dockerfile
# Dockerfile
# ---- Base Stage ----
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# ---- Build Stage ----
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Production Stage ----
FROM node:18-alpine AS production
WORKDIR /app

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 复制构建产物和依赖
COPY --from=base /app/node_modules ./node_modules
COPY --from=build --chown=nextjs:nodejs /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["npm", "start"]
```

#### Kubernetes部署配置

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: techmeet-app
  labels:
    app: techmeet
spec:
  replicas: 3
  selector:
    matchLabels:
      app: techmeet
  template:
    metadata:
      labels:
        app: techmeet
    spec:
      containers:
      - name: app
        image: ghcr.io/your-org/techmeet:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: techmeet-secrets
              key: database-url
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: techmeet-secrets
              key: openai-api-key
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: techmeet-service
spec:
  selector:
    app: techmeet
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

---

## 7.4 生产环境监控

### 7.4.1 应用性能监控（APM）

#### Sentry集成

```typescript
// lib/monitoring/sentry.ts
import * as Sentry from '@sentry/nextjs';
import { config } from '@/lib/config';

export function initSentry() {
  Sentry.init({
    dsn: config.monitoring.sentryDsn,
    environment: config.app.env,
    tracesSampleRate: config.app.env === 'production' ? 0.1 : 1.0,
    
    beforeSend(event, hint) {
      // 过滤敏感信息
      if (event.request?.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
      }
      
      // 过滤特定错误
      if (event.exception) {
        const error = hint.originalException;
        if (error instanceof Error && error.message.includes('Network Error')) {
          return null; // 不上报网络错误
        }
      }
      
      return event;
    },
    
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app: undefined }),
    ],
  });
}

// 性能监控装饰器
export function withPerformanceMonitoring<T extends (...args: any[]) => any>(
  operation: string,
  fn: T
): T {
  return ((...args: any[]) => {
    const transaction = Sentry.startTransaction({
      name: operation,
      op: 'function',
    });
    
    Sentry.getCurrentHub().configureScope(scope => scope.setSpan(transaction));
    
    try {
      const result = fn(...args);
      
      if (result instanceof Promise) {
        return result
          .then(value => {
            transaction.setStatus('ok');
            transaction.finish();
            return value;
          })
          .catch(error => {
            transaction.setStatus('internal_error');
            Sentry.captureException(error);
            transaction.finish();
            throw error;
          });
      }
      
      transaction.setStatus('ok');
      transaction.finish();
      return result;
    } catch (error) {
      transaction.setStatus('internal_error');
      Sentry.captureException(error);
      transaction.finish();
      throw error;
    }
  }) as T;
}
```

#### 自定义指标收集

```typescript
// lib/monitoring/metrics.ts
import { createPrometheusMetrics } from 'prom-client';

class MetricsCollector {
  private static instance: MetricsCollector;
  private metrics: any = {};

  private constructor() {
    this.initMetrics();
  }

  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  private initMetrics() {
    const promClient = require('prom-client');
    
    // 创建默认指标
    promClient.collectDefaultMetrics();
    
    // 自定义业务指标
    this.metrics = {
      // HTTP请求计数器
      httpRequestsTotal: new promClient.Counter({
        name: 'http_requests_total',
        help: 'Total number of HTTP requests',
        labelNames: ['method', 'route', 'status_code'],
      }),
      
      // HTTP请求持续时间
      httpRequestDuration: new promClient.Histogram({
        name: 'http_request_duration_seconds',
        help: 'Duration of HTTP requests in seconds',
        labelNames: ['method', 'route'],
        buckets: [0.1, 0.5, 1, 2, 5],
      }),
      
      // 音频处理指标
      audioProcessingDuration: new promClient.Histogram({
        name: 'audio_processing_duration_seconds',
        help: 'Duration of audio processing in seconds',
        labelNames: ['file_size_mb'],
        buckets: [1, 5, 10, 30, 60, 120],
      }),
      
      // AI API调用指标
      aiApiCalls: new promClient.Counter({
        name: 'ai_api_calls_total',
        help: 'Total number of AI API calls',
        labelNames: ['provider', 'model', 'status'],
      }),
      
      // 用户活跃度指标
      activeUsers: new promClient.Gauge({
        name: 'active_users_current',
        help: 'Current number of active users',
      }),
      
      // 会议处理指标
      meetingsProcessed: new promClient.Counter({
        name: 'meetings_processed_total',
        help: 'Total number of meetings processed',
        labelNames: ['status'],
      }),
    };
  }

  // 记录HTTP请求
  recordHttpRequest(method: string, route: string, statusCode: number, duration: number) {
    this.metrics.httpRequestsTotal.inc({ method, route, status_code: statusCode });
    this.metrics.httpRequestDuration.observe({ method, route }, duration);
  }

  // 记录音频处理
  recordAudioProcessing(fileSizeMB: number, duration: number) {
    const sizeCategory = fileSizeMB < 10 ? 'small' : fileSizeMB < 50 ? 'medium' : 'large';
    this.metrics.audioProcessingDuration.observe({ file_size_mb: sizeCategory }, duration);
  }

  // 记录AI API调用
  recordAiApiCall(provider: string, model: string, status: 'success' | 'error') {
    this.metrics.aiApiCalls.inc({ provider, model, status });
  }

  // 更新活跃用户数
  updateActiveUsers(count: number) {
    this.metrics.activeUsers.set(count);
  }

  // 记录会议处理
  recordMeetingProcessed(status: 'success' | 'error') {
    this.metrics.meetingsProcessed.inc({ status });
  }

  // 获取所有指标
  getMetrics() {
    const promClient = require('prom-client');
    return promClient.register.metrics();
  }
}

export const metricsCollector = MetricsCollector.getInstance();
```

### 7.4.2 日志管理

#### 结构化日志

```typescript
// lib/logging/logger.ts
import winston from 'winston';
import { config } from '@/lib/config';

// 自定义日志格式
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      service: 'techmeet',
      environment: config.app.env,
      version: config.app.version,
      ...meta,
    });
  })
);

// 创建logger实例
export const logger = winston.createLogger({
  level: config.monitoring.logLevel,
  format: logFormat,
  defaultMeta: {
    service: 'techmeet',
    environment: config.app.env,
  },
  transports: [
    // 控制台输出
    new winston.transports.Console({
      format: config.app.env === 'development' 
        ? winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        : logFormat,
    }),
    
    // 文件输出（生产环境）
    ...(config.app.env === 'production' ? [
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
    ] : []),
  ],
});

// 请求日志中间件
export function requestLogger(req: any, res: any, next: any) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id,
    });
  });
  
  next();
}

// 业务日志记录器
export class BusinessLogger {
  static logUserAction(userId: string, action: string, details?: any) {
    logger.info('User Action', {
      userId,
      action,
      details,
      category: 'user_behavior',
    });
  }

  static logMeetingEvent(meetingId: string, event: string, details?: any) {
    logger.info('Meeting Event', {
      meetingId,
      event,
      details,
      category: 'meeting_lifecycle',
    });
  }

  static logAiOperation(operation: string, duration: number, details?: any) {
    logger.info('AI Operation', {
      operation,
      duration,
      details,
      category: 'ai_processing',
    });
  }

  static logError(error: Error, context?: any) {
    logger.error('Application Error', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      context,
      category: 'application_error',
    });
  }
}
```

### 7.4.3 健康检查和告警

#### 健康检查端点

```typescript
// pages/api/health.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '@/lib/logging/logger';
import { config } from '@/lib/config';

interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  checks: {
    database: 'up' | 'down';
    redis: 'up' | 'down';
    storage: 'up' | 'down';
    ai_service: 'up' | 'down';
  };
  uptime: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthCheck>
) {
  const startTime = Date.now();
  
  try {
    // 检查数据库连接
    const dbCheck = await checkDatabase();
    
    // 检查Redis连接
    const redisCheck = await checkRedis();
    
    // 检查存储服务
    const storageCheck = await checkStorage();
    
    // 检查AI服务
    const aiServiceCheck = await checkAiService();
    
    const allHealthy = [dbCheck, redisCheck, storageCheck, aiServiceCheck]
      .every(check => check === 'up');
    
    const healthStatus: HealthCheck = {
      status: allHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: config.app.version,
      environment: config.app.env,
      checks: {
        database: dbCheck,
        redis: redisCheck,
        storage: storageCheck,
        ai_service: aiServiceCheck,
      },
      uptime: process.uptime(),
    };
    
    const statusCode = allHealthy ? 200 : 503;
    
    logger.info('Health Check', {
      status: healthStatus.status,
      duration: Date.now() - startTime,
      checks: healthStatus.checks,
    });
    
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    logger.error('Health Check Failed', { error });
    
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: config.app.version,
      environment: config.app.env,
      checks: {
        database: 'down',
        redis: 'down',
        storage: 'down',
        ai_service: 'down',
      },
      uptime: process.uptime(),
    });
  }
}

async function checkDatabase(): Promise<'up' | 'down'> {
  try {
    // 实现数据库连接检查
    // const result = await db.raw('SELECT 1');
    return 'up';
  } catch (error) {
    return 'down';
  }
}

async function checkRedis(): Promise<'up' | 'down'> {
  try {
    // 实现Redis连接检查
    // await redis.ping();
    return 'up';
  } catch (error) {
    return 'down';
  }
}

async function checkStorage(): Promise<'up' | 'down'> {
  try {
    // 实现存储服务检查
    // await supabase.storage.from('test').list();
    return 'up';
  } catch (error) {
    return 'down';
  }
}

async function checkAiService(): Promise<'up' | 'down'> {
  try {
    // 实现AI服务检查
    // await openai.models.list();
    return 'up';
  } catch (error) {
    return 'down';
  }
}
```

#### 告警配置

```yaml
# monitoring/alerts.yml
groups:
  - name: techmeet-alerts
    rules:
      # 应用可用性告警
      - alert: ApplicationDown
        expr: up{job="techmeet"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "TechMeet application is down"
          description: "TechMeet application has been down for more than 1 minute"

      # 高错误率告警
      - alert: HighErrorRate
        expr: rate(http_requests_total{status_code=~"5.."}[5m]) > 0.1
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors per second"

      # 响应时间告警
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
          description: "95th percentile response time is {{ $value }} seconds"

      # 数据库连接告警
      - alert: DatabaseConnectionFailed
        expr: up{job="postgres"} == 0
        for: 30s
        labels:
          severity: critical
        annotations:
          summary: "Database connection failed"
          description: "Cannot connect to PostgreSQL database"

      # AI服务告警
      - alert: AiServiceHighLatency
        expr: histogram_quantile(0.95, rate(audio_processing_duration_seconds_bucket[10m])) > 60
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "AI service high latency"
          description: "95th percentile AI processing time is {{ $value }} seconds"

      # 磁盘空间告警
      - alert: DiskSpaceHigh
        expr: (node_filesystem_size_bytes - node_filesystem_free_bytes) / node_filesystem_size_bytes > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Disk space usage high"
          description: "Disk space usage is {{ $value | humanizePercentage }}"
```

---

## 7.5 质量保证体系

### 7.5.1 质量门禁标准

建立多层次的质量门禁，确保只有高质量的代码才能进入生产环境：

#### 代码提交门禁

```json
// .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# 1. 代码格式检查
echo "📝 Checking code format..."
npm run format:check || {
  echo "❌ Code format check failed. Run 'npm run format' to fix."
  exit 1
}

# 2. 代码风格检查
echo "🎨 Running linter..."
npm run lint || {
  echo "❌ Linting failed. Please fix the issues above."
  exit 1
}

# 3. 类型检查
echo "🔧 Type checking..."
npm run type-check || {
  echo "❌ Type check failed. Please fix the type errors."
  exit 1
}

# 4. 单元测试
echo "🧪 Running unit tests..."
npm run test:unit || {
  echo "❌ Unit tests failed. Please fix the failing tests."
  exit 1
}

# 5. 安全检查
echo "🔒 Security audit..."
npm audit --audit-level moderate || {
  echo "❌ Security vulnerabilities found. Please fix them."
  exit 1
}

echo "✅ All pre-commit checks passed!"
```

#### PR合并门禁

```yaml
# .github/workflows/pr-checks.yml
name: PR Quality Checks

on:
  pull_request:
    branches: [main, develop]

jobs:
  quality-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0 # 获取完整历史用于代码覆盖率对比
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      # 质量门禁1：代码覆盖率
      - name: Test Coverage Check
        run: |
          npm run test:coverage
          COVERAGE=$(npm run test:coverage:json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "❌ Code coverage ($COVERAGE%) is below 80%"
            exit 1
          fi
          echo "✅ Code coverage: $COVERAGE%"
      
      # 质量门禁2：代码复杂度
      - name: Complexity Check
        run: |
          npx complexity-report --format json src/ > complexity.json
          MAX_COMPLEXITY=$(jq '.reports[].complexity.cyclomatic' complexity.json | sort -nr | head -1)
          if (( $(echo "$MAX_COMPLEXITY > 10" | bc -l) )); then
            echo "❌ Cyclomatic complexity ($MAX_COMPLEXITY) exceeds limit (10)"
            exit 1
          fi
          echo "✅ Max complexity: $MAX_COMPLEXITY"
      
      # 质量门禁3：代码重复率
      - name: Duplication Check
        run: |
          npx jscpd src/ --threshold 5 --format json > duplication.json
          DUPLICATION=$(jq '.statistics.total.percentage' duplication.json)
          if (( $(echo "$DUPLICATION > 5" | bc -l) )); then
            echo "❌ Code duplication ($DUPLICATION%) exceeds limit (5%)"
            exit 1
          fi
          echo "✅ Code duplication: $DUPLICATION%"
      
      # 质量门禁4：性能回归检查
      - name: Performance Regression Check
        run: |
          npm run build
          npm start &
          sleep 10
          
          # 运行性能测试
          npx lighthouse http://localhost:3000 --output json --output-path lighthouse.json
          PERFORMANCE=$(jq '.categories.performance.score * 100' lighthouse.json)
          
          if (( $(echo "$PERFORMANCE < 80" | bc -l) )); then
            echo "❌ Performance score ($PERFORMANCE) is below 80"
            exit 1
          fi
          echo "✅ Performance score: $PERFORMANCE"
      
      # 质量门禁5：安全漏洞检查
      - name: Security Vulnerability Check
        run: |
          npm audit --audit-level moderate --json > audit.json
          VULNERABILITIES=$(jq '.metadata.vulnerabilities.total' audit.json)
          
          if [ "$VULNERABILITIES" -gt 0 ]; then
            echo "❌ Found $VULNERABILITIES security vulnerabilities"
            npm audit
            exit 1
          fi
          echo "✅ No security vulnerabilities found"
```

### 7.5.2 代码质量评估

#### 自动化代码审查

使用AI辅助进行代码审查，提高审查效率和质量：

```typescript
// scripts/ai-code-review.ts
import { OpenAI } from 'openai';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface CodeReviewResult {
  file: string;
  issues: Array<{
    line: number;
    type: 'bug' | 'performance' | 'security' | 'maintainability' | 'style';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    suggestion: string;
  }>;
  score: number; // 0-100
}

class AICodeReviewer {
  async reviewPullRequest(prNumber: string): Promise<CodeReviewResult[]> {
    // 获取PR中的文件变更
    const changedFiles = this.getChangedFiles(prNumber);
    const results: CodeReviewResult[] = [];

    for (const file of changedFiles) {
      const content = readFileSync(file, 'utf-8');
      const diff = this.getFileDiff(file, prNumber);
      
      const review = await this.reviewFile(file, content, diff);
      results.push(review);
    }

    return results;
  }

  private async reviewFile(
    filePath: string, 
    content: string, 
    diff: string
  ): Promise<CodeReviewResult> {
    const prompt = `
作为一位资深的代码审查专家，请审查以下代码变更：

文件路径：${filePath}
代码内容：
\`\`\`
${content}
\`\`\`

变更内容：
\`\`\`diff
${diff}
\`\`\`

请从以下维度进行审查：
1. **Bug风险**：潜在的逻辑错误、空指针、边界条件等
2. **性能问题**：算法复杂度、内存泄漏、不必要的计算等
3. **安全漏洞**：SQL注入、XSS、敏感信息泄露等
4. **可维护性**：代码结构、命名规范、注释质量等
5. **代码风格**：格式规范、最佳实践等

输出格式（JSON）：
{
  "issues": [
    {
      "line": 行号,
      "type": "问题类型",
      "severity": "严重程度",
      "message": "问题描述",
      "suggestion": "改进建议"
    }
  ],
  "score": 代码质量评分(0-100)
}
`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        file: filePath,
        issues: result.issues || [],
        score: result.score || 0,
      };
    } catch (error) {
      console.error(`Failed to review file ${filePath}:`, error);
      return {
        file: filePath,
        issues: [],
        score: 0,
      };
    }
  }

  private getChangedFiles(prNumber: string): string[] {
    try {
      const output = execSync(
        `gh pr diff ${prNumber} --name-only`,
        { encoding: 'utf-8' }
      );
      return output.trim().split('\n').filter(file => 
        file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')
      );
    } catch (error) {
      console.error('Failed to get changed files:', error);
      return [];
    }
  }

  private getFileDiff(file: string, prNumber: string): string {
    try {
      return execSync(
        `gh pr diff ${prNumber} -- ${file}`,
        { encoding: 'utf-8' }
      );
    } catch (error) {
      console.error(`Failed to get diff for ${file}:`, error);
      return '';
    }
  }
}

// 使用示例
async function main() {
  const reviewer = new AICodeReviewer();
  const prNumber = process.argv[2];
  
  if (!prNumber) {
    console.error('Please provide PR number');
    process.exit(1);
  }

  console.log(`🔍 Reviewing PR #${prNumber}...`);
  
  const results = await reviewer.reviewPullRequest(prNumber);
  
  // 生成审查报告
  console.log('\n📊 Code Review Report\n');
  
  let totalScore = 0;
  let totalIssues = 0;
  
  for (const result of results) {
    console.log(`📁 ${result.file} (Score: ${result.score}/100)`);
    
    if (result.issues.length === 0) {
      console.log('  ✅ No issues found\n');
    } else {
      result.issues.forEach(issue => {
        const emoji = {
          critical: '🚨',
          high: '⚠️',
          medium: '💡',
          low: 'ℹ️'
        }[issue.severity];
        
        console.log(`  ${emoji} Line ${issue.line}: ${issue.message}`);
        console.log(`     💡 ${issue.suggestion}\n`);
      });
    }
    
    totalScore += result.score;
    totalIssues += result.issues.length;
  }
  
  const avgScore = results.length > 0 ? totalScore / results.length : 0;
  
  console.log(`\n📈 Overall Quality Score: ${avgScore.toFixed(1)}/100`);
  console.log(`🐛 Total Issues Found: ${totalIssues}`);
  
  // 设置质量门禁
  if (avgScore < 70) {
    console.log('❌ Code quality below threshold (70). Please address the issues.');
    process.exit(1);
  }
  
  console.log('✅ Code quality check passed!');
}

if (require.main === module) {
  main().catch(console.error);
}
```

#### 质量趋势分析

```typescript
// lib/quality/trend-analyzer.ts
interface QualityMetrics {
  timestamp: Date;
  codebase: {
    linesOfCode: number;
    testCoverage: number;
    complexity: number;
    duplication: number;
    maintainabilityIndex: number;
  };
  defects: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  performance: {
    buildTime: number;
    testTime: number;
    deployTime: number;
  };
}

class QualityTrendAnalyzer {
  async analyzeQualityTrend(days: number = 30): Promise<{
    trend: 'improving' | 'stable' | 'declining';
    insights: string[];
    recommendations: string[];
  }> {
    const metrics = await this.getHistoricalMetrics(days);
    
    if (metrics.length < 2) {
      return {
        trend: 'stable',
        insights: ['Insufficient data for trend analysis'],
        recommendations: ['Continue collecting quality metrics'],
      };
    }

    const latest = metrics[metrics.length - 1];
    const baseline = metrics[0];
    
    // 计算趋势指标
    const coverageTrend = this.calculateTrend(
      baseline.codebase.testCoverage,
      latest.codebase.testCoverage
    );
    
    const complexityTrend = this.calculateTrend(
      baseline.codebase.complexity,
      latest.codebase.complexity,
      true // 复杂度越低越好
    );
    
    const defectTrend = this.calculateTrend(
      baseline.defects.total,
      latest.defects.total,
      true // 缺陷越少越好
    );
    
    // 综合评估
    const overallTrend = this.determineOverallTrend([
      coverageTrend,
      complexityTrend,
      defectTrend,
    ]);
    
    const insights = this.generateInsights(metrics);
    const recommendations = this.generateRecommendations(latest, overallTrend);
    
    return {
      trend: overallTrend,
      insights,
      recommendations,
    };
  }

  private calculateTrend(
    baseline: number, 
    current: number, 
    lowerIsBetter: boolean = false
  ): 'improving' | 'stable' | 'declining' {
    const change = ((current - baseline) / baseline) * 100;
    const threshold = 5; // 5%的变化阈值
    
    if (Math.abs(change) < threshold) {
      return 'stable';
    }
    
    if (lowerIsBetter) {
      return change < 0 ? 'improving' : 'declining';
    } else {
      return change > 0 ? 'improving' : 'declining';
    }
  }

  private determineOverallTrend(
    trends: Array<'improving' | 'stable' | 'declining'>
  ): 'improving' | 'stable' | 'declining' {
    const improving = trends.filter(t => t === 'improving').length;
    const declining = trends.filter(t => t === 'declining').length;
    
    if (improving > declining) return 'improving';
    if (declining > improving) return 'declining';
    return 'stable';
  }

  private generateInsights(metrics: QualityMetrics[]): string[] {
    const insights: string[] = [];
    const latest = metrics[metrics.length - 1];
    
    // 测试覆盖率洞察
    if (latest.codebase.testCoverage >= 80) {
      insights.push('测试覆盖率良好，达到了80%以上的标准');
    } else if (latest.codebase.testCoverage >= 60) {
      insights.push('测试覆盖率中等，建议提升到80%以上');
    } else {
      insights.push('测试覆盖率偏低，存在质量风险');
    }
    
    // 代码复杂度洞察
    if (latest.codebase.complexity <= 5) {
      insights.push('代码复杂度控制良好，易于维护');
    } else if (latest.codebase.complexity <= 10) {
      insights.push('代码复杂度中等，需要关注重构机会');
    } else {
      insights.push('代码复杂度过高，建议进行重构');
    }
    
    // 缺陷趋势洞察
    const recentDefects = metrics.slice(-7); // 最近7天
    const avgDefects = recentDefects.reduce((sum, m) => sum + m.defects.total, 0) / recentDefects.length;
    
    if (avgDefects < 5) {
      insights.push('缺陷数量控制良好，质量稳定');
    } else if (avgDefects < 15) {
      insights.push('缺陷数量中等，需要加强测试');
    } else {
      insights.push('缺陷数量较多，需要重点关注质量改进');
    }
    
    return insights;
  }

  private generateRecommendations(
    latest: QualityMetrics,
    trend: 'improving' | 'stable' | 'declining'
  ): string[] {
    const recommendations: string[] = [];
    
    // 基于趋势的建议
    switch (trend) {
      case 'improving':
        recommendations.push('质量趋势良好，继续保持当前的开发实践');
        break;
      case 'stable':
        recommendations.push('质量保持稳定，可以考虑引入新的改进措施');
        break;
      case 'declining':
        recommendations.push('质量趋势下降，需要立即采取改进措施');
        break;
    }
    
    // 基于具体指标的建议
    if (latest.codebase.testCoverage < 80) {
      recommendations.push('增加单元测试和集成测试，提升测试覆盖率');
    }
    
    if (latest.codebase.complexity > 8) {
      recommendations.push('识别高复杂度模块，进行重构简化');
    }
    
    if (latest.codebase.duplication > 5) {
      recommendations.push('消除重复代码，提取公共组件和工具函数');
    }
    
    if (latest.defects.critical > 0) {
      recommendations.push('优先修复所有严重缺陷，建立缺陷预防机制');
    }
    
    if (latest.performance.buildTime > 300) { // 5分钟
      recommendations.push('优化构建流程，减少构建时间');
    }
    
    return recommendations;
  }

  private async getHistoricalMetrics(days: number): Promise<QualityMetrics[]> {
    // 这里应该从数据库或监控系统获取历史数据
    // 示例实现
    return [];
  }
}
```

### 7.5.3 持续改进机制

#### 质量改进工作流

```typescript
// lib/quality/improvement-workflow.ts
interface QualityIssue {
  id: string;
  type: 'technical_debt' | 'performance' | 'security' | 'maintainability';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  effort: 'small' | 'medium' | 'large';
  assignee?: string;
  status: 'identified' | 'planned' | 'in_progress' | 'resolved' | 'deferred';
  createdAt: Date;
  resolvedAt?: Date;
}

class QualityImprovementWorkflow {
  async identifyImprovementOpportunities(): Promise<QualityIssue[]> {
    const issues: QualityIssue[] = [];
    
    // 1. 技术债务识别
    const technicalDebt = await this.identifyTechnicalDebt();
    issues.push(...technicalDebt);
    
    // 2. 性能问题识别
    const performanceIssues = await this.identifyPerformanceIssues();
    issues.push(...performanceIssues);
    
    // 3. 安全漏洞识别
    const securityIssues = await this.identifySecurityIssues();
    issues.push(...securityIssues);
    
    // 4. 可维护性问题识别
    const maintainabilityIssues = await this.identifyMaintainabilityIssues();
    issues.push(...maintainabilityIssues);
    
    return this.prioritizeIssues(issues);
  }

  private async identifyTechnicalDebt(): Promise<QualityIssue[]> {
    const issues: QualityIssue[] = [];
    
    // 检查代码复杂度
    const complexityReport = await this.analyzeComplexity();
    for (const file of complexityReport.highComplexityFiles) {
      issues.push({
        id: `complexity-${file.path}`,
        type: 'technical_debt',
        severity: file.complexity > 15 ? 'high' : 'medium',
        description: `高复杂度文件: ${file.path} (复杂度: ${file.complexity})`,
        impact: '增加维护成本，降低代码可读性',
        effort: file.complexity > 20 ? 'large' : 'medium',
        status: 'identified',
        createdAt: new Date(),
      });
    }
    
    // 检查代码重复
    const duplicationReport = await this.analyzeDuplication();
    for (const duplicate of duplicationReport.duplicates) {
      issues.push({
        id: `duplication-${duplicate.id}`,
        type: 'technical_debt',
        severity: 'medium',
        description: `代码重复: ${duplicate.files.join(', ')}`,
        impact: '增加维护成本，容易引入不一致性',
        effort: 'small',
        status: 'identified',
        createdAt: new Date(),
      });
    }
    
    return issues;
  }

  private prioritizeIssues(issues: QualityIssue[]): QualityIssue[] {
    // 使用加权评分进行优先级排序
    const scoreIssue = (issue: QualityIssue): number => {
      const severityWeight = {
        critical: 10,
        high: 7,
        medium: 4,
        low: 1,
      };
      
      const effortWeight = {
        small: 3,
        medium: 2,
        large: 1,
      };
      
      return severityWeight[issue.severity] * effortWeight[issue.effort];
    };
    
    return issues.sort((a, b) => scoreIssue(b) - scoreIssue(a));
  }

  async createImprovementPlan(issues: QualityIssue[]): Promise<{
    sprint1: QualityIssue[];
    sprint2: QualityIssue[];
    backlog: QualityIssue[];
  }> {
    const criticalIssues = issues.filter(i => i.severity === 'critical');
    const highIssues = issues.filter(i => i.severity === 'high');
    const mediumIssues = issues.filter(i => i.severity === 'medium');
    const lowIssues = issues.filter(i => i.severity === 'low');
    
    return {
      sprint1: [...criticalIssues, ...highIssues.slice(0, 3)],
      sprint2: [...highIssues.slice(3), ...mediumIssues.slice(0, 5)],
      backlog: [...mediumIssues.slice(5), ...lowIssues],
    };
  }

  // 其他辅助方法的实现...
  private async analyzeComplexity(): Promise<any> {
    // 实现复杂度分析
    return { highComplexityFiles: [] };
  }

  private async analyzeDuplication(): Promise<any> {
    // 实现重复代码分析
    return { duplicates: [] };
  }

  private async identifyPerformanceIssues(): Promise<QualityIssue[]> {
    // 实现性能问题识别
    return [];
  }

  private async identifySecurityIssues(): Promise<QualityIssue[]> {
    // 实现安全问题识别
    return [];
  }

  private async identifyMaintainabilityIssues(): Promise<QualityIssue[]> {
    // 实现可维护性问题识别
    return [];
  }
}
```

---

## 7.6 本章小结

本章深入探讨了DDAD环境下的测试部署与质量保证体系，涵盖了从AI驱动的测试策略到生产环境监控的完整流程。

### 核心要点回顾

1. **AI驱动测试策略**
   - 测试范式从"事后检验"转向"测试前置"
   - 利用AI自动生成测试用例和测试数据
   - 建立分层测试体系（单元→集成→E2E）

2. **自动化部署流程**
   - 完整的CI/CD流水线设计
   - 多环境部署策略和配置管理
   - Docker容器化和Kubernetes编排

3. **生产环境监控**
   - 应用性能监控（APM）和自定义指标
   - 结构化日志管理和业务日志记录
   - 健康检查和智能告警机制

4. **质量保证体系**
   - 多层次质量门禁标准
   - AI辅助代码审查和质量评估
   - 持续改进机制和质量趋势分析

### DDAD价值体现

- **效率提升**：自动化测试和部署减少90%的手动工作
- **质量保障**：AI辅助的全面质量检查确保代码质量
- **快速反馈**：实时监控和告警机制快速发现问题
- **持续改进**：数据驱动的质量改进决策

### 实践建议

1. **渐进式实施**：从核心功能开始，逐步扩展测试覆盖
2. **工具整合**：选择合适的工具链，确保工具间的良好集成
3. **团队培训**：提升团队对新工具和流程的理解和使用能力
4. **度量驱动**：建立完善的质量度量体系，用数据指导改进

通过本章的学习，你应该能够建立一套完整的DDAD质量保证体系，确保AI生成的代码在生产环境中稳定可靠地运行。下一章我们将探讨团队协作与AI协作治理，学习如何在团队环境中有效实施DDAD。