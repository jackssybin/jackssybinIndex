---
title: "第11章:Git进阶技巧"
description: "第11章:Git进阶技巧 掌握Git高级操作,成为版本控制专家 本章目标 掌握版本回退和撤销操作 学会使用stash暂存工作进度 理解并使用Git标签管理版本 掌握cherry pick精准提取提交 学会使用reflog恢复丢失的提交 了解Git子模块和子树 11.1 版本回退与撤销 11.1.1 工作区、暂存区、仓库..."
url: /linux/11/11-linux.html
layout: tutorial
contentType: tutorial
series: linux
seriesTitle: Linux教程
weight: 110
tags:
  - Linux
  - Shell
  - Git
  - 教程
draft: false
---

# 第11章:Git进阶技巧

> 掌握Git高级操作,成为版本控制专家

## 本章目标

- 掌握版本回退和撤销操作
- 学会使用stash暂存工作进度
- 理解并使用Git标签管理版本
- 掌握cherry-pick精准提取提交
- 学会使用reflog恢复丢失的提交
- 了解Git子模块和子树

---

## 11.1 版本回退与撤销

### 11.1.1 工作区、暂存区、仓库的撤销

**Git三个区域的撤销操作**

```
工作区 (Working Directory)
    ↓ git add
暂存区 (Staging Area)
    ↓ git commit
本地仓库 (Repository)
```

### 11.1.2 撤销工作区修改 (git checkout / git restore)

**场景**: 修改了文件但还没有add,想撤销修改

```bash
# 撤销单个文件的修改
git checkout -- README.md

# 或使用新命令 (Git 2.23+, 推荐)
git restore README.md

# 撤销所有文件的修改
git checkout -- .
# 或
git restore .

# 撤销指定目录的修改
git restore src/
```

**⚠️ 警告**: 这个操作会永久丢失工作区的修改!

### 11.1.3 撤销暂存区 (git reset)

**场景**: 已经执行了git add,但想撤销暂存

```bash
# 撤销单个文件的暂存
git reset HEAD README.md

# 或使用新命令 (推荐)
git restore --staged README.md

# 撤销所有文件的暂存
git reset HEAD
# 或
git restore --staged .
```

**注意**: 文件修改仍在工作区,只是移出了暂存区

### 11.1.4 版本回退 (git reset)

**三种reset模式**

| 模式 | 工作区 | 暂存区 | 提交历史 | 使用场景 |
|------|--------|--------|----------|----------|
| `--soft` | 保留 | 保留 | 回退 | 重新组织提交 |
| `--mixed` (默认) | 保留 | 清空 | 回退 | 撤销提交和暂存 |
| `--hard` | 清空 | 清空 | 回退 | 完全回退 |

**示例**

```bash
# 回退到上一个版本,保留修改在暂存区
git reset --soft HEAD~1

# 回退到上一个版本,保留修改在工作区 (默认)
git reset HEAD~1
# 或
git reset --mixed HEAD~1

# 回退到上一个版本,完全丢弃修改
git reset --hard HEAD~1

# 回退到指定提交
git reset --hard a1b2c3d

# 回退到3个版本之前
git reset --hard HEAD~3

# 回退到远程分支的状态
git reset --hard origin/main
```

**HEAD指针说明**
```bash
HEAD      # 当前版本
HEAD~1    # 上一个版本
HEAD~2    # 上上个版本
HEAD^     # 上一个版本 (等同于HEAD~1)
HEAD^^    # 上上个版本 (等同于HEAD~2)
```

### 11.1.5 撤销提交 (git revert)

**场景**: 已经推送到远程,需要安全地撤销某次提交

```bash
# 撤销最近一次提交 (创建一个新的反向提交)
git revert HEAD

# 撤销指定提交
git revert a1b2c3d

# 撤销多个提交
git revert HEAD~3..HEAD

# 撤销但不自动提交 (可以一次性撤销多个)
git revert -n HEAD~2..HEAD
git commit -m "Revert last 3 commits"

# 撤销合并提交
git revert -m 1 <merge-commit-hash>
```

**Reset vs Revert**

| 特性 | Reset | Revert |
|------|-------|--------|
| 历史记录 | 删除提交历史 | 保留历史,创建新提交 |
| 安全性 | 危险,会改写历史 | 安全,不改写历史 |
| 使用场景 | 本地未推送的提交 | 已推送的公共提交 |
| 协作影响 | 会影响团队成员 | 不影响团队成员 |

