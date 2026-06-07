---
title: "第9章:Git基础操作"
description: "第9章:Git基础操作 掌握Git版本控制的核心命令,开启高效代码管理之旅 本章目标 理解Git的基本概念和工作原理 掌握Git的安装与配置 学会创建和克隆Git仓库 熟练使用Git的基本工作流程 能够查看和管理提交历史 9.1 Git安装与配置 9.1.1 Git简介 Git是目前世界上最先进的分布式版本控制系统,由..."
url: /linux/09/09-linux.html
layout: tutorial
contentType: tutorial
series: linux
seriesTitle: Linux教程
weight: 90
tags:
  - Linux
  - Shell
  - Git
  - 教程
draft: false
---

# 第9章:Git基础操作

> 掌握Git版本控制的核心命令,开启高效代码管理之旅

## 本章目标

- 理解Git的基本概念和工作原理
- 掌握Git的安装与配置
- 学会创建和克隆Git仓库
- 熟练使用Git的基本工作流程
- 能够查看和管理提交历史

---

## 9.1 Git安装与配置

### 9.1.1 Git简介

Git是目前世界上最先进的分布式版本控制系统,由Linux之父Linus Torvalds于2005年开发。

**为什么需要Git?**
- 📝 **版本管理**: 记录每次代码修改,可随时回退
- 👥 **团队协作**: 多人同时开发,自动合并代码
- 🔄 **分支开发**: 独立开发新功能,互不影响
- 🛡️ **代码备份**: 分布式存储,数据更安全

### 9.1.2 安装Git

**Linux (Ubuntu/Debian)**
```bash
# 更新软件包列表
sudo apt update

# 安装Git
sudo apt install git -y

# 验证安装
git --version
# 输出示例: git version 2.34.1
```

**Linux (CentOS/RHEL)**
```bash
# 安装Git
sudo yum install git -y

# 或使用dnf (较新版本)
sudo dnf install git -y

# 验证安装
git --version
```

**macOS**
```bash
# 使用Homebrew安装
brew install git

# 或使用Xcode命令行工具
xcode-select --install
```

**Windows**
- 下载Git for Windows: https://git-scm.com/download/win
- 运行安装程序,推荐默认选项
- 安装后可使用Git Bash终端

### 9.1.3 Git全局配置

安装完成后,首先需要配置用户信息:

```bash
# 配置用户名 (会显示在提交记录中)
git config --global user.name "Your Name"

# 配置邮箱 (建议使用GitHub/GitLab的邮箱)
git config --global user.email "your.email@example.com"

# 配置默认编辑器 (可选)
git config --global core.editor vim

# 配置默认分支名称为main (推荐)
git config --global init.defaultBranch main

# 启用颜色显示
git config --global color.ui auto

# 查看所有配置
git config --list

# 查看特定配置
git config user.name
```

**配置文件位置**
- 全局配置: `~/.gitconfig`
- 仓库配置: `.git/config` (优先级更高)

---

## 9.2 仓库初始化与克隆

### 9.2.1 创建新仓库 (git init)

**场景**: 你开始一个新项目,需要使用Git管理代码

```bash
# 创建项目目录
mkdir my-project
cd my-project

# 初始化Git仓库
git init
# 输出: Initialized empty Git repository in /path/to/my-project/.git/

# 查看隐藏的.git目录
ls -la
# 会看到 .git/ 目录,这是Git的核心目录
```

**初始化后的目录结构**
```
my-project/
└── .git/          # Git仓库数据目录
    ├── config     # 仓库配置
    ├── HEAD       # 当前分支指针
    ├── objects/   # 对象存储
    └── refs/      # 引用存储
```

### 9.2.2 克隆现有仓库 (git clone)

**场景**: 你需要参与一个已有项目的开发

```bash
# 克隆远程仓库 (HTTPS方式)
git clone https://github.com/username/repository.git

# 克隆到指定目录
git clone https://github.com/username/repository.git my-folder

# 克隆指定分支
git clone -b develop https://github.com/username/repository.git

# 克隆远程仓库 (SSH方式,推荐)
git clone git@github.com:username/repository.git

# 浅克隆 (只克隆最近的提交,节省空间和时间)
git clone --depth 1 https://github.com/username/repository.git
```

**HTTPS vs SSH**
- **HTTPS**: 简单,但每次push需要输入密码
- **SSH**: 需要配置密钥,但更安全且无需重复输入密码

**配置SSH密钥 (推荐)**
```bash
# 生成SSH密钥
ssh-keygen -t rsa -b 4096 -C "your.email@example.com"
# 按Enter使用默认路径 (~/.ssh/id_rsa)
# 可选设置密码短语

# 查看公钥
cat ~/.ssh/id_rsa.pub

# 将公钥添加到GitHub/GitLab
# GitHub: Settings -> SSH and GPG keys -> New SSH key
# 粘贴公钥内容并保存

# 测试连接
ssh -T git@github.com
# 输出: Hi username! You've successfully authenticated...
```

