# X1PAG Payment Gateway Integration Guide

## 概览

本指南详细说明如何将 X1PAG 支付网关集成到 OddsFlow 订阅系统中。

## 支付凭证

```
Merchant Name: OddsFlow
Merchant Key: 98bb56a2-f8e0-11f0-af6a-9ebb24d99120
Password: 2287b31bed4d0eed2de071d1479ac5d5
URL Hosting: https://pay.x1pag.com
```

## 1. 环境配置

### 1.1 添加环境变量

在 `.env.local` 文件中添加以下配置：

```bash
# X1PAG Payment Gateway
X1PAG_MERCHANT_NAME=OddsFlow
X1PAG_MERCHANT_KEY=98bb56a2-f8e0-11f0-af6a-9ebb24d99120
X1PAG_PASSWORD=2287b31bed4d0eed2de071d1479ac5d5
X1PAG_HOST=https://pay.x1pag.com

# Callback URLs (更新为你的实际域名)
X1PAG_CALLBACK_URL=https://yourdomain.com/api/payment/callback
X1PAG_RETURN_URL=https://yourdomain.com/payment/success
X1PAG_CANCEL_URL=https://yourdomain.com/payment/cancel

# 或本地开发
# X1PAG_CALLBACK_URL=https://your-ngrok-url.ngrok.io/api/payment/callback
# X1PAG_RETURN_URL=http://localhost:3000/payment/success
# X1PAG_CANCEL_URL=http://localhost:3000/payment/cancel

# Supabase Service Role Key (用于服务器端操作)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 1.2 获取 Supabase Service Role Key

1. 访问 Supabase Dashboard
2. 进入 Project Settings > API
3. 复制 "service_role" key
4. 添加到 `.env.local`

**⚠️ 警告**: Service Role Key 拥有完整权限，切勿暴露在客户端代码中！

## 2. 数据库设置

### 2.1 运行迁移脚本

在 Supabase SQL Editor 中运行 `create_payment_tables.sql`:

```bash
# 文件路径
/Users/davidyap/Documents/Odds_Flow/create_payment_tables.sql
```

这会创建：
- `payment_transactions` 表 - 存储所有支付交易
- 必要的索引和 RLS 策略
- 更新 `user_subscriptions` 表结构

### 2.2 验证表结构

运行以下查询确认表已正确创建：

```sql
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'payment_transactions'
ORDER BY ordinal_position;
```

## 3. 定价配置

当前定价方案（可在 `src/lib/x1pag.ts` 中修改）：

```typescript
export const PLAN_PRICING = {
  free_trial: {
    amount: 0,
    currency: 'BRL',
    name: 'Free Trial',
    duration: '7 days',
  },
  starter: {
    amount: 29.90,  // R$ 29.90/周
    currency: 'BRL',
    name: 'Starter Plan',
    duration: '1 week',
    billingCycle: 'weekly',
  },
  pro: {
    amount: 89.90,  // R$ 89.90/月
    currency: 'BRL',
    name: 'Pro Plan',
    duration: '1 month',
    billingCycle: 'monthly',
  },
  ultimate: {
    amount: 199.90,  // R$ 199.90/月
    currency: 'BRL',
    name: 'Ultimate Plan',
    duration: '1 month',
    billingCycle: 'monthly',
  },
};
```

### 修改价格

编辑 `src/lib/x1pag.ts` 文件中的 `PLAN_PRICING` 对象。

## 4. 支付流程

### 4.1 用户购买流程

1. **选择套餐** - 用户在 `/pricing` 页面选择套餐
2. **点击订阅** - 重定向到 `/checkout?plan=pro`
3. **确认订单** - 显示订单摘要和价格
4. **支付处理**:
   - Frontend 调用 `/api/payment/create`
   - Backend 创建 X1PAG 支付请求
   - 用户重定向到 X1PAG 支付页面
5. **支付完成**:
   - X1PAG 回调 `/api/payment/callback` (通知结果)
   - 用户重定向到 `/payment/success` 或 `/payment/cancel`

### 4.2 API 端点

**创建支付** - `POST /api/payment/create`
```typescript
// Request
{
  planType: 'pro'  // 'free_trial' | 'starter' | 'pro' | 'ultimate'
}

// Response (成功)
{
  success: true,
  paymentUrl: 'https://pay.x1pag.com/checkout/xxxxx',
  transactionId: 'TXN12345'
}

// Response (失败)
{
  success: false,
  error: 'ERROR_CODE',
  message: 'Error description'
}
```

**支付回调** - `POST /api/payment/callback`
```typescript
// X1PAG 发送的数据
{
  transactionId: string,
  orderReference: string,
  status: 'approved' | 'pending' | 'rejected' | 'cancelled',
  amount: number,
  currency: string,
  paymentMethod: string,
  timestamp: string,
  signature: string  // HMAC-SHA256 签名
}
```

## 5. 回调 URL 配置

### 5.1 本地开发（使用 ngrok）

1. 安装 ngrok:
```bash
npm install -g ngrok
```

2. 启动 Next.js 开发服务器:
```bash
npm run dev
```

3. 在新终端窗口启动 ngrok:
```bash
ngrok http 3000
```

4. 复制 ngrok URL (如 `https://abc123.ngrok.io`)

