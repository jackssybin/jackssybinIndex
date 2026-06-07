---
title: "第15章:Shell脚本入门"
description: "第15章:Shell脚本入门 掌握Shell脚本编写,实现任务自动化 本章目标 理解Shell脚本的基本语法 掌握变量、条件判断和循环 学会编写实用的自动化脚本 能够处理命令行参数和用户输入 了解脚本调试和错误处理 15.1 Shell脚本基础 15.1.1 什么是Shell脚本 Shell脚本是包含一系列Shell命..."
url: /linux/15/15-linux.html
layout: tutorial
contentType: tutorial
series: linux
seriesTitle: Linux教程
weight: 150
tags:
  - Linux
  - Shell
  - Git
  - 教程
draft: false
---

# 第15章:Shell脚本入门

> 掌握Shell脚本编写,实现任务自动化

## 本章目标

- 理解Shell脚本的基本语法
- 掌握变量、条件判断和循环
- 学会编写实用的自动化脚本
- 能够处理命令行参数和用户输入
- 了解脚本调试和错误处理

---

## 15.1 Shell脚本基础

### 15.1.1 什么是Shell脚本

Shell脚本是包含一系列Shell命令的文本文件,可以批量执行命令,实现自动化。

**创建第一个脚本**:
```bash
# 创建脚本文件
nano hello.sh
```

```bash
#!/bin/bash
# 这是一个简单的Shell脚本

echo "Hello, World!"
echo "Current user: $USER"
echo "Current directory: $PWD"
echo "Current date: $(date)"
```

```bash
# 添加执行权限
chmod +x hello.sh

# 运行脚本
./hello.sh
```

**输出**:
```
Hello, World!
Current user: alice
Current directory: /home/alice
Current date: Tue Jan 14 10:00:00 CST 2026
```

### 15.1.2 Shebang行

```bash
#!/bin/bash        # 使用Bash
#!/bin/sh          # 使用sh(POSIX兼容)
#!/usr/bin/env bash # 使用环境中的bash(推荐,跨平台)
#!/usr/bin/env python3 # Python脚本
```

### 15.1.3 注释

```bash
# 这是单行注释

: '
这是多行注释
可以写多行
'

<<'COMMENT'
这也是多行注释
另一种方式
COMMENT
```

---

## 15.2 变量

### 15.2.1 定义和使用变量

```bash
#!/bin/bash

# 定义变量(注意:等号两边不能有空格)
name="Alice"
age=25
PI=3.14159

# 使用变量
echo "Name: $name"
echo "Age: $age"
echo "PI: $PI"

# 使用花括号(推荐,更清晰)
echo "Name: ${name}"
echo "Hello, ${name}!"

# 变量拼接
greeting="Hello, ${name}! You are ${age} years old."
echo $greeting
```

### 15.2.2 只读变量和删除变量

```bash
#!/bin/bash

# 只读变量
readonly PI=3.14159
PI=3.14  # 错误:无法修改只读变量

# 删除变量
name="Alice"
unset name
echo $name  # 输出空
```

### 15.2.3 特殊变量

```bash
#!/bin/bash

echo "脚本名称: $0"
echo "第一个参数: $1"
echo "第二个参数: $2"
echo "所有参数: $@"
echo "参数个数: $#"
echo "上一个命令的退出状态: $?"
echo "当前进程ID: $$"
echo "后台运行的最后一个进程ID: $!"
```

**运行示例**:
```bash
./script.sh arg1 arg2 arg3

# 输出:
# 脚本名称: ./script.sh
# 第一个参数: arg1
# 第二个参数: arg2
# 所有参数: arg1 arg2 arg3
# 参数个数: 3
```

### 15.2.4 命令替换

```bash
#!/bin/bash

# 方法1: 反引号(旧式)
current_date=`date`

# 方法2: $() (推荐)
current_date=$(date)
file_count=$(ls | wc -l)
current_user=$(whoami)

echo "Date: $current_date"
echo "Files: $file_count"
echo "User: $current_user"
```

