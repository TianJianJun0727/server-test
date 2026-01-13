require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 日志中间件 - 打印所有请求
app.use((req, res, next) => {
  console.log('\n=== 接收到请求 ===');
  console.log('时间:', new Date().toISOString());
  console.log('方法:', req.method);
  console.log('路径:', req.path);
  console.log('查询参数:', req.query);
  console.log('请求体:', req.body);
  console.log('==================\n');
  next();
});

// API 路由
app.use('/api', apiRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('错误:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`\n🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`📋 API 端点:`);
  console.log(`   - GET  /api/senders - 获取发送者列表`);
  console.log(`   - GET  /api/templates?senderId={id} - 获取模板列表`);
  console.log(`   - GET  /api/languages?templateId={id} - 获取语言列表`);
  console.log(`   - GET  /api/template-parameters?templateId={id}&language={lang} - 获取模板参数`);
  console.log(`   - POST /api/workflow-action - Workflow Action 执行接口\n`);
});