5. 更新 `.env.local`:
```bash
X1PAG_CALLBACK_URL=https://abc123.ngrok.io/api/payment/callback
X1PAG_RETURN_URL=http://localhost:3000/payment/success
X1PAG_CANCEL_URL=http://localhost:3000/payment/cancel
```

6. **重要**: 将 ngrok callback URL 提供给 X1PAG 团队

### 5.2 生产环境

1. 部署应用到 Vercel/其他平台
2. 配置环境变量（使用你的实际域名）:
```bash
X1PAG_CALLBACK_URL=https://oddsflow.com/api/payment/callback
X1PAG_RETURN_URL=https://oddsflow.com/payment/success
X1PAG_CANCEL_URL=https://oddsflow.com/payment/cancel
```

3. **发送给 X1PAG 团队**:
   - Callback URL: `https://oddsflow.com/api/payment/callback`
   - 服务器 IP 地址（用于白名单）

### 5.3 获取服务器 IP

**Vercel 部署**:
```bash
# Vercel 使用动态 IP，需要提供域名而不是 IP
# 告诉 X1PAG 团队你使用 Vercel，提供域名即可
```

**VPS/专用服务器**:
```bash
curl ifconfig.me
# 或
curl https://api.ipify.org
```

## 6. 测试支付集成

### 6.1 测试免费试用

1. 访问 `/pricing`
2. 点击 "Start Free Trial"
3. 登录（如未登录）
4. 确认免费试用激活

### 6.2 测试付费计划

1. 访问 `/pricing`
2. 选择 Starter/Pro/Ultimate
3. 点击 "Subscribe"
4. 在 checkout 页面确认订单
5. 点击 "Proceed to Payment"
6. **应该重定向到 X1PAG 支付页面**

### 6.3 测试回调（使用 X1PAG 测试环境）

使用 Postman 或 curl 测试回调端点:

```bash
curl -X POST http://localhost:3000/api/payment/callback \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "TEST123",
    "orderReference": "ODDSFLOW-PRO-user-id-12345",
    "status": "approved",
    "amount": 89.90,
    "currency": "BRL",
    "paymentMethod": "PIX",
    "timestamp": "2026-01-28T12:00:00Z",
    "signature": "generated-signature-here"
  }'
```

**注意**: 签名验证会失败，除非使用正确的 HMAC-SHA256 签名。

## 7. 安全性

### 7.1 签名验证

所有来自 X1PAG 的回调都会验证 HMAC-SHA256 签名：

```typescript
// src/lib/x1pag.ts
export function verifyCallbackSignature(data: X1PAGCallbackData): boolean {
  const receivedSignature = data.signature;
  const dataWithoutSignature = { ...data };
  delete (dataWithoutSignature as any).signature;

  const calculatedSignature = generateSignature(dataWithoutSignature);
  return receivedSignature === calculatedSignature;
}
```

### 7.2 Row Level Security (RLS)

数据库使用 RLS 确保用户只能访问自己的数据：

- 用户只能查看自己的交易记录
- 只有 Service Role 可以创建/更新交易（从回调 API）

## 8. 监控和日志

### 8.1 查看支付交易

在 Supabase Dashboard > Table Editor > `payment_transactions`:

```sql
SELECT
  id,
  user_id,
  transaction_id,
  amount,
  currency,
  status,
  plan_type,
  created_at
FROM payment_transactions
ORDER BY created_at DESC
LIMIT 20;
```

### 8.2 查看用户订阅状态

```sql
SELECT
  us.user_id,
  us.package_type,
  us.status,
  us.expiry_date,
  pt.transaction_id,
  pt.amount,
  pt.payment_method
FROM user_subscriptions us
LEFT JOIN payment_transactions pt ON us.payment_transaction_id = pt.transaction_id
ORDER BY us.updated_at DESC
LIMIT 20;
```

### 8.3 查看失败的支付

```sql
SELECT *
FROM payment_transactions
WHERE status IN ('rejected', 'cancelled')
ORDER BY created_at DESC;
```

## 9. 故障排查

### 9.1 支付创建失败

**错误**: "Failed to create payment"

**检查项**:
- ✅ 环境变量是否正确配置
- ✅ X1PAG_MERCHANT_KEY 是否正确
- ✅ X1PAG_PASSWORD 是否正确
- ✅ 网络连接是否正常
- ✅ 检查浏览器控制台错误

### 9.2 回调未接收

**问题**: X1PAG 发送回调，但订阅未激活

