# X1PAG 支付系统故障排查指南

## 问题：点击 "Proceed to Payment" 出现 "Payment gateway error"

### ✅ 已解决：缺少环境变量

**原因**: `.env.local` 文件中缺少 X1PAG 配置。

### 解决方案

#### 1. 确保 `.env.local` 包含以下配置

```bash
# X1PAG Payment Gateway
X1PAG_MERCHANT_NAME=OddsFlow
X1PAG_MERCHANT_KEY=98bb56a2-f8e0-11f0-af6a-9ebb24d99120
X1PAG_PASSWORD=2287b31bed4d0eed2de071d1479ac5d5
X1PAG_HOST=https://pay.x1pag.com

# X1PAG Callback URLs (本地开发)
X1PAG_CALLBACK_URL=http://localhost:3000/api/payment/callback
X1PAG_RETURN_URL=http://localhost:3000/payment/success
X1PAG_CANCEL_URL=http://localhost:3000/payment/cancel

# Supabase Service Role Key (从 Supabase Dashboard 获取)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

#### 2. 重启开发服务器

环境变量修改后，**必须重启开发服务器**：

```bash
# 停止当前服务器 (Ctrl+C)
# 然后重新启动
npm run dev
```

#### 3. 验证配置

现在再次访问 checkout 页面并点击 "Proceed to Payment"。

你应该在**终端控制台**看到以下日志：

```
Payment Create API Called: { planType: 'pro', currency: 'USD', userId: '***' }
X1PAG Request: {
  url: 'https://pay.x1pag.com/api/v1/checkout',
  currency: 'USD',
  amount: 17.99,
  merchantKey: '***9120'
}
X1PAG Response Status: 200 OK
```

## 调试步骤

### 1. 检查浏览器控制台（F12）

打开开发者工具 > Console 标签页，查看：

- ❌ 有红色错误？
- ✅ 网络请求成功？

### 2. 检查 Network 标签页

找到 `/api/payment/create` 请求：

- **Status**: 应该是 200 (成功)
- **Response**: 检查返回的数据
- **Request Payload**: 确认发送的数据正确

### 3. 检查终端日志

终端应该显示：

```
Payment Create API Called: { planType: 'pro', currency: 'USD', userId: '***' }
X1PAG Request: { ... }
X1PAG Response Status: ...
```

如果看到错误：

- `X1PAG Response Status: 401 Unauthorized` → 检查 merchant key/password
- `X1PAG Response Status: 400 Bad Request` → 检查请求数据格式
- `X1PAG Response Status: 500 Internal Server Error` → X1PAG 服务器问题

## 常见问题

### Q: 环境变量已添加，但还是不工作

**A**: 确保：
1. ✅ 已重启开发服务器
2. ✅ `.env.local` 文件在项目根目录
3. ✅ 没有多余的空格或引号

### Q: 看到 "Missing user information" 错误

**A**: 确保你已登录。访问 `/login` 登录后再试。

### Q: X1PAG 返回 401 错误

**A**:
1. 检查 `X1PAG_MERCHANT_KEY` 是否正确
2. 检查 `X1PAG_PASSWORD` 是否正确
3. 联系 X1PAG 团队确认账户状态

### Q: USD 支付失败，但 BRL 可以

**A**:
1. 联系 X1PAG 确认 USD 支付已启用
2. 可能需要额外配置或账户升级

### Q: 回调 URL 问题

**A**:
**本地开发**:
- 使用 `http://localhost:3000/api/payment/callback`
- 或使用 ngrok 提供外网访问

**生产环境**:
- 使用实际域名: `https://oddsflow.com/api/payment/callback`
- 发送给 X1PAG 团队进行白名单配置

## 生产环境部署

### 1. Vercel 环境变量

在 Vercel Dashboard > Settings > Environment Variables 添加：

```
X1PAG_MERCHANT_NAME=OddsFlow
X1PAG_MERCHANT_KEY=98bb56a2-f8e0-11f0-af6a-9ebb24d99120
X1PAG_PASSWORD=2287b31bed4d0eed2de071d1479ac5d5
X1PAG_HOST=https://pay.x1pag.com
X1PAG_CALLBACK_URL=https://your-domain.com/api/payment/callback
X1PAG_RETURN_URL=https://your-domain.com/payment/success
X1PAG_CANCEL_URL=https://your-domain.com/payment/cancel
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. 联系 X1PAG

发送邮件给 X1PAG 团队，提供：

```
Subject: OddsFlow Production Callback URL

Olá,

Para o ambiente de produção, seguem as informações:

1. Callback URL: https://your-domain.com/api/payment/callback
2. Return URL: https://your-domain.com/payment/success
3. Cancel URL: https://your-domain.com/payment/cancel
4. Domínio: your-domain.com

Obrigado!
```

### 3. 测试生产环境

1. 部署到 Vercel
2. 访问 `https://your-domain.com/pricing`
3. 选择计划并完成支付测试

## 验证 Service Role Key

### 如何获取 Supabase Service Role Key

1. 访问 [Supabase Dashboard](https://app.supabase.com)
2. 选择你的项目
3. Settings > API
4. 找到 "service_role" secret key
5. 复制并添加到 `.env.local`:

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **警告**: Service Role Key 拥有完整权限，绝不能暴露在客户端！

## 成功标志

### 本地开发成功的迹象：

1. ✅ 终端显示 "Payment Create API Called"
2. ✅ 终端显示 "X1PAG Request"
3. ✅ 终端显示 "X1PAG Response Status: 200"
4. ✅ 浏览器控制台无错误
5. ✅ 页面重定向到 X1PAG 支付页面

### 如果成功：

用户会被重定向到类似这样的 URL：
```
https://pay.x1pag.com/checkout/abc123xyz...
```

这个页面是 X1PAG 的支付页面，用户在那里完成支付。

## 下一步

1. ✅ 确保本地开发环境正常工作
2. 📝 在 Supabase 运行 `create_payment_tables.sql`
3. 🚀 配置生产环境变量
4. 📧 联系 X1PAG 设置回调白名单
5. 🧪 进行端到端测试

## 需要帮助？

- 📖 查看 `X1PAG_INTEGRATION_GUIDE.md`
- 📖 查看 `X1PAG_MULTI_CURRENCY_GUIDE.md`
- 🌐 X1PAG 文档: https://docs.x1pag.com

---

**最后更新**: 2026-01-28
**状态**: ✅ 问题已解决 - 环境变量已添加
