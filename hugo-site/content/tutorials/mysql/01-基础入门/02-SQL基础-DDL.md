---
title: 第02章：SQL基础 - DDL数据定义语言
description: 第02章：SQL基础 DDL数据定义语言 DDL (Data Definition Language) 用于定义和管理数据库对象
  2.1 SQL语言分类 类型 全称 说明 主要语句 DDL Data Definition Language 数据定义语言
  CREATE、ALTER、DROP、TRUNCATE DML Data Manipulation Lang...
url: /mysql/01/02-sql-ddl.html
layout: tutorial
kind: tutorial
series: mysql
seriesTitle: MySQL教程
weight: 20
tags:
  - MySQL
  - SQL
  - 数据库
  - 教程
draft: false
---

# 第02章：SQL基础 - DDL数据定义语言

> DDL (Data Definition Language) 用于定义和管理数据库对象

## 2.1 SQL语言分类

| 类型 | 全称 | 说明 | 主要语句 |
|------|------|------|---------|
| **DDL** | Data Definition Language | 数据定义语言 | CREATE、ALTER、DROP、TRUNCATE |
| **DML** | Data Manipulation Language | 数据操作语言 | INSERT、UPDATE、DELETE |
| **DQL** | Data Query Language | 数据查询语言 | SELECT |
| **DCL** | Data Control Language | 数据控制语言 | GRANT、REVOKE |
| **TCL** | Transaction Control Language | 事务控制语言 | COMMIT、ROLLBACK、SAVEPOINT |

---

## 2.2 数据库操作

### 2.2.1 创建数据库

```sql
-- 基本语法
CREATE DATABASE database_name;

-- 指定字符集
CREATE DATABASE mydb CHARACTER SET utf8mb4;

-- 指定字符集和排序规则
CREATE DATABASE mydb 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 如果不存在则创建
CREATE DATABASE IF NOT EXISTS mydb;

-- 完整示例
CREATE DATABASE IF NOT EXISTS mydb
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

### 2.2.2 查看数据库

```sql
-- 查看所有数据库
SHOW DATABASES;

-- 查看数据库创建语句
SHOW CREATE DATABASE mydb;

-- 查看当前使用的数据库
SELECT DATABASE();
```

### 2.2.3 修改数据库

```sql
-- 修改字符集
ALTER DATABASE mydb CHARACTER SET utf8mb4;

-- 修改排序规则
ALTER DATABASE mydb COLLATE utf8mb4_unicode_ci;
```

### 2.2.4 删除数据库

```sql
-- 删除数据库（危险操作！）
DROP DATABASE mydb;