**检查项**:
- ✅ Callback URL 是否可访问（使用 ngrok 进行本地测试）
- ✅ Callback URL 是否已提供给 X1PAG
- ✅ 服务器 IP 是否在 X1PAG 白名单中
- ✅ 检查 API 日志（Vercel Logs）
- ✅ 检查 Supabase 日志

### 9.3 签名验证失败

**错误**: "Invalid callback signature"

**原因**:
- X1PAG_PASSWORD 不正确
- 回调数据被修改
- 签名算法实现错误

**解决**:
- 确认 `.env.local` 中的 `X1PAG_PASSWORD` 正确
- 联系 X1PAG 支持验证签名算法

### 9.4 Service Role Key 错误

**错误**: "RLS policy violation" 或 "Insufficient permissions"

**解决**:
- 确认 `SUPABASE_SERVICE_ROLE_KEY` 在 `.env.local` 中
- 在 Vercel 环境变量中也要配置
- 重新部署应用

## 10. 生产部署清单

部署到生产环境前检查：

- [ ] ✅ 已在 Supabase 运行 `create_payment_tables.sql`
- [ ] ✅ 已配置所有环境变量（Vercel/服务器）
- [ ] ✅ 已配置 `SUPABASE_SERVICE_ROLE_KEY`
- [ ] ✅ 已将生产 Callback URL 发送给 X1PAG
- [ ] ✅ 已将服务器 IP/域名发送给 X1PAG 用于白名单
- [ ] ✅ 已测试免费试用流程
- [ ] ✅ 已测试付费订阅流程（测试环境）
- [ ] ✅ 已设置正确的价格（`src/lib/x1pag.ts`）
- [ ] ✅ 已配置 Return URL 和 Cancel URL
- [ ] ✅ 已测试支付成功和取消页面
- [ ] ✅ 已启用数据库备份

## 11. 需要提供给 X1PAG 的信息

**立即发送给 X1PAG 团队**:

```
Subject: OddsFlow - Callback URL 和 IP 白名单配置

Olá,

Para finalizar a integração, seguem as informações solicitadas:

1. URL de Callback:
   - Produção: https://oddsflow.com/api/payment/callback
   - [如果需要] Desenvolvimento: https://your-ngrok-url.ngrok.io/api/payment/callback

2. IP(s) para Whitelist:
   - [如果使用 Vercel] Estamos usando Vercel, que utiliza IPs dinâmicos.
     Favor liberar pelo domínio: oddsflow.com
   - [如果使用 VPS] IP do servidor: YOUR_SERVER_IP_HERE

3. URLs adicionais:
   - Return URL (sucesso): https://oddsflow.com/payment/success
   - Cancel URL (cancelamento): https://oddsflow.com/payment/cancel

Aguardo confirmação da liberação.

Obrigado!
```

## 12. 相关文件

### 核心文件
- `/src/lib/x1pag.ts` - X1PAG 集成库
- `/src/app/api/payment/create/route.ts` - 创建支付 API
- `/src/app/api/payment/callback/route.ts` - 支付回调 API
- `/src/app/[locale]/checkout/page.tsx` - 结账页面
- `/src/app/[locale]/payment/success/page.tsx` - 支付成功页面
- `/src/app/[locale]/payment/cancel/page.tsx` - 支付取消页面

### 配置文件
- `/.env.x1pag.example` - 环境变量模板
- `/create_payment_tables.sql` - 数据库迁移

### 文档
- `/X1PAG_INTEGRATION_GUIDE.md` - 本文档

## 13. 支持和帮助

### X1PAG 文档
- [官方文档](https://docs.x1pag.com/docs/guides/checkout_integration/)

### OddsFlow 支持
- GitHub Issues: [报告问题](https://github.com/davidyap22/football-rader-website/issues)
- 内部文档: 查看代码注释

## 14. 下一步

1. **本地测试**:
   ```bash
   # 安装依赖
   npm install

   # 配置环境变量
   cp .env.x1pag.example .env.local
   # 编辑 .env.local 填入实际值

   # 启动开发服务器
   npm run dev

   # 在另一个终端启动 ngrok
   ngrok http 3000
   ```

2. **数据库设置**:
   - 登录 Supabase Dashboard
   - SQL Editor > 运行 `create_payment_tables.sql`
   - 验证表已创建

3. **测试支付流程**:
   - 访问 http://localhost:3000/pricing
   - 测试免费试用
   - 测试付费计划（会重定向到 X1PAG）

4. **联系 X1PAG**:
   - 发送 Callback URL
   - 发送服务器 IP/域名
   - 等待白名单配置确认

5. **生产部署**:
   - 部署到 Vercel
   - 配置生产环境变量
   - 更新 X1PAG 配置
   - 进行端到端测试

---

**版本**: 1.0
**最后更新**: 2026-01-28
**作者**: OddsFlow Development Team
