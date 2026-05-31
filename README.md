# 🌟 cfworkers-personal-nav-page

一个基于 Cloudflare Pages Functions 与 D1 边缘数据库构建的全栈个人导航页。

拥有极致的加载速度（全球 CDN 边缘渲染）、极简的高端 Glassmorphism（玻璃拟态）暗黑美学，以及带安全密码保护的管理员控制面板，支持在线可视化管理你的网址书签。

---

## ✨ 核心特性

- ⚡ **边缘极速**：全站托管于 Cloudflare 全球边缘网络，秒级秒开。
- 🎨 **精美设计**：现代化暗黑色彩搭配毛玻璃高斯模糊背景，流畅的微交互过渡动画。
- 🔍 **搜索融合**：支持 Google、百度、GitHub 搜索引擎快速一键切换，并支持本地网址关键字实时动态过滤。
- 🔑 **管理面板**：点击右上角“管理面板”即可安全登录。无需编写任何代码，直接在网页端增删改网址分类及书签。
- 💾 **云端存储**：使用 Cloudflare 免费且强大的 D1 关系型数据库存储数据，永久保存，绝不丢失。
- 🚀 **极速搭建**：支持一键 Fork、Git 持续集成，修改代码推送自动同步部署。

---

## 🛠️ 5分钟快速部署指南（零基础友好）

你只需要一个免费的 Cloudflare 账号和一个 GitHub 账号，即可完全免费地拥有你的专属网址导航页。

### 第一步：Fork 本仓库
1. 点击本页面右上角的 **Fork** 按钮，将本仓库克隆到你自己的 GitHub 账号下。

### 第二步：创建 Cloudflare D1 数据库
1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)。
2. 点击左侧导航栏的 **Workers 与 Pages** -> **D1 数据库**。
3. 点击 **创建数据库** -> 选择 **创建(控制台)**，数据库名称填写 `nav-db`，点击创建。
4. 进入刚刚创建的数据库详情页，切换到 **控制台 (Console)** 标签页。
5. 复制以下建表 SQL 语句，粘贴到输入框中并点击 **执行 (Execute)**：

```sql
-- 创建分类表
CREATE TABLE IF NOT EXISTS categories (
  category_id INTEGER PRIMARY KEY AUTOINCREMENT, 
  name TEXT NOT NULL UNIQUE
);

-- 创建链接网址表
CREATE TABLE IF NOT EXISTS links (
  link_id INTEGER PRIMARY KEY AUTOINCREMENT, 
  category_id INTEGER, 
  title TEXT NOT NULL, 
  url TEXT NOT NULL, 
  description TEXT, 
  icon_url TEXT, 
  FOREIGN KEY(category_id) REFERENCES categories(category_id)
);

-- 注入初始示例分类
INSERT INTO categories (name) VALUES ('常用导航');
INSERT INTO categories (name) VALUES ('云计算与开发');

-- 注入初始示例网址链接
INSERT INTO links (category_id, title, url, description, icon_url) VALUES (1, 'Google', 'https://www.google.com', '全球最大搜索引擎', '🔍');
INSERT INTO links (category_id, title, url, description, icon_url) VALUES (1, 'Baidu', 'https://www.baidu.com', '百度一下，你就知道', '🇨🇳');
INSERT INTO links (category_id, title, url, description, icon_url) VALUES (2, 'Cloudflare', 'https://www.cloudflare.com', 'Cloudflare 仪表盘', '🧡');
INSERT INTO links (category_id, title, url, description, icon_url) VALUES (2, 'GitHub', 'https://github.com', 'GitHub 开发者社区', '💻');
```

### 第三步：在 Cloudflare 部署 Pages
1. 返回 Cloudflare 首页，点击左侧 **Workers 与 Pages** -> **概述**。
2. 点击 **创建** 按钮 -> 选择 **Pages** 选项卡 -> 点击 **连接到 Git**。
3. 选择你的 GitHub 账号，并选择你刚才 Fork 的 `cfworkers-personal-nav-page` 仓库，点击 **开始设置**。
4. 在 **构建设置** 中：
   - **框架预设**：选择 `无 (None)`。
   - **构建命令**：留空（不需要填写）。
   - **构建输出目录**：填写 `.`（代表根目录）。
5. 点击 **保存并部署**。首此构建完成后，你将获得一个形如 `*.pages.dev` 的默认访问域名。

### 第四步：绑定数据库和管理员密码
1. 进入你在 Pages 创建的项目详情页，选择 **设置 (Settings)** 选项卡 -> 选择左侧的 **函数 (Functions)** 或 **绑定 (Bindings)**。
2. 滚动找到 **D1 数据库绑定** 栏目，点击 **添加绑定 (Add binding)**：
   - **变量名称 (Variable name)**：必须填写 `DB`（大写）。
   - **D1 数据库**：选择你在第二步中创建的数据库 `nav-db`。
   - 点击保存。
3. 切换到左侧的 **环境变量 (Environment Variables)** 选项卡，在 **生产环境 (Production)** 和 **预览环境 (Preview)** 中分别点击 **添加变量**：
   - **变量名称**：填写 `ADMIN_PASSWORD`。
   - **值**：填写你想用来登录管理后台的自定义密码（例如 `mysecurepwd123`）。
   - 点击保存。

### 第五步：重新构建生效
1. 切换到 **部署 (Deployments)** 选项卡。
2. 找到最新的那次部署，点击右侧的三个点 `...`，选择 **重试部署 (Retry deployment)**（因为我们刚刚绑定了数据库和环境变量，需要重新构建一次使其生效）。
3. 构建成功后，访问你的 Pages 域名。
4. 点击右上角的 **管理面板**，输入你设置的密码，便可在线为你的导航页增加、编辑、删除分类和网址链接了！

---

## 🔒 安全性说明

- 后端的所有管理接口（添加/修改/删除）都强制进行了鉴权校验，验证的请求头 `Authorization` 与你在环境变量中设置的 `ADMIN_PASSWORD` 必须一致，未登录或密码错误的用户无法对你的数据库发起任何修改。
- 强烈建议你在 Pages 设置中配置自定义域名，并开启强制 HTTPS 安全连接，保障管理密码在网络传输中的安全。
