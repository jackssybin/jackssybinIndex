---
title: "第10章:Git分支与协作"
description: "第10章:Git分支与协作 掌握Git分支管理,实现高效团队协作开发 本章目标 理解Git分支的概念和作用 掌握分支的创建、切换和合并 学会使用远程仓库进行协作 熟练处理合并冲突 了解常见的Git工作流模型 10.1 Git分支基础 10.1.1 什么是分支? 分支是Git最强大的功能之一,它允许你从主开发线上分离出来..."
url: /linux/10/10-linux.html
layout: tutorial
contentType: tutorial
series: linux
seriesTitle: Linux教程
weight: 100
tags:
  - Linux
  - Shell
  - Git
  - 教程
draft: false
---

# 第10章:Git分支与协作

> 掌握Git分支管理,实现高效团队协作开发

## 本章目标

- 理解Git分支的概念和作用
- 掌握分支的创建、切换和合并
- 学会使用远程仓库进行协作
- 熟练处理合并冲突
- 了解常见的Git工作流模型

---

## 10.1 Git分支基础

### 10.1.1 什么是分支?

分支是Git最强大的功能之一,它允许你从主开发线上分离出来,独立进行开发而不影响主线。

**形象比喻**
```
main分支 (主干):  ●───●───●───●───●───●
                        ↓
feature分支 (树枝):      ●───●───●
```

**为什么需要分支?**
- 🔧 **独立开发**: 开发新功能时不影响主分支
- 🐛 **Bug修复**: 快速创建修复分支
- 🧪 **实验功能**: 安全地尝试新想法
- 👥 **团队协作**: 多人并行开发不同功能

### 10.1.2 查看分支 (git branch)

```bash
# 查看本地分支
git branch

# 查看所有分支 (包括远程)
git branch -a

# 查看远程分支
git branch -r

# 查看分支详细信息
git branch -v

# 查看已合并到当前分支的分支
git branch --merged

# 查看未合并到当前分支的分支
git branch --no-merged
```

**输出示例**
```bash
$ git branch
  develop
  feature/login
* main          # * 表示当前所在分支
  hotfix/bug-123
```

### 10.1.3 创建分支 (git branch / git checkout -b)

```bash
# 创建新分支 (不切换)
git branch feature/user-profile

# 创建并切换到新分支
git checkout -b feature/user-profile

# 或使用新命令 (Git 2.23+)
git switch -c feature/user-profile

# 基于指定提交创建分支
git branch feature/new-feature a1b2c3d

# 基于远程分支创建本地分支
git checkout -b feature/login origin/feature/login
```

**分支命名规范**
```bash
# ✅ 推荐的命名方式
feature/user-authentication    # 新功能
bugfix/login-timeout          # Bug修复
hotfix/security-patch         # 紧急修复
release/v1.2.0                # 发布版本
develop                       # 开发分支
main / master                 # 主分支

# ❌ 不推荐的命名
test
new-branch
branch1
```

### 10.1.4 切换分支 (git checkout / git switch)

```bash
# 切换到已存在的分支
git checkout develop

# 或使用新命令 (推荐)
git switch develop

# 切换到上一个分支
git checkout -

# 强制切换 (丢弃当前修改)
git checkout -f develop
```

**⚠️ 切换分支前的注意事项**
```bash
# 1. 检查当前状态
git status

# 2. 如果有未提交的修改,有三种选择:

# 选择1: 提交修改
git add .
git commit -m "Save current work"

# 选择2: 暂存修改 (推荐,见第11章)
git stash

# 选择3: 丢弃修改 (危险!)
git checkout -- .
```

### 10.1.5 删除分支

```bash
# 删除已合并的分支
git branch -d feature/completed

# 强制删除未合并的分支
git branch -D feature/abandoned

# 删除远程分支
git push origin --delete feature/old-feature

# 或使用简写
git push origin :feature/old-feature

# 清理本地已删除的远程分支引用
git fetch --prune
# 或
git remote prune origin
```

---

## 10.2 分支合并