### 15.2.5 数组

```bash
#!/bin/bash

# 定义数组
fruits=("apple" "banana" "orange")

# 访问元素
echo ${fruits[0]}  # apple
echo ${fruits[1]}  # banana

# 所有元素
echo ${fruits[@]}  # apple banana orange

# 数组长度
echo ${#fruits[@]}  # 3

# 添加元素
fruits+=("grape")

# 遍历数组
for fruit in "${fruits[@]}"; do
    echo "Fruit: $fruit"
done
```

---

## 15.3 条件判断

### 15.3.1 if语句

```bash
#!/bin/bash

age=18

if [ $age -ge 18 ]; then
    echo "You are an adult"
fi

# if-else
if [ $age -ge 18 ]; then
    echo "You are an adult"
else
    echo "You are a minor"
fi

# if-elif-else
score=85

if [ $score -ge 90 ]; then
    echo "Grade: A"
elif [ $score -ge 80 ]; then
    echo "Grade: B"
elif [ $score -ge 70 ]; then
    echo "Grade: C"
else
    echo "Grade: F"
fi
```

### 15.3.2 测试条件

**数值比较**:
```bash
# -eq  等于
# -ne  不等于
# -gt  大于
# -ge  大于等于
# -lt  小于
# -le  小于等于

if [ $a -eq $b ]; then
    echo "a equals b"
fi
```

**字符串比较**:
```bash
# =    等于
# !=   不等于
# -z   字符串长度为0
# -n   字符串长度不为0

name="Alice"

if [ "$name" = "Alice" ]; then
    echo "Hello, Alice!"
fi

if [ -z "$name" ]; then
    echo "Name is empty"
fi

if [ -n "$name" ]; then
    echo "Name is not empty"
fi
```

**文件测试**:
```bash
# -e  文件存在
# -f  是普通文件
# -d  是目录
# -r  可读
# -w  可写
# -x  可执行
# -s  文件大小不为0

file="test.txt"

if [ -e "$file" ]; then
    echo "File exists"
fi

if [ -f "$file" ]; then
    echo "It's a regular file"
fi

if [ -d "$file" ]; then
    echo "It's a directory"
fi

if [ -r "$file" ]; then
    echo "File is readable"
fi
```

**逻辑运算**:
```bash
# &&  逻辑与
# ||  逻辑或
# !   逻辑非

age=25
name="Alice"

# 与
if [ $age -ge 18 ] && [ "$name" = "Alice" ]; then
    echo "Adult named Alice"
fi

# 或
if [ $age -lt 18 ] || [ "$name" = "Bob" ]; then
    echo "Minor or Bob"
fi

# 非
if [ ! -e "file.txt" ]; then
    echo "File does not exist"
fi
```

### 15.3.3 case语句

```bash
#!/bin/bash

read -p "Enter a fruit: " fruit

case $fruit in
    apple)
        echo "Apple is red"
        ;;
    banana)
        echo "Banana is yellow"
        ;;
    orange)
        echo "Orange is orange"
        ;;
    *)
        echo "Unknown fruit"
        ;;
esac
```

**实战示例**: 脚本参数处理
```bash
#!/bin/bash

case $1 in
    start)
        echo "Starting service..."
        ;;
    stop)
        echo "Stopping service..."
        ;;
    restart)
        echo "Restarting service..."
        ;;
    status)
        echo "Checking status..."
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac
```

---

## 15.4 循环

### 15.4.1 for循环

```bash
#!/bin/bash

# 遍历列表
for i in 1 2 3 4 5; do
    echo "Number: $i"
done

# 遍历范围
for i in {1..10}; do
    echo "Number: $i"
done

# C风格for循环
for ((i=1; i<=10; i++)); do
    echo "Number: $i"
done

# 遍历文件
for file in *.txt; do
    echo "Processing: $file"
done

# 遍历命令输出
for user in $(cat /etc/passwd | cut -d: -f1); do
    echo "User: $user"
done
```