**最佳实践**
```bash
# ✅ 本地提交: 使用reset
git reset --hard HEAD~1

# ✅ 已推送的提交: 使用revert
git revert HEAD

# ❌ 不要对已推送的提交使用reset
# git reset --hard HEAD~1
# git push -f origin main  # 危险!
```

---

## 11.2 暂存工作进度 (git stash)

### 11.2.1 为什么需要stash?

**场景**: 正在开发功能A,突然需要紧急修复Bug,但当前修改还不想提交

```bash
# 当前状态
git status
# 输出: modified: feature-a.js (未完成的功能)

# 需要切换分支修复bug,但有未提交的修改
git checkout hotfix/urgent-bug
# 错误: Your local changes would be overwritten by checkout
```

### 11.2.2 基本stash操作

```bash
# 暂存当前修改
git stash

# 或添加描述信息
git stash save "WIP: feature A implementation"

# 或使用新命令
git stash push -m "WIP: feature A implementation"

# 查看stash列表
git stash list
# 输出:
# stash@{0}: WIP on feature-a: a1b2c3d Add feature A
# stash@{1}: WIP on main: b2c3d4e Fix bug

# 查看stash内容
git stash show
git stash show -p  # 显示详细差异

# 查看指定stash
git stash show stash@{1}
```

### 11.2.3 恢复stash

```bash
# 恢复最近的stash并删除
git stash pop

# 恢复最近的stash但不删除
git stash apply

# 恢复指定stash
git stash pop stash@{1}
git stash apply stash@{1}

# 删除stash
git stash drop stash@{0}

# 清空所有stash
git stash clear
```

### 11.2.4 高级stash用法

```bash
# 暂存包括未跟踪的文件
git stash -u
# 或
git stash --include-untracked

# 暂存所有文件 (包括被忽略的文件)
git stash -a
# 或
git stash --all

# 交互式暂存
git stash -p

# 从stash创建新分支
git stash branch feature/new-branch stash@{0}
```

### 11.2.5 实战场景

**场景**: 开发中途需要紧急修复Bug

```bash
# 1. 正在开发feature-a分支
git checkout feature-a
# 修改了多个文件...

# 2. 突然需要修复紧急bug
git status
# 输出: modified: feature-a.js, new-file.js

# 3. 暂存当前工作
git stash save "WIP: feature A - half done"

# 4. 切换到main分支修复bug
git checkout main
git checkout -b hotfix/critical-bug

# 5. 修复bug并提交
vim bug-file.js
git add bug-file.js
git commit -m "Fix: Critical bug in production"

# 6. 合并hotfix
git checkout main
git merge hotfix/critical-bug
git push origin main

# 7. 回到feature-a继续开发
git checkout feature-a
git stash pop

# 8. 继续开发...
```

---

## 11.3 标签管理 (git tag)

### 11.3.1 为什么使用标签?

标签用于标记重要的版本节点,如发布版本。

**标签 vs 分支**
- **分支**: 可以移动,用于开发
- **标签**: 固定不变,用于标记版本

### 11.3.2 创建标签

```bash
# 创建轻量标签 (只是一个提交的引用)
git tag v1.0.0

# 创建附注标签 (推荐,包含更多信息)
git tag -a v1.0.0 -m "Release version 1.0.0"

# 为指定提交创建标签
git tag -a v0.9.0 a1b2c3d -m "Release version 0.9.0"

# 查看所有标签
git tag

# 查看标签详细信息
git show v1.0.0

# 查看符合模式的标签
git tag -l "v1.*"
```

### 11.3.3 推送标签

```bash
# 推送单个标签到远程
git push origin v1.0.0

# 推送所有标签
git push origin --tags

# 推送所有附注标签
git push origin --follow-tags
```

### 11.3.4 删除标签

```bash
# 删除本地标签
git tag -d v1.0.0

# 删除远程标签
git push origin --delete v1.0.0
# 或
git push origin :refs/tags/v1.0.0
```

### 11.3.5 检出标签

```bash
# 查看标签对应的代码 (分离HEAD状态)
git checkout v1.0.0

# 基于标签创建新分支
git checkout -b hotfix/v1.0.1 v1.0.0
```

### 11.3.6 版本号规范 (语义化版本)