-- 如果存在则删除
DROP DATABASE IF EXISTS mydb;
```

### 2.2.5 使用数据库

```sql
-- 切换到指定数据库
USE mydb;
```

---

## 2.3 数据表操作

### 2.3.1 创建表

**基本语法：**
```sql
CREATE TABLE table_name (
    column1 datatype constraints,
    column2 datatype constraints,
    ...
    table_constraints
);
```

**示例1：简单表**
```sql
CREATE TABLE users (
    id INT,
    name VARCHAR(50),
    age INT
);
```

**示例2：完整表定义**
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(100) NOT NULL COMMENT '密码',
    email VARCHAR(100) COMMENT '邮箱',
    phone CHAR(11) COMMENT '手机号',
    age INT DEFAULT 0 COMMENT '年龄',
    gender ENUM('M', 'F', 'U') DEFAULT 'U' COMMENT '性别',
    status TINYINT DEFAULT 1 COMMENT '状态：1-正常，0-禁用',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_username (username),
    INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

**示例3：外键约束**
```sql
-- 创建部门表
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 创建员工表（带外键）
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    department_id INT,
    salary DECIMAL(10, 2),
    hire_date DATE,
    FOREIGN KEY (department_id) REFERENCES departments(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**如果不存在则创建：**
```sql
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50)
);
```

**复制表结构：**
```sql
-- 只复制结构，不复制数据
CREATE TABLE users_copy LIKE users;

-- 复制结构和数据
CREATE TABLE users_backup AS SELECT * FROM users;

-- 复制部分数据
CREATE TABLE users_active AS 
SELECT * FROM users WHERE status = 1;
```

### 2.3.2 查看表

```sql
-- 查看所有表
SHOW TABLES;

-- 查看表结构
DESC users;
-- 或
DESCRIBE users;
-- 或
SHOW COLUMNS FROM users;

-- 查看表创建语句
SHOW CREATE TABLE users;

-- 查看表状态
SHOW TABLE STATUS LIKE 'users'\G
```

### 2.3.3 修改表

**添加列：**
```sql
-- 添加列到最后
ALTER TABLE users ADD COLUMN address VARCHAR(200);

-- 添加列到第一个位置
ALTER TABLE users ADD COLUMN id_card CHAR(18) FIRST;

-- 添加列到指定位置之后
ALTER TABLE users ADD COLUMN city VARCHAR(50) AFTER address;

-- 添加多列
ALTER TABLE users 
ADD COLUMN province VARCHAR(50),
ADD COLUMN country VARCHAR(50);
```

**修改列：**
```sql
-- 修改列数据类型
ALTER TABLE users MODIFY COLUMN age TINYINT;

-- 修改列名和数据类型
ALTER TABLE users CHANGE COLUMN age user_age INT;

-- 修改列默认值
ALTER TABLE users ALTER COLUMN status SET DEFAULT 1;

-- 删除列默认值
ALTER TABLE users ALTER COLUMN status DROP DEFAULT;
```

**删除列：**
```sql
-- 删除列
ALTER TABLE users DROP COLUMN address;

-- 删除多列
ALTER TABLE users 
DROP COLUMN city,
DROP COLUMN province;
```

**修改表名：**
```sql
-- 方法1
ALTER TABLE users RENAME TO members;

-- 方法2
RENAME TABLE members TO users;

-- 重命名多个表
RENAME TABLE 
    old_table1 TO new_table1,
    old_table2 TO new_table2;
```

**修改表字符集：**
```sql
ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4;
```

**修改表引擎：**
```sql
ALTER TABLE users ENGINE=InnoDB;
```

### 2.3.4 删除表

```sql
-- 删除表
DROP TABLE users;

-- 如果存在则删除
DROP TABLE IF EXISTS users;

-- 删除多个表
DROP TABLE IF EXISTS users, orders, products;
```

### 2.3.5 清空表

```sql
-- 方法1：TRUNCATE（快速，不能回滚）
TRUNCATE TABLE users;

-- 方法2：DELETE（慢，可以回滚）
DELETE FROM users;
```

**TRUNCATE vs DELETE：**

| 特性 | TRUNCATE | DELETE |
|------|----------|--------|
| 速度 | 快 | 慢 |
| 自增ID | 重置为1 | 不重置 |
| 事务回滚 | 不能回滚 | 可以回滚 |
| 触发器 | 不触发 | 触发 |
| WHERE条件 | 不支持 | 支持 |

---

## 2.4 数据类型详解

### 2.4.1 数值类型

#### 整数类型

| 类型 | 字节 | 有符号范围 | 无符号范围 | 用途 |
|------|------|-----------|-----------|------|
| **TINYINT** | 1 | -128 ~ 127 | 0 ~ 255 | 年龄、状态 |
| **SMALLINT** | 2 | -32768 ~ 32767 | 0 ~ 65535 | 小数值 |
| **MEDIUMINT** | 3 | -8388608 ~ 8388607 | 0 ~ 16777215 | 中等数值 |
| **INT** | 4 | -2147483648 ~ 2147483647 | 0 ~ 4294967295 | 常用整数 |
| **BIGINT** | 8 | -2^63 ~ 2^63-1 | 0 ~ 2^64-1 | 大整数 |

**示例：**
```sql
CREATE TABLE number_demo (
    tiny_col TINYINT,                    -- -128 ~ 127
    tiny_unsigned TINYINT UNSIGNED,      -- 0 ~ 255
    small_col SMALLINT,
    int_col INT,
    big_col BIGINT,
    age TINYINT UNSIGNED,                -- 年龄 0-255
    status TINYINT DEFAULT 1             -- 状态
);
```

#### 浮点数和定点数

| 类型 | 字节 | 说明 | 用途 |
|------|------|------|------|
| **FLOAT** | 4 | 单精度浮点数 | 不精确 |
| **DOUBLE** | 8 | 双精度浮点数 | 不精确 |
| **DECIMAL(M,D)** | 变长 | 定点数 | 精确（金额） |

**示例：**
```sql
CREATE TABLE price_demo (
    price1 FLOAT(10, 2),           -- 不推荐用于金额
    price2 DOUBLE(10, 2),          -- 不推荐用于金额
    price3 DECIMAL(10, 2),         -- 推荐用于金额 ⭐
    salary DECIMAL(10, 2)          -- 工资
);

-- 精度问题演示
INSERT INTO price_demo VALUES (1.23, 1.23, 1.23, 10000.50);
SELECT * FROM price_demo;
```

**重要：金额必须使用DECIMAL！**

### 2.4.2 字符串类型

#### 定长和变长字符串

| 类型 | 最大长度 | 说明 | 用途 |
|------|---------|------|------|
| **CHAR(N)** | 255字符 | 定长，不足补空格 | 固定长度（手机号、身份证） |
| **VARCHAR(N)** | 65535字节 | 变长，节省空间 | 变长字符串（姓名、地址） |

**CHAR vs VARCHAR：**
```sql
CREATE TABLE string_demo (
    phone CHAR(11),              -- 手机号固定11位
    id_card CHAR(18),            -- 身份证固定18位
    name VARCHAR(50),            -- 姓名变长
    address VARCHAR(200)         -- 地址变长
);

-- CHAR会补空格
INSERT INTO string_demo (phone) VALUES ('13800138000');
-- 存储：'13800138000'（11字节）

-- VARCHAR不补空格
INSERT INTO string_demo (name) VALUES ('张三');
-- 存储：'张三' + 长度信息（2字符 + 1字节长度）
```

**选择建议：**
- 固定长度 → CHAR（手机号、邮编、MD5）
- 变长 → VARCHAR（姓名、地址、描述）
- 长度差异大 → VARCHAR

#### 文本类型

| 类型 | 最大长度 | 用途 |
|------|---------|------|
| **TINYTEXT** | 255字节 | 短文本 |
| **TEXT** | 65535字节 (64KB) | 文章、评论 |
| **MEDIUMTEXT** | 16MB | 长文章 |
| **LONGTEXT** | 4GB | 超长文本 |

**示例：**
```sql
CREATE TABLE articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200),
    summary TEXT,              -- 摘要
    content MEDIUMTEXT,        -- 正文
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 二进制类型

| 类型 | 最大长度 | 用途 |
|------|---------|------|
| **BINARY(N)** | 255字节 | 定长二进制 |
| **VARBINARY(N)** | 65535字节 | 变长二进制 |
| **BLOB** | 65535字节 | 二进制大对象 |
| **MEDIUMBLOB** | 16MB | 图片、文件 |
| **LONGBLOB** | 4GB | 大文件 |

**注意：** 不推荐在数据库中存储文件，应该存储文件路径。

### 2.4.3 日期和时间类型

| 类型 | 格式 | 范围 | 用途 |
|------|------|------|------|
| **DATE** | YYYY-MM-DD | 1000-01-01 ~ 9999-12-31 | 日期 |
| **TIME** | HH:MM:SS | -838:59:59 ~ 838:59:59 | 时间 |
| **DATETIME** | YYYY-MM-DD HH:MM:SS | 1000-01-01 ~ 9999-12-31 | 日期时间 |
| **TIMESTAMP** | YYYY-MM-DD HH:MM:SS | 1970-01-01 ~ 2038-01-19 | 时间戳 |
| **YEAR** | YYYY | 1901 ~ 2155 | 年份 |

**DATETIME vs TIMESTAMP：**

| 特性 | DATETIME | TIMESTAMP |
|------|----------|-----------|
| 存储空间 | 8字节 | 4字节 |
| 时区 | 不转换 | 自动转换 |
| 范围 | 1000-9999年 | 1970-2038年 |
| 默认值 | 不能自动更新 | 可以自动更新 |

**示例：**
```sql
CREATE TABLE time_demo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    birth_date DATE,                    -- 出生日期
    work_time TIME,                     -- 工作时长
    meeting_time DATETIME,              -- 会议时间
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,              -- 创建时间
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- 更新时间
);

