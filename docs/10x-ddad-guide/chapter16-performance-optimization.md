# 第十六章:性能优化

## 章节概述

性能是用户体验的关键要素,直接影响用户满意度、留存率和业务成功。本章将介绍如何建立全面的性能监控体系、识别性能瓶颈、实施针对性优化策略,并建立持续的性能改进文化。

## 16.1 性能指标体系

### 16.1.1 核心Web性能指标

**Core Web Vitals (核心Web体验指标)**

```yaml
core_web_vitals:
  LCP:
    name: "Largest Contentful Paint (最大内容绘制)"
    definition: "页面主要内容渲染完成的时间"
    good: "< 2.5s"
    needs_improvement: "2.5s - 4.0s"
    poor: "> 4.0s"
    optimization_targets:
      - 优化服务器响应时间
      - 优化资源加载
      - 减少渲染阻塞资源
      - 优化CSS交付

  FID:
    name: "First Input Delay (首次输入延迟)"
    definition: "用户首次交互到浏览器响应的时间"
    good: "< 100ms"
    needs_improvement: "100ms - 300ms"
    poor: "> 300ms"
    optimization_targets:
      - 减少JavaScript执行时间
      - 代码分割
      - 移除未使用的代码
      - 优化第三方脚本

  CLS:
    name: "Cumulative Layout Shift (累积布局偏移)"
    definition: "页面加载期间布局稳定性"
    good: "< 0.1"
    needs_improvement: "0.1 - 0.25"
    poor: "> 0.25"
    optimization_targets:
      - 为图片和视频设置尺寸
      - 预留广告位空间
      - 避免在已有内容上插入内容
      - 优化Web字体加载

additional_metrics:
  TTFB:
    name: "Time to First Byte (首字节时间)"
    definition: "浏览器收到第一个字节的时间"
    good: "< 600ms"
    optimization:
      - CDN加速
      - 服务端缓存
      - 数据库优化
      - 连接优化

  FCP:
    name: "First Contentful Paint (首次内容绘制)"
    definition: "页面首次渲染任何内容的时间"
    good: "< 1.8s"
    optimization:
      - 内联关键CSS
      - 预连接第三方域名
      - 减少服务器响应时间

  TTI:
    name: "Time to Interactive (可交互时间)"
    definition: "页面完全可交互的时间"
    good: "< 3.8s"
    optimization:
      - 延迟加载非关键资源
      - 最小化主线程工作
      - 减少JavaScript执行时间

  TBT:
    name: "Total Blocking Time (总阻塞时间)"
    definition: "主线程被阻塞的总时间"
    good: "< 200ms"
    optimization:
      - 代码分割
      - Web Worker
      - 优化长任务

  SI:
    name: "Speed Index (速度指数)"
    definition: "页面内容视觉呈现的速度"
    good: "< 3.4s"
    optimization:
      - 优化关键渲染路径
      - 渐进式增强
      - 懒加载
```

**后端性能指标**

```yaml
backend_performance_metrics:
  api_performance:
    response_time:
      p50: "< 100ms"   # 中位数
      p95: "< 500ms"   # 95分位
      p99: "< 1000ms"  # 99分位
      max: "< 5000ms"  # 最大值

    throughput:
      description: "每秒处理的请求数"
      target: "> 1000 req/s"
      measurement: "requests per second (RPS)"

    error_rate:
      target: "< 0.1%"
      calculation: "errors / total_requests * 100"

  database_performance:
    query_time:
      p50: "< 10ms"
      p95: "< 50ms"
      p99: "< 100ms"

    connection_pool:
      utilization: "< 80%"
      wait_time: "< 10ms"
      timeout_rate: "< 0.01%"

    cache_hit_rate:
      target: "> 90%"
      calculation: "cache_hits / (cache_hits + cache_misses)"

  resource_utilization:
    cpu:
      average: "< 70%"
      peak: "< 90%"

    memory:
      average: "< 80%"
      peak: "< 95%"

    disk_io:
      iops: "within capacity"
      latency: "< 10ms"

    network:
      bandwidth_utilization: "< 70%"
      packet_loss: "< 0.01%"
```

### 16.1.2 用户体验指标

**感知性能指标**

```yaml
user_experience_metrics:
  engagement_metrics:
    bounce_rate:
      definition: "用户未交互就离开的比例"
      target: "< 40%"
      correlation: "与加载速度负相关"

    session_duration:
      definition: "用户会话平均时长"
      target: "根据产品类型设定"
      correlation: "与页面性能正相关"

    pages_per_session:
      definition: "每次会话访问的页面数"
      target: "根据产品类型设定"

  conversion_metrics:
    conversion_rate:
      definition: "完成目标行为的用户比例"
      impact: "每提速1秒,转化率提升2-7%"

    abandonment_rate:
      definition: "未完成流程的用户比例"
      target: "< 20%"
      key_factors:
        - 加载时间
        - 表单响应速度
        - 支付流程性能

  satisfaction_metrics:
    apdex_score:
      name: "Application Performance Index"
      calculation: "(satisfied + 0.5 * tolerating) / total"
      thresholds:
        satisfied: "< 0.5s"
        tolerating: "0.5s - 2.0s"
        frustrated: "> 2.0s"
      target: "> 0.85"

    user_satisfaction:
      measurement: "用户调查反馈"
      questions:
        - "页面加载速度满意度"
        - "交互响应满意度"
        - "整体性能体验"
      target: "> 4.0/5.0"
```

## 16.2 性能监控体系

### 16.2.1 Real User Monitoring (RUM)

**真实用户监控实现**