**格式**: `主版本号.次版本号.修订号` (MAJOR.MINOR.PATCH)

```bash
# 示例
v1.0.0    # 第一个正式版本
v1.0.1    # 修复bug
v1.1.0    # 新增功能,向下兼容
v2.0.0    # 重大更新,可能不兼容

# 预发布版本
v1.0.0-alpha    # 内部测试版
v1.0.0-beta     # 公开测试版
v1.0.0-rc.1     # 候选发布版
```

**实战示例**
```bash
# 发布1.0.0版本
git tag -a v1.0.0 -m "Release version 1.0.0
- 用户登录功能
- 数据展示功能
- 基础管理功能"

git push origin v1.0.0

# 修复bug,发布1.0.1
git tag -a v1.0.1 -m "Release version 1.0.1
- Fix: 修复登录超时问题
- Fix: 修复数据显示错误"

git push origin v1.0.1

# 新增功能,发布1.1.0
git tag -a v1.1.0 -m "Release version 1.1.0
- Feat: 新增用户权限管理
- Feat: 新增数据导出功能
- Fix: 优化性能"

git push origin v1.1.0
```

---

## 11.4 精准提取提交 (git cherry-pick)

### 11.4.1 什么是cherry-pick?

Cherry-pick允许你从其他分支精准地"摘取"某个提交,应用到当前分支。

**场景**: feature分支有个bug修复,想单独应用到main分支

```bash
# feature分支的提交历史
feature: ●───●───●(bug fix)───●───●
                    ↓
main:    ●───●───●───●(应用这个bug fix)
```

### 11.4.2 基本用法

```bash
# 应用指定提交到当前分支
git cherry-pick a1b2c3d

# 应用多个提交
git cherry-pick a1b2c3d b2c3d4e

# 应用一个范围的提交 (不包括start)
git cherry-pick start-commit..end-commit

# 应用一个范围的提交 (包括start)
git cherry-pick start-commit^..end-commit
```

### 11.4.3 处理冲突

```bash
# 执行cherry-pick
git cherry-pick a1b2c3d

# 如果有冲突
# 输出: CONFLICT (content): Merge conflict in file.js

# 解决冲突
vim file.js
git add file.js

# 继续cherry-pick
git cherry-pick --continue

# 或放弃cherry-pick
git cherry-pick --abort
```

### 11.4.4 实战场景

**场景**: 从feature分支挑选bug修复到main分支

```bash
# 1. 在feature分支修复了一个bug
git checkout feature/new-feature
git log --oneline
# 输出:
# a1b2c3d Fix: Resolve memory leak issue
# b2c3d4e Feat: Add new feature
# c3d4e5f Feat: Update UI

# 2. 切换到main分支
git checkout main

# 3. 挑选bug修复提交
git cherry-pick a1b2c3d

# 4. 推送到远程
git push origin main

# 现在main分支也有了这个bug修复,但没有新功能的代码
```

---

## 11.5 恢复丢失的提交 (git reflog)

### 11.5.1 什么是reflog?

Reflog记录了HEAD的移动历史,即使提交被删除,也能通过reflog找回。

**场景**: 不小心执行了`git reset --hard`,想恢复丢失的提交

### 11.5.2 查看reflog

```bash
# 查看HEAD的移动历史
git reflog

# 输出示例:
# a1b2c3d (HEAD -> main) HEAD@{0}: reset: moving to HEAD~1
# b2c3d4e HEAD@{1}: commit: Add new feature
# c3d4e5f HEAD@{2}: commit: Fix bug
# d4e5f6g HEAD@{3}: checkout: moving from feature to main

# 查看详细信息
git reflog show --all

# 查看指定分支的reflog
git reflog show feature/login
```

### 11.5.3 恢复丢失的提交

```bash
# 场景: 不小心reset了
git reset --hard HEAD~3
# 丢失了3个提交!

# 1. 查看reflog找到丢失的提交
git reflog
# 输出:
# a1b2c3d HEAD@{0}: reset: moving to HEAD~3
# b2c3d4e HEAD@{1}: commit: Important feature  ← 想恢复这个

# 2. 恢复到指定提交
git reset --hard b2c3d4e
# 或
git reset --hard HEAD@{1}

# 3. 验证恢复
git log --oneline
# 提交已恢复!
```

### 11.5.4 恢复删除的分支

