const express = require("express");
const router = express.Router();

// 模拟数据 - 实际项目中应该从数据库或外部 API 获取
const mockData = {
  senders: [
    {
      label: "ycTest +86 157 1889 2334",
      value: "105125325944430",
    },
    {
      label: "wujTest +86 159 7901 3837",
      value: "105125325944431",
    },
  ],

  templates: {
    105125325944430: [
      {
        label: "AUTHENTICATION:template_authentication_yc_aihong",
        value: "template_authentication_yc_aihong",
      },
      {
        label: "AUTHENTICATION:template_authentication_20251223140110",
        value: "template_authentication_20251223140110",
      },
    ],
    105125325944431: [
      {
        label: "MARKETING:template_marketing_promotion",
        value: "template_marketing_promotion",
      },
    ],
  },

  languages: {
    template_authentication_yc_aihong: [
      {
        label: "Chinese (CHN)",
        value: "zh_CN",
      },
      {
        label: "English (US)",
        value: "en_US",
      },
    ],
    template_authentication_20251223140110: [
      {
        label: "Chinese (CHN)",
        value: "zh_CN",
      },
    ],
    template_marketing_promotion: [
      {
        label: "English (US)",
        value: "en_US",
      },
    ],
  },

  templateParameters: {
    template_authentication_yc_aihong_zh_CN: {
      header: [
        {
          code: "code",
        },
      ],
      body: [
        {
          name: "name",
        },
      ],
      buttons: [
        {
          url: "url",
        },
      ],
    },
    template_authentication_yc_aihong_en_US: {
      header: [
        {
          verification_code: "verification_code",
        },
      ],
      body: [
        {
          user_name: "user_name",
        },
      ],
      buttons: [
        {
          link: "link",
        },
      ],
    },
    template_authentication_20251223140110_zh_CN: {
      header: [
        {
          aaa: "aaa",
        },
      ],
      body: [
        {
          bbb: "bbb",
        },
      ],
      buttons: [
        {
          ccc: "ccc",
        },
      ],
    },
  },
};

/**
 * 获取发送者列表
 * POST /api/senders
 */
router.post("/senders", (req, res) => {
  console.log("📤 返回 Sender 列表:", mockData.senders);
  res.json({
    results: mockData.senders,
  });
});

/**
 * 获取模板列表（依赖 senderId）
 * POST /api/templates
 */
router.post("/templates", (req, res) => {
  const { senderId } = req.body;

  if (!senderId) {
    console.log("❌ 缺少必需参数: senderId");
    return res.status(400).json({
      error: "Bad Request",
      message: "senderId is required",
    });
  }

  const templates = mockData.templates[senderId] || [];
  console.log(`📤 返回 Sender ${senderId} 的模板列表:`, templates);
  res.json(templates);
});

/**
 * 获取语言列表（依赖 templateId）
 * POST /api/languages
 */
router.post("/languages", (req, res) => {
  const { templateId } = req.body;

  if (!templateId) {
    console.log("❌ 缺少必需参数: templateId");
    return res.status(400).json({
      error: "Bad Request",
      message: "templateId is required",
    });
  }

  const languages = mockData.languages[templateId] || [];
  console.log(`📤 返回模板 ${templateId} 的语言列表:`, languages);
  res.json({
    results: languages,
  });
});

/**
 * 获取模板参数（依赖 templateId 和 language）
 * POST /api/template-parameters
 */
router.post("/template-parameters", (req, res) => {
  const { templateId, language } = req.body;

  if (!templateId || !language) {
    console.log("❌ 缺少必需参数: templateId 或 language");
    return res.status(400).json({
      error: "Bad Request",
      message: "templateId and language are required",
    });
  }

  const key = `${templateId}_${language}`;
  const parameters = mockData.templateParameters[key] || {
    header: [],
    body: [],
    buttons: [],
  };

  console.log(`📤 返回模板 ${templateId} (${language}) 的参数:`, parameters);
  res.json({
    results: parameters,
  });
});

/**
 * Workflow Action 执行接口
 * POST /api/workflow-action
 */
router.post("/workflow-action", (req, res) => {
  const { sender, selectTemplate, selectLanguage, templateParameters } =
    req.body;

  console.log("\n🔥 执行 Workflow Action");
  console.log("发送者:", sender);
  console.log("模板:", selectTemplate);
  console.log("语言:", selectLanguage);
  console.log("模板参数:", templateParameters);

  // 验证必需字段
  if (!sender || !selectTemplate || !selectLanguage || !templateParameters) {
    console.log("❌ 缺少必需字段");
    return res.status(400).json({
      outputFields: {
        messageId: "",
        status: "failed",
        errorMessage: "Missing required fields",
      },
    });
  }

  // 模拟成功响应
  const messageId = `msg_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  console.log("✅ 消息发送成功, Message ID:", messageId);

  res.json({
    messageId: messageId,
    status: "success",
    errorMessage: "",
  });
});

module.exports = router;