-- 插入数据
INSERT INTO time_demo (birth_date, work_time, meeting_time)
VALUES ('1990-01-01', '08:30:00', '2024-11-01 14:00:00');

-- 查询
SELECT
    birth_date,
    work_time,
    meeting_time,
    create_time,
    update_time
FROM time_demo;
```

**自动时间戳：**
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    -- 创建时自动设置，不会更新
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- 创建和更新时都自动设置
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2.4.4 枚举和集合类型

**ENUM（枚举）：**
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    gender ENUM('M', 'F', 'U') DEFAULT 'U',  -- 性别：男、女、未知
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active'
);

-- 插入数据
INSERT INTO users (name, gender, status)
VALUES ('张三', 'M', 'active');

-- 可以使用索引
INSERT INTO users (name, gender)
VALUES ('李四', 1);  -- 1代表'M'
```

**SET（集合）：**
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    hobbies SET('reading', 'sports', 'music', 'travel')
);

-- 插入数据（可以选择多个）
INSERT INTO users (name, hobbies)
VALUES ('张三', 'reading,sports');

INSERT INTO users (name, hobbies)
VALUES ('李四', 'music,travel,reading');

-- 查询包含某个爱好的用户
SELECT * FROM users WHERE FIND_IN_SET('reading', hobbies);
```

### 2.4.5 JSON类型（MySQL 5.7+）

```sql
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    attributes JSON
);