### 15.4.2 while循环

```bash
#!/bin/bash

# 基本while循环
count=1
while [ $count -le 5 ]; do
    echo "Count: $count"
    ((count++))
done

# 读取文件
while read line; do
    echo "Line: $line"
done < file.txt

# 无限循环
while true; do
    echo "Running..."
    sleep 1
done
```

### 15.4.3 until循环

```bash
#!/bin/bash

# until循环(条件为假时执行)
count=1
until [ $count -gt 5 ]; do
    echo "Count: $count"
    ((count++))
done
```

### 15.4.4 循环控制

```bash
#!/bin/bash

# break: 跳出循环
for i in {1..10}; do
    if [ $i -eq 5 ]; then
        break
    fi
    echo "Number: $i"
done

# continue: 跳过当前迭代
for i in {1..10}; do
    if [ $i -eq 5 ]; then
        continue
    fi
    echo "Number: $i"
done
```

---

## 15.5 函数

### 15.5.1 定义和调用函数

```bash
#!/bin/bash

# 定义函数
greet() {
    echo "Hello, World!"
}

# 调用函数
greet

# 带参数的函数
greet_user() {
    echo "Hello, $1!"
}

greet_user "Alice"
greet_user "Bob"

# 返回值
add() {
    local result=$(($1 + $2))
    echo $result
}

sum=$(add 5 3)
echo "Sum: $sum"
```

### 15.5.2 局部变量和全局变量

```bash
#!/bin/bash

# 全局变量
global_var="I'm global"

my_function() {
    # 局部变量
    local local_var="I'm local"
    echo "Inside function:"
    echo "  Global: $global_var"
    echo "  Local: $local_var"
}

my_function

echo "Outside function:"
echo "  Global: $global_var"
echo "  Local: $local_var"  # 空,局部变量不可见
```

### 15.5.3 函数返回值

```bash
#!/bin/bash

# 使用return返回退出状态(0-255)
is_even() {
    if [ $(($1 % 2)) -eq 0 ]; then
        return 0  # 成功
    else
        return 1  # 失败
    fi
}

is_even 4
if [ $? -eq 0 ]; then
    echo "4 is even"
fi

# 使用echo返回值
get_sum() {
    echo $(($1 + $2))
}

result=$(get_sum 10 20)
echo "Sum: $result"
```

---

## 15.6 输入输出

### 15.6.1 读取用户输入

```bash
#!/bin/bash

# 基本输入
read -p "Enter your name: " name
echo "Hello, $name!"

# 读取密码(不显示输入)
read -sp "Enter password: " password
echo
echo "Password received"

# 设置超时
read -t 5 -p "Enter something (5 seconds): " input
echo "You entered: $input"

# 读取单个字符
read -n 1 -p "Press any key to continue..."
echo
```

### 15.6.2 重定向

```bash
#!/bin/bash

# 输出重定向
echo "Hello" > output.txt       # 覆盖
echo "World" >> output.txt      # 追加

# 输入重定向
while read line; do
    echo "Line: $line"
done < input.txt

# 错误重定向
command 2> error.log            # 错误输出到文件
command > output.log 2>&1       # 标准输出和错误都输出到文件
command &> all.log              # 同上(简写)

# 丢弃输出
command > /dev/null 2>&1
```

### 15.6.3 Here Document

```bash
#!/bin/bash

# Here Document
cat <<EOF
This is a multi-line
text block.
Variables work: $USER
EOF

# 写入文件
cat > config.txt <<EOF
server {
    listen 80;
    server_name example.com;
}
EOF

# 不解析变量(使用引号)
cat <<'EOF'
This is literal: $USER
EOF
```

---

## 15.7 实战脚本

### 脚本1: 系统信息收集