```javascript
// RUM SDK 实现示例
class RealUserMonitoring {
  constructor(config) {
    this.config = config;
    this.metrics = {};
    this.setupObservers();
  }

  setupObservers() {
    // 监控 Core Web Vitals
    this.observeCoreWebVitals();

    // 监控资源加载
    this.observeResourceTiming();

    // 监控用户交互
    this.observeUserInteractions();

    // 监控错误
    this.observeErrors();
  }

  observeCoreWebVitals() {
    // LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];

      this.recordMetric('LCP', {
        value: lastEntry.renderTime || lastEntry.loadTime,
        element: lastEntry.element,
        url: lastEntry.url,
        timestamp: Date.now()
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay)
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.recordMetric('FID', {
          value: entry.processingStart - entry.startTime,
          eventType: entry.name,
          timestamp: entry.startTime
        });
      });
    }).observe({ entryTypes: ['first-input'] });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });

      this.recordMetric('CLS', {
        value: clsValue,
        timestamp: Date.now()
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  observeResourceTiming() {
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.recordMetric('resource', {
          name: entry.name,
          type: entry.initiatorType,
          duration: entry.duration,
          size: entry.transferSize,
          protocol: entry.nextHopProtocol,
          timing: {
            dns: entry.domainLookupEnd - entry.domainLookupStart,
            tcp: entry.connectEnd - entry.connectStart,
            request: entry.responseStart - entry.requestStart,
            response: entry.responseEnd - entry.responseStart,
            total: entry.duration
          }
        });
      });
    }).observe({ entryTypes: ['resource'] });
  }

  observeUserInteractions() {
    // 监控点击事件
    document.addEventListener('click', (event) => {
      const startTime = performance.now();

      requestIdleCallback(() => {
        const duration = performance.now() - startTime;

        this.recordMetric('interaction', {
          type: 'click',
          target: this.getElementSelector(event.target),
          duration: duration,
          timestamp: Date.now()
        });
      });
    });

    // 监控页面可见性变化
    document.addEventListener('visibilitychange', () => {
      this.recordMetric('visibility', {
        hidden: document.hidden,
        timestamp: Date.now()
      });
    });
  }

  observeErrors() {
    // JavaScript 错误
    window.addEventListener('error', (event) => {
      this.recordMetric('error', {
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: Date.now()
      });
    });

    // 未处理的 Promise 拒绝
    window.addEventListener('unhandledrejection', (event) => {
      this.recordMetric('error', {
        type: 'promise',
        reason: event.reason,
        promise: event.promise,
        timestamp: Date.now()
      });
    });

    // 资源加载错误
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.recordMetric('error', {
          type: 'resource',
          target: event.target.tagName,
          src: event.target.src || event.target.href,
          timestamp: Date.now()
        });
      }
    }, true);
  }

  recordMetric(type, data) {
    // 记录指标
    if (!this.metrics[type]) {
      this.metrics[type] = [];
    }

    this.metrics[type].push({
      ...data,
      sessionId: this.getSessionId(),
      userId: this.getUserId(),
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      connection: this.getConnectionInfo()
    });

    // 批量发送
    if (this.shouldFlush()) {
      this.flush();
    }
  }

  getConnectionInfo() {
    const connection = navigator.connection ||
                      navigator.mozConnection ||
                      navigator.webkitConnection;

    if (connection) {
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }

    return null;
  }

  shouldFlush() {
    const totalMetrics = Object.values(this.metrics)
      .reduce((sum, arr) => sum + arr.length, 0);

    return totalMetrics >= this.config.batchSize ||
           Date.now() - this.lastFlush > this.config.flushInterval;
  }

  flush() {
    if (Object.keys(this.metrics).length === 0) {
      return;
    }

    // 使用 sendBeacon 发送数据
    const data = JSON.stringify({
      metrics: this.metrics,
      timestamp: Date.now()
    });

    navigator.sendBeacon(this.config.endpoint, data);

    // 清空已发送的指标
    this.metrics = {};
    this.lastFlush = Date.now();
  }

  getElementSelector(element) {
    // 生成元素的 CSS 选择器
    if (element.id) {
      return `#${element.id}`;
    }

    if (element.className) {
      return `.${element.className.split(' ').join('.')}`;
    }

    return element.tagName.toLowerCase();
  }
}

// 初始化 RUM
const rum = new RealUserMonitoring({
  endpoint: '/api/metrics',
  batchSize: 50,
  flushInterval: 10000 // 10 seconds
});
```

### 16.2.2 Synthetic Monitoring (合成监控)

**定期性能测试**

```python
# 合成监控框架
import time
import statistics
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

class SyntheticMonitoring:
    """合成监控系统"""

    def __init__(self, config):
        self.config = config
        self.results = []

    def run_test(self, url, scenario=None):
        """运行性能测试"""
        # 配置浏览器
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--no-sandbox')

        # 启用性能日志
        chrome_options.set_capability(
            'goog:loggingPrefs',
            {'performance': 'ALL'}
        )

        driver = webdriver.Chrome(options=chrome_options)

        try:
            # 测量页面加载
            metrics = self.measure_page_load(driver, url)

            # 执行场景测试
            if scenario:
                scenario_metrics = self.execute_scenario(driver, scenario)
                metrics['scenario'] = scenario_metrics

            self.results.append(metrics)
            return metrics

        finally:
            driver.quit()

    def measure_page_load(self, driver, url):
        """测量页面加载性能"""
        start_time = time.time()

        driver.get(url)

        # 等待页面加载完成
        WebDriverWait(driver, 30).until(
            lambda d: d.execute_script(
                'return document.readyState'
            ) == 'complete'
        )

        # 获取性能指标
        navigation_timing = driver.execute_script(
            """
            const timing = performance.getEntriesByType('navigation')[0];
            return {
                dns: timing.domainLookupEnd - timing.domainLookupStart,
                tcp: timing.connectEnd - timing.connectStart,
                request: timing.responseStart - timing.requestStart,
                response: timing.responseEnd - timing.responseStart,
                dom: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
                load: timing.loadEventEnd - timing.loadEventStart,
                total: timing.loadEventEnd - timing.fetchStart
            };
            """
        )

        # 获取 Core Web Vitals
        web_vitals = self.get_web_vitals(driver)

        # 获取资源加载信息
        resources = self.get_resource_timing(driver)

        return {
            'url': url,
            'timestamp': time.time(),
            'navigation_timing': navigation_timing,
            'web_vitals': web_vitals,
            'resources': resources,
            'total_time': time.time() - start_time
        }

    def get_web_vitals(self, driver):
        """获取 Core Web Vitals"""
        return driver.execute_script(
            """
            return new Promise((resolve) => {
                const vitals = {};

                // LCP
                new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    vitals.lcp = entries[entries.length - 1].renderTime;
                }).observe({ entryTypes: ['largest-contentful-paint'] });

                // CLS
                let cls = 0;
                new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        if (!entry.hadRecentInput) {
                            cls += entry.value;
                        }
                    });
                    vitals.cls = cls;
                }).observe({ entryTypes: ['layout-shift'] });

                // FID (如果有交互)
                new PerformanceObserver((list) => {
                    const entry = list.getEntries()[0];
                    vitals.fid = entry.processingStart - entry.startTime;
                }).observe({ entryTypes: ['first-input'] });

                // 等待指标收集完成
                setTimeout(() => resolve(vitals), 3000);
            });
            """
        )

    def get_resource_timing(self, driver):
        """获取资源加载时间"""
        return driver.execute_script(
            """
            const resources = performance.getEntriesByType('resource');
            return resources.map(r => ({
                name: r.name,
                type: r.initiatorType,
                duration: r.duration,
                size: r.transferSize,
                protocol: r.nextHopProtocol
            }));
            """
        )

    def execute_scenario(self, driver, scenario):
        """执行用户场景测试"""
        scenario_metrics = []

        for step in scenario['steps']:
            step_start = time.time()

            # 执行步骤
            if step['type'] == 'click':
                element = driver.find_element(
                    step['selector_type'],
                    step['selector']
                )
                element.click()
            elif step['type'] == 'input':
                element = driver.find_element(
                    step['selector_type'],
                    step['selector']
                )
                element.send_keys(step['value'])
            elif step['type'] == 'wait':
                time.sleep(step['duration'])

            # 记录步骤性能
            step_duration = time.time() - step_start
            scenario_metrics.append({
                'step': step['name'],
                'duration': step_duration,
                'timestamp': time.time()
            })

        return scenario_metrics

    def run_continuous_monitoring(self, tests, interval=300):
        """持续监控"""
        import schedule

        for test in tests:
            schedule.every(interval).seconds.do(
                self.run_test,
                url=test['url'],
                scenario=test.get('scenario')
            )

        while True:
            schedule.run_pending()
            time.sleep(1)

    def analyze_results(self, period='24h'):
        """分析测试结果"""
        # 过滤时间范围内的结果
        cutoff = time.time() - self._parse_period(period)
        filtered = [
            r for r in self.results
            if r['timestamp'] > cutoff
        ]

        if not filtered:
            return None

        # 计算统计指标
        analysis = {
            'period': period,
            'total_tests': len(filtered),
            'navigation_timing': self._analyze_timing(
                filtered,
                'navigation_timing'
            ),
            'web_vitals': self._analyze_web_vitals(filtered),
            'availability': self._calculate_availability(filtered),
            'trends': self._identify_trends(filtered)
        }

        return analysis

    def _analyze_timing(self, results, key):
        """分析时间指标"""
        timings = {}

        for metric in ['dns', 'tcp', 'request', 'response', 'total']:
            values = [
                r[key][metric]
                for r in results
                if metric in r[key]
            ]

            if values:
                timings[metric] = {
                    'p50': statistics.median(values),
                    'p95': statistics.quantiles(values, n=20)[18],
                    'p99': statistics.quantiles(values, n=100)[98],
                    'avg': statistics.mean(values),
                    'min': min(values),
                    'max': max(values)
                }

        return timings

    def _analyze_web_vitals(self, results):
        """分析 Web Vitals"""
        vitals = {}

        for metric in ['lcp', 'fid', 'cls']:
            values = [
                r['web_vitals'][metric]
                for r in results
                if metric in r.get('web_vitals', {})
            ]

            if values:
                vitals[metric] = {
                    'p50': statistics.median(values),
                    'p95': statistics.quantiles(values, n=20)[18],
                    'avg': statistics.mean(values),
                    'good': self._calculate_percentage(
                        values,
                        metric,
                        'good'
                    ),
                    'needs_improvement': self._calculate_percentage(
                        values,
                        metric,
                        'needs_improvement'
                    ),
                    'poor': self._calculate_percentage(
                        values,
                        metric,
                        'poor'
                    )
                }

        return vitals

    def _calculate_percentage(self, values, metric, category):
        """计算百分比"""
        thresholds = {
            'lcp': {'good': 2500, 'poor': 4000},
            'fid': {'good': 100, 'poor': 300},
            'cls': {'good': 0.1, 'poor': 0.25}
        }

        threshold = thresholds[metric]

        if category == 'good':
            count = sum(1 for v in values if v < threshold['good'])
        elif category == 'poor':
            count = sum(1 for v in values if v > threshold['poor'])
        else:  # needs_improvement
            count = sum(
                1 for v in values
                if threshold['good'] <= v <= threshold['poor']
            )

        return count / len(values) * 100 if values else 0

