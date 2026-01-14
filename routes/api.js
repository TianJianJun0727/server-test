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
  res.json({
    options: mockData["senders"],
    after: "1111",
    searchable: true,
  });
});

/**
 * 获取模板列表（依赖 senderId）
 * POST /api/templates
 */
router.post("/templates", (req, res) => {
  const { inputFields = {}, fetchOptions = {} } = req.body;
  const { from } = inputFields;
  const senderId = from?.["value"];
  if (!senderId) {
    console.log("❌ 缺少必需参数: senderId");
    return res.status(400).json({
      error: "Bad Request",
      message: "senderId is required",
    });
  }

  const options = mockData.templates[senderId] || [];
  res.json({
    options,
    after: "2222",
    searchable: true,
  });
});

/**
 * 获取语言列表（依赖 templateId）
 * POST /api/languages
 */
router.post("/languages", (req, res) => {
  const { inputFields = {} } = req.body;
  const { selectTemplate } = inputFields;
  const templateId = selectTemplate?.["value"];

  if (!templateId) {
    console.log("❌ 缺少必需参数: templateId");
    return res.status(400).json({
      error: "Bad Request",
      message: "templateId is required",
    });
  }

  const options = mockData.languages[templateId] || [];

  res.json({
    options,
    after: false,
    searchable: false,
  });
});

/**
 * Workflow Action 执行接口
 * POST /api/workflow-action
 */
router.post("/workflow-action", (req, res) => {
  const { inputFields = {} } = req.body;

  console.log("🚀 收到 Workflow Action 请求, 输入字段11:", inputFields, req.body);

  const { from, selectTemplate, selectLanguage, to } = req.body;

  // 验证必需字段
  if (!from || !selectTemplate || !selectLanguage || !to) {
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