### 10.2.1 快进合并 (Fast-Forward)

当目标分支没有新的提交时,Git会执行快进合并。

**场景**: 在feature分支开发完成,main分支没有新提交

```bash
# 切换到目标分支
git checkout main

# 合并feature分支
git merge feature/login
# 输出: Fast-forward (快进合并)

# 查看历史
git log --oneline --graph
```

**合并过程示意**
```
合并前:
main:    ●───●
              ↘
feature:       ●───●───●

合并后:
main:    ●───●───●───●───●
```

### 10.2.2 三方合并 (3-Way Merge)

当两个分支都有新提交时,Git会创建一个新的合并提交。

**场景**: main和feature分支都有新的提交

```bash
# 切换到main分支
git checkout main

# 合并feature分支
git merge feature/user-profile
# Git会打开编辑器让你输入合并提交信息

# 或直接指定合并信息
git merge feature/user-profile -m "Merge feature/user-profile into main"

# 禁止快进合并,强制创建合并提交
git merge --no-ff feature/login
```

**合并过程示意**
```
合并前:
main:    ●───●───●───●
              ↘       ↘
feature:       ●───●───●

合并后:
main:    ●───●───●───●───◆  (◆ 是合并提交)
              ↘       ↗
feature:       ●───●───●
```

### 10.2.3 变基合并 (Rebase)

Rebase会将分支的提交"移动"到目标分支的最新提交之后,创建线性历史。

```bash
# 在feature分支上执行
git checkout feature/login
git rebase main

# 或一步完成
git rebase main feature/login

# 交互式变基 (可以修改、合并、删除提交)
git rebase -i main
```

**Rebase过程示意**
```
Rebase前:
main:    ●───●───●───●
              ↘
feature:       ●───●───●

Rebase后:
main:    ●───●───●───●
                      ↘
feature:               ●'──●'──●'  (●' 是新的提交)
```

**Merge vs Rebase**

| 特性 | Merge | Rebase |
|------|-------|--------|
| 历史记录 | 保留完整历史,有合并提交 | 线性历史,更清晰 |
| 安全性 | 安全,不改变历史 | 会改写历史 |
| 使用场景 | 公共分支合并 | 本地分支整理 |
| 冲突处理 | 一次性处理 | 可能多次处理 |

**⚠️ Rebase黄金法则**
```bash
# ✅ 可以rebase: 本地未推送的提交
git rebase main

# ❌ 不要rebase: 已推送到远程的公共分支
# 这会导致团队成员的历史混乱!
```

---

## 10.3 远程仓库协作

### 10.3.1 添加远程仓库

```bash
# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin https://github.com/username/repo.git

# 添加多个远程仓库
git remote add upstream https://github.com/original/repo.git

# 修改远程仓库URL
git remote set-url origin git@github.com:username/repo.git

# 删除远程仓库
git remote remove origin

# 重命名远程仓库
git remote rename origin upstream
```

### 10.3.2 推送到远程 (git push)

```bash
# 推送当前分支到远程
git push origin main

# 推送并设置上游分支 (首次推送)
git push -u origin main
# 之后只需: git push

# 推送所有分支
git push --all origin

# 推送标签
git push --tags

# 强制推送 (危险!会覆盖远程历史)
git push -f origin main

# 安全的强制推送 (如果远程有新提交会失败)
git push --force-with-lease origin main
```

### 10.3.3 从远程拉取 (git pull / git fetch)

```bash
# 拉取并合并远程分支
git pull origin main

# 拉取并变基
git pull --rebase origin main

# 仅获取远程更新,不合并
git fetch origin

# 获取所有远程分支
git fetch --all

# 获取并清理已删除的远程分支
git fetch --prune
```

**Pull vs Fetch**

```bash
# git pull = git fetch + git merge
git pull origin main
# 等同于:
git fetch origin
git merge origin/main

# 推荐做法: 先fetch查看,再决定是否merge
git fetch origin
git log --oneline main..origin/main  # 查看远程新增的提交
git merge origin/main  # 确认后再合并
```