# 使用示例
monitor = SyntheticMonitoring(config={
    'locations': ['us-east', 'eu-west', 'ap-southeast'],
    'browsers': ['chrome', 'firefox', 'safari']
})

# 定义测试场景
test_scenario = {
    'url': 'https://example.com',
    'scenario': {
        'name': 'User Login Flow',
        'steps': [
            {
                'name': 'Navigate to login',
                'type': 'click',
                'selector_type': 'id',
                'selector': 'login-button'
            },
            {
                'name': 'Enter username',
                'type': 'input',
                'selector_type': 'name',
                'selector': 'username',
                'value': 'testuser'
            },
            {
                'name': 'Enter password',
                'type': 'input',
                'selector_type': 'name',
                'selector': 'password',
                'value': 'testpass'
            },
            {
                'name': 'Submit login',
                'type': 'click',
                'selector_type': 'id',
                'selector': 'submit-button'
            }
        ]
    }
}

# 运行测试
results = monitor.run_test(
    test_scenario['url'],
    test_scenario['scenario']
)

# 分析结果
analysis = monitor.analyze_results(period='24h')
```

### 16.2.3 Application Performance Monitoring (APM)

**后端性能监控**

```python
# APM 集成示例 (使用 OpenTelemetry)
from opentelemetry import trace, metrics
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.resources import Resource

class APMIntegration:
    """APM 集成"""

    def __init__(self, service_name, endpoint):
        self.service_name = service_name
        self.endpoint = endpoint
        self.setup_tracing()
        self.setup_metrics()

    def setup_tracing(self):
        """设置分布式追踪"""
        resource = Resource(attributes={
            "service.name": self.service_name
        })

        tracer_provider = TracerProvider(resource=resource)

        # 配置导出器
        otlp_exporter = OTLPSpanExporter(
            endpoint=self.endpoint,
            insecure=True
        )

        # 添加批处理器
        span_processor = BatchSpanProcessor(otlp_exporter)
        tracer_provider.add_span_processor(span_processor)

        trace.set_tracer_provider(tracer_provider)

    def setup_metrics(self):
        """设置指标收集"""
        # 设置指标提供者
        pass  # 根据实际 APM 平台配置

    def instrument_app(self, app):
        """自动注入"""
        # Flask 自动注入
        FlaskInstrumentor().instrument_app(app)

        # Requests 自动注入
        RequestsInstrumentor().instrument()

        # SQLAlchemy 自动注入
        SQLAlchemyInstrumentor().instrument()

        return app

    def create_custom_span(self, name):
        """创建自定义 span"""
        tracer = trace.get_tracer(__name__)
        return tracer.start_as_current_span(name)

# 使用示例
from flask import Flask, request
import time

app = Flask(__name__)

# 初始化 APM
apm = APMIntegration(
    service_name='my-service',
    endpoint='http://apm-collector:4317'
)

# 注入应用
app = apm.instrument_app(app)

@app.route('/api/users')
def get_users():
    # 自动创建 span
    with apm.create_custom_span('fetch_users'):
        users = fetch_users_from_db()

        # 添加自定义属性
        span = trace.get_current_span()
        span.set_attribute('user_count', len(users))

        return {'users': users}

@app.route('/api/process')
def process_data():
    # 记录慢查询
    with apm.create_custom_span('slow_query') as span:
        start = time.time()
        result = expensive_operation()
        duration = time.time() - start

        # 标记慢操作
        if duration > 1.0:
            span.set_attribute('slow_query', True)
            span.set_attribute('duration_ms', duration * 1000)

        return {'result': result}

# 性能中间件
@app.before_request
def before_request():
    request.start_time = time.time()

@app.after_request
def after_request(response):
    if hasattr(request, 'start_time'):
        duration = time.time() - request.start_time

        # 记录请求时长
        span = trace.get_current_span()
        span.set_attribute('http.duration_ms', duration * 1000)

        # 添加响应头
        response.headers['X-Response-Time'] = f'{duration * 1000:.2f}ms'

    return response
```

## 16.3 性能瓶颈识别

### 16.3.1 前端瓶颈分析

**性能分析工具使用**

```javascript
// 性能分析工具类
class PerformanceProfiler {
  constructor() {
    this.marks = new Map();
    this.measures = [];
  }

  // 标记性能点
  mark(name) {
    performance.mark(name);
    this.marks.set(name, performance.now());
  }

  // 测量性能
  measure(name, startMark, endMark) {
    performance.measure(name, startMark, endMark);

    const measure = performance.getEntriesByName(name, 'measure')[0];
    this.measures.push({
      name,
      duration: measure.duration,
      startTime: measure.startTime,
      timestamp: Date.now()
    });

    return measure.duration;
  }

