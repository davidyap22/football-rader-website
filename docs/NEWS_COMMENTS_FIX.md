# 新闻评论功能修复指南

## 问题描述

在将 `football_news` 表的 `id` 列从 `integer` 改为 `uuid` 后，评论功能出现了问题。错误信息：
```
Error fetching comments: {}
```

## 根本原因

`news_comments` 表中的 `news_id` 列仍然是 `integer` 或 `bigint` 类型，而新的 `football_news.id` 是 `uuid` (string) 类型。类型不匹配导致查询失败。

## 解决方案

### 选项 1: 更新数据库表结构（推荐）

在 Supabase SQL Editor 中运行以下 SQL：

```sql
-- 将 news_id 列改为 TEXT 类型以支持 UUID
ALTER TABLE news_comments
ALTER COLUMN news_id TYPE TEXT USING news_id::TEXT;

-- 验证更改
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'news_comments' AND column_name = 'news_id';
```

### 选项 2: 创建新表（如果需要保留旧数据）

```sql
-- 备份旧表
CREATE TABLE news_comments_old AS SELECT * FROM news_comments;

-- 删除旧表
DROP TABLE news_comments;

-- 创建新表
CREATE TABLE news_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id TEXT NOT NULL,  -- 改为 TEXT 以支持 UUID
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES news_comments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_name TEXT,
  user_email TEXT,
  user_avatar TEXT
);

-- 创建索引
CREATE INDEX idx_news_comments_news_id ON news_comments(news_id);
CREATE INDEX idx_news_comments_user_id ON news_comments(user_id);
CREATE INDEX idx_news_comments_parent_id ON news_comments(parent_id);

-- 启用 RLS
ALTER TABLE news_comments ENABLE ROW LEVEL SECURITY;

-- 创建策略
CREATE POLICY "Anyone can read comments"
ON news_comments FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create comments"
ON news_comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
ON news_comments FOR DELETE
USING (auth.uid() = user_id);
```

## 验证修复

1. 在 Supabase SQL Editor 中检查表结构：
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'news_comments' AND column_name = 'news_id';
```

应该看到 `data_type` 是 `text` 或 `character varying`。

2. 测试评论功能：
   - 访问任何新闻文章的评论页面
   - 确认能看到现有评论
   - 尝试发表新评论
   - 检查浏览器控制台没有错误

## 代码更改

代码已经更新以支持两种类型：

### TypeScript 接口
```typescript
export interface NewsComment {
  news_id: string | number; // 支持 UUID (string) 和旧的 number IDs
  // ... 其他字段
}
```

### 辅助函数
```typescript
export const getNewsComments = async (newsId: string | number, userId?: string)
export const addNewsComment = async (newsId: string | number, ...)
export const getNewsCommentCount = async (newsId: string | number)
```

## 相关文件

- `/Users/davidyap/Documents/Odds_Flow/update_news_comments_table.sql` - SQL 更新脚本
- `/Users/davidyap/Documents/Odds_Flow/src/lib/supabase.ts` - 更新的接口和函数
- `/Users/davidyap/Documents/Odds_Flow/src/app/[locale]/news/[slug]/[date]/[id]/comments/page.tsx` - 评论页面

## 注意事项

- 如果有现有的评论数据使用旧的 integer `news_id`，需要迁移这些数据
- 更改表结构前建议先备份数据
- 确保所有相关的外键约束也相应更新