-- 插入JSON数据
INSERT INTO products (name, attributes) VALUES
('iPhone 15', '{"color": "black", "storage": "256GB", "price": 7999}'),
('MacBook Pro', '{"cpu": "M3", "ram": "16GB", "ssd": "512GB"}');

-- 查询JSON字段
SELECT
    name,
    attributes->'$.color' AS color,
    attributes->'$.price' AS price
FROM products;

-- 更新JSON字段
UPDATE products
SET attributes = JSON_SET(attributes, '$.price', 7499)
WHERE name = 'iPhone 15';
```

---

## 2.5 约束详解

### 2.5.1 主键约束（PRIMARY KEY）

**特点：**
- 唯一标识每一行
- 不能为NULL
- 一个表只能有一个主键
- 自动创建索引

**单列主键：**
```sql
-- 方法1：列级约束
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50)
);

-- 方法2：表级约束
CREATE TABLE users (
    id INT,
    name VARCHAR(50),
    PRIMARY KEY (id)
);
```

**复合主键：**
```sql
CREATE TABLE order_items (
    order_id INT,
    product_id INT,
    quantity INT,
    price DECIMAL(10, 2),
    PRIMARY KEY (order_id, product_id)
);
```

**添加/删除主键：**
```sql
-- 添加主键
ALTER TABLE users ADD PRIMARY KEY (id);

-- 删除主键
ALTER TABLE users DROP PRIMARY KEY;

-- 修改主键（先删除再添加）
ALTER TABLE users DROP PRIMARY KEY;
ALTER TABLE users ADD PRIMARY KEY (id);
```

### 2.5.2 自增约束（AUTO_INCREMENT）

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50)
);

-- 插入数据（id自动增长）
INSERT INTO users (name) VALUES ('张三');
INSERT INTO users (name) VALUES ('李四');

-- 查看当前自增值
SHOW TABLE STATUS LIKE 'users';

-- 修改自增起始值
ALTER TABLE users AUTO_INCREMENT = 1000;

-- 重置自增值
TRUNCATE TABLE users;  -- 重置为1
```

### 2.5.3 非空约束（NOT NULL）

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,      -- 不能为NULL
    email VARCHAR(100),                 -- 可以为NULL
    age INT NOT NULL DEFAULT 0          -- 不能为NULL，默认0
);

-- 添加非空约束
ALTER TABLE users MODIFY COLUMN email VARCHAR(100) NOT NULL;

-- 删除非空约束
ALTER TABLE users MODIFY COLUMN email VARCHAR(100) NULL;
```

### 2.5.4 唯一约束（UNIQUE）

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,  -- 唯一
    email VARCHAR(100) UNIQUE,             -- 唯一，可以为NULL
    phone CHAR(11),
    UNIQUE KEY uk_phone (phone)            -- 表级唯一约束
);

-- 复合唯一约束
CREATE TABLE user_roles (
    user_id INT,
    role_id INT,
    UNIQUE KEY uk_user_role (user_id, role_id)
);

-- 添加唯一约束
ALTER TABLE users ADD UNIQUE KEY uk_email (email);

-- 删除唯一约束
ALTER TABLE users DROP INDEX uk_email;
```