```bash
#!/bin/bash
# system-info.sh - 收集系统信息

echo "====== System Information ======"
echo

echo "Hostname: $(hostname)"
echo "OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"
echo "Kernel: $(uname -r)"
echo "Uptime: $(uptime -p)"
echo

echo "====== CPU Information ======"
echo "CPU: $(lscpu | grep 'Model name' | cut -d':' -f2 | xargs)"
echo "Cores: $(nproc)"
echo

echo "====== Memory Information ======"
free -h
echo

echo "====== Disk Usage ======"
df -h | grep -E '^/dev/'
echo

echo "====== Network Interfaces ======"
ip -br addr
echo

echo "====== Top 5 Processes by CPU ======"
ps aux --sort=-%cpu | head -6
echo

echo "====== Top 5 Processes by Memory ======"
ps aux --sort=-%mem | head -6
```

### 脚本2: 自动备份

```bash
#!/bin/bash
# backup.sh - 自动备份脚本

# 配置
SOURCE_DIR="/var/www/html"
BACKUP_DIR="/backup"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${DATE}.tar.gz"
KEEP_DAYS=7

# 检查源目录
if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: Source directory does not exist: $SOURCE_DIR"
    exit 1
fi

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 创建备份
echo "Creating backup..."
tar -czf "${BACKUP_DIR}/${BACKUP_FILE}" "$SOURCE_DIR"

if [ $? -eq 0 ]; then
    echo "Backup created successfully: ${BACKUP_FILE}"
    echo "Size: $(du -h ${BACKUP_DIR}/${BACKUP_FILE} | cut -f1)"
else
    echo "Error: Backup failed"
    exit 1
fi

# 删除旧备份
echo "Cleaning old backups (older than ${KEEP_DAYS} days)..."
find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +${KEEP_DAYS} -delete

echo "Backup completed!"
```

### 脚本3: 批量重命名文件

```bash
#!/bin/bash
# rename-files.sh - 批量重命名文件

# 用法: ./rename-files.sh old_pattern new_pattern

if [ $# -ne 2 ]; then
    echo "Usage: $0 old_pattern new_pattern"
    echo "Example: $0 .txt .bak"
    exit 1
fi

OLD_PATTERN=$1
NEW_PATTERN=$2
COUNT=0

for file in *${OLD_PATTERN}; do
    if [ -f "$file" ]; then
        new_name="${file/${OLD_PATTERN}/${NEW_PATTERN}}"
        mv "$file" "$new_name"
        echo "Renamed: $file -> $new_name"
        ((COUNT++))
    fi
done

echo "Total files renamed: $COUNT"
```

### 脚本4: 服务健康检查

```bash
#!/bin/bash
# health-check.sh - 服务健康检查

# 配置
SERVICES=("nginx" "mysql" "redis")
LOG_FILE="/var/log/health-check.log"

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 检查服务
check_service() {
    local service=$1
    
    if systemctl is-active --quiet "$service"; then
        log "✓ $service is running"
        return 0
    else
        log "✗ $service is NOT running"
        # 尝试重启
        log "Attempting to restart $service..."
        systemctl restart "$service"
        
        if systemctl is-active --quiet "$service"; then
            log "✓ $service restarted successfully"
            return 0
        else
            log "✗ Failed to restart $service"
            return 1
        fi
    fi
}

# 主程序
log "====== Health Check Started ======"

failed=0
for service in "${SERVICES[@]}"; do
    check_service "$service"
    if [ $? -ne 0 ]; then
        ((failed++))
    fi
done

log "====== Health Check Completed ======"
log "Failed services: $failed"

exit $failed
```

### 脚本5: 交互式菜单

