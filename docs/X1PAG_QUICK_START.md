# X1PAG 支付集成 - 快速启动

## 🚀 立即开始（5分钟设置）

### 1. 配置环境变量
复制 `.env.x1pag.example` 到 `.env.local` 并填入真实值：
```bash
cp .env.x1pag.example .env.local
```

### 2. 创建数据库表
在 Supabase SQL Editor 运行：
```sql
-- 复制并运行 create_payment_tables.sql 的内容
```

### 3. 本地测试
```bash
# 启动开发服务器
npm run dev

# 在新终端启动 ngrok（用于测试回调）
ngrok http 3000
```

### 4. 提供给 X1PAG 团队

发送邮件包含：
- **Callback URL**: `https://your-ngrok-url.ngrok.io/api/payment/callback`
- **Server IP**: 告知使用 ngrok 进行开发测试

## 📋 测试清单

- [ ] 访问 `/pricing` 页面
- [ ] 点击 "Start Free Trial" 测试免费试用
- [ ] 点击 "Subscribe" (Pro plan) 测试付费流程
- [ ] 确认重定向到 X1PAG 支付页面
- [ ] 测试支付成功页面 `/payment/success`
- [ ] 测试支付取消页面 `/payment/cancel`

## 🔑 关键端点

| 端点 | 功能 | 方法 |
|------|------|------|
| `/api/payment/create` | 创建支付 | POST |
| `/api/payment/callback` | 支付回调 | POST |
| `/checkout?plan=pro` | 结账页面 | GET |
| `/payment/success` | 支付成功 | GET |
| `/payment/cancel` | 支付取消 | GET |

## 📦 集成文件

| 文件 | 说明 |
|------|------|
| `/src/lib/x1pag.ts` | 核心支付库 |
| `/src/app/api/payment/create/route.ts` | 创建支付 API |
| `/src/app/api/payment/callback/route.ts` | 回调处理 API |
| `/src/app/[locale]/checkout/page.tsx` | 结账页面 |
| `/create_payment_tables.sql` | 数据库迁移 |
| `/X1PAG_INTEGRATION_GUIDE.md` | 完整文档 |

## 💰 定价方案（可修改）

| 方案 | 价格 | 周期 |
|------|------|------|
| Free Trial | R$ 0 | 7 天 |
| Starter | R$ 29.90 | 每周 |
| Pro | R$ 89.90 | 每月 |
| Ultimate | R$ 199.90 | 每月 |

**修改价格**: 编辑 `src/lib/x1pag.ts` 中的 `PLAN_PRICING`

## 🔒 安全要点

✅ Service Role Key 仅用于服务器端
✅ 所有回调验证 HMAC-SHA256 签名
✅ RLS 策略保护用户数据
✅ 环境变量不提交到 Git

## 🐛 常见问题

**Q: 支付创建失败？**
A: 检查环境变量是否配置正确

**Q: 回调未收到？**
A: 确保 Callback URL 可访问（使用 ngrok）并已提供给 X1PAG

**Q: 签名验证失败？**
A: 确认 `X1PAG_PASSWORD` 正确

## 📞 获取帮助

- 📖 完整文档: `/X1PAG_INTEGRATION_GUIDE.md`
- 🌐 X1PAG 文档: https://docs.x1pag.com
- 🐛 报告问题: GitHub Issues

---
**准备好了吗？** 发送 Callback URL 和 IP 给 X1PAG 团队开始接受真实支付！