```bash
# 场景: 不小心删除了分支
git branch -D feature/important
# 输出: Deleted branch feature/important (was a1b2c3d).

# 1. 查看reflog
git reflog
# 找到分支删除前的提交: a1b2c3d

# 2. 重新创建分支
git checkout -b feature/important a1b2c3d

# 分支恢复成功!
```

---

## 11.6 子模块与子树

### 11.6.1 Git子模块 (Submodule)

**场景**: 项目依赖另一个Git仓库

```bash
# 添加子模块
git submodule add https://github.com/user/library.git libs/library

# 克隆包含子模块的项目
git clone https://github.com/user/project.git
cd project
git submodule init
git submodule update
# 或一步完成
git clone --recursive https://github.com/user/project.git

# 更新子模块
git submodule update --remote

# 查看子模块状态
git submodule status

# 删除子模块
git submodule deinit libs/library
git rm libs/library
rm -rf .git/modules/libs/library
```

### 11.6.2 Git子树 (Subtree)

**场景**: 将另一个仓库作为子目录包含进来

```bash
# 添加子树
git subtree add --prefix=libs/library https://github.com/user/library.git main --squash

# 更新子树
git subtree pull --prefix=libs/library https://github.com/user/library.git main --squash

# 推送子树修改
git subtree push --prefix=libs/library https://github.com/user/library.git main
```

**Submodule vs Subtree**

| 特性 | Submodule | Subtree |
|------|-----------|---------|
| 复杂度 | 较复杂 | 较简单 |
| 历史记录 | 独立 | 合并到主仓库 |
| 克隆 | 需要额外步骤 | 自动包含 |
| 使用场景 | 独立维护的依赖 | 需要修改的依赖 |

---

## 11.7 其他实用技巧

### 11.7.1 交互式暂存 (git add -p)

```bash
# 交互式选择要暂存的修改
git add -p

# 选项:
# y - 暂存这个块
# n - 不暂存这个块
# s - 分割成更小的块
# e - 手动编辑
# q - 退出
```

### 11.7.2 修改多个提交 (git rebase -i)

```bash
# 交互式变基最近3个提交
git rebase -i HEAD~3

# 编辑器会显示:
# pick a1b2c3d Commit message 1
# pick b2c3d4e Commit message 2
# pick c3d4e5f Commit message 3

# 可以进行的操作:
# pick - 保留提交
# reword - 修改提交信息
# edit - 修改提交内容
# squash - 合并到上一个提交
# fixup - 合并到上一个提交,丢弃提交信息
# drop - 删除提交
```

**示例: 合并多个提交**
```bash
# 将最近3个提交合并为1个
git rebase -i HEAD~3

# 修改为:
# pick a1b2c3d First commit
# squash b2c3d4e Second commit
# squash c3d4e5f Third commit

# 保存后,编辑合并后的提交信息
```

### 11.7.3 查找引入bug的提交 (git bisect)

```bash
# 开始二分查找
git bisect start

# 标记当前版本有bug
git bisect bad

# 标记某个版本没有bug
git bisect good v1.0.0

# Git会自动切换到中间版本,测试后标记
git bisect good  # 或 git bisect bad

# 重复直到找到引入bug的提交

# 结束查找
git bisect reset
```

### 11.7.4 清理仓库

```bash
# 查看仓库大小
du -sh .git

# 清理不需要的文件
git gc

# 更激进的清理
git gc --aggressive --prune=now

# 查看大文件
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  sed -n 's/^blob //p' | \
  sort --numeric-sort --key=2 | \
  tail -n 10

# 从历史中删除大文件 (危险!)
git filter-branch --tree-filter 'rm -f large-file.zip' HEAD
```

---

## 11.8 实战场景:紧急修复线上Bug

### 场景描述
生产环境发现严重bug,需要紧急修复并发布,但你正在开发新功能。

### 完整流程