  // 分析长任务
  analyzeLongTasks() {
    return new Promise((resolve) => {
      const longTasks = [];

      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          longTasks.push({
            duration: entry.duration,
            startTime: entry.startTime,
            attribution: entry.attribution
          });
        });
      });

      observer.observe({ entryTypes: ['longtask'] });

      // 收集5秒的数据
      setTimeout(() => {
        observer.disconnect();
        resolve(this.categorizeLongTasks(longTasks));
      }, 5000);
    });
  }

  categorizeLongTasks(tasks) {
    const categories = {
      script: [],
      layout: [],
      paint: [],
      other: []
    };

    tasks.forEach((task) => {
      const attribution = task.attribution[0];
      const category = this.determineTaskCategory(attribution);
      categories[category].push(task);
    });

    return {
      total: tasks.length,
      totalTime: tasks.reduce((sum, t) => sum + t.duration, 0),
      categories,
      recommendations: this.generateRecommendations(categories)
    };
  }

  determineTaskCategory(attribution) {
    if (!attribution) return 'other';

    const containerType = attribution.containerType;
    const containerName = attribution.containerName;

    if (containerType === 'script') {
      return 'script';
    } else if (containerName && containerName.includes('style')) {
      return 'layout';
    } else if (containerType === 'iframe') {
      return 'other';
    }

    return 'other';
  }

  // 分析渲染性能
  analyzeRenderPerformance() {
    const paintEntries = performance.getEntriesByType('paint');
    const layoutShifts = performance.getEntriesByType('layout-shift');

    return {
      paint: {
        fcp: paintEntries.find(e => e.name === 'first-contentful-paint'),
        lcp: this.getLCP()
      },
      layoutShifts: {
        total: layoutShifts.length,
        clsScore: layoutShifts
          .filter(e => !e.hadRecentInput)
          .reduce((sum, e) => sum + e.value, 0),
        problematicShifts: layoutShifts
          .filter(e => e.value > 0.1)
          .map(e => ({
            value: e.value,
            sources: e.sources,
            time: e.startTime
          }))
      }
    };
  }

  getLCP() {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve({
          value: lastEntry.renderTime || lastEntry.loadTime,
          element: lastEntry.element,
          url: lastEntry.url
        });
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    });
  }

  // 分析资源加载
  analyzeResourceLoading() {
    const resources = performance.getEntriesByType('resource');

    const analysis = {
      total: resources.length,
      byType: {},
      slow: [],
      large: [],
      recommendations: []
    };

    // 按类型分组
    resources.forEach((resource) => {
      const type = resource.initiatorType;
      if (!analysis.byType[type]) {
        analysis.byType[type] = {
          count: 0,
          totalSize: 0,
          totalDuration: 0,
          resources: []
        };
      }

      analysis.byType[type].count++;
      analysis.byType[type].totalSize += resource.transferSize || 0;
      analysis.byType[type].totalDuration += resource.duration;
      analysis.byType[type].resources.push({
        name: resource.name,
        size: resource.transferSize,
        duration: resource.duration
      });

      // 识别慢资源 (>1秒)
      if (resource.duration > 1000) {
        analysis.slow.push({
          name: resource.name,
          type: type,
          duration: resource.duration
        });
      }

      // 识别大资源 (>500KB)
      if (resource.transferSize > 512000) {
        analysis.large.push({
          name: resource.name,
          type: type,
          size: resource.transferSize
        });
      }
    });

    // 生成建议
    if (analysis.slow.length > 0) {
      analysis.recommendations.push({
        priority: 'high',
        issue: `发现 ${analysis.slow.length} 个加载缓慢的资源`,
        suggestion: '考虑使用 CDN、压缩或懒加载'
      });
    }

    if (analysis.large.length > 0) {
      analysis.recommendations.push({
        priority: 'high',
        issue: `发现 ${analysis.large.length} 个大文件`,
        suggestion: '优化图片、使用现代格式 (WebP、AVIF)、代码分割'
      });
    }

    return analysis;
  }

  // 分析 JavaScript 执行
  analyzeJavaScriptExecution() {
    const scripts = performance.getEntriesByType('resource')
      .filter(r => r.initiatorType === 'script');

    const analysis = {
      totalScripts: scripts.length,
      totalSize: scripts.reduce((sum, s) => sum + (s.transferSize || 0), 0),
      totalDuration: scripts.reduce((sum, s) => sum + s.duration, 0),
      blocking: [],
      recommendations: []
    };

    // 识别阻塞脚本
    scripts.forEach((script) => {
      // 检查是否在关键路径上
      if (script.startTime < 2000 && script.duration > 100) {
        analysis.blocking.push({
          name: script.name,
          duration: script.duration,
          size: script.transferSize
        });
      }
    });

    if (analysis.blocking.length > 0) {
      analysis.recommendations.push({
        priority: 'high',
        issue: '关键路径上有阻塞脚本',
        suggestion: '使用 async/defer、代码分割、移除未使用的代码'
      });
    }

    return analysis;
  }

  // 生成完整报告
  async generateReport() {
    const report = {
      timestamp: Date.now(),
      navigation: performance.getEntriesByType('navigation')[0],
      render: this.analyzeRenderPerformance(),
      resources: this.analyzeResourceLoading(),
      javascript: this.analyzeJavaScriptExecution(),
      longTasks: await this.analyzeLongTasks(),
      recommendations: []
    };

    // 合并所有建议
    report.recommendations = [
      ...report.resources.recommendations,
      ...report.javascript.recommendations,
      ...report.longTasks.recommendations
    ];

    // 按优先级排序
    report.recommendations.sort((a, b) => {
      const priority = { high: 3, medium: 2, low: 1 };
      return priority[b.priority] - priority[a.priority];
    });

    return report;
  }

  generateRecommendations(categories) {
    const recommendations = [];

    if (categories.script.length > 5) {
      recommendations.push({
        priority: 'high',
        issue: `发现 ${categories.script.length} 个长任务脚本`,
        suggestion: '代码分割、Web Worker、优化算法复杂度'
      });
    }

    if (categories.layout.length > 3) {
      recommendations.push({
        priority: 'medium',
        issue: `发现 ${categories.layout.length} 个长任务布局`,
        suggestion: '减少 DOM 操作、使用 CSS transforms、避免强制同步布局'
      });
    }

    return recommendations;
  }
}

// 使用示例
const profiler = new PerformanceProfiler();

// 标记关键点
profiler.mark('app-start');
// ... 应用代码
profiler.mark('app-ready');

// 测量
const startupTime = profiler.measure(
  'startup-time',
  'app-start',
  'app-ready'
);

// 生成报告
profiler.generateReport().then((report) => {
  console.log('Performance Report:', report);

  // 发送到分析服务
  fetch('/api/performance', {
    method: 'POST',
    body: JSON.stringify(report)
  });
});
```

### 16.3.2 后端瓶颈分析

**数据库查询优化**

```python
# 数据库性能分析工具
import time
import functools
from contextlib import contextmanager

class DatabaseProfiler:
    """数据库性能分析器"""

    def __init__(self):
        self.queries = []
        self.slow_query_threshold = 100  # ms

    @contextmanager
    def profile_query(self, query_name):
        """查询性能分析上下文管理器"""
        start_time = time.time()
        query_start = time.perf_counter()

        try:
            yield
        finally:
            duration = (time.perf_counter() - query_start) * 1000  # ms

            query_info = {
                'name': query_name,
                'duration_ms': duration,
                'timestamp': start_time,
                'slow': duration > self.slow_query_threshold
            }

            self.queries.append(query_info)

            if query_info['slow']:
                self.log_slow_query(query_info)

    def log_slow_query(self, query_info):
        """记录慢查询"""
        print(f"⚠️  Slow Query Detected:")
        print(f"   Name: {query_info['name']}")
        print(f"   Duration: {query_info['duration_ms']:.2f}ms")

    def analyze_queries(self):
        """分析查询性能"""
        if not self.queries:
            return None

        total_queries = len(self.queries)
        slow_queries = [q for q in self.queries if q['slow']]

        durations = [q['duration_ms'] for q in self.queries]

        analysis = {
            'total_queries': total_queries,
            'slow_queries': len(slow_queries),
            'slow_query_rate': len(slow_queries) / total_queries * 100,
            'avg_duration': sum(durations) / len(durations),
            'max_duration': max(durations),
            'min_duration': min(durations),
            'p95_duration': sorted(durations)[int(len(durations) * 0.95)],
            'slowest_queries': sorted(
                self.queries,
                key=lambda q: q['duration_ms'],
                reverse=True
            )[:5]
        }

        return analysis

