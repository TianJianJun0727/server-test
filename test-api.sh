#!/bin/bash

# YCloud HubSpot API 测试脚本

BASE_URL="http://localhost:3000"

echo "=========================================="
echo "YCloud HubSpot API 测试"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 测试 1: 获取发送者列表
echo -e "${BLUE}测试 1: 获取发送者列表${NC}"
echo "请求: GET $BASE_URL/api/senders"
echo "响应:"
curl -s "$BASE_URL/api/senders" | json_pp || curl -s "$BASE_URL/api/senders"
echo ""
echo ""

# 测试 2: 获取模板列表
SENDER_ID="105125325944430"
echo -e "${BLUE}测试 2: 获取模板列表${NC}"
echo "请求: GET $BASE_URL/api/templates?senderId=$SENDER_ID"
echo "响应:"
curl -s "$BASE_URL/api/templates?senderId=$SENDER_ID" | json_pp || curl -s "$BASE_URL/api/templates?senderId=$SENDER_ID"
echo ""
echo ""

# 测试 3: 获取语言列表
TEMPLATE_ID="template_authentication_yc_aihong"
echo -e "${BLUE}测试 3: 获取语言列表${NC}"
echo "请求: GET $BASE_URL/api/languages?templateId=$TEMPLATE_ID"
echo "响应:"
curl -s "$BASE_URL/api/languages?templateId=$TEMPLATE_ID" | json_pp || curl -s "$BASE_URL/api/languages?templateId=$TEMPLATE_ID"
echo ""
echo ""

# 测试 4: 获取模板参数
LANGUAGE="zh_CN"
echo -e "${BLUE}测试 4: 获取模板参数${NC}"
echo "请求: GET $BASE_URL/api/template-parameters?templateId=$TEMPLATE_ID&language=$LANGUAGE"
echo "响应:"
curl -s "$BASE_URL/api/template-parameters?templateId=$TEMPLATE_ID&language=$LANGUAGE" | json_pp || curl -s "$BASE_URL/api/template-parameters?templateId=$TEMPLATE_ID&language=$LANGUAGE"
echo ""
echo ""

# 测试 5: 执行 Workflow Action
echo -e "${BLUE}测试 5: 执行 Workflow Action${NC}"
echo "请求: POST $BASE_URL/api/workflow-action"
echo "请求体:"
cat << EOF
{
  "sender": "$SENDER_ID",
  "selectTemplate": "$TEMPLATE_ID",
  "selectLanguage": "$LANGUAGE",
  "templateParameters": "{\"header\":[{\"code\":\"123456\"}],\"body\":[{\"name\":\"张三\"}],\"buttons\":[{\"url\":\"https://example.com\"}]}"
}
EOF
echo ""
echo "响应:"
curl -s -X POST "$BASE_URL/api/workflow-action" \
  -H "Content-Type: application/json" \
  -d "{
    \"sender\": \"$SENDER_ID\",
    \"selectTemplate\": \"$TEMPLATE_ID\",
    \"selectLanguage\": \"$LANGUAGE\",
    \"templateParameters\": \"{\\\"header\\\":[{\\\"code\\\":\\\"123456\\\"}],\\\"body\\\":[{\\\"name\\\":\\\"张三\\\"}],\\\"buttons\\\":[{\\\"url\\\":\\\"https://example.com\\\"}]}\"
  }" | json_pp || curl -s -X POST "$BASE_URL/api/workflow-action" \
  -H "Content-Type: application/json" \
  -d "{
    \"sender\": \"$SENDER_ID\",
    \"selectTemplate\": \"$TEMPLATE_ID\",
    \"selectLanguage\": \"$LANGUAGE\",
    \"templateParameters\": \"{\\\"header\\\":[{\\\"code\\\":\\\"123456\\\"}],\\\"body\\\":[{\\\"name\\\":\\\"张三\\\"}],\\\"buttons\\\":[{\\\"url\\\":\\\"https://example.com\\\"}]}\"
  }"
echo ""
echo ""

echo -e "${GREEN}=========================================="
echo "测试完成！"
echo "==========================================${NC}"
