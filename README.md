# YCloud HubSpot 服务器

## 项目说明

这是一个为 HubSpot Workflow Actions 提供后端 API 的 Node.js 服务器，用于集成 YCloud 消息发送服务。

## 功能

该服务器提供以下 API 接口：

1. **GET /api/senders** - 获取发送者列表
2. **GET /api/templates?senderId={id}** - 获取模板列表（依赖发送者）
3. **GET /api/languages?templateId={id}** - 获取语言列表（依赖模板）
4. **GET /api/template-parameters?templateId={id}&language={lang}** - 获取模板参数（依赖模板和语言）
5. **POST /api/workflow-action** - Workflow Action 执行接口

## 安装

```bash
cd server
npm install
```

## 配置

1. 复制 `.env.example` 文件为 `.env`：

```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，配置相应的参数：

```env
PORT=3000
NODE_ENV=development
YCLOUD_API_KEY=your_api_key_here
YCLOUD_API_URL=https://www-test.ycloud.com
```

## 运行

### 开发模式（带自动重启）

```bash
npm run dev
```

### 生产模式

```bash
npm start
```

服务器将在 `http://localhost:3000` 启动。

## API 文档

### 1. 获取发送者列表

**请求：**
```http
GET /api/senders
```

**响应：**
```json
[
  {
    "label": "ycTest +86 157 1889 2334",
    "value": "105125325944430"
  },
  {
    "label": "wujTest +86 159 7901 3837",
    "value": "105125325944431"
  }
]
```

### 2. 获取模板列表

**请求：**
```http
GET /api/templates?senderId=105125325944430
```

**响应：**
```json
[
  {
    "label": "AUTHENTICATION:template_authentication_yc_aihong",
    "value": "template_authentication_yc_aihong"
  },
  {
    "label": "AUTHENTICATION:template_authentication_20251223140110",
    "value": "template_authentication_20251223140110"
  }
]
```

### 3. 获取语言列表

**请求：**
```http
GET /api/languages?templateId=template_authentication_yc_aihong
```

**响应：**
```json
[
  {
    "label": "Chinese (CHN)",
    "value": "zh_CN"
  },
  {
    "label": "English (US)",
    "value": "en_US"
  }
]
```

### 4. 获取模板参数

**请求：**
```http
GET /api/template-parameters?templateId=template_authentication_yc_aihong&language=zh_CN
```

**响应：**
```json
{
  "header": [
    {
      "code": "code"
    }
  ],
  "body": [
    {
      "name": "name"
    }
  ],
  "buttons": [
    {
      "url": "url"
    }
  ]
}
```

### 5. 执行 Workflow Action

**请求：**
```http
POST /api/workflow-action
Content-Type: application/json

{
  "sender": "105125325944430",
  "selectTemplate": "template_authentication_yc_aihong",
  "selectLanguage": "zh_CN",
  "templateParameters": "{\"header\":[{\"code\":\"123456\"}],\"body\":[{\"name\":\"张三\"}],\"buttons\":[{\"url\":\"https://example.com\"}]}"
}
```

**响应：**
```json
{
  "outputFields": {
    "messageId": "msg_1234567890_abc123def",
    "status": "success",
    "errorMessage": ""
  }
}
```

## 日志

服务器会在控制台打印所有请求的详细信息，包括：

- 请求时间
- 请求方法
- 请求路径
- 查询参数
- 请求体

示例输出：

```
=== 接收到请求 ===
时间: 2024-01-13T12:00:00.000Z
方法: GET
路径: /api/senders
查询参数: {}
请求体: {}
==================

📤 返回 Sender 列表: [...]
```

## 注意事项

1. 当前使用的是模拟数据，实际使用时需要：
   - 将 `mockData` 替换为真实的数据库查询或 API 调用
   - 实现真实的 YCloud API 集成
   - 添加身份验证和授权机制

2. 在 HubSpot Workflow Actions 配置中，需要更新 `actionUrl` 和 `optionsUrl` 为实际的服务器地址。

3. 确保 HubSpot 可以访问您的服务器（可能需要公网 IP 或使用 ngrok 等工具）。

## 测试

可以使用 curl 或 Postman 测试 API：

```bash
# 测试获取发送者列表
curl http://localhost:3000/api/senders

# 测试获取模板列表
curl "http://localhost:3000/api/templates?senderId=105125325944430"

# 测试获取语言列表
curl "http://localhost:3000/api/languages?templateId=template_authentication_yc_aihong"

# 测试获取模板参数
curl "http://localhost:3000/api/template-parameters?templateId=template_authentication_yc_aihong&language=zh_CN"

# 测试 Workflow Action
curl -X POST http://localhost:3000/api/workflow-action \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "105125325944430",
    "selectTemplate": "template_authentication_yc_aihong",
    "selectLanguage": "zh_CN",
    "templateParameters": "{\"header\":[{\"code\":\"123456\"}]}"
  }'
```

## 部署

部署到生产环境时：

1. 设置环境变量 `NODE_ENV=production`
2. 使用 PM2 或其他进程管理器运行服务器
3. 配置 HTTPS（推荐使用 Nginx 反向代理）
4. 设置适当的 CORS 策略
5. 添加速率限制和安全中间件