# SQLAlchemy 集成
from sqlalchemy import event
from sqlalchemy.engine import Engine

class SQLAlchemyProfiler:
    """SQLAlchemy 性能分析"""

    def __init__(self, engine):
        self.engine = engine
        self.queries = []
        self.setup_event_listeners()

    def setup_event_listeners(self):
        """设置事件监听器"""
        @event.listens_for(Engine, "before_cursor_execute")
        def before_cursor_execute(
            conn, cursor, statement, parameters, context, executemany
        ):
            conn.info.setdefault('query_start_time', []).append(
                time.perf_counter()
            )

        @event.listens_for(Engine, "after_cursor_execute")
        def after_cursor_execute(
            conn, cursor, statement, parameters, context, executemany
        ):
            total_time = (
                time.perf_counter() -
                conn.info['query_start_time'].pop()
            ) * 1000  # ms

            query_info = {
                'statement': statement,
                'parameters': parameters,
                'duration_ms': total_time,
                'timestamp': time.time()
            }

            self.queries.append(query_info)

            # 记录慢查询
            if total_time > 100:  # 100ms 阈值
                self.log_slow_query(query_info)

    def log_slow_query(self, query_info):
        """记录慢查询"""
        print(f"\n⚠️  Slow Query: {query_info['duration_ms']:.2f}ms")
        print(f"Statement: {query_info['statement'][:100]}...")

    def analyze_n_plus_one(self):
        """检测 N+1 查询问题"""
        # 按时间窗口分组查询
        time_window = 100  # ms
        query_groups = []
        current_group = []

        for query in sorted(self.queries, key=lambda q: q['timestamp']):
            if not current_group:
                current_group.append(query)
            else:
                time_diff = (
                    query['timestamp'] -
                    current_group[-1]['timestamp']
                ) * 1000

                if time_diff < time_window:
                    current_group.append(query)
                else:
                    query_groups.append(current_group)
                    current_group = [query]

        if current_group:
            query_groups.append(current_group)

        # 识别相似查询模式
        n_plus_one_candidates = []
        for group in query_groups:
            if len(group) > 5:  # 5个以上相似查询
                statements = [q['statement'] for q in group]
                if self._are_similar_queries(statements):
                    n_plus_one_candidates.append({
                        'count': len(group),
                        'total_time': sum(q['duration_ms'] for q in group),
                        'sample_query': group[0]['statement']
                    })

        return n_plus_one_candidates

    def _are_similar_queries(self, statements):
        """检查查询是否相似"""
        # 简化的相似性检查
        # 实际实现可能需要更复杂的模式匹配
        if len(statements) < 2:
            return False

        # 移除参数,比较查询结构
        normalized = [
            self._normalize_query(s)
            for s in statements
        ]

        return len(set(normalized)) == 1

    def _normalize_query(self, query):
        """规范化查询(移除参数)"""
        # 简单实现:移除数字参数
        import re
        return re.sub(r'\d+', '?', query)

# 使用示例
profiler = DatabaseProfiler()

def get_users():
    with profiler.profile_query('get_all_users'):
        users = db.session.query(User).all()

    return users

def get_user_posts(user_id):
    with profiler.profile_query(f'get_posts_for_user_{user_id}'):
        posts = db.session.query(Post).filter_by(user_id=user_id).all()

    return posts

# 分析查询
analysis = profiler.analyze_queries()
print(f"Total queries: {analysis['total_queries']}")
print(f"Slow queries: {analysis['slow_queries']}")
print(f"Average duration: {analysis['avg_duration']:.2f}ms")
```

**API 性能分析**

```python
# API 性能监控装饰器
import time
import functools
from flask import request, g