```bash
#!/bin/bash
# menu.sh - 交互式菜单

show_menu() {
    clear
    echo "=============================="
    echo "    System Management Menu"
    echo "=============================="
    echo "1. Show system info"
    echo "2. Show disk usage"
    echo "3. Show memory usage"
    echo "4. Show running processes"
    echo "5. Update system"
    echo "6. Exit"
    echo "=============================="
}

while true; do
    show_menu
    read -p "Enter your choice [1-6]: " choice
    
    case $choice in
        1)
            echo
            echo "=== System Information ==="
            uname -a
            read -p "Press Enter to continue..."
            ;;
        2)
            echo
            echo "=== Disk Usage ==="
            df -h
            read -p "Press Enter to continue..."
            ;;
        3)
            echo
            echo "=== Memory Usage ==="
            free -h
            read -p "Press Enter to continue..."
            ;;
        4)
            echo
            echo "=== Top 10 Processes ==="
            ps aux --sort=-%cpu | head -11
            read -p "Press Enter to continue..."
            ;;
        5)
            echo
            echo "=== Updating System ==="
            sudo apt update && sudo apt upgrade -y
            read -p "Press Enter to continue..."
            ;;
        6)
            echo "Goodbye!"
            exit 0
            ;;
        *)
            echo "Invalid choice!"
            sleep 2
            ;;
    esac
done
```

---

## 15.8 调试和错误处理

### 15.8.1 调试模式

```bash
#!/bin/bash

# 启用调试模式
set -x  # 打印每条命令
set -v  # 打印原始命令

# 或在运行时启用
bash -x script.sh

# 部分调试
set -x
# 需要调试的代码
set +x

# 严格模式
set -e  # 遇到错误立即退出
set -u  # 使用未定义变量时报错
set -o pipefail  # 管道中任何命令失败都返回失败

# 组合使用(推荐)
set -euo pipefail
```

### 15.8.2 错误处理

```bash
#!/bin/bash

# 检查命令执行状态
command
if [ $? -ne 0 ]; then
    echo "Command failed"
    exit 1
fi

# 使用 || 处理错误
command || { echo "Command failed"; exit 1; }

# 使用 && 链接命令
command1 && command2 && command3

# trap捕获信号
cleanup() {
    echo "Cleaning up..."
    rm -f /tmp/tempfile
}

trap cleanup EXIT

# 脚本执行...
```

### 15.8.3 日志记录

```bash
#!/bin/bash

LOG_FILE="/var/log/script.log"

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "Script started"
log "Processing data..."
log "Script completed"

# 同时输出到终端和日志文件
exec > >(tee -a "$LOG_FILE") 2>&1

echo "This goes to both terminal and log file"
```

---

## 15.9 最佳实践

### 15.9.1 脚本模板

```bash
#!/usr/bin/env bash

#######################################
# Script Name: example.sh
# Description: Script description
# Author: Your Name
# Date: 2026-01-14
#######################################

# 严格模式
set -euo pipefail

# 常量
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SCRIPT_NAME="$(basename "$0")"

# 配置
LOG_FILE="/var/log/${SCRIPT_NAME}.log"

# 函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

usage() {
    cat <<EOF
Usage: $SCRIPT_NAME [OPTIONS]

Options:
    -h, --help      Show this help message
    -v, --verbose   Enable verbose mode
    
Example:
    $SCRIPT_NAME --verbose
EOF
}

main() {
    log "Script started"
    
    # 主逻辑
    
    log "Script completed"
}

# 参数解析
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            exit 0
            ;;
        -v|--verbose)
            set -x
            shift
            ;;
        *)
            echo "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
done

# 执行主函数
main "$@"
```

### 15.9.2 代码规范

```bash
# 1. 使用有意义的变量名
user_name="Alice"  # 好
un="Alice"         # 不好

# 2. 使用大写命名常量
readonly MAX_RETRY=3
readonly CONFIG_FILE="/etc/app.conf"

# 3. 引用变量
echo "$variable"      # 好
echo $variable        # 可能有问题

# 4. 使用[[]]而非[]
if [[ "$var" = "value" ]]; then  # 好
if [ "$var" = "value" ]; then    # 旧式

# 5. 检查命令是否存在
if command -v git &> /dev/null; then
    echo "Git is installed"
fi

# 6. 使用函数组织代码
process_data() {
    # 处理逻辑
}

# 7. 添加注释
# 这个函数用于处理用户输入
process_input() {
    # ...
}
```