### 10.3.4 跟踪远程分支

```bash
# 查看跟踪关系
git branch -vv

# 设置当前分支跟踪远程分支
git branch -u origin/main

# 创建并跟踪远程分支
git checkout -b feature/login origin/feature/login

# 或使用简写 (Git会自动创建同名分支)
git checkout feature/login  # 如果本地不存在,会自动跟踪origin/feature/login
```

---

## 10.4 处理合并冲突

### 10.4.1 什么是合并冲突?

当两个分支修改了同一文件的同一部分时,Git无法自动合并,需要手动解决。

**冲突场景示例**
```bash
# main分支修改了README.md的第3行
# feature分支也修改了README.md的第3行
# 合并时会产生冲突
```

### 10.4.2 识别冲突

```bash
# 尝试合并
git merge feature/login

# 输出:
# Auto-merging README.md
# CONFLICT (content): Merge conflict in README.md
# Automatic merge failed; fix conflicts and then commit the result.

# 查看冲突文件
git status

# 输出:
# Unmerged paths:
#   both modified:   README.md
```

### 10.4.3 解决冲突

**冲突文件内容示例**
```
# My Project

<<<<<<< HEAD (当前分支的内容)
这是main分支的修改
=======
这是feature分支的修改
>>>>>>> feature/login (要合并的分支的内容)

## 功能介绍
```

**解决步骤**

```bash
# 1. 打开冲突文件,手动编辑
vim README.md

# 2. 删除冲突标记,保留需要的内容
# 修改后:
# My Project
#
# 这是合并后的最终内容
#
# ## 功能介绍

# 3. 标记冲突已解决
git add README.md

# 4. 查看状态
git status
# 输出: All conflicts fixed but you are still merging.

# 5. 完成合并
git commit -m "Merge feature/login: Resolve conflicts in README.md"

# 或者,如果想放弃合并
git merge --abort
```

### 10.4.4 使用合并工具

```bash
# 配置合并工具 (以vimdiff为例)
git config --global merge.tool vimdiff

# 使用合并工具解决冲突
git mergetool

# 其他常用合并工具
git config --global merge.tool meld      # Meld
git config --global merge.tool kdiff3    # KDiff3
git config --global merge.tool vscode    # VS Code
```

### 10.4.5 预防冲突

```bash
# 1. 经常同步主分支
git checkout feature/login
git merge main  # 或 git rebase main

# 2. 小步提交,频繁推送
git add .
git commit -m "Small incremental change"
git push

# 3. 开发前先拉取最新代码
git pull --rebase origin main

# 4. 团队约定代码区域,减少同时修改同一文件
```

---

## 10.5 常见Git工作流

### 10.5.1 集中式工作流

**适用**: 小团队,简单项目

```bash
# 所有人都在main分支工作
git clone <repo>
# 开发...
git pull origin main
git push origin main
```

### 10.5.2 功能分支工作流

**适用**: 中小型团队

```
main (稳定版本)
  ↓
feature/login ──→ 开发完成后合并回main
feature/payment ──→ 开发完成后合并回main
```

**工作流程**
```bash
# 1. 创建功能分支
git checkout -b feature/user-profile main

# 2. 开发并提交
git add .
git commit -m "Add user profile page"

# 3. 推送到远程
git push -u origin feature/user-profile

# 4. 创建Pull Request (在GitHub/GitLab上)

# 5. 代码审查通过后,合并到main
git checkout main
git merge feature/user-profile
git push origin main

# 6. 删除功能分支
git branch -d feature/user-profile
git push origin --delete feature/user-profile
```

### 10.5.3 Git Flow工作流

**适用**: 大型项目,有明确发布周期

```
main (生产环境)
  ↓
release/v1.2 (发布分支)
  ↓
develop (开发主分支)
  ↓
feature/xxx (功能分支)
hotfix/xxx (紧急修复)
```

**主要分支**
- `main`: 生产环境代码
- `develop`: 开发主分支
- `feature/*`: 功能分支
- `release/*`: 发布分支
- `hotfix/*`: 紧急修复分支