class APIPerformanceMonitor:
    """API 性能监控"""

    def __init__(self):
        self.requests = []

    def monitor_endpoint(self, func):
        """监控端点装饰器"""
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # 开始计时
            start_time = time.perf_counter()

            # 记录请求信息
            request_info = {
                'endpoint': request.endpoint,
                'method': request.method,
                'path': request.path,
                'args': dict(request.args),
                'start_time': time.time()
            }

            try:
                # 执行函数
                result = func(*args, **kwargs)
                request_info['status'] = 'success'
                return result

            except Exception as e:
                request_info['status'] = 'error'
                request_info['error'] = str(e)
                raise

            finally:
                # 计算耗时
                duration = (time.perf_counter() - start_time) * 1000
                request_info['duration_ms'] = duration

                # 记录慢请求
                if duration > 1000:  # 1秒阈值
                    request_info['slow'] = True

                self.requests.append(request_info)

        return wrapper

    def analyze_endpoints(self):
        """分析端点性能"""
        if not self.requests:
            return None

        # 按端点分组
        by_endpoint = {}
        for req in self.requests:
            endpoint = req['endpoint']
            if endpoint not in by_endpoint:
                by_endpoint[endpoint] = []
            by_endpoint[endpoint].append(req)

        # 分析每个端点
        analysis = {}
        for endpoint, requests in by_endpoint.items():
            durations = [r['duration_ms'] for r in requests]
            errors = [r for r in requests if r['status'] == 'error']
            slow = [r for r in requests if r.get('slow', False)]

            analysis[endpoint] = {
                'total_requests': len(requests),
                'error_rate': len(errors) / len(requests) * 100,
                'slow_requests': len(slow),
                'avg_duration': sum(durations) / len(durations),
                'p50_duration': sorted(durations)[len(durations) // 2],
                'p95_duration': sorted(durations)[int(len(durations) * 0.95)],
                'p99_duration': sorted(durations)[int(len(durations) * 0.99)],
                'max_duration': max(durations),
                'requests_per_second': len(requests) / (
                    requests[-1]['start_time'] -
                    requests[0]['start_time']
                )
            }

        return analysis

# Flask 应用集成
from flask import Flask

app = Flask(__name__)
monitor = APIPerformanceMonitor()

@app.route('/api/users')
@monitor.monitor_endpoint
def get_users():
    # 业务逻辑
    users = User.query.all()
    return {'users': [u.to_dict() for u in users]}

@app.route('/api/users/<int:user_id>')
@monitor.monitor_endpoint
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return user.to_dict()

# 性能报告端点
@app.route('/api/performance/report')
def performance_report():
    analysis = monitor.analyze_endpoints()
    return analysis
```

## 16.4 优化策略

### 16.4.1 前端优化

**资源优化**

```yaml
frontend_optimization_strategies:
  images:
    format_optimization:
      - 使用现代格式: "WebP, AVIF"
      - 自适应格式: "根据浏览器支持选择"
      - SVG优化: "SVGO压缩"

    size_optimization:
      - 响应式图片: "<picture>, srcset"
      - 图片压缩: "TinyPNG, ImageOptim"
      - 尺寸适配: "根据设备提供合适尺寸"

    loading_optimization:
      - 懒加载: "loading='lazy'"
      - 预加载关键图片: "<link rel='preload'>"
      - 渐进式加载: "LQIP, BlurHash"

  javascript:
    code_splitting:
      - 路由级分割: "按页面拆分"
      - 组件级分割: "React.lazy, dynamic import"
      - vendor分割: "第三方库单独打包"

    tree_shaking:
      - ES modules: "使用ES6模块"
      - 移除死代码: "未使用的导出"
      - sideEffects配置: "明确副作用"

    minification:
      - 压缩: "Terser, esbuild"
      - 混淆: "变量名缩短"
      - 移除注释和空白

  css:
    optimization:
      - 关键CSS内联: "首屏CSS"
      - CSS拆分: "按路由拆分"
      - 移除未使用CSS: "PurgeCSS"
      - CSS压缩: "cssnano"

    delivery:
      - 预加载: "<link rel='preload'>"
      - 媒体查询: "按设备加载"
      - CSS-in-JS优化: "提取关键样式"

  fonts:
    optimization:
      - 字体子集化: "只包含需要的字符"
      - 可变字体: "减少文件数量"
      - WOFF2格式: "最佳压缩"

    loading_strategy:
      - font-display: "swap"
      - 预连接: "preconnect to font CDN"
      - 本地回退: "系统字体栈"

  third_party_scripts:
    optimization:
      - 异步加载: "async, defer"
      - 延迟加载: "交互后加载"
      - 自托管: "减少DNS查找"
      - facade模式: "点击后加载"
```

**渲染优化**

```javascript
// 渲染性能优化技巧

// 1. 虚拟滚动 (处理大列表)
class VirtualScrollList {
  constructor(container, items, rowHeight) {
    this.container = container;
    this.items = items;
    this.rowHeight = rowHeight;
    this.visibleCount = Math.ceil(
      container.clientHeight / rowHeight
    ) + 1;

    this.setup();
  }

  setup() {
    // 创建容器
    this.scrollContainer = document.createElement('div');
    this.scrollContainer.style.height =
      `${this.items.length * this.rowHeight}px`;
    this.container.appendChild(this.scrollContainer);

    // 监听滚动
    this.container.addEventListener('scroll', () => {
      this.render();
    });

    // 初始渲染
    this.render();
  }

  render() {
    const scrollTop = this.container.scrollTop;
    const startIndex = Math.floor(scrollTop / this.rowHeight);
    const endIndex = Math.min(
      startIndex + this.visibleCount,
      this.items.length
    );

    // 只渲染可见项
    const visibleItems = this.items.slice(startIndex, endIndex);

    // 清空并重新渲染
    this.scrollContainer.innerHTML = '';

    visibleItems.forEach((item, index) => {
      const el = this.createItemElement(item);
      el.style.position = 'absolute';
      el.style.top = `${(startIndex + index) * this.rowHeight}px`;
      this.scrollContainer.appendChild(el);
    });
  }

  createItemElement(item) {
    const el = document.createElement('div');
    el.textContent = item.text;
    el.style.height = `${this.rowHeight}px`;
    return el;
  }
}

// 2. 防抖和节流
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 使用示例
const handleSearch = debounce((query) => {
  // 搜索逻辑
  fetch(`/api/search?q=${query}`)
    .then(r => r.json())
    .then(results => displayResults(results));
}, 300);

const handleScroll = throttle(() => {
  // 滚动处理逻辑
  updateScrollPosition();
}, 100);

searchInput.addEventListener('input', (e) => {
  handleSearch(e.target.value);
});

window.addEventListener('scroll', handleScroll);

// 3. requestAnimationFrame 优化动画
class SmoothAnimator {
  constructor() {
    this.running = false;
    this.lastTime = 0;
  }

  animate(callback) {
    if (this.running) return;

    this.running = true;

    const loop = (currentTime) => {
      if (!this.lastTime) {
        this.lastTime = currentTime;
      }

      const deltaTime = currentTime - this.lastTime;
      this.lastTime = currentTime;

      callback(deltaTime);

      if (this.running) {
        requestAnimationFrame(loop);
      }
    };

    requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    this.lastTime = 0;
  }
}

// 使用示例
const animator = new SmoothAnimator();

let position = 0;
animator.animate((deltaTime) => {
  position += 0.1 * deltaTime;
  element.style.transform = `translateX(${position}px)`;

  if (position > 500) {
    animator.stop();
  }
});

// 4. Web Worker 处理密集计算
// main.js
const worker = new Worker('worker.js');

// 发送任务
worker.postMessage({
  type: 'process_data',
  data: largeDataset
});

// 接收结果
worker.addEventListener('message', (event) => {
  const result = event.data;
  displayProcessedData(result);
});

// worker.js
self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  if (type === 'process_data') {
    // 执行密集计算
    const result = processLargeDataset(data);

    // 返回结果
    self.postMessage(result);
  }
});

function processLargeDataset(data) {
  // 复杂计算逻辑
  return data.map(item => {
    // 处理每个item
    return transformItem(item);
  });
}

// 5. Intersection Observer 懒加载
const lazyLoadObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;

        // 加载图片
        img.src = img.dataset.src;

        // 移除占位符
        img.classList.remove('lazy');

        // 停止观察
        observer.unobserve(img);
      }
    });
  },
  {
    rootMargin: '50px' // 提前50px开始加载
  }
);

// 观察所有懒加载图片
document.querySelectorAll('img.lazy').forEach((img) => {
  lazyLoadObserver.observe(img);
});

// 6. 避免布局抖动
class LayoutOptimizer {
  constructor() {
    this.reads = [];
    this.writes = [];
    this.scheduled = false;
  }

  // 批量读取
  read(callback) {
    this.reads.push(callback);
    this.schedule();
  }

  // 批量写入
  write(callback) {
    this.writes.push(callback);
    this.schedule();
  }

  schedule() {
    if (this.scheduled) return;

    this.scheduled = true;

    requestAnimationFrame(() => {
      // 先执行所有读操作
      this.reads.forEach(read => read());
      this.reads = [];

      // 再执行所有写操作
      this.writes.forEach(write => write());
      this.writes = [];

      this.scheduled = false;
    });
  }
}

const layoutOptimizer = new LayoutOptimizer();

// 使用示例
elements.forEach((element) => {
  // 读取
  layoutOptimizer.read(() => {
    const height = element.clientHeight;

    // 写入
    layoutOptimizer.write(() => {
      element.style.height = `${height * 2}px`;
    });
  });
});
```

### 16.4.2 后端优化

**缓存策略**

```python
# 多层缓存策略
from functools import wraps
from redis import Redis
import hashlib
import json
import time

