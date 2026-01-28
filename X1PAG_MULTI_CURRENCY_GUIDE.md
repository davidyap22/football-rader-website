# X1PAG 多币种支付指南

## 概览

X1PAG 支付网关现已集成**美元（USD）和巴西雷亚尔（BRL）**双币种支付。用户可以在结账时选择他们偏好的货币。

## 支持的货币

### 1. 巴西雷亚尔（BRL - R$）🇧🇷
- **Starter Plan**: R$ 29,90/周
- **Pro Plan**: R$ 89,90/月
- **Ultimate Plan**: R$ 199,90/月

### 2. 美元（USD - $）🇺🇸
- **Starter Plan**: $5.99/周
- **Pro Plan**: $17.99/月
- **Ultimate Plan**: $39.99/月

## 技术实现

### 文件结构

```
src/lib/
├── x1pag-client.ts          # 客户端安全的多币种配置
└── x1pag.ts                 # 服务器端支付处理

src/app/
└── [locale]/checkout/
    └── page.tsx             # 带货币选择器的结账页面
```

### 核心功能

#### 1. 多币种定价配置

```typescript
// src/lib/x1pag-client.ts
export const PLAN_PRICING_MULTI_CURRENCY = {
  BRL: {
    starter: { amount: 29.90, currency: 'BRL', ... },
    pro: { amount: 89.90, currency: 'BRL', ... },
    // ...
  },
  USD: {
    starter: { amount: 5.99, currency: 'USD', ... },
    pro: { amount: 17.99, currency: 'USD', ... },
    // ...
  },
};
```

#### 2. 货币信息

```typescript
export const CURRENCY_INFO = {
  BRL: {
    symbol: 'R$',
    locale: 'pt-BR',
    name: 'Brazilian Real',
    flag: '🇧🇷',
  },
  USD: {
    symbol: '$',
    locale: 'en-US',
    name: 'US Dollar',
    flag: '🇺🇸',
  },
};
```

#### 3. 辅助函数

```typescript
// 格式化货币显示
formatCurrency(89.90, 'BRL')  // "R$ 89,90"
formatCurrency(17.99, 'USD')  // "$17.99"

// 获取计划详情（带货币）
getPlanDetails('pro', 'USD')  // { amount: 17.99, currency: 'USD', ... }

// 检测用户偏好货币
detectPreferredCurrency()     // 'BRL' 或 'USD'（基于浏览器语言）

// 货币转换（仅供参考）
convertCurrency(100, 'BRL', 'USD')  // 20.00
```

## 用户体验流程

### 1. 货币选择

结账页面顶部显示货币选择器：

```
┌─────────────────────────────────────────┐
│  Select Currency                        │
│  [ 🇺🇸 USD ($) ] [ 🇧🇷 BRL (R$) ]     │
└─────────────────────────────────────────┘
```

### 2. 自动检测

系统会根据用户浏览器语言自动选择货币：
- 葡萄牙语/巴西 → BRL
- 其他语言 → USD（默认）

### 3. 实时更新

切换货币后，订单摘要中的价格会立即更新。

## API 集成

### 创建支付请求

```typescript
// POST /api/payment/create
{
  "planType": "pro",
  "currency": "USD",     // ← 新增：指定货币
  "userId": "...",
  "userEmail": "...",
  "userName": "..."
}
```

### X1PAG 请求格式

```json
{
  "merchantKey": "...",
  "merchantName": "OddsFlow",
  "amount": 17.99,
  "currency": "USD",      // ← X1PAG 支持 USD
  "orderReference": "ODDSFLOW-PRO-...",
  "customerName": "...",
  "customerEmail": "...",
  "description": "Pro Plan - 1 month",
  "signature": "..."
}
```

### 回调数据

X1PAG 回调包含货币和汇率信息：

```json
{
  "transactionId": "TXN123",
  "amount": 17.99,
  "currency": "USD",
  "status": "approved",
  "exchange_rate": 5.0,           // 如果有货币转换
  "exchange_currency": "BRL",     // 原始货币
  "exchange_amount": 89.95,       // 原始金额
  "signature": "..."
}
```