**示例流程**
```bash
# 开发新功能
git checkout -b feature/new-feature develop
# 开发...
git checkout develop
git merge --no-ff feature/new-feature

# 准备发布
git checkout -b release/v1.2.0 develop
# 修复bug,更新版本号...
git checkout main
git merge --no-ff release/v1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"
git checkout develop
git merge --no-ff release/v1.2.0

# 紧急修复
git checkout -b hotfix/critical-bug main
# 修复...
git checkout main
git merge --no-ff hotfix/critical-bug
git tag -a v1.2.1 -m "Hotfix version 1.2.1"
git checkout develop
git merge --no-ff hotfix/critical-bug
```

### 10.5.4 GitHub Flow工作流

**适用**: 持续部署,快速迭代

```
main (始终可部署)
  ↓
feature/xxx ──→ Pull Request ──→ 合并到main ──→ 自动部署
```

**工作流程**
```bash
# 1. 从main创建分支
git checkout -b feature/new-feature main

# 2. 开发并频繁提交
git add .
git commit -m "Add feature X"
git push origin feature/new-feature

# 3. 创建Pull Request

# 4. 讨论和代码审查

# 5. 部署测试 (可选)

# 6. 合并到main
git checkout main
git merge feature/new-feature
git push origin main

# 7. 自动部署到生产环境
```

---

## 10.6 实战场景:团队协作开发流程

### 场景描述
你加入一个团队项目,需要开发一个用户登录功能。

### 完整流程实战

**1. 克隆项目并创建功能分支**
```bash
# 克隆远程仓库
git clone git@github.com:team/project.git
cd project

# 查看远程分支
git branch -a

# 创建并切换到功能分支
git checkout -b feature/user-login main

# 查看当前分支
git branch
# 输出:
#   main
# * feature/user-login
```

**2. 开发功能**
```bash
# 创建登录页面
cat > login.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>用户登录</title>
</head>
<body>
    <form id="loginForm">
        <input type="text" name="username" placeholder="用户名">
        <input type="password" name="password" placeholder="密码">
        <button type="submit">登录</button>
    </form>
    <script src="login.js"></script>
</body>
</html>
EOF

# 创建登录逻辑
cat > login.js << 'EOF'
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = this.username.value;
    const password = this.password.value;
    console.log('登录:', username);
    // TODO: 实现登录逻辑
});
EOF

# 提交第一个版本
git add login.html login.js
git commit -m "Feat: Add login page structure"

# 继续开发,添加验证逻辑
echo "// 添加表单验证" >> login.js
git add login.js
git commit -m "Feat: Add form validation"
```

**3. 推送到远程并保持同步**
```bash
# 首次推送,设置上游分支
git push -u origin feature/user-login

# 查看远程分支
git branch -vv
# 输出:
# * feature/user-login a1b2c3d [origin/feature/user-login] Feat: Add form validation
#   main               b2c3d4e [origin/main] Initial commit

# 同步main分支的最新更改 (重要!)
git fetch origin
git rebase origin/main
# 或
git merge origin/main
```

**4. 处理可能的冲突**
```bash
# 如果rebase时出现冲突
# 输出:
# CONFLICT (content): Merge conflict in login.js
# error: could not apply a1b2c3d... Feat: Add form validation

# 查看冲突文件
git status

# 编辑冲突文件,解决冲突
vim login.js

# 标记冲突已解决
git add login.js

# 继续rebase
git rebase --continue

# 如果想放弃rebase
# git rebase --abort
```

**5. 创建Pull Request**
```bash
# 确保代码是最新的
git push origin feature/user-login

# 在GitHub/GitLab上创建Pull Request
# 1. 访问仓库页面
# 2. 点击 "New Pull Request"
# 3. 选择 feature/user-login -> main
# 4. 填写PR描述:
#    标题: Feat: Add user login feature
#    描述:
#    - 添加登录页面
#    - 实现表单验证
#    - 添加登录逻辑
# 5. 指定审查者
# 6. 创建PR
```