---

## 9.3 Git基本工作流

### 9.3.1 Git工作区域

Git有三个主要工作区域:

```
工作区 (Working Directory)
    ↓  git add
暂存区 (Staging Area / Index)
    ↓  git commit
本地仓库 (Local Repository)
    ↓  git push
远程仓库 (Remote Repository)
```

### 9.3.2 查看状态 (git status)

**场景**: 随时了解当前工作区的状态

```bash
# 查看仓库状态
git status

# 简洁输出
git status -s
```

**输出示例解读**
```bash
On branch main                    # 当前在main分支
Your branch is up to date with 'origin/main'.  # 与远程同步

Changes not staged for commit:   # 已修改但未暂存
  modified:   README.md

Untracked files:                  # 未跟踪的新文件
  new-file.txt

nothing to commit, working tree clean  # 工作区干净
```

### 9.3.3 添加文件到暂存区 (git add)

**场景**: 准备提交代码前,先将修改添加到暂存区

```bash
# 添加单个文件
git add README.md

# 添加多个文件
git add file1.txt file2.txt

# 添加所有修改的文件
git add .

# 添加所有.js文件
git add *.js

# 添加指定目录下的所有文件
git add src/

# 交互式添加 (可选择性添加文件的部分修改)
git add -p
```

**最佳实践**
```bash
# ✅ 推荐: 明确添加需要提交的文件
git add src/main.js src/utils.js

# ⚠️ 谨慎使用: 可能添加不需要的文件
git add .

# 💡 建议: 使用.gitignore忽略不需要的文件
```

### 9.3.4 提交更改 (git commit)

**场景**: 将暂存区的修改保存到本地仓库

```bash
# 提交并添加说明
git commit -m "Add user login feature"

# 多行提交说明
git commit -m "Add user login feature" -m "- Implement login form
- Add authentication logic
- Update user model"

# 添加并提交 (跳过git add,仅对已跟踪文件有效)
git commit -am "Update README"

# 修改最后一次提交 (未push的情况下)
git commit --amend -m "Corrected commit message"

# 空提交 (用于触发CI/CD)
git commit --allow-empty -m "Trigger CI build"
```

**提交信息最佳实践**
```bash
# ✅ 好的提交信息
git commit -m "Fix: Resolve login timeout issue (#123)"
git commit -m "Feat: Add user profile page"
git commit -m "Docs: Update API documentation"

# ❌ 不好的提交信息
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

**常用提交类型前缀**
- `Feat`: 新功能
- `Fix`: 修复Bug
- `Docs`: 文档更新
- `Style`: 代码格式调整
- `Refactor`: 代码重构
- `Test`: 测试相关
- `Chore`: 构建/工具变动

---

## 9.4 查看提交历史

### 9.4.1 基本日志查看 (git log)

```bash
# 查看提交历史
git log

# 单行显示
git log --oneline

# 显示最近3条提交
git log -3

# 显示详细的文件变更
git log --stat

# 显示每次提交的具体修改内容
git log -p

# 图形化显示分支历史
git log --graph --oneline --all

# 美化输出
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
```

**输出示例**
```bash
commit a1b2c3d4e5f6g7h8i9j0 (HEAD -> main, origin/main)
Author: Your Name <your.email@example.com>
Date:   Mon Jan 13 10:30:00 2026 +0800

    Feat: Add user authentication

commit b2c3d4e5f6g7h8i9j0k1
Author: Your Name <your.email@example.com>
Date:   Sun Jan 12 15:20:00 2026 +0800

    Fix: Resolve database connection issue
```

### 9.4.2 筛选日志

```bash
# 查看某个作者的提交
git log --author="Your Name"

# 查看某个时间段的提交
git log --since="2 weeks ago"
git log --after="2026-01-01" --before="2026-01-13"

# 查看包含特定关键字的提交
git log --grep="login"

# 查看某个文件的提交历史
git log README.md

# 查看某个文件的详细修改历史
git log -p README.md
```

### 9.4.3 查看具体提交 (git show)

```bash
# 查看最新提交的详细信息
git show

# 查看指定提交
git show a1b2c3d

# 查看某次提交的某个文件
git show a1b2c3d:src/main.js

# 查看某个标签的提交
git show v1.0.0
```

### 9.4.4 查看文件修改 (git diff)

```bash
# 查看工作区与暂存区的差异
git diff

# 查看暂存区与最新提交的差异
git diff --staged
# 或
git diff --cached

# 查看工作区与最新提交的差异
git diff HEAD

# 比较两个提交
git diff a1b2c3d b2c3d4e

# 查看某个文件的差异
git diff README.md

# 查看统计信息
git diff --stat
```

---

## 9.5 实战场景:创建第一个Git项目

### 场景描述
你要创建一个简单的Web项目,并使用Git进行版本管理。

### 步骤实战

**1. 创建项目并初始化Git**
```bash
# 创建项目目录
mkdir my-web-app
cd my-web-app

# 初始化Git仓库
git init

