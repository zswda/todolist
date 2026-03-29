# GitHub Pages 部署指南

## 步骤 1：在 GitHub 上创建新仓库
1. 登录您的 GitHub 账号
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库名称（例如：todo-list）
4. 选择 "Public" 可见性
5. 不要勾选 "Initialize this repository with a README"
6. 点击 "Create repository"

## 步骤 2：将本地仓库推送到 GitHub
1. 复制 GitHub 仓库的 HTTPS URL（类似：https://github.com/your-username/todo-list.git）
2. 在终端中运行以下命令（替换为您的 GitHub 仓库 URL）：
   ```bash
   git remote add origin https://github.com/your-username/todo-list.git
   git branch -M main
   git push -u origin main
   ```

## 步骤 3：启用 GitHub Pages
1. 进入 GitHub 仓库页面
2. 点击 "Settings" 选项卡
3. 侧边栏中选择 "Pages"
4. 在 "Source" 部分，选择 "main" 分支，然后选择 "/ (root)"
5. 点击 "Save"
6. 等待几分钟，GitHub 会为您生成一个公共 URL

## 步骤 4：访问您的应用
- 部署完成后，您可以通过类似 `https://your-username.github.io/todo-list/` 的 URL 访问您的 Todo List 应用
- 您现在可以随时随地从任何设备访问它！

## 注意事项
- 数据存储在用户的浏览器本地存储中，不同设备间数据不会同步
- 每次修改代码后，只需运行 `git push` 即可更新部署
- 如果需要跨设备同步功能，您需要添加后端数据库支持