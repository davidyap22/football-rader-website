# 新闻页面 SEO 设置指南

## 功能概览

新闻模块现已支持完整的动态 SEO 和结构化数据（Schema Markup）功能：
- ✅ **新闻列表页**（`/news`）- 完整的 SEO 和 Schema markup
- ✅ **新闻详情页**（`/news/[slug]/[date]/[id]`）- 动态 SEO 和文章 Schema

## 已实现的 SEO 功能

## 一、新闻列表页 (`/news`)

### 1. 动态 Meta Tags（无需数据库配置）
- ✅ `<title>` - 多语言支持的页面标题
  - 英文: "Football News & Betting Insights | OddsFlow AI Analysis"
  - 中文: "足球新闻与博彩分析 | OddsFlow AI"
  - 其他 10 种语言
- ✅ `<meta name="description">` - 多语言页面描述
- ✅ `<meta name="keywords">` - 精心策划的关键词列表
- ✅ Open Graph tags - Facebook/LinkedIn 分享优化
- ✅ Twitter Card tags - Twitter 分享优化

### 2. Schema Markup（自动生成）
- ✅ **CollectionPage Schema** - 集合页面结构
- ✅ **ItemList Schema** - 新闻文章列表（前 10 篇）
- ✅ **BreadcrumbList Schema** - 面包屑导航
- ✅ **Organization Schema** - OddsFlow 组织信息
- ✅ **WebSite Schema** - 网站信息 + 搜索功能
- ✅ **多语言支持** - 根据 URL locale 自动切换

### 3. 列表页 Keywords 示例

**英文版本：**
```
football news, soccer news, betting analysis, AI predictions, Premier League,
La Liga, Serie A, Bundesliga, match previews, betting tips, odds analysis,
football insights, ROI optimization, handicap betting, over under tips
```

**中文版本：**
```
足球新闻, 博彩分析, AI预测, 英超, 西甲, 意甲, 德甲, 投注技巧,
赔率分析, 让球盘, 大小球
```

## 二、新闻详情页 (`/news/[slug]/[date]/[id]`)

### 1. 动态 Meta Tags（从数据库读取）
- ✅ `<title>` - 文章标题 + "| OddsFlow"
- ✅ `<meta name="description">` - 文章摘要
- ✅ `<meta name="keywords">` - 从数据库 `seo` 字段读取
- ✅ Open Graph tags（Facebook 分享优化）
- ✅ Twitter Card tags（Twitter 分享优化）

### 2. Schema Markup (JSON-LD)
- ✅ NewsArticle Schema - 新闻文章结构化数据
- ✅ Organization Schema - OddsFlow 组织信息
- ✅ WebSite Schema - 网站信息
- ✅ SportsEvent Schema - 比赛事件（如果有比赛信息）
- ✅ GeoCoordinates - 地理位置（通过比赛场馆）
- ✅ 多语言支持（inLanguage）

## 数据库 `seo` 字段设置

`football_news` 表的 `seo` 列是 JSONB 类型，支持多语言和灵活的 SEO 配置。

### 方法 1: 全局 keywords（所有语言通用）

```sql
UPDATE football_news
SET seo = jsonb_build_object(
  'keywords', 'football, odds, Premier League, Chelsea, Crystal Palace, AI predictions, betting analysis'
)
WHERE id = 'your-article-id';
```

### 方法 2: 多语言 keywords（推荐）

```sql
UPDATE football_news
SET seo = jsonb_build_object(
  'en', jsonb_build_object(
    'keywords', 'football, odds, Premier League, Chelsea, Crystal Palace, AI predictions, betting analysis, ROI'
  ),
  'zh_cn', jsonb_build_object(
    'keywords', '足球, 赔率, 英超, 切尔西, 水晶宫, AI预测, 博彩分析, 投资回报率'
  ),
  'zh_tw', jsonb_build_object(
    'keywords', '足球, 賠率, 英超, 切爾西, 水晶宮, AI預測, 博彩分析, 投資回報率'
  ),
  'es', jsonb_build_object(
    'keywords', 'fútbol, cuotas, Premier League, Chelsea, Crystal Palace, predicciones IA, análisis apuestas'
  ),
  'ja', jsonb_build_object(
    'keywords', 'サッカー, オッズ, プレミアリーグ, チェルシー, AI予測, ベッティング分析'
  )
)
WHERE id = 'your-article-id';
```

### 方法 3: 批量更新（为所有 Serie A 新闻添加关键词）