**6. 代码审查和修改**
```bash
# 根据审查意见修改代码
vim login.js

# 提交修改
git add login.js
git commit -m "Fix: Update validation logic based on review"

# 推送更新 (PR会自动更新)
git push origin feature/user-login
```

**7. 合并到主分支**
```bash
# 审查通过后,在GitHub上合并PR
# 或在本地合并:

# 切换到main分支
git checkout main

# 拉取最新代码
git pull origin main

# 合并功能分支
git merge --no-ff feature/user-login -m "Merge feature/user-login"

# 推送到远程
git push origin main

# 删除功能分支
git branch -d feature/user-login
git push origin --delete feature/user-login
```

**8. 更新本地仓库**
```bash
# 切换到main分支
git checkout main

# 拉取最新代码
git pull origin main

# 清理已删除的远程分支引用
git fetch --prune

# 查看本地分支
git branch
```

---

## 10.7 常用命令速查

| 命令 | 说明 | 示例 |
|------|------|------|
| `git branch` | 查看/创建分支 | `git branch feature/login` |
| `git checkout` | 切换分支 | `git checkout develop` |
| `git switch` | 切换分支(新) | `git switch develop` |
| `git merge` | 合并分支 | `git merge feature/login` |
| `git rebase` | 变基 | `git rebase main` |
| `git push` | 推送到远程 | `git push origin main` |
| `git pull` | 拉取并合并 | `git pull origin main` |
| `git fetch` | 获取远程更新 | `git fetch origin` |
| `git remote` | 管理远程仓库 | `git remote -v` |

---

## 10.8 常见问题与解决

### Q1: 如何撤销合并?
```bash
# 如果还没有推送
git reset --hard HEAD~1

# 如果已经推送
git revert -m 1 <merge-commit-hash>
```

### Q2: 如何查看分支差异?
```bash
# 查看两个分支的差异
git diff main..feature/login

# 查看分支的提交差异
git log main..feature/login
```

### Q3: 如何重命名分支?
```bash
# 重命名当前分支
git branch -m new-name

# 重命名其他分支
git branch -m old-name new-name

# 更新远程分支
git push origin :old-name new-name
git push origin -u new-name
```

### Q4: 如何同步fork的仓库?
```bash
# 添加上游仓库
git remote add upstream https://github.com/original/repo.git

# 获取上游更新
git fetch upstream

# 合并到本地main
git checkout main
git merge upstream/main

# 推送到自己的远程仓库
git push origin main
```

### Q5: 如何查看某个文件在哪些分支被修改?
```bash
# 查看包含某个文件修改的分支
git log --all --source -- path/to/file

# 查看哪些分支包含某次提交
git branch --contains <commit-hash>
```

---

## 10.9 本章小结

本章学习了Git分支与协作:

✅ **分支管理**: 创建、切换、删除分支  
✅ **分支合并**: 掌握merge和rebase两种方式  
✅ **远程协作**: 使用push、pull、fetch与团队协作  
✅ **冲突处理**: 识别和解决合并冲突  
✅ **工作流**: 了解常见的Git工作流模型  

### 关键要点
- 分支是Git的核心功能,善用分支可以提高开发效率
- Merge保留完整历史,Rebase创建线性历史
- 经常同步远程分支,减少冲突
- 遵循团队的Git工作流规范

### 下一步学习
- 第11章: Git进阶技巧 - 学习版本回退、暂存、标签等高级操作

---

## 10.10 练习题

1. **基础练习**: 创建一个分支,修改文件,然后合并回main分支
2. **进阶练习**: 模拟冲突场景,练习解决合并冲突
3. **实战练习**: Fork一个GitHub项目,创建功能分支,提交Pull Request
4. **挑战练习**: 使用Git Flow工作流管理一个项目的开发流程

---

**🎉 恭喜!你已经掌握了Git分支与协作!**

继续学习 → [第11章:Git进阶技巧](/linux/11/11-linux.html)