### 2.5.5 默认值约束（DEFAULT）

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    age INT DEFAULT 0,
    status TINYINT DEFAULT 1,
    gender ENUM('M', 'F', 'U') DEFAULT 'U',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加默认值
ALTER TABLE users ALTER COLUMN age SET DEFAULT 18;

-- 删除默认值
ALTER TABLE users ALTER COLUMN age DROP DEFAULT;
```

### 2.5.6 外键约束（FOREIGN KEY）

**创建外键：**
```sql
-- 父表
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

-- 子表
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
) ENGINE=InnoDB;
```

**外键约束选项：**
```sql
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
        ON DELETE CASCADE      -- 删除父表记录时，删除子表记录
        ON UPDATE CASCADE      -- 更新父表记录时，更新子表记录
) ENGINE=InnoDB;
```

**外键约束动作：**

| 动作 | 说明 |
|------|------|
| **CASCADE** | 级联操作（删除/更新父表时，同步子表） |
| **SET NULL** | 设置为NULL |
| **RESTRICT** | 拒绝操作（默认） |
| **NO ACTION** | 不做任何操作 |

**添加/删除外键：**
```sql
-- 添加外键
ALTER TABLE employees
ADD CONSTRAINT fk_dept
FOREIGN KEY (department_id) REFERENCES departments(id);

-- 删除外键
ALTER TABLE employees DROP FOREIGN KEY fk_dept;

-- 查看外键
SHOW CREATE TABLE employees;
```

**注意：** 生产环境中，外键约束可能影响性能，很多公司不使用外键，而是在应用层保证数据一致性。

### 2.5.7 检查约束（CHECK）- MySQL 8.0+

```sql
-- MySQL 8.0支持CHECK约束
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    age INT CHECK (age >= 0 AND age <= 150),
    email VARCHAR(100) CHECK (email LIKE '%@%')
);

-- MySQL 5.7不支持CHECK，可以使用触发器实现
```

---

## 2.6 字符集和排序规则

### 2.6.1 字符集（Character Set）

**常用字符集：**

| 字符集 | 说明 | 每字符字节数 |
|--------|------|-------------|
| **latin1** | 西欧字符集 | 1 |
| **gbk** | 简体中文 | 2 |
| **utf8** | Unicode（最多3字节） | 1-3 |
| **utf8mb4** | Unicode（最多4字节）⭐ 推荐 | 1-4 |

**utf8 vs utf8mb4：**
- **utf8**：最多3字节，不支持emoji和部分生僻字
- **utf8mb4**：最多4字节，支持emoji ⭐ 推荐使用

**查看字符集：**
```sql
-- 查看支持的字符集
SHOW CHARACTER SET;

-- 查看当前字符集
SHOW VARIABLES LIKE 'character%';

-- 查看数据库字符集
SHOW CREATE DATABASE mydb;

-- 查看表字符集
SHOW CREATE TABLE users;
```

**设置字符集：**
```sql
-- 服务器级别（my.cnf）
[mysqld]
character-set-server=utf8mb4

-- 数据库级别
CREATE DATABASE mydb CHARACTER SET utf8mb4;
ALTER DATABASE mydb CHARACTER SET utf8mb4;

-- 表级别
CREATE TABLE users (
    id INT,
    name VARCHAR(50)
) CHARACTER SET utf8mb4;

ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4;

-- 列级别
CREATE TABLE users (
    id INT,
    name VARCHAR(50) CHARACTER SET utf8mb4
);
```

### 2.6.2 排序规则（Collation）

**常用排序规则：**

| 排序规则 | 说明 |
|---------|------|
| **utf8mb4_general_ci** | 不区分大小写，性能好 |
| **utf8mb4_unicode_ci** | 不区分大小写，准确性好 ⭐ 推荐 |
| **utf8mb4_bin** | 区分大小写，二进制比较 |

**查看排序规则：**
```sql
-- 查看支持的排序规则
SHOW COLLATION LIKE 'utf8mb4%';