```bash
# 1. 当前状态: 正在feature分支开发
git checkout feature/new-dashboard
git status
# 输出: modified: dashboard.js, new-file.js

# 2. 暂存当前工作
git stash save "WIP: Dashboard redesign - 50% complete"

# 3. 切换到main分支
git checkout main
git pull origin main

# 4. 基于当前生产版本创建hotfix分支
git checkout -b hotfix/critical-bug v1.2.0

# 5. 修复bug
vim src/payment.js
# 修复支付逻辑bug...

# 6. 测试修复
npm test

# 7. 提交修复
git add src/payment.js
git commit -m "Fix: Resolve payment processing error

- 修复支付金额计算错误
- 添加边界条件检查
- 更新单元测试

Fixes #1234"

# 8. 合并到main并打标签
git checkout main
git merge --no-ff hotfix/critical-bug
git tag -a v1.2.1 -m "Hotfix release 1.2.1
- Fix: Payment processing error"

# 9. 推送到远程
git push origin main
git push origin v1.2.1

# 10. 合并到develop分支 (如果使用Git Flow)
git checkout develop
git merge --no-ff hotfix/critical-bug
git push origin develop

# 11. 删除hotfix分支
git branch -d hotfix/critical-bug

# 12. 回到feature分支继续开发
git checkout feature/new-dashboard
git stash pop

# 13. 合并hotfix到feature分支 (避免冲突)
git merge main

# 14. 继续开发...
```

---

## 11.9 常用命令速查

| 命令 | 说明 | 示例 |
|------|------|------|
| `git reset` | 版本回退 | `git reset --hard HEAD~1` |
| `git revert` | 撤销提交 | `git revert HEAD` |
| `git stash` | 暂存工作 | `git stash save "message"` |
| `git tag` | 标签管理 | `git tag -a v1.0.0 -m "msg"` |
| `git cherry-pick` | 精准提取提交 | `git cherry-pick a1b2c3d` |
| `git reflog` | 查看引用日志 | `git reflog` |
| `git rebase -i` | 交互式变基 | `git rebase -i HEAD~3` |

---

## 11.10 常见问题与解决

### Q1: 如何撤销已推送的提交?
```bash
# 使用revert (推荐)
git revert HEAD
git push origin main

# 或强制推送 (危险,仅在个人分支使用)
git reset --hard HEAD~1
git push -f origin feature/my-branch
```

### Q2: 如何合并多个提交为一个?
```bash
# 交互式变基
git rebase -i HEAD~3
# 将后面的提交改为squash

# 或使用reset
git reset --soft HEAD~3
git commit -m "Combined commit message"
```

### Q3: 如何修改历史提交信息?
```bash
# 修改最近一次提交
git commit --amend -m "New message"

# 修改历史提交
git rebase -i HEAD~3
# 将要修改的提交改为reword
```

### Q4: stash后如何查看暂存的内容?
```bash
# 查看stash列表
git stash list

# 查看stash内容
git stash show -p stash@{0}

# 查看stash的文件列表
git stash show stash@{0}
```

### Q5: 如何找回误删的文件?
```bash
# 查看删除文件的提交
git log --all --full-history -- path/to/file

# 恢复文件
git checkout <commit-hash>^ -- path/to/file
```

---

## 11.11 本章小结

本章学习了Git进阶技巧:

✅ **版本回退**: 掌握reset和revert的使用  
✅ **暂存工作**: 使用stash管理未完成的工作  
✅ **标签管理**: 为重要版本打标签  
✅ **精准提取**: 使用cherry-pick提取特定提交  
✅ **恢复数据**: 使用reflog恢复丢失的提交  
✅ **高级操作**: 交互式变基、二分查找等  

### 关键要点
- Reset改写历史,Revert保留历史
- Stash是临时保存工作的好帮手
- 标签用于标记重要版本,遵循语义化版本规范
- Reflog是Git的"后悔药",可以恢复几乎所有丢失的数据
- 谨慎使用改写历史的操作,特别是在公共分支上

### Git学习完成!
恭喜你完成了Git版本控制的学习!现在你已经掌握了:
- ✅ Git基础操作 (第9章)
- ✅ Git分支与协作 (第10章)
- ✅ Git进阶技巧 (第11章)

### 下一步学习
继续学习Linux其他核心技能:
- 第1章: Linux系统基础认知
- 第2章: 文件系统导航
- 第3章: 文件与目录基本操作

---

## 11.12 练习题

1. **基础练习**: 练习使用stash暂存工作,切换分支后再恢复
2. **进阶练习**: 为项目创建版本标签,模拟版本发布流程
3. **实战练习**: 使用cherry-pick从feature分支提取bug修复到main
4. **挑战练习**: 使用rebase -i整理提交历史,合并多个小提交

---

**🎉 恭喜!你已经成为Git高手!**

返回目录 → [README.md](/linux.html)