---

## 15.10 常见问题

### Q1: 如何传递参数给脚本?

**A**:
```bash
#!/bin/bash
echo "Script: $0"
echo "Arg 1: $1"
echo "Arg 2: $2"
echo "All args: $@"
echo "Arg count: $#"

# 运行: ./script.sh hello world
```

### Q2: 如何检查文件是否存在?

**A**:
```bash
if [ -f "file.txt" ]; then
    echo "File exists"
else
    echo "File does not exist"
fi
```

### Q3: 如何比较字符串?

**A**:
```bash
# 使用 = 或 ==
if [ "$str1" = "$str2" ]; then
    echo "Strings are equal"
fi

# 推荐使用 [[]]
if [[ "$str1" == "$str2" ]]; then
    echo "Strings are equal"
fi
```

### Q4: 如何处理空格和特殊字符?

**A**:
```bash
# 始终引用变量
file="my file.txt"
cat "$file"  # 正确
cat $file    # 错误,会被解析为两个参数

# 使用数组处理多个值
files=("file1.txt" "file 2.txt" "file3.txt")
for file in "${files[@]}"; do
    echo "$file"
done
```

### Q5: 如何让脚本在后台运行?

**A**:
```bash
# 方法1: 使用 &
./script.sh &

# 方法2: 使用nohup
nohup ./script.sh > output.log 2>&1 &

# 方法3: 使用screen或tmux
screen -dmS mysession ./script.sh
```

---

## 本章总结

### 核心语法回顾

| 语法 | 用途 | 示例 |
|------|------|------|
| `if [ condition ]` | 条件判断 | `if [ $a -eq $b ]; then ... fi` |
| `for var in list` | 循环 | `for i in {1..10}; do ... done` |
| `while [ condition ]` | While循环 | `while [ $i -lt 10 ]; do ... done` |
| `function_name()` | 定义函数 | `greet() { echo "Hello"; }` |
| `$1, $2, $@` | 参数 | `echo $1` |

### 常用测试条件

| 条件 | 说明 | 示例 |
|------|------|------|
| `-eq` | 数值相等 | `[ $a -eq $b ]` |
| `=` | 字符串相等 | `[ "$a" = "$b" ]` |
| `-f` | 是文件 | `[ -f file.txt ]` |
| `-d` | 是目录 | `[ -d /path ]` |
| `-e` | 存在 | `[ -e file ]` |

### 最佳实践

- ✅ 使用 `#!/usr/bin/env bash`
- ✅ 启用严格模式 `set -euo pipefail`
- ✅ 引用所有变量 `"$var"`
- ✅ 使用函数组织代码
- ✅ 添加错误处理和日志
- ✅ 编写使用说明

### 下一步

- 学习Web项目部署实战(第16章)
- 将Shell脚本应用到实际项目
- 掌握自动化部署流程

---

**练习题**:

1. 编写一个脚本,接受文件名参数,检查文件是否存在
2. 编写一个脚本,计算1到100的和
3. 编写一个脚本,列出当前目录下所有.txt文件
4. 编写一个脚本,创建每日备份并保留最近7天的备份

**参考答案**:
```bash
# 1.
#!/bin/bash
if [ -f "$1" ]; then
    echo "File exists: $1"
else
    echo "File not found: $1"
fi

# 2.
#!/bin/bash
sum=0
for i in {1..100}; do
    ((sum += i))
done
echo "Sum: $sum"

# 3.
#!/bin/bash
for file in *.txt; do
    if [ -f "$file" ]; then
        echo "$file"
    fi
done

# 4.
#!/bin/bash
BACKUP_DIR="/backup"
DATE=$(date +%Y%m%d)
tar -czf "${BACKUP_DIR}/backup_${DATE}.tar.gz" /data
find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +7 -delete
```

---

> 💡 **提示**: Shell脚本是Linux自动化的基础,从简单脚本开始,逐步提升复杂度!