-- 查看当前排序规则
SHOW VARIABLES LIKE 'collation%';
```

**设置排序规则：**
```sql
-- 数据库级别
CREATE DATABASE mydb
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- 表级别
CREATE TABLE users (
    id INT,
    name VARCHAR(50)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 列级别
CREATE TABLE users (
    id INT,
    name VARCHAR(50) COLLATE utf8mb4_bin  -- 区分大小写
);
```

**排序规则影响：**
```sql
-- 创建测试表
CREATE TABLE test (
    name VARCHAR(50)
) COLLATE utf8mb4_general_ci;

INSERT INTO test VALUES ('ABC'), ('abc'), ('Abc');

-- 不区分大小写查询
SELECT * FROM test WHERE name = 'abc';
-- 返回所有3条记录

-- 如果使用utf8mb4_bin
ALTER TABLE test COLLATE utf8mb4_bin;
SELECT * FROM test WHERE name = 'abc';
-- 只返回1条记录
```

---

## 2.7 存储引擎

### 2.7.1 查看存储引擎

```sql
-- 查看支持的存储引擎
SHOW ENGINES;

-- 查看默认存储引擎
SHOW VARIABLES LIKE 'default_storage_engine';

-- 查看表的存储引擎
SHOW TABLE STATUS LIKE 'users';
```

### 2.7.2 指定存储引擎

```sql
-- 创建表时指定
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50)
) ENGINE=InnoDB;

-- 修改表的存储引擎
ALTER TABLE users ENGINE=MyISAM;
```

**常用存储引擎：**
- **InnoDB**：默认引擎，支持事务、外键 ⭐ 推荐
- **MyISAM**：不支持事务，查询速度快
- **Memory**：内存表，速度快但数据易丢失

详细内容见：[第07章：存储引擎](/mysql/02/07.html)

---

## 2.8 实战练习

### 练习1：创建电商数据库

```sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS shop
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE shop;

-- 用户表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone CHAR(11),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone)
) ENGINE=InnoDB COMMENT='用户表';

-- 商品分类表
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    parent_id INT DEFAULT 0,
    sort_order INT DEFAULT 0,
    INDEX idx_parent (parent_id)
) ENGINE=InnoDB COMMENT='商品分类表';

-- 商品表
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    category_id INT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    description TEXT,
    status TINYINT DEFAULT 1,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category_id),
    INDEX idx_price (price)
) ENGINE=InnoDB COMMENT='商品表';

-- 订单表
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_no VARCHAR(50) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'paid', 'shipped', 'completed', 'cancelled') DEFAULT 'pending',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB COMMENT='订单表';

-- 订单明细表
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB COMMENT='订单明细表';
```

### 练习2：修改表结构

```sql
-- 1. 给users表添加地址字段
ALTER TABLE users ADD COLUMN address VARCHAR(200);

-- 2. 修改phone字段为非空
ALTER TABLE users MODIFY COLUMN phone CHAR(11) NOT NULL;

-- 3. 给products表添加销量字段
ALTER TABLE products ADD COLUMN sales INT DEFAULT 0 AFTER stock;

-- 4. 创建索引
CREATE INDEX idx_sales ON products(sales);

-- 5. 修改订单表，添加收货地址
ALTER TABLE orders ADD COLUMN shipping_address VARCHAR(200);
```

---

## 2.9 小结

本章学习了DDL数据定义语言：

- ✅ 数据库的创建、修改、删除
- ✅ 数据表的创建、修改、删除
- ✅ 所有数据类型及使用场景
- ✅ 各种约束的使用
- ✅ 字符集和排序规则
- ✅ 存储引擎的选择

**重点掌握：**
1. 数据类型的选择（金额用DECIMAL，日期用TIMESTAMP）
2. 字符集使用utf8mb4
3. 主键、唯一、非空约束
4. 自动时间戳的使用

**下一章预告：** SQL基础 - DML数据操作语言

---

## 练习题

1. 创建一个博客系统的数据库，包含用户表、文章表、评论表
2. 为表添加合适的约束和索引
3. 使用utf8mb4字符集
4. 设置自动时间戳字段
5. 练习修改表结构的各种操作

**继续学习：** [第03章：SQL基础-DML](/mysql/01/03-sql-dml.html)