class CacheStrategy:
    """缓存策略"""

    def __init__(self, redis_client):
        self.redis = redis_client
        self.local_cache = {}
        self.local_cache_ttl = 60  # 本地缓存1分钟

    def cache_key(self, func_name, *args, **kwargs):
        """生成缓存键"""
        key_data = {
            'func': func_name,
            'args': args,
            'kwargs': kwargs
        }
        key_str = json.dumps(key_data, sort_keys=True)
        return f"cache:{hashlib.md5(key_str.encode()).hexdigest()}"

    def get_from_cache(self, key):
        """从缓存获取"""
        # 1. 尝试本地缓存
        if key in self.local_cache:
            value, expiry = self.local_cache[key]
            if time.time() < expiry:
                return value
            else:
                del self.local_cache[key]

        # 2. 尝试 Redis
        value = self.redis.get(key)
        if value:
            # 存入本地缓存
            self.local_cache[key] = (
                json.loads(value),
                time.time() + self.local_cache_ttl
            )
            return json.loads(value)

        return None

    def set_to_cache(self, key, value, ttl=300):
        """设置缓存"""
        # 1. 设置 Redis
        self.redis.setex(
            key,
            ttl,
            json.dumps(value)
        )

        # 2. 设置本地缓存
        self.local_cache[key] = (
            value,
            time.time() + min(ttl, self.local_cache_ttl)
        )

    def cached(self, ttl=300):
        """缓存装饰器"""
        def decorator(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                # 生成缓存键
                key = self.cache_key(func.__name__, *args, **kwargs)

                # 尝试从缓存获取
                cached_value = self.get_from_cache(key)
                if cached_value is not None:
                    return cached_value

                # 执行函数
                result = func(*args, **kwargs)

                # 存入缓存
                self.set_to_cache(key, result, ttl)

                return result

            return wrapper
        return decorator

# Redis 连接
redis_client = Redis(host='localhost', port=6379, db=0)
cache = CacheStrategy(redis_client)

# 使用示例
@cache.cached(ttl=600)  # 缓存10分钟
def get_user_profile(user_id):
    """获取用户资料"""
    user = db.session.query(User).get(user_id)
    return user.to_dict()

@cache.cached(ttl=3600)  # 缓存1小时
def get_popular_posts():
    """获取热门文章"""
    posts = db.session.query(Post)\
        .filter(Post.views > 1000)\
        .order_by(Post.views.desc())\
        .limit(10)\
        .all()
    return [p.to_dict() for p in posts]
```

**数据库优化**

```python
# 数据库查询优化

# 1. 预加载关联数据 (避免 N+1 问题)
def get_users_with_posts():
    """获取用户及其文章 - 优化前"""
    users = db.session.query(User).all()

    # ❌ N+1 问题:每个用户都会触发一次查询
    for user in users:
        posts = user.posts  # 触发额外查询

    return users

def get_users_with_posts_optimized():
    """获取用户及其文章 - 优化后"""
    # ✅ 使用 joinedload 预加载
    from sqlalchemy.orm import joinedload

    users = db.session.query(User)\
        .options(joinedload(User.posts))\
        .all()

    # 所有数据已经加载,不会触发额外查询
    for user in users:
        posts = user.posts

    return users

# 2. 选择性加载字段
def get_user_names():
    """只获取用户名 - 优化前"""
    # ❌ 加载所有字段
    users = db.session.query(User).all()
    names = [u.username for u in users]
    return names

def get_user_names_optimized():
    """只获取用户名 - 优化后"""
    # ✅ 只查询需要的字段
    names = db.session.query(User.username).all()
    return [n[0] for n in names]

# 3. 批量操作
def update_users_bulk(user_updates):
    """批量更新 - 优化前"""
    # ❌ 逐个更新
    for user_id, data in user_updates.items():
        user = db.session.query(User).get(user_id)
        for key, value in data.items():
            setattr(user, key, value)
        db.session.commit()

def update_users_bulk_optimized(user_updates):
    """批量更新 - 优化后"""
    # ✅ 使用 bulk_update_mappings
    mappings = [
        {'id': user_id, **data}
        for user_id, data in user_updates.items()
    ]

    db.session.bulk_update_mappings(User, mappings)
    db.session.commit()

# 4. 索引优化
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # 添加索引
    __table_args__ = (
        db.Index('idx_username_email', 'username', 'email'),  # 复合索引
        db.Index('idx_created_at', 'created_at'),  # 单字段索引
    )

# 5. 查询优化
def search_users(keyword):
    """搜索用户 - 优化前"""
    # ❌ 使用 LIKE 全表扫描
    users = db.session.query(User)\
        .filter(User.username.like(f'%{keyword}%'))\
        .all()
    return users

def search_users_optimized(keyword):
    """搜索用户 - 优化后"""
    # ✅ 使用全文搜索索引
    from sqlalchemy import func

    users = db.session.query(User)\
        .filter(func.match(User.username, keyword))\
        .all()
    return users

# 6. 分页优化
def get_users_paginated(page, per_page):
    """分页查询 - 优化前"""
    # ❌ 使用 OFFSET (大页码时性能差)
    users = db.session.query(User)\
        .offset((page - 1) * per_page)\
        .limit(per_page)\
        .all()
    return users

def get_users_paginated_optimized(last_id=None, per_page=20):
    """分页查询 - 优化后"""
    # ✅ 使用 keyset pagination
    query = db.session.query(User)\
        .order_by(User.id.asc())

    if last_id:
        query = query.filter(User.id > last_id)

    users = query.limit(per_page).all()
    return users
```

**API优化**

```python
# API 性能优化技巧
from flask import Flask, jsonify, request
from functools import wraps
import gzip

app = Flask(__name__)

# 1. 响应压缩
def gzip_response(func):
    """Gzip 响应压缩"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        response = func(*args, **kwargs)

        # 检查客户端是否支持 gzip
        accept_encoding = request.headers.get('Accept-Encoding', '')

        if 'gzip' not in accept_encoding.lower():
            return response

        # 压缩响应
        if isinstance(response, dict):
            response = jsonify(response)

        content = response.get_data()
        compressed = gzip.compress(content)

        response.set_data(compressed)
        response.headers['Content-Encoding'] = 'gzip'
        response.headers['Content-Length'] = len(compressed)

        return response

    return wrapper

@app.route('/api/large-data')
@gzip_response
def get_large_data():
    # 返回大量数据
    return {'data': [...]}  # 大数组

# 2. 响应分页
def paginate_response(query, page, per_page, serializer):
    """分页辅助函数"""
    items = query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )

    return {
        'items': [serializer(item) for item in items.items],
        'pagination': {
            'page': items.page,
            'per_page': items.per_page,
            'total': items.total,
            'pages': items.pages,
            'has_next': items.has_next,
            'has_prev': items.has_prev
        }
    }

@app.route('/api/users')
def get_users():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)

    query = db.session.query(User)
    return paginate_response(
        query,
        page,
        per_page,
        lambda u: u.to_dict()
    )

# 3. 字段过滤
@app.route('/api/users/<int:user_id>')
def get_user(user_id):
    # 允许客户端指定需要的字段
    fields = request.args.get('fields', '').split(',')

    user = db.session.query(User).get_or_404(user_id)
    user_dict = user.to_dict()

    # 如果指定了字段,只返回指定字段
    if fields and fields[0]:
        user_dict = {
            k: v for k, v in user_dict.items()
            if k in fields
        }

    return user_dict

# 4. 批量请求
@app.route('/api/users/batch', methods=['POST'])
def get_users_batch():
    """批量获取用户"""
    user_ids = request.json.get('ids', [])

    # 一次查询获取所有用户
    users = db.session.query(User)\
        .filter(User.id.in_(user_ids))\
        .all()

    return {'users': [u.to_dict() for u in users]}

# 5. HTTP 缓存
@app.route('/api/config')
def get_config():
    """获取配置 (很少变化)"""
    config = get_app_config()

    response = jsonify(config)

    # 设置缓存头
    response.headers['Cache-Control'] = 'public, max-age=3600'  # 1小时
    response.headers['ETag'] = generate_etag(config)

    # 检查 If-None-Match
    if request.headers.get('If-None-Match') == response.headers['ETag']:
        return '', 304  # Not Modified

    return response

# 6. 条件请求
def generate_etag(data):
    """生成 ETag"""
    import hashlib
    import json

    content = json.dumps(data, sort_keys=True)
    return hashlib.md5(content.encode()).hexdigest()

# 7. 异步处理
from celery import Celery

celery = Celery(app.name)

@celery.task
def process_heavy_task(data):
    """处理耗时任务"""
    # 复杂计算
    result = complex_processing(data)
    return result

@app.route('/api/process', methods=['POST'])
def start_processing():
    """启动异步处理"""
    data = request.json

    # 提交任务到队列
    task = process_heavy_task.delay(data)

    return {
        'task_id': task.id,
        'status': 'processing'
    }

@app.route('/api/process/<task_id>')
def get_task_status(task_id):
    """获取任务状态"""
    task = process_heavy_task.AsyncResult(task_id)

    if task.ready():
        return {
            'status': 'completed',
            'result': task.result
        }
    else:
        return {
            'status': 'processing'
        }
```

## 16.5 性能预算

### 16.5.1 性能预算设定

```yaml
performance_budget:
  page_weight:
    html: "50 KB"
    css: "100 KB"
    javascript: "300 KB"
    images: "500 KB"
    fonts: "150 KB"
    total: "1 MB"

  core_web_vitals:
    LCP: "< 2.5s"
    FID: "< 100ms"
    CLS: "< 0.1"

  timing_metrics:
    TTFB: "< 600ms"
    FCP: "< 1.8s"
    TTI: "< 3.8s"
    TBT: "< 200ms"
    Speed_Index: "< 3.4s"

  backend_metrics:
    api_p95: "< 500ms"
    api_p99: "< 1000ms"
    error_rate: "< 0.1%"
    database_p95: "< 50ms"

  enforcement:
    automated_checks:
      - CI/CD pipeline
      - Pull request checks
      - Lighthouse CI

    failure_thresholds:
      blocking: "超过预算 20%"
      warning: "超过预算 10%"

    monitoring:
      frequency: "每小时"
      alerting: "超过预算时通知团队"
```

### 16.5.2 性能预算监控

```javascript
// Lighthouse CI 配置
// lighthouserc.json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3000/",
        "http://localhost:3000/products",
        "http://localhost:3000/checkout"
      ],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        // Core Web Vitals
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "first-input-delay": ["error", {"maxNumericValue": 100}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}],

        // 其他指标
        "first-contentful-paint": ["warn", {"maxNumericValue": 1800}],
        "speed-index": ["warn", {"maxNumericValue": 3400}],
        "interactive": ["warn", {"maxNumericValue": 3800}],
        "total-blocking-time": ["warn", {"maxNumericValue": 200}],

        // 资源大小
        "total-byte-weight": ["error", {"maxNumericValue": 1000000}],
        "dom-size": ["warn", {"maxNumericValue": 1500}],

        // 性能评分
        "performance-budget": ["error", {"minScore": 0.9}]
      }
    },
    "upload": {
      "target": "lhci",
      "serverBaseUrl": "http://lhci-server:9001"
    }
  }
}
```

```yaml
# GitHub Actions 集成
name: Performance Budget Check

on:
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '16'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Start server
        run: npm start & npx wait-on http://localhost:3000

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

      - name: Upload results
        uses: actions/upload-artifact@v2
        with:
          name: lighthouse-results
          path: .lighthouseci
```

## 16.6 持续性能改进

### 16.6.1 性能文化建设

```yaml
performance_culture:
  education:
    training:
      - 性能基础知识
      - 性能分析工具使用
      - 优化最佳实践
      - 性能预算理解

    resources:
      - 内部文档
      - 外部课程
      - 技术分享会
      - 案例研究

  accountability:
    ownership:
      - 前端团队: "前端性能"
      - 后端团队: "API 性能"
      - DevOps: "基础设施性能"
      - 产品团队: "用户体验指标"

    review_process:
      - PR review: "检查性能影响"
      - 设计评审: "考虑性能影响"
      - 上线检查: "验证性能指标"

  measurement:
    metrics_review:
      frequency: "每周"
      participants:
        - 技术负责人
        - 性能工程师
        - 相关开发人员

      agenda:
        - 回顾性能指标
        - 识别性能退化
        - 分析根本原因
        - 制定改进计划

    performance_sprint:
      frequency: "每季度"
      focus: "专门的性能优化冲刺"
      goals:
        - 解决积压的性能问题
        - 实施重大优化
        - 更新性能基础设施

  recognition:
    incentives:
      - 性能改进奖励
      - 公开表彰
      - 团队荣誉

    gamification:
      - 性能排行榜
      - 优化挑战赛
      - 性能徽章
```

### 16.6.2 性能演进路线图

```yaml
performance_roadmap:
  Q1_foundation:
    - 建立性能监控体系
    - 设定性能基线
    - 定义性能预算
    - 集成 CI/CD 检查

  Q2_optimization:
    - 实施关键优化
    - 图片优化
    - 代码分割
    - 缓存策略

  Q3_infrastructure:
    - CDN 优化
    - 数据库优化
    - API 性能提升
    - 服务器升级

  Q4_advanced:
    - 边缘计算
    - 预加载策略
    - 智能缓存
    - 性能AI预测
```

## 16.7 总结

### 关键要点

1. **性能指标体系**
   - Core Web Vitals (LCP, FID, CLS)
   - 后端性能指标 (响应时间, 吞吐量, 错误率)
   - 用户体验指标 (跳出率, 转化率, 满意度)

2. **性能监控**
   - RUM (真实用户监控)
   - Synthetic Monitoring (合成监控)
   - APM (应用性能监控)

3. **瓶颈识别**
   - 前端:资源加载, 渲染性能, JavaScript执行
   - 后端:数据库查询, API响应, 资源利用

4. **优化策略**
   - 前端:资源优化, 渲染优化, 代码分割
   - 后端:缓存策略, 数据库优化, API优化

5. **性能预算**
   - 设定明确的性能目标
   - 自动化检查和强制执行
   - 持续监控和告警

6. **性能文化**
   - 教育和培训
   - 责任归属
   - 定期回顾和改进

### 实施检查清单

**基础设施**
- [ ] 部署 RUM 监控
- [ ] 配置 Synthetic Monitoring
- [ ] 集成 APM 工具
- [ ] 设置性能告警

**优化实施**
- [ ] 图片和资源优化
- [ ] 代码分割和懒加载
- [ ] 实施缓存策略
- [ ] 数据库查询优化

**流程建设**
- [ ] 设定性能预算
- [ ] 集成 CI/CD 检查
- [ ] 建立性能回顾机制
- [ ] 制定性能路线图

**文化建设**
- [ ] 性能培训
- [ ] 性能责任分配
- [ ] 性能指标可视化
- [ ] 性能改进激励机制

### 下一章预告

下一章将探讨**完整案例研究**,通过实际项目展示如何应用DDAD方法论、AI工具和最佳实践,从需求到部署的全流程实战演练。