```sql
UPDATE football_news
SET seo = jsonb_build_object(
  'keywords', 'Serie A, Italian football, calcio, odds analysis, AI predictions, betting tips'
)
WHERE league = 'Serie A' AND seo IS NULL;
```

### 方法 4: 添加额外的 SEO 元数据

```sql
UPDATE football_news
SET seo = jsonb_build_object(
  'keywords', 'football, Premier League, Manchester United, AI analysis',
  'meta_description', 'Exclusive AI-powered analysis of Manchester United match',
  'canonical_url', 'https://oddsflow.com/news/...',
  'robots', 'index, follow'
)
WHERE id = 'your-article-id';
```

## 示例：完整的 SEO 配置

```sql
UPDATE football_news
SET seo = '{
  "keywords": "Premier League, football odds, AI predictions, betting analysis, ROI optimization",
  "en": {
    "keywords": "Premier League, Chelsea FC, football betting, odds analysis, AI predictions, ROI, investment returns",
    "meta_title": "Chelsea 3-1 Crystal Palace: AI Analysis & Betting Insights"
  },
  "zh_cn": {
    "keywords": "英超联赛, 切尔西, 足球博彩, 赔率分析, AI预测, 投资回报率, ROI",
    "meta_title": "切尔西3-1水晶宫：AI分析与博彩洞察"
  },
  "zh_tw": {
    "keywords": "英超聯賽, 切爾西, 足球博彩, 賠率分析, AI預測, 投資回報率, ROI",
    "meta_title": "切爾西3-1水晶宮：AI分析與博彩洞察"
  }
}'::jsonb
WHERE id = 'e8e7d6cf-7f2f-4413-a228-1b59ac550301';
```

## 代码实现说明

### 自动提取 keywords

代码会自动从 `seo` 字段提取关键词：

1. 优先查找语言特定的 keywords：`seo[locale].keywords`
2. 如果没有，使用全局 keywords：`seo.keywords`

```typescript
// 代码自动处理
const seoData = article.seo as Record<string, any>;
const keywords = seoData.keywords || seoData[locale]?.keywords || '';
```

### Schema Markup 自动生成

每个新闻页面会自动生成以下结构化数据：

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "NewsArticle",
      "headline": "文章标题",
      "description": "文章摘要",
      "image": "图片URL",
      "datePublished": "2026-01-28",
      "author": {
        "@type": "Organization",
        "name": "OddsFlow Analysis Team"
      },
      "about": {
        "@type": "SportsEvent",
        "name": "Chelsea vs Crystal Palace",
        "homeTeam": {...},
        "awayTeam": {...}
      }
    },
    {
      "@type": "Organization",
      "name": "OddsFlow",
      "logo": "..."
    },
    {
      "@type": "WebSite",
      "name": "OddsFlow"
    }
  ]
}
```

## SEO 最佳实践

### Keywords 建议

每篇文章建议包含 5-15 个关键词，包括：

1. **联赛名称**: Premier League, Serie A, La Liga
2. **球队名称**: Chelsea, Manchester United, Barcelona
3. **分析类型**: odds analysis, AI predictions, betting tips
4. **指标**: ROI, win rate, profitability
5. **语言特定词汇**:
   - 英文: football, soccer, betting
   - 中文: 足球, 赔率, 投注, 分析
   - 日文: サッカー, ベッティング, 分析

### 示例关键词组合

**英超比赛分析：**
```
Premier League, Chelsea FC, Crystal Palace, football odds, betting analysis,
AI predictions, handicap betting, over/under, match preview, ROI optimization
```

**意甲比赛分析（多语言）：**
```json
{
  "en": "Serie A, Juventus, Napoli, Italian football, calcio, odds analysis, AI predictions, betting strategy",
  "zh_cn": "意甲, 尤文图斯, 那不勒斯, 意大利足球, 赔率分析, AI预测, 投注策略",
  "es": "Serie A, Juventus, Napoli, fútbol italiano, análisis de cuotas, predicciones IA"
}
```

## 验证 SEO 设置

### 1. 检查 Meta Tags

在浏览器中访问新闻页面，查看源代码（右键 > 查看页面源代码），确认以下标签存在：

```html
<title>文章标题 | OddsFlow</title>
<meta name="description" content="...">
<meta name="keywords" content="...">
<meta property="og:title" content="...">
<meta property="og:image" content="...">
<meta name="twitter:card" content="summary_large_image">
```

### 2. 检查 Schema Markup

查看页面源代码中的 JSON-LD script：

```html
<script type="application/ld+json" id="news-schema">
{
  "@context": "https://schema.org",
  "@graph": [...]
}
</script>
```

### 3. 使用 Google 工具验证

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## 常见问题

### Q: 如果 `seo` 字段为 NULL 会怎样？
A: 不会报错，keywords meta tag 不会被添加，但其他 SEO 功能正常工作。

### Q: 可以为不同语言设置不同的 keywords 吗？
A: 可以！使用多语言格式，代码会根据当前语言自动选择对应的 keywords。

### Q: Schema markup 对 SEO 有什么帮助？
A: Schema markup 帮助搜索引擎更好地理解内容，可能在搜索结果中显示富媒体片段（rich snippets），提高点击率。

### Q: 如何批量为所有新闻添加基础 SEO？
A: 使用 SQL 批量更新：

```sql
-- 为所有没有 SEO 的新闻添加基础配置
UPDATE football_news
SET seo = jsonb_build_object(
  'keywords', CONCAT(league, ', football analysis, AI predictions, betting odds, ',
                      COALESCE(league, 'football'), ' tips')
)
WHERE seo IS NULL OR seo::text = '{}'::text;
```

## 新闻列表页 Schema Markup 示例

### CollectionPage + ItemList Schema

新闻列表页会自动生成包含前 10 篇文章的结构化数据：

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://oddsflow.com/news",
      "name": "Football News & Betting Insights | OddsFlow",
      "description": "Stay updated with latest football news...",
      "inLanguage": "en"
    },
    {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "NewsArticle",
            "headline": "Chelsea 3-1 Crystal Palace Analysis",
            "image": "...",
            "datePublished": "2026-01-28"
          }
        },
        // ... 更多文章
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@id": "https://oddsflow.com",
            "name": "Home"
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": {
            "@id": "https://oddsflow.com/news",
            "name": "News"
          }
        }
      ]
    }
  ]
}
```