# 配置项目信息
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

**2. 创建项目文件**
```bash
# 创建HTML文件
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>My Web App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>欢迎使用Git!</h1>
    <script src="app.js"></script>
</body>
</html>
EOF

# 创建CSS文件
cat > style.css << 'EOF'
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

h1 {
    color: #333;
}
EOF

# 创建JavaScript文件
cat > app.js << 'EOF'
console.log('Hello, Git!');
EOF

# 创建README文件
cat > README.md << 'EOF'
# My Web App

这是我的第一个Git项目!

## 功能
- 简单的HTML页面
- CSS样式
- JavaScript交互
EOF
```

**3. 创建.gitignore文件**
```bash
# 创建.gitignore (忽略不需要版本控制的文件)
cat > .gitignore << 'EOF'
# 操作系统文件
.DS_Store
Thumbs.db

# 编辑器文件
.vscode/
.idea/
*.swp

# 依赖目录
node_modules/

# 日志文件
*.log

# 临时文件
tmp/
*.tmp
EOF
```

**4. 查看状态并添加文件**
```bash
# 查看当前状态
git status

# 输出:
# Untracked files:
#   .gitignore
#   README.md
#   app.js
#   index.html
#   style.css

# 添加所有文件到暂存区
git add .

# 再次查看状态
git status

# 输出:
# Changes to be committed:
#   new file:   .gitignore
#   new file:   README.md
#   new file:   app.js
#   new file:   index.html
#   new file:   style.css
```

**5. 提交第一个版本**
```bash
# 提交
git commit -m "Initial commit: Add basic web app structure"

# 查看提交历史
git log --oneline
# 输出: a1b2c3d (HEAD -> main) Initial commit: Add basic web app structure
```

**6. 修改文件并提交**
```bash
# 修改index.html
echo '<p>Git让版本管理变得简单!</p>' >> index.html

# 查看修改
git diff index.html

# 添加并提交
git add index.html
git commit -m "Docs: Add description paragraph"

# 查看历史
git log --oneline
# 输出:
# b2c3d4e (HEAD -> main) Docs: Add description paragraph
# a1b2c3d Initial commit: Add basic web app structure
```

**7. 查看项目历史**
```bash
# 查看详细历史
git log --stat

# 查看图形化历史
git log --graph --oneline --all

# 查看某个文件的历史
git log index.html
```

---

## 9.6 常用命令速查

| 命令 | 说明 | 示例 |
|------|------|------|
| `git init` | 初始化仓库 | `git init` |
| `git clone` | 克隆仓库 | `git clone <url>` |
| `git status` | 查看状态 | `git status` |
| `git add` | 添加到暂存区 | `git add .` |
| `git commit` | 提交更改 | `git commit -m "message"` |
| `git log` | 查看历史 | `git log --oneline` |
| `git diff` | 查看差异 | `git diff` |
| `git show` | 查看提交详情 | `git show <commit>` |

---

## 9.7 常见问题与解决

### Q1: 如何撤销git add?
```bash
# 撤销所有暂存的文件
git reset

# 撤销指定文件
git reset README.md
```

### Q2: 如何修改最后一次提交?
```bash
# 修改提交信息
git commit --amend -m "New message"

# 添加遗漏的文件到上次提交
git add forgotten-file.txt
git commit --amend --no-edit
```

### Q3: 如何查看某次提交修改了什么?
```bash
# 查看指定提交
git show a1b2c3d

# 查看最近一次提交
git show HEAD
```

### Q4: .gitignore不生效怎么办?
```bash
# 清除Git缓存
git rm -r --cached .
git add .
git commit -m "Fix: Update .gitignore"
```

### Q5: 如何设置Git命令别名?
```bash
# 设置常用别名
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.lg "log --graph --oneline --all"

# 使用别名
git st  # 等同于 git status
git lg  # 等同于 git log --graph --oneline --all
```

---

## 9.8 本章小结

本章学习了Git的基础操作:

✅ **安装配置**: 安装Git并配置用户信息  
✅ **仓库管理**: 使用`git init`和`git clone`创建仓库  
✅ **基本工作流**: 掌握`add → commit`的工作流程  
✅ **历史查看**: 使用`git log`和`git diff`查看历史和差异  
✅ **实战练习**: 创建并管理第一个Git项目  

### 下一步学习
- 第10章: Git分支与协作 - 学习分支管理和团队协作
- 第11章: Git进阶技巧 - 掌握版本回退、暂存等高级操作

---

## 9.9 练习题

1. **基础练习**: 创建一个新项目,初始化Git仓库,创建3个文件并提交
2. **进阶练习**: 修改文件,使用`git diff`查看差异,然后提交修改
3. **实战练习**: 克隆一个GitHub开源项目,查看其提交历史
4. **挑战练习**: 配置SSH密钥,使用SSH方式克隆仓库

---

**🎉 恭喜!你已经掌握了Git的基础操作!**

继续学习 → [第10章:Git分支与协作](/linux/10/10-linux.html)