## 定价策略

### 当前汇率设置

- **1 USD = 5.00 BRL**（约）
- 定价略有调整以适应市场：
  - Starter: $5.99 vs R$ 29.90（实际汇率约 1:5.0）
  - Pro: $17.99 vs R$ 89.90（实际汇率约 1:5.0）
  - Ultimate: $39.99 vs R$ 199.90（实际汇率约 1:5.0）

### 修改价格

编辑 `src/lib/x1pag-client.ts` 中的 `PLAN_PRICING_MULTI_CURRENCY`：

```typescript
USD: {
  pro: {
    amount: 19.99,  // 修改这里
    currency: 'USD',
    name: 'Pro Plan',
    duration: '1 month',
    billingCycle: 'monthly',
  },
}
```

## 数据库考虑

### 存储货币信息

确保 `payment_transactions` 表包含货币字段（已包含）：

```sql
CREATE TABLE payment_transactions (
  ...
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'BRL',  -- 支持 BRL/USD
  ...
);
```

### 查询示例

```sql
-- 查看不同货币的交易
SELECT
  currency,
  COUNT(*) as transaction_count,
  SUM(amount) as total_amount
FROM payment_transactions
WHERE status = 'approved'
GROUP BY currency;
```

## 测试场景

### 测试清单

- [ ] 在结账页面切换 USD ↔ BRL
- [ ] 验证价格正确更新
- [ ] 测试 USD 支付流程（到 X1PAG）
- [ ] 测试 BRL 支付流程（到 X1PAG）
- [ ] 验证回调包含正确的货币
- [ ] 检查数据库存储正确的货币
- [ ] 测试不同浏览器语言的货币检测

### 测试命令

```bash
# 本地测试
npm run dev

# 访问结账页面
http://localhost:3000/checkout?plan=pro

# 构建测试
npm run build
```

## 常见问题

### Q: X1PAG 如何处理货币转换？
A: X1PAG 自动处理货币转换，回调中会包含 `exchange_rate`、`exchange_currency` 和 `exchange_amount` 字段。

### Q: 用户可以看到两种货币的价格吗？
A: 目前用户一次只能选择一种货币。可以添加货币比较功能显示两种价格。

### Q: 如何添加更多货币（如 EUR）？
A:
1. 在 `x1pag-client.ts` 中添加 `EUR` 到 `PLAN_PRICING_MULTI_CURRENCY`
2. 添加 `EUR` 信息到 `CURRENCY_INFO`
3. 更新 `SupportedCurrency` 类型
4. 在结账页面添加 EUR 按钮

### Q: 汇率是固定的还是动态的？
A: 代码中的汇率是参考值。X1PAG 在实际支付时使用实时汇率。

## X1PAG 文档参考

- **货币支持**: ISO 4217 标准（USD, BRL, EUR 等）
- **金额格式**: 2 位小数货币使用 "XX.XX" 格式
- **汇率信息**: 回调中自动包含
- **支付方式**: 根据货币和地区自动路由

## 下一步优化

### 建议功能

1. **货币比较显示**
   ```
   Pro Plan
   $17.99 USD    (约 R$ 89.90)
   ```

2. **智能货币推荐**
   - 基于 IP 地理位置
   - 使用 GeoIP 服务

3. **实时汇率显示**
   - 集成汇率 API
   - 显示"价格可能因汇率变化"提示

4. **货币偏好保存**
   - 保存到用户配置
   - 记住上次选择

5. **价格历史**
   - 追踪不同货币的价格变化
   - 显示折扣信息

## 联系 X1PAG

如需更多货币支持或有问题：
- 📧 联系 X1PAG 技术支持
- 📖 查看官方文档: https://docs.x1pag.com

---

**版本**: 2.0 - 多币种支持
**最后更新**: 2026-01-28
**作者**: OddsFlow Development Team