## 验证新闻列表页 SEO

### 1. 访问新闻首页
```
http://localhost:3000/news        (英文)
http://localhost:3000/zh/news     (中文简体)
http://localhost:3000/tw/news     (中文繁体)
```

### 2. 检查多语言 Meta Tags

在浏览器中查看源代码，确认以下标签根据语言正确显示：

**英文页面应显示：**
```html
<title>Football News & Betting Insights | OddsFlow AI Analysis</title>
<meta name="description" content="Stay updated with the latest football news, AI-powered betting insights...">
<meta name="keywords" content="football news, soccer news, betting analysis, AI predictions, Premier League...">
```

**中文页面应显示：**
```html
<title>足球新闻与博彩分析 | OddsFlow AI</title>
<meta name="description" content="获取最新足球新闻、AI驱动的博彩分析和预测...">
<meta name="keywords" content="足球新闻, 博彩分析, AI预测, 英超, 西甲, 意甲...">
```

### 3. 使用 Google 工具验证

新闻列表页特别适合用以下工具验证：

- **[Google Rich Results Test](https://search.google.com/test/rich-results)** - 验证 ItemList 和 BreadcrumbList
- **[Schema Markup Validator](https://validator.schema.org/)** - 全面验证 Schema
- **Google Search Console** - 监控实际搜索表现

## SEO 优势对比

### 新闻列表页 vs 详情页

| 功能 | 列表页 | 详情页 |
|------|--------|--------|
| **Meta Tags** | ✅ 预定义多语言 | ✅ 从数据库动态生成 |
| **Keywords** | ✅ 通用关键词 | ✅ 文章特定关键词 |
| **Schema Markup** | CollectionPage + ItemList | NewsArticle + SportsEvent |
| **SEO 配置** | ❌ 无需配置 | ✅ 需要配置 `seo` 字段 |
| **面包屑** | ✅ 自动生成 | ✅ 可扩展 |
| **社交分享** | ✅ Open Graph | ✅ Open Graph + 文章图片 |

## 相关文件

- `/src/app/[locale]/news/page.tsx` - 新闻列表页 SEO 实现
- `/src/app/[locale]/news/[slug]/[date]/[id]/page.tsx` - 新闻详情页 SEO 实现
- `/src/lib/supabase.ts` - 数据库接口定义

## 总结

### 新闻列表页（自动化）
- ✅ 无需任何数据库配置
- ✅ 多语言 SEO 自动生成
- ✅ ItemList Schema 自动包含前 10 篇文章
- ✅ 适合搜索引擎索引和发现

### 新闻详情页（需配置）
- ✅ 需要在数据库配置 `seo` 字段
- ✅ 支持文章特定的 keywords
- ✅ NewsArticle + SportsEvent Schema
- ✅ 最大化单篇文章的 SEO 效果
