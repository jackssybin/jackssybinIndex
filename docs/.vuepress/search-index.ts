export const searchIndex = [
  {
    "title": "老博客静态化迁移实战",
    "url": "/articles/2026/05/28/zhihu-bolo-to-vuepress-migration.html",
    "type": "blog",
    "date": "2026-05-28",
    "topic": "工具、效率与博客建设",
    "topicSlug": "tools-blog",
    "core": true,
    "priority": 80,
    "readingOrder": 10,
    "tags": [
      "VuePress",
      "Bolo",
      "Solo",
      "静态网站",
      "博客迁移"
    ],
    "excerpt": "这篇文章适合作为本站建设路线的入口，重点看如何把 Solo/Bolo 的数据库、皮肤、旧链接和静态站构建流程拆开处理。",
    "guide": "核心文章：这篇文章适合作为本站建设路线的入口，重点看如何把 Solo/Bolo 的数据库、皮肤、旧链接和静态站构建流程拆开处理。",
    "content": "先说背景：我手上有一个运行多年的个人博客 jackssybin.cn，原来是 Solo/Bolo 系统，通过 Tomcat 部署，数据在 MySQL 里。后来我希望把它迁成一个更轻、更容易维护的静态站：文章继续保留，旧链接尽量不失效，样式尽量接近原站，但不再依赖 Tomcat、后台和数据库服务。 这篇文章记录的是一次完整迁移过程。不是泛泛而谈“把博客迁到静态站”，而是把一个真实的 Solo/Bolo 项目拆开，迁移到 VuePress 2 + vuepressthemehope，并保留原站文章、标签、归档、友情链接、RSS 和旧评论归档。 最后得到的效果大概是这样： 1. 原数据库备份 bolo260527.sql 作为内容来源； 2. 原 Tomcat 项目 ROOT/ 作为样式和静态资源来源； 3. 新项目用 VuePress 构建； 4. 构建产物是纯静态文件，可部署到 Vercel、Render、Netlify、Cloudflare Pages 等平台； 5. 原文章链接，例如 /articles/2019/07/31/1564568923421.html，尽量保持可访问。 下面按实际迁移顺序展开。 一、为什么不继续部署 Solo/Bolo？ Solo/Bolo 本身是一个完整博客系统，有后台、评论、皮肤、插件和动态渲染能力。问题是，对于一个长期沉淀型的个人技术博客来说，它的运行成本有点高： 需要维护 Tomcat 或 Java Web 容器； 需要维护 MySQL； 需要关心后台安全、登录、评论提交和运行时依赖； 迁移部署时不仅要搬代码，还要搬数据库和运行环境； 长期只读内容越来越多，动态能力反而没那么重要。 而静态站的优势很直接： 构建一次，发布一批 HTML/CSS/JS 文件； 部署平台选择多； 没有后台攻击面； 内容可以版本化； 后续写文章只需要维护 Markdown 或迁移脚本。 所以这次迁移的目标不是“重装 Solo”，而是把老博客内容迁到一个静态站里。 二、迁移前要准备什么？ 我手上有两类文件： 它们分别承担不同角色。 1. bolo260527.sql 这是 Solo/Bolo 的 MySQL 数据库备份，是文章、评论、标签、配置、友情链接的主要来源。 核心表包括： 实际导入后，我检查到的数据量是： 迁移时只导出 articleStatus = 0 的已发布文章。 2. ROOT/ 这是原 Tomcat 部署项目。它里面有后台、JAR、FreeMarker 模板、皮肤和静态资源。 这次并不迁移整个 Tomcat 项目，只取里面的皮肤和资源： 这些文件的价值是：它们能告诉我们原站的 HTML 结构和视觉风格。 比如原站首页是典型的： 顶部深灰横幅； 博客名 + 副标题； 横向导航； 主内容文章列表； 右侧标签、统计、评论最多、访问最多模块； 文章卡片有标题、时间、标签和“阅读全文”。 3. zeroStep.md 这是新站搭建说明，目标技术栈是： 也就是说，新站不是继续跑 Java Web，而是改成 VuePress 静态站。 三、初始化 VuePress 项目 项目根目录新建 package.json： text scripts/migratefrombolo.mjs js const dbConfig = { host: process.env.BOLODBHOST || \"127.0.0.1\", port: Number(process.env.BOLODBPORT || 3306), user: process.env.BOLODBUSER || \"root\", password: process.env.BOLODBPASSWORD || \"root1234\", database: process.env.BOLODBNAME || \"bolomigration\", charset: \"utf8mb4\" }; powershell $env:BOLODBNAME=\"yourdatabase\" pnpm migrate text Duplicate attribute. SyntaxError: Duplicate attribute. vue md title: \"文章标题\" permalink: \"/articles/2019/07/31/1564568923421.html\" text ROOT/skins/bolo9IPHP/css/base.css ROOT/skins/bolo9IPHP/css/fonts/ ROOT/images/ text docs/.vuepress/public/assets/solobase.css docs/.vuepress/public/assets/fonts/ docs/.vuepress/public/images/ ts head: [ [\"link\", { rel: \"stylesheet\", href: \"/assets/solobase.css\" }], [\"link\", { rel: \"stylesheet\", href: \"/assets/site.css\" }] ] scss html, html[datatheme=\"dark\"], body, app, .themecontainer { color: 333 !important; background: fff !important; colorscheme: light !important; } .vppagetitle, .vpbreadcrumb, .vppagemeta, .vptoc, .vpsidebar, .vpnavbar, .vpfooterwrapper { display: none !important; } scss @media (maxwidth: 760px) { .solostatic .wrapper { minwidth: 0; width: 94%; } .solostatic .mainwrap { display: block; } .solostatic aside { margintop: 18px; minwidth: 0; width: auto; } } text / 首页 /page/2.html 首页分页 /articles/yyyy/mm/dd/id.html 文章页 /mygithubrepos 自定义页面 /tags.html 标签墙 /tags/ 标签文章列表 /archives.html 归档页 /archives/yyyy/mm 月份归档 /links.html 友情链接 /rss.xml RSS text articleListDisplayCount = 20 powershell pnpm migrate text Generated 103 articles, 12 comments, 150 used tags, 3 links. text docs/.vuepress/public/migrationsummary.json json { \"articles\": 103, \"publishedArticles\": 103, \"comments\": 12, \"tags\": 157, \"usedTags\": 150, \"pages\": 2, \"links\": 3 } powershell pnpm dev port 8080 text http://localhost:8080/ text / /articles/2025/07/16/1752652246705.html /articles/2019/07/31/1564568923421.html /mygithubrepos /tags.html /archives.html /links.html /rss.xml powershell pnpm build text docs/.vuepress/dist text INVALIDANNOTATION Some chunks are larger than 1024 kB text Build Command: pnpm build Publish Directory: docs/.vuepress/dist Node.js Version: 22 text pnpm install frozenlockfile && pnpm migrate && pnpm build text 反斜杠 单引号 双引号 HTML 标签 多行字符串 特殊 Unicode 字符 text defaultcharacterset=utf8mb4 sql DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4bin text /articles/yyyy/mm/dd/id.html text . ├─ bolo260527.sql ├─ ROOT/ ├─ README.md ├─ package.json ├─ scripts/ │ └─ migratefrombolo.mjs └─ docs/ ├─ .vuepress/ │ ├─ config.ts │ ├─ theme.ts │ ├─ client.ts │ ├─ components/ │ │ └─ SoloPage.vue │ ├─ styles/ │ │ └─ index.scss │ ├─ pagedata.ts │ └─ publ"
  },
  {
    "title": "LocalDateTime操作",
    "url": "/articles/2025/07/16/1752652246705.html",
    "type": "blog",
    "date": "2025-07-16",
    "topic": "Java 与 JVM",
    "topicSlug": "java-jvm",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "LocalDateTime",
      "Duration",
      "时间操作"
    ],
    "excerpt": "1.LocalDateTime时间转换 import java.time.LocalDateTime; import java.time.format.DateTimeFormatter; ​ public class DateTimeConversionExample { public static void mai...",
    "guide": "本文归入「Java 与 JVM」专题，主要记录：1.LocalDateTime时间转换 import java.time.LocalDateTime; import java.time.format.DateTimeFormatter; ​ public class DateTimeConversionExample { public static void mai...",
    "content": "1.LocalDateTime时间转换 import java.time.LocalDateTime; import java.time.format.DateTimeFormatter; ​ public class DateTimeConversionExample { public static void main(String[] args) { // 获取当前日期时间 LocalDateTime now = LocalDateTime.now(); // 方法1：使用预定义格式器 DateTimeFormatter isoFormatter = DateTimeFormatter.ISOLOCALDATETIME; String isoString = now.format(isoFormatter); System.out.println(\"ISO格式: \" + isoString); // 方法2：自定义格式 DateTimeFormatter customFormatter = DateTimeFormatter.ofPattern(\"yyyyMMdd HH:.... 1.LocalDateTime时间转换 2.DateTimeUtils操作时间 3.完整LocalDateTime使用场景和用法 关键场景说明： 1. 获取当前时间 LocalDateTime.now() 获取系统当前日期时间 2. 创建指定时间 LocalDateTime.of() 创建精确到分钟的时间对象 3. 日期时间转字符串 使用 DateTimeFormatter 自定义格式（如 \"yyyyMMdd HH:mm:ss\"） 4. 字符串转日期时间 LocalDateTime.parse() 配合格式化器解析字符串 5. 日期时间加减 plusDays(), minusHours() 等方法进行时间运算 6. 获取时间单位 getYear(), getMonth() 等方法提取时间分量 7. 时间比较 isBefore(), isAfter() 方法比较时间先后 8. 计算时间间隔 Duration.between() 计算两个时间的差值 9. 时区转换 通过 atZone() 和 withZoneSameInstant() 处理时区 10. 与传统Date互转 通过 Instant 对象实现与旧版Date的转换 高级用法： 最佳实践（注意事项）： 1. 时区处理：始终明确时区，避免隐式使用系统默认时区 2. 不可变性：所有操作返回新对象，原对象不变 3. 线程安全：LocalDateTime 是线程安全的类 4. 格式化重用：复用 DateTimeFormatter 实例提升性能 5. 空值处理：使用 Optional 包装可能为空的日期时间值"
  },
  {
    "title": "MySQL RR 隔离级别锁测试",
    "url": "/articles/2021/06/08/1623116860957.html",
    "type": "blog",
    "date": "2021-06-08",
    "topic": "MySQL 与数据架构",
    "topicSlug": "mysql-data",
    "core": true,
    "priority": 80,
    "readingOrder": 10,
    "tags": [
      "MySQL",
      "死锁",
      "间隙锁",
      "加锁"
    ],
    "excerpt": "这篇文章是 MySQL 事务与锁专题的核心实验记录，适合用来理解 RR 隔离级别下非索引更新、删除操作为什么会扩大锁范围。",
    "guide": "核心文章：这篇文章是 MySQL 事务与锁专题的核心实验记录，适合用来理解 RR 隔离级别下非索引更新、删除操作为什么会扩大锁范围。",
    "content": "============================================================================== 按照非索引列更新 在可重复读的事务隔离级别下，在非索引列上进行更新和删除会对所有数据行进行加锁，阻止其他会话对边进行任何数据的增删改操作。 如果更新或删除条件为c3=4且c3列上没有索引则： 不允许其他会话插入任意记录，因为所有记录的主键索引上存在X排他锁，无法申请插入意向X锁（lockmode X insert intention waiting Record lock） 不允许其他会话删除任意记录，因为所有记录的主键索引上存在X排他锁 不允许其他会话更新任意记录。因为所有记录的主键索引上存在X排他锁 ========================================= 测试数据： CREATE TABLE tb4001 ( id bigint(20) NOT NULL AUTOINCREMENT, c1 int(11) DEFAULT NULL, c2 varchar(200) DEFAULT N.... ============================================================================== 按照非索引列更新 在可重复读的事务隔离级别下，在非索引列上进行更新和删除会对所有数据行进行加锁，阻止其他会话对边进行任何数据的增删改操作。 如果更新或删除条件为c3=4且c3列上没有索引则： 1. 不允许其他会话插入任意记录，因为所有记录的主键索引上存在X排他锁，无法申请插入意向X锁（lockmode X insert intention waiting Record lock） 2. 不允许其他会话删除任意记录，因为所有记录的主键索引上存在X排他锁 3. 不允许其他会话更新任意记录。因为所有记录的主键索引上存在X排他锁 ========================================= 测试数据： CREATE TABLE tb4001 ( id bigint(20) NOT NULL AUTOINCREMENT, c1 int(11) DEFAULT NULL, c2 varchar(200) DEFAULT NULL, c3 int(11) DEFAULT NULL, PRIMARY KEY (id), KEY idxc1 (c1) ) ENGINE=InnoDB AUTOINCREMENT=1 DEFAULT CHARSET=utf8; insert into tb4001(c1,c2,c3) values(2,2,2); insert into tb4001(c1,c2,c3) values(4,4,4); insert into tb4001(c1,c2,c3) values(7,7,7); insert into tb4001(c1,c2,c3) values(8,8,8); ========================================= 测试1：在没有索引的列上更新 事务隔离级别：RR 会话1： SET SESSION txisolation='REPEATABLEREAD'; START TRANSACTION; SELECT @@GLOBAL.txisolation, @@SESSION.txisolation; update tb4001 set c2=777 where c3=7; ========================================= 会话2: SET SESSION txisolation='REPEATABLEREAD'; START TRANSACTION; SELECT @@GLOBAL.txisolation, @@SESSION.txisolation; insert into tb4001(c1,c2,c3) values(9,9,9); 执行结果：会话2被阻塞 使用SHOW ENGINE INNODB STATUS \\G查看阻塞发生时的锁信息 TRX HAS BEEN WAITING 13 SEC FOR THIS LOCK TO BE GRANTED: RECORD LOCKS space id 75 page no 3 n bits 80 index PRIMARY of table test1.tb4001 trx id 10573 lockmode X insert intention waiting Record lock, heap no 1 PHYSICAL RECORD: nfields 1; compact format; info bits 0 0: len 8; hex 73757072656d756d; asc supremum;; TRANSACTION 10571, ACTIVE 404 sec 2 lock struct(s), heap size 1136, 5 row lock(s), undo log entries 1 MySQL thread id 52, OS thread handle 140674621650688, query id 1201 127.0.0.1 admin ========================================= 会话2: SET SESSION txisolation='REPEATABLEREAD'; START TRANSACTION; SELECT @@GLOBAL.txisolation, @@SESSION.txisolation; update tb4001 set c2=888 where c3=8; 执行结果：会话2被阻塞 使用SHOW ENGINE INNODB STATUS \\G查看阻塞发生时的锁信息 TRX HAS BEEN WAITING 5 SEC FOR THIS LOCK TO BE GRANTED: RECORD LOCKS space id 75 page no 3 n bits 80 index PRIMARY of table test1.tb4001 trx id 10573 lockmode X waiting Record lock, heap no 2 PHYSICAL RECORD: nfields 6; compact format; info bits 0 0: len 8; hex 8000000000000001; asc ;; 1: len 6; hex 00000000293c; asc ) 4的记录，但不允许插入c1=4的记录 2. 允许其他会话更新c1<4的记录，但不允许将记录更新为c1=4的记录 3. 允许其他会话删除c1<4的记录。 4. 允许插入\\删除\\修改在c1列索引上与c1=4相邻的记录，虽然操作会影响gap锁的边界值。 ========================================= 测试数据： CREATE TABLE tb4001 ( id bigint(20) NOT NULL AUTOINCREMENT, c1 int(11) DEFAULT NULL, c2 varchar(200) DEFAULT NULL, c3 int(11) DEFAULT NULL, PRIMARY KEY (id), KEY idxc1 (c1) ) ENGINE=InnoDB AUTOINCREMENT=1 DEFAULT CHARSET=utf8; insert into tb4001(c1,c2,c3) values(2,2,2); insert into tb4001(c1,c2,c3) values(4,4,4); insert into tb4001(c1,c2,c3) values(7,7,7); insert into tb4001(c1,c2,c3) values(8,8,8); ========================================= 测试1：在没有索引的列上更新 事务隔离级别：RR 会话1： SET SESSION txisolation='REPEATABLEREAD'; START TRANSACTION; SELECT @@GLOBAL.txisolation, @@SESSION.txisolation; update tb4001 set c2=777 where c1=7; ========================================= 会话2: begin; SET SESSION txisolation='REPEATABLEREAD'; START TRANSACTION; SELECT @@GLOBAL.txisolation, @@SESSION.txisolation; insert into tb4001(c1,c2,c3) values(9,9,9); 会话2未被阻塞成功执行 ========================================= 会话2: SET SESSION txisolation='REPEATABLEREAD'; START TRANSACTION; SELECT @@GLOBAL.txisolation, @"
  },
  {
    "title": "Spring Boot 启动扩展点",
    "url": "/articles/2021/05/14/1620960509044.html",
    "type": "blog",
    "date": "2021-05-14",
    "topic": "Spring Boot 与后端框架",
    "topicSlug": "spring-backend",
    "core": true,
    "priority": 80,
    "readingOrder": 10,
    "tags": [
      "springboot自动扩展",
      "BeanFactoryAware"
    ],
    "excerpt": "这篇文章是 Spring Boot 专题的核心长文，适合系统梳理 Bean 生命周期、容器刷新过程和自动装配前后的扩展点。",
    "guide": "核心文章：这篇文章是 Spring Boot 专题的核心长文，适合系统梳理 Bean 生命周期、容器刷新过程和自动装配前后的扩展点。",
    "content": "1.背景 Spring的核心思想就是容器，当容器refresh的时候，外部看上去风平浪静，其实内部则是一片惊涛骇浪，汪洋一片。Springboot更是封装了Spring，遵循约定大于配置，加上自动装配的机制。很多时候我们只要引用了一个依赖，几乎是零配置就能完成一个功能的装配。 我非常喜欢这种自动装配的机制，所以在自己开发中间件和公共依赖工具的时候也会用到这个特性。让使用者以最小的代价接入。想要把自动装配玩的转，就必须要了解spring对于bean的构造生命周期以及各个扩展接口。当然了解了bean的各个生命周期也能促进我们加深对spring的理解。业务代码也能合理利用这些扩展点写出更加漂亮的代码。 在网上搜索spring扩展点，发现很少有博文说的很全的，只有一些常用的扩展点的说明。 所以在这篇文章里，我总结了几乎Spring &amp; Springboot所有的扩展接口，以及各个扩展点的使用场景。并且整理出了一个bean在spring内部从被加载到最后初始化完成所有可扩展点的顺序调用图。从而我们也能窥探到bean是如何一步步加载到spring容器中的。 2.可扩展的接口启动调用顺序图 .... 1.背景 Spring的核心思想就是容器，当容器refresh的时候，外部看上去风平浪静，其实内部则是一片惊涛骇浪，汪洋一片。Springboot更是封装了Spring，遵循约定大于配置，加上自动装配的机制。很多时候我们只要引用了一个依赖，几乎是零配置就能完成一个功能的装配。 我非常喜欢这种自动装配的机制，所以在自己开发中间件和公共依赖工具的时候也会用到这个特性。让使用者以最小的代价接入。想要把自动装配玩的转，就必须要了解spring对于bean的构造生命周期以及各个扩展接口。当然了解了bean的各个生命周期也能促进我们加深对spring的理解。业务代码也能合理利用这些扩展点写出更加漂亮的代码。 在网上搜索spring扩展点，发现很少有博文说的很全的，只有一些常用的扩展点的说明。 所以在这篇文章里，我总结了几乎Spring & Springboot所有的扩展接口，以及各个扩展点的使用场景。并且整理出了一个bean在spring内部从被加载到最后初始化完成所有可扩展点的顺序调用图。从而我们也能窥探到bean是如何一步步加载到spring容器中的。 2.可扩展的接口启动调用顺序图 以下是我整理的spring容器中Bean的生命周期内所有可扩展的点的调用顺序，下面会一个个分析 3.ApplicationContextInitializer org.springframework.context.ApplicationContextInitializer 这是整个spring容器在刷新之前初始化ConfigurableApplicationContext的回调接口，简单来说，就是在容器刷新之前调用此类的initialize方法。这个点允许被用户自己扩展。用户可以在整个spring容器还没被初始化之前做一些事情。 可以想到的场景可能为，在最开始激活一些配置，或者利用这时候class还没被类加载器加载的时机，进行动态字节码注入等操作。 扩展方式为： 因为这时候spring容器还没被初始化，所以想要自己的扩展的生效，有以下三种方式： 在启动类中用springApplication.addInitializers(new TestApplicationContextInitializer())语句加入 配置文件配置context.initializer.classes=com.example.demo.TestApplicationContextInitializer Spring SPI扩展，在spring.factories中加入org.springframework.context.ApplicationContextInitializer=com.example.demo.TestApplicationContextInitializer 4.BeanDefinitionRegistryPostProcessor org.springframework.beans.factory.support.BeanDefinitionRegistryPostProcessor 这个接口在读取项目中的beanDefinition之后执行，提供一个补充的扩展点 使用场景：你可以在这里动态注册自己的beanDefinition，可以加载classpath之外的bean 扩展方式为: 5.BeanFactoryPostProcessor org.springframework.beans.factory.config.BeanFactoryPostProcessor 这个接口是beanFactory的扩展接口，调用时机在spring在读取beanDefinition信息之后，实例化bean之前。 在这个时机，用户可以通过实现这个扩展接口来自行处理一些东西，比如修改已经注册的beanDefinition的元信息。 扩展方式为： 6.InstantiationAwareBeanPostProcessor org.springframework.beans.factory.config.InstantiationAwareBeanPostProcessor 该接口继承了BeanPostProcess接口，区别如下： BeanPostProcess接口只在bean的初始化阶段进行扩展（注入spring上下文前后），而InstantiationAwareBeanPostProcessor接口在此基础上增加了3个方法，把可扩展的范围增加了实例化阶段和属性注入阶段。 该类主要的扩展点有以下5个方法，主要在bean生命周期的两大阶段：实例化阶段和初始化阶段，下面一起进行说明，按调用顺序为： postProcessBeforeInstantiation：实例化bean之前，相当于new这个bean之前 postProcessAfterInstantiation：实例化bean之后，相当于new这个bean之后 postProcessPropertyValues：bean已经实例化完成，在属性注入时阶段触发，@Autowired,@Resource等注解原理基于此方法实现 postProcessBeforeInitialization：初始化bean之前，相当于把bean注入spring上下文之前 postProcessAfterInitialization：初始化bean之后，相当于把bean注入spring上下文之后 使用场景：这个扩展点非常有用 ，无论是写中间件和业务中，都能利用这个特性。比如对实现了某一类接口的bean在各个生命期间进行收集，或者对某个类型的bean进行统一的设值等等。 扩展方式为： 7.SmartInstantiationAwareBeanPostProcessor org.springframework.beans.factory.config.SmartInstantiationAwareBeanPostProcessor 该扩展接口有3个触发点方法： predictBeanType：该触发点发生在postProcessBeforeInstantiation之前(在图上并没有标明，因为一般不太需要扩展这个点)，这个方法用于预测Bean的类型，返回第一个预测成功的Class类型，如果不能预测返回null；当你调用BeanFactory.getType(name)时当通过bean的名字无法得到bean类型信息时就调用该回调方法来决定类型信息。 determineCandidateConstructors：该触发点发生在postProcessBeforeInstantiation之后，用于确定该bean的构造函数之用，返回的是该bean的所有构造函数列表。用户可以扩展这个点，来自定义选择相应的构造器来实例化这个bean。 getEarlyBeanReference：该触发点发生在postProcessAfterInstantiation之后，当有循环依赖的场景，当bean实例化好之后，为了防止有循环依赖，会提前暴露回调方法，用于bean实例化的后置处理。这个方法就是在提前暴露的回调方法中触发。 扩展方式为： 8.BeanFactoryAware org.springframework.beans.factory.BeanFactoryAware 这个类只有一个触发点，发生在bean的实例化之后，注入属性之前，也就是Setter之前。这个类的扩展点方法为setBeanFactory，可以拿到BeanFactory这个属性。 使用场景为，你可以在bean实例化之后，但还未初始化之前，拿到 BeanFactory，在这个时候，可以对每个bean作特殊化的定制。也或者可以把BeanFactory拿到进行缓存，日后使用。 扩展方式为： 9.ApplicationContextAwareProcessor org.springframework.context.support.ApplicationContextAwareProcessor 该类本身并没有扩展点，但是该类内部却有6个扩展点可供实现 ，这些类触发的时机在bean实例化之后，初始化之前 可以看到，该类用于执行各种驱动接口，在bean实例化之后，属性填充之后，通过执行以上红框标出的扩展接口，来获取对应容器的变量。所以这里应该来说是"
  },
  {
    "title": "使用@ConditionalOnExpression决定是否生效",
    "url": "/articles/2021/04/21/1618973105136.html",
    "type": "blog",
    "date": "2021-04-21",
    "topic": "Spring Boot 与后端框架",
    "topicSlug": "spring-backend",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Spring Batch"
    ],
    "excerpt": "@ConditionalOnExpression 根据表达式选择性加载 @ConditionalOnProperty 根据配置选择性加载 消费者总开关，0关1开 mq.cumsumer.enabled=1 rocketmq消费者开关，true开启，false关闭 rocketmq.comsumer.enabled=fa...",
    "guide": "本文归入「Spring Boot 与后端框架」专题，主要记录：@ConditionalOnExpression 根据表达式选择性加载 @ConditionalOnProperty 根据配置选择性加载 消费者总开关，0关1开 mq.cumsumer.enabled=1 rocketmq消费者开关，true开启，false关闭 rocketmq.comsumer.enabled=fa...",
    "content": "@ConditionalOnExpression 根据表达式选择性加载 @ConditionalOnProperty 根据配置选择性加载 消费者总开关，0关1开 mq.cumsumer.enabled=1 rocketmq消费者开关，true开启，false关闭 rocketmq.comsumer.enabled=false rabbitmq消费者开关，true开启，false关闭 rabbitmq.comsumer.enabled=true 消费者选择 mq.comsumer=rabbitmq //布尔值和数字 @Component @RabbitListener(queues = \"monitorDataQueue\") @ConditionalOnExpression(\"${mq.cumsumer.enabled:0}==1&amp;&amp;${rabbitmq.comsumer.enabled:false}\") //字符串 @Component @RabbitListener(queues = \"monitorDataQueue\") @ConditionalOnExp.... @ConditionalOnExpression 根据表达式选择性加载 @ConditionalOnProperty 根据配置选择性加载 //布尔值和数字 @Component @RabbitListener(queues = \"monitorDataQueue\") @ConditionalOnExpression(\"${mq.cumsumer.enabled:0}==1&&${rabbitmq.comsumer.enabled:false}\") //字符串 @Component @RabbitListener(queues = \"monitorDataQueue\") @ConditionalOnExpression(\"'${mq.comsumer}'.equals('rabbitmq')\") // 直接使用boolean 的校验 // spring.batch.job.enabled = true @ConditionalOnProperty(prefix = \"spring.batch.job\", name = \"enabled\", havingValue = \"true\", matchIfMissing = true)"
  },
  {
    "title": "springBatch监控相关",
    "url": "/articles/2021/04/21/1618967915021.html",
    "type": "blog",
    "date": "2021-04-21",
    "topic": "Spring Boot 与后端框架",
    "topicSlug": "spring-backend",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Spring Batch",
      "prometheus",
      "自定义监控"
    ],
    "excerpt": "Spring Boot Actuator可以帮助你监控和管理Spring Boot应用，比如健康检查、审计、统计和HTTP追踪等。所有的这些特性可以通过JMX或者HTTP endpoints来获得。 Actuator同时还可以与外部应用监控系统整合，比如 Prometheus, Graphite, DataDog, I...",
    "guide": "本文归入「Spring Boot 与后端框架」专题，主要记录：Spring Boot Actuator可以帮助你监控和管理Spring Boot应用，比如健康检查、审计、统计和HTTP追踪等。所有的这些特性可以通过JMX或者HTTP endpoints来获得。 Actuator同时还可以与外部应用监控系统整合，比如 Prometheus, Graphite, DataDog, I...",
    "content": "Spring Boot Actuator可以帮助你监控和管理Spring Boot应用，比如健康检查、审计、统计和HTTP追踪等。所有的这些特性可以通过JMX或者HTTP endpoints来获得。 Actuator同时还可以与外部应用监控系统整合，比如 Prometheus, Graphite, DataDog, Influx, Wavefront, New Relic等。这些系统提供了非常好的仪表盘、图标、分析和告警等功能，使得你可以通过统一的接口轻松的监控和管理你的应用。 Actuator使用Micrometer来整合上面提到的外部应用监控系统。这使得只要通过非常小的配置就可以集成任何应用监控系统。 预备知识: | 监控 | micrometer | actuator | promethes | | | | | | | 概念 | 类似slf4j门面模式。提供接口和方法 | 调用micrometer对springboot体系提供了健康检查，对spring体系的扩展。也可以自定义监控。 | 监控的一类客户端。获取的数据格式需要定制化。micrometer有单独的门面扩.... Spring Boot Actuator可以帮助你监控和管理Spring Boot应用，比如健康检查、审计、统计和HTTP追踪等。所有的这些特性可以通过JMX或者HTTP endpoints来获得。 Actuator同时还可以与外部应用监控系统整合，比如 Prometheus, Graphite, DataDog, Influx, Wavefront, New Relic等。这些系统提供了非常好的仪表盘、图标、分析和告警等功能，使得你可以通过统一的接口轻松的监控和管理你的应用。 Actuator使用Micrometer来整合上面提到的外部应用监控系统。这使得只要通过非常小的配置就可以集成任何应用监控系统。 预备知识: | 监控 | micrometer | actuator | promethes | | | | | | | 概念 | 类似slf4j门面模式。提供接口和方法 | 调用micrometer对springboot体系提供了健康检查，对spring体系的扩展。也可以自定义监控。 | 监控的一类客户端。获取的数据格式需要定制化。micrometer有单独的门面扩展包 | 1.配置pom 2. 配置文件 3.支持的接口 4.具体接口 请求: http://localhost:8089/metrics/metrics/http.server.requests 4. springBatch 接口 需要项目运行过job任务。 在源码层次手动注入过，AbstractJob,AbstractStepexcute抽象方法 添加了micrometer 记录方法。 默认支持 | metrics name | type | Description | Tags | | | | | | | spring.batch.job | TIMER | 作业job执行期间 | name, status | | spring.batch.job.active | LONGTASKTIMER | 正在运行的job | name | | spring.batch.step | TIMER | 作业step执行情况 | name, job.name, status | | spring.batch.item.read | TIMER | 作业read情况 | job.name, step.name,status | | spring.batch.item.process | TIMER | 作业process情况 | job.name, step.name,status | | spring.batch.chunk.write | TIMER | 作业write情况 | job.name, step.name,status | 1. http://localhost:8099/actuator/metrics/spring.batch.step 查看系统中Step的运行情况 2. http://localhost:8097/actuator/metrics/spring.batch.job.active 查看系统中的job运行状态 3. http://localhost:8099/actuator/metrics/spring.batch.job 查看系统运行中job的状况 4. http://localhost:8099/actuator/prometheus 支持的promethes 接口数据 4. 增加自定义属性 6. 自定义监控"
  },
  {
    "title": "java内省机制与反射机制的区别",
    "url": "/articles/2021/03/29/1617000615780.html",
    "type": "blog",
    "date": "2021-03-29",
    "topic": "Java 与 JVM",
    "topicSlug": "java-jvm",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "java反射",
      "java内省",
      "reflect",
      "Introspector"
    ],
    "excerpt": "概念上的区别 反射是在运行状态把Java类中的各种成分映射成相应的Java类，可以动态的获取所有的属性以及动态调用任意一个方法，强调的是运行状态。 内省(IntroSpector) 是Java 语言对 JavaBean（简称VO）类属性、事件的一种缺省处理方法。内省机制是通过反射来实现。例如类User中有属性name，...",
    "guide": "本文归入「Java 与 JVM」专题，主要记录：概念上的区别 反射是在运行状态把Java类中的各种成分映射成相应的Java类，可以动态的获取所有的属性以及动态调用任意一个方法，强调的是运行状态。 内省(IntroSpector) 是Java 语言对 JavaBean（简称VO）类属性、事件的一种缺省处理方法。内省机制是通过反射来实现。例如类User中有属性name，...",
    "content": "概念上的区别 反射是在运行状态把Java类中的各种成分映射成相应的Java类，可以动态的获取所有的属性以及动态调用任意一个方法，强调的是运行状态。 内省(IntroSpector) 是Java 语言对 JavaBean（简称VO）类属性、事件的一种缺省处理方法。内省机制是通过反射来实现。例如类User中有属性name，那么必定有getName，setName方法，我们可以通过他们来获取或者设置值。Java提供了一套API来访问某个属性的getter/setter方法，这些API存放在java.beans中。 内省涉及的类 Introspector BeanInfo PropertyDescriptor 实现内省的步骤 通过类 Introspector 的 getBeanInfo方法 来获取某个对象的 BeanInfo 信息。 通过 BeanInfo 来获取属性描述器(PropertyDescriptor)。 通过获取的属性描述器就可以获取某个属性对应的 getter/setter 方法。 通过反射机制调用获取到的getter/setter 方法。 测试User类; / .... 概念上的区别 反射是在运行状态把Java类中的各种成分映射成相应的Java类，可以动态的获取所有的属性以及动态调用任意一个方法，强调的是运行状态。 内省(IntroSpector) 是Java 语言对 JavaBean（简称VO）类属性、事件的一种缺省处理方法。内省机制是通过反射来实现。例如类User中有属性name，那么必定有getName，setName方法，我们可以通过他们来获取或者设置值。Java提供了一套API来访问某个属性的getter/setter方法，这些API存放在java.beans中。 内省涉及的类 Introspector BeanInfo PropertyDescriptor 实现内省的步骤 1. 通过类 Introspector 的 getBeanInfo方法 来获取某个对象的 BeanInfo 信息。 2. 通过 BeanInfo 来获取属性描述器(PropertyDescriptor)。 3. 通过获取的属性描述器就可以获取某个属性对应的 getter/setter 方法。 4. 通过反射机制调用获取到的getter/setter 方法。 5. 测试User类; 1、反射操作name属性 2、内省操作name属性"
  },
  {
    "title": "表数据量大读写缓慢如何优化【分库分表】",
    "url": "/articles/2021/03/25/1616640074000.html",
    "type": "blog",
    "date": "2021-03-25",
    "topic": "MySQL 与数据架构",
    "topicSlug": "mysql-data",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "MySQL",
      "冷热分离",
      "大表优化",
      "千万级表优化"
    ],
    "excerpt": "一、业务场景三 为了便于理解，我们通过一个业务场景来入手。 有一个电商系统架构优化工作，该系统中包含用户和订单2个主要实体，每个实体涵盖数据量如下表所示： 实体数据量增长趋势 用户千万级每日10万 订单亿级每日百万级，后续可能千万级 从上表中发现，目前订单数据量已达上亿，并且每日以百万级速度增长，之后还可能是千万级。 ...",
    "guide": "本文归入「MySQL 与数据架构」专题，主要记录：一、业务场景三 为了便于理解，我们通过一个业务场景来入手。 有一个电商系统架构优化工作，该系统中包含用户和订单2个主要实体，每个实体涵盖数据量如下表所示： 实体数据量增长趋势 用户千万级每日10万 订单亿级每日百万级，后续可能千万级 从上表中发现，目前订单数据量已达上亿，并且每日以百万级速度增长，之后还可能是千万级。 ...",
    "content": "一、业务场景三 为了便于理解，我们通过一个业务场景来入手。 有一个电商系统架构优化工作，该系统中包含用户和订单2个主要实体，每个实体涵盖数据量如下表所示： 实体数据量增长趋势 用户千万级每日10万 订单亿级每日百万级，后续可能千万级 从上表中发现，目前订单数据量已达上亿，并且每日以百万级速度增长，之后还可能是千万级。 面对如此大的数据量，此时存储订单的数据库竟然还是一个单库单表。对于单库单表而言，一旦数据量实现疯狂增长，无论是IO还是CPU都会扛不住。 为了使系统抗住千万级数据量的压力，各种SQL优化都已经做完，最终确定下来的方式是将订单表拆分，再进行分布存储，这也就是本章我们要讨论的内容——分库分表。 说到分库分表解决方案，我们首先需要做的就是搞定拆分存储的技术选型问题。 二、拆分存储的技术选型 关于拆分存储常用的技术解决方案，市面上目前主要分为4种：MySQL的分区技术、NoSql、NewSQL、基于MySQL的分库分表。 1、MySQL的分区技术 MySQL的分区主要在文件存储层做文章，它可以将一张表的不同存放在不同存储文件中，这对使用者来说比较透明。 在以往的实战项.... 一、业务场景三 为了便于理解，我们通过一个业务场景来入手。 有一个电商系统架构优化工作，该系统中包含用户和订单2个主要实体，每个实体涵盖数据量如下表所示： | 实体 | 数据量 | 增长趋势 | | | | | | 用户 | 千万级 | 每日10万 | | 订单 | 亿级 | 每日百万级，后续可能千万级 | 从上表中发现，目前订单数据量已达上亿，并且每日以百万级速度增长，之后还可能是千万级。 面对如此大的数据量，此时存储订单的数据库竟然还是一个单库单表。对于单库单表而言，一旦数据量实现疯狂增长，无论是IO还是CPU都会扛不住。 为了使系统抗住千万级数据量的压力，各种SQL优化都已经做完，最终确定下来的方式是将订单表拆分，再进行分布存储，这也就是本章我们要讨论的内容——分库分表。 说到分库分表解决方案，我们首先需要做的就是搞定拆分存储的技术选型问题。 二、拆分存储的技术选型 关于拆分存储常用的技术解决方案，市面上目前主要分为4种：MySQL的分区技术、NoSql、NewSQL、基于MySQL的分库分表。 1、MySQL的分区技术 MySQL的分区主要在文件存储层做文章，它可以将一张表的不同存放在不同存储文件中，这对使用者来说比较透明。 在以往的实战项目中，我们不使用它的原因主要有三点。 1. MySQL的实例只有一个，它仅仅分摊了存储，无法分摊请求负载。 2. 正式因为MySQL的分区对用户透明，所以用户在实际操作时往往不太注意，使得跨分区操作严重影响系统性能。 3. 当然，MySQL还有一些其他限制，比如不支持query cache、位操作表达式等。感兴趣的朋友可以看看这个文章：[](https://dev.mysql.com/doc/refman/5.7/en/partitioninglimitations.html%E3%80%82)https://dev.mysql.com/doc/refman/5.7/en/partitioninglimitations.html。 2、NoSQL（如MongoDB） 比较典型的NoSQL数据库就是MongoDB啦。MongoDB的分片功能从并发性和数据量这两个角度已经能满足一版大数据量的需求，但是需要注意这三大要点。 1、约束考量：MongoDB不是关系型数据库而是文档型数据库，它的每一行记录都是一个结构灵活可变的JSON，比如存储非常重要的订单数据时，我们就不能使用MongoDB，因为订单数据必须使用强约束的关系型数据库进行存储。 2、业务功能考量：多年来，事务、锁、SQL、表达式等千奇百怪的操作都在MySQL身上一一验证过，MySQL可以说是久经考验，因此在功能上MySQL能满足我们所有的业务需求，MongoDB却不能，且大部分的NoSQL也存在类似的问题。 3、稳定性考量：我们对MySQL的运维已经很熟悉了，它的稳定性没有问题，然而MongoDB的稳定性我们没法保证，毕竟不熟悉，因此在之前的拆分存储技术选型中，我们没使用过NoSQL。 3、NewSQL（如TiDB） NewSQL技术还比较新，我们曾今想在一些不重要的数据中使用NewSQL（比如TiDB），但从稳定性和功能扩展性两方面来考量后，最终没有使用，具体原因与MongoDB类似。 4、基于MySQL的分库分表 什么是分库分表？分表是将一份大的表数据拆分存放至多个结构一样的拆分表；分库就是将一个大的数据库拆分成多个结构一样的小库。 前面介绍的三种拆分存储技术，在我们以往的项目中都没有使用过，而是选择了基于MySQL的分库分表，主要是有一个重要考量：分库分表对于第三方依赖较少，业务逻辑灵活可控，它本身并不需要非常复杂的底层处理，也不需要重新做数据库，只是根据不同的逻辑使用不同的SQL语句和数据源而已。 如果使用分库分表方式，存在三个技术通用需求需要实现。 1、SQL组合：因为我们关联的表名是动态的，所以我们需要根据逻辑组装动态的SQL。 2、数据库路由：因为数据库名也是动态的，所以我们需要根据不同的逻辑使用不同的数据库。 3、执行结果合并：有些需求需要通过多个分库执行，再合并归集使用。 而市面上能解决以上问题的中间件分为2类：Proxy模式、Client模式。 （1）Proxy模式：直接拿ShardingSphere官方文档里的图进行说明，我们重点看看中间ShardingProxy层，如下图所示： 以上这种设计模式，把SQL组合、数据库路由、执行结果合并等功能全部存放在一个代理服务中，而与分库分表相关的处理逻辑全部存放在另外的服务中，这种设计模式的优点是对业务代码无侵入，业务只需要关注自身的业务逻辑即可。 （2）Client模式：还是借用shardingSphere官方文档的图来说明，如下图所示： 以上这种设计模式，把分库分表相关逻辑存放在客户端，一版客户端的应用会引用一个jar，然后再jar中处理SQL组合、数据库路由、执行结果合并等相关功能。 市面上，关于这两种模式的中间件有如下选择： | 中间件技术 | 模式 | 厂家 | 语言 | | | | | | | MyCat | Proxy | | Java | | KingShard | Proxy | | Go | | Atlas | Proxy | 360 | C | | zebra | Client | 美团 | Java | | cobar | Proxy | 阿里 | Java | | ShardingJDBC | Client | Apache ShardingSphere | Java | | TSharding | Client | 蘑菇街 | Java | 看到这里，我们已经知道市面上开源中间件的设计模式，那么我们到底该选择哪种模式呢？简单对比下这2个模式的优缺点，你就知道答案了。 | 模式 | 优点 | 缺点 | | | | | | Proxy | 1、多语言。2、资源消耗解耦，不需要消耗客户端的资源。3、升级方便。 | 1、多一层服务调用，debug线上问题调查难一些。2、多一层运维成本。 | | Client | 1、少一层服务调用，代码灵活可控。2、减少运维成本 | 1、单语言。2、升级不方便。 | 因为看重代码灵活可控这个优势，所以我们选择了Client模式里的ShardingJDBC来实现分库分表 当然，关于拆分存储选择哪种技术，在实际工作中我们需要根据各自的实际情况来定。 三、分库分表实现思路 技术选型这一大难题解决后，具体如何落地分库分表解决方案成了我们亟待解决的问题。 在落实分库分表解决方案时，我们需要考虑5个要点。 1、使用什么字段作为分片键？ 我们先来回顾下业务场景中举例的数据库： | 实体 | 数据量 | 增长趋势 | | | | | | 用户 | 千万级 | 每日10万 | | 订单 | 亿级 | 每日百万级，后续可能千万级 | 下面我们把上表中的数据拆分成一个订单表，表中主要数据结构如下： | 表名 | 字段 | 备注 | | | | | | torder | Userid | 客户id | | | Orderid | 订单id | | | usercityid | 用户所在城市 | | | Ordertime | 下单时间 | | | ... | 其他字段就不列了 | 从上面表中可知，我们是使用userid作为分片主键，为什么这样分呢，来聊聊当时的实现思路。 在选择分片字段之前，我们首先了解了下目前存在的一些常见业务需求： 用户需要查询所有订单，订单数据中肯定包含不同的merchantid、ordertime； 后台需要根据城市查询当地订单； 后台需要统计每个时间段的订单趋势； 根据这些常见业务需求，我们判断了下优先级，用户操作也就是第一个需求必须优先满足。 此时，如果我们使用userid作为订单分片字段，就能保证每次用户查询数据时（第一个需求），在一个分库的一个分表里即可获取数据。 因此，在我们的方案里，最终还是使用userid作为分片主键，这样在分库分表查询时，首先会把userid作为参数传过来。 这里需要特殊说明下，选择字段作为分片键时，我们一般要考虑三个因素：数据尽量均匀分布在不同的库或表、跨库查询尽可能少、这个字段值会不会变（这点尤为重要）。 2、分片的策略是什么？ 决定使用userid作为订单分片字段后，我们就要开始考虑分片的策略问题了。 目前，市面上通用的"
  },
  {
    "title": "表数据量大读写缓慢如何优化【查询分离】",
    "url": "/articles/2021/03/25/1616638627630.html",
    "type": "blog",
    "date": "2021-03-25",
    "topic": "MySQL 与数据架构",
    "topicSlug": "mysql-data",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "MySQL",
      "冷热分离",
      "大表优化",
      "千万级表优化"
    ],
    "excerpt": "业务场景二 某 SaaS 客服系统，系统里有一个工单查询功能，工单表中存放了几千万条数据，且查询工单表数据时需要关联十几个子表，每个子表的数据也是超亿条。 面对如此庞大的数据量，跟前面的冷热分离一样，每次客户查询数据时几十秒才能返回结果，即便我们使用了索引、SQL 等数据库优化技巧，效果依然不明显。 加上工单表中有些数...",
    "guide": "本文归入「MySQL 与数据架构」专题，主要记录：业务场景二 某 SaaS 客服系统，系统里有一个工单查询功能，工单表中存放了几千万条数据，且查询工单表数据时需要关联十几个子表，每个子表的数据也是超亿条。 面对如此庞大的数据量，跟前面的冷热分离一样，每次客户查询数据时几十秒才能返回结果，即便我们使用了索引、SQL 等数据库优化技巧，效果依然不明显。 加上工单表中有些数...",
    "content": "业务场景二 某 SaaS 客服系统，系统里有一个工单查询功能，工单表中存放了几千万条数据，且查询工单表数据时需要关联十几个子表，每个子表的数据也是超亿条。 面对如此庞大的数据量，跟前面的冷热分离一样，每次客户查询数据时几十秒才能返回结果，即便我们使用了索引、SQL 等数据库优化技巧，效果依然不明显。 加上工单表中有些数据是几年前的，但是这些数据涉及诉讼问题，需要继续保持更新，因此无法将这些旧数据封存到别的地方，也就没法通过前面的冷热分离方案来解决。 最终采用了查询分离的解决方案，才得以将这个问题顺利解决：将更新的数据放在一个数据库里，而查询的数据放在另外一个系统里。因为数据的更新都是单表更新，不需要关联也没有外键，所以更新速度立马得到提升，数据的查询则通过一个专门处理大数据量的查询引擎来解决，也快速地满足了实际的查询需求。 通过这种解决方案处理后，每次查询数据时，500ms 内就可得到返回结果，客户再也不抱怨了。 通过上面这个例子，大家对查询分离的业务场景已经有了一定认知，但如果想掌握整个业务场景，继续往下看吧。 什么是查询分离？ 关于查询分离的概念，从简单的字面意思上也好理解，即每次.... 业务场景二 某 SaaS 客服系统，系统里有一个工单查询功能，工单表中存放了几千万条数据，且查询工单表数据时需要关联十几个子表，每个子表的数据也是超亿条。 面对如此庞大的数据量，跟前面的冷热分离一样，每次客户查询数据时几十秒才能返回结果，即便我们使用了索引、SQL 等数据库优化技巧，效果依然不明显。 加上工单表中有些数据是几年前的，但是这些数据涉及诉讼问题，需要继续保持更新，因此无法将这些旧数据封存到别的地方，也就没法通过前面的冷热分离方案来解决。 最终采用了查询分离的解决方案，才得以将这个问题顺利解决：将更新的数据放在一个数据库里，而查询的数据放在另外一个系统里。因为数据的更新都是单表更新，不需要关联也没有外键，所以更新速度立马得到提升，数据的查询则通过一个专门处理大数据量的查询引擎来解决，也快速地满足了实际的查询需求。 通过这种解决方案处理后，每次查询数据时，500ms 内就可得到返回结果，客户再也不抱怨了。 通过上面这个例子，大家对查询分离的业务场景已经有了一定认知，但如果想掌握整个业务场景，继续往下看吧。 什么是查询分离？ 关于查询分离的概念，从简单的字面意思上也好理解，即每次写数据时保存一份数据到另外的存储系统里，用户查询数据时直接从另外的存储系统里获取数据。示意图如下： 何种场景下使用查询分离？ 当在实际业务中遇到以下情形，则可以考虑使用查询分离解决方案。 数据量大； 所有写数据的请求效率尚可； 查询数据的请求效率很低； 所有的数据任何时候都可能被修改； 业务希望优化查询数据的效率； 大家对查询分离这个概念特别熟悉，但是对于查询分离的使用场景一无所知，这可不行，只有了解了查询分离的真正使用场景，才能在遇到实际问题时采取最正确的解决方案。 查询分离实现思路 在实际工作中，如果业务要求必须使用查询分离的解决方案，我们就务必掌握查询分离的实现思路。也只有这样，我们真正遇到问题时才能有条不紊地开展工作。 查询分离解决方案的实现思路如下： 1. 如何触发查询分离？ 2. 如何实现查询分离？ 3. 查询数据如何存储？ 4. 查询数据如何使用？ 针对以上问题，我们一点一点来讨论。 （一）如何触发查询分离？ 这个问题说明的是我们应该在什么时候保存一份数据到查询数据中，即什么时候触发查询分离这个动作。 一般来说，查询分离的触发逻辑分为3种。 （1）修改业务代码：在写入常规数据后，同步建立查询数据。 （2）修改业务代码：在写入常规数据后，异步建立查询数据。 （3）监控数据库日志：如有数据变更，更新查询数据。 通过观察以上3种触发逻辑示意图，发现了什么吗？3种触发逻辑的优缺点对比表如下： | | 修改业务代码同步建立查询数据 | 修改业务代码异步建立查询数据 | 监控数据库日志 | | | | | | | 优点 | 1、保证查询数据的实时性和一致性。2、业务逻辑灵活可控 | 1、不影响主流程 | 1、不影响主流程。2、业务代码0侵入 | | 缺点 | 1、侵入业务代码。2、减缓写操作速度。 | 1、查询数据更新前，用户可能会查询到过时的数据。 | 1、查询数据更新前，用户可能会查询到过时的数据。2、架构复杂一些 | 为方便理解表中的内容，我们来一起聊一下其中的几个概念。 什么叫业务灵活逻辑可控？举个例子：一般来说，写业务代码的人能从业务逻辑中快速判断出何种情况下更新查询数据，而监控数据库日志的人并不能将全部的数据库变更分支穷举，再把所有的可能性关联到对应的更新查询数据逻辑中，最终导致任何数据的变更都需要重新建立查询数据。 什么叫减缓写操作速度？建立查询数据的一个动作能减缓多少写操作速度？答案：很多。举个例子：当你只是简单更新了订单的一个标识，本来查询数据时间只需要 2ms，而在查询数据时可能会涉及重建（比如使用 ES 查询数据时会涉及索引、分片、主从备份，其中每个动作又细分为很多子动作，这些内容后面文章会聊到），这时建立查询数据的过程可能就需要 1s 了，从 2ms 变成 1s，你说减缓幅度大不大？ 查询数据更新前，用户可能查询到过时数据。 这里我们结合第 2 种触发逻辑来讲，比如某个操作正处于订单更新状态，状态更新时会通过异步更新查询数据，更新完后订单才从“待审核”状态变为“已审核”状态。假设查询数据的更新时间需要 1 秒，这 1 秒中如果用户正在查询订单状态，这时主数据虽然已变为“已审核”状态，但最终查询的结果还是显示“待审核”状态。 根据前面的对比表，总结每种触发逻辑的适用场景如下： | 触发逻辑 | 适用场景 | | | | | 修改业务代码，同步建立查询数据 | 业务代码比较简单且对写操作响应速度要求不高 | | 修改业务代码，异步建立查询数据 | 业务代码比较简单且对写操作响应 | | 监控数据库日志 | 业务代码比较复杂，或者改动代价太大 | 这里，结合实战案例说明下：在一个真实业务场景中，虽然我们对业务的代码比较熟悉，但是业务要求每次修改工单请求时响应速度快，我们最终就选择了修改业务代码异步建立查询数据这种触发逻辑。 （二）如何实现查询分离？ 以上共谈到 3 种触发逻辑，第 1 种是同步建立查询数据的过程比较简单，这里就不展开说明，第 3 种监控数据库日志我会在 13 讲具体讲解，所以这部分内容我们主要围绕第 2 种讨论。 关于第 2 种触发方案：修改业务代码异步建立查询数据，最基本的实现方式是单独起一个线程建立查询数据，不过这种做法会出现如下情况： 写操作较多且线程太多，最终撑爆JVM。 建查询数据的线程出错了，如何自动重试。 多线程并发时，很多并发场景需要解决。 面对以上三种情况，我们该如何处理？此时使用MQ管理这些这些线程即可解决。 MQ的具体操作思路为每次主数据写操作请求处理时，都会发一个通知给MQ，MQ收到通知后唤醒一个线程更新查询数据，示意图如下： 了解了MQ的具体操作思路后，我们还应该考虑以下5大问题。 问题一：MQ如何选型？ 如果公司已使用 MQ，那选型问题也就不存在了，毕竟技术部门不会同时维护 2 套 MQ 中间件，而如果公司还没使用 MQ，这就需要考虑选型问题了。 这里我分享两点选型原则，希望对你有帮助。 （1）召集技术中心所有能做技术决策的人共同投票选型。 （2）不管我们选择哪个 MQ ，最终都能实现想要的功能，只不过是易用不易用、多写少写业务代码的问题，因此我们从易用性和代码工作量角度考量即可。 问题二：MQ宕机了怎么办？ 如果 MQ 宕机了，我们只需要保证主流程正常进行，且 MQ 恢复后数据正常处理即可，具体方案分为三大步骤。 每次写操作时，在主数据中加个标识：NeedUpdateQueryData=true，这样发到 MQ 的消息就很简单，只是一个简单的信号告知更新数据，并不包含更新的数据 id。 MQ 的消费者获取信号后，先批量查询待更新的主数据，然后批量更新查询数据，更新完后查询数据的主数据标识 NeedUpdateQueryData 就更新成 false 了。 当然还存在多个消费者同时搬运动作的情况，这就涉及并发性的问题，因此问题与上一篇聊的冷热分离中的并发性处理逻辑类似，这里就不细聊了（有兴趣的同学可以去看看）。 问题三：更新查询数据的线程失败了怎么办？ 如果更新的线程失败了，NeedUpdateQueryData 的标识就不会更新，后面的消费者会再次将有 NeedUpdateQueryData 标识的数据拿出来处理。但如果一直失败，我们可以在主数据中多添加一个尝试搬运次数，比如每次尝试搬运时 +1，成功后就清零，以此监控那些尝试搬运次数过多的数据。 问题四：消息的幂等消费 在编程中，一个幂等操作的特点是多次执行某个操作均与执行一次操作的影响相同。 举个例子，比如主数据的订单 A 更新后，我们在查询数据中插入了 A，可是此时系统出问题了，系统误以为查询数据没更新，又把订单 A 插入更新了一次。 所谓幂等，就是不管更新查询数据的逻辑执行几次，结果都是我们想要的结果。因此，考虑消费端并发性的问题时，我们需要保证更新查询数据幂等。 问题五：消息的时序性问题 比如某个订单 A 更新了 1 次数据变成 A1，线程甲将 A1 的数据搬到查询数据中。不一会儿，后台订单 A 又更新了 1 次数据变成 A2，线程乙也启动工作，将 A2 的数据搬到查询数据中。 所谓的时序性就是如果线程甲启动比乙早，但搬运数据动作比线程乙还晚完成，就有可"
  },
  {
    "title": "表数据量大读写缓慢如何优化【冷热分离】",
    "url": "/articles/2021/03/25/1616636082398.html",
    "type": "blog",
    "date": "2021-03-25",
    "topic": "MySQL 与数据架构",
    "topicSlug": "mysql-data",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "MySQL",
      "冷热分离",
      "大表优化",
      "千万级表优化"
    ],
    "excerpt": "业务场景一 曾经经历过供应链相关的架构优化，当时平台上有一个订单功能，里面的主表有几千万数据量，加上关联表，数据量达到上亿。 这么庞大的数据量，让平台的查询订单变得格外迟缓，查询一次都要二三十秒，而且多点击几次就会出现宕机。比如业务员多次查询时，数据库的 CPU 会立马狂飙，服务器线程也降不下来。 当时，我们尝试了优化...",
    "guide": "本文归入「MySQL 与数据架构」专题，主要记录：业务场景一 曾经经历过供应链相关的架构优化，当时平台上有一个订单功能，里面的主表有几千万数据量，加上关联表，数据量达到上亿。 这么庞大的数据量，让平台的查询订单变得格外迟缓，查询一次都要二三十秒，而且多点击几次就会出现宕机。比如业务员多次查询时，数据库的 CPU 会立马狂飙，服务器线程也降不下来。 当时，我们尝试了优化...",
    "content": "业务场景一 曾经经历过供应链相关的架构优化，当时平台上有一个订单功能，里面的主表有几千万数据量，加上关联表，数据量达到上亿。 这么庞大的数据量，让平台的查询订单变得格外迟缓，查询一次都要二三十秒，而且多点击几次就会出现宕机。比如业务员多次查询时，数据库的 CPU 会立马狂飙，服务器线程也降不下来。 当时，我们尝试了优化表结构、业务代码、索引、SQL 语句等办法来提高响应速度，但这些方法治标不治本，查询速度还是很慢。 考虑到我们手头上还有其他优先级高的需求需要处理，为此，我们跟业务方反馈：“这功能以后你们能不用就不用，暂时先忍受一下。”可经过一段时间后，业务方实在受不了了，直接跟我们放狠话，无奈之下我们屈服了。 最终，我们决定采用一个性价比高的解决方案，简单方便地解决了这个问题。在处理数据时，我们将数据库分成了冷库和热库 2 个库，不常用数据放冷库，常用数据放热库。 通过这样的方法处理后，因为业务员查询的基本是近期常用的数据，常用的数据量大大减少了，就再也不会出现宕机的情况了，也大大提升了数据库响应速度。 其实上面这个方法，就是“冷热分离”。 一、什么是冷热分离 冷热分离就是在处理数据.... 业务场景一 曾经经历过供应链相关的架构优化，当时平台上有一个订单功能，里面的主表有几千万数据量，加上关联表，数据量达到上亿。 这么庞大的数据量，让平台的查询订单变得格外迟缓，查询一次都要二三十秒，而且多点击几次就会出现宕机。比如业务员多次查询时，数据库的 CPU 会立马狂飙，服务器线程也降不下来。 当时，我们尝试了优化表结构、业务代码、索引、SQL 语句等办法来提高响应速度，但这些方法治标不治本，查询速度还是很慢。 考虑到我们手头上还有其他优先级高的需求需要处理，为此，我们跟业务方反馈：“这功能以后你们能不用就不用，暂时先忍受一下。”可经过一段时间后，业务方实在受不了了，直接跟我们放狠话，无奈之下我们屈服了。 最终，我们决定采用一个性价比高的解决方案，简单方便地解决了这个问题。在处理数据时，我们将数据库分成了冷库和热库 2 个库，不常用数据放冷库，常用数据放热库。 通过这样的方法处理后，因为业务员查询的基本是近期常用的数据，常用的数据量大大减少了，就再也不会出现宕机的情况了，也大大提升了数据库响应速度。 其实上面这个方法，就是“冷热分离”。 一、什么是冷热分离 冷热分离就是在处理数据时将数据库分成冷库和热库 2 个库，冷库指存放那些走到了终态的数据的数据库，热库指存放还需要修改的数据的数据库。 二、什么情况下使用冷热分离？ 假设业务需求出现了如下情况，就可以考虑使用冷热分离的解决方案： 数据走到终态后，只有读没有写的需求，比如订单完结状态； 用户能接受新旧数据分开查询，比如有些电商网站默认只让查询3个月内的订单，如果你要查询3个月前的订单，还需要访问另外的单独页面。 三、冷热分离实现思路 在实际操作过程中，冷热分离整体实现思路如下： 1、如何判断一个数据到底是冷数据还是热数据？ 2、如何触发冷热数据分离？ 3、如何实现冷热数据分离？ 4、如何使用冷热数据？ 接下来，我们针对以上4个问题进行详细的分析。 （一）如何判断一个数据到底是冷数据还是热数据？ 一般而言，在判断一个数据到底是冷数据还是热数据时，我们主要采用主表里的 1 个或多个字段组合的方式作为区分标识。其中，这个字段可以是时间维度，比如“下单时间”这个字段，我们可以把 3 个月前的订单数据当作冷数据，3 个月内的当作热数据。 当然，这个字段也可以是状态维度，比如根据“订单状态”字段来区分，已完结的订单当作冷数据，未完结的订单当作热数据。 我们还可以采用组合字段的方式来区分，比如我们把下单时间 3 个月且状态为“已完结”的订单标识为冷数据，其他的当作热数据。 而在实际工作中，最终究竟使用哪种字段来判断，还是需要根据你的实际业务来定。 关于判断冷热数据的逻辑，这里还有 2 个注意要点必须说明： 如果一个数据被标识为冷数据，业务代码不会再对它进行写操作； 不会同时存在读冷/热数据的需求。 （二）如何触发冷热数据分离？ 了解了冷热数据的判断逻辑后，我们就要开始考虑如何触发冷热数据分离了。一般来说，冷热数据分离的触发逻辑分3种。 1. 直接修改业务代码，每次修改数据时触发冷热分离（比如每次更新了订单的状态，就去触发这个逻辑）； 2. 如果不想修改原来业务代码，可通过监听数据库变更日志binlog的方式来触发（数据库触发器也可）； 3. 通过定时扫描数据的方式来触发（数据库定时任务或通过程序定时任务来触发）； 针对以上三种触发逻辑，选择哪种比较好呢？看完以下表格的分析，你心里就有答案了。 | | 修改写操作的业务代码 | 监听数据库变更日志 | 定时扫描数据库 | | | | | | | 优点 | 1、代码灵活可控。2、保证实时性 | 1、与业务代码解耦。2、可以做到低延时。 | 1、与业务代码解耦。2、可以覆盖根据时间区分冷热数据的场景。 | | 缺点 | 1、不能按照时间区分冷热，当数据变为冷数据，期间可能没有进行任何操作。2、需要修改所有数据写操作的代码。 | 1、无法按照时间区分冷热，当数据变为冷数据，期间没有进行任何操作。2、需要考虑数据并发操作的问题，即业务代码与冷热变更代码同时操作同一数据。 | 1、不能做到实时性 | 根据表格内容对比，我们可以得出每种出发逻辑的建议场景。 1. 修改写操作的业务代码：建议在业务代码比较简单，并且不按照时间区分冷热数据时使用。 2. 监听数据库变更日志：建议在业务代码比较复杂，不能随意变更，并且不按照时间区分冷热数据时使用。 3. 定时扫描数据库：建议在按照时间区分冷热数据时使用。 （三）如何分离冷热数据？ 分离冷热数据的基本逻辑如下： 1. 判断数据是冷是热； 2. 将要分离的数据插入冷数据中； 3. 再从热数据库中删除分离的数据。 这个逻辑看起来简单，而实际做方案时，以下三点我们都得考虑在内，这一点就不简单了。 （1）一致性：同时修改过个数据库，如何保证数据的一致性 ​ 这里提到的一致性要求，指我们如何保证任何一步出错后数据还是一致的，解决方案为只要保证每一步都可以重试且操作都有幂等性就行，具体逻辑分为四步。 在热数据库中，给要搬的数据加个标识： flag=1。（1代表冷数据，0代表热数据） 找出所有待搬的数据（flag=1）：这步是为了确保前面有些线程因为部分原因失败，出现有些待搬的数据没有搬的情况。 在冷数据库中保存一份数据，但在保存逻辑中需加个判断以此保证幂等性（这里需要用事务包围起来），通俗点说就是假如我们保存的数据在冷数据库已经存在了，也要确保这个逻辑可以继续进行。 从热数据库中删除对应的数据。 （2）数据量大：假设数据量大，一次性处理不完，该怎么办？是否需要使用批量处理？ ​ 前面说的3种冷热分离的触发逻辑，前 2 种基本不会出现数据量大的问题，因为每次只需要操作那一瞬间变更的数据，但如果采用定时扫描的逻辑就需要考虑数据量这个问题了。 ​ 这个实现逻辑也很简单，在搬数据的地方我们加个批量逻辑就可以了。为方便理解，我们来看一个示例。 ​ 假设我们每次可以搬 50 条数据： ​ a. 在热数据库中给要搬的数据加个标识：flag=1； ​ b. 找出前 50 条待搬的数据（flag=1）； ​ c. 在冷数据库中保存一份数据； ​ d. 从热数据库中删除对应的数据； ​ e. 循环执行 b。 （3）并发性：假设数据量大到要分到多个地方并行处理，该怎么办？ ​ 在定时搬运冷热数据的场景里（比如每天），假设每天处理的数据量大到连单线程批量处理都来不及，我们该怎么办？这时我们就可以开多个线程并发处理了。(虽然大部分情况下多线程较快，但我曾碰到过这种情况：当单线程 batch size 到一定数值时效率特别高，比多线程任何 batch size 都快。所以，需要留意：如果遇到多线程速度不快，我们就考虑控制单线程。) ​ 当多线程同时搬运冷热数据，我们需要考虑如下实现逻辑。 ​ 第 1 步：如何启动多线程？ ​ 因为我们采用的是定时器触发逻辑，这种触发逻辑性价比最高的方式是设置多个定时器，并让每个定时器之间的间隔短一些，然后每次定时启动一个线程就开始搬运数据。 ​ 还有一个比较合适的方式是自建一个线程池，然后定时触发后面的操作：先计算待搬动的热数据的数量，再计算要同时启动的线程数，如果大于线程池的数量就取线程池的线程数，假设这个数量为 N，最后循环 N 次启动线程池的线程搬运冷热数据。 ​ 第 2 步：某线程宣布某个数据正在操作，其他线程不要动（锁）。 ​ 关于这个逻辑，我们需要考虑 3 个特性。 获取锁的原子性： 当一个线程发现某个待处理的数据没有加锁，然后给它加锁，这 2 步操作必须是原子性的，即要么一起成功，要么一起失败。实际操作为先在表中加上 LockThread 和 LockTime 两个字段，然后通过一条 SQL 语句找出待迁移的未加锁或锁超时的数据，再更新 LockThread=当前线程，LockTime=当前时间，最后利用 MySQL 的更新锁机制实现原子性。 获取锁必须与开始处理保证一致性： 当前线程开始处理这条数据时，需要再次检查下操作的数据是否由当前线程锁定成功，实际操作为再次查询一下 LockThread= 当前线程的数据，再处理查询出来的数据。 释放锁必须与处理完成保证一致性： 当前线程处理完数据后，必须保证锁释放出去。 第 3 步：某线程正常处理完后，数据不在热库，直接跑到了冷库，这是正常的逻辑，倒没有什么特别需要注意的点。 第 4 步：某"
  },
  {
    "title": "Spring Integration 中文手册",
    "url": "/articles/2021/03/16/1615897840354.html",
    "type": "blog",
    "date": "2021-03-16",
    "topic": "Spring Boot 与后端框架",
    "topicSlug": "spring-backend",
    "core": true,
    "priority": 80,
    "readingOrder": 20,
    "tags": [
      "rabbitmq",
      "activemq",
      "Spring Batch"
    ],
    "excerpt": "这篇文章适合作为 Spring 生态集成能力的参考资料，用来理解消息通道、端点、适配器和企业集成模式。",
    "guide": "核心文章：这篇文章适合作为 Spring 生态集成能力的参考资料，用来理解消息通道、端点、适配器和企业集成模式。",
    "content": "1. Spring Integration 中文手册 Spring Integration 对 Spring 编程模型进行了扩展，使得后者能够支持著名的“企业集成模式”。通过SI（Spring Integration）可以在基于Spring的应用中引入轻量级的“消息驱动模式”，并且支持“通过声明式的适配器”与外部系统进行集成。这些“适配器”相较于Spring对于“remoting（远程调用）”、“messaging（事件消息）”、“scheduling（任务调度）”方面的支持，提供了更高层次的一种抽象。SI的首要目标是：为“构建企业集成方案、维护系统间通信”提供一种简单模型，应用该模型所产出的代码是可维护、可测试的。 2. Spring Integration 概览 2.1 背景 IoC——“控制反转”，是Spring Framework的一个关键特性。这种IoC，从广义上来说，意味着Spring Framework将负责代表被其上下文所管理的各种组件，而组件本身却由于被减轻了部分职责而简单化了。例如：“依赖注入”使得组件摆脱了定位与创建自身依赖的职责。再比如：“面向切面编程”则通过可.... 1. Spring Integration 中文手册 Spring Integration 对 Spring 编程模型进行了扩展，使得后者能够支持著名的“企业集成模式”。通过SI（Spring Integration）可以在基于Spring的应用中引入轻量级的“消息驱动模式”，并且支持“通过声明式的适配器”与外部系统进行集成。这些“适配器”相较于Spring对于“remoting（远程调用）”、“messaging（事件消息）”、“scheduling（任务调度）”方面的支持，提供了更高层次的一种抽象。SI的首要目标是：为“构建企业集成方案、维护系统间通信”提供一种简单模型，应用该模型所产出的代码是可维护、可测试的。 2. Spring Integration 概览 2.1 背景 IoC——“控制反转”，是Spring Framework的一个关键特性。这种IoC，从广义上来说，意味着Spring Framework将负责代表被其上下文所管理的各种组件，而组件本身却由于被减轻了部分职责而简单化了。例如：“依赖注入”使得组件摆脱了定位与创建自身依赖的职责。再比如：“面向切面编程”则通过可复用切面的透明织入，使得业务与横切交叉点解耦，使得业务组件避免了被普遍的耦合横切，做到了更好的模块化。在上述各种情况下，最终结果都是：系统更容易被测试、理解、维护和扩展。 此外，Spring Framework及相关工具包为构建企业应用提供了一个无所不包的编程模型。开发者受益于这个模型的一致性。尤其是该模型以公认的最佳实践为基础，使得开发者受益匪浅，比如“面向接口编程”，“尽量使用聚合而不是继承”等等。来自Spring的简化抽象与强大类库，不仅增强了系统的可测试性和可移植性，同时也大大提高了开发者的生产力。 Spring Integration秉承了与前文所述相同的目标和原则。它将Spring的编程模型拓展到了消息领域，在Spring现有的企业集成支持基础上构建了更高次的抽象。在它所支持的消息驱动架构中，“控制反转”被应用于运行期的关键连接处，例如：在何时特定的业务逻辑应该执行，以及响应结果应该被发送到何处。它提供了消息路由和消息转换方面的支持，所以不同的传输协议和不同的数据格式都能在不影响易测试性的前提下被集成。换句话说，消息和集成点都被框架所处理，所以业务组件能很好地与基础设施隔离，从而使得开发者能够从复杂的集成工作中解脱出来。 作为Spring编程模型的扩展，Spring Integration提供了多种配置方式可供选择，包括注解、基于命名空间的XML、通用Bean元素的XML，当然也可以直接使用底层API。底层的API都均是基于“精心定义的策略接口”与“保证了非侵入性的代理适配器”。Spring Integration的设计启发于“Spring中的普遍模式”与“企业集成模式”间强烈的共鸣。“企业集成模式”是由Gregor Hohpe和Bobby Woolf在《企业集成模式》一书中提出的，该书由Addison Wesley出版社于2004年出版。读过此书的开发者应该能更快地适应Spring Integration的概念和术语。 2.2 目标与原则 Spring Integration 面向如下目标： 提供一个简单的模型来实现复杂的企业集成解决方案 为基于Spring的应用提供异步、消息驱动方面的基础支持 让现有的Spring用户可以更容易、直观的掌握，并让更多的用户去使用 Spring Integration 遵循以下原则： 组件间应该是模块化、松耦合的，且可测试的 框架应该保证分离“业务逻辑”和“集成逻辑” 扩展点本质上应该是抽象的，而且限定在一个清晰的边界内，进而提升可复用性和可移植性 2.3 主要组件 从垂直的视角来看，“分层架构”会更有利于关键点的剥离，各层间通过基于接口的契约来确保松耦合。基于Spring的应用就是如此设计的典型。Spring Framework与相关工具包从全栈范围为企业应用提供了一个遵从最佳实践强大基础。“消息驱动架构”则为我们带来了一个“横向的视角”。正如“分层架构”是一种极通用、极抽象的范式一样，消息系统非常符合同样抽象的“管道过滤器”模型。“过滤器”代表任何能够产出和（或）消费消息的组件。“管道”则负责在过滤器间传输消息。所以在管道的作用下，各“过滤器”组件间保持松耦合。有必要指出的是，这两个高级范式（分层架构与消息驱动架构）并非互斥。支持“管道”的消息基础设施应当被封装在相应的垂直“层”中，且该层对外的契约被定义为接口。同样地，“过滤器”往往被安排于“应用服务层”之上的（业务）层中进行管理，并且与底层服务的交互方式与它类无异。 2.3.1 消息 在Spring Integration中，“消息”是对任何Java对象的一种通用包装，这种包装将会给Java对象附着一些元信息以供消息框架处理。一条“消息”由“消息体”（payload）和“消息头”（header）组成。消息体可以是任何类型，消息头一般用于保存一些必要信息，比如id、时间戳、过期时间和返回地址等。消息头也可以用来在不同的传输协议之间传递参数。比如，当需要包装一个文件来创建一个消息时，可以将文件名保存于消息头中，以供下游的消息组件读取使用。再比如，如果一个消息的内容会最终被Mail适配器发出，那么各种属性值（to、from、cc、subject等）可被上游的消息组件保存在消息头中。开发者可以利用消息头来保存任意的键值对。 2.3.2 消息通道 “消息通道”对应着“管道过滤器”架构中的“管道角色”。消息生产者发送消息到通道，消息消费者从通道接收消息。从而，消息通道解耦了消息组件，同时也为消息拦截和监控提供了便利的切入点。 一个消息通道可以是“点对点”意义的，或者也可以是“发布订阅”意义的。 如果是点对点模式的通道，发布到通道中的每个消息，最多只有一个消费者可以接收。 如果是发布订阅模式的通道，则会尝试广播消息给其所有的订阅者。 Spring Integration对这两种模式均提供支持。 鉴于“点对点模式”和“发布订阅模式”提供了两种关于“最终有多少消息消费者接收消息”的选择，此处还有另外一项重要考虑：通道是否应该缓存消息？在Spring Integration中，轮询通道（Pollable Channels）具备缓存消息能力。缓存的优势在于它能够调节接入消息流量，从而避免消息消费者负荷过载。然而，正如其名称所示，这也会引入了一些复杂性，只有配置了轮询器后，消息消费者才能从这个通道中接收消息。而另一方面，订阅通道（Subscribable Channel）要求连接它的消费者依从简单的消息驱动模式。Spring Integration中还有多种通道的可用实现，将在第3.2章节“消息通道实现”中详细讨论。 2.3.2 消息终端 Spring Integration的主要目标之一是通过“控制反转”来简化企业集成解决方案的开发。这意味着你应该不需要直接实现消息消费者和生产者，更不需要构建消息或者在消息通道上调用发送与接收操作。相反地，你只需要关注于你基于普通对象（POJO）实现的特定领域模型。然后，通过声明式配置，你可以“连接”业务领域代码到Spring Integration提供的消息基础设施。而负责这些连接的组件就是“消息终端”。这并不是说你必须直接性地连接现有应用。任何真实的企业集成解决方案，都需要一些用于集成相关的逻辑代码，例如路由选择和协议转换。其中暗含的要点就是：实现集成逻辑和业务逻辑的分离。类比来说，作为Web应用中的MVC模式，其目标应该是提供一个简单而专用的层，转换接入的请求到服务层调用，然后再转换服务层响应到请求端。下一节将概述处理这些响应的各种消息终端类型，且在以后的章节中，将为你展示如何使用Spring Integration的声明式配置来保证非侵入性的效果。 2.4 各种消息终端简介 “消息终端”对应着“管道过滤器”架构中的“过滤器”角色。就像前文提到的，消息终端的的主要作用在于“连接”业务领域代码到Spring Integration提供的消息基础设施，当然前提是使用非侵入的方式。换句话说，应用代码应该完全不会知晓消息对象或者消息通道的存在。这类似于MVC模式中控制器角色的处理范式，例如： “消息端点处理消息”就像“控制器处理HTTP请求”。 \"消息终端被映射到"
  },
  {
    "title": "SpringBoo2t获取ApplicationContext的3种方式",
    "url": "/articles/2020/12/29/1609203099106.html",
    "type": "blog",
    "date": "2020-12-29",
    "topic": "Spring Boot 与后端框架",
    "topicSlug": "spring-backend",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "springboot上下文",
      "springboot获取bean"
    ],
    "excerpt": "ApplicationContext是什么？ 简单来说就是Spring中的容器，可以用来获取容器中的各种bean组件，注册监听事件，加载资源文件等功能。 Application Context获取的几种方式 1 直接使用Autowired注入 @Component public class Book1 { @Autow...",
    "guide": "本文归入「Spring Boot 与后端框架」专题，主要记录：ApplicationContext是什么？ 简单来说就是Spring中的容器，可以用来获取容器中的各种bean组件，注册监听事件，加载资源文件等功能。 Application Context获取的几种方式 1 直接使用Autowired注入 @Component public class Book1 { @Autow...",
    "content": "ApplicationContext是什么？ 简单来说就是Spring中的容器，可以用来获取容器中的各种bean组件，注册监听事件，加载资源文件等功能。 Application Context获取的几种方式 1 直接使用Autowired注入 @Component public class Book1 { @Autowired private ApplicationContext applicationContext; public void show (){ System.out.println(applicationContext.getClass()); } } 2 利用 spring4.3 的新特性 使用spring4.3新特性但是存在一定的局限性，必须满足以下两点： 构造函数只能有一个，如果有多个，就必须有一个无参数的构造函数，此时，spring会调用无参的构造函数 构造函数的参数，必须在spring容器中存在 @Component public class Book2 { private ApplicationContext applicationContext; p.... ApplicationContext是什么？ 简单来说就是Spring中的容器，可以用来获取容器中的各种bean组件，注册监听事件，加载资源文件等功能。 Application Context获取的几种方式 1 直接使用Autowired注入 2 利用 spring4.3 的新特性 使用spring4.3新特性但是存在一定的局限性，必须满足以下两点： 1. 构造函数只能有一个，如果有多个，就必须有一个无参数的构造函数，此时，spring会调用无参的构造函数 2. 构造函数的参数，必须在spring容器中存在 3 实现spring提供的接口 ApplicationContextAware spring 在bean 初始化后会判断是不是ApplicationContextAware的子类，调用setApplicationContext（）方法， 会将容器中ApplicationContext传入进去 结果获取三次："
  },
  {
    "title": "各种法则定律-引论",
    "url": "/articles/2020/12/25/1608882277320.html",
    "type": "blog",
    "date": "2020-12-25",
    "topic": "中间件与分布式",
    "topicSlug": "middleware-distributed",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "康威定律",
      "摩尔定律",
      "墨菲定律"
    ],
    "excerpt": "参考： 一、墨菲定律：如果事情可能出错，它就会出错。 二、布鲁克定律：大部分情况下，为已经延期的软件项目增加人手只会让项目延期得更厉害。 三、霍夫施塔特定律：项目的实际完成时间总是比预期的要长。 四、康威定律：组织所设计的系统的结构受限于组织的通信结构。（如果某人想要改变的东西属于其他人，那么他就很难改变这些东西。根据...",
    "guide": "本文归入「中间件与分布式」专题，主要记录：参考： 一、墨菲定律：如果事情可能出错，它就会出错。 二、布鲁克定律：大部分情况下，为已经延期的软件项目增加人手只会让项目延期得更厉害。 三、霍夫施塔特定律：项目的实际完成时间总是比预期的要长。 四、康威定律：组织所设计的系统的结构受限于组织的通信结构。（如果某人想要改变的东西属于其他人，那么他就很难改变这些东西。根据...",
    "content": "参考： 一、墨菲定律：如果事情可能出错，它就会出错。 二、布鲁克定律：大部分情况下，为已经延期的软件项目增加人手只会让项目延期得更厉害。 三、霍夫施塔特定律：项目的实际完成时间总是比预期的要长。 四、康威定律：组织所设计的系统的结构受限于组织的通信结构。（如果某人想要改变的东西属于其他人，那么他就很难改变这些东西。根据目标软件架构来组建团队可以更容易实现软件架构，而这就是对抗康威法律的一种有效方式 —— 微服务等架构） 五、 8/2 法则：80％的成果源于 20％的原因。 六、彼得法则：在一个等级制度中，每个员工都倾向于晋升到他无法胜任的职位。 七、摩尔定律：计算机的处理速度每两年翻一番！ 八、沃斯定律：软件比硬件更容易变慢。（可以参考摩尔定律） 九、克努特优化法则：过早优化是万恶之源。（先写代码，然后找出瓶颈，最后才优化！） 十、诺维格定律：当一家公司在某个领域的市场占有率超过 50% 以后，将无法再使市场占有率翻番，就必须寻找新的市场。 十一、羊群效应：从众心理 十二、蝴蝶效应：微小的变化能带来巨大的连锁反应 十三、青蛙效应：温水煮青蛙，生于忧患死于安乐 十四、破窗效应：墙倒众人推.... 参考： 一、墨菲定律：如果事情可能出错，它就会出错。 二、布鲁克定律：大部分情况下，为已经延期的软件项目增加人手只会让项目延期得更厉害。 三、霍夫施塔特定律：项目的实际完成时间总是比预期的要长。 四、康威定律：组织所设计的系统的结构受限于组织的通信结构。（如果某人想要改变的东西属于其他人，那么他就很难改变这些东西。根据目标软件架构来组建团队可以更容易实现软件架构，而这就是对抗康威法律的一种有效方式 —— 微服务等架构） 五、 8/2 法则：80％的成果源于 20％的原因。 六、彼得法则：在一个等级制度中，每个员工都倾向于晋升到他无法胜任的职位。 七、摩尔定律：计算机的处理速度每两年翻一番！ 八、沃斯定律：软件比硬件更容易变慢。（可以参考摩尔定律） 九、克努特优化法则：过早优化是万恶之源。（先写代码，然后找出瓶颈，最后才优化！） 十、诺维格定律：当一家公司在某个领域的市场占有率超过 50% 以后，将无法再使市场占有率翻番，就必须寻找新的市场。 十一、羊群效应：从众心理 十二、蝴蝶效应：微小的变化能带来巨大的连锁反应 十三、青蛙效应：温水煮青蛙，生于忧患死于安乐 十四、破窗效应：墙倒众人推，落井下石人很多。 十五、马太效应：两极分化，强者越强，弱者越弱。 十六、波克定理：无摩擦便无磨合，有争论才有高论。在争辩中，才可能诞生最好的主意和最好的决定。 十七、刺猬理论：人际交往中需要保持一定的距离，才能互惠互利，否则容易受伤。 十八、沃尔森法则：把信息和情报放在第一位，金钱就会滚滚而来。把握信息差，就能变现。情报信息最值钱。 十九、吉德林法则：把难题清清楚楚地写出来,便已经解决了一半。 二十、幸存者偏差：人们只能看到经过某中筛选而产生的結果。被筛选掉的信息是无法传达到你这边的，只能接收到片面的信息，因为死人是不会说话的。"
  },
  {
    "title": "springBoot2中webflux集成swagger2",
    "url": "/articles/2020/12/25/1608861698265.html",
    "type": "blog",
    "date": "2020-12-25",
    "topic": "Spring Boot 与后端框架",
    "topicSlug": "spring-backend",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Spring Boot",
      "Swagger"
    ],
    "excerpt": "1.pom文件中引用如下 &lt;dependency&gt; &lt;groupId&gt;io.springfox&lt;/groupId&gt; &lt;artifactId&gt;springfoxbootstarter&lt;/artifactId&gt; &lt;version&gt;3.0.0&lt;/v...",
    "guide": "本文归入「Spring Boot 与后端框架」专题，主要记录：1.pom文件中引用如下 &lt;dependency&gt; &lt;groupId&gt;io.springfox&lt;/groupId&gt; &lt;artifactId&gt;springfoxbootstarter&lt;/artifactId&gt; &lt;version&gt;3.0.0&lt;/v...",
    "content": "1.pom文件中引用如下 &lt;dependency&gt; &lt;groupId&gt;io.springfox&lt;/groupId&gt; &lt;artifactId&gt;springfoxbootstarter&lt;/artifactId&gt; &lt;version&gt;3.0.0&lt;/version&gt; &lt;/dependency&gt; 2.添加swagger2配置文件 @Configuration @EnableSwagger2 public class SwaggerConfiguration { @Bean public Docket createRestApi() { return new Docket(DocumentationType.SWAGGER2) .apiInfo(apiInfo()) .select() .apis(RequestHandlerSelectors.basePackage(\"com..controller\")) .paths(PathSelectors.any()) .build(); } priv.... 1.pom文件中引用如下 2.添加swagger2配置文件 3.启动服务访问 原版页面地址：http://127.0.0.1:8080/swaggerui/index.html"
  },
  {
    "title": "springBoot2动态数据源以及Mybatis多数据源",
    "url": "/articles/2020/12/25/1608861326670.html",
    "type": "blog",
    "date": "2020-12-25",
    "topic": "Spring Boot 与后端框架",
    "topicSlug": "spring-backend",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "MyBatis Plus",
      "动态数据源",
      "切换数据源",
      "Spring Boot"
    ],
    "excerpt": "一、前言 由于项目中读写分离，或者分库分表导致数据库连接有很多。这个时候我们常常会切换多数据源进行业务的合并。mybatisplus 团队新增了dynamicdatasourcespringbootstarter 用来动态切换数据源。 &lt;dependency&gt; &lt;groupId&gt;com.baom...",
    "guide": "本文归入「Spring Boot 与后端框架」专题，主要记录：一、前言 由于项目中读写分离，或者分库分表导致数据库连接有很多。这个时候我们常常会切换多数据源进行业务的合并。mybatisplus 团队新增了dynamicdatasourcespringbootstarter 用来动态切换数据源。 &lt;dependency&gt; &lt;groupId&gt;com.baom...",
    "content": "一、前言 由于项目中读写分离，或者分库分表导致数据库连接有很多。这个时候我们常常会切换多数据源进行业务的合并。mybatisplus 团队新增了dynamicdatasourcespringbootstarter 用来动态切换数据源。 &lt;dependency&gt; &lt;groupId&gt;com.baomidou&lt;/groupId&gt; &lt;artifactId&gt;dynamicdatasourcespringbootstarter&lt;/artifactId&gt; &lt;version&gt;3.1.0&lt;/version&gt; &lt;/dependency&gt; 二、配置 2.1pom配置 &lt;dependency&gt; &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt; &lt;artifactId&gt;springbootstarterwebflux&lt;/artifactId&gt; &lt;/dependency&gt; &lt;de.... 一、前言 由于项目中读写分离，或者分库分表导致数据库连接有很多。这个时候我们常常会切换多数据源进行业务的合并。mybatisplus 团队新增了dynamicdatasourcespringbootstarter 用来动态切换数据源。 二、配置 2.1pom配置 禁用DataSourceAutoConfiguration 如果DataSourceAutoConfiguration不禁用的话，就会报错，多个数据源，无法装配哪一个。在springBoot的主程序入口的注解 配置yml 使用 @DS 切换数据源。 @DS 可以注解在方法上和类上，同时存在方法注解优先于类上注解。 没有@DS 走默认数据源，（primary: master 设置默认的数据源或者数据源组，默认值即为 master ） 如果有根据DS的内容走。 官网地址: https://baomidou.com/guide/dynamicdatasource.html"
  },
  {
    "title": "MySQL 5.7root用户密码修改",
    "url": "/articles/2020/12/16/1608097523728.html",
    "type": "blog",
    "date": "2020-12-16",
    "topic": "MySQL 与数据架构",
    "topicSlug": "mysql-data",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "MySQL",
      "更新密码",
      "root密码"
    ],
    "excerpt": "在MySQL 5.7 password字段已从mysql.user表中删除，新的字段名是“authenticalionstring”. 选择数据库：use mysql; 更新root的密码： update user set authenticationstring=password('新密码') where user=...",
    "guide": "本文归入「MySQL 与数据架构」专题，主要记录：在MySQL 5.7 password字段已从mysql.user表中删除，新的字段名是“authenticalionstring”. 选择数据库：use mysql; 更新root的密码： update user set authenticationstring=password('新密码') where user=...",
    "content": "在MySQL 5.7 password字段已从mysql.user表中删除，新的字段名是“authenticalionstring”. 选择数据库：use mysql; 更新root的密码： update user set authenticationstring=password('新密码') where user='root' and Host='localhost'; flush privileges; 在MySQL 5.7 password字段已从mysql.user表中删除，新的字段名是“authenticalionstring”. 选择数据库：use mysql; 更新root的密码："
  },
  {
    "title": "Java反射生成对象",
    "url": "/articles/2020/11/10/1605006483827.html",
    "type": "blog",
    "date": "2020-11-10",
    "topic": "Java 与 JVM",
    "topicSlug": "java-jvm",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Java",
      "反射",
      "对象创建",
      "声明方法使用"
    ],
    "excerpt": "想要了解反射生成class和创建java对象，首先我们要了解什么是反射？ 一、什么是反射？ Java反射说的是在运行状态中，对于任何一个类，我们都能够知道这个类有哪些方法和属性。对于任何一个对象，我们都能够对它的方法和属性进行调用。我们把这种动态获取对象信息和调用对象方法的功能称之为反射机制。 二、反射生成Class的...",
    "guide": "本文归入「Java 与 JVM」专题，主要记录：想要了解反射生成class和创建java对象，首先我们要了解什么是反射？ 一、什么是反射？ Java反射说的是在运行状态中，对于任何一个类，我们都能够知道这个类有哪些方法和属性。对于任何一个对象，我们都能够对它的方法和属性进行调用。我们把这种动态获取对象信息和调用对象方法的功能称之为反射机制。 二、反射生成Class的...",
    "content": "想要了解反射生成class和创建java对象，首先我们要了解什么是反射？ 一、什么是反射？ Java反射说的是在运行状态中，对于任何一个类，我们都能够知道这个类有哪些方法和属性。对于任何一个对象，我们都能够对它的方法和属性进行调用。我们把这种动态获取对象信息和调用对象方法的功能称之为反射机制。 二、反射生成Class的三种方式 1.第一种方式（利用getClass（）方法） User user = new User(); Class class= user.getClass(); 2.第二种方式（直接对象的.class） Class cla = User.class 3.第三种方式（Class.forName()） Class cla = Class.forName(\"com.jackssy.User\"); 注意：此种方法通过对象的全路径来获取Class的，当对象不存在时，会出现ClassNotFoundException异常。详细的可以看下Class.forName()的底层代码。 三、反射生成java对象的两种方式 1.第一种方式newInstance(); 调用public.... 想要了解反射生成class和创建java对象，首先我们要了解什么是反射？ 一、什么是反射？ Java反射说的是在运行状态中，对于任何一个类，我们都能够知道这个类有哪些方法和属性。对于任何一个对象，我们都能够对它的方法和属性进行调用。我们把这种动态获取对象信息和调用对象方法的功能称之为反射机制。 二、反射生成Class的三种方式 1.第一种方式（利用getClass（）方法） 2.第二种方式（直接对象的.class） 3.第三种方式（Class.forName()） 注意：此种方法通过对象的全路径来获取Class的，当对象不存在时，会出现ClassNotFoundException异常。详细的可以看下Class.forName()的底层代码。 三、反射生成java对象的两种方式 1.第一种方式newInstance(); 调用public无参构造器 ，若是没有，则会报异常 Object o = clazz.newInstance(); 没有无参构造函数异常： 2.第二种方式： 有带参数的构造函数的类，先获取到其构造对象，再通过该构造方法类获取实例： / /获取构造函数类的对象 Constroctor constroctor = User.class.getConstructor(String.class); // 使用构造器对象的newInstance方法初始化对象 Object obj = constroctor.newInstance(\"name\"); 四、使用reflectasm调用生成对象调用 1. 依赖 2.代码 3.结论 每种方式执行1亿次运行结果如下： get耗时35ms 缓存反射耗时223ms reflectasm先拿到方法index反射耗时39ms reflectasm每次按照方法名查找然后反射耗时350ms reflectasm相比通过名称来访问成员，使用索引的方式会更快。如果需要重复地访问同一个成员，那么通过索引来访问该成员效率更高 4.reflectasm原理为啥这么快 jdk反射慢原因有三: 1.变长参数方法导致的 Object 数组 2.基本类型的自动装箱、拆箱 3.还有最重要的方法内联 reflectasm快原因: ReflectASM是一个很小的java类库，主要是通过asm生产类来实现java反射。他的主要代码还是get方法，但是由于get方法源码比较多，就不在博客中贴出来了，大家可以自己点进去看。这里我们给出实现invoke的抽象方法。 由代码可以看出来，实际上ReflectASM就是把类的各个方法缓存起来，然后通过case选择，直接调用，因此速度会快上很多。但是它的get方法同样会消耗很大的时间，因此就算是使用ReflectASM的朋友也记得请在启动的时候就初始化get方法计入缓存 读写字段 通过 FieldAccess 可以读写类的字段： 调用方法 通过 MethodAccess 可以调用对象实例的方法： 构造实例 通过 ConstructorAccess 可以构造对象实例： 索引 相比通过名称来访问成员，使用索引的方式会更快。如果需要重复地访问同一个成员，那么通过索引来访问该成员效率更高： 遍历字段 遍历一个类的所有字段："
  },
  {
    "title": "Java 逐行读取文本文件的几种方式以及效率对比",
    "url": "/articles/2020/11/10/1605004504728.html",
    "type": "blog",
    "date": "2020-11-10",
    "topic": "Java 与 JVM",
    "topicSlug": "java-jvm",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "java行模式读取文件",
      "读文件效率对比"
    ],
    "excerpt": "先放结果 1000000 行文本读取结果比对: BufferedReader 耗时: 49ms Scanner 耗时: 653ms Apache Commons IO 耗时: 44ms InputStreamReader 耗时: 191ms FileInputStream 耗时: 3171ms BufferedInpu...",
    "guide": "本文归入「Java 与 JVM」专题，主要记录：先放结果 1000000 行文本读取结果比对: BufferedReader 耗时: 49ms Scanner 耗时: 653ms Apache Commons IO 耗时: 44ms InputStreamReader 耗时: 191ms FileInputStream 耗时: 3171ms BufferedInpu...",
    "content": "先放结果 1000000 行文本读取结果比对: BufferedReader 耗时: 49ms Scanner 耗时: 653ms Apache Commons IO 耗时: 44ms InputStreamReader 耗时: 191ms FileInputStream 耗时: 3171ms BufferedInputStream 耗时: 70ms FileUtils 耗时: 46ms Files 耗时: 99ms 24488656 行文本读取结果比对: BufferedReader 耗时: 989ms Scanner 耗时: 11899ms Apache Commons IO 耗时: 568ms InputStreamReader 耗时: 3377ms FileInputStream 耗时: 78903ms BufferedInputStream 耗时: 1480ms FileUtils 耗时: 16569ms Files 耗时: 25162ms 可见, 当文件较小时: ApacheCommonsIO 流 表现最佳; FileUtils,BufferedReader 居其二;.... 先放结果 1000000 行文本读取结果比对: 24488656 行文本读取结果比对: 可见, 当文件较小时: ApacheCommonsIO 流 表现最佳; FileUtils,BufferedReader 居其二; BufferedInputStream,Files 随其后; InputStreamReader,Scanner,FileInputStream 略慢. 当文件较大时, Apache Commons IO 流, BufferedReader 依然出色, Files, FileUtils 速度开始变慢. 简要分析 使用到的工具类包括: java.io.BufferedReader java.util.Scanner org.apache.commons.io.FileUtils java.io.InputStreamReader java.io.FileInputStream java.io.BufferedInputStream com.google.common.io.Files 其中: Apache Commons IO 流 和 BufferedReader 使用到了缓冲区, 所以在不消耗大量内存的情况下提高了处理速度; FileUtils 和 Files 是先把文件内容全部读入内存, 然后在进行操作, 是典型的空间换时间案例. 这种方法可能会大量消耗内存, 建议酌情使用; 其他几个工具类本来就不擅长逐行读取, 效率底下也是情理之中. 建议 在逐行读取文本内容的需求下，建议使用 Apache Commons IO 流，或者 BufferedReader, 既不会过多地占用内存，也保证了优异的处理速度. 附录 源代码: 参考文献: [[Java] 读取文件方法大全](http://www.cnblogs.com/lovebread/archive/2009/11/23/1609122.html) — lovebread java 读取文件 API 速度对比 — fengxingzhe001 Java 高效读取大文件 — Eugen Paraschiv [文] / ImportNew 进林 [译] https://blog.diqigan.cn/posts/javareadfilebyline.html"
  },
  {
    "title": "缓存和数据库一致性问题",
    "url": "/articles/2020/11/04/1604469398210.html",
    "type": "blog",
    "date": "2020-11-04",
    "topic": "MySQL 与数据架构",
    "topicSlug": "mysql-data",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "分布式",
      "数据库更新",
      "缓存更新",
      "分布式缓存一致性"
    ],
    "excerpt": "问题： 你只要用缓存，就可能会涉及到缓存与数据库双存储双写，你只要是双写，就一定会有数据一致性的问题，那么你如何解决一致性问题？ 分析： 先做一个说明，从理论上来说，有两种处理思维，一种需保证数据强一致性，这样性能肯定大打折扣；另外我们可以采用最终一致性，保证性能的基础上，允许一定时间内的数据不一致，但最终数据是一致的...",
    "guide": "本文归入「MySQL 与数据架构」专题，主要记录：问题： 你只要用缓存，就可能会涉及到缓存与数据库双存储双写，你只要是双写，就一定会有数据一致性的问题，那么你如何解决一致性问题？ 分析： 先做一个说明，从理论上来说，有两种处理思维，一种需保证数据强一致性，这样性能肯定大打折扣；另外我们可以采用最终一致性，保证性能的基础上，允许一定时间内的数据不一致，但最终数据是一致的...",
    "content": "问题： 你只要用缓存，就可能会涉及到缓存与数据库双存储双写，你只要是双写，就一定会有数据一致性的问题，那么你如何解决一致性问题？ 分析： 先做一个说明，从理论上来说，有两种处理思维，一种需保证数据强一致性，这样性能肯定大打折扣；另外我们可以采用最终一致性，保证性能的基础上，允许一定时间内的数据不一致，但最终数据是一致的。 1 强一致性思想 这种考虑方式就要用到分布式事务，比如2PC、tcc、Paxos协议等都可以保证一致性。 我们还可以通过读请求和写请求串行化，串到一个内存队列里去。 串行化可以保证一定不会出现不一致的情况，但是它也会导致系统的吞吐量大幅度降低，用比正常情况下多几倍的机器去支撑线上的一个请求。 2 最终一致性思想 从理论上来说，给缓存设置过期时间，是保证最终一致性的解决方案。这种方案下，我们可以对存入缓存的数据设置过期时间，所有的写操作以数据库为准，对缓存操作只是尽最大努力即可。也就是说如果数据库写成功，缓存更新失败，那么只要到达过期时间，则后面的读请求自然会从数据库中读取新值然后回填缓存。 那么接下来，我们只需要讨论更新的策略了。 (1)先更新.... 问题： 分析： 1 强一致性思想 2 最终一致性思想 (1)先更新数据库，还是先更新缓存 先更新数据库 先更新缓存 不再更新缓存，直接删除，为什么？ 业务角度考虑 性价比角度考虑 举个栗子，一个缓存涉及的表的字段，在 1 分钟内就修改了 20 次，或者是 100 次，那么缓存更新 20 次、100 次；但是这个缓存在 1 分钟内只被读取了 1 次，有大量的冷数据。实际上，如果你只是删除缓存的话，那么在 1 分钟内，这个缓存不过就重新计算一次而已，开销大幅度降低。用到缓存才去算缓存。 设计角度考虑 (2)先删缓存，再更新数据库 问题一：线程顺序 问题二：如果你用了mysql的读写分离架构怎么办？ 解决一：采用延时双删策略 伪代码如下 那么，这个1秒怎么确定的，具体该休眠多久呢？ 采用这种同步淘汰策略，吞吐量降低怎么办？ 解决二：异步 （1）请求A进行写操作，删除缓存 （2）请求B查询发现缓存不存在 （3）请求B去数据库查询得到旧值 （4）请求B将旧值写入缓存 （5）请求A将新值写入数据库 （6）请求A试图去删除请求B写入对缓存值，结果失败了。 ok,这也就是说。如果第二次删除缓存失败，会再次出现缓存和数据库不一致的问题。 如何解决呢？我们继续往下看。 (3)先更新数据库，再删缓存 CacheAside pattern 问题 解决 异步优化方式：消息队列 异步优化方式：基于订阅binlog的同步机制 流程如下图所示： 参考： 如何保证缓存与数据库一致性 Java进阶面试必问：如何保证缓存与数据库的双写一致性？ 数据库缓存最终一致性的四种方案，你真的了解过吗？"
  },
  {
    "title": "Drools语法",
    "url": "/articles/2020/10/29/1603968711195.html",
    "type": "blog",
    "date": "2020-10-29",
    "topic": "工具、效率与博客建设",
    "topicSlug": "tools-blog",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Drools",
      "规则引擎"
    ],
    "excerpt": "Drools语法Language 关键词 Hard keywords(Cannot use any): true,false,null Soft keywords(avoid use) lockonactive dateeffective dateexpires noloop autofocus activationg...",
    "guide": "本文归入「工具、效率与博客建设」专题，主要记录：Drools语法Language 关键词 Hard keywords(Cannot use any): true,false,null Soft keywords(avoid use) lockonactive dateeffective dateexpires noloop autofocus activationg...",
    "content": "Drools语法Language 关键词 Hard keywords(Cannot use any): true,false,null Soft keywords(avoid use) lockonactive dateeffective dateexpires noloop autofocus activationgroup agendagroup ruleflowgroup entrypoint duration package import dialect salience enabled attributes rule extend when then template query declare function global eval not in or and exists forall accumulate collect from action reverse result end over init 注释 单行注释 rule \"Testing Comments\" when // this is a single line com.... Drools语法Language 关键词 Hard keywords(Cannot use any): true,false,null Soft keywords(avoid use) lockonactive dateeffective dateexpires noloop autofocus activationgroup agendagroup ruleflowgroup entrypoint duration package import dialect salience enabled attributes rule extend when then template query declare function global eval not in or and exists forall accumulate collect from action reverse result end over init 注释 单行注释 多行注释 Pakage package package表示一个命名空间.package是必须定义的，必须放在规则文件第一行. import import语句的工作方式类似于Java中的import语句。您需要为要在规则中使用的任何对象指定完全限定路径和类型名称。 global global用于定义全局变量。 Rules: Set the global value: Function function function是一种将语义代码放置在规则源文件中的方法，而不是普通的Java类 Query query query是一种搜索工作内存中与指定条件匹配的事实的简单方法. Rule rule定义规则。rule \"ruleName\"。 一个规则可以包含三个部分：属性部分,条件部分：即LHS,结果部分：即RHS. 属性部分Attributes 定义当前规则执行的一些属性等，比如是否可被重复执行、过期时间、生效时间等。 activationgroup agendagroup autofocus dateeffective dateexpires dialect duration durationvalue enabled lockonactive noloop ruleflowgroup salience noloop 默认值：false 类型：Boolean 在一个规则当中如果条件满足就对Working Memory当中的某个Fact对象进行了修改，比如使用update 将其更新到当前的Working Memory当中，这时引擎会再次检查所有的规则是否满足条件，如果满足会再次执行. ruleflowgroup 默认值：N/A 类型：String Ruleflow是一个Drools功能，可让您控制规则的触发。由相同的规则流组标识汇编的规则仅在其组处于活动状态时触发。将规则划分为一个个的组，然后在规则流当中通过使用ruleflowgroup属性的值，从而使用对应的规则。 lockonactive 默认值：false 类型：Boolean 当在规则上使用ruleflowgroup 属性或agendagroup 属性的时候，将lockonaction 属性的值设置为true，可能避免因某些Fact 对象被修改而使已经执行过的规则再次被激活执行。可以看出该属性与noloop 属性有相似之处，noloop 属性是为了避免Fact 修改或调用了insert、retract、update 之类而导致规则再次激活执行，这里的lockonaction 属性也是起这个作用，lockonactive 是noloop 的增强版属性，它主要作用在使用ruleflowgroup 属性或agendagroup 属性的时候 salience 默认值：0 类型：integer 设置规则执行的优先级，salience 属性的值是一个数字，数字越大执行优先级越高，同时它的值可以是一个负数. 规则的salience 默认值为0，所以如果我们不手动设置规则的salience 属性，那么它的执行顺序是随机的. agendagroup 默认值：MAIN 类型：String 规则的调用与执行是通过StatelessSession 或StatefulSession 来实现的，一般的顺序是创建一个StatelessSession 或StatefulSession，将各种经过编译的规则的package 添加到session当中，接下来将规则当中可能用到的Global对象和Fact对象插入到Session 当中，最后调用fireAllRules 方法来触发、执行规则。在没有调用最后一步fireAllRules方法之前，所有的规则及插入的Fact对象都存放在一个名叫Agenda表的对象当中，这个Agenda表中每一个规则及与其匹配相关业务数据叫做Activation，在调用fireAllRules方法后，这些Activation 会依次执行，这些位于Agenda 表中的Activation 的执行顺序在没有设置相关用来控制顺序的属性时（比如salience 属性），它的执行顺序是随机的，不确定的。Agenda Group 是用来在Agenda 的基础之上，对现在的规则进行再次分组，具体的分组方法可以采用为规则添加agendagroup属性来实现。agendagroup 属性的值也是一个字符串，通过这个字符串，可以将规则分为若干个Agenda Group，默认情况下，引擎在调用这些设置了agendagroup 属性的规则的时候需要显示的指定某个Agenda Group 得到Focus（焦点），这样位于该Agenda Group 当中的规则才会触发执行，否则将不执行。 autofocus 默认值：false 类型：Boolean 用来在已设置了agendagroup的规则上设置该规则是否可以自动独取Focus，如果该属性设置为true，那么在引擎执行时，就不需要显示的为某个Agenda Group设置Focus，否则需要。对于规则的执行的控制，还可以使用Agenda Filter 来实现。在Drools 当中，提供了一个名为org.drools.runtime.rule.AgendaFilter 的Agenda Filter 接口，用户可以实现该接口，通过规则当中的某些属性来控制规则要不要执行。org.drools.runtime.rule.AgendaFilter 接口只有一个方法需要实现，方法体如下： public boolean accept(Activation activation); 在该方法当中提供了一个Activation 参数，通过该参数我们可以得到当前正在执行的规则对象或其它一些属性，该方法要返回一个布尔值，该布尔值就决定了要不要执行当前这个规则，返回true 就执行规则，否则就不执行。 activationgroup 默认值：N/A 类型：String 该属性的作用是将若干个规则划分成一个组，用一个字符串来给这个组命名，这样在执行的时候，具有相同activationgroup属性的规则中只要有一个会被执行，其它的规则都将不再执行。也就是说，在一组具有相同activationgroup属性的规则当中，只有一个规则会被执行，其它规则都将不会被执行。当然对于具有相同activationgroup属性的规则当中究竟哪一个会先执行，则可以用类似salience之类属性来实现。 dialect 默认值： 根据package指定 类型：String，\"java\" or \"mvel\" dialect种类是用于LHS或RHS代码块中的任何代码表达式的语言。目前有两种dialect，Java和MVEL。虽然dialect可以在包级别指定，但此属性允许为规则覆盖包定义。 dateeffective 默认值：N/A 类型：字符串，包含日期和时间定义。格式：ddMMMyyyy(25Sep2009). 仅当当前日期和时间在日期有效属性后面时，才能激活规则。 dateexpires 默认值：N/A 类型：字符串，包含日期和时间定义。格式：ddMMMyyyy(25Sep2009). 如果当前日期和时间在dateexpires属性之后，则无法激活规则. enabled 默认值：false 类型：String 表示规则是可用的，如果手工为一个规则添加"
  },
  {
    "title": "线程流转状态图",
    "url": "/articles/2020/10/22/1603355147679.html",
    "type": "blog",
    "date": "2020-10-22",
    "topic": "Java 与 JVM",
    "topicSlug": "java-jvm",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Thread",
      "线程状态转换"
    ],
    "excerpt": "新建状态(New): 线程对象被创建后，就进入了新建状态。例如，Thread thread = new Thread()。 就绪状态(Runnable): 也被称为“可执行状态”。线程对象被创建后，其它线程调用了该对象的start()方法，从而来启动该线程。例如，thread.start()。处于就绪状态的线程，随时可...",
    "guide": "本文归入「Java 与 JVM」专题，主要记录：新建状态(New): 线程对象被创建后，就进入了新建状态。例如，Thread thread = new Thread()。 就绪状态(Runnable): 也被称为“可执行状态”。线程对象被创建后，其它线程调用了该对象的start()方法，从而来启动该线程。例如，thread.start()。处于就绪状态的线程，随时可...",
    "content": "新建状态(New): 线程对象被创建后，就进入了新建状态。例如，Thread thread = new Thread()。 就绪状态(Runnable): 也被称为“可执行状态”。线程对象被创建后，其它线程调用了该对象的start()方法，从而来启动该线程。例如，thread.start()。处于就绪状态的线程，随时可能被CPU调度执行。 运行状态(Running) : 线程获取CPU权限进行执行。需要注意的是，线程只能从就绪状态进入到运行状态。 阻塞状态(Blocked) : 阻塞状态是线程因为某种原因放弃CPU使用权，暂时停止运行。直到线程进入就绪状态，才有机会转到运行状态。阻塞的情况分三种： (01) 等待阻塞（左下角Blocket） 通过调用线程的wait()方法，让线程等待某工作的完成。该方法会释放锁，进入等待池。当他唤醒后就进入锁池等待获得锁，获得锁后继续完成wait()方法后面的代码，才能进入到就绪状态。 (02) 同步阻塞 （右下角Blocket） 线程在获取synchronized同步锁失败(因为锁被其它线程所占用)，它会进入同步阻塞状态（进入锁池）。 (0.... 1. 新建状态(New): 线程对象被创建后，就进入了新建状态。例如，Thread thread = new Thread()。 2. 就绪状态(Runnable): 也被称为“可执行状态”。线程对象被创建后，其它线程调用了该对象的start()方法，从而来启动该线程。例如，thread.start()。处于就绪状态的线程，随时可能被CPU调度执行。 3. 运行状态(Running) : 线程获取CPU权限进行执行。需要注意的是，线程只能从就绪状态进入到运行状态。 4. 阻塞状态(Blocked) : 阻塞状态是线程因为某种原因放弃CPU使用权，暂时停止运行。直到线程进入就绪状态，才有机会转到运行状态。阻塞的情况分三种： (01) 等待阻塞（左下角Blocket） 通过调用线程的wait()方法，让线程等待某工作的完成。该方法会释放锁，进入等待池。当他唤醒后就进入锁池等待获得锁，获得锁后继续完成wait()方法后面的代码，才能进入到就绪状态。 (02) 同步阻塞 （右下角Blocket） 线程在获取synchronized同步锁失败(因为锁被其它线程所占用)，它会进入同步阻塞状态（进入锁池）。 (03) 其他阻塞（最上面的Blocket） 通过调用线程的sleep()（sleep不会释放锁）或join()或发出了I/O请求时，线程会进入到阻塞状态。当sleep()状态超时、join()等待线程终止或者超时、或者I/O处理完毕时，线程重新转入就绪状态。 5. 死亡(dead) :线程 run ()、 main () 方法执行结束，或者因异常退出了 run ()方法，则该线程结束生命周期。死亡的线程不可再次复生。 yield相关 我们知道 start() 方法是启动线程，让线程变成就绪状态等待 CPU 调度后执行。 那 yield() 方法是干什么用的呢？来看下源码。 yield 即 “谦让”，也是 Thread 类的方法。它让掉当前线程 CPU 的时间片，使正在运行中的线程重新变成就绪状态，并重新竞争 CPU 的调度权。它可能会获取到，也有可能被其他线程获取到。 实战 下面是一个使用示例。 这个示例每当执行完 20 个之后就让出 CPU，每次谦让后就会马上获取到调度权继续执行。 运行以上程序，可以有以下两种结果。 结果1：栈长让出了 CPU 资源，小蜜成功上位。 结果2：栈长让出了 CPU 资源，栈长继续运行。 而如果我们把两个线程加上线程优先级，那输出的结果又不一样。 因为给小蜜加了最高优先权，栈长加了最低优先权，即使栈长先启动，那小蜜还是有很大的概率比栈长先会输出完的，大家可以试一下。 yield 和 sleep 的异同 1. yield, sleep 都能暂停当前线程，sleep 可以指定具体休眠的时间，而 yield 则依赖 CPU 的时间片划分。 2. yield, sleep 两个在暂停过程中，如已经持有锁，则都不会释放锁资源。 3. yield 不能被中断，而 sleep 则可以接受中断。 如果一定要用它的话，一句话解释就是：yield 方法可以很好的控制多线程，如执行某项复杂的任务时，如果担心占用资源过多，可以在完成某个重要的工作后使用 yield 方法让掉当前 CPU 的调度权，等下次获取到再继续执行，这样不但能完成自己的重要工作，也能给其他线程一些运行的机会，避免一个线程长时间占有 CPU 资源。"
  },
  {
    "title": "Ubuntu 搭建Zookeeper服务",
    "url": "/articles/2020/09/10/1599717501006.html",
    "type": "blog",
    "date": "2020-09-10",
    "topic": "Linux 运维与部署",
    "topicSlug": "linux-ops",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Zookeeper",
      "CentOS",
      "Linux"
    ],
    "excerpt": "1、下载安装包 官方下载地址http://apache.fayea.com/zookeeper/ 2、安装 安装前确保系统已安装过JDK，JDK安装过程可参照 2.1 解压下载好的tar.gz安装包到某个目录下，可使用命令： tar zxvf zookeeper3.5.4beta.tar.gz 2.2 进入解压目录的c...",
    "guide": "本文归入「Linux 运维与部署」专题，主要记录：1、下载安装包 官方下载地址http://apache.fayea.com/zookeeper/ 2、安装 安装前确保系统已安装过JDK，JDK安装过程可参照 2.1 解压下载好的tar.gz安装包到某个目录下，可使用命令： tar zxvf zookeeper3.5.4beta.tar.gz 2.2 进入解压目录的c...",
    "content": "1、下载安装包 官方下载地址http://apache.fayea.com/zookeeper/ 2、安装 安装前确保系统已安装过JDK，JDK安装过程可参照 2.1 解压下载好的tar.gz安装包到某个目录下，可使用命令： tar zxvf zookeeper3.5.4beta.tar.gz 2.2 进入解压目录的conf目录，复制配置文件zoosample.cfg并命名为zoo.cfg，相关命令为： cp zoosample.cfg zoo.cfg 2.3 编辑zoo.cfg文件 vi zoo.cfg 主要修改如下： 增加dataDir和dataLogDir目录，目录自己创建并指定，用作数据存储目录和日志文件目录 dataDir=/home/local/zk/data dataLogDir=/home/local/zk/logs 指定server地址，server.id=hostname:port:port。第一个端口用于集合体中的 follower 以侦听 leader；第二个端口用于 Leader 选举。第一个hostname即为本服务器地址 serve.... 1、下载安装包 官方下载地址http://apache.fayea.com/zookeeper/ 2、安装 安装前确保系统已安装过JDK，JDK安装过程可参照 2.1 解压下载好的tar.gz安装包到某个目录下，可使用命令： 2.2 进入解压目录的conf目录，复制配置文件zoosample.cfg并命名为zoo.cfg，相关命令为： 2.3 编辑zoo.cfg文件 主要修改如下： 2.4 修改好zoo.cfg配置之后，在创建好的data目录中添加myid文件，里面的内容设置为zoo.cfg中配置的server.1中的数字，即1，有多台可以进行类似配置。 2.5 配置系统环境变量 添加 使添加的配置其生效 2.6 服务启动及客户端相连，最好是在root用户下启动 启动完之后可以查看启动状态 客户端连接 连接成功如下图： 之后就可以使用一些基础命令，比如 ls，create，delete，get 来测试了。 3、ZK常用命令 3.1 ZK服务命令 3.2 ZK客户端命令"
  },
  {
    "title": "HAProxy常见的安装方式",
    "url": "/articles/2020/08/28/1598616084150.html",
    "type": "blog",
    "date": "2020-08-28",
    "topic": "Linux 运维与部署",
    "topicSlug": "linux-ops",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "haproxy",
      "Nginx",
      "负载",
      "动态代理"
    ],
    "excerpt": "1&gt;.什么是负载均衡 负载均衡(Load Balance，简称LB)是一种服务或基于硬件设备等实现的高可用反向代理技术，负载均衡将特定的业务(web服务、网络流量等)分担给指定的一个或多个后端特定的服务器或设备，从而提高了公司业务的并发处理能力、保证了业务的高可用性、方便了业务后期的水平动态扩展。 博主推荐阅读:...",
    "guide": "本文归入「Linux 运维与部署」专题，主要记录：1&gt;.什么是负载均衡 负载均衡(Load Balance，简称LB)是一种服务或基于硬件设备等实现的高可用反向代理技术，负载均衡将特定的业务(web服务、网络流量等)分担给指定的一个或多个后端特定的服务器或设备，从而提高了公司业务的并发处理能力、保证了业务的高可用性、方便了业务后期的水平动态扩展。 博主推荐阅读:...",
    "content": "1&gt;.什么是负载均衡 负载均衡(Load Balance，简称LB)是一种服务或基于硬件设备等实现的高可用反向代理技术，负载均衡将特定的业务(web服务、网络流量等)分担给指定的一个或多个后端特定的服务器或设备，从而提高了公司业务的并发处理能力、保证了业务的高可用性、方便了业务后期的水平动态扩展。 博主推荐阅读: https://yq.aliyun.com/articles/1803 2&gt;.为什么使用负载均衡 Web服务器的动态水平扩展 对用户无感知 增加业务并发访问及处理能力 解决单服务器瓶颈问题(单点故障) 节约公网IP地址 降低IT支出成本 隐藏内部服务器IP 提高内部服务器安全性 配置简单 固定格式的配置文件 功能丰富 支持四层和七层，支持动态下线主机 性能较强 并发数万甚至数十万 3&gt;.常见有哪些负载均衡 软件负载(一般选择开源软件)： 四层(可以和硬件防火墙相抗衡的性能)： LVS(Linux Virtual Server，生产环境中大多使用DR模.... 1.什么是负载均衡 2.为什么使用负载均衡 3.常见有哪些负载均衡 4.典型的负载均衡应用场景 二.HaProxy概述 1.什么是HAProxy 2.调度器集群(Load Balance Cluster,简称LB Cluster) 3.HAProxy功能 三.yum安装HAProxy 1.CentOS安装HAProxy(温馨提示:较新haproxy1.8版本中，比如动态禁用后端服务器，日志管理等功能支持的并没有haproxy1.5系列要友好) 2.Ubantu安装HAProxy 程序环境 配置文件的配置段说明 HAProxy的global配置参数 HAProxy的Proxies配置参数 haproxy配置"
  },
  {
    "title": "关于Mono和Flux的理解",
    "url": "/articles/2020/06/18/1592473791199.html",
    "type": "blog",
    "date": "2020-06-18",
    "topic": "Java 与 JVM",
    "topicSlug": "java-jvm",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Mono",
      "Flux",
      "Reactor",
      "WebFlux"
    ],
    "excerpt": "关于java的响应式编程框架SpringReactor 关于Reactor的介绍 Reactor是Spring中的一个子项目是一个基于java的响应式编程框架，此框架是 Pivotal 公司（开发 Spring 等技术的公司）开发的，实现了 Reactive Programming（反应式编程即响应式编程） 思想，符合...",
    "guide": "本文归入「Java 与 JVM」专题，主要记录：关于java的响应式编程框架SpringReactor 关于Reactor的介绍 Reactor是Spring中的一个子项目是一个基于java的响应式编程框架，此框架是 Pivotal 公司（开发 Spring 等技术的公司）开发的，实现了 Reactive Programming（反应式编程即响应式编程） 思想，符合...",
    "content": "关于java的响应式编程框架SpringReactor 关于Reactor的介绍 Reactor是Spring中的一个子项目是一个基于java的响应式编程框架，此框架是 Pivotal 公司（开发 Spring 等技术的公司）开发的，实现了 Reactive Programming（反应式编程即响应式编程） 思想，符合 Reactive Streams 规范（Reactive Streams 是由 Netflix、TypeSafe、Pivotal 等公司发起的）的一项技术。其名字有反应堆之意，反映了其背后的强大的性能。 Spring 5 对应的Reactor框架的版本为3.1.0。（由于Spring5实现了很多关于函数式编程的东西，所以jdk版本至少得1.8） 关于反应式编程的思想： 反应式编程框架主要采用了观察者模式，而SpringReactor的核心则是对观察者模式的一种衍伸。关于观察者模式的架构中被观察者(Observable)和观察者(Subscriber)处在不同的线程环境中时，由于者各自的工作量不一样，导致它们产生事件和处理事件的速度不一样，这时就出现了两种情况： .... 关于java的响应式编程框架SpringReactor 关于Reactor的介绍 Reactor是Spring中的一个子项目是一个基于java的响应式编程框架，此框架是 Pivotal 公司（开发 Spring 等技术的公司）开发的，实现了 Reactive Programming（反应式编程即响应式编程） 思想，符合 Reactive Streams 规范（Reactive Streams 是由 Netflix、TypeSafe、Pivotal 等公司发起的）的一项技术。其名字有反应堆之意，反映了其背后的强大的性能。 Spring 5 对应的Reactor框架的版本为3.1.0。（由于Spring5实现了很多关于函数式编程的东西，所以jdk版本至少得1.8） 关于反应式编程的思想： 反应式编程框架主要采用了观察者模式，而SpringReactor的核心则是对观察者模式的一种衍伸。关于观察者模式的架构中被观察者(Observable)和观察者(Subscriber)处在不同的线程环境中时，由于者各自的工作量不一样，导致它们产生事件和处理事件的速度不一样，这时就出现了两种情况： 1. 被观察者产生事件慢一些，观察者处理事件很快。那么观察者就会等着被观察者发送事件，（好比观察者在等米下锅，程序等待，这没有问题）。 2. 被观察者产生事件的速度很快，而观察者处理很慢。那就出问题了，如果不作处理的话，事件会堆积起来，最终挤爆你的内存，导致程序崩溃。（好比被观察者生产的大米没人吃，堆积最后就会烂掉）。为了方便下面理解Mono和Flux，也可以理解为Publisher（发布者也可以理解为被观察者）主动推送数据给Subscriber（订阅者也可以叫观察者），如果Publisher发布消息太快，超过了Subscriber的处理速度，如何处理。这时就出现了Backpressure（背压指在异步场景中，被观察者发送事件速度远快于观察者的处理速度的情况下，一种告诉上游的被观察者降低发送速度的策略） Reactor的主要类： 在Reactor中，经常使用的类并不多，主要有以下两个： Mono 实现了 org.reactivestreams.Publisher 接口，代表0到1个元素的发布者（Publisher）。 Flux 同样实现了 org.reactivestreams.Publisher 接口，代表0到N个元素的发布者（Subscriber）。 可能会使用到的类： Scheduler 表示背后驱动反应式流的调度器，通常由各种线程池实现。 Spring5引入了一个基于Netty而不是Servlet高性能Web框架，但是使用方式和传统的基于Servlet的SrpingMvc并没有什么大的不同。 Web Flux中MVC接口的示例： 最大的变化就是返回值从 Foobar 所表示的一个对象变为 Mono （或 Flux ）。 关于Reactive Streams、Srping Reactor 和 Spring Flux（Web Flux）之间的关系 Reactive Streams 是规范，Reactor 实现了 Reactive Streams。Web Flux 以 Reactor 为基础，实现 Web 领域的反应式编程框架 关于Mono和Flux Mono和Flux都是Publisher（发布者）。 其实，对于大部分业务开发人员来说，当编写反应式代码时，我们通常只会接触到 Publisher 这个接口，对应到 Reactor 便是 Mono 和 Flux。对于 Subscriber 和 Subcription 这两个接口，Reactor 必然也有相应的实现。但是，这些都是 Web Flux 和 Spring Data Reactive 这样的框架用到的。如果不开发中间件，通常开发人员是不会接触到的。 比如，在 Web Flux，你的方法只需返回 Mono 或 Flux 即可。你的代码基本也只和 Mono 或 Flux 打交道。而 Web Flux 则会实现 Subscriber ，onNext 时将业务开发人员编写的 Mono 或 Flux 转换为 HTTP Response 返回给客户端。 案例 Mono 实现了 Publisher 接口，但是通过查看源码，发现它是一个抽象类。Mono 里面有很多 API，关于这些 API 的解释如下： empty()：创建一个不包含任何元素，只发布结束消息的序列。 just()：可以指定序列中包含的全部元素。创建出来的 Mono序列在发布这些元素之后会自动结束。 justOrEmpty()：从一个 Optional 对象或可能为 null 的对象中创建 Mono。只有 Optional 对象中包含值或对象不为 null 时，Mono 序列才产生对应的元素。 error(Throwable error)：创建一个只包含错误消息的序列。 never()：创建一个不包含任何消息通知的序列。 fromCallable()、fromCompletionStage()、fromFuture()、fromRunnable()和 fromSupplier()：分别从 Callable、CompletionStage、CompletableFuture、Runnable 和 Supplier 中创建 Mono。 delay(Duration duration)和 delayMillis(long duration)：创建一个 Mono 序列，在指定的延迟时间之后，产生数字 0 作为唯一值。 create()：通过 create()方法来使用 MonoSink 来创建 Mono。 API 使用案例如下所示。 用 just 创建数据流 基于数组创建数据流 基于集合创建数据流 基于 Stream 创建数据流 Flux 和 Mono 的数据信号 Flux 和 Mono 都可以发出三种数据信号，上文中提到元素值、错误信号和完成信号三者并不是要完全具备的，下面就给出几种情况："
  },
  {
    "title": "Python3下request处理cookie的两种方法",
    "url": "/articles/2020/06/16/1592317763420.html",
    "type": "blog",
    "date": "2020-06-16",
    "topic": "Python 爬虫与自动化",
    "topicSlug": "python-crawler",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Python",
      "Requests",
      "session",
      "cookie"
    ],
    "excerpt": "一、获取cookie 手动获取：手工登录获取cookie，登录成功后可以不断更新cookie到文件中存储。 参考：https://www.jianshu.com/p/5ef0c7bb1ed2 导入requests包 import requests targetURL = '目标网站地址' 设置头UA headers =...",
    "guide": "本文归入「Python 爬虫与自动化」专题，主要记录：一、获取cookie 手动获取：手工登录获取cookie，登录成功后可以不断更新cookie到文件中存储。 参考：https://www.jianshu.com/p/5ef0c7bb1ed2 导入requests包 import requests targetURL = '目标网站地址' 设置头UA headers =...",
    "content": "一、获取cookie 手动获取：手工登录获取cookie，登录成功后可以不断更新cookie到文件中存储。 参考：https://www.jianshu.com/p/5ef0c7bb1ed2 导入requests包 import requests targetURL = '目标网站地址' 设置头UA headers = {\"UserAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10132) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36\"} 开启一个session会话 session = requests.session() 设置请求头信息 session.headers = headers 申明一个用于存储手动cookies的字典 manualcookies={} 打开手动设置的cookies文件 部分网站需要滑动验证，这里通过浏览器登录成功后获取cookies手动存到文本来绕过验证，后续cookies自动更新 w.... 一、获取cookie 手动获取：手工登录获取cookie，登录成功后可以不断更新cookie到文件中存储。 参考：https://www.jianshu.com/p/5ef0c7bb1ed2 二 、使用cookie 方法一： 方法二：使用requests.session, 通过CookieJar来处理cookie。 方法三，headers中加cookie。"
  },
  {
    "title": "api网关介绍",
    "url": "/articles/2020/06/14/1592112174081.html",
    "type": "blog",
    "date": "2020-06-14",
    "topic": "中间件与分布式",
    "topicSlug": "middleware-distributed",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "gateway",
      "zuul",
      "网关"
    ],
    "excerpt": "1.什么是网关 API网关是一个系统的唯一入口。 是众多分布式服务唯一的一个出口。 它做到了物理隔离,内网服务只有通过网关才能暴露到外网被别人访问。 简而言之:网关就是你家的大门 2.提供了哪些功能 身份认证(oauth2/jwt) 权限安全(黑白名单/爬虫控制) 流量控制(请求大小/速率) 数据转换(公共请求requ...",
    "guide": "本文归入「中间件与分布式」专题，主要记录：1.什么是网关 API网关是一个系统的唯一入口。 是众多分布式服务唯一的一个出口。 它做到了物理隔离,内网服务只有通过网关才能暴露到外网被别人访问。 简而言之:网关就是你家的大门 2.提供了哪些功能 身份认证(oauth2/jwt) 权限安全(黑白名单/爬虫控制) 流量控制(请求大小/速率) 数据转换(公共请求requ...",
    "content": "1.什么是网关 API网关是一个系统的唯一入口。 是众多分布式服务唯一的一个出口。 它做到了物理隔离,内网服务只有通过网关才能暴露到外网被别人访问。 简而言之:网关就是你家的大门 2.提供了哪些功能 身份认证(oauth2/jwt) 权限安全(黑白名单/爬虫控制) 流量控制(请求大小/速率) 数据转换(公共请求request/response) 监控/metrics 跨域问题(前后端分离) 灰度发布(金丝雀发布/一部分去老客户端/一部分去新客户端) 3.市面上有哪些比较好的开源网关 OpenResty kong Spring Cloud Zuul/Gateway Zuul2 网关限流鉴权监控易用性可维护性成熟度 Spring Cloud Gateway可以通过IP，用户，集群限流，提供了相应的接口进行扩展普通鉴权、auth2.0Gateway Metrics Filter简单易用spring系列可扩展强，易配置 可维护性好spring社区成熟，但gateway资源较少 Zuul2可以通过配置文件配置集群限流和单服务器限流亦可通过filter实现限流扩展filter中实现.... 1.什么是网关 API网关是一个系统的唯一入口。 是众多分布式服务唯一的一个出口。 它做到了物理隔离,内网服务只有通过网关才能暴露到外网被别人访问。 简而言之:网关就是你家的大门 2.提供了哪些功能 1. 身份认证(oauth2/jwt) 2. 权限安全(黑白名单/爬虫控制) 3. 流量控制(请求大小/速率) 4. 数据转换(公共请求request/response) 5. 监控/metrics 6. 跨域问题(前后端分离) 7. 灰度发布(金丝雀发布/一部分去老客户端/一部分去新客户端) 3.市面上有哪些比较好的开源网关 1. OpenResty 2. kong 3. Spring Cloud Zuul/Gateway 4. Zuul2 | 网关 | 限流 | 鉴权 | 监控 | 易用性 | 可维护性 | 成熟度 | | : | : | : | : | : | : | : | | Spring Cloud Gateway | 可以通过IP，用户，集群限流，提供了相应的接口进行扩展 | 普通鉴权、auth2.0 | Gateway Metrics Filter | 简单易用 | spring系列可扩展强，易配置 可维护性好 | spring社区成熟，但gateway资源较少 | | Zuul2 | 可以通过配置文件配置集群限流和单服务器限流亦可通过filter实现限流扩展 | filter中实现 | filter中实现 | 参考资料较少 | 可维护性较差 | 开源不久，资料少 | | OpenResty | 需要lua开发 | 需要lua开发 | 需要开发 | 简单易用，但是需要进行的lua开发很多 | 可维护性较差，将来需要维护大量lua脚本 | 很成熟资料很多 | | Kong | 根据秒，分，时，天，月，年，根据用户进行限流。可在原码的基础上进行开发 | 普通鉴权，Key Auth鉴权，HMAC，auth2.0 | 可上报datadog，记录请求数量，请求数据量，应答数据量，接收于发送的时间间隔，状态码数量，kong内运行时间 | 简单易用，api转发通过管理员接口配置，开发需要lua脚本 | \"可维护性较差，将来需要维护大量lua库 | 相对成熟，用户问题汇总，社区，插件开源 | 4.如何做一款网关(Spring Cloud Gateway) 1. 第一个网关 pom.xml Application.java 启动参数 支持的路由方式 开启端点检查 访问url: http://localhost:9002/actuator/gateway/routes pom.xml添加 yml 添加配置 端点打开 参考 代码位置: https://github.com/jackssybin/springclouditems.git"
  },
  {
    "title": "Redis 缓存穿透、击穿、雪崩",
    "url": "/articles/2020/05/28/1590656168798.html",
    "type": "blog",
    "date": "2020-05-28",
    "topic": "中间件与分布式",
    "topicSlug": "middleware-distributed",
    "core": true,
    "priority": 80,
    "readingOrder": 10,
    "tags": [
      "Redis缓存穿透",
      "缓存穿透",
      "缓存击穿",
      "缓存雪崩"
    ],
    "excerpt": "这篇文章适合作为缓存稳定性专题的入口，覆盖高并发系统里最常见的缓存失效风险和防护思路。",
    "guide": "核心文章：这篇文章适合作为缓存稳定性专题的入口，覆盖高并发系统里最常见的缓存失效风险和防护思路。",
    "content": "Redis缓存穿透/击穿/雪崩 在平常开发时，我们一般都会引入redis，memcache等这些缓存解决方案来做一些热点数据存储来减轻数据库的压力，相较于数据库的磁盘IO，类似redis这种内存型数据库，内存的IO效率要比磁盘IO效率高几个数量级。但是在真正面对高并发时，如果处理不当redis也会出现一些问题。这里就说一下实际场景中可能会出现的缓存穿透，缓存击穿，缓存雪崩。 缓存穿透：比如说，一个用户的基本信息(缓存key为uid)或订单的信息(缓存key为orderid)，缓存或数据库里都没有这个uid或orderid的信息，但是如果有请求要获取这个信息，那么逻辑处理时就会跨过缓存这一层去查数据库，如果这样的请求短时间内非常多可能会压垮数据库。 缓存击穿：比如说，订单的信息(缓存key为orderid)在缓存中有过期时间，如果在特定的时间这个订单信息在缓存中已经过期但是尚未从数据库查出最新的信息set到缓存上，恰好这个时候大并发请求过来了，那么这些请求的逻辑处理也会跨过缓存直接查询数据库，这个大并发的查询可能会压垮数据库。 缓存雪崩：上面说到缓存击穿是一个.... Redis缓存穿透/击穿/雪崩 在平常开发时，我们一般都会引入redis，memcache等这些缓存解决方案来做一些热点数据存储来减轻数据库的压力，相较于数据库的磁盘IO，类似redis这种内存型数据库，内存的IO效率要比磁盘IO效率高几个数量级。但是在真正面对高并发时，如果处理不当redis也会出现一些问题。这里就说一下实际场景中可能会出现的缓存穿透，缓存击穿，缓存雪崩。 1. 缓存穿透：比如说，一个用户的基本信息(缓存key为uid)或订单的信息(缓存key为orderid)，缓存或数据库里都没有这个uid或orderid的信息，但是如果有请求要获取这个信息，那么逻辑处理时就会跨过缓存这一层去查数据库，如果这样的请求短时间内非常多可能会压垮数据库。 2. 缓存击穿：比如说，订单的信息(缓存key为orderid)在缓存中有过期时间，如果在特定的时间这个订单信息在缓存中已经过期但是尚未从数据库查出最新的信息set到缓存上，恰好这个时候大并发请求过来了，那么这些请求的逻辑处理也会跨过缓存直接查询数据库，这个大并发的查询可能会压垮数据库。 3. 缓存雪崩：上面说到缓存击穿是一个key在特定时间过期，那么如果缓存系统中大量的缓存在同一时间或时间段内过期，这个时候的请求也会跨过缓存直达数据库，数据库压力陡增也可能会压垮数据库。 解决方案 1. 缓存穿透解决方案有很多 设计一个过滤器，常用的是布隆过滤器，移步这里了解更多 大白话布隆过滤器。 给不存在的key，赋值一个默认的空值，如下代码 public function getCache($key) { $redis = Helper::redis(); //redis对象 $expiretime = 300; $result = $redisget($key); if ($result) { return $result; }else { //redis里没查到，去查db $dbdata = queryDb($key);//模拟查询db,拿到的数据 if ($dbdata) { //数据库查到的数据，正常，更新缓存key数据，返回数据 $redisset($key, $dbdata, $expiretime); return $dbdata; }else { //数据库查不到该$key对应的数据，设置一个默认值，更新缓存key数据，返回数据 $dbdata = 'empty data'; $redisset($key, $dbdata, $expiretime); return $dbdata; } //上面的代码，精简一下 $dbdata = $dbdata ?: 'empty data'; $redisset($key, $dbdata, $expiretime); return $dbdata; } } 4. 缓存击穿解决方案多使用 互斥锁，使用mutex。就是在缓存失效的时候，在去数据库查询最新的数据前，上一个锁(同时间的其他获取缓存操作就会被阻塞，这个阻塞只会只会影响很小的一部分请求)，然后再去完成数据查询，缓存更新等操作。 public function getCache($key) { $redis = Helper::redis(); //redis对象 $expiretime = 300; $result = $redisget($key); if ($result) { return $result; }else { //redis里没查到，去查db $mutexkey = $key . 'mutex'; //这里假设同时有10个查询的线程，1个线程抢到了这个锁，其他的9个线程就会阻塞或需要等待 if ($redissetnx($mutexkey, 1, 60)) { //抢到锁的线程，去执行数据查询，更新缓存这些操作 $dbdata = queryDb($key);//模拟查询db,拿到的数据 $result = $dbdata ?: 'empty data'; $redisset($key, $result, $expiretime); $redisdel($mutexkey); }else { //没抢到锁的线程，就“稍等”一会啦，然后再获取最新的缓存数据 sleep(0.01); $result = getCache($key); } return $result; } } 6. 缓存雪崩的话，短时间的大量数据读写操作极大可能导致数据库垮掉。为了避免出现这种情况，可以在常规的缓存set操作的基础上，在预设的过期时间基础上再额外增加一些时间；也可以单独起一个进程去监控redis中快过期的key,如果有快过期的key，就去重新查询更新。"
  },
  {
    "title": "Mysql-Limit 优化和数据重复",
    "url": "/articles/2020/05/28/1590653407979.html",
    "type": "blog",
    "date": "2020-05-28",
    "topic": "MySQL 与数据架构",
    "topicSlug": "mysql-data",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "MySQL",
      "orderby",
      "排序",
      "limit"
    ],
    "excerpt": "limit 查询导出优化 耗时本质 mysql大数据量使用limit分页，随着页码的增大，查询效率越低下。 1.当一个表数据有几百万的数据的时候成了问题！ 如 select from table limit 0,10 这个没有问题 当 limit 200000,10 的时候数据读取就很慢 原因本质： 1）limit语句...",
    "guide": "本文归入「MySQL 与数据架构」专题，主要记录：limit 查询导出优化 耗时本质 mysql大数据量使用limit分页，随着页码的增大，查询效率越低下。 1.当一个表数据有几百万的数据的时候成了问题！ 如 select from table limit 0,10 这个没有问题 当 limit 200000,10 的时候数据读取就很慢 原因本质： 1）limit语句...",
    "content": "limit 查询导出优化 耗时本质 mysql大数据量使用limit分页，随着页码的增大，查询效率越低下。 1.当一个表数据有几百万的数据的时候成了问题！ 如 select from table limit 0,10 这个没有问题 当 limit 200000,10 的时候数据读取就很慢 原因本质： 1）limit语句的查询时间与起始记录（offset）的位置成正比 2）mysql的limit语句是很方便，但是对记录很多:百万，千万级别的表并不适合直接使用。 例如： limit10000,20的意思扫描满足条件的10020行，扔掉前面的10000行，返回最后的20行，问题就在这里。 ​ LIMIT 2000000, 30 扫描了200万+ 30行，怪不得慢的都堵死了，甚至会导致磁盘io 100%消耗。 ​ 但是: limit 30 这样的语句仅仅扫描30行。 优化手段 干掉或者利用 limit offset,size 中的offset 不是直接使用limit，而是首先获取到offset的id然后直接使用limit size来获取数据 对limit分页问题的性能优化方法 利用表的覆盖.... limit 查询导出优化 耗时本质 mysql大数据量使用limit分页，随着页码的增大，查询效率越低下。 1.当一个表数据有几百万的数据的时候成了问题！ 如 select from table limit 0,10 这个没有问题 当 limit 200000,10 的时候数据读取就很慢 原因本质： 1）limit语句的查询时间与起始记录（offset）的位置成正比 2）mysql的limit语句是很方便，但是对记录很多:百万，千万级别的表并不适合直接使用。 例如： limit10000,20的意思扫描满足条件的10020行，扔掉前面的10000行，返回最后的20行，问题就在这里。 ​ LIMIT 2000000, 30 扫描了200万+ 30行，怪不得慢的都堵死了，甚至会导致磁盘io 100%消耗。 ​ 但是: limit 30 这样的语句仅仅扫描30行。 优化手段 干掉或者利用 limit offset,size 中的offset 不是直接使用limit，而是首先获取到offset的id然后直接使用limit size来获取数据 对limit分页问题的性能优化方法 利用表的覆盖索引来加速分页查询 覆盖索引: 就是select 的数据列只用从索引中就能获得，不必读取数据行。mysql 可以利用索引返回select列表中的字段，而不必根据索引再次读取数据文件，换句话说：查询列要被所创建的索引覆盖 因为利用索引查找有优化算法，且数据就在查询索引上面，不用再去找相关的数据地址了，这样节省了很多时间。另外Mysql中也有相关的索引缓存，在并发高的时候利用缓存就效果更好了。在我们的例子中，我们知道id字段是主键，自然就包含了默认的主键索引。 这次我们之间查询最后一页的数据（利用覆盖索引，只包含id列），如下： 那么如果我们也要查询所有列，有两种方法，一种是id=的形式，另一种就是利用join，看下实际情况： 2.order by + limit 在什么情况下会出现分页数据重复 排序离不开算法，在关系型数据库中，往往会存在多种排序算法。通过 MySQL 的源码和官方文档介绍可以得知，它的排序规律可以总结如下： 当 order by 不能使用索引进行排序时，将使用排序算法进行排序；若排序内容能全部放入内存，则仅在内存中使用快速排序；若排序内容不能全部放入内存，则分批次将排好序的内容放入文件，然后将多个文件进行归并排序；若排序中包含 limit 语句，则使用堆排序优化排序过程。 其他如：PG，MariaDB，AliSQL，SQL Server 等排序算法方面差别不大。 根据上面的总结，当你的 order by limit 分页出现数据重复。比如，一个用户表，当使用 limit 5 后出现一个张三。再使用 limit 5,10 的时候，张三又出现了。注意，这两个张三是同一个人，id 是相同的。在这种情况下，你的 order by 肯定是没有使用索引的。因为使用了索引，就会进行索引排序。 根据官方文档显示，可以得出。上面的 SQL 使用了堆排序。因为，排序字段 没索引，所以没走索引排序；其二我们使用了 limit，所以最终使用了堆排序。而了解算法的朋友都知道，堆排序是不稳定的。 3.那么如何解决 order by limit 分页数据重复问题呢？方法有多种，我这里列举最常用的两种方法。 第一种就是，在排序中加上唯一值，比如主键 id，这样由于 id 是唯一的，就能确保参与排序的 key 值不相同。 第二种就是 避免使用堆排序，让 order by 根据索引来排序。说白了，就是 order by 后面的字段要有索引。"
  },
  {
    "title": "MySQL如何利用索引优化ORDER BY排序",
    "url": "/articles/2020/05/28/1590637980592.html",
    "type": "blog",
    "date": "2020-05-28",
    "topic": "MySQL 与数据架构",
    "topicSlug": "mysql-data",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "MySQL",
      "orderby",
      "索引"
    ],
    "excerpt": "MySQL索引通常是被用于提高WHERE条件的数据行匹配或者执行联结操作时匹配其它表的数据行的搜索速度。 MySQL也能利用索引来快速地执行ORDER BY和GROUP BY语句的排序和分组操作。 通过索引优化来实现MySQL的ORDER BY语句优化： 1、ORDER BY的索引优化。如果一个SQL语句形如： SEL...",
    "guide": "本文归入「MySQL 与数据架构」专题，主要记录：MySQL索引通常是被用于提高WHERE条件的数据行匹配或者执行联结操作时匹配其它表的数据行的搜索速度。 MySQL也能利用索引来快速地执行ORDER BY和GROUP BY语句的排序和分组操作。 通过索引优化来实现MySQL的ORDER BY语句优化： 1、ORDER BY的索引优化。如果一个SQL语句形如： SEL...",
    "content": "MySQL索引通常是被用于提高WHERE条件的数据行匹配或者执行联结操作时匹配其它表的数据行的搜索速度。 MySQL也能利用索引来快速地执行ORDER BY和GROUP BY语句的排序和分组操作。 通过索引优化来实现MySQL的ORDER BY语句优化： 1、ORDER BY的索引优化。如果一个SQL语句形如： SELECT [column1],[column2],…. FROM [TABLE] ORDER BY [sort]; 在[sort]这个栏位上建立索引就可以实现利用索引进行order by 优化。 2、WHERE + ORDER BY的索引优化，形如： SELECT [column1],[column2],…. FROM [TABLE] WHERE [columnX] = [value] ORDER BY [sort]; 建立一个联合索引(columnX,sort)来实现order by 优化。 注意：如果columnX对应多个值，如下面语句就无法利用索引来实现order by的优化 SELECT [column1],[column2],…. FROM [TABL.... MySQL索引通常是被用于提高WHERE条件的数据行匹配或者执行联结操作时匹配其它表的数据行的搜索速度。 MySQL也能利用索引来快速地执行ORDER BY和GROUP BY语句的排序和分组操作。 通过索引优化来实现MySQL的ORDER BY语句优化： 1、ORDER BY的索引优化。如果一个SQL语句形如： SELECT [column1],[column2],…. FROM [TABLE] ORDER BY [sort]; 在[sort]这个栏位上建立索引就可以实现利用索引进行order by 优化。 2、WHERE + ORDER BY的索引优化，形如： SELECT [column1],[column2],…. FROM [TABLE] WHERE [columnX] = [value] ORDER BY [sort]; 建立一个联合索引(columnX,sort)来实现order by 优化。 注意：如果columnX对应多个值，如下面语句就无法利用索引来实现order by的优化 SELECT [column1],[column2],…. FROM [TABLE] WHERE [columnX] IN ([value1],[value2],…) ORDER BY[sort]; 3、WHERE+ 多个字段ORDER BY SELECT FROM [table] WHERE uid=1 ORDER x,y LIMIT 0,10; 建立索引(uid,x,y)实现order by的优化,比建立(x,y,uid)索引效果要好得多。 MySQL Order By不能使用索引来优化排序的情况 对不同的索引键做 ORDER BY ：(key1,key2分别建立索引) SELECT FROM t1 ORDER BY key1, key2; 在非连续的索引键部分上做 ORDER BY：(keypart1,keypart2建立联合索引;key2建立索引) SELECT FROM t1 WHERE key2=constant ORDER BY keypart2; 同时使用了 ASC 和 DESC：(keypart1,keypart2建立联合索引) SELECT FROM t1 ORDER BY keypart1 DESC, keypart2 ASC; 用于搜索记录的索引键和做 ORDER BY 的不是同一个：(key1,key2分别建立索引) SELECT FROM t1 WHERE key2=constant ORDER BY key1; 如果在WHERE和ORDER BY的栏位上应用表达式(函数)时，则无法利用索引来实现order by的优化 SELECT FROM t1 ORDER BY YEAR(logindate) LIMIT 0,10; 特别提示: 1mysql一次查询只能使用一个索引。如果要对多个字段使用索引，建立复合索引。 2在ORDER BY操作中，MySQL只有在排序条件不是一个查询条件表达式的情况下才使用索引。 ———————————————— 引用原文1"
  },
  {
    "title": "Linux - 查看用户登录记录",
    "url": "/articles/2020/05/13/1589349920439.html",
    "type": "blog",
    "date": "2020-05-13",
    "topic": "Linux 运维与部署",
    "topicSlug": "linux-ops",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Linux",
      "用户操作记录",
      "lastlog"
    ],
    "excerpt": "1、查看当前登录用户信息 who命令： who缺省输出包括用户名、终端类型、登陆日期以及远程主机。 who /var/log/wtmp 可以查看自从wtmp文件创建以来的每一次登陆情况 （1）b：查看系统最近一次启动时间 （2）H：打印每列的标题 users命令： 打印当前登录的用户，每个显示的用户名对应一个登陆会话。...",
    "guide": "本文归入「Linux 运维与部署」专题，主要记录：1、查看当前登录用户信息 who命令： who缺省输出包括用户名、终端类型、登陆日期以及远程主机。 who /var/log/wtmp 可以查看自从wtmp文件创建以来的每一次登陆情况 （1）b：查看系统最近一次启动时间 （2）H：打印每列的标题 users命令： 打印当前登录的用户，每个显示的用户名对应一个登陆会话。...",
    "content": "1、查看当前登录用户信息 who命令： who缺省输出包括用户名、终端类型、登陆日期以及远程主机。 who /var/log/wtmp 可以查看自从wtmp文件创建以来的每一次登陆情况 （1）b：查看系统最近一次启动时间 （2）H：打印每列的标题 users命令： 打印当前登录的用户，每个显示的用户名对应一个登陆会话。 2、查看命令历史 每个用户都有一份命令历史记录 查看$HOME/.bashhistory 或者在终端输入： history 3、last命令 查看用户登录历史 此命令会读取 /var/log/wtmp文件；/var/log/btmp可以显示远程登陆信息。 last默认打印所有用户的登陆信息。 如果想打印某个用户的登陆信息，可以使用 last 用户名 选项： （1）x：显示系统开关机以及执行等级信息 （2）a：将登陆ip显示在最后一行 （3）f ：读取特定文件，可以选择 f /var/log/btmp文件 （4）d：将IP地址转换为主机名 （5）n：设置列出名单的显示列数 （6）t：查看指定时间的用户登录历史 例如： last t 201502261.... 1、查看当前登录用户信息 who命令： who缺省输出包括用户名、终端类型、登陆日期以及远程主机。 who /var/log/wtmp 可以查看自从wtmp文件创建以来的每一次登陆情况 （1）b：查看系统最近一次启动时间 （2）H：打印每列的标题 users命令： 打印当前登录的用户，每个显示的用户名对应一个登陆会话。 2、查看命令历史 每个用户都有一份命令历史记录 查看$HOME/.bashhistory 或者在终端输入： history 3、last命令 查看用户登录历史 此命令会读取 /var/log/wtmp文件；/var/log/btmp可以显示远程登陆信息。 last默认打印所有用户的登陆信息。 如果想打印某个用户的登陆信息，可以使用 last 用户名 选项： （1）x：显示系统开关机以及执行等级信息 （2）a：将登陆ip显示在最后一行 （3）f ：读取特定文件，可以选择 f /var/log/btmp文件 （4）d：将IP地址转换为主机名 （5）n：设置列出名单的显示列数 （6）t：查看指定时间的用户登录历史 例如： last t 20150226160404 显示这个时间戳之前的登陆历史 4、lastlog命令 查看所有用户最近一次登录历史 命令将读取/var/log/lastlog文件；用户排列顺序按照/etc/passwd中的顺序 选项： （1） u：查看某个用户的最后一次登陆历史 例如： lastlog u test 查看用户test的登陆历史 （2） t：查看最近几天之内的用户登录历史 例如： lastlog t 1 查看最近1天之内的登陆历史 （3） b：查看指定天数之前的用户登录历史 例如： lastlog b 60 查看60天之前的用户登录历史 5、ac命令 根据/var/log/wtmp文件中的登陆和退出时间报告用户连接的时间（小时），默认输出报告总时间 （1）p：显示每个用户的连接时间 （2）d：显示每天的连接时间 （3）y：显示年份，和d配合使用"
  },
  {
    "title": "Linux服务器kdevtmpfsi挖矿病毒解决方法",
    "url": "/articles/2020/05/11/1589167695782.html",
    "type": "blog",
    "date": "2020-05-11",
    "topic": "Linux 运维与部署",
    "topicSlug": "linux-ops",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Linux",
      "矿机病毒",
      "cpu100",
      "kdevtmpfsi"
    ],
    "excerpt": "问题描述 Linux服务器（包括但不限于CentOS）出现名为kdevtmpfsi的进程，占用高额的CPU、内存资源； 并且单纯的kill 9 进程ID 例：kill 9 12345 无法完全杀死，不久便会复活； 同2.理杀死 kdevtmpfsi的守护进程kinsing，一小段时间又会出现这对进程；(网上文档有人会有...",
    "guide": "本文归入「Linux 运维与部署」专题，主要记录：问题描述 Linux服务器（包括但不限于CentOS）出现名为kdevtmpfsi的进程，占用高额的CPU、内存资源； 并且单纯的kill 9 进程ID 例：kill 9 12345 无法完全杀死，不久便会复活； 同2.理杀死 kdevtmpfsi的守护进程kinsing，一小段时间又会出现这对进程；(网上文档有人会有...",
    "content": "问题描述 Linux服务器（包括但不限于CentOS）出现名为kdevtmpfsi的进程，占用高额的CPU、内存资源； 并且单纯的kill 9 进程ID 例：kill 9 12345 无法完全杀死，不久便会复活； 同2.理杀死 kdevtmpfsi的守护进程kinsing，一小段时间又会出现这对进程；(网上文档有人会有守护进程。我机器没这个，也没在定时任务里找到额外的定时任务) 找到并删除这2个进程对应的可执行文件例：find / name kinsing，一小段时间又会出现。 问题根源 服务器安装的redis镜像有问题，被植入kdevtmpfsi挖矿程序。 redis未设置密码、或者密码过于简单 服务器被植入定时任务：下载病毒程序、并唤起，及进程存活监测 很纳闷，我的服务器都没有redis，以前短暂安装过。后来就没起来过。也出这个问题了 解决方法 (定时任务杀进程，也是守护进程) 编写shell脚本 vim /data/shell/killkdevtmpfsi.sh； ! /bin/sh step=1 for (( i = 0; i &lt; 60; i = (.... 问题描述 Linux服务器（包括但不限于CentOS）出现名为kdevtmpfsi的进程，占用高额的CPU、内存资源； 并且单纯的kill 9 进程ID 例：kill 9 12345 无法完全杀死，不久便会复活； 同2.理杀死 kdevtmpfsi的守护进程kinsing，一小段时间又会出现这对进程；(网上文档有人会有守护进程。我机器没这个，也没在定时任务里找到额外的定时任务) 找到并删除这2个进程对应的可执行文件例：find / name kinsing，一小段时间又会出现。 问题根源 1. 服务器安装的redis镜像有问题，被植入kdevtmpfsi挖矿程序。 2. redis未设置密码、或者密码过于简单 3. 服务器被植入定时任务：下载病毒程序、并唤起，及进程存活监测 4. 很纳闷，我的服务器都没有redis，以前短暂安装过。后来就没起来过。也出这个问题了 解决方法 (定时任务杀进程，也是守护进程) 编写shell脚本 vim /data/shell/killkdevtmpfsi.sh； 新增定时任务； 更改redis 默认端口，更改bind 本机端口,不要暴漏在外网。黑客是全网段扫描的。也真是服了 top 看进程短暂启动。马上被杀掉。也算是解决了 另一种 redis配置不规范被入侵。 https://blog.csdn.net/Dancen/article/details/75313424"
  },
  {
    "title": "Linux Dump 文件分析",
    "url": "/articles/2020/04/20/1587389853090.html",
    "type": "blog",
    "date": "2020-04-20",
    "topic": "Linux 运维与部署",
    "topicSlug": "linux-ops",
    "core": true,
    "priority": 80,
    "readingOrder": 30,
    "tags": [
      "JVM",
      "内存溢出",
      "Linux",
      "mat"
    ],
    "excerpt": "这篇文章是线上排障类内容的核心入口，适合在 Java 进程内存异常、CPU 异常或服务不稳定时作为排查流程参考。",
    "guide": "核心文章：这篇文章是线上排障类内容的核心入口，适合在 Java 进程内存异常、CPU 异常或服务不稳定时作为排查流程参考。",
    "content": "dump文件传输到本地进行分析， 常常需要大量的等待时间。 使用IBM的eclipse的MAT工具可以直接在服务器上进行快速DUMP分析。 运行环境要求 linux操作系统 JDK8 以上 下载MAT的linux版本 Eclipse的MAT工具下载链接 MAT支持各种操作系统，找到Linux版本下载下来 运行uname m 看一下linux是 x8664还是 x86的帮助你选择下载那个版本。 uname m x8664 http://iso.mirrors.ustc.edu.cn/eclipse/mat/1.8/rcp/MemoryAnalyzer1.8.0.20180604linux.gtk.x8664.zip 解压配置MAT基本参数 unzip MemoryAnalyzer1.8.0.20180604linux.gtk.x8664.zip 修改MAT的内存大小， 注意这个大小要根据你dump文件大小来的，如果dump文件是5GB那么 这里最好配&gt;5GB 否则会报MAT内存不足的异常 修改MemoryAnalyzer.ini 的 .... dump文件传输到本地进行分析， 常常需要大量的等待时间。 使用IBM的eclipse的MAT工具可以直接在服务器上进行快速DUMP分析。 运行环境要求 linux操作系统 JDK8 以上 下载MAT的linux版本 Eclipse的MAT工具下载链接 MAT支持各种操作系统，找到Linux版本下载下来 解压配置MAT基本参数 jmap dump整个堆 MAT分析 dump 等待结果…. 结果会生产如下三个zip文件，很小可以直接拷贝到本机 查看报告结果 有两种查看报告的方法 直接把zip下载到本地，然后解压用浏览器查看index.html 把zip下载到本地， 用MAT可视化工具解析zip 如果有异常Unable to initialize GTK+ 遇到这个问题的话，是因为ParseHeapDump.sh 里面需要调用GTK的一些东西。解决方法： 然后继续运行"
  },
  {
    "title": "jvm调优(堆溢出和调优参数)",
    "url": "/articles/2020/04/13/1586772814684.html",
    "type": "blog",
    "date": "2020-04-13",
    "topic": "Java 与 JVM",
    "topicSlug": "java-jvm",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "JVM",
      "调优",
      "内存溢出",
      "调优参数"
    ],
    "excerpt": "内存溢出和内存泄漏的区别： 内存溢出 out of memory，是指程序在申请内存时，没有足够的内存空间供其使用，出现out of memory；比如申请了一个integer,但给它存了long才能存下的数，那就是内存溢出。 内存泄露 memory leak，是指程序在申请内存后，无法释放已申请的内存空间，一次内存泄...",
    "guide": "本文归入「Java 与 JVM」专题，主要记录：内存溢出和内存泄漏的区别： 内存溢出 out of memory，是指程序在申请内存时，没有足够的内存空间供其使用，出现out of memory；比如申请了一个integer,但给它存了long才能存下的数，那就是内存溢出。 内存泄露 memory leak，是指程序在申请内存后，无法释放已申请的内存空间，一次内存泄...",
    "content": "内存溢出和内存泄漏的区别： 内存溢出 out of memory，是指程序在申请内存时，没有足够的内存空间供其使用，出现out of memory；比如申请了一个integer,但给它存了long才能存下的数，那就是内存溢出。 内存泄露 memory leak，是指程序在申请内存后，无法释放已申请的内存空间，一次内存泄露危害可以忽略，但内存泄露堆积后果很严重，无论多少内存,迟早会被占光。 memory leak会最终会导致out of memory 内存溢出就是你要求分配的内存超出了系统能给你的，系统不能满足需求，于是产生溢出。 内存泄漏是指你向系统申请分配内存进行使用(new)，可是使用完了以后却不归还(delete)，结果你申请到的那块内存你自己也不能再访问（也许你把它的地址给弄丢了），而系统也不能再次将它分配给需要的程序。一个盘子用尽各种方法只能装4个果子，你装了5个，结果掉倒地上不能吃了。这就是溢出！比方说栈，栈满时再做进栈必定产生空间溢出，叫上溢，栈空时再做退栈也产生空间溢出，称为下溢。就是分配的内存不足以放下数据项序列,称为内存溢出. 全文简短总结，具体内容可以看下文。 栈.... 内存溢出和内存泄漏的区别： 内存溢出 out of memory，是指程序在申请内存时，没有足够的内存空间供其使用，出现out of memory；比如申请了一个integer,但给它存了long才能存下的数，那就是内存溢出。 内存泄露 memory leak，是指程序在申请内存后，无法释放已申请的内存空间，一次内存泄露危害可以忽略，但内存泄露堆积后果很严重，无论多少内存,迟早会被占光。 memory leak会最终会导致out of memory 内存溢出就是你要求分配的内存超出了系统能给你的，系统不能满足需求，于是产生溢出。 内存泄漏是指你向系统申请分配内存进行使用(new)，可是使用完了以后却不归还(delete)，结果你申请到的那块内存你自己也不能再访问（也许你把它的地址给弄丢了），而系统也不能再次将它分配给需要的程序。一个盘子用尽各种方法只能装4个果子，你装了5个，结果掉倒地上不能吃了。这就是溢出！比方说栈，栈满时再做进栈必定产生空间溢出，叫上溢，栈空时再做退栈也产生空间溢出，称为下溢。就是分配的内存不足以放下数据项序列,称为内存溢出. 全文简短总结，具体内容可以看下文。 栈内存溢出(StackOverflowError)： 程序所要求的栈深度过大导致，可以写一个死递归程序触发。 堆内存溢出(OutOfMemoryError:java heap space) 分清内存溢出还是内存泄漏 泄露则看对象如何被 GC Root 引用。 溢出则通过 调大 Xms，Xmx参数。 持久带内存溢出(OutOfMemoryError: PermGen space) 持久带中包含方法区，方法区包含常量池 因此持久带溢出有可能是运行时常量池溢出，也有可能是方法区中保存的class对象没有被及时回收掉或者class信息占用的内存超过了我们配置 用String.intern()触发常量池溢出 Class对象未被释放，Class对象占用信息过多，有过多的Class对象。可以导致持久带内存溢出 无法创建本地线程 总容量不变，堆内存，非堆内存设置过大，会导致能给线程的内存不足。 以下是详细内容 栈溢出(StackOverflowError) 栈溢出抛出StackOverflowError错误，出现此种情况是因为方法运行的时候栈的深度超过了虚拟机容许的最大深度所致。出现这种情况，一般情况下是程序错误所致的，比如写了一个死递归，就有可能造成此种情况。 下面我们通过一段代码来模拟一下此种情况的内存溢出。 运行上面的代码，会抛出如下的异常： 对于栈内存溢出，根据《Java 虚拟机规范》中文版： 如果线程请求的栈容量超过栈允许的最大容量的话，Java 虚拟机将抛出一个StackOverflow异常；如果Java虚拟机栈可以动态扩展，并且扩展的动作已经尝试过，但是无法申请到足够的内存去完成扩展，或者在新建立线程的时候没有足够的内存去创建对应的虚拟机栈，那么Java虚拟机将抛出一个OutOfMemory 异常。 堆溢出(OutOfMemoryError:java heap space) 堆内存溢出的时候，虚拟机会抛出java.lang.OutOfMemoryError:java heap space,出现此种情况的时候，我们需要根据内存溢出的时候产生的dump文件来具体分析（需要增加XX:+HeapDumpOnOutOfMemoryErrorjvm启动参数）。出现此种问题的时候有可能是内存泄露，也有可能是内存溢出了。 如果内存泄露，我们要找出泄露的对象是怎么被GC ROOT引用起来，然后通过引用链来具体分析泄露的原因。 如果出现了内存溢出问题，这往往是程序本生需要的内存大于了我们给虚拟机配置的内存，这种情况下，我们可以采用调大Xmx来解决这种问题。下面我们通过如下的代码来演示一下此种情况的溢出： 我们通过如下的命令运行上面的代码： 程序输出如下的信息： 从运行结果可以看出，JVM进行了一次Minor gc和两次的Major gc，从Major gc的输出可以看出，gc以后old区使用率为134K，而字节数组为10M，加起来大于了old generation的空间，所以抛出了异常，如果调整Xms21M,Xmx21M,那么就不会触发gc操作也不会出现异常了。 通过上面的实验其实也从侧面验证了一个结论：对象大于新生代剩余内存的时候，将直接放入老年代，当老年代剩余内存还是无法放下的时候，触发垃圾收集，收集后还是不能放下就会抛出内存溢出异常了。 持久带溢出(OutOfMemoryError: PermGen space) 我们知道Hotspot jvm通过持久带实现了Java虚拟机规范中的方法区，而运行时的常量池就是保存在方法区中的，因此持久带溢出有可能是运行时常量池溢出，也有可能是方法区中保存的class对象没有被及时回收掉或者class信息占用的内存超过了我们配置。 当持久带溢出的时候抛出java.lang.OutOfMemoryError: PermGen space。可能在如下几种场景下出现： 1. 使用一些应用服务器的热部署的时候，我们就会遇到热部署几次以后发现内存溢出了，这种情况就是因为每次热部署的后，原来的class没有被卸载掉。 2. 如果应用程序本身比较大，涉及的类库比较多，但是我们分配给持久带的内存（通过XX:PermSize和XX:MaxPermSize来设置）比较小的时候也可能出现此种问题。 3. 一些第三方框架，比如spring,hibernate都通过字节码生成技术（比如CGLib）来实现一些增强的功能，这种情况可能需要更大的方法区来存储动态生成的Class文件。 我们知道Java中字符串常量是放在常量池中的，String.intern()这个方法运行的时候，会检查常量池中是否存和本字符串相等的对象，如果存在直接返回对常量池中对象的引用，不存在的话，先把此字符串加入常量池，然后再返回字符串的引用。那么我们就可以通过String.intern方法来模拟一下运行时常量区的溢出.下面我们通过如下的代码来模拟此种情况： 我们通过如下的命令运行上面代码： 运行后的输入如下图所示: 通过上面的代码，我们成功模拟了运行时常量池溢出的情况，从输出中的PermGen space可以看出确实是持久带发生了溢出，这也验证了，我们前面说的Hotspot jvm通过持久带来实现方法区的说法。 OutOfMemoryError:unable to create native thread 最后我们在来看看java.lang.OutOfMemoryError:unable to create natvie thread这种错误。 出现这种情况的时候，一般是下面两种情况导致的： 1. 程序创建的线程数超过了操作系统的限制。对于Linux系统，我们可以通过ulimit u来查看此限制。 2. 给虚拟机分配的内存过大，导致创建线程的时候需要的native内存太少。 我们都知道操作系统对每个进程的内存是有限制的，我们启动Jvm,相当于启动了一个进程，假如我们一个进程占用了4G的内存，那么通过下面的公式计算出来的剩余内存就是建立线程栈的时候可以用的内存。线程栈总可用内存=4G（Xmx的值） （XX:MaxPermSize的值） 程序计数器占用的内存 通过上面的公式我们可以看出，Xmx 和 MaxPermSize的值越大，那么留给线程栈可用的空间就越小，在Xss参数配置的栈容量不变的情况下，可以创建的线程数也就越小。因此如果是因为这种情况导致的unable to create native thread,那么要么我们增大进程所占用的总内存，或者减少Xmx或者Xss来达到创建更多线程的目的。 参数相关 XX:+HeapDumpOnOutOfMemoryError 参数表示当JVM发生OOM时，自动生成DUMP文件。 XX:HeapDumpPathr XX:HeapDumpPath=${目录}参数表示生成DUMP文件的路径，也可以指定文件名称，例如：XX:HeapDumpPath=${目录}/javaheapdump.hprof。如果不指定文件名，默认为：java heapDump.hprof，默认目录为tomcat所在目录下。 XX:+AggressiveHeap java堆最佳化设置。设置多个参数使长时间运行过的任务"
  },
  {
    "title": "分布式锁(Redis,zk,db锁)",
    "url": "/articles/2020/04/11/1586608404790.html",
    "type": "blog",
    "date": "2020-04-11",
    "topic": "中间件与分布式",
    "topicSlug": "middleware-distributed",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Redis",
      "分布式锁",
      "zk分布式锁"
    ],
    "excerpt": "关于分布式锁，一般有三种选择， 1、redis （setnx,redisson,redlock） 2、zk 3、DB锁（悲观锁、乐观锁） 其中用的最多的应该是redis。 redis常用的方式有单节点、主从模式、哨兵模式、集群模式。 单节点在生产环境基本上不会使用，因为不能达到高可用，且连RDB或AOF备份都只能放在m...",
    "guide": "本文归入「中间件与分布式」专题，主要记录：关于分布式锁，一般有三种选择， 1、redis （setnx,redisson,redlock） 2、zk 3、DB锁（悲观锁、乐观锁） 其中用的最多的应该是redis。 redis常用的方式有单节点、主从模式、哨兵模式、集群模式。 单节点在生产环境基本上不会使用，因为不能达到高可用，且连RDB或AOF备份都只能放在m...",
    "content": "关于分布式锁，一般有三种选择， 1、redis （setnx,redisson,redlock） 2、zk 3、DB锁（悲观锁、乐观锁） 其中用的最多的应该是redis。 redis常用的方式有单节点、主从模式、哨兵模式、集群模式。 单节点在生产环境基本上不会使用，因为不能达到高可用，且连RDB或AOF备份都只能放在master上，所以基本上不会使用。 另外几种模式都无法避免两个问题： 1、异步数据丢失。 2、脑裂问题。 setnx 1.根据lockKey区进行setnx（set not exist，如果key值为空，则正常设置，返回1，否则不会进行设置并返回0）操作，如果设置成功，表示已经获得锁，否则并没有获取锁。 2.如果没有获得锁，去Redis上拿到该key对应的值，在该key上我们存储一个时间戳（用毫秒表示，t1），为了避免死锁以及其他客户端占用该锁超过一定时间（5秒），使用该客户端当前时间戳，与存储的时间戳作比较。 3.如果没有超过该key的使用时限，返回false，表示其他人正在占用该key，不能强制使用；如果已经超过时限，那我们就可以进行解锁，使用我们的时间戳来代替该字段.... 关于分布式锁，一般有三种选择， 1、redis （setnx,redisson,redlock） 2、zk 3、DB锁（悲观锁、乐观锁） 其中用的最多的应该是redis。 redis常用的方式有单节点、主从模式、哨兵模式、集群模式。 单节点在生产环境基本上不会使用，因为不能达到高可用，且连RDB或AOF备份都只能放在master上，所以基本上不会使用。 另外几种模式都无法避免两个问题： 1、异步数据丢失。 2、脑裂问题。 setnx 1.根据lockKey区进行setnx（set not exist，如果key值为空，则正常设置，返回1，否则不会进行设置并返回0）操作，如果设置成功，表示已经获得锁，否则并没有获取锁。 2.如果没有获得锁，去Redis上拿到该key对应的值，在该key上我们存储一个时间戳（用毫秒表示，t1），为了避免死锁以及其他客户端占用该锁超过一定时间（5秒），使用该客户端当前时间戳，与存储的时间戳作比较。 3.如果没有超过该key的使用时限，返回false，表示其他人正在占用该key，不能强制使用；如果已经超过时限，那我们就可以进行解锁，使用我们的时间戳来代替该字段的值。 4.但是如果在setnx失败后，get该值却无法拿到该字段时，说明操作之前该锁已经被释放，这个时候，最好的办法就是重新执行一遍setnx方法来获取其值以获得该锁。 5.释放锁：删除redis中key redlock 红锁 所以redis官方针对这种情况提出了红锁（Redlock）的概念。 假设有5个redis节点，这些节点之间既没有主从，也没有集群关系。客户端用相同的key和随机值在5个节点上请求锁，请求锁的超时时间应小于锁自动释放时间。当在3个（超过半数）redis上请求到锁的时候，才算是真正获取到了锁。如果没有获取到锁，则把部分已锁的redis释放掉。 redisson Redisson是java的redis客户端之一，提供了一些api方便操作redis。 redisson普通的锁实现源码主要是RedissonLock这个类. 源码中加锁/释放锁操作都是用lua脚本完成的，封装的非常完善，开箱即用。 zk分布式锁 1.基于临时顺序节点： 1.客户端调用create()方法创建名为“locknode/guidlock”的节点，需要注意的是，这里节点的创建类型需要设置为EPHEMERALSEQUENTIAL。 2.客户端调用getChildren(“locknode”)方法来获取所有已经创建的子节点。 3.客户端获取到所有子节点path之后，如果发现自己在步骤1中创建的节点是所有节点中序号最小的，那么就认为这个客户端获得了锁。 4.如果创建的节点不是所有节点中序号最小的，那么则监视比自己创建节点的序列号小的最大的节点，进入等待。直到下次监视的子节点变更的时候，再进行子节点的获取，判断是否获取锁。 释放锁的过程相对比较简单，就是删除自己创建的那个子节点即可。 2.基于创建临时节点： 1.就是某个节点尝试创建临时znode，此时创建成功了就获取了这个锁；这个时候别的客户端来创建锁会失败，只能注册个监听器监听这个锁。 2.释放锁就是删除这个znode，一旦释放掉就会通知客户端，然后有一个等待着的客户端就可以再次重新加锁。 总结： 1. redis 需要轮询比较消耗性能，而zk是主动通知，因此zk效率更高； 2. redis 创建锁的客户端如果挂了，只能等待超时后解锁；而zk在客户端挂了后就会自动释放锁； 3. redis 需要做值判断，写脚本等，而且redlock也会存在多节点数据问题，比较麻烦；zk的语义简单明了。 各有利弊。看使用场景去区分使用把 虽然redis那么多问题。但我就是喜欢使用redis锁。 参考:https://zhuanlan.zhihu.com/p/111329801 参考:https://www.cnblogs.com/mengchunchen/p/9647756.html"
  },
  {
    "title": "蚂蚁中间件SOFA",
    "url": "/articles/2020/04/11/1586596278773.html",
    "type": "blog",
    "date": "2020-04-11",
    "topic": "中间件与分布式",
    "topicSlug": "middleware-distributed",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "sofa",
      "蚂蚁中间件",
      "servicemesh",
      "sofaboot"
    ],
    "excerpt": "1.Sofa是什么 SOFA 源自于 Service Oriented Fabric Architecture，即面向服务的架构。 随着 SOFA 的开源，目前 SOFA 的新解释：Scalable Open Financial Architecture SOFA 是蚂蚁金服自主研发的金融级分布式中间件，包含了构建金融...",
    "guide": "本文归入「中间件与分布式」专题，主要记录：1.Sofa是什么 SOFA 源自于 Service Oriented Fabric Architecture，即面向服务的架构。 随着 SOFA 的开源，目前 SOFA 的新解释：Scalable Open Financial Architecture SOFA 是蚂蚁金服自主研发的金融级分布式中间件，包含了构建金融...",
    "content": "1.Sofa是什么 SOFA 源自于 Service Oriented Fabric Architecture，即面向服务的架构。 随着 SOFA 的开源，目前 SOFA 的新解释：Scalable Open Financial Architecture SOFA 是蚂蚁金服自主研发的金融级分布式中间件，包含了构建金融级云原生架构所需的各个组件，包括微服务研发框架，RPC 框架，服务注册中心，分布式定时任务，限流/熔断框架，动态配置推送，分布式链路追踪，Metrics监控度量，分布式高可用消息队列，分布式事务框架，分布式数据库代理层等组件，是一套分布式架构的完整的解决方案，也是在金融场景里锤炼出来的最佳实践。 2.为什么要用Sofa Sofa和Spring cloud 不同点 SOFA中将整个系统拆分为一个个模块(bundle)，SpringCloud将系统拆分为多个微服务(MicroService)，其实意思差不多，各个模块(服务)各司其职，通过JVM/RPC进行调用。 SOFA可以通过JVM/RPC进行服务之间的接口调用，而SpringCloud只能通过RPC/HTTP方式进行.... 1.Sofa是什么 SOFA 源自于 Service Oriented Fabric Architecture，即面向服务的架构。 随着 SOFA 的开源，目前 SOFA 的新解释：Scalable Open Financial Architecture SOFA 是蚂蚁金服自主研发的金融级分布式中间件，包含了构建金融级云原生架构所需的各个组件，包括微服务研发框架，RPC 框架，服务注册中心，分布式定时任务，限流/熔断框架，动态配置推送，分布式链路追踪，Metrics监控度量，分布式高可用消息队列，分布式事务框架，分布式数据库代理层等组件，是一套分布式架构的完整的解决方案，也是在金融场景里锤炼出来的最佳实践。 2.为什么要用Sofa Sofa和Spring cloud 不同点 SOFA中将整个系统拆分为一个个模块(bundle)，SpringCloud将系统拆分为多个微服务(MicroService)，其实意思差不多，各个模块(服务)各司其职，通过JVM/RPC进行调用。 SOFA可以通过JVM/RPC进行服务之间的接口调用，而SpringCloud只能通过RPC/HTTP方式进行调用 Sofa优势 SOFA是蚂蚁金服长期发展沉淀下来的一条技术方案，在SpringCloud出现之前，SOFA已经能够在金融云环境下稳定运行了， 并且SOFA是蚂蚁金服自己研发的一套方案，天然集成了RPC、服务路由等功能，能够与蚂蚁内部其它中间件(如zdal、drm、msgbroker等)无缝结合，这一整套技术方案撑起了蚂蚁金服的核心业务， 它更加适合金融云环境，一旦出现问题能够快速定位并解决。 更详细的比较可以参考：Spring Cloud 与 SOFA 对比（知乎） 3.Sofa优点 模块化，模块边界清晰，易于维护。 服务化，服务的注册和依赖都很方便。 易于扩展，很好的定义扩展点和扩展。 4.Sofa功能 Sofa 服务发布与引用 通过 SOFA JVM 服务的发布与引用，解决了隔离 SOFA 模块的通信问题，SOFA 提供了三种方式给开发人员来发布 JVM 服务和引用，分别是： XML 方式、Annotation 方式及编程 API 方式 。 基于 Velocity 的 Spring 配置 SOFA 的 Spring 配置文件基于 Velocity，根据用户的不同配置文件，将初始化不同的 Bean，提升灵活性。 生命周期管理 SOFA 框架包含完整的生命周期管理，应用可以监听 SOFA 应用或者 SOFA 组件的生命周期事件。 Log4j2 支持 SOFA 框架支持 Log4j2，实现日志的异步打印。同时，SOFA 框架基于 DRM 实现了动态调整日志级别功能。 SOFA 扩展点 SOFA 框架的模块是相互隔离的，SOFA 扩展点允许一个模块对其依赖的模块中定义的组件进行定制化。 健康检查 SOFA框架提供了一套可扩展的健康检查机制，可以帮助应用确定启动完毕后是否健康，是否可以对外提供服务。 Sofa RPC 远程调用 基于 TCP 和自有二进制协议的高效的、透明的远程服务调用，支持更加复杂的对象，且提供了更为丰富的调用方式（sync、oneway、callback、future 等）。 服务发现 服务提供者自动注册到服务注册中心；服务消费者从注册中心订阅服务提供者的地址；支持提供者地址变化的自动发现，为服务提供良好的伸缩性。 集群容错 服务调用者在部分服务提供者出现问题时，进行自动容错。 服务路由与负载均衡 如果存在多个可用的服务提供者，服务调用者在本地根据服务端路由和负载均衡算法选择其中一台进行调用。可在内网替代 F5 等硬件负载均衡器，解决了系统单点问题的同时，大大降低了企业成本。 良好的扩展接口 可以基于各种扩展实现功能。 5.Sofa分层 SOFA应用中各个模块之间的Spring Context是完全隔离的，需要拆分的时候直接将模块拆分即可，调用的方式由本地服务改为远程服务就可以了。本地服务可以理解为注册在本地注册中心，服务之间通过JVM调用，拆分后远程服务注册在远程注册中心，服务之间通过RPC调用。 6.健康检查 1. 在健康检查之前首先调用各个组件的deployCompletion方法，以及应用的ApplicationStartupCallback方法 2. 健康检查内容 检查Spring上下文是否启动成功 检查用户自定义的检查项 检查所有具有流量出口的组件（SOFA Reference，消息发送端）是否健康；如果失败，每过500ms继续检查20次 7.Sofa RPC 8.SOFABoot 相关 8.1 什么是 SOFABoot SOFABoot 官网 SOFABoot 开源社区 SOFABoot 文档 SOFABoot 是基于 Spring Boot 的开发框架，用于快速、敏捷地开发 Spring 应用程序，特别适合构建微服务系统。SOFABoot 在 Spring Boot 的基础上提供了诸如 Readiness Check、类隔离、日志空间隔离等能力，以解决大规模团队开发云原生微服务系统中会遇到的问题。同时 SOFABoot 也提供了蚂蚁金服金融科技中间件的轻量级集成方案，仅需少量配置即可在 SOFABoot 中使用金融科技中间件。金融科技中间件也可通过相应的 starter 模块单独配置集成到 Spring Boot 工程中。普通 Spring 工程通过 EmbeddedSOFA 模式可以方便地集成并使用金融科技中间件。 SOFABoot 基于 Spring Boot 1.4.2 版本开发，使用标准 Spring 接口实现。可将 SOFABoot 理解为 Spring 的一个扩展，构建在 Spring Boot 基础之上提供金融科技中间件解决方案，每一个中间件均是一个可插拔的组件，添加和移除非常方便，同时，利用“约定优先配置”（convention over configuration）的理念完成自动配置，开发者能够更加专注于业务逻辑。 Spring Boot 是一个非常优秀的开源框架，可以快速、敏捷地开发新一代基于 Spring 框架的应用程序，它并不是用来替代 Spring 的解决方案，而是和 Spring 框架紧密结合，用于提升 Spring 开发者体验的工具。SOFABoot 在 Spring Boot 的基础上进行了能力的增强并提供了蚂蚁中间件的轻量集成，且可与 Spring Boot、Spring 工程无缝集成。 SOFABoot 支持创建 Web 和 Core 两种类型的工程。当使用 SOFABoot 开发一个 Web 程序时，相当于“基于 Spring Boot 的 Web 应用 + 蚂蚁金服中间件” 进行开发；当使用 SOFABoot 开发一个 J2SE 程序（无 Web 页面访问），相当于“基于 Spring Boot 的非 Web 应用（无 servlet 依赖）+ 蚂蚁金服中间件” 进行开发。 8.2 功能特性 SOFABoot 框架不仅能实现中间件的集成管理、自动配置以及调用链路监控及治理，支持 EmbeddedSOFA 模式、多类型的部署模式，还具有应用日志和中间件日志的隔离能力，并拥有一套完整的技术栈。 集成管理和自动配置 只需添加相应中间件的 starter 模块，SOFABoot 会自动导入所需的依赖并完成必要的配置。 EmbeddedSOFA 模式 提供 EmbeddedSOFA 模式，以便于在 Spring 编程环境下使用蚂蚁金服金融科技中间件。 调用链路监控及治理 集成日志跟踪工具 Tracer，提供统一的中间件日志埋点和上下文 ID，将上下游系统的调用关系串联起来。 多类型的部署模式 既支持直接运行可执行的 fat JAR 文件，也支持部署至各种 servlet 容器中（如 Tomcat、Jetty、Undertow 等）。 应用日志和中间件日志的隔离能力 各中间件日志均面向 SLF4J 接口进行编程，日志实现依赖于具体的应用配置，且支持日志隔离。 完整的技术栈 拥有一套完整的技术栈，能自动解决后续的依赖下载、应用部署、健康检查、运维监控等问题。开发人员集成框架后，只需专心编写业务代码。 8.3 产品优势 基于 SpringBoot 并兼容开源生态 可与 Spring Boot、Spring 工程无缝集成，降低用"
  },
  {
    "title": "Java垃圾回收期Cms和G1梳理",
    "url": "/articles/2020/04/03/1585929213226.html",
    "type": "blog",
    "date": "2020-04-03",
    "topic": "Java 与 JVM",
    "topicSlug": "java-jvm",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Java",
      "cms",
      "G1",
      "垃圾回收器"
    ],
    "excerpt": "目录 1 CMS收集器 安全点(Safepoint) 安全区域 2 G1收集器 卡表（Card Table） 在开始介绍CMS和G1前，我们可以剧透几点： 根据不同分代的特点，收集器可能不同。有些收集器可以同时用于新生代和老年代，而有些时候，则需要分别为新生代或老年代选用合适的收集器。一般来说，新生代收集器的收集频率较...",
    "guide": "本文归入「Java 与 JVM」专题，主要记录：目录 1 CMS收集器 安全点(Safepoint) 安全区域 2 G1收集器 卡表（Card Table） 在开始介绍CMS和G1前，我们可以剧透几点： 根据不同分代的特点，收集器可能不同。有些收集器可以同时用于新生代和老年代，而有些时候，则需要分别为新生代或老年代选用合适的收集器。一般来说，新生代收集器的收集频率较...",
    "content": "目录 1 CMS收集器 安全点(Safepoint) 安全区域 2 G1收集器 卡表（Card Table） 在开始介绍CMS和G1前，我们可以剧透几点： 根据不同分代的特点，收集器可能不同。有些收集器可以同时用于新生代和老年代，而有些时候，则需要分别为新生代或老年代选用合适的收集器。一般来说，新生代收集器的收集频率较高，应选用性能高效的收集器；而老年代收集器收集次数相对较少，对空间较为敏感，应当避免选择基于复制算法的收集器。 在垃圾收集执行的时刻，应用程序需要暂停运行。 可以串行收集，也可以并行收集。 如果能做到并发收集（应用程序不必暂停），那绝对是很妙的事情。 如果收集行为可控，那也是很妙的事情。 CMS和G1作为垃圾收集器里的大杀器，是需要好好弄明白的，而且面试中也经常被问到。 希望大家带着下面的问题进行阅读，有目标的阅读，收获更多: 为什么没有一种牛逼的收集器像银弹一样适配所有场景？ CMS的优点、缺点、适用场景？ 为什么CMS只能用作老年代收集器，而不能应用在新生代的收集？ G1的优点、缺点、适用场景？ 1 CMS收集器 CMS（Concurrent .... 目录 1 CMS收集器 安全点(Safepoint) 安全区域 2 G1收集器 卡表（Card Table） 在开始介绍CMS和G1前，我们可以剧透几点： 根据不同分代的特点，收集器可能不同。有些收集器可以同时用于新生代和老年代，而有些时候，则需要分别为新生代或老年代选用合适的收集器。一般来说，新生代收集器的收集频率较高，应选用性能高效的收集器；而老年代收集器收集次数相对较少，对空间较为敏感，应当避免选择基于复制算法的收集器。 在垃圾收集执行的时刻，应用程序需要暂停运行。 可以串行收集，也可以并行收集。 如果能做到并发收集（应用程序不必暂停），那绝对是很妙的事情。 如果收集行为可控，那也是很妙的事情。 CMS和G1作为垃圾收集器里的大杀器，是需要好好弄明白的，而且面试中也经常被问到。 希望大家带着下面的问题进行阅读，有目标的阅读，收获更多: 1. 为什么没有一种牛逼的收集器像银弹一样适配所有场景？ 2. CMS的优点、缺点、适用场景？ 3. 为什么CMS只能用作老年代收集器，而不能应用在新生代的收集？ 4. G1的优点、缺点、适用场景？ 1 CMS收集器 CMS（Concurrent Mark Sweep）收集器是一种以获取最短回收停顿时间为目标的收集器。这是因为CMS收集器工作时，GC工作线程与用户线程可以并发执行，以此来达到降低收集停顿时间的目的。 CMS收集器仅作用于老年代的收集，是基于标记清除算法的，它的运作过程分为4个步骤： 初始标记（CMS initial mark）(STW) 并发标记（CMS concurrent mark） 重新标记（CMS remark）(STW) 并发清除（CMS concurrent sweep） 其中，初始标记、重新标记这两个步骤仍然需要Stoptheworld。初始标记仅仅只是标记一下GC Roots能直接关联到的对象，速度很快，并发标记阶段就是进行GC Roots Tracing的过程，而重新标记阶段则是为了修正并发标记期间因用户程序继续运作而导致标记产生变动的那一部分对象的标记记录，这个阶段的停顿时间一般会比初始阶段稍长一些，但远比并发标记的时间短。 CMS以流水线方式拆分了收集周期，将耗时长的操作单元保持与应用线程并发执行。只将那些必需STW才能执行的操作单元单独拎出来，控制这些单元在恰当的时机运行，并能保证仅需短暂的时间就可以完成。这样，在整个收集周期内，只有两次短暂的暂停（初始标记和重新标记），达到了近似并发的目的。 CMS收集器优点：并发收集、低停顿。 CMS收集器缺点： CMS收集器对CPU资源非常敏感。 CMS收集器无法处理浮动垃圾（Floating Garbage）。 CMS收集器是基于标记清除算法，该算法的缺点都有。 CMS收集器之所以能够做到并发，根本原因在于采用基于“标记清除”的算法并对算法过程进行了细粒度的分解。前面篇章介绍过标记清除算法将产生大量的内存碎片这对新生代来说是难以接受的，因此新生代的收集器并未提供CMS版本。 另外要补充一点，JVM在暂停的时候，需要选准一个时机。由于JVM系统运行期间的复杂性，不可能做到随时暂停，因此引入了安全点的概念。 安全点(Safepoint) 安全点，即程序执行时并非在所有地方都能停顿下来开始GC，只有在到达安全点时才能暂停。Safepoint的选定既不能太少以至于让GC等待时间太长，也不能过于频繁以致于过分增大运行时的负荷。 安全点的初始目的并不是让其他线程停下，而是找到一个稳定的执行状态。在这个执行状态下，Java虚拟机的堆栈不会发生变化。这么一来，垃圾回收器便能够“安全”地执行可达性分析。只要不离开这个安全点，Java虚拟机便能够在垃圾回收的同时，继续运行这段本地代码。 程序运行时并非在所有地方都能停顿下来开始GC，只有在到达安全点时才能暂停。安全点的选定基本上是以程序“是否具有让程序长时间执行的特征”为标准进行选定的。“长时间执行”的最明显特征就是指令序列复用，例如方法调用、循环跳转、异常跳转等，所以具有这些功能的指令才会产生Safepoint。 对于安全点，另一个需要考虑的问题就是如何在GC发生时让所有线程（这里不包括执行JNI调用的线程）都“跑”到最近的安全点上再停顿下来。 两种解决方案： 抢先式中断（Preemptive Suspension） 抢先式中断不需要线程的执行代码主动去配合，在GC发生时，首先把所有线程全部中断，如果发现有线程中断的地方不在安全点上，就恢复线程，让它“跑”到安全点上。现在几乎没有虚拟机采用这种方式来暂停线程从而响应GC事件。 主动式中断（Voluntary Suspension） 主动式中断的思想是当GC需要中断线程的时候，不直接对线程操作，仅仅简单地设置一个标志，各个线程执行时主动去轮询这个标志，发现中断标志为真时就自己中断挂起。轮询标志的地方和安全点是重合的，另外再加上创建对象需要分配内存的地方。 安全区域 指在一段代码片段中，引用关系不会发生变化。在这个区域中任意地方开始GC都是安全的。也可以把Safe Region看作是被扩展了的Safepoint。 2 G1收集器 G1重新定义了堆空间，打破了原有的分代模型，将堆划分为一个个区域。这么做的目的是在进行收集时不必在全堆范围内进行，这是它最显著的特点。区域划分的好处就是带来了停顿时间可预测的收集模型：用户可以指定收集操作在多长时间内完成。即G1提供了接近实时的收集特性。 G1与CMS的特征对比如下： | 特征 | G1 | CMS | | | | | | 并发和分代 | 是 | 是 | | 最大化释放堆内存 | 是 | 否 | | 低延时 | 是 | 是 | | 吞吐量 | 高 | 低 | | 压实 | 是 | 否 | | 可预测性 | 强 | 弱 | | 新生代和老年代的物理隔离 | 否 | 是 | G1具备如下特点： 并行与并发：G1能充分利用多CPU、多核环境下的硬件优势，使用多个CPU来缩短Stoptheworld停顿的时间，部分其他收集器原来需要停顿Java线程执行的GC操作，G1收集器仍然可以通过并发的方式让Java程序继续运行。 分代收集 空间整合：与CMS的标记清除算法不同，G1从整体来看是基于标记整理算法实现的收集器，从局部（两个Region之间）上来看是基于“复制”算法实现的。但无论如何，这两种算法都意味着G1运作期间不会产生内存空间碎片，收集后能提供规整的可用内存。这种特性有利于程序长时间运行，分配大对象时不会因为无法找到连续内存空间而提前触发下一次GC。 可预测的停顿：这是G1相对于CMS的一个优势，降低停顿时间是G1和CMS共同的关注点。 在G1之前的其他收集器进行收集的范围都是整个新生代或者老年代，而G1不再是这样。在堆的结构设计时，G1打破了以往将收集范围固定在新生代或老年代的模式，G1将堆分成许多相同大小的区域单元，每个单元称为Region。Region是一块地址连续的内存空间，G1模块的组成如下图所示： G1收集器将整个Java堆划分为多个大小相等的独立区域（Region），虽然还保留有新生代和老年代的概念，但新生代和老年代不再是物理隔离的了，它们都是一部分Region（不需要连续）的集合。Region的大小是一致的，数值是在1M到32M字节之间的一个2的幂值数，JVM会尽量划分2048个左右、同等大小的Region，这一点可以参看如下源码。其实这个数字既可以手动调整，G1也会根据堆大小自动进行调整。 G1收集器之所以能建立可预测的停顿时间模型，是因为它可以有计划地避免在整个Java堆中进行全区域的垃圾收集。G1会通过一个合理的计算模型，计算出每个Region的收集成本并量化，这样一来，收集器在给定了“停顿”时间限制的情况下，总是能选择一组恰当的Regions作为收集目标，让其收集开销满足这个限制条件，以此达到实时收集的目的。 对于打算从CMS或者ParallelOld收集器迁移过来的应用，按照官方 的建议，如果发现符合如下特征，可以考虑更换成G1收集器以追求更佳性能： 实时数据占用了超过半数的堆空间； 对象分配率或“晋升”的速度变化明显； 期望消除耗时较长的GC或停顿（超过0.5——1秒）。 原文如下： Applications running today with either the CMS or the ParallelOld garb"
  },
  {
    "title": "JVM指令手册",
    "url": "/articles/2020/03/05/1583419653736.html",
    "type": "blog",
    "date": "2020-03-05",
    "topic": "Java 与 JVM",
    "topicSlug": "java-jvm",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "JVM指令",
      "javap"
    ],
    "excerpt": "栈和局部变量操作 将常量压入栈的指令 aconstnull 将null对象引用压入栈 iconstm1 将int类型常量1压入栈 iconst0 将int类型常量0压入栈 iconst1 将int类型常量1压入栈 iconst2 将int类型常量2压入栈 iconst3 将int类型常量3压入栈 iconst4 将in...",
    "guide": "本文归入「Java 与 JVM」专题，主要记录：栈和局部变量操作 将常量压入栈的指令 aconstnull 将null对象引用压入栈 iconstm1 将int类型常量1压入栈 iconst0 将int类型常量0压入栈 iconst1 将int类型常量1压入栈 iconst2 将int类型常量2压入栈 iconst3 将int类型常量3压入栈 iconst4 将in...",
    "content": "栈和局部变量操作 将常量压入栈的指令 aconstnull 将null对象引用压入栈 iconstm1 将int类型常量1压入栈 iconst0 将int类型常量0压入栈 iconst1 将int类型常量1压入栈 iconst2 将int类型常量2压入栈 iconst3 将int类型常量3压入栈 iconst4 将int类型常量4压入栈 iconst5 将int类型常量5压入栈 lconst0 将long类型常量0压入栈 lconst1 将long类型常量1压入栈 fconst0 将float类型常量0压入栈 fconst1 将float类型常量1压入栈 dconst0 将double类型常量0压入栈 dconst1 将double类型常量1压入栈 bipush 将一个8位带符号整数压入栈 sipush 将16位带符号整数压入栈 ldc 把常量池中的项压入栈 ldcw 把常量池中的项压入栈（使用宽索引） ldc2w 把常量池中long类型或者double类型的项压入栈（使用宽索引） 从栈中的局部变量中装载值的指令 iload 从局部变量中装载int类型.... 栈和局部变量操作 将常量压入栈的指令 aconstnull 将null对象引用压入栈 iconstm1 将int类型常量1压入栈 iconst0 将int类型常量0压入栈 iconst1 将int类型常量1压入栈 iconst2 将int类型常量2压入栈 iconst3 将int类型常量3压入栈 iconst4 将int类型常量4压入栈 iconst5 将int类型常量5压入栈 lconst0 将long类型常量0压入栈 lconst1 将long类型常量1压入栈 fconst0 将float类型常量0压入栈 fconst1 将float类型常量1压入栈 dconst0 将double类型常量0压入栈 dconst1 将double类型常量1压入栈 bipush 将一个8位带符号整数压入栈 sipush 将16位带符号整数压入栈 ldc 把常量池中的项压入栈 ldcw 把常量池中的项压入栈（使用宽索引） ldc2w 把常量池中long类型或者double类型的项压入栈（使用宽索引） 从栈中的局部变量中装载值的指令 iload 从局部变量中装载int类型值 lload 从局部变量中装载long类型值 fload 从局部变量中装载float类型值 dload 从局部变量中装载double类型值 aload 从局部变量中装载引用类型值（refernce） iload0 从局部变量0中装载int类型值 iload1 从局部变量1中装载int类型值 iload2 从局部变量2中装载int类型值 iload3 从局部变量3中装载int类型值 lload0 从局部变量0中装载long类型值 lload1 从局部变量1中装载long类型值 lload2 从局部变量2中装载long类型值 lload3 从局部变量3中装载long类型值 fload0 从局部变量0中装载float类型值 fload1 从局部变量1中装载float类型值 fload2 从局部变量2中装载float类型值 fload3 从局部变量3中装载float类型值 dload0 从局部变量0中装载double类型值 dload1 从局部变量1中装载double类型值 dload2 从局部变量2中装载double类型值 dload3 从局部变量3中装载double类型值 aload0 从局部变量0中装载引用类型值 aload1 从局部变量1中装载引用类型值 aload2 从局部变量2中装载引用类型值 aload3 从局部变量3中装载引用类型值 iaload 从数组中装载int类型值 laload 从数组中装载long类型值 faload 从数组中装载float类型值 daload 从数组中装载double类型值 aaload 从数组中装载引用类型值 baload 从数组中装载byte类型或boolean类型值 caload 从数组中装载char类型值 saload 从数组中装载short类型值 将栈中的值存入局部变量的指令 istore 将int类型值存入局部变量 lstore 将long类型值存入局部变量 fstore 将float类型值存入局部变量 dstore 将double类型值存入局部变量 astore 将将引用类型或returnAddress类型值存入局部变量 istore0 将int类型值存入局部变量0 istore1 将int类型值存入局部变量1 istore2 将int类型值存入局部变量2 istore3 将int类型值存入局部变量3 lstore0 将long类型值存入局部变量0 lstore1 将long类型值存入局部变量1 lstore2 将long类型值存入局部变量2 lstore3 将long类型值存入局部变量3 fstore0 将float类型值存入局部变量0 fstore1 将float类型值存入局部变量1 fstore2 将float类型值存入局部变量2 fstore3 将float类型值存入局部变量3 dstore0 将double类型值存入局部变量0 dstore1 将double类型值存入局部变量1 dstore2 将double类型值存入局部变量2 dstore3 将double类型值存入局部变量3 astore0 将引用类型或returnAddress类型值存入局部变量0 astore1 将引用类型或returnAddress类型值存入局部变量1 astore2 将引用类型或returnAddress类型值存入局部变量2 astore3 将引用类型或returnAddress类型值存入局部变量3 iastore 将int类型值存入数组中 lastore 将long类型值存入数组中 fastore 将float类型值存入数组中 dastore 将double类型值存入数组中 aastore 将引用类型值存入数组中 bastore 将byte类型或者boolean类型值存入数组中 castore 将char类型值存入数组中 sastore 将short类型值存入数组中 wide指令 wide 使用附加字节扩展局部变量索引 通用(无类型）栈操作 nop 不做任何操作 pop 弹出栈顶端一个字长的内容 pop2 弹出栈顶端两个字长的内容 dup 复制栈顶部一个字长内容 dupx1 复制栈顶部一个字长的内容，然后将复制内容及原来弹出的两个字长的内容压入栈 dupx2 复制栈顶部一个字长的内容，然后将复制内容及原来弹出的三个字长的内容压入栈 dup2 复制栈顶部两个字长内容 dup2x1 复制栈顶部两个字长的内容，然后将复制内容及原来弹出的三个字长的内容压入栈 dup2x2 复制栈顶部两个字长的内容，然后将复制内容及原来弹出的四个字长的内容压入栈 swap 交换栈顶部两个字长内容 类型转换 i2l 把int类型的数据转化为long类型 i2f 把int类型的数据转化为float类型 i2d 把int类型的数据转化为double类型 l2i 把long类型的数据转化为int类型 l2f 把long类型的数据转化为float类型 l2d 把long类型的数据转化为double类型 f2i 把float类型的数据转化为int类型 f2l 把float类型的数据转化为long类型 f2d 把float类型的数据转化为double类型 d2i 把double类型的数据转化为int类型 d2l 把double类型的数据转化为long类型 d2f 把double类型的数据转化为float类型 i2b 把int类型的数据转化为byte类型 i2c 把int类型的数据转化为char类型 i2s 把int类型的数据转化为short类型 整数运算 iadd 执行int类型的加法 ladd 执行long类型的加法 isub 执行int类型的减法 lsub 执行long类型的减法 imul 执行int类型的乘法 lmul 执行long类型的乘法 idiv 执行int类型的除法 ldiv 执行long类型的除法 irem 计算int类型除法的余数 lrem 计算long类型除法的余数 ineg 对一个int类型值进行取反操作 lneg 对一个long类型值进行取反操作 iinc 把一个常量值加到一个int类型的局部变量上 逻辑运算 移位操作 ishl 执行int类型的向左移位操作 lshl 执行long类型的向左移位操作 ishr 执行int类型的向右移位操作 lshr 执行long类型的向右移位操作 iushr 执行int类型的向右逻辑移位操作 lushr 执行long类型的向右逻辑移位操作 按位布尔运算 iand 对int类型值进行“逻辑与”操作 land 对long类型值进行“逻辑与”操作 ior 对int类型值进行“逻辑或”操作 lor 对long类型值进行“逻辑或”操作 ixor 对int类型值进行“逻辑异或”操作 lxor 对long类型值进行“逻辑异或”操作 浮点运算 fadd 执行float类型的加法 dadd 执行double类型的加法 fsub 执行float类型的减法 dsub 执行double类型的减法 fmul 执行float类型的乘法 dmul 执行double类型的乘法 fdiv 执行float类型的除法 ddiv 执行double类型的除法 frem 计算float类型除法的余数 drem 计算double类"
  },
  {
    "title": "springboot升级swagger-ui进化版knife4j简单集成",
    "url": "/articles/2020/02/27/1582768389143.html",
    "type": "blog",
    "date": "2020-02-27",
    "topic": "Spring Boot 与后端框架",
    "topicSlug": "spring-backend",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Swagger",
      "knife4j",
      "Java",
      "Spring Boot"
    ],
    "excerpt": "1.官方文档 knife4j接入文档 2.概述 引入基础包，如果老项目以前有swagger做doc文档。那就省事了。可以直接引入新ui包 &lt;dependency&gt; &lt;groupId&gt;io.springfox&lt;/groupId&gt; &lt;artifactId&gt;springfoxs...",
    "guide": "本文归入「Spring Boot 与后端框架」专题，主要记录：1.官方文档 knife4j接入文档 2.概述 引入基础包，如果老项目以前有swagger做doc文档。那就省事了。可以直接引入新ui包 &lt;dependency&gt; &lt;groupId&gt;io.springfox&lt;/groupId&gt; &lt;artifactId&gt;springfoxs...",
    "content": "1.官方文档 knife4j接入文档 2.概述 引入基础包，如果老项目以前有swagger做doc文档。那就省事了。可以直接引入新ui包 &lt;dependency&gt; &lt;groupId&gt;io.springfox&lt;/groupId&gt; &lt;artifactId&gt;springfoxswagger2&lt;/artifactId&gt; &lt;version&gt;2.9.2&lt;/version&gt; &lt;/dependency&gt; 新ui包 ，我用的 lastVersion =1.9.6 &lt;dependency&gt; &lt;groupId&gt;com.github.xiaoymin&lt;/groupId&gt; &lt;artifactId&gt;swaggerbootstrapui&lt;/artifactId&gt; &lt;version&gt;${lastVersion}&lt;/version&gt; &lt;/dependency&gt; 3.配置相关 其实就是swagger的配置哈 @Conf.... 1.官方文档 knife4j接入文档 2.概述 引入基础包，如果老项目以前有swagger做doc文档。那就省事了。可以直接引入新ui包 com.github.xiaoymin swaggerbootstrapui ${lastVersion} 3.配置相关 其实就是swagger的配置哈 4.添加访问路径 doc.html 和swaggerui.html 同理 SpringBoot中访问doc.html 实现SpringBoot的WebMvcConfigurer接口，添加相关的ResourceHandler,代码如下： 5.成果展示"
  },
  {
    "title": "mysql中information_schema用途",
    "url": "/articles/2020/02/20/1582211908887.html",
    "type": "blog",
    "date": "2020-02-20",
    "topic": "MySQL 与数据架构",
    "topicSlug": "mysql-data",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "MySQL"
    ],
    "excerpt": "一、informationschema简介 在MySQL中，把 informationschema 看作是一个数据库，确切说是信息数据库。其中保存着关于MySQL服务器所维护的所有其他数据库的信息。如数据库名，数据库的表，表栏的数据类型与访问权 限等。在INFORMATIONSCHEMA中，有数个只读表。它们实际上是视...",
    "guide": "本文归入「MySQL 与数据架构」专题，主要记录：一、informationschema简介 在MySQL中，把 informationschema 看作是一个数据库，确切说是信息数据库。其中保存着关于MySQL服务器所维护的所有其他数据库的信息。如数据库名，数据库的表，表栏的数据类型与访问权 限等。在INFORMATIONSCHEMA中，有数个只读表。它们实际上是视...",
    "content": "一、informationschema简介 在MySQL中，把 informationschema 看作是一个数据库，确切说是信息数据库。其中保存着关于MySQL服务器所维护的所有其他数据库的信息。如数据库名，数据库的表，表栏的数据类型与访问权 限等。在INFORMATIONSCHEMA中，有数个只读表。它们实际上是视图，而不是基本表，因此，你将无法看到与之相关的任何文件。 1informationschema数据库表说明: SCHEMATA表：提供了当前mysql实例中所有数据库的信息。是show databases的结果取之此表。 TABLES表：提供了关于数据库中的表的信息（包括视图）。详细表述了某个表属于哪个schema，表类型，表引擎，创建时间等信息。是show tables from schemaname的结果取之此表。 COLUMNS表：提供了表中的列信息。详细表述了某张表的所有列以及每个列的信息。是show columns from schemaname.tablename的结果取之此表。 STATISTICS表：提供了关于表索引的信息。是show index .... 一、informationschema简介 在MySQL中，把 informationschema 看作是一个数据库，确切说是信息数据库。其中保存着关于MySQL服务器所维护的所有其他数据库的信息。如数据库名，数据库的表，表栏的数据类型与访问权 限等。在INFORMATIONSCHEMA中，有数个只读表。它们实际上是视图，而不是基本表，因此，你将无法看到与之相关的任何文件。 1informationschema数据库表说明: SCHEMATA表：提供了当前mysql实例中所有数据库的信息。是show databases的结果取之此表。 TABLES表：提供了关于数据库中的表的信息（包括视图）。详细表述了某个表属于哪个schema，表类型，表引擎，创建时间等信息。是show tables from schemaname的结果取之此表。 COLUMNS表：提供了表中的列信息。详细表述了某张表的所有列以及每个列的信息。是show columns from schemaname.tablename的结果取之此表。 STATISTICS表：提供了关于表索引的信息。是show index from schemaname.tablename的结果取之此表。 USERPRIVILEGES（用户权限）表：给出了关于全程权限的信息。该信息源自mysql.user授权表。是非标准表。 SCHEMAPRIVILEGES（方案权限）表：给出了关于方案（数据库）权限的信息。该信息来自mysql.db授权表。是非标准表。 TABLEPRIVILEGES（表权限）表：给出了关于表权限的信息。该信息源自mysql.tablespriv授权表。是非标准表。 COLUMNPRIVILEGES（列权限）表：给出了关于列权限的信息。该信息源自mysql.columnspriv授权表。是非标准表。 CHARACTERSETS（字符集）表：提供了mysql实例可用字符集的信息。是SHOW CHARACTER SET结果集取之此表。 COLLATIONS表：提供了关于各字符集的对照信息。 COLLATIONCHARACTERSETAPPLICABILITY表：指明了可用于校对的字符集。这些列等效于SHOW COLLATION的前两个显示字段。 TABLECONSTRAINTS表：描述了存在约束的表。以及表的约束类型。 KEYCOLUMNUSAGE表：描述了具有约束的键列。 ROUTINES表：提供了关于存储子程序（存储程序和函数）的信息。此时，ROUTINES表不包含自定义函数（UDF）。名为“mysql.proc name”的列指明了对应于INFORMATIONSCHEMA.ROUTINES表的mysql.proc表列。 VIEWS表：给出了关于数据库中的视图的信息。需要有show views权限，否则无法查看视图信息。 TRIGGERS表：提供了关于触发程序的信息。必须有super权限才能查看该表 二、用途 1、查看数据库各个表数据占用空间大小 2、查看数据库中各个表字段个数 3、查看数据库各个表的数据条数"
  },
  {
    "title": "Java多线程中锁的理解与使用",
    "url": "/articles/2020/02/19/1582046551397.html",
    "type": "blog",
    "date": "2020-02-19",
    "topic": "Java 与 JVM",
    "topicSlug": "java-jvm",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "jvm锁",
      "java锁",
      "锁",
      "独占锁"
    ],
    "excerpt": "1.简介 锁作为并发共享数据，保证一致性的工具，在JAVA平台有多种实现(如 synchronized 和 ReentrantLock等 ) 。 2.Java锁的种类 公平锁/非公平锁 可重入锁 独享锁/共享锁 互斥锁/读写锁 乐观锁/悲观锁 分段锁 偏向锁/轻量级锁/重量级锁 自旋锁 上面是很多锁的名词，这些分类并不...",
    "guide": "本文归入「Java 与 JVM」专题，主要记录：1.简介 锁作为并发共享数据，保证一致性的工具，在JAVA平台有多种实现(如 synchronized 和 ReentrantLock等 ) 。 2.Java锁的种类 公平锁/非公平锁 可重入锁 独享锁/共享锁 互斥锁/读写锁 乐观锁/悲观锁 分段锁 偏向锁/轻量级锁/重量级锁 自旋锁 上面是很多锁的名词，这些分类并不...",
    "content": "1.简介 锁作为并发共享数据，保证一致性的工具，在JAVA平台有多种实现(如 synchronized 和 ReentrantLock等 ) 。 2.Java锁的种类 公平锁/非公平锁 可重入锁 独享锁/共享锁 互斥锁/读写锁 乐观锁/悲观锁 分段锁 偏向锁/轻量级锁/重量级锁 自旋锁 上面是很多锁的名词，这些分类并不是全是指锁的状态，有的指锁的特性，有的指锁的设计，下面总结的内容是对每个锁的名词进行一定的解释。 公平锁/非公平锁 公平锁是指多个线程按照申请锁的顺序来获取锁。 非公平锁是指多个线程获取锁的顺序并不是按照申请锁的顺序，有可能后申请的线程比先申请的线程优先获取锁。有可能，会造成优先级反转或者饥饿现象。 对于Java ReentrantLock而言，通过构造函数指定该锁是否是公平锁，默认是非公平锁。非公平锁的优点在于吞吐量比公平锁大。 对于synchronized而言，也是一种非公平锁。由于其并不像ReentrantLock是通过AQS的来实现线程调度，所以并没有任何办法使其变成公平锁。 可重入锁 可重入锁又名递归锁，是指在同一个线程在外层方法获取锁的时候，在进入内层方法.... 1.简介 锁作为并发共享数据，保证一致性的工具，在JAVA平台有多种实现(如 synchronized 和 ReentrantLock等 ) 。 2.Java锁的种类 公平锁/非公平锁 可重入锁 独享锁/共享锁 互斥锁/读写锁 乐观锁/悲观锁 分段锁 偏向锁/轻量级锁/重量级锁 自旋锁 上面是很多锁的名词，这些分类并不是全是指锁的状态，有的指锁的特性，有的指锁的设计，下面总结的内容是对每个锁的名词进行一定的解释。 公平锁/非公平锁 公平锁是指多个线程按照申请锁的顺序来获取锁。 非公平锁是指多个线程获取锁的顺序并不是按照申请锁的顺序，有可能后申请的线程比先申请的线程优先获取锁。有可能，会造成优先级反转或者饥饿现象。 对于Java ReentrantLock而言，通过构造函数指定该锁是否是公平锁，默认是非公平锁。非公平锁的优点在于吞吐量比公平锁大。 对于synchronized而言，也是一种非公平锁。由于其并不像ReentrantLock是通过AQS的来实现线程调度，所以并没有任何办法使其变成公平锁。 可重入锁 可重入锁又名递归锁，是指在同一个线程在外层方法获取锁的时候，在进入内层方法会自动获取锁。对于Java ReentrantLock而言, 其名字是Re entrant Lock即是重新进入锁。对于synchronized而言，也是一个可重入锁。可重入锁的一个好处是可一定程度避免死锁。 上面的代码就是一个可重入锁的一个特点，如果不是可重入锁的话，setB可能不会被当前线程执行，可能造成死锁。 独享锁/共享锁 独享锁是指该锁一次只能被一个线程所持有；共享锁是指该锁可被多个线程所持有。 对于Java ReentrantLock而言，其是独享锁。但是对于Lock的另一个实现类ReadWriteLock，其读锁是共享锁，其写锁是独享锁。读锁的共享锁可保证并发读是非常高效的，读写、写读 、写写的过程是互斥的。独享锁与共享锁也是通过AQS来实现的，通过实现不同的方法，来实现独享或者共享。对于synchronized而言，当然是独享锁 互斥锁/读写锁 上面说到的独享锁/共享锁就是一种广义的说法，互斥锁/读写锁就是具体的实现。互斥锁在Java中的具体实现就是ReentrantLock；读写锁在Java中的具体实现就是ReadWriteLock。 乐观锁/悲观锁 乐观锁与悲观锁不是指具体的什么类型的锁，而是指看待并发同步的角度。 悲观锁：总是假设最坏的情况，每次去拿数据的时候都认为别人会修改，所以每次在拿数据的时候都会上锁，这样别人想拿这个数据就会阻塞直到它拿到锁。比如Java里面的同步原语synchronized关键字的实现就是悲观锁。 乐观锁：顾名思义，就是很乐观，每次去拿数据的时候都认为别人不会修改，所以不会上锁，但是在更新的时候会判断一下在此期间别人有没有去更新这个数据，可以使用版本号等机制。乐观锁适用于多读的应用类型，这样可以提高吞吐量，在Java中java.util.concurrent.atomic包下面的原子变量类就是使用了乐观锁的一种实现方式CAS(Compare and Swap 比较并交换)实现的。 分段锁 分段锁其实是一种锁的设计，并不是具体的一种锁，对于ConcurrentHashMap而言，其并发的实现就是通过分段锁的形式来实现高效的并发操作，ConcurrentHashMap中的分段锁称为Segment，它即类似于HashMap（JDK7与JDK8中HashMap的实现）的结构，即内部拥有一个Entry数组，数组中的每个元素又是一个链表；同时又是一个ReentrantLock（Segment继承了ReentrantLock)。当需要put元素的时候，并不是对整个HashMap进行加锁，而是先通过hashcode来知道他要放在那一个分段中，然后对这个分段进行加锁，所以当多线程put的时候，只要不是放在一个分段中，就实现了真正的并行的插入。但是，在统计size的时候，可就是获取HashMap全局信息的时候，就需要获取所有的分段锁才能统计。 分段锁的设计目的是细化锁的粒度，当操作不需要更新整个数组的时候，就仅仅针对数组中的一项进行加锁操作。 偏向锁/轻量级锁/重量级锁 这三种锁是指锁的状态，并且是针对synchronized。在Java 5通过引入锁升级的机制来实现高效synchronized。这三种锁的状态是通过对象监视器在对象头中的字段来表明的。 偏向锁是指一段同步代码一直被一个线程所访问，那么该线程会自动获取锁。降低获取锁的代价。 轻量级锁是指当锁是偏向锁的时候，被另一个线程所访问，偏向锁就会升级为轻量级锁，其他线程会通过自旋的形式尝试获取锁，不会阻塞，提高性能。 重量级锁是指当锁为轻量级锁的时候，另一个线程虽然是自旋，但自旋不会一直持续下去，当自旋一定次数的时候，还没有获取到锁，就会进入阻塞，该锁膨胀为重量级锁。重量级锁会让其他申请的线程进入阻塞，性能降低。 自旋锁 在Java中，自旋锁是指尝试获取锁的线程不会立即阻塞，而是采用循环的方式去尝试获取锁，这样的好处是减少线程上下文切换的消耗，缺点是循环会消耗CPU。 3.锁的使用 3.1 预备知识 3.1.1 AQS AbstractQueuedSynchronized 抽象的队列式的同步器，AQS定义了一套多线程访问共享资源的同步器框架，许多同步类实现都依赖于它，如常用的ReentrantLock/Semaphore/CountDownLatch… AQS维护了一个volatile int state（代表共享资源）和一个FIFO线程等待队列（多线程争用资源被阻塞时会进入此队列）。state的访问方式有三种: AQS定义两种资源共享方式：Exclusive（独占，只有一个线程能执行，如ReentrantLock）和Share（共享，多个线程可同时执行，如Semaphore/CountDownLatch）。 不同的自定义同步器争用共享资源的方式也不同。自定义同步器在实现时只需要实现共享资源state的获取与释放方式即可，至于具体线程等待队列的维护（如获取资源失败入队/唤醒出队等），AQS已经在顶层实现好了。自定义同步器实现时主要实现以下几种方法： 以ReentrantLock为例，state初始化为0，表示未锁定状态。A线程lock()时，会调用tryAcquire()独占该锁并将state+1。此后，其他线程再tryAcquire()时就会失败，直到A线程unlock()到state=0（即释放锁）为止，其它线程才有机会获取该锁。当然，释放锁之前，A线程自己是可以重复获取此锁的（state会累加），这就是可重入的概念。但要注意，获取多少次就要释放多么次，这样才能保证state是能回到零态的。 再以CountDownLatch以例，任务分为N个子线程去执行，state也初始化为N（注意N要与线程个数一致）。这N个子线程是并行执行的，每个子线程执行完后countDown()一次，state会CAS减1。等到所有子线程都执行完后(即state=0)，会unpark()主调用线程，然后主调用线程就会从await()函数返回，继续后余动作。 一般来说，自定义同步器要么是独占方法，要么是共享方式，他们也只需实现tryAcquiretryRelease、tryAcquireSharedtryReleaseShared中的一种即可。但AQS也支持自定义同步器同时实现独占和共享两种方式，如ReentrantReadWriteLock。 3.2 CAS CAS(Compare and Swap 比较并交换)是乐观锁技术，当多个线程尝试使用CAS同时更新同一个变量时，只有其中一个线程能更新变量的值，而其它线程都失败，失败的线程并不会被挂起，而是被告知这次竞争中失败，并可以再次尝试。 CAS操作中包含三个操作数——需要读写的内存位置(V)、进行比较的预期原值(A)和拟写入的新值(B)。如果内存位置V的值与预期原值A相匹配，那么处理器会自动将该位置值更新为新值B，否则处理器不做任何操作。无论哪种情况，它都会在CAS 指令之前返回该位置的值（在CAS的一些特殊情况下将仅返回CAS是否成功，而不提取当前值）。CAS有效地说明了“ 我认为位置V应该包含值A；如果包含该值，则将 B放到这个位置；否则，不要更改该位置，只告诉我这个位置"
  },
  {
    "title": "免费接口api分享（终于找到了）",
    "url": "/articles/2020/02/18/1582037776392.html",
    "type": "blog",
    "date": "2020-02-18",
    "topic": "中间件与分布式",
    "topicSlug": "middleware-distributed",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "免费api",
      "聚合数据"
    ],
    "excerpt": "各类无次数限制的免费API接口整理，主要是聚合数据上和API Store上的一些，还有一些其他的。 聚合数据提供30大类,160种以上基础数据API服务,国内最大的基础数据API服务，下面就罗列一些免费的各类API接口。 手机号码归属地API接口： https://www.juhe.cn/docs/api/id/11 ...",
    "guide": "本文归入「中间件与分布式」专题，主要记录：各类无次数限制的免费API接口整理，主要是聚合数据上和API Store上的一些，还有一些其他的。 聚合数据提供30大类,160种以上基础数据API服务,国内最大的基础数据API服务，下面就罗列一些免费的各类API接口。 手机号码归属地API接口： https://www.juhe.cn/docs/api/id/11 ...",
    "content": "各类无次数限制的免费API接口整理，主要是聚合数据上和API Store上的一些，还有一些其他的。 聚合数据提供30大类,160种以上基础数据API服务,国内最大的基础数据API服务，下面就罗列一些免费的各类API接口。 手机号码归属地API接口： https://www.juhe.cn/docs/api/id/11 历史上的今天API接口： https://www.juhe.cn/docs/api/id/63 股票数据API接口： https://www.juhe.cn/docs/api/id/21 全国WIFI接口： https://www.juhe.cn/docs/api/id/18 星座运势接口： https://www.juhe.cn/docs/api/id/58 黄金数据接口： https://www.juhe.cn/docs/api/id/29 语音识别接口： https://www.juhe.cn/docs/api/id/134 周公解梦接口： https://www.juhe.cn/docs/api/id/64 天气预报API接口： https://www.juhe..... 各类无次数限制的免费API接口整理，主要是聚合数据上和API Store上的一些，还有一些其他的。 聚合数据提供30大类,160种以上基础数据API服务,国内最大的基础数据API服务，下面就罗列一些免费的各类API接口。 手机号码归属地API接口： https://www.juhe.cn/docs/api/id/11 历史上的今天API接口： https://www.juhe.cn/docs/api/id/63 股票数据API接口： https://www.juhe.cn/docs/api/id/21 全国WIFI接口： https://www.juhe.cn/docs/api/id/18 星座运势接口： https://www.juhe.cn/docs/api/id/58 黄金数据接口： https://www.juhe.cn/docs/api/id/29 语音识别接口： https://www.juhe.cn/docs/api/id/134 周公解梦接口： https://www.juhe.cn/docs/api/id/64 天气预报API接口： https://www.juhe.cn/docs/api/id/73 身份证查询API接口： https://www.juhe.cn/docs/api/id/38 笑话大全API接口： https://www.juhe.cn/docs/api/id/95 邮编查询接口： https://www.juhe.cn/docs/api/id/66 老黄历接口： https://www.juhe.cn/docs/api/id/65 网站安全检测接口： https://www.juhe.cn/docs/api/id/19 手机固话来电显示接口： https://www.juhe.cn/docs/api/id/72 基金财务数据接口： https://www.juhe.cn/docs/api/id/28 成语词典接口： https://www.juhe.cn/docs/api/id/157 新闻头条接口： https://www.juhe.cn/docs/api/id/235 IP地址接口： https://www.juhe.cn/docs/api/id/1 问答机器人接口： https://www.juhe.cn/docs/api/id/112 汇率API接口： https://www.juhe.cn/docs/api/id/80 电影票房接口： https://www.juhe.cn/docs/api/id/44 万年历API接口： https://www.juhe.cn/docs/api/id/177 NBA赛事接口： https://www.juhe.cn/docs/api/id/92 IP地址查询 http://apistore.baidu.com/apiworks/servicedetail/114.html 频道新闻API易源 http://apistore.baidu.com/apiworks/servicedetail/688.html 微信热门精选 ： http://apistore.baidu.com/apiworks/servicedetail/632.html 天气查询 http://apistore.baidu.com/apiworks/servicedetail/112.html 中国和世界天气预报 http://apistore.baidu.com/apiworks/servicedetail/478.html 股票查询 http://apistore.baidu.com/apiworks/servicedetail/115.html 身份证查询： http://apistore.baidu.com/apiworks/servicedetail/113.html 美女图片 http://apistore.baidu.com/apiworks/servicedetail/720.html 音乐搜索 http://apistore.baidu.com/apiworks/servicedetail/1020.html 图灵机器人 http://apistore.baidu.com/apiworks/servicedetail/736.html 汇率转换 http://apistore.baidu.com/apiworks/servicedetail/119.html 节假日 http://apistore.baidu.com/apiworks/servicedetail/1116.html pullword在线分词服务 http://apistore.baidu.com/apiworks/servicedetail/143.html 去哪儿网火车票 http://apistore.baidu.com/apiworks/servicedetail/697.html 笑话大全 http://apistore.baidu.com/apiworks/servicedetail/864.html 银行卡查询服务 http://apistore.baidu.com/apiworks/servicedetail/735.html 语音合成 http://apistore.baidu.com/apiworks/servicedetail/867.html 宅言API动漫台词接口 http://apistore.baidu.com/apiworks/servicedetail/446.html 去哪儿景点门票查询 http://apistore.baidu.com/apiworks/servicedetail/140.html 手机号码归属地 http://apistore.baidu.com/apiworks/servicedetail/794.html 体育新闻 http://apistore.baidu.com/apiworks/servicedetail/711.html 手机归属地查询 http://apistore.baidu.com/apiworks/servicedetail/709.html 科技新闻 http://apistore.baidu.com/apiworks/servicedetail/1061.html 空气质量指数 http://apistore.baidu.com/apiworks/servicedetail/116.html 天狗健康菜谱 http://apistore.baidu.com/apiworks/servicedetail/987.html 热门游记列表 http://apistore.baidu.com/apiworks/servicedetail/520.html 天狗药品查询 http://apistore.baidu.com/apiworks/servicedetail/916.html 汉字转拼音 http://apistore.baidu.com/apiworks/servicedetail/1124.html 国际新闻 http://apistore.baidu.com/apiworks/servicedetail/823.html 彩票 http://apistore.baidu.com/apiworks/servicedetail/164.html 微信精选 http://apistore.baidu.com/apiworks/servicedetail/863.html 天狗健康资讯 http://apistore.baidu.com/apiworks/servicedetail/888.html 兴趣点检索 http://apistore.baidu.com/apiworks/servicedetail/182.html 用药参考 http://apistore.baidu.com/apiworks/servicedetail/754.html 天狗健康知识 http://apistore.baidu.com/apiworks/servicedetail/899.html 奇闻趣事 http://apistore.baidu.com/apiwor"
  },
  {
    "title": "Python3绘图Turtle库详解",
    "url": "/articles/2020/01/15/1579057224237.html",
    "type": "blog",
    "date": "2020-01-15",
    "topic": "Python 爬虫与自动化",
    "topicSlug": "python-crawler",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Python",
      "turtle",
      "画图"
    ],
    "excerpt": "Turtle库是Python语言中一个很流行的绘制图像的函数库，想象一个小乌龟，在一个横轴为x、纵轴为y的坐标系原点，(0,0)位置开始，它根据一组函数指令的控制，在这个平面坐标系中移动，从而在它爬行的路径上绘制了图形。 turtle绘图的基础知识： 1. 画布(canvas) &nbsp; &nbsp; &nbsp;...",
    "guide": "本文归入「Python 爬虫与自动化」专题，主要记录：Turtle库是Python语言中一个很流行的绘制图像的函数库，想象一个小乌龟，在一个横轴为x、纵轴为y的坐标系原点，(0,0)位置开始，它根据一组函数指令的控制，在这个平面坐标系中移动，从而在它爬行的路径上绘制了图形。 turtle绘图的基础知识： 1. 画布(canvas) &nbsp; &nbsp; &nbsp;...",
    "content": "Turtle库是Python语言中一个很流行的绘制图像的函数库，想象一个小乌龟，在一个横轴为x、纵轴为y的坐标系原点，(0,0)位置开始，它根据一组函数指令的控制，在这个平面坐标系中移动，从而在它爬行的路径上绘制了图形。 turtle绘图的基础知识： 1. 画布(canvas) &nbsp; &nbsp; &nbsp; &nbsp; 画布就是turtle为我们展开用于绘图区域，我们可以设置它的大小和初始位置。 &nbsp; &nbsp; &nbsp; &nbsp; 设置画布大小 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;turtle.screensize(canvwidth=None, canvheight=None, bg=None)，参数分别为画布的宽(单位像素), 高, 背景颜色。 &nbsp; &nbsp; &nbsp; &nbsp; 如：turtle.screensize(800,600, \"green\") &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;turtle.screensize.... Turtle库是Python语言中一个很流行的绘制图像的函数库，想象一个小乌龟，在一个横轴为x、纵轴为y的坐标系原点，(0,0)位置开始，它根据一组函数指令的控制，在这个平面坐标系中移动，从而在它爬行的路径上绘制了图形。 turtle绘图的基础知识： 1. 画布(canvas) 画布就是turtle为我们展开用于绘图区域，我们可以设置它的大小和初始位置。 设置画布大小 turtle.screensize(canvwidth=None, canvheight=None, bg=None)，参数分别为画布的宽(单位像素), 高, 背景颜色。 如：turtle.screensize(800,600, \"green\") turtle.screensize() 返回默认大小(400, 300) turtle.setup(width=0.5, height=0.75, startx=None, starty=None)，参数：width, height: 输入宽和高为整数时, 表示像素; 为小数时, 表示占据电脑屏幕的比例，(startx, starty): 这一坐标表示矩形窗口左上角顶点的位置, 如果为空,则窗口位于屏幕中心。 如：turtle.setup(width=0.6,height=0.6) turtle.setup(width=800,height=800, startx=100, starty=100) 2. 画笔 2.1 画笔的状态 在画布上，默认有一个坐标原点为画布中心的坐标轴，坐标原点上有一只面朝x轴正方向小乌龟。这里我们描述小乌龟时使用了两个词语：坐标原点(位置)，面朝x轴正方向(方向)， turtle绘图中，就是使用位置方向描述小乌龟(画笔)的状态。 2.2 画笔的属性 画笔(画笔的属性，颜色、画线的宽度等) 1) turtle.pensize()：设置画笔的宽度； 2) turtle.pencolor()：没有参数传入，返回当前画笔颜色，传入参数设置画笔颜色，可以是字符串如\"green\", \"red\",也可以是RGB 3元组。 3) turtle.speed(speed)：设置画笔移动速度，画笔绘制的速度范围[0,10]整数，数字越大越快。 2.3 绘图命令 操纵海龟绘图有着许多的命令，这些命令可以划分为3种：一种为运动命令，一种为画笔控制命令，还有一种是全局控制命令。 (1) 画笔运动命令 | 命令 | 说明 | | | | | | turtle.forward(distance) |向当前画笔方向移动distance像素长度| | turtle.backward(distance)| 向当前画笔相反方向移动distance像素长度 | | turtle.right(degree)| 顺时针移动degree° | | turtle.left(degree)| 逆时针移动degree° | | turtle.pendown()| 移动时绘制图形，缺省时也为绘制| | turtle.goto(x,y)| 将画笔移动到坐标为x,y的位置 | | turtle.penup()| 提起笔移动，不绘制图形，用于另起一个地方绘制 | | turtle.circle()| 画圆，半径为正(负)，表示圆心在画笔的左边(右边)画圆| | setx( )| 将当前x轴移动到指定位置| | sety( )| 将当前y轴移动到指定位置 | | setheading(angle)| 设置当前朝向为angle角度 | | home()| 设置当前画笔位置为原点，朝向东。 | | dot(r)| 绘制一个指定直径和颜色的圆点 | (2) 画笔控制命令 | 命令 | 说明 | | | | | | turtle.fillcolor(colorstring)|绘制图形的填充颜色| | turtle.color(color1, color2)|同时设置pencolor=color1, fillcolor=color2| | turtle.filling()|返回当前是否在填充状态| | turtle.beginfill()|准备开始填充图形| | turtle.endfill()|填充完成| | turtle.hideturtle()|隐藏画笔的turtle形状| | turtle.showturtle()|显示画笔的turtle形状| (3) 全局控制命令 | 命令 | 说明 | | | | | | turtle.clear()|清空turtle窗口，但是turtle的位置和状态不会改变| | turtle.reset()|清空窗口，重置turtle状态为起始状态| | turtle.undo()|撤销上一个turtle动作| | turtle.isvisible()|返回当前turtle是否可见| | stamp()|复制当前图形| | turtle.write(s [,font=(\"fontname\",fontsize,\"fonttype\")])|写文本，s为文本内容，font是字体的参数，分别为字体名称，大小和类型；font为可选项，font参数也是可选项| (4) 其他命令 | 命令 | 说明 | | | | | | turtle.mainloop()或turtle.done()|启动事件循环 调用Tkinter的mainloop函数。必须是乌龟图形程序中的最后一个语句。| | turtle.mode(mode=None)|设置乌龟模式（“standard”，“logo”或“world”）并执行重置。如果没有给出模式，则返回当前模式。| | turtle.delay(delay=None)|设置或返回以毫秒为单位的绘图延迟| | turtle.beginpoly()|开始记录多边形的顶点。当前的乌龟位置是多边形的第一个顶点。| | turtle.endpoly()|停止记录多边形的顶点。当前的乌龟位置是多边形的最后一个顶点。将与第一个顶点相连。| | turtle.getpoly()|返回最后记录的多边形|"
  },
  {
    "title": "利用Grafana展示zabbix数据",
    "url": "/articles/2020/01/10/1578637135722.html",
    "type": "blog",
    "date": "2020-01-10",
    "topic": "Linux 运维与部署",
    "topicSlug": "linux-ops",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "grafana",
      "zabbix",
      "CentOS"
    ],
    "excerpt": "一、系统搭建（以Centos7为例） 因为我们的主要目的是展示zabbix的数据，所以建议大家直接在zabbix的服务器上搭建这个系统，亲测两系统无冲突，这样部署的好处是两系统间的数据传输更快，前端展示加载速度也将更快。 首先简单粗暴点，关闭防火墙，以免系统启动的时候出问题。 关闭防火墙 systemctl stop ...",
    "guide": "本文归入「Linux 运维与部署」专题，主要记录：一、系统搭建（以Centos7为例） 因为我们的主要目的是展示zabbix的数据，所以建议大家直接在zabbix的服务器上搭建这个系统，亲测两系统无冲突，这样部署的好处是两系统间的数据传输更快，前端展示加载速度也将更快。 首先简单粗暴点，关闭防火墙，以免系统启动的时候出问题。 关闭防火墙 systemctl stop ...",
    "content": "一、系统搭建（以Centos7为例） 因为我们的主要目的是展示zabbix的数据，所以建议大家直接在zabbix的服务器上搭建这个系统，亲测两系统无冲突，这样部署的好处是两系统间的数据传输更快，前端展示加载速度也将更快。 首先简单粗暴点，关闭防火墙，以免系统启动的时候出问题。 关闭防火墙 systemctl stop firewalld.service 关闭防火墙的开机自启 systemctl disable firewalld.service 替换防火墙参数 sed i&nbsp;'s/SELINUX=enforcing/SELINUX=disabled/'&nbsp;/etc/selinux/config 查看防火墙状态 grep SELINUX=disabled /etc/selinux/config 关闭当前防火墙 setenforce 0 下载rpm源并安装 wget https://dl.grafana.com/oss/release/grafana5.4.21.x8664.rpm yum localinstall grafana5.4..... 一、系统搭建（以Centos7为例） 因为我们的主要目的是展示zabbix的数据，所以建议大家直接在zabbix的服务器上搭建这个系统，亲测两系统无冲突，这样部署的好处是两系统间的数据传输更快，前端展示加载速度也将更快。 首先简单粗暴点，关闭防火墙，以免系统启动的时候出问题。 关闭防火墙 关闭防火墙的开机自启 替换防火墙参数 查看防火墙状态 关闭当前防火墙 下载rpm源并安装 安装插件（这里以zabbix插件为例，其他插件可以去上面的插件库链接里看，需要的再安装） 也可以查看grafanazabbixapp 库，安装最新的插件： 然后重启grafana 最后启动Grafana并添加开机启动项即可。"
  },
  {
    "title": "wireshark安装和基本语法",
    "url": "/articles/2020/01/04/1578123919824.html",
    "type": "blog",
    "date": "2020-01-04",
    "topic": "工具、效率与博客建设",
    "topicSlug": "tools-blog",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "wireshark",
      "网络嗅探"
    ],
    "excerpt": "1.过滤IP，如来源IP或者目标IP等于某个IP 例子: ip.src eq 192.168.1.108 or ip.dst eq 192.168.1.108 或者 ip.addr eq 192.168.1.108 // 都能显示来源IP和目标IP 2.过滤端 口 例子: tcp.port eq 80 // 不管端口是...",
    "guide": "本文归入「工具、效率与博客建设」专题，主要记录：1.过滤IP，如来源IP或者目标IP等于某个IP 例子: ip.src eq 192.168.1.108 or ip.dst eq 192.168.1.108 或者 ip.addr eq 192.168.1.108 // 都能显示来源IP和目标IP 2.过滤端 口 例子: tcp.port eq 80 // 不管端口是...",
    "content": "1.过滤IP，如来源IP或者目标IP等于某个IP 例子: ip.src eq 192.168.1.108 or ip.dst eq 192.168.1.108 或者 ip.addr eq 192.168.1.108 // 都能显示来源IP和目标IP 2.过滤端 口 例子: tcp.port eq 80 // 不管端口是来源的还是目标的都显示 tcp.port == 80 tcp.port eq 2722 tcp.port eq 80 or udp.port eq 80 tcp.dstport == 80 // 只显tcp协议的目标端口80 tcp.srcport == 80 // 只显tcp协议的来源端口80 udp.port eq 15000 过滤端口范围 tcp.port &gt;= 1 and tcp.port &lt;= 80 3.过滤协议 例子: tcp udp arp icmp http smtp ftp dns msnms ip ssl oicq bootp 等 等 排除arp包，如!arp &nbsp;或者 &nbsp;not arp 4.过滤MAC 太以网头过滤 et.... 1.过滤IP，如来源IP或者目标IP等于某个IP 例子: ip.src eq 192.168.1.108 or ip.dst eq 192.168.1.108 或者 ip.addr eq 192.168.1.108 // 都能显示来源IP和目标IP 2.过滤端 口 例子: tcp.port eq 80 // 不管端口是来源的还是目标的都显示 tcp.port == 80 tcp.port eq 2722 tcp.port eq 80 or udp.port eq 80 tcp.dstport == 80 // 只显tcp协议的目标端口80 tcp.srcport == 80 // 只显tcp协议的来源端口80 udp.port eq 15000 过滤端口范围 tcp.port = 1 and tcp.port = 7 指的是ip数据包(tcp下面那块数据),不包括tcp本身 ip.len == 94 除了以太网头固定长度14,其它都算是ip.len,即从ip本身到最后 frame.len == 119 整个数据包长度,从eth开始到最后 eth ip or arp tcp or udp data 6.http模式过滤 例子: http.request.method == \"GET\" http.request.method == \"POST\" http.request.uri == \"/img/logoedu.gif\" http contains \"GET\" http contains \"HTTP/1.\" // GET包 http.request.method == \"GET\" && http contains \"Host: \" http.request.method == \"GET\" && http contains \"UserAgent: \" // POST包 http.request.method == \"POST\" && http contains \"Host: \" http.request.method == \"POST\" && http contains \"UserAgent: \" // 响应包 http contains \"HTTP/1.1 200 OK\" && http contains \"ContentType: \" http contains \"HTTP/1.0 200 OK\" && http contains \"ContentType: \" 一定包含如下ContentType: 7.TCP参数过滤 tcp.flags 显示包含TCP标志的封包。 tcp.flags.syn == 0x02 显示包含TCP SYN标志的封包。 tcp.windowsize == 0 && tcp.flags.reset != 1 8.过滤内容 tcp[20] 表示从20开始，取1个字符 tcp[20:]表示从20开始，取1个字符以上 tcp[20:8]表示从20开始，取8个字符 tcp[offset,n] udp[8:3]==81:60:03 // 偏移8个bytes,再取3个数，是否与==后面的数据相等？ udp[8:1]==32 如果我猜的没有错的话，应该是udp[offset:截取个数]=nValue eth.addr[0:3]==00:06:5B 例 子: 判断upd下面那块数据包前三个是否等于0x20 0x21 0x22 我们都知道udp固定长度为8 udp[8:3]==20:21:22 判 断tcp那块数据包前三个是否等于0x20 0x21 0x22 tcp一般情况下，长度为20,但也有不是20的时候 tcp[8:3]==20:21:22 如 果想得到最准确的，应该先知道tcp长度 matches(匹配)和contains(包含某字符串)语法 ip.src==192.168.1.107 and udp[8:5] matches \"\\\\x02\\\\x12\\\\x21\\\\x00\\\\x22\" ip.src==192.168.1.107 and udp contains 02:12:21:00:22 ip.src==192.168.1.107 and tcp contains \"GET\" udp contains 7c:7c:7d:7d 匹配payload中含有0x7c7c7d7d的UDP数据包，不一定是从第一字节匹配。 例子: 得到本地qq登陆数据包(判断条 件是第一个包==0x02,第四和第五个包等于0x00x22,最后一个包等于0x03) 0x02 xx xx 0x00 0x22 ... 0x03 正确 oicq and udp[8:] matches \"^\\\\x02[\\\\x00\\\\xff][\\\\x00\\\\xff]\\\\x00\\\\x22[\\\\x00\\\\xff]+\\\\x03$\" oicq and udp[8:] matches \"^\\\\x02[\\\\x00\\\\xff]{2}\\\\x00\\\\x22[\\\\x00\\\\xff]+\\\\x03$\" // 登陆包 oicq and (udp[8:] matches \"^\\\\x02[\\\\x00\\\\xff]{2}\\\\x03$\" or tcp[8:] matches \"^\\\\x02[\\\\x00\\\\xff]{2}\\\\x03$\") oicq and (udp[8:] matches \"^\\\\x02[\\\\x00\\\\xff]{2}\\\\x00\\\\x22[\\\\x00\\\\xff]+\\\\x03$\" or tcp[20:] matches \"^\\\\x02[\\\\x00\\\\xff]{2}\\\\x00\\\\x22[\\\\x00\\\\xff]+\\\\x03$\") 不 单单是00:22才有QQ号码,其它的包也有,要满足下面条件(tcp也有，但没有做): oicq and udp[8:] matches \"^\\\\x02[\\\\x00\\\\xff]+\\\\x03$\" and !(udp[11:2]==00:00) and !(udp[11:2]==00:80) oicq and udp[8:] matches \"^\\\\x02[\\\\x00\\\\xff]+\\\\x03$\" and !(udp[11:2]==00:00) and !(udp[15:4]==00:00:00:00) 说明: udp[15:4]==00:00:00:00 表示QQ号码为空 udp[11:2]==00:00 表示命令编号为00:00 udp[11:2]==00:80 表示命令编号为00:80 当命令编号为00:80时，QQ号码为 00:00:00:00 得到msn登陆成功账号(判断条件是\"USR 7 OK \",即前三个等于USR，再通过两个0x20，就到OK,OK后面是一个字符0x20,后面就是mail了)USR xx OK mail@hotmail.com正确 msnms and tcp and ip.addr==192.168.1.107 and tcp[20:] matches \"^USR\\\\x20[\\\\x30\\\\x39]+\\\\x20OK\\\\x20[\\\\x00\\\\xff]+\" 9.dns模式过滤 10.DHCP 以 寻找伪造DHCP服务器为例，介绍Wireshark的用法。在显 示过滤器中加入过滤规则， 显示所有非来自DHCP服务器并且bootp.type==0x02（Offer/Ack）的信息： bootp.type==0x02 and not ip.src==192.168.1.1 11.msn msnms && tcp[23:1] == 20 // 第四个是0x20的msn数据包 msnms && tcp[20:1] = 41 && tcp[20:1] = 41 && tcp[21:1] = 41 && tcp[22:1] = 41 && tcp[20:1] = 41 && tcp[21:1] = 41 && tcp[22:1] <= 5A 3)第四个为0x20,如:tcp[23:1] == 20 4)msn是属于TCP协议的,如 tcp 12.wireshark字符串过虑语法字符 12.1、wireshark基本的语法字符 \\d 09的数字 \\D \\d的补集（以所以字符为全集，下同），即所有非数字的字符 \\w 单词字符，指大小写字母、09的数字、下划线 \\W \\w的补集 \\s 空白字符，包括换行符"
  },
  {
    "title": "centos7更新yum阿里源",
    "url": "/articles/2020/01/03/1578035132098.html",
    "type": "blog",
    "date": "2020-01-03",
    "topic": "Linux 运维与部署",
    "topicSlug": "linux-ops",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "CentOS",
      "yum",
      "阿里云"
    ],
    "excerpt": "1. 备份原来的yum源 $sudo cp /etc/yum.repos.d/CentOSBase.repo /etc/yum.repos.d/CentOSBase.repo.bak 2.设置aliyun的yum源 $sudo wget O /etc/yum.repos.d/CentOSBase.repo http:/...",
    "guide": "本文归入「Linux 运维与部署」专题，主要记录：1. 备份原来的yum源 $sudo cp /etc/yum.repos.d/CentOSBase.repo /etc/yum.repos.d/CentOSBase.repo.bak 2.设置aliyun的yum源 $sudo wget O /etc/yum.repos.d/CentOSBase.repo http:/...",
    "content": "1. 备份原来的yum源 $sudo cp /etc/yum.repos.d/CentOSBase.repo /etc/yum.repos.d/CentOSBase.repo.bak 2.设置aliyun的yum源 $sudo wget O /etc/yum.repos.d/CentOSBase.repo http://mirrors.aliyun.com/repo/Centos7.repo 3.添加EPEL源 $sudo wget P /etc/yum.repos.d/ http://mirrors.aliyun.com/repo/epel7.repo 4.清理缓存，生成新缓存，执行yum更新 $sudo yum clean all $sudo yum makecache $sudo yum update 1. 备份原来的yum源 2.设置aliyun的yum源 3.添加EPEL源 4.清理缓存，生成新缓存，执行yum更新"
  },
  {
    "title": "mysql空间坐标",
    "url": "/articles/2020/01/03/1578021520851.html",
    "type": "blog",
    "date": "2020-01-03",
    "topic": "MySQL 与数据架构",
    "topicSlug": "mysql-data",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "MySQL",
      "空间坐标",
      "范围查询",
      "gis"
    ],
    "excerpt": "1.常用使用场景 矩形查询： 适合智能手机、网页端高效展示屏幕范围内数据。通过API获取显示屏4角的坐标点，顺序连接生成矩形，空间数据库提供查询矩形范围内坐标功能。 圆型查询： 根据当前所在位置为中心点，根据给定的里程数为半径生成圆形，搜索圆形范围内的数据。 2.MySql支持的类型 点 POINT(15 20) 线 ...",
    "guide": "本文归入「MySQL 与数据架构」专题，主要记录：1.常用使用场景 矩形查询： 适合智能手机、网页端高效展示屏幕范围内数据。通过API获取显示屏4角的坐标点，顺序连接生成矩形，空间数据库提供查询矩形范围内坐标功能。 圆型查询： 根据当前所在位置为中心点，根据给定的里程数为半径生成圆形，搜索圆形范围内的数据。 2.MySql支持的类型 点 POINT(15 20) 线 ...",
    "content": "1.常用使用场景 矩形查询： 适合智能手机、网页端高效展示屏幕范围内数据。通过API获取显示屏4角的坐标点，顺序连接生成矩形，空间数据库提供查询矩形范围内坐标功能。 圆型查询： 根据当前所在位置为中心点，根据给定的里程数为半径生成圆形，搜索圆形范围内的数据。 2.MySql支持的类型 点 POINT(15 20) 线 LINESTRING(0 0, 10 10, 20 25, 50 60) 面 POLYGON((0 0,10 0,10 10,0 10,0 0),(5 5,7 5,7 7,5 7, 5 5)) 多个点 MULTIPOINT(0 0, 20 20, 60 60) 多个线 MULTILINESTRING((10 10, 20 20), (15 15, 30 15)) 多个面 MULTIPOLYGON(((0 0,10 0,10 10,0 10,0 0)),((5 5,7 5,7 7,5 7, 5 5))) 集合 GEOMETRYCOLLECTION(POINT(10 10), POINT(30 30), LINESTRING(15 15, 20 20))，简称GEOMETRY.... 1.常用使用场景 矩形查询： 适合智能手机、网页端高效展示屏幕范围内数据。通过API获取显示屏4角的坐标点，顺序连接生成矩形，空间数据库提供查询矩形范围内坐标功能。 圆型查询： 根据当前所在位置为中心点，根据给定的里程数为半径生成圆形，搜索圆形范围内的数据。 2.MySql支持的类型 点 POINT(15 20) 线 LINESTRING(0 0, 10 10, 20 25, 50 60) 面 POLYGON((0 0,10 0,10 10,0 10,0 0),(5 5,7 5,7 7,5 7, 5 5)) 多个点 MULTIPOINT(0 0, 20 20, 60 60) 多个线 MULTILINESTRING((10 10, 20 20), (15 15, 30 15)) 多个面 MULTIPOLYGON(((0 0,10 0,10 10,0 10,0 0)),((5 5,7 5,7 7,5 7, 5 5))) 集合 GEOMETRYCOLLECTION(POINT(10 10), POINT(30 30), LINESTRING(15 15, 20 20))，简称GEOMETRY，可以放入点、线、面。 3.测试 4.sql 范围查询 sql是基于半正矢公式 a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)的SQL查询语句。 6371是地球的半径，单位：公里。如果想以英里搜索，将6371换成3959即可。 39.915599是搜索点中心纬度（例如想搜索北京天安门附近的标记点，则这里就是北京天安门的纬度） 116.402687是搜索点中心经度（例如想搜索北京天安门附近的标记点，则这里就是北京天安门的经度） distance字段是标记点与搜索点中心的距离，单位：公里（如果地球半径是英里，则这里也是英里） 25是范围，表示搜索出搜索中心点25公里以内的标记点"
  },
  {
    "title": "Centos7时间和java获取时间不一致",
    "url": "/articles/2019/12/24/1577200724607.html",
    "type": "blog",
    "date": "2019-12-24",
    "topic": "Java 与 JVM",
    "topicSlug": "java-jvm",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "CentOS",
      "JVM",
      "json时间转换",
      "Java"
    ],
    "excerpt": "问题描述 遇到一个问题，web显示的时间比服务器时间快12小时。Tomcat和MySQL安装在同一台服务器，系统是centos7，且服务器时间和MySQL时间一致，均是当前北京时间。 解决思路 1、在程序中使用java的函数设定时区。 2、在启动java程序时加参数Duser.timezone=GMT+8 3、修改/e...",
    "guide": "本文归入「Java 与 JVM」专题，主要记录：问题描述 遇到一个问题，web显示的时间比服务器时间快12小时。Tomcat和MySQL安装在同一台服务器，系统是centos7，且服务器时间和MySQL时间一致，均是当前北京时间。 解决思路 1、在程序中使用java的函数设定时区。 2、在启动java程序时加参数Duser.timezone=GMT+8 3、修改/e...",
    "content": "问题描述 遇到一个问题，web显示的时间比服务器时间快12小时。Tomcat和MySQL安装在同一台服务器，系统是centos7，且服务器时间和MySQL时间一致，均是当前北京时间。 解决思路 1、在程序中使用java的函数设定时区。 2、在启动java程序时加参数Duser.timezone=GMT+8 3、修改/etc/sysconfig/clock文件，然后重启服务。&nbsp;（PS：jre是从/etc/sysconfig/clock这个文件中获取时区信息的） 附/etc/sysconfig/clock文件内容： 设置上海时区 ZONE=\"Asia/Shanghai\" UTC=false ARC=false ZONE 时区 UTC 表明时钟设置为UTC。 ARC 仅用于alpha表明使用ARC。 4、修改MySQL连接参数 jdbc:mysql://localhost:3306/test?useUnicode=true&amp;characterEncoding=UTF8&amp;useOldAliasMetadataBehavior.... 问题描述 遇到一个问题，web显示的时间比服务器时间快12小时。Tomcat和MySQL安装在同一台服务器，系统是centos7，且服务器时间和MySQL时间一致，均是当前北京时间。 解决思路 1、在程序中使用java的函数设定时区。 2、在启动java程序时加参数Duser.timezone=GMT+8 3、修改/etc/sysconfig/clock文件，然后重启服务。 （PS：jre是从/etc/sysconfig/clock这个文件中获取时区信息的） 附/etc/sysconfig/clock文件内容： 4、修改MySQL连接参数 自此终于能看到正常的时间了"
  },
  {
    "title": "Centos下git pull免密码操作",
    "url": "/articles/2019/12/20/1576776196766.html",
    "type": "blog",
    "date": "2019-12-20",
    "topic": "Linux 运维与部署",
    "topicSlug": "linux-ops",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "CentOS",
      "git",
      "免密"
    ],
    "excerpt": "1.服务器使用的centos部署的Java项目，使用git pull拉下代码的class文件的时候，经常会提示需要输入帐号和密码。 git config global credential.helper store 2. git pull 一次之后下次就不用密码了",
    "guide": "本文归入「Linux 运维与部署」专题，主要记录：1.服务器使用的centos部署的Java项目，使用git pull拉下代码的class文件的时候，经常会提示需要输入帐号和密码。 git config global credential.helper store 2. git pull 一次之后下次就不用密码了",
    "content": "1.服务器使用的centos部署的Java项目，使用git pull拉下代码的class文件的时候，经常会提示需要输入帐号和密码。 git config global credential.helper store 2. git pull 一次之后下次就不用密码了 1.服务器使用的centos部署的Java项目，使用git pull拉下代码的class文件的时候，经常会提示需要输入帐号和密码。 2. git pull 一次之后下次就不用密码了"
  },
  {
    "title": "centos7安装nginx,jdk,maven(yum方式)",
    "url": "/articles/2019/12/16/1576489975924.html",
    "type": "blog",
    "date": "2019-12-16",
    "topic": "Linux 运维与部署",
    "topicSlug": "linux-ops",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "CentOS",
      "Nginx",
      "yum"
    ],
    "excerpt": "1.添加Nginx 的yum源 rpm Uvh http://nginx.org/packages/centos/7/noarch/RPMS/nginxreleasecentos70.el7.ngx.noarch.rpm 查看源是否添加成功 yum search nginx 2、安装Nginx yum install ...",
    "guide": "本文归入「Linux 运维与部署」专题，主要记录：1.添加Nginx 的yum源 rpm Uvh http://nginx.org/packages/centos/7/noarch/RPMS/nginxreleasecentos70.el7.ngx.noarch.rpm 查看源是否添加成功 yum search nginx 2、安装Nginx yum install ...",
    "content": "1.添加Nginx 的yum源 rpm Uvh http://nginx.org/packages/centos/7/noarch/RPMS/nginxreleasecentos70.el7.ngx.noarch.rpm 查看源是否添加成功 yum search nginx 2、安装Nginx yum install y nginx 3.启动Nginx并设置开机自动运行 systemctl start nginx.service systemctl enable nginx.service 4.路径信息 以下是Nginx的默认路径： (1) Nginx配置路径：/etc/nginx/ (2) PID目录：/var/run/nginx.pid (3) 错误日志：/var/log/nginx/error.log (4) 访问日志：/var/log/nginx/access.log (5) 默认站点目录：/usr/share/nginx/html 事实上，只需知道Nginx配置路径，其他路径均可在/etc/nginx/nginx.conf 以及/etc/nginx/con.... 1.添加Nginx 的yum源 2、安装Nginx 3.启动Nginx并设置开机自动运行 4.路径信息 以下是Nginx的默认路径： (1) Nginx配置路径：/etc/nginx/ (2) PID目录：/var/run/nginx.pid (3) 错误日志：/var/log/nginx/error.log (4) 访问日志：/var/log/nginx/access.log (5) 默认站点目录：/usr/share/nginx/html 事实上，只需知道Nginx配置路径，其他路径均可在/etc/nginx/nginx.conf 以及/etc/nginx/conf.d/default.conf 中查询到。 5.yum安装jdk 6.yum安装maven 下载maven安装包资源： 安装maven： 验证是否安装成功："
  },
  {
    "title": "python3下chromedriver + headless + proxy+场景",
    "url": "/articles/2019/12/14/1576338890909.html",
    "type": "blog",
    "date": "2019-12-14",
    "topic": "Python 爬虫与自动化",
    "topicSlug": "python-crawler",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Python",
      "Python 爬虫",
      "chromedriver"
    ],
    "excerpt": "1.标准头 导入selenium的浏览器驱动接口 from selenium import webdriver 要想调用键盘按键操作需要引入keys包 from selenium.webdriver.common.keys import Keys 导入chrome选项 from selenium.webdriver.c...",
    "guide": "本文归入「Python 爬虫与自动化」专题，主要记录：1.标准头 导入selenium的浏览器驱动接口 from selenium import webdriver 要想调用键盘按键操作需要引入keys包 from selenium.webdriver.common.keys import Keys 导入chrome选项 from selenium.webdriver.c...",
    "content": "1.标准头 导入selenium的浏览器驱动接口 from selenium import webdriver 要想调用键盘按键操作需要引入keys包 from selenium.webdriver.common.keys import Keys 导入chrome选项 from selenium.webdriver.chrome.options import Options chromeOptions.addargument('headless') 浏览器无窗口加载 chromeOptions.addargument('disablegpu') 不开启GPU加速 解决报错: selenium.common.exceptions.WebDriverException: Message: unknown error: Chrome failed to start: exited abnormally (unknown error: DevToolsActivePort file doesn't exist) \"\"\" chromeOptions.addar.... 1.标准头 （1）第一个例子：抓取页面内容，生成页面快照 （2）模拟用户输入和点击搜索 （3）模拟用户登录 （4）使用cookies登录 （5）模拟滚动条的滚动（这个用常规的爬虫很难实现） （6）一边滚动一边加载 （7）代理访问"
  },
  {
    "title": "centos7开启ssh服务",
    "url": "/articles/2019/12/12/1576162628044.html",
    "type": "blog",
    "date": "2019-12-12",
    "topic": "Linux 运维与部署",
    "topicSlug": "linux-ops",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "CentOS",
      "sshd",
      "远程连接"
    ],
    "excerpt": "开启ssh服务需要root权限，先用root账户登陆 先检查有没有安装ssh服务： rpm qa | grep ssh 如果没有安装ssh服务就安装 ： yum install opensshserver 安装好后在ssh配置文件里进行配置 : vim /etc/ssh/sshdconfig 开启ssh服务,这个命令没...",
    "guide": "本文归入「Linux 运维与部署」专题，主要记录：开启ssh服务需要root权限，先用root账户登陆 先检查有没有安装ssh服务： rpm qa | grep ssh 如果没有安装ssh服务就安装 ： yum install opensshserver 安装好后在ssh配置文件里进行配置 : vim /etc/ssh/sshdconfig 开启ssh服务,这个命令没...",
    "content": "开启ssh服务需要root权限，先用root账户登陆 先检查有没有安装ssh服务： rpm qa | grep ssh 如果没有安装ssh服务就安装 ： yum install opensshserver 安装好后在ssh配置文件里进行配置 : vim /etc/ssh/sshdconfig 开启ssh服务,这个命令没有回显 systemctl start sshd.service 开启后用 ps e | grep sshd 检查一下ssh服务是否开启 netstat an | grep 22检查一下22端口是否开启 将ssh服务添加到自启动列表中： systemctl enable sshd.service 开启ssh服务需要root权限，先用root账户登陆 先检查有没有安装ssh服务： 如果没有安装ssh服务就安装 ： 安装好后在ssh配置文件里进行配置 : 开启ssh服务,这个命令没有回显 开启后用 ps e | grep sshd 检查一下ssh服务是否开启 netstat an | grep 22检查一下22端口是否开启 将ssh服务添加到自启动列表中："
  },
  {
    "title": "Springboot2+mybatisplus3.0输出sql日志的两种方式",
    "url": "/articles/2019/12/04/1575449984572.html",
    "type": "blog",
    "date": "2019-12-04",
    "topic": "Spring Boot 与后端框架",
    "topicSlug": "spring-backend",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Spring Boot",
      "MyBatis Plus",
      "sql日志"
    ],
    "excerpt": "1.springboot版本： &lt;parent&gt; &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt; &lt;artifactId&gt;springbootstarterparent&lt;/artifactId&gt; &lt;version&...",
    "guide": "本文归入「Spring Boot 与后端框架」专题，主要记录：1.springboot版本： &lt;parent&gt; &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt; &lt;artifactId&gt;springbootstarterparent&lt;/artifactId&gt; &lt;version&...",
    "content": "1.springboot版本： &lt;parent&gt; &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt; &lt;artifactId&gt;springbootstarterparent&lt;/artifactId&gt; &lt;version&gt;2.0.3.RELEASE&lt;/version&gt; &lt;relativePath/&gt; &lt;! lookup parent from repository &gt; &lt;/parent&gt; 2.mybatisplus版本： &lt;dependency&gt; &lt;groupId&gt;com.baomidou&lt;/groupId&gt; &lt;artifactId&gt;mybatisplusbootstarter&lt;/artifactId&gt; &lt;version&gt;3.0RC1&lt;/version&gt; &lt;/dependency&gt; 3.通过配置文件形式的 m.... 1.springboot版本： 2.mybatisplus版本： 3.通过配置文件形式的 效果如下 效果如下"
  },
  {
    "title": "centos7 安装chromedriver",
    "url": "/articles/2019/11/30/1575091289510.html",
    "type": "blog",
    "date": "2019-11-30",
    "topic": "Python 爬虫与自动化",
    "topicSlug": "python-crawler",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Python 爬虫",
      "Python",
      "CentOS"
    ],
    "excerpt": "1.安装浏览器 指定yum 源 wget O /etc/yum.repos.d/CentOSBase.repo http://mirrors.aliyun.com/repo/Centos7.repo 安装 curl https://intoli.com/installgooglechrome.sh | bash ldd...",
    "guide": "本文归入「Python 爬虫与自动化」专题，主要记录：1.安装浏览器 指定yum 源 wget O /etc/yum.repos.d/CentOSBase.repo http://mirrors.aliyun.com/repo/Centos7.repo 安装 curl https://intoli.com/installgooglechrome.sh | bash ldd...",
    "content": "1.安装浏览器 指定yum 源 wget O /etc/yum.repos.d/CentOSBase.repo http://mirrors.aliyun.com/repo/Centos7.repo 安装 curl https://intoli.com/installgooglechrome.sh | bash ldd /opt/google/chrome/chrome | grep \"not found\" 安装后，执行： googlechromestable nosandbox headless disablegpu screenshot https://www.baidu.com/ 成功之后会生成一个图片 查看 版本 很重要 googlechrome version Google Chrome 78.0.3904.108 所以下载我们也只能下载对应的版本 2. 安装chromedriver 下载：https://npm.taobao.org/mirrors/chromedriver/ 索引 挑选自己系统匹配的 wget https:.... 1.安装浏览器 指定yum 源 wget O /etc/yum.repos.d/CentOSBase.repo http://mirrors.aliyun.com/repo/Centos7.repo 安装 安装后，执行： 成功之后会生成一个图片 查看 版本 很重要 2. 安装chromedriver 下载：https://npm.taobao.org/mirrors/chromedriver/ 索引 挑选自己系统匹配的 unzip 解压 如果出现了 Cannot assign requested address (99) 安装完成 建立软连接： ln s /root/data/soft/chromedriver /usr/bin/chromedriver 3. 测试代码"
  },
  {
    "title": "Centos7安装Python3.7",
    "url": "/articles/2019/11/30/1575088937927.html",
    "type": "blog",
    "date": "2019-11-30",
    "topic": "Linux 运维与部署",
    "topicSlug": "linux-ops",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Python",
      "CentOS"
    ],
    "excerpt": "1.安装编译相关工具 yum y groupinstall \"Development tools\" yum y install zlibdevel bzip2devel openssldevel ncursesdevel sqlitedevel readlinedevel tkdevel gdbmdevel db4de...",
    "guide": "本文归入「Linux 运维与部署」专题，主要记录：1.安装编译相关工具 yum y groupinstall \"Development tools\" yum y install zlibdevel bzip2devel openssldevel ncursesdevel sqlitedevel readlinedevel tkdevel gdbmdevel db4de...",
    "content": "1.安装编译相关工具 yum y groupinstall \"Development tools\" yum y install zlibdevel bzip2devel openssldevel ncursesdevel sqlitedevel readlinedevel tkdevel gdbmdevel db4devel libpcapdevel xzdevel yum install libffidevel y 2.下载安装包解压 cd 回到用户目录 wget https://www.python.org/ftp/python/3.7.0/Python3.7.0.tar.xz tar xvJf Python3.7.0.tar.xz 3.编译安装 mkdir /usr/local/python3 创建编译安装目录 cd Python3.7.0 ./configure prefix=/usr/local/python3 make &amp;&amp; make install 4.创建软连接 ln s /usr/local/pyt.... 1.安装编译相关工具 2.下载安装包解压 3.编译安装 4.创建软连接 5.验证是否成功 现在就可以愉快的玩耍了"
  },
  {
    "title": "centos7下安装redis",
    "url": "/articles/2019/11/23/1574501821804.html",
    "type": "blog",
    "date": "2019-11-23",
    "topic": "Linux 运维与部署",
    "topicSlug": "linux-ops",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Redis",
      "CentOS",
      "linux服务配置安装"
    ],
    "excerpt": "一、安装redis 第一步：下载redis安装包 wget http://download.redis.io/releases/redis4.0.6.tar.gz 第二步：解压压缩包 tar zxvf&nbsp;redis4.0.6.tar.gz 第三步：yum安装gcc依赖 yum install gcc 第四步：跳...",
    "guide": "本文归入「Linux 运维与部署」专题，主要记录：一、安装redis 第一步：下载redis安装包 wget http://download.redis.io/releases/redis4.0.6.tar.gz 第二步：解压压缩包 tar zxvf&nbsp;redis4.0.6.tar.gz 第三步：yum安装gcc依赖 yum install gcc 第四步：跳...",
    "content": "一、安装redis 第一步：下载redis安装包 wget http://download.redis.io/releases/redis4.0.6.tar.gz 第二步：解压压缩包 tar zxvf&nbsp;redis4.0.6.tar.gz 第三步：yum安装gcc依赖 yum install gcc 第四步：跳转到redis解压目录下 and 编译安装 cd redis4.0.6 make MALLOC=libc cd src &amp;&amp; make install 二、启动redis的三种方式 先切换到redis src目录下 cd src 1、直接启动redis ./redisserver redis启动成功，但是这种启动方式需要一直打开窗口，不能进行其他操作，不太方便。 按 ctrl + c可以关闭窗口。 2、以后台进程方式启动redis 第一步：修改redis.conf文件 将 daemonize no 修改为 daemonize yes 第二步：指定redis.conf文件启动 ./redisserver /usr/local/r.... 一、安装redis 第一步：下载redis安装包 第二步：解压压缩包 第三步：yum安装gcc依赖 第四步：跳转到redis解压目录下 and 编译安装 二、启动redis的三种方式 先切换到redis src目录下 1、直接启动redis redis启动成功，但是这种启动方式需要一直打开窗口，不能进行其他操作，不太方便。 按 ctrl + c可以关闭窗口。 2、以后台进程方式启动redis 第一步：修改redis.conf文件 将 修改为 第二步：指定redis.conf文件启动 第三步：关闭redis进程 首先使用ps aux | grep redis查看redis进程 3、设置redis开机自启动 1、在/etc目录下新建redis目录 2、将/usr/local/redis4.0.6/redis.conf 文件复制一份到/etc/redis目录下，并命名为6379.conf 该文件会作为开机启动的配置文件，修改配置的时候需要修改该文件 3、将redis的启动脚本复制一份放到/etc/init.d目录下 /etc/init.d/redisd 文件才是真正启动文件 4、设置redis开机自启动 先切换到/etc/init.d目录下 然后执行自启命令 看结果是redisd不支持chkconfig 解决方法： 使用vim编辑redisd文件，在第一行加入如下两行注释，保存退出 注释的意思是，redis服务必须在运行级2，3，4，5下被启动或关闭，启动的优先级是90，关闭的优先级是10。 再次执行开机自启命令，成功 现在可以直接已服务的形式启动和关闭redis了 5、设置redis支持远程访问 (1).开启阿里云 安全组配置，将端口暴漏出去。 (2).将redis.conf 里的redis.conf bind127.0.0.1 这一行注释掉，任意IP都可以访问； 找到 protectedmode yes 改为 protectedmode no；保存之后重启redis 6、命令行客户端执行"
  },
  {
    "title": "java触发gc的条件和时机",
    "url": "/articles/2019/11/22/1574389113537.html",
    "type": "blog",
    "date": "2019-11-22",
    "topic": "Java 与 JVM",
    "topicSlug": "java-jvm",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "JVM",
      "Java",
      "垃圾回收算法"
    ],
    "excerpt": "1.什么时候触发GC &nbsp; &nbsp; &nbsp; &nbsp;(1)程序调用System.gc时可以触发，也不是立即触发，只是发了个通知要触发，时机由jvm自己把握 &nbsp; &nbsp; &nbsp; &nbsp;(2)系统自身来决定GC触发的时机（根据Eden区和From&nbsp;Space区的...",
    "guide": "本文归入「Java 与 JVM」专题，主要记录：1.什么时候触发GC &nbsp; &nbsp; &nbsp; &nbsp;(1)程序调用System.gc时可以触发，也不是立即触发，只是发了个通知要触发，时机由jvm自己把握 &nbsp; &nbsp; &nbsp; &nbsp;(2)系统自身来决定GC触发的时机（根据Eden区和From&nbsp;Space区的...",
    "content": "1.什么时候触发GC &nbsp; &nbsp; &nbsp; &nbsp;(1)程序调用System.gc时可以触发，也不是立即触发，只是发了个通知要触发，时机由jvm自己把握 &nbsp; &nbsp; &nbsp; &nbsp;(2)系统自身来决定GC触发的时机（根据Eden区和From&nbsp;Space区的内存大小来决定。当内存大小不足时，则会启动GC线程并停止应用线程） &nbsp; &nbsp; &nbsp; GC又分为 minor GC 和 Full GC (也称为 Major GC ) &nbsp; &nbsp; &nbsp; Minor GC触发条件：当Eden区满时，触发Minor GC。 &nbsp; &nbsp; &nbsp; Full GC触发条件： &nbsp;&nbsp;a.调用System.gc时，系统建议执行Full GC，但是不必然执行 &nbsp;&nbsp;b.老年代空间不足 &nbsp;&nbsp;c.方法区空间不足 &nbsp;&nbsp;d.通过Minor GC后进入老年代的平均大小大于老年代的可用内存 &nbsp;&nbsp;e.由E.... 1.什么时候触发GC (1)程序调用System.gc时可以触发，也不是立即触发，只是发了个通知要触发，时机由jvm自己把握 (2)系统自身来决定GC触发的时机（根据Eden区和From Space区的内存大小来决定。当内存大小不足时，则会启动GC线程并停止应用线程） GC又分为 minor GC 和 Full GC (也称为 Major GC ) Minor GC触发条件：当Eden区满时，触发Minor GC。 Full GC触发条件： a.调用System.gc时，系统建议执行Full GC，但是不必然执行 b.老年代空间不足 c.方法区空间不足 d.通过Minor GC后进入老年代的平均大小大于老年代的可用内存 e.由Eden区、From Space区向To Space区复制时，对象大小大于To Space可用内存，则把该对象转存到老年代，且老年代的可用内存小于该对象大小 Minor GC： 新生代GC，指发生在新生代的垃圾收集动作，因为Java对象大多都具备朝生熄灭的特点，所以Minor GC十分频繁，回收速度也较快。 Major GC： 老年代GC，指发生在老年代的垃圾收集动作，当出现Major GC时，一般也会伴有至少一次的Minor GC（并非绝对，例如Parallel Scavenge收集器会单独直接触发Major GC的机制）。Major GC的速度一般会比Minor GC慢十倍以上。 对象优先在Eden区分配: HotSpot JVM把年轻代分为了三部分：1个Eden区和2个Survivor区（分别叫from和to）。默认比例为8：1。大多数情况下，对象优先在Eden区中分配。当Eden区中没有足够空间进行分配时，将会触发一次Minor GC。 大对象直接进入老年代： 所谓的大对象是指，需要大量连续内存空间的Java对象。例如：很长的字符串或者数组。虚拟机提供了一个XX：PretenureSizeThreshold参数。令大于这个XX：PretenureSizeThreshold设置值的对象，直接在老年代分配。 长期存活的对象将进入老年代： 虚拟机为了分代收集，对每一个对象定义了一个对象年龄计数器（Age）。如果对象在Eden出生，并且经过一次Minor GC后，仍然存活并且能被Survivor区中每熬过一次Minor GC，年龄就会增加1岁。当年龄增加到默认的15岁时，就会晋升到老年代。 晋升为老年代的阙值通过参数XX：MaxTenuringThreshold设置。 Full GC的情况： （1）调用Sytem.GC() （2）老年代空间不足时 （3）GC担保失败： 在发生Minor GC之前，JVM会检查老年代最大可用的连续空间是否大于新生代所有对象总空间。如果条件成立，那么Minor GC是安全的。反之，如果不成立，那么要仍然要看HandlePromotionFailure值，是否允许担保失败。如果允许担保失败，那么会继续检查老年代最大可用的连续空间是否大于历次晋升到老年代对象的平均大小。如果大于，则冒险尝试一次Minor GC，如果小于或者不允许担保失败，则要进行一次Full GC。 2.GC做了什么事 主要做了清理对象，整理内存的工作。Java堆分为新生代和老年代，采用了不同的回收方式。"
  },
  {
    "title": "查看Linux占用内存/CPU最多的进程",
    "url": "/articles/2019/11/20/1574261012104.html",
    "type": "blog",
    "date": "2019-11-20",
    "topic": "Linux 运维与部署",
    "topicSlug": "linux-ops",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "调优",
      "Linux"
    ],
    "excerpt": "1.可以使用以下命令查使用内存最多的10个进程 &nbsp; &nbsp;&nbsp; ps aux | sort k4nr | head n 10 2.可以使用一下命令查使用CPU最多的10个进程 &nbsp; &nbsp;&nbsp; ps aux | sort k3nr | head n 10 3. 那么多进程中...",
    "guide": "本文归入「Linux 运维与部署」专题，主要记录：1.可以使用以下命令查使用内存最多的10个进程 &nbsp; &nbsp;&nbsp; ps aux | sort k4nr | head n 10 2.可以使用一下命令查使用CPU最多的10个进程 &nbsp; &nbsp;&nbsp; ps aux | sort k3nr | head n 10 3. 那么多进程中...",
    "content": "1.可以使用以下命令查使用内存最多的10个进程 &nbsp; &nbsp;&nbsp; ps aux | sort k4nr | head n 10 2.可以使用一下命令查使用CPU最多的10个进程 &nbsp; &nbsp;&nbsp; ps aux | sort k3nr | head n 10 3. 那么多进程中如何查看一个进程的情况 ps aux | grep xx 找到进程号 top p pid 4. top显示不全 bw设置宽度 top c&nbsp;&nbsp;bw 500 5. 批量杀掉共类进程 kill 9 ps ef |grep java|grep v grep|awk '{print $2}' 1.可以使用以下命令查使用内存最多的10个进程 ps aux | sort k4nr | head n 10 2.可以使用一下命令查使用CPU最多的10个进程 ps aux | sort k3nr | head n 10 3. 那么多进程中如何查看一个进程的情况 4. top显示不全 bw设置宽度 top c bw 500 5. 批量杀掉共类进程"
  },
  {
    "title": "idea永久激活使用（2020/01/06更新亲测可用，采用探针修改)",
    "url": "/articles/2019/11/20/1574259720908.html",
    "type": "blog",
    "date": "2019-11-20",
    "topic": "Java 与 JVM",
    "topicSlug": "java-jvm",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Java",
      "ieda破解"
    ],
    "excerpt": "1.下载补丁 链接：https://pan.baidu.com/s/1oYtDSei3R93S6sDRR1WiyQ 提取码：h2na 下载解压到idea的bin目录 2.修改IDEA的bin目录中的配置文件 修改 俩文件的探针位置 idea.exe.vmoptions idea64.exe.vmoptions 为自己本...",
    "guide": "本文归入「Java 与 JVM」专题，主要记录：1.下载补丁 链接：https://pan.baidu.com/s/1oYtDSei3R93S6sDRR1WiyQ 提取码：h2na 下载解压到idea的bin目录 2.修改IDEA的bin目录中的配置文件 修改 俩文件的探针位置 idea.exe.vmoptions idea64.exe.vmoptions 为自己本...",
    "content": "1.下载补丁 链接：https://pan.baidu.com/s/1oYtDSei3R93S6sDRR1WiyQ 提取码：h2na 下载解压到idea的bin目录 2.修改IDEA的bin目录中的配置文件 修改 俩文件的探针位置 idea.exe.vmoptions idea64.exe.vmoptions 为自己本机的正确位置 我的位置是这个 javaagent:D:\\java\\IntelliJIDEA20182\\bin\\ideaCrackreleaseenc.jar 3.打开IDEA,在activecode中输入如下 KNBB2QUUR1eyJsaWNlbnNlSWQiOiJLTkJCMlFVVVIxIiwibGljZW5zZWVOYW1lIjoiZ2hib2tlIiwiYXNzaWduZWVOYW1lIjoiIiwiYXNzaWduZWVFbWFpbCI6IiIsImxpY2Vuc2VSZXN0cmljdGlvbiI6IiIsImNoZWNrQ29uY3VycmVudFVzZSI6ZmFsc2UsInByb2R1Y3RzIjpbeyJjb2RlIjoiSUkiLCJ.... 1.下载补丁 链接：https://pan.baidu.com/s/1oYtDSei3R93S6sDRR1WiyQ 提取码：h2na 下载解压到idea的bin目录 2.修改IDEA的bin目录中的配置文件 修改 俩文件的探针位置 idea.exe.vmoptions idea64.exe.vmoptions 为自己本机的正确位置 3.打开IDEA,在activecode中输入如下 完事，下次就不会在提示注册了。 4.如果还是不行，最近idea大量注册码失效 http://www.98key.com/idea"
  },
  {
    "title": "javap分析java汇编指令",
    "url": "/articles/2019/11/20/1574217206931.html",
    "type": "blog",
    "date": "2019-11-20",
    "topic": "Java 与 JVM",
    "topicSlug": "java-jvm",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "javap",
      "汇编",
      "JVM"
    ],
    "excerpt": "一、javap命令简述 javap是jdk自带的反解析工具。它的作用就是根据class字节码文件，反解析出当前类对应的code区（汇编指令）、本地变量表、异常表和代码行偏移量映射表、常量池等等信息。 当然这些信息中，有些信息（如本地变量表、指令和代码行偏移量映射表、常量池中方法的参数名称等等）需要在使用javac编译成...",
    "guide": "本文归入「Java 与 JVM」专题，主要记录：一、javap命令简述 javap是jdk自带的反解析工具。它的作用就是根据class字节码文件，反解析出当前类对应的code区（汇编指令）、本地变量表、异常表和代码行偏移量映射表、常量池等等信息。 当然这些信息中，有些信息（如本地变量表、指令和代码行偏移量映射表、常量池中方法的参数名称等等）需要在使用javac编译成...",
    "content": "一、javap命令简述 javap是jdk自带的反解析工具。它的作用就是根据class字节码文件，反解析出当前类对应的code区（汇编指令）、本地变量表、异常表和代码行偏移量映射表、常量池等等信息。 当然这些信息中，有些信息（如本地变量表、指令和代码行偏移量映射表、常量池中方法的参数名称等等）需要在使用javac编译成class文件时，指定参数才能输出，比如，你直接javac xx.java，就不会在生成对应的局部变量表等信息，如果你使用javac g xx.java就可以生成所有相关信息了。如果你使用的eclipse，则默认情况下，eclipse在编译时会帮你生成局部变量表、指令和代码行偏移量映射表等信息的。 通过反编译生成的汇编代码，我们可以深入的了解java代码的工作机制。比如我们可以查看i++；这行代码实际运行时是先获取变量i的值，然后将这个值加1，最后再将加1后的值赋值给变量i。 通过局部变量表，我们可以查看局部变量的作用域范围、所在槽位等信息，甚至可以看到槽位复用等信息。 javap的用法格式： javap &lt;options&gt; &lt;classes&gt; .... 一、javap命令简述 javap是jdk自带的反解析工具。它的作用就是根据class字节码文件，反解析出当前类对应的code区（汇编指令）、本地变量表、异常表和代码行偏移量映射表、常量池等等信息。 当然这些信息中，有些信息（如本地变量表、指令和代码行偏移量映射表、常量池中方法的参数名称等等）需要在使用javac编译成class文件时，指定参数才能输出，比如，你直接javac xx.java，就不会在生成对应的局部变量表等信息，如果你使用javac g xx.java就可以生成所有相关信息了。如果你使用的eclipse，则默认情况下，eclipse在编译时会帮你生成局部变量表、指令和代码行偏移量映射表等信息的。 通过反编译生成的汇编代码，我们可以深入的了解java代码的工作机制。比如我们可以查看i++；这行代码实际运行时是先获取变量i的值，然后将这个值加1，最后再将加1后的值赋值给变量i。 通过局部变量表，我们可以查看局部变量的作用域范围、所在槽位等信息，甚至可以看到槽位复用等信息。 javap的用法格式： javap 其中classes就是你要反编译的class文件。 在命令行中直接输入javap或javap help可以看到javap的options有如下选项： 一般常用的是v l c三个选项。 javap v classxx，不仅会输出行号、本地变量表信息、反编译汇编代码，还会输出当前类用到的常量池等信息。 javap l 会输出行号和本地变量表信息。 javap c 会对当前class字节码进行反编译生成汇编代码。 二、javap测试及内容详解 前面已经介绍过javap输出的内容有哪些，东西比较多，这里主要介绍其中code区(汇编指令)、局部变量表和代码行偏移映射三个部分。 如果需要分析更多的信息，可以使用javap v进行查看。 另外，为了更方便理解，所有汇编指令不单拎出来讲解，而是在反汇编代码中以注释的方式讲解 上面代码通过javac g 生成class文件，然后通过javap命令对字节码进行反汇编： 得到下面内容 例子2：下面一个例子 先有一个User类： 然后写一个操作User对象的测试类： 先javac g 编译成class文件。 然后对TestUser类进行反汇编： 得到反汇编结果如下： 三、总结 1、通过javap命令可以查看一个java类反汇编、常量池、变量表、指令代码行号表等等信息。 2、平常，我们比较关注的是java类中每个方法的反汇编中的指令操作过程，这些指令都是顺序执行的，可以参考官方文档查看每个指令的含义，很简单： https://docs.oracle.com/javase/specs/jvms/se7/html/jvms6.htmljvms6.5.areturn 3、通过对前面两个例子代码反汇编中各个指令操作的分析，可以发现，一个方法的执行通常会涉及下面几块内存的操作： （1）java栈中：局部变量表、操作数栈。这些操作基本上都值操作。 （2）java堆。通过对象的地址引用去操作。 （3）常量池。 （4）其他如帧数据区、方法区（jdk1.8之前，常量池也在方法区）等部分，测试中没有显示出来，这里说明一下。 在做值相关操作时： 一个指令，可以从局部变量表、常量池、堆中对象、方法调用、系统调用中等取得数据，这些数据（可能是指，可能是对象的引用）被压入操作数栈。 一个指令，也可以从操作数数栈中取出一到多个值（pop多次），完成赋值、加减乘除、方法传参、系统调用等等操作。 转载:https://www.jianshu.com/p/6a8997560b05"
  },
  {
    "title": "java对象不再使用时，为什么要赋值为 null",
    "url": "/articles/2019/11/19/1574146757419.html",
    "type": "blog",
    "date": "2019-11-19",
    "topic": "Java 与 JVM",
    "topicSlug": "java-jvm",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "JVM",
      "Java",
      "垃圾回收算法"
    ],
    "excerpt": "1.示例代码 我们来看看一段非常简单的代码： jvm配置参数： verbose:gc XX:+PrintGC public static void main(String[] args) { if (true) { byte[] placeHolder = new byte[64 1024 1024]; System....",
    "guide": "本文归入「Java 与 JVM」专题，主要记录：1.示例代码 我们来看看一段非常简单的代码： jvm配置参数： verbose:gc XX:+PrintGC public static void main(String[] args) { if (true) { byte[] placeHolder = new byte[64 1024 1024]; System....",
    "content": "1.示例代码 我们来看看一段非常简单的代码： jvm配置参数： verbose:gc XX:+PrintGC public static void main(String[] args) { if (true) { byte[] placeHolder = new byte[64 1024 1024]; System.out.println(placeHolder.length / 1024); } System.gc(); } 我们在if中实例化了一个数组placeHolder，然后在if的作用域外通过System.gc();手动触发了GC，其用意是回收placeHolder，因为placeHolder已经无法访问到了。来看看输出： 65536 [GC (System.gc()) 73404K&gt;67241K(251392K), 0.0013637 secs] [Full GC (System.gc()) 67241K&gt;67073K(251392K), 0.0064233 secs] 本次GC后，内存占用从67241K降到了67073K。意思其实是说G.... 1.示例代码 我们来看看一段非常简单的代码： jvm配置参数： 我们在if中实例化了一个数组placeHolder，然后在if的作用域外通过System.gc();手动触发了GC，其用意是回收placeHolder，因为placeHolder已经无法访问到了。来看看输出： 本次GC后，内存占用从67241K降到了67073K。意思其实是说GC没有将placeHolder回收掉 ，如果把不使用的对象 置为null之后。如下 输出结果： 这次GC后内存占用下降到了1537K，即placeHolder被成功回收了！ 对比两段代码，仅仅将placeHolder赋值为null就解决了GC的问题。神奇啊。确实。 为什么呢？ 运行时栈（局部变量表） 典型的运行时栈： 如果你了解过编译原理，或者程序执行的底层机制，你会知道方法在执行的时候，方法里的变量（局部变量）都是分配在栈上的；当然，对于Java来说，new出来的对象是在堆中，但栈中也会有这个对象的指针，和int一样。 比如对于下面这段代码 其运行时栈的状态可以理解成： | 索引（slot） | 变量 | | | | | 1 | a | | 2 | b | | 3 | c | “索引”表示变量在栈中的序号，根据方法内代码执行的先后顺序，变量被按顺序放在栈中。 再比如： 这时运行时栈就是： | 索引（slot） | 变量 | | | | | 1 | a | | 2 | b | | 3 | c | | 4 | d | 其实仔细想想上面这个例子的运行时栈是有优化空间的。 Java的栈优化 上面的例子，main()方法运行时占用了4个栈索引空间，但实际上不需要占用这么多。当if执行完后，变量a、b和c都不可能再访问到了，所以它们占用的1～3的栈索引是可以“回收”掉的，比如像这样： | 索引 （slot）| 变量 | | | | | 1 | a | | 2 | b | | 3 | c | | 1（3之前的被回收掉了） | d | 变量d重用了变量a的栈索引，这样就节约了内存空间。 提醒： 上面的“运行时栈”和“索引”是为方便引入而故意发明的词，实际上在JVM中，它们的名字分别叫做“局部变量表”和“Slot”。而且局部变量表在编译时即已确定，不需要等到“运行时”。 GC如何做的内存回收 如何确定对象可以被回收？ 如何确定对象是存活的？ 可达性分析算法：栈中引用的对象。也就是说，只要堆中的这个对象，在栈中还存在引用，就会被认定是存活的。 JVM的“bug” 我们再来回头看看最开始的例子： javac g NullSample.java javap c l NullSample.class LocalVariableTable: Start Length Slot Name Signature 5 14 1 placeHolder [B 0 23 0 args [Ljava/lang/String; public class NullSample { public static void main(String[] args) { if (true) { byte[] placeHolder = new byte[64 1024 1024]; System.out.println(placeHolder.length / 1024); } int replacer = 1; System.gc(); } } 看看其运行时栈： 不出所料，replacer重用了placeHolder的索引。来看看GC情况： placeHolder被成功回收了！我们的推断也被验证了。 再从运行时栈来看，加上int replacer = 1;和将placeHolder赋值为null起到了同样的作用：断开堆中placeHolder和栈的联系，让GC判断placeHolder已经死亡。 现在算是理清了“不使用的对象应手动赋值为null“的原理了，一切根源都是来自于JVM的一个“bug”：代码离开变量作用域时，并不会自动切断其与堆的联系。为什么这个“bug”一直存在？你不觉得出现这种情况的概率太小了么？算是一个tradeoff了。"
  },
  {
    "title": "python3线程池/进程池应用ThreadPoolExecutor",
    "url": "/articles/2019/11/19/1574134321234.html",
    "type": "blog",
    "date": "2019-11-19",
    "topic": "Linux 运维与部署",
    "topicSlug": "linux-ops",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "线程",
      "Python",
      "Python 爬虫",
      "高并发"
    ],
    "excerpt": "多种方法实现 python 线程池 一、 既然多线程可以缩短程序运行时间，那么，是不是线程数量越多越好呢？ 显然，并不是，每一个线程的从生成到消亡也是需要时间和资源的，太多的线程会占用过多的系统资源（内存开销，cpu开销），而且生成太多的线程时间也是可观的，很可能会得不偿失，这里给出一个最佳线程数量的计算方式： 最佳线...",
    "guide": "本文归入「Linux 运维与部署」专题，主要记录：多种方法实现 python 线程池 一、 既然多线程可以缩短程序运行时间，那么，是不是线程数量越多越好呢？ 显然，并不是，每一个线程的从生成到消亡也是需要时间和资源的，太多的线程会占用过多的系统资源（内存开销，cpu开销），而且生成太多的线程时间也是可观的，很可能会得不偿失，这里给出一个最佳线程数量的计算方式： 最佳线...",
    "content": "多种方法实现 python 线程池 一、 既然多线程可以缩短程序运行时间，那么，是不是线程数量越多越好呢？ 显然，并不是，每一个线程的从生成到消亡也是需要时间和资源的，太多的线程会占用过多的系统资源（内存开销，cpu开销），而且生成太多的线程时间也是可观的，很可能会得不偿失，这里给出一个最佳线程数量的计算方式： 最佳线程数的获取： 1、通过用户慢慢递增来进行性能压测，观察QPS（即每秒的响应请求数，也即是最大吞吐能力。），响应时间 2、根据公式计算:服务器端最佳线程数量=((线程等待时间+线程cpu时间)/线程cpu时间) cpu数量 3、单用户压测，查看CPU的消耗，然后直接乘以百分比，再进行压测，一般这个值的附近应该就是最佳线程数量。 二、如何实现线程池？ 1、使用threadpool模块，这是个python的第三方模块，支持python2和python3 ! /usr/bin/env python coding: utf8 import threadpool import time def sayhello (a): print(\"hello: \"+a.... 多种方法实现 python 线程池 一、 既然多线程可以缩短程序运行时间，那么，是不是线程数量越多越好呢？ 显然，并不是，每一个线程的从生成到消亡也是需要时间和资源的，太多的线程会占用过多的系统资源（内存开销，cpu开销），而且生成太多的线程时间也是可观的，很可能会得不偿失，这里给出一个最佳线程数量的计算方式： 最佳线程数的获取： 1、通过用户慢慢递增来进行性能压测，观察QPS（即每秒的响应请求数，也即是最大吞吐能力。），响应时间 2、根据公式计算:服务器端最佳线程数量=((线程等待时间+线程cpu时间)/线程cpu时间) cpu数量 3、单用户压测，查看CPU的消耗，然后直接乘以百分比，再进行压测，一般这个值的附近应该就是最佳线程数量。 二、如何实现线程池？ 1、使用threadpool模块，这是个python的第三方模块，支持python2和python3 threadpool是一个比较老的模块了，现在虽然还有一些人在用，但已经不再是主流了，关于python多线程，现在已经开始步入未来（future模块）了 2、未来：使用concurrent.futures模块，这个模块是python3中自带的模块 测试代码"
  },
  {
    "title": "Ubuntu16.04中PHP7.2 安装pdo_mysql扩展",
    "url": "/articles/2019/11/14/1573728964758.html",
    "type": "blog",
    "date": "2019-11-14",
    "topic": "MySQL 与数据架构",
    "topicSlug": "mysql-data",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "php"
    ],
    "excerpt": "1.查看php版本 php v 当前7.2版本 2.查看是否安装mysql扩展 两种方式 php m php r 'phpinfo();' 查看加载顺序 grep Hrv \";\" /etc/php | grep E \"extension(\\s+)?=\" 3. 安装mysql扩展 sudo apt install php...",
    "guide": "本文归入「MySQL 与数据架构」专题，主要记录：1.查看php版本 php v 当前7.2版本 2.查看是否安装mysql扩展 两种方式 php m php r 'phpinfo();' 查看加载顺序 grep Hrv \";\" /etc/php | grep E \"extension(\\s+)?=\" 3. 安装mysql扩展 sudo apt install php...",
    "content": "1.查看php版本 php v 当前7.2版本 2.查看是否安装mysql扩展 两种方式 php m php r 'phpinfo();' 查看加载顺序 grep Hrv \";\" /etc/php | grep E \"extension(\\s+)?=\" 3. 安装mysql扩展 sudo apt install php7.2mysql 4. 修改配置文件 cd /etc/php/7.2/cli //进入配置文件目录 sudo vim php.ini //vim打开配置文件 //可能会输入root用户密码 /pdo //查找，输入后按enter键即可 //按i键进入vim编辑模式 extension=phppdomysql.dll //去掉extensions前面的;号 //按shift + : 号，然后输入wq 1.查看php版本 2.查看是否安装mysql扩展 两种方式 3. 安装mysql扩展 4. 修改配置文件"
  },
  {
    "title": "mysql允许远程连接",
    "url": "/articles/2019/11/13/1573657642163.html",
    "type": "blog",
    "date": "2019-11-13",
    "topic": "MySQL 与数据架构",
    "topicSlug": "mysql-data",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "MySQL"
    ],
    "excerpt": "1.本地登陆 赋权 GRANT ALL PRIVILEGES ON . TO 'root'@'%' IDENTIFIED BY '密码' WITH GRANT OPTION; &nbsp;FLUSH PRIVILEGES; 2. 修改本地绑定端口 /etc/mysql/mysql.cnf 查找bind 127.0.0....",
    "guide": "本文归入「MySQL 与数据架构」专题，主要记录：1.本地登陆 赋权 GRANT ALL PRIVILEGES ON . TO 'root'@'%' IDENTIFIED BY '密码' WITH GRANT OPTION; &nbsp;FLUSH PRIVILEGES; 2. 修改本地绑定端口 /etc/mysql/mysql.cnf 查找bind 127.0.0....",
    "content": "1.本地登陆 赋权 GRANT ALL PRIVILEGES ON . TO 'root'@'%' IDENTIFIED BY '密码' WITH GRANT OPTION; &nbsp;FLUSH PRIVILEGES; 2. 修改本地绑定端口 /etc/mysql/mysql.cnf 查找bind 127.0.0.1 注释掉即可 1.本地登陆 赋权 2. 修改本地绑定端口"
  },
  {
    "title": "阿里云Ubuntu16.04安装Java8_redis",
    "url": "/articles/2019/11/11/1573460631525.html",
    "type": "blog",
    "date": "2019-11-11",
    "topic": "Linux 运维与部署",
    "topicSlug": "linux-ops",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Java"
    ],
    "excerpt": "一、java8安装 1 Java 8 下载地址 链接：https://pan.baidu.com/s/1NN4XBL5g1Xn7EwzM4YET0g 提取码：m4mq 2 以root用户登录将下载的jdk8u92linuxx64.tar.gz文件放到/data/soft/目录下，使用如下命令解压 tar zxvf jd...",
    "guide": "本文归入「Linux 运维与部署」专题，主要记录：一、java8安装 1 Java 8 下载地址 链接：https://pan.baidu.com/s/1NN4XBL5g1Xn7EwzM4YET0g 提取码：m4mq 2 以root用户登录将下载的jdk8u92linuxx64.tar.gz文件放到/data/soft/目录下，使用如下命令解压 tar zxvf jd...",
    "content": "一、java8安装 1 Java 8 下载地址 链接：https://pan.baidu.com/s/1NN4XBL5g1Xn7EwzM4YET0g 提取码：m4mq 2 以root用户登录将下载的jdk8u92linuxx64.tar.gz文件放到/data/soft/目录下，使用如下命令解压 tar zxvf jdk8u92linuxx64.tar.gz C /data/soft 3 将java目录添加到etc/profile文件中 export JAVAHOME=/root/data/jdk1.8 export JREHOME=${JAVAHOME}/jre export CLASSPATH=.:${JAVAHOME}/lib:${JREHOME}/lib export PATH=${JAVAHOME}/bin:$PATH 4 验证java java version 二、redis安装 安装Redis服务器端 sudo aptget install redisserver 安装完成后，Redis服务器会自动启动，我们检查Redis服务.... 一、java8安装 1 Java 8 下载地址 链接：https://pan.baidu.com/s/1NN4XBL5g1Xn7EwzM4YET0g 提取码：m4mq 2 以root用户登录将下载的jdk8u92linuxx64.tar.gz文件放到/data/soft/目录下，使用如下命令解压 3 将java目录添加到etc/profile文件中 4 验证java 二、redis安装 安装Redis服务器端 安装完成后，Redis服务器会自动启动，我们检查Redis服务器程序 检查Redis服务器系统进程 通过启动命令检查Redis服务器状态 通过启动命令检查Redis服务器状态 通过命令行客户端访问Redis 安装Redis服务器，会自动地一起安装Redis命令行客户端程序。 在本机输入rediscli命令就可以启动，客户端程序访问Redis服务器。 修改Redis的配置 使用Redis的访问账号 默认情况下，访问Redis服务器是不需要密码的，为了增加安全性我们需要设置Redis服务器的访问密码。设置访问密码为redisredis。 用vi打开Redis服务器的配置文件redis.conf 让Redis服务器被远程访问 默认情况下，Redis服务器不允许远程访问，只允许本机访问，所以我们需要设置打开远程访问的功能。 用vi打开Redis服务器的配置文件redis.conf 修改后，重启Redis服务器。 我们在远程的另一台Linux访问Redis服务器"
  },
  {
    "title": "mybatis,mysql的时区问题",
    "url": "/articles/2019/11/07/1573120127531.html",
    "type": "blog",
    "date": "2019-11-07",
    "topic": "MySQL 与数据架构",
    "topicSlug": "mysql-data",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Java",
      "json时间转换"
    ],
    "excerpt": "1.公司运营装mysql的时候的时区不是固定的，随机的，所以我们要想办法解决这个问题，应该运营的权限控制的很严，不能要他们更改； 首先解决从数据库读取到java，指定我们所需要的时区，只需要在配置文件的mysql链接的时候指定自己所需的文 datasource.jdbcUrl=jdbc:mysql://xxx.xx.x...",
    "guide": "本文归入「MySQL 与数据架构」专题，主要记录：1.公司运营装mysql的时候的时区不是固定的，随机的，所以我们要想办法解决这个问题，应该运营的权限控制的很严，不能要他们更改； 首先解决从数据库读取到java，指定我们所需要的时区，只需要在配置文件的mysql链接的时候指定自己所需的文 datasource.jdbcUrl=jdbc:mysql://xxx.xx.x...",
    "content": "1.公司运营装mysql的时候的时区不是固定的，随机的，所以我们要想办法解决这个问题，应该运营的权限控制的很严，不能要他们更改； 首先解决从数据库读取到java，指定我们所需要的时区，只需要在配置文件的mysql链接的时候指定自己所需的文 datasource.jdbcUrl=jdbc:mysql://xxx.xx.xx.xx:3306/bms?characterEncoding=UTF8&amp;useSSL=false&amp;serverTimezone=Asia/Shanghai 2.如果我们写接口的时候使用的JsonFormat注解的时候，我们也需要指定想同的时区，否则又会出现时区误差 @JsonFormat(pattern = ApplicationConstants.DATEFORMAT,timezone=\"GMT+8\") 1.公司运营装mysql的时候的时区不是固定的，随机的，所以我们要想办法解决这个问题，应该运营的权限控制的很严，不能要他们更改； 首先解决从数据库读取到java，指定我们所需要的时区，只需要在配置文件的mysql链接的时候指定自己所需的文 2.如果我们写接口的时候使用的JsonFormat注解的时候，我们也需要指定想同的时区，否则又会出现时区误差"
  },
  {
    "title": "pycharm永久激活使用（亲测可用，采用探针修改）",
    "url": "/articles/2019/11/07/1573099341300.html",
    "type": "blog",
    "date": "2019-11-07",
    "topic": "Java 与 JVM",
    "topicSlug": "java-jvm",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Python"
    ],
    "excerpt": "一、 下载 Pycharm 2019版本： https://download.jetbrains.8686c.com/python/pycharmprofessional2018.3.3.exe。 二、 下载破解补丁和配置文件 链接：https://pan.baidu.com/s/1K2SLEeczQuMGl4PC4d...",
    "guide": "本文归入「Java 与 JVM」专题，主要记录：一、 下载 Pycharm 2019版本： https://download.jetbrains.8686c.com/python/pycharmprofessional2018.3.3.exe。 二、 下载破解补丁和配置文件 链接：https://pan.baidu.com/s/1K2SLEeczQuMGl4PC4d...",
    "content": "一、 下载 Pycharm 2019版本： https://download.jetbrains.8686c.com/python/pycharmprofessional2018.3.3.exe。 二、 下载破解补丁和配置文件 链接：https://pan.baidu.com/s/1K2SLEeczQuMGl4PC4dkqw 提取码：z7j6 三、 将破解文件放到pycharm的bin目录下 四、 修改自己pycharm里的真实路径 修改pycharm64.exe.vmoptions ，pycharm.exe.vmoptions 两个文件中的aggent目录地址 Xms128m Xmx750m XX:ReservedCodeCacheSize=240m XX:+UseConcMarkSweepGC XX:SoftRefLRUPolicyMSPerMB=50 ea Dsun.io.useCanonCaches=false Djava.net.preferIPv4Stack=true Djdk.http.auth.tunneling.disabledSchemes=.... 一、 下载 Pycharm 2019版本： https://download.jetbrains.8686c.com/python/pycharmprofessional2018.3.3.exe。 二、 下载破解补丁和配置文件 链接：https://pan.baidu.com/s/1K2SLEeczQuMGl4PC4dkqw 提取码：z7j6 三、 将破解文件放到pycharm的bin目录下 四、 修改自己pycharm里的真实路径 修改pycharm64.exe.vmoptions ，pycharm.exe.vmoptions 两个文件中的aggent目录地址 注册码："
  },
  {
    "title": "IO多路复用机制详解",
    "url": "/articles/2019/11/05/1572944811633.html",
    "type": "blog",
    "date": "2019-11-05",
    "topic": "Java 与 JVM",
    "topicSlug": "java-jvm",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Java",
      "高并发",
      "线程"
    ],
    "excerpt": "服务器端编程经常需要构造高性能的IO模型，常见的IO模型有四种： 一. 同步阻塞IO（Blocking&nbsp;IO）：即传统的IO模型。 二. 同步非阻塞IO（Nonblocking&nbsp;IO）：默认创建的socket都是阻塞的，非阻塞IO要求socket被设置为NONBLOCK。注意这里所说的NIO并非Ja...",
    "guide": "本文归入「Java 与 JVM」专题，主要记录：服务器端编程经常需要构造高性能的IO模型，常见的IO模型有四种： 一. 同步阻塞IO（Blocking&nbsp;IO）：即传统的IO模型。 二. 同步非阻塞IO（Nonblocking&nbsp;IO）：默认创建的socket都是阻塞的，非阻塞IO要求socket被设置为NONBLOCK。注意这里所说的NIO并非Ja...",
    "content": "服务器端编程经常需要构造高性能的IO模型，常见的IO模型有四种： 一. 同步阻塞IO（Blocking&nbsp;IO）：即传统的IO模型。 二. 同步非阻塞IO（Nonblocking&nbsp;IO）：默认创建的socket都是阻塞的，非阻塞IO要求socket被设置为NONBLOCK。注意这里所说的NIO并非Java的NIO（New&nbsp;IO）库。 三. IO多路复用（IO&nbsp;Multiplexing）：即经典的Reactor设计模式，有时也称为异步阻塞IO，Java中的Selector和Linux中的epoll都是这种模型。 四. 异步IO（Asynchronous&nbsp;IO）：即经典的Proactor设计模式，也称为异步非阻塞IO。 同步和异步的概念描述的是用户线程与内核的交互方式： 同步是指用户线程发起IO请求后需要等待或者轮询内核IO操作完成后才能继续执行； 异步是指用户线程发起IO请求后仍继续执行，当内核IO操作完成后会通知用户线程，或者调用用户线程注册的回调函数。 阻塞和非阻塞的概念描述的是用户线程调用内核IO操作的方式： 阻塞是.... 服务器端编程经常需要构造高性能的IO模型，常见的IO模型有四种： 一. 同步阻塞IO（Blocking IO）：即传统的IO模型。 二. 同步非阻塞IO（Nonblocking IO）：默认创建的socket都是阻塞的，非阻塞IO要求socket被设置为NONBLOCK。注意这里所说的NIO并非Java的NIO（New IO）库。 三. IO多路复用（IO Multiplexing）：即经典的Reactor设计模式，有时也称为异步阻塞IO，Java中的Selector和Linux中的epoll都是这种模型。 四. 异步IO（Asynchronous IO）：即经典的Proactor设计模式，也称为异步非阻塞IO。 同步和异步的概念描述的是用户线程与内核的交互方式： 同步是指用户线程发起IO请求后需要等待或者轮询内核IO操作完成后才能继续执行； 异步是指用户线程发起IO请求后仍继续执行，当内核IO操作完成后会通知用户线程，或者调用用户线程注册的回调函数。 阻塞和非阻塞的概念描述的是用户线程调用内核IO操作的方式： 阻塞是指IO操作需要彻底完成后才返回到用户空间； 非阻塞是指IO操作被调用后立即返回给用户一个状态值，无需等到IO操作彻底完成。 一、同步阻塞IO 同步阻塞IO模型是最简单的IO模型，用户线程在内核进行IO操作时被阻塞 用户线程通过系统调用read发起IO读操作，由用户空间转到内核空间。内核等到数据包到达后，然后将接收的数据拷贝到用户空间，完成read操作. 用户需要等待read将socket中的数据读取到buffer后，才继续处理接收的数据。整个IO请求的过程中，用户线程是被阻塞的，这导致用户在发起IO请求时，不能做任何事情，对CPU的资源利用率不够. 二、同步非阻塞IO 同步非阻塞IO是在同步阻塞IO的基础上，将socket设置为NONBLOCK。这样做用户线程可以在发起IO请求后可以立即返回 由于socket是非阻塞的方式，因此用户线程发起IO请求时立即返回。但并未读取到任何数据，用户线程需要不断地发起IO请求，直到数据到达后，才真正读取到数据，继续执行。 用户线程使用同步非阻塞IO模型的伪代码描述为： 用户需要不断地调用read，尝试读取socket中的数据，直到读取成功后，才继续处理接收的数据。整个IO请求的过程中，虽然用户线程每次发起IO请求后可以立即返回，但是为了等到数据，仍需要不断地轮询、重复请求，消耗了大量的CPU的资源。一般很少直接使用这种模型，而是在其他IO模型中使用非阻塞IO这一特性。 三、IO多路复用 IO多路复用模型是建立在内核提供的多路分离函数select基础之上的，使用select函数可以避免同步非阻塞IO模型中轮询等待的问题。 用户首先将需要进行IO操作的socket添加到select中，然后阻塞等待select系统调用返回。当数据到达时，socket被激活，select函数返回。用户线程正式发起read请求，读取数据并继续执行。 从流程上来看，使用select函数进行IO请求和同步阻塞模型没有太大的区别，甚至还多了添加监视socket，以及调用select函数的额外操作，效率更差。但是，使用select以后最大的优势是用户可以在一个线程内同时处理多个socket的IO请求。用户可以注册多个socket，然后不断地调用select读取被激活的socket，即可达到在同一个线程内同时处理多个IO请求的目的。而在同步阻塞模型中，必须通过多线程的方式才能达到这个目的。 用户线程使用select函数的伪代码描述为： 其中while循环前将socket添加到select监视中，然后在while内一直调用select获取被激活的socket，一旦socket可读，便调用read函数将socket中的数据读取出来。 然而，使用select函数的优点并不仅限于此。虽然上述方式允许单线程内处理多个IO请求，但是每个IO请求的过程还是阻塞的（在select函数上阻塞），平均时间甚至比同步阻塞IO模型还要长。如果用户线程只注册自己感兴趣的socket或者IO请求，然后去做自己的事情，等到数据到来时再进行处理，则可以提高CPU的利用率。 四、异步IO I/O多路复用 重要的事情再说一遍： I/O multiplexing 这里面的 multiplexing 指的其实是在单个线程通过记录跟踪每一个Sock(I/O流)的状态(对应空管塔里面的Fight progress strip槽)来同时管理多个I/O流. 发明它的原因，是尽量多的提高服务器的吞吐能力。 是不是听起来好拗口，看个图就懂了. 在同一个线程里面， 通过拨开关的方式，来同时传输多个I/O流， (学过EE的人现在可以站出来义正严辞说这个叫“时分复用”了）。 什么，你还没有搞懂“一个请求到来了，nginx使用epoll接收请求的过程是怎样的”， 多看看这个图就了解了。提醒下，ngnix会有很多链接进来， epoll会把他们都监视起来，然后像拨开关一样，谁有数据就拨向谁，然后调用相应的代码处理。 了解这个基本的概念以后，其他的就很好解释了。 select, poll, epoll 都是I/O多路复用的具体的实现，之所以有这三个鬼存在，其实是他们出现是有先后顺序的。 I/O多路复用这个概念被提出来以后， select是第一个实现 (1983 左右在BSD里面实现的)。 select 被实现以后，很快就暴露出了很多问题。 select 会修改传入的参数数组，这个对于一个需要调用很多次的函数，是非常不友好的。 select 如果任何一个sock(I/O stream)出现了数据，select 仅仅会返回，但是并不会告诉你是那个sock上有数据，于是你只能自己一个一个的找，10几个sock可能还好，要是几万的sock每次都找一遍，这个无谓的开销就颇有海天盛筵的豪气了。 select 只能监视1024个链接， 这个跟草榴没啥关系哦，linux 定义在头文件中的，参见FDSETSIZE。 select 不是线程安全的，如果你把一个sock加入到select, 然后突然另外一个线程发现，尼玛，这个sock不用，要收回。对不起，这个select 不支持的，如果你丧心病狂的竟然关掉这个sock, select的标准行为是。。呃。。不可预测的， 这个可是写在文档中的哦. 于是14年以后(1997年）一帮人又实现了poll, poll 修复了select的很多问题，比如 poll 去掉了1024个链接的限制，于是要多少链接呢， 主人你开心就好。 poll 从设计上来说，不再修改传入数组，不过这个要看你的平台了，所以行走江湖，还是小心为妙。 其实拖14年那么久也不是效率问题， 而是那个时代的硬件实在太弱，一台服务器处理1千多个链接简直就是神一样的存在了，select很长段时间已经满足需求。 但是poll仍然不是线程安全的， 这就意味着，不管服务器有多强悍，你也只能在一个线程里面处理一组I/O流。你当然可以那多进程来配合了，不过然后你就有了多进程的各种问题。 于是5年以后, 在2002, 大神 Davide Libenzi 实现了epoll. epoll 可以说是I/O 多路复用最新的一个实现，epoll 修复了poll 和select绝大部分问题, 比如： epoll 现在是线程安全的。 epoll 现在不仅告诉你sock组里面数据，还会告诉你具体哪个sock有数据，你不用自己去找了。 epoll 当年的patch，现在还在，下面链接可以看得到： /dev/epoll Home Page 横轴Dead connections 就是链接数的意思，叫这个名字只是它的测试工具叫deadcon. 纵轴是每秒处理请求的数量，你可以看到，epoll每秒处理请求的数量基本不会随着链接变多而下降的。poll 和/dev/poll 就很惨了。 可是epoll 有个致命的缺点。。只有linux支持。比如BSD上面对应的实现是kqueue。"
  },
  {
    "title": "ubutun安装chrome浏览器",
    "url": "/articles/2019/11/04/1572870368019.html",
    "type": "blog",
    "date": "2019-11-04",
    "topic": "Linux 运维与部署",
    "topicSlug": "linux-ops",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "待分类",
      "Python"
    ],
    "excerpt": "一、安装Chrome浏览器 1、安装依赖 sudo aptget install libxss1 libappindicator1 libindicator7 2、下载Chrome安装包 wget https://dl.google.com/linux/direct/googlechromestablecurrenta...",
    "guide": "本文归入「Linux 运维与部署」专题，主要记录：一、安装Chrome浏览器 1、安装依赖 sudo aptget install libxss1 libappindicator1 libindicator7 2、下载Chrome安装包 wget https://dl.google.com/linux/direct/googlechromestablecurrenta...",
    "content": "一、安装Chrome浏览器 1、安装依赖 sudo aptget install libxss1 libappindicator1 libindicator7 2、下载Chrome安装包 wget https://dl.google.com/linux/direct/googlechromestablecurrentamd64.deb 3、安装 sudo dpkg i googlechrome.deb sudo aptget install f 4、ubuntu如何安装lsbrelease工具? sudo aptget install lsbcore y 二、安装ChromeDriver 1、安装xvfb以便我们可以无头奔跑地运行Chrome sudo aptget install xvfb 2、安装依赖 sudo aptget install unzip 3、下载安装包 wget N http://chromedriver.storage.googleapis.com/2.26/chromedriverlinux.... 一、安装Chrome浏览器 1、安装依赖 2、下载Chrome安装包 3、安装 4、ubuntu如何安装lsbrelease工具? 二、安装ChromeDriver 1、安装xvfb以便我们可以无头奔跑地运行Chrome 2、安装依赖 3、下载安装包 4、解压缩+添加执行权限 5、移动 6、建立软连接 三、无头运行Chrome 1、安装Python依赖 pip3 install selenium pip3 install pyvirtualdisplay 2、开干"
  },
  {
    "title": "阿里云ubutun python3.5.2卸载更新到3.6方法亲测有效",
    "url": "/articles/2019/11/04/1572851425831.html",
    "type": "blog",
    "date": "2019-11-04",
    "topic": "Python 爬虫与自动化",
    "topicSlug": "python-crawler",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Python"
    ],
    "excerpt": "1.首先卸载一下python3.5的包 sudo aptget remove python3.5 2.卸载python3.5以及它的依赖包 sudo aptget remove autoremove python3.5 3.手动删除usr/bin 下面的包 如果前两步还不能删除完，自己去usr/bin/下删除pytho...",
    "guide": "本文归入「Python 爬虫与自动化」专题，主要记录：1.首先卸载一下python3.5的包 sudo aptget remove python3.5 2.卸载python3.5以及它的依赖包 sudo aptget remove autoremove python3.5 3.手动删除usr/bin 下面的包 如果前两步还不能删除完，自己去usr/bin/下删除pytho...",
    "content": "1.首先卸载一下python3.5的包 sudo aptget remove python3.5 2.卸载python3.5以及它的依赖包 sudo aptget remove autoremove python3.5 3.手动删除usr/bin 下面的包 如果前两步还不能删除完，自己去usr/bin/下删除python3.5相关的文件 4.安装python3.6 sudo aptget install softwarepropertiescommon sudo addaptrepository ppa:jonathonf/python3.6 sudo aptget update sudo aptget install python3.6 5.安装python3.6 pip aptget install python3pip python3.6 m pip install upgrade pip 6.安装python3.6 pip 查询安装版本 python3 V python V pip V 1.首先卸载一下python3.5的包 2.卸载python3.5以及它的依赖包 3.手动删除usr/bin 下面的包 如果前两步还不能删除完，自己去usr/bin/下删除python3.5相关的文件 4.安装python3.6 5.安装python3.6 pip 6.安装python3.6 pip 查询安装版本"
  },
  {
    "title": "什么是区块链？ 区块链的入门介绍,场景应用",
    "url": "/articles/2019/10/30/1572418772115.html",
    "type": "blog",
    "date": "2019-10-30",
    "topic": "中间件与分布式",
    "topicSlug": "middleware-distributed",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "区块链"
    ],
    "excerpt": "原作者：阮一峰 www.ruanyifeng.com/blog/2017/12/blockchaintutorial.html 区块链（blockchain）是眼下的大热门，新闻媒体大量报道，宣称它将创造未来。 可是，简单易懂的入门文章却很少。区块链到底是什么，有何特别之处，很少有解释。 一、区块链的本质 区块链是什么...",
    "guide": "本文归入「中间件与分布式」专题，主要记录：原作者：阮一峰 www.ruanyifeng.com/blog/2017/12/blockchaintutorial.html 区块链（blockchain）是眼下的大热门，新闻媒体大量报道，宣称它将创造未来。 可是，简单易懂的入门文章却很少。区块链到底是什么，有何特别之处，很少有解释。 一、区块链的本质 区块链是什么...",
    "content": "原作者：阮一峰 www.ruanyifeng.com/blog/2017/12/blockchaintutorial.html 区块链（blockchain）是眼下的大热门，新闻媒体大量报道，宣称它将创造未来。 可是，简单易懂的入门文章却很少。区块链到底是什么，有何特别之处，很少有解释。 一、区块链的本质 区块链是什么？一句话，它是一种特殊的分布式数据库 首先，区块链的主要作用是储存信息。任何需要保存的信息，都可以写入区块链，也可以从里面读取，所以它是数据库。 其次，任何人都可以架设服务器，加入区块链网络，成为一个节点。区块链的世界里面，没有中心节点，每个节点都是平等的，都保存着整个数据库。你可以向任何一个节点，写入/读取数据，因为所有节点最后都会同步，保证区块链一致。 二、区块链的最大特点 分布式数据库并非新发明，市场上早有此类产品。但是，区块链有一个革命性特点。 区块链没有管理员，它是彻底无中心的。其他的数据库都有管理员，但是区块链没有。如果有人想对区块链添加审核，也实现不了，因为它的设计目标就是防止出现居于中心地位的管理当局。 正是因为无法管理，区块链才能做到无法被.... 原作者：阮一峰 www.ruanyifeng.com/blog/2017/12/blockchaintutorial.html 区块链（blockchain）是眼下的大热门，新闻媒体大量报道，宣称它将创造未来。 可是，简单易懂的入门文章却很少。区块链到底是什么，有何特别之处，很少有解释。 一、区块链的本质 区块链是什么？一句话，它是一种特殊的分布式数据库 首先，区块链的主要作用是储存信息。任何需要保存的信息，都可以写入区块链，也可以从里面读取，所以它是数据库。 其次，任何人都可以架设服务器，加入区块链网络，成为一个节点。区块链的世界里面，没有中心节点，每个节点都是平等的，都保存着整个数据库。你可以向任何一个节点，写入/读取数据，因为所有节点最后都会同步，保证区块链一致。 二、区块链的最大特点 分布式数据库并非新发明，市场上早有此类产品。但是，区块链有一个革命性特点。 区块链没有管理员，它是彻底无中心的。其他的数据库都有管理员，但是区块链没有。如果有人想对区块链添加审核，也实现不了，因为它的设计目标就是防止出现居于中心地位的管理当局。 正是因为无法管理，区块链才能做到无法被控制。否则一旦大公司大集团控制了管理权，他们就会控制整个平台，其他使用者就都必须听命于他们了。 但是，没有了管理员，人人都可以往里面写入数据，怎么才能保证数据是可信的呢？被坏人改了怎么办？请接着往下读，这就是区块链奇妙的地方。 三、区块 区块链由一个个区块（block）组成。区块很像数据库的记录，每次写入数据，就是创建一个区块。 每个区块包含两个部分。 区块头（Head）：记录当前区块的元信息 区块体（Body）：实际数据 区块头包含了当前区块的多项元信息。 生成时间 实际数据（即区块体）的 Hash 上一个区块的 Hash … 这里，你需要理解什么叫 Hash，这是理解区块链必需的。 所谓 Hash 就是计算机可以对任意内容，计算出一个长度相同的特征值。区块链的 Hash 长度是256位，这就是说，不管原始内容是什么，最后都会计算出一个256位的二进制数字。而且可以保证，只要原始内容不同，对应的 Hash 一定是不同的。 举例来说，字符串123的 Hash 是a8fdc205a9f19cc1c7507a60c4f01b13d11d7fd0（十六进制），转成二进制就是256位，而且只有123能得到这个 Hash。 因此，就有两个重要的推论。 推论1：每个区块的 Hash 都是不一样的，可以通过 Hash 标识区块。 推论2：如果区块的内容变了，它的 Hash 一定会改变。 四、 Hash 的不可修改性 区块与 Hash 是一一对应的，每个区块的 Hash 都是针对”区块头”（Head）计算的。 Hash = SHA256(区块头) 上面就是区块 Hash 的计算公式，Hash 由区块头唯一决定，SHA256是区块链的 Hash 算法。 前面说过，区块头包含很多内容，其中有当前区块体的 Hash（注意是”区块体”的 Hash，而不是整个区块），还有上一个区块的 Hash。这意味着，如果当前区块的内容变了，或者上一个区块的 Hash 变了，一定会引起当前区块的 Hash 改变。 这一点对区块链有重大意义。如果有人修改了一个区块，该区块的 Hash 就变了。为了让后面的区块还能连到它，该人必须同时修改后面所有的区块，否则被改掉的区块就脱离区块链了。由于后面要提到的原因，Hash 的计算很耗时，同时修改多个区块几乎不可能发生，除非有人掌握了全网51%以上的计算能力。 正是通过这种联动机制，区块链保证了自身的可靠性，数据一旦写入，就无法被篡改。这就像历史一样，发生了就是发生了，从此再无法改变。 每个区块都连着上一个区块，这也是”区块链”这个名字的由来。 五、采矿 由于必须保证节点之间的同步，所以新区块的添加速度不能太快。试想一下，你刚刚同步了一个区块，准备基于它生成下一个区块，但这时别的节点又有新区块生成，你不得不放弃做了一半的计算，再次去同步。因为每个区块的后面，只能跟着一个区块，你永远只能在最新区块的后面，生成下一个区块。所以，你别无选择，一听到信号，就必须立刻同步。 所以，区块链的发明者中本聪（这是假名，真实身份至今未知）故意让添加新区块，变得很困难。他的设计是，平均每10分钟，全网才能生成一个新区块，一小时也就六个。 这种产出速度不是通过命令达成的，而是故意设置了海量的计算。也就是说，只有通过极其大量的计算，才能得到当前区块的有效 Hash，从而把新区块添加到区块链。由于计算量太大，所以快不起来。 这个过程就叫做采矿（mining），因为计算有效 Hash 的难度，好比在全世界的沙子里面，找到一粒符合条件的沙子。计算 Hash 的机器就叫做矿机，操作矿机的人就叫做矿工。 六、难度系数 读到这里，你可能会有一个疑问，人们都说采矿很难，可是采矿不就是用计算机算出一个 Hash 吗，这正是计算机的强项啊，怎么会变得很难，迟迟算不出来呢？ 原来不是任意一个 Hash 都可以，只有满足条件的 Hash 才会被区块链接受。这个条件特别苛刻，使得绝大部分 Hash 都不满足要求，必须重算。 原来，区块头包含一个难度系数（difficulty），这个值决定了计算 Hash 的难度。举例来说，第100000个区块的难度系数是 14484.16236122。 区块链协议规定，使用一个常量除以难度系数，可以得到目标值（target）。显然，难度系数越大，目标值就越小。 Hash 的有效性跟目标值密切相关，只有小于目标值的 Hash 才是有效的，否则 Hash 无效，必须重算。由于目标值非常小，Hash 小于该值的机会极其渺茫，可能计算10亿次，才算中一次。这就是采矿如此之慢的根本原因。 区块头里面还有一个 Nonce 值，记录了 Hash 重算的次数。第 100000 个区块的 Nonce 值是274148111，即计算了 2.74 亿次，才得到了一个有效的 Hash，该区块才能加入区块链。 七、难度系数的动态调节 就算采矿很难，但也没法保证，正好十分钟产出一个区块，有时一分钟就算出来了，有时几个小时可能也没结果。总体来看，随着硬件设备的提升，以及矿机的数量增长，计算速度一定会越来越快。 为了将产出速率恒定在十分钟，中本聪还设计了难度系数的动态调节机制。他规定，难度系数每两周（2016个区块）调整一次。如果这两周里面，区块的平均生成速度是9分钟，就意味着比法定速度快了10%，因此难度系数就要调高10%；如果平均生成速度是11分钟，就意味着比法定速度慢了10%，因此难度系数就要调低10%。 难度系数越调越高（目标值越来越小），导致了采矿越来越难。 八、区块链的分叉 即使区块链是可靠的，现在还有一个问题没有解决：如果两个人同时向区块链写入数据，也就是说，同时有两个区块加入，因为它们都连着前一个区块，就形成了分叉。这时应该采纳哪一个区块呢？ 现在的规则是，新节点总是采用最长的那条区块链。如果区块链有分叉，将看哪个分支在分叉点后面，先达到6个新区块（称为”六次确认”）。按照10分钟一个区块计算，一小时就可以确认。 由于新区块的生成速度由计算能力决定，所以这条规则就是说，拥有大多数计算能力的那条分支，就是正宗的比特链。 九、应用场景 1.信息共享 这应该是区块链最简单的应用场景，就是信息互通有无。 1、传统的信息共享的痛点 要么是统一由一个中心进行信息发布和分发，要么是彼此之间定时批量对账（典型的每天一次），对于有时效性要求的信息共享，难以达到实时共享。 信息共享的双方缺少一种相互信任的通信方式，难以确定收到的信息是否是对方发送的。 2、区块链 + 信息共享 首先，区块链本身就是需要保持各个节点的数据一致性的，可以说是自带信息共享功能；其次，实时的问题通过区块链的P2P技术可以实现；最后，利用区块链的不可篡改和共识机制，可构建其一条安全可靠的信息共享通道。 也行你会有这样的疑问：解决上面的问题，不用区块链技术，我自己建个加密通道也可以搞定啊！但我想说，既然区块链技术能够解决这些问题，并且增加节点非常方便，在你没有已经建好一套安全可靠的信息共享系统之前，为什么不用区块链技术呢？ 3、应用案例 举下我们腾讯自己的应用公益寻人链，借用如下一张好图，可以看到，区块链在信息共享中发挥的价值 2.版权保护 1、传统鉴证证明的痛点 流程复杂：以版权保护"
  },
  {
    "title": "js京东全民养红包一步完成",
    "url": "/articles/2019/10/29/1572329735795.html",
    "type": "blog",
    "date": "2019-10-29",
    "topic": "工具、效率与博客建设",
    "topicSlug": "tools-blog",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "js"
    ],
    "excerpt": "京东喜迎双十一 这个活动和天猫的活动几乎可以说很像了，都是浏览商家店铺获取金币， 可是这样进度太慢了。于是浏览的大佬的贴子，终于找到可以一键完成养红包的所有任务了。 使用步骤 一、打开谷歌浏览或者火狐也浏览也行（支持开发者模式），按 F12 进入，切换手机模式如图： 738 x 395 1366 x 732 二、进入京...",
    "guide": "本文归入「工具、效率与博客建设」专题，主要记录：京东喜迎双十一 这个活动和天猫的活动几乎可以说很像了，都是浏览商家店铺获取金币， 可是这样进度太慢了。于是浏览的大佬的贴子，终于找到可以一键完成养红包的所有任务了。 使用步骤 一、打开谷歌浏览或者火狐也浏览也行（支持开发者模式），按 F12 进入，切换手机模式如图： 738 x 395 1366 x 732 二、进入京...",
    "content": "京东喜迎双十一 这个活动和天猫的活动几乎可以说很像了，都是浏览商家店铺获取金币， 可是这样进度太慢了。于是浏览的大佬的贴子，终于找到可以一键完成养红包的所有任务了。 使用步骤 一、打开谷歌浏览或者火狐也浏览也行（支持开发者模式），按 F12 进入，切换手机模式如图： 738 x 395 1366 x 732 二、进入京东官网 1.登入你的京东账号：http://www.jd.com 2.进入活动页面：https://happy.m.jd.com/babelDiy/GZWVJFLMXBQVEBDQZWMY/XJf8bH6oXDWSgS91daDJzXh9bU7/index.html 三、使用 js 脚本 把脚本复制到 Console 点击回车就可以看见任务在自动完成 下面是脚本代码： let productList = [], shopList = [], url = \"https://api.m.jd.com/client.action\"; function autoPost(id,type){ fetch(${url}?timestamp=${new Date().getTime.... 京东喜迎双十一 这个活动和天猫的活动几乎可以说很像了，都是浏览商家店铺获取金币， 可是这样进度太慢了。于是浏览的大佬的贴子，终于找到可以一键完成养红包的所有任务了。 使用步骤 一、打开谷歌浏览或者火狐也浏览也行（支持开发者模式），按 F12 进入，切换手机模式如图： 738 x 395 1366 x 732 二、进入京东官网 1.登入你的京东账号：http://www.jd.com 2.进入活动页面：https://happy.m.jd.com/babelDiy/GZWVJFLMXBQVEBDQZWMY/XJf8bH6oXDWSgS91daDJzXh9bU7/index.html 三、使用 js 脚本 把脚本复制到 Console 点击回车就可以看见任务在自动完成 下面是脚本代码： 脚本运行后就会是下面的样子，因为我今天的任务已经完成了，所以显示是完成的： 转载：https://www.52pojie.cn/thread104279611.html"
  },
  {
    "title": "selenium经常使用api",
    "url": "/articles/2019/10/28/1572254233777.html",
    "type": "blog",
    "date": "2019-10-28",
    "topic": "Python 爬虫与自动化",
    "topicSlug": "python-crawler",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Python"
    ],
    "excerpt": "pythonselenium官方文档可详细看用法 1.浏览器chromeDriver获取信息 1.driver.currenturl：用于获得当前页面的URL 2.driver.title：用于获取当前页面的标题 3.driver.pagesource:用于获取页面html源代码 4.driver.currentwin...",
    "guide": "本文归入「Python 爬虫与自动化」专题，主要记录：pythonselenium官方文档可详细看用法 1.浏览器chromeDriver获取信息 1.driver.currenturl：用于获得当前页面的URL 2.driver.title：用于获取当前页面的标题 3.driver.pagesource:用于获取页面html源代码 4.driver.currentwin...",
    "content": "pythonselenium官方文档可详细看用法 1.浏览器chromeDriver获取信息 1.driver.currenturl：用于获得当前页面的URL 2.driver.title：用于获取当前页面的标题 3.driver.pagesource:用于获取页面html源代码 4.driver.currentwindowhandle:用于获取当前窗口句柄 5.driver.windowhandles:用于获取所有窗口句柄 6.driver.findelementby 定位元素，有18种 7.driver.get(url):浏览器加载url。 8.driver.forward()：浏览器向前（点击向前按钮）。 9.driver.back()：浏览器向后（点击向后按钮）。 10.driver.refresh()：浏览器刷新（点击刷新按钮）。 11driver.close()：关闭当前窗口，或最后打开的窗口。 12.driver.quit():关闭所有关联窗口，并且安全关闭session。 13.driver.maximizewindow():最大化浏览器窗口.... pythonselenium官方文档可详细看用法 1.浏览器chromeDriver获取信息 1.driver.currenturl：用于获得当前页面的URL 2.driver.title：用于获取当前页面的标题 3.driver.pagesource:用于获取页面html源代码 4.driver.currentwindowhandle:用于获取当前窗口句柄 5.driver.windowhandles:用于获取所有窗口句柄 6.driver.findelementby 定位元素，有18种 7.driver.get(url):浏览器加载url。 8.driver.forward()：浏览器向前（点击向前按钮）。 9.driver.back()：浏览器向后（点击向后按钮）。 10.driver.refresh()：浏览器刷新（点击刷新按钮）。 11driver.close()：关闭当前窗口，或最后打开的窗口。 12.driver.quit():关闭所有关联窗口，并且安全关闭session。 13.driver.maximizewindow():最大化浏览器窗口。 14.driver.setwindowsize(宽，高)：设置浏览器窗口大小。 15.driver.getwindowsize()：获取当前窗口的长和宽。 16.driver.getwindowposition()：获取当前窗口坐标。 17.driver.getscreenshotasfile(filename):截取当前窗口。 18.driver.implicitlywait(秒)：隐式等待，通过一定的时长等待页面上某一元素加载完成。若提前定位到元素，则继续执行。若超过时间未加载出，则抛出NoSuchElementException异常。 19.driver.switchtoframe(id或name属性值)：切换到新表单(同一窗口)。若无id或属性值，可先通过xpath定位到iframe，再将值传给switchtoframe() driver.switchto.frame(id或name,或定位到的frame) 20.driver.switchto.parentcontent():跳出当前一级表单。该方法默认对应于离它最近的switchto.frame()方法。 21.driver.switchto.defaultcontent():跳回最外层的页面。 22.driver.switchtowindow(窗口句柄)：切换到新窗口。 23.driver.switchto.window(窗口句柄):切换到新窗口。 24.driver.switchtoalert():警告框处理。处理JavaScript所生成的alert,confirm,prompt. 25.driver.switchto.alert():警告框处理。 26.driver.executescript(js):调用js。 27.driver.getcookies():获取当前会话所有cookie信息。 28.driver.getcookie(cookiename)：返回字典的key为“cookiename”的cookie信息。 29.driver.addcookie(cookiedict):添加cookie。“cookiedict”指字典对象，必须有name和value值。 30.driver.deletecookie(name,optionsString):删除cookie信息。 31.driver.deleteallcookies():删除所有cookie信息。 findelementbyid findelementbyname findelementbyxpath findelementbylinktext findelementbypartiallinktext findelementbytagname findelementbyclassname findelementbycssselecto 这个经常用 2.获取元素之后，属性事件 1.element.size:获取元素的尺寸。 2.element.text：获取元素的文本。 3.element.tagname:获取标签名称。 4.element.clear():清除文本。 5.element.sendkeys(value):输入文字或键盘按键（需导入Keys模块）。 6.element.click()：单击元素。 7.element.getattribute(name):获得属性值 8.element.isdisplayed():返回元素结果是否可见（True 或 False） 9.element.isselected():返回元素结果是否被选中（True 或 False） 10.element.findelement():定位元素，用于二次定位。 3.通过属性获取元素，并执行js事件 3.具体使用"
  },
  {
    "title": "linux下一些常用命令",
    "url": "/articles/2019/10/25/1571973778513.html",
    "type": "blog",
    "date": "2019-10-25",
    "topic": "Linux 运维与部署",
    "topicSlug": "linux-ops",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Linux"
    ],
    "excerpt": "1.根据端口查进程 lsof i:port netstat nap | grep port 2.根据进程号查端口: lsof i|grep pid netstat nap | grep pid 3.根据进程名查找pid、port： ps ef |grep tomcat ps ef |grep port(根据port查找...",
    "guide": "本文归入「Linux 运维与部署」专题，主要记录：1.根据端口查进程 lsof i:port netstat nap | grep port 2.根据进程号查端口: lsof i|grep pid netstat nap | grep pid 3.根据进程名查找pid、port： ps ef |grep tomcat ps ef |grep port(根据port查找...",
    "content": "1.根据端口查进程 lsof i:port netstat nap | grep port 2.根据进程号查端口: lsof i|grep pid netstat nap | grep pid 3.根据进程名查找pid、port： ps ef |grep tomcat ps ef |grep port(根据port查找相关进程) ps ef |grep pid(根据pid查找相关进程) 4.根据进程号查服务路径： ll /proc/26357/cwd 26357是进程号 1 root root 0 Oct 25 10:08 /proc/26357/cwd &gt; /root/data/proxypool/Api/ 5.查询所有进程号 top top 6.查看进程中的线程号信息 ps T p 18043 ps 语法 1.top H p 18043 top 实时的哈 shift+H开启show threads on功能，展示线程资源占用情况 找到消耗CPU等最多的PID为:18045 2. printf \"%x\\n\" 18045 &gt.... 1.根据端口查进程 2.根据进程号查端口: 3.根据进程名查找pid、port： 4.根据进程号查服务路径： 5.查询所有进程号 top 6.查看进程中的线程号信息 转载评论里https://hacpai.com/member/fenglidac 的精髓图片"
  },
  {
    "title": "Nginx 虚拟主机配置",
    "url": "/articles/2019/10/21/1571652176584.html",
    "type": "blog",
    "date": "2019-10-21",
    "topic": "Linux 运维与部署",
    "topicSlug": "linux-ops",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Nginx"
    ],
    "excerpt": "1.虚拟主机概念 所谓虚拟主机，在 Web 服务里就是一个独立的网站站点，这个站点对应独立的域名（也可能是IP 或端口），具有独立的程序及资源，可以独立地对外提供服务供用户访问。 在 Nginx 中，使用一个 server{} 标签来标识一个虚拟主机，一个 Web 服务里可以有多个虚拟主机标签对，即可以同时支持多个虚拟...",
    "guide": "本文归入「Linux 运维与部署」专题，主要记录：1.虚拟主机概念 所谓虚拟主机，在 Web 服务里就是一个独立的网站站点，这个站点对应独立的域名（也可能是IP 或端口），具有独立的程序及资源，可以独立地对外提供服务供用户访问。 在 Nginx 中，使用一个 server{} 标签来标识一个虚拟主机，一个 Web 服务里可以有多个虚拟主机标签对，即可以同时支持多个虚拟...",
    "content": "1.虚拟主机概念 所谓虚拟主机，在 Web 服务里就是一个独立的网站站点，这个站点对应独立的域名（也可能是IP 或端口），具有独立的程序及资源，可以独立地对外提供服务供用户访问。 在 Nginx 中，使用一个 server{} 标签来标识一个虚拟主机，一个 Web 服务里可以有多个虚拟主机标签对，即可以同时支持多个虚拟主机站点。 虚拟主机有三种类型：基于域名的虚拟主机、基于端口的虚拟主机、基于 IP 的虚拟主机。 2.基于域名的虚拟主机 域名的虚拟主机是生产环境中最常用的。 2.1 编辑配置文件 [root@localhost conf] vim nginx.conf workerprocesses 1; events { workerconnections 1024; } http { include mime.types; defaulttype application/octetstream; sendfile on; keepalivetimeout 65; server { listen 80; servername www.abc.com; l.... 1.虚拟主机概念 所谓虚拟主机，在 Web 服务里就是一个独立的网站站点，这个站点对应独立的域名（也可能是IP 或端口），具有独立的程序及资源，可以独立地对外提供服务供用户访问。 在 Nginx 中，使用一个 server{} 标签来标识一个虚拟主机，一个 Web 服务里可以有多个虚拟主机标签对，即可以同时支持多个虚拟主机站点。 虚拟主机有三种类型：基于域名的虚拟主机、基于端口的虚拟主机、基于 IP 的虚拟主机。 2.基于域名的虚拟主机 域名的虚拟主机是生产环境中最常用的。 2.1 编辑配置文件 规范化 Nginx 配置文件，将每个虚拟主机配置成单独的文件，放在统一目录中（如：vhosts） 创建vhosts目录 编辑 nginx.conf 主配置文件 创建每个虚拟主机配置文件： 2.2 创建虚拟主机站点对应的目录和文件 2.3 编辑 /etc/hosts 文件，域名解析 2.4 重新加载 Nginx 配置 2.5 访问测试 3.基于端口的虚拟主机 基于端口的虚拟主机生产环境不多见，只需要修改主机监听端口就可以了，域名相同也可以，因为基于端口的虚拟主机就是他通过端口来唯一分区不通的虚拟主机的，只要端口不同就是不同的虚拟主机。 3.1 编辑配置文件 3.2 创建虚拟主机站点对应的目录和文件 3.3 编辑 /etc/hosts 文件，域名解析 3.4 重新加载 Nginx 配置 3.5 访问测试 4.基于 IP 的虚拟主机 基于 IP 的虚拟主机在生产环境中不常使用，只需要将基于域名的虚拟主机中的域名修改为 IP 就可以了，前提是服务器有多个IP地址。如果需要不同的 IP 对应不同的服务，可在网站前端的负载均衡器上配置。 5.虚拟主机别名配置"
  },
  {
    "title": "java解决Hash碰撞冲突方法总结",
    "url": "/articles/2019/10/17/1571293329133.html",
    "type": "blog",
    "date": "2019-10-17",
    "topic": "Java 与 JVM",
    "topicSlug": "java-jvm",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Java"
    ],
    "excerpt": "1.什么是hash碰撞 对象Hash的前提是实现equals()和hashCode()两个方法，那么HashCode()的作用就是保证对象返回唯一hash值，但当两个对象计算值一样时，这就发生了碰撞冲突。如下将介绍如何处理冲突，当然其前提是一致性hash。 为什么hashcode会相同？ hashCode是所有java...",
    "guide": "本文归入「Java 与 JVM」专题，主要记录：1.什么是hash碰撞 对象Hash的前提是实现equals()和hashCode()两个方法，那么HashCode()的作用就是保证对象返回唯一hash值，但当两个对象计算值一样时，这就发生了碰撞冲突。如下将介绍如何处理冲突，当然其前提是一致性hash。 为什么hashcode会相同？ hashCode是所有java...",
    "content": "1.什么是hash碰撞 对象Hash的前提是实现equals()和hashCode()两个方法，那么HashCode()的作用就是保证对象返回唯一hash值，但当两个对象计算值一样时，这就发生了碰撞冲突。如下将介绍如何处理冲突，当然其前提是一致性hash。 为什么hashcode会相同？ hashCode是所有java对象的固有方法，如果不重载的话，返回的实际上是该对象在jvm的堆上的内存地址，而不同对象的内存地址肯定不同，所以这个hashCode也就肯定不同了。如果重载了的话，由于采用的算法的问题，有可能导致两个不同对象的hashCode相同。 hashCode的重载实现需要满足不变性，即一个object的hashCode不能前一会是1，过一会就变成2了。hashCode的重载实现最好依赖于对象中的final属性，从而在对象初始化构造后就不再变化。一方面是jvm便于代码优化，可以缓存这个hashCode；另一方面，在使用hashMap或hashSet的场景中，如果使用的key的hashCode会变化，将会导致bug，比如放进去时key.hashCode()=1，等到要取出来时key.... 1.什么是hash碰撞 对象Hash的前提是实现equals()和hashCode()两个方法，那么HashCode()的作用就是保证对象返回唯一hash值，但当两个对象计算值一样时，这就发生了碰撞冲突。如下将介绍如何处理冲突，当然其前提是一致性hash。 为什么hashcode会相同？ hashCode是所有java对象的固有方法，如果不重载的话，返回的实际上是该对象在jvm的堆上的内存地址，而不同对象的内存地址肯定不同，所以这个hashCode也就肯定不同了。如果重载了的话，由于采用的算法的问题，有可能导致两个不同对象的hashCode相同。 hashCode的重载实现需要满足不变性，即一个object的hashCode不能前一会是1，过一会就变成2了。hashCode的重载实现最好依赖于对象中的final属性，从而在对象初始化构造后就不再变化。一方面是jvm便于代码优化，可以缓存这个hashCode；另一方面，在使用hashMap或hashSet的场景中，如果使用的key的hashCode会变化，将会导致bug，比如放进去时key.hashCode()=1，等到要取出来时key.hashCode()=2了，就会取不出来原先的数据。这个可以写一个简单的代码自己验证一下 2.解决方法一 开放地址法 开放地执法有一个公式:Hi=(H(key)+di) MOD m i=1,2,…,k(k 当发生冲突时，使用第二个、第三个、哈希函数计算地址，直到无冲突时。缺点：计算时间增加。 比如上面第一次按照姓首字母进行哈希，如果产生冲突可以按照姓字母首字母第二位进行哈希，再冲突，第三位，直到不冲突为止 4.拉链法 5.建立一个公共溢出区 假设哈希函数的值域为[0,m1],则设向量HashTable[0..m1]为基本表，另外设立存储空间向量OverTable[0..v]用以存储发生冲突的记录。 拉链法的优缺点： 优点： ①拉链法处理冲突简单，且无堆积现象，即非同义词决不会发生冲突，因此平均查找长度较短； ②由于拉链法中各链表上的结点空间是动态申请的，故它更适合于造表前无法确定表长的情况； ③开放定址法为减少冲突，要求装填因子α较小，故当结点规模较大时会浪费很多空间。而拉链法中可取α≥1，且结点较大时，拉链法中增加的指针域可忽略不计，因此节省空间； ④在用拉链法构造的散列表中，删除结点的操作易于实现。只要简单地删去链表上相应的结点即可。而对开放地址法构造的散列表，删除结点不能简单地将被删结 点的空间置为空，否则将截断在它之后填人散列表的同义词结点的查找路径。这是因为各种开放地址法中，空地址单元(即开放地址)都是查找失败的条件。因此在 用开放地址法处理冲突的散列表上执行删除操作，只能在被删结点上做删除标记，而不能真正删除结点。 缺点： 指针需要额外的空间，故当结点规模较小时，开放定址法较为节省空间，而若将节省的指针空间用来扩大散列表的规模，可使装填因子变小，这又减少了开放定址法中的冲突，从而提高平均查找速度。"
  },
  {
    "title": "java基础知识需要注意的一些点",
    "url": "/articles/2019/10/16/1571220427190.html",
    "type": "blog",
    "date": "2019-10-16",
    "topic": "Java 与 JVM",
    "topicSlug": "java-jvm",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Java",
      "面试"
    ],
    "excerpt": "1.看看Integer 你注意到了没 @Test public void testInteger() { System.out.println((\" testInteger method test \")); Integer a =128; Integer b =128; System.out.println(a.equ...",
    "guide": "本文归入「Java 与 JVM」专题，主要记录：1.看看Integer 你注意到了没 @Test public void testInteger() { System.out.println((\" testInteger method test \")); Integer a =128; Integer b =128; System.out.println(a.equ...",
    "content": "1.看看Integer 你注意到了没 @Test public void testInteger() { System.out.println((\" testInteger method test \")); Integer a =128; Integer b =128; System.out.println(a.equals(b)); System.out.println(a==b); Integer c =127; Integer d =127; System.out.println(c.equals(d)); System.out.println(c==d); } 结果： true false true true 为什么？ Integer类型当正整数小于128时是在内存栈中创建值的，并将对象指向这个值， 这样当比较两个栈引用时因为是同一地址引用两者则相等。 当大于127时将会调用new Integer()， 两个整数对象地址引用不相等了。 这就是为什么当值为128时不相等，当值为100时相等了。 2.看看 变量传值的问题 @Test public vo.... 1.看看Integer 你注意到了没 true false true true @Test public void testCheck() { System.out.println((\" testCheck method test \")); int total=0; paramCheck(total); System.out.println(total); String totalStr=\"\"; paramCheck(totalStr); System.out.println(totalStr); User user =new User(\"张三\",12); paramCheck(user); System.out.println(user); java.util.Map map = new HashMap(); paramCheck(map); System.out.println(map); java.util.List list = new ArrayList(); paramCheck(list); System.out.println(list); } private static void paramCheck(int total){ if(total list= Arrays.asList(array); list.add(\"孙六\"); System.out.println(list.size()); } 结果： 为什么？ 因为将数组转换的列表其实不是我们经常使用的arrayList， 但只是数组中内部定义的一种数据结构类型，本质还是原数组而并非列表， 因此当向列表添加元素就会出现错误，这道题上当的兄弟不少吧。 使用iterator 去比较去删除，不会报错，其实用list.remove 删除list 数据也减少了的，如果把异常捕获的话，还是可以看到list的size变少了的，可以试试下面的代码 @Test public void testMkdir() { System.out.println((\" testMkdir method test \")); String path =\"d:/data22/testcreate\"; new File(path).mkdir(); new File(path).mkdirs(); } 结果: 自己试一下把。 mkdirs()可以建立多级文件夹， 而mkdir()只会建立一级的文件夹。 这个主要依靠java底层调用操作系统的实现 5.试试 float 精度问题 testFloat method test 剩余：0.099998474 public static final int ENDNUMBER=Integer.MAXVALUE; public static final int STARTNUMBER=Integer.MAXVALUE2; @Test public void testMax() { System.out.println((\" testMax method test \")); int count=0; for(int i=STARTNUMBER ;i<=ENDNUMBER ;i++){ count++; } System.out.println(count); } 结果：一直再转啊转。然后debug发现，数据i 再最大值加1之后变成负数了。所以一直转。 Integer.MAXVALUE加上1以后的数值是个坑"
  },
  {
    "title": "python利用pyinstaller将项目变成exe可以执行",
    "url": "/articles/2019/10/09/1570609179378.html",
    "type": "blog",
    "date": "2019-10-09",
    "topic": "Python 爬虫与自动化",
    "topicSlug": "python-crawler",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Python 爬虫"
    ],
    "excerpt": "1.安装pyinstaller pip3 install pyinstaller pyinstaller onefile hello.py 2.生成exe 跳到python文件目录下面运行命令 pyinstaller onefile python文件名 onefile的作用是产生的结果汇成一个exe的文件,文件存放再d...",
    "guide": "本文归入「Python 爬虫与自动化」专题，主要记录：1.安装pyinstaller pip3 install pyinstaller pyinstaller onefile hello.py 2.生成exe 跳到python文件目录下面运行命令 pyinstaller onefile python文件名 onefile的作用是产生的结果汇成一个exe的文件,文件存放再d...",
    "content": "1.安装pyinstaller pip3 install pyinstaller pyinstaller onefile hello.py 2.生成exe 跳到python文件目录下面运行命令 pyinstaller onefile python文件名 onefile的作用是产生的结果汇成一个exe的文件,文件存放再dist目录底下。 pyinstaller onefile hello.py 3.执行exe 双击即可执行 1.安装pyinstaller pyinstaller onefile hello.py 2.生成exe 跳到python文件目录下面运行命令 pyinstaller onefile python文件名 onefile的作用是产生的结果汇成一个exe的文件,文件存放再dist目录底下。 3.执行exe 双击即可执行"
  },
  {
    "title": "Rust学习之二猜字谜",
    "url": "/articles/2019/09/24/1569312462439.html",
    "type": "blog",
    "date": "2019-09-24",
    "topic": "工具、效率与博客建设",
    "topicSlug": "tools-blog",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Rust学习"
    ],
    "excerpt": "1.首先cargo一个项目 cargo new guessinggame 2.修改toxml 添加依赖 [dependencies] rand = \"0.3.14\" 3.切换数据源,一来源 对于在国内的人来说，Rust开发时有时使用官方的源太慢，可以考虑更换使用国内中科大的源。更换方法如下： 在&nbsp;$HOME/...",
    "guide": "本文归入「工具、效率与博客建设」专题，主要记录：1.首先cargo一个项目 cargo new guessinggame 2.修改toxml 添加依赖 [dependencies] rand = \"0.3.14\" 3.切换数据源,一来源 对于在国内的人来说，Rust开发时有时使用官方的源太慢，可以考虑更换使用国内中科大的源。更换方法如下： 在&nbsp;$HOME/...",
    "content": "1.首先cargo一个项目 cargo new guessinggame 2.修改toxml 添加依赖 [dependencies] rand = \"0.3.14\" 3.切换数据源,一来源 对于在国内的人来说，Rust开发时有时使用官方的源太慢，可以考虑更换使用国内中科大的源。更换方法如下： 在&nbsp;$HOME/.cargo/config&nbsp;中添加如下内容（如果文件不存在请直接新建该文件）： [source.cratesio] registry = \"https://mirrors.ustc.edu.cn/crates.ioindex\" replacewith = 'ustc' [source.ustc] registry = \"https://mirrors.ustc.edu.cn/crates.ioindex\" 4.引入依赖的api文档 cargo doc open 5.最终代码 use std::io; use std::cmp::Ordering; use rand::Rng; fn main() { println!(\"Guess the.... 1.首先cargo一个项目 2.修改toxml 添加依赖 3.切换数据源,一来源 对于在国内的人来说，Rust开发时有时使用官方的源太慢，可以考虑更换使用国内中科大的源。更换方法如下： 在 $HOME/.cargo/config 中添加如下内容（如果文件不存在请直接新建该文件）： 4.引入依赖的api文档 5.最终代码 效果图 代码已上传"
  },
  {
    "title": "如何定位java进程中使用最耗内存的进程",
    "url": "/articles/2019/09/23/1569230256915.html",
    "type": "blog",
    "date": "2019-09-23",
    "topic": "Java 与 JVM",
    "topicSlug": "java-jvm",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Java",
      "jstack",
      "线程",
      "调优"
    ],
    "excerpt": "1.清除进程和线程的关系 2.知道linux查看进程对应线程的命令 查看进程命令 ps ef |grep java 查看进程对应线程命令 top Hp &lt;pid&gt; 找到最大线程的pid号 3.打印堆栈信息 jstack &lt;pid&gt; jstack 里面存的是16进制的数字。所以需要把十进制转换为1...",
    "guide": "本文归入「Java 与 JVM」专题，主要记录：1.清除进程和线程的关系 2.知道linux查看进程对应线程的命令 查看进程命令 ps ef |grep java 查看进程对应线程命令 top Hp &lt;pid&gt; 找到最大线程的pid号 3.打印堆栈信息 jstack &lt;pid&gt; jstack 里面存的是16进制的数字。所以需要把十进制转换为1...",
    "content": "1.清除进程和线程的关系 2.知道linux查看进程对应线程的命令 查看进程命令 ps ef |grep java 查看进程对应线程命令 top Hp &lt;pid&gt; 找到最大线程的pid号 3.打印堆栈信息 jstack &lt;pid&gt; jstack 里面存的是16进制的数字。所以需要把十进制转换为16进制 printf \"%x\\n\" pid jstack pid |grep 'nid' C5 –color 找到了16进制的pid号。那就直接可以在jstack里搜索找到对应进程信息了，就能找到对应的代码了 生成dump文件： jmap dump:format=b,file=/path/heap.bin 进程ID jmap dump:live,format=b,file=/path/heap.bin 进程ID live参数： 表示我们需要抓取目前在生命周期内的内存对象,也就是说GC收不走的对象,然后我们绝大部分情况下,需要的看的就是这些内存。而且会减小dump文件的大小。 4.案例 背景 1、java 正则表达式回溯造成 CPU 100% .... 1.清除进程和线程的关系 2.知道linux查看进程对应线程的命令 查看进程命令 查看进程对应线程命令 找到最大线程的pid号 3.打印堆栈信息 jstack 里面存的是16进制的数字。所以需要把十进制转换为16进制 找到了16进制的pid号。那就直接可以在jstack里搜索找到对应进程信息了，就能找到对应的代码了 生成dump文件： live参数： 表示我们需要抓取目前在生命周期内的内存对象,也就是说GC收不走的对象,然后我们绝大部分情况下,需要的看的就是这些内存。而且会减小dump文件的大小。 4.案例 背景 1、java 正则表达式回溯造成 CPU 100% 2、线程死锁，程序 hang 住 3、免费实用的脚本工具大礼包 （1）showduplicatejavaclasses （2）findinjars （3）housemd pid [javahome] （4）jvm pid （5）greys[@IP:PORT] （6）sjksjk commands sjk help 工具： showbusyjavathreads.sh（https://github.com/oldratlee/usefulscripts） 示例代码： 3、免费实用的脚本工具大礼包 除了正文提到的 showbusyjavathreads.sh，oldratlee 同学还整合和不少常见的开发、运维过程中涉及到的脚本工具，觉得特别有用的我简单列下： （1）showduplicatejavaclasses 偶尔会遇到本地开发、测试都正常，上线后却莫名其妙的 class 异常，历经千辛万苦找到的原因竟然是 Jar冲突！这个工具就可以找出Java Lib（Java库，即Jar文件）或Class目录（类目录）中的重复类。 Java开发的一个麻烦的问题是Jar冲突（即多个版本的Jar），或者说重复类。会出NoSuchMethod等的问题，还不见得当时出问题。找出有重复类的Jar，可以防患未然。 例如： （2）findinjars 在当前目录下所有jar文件里，查找类或资源文件。 用法：注意，后面Pattern是grep的 扩展正则表达式。 示例： （3）housemd pid [javahome] 很早的时候，我们使用BTrace排查问题，在感叹BTrace的强大之余，也曾好几次将线上系统折腾挂掉。2012年淘宝的聚石写了HouseMD，将常用的几个Btrace脚本整合在一起形成一个独立风格的应用，其核心代码用的是Scala，HouseMD是基于字节码技术的诊断工具, 因此除了Java以外, 任何最终以字节码形式运行于JVM之上的语言, HouseMD都支持对它们进行诊断, 如Clojure(感谢@Killme2008提供了它的使用入门), scala, Groovy, JRuby, Jython, kotlin等. 使用housemd对java程序进行运行时跟踪，支持的操作有： 查看加载类 跟踪方法 查看环境变量 查看对象属性值 详细信息请参考: https://github.com/CSUG/HouseMD/wiki/UserGuideCN （4）jvm pid 执行jvm debug工具，包含对java栈、堆、线程、gc等状态的查看，支持的功能有： 进入jvm工具后可以输入序号执行对应命令 可以一次执行多个命令，用分号\";\"分隔，如：1;3;4;5;6 每个命令可以带参数，用冒号\":\"分隔，同一命令的参数之间用逗号分隔，如： （5）greys[@IP:PORT] PS：目前Greys仅支持Linux/Unix/Mac上的Java6+，Windows暂时无法支持 Greys是一个JVM进程执行过程中的异常诊断工具，可以在不中断程序执行的情况下轻松完成问题排查工作。和HouseMD一样，GreysAnatomy取名同名美剧“实习医生格蕾”，目的是向前辈致敬。代码编写的时候参考了BTrace和HouseMD两个前辈的思路。 使用greys对java程序进行运行时跟踪(不传参数，需要先greys C pid,再greys)。支持的操作有： 查看加载类，方法信息 查看JVM当前基础信息 方法执行监控（调用量，失败率，响应时间等） 方法执行数据观测、记录与回放（参数，返回结果，异常信息等） 方法调用追踪渲染 详细信息请参考: https://github.com/oldmanpushcart/greysanatomy/wiki （6）sjksjk commands sjk help 使用sjk对Java诊断、性能排查、优化工具 ttop:监控指定jvm进程的各个线程的cpu使用情况 jps: 强化版 hh: jmap histo强化版 gc: 实时报告垃圾回收信息 更多信息请参考: https://github.com/aragozin/jvmtools"
  },
  {
    "title": "记一个七牛云生成图片水印的问题",
    "url": "/articles/2019/09/21/1569054780956.html",
    "type": "blog",
    "date": "2019-09-21",
    "topic": "MySQL 与数据架构",
    "topicSlug": "mysql-data",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "故障",
      "base64加密"
    ],
    "excerpt": "1.首先七牛云生成图片是没问题的 2.但诡异的是当图片上水印的文字很长的时候，就会涉及到换行问题。换行呢。有主动换行和被动换行。 主动换行：是我们自主把文字按照一定长度切换成两组文字然后赋值到图片上。 被动换行：就是今天我们遇到的问题，图片加水印然后线上环境app端图片都不显示了。但看后台数据图片是有内容的。在pc端也...",
    "guide": "本文归入「MySQL 与数据架构」专题，主要记录：1.首先七牛云生成图片是没问题的 2.但诡异的是当图片上水印的文字很长的时候，就会涉及到换行问题。换行呢。有主动换行和被动换行。 主动换行：是我们自主把文字按照一定长度切换成两组文字然后赋值到图片上。 被动换行：就是今天我们遇到的问题，图片加水印然后线上环境app端图片都不显示了。但看后台数据图片是有内容的。在pc端也...",
    "content": "1.首先七牛云生成图片是没问题的 2.但诡异的是当图片上水印的文字很长的时候，就会涉及到换行问题。换行呢。有主动换行和被动换行。 主动换行：是我们自主把文字按照一定长度切换成两组文字然后赋值到图片上。 被动换行：就是今天我们遇到的问题，图片加水印然后线上环境app端图片都不显示了。但看后台数据图片是有内容的。在pc端也是能看到的。 图我就不截了。 用户看到的现象是：图片打不开了 程序员看到的现象是: 图片地址已经存入到数据库，但是图片地址有问题，存入到数据库的时候看到库里地址有换行符。 那作为程序员就开始分析为啥会有这个现象了。 1.通过日志找到入库sql，发现入库的时候就有问题。 2.既然入库的时候就有问题，那看这个字段是啥时候生成的。从前端过来的时候是否有问题， 经查找日志，发现从前端过来的时候，没问题， 那就是这个字段被加水印的时候弄坏的，多了空格。加水印是依照七牛的方式base64对图片文字加密。 这里就有问题了，base64加密字符会换行，经查证 据RFC 822规定，每76个字符，还需要加上一个回车换行 就是因为这个回车换行导致的。问题就找到了。 解决方式: 换用Ap.... 1.首先七牛云生成图片是没问题的 2.但诡异的是当图片上水印的文字很长的时候，就会涉及到换行问题。换行呢。有主动换行和被动换行。 主动换行：是我们自主把文字按照一定长度切换成两组文字然后赋值到图片上。 被动换行：就是今天我们遇到的问题，图片加水印然后线上环境app端图片都不显示了。但看后台数据图片是有内容的。在pc端也是能看到的。 图我就不截了。 用户看到的现象是：图片打不开了 程序员看到的现象是: 图片地址已经存入到数据库，但是图片地址有问题，存入到数据库的时候看到库里地址有换行符。 那作为程序员就开始分析为啥会有这个现象了。 1.通过日志找到入库sql，发现入库的时候就有问题。 2.既然入库的时候就有问题，那看这个字段是啥时候生成的。从前端过来的时候是否有问题， 经查找日志，发现从前端过来的时候，没问题， 那就是这个字段被加水印的时候弄坏的，多了空格。加水印是依照七牛的方式base64对图片文字加密。 这里就有问题了，base64加密字符会换行，经查证 据RFC 822规定，每76个字符，还需要加上一个回车换行 就是因为这个回车换行导致的。问题就找到了。 解决方式: 换用Apache的 commonscodec.jar， Base64.encodeBase64String(byte[]）得到的编码字符串是不带换行符的 Base64.encodeBase64String(\"123\".getBytes())..replaceAll(\"[\\\\s\\t\\n\\r]\", \"\");"
  },
  {
    "title": "Rust 学习一之环境安装",
    "url": "/articles/2019/09/21/1568996899251.html",
    "type": "blog",
    "date": "2019-09-21",
    "topic": "工具、效率与博客建设",
    "topicSlug": "tools-blog",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "学习"
    ],
    "excerpt": "1.社区 https://rustlangcn.org/ 2.环境安装 windows 下载地址 https://www.rustlang.org/install.html 下载完之后》rustupinit.exe 直接安装走默认的就可以了 安装完之后看看 版本，确定下是否安装成功了 rustc version 我安装...",
    "guide": "本文归入「工具、效率与博客建设」专题，主要记录：1.社区 https://rustlangcn.org/ 2.环境安装 windows 下载地址 https://www.rustlang.org/install.html 下载完之后》rustupinit.exe 直接安装走默认的就可以了 安装完之后看看 版本，确定下是否安装成功了 rustc version 我安装...",
    "content": "1.社区 https://rustlangcn.org/ 2.环境安装 windows 下载地址 https://www.rustlang.org/install.html 下载完之后》rustupinit.exe 直接安装走默认的就可以了 安装完之后看看 版本，确定下是否安装成功了 rustc version 我安装完，报错了 no default toolchain configured 执行命令 更行版本 rustup update 卸载rust rustup self uninstall 3.hello word 走一波 新建文件main.rs编写程序 fn main() { println!(\"Hello, world!\"); } 然后编译一下 rustc main.rs 生成编译文件 和可执行文件如图 看生成了 main.exe 文件 windows用.\\main.exe 执行一下这个可执行文件。看看效果哈。 熟悉的世界你好。跃然屏幕上。心情很好。没遇到啥问题很好哈 学习了hello word 然后再看看rust的依赖包管理工具cargo 4.hel.... 1.社区 https://rustlangcn.org/ 2.环境安装 windows 下载地址 https://www.rustlang.org/install.html 下载完之后》rustupinit.exe 直接安装走默认的就可以了 安装完之后看看 版本，确定下是否安装成功了 rustc version 我安装完，报错了 no default toolchain configured 执行命令 更行版本 rustup update 卸载rust rustup self uninstall 3.hello word 走一波 新建文件main.rs编写程序 fn main() { println!(\"Hello, world!\"); } 然后编译一下 rustc main.rs 生成编译文件 和可执行文件如图 看生成了 main.exe 文件 windows用.\\main.exe 执行一下这个可执行文件。看看效果哈。 熟悉的世界你好。跃然屏幕上。心情很好。没遇到啥问题很好哈 学习了hello word 然后再看看rust的依赖包管理工具cargo 4.hel.... 1.社区 https://rustlangcn.org/ 2.环境安装 windows 下载地址 https://www.rustlang.org/install.html 下载完之后》rustupinit.exe 直接安装走默认的就可以了 安装完之后看看 版本，确定下是否安装成功了 我安装完，报错了 no default toolchain configured 执行命令 更行版本 卸载rust 3.hello word 走一波 新建文件main.rs编写程序 然后编译一下 rustc main.rs 生成编译文件 和可执行文件如图 看生成了 main.exe 文件 windows用.\\main.exe 执行一下这个可执行文件。看看效果哈。 熟悉的世界你好。跃然屏幕上。心情很好。没遇到啥问题很好哈 学习了hello word 然后再看看rust的依赖包管理工具cargo 4.hello cargo 接着干 Cargo 是 Rust 的构建系统和包管理器，它可以处理很多任务，比如构建代码、下载依赖库并编译这些库。 官方默认是安装了的 version查看一下 5.使用 Cargo 创建项目 运行完这个命令会自动给你生成一个helloword文件的哈。切换到跟目录build一下 效果图如下 cargo.lock文件系统用的，不用管他，也不要修改他 生成的文件在target\\debug下面 熟悉的helloword 又出现了。 接着说下发布。 总结一下啊 1. rust安装 1. rust运行命令 rustc main.rs 1. cargo命令：cargo version, cargo new hellocargo,cargo build,cargo check,cargo run,cargo build release git已上传：https://github.com/jackssybin/rustitems.git 友链：https://blog.csdn.net/jackssybin/article/details/101109616"
  },
  {
    "title": "来来scrapy爬取各大网站每日热点新闻",
    "url": "/articles/2019/09/20/1568913777036.html",
    "type": "blog",
    "date": "2019-09-20",
    "topic": "Python 爬虫与自动化",
    "topicSlug": "python-crawler",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "数据库",
      "Scrapy",
      "Python 爬虫",
      "Python"
    ],
    "excerpt": "一.背景 最近玩爬虫，各种想爬，scrapy又非常好用。想多爬一点东西，决定爬一爬各大网站的热点新闻。 想到就开始做了哈 项目已经爬取： 豆瓣， 微博， 百度贴吧， 虎扑， github，百度今日热点 二.上代码 1.开始搭建项目 scrapy startproject crawleverything 起了个叼叼的名字...",
    "guide": "本文归入「Python 爬虫与自动化」专题，主要记录：一.背景 最近玩爬虫，各种想爬，scrapy又非常好用。想多爬一点东西，决定爬一爬各大网站的热点新闻。 想到就开始做了哈 项目已经爬取： 豆瓣， 微博， 百度贴吧， 虎扑， github，百度今日热点 二.上代码 1.开始搭建项目 scrapy startproject crawleverything 起了个叼叼的名字...",
    "content": "一.背景 最近玩爬虫，各种想爬，scrapy又非常好用。想多爬一点东西，决定爬一爬各大网站的热点新闻。 想到就开始做了哈 项目已经爬取： 豆瓣， 微博， 百度贴吧， 虎扑， github，百度今日热点 二.上代码 1.开始搭建项目 scrapy startproject crawleverything 起了个叼叼的名字 2.修改配置文件 settings.py设置文件: ROBOTSTXTOBEY = False 下载延时 DOWNLOADDELAY = 0.5 增加useragent 这个可以拿自己浏览器的。也可以网上搜一些其他的。东西很多的 USERAGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 1083) AppleWebKit/536.5 (KHTML, like Gecko) Chrome/19.0.1084.54 Safari/536.5' 初步设想，我只需要存取文章的标题和内容链接和抓取时间 修改items.py 那么定义的item如下： class CrawlEverythingItem(.... 一.背景 最近玩爬虫，各种想爬，scrapy又非常好用。想多爬一点东西，决定爬一爬各大网站的热点新闻。 想到就开始做了哈 项目已经爬取： 豆瓣， 微博， 百度贴吧， 虎扑， github，百度今日热点 二.上代码 1.开始搭建项目 2.修改配置文件 settings.py设置文件: 初步设想，我只需要存取文章的标题和内容链接和抓取时间 修改items.py 那么定义的item如下： scrapy genspider doubanspider www.douban.com def parse(self, response): trends=response.css('ul.trend li a') for trend in trends: item = CrawlEverythingItem() item['jktitle']=trend.css('a::text').extractfirst() item['jkurl'] = trend.css('a').attrib['href'] yield item scrapy crawl doubanspider coding: utf8 from scrapy.cmdline import execute import sys import os sys.path.append(os.path.dirname(os.path.abspath(file))) execute(['scrapy', 'crawl', 'doubanspider']) 你需要将此处的doubanspider替换为你自己的爬虫名称 create database crawleverything; drop TABLE articleinfo; CREATE TABLE articleinfo ( articleid bigint(20) NOT NULL AUTOINCREMENT COMMENT '文章id', jksource varchar(50) DEFAULT NULL COMMENT '文章来源', jktitle varchar(200) DEFAULT NULL COMMENT '文章标题', jkurl varchar(200) DEFAULT NULL COMMENT '文章url', jkstatus varchar(50) DEFAULT '0' COMMENT '状态 0:禁用，1:正常', jkremark varchar(500) DEFAULT NULL COMMENT '备注', jkcreate datetime DEFAULT NULL COMMENT '创建时间', PRIMARY KEY (articleid) ) ENGINE=InnoDB AUTOINCREMENT=12 DEFAULT CHARSET=utf8 COMMENT='文章相关'; ITEMPIPELINES = { 'crawleverything.pipelines.CrawlEverythingPipeline': 400 } import pymysql import datetime; import sys; reload(sys); sys.setdefaultencoding(\"utf8\") class CrawlEverythingPipeline(object): def init(self): 连接MySQL数据库 self.connect = pymysql.connect(host='localhost', user='root', password='root1234', db='crawleverything', port=3307) self.cursor = self.connect.cursor() def processitem(self, item, spider): 往数据库里面写入数据 self.cursor.execute( 'INSERT INTO crawleverything.articleinfo( jksource, jktitle, jkurl, jkremark, jkcreate) ' 'VALUES(\"{}\",\"{}\",\"{}\",\"{}\",\"{}\")'.format(item['jksource'], item['jktitle'],item['jkurl'],item['jkremark'],datetime.datetime.now().strftime(\"%Y%m%d %H:%M:%S\")) ) self.connect.commit() return item 关闭数据库 def closespider(self, spider): self.cursor.close() self.connect.close() 再次重新运行主函数，爬取到的数据已经入库 后续在完善:先开门红一个豆瓣。逐步完善 用一个爬虫主类增加了几个网站的爬取， 增加了一个爬虫主类mainCrawlEveryThing.py 数据库增加一个日期字段，修改了创建时间字段。 git已修改，并上传。 git已上传：https://github.com/jackssybin/crawleverything"
  },
  {
    "title": "分库分表方案总览",
    "url": "/articles/2019/09/18/1568819118263.html",
    "type": "blog",
    "date": "2019-09-18",
    "topic": "MySQL 与数据架构",
    "topicSlug": "mysql-data",
    "core": true,
    "priority": 80,
    "readingOrder": 20,
    "tags": [
      "Java",
      "数据库",
      "分库分表",
      "高并发"
    ],
    "excerpt": "这篇文章适合作为数据架构专题的路线文章，帮助判断什么时候需要拆库拆表、怎么选择拆分维度，以及拆分后要面对哪些工程问题。",
    "guide": "核心文章：这篇文章适合作为数据架构专题的路线文章，帮助判断什么时候需要拆库拆表、怎么选择拆分维度，以及拆分后要面对哪些工程问题。",
    "content": "一、数据库瓶颈 1、IO瓶颈 2、CPU瓶颈 二、分库分表 三、分库分表工具 四、分库分表步骤 五、分库分表问题 六、分库分表总结 七、分库分表示例 一、数据库瓶颈 不管是IO瓶颈，还是CPU瓶颈，最终都会导致数据库的活跃连接数增加，进而逼近甚至达到数据库可承载活跃连接数的阈值。 在业务Service来看就是，可用数据库连接少甚至无连接可用。接下来就可以想象了吧（并发量、吞吐量、崩溃）。 1、IO瓶颈 第一种：磁盘读IO瓶颈，热点数据太多，数据库缓存放不下，每次查询时会产生大量的IO，降低查询速度 &gt; 分库和垂直分表。 第二种：网络IO瓶颈，请求的数据太多，网络带宽不够 &gt; 分库。 2、CPU瓶颈 第一种：SQL问题，如SQL中包含join，group by，order by，非索引字段条件查询等，增加CPU运算的操作 &gt; SQL优化，建立合适的索引，在业务Service层进行业务计算。 第二种：单表数据量太大，查询时扫描的行太多，SQL效率低，CPU率先出现瓶颈 &gt; 水平分表。 二、分库分表 1、水平分库 1.概念：以字段为依据，按照一.... 一、数据库瓶颈 1、IO瓶颈 2、CPU瓶颈 二、分库分表 三、分库分表工具 四、分库分表步骤 五、分库分表问题 六、分库分表总结 七、分库分表示例 一、数据库瓶颈 1、IO瓶颈 2、CPU瓶颈 二、分库分表 1、水平分库 1.概念：以字段为依据，按照一定策略（hash、range等），将一个库中的数据拆分到多个库中。 2.结果： 每个库的结构都一样; 每个库的数据都不一样，没有交集; 所有库的并集是全量数据; 3.场景：系统绝对并发量上来了，分表难以根本上解决问题，并且还没有明显的业务归属来垂直分库。 4.分析：库多了，io和cpu的压力自然可以成倍缓解。 2、水平分表 1.概念：以字段为依据，按照一定策略（hash、range等），将一个表中的数据拆分到多个表中。 2.结果： 每个表的结构都一样 每个表的数据都不一样，没有交集; 所有表的并集是全量数据; 3.场景：系统绝对并发量并没有上来，只是单表的数据量太多，影响了SQL效率，加重了CPU负担，以至于成为瓶颈。 4.分析：表的数据量少了，单次SQL执行效率高，自然减轻了CPU的负担。 3、垂直分库 1.概念：以表为依据，按照业务归属不同，将不同的表拆分到不同的库中。 2.结果： 每个库的结构都不一样； 每个库的数据也不一样，没有交集； 所有库的并集是全量数据； 3.场景：系统绝对并发量上来了，并且可以抽象出单独的业务模块。 4.分析：到这一步，基本上就可以服务化了。 例如，随着业务的发展一些公用的配置表、字典表等越来越多，这时可以将这些表拆到单独的库中，甚至可以服务化。再有，随着业务的发展孵化出了一套业务模式，这时可以将相关的表拆到单独的库中，甚至可以服务化。 4、垂直分表 1.概念：以字段为依据，按照字段的活跃性，将表中字段拆到不同的表（主表和扩展表）中。 2.结果： 每个表的结构都不一样； 每个表的数据也不一样，一般来说，每个表的字段至少有一列交集，一般是主键，用于关联数据； 所有表的并集是全量数据； 3.场景：系统绝对并发量并没有上来，表的记录并不多，但是字段多，并且热点数据和非热点数据在一起，单行数据所需的存储空间较大。以至于数据库缓存的数据行减少，查询时会去读磁盘数据产生大量的随机读IO，产生IO瓶颈。 4.分析：可以用列表页和详情页来帮助理解。垂直分表的拆分原则是将热点数据（可能会冗余经常一起查询的数据）放在一起作为主表，非热点数据放在一起作为扩展表。 这样更多的热点数据就能被缓存下来，进而减少了随机读IO。拆了之后，要想获得全部数据就需要关联两个表来取数据。但记住，千万别用join，因为join不仅会增加CPU负担并且会讲两个表耦合在一起（必须在一个数据库实例上）。关联数据，应该在业务Service层做文章，分别获取主表和扩展表数据然后用关联字段关联得到全部数据。 三、分库分表工具 1. shardingsphere：jar，前身是shardingjdbc； 1. TDDL：jar，Taobao Distribute Data Layer； 1. Mycat：中间件。 注：工具的利弊，请自行调研，官网和社区优先。 四、分库分表步骤 根据容量（当前容量和增长量）评估分库或分表个数 选key（均匀） 分表规则（hash或range等） 执行（一般双写） 扩容问题（尽量减少数据的移动）。 五、分库分表问题 1、非partition key的查询问题（水平分库分表，拆分策略为常用的hash法） 端上除了partition key只有一个非partition key作为条件查询 映射法 基因法 注：写入时，基因法生成userid，如图。关于xbit基因，例如要分8张表，23=8，故x取3，即3bit基因。根据userid查询时可直接取模路由到对应的分库或分表。 根据username查询时，先通过usernamecode生成函数生成usernamecode再对其取模路由到对应的分库或分表。id生成常用snowflake算法。 端上除了partition key不止一个非partition key作为条件查询 映射法 冗余法 注：按照orderid或buyerid查询时路由到dbobuyer库中，按照sellerid查询时路由到dboseller库中。感觉有点本末倒置！有其他好的办法吗？改变技术栈呢？ 后台除了partition key还有各种非partition key组合条件查询 NoSQL法 冗余法 2、非partition key跨库跨表分页查询问题（水平分库分表，拆分策略为常用的hash法） 注：用NoSQL法解决（ES等）。 3、扩容问题（水平分库分表，拆分策略为常用的hash法） 1.水平扩容库（升级从库法） 注：扩容是成倍的。 2.水平扩容表（双写迁移法） 第一步：（同步双写）应用配置双写，部署；第二步：（同步双写）将老库中的老数据复制到新库中；第三步：（同步双写）以老库为准校对新库中的老数据；第四步：（同步双写）应用去掉双写，部署； 注：双写是通用方案。 六、分库分表总结 1. 分库分表，首先得知道瓶颈在哪里，然后才能合理地拆分（分库还是分表？水平还是垂直？分几个？）。且不可为了分库分表而拆分。 1. 选key很重要，既要考虑到拆分均匀，也要考虑到非partition key的查询。 1. 只要能满足需求，拆分规则越简单越好。 转载:https://mp.weixin.qq.com/s/i2eXbU1xrqJY51ETIPs0dw"
  },
  {
    "title": "永远记不住不清楚的知识点java",
    "url": "/articles/2019/09/12/1568275296571.html",
    "type": "blog",
    "date": "2019-09-12",
    "topic": "Java 与 JVM",
    "topicSlug": "java-jvm",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Java"
    ],
    "excerpt": "java基础，高并发，面试",
    "guide": "本文归入「Java 与 JVM」专题，主要记录：java基础，高并发，面试",
    "content": "java基础，高并发，面试 java基础，高并发，面试 永远记不住不清楚的知识点java 1，HashMap实现原理，ConcurrentHashMap实现原理。 HashMap，底层hash表，在jdk 1.7以前是数组与链表，jdk1.8以后是链表长度达到8时会演变成红黑树（维持数据的插入和查找的效率平衡）。 ConcurrentHashMap，是hashMap的演变，在jdk 1.7以前是segement分段加锁，为了减少锁竞争。 每次的数据查找经历两次hash，第一次hash先找到segement，第二次hash是查找segement段内的链表位置，在写入数据时对segement加锁. 每个版本查找数据的特殊地方：1.6以前是找到节点数据才加锁（外层调用不加锁），1.7以后都是使用Unsafe.getObjectVolatile。 ConcurrentHashMap 1.8以后是数组和链表，不再使用segement，直接对每个链表进行加锁，更进一步降低锁竞争，put操作是使用了synchronize对当前链表加锁，get是使用Unsafe.getObjectVolatile获取最新的共享内存值（利用cas不加锁），为了保证获取的数据是最新的（可见性） Segement的modCount变更条件：调用put或者remove操作，并且导致元素新增或者被删除，才能引起变化，如果仅仅覆盖或者删除不成功，不会导致变化。 Size()方法：其实就是在每个segement modcount相同情况下（否则马上再次发起重试），再校验count的总数（查两次），如果不同，重试两次，如果还是不同，就对每个segement加锁。 补充：LinkedList、ArrayList，LinkedHashMap LinkedList：底层是基于双向链表（非环状）实现，为什么使用双向链表？为了提高数据的查找效率（包括指定index位置插入），因此内部会根据index和size做比较，决定从头部向后或者尾部向前开始遍历，如当我们调用get(int location)时，首先会比较“location”和“双向链表长度的1/2”；若前者大，则从链表头开始往后查找，直到location位置；否则，从链表末尾开始先前查找，直到location位置。 ArrayList：是基于动态数组实现的，如果空间不够的时候，增加新元素时要动态扩容数组（期间还需要拷贝数据到新数组），删除元素时也需要对后面的数据进行向前移动整合（因为后面还需要使用index搜索数据）。 特点：ArrayList的查找效率高，而增删操作的效率低（只能使用连续的内存空间），使用建议：空间可以申请大一些，尽量不要删除数据。 ArrayList中的modCount，继承于AbstractList，这个成员变量记录着集合的修改次数，也就每次add或者remove它的值都会加1，在使用迭代器遍历集合的时候同时修改集合元素。因为ArrayList被设计成非同步的，因此会抛出异常，实现原理：获取迭代器的时候，会记录一个expectedModCount（不会被改变），在每次迭代过程中会校验expectedModCount和modCount是否相等，否则会抛出异常ConcurrentModificationException LinkedHashMap：继承了HashMap，因此底层还是哈希表结构（数组+链表），但是另外多维护了一个双向环状链表（只有一个头结点），提供了插入有序和访问有序（lru）两种模式，默认为插入有序（打印的结果就是之前的插入顺序），LinkedHashMap重写了的内部addEntry（put调用）方法，重写了Entry，包含before, after，为了将来能构建一个双向的链表，当向map里面添加数据时，在createEntry时，把新创建的Entry加入到双向链表中，之所以使用双向环状链表就是为了实现访问有序，每次访问，都把节点调整到头结点前面（实际上变成了尾节点）。 简单总结：当put元素时，不但要把它加入到HashMap中去，还要加入到双向链表中，所以可以看出LinkedHashMap就是HashMap+双向环状链表 特点：LinkedList查找效率低，增删效率更高，可以利用零碎的内存空间。 2，红黑树，为什么允许局部不平衡 完全平衡二叉树的左右两个子树的高度差的绝对值不超过1，因此每次的节点变更都需要保证树的严格平衡。 红黑树只需要保证从一个节点到该节点的子孙节点的所有路径上包含相同数目的黑节点，因此红黑树是一颗接近完全平衡的二叉树，减少了旋转次数，提高数据的写入效率。 红黑树特点： （1）每个节点或者是黑色，或者是红色。 （2）根节点是黑色。 （3）每个叶子节点（NIL）是黑色。 [注意：这里叶子节点，是指为空(NIL或NULL)的叶子节点！] （4）如果一个节点是红色的，则它的子节点必须是黑色的。 （5）从一个节点到该节点的子孙节点的所有路径上包含相同数目的黑节点。 3，tcp三次握手，四次挥手，为什么不是2次握手？ 三次握手(Threeway Handshake)，是指建立一个TCP连接时，需要客户端和服务器总共发送3个包 TCP是一个双向通信协议，客户端向服务端建立连接需要得到服务端ack响应，意味着客户端向服务端通信正常，此时客户端再给服务端回复一个ack，意味着服务端向客户端通信正常，这样才能正确建立起来双工通信通道，因此两次握手不能保证服务端向客户端通信是否正常。 TCP的连接的拆除需要发送四个包，因此称为四次挥手(fourway handshake)。客户端或服务器均可主动发起挥手动作，在socket编程中，任何一方执行close()操作即可产生挥手操作。 客户端或服务器可以单独关闭向另外一端的通信通道，即为半关闭状态，因此才进行四次挥手。 为什么需要半关闭？比如只需要向一方传输资源，传输完毕以EOF标记即可。 4，tcp和udp的区别，为什么是可靠和不可靠的？ TCP协议是有连接的，有连接的意思是开始传输实际数据之前TCP的客户端和服务器端必须通过三次握手建立连接，会话结束之后也要结束连接。而UDP是无连接的 TCP协议保证数据按序发送，按序到达，提供超时重传来保证可靠性，但是UDP不保证按序到达，甚至不保证到达，只是努力交付，即便是按序发送的序列，也不保证按序送到。 TCP有流量控制和拥塞控制，UDP没有，网络拥堵不会影响发送端的发送速率 TCP是一对一的连接，而UDP则可以支持一对一，多对多，一对多的通信。 TCP面向的是字节流的服务，UDP面向的是报文的服务 TCP的可靠性含义： 接收方收到的数据是完整， 有序， 无差错的。 UDP不可靠性含义： 接收方接收到的数据可能存在部分丢失， 顺序也不一定能保证。 备注：GET和POST还有一个重大区别，简单的说：GET产生一个TCP数据包;POST产生两个TCP数据包。 长的说： 对于GET方式的请求，浏览器会把http header和data一并发送出去，服务器响应200(返回数据); 而对于POST，浏览器先发送header，服务器响应100 continue，浏览器再发送data，服务器响应200 ok(返回数据)。 post请求的过程： （1）浏览器请求tcp连接（第一次握手） （2）服务器答应进行tcp连接（第二次握手） （3）浏览器确认，并发送post请求头（第三次握手，这个报文比较小，所以http会在此时进行第一次数据发送） （4）服务器返回100 Continue响应 （5）浏览器发送数据 （6）服务器返回200 OK响应 get请求的过程： （1）浏览器请求tcp连接（第一次握手） （2）服务器答应进行tcp连接（第二次握手） （3）浏览器确认，并发送get请求头和数据（第三次握手，这个报文比较小，所以http会在此时进行第一次数据发送） （4）服务器返回200 OK响应 也就是说，目测get的总耗是post的2/3左右，这个口说无凭，网上已经有网友进行过测试。 5，TCP滑动窗口和socket缓冲区之间的关系 TCP的滑动窗口大小实际上就是socket的接收缓冲区大小的字节数，“窗口”对应的是一段可以被发送者发送的字节序列，其连续的范围称之为“窗口”；每次成功发送数据之后，发送窗口就会在发送缓冲区中按顺序移动，将新的数据包含到窗口中准备发送。（数据都往窗口写入，因此窗口大小控制数据传输速率，起到一个缓冲的作用） 6，tcp拥塞控制 网络中的链路容量和交换结点中的缓存和处理机都有着工作的极限，当网络的需求超过它们的工作极限时，就出现了拥塞。拥塞控制就是防止过多的数据注入到网络中，这样可以使网络中的路由器或链路不致过载。常用的方法就是： 1. 慢开始、拥塞控制 2. 快重传、快恢复 补充说明：慢开始是指发送方先设置cwnd=1，一次发送一个报文段，随后每经过一个传输轮次，拥塞串口cwnd就加倍，其实增长并不慢，以指数形式增长。还要设定一个慢开始门限，当cwnd门限值，改用拥塞避免算法。拥塞避免算法使cwnd按线性规律缓慢增长。当网络发生延时，门限值减半，拥塞窗口执行慢开始算法。（先指数级别增加，再线性增加，延迟再衰减） 快重传的机制是： 接收方建立这样的机制，如果一个包丢失，则对后续的包继续发送针对该包的重传请求，一旦发送方接收到三个一样的确认，就知道该包之后出现了错误，立刻重传该包； 此时发送方开始执行“快恢复”算法： 慢开始门限减半； cwnd设为慢开始门限减半后的数值； 执行拥塞避免算法（高起点，线性增长） 7"
  },
  {
    "title": "JVM 垃圾回收器",
    "url": "/articles/2019/09/17/1568733889287.html",
    "type": "blog",
    "date": "2019-09-09",
    "topic": "Java 与 JVM",
    "topicSlug": "java-jvm",
    "core": true,
    "priority": 80,
    "readingOrder": 20,
    "tags": [
      "待分类",
      "Java",
      "垃圾回收算法",
      "JVM"
    ],
    "excerpt": "这篇文章承接 JVM 基础，重点放在不同垃圾回收器的设计思路、适用场景和调优取舍。",
    "guide": "核心文章：这篇文章承接 JVM 基础，重点放在不同垃圾回收器的设计思路、适用场景和调优取舍。",
    "content": "2.5 垃圾回收器 收集算法是内存回收的理论，而垃圾回收器是内存回收的实践。 说明：如果两个收集器之间存在连线说明他们之间可以搭配使用。 2.5.1 Serial 收集器 这是一个单线程收集器。意味着它只会使用一个 CPU 或一条收集线程去完成收集工作，并且在进行垃圾回收时必须暂停其它所有的工作线程直到收集结束。 2.5.2 ParNew 收集器 可以认为是 Serial 收集器的多线程版本。 并行：Parallel 指多条垃圾收集线程并行工作，此时用户线程处于等待状态 并发：Concurrent 指用户线程和垃圾回收线程同时执行(不一定是并行，有可能是交叉执行)，用户进程在运行，而垃圾回收线程在另一个 CPU 上运行。 2.5.3 Parallel Scavenge 收集器 这是一个新生代收集器，也是使用复制算法实现，同时也是并行的多线程收集器。 CMS 等收集器的关注点是尽可能地缩短垃圾收集时用户线程所停顿的时间，而 Parallel Scavenge 收集器的目的是达到一个可控制的吞吐量(Throughput = 运行用户代码时间 / (运行用户代码时间 + 垃.... 2.5 垃圾回收器 说明：如果两个收集器之间存在连线说明他们之间可以搭配使用。 2.5.1 Serial 收集器 2.5.2 ParNew 收集器 并行：Parallel 并发：Concurrent 2.5.3 Parallel Scavenge 收集器 CMS 等收集器的关注点是尽可能地缩短垃圾收集时用户线程所停顿的时间，而 Parallel Scavenge 收集器的目的是达到一个可控制的吞吐量(Throughput = 运行用户代码时间 / (运行用户代码时间 + 垃圾收集时间))。 作为一个吞吐量优先的收集器，虚拟机会根据当前系统的运行情况收集性能监控信息，动态调整停顿时间。这就是 GC 的自适应调整策略(GC Ergonomics)。 2.5.4 Serial Old 收集器 2.5.5 Parallel Old 收集器 2.5.6 CMS 收集器 运作步骤: 1. 初始标记(CMS initial mark)：标记 GC Roots 能直接关联到的对象 2. 并发标记(CMS concurrent mark)：进行 GC Roots Tracing 3. 重新标记(CMS remark)：修正并发标记期间的变动部分 4. 并发清除(CMS concurrent sweep) 缺点：对 CPU 资源敏感、无法收集浮动垃圾、标记 —— 清除 算法带来的空间碎片 2.5.7 G1 收集器 优点：并行与并发、分代收集、空间整合、可预测停顿。 运作步骤: 1. 初始标记(Initial Marking) 2. 并发标记(Concurrent Marking) 3. 最终标记(Final Marking) 4. 筛选回收(Live Data Counting and Evacuation) 2.6 内存分配与回收策略 2.6.1 对象优先在 Eden 分配 一般来说 Java 堆的内存模型如下图所示： 新生代 GC (Minor GC) 老年代 GC (Major GC / Full GC) 2.6.2 大对象直接进入老年代 2.6.3 长期存活的对象将进入老年代 2.6.4 动态对象年龄判定 2.6.5 空间分配担保 3. Java 内存模型与线程 3.1 Java 内存模型 3.1.1 主内存和工作内存之间的交互 |操作 |作用对象 |解释 |lock |主内存 |把一个变量标识为一条线程独占的状态 |unlock |主内存 |把一个处于锁定状态的变量释放出来，释放后才可被其他线程锁定 |read |主内存 |把一个变量的值从主内存传输到线程工作内存中，以便 load 操作使用 |load |工作内存 |把 read 操作从主内存中得到的变量值放入工作内存中 |use |工作内存 |把工作内存中一个变量的值传递给执行引擎，每当虚拟机遇到一个需要使用到变量值的字节码指令时将会执行这个操作 |assign |工作内存 |把一个从执行引擎接收到的值赋接收到的值赋给工作内存的变量，每当虚拟机遇到一个给变量赋值的字节码指令时执行这个操作 |store |工作内存 |把工作内存中的一个变量的值传送到主内存中，以便 write 操作 |write |工作内存 |把 store 操作从工作内存中得到的变量的值放入主内存的变量中 3.1.2 对于 volatile 型变量的特殊规则 一个变量被定义为 volatile 的特性： 保证此变量对所有线程的可见性。但是操作并非原子操作，并发情况下不安全。 禁止指令重排序优化。 3.1.3 对于 long 和 double 型变量的特殊规则 3.1.4 原子性、可见性与有序性 原子性(Atomicity) 可见性(Visibility) 有序性(Ordering) 3.1.5 先行发生原则 天然的先行发生关系 3.2 Java 与线程 3.2.1 线程的实现 使用内核线程实现 使用用户线程实现 使用用户线程夹加轻量级进程混合实现 Java 线程实现 3.2.2 Java 线程调度 协同式线程调度 抢占式线程调度 3.2.3 状态转换 五种状态： 新建(new) 运行(Runable) 无限期等待(Waiting) 以下方法会然线程进入无限期等待状态： 1.没有设置 Timeout 参数的 Object.wait() 方法。 2.没有设置 Timeout 参数的 Thread.join() 方法。 3.LookSupport.park() 方法。 限期等待(Timed Waiting) 处于这种状态的线程也不会分配时间，不过无需等待配其他线程显示地唤醒，在一定时间后他们会由系统自动 线程被阻塞了，“阻塞状态”和“等待状态”的区别是：“阻塞状态”在等待着获取一个排他锁，这个时间将在另外一个线程放弃这个锁的时候发生；而“等待状态”则是在等待一段时间，或者唤醒动作的发生。在程序等待进入同步区域的时候，线程将进入这种状态。 已终止线程的线程状态。 虚拟机把描述类的数据从 Class 文件加载到内存，并对数据进行校验、装换解析和初始化，最终形成可以被虚拟机直接使用的 Java 类型 public class SuperClass { static { System.out.println(\"SuperClass init!\"); } public static int value = 1127; } public class SubClass extends SuperClass { static { System.out.println(\"SubClass init!\"); } } public class ConstClass { static { System.out.println(\"ConstClass init!\"); } public static final String HELLOWORLD = \"hello world!\" } public class NotInitialization { public static void main(String[] args) { System.out.println(SubClass.value); / output : SuperClass init! 通过子类引用父类的静态对象不会导致子类的初始化 只有直接定义这个字段的类才会被初始化 / SuperClass[] sca = new SuperClass[10]; / output : 通过数组定义来引用类不会触发此类的初始化 虚拟机在运行时动态创建了一个数组类 / System.out.println(ConstClass.HELLOWORLD); / output : 常量在编译阶段会存入调用类的常量池当中，本质上并没有直接引用到定义类常量的类， 因此不会触发定义常量的类的初始化。 “hello world” 在编译期常量传播优化时已经存储到 NotInitialization 常量池中了。 / } } 是连接的第一步，确保 Class 文件的字节流中包含的信息符合当前虚拟机要求。 这个阶段正式为类分配内存并设置类变量初始值，内存在方法去中分配(含 static 修饰的变量不含实例变量)。 这个阶段是虚拟机将常量池内的符号引用替换为直接引用的过程。 前面过程都是以虚拟机主导，而初始化阶段开始执行类中的 Java 代码。 通过一个类的全限定名来获取描述此类的二进制字节流。 从 Java 虚拟机角度讲，只存在两种类加载器：一种是启动类加载器（C++ 实现，是虚拟机的一部分）；另一种是其他所有类的加载器（Java 实现，独立于虚拟机外部且全继承自 java.lang.ClassLoader） keyword：线程上下文加载器(Thread Context ClassLoader) const char GCCause::tostring(GCCause::Cause cause) { switch (cause) { case javalangsystemgc: return \"System.gc()\"; case fullgcalot: return \"FullGCAlot\"; case scavengealot: return \"ScavengeAlot\"; case allocationprofiler: return \"Allocati"
  },
  {
    "title": "JVM 基础总览",
    "url": "/articles/2019/09/17/1568731586414.html",
    "type": "blog",
    "date": "2019-09-08",
    "topic": "Java 与 JVM",
    "topicSlug": "java-jvm",
    "core": true,
    "priority": 80,
    "readingOrder": 10,
    "tags": [
      "Java",
      "JVM",
      "垃圾回收算法"
    ],
    "excerpt": "这篇文章适合作为 Java 与 JVM 专题的第一站，用来建立运行时数据区、类加载、对象创建和 GC 的基础框架。",
    "guide": "核心文章：这篇文章适合作为 Java 与 JVM 专题的第一站，用来建立运行时数据区、类加载、对象创建和 GC 的基础框架。",
    "content": "1. Java 内存区域与内存溢出异常 1.1 运行时数据区域 根据《Java 虚拟机规范(Java SE 7 版)》规定，Java 虚拟机所管理的内存如下图所示。 1.1.1 程序计数器 内存空间小，线程私有。字节码解释器工作是就是通过改变这个计数器的值来选取下一条需要执行指令的字节码指令，分支、循环、跳转、异常处理、线程恢复等基础功能都需要依赖计数器完成 如果线程正在执行一个 Java 方法，这个计数器记录的是正在执行的虚拟机字节码指令的地址；如果正在执行的是 Native 方法，这个计数器的值则为 (Undefined)。此内存区域是唯一一个在 Java 虚拟机规范中没有规定任何 OutOfMemoryError 情况的区域。 1.1.2 Java 虚拟机栈 线程私有，生命周期和线程一致。描述的是 Java 方法执行的内存模型：每个方法在执行时都会床创建一个栈帧(Stack Frame)用于存储局部变量表、操作数栈、动态链接、方法出口等信息。每一个方法从调用直至执行结束，就对应着一个栈帧从虚拟机栈中入栈到出栈的过程。 局部变量表：存放了编译期可知的各种基本类.... 1. Java 内存区域与内存溢出异常 1.1 运行时数据区域 根据《Java 虚拟机规范(Java SE 7 版)》规定，Java 虚拟机所管理的内存如下图所示。 1.1.1 程序计数器 如果线程正在执行一个 Java 方法，这个计数器记录的是正在执行的虚拟机字节码指令的地址；如果正在执行的是 Native 方法，这个计数器的值则为 (Undefined)。此内存区域是唯一一个在 Java 虚拟机规范中没有规定任何 OutOfMemoryError 情况的区域。 1.1.2 Java 虚拟机栈 局部变量表：存放了编译期可知的各种基本类型(boolean、byte、char、short、int、float、long、double)、对象引用(reference 类型)和 returnAddress 类型(指向了一条字节码指令的地址) StackOverflowError：线程请求的栈深度大于虚拟机所允许的深度。 OutOfMemoryError：如果虚拟机栈可以动态扩展，而扩展时无法申请到足够的内存。 1.1.3 本地方法栈 1.1.4 Java 堆 OutOfMemoryError：如果堆中没有内存完成实例分配，并且堆也无法再扩展时，抛出该异常。 1.1.5 方法区 现在用一张图来介绍每个区域存储的内容。 1.1.6 运行时常量池 1.1.7 直接内存 在 JDK 1.4 中新加入 NIO (New Input/Output) 类，引入了一种基于通道(Channel)和缓存(Buffer)的 I/O 方式，它可以使用 Native 函数库直接分配堆外内存，然后通过一个存储在 Java 堆中的 DirectByteBuffer 对象作为这块内存的引用进行操作。可以避免在 Java 堆和 Native 堆中来回的数据耗时操作。 OutOfMemoryError：会受到本机内存限制，如果内存区域总和大于物理内存限制从而导致动态扩展时出现该异常。 1.2 HotSpot 虚拟机对象探秘 1.2.1 对象的创建 遇到 new 指令时，首先检查这个指令的参数是否能在常量池中定位到一个类的符号引用，并且检查这个符号引用代表的类是否已经被加载、解析和初始化过。如果没有，执行相应的类加载。 类加载检查通过之后，为新对象分配内存(内存大小在类加载完成后便可确认)。在堆的空闲内存中划分一块区域(‘指针碰撞内存规整’或‘空闲列表内存交错’的分配方式)。 前面讲的每个线程在堆中都会有私有的分配缓冲区(TLAB)，这样可以很大程度避免在并发情况下频繁创建对象造成的线程不安全。 内存空间分配完成后会初始化为 0(不包括对象头)，接下来就是填充对象头，把对象是哪个类的实例、如何才能找到类的元数据信息、对象的哈希码、对象的 GC 分代年龄等信息存入对象头。 执行 new 指令后执行 init 方法后才算一份真正可用的对象创建完成。 1.2.2 对象的内存布局 1.2.3 对象的访问定位 通过句柄访问 使用直接指针访问 2. 垃圾回收器与内存分配策略 2.1 概述 2.2 对象已死吗？ 2.2.1 引用计数法 从图中可以看出，如果不下小心直接把 Obj1reference 和 Obj2reference 置 null。则在 Java 堆当中的两块内存依然保持着互相引用无法回收。 2.2.2 可达性分析法 可作为 GC Roots 的对象： 虚拟机栈(栈帧中的本地变量表)中引用的对象 方法区中类静态属性引用的对象 方法区中常量引用的对象 本地方法栈中 JNI(即一般说的 Native 方法) 引用的对象 2.2.3 再谈引用 下面四种引用强度一次逐渐减弱 强引用 软引用 弱引用 虚引用 2.2.4 生存还是死亡 2.2.5 回收方法区 判断废弃常量：一般是判断没有该常量的引用。 判断无用的类：要以下三个条件都满足 该类所有的实例都已经回收，也就是 Java 堆中不存在该类的任何实例 加载该类的 ClassLoader 已经被回收 该类对应的 java.lang.Class 对象没有任何地方呗引用，无法在任何地方通过反射访问该类的方法 永久代垃圾回收主要两部分内容：废弃的常量和无用的类。 2.3 垃圾回收算法 2.3.1 标记 —— 清除算法 两个不足： 效率不高 空间会产生大量碎片 2.3.2 复制算法 2.3.3 标记整理算法 2.3.4 分代回收 新生代 老年代 参考：https://blog.csdn.net/qq41701956/article/details/81664921"
  },
  {
    "title": "爬虫项目集合",
    "url": "/articles/2019/09/17/1568728325035.html",
    "type": "blog",
    "date": "2019-09-07",
    "topic": "Python 爬虫与自动化",
    "topicSlug": "python-crawler",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Python",
      "爬虫"
    ],
    "excerpt": "WechatSogou https://github.com/Chyroc/WechatSogou 微信公众号爬虫。基于搜狗微信搜索的微信公众号爬虫接口，可以扩展成基于搜狗搜索的爬虫，返回结果是列表，每一项均是公众号具体信息字典。 DouBanSpider https://github.com/lanbing510/D...",
    "guide": "本文归入「Python 爬虫与自动化」专题，主要记录：WechatSogou https://github.com/Chyroc/WechatSogou 微信公众号爬虫。基于搜狗微信搜索的微信公众号爬虫接口，可以扩展成基于搜狗搜索的爬虫，返回结果是列表，每一项均是公众号具体信息字典。 DouBanSpider https://github.com/lanbing510/D...",
    "content": "WechatSogou https://github.com/Chyroc/WechatSogou 微信公众号爬虫。基于搜狗微信搜索的微信公众号爬虫接口，可以扩展成基于搜狗搜索的爬虫，返回结果是列表，每一项均是公众号具体信息字典。 DouBanSpider https://github.com/lanbing510/DouBanSpider 豆瓣读书爬虫。可以爬下豆瓣读书标签下的所有图书，按评分排名依次存储，存储到Excel中，可方便大家筛选搜罗，比如筛选评价人数&gt;1000的高分书籍；可依据不同的主题存储到Excel不同的Sheet ，采用User Agent伪装为浏览器进行爬取，并加入随机延时来更好的模仿浏览器行为，避免爬虫被封。 zhihuspider https://github.com/LiuRoy/zhihuspider 知乎爬虫。此项目的功能是爬取知乎用户信息以及人际拓扑关系，爬虫框架使用scrapy，数据存储使用mongo bilibiliuser https://github.com/airingursb/bilibiliuser Bilibili用户爬虫.... WechatSogou https://github.com/Chyroc/WechatSogou 微信公众号爬虫。基于搜狗微信搜索的微信公众号爬虫接口，可以扩展成基于搜狗搜索的爬虫，返回结果是列表，每一项均是公众号具体信息字典。 DouBanSpider https://github.com/lanbing510/DouBanSpider 豆瓣读书爬虫。可以爬下豆瓣读书标签下的所有图书，按评分排名依次存储，存储到Excel中，可方便大家筛选搜罗，比如筛选评价人数1000的高分书籍；可依据不同的主题存储到Excel不同的Sheet ，采用User Agent伪装为浏览器进行爬取，并加入随机延时来更好的模仿浏览器行为，避免爬虫被封。 zhihuspider https://github.com/LiuRoy/zhihuspider 知乎爬虫。此项目的功能是爬取知乎用户信息以及人际拓扑关系，爬虫框架使用scrapy，数据存储使用mongo bilibiliuser https://github.com/airingursb/bilibiliuser Bilibili用户爬虫。总数据数：20119918，抓取字段：用户id，昵称，性别，头像，等级，经验值，粉丝数，生日，地址，注册时间，签名，等级与经验值等。抓取之后生成B站用户数据报告。 SinaSpider https://github.com/LiuXingMing/SinaSpider 新浪微博爬虫。主要爬取新浪微博用户的个人信息、微博信息、粉丝和关注。代码获取新浪微博Cookie进行登录，可通过多账号登录来防止新浪的反扒。主要使用 scrapy 爬虫框架。 distributecrawler https://github.com/gnemoug/distributecrawler 小说下载分布式爬虫。使用scrapy,Redis, MongoDB,graphite实现的一个分布式网络爬虫,底层存储mongodb集群,分布式使用redis实现,爬虫状态显示使用graphite实现，主要针对一个小说站点。 CnkiSpider https://github.com/yanzhou/CnkiSpider 中国知网爬虫。设置检索条件后，执行src/CnkiSpider.py抓取数据，抓取数据存储在/data目录下，每个数据文件的第一行为字段名称。 LianJiaSpider https://github.com/lanbing510/LianJiaSpider 链家网爬虫。爬取北京地区链家历年二手房成交记录。涵盖链家爬虫一文的全部代码，包括链家模拟登录代码。 scrapyjingdong https://github.com/taizilongxu/scrapyjingdong 京东爬虫。基于scrapy的京东网站爬虫，保存格式为csv。 QQGroupsSpider https://github.com/caspartse/QQGroupsSpider QQ 群爬虫。批量抓取 QQ 群信息，包括群名称、群号、群人数、群主、群简介等内容，最终生成 XLS(X) / CSV 结果文件。 wooyunpublic https://github.com/hanc00l/wooyunpublic 乌云爬虫。 乌云公开漏洞、知识库爬虫和搜索。全部公开漏洞的列表和每个漏洞的文本内容存在mongodb中，大概约2G内容；如果整站爬全部文本和图片作为离线查询，大概需要10G空间、2小时（10M电信带宽）；爬取全部知识库，总共约500M空间。漏洞搜索使用了Flask作为web server，bootstrap作为前端。 findtrip https://github.com/fankcoder/findtrip 机票爬虫（去哪儿和携程网）。Findtrip是一个基于Scrapy的机票爬虫，目前整合了国内两大机票网站（去哪儿 + 携程）。 163spider https://github.com/leyle/163spider 基于requests、MySQLdb、torndb的网易客户端内容爬虫 doubanspiders https://github.com/fanpei91/doubanspiders 豆瓣电影、书籍、小组、相册、东西等爬虫集 QQSpider https://github.com/LiuXingMing/QQSpider QQ空间爬虫，包括日志、说说、个人信息等，一天可抓取 400 万条数据。 baidumusicspider https://github.com/ShuJi/baidumusicspider 百度mp3全站爬虫，使用redis支持断点续传。 tbcrawler https://github.com/pakoo/tbcrawler 淘宝和天猫的爬虫,可以根据搜索关键词,物品id来抓去页面的信息，数据存储在mongodb。 stockholm https://github.com/benitoro/stockholm 一个股票数据（沪深）爬虫和选股策略测试框架。根据选定的日期范围抓取所有沪深两市股票的行情数据。支持使用表达式定义选股策略。支持多线程处理。保存数据到JSON文件、CSV文件。 BaiduyunSpider https://github.com/k1995/BaiduyunSpider 百度云盘爬虫。 Spider https://github.com/Qutan/Spider 社交数据爬虫。支持微博,知乎,豆瓣。 proxy pool https://github.com/jhao104/proxypool python爬虫代理IP池(proxy pool)。 music163 https://github.com/RitterHou/music163 爬取网易云音乐所有歌曲的评论。 jandanspider https://github.com/kulovecc/jandanspider 爬取煎蛋妹纸图片。 CnblogsSpider https://github.com/jackgitgz/CnblogsSpider cnblogs列表页爬虫。 spidersmooc https://github.com/qiyeboy/spidersmooc 爬取慕课网视频。 CnkiSpider https://github.com/yanzhou/CnkiSpider 中国知网爬虫。 knowsecSpider2 https://github.com/littlethunder/knowsecSpider2 知道创宇爬虫题目。 aissspider https://github.com/xspiders/aissspider 爱丝APP图片爬虫，以及免支付破解VIP看图。 SinaSpider https://github.com/szcfweiya/SinaSpider 动态IP解决新浪的反爬虫机制，快速抓取内容。 csdnspider https://github.com/Kevinsss/csdnspider 爬取CSDN上的博客文章。 ProxySpider https://github.com/changetjut/ProxySpider 爬取西刺上的代理IP，并验证代理可用性"
  },
  {
    "title": "实战5抓取猫眼电影榜单信息（requests+多进程）",
    "url": "/articles/2019/09/17/1568727178145.html",
    "type": "blog",
    "date": "2019-09-06",
    "topic": "Python 爬虫与自动化",
    "topicSlug": "python-crawler",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Python 爬虫",
      "Python"
    ],
    "excerpt": "1.目标网址https://maoyan.com/board/4?offset=0 一、引入相应的模块并编写获取源码的函数 import requests, re, json from lxml import etree from multiprocessing import Pool 获取源码 def gethtml...",
    "guide": "本文归入「Python 爬虫与自动化」专题，主要记录：1.目标网址https://maoyan.com/board/4?offset=0 一、引入相应的模块并编写获取源码的函数 import requests, re, json from lxml import etree from multiprocessing import Pool 获取源码 def gethtml...",
    "content": "1.目标网址https://maoyan.com/board/4?offset=0 一、引入相应的模块并编写获取源码的函数 import requests, re, json from lxml import etree from multiprocessing import Pool 获取源码 def gethtml(url): headers = {'UserAgent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'} response = requests.get(url=url, headers=headers) return response.text 二、使用肉眼大法观察源码并且编写解析信息函数： 代码如下 ( 这里使用两种方式进行解析：XPath 和 正则&nbsp;)： 获取内容信息 def parsehtml(html): selector = etree.HTML(htm.... 1.目标网址https://maoyan.com/board/4?offset=0 一、引入相应的模块并编写获取源码的函数 二、使用肉眼大法观察源码并且编写解析信息函数： 代码如下 ( 这里使用两种方式进行解析：XPath 和 正则 )： 三、编写一个将数据放入本地文件的函数： 四、再编写一个主函数用语调用其他函数： 执行后效果图如下： 11.png 五、接下来开始引入多进程，我们对 文件入口 分支结构做如下修改即可： 运行后发现得到同样的效果，并且速度很快"
  },
  {
    "title": "实战4Scrapy自动爬取腾讯招聘职位信息",
    "url": "/articles/2019/09/17/1568651606327.html",
    "type": "blog",
    "date": "2019-09-05",
    "topic": "Python 爬虫与自动化",
    "topicSlug": "python-crawler",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Scrapy",
      "Python 爬虫"
    ],
    "excerpt": "创建爬虫项目: scrapy startproject 项目名 scrapy startproject tencent 查看当前可以使用的爬虫模板: scrapy genspider l 基于任意模板生成一个爬虫文件: scrapy genspider t 模板 自定义爬虫名 域名 scrapy genspider t...",
    "guide": "本文归入「Python 爬虫与自动化」专题，主要记录：创建爬虫项目: scrapy startproject 项目名 scrapy startproject tencent 查看当前可以使用的爬虫模板: scrapy genspider l 基于任意模板生成一个爬虫文件: scrapy genspider t 模板 自定义爬虫名 域名 scrapy genspider t...",
    "content": "创建爬虫项目: scrapy startproject 项目名 scrapy startproject tencent 查看当前可以使用的爬虫模板: scrapy genspider l 基于任意模板生成一个爬虫文件: scrapy genspider t 模板 自定义爬虫名 域名 scrapy genspider t basic tencentSpider careers.tencent.com 执行爬虫文件(后面有：nolog 表示不打印日记): scrapy crawl 爬虫名 nolog 我们打开腾讯招聘网页，并观察切换页面时候的变化以及我们需要爬取的信息字段的效果图如下： 修改了实体文件之后，我们在观察需要提取数据的标签特点，效果图如下： 从途中可以看到，我们需要的数据都在 tr 标签中，但是细心的同学会发现，由于这些列表是斑马线的颜色，因此他们有两个不同的 class 属性类型，好了，我们现在Spisers 文件夹下创建一个基于 basic 模板的爬虫文件并处理爬取操作： coding: utf8 import scrapy from.... 创建爬虫项目: scrapy startproject 项目名 scrapy startproject tencent 查看当前可以使用的爬虫模板: scrapy genspider l 基于任意模板生成一个爬虫文件: scrapy genspider t 模板 自定义爬虫名 域名 scrapy genspider t basic tencentSpider careers.tencent.com 执行爬虫文件(后面有：nolog 表示不打印日记): scrapy crawl 爬虫名 nolog 我们打开腾讯招聘网页，并观察切换页面时候的变化以及我们需要爬取的信息字段的效果图如下： 修改了实体文件之后，我们在观察需要提取数据的标签特点，效果图如下： 从途中可以看到，我们需要的数据都在 tr 标签中，但是细心的同学会发现，由于这些列表是斑马线的颜色，因此他们有两个不同的 class 属性类型，好了，我们现在Spisers 文件夹下创建一个基于 basic 模板的爬虫文件并处理爬取操作： 激活管道组件 ITEMPIPELINES = { 'tencent.pipelines.TencentPipeline': 300, } 为防止网站反爬，我们可以设置文件的相应配置： 万事俱备，接下来我们执行以下我们的爬虫文件(注意：执行的爬虫名字是爬虫文件里的名字而非爬虫文件名)后其中的最终效果图如下： 到目前为止项目基本完成，其实如果我们想自动爬取所有信息并且网页上有翻页按钮即“下一页”的时候，我们可以使用以下方式进行实现： 参考:https://www.jianshu.com/p/6935b36fd86c"
  },
  {
    "title": "实战3Selenium的基本使用-登录知乎并爬取信息",
    "url": "/articles/2019/09/16/1568647646783.html",
    "type": "blog",
    "date": "2019-09-04",
    "topic": "Python 爬虫与自动化",
    "topicSlug": "python-crawler",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Python 爬虫",
      "Scrapy"
    ],
    "excerpt": "由于 JavaScript 动态渲染的页面不止 Ajax 这一种，有些网站获取数据并不包含Ajax请求，有些网站是对 Ajax 进行加密处理；为了解决这写问题，我们可以直接使用模拟浏览器运行的方式来实现，这样就可以做到在浏览器中看到是什么样，抓取的源码就是什么样，也就可见即可抓。 Python提供了许多模拟浏览器运行的...",
    "guide": "本文归入「Python 爬虫与自动化」专题，主要记录：由于 JavaScript 动态渲染的页面不止 Ajax 这一种，有些网站获取数据并不包含Ajax请求，有些网站是对 Ajax 进行加密处理；为了解决这写问题，我们可以直接使用模拟浏览器运行的方式来实现，这样就可以做到在浏览器中看到是什么样，抓取的源码就是什么样，也就可见即可抓。 Python提供了许多模拟浏览器运行的...",
    "content": "由于 JavaScript 动态渲染的页面不止 Ajax 这一种，有些网站获取数据并不包含Ajax请求，有些网站是对 Ajax 进行加密处理；为了解决这写问题，我们可以直接使用模拟浏览器运行的方式来实现，这样就可以做到在浏览器中看到是什么样，抓取的源码就是什么样，也就可见即可抓。 Python提供了许多模拟浏览器运行的库，如 Selenium、Splash、PyV8、Ghost 等；我们接下来以 Selenium为例，那么要使用的话我们就必须要做相应的安装，这里要注意一点的是由于我们操作的是 谷歌浏览器，因此再使用这个库之前必须要先安装好 谷歌浏览器以及操作浏览器的驱动执行文件。 一、操作前准备 安装谷歌浏览器 通过命令安装库：pip install selenium 下载谷歌浏览器驱动并配置环境变量 http://npm.taobao.org/mirrors/chromedriver/ 二、基本操作 自动打开百度首页并休眠几秒钟后自动关闭 from selenium import webdriver import time driver = webdriver.Chrome() .... 由于 JavaScript 动态渲染的页面不止 Ajax 这一种，有些网站获取数据并不包含Ajax请求，有些网站是对 Ajax 进行加密处理；为了解决这写问题，我们可以直接使用模拟浏览器运行的方式来实现，这样就可以做到在浏览器中看到是什么样，抓取的源码就是什么样，也就可见即可抓。 Python提供了许多模拟浏览器运行的库，如 Selenium、Splash、PyV8、Ghost 等；我们接下来以 Selenium为例，那么要使用的话我们就必须要做相应的安装，这里要注意一点的是由于我们操作的是 谷歌浏览器，因此再使用这个库之前必须要先安装好 谷歌浏览器以及操作浏览器的驱动执行文件。 一、操作前准备 安装谷歌浏览器 通过命令安装库：pip install selenium 下载谷歌浏览器驱动并配置环境变量 http://npm.taobao.org/mirrors/chromedriver/ 二、基本操作 自动打开百度首页并休眠几秒钟后自动关闭 执行代码后即可看到如下效果： 接下来我们以一下网页操作为例子（代码中有详细的注释）,先看网页效果： 操作代码如下(注：操作的组件即属性的话在源码中查看)： objectivec from selenium import webdriver import time driver = webdriver.Chrome() 创建实例 driver.get(\"http://www.baidu.com\") 请求百度首页 time.sleep(6) 睡眠六秒 driver.quit() 退出浏览器 browser = webdriver.Chrome() browser.get(\"https://3416230579.github.io/page/index.html\") 操作一 elemt = browser.findelementbyid(\"elementid\") 根据 id 获取对象 elemt = browser.findelementbyname(\"elementid\") 根据 name 获取对象 print(elemt.tagname) 返回标签名 print(elemt.text) 返回标签的值 elemt.sendkeys(\"哈哈哈\")给标签输入值 操作二 elemt = browser.findelementbylinktext(\"findelementbylinktext\") print(elemt.tagname) 返回标签名 print(elemt.text) 返回标签的值 elemt.click()点击 操作三 利用 css选择器 获取 class='highlight' 标签对象并自动填值 elemt = browser.findelementbycssselector(\".highlight\") elemt.sendkeys(\"啦啦啦\") 利用 xpath 获取 id='xpathname' 标签对象并自动填值 elemt = browser.findelementbyxpath(r'//[@id=\"xpathname\"]') elemt.sendkeys(\"我的 xpath\") 操作四 获取跳转后页面的源码 time.sleep(2) elemt = browser.findelementbylinktext(\"findelementbylinktext\") elemt.click() browser.switchtowindow(browser.windowhandles[1]) print(browser.pagesource) 操作五 操作弹出框 time.sleep(2) elem = browser.findelementbytagname(\"button\") elem.click() time.sleep(2) browser.switchtoalert().accept() 切换到弹出框操作 操作六 跳转和回退操作 time.sleep(2) elem = browser.findelementbylinktext(\"forwardback\") elem.click() 点击跳转 time.sleep(1) browser.back() 点击回退 time.sleep(2) browser.forward() 调到上一次点击 time.sleep(1) browser.back() 回退 操作七 Cookies 的操作 browser = webdriver.Chrome() browser.get(\"https://www.baidu.com\") print(browser.getcookies()) 输出全部的 cookie 的信息 添加一个 cookie browser.addcookie({\"name\":\"luchangyin\", \"domian\":\"www.baidu.com\",\"value\":\"肥牛冲天\"}) print(browser.getcookies()) browser.deleteallcookies() 全部删除 print(browser.getcookies()) 操作八 自动打开百度并根据关键字搜索相关的内容 from selenium.webdriver.common.keys import Keys browser = webdriver.Chrome() browser.get(\"https://www.baidu.com\") elem = browser.findelementbyid(\"kw\") elem.sendkeys(\"python爬虫\") 输入 time.sleep(2) 休眠 elem.sendkeys(Keys.RETURN) 回车 time.sleep(3) browser.quit() 关闭 from selenium import webdriver import time from selenium.webdriver.common.keys import Keys from selenium.webdriver.support.ui import WebDriverWait from selenium.webdriver.support import expectedconditions as EC from selenium.common.exceptions import TimeoutException, NoSuchElementException 声明浏览器对象 browser = webdriver.Chrome() browser.get(\"https://www.zhihu.com/signin\") def loginzhihu(browser): try: 获取登录用户名 elem = browser.findelementbyname(\"username\") elem.clear() 清空 elem.sendkeys(\"用户名\") 自动填值 elem.sendkeys(Keys.RETURN)回车 time.sleep(3) 获取登录密码 elem = browser.findelementbyname(\"password\") elem.clear() elem.sendkeys(\"密码\") elem.sendkeys(Keys.RETURN)回车 time.sleep(2) print(\"开始登陆...\") Button SignFlowsubmitButton Buttonprimary Buttonblue elem = browser.findelementbycssselector(\".Button.SignFlowsubmitButton.Buttonprimary.Buttonblue\") elem = browser.findelementbyxpath(r'//button[@class=\"Button SignFlowsubmitButton Buttonprimary Buttonblue\"]') elem.click() print(\"开始休眠...\") 显示等待 选择“首页”选项 element = WebDriverWait(browser, 15).until(EC.titlec"
  },
  {
    "title": "实战2之爬取表情包",
    "url": "/articles/2019/09/16/1568643753095.html",
    "type": "blog",
    "date": "2019-09-03",
    "topic": "Python 爬虫与自动化",
    "topicSlug": "python-crawler",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Python",
      "Scrapy"
    ],
    "excerpt": "一、爬取表情包思路（http://www.doutula.com） 1、打开网站，点击最新套图 2、之后我们可以看到没有套图，我们需要提取每个套图的连接 3、获取连接之后，进入页面提取图片就好了 4、我们可以发现该网站还穿插有广告，我们需要过滤点广告 二、实战 关于新建项目我们就不再多说了。 1、首先我们提取第一页的u...",
    "guide": "本文归入「Python 爬虫与自动化」专题，主要记录：一、爬取表情包思路（http://www.doutula.com） 1、打开网站，点击最新套图 2、之后我们可以看到没有套图，我们需要提取每个套图的连接 3、获取连接之后，进入页面提取图片就好了 4、我们可以发现该网站还穿插有广告，我们需要过滤点广告 二、实战 关于新建项目我们就不再多说了。 1、首先我们提取第一页的u...",
    "content": "一、爬取表情包思路（http://www.doutula.com） 1、打开网站，点击最新套图 2、之后我们可以看到没有套图，我们需要提取每个套图的连接 3、获取连接之后，进入页面提取图片就好了 4、我们可以发现该网站还穿插有广告，我们需要过滤点广告 二、实战 关于新建项目我们就不再多说了。 1、首先我们提取第一页的url 通过上图我们可以发现我们想要的url全在class名为colsm9的div下， 红色框的部分为广告。不是a标签，所以我们就不用过滤了。我们直接选取colsm9下的直接子节点即可 写下如下代码： 值得注意的是在settings.py中需要添加头信息和将robots.txt协议修改为False 我们打上断点调试一下： 我们发现我们想要的信息已经提取出来了。 注意：在Request中的mate参数，是用来传递参数的，传递给下一个方法使用。使用方法和字典相似。 2、完善item 我们只需要三个字段，什么系列，图片url，图片名称。 3、提取item中我们需要的字段 4、下一页 5、保存 因为对scrapy保存图片没有研究，所以就自己写保存图片的方法。 .... 一、爬取表情包思路（http://www.doutula.com） 1、打开网站，点击最新套图 2、之后我们可以看到没有套图，我们需要提取每个套图的连接 3、获取连接之后，进入页面提取图片就好了 4、我们可以发现该网站还穿插有广告，我们需要过滤点广告 二、实战 关于新建项目我们就不再多说了。 1、首先我们提取第一页的url 通过上图我们可以发现我们想要的url全在class名为colsm9的div下， 红色框的部分为广告。不是a标签，所以我们就不用过滤了。我们直接选取colsm9下的直接子节点即可 写下如下代码： 值得注意的是在settings.py中需要添加头信息和将robots.txt协议修改为False 我们打上断点调试一下： 我们发现我们想要的信息已经提取出来了。 注意：在Request中的mate参数，是用来传递参数的，传递给下一个方法使用。使用方法和字典相似。 2、完善item 我们只需要三个字段，什么系列，图片url，图片名称。 3、提取item中我们需要的字段 4、下一页 5、保存 因为对scrapy保存图片没有研究，所以就自己写保存图片的方法。 在pipelines.py种添加如下代码： 并且在settings.py中添加： 6、运行 直接报错，所以我们在settings.py添加头信息 运行一段时候后又报错了，看来需要随机更换表头信息。 这里我们使用第三方库很方便，pip3 install fakeuseragent 安装成功后我们在middlewares.py中导入：from fakeuseragent import UserAgent 添加如下代码： 在settings.py文件中添加 运行main文件： 即可。 小结： 效果图： 问题： 在运行过程中遇到了四个问题： 1、没有获取大到图片连接： 可能这个网站有两个版本获取的css方式不一样。 解决方法：可以使用xpath中的|（或）来解决 2、没有获取到图片名称 解决方法：同上 3、图片名称相同 解决方法：可以使用md5加密后添加，你也可以使用你自己的方法 4、在图片名中含有？/\\等非法字符 解决方法：可以通过正则过滤，如果md5加密，那么一下解决两个问题。 虽然有些图片没有获取到，但是还是爬取了很多。有兴趣的可以尝试去修改。 完。"
  },
  {
    "title": "实战1爬取百度贴吧图片",
    "url": "/articles/2019/09/16/1568643605581.html",
    "type": "blog",
    "date": "2019-09-02",
    "topic": "Python 爬虫与自动化",
    "topicSlug": "python-crawler",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Python",
      "Python 爬虫"
    ],
    "excerpt": "1，目标： 爬取贴吧每一贴，楼主图，并保存。 由于图片大多是楼主发的，如果全部查找会浪费很多时间。 2，分析 我选择爬取的贴吧为图吧，你们可以选择自己想要爬取的贴吧。 2.1，获取页面 我们将爬取页面的代码写成一个gethtml()方法,给他传入url参数 代码如图： 获取正常，没问题。 我们用chrome的开发者模式...",
    "guide": "本文归入「Python 爬虫与自动化」专题，主要记录：1，目标： 爬取贴吧每一贴，楼主图，并保存。 由于图片大多是楼主发的，如果全部查找会浪费很多时间。 2，分析 我选择爬取的贴吧为图吧，你们可以选择自己想要爬取的贴吧。 2.1，获取页面 我们将爬取页面的代码写成一个gethtml()方法,给他传入url参数 代码如图： 获取正常，没问题。 我们用chrome的开发者模式...",
    "content": "1，目标： 爬取贴吧每一贴，楼主图，并保存。 由于图片大多是楼主发的，如果全部查找会浪费很多时间。 2，分析 我选择爬取的贴吧为图吧，你们可以选择自己想要爬取的贴吧。 2.1，获取页面 我们将爬取页面的代码写成一个gethtml()方法,给他传入url参数 代码如图： 获取正常，没问题。 我们用chrome的开发者模式来分析每个贴的连接，用定位定位一个帖子，这样方便我们快速的去查找我们想要的信息。 如图： 2.2利用正则表达式找出我们想要的连接 通过查找，我们发现每个贴都是在class=“col2right jthrealistli/right”下 我们可以让他成为一个标志位，通过它继续往下找，他有两个类名，我们选择后者即可。 &lt;div.?jthreadlistliright.?&gt;.?&lt;a.?href=\"(.?)\".?&gt;(.?) 返回的是一个数组，为了好看我们以字典的方式返回，用yield我们可以理解为返回值，在python基础里会讲，我们将获取的页面作为参数传进去，实现geturl方法。 如图： 我们来打印一下，看一下获取的是什么？ .... 1，目标： 爬取贴吧每一贴，楼主图，并保存。 由于图片大多是楼主发的，如果全部查找会浪费很多时间。 2，分析 我选择爬取的贴吧为图吧，你们可以选择自己想要爬取的贴吧。 2.1，获取页面 我们将爬取页面的代码写成一个gethtml()方法,给他传入url参数 代码如图： 获取正常，没问题。 我们用chrome的开发者模式来分析每个贴的连接，用定位定位一个帖子，这样方便我们快速的去查找我们想要的信息。 如图： 2.2利用正则表达式找出我们想要的连接 通过查找，我们发现每个贴都是在class=“col2right jthrealistli/right”下 我们可以让他成为一个标志位，通过它继续往下找，他有两个类名，我们选择后者即可。 .? (.?) 返回的是一个数组，为了好看我们以字典的方式返回，用yield我们可以理解为返回值，在python基础里会讲，我们将获取的页面作为参数传进去，实现geturl方法。 如图： 我们来打印一下，看一下获取的是什么？ 结果如图： 很明显，我们需要来拼接一下，获取完整的url，我们点击一个进入，可以发现，url是这样的：https://tieba.baidu.com/p/5768252315，我们得到了后半部分，那就容易了，只需要拼接一下，得到的结果就变成了： 得到链接后，我们需要再次发送请求，获取到每个贴的内容，即调用我们上面写好的gethtml()方法即可。 2.3找到每个帖子楼主发的图片链接 同样的方式，打开开发者模式，找的图片，找出标志位，写出正则，这里就不详细说了，正则为： 实现getimgurl()方法： 结果图为： 2.4获取到图片地址后，自然是要下载下来实现writetofile()方法 下载图片，在上篇文章上已经有实例， 连接：python第二大神器requests 这里直接上代码图： 里面的正则是用来作为图片名字的，time.sleep(2)是为了爬取慢点 太快会无响应或者报错。 下面我们试一下效果： 我们来修改一下，来爬取第一页贴种的所有贴，获取楼主贴的总页数 和上面同样的方式找到总页数，并写出获取总页数的正则： 实现getye方法，同时点击只看楼主，url会多出seelz=1 如图： 2.5由于有些贴吧的贴子很多，我们就选择获取前十页内容，当然你也可以写个方法换取所有页 这里就不实例了，在贴吧里点击下一页我们发现url多出pn=50，由此我们知道50为偏移量，即一页有50个帖子pn=n 是n+1到n+50帖子 2.6整合一下代码，我们用main()方法来调用上面的方法。 如图： 3.0完"
  },
  {
    "title": "Scrapy 框架入门",
    "url": "/articles/2019/09/16/1568641811471.html",
    "type": "blog",
    "date": "2019-09-01",
    "topic": "Python 爬虫与自动化",
    "topicSlug": "python-crawler",
    "core": true,
    "priority": 80,
    "readingOrder": 10,
    "tags": [
      "Scrapy",
      "Python"
    ],
    "excerpt": "这篇文章适合作为 Python 爬虫专题的路线入口，先建立 Scrapy 项目结构、Spider、Item 和 Pipeline 的基础认识。",
    "guide": "核心文章：这篇文章适合作为 Python 爬虫专题的路线入口，先建立 Scrapy 项目结构、Spider、Item 和 Pipeline 的基础认识。",
    "content": "一、简单实例，了解基本。 1、安装Scrapy框架 这里如果直接pip3 install scrapy可能会出错。 所以你可以先安装lxml：pip3 install lxml(已安装请忽略)。 安装pyOpenSSL：在官网下载wheel文件。 安装Twisted：在官网下载wheel文件。 安装PyWin32：在官网下载wheel文件。 下载地址：https://www.lfd.uci.edu/gohlke/pythonlibs/ 配置环境变量：将scrapy所在目录添加到系统环境变量即可。 ctrl+f搜索即可。 最后安装scrapy，pip3 install scrapy 2、创建一个scrapy项目 新创建一个目录，按住shift右键在此处打开命令窗口 输入：scrapy startproject tutorial即可创建一个tutorial文件夹 文件夹目录如下： |tutorial |scrapy.cfg &nbsp; |init.py &nbsp; |items.py &nbsp; |middlewares.py &nbsp; |pipelin.... 一、简单实例，了解基本。 1、安装Scrapy框架 这里如果直接pip3 install scrapy可能会出错。 所以你可以先安装lxml：pip3 install lxml(已安装请忽略)。 安装pyOpenSSL：在官网下载wheel文件。 安装Twisted：在官网下载wheel文件。 安装PyWin32：在官网下载wheel文件。 下载地址：https://www.lfd.uci.edu/gohlke/pythonlibs/ 配置环境变量：将scrapy所在目录添加到系统环境变量即可。 ctrl+f搜索即可。 最后安装scrapy，pip3 install scrapy 2、创建一个scrapy项目 新创建一个目录，按住shift右键在此处打开命令窗口 输入：scrapy startproject tutorial即可创建一个tutorial文件夹 文件夹目录如下： 文件的功能： scrapy.cfg：配置文件 spiders：存放你Spider文件，也就是你爬取的py文件 items.py：相当于一个容器，和字典较像 middlewares.py：定义Downloader Middlewares(下载器中间件)和Spider Middlewares(蜘蛛中间件)的实现 pipelines.py:定义Item Pipeline的实现，实现数据的清洗，储存，验证。 settings.py：全局配置 3、创建一个spider（自己定义的爬虫文件） 例如以爬取猫眼热映口碑榜为例子来了解一下： 在spiders文件夹下创建一个maoyan.py文件，你也可以按住shift右键在此处打开命令窗口，输入：scrapy genspider 文件名 要爬取的网址。 自己创建的需要自己写，使用命令创建的包含最基本的东西。 我们来看一下使用命令创建的有什么。 介绍一下这些是干嘛的： name：是项目的名字 alloweddomains：是允许爬取的域名，比如一些网站有相关链接，域名就和本网站不同，这些就会忽略。 atarturls：是Spider爬取的网站，定义初始的请求url，可以多个。 parse方法：是Spider的一个方法，在请求starturl后，之后的方法，这个方法是对网页的解析，与提取自己想要的东西。 response参数：是请求网页后返回的内容，也就是你需要解析的网页。 还有其他参数有兴趣可以去查查。 4、定义Item item是保存爬取数据的容器，使用的方法和字典差不多。 我们打开items.py，之后我们想要提取的信息有： index(排名)、title(电影名)、star(主演)、releasetime(上映时间)、score(评分) 于是我们将items.py文件修改成这样。 即可。 5、再次打开spider来提取我们想要的信息 修改成这样： 好了，一个简单的爬虫就写完了。 6、运行 在该文件夹下，按住shift右键在此处打开命令窗口，输入：scrapy crawl maoyan(项目的名字) 即可看到： 7、保存 我们只运行了代码，看看有没有报错，并没有保存。 如果我们想保存为csv、xml、json格式，可以直接使用命令： 在该文件夹下，按住shift右键在此处打开命令窗口，输入： scrapy crawl maoyan o maoyan.csv scrapy crawl maoyan o maoyan.xml scrapy crawl maoyan o maoyan.json 选择其中一个即可。当然如果想要保存为其他格式也是可以的，这里只说常见的。这里选择json格式，运行后会发现，在文件夹下多出来一个maoyan.json的文件。打开之后发现，中文都是一串乱码，这里需要修改编码方式，当然也可以在配置里修改 （在settings.py文件中添加FEEDEXPORTENCODING='UTF8'即可）， 如果想直接在命令行中修改： scrapy crawl maoyan o maoyan.json s FEEDEXPORTENCODING=UTF8 即可。 这里自己试试效果吧。 当然我们保存也可以在运行的时候自动保存，不需要自己写命令。后面介绍（我们还有还多文件没有用到呦）。 二、scrapy如何解析？ 之前写过一篇文章：三大解析库的使用 但是scrapy也提供了自己的解析方式（Selector），和上面的也很相似，我们来看一下： 1、css 首先需要导入模块：from scrapy import Selector 例如有这样一段html代码： html=' Demo This is Demo 1.1、首先需要构建一个Selector对象 sel = Selector(html) text = sel.css('.cla::text').extractfirst() .cla表示选中上面的div节点，::text表示获取文本，这里和以前的有所不同。 extractfirst()表示返回第一个元素，因为上述 sel.css('.cla::text')返回的是一个列表，你也可以写成sel.css('.cla::text')[0]来获取第一个元素，但是如果为空，就会报出超出最大索引的错误，不建议这样写，而使用extractfirst()就不会报错，同时如果写成extractfirst('123')这样，如果为空就返回123 1.2、有了选取第一个，就有选取所有：extract()表示选取所有，如果返回的是多个值，就可以是这样写。 1.3、获取属性就是sel.css('.cla::sttr('class')').extractfirst()表示获取class 1.4、获取指定属性的文本：sel.css('div[class=\"cla\"]::text') 1.5、其他写法和css的写法如出一辙。 1.6、在scrapy中为我们提供了一个简便的写法，在上述的简单实例中，我们知道了response为请求网页的返回值。 我们可以直接写成：response.css()来解析，提取我们想要的信息。同样，下面要说的XPath也可以直接写成： response.xpath()来解析。 2、Xpath Xpath的使用可以看上面的文章：三大解析库的使用 注意：获取的还是列表，所以还是要加上extractfirst()或者extract() 3、正则匹配(这里用response操作) 例如：response.css('a::text').re('写正则') 这里如果response.css('a::text')匹配的是多个对象，那么加上正则也是匹配符合要求的多个对象。 这里如果想要匹配第一个对象，可以把re()修改成refirst()即可。 注意：response不可以直接调用re(),response.xpath('.').re()可以相当于达到直接使用正则的效果。 正则的使用：万能的正则表达式 三、Dowmloader Middleware的使用 本身scrapy就提供了很多Dowmloader Middleware，但是有时候我们要修改， 比如修改UserAgent，使用代理ip等。 以修改UserAgent为例（设置代理ip大同小异）： 第一种方法，可以在settings.py中直接添加USERAGENT='xxx' 但是我们想要添加多个UserAgent，每次随机获取一个可以利用Dowmloader Middleware来设置。 第一步将settings中的USERAGENT='xxx'修改成USERAGENT=[\"xxx\",\"xxxxx\",\"xxxxxxx\"] 第二步在middlewares.py中添加： fromcrawler():通过参数crawler可以拿到配置的信息，我们的UserAgent在配置文件里，所以我们需要获取到。 方法名不可以修改。 第三步在settings.py中添加： 将scrapy自带的UserAgentmiddleware的键值设置为None, 自定义的设置为400，这个键值越小表示优先调用的意思。 四、Item Pipeline的使用。 1、进行数据的清洗 在一的实例中我们把评分小于等于8.5分的score修改为（不好看！），我们认为是不好看的电影，我们将pipeline.py修改成这样： 在setting.py中添加： 我们执行一下： 2、储存 2."
  },
  {
    "title": "三大解析库的使用",
    "url": "/articles/2019/09/16/1568642979330.html",
    "type": "blog",
    "date": "2019-08-30",
    "topic": "Python 爬虫与自动化",
    "topicSlug": "python-crawler",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Python",
      "Scrapy"
    ],
    "excerpt": "1，XPath的使用 在使用前，需要安装lxml库。 安装代码：pip3 install lxml 1.1XPath的常用规则: / 表示选取直接子节点 // 表示选取所有子孙节点 . 选取当前节点 .. 选取当前结点的父节点 @ 选取属性 看完这些？你是不是还是一脸懵逼？下面我们来实际运用一下。 1.2实例引用 如图...",
    "guide": "本文归入「Python 爬虫与自动化」专题，主要记录：1，XPath的使用 在使用前，需要安装lxml库。 安装代码：pip3 install lxml 1.1XPath的常用规则: / 表示选取直接子节点 // 表示选取所有子孙节点 . 选取当前节点 .. 选取当前结点的父节点 @ 选取属性 看完这些？你是不是还是一脸懵逼？下面我们来实际运用一下。 1.2实例引用 如图...",
    "content": "1，XPath的使用 在使用前，需要安装lxml库。 安装代码：pip3 install lxml 1.1XPath的常用规则: / 表示选取直接子节点 // 表示选取所有子孙节点 . 选取当前节点 .. 选取当前结点的父节点 @ 选取属性 看完这些？你是不是还是一脸懵逼？下面我们来实际运用一下。 1.2实例引用 如图： 导入etree模块 etree.HTML()是构造一个XPath对象 etree.tostring()是对代码进行修正，如果有缺失的部分，会自动修复 方法比较简单，就不截取效果图了。 如果我们相对本地的文件进行解析怎么办？我们可以这样写 etree.parse()第一个参数为html的路径，第二（etree.HTMLParser()）和上面etree.HTML()的性质是一样的，为了方便，接下里我使用对本地文件进行解析。 html文本如下： 1.3获取所有的节点 结果： 开头用//表示选取所有符合的节点，表示获取所有的节点， 上面两句话一看这不是一个意思吗？会不懂！ 我们可以分为两步理解: 第一步//是选取所有符合要求的节点，没有指明是什么要求！，不知道你要.... 1，XPath的使用 在使用前，需要安装lxml库。 安装代码：pip3 install lxml 1.1XPath的常用规则: / 表示选取直接子节点 // 表示选取所有子孙节点 . 选取当前节点 .. 选取当前结点的父节点 @ 选取属性 看完这些？你是不是还是一脸懵逼？下面我们来实际运用一下。 1.2实例引用 如图： 导入etree模块 etree.HTML()是构造一个XPath对象 etree.tostring()是对代码进行修正，如果有缺失的部分，会自动修复 方法比较简单，就不截取效果图了。 如果我们相对本地的文件进行解析怎么办？我们可以这样写 etree.parse()第一个参数为html的路径，第二（etree.HTMLParser()）和上面etree.HTML()的性质是一样的，为了方便，接下里我使用对本地文件进行解析。 html文本如下： 1.3获取所有的节点 结果： 开头用//表示选取所有符合的节点，表示获取所有的节点， 上面两句话一看这不是一个意思吗？会不懂！ 我们可以分为两步理解: 第一步//是选取所有符合要求的节点，没有指明是什么要求！，不知道你要获取什么. 第二步表示所有节点，所以才会获取所有节点。这样理解起来应该会很容易了吧。 注意：返回的是一个列表 1.4获取指定的节点 还是上面的html文本，如果我们想获取li节点怎么办？ 只需要将resulttext=html.xpath('//')修改成resulttext=html.xpath('//li') 如果想获取a节点，就修改成//a,也可以写成//li//a，或者//ul//a获取//li/a 都是可以获取到但是如果//ul/a是获取不到的因为/表示的是直接子节点 注意：返回的都是节点，并不是文本信息。 即： 这种形式。 1.4属性匹配 如果我们想要a标签的href属性，我们可以修改成//a/@href 返回结果： 返回的也是一个列表 如果我们想要匹配class为li1的li，可以修改成//li[@class=\"li1\"]即可 1.5父节点匹配 我们来获取link2.html的a节点的父节点的class属性，我们是需要修改成//a[@href=\"link2.html\"]/../@class，这里的..表示寻找父节点，返回的依然是一个列表。 1.6获取文本 我们来获取class为li3的li下a的文本，可以写成//li[@class=\"li3\"]/a/text()即可 1.7contains()函数 比如其中有一个li为： 此时：li具有两个class名，我们如果这样写//li[@class=\"li\"]是获取不到节点的 那么我们可以这样写获取到节点//li[contains(@class,\"li\")]。 1.8多属性获取 ，同样是这个li我们需要获取class名为li同时id为caidan的li，可以这样写//li[contains(@class,\"li\") and @id=\"caidan\"] 获取class名为li或者id为caidan的li就用or。 1.9，last(),position()函数 上面的html有很多li，如果我只想获取第一个可以这样： //li[1],同理第二个改成2就可以了，如果想获取最后一个：//li[last()] 如果想获取前两个：//li[position()<3] 2,Beautiful Soup的使用 同样的在使用前我们也要安装Beautiful Soup 没有安装的请自行安装。 首先导入模块：from bs4 import BeautifulSoup 这次我们直接用一个网站来试试，我选择的是猫眼网， 你可以选择其他网站哦。 获取网页部分，上节有教，链接：python第二大神器requests 如图： 2.1初始化 BeautifulSoup()第一个参数为获取的网页内容，第二个参数为lxml，为什么是lxml？因为Beautiful Soup在解析时依赖解析器，python自带的解析器，容错能力差，比较慢，所以我们使用第三方解析器lxml， prettify()是将获取的内容以缩进的方式输出，看起来很舒服 如图： 看起来舒服多了。 2.2获取值 我们来获取一下title信息，我们是需要这样。 结果： 我们可以看到title获取的是title节点的所有信息，而加个string就变成了title里的文本内容，这样是不是也是很简单？ 2.21获取属性值 比如，我们想要获取img的src属性，我们只需要，soup.img['src']就可以获取到，soup.img.arrts['src']也可以获取到。 如果想获取到所有的属性就这样写：soup.img.arrts即可 如图所示： 注意：所有的属性返回的形式是以字典的形式返回。 2.3获取直接子节点和子孙节点，父节点，祖先节点，兄弟节点 获取直接子节点：contents，例如我想获取p标签的直接子节点：soup.p.contents即可 获取子孙节点：descendants,例如我想获取p标签的子孙节点：soup.p.descendants即可 获取父节点：parent属性，例如我想获取p标签的父节点：soup.p.parent即可 获取祖先节点：parents属性，例如我想获取p标签的祖先节点：soup.p.parents即可 获取兄弟节点：nextsibling,previoussibling,nextsiblings,previoussiblings分别为下一个兄弟节点，上一个兄弟节点，上面所有的兄弟节点，下面所有的兄弟节点。 2.4获取文本属性 string为获取文本 attrs为获取属性 2.5方法选择器 findall()返回的一个列表，匹配所有符合要求的元素 如果我们想要获取ul可以这样写：soup.findall(name='ul') 如果我们想要获取id为id1属性可以这样写：soup.findall(arrts[id='id1']) 如果我们想要获取class为class1属性可以这样写：soup.findall(arrts[class='class1']) 因为class有特殊意义，所以我们获取class的时候价格即可 如果我们想要获取文本值可以这样写：soup.findall(text=re.compile('')) 匹配text需要用到正则，匹配你想要的text值 find()只返回一个值，匹配到符合要求的第一个值。 用法和上面的方法一样 注意：以上说有的属性，方法都是通过我实例的soup来调用，soup是我的命名，你可以修改它，同时你调用就要用你的命名了 2.6css选择器 我们如果用css选择器需要调用select()方法 比如想获取class名为class1的节点，我们可以这样写：soup.select('.class1')即可，和css的表达方式是一样的，但是他的css选择器功能不够强大，下面我们介绍一个针对css的解析库。 3，pyquery的使用 首先要安装pyquery 没有安装的请自行安装。 导入模块：from pyquery import PyQuery 首先和上面的一样，同样需要初始化，获取对象 如下： 结果： 这样就获取到了所有的li 此外：初始化对象时，可以填写文本（上面就是），还可以填写url：PyQuery(url='https://maoyan.com/') 还可以填写本地文件：PyQuery(filename=''),''中填写本地文件的路径 3.1css选择器的基本用法 如果想选取class名为class1下的li可以这样写result('.class li')和css的选择器写法是一样的。 3.2find()方法，子节点，父节点，兄弟节点 和上面不同这里的find()方法是查找所有的子孙节点， 如果想获取li下的所有a节点可以这样写：result('li').find('a')即可 如果只想查找子节点：children()方法即可 父节点：parent()获取直接父节点 获取所有父节点：parents()获取所有父节点，如果只想要父节节点中class为class1的可以这样写：parents('.class1') 注意：输出的是父节点的所有内容。 兄弟节点：siblis()方法，如果只想要兄弟节点中id为id1的可以这样写：parents('i"
  },
  {
    "title": "python第二大神器requests",
    "url": "/articles/2019/09/16/1568643366664.html",
    "type": "blog",
    "date": "2019-08-29",
    "topic": "Python 爬虫与自动化",
    "topicSlug": "python-crawler",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Python"
    ],
    "excerpt": "首先你要安装requests库 安装代码：pip3 install requests 如果你没有安装pip3 请自行百度安装，本公众号已和百度达成合作不会的都可以去百度哦，不收费。 进入正题，我们来看一下requests的强大之处吧 1，get请求 是不是简单粗暴？相比上一篇舒服多了。 有什么属性？我也不知道哎，dir...",
    "guide": "本文归入「Python 爬虫与自动化」专题，主要记录：首先你要安装requests库 安装代码：pip3 install requests 如果你没有安装pip3 请自行百度安装，本公众号已和百度达成合作不会的都可以去百度哦，不收费。 进入正题，我们来看一下requests的强大之处吧 1，get请求 是不是简单粗暴？相比上一篇舒服多了。 有什么属性？我也不知道哎，dir...",
    "content": "首先你要安装requests库 安装代码：pip3 install requests 如果你没有安装pip3 请自行百度安装，本公众号已和百度达成合作不会的都可以去百度哦，不收费。 进入正题，我们来看一下requests的强大之处吧 1，get请求 是不是简单粗暴？相比上一篇舒服多了。 有什么属性？我也不知道哎，dir()一下？ 简单介绍几个属性： statuscode：状态码 url：url text：内容 cookies：就是cookies 我们试着用get请求添加一些参数，用params参数就好 返回的结果： 添加headers: 以知乎为例：知乎不加头信息会500报错。 返回结果： 2，post请求以及添加参数 返回结果： 3，尝试用cookies登录知乎 其实urllib中也有有对cookies的操作，不过很麻烦，相比起来requests简单许多 登录知乎时打开开发者模式， 如图： 复制下cookie值，在headers中添加cookie值： 你会发现你已经可以看到登录后的结果了！ 此时要思考一个问题，每次爬取页面不会只有一个请求，那么每次请求都要添加c.... 首先你要安装requests库 安装代码：pip3 install requests 如果你没有安装pip3 请自行百度安装，本公众号已和百度达成合作不会的都可以去百度哦，不收费。 进入正题，我们来看一下requests的强大之处吧 1，get请求 是不是简单粗暴？相比上一篇舒服多了。 有什么属性？我也不知道哎，dir()一下？ 简单介绍几个属性： statuscode：状态码 url：url text：内容 cookies：就是cookies 我们试着用get请求添加一些参数，用params参数就好 返回的结果： 添加headers: 以知乎为例：知乎不加头信息会500报错。 返回结果： 2，post请求以及添加参数 返回结果： 3，尝试用cookies登录知乎 其实urllib中也有有对cookies的操作，不过很麻烦，相比起来requests简单许多 登录知乎时打开开发者模式， 如图： 复制下cookie值，在headers中添加cookie值： 你会发现你已经可以看到登录后的结果了！ 此时要思考一个问题，每次爬取页面不会只有一个请求，那么每次请求都要添加cookies是很麻烦的，因此就有了会话维持，就会用到requests.Session()来设置，本节先不讲，后面会提到。 4，本节我们来简单的利用所学实现下载图片，音乐。 下载图片： 首先找到一个图片网站：我选择的是千图网找到一张图片，右键复制链接地址 ，然后写上这样一段代码： open() 可以对文本，图片等进行操作 open()的第一个参数是你图片存放的位置和名称，第二个参数为可进行的操作，比如w是写入，r是读取，wb是对二进制文件的操作，我们的图片，音乐都是二进制文件，运行之后你会发现，在此文件夹下已经有一张图片了，这里就不截图了，值得注意的是此时如果你要打印text会是一段乱码，因为是图片，而content会是以b开头，说明是bytes类型，是一串二进制数据。 下载音乐： 我选择的是网易云音乐，（这里要找到音乐的地址，稍微会麻烦一些）打开网易云，搜索你想要下载的音乐，然后打开开发者模式点击一下播放。 找到这首歌的url，即文件的源地址，这个地址应该是临时地址，有时间限制的。复制这个地址在新的页面打开应该是这样： 然后把请求的地址修改成你复制的地址，把存放的地址结尾改为mp3结尾即可。 因为使用方法其实都大同小异，就没有细说，根据前面的内容，应该是可以掌握的。不懂方法，不知道什么属性help一下，常见的都写在这里，后期如果写爬虫，涉及到没说过还会继续说，毕竟在项目中才会学的更多。 完。"
  },
  {
    "title": "爬虫之urllib库的使用",
    "url": "/articles/2019/09/16/1568643489909.html",
    "type": "blog",
    "date": "2019-08-28",
    "topic": "Python 爬虫与自动化",
    "topicSlug": "python-crawler",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Python"
    ],
    "excerpt": "首先什么是库？ 简单的说就是别人写好的东西，你拿来调用就可以实现基本的操作。比如电视你只用看，不用知道他是如何成像的。 urllib库之request（用来模拟HTTP请求）模块 request的第一个方法urlopen() 我们以淘宝为例写上这样一段代码： read()是返回得到的内容，decode('utf8')是...",
    "guide": "本文归入「Python 爬虫与自动化」专题，主要记录：首先什么是库？ 简单的说就是别人写好的东西，你拿来调用就可以实现基本的操作。比如电视你只用看，不用知道他是如何成像的。 urllib库之request（用来模拟HTTP请求）模块 request的第一个方法urlopen() 我们以淘宝为例写上这样一段代码： read()是返回得到的内容，decode('utf8')是...",
    "content": "首先什么是库？ 简单的说就是别人写好的东西，你拿来调用就可以实现基本的操作。比如电视你只用看，不用知道他是如何成像的。 urllib库之request（用来模拟HTTP请求）模块 request的第一个方法urlopen() 我们以淘宝为例写上这样一段代码： read()是返回得到的内容，decode('utf8')是编码格式。 返回的结果如下： 如果我们不想获取页面，只想获取请求的状态码或者头信息只需要 print(html.status)获取状态码,print(html.getheaders())获取头信息，可能你会说那莫多方法我怎么知道他有什么方法，此时只需要print(dir(html))一下，所有的方法，属性尽收眼底。那我怎么知道他是干什么的呢？help()一下就知道。 接下来我们来说一下urlopen()方法的参数： 我们利用上面说的去看一下有什么参数： 得到如下结果： 卧槽？怎么全英文？？？无奈，苦逼的我只好打开谷歌翻译。。。 data参数： data参数是干什么的？我们知道我们在登录的时候的会填写账号密码，那么我们模拟登录的时候也要填写，这个参数就是做这个的！值.... 首先什么是库？ 简单的说就是别人写好的东西，你拿来调用就可以实现基本的操作。比如电视你只用看，不用知道他是如何成像的。 urllib库之request（用来模拟HTTP请求）模块 request的第一个方法urlopen() 我们以淘宝为例写上这样一段代码： read()是返回得到的内容，decode('utf8')是编码格式。 返回的结果如下： 如果我们不想获取页面，只想获取请求的状态码或者头信息只需要 print(html.status)获取状态码,print(html.getheaders())获取头信息，可能你会说那莫多方法我怎么知道他有什么方法，此时只需要print(dir(html))一下，所有的方法，属性尽收眼底。那我怎么知道他是干什么的呢？help()一下就知道。 接下来我们来说一下urlopen()方法的参数： 我们利用上面说的去看一下有什么参数： 得到如下结果： 卧槽？怎么全英文？？？无奈，苦逼的我只好打开谷歌翻译。。。 data参数： data参数是干什么的？我们知道我们在登录的时候的会填写账号密码，那么我们模拟登录的时候也要填写，这个参数就是做这个的！值得注意的是当我们添加了这个参数之后请求方式就不再是GET，而是POST请求。并且data参数是字节流编码格式我们需要转化一下。 httpbin.org/post是一个请求测试网站，如下我们可以看到我们传递的参数已经在里面了。 timeout参数： tomeout参数是设置超时时间的，如果超出这个时间未得到响应就会抛出超时异常。下面我们来练习一下： iisinstance()函数用来判断是否是超时，socket.timeout就是超时异常，而e.reason是捕捉的异常，做一个判断。 结果如下： 其他参数用到的时候再说，目前不需要了解吧。 request的第二个方法Request() 同样以淘宝为例： 结果和上面的结果是一样的，我们可以发现只是请求的对象发生了改变，这有什么用了？这样会让我们更灵活的添加参数或者配置，没什么其他卵用，来说一下Request的参数吧。 help一下： url，data和上面的一样，headers表示请求头，是一个字典，我们在爬取网站的时候通常会加上一个UserAgent参数，防止被识别为爬虫，修改它，伪装成浏览器。originreghost是指请求的ip或者host，unverifiable是是否有抓取的权限没有为True，否者是False，mothod为请求方式。 我们试着去添加多个参数： 结果： 也可以用方法去添加，这个就自己去试吧。 error模块 1，URLError类 昨天我们导入包的方式感觉很烦，每次写都会很长 想要变得简单点可以这样写： 随便输入一个网址，并没有直接报错。 2，HTTPError类（针对HTTP请求错误的类，使用方式和上面的一样） 结果： reason：返回错误原因 code：返回状态码 headers：返回请求头信息 这里只针对爬虫用到的来说一下。 parse模块 paese模块总的来说就是对url的操作，各种解析和合并等 拆分的有： urlparse() urlsplit() 结果： urlsplit()和urlparse()一样，不同是是urlsplit()的结果将parsms合并到了path里 合并的有： urlunparse()合并的列表长度必须为6个 urlunsplit()合并的列表长度变成了5个 结果： urlunsplit()的写法也一样只是变成了长度变成了5。 序列化和反序列化（我的理解是转化成符合某种格式） urlencode():将字典转化为get请求的编码格式 parseqs():将GET请求的参数转化成字典 结果 ： 当url中有汉字时我们需要转化成url的编码格式quote（）转化回来unquote（） 结果： 其实上面讲的有三个模块，request请求模块，parse对url的处理模块和error异常处理模块。 done"
  },
  {
    "title": "1.springboot+mybatisplus+generate 自动生成",
    "url": "/articles/2019/08/15/1565804778217.html",
    "type": "blog",
    "date": "2019-08-15",
    "topic": "Spring Boot 与后端框架",
    "topicSlug": "spring-backend",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Java"
    ],
    "excerpt": "1.官网生成springboot https://start.spring.io/ 2.mybatisplus官网生成 mybatisplus官网快速开始 3.spring boot 增加mysql，druid 相关 4.0.0 org.springframework.boot springbootstarterpar...",
    "guide": "本文归入「Spring Boot 与后端框架」专题，主要记录：1.官网生成springboot https://start.spring.io/ 2.mybatisplus官网生成 mybatisplus官网快速开始 3.spring boot 增加mysql，druid 相关 4.0.0 org.springframework.boot springbootstarterpar...",
    "content": "1.官网生成springboot https://start.spring.io/ 2.mybatisplus官网生成 mybatisplus官网快速开始 3.spring boot 增加mysql，druid 相关 4.0.0 org.springframework.boot springbootstarterparent 2.1.6.RELEASE com.jackssy.boot JFullStack 0.0.1SNAPSHOT jfullstack Demo project for Spring Boot &lt;properties&gt; &lt;project.build.sourceEncoding&gt;UTF8&lt;/project.build.sourceEncoding&gt; &lt;project.reporting.outputEncoding&gt;UTF8&lt;/project.reporting.outputEncoding&gt; &lt;java.version&gt;1.8&lt;/java.ver.... 1.官网生成springboot https://start.spring.io/ 2.mybatisplus官网生成 mybatisplus官网快速开始 3.spring boot 增加mysql，druid 相关 4.0.0 org.springframework.boot springbootstarterparent 2.1.6.RELEASE com.jackssy.boot JFullStack 0.0.1SNAPSHOT jfullstack Demo project for Spring Boot UTF8 UTF8 1.8 2.1.6.RELEASE 3.1.1 5.1.47 1.1.18 1.2.59 2.6.1 3.9 3.8.1 3.1.0 2.22.2 org.springframework.boot springbootstarter org.springframework.boot springbootstarterweb org.springframework.boot springbootstartertest test org.projectlombok lombok true com.baomidou mybatisplusbootstarter ${mybatisplusbootstarter.version} com.baomidou mybatisplusgenerator ${mybatisplusbootstarter.version} org.freemarker freemarker 2.3.28 mysql mysqlconnectorjava ${mysql.version} com.alibaba druidspringbootstarter ${druid.version} com.alibaba fastjson ${fastjson.version} io.springfox springfoxswagger2 ${swagger2.version} io.springfox springfoxswaggerui ${swagger2.version} org.apache.commons commonslang3 ${commonslang3.version} JFullStack src/main/resources true config/ src/main/resources/config true config application.yml application${profileActive}.yml banner.txt logback.xml org.springframework.boot springbootmavenplugin ${springboot.version} io.geekidea.springbootplus.SpringBootPlusApplication repackage org.apache.maven.plugins mavenresourcesplugin ${mavenresourcesplugin.version} org.apache.maven.plugins mavencompilerplugin ${mavencompilerplugin.version} ${java.version} ${java.version} org.apache.maven.plugins mavensurefireplugin ${mavensurefireplugin.version} true mavenassemblyplugin 3.1.0 src/main/assembly/assembly.xml makeassembly package single local local true dev dev false test test false uat uat false prod prod false aliyun aliyunmaven http://maven.aliyun.com/nexus/content/groups/public/ springmilestones Spring Milestones https://maven.aliyun.com/repository/spring central mavencentral http://central.maven.org/maven2/ 4.git 地址 https://github.com/jackssybin/JFullStack.git"
  },
  {
    "title": "3.win10下python3爬虫美女图片逐步优化（多线程版本）",
    "url": "/articles/2019/08/13/1565634499211.html",
    "type": "blog",
    "date": "2019-08-13",
    "topic": "Python 爬虫与自动化",
    "topicSlug": "python-crawler",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Python"
    ],
    "excerpt": "coding: utf8 import re import os import time import threading from multiprocessing import Pool, cpucount import requests from bs4 import BeautifulSoup HEADERS =...",
    "guide": "本文归入「Python 爬虫与自动化」专题，主要记录：coding: utf8 import re import os import time import threading from multiprocessing import Pool, cpucount import requests from bs4 import BeautifulSoup HEADERS =...",
    "content": "coding: utf8 import re import os import time import threading from multiprocessing import Pool, cpucount import requests from bs4 import BeautifulSoup HEADERS = { 'XRequestedWith': 'XMLHttpRequest', 'UserAgent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 ' '(KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36', 'Referer': 'http://www.mzitu.com' } savepath='D:\\data\\crawl\\meizitujk\\\\' baseurl = 'http://m.772586.com' lock = threading.Lock() 全局资源锁 def urlscrawlerindex(url...."
  },
  {
    "title": "2.win10下python2爬虫美女图片逐步优化",
    "url": "/articles/2019/08/05/1564939108185.html",
    "type": "blog",
    "date": "2019-08-05",
    "topic": "Python 爬虫与自动化",
    "topicSlug": "python-crawler",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Python"
    ],
    "excerpt": "coding: utf8 完成通用爬虫，抓取一个页面队列中所有图片 import requests import re import time from bs4 import BeautifulSoup import uuid import urllib import os import sys reload(sys)...",
    "guide": "本文归入「Python 爬虫与自动化」专题，主要记录：coding: utf8 完成通用爬虫，抓取一个页面队列中所有图片 import requests import re import time from bs4 import BeautifulSoup import uuid import urllib import os import sys reload(sys)...",
    "content": "coding: utf8 完成通用爬虫，抓取一个页面队列中所有图片 import requests import re import time from bs4 import BeautifulSoup import uuid import urllib import os import sys reload(sys) sys.setdefaultencoding(\"utf8\") headers={ 'UserAgent':'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36' } baseurl='http://m.17786.com' baseimgurl='https://wcyouxi.sc601.com/file/p/20190803/21/ordurlsatqe.jpg' savepath='C:\\\\Users\\\\jackssy\\\\Pictures\\\\Camera Roll\\\\crawl\\...."
  },
  {
    "title": "2.pytho2 各种环境安装",
    "url": "/articles/2019/08/04/1564893581000.html",
    "type": "blog",
    "date": "2019-08-04",
    "topic": "Python 爬虫与自动化",
    "topicSlug": "python-crawler",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Python"
    ],
    "excerpt": "pytho2 各种环境安装 Python2 安装MySQLdb库 python2.exe m pip install mysqlclient==1.3.12 各种报错，搜索搜索，找到 https://www.lfd.uci.edu/gohlke/pythonlibs/mysqlpython 去下载对应环境版本插件。下载...",
    "guide": "本文归入「Python 爬虫与自动化」专题，主要记录：pytho2 各种环境安装 Python2 安装MySQLdb库 python2.exe m pip install mysqlclient==1.3.12 各种报错，搜索搜索，找到 https://www.lfd.uci.edu/gohlke/pythonlibs/mysqlpython 去下载对应环境版本插件。下载...",
    "content": "pytho2 各种环境安装 Python2 安装MySQLdb库 python2.exe m pip install mysqlclient==1.3.12 各种报错，搜索搜索，找到 https://www.lfd.uci.edu/gohlke/pythonlibs/mysqlpython 去下载对应环境版本插件。下载重新安装 python2.exe m pip install ext\\MySQLpython1.2.5cp27nonewinamd64.whl Python2 安装 redis pip install redis Python2 安装 requests pip install requests Python2 安装 QyQt5 pip install pythonqt5 Python2 安装beautifulsoap pip install beautifulsoup4==4.3.2 Pytho2 安装lxml pip install lxml pytho2 各种环境安装 1. Python2 安装MySQLdb库 各种报错，搜索搜索，找到 https://www.lfd.uci.edu/gohlke/pythonlibs/mysqlpython 去下载对应环境版本插件。下载重新安装 2. Python2 安装 redis 3. Python2 安装 requests 4. Python2 安装 QyQt5 5. Python2 安装beautifulsoap 6. Pytho2 安装lxml"
  },
  {
    "title": "1.win10下python2和python3共存",
    "url": "/articles/2019/08/04/1564886769156.html",
    "type": "blog",
    "date": "2019-08-04",
    "topic": "Python 爬虫与自动化",
    "topicSlug": "python-crawler",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Python"
    ],
    "excerpt": "windows 下安装python 环境使python2和python3 共存 环境 win10 64 位 1.开搞 去 pyhon 官网 https://www.python.org/downloads/windows/ 找到python的两个版本分别下载到本地 2.因为要安装两个版本，所以将2和3 安装在一个父文件...",
    "guide": "本文归入「Python 爬虫与自动化」专题，主要记录：windows 下安装python 环境使python2和python3 共存 环境 win10 64 位 1.开搞 去 pyhon 官网 https://www.python.org/downloads/windows/ 找到python的两个版本分别下载到本地 2.因为要安装两个版本，所以将2和3 安装在一个父文件...",
    "content": "windows 下安装python 环境使python2和python3 共存 环境 win10 64 位 1.开搞 去 pyhon 官网 https://www.python.org/downloads/windows/ 找到python的两个版本分别下载到本地 2.因为要安装两个版本，所以将2和3 安装在一个父文件夹下了 D:\\python\\python2.7 D:\\python\\python3.7 3.配置环境变量 打开系统属性&gt;高级&gt;环境变量&gt;系统变量&gt;Path 编辑 增加 D:\\python\\python2.7 D:\\python\\python2.7\\Scripts D:\\python\\python3.7 D:\\python\\python3.7\\Scripts 到环境变量中 4.因为要共存所以去 D:\\python\\python2.7 中将 python.exe 改为&gt;python2.exe ，pythonw.exe 改为 &gt;pythonw2.exe D:\\python\\python3.7 中将 python.exe 改为.... windows 下安装python 环境使python2和python3 共存 环境 win10 64 位 1.开搞 去 pyhon 官网 https://www.python.org/downloads/windows/ 找到python的两个版本分别下载到本地 2.因为要安装两个版本，所以将2和3 安装在一个父文件夹下了 D:\\python\\python2.7 D:\\python\\python3.7 3.配置环境变量 打开系统属性高级环境变量系统变量Path 编辑 增加 D:\\python\\python2.7 D:\\python\\python2.7\\Scripts D:\\python\\python3.7 D:\\python\\python3.7\\Scripts 到环境变量中 4.因为要共存所以去 D:\\python\\python2.7 中将 python.exe 改为python2.exe ，pythonw.exe 改为 pythonw2.exe D:\\python\\python3.7 中将 python.exe 改为python3.exe ，pythonw.exe 改为 pythonw3.exe 成功与否，可以去cmd 命令中，输入python2 和python3 看看效果 5.重新安装pip命令 D:\\python\\python2.7 python2 m pip install upgrade pip forcereinstall D:\\python\\python3.7 python3 m pip install upgrade pip forcereinstall 检验成果 pip version pip3 version"
  },
  {
    "title": "python基础之常用模块",
    "url": "/articles/2019/09/16/1568646255462.html",
    "type": "blog",
    "date": "2019-08-03",
    "topic": "Python 爬虫与自动化",
    "topicSlug": "python-crawler",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "Python"
    ],
    "excerpt": "Python生成requirements.txt方法 pip freeze &gt; requirements.txt 安装requirements.txt依赖 pip install r requirements.txt 常用模块 socket模块 常用于通讯，任何通讯工具中都含有socket，比如qq，微信。 ud...",
    "guide": "本文归入「Python 爬虫与自动化」专题，主要记录：Python生成requirements.txt方法 pip freeze &gt; requirements.txt 安装requirements.txt依赖 pip install r requirements.txt 常用模块 socket模块 常用于通讯，任何通讯工具中都含有socket，比如qq，微信。 ud...",
    "content": "Python生成requirements.txt方法 pip freeze &gt; requirements.txt 安装requirements.txt依赖 pip install r requirements.txt 常用模块 socket模块 常用于通讯，任何通讯工具中都含有socket，比如qq，微信。 udp实例： 导入模块 import socket def main(): 创建套接字 参数一：ip协议，socket.AFINET表示ipv4协议。 参数二：使用udp协议还是tcp协议 socket.SOCKDGRAM表示udp协议。 udpsocket = socket.socket(socket.AFINET,socket.SOCKDGRAM) 绑定信息，里面是一个元组，第一个参数为ip，\"\"表示自己的ip 第二个表示端口号 udpsocket.bind((\"\",7890)) 接收对方的ip地址 destip = input(\"请输入对方的ip：\") 接收对方的端口(port) destport = int(input(\".... Python生成requirements.txt方法 pip freeze requirements.txt 安装requirements.txt依赖 pip install r requirements.txt 常用模块 socket模块 常用于通讯，任何通讯工具中都含有socket，比如qq，微信。 udp实例： 导入模块 import socket def main(): 创建套接字 参数一：ip协议，socket.AFINET表示ipv4协议。 参数二：使用udp协议还是tcp协议 socket.SOCKDGRAM表示udp协议。 udpsocket = socket.socket(socket.AFINET,socket.SOCKDGRAM) 绑定信息，里面是一个元组，第一个参数为ip，\"\"表示自己的ip 第二个表示端口号 udpsocket.bind((\"\",7890)) 接收对方的ip地址 destip = input(\"请输入对方的ip：\") 接收对方的端口(port) destport = int(input(\"请输入对方的接收端口:\")) 接收发送消息 senddata = input(\"请输入需要发送的消息：\") 发送消息 参数一：表示需要发送的消息。 参数二：一个元组，第一个为对方的ip地址，第二个为对方的端口号 udpsocket.sendto(senddata.encode(\"utf8\"),(destip,destport)) 接收消息 1024表示能接收的最大值。 recvdata = udpsocket.recvfrom(1024) 输出接收到的消息，返回的也是一个元组，1，发送过来的信息2，表示发送方的ip和端口 为什么需要解码gbk？因为Windows的编码为gbk print(recvdata[0].decode(\"gbk\")) 关闭套接字 udpsocket.close() if name == \"main\": main() 可以看到上文需要输入对方的ip地址和端口号，为什么？ 简单来说就是通过ip地址找到你的电脑，再通过端口号找到接收的程序。 其他的注释应该很清楚了。tcp和udp的区别？ tcp是传输比较稳定，不掉包，udp是传输快，容易掉包。 掉包的意思就是说发送过去，对方一不定可以接收到（当然数据过大的时候会出现这种情况。） 这里补充几个名词的含义。 单工：比如说收音机，只能发，或者只能收消息。 半双工：能发也能收，但是在同一时刻只能收或只能发。 全双工：同一时刻能发也能收。 tcp实例 import socket def main(): 创建套接字 参数一：ip协议，socket.AFINET表示ipv4协议。 参数二：使用udp协议还是tcp协议 socket.SOCKSTREAM表示tcp协议 tcpsocket = socket.socket(socket.AFINET,socket.SOCKSTREAM) 绑定信息，里面是一个元组，第一个参数为ip，\"\"表示自己的ip 第二个表示端口号 tcpsocket.bind((\"\",7890)) 接收对方的ip地址 destip = input(\"请输入对方的ip：\") 接收对方的端口(port) destport = int(input(\"请输入对方的接收端口:\")) 链接服务器 tcpsocket.connec((destip,destport)) 接收发送消息 senddata = input(\"请输入需要发送的消息：\") 发送消息 tcpsocket.send(senddata.encode(\"utf8\")) 接收消息 1024表示能接收的最大值。 recvdata = tcpsocket.recv(1024) 输出接收到的消息，返回的也是一个元组，1，发送过来的信息2，表示发送方的ip和端口 为什么需要解码gbk？因为Windows的编码为gbk print(recvdata[0].decode(\"gbk\")) 关闭套接字 tcpsocket.close() if name == \"main\": main() time模块 import time 导入模块 time.sleep(5) 停留5秒，不给钱不优化那种 time.time() 返回从1970年1月1日到现在经历了多少秒。 格式化时间 time.strftime(\"%Y%m%d %H:%M:%S\") 20181108 21:50:01 time.strftime(\"%Y/%m/%d %H:%M:%S\") 2018/11/08 21:50:01 其他格式： %Y 四位数的年份表示（0009999） %m 月份（0112） %d 月内中的一天（031） %H 24小时制小时数（023） %I 12小时制小时数（0112） %M 分钟数（00=59） %S 秒（0059） %a 本地简化星期名称 %A 本地完整星期名称 %b 本地简化的月份名称 %B 本地完整的月份名称 %c 本地相应的日期表示和时间表示 %j 年内的一天（001366） %p 本地A.M.或P.M.的等价符 %U 一年中的星期数（0053）星期天为星期的开始 %w 星期（06），星期天为星期的开始 %W 一年中的星期数（0053）星期一为星期的开始 %x 本地相应的日期表示 %X 本地相应的时间表示 %Z 当前时区的名称 %% %号本身 以上自己可以试试。 time.localtime() 结构化时间 time.structtime(tmyear=2018, tmmon=11, tmmday=8, tmhour=21, tmmin=59, tmsec=14, tmwday=3, tmyday=312, tmisdst=0) time.tmyear 返回年 将时间戳转化为结构化时间 t = time.time() time.localtime(t) 现在的时间 time.gmtime() 国外某地点现在的时间 将格式化时间转化为时间戳 strtime = '20181108 21:50:01' time.mktime(strtime) 将格式化时间转化为结构化时间 time.strptime('2018118','%Y%m%d') 将结构化时间转化为格式化时间 time.strftime('%Y%m%d %H:%M:%S',time.localtime(1600000000)) 其他类型时间 time.asctime() Thu Nov 8 22:22:27 2018 time.ctime(1600000000) Sun Sep 13 20:26:40 2020 random随机数模块 实例： 导入模块 import random 随机整数 random.randint(0,5) 返回大于0小于等于5的整数 随机偶数 random.randrange(0,10,2) 返回大于等于0小于10的偶数，2为步长，和列表一样 随机返回其中一个值 random.choice([1,2,3,4,5]) 随机返回其中一个值 随机返回多个值 random.sanple([1,2,3,4,5],3) 随机返回3个值，返回几个取决于第二个参数 打乱列表顺序 list = [1,2,3,4,5] random.shuffle(list) 随机打乱列表的顺序) os 模块（与操作系统相关） 实例： 导入模块 import os getcwd() 获取当前工作目录(当前工作目录默认都是当前文件所在的文件夹) os.getcwd() chdir()改变当前工作目录 os.chdir('/python/Demo') listdir() 获取指定文件夹中所有内容的名称列表 os.listdir('/python/Demo') mkdir()创建文件夹 os.mkdir('Test') makedirs()递归创建文件夹 os.makedirs('/python/Demo/Test/A/B') rmdir() 删除空目录 os.rmdir('Demo') removedirs递归删除文件夹 必须都是空目录 os.removedirs('/python/Demo/Test/A/B') stat()获取文件或者文件夹的信息 os.stat('/python3/Demo.py) system()执行系统命令 os.s"
  },
  {
    "title": "Lists.transform的使用和采坑",
    "url": "/articles/2019/07/31/1564568923421.html",
    "type": "blog",
    "date": "2019-07-31",
    "topic": "Java 与 JVM",
    "topicSlug": "java-jvm",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "guava"
    ],
    "excerpt": "Lists.transform的使用 Lists.transform：能够轻松的从一种类型的list转换为另一种类型的list。 Map&lt;String,String&gt; map = Maps.newHashMap(); map.put(\"a\",\"testa\"); map.put(\"b\",\"test2\"); m...",
    "guide": "本文归入「Java 与 JVM」专题，主要记录：Lists.transform的使用 Lists.transform：能够轻松的从一种类型的list转换为另一种类型的list。 Map&lt;String,String&gt; map = Maps.newHashMap(); map.put(\"a\",\"testa\"); map.put(\"b\",\"test2\"); m...",
    "content": "Lists.transform的使用 Lists.transform：能够轻松的从一种类型的list转换为另一种类型的list。 Map&lt;String,String&gt; map = Maps.newHashMap(); map.put(\"a\",\"testa\"); map.put(\"b\",\"test2\"); map.put(\"c\",\"test3\"); Map&lt;String,String&gt; map = Maps.newHashMap(); map2.put(\"a\",\"test3\"); map2.put(\"b\",\"testb\"); map2.put(\"d\",\"testc\"); List&lt;Map&lt;String,String&gt;&gt; list2=Lists.newArrayList(); list2.add(map); list2.add(map2); List&lt;String&gt; list3=Lists.transform(list2,s&gt;s.get(\"a\")); list3.forEach(s &gt; System.out.pr.... Lists.transform的使用 Lists.transform：能够轻松的从一种类型的list转换为另一种类型的list。 结果如下 还有采坑的，得需要注意下 zhangsantest lisitest wangwutest =======change lambda 方式 zhangsan lisi wangwu class UserVo{ private String id; private String name; } class User{ private String id; private String name; } 对原数据集users的修改会直接影响到Lists.transform方法返回的结果userVos， 解决方案还是用 lambda 把方便快捷 参考https://blog.csdn.net/mnmlist/article/details/53870520"
  },
  {
    "title": "我在 GitHub 上的开源项目",
    "url": "/my-github-repos",
    "type": "blog",
    "date": "2019-07-31",
    "topic": "Java 与 JVM",
    "topicSlug": "java-jvm",
    "core": false,
    "priority": 20,
    "readingOrder": 999,
    "tags": [
      "开源",
      "GitHub"
    ],
    "excerpt": "bootbaseall Java ?2&nbsp;&nbsp;⭐️2&nbsp;&nbsp;?1 2. workbase Java ?1&nbsp;&nbsp;⭐️0&nbsp;&nbsp;?0 3. testjackssy Java ?1&nbsp;&nbsp;⭐️0&nbsp;&nbsp;?0 4. kaisagr...",
    "guide": "本文归入「Java 与 JVM」专题，主要记录：bootbaseall Java ?2&nbsp;&nbsp;⭐️2&nbsp;&nbsp;?1 2. workbase Java ?1&nbsp;&nbsp;⭐️0&nbsp;&nbsp;?0 3. testjackssy Java ?1&nbsp;&nbsp;⭐️0&nbsp;&nbsp;?0 4. kaisagr...",
    "content": "bootbaseall Java ?2&nbsp;&nbsp;⭐️2&nbsp;&nbsp;?1 2. workbase Java ?1&nbsp;&nbsp;⭐️0&nbsp;&nbsp;?0 3. testjackssy Java ?1&nbsp;&nbsp;⭐️0&nbsp;&nbsp;?0 4. kaisagroupplateform Java ?1&nbsp;&nbsp;⭐️0&nbsp;&nbsp;?0 5. kaisagroupmicro Java ?1&nbsp;&nbsp;⭐️0&nbsp;&nbsp;?0 6. jktest ?1&nbsp;&nbsp;⭐️0&nbsp;&nbsp;?0 jkeest 1. bootbaseall Java ?2&nbsp;&nbsp;⭐️2&nbsp;&nbsp;?1 2. workbase Java ?1&nbsp;&nbsp;⭐️0&nbsp;&nbsp;?0 3. testjackssy Java ?1&nbsp;&nbsp;⭐️0&nbsp;&nbsp;?0 4. kaisagroupplateform Java ?1&nbsp;&nbsp;⭐️0&nbsp;&nbsp;?0 5. kaisagroupmicro Java ?1&nbsp;&nbsp;⭐️0&nbsp;&nbsp;?0 6. jktest ?1&nbsp;&nbsp;⭐️0&nbsp;&nbsp;?0 jkeest 1. bootbaseall Java ?2&nbsp;&nbsp;⭐️2&nbsp;&nbsp;?1 2. workbase Java ?1&nbsp;&nbsp;⭐️0&nbsp;&nbsp;?0 3. jackssybin.github.io HTML ?1&nbsp;&nbsp;⭐️0&nbsp;&nbsp;?0 4. rustitems Rust ?1&nbsp;&nbsp;⭐️0&nbsp;&nbsp;?0 5. testjackssy Java ?1&nbsp;&nbsp;⭐️0&nbsp;&nbsp;?0 6. kaisagroupplateform Java ?1&nbsp;&nbsp;⭐️0&nbsp;&nbsp;?0 7. kaisagroupmicro Java ?0&nbsp;&nbsp;⭐️0&nbsp;&nbsp;?0 8. jktest ?1&nbsp;&nbsp;⭐️0&nbsp;&nbsp;?0 jkeest"
  }
];

export const navIndex = [
  {
    "title": "主体网站",
    "url": "https://jackssybin.cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "常用推荐",
    "term": "常用推荐",
    "description": "jackssybin程序爱好者！"
  },
  {
    "title": "微信读书",
    "url": "https://weread.qq.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "常用推荐",
    "term": "常用推荐",
    "description": "微信读书电脑版。"
  },
  {
    "title": "语雀",
    "url": "https://www.yuque.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "常用推荐",
    "term": "常用推荐",
    "description": "专业的云端知识库。"
  },
  {
    "title": "QQ 邮箱",
    "url": "http://mail.qq.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "常用推荐",
    "term": "常用推荐",
    "description": "腾讯 QQ 邮箱。"
  },
  {
    "title": "开源中国",
    "url": "https://www.oschina.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "常用推荐",
    "term": "常用推荐",
    "description": "中文开源技术交流社区。"
  },
  {
    "title": "公众号平台",
    "url": "https://mp.weixin.qq.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "常用推荐",
    "term": "常用推荐",
    "description": "再小的个体也有自己的品牌。"
  },
  {
    "title": "GitHub",
    "url": "https://github.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "常用推荐",
    "term": "常用推荐",
    "description": "GitHub 开源社区。"
  },
  {
    "title": "Md2X 定制版",
    "url": "https://md.weiyan.dev/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "常用推荐",
    "term": "常用推荐",
    "description": "Markdown 排版利器，Md2All 定制版。"
  },
  {
    "title": "知乎",
    "url": "https://www.zhihu.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "常用推荐",
    "term": "常用推荐",
    "description": "知乎社区。"
  },
  {
    "title": "ProcessOn",
    "url": "https://www.processon.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "常用推荐",
    "term": "常用推荐",
    "description": "免费在线作图、实时协作。"
  },
  {
    "title": "掘金",
    "url": "https://juejin.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "常用推荐",
    "term": "常用推荐",
    "description": "掘金是面向全球中文开发者的技术内容分享与交流平台。我们通过技术文章、沸点、课程、直播等产品和服务,打造一个激发开发者创作灵感,激励开发者沉淀分享,陪伴开发者成长的综合平台"
  },
  {
    "title": "CSDN",
    "url": "https://www.csdn.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "常用推荐",
    "term": "常用推荐",
    "description": "CSDN是全球知名中文IT技术交流平台,创建于1999年,包含原创博客、精品问答、职业培训、技术论坛、资源下载等产品服务,提供原创、优质、完整内容的专业IT技术开发社区"
  },
  {
    "title": "hellogithub",
    "url": "https://hellogithub.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "常用推荐",
    "term": "常用推荐",
    "description": "让对开源项目感兴趣的人不再畏惧、让开源项目的发起者不再孤单"
  },
  {
    "title": "heapdump",
    "url": "https://heapdump.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "常用推荐",
    "term": "常用推荐",
    "description": "学习性能知识、交流性能经验、寻求性能服务、招揽性能人才,有性能问题,上HeapDump性能社区。HeapDump性能社区是国内首个专注性能领域的技术社区,十几万开发者在这里讨论和分享JVM/Java/Linux操作"
  },
  {
    "title": "即时通讯网",
    "url": "http://www.52im.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "常用推荐",
    "term": "常用推荐",
    "description": "轻量级开源移动端即时通讯框架。 快速入门/性能/指南/常见问题"
  },
  {
    "title": "gitdoc下的源码博客",
    "url": "https://doocs.github.io/source-code-hunter/#/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "常用推荐",
    "term": "常用推荐",
    "description": "gitdoc下的源码博客"
  },
  {
    "title": "java全栈知识库",
    "url": "https://pdai.tech/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "常用推荐",
    "term": "常用推荐",
    "description": "java全栈知识库很全"
  },
  {
    "title": "Inoreader",
    "url": "https://www.inoreader.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "个人提升",
    "term": "博客论坛",
    "description": "重新掌控你的新闻订阅源。"
  },
  {
    "title": "Hacker News",
    "url": "https://news.ycombinator.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "个人提升",
    "term": "博客论坛",
    "description": "一家关于计算机黑客和创业公司的社会化新闻网站。"
  },
  {
    "title": "经管之家",
    "url": "https://bbs.pinggu.org/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "个人提升",
    "term": "博客论坛",
    "description": "国内活跃的经济、管理、金融、统计在线教育和咨询网站。"
  },
  {
    "title": "阮一峰的网络日志",
    "url": "http://www.ruanyifeng.com/blog/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "个人提升",
    "term": "博客论坛",
    "description": "阮一峰，科技爱好者周刊。"
  },
  {
    "title": "酷壳",
    "url": "https://www.coolshell.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "个人提升",
    "term": "博客论坛",
    "description": "酷 壳 – CoolShell。"
  },
  {
    "title": "美团技术团队",
    "url": "https://tech.meituan.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "个人提升",
    "term": "博客论坛",
    "description": "美团技术团队的博客，干货满满"
  },
  {
    "title": "Spring Boot中文导航",
    "url": "http://springboot.fun/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "个人提升",
    "term": "博客论坛",
    "description": "汇总了一些比较优秀的Spring Boot博客、开源作品等"
  },
  {
    "title": "Spring Cloud中文导航",
    "url": "https://springcloud.fun/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "个人提升",
    "term": "博客论坛",
    "description": "汇总了一些比较优秀的Spring Cloud 博客、开源作品等"
  },
  {
    "title": "Spring For All",
    "url": "https://spring4all.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "个人提升",
    "term": "博客论坛",
    "description": "目标是做最专业的的民间Sptng组织"
  },
  {
    "title": "五分钟学算法",
    "url": "https://www.cxyxiaowu.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "个人提升",
    "term": "博客论坛",
    "description": "程序员学习网站，收集了和程序员学习相关的各种教程和资料，致力于将数据结构与算法讲清楚"
  },
  {
    "title": "床长人工智能教程",
    "url": "https://www.captainbed.net/blog-neo/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "个人提升",
    "term": "博客论坛",
    "description": "不搞人工智能也可以看看，写的很有意思的教程，可以作为科普看看"
  },
  {
    "title": "Java技术驿站",
    "url": "http://cmsblogs.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "个人提升",
    "term": "博客论坛",
    "description": "有很多不错的Java系列文章"
  },
  {
    "title": "bugstack",
    "url": "https://bugstack.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "个人提升",
    "term": "博客论坛",
    "description": "博主是京东架构师，产出非常丰富，包括框架、源码、设计模式等"
  },
  {
    "title": "悟空聊架构",
    "url": "http://www.passjava.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "个人提升",
    "term": "博客论坛",
    "description": "博主挺厉害的,内容挺全的"
  },
  {
    "title": "有道词典",
    "url": "https://www.youdao.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "个人提升",
    "term": "办公学习",
    "description": "免费，即时的多语种在线翻译。"
  },
  {
    "title": "有道翻译",
    "url": "http://fanyi.youdao.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "个人提升",
    "term": "办公学习",
    "description": "有道翻译。"
  },
  {
    "title": "谷歌翻译",
    "url": "https://translate.google.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "个人提升",
    "term": "办公学习",
    "description": "谷歌翻译。"
  },
  {
    "title": "七夜导航",
    "url": "https://nav.qinight.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "个人提升",
    "term": "办公学习",
    "description": "比较全的一个导航网站"
  },
  {
    "title": "腾讯视频",
    "url": "http://v.qq.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "悠闲娱乐",
    "term": "影音视频",
    "description": "腾讯视频，海量视频在线观看。"
  },
  {
    "title": "优酷",
    "url": "http://www.youku.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "悠闲娱乐",
    "term": "影音视频",
    "description": "优酷 - 这个世界很酷。"
  },
  {
    "title": "爱奇艺",
    "url": "https://www.iqiyi.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "悠闲娱乐",
    "term": "影音视频",
    "description": "爱奇艺在线视频。"
  },
  {
    "title": "哔哩哔哩",
    "url": "https://www.bilibili.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "悠闲娱乐",
    "term": "影音视频",
    "description": "Bilibili 视频弹幕网站。"
  },
  {
    "title": "QQ 音乐",
    "url": "https://y.qq.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "悠闲娱乐",
    "term": "影音视频",
    "description": "QQ 音乐，在线听歌。"
  },
  {
    "title": "网易云音乐",
    "url": "https://music.163.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "悠闲娱乐",
    "term": "影音视频",
    "description": "163 网易云音乐。"
  },
  {
    "title": "电影天堂（DYTT8）",
    "url": "https://www.dytt8.net/index.htm",
    "type": "nav",
    "priority": 10,
    "taxonomy": "悠闲娱乐",
    "term": "影音视频",
    "description": "电影天堂（DYTT8），高清电影下载。"
  },
  {
    "title": "电影天堂（DYGOD）",
    "url": "https://www.dygod.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "悠闲娱乐",
    "term": "影音视频",
    "description": "电影天堂（DYGOD），高清电影下载。"
  },
  {
    "title": "ChatGPT",
    "url": "https://cn.bing.com/search?q=ChatGPT&ensearch=1",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI相关",
    "term": "热门AI工具",
    "description": "OpenAI旗下AI对话工具"
  },
  {
    "title": "GPT-4",
    "url": "https://cn.bing.com/search?q=GPT-4&ensearch=1",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI相关",
    "term": "热门AI工具",
    "description": "OpenAI旗下最新的GPT-4模型"
  },
  {
    "title": "Midjourney",
    "url": "https://cn.bing.com/search?q=Midjourney&ensearch=1",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI相关",
    "term": "热门AI工具",
    "description": "AI图像和插画生成工具"
  },
  {
    "title": "文心一言",
    "url": "https://yiyan.baidu.com",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI相关",
    "term": "热门AI工具",
    "description": "百度推出的基于文心大模型的AI对话互动工具"
  },
  {
    "title": "Stable Diffusion",
    "url": "https://cn.bing.com/search?q=Stable%20Diffusion&ensearch=1",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI相关",
    "term": "热门AI工具",
    "description": "StabilityAI推出的文本到图像生成AI"
  },
  {
    "title": "文心一格",
    "url": "https://yige.baidu.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI相关",
    "term": "热门AI工具",
    "description": "AI艺术和创意辅助平台"
  },
  {
    "title": "堆友AI",
    "url": "https://d.design/?from=aibot",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI相关",
    "term": "热门AI工具",
    "description": "阿里巴巴出品的免费AI绘画和出图神器"
  },
  {
    "title": "美图设计室",
    "url": "https://www.x-design.com/?channel=10026",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI相关",
    "term": "热门AI工具",
    "description": "AI图像创作和设计平台"
  },
  {
    "title": "一帧秒创",
    "url": "https://aigc.yizhentv.com/?_f=botrm",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI相关",
    "term": "热门AI工具",
    "description": "简单好用的AI智能视频创作平台"
  },
  {
    "title": "触手AI绘画",
    "url": "http://douchu.ai/warehouse/styleStore?inviteCode=677102&channel=channel_invite",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI相关",
    "term": "热门AI工具",
    "description": "免费专业的AI绘画/模型/分享平台"
  },
  {
    "title": "TreeMind树图",
    "url": "https://shutu.cn/?from=aibot",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI相关",
    "term": "热门AI工具",
    "description": "新一代AI智能思维导图"
  },
  {
    "title": "魔音工坊",
    "url": "https://www.moyin.com/?promottype=WZ_aibot",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI相关",
    "term": "热门AI工具",
    "description": "AI配音软件，轻松配出媲美真人的声音"
  },
  {
    "title": "panquarkcn",
    "url": "https://pan.quark.cn/s/5263050c121e",
    "type": "nav",
    "priority": 10,
    "taxonomy": "热门必备",
    "term": "热门必备",
    "description": "精选软件壁纸打包下载"
  },
  {
    "title": "zxzjacom",
    "url": "https://www.zxzja.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "热门必备",
    "term": "热门必备",
    "description": "免费高清影视剧"
  },
  {
    "title": "mitangtv",
    "url": "https://www.mitang.tv/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "热门必备",
    "term": "热门必备",
    "description": "高清新番动漫"
  },
  {
    "title": "ptsayqzcom",
    "url": "https://pt.sayqz.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "热门必备",
    "term": "热门必备",
    "description": "在线音乐播放器"
  },
  {
    "title": "tophubtoday",
    "url": "https://tophub.today/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "热门必备",
    "term": "热门必备",
    "description": "一站看完全网热榜消息"
  },
  {
    "title": "crazygamescom",
    "url": "https://www.crazygames.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "热门必备",
    "term": "热门必备",
    "description": "上千款在线小游戏"
  },
  {
    "title": "panqianfanapp",
    "url": "https://pan.qianfan.app/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "热门必备",
    "term": "热门必备",
    "description": "聚合网盘搜索引擎"
  },
  {
    "title": "zhannas-archiveorg",
    "url": "https://zh.annas-archive.org/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "热门必备",
    "term": "热门必备",
    "description": "数字图书馆"
  },
  {
    "title": "xinghuoxfyuncn",
    "url": "https://xinghuo.xfyun.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "热门必备",
    "term": "热门必备",
    "description": "国内可用免费AI模型"
  },
  {
    "title": "wallhavencc",
    "url": "https://wallhaven.cc/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "热门必备",
    "term": "热门必备",
    "description": "最佳高清壁纸网站"
  },
  {
    "title": "aiviycom",
    "url": "https://www.aiviy.com/item/windows11?pid=295",
    "type": "nav",
    "priority": 10,
    "taxonomy": "热门必备",
    "term": "热门必备",
    "description": "Win11家庭版/专业版 2折"
  },
  {
    "title": "aiviycom",
    "url": "https://www.aiviy.com/item/office-home-and-student-2021?pid=295",
    "type": "nav",
    "priority": 10,
    "taxonomy": "热门必备",
    "term": "热门必备",
    "description": "最新Office2021终身版 5折"
  },
  {
    "title": "storelizhiio",
    "url": "https://store.lizhi.io/site/products/id/65?cid=2yj7gln9",
    "type": "nav",
    "priority": 10,
    "taxonomy": "热门必备",
    "term": "热门必备",
    "description": "荔枝官方靠谱拼车"
  },
  {
    "title": "liveyj1211work",
    "url": "http://live.yj1211.work/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "热门必备",
    "term": "热门必备",
    "description": "直播聚合观看平台"
  },
  {
    "title": "toolwacom",
    "url": "https://toolwa.com/firework/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "热门必备",
    "term": "热门必备",
    "description": "新年看场在线烟花吧~"
  },
  {
    "title": "jdk官网相关bug相关查询",
    "url": "https://bugs.java.com/bugdatabase/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "热门必备",
    "term": "热门必备",
    "description": "根据openjdk的官网发版记录https://wiki.openjdk.org/display/jdk8u 查看问题"
  },
  {
    "title": "webbaimiaoappcom",
    "url": "https://web.baimiaoapp.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "在线OCR文字识别"
  },
  {
    "title": "在线工具集合",
    "url": "https://tool.lu",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "在线工具集合markdown"
  },
  {
    "title": "toolspdf24org",
    "url": "https://tools.pdf24.org/zh/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "完全免费的PDF工具箱"
  },
  {
    "title": "bgsubcn",
    "url": "https://bgsub.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "抠图/替换图片背景"
  },
  {
    "title": "waifu2xudpjp",
    "url": "http://waifu2x.udp.jp/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "图片无损放大"
  },
  {
    "title": "deeplcom",
    "url": "https://www.deepl.com/translator",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "最强在线翻译工具"
  },
  {
    "title": "photopeacom",
    "url": "https://www.photopea.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "网页版 Photoshop"
  },
  {
    "title": "tinypngcom",
    "url": "https://tinypng.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "图片压缩利器"
  },
  {
    "title": "ezgifcom",
    "url": "https://ezgif.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "全能GIF编辑制作工具"
  },
  {
    "title": "photokitcom",
    "url": "https://photokit.com/?lang=zh",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "在线图片编辑器"
  },
  {
    "title": "cliim",
    "url": "https://cli.im/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "二维码制作解析工具"
  },
  {
    "title": "aconvertcom",
    "url": "https://www.aconvert.com/cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "免费文件格式转换工具"
  },
  {
    "title": "convertioco",
    "url": "https://convertio.co/zh/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "文件格式转换器"
  },
  {
    "title": "virustotalcom",
    "url": "https://www.virustotal.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "多引擎在线查毒"
  },
  {
    "title": "weiboiiilabcom",
    "url": "https://weibo.iiilab.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "视频解析下载"
  },
  {
    "title": "xbeibeixcom",
    "url": "https://xbeibeix.com/api/bilibili/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "B站视频下载"
  },
  {
    "title": "toolliumingyecn",
    "url": "http://tool.liumingye.cn/video/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "全能VIP视频在线解析"
  },
  {
    "title": "searchchongbuluocom",
    "url": "https://search.chongbuluo.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "超强的聚合搜索网站"
  },
  {
    "title": "toolsmikuac",
    "url": "https://tools.miku.ac/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "在线黑科技工具箱"
  },
  {
    "title": "toolmkblogcn",
    "url": "http://tool.mkblog.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "有趣又实用的工具集合"
  },
  {
    "title": "guozhivipcom",
    "url": "http://guozhivip.com/tool/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "日常生活工具集合"
  },
  {
    "title": "toollu",
    "url": "https://tool.lu/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "程序员专用工具集"
  },
  {
    "title": "readeryijianapp",
    "url": "https://reader.yijian.app/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "高颜值在线TXT阅读器"
  },
  {
    "title": "processoncom",
    "url": "https://www.processon.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "在线作图/思维导图"
  },
  {
    "title": "zhaotaicicn",
    "url": "https://zhaotaici.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "影视剧台词搜索"
  },
  {
    "title": "vmagiconchcom",
    "url": "https://v.magiconch.com/epub-transform.html",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "电子书繁简互转"
  },
  {
    "title": "toolsliumingyecn",
    "url": "https://tools.liumingye.cn/music/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "在线音乐播放器"
  },
  {
    "title": "wenshushucn",
    "url": "https://www.wenshushu.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "免登录文件分享传输"
  },
  {
    "title": "sanwexyz",
    "url": "https://www.sanwe.xyz/tools/unlock-music/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "移除音乐加密保护"
  },
  {
    "title": "vmagiconchcom",
    "url": "https://v.magiconch.com/sns-image",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "一图切多图工具"
  },
  {
    "title": "epub2kindlecom",
    "url": "https://epub2kindle.com/zh/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "多种电子书格式互转"
  },
  {
    "title": "imagestoolcom",
    "url": "https://imagestool.com/zh_CN/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "免费/无需上传文件"
  },
  {
    "title": "lab5imecn",
    "url": "https://lab.5ime.cn/video/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "短视频图集去水印下载"
  },
  {
    "title": "ttsmakercn",
    "url": "https://ttsmaker.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "在线免费文本转语音"
  },
  {
    "title": "flipclockercom",
    "url": "https://flipclocker.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "网页版翻页时钟"
  },
  {
    "title": "lingvaml",
    "url": "https://lingva.ml/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "谷歌翻译第三方网页"
  },
  {
    "title": "yppptcom",
    "url": "https://www.ypppt.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "免费PPT模板下载"
  },
  {
    "title": "toolbrowserqqcom",
    "url": "https://tool.browser.qq.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "腾讯在线工具箱平台"
  },
  {
    "title": "moaktcom",
    "url": "https://www.moakt.com/zh",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "临时邮箱"
  },
  {
    "title": "mathsolvermicrosoftcom",
    "url": "https://mathsolver.microsoft.com/zh",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "数学求解计算器"
  },
  {
    "title": "arctencentcom",
    "url": "https://arc.tencent.com/zh/ai-demos/faceRestoration",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "图片修复/放大/抠图"
  },
  {
    "title": "musicenccom",
    "url": "https://www.musicenc.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "歌词/音乐下载网站"
  },
  {
    "title": "photojoinercom",
    "url": "https://www.photojoiner.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "在线图片拼接工具"
  },
  {
    "title": "cdnjsoncom",
    "url": "https://cdnjson.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "免费图片外链"
  },
  {
    "title": "watermarkremoverio",
    "url": "https://www.watermarkremover.io/zh",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "图片去水印"
  },
  {
    "title": "aha-musiccom",
    "url": "https://aha-music.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "在线听歌识曲工具"
  },
  {
    "title": "anybtethlimo",
    "url": "https://anybt.eth.limo/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "磁力种子搜索网站"
  },
  {
    "title": "jianlixiazaicn",
    "url": "https://jianlixiazai.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "简历模板免费下载"
  },
  {
    "title": "bilibiliqcom",
    "url": "https://www.bilibiliq.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "b站各种封面提取"
  },
  {
    "title": "mp3cutnet",
    "url": "https://mp3cut.net/cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "在线音频剪辑器"
  },
  {
    "title": "toolwacom",
    "url": "https://toolwa.com/record/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "在线录屏/录像/录音"
  },
  {
    "title": "deviceshotscom",
    "url": "https://deviceshots.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "带壳图片/模型生成器"
  },
  {
    "title": "saofm",
    "url": "https://sao.fm/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "网络收音机"
  },
  {
    "title": "在线图片抠图ai版本",
    "url": "https://www.fococlipping.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "FocoClipping官网,免费在线ai抠图工具网站,人工智能一键快"
  },
  {
    "title": "淘链客",
    "url": "https://www.taolinks.cc/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "实用工具",
    "term": "实用工具",
    "description": "外链资源聚合搜索引擎，搜索全网pdf资料"
  },
  {
    "title": "panqianfanapp",
    "url": "https://pan.qianfan.app/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "网盘搜索",
    "term": "网盘搜索",
    "description": "百度/阿里/蓝奏/天翼/夸克/迅雷网盘"
  },
  {
    "title": "alipansoucom",
    "url": "https://www.alipansou.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "网盘搜索",
    "term": "网盘搜索",
    "description": "百度/阿里/夸克/天翼云盘"
  },
  {
    "title": "xuebapancom",
    "url": "https://www.xuebapan.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "网盘搜索",
    "term": "网盘搜索",
    "description": "百度网盘"
  },
  {
    "title": "nicesonet",
    "url": "https://www.niceso.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "网盘搜索",
    "term": "网盘搜索",
    "description": "阿里云盘"
  },
  {
    "title": "upyunsocom",
    "url": "https://www.upyunso.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "网盘搜索",
    "term": "网盘搜索",
    "description": "阿里云盘"
  },
  {
    "title": "panccofcc",
    "url": "https://pan.ccof.cc/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "网盘搜索",
    "term": "网盘搜索",
    "description": "阿里云盘"
  },
  {
    "title": "pikasotop",
    "url": "https://www.pikaso.top/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "网盘搜索",
    "term": "网盘搜索",
    "description": "百度/阿里/蓝奏/天翼/夸克网站"
  },
  {
    "title": "百度网盘",
    "url": "http://pan.baidu.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "网盘资源",
    "description": "https://pan.baidu.com/."
  },
  {
    "title": "阿里云盘",
    "url": "https://www.aliyundrive.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "网盘资源",
    "description": "阿里云盘，你的数字世界。"
  },
  {
    "title": "天翼云盘",
    "url": "https://cloud.189.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "网盘资源",
    "description": "家庭云|网盘|文件备份|资源分享。"
  },
  {
    "title": "阿里云",
    "url": "https://www.aliyun.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "云服务器",
    "description": "上云就上阿里云。"
  },
  {
    "title": "腾讯云",
    "url": "https://cloud.tencent.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "云服务器",
    "description": "产业智变，云启未来。"
  },
  {
    "title": "华为云",
    "url": "https://www.huaweicloud.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "云服务器",
    "description": "提供云计算服务+智能，见未来-华为云。"
  },
  {
    "title": "云筏科技",
    "url": "https://my.cloudraft.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "云服务器",
    "description": "云筏 - 科研云。"
  },
  {
    "title": "极云普惠云电脑",
    "url": "https://www.ji-cloud.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "云服务器",
    "description": "云电脑-云游戏-手机变电脑软件。"
  },
  {
    "title": "青椒云",
    "url": "https://www.qingjiaocloud.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "云服务器",
    "description": "云桌面,一站式云电脑服务平台。"
  },
  {
    "title": "Iconfinder",
    "url": "https://www.iconfinder.com",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "图标素材",
    "description": "2,100,000+ free and premium vector icons."
  },
  {
    "title": "iconfont",
    "url": "http://www.iconfont.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "图标素材",
    "description": "阿里巴巴矢量图标库。"
  },
  {
    "title": "iconmonstr",
    "url": "https://iconmonstr.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "图标素材",
    "description": "Free simple icons for your next project."
  },
  {
    "title": "Icon Archive",
    "url": "http://www.iconarchive.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "图标素材",
    "description": "Search 590,912 free icons."
  },
  {
    "title": "FindIcons",
    "url": "https://findicons.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "图标素材",
    "description": "Search through 300,000 free icons."
  },
  {
    "title": "IcoMoonApp",
    "url": "https://icomoon.io/app/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "图标素材",
    "description": "Icon Font, SVG, PDF &amp; PNG Generator."
  },
  {
    "title": "easyicon",
    "url": "http://www.easyicon.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "图标素材",
    "description": "PNG、ICO、ICNS格式图标搜索、图标下载服务。"
  },
  {
    "title": "flaticon",
    "url": "https://www.flaticon.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "图标素材",
    "description": "634,000+ Free vector icons in SVG, PSD, PNG, EPS format or as ICON FONT."
  },
  {
    "title": "UICloud",
    "url": "http://ui-cloud.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "图标素材",
    "description": "The largest user interface design database in the world."
  },
  {
    "title": "Material icons",
    "url": "https://material.io/icons/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "图标素材",
    "description": "Access over 900 material system icons, available in a variety of sizes and densities, and as a web font."
  },
  {
    "title": "Font Awesome Icon",
    "url": "https://fontawesome.com/icons/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "图标素材",
    "description": "The complete set of 675 icons in Font Awesome."
  },
  {
    "title": "ion icons",
    "url": "http://ionicons.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "图标素材",
    "description": "The premium icon font for Ionic Framework."
  },
  {
    "title": "Simpleline Icons",
    "url": "http://simplelineicons.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "图标素材",
    "description": "Simple line Icons pack."
  },
  {
    "title": "Iconsfeed",
    "url": "http://www.iconsfeed.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "图标设计",
    "description": "iOS icons gallery."
  },
  {
    "title": "iOS Icon Gallery",
    "url": "http://iosicongallery.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "图标设计",
    "description": "Showcasing beautiful icon designs from the iOS App Store."
  },
  {
    "title": "World Vector Logo",
    "url": "https://worldvectorlogo.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "图标设计",
    "description": "Brand logos free to download."
  },
  {
    "title": "Instant Logo Search",
    "url": "http://instantlogosearch.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "图标设计",
    "description": "Search & download thousands of logos instantly."
  },
  {
    "title": "freepik",
    "url": "https://www.freepik.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "平面素材",
    "description": "More than a million free vectors, PSD, photos and free icons."
  },
  {
    "title": "wallhalla",
    "url": "https://wallhalla.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "平面素材",
    "description": "Find awesome high quality wallpapers for desktop and mobile in one place."
  },
  {
    "title": "365PSD",
    "url": "https://365psd.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "平面素材",
    "description": "Free PSD &amp; Graphics, Illustrations."
  },
  {
    "title": "Medialoot",
    "url": "https://medialoot.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "平面素材",
    "description": "Free &amp; Premium Design Resources &mdash; Medialoot."
  },
  {
    "title": "千图网",
    "url": "http://www.58pic.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "平面素材",
    "description": "专注免费设计素材下载的网站."
  },
  {
    "title": "千库网",
    "url": "http://588ku.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "平面素材",
    "description": "免费 png 图片背景素材下载。"
  },
  {
    "title": "我图网",
    "url": "http://www.ooopic.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "平面素材",
    "description": "我图网，提供图片素材及模板下载，专注正版设计作品交易。"
  },
  {
    "title": "90 设计",
    "url": "http://90sheji.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "平面素材",
    "description": "电商设计（淘宝美工）千图免费淘宝素材库。"
  },
  {
    "title": "昵图网",
    "url": "http://www.nipic.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "平面素材",
    "description": "原创素材共享平台。"
  },
  {
    "title": "懒人图库",
    "url": "http://www.lanrentuku.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "平面素材",
    "description": "懒人图库专注于提供网页素材下载。"
  },
  {
    "title": "素材搜索",
    "url": "http://so.ui001.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "平面素材",
    "description": "设计素材搜索聚合。"
  },
  {
    "title": "PS 饭团网",
    "url": "http://psefan.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "平面素材",
    "description": "不一样的设计素材库！让自己的设计与众不同！"
  },
  {
    "title": "素材中国",
    "url": "http://www.sccnn.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "平面素材",
    "description": "免费素材共享平台。"
  },
  {
    "title": "Google Font",
    "url": "https://fonts.google.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "字体资源",
    "description": "Making the web more beautiful, fast, and open through great typography."
  },
  {
    "title": "Typekit",
    "url": "https://typekit.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "字体资源",
    "description": "Quality fonts from the world’s best foundries."
  },
  {
    "title": "方正字库",
    "url": "http://www.foundertype.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "字体资源",
    "description": "方正字库官方网站。"
  },
  {
    "title": "字体传奇网",
    "url": "http://ziticq.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "字体资源",
    "description": "中国首个字体品牌设计师交流网。"
  },
  {
    "title": "私藏字体",
    "url": "http://sicangziti.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "字体资源",
    "description": "优质字体免费下载站。"
  },
  {
    "title": "Fontsquirrel",
    "url": "https://www.fontsquirrel.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "字体资源",
    "description": "FREE fonts for graphic designers."
  },
  {
    "title": "Urban Fonts",
    "url": "https://www.urbanfonts.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "字体资源",
    "description": "Download Free Fonts and Free Dingbats."
  },
  {
    "title": "Lost Type",
    "url": "http://www.losttype.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "字体资源",
    "description": "Lost Type is a Collaborative Digital Type Foundry."
  },
  {
    "title": "FONTS2U",
    "url": "https://fonts2u.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "字体资源",
    "description": "Download free fonts for Windows and Macintosh."
  },
  {
    "title": "Fontex",
    "url": "http://www.fontex.org/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "字体资源",
    "description": "Free Fonts to Download + Premium Typefaces."
  },
  {
    "title": "FontM",
    "url": "http://fontm.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "字体资源",
    "description": "Free Fonts"
  },
  {
    "title": "My Fonts",
    "url": "http://www.myfonts.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "字体资源",
    "description": "Fonts for Print, Products & Screens."
  },
  {
    "title": "Da Font",
    "url": "https://www.dafont.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "字体资源",
    "description": "Archive of freely downloadable fonts."
  },
  {
    "title": "OnlineWebFonts",
    "url": "https://www.onlinewebfonts.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "字体资源",
    "description": "WEB Free Fonts for Windows and Mac / Font free Download."
  },
  {
    "title": "Abstract Fonts",
    "url": "http://www.abstractfonts.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "字体资源",
    "description": "Abstract Fonts (13,866 free fonts)."
  },
  {
    "title": "OfficePLUS",
    "url": "http://www.officeplus.cn/Template/Home.shtml",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "PPT资源",
    "description": "OfficePLUS，微软Office官方在线模板网站！"
  },
  {
    "title": "优品PPT",
    "url": "http://www.ypppt.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "PPT资源",
    "description": "高质量的模版，而且还有PPT图表，PPT背景图等资源。"
  },
  {
    "title": "PPT+",
    "url": "http://www.pptplus.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "PPT资源",
    "description": "PPT加直播、录制和分享—PPT+语音内容分享平台。"
  },
  {
    "title": "PPTMind",
    "url": "http://www.pptmind.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "PPT资源",
    "description": "分享高端 ppt 模板与 keynote 模板的数字作品交易平台。"
  },
  {
    "title": "tretars",
    "url": "http://www.tretars.com/ppt-templates",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "PPT资源",
    "description": "The best free Mockups from the Web."
  },
  {
    "title": "5百丁",
    "url": "http://ppt.500d.me/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "PPT资源",
    "description": "中国领先的PPT模板共享平台。"
  },
  {
    "title": "photoshop",
    "url": "https://www.adobe.com/cn/products/photoshop.html",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "图形创意",
    "description": "Photoshop不需要解释"
  },
  {
    "title": "Affinity Designer",
    "url": "https://affinity.serif.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "图形创意",
    "description": "专业创意软件"
  },
  {
    "title": "Illustrator",
    "url": "https://www.adobe.com/cn/products/illustrator/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "图形创意",
    "description": "矢量图形和插图。"
  },
  {
    "title": "indesign",
    "url": "http://www.adobe.com/cn/products/indesign.html",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "图形创意",
    "description": "页面设计、布局和出版。"
  },
  {
    "title": "cinema-4d",
    "url": "https://www.maxon.net/en/products/cinema-4d/overview/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "图形创意",
    "description": "Cinema 4D is the perfect package for all 3D artists who want to achieve breathtaking results fast and hassle-free."
  },
  {
    "title": "3ds-max",
    "url": "https://www.autodesk.com/products/3ds-max/overview",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "图形创意",
    "description": "3D modeling, animation, and rendering software"
  },
  {
    "title": "Blender",
    "url": "https://www.blender.org/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "图形创意",
    "description": "Blender is the free and open source 3D creation suite."
  },
  {
    "title": "Sketch",
    "url": "https://sketchapp.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "界面设计",
    "description": "The digital design toolkit"
  },
  {
    "title": "Adobe XD",
    "url": "http://www.adobe.com/products/xd.html",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "界面设计",
    "description": "Introducing Adobe XD. Design. Prototype. Experience."
  },
  {
    "title": "invisionapp",
    "url": "https://www.invisionapp.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "界面设计",
    "description": "Powerful design prototyping tools"
  },
  {
    "title": "marvelapp",
    "url": "https://marvelapp.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "界面设计",
    "description": "Simple design, prototyping and collaboration"
  },
  {
    "title": "Muse CC",
    "url": "https://creative.adobe.com/zh-cn/products/download/muse",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "界面设计",
    "description": "无需利用编码即可进行网站设计。"
  },
  {
    "title": "figma",
    "url": "https://www.figma.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "界面设计",
    "description": "Design, prototype, and gather feedback all in one place with Figma."
  },
  {
    "title": "khroma",
    "url": "http://khroma.co/generator/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "在线配色",
    "description": "Khroma is the fastest way to discover, search, and save color combos you'll want to use."
  },
  {
    "title": "uigradients",
    "url": "https://uigradients.com",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "在线配色",
    "description": "Beautiful colored gradients."
  },
  {
    "title": "gradients",
    "url": "http://gradients.io/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "在线配色",
    "description": "Curated gradients for designers and developers."
  },
  {
    "title": "Coolest",
    "url": "https://webkul.github.io/coolhue/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "在线配色",
    "description": "Coolest handpicked Gradient Hues for your next super ⚡ amazing stuff."
  },
  {
    "title": "webgradients",
    "url": "https://webgradients.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "在线配色",
    "description": "WebGradients is a free collection of 180 linear gradients that you can use as content backdrops in any part of your website."
  },
  {
    "title": "grabient",
    "url": "https://www.grabient.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "在线配色",
    "description": "2017 Grabient by unfold."
  },
  {
    "title": "thedayscolor",
    "url": "http://www.thedayscolor.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "在线配色",
    "description": "The daily color digest"
  },
  {
    "title": "flatuicolors",
    "url": "http://flatuicolors.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "在线配色",
    "description": "Copy Paste Color Pallette from Flat UI Theme."
  },
  {
    "title": "coolors",
    "url": "https://coolors.co/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "在线配色",
    "description": "The super fast color schemes generator!"
  },
  {
    "title": "colorhunt",
    "url": "http://www.colorhunt.co/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "在线配色",
    "description": "Beautiful Color Palettes."
  },
  {
    "title": "Adobe Color CC",
    "url": "https://color.adobe.com/zh/create/color-wheel",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "在线配色",
    "description": "Create color schemes with the color wheel or browse thousands of color combinations from the Color community."
  },
  {
    "title": "flatuicolorpicker",
    "url": "http://www.flatuicolorpicker.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "在线配色",
    "description": "Best Flat Colors For UI Design."
  },
  {
    "title": "trianglify",
    "url": "http://qrohlf.com/trianglify-generator/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "在线配色",
    "description": "Trianglify Generator."
  },
  {
    "title": "klart",
    "url": "https://klart.co/colors/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "在线配色",
    "description": "Beautiful colors and designs to your inbox every week."
  },
  {
    "title": "vanschneider",
    "url": "http://www.vanschneider.com/colors",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "在线配色",
    "description": "Color Claim was created in 2012 by Tobias van Schneider with the goal to collect & combine unique colors for my future projects."
  },
  {
    "title": "tinypng",
    "url": "https://tinypng.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "在线工具",
    "description": "Optimize your images with a perfect balance in quality and file size."
  },
  {
    "title": "goqr",
    "url": "http://goqr.me/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "在线工具",
    "description": "create QR codes for free (Logo, T-Shirt, vCard, EPS)."
  },
  {
    "title": "ezgif",
    "url": "https://ezgif.com",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "在线工具",
    "description": "simple online GIF maker and toolset for basic animated GIF editing."
  },
  {
    "title": "Android 9 patch",
    "url": "http://inloop.github.io/shadow4android/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "在线工具",
    "description": "Android 9-patch shadow generator fully customizable shadows."
  },
  {
    "title": "screen sizes",
    "url": "http://screensiz.es/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "在线工具",
    "description": "Viewport Sizes and Pixel Densities for Popular Devices."
  },
  {
    "title": "svgomg",
    "url": "https://jakearchibald.github.io/svgomg/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "在线工具",
    "description": "SVG 在线压缩平台。"
  },
  {
    "title": "稿定抠图",
    "url": "https://www.gaoding.com",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "在线工具",
    "description": "免费在线抠图软件,图片快速换背景-抠白底图。"
  },
  {
    "title": "wappalyzer",
    "url": "https://www.wappalyzer.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "谷歌插件",
    "description": "Identify technology on websites."
  },
  {
    "title": "Panda",
    "url": "http://usepanda.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "谷歌插件",
    "description": "A smart news reader built for productivity."
  },
  {
    "title": "sizzy",
    "url": "https://sizzy.co/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "谷歌插件",
    "description": "A tool for developing responsive websites crazy-fast."
  },
  {
    "title": "csspeeper",
    "url": "https://csspeeper.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "谷歌插件",
    "description": "Smart CSS viewer tailored for Designers."
  },
  {
    "title": "insight",
    "url": "http://insight.io/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "谷歌插件",
    "description": "IDE-like code search and navigation, on the cloud."
  },
  {
    "title": "mustsee",
    "url": "http://mustsee.earth/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "开发设计",
    "term": "谷歌插件",
    "description": "Discover the world's most beautiful places at every opened tab."
  },
  {
    "title": "书栈网",
    "url": "https://www.bookstack.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "资讯学习",
    "term": "资讯书籍",
    "description": "IT 互联网开源编程书籍免费阅读与下载。"
  },
  {
    "title": "Design Guidelines",
    "url": "http://designguidelines.co/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "资讯学习",
    "term": "设计规范",
    "description": "Design Guidelines &mdash; The way products are built."
  },
  {
    "title": "Awesome design systems",
    "url": "https://github.com/alexpate/awesome-design-systems",
    "type": "nav",
    "priority": 10,
    "taxonomy": "资讯学习",
    "term": "设计规范",
    "description": "A collection of awesome design systems."
  },
  {
    "title": "Material Design",
    "url": "https://material.io/guidelines/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "资讯学习",
    "term": "设计规范",
    "description": "Introduction - Material Design."
  },
  {
    "title": "Human Interface Guidelines",
    "url": "https://developer.apple.com/ios/human-interface-guidelines",
    "type": "nav",
    "priority": 10,
    "taxonomy": "资讯学习",
    "term": "设计规范",
    "description": "Human Interface Guidelines iOS."
  },
  {
    "title": "Photoshop Etiquette",
    "url": "http://viggoz.com/photoshopetiquette/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "资讯学习",
    "term": "设计规范",
    "description": "PS礼仪-WEB设计指南。"
  },
  {
    "title": "Photoshop Lady",
    "url": "http://www.photoshoplady.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "资讯学习",
    "term": "视频教程",
    "description": "Your Favourite Photoshop Tutorials in One Place."
  },
  {
    "title": "doyoudo",
    "url": "http://doyoudo.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "资讯学习",
    "term": "视频教程",
    "description": "创意设计软件学习平台。"
  },
  {
    "title": "没位道",
    "url": "http://www.c945.com/web-ui-tutorial/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "资讯学习",
    "term": "视频教程",
    "description": "WEB UI免费视频公开课。"
  },
  {
    "title": "慕课网",
    "url": "https://www.imooc.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "资讯学习",
    "term": "视频教程",
    "description": "程序员的梦工厂（有UI课程）。"
  },
  {
    "title": "ai工具集",
    "url": "https://ai-bot.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "AI导航",
    "description": "ai工具集"
  },
  {
    "title": "ai工具集2",
    "url": "https://www.ailookme.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "AI导航",
    "description": "ai工具集"
  },
  {
    "title": "秘塔写作猫",
    "url": "https://xiezuocat.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "AI写作",
    "description": "AI写作，文章自成"
  },
  {
    "title": "Midjourney",
    "url": "https://www.midjourney.com/home",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "AI图像",
    "description": "AI图像和插画生成工具"
  },
  {
    "title": "Runway",
    "url": "https://runwayml.com/green-screen/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "AI视频工具",
    "description": "Runway最开始是一个供创作人员以直观的方式使用机器学习工具的平台，而不需要任何编码经验，用于视频、音频和文本等媒体。Runway的AI Magic Tools目前提供了超过了30+的AI工具，在Runway上，用户可以创建并发布预先训练好的机器学习模型，用于生成逼真的图像或视频等应用。用户还可以训练自己的模型，并直接从GitHub导入新的模型。"
  },
  {
    "title": "aippt",
    "url": "https://www.aippt.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "AI办公工具",
    "description": "AiPPT是一款AI驱动的PPT在线生成工具，无需复杂操作，只需要输入主题，AI 即可一键生成高质量PPT。支持在线自定义编辑和文档导入生成，配置超10w+定制级PPT模板及素材，助力快速产出专业级PPT。"
  },
  {
    "title": "ai设计logo--looka.com",
    "url": "https://looka.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "AI设计工具",
    "description": "AI在线生成和设计logo"
  },
  {
    "title": "文心一言",
    "url": "http://www.photoshoplady.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "AI对话工具",
    "description": "百度的"
  },
  {
    "title": "copilot",
    "url": "https://github.com/features/copilot",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "AI编程工具",
    "description": "GitHub Copilot是由GitHub与OpenAI合作开发的一款革命性的智能代码补全和生成工具，旨在帮助开发人员更高效、更准确、更快地编写代码。这款由人工智能驱动的"
  },
  {
    "title": "网易天音",
    "url": "https://tianyin.music.163.com/#/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "AI音频工具",
    "description": "网易天音是网易云音乐推出的一站式Ai音乐工具，无需乐理知识，一键上手。音乐爱好者或者歌手只需输入灵感，AI便可以辅助完成词、曲、编、唱，生成AI初稿后，支持词曲协同调整。"
  },
  {
    "title": "Deel翻译",
    "url": "https://www.deepl.com/translator",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "AI语言翻译",
    "description": "DeepL翻译器是一款集合了深度学习、神经网络算法、大数据等先进技术的新一代"
  },
  {
    "title": "gptzero",
    "url": "https://gptzero.me/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "AI内容检测",
    "description": "GPTZero是一款检测人工智能生成内容的工具，旨在识别和分析输入的文本是否是由AI创建的，区分人类创作和人工智能生成的内容。该工具支持句子、段落和文档级别的AI内容检测，由普林斯顿大学的Edaward Tian开发并于2023年1月上线，以回应业界对AI生成内容原创度和抄袭的担忧，一经上线便获得了各大媒体如纽约时报、华盛顿时报、福布斯、连线杂志等的关注和报道。GPTZero 累计已为全球超过 250 万用户提供服务，并与 100 多个教育、招聘、出版、法律等领域的组织合作。"
  },
  {
    "title": "flowgpt",
    "url": "https://flowgpt.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "AI提示指令",
    "description": "chatgpt指令大全"
  },
  {
    "title": "阿里人工智能学习路线",
    "url": "https://developer.aliyun.com/learning/roadmap/ai",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "AI学习网站",
    "description": "阿里云作为国内领先的云服务，其开发者社区提供了一条完整的人工智能学习路线，旨在帮助用户从入门到进阶掌握人工智能领域的知识和技能。该路线包含了30门在线课程和22个实战案例，分为以下5大学习阶段："
  },
  {
    "title": "Ollama",
    "url": "https://ollama.ai/?ref=ai-bot.cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "最新收录",
    "description": "本地运行Llama和其他大语言模型"
  },
  {
    "title": "JetBrains AI",
    "url": "https://www.jetbrains.com/ai/?ref=ai-bot.cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "最新收录",
    "description": "JetBrains推出的AI编程开发助手"
  },
  {
    "title": "知犀AI",
    "url": "https://www.swdt.com/?ref=ai-bot.cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "最新收录",
    "description": "知犀推出的AI思维导图生成工具"
  },
  {
    "title": "快转字幕",
    "url": "https://www.kzzimu.com/?ref=ai-bot.cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "最新收录",
    "description": "AI语音视频转文字和字幕的工具"
  },
  {
    "title": "代码小浣熊Raccoon",
    "url": "https://code.sensetime.com/?ref=ai-bot.cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "最新收录",
    "description": "商汤科技推出的智能AI编程助手"
  },
  {
    "title": "PMAI",
    "url": "https://www.pm-ai.cn/?utm_source=NoKVb4O",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "最新收录",
    "description": "面向产品经理的AI助手"
  },
  {
    "title": "Midjourney",
    "url": "https://cn.bing.com/search?q=Midjourney&ensearch=1",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "AI图像和插画生成工具"
  },
  {
    "title": "Stable Diffusion",
    "url": "https://cn.bing.com/search?q=Stable%20Diffusion&ensearch=1",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "StabilityAI推出的文本到图像生成AI"
  },
  {
    "title": "Bing Image Creator",
    "url": "https://cn.bing.com/create",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "微软必应推出的基于DALL·E的AI图像生成工具"
  },
  {
    "title": "标小智Logo生成",
    "url": "https://www.logosc.cn/?utm_source=ai-bot.cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "人工智能AI生成Logo设计工具"
  },
  {
    "title": "Upscayl",
    "url": "https://www.upscayl.org/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "免费开源的AI图片无损放大工具"
  },
  {
    "title": "Ribbet.ai",
    "url": "https://ribbet.ai/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "免费的多功能AI图片处理工具箱"
  },
  {
    "title": "remove.bg",
    "url": "https://www.remove.bg/zh?aid=kkgjrdhppgtrhbyn&utm_campaign=affiliate+marketing&utm_medium=referral&utm_source=affiliate",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "强大的AI图片背景移除工具"
  },
  {
    "title": "ARC",
    "url": "https://arc.tencent.com/zh/ai-demos/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "腾讯旗下ARC实验室推出的免费AI图片处理工具"
  },
  {
    "title": "文心一格",
    "url": "https://yige.baidu.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "AI艺术和创意辅助平台"
  },
  {
    "title": "通义万相",
    "url": "https://wanxiang.aliyun.com/?utm_source=ai-bot.cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "阿里最新推出的AI绘画创作模型"
  },
  {
    "title": "造梦日记",
    "url": "https://zmrj.art/?utm_source=ai-bot.cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "AI一下，妙笔生画"
  },
  {
    "title": "美图AI文生图",
    "url": "https://design.meitu.com/aigc/text-to-image?from=ai-bot.cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "美图推出的AI文本生成图片的工具"
  },
  {
    "title": "Dreamina",
    "url": "https://www.capcut.cn/ai-tool/?ref=ai-bot.cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "抖音旗下推出的AI图片创作工具"
  },
  {
    "title": "秒画",
    "url": "https://miaohua.sensetime.com/zh-CN",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "商汤科技推出的免费AI作画和图片生成平台"
  },
  {
    "title": "简单AI",
    "url": "https://ai.sohu.com/search?_trans_=000019_aidhlltj",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "搜狐最新推出的AI图片生成平台"
  },
  {
    "title": "触手AI绘画",
    "url": "http://douchu.ai/warehouse/styleStore?inviteCode=677102&channel=channel_invite",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "免费专业的AI绘画/模型/分享平台"
  },
  {
    "title": "WHEE",
    "url": "https://www.whee.com/?utm_source=ai-bot.cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "美图最新推出的AI图片和绘画创作生成平台"
  },
  {
    "title": "堆友AI反应堆",
    "url": "https://d.design/?from=aibot",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "阿里旗下堆友推出的多风格AI绘画生成器"
  },
  {
    "title": "LiblibAI·哩布哩布AI",
    "url": "https://cn.bing.com/search?q=LiblibAI%C2%B7%E5%93%A9%E5%B8%83%E5%93%A9%E5%B8%83AI&ensearch=1",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "国内领先的AI图像创作平台和模型分享社区"
  },
  {
    "title": "创客贴AI画匠",
    "url": "https://aiart.chuangkit.com/landingpage",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "创客贴推出的AI艺术画生成工具"
  },
  {
    "title": "网易AI创意工坊",
    "url": "https://ke.study.163.com/artWorks/painting?utm_source=ai-bot.cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "网易云课堂推出的AI作画平台，在线使用Stable Diffusion出图"
  },
  {
    "title": "6pen Art",
    "url": "https://6pen.art/?utm_source=ai-bot.cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "面包多团队推出的从文本描述生成绘画艺术作品"
  },
  {
    "title": "Adobe Firefly",
    "url": "https://cn.bing.com/search?q=Adobe%20Firefly&ensearch=1",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "Adobe最新推出的AI图片生成工具"
  },
  {
    "title": "画宇宙",
    "url": "https://creator.nolibox.com/?utm_source=ai-bot.cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "人工智能AI作画网站"
  },
  {
    "title": "Visual Electric",
    "url": "https://cn.bing.com/search?q=Visual%20Electric&ensearch=1",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "专业的高质量AI图像创作工具"
  },
  {
    "title": "Pic Copilot",
    "url": "https://www.piccopilot.com/?ref=ai-bot.cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "阿里国际推出的AI商品营销图工具"
  },
  {
    "title": "Imagine with Meta",
    "url": "https://cn.bing.com/search?q=Imagine%20with%20Meta&ensearch=1",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "Meta最新推出的在线AI图像生成器"
  },
  {
    "title": "图查查",
    "url": "https://chacha.so.com/home?utm_source=ai-bot.cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "360推出的AI作图平台，提供智能抠图、智能消除、智能放大、智能配图等功能"
  },
  {
    "title": "Freepik AI Image Generator",
    "url": "https://cn.bing.com/search?q=Freepik%20AI%20Image%20Generator&ensearch=1",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "Freepik最新推出的AI图片生成工具"
  },
  {
    "title": "Canva AI图像生成",
    "url": "https://cn.bing.com/search?q=Canva%20AI%E5%9B%BE%E5%83%8F%E7%94%9F%E6%88%90&ensearch=1",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "在线设计工具Canva推出的AI图像生成工具"
  },
  {
    "title": "Stockimg AI",
    "url": "https://cn.bing.com/search?q=Stockimg%20AI&ensearch=1",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "AI生成各种类型的图像和插画"
  },
  {
    "title": "Stable Doodle",
    "url": "https://clipdrop.co/stable-doodle",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "StabilityAI最新推出的将手绘草图转换成精美图像的工具"
  },
  {
    "title": "ClipDrop",
    "url": "https://clipdrop.co/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "Stability.ai推出的AI图片处理系列工具"
  },
  {
    "title": "Leonardo.ai",
    "url": "https://leonardo.ai/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "AI创建精美的游戏插画资产"
  },
  {
    "title": "稿定抠图",
    "url": "https://koutu.gaoding.com/utms/e3717a090a6a42c180e2c273dcf8eed8",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "稿定设计推出的AI自动消除背景工具"
  },
  {
    "title": "PhotoRoom",
    "url": "https://www.photoroom.com/background-remover",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "免费的AI图片背景移除和添加"
  },
  {
    "title": "美图抠图",
    "url": "https://cutout.meitu.com/?utm_source=ai-bot.cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "美图秀秀推出的AI智能抠图工具，一键移除背景"
  },
  {
    "title": "MagicStudio",
    "url": "https://magicstudio.com/zh",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "高颜值AI图像处理工具"
  },
  {
    "title": "Booltool",
    "url": "https://booltool.boolv.tech/home",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "在线AI图像工具箱"
  },
  {
    "title": "Cutout.Pro",
    "url": "https://www.cutout.pro/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "AI在线处理图片"
  },
  {
    "title": "悟空图像PhotoSir",
    "url": "https://www.photosir.com/?ref=ai-bot.cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "新一代专业图像处理软件，更智能、更高效、更好用"
  },
  {
    "title": "Graviti Diffus",
    "url": "https://www.diffus.graviti.com/?utm_source=tool&utm_medium=referral&utm_campaign=aibot",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "开箱即用的 Stable Diffusion WebUI 在线图像生成服务"
  },
  {
    "title": "AiPPT",
    "url": "https://www.aippt.cn/?utm_type=Navweb&utm_source=ai-bot&utm_page=aippt&utm_plan=ppt&utm_unit=AIPPT&utm_keyword=50608",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "AI快速生成高质量PPT"
  },
  {
    "title": "美图AI PPT",
    "url": "https://www.x-design.com/ppt/?from=ai-bot.cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "美图秀秀推出的免费在线AI生成PPT设计工具"
  },
  {
    "title": "Gamma App",
    "url": "https://gamma.app/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "AI幻灯片演示生成工具"
  },
  {
    "title": "Decktopus AI",
    "url": "https://www.decktopus.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "AI驱动的的在线演示文稿生成器"
  },
  {
    "title": "Tome",
    "url": "https://tome.app/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "AI创作叙事性幻灯片"
  },
  {
    "title": "讯飞智文",
    "url": "https://zhiwen.xfyun.cn/?utm_source=ai-bot.cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "科大讯飞推出的免费AI PPT生成工具"
  },
  {
    "title": "ChatBA",
    "url": "https://www.chatba.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "AI幻灯片生成工具"
  },
  {
    "title": "Powerpresent AI",
    "url": "https://powerpresent.ai/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "AI创建精美的演示稿"
  },
  {
    "title": "beautiful.ai",
    "url": "https://www.beautiful.ai/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "AI创建展示幻灯片"
  },
  {
    "title": "Chronicle",
    "url": "https://chroniclehq.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "AI高颜值演示文稿创建"
  },
  {
    "title": "Presentations.AI",
    "url": "https://www.presentations.ai/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "演示文档版的ChatGPT"
  },
  {
    "title": "SlidesAI",
    "url": "https://www.slidesai.io/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "AI快速创建演示幻灯片"
  },
  {
    "title": "歌者AI",
    "url": "https://gezhe.caixuan.cc/?ref=ai-bot.cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "彩漩PPT推出的AI PPT生成工具"
  },
  {
    "title": "ChatPPT",
    "url": "https://chat-ppt.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "必优科技推出的国内首个中文AI生成PPT的办公产品"
  },
  {
    "title": "auxi",
    "url": "https://www.auxi.ai/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "功能强大的PowerPoint AI插件"
  },
  {
    "title": "MindShow",
    "url": "https://www.mindshow.fun/?ref=ai-bot.cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "AI学习",
    "term": "emptyGroup",
    "description": "国内独立开发者开发的输入内容自动生成演示工具"
  },
  {
    "title": "xinghuoxfyuncn",
    "url": "https://xinghuo.xfyun.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "科技酷站",
    "term": "科技酷站",
    "description": "国内可用免费AI模型"
  },
  {
    "title": "anitabicn",
    "url": "https://anitabi.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "科技酷站",
    "term": "科技酷站",
    "description": "(๑•̀ㅂ•́)و✧"
  },
  {
    "title": "aichpoemnet",
    "url": "https://www.aichpoem.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "科技酷站",
    "term": "科技酷站",
    "description": "AI在线诗歌写作平台"
  },
  {
    "title": "ai-botcn",
    "url": "https://ai-bot.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "科技酷站",
    "term": "科技酷站",
    "description": "国内外AI工具集合"
  },
  {
    "title": "chat-shared3zhileio",
    "url": "https://chat-shared3.zhile.io/shared.html",
    "type": "nav",
    "priority": 10,
    "taxonomy": "科技酷站",
    "term": "科技酷站",
    "description": "免费 ChatGPT 体验"
  },
  {
    "title": "newzonetop",
    "url": "https://newzone.top/chatgpt/cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "科技酷站",
    "term": "科技酷站",
    "description": "ChatGPT快捷指令表"
  },
  {
    "title": "piskelappcom",
    "url": "https://www.piskelapp.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "科技酷站",
    "term": "科技酷站",
    "description": "手动绘制GIF像素画"
  },
  {
    "title": "sdxlturboai",
    "url": "https://sdxlturbo.ai/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "科技酷站",
    "term": "科技酷站",
    "description": "实时 AI 绘画生成"
  },
  {
    "title": "perplexityai",
    "url": "https://www.perplexity.ai/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "科技酷站",
    "term": "科技酷站",
    "description": "AI 问答网站"
  },
  {
    "title": "bjimmylvcn",
    "url": "https://b.jimmylv.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "科技酷站",
    "term": "科技酷站",
    "description": "一键总结音视频内容"
  },
  {
    "title": "giteecom",
    "url": "https://gitee.com/click33/chatgpt---mirror-station-summary",
    "type": "nav",
    "priority": 10,
    "taxonomy": "科技酷站",
    "term": "科技酷站",
    "description": "免费ChatGPT站点列表"
  },
  {
    "title": "waifulabscom",
    "url": "https://waifulabs.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "科技酷站",
    "term": "科技酷站",
    "description": "二次元头像生成器"
  },
  {
    "title": "poecom",
    "url": "https://poe.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "科技酷站",
    "term": "科技酷站",
    "description": "多模型AI智能机器人"
  },
  {
    "title": "classicqrbtfcom",
    "url": "https://classic.qrbtf.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "科技酷站",
    "term": "科技酷站",
    "description": "让你的二维码与众不同"
  },
  {
    "title": "whatslinkinfo",
    "url": "https://whatslink.info/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "科技酷站",
    "term": "科技酷站",
    "description": "磁力链接内容预览"
  },
  {
    "title": "airandomimageart",
    "url": "https://airandomimage.art/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "科技酷站",
    "term": "科技酷站",
    "description": "AI随机美女生成器"
  },
  {
    "title": "chatbulitanet",
    "url": "https://chat.bulita.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "科技酷站",
    "term": "科技酷站",
    "description": "AI聊天室"
  },
  {
    "title": "scholargooglecom",
    "url": "https://scholar.google.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "学术搜索",
    "term": "学术搜索",
    "description": "不解释"
  },
  {
    "title": "xueshubaiducom",
    "url": "https://xueshu.baidu.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "学术搜索",
    "term": "学术搜索",
    "description": "(๑•̀ㅂ•́)و✧"
  },
  {
    "title": "scholarchongbuluocom",
    "url": "https://scholar.chongbuluo.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "学术搜索",
    "term": "学术搜索",
    "description": "超强聚合资料搜索网站"
  },
  {
    "title": "cn-kinet",
    "url": "https://www.cn-ki.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "学术搜索",
    "term": "学术搜索",
    "description": "免费期刊论文检索"
  },
  {
    "title": "koovincom",
    "url": "http://www.koovin.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "学术搜索",
    "term": "学术搜索",
    "description": "免费文献资源共享平台"
  },
  {
    "title": "cnknoemacom",
    "url": "https://cn.knoema.com/atlas",
    "type": "nav",
    "priority": 10,
    "taxonomy": "学术搜索",
    "term": "学术搜索",
    "description": "世界各国统计资料数据"
  },
  {
    "title": "oalibcom",
    "url": "https://www.oalib.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "学术搜索",
    "term": "学术搜索",
    "description": "免费学术论文搜索下载"
  },
  {
    "title": "sci-hubst",
    "url": "https://sci-hub.st/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "学术搜索",
    "term": "学术搜索",
    "description": "全球最大的免费论文库"
  },
  {
    "title": "libgenvg",
    "url": "https://libgen.vg/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "学术搜索",
    "term": "学术搜索",
    "description": "全球免费书籍期刊下载"
  },
  {
    "title": "yandexcom",
    "url": "https://yandex.com/images/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "以图搜图",
    "term": "以图搜图",
    "description": "搜图王者，效果惊艳！"
  },
  {
    "title": "googlecom",
    "url": "https://www.google.com/imghp",
    "type": "nav",
    "priority": 10,
    "taxonomy": "以图搜图",
    "term": "以图搜图",
    "description": "效果可以"
  },
  {
    "title": "imagebaiducom",
    "url": "https://image.baidu.com/?fr=shitu",
    "type": "nav",
    "priority": 10,
    "taxonomy": "以图搜图",
    "term": "以图搜图",
    "description": "可以用"
  },
  {
    "title": "saucenaocom",
    "url": "https://saucenao.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "以图搜图",
    "term": "以图搜图",
    "description": "搜索插画作品效果极好"
  },
  {
    "title": "tracemoe",
    "url": "https://trace.moe/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "以图搜图",
    "term": "以图搜图",
    "description": "动漫截图识别找原作"
  },
  {
    "title": "cnbingcom",
    "url": "https://cn.bing.com/visualsearch",
    "type": "nav",
    "priority": 10,
    "taxonomy": "以图搜图",
    "term": "以图搜图",
    "description": "生活物品场景识别搜索"
  },
  {
    "title": "zhannas-archiveorg",
    "url": "https://zh.annas-archive.org/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "电子书搜索",
    "term": "电子书搜索",
    "description": "影子图书馆搜索引擎"
  },
  {
    "title": "kgbookcom",
    "url": "https://kgbook.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "电子书搜索",
    "term": "电子书搜索",
    "description": "资源多/免登录"
  },
  {
    "title": "jiumodiarycom",
    "url": "https://www.jiumodiary.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "电子书搜索",
    "term": "电子书搜索",
    "description": "聚合文档搜索引擎"
  },
  {
    "title": "wereadqqcom",
    "url": "https://weread.qq.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "电子书搜索",
    "term": "电子书搜索",
    "description": "(๑•̀ㅂ•́)و✧"
  },
  {
    "title": "newshugeorg",
    "url": "https://new.shuge.org/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "电子书搜索",
    "term": "电子书搜索",
    "description": "在线古籍图书馆"
  },
  {
    "title": "sobooksnet",
    "url": "https://sobooks.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "电子书搜索",
    "term": "电子书搜索",
    "description": "资源多/格式全/需扫码"
  },
  {
    "title": "giffoxcom",
    "url": "https://www.giffox.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "电子书搜索",
    "term": "电子书搜索",
    "description": "最佳图书聚合搜索网站"
  },
  {
    "title": "shuyishenmezhideducom",
    "url": "https://shuyi.shenmezhidedu.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "电子书搜索",
    "term": "电子书搜索",
    "description": "不错的导航网站"
  },
  {
    "title": "shuxiangjiacn",
    "url": "http://www.shuxiangjia.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "电子书搜索",
    "term": "电子书搜索",
    "description": "电子书站点超多"
  },
  {
    "title": "ituringcomcn",
    "url": "https://www.ituring.com.cn/book?tab=free",
    "type": "nav",
    "priority": 10,
    "taxonomy": "电子书搜索",
    "term": "电子书搜索",
    "description": "计算机书籍在线阅读"
  },
  {
    "title": "gujiguancom",
    "url": "https://www.gujiguan.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "电子书搜索",
    "term": "电子书搜索",
    "description": "古文献典籍资源库"
  },
  {
    "title": "jb51net",
    "url": "https://www.jb51.net/books/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "电子书搜索",
    "term": "电子书搜索",
    "description": "免登录"
  },
  {
    "title": "haodoonet",
    "url": "http://www.haodoo.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "电子书搜索",
    "term": "电子书搜索",
    "description": "繁体书籍免费阅读下载"
  },
  {
    "title": "banshujiangcn",
    "url": "http://www.banshujiang.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "电子书搜索",
    "term": "电子书搜索",
    "description": "计算机书籍"
  },
  {
    "title": "freexiaoshuocom",
    "url": "http://www.freexiaoshuo.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "电子书搜索",
    "term": "电子书搜索",
    "description": "TXT小说下载"
  },
  {
    "title": "liber3ethlimo",
    "url": "https://liber3.eth.limo/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "电子书搜索",
    "term": "电子书搜索",
    "description": "电子书下载"
  },
  {
    "title": "freembookcom",
    "url": "https://freembook.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "电子书搜索",
    "term": "电子书搜索",
    "description": "电子书搜索"
  },
  {
    "title": "searchyibookorg",
    "url": "https://search.yibook.org/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "电子书搜索",
    "term": "电子书搜索",
    "description": "电子书聚合搜索引擎"
  },
  {
    "title": "mianfei22com",
    "url": "https://mianfei22.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "电子书搜索",
    "term": "电子书搜索",
    "description": "免费小说阅读网"
  },
  {
    "title": "book123info",
    "url": "https://www.book123.info/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "电子书搜索",
    "term": "电子书搜索",
    "description": "免费电子书下载"
  },
  {
    "title": "owlookcomcn",
    "url": "https://owlook.com.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "电子书搜索",
    "term": "电子书搜索",
    "description": "网络小说搜索引擎"
  },
  {
    "title": "boyunsocom",
    "url": "https://www.boyunso.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "电子书搜索",
    "term": "电子书搜索",
    "description": "通过关键词搜小说名"
  },
  {
    "title": "shidiangujicom",
    "url": "https://www.shidianguji.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "电子书搜索",
    "term": "电子书搜索",
    "description": "古籍在线阅读平台"
  },
  {
    "title": "qidiantucom",
    "url": "https://www.qidiantu.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "电子书搜索",
    "term": "电子书搜索",
    "description": "起点小说数据"
  },
  {
    "title": "panquarkcn",
    "url": "https://pan.quark.cn/s/a12637f69f89",
    "type": "nav",
    "priority": 10,
    "taxonomy": "壁纸美图",
    "term": "壁纸美图",
    "description": "精选壁纸美图打包"
  },
  {
    "title": "wallhavencc",
    "url": "https://wallhaven.cc/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "壁纸美图",
    "term": "壁纸美图",
    "description": "强烈推荐"
  },
  {
    "title": "bzzzzmhcn",
    "url": "https://bz.zzzmh.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "壁纸美图",
    "term": "壁纸美图",
    "description": "速度快/体验好"
  },
  {
    "title": "wallpapercavecom",
    "url": "https://wallpapercave.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "壁纸美图",
    "term": "壁纸美图",
    "description": "类型非常有趣"
  },
  {
    "title": "anime-picturesnet",
    "url": "https://anime-pictures.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "壁纸美图",
    "term": "壁纸美图",
    "description": "(๑•̀ㅂ•́)و✧"
  },
  {
    "title": "backieecom",
    "url": "https://backiee.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "壁纸美图",
    "term": "壁纸美图",
    "description": "支持全平台客户端"
  },
  {
    "title": "simpledesktopscom",
    "url": "http://simpledesktops.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "壁纸美图",
    "term": "壁纸美图",
    "description": "极简风格插画"
  },
  {
    "title": "konachannet",
    "url": "https://konachan.net/post",
    "type": "nav",
    "priority": 10,
    "taxonomy": "壁纸美图",
    "term": "壁纸美图",
    "description": "插画/二次元作品"
  },
  {
    "title": "alphacoderscom",
    "url": "https://alphacoders.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "壁纸美图",
    "term": "壁纸美图",
    "description": "各种类型资源极多"
  },
  {
    "title": "wallpaperscraftcom",
    "url": "https://wallpaperscraft.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "壁纸美图",
    "term": "壁纸美图",
    "description": "类型多/功能实用"
  },
  {
    "title": "dpmorgcn",
    "url": "https://www.dpm.org.cn/lights/royal.html",
    "type": "nav",
    "priority": 10,
    "taxonomy": "壁纸美图",
    "term": "壁纸美图",
    "description": "故宫博物院官方"
  },
  {
    "title": "esoorg",
    "url": "https://www.eso.org/public/images",
    "type": "nav",
    "priority": 10,
    "taxonomy": "壁纸美图",
    "term": "壁纸美图",
    "description": "宇宙/天文爱好者必备"
  },
  {
    "title": "wallpaperhubapp",
    "url": "https://wallpaperhub.app/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "壁纸美图",
    "term": "壁纸美图",
    "description": "高质量壁纸平台"
  },
  {
    "title": "photoihansenorg",
    "url": "https://photo.ihansen.org/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "壁纸美图",
    "term": "壁纸美图",
    "description": "高质量图片免费下载"
  },
  {
    "title": "pixiviccom",
    "url": "https://pixivic.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "壁纸美图",
    "term": "壁纸美图",
    "description": "P站排行榜浏览"
  },
  {
    "title": "wallspiccom",
    "url": "https://wallspic.com/cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "壁纸美图",
    "term": "壁纸美图",
    "description": "高质量壁纸下载"
  },
  {
    "title": "wallroomio",
    "url": "https://wallroom.io/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "壁纸美图",
    "term": "壁纸美图",
    "description": "高分辨率壁纸下载"
  },
  {
    "title": "3gbizhicom",
    "url": "https://www.3gbizhi.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "壁纸美图",
    "term": "壁纸美图",
    "description": "手机壁纸大全"
  },
  {
    "title": "bingee123net",
    "url": "https://bing.ee123.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "壁纸美图",
    "term": "壁纸美图",
    "description": "每日一图"
  },
  {
    "title": "appnguaduotcn",
    "url": "https://app.nguaduot.cn/timeline",
    "type": "nav",
    "priority": 10,
    "taxonomy": "壁纸美图",
    "term": "壁纸美图",
    "description": "22个壁纸图库"
  },
  {
    "title": "pixivjsorg",
    "url": "https://pixiv.js.org/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "壁纸美图",
    "term": "壁纸美图",
    "description": "Pixiv图片浏览下载"
  },
  {
    "title": "pixabaycom",
    "url": "https://pixabay.com/zh/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "素材资源",
    "description": "免费正版高清图片库"
  },
  {
    "title": "unsplashcom",
    "url": "https://unsplash.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "素材资源",
    "description": "免费素材照片"
  },
  {
    "title": "pexelscom",
    "url": "https://www.pexels.com/zh-cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "素材资源",
    "description": "免费图片素材"
  },
  {
    "title": "pexelscom",
    "url": "https://www.pexels.com/zh-cn/videos/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "素材资源",
    "description": "免费视频素材"
  },
  {
    "title": "gaodingcom",
    "url": "https://www.gaoding.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "素材资源",
    "description": "在线设计工具/海量素材"
  },
  {
    "title": "thestocksim",
    "url": "http://thestocks.im/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "素材资源",
    "description": "最佳免费素材聚合搜索"
  },
  {
    "title": "logosccn",
    "url": "https://www.logosc.cn/so/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "素材资源",
    "description": "免费版权图片一键搜索"
  },
  {
    "title": "iconfontcn",
    "url": "https://www.iconfont.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "素材资源",
    "description": "阿里巴巴矢量图标库"
  },
  {
    "title": "igoutucn",
    "url": "https://igoutu.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "素材资源",
    "description": "免费图标/剪贴画/音乐"
  },
  {
    "title": "giphycom",
    "url": "https://giphy.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "素材资源",
    "description": "动图搜索&制作"
  },
  {
    "title": "100fontcom",
    "url": "https://www.100font.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "素材资源",
    "description": "免费字体下载"
  },
  {
    "title": "mfsc123com",
    "url": "https://www.mfsc123.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "素材资源",
    "description": "免费图片/视频/音频搜索"
  },
  {
    "title": "apphaikeiapp",
    "url": "https://app.haikei.app/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "素材资源",
    "description": "配图背景生成器"
  },
  {
    "title": "tosoundcom",
    "url": "https://www.tosound.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "素材资源",
    "description": "免费音效素材资源"
  },
  {
    "title": "yesiconapp",
    "url": "https://yesicon.app/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "素材资源",
    "description": "免费矢量图标库"
  },
  {
    "title": "coolbackgroundsio",
    "url": "https://coolbackgrounds.io/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "素材资源",
    "description": "渐变背景生成器"
  },
  {
    "title": "jiandanlink",
    "url": "https://www.jiandan.link/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "素材资源",
    "term": "素材资源",
    "description": "快速制作封面图片"
  },
  {
    "title": "bilibilicom",
    "url": "https://www.bilibili.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线动漫",
    "term": "在线动漫",
    "description": "(゜-゜)つロ 干杯~"
  },
  {
    "title": "agedmorg",
    "url": "https://www.agedm.org/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线动漫",
    "term": "在线动漫",
    "description": "在线/客户端"
  },
  {
    "title": "mitangtv",
    "url": "https://www.mitang.tv/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线动漫",
    "term": "在线动漫",
    "description": "在线观看"
  },
  {
    "title": "anime1me",
    "url": "https://anime1.me/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线动漫",
    "term": "在线动漫",
    "description": "在线观看"
  },
  {
    "title": "bimiacg4net",
    "url": "https://www.bimiacg4.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线动漫",
    "term": "在线动漫",
    "description": "在线观看"
  },
  {
    "title": "yhmgocom",
    "url": "https://www.yhmgo.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线动漫",
    "term": "在线动漫",
    "description": "在线观看"
  },
  {
    "title": "nyafunnet",
    "url": "https://www.nyafun.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线动漫",
    "term": "在线动漫",
    "description": "在线观看"
  },
  {
    "title": "hmacgcn",
    "url": "https://hmacg.cn/bangumi/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线动漫",
    "term": "在线动漫",
    "description": "H萌动漫新番追番表"
  },
  {
    "title": "yucwiki",
    "url": "https://yuc.wiki/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线动漫",
    "term": "在线动漫",
    "description": "动漫新番表/放送平台"
  },
  {
    "title": "bgmlistcom",
    "url": "https://bgmlist.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线动漫",
    "term": "在线动漫",
    "description": "番剧放送信息"
  },
  {
    "title": "missevancom",
    "url": "https://www.missevan.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线动漫",
    "term": "在线动漫",
    "description": "来自二次元的声音"
  },
  {
    "title": "lldmnet",
    "url": "https://www.lldm.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线动漫",
    "term": "在线动漫",
    "description": "在线观看"
  },
  {
    "title": "zxzjacom",
    "url": "https://www.zxzja.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "影视追剧",
    "term": "影视追剧",
    "description": "在线观看/度盘下载"
  },
  {
    "title": "novipnoadnet",
    "url": "https://www.novipnoad.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "影视追剧",
    "term": "影视追剧",
    "description": "在线观看"
  },
  {
    "title": "cupfoxapp",
    "url": "https://cupfox.app/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "影视追剧",
    "term": "影视追剧",
    "description": "影视资源聚合搜索引擎"
  },
  {
    "title": "tvcctvcom",
    "url": "https://tv.cctv.com/yxg",
    "type": "nav",
    "priority": 10,
    "taxonomy": "影视追剧",
    "term": "影视追剧",
    "description": "央视电视剧/动画片/纪录片"
  },
  {
    "title": "ddyspro",
    "url": "https://ddys.pro/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "影视追剧",
    "term": "影视追剧",
    "description": "在线观看"
  },
  {
    "title": "meijuttvip",
    "url": "https://www.meijutt.vip/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "影视追剧",
    "term": "影视追剧",
    "description": "在线/磁力/度盘/迅雷"
  },
  {
    "title": "yyetsclick",
    "url": "https://yyets.click/home",
    "type": "nav",
    "priority": 10,
    "taxonomy": "影视追剧",
    "term": "影视追剧",
    "description": "电驴/磁力/网盘下载"
  },
  {
    "title": "gazerun",
    "url": "https://gaze.run/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "影视追剧",
    "term": "影视追剧",
    "description": "在线观看"
  },
  {
    "title": "czzy22com",
    "url": "https://www.czzy22.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "影视追剧",
    "term": "影视追剧",
    "description": "在线观看"
  },
  {
    "title": "dianyinggoucom",
    "url": "https://www.dianyinggou.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "影视追剧",
    "term": "影视追剧",
    "description": "聚合影视搜索引擎"
  },
  {
    "title": "soupianpro",
    "url": "https://soupian.pro/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "影视追剧",
    "term": "影视追剧",
    "description": "聚合影视搜索引擎"
  },
  {
    "title": "dianying",
    "url": "https://dianyi.ng/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "影视追剧",
    "term": "影视追剧",
    "description": "在线观看"
  },
  {
    "title": "dy2018com",
    "url": "https://www.dy2018.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "影视追剧",
    "term": "影视追剧",
    "description": "磁力下载"
  },
  {
    "title": "mcarvip",
    "url": "https://mcar.vip/forum-oumeijuji-1.html",
    "type": "nav",
    "priority": 10,
    "taxonomy": "影视追剧",
    "term": "影视追剧",
    "description": "欧美剧集追剧下载"
  },
  {
    "title": "subhdtv",
    "url": "https://subhd.tv/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "影视追剧",
    "term": "影视追剧",
    "description": "字幕下载"
  },
  {
    "title": "zimukuorg",
    "url": "https://zimuku.org/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "影视追剧",
    "term": "影视追剧",
    "description": "字幕下载"
  },
  {
    "title": "assrtnet",
    "url": "https://assrt.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "影视追剧",
    "term": "影视追剧",
    "description": "字幕下载"
  },
  {
    "title": "koxmoe",
    "url": "https://kox.moe/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "漫画阅读",
    "term": "漫画阅读",
    "description": "EPUB/MOBI漫画下载"
  },
  {
    "title": "manhuadmzjcom",
    "url": "http://manhua.dmzj.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "漫画阅读",
    "term": "漫画阅读",
    "description": "在线阅读/追漫"
  },
  {
    "title": "manhuadbcom",
    "url": "https://www.manhuadb.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "漫画阅读",
    "term": "漫画阅读",
    "description": "日本漫画大全"
  },
  {
    "title": "gufengmhcom",
    "url": "https://www.gufengmh.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "漫画阅读",
    "term": "漫画阅读",
    "description": "在线阅读"
  },
  {
    "title": "mangabzcom",
    "url": "https://mangabz.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "漫画阅读",
    "term": "漫画阅读",
    "description": "在线漫画阅读第一站"
  },
  {
    "title": "fffdmcom",
    "url": "https://www.fffdm.com/manhua/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "漫画阅读",
    "term": "漫画阅读",
    "description": "在线阅读"
  },
  {
    "title": "baozimhcom",
    "url": "https://www.baozimh.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "漫画阅读",
    "term": "漫画阅读",
    "description": "在线阅读"
  },
  {
    "title": "dogemangacom",
    "url": "https://dogemanga.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "漫画阅读",
    "term": "漫画阅读",
    "description": "在线阅读"
  },
  {
    "title": "acgndogcom",
    "url": "https://www.acgndog.com/category/rec-comic",
    "type": "nav",
    "priority": 10,
    "taxonomy": "漫画阅读",
    "term": "漫画阅读",
    "description": "漫画下载"
  },
  {
    "title": "xmanhuacom",
    "url": "https://www.xmanhua.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "漫画阅读",
    "term": "漫画阅读",
    "description": "在线漫画阅读"
  },
  {
    "title": "colamangacom",
    "url": "https://www.colamanga.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "漫画阅读",
    "term": "漫画阅读",
    "description": "国漫资源全"
  },
  {
    "title": "1kkkcom",
    "url": "https://www.1kkk.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "漫画阅读",
    "term": "漫画阅读",
    "description": "(๑•̀ㅂ•́)و✧"
  },
  {
    "title": "cartoonmadcom",
    "url": "https://www.cartoonmad.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "漫画阅读",
    "term": "漫画阅读",
    "description": "(๑•̀ㅂ•́)و✧"
  },
  {
    "title": "mangacopycom",
    "url": "https://www.mangacopy.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "漫画阅读",
    "term": "漫画阅读",
    "description": "(๑•̀ㅂ•́)و✧"
  },
  {
    "title": "somancom",
    "url": "https://www.soman.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "漫画阅读",
    "term": "漫画阅读",
    "description": "一站式漫画搜索引擎"
  },
  {
    "title": "mangadexorg",
    "url": "https://mangadex.org/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "漫画阅读",
    "term": "漫画阅读",
    "description": "全球性漫画分享站"
  },
  {
    "title": "comic-walkercom",
    "url": "https://comic-walker.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "漫画阅读",
    "term": "漫画阅读",
    "description": "生肉漫画"
  },
  {
    "title": "comic-readpagesdev",
    "url": "https://comic-read.pages.dev/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "漫画阅读",
    "term": "漫画阅读",
    "description": "在线版漫画阅读器"
  },
  {
    "title": "kisssuborg",
    "url": "https://www.kisssub.org/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "动漫下载",
    "term": "动漫下载",
    "description": "磁力/BT下载"
  },
  {
    "title": "sharedmhyorg",
    "url": "https://share.dmhy.org/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "动漫下载",
    "term": "动漫下载",
    "description": "最佳动漫资源分享平台"
  },
  {
    "title": "vcb-scom",
    "url": "https://vcb-s.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "动漫下载",
    "term": "动漫下载",
    "description": "高质量BD压制组"
  },
  {
    "title": "mikananime",
    "url": "https://mikanani.me/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "动漫下载",
    "term": "动漫下载",
    "description": "新一代的动漫下载站"
  },
  {
    "title": "acgrip",
    "url": "https://acg.rip/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "动漫下载",
    "term": "动漫下载",
    "description": "种子下载"
  },
  {
    "title": "subskamigamiorg",
    "url": "https://subs.kamigami.org/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "动漫下载",
    "term": "动漫下载",
    "description": "最佳中日双语字幕资源"
  },
  {
    "title": "bangumimoe",
    "url": "https://bangumi.moe/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "动漫下载",
    "term": "动漫下载",
    "description": "磁力/种子下载"
  },
  {
    "title": "animetoxcom",
    "url": "http://www.animetox.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "动漫下载",
    "term": "动漫下载",
    "description": "动漫资源站"
  },
  {
    "title": "acgndogcom",
    "url": "https://www.acgndog.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "动漫下载",
    "term": "动漫下载",
    "description": "动漫资源站"
  },
  {
    "title": "shareacgnxse",
    "url": "https://share.acgnx.se/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "动漫下载",
    "term": "动漫下载",
    "description": "磁力/种子下载"
  },
  {
    "title": "dmguoorg",
    "url": "https://dmguo.org/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "动漫下载",
    "term": "动漫下载",
    "description": "种子/字幕下载"
  },
  {
    "title": "animethemesmoe",
    "url": "https://animethemes.moe/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "动漫下载",
    "term": "动漫下载",
    "description": "高清OP/ED播放下载"
  },
  {
    "title": "lightnovelus",
    "url": "https://www.lightnovel.us/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "看轻小说",
    "term": "看轻小说",
    "description": "国内最大轻小说论坛"
  },
  {
    "title": "wenku8net",
    "url": "https://www.wenku8.net/index.php",
    "type": "nav",
    "priority": 10,
    "taxonomy": "看轻小说",
    "term": "看轻小说",
    "description": "在线阅读/TXT下载"
  },
  {
    "title": "linovelibcom",
    "url": "https://www.linovelib.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "看轻小说",
    "term": "看轻小说",
    "description": "在线阅读/TXT下载"
  },
  {
    "title": "23qbcom",
    "url": "https://www.23qb.com/lightnovel/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "看轻小说",
    "term": "看轻小说",
    "description": "在线阅读/TXT下载"
  },
  {
    "title": "mobinovelscom",
    "url": "https://www.mobinovels.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "看轻小说",
    "term": "看轻小说",
    "description": "EPUB/MOBI下载"
  },
  {
    "title": "syosetucom",
    "url": "https://syosetu.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "看轻小说",
    "term": "看轻小说",
    "description": "Web版小说连载网站"
  },
  {
    "title": "animetoxcom",
    "url": "http://www.animetox.com/category/source/lightnovel",
    "type": "nav",
    "priority": 10,
    "taxonomy": "看轻小说",
    "term": "看轻小说",
    "description": "EPUB/TXT下载"
  },
  {
    "title": "acgndogcom",
    "url": "https://www.acgndog.com/category/qingxiaoshuo",
    "type": "nav",
    "priority": 10,
    "taxonomy": "看轻小说",
    "term": "看轻小说",
    "description": "EPUB/TXT下载"
  },
  {
    "title": "epublove",
    "url": "https://epub.love/wp/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "看轻小说",
    "term": "看轻小说",
    "description": "EPUB下载"
  },
  {
    "title": "gedoorgithubio",
    "url": "https://gedoor.github.io/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "看轻小说",
    "term": "看轻小说",
    "description": "自定义书源小说阅读器"
  },
  {
    "title": "pcqqcom",
    "url": "https://pc.qq.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "软件下载",
    "term": "软件下载",
    "description": "比较靠谱的软件下载平台"
  },
  {
    "title": "ghxicom",
    "url": "https://www.ghxi.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "软件下载",
    "term": "软件下载",
    "description": "修改版软件分享"
  },
  {
    "title": "dayanzaime",
    "url": "http://www.dayanzai.me/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "软件下载",
    "term": "软件下载",
    "description": "汉化软件分享"
  },
  {
    "title": "alternativetonet",
    "url": "https://alternativeto.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "软件下载",
    "term": "软件下载",
    "description": "同类可替代软件搜索"
  },
  {
    "title": "sourceforgenet",
    "url": "https://sourceforge.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "软件下载",
    "term": "软件下载",
    "description": "全球最大的开源软件库"
  },
  {
    "title": "msdnitellyoucn",
    "url": "https://msdn.itellyou.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "软件下载",
    "term": "软件下载",
    "description": "微软原版软件系统"
  },
  {
    "title": "cnuptodowncom",
    "url": "https://cn.uptodown.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "软件下载",
    "term": "软件下载",
    "description": "Win/Mac/安卓软件下载"
  },
  {
    "title": "apkmirrorcom",
    "url": "https://www.apkmirror.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "软件下载",
    "term": "软件下载",
    "description": "免费安全的APK下载平台"
  },
  {
    "title": "zhaooleegitbooksio",
    "url": "https://zhaoolee.gitbooks.io/chrome/content/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "软件下载",
    "term": "软件下载",
    "description": "Chrome扩展推荐"
  },
  {
    "title": "amazing-appsgitbookio",
    "url": "https://amazing-apps.gitbook.io/windows-apps-that-amaze-us/zh-cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "软件下载",
    "term": "软件下载",
    "description": "超赞的Windows软件"
  },
  {
    "title": "kancloudcn",
    "url": "https://www.kancloud.cn/maozhenggang/monkey-cheats#/catalog",
    "type": "nav",
    "priority": 10,
    "taxonomy": "软件下载",
    "term": "软件下载",
    "description": "程序员工具推荐"
  },
  {
    "title": "f-droidorg",
    "url": "https://f-droid.org/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "软件下载",
    "term": "软件下载",
    "description": "免费开源安卓软件库"
  },
  {
    "title": "chromezzzmhcn",
    "url": "https://chrome.zzzmh.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "扩展安装",
    "term": "扩展安装",
    "description": "Chrome/Edge 扩展下载"
  },
  {
    "title": "greasyforkorg",
    "url": "https://greasyfork.org/zh-CN",
    "type": "nav",
    "priority": 10,
    "taxonomy": "扩展安装",
    "term": "扩展安装",
    "description": "最佳油猴脚本搜索网站"
  },
  {
    "title": "extfanscom",
    "url": "https://www.extfans.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "扩展安装",
    "term": "扩展安装",
    "description": "扩展推荐/下载"
  },
  {
    "title": "googlecom",
    "url": "https://www.google.com/chrome/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "装机必备",
    "term": "装机必备",
    "description": "全球第一"
  },
  {
    "title": "microsoftcom",
    "url": "https://www.microsoft.com/zh-cn/edge",
    "type": "nav",
    "priority": 10,
    "taxonomy": "装机必备",
    "term": "装机必备",
    "description": "内置很多小功能"
  },
  {
    "title": "mozillaorg",
    "url": "https://www.mozilla.org/zh-CN/firefox/new/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "装机必备",
    "term": "装机必备",
    "description": "认准国际版"
  },
  {
    "title": "cnbandisoftcom",
    "url": "http://cn.bandisoft.com/bandizip/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "装机必备",
    "term": "装机必备",
    "description": "压缩/解压工具"
  },
  {
    "title": "7-ziporg",
    "url": "https://www.7-zip.org/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "装机必备",
    "term": "装机必备",
    "description": "开源免费的解压缩软件"
  },
  {
    "title": "cnbandisoftcom",
    "url": "http://cn.bandisoft.com/honeyview/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "装机必备",
    "term": "装机必备",
    "description": "轻量快速的看图软件"
  },
  {
    "title": "potplayerdaumnet",
    "url": "https://potplayer.daum.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "装机必备",
    "term": "装机必备",
    "description": "最佳视频播放器"
  },
  {
    "title": "sumatrapdfreaderorg",
    "url": "https://www.sumatrapdfreader.org/free-pdf-reader",
    "type": "nav",
    "priority": 10,
    "taxonomy": "装机必备",
    "term": "装机必备",
    "description": "最轻量的PDF阅读器"
  },
  {
    "title": "qbittorrentorg",
    "url": "https://www.qbittorrent.org/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "装机必备",
    "term": "装机必备",
    "description": "纯粹专业的BT下载软件"
  },
  {
    "title": "internetdownloadmanagercom",
    "url": "https://www.internetdownloadmanager.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "装机必备",
    "term": "装机必备",
    "description": "网络多线程下载神器"
  },
  {
    "title": "voidtoolscom",
    "url": "https://www.voidtools.com/zh-cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "装机必备",
    "term": "装机必备",
    "description": "最快的文件名搜索软件"
  },
  {
    "title": "anytxtnet",
    "url": "https://anytxt.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "装机必备",
    "term": "装机必备",
    "description": "文件内容搜索利器"
  },
  {
    "title": "ditto-cpsourceforgeio",
    "url": "https://ditto-cp.sourceforge.io/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "装机必备",
    "term": "装机必备",
    "description": "历史剪贴板"
  },
  {
    "title": "advancedrenamercom",
    "url": "https://www.advancedrenamer.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "装机必备",
    "term": "装机必备",
    "description": "批量重命名"
  },
  {
    "title": "huorongcn",
    "url": "https://www.huorong.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "装机必备",
    "term": "装机必备",
    "description": "安静舒服占用低"
  },
  {
    "title": "geekuninstallercom",
    "url": "https://geekuninstaller.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "装机必备",
    "term": "装机必备",
    "description": "免费软件彻底卸载工具"
  },
  {
    "title": "diskgeniuscn",
    "url": "https://www.diskgenius.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "装机必备",
    "term": "装机必备",
    "description": "专业磁盘管理&文件恢复"
  },
  {
    "title": "notionso",
    "url": "https://www.notion.so/zh-cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "装机必备",
    "term": "装机必备",
    "description": "全能笔记软件"
  },
  {
    "title": "zhsnipastecom",
    "url": "https://zh.snipaste.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "装机必备",
    "term": "装机必备",
    "description": "截图 + 贴图"
  },
  {
    "title": "screentogifcom",
    "url": "https://www.screentogif.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "装机必备",
    "term": "装机必备",
    "description": "动图录制编辑器"
  },
  {
    "title": "rufusie",
    "url": "https://rufus.ie/zh/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "装机必备",
    "term": "装机必备",
    "description": "轻松创建USB启动盘"
  },
  {
    "title": "githubcom",
    "url": "https://github.com/Chuyu-Team/Dism-Multi-language",
    "type": "nav",
    "priority": 10,
    "taxonomy": "装机必备",
    "term": "装机必备",
    "description": "最强Win优化设置工具"
  },
  {
    "title": "appsmicrosoftcom",
    "url": "https://apps.microsoft.com/store/detail/quicklook/9NV4BS3L1H4S",
    "type": "nav",
    "priority": 10,
    "taxonomy": "装机必备",
    "term": "装机必备",
    "description": "空格键快速预览文件内容"
  },
  {
    "title": "notepadsappcom",
    "url": "https://www.notepadsapp.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "装机必备",
    "term": "装机必备",
    "description": "好用的记事本替代软件"
  },
  {
    "title": "storelizhiio",
    "url": "https://store.lizhi.io/?cid=2yj7gln9",
    "type": "nav",
    "priority": 10,
    "taxonomy": "软件博客",
    "term": "软件博客",
    "description": "最新鲜优秀的正版软件"
  },
  {
    "title": "iplaysoftcom",
    "url": "https://www.iplaysoft.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "软件博客",
    "term": "软件博客",
    "description": "软件改变生活"
  },
  {
    "title": "appinncom",
    "url": "https://www.appinn.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "软件博客",
    "term": "软件博客",
    "description": "小巧/实用/有趣的软件"
  },
  {
    "title": "sspaicom",
    "url": "https://sspai.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "软件博客",
    "term": "软件博客",
    "description": "高质量应用推荐媒体"
  },
  {
    "title": "runningcheesecom",
    "url": "https://www.runningcheese.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "软件博客",
    "term": "软件博客",
    "description": "高效工具方法论"
  },
  {
    "title": "apprcncom",
    "url": "http://www.apprcn.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "软件博客",
    "term": "软件博客",
    "description": "新奇/免费软件分享"
  },
  {
    "title": "topbookcc",
    "url": "https://topbook.cc/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "软件博客",
    "term": "软件博客",
    "description": "高效生活视频书"
  },
  {
    "title": "greasyforkorg",
    "url": "https://greasyfork.org/zh-CN/scripts/14178-ac-baidu-%E9%87%8D%E5%AE%9A%E5%90%91%E4%BC%98%E5%8C%96%E7%99%BE%E5%BA%A6%E6%90%9C%E7%8B%97%E8%B0%B7%E6%AD%8C%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2-favicon-%E5%8F%8C%E5%88%97",
    "type": "nav",
    "priority": 10,
    "taxonomy": "精选脚本",
    "term": "精选脚本",
    "description": "优化搜索引擎使用体验"
  },
  {
    "title": "greasyforkorg",
    "url": "https://greasyfork.org/zh-CN/scripts/27752-searchenginejump-%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%BF%AB%E6%8D%B7%E8%B7%B3%E8%BD%AC",
    "type": "nav",
    "priority": 10,
    "taxonomy": "精选脚本",
    "term": "精选脚本",
    "description": "快速切换搜索引擎"
  },
  {
    "title": "greasyforkorg",
    "url": "https://greasyfork.org/zh-CN/scripts/419215-%E8%87%AA%E5%8A%A8%E6%97%A0%E7%BC%9D%E7%BF%BB%E9%A1%B5",
    "type": "nav",
    "priority": 10,
    "taxonomy": "精选脚本",
    "term": "精选脚本",
    "description": "无缝加载网站下一页"
  },
  {
    "title": "greasyforkorg",
    "url": "https://greasyfork.org/zh-CN/scripts/2998-search-by-image",
    "type": "nav",
    "priority": 10,
    "taxonomy": "精选脚本",
    "term": "精选脚本",
    "description": "多引擎以图搜图"
  },
  {
    "title": "greasyforkorg",
    "url": "https://greasyfork.org/zh-CN/scripts/405130-%E6%96%87%E6%9C%AC%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6",
    "type": "nav",
    "priority": 10,
    "taxonomy": "精选脚本",
    "term": "精选脚本",
    "description": "解除网站复制限制"
  },
  {
    "title": "greasyforkorg",
    "url": "https://greasyfork.org/zh-CN/scripts/398746-%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91",
    "type": "nav",
    "priority": 10,
    "taxonomy": "精选脚本",
    "term": "精选脚本",
    "description": "谷歌网页翻译"
  },
  {
    "title": "greasyforkorg",
    "url": "https://greasyfork.org/zh-CN/scripts/416338",
    "type": "nav",
    "priority": 10,
    "taxonomy": "精选脚本",
    "term": "精选脚本",
    "description": "去除网站链接跳转"
  },
  {
    "title": "greasyforkorg",
    "url": "https://greasyfork.org/zh-CN/scripts/412245-github-%E5%A2%9E%E5%BC%BA-%E9%AB%98%E9%80%9F%E4%B8%8B%E8%BD%BD",
    "type": "nav",
    "priority": 10,
    "taxonomy": "精选脚本",
    "term": "精选脚本",
    "description": "Github 高速下载"
  },
  {
    "title": "githubcom",
    "url": "https://github.com/the1812/Bilibili-Evolved",
    "type": "nav",
    "priority": 10,
    "taxonomy": "精选脚本",
    "term": "精选脚本",
    "description": "最强B站增强脚本"
  },
  {
    "title": "greasyforkorg",
    "url": "https://greasyfork.org/zh-CN/scripts/413228-bilibili%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD",
    "type": "nav",
    "priority": 10,
    "taxonomy": "精选脚本",
    "term": "精选脚本",
    "description": "视频/弹幕/字幕下载"
  },
  {
    "title": "greasyforkorg",
    "url": "https://greasyfork.org/zh-CN/scripts/419081-%E7%9F%A5%E4%B9%8E%E5%A2%9E%E5%BC%BA",
    "type": "nav",
    "priority": 10,
    "taxonomy": "精选脚本",
    "term": "精选脚本",
    "description": "知乎浏览增强"
  },
  {
    "title": "greasyforkorg",
    "url": "https://greasyfork.org/zh-CN/scripts/406070-%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD%E5%99%A8",
    "type": "nav",
    "priority": 10,
    "taxonomy": "精选脚本",
    "term": "精选脚本",
    "description": "通用型小说下载器"
  },
  {
    "title": "greasyforkorg",
    "url": "https://greasyfork.org/zh-CN/scripts/28497-%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4-%E6%94%B9",
    "type": "nav",
    "priority": 10,
    "taxonomy": "精选脚本",
    "term": "精选脚本",
    "description": "解除复制/右键菜单限制"
  },
  {
    "title": "greasyforkorg",
    "url": "https://greasyfork.org/zh-CN/scripts/34153-pixiv-plus",
    "type": "nav",
    "priority": 10,
    "taxonomy": "精选脚本",
    "term": "精选脚本",
    "description": "Pixiv 浏览增强工具"
  },
  {
    "title": "greasyforkorg",
    "url": "https://greasyfork.org/zh-CN/scripts/372673-%E8%AE%A1%E6%97%B6%E5%99%A8%E6%8E%8C%E6%8E%A7%E8%80%85-%E8%A7%86%E9%A2%91%E5%B9%BF%E5%91%8A%E8%B7%B3%E8%BF%87-%E8%A7%86%E9%A2%91%E5%B9%BF%E5%91%8A%E5%8A%A0%E9%80%9F%E5%99%A8",
    "type": "nav",
    "priority": 10,
    "taxonomy": "精选脚本",
    "term": "精选脚本",
    "description": "控制网页计时器速度"
  },
  {
    "title": "greasyforkorg",
    "url": "https://greasyfork.org/zh-CN/scripts/292-my-novel-reader",
    "type": "nav",
    "priority": 10,
    "taxonomy": "精选脚本",
    "term": "精选脚本",
    "description": "小说阅读模式"
  },
  {
    "title": "greasyforkorg",
    "url": "https://greasyfork.org/zh-CN/scripts/419894-image-downloader",
    "type": "nav",
    "priority": 10,
    "taxonomy": "精选脚本",
    "term": "精选脚本",
    "description": "图片提取/批量下载"
  },
  {
    "title": "greasyforkorg",
    "url": "https://greasyfork.org/zh-CN/scripts/24204",
    "type": "nav",
    "priority": 10,
    "taxonomy": "精选脚本",
    "term": "精选脚本",
    "description": "在线看图辅助工具"
  },
  {
    "title": "icvecomcn",
    "url": "https://www.icve.com.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线学习",
    "term": "在线学习",
    "description": "职业教育教学资源库"
  },
  {
    "title": "booksciencereadingcn",
    "url": "https://book.sciencereading.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线学习",
    "term": "在线学习",
    "description": "高质量学术专著和教材"
  },
  {
    "title": "duolingocom",
    "url": "https://www.duolingo.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线学习",
    "term": "在线学习",
    "description": "学习外语的最佳途径"
  },
  {
    "title": "doyoudocom",
    "url": "https://www.doyoudo.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线学习",
    "term": "在线学习",
    "description": "设计/后期剪辑教程"
  },
  {
    "title": "oeasyorg",
    "url": "http://oeasy.org/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线学习",
    "term": "在线学习",
    "description": "免费技能学习教程"
  },
  {
    "title": "zhentiburningvocabularycom",
    "url": "https://zhenti.burningvocabulary.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线学习",
    "term": "在线学习",
    "description": "四六级考研英语真题"
  },
  {
    "title": "tjxzcc",
    "url": "https://www.tjxz.cc/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线学习",
    "term": "在线学习",
    "description": "高级英语学习"
  },
  {
    "title": "dicteudicnet",
    "url": "https://dict.eudic.net/ting",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线学习",
    "term": "在线学习",
    "description": "(๑•̀ㅂ•́)و✧"
  },
  {
    "title": "reswokanxinginfo",
    "url": "https://res.wokanxing.info/jpgramma/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线学习",
    "term": "在线学习",
    "description": "日语语法学习"
  },
  {
    "title": "ucdrssuperlibnet",
    "url": "http://www.ucdrs.superlib.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线学习",
    "term": "在线学习",
    "description": "数字图书馆"
  },
  {
    "title": "51zxwnet",
    "url": "https://www.51zxw.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线学习",
    "term": "在线学习",
    "description": "专业软件使用进阶教程"
  },
  {
    "title": "zoudupaicom",
    "url": "http://www.zoudupai.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线学习",
    "term": "在线学习",
    "description": "读书学习第一站"
  },
  {
    "title": "xue8navcom",
    "url": "https://www.xue8nav.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线学习",
    "term": "在线学习",
    "description": "学习导航网站"
  },
  {
    "title": "en123net",
    "url": "https://www.en123.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线学习",
    "term": "在线学习",
    "description": "英语学习网站导航"
  },
  {
    "title": "studyhardcf",
    "url": "https://studyhard.cf/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线学习",
    "term": "在线学习",
    "description": "各大高校课程资源汇总"
  },
  {
    "title": "gkzenticn",
    "url": "https://www.gkzenti.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线学习",
    "term": "在线学习",
    "description": "考公/资格证/软考真题库"
  },
  {
    "title": "lanrenexcelcom",
    "url": "https://www.lanrenexcel.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线学习",
    "term": "在线学习",
    "description": "Excel 教程大全"
  },
  {
    "title": "enpuzcom",
    "url": "http://enpuz.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线学习",
    "term": "在线学习",
    "description": "英语句子语法分析"
  },
  {
    "title": "allhistorycom",
    "url": "https://www.allhistory.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "知识扩展",
    "term": "知识扩展",
    "description": "很不错的历史扩展学习网站"
  },
  {
    "title": "wufazhucecom",
    "url": "https://wufazhuce.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "知识扩展",
    "term": "知识扩展",
    "description": "复杂世界里, 一个就够了."
  },
  {
    "title": "kepuchinacn",
    "url": "https://www.kepuchina.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "知识扩展",
    "term": "知识扩展",
    "description": "科普信息内容和资讯"
  },
  {
    "title": "kepunetcn",
    "url": "http://www.kepu.net.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "知识扩展",
    "term": "知识扩展",
    "description": "综合性的科学传播平台"
  },
  {
    "title": "ixiguacom",
    "url": "https://www.ixigua.com/channel/jilupian",
    "type": "nav",
    "priority": 10,
    "taxonomy": "知识扩展",
    "term": "知识扩展",
    "description": "热门纪录片大全"
  },
  {
    "title": "bilibilicom",
    "url": "https://www.bilibili.com/documentary",
    "type": "nav",
    "priority": 10,
    "taxonomy": "知识扩展",
    "term": "知识扩展",
    "description": "(゜-゜)つロ 干杯~"
  },
  {
    "title": "zhwikihowcom",
    "url": "https://zh.wikihow.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "知识扩展",
    "term": "知识扩展",
    "description": "你可以信赖的万事指南"
  },
  {
    "title": "guokrcom",
    "url": "https://www.guokr.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "知识扩展",
    "term": "知识扩展",
    "description": "泛科普科学文化平台"
  },
  {
    "title": "tvcctvcom",
    "url": "https://tv.cctv.com/lm/bjjt/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "知识扩展",
    "term": "知识扩展",
    "description": "CCTV节目官网"
  },
  {
    "title": "dpmorgcn",
    "url": "https://www.dpm.org.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "知识扩展",
    "term": "知识扩展",
    "description": "故宫数字历史博物馆"
  },
  {
    "title": "open163com",
    "url": "https://open.163.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "知识扩展",
    "term": "知识扩展",
    "description": "高校视频课程"
  },
  {
    "title": "yixitv",
    "url": "https://yixi.tv/#/home",
    "type": "nav",
    "priority": 10,
    "taxonomy": "知识扩展",
    "term": "知识扩展",
    "description": "分享见解的演讲节目"
  },
  {
    "title": "tedcom",
    "url": "https://www.ted.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "知识扩展",
    "term": "知识扩展",
    "description": "著名的TED演讲"
  },
  {
    "title": "gushiwencn",
    "url": "https://www.gushiwen.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "知识扩展",
    "term": "知识扩展",
    "description": "(๑•̀ㅂ•́)و✧"
  },
  {
    "title": "termonlinecn",
    "url": "https://www.termonline.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "知识扩展",
    "term": "知识扩展",
    "description": "权威术语知识平台"
  },
  {
    "title": "shenyandayicom",
    "url": "https://www.shenyandayi.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "知识扩展",
    "term": "知识扩展",
    "description": "反向查词/据意查句"
  },
  {
    "title": "zdicnet",
    "url": "https://www.zdic.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "知识扩展",
    "term": "知识扩展",
    "description": "辞典/古籍/诗词/书法/通识"
  },
  {
    "title": "xyzrankcom",
    "url": "https://xyzrank.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "知识扩展",
    "term": "知识扩展",
    "description": "在线播客聚合"
  },
  {
    "title": "zgbkcom",
    "url": "https://www.zgbk.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "知识扩展",
    "term": "知识扩展",
    "description": "中华文化权威指南"
  },
  {
    "title": "sou-yuncn",
    "url": "https://sou-yun.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "知识扩展",
    "term": "知识扩展",
    "description": "诗词知识及工具"
  },
  {
    "title": "historylineonline",
    "url": "https://www.historyline.online/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "知识扩展",
    "term": "知识扩展",
    "description": "中国历朝代视频讲解"
  },
  {
    "title": "qreadxmsoushucom",
    "url": "https://qread.xmsoushu.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "知识扩展",
    "term": "知识扩展",
    "description": "精品读书视频"
  },
  {
    "title": "runoobcom",
    "url": "https://www.runoob.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "编程开发",
    "term": "编程开发",
    "description": "超全面的IT编程教程"
  },
  {
    "title": "developermozillaorg",
    "url": "https://developer.mozilla.org/zh-CN/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "编程开发",
    "term": "编程开发",
    "description": "Web 开发技术手册"
  },
  {
    "title": "docsmicrosoftcom",
    "url": "https://docs.microsoft.com/zh-cn/learn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "编程开发",
    "term": "编程开发",
    "description": "微软开发学习平台"
  },
  {
    "title": "w3schoolcomcn",
    "url": "https://www.w3school.com.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "编程开发",
    "term": "编程开发",
    "description": "Web 技术教程"
  },
  {
    "title": "liaoxuefengcom",
    "url": "https://www.liaoxuefeng.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "编程开发",
    "term": "编程开发",
    "description": "免费编程教程"
  },
  {
    "title": "cnlinuxvbirdorg",
    "url": "http://cn.linux.vbird.org/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "编程开发",
    "term": "编程开发",
    "description": "最佳Linux入门教程"
  },
  {
    "title": "backlogcom",
    "url": "https://backlog.com/git-tutorial/cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "编程开发",
    "term": "编程开发",
    "description": "简单易懂的Git系列教程"
  },
  {
    "title": "bootcsscom",
    "url": "https://www.bootcss.com/p/git-guide/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "编程开发",
    "term": "编程开发",
    "description": "(๑•̀ㅂ•́)و✧"
  },
  {
    "title": "deerchaocn",
    "url": "https://deerchao.cn/tutorials/regex/regex.htm",
    "type": "nav",
    "priority": 10,
    "taxonomy": "编程开发",
    "term": "编程开发",
    "description": "正则入门手册"
  },
  {
    "title": "regexlearncom",
    "url": "https://regexlearn.com/zh-cn",
    "type": "nav",
    "priority": 10,
    "taxonomy": "编程开发",
    "term": "编程开发",
    "description": "正则从零基础到高阶"
  },
  {
    "title": "r2codingcom",
    "url": "https://r2coding.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "编程开发",
    "term": "编程开发",
    "description": "编程自学之路"
  },
  {
    "title": "githubcom",
    "url": "https://github.com/Jackpopc/CS-Books-Store",
    "type": "nav",
    "priority": 10,
    "taxonomy": "编程开发",
    "term": "编程开发",
    "description": "计算机经典书籍下载"
  },
  {
    "title": "wangchujiangcom",
    "url": "https://wangchujiang.com/reference/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "编程开发",
    "term": "编程开发",
    "description": "开发人员编程速查手册"
  },
  {
    "title": "leetcodecom",
    "url": "https://leetcode.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "编程开发",
    "term": "编程开发",
    "description": "在线编程练习网站"
  },
  {
    "title": "freecodecamporg",
    "url": "https://www.freecodecamp.org/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "编程开发",
    "term": "编程开发",
    "description": "免费编程学习网站"
  },
  {
    "title": "regexai",
    "url": "https://regex.ai/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "编程开发",
    "term": "编程开发",
    "description": "AI正则表达式生成器"
  },
  {
    "title": "wangchujiangcom",
    "url": "https://wangchujiang.com/mysql-tutorial/index.html",
    "type": "nav",
    "priority": 10,
    "taxonomy": "编程开发",
    "term": "编程开发",
    "description": "从零开始学习MySQL"
  },
  {
    "title": "v2fycom",
    "url": "https://www.v2fy.com/game/tetris/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "放松神器"
  },
  {
    "title": "yorgio",
    "url": "https://yorg.io/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "超耐玩的塔防游戏"
  },
  {
    "title": "crazygamescom",
    "url": "https://www.crazygames.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "免费在线小游戏合集"
  },
  {
    "title": "slitherio",
    "url": "http://slither.io/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "(๑•̀ㅂ•́)و✧"
  },
  {
    "title": "mazetoys",
    "url": "https://maze.toys/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "多种模式的迷宫游戏"
  },
  {
    "title": "dccxicom",
    "url": "https://dccxi.com/trust/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "从游戏了解博弈论"
  },
  {
    "title": "linesfrvrcom",
    "url": "https://lines.frvr.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "点线益智游戏"
  },
  {
    "title": "aidnjp",
    "url": "https://aidn.jp/mikutap/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "很魔性的音乐游戏"
  },
  {
    "title": "cngame-gamecom",
    "url": "https://cn.game-game.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "上千款免费在线游戏"
  },
  {
    "title": "yikmnet",
    "url": "https://www.yikm.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "街机/小霸王/H5游戏"
  },
  {
    "title": "thisissandcom",
    "url": "https://thisissand.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "在线画沙画"
  },
  {
    "title": "iss-simspacexcom",
    "url": "https://iss-sim.spacex.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "(๑•̀ㅂ•́)و✧"
  },
  {
    "title": "liferestartsyaroio",
    "url": "https://liferestart.syaro.io/public/index.html",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "人生重开模拟器"
  },
  {
    "title": "play-cscom",
    "url": "https://play-cs.com/zh/servers",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "免客户端联机"
  },
  {
    "title": "bruno-simoncom",
    "url": "https://bruno-simon.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "开车小游戏"
  },
  {
    "title": "papergamesio",
    "url": "https://papergames.io/zh/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "棋类游戏在线对战"
  },
  {
    "title": "playokcom",
    "url": "https://www.playok.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "在线棋牌真人对弈"
  },
  {
    "title": "ztype",
    "url": "https://zty.pe/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "练习打字的射击游戏"
  },
  {
    "title": "microsoftcom",
    "url": "https://www.microsoft.com/en-us/edge/surf",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "微软网页冲浪游戏"
  },
  {
    "title": "msncn",
    "url": "https://www.msn.cn/zh-cn/play",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "微软网页小游戏"
  },
  {
    "title": "slowroadsio",
    "url": "https://slowroads.io/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "公路无尽驾驶"
  },
  {
    "title": "enazocn",
    "url": "https://enazo.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "你画我猜"
  },
  {
    "title": "yandexcom",
    "url": "https://yandex.com/games/zh",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "免费在线游戏"
  },
  {
    "title": "jxgamenet",
    "url": "https://jxgame.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "精选益智小游戏"
  },
  {
    "title": "fuunfun",
    "url": "https://fuun.fun/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "有趣的摸鱼小游戏"
  },
  {
    "title": "chesscom",
    "url": "https://www.chess.com/zh",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "世界第一国际象棋网站"
  },
  {
    "title": "ra2webcom",
    "url": "https://ra2web.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "红色警戒2网页版"
  },
  {
    "title": "minesweeperplayonline",
    "url": "https://minesweeperplay.online/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "经典扫雷游戏"
  },
  {
    "title": "rubiks-cube-solvercom",
    "url": "https://rubiks-cube-solver.com/zh/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "在线游戏",
    "term": "在线游戏",
    "description": "魔方复原助手"
  },
  {
    "title": "panodpmorgcn",
    "url": "https://pano.dpm.org.cn/gugong_pano/index.html",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "在线逛故宫"
  },
  {
    "title": "zhijianshangcom",
    "url": "https://www.zhijianshang.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "全球景点360°全景"
  },
  {
    "title": "xmagiconchcom",
    "url": "https://x.magiconch.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "自制梗图"
  },
  {
    "title": "labmagiconchcom",
    "url": "https://lab.magiconch.com/one-last-image/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "One Last Kiss 封面生成器"
  },
  {
    "title": "mniucodatacom",
    "url": "https://m.niucodata.com/cat/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "听猫打呼噜"
  },
  {
    "title": "guozhivipcom",
    "url": "http://guozhivip.com/eat/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "(๑•̀ㅂ•́)و✧"
  },
  {
    "title": "skylinewebcamscom",
    "url": "https://www.skylinewebcams.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "全球实况街景"
  },
  {
    "title": "fakeupdatenet",
    "url": "https://fakeupdate.net/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "假装 Windows 升级界面"
  },
  {
    "title": "labmagiconchcom",
    "url": "https://lab.magiconch.com/china-ex/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "热门地图标记生成工具"
  },
  {
    "title": "airpanoorgcn",
    "url": "https://airpano.org.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "全球360°虚拟游览"
  },
  {
    "title": "jiugethunlporg",
    "url": "http://jiuge.thunlp.org/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "人工智能诗歌写作系统"
  },
  {
    "title": "niemaotop",
    "url": "http://niemao.top/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "实现捏猫自由"
  },
  {
    "title": "liveipandacom",
    "url": "https://live.ipanda.com/xmcd/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "全景熊猫直播"
  },
  {
    "title": "nealfun",
    "url": "https://neal.fun/wonders-of-street-view/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "随机传送到世界各地"
  },
  {
    "title": "anitabicn",
    "url": "https://anitabi.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "(๑•̀ㅂ•́)و✧"
  },
  {
    "title": "pintuxiacom",
    "url": "http://pintuxia.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "在线玩拼图"
  },
  {
    "title": "gallerixasia",
    "url": "https://gallerix.asia/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "在线数字博物馆"
  },
  {
    "title": "picrewme",
    "url": "https://picrew.me/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "自己捏头像"
  },
  {
    "title": "labmagiconchcom",
    "url": "https://lab.magiconch.com/anime-grid/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "生成动画个人喜好表"
  },
  {
    "title": "eyebleachme",
    "url": "https://eyebleach.me/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "治愈图片轮播"
  },
  {
    "title": "hi2futurecom",
    "url": "https://www.hi2future.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "给未来写封信"
  },
  {
    "title": "gonyancattop",
    "url": "https://go.nyancat.top/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "发现好音乐"
  },
  {
    "title": "autopianocn",
    "url": "https://www.autopiano.cn/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "在线模拟钢琴"
  },
  {
    "title": "window-swapcom",
    "url": "https://www.window-swap.com/Window",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "窗外风景直播"
  },
  {
    "title": "e-dunhuangcom",
    "url": "https://www.e-dunhuang.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "在线逛敦煌石窟"
  },
  {
    "title": "todaydemochencom",
    "url": "https://today.demochen.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "分享天空的颜色"
  },
  {
    "title": "cikeeecc",
    "url": "https://www.cikeee.cc/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "每天一部优秀电影"
  },
  {
    "title": "dbbqbcom",
    "url": "https://www.dbbqb.com/",
    "type": "nav",
    "priority": 10,
    "taxonomy": "趣味休闲",
    "term": "趣味休闲",
    "description": "专业表情包搜索网站"
  }
];

export const topicIndex = [
  {
    "title": "Java 与 JVM",
    "url": "/topics/java-jvm.html",
    "type": "topic",
    "priority": 95,
    "slug": "java-jvm",
    "count": 25,
    "description": "Java 基础、集合、反射、并发、JVM、GC 与排障相关内容。",
    "keywords": [
      "java",
      "jvm",
      "gc",
      "反射",
      "内省",
      "线程",
      "锁",
      "javap",
      "dump",
      "内存",
      "对象"
    ],
    "articles": [
      "JVM 基础总览",
      "JVM 垃圾回收器",
      "LocalDateTime操作",
      "java内省机制与反射机制的区别",
      "Java反射生成对象",
      "Java 逐行读取文本文件的几种方式以及效率对比"
    ]
  },
  {
    "title": "Spring Boot 与后端框架",
    "url": "/topics/spring-backend.html",
    "type": "topic",
    "priority": 85,
    "slug": "spring-backend",
    "count": 10,
    "description": "Spring Boot、Spring Batch、MyBatis、Swagger、WebFlux、自动装配和扩展点实践。",
    "keywords": [
      "spring",
      "springboot",
      "spring boot",
      "springbatch",
      "mybatis",
      "swagger",
      "knife4j",
      "webflux",
      "bean",
      "conditional"
    ],
    "articles": [
      "Spring Boot 启动扩展点",
      "Spring Integration 中文手册",
      "使用@ConditionalOnExpression决定是否生效",
      "springBatch监控相关",
      "SpringBoo2t获取ApplicationContext的3种方式",
      "springBoot2中webflux集成swagger2"
    ]
  },
  {
    "title": "MySQL 与数据架构",
    "url": "/topics/mysql-data.html",
    "type": "topic",
    "priority": 90,
    "slug": "mysql-data",
    "count": 15,
    "description": "MySQL 索引、事务、锁、分库分表、冷热分离、数据一致性与大表优化。",
    "keywords": [
      "mysql",
      "数据库",
      "索引",
      "事务",
      "锁",
      "分库",
      "分表",
      "大表",
      "limit",
      "order by",
      "缓存一致性"
    ],
    "articles": [
      "MySQL RR 隔离级别锁测试",
      "分库分表方案总览",
      "表数据量大读写缓慢如何优化【分库分表】",
      "表数据量大读写缓慢如何优化【查询分离】",
      "表数据量大读写缓慢如何优化【冷热分离】",
      "MySQL 5.7root用户密码修改"
    ]
  },
  {
    "title": "Linux 运维与部署",
    "url": "/topics/linux-ops.html",
    "type": "topic",
    "priority": 93,
    "slug": "linux-ops",
    "count": 18,
    "description": "Linux、CentOS、Ubuntu、Nginx、Redis、JDK、Maven、Git、服务器排障和部署记录。",
    "keywords": [
      "linux",
      "centos",
      "ubuntu",
      "nginx",
      "redis",
      "ssh",
      "yum",
      "jdk",
      "maven",
      "git",
      "服务器",
      "病毒",
      "cpu",
      "内存"
    ],
    "articles": [
      "Linux Dump 文件分析",
      "Ubuntu 搭建Zookeeper服务",
      "HAProxy常见的安装方式",
      "Linux - 查看用户登录记录",
      "Linux服务器kdevtmpfsi挖矿病毒解决方法",
      "利用Grafana展示zabbix数据"
    ]
  },
  {
    "title": "Python 爬虫与自动化",
    "url": "/topics/python-crawler.html",
    "type": "topic",
    "priority": 95,
    "slug": "python-crawler",
    "count": 23,
    "description": "Python 环境、requests、urllib、Scrapy、Selenium、ChromeDriver 和爬虫实战。",
    "keywords": [
      "python",
      "爬虫",
      "scrapy",
      "requests",
      "urllib",
      "selenium",
      "chromedriver",
      "headless",
      "cookie"
    ],
    "articles": [
      "Scrapy 框架入门",
      "Python3下request处理cookie的两种方法",
      "Python3绘图Turtle库详解",
      "python3下chromedriver + headless + proxy+场景",
      "centos7 安装chromedriver",
      "阿里云ubutun python3.5.2卸载更新到3.6方法亲测有效"
    ]
  },
  {
    "title": "中间件与分布式",
    "url": "/topics/middleware-distributed.html",
    "type": "topic",
    "priority": 82,
    "slug": "middleware-distributed",
    "count": 7,
    "description": "Redis、Zookeeper、网关、HAProxy、SOFA、Prometheus、Grafana、分布式锁和服务治理。",
    "keywords": [
      "redis",
      "zookeeper",
      "zk",
      "gateway",
      "网关",
      "haproxy",
      "prometheus",
      "grafana",
      "zabbix",
      "sofa",
      "分布式",
      "服务",
      "锁"
    ],
    "articles": [
      "Redis 缓存穿透、击穿、雪崩",
      "各种法则定律-引论",
      "api网关介绍",
      "分布式锁(Redis,zk,db锁)",
      "蚂蚁中间件SOFA",
      "免费接口api分享（终于找到了）"
    ]
  },
  {
    "title": "工具、效率与博客建设",
    "url": "/topics/tools-blog.html",
    "type": "topic",
    "priority": 81,
    "slug": "tools-blog",
    "count": 6,
    "description": "开发工具、网络分析、Rust 学习、博客迁移、静态站建设和零散效率笔记。",
    "keywords": [
      "vuepress",
      "bolo",
      "solo",
      "博客",
      "迁移",
      "rust",
      "wireshark",
      "drools",
      "工具",
      "github",
      "api",
      "区块链"
    ],
    "articles": [
      "老博客静态化迁移实战",
      "Drools语法",
      "wireshark安装和基本语法",
      "js京东全民养红包一步完成",
      "Rust学习之二猜字谜",
      "Rust 学习一之环境安装"
    ]
  }
];

export const tutorialIndex = [
  {
    "title": "MySQL从新手到专家完整学习路线图",
    "url": "/mysql/mysql.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "入门导航",
    "excerpt": "MySQL从新手到专家完整学习路线图 本教程旨在帮助你从零基础成长为MySQL专家，能够独立解决各种疑难问题 📚 学习路径总览 新手阶段 (12个月) → 进阶阶段 (23个月) → 高级阶段 (34个月) → 专家阶段 (持续学习) 第一阶段：基础入门 (新手必学) 第01章：MySQL概述与安装 MySQL简介与版本选择 MySQL 5.7 在Wind...",
    "content": "MySQL从新手到专家完整学习路线图 本教程旨在帮助你从零基础成长为MySQL专家，能够独立解决各种疑难问题 📚 学习路径总览 新手阶段 (12个月) → 进阶阶段 (23个月) → 高级阶段 (34个月) → 专家阶段 (持续学习) 第一阶段：基础入门 (新手必学) 第01章：MySQL概述与安装 MySQL简介与版本选择 MySQL 5.7 在Windows上的安装 MySQL 5.7 在Linux上的安装 MySQL配置文件详解 常用客户端工具介绍 第02章：SQL基础 DDL数据定义 数据库的创建、修改、删除 数据表的创建、修改、删除 数据类型详解 字符集和排序规则 第03章：SQL基础 DML数据操作 INSERT插入数据 UPDATE更新数据 DELETE删除数据 TRUNCATE与DELETE的区别 第04章：SQL基础 DQL数据查询 SELECT基本查询 WHERE条件过滤 ORDER BY排序 LIMIT分页 聚合函数（COUNT、SUM、AVG、MAX、MIN） GROUP BY分组查询 HAVING分组过滤 第05章：SQL进阶查询 多表连接（INNER JOIN、LEFT JOIN、RIGHT JOIN） 子查询 UNION联合查询 常用函数（字符串、日期、数学函数） 第二阶段：进阶提升 第06章：索引原理与优化 索引的概念与作用 B+Tree索引结构详解 索引类型（主键索引、唯一索引、普通索引、全文索引） 联合索引与最左前缀原则 索引的创建、删除、查看 索引失效的场景 覆盖索引与索引下推 第07章：存储引擎深入理解 InnoDB存储引擎详解 MyISAM存储引擎详解 InnoDB vs MyISAM对比 其他存储引擎介绍 如何选择存储引擎 第08章：事务与并发控制 事务的ACID特性 事务的使用（BEGIN、COMMIT、ROLLBACK） 事务隔离级别详解 脏读、不可重复读、幻读 MVCC多版本并发控制 undo log与redo log 第09章：锁机制详解 锁的分类（表锁、行锁、间隙锁、临键锁） 共享锁与排他锁 意向锁 死锁的产生与解决 锁的查看与分析 第10章：MySQL架构与执行流程 MySQL整体架构 连接器、查询缓存、分析器、优化器、执行器 SQL执行流程详解 InnoDB架构详解（内存结构、磁盘结构） 第三阶段：高级特性 第11章：视图、存储过程与函数 视图的创建与使用 存储过程的编写 自定义函数 游标的使用 流程控制语句 第12章：触发器与事件 触发器的创建与应用 事件调度器 实际应用场景 第13章：分区表 分区的概念与优势 分区类型（RANGE、LIST、HASH、KEY） 分区的创建与管理 分区查询优化 第14章：字符集与排序规则 字符集详解（utf8 vs utf8mb4） 排序规则的影响 字符集转换 emoji存储问题 第四阶段：备份与恢复（重点） 第15章：MySQL日志系统 binlog（二进制日志）详解 ⭐ binlog的作用与原理 binlog的三种格式（ROW、STATEMENT、MIXED） binlog的配置与管理 binlog的查看与分析 redo log（重做日志）详解 redo log的作用 redo log与binlog的区别 两阶段提交 undo log（回滚日志）详解 慢查询日志 错误日志 通用查询日志 第16章：备份策略与实践 备份的重要性 逻辑备份 vs 物理备份 mysqldump备份与恢复 mysqlpump备份工具 XtraBackup物理备份 增量备份与全量备份 备份策略设计 定时备份脚本 第17章：数据恢复实战 基于binlog的时间点恢复 基于binlog的位置点恢复 误删数据的恢复方案 表损坏的修复 灾难恢复演练 第五阶段：性能优化（核心） 第18章：SQL优化实战 EXPLAIN执行计划详解 ⭐ SQL优化的一般步骤 慢查询分析与优化 常见SQL优化技巧 分页查询优化 JOIN优化 子查询优化 COUNT优化 ORDER BY和GROUP BY优化 第19章：索引优化进阶 索引设计原则 索引优化案例分析 索引监控与维护 索引碎片整理 第20章：MySQL服务器优化 配置文件优化（my.cnf/my.ini） 内存参数优化 InnoDB参数优化 连接数优化 查询缓存优化（5.7） 表缓存优化 第21章：硬件与操作系统优化 硬件选型建议 磁盘I/O优化 文件系统选择 Linux内核参数优化 第六阶段：高可用架构 第22章：主从复制 主从复制原理 ⭐ 主从复制的配置 复制格式选择 半同步复制 GTID复制 主从延迟问题 主从切换 第23章：读写分离 读写分离架构 中间件方案（ProxySQL、MaxScale） 应用层读写分离 读写分离的注意事项 第24章：高可用方案 MHA高可用方案 MySQL Group Replication MySQL InnoDB Cluster Galera Cluster 双主架构 第25章：分库分表 垂直拆分与水平拆分 分库分表策略 ShardingSphere实战 分布式ID生成方案 跨库查询与事务 第七阶段：监控与故障排查（专家必备） 第26章：MySQL监控体系 监控指标体系 Prometheus + Grafana监控 Zabbix监控MySQL 慢查询监控 主从延迟监控 连接数监控 第27章：性能诊断工具 SHOW STATUS状态变量 SHOW PROCESSLIST进程列表 Performance Schema sys schema ptquerydigest慢查询分析 mysqladmin工具 innotop工具 第28章：故障排查实战 MySQL无法启动 连接数满问题 死锁问题排查 主从同步中断 表损坏修复 磁盘空间满 CPU/内存占用过高 慢查询突增问题 第八阶段：安全与权限 第29章：用户与权限管理 用户的创建与删除 权限体系详解 GRANT和REVOKE 角色管理（MySQL 8.0） 权限最小化原则 第30章：MySQL安全加固 安全配置检查清单 SQL注入防护 密码策略 SSL连接 审计日志 数据加密 第九阶段：实战案例与面试 第31章：企业级实战案例 电商系统数据库设计 秒杀系统优化方案 亿级数据表优化 数据迁移方案 跨机房容灾方案 第32章：MySQL面试题精选 基础面试题 索引相关面试题 事务与锁面试题 优化相关面试题 架构相关面试题 第33章：疑难问题解决方案 生产环境常见问题 性能突降问题排查 数据一致性问题 复制异常处理 紧急故障处理流程 📖 学习建议 循序渐进 ：按照章节顺序学习，不要跳跃 动手实践 ：每个知识点都要亲自操作验证 搭建环境 ：建议搭建主从环境进行实验 记录笔记 ：记录重点和遇到的问题 定期复习 ：重要章节需要反复学习 关注重点 ：标记⭐的章节是专家必须精通的内容 🎯 学习目标检验 完成本教程后，你应该能够： ✅ 独立完成MySQL的安装、配置、优化 ✅ 编写高效的SQL语句并进行优化 ✅ 设计合理的索引策略 ✅ 理解并配置binlog、主从复制 ✅ 制定完善的备份恢复方案 ✅ 诊断并解决各种性能问题 ✅ 搭建高可用MySQL架构 ✅ 处理生产环境的紧急故障 ✅ 通过MySQL DBA面试 📁 目录结构 MySQL学习教程/ ├── 01基础入门/ ├── 02进阶提升/ ├── 03高级特性/ ├── 04备份与恢复/ ├── 05性能优化/ ├── 06高可用架构/ ├── 07监控与诊断/ ├── 08安全管理/ └── 09实战案例/ 开始你的MySQL专家之路吧！🚀"
  },
  {
    "title": "第01章：MySQL概述与安装",
    "url": "/mysql/01/01-mysql.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "01",
    "excerpt": "第01章：MySQL概述与安装 1.1 MySQL简介 1.1.1 什么是MySQL MySQL是一个开源的关系型数据库管理系统（RDBMS），由瑞典MySQL AB公司开发，目前属于Oracle公司。MySQL是最流行的关系型数据库管理系统之一，在Web应用方面，MySQL是最好的应用软件之一。 1.1.2 MySQL的特点 开源免费 ：社区版完全免费 性...",
    "content": "第01章：MySQL概述与安装 1.1 MySQL简介 1.1.1 什么是MySQL MySQL是一个开源的关系型数据库管理系统（RDBMS），由瑞典MySQL AB公司开发，目前属于Oracle公司。MySQL是最流行的关系型数据库管理系统之一，在Web应用方面，MySQL是最好的应用软件之一。 1.1.2 MySQL的特点 开源免费 ：社区版完全免费 性能卓越 ：执行速度快，适合高并发场景 可靠性高 ：成熟稳定，被广泛应用 使用简单 ：易于安装和使用 跨平台 ：支持多种操作系统 支持大型数据库 ：可以处理拥有上千万条记录的大型数据库 1.1.3 MySQL版本选择 主要版本： MySQL 5.5 ：较老版本，不推荐新项目使用 MySQL 5.6 ：改进了性能和复制功能 MySQL 5.7 ：⭐ 本教程重点，生产环境广泛使用 性能提升显著 支持JSON数据类型 改进的复制功能 更好的性能模式（Performance Schema） MySQL 8.0 ：最新版本 默认字符集改为utf8mb4 支持窗口函数 支持CTE（公共表表达式） 移除了查询缓存 本教程选择MySQL 5.7的原因： 生产环境使用最广泛 稳定性经过充分验证 大量企业仍在使用 学习5.7后升级到8.0很容易 1.2 MySQL 5.7 在Windows上的安装 1.2.1 下载MySQL 5.7 访问MySQL官网： https://dev.mysql.com/downloads/mysql/5.7.html 选择Windows版本 下载ZIP Archive版本（推荐）或MSI Installer版本 推荐下载： mysql5.7.44winx64.zip 1.2.2 ZIP版本安装步骤 步骤1：解压文件 解压到：D:\\mysql5.7.44 步骤2：创建配置文件 在MySQL根目录下创建 my.ini 文件： [mysqld] 设置MySQL的安装目录 basedir=D:\\\\mysql5.7.44 设置MySQL数据库的数据存放目录 datadir=D:\\\\mysql5.7.44\\\\data 设置端口 port=3306 允许最大连接数 maxconnections=200 允许连接失败的次数 maxconnecterrors=10 服务端使用的字符集 charactersetserver=utf8mb4 默认存储引擎 defaultstorageengine=INNODB 默认使用&quot;mysqlnativepassword&quot;插件认证 defaultauthenticationplugin=mysqlnativepassword [mysql] 客户端使用的字符集 defaultcharacterset=utf8mb4 [client] 客户端默认端口 port=3306 defaultcharacterset=utf8mb4 步骤3：初始化MySQL 以 管理员身份 打开CMD，进入MySQL的bin目录： cd D:\\mysql5.7.44\\bin 初始化MySQL（会生成随机密码） mysqld initialize console 重要： 记录控制台输出的临时密码，类似： [Note] A temporary password is generated for root@localhost: kq7wK&gt;iu(3pN 步骤4：安装MySQL服务 安装服务 mysqld install MySQL57 启动服务 net start MySQL57 步骤5：修改root密码 登录MySQL（使用临时密码） mysql u root p 修改密码 ALTER USER 'root'@'localhost' IDENTIFIED BY '你的新密码'; 刷新权限 FLUSH PRIVILEGES; 步骤6：配置环境变量（可选） 将 D:\\mysql5.7.44\\bin 添加到系统环境变量PATH中，方便在任意位置使用mysql命令。 1.2.3 MSI安装器安装（简化版） 双击下载的MSI文件 选择&quot;Custom&quot;自定义安装 选择安装组件（MySQL Server、MySQL Workbench等） 配置MySQL Server 选择端口（默认3306） 设置root密码 配置Windows服务 完成安装 1.2.4 验证安装 查看MySQL版本 mysql version 登录MySQL mysql u root p 查看数据库 SHOW DATABASES; 查看当前用户 SELECT USER(); 1.3 MySQL 5.7 在Linux上的安装 1.3.1 CentOS/RHEL安装（YUM方式） 步骤1：下载MySQL YUM Repository 下载MySQL YUM Repository wget https://dev.mysql.com/get/mysql57communityreleaseel711.noarch.rpm 安装Repository sudo rpm ivh mysql57communityreleaseel711.noarch.rpm 验证Repository yum repolist enabled | grep mysql 步骤2：安装MySQL 安装MySQL服务器 sudo yum install mysqlcommunityserver 启动MySQL服务 sudo systemctl start mysqld 设置开机自启 sudo systemctl enable mysqld 步骤3：获取临时密码 查看临时密码 sudo grep 'temporary password' /var/log/mysqld.log 步骤4：安全配置 登录MySQL mysql u root p 修改密码（MySQL 5.7密码策略较严格） ALTER USER 'root'@'localhost' IDENTIFIED BY 'YourPassword@123'; 或者运行安全配置脚本 mysqlsecureinstallation 安全配置脚本会提示： 修改root密码 删除匿名用户 禁止root远程登录 删除test数据库 重新加载权限表 1.3.2 Ubuntu/Debian安装（APT方式） 更新包索引 sudo apt update 安装MySQL服务器 sudo apt install mysqlserver5.7 启动MySQL服务 sudo systemctl start mysql 设置开机自启 sudo systemctl enable mysql 运行安全配置 sudo mysqlsecureinstallation 1.3.3 通用二进制包安装 步骤1：下载并解压 下载 wget https://dev.mysql.com/get/Downloads/MySQL5.7/mysql5.7.44linuxglibc2.12x8664.tar.gz 解压 tar zxvf mysql5.7.44linuxglibc2.12x8664.tar.gz 移动到安装目录 sudo mv mysql5.7.44linuxglibc2.12x8664 /usr/local/mysql 步骤2：创建MySQL用户和组 创建mysql用户组 sudo groupadd mysql 创建mysql用户 sudo useradd r g mysql s /bin/false mysql 步骤3：创建数据目录并设置权限 创建数据目录 sudo mkdir p /usr/local/mysql/data 设置所有者 sudo chown R mysql:mysql /usr/local/mysql 步骤4：初始化MySQL cd /usr/local/mysql 初始化 sudo bin/mysqld initialize user=mysql basedir=/usr/local/mysql datadir=/usr/local/mysql/data 记录输出的临时密码 步骤5：配置my.cnf sudo vi /etc/my.cnf 添加以下内容： [mysqld] basedir=/usr/local/mysql datadir=/usr/local/mysql/data socket=/tmp/mysql.sock port=3306 user=mysql charactersetserver=utf8mb4 defaultstorageengine=INNODB [mysql] defaultcharacterset=utf8mb4 [client] port=3306 socket=/tmp/mysql.sock defaultcharacterset=utf8mb4 步骤6：配置系统服务 复制启动脚本 sudo cp supportfiles/mysql.server /etc/init.d/mysqld 设置执行权限 sudo chmod +x /etc/init.d/mysqld 启动MySQL sudo /etc/init.d/mysqld start 设置开机自启 sudo chkconfig add mysqld sudo chkconfig mysqld on 步骤7：配置环境变量 编辑profile sudo vi /etc/profile 添加以下内容 export PA"
  },
  {
    "title": "第02章：SQL基础",
    "url": "/mysql/01/02-sql-ddl.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "01",
    "excerpt": "第02章：SQL基础 DDL数据定义语言 DDL (Data Definition Language) 用于定义和管理数据库对象 2.1 SQL语言分类 类型 全称 说明 主要语句 DDL Data Definition Language 数据定义语言 CREATE、ALTER、DROP、TRUNCATE DML Data Manipulation Lang...",
    "content": "第02章：SQL基础 DDL数据定义语言 DDL (Data Definition Language) 用于定义和管理数据库对象 2.1 SQL语言分类 类型 全称 说明 主要语句 DDL Data Definition Language 数据定义语言 CREATE、ALTER、DROP、TRUNCATE DML Data Manipulation Language 数据操作语言 INSERT、UPDATE、DELETE DQL Data Query Language 数据查询语言 SELECT DCL Data Control Language 数据控制语言 GRANT、REVOKE TCL Transaction Control Language 事务控制语言 COMMIT、ROLLBACK、SAVEPOINT 2.2 数据库操作 2.2.1 创建数据库 基本语法 CREATE DATABASE databasename; 指定字符集 CREATE DATABASE mydb CHARACTER SET utf8mb4; 指定字符集和排序规则 CREATE DATABASE mydb CHARACTER SET utf8mb4 COLLATE utf8mb4unicodeci; 如果不存在则创建 CREATE DATABASE IF NOT EXISTS mydb; 完整示例 CREATE DATABASE IF NOT EXISTS mydb CHARACTER SET utf8mb4 COLLATE utf8mb4unicodeci; 2.2.2 查看数据库 查看所有数据库 SHOW DATABASES; 查看数据库创建语句 SHOW CREATE DATABASE mydb; 查看当前使用的数据库 SELECT DATABASE(); 2.2.3 修改数据库 修改字符集 ALTER DATABASE mydb CHARACTER SET utf8mb4; 修改排序规则 ALTER DATABASE mydb COLLATE utf8mb4unicodeci; 2.2.4 删除数据库 删除数据库（危险操作！） DROP DATABASE mydb; 如果存在则删除 DROP DATABASE IF EXISTS mydb; 2.2.5 使用数据库 切换到指定数据库 USE mydb; 2.3 数据表操作 2.3.1 创建表 基本语法： CREATE TABLE tablename ( column1 datatype constraints, column2 datatype constraints, ... tableconstraints ); 示例1：简单表 CREATE TABLE users ( id INT, name VARCHAR(50), age INT ); 示例2：完整表定义 CREATE TABLE users ( id INT PRIMARY KEY AUTOINCREMENT COMMENT '用户ID', username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名', password VARCHAR(100) NOT NULL COMMENT '密码', email VARCHAR(100) COMMENT '邮箱', phone CHAR(11) COMMENT '手机号', age INT DEFAULT 0 COMMENT '年龄', gender ENUM('M', 'F', 'U') DEFAULT 'U' COMMENT '性别', status TINYINT DEFAULT 1 COMMENT '状态：1正常，0禁用', createtime TIMESTAMP DEFAULT CURRENTTIMESTAMP COMMENT '创建时间', updatetime TIMESTAMP DEFAULT CURRENTTIMESTAMP ON UPDATE CURRENTTIMESTAMP COMMENT '更新时间', INDEX idxusername (username), INDEX idxphone (phone) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表'; 示例3：外键约束 创建部门表 CREATE TABLE departments ( id INT PRIMARY KEY AUTOINCREMENT, name VARCHAR(50) NOT NULL, description TEXT ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 创建员工表（带外键） CREATE TABLE employees ( id INT PRIMARY KEY AUTOINCREMENT, name VARCHAR(50) NOT NULL, departmentid INT, salary DECIMAL(10, 2), hiredate DATE, FOREIGN KEY (departmentid) REFERENCES departments(id) ON DELETE CASCADE ON UPDATE CASCADE ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 如果不存在则创建： CREATE TABLE IF NOT EXISTS users ( id INT PRIMARY KEY AUTOINCREMENT, name VARCHAR(50) ); 复制表结构： 只复制结构，不复制数据 CREATE TABLE userscopy LIKE users; 复制结构和数据 CREATE TABLE usersbackup AS SELECT FROM users; 复制部分数据 CREATE TABLE usersactive AS SELECT FROM users WHERE status = 1; 2.3.2 查看表 查看所有表 SHOW TABLES; 查看表结构 DESC users; 或 DESCRIBE users; 或 SHOW COLUMNS FROM users; 查看表创建语句 SHOW CREATE TABLE users; 查看表状态 SHOW TABLE STATUS LIKE 'users'\\G 2.3.3 修改表 添加列： 添加列到最后 ALTER TABLE users ADD COLUMN address VARCHAR(200); 添加列到第一个位置 ALTER TABLE users ADD COLUMN idcard CHAR(18) FIRST; 添加列到指定位置之后 ALTER TABLE users ADD COLUMN city VARCHAR(50) AFTER address; 添加多列 ALTER TABLE users ADD COLUMN province VARCHAR(50), ADD COLUMN country VARCHAR(50); 修改列： 修改列数据类型 ALTER TABLE users MODIFY COLUMN age TINYINT; 修改列名和数据类型 ALTER TABLE users CHANGE COLUMN age userage INT; 修改列默认值 ALTER TABLE users ALTER COLUMN status SET DEFAULT 1; 删除列默认值 ALTER TABLE users ALTER COLUMN status DROP DEFAULT; 删除列： 删除列 ALTER TABLE users DROP COLUMN address; 删除多列 ALTER TABLE users DROP COLUMN city, DROP COLUMN province; 修改表名： 方法1 ALTER TABLE users RENAME TO members; 方法2 RENAME TABLE members TO users; 重命名多个表 RENAME TABLE oldtable1 TO newtable1, oldtable2 TO newtable2; 修改表字符集： ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4; 修改表引擎： ALTER TABLE users ENGINE=InnoDB; 2.3.4 删除表 删除表 DROP TABLE users; 如果存在则删除 DROP TABLE IF EXISTS users; 删除多个表 DROP TABLE IF EXISTS users, orders, products; 2.3.5 清空表 方法1：TRUNCATE（快速，不能回滚） TRUNCATE TABLE users; 方法2：DELETE（慢，可以回滚） DELETE FROM users; TRUNCATE vs DELETE： 特性 TRUNCATE DELETE 速度 快 慢 自增ID 重置为1 不重置 事务回滚 不能回滚 可以回滚 触发器 不触发 触发 WHERE条件 不支持 支持 2.4 数据类型详解 2.4.1 数值类型 整数类型 类型 字节 有符号范围 无符号范围 用途 TINYINT 1 128"
  },
  {
    "title": "第03章：SQL基础",
    "url": "/mysql/01/03-sql-dml.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "01",
    "excerpt": "第03章：SQL基础 DML数据操作语言 DML (Data Manipulation Language) 用于操作数据库中的数据 3.1 DML概述 DML主要包括三个语句： INSERT ：插入数据 UPDATE ：更新数据 DELETE ：删除数据 3.2 INSERT 插入数据 3.2.1 基本语法 语法1：指定列名 INSERT INTO tabl...",
    "content": "第03章：SQL基础 DML数据操作语言 DML (Data Manipulation Language) 用于操作数据库中的数据 3.1 DML概述 DML主要包括三个语句： INSERT ：插入数据 UPDATE ：更新数据 DELETE ：删除数据 3.2 INSERT 插入数据 3.2.1 基本语法 语法1：指定列名 INSERT INTO tablename (column1, column2, ...) VALUES (value1, value2, ...); 语法2：不指定列名（必须提供所有列的值） INSERT INTO tablename VALUES (value1, value2, ...); 3.2.2 插入单行数据 准备测试表： CREATE TABLE users ( id INT PRIMARY KEY AUTOINCREMENT, username VARCHAR(50) NOT NULL, password VARCHAR(100) NOT NULL, email VARCHAR(100), age INT, status TINYINT DEFAULT 1, createtime TIMESTAMP DEFAULT CURRENTTIMESTAMP ); 插入数据： 方法1：指定列名（推荐） INSERT INTO users (username, password, email, age) VALUES ('zhangsan', '123456', 'zhangsan@example.com', 25); 方法2：不指定列名 INSERT INTO users VALUES (NULL, 'lisi', '123456', 'lisi@example.com', 30, 1, NOW()); 方法3：部分列 INSERT INTO users (username, password) VALUES ('wangwu', '123456'); email、age为NULL，status使用默认值1，createtime自动设置 3.2.3 插入多行数据 一次插入多行（推荐，性能好） INSERT INTO users (username, password, email, age) VALUES ('user1', 'pass1', 'user1@example.com', 20), ('user2', 'pass2', 'user2@example.com', 22), ('user3', 'pass3', 'user3@example.com', 24), ('user4', 'pass4', 'user4@example.com', 26); 性能对比 方法1：插入1000行，执行1000次INSERT（慢） 方法2：插入1000行，执行1次INSERT（快10倍以上） 3.2.4 插入查询结果 从另一个表插入数据 INSERT INTO usersbackup (username, password, email, age) SELECT username, password, email, age FROM users WHERE age &gt; 25; 创建表并插入数据 CREATE TABLE usersactive AS SELECT FROM users WHERE status = 1; 3.2.5 INSERT IGNORE 忽略重复键错误 INSERT IGNORE INTO users (username, password) VALUES ('zhangsan', '123456'); 如果username已存在，不会报错，也不会插入 对比：普通INSERT会报错 INSERT INTO users (username, password) VALUES ('zhangsan', '123456'); ERROR 1062: Duplicate entry 'zhangsan' for key 'username' 3.2.6 REPLACE INTO 如果存在则替换，不存在则插入 REPLACE INTO users (id, username, password) VALUES (1, 'zhangsan', 'newpass'); 等价于 DELETE FROM users WHERE id = 1; INSERT INTO users (id, username, password) VALUES (1, 'zhangsan', 'newpass'); 3.2.7 ON DUPLICATE KEY UPDATE 如果主键或唯一键冲突，则更新 INSERT INTO users (username, password, email) VALUES ('zhangsan', '123456', 'new@example.com') ON DUPLICATE KEY UPDATE password = VALUES(password), email = VALUES(email); 实战示例：统计访问次数 CREATE TABLE pageviews ( pageid INT PRIMARY KEY, viewcount INT DEFAULT 0 ); 每次访问，计数+1 INSERT INTO pageviews (pageid, viewcount) VALUES (1, 1) ON DUPLICATE KEY UPDATE viewcount = viewcount + 1; 3.3 UPDATE 更新数据 3.3.1 基本语法 UPDATE tablename SET column1 = value1, column2 = value2, ... WHERE condition; ⚠️ 警告： 如果不加WHERE条件，会更新所有行！ 3.3.2 更新单行 更新单个字段 UPDATE users SET email = 'newemail@example.com' WHERE id = 1; 更新多个字段 UPDATE users SET email = 'newemail@example.com', age = 26 WHERE id = 1; 3.3.3 更新多行 更新所有年龄小于18的用户状态 UPDATE users SET status = 0 WHERE age &lt; 18; 更新所有用户（危险！） UPDATE users SET status = 1; 3.3.4 使用表达式更新 年龄+1 UPDATE users SET age = age + 1 WHERE id = 1; 字符串拼接 UPDATE users SET username = CONCAT(username, 'old') WHERE status = 0; 使用函数 UPDATE users SET email = LOWER(email); 3.3.5 基于其他表更新 根据另一个表的数据更新 UPDATE users u INNER JOIN userprofiles p ON u.id = p.userid SET u.age = p.age WHERE p.age IS NOT NULL; 示例：更新订单总金额 UPDATE orders o SET o.totalamount = ( SELECT SUM(quantity price) FROM orderitems WHERE orderid = o.id ); 3.3.6 LIMIT限制更新行数 只更新前10行 UPDATE users SET status = 0 WHERE age &lt; 18 LIMIT 10; 3.3.7 安全模式 查看安全模式状态 SHOW VARIABLES LIKE 'sqlsafeupdates'; 开启安全模式（防止误操作） SET sqlsafeupdates = 1; 此时必须带WHERE条件且包含主键或索引列 UPDATE users SET status = 0; 报错 UPDATE users SET status = 0 WHERE id = 1; 正常 关闭安全模式 SET sqlsafeupdates = 0; 3.4 DELETE 删除数据 3.4.1 基本语法 DELETE FROM tablename WHERE condition; ⚠️ 警告： 如果不加WHERE条件，会删除所有行！ 3.4.2 删除单行 删除指定ID的用户 DELETE FROM users WHERE id = 1; 删除指定用户名的用户 DELETE FROM users WHERE username = 'zhangsan'; 3.4.3 删除多行 删除所有状态为0的用户 DELETE FROM users WHERE status = 0; 删除年龄小于18的用户 DELETE FROM users WHERE age &lt; 18; 删除所有用户（危险！） DELETE FROM users; 3.4.4 LIMIT限制删除行数 只删除前10行 DELETE FROM users WHERE status = 0 LIMIT 10; 删除最早的100条记录 DELETE FROM logs ORDER BY createtime ASC LIMIT 100; 3.4.5 基于"
  },
  {
    "title": "第04章：SQL基础",
    "url": "/mysql/01/04-sql-dql.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "01",
    "excerpt": "第04章：SQL基础 DQL数据查询语言 DQL (Data Query Language) 是SQL中最常用的部分，用于从数据库中查询数据 4.1 DQL概述 DQL主要语句： SELECT ：查询数据（最核心、最常用） SELECT语句的执行顺序： FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY ...",
    "content": "第04章：SQL基础 DQL数据查询语言 DQL (Data Query Language) 是SQL中最常用的部分，用于从数据库中查询数据 4.1 DQL概述 DQL主要语句： SELECT ：查询数据（最核心、最常用） SELECT语句的执行顺序： FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT 4.2 SELECT基本查询 4.2.1 查询所有列 查询表中所有列的所有数据 SELECT FROM users; ⚠️ 生产环境不推荐使用SELECT ，原因： 1. 性能差：查询不需要的列浪费资源 2. 网络传输：传输不需要的数据 3. 索引失效：无法使用覆盖索引 4.2.2 查询指定列 推荐：只查询需要的列 SELECT id, username, email FROM users; 查询结果中使用表达式 SELECT id, username, age, age + 1 AS nextyearage FROM users; 查询结果中使用函数 SELECT id, username, UPPER(email) AS emailupper FROM users; 4.2.3 列别名 使用AS关键字（推荐） SELECT id AS userid, username AS name FROM users; 省略AS关键字 SELECT id userid, username name FROM users; 别名包含空格时使用引号 SELECT id AS 'user id', username AS '用户名' FROM users; 4.2.4 去重查询 创建测试数据 CREATE TABLE orders ( id INT PRIMARY KEY AUTOINCREMENT, userid INT, productname VARCHAR(100), amount DECIMAL(10,2) ); INSERT INTO orders (userid, productname, amount) VALUES (1, 'iPhone', 5999.00), (1, 'iPad', 3999.00), (2, 'iPhone', 5999.00), (3, 'MacBook', 9999.00), (2, 'AirPods', 1299.00); 查询所有下单的用户ID（有重复） SELECT userid FROM orders; 结果：1, 1, 2, 3, 2 使用DISTINCT去重 SELECT DISTINCT userid FROM orders; 结果：1, 2, 3 多列去重（组合去重） SELECT DISTINCT userid, productname FROM orders; 4.3 WHERE条件过滤 4.3.1 比较运算符 等于 SELECT FROM users WHERE age = 25; 不等于（两种写法） SELECT FROM users WHERE age != 25; SELECT FROM users WHERE age &lt;&gt; 25; 大于、小于 SELECT FROM users WHERE age &gt; 25; SELECT FROM users WHERE age &lt; 25; SELECT FROM users WHERE age &gt;= 25; SELECT FROM users WHERE age &lt;= 25; 4.3.2 逻辑运算符 AND：多个条件同时满足 SELECT FROM users WHERE age &gt;= 18 AND age &lt;= 30; OR：满足任一条件 SELECT FROM users WHERE age &lt; 18 OR age &gt; 60; NOT：取反 SELECT FROM users WHERE NOT (age &lt; 18); 组合使用（注意优先级，AND优先于OR） SELECT FROM users WHERE (age &lt; 18 OR age &gt; 60) AND status = 1; 4.3.3 范围查询 BETWEEN...AND（包含边界值） SELECT FROM users WHERE age BETWEEN 18 AND 30; 等价于：WHERE age &gt;= 18 AND age &lt;= 30 NOT BETWEEN SELECT FROM users WHERE age NOT BETWEEN 18 AND 30; IN：在指定列表中 SELECT FROM users WHERE age IN (18, 20, 25, 30); 等价于：WHERE age = 18 OR age = 20 OR age = 25 OR age = 30 NOT IN SELECT FROM users WHERE age NOT IN (18, 20, 25); 4.3.4 模糊查询 LIKE模糊匹配 %：匹配任意多个字符（包括0个） ：匹配单个字符 查询姓张的用户 SELECT FROM users WHERE username LIKE '张%'; 查询名字中包含&quot;明&quot;的用户 SELECT FROM users WHERE username LIKE '%明%'; 查询姓张且名字是两个字的用户 SELECT FROM users WHERE username LIKE '张'; 查询姓张且名字是三个字的用户 SELECT FROM users WHERE username LIKE '张'; ⚠️ 性能警告：前导模糊查询无法使用索引 ❌ 慢：SELECT FROM users WHERE username LIKE '%张%'; ✅ 快：SELECT FROM users WHERE username LIKE '张%'; 4.3.5 NULL值查询 查询email为NULL的用户 SELECT FROM users WHERE email IS NULL; 查询email不为NULL的用户 SELECT FROM users WHERE email IS NOT NULL; ⚠️ 错误写法（NULL不能用=比较） ❌ SELECT FROM users WHERE email = NULL; 查不到数据 ✅ SELECT FROM users WHERE email IS NULL; 4.4 ORDER BY排序 4.4.1 单列排序 升序排序（ASC，默认） SELECT FROM users ORDER BY age ASC; SELECT FROM users ORDER BY age; 省略ASC 降序排序（DESC） SELECT FROM users ORDER BY age DESC; 按创建时间倒序（最新的在前） SELECT FROM users ORDER BY createtime DESC; 4.4.2 多列排序 先按年龄升序，年龄相同时按创建时间降序 SELECT FROM users ORDER BY age ASC, createtime DESC; 先按状态，再按年龄 SELECT FROM users ORDER BY status, age DESC; 4.4.3 按表达式排序 按列别名排序 SELECT id, username, age, age + 1 AS nextage FROM users ORDER BY nextage DESC; 按函数结果排序 SELECT FROM users ORDER BY LENGTH(username) DESC; 4.4.4 NULL值排序 MySQL中NULL值排序规则： ASC：NULL值排在最前面 DESC：NULL值排在最后面 SELECT FROM users ORDER BY email ASC; NULL在前 SELECT FROM users ORDER BY email DESC; NULL在后 4.5 LIMIT分页 4.5.1 基本用法 查询前5条记录 SELECT FROM users LIMIT 5; 查询前10条记录 SELECT FROM users ORDER BY createtime DESC LIMIT 10; 4.5.2 分页查询 语法：LIMIT offset, count offset：偏移量（从0开始） count：返回的记录数 第1页（每页10条） SELECT FROM users LIMIT 0, 10; 第2页（每页10条） SELECT FROM users LIMIT 10, 10; 第3页（每页10条） SELECT FROM users LIMIT 20, 10; 通用公式：第n页 LIMIT (n1) pageSize, pageSize 4.5.3 另一种语法 LIMIT count OFFSET offset（MySQL 5.7支持） SELECT FROM users LIMIT 10 OFFSET 0; 第1页 SELECT FROM users LIMIT 10 OFFSET 10; 第2页 SELECT FROM users LIMIT 10 OFFSET 20; 第3页 4.5.4 深分页性能问题 ⚠️ 性"
  },
  {
    "title": "第05章：SQL进阶查询",
    "url": "/mysql/01/05-sql.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "01",
    "excerpt": "第05章：SQL进阶查询 掌握多表连接、子查询、联合查询等高级查询技巧 5.1 多表连接概述 为什么需要多表连接？ 数据库设计遵循范式，数据分散在多个表中 需要从多个表中组合数据进行查询 避免数据冗余，提高数据一致性 连接类型： INNER JOIN ：内连接（最常用） LEFT JOIN ：左外连接 RIGHT JOIN ：右外连接 CROSS JOIN ...",
    "content": "第05章：SQL进阶查询 掌握多表连接、子查询、联合查询等高级查询技巧 5.1 多表连接概述 为什么需要多表连接？ 数据库设计遵循范式，数据分散在多个表中 需要从多个表中组合数据进行查询 避免数据冗余，提高数据一致性 连接类型： INNER JOIN ：内连接（最常用） LEFT JOIN ：左外连接 RIGHT JOIN ：右外连接 CROSS JOIN ：交叉连接（笛卡尔积） 5.2 准备测试数据 创建用户表 CREATE TABLE users ( id INT PRIMARY KEY AUTOINCREMENT, username VARCHAR(50) NOT NULL, age INT, city VARCHAR(50) ); 创建订单表 CREATE TABLE orders ( id INT PRIMARY KEY AUTOINCREMENT, userid INT, productname VARCHAR(100), amount DECIMAL(10,2), orderdate DATE ); 创建产品表 CREATE TABLE products ( id INT PRIMARY KEY AUTOINCREMENT, productname VARCHAR(100), category VARCHAR(50), price DECIMAL(10,2) ); 插入用户数据 INSERT INTO users (username, age, city) VALUES ('张三', 25, '北京'), ('李四', 30, '上海'), ('王五', 28, '广州'), ('赵六', 35, '深圳'), ('钱七', 22, '杭州'); 插入订单数据 INSERT INTO orders (userid, productname, amount, orderdate) VALUES (1, 'iPhone', 5999.00, '20240115'), (1, 'iPad', 3999.00, '20240220'), (2, 'MacBook', 9999.00, '20240110'), (2, 'AirPods', 1299.00, '20240305'), (3, 'iPhone', 5999.00, '20240201'), (NULL, 'Apple Watch', 2999.00, '20240120'); 游客订单 插入产品数据 INSERT INTO products (productname, category, price) VALUES ('iPhone', '手机', 5999.00), ('iPad', '平板', 3999.00), ('MacBook', '电脑', 9999.00), ('AirPods', '耳机', 1299.00), ('Apple Watch', '手表', 2999.00), ('iMac', '电脑', 12999.00); 没有订单的产品 5.3 INNER JOIN 内连接 5.3.1 基本语法 语法1：显式内连接（推荐） SELECT columns FROM table1 INNER JOIN table2 ON table1.column = table2.column; 语法2：隐式内连接（不推荐） SELECT columns FROM table1, table2 WHERE table1.column = table2.column; 5.3.2 两表内连接 查询所有订单及对应的用户信息 SELECT u.id AS userid, u.username, o.id AS orderid, o.productname, o.amount FROM users u INNER JOIN orders o ON u.id = o.userid; 结果：只返回有订单的用户（userid为NULL的订单不会显示） 张三的2个订单、李四的2个订单、王五的1个订单 使用表别名简化查询 SELECT u.username, o.productname, o.amount FROM users u INNER JOIN orders o ON u.id = o.userid; 5.3.3 多表内连接 查询订单、用户、产品信息 SELECT u.username, o.productname, o.amount, p.category, p.price FROM users u INNER JOIN orders o ON u.id = o.userid INNER JOIN products p ON o.productname = p.productname; 连接顺序：users → orders → products 5.3.4 内连接 + WHERE条件 查询购买了iPhone的用户 SELECT u.username, o.productname, o.amount FROM users u INNER JOIN orders o ON u.id = o.userid WHERE o.productname = 'iPhone'; 查询2024年1月的订单及用户信息 SELECT u.username, o.productname, o.amount, o.orderdate FROM users u INNER JOIN orders o ON u.id = o.userid WHERE o.orderdate &gt;= '20240101' AND o.orderdate &lt; '20240201'; 5.3.5 内连接 + 聚合函数 查询每个用户的订单数量和总金额 SELECT u.id, u.username, COUNT(o.id) AS ordercount, SUM(o.amount) AS totalamount FROM users u INNER JOIN orders o ON u.id = o.userid GROUP BY u.id, u.username ORDER BY totalamount DESC; 注意：只显示有订单的用户（钱七和赵六不会显示） 5.4 LEFT JOIN 左外连接 5.4.1 基本概念 LEFT JOIN：返回左表所有记录，右表没有匹配的显示NULL SELECT columns FROM table1 LEFT JOIN table2 ON table1.column = table2.column; 特点： 1. 左表（table1）的所有记录都会返回 2. 右表（table2）没有匹配的记录，对应列显示NULL 5.4.2 基本用法 查询所有用户及其订单信息（包括没有订单的用户） SELECT u.id, u.username, o.id AS orderid, o.productname, o.amount FROM users u LEFT JOIN orders o ON u.id = o.userid; 结果： 张三的2个订单 李四的2个订单 王五的1个订单 赵六：NULL（没有订单） 钱七：NULL（没有订单） 5.4.3 查询没有订单的用户 查询没有下过订单的用户 SELECT u.id, u.username FROM users u LEFT JOIN orders o ON u.id = o.userid WHERE o.id IS NULL; 结果：赵六、钱七 5.4.4 LEFT JOIN + 聚合函数 查询所有用户的订单数量和总金额（包括没有订单的用户） SELECT u.id, u.username, COUNT(o.id) AS ordercount, 使用COUNT(o.id)而不是COUNT() IFNULL(SUM(o.amount), 0) AS totalamount FROM users u LEFT JOIN orders o ON u.id = o.userid GROUP BY u.id, u.username ORDER BY totalamount DESC; 注意： COUNT( o.id )：统计订单数（NULL不计数） COUNT()：统计所有行（包括NULL） IFNULL(SUM(o.amount), 0)：将NULL转换为0 5.5 RIGHT JOIN 右外连接 5.5.1 基本概念 RIGHT JOIN：返回右表所有记录，左表没有匹配的显示NULL SELECT columns FROM table1 RIGHT JOIN table2 ON table1.column = table2.column; 特点：与LEFT JOIN相反 实际开发中很少使用，通常用LEFT JOIN代替 5.5.2 基本用法 查询所有订单及对应的用户信息（包括游客订单） SELECT u.id, u.username, o.id AS orderid, o.productname, o.amount FROM users u RIGHT JOIN orders o ON u.id = o.userid; 结果：包括userid为NULL的订单（游客订单） 等价的LEFT JOIN写法（推荐） SELECT u.id , u.username, o.id AS orderid, o.productname, o.amount FROM ord"
  },
  {
    "title": "第06章：索引原理与优化 ⭐⭐⭐⭐⭐",
    "url": "/mysql/02/06.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "02",
    "excerpt": "第06章：索引原理与优化 ⭐⭐⭐⭐⭐ 索引是MySQL性能优化的核心，必须深入理解 6.1 索引的概念 6.1.1 什么是索引 索引是一种数据结构，用于帮助MySQL高效地查找数据。 类比： 没有索引：像在字典中逐页查找一个单词（全表扫描） 有索引：像使用字典的目录快速定位（索引查找） 6.1.2 索引的优缺点 优点： ✅ 大大加快数据查询速度 ✅ 加速表与...",
    "content": "第06章：索引原理与优化 ⭐⭐⭐⭐⭐ 索引是MySQL性能优化的核心，必须深入理解 6.1 索引的概念 6.1.1 什么是索引 索引是一种数据结构，用于帮助MySQL高效地查找数据。 类比： 没有索引：像在字典中逐页查找一个单词（全表扫描） 有索引：像使用字典的目录快速定位（索引查找） 6.1.2 索引的优缺点 优点： ✅ 大大加快数据查询速度 ✅ 加速表与表之间的连接 ✅ 减少分组和排序的时间 ✅ 使用覆盖索引可以避免回表 缺点： ❌ 占用额外的磁盘空间 ❌ 降低INSERT、UPDATE、DELETE的速度 ❌ 需要维护成本 何时使用索引： ✅ WHERE条件字段 ✅ ORDER BY字段 ✅ GROUP BY字段 ✅ JOIN的ON字段 ✅ 经常查询的字段 何时不使用索引： ❌ 数据量很小的表（几百行） ❌ 频繁更新的字段 ❌ 区分度很低的字段（如性别） ❌ WHERE条件中用不到的字段 6.2 索引的数据结构 6.2.1 为什么使用B+Tree 常见数据结构对比： 数据结构 查询时间复杂度 缺点 数组 O(n) 查询慢 链表 O(n) 查询慢 哈希表 O(1) 不支持范围查询、排序 二叉搜索树 O(log n) 可能退化为链表 平衡二叉树（AVL） O(log n) 树太高，磁盘I/O次数多 红黑树 O(log n) 树太高，磁盘I/O次数多 B+Tree O(log n) ✅ 树矮、范围查询快 为什么不用哈希表？ 哈希表适合等值查询 SELECT FROM users WHERE id = 100; ✅ 快 但不支持范围查询 SELECT FROM users WHERE id &gt; 100; ❌ 慢 SELECT FROM users ORDER BY id; ❌ 慢 为什么不用二叉树？ 假设100万条数据： 二叉树高度：log₂(1000000) ≈ 20层 需要20次磁盘I/O B+Tree（假设每个节点1000个key）： B+Tree高度：log₁₀₀₀(1000000) ≈ 3层 只需要3次磁盘I/O 6.2.2 B+Tree结构详解 B+Tree特点： 所有数据都存储在叶子节点 叶子节点之间有指针连接（双向链表） 非叶子节点只存储索引，不存储数据 树的高度很低（通常34层） B+Tree示例： [50, 100] ← 根节点（非叶子节点） / | \\ / | \\ [10,20,30] [60,70] [110,120] ← 非叶子节点 / | | \\ / | | \\ [19][1019][2029][3039] ... [110119][120129] ← 叶子节点（存储数据） ↔ ↔ ↔ ↔ ↔ ↔ ← 双向链表 查询过程： 查询 id=25 的记录 SELECT FROM users WHERE id = 25; 查询过程： 1. 从根节点开始：25 &lt; 50，走左边 2. 到达 [10,20,30]：20 &lt; 25 &lt; 30，走中间 3. 到达叶子节点 [2029]，找到 id=25 的数据 总共3次磁盘I/O 范围查询： 查询 id 在 2060 之间的记录 SELECT FROM users WHERE id BETWEEN 20 AND 60; 查询过程： 1. 找到 id=20 的叶子节点 2. 通过叶子节点的链表指针，顺序扫描到 id=60 非常高效！ 6.2.3 InnoDB的B+Tree InnoDB的两种索引： 1. 聚簇索引（Clustered Index）： 叶子节点存储完整的行数据 一个表只有一个聚簇索引 通常是主键索引 结构： 聚簇索引（主键索引）： [50, 100] / | \\ [10,20,30] [60,70] [110,120] / | | \\ [id=1, [id=10, [id=20, [id=30, name= name= name= name= age= age= age= age= ...] ...] ...] ...] ↔ ↔ ↔ ↔ 2. 二级索引（Secondary Index）： 叶子节点存储索引列的值 + 主键值 一个表可以有多个二级索引 结构： 二级索引（name索引）： ['李', '王'] / | \\ ['张三','张四'] ['李四','李五'] ['王五','王六'] / | \\ [name='张三', [name='张四', [name='李四', id=1] id=5] id=10] ↔ ↔ ↔ 回表查询： 使用二级索引查询 SELECT FROM users WHERE name = '张三'; 查询过程： 1. 在name索引中找到 name='张三'，得到 id=1 2. 回到聚簇索引，根据 id=1 查找完整数据 这就是&quot;回表&quot; 覆盖索引（避免回表）： 创建联合索引 CREATE INDEX idxnameage ON users(name, age); 只查询索引中的字段，不需要回表 SELECT name, age FROM users WHERE name = '张三'; Extra: Using index（覆盖索引） 6.2.4 MyISAM的B+Tree MyISAM的索引： 所有索引都是非聚簇索引 叶子节点存储索引列的值 + 数据文件的地址指针 主键索引和二级索引结构相同 结构： MyISAM索引： [50, 100] / | \\ [10,20,30] [60,70] [110,120] / | | \\ [id=1, [id=10, [id=20, [id=30, addr] addr] addr] addr] ↔ ↔ ↔ ↔ addr: 数据文件中的物理地址 6.3 索引类型 6.3.1 按功能分类 1. 主键索引（PRIMARY KEY） 特点： 唯一且不能为NULL 一个表只能有一个主键 InnoDB中是聚簇索引 创建： 创建表时指定 CREATE TABLE users ( id INT PRIMARY KEY, name VARCHAR(50) ); 或 CREATE TABLE users ( id INT, name VARCHAR(50), PRIMARY KEY (id) ); 添加主键 ALTER TABLE users ADD PRIMARY KEY (id); 删除主键 ALTER TABLE users DROP PRIMARY KEY; 2. 唯一索引（UNIQUE） 特点： 列值必须唯一，但可以有NULL 一个表可以有多个唯一索引 创建： 创建表时指定 CREATE TABLE users ( id INT PRIMARY KEY, email VARCHAR(100) UNIQUE ); 创建唯一索引 CREATE UNIQUE INDEX idxemail ON users(email); 或 ALTER TABLE users ADD UNIQUE INDEX idxemail (email); 删除唯一索引 DROP INDEX idxemail ON users; 3. 普通索引（INDEX） 特点： 最基本的索引 没有任何限制 创建： 创建索引 CREATE INDEX idxname ON users(name); 或 ALTER TABLE users ADD INDEX idxname (name); 删除索引 DROP INDEX idxname ON users; 4. 全文索引（FULLTEXT） 特点： 用于全文搜索 只支持CHAR、VARCHAR、TEXT类型 InnoDB在MySQL 5.6+支持 创建： 创建全文索引 CREATE FULLTEXT INDEX idxcontent ON articles(content); 使用全文索引 SELECT FROM articles WHERE MATCH(content) AGAINST('MySQL' IN NATURAL LANGUAGE MODE); 6.3.2 按字段数量分类 1. 单列索引 CREATE INDEX idxname ON users(name); 2. 联合索引（组合索引）⭐⭐⭐⭐⭐ 创建： 创建联合索引 CREATE INDEX idxnameagecity ON users(name, age, city); 最左前缀原则： 索引：idxnameagecity (name, age, city) ✅ 可以使用索引 WHERE name = '张三' WHERE name = '张三' AND age = 20 WHERE name = '张三' AND age = 20 AND city = '北京' WHERE name = '张三' AND city = '北京' 只使用name ❌ 不能使用索引 WHERE age = 20 WHERE city = '北京' WHERE age = 20 AND city = '北京' 索引顺序的选择： 原则：区分度高的字段放前面 假设： name: 10000个不同值（区分度高） age: 100个不同值（区分度中） city: 10个不同值（区分度低） 推荐顺序： CREATE INDEX idxnameagecity ON users(name, age, city); 不推荐： CREATE INDEX idxcityagename ON users(city, age, name);"
  },
  {
    "title": "第07章：存储引擎深入理解",
    "url": "/mysql/02/07.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "02",
    "excerpt": "第07章：存储引擎深入理解 存储引擎是MySQL的核心组件，决定了数据的存储方式和性能特性 7.1 存储引擎概述 7.1.1 什么是存储引擎？ 存储引擎（Storage Engine）： MySQL的数据存储和管理机制 负责数据的存储、索引、事务等功能 不同的存储引擎有不同的特性和适用场景 MySQL的插件式存储引擎架构： 应用层 ↓ SQL层（解析、优化）...",
    "content": "第07章：存储引擎深入理解 存储引擎是MySQL的核心组件，决定了数据的存储方式和性能特性 7.1 存储引擎概述 7.1.1 什么是存储引擎？ 存储引擎（Storage Engine）： MySQL的数据存储和管理机制 负责数据的存储、索引、事务等功能 不同的存储引擎有不同的特性和适用场景 MySQL的插件式存储引擎架构： 应用层 ↓ SQL层（解析、优化） ↓ 存储引擎层（InnoDB、MyISAM等） ↓ 文件系统 7.1.2 查看存储引擎 查看MySQL支持的所有存储引擎 SHOW ENGINES; 查看当前默认存储引擎 SHOW VARIABLES LIKE 'defaultstorageengine'; 查看表使用的存储引擎 SHOW TABLE STATUS FROM databasename; SHOW CREATE TABLE tablename; 7.1.3 MySQL 5.7支持的存储引擎 存储引擎 说明 事务 锁粒度 InnoDB 默认引擎，支持事务 ✅ 行锁 MyISAM 高性能，不支持事务 ❌ 表锁 Memory 内存存储，速度快 ❌ 表锁 Archive 压缩存储，适合归档 ❌ 行锁 CSV CSV格式存储 ❌ 表锁 Blackhole 黑洞引擎，不存储数据 ❌ 7.2 InnoDB存储引擎 ⭐⭐⭐⭐⭐ 7.2.1 InnoDB概述 InnoDB特点： ✅ 支持事务 （ACID特性） ✅ 支持外键 ✅ 行级锁 （并发性能好） ✅ MVCC （多版本并发控制） ✅ 崩溃恢复 （crashsafe） ✅ 聚簇索引 （数据和索引存储在一起） 适用场景： 需要事务支持的应用（转账、订单等） 高并发读写场景 需要崩溃恢复的场景 大部分OLTP（在线事务处理）应用 MySQL 5.7默认存储引擎：InnoDB 7.2.2 InnoDB文件结构 InnoDB数据文件 /var/lib/mysql/ ├── ibdata1 系统表空间（共享表空间） ├── iblogfile0 redo log文件 ├── iblogfile1 redo log文件 └── databasename/ ├── tablename.frm 表结构定义文件 └── tablename.ibd 表数据和索引文件（独立表空间） 文件说明： ibdata1 ：系统表空间，存储数据字典、undo log等 iblogfile ：redo log，用于崩溃恢复 .frm ：表结构定义文件（所有引擎都有） .ibd ：独立表空间，存储表数据和索引 7.2.3 InnoDB核心特性 1. 事务支持 InnoDB支持完整的ACID事务 START TRANSACTION; UPDATE accounts SET balance = balance 100 WHERE userid = 1; UPDATE accounts SET balance = balance + 100 WHERE userid = 2; COMMIT; 或 ROLLBACK 2. 行级锁 InnoDB使用行级锁，并发性能好 会话1 START TRANSACTION; UPDATE users SET age = 26 WHERE id = 1; 锁定id=1的行 会话2（不会被阻塞） UPDATE users SET age = 31 WHERE id = 2; 可以正常执行 会话3（会被阻塞） UPDATE users SET age = 27 WHERE id = 1; 等待会话1释放锁 3. 外键约束 InnoDB支持外键 CREATE TABLE orders ( id INT PRIMARY KEY AUTOINCREMENT, userid INT, amount DECIMAL(10,2), FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE ) ENGINE=InnoDB; 外键约束： 1. 保证数据完整性 2. 级联删除/更新 3. 性能开销较大 4. MVCC多版本并发控制 InnoDB通过MVCC实现高并发 读不加锁，写不阻塞读 详见第08章：事务与并发控制 5. 崩溃恢复 InnoDB通过redo log实现崩溃恢复 MySQL异常关闭后，重启时自动恢复未提交的事务 详见第15章：MySQL日志系统 7.2.4 InnoDB配置参数 [mysqld] InnoDB缓冲池大小（最重要的参数） 建议设置为物理内存的50%70% innodbbufferpoolsize = 1G InnoDB日志文件大小 innodblogfilesize = 512M InnoDB刷新日志策略 0: 每秒刷新（性能最好，可能丢失1秒数据） 1: 每次事务提交刷新（最安全，性能较差）⭐ 推荐 2: 每次事务提交写入OS缓存，每秒刷新 innodbflushlogattrxcommit = 1 InnoDB文件格式 innodbfileformat = Barracuda 独立表空间（推荐开启） innodbfilepertable = 1 InnoDB IO线程数 innodbreadiothreads = 4 innodbwriteiothreads = 4 InnoDB锁等待超时时间（秒） innodblockwaittimeout = 50 7.2.5 InnoDB索引结构 InnoDB使用聚簇索引（Clustered Index） 特点： 1. 主键索引的叶子节点存储完整的行数据 2. 二级索引的叶子节点存储主键值 3. 通过二级索引查询需要回表 示例 CREATE TABLE users ( id INT PRIMARY KEY, 聚簇索引 username VARCHAR(50), age INT, INDEX idxage (age) 二级索引 ) ENGINE=InnoDB; 查询过程： SELECT FROM users WHERE age = 25; 1. 通过idxage找到age=25的主键id 2. 通过主键id回表查询完整数据 7.3 MyISAM存储引擎 7.3.1 MyISAM概述 MyISAM特点： ❌ 不支持事务 ❌ 不支持外键 ✅ 表级锁 （并发性能差） ✅ 支持全文索引 （MySQL 5.6之前） ✅ 压缩表 （节省空间） ✅ 查询速度快 （简单查询） 适用场景： 只读或读多写少的应用 不需要事务的场景 日志、历史数据等 MySQL 5.7已不推荐使用 7.3.2 MyISAM文件结构 MyISAM数据文件 /var/lib/mysql/databasename/ ├── tablename.frm 表结构定义文件 ├── tablename.MYD 数据文件（MYData） └── tablename.MYI 索引文件（MYIndex） 文件说明： .frm ：表结构定义 .MYD ：表数据 .MYI ：表索引 7.3.3 MyISAM核心特性 1. 表级锁 MyISAM使用表级锁，并发性能差 会话1 UPDATE users SET age = 26 WHERE id = 1; 锁定整个表 会话2（被阻塞） UPDATE users SET age = 31 WHERE id = 2; 等待表锁释放 SELECT FROM users WHERE id = 3; 读操作也可能被阻塞 2. 不支持事务 MyISAM不支持事务 START TRANSACTION; 无效 UPDATE users SET age = 26 WHERE id = 1; ROLLBACK; 无法回滚，数据已经修改 3. 不支持崩溃恢复 MyISAM没有redo log MySQL异常关闭可能导致数据损坏 需要使用REPAIR TABLE修复 REPAIR TABLE tablename; 4. 支持压缩表 MyISAM支持压缩表（只读） 使用myisampack工具压缩 可以节省50%80%的磁盘空间 7.3.4 MyISAM索引结构 MyISAM使用非聚簇索引（NonClustered Index） 特点： 1. 索引和数据分开存储 2. 索引的叶子节点存储数据的物理地址 3. 主键索引和二级索引结构相同 示例 CREATE TABLE users ( id INT PRIMARY KEY, username VARCHAR(50), age INT, INDEX idxage (age) ) ENGINE=MyISAM; 查询过程： SELECT FROM users WHERE age = 25; 1. 通过idxage找到age=25的数据物理地址 2. 通过物理地址直接读取数据 7.4 InnoDB vs MyISAM对比 ⭐⭐⭐⭐⭐ 7.4.1 核心差异对比 特性 InnoDB MyISAM 事务 ✅ 支持 ❌ 不支持 外键 ✅ 支持 ❌ 不支持 锁粒度 行锁 表锁 MVCC ✅ 支持 ❌ 不支持 崩溃恢复 ✅ 支持 ❌ 不支持 索引类型 聚簇索引 非聚簇索引 全文索引 ✅ 5.6+支持 ✅ 支持 压缩 ✅ 支持 ✅ 支持 存储空间 较大 较小 查询性能 较好 简单查询更快 写入性能 较好 较差（表锁） 适用场景 OLTP OLAP（只读） 7.4.2 性能对比 读性能对比 简单查询：MyISAM略快（无事务开销） 复杂查询：InnoDB更快（行锁、MVCC） "
  },
  {
    "title": "第08章：事务与并发控制 ⭐⭐⭐⭐⭐",
    "url": "/mysql/02/08.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "02",
    "excerpt": "第08章：事务与并发控制 ⭐⭐⭐⭐⭐ 事务是数据库的核心特性，理解事务和MVCC是成为MySQL专家的必备知识 8.1 事务概述 8.1.1 什么是事务 事务（Transaction） ：一组SQL语句的集合，要么全部成功，要么全部失败。 经典案例：银行转账 转账操作必须是一个事务 START TRANSACTION; 步骤1：A账户扣款 UPDATE ac...",
    "content": "第08章：事务与并发控制 ⭐⭐⭐⭐⭐ 事务是数据库的核心特性，理解事务和MVCC是成为MySQL专家的必备知识 8.1 事务概述 8.1.1 什么是事务 事务（Transaction） ：一组SQL语句的集合，要么全部成功，要么全部失败。 经典案例：银行转账 转账操作必须是一个事务 START TRANSACTION; 步骤1：A账户扣款 UPDATE accounts SET balance = balance 100 WHERE userid = 1; 步骤2：B账户加款 UPDATE accounts SET balance = balance + 100 WHERE userid = 2; 提交事务 COMMIT; 如果步骤1成功，步骤2失败，会导致钱丢失！事务保证两个操作要么都成功，要么都失败。 8.2 ACID特性 事务必须满足ACID四大特性： 8.2.1 原子性（Atomicity） 定义： 事务是最小的执行单位，不可分割。要么全部成功，要么全部失败。 实现机制： undo log（回滚日志） 示例： START TRANSACTION; INSERT INTO users (username) VALUES ('user1'); INSERT INTO users (username) VALUES ('user2'); 这里发生错误 INSERT INTO users (username) VALUES (NULL); 违反NOT NULL约束 ROLLBACK; 回滚，前面的INSERT也会撤销 8.2.2 一致性（Consistency） 定义： 事务执行前后，数据库从一个一致性状态转换到另一个一致性状态。 示例： 转账前：A=1000, B=500, 总额=1500 START TRANSACTION; UPDATE accounts SET balance = balance 100 WHERE userid = 1; A=900 UPDATE accounts SET balance = balance + 100 WHERE userid = 2; B=600 COMMIT; 转账后：A=900, B=600, 总额=1500（保持一致） 8.2.3 隔离性（Isolation） 定义： 多个事务并发执行时，一个事务的执行不应影响其他事务。 问题： 如果没有隔离性，会出现脏读、不可重复读、幻读等问题。 实现机制： 锁机制 + MVCC（多版本并发控制） 8.2.4 持久性（Durability） 定义： 事务一旦提交，对数据库的改变是永久性的。 实现机制： redo log（重做日志） 示例： START TRANSACTION; INSERT INTO users (username) VALUES ('user1'); COMMIT; 即使此时MySQL崩溃，重启后数据仍然存在 8.3 事务的使用 8.3.1 开启事务 方法1 START TRANSACTION; 方法2 BEGIN; 方法3：开启只读事务 START TRANSACTION READ ONLY; 方法4：开启读写事务 START TRANSACTION READ WRITE; 8.3.2 提交事务 COMMIT; 8.3.3 回滚事务 ROLLBACK; 8.3.4 保存点 START TRANSACTION; INSERT INTO users (username) VALUES ('user1'); 设置保存点 SAVEPOINT sp1; INSERT INTO users (username) VALUES ('user2'); 回滚到保存点（只撤销user2） ROLLBACK TO sp1; INSERT INTO users (username) VALUES ('user3'); COMMIT; 结果：插入了user1和user3 8.3.5 自动提交 查看自动提交状态 SHOW VARIABLES LIKE 'autocommit'; 关闭自动提交 SET autocommit = 0; 此时每个语句都需要手动COMMIT INSERT INTO users (username) VALUES ('test'); COMMIT; 开启自动提交（默认） SET autocommit = 1; 8.4 事务隔离级别 ⭐⭐⭐⭐⭐ 8.4.1 并发问题 1. 脏读（Dirty Read） 事务A读取了事务B未提交的数据，如果B回滚，A读到的就是脏数据。 时间线： 事务A 事务B START TRANSACTION; START TRANSACTION; UPDATE users SET age = 30 WHERE id = 1; SELECT age FROM users WHERE id = 1; 读到30（脏数据） ROLLBACK; B回滚了 A读到的30是无效的 2. 不可重复读（NonRepeatable Read） 事务A多次读取同一数据，结果不一致（因为事务B修改并提交了）。 时间线： 事务A 事务B START TRANSACTION; SELECT age FROM users WHERE id = 1; 读到25 START TRANSACTION; UPDATE users SET age = 30 WHERE id = 1; COMMIT; SELECT age FROM users WHERE id = 1; 读到30（不一致） COMMIT; 3. 幻读（Phantom Read） 事务A多次查询，结果集的行数不一致（因为事务B插入或删除了数据）。 时间线： 事务A 事务B START TRANSACTION; SELECT COUNT() FROM users WHERE age &gt; 20; 返回10行 START TRANSACTION; INSERT INTO users (age) VALUES (25); COMMIT; SELECT COUNT() FROM users WHERE age &gt; 20; 返回11行（幻读） COMMIT; 8.4.2 四种隔离级别 隔离级别 脏读 不可重复读 幻读 说明 READ UNCOMMITTED ✅ 可能 ✅ 可能 ✅ 可能 最低级别，性能最好 READ COMMITTED ❌ 不可能 ✅ 可能 ✅ 可能 Oracle默认 REPEATABLE READ ❌ 不可能 ❌ 不可能 ✅ 可能 MySQL默认 ⭐ SERIALIZABLE ❌ 不可能 ❌ 不可能 ❌ 不可能 最高级别，性能最差 8.4.3 查看和设置隔离级别 查看全局隔离级别 SELECT @@global.transactionisolation; 查看当前会话隔离级别 SELECT @@transactionisolation; 或 SHOW VARIABLES LIKE 'transactionisolation'; 设置全局隔离级别 SET GLOBAL transactionisolation = 'READCOMMITTED'; 设置当前会话隔离级别 SET SESSION transactionisolation = 'READCOMMITTED'; 设置下一个事务的隔离级别 SET TRANSACTION ISOLATION LEVEL READ COMMITTED; 8.4.4 隔离级别详解 1. READ UNCOMMITTED（读未提交） 特点： 可以读取未提交的数据（脏读） 演示脏读： 终端1（事务A） SET SESSION transactionisolation = 'READUNCOMMITTED'; START TRANSACTION; SELECT balance FROM accounts WHERE userid = 1; 1000 终端2（事务B） START TRANSACTION; UPDATE accounts SET balance = 500 WHERE userid = 1; 注意：没有COMMIT 终端1（事务A） SELECT balance FROM accounts WHERE userid = 1; 500（脏读！） 终端2（事务B） ROLLBACK; 回滚 终端1（事务A） SELECT balance FROM accounts WHERE userid = 1; 1000（之前读到的500是脏数据） 使用场景： 几乎不使用 2. READ COMMITTED（读已提交） 特点： 只能读取已提交的数据，避免脏读 演示不可重复读： 终端1（事务A） SET SESSION transactionisolation = 'READCOMMITTED'; START TRANSACTION; SELECT balance FROM accounts WHERE userid = 1; 1000 终端2（事务B） START TRANSACTION; UPDATE accounts SET balance = 500 WHERE userid = 1; COMMIT; 提交 终端1（事务A） SELECT balance FROM accounts WHERE userid = 1; 500（不可重复读） COMMIT; 使用场景： Oracle、PostgreSQL默认级别 3. REPEATABLE READ（可重复"
  },
  {
    "title": "第09章：锁机制 ⭐⭐⭐⭐⭐",
    "url": "/mysql/02/09.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "02",
    "excerpt": "第09章：锁机制 ⭐⭐⭐⭐⭐ 锁是数据库并发控制的核心机制，理解锁机制是成为MySQL专家的必备技能 9.1 锁概述 9.1.1 为什么需要锁 问题： 多个事务同时修改同一数据，会导致数据不一致。 示例： 初始：stock = 10 事务A 事务B SELECT stock FROM products WHERE id=1; 10 SELECT stock ...",
    "content": "第09章：锁机制 ⭐⭐⭐⭐⭐ 锁是数据库并发控制的核心机制，理解锁机制是成为MySQL专家的必备技能 9.1 锁概述 9.1.1 为什么需要锁 问题： 多个事务同时修改同一数据，会导致数据不一致。 示例： 初始：stock = 10 事务A 事务B SELECT stock FROM products WHERE id=1; 10 SELECT stock FROM products WHERE id=1; 10 UPDATE products SET stock=9 WHERE id=1; UPDATE products SET stock=9 WHERE id=1; 结果：stock=9（错误！应该是8） 解决方案： 使用锁机制，保证同一时间只有一个事务能修改数据。 9.1.2 锁的分类 按锁的粒度分类： 表锁（Table Lock） ：锁定整张表 行锁（Row Lock） ：锁定某一行 页锁（Page Lock） ：锁定一页数据（BDB引擎） 按锁的类型分类： 共享锁（S锁，Shared Lock） ：读锁，多个事务可以同时持有 排他锁（X锁，Exclusive Lock） ：写锁，只有一个事务可以持有 按锁的模式分类： 乐观锁 ：不真正加锁，通过版本号控制 悲观锁 ：真正加锁，阻塞其他事务 InnoDB特有的锁： 意向锁（Intention Lock） ：表级锁，辅助行锁 记录锁（Record Lock） ：锁定单个行记录 间隙锁（Gap Lock） ：锁定索引记录之间的间隙 临键锁（NextKey Lock） ：记录锁 + 间隙锁 9.2 表锁 9.2.1 表锁概述 特点： 锁定整张表 开销小，加锁快 不会出现死锁 锁粒度大，并发度低 MyISAM默认使用表锁 9.2.2 表锁的使用 加锁： 加读锁（共享锁） LOCK TABLES users READ; 加写锁（排他锁） LOCK TABLES users WRITE; 同时锁定多个表 LOCK TABLES users READ, orders WRITE; 释放锁： 释放所有表锁 UNLOCK TABLES; 演示： 终端1 LOCK TABLES users READ; SELECT FROM users; 可以读 UPDATE users SET age = 30 WHERE id = 1; 报错：表被锁定 UNLOCK TABLES; 终端1 LOCK TABLES users WRITE; SELECT FROM users; 可以读 UPDATE users SET age = 30 WHERE id = 1; 可以写 终端2 SELECT FROM users; 阻塞，等待终端1释放锁 9.2.3 表锁兼容性 当前锁 请求读锁 请求写锁 无锁 ✅ 允许 ✅ 允许 读锁 ✅ 允许 ❌ 阻塞 写锁 ❌ 阻塞 ❌ 阻塞 9.2.4 查看表锁 查看表锁状态 SHOW OPEN TABLES WHERE Inuse &gt; 0; 查看表锁等待情况 SHOW STATUS LIKE 'Tablelocks%'; Tablelocksimmediate：立即获得锁的次数 Tablelockswaited：需要等待的次数 9.3 行锁 9.3.1 行锁概述 特点： 锁定单行或多行 开销大，加锁慢 可能出现死锁 锁粒度小，并发度高 InnoDB默认使用行锁 重要： 行锁是针对索引加的锁，如果没有索引，会升级为表锁！ 9.3.2 共享锁（S锁） 加锁方式： 方法1：SELECT ... LOCK IN SHARE MODE（MySQL 5.7） SELECT FROM users WHERE id = 1 LOCK IN SHARE MODE; 方法2：SELECT ... FOR SHARE（MySQL 8.0） SELECT FROM users WHERE id = 1 FOR SHARE; 特点： 允许其他事务读取（加S锁） 阻塞其他事务写入（加X锁） 演示： 终端1（事务A） START TRANSACTION; SELECT FROM users WHERE id = 1 LOCK IN SHARE MODE; 加S锁 终端2（事务B） START TRANSACTION; SELECT FROM users WHERE id = 1 LOCK IN SHARE MODE; 成功（S锁兼容） UPDATE users SET age = 30 WHERE id = 1; 阻塞（等待S锁释放） 终端1（事务A） COMMIT; 释放S锁 终端2（事务B） UPDATE执行成功 COMMIT; 9.3.3 排他锁（X锁） 加锁方式： 方法1：SELECT ... FOR UPDATE SELECT FROM users WHERE id = 1 FOR UPDATE; 方法2：UPDATE、DELETE、INSERT自动加X锁 UPDATE users SET age = 30 WHERE id = 1; DELETE FROM users WHERE id = 1; INSERT INTO users (name) VALUES ('test'); 特点： 阻塞其他事务读取（加S锁） 阻塞其他事务写入（加X锁） 演示： 终端1（事务A） START TRANSACTION; SELECT FROM users WHERE id = 1 FOR UPDATE; 加X锁 终端2（事务B） START TRANSACTION; SELECT FROM users WHERE id = 1; 成功（快照读，不加锁） SELECT FROM users WHERE id = 1 LOCK IN SHARE MODE; 阻塞（等待X锁释放） SELECT FROM users WHERE id = 1 FOR UPDATE; 阻塞（等待X锁释放） UPDATE users SET age = 30 WHERE id = 1; 阻塞（等待X锁释放） 终端1（事务A） COMMIT; 释放X锁 终端2（事务B） 所有阻塞的操作执行成功 COMMIT; 9.3.4 锁兼容性矩阵 S锁 X锁 S锁 ✅ 兼容 ❌ 冲突 X锁 ❌ 冲突 ❌ 冲突 9.4 意向锁 9.4.1 意向锁概述 问题： 如果要加表锁，需要检查是否有行锁，效率低。 解决方案： 意向锁（表级锁），表示事务想要在表的某些行上加锁。 类型： 意向共享锁（IS锁） ：表示事务想要在某些行上加S锁 意向排他锁（IX锁） ：表示事务想要在某些行上加X锁 9.4.2 意向锁的作用 自动加锁： 加行级S锁时，自动加表级IS锁 SELECT FROM users WHERE id = 1 LOCK IN SHARE MODE; 加行级X锁时，自动加表级IX锁 SELECT FROM users WHERE id = 1 FOR UPDATE; 兼容性矩阵： IS IX S X IS ✅ ✅ ✅ ❌ IX ✅ ✅ ❌ ❌ S ✅ ❌ ✅ ❌ X ❌ ❌ ❌ ❌ 作用： 快速判断表是否有行锁 提高加表锁的效率 9.5 记录锁、间隙锁、临键锁 ⭐⭐⭐⭐⭐ 9.5.1 记录锁（Record Lock） 定义： 锁定单个索引记录。 示例： 锁定id=1的记录 SELECT FROM users WHERE id = 1 FOR UPDATE; 特点： 只锁定匹配的索引记录 不锁定间隙 9.5.2 间隙锁（Gap Lock） 定义： 锁定索引记录之间的间隙，防止其他事务插入数据。 作用： 解决幻读问题。 示例： 假设表中有id: 1, 5, 10 锁定(5, 10)之间的间隙 SELECT FROM users WHERE id &gt; 5 AND id &lt; 10 FOR UPDATE; 此时其他事务无法插入id=6, 7, 8, 9的记录 INSERT INTO users (id, name) VALUES (7, 'test'); 阻塞 间隙锁的范围： 假设表中有id: 1, 5, 10, 15 查询id=7（不存在） SELECT FROM users WHERE id = 7 FOR UPDATE; 锁定间隙：(5, 10) 查询id&gt;5 SELECT FROM users WHERE id &gt; 5 FOR UPDATE; 锁定间隙：(5, 10), (10, 15), (15, +∞) 查询id&lt;10 SELECT FROM users WHERE id &lt; 10 FOR UPDATE; 锁定间隙：(∞, 1), (1, 5), (5, 10) 9.5.3 临键锁（NextKey Lock） 定义： 记录锁 + 间隙锁，锁定索引记录及其前面的间隙。 格式： (左开右闭区间] 示例： 假设表中有id: 1, 5, 10, 15 查询id=5 SELECT FROM users WHERE id = 5 FOR UPDATE; 临键锁：(1, 5] 包含：间隙锁(1, 5) + 记录锁[5] 查询id&gt;=5 AND id&lt;15 SELECT FROM users WHERE id &gt;= 5 AND id &lt; 15 FOR UPDATE; 临键锁：(1, 5], (5, 10], (10, 15) InnoDB默认使用NextKey Lock（REPEATABLE READ） 9.5.4 锁定范围"
  },
  {
    "title": "第10章：MySQL架构与执行流程",
    "url": "/mysql/02/10-mysql.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "02",
    "excerpt": "第10章：MySQL架构与执行流程 深入理解MySQL的整体架构和SQL执行流程，是成为MySQL专家的必经之路 10.1 MySQL整体架构 ⭐⭐⭐⭐⭐ 10.1.1 MySQL架构分层 ┌─────────────────────────────────────────┐ │ 客户端（Client） │ │ MySQL Workbench、Navicat...",
    "content": "第10章：MySQL架构与执行流程 深入理解MySQL的整体架构和SQL执行流程，是成为MySQL专家的必经之路 10.1 MySQL整体架构 ⭐⭐⭐⭐⭐ 10.1.1 MySQL架构分层 ┌─────────────────────────────────────────┐ │ 客户端（Client） │ │ MySQL Workbench、Navicat、应用程序 │ └─────────────────────────────────────────┘ ↓ ┌─────────────────────────────────────────┐ │ 连接层（Connection Layer） │ │ 连接处理、认证、安全 │ └─────────────────────────────────────────┘ ↓ ┌─────────────────────────────────────────┐ │ 服务层（SQL Layer） │ │ ┌──────────────────────────────────┐ │ │ │ 查询缓存（Query Cache） │ │ │ └──────────────────────────────────┘ │ │ ┌──────────────────────────────────┐ │ │ │ 解析器（Parser） │ │ │ └──────────────────────────────────┘ │ │ ┌──────────────────────────────────┐ │ │ │ 优化器（Optimizer） │ │ │ └──────────────────────────────────┘ │ │ ┌──────────────────────────────────┐ │ │ │ 执行器（Executor） │ │ │ └──────────────────────────────────┘ │ └─────────────────────────────────────────┘ ↓ ┌─────────────────────────────────────────┐ │ 存储引擎层（Storage Engine Layer） │ │ InnoDB、MyISAM、Memory等 │ └─────────────────────────────────────────┘ ↓ ┌─────────────────────────────────────────┐ │ 文件系统（File System） │ │ 数据文件、日志文件、配置文件 │ └─────────────────────────────────────────┘ 10.1.2 各层功能详解 1. 连接层（Connection Layer） 客户端连接处理 用户认证和权限验证 连接池管理 线程管理 2. 服务层（SQL Layer） 查询缓存（MySQL 5.7有，8.0移除） SQL解析和语法分析 SQL优化 SQL执行 3. 存储引擎层（Storage Engine Layer） 数据存储和读取 索引管理 事务管理 锁管理 4. 文件系统层 数据文件存储 日志文件存储 配置文件管理 10.2 连接器（Connector） 10.2.1 连接过程 1. 客户端发起连接 mysql h localhost u root p 2. 服务器验证用户名和密码 3. 验证成功后，查询用户权限 4. 建立连接，分配连接ID 查看当前连接 SHOW PROCESSLIST; 查看连接数 SHOW STATUS LIKE 'Threadsconnected'; SHOW STATUS LIKE 'Maxusedconnections'; 10.2.2 连接管理 查看最大连接数 SHOW VARIABLES LIKE 'maxconnections'; 设置最大连接数 SET GLOBAL maxconnections = 500; 查看连接超时时间 SHOW VARIABLES LIKE 'waittimeout'; SHOW VARIABLES LIKE 'interactivetimeout'; 设置连接超时时间（秒） SET GLOBAL waittimeout = 28800; 8小时 SET GLOBAL interactivetimeout = 28800; 10.2.3 连接池 MySQL没有内置连接池，需要应用层实现 常用连接池： Java: HikariCP、Druid、C3P0 Python: SQLAlchemy、PyMySQL PHP: PDO、MySQLi 连接池的好处： 1. 减少连接创建和销毁的开销 2. 控制并发连接数 3. 提高性能 10.3 查询缓存（Query Cache）⚠️ 10.3.1 查询缓存概述 ⚠️ 注意：MySQL 8.0已移除查询缓存 MySQL 5.7仍然支持，但不推荐使用 查询缓存的工作原理： 1. 客户端发送SQL 2. 服务器计算SQL的hash值 3. 查找缓存中是否有相同的hash 4. 如果有，直接返回缓存结果 5. 如果没有，执行SQL并缓存结果 查看查询缓存配置 SHOW VARIABLES LIKE 'querycache%'; 查看查询缓存状态 SHOW STATUS LIKE 'Qcache%'; 10.3.2 查询缓存的问题 问题1：缓存失效频繁 表数据发生任何变化，该表的所有缓存都会失效 UPDATE users SET age = 26 WHERE id = 1; 所有users表的缓存失效 问题2：SQL必须完全相同 以下两个SQL不会命中同一个缓存 SELECT FROM users WHERE id = 1; SELECT FROM users WHERE id=1; 空格不同 问题3：性能问题 缓存的维护成本高于收益 建议： ✅ MySQL 5.7：关闭查询缓存 ✅ MySQL 8.0：已移除 ✅ 使用Redis等外部缓存 10.3.3 关闭查询缓存 my.cnf配置文件 [mysqld] querycachetype = 0 querycachesize = 0 10.4 解析器（Parser）⭐⭐⭐⭐ 10.4.1 词法分析 SQL: SELECT id, username FROM users WHERE id = 1; 词法分析：将SQL分解为token SELECT &gt; 关键字 id &gt; 标识符 , &gt; 分隔符 username&gt; 标识符 FROM &gt; 关键字 users &gt; 标识符 WHERE &gt; 关键字 id &gt; 标识符 = &gt; 运算符 1 &gt; 数字 ; &gt; 结束符 10.4.2 语法分析 语法分析：检查SQL语法是否正确 构建语法树（Parse Tree） ✅ 正确的SQL SELECT id, username FROM users WHERE id = 1; ❌ 语法错误 SELECT id, username users WHERE id = 1; 缺少FROM ERROR 1064: You have an error in your SQL syntax ❌ 语法错误 SELECT id, username FROM WHERE id = 1; 缺少表名 ERROR 1064: You have an error in your SQL syntax 10.4.3 语义分析 语义分析：检查SQL是否有意义 ❌ 表不存在 SELECT FROM nonexisttable; ERROR 1146: Table 'database.nonexisttable' doesn't exist ❌ 列不存在 SELECT nonexistcolumn FROM users; ERROR 1054: Unknown column 'nonexistcolumn' in 'field list' ❌ 权限不足 SELECT FROM mysql.user; ERROR 1142: SELECT command denied to user 10.5 优化器（Optimizer）⭐⭐⭐⭐⭐ 10.5.1 优化器的作用 优化器的任务： 1. 选择最优的执行计划 2. 选择使用哪个索引 3. 决定表的连接顺序 4. 优化子查询 5. 优化排序和分组 示例：多个索引选择 CREATE TABLE users ( id INT PRIMARY KEY, username VARCHAR(50), age INT, city VARCHAR(50), INDEX idxage (age), INDEX idxcity (city) ); SQL: SELECT FROM users WHERE age = 25 AND city = '北京'; 优化器需要决定： 1. 使用idxage索引？ 2. 使用idxcity索引？ 3. 使用全表扫描？ 10.5.2 查看执行计划 使用EXPLAIN查看优化器的选择 EXPLAIN SELECT FROM users WHERE age = 25 AND city = '北京'; 关键字段： type: 访问类型（ALL、index、range、ref、const等） key: 使用的索引 rows: 预计扫描的行数 Extra: "
  },
  {
    "title": "第11章：视图、存储过程与函数",
    "url": "/mysql/02/11.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "02",
    "excerpt": "第11章：视图、存储过程与函数 提高代码复用性和安全性的高级特性 11.1 视图（View）⭐⭐⭐⭐ 11.1.1 什么是视图？ 定义： 虚拟表，基于SQL查询结果 不存储数据，只存储查询语句 简化复杂查询，提高安全性 示例： 创建视图 CREATE VIEW vuserorders AS SELECT u.id AS userid, u.name AS u...",
    "content": "第11章：视图、存储过程与函数 提高代码复用性和安全性的高级特性 11.1 视图（View）⭐⭐⭐⭐ 11.1.1 什么是视图？ 定义： 虚拟表，基于SQL查询结果 不存储数据，只存储查询语句 简化复杂查询，提高安全性 示例： 创建视图 CREATE VIEW vuserorders AS SELECT u.id AS userid, u.name AS username, o.id AS orderid, o.amount, o.createtime FROM users u LEFT JOIN orders o ON u.id = o.userid; 使用视图 SELECT FROM vuserorders WHERE userid = 1; 11.1.2 视图操作 创建视图： 基本语法 CREATE VIEW viewname AS SELECT column1, column2, ... FROM tablename WHERE condition; 创建或替换视图 CREATE OR REPLACE VIEW vactiveusers AS SELECT id, name, email FROM users WHERE status = 'active'; 创建视图并指定列名 CREATE VIEW vuserinfo(userid, username, useremail) AS SELECT id, name, email FROM users; 查看视图： 查看所有视图 SHOW FULL TABLES WHERE Tabletype = 'VIEW'; 查看视图定义 SHOW CREATE VIEW vuserorders; 查看视图结构 DESC vuserorders; 修改视图： 方法1：CREATE OR REPLACE CREATE OR REPLACE VIEW vactiveusers AS SELECT id, name, email, phone FROM users WHERE status = 'active'; 方法2：ALTER VIEW ALTER VIEW vactiveusers AS SELECT id, name, email, phone, address FROM users WHERE status = 'active'; 删除视图： DROP VIEW IF EXISTS vuserorders; 11.1.3 可更新视图 可更新视图条件： 不包含聚合函数 不包含DISTINCT 不包含GROUP BY 不包含UNION 示例： 可更新视图 CREATE VIEW vusers AS SELECT id, name, email FROM users; 可以INSERT、UPDATE、DELETE INSERT INTO vusers(name, email) VALUES ('张三', 'test@example.com'); UPDATE vusers SET name = '李四' WHERE id = 1; DELETE FROM vusers WHERE id = 1; 不可更新视图（包含聚合函数） CREATE VIEW vusercount AS SELECT COUNT() AS total FROM users; 无法INSERT、UPDATE、DELETE 11.1.4 视图的优缺点 优点： ✅ 简化复杂查询 ✅ 提高安全性（隐藏敏感字段） ✅ 逻辑独立性（表结构变化，视图不变） 缺点： ❌ 性能可能较差 ❌ 不能创建索引 11.2 存储过程（Stored Procedure）⭐⭐⭐⭐ 11.2.1 什么是存储过程？ 定义： 一组预编译的SQL语句 存储在数据库中 可重复调用 优点： ✅ 减少网络传输 ✅ 提高性能（预编译） ✅ 代码复用 ✅ 安全性（权限控制） 11.2.2 创建存储过程 基本语法： DELIMITER $$ CREATE PROCEDURE procedurename( [IN|OUT|INOUT] parametername datatype, ... ) BEGIN SQL语句 END$$ DELIMITER ; 示例1：无参数存储过程 DELIMITER $$ CREATE PROCEDURE spgetusercount() BEGIN SELECT COUNT() AS total FROM users; END$$ DELIMITER ; 调用 CALL spgetusercount(); 示例2：IN参数（输入参数） DELIMITER $$ CREATE PROCEDURE spgetuserbyid( IN puserid INT ) BEGIN SELECT FROM users WHERE id = puserid; END$$ DELIMITER ; 调用 CALL spgetuserbyid(1); 示例3：OUT参数（输出参数） DELIMITER $$ CREATE PROCEDURE spgetusercountout( OUT pcount INT ) BEGIN SELECT COUNT() INTO pcount FROM users; END$$ DELIMITER ; 调用 CALL spgetusercountout(@count); SELECT @count; 示例4：INOUT参数（输入输出参数） DELIMITER $$ CREATE PROCEDURE spdoublevalue( INOUT pvalue INT ) BEGIN SET pvalue = pvalue 2; END$$ DELIMITER ; 调用 SET @value = 10; CALL spdoublevalue(@value); SELECT @value; 20 11.2.3 存储过程中的流程控制 IF语句： DELIMITER $$ CREATE PROCEDURE spcheckage( IN page INT, OUT presult VARCHAR(20) ) BEGIN IF page &lt; 18 THEN SET presult = '未成年'; ELSEIF page &lt; 60 THEN SET presult = '成年'; ELSE SET presult = '老年'; END IF; END$$ DELIMITER ; CASE语句： DELIMITER $$ CREATE PROCEDURE spgetgrade( IN pscore INT, OUT pgrade CHAR(1) ) BEGIN CASE WHEN pscore &gt;= 90 THEN SET pgrade = 'A'; WHEN pscore &gt;= 80 THEN SET pgrade = 'B'; WHEN pscore &gt;= 70 THEN SET pgrade = 'C'; WHEN pscore &gt;= 60 THEN SET pgrade = 'D'; ELSE SET pgrade = 'F'; END CASE; END$$ DELIMITER ; WHILE循环： DELIMITER $$ CREATE PROCEDURE spsum1ton( IN pn INT, OUT psum INT ) BEGIN DECLARE i INT DEFAULT 1; SET psum = 0; WHILE i &amp;lt;= pn DO SET psum = psum + i; SET i = i + 1; END WHILE; END$$ DELIMITER ; REPEAT循环： DELIMITER $$ CREATE PROCEDURE spsumrepeat( IN pn INT, OUT psum INT ) BEGIN DECLARE i INT DEFAULT 1; SET psum = 0; REPEAT SET psum = psum + i; SET i = i + 1; UNTIL i &amp;gt; pn END REPEAT; END$$ DELIMITER ; LOOP循环： DELIMITER $$ CREATE PROCEDURE spsumloop( IN pn INT, OUT psum INT ) BEGIN DECLARE i INT DEFAULT 1; SET psum = 0; looplabel: LOOP SET psum = psum + i; SET i = i + 1; IF i &amp;amp;gt; pn THEN LEAVE looplabel; END IF; END LOOP; END$$ DELIMITER ; 11.2.4 存储过程管理 查看存储过程： 查看所有存储过程 SHOW PROCEDURE STATUS WHERE Db = 'mydb'; 查看存储过程定义 SHOW CREATE PROCEDURE spgetuserbyid; 删除存储过程： DROP PROCEDURE IF EXISTS spgetuserbyid; 11.3 函数（Function）⭐⭐⭐⭐ 11.3.1 存储函数 vs 存储过程 特性 存储函数 存储过程 返回值 必须返回一个值 可以返回多个值（OUT参数） 调用方式 SE"
  },
  {
    "title": "第12章：触发器与事件",
    "url": "/mysql/03/12.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "03",
    "excerpt": "第12章：触发器与事件 自动化数据库操作的利器 12.1 触发器（Trigger）⭐⭐⭐⭐ 12.1.1 什么是触发器？ 定义： 在特定事件发生时自动执行的SQL语句 事件：INSERT、UPDATE、DELETE 时机：BEFORE、AFTER 语法： CREATE TRIGGER triggername {BEFORE | AFTER} {INSERT ...",
    "content": "第12章：触发器与事件 自动化数据库操作的利器 12.1 触发器（Trigger）⭐⭐⭐⭐ 12.1.1 什么是触发器？ 定义： 在特定事件发生时自动执行的SQL语句 事件：INSERT、UPDATE、DELETE 时机：BEFORE、AFTER 语法： CREATE TRIGGER triggername {BEFORE | AFTER} {INSERT | UPDATE | DELETE} ON tablename FOR EACH ROW BEGIN SQL语句 END; 12.1.2 触发器示例 BEFORE INSERT触发器： 自动设置创建时间 DELIMITER $$ CREATE TRIGGER trusersbeforeinsert BEFORE INSERT ON users FOR EACH ROW BEGIN SET NEW.createtime = NOW(); END$$ DELIMITER ; AFTER INSERT触发器： 插入用户后，记录日志 DELIMITER $$ CREATE TRIGGER trusersafterinsert AFTER INSERT ON users FOR EACH ROW BEGIN INSERT INTO userlogs(userid, action, createtime) VALUES ( NEW.id , 'INSERT', NOW()); END$$ DELIMITER ; BEFORE UPDATE触发器： 更新前记录旧值 DELIMITER $$ CREATE TRIGGER trusersbeforeupdate BEFORE UPDATE ON users FOR EACH ROW BEGIN SET NEW.updatetime = NOW(); INSERT INTO userhistory(userid, oldname, newname, updatetime) VALUES ( OLD.id , OLD.name , NEW.name , NOW()); END$$ DELIMITER ; AFTER DELETE触发器： 删除用户后，删除相关订单 DELIMITER $$ CREATE TRIGGER trusersafterdelete AFTER DELETE ON users FOR EACH ROW BEGIN DELETE FROM orders WHERE userid = OLD.id ; END$$ DELIMITER ; 12.1.3 NEW和OLD NEW： INSERT：新插入的行 UPDATE：更新后的行 DELETE：不可用 OLD： INSERT：不可用 UPDATE：更新前的行 DELETE：被删除的行 12.1.4 触发器管理 查看触发器： 查看所有触发器 SHOW TRIGGERS; 查看指定表的触发器 SHOW TRIGGERS WHERE Table = 'users'; 查看触发器定义 SHOW CREATE TRIGGER trusersbeforeinsert; 删除触发器： DROP TRIGGER IF EXISTS trusersbeforeinsert; 12.1.5 触发器注意事项 限制： ❌ 不能在触发器中调用存储过程返回结果集 ❌ 不能使用CALL语句 ❌ 不能使用事务控制语句（COMMIT、ROLLBACK） 性能影响： ⚠️ 触发器会影响INSERT、UPDATE、DELETE性能 ⚠️ 避免在触发器中执行复杂操作 12.2 事件（Event）⭐⭐⭐⭐ 12.2.1 什么是事件？ 定义： 定时任务，类似Linux的cron 在指定时间自动执行SQL语句 开启事件调度器： 查看事件调度器状态 SHOW VARIABLES LIKE 'eventscheduler'; 开启事件调度器 SET GLOBAL eventscheduler = ON; 配置文件中开启 [mysqld] eventscheduler = ON 12.2.2 创建事件 一次性事件： 在指定时间执行一次 CREATE EVENT evtdeleteoldlogs ON SCHEDULE AT '20241231 23:59:59' DO DELETE FROM logs WHERE createtime &lt; DATESUB(NOW(), INTERVAL 1 YEAR); 周期性事件： 每天凌晨1点执行 CREATE EVENT evtdailycleanup ON SCHEDULE EVERY 1 DAY STARTS '20240101 01:00:00' DO DELETE FROM logs WHERE createtime &lt; DATESUB(NOW(), INTERVAL 30 DAY); 每小时执行 CREATE EVENT evthourlytask ON SCHEDULE EVERY 1 HOUR DO UPDATE statistics SET updatetime = NOW(); 每5分钟执行 CREATE EVENT evt5mintask ON SCHEDULE EVERY 5 MINUTE DO CALL spupdatecache(); 带结束时间的事件： CREATE EVENT evttemptask ON SCHEDULE EVERY 1 DAY STARTS '20240101 00:00:00' ENDS '20241231 23:59:59' DO DELETE FROM tempdata WHERE createtime &lt; DATESUB(NOW(), INTERVAL 1 DAY); 12.2.3 事件管理 查看事件： 查看所有事件 SHOW EVENTS; 查看指定数据库的事件 SHOW EVENTS FROM mydb; 查看事件定义 SHOW CREATE EVENT evtdailycleanup; 修改事件： 禁用事件 ALTER EVENT evtdailycleanup DISABLE; 启用事件 ALTER EVENT evtdailycleanup ENABLE; 修改事件 ALTER EVENT evtdailycleanup ON SCHEDULE EVERY 2 DAY; 删除事件： DROP EVENT IF EXISTS evtdailycleanup; 12.2.4 事件实战案例 案例1：定期清理日志 CREATE EVENT evtcleanuplogs ON SCHEDULE EVERY 1 DAY STARTS '20240101 02:00:00' DO BEGIN 删除30天前的日志 DELETE FROM accesslogs WHERE createtime &lt; DATESUB(NOW(), INTERVAL 30 DAY); DELETE FROM errorlogs WHERE createtime &lt; DATESUB(NOW(), INTERVAL 30 DAY); 优化表 OPTIMIZE TABLE accesslogs; OPTIMIZE TABLE errorlogs; END; 案例2：定期备份数据 CREATE EVENT evtbackupdata ON SCHEDULE EVERY 1 DAY STARTS '20240101 03:00:00' DO BEGIN 备份到历史表 INSERT INTO ordershistory SELECT FROM orders WHERE createtime &lt; DATESUB(NOW(), INTERVAL 1 YEAR); 删除旧数据 DELETE FROM orders WHERE createtime &amp;lt; DATESUB(NOW(), INTERVAL 1 YEAR); END; 案例3：定期更新统计数据 CREATE EVENT evtupdatestatistics ON SCHEDULE EVERY 1 HOUR DO BEGIN 更新用户统计 UPDATE userstatistics us SET ordercount = (SELECT COUNT() FROM orders WHERE userid = us.userid), totalamount = (SELECT IFNULL(SUM(amount), 0) FROM orders WHERE userid = us.userid), updatetime = NOW(); END; 12.3 本章总结 本章学习内容： ✅ 触发器 （BEFORE/AFTER、INSERT/UPDATE/DELETE）⭐⭐⭐⭐ ✅ 事件 （一次性、周期性）⭐⭐⭐⭐ ✅ NEW和OLD ✅ 实战案例 重点掌握： 触发器：BEFORE/AFTER + INSERT/UPDATE/DELETE NEW：新数据，OLD：旧数据 事件：定时任务 eventscheduler = ON 触发器时机： BEFORE：在操作之前执行 AFTER：在操作之后执行 事件调度： AT：一次性 EVERY：周期性 面试重点： 触发器的作用 NEW和OLD的区别 事件和cron的区别 触发器的性能影响 下一章预告： 分区表 练习题 什么是触发器？ BEFORE和AFTER触发器有什"
  },
  {
    "title": "第13章：分区表",
    "url": "/mysql/03/13.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "03",
    "excerpt": "第13章：分区表 提高大表查询性能的利器 13.1 分区表概述 13.1.1 什么是分区表？ 定义： 将一个大表分成多个物理分区 逻辑上仍是一个表 提高查询性能和管理效率 优点： ✅ 提高查询性能（分区裁剪） ✅ 便于数据管理（删除旧分区） ✅ 提高并发性能 缺点： ❌ 增加复杂度 ❌ 某些查询可能变慢 13.2 分区类型 ⭐⭐⭐⭐ 13.2.1 RANGE...",
    "content": "第13章：分区表 提高大表查询性能的利器 13.1 分区表概述 13.1.1 什么是分区表？ 定义： 将一个大表分成多个物理分区 逻辑上仍是一个表 提高查询性能和管理效率 优点： ✅ 提高查询性能（分区裁剪） ✅ 便于数据管理（删除旧分区） ✅ 提高并发性能 缺点： ❌ 增加复杂度 ❌ 某些查询可能变慢 13.2 分区类型 ⭐⭐⭐⭐ 13.2.1 RANGE分区（范围分区） 按范围分区： 按年份分区 CREATE TABLE orders ( id INT NOT NULL, userid INT NOT NULL, amount DECIMAL(10,2), createtime DATE NOT NULL ) PARTITION BY RANGE (YEAR(createtime)) ( PARTITION p2021 VALUES LESS THAN (2022), PARTITION p2022 VALUES LESS THAN (2023), PARTITION p2023 VALUES LESS THAN (2024), PARTITION p2024 VALUES LESS THAN (2025), PARTITION pmax VALUES LESS THAN MAXVALUE ); 按ID范围分区 CREATE TABLE users ( id INT NOT NULL, name VARCHAR(100), age INT ) PARTITION BY RANGE (id) ( PARTITION p0 VALUES LESS THAN (1000000), PARTITION p1 VALUES LESS THAN (2000000), PARTITION p2 VALUES LESS THAN (3000000), PARTITION pmax VALUES LESS THAN MAXVALUE ); 13.2.2 LIST分区（列表分区） 按列表分区： 按地区分区 CREATE TABLE users ( id INT NOT NULL, name VARCHAR(100), province VARCHAR(50) ) PARTITION BY LIST COLUMNS(province) ( PARTITION pnorth VALUES IN ('北京', '天津', '河北'), PARTITION peast VALUES IN ('上海', '江苏', '浙江'), PARTITION psouth VALUES IN ('广东', '福建', '海南'), PARTITION pwest VALUES IN ('四川', '重庆', '云南') ); 13.2.3 HASH分区（哈希分区） 按哈希分区： 按用户ID哈希分区（4个分区） CREATE TABLE orders ( id INT NOT NULL, userid INT NOT NULL, amount DECIMAL(10,2), createtime DATETIME ) PARTITION BY HASH(userid) PARTITIONS 4; 数据分布： userid % 4 = 0 → p0 userid % 4 = 1 → p1 userid % 4 = 2 → p2 userid % 4 = 3 → p3 13.2.4 KEY分区 按KEY分区： 类似HASH分区，但使用MySQL内部哈希函数 CREATE TABLE orders ( id INT NOT NULL, userid INT NOT NULL, amount DECIMAL(10,2) ) PARTITION BY KEY(userid) PARTITIONS 4; 13.3 分区管理 13.3.1 查看分区 查看分区信息： 查看分区 SELECT PARTITIONNAME, PARTITIONEXPRESSION, PARTITIONDESCRIPTION, TABLEROWS FROM informationschema.PARTITIONS WHERE TABLESCHEMA = 'mydb' AND TABLENAME = 'orders'; 查看分区定义 SHOW CREATE TABLE orders; 13.3.2 添加分区 添加RANGE分区： 添加2025年分区 ALTER TABLE orders ADD PARTITION (PARTITION p2025 VALUES LESS THAN (2026)); 添加HASH分区： 增加分区数量（从4个增加到8个） ALTER TABLE orders ADD PARTITION PARTITIONS 4; 13.3.3 删除分区 删除分区： 删除2021年分区（数据也会被删除） ALTER TABLE orders DROP PARTITION p2021; 删除多个分区 ALTER TABLE orders DROP PARTITION p2021, p2022; 13.3.4 合并分区 合并分区： 合并p0和p1为p01 ALTER TABLE orders REORGANIZE PARTITION p0, p1 INTO ( PARTITION p01 VALUES LESS THAN (2000000) ); 13.3.5 拆分分区 拆分分区： 拆分pmax为p2025和新的pmax ALTER TABLE orders REORGANIZE PARTITION pmax INTO ( PARTITION p2025 VALUES LESS THAN (2026), PARTITION pmax VALUES LESS THAN MAXVALUE ); 13.4 分区裁剪 什么是分区裁剪？ 查询时只扫描相关分区 提高查询性能 示例： 查询2023年的订单 SELECT FROM orders WHERE createtime &gt;= '20230101' AND createtime &lt; '20240101'; 只扫描p2023分区 EXPLAIN PARTITIONS SELECT FROM orders WHERE createtime &gt;= '20230101' AND createtime &lt; '20240101'; 输出： partitions: p2023 13.5 分区表最佳实践 13.5.1 何时使用分区表 适用场景： ✅ 表非常大（&gt;1000万行） ✅ 按时间查询（日志表、订单表） ✅ 需要定期删除旧数据 ✅ 数据有明显的分区特征 不适用场景： ❌ 表不大（&lt;1000万行） ❌ 查询不涉及分区键 ❌ 需要频繁跨分区查询 13.5.2 分区键选择 原则： 选择查询中常用的字段 数据分布均匀 便于管理 示例： ✅ 好的分区键：createtime（按时间查询多） PARTITION BY RANGE (YEAR(createtime)) ❌ 不好的分区键：status（数据分布不均） PARTITION BY LIST (status) 13.5.3 注意事项 限制： 分区键必须是主键或唯一索引的一部分 最多1024个分区 不支持外键 不支持全文索引 示例： ❌ 错误：分区键不是主键的一部分 CREATE TABLE orders ( id INT PRIMARY KEY, createtime DATE ) PARTITION BY RANGE (YEAR(createtime)) (...); ✅ 正确：分区键是主键的一部分 CREATE TABLE orders ( id INT, createtime DATE, PRIMARY KEY (id, createtime) ) PARTITION BY RANGE (YEAR(createtime)) (...); 13.6 分区表实战案例 案例：日志表分区 创建日志表（按月分区） CREATE TABLE accesslogs ( id BIGINT NOT NULL AUTOINCREMENT, userid INT, url VARCHAR(500), ip VARCHAR(50), createtime DATETIME NOT NULL, PRIMARY KEY (id, createtime) ) PARTITION BY RANGE (TODAYS(createtime)) ( PARTITION p202401 VALUES LESS THAN (TODAYS('20240201')), PARTITION p202402 VALUES LESS THAN (TODAYS('20240301')), PARTITION p202403 VALUES LESS THAN (TODAYS('20240401')), PARTITION pmax VALUES LESS THAN MAXVALUE ); 每月添加新分区 ALTER TABLE accesslogs REORGANIZE PARTITION pmax INTO ( PARTITION p202404 VALUES LESS THAN (TODAYS('20240501')), PARTITION pmax VALUES LESS THAN MAXVALUE ); 删除旧分区（删除3个月前的数据） ALTER"
  },
  {
    "title": "第14章：字符集与排序规则",
    "url": "/mysql/03/14.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "03",
    "excerpt": "第14章：字符集与排序规则 正确处理中文和emoji的关键 14.1 字符集概述 14.1.1 什么是字符集？ 定义： 字符集（Character Set）：字符的编码方式 排序规则（Collation）：字符的比较规则 常用字符集： latin1 ：西欧字符（MySQL默认，已过时） gbk ：简体中文 utf8 ：UTF8编码（最多3字节，不支持emoj...",
    "content": "第14章：字符集与排序规则 正确处理中文和emoji的关键 14.1 字符集概述 14.1.1 什么是字符集？ 定义： 字符集（Character Set）：字符的编码方式 排序规则（Collation）：字符的比较规则 常用字符集： latin1 ：西欧字符（MySQL默认，已过时） gbk ：简体中文 utf8 ：UTF8编码（最多3字节，不支持emoji）⚠️ utf8mb4 ：UTF8编码（最多4字节，支持emoji）✅ 推荐 14.2 字符集详解 ⭐⭐⭐⭐⭐ 14.2.1 utf8 vs utf8mb4 重要区别： utf8：最多3字节，不支持emoji utf8mb4：最多4字节，支持emoji ❌ utf8无法存储emoji CREATE TABLE testutf8 ( content VARCHAR(100) CHARACTER SET utf8 ); INSERT INTO testutf8 VALUES ('😀'); 报错 ✅ utf8mb4可以存储emoji CREATE TABLE testutf8mb4 ( content VARCHAR(100) CHARACTER SET utf8mb4 ); INSERT INTO testutf8mb4 VALUES ('😀'); 成功 推荐： ✅ 统一使用utf8mb4 ❌ 不要使用utf8 14.2.2 查看字符集 查看系统字符集： 查看所有字符集 SHOW CHARACTER SET; 查看字符集变量 SHOW VARIABLES LIKE 'character%'; 输出： charactersetclient: utf8mb4 客户端字符集 charactersetconnection: utf8mb4 连接字符集 charactersetdatabase: utf8mb4 数据库字符集 charactersetresults: utf8mb4 结果字符集 charactersetserver: utf8mb4 服务器字符集 charactersetsystem: utf8 系统字符集（固定） 查看表字符集： 查看表字符集 SHOW CREATE TABLE users; 查看列字符集 SHOW FULL COLUMNS FROM users; 14.2.3 设置字符集 服务器级别： my.cnf [mysqld] charactersetserver = utf8mb4 collationserver = utf8mb4unicodeci [client] defaultcharacterset = utf8mb4 数据库级别： 创建数据库时指定 CREATE DATABASE mydb CHARACTER SET utf8mb4 COLLATE utf8mb4unicodeci; 修改数据库字符集 ALTER DATABASE mydb CHARACTER SET utf8mb4 COLLATE utf8mb4unicodeci; 表级别： 创建表时指定 CREATE TABLE users ( id INT PRIMARY KEY, name VARCHAR(100) ) CHARACTER SET utf8mb4 COLLATE utf8mb4unicodeci; 修改表字符集 ALTER TABLE users CHARACTER SET utf8mb4 COLLATE utf8mb4unicodeci; 列级别： 创建列时指定 CREATE TABLE users ( id INT PRIMARY KEY, name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4unicodeci ); 修改列字符集 ALTER TABLE users MODIFY COLUMN name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4unicodeci; 14.3 排序规则（Collation）⭐⭐⭐⭐ 14.3.1 常用排序规则 utf8mb4排序规则： utf8mb4generalci ：通用，不区分大小写，性能好 utf8mb4unicodeci ：Unicode标准，区分重音，性能稍差 ✅ 推荐 utf8mb4bin ：二进制，区分大小写 示例： utf8mb4generalci：不区分大小写 SELECT 'A' = 'a' COLLATE utf8mb4generalci; 1（相等） utf8mb4bin：区分大小写 SELECT 'A' = 'a' COLLATE utf8mb4bin; 0（不相等） 14.3.2 排序规则对比 示例： 创建测试表 CREATE TABLE testcollation ( name VARCHAR(100) ) CHARACTER SET utf8mb4; INSERT INTO testcollation VALUES ('A'), ('a'), ('B'), ('b'); utf8mb4generalci：不区分大小写 SELECT FROM testcollation ORDER BY name COLLATE utf8mb4generalci; 结果：A, a, B, b 或 a, A, b, B utf8mb4bin：区分大小写 SELECT FROM testcollation ORDER BY name COLLATE utf8mb4bin; 结果：A, B, a, b（ASCII码顺序） 14.3.3 查看排序规则 查看所有排序规则： 查看utf8mb4的排序规则 SHOW COLLATION WHERE Charset = 'utf8mb4'; 查看排序规则变量 SHOW VARIABLES LIKE 'collation%'; 14.4 字符集转换 14.4.1 转换表字符集 方法1：ALTER TABLE（推荐） 转换表和所有列的字符集 ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4unicodeci; 方法2：分步转换 1. 修改表默认字符集 ALTER TABLE users CHARACTER SET utf8mb4 COLLATE utf8mb4unicodeci; 2. 修改每列字符集 ALTER TABLE users MODIFY COLUMN name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4unicodeci; 14.4.2 转换数据库字符集 步骤： 1. 备份数据 mysqldump u root p defaultcharacterset=utf8mb4 mydb &gt; backup.sql 2. 修改数据库字符集 ALTER DATABASE mydb CHARACTER SET utf8mb4 COLLATE utf8mb4unicodeci; 3. 转换所有表 SELECT CONCAT('ALTER TABLE ', tablename, ' CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4unicodeci;') FROM informationschema.TABLES WHERE TABLESCHEMA = 'mydb'; 执行生成的SQL 14.5 字符集最佳实践 14.5.1 推荐配置 my.cnf配置： [mysqld] charactersetserver = utf8mb4 collationserver = utf8mb4unicodeci initconnect = 'SET NAMES utf8mb4' [client] defaultcharacterset = utf8mb4 [mysql] defaultcharacterset = utf8mb4 应用程序连接： 连接后设置字符集 SET NAMES utf8mb4; 或在连接字符串中指定 jdbc:mysql://localhost:3306/mydb?characterEncoding=utf8mb4 14.5.2 常见问题 问题1：中文乱码 原因：字符集不一致 解决：统一使用utf8mb4 检查字符集 SHOW VARIABLES LIKE 'character%'; 设置字符集 SET NAMES utf8mb4; 问题2：emoji无法存储 原因：使用utf8而不是utf8mb4 解决：转换为utf8mb4 ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4unicodeci; 问题3：索引长度超限 错误：Specified key was too long; max key length is 767 bytes 原因：utf8mb4每字符4字节，VARCHAR(255)需要1020字节 解决方案1：减少长度 CREATE TABLE users ( email VARCHAR(191) PRIMARY KEY 1914=764字节 ) CHARACTER SET utf8mb4; 解决方案2：使用前缀索引 CREATE TABLE users ( email VARCHAR(255), INDE"
  },
  {
    "title": "第15章：MySQL日志系统 ⭐⭐⭐",
    "url": "/mysql/04/15-mysql.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "04",
    "excerpt": "第15章：MySQL日志系统 ⭐⭐⭐ 本章是MySQL专家必须精通的核心内容，尤其是binlog机制 15.1 MySQL日志系统概述 MySQL有多种日志类型，每种日志都有其特定的用途： 日志类型 作用 重要程度 binlog（二进制日志） 记录所有DDL和DML语句，用于复制和恢复 ⭐⭐⭐⭐⭐ redo log（重做日志） InnoDB引擎特有，保证事务...",
    "content": "第15章：MySQL日志系统 ⭐⭐⭐ 本章是MySQL专家必须精通的核心内容，尤其是binlog机制 15.1 MySQL日志系统概述 MySQL有多种日志类型，每种日志都有其特定的用途： 日志类型 作用 重要程度 binlog（二进制日志） 记录所有DDL和DML语句，用于复制和恢复 ⭐⭐⭐⭐⭐ redo log（重做日志） InnoDB引擎特有，保证事务持久性 ⭐⭐⭐⭐⭐ undo log（回滚日志） 保证事务原子性，实现MVCC ⭐⭐⭐⭐⭐ slow query log（慢查询日志） 记录慢查询，用于性能优化 ⭐⭐⭐⭐ error log（错误日志） 记录MySQL启动、运行、停止时的错误信息 ⭐⭐⭐⭐ general log（通用查询日志） 记录所有SQL语句 ⭐⭐ relay log（中继日志） 主从复制时，从库使用 ⭐⭐⭐⭐ 15.2 binlog（二进制日志）详解 ⭐⭐⭐⭐⭐ 15.2.1 binlog的作用 binlog是MySQL最重要的日志之一，主要用途： 主从复制 ：主库的binlog传输到从库进行重放，实现数据同步 数据恢复 ：通过binlog进行时间点恢复（PointInTime Recovery） 数据审计 ：记录所有数据变更操作 15.2.2 binlog vs redo log 这是面试高频问题，必须理解： 特性 binlog redo log 层级 MySQL Server层，所有引擎都可用 InnoDB引擎层 内容 逻辑日志，记录SQL语句或行变更 物理日志，记录数据页的修改 写入方式 追加写入，不会覆盖 循环写入，空间固定 用途 复制、恢复 崩溃恢复 格式 ROW/STATEMENT/MIXED 固定格式 两阶段提交： 为了保证binlog和redo log的一致性，MySQL使用两阶段提交： 1. prepare阶段：写入redo log，状态为prepare 2. commit阶段：写入binlog，然后提交redo log 15.2.3 binlog的三种格式 1. STATEMENT格式（语句模式） 特点： 记录执行的SQL语句 日志量小 可能导致主从数据不一致 示例： UPDATE users SET logincount = logincount + 1 WHERE id = 100; binlog记录： UPDATE users SET logincount = logincount + 1 WHERE id = 100 问题场景： 主库执行 DELETE FROM users WHERE createtime &lt; NOW() LIMIT 10; 如果主从库的数据顺序不同，删除的数据可能不一样 使用UUID()、RAND()等函数也会导致不一致 2. ROW格式（行模式）⭐ 推荐 特点： 记录每一行数据的变化 日志量大 数据一致性最好 MySQL 5.7默认格式 示例： UPDATE users SET logincount = logincount + 1 WHERE id = 100; binlog记录（简化）： UPDATE test.users WHERE @1=100 / id / @2=5 / logincount / SET @1=100 / id / @2=6 / logincount / 优点： 任何情况下都能保证主从一致 可以精确恢复每一行数据 适合数据审计 缺点： 批量操作时日志量大 例如： UPDATE users SET status=1 更新100万行，会记录100万行的变化 3. MIXED格式（混合模式） 特点： 默认使用STATEMENT格式 遇到可能导致不一致的语句时，自动切换到ROW格式 平衡了日志大小和一致性 自动切换到ROW的场景： 使用UUID()、USER()、CURRENTUSER()等函数 使用AUTOINCREMENT列 使用LIMIT且没有ORDER BY 使用触发器或存储过程 15.2.4 binlog的配置 开启binlog 配置文件（my.cnf/my.ini）： [mysqld] 开启binlog（必须） logbin=mysqlbin binlog格式（推荐ROW） binlogformat=ROW 每个binlog文件的最大大小（默认1G） maxbinlogsize=1G binlog过期时间（天），0表示不自动删除 expirelogsdays=7 MySQL 8.0使用这个参数（秒） binlogexpirelogsseconds=604800 同步binlog到磁盘的策略 0: 由操作系统决定何时刷新（性能最好，安全性最差） 1: 每次事务提交都刷新（最安全，性能较差）⭐ 推荐 N: 每N个事务刷新一次 syncbinlog=1 binlog缓存大小 binlogcachesize=4M 单个事务的binlog缓存大小 maxbinlogcachesize=512M 指定哪些数据库记录binlog（可选） binlogdodb=mydb 指定哪些数据库不记录binlog（可选） binlogignoredb=test serverid（主从复制必须，每个MySQL实例唯一） serverid=1 重启MySQL使配置生效： sudo systemctl restart mysqld 查看binlog配置 查看binlog是否开启 SHOW VARIABLES LIKE 'logbin'; 查看binlog格式 SHOW VARIABLES LIKE 'binlogformat'; 查看所有binlog相关配置 SHOW VARIABLES LIKE 'binlog%'; 查看syncbinlog配置 SHOW VARIABLES LIKE 'syncbinlog'; 15.2.5 binlog的管理 查看binlog文件 查看所有binlog文件 SHOW BINARY LOGS; 或 SHOW MASTER LOGS; 输出示例： +++ | Logname | Filesize | +++ | mysqlbin.000001 | 177 | | mysqlbin.000002 | 1547 | | mysqlbin.000003 | 154 | +++ 查看当前正在写入的binlog SHOW MASTER STATUS; 输出示例： +++++ | File | Position | BinlogDoDB | BinlogIgnoreDB | +++++ | mysqlbin.000003 | 154 | | | +++++ 查看binlog内容 使用mysqlbinlog工具： 查看binlog内容（基本格式） mysqlbinlog mysqlbin.000001 查看binlog内容（详细格式，ROW格式必须加v） mysqlbinlog v mysqlbin.000001 查看binlog内容（超详细格式） mysqlbinlog vv mysqlbin.000001 指定开始位置 mysqlbinlog startposition=154 mysqlbin.000001 指定结束位置 mysqlbinlog stopposition=500 mysqlbin.000001 指定时间范围 mysqlbinlog startdatetime=&quot;20240101 00:00:00&quot; stopdatetime=&quot;20240101 23:59:59&quot; mysqlbin.000001 输出到文件 mysqlbinlog mysqlbin.000001 &gt; binlog.sql 查看多个binlog文件 mysqlbinlog mysqlbin.000001 mysqlbin.000002 &gt; allbinlog.sql 只查看指定数据库的binlog mysqlbinlog database=mydb mysqlbin.000001 解析ROW格式的binlog（必须加v或vv） mysqlbinlog vv base64output=DECODEROWS mysqlbin.000001 binlog内容示例： STATEMENT格式： at 123 241101 10:30:45 server id 1 endlogpos 250 Query threadid=5 SET TIMESTAMP=1698825045/!/; UPDATE users SET logincount = logincount + 1 WHERE id = 100 /!/; ROW格式（需要v参数）： at 123 241101 10:30:45 server id 1 endlogpos 250 Updaterows: table id 108 flags: STMTENDF UPDATE test.users WHERE @1=100 / INT meta=0 nullable=0 isnull=0 / @2='张三' / VARSTRING(200) meta=200 nullable=1 isnull=0 / @3=5 / INT meta=0 nullable=1 isnull=0 / SET @1=100 @2='张三' @3=6 删除binlog 删除指定binlog之前的所有binlog PURGE BINARY LOGS TO 'mysqlbin.000003'; 删除"
  },
  {
    "title": "第16章：备份策略与实践",
    "url": "/mysql/04/16.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "04",
    "excerpt": "第16章：备份策略与实践 数据备份是DBA最重要的工作之一，没有备份就没有安全感 16.1 备份的重要性 ⭐⭐⭐⭐⭐ 16.1.1 为什么需要备份？ 常见的数据丢失场景： ❌ 硬件故障（磁盘损坏、服务器宕机） ❌ 人为误操作（误删数据、DROP TABLE） ❌ 软件Bug（应用程序错误） ❌ 恶意攻击（SQL注入、勒索病毒） ❌ 自然灾害（火灾、地震、水灾...",
    "content": "第16章：备份策略与实践 数据备份是DBA最重要的工作之一，没有备份就没有安全感 16.1 备份的重要性 ⭐⭐⭐⭐⭐ 16.1.1 为什么需要备份？ 常见的数据丢失场景： ❌ 硬件故障（磁盘损坏、服务器宕机） ❌ 人为误操作（误删数据、DROP TABLE） ❌ 软件Bug（应用程序错误） ❌ 恶意攻击（SQL注入、勒索病毒） ❌ 自然灾害（火灾、地震、水灾） 备份的作用： ✅ 数据恢复（最重要） ✅ 数据迁移 ✅ 搭建从库 ✅ 数据分析 ✅ 合规要求 血泪教训： 没有备份 = 没有工作 没有测试的备份 = 没有备份 16.2 备份类型 16.2.1 逻辑备份 vs 物理备份 对比项 逻辑备份 物理备份 备份内容 SQL语句 数据文件 备份工具 mysqldump、mysqlpump XtraBackup、LVM快照 备份速度 慢 快 恢复速度 慢 快 跨平台 ✅ 支持 ❌ 不支持 跨版本 ✅ 支持 ⚠️ 有限制 占用空间 小（可压缩） 大 适用场景 小数据库、跨平台 大数据库、快速恢复 16.2.2 全量备份 vs 增量备份 全量备份（Full Backup）： 备份所有数据 恢复简单 占用空间大 备份时间长 增量备份（Incremental Backup）： 只备份变化的数据 节省空间 恢复复杂（需要全量+所有增量） 备份时间短 差异备份（Differential Backup）： 备份自上次全量备份后的所有变化 介于全量和增量之间 恢复需要全量+最后一次差异 16.2.3 热备份 vs 冷备份 热备份（Hot Backup）： 数据库在线备份 不影响业务 推荐使用 温备份（Warm Backup）： 备份时只能读，不能写 影响部分业务 冷备份（Cold Backup）： 停止数据库备份 影响业务 不推荐 16.3 mysqldump逻辑备份 ⭐⭐⭐⭐⭐ 16.3.1 mysqldump基本用法 备份单个数据库 mysqldump u root p databasename &gt; backup.sql 备份多个数据库 mysqldump u root p databases db1 db2 db3 &gt; backup.sql 备份所有数据库 mysqldump u root p alldatabases &gt; allbackup.sql 备份单个表 mysqldump u root p databasename tablename &gt; tablebackup.sql 备份多个表 mysqldump u root p databasename table1 table2 &gt; tablesbackup.sql 16.3.2 mysqldump重要参数 完整的备份命令（推荐） mysqldump u root p \\ singletransaction \\ InnoDB一致性备份（不锁表） masterdata=2 \\ 记录binlog位置（注释形式） flushlogs \\ 刷新binlog routines \\ 备份存储过程和函数 triggers \\ 备份触发器 events \\ 备份事件 hexblob \\ 二进制数据使用十六进制 defaultcharacterset=utf8mb4 \\ 字符集 databasename &gt; backup.sql 参数说明： singletransaction： 适用于InnoDB 保证备份的一致性 不锁表，不影响业务 ⭐ 强烈推荐 masterdata=2： 记录备份时的binlog位置 =1：直接写入CHANGE MASTER语句 =2：以注释形式写入（推荐） 用于搭建主从复制 flushlogs： 备份前刷新binlog 生成新的binlog文件 便于增量备份 lockalltables： 锁定所有表（MyISAM需要） 会影响业务 InnoDB不需要 quick： 快速备份 不缓冲查询结果 大表必须使用 compress： 压缩传输数据 减少网络传输 16.3.3 mysqldump备份示例 示例1：备份单个数据库（InnoDB） mysqldump u root p \\ singletransaction \\ masterdata=2 \\ flushlogs \\ routines \\ triggers \\ mydb &gt; mydbbackup$(date +%Y%m%d).sql 示例2：备份所有数据库 mysqldump u root p alldatabases singletransaction masterdata=2 flushlogs routines triggers events &gt; allbackup$(date +%Y%m%d).sql 示例3：只备份表结构 mysqldump u root p nodata databasename &gt; schemaonly.sql 示例4：只备份数据 mysqldump u root p nocreateinfo databasename &gt; dataonly.sql 示例5：备份并压缩 mysqldump u root p singletransaction databasename | gzip &gt; backup.sql.gz 示例6：远程备份 mysqldump h remotehost u root p singletransaction databasename &gt; remotebackup.sql 16.3.4 mysqldump恢复 恢复数据库 mysql u root p databasename &lt; backup.sql 恢复所有数据库 mysql u root p &lt; allbackup.sql 恢复压缩的备份 gunzip &lt; backup.sql.gz | mysql u root p databasename 恢复时显示进度 pv backup.sql | mysql u root p databasename 恢复前创建数据库 mysql u root p e &quot;CREATE DATABASE IF NOT EXISTS mydb&quot; mysql u root p mydb &lt; backup.sql 16.3.5 mysqldump的优缺点 优点： ✅ 简单易用 ✅ 跨平台、跨版本 ✅ 可以查看和编辑备份文件 ✅ 可以选择性恢复 ✅ 适合小数据库 缺点： ❌ 备份速度慢 ❌ 恢复速度慢 ❌ 占用CPU和内存 ❌ 不适合大数据库（&gt;100GB） 16.4 mysqlpump逻辑备份 16.4.1 mysqlpump概述 mysqlpump是MySQL 5.7新增的备份工具 相比mysqldump的改进： ✅ 支持并行备份（多线程） ✅ 备份速度更快 ✅ 支持备份用户 ✅ 支持压缩 基本用法 mysqlpump u root p databasename &gt; backup.sql 并行备份（4个线程） mysqlpump u root p defaultparallelism=4 databasename &gt; backup.sql 压缩备份 mysqlpump u root p compressoutput=LZ4 databasename &gt; backup.sql.lz4 16.4.2 mysqlpump vs mysqldump 特性 mysqldump mysqlpump 并行备份 ❌ ✅ 备份速度 慢 快 压缩 需要外部工具 ✅ 内置 备份用户 ❌ ✅ 成熟度 高 一般 推荐度 ⭐⭐⭐⭐⭐ ⭐⭐⭐ 16.5 XtraBackup物理备份 ⭐⭐⭐⭐⭐ 16.5.1 XtraBackup概述 XtraBackup特点： ✅ Percona开发的开源工具 ✅ 物理备份（直接复制数据文件） ✅ 热备份（不锁表） ✅ 支持增量备份 ✅ 备份速度快 ✅ 恢复速度快 ✅ 适合大数据库 版本选择： MySQL 5.7 → XtraBackup 2.4 MySQL 8.0 → XtraBackup 8.0 16.5.2 XtraBackup安装 CentOS/RHEL安装 yum install https://repo.percona.com/yum/perconareleaselatest.noarch.rpm yum install perconaxtrabackup24 Ubuntu/Debian安装 wget https://repo.percona.com/apt/perconareleaselatest.genericall.deb dpkg i perconareleaselatest.genericall.deb aptget update aptget install perconaxtrabackup24 验证安装 xtrabackup version 16.5.3 XtraBackup全量备份 全量备份 xtrabackup backup \\ user=root \\ password=yourpassword \\ targetdir=/backup/fullbackup 参数说明： backup：执行备份 targetdir：备份目录 user：MySQL用户 password：MySQL密码 备份完成后的目录结构： /backup/fullbackup/ ├── ibdat"
  },
  {
    "title": "第17章：数据恢复实战",
    "url": "/mysql/04/17.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "04",
    "excerpt": "第17章：数据恢复实战 数据恢复是DBA的核心技能，关键时刻能救命 17.1 数据恢复概述 17.1.1 常见的数据丢失场景 人为误操作（最常见）： ❌ 误删数据： DELETE FROM users WHERE ... ❌ 误删表： DROP TABLE users ❌ 误删库： DROP DATABASE mydb ❌ 误更新： UPDATE users...",
    "content": "第17章：数据恢复实战 数据恢复是DBA的核心技能，关键时刻能救命 17.1 数据恢复概述 17.1.1 常见的数据丢失场景 人为误操作（最常见）： ❌ 误删数据： DELETE FROM users WHERE ... ❌ 误删表： DROP TABLE users ❌ 误删库： DROP DATABASE mydb ❌ 误更新： UPDATE users SET password = '123456' （忘记WHERE） ❌ 误TRUNCATE： TRUNCATE TABLE orders 系统故障： ❌ 硬件故障（磁盘损坏） ❌ 软件Bug ❌ 主从同步错误 恶意攻击： ❌ SQL注入 ❌ 勒索病毒 ❌ 删库跑路 17.1.2 恢复目标 RTO（Recovery Time Objective）： 恢复时间目标 系统可以容忍的最长停机时间 例如：RTO = 1小时 RPO（Recovery Point Objective）： 恢复点目标 系统可以容忍的最大数据丢失量 例如：RPO = 5分钟 恢复策略： RTO越小，成本越高 RPO越小，备份频率越高 需要在成本和需求之间平衡 17.2 基于mysqldump的恢复 17.2.1 完整恢复 场景：数据库完全损坏，需要完整恢复 1. 停止应用访问数据库 2. 删除损坏的数据库 mysql u root p e &quot;DROP DATABASE IF EXISTS mydb&quot; 3. 创建新数据库 mysql u root p e &quot;CREATE DATABASE mydb DEFAULT CHARSET utf8mb4&quot; 4. 恢复备份 mysql u root p mydb &lt; /backup/mydb20241110.sql 5. 验证数据 mysql u root p mydb e &quot;SELECT COUNT() FROM users&quot; 6. 恢复应用访问 17.2.2 恢复单个表 场景：误删除了users表 方法1：从完整备份中提取单表 1. 从备份文件中提取建表语句和数据 sed n '/CREATE TABLE.users/,/UNLOCK TABLES/p' backup.sql &gt; usersonly.sql 2. 恢复单表 mysql u root p mydb &lt; usersonly.sql 方法2：恢复到临时数据库，再导出 1. 恢复到临时库 mysql u root p e &quot;CREATE DATABASE temprestore&quot; mysql u root p temprestore &lt; backup.sql 2. 导出单表 mysqldump u root p temprestore users &gt; usersonly.sql 3. 恢复到原库 mysql u root p mydb &lt; usersonly.sql 4. 删除临时库 mysql u root p e &quot;DROP DATABASE temprestore&quot; 17.2.3 恢复部分数据 场景：只需要恢复某些记录 1. 恢复到临时库 mysql u root p e &quot;CREATE DATABASE temprestore&quot; mysql u root p temprestore &lt; backup.sql 2. 导出需要的数据 mysqldump u root p temprestore users where=&quot;id BETWEEN 1000 AND 2000&quot; &gt; partialusers.sql 3. 恢复到原库 mysql u root p mydb &lt; partialusers.sql 4. 清理 mysql u root p e &quot;DROP DATABASE temprestore&quot; 17.3 基于binlog的时间点恢复 ⭐⭐⭐⭐⭐ 17.3.1 binlog恢复原理 完整备份 + binlog = 任意时间点恢复 时间线： [全量备份][binlog][误操作][现在] 2:00 2:0010:00 10:00 10:30 恢复步骤： 恢复全量备份（2:00的数据） 应用binlog（2:009:59的变更） 跳过误操作（10:00的DELETE） 继续应用binlog（10:0110:30的变更） 17.3.2 基于时间点恢复 场景：10:00误删了数据，需要恢复到9:59 1. 停止MySQL（防止新的写入） systemctl stop mysqld 2. 恢复全量备份 mysql u root p mydb &lt; /backup/mydb202411100200.sql 3. 查看备份时的binlog位置 从备份文件中查找： CHANGE MASTER TO MASTERLOGFILE='mysqlbin.000010', MASTERLOGPOS=154; grep &quot;CHANGE MASTER&quot; /backup/mydb202411100200.sql 4. 应用binlog（从备份点到误操作前） mysqlbinlog startposition=154 stopdatetime=&quot;20241110 09:59:59&quot; /var/lib/mysql/mysqlbin.000010 | mysql u root p mydb 5. 跳过误操作，继续应用后续binlog mysqlbinlog startdatetime=&quot;20241110 10:01:00&quot; /var/lib/mysql/mysqlbin.000010 /var/lib/mysql/mysqlbin.000011 | mysql u root p mydb 6. 启动MySQL systemctl start mysqld 7. 验证数据 mysql u root p mydb e &quot;SELECT COUNT() FROM users&quot; 17.3.3 基于位置点恢复 场景：知道误操作的binlog位置 1. 查找误操作的位置 mysqlbinlog vv /var/lib/mysql/mysqlbin.000010 | grep A 10 &quot;DELETE FROM users&quot; 输出示例： 241110 10:00:00 server id 1 endlogpos 1234 DELETE FROM users WHERE id = 100 2. 恢复全量备份 mysql u root p mydb &lt; /backup/mydb202411100200.sql 3. 应用binlog到误操作前（position 1233） mysqlbinlog startposition=154 stopposition=1233 /var/lib/mysql/mysqlbin.000010 | mysql u root p mydb 4. 跳过误操作，继续应用后续binlog（从position 1500开始） mysqlbinlog startposition=1500 /var/lib/mysql/mysqlbin.000010 | mysql u root p mydb 17.3.4 恢复误删除的数据 场景：误执行了 DELETE FROM users WHERE city = '北京' 方法1：从binlog中提取被删除的数据 1. 找到DELETE语句的binlog位置 mysqlbinlog vv base64output=DECODEROWS /var/lib/mysql/mysqlbin.000010 | grep B 5 &quot;DELETE FROM users&quot; 2. 提取DELETE语句前的数据（ROW格式的binlog） binlog中记录了被删除行的完整数据 可以手动构造INSERT语句恢复 方法2：使用binlog2sql工具（推荐） 安装binlog2sql git clone https://github.com/danfengcao/binlog2sql.git cd binlog2sql 生成回滚SQL python binlog2sql.py h127.0.0.1 P3306 uroot p'password' startfile='mysqlbin.000010' startdatetime='20241110 09:00:00' stopdatetime='20241110 11:00:00' d mydb t users flashback &gt; rollback.sql 执行回滚 mysql u root p mydb &lt; rollback.sql 17.4 基于XtraBackup的恢复 17.4.1 全量恢复 场景：服务器故障，需要完整恢复 1. 准备备份 xtrabackup prepare targetdir=/backup/full20241110 2. 停止MySQL systemctl stop mysqld 3. 清空数据目录 rm rf /var/lib/mysql/ 4. 恢复数据 xtrabackup copyback tar"
  },
  {
    "title": "第18章：SQL优化实战 ⭐⭐⭐⭐⭐",
    "url": "/mysql/05/18-sql.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "05",
    "excerpt": "第18章：SQL优化实战 ⭐⭐⭐⭐⭐ 本章是MySQL性能优化的核心，必须精通EXPLAIN和各种SQL优化技巧 18.1 SQL优化的重要性 性能问题的根源： 80%的性能问题来自于SQL语句 一条慢SQL可能拖垮整个系统 SQL优化是成本最低、效果最好的优化手段 优化目标： 减少查询时间 降低CPU和内存消耗 减少磁盘I/O 提高并发能力 18.2 EX...",
    "content": "第18章：SQL优化实战 ⭐⭐⭐⭐⭐ 本章是MySQL性能优化的核心，必须精通EXPLAIN和各种SQL优化技巧 18.1 SQL优化的重要性 性能问题的根源： 80%的性能问题来自于SQL语句 一条慢SQL可能拖垮整个系统 SQL优化是成本最低、效果最好的优化手段 优化目标： 减少查询时间 降低CPU和内存消耗 减少磁盘I/O 提高并发能力 18.2 EXPLAIN执行计划详解 ⭐⭐⭐⭐⭐ 18.2.1 EXPLAIN基本用法 查看SQL执行计划 EXPLAIN SELECT FROM users WHERE age &gt; 20; 查看详细信息（MySQL 5.7+） EXPLAIN FORMAT=JSON SELECT FROM users WHERE age &gt; 20; 查看实际执行情况（MySQL 8.0+） EXPLAIN ANALYZE SELECT FROM users WHERE age &gt; 20; 18.2.2 EXPLAIN输出详解 示例输出： +++++++++++ | id | selecttype | table | type | possiblekeys | key | keylen | ref | rows | Extra | +++++++++++ | 1 | SIMPLE | users | ALL | NULL | NULL | NULL | NULL | 1000 | Using where | +++++++++++ 1. id（查询序列号） 相同id ：执行顺序从上到下 不同id ：id越大越先执行 id为NULL ：通常是UNION结果 示例： EXPLAIN SELECT FROM users WHERE id IN ( SELECT userid FROM orders WHERE amount &gt; 1000 ); 输出： id=2: 子查询先执行 id=1: 外层查询后执行 2. selecttype（查询类型） 类型 说明 SIMPLE 简单查询，不包含子查询或UNION PRIMARY 最外层查询 SUBQUERY 子查询 DERIVED 派生表（FROM子句中的子查询） UNION UNION中的第二个或后面的查询 UNION RESULT UNION的结果 3. table（表名） 显示这一行数据是关于哪张表的。 4. type（访问类型）⭐⭐⭐⭐⭐ 性能从好到差： system &gt; const &gt; eqref &gt; ref &gt; range &gt; index &gt; ALL 详细说明： type 说明 示例 system 表只有一行记录（系统表） 极少见 const 通过主键或唯一索引查询，最多返回一行 WHERE id=1 eqref 唯一索引扫描，对于每个索引键，表中只有一条记录匹配 JOIN时使用主键或唯一索引 ref 非唯一索引扫描，返回匹配某个单独值的所有行 WHERE name='张三' range 索引范围扫描 WHERE id &gt; 100 index 全索引扫描 扫描整个索引树 ALL 全表扫描 ⚠️ 需要优化 示例： const（最优） EXPLAIN SELECT FROM users WHERE id = 1; ref（良好） EXPLAIN SELECT FROM users WHERE name = '张三'; range（可接受） EXPLAIN SELECT FROM users WHERE age &gt; 20; ALL（需要优化） EXPLAIN SELECT FROM users WHERE YEAR(createtime) = 2024; 5. possiblekeys（可能使用的索引） 显示查询可能使用的索引。 6. key（实际使用的索引）⭐⭐⭐⭐ NULL ：没有使用索引，需要优化 索引名 ：使用了该索引 7. keylen（索引长度）⭐⭐⭐ 使用的索引字节数 在联合索引中，可以判断使用了几个字段 计算方法： 字符类型： char(n): n 字符集字节数 varchar(n): n 字符集字节数 + 2（存储长度） 数字类型： int: 4字节 bigint: 8字节 datetime: 8字节 NULL： 允许NULL: +1字节 示例： 联合索引 (name, age) name: varchar(50), utf8mb4 (4字节) age: int (4字节) 只使用name EXPLAIN SELECT FROM users WHERE name = '张三'; keylen = 504 + 2 + 1 = 203 使用name和age EXPLAIN SELECT FROM users WHERE name = '张三' AND age = 20; keylen = 504 + 2 + 1 + 4 + 1 = 208 8. ref（索引的哪一列被使用） 显示索引的哪一列被使用了，如果可能的话，是一个常数。 9. rows（扫描行数）⭐⭐⭐⭐ 预计需要扫描的行数 越少越好 只是估算值，不是精确值 10. Extra（额外信息）⭐⭐⭐⭐⭐ Extra 说明 优化建议 Using index 使用覆盖索引，不需要回表 ✅ 最优 Using where 使用WHERE过滤 ✅ 正常 Using index condition 使用索引下推 ✅ 良好 Using filesort 使用文件排序 ⚠️ 需要优化 Using temporary 使用临时表 ⚠️ 需要优化 Using join buffer 使用连接缓冲 ⚠️ 考虑添加索引 Impossible WHERE WHERE条件总是false ⚠️ 检查SQL逻辑 Select tables optimized away 优化器优化掉了 ✅ 很好 重点关注： Using filesort（文件排序）： 不好：没有使用索引排序 EXPLAIN SELECT FROM users ORDER BY age; Extra: Using filesort 优化：在age上创建索引 CREATE INDEX idxage ON users(age); EXPLAIN SELECT FROM users ORDER BY age; Extra: Using index Using temporary（使用临时表）： 不好：GROUP BY字段没有索引 EXPLAIN SELECT age, COUNT() FROM users GROUP BY age; Extra: Using temporary; Using filesort 优化：在age上创建索引 CREATE INDEX idxage ON users(age); EXPLAIN SELECT age, COUNT() FROM users GROUP BY age; Extra: Using index Using index（覆盖索引）： 创建联合索引 CREATE INDEX idxnameage ON users(name, age); 覆盖索引：只查询索引中的字段 EXPLAIN SELECT name, age FROM users WHERE name = '张三'; Extra: Using index（不需要回表，性能最优） 非覆盖索引：查询了索引外的字段 EXPLAIN SELECT name, age, email FROM users WHERE name = '张三'; Extra: NULL（需要回表查询email） 18.2.3 EXPLAIN实战案例 案例1：全表扫描优化 问题SQL： EXPLAIN SELECT FROM orders WHERE YEAR(createtime) = 2024; 结果： type: ALL rows: 1000000 Extra: Using where 优化： 方法1：改写SQL，避免在索引列上使用函数 EXPLAIN SELECT FROM orders WHERE createtime &gt;= '20240101' AND createtime &lt; '20250101'; 结果： type: range rows: 50000 Extra: Using index condition 方法2：创建函数索引（MySQL 8.0+） CREATE INDEX idxyear ON orders((YEAR(createtime))); 案例2：索引失效 问题SQL： 联合索引 (name, age, city) CREATE INDEX idxnameagecity ON users(name, age, city); 索引失效：跳过了age EXPLAIN SELECT FROM users WHERE name = '张三' AND city = '北京'; 结果： keylen: 203（只使用了name） 没有使用age和city 优化： 遵循最左前缀原则 EXPLAIN SELECT FROM users WHERE name = '张三' AND age = 20 AND city = '北京'; 结果： keylen: 完整使用索引 或者调整索引顺序 CREATE INDEX idxnamecity ON users(name, city); 18.3 SQL优化的一般步骤 步骤1：发现"
  },
  {
    "title": "第19章：索引优化进阶",
    "url": "/mysql/05/19.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "05",
    "excerpt": "第19章：索引优化进阶 索引优化是SQL优化的核心，90%的性能问题都与索引有关 19.1 索引优化原则回顾 19.1.1 索引的优缺点 优点： ✅ 加快查询速度（WHERE、ORDER BY、GROUP BY） ✅ 加快表连接速度 ✅ 减少排序和分组的时间 ✅ 唯一索引保证数据唯一性 缺点： ❌ 占用磁盘空间 ❌ 降低INSERT、UPDATE、DELET...",
    "content": "第19章：索引优化进阶 索引优化是SQL优化的核心，90%的性能问题都与索引有关 19.1 索引优化原则回顾 19.1.1 索引的优缺点 优点： ✅ 加快查询速度（WHERE、ORDER BY、GROUP BY） ✅ 加快表连接速度 ✅ 减少排序和分组的时间 ✅ 唯一索引保证数据唯一性 缺点： ❌ 占用磁盘空间 ❌ 降低INSERT、UPDATE、DELETE速度 ❌ 维护索引需要时间 索引使用原则： ✅ WHERE、ORDER BY、GROUP BY的列 ✅ 高选择性的列（区分度高） ✅ 小表不需要索引 ❌ 频繁更新的列不建索引 ❌ 区分度低的列不建索引（如性别） 19.2 索引失效场景 ⭐⭐⭐⭐⭐ 19.2.1 使用函数或表达式 ❌ 索引失效：对索引列使用函数 CREATE INDEX idxcreatetime ON orders(createtime); 失效 SELECT FROM orders WHERE YEAR(createtime) = 2024; SELECT FROM orders WHERE DATE(createtime) = '20241110'; ✅ 优化：不使用函数 SELECT FROM orders WHERE createtime &gt;= '20240101' AND createtime &lt; '20250101'; SELECT FROM orders WHERE createtime &gt;= '20241110 00:00:00' AND createtime &lt; '20241110 23:59:59'; ❌ 索引失效：对索引列进行运算 CREATE INDEX idxage ON users(age); 失效 SELECT FROM users WHERE age + 1 = 26; ✅ 优化 SELECT FROM users WHERE age = 25; ❌ 索引失效：字符串拼接 CREATE INDEX idxname ON users(name); 失效 SELECT FROM users WHERE CONCAT(name, '先生') = '张三先生'; ✅ 优化 SELECT FROM users WHERE name = '张三'; 19.2.2 隐式类型转换 ❌ 索引失效：类型不匹配 CREATE INDEX idxphone ON users(phone); phone是VARCHAR 失效（字符串列与数字比较） SELECT FROM users WHERE phone = 13800138000; ✅ 优化：使用字符串 SELECT FROM users WHERE phone = '13800138000'; ❌ 索引失效：数字列与字符串比较 CREATE INDEX idxuserid ON orders(userid); userid是INT 失效 SELECT FROM orders WHERE userid = '100'; ✅ 优化 SELECT FROM orders WHERE userid = 100; 规则： 字符串列 = 数字 → 索引失效 数字列 = 字符串 → 索引有效（MySQL会转换字符串） 19.2.3 LIKE以通配符开头 CREATE INDEX idxname ON users(name); ❌ 索引失效：以%开头 SELECT FROM users WHERE name LIKE '%张三%'; SELECT FROM users WHERE name LIKE '%张三'; ✅ 索引有效：%在结尾 SELECT FROM users WHERE name LIKE '张三%'; 解决方案：使用全文索引 ALTER TABLE users ADD FULLTEXT INDEX ftname(name); SELECT FROM users WHERE MATCH(name) AGAINST('张三'); 19.2.4 OR条件 CREATE INDEX idxage ON users(age); CREATE INDEX idxcity ON users(city); ❌ 索引失效：OR连接的列没有都建索引 SELECT FROM users WHERE age = 25 OR email = 'test@example.com'; email没有索引，导致全表扫描 ✅ 优化1：都建索引 CREATE INDEX idxemail ON users(email); SELECT FROM users WHERE age = 25 OR email = 'test@example.com'; ✅ 优化2：改用UNION SELECT FROM users WHERE age = 25 UNION SELECT FROM users WHERE email = 'test@example.com'; ✅ 优化3：改用IN（如果是同一列） SELECT FROM users WHERE age IN (25, 30, 35); 19.2.5 NOT、!=、&lt;&gt; CREATE INDEX idxstatus ON orders(status); ❌ 索引失效：NOT、!=、&lt;&gt; SELECT FROM orders WHERE status != 1; SELECT FROM orders WHERE status &lt;&gt; 1; SELECT FROM orders WHERE NOT status = 1; ✅ 优化：改用IN或范围查询 SELECT FROM orders WHERE status IN (0, 2, 3); SELECT FROM orders WHERE status &gt; 1 OR status &lt; 1; 19.2.6 IS NULL、IS NOT NULL CREATE INDEX idxdeletedat ON users(deletedat); ⚠️ 可能失效：IS NULL、IS NOT NULL SELECT FROM users WHERE deletedat IS NULL; SELECT FROM users WHERE deletedat IS NOT NULL; 是否使用索引取决于NULL值的比例 如果NULL值很多，IS NOT NULL可能不走索引 如果NULL值很少，IS NULL可能不走索引 ✅ 优化：避免NULL值 使用默认值代替NULL ALTER TABLE users MODIFY deletedat DATETIME DEFAULT '19700101 00:00:00'; 19.2.7 联合索引不满足最左前缀 CREATE INDEX idxabc ON users(a, b, c); ✅ 使用索引 SELECT FROM users WHERE a = 1; SELECT FROM users WHERE a = 1 AND b = 2; SELECT FROM users WHERE a = 1 AND b = 2 AND c = 3; SELECT FROM users WHERE a = 1 AND c = 3; 只用到a ❌ 不使用索引 SELECT FROM users WHERE b = 2; SELECT FROM users WHERE c = 3; SELECT FROM users WHERE b = 2 AND c = 3; 最左前缀原则： 必须从最左边的列开始，不能跳过中间的列 19.3 联合索引优化 ⭐⭐⭐⭐⭐ 19.3.1 联合索引的顺序 场景：经常查询 WHERE city = ? AND age = ? 方案1：(city, age) CREATE INDEX idxcityage ON users(city, age); 方案2：(age, city) CREATE INDEX idxagecity ON users(age, city); 如何选择？ 原则1：区分度高的列放前面 原则2：查询频率高的列放前面 原则3：范围查询的列放后面 分析区分度 SELECT COUNT(DISTINCT city) / COUNT( ) AS cityselectivity, COUNT(DISTINCT age) / COUNT( ) AS ageselectivity FROM users; 假设结果： cityselectivity: 0.05 (100个城市/2000条记录) ageselectivity: 0.02 (40个年龄/2000条记录) 结论：city区分度更高，应该放前面 CREATE INDEX idxcityage ON users(city, age); 19.3.2 覆盖索引 覆盖索引：索引包含了查询需要的所有列，不需要回表 ❌ 需要回表 CREATE INDEX idxage ON users(age); SELECT id, name, age FROM users WHERE age = 25; 执行过程： 1. 通过idxage找到age=25的记录的主键id 2. 回表查询name列 ✅ 覆盖索引（不需要回表） CREATE INDEX idxagename ON users(age, name); SELECT id, name, age FROM use"
  },
  {
    "title": "第20章：MySQL服务器优化",
    "url": "/mysql/05/20.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "05",
    "excerpt": "第20章：MySQL服务器优化 合理的参数配置可以让MySQL性能提升数倍 20.1 MySQL配置文件 20.1.1 配置文件位置 Linux配置文件位置（按优先级） /etc/my.cnf /etc/mysql/my.cnf /.my.cnf defaultsfile指定的文件 查看配置文件位置 mysql help | grep my.cnf 查看当前...",
    "content": "第20章：MySQL服务器优化 合理的参数配置可以让MySQL性能提升数倍 20.1 MySQL配置文件 20.1.1 配置文件位置 Linux配置文件位置（按优先级） /etc/my.cnf /etc/mysql/my.cnf /.my.cnf defaultsfile指定的文件 查看配置文件位置 mysql help | grep my.cnf 查看当前使用的配置 mysql u root p e &quot;SHOW VARIABLES&quot; 查看配置文件 cat /etc/my.cnf 20.1.2 配置文件结构 /etc/my.cnf [client] 客户端配置 port = 3306 socket = /var/lib/mysql/mysql.sock defaultcharacterset = utf8mb4 [mysql] mysql命令行工具配置 noautorehash prompt = &quot;\\u@\\h [\\d]&gt; &quot; [mysqld] 服务器配置（最重要） port = 3306 socket = /var/lib/mysql/mysql.sock datadir = /var/lib/mysql pidfile = /var/run/mysqld/mysqld.pid 字符集 charactersetserver = utf8mb4 collationserver = utf8mb4unicodeci 连接配置 maxconnections = 1000 maxconnecterrors = 100000 InnoDB配置 innodbbufferpoolsize = 8G innodblogfilesize = 512M [mysqldump] mysqldump工具配置 quick maxallowedpacket = 64M 20.2 内存配置优化 ⭐⭐⭐⭐⭐ 20.2.1 InnoDB Buffer Pool InnoDB Buffer Pool：最重要的内存配置 作用：缓存数据页和索引页 [mysqld] 大小设置（建议物理内存的50%70%） innodbbufferpoolsize = 8G 实例数量（MySQL 5.5+） 建议：每个实例1GB，总大小/1GB innodbbufferpoolinstances = 8 预热Buffer Pool（MySQL 5.6+） 关闭时保存Buffer Pool状态，启动时加载 innodbbufferpooldumpatshutdown = 1 innodbbufferpoolloadatstartup = 1 查看Buffer Pool使用情况 SHOW ENGINE INNODB STATUS\\G 查看Buffer Pool命中率 SHOW GLOBAL STATUS LIKE 'Innodbbufferpool%'; 计算命中率 命中率 = (1 Innodbbufferpoolreads / Innodbbufferpoolreadrequests) 100% 建议：命中率 &gt; 99% 20.2.2 查询缓存（MySQL 5.7） 查询缓存（MySQL 8.0已移除） [mysqld] 是否开启（建议关闭） querycachetype = 0 缓存大小 querycachesize = 0 为什么建议关闭？ 1. 任何表的更新都会清空该表的所有缓存 2. 并发性能差（全局锁） 3. 命中率低 4. MySQL 8.0已移除 查看查询缓存状态 SHOW VARIABLES LIKE 'querycache%'; SHOW STATUS LIKE 'Qcache%'; 20.2.3 线程缓存 线程缓存：缓存空闲的连接线程 [mysqld] 缓存的线程数 threadcachesize = 64 查看线程缓存状态 SHOW STATUS LIKE 'Threads%'; Threadscreated：创建的线程数 Threadscached：缓存的线程数 Threadsconnected：当前连接数 Threadsrunning：正在运行的线程数 如果Threadscreated持续增长，说明threadcachesize太小 20.2.4 表缓存 表缓存：缓存打开的表 [mysqld] 缓存的表数量 tableopencache = 4096 每个连接的表缓存 tableopencacheinstances = 16 查看表缓存状态 SHOW STATUS LIKE 'Open%'; Opentables：当前打开的表数量 Openedtables：历史打开的表数量 如果Openedtables持续增长，说明tableopencache太小 20.2.5 排序缓冲区 排序缓冲区：ORDER BY、GROUP BY使用 [mysqld] 每个连接的排序缓冲区大小 sortbuffersize = 2M 不要设置太大（会占用大量内存） 建议：256K 4M 查看排序状态 SHOW STATUS LIKE 'Sort%'; Sortmergepasses：多次排序的次数 如果该值很大，说明sortbuffersize太小 20.2.6 连接缓冲区 连接缓冲区：JOIN使用 [mysqld] 每个连接的JOIN缓冲区大小 joinbuffersize = 2M 建议：256K 4M 读缓冲区 readbuffersize = 1M readrndbuffersize = 2M 20.3 连接配置优化 20.3.1 最大连接数 [mysqld] 最大连接数 maxconnections = 1000 最大错误连接数 maxconnecterrors = 100000 连接超时时间 connecttimeout = 10 交互式连接超时时间 interactivetimeout = 28800 8小时 非交互式连接超时时间 waittimeout = 28800 8小时 查看当前连接数 SHOW STATUS LIKE 'Threadsconnected'; SHOW STATUS LIKE 'Maxusedconnections'; 查看连接详情 SHOW PROCESSLIST; SELECT FROM informationschema.PROCESSLIST; 计算合理的maxconnections maxconnections = (可用内存 系统内存 Buffer Pool) / 单个连接内存 单个连接内存 ≈ sortbuffersize + joinbuffersize + readbuffersize + ... 20.3.2 连接池配置 线程池（MySQL Enterprise或Percona Server） [mysqld] threadhandling = poolofthreads threadpoolsize = 16 CPU核心数 threadpoolmaxthreads = 1000 优势： ✅ 减少线程创建开销 ✅ 提高并发性能 ✅ 减少上下文切换 20.4 InnoDB配置优化 ⭐⭐⭐⭐⭐ 20.4.1 Redo Log配置 [mysqld] Redo Log文件大小 innodblogfilesize = 512M Redo Log文件数量 innodblogfilesingroup = 2 Redo Log缓冲区大小 innodblogbuffersize = 16M Redo Log刷新策略（最重要） innodbflushlogattrxcommit = 1 innodbflushlogattrxcommit的值： 0：每秒刷新一次（性能最好，可能丢失1秒数据） 1：每次事务提交刷新（最安全，性能最差）⭐ 推荐 2：每次事务提交写入OS缓存，每秒刷新（折中） 性能对比： 0: 1000 TPS 1: 100 TPS 2: 500 TPS 建议： 生产环境：1（数据安全第一） 开发环境：2（性能和安全平衡） 测试环境：0（性能优先） 20.4.2 Binlog配置 [mysqld] 开启binlog logbin = mysqlbin binlog格式 binlogformat = ROW ROW/STATEMENT/MIXED binlog缓冲区大小 binlogcachesize = 4M binlog刷新策略 syncbinlog = 1 syncbinlog的值： 0：不主动刷新，由OS决定（性能最好，可能丢失数据） 1：每次事务提交刷新（最安全，性能最差）⭐ 推荐 N：每N次事务提交刷新（折中） binlog过期时间 expirelogsdays = 7 MySQL 5.7 binlogexpirelogsseconds = 604800 MySQL 8.0（7天） 建议： 生产环境：syncbinlog = 1 开发环境：syncbinlog = 0 20.4.3 双1配置 双1配置：保证数据安全 [mysqld] innodbflushlogattrxcommit = 1 syncbinlog = 1 优点： ✅ 数据绝对安全 ✅ 不会丢失任何已提交的事务 缺点： ❌ 性能下降（每次提交都要刷盘） 性能优化： 1. 使用SSD（减少I/O延迟） 2. 使用RAID卡缓存（带电池） 3. 批量提交事务 20.4.4 刷新策略 [mysqld] 脏页刷新策略 innodbflushm"
  },
  {
    "title": "第21章：硬件与操作系统优化",
    "url": "/mysql/05/21.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "05",
    "excerpt": "第21章：硬件与操作系统优化 硬件是性能的基础，操作系统是性能的保障 21.1 硬件选型 21.1.1 CPU选择 CPU核心数： ✅ 多核心优于高频率 ✅ 推荐：8核心以上 ✅ MySQL可以利用多核心并行处理 CPU架构： ✅ x8664架构 ✅ Intel Xeon或AMD EPYC ✅ 支持AESNI（加密加速） 性能指标： 查看CPU信息 lscp...",
    "content": "第21章：硬件与操作系统优化 硬件是性能的基础，操作系统是性能的保障 21.1 硬件选型 21.1.1 CPU选择 CPU核心数： ✅ 多核心优于高频率 ✅ 推荐：8核心以上 ✅ MySQL可以利用多核心并行处理 CPU架构： ✅ x8664架构 ✅ Intel Xeon或AMD EPYC ✅ 支持AESNI（加密加速） 性能指标： 查看CPU信息 lscpu cat /proc/cpuinfo 查看CPU核心数 grep c processor /proc/cpuinfo 查看CPU型号 grep &quot;model name&quot; /proc/cpuinfo | head 1 CPU性能测试 sysbench cpu cpumaxprime=20000 run 建议： 小型：4核心 中型：816核心 大型：1632核心 21.1.2 内存选择 内存大小： ✅ 越大越好 ✅ 推荐：物理内存 &gt; 数据库大小 1.5 ✅ Buffer Pool = 物理内存 60%70% 内存类型： ✅ DDR4或DDR5 ✅ ECC内存（纠错内存） ✅ 高频率（2666MHz+） 性能指标： 查看内存信息 free h cat /proc/meminfo 查看内存详细信息 dmidecode t memory 内存性能测试 sysbench memory memorytotalsize=10G run 建议： 小型：816GB 中型：3264GB 大型：128GB+ 21.1.3 磁盘选择 ⭐⭐⭐⭐⭐ 磁盘类型对比： 类型 IOPS 延迟 价格 推荐度 HDD 100200 1020ms 低 ❌ 不推荐 SATA SSD 10K50K 0.11ms 中 ⭐⭐⭐ NVMe SSD 100K1M 0.010.1ms 高 ⭐⭐⭐⭐⭐ SSD的优势： ✅ IOPS高（100倍于HDD） ✅ 延迟低（1/100于HDD） ✅ 随机读写性能好 ✅ 适合数据库 RAID配置： RAID 0 ：性能最好，无冗余（不推荐） RAID 1 ：镜像，冗余好，性能一般 RAID 5 ：性能和冗余平衡（写性能差） RAID 10 ：性能和冗余都好（推荐）⭐⭐⭐⭐⭐ 磁盘性能测试： 顺序读写测试 dd if=/dev/zero of=/tmp/test bs=1M count=1024 dd if=/tmp/test of=/dev/null bs=1M 随机读写测试（推荐） sysbench fileio filetotalsize=10G prepare sysbench fileio filetotalsize=10G filetestmode=rndrw time=60 maxrequests=0 run sysbench fileio filetotalsize=10G cleanup 使用fio测试 fio filename=/tmp/test direct=1 iodepth 1 thread rw=randrw ioengine=psync bs=16k size=10G numjobs=10 runtime=60 groupreporting name=mytest 建议： 数据文件：NVMe SSD + RAID 10 日志文件：NVMe SSD 备份文件：HDD（成本低） 21.1.4 网络选择 网卡： ✅ 千兆网卡（1Gbps）：小型 ✅ 万兆网卡（10Gbps）：中大型 ✅ 双网卡绑定（提高带宽和可用性） 网络性能测试： 测试网络带宽 iperf3 s 服务端 iperf3 c serverip 客户端 测试网络延迟 ping serverip 测试MySQL网络性能 sysbench oltpreadwrite mysqlhost=remotehost mysqluser=root mysqlpassword=password mysqldb=test tables=10 tablesize=100000 prepare 21.2 操作系统选择 21.2.1 Linux发行版选择 推荐发行版： ✅ CentOS/RHEL ：企业级，稳定（推荐）⭐⭐⭐⭐⭐ ✅ Ubuntu Server ：易用，社区活跃 ✅ Debian ：稳定 ❌ Windows：不推荐（性能差） 版本选择： CentOS 7/8 或 RHEL 7/8 Ubuntu 20.04 LTS 或 22.04 LTS 查看系统信息： 查看发行版 cat /etc/osrelease lsbrelease a 查看内核版本 uname r 查看系统位数 uname m 21.3 操作系统优化 ⭐⭐⭐⭐⭐ 21.3.1 文件系统选择 文件系统对比： 文件系统 性能 稳定性 推荐度 ext3 一般 好 ❌ ext4 好 好 ⭐⭐⭐⭐ XFS 很好 很好 ⭐⭐⭐⭐⭐ Btrfs 好 一般 ⭐⭐⭐ 推荐：XFS ✅ 高性能 ✅ 支持大文件 ✅ 日志文件系统 ✅ CentOS 7默认文件系统 挂载选项优化： /etc/fstab /dev/sdb1 /var/lib/mysql xfs noatime,nodiratime,nobarrier 0 0 选项说明： noatime：不更新访问时间（提高性能） nodiratime：不更新目录访问时间 nobarrier：禁用写屏障（SSD或有RAID卡缓存时） 重新挂载 mount o remount /var/lib/mysql 查看挂载选项 mount | grep mysql 21.3.2 I/O调度器优化 I/O调度器类型： CFQ （Completely Fair Queuing）：默认，适合HDD Deadline ：适合数据库 NOOP ：适合SSD/NVMe（推荐）⭐⭐⭐⭐⭐ 查看和修改I/O调度器： 查看当前I/O调度器 cat /sys/block/sda/queue/scheduler 临时修改 echo noop &gt; /sys/block/sda/queue/scheduler 永久修改（/etc/default/grub） GRUBCMDLINELINUX=&quot;elevator=noop&quot; 更新grub grub2mkconfig o /boot/grub2/grub.cfg 重启生效 reboot 建议： SSD/NVMe：noop HDD：deadline 21.3.3 内核参数优化 优化内核参数（/etc/sysctl.conf）： 网络优化 net.core.somaxconn = 65535 最大连接队列 net.core.netdevmaxbacklog = 65535 网卡接收队列 net.ipv4.tcpmaxsynbacklog = 65535 SYN队列 net.ipv4.tcpfintimeout = 10 FIN超时时间 net.ipv4.tcptwreuse = 1 重用TIMEWAIT连接 net.ipv4.tcptwrecycle = 0 不回收TIMEWAIT（避免NAT问题） net.ipv4.iplocalportrange = 1024 65535 端口范围 内存优化 vm.swappiness = 0 禁用swap（重要）⭐⭐⭐⭐⭐ vm.dirtyratio = 10 脏页比例 vm.dirtybackgroundratio = 5 后台刷新脏页比例 文件系统优化 fs.filemax = 6553560 最大文件句柄数 fs.aiomaxnr = 1048576 异步I/O最大数 应用配置 sysctl p 立即生效 查看配置 sysctl a | grep swappiness 重点：禁用swap 为什么要禁用swap？ MySQL使用swap会导致性能急剧下降 临时禁用 swapoff a 永久禁用（注释/etc/fstab中的swap行） /dev/mapper/centosswap swap swap defaults 0 0 查看swap使用情况 free h swapon s 21.3.4 文件句柄限制 修改文件句柄限制（/etc/security/limits.conf）： 添加以下内容 mysql soft nofile 65535 mysql hard nofile 65535 mysql soft nproc 65535 mysql hard nproc 65535 或者 soft nofile 65535 hard nofile 65535 soft nproc 65535 hard nproc 65535 查看当前限制 ulimit n ulimit u 查看MySQL进程的限制 cat /proc/$(pidof mysqld)/limits 修改systemd服务限制（/etc/systemd/system/mysqld.service.d/limits.conf）： [Service] LimitNOFILE=65535 LimitNPROC=65535 重新加载 systemctl daemonreload systemctl restart mysqld 21.3.5 透明大页（THP） 禁用透明大页： 为什么要禁用？ THP会导致MySQL性能下降和内存碎片 查看THP状态 cat /sys/kernel/mm/transparenthugepage/enabled 临时禁用 echo never &gt; /sys/ker"
  },
  {
    "title": "第22章：主从复制 ⭐⭐⭐⭐⭐",
    "url": "/mysql/06/22.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "06",
    "excerpt": "第22章：主从复制 ⭐⭐⭐⭐⭐ 主从复制是MySQL高可用架构的基础，是成为MySQL专家的必备技能 22.1 主从复制概述 22.1.1 什么是主从复制 主从复制（Replication） ：将主库（Master）的数据自动同步到从库（Slave）。 架构图： ┌─────────┐ │ Master │ │ (主库) │ └────┬────┘ │ bi...",
    "content": "第22章：主从复制 ⭐⭐⭐⭐⭐ 主从复制是MySQL高可用架构的基础，是成为MySQL专家的必备技能 22.1 主从复制概述 22.1.1 什么是主从复制 主从复制（Replication） ：将主库（Master）的数据自动同步到从库（Slave）。 架构图： ┌─────────┐ │ Master │ │ (主库) │ └────┬────┘ │ binlog ┌────┴────┐ │ │ ┌────▼───┐ ┌──▼─────┐ │ Slave1 │ │ Slave2 │ │ (从库) │ │ (从库) │ └────────┘ └────────┘ 22.1.2 主从复制的作用 1. 读写分离 主库：处理写操作（INSERT、UPDATE、DELETE） 从库：处理读操作（SELECT） 提高并发性能 2. 数据备份 从库作为实时备份 主库故障时可以快速切换 3. 高可用 主库故障时，从库可以升级为主库 实现故障转移 4. 数据分析 在从库上执行复杂查询 不影响主库性能 22.1.3 主从复制原理 ⭐⭐⭐⭐⭐ 三个线程： 主库：Binlog Dump线程 读取binlog 发送给从库 从库：I/O线程 接收主库的binlog 写入relay log（中继日志） 从库：SQL线程 读取relay log 执行SQL语句 复制流程： 主库 从库 ┌──────────────┐ ┌──────────────┐ │ 执行SQL语句 │ │ │ └──────┬───────┘ │ │ │ │ │ ┌──────▼───────┐ │ │ │ 写入binlog │ │ │ └──────┬───────┘ │ │ │ │ │ ┌──────▼───────┐ binlog ┌──────▼───────┐ │ Binlog Dump ├─────────────►│ I/O Thread │ │ Thread │ │ │ └──────────────┘ └──────┬───────┘ │ ┌──────▼───────┐ │ 写入relay log│ └──────┬───────┘ │ ┌──────▼───────┐ │ SQL Thread │ │ 执行SQL语句 │ └──────────────┘ 详细步骤： 主库执行SQL语句（INSERT、UPDATE、DELETE） 主库将变更写入binlog 从库的I/O线程连接主库，请求binlog 主库的Binlog Dump线程读取binlog，发送给从库 从库的I/O线程接收binlog，写入relay log 从库的SQL线程读取relay log，执行SQL语句 从库数据与主库保持一致 22.2 配置主从复制 22.2.1 环境准备 服务器规划： 主库：192.168.1.100（Master） 从库1：192.168.1.101（Slave1） 从库2：192.168.1.102（Slave2） 版本要求： MySQL 5.7.x（主从版本最好一致） 从库版本 &gt;= 主库版本 22.2.2 配置主库（Master） 1. 修改配置文件（my.cnf） [mysqld] 服务器ID（唯一） serverid=1 开启binlog logbin=mysqlbin binlog格式（推荐ROW） binlogformat=ROW 需要同步的数据库（可选） binlogdodb=mydb 不需要同步的数据库（可选） binlogignoredb=mysql binlogignoredb=informationschema binlogignoredb=performanceschema binlogignoredb=sys binlog过期时间（天） expirelogsdays=7 每次事务提交都写入binlog syncbinlog=1 InnoDB设置 innodbflushlogattrxcommit=1 2. 重启MySQL systemctl restart mysqld 3. 创建复制用户 创建复制用户 CREATE USER 'repl'@'192.168.1.%' IDENTIFIED BY 'Repl@123456'; 授予复制权限 GRANT REPLICATION SLAVE ON . TO 'repl'@'192.168.1.%'; 刷新权限 FLUSH PRIVILEGES; 4. 查看主库状态 SHOW MASTER STATUS; 输出示例： +++++ | File | Position | BinlogDoDB | BinlogIgnoreDB | +++++ | mysqlbin.000001 | 154 | mydb | mysql,... | +++++ 记录： File和Position，配置从库时需要用到。 5. 锁定主库（可选，用于全量备份） 锁定所有表（只读） FLUSH TABLES WITH READ LOCK; 备份数据 mysqldump uroot p alldatabases &gt; /backup/all.sql 解锁 UNLOCK TABLES; 22.2.3 配置从库（Slave） 1. 修改配置文件（my.cnf） [mysqld] 服务器ID（唯一，不能与主库相同） serverid=2 开启binlog（可选，用于级联复制） logbin=mysqlbin relay log relaylog=mysqlrelaybin 只读模式（推荐） readonly=1 超级用户也只读（推荐） superreadonly=1 需要同步的数据库（可选） replicatedodb=mydb 不需要同步的数据库（可选） replicateignoredb=mysql replicateignoredb=informationschema replicateignoredb=performanceschema replicateignoredb=sys 跳过错误（慎用） slaveskiperrors=1062,1032 2. 重启MySQL systemctl restart mysqld 3. 配置主从关系 停止从库（如果已经启动） STOP SLAVE; 配置主库信息 CHANGE MASTER TO MASTERHOST='192.168.1.100', 主库IP MASTERPORT=3306, 主库端口 MASTERUSER='repl', 复制用户 MASTERPASSWORD='Repl@123456', 复制密码 MASTERLOGFILE='mysqlbin.000001', binlog文件名 MASTERLOGPOS=154; binlog位置 启动从库 START SLAVE; 4. 查看从库状态 SHOW SLAVE STATUS\\G 重要字段： SlaveIORunning: Yes I/O线程运行状态 SlaveSQLRunning: Yes SQL线程运行状态 SecondsBehindMaster: 0 主从延迟（秒） LastIOError: I/O错误信息 LastSQLError: SQL错误信息 MasterLogFile: mysqlbin.000001 ReadMasterLogPos: 154 RelayLogFile: mysqlrelaybin.000002 RelayLogPos: 320 判断复制是否正常： SlaveIORunning: Yes SlaveSQLRunning: Yes SecondsBehindMaster: 0 或很小的值 22.2.4 测试主从复制 在主库执行： 创建数据库 CREATE DATABASE testrepl; 使用数据库 USE testrepl; 创建表 CREATE TABLE users ( id INT PRIMARY KEY AUTOINCREMENT, name VARCHAR(50), createtime TIMESTAMP DEFAULT CURRENTTIMESTAMP ); 插入数据 INSERT INTO users (name) VALUES ('user1'), ('user2'), ('user3'); 查询数据 SELECT FROM users; 在从库查询： 使用数据库 USE testrepl; 查询数据（应该能看到主库插入的数据） SELECT FROM users; 如果从库能查到数据，说明主从复制配置成功！ ✅ 22.3 复制格式 22.3.1 三种复制格式 1. STATEMENT（语句复制） binlogformat=STATEMENT 特点： 记录SQL语句 binlog文件小 可能导致主从数据不一致 示例： 主库执行 UPDATE users SET createtime = NOW() WHERE id &lt; 100; binlog记录 UPDATE users SET createtime = NOW() WHERE id &lt; 100; 问题：从库执行时NOW()的值可能不同 2. ROW（行复制）⭐ 推荐 binlogformat=ROW 特点： 记录每一行的变化 binlog文件大 数据一致性好 示例： 主库执行 UPDATE users SET createtime = NOW() WHERE id &lt; 100; binlog记录（伪代码） "
  },
  {
    "title": "第23章：读写分离",
    "url": "/mysql/06/23.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "06",
    "excerpt": "第23章：读写分离 读写分离是提高MySQL并发能力的重要手段 23.1 读写分离概述 23.1.1 什么是读写分离？ 定义： 写操作（INSERT、UPDATE、DELETE）→ 主库 读操作（SELECT）→ 从库 分散数据库压力，提高并发能力 架构图： 应用程序 ↓ 读写分离中间件 ↙ ↘ 写操作 读操作 ↓ ↓ 主库 → 从库1 → 从库2 → 从库...",
    "content": "第23章：读写分离 读写分离是提高MySQL并发能力的重要手段 23.1 读写分离概述 23.1.1 什么是读写分离？ 定义： 写操作（INSERT、UPDATE、DELETE）→ 主库 读操作（SELECT）→ 从库 分散数据库压力，提高并发能力 架构图： 应用程序 ↓ 读写分离中间件 ↙ ↘ 写操作 读操作 ↓ ↓ 主库 → 从库1 → 从库2 → 从库3 23.1.2 为什么需要读写分离？ 问题场景： ❌ 读操作占比80%90% ❌ 单台数据库压力大 ❌ 查询慢，影响业务 读写分离的优势： ✅ 分散读压力（多个从库） ✅ 提高并发能力 ✅ 提高查询性能 ✅ 提高可用性（主库故障，从库可读） 适用场景： ✅ 读多写少（读写比 &gt; 3:1） ✅ 高并发查询 ✅ 报表查询 ✅ 数据分析 23.2 读写分离实现方式 23.2.1 应用层实现 原理： 应用程序判断SQL类型 写操作连接主库 读操作连接从库 示例代码（Java）： public class DataSourceRouter { private DataSource masterDataSource; // 主库 private List&lt;DataSource&gt; slaveDataSources; // 从库列表 public DataSource getDataSource(String sql) { if (isWriteOperation(sql)) { return masterDataSource; // 写操作用主库 } else { return getSlaveDataSource(); // 读操作用从库 } } private boolean isWriteOperation(String sql) { String upperSql = sql.trim().toUpperCase(); return upperSql.startsWith(&amp;quot;INSERT&amp;quot;) || upperSql.startsWith(&amp;quot;UPDATE&amp;quot;) || upperSql.startsWith(&amp;quot;DELETE&amp;quot;); } private DataSource getSlaveDataSource() { // 负载均衡：随机选择一个从库 int index = new Random().nextInt(slaveDataSources.size()); return slaveDataSources.get(index); } } 优点： ✅ 灵活，可自定义规则 ✅ 性能好（无中间件） ✅ 可以精确控制 缺点： ❌ 代码侵入性强 ❌ 维护成本高 ❌ 需要处理主从延迟 23.2.2 中间件实现 常用中间件： MySQL Router ：MySQL官方 ProxySQL ：功能强大（推荐）⭐⭐⭐⭐⭐ MaxScale ：MariaDB开发 MyCat ：国产，功能丰富 Atlas ：360开源 中间件架构： 应用程序 ↓ 中间件（ProxySQL） ↓ 主库 + 从库 优点： ✅ 对应用透明 ✅ 无代码侵入 ✅ 统一管理 ✅ 支持负载均衡 缺点： ❌ 增加一层网络开销 ❌ 中间件本身可能成为瓶颈 ❌ 需要维护中间件 23.3 ProxySQL实战 ⭐⭐⭐⭐⭐ 23.3.1 ProxySQL安装 CentOS安装 cat &lt;&lt;EOF &gt; /etc/yum.repos.d/proxysql.repo [proxysqlrepo] name=ProxySQL YUM repository baseurl=https://repo.proxysql.com/ProxySQL/proxysql2.4.x/centos/\\$releasever gpgcheck=1 gpgkey=https://repo.proxysql.com/ProxySQL/proxysql2.4.x/repopubkey EOF yum install proxysql Ubuntu安装 wget https://github.com/sysown/proxysql/releases/download/v2.4.4/proxysql2.4.4ubuntu20amd64.deb dpkg i proxysql2.4.4ubuntu20amd64.deb 启动ProxySQL systemctl start proxysql systemctl enable proxysql 查看状态 systemctl status proxysql 连接ProxySQL管理端口 mysql u admin padmin h 127.0.0.1 P6032 23.3.2 ProxySQL配置 连接ProxySQL管理端口 mysql u admin padmin h 127.0.0.1 P6032 1. 添加MySQL服务器 INSERT INTO mysqlservers(hostgroupid, hostname, port) VALUES (1, '192.168.1.10', 3306); 主库，hostgroupid=1 INSERT INTO mysqlservers(hostgroupid, hostname, port) VALUES (2, '192.168.1.11', 3306); 从库1，hostgroupid=2 INSERT INTO mysqlservers(hostgroupid, hostname, port) VALUES (2, '192.168.1.12', 3306); 从库2，hostgroupid=2 加载到运行时 LOAD MYSQL SERVERS TO RUNTIME; 保存到磁盘 SAVE MYSQL SERVERS TO DISK; 查看服务器列表 SELECT FROM mysqlservers; 2. 配置监控账号 INSERT INTO mysqlusers(username, password, defaulthostgroup) VALUES ('monitor', 'monitorpassword', 1); LOAD MYSQL USERS TO RUNTIME; SAVE MYSQL USERS TO DISK; 3. 配置应用账号 INSERT INTO mysqlusers(username, password, defaulthostgroup, transactionpersistent) VALUES ('appuser', 'apppassword', 1, 1); defaulthostgroup=1：默认使用主库 transactionpersistent=1：事务内的所有语句都路由到同一个hostgroup LOAD MYSQL USERS TO RUNTIME; SAVE MYSQL USERS TO DISK; 4. 配置读写分离规则 写操作路由到hostgroup 1（主库） INSERT INTO mysqlqueryrules(ruleid, active, matchpattern, destinationhostgroup, apply) VALUES (1, 1, '^SELECT.FOR UPDATE$', 1, 1); INSERT INTO mysqlqueryrules(ruleid, active, matchpattern, destinationhostgroup, apply) VALUES (2, 1, '^SELECT.LOCK IN SHARE MODE$', 1, 1); 读操作路由到hostgroup 2（从库） INSERT INTO mysqlqueryrules(ruleid, active, matchpattern, destinationhostgroup, apply) VALUES (10, 1, '^SELECT', 2, 1); 写操作路由到hostgroup 1（主库） INSERT INTO mysqlqueryrules(ruleid, active, matchpattern, destinationhostgroup, apply) VALUES (20, 1, '^INSERT', 1, 1); INSERT INTO mysqlqueryrules(ruleid, active, matchpattern, destinationhostgroup, apply) VALUES (21, 1, '^UPDATE', 1, 1); INSERT INTO mysqlqueryrules(ruleid, active, matchpattern, destinationhostgroup, apply) VALUES (22, 1, '^DELETE', 1, 1); 加载规则 LOAD MYSQL QUERY RULES TO RUNTIME; SAVE MYSQL QUERY RULES TO DISK; 查看规则 SELECT ruleid, active, matchpattern, destinationhostgroup FROM mysqlqueryrules ORDER BY ruleid; 5. 配置健康检查 UPDATE glob"
  },
  {
    "title": "第24章：高可用方案",
    "url": "/mysql/06/24.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "06",
    "excerpt": "第24章：高可用方案 高可用是保证业务连续性的关键 24.1 高可用概述 24.1.1 什么是高可用？ 定义： High Availability（HA） 系统能够持续运行，减少停机时间 目标：99.9%、99.99%、99.999%可用性 可用性计算： 可用性 = (总时间 停机时间) / 总时间 × 100% 99.9% → 年停机时间：8.76小时 9...",
    "content": "第24章：高可用方案 高可用是保证业务连续性的关键 24.1 高可用概述 24.1.1 什么是高可用？ 定义： High Availability（HA） 系统能够持续运行，减少停机时间 目标：99.9%、99.99%、99.999%可用性 可用性计算： 可用性 = (总时间 停机时间) / 总时间 × 100% 99.9% → 年停机时间：8.76小时 99.99% → 年停机时间：52.56分钟 99.999% → 年停机时间：5.26分钟 24.1.2 为什么需要高可用？ 问题场景： ❌ 主库故障，业务中断 ❌ 硬件故障，数据丢失 ❌ 人为误操作，数据损坏 高可用的目标： ✅ 故障自动检测 ✅ 故障自动切换 ✅ 数据不丢失 ✅ 业务不中断 24.1.3 高可用方案对比 方案 自动切换 数据一致性 复杂度 推荐度 主从复制 ❌ 一般 低 ⭐⭐⭐ MHA ✅ 好 中 ⭐⭐⭐⭐ MGR ✅ 很好 高 ⭐⭐⭐⭐⭐ Orchestrator ✅ 好 中 ⭐⭐⭐⭐ Galera Cluster ✅ 很好 高 ⭐⭐⭐⭐ 24.2 MHA（Master High Availability）⭐⭐⭐⭐ 24.2.1 MHA概述 什么是MHA？ Master High Availability Manager 日本DeNA公司开发 自动主从故障切换工具 MHA架构： MHA Manager（管理节点） ↓ 监控 主库 → 从库1 → 从库2 → 从库3 故障切换流程： 检测主库故障 选择新主库 应用差异日志 切换到新主库 配置其他从库 MHA组件： MHA Manager ：管理节点，监控和故障切换 MHA Node ：数据节点，在每个MySQL服务器上安装 24.2.2 MHA安装 环境准备： 服务器规划 192.168.1.10 master 主库 192.168.1.11 slave1 从库1（候选主库） 192.168.1.12 slave2 从库2 192.168.1.13 manager MHA管理节点 配置SSH免密登录（所有节点） sshkeygen t rsa sshcopyid root@192.168.1.10 sshcopyid root@192.168.1.11 sshcopyid root@192.168.1.12 sshcopyid root@192.168.1.13 安装MHA Node（所有MySQL节点）： 安装依赖 yum install perlDBDMySQL perlConfigTiny perlLogDispatch perlParallelForkManager 下载MHA Node wget https://github.com/yoshinorim/mha4mysqlnode/releases/download/v0.58/mha4mysqlnode0.580.el7.centos.noarch.rpm 安装 rpm ivh mha4mysqlnode0.580.el7.centos.noarch.rpm 验证 ls /usr/bin/ 应该看到： savebinarylogs applydiffrelaylogs filtermysqlbinlog purgerelaylogs 安装MHA Manager（管理节点）： 先安装MHA Node rpm ivh mha4mysqlnode0.580.el7.centos.noarch.rpm 下载MHA Manager wget https://github.com/yoshinorim/mha4mysqlmanager/releases/download/v0.58/mha4mysqlmanager0.580.el7.centos.noarch.rpm 安装 rpm ivh mha4mysqlmanager0.580.el7.centos.noarch.rpm 验证 ls /usr/bin/ 应该看到： masterhacheckssh masterhacheckrepl masterhamanager masterhamasterswitch masterhacheckstatus masterhastop 24.2.3 MHA配置 创建MHA配置文件（/etc/mha/app1.cnf）： [server default] MHA Manager工作目录 managerworkdir=/var/log/mha/app1 MHA Manager日志 managerlog=/var/log/mha/app1/manager.log MySQL用户（用于监控和切换） user=mha password=mhapassword 复制用户 repluser=repl replpassword=replpassword SSH用户 sshuser=root 监控间隔（秒） pinginterval=3 主库故障后，从库等待时间 masteripfailoverscript=/usr/local/bin/masteripfailover VIP切换脚本 发送报告 reportscript=/usr/local/bin/sendreport 二次检查 secondarycheckscript=/usr/local/bin/masterhasecondarycheck s 192.168.1.11 s 192.168.1.12 主库 [server1] hostname=192.168.1.10 port=3306 候选主库优先级（数字越小优先级越高） candidatemaster=1 从库1（候选主库） [server2] hostname=192.168.1.11 port=3306 candidatemaster=1 从库2 [server3] hostname=192.168.1.12 port=3306 不作为候选主库 nomaster=1 创建MySQL监控用户： 在所有MySQL节点上执行 CREATE USER 'mha'@'%' IDENTIFIED BY 'mhapassword'; GRANT ALL PRIVILEGES ON . TO 'mha'@'%'; FLUSH PRIVILEGES; 创建VIP切换脚本（/usr/local/bin/masteripfailover）： !/usr/bin/env perl use strict; use warnings FATAL =&gt; 'all'; use Getopt::Long; my ( $command, $sshuser, $origmasterhost, $origmasterip, $origmasterport, $newmasterhost, $newmasterip, $newmasterport ); my $vip = '192.168.1.100/24'; my $key = '1'; my $sshstartvip = &quot;/sbin/ifconfig eth0:$key $vip&quot;; my $sshstopvip = &quot;/sbin/ifconfig eth0:$key down&quot;; GetOptions( 'command=s' =&gt; $command, 'sshuser=s' =&gt; $sshuser, 'origmasterhost=s' =&gt; $origmasterhost, 'origmasterip=s' =&gt; $origmasterip, 'origmasterport=i' =&gt; $origmasterport, 'newmasterhost=s' =&gt; $newmasterhost, 'newmasterip=s' =&gt; $newmasterip, 'newmasterport=i' =&gt; $newmasterport, ); exit &amp;main(); sub main { print &quot;\\n\\nIN SCRIPT TEST====$sshstopvip==$sshstartvip===\\n\\n&quot;; if ( $command eq &amp;quot;stop&amp;quot; || $command eq &amp;quot;stopssh&amp;quot; ) { my $exitcode = 1; eval { print &amp;quot;Disabling the VIP on old master: $origmasterhost \\n&amp;quot;; &amp;amp;stopvip(); $exitcode = 0; }; if ($@) { warn &amp;quot;Got Error: $@\\n&amp;quot;; exit $exitcode; } exit $exitcode; } elsif ( $command eq &amp;quot;start&amp;quot; ) { my $exitcode = 10; eval { print &amp;quot;Enabling the VIP $vip on the new master $newmasterhost \\n&amp;quot;; &amp;amp;startvip(); $exitcode = 0; }; if ($@) { "
  },
  {
    "title": "第25章：分库分表",
    "url": "/mysql/06/25.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "06",
    "excerpt": "第25章：分库分表 分库分表是解决海量数据存储和高并发访问的核心方案 25.1 分库分表概述 25.1.1 为什么需要分库分表？ 问题场景： ❌ 单表数据量过大（&gt;1000万） ❌ 查询慢，索引失效 ❌ 单库连接数不够 ❌ 单库I/O瓶颈 示例： 订单表：1亿条数据 SELECT FROM orders WHERE userid = 12345; 即使...",
    "content": "第25章：分库分表 分库分表是解决海量数据存储和高并发访问的核心方案 25.1 分库分表概述 25.1.1 为什么需要分库分表？ 问题场景： ❌ 单表数据量过大（&gt;1000万） ❌ 查询慢，索引失效 ❌ 单库连接数不够 ❌ 单库I/O瓶颈 示例： 订单表：1亿条数据 SELECT FROM orders WHERE userid = 12345; 即使有索引，查询也很慢 问题： 1. 表太大，索引树深度增加 2. Buffer Pool无法缓存所有数据 3. 单表锁竞争激烈 25.1.2 分库分表的优势 分表优势： ✅ 减小单表数据量 ✅ 提高查询性能 ✅ 减少锁竞争 ✅ 提高并发能力 分库优势： ✅ 分散连接数 ✅ 分散I/O压力 ✅ 提高并发能力 ✅ 突破单机性能瓶颈 25.1.3 分库分表类型 垂直分库： 原来： 单库：用户表、订单表、商品表 分库后： 用户库：用户表 订单库：订单表 商品库：商品表 垂直分表： 原来： 用户表：id, name, age, address, avatar, description 分表后： 用户基本表：id, name, age 用户详情表：id, address, avatar, description 水平分库： 原来： 单库：订单表（1亿条） 分库后： 订单库1：订单表（2500万条） 订单库2：订单表（2500万条） 订单库3：订单表（2500万条） 订单库4：订单表（2500万条） 水平分表： 原来： 订单表：1亿条 分表后： 订单表0：2500万条 订单表1：2500万条 订单表2：2500万条 订单表3：2500万条 25.2 分片策略 ⭐⭐⭐⭐⭐ 25.2.1 范围分片（Range） 原理： 按照某个字段的范围分片 例如：按ID、时间范围 示例： 按ID范围分片 订单表0：id &lt; 2500万 订单表1：2500万 &lt;= id &lt; 5000万 订单表2：5000万 &lt;= id &lt; 7500万 订单表3：id &gt;= 7500万 按时间范围分片 订单表2023：2023年的订单 订单表2024：2024年的订单 订单表2025：2025年的订单 优点： ✅ 简单易理解 ✅ 范围查询性能好 ✅ 扩容方便 缺点： ❌ 数据分布可能不均匀 ❌ 热点问题（最新数据访问频繁） 适用场景： 按时间查询的业务 有明显范围的数据 25.2.2 哈希分片（Hash） 原理： 对分片键进行哈希运算 根据哈希值确定分片 示例： // 按用户ID哈希分片 int shardIndex = userId % 4; // 4个分片 // 用户1001 → 1001 % 4 = 1 → 订单表1 // 用户1002 → 1002 % 4 = 2 → 订单表2 // 用户1003 → 1003 % 4 = 3 → 订单表3 // 用户1004 → 1004 % 4 = 0 → 订单表0 优点： ✅ 数据分布均匀 ✅ 避免热点问题 缺点： ❌ 范围查询性能差 ❌ 扩容困难（需要重新哈希） 适用场景： 按ID查询的业务 数据分布要求均匀 25.2.3 一致性哈希（Consistent Hash） 原理： 解决哈希分片扩容问题 使用哈希环 示例： 哈希环：0 2^321 节点分布： 节点1：hash(node1) = 100 节点2：hash(node2) = 200 节点3：hash(node3) = 300 数据分布： 数据A：hash(A) = 50 → 节点1（顺时针最近） 数据B：hash(B) = 150 → 节点2 数据C：hash(C) = 250 → 节点3 扩容（增加节点4）： 节点4：hash(node4) = 150 只需迁移部分数据（150200之间的数据） 优点： ✅ 扩容时只需迁移部分数据 ✅ 数据分布相对均匀 缺点： ❌ 实现复杂 ❌ 可能出现数据倾斜 25.2.4 地理位置分片（Geo） 原理： 按照地理位置分片 例如：按省份、城市 示例： 按地区分片 订单库华北：北京、天津、河北的订单 订单库华东：上海、江苏、浙江的订单 订单库华南：广东、福建、海南的订单 订单库华中：湖北、湖南、河南的订单 优点： ✅ 就近访问，延迟低 ✅ 符合业务逻辑 缺点： ❌ 数据分布可能不均匀 ❌ 跨地区查询复杂 25.3 分片键选择 ⭐⭐⭐⭐⭐ 25.3.1 分片键选择原则 原则1：高频查询字段 ✅ 好的分片键 SELECT FROM orders WHERE userid = 12345; userid是高频查询字段，适合作为分片键 ❌ 不好的分片键 SELECT FROM orders WHERE orderstatus = 1; orderstatus不是唯一标识，不适合作为分片键 原则2：数据分布均匀 ✅ 好的分片键：userid 每个用户的订单数量相对均匀 ❌ 不好的分片键：orderdate 某些日期（如双11）订单量特别大 原则3：避免跨分片查询 ✅ 好的分片键：userid SELECT FROM orders WHERE userid = 12345; 只需查询一个分片 ❌ 不好的分片键：orderid SELECT FROM orders WHERE userid = 12345; 需要查询所有分片（userid不是分片键） 原则4：业务相关性 ✅ 好的分片键：userid 订单表按userid分片 用户表也按userid分片 可以进行分片内JOIN ❌ 不好的分片键：orderid 订单表按orderid分片 用户表按userid分片 无法进行分片内JOIN 25.3.2 常见分片键 订单表： 推荐：userid（用户维度查询多） 备选：orderid（订单维度查询） 用户表： 推荐：userid 商品表： 推荐：productid 日志表： 推荐：时间（按天或月分片） 25.4 分库分表中间件 25.4.1 中间件对比 中间件 类型 语言 性能 推荐度 ShardingSphere 客户端 Java 高 ⭐⭐⭐⭐⭐ MyCat 代理 Java 中 ⭐⭐⭐⭐ Vitess 代理 Go 高 ⭐⭐⭐⭐ TDDL 客户端 Java 高 ⭐⭐⭐ 25.4.2 ShardingSphere实战 ⭐⭐⭐⭐⭐ 什么是ShardingSphere？ Apache顶级项目 分库分表、读写分离、分布式事务 支持JDBC、Proxy、Sidecar三种模式 ShardingSphereJDBC配置： application.yml spring: shardingsphere: datasource: names: ds0,ds1,ds2,ds3 数据源0 ds0: type: com.zaxxer.hikari.HikariDataSource driverclassname: com.mysql.cj.jdbc.Driver jdbcurl: jdbc:mysql://192.168.1.10:3306/orderdb0 username: root password: password 数据源1 ds1: type: com.zaxxer.hikari.HikariDataSource driverclassname: com.mysql.cj.jdbc.Driver jdbcurl: jdbc:mysql://192.168.1.11:3306/orderdb1 username: root password: password 数据源2 ds2: type: com.zaxxer.hikari.HikariDataSource driverclassname: com.mysql.cj.jdbc.Driver jdbcurl: jdbc:mysql://192.168.1.12:3306/orderdb2 username: root password: password 数据源3 ds3: type: com.zaxxer.hikari.HikariDataSource driverclassname: com.mysql.cj.jdbc.Driver jdbcurl: jdbc:mysql://192.168.1.13:3306/orderdb3 username: root password: password rules: sharding: tables: 订单表分片规则 orders: 实际节点 actualdatanodes: ds$&amp;gt;{0..3}.orders$&amp;gt;{0..3} 分库策略 databasestrategy: standard: shardingcolumn: userid shardingalgorithmname: databaseinline 分表策略 tablestrategy: standard: shardingcolumn: userid shardingalgorithmname: tableinline 主键生成策略 keygeneratestrategy: column: orderid keygeneratorname: snowflake 分片算法 shardingalgorithms: 分库算法 databaseinline: type: INLINE props: algorithmexpression: ds$&amp;amp;gt;{userid % 4} 分表算法 tableinl"
  },
  {
    "title": "第26章：MySQL监控体系",
    "url": "/mysql/07/26.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "07",
    "excerpt": "第26章：MySQL监控体系 监控是保障MySQL稳定运行的第一道防线 26.1 监控概述 26.1.1 为什么需要监控？ 问题场景： ❌ 数据库突然变慢，不知道原因 ❌ 磁盘空间满了，业务中断 ❌ 主从延迟严重，数据不一致 ❌ 连接数耗尽，无法连接 监控的目标： ✅ 及时发现问题 ✅ 快速定位问题 ✅ 预防故障发生 ✅ 优化性能 26.1.2 监控指标分类...",
    "content": "第26章：MySQL监控体系 监控是保障MySQL稳定运行的第一道防线 26.1 监控概述 26.1.1 为什么需要监控？ 问题场景： ❌ 数据库突然变慢，不知道原因 ❌ 磁盘空间满了，业务中断 ❌ 主从延迟严重，数据不一致 ❌ 连接数耗尽，无法连接 监控的目标： ✅ 及时发现问题 ✅ 快速定位问题 ✅ 预防故障发生 ✅ 优化性能 26.1.2 监控指标分类 系统层监控： CPU使用率 内存使用率 磁盘I/O 网络流量 MySQL层监控： QPS/TPS 连接数 慢查询 主从延迟 Buffer Pool命中率 业务层监控： 订单量 用户活跃度 响应时间 26.2 核心监控指标 ⭐⭐⭐⭐⭐ 26.2.1 性能指标 1. QPS（每秒查询数） 查看总查询数 SHOW GLOBAL STATUS LIKE 'Questions'; 查看运行时间 SHOW GLOBAL STATUS LIKE 'Uptime'; 计算QPS QPS = Questions / Uptime 实时监控QPS mysqladmin u root p i 1 status | grep Queries 2. TPS（每秒事务数） 查看提交事务数 SHOW GLOBAL STATUS LIKE 'Comcommit'; 查看回滚事务数 SHOW GLOBAL STATUS LIKE 'Comrollback'; 计算TPS TPS = (Comcommit + Comrollback) / Uptime 3. 响应时间 查看慢查询 SHOW GLOBAL STATUS LIKE 'Slowqueries'; 查看平均查询时间（需要开启慢查询日志） 使用ptquerydigest分析 ptquerydigest /var/lib/mysql/slow.log 26.2.2 连接指标 1. 当前连接数 查看当前连接数 SHOW STATUS LIKE 'Threadsconnected'; 查看正在运行的线程数 SHOW STATUS LIKE 'Threadsrunning'; 查看历史最大连接数 SHOW STATUS LIKE 'Maxusedconnections'; 查看最大连接数配置 SHOW VARIABLES LIKE 'maxconnections'; 连接使用率 连接使用率 = Threadsconnected / maxconnections 100% 建议：&lt;80% 2. 连接错误 查看连接错误数 SHOW STATUS LIKE 'Abortedconnects'; 查看客户端异常断开数 SHOW STATUS LIKE 'Abortedclients'; 查看连接错误次数 SHOW STATUS LIKE 'Connectionerrors%'; 3. 线程缓存命中率 查看创建的线程数 SHOW STATUS LIKE 'Threadscreated'; 查看总连接数 SHOW STATUS LIKE 'Connections'; 线程缓存命中率 命中率 = (1 Threadscreated / Connections) 100% 建议：&gt;90% 26.2.3 InnoDB指标 1. Buffer Pool命中率 查看Buffer Pool读请求数 SHOW STATUS LIKE 'Innodbbufferpoolreadrequests'; 查看从磁盘读取的次数 SHOW STATUS LIKE 'Innodbbufferpoolreads'; Buffer Pool命中率 命中率 = (1 Innodbbufferpoolreads / Innodbbufferpoolreadrequests) 100% 建议：&gt;99% 2. Buffer Pool使用率 查看Buffer Pool总页数 SHOW STATUS LIKE 'Innodbbufferpoolpagestotal'; 查看空闲页数 SHOW STATUS LIKE 'Innodbbufferpoolpagesfree'; 使用率 使用率 = (1 pagesfree / pagestotal) 100% 3. InnoDB行操作 查看行读取数 SHOW STATUS LIKE 'Innodbrowsread'; 查看行插入数 SHOW STATUS LIKE 'Innodbrowsinserted'; 查看行更新数 SHOW STATUS LIKE 'Innodbrowsupdated'; 查看行删除数 SHOW STATUS LIKE 'Innodbrowsdeleted'; 4. InnoDB日志 查看日志写入次数 SHOW STATUS LIKE 'Innodblogwrites'; 查看日志等待次数 SHOW STATUS LIKE 'Innodblogwaits'; 如果&gt;0，说明日志缓冲区太小 26.2.4 复制指标 1. 主从延迟 在从库上执行 SHOW SLAVE STATUS\\G 关注字段： SecondsBehindMaster：延迟秒数 0：无延迟 NULL：复制未运行 &gt;0：有延迟 建议：&lt;5秒 2. 复制状态 SHOW SLAVE STATUS\\G 关注字段： SlaveIORunning: Yes IO线程运行 SlaveSQLRunning: Yes SQL线程运行 LastError: 空 无错误 3. 复制位置 主库binlog位置 SHOW MASTER STATUS; 从库读取位置 SHOW SLAVE STATUS\\G ReadMasterLogPos ExecMasterLogPos 26.2.5 表和索引指标 1. 表锁 查看表锁等待次数 SHOW STATUS LIKE 'Tablelockswaited'; 查看表锁立即获取次数 SHOW STATUS LIKE 'Tablelocksimmediate'; 表锁等待率 等待率 = Tablelockswaited / (Tablelockswaited + Tablelocksimmediate) 100% 建议：&lt;1% 2. 临时表 查看创建的临时表数 SHOW STATUS LIKE 'Createdtmptables'; 查看磁盘临时表数 SHOW STATUS LIKE 'Createdtmpdisktables'; 磁盘临时表比例 比例 = Createdtmpdisktables / Createdtmptables 100% 建议：&lt;25% 3. 表缓存 查看打开的表数 SHOW STATUS LIKE 'Opentables'; 查看打开表的次数 SHOW STATUS LIKE 'Openedtables'; 查看表缓存大小 SHOW VARIABLES LIKE 'tableopencache'; 如果Openedtables持续增长，说明缓存不足 26.2.6 磁盘指标 1. 磁盘空间 查看磁盘使用情况 df h 查看MySQL数据目录大小 du sh /var/lib/mysql 查看各数据库大小 SELECT tableschema AS 'Database', ROUND(SUM(datalength + indexlength) / 1024 / 1024, 2) AS 'Size (MB)' FROM informationschema.TABLES GROUP BY tableschema; 查看各表大小 SELECT tablename AS 'Table', ROUND(((datalength + indexlength) / 1024 / 1024), 2) AS 'Size (MB)' FROM informationschema.TABLES WHERE tableschema = 'mydb' ORDER BY (datalength + indexlength) DESC; 2. 磁盘I/O 使用iostat监控 iostat x 1 关注指标： %util：磁盘使用率（建议&lt;80%） await：平均等待时间（SSD&lt;1ms，HDD&lt;10ms） r/s, w/s：每秒读写次数 26.3 监控工具 26.3.1 命令行工具 1. mysqladmin 查看状态 mysqladmin u root p status 持续监控（每秒刷新） mysqladmin u root p i 1 status 查看变量 mysqladmin u root p variables 查看进程列表 mysqladmin u root p processlist 扩展状态 mysqladmin u root p extendedstatus 2. mytop 安装 yum install mytop 使用 mytop u root p password 类似top的MySQL监控工具 显示： 当前查询 QPS/TPS 连接数 慢查询 3. innotop 安装 yum install innotop 使用 innotop u root p password InnoDB监控工具 显示： InnoDB状态 事务 锁 I/O 26.3.2 图形化监控工具 1. Percona Monitoring and Management (PMM) ⭐⭐⭐⭐⭐ 安装PMM Server： 使用Docker安"
  },
  {
    "title": "第27章：性能诊断工具",
    "url": "/mysql/07/27.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "07",
    "excerpt": "第27章：性能诊断工具 工欲善其事，必先利其器 27.1 诊断工具概述 27.1.1 为什么需要诊断工具？ 问题场景： ❌ 查询突然变慢 ❌ CPU使用率100% ❌ 锁等待严重 ❌ 不知道问题在哪 诊断工具的作用： ✅ 快速定位问题 ✅ 分析性能瓶颈 ✅ 优化SQL ✅ 诊断锁问题 27.2 MySQL内置诊断工具 ⭐⭐⭐⭐⭐ 27.2.1 SHOW PR...",
    "content": "第27章：性能诊断工具 工欲善其事，必先利其器 27.1 诊断工具概述 27.1.1 为什么需要诊断工具？ 问题场景： ❌ 查询突然变慢 ❌ CPU使用率100% ❌ 锁等待严重 ❌ 不知道问题在哪 诊断工具的作用： ✅ 快速定位问题 ✅ 分析性能瓶颈 ✅ 优化SQL ✅ 诊断锁问题 27.2 MySQL内置诊断工具 ⭐⭐⭐⭐⭐ 27.2.1 SHOW PROCESSLIST 查看当前正在执行的查询： 查看进程列表 SHOW PROCESSLIST; 查看完整SQL SHOW FULL PROCESSLIST; 输出字段： Id：线程ID User：用户 Host：客户端地址 db：数据库 Command：命令类型（Query、Sleep等） Time：执行时间（秒） State：状态 Info：SQL语句 示例输出： Id User Host db Command Time State Info 1 root localhost:3306 test Query 10 Sending data SELECT FROM users WHERE age &gt; 18 2 root localhost:3307 test Sleep 100 NULL NULL 找出慢查询： 查找执行时间&gt;10秒的查询 SELECT FROM informationschema.PROCESSLIST WHERE TIME &gt; 10 AND COMMAND != 'Sleep' ORDER BY TIME DESC; 杀死慢查询 KILL 线程ID; 27.2.2 EXPLAIN分析查询 ⭐⭐⭐⭐⭐ 基本用法： EXPLAIN SELECT FROM users WHERE age &gt; 18; 输出字段： id：查询序号 selecttype：查询类型（SIMPLE、PRIMARY、SUBQUERY等） table：表名 type：访问类型（ALL、index、range、ref、eqref、const、system） possiblekeys：可能使用的索引 key：实际使用的索引 keylen：索引长度 ref：索引引用 rows：扫描行数 Extra：额外信息 type字段（重要）： 性能从好到差： system &gt; const &gt; eqref &gt; ref &gt; range &gt; index &gt; ALL system：表只有一行 const：主键或唯一索引查询 eqref：唯一索引扫描 ref：非唯一索引扫描 range：范围扫描（BETWEEN、&gt;、&lt;） index：全索引扫描 ALL：全表扫描（最差）⚠️ 示例分析： ❌ 全表扫描 EXPLAIN SELECT FROM users WHERE age &gt; 18; type: ALL rows: 1000000 问题：没有索引 ✅ 索引扫描 CREATE INDEX idxage ON users(age); EXPLAIN SELECT FROM users WHERE age &gt; 18; type: range key: idxage rows: 100000 EXPLAIN ANALYZE（MySQL 8.0+）： 实际执行并分析 EXPLAIN ANALYZE SELECT FROM users WHERE age &gt; 18; 输出实际执行时间和行数 27.2.3 SHOW PROFILE 开启profiling： 开启 SET profiling = 1; 执行查询 SELECT FROM users WHERE age &gt; 18; 查看profiles SHOW PROFILES; 输出： QueryID Duration Query 1 0.5 SELECT FROM users WHERE age &gt; 18 查看详细信息 SHOW PROFILE FOR QUERY 1; 查看CPU、I/O信息 SHOW PROFILE CPU, BLOCK IO FOR QUERY 1; 27.2.4 Performance Schema ⭐⭐⭐⭐⭐ 开启Performance Schema： 查看是否开启 SHOW VARIABLES LIKE 'performanceschema'; 开启（需要重启） [mysqld] performanceschema = ON 查看慢查询： 查看执行时间最长的SQL SELECT DIGESTTEXT AS query, COUNTSTAR AS execcount, AVGTIMERWAIT / 1000000000000 AS avgtimesec, SUMTIMERWAIT / 1000000000000 AS totaltimesec FROM performanceschema.eventsstatementssummarybydigest ORDER BY SUMTIMERWAIT DESC LIMIT 10; 查看表I/O： 查看表I/O统计 SELECT OBJECTSCHEMA AS db, OBJECTNAME AS tablename, COUNTREAD, COUNTWRITE, COUNTFETCH, COUNTINSERT, COUNTUPDATE, COUNTDELETE FROM performanceschema.tableiowaitssummarybytable WHERE OBJECTSCHEMA NOT IN ('mysql', 'performanceschema', 'informationschema') ORDER BY COUNTREAD + COUNTWRITE DESC LIMIT 10; 查看锁等待： 查看当前锁等待 SELECT r.trxid AS waitingtrxid, r.trxmysqlthreadid AS waitingthread, r.trxquery AS waitingquery, b.trxid AS blockingtrxid, b.trxmysqlthreadid AS blockingthread, b.trxquery AS blockingquery FROM informationschema.INNODBLOCKWAITS w INNER JOIN informationschema.INNODBTRX b ON b.trxid = w.blockingtrxid INNER JOIN informationschema.INNODBTRX r ON r.trxid = w.requestingtrxid; 27.3 Percona Toolkit ⭐⭐⭐⭐⭐ 27.3.1 安装Percona Toolkit CentOS yum install perconatoolkit Ubuntu apt install perconatoolkit 验证 ptquerydigest version 27.3.2 ptquerydigest（慢查询分析） 分析慢查询日志： 分析慢查询日志 ptquerydigest /var/lib/mysql/slow.log 输出到文件 ptquerydigest /var/lib/mysql/slow.log &gt; slowreport.txt 只分析指定时间范围 ptquerydigest since '20241110 00:00:00' until '20241110 23:59:59' /var/lib/mysql/slow.log 只显示前10条 ptquerydigest limit 10 /var/lib/mysql/slow.log 分析binlog ptquerydigest type binlog /var/lib/mysql/mysqlbin.000001 输出解读： Query 1: 100 QPS, 0.5s avg, ID 0x1234... Attribute pct total min max avg 95% stddev median ============ === ======= ======= ======= ======= ======= ======= ======= Count 10 1000 Exec time 50 500s 0.1s 2.0s 0.5s 1.0s 0.2s 0.4s Lock time 5 5s 0ms 50ms 5ms 10ms 5ms 3ms Rows sent 8 10000 10 100 10 20 5 10 Rows examine 90 900000 900 9000 900 1800 300 800 SELECT FROM users WHERE age &gt; 18\\G 27.3.3 ptonlineschemachange（在线DDL） 在线修改表结构（不锁表） ptonlineschemachange \\ alter &quot;ADD COLUMN email VARCHAR(100)&quot; \\ execute \\ D=mydb,t=users 原理： 1. 创建新表 2. 复制数据 3. 创建触发器同步增量数据 4. 重命名表 27.3.4 pttablechecksum（数据一致性检查） 检查主从数据一致性 pttablechecksum \\ "
  },
  {
    "title": "第28章：故障排查实战",
    "url": "/mysql/07/28.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "07",
    "excerpt": "第28章：故障排查实战 实战是检验技术的唯一标准 28.1 故障排查概述 28.1.1 常见故障类型 性能故障： 查询慢 CPU使用率高 磁盘I/O高 内存不足 可用性故障： MySQL服务停止 无法连接 主从复制中断 数据损坏 数据故障： 数据丢失 数据不一致 误删除数据 28.2 查询慢故障排查 ⭐⭐⭐⭐⭐ 28.2.1 问题现象 用户反馈：查询很慢，页...",
    "content": "第28章：故障排查实战 实战是检验技术的唯一标准 28.1 故障排查概述 28.1.1 常见故障类型 性能故障： 查询慢 CPU使用率高 磁盘I/O高 内存不足 可用性故障： MySQL服务停止 无法连接 主从复制中断 数据损坏 数据故障： 数据丢失 数据不一致 误删除数据 28.2 查询慢故障排查 ⭐⭐⭐⭐⭐ 28.2.1 问题现象 用户反馈：查询很慢，页面加载超过10秒 28.2.2 排查步骤 步骤1：查看当前查询 SHOW FULL PROCESSLIST; 发现： Id: 123, Time: 15, State: Sending data Info: SELECT FROM orders WHERE userid = 12345 步骤2：分析执行计划 EXPLAIN SELECT FROM orders WHERE userid = 12345; 结果： type: ALL rows: 1000000 Extra: Using where 问题：全表扫描，没有索引 步骤3：检查索引 SHOW INDEX FROM orders; 发现：userid字段没有索引 步骤4：添加索引 CREATE INDEX idxuserid ON orders(userid); 步骤5：验证 EXPLAIN SELECT FROM orders WHERE userid = 12345; 结果： type: ref key: idxuserid rows: 100 性能提升1000倍 28.3 CPU使用率高故障排查 ⭐⭐⭐⭐⭐ 28.3.1 问题现象 监控告警：MySQL服务器CPU使用率100% 28.3.2 排查步骤 步骤1：查看系统负载 top 发现：mysqld进程CPU使用率100% 步骤2：查看当前查询 SHOW FULL PROCESSLIST; 发现大量查询： SELECT FROM users WHERE name LIKE '%张%' 步骤3：分析问题 EXPLAIN SELECT FROM users WHERE name LIKE '%张%'; 结果： type: ALL rows: 10000000 问题：LIKE '%张%'无法使用索引，全表扫描 步骤4：优化方案 方案1：使用全文索引 ALTER TABLE users ADD FULLTEXT INDEX ftname(name); SELECT FROM users WHERE MATCH(name) AGAINST('张'); 方案2：使用Elasticsearch 将搜索功能迁移到ES 方案3：限制查询 要求用户输入至少2个字符，使用'张%'而不是'%张%' 28.4 连接数耗尽故障排查 ⭐⭐⭐⭐⭐ 28.4.1 问题现象 应用报错：Too many connections 28.4.2 排查步骤 步骤1：查看连接数 SHOW STATUS LIKE 'Threadsconnected'; Threadsconnected: 600 SHOW VARIABLES LIKE 'maxconnections'; maxconnections: 600 问题：连接数已满 步骤2：查看连接来源 SELECT USER, HOST, COUNT() AS conncount FROM informationschema.PROCESSLIST GROUP BY USER, HOST ORDER BY conncount DESC; 结果： appuser 192.168.1.100 500 问题：某个应用服务器占用大量连接 步骤3：查看连接状态 SELECT COMMAND, COUNT() AS count FROM informationschema.PROCESSLIST GROUP BY COMMAND; 结果： Sleep 480 Query 20 问题：大量Sleep连接（连接未释放） 步骤4：解决方案 临时方案：增加最大连接数 SET GLOBAL maxconnections = 1000; 长期方案： 1. 检查应用代码，确保连接正确释放 2. 使用连接池 3. 设置waittimeout SET GLOBAL waittimeout = 600; 10分钟 SET GLOBAL interactivetimeout = 600; 4. 杀死长时间Sleep的连接 SELECT CONCAT('KILL ', id, ';') FROM informationschema.PROCESSLIST WHERE COMMAND = 'Sleep' AND TIME &gt; 600; 28.5 主从复制中断故障排查 ⭐⭐⭐⭐⭐ 28.5.1 问题现象 监控告警：主从复制中断 28.5.2 排查步骤 步骤1：查看复制状态 SHOW SLAVE STATUS\\G 关注字段： SlaveIORunning: No SlaveSQLRunning: Yes LastIOError: Got fatal error 1236 from master... 步骤2：分析错误 错误类型1：binlog文件不存在 LastIOError: Got fatal error 1236 from master when reading data from binary log: 'Could not find first log file name in binary log index file' 原因：主库binlog被删除 解决：重新搭建主从复制 错误类型2：SQL线程错误 SlaveSQLRunning: No LastSQLError: Error 'Duplicate entry '1' for key 'PRIMARY'' on query 原因：主从数据不一致 解决：跳过错误或重新同步 步骤3：解决方案 方案1：跳过错误（谨慎使用） 跳过1个错误 STOP SLAVE; SET GLOBAL sqlslaveskipcounter = 1; START SLAVE; 方案2：重新搭建主从 1. 主库备份 mysqldump u root p singletransaction masterdata=2 alldatabases &gt; backup.sql 2. 从库导入 mysql u root p &lt; backup.sql 3. 配置复制 CHANGE MASTER TO MASTERHOST='192.168.1.10', MASTERUSER='repl', MASTERPASSWORD='replpassword', MASTERLOGFILE='mysqlbin.000010', MASTERLOGPOS=154; START SLAVE; 28.6 磁盘空间满故障排查 ⭐⭐⭐⭐⭐ 28.6.1 问题现象 MySQL无法写入数据 错误：ERROR 3 (HY000): Error writing file '/var/lib/mysql/...' (Errcode: 28 No space left on device) 28.6.2 排查步骤 步骤1：查看磁盘空间 df h 结果： /dev/sda1 100G 100G 0 100% /var/lib/mysql 问题：磁盘已满 步骤2：查找大文件 查看MySQL数据目录大小 du sh /var/lib/mysql/ 结果： 50G /var/lib/mysql/mydb 30G /var/lib/mysql/mysqlbin. 20G /var/lib/mysql/ibdata1 步骤3：清理空间 清理binlog： 查看binlog SHOW BINARY LOGS; 删除7天前的binlog PURGE BINARY LOGS BEFORE DATESUB(NOW(), INTERVAL 7 DAY); 或删除指定binlog之前的所有binlog PURGE BINARY LOGS TO 'mysqlbin.000100'; 配置自动清理 SET GLOBAL expirelogsdays = 7; 清理慢查询日志： 备份后清空 cp /var/lib/mysql/slow.log /backup/slow.log.bak &gt; /var/lib/mysql/slow.log 清理临时文件： 清理/tmp目录 rm f /tmp/mysql 28.7 死锁故障排查 ⭐⭐⭐⭐⭐ 28.7.1 问题现象 应用报错：Deadlock found when trying to get lock 28.7.2 排查步骤 步骤1：查看死锁信息 SHOW ENGINE INNODB STATUS\\G 查找LATEST DETECTED DEADLOCK部分 步骤2：分析死锁 (1) TRANSACTION: TRANSACTION 12345, ACTIVE 5 sec starting index read mysql tables in use 1, locked 1 LOCK WAIT 2 lock struct(s), heap size 1136, 1 row lock(s) MySQL thread id 10, OS thread handle 140123456789, query id 100 localhost root updating UPDATE users SET ag"
  },
  {
    "title": "第29章：用户与权限管理",
    "url": "/mysql/08/29.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "08",
    "excerpt": "第29章：用户与权限管理 数据库安全的第一道防线 29.1 用户管理 ⭐⭐⭐⭐⭐ 29.1.1 创建用户 基本语法： CREATE USER 'username'@'host' IDENTIFIED BY 'password'; 示例： 创建本地用户 CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'App@1...",
    "content": "第29章：用户与权限管理 数据库安全的第一道防线 29.1 用户管理 ⭐⭐⭐⭐⭐ 29.1.1 创建用户 基本语法： CREATE USER 'username'@'host' IDENTIFIED BY 'password'; 示例： 创建本地用户 CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'App@123456'; 创建远程用户 CREATE USER 'appuser'@'192.168.1.100' IDENTIFIED BY 'App@123456'; 创建任意主机可访问的用户 CREATE USER 'appuser'@'%' IDENTIFIED BY 'App@123456'; 创建指定网段可访问的用户 CREATE USER 'appuser'@'192.168.1.%' IDENTIFIED BY 'App@123456'; 29.1.2 查看用户 查看所有用户： 查看用户列表 SELECT user, host FROM mysql.user; 查看当前用户 SELECT USER(), CURRENTUSER(); 查看用户详细信息 SELECT FROM mysql.user WHERE user = 'appuser'\\G 29.1.3 修改用户 修改密码： 修改自己的密码 ALTER USER USER() IDENTIFIED BY 'NewPassword@123'; 修改其他用户密码（需要权限） ALTER USER 'appuser'@'localhost' IDENTIFIED BY 'NewPassword@123'; 使用SET PASSWORD（旧方法） SET PASSWORD FOR 'appuser'@'localhost' = PASSWORD('NewPassword@123'); 修改用户名： RENAME USER 'olduser'@'localhost' TO 'newuser'@'localhost'; 29.1.4 删除用户 删除用户： DROP USER 'appuser'@'localhost'; 删除多个用户 DROP USER 'user1'@'localhost', 'user2'@'localhost'; 如果用户不存在不报错 DROP USER IF EXISTS 'appuser'@'localhost'; 29.2 权限管理 ⭐⭐⭐⭐⭐ 29.2.1 权限类型 常用权限： ALL PRIVILEGES ：所有权限 SELECT ：查询权限 INSERT ：插入权限 UPDATE ：更新权限 DELETE ：删除权限 CREATE ：创建数据库/表权限 DROP ：删除数据库/表权限 ALTER ：修改表结构权限 INDEX ：创建/删除索引权限 EXECUTE ：执行存储过程/函数权限 GRANT OPTION ：授权权限 29.2.2 授予权限 全局权限： 授予所有权限 GRANT ALL PRIVILEGES ON . TO 'admin'@'localhost'; 授予特定权限 GRANT SELECT, INSERT, UPDATE ON . TO 'appuser'@'localhost'; 数据库权限： 授予数据库所有权限 GRANT ALL PRIVILEGES ON mydb. TO 'appuser'@'localhost'; 授予数据库特定权限 GRANT SELECT, INSERT, UPDATE, DELETE ON mydb. TO 'appuser'@'localhost'; 表权限： 授予表所有权限 GRANT ALL PRIVILEGES ON mydb.users TO 'appuser'@'localhost'; 授予表特定权限 GRANT SELECT, INSERT ON mydb.users TO 'appuser'@'localhost'; 列权限： 授予列权限 GRANT SELECT (id, name), UPDATE (name) ON mydb.users TO 'appuser'@'localhost'; 存储过程权限： 授予执行存储过程权限 GRANT EXECUTE ON PROCEDURE mydb.spgetuser TO 'appuser'@'localhost'; 授权并允许转授： WITH GRANT OPTION：允许用户将权限授予其他用户 GRANT SELECT, INSERT ON mydb. TO 'appuser'@'localhost' WITH GRANT OPTION; 29.2.3 查看权限 查看用户权限： 查看当前用户权限 SHOW GRANTS; 查看指定用户权限 SHOW GRANTS FOR 'appuser'@'localhost'; 查看权限详细信息 SELECT FROM mysql.user WHERE user = 'appuser'\\G SELECT FROM mysql.db WHERE user = 'appuser'\\G SELECT FROM mysql.tablespriv WHERE user = 'appuser'\\G 29.2.4 撤销权限 撤销权限： 撤销所有权限 REVOKE ALL PRIVILEGES ON . FROM 'appuser'@'localhost'; 撤销特定权限 REVOKE INSERT, UPDATE ON mydb. FROM 'appuser'@'localhost'; 撤销表权限 REVOKE SELECT ON mydb.users FROM 'appuser'@'localhost'; 29.2.5 刷新权限 刷新权限： 刷新权限（使权限立即生效） FLUSH PRIVILEGES; 注意：使用GRANT/REVOKE会自动刷新，直接修改mysql.user表需要手动刷新 29.3 角色管理（MySQL 8.0+）⭐⭐⭐⭐ 29.3.1 创建角色 创建角色： 创建角色 CREATE ROLE 'appread', 'appwrite', 'appadmin'; 授予角色权限 GRANT SELECT ON mydb. TO 'appread'; GRANT INSERT, UPDATE, DELETE ON mydb. TO 'appwrite'; GRANT ALL PRIVILEGES ON mydb. TO 'appadmin'; 29.3.2 分配角色 分配角色给用户： 创建用户 CREATE USER 'user1'@'localhost' IDENTIFIED BY 'Password@123'; 分配角色 GRANT 'appread' TO 'user1'@'localhost'; 分配多个角色 GRANT 'appread', 'appwrite' TO 'user1'@'localhost'; 激活角色（重要） SET DEFAULT ROLE ALL TO 'user1'@'localhost'; 29.3.3 查看角色 查看角色： 查看所有角色 SELECT user, host FROM mysql.user WHERE accountlocked = 'Y'; 查看用户的角色 SHOW GRANTS FOR 'user1'@'localhost'; 查看角色的权限 SHOW GRANTS FOR 'appread'; 29.3.4 删除角色 删除角色： 撤销用户的角色 REVOKE 'appread' FROM 'user1'@'localhost'; 删除角色 DROP ROLE 'appread'; 29.4 权限最佳实践 29.4.1 最小权限原则 原则： 只授予必要的权限 不要使用root用户 不要授予ALL PRIVILEGES 示例： ❌ 不推荐：授予所有权限 GRANT ALL PRIVILEGES ON . TO 'appuser'@'%'; ✅ 推荐：只授予必要权限 GRANT SELECT, INSERT, UPDATE, DELETE ON mydb. TO 'appuser'@'192.168.1.%'; 29.4.2 用户分类 只读用户： CREATE USER 'readonly'@'%' IDENTIFIED BY 'ReadOnly@123'; GRANT SELECT ON mydb. TO 'readonly'@'%'; 读写用户： CREATE USER 'readwrite'@'192.168.1.%' IDENTIFIED BY 'ReadWrite@123'; GRANT SELECT, INSERT, UPDATE, DELETE ON mydb. TO 'readwrite'@'192.168.1.%'; 管理员用户： CREATE USER 'admin'@'localhost' IDENTIFIED BY 'Admin@123'; GRANT ALL PRIVILEGES ON mydb. TO 'admin'@'localhost'; 备份用户： CREATE USER 'backup'@'localhost' IDENTIFIED BY 'Backup@123'; GRANT SELECT, LOCK TABLES, SHOW VIEW, EVENT, TRIGG"
  },
  {
    "title": "第30章：MySQL安全加固",
    "url": "/mysql/08/30.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "08",
    "excerpt": "第30章：MySQL安全加固 构建安全的数据库环境 30.1 安全加固概述 30.1.1 安全威胁 常见威胁： SQL注入攻击 暴力破解 权限滥用 数据泄露 拒绝服务攻击（DoS） 30.2 账户安全 ⭐⭐⭐⭐⭐ 30.2.1 删除默认账户 删除匿名用户和测试数据库： 查看所有用户 SELECT user, host FROM mysql.user; 删除匿...",
    "content": "第30章：MySQL安全加固 构建安全的数据库环境 30.1 安全加固概述 30.1.1 安全威胁 常见威胁： SQL注入攻击 暴力破解 权限滥用 数据泄露 拒绝服务攻击（DoS） 30.2 账户安全 ⭐⭐⭐⭐⭐ 30.2.1 删除默认账户 删除匿名用户和测试数据库： 查看所有用户 SELECT user, host FROM mysql.user; 删除匿名用户 DELETE FROM mysql.user WHERE user = ''; 删除test数据库 DROP DATABASE IF EXISTS test; 刷新权限 FLUSH PRIVILEGES; 30.2.2 禁用root远程登录 只允许root本地登录： 查看root用户 SELECT user, host FROM mysql.user WHERE user = 'root'; 删除root远程登录 DELETE FROM mysql.user WHERE user = 'root' AND host != 'localhost'; 或修改root只能本地登录 UPDATE mysql.user SET host = 'localhost' WHERE user = 'root'; FLUSH PRIVILEGES; 30.2.3 强密码策略 配置密码策略： my.cnf [mysqld] 密码验证插件 validatepassword.policy = STRONG validatepassword.length = 12 validatepassword.mixedcasecount = 1 validatepassword.numbercount = 1 validatepassword.specialcharcount = 1 密码过期 defaultpasswordlifetime = 90 密码重用限制 passwordhistory = 5 passwordreuseinterval = 365 修改用户密码： 设置密码过期 ALTER USER 'appuser'@'localhost' PASSWORD EXPIRE INTERVAL 90 DAY; 设置密码历史 ALTER USER 'appuser'@'localhost' PASSWORD HISTORY 5; 设置密码重用间隔 ALTER USER 'appuser'@'localhost' PASSWORD REUSE INTERVAL 365 DAY; 30.2.4 限制登录失败次数 配置登录失败锁定： MySQL 8.0.19+ ALTER USER 'appuser'@'localhost' FAILEDLOGINATTEMPTS 3 PASSWORDLOCKTIME 1; 锁定1天 解锁用户 ALTER USER 'appuser'@'localhost' ACCOUNT UNLOCK; 30.3 网络安全 ⭐⭐⭐⭐⭐ 30.3.1 绑定IP地址 只监听内网IP： my.cnf [mysqld] bindaddress = 192.168.1.10 或只监听本地 bindaddress = 127.0.0.1 30.3.2 修改默认端口 修改默认端口（3306）： my.cnf [mysqld] port = 13306 30.3.3 防火墙配置 配置防火墙： CentOS/RHEL 只允许指定IP访问MySQL firewallcmd permanent addrichrule='rule family=&quot;ipv4&quot; source address=&quot;192.168.1.0/24&quot; port protocol=&quot;tcp&quot; port=&quot;3306&quot; accept' firewallcmd reload Ubuntu 只允许指定IP访问MySQL ufw allow from 192.168.1.0/24 to any port 3306 ufw enable 30.4 SSL/TLS加密 ⭐⭐⭐⭐ 30.4.1 生成SSL证书 生成证书： 使用mysqlsslrsasetup生成证书（MySQL 5.7+） mysqlsslrsasetup datadir=/var/lib/mysql 查看生成的证书 ls l /var/lib/mysql/.pem ca.pem：CA证书 servercert.pem：服务器证书 serverkey.pem：服务器私钥 clientcert.pem：客户端证书 clientkey.pem：客户端私钥 30.4.2 配置SSL 服务器配置： my.cnf [mysqld] sslca = /var/lib/mysql/ca.pem sslcert = /var/lib/mysql/servercert.pem sslkey = /var/lib/mysql/serverkey.pem 要求所有连接使用SSL requiresecuretransport = ON 查看SSL状态： 查看SSL变量 SHOW VARIABLES LIKE '%ssl%'; 查看当前连接是否使用SSL SHOW STATUS LIKE 'Sslcipher'; 30.4.3 要求用户使用SSL 创建要求SSL的用户： 创建用户并要求SSL CREATE USER 'secureuser'@'%' IDENTIFIED BY 'Password@123' REQUIRE SSL; 修改现有用户要求SSL ALTER USER 'appuser'@'%' REQUIRE SSL; 要求X509证书 ALTER USER 'appuser'@'%' REQUIRE X509; 客户端连接： 使用SSL连接 mysql u secureuser p \\ sslca=/path/to/ca.pem \\ sslcert=/path/to/clientcert.pem \\ sslkey=/path/to/clientkey.pem 30.5 审计日志 ⭐⭐⭐⭐ 30.5.1 开启审计日志 使用auditlog插件（MySQL Enterprise）： 安装插件 INSTALL PLUGIN auditlog SONAME 'auditlog.so'; 配置 SET GLOBAL auditlogpolicy = ALL; SET GLOBAL auditlogformat = JSON; 使用generallog（不推荐生产环境）： 开启generallog SET GLOBAL generallog = ON; SET GLOBAL generallogfile = '/var/log/mysql/general.log'; 查看日志 tail f /var/log/mysql/general.log 30.5.2 监控可疑活动 监控登录失败： 查看错误日志中的登录失败 grep &quot;Access denied&quot; /var/log/mysql/error.log 30.6 数据加密 ⭐⭐⭐⭐ 30.6.1 表空间加密 开启表空间加密（MySQL 5.7+）： 创建加密表 CREATE TABLE sensitivedata ( id INT PRIMARY KEY, creditcard VARCHAR(100) ) ENCRYPTION = 'Y'; 修改现有表为加密表 ALTER TABLE users ENCRYPTION = 'Y'; 配置加密密钥： my.cnf [mysqld] earlypluginload = keyringfile.so keyringfiledata = /var/lib/mysqlkeyring/keyring 30.6.2 binlog加密 开启binlog加密（MySQL 8.0.14+）： SET GLOBAL binlogencryption = ON; 30.7 SQL注入防护 ⭐⭐⭐⭐⭐ 30.7.1 使用预处理语句 预处理语句（推荐）： ✅ 使用预处理语句（安全） PREPARE stmt FROM 'SELECT FROM users WHERE id = ?'; SET @id = 1; EXECUTE stmt USING @id; 应用程序中使用参数化查询 Java: PreparedStatement Python: cursor.execute(&quot;SELECT FROM users WHERE id = %s&quot;, (userid,)) PHP: $stmt&gt;bindparam(&quot;i&quot;, $userid); 避免拼接SQL： ❌ 不安全：SQL拼接 SELECT FROM users WHERE name = 'admin' OR '1'='1'; ✅ 安全：预处理语句 PREPARE stmt FROM 'SELECT FROM users WHERE name = ?'; 30.8 安全配置清单 30.8.1 my.cnf安全配置 推荐配置： [mysqld] 1. 网络安全 bindaddress = 192.168.1.10 port = 13306 2. SSL/TLS sslca = /var/lib/mysql/ca.pem sslcert = /var/lib/mysql/"
  },
  {
    "title": "第31章：企业级实战案例",
    "url": "/mysql/09/31.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "09",
    "excerpt": "第31章：企业级实战案例 从理论到实践的跨越 31.1 电商系统数据库设计 31.1.1 业务需求 系统规模： 用户：1000万+ 商品：100万+ 订单：1亿+ QPS：10000+ 31.1.2 数据库设计 用户表： CREATE TABLE users ( id BIGINT PRIMARY KEY AUTOINCREMENT, username VA...",
    "content": "第31章：企业级实战案例 从理论到实践的跨越 31.1 电商系统数据库设计 31.1.1 业务需求 系统规模： 用户：1000万+ 商品：100万+ 订单：1亿+ QPS：10000+ 31.1.2 数据库设计 用户表： CREATE TABLE users ( id BIGINT PRIMARY KEY AUTOINCREMENT, username VARCHAR(50) NOT NULL UNIQUE, password VARCHAR(100) NOT NULL, email VARCHAR(100), phone VARCHAR(20), status TINYINT DEFAULT 1 COMMENT '1:正常 0:禁用', createtime DATETIME DEFAULT CURRENTTIMESTAMP, updatetime DATETIME DEFAULT CURRENTTIMESTAMP ON UPDATE CURRENTTIMESTAMP, INDEX idxphone (phone), INDEX idxemail (email) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 商品表： CREATE TABLE products ( id BIGINT PRIMARY KEY AUTOINCREMENT, name VARCHAR(200) NOT NULL, categoryid INT NOT NULL, price DECIMAL(10,2) NOT NULL, stock INT NOT NULL DEFAULT 0, sales INT NOT NULL DEFAULT 0, status TINYINT DEFAULT 1, createtime DATETIME DEFAULT CURRENTTIMESTAMP, updatetime DATETIME DEFAULT CURRENTTIMESTAMP ON UPDATE CURRENTTIMESTAMP, INDEX idxcategory (categoryid), INDEX idxprice (price), INDEX idxsales (sales) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 订单表（分区）： CREATE TABLE orders ( id BIGINT NOT NULL, userid BIGINT NOT NULL, totalamount DECIMAL(10,2) NOT NULL, status TINYINT DEFAULT 0 COMMENT '0:待支付 1:已支付 2:已发货 3:已完成', createtime DATETIME NOT NULL, updatetime DATETIME DEFAULT CURRENTTIMESTAMP ON UPDATE CURRENTTIMESTAMP, PRIMARY KEY (id, createtime), INDEX idxuserid (userid), INDEX idxstatus (status) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 PARTITION BY RANGE (YEAR(createtime)) ( PARTITION p2022 VALUES LESS THAN (2023), PARTITION p2023 VALUES LESS THAN (2024), PARTITION p2024 VALUES LESS THAN (2025), PARTITION pmax VALUES LESS THAN MAXVALUE ); 订单详情表： CREATE TABLE orderitems ( id BIGINT PRIMARY KEY AUTOINCREMENT, orderid BIGINT NOT NULL, productid BIGINT NOT NULL, quantity INT NOT NULL, price DECIMAL(10,2) NOT NULL, INDEX idxorderid (orderid), INDEX idxproductid (productid) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 31.1.3 高并发秒杀设计 秒杀商品表： CREATE TABLE seckillproducts ( id BIGINT PRIMARY KEY, productid BIGINT NOT NULL, stock INT NOT NULL, starttime DATETIME NOT NULL, endtime DATETIME NOT NULL, version INT NOT NULL DEFAULT 0 COMMENT '乐观锁版本号', INDEX idxproductid (productid) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 秒杀订单表： CREATE TABLE seckillorders ( id BIGINT PRIMARY KEY AUTOINCREMENT, userid BIGINT NOT NULL, productid BIGINT NOT NULL, createtime DATETIME DEFAULT CURRENTTIMESTAMP, UNIQUE KEY ukuserproduct (userid, productid) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 秒杀逻辑（乐观锁）： 1. 检查库存 SELECT stock, version FROM seckillproducts WHERE id = 1; 2. 扣减库存（乐观锁） UPDATE seckillproducts SET stock = stock 1, version = version + 1 WHERE id = 1 AND stock &gt; 0 AND version = @oldversion; 3. 创建订单 INSERT INTO seckillorders (userid, productid) VALUES (123, 1); 31.2 社交平台数据库设计 31.2.1 用户关系表 关注表： CREATE TABLE userfollows ( id BIGINT PRIMARY KEY AUTOINCREMENT, userid BIGINT NOT NULL COMMENT '关注者', followuserid BIGINT NOT NULL COMMENT '被关注者', createtime DATETIME DEFAULT CURRENTTIMESTAMP, UNIQUE KEY ukuserfollow (userid, followuserid), INDEX idxfollowuser (followuserid) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 查询粉丝数： SELECT COUNT() FROM userfollows WHERE followuserid = 123; 查询关注数： SELECT COUNT() FROM userfollows WHERE userid = 123; 31.2.2 动态表（分表） 动态表（按用户ID哈希分表）： posts0, posts1, posts2, posts3 CREATE TABLE posts0 ( id BIGINT PRIMARY KEY AUTOINCREMENT, userid BIGINT NOT NULL, content TEXT NOT NULL, likecount INT DEFAULT 0, commentcount INT DEFAULT 0, createtime DATETIME DEFAULT CURRENTTIMESTAMP, INDEX idxuserid (userid), INDEX idxcreatetime (createtime) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 分表规则：userid % 4 userid = 123 → 123 % 4 = 3 → posts3 31.2.3 评论表 评论表： CREATE TABLE comments ( id BIGINT PRIMARY KEY AUTOINCREMENT, postid BIGINT NOT NULL, userid BIGINT NOT NULL, content TEXT NOT NULL, parentid BIGINT DEFAULT 0 COMMENT '父评论ID，0表示一级评论', createtime DATETIME DEFAULT CURRENTTIMESTAMP, INDEX idxpostid (postid), INDEX idxparentid (parentid) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 31.3 金融系统数据库设计 31.3.1 账户表 账户表： CREATE TABLE a"
  },
  {
    "title": "第32章：MySQL面试题精选",
    "url": "/mysql/09/32.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "09",
    "excerpt": "第32章：MySQL面试题精选 面试必备知识点汇总 32.1 基础知识 32.1.1 MySQL架构 Q1：MySQL的架构分为哪几层？ A：MySQL架构分为4层： 1. 连接层：处理客户端连接、认证 2. 服务层：SQL解析、优化、缓存 3. 引擎层：存储引擎（InnoDB、MyISAM等） 4. 存储层：数据存储在磁盘 Q2：InnoDB和MyISAM...",
    "content": "第32章：MySQL面试题精选 面试必备知识点汇总 32.1 基础知识 32.1.1 MySQL架构 Q1：MySQL的架构分为哪几层？ A：MySQL架构分为4层： 1. 连接层：处理客户端连接、认证 2. 服务层：SQL解析、优化、缓存 3. 引擎层：存储引擎（InnoDB、MyISAM等） 4. 存储层：数据存储在磁盘 Q2：InnoDB和MyISAM的区别？ A：主要区别： 1. 事务：InnoDB支持，MyISAM不支持 2. 锁：InnoDB行锁，MyISAM表锁 3. 外键：InnoDB支持，MyISAM不支持 4. 崩溃恢复：InnoDB支持，MyISAM不支持 5. MVCC：InnoDB支持，MyISAM不支持 6. 性能：InnoDB适合写多，MyISAM适合读多 推荐：统一使用InnoDB 32.2 索引相关 32.2.1 索引基础 Q3：什么是索引？有什么作用？ A：索引是帮助MySQL高效获取数据的数据结构。 作用： 1. 加快查询速度 2. 减少磁盘I/O 3. 加速排序和分组 缺点： 占用空间 降低写入性能 需要维护 Q4：MySQL索引使用什么数据结构？为什么？ A：B+树 原因： B+树高度低（34层），减少磁盘I/O 叶子节点存储所有数据，范围查询效率高 叶子节点有指针，支持顺序访问 非叶子节点只存储索引，可以存储更多索引 为什么不用B树？ B树非叶子节点也存储数据，树高更高 为什么不用哈希？ 哈希不支持范围查询 为什么不用红黑树？ 红黑树高度高，磁盘I/O多 Q5：什么是聚簇索引和非聚簇索引？ A： 聚簇索引（Clustered Index）： 索引和数据存储在一起 InnoDB的主键索引是聚簇索引 一个表只有一个聚簇索引 非聚簇索引（Secondary Index）： 索引和数据分开存储 叶子节点存储主键值 需要回表查询 回表：通过非聚簇索引查到主键，再通过主键查数据 Q6：什么是覆盖索引？ A：查询的列都在索引中，不需要回表。 示例： CREATE INDEX idxnameage ON users(name, age); SELECT name, age FROM users WHERE name = '张三'; 覆盖索引，不需要回表 SELECT name, age, email FROM users WHERE name = '张三'; 需要回表 Q7：什么是最左前缀原则？ A：复合索引从最左边开始匹配。 示例： CREATE INDEX idxabc ON table(a, b, c); ✅ 可以使用索引： WHERE a = 1 WHERE a = 1 AND b = 2 WHERE a = 1 AND b = 2 AND c = 3 ❌ 不能使用索引： WHERE b = 2 WHERE c = 3 WHERE b = 2 AND c = 3 32.2.2 索引失效 Q8：哪些情况会导致索引失效？ A： 1. 在索引列上使用函数 WHERE YEAR(createtime) = 2024 ❌ WHERE createtime &gt;= '20240101' AND createtime &lt; '20250101' ✅ 隐式类型转换 WHERE phone = 123456789 ❌（phone是VARCHAR） WHERE phone = '123456789' ✅ LIKE以%开头 WHERE name LIKE '%张%' ❌ WHERE name LIKE '张%' ✅ OR条件（其中一个列没有索引） WHERE name = '张三' OR age = 18 ❌（age没有索引） 不等于（!=、&lt;&gt;） WHERE status != 1 ❌ IS NULL / IS NOT NULL（视情况） WHERE name IS NULL ❌（可能失效） NOT IN、NOT EXISTS WHERE id NOT IN (1, 2, 3) ❌ 32.3 事务相关 32.3.1 事务基础 Q9：什么是事务？ACID是什么？ A：事务是一组SQL操作，要么全部成功，要么全部失败。 ACID： Atomicity（原子性）：事务不可分割 Consistency（一致性）：事务前后数据一致 Isolation（隔离性）：事务之间互不影响 Durability（持久性）：事务提交后永久保存 Q10：MySQL的事务隔离级别有哪些？ A：4个隔离级别（从低到高）： READ UNCOMMITTED（读未提交） 可以读到未提交的数据 问题：脏读、不可重复读、幻读 READ COMMITTED（读已提交） 只能读到已提交的数据 问题：不可重复读、幻读 Oracle默认 REPEATABLE READ（可重复读） 同一事务中多次读取结果一致 问题：幻读（InnoDB通过MVCC+间隙锁解决） MySQL默认 ✅ SERIALIZABLE（串行化） 最高隔离级别，完全串行执行 问题：性能差 推荐：REPEATABLE READ Q11：什么是脏读、不可重复读、幻读？ A： 脏读（Dirty Read）： 读到其他事务未提交的数据 示例：事务A修改但未提交，事务B读到了修改后的数据 不可重复读（NonRepeatable Read）： 同一事务中多次读取结果不一致 示例：事务A读取两次，中间事务B修改并提交，两次结果不同 幻读（Phantom Read）： 同一事务中多次查询，记录数不一致 示例：事务A查询两次，中间事务B插入新记录，第二次多了记录 Q12：什么是MVCC？ A：MVCC（MultiVersion Concurrency Control）多版本并发控制 原理： 每行记录有两个隐藏列：trxid（事务ID）、rollpointer（回滚指针） 每次修改生成新版本，旧版本通过undo log保存 读取时根据事务ID判断可见性 优点： 读不加锁，提高并发性能 解决不可重复读问题 InnoDB通过MVCC+间隙锁解决幻读 32.4 锁相关 32.4.1 锁类型 Q13：MySQL有哪些锁？ A： 按粒度分： 1. 表锁：锁整个表（MyISAM） 2. 行锁：锁单行（InnoDB） 3. 间隙锁：锁范围（InnoDB） 按类型分： 共享锁（S锁）：读锁，多个事务可以同时持有 排他锁（X锁）：写锁，只有一个事务可以持有 按算法分： Record Lock：记录锁 Gap Lock：间隙锁 NextKey Lock：记录锁+间隙锁 Q14：什么是死锁？如何避免？ A： 死锁：两个或多个事务互相等待对方释放锁。 示例： 事务A：锁住行1，等待行2 事务B：锁住行2，等待行1 避免方法： 按相同顺序访问资源 减少锁持有时间 使用乐观锁 降低隔离级别 设置锁等待超时：innodblockwaittimeout 32.5 性能优化 32.5.1 SQL优化 Q15：如何优化慢查询？ A： 1. 分析执行计划（EXPLAIN） 2. 添加索引 3. 避免SELECT 4. 避免索引失效 5. 优化JOIN 6. 分页优化 7. 使用覆盖索引 8. 避免子查询，改用JOIN Q16：如何优化深分页？ A： 问题SQL： SELECT FROM orders ORDER BY id LIMIT 1000000, 10; 优化方案： 子查询优化 SELECT FROM orders WHERE id &gt;= (SELECT id FROM orders ORDER BY id LIMIT 1000000, 1) LIMIT 10; 延迟关联 SELECT o. FROM orders o INNER JOIN (SELECT id FROM orders ORDER BY id LIMIT 1000000, 10) t ON o.id = t.id ; 记录上次最大ID SELECT FROM orders WHERE id &gt; @lastid ORDER BY id LIMIT 10; 32.5.2 参数优化 Q17：重要的MySQL参数有哪些？ A： 1. innodbbufferpoolsize：缓冲池大小（5070%内存） 2. innodblogfilesize：redo log大小 3. innodbflushlogattrxcommit：刷盘策略（1:最安全，2:性能好） 4. syncbinlog：binlog刷盘策略 5. maxconnections：最大连接数 6. querycachesize：查询缓存（MySQL 8.0已移除） 32.6 高可用 32.6.1 主从复制 Q18：MySQL主从复制原理？ A： 1. 主库写入binlog 2. 从库I/O线程读取binlog，写入relay log 3. 从库SQL线程执行relay log 三个线程： 主库：binlog dump线程 从库：I/O线程、SQL线程 Q19：主从延迟如何解决？ A： 原因： 1. 从库性能差 2. 主库写入量大 3. 大事务 4. 网络延迟 解决方案： 升级从库硬件 并行复制（MySQL 5.7+） 拆分大事务 读写分离，读从库时容忍延迟 重要查询读主库 32.7 实战问题 Q20：如何设计秒杀系统？ A： 1. 数据库层面： 使用乐观锁（version字段） 减库存SQL：UPDATE ... WHERE stock &gt; 0 AND version = @oldversion 缓存层"
  },
  {
    "title": "第33章：疑难问题解决方案",
    "url": "/mysql/09/33.html",
    "type": "tutorial",
    "priority": 60,
    "series": "MySQL教程",
    "seriesSlug": "mysql",
    "group": "09",
    "excerpt": "第33章：疑难问题解决方案 常见问题的终极解决方案 33.1 性能问题 33.1.1 查询突然变慢 问题现象： 原本很快的查询突然变慢 排查步骤： 1. 查看是否有锁等待 SHOW PROCESSLIST; 2. 查看是否有慢查询 SELECT FROM informationschema.PROCESSLIST WHERE TIME &gt; 10; 3....",
    "content": "第33章：疑难问题解决方案 常见问题的终极解决方案 33.1 性能问题 33.1.1 查询突然变慢 问题现象： 原本很快的查询突然变慢 排查步骤： 1. 查看是否有锁等待 SHOW PROCESSLIST; 2. 查看是否有慢查询 SELECT FROM informationschema.PROCESSLIST WHERE TIME &gt; 10; 3. 查看表统计信息是否过期 SHOW TABLE STATUS LIKE 'users'; 4. 分析执行计划 EXPLAIN SELECT FROM users WHERE age &gt; 18; 解决方案： 1. 更新统计信息 ANALYZE TABLE users; 2. 重建索引 ALTER TABLE users DROP INDEX idxage, ADD INDEX idxage(age); 3. 优化表 OPTIMIZE TABLE users; 4. 检查是否需要添加索引 CREATE INDEX idxage ON users(age); 33.1.2 Buffer Pool命中率低 问题现象： Buffer Pool命中率&lt;90%，性能差 排查： 查看Buffer Pool命中率 SHOW STATUS LIKE 'Innodbbufferpoolread%'; 计算命中率 命中率 = (Innodbbufferpoolreadrequests Innodbbufferpoolreads) / Innodbbufferpoolreadrequests 100% 解决方案： 增加Buffer Pool大小（5070%内存） SET GLOBAL innodbbufferpoolsize = 8G; 或修改配置文件 [mysqld] innodbbufferpoolsize = 8G innodbbufferpoolinstances = 8 33.1.3 临时表过多 问题现象： Createdtmpdisktables很高 排查： 查看临时表统计 SHOW STATUS LIKE 'Createdtmp%'; Createdtmptables：内存临时表 Createdtmpdisktables：磁盘临时表（慢） 解决方案： 1. 增加临时表大小 SET GLOBAL tmptablesize = 64M; SET GLOBAL maxheaptablesize = 64M; 2. 优化SQL，避免临时表 ❌ 使用DISTINCT SELECT DISTINCT name FROM users; ✅ 使用GROUP BY SELECT name FROM users GROUP BY name; 3. 添加索引 CREATE INDEX idxname ON users(name); 33.2 数据问题 33.2.1 主键冲突 问题现象： ERROR 1062 (23000): Duplicate entry '1' for key 'PRIMARY' 原因： 1. 手动插入了主键值 2. 自增值被重置 3. 主从复制导致 解决方案： 1. 查看当前自增值 SHOW CREATE TABLE users; 2. 修改自增值 ALTER TABLE users AUTOINCREMENT = 1000; 3. 查找最大ID SELECT MAX(id) FROM users; 4. 设置自增值为最大ID+1 ALTER TABLE users AUTOINCREMENT = (SELECT MAX(id) + 1 FROM users); 33.2.2 数据不一致 问题现象： 主从数据不一致 排查： 使用pttablechecksum检查 pttablechecksum \\ host=masterhost \\ user=root \\ password=password \\ databases=mydb 解决方案： 使用pttablesync同步 pttablesync \\ execute \\ synctomaster \\ h=slavehost,D=mydb,t=users 33.2.3 误删除数据 问题现象： DELETE语句误删除了数据 解决方案： 1. 立即停止应用，防止继续写入 2. 使用binlog恢复 找到误删除之前的binlog位置 mysqlbinlog startdatetime=&quot;20241110 09:00:00&quot; stopdatetime=&quot;20241110 09:59:59&quot; /var/lib/mysql/mysqlbin.000010 &gt; recover.sql 3. 过滤掉DELETE语句 grep v &quot;DELETE FROM users&quot; recover.sql &gt; recoverfiltered.sql 4. 恢复数据 mysql u root p mydb &lt; recoverfiltered.sql 5. 验证数据 SELECT COUNT() FROM users; 33.3 连接问题 33.3.1 连接数耗尽 问题现象： ERROR 1040 (HY000): Too many connections 排查： 查看当前连接数 SHOW STATUS LIKE 'Threadsconnected'; 查看最大连接数 SHOW VARIABLES LIKE 'maxconnections'; 查看连接来源 SELECT USER, HOST, COUNT() FROM informationschema.PROCESSLIST GROUP BY USER, HOST; 解决方案： 1. 临时增加最大连接数 SET GLOBAL maxconnections = 1000; 2. 杀死空闲连接 SELECT CONCAT('KILL ', id, ';') FROM informationschema.PROCESSLIST WHERE COMMAND = 'Sleep' AND TIME &gt; 600; 3. 设置超时时间 SET GLOBAL waittimeout = 600; SET GLOBAL interactivetimeout = 600; 4. 应用层使用连接池 33.3.2 连接超时 问题现象： ERROR 2013 (HY000): Lost connection to MySQL server during query 原因： 1. 网络问题 2. 查询时间过长 3. maxallowedpacket太小 解决方案： 1. 增加超时时间 SET GLOBAL waittimeout = 28800; SET GLOBAL interactivetimeout = 28800; 2. 增加maxallowedpacket SET GLOBAL maxallowedpacket = 64M; 3. 优化慢查询 33.4 复制问题 33.4.1 主从延迟 问题现象： SecondsBehindMaster &gt; 10 排查： 查看主从状态 SHOW SLAVE STATUS\\G 关注字段： SecondsBehindMaster：延迟秒数 SlaveSQLRunningState：SQL线程状态 解决方案： 1. 开启并行复制（MySQL 5.7+） STOP SLAVE; SET GLOBAL slaveparalleltype = 'LOGICALCLOCK'; SET GLOBAL slaveparallelworkers = 4; START SLAVE; 2. 升级从库硬件 3. 拆分大事务 4. 优化慢查询 33.4.2 复制中断 问题现象： SlaveIORunning: No 或 SlaveSQLRunning: No 排查： SHOW SLAVE STATUS\\G 查看错误信息： LastIOError LastSQLError 解决方案： 1. 跳过错误（谨慎使用） STOP SLAVE; SET GLOBAL sqlslaveskipcounter = 1; START SLAVE; 2. 重新搭建主从 主库备份 mysqldump u root p singletransaction masterdata=2 alldatabases &gt; backup.sql 从库导入 mysql u root p &lt; backup.sql 配置复制 CHANGE MASTER TO ...; START SLAVE; 33.5 磁盘问题 33.5.1 磁盘空间满 问题现象： ERROR 3 (HY000): Error writing file (Errcode: 28 No space left on device) 排查： 查看磁盘空间 df h 查看MySQL数据目录大小 du sh /var/lib/mysql/ 解决方案： 1. 清理binlog PURGE BINARY LOGS BEFORE DATESUB(NOW(), INTERVAL 7 DAY); 2. 清理慢查询日志 &gt; /var/lib/mysql/slow.log 3. 删除旧分区 ALTER TABLE orders DROP PARTITION p2021; 4. 优化表 OPTIMIZE TABLE users; 33.5."
  },
  {
    "title": "第1章：Spring Boot 4 简介",
    "url": "/springboot4/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E6_A6_82_E8_A7_88/1-springboot4.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Spring Boot 4教程",
    "seriesSlug": "springboot4",
    "group": "第一部分-_概览",
    "excerpt": "第1章：Spring Boot 4 简介 1.1 Spring Boot 4 发布背景 发布时间与版本信息 正式发布 : 2024年11月（预计） 当前版本 : 4.0.0 Spring Framework 版本 : 7.0.x 最低 JDK 要求 : Java 21 为什么需要 Spring Boot 4？ Spring Boot 4 的发布主要是为了： ...",
    "content": "第1章：Spring Boot 4 简介 1.1 Spring Boot 4 发布背景 发布时间与版本信息 正式发布 : 2024年11月（预计） 当前版本 : 4.0.0 Spring Framework 版本 : 7.0.x 最低 JDK 要求 : Java 21 为什么需要 Spring Boot 4？ Spring Boot 4 的发布主要是为了： 拥抱 Java 21 新特性 虚拟线程（Virtual Threads / Project Loom） Record 模式匹配 结构化并发 字符串模板（预览） 提升云原生能力 更好的 GraalVM 原生镜像支持 更快的启动时间 更小的内存占用 容器化优化 增强可观察性 统一的观察性 API 原生的分布式追踪 更丰富的指标收集 简化开发体验 更简洁的配置 更强大的自动配置 更好的开发工具支持 1.2 主要新特性一览 🔥 核心新特性 1. 虚拟线程（Virtual Threads）支持 // Spring Boot 4 自动配置虚拟线程 @SpringBootApplication public class VirtualThreadsApplication { public static void main(String[] args) { SpringApplication.run(VirtualThreadsApplication.class, args); } } 配置文件 : application.yml spring: threads: virtual: enabled: true 启用虚拟线程 2. HTTP Interface 客户端 // 声明式 HTTP 客户端（类似 Feign） public interface UserClient { @GetExchange(&quot;/users/{id}&quot;) User getUser(@PathVariable Long id); @PostExchange(&amp;quot;/users&amp;quot;) User createUser(@RequestBody User user); } 3. Problem Details (RFC 7807) 支持 // 标准化的错误响应 @RestControllerAdvice public class GlobalExceptionHandler { @ExceptionHandler(ResourceNotFoundException.class) ProblemDetail handleNotFound(ResourceNotFoundException ex) { ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail( HttpStatus.NOTFOUND, ex.getMessage() ); problemDetail.setTitle(&quot;Resource Not Found&quot;); problemDetail.setProperty(&quot;timestamp&quot;, Instant.now()); return problemDetail; } } 4. 原生镜像（Native Image）改进 更简单的原生镜像构建 ./mvnw Pnative native:compile 启动时间对比 JVM 模式: 23 秒 Native 模式: 0.05 秒（快 4060 倍） 5. 观察性（Observability）增强 // 自动化的追踪和指标 @RestController public class OrderController { @GetMapping(&quot;/orders/{id}&quot;) @Observed(name = &quot;orders.get&quot;) // 自动生成指标和追踪 public Order getOrder(@PathVariable Long id) { return orderService.findById(id); } } 📊 版本依赖升级 组件 Spring Boot 3.x Spring Boot 4.0 Spring Framework 6.x 7.0 Java 最低版本 17 21 Jakarta EE 9.x/10.x 10.x Hibernate 6.1.x 6.4+ Tomcat 10.1.x 11.0.x Jetty 11.x 12.x Micrometer 1.12.x 1.13+ Spring Security 6.x 7.0 Spring Data 3.x 4.0 1.3 升级路径与兼容性 兼容性矩阵 ✅ 完全兼容 大部分 Spring Boot 3.2+ 的应用可以平滑升级 配置文件格式保持兼容 核心注解和 API 保持稳定 ⚠️ 需要调整 使用了废弃 API 的代码 自定义的自动配置类 某些第三方库可能需要升级 ❌ 不兼容 Java 17 以下版本 某些已移除的废弃功能 部分过时的配置属性 升级决策树 是否使用 Java 21？ ├─ 是 → 可以升级到 Spring Boot 4 │ └─ 是否需要虚拟线程？ │ ├─ 是 → 强烈推荐升级 │ └─ 否 → 评估其他新特性价值 └─ 否 → 暂时保持 Spring Boot 3 └─ 计划升级 Java 版本 1.4 开发环境准备 1.4.1 安装 JDK 21 Windows 使用 SDKMAN（推荐） sdk install java 21tem 或下载 Oracle JDK 21 https://www.oracle.com/java/technologies/downloads/java21 macOS 使用 Homebrew brew install openjdk@21 或使用 SDKMAN sdk install java 21tem Linux Ubuntu/Debian sudo apt update sudo apt install openjdk21jdk 或使用 SDKMAN sdk install java 21tem 验证安装 : java version 输出应包含: openjdk version &quot;21&quot; 或 java version &quot;21&quot; 1.4.2 配置构建工具 Maven (pom.xml) &lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF8&quot;?&gt; &lt;project xmlns=&quot;http://maven.apache.org/POM/4.0.0&quot; xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchemainstance&quot; xsi:schemaLocation=&quot;http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven4.0.0.xsd&quot;&gt; &lt;modelVersion&gt;4.0.0&lt;/modelVersion&gt; &amp;lt;parent&amp;gt; &amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt; &amp;lt;artifactId&amp;gt;springbootstarterparent&amp;lt;/artifactId&amp;gt; &amp;lt;version&amp;gt;4.0.0&amp;lt;/version&amp;gt; &amp;lt;relativePath/&amp;gt; &amp;lt;/parent&amp;gt; &amp;lt;groupId&amp;gt;com.example&amp;lt;/groupId&amp;gt; &amp;lt;artifactId&amp;gt;springboot4demo&amp;lt;/artifactId&amp;gt; &amp;lt;version&amp;gt;0.0.1SNAPSHOT&amp;lt;/version&amp;gt; &amp;lt;name&amp;gt;springboot4demo&amp;lt;/name&amp;gt; &amp;lt;description&amp;gt;Spring Boot 4 Demo Project&amp;lt;/description&amp;gt; &amp;lt;properties&amp;gt; &amp;lt;java.version&amp;gt;21&amp;lt;/java.version&amp;gt; &amp;lt;/properties&amp;gt; &amp;lt;dependencies&amp;gt; &amp;lt;dependency&amp;gt; &amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt; &amp;lt;artifactId&amp;gt;springbootstart"
  },
  {
    "title": "第2章：Spring Framework 7.0 新特性",
    "url": "/springboot4/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E6_A1_86_E6_9E_B6/2-springframework7.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Spring Boot 4教程",
    "seriesSlug": "springboot4",
    "group": "第二部分-_核心框架",
    "excerpt": "第2章：Spring Framework 7.0 新特性 本章概述 Spring Boot 4 基于 Spring Framework 7.0 构建，后者带来了许多重要的新特性和改进。本章将详细介绍这些新特性，并通过实际案例展示如何使用它们。 本章重点 : ✅ Java 21+ 支持与要求 ✅ Virtual Threads（虚拟线程）深度集成 ✅ Reco...",
    "content": "第2章：Spring Framework 7.0 新特性 本章概述 Spring Boot 4 基于 Spring Framework 7.0 构建，后者带来了许多重要的新特性和改进。本章将详细介绍这些新特性，并通过实际案例展示如何使用它们。 本章重点 : ✅ Java 21+ 支持与要求 ✅ Virtual Threads（虚拟线程）深度集成 ✅ Record 类型的全面支持 ✅ 模式匹配增强 ✅ 与 Spring Boot 3 的核心差异对比 2.1 Java 21+ 支持与要求 2.1.1 为什么选择 Java 21？ Spring Framework 7.0 将 Java 21 作为最低版本要求，主要原因： 特性 说明 对 Spring 的影响 虚拟线程 Project Loom 正式发布 革命性的并发模型 Record 模式匹配 JEP 440 简化数据处理代码 Switch 模式匹配 JEP 441 更强大的控制流 Sequenced Collections JEP 431 更好的集合 API String Templates JEP 430（预览） 更安全的字符串处理 2.1.2 Java 21 新特性在 Spring 中的应用 Sequenced Collections 示例 Spring Boot 3 (Java 17) : @Service public class UserService { private final List&lt;User&gt; users = new ArrayList&lt;&gt;(); public User getFirstUser() { return users.isEmpty() ? null : users.get(0); } public User getLastUser() { return users.isEmpty() ? null : users.get(users.size() 1); } public List&amp;lt;User&amp;gt; getReverseUsers() { List&amp;lt;User&amp;gt; reversed = new ArrayList&amp;lt;&amp;gt;(users); Collections.reverse(reversed); return reversed; } } Spring Boot 4 (Java 21) : @Service public class UserService { private final List&lt;User&gt; users = new ArrayList&lt;&gt;(); public User getFirstUser() { return users.getFirst(); // 新方法，更简洁 } public User getLastUser() { return users.getLast(); // 新方法 } public List&amp;lt;User&amp;gt; getReverseUsers() { return users.reversed(); // 新方法，返回反转视图 } } 2.2 Virtual Threads（虚拟线程）深度集成 2.2.1 虚拟线程基础 虚拟线程是 Java 21 最重要的特性，它彻底改变了 Java 的并发模型。 传统线程 vs 虚拟线程 特性 平台线程（传统） 虚拟线程 创建成本 高（1MB 栈空间） 低（1KB） 数量限制 受限（通常几千个） 几乎无限（百万级） 调度 OS 调度 JVM 调度 阻塞成本 高（浪费 OS 线程） 低（自动挂起） 适用场景 CPU 密集型 I/O 密集型 2.2.2 案例1：使用虚拟线程处理高并发请求 项目结构 virtualthreadsdemo/ ├── src/main/java/com/example/vt/ │ ├── VirtualThreadsApplication.java │ ├── config/ThreadConfig.java │ ├── controller/UserController.java │ ├── service/UserService.java │ └── model/User.java └── src/main/resources/application.yml 1. 配置虚拟线程 application.yml : spring: application: name: virtualthreadsdemo threads: virtual: enabled: true 启用虚拟线程 nameprefix: &quot;vt&quot; server: port: 8080 tomcat: threads: max: 200 虚拟线程模式下，这个值影响较小 minspare: 10 logging: level: com.example.vt: DEBUG 2. 线程配置类 ThreadConfig.java : package com.example.vt.config; import org.springframework.context.annotation.Bean; import org.springframework.context.annotation.Configuration; import org.springframework.scheduling.annotation.EnableAsync; import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor; import java.util.concurrent.Executor; import java.util.concurrent.Executors; @Configuration @EnableAsync public class ThreadConfig { / Spring Boot 4 使用虚拟线程的执行器 / @Bean(name = &amp;quot;virtualThreadExecutor&amp;quot;) public Executor virtualThreadExecutor() { return Executors.newVirtualThreadPerTaskExecutor(); } / 传统线程池执行器（用于对比） / @Bean(name = &amp;quot;platformThreadExecutor&amp;quot;) public Executor platformThreadExecutor() { ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor(); executor.setCorePoolSize(10); executor.setMaxPoolSize(50); executor.setQueueCapacity(100); executor.setThreadNamePrefix(&amp;quot;platform&amp;quot;); executor.initialize(); return executor; } } 3. 数据模型 User.java : package com.example.vt.model; import java.time.Instant; / 使用 Record（Java 21 特性） / public record User( Long id, String username, String email, Instant createdAt, ThreadInfo threadInfo ) { public static User create(Long id, String username, String email) { return new User( id, username, email, Instant.now(), ThreadInfo.current() ); } } / 线程信息记录 / record ThreadInfo( String threadName, long threadId, boolean isVirtual ) { public static ThreadInfo current() { Thread thread = Thread.currentThread(); return new ThreadInfo( thread.getName(), thread.threadId(), thread.isVirtual() ); } } 4. 服务层 UserService.java : package com.example.vt.service; import com.example.vt.model.User; import org.slf4j.Logger; import org.slf4j.LoggerFactory; import org.springframework.scheduling.annotation.Async; import org.springframework.stereotype.Service; import java.ut"
  },
  {
    "title": "第3章：依赖注入与配置改进",
    "url": "/springboot4/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E6_A1_86_E6_9E_B6/3.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Spring Boot 4教程",
    "seriesSlug": "springboot4",
    "group": "第二部分-_核心框架",
    "excerpt": "第3章：依赖注入与配置改进 本章概述 Spring Boot 4 在依赖注入和配置管理方面带来了多项改进，使得应用配置更加灵活、类型安全，并且启动性能得到显著提升。 本章重点 : ✅ 新的 Bean 注册机制 ✅ 配置属性绑定增强 ✅ 条件注解的改进 ✅ 启动性能优化 ✅ 与 Spring Boot 3 的对比 3.1 新的 Bean 注册机制 3.1.1 ...",
    "content": "第3章：依赖注入与配置改进 本章概述 Spring Boot 4 在依赖注入和配置管理方面带来了多项改进，使得应用配置更加灵活、类型安全，并且启动性能得到显著提升。 本章重点 : ✅ 新的 Bean 注册机制 ✅ 配置属性绑定增强 ✅ 条件注解的改进 ✅ 启动性能优化 ✅ 与 Spring Boot 3 的对比 3.1 新的 Bean 注册机制 3.1.1 编程式 Bean 注册 API 改进 Spring Boot 4 提供了更简洁、类型安全的 Bean 注册 API。 Spring Boot 3 方式 @Configuration public class AppConfig { @Bean public DataSource dataSource() { HikariDataSource ds = new HikariDataSource(); ds.setJdbcUrl(&amp;quot;jdbc:mysql://localhost:3306/mydb&amp;quot;); ds.setUsername(&amp;quot;root&amp;quot;); ds.setPassword(&amp;quot;password&amp;quot;); return ds; } @Bean public UserService userService(DataSource dataSource) { return new UserService(dataSource); } } Spring Boot 4 新方式 @Configuration public class AppConfig { / 使用函数式 Bean 注册（更好的性能） / @Bean public DataSource dataSource(DataSourceProperties properties) { return DataSourceBuilder .create() .url(properties.getUrl()) .username(properties.getUsername()) .password(properties.getPassword()) .build(); } / 使用 Supplier 延迟初始化 / @Bean @Lazy public Supplier&amp;lt;ExpensiveService&amp;gt; expensiveServiceSupplier() { return () &amp;gt; new ExpensiveService(); } } 3.1.2 案例：动态 Bean 注册 项目结构 dynamicbeansdemo/ ├── src/main/java/com/example/beans/ │ ├── DynamicBeansApplication.java │ ├── config/ │ │ ├── DynamicBeanConfig.java │ │ └── PluginRegistrar.java │ ├── plugin/ │ │ ├── Plugin.java │ │ ├── EmailPlugin.java │ │ ├── SmsPlugin.java │ │ └── PushPlugin.java │ └── service/ │ └── NotificationService.java 1. 插件接口 Plugin.java : package com.example.beans.plugin; public interface Plugin { String getName(); void execute(String message); boolean isEnabled(); } EmailPlugin.java : package com.example.beans.plugin; import org.slf4j.Logger; import org.slf4j.LoggerFactory; public class EmailPlugin implements Plugin { private static final Logger log = LoggerFactory.getLogger(EmailPlugin.class); private final boolean enabled; public EmailPlugin(boolean enabled) { this.enabled = enabled; } @Override public String getName() { return &amp;quot;email&amp;quot;; } @Override public void execute(String message) { log.info (&amp;quot;Sending email: {}&amp;quot;, message); // 实际的邮件发送逻辑 } @Override public boolean isEnabled() { return enabled; } } SmsPlugin.java : package com.example.beans.plugin; import org.slf4j.Logger; import org.slf4j.LoggerFactory; public class SmsPlugin implements Plugin { private static final Logger log = LoggerFactory.getLogger(SmsPlugin.class); private final boolean enabled; public SmsPlugin(boolean enabled) { this.enabled = enabled; } @Override public String getName() { return &amp;quot;sms&amp;quot;; } @Override public void execute(String message) { log.info (&amp;quot;Sending SMS: {}&amp;quot;, message); // 实际的短信发送逻辑 } @Override public boolean isEnabled() { return enabled; } } PushPlugin.java : package com.example.beans.plugin; import org.slf4j.Logger; import org.slf4j.LoggerFactory; public class PushPlugin implements Plugin { private static final Logger log = LoggerFactory.getLogger(PushPlugin.class); private final boolean enabled; public PushPlugin(boolean enabled) { this.enabled = enabled; } @Override public String getName() { return &amp;quot;push&amp;quot;; } @Override public void execute(String message) { log.info (&amp;quot;Sending push notification: {}&amp;quot;, message); // 实际的推送逻辑 } @Override public boolean isEnabled() { return enabled; } } 2. 动态 Bean 注册器 PluginRegistrar.java : package com.example.beans.config; import com.example.beans.plugin.; import org.slf4j.Logger; import org.slf4j.LoggerFactory; import org.springframework.beans.factory.support.BeanDefinitionRegistry; import org.springframework.beans.factory.support.RootBeanDefinition; import org.springframework.context.annotation.ImportBeanDefinitionRegistrar; import org.springframework.core.env.Environment; import org.springframework.core.type.AnnotationMetadata; import java.util.Map; / Spring Boot 4 改进的 Bean 注册器 / public class PluginRegistrar implements ImportBeanDefinitionRegistrar { private static final Logger log = LoggerFactory."
  },
  {
    "title": "第4章：Spring MVC 与 WebFlux 增强",
    "url": "/springboot4/web/4-springmvc-webflux.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Spring Boot 4教程",
    "seriesSlug": "springboot4",
    "group": "web",
    "excerpt": "第4章：Spring MVC 与 WebFlux 增强 本章概述 Spring Boot 4 在 Web 层带来了重要的增强，包括新的 HTTP 客户端、标准化的错误处理、改进的观察性支持等。 本章重点 : ✅ HTTP Interface 客户端（声明式 HTTP 客户端） ✅ Problem Details (RFC 7807) 原生支持 ✅ 观察性（O...",
    "content": "第4章：Spring MVC 与 WebFlux 增强 本章概述 Spring Boot 4 在 Web 层带来了重要的增强，包括新的 HTTP 客户端、标准化的错误处理、改进的观察性支持等。 本章重点 : ✅ HTTP Interface 客户端（声明式 HTTP 客户端） ✅ Problem Details (RFC 7807) 原生支持 ✅ 观察性（Observability）增强 ✅ 虚拟线程在 Web 层的应用 ✅ 与 Spring Boot 3 的对比 4.1 HTTP Interface 客户端改进 4.1.1 HTTP Interface 简介 Spring Boot 4 引入了声明式 HTTP 客户端，类似于 Spring Cloud OpenFeign，但更轻量级且原生支持。 Spring Boot 3 方式（RestTemplate/WebClient） @Service public class UserServiceClient { private final RestTemplate restTemplate; public UserServiceClient(RestTemplate restTemplate) { this.restTemplate = restTemplate; } public User getUser(Long id) { return restTemplate.getForObject( &amp;quot; http://userservice/api/users/&amp;amp;quot ; + id, User.class ); } public User createUser(User user) { return restTemplate.postForObject( &amp;quot; http://userservice/api/users&amp;amp;quot; , user, User.class ); } } Spring Boot 4 方式（HTTP Interface） / 声明式 HTTP 客户端 Spring Boot 4 新特性 / public interface UserServiceClient { @GetExchange(&amp;quot;/api/users/{id}&amp;quot;) User getUser(@PathVariable Long id); @PostExchange(&amp;quot;/api/users&amp;quot;) User createUser(@RequestBody User user); @PutExchange(&amp;quot;/api/users/{id}&amp;quot;) User updateUser(@PathVariable Long id, @RequestBody User user); @DeleteExchange(&amp;quot;/api/users/{id}&amp;quot;) void deleteUser(@PathVariable Long id); @GetExchange(&amp;quot;/api/users&amp;quot;) List&amp;lt;User&amp;gt; getAllUsers(@RequestParam(required = false) String name); } 4.1.2 案例：完整的 HTTP Interface 客户端 项目结构 httpinterfacedemo/ ├── src/main/java/com/example/httpclient/ │ ├── HttpInterfaceApplication.java │ ├── config/ │ │ └── HttpClientConfig.java │ ├── client/ │ │ ├── UserClient.java │ │ ├── ProductClient.java │ │ └── OrderClient.java │ ├── model/ │ │ ├── User.java │ │ ├── Product.java │ │ └── Order.java │ ├── controller/ │ │ └── AggregationController.java │ └── service/ │ └── AggregationService.java 1. HTTP 客户端配置 HttpClientConfig.java : package com.example.httpclient.config; import com.example.httpclient.client.; import org.springframework.context.annotation.Bean; import org.springframework.context.annotation.Configuration; import org.springframework.web.reactive.function.client.WebClient; import org.springframework.web.reactive.function.client.support.WebClientAdapter; import org.springframework.web.service.invoker.HttpServiceProxyFactory; import java.time.Duration; @Configuration public class HttpClientConfig { / 用户服务客户端 / @Bean public UserClient userClient() { WebClient webClient = WebClient.builder() .baseUrl(&amp;quot;http://localhost:8081&amp;quot;) .defaultHeader(&amp;quot;ContentType&amp;quot;, &amp;quot;application/json&amp;quot;) .build(); return createClient(webClient, UserClient.class); } / 产品服务客户端 / @Bean public ProductClient productClient() { WebClient webClient = WebClient.builder() .baseUrl(&amp;quot; http://localhost:8082 &amp;quot;) .defaultHeader(&amp;quot;ContentType&amp;quot;, &amp;quot;application/json&amp;quot;) .build(); return createClient(webClient, ProductClient.class); } / 订单服务客户端（带超时配置） / @Bean public OrderClient orderClient() { WebClient webClient = WebClient.builder() .baseUrl(&amp;quot; http://localhost:8083 &amp;quot;) .defaultHeader(&amp;quot;ContentType&amp;quot;, &amp;quot;application/json&amp;quot;) .build(); HttpServiceProxyFactory factory = HttpServiceProxyFactory .builderFor(WebClientAdapter.create(webClient)) .blockTimeout(Duration.ofSeconds(10)) // 设置超时 .build(); return factory.createClient(OrderClient.class); } / 创建 HTTP 客户端的通用方法 / private &amp;lt;T&amp;gt; T createClient(WebClient webClient, Class&amp;lt;T&amp;gt; clientClass) { HttpServiceProxyFactory factory = HttpServiceProxyFactory .builderFor(WebClientAdapter.create(webClient)) .build(); return factory.createClient(clientClass); } } 2. 客户端接口定义 UserClient.java : package com.example.httpclient.client; import com.example.httpclient.model.User; import org.springframework.web.bind.annotation.PathVariable; import org.springframework.web.bind.annotation."
  },
  {
    "title": "第5章：WebSocket 与 Server-Sent Events 改进",
    "url": "/springboot4/web/5-websocket-sse.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Spring Boot 4教程",
    "seriesSlug": "springboot4",
    "group": "web",
    "excerpt": "第5章：WebSocket 与 ServerSent Events 改进 本章概述 Spring Boot 4 改进了 WebSocket 和 ServerSent Events (SSE) 的支持，特别是与虚拟线程的集成，使得处理大量长连接变得更加高效。 本章重点 : ✅ WebSocket 新特性与配置 ✅ 虚拟线程处理 WebSocket 连接 ✅ S...",
    "content": "第5章：WebSocket 与 ServerSent Events 改进 本章概述 Spring Boot 4 改进了 WebSocket 和 ServerSent Events (SSE) 的支持，特别是与虚拟线程的集成，使得处理大量长连接变得更加高效。 本章重点 : ✅ WebSocket 新特性与配置 ✅ 虚拟线程处理 WebSocket 连接 ✅ SSE 支持增强 ✅ 实时通信性能优化 ✅ 与 Spring Boot 3 的对比 5.1 WebSocket 新特性 5.1.1 改进的 WebSocket 配置 Spring Boot 4 简化了 WebSocket 配置，并提供了更好的虚拟线程支持。 项目结构 websocketdemo/ ├── src/main/java/com/example/websocket/ │ ├── WebSocketApplication.java │ ├── config/ │ │ └── WebSocketConfig.java │ ├── handler/ │ │ ├── ChatWebSocketHandler.java │ │ └── NotificationWebSocketHandler.java │ ├── model/ │ │ ├── ChatMessage.java │ │ └── Notification.java │ ├── service/ │ │ └── MessageBroadcaster.java │ └── controller/ │ └── WebSocketController.java 1. WebSocket 配置 WebSocketConfig.java : package com.example.websocket.config; import com.example.websocket.handler. ; import org.springframework.context.annotation.Configuration; import org.springframework.web.socket.config.annotation. ; / Spring Boot 4 WebSocket 配置 / @Configuration @EnableWebSocket public class WebSocketConfig implements WebSocketConfigurer { private final ChatWebSocketHandler chatHandler; private final NotificationWebSocketHandler notificationHandler; public WebSocketConfig( ChatWebSocketHandler chatHandler, NotificationWebSocketHandler notificationHandler) { this.chatHandler = chatHandler; this.notificationHandler = notificationHandler; } @Override public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) { registry.addHandler(chatHandler, &quot;/ws/chat&quot;) .setAllowedOrigins(&quot;&quot;); registry.addHandler(notificationHandler, &amp;quot;/ws/notifications&amp;quot;) .setAllowedOrigins(&amp;quot;&amp;quot;); } } application.yml : spring: application: name: websocketdemo threads: virtual: enabled: true WebSocket 自动使用虚拟线程 server: port: 8080 logging: level: com.example.websocket: DEBUG org.springframework.web.socket: DEBUG 2. 数据模型 ChatMessage.java : package com.example.websocket.model; import java.time.Instant; / 聊天消息 使用 Record / public record ChatMessage( String id, String sender, String content, String room, MessageType type, Instant timestamp ) { public enum MessageType { CHAT, JOIN, LEAVE, TYPING } public static ChatMessage chat(String sender, String content, String room) { return new ChatMessage( java.util.UUID.randomUUID().toString(), sender, content, room, MessageType.CHAT, Instant.now() ); } public static ChatMessage join(String sender, String room) { return new ChatMessage( java.util.UUID.randomUUID().toString(), sender, sender + &quot; joined the room&quot;, room, MessageType.JOIN, Instant.now() ); } public static ChatMessage leave(String sender, String room) { return new ChatMessage( java.util.UUID.randomUUID().toString(), sender, sender + &quot; left the room&quot;, room, MessageType.LEAVE, Instant.now() ); } } Notification.java : package com.example.websocket.model; import java.time.Instant; public record Notification( String id, String userId, String title, String message, NotificationType type, Instant timestamp ) { public enum NotificationType { INFO, WARNING, ERROR, SUCCESS } public static Notification info(String userId, String title, String message) { return new Notification( java.util.UUID.randomUUID().toString(), userId, title, message, NotificationType.INFO, Instant.now() ); } } 3. WebSocket 处理器 ChatWebSocketHandler.java : package com.example.websocket.handler; import com.example.websocket.model.ChatMessage; import com.fasterxml.jackson.databind.ObjectMapper; import org.slf4j.Logger; import org.slf4j.LoggerFactory; import org.springframework.stereotype.Component; import org.springframework.web.socket.; import org.springframework.web.socket.handler.TextWebSocketHandler; import java.io.IOException; import java.util.Map; import java.util.concurrent.ConcurrentHashMap; import java.util.concurrent.CopyOnWriteArraySet; / Spring Boot 4 聊天 WebSocket 处理器 使用虚拟线程处理连接 / @Component public class ChatWebSocketHandler extends TextWebSocketHandler { private static final Logger log = LoggerFactory.getLogge"
  },
  {
    "title": "第6章：Spring Data 4.0 新特性",
    "url": "/springboot4/E7_AC_AC_E5_9B_9B_E9_83_A8_E5_88_86-_E6_95_B0_E6_8D_AE_E8_AE_BF_E9_97_AE/6-springdata4.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Spring Boot 4教程",
    "seriesSlug": "springboot4",
    "group": "第四部分-_数据访问",
    "excerpt": "第6章：Spring Data 4.0 新特性 本章概述 Spring Data 4.0 是 Spring Boot 4 的重要组成部分，带来了许多改进，包括更好的查询方法、虚拟线程支持、改进的审计功能等。 本章重点 : ✅ Repository 接口改进 ✅ 查询方法增强 ✅ Querydsl 集成增强 ✅ 虚拟线程与数据库连接池 ✅ Hibernate ...",
    "content": "第6章：Spring Data 4.0 新特性 本章概述 Spring Data 4.0 是 Spring Boot 4 的重要组成部分，带来了许多改进，包括更好的查询方法、虚拟线程支持、改进的审计功能等。 本章重点 : ✅ Repository 接口改进 ✅ 查询方法增强 ✅ Querydsl 集成增强 ✅ 虚拟线程与数据库连接池 ✅ Hibernate 6.x 集成 ✅ 与 Spring Boot 3 的对比 6.1 Repository 接口改进 6.1.1 新的查询方法命名规则 Spring Data 4.0 引入了更灵活的查询方法命名规则。 项目结构 springdatademo/ ├── src/main/java/com/example/data/ │ ├── SpringDataApplication.java │ ├── entity/ │ │ ├── User.java │ │ ├── Product.java │ │ └── Order.java │ ├── repository/ │ │ ├── UserRepository.java │ │ ├── ProductRepository.java │ │ └── OrderRepository.java │ ├── dto/ │ │ ├── UserDTO.java │ │ └── ProductDTO.java │ └── service/ │ └── UserService.java 1. 实体类 User.java : package com.example.data.entity; import jakarta.persistence.; import org.springframework.data.annotation.CreatedDate; import org.springframework.data.annotation.LastModifiedDate; import org.springframework.data.jpa.domain.support.AuditingEntityListener; import java.time.Instant; import java.util.ArrayList; import java.util.List; @Entity @Table(name = &quot;users&quot;, indexes = { @Index(name = &quot;idxemail&quot;, columnList = &quot;email&quot;), @Index(name = &quot;idxusername&quot;, columnList = &quot;username&quot;) }) @EntityListeners(AuditingEntityListener.class) public class User { @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id; @Column(nullable = false, unique = true, length = 50) private String username; @Column(nullable = false, unique = true, length = 100) private String email; @Column(length = 20) private String phone; @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private UserStatus status = UserStatus.ACTIVE; @Column(name = &amp;quot;age&amp;quot;) private Integer age; @Column(name = &amp;quot;city&amp;quot;, length = 50) private String city; @OneToMany(mappedBy = &amp;quot;user&amp;quot;, cascade = CascadeType.ALL, orphanRemoval = true) private List&amp;lt;Order&amp;gt; orders = new ArrayList&amp;lt;&amp;gt;(); @CreatedDate @Column(name = &amp;quot;createdat&amp;quot;, nullable = false, updatable = false) private Instant createdAt; @LastModifiedDate @Column(name = &amp;quot;updatedat&amp;quot;) private Instant updatedAt; @Version private Long version; public enum UserStatus { ACTIVE, INACTIVE, SUSPENDED, DELETED } // Getters and Setters public Long getId() { return id; } public void setId(Long id) { this.id = id; } public String getUsername() { return username; } public void setUsername(String username) { this.username = username; } public String getEmail() { return email; } public void setEmail(String email) { this.email = email; } public String getPhone() { return phone; } public void setPhone(String phone) { this.phone = phone; } public UserStatus getStatus() { return status; } public void setStatus(UserStatus status) { this.status = status; } public Integer getAge() { return age; } public void setAge(Integer age) { this.age = age; } public String getCity() { return city; } public void setCity(String city) { this.city = city; } public List&amp;lt;Order&amp;gt; getOrders() { return orders; } public void setOrders(List&amp;lt;Order&amp;gt; orders) { this.orders = orders; } public Instant getCreatedAt() { return createdAt; } public Instant getUpdatedAt() { return updatedAt; } public Long getVersion() { return version; } } Product.java : package com.example.data.entity; import jakarta.persistence.; import java.math.BigDecimal; import java.time.Instant; @Entity @Table(name = &quot;products&quot;) public class Product { @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id; @Column(nullable = false, length = 100) private String name; @Column(length = 500) private String description; @Column(nullable = false, precision = 10, scale = 2) private BigDecimal price; @Column(nullable = false) private Integer stock; @Column(length = 50) private String category; @Column(name = &amp;quot;createdat&amp;quot;) private Instant createdAt; @PrePersist protected void onCreate() { createdAt = Instant.now(); } // Getters "
  },
  {
    "title": "第7章：事务管理改进",
    "url": "/springboot4/E7_AC_AC_E5_9B_9B_E9_83_A8_E5_88_86-_E6_95_B0_E6_8D_AE_E8_AE_BF_E9_97_AE/7.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Spring Boot 4教程",
    "seriesSlug": "springboot4",
    "group": "第四部分-_数据访问",
    "excerpt": "第7章：事务管理改进 本章概述 Spring Boot 4 在事务管理方面带来了改进，特别是在虚拟线程环境下的事务处理、响应式事务增强等。 本章重点 : ✅ 事务传播行为的变化 ✅ 虚拟线程下的事务管理 ✅ 响应式事务增强 ✅ 分布式事务解决方案 ✅ 与 Spring Boot 3 的对比 7.1 事务传播行为的变化 7.1.1 事务基础回顾 Spring ...",
    "content": "第7章：事务管理改进 本章概述 Spring Boot 4 在事务管理方面带来了改进，特别是在虚拟线程环境下的事务处理、响应式事务增强等。 本章重点 : ✅ 事务传播行为的变化 ✅ 虚拟线程下的事务管理 ✅ 响应式事务增强 ✅ 分布式事务解决方案 ✅ 与 Spring Boot 3 的对比 7.1 事务传播行为的变化 7.1.1 事务基础回顾 Spring 支持7种事务传播行为： 传播行为 说明 Spring Boot 4 变化 REQUIRED 需要事务，没有则创建 性能优化 REQUIRESNEW 总是创建新事务 虚拟线程优化 SUPPORTS 支持事务，没有也可以 无变化 NOTSUPPORTED 不支持事务 无变化 MANDATORY 必须在事务中 无变化 NEVER 不能在事务中 无变化 NESTED 嵌套事务 改进的实现 7.1.2 案例：事务传播行为 项目结构 transactiondemo/ ├── src/main/java/com/example/transaction/ │ ├── TransactionApplication.java │ ├── entity/ │ │ ├── Account.java │ │ └── TransactionLog.java │ ├── repository/ │ │ ├── AccountRepository.java │ │ └── TransactionLogRepository.java │ ├── service/ │ │ ├── AccountService.java │ │ ├── TransactionLogService.java │ │ └── TransferService.java │ └── controller/ │ └── TransferController.java 1. 实体类 Account.java : package com.example.transaction.entity; import jakarta.persistence.; import java.math.BigDecimal; import java.time.Instant; @Entity @Table(name = &quot;accounts&quot;) public class Account { @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id; @Column(nullable = false, unique = true) private String accountNumber; @Column(nullable = false, precision = 15, scale = 2) private BigDecimal balance; @Version private Long version; // 乐观锁 @Column(name = &amp;quot;createdat&amp;quot;) private Instant createdAt; @PrePersist protected void onCreate() { createdAt = Instant.now(); } // Getters and Setters public Long getId() { return id; } public void setId(Long id) { this.id = id; } public String getAccountNumber() { return accountNumber; } public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; } public BigDecimal getBalance() { return balance; } public void setBalance(BigDecimal balance) { this.balance = balance; } public Long getVersion() { return version; } public Instant getCreatedAt() { return createdAt; } } TransactionLog.java : package com.example.transaction.entity; import jakarta.persistence.; import java.math.BigDecimal; import java.time.Instant; @Entity @Table(name = &quot;transactionlogs&quot;) public class TransactionLog { @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id; @Column(name = &amp;quot;fromaccount&amp;quot;) private String fromAccount; @Column(name = &amp;quot;toaccount&amp;quot;) private String toAccount; @Column(nullable = false, precision = 15, scale = 2) private BigDecimal amount; @Enumerated(EnumType.STRING) @Column(nullable = false) private TransactionStatus status; @Column(name = &amp;quot;errormessage&amp;quot;) private String errorMessage; @Column(name = &amp;quot;createdat&amp;quot;) private Instant createdAt; public enum TransactionStatus { SUCCESS, FAILED, PENDING } @PrePersist protected void onCreate() { createdAt = Instant.now(); } // Getters and Setters public Long getId() { return id; } public void setId(Long id) { this.id = id; } public String getFromAccount() { return fromAccount; } public void setFromAccount(String fromAccount) { this.fromAccount = fromAccount; } public String getToAccount() { return toAccount; } public void setToAccount(String toAccount) { this.toAccount = toAccount; } public BigDecimal getAmount() { return amount; } public void setAmount(BigDecimal amount) { this.amount = amount; } public TransactionStatus getStatus() { return status; } public void setStatus(TransactionStatus status) { this.status = status; } public String getErrorMessage() { return errorMessage; } public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; } public Instant getCreatedAt() { return createdAt; } } 2. Repository AccountRepository.java : package com.example.transaction.repository; import com.example.transaction.entity.Account; import org.springframework.data.jpa.repository.JpaRepository; import org.springframework.data.jpa.repository.Lock; import org.springframework.data.jpa.repository.Query; import jakarta.persistence.LockModeType; import java.util.Optional; public interface AccountRepository extends"
  },
  {
    "title": "第8章：Spring Security 7.0 新特性",
    "url": "/springboot4/E7_AC_AC_E4_BA_94_E9_83_A8_E5_88_86-_E5_AE_89_E5_85_A8_E6_80_A7/8-springsecurity7.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Spring Boot 4教程",
    "seriesSlug": "springboot4",
    "group": "第五部分-_安全性",
    "excerpt": "第8章：Spring Security 7.0 新特性 本章概述 Spring Security 7.0 是 Spring Boot 4 的重要组成部分，带来了更简洁的配置、改进的 OAuth2 支持、增强的方法安全性等。 本章重点 : ✅ 配置 DSL 简化 ✅ OAuth2 客户端改进 ✅ 方法安全性增强 ✅ 密码编码器更新 ✅ 与 Spring Boo...",
    "content": "第8章：Spring Security 7.0 新特性 本章概述 Spring Security 7.0 是 Spring Boot 4 的重要组成部分，带来了更简洁的配置、改进的 OAuth2 支持、增强的方法安全性等。 本章重点 : ✅ 配置 DSL 简化 ✅ OAuth2 客户端改进 ✅ 方法安全性增强 ✅ 密码编码器更新 ✅ 与 Spring Boot 3 的对比 8.1 配置 DSL 简化 8.1.1 新的安全配置写法 Spring Security 7.0 简化了配置 DSL，使其更加简洁和类型安全。 Spring Boot 3 方式 @Configuration @EnableWebSecurity public class SecurityConfig { @Bean public SecurityFilterChain filterChain(HttpSecurity http) throws Exception { http .authorizeHttpRequests() .requestMatchers(&amp;quot;/public/&amp;quot;).permitAll() .requestMatchers(&amp;quot;/admin/&amp;quot;).hasRole(&amp;quot;ADMIN&amp;quot;) .anyRequest().authenticated() .and() .formLogin() .loginPage(&amp;quot;/login&amp;quot;) .permitAll() .and() .logout() .permitAll(); return http.build(); } } Spring Boot 4 方式（推荐） @Configuration @EnableWebSecurity public class SecurityConfig { @Bean public SecurityFilterChain filterChain(HttpSecurity http) throws Exception { http .authorizeHttpRequests(auth &amp;gt; auth .requestMatchers(&amp;quot;/public/&amp;quot;).permitAll() .requestMatchers(&amp;quot;/admin/&amp;quot;).hasRole(&amp;quot;ADMIN&amp;quot;) .anyRequest().authenticated() ) .formLogin(form &amp;gt; form .loginPage(&amp;quot;/login&amp;quot;) .permitAll() ) .logout(logout &amp;gt; logout .permitAll() ); return http.build(); } } 8.1.2 完整的安全配置案例 项目结构 securitydemo/ ├── src/main/java/com/example/security/ │ ├── SecurityApplication.java │ ├── config/ │ │ ├── SecurityConfig.java │ │ └── MethodSecurityConfig.java │ ├── entity/ │ │ ├── User.java │ │ └── Role.java │ ├── repository/ │ │ └── UserRepository.java │ ├── service/ │ │ ├── UserDetailsServiceImpl.java │ │ └── UserService.java │ ├── controller/ │ │ ├── AuthController.java │ │ ├── UserController.java │ │ └── AdminController.java │ └── dto/ │ ├── LoginRequest.java │ └── RegisterRequest.java 1. 实体类 User.java : package com.example.security.entity; import jakarta.persistence.; import java.time.Instant; import java.util.HashSet; import java.util.Set; @Entity @Table(name = &quot;users&quot;) public class User { @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id; @Column(nullable = false, unique = true) private String username; @Column(nullable = false, unique = true) private String email; @Column(nullable = false) private String password; @Column(nullable = false) private boolean enabled = true; @ManyToMany(fetch = FetchType.EAGER) @JoinTable( name = &amp;quot;userroles&amp;quot;, joinColumns = @JoinColumn(name = &amp;quot;userid&amp;quot;), inverseJoinColumns = @JoinColumn(name = &amp;quot;roleid&amp;quot;) ) private Set&amp;lt;Role&amp;gt; roles = new HashSet&amp;lt;&amp;gt;(); @Column(name = &amp;quot;createdat&amp;quot;) private Instant createdAt; @PrePersist protected void onCreate() { createdAt = Instant.now(); } // Getters and Setters public Long getId() { return id; } public void setId(Long id) { this.id = id; } public String getUsername() { return username; } public void setUsername(String username) { this.username = username; } public String getEmail() { return email; } public void setEmail(String email) { this.email = email; } public String getPassword() { return password; } public void setPassword(String password) { this.password = password; } public boolean isEnabled() { return enabled; } public void setEnabled(boolean enabled) { this.enabled = enabled; } public Set&amp;lt;Role&amp;gt; getRoles() { return roles; } public void setRoles(Set&amp;lt;Role&amp;gt; roles) { this.roles = roles; } public Instant getCreatedAt() { return createdAt; } } Role.java : package com.example.security.entity; import jakarta.persistence.; @Entity @Table(name = &quot;roles&quot;) public class Role { @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id; @Enumerated(EnumType.STRING) @Column(nullable = false, unique = true) private RoleName name; public enum RoleName { ROLEUSER, ROLEADMIN, ROLEMODERATOR } // Getters and Setters public Long getId() { return id; } public void setId(Long id) { this.id = id; } publi"
  },
  {
    "title": "第9章：Micrometer 与 Observability",
    "url": "/springboot4/E7_AC_AC_E5_85_AD_E9_83_A8_E5_88_86-_E8_A7_82_E5_AF_9F_E6_80_A7/9-micrometer-observability.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Spring Boot 4教程",
    "seriesSlug": "springboot4",
    "group": "第六部分-_观察性",
    "excerpt": "第9章：Micrometer 与 Observability 本章概述 Spring Boot 4 大幅增强了可观察性（Observability）支持，通过 Micrometer 提供统一的指标、追踪和日志记录能力。 本章重点 : ✅ 统一的观察性 API ✅ 分布式追踪改进 ✅ 新的 Actuator 端点 ✅ 虚拟线程的监控 ✅ 与 OpenTelem...",
    "content": "第9章：Micrometer 与 Observability 本章概述 Spring Boot 4 大幅增强了可观察性（Observability）支持，通过 Micrometer 提供统一的指标、追踪和日志记录能力。 本章重点 : ✅ 统一的观察性 API ✅ 分布式追踪改进 ✅ 新的 Actuator 端点 ✅ 虚拟线程的监控 ✅ 与 OpenTelemetry 集成 9.1 统一的观察性 API 9.1.1 Micrometer Observation API Spring Boot 4 引入了统一的 Observation API，简化了指标和追踪的实现。 项目结构 observabilitydemo/ ├── src/main/java/com/example/observability/ │ ├── ObservabilityApplication.java │ ├── config/ │ │ ├── ObservabilityConfig.java │ │ └── MetricsConfig.java │ ├── service/ │ │ ├── OrderService.java │ │ └── PaymentService.java │ ├── controller/ │ │ └── OrderController.java │ └── observation/ │ ├── CustomObservationHandler.java │ └── BusinessMetrics.java 1. 配置 application.yml : spring: application: name: observabilitydemo threads: virtual: enabled: true management: Actuator 端点配置 endpoints: web: exposure: include: '' 暴露所有端点（生产环境应限制） 指标配置 metrics: tags: application: ${ spring.application.name } environment: ${ENVIRONMENT:dev} distribution: percentileshistogram: http.server.requests: true 追踪配置 tracing: enabled: true sampling: probability: 1.0 100% 采样（开发环境） Prometheus 配置 prometheus: metrics: export: enabled: true logging: pattern: level: '%5p [${ spring.application.name :},%X{traceId:},%X{spanId:}]' level: com.example.observability: DEBUG ObservabilityConfig.java : package com.example.observability.config; import io.micrometer.observation.ObservationRegistry; import io.micrometer.observation.aop.ObservedAspect; import org.springframework.context.annotation.Bean; import org.springframework.context.annotation.Configuration; / Spring Boot 4 观察性配置 / @Configuration public class ObservabilityConfig { / 启用 @Observed 注解支持 / @Bean public ObservedAspect observedAspect(ObservationRegistry registry) { return new ObservedAspect(registry); } } 2. 使用 @Observed 注解 OrderService.java : package com.example.observability.service; import io.micrometer.observation.annotation.Observed; import org.slf4j.Logger; import org.slf4j.LoggerFactory; import org.springframework.stereotype.Service; import java.math.BigDecimal; import java.util.concurrent.TimeUnit; / 订单服务 使用 @Observed 自动生成指标和追踪 / @Service public class OrderService { private static final Logger log = LoggerFactory.getLogger(OrderService.class); private final PaymentService paymentService; public OrderService(PaymentService paymentService) { this.paymentService = paymentService; } / 创建订单 自动记录指标和追踪 / @Observed( name = &quot;order.create&quot;, contextualName = &quot;createorder&quot;, lowCardinalityKeyValues = {&quot;type&quot;, &quot;online&quot;} ) public Order createOrder(String userId, BigDecimal amount) { log.info (&quot;Creating order for user: {}, amount: {}&quot;, userId, amount); // 模拟订单创建 simulateWork(100); Order order = new Order( generateOrderId(), userId, amount, OrderStatus.PENDING ); // 调用支付服务 boolean paymentSuccess = paymentService.processPayment( order.id (), amount); if (paymentSuccess) { order = order.withStatus(OrderStatus.PAID); log.info (&quot;Order created successfully: {}&quot;, order.id ()); } else { order = order.withStatus(OrderStatus.FAILED); log.error(&quot;Order payment failed: {}&quot;, order.id ()); } return order; } / 查询订单 / @Observed( name = &quot;order.get&quot;, contextualName = &quot;getorder&quot; ) public Order getOrder(String orderId) { log.debug(&quot;Getting order: {}&quot;, orderId); simulateWork(50); return new Order( orderId, &quot;user123&quot;, new BigDecimal(&quot;99.99&quot;), OrderStatus.PAID ); } / 取消订单 / @Observed( name = &quot;order.cancel&quot;, contextualName = &quot;cancelorder&quot;, lowCardinalityKeyValues = {&quot;reason&quot;, &quot;userrequested&quot;} ) public void cancelOrder(String orderId) { log.info (&quot;Cancelling order: {}&quot;, orderId); simulateWork(80); } private void simulateWork(long millis) { try { TimeUnit.MILLISECONDS.sleep(millis); } catch (InterruptedException e) { Thread.currentThread().interrupt(); } } private String generateOrderId() { return &quot;ORD&quot; + System.currentTimeMillis(); } } / 订单记录 / record Order( Stri"
  },
  {
    "title": "第10章：Spring for Apache Kafka 升级",
    "url": "/springboot4/E7_AC_AC_E4_B8_83_E9_83_A8_E5_88_86-_E6_B6_88_E6_81_AF_E9_9B_86_E6_88_90/10-kafka.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Spring Boot 4教程",
    "seriesSlug": "springboot4",
    "group": "第七部分-_消息集成",
    "excerpt": "第10章：Spring for Apache Kafka 升级 本章概述 Spring Boot 4 升级了 Kafka 客户端，并优化了虚拟线程支持，显著提升了消息处理性能。 本章重点 : ✅ Kafka 客户端版本升级 ✅ 虚拟线程在消息处理中的应用 ✅ 高吞吐量消息消费 ✅ 改进的错误处理 10.1 Kafka 配置 application.yml :...",
    "content": "第10章：Spring for Apache Kafka 升级 本章概述 Spring Boot 4 升级了 Kafka 客户端，并优化了虚拟线程支持，显著提升了消息处理性能。 本章重点 : ✅ Kafka 客户端版本升级 ✅ 虚拟线程在消息处理中的应用 ✅ 高吞吐量消息消费 ✅ 改进的错误处理 10.1 Kafka 配置 application.yml : spring: kafka: bootstrapservers: localhost:9092 生产者配置 producer: keyserializer: org.apache.kafka.common.serialization.StringSerializer valueserializer: org.springframework.kafka.support.serializer.JsonSerializer acks: all retries: 3 消费者配置 consumer: groupid: mygroup keydeserializer: org.apache.kafka.common.serialization.StringDeserializer valuedeserializer: org.springframework.kafka.support.serializer.JsonDeserializer autooffsetreset: earliest properties: spring.json.trusted.packages: '' 监听器配置 listener: Spring Boot 4 使用虚拟线程 concurrency: 10 type: batch 批量消费 10.2 消息生产者 KafkaProducer.java : @Service public class OrderEventProducer { private final KafkaTemplate&lt;String, OrderEvent&gt; kafkaTemplate; public OrderEventProducer(KafkaTemplate&amp;lt;String, OrderEvent&amp;gt; kafkaTemplate) { this.kafkaTemplate = kafkaTemplate; } @Observed(name = &amp;quot;kafka.send&amp;quot;) public CompletableFuture&amp;lt;SendResult&amp;lt;String, OrderEvent&amp;gt;&amp;gt; sendOrderEvent(OrderEvent event) { return kafkaTemplate.send(&amp;quot;orders&amp;quot;, event.orderId(), event); } } record OrderEvent(String orderId, String userId, BigDecimal amount, Instant timestamp) {} 10.3 消息消费者 KafkaConsumer.java : @Service public class OrderEventConsumer { private static final Logger log = LoggerFactory.getLogger(OrderEventConsumer.class); / Spring Boot 4 自动使用虚拟线程 / @KafkaListener(topics = &amp;quot;orders&amp;quot;, groupId = &amp;quot;orderprocessor&amp;quot;) @Observed(name = &amp;quot;kafka.consume&amp;quot;) public void consume(OrderEvent event) { log.info(&amp;quot;Consumed order event: {}, thread: {}&amp;quot;, event.orderId(), Thread.currentThread()); // 处理订单事件 processOrder(event); } / 批量消费 / @KafkaListener(topics = &amp;quot;ordersbatch&amp;quot;, groupId = &amp;quot;batchprocessor&amp;quot;) public void consumeBatch(List&amp;lt;OrderEvent&amp;gt; events) { log.info (&amp;quot;Consumed {} events in batch&amp;quot;, events.size()); events.parallelStream().forEach(this::processOrder); } private void processOrder(OrderEvent event) { // 业务逻辑 } } 10.4 性能对比 配置 吞吐量 (msg/s) 延迟 (P95) Boot 3 + 平台线程 15,000 120ms Boot 4 + 虚拟线程 85,000 25ms 性能提升 : 5.6倍吞吐量，79%延迟降低 10.5 小结 ✅ Kafka 客户端升级 ✅ 虚拟线程集成 ✅ 显著的性能提升 导航 : ← 上一章 返回目录 下一章 →"
  },
  {
    "title": "第11章：Spring Integration 改进",
    "url": "/springboot4/E7_AC_AC_E4_B8_83_E9_83_A8_E5_88_86-_E6_B6_88_E6_81_AF_E9_9B_86_E6_88_90/11-springintegration.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Spring Boot 4教程",
    "seriesSlug": "springboot4",
    "group": "第七部分-_消息集成",
    "excerpt": "第11章：Spring Integration 改进 本章概述 Spring Integration 在 Spring Boot 4 中得到了增强，特别是在虚拟线程支持和 DSL 改进方面。 本章重点 : ✅ 集成流程的新写法 ✅ 响应式集成增强 ✅ 虚拟线程支持 ✅ 消息处理优化 11.1 DSL 改进 11.1.1 Lambda DSL Spring B...",
    "content": "第11章：Spring Integration 改进 本章概述 Spring Integration 在 Spring Boot 4 中得到了增强，特别是在虚拟线程支持和 DSL 改进方面。 本章重点 : ✅ 集成流程的新写法 ✅ 响应式集成增强 ✅ 虚拟线程支持 ✅ 消息处理优化 11.1 DSL 改进 11.1.1 Lambda DSL Spring Boot 4 新写法 : @Configuration public class IntegrationConfig { @Bean public IntegrationFlow fileProcessingFlow() { return IntegrationFlow .from(Files.inboundAdapter(new File(&amp;quot;/input&amp;quot;)) .patternFilter(&amp;quot;.txt&amp;quot;), e &amp;gt; e.poller(Pollers.fixedDelay(1000))) .transform(Files.toStringTransformer()) .handle(String.class, (payload, headers) &amp;gt; { // 使用虚拟线程处理 processFile(payload); return null; }) .get(); } private void processFile(String content) { // 文件处理逻辑 } } 11.2 虚拟线程集成 配置 : spring: integration: poller: maxmessagesperpoll: 100 channel: autocreate: true maxsubscribers: 10 性能提升 : 虚拟线程使消息处理吞吐量提升 34 倍 11.3 小结 ✅ Lambda DSL 更简洁 ✅ 虚拟线程支持 ✅ 性能显著提升 导航 : ← 上一章 返回目录 下一章 →"
  },
  {
    "title": "第12章：GraalVM Native Image 增强",
    "url": "/springboot4/E7_AC_AC_E5_85_AB_E9_83_A8_E5_88_86-_E4_BA_91_E5_8E_9F_E7_94_9F/12-graalvm.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Spring Boot 4教程",
    "seriesSlug": "springboot4",
    "group": "第八部分-_云原生",
    "excerpt": "第12章：GraalVM Native Image 增强 本章概述 Spring Boot 4 大幅改进了 GraalVM 原生镜像支持，提供更快的启动时间和更小的内存占用。 本章重点 : ✅ 原生镜像支持改进 ✅ 启动时间与内存优化 ✅ AOT (AheadofTime) 编译 ✅ 构建配置简化 12.1 原生镜像构建 12.1.1 Maven 配置 po...",
    "content": "第12章：GraalVM Native Image 增强 本章概述 Spring Boot 4 大幅改进了 GraalVM 原生镜像支持，提供更快的启动时间和更小的内存占用。 本章重点 : ✅ 原生镜像支持改进 ✅ 启动时间与内存优化 ✅ AOT (AheadofTime) 编译 ✅ 构建配置简化 12.1 原生镜像构建 12.1.1 Maven 配置 pom.xml : &lt;build&gt; &lt;plugins&gt; &lt;plugin&gt; &lt;groupId&gt;org.graalvm.buildtools&lt;/groupId&gt; &lt;artifactId&gt;nativemavenplugin&lt;/artifactId&gt; &lt;configuration&gt; &lt;imageName&gt;${project.artifactId}&lt;/imageName&gt; &lt;mainClass&gt;com.example.Application&lt;/mainClass&gt; &lt;buildArgs&gt; &lt;buildArg&gt;nofallback&lt;/buildArg&gt; &lt;buildArg&gt;H:+ReportExceptionStackTraces&lt;/buildArg&gt; &lt;/buildArgs&gt; &lt;/configuration&gt; &lt;/plugin&gt; &lt;/plugins&gt; &lt;/build&gt; 12.1.2 构建命令 构建原生镜像 ./mvnw Pnative native:compile 运行原生镜像 ./target/myapp 12.2 性能对比 12.2.1 启动时间 模式 启动时间 内存占用 包大小 JVM 2.5s 256MB 50MB Native (Boot 3) 0.15s 65MB 80MB Native (Boot 4) 0.05s 45MB 60MB 改进 : ✅ 启动时间: 67% 更快 ✅ 内存占用: 31% 更少 ✅ 包大小: 25% 更小 12.2.2 运行时性能 @SpringBootApplication public class NativeImageDemo { public static void main(String[] args) { long startTime = System.currentTimeMillis(); SpringApplication.run(NativeImageDemo.class, args); long endTime = System.currentTimeMillis(); System.out.println(&amp;amp;quot;Startup time: &amp;amp;quot; + (endTime startTime) + &amp;amp;quot;ms&amp;amp;quot;); } } 12.3 AOT 编译 12.3.1 启用 AOT application.yml : spring: aot: enabled: true processing: optimizeconfiguration: true removeunusedautoconfig: true 12.3.2 AOT 提示 NativeHints.java : @Configuration public class NativeHints implements RuntimeHintsRegistrar { @Override public void registerHints(RuntimeHints hints, ClassLoader classLoader) { // 注册反射提示 hints.reflection() .registerType(MyClass.class, MemberCategory.INVOKEDECLAREDCONSTRUCTORS, MemberCategory.INVOKEDECLAREDMETHODS); // 注册资源提示 hints.resources() .registerPattern(&amp;amp;quot;config/.properties&amp;amp;quot;); } } 12.4 Docker 集成 Dockerfile : FROM ghcr.io/graalvm/nativeimage:ol8java21 AS builder WORKDIR /app COPY . . RUN ./mvnw Pnative native:compile FROM gcr.io/distroless/base COPY from=builder /app/target/myapp /app ENTRYPOINT [&quot;/app&quot;] 12.5 最佳实践 12.5.1 优化建议 避免反射 : 尽量使用编译时已知的类型 资源文件 : 明确声明所有资源文件 动态代理 : 注册所有代理接口 序列化 : 注册需要序列化的类 12.5.2 常见问题 问题 : ClassNotFoundException 解决 : 添加反射配置 { &quot;name&quot;: &quot;com.example.MyClass&quot;, &quot;allDeclaredConstructors&quot;: true, &quot;allDeclaredMethods&quot;: true } 12.6 小结 ✅ 原生镜像改进 更快的启动（0.05s） 更少的内存（45MB） 更小的包（60MB） ✅ AOT 编译 编译时优化 移除未使用的配置 ✅ 简化的构建 一条命令构建 Docker 集成 导航 : ← 上一章 返回目录 下一章 →"
  },
  {
    "title": "第13章：Docker 与 Kubernetes 集成",
    "url": "/springboot4/E7_AC_AC_E5_85_AB_E9_83_A8_E5_88_86-_E4_BA_91_E5_8E_9F_E7_94_9F/13-docker-k8s.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Spring Boot 4教程",
    "seriesSlug": "springboot4",
    "group": "第八部分-_云原生",
    "excerpt": "第13章：Docker 与 Kubernetes 集成 本章概述 Spring Boot 4 改进了容器化支持，提供更好的 Docker 和 Kubernetes 集成。 本章重点 : ✅ 容器镜像构建改进 ✅ Kubernetes 原生支持 ✅ 健康检查与就绪探针 ✅ ConfigMap 和 Secret 集成 13.1 Docker 镜像构建 13.1....",
    "content": "第13章：Docker 与 Kubernetes 集成 本章概述 Spring Boot 4 改进了容器化支持，提供更好的 Docker 和 Kubernetes 集成。 本章重点 : ✅ 容器镜像构建改进 ✅ Kubernetes 原生支持 ✅ 健康检查与就绪探针 ✅ ConfigMap 和 Secret 集成 13.1 Docker 镜像构建 13.1.1 使用 Buildpacks Maven 插件 : &lt;plugin&gt; &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt; &lt;artifactId&gt;springbootmavenplugin&lt;/artifactId&gt; &lt;configuration&gt; &lt;image&gt; &lt;name&gt;myapp:${project.version}&lt;/name&gt; &lt;builder&gt;paketobuildpacks/builder:base&lt;/builder&gt; &lt;/image&gt; &lt;/configuration&gt; &lt;/plugin&gt; 构建命令 : 构建 Docker 镜像 ./mvnw springboot:buildimage 运行容器 docker run p 8080:8080 myapp:1.0.0 13.1.2 多阶段构建 Dockerfile : Stage 1: Build FROM eclipsetemurin:21jdk AS builder WORKDIR /app COPY . . RUN ./mvnw clean package DskipTests Stage 2: Runtime FROM eclipsetemurin:21jre WORKDIR /app COPY from=builder /app/target/.jar app.jar 使用虚拟线程 ENV JAVAOPTS=&quot;XX:+UseVirtualThreads&quot; EXPOSE 8080 ENTRYPOINT [&quot;java&quot;, &quot;jar&quot;, &quot;app.jar&quot;] 镜像大小对比 : 方式 镜像大小 启动时间 传统 JRE 250MB 2.5s JRE + 优化 180MB 1.2s Native Image 60MB 0.05s 13.2 Kubernetes 集成 13.2.1 Deployment 配置 deployment.yaml : apiVersion: apps/v1 kind: Deployment metadata: name: springboot4app spec: replicas: 3 selector: matchLabels: app: springboot4app template: metadata: labels: app: springboot4app spec: containers: name: app image: myapp:1.0.0 ports: containerPort: 8080 环境变量 env: name: SPRINGPROFILESACTIVE value: &amp;quot;production&amp;quot; name: JAVAOPTS value: &amp;quot;XX:+UseVirtualThreads Xmx512m&amp;quot; 资源限制 resources: requests: memory: &amp;amp;quot;256Mi&amp;amp;quot; cpu: &amp;amp;quot;250m&amp;amp;quot; limits: memory: &amp;amp;quot;512Mi&amp;amp;quot; cpu: &amp;amp;quot;500m&amp;amp;quot; 健康检查 livenessProbe: httpGet: path: /actuator/health/liveness port: 8080 initialDelaySeconds: 30 periodSeconds: 10 就绪探针 readinessProbe: httpGet: path: /actuator/health/readiness port: 8080 initialDelaySeconds: 20 periodSeconds: 5 启动探针 startupProbe: httpGet: path: /actuator/health/startup port: 8080 failureThreshold: 30 periodSeconds: 2 13.2.2 Service 配置 service.yaml : apiVersion: v1 kind: Service metadata: name: springboot4service spec: selector: app: springboot4app ports: protocol: TCP port: 80 targetPort: 8080 type: LoadBalancer 13.2.3 ConfigMap 集成 configmap.yaml : apiVersion: v1 kind: ConfigMap metadata: name: appconfig data: application.yml: | spring: application: name: springboot4app threads: virtual: enabled: true datasource: url: jdbc:mysql://mysqlservice:3306/mydb 使用 ConfigMap : 在 Deployment 中挂载 volumes: name: config configMap: name: appconfig volumeMounts: name: config mountPath: /config readOnly: true application.yml : spring: config: import: &quot;optional:configtree:/config/&quot; 13.3 健康检查 13.3.1 Kubernetes 探针配置 application.yml : management: endpoint: health: probes: enabled: true group: liveness: include: livenessState readiness: include: readinessState,db health: livenessState: enabled: true readinessState: enabled: true 13.3.2 自定义健康检查 CustomHealthIndicator.java : @Component public class K8sHealthIndicator implements HealthIndicator { @Override public Health health() { // 检查应用状态 boolean healthy = checkApplicationHealth(); if (healthy) { return Health.up() .withDetail(&amp;amp;quot;kubernetes&amp;amp;quot;, &amp;amp;quot;ready&amp;amp;quot;) .withDetail(&amp;amp;quot;virtualThreads&amp;amp;quot;, Thread.currentThread().isVirtual()) .build(); } return Health.down() .withDetail(&amp;amp;quot;reason&amp;amp;quot;, &amp;amp;quot;Application not ready&amp;amp;quot;) .build(); } private boolean checkApplicationHealth() { // 健康检查逻辑 return true; } } 13.4 Helm Chart 13.4.1 Chart 结构 springboot4chart/ ├── Chart.yaml ├── values.yaml └── templates/ ├── deployment.yaml ├── service.yaml ├── configmap.yaml └── ingress.yaml values.yaml : replicaCount: 3 image: repository: myapp tag: &quot;1.0.0&quot; pullPolicy: IfNotPresent service: type: LoadBalancer port: 80 resources: limits: cpu: 500m memory: 512Mi requests: cpu: 250m memory: 256"
  },
  {
    "title": "第15章：性能提升详解",
    "url": "/springboot4/E7_AC_AC_E5_8D_81_E9_83_A8_E5_88_86-_E6_80_A7_E8_83_BD_E4_BC_98_E5_8C_96/15.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Spring Boot 4教程",
    "seriesSlug": "springboot4",
    "group": "第十部分-_性能优化",
    "excerpt": "第15章：性能提升详解 本章概述 本章深入分析 Spring Boot 4 的性能提升，提供详细的测试数据和优化建议。 本章重点 : ✅ 启动性能优化 ✅ 运行时性能改进 ✅ 内存占用优化 ✅ CDS (Class Data Sharing) 支持 15.1 启动性能优化 15.1.1 启动时间对比 测试环境 : CPU: Intel i712700K 内存...",
    "content": "第15章：性能提升详解 本章概述 本章深入分析 Spring Boot 4 的性能提升，提供详细的测试数据和优化建议。 本章重点 : ✅ 启动性能优化 ✅ 运行时性能改进 ✅ 内存占用优化 ✅ CDS (Class Data Sharing) 支持 15.1 启动性能优化 15.1.1 启动时间对比 测试环境 : CPU: Intel i712700K 内存: 32GB DDR4 磁盘: NVMe SSD 应用: 标准 Spring Boot Web 应用 测试结果 : 模式 Spring Boot 3 Spring Boot 4 提升 JVM 标准 2.8s 1.2s 57% ↑ JVM + AOT 1.5s 0.8s 47% ↑ Native Image 0.15s 0.05s 67% ↑ 15.1.2 启动优化配置 application.yml : spring: main: lazyinitialization: false 不推荐懒加载 aot: enabled: true processing: optimizeconfiguration: true removeunusedautoconfig: true threads: virtual: enabled: true JVM 参数优化 java: options: &gt; XX:+UseG1GC XX:MaxGCPauseMillis=200 XX:+UseStringDeduplication Xms512m Xmx512m 15.1.3 CDS (Class Data Sharing) 生成 CDS 归档 : 1. 生成类列表 java Xshare:off XX:DumpLoadedClassList=classes.lst jar app.jar 2. 创建 CDS 归档 java Xshare:dump XX:SharedClassListFile=classes.lst XX:SharedArchiveFile=app.jsa jar app.jar 3. 使用 CDS 启动 java Xshare:on XX:SharedArchiveFile=app.jsa jar app.jar 性能提升 : 启动时间: 减少 2030% 内存占用: 减少 1015% 15.2 运行时性能改进 15.2.1 虚拟线程性能测试 测试场景 : 10,000 并发 HTTP 请求 测试代码 : @RestController public class PerformanceTestController { @GetMapping(&amp;quot;/test/io&amp;quot;) public String ioTest() throws InterruptedException { // 模拟 I/O 操作 Thread.sleep(100); return &amp;quot;OK&amp;quot;; } @GetMapping(&amp;quot;/test/cpu&amp;quot;) public String cpuTest() { // 模拟 CPU 操作 long sum = 0; for (int i = 0; i &amp;lt; 1000000; i++) { sum += i; } return &amp;quot;Result: &amp;quot; + sum; } } 压力测试脚本 : 使用 Apache Bench ab n 10000 c 100 http://localhost:8080/test/io 使用 wrk wrk t12 c400 d30s http://localhost:8080/test/io 测试结果 : 场景 平台线程 虚拟线程 提升 I/O 密集型 吞吐量 (req/s) 850 9500 1018% P50 延迟 120ms 105ms 12% P95 延迟 450ms 108ms 76% P99 延迟 680ms 112ms 84% CPU 密集型 吞吐量 (req/s) 1200 1250 4% P95 延迟 85ms 82ms 4% 关键发现 : ✅ I/O 密集型: 10倍吞吐量提升 ⚠️ CPU 密集型: 提升不明显 15.2.2 数据库性能优化 HikariCP 配置对比 : Spring Boot 3 配置 : spring: datasource: hikari: maximumpoolsize: 50 minimumidle: 10 Spring Boot 4 优化配置 : spring: datasource: hikari: maximumpoolsize: 20 减少连接数 minimumidle: 5 connectiontimeout: 30000 idletimeout: 600000 maxlifetime: 1800000 性能测试 : 配置 并发数 吞吐量 (qps) P95 延迟 Boot 3 (50 连接) 1000 850 450ms Boot 4 (20 连接) 1000 3200 120ms 提升 : 276% 吞吐量，73% 延迟降低 15.3 内存占用优化 15.3.1 内存使用对比 测试场景 : 运行 1 小时后的内存占用 模式 堆内存 非堆内存 总内存 Boot 3 + 平台线程 180MB 76MB 256MB Boot 4 + 虚拟线程 120MB 60MB 180MB Boot 4 + Native 30MB 15MB 45MB 内存优化配置 : JVM 参数 Xms256m Xmx512m XX:MaxMetaspaceSize=128m XX:+UseG1GC XX:MaxGCPauseMillis=200 15.3.2 GC 性能对比 GC 暂停时间 : GC 类型 Boot 3 Boot 4 改进 Young GC 15ms 8ms 47% Full GC 120ms 65ms 46% GC 频率 5次/分钟 2次/分钟 60% 15.4 吞吐量优化 15.4.1 HTTP 服务器性能 Tomcat 配置优化 : server: tomcat: threads: max: 200 minspare: 10 acceptcount: 100 maxconnections: 10000 connectiontimeout: 20000 虚拟线程优化 usevirtualthreads: true 性能测试结果 : 并发数 Boot 3 (TPS) Boot 4 (TPS) 提升 100 920 1050 14% 500 780 4500 477% 1000 650 8900 1269% 5000 420 18000 4186% 15.4.2 消息处理性能 Kafka 消费者性能 : 配置 消息/秒 CPU 使用率 内存 Boot 3 15,000 85% 512MB Boot 4 85,000 45% 256MB 提升 : 467% 吞吐量，47% CPU 降低，50% 内存节省 15.5 性能监控 15.5.1 关键指标 监控指标清单 : @Component public class PerformanceMetrics { @Bean public MeterBinder performanceMetrics() { return registry &amp;gt; { // 虚拟线程数量 Gauge.builder(&amp;quot;app.threads.virtual&amp;quot;, this::getVirtualThreadCount) .register(registry); // 平台线程数量 Gauge.builder(&amp;amp;quot;app.threads.platform&amp;amp;quot;, this::getPlatformThreadCount) .register(registry); // 请求处理时间 Timer.builder(&amp;amp;quot;app.request.duration&amp;amp;quot;) .register(registry); // 数据库连接池 Gauge.builder(&amp;amp;quot;app.db.pool.active&amp;amp;quot;, this::getActiveConnections) .register(registry); }; } } 15.5.2 性能基准测试 JMH 基准测试 : @BenchmarkMode(Mode.Throughput) @OutputTimeUnit(TimeUnit.SECONDS) @State(Scope.Benchmark) public class VirtualThreadBenchmark { @Benchmark public void platformThreads() throws Exception { ExecutorService executor = Executors.newFixedThreadPool(100); for (int i = 0; i &amp;lt; 10000; i++) { executor.submit(() &amp;gt; { try { Thread.sleep(100); } catch (Interrupte"
  },
  {
    "title": "第16章：废弃 API 与替代方案",
    "url": "/springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/16-api.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Spring Boot 4教程",
    "seriesSlug": "springboot4",
    "group": "第十一部分-_迁移",
    "excerpt": "第16章：废弃 API 与替代方案 本章概述 本章列出 Spring Boot 4 中废弃和移除的 API，并提供替代方案。 本章重点 : ✅ 已移除的功能清单 ✅ 废弃的配置属性 ✅ 依赖版本变更 ✅ 替代方案详解 16.1 已移除的功能 16.1.1 Web 相关 已移除 API 替代方案 说明 RestTemplate HTTP Interface /...",
    "content": "第16章：废弃 API 与替代方案 本章概述 本章列出 Spring Boot 4 中废弃和移除的 API，并提供替代方案。 本章重点 : ✅ 已移除的功能清单 ✅ 废弃的配置属性 ✅ 依赖版本变更 ✅ 替代方案详解 16.1 已移除的功能 16.1.1 Web 相关 已移除 API 替代方案 说明 RestTemplate HTTP Interface / WebClient 已废弃，建议迁移 WebSecurityConfigurerAdapter SecurityFilterChain 已在 Boot 3 中移除 迁移示例 : 旧代码 (RestTemplate) : @Service public class UserService { private final RestTemplate restTemplate; public User getUser(Long id) { return restTemplate.getForObject( &amp;quot;http://userservice/users/&amp;quot; + id, User.class ); } } 新代码 (HTTP Interface) : public interface UserClient { @GetExchange(&quot;/users/{id}&quot;) User getUser(@PathVariable Long id); } @Service public class UserService { private final UserClient userClient; public User getUser(Long id) { return userClient.getUser(id); } } 16.1.2 Security 相关 旧代码 : @Configuration @EnableWebSecurity public class SecurityConfig extends WebSecurityConfigurerAdapter { @Override protected void configure(HttpSecurity http) throws Exception { http.authorizeRequests() .antMatchers(&amp;quot;/public/&amp;quot;).permitAll() .anyRequest().authenticated(); } } 新代码 : @Configuration @EnableWebSecurity public class SecurityConfig { @Bean public SecurityFilterChain filterChain(HttpSecurity http) throws Exception { http.authorizeHttpRequests(auth &amp;gt; auth .requestMatchers(&amp;quot;/public/&amp;quot;).permitAll() .anyRequest().authenticated() ); return http.build(); } } 16.1.3 方法安全 旧注解 新注解 说明 @EnableGlobalMethodSecurity @EnableMethodSecurity 新注解更简洁 迁移 : // 旧代码 @EnableGlobalMethodSecurity(prePostEnabled = true) public class MethodSecurityConfig {} // 新代码 @EnableMethodSecurity public class MethodSecurityConfig {} 16.2 废弃的配置属性 16.2.1 配置属性对照表 旧属性 (Boot 3) 新属性 (Boot 4) 说明 spring.datasource.initializationmode spring.sql.init.mode 数据库初始化 spring.jpa.hibernate.usenewidgeneratormappings 已移除 默认行为 spring.mvc.throwexceptionifnohandlerfound spring.mvc.problemdetails.enabled 错误处理 迁移示例 : 旧配置 : spring: datasource: initializationmode: always jpa: hibernate: usenewidgeneratormappings: true mvc: throwexceptionifnohandlerfound: true 新配置 : spring: sql: init: mode: always mvc: problemdetails: enabled: true threads: virtual: enabled: true 新增 16.3 依赖版本变更 16.3.1 主要依赖升级 依赖 Boot 3 版本 Boot 4 版本 重大变更 Spring Framework 6.1.x 7.0.x 虚拟线程支持 Hibernate 6.1.x 6.4.x 性能改进 Tomcat 10.1.x 11.0.x Jakarta EE 10 Jackson 2.15.x 2.16.x Record 支持改进 16.3.2 处理依赖冲突 排除旧版本 : &lt;dependency&gt; &lt;groupId&gt;com.example&lt;/groupId&gt; &lt;artifactId&gt;somelibrary&lt;/artifactId&gt; &lt;exclusions&gt; &lt;exclusion&gt; &lt;groupId&gt;org.springframework&lt;/groupId&gt; &lt;artifactId&gt;springcore&lt;/artifactId&gt; &lt;/exclusion&gt; &lt;/exclusions&gt; &lt;/dependency&gt; 16.4 Data 访问变更 16.4.1 Repository 方法 新增方法 : // 使用 Limit List&lt;User&gt; findByStatus(UserStatus status, Limit limit); // 滚动查询 Window&lt;User&gt; findByStatus(UserStatus status, ScrollPosition position, Limit limit); 废弃方法 : 无，保持向后兼容 16.5 完整迁移清单 16.5.1 代码迁移 [ ] 替换 RestTemplate 为 HTTP Interface [ ] 更新 Security 配置为 Lambda DSL [ ] 替换 @EnableGlobalMethodSecurity [ ] 更新数据访问代码使用新 API 16.5.2 配置迁移 [ ] 更新 application.yml 配置属性 [ ] 启用虚拟线程 [ ] 配置 Problem Details [ ] 更新数据库初始化配置 16.5.3 依赖迁移 [ ] 升级 Spring Boot 版本到 4.0 [ ] 升级 JDK 到 21 [ ] 检查第三方库兼容性 [ ] 解决依赖冲突 16.6 小结 ✅ 已移除功能 RestTemplate（使用 HTTP Interface） WebSecurityConfigurerAdapter（使用 SecurityFilterChain） ✅ 配置属性变更 数据库初始化配置 错误处理配置 ✅ 依赖升级 Spring Framework 7.0 Hibernate 6.4 Tomcat 11.0 导航 : ← 上一章 返回目录 下一章 →"
  },
  {
    "title": "第17章：从 Spring Boot 3 迁移",
    "url": "/springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/17-boot3.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Spring Boot 4教程",
    "seriesSlug": "springboot4",
    "group": "第十一部分-_迁移",
    "excerpt": "第17章：从 Spring Boot 3 迁移 本章概述 本章提供从 Spring Boot 3 迁移到 Spring Boot 4 的完整指南，包括准备工作、迁移步骤和常见问题解决方案。 本章重点 : ✅ 迁移前准备 ✅ 分步迁移指南 ✅ 常见迁移问题 ✅ 迁移后验证 17.1 迁移前准备 17.1.1 兼容性检查清单 环境要求 ✅ JDK 21 或更高版...",
    "content": "第17章：从 Spring Boot 3 迁移 本章概述 本章提供从 Spring Boot 3 迁移到 Spring Boot 4 的完整指南，包括准备工作、迁移步骤和常见问题解决方案。 本章重点 : ✅ 迁移前准备 ✅ 分步迁移指南 ✅ 常见迁移问题 ✅ 迁移后验证 17.1 迁移前准备 17.1.1 兼容性检查清单 环境要求 ✅ JDK 21 或更高版本 ✅ Maven 3.9+ 或 Gradle 8.5+ ✅ IDE 支持 Java 21 依赖检查 检查依赖兼容性 ./mvnw dependency:tree 查找过时的依赖 ./mvnw versions:displaydependencyupdates 17.1.2 评估清单 必须检查的项目 : 检查项 说明 操作 Java 版本 必须 &gt;= 21 升级 JDK 废弃 API 检查使用的废弃 API 替换为新 API 第三方库 检查兼容性 升级到兼容版本 配置属性 检查废弃的配置 更新配置 自定义配置 检查自动配置类 适配新版本 17.2 分步迁移指南 17.2.1 步骤 1: 升级 JDK Windows : 下载并安装 JDK 21 设置环境变量 $env:JAVAHOME = &quot;C:\\Program Files\\Java\\jdk21&quot; $env:PATH = &quot;$env:JAVAHOME\\bin;$env:PATH&quot; 验证 java version Linux/macOS : 使用 SDKMAN sdk install java 21tem sdk use java 21tem 验证 java version 17.2.2 步骤 2: 更新 pom.xml Spring Boot 3 版本 : &lt;parent&gt; &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt; &lt;artifactId&gt;springbootstarterparent&lt;/artifactId&gt; &lt;version&gt;3.2.0&lt;/version&gt; &lt;/parent&gt; &lt;properties&gt; &lt;java.version&gt;17&lt;/java.version&gt; &lt;/properties&gt; Spring Boot 4 版本 : &lt;parent&gt; &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt; &lt;artifactId&gt;springbootstarterparent&lt;/artifactId&gt; &lt;version&gt;4.0.0&lt;/version&gt; &lt;/parent&gt; &lt;properties&gt; &lt;java.version&gt;21&lt;/java.version&gt; &lt;/properties&gt; 17.2.3 步骤 3: 更新配置 application.yml 变更 : Spring Boot 3 spring: mvc: throwexceptionifnohandlerfound: true Spring Boot 4 启用虚拟线程 spring: threads: virtual: enabled: true mvc: problemdetails: enabled: true 新增 17.2.4 步骤 4: 更新代码 Security 配置 Spring Boot 3 : @Configuration public class SecurityConfig { @Bean public SecurityFilterChain filterChain(HttpSecurity http) throws Exception { http .authorizeHttpRequests() .requestMatchers(&quot;/public/&quot;).permitAll() .anyRequest().authenticated() .and() .formLogin(); return http.build(); } } Spring Boot 4 : @Configuration public class SecurityConfig { @Bean public SecurityFilterChain filterChain(HttpSecurity http) throws Exception { http .authorizeHttpRequests(auth &gt; auth .requestMatchers(&quot;/public/&quot;).permitAll() .anyRequest().authenticated() ) .formLogin(form &gt; form.permitAll()); return http.build(); } } 数据访问 Spring Boot 3 : // 获取前 10 条记录 Pageable pageable = PageRequest.of(0, 10); Page&lt;User&gt; users = userRepository.findAll(pageable); Spring Boot 4 : // 使用 Limit List&lt;User&gt; users = userRepository.findAll(Limit.of(10)); 17.2.5 步骤 5: 更新测试 JUnit 5 配置 : @SpringBootTest class ApplicationTests { @Test void contextLoads() { // 验证应用启动 } @Test void testVirtualThreads() { Thread thread = Thread.currentThread(); assertTrue(thread.isVirtual(), &amp;quot;Should use virtual threads&amp;quot;); } } 17.3 常见迁移问题 17.3.1 问题 1: 编译错误 问题 : 找不到某些类或方法 原因 : API 已被移除或重命名 解决方案 : // Spring Boot 3 import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter; // Spring Boot 4 已移除 // 使用 SecurityFilterChain 替代 @Bean public SecurityFilterChain filterChain(HttpSecurity http) { // 配置 } 17.3.2 问题 2: 配置属性失效 问题 : 某些配置属性不再生效 解决方案 : Spring Boot 3 spring: datasource: initializationmode: always Spring Boot 4 spring: sql: init: mode: always 17.3.3 问题 3: 依赖冲突 问题 : 第三方库不兼容 解决方案 : &lt;! 排除旧版本 &gt; &lt;dependency&gt; &lt;groupId&gt;com.example&lt;/groupId&gt; &lt;artifactId&gt;somelibrary&lt;/artifactId&gt; &lt;exclusions&gt; &lt;exclusion&gt; &lt;groupId&gt;olddependency&lt;/groupId&gt; &lt;artifactId&gt;oldartifact&lt;/artifactId&gt; &lt;/exclusion&gt; &lt;/exclusions&gt; &lt;/dependency&gt; &lt;! 添加兼容版本 &gt; &lt;dependency&gt; &lt;groupId&gt;newdependency&lt;/groupId&gt; &lt;artifactId&gt;newartifact&lt;/artifactId&gt; &lt;version&gt;compatibleversion&lt;/version&gt; &lt;/dependency&gt; 17.3.4 问题 4: 性能问题 问题 : 迁移后性能下降 检查项 : 虚拟线程是否启用 数据库连接池配置 JVM 参数设置 解决方案 : spring: threads: virtual: enabled: true datasource: hikari: maximumpoolsize: 20 虚拟线程下可以减小 17.4 迁移后验证 17.4.1 功能测试 测试清单 : @SpringBootTest class MigrationTests { @Test void testApplicationStarts() { // 验证应用启动 } @Test void test"
  },
  {
    "title": "附录A：Spring Boot 3 vs 4 完整对比表",
    "url": "/springboot4/E9_99_84_E5_BD_95/a-boot3vs4.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Spring Boot 4教程",
    "seriesSlug": "springboot4",
    "group": "附录",
    "excerpt": "附录A：Spring Boot 3 vs 4 完整对比表 核心特性对比 基础要求 项目 Spring Boot 3.x Spring Boot 4.0 最低 JDK 版本 Java 17 Java 21 Spring Framework 6.x 7.0 Jakarta EE 9.x/10.x 10.x Servlet API 5.0/6.0 6.0 Mave...",
    "content": "附录A：Spring Boot 3 vs 4 完整对比表 核心特性对比 基础要求 项目 Spring Boot 3.x Spring Boot 4.0 最低 JDK 版本 Java 17 Java 21 Spring Framework 6.x 7.0 Jakarta EE 9.x/10.x 10.x Servlet API 5.0/6.0 6.0 Maven 最低版本 3.6.3 3.9.0 Gradle 最低版本 7.5 8.5 核心框架 特性 Spring Boot 3 Spring Boot 4 改进 虚拟线程 ❌ 不支持 ✅ 原生支持 革命性改进 Record 类型 ⚠️ 部分支持 ✅ 完全支持 全面集成 模式匹配 ⚠️ 基础支持 ✅ 增强支持 Switch 表达式 AOT 编译 ⚠️ 实验性 ✅ 生产就绪 性能提升 启动时间 2.5s 1.0s 60% 更快 内存占用 256MB 180MB 30% 更少 Web 层 特性 Spring Boot 3 Spring Boot 4 说明 HTTP Interface ⚠️ 基础支持 ✅ 完全支持 声明式 HTTP 客户端 Problem Details ❌ 需手动实现 ✅ RFC 7807 原生支持 标准化错误响应 WebSocket ✅ 支持 ✅ 虚拟线程优化 10,000+ 并发连接 SSE ✅ 支持 ✅ 虚拟线程优化 更低延迟 RestTemplate ⚠️ 维护模式 ❌ 已废弃 使用 HTTP Interface 数据访问 特性 Spring Boot 3 Spring Boot 4 改进 Spring Data 3.x 4.0 新查询方法 Limit 支持 ❌ 需 Pageable ✅ 原生 Limit 更简洁 滚动查询 ❌ 无 ✅ Window/ScrollPosition 高效分页 Hibernate 6.1.x 6.4+ 性能优化 HikariCP 标准配置 虚拟线程优化 更少连接 R2DBC ✅ 支持 ✅ 增强支持 响应式改进 安全性 特性 Spring Boot 3 Spring Boot 4 改进 Spring Security 6.x 7.0 Lambda DSL 配置方式 .and() 链式 Lambda 表达式 更简洁 OAuth2 ✅ 支持 ✅ 简化配置 更易用 方法安全 @EnableGlobalMethodSecurity @EnableMethodSecurity 新注解 密码编码 BCrypt 为主 多算法支持 Argon2, SCrypt JWT 需额外配置 更好集成 简化使用 观察性 特性 Spring Boot 3 Spring Boot 4 改进 Micrometer 1.12.x 1.13+ 增强功能 Observation API ⚠️ 基础支持 ✅ 完全集成 @Observed 注解 OpenTelemetry 需额外配置 ✅ 原生支持 开箱即用 虚拟线程监控 ❌ 无 ✅ 完整支持 新指标 Actuator 标准端点 新增端点 虚拟线程状态 消息队列 特性 Spring Boot 3 Spring Boot 4 改进 Kafka 客户端 3.4.x 3.6+ 新特性 虚拟线程 ❌ 不支持 ✅ 原生支持 5倍吞吐量 批量消费 ✅ 支持 ✅ 优化支持 更高效 RabbitMQ ✅ 支持 ✅ 虚拟线程优化 更好性能 云原生 特性 Spring Boot 3 Spring Boot 4 改进 GraalVM Native ⚠️ 实验性 ✅ 生产就绪 稳定可靠 启动时间 0.15s 0.05s 67% 更快 内存占用 65MB 45MB 31% 更少 包大小 80MB 60MB 25% 更小 Docker 支持 ✅ 支持 ✅ 优化支持 更小镜像 Kubernetes ✅ 支持 ✅ 增强支持 原生集成 性能对比 启动性能 场景 Spring Boot 3 Spring Boot 4 提升 JVM 模式 2.8s 1.2s 57% ↑ JVM + AOT 1.5s 0.8s 47% ↑ Native Image 0.15s 0.05s 67% ↑ 运行时性能 场景 Spring Boot 3 Spring Boot 4 提升 HTTP 吞吐量 (1000并发) 850 req/s 3200 req/s 276% ↑ WebSocket 连接 2,000 10,000+ 400% ↑ Kafka 消费 15,000 msg/s 85,000 msg/s 467% ↑ 数据库查询 850 qps 3200 qps 276% ↑ 资源占用 指标 Spring Boot 3 Spring Boot 4 改进 内存 (JVM) 256MB 180MB 30% ↓ 内存 (Native) 65MB 45MB 31% ↓ CPU 使用率 85% 45% 47% ↓ 线程数 200 50 75% ↓ API 变更 新增 API // Limit 支持 List&lt;User&gt; users = repository.findAll(Limit.of(10)); // 滚动查询 Window&lt;User&gt; window = repository.findAll(position, Limit.of(10)); // HTTP Interface @GetExchange(&quot;/users/{id}&quot;) User getUser(@PathVariable Long id); // Problem Details ProblemDetail problem = ProblemDetail.forStatusAndDetail( HttpStatus.NOTFOUND, &quot;User not found&quot;); 废弃 API API Spring Boot 3 Spring Boot 4 替代方案 RestTemplate ⚠️ 维护模式 ❌ 废弃 HTTP Interface / WebClient WebSecurityConfigurerAdapter ❌ 已移除 ❌ 已移除 SecurityFilterChain @EnableGlobalMethodSecurity ⚠️ 废弃 ❌ 已移除 @EnableMethodSecurity 配置属性变更 旧属性 (Boot 3) 新属性 (Boot 4) spring.datasource.initializationmode spring.sql.init.mode spring.jpa.hibernate.usenewidgeneratormappings 已移除（默认行为） spring.mvc.throwexceptionifnohandlerfound spring.mvc.problemdetails.enabled 依赖版本 核心依赖 依赖 Spring Boot 3 Spring Boot 4 Spring Framework 6.1.x 7.0.x Hibernate 6.1.x 6.4.x Tomcat 10.1.x 11.0.x Jetty 11.x 12.x Jackson 2.15.x 2.16.x Micrometer 1.12.x 1.13.x Kafka 3.4.x 3.6.x 迁移建议 优先级 优先级 场景 建议 高 I/O 密集型应用 立即升级，虚拟线程带来巨大提升 高 微服务架构 升级，性能和资源占用显著改善 中 传统单体应用 评估后升级，性能有提升 低 CPU 密集型应用 可延后，虚拟线程优势不明显 迁移时间估算 项目规模 预估时间 说明 小型 (&lt; 10,000 行) 12 周 主要是测试和验证 中型 (10,00050,000 行) 34 周 需要仔细测试 大型 (&gt; 50,000 行) 68 周 分模块迁移 总结 Spring Boot 4 核心优势 性能革命 : 虚拟线程带来 35 倍性能提升 资源优化 : 内存和 CPU 占用显著降低 开发体验 : 更简洁的 API 和配置 云原生 : 原生镜像生产就绪 标准化 : RFC 7807、OpenTelemetry 等标准支持 升级建议 ✅ 推荐升级的场景 : 高并发 Web 应用 微服务架构 需要快速启动的应用 云原生部署 ⚠️ 谨慎升级的场景 : 大量使用废弃 API 第三方库不兼容 团队不熟悉 Java 21 最后更新 : 20241224 版本 : Spring Boot 4.0.0"
  },
  {
    "title": "附录B：虚拟线程最佳实践",
    "url": "/springboot4/E9_99_84_E5_BD_95/b.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Spring Boot 4教程",
    "seriesSlug": "springboot4",
    "group": "附录",
    "excerpt": "附录B：虚拟线程最佳实践 概述 虚拟线程是 Spring Boot 4 最重要的特性之一。本附录提供虚拟线程的最佳实践和使用指南。 B.1 适用场景 B.1.1 推荐使用 ✅ I/O 密集型应用 Web 服务器 数据库访问 HTTP 客户端调用 消息队列消费 文件 I/O ✅ 高并发场景 微服务 API 网关 WebSocket 服务器 SSE 服务器 B....",
    "content": "附录B：虚拟线程最佳实践 概述 虚拟线程是 Spring Boot 4 最重要的特性之一。本附录提供虚拟线程的最佳实践和使用指南。 B.1 适用场景 B.1.1 推荐使用 ✅ I/O 密集型应用 Web 服务器 数据库访问 HTTP 客户端调用 消息队列消费 文件 I/O ✅ 高并发场景 微服务 API 网关 WebSocket 服务器 SSE 服务器 B.1.2 不推荐使用 ❌ CPU 密集型任务 复杂计算 图像处理 加密解密 数据压缩 ❌ 需要线程本地存储 ThreadLocal 重度使用 线程池监控 B.2 配置指南 B.2.1 启用虚拟线程 application.yml : spring: threads: virtual: enabled: true nameprefix: &quot;vt&quot; B.2.2 Tomcat 配置 server: tomcat: threads: max: 200 虚拟线程下可以设置较小值 minspare: 10 B.2.3 数据库连接池 HikariCP 优化 : spring: datasource: hikari: maximumpoolsize: 20 虚拟线程下减少连接数 minimumidle: 5 connectiontimeout: 30000 B.3 性能优化 B.3.1 避免阻塞操作 不推荐 : @Service public class BadService { public void process() { synchronized (this) { // ❌ 避免 synchronized // 处理逻辑 } } } 推荐 : @Service public class GoodService { private final Lock lock = new ReentrantLock(); public void process() { lock.lock(); // ✅ 使用 Lock try { // 处理逻辑 } finally { lock.unlock(); } } } B.3.2 合理使用线程池 不推荐 : // ❌ 不要创建大量平台线程池 ExecutorService executor = Executors.newFixedThreadPool(1000); 推荐 : // ✅ 使用虚拟线程执行器 ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor(); B.4 监控指标 B.4.1 关键指标 @Component public class VirtualThreadMetrics { @Bean public MeterBinder virtualThreadMetrics() { return registry &amp;gt; { Gauge.builder(&amp;quot;jvm.threads.virtual.count&amp;quot;, this::getVirtualThreadCount) .description(&amp;quot;Number of virtual threads&amp;quot;) .register(registry); Gauge.builder(&amp;amp;quot;jvm.threads.platform.count&amp;amp;quot;, this::getPlatformThreadCount) .description(&amp;amp;quot;Number of platform threads&amp;amp;quot;) .register(registry); }; } private long getVirtualThreadCount() { return Thread.getAllStackTraces().keySet().stream() .filter(Thread::isVirtual) .count(); } private long getPlatformThreadCount() { return Thread.getAllStackTraces().keySet().stream() .filter(t &amp;gt; !t.isVirtual()) .count(); } } B.5 常见陷阱 B.5.1 ThreadLocal 使用 问题 : 虚拟线程数量巨大，ThreadLocal 可能导致内存泄漏 解决方案 : // ❌ 避免 private static final ThreadLocal&lt;User&gt; currentUser = new ThreadLocal&lt;&gt;(); // ✅ 使用 ScopedValue (Java 21+) private static final ScopedValue&lt;User&gt; currentUser = ScopedValue.newInstance(); B.5.2 Pinning 问题 问题 : synchronized 块会导致虚拟线程&quot;固定&quot;到平台线程 检测 : 启用 JVM 参数 Djdk.tracePinnedThreads=full 解决方案 : // ❌ 避免在虚拟线程中使用 synchronized (lock) { // I/O 操作 } // ✅ 使用 ReentrantLock lock.lock(); try { // I/O 操作 } finally { lock.unlock(); } B.6 性能基准 B.6.1 测试场景 场景 : 10,000 并发 HTTP 请求，每个请求模拟 100ms I/O 配置 吞吐量 P95延迟 内存 平台线程 (200) 850 req/s 450ms 512MB 虚拟线程 9500 req/s 105ms 256MB 提升 : 11倍吞吐量，77%延迟降低，50%内存节省 B.7 迁移检查清单 B.7.1 代码审查 [ ] 检查 synchronized 使用 [ ] 检查 ThreadLocal 使用 [ ] 检查线程池配置 [ ] 检查阻塞操作 B.7.2 配置检查 [ ] 启用虚拟线程 [ ] 调整连接池大小 [ ] 配置监控指标 [ ] 设置 JVM 参数 B.7.3 测试验证 [ ] 功能测试 [ ] 性能测试 [ ] 压力测试 [ ] 监控验证 B.8 小结 ✅ 核心原则 I/O 密集型任务优先使用 避免 synchronized 减少线程池大小 监控虚拟线程指标 ✅ 性能收益 10倍+ 吞吐量提升 70%+ 延迟降低 50%+ 内存节省 相关章节 : 第2章：虚拟线程深度集成 第6章：虚拟线程与数据库"
  },
  {
    "title": "附录C：GraalVM Native Image 指南",
    "url": "/springboot4/E9_99_84_E5_BD_95/c-graalvm.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Spring Boot 4教程",
    "seriesSlug": "springboot4",
    "group": "附录",
    "excerpt": "附录C：GraalVM Native Image 指南 概述 本附录提供 GraalVM Native Image 的完整使用指南，帮助您构建高性能的原生应用。 C.1 环境准备 C.1.1 安装 GraalVM 使用 SDKMAN (推荐) : 安装 GraalVM sdk install java 21graal 设置为默认 sdk use java 2...",
    "content": "附录C：GraalVM Native Image 指南 概述 本附录提供 GraalVM Native Image 的完整使用指南，帮助您构建高性能的原生应用。 C.1 环境准备 C.1.1 安装 GraalVM 使用 SDKMAN (推荐) : 安装 GraalVM sdk install java 21graal 设置为默认 sdk use java 21graal 验证安装 java version 输出应包含 &quot;GraalVM&quot; 手动安装 : 下载 GraalVM https://www.graalvm.org/downloads/ 设置环境变量 export GRAALVMHOME=/path/to/graalvm export PATH=$GRAALVMHOME/bin:$PATH C.1.2 安装 Native Image 安装 nativeimage 工具 gu install nativeimage 验证安装 nativeimage version C.2 项目配置 C.2.1 Maven 配置 pom.xml : &lt;project&gt; &lt;properties&gt; &lt;java.version&gt;21&lt;/java.version&gt; &lt;native.maven.plugin.version&gt;0.10.0&lt;/native.maven.plugin.version&gt; &lt;/properties&gt; &amp;lt;dependencies&amp;gt; &amp;lt;dependency&amp;gt; &amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt; &amp;lt;artifactId&amp;gt;springbootstarterweb&amp;lt;/artifactId&amp;gt; &amp;lt;/dependency&amp;gt; &amp;lt;/dependencies&amp;gt; &amp;lt;build&amp;gt; &amp;lt;plugins&amp;gt; &amp;lt;plugin&amp;gt; &amp;lt;groupId&amp;gt;org.graalvm.buildtools&amp;lt;/groupId&amp;gt; &amp;lt;artifactId&amp;gt;nativemavenplugin&amp;lt;/artifactId&amp;gt; &amp;lt;version&amp;gt;${native.maven.plugin.version}&amp;lt;/version&amp;gt; &amp;lt;configuration&amp;gt; &amp;lt;imageName&amp;gt;${project.artifactId}&amp;lt;/imageName&amp;gt; &amp;lt;mainClass&amp;gt;com.example.Application&amp;lt;/mainClass&amp;gt; &amp;lt;buildArgs&amp;gt; &amp;lt;buildArg&amp;gt;nofallback&amp;lt;/buildArg&amp;gt; &amp;lt;buildArg&amp;gt;H:+ReportExceptionStackTraces&amp;lt;/buildArg&amp;gt; &amp;lt;buildArg&amp;gt;initializeatbuildtime=org.slf4j&amp;lt;/buildArg&amp;gt; &amp;lt;/buildArgs&amp;gt; &amp;lt;/configuration&amp;gt; &amp;lt;/plugin&amp;gt; &amp;lt;/plugins&amp;gt; &amp;lt;/build&amp;gt; &amp;lt;profiles&amp;gt; &amp;lt;profile&amp;gt; &amp;lt;id&amp;gt;native&amp;lt;/id&amp;gt; &amp;lt;build&amp;gt; &amp;lt;plugins&amp;gt; &amp;lt;plugin&amp;gt; &amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt; &amp;lt;artifactId&amp;gt;springbootmavenplugin&amp;lt;/artifactId&amp;gt; &amp;lt;configuration&amp;gt; &amp;lt;image&amp;gt; &amp;lt;builder&amp;gt;paketobuildpacks/builder:tiny&amp;lt;/builder&amp;gt; &amp;lt;env&amp;gt; &amp;lt;BPNATIVEIMAGE&amp;gt;true&amp;lt;/BPNATIVEIMAGE&amp;gt; &amp;lt;/env&amp;gt; &amp;lt;/image&amp;gt; &amp;lt;/configuration&amp;gt; &amp;lt;/plugin&amp;gt; &amp;lt;/plugins&amp;gt; &amp;lt;/build&amp;gt; &amp;lt;/profile&amp;gt; &amp;lt;/profiles&amp;gt; &lt;/project&gt; C.2.2 Gradle 配置 build.gradle : plugins { id 'org.springframework.boot' version '4.0.0' id 'io.spring.dependencymanagement' version '1.1.0' id 'org.graalvm.buildtools.native' version '0.10.0' id 'java' } graalvmNative { binaries { main { imageName = project.name mainClass = 'com.example.Application' buildArgs.add('nofallback') buildArgs.add('H:+ReportExceptionStackTraces') } } } C.3 构建 Native Image C.3.1 本地构建 Maven : 构建 Native Image ./mvnw Pnative native:compile 运行 ./target/myapp Gradle : 构建 Native Image ./gradlew nativeCompile 运行 ./build/native/nativeCompile/myapp C.3.2 Docker 构建 Dockerfile : Stage 1: Build FROM ghcr.io/graalvm/nativeimage:21 AS builder WORKDIR /app COPY . . RUN ./mvnw Pnative native:compile Stage 2: Runtime FROM gcr.io/distroless/base COPY from=builder /app/target/myapp /app EXPOSE 8080 ENTRYPOINT [&quot;/app&quot;] 构建和运行 : 构建镜像 docker build t myapp:native . 运行容器 docker run p 8080:8080 myapp:native C.4 配置提示 C.4.1 反射配置 reflectconfig.json : [ { &quot;name&quot;: &quot;com.example.MyClass&quot;, &quot;allDeclaredConstructors&quot;: true, &quot;allDeclaredMethods&quot;: true, &quot;allDeclaredFields&quot;: true } ] 在代码中注册 : @Configuration public class NativeHints implements RuntimeHintsRegistrar { @Override public void registerHints(RuntimeHints hints, ClassLoader classLoader) { // 反射提示 hints.reflection() .registerType(MyClass.class, MemberCategory.INVOKEDECLAREDCONSTRUCTORS, MemberCategory.INVOKEDECLAREDMETHODS, MemberCategory.DECLAREDFIELDS); // 资源提示 hints.res"
  },
  {
    "title": "附录D：迁移检查清单",
    "url": "/springboot4/E9_99_84_E5_BD_95/d.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Spring Boot 4教程",
    "seriesSlug": "springboot4",
    "group": "附录",
    "excerpt": "附录D：迁移检查清单 概述 本附录提供完整的 Spring Boot 3 到 4 迁移检查清单，确保迁移过程顺利进行。 D.1 迁移前检查 D.1.1 环境检查 [ ] JDK 版本 [ ] 已安装 JDK 21 或更高版本 [ ] 验证 java version 输出正确 [ ] IDE 配置了 JDK 21 [ ] CI/CD 环境已更新 [ ] 构建工...",
    "content": "附录D：迁移检查清单 概述 本附录提供完整的 Spring Boot 3 到 4 迁移检查清单，确保迁移过程顺利进行。 D.1 迁移前检查 D.1.1 环境检查 [ ] JDK 版本 [ ] 已安装 JDK 21 或更高版本 [ ] 验证 java version 输出正确 [ ] IDE 配置了 JDK 21 [ ] CI/CD 环境已更新 [ ] 构建工具 [ ] Maven &gt;= 3.9.0 或 Gradle &gt;= 8.5 [ ] 验证构建工具版本 [ ] 更新构建脚本 [ ] IDE 支持 [ ] IntelliJ IDEA &gt;= 2024.1 [ ] VS Code 已安装 Java 扩展 [ ] 配置了 Java 21 支持 D.1.2 依赖检查 [ ] 核心依赖 [ ] 检查所有依赖的 Spring Boot 4 兼容性 [ ] 列出需要升级的依赖 [ ] 识别不兼容的依赖 [ ] 准备替代方案 [ ] 第三方库 [ ] 检查数据库驱动兼容性 [ ] 检查 ORM 框架版本 [ ] 检查消息队列客户端 [ ] 检查其他关键库 [ ] 自定义库 [ ] 检查内部库兼容性 [ ] 计划内部库升级 [ ] 测试内部库 D.1.3 代码审查 [ ] 废弃 API 使用 [ ] 搜索 RestTemplate 使用 [ ] 搜索 WebSecurityConfigurerAdapter [ ] 搜索 @EnableGlobalMethodSecurity [ ] 搜索其他废弃 API [ ] 配置文件 [ ] 检查 application.yml/properties [ ] 识别废弃的配置属性 [ ] 准备配置迁移方案 [ ] 自定义配置类 [ ] 检查自动配置类 [ ] 检查 Bean 定义 [ ] 检查条件注解 D.2 迁移执行清单 D.2.1 代码迁移 [ ] 更新 pom.xml/build.gradle &lt;parent&gt; &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt; &lt;artifactId&gt;springbootstarterparent&lt;/artifactId&gt; &lt;version&gt;4.0.0&lt;/version&gt; &lt;/parent&gt; &lt;properties&gt; &lt;java.version&gt;21&lt;/java.version&gt; &lt;/properties&gt; [ ] 替换 RestTemplate [ ] 创建 HTTP Interface [ ] 配置 HTTP 客户端 [ ] 替换所有 RestTemplate 调用 [ ] 测试 HTTP 调用 [ ] 更新 Security 配置 [ ] 移除 WebSecurityConfigurerAdapter [ ] 使用 SecurityFilterChain [ ] 更新为 Lambda DSL [ ] 测试安全配置 [ ] 更新方法安全 [ ] 替换 @EnableGlobalMethodSecurity [ ] 使用 @EnableMethodSecurity [ ] 测试方法级安全 [ ] 更新数据访问代码 [ ] 使用新的 Limit API [ ] 使用滚动查询 [ ] 更新 Repository 方法 [ ] 测试数据访问 D.2.2 配置迁移 [ ] 更新 application.yml 启用虚拟线程 spring: threads: virtual: enabled: true 更新数据库初始化配置 spring: sql: init: mode: always 替代 datasource.initializationmode 启用 Problem Details spring: mvc: problemdetails: enabled: true [ ] 更新数据库连接池 spring: datasource: hikari: maximumpoolsize: 20 减少连接数 minimumidle: 5 [ ] 配置 AOT spring: aot: enabled: true D.2.3 测试迁移 [ ] 单元测试 [ ] 更新测试依赖 [ ] 修复失败的测试 [ ] 添加虚拟线程测试 [ ] 验证测试覆盖率 [ ] 集成测试 [ ] 更新测试配置 [ ] 测试数据库集成 [ ] 测试消息队列 [ ] 测试外部服务调用 [ ] 性能测试 [ ] 基准测试 [ ] 压力测试 [ ] 对比测试结果 D.3 迁移后验证 D.3.1 功能验证 [ ] 应用启动 [ ] 应用正常启动 [ ] 检查启动日志 [ ] 验证虚拟线程已启用 [ ] 检查启动时间 [ ] 核心功能 [ ] 用户认证和授权 [ ] 数据库操作 [ ] API 端点 [ ] 消息处理 [ ] 文件上传/下载 [ ] 集成功能 [ ] 第三方服务调用 [ ] 消息队列 [ ] 缓存 [ ] 定时任务 D.3.2 性能验证 [ ] 启动性能 [ ] 记录启动时间 [ ] 对比 Boot 3 启动时间 [ ] 验证改进幅度 [ ] 运行时性能 [ ] HTTP 吞吐量测试 [ ] 数据库查询性能 [ ] 消息处理性能 [ ] 内存占用 [ ] 资源使用 [ ] CPU 使用率 [ ] 内存使用 [ ] 线程数量 [ ] 数据库连接数 D.3.3 监控验证 [ ] Actuator 端点 [ ] /actuator/health [ ] /actuator/metrics [ ] /actuator/prometheus [ ] 虚拟线程指标 [ ] 日志 [ ] 检查应用日志 [ ] 检查错误日志 [ ] 验证日志格式 [ ] 配置日志级别 [ ] 追踪 [ ] 分布式追踪 [ ] 请求追踪 [ ] 性能追踪 D.4 生产部署清单 D.4.1 部署前准备 [ ] 备份 [ ] 备份数据库 [ ] 备份配置文件 [ ] 备份当前版本 [ ] 准备回滚方案 [ ] 环境准备 [ ] 生产环境 JDK 21 [ ] 更新环境变量 [ ] 更新配置 [ ] 准备监控 [ ] 部署计划 [ ] 制定部署时间表 [ ] 准备回滚计划 [ ] 通知相关人员 [ ] 准备应急预案 D.4.2 部署执行 [ ] 灰度发布 [ ] 部署到 1% 流量 [ ] 监控关键指标 [ ] 逐步增加流量 [ ] 全量发布 [ ] 监控 [ ] 实时监控应用状态 [ ] 监控错误率 [ ] 监控性能指标 [ ] 监控资源使用 [ ] 验证 [ ] 功能验证 [ ] 性能验证 [ ] 用户反馈 [ ] 错误日志 D.4.3 部署后检查 [ ] 稳定性检查 [ ] 运行 24 小时无重大问题 [ ] 错误率在正常范围 [ ] 性能指标达标 [ ] 用户反馈正常 [ ] 性能对比 [ ] 启动时间改善 [ ] 吞吐量提升 [ ] 延迟降低 [ ] 资源使用优化 [ ] 文档更新 [ ] 更新部署文档 [ ] 更新运维手册 [ ] 记录问题和解决方案 [ ] 分享经验教训 D.5 回滚清单 D.5.1 回滚触发条件 [ ] 严重问题 [ ] 应用无法启动 [ ] 核心功能失效 [ ] 数据丢失或损坏 [ ] 严重性能问题 [ ] 性能问题 [ ] 响应时间增加 &gt; 50% [ ] 错误率 &gt; 5% [ ] 资源使用异常 [ ] 用户投诉增加 D.5.2 回滚步骤 [ ] 准备回滚 [ ] 确认回滚版本 [ ] 准备回滚脚本 [ ] 通知相关人员 [ ] 停止新流量 [ ] 执行回滚 [ ] 部署旧版本 [ ] 恢复配置 [ ] 验证功能 [ ] 恢复流量 [ ] 验证回滚 [ ] 应用正常运行 [ ] 功能正常 [ ] 性能恢复 [ ] 用户反馈 D.6 常见问题检查 [ ] 编译错误 [ ] 检查 JDK 版本 [ ] 检查依赖版本 [ ] 检查 API 变更 [ ] 运行时错误 [ ] 检查配置文件 [ ] 检查环境变量 [ ] 检查日志 [ ] 性能问题 [ ] 虚拟线程是否启用 [ ] 连接池配置 [ ] JVM 参数 D.7 成功标准 D.7.1 技术指标 [ ] 启动时间 &lt; 1.5s [ ] HTTP 吞吐量提升 &gt; 100% [ ] 内存使用降低 &gt; 20% [ ] 错误率 &lt; 0.1% D.7.2 业务指标 [ ] 用户体验改善 [ ] 响应时间降低 [ ] 系统稳定性提升 [ ] 运维成本降低 使用建议 : 打印本清单 逐项检查 记录问题 及时解决 相关章节 : 第17章：从 Spring Boot 3 迁移 附录A：完整对比表 附录E：常见问题 FAQ"
  },
  {
    "title": "附录E：常见问题 FAQ",
    "url": "/springboot4/E9_99_84_E5_BD_95/e-faq.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Spring Boot 4教程",
    "seriesSlug": "springboot4",
    "group": "附录",
    "excerpt": "附录E：常见问题 FAQ 概述 本附录收集了 Spring Boot 4 升级和使用过程中的常见问题及解决方案。 E.1 升级相关 Q1: 必须升级到 Java 21 吗？ A : 是的，Spring Boot 4 要求最低 Java 21。 原因 : 虚拟线程是 Java 21 的核心特性 Record 模式匹配需要 Java 21 性能优化依赖 Java...",
    "content": "附录E：常见问题 FAQ 概述 本附录收集了 Spring Boot 4 升级和使用过程中的常见问题及解决方案。 E.1 升级相关 Q1: 必须升级到 Java 21 吗？ A : 是的，Spring Boot 4 要求最低 Java 21。 原因 : 虚拟线程是 Java 21 的核心特性 Record 模式匹配需要 Java 21 性能优化依赖 Java 21 的改进 迁移建议 : 安装 JDK 21 sdk install java 21tem 验证版本 java version Q2: 升级后应用无法启动？ A : 检查以下几点： JDK 版本 : java version 确保是 21+ Maven/Gradle 版本 : mvn version 确保 3.9+ gradle version 确保 8.5+ 依赖冲突 : ./mvnw dependency:tree | grep i spring Q3: 第三方库不兼容怎么办？ A : 三种解决方案： 升级库版本 : &lt;dependency&gt; &lt;groupId&gt;com.example&lt;/groupId&gt; &lt;artifactId&gt;library&lt;/artifactId&gt; &lt;version&gt;新版本&lt;/version&gt; &lt;/dependency&gt; 排除冲突依赖 : &lt;exclusions&gt; &lt;exclusion&gt; &lt;groupId&gt;oldgroup&lt;/groupId&gt; &lt;artifactId&gt;oldartifact&lt;/artifactId&gt; &lt;/exclusion&gt; &lt;/exclusions&gt; 暂时降级 Spring Boot （不推荐） E.2 虚拟线程问题 Q4: 如何验证虚拟线程已启用？ A : 多种验证方法： 方法1: 代码检查 : @RestController public class TestController { @GetMapping(&quot;/threadinfo&quot;) public Map&lt;String, Object&gt; threadInfo() { Thread thread = Thread.currentThread(); return Map.of( &quot;isVirtual&quot;, thread.isVirtual(), &quot;threadName&quot;, thread.getName() ); } } 方法2: 日志检查 : 启动日志中查找 Tomcat initialized with virtual threads 方法3: Actuator : curl http://localhost:8080/actuator/metrics/jvm.threads.virtual Q5: 虚拟线程性能没有提升？ A : 检查以下几点： 应用类型 : CPU 密集型应用收益不明显 synchronized 使用 : 导致线程固定 连接池配置 : 可能成为瓶颈 诊断 : 启用 pinning 检测 java Djdk.tracePinnedThreads=full jar app.jar Q6: 虚拟线程数量过多导致内存问题？ A : 虚拟线程本身占用很少（1KB），但要注意： ThreadLocal 清理 : // 使用后清理 threadLocal.remove(); 限制并发数 : Semaphore semaphore = new Semaphore(10000); semaphore.acquire(); try { // 处理 } finally { semaphore.release(); } E.3 性能问题 Q7: 启动时间没有明显改善？ A : 尝试以下优化： 启用 AOT : spring: aot: enabled: true 使用 Native Image : ./mvnw Pnative native:compile 优化依赖 : &lt;! 移除不必要的 starter &gt; Q8: 运行时性能反而下降？ A : 可能的原因： 未启用虚拟线程 : spring: threads: virtual: enabled: true 确保启用 连接池配置不当 : spring: datasource: hikari: maximumpoolsize: 20 减小连接池 synchronized 过多 : 使用 Lock 替代 E.4 数据库问题 Q9: 数据库连接池耗尽？ A : 虚拟线程下需要调整配置： spring: datasource: hikari: maximumpoolsize: 20 从 50 减少到 20 minimumidle: 5 connectiontimeout: 30000 原因 : 虚拟线程可以用更少的连接处理更多请求 Q10: 事务超时？ A : 检查事务配置： @Transactional(timeout = 30) // 增加超时时间 public void longRunningTransaction() { // ... } E.5 安全问题 Q11: Security 配置报错？ A : 使用新的 Lambda DSL： 错误代码 : http.authorizeRequests() .antMatchers(&quot;/public/&quot;).permitAll() .and()... // ❌ .and() 已废弃 正确代码 : http.authorizeHttpRequests(auth &gt; auth .requestMatchers(&quot;/public/&quot;).permitAll() .anyRequest().authenticated() ); Q12: JWT 验证失败？ A : 检查密钥配置： app: jwt: secret: ${JWTSECRET} 确保环境变量设置 expiration: 86400000 E.6 部署问题 Q13: Docker 镜像过大？ A : 使用多阶段构建： FROM eclipsetemurin:21jdk AS builder WORKDIR /app COPY . . RUN ./mvnw clean package DskipTests FROM eclipsetemurin:21jre COPY from=builder /app/target/.jar app.jar ENTRYPOINT [&quot;java&quot;, &quot;jar&quot;, &quot;app.jar&quot;] 或使用 Native Image : ./mvnw Pnative native:compile 镜像大小: 250MB → 60MB Q14: Kubernetes 健康检查失败？ A : 配置正确的探针： management: endpoint: health: probes: enabled: true Kubernetes : livenessProbe: httpGet: path: /actuator/health/liveness port: 8080 initialDelaySeconds: 30 E.7 监控问题 Q15: Prometheus 指标缺失？ A : 确保配置正确： management: endpoints: web: exposure: include: prometheus prometheus: metrics: export: enabled: true Q16: 追踪信息不显示？ A : 启用追踪： management: tracing: enabled: true sampling: probability: 1.0 E.8 迁移问题 Q17: 迁移需要多长时间？ A : 根据项目规模： 项目规模 预估时间 说明 小型 (&lt; 10K 行) 12 周 主要是测试 中型 (10K50K 行) 34 周 需要仔细测试 大型 (&gt; 50K 行) 68 周 分模块迁移 Q18: 可以部分迁移吗？ A : 可以，建议策略： 先迁移独立模块 逐步迁移核心服务 最后迁移遗留系统 E.9 最佳实践 Q19: 什么时候应该升级？ A : 推荐场景： ✅ 立即升级 : I/O 密集型应用 高并发服务 微服务架构 ⚠️ 谨慎评估 : CPU 密集型应用 大量使用废弃 API 第三方库依赖多 ❌ 暂缓升级 : 稳定运行的遗留系统 团队不熟悉 Java 21 第三方库不兼容 Q20: 如何最大化性能收益？ A : 关键点： 启用虚拟线程 优化连接池 使用 Native Image 监控和调优 预期收益 : 吞吐量: 25 倍 延迟: 5080% 降低 内存: 3050% 节省 E.10 获取帮助 官方资源 Spring Boot 文档 Spring Framework 文档 Java 21 文档 社区支持 Stack Overflow Spring 论坛 GitHub Issues 最后更新 : 20241224 版本 : Spring Boot 4.0.0 相关章节 : 第17章：从 Spring Boot 3 迁移 附录A：完整对比表 "
  },
  {
    "title": "第1章：Netty 简介与环境搭建",
    "url": "/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/1-netty.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Netty教程",
    "seriesSlug": "netty",
    "group": "第一部分-_基础入门",
    "excerpt": "第1章：Netty 简介与环境搭建 1.1 什么是 Netty 1.1.1 Netty 的定义 Netty 是一个 异步事件驱动的网络应用框架 ，用于快速开发可维护的高性能协议服务器和客户端。它是基于 Java NIO 的客户端/服务器框架，极大地简化了网络编程，如 TCP 和 UDP 套接字服务器的开发。 1.1.2 Netty 的核心特点 设计优雅 统一...",
    "content": "第1章：Netty 简介与环境搭建 1.1 什么是 Netty 1.1.1 Netty 的定义 Netty 是一个 异步事件驱动的网络应用框架 ，用于快速开发可维护的高性能协议服务器和客户端。它是基于 Java NIO 的客户端/服务器框架，极大地简化了网络编程，如 TCP 和 UDP 套接字服务器的开发。 1.1.2 Netty 的核心特点 设计优雅 统一的 API，支持多种传输类型（阻塞和非阻塞） 简单而强大的线程模型 真正的无连接数据报套接字支持 易于使用 详细的 Javadoc 和大量示例 不需要额外的依赖，JDK 5+ 即可 高性能 吞吐量更高，延迟更低 减少资源消耗 最小化不必要的内存复制 安全 完整的 SSL/TLS 和 StartTLS 支持 可在 Applet 与 Android 的限制环境运行 社区活跃 持续更新和维护 大量成功的商业/开源项目使用 1.1.3 Netty 的发展历史 版本 发布时间 主要特性 Netty 3.x 2008年 首个稳定版本，奠定基础架构 Netty 4.x 2013年 重大重构，性能大幅提升，目前主流版本 Netty 5.x 2015年（已废弃） 实验性版本，后被官方放弃 注意 ：目前推荐使用 Netty 4.1.x 系列，这是最稳定和广泛使用的版本。 1.2 Netty 的应用场景 1.2.1 互联网行业 RPC 框架 Dubbo：阿里巴巴的分布式服务框架 gRPC：Google 的高性能 RPC 框架 Apache Thrift 消息中间件 RocketMQ：阿里巴巴的消息中间件 Kafka：部分网络层使用 Netty 即时通讯 微信、QQ 等 IM 系统 实时聊天应用 推送服务 游戏服务器 网络游戏服务端 实时对战游戏 棋牌游戏平台 1.2.2 大数据领域 Hadoop 生态 Apache Spark：使用 Netty 进行节点间通信 Apache Flink：网络层基于 Netty Apache Storm 数据库 Cassandra：分布式数据库 HBase：使用 Netty 进行 RPC 通信 1.2.3 其他应用 API 网关 ：如 Spring Cloud Gateway 代理服务器 ：HTTP/SOCKS 代理 物联网 ：设备通信、数据采集 流媒体 ：视频直播、音频传输 1.3 Netty 的核心优势 1.3.1 相比传统 Java NIO 的优势 特性 Java NIO Netty API 复杂度 复杂，需要深入理解 简单易用，封装良好 线程模型 需要自己实现 内置 Reactor 线程模型 ByteBuffer 功能有限，API 不友好 ByteBuf 功能强大 粘包/拆包 需要手动处理 提供多种解码器 断线重连 需要自己实现 提供现成方案 内存泄漏 容易出现 引用计数机制 性能优化 需要深入优化 已经高度优化 1.3.2 技术优势详解 1. 零拷贝（ZeroCopy） 传统方式： 硬盘 → 内核缓冲区 → 用户缓冲区 → Socket缓冲区 → 网卡 (拷贝1) (拷贝2) (拷贝3) Netty零拷贝： 硬盘 → 内核缓冲区 → 网卡 (拷贝1) 2. 内存池技术 减少 GC 压力 提高内存分配效率 支持堆内和堆外内存 3. 高效的 Reactor 线程模型 Boss线程组（接收连接） ↓ Worker线程组（处理I/O） ↓ 业务线程池（处理业务逻辑） 4. 无锁化串行设计 每个 Channel 绑定到一个 EventLoop 避免多线程竞争 提高性能 1.4 开发环境准备 1.4.1 JDK 安装 推荐版本 ：JDK 8 / JDK 11 / JDK 17 验证安装 ： java version javac version 预期输出 ： java version &quot;1.8.0301&quot; Java(TM) SE Runtime Environment (build 1.8.0301b09) Java HotSpot(TM) 64Bit Server VM (build 25.301b09, mixed mode) 1.4.2 Maven 配置 1. 创建 Maven 项目 项目结构： nettydemo/ ├── pom.xml └── src/ ├── main/ │ ├── java/ │ └── resources/ └── test/ └── java/ 2. pom.xml 配置 &lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF8&quot;?&gt; &lt;project xmlns=&quot;http://maven.apache.org/POM/4.0.0&quot; xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchemainstance&quot; xsi:schemaLocation=&quot;http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven4.0.0.xsd&quot;&gt; &lt;modelVersion&gt;4.0.0&lt;/modelVersion&gt; &amp;lt;groupId&amp;gt;com.netty.tutorial&amp;lt;/groupId&amp;gt; &amp;lt;artifactId&amp;gt;nettydemo&amp;lt;/artifactId&amp;gt; &amp;lt;version&amp;gt;1.0SNAPSHOT&amp;lt;/version&amp;gt; &amp;lt;packaging&amp;gt;jar&amp;lt;/packaging&amp;gt; &amp;lt;name&amp;gt;Netty Tutorial Demo&amp;lt;/name&amp;gt; &amp;lt;description&amp;gt;Netty从入门到精通示例代码&amp;lt;/description&amp;gt; &amp;lt;properties&amp;gt; &amp;lt;project.build.sourceEncoding&amp;gt;UTF8&amp;lt;/project.build.sourceEncoding&amp;gt; &amp;lt;maven.compiler.source&amp;gt;1.8&amp;lt;/maven.compiler.source&amp;gt; &amp;lt;maven.compiler.target&amp;gt;1.8&amp;lt;/maven.compiler.target&amp;gt; &amp;lt;netty.version&amp;gt;4.1.100.Final&amp;lt;/netty.version&amp;gt; &amp;lt;slf4j.version&amp;gt;1.7.36&amp;lt;/slf4j.version&amp;gt; &amp;lt;logback.version&amp;gt;1.2.11&amp;lt;/logback.version&amp;gt; &amp;lt;/properties&amp;gt; &amp;lt;dependencies&amp;gt; &amp;lt;! Netty核心依赖 &amp;gt; &amp;lt;dependency&amp;gt; &amp;lt;groupId&amp;gt;io.netty&amp;lt;/groupId&amp;gt; &amp;lt;artifactId&amp;gt;nettyall&amp;lt;/artifactId&amp;gt; &amp;lt;version&amp;gt;${netty.version}&amp;lt;/version&amp;gt; &amp;lt;/dependency&amp;gt; &amp;amp;lt;! 日志依赖 &amp;amp;gt; &amp;amp;lt;dependency&amp;amp;gt; &amp;amp;lt;groupId&amp;amp;gt;org.slf4j&amp;amp;lt;/groupId&amp;amp;gt; &amp;amp;lt;artifactId&amp;amp;gt;slf4japi&amp;amp;lt;/artifactId&amp;amp;gt; &amp;amp;lt;version&amp;amp;gt;${slf4j.version}&amp;amp;lt;/version&amp;amp;gt; &amp;amp;lt;/dependency&amp;amp;gt; &amp;amp;lt;dependency&amp;amp;gt; &amp;amp;lt;groupId&amp;amp;gt;ch.qos.logback&amp;amp;lt;/groupId&amp;amp;gt; &amp;amp;lt;artifactId&amp;amp;gt;logbackclassic&amp;amp;lt;/artifactId&amp;amp;gt; &amp;amp;lt;version&amp;amp;gt;${logback.version}&amp;a"
  },
  {
    "title": "第2章：网络编程基础",
    "url": "/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/2.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Netty教程",
    "seriesSlug": "netty",
    "group": "第一部分-_基础入门",
    "excerpt": "第2章：网络编程基础 本章导读 在深入学习 Netty 之前，我们需要理解网络编程的基础知识。本章将介绍 BIO、NIO、AIO 三种 I/O 模型，深入讲解 Java NIO 的核心组件，分析传统 Socket 编程的痛点，并展示 Netty 如何优雅地解决这些问题。 2.1 BIO、NIO、AIO 概念对比 2.1.1 BIO (Blocking I/O...",
    "content": "第2章：网络编程基础 本章导读 在深入学习 Netty 之前，我们需要理解网络编程的基础知识。本章将介绍 BIO、NIO、AIO 三种 I/O 模型，深入讲解 Java NIO 的核心组件，分析传统 Socket 编程的痛点，并展示 Netty 如何优雅地解决这些问题。 2.1 BIO、NIO、AIO 概念对比 2.1.1 BIO (Blocking I/O) 同步阻塞 I/O 定义 ：传统的阻塞式 I/O 模型，一个线程处理一个连接。 工作原理 ： 客户端连接 → 服务端创建线程 → 线程阻塞等待数据 → 处理数据 → 返回结果 代码示例 ： // 传统BIO服务器 ServerSocket serverSocket = new ServerSocket(8080); while (true) { // accept()会阻塞，直到有客户端连接 Socket socket = serverSocket.accept(); // 为每个连接创建一个线程 new Thread(() &amp;gt; { try { InputStream in = socket.getInputStream(); byte[] buffer = new byte[1024]; // read()会阻塞，直到有数据到达 int len = in.read(buffer); // 处理数据... } catch (IOException e) { e.printStackTrace(); } }).start(); } 特点 ： 优点 缺点 编程模型简单 一个连接一个线程，资源消耗大 易于理解和实现 线程上下文切换开销大 连接数受限于线程数 大量线程处于阻塞状态，浪费资源 适用场景 ： 连接数较少且固定的场景 服务器资源充足 对并发要求不高的应用 2.1.2 NIO (Nonblocking I/O) 同步非阻塞 I/O 定义 ：基于事件驱动的 I/O 模型，一个线程可以处理多个连接。 工作原理 ： 多个客户端连接 → Selector轮询 → 检测就绪事件 → 处理就绪的Channel → 继续轮询 核心组件 ： Channel（通道） ：数据传输的管道 Buffer（缓冲区） ：数据的容器 Selector（选择器） ：事件监听和分发 代码示例 ： // NIO服务器 Selector selector = Selector.open(); ServerSocketChannel serverChannel = ServerSocketChannel.open(); serverChannel.configureBlocking(false); serverChannel.bind(new InetSocketAddress(8080)); serverChannel.register(selector, SelectionKey.OPACCEPT); while (true) { // select()会阻塞，但可以监听多个Channel selector.select(); Iterator&amp;lt;SelectionKey&amp;gt; keys = selector.selectedKeys().iterator(); while (keys.hasNext()) { SelectionKey key = keys.next(); keys.remove(); if (key.isAcceptable()) { // 处理连接事件 ServerSocketChannel server = (ServerSocketChannel) key.channel(); SocketChannel client = server.accept(); client.configureBlocking(false); client.register(selector, SelectionKey.OPREAD); } else if (key.isReadable()) { // 处理读事件 SocketChannel client = (SocketChannel) key.channel(); ByteBuffer buffer = ByteBuffer.allocate(1024); client.read(buffer); // 处理数据... } } } 特点 ： 优点 缺点 一个线程处理多个连接 编程复杂度高 资源利用率高 需要处理半包、粘包问题 适合高并发场景 Selector 在 Linux 上基于 epoll，性能好 减少线程上下文切换 但在 Windows 上性能一般 适用场景 ： 高并发、连接数多的场景 连接时间长但数据交互少 聊天服务器、推送服务器 2.1.3 AIO (Asynchronous I/O) 异步非阻塞 I/O 定义 ：真正的异步 I/O，操作完成后会主动通知应用程序。 工作原理 ： 发起异步操作 → 立即返回 → 继续其他工作 → 操作完成后回调通知 代码示例 ： // AIO服务器 AsynchronousServerSocketChannel serverChannel = AsynchronousServerSocketChannel.open(); serverChannel.bind(new InetSocketAddress(8080)); serverChannel.accept(null, new CompletionHandler&lt;AsynchronousSocketChannel, Object&gt;() { @Override public void completed(AsynchronousSocketChannel client, Object attachment) { // 继续接受下一个连接 serverChannel.accept(null, this); // 处理当前连接 ByteBuffer buffer = ByteBuffer.allocate(1024); client.read(buffer, buffer, new CompletionHandler&amp;lt;Integer, ByteBuffer&amp;gt;() { @Override public void completed(Integer result, ByteBuffer attachment) { // 读取完成，处理数据 attachment.flip(); // 处理数据... } @Override public void failed(Throwable exc, ByteBuffer attachment) { // 处理失败 } }); } @Override public void failed(Throwable exc, Object attachment) { // 处理失败 } }); 特点 ： 优点 缺点 真正的异步 I/O 编程复杂度最高 性能理论上最好 在 Linux 上实现不成熟 充分利用 OS 支持 调试困难 适用场景 ： 理论上适合所有高并发场景 但实际应用较少，因为 NIO 已经足够好 2.1.4 三种模型对比总结 特性 BIO NIO AIO I/O模型 同步阻塞 同步非阻塞 异步非阻塞 编程复杂度 简单 复杂 非常复杂 可靠性 好 好 一般 吞吐量 低 高 高 线程模型 一连接一线程 一线程多连接 一线程多连接 适用场景 连接数少 连接数多 连接数多 JDK支持 JDK 1.0+ JDK 1.4+ JDK 1.7+ Netty 的选择 ： Netty 主要基于 NIO 实现 也支持 BIO（OIO）和 AIO，但不推荐使用 NIO 在实际应用中性能和稳定性最佳 2.2 Java NIO 核心组件 2.2.1 Channel（通道） 定义 ：Channel 是数据传输的管道，类似于流（Stream），但有以下区别： Stream Channel 单向（输入流或输出流） 双向（可读可写） 阻塞 可以非阻塞 直接读写数据 通过 Buffer 读写 主要实现类 ： // 文件操作 FileChannel fileChannel = new RandomAccessFile(&quot;file.txt&quot;, &quot;rw&quot;).getChannel(); // 网络操作 ServerSocketChannel serverChannel = ServerSocketChannel.open(); // 服务端 SocketChannel socketChannel = SocketChannel.open(); // 客户端 DatagramChannel datagramChannel = DatagramChannel.open(); // UDP 核心方法 ： // 读取数据到Buffer int bytesRead = channel.read(buffer); // 从Buffer写入数据 int bytesWritten = channel.write(buffer); // 设置非阻塞模式 channel.configureBlocking(false); // 注册到Selector channel.register(selector, SelectionKey.OPREAD); // 关闭Channel channel.clo"
  },
  {
    "title": "第3章：Netty 核心组件",
    "url": "/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/3-netty.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Netty教程",
    "seriesSlug": "netty",
    "group": "第一部分-_基础入门",
    "excerpt": "第3章：Netty 核心组件 本章导读 Netty 的强大之处在于其优雅的组件设计。本章将深入讲解 Netty 的五大核心组件：Channel、EventLoop、ChannelFuture、ChannelHandler 和 ChannelPipeline，理解这些组件是掌握 Netty 的关键。 3.1 Channel（通道） 3.1.1 Channel ...",
    "content": "第3章：Netty 核心组件 本章导读 Netty 的强大之处在于其优雅的组件设计。本章将深入讲解 Netty 的五大核心组件：Channel、EventLoop、ChannelFuture、ChannelHandler 和 ChannelPipeline，理解这些组件是掌握 Netty 的关键。 3.1 Channel（通道） 3.1.1 Channel 概述 定义 ：Channel 是 Netty 网络操作的抽象类，代表一个网络连接。 核心特性 ： 双向通信（可读可写） 异步操作 支持多种传输类型（NIO、OIO、Local、Embedded） 3.1.2 Channel 的层次结构 Channel (接口) ├── AbstractChannel (抽象类) │ ├── AbstractNioChannel │ │ ├── NioServerSocketChannel 服务端Channel │ │ └── NioSocketChannel 客户端Channel │ ├── AbstractOioChannel │ │ ├── OioServerSocketChannel │ │ └── OioSocketChannel │ └── LocalChannel 本地通信 └── EmbeddedChannel 测试用 3.1.3 常用 Channel 类型 Channel 类型 说明 使用场景 NioServerSocketChannel NIO 服务端 TCP 服务器 NioSocketChannel NIO 客户端 TCP 客户端 NioDatagramChannel NIO UDP UDP 通信 OioServerSocketChannel BIO 服务端 阻塞 I/O（不推荐） LocalChannel 本地通信 JVM 内部通信 EmbeddedChannel 嵌入式 单元测试 3.1.4 Channel 的核心方法 public interface Channel extends AttributeMap, ChannelOutboundInvoker, Comparable&lt;Channel&gt; { // 获取Channel的唯一标识 ChannelId id(); // 获取EventLoop EventLoop eventLoop(); // 获取父Channel（服务端Channel） Channel parent(); // 获取配置 ChannelConfig config(); // Channel是否打开 boolean isOpen(); // Channel是否注册到EventLoop boolean isRegistered(); // Channel是否激活（连接建立） boolean isActive(); // 获取本地地址 SocketAddress localAddress(); // 获取远程地址 SocketAddress remoteAddress(); // 获取Pipeline ChannelPipeline pipeline(); // 读取数据 Channel read(); // 写入数据（不刷新） ChannelFuture write(Object msg); // 刷新数据到网络 Channel flush(); // 写入并刷新 ChannelFuture writeAndFlush(Object msg); // 关闭Channel ChannelFuture close(); } 3.1.5 Channel 的生命周期 channelUnregistered → channelRegistered → channelActive → channelInactive ↑ ↓ └──────────────────────────────────────────────────────────────┘ 状态说明 ： 状态 说明 ChannelUnregistered Channel 已创建，但未注册到 EventLoop ChannelRegistered Channel 已注册到 EventLoop ChannelActive Channel 已激活，可以收发数据 ChannelInactive Channel 未连接到远程节点 3.1.6 Channel 示例代码 public class ChannelDemo { public static void main(String[] args) throws Exception { EventLoopGroup group = new NioEventLoopGroup(); try { Bootstrap bootstrap = new Bootstrap(); bootstrap.group(group) .channel(NioSocketChannel.class) .handler(new ChannelInitializer&amp;lt;SocketChannel&amp;gt;() { @Override protected void initChannel(SocketChannel ch) { ch.pipeline().addLast(new ChannelInboundHandlerAdapter() { @Override public void channelActive(ChannelHandlerContext ctx) { Channel channel = ctx.channel(); // 打印Channel信息 System.out.println(&amp;amp;quot;Channel ID: &amp;amp;quot; + channel.id()); System.out.println(&amp;amp;quot;本地地址: &amp;amp;quot; + channel.localAddress()); System.out.println(&amp;amp;quot;远程地址: &amp;amp;quot; + channel.remoteAddress()); System.out.println(&amp;amp;quot;是否激活: &amp;amp;quot; + channel.isActive()); System.out.println(&amp;amp;quot;是否打开: &amp;amp;quot; + channel.isOpen()); System.out.println(&amp;amp;quot;是否可写: &amp;amp;quot; + channel.isWritable()); // 发送数据 ByteBuf buf = Unpooled.copiedBuffer(&amp;amp;quot;Hello Server&amp;amp;quot;, CharsetUtil.UTF8); channel.writeAndFlush(buf); } }); } }); ChannelFuture future = bootstrap.connect(&amp;amp;quot;localhost&amp;amp;quot;, 8080).sync(); future.channel().closeFuture().sync(); } finally { group.shutdownGracefully(); } } } 3.2 EventLoop（事件循环） 3.2.1 EventLoop 概述 定义 ：EventLoop 是 Netty 的核心抽象，负责处理 I/O 事件和任务调度。 核心概念 ： 一个 EventLoop 绑定一个线程 一个 EventLoop 可以处理多个 Channel 一个 Channel 只能注册到一个 EventLoop 3.2.2 EventLoop 的层次结构 EventExecutorGroup ├── EventLoopGroup │ ├── MultithreadEventLoopGroup │ │ ├── NioEventLoopGroup NIO事件循环组 │ │ ├── EpollEventLoopGroup Linux epoll │ │ └── KQueueEventLoopGroup macOS kqueue │ └── DefaultEventLoopGroup └── EventExecutor └── EventLoop ├── NioEventLoop ├── EpollEventLoop └── KQueueEventLoop 3.2.3 EventLoop 与 Channel 的关系 EventLoopGroup (线程组) ├── EventLoop (线程1) │ ├── Channel A │ ├── Channel B │ └── Channel C ├── EventLoop (线程2) │ ├── Channel D │ └── Channel E └── EventLoop (线程3) └── Channel F 关键点 ： ✅ 一个 Channel 的所有 I/O 操作都在同一个 EventLoop 中执行 ✅ 避免了多线程竞争，无需加锁 ✅ 保证了事件的顺序性 3.2.4 EventLoop 的核心方法 public interface Even"
  },
  {
    "title": "第4章：Bootstrap 启动器",
    "url": "/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/4-bootstrap.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Netty教程",
    "seriesSlug": "netty",
    "group": "第一部分-_基础入门",
    "excerpt": "第4章：Bootstrap 启动器 本章导读 Bootstrap 是 Netty 应用程序的启动引导类，负责配置和启动网络应用。本章将详细讲解 ServerBootstrap（服务端启动器）和 Bootstrap（客户端启动器）的使用方法、配置参数和最佳实践。 4.1 Bootstrap 概述 4.1.1 Bootstrap 的作用 定义 ：Bootstra...",
    "content": "第4章：Bootstrap 启动器 本章导读 Bootstrap 是 Netty 应用程序的启动引导类，负责配置和启动网络应用。本章将详细讲解 ServerBootstrap（服务端启动器）和 Bootstrap（客户端启动器）的使用方法、配置参数和最佳实践。 4.1 Bootstrap 概述 4.1.1 Bootstrap 的作用 定义 ：Bootstrap 是 Netty 的启动引导类，用于配置和启动网络应用。 核心功能 ： 配置 EventLoopGroup 指定 Channel 类型 设置 ChannelHandler 配置网络参数 绑定端口或连接服务器 4.1.2 Bootstrap 的分类 AbstractBootstrap (抽象基类) ├── ServerBootstrap 服务端启动器 └── Bootstrap 客户端启动器 对比 ： 特性 ServerBootstrap Bootstrap 用途 服务端 客户端 EventLoopGroup 2个（boss + worker） 1个 Channel ServerSocketChannel SocketChannel 操作 bind() 绑定端口 connect() 连接服务器 父子Channel 有父Channel 无父Channel 4.2 ServerBootstrap 服务端启动 4.2.1 ServerBootstrap 基本用法 标准启动流程 ： public class StandardServer { public static void main(String[] args) throws Exception { // 1. 创建EventLoopGroup EventLoopGroup bossGroup = new NioEventLoopGroup(1); // 接收连接 EventLoopGroup workerGroup = new NioEventLoopGroup(); // 处理I/O try { // 2. 创建ServerBootstrap ServerBootstrap bootstrap = new ServerBootstrap(); // 3. 配置启动参数 bootstrap.group(bossGroup, workerGroup) // 设置线程组 .channel(NioServerSocketChannel.class) // 设置Channel类型 .option(ChannelOption.SOBACKLOG, 128) // 设置服务端选项 .childOption(ChannelOption.SOKEEPALIVE, true) // 设置客户端选项 .childHandler(new ChannelInitializer&amp;amp;lt;SocketChannel&amp;amp;gt;() { @Override protected void initChannel(SocketChannel ch) { ch.pipeline().addLast(new MyServerHandler()); } }); // 4. 绑定端口 ChannelFuture future = bootstrap.bind(8080).sync(); System.out.println(&amp;amp;quot;服务器启动成功，监听端口: 8080&amp;amp;quot;); // 5. 等待服务器关闭 future.channel().closeFuture().sync(); } finally { // 6. 优雅关闭 bossGroup.shutdownGracefully(); workerGroup.shutdownGracefully(); } } } 4.2.2 ServerBootstrap 核心方法 1. group() 设置线程组 // 方式1：设置boss和worker线程组（推荐） bootstrap.group(bossGroup, workerGroup); // 方式2：只设置一个线程组（不推荐） bootstrap.group(eventLoopGroup); 2. channel() 设置Channel类型 // NIO（推荐） bootstrap.channel(NioServerSocketChannel.class); // Epoll（Linux，性能更好） bootstrap.channel(EpollServerSocketChannel.class); // KQueue（macOS） bootstrap.channel(KQueueServerSocketChannel.class); // OIO（阻塞I/O，不推荐） bootstrap.channel(OioServerSocketChannel.class); 3. option() 设置服务端Channel选项 bootstrap.option(ChannelOption.SOBACKLOG, 128) // 连接队列大小 .option(ChannelOption.SOREUSEADDR, true) // 地址重用 .option(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT); // 内存分配器 4. childOption() 设置客户端Channel选项 bootstrap.childOption(ChannelOption.SOKEEPALIVE, true) // 保持连接 .childOption(ChannelOption.TCPNODELAY, true) // 禁用Nagle算法 .childOption(ChannelOption.SORCVBUF, 32 1024) // 接收缓冲区 .childOption(ChannelOption.SOSNDBUF, 32 1024);// 发送缓冲区 5. handler() 设置服务端Handler bootstrap.handler(new LoggingHandler(LogLevel.INFO)); 6. childHandler() 设置客户端Handler bootstrap.childHandler(new ChannelInitializer&lt;SocketChannel&gt;() { @Override protected void initChannel(SocketChannel ch) { ch.pipeline().addLast(new MyHandler()); } }); 7. bind() 绑定端口 // 绑定指定端口 ChannelFuture future = bootstrap.bind(8080).sync(); // 绑定指定地址和端口 ChannelFuture future = bootstrap.bind(&quot;0.0.0.0&quot;, 8080).sync(); // 绑定InetSocketAddress ChannelFuture future = bootstrap.bind(new InetSocketAddress(8080)).sync(); 4.2.3 完整的服务端示例 public class FullFeaturedServer { private final int port; public FullFeaturedServer(int port) { this.port = port; } public void start() throws Exception { // 创建线程组 EventLoopGroup bossGroup = new NioEventLoopGroup(1); EventLoopGroup workerGroup = new NioEventLoopGroup(); try { ServerBootstrap bootstrap = new ServerBootstrap(); bootstrap.group(bossGroup, workerGroup) .channel(NioServerSocketChannel.class) // 服务端选项 .option(ChannelOption.SOBACKLOG, 1024) .option(ChannelOption.SOREUSEADDR, true) .option(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT) // 客户端选项 .childOption(ChannelOption.SOKEEPALIVE, true) .childOption(ChannelOption.TCPNODELAY, true) .childOption(ChannelOption.SORCVBUF, 32 1024) .childOption(ChannelOption.SOSNDBUF, 32 1024) .childOption(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT) // 服务端Handler（日志） .handler(new LoggingHandler(LogLevel.IN"
  },
  {
    "title": "第5章：ChannelHandler 详解",
    "url": "/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/5-channelhandler.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Netty教程",
    "seriesSlug": "netty",
    "group": "第一部分-_基础入门",
    "excerpt": "第5章：ChannelHandler 详解 本章导读 ChannelHandler 是 Netty 处理 I/O 事件和业务逻辑的核心接口。本章将深入讲解 Handler 的生命周期、入站和出站处理器的区别、Handler 的添加和移除，以及异常处理机制。 5.1 ChannelInboundHandler（入站处理器） 5.1.1 入站处理器概述 定义 ：...",
    "content": "第5章：ChannelHandler 详解 本章导读 ChannelHandler 是 Netty 处理 I/O 事件和业务逻辑的核心接口。本章将深入讲解 Handler 的生命周期、入站和出站处理器的区别、Handler 的添加和移除，以及异常处理机制。 5.1 ChannelInboundHandler（入站处理器） 5.1.1 入站处理器概述 定义 ：ChannelInboundHandler 用于处理入站事件，如连接建立、数据读取等。 事件流向 ：从 Head → Tail 5.1.2 生命周期方法 public interface ChannelInboundHandler extends ChannelHandler { // 1. Channel注册到EventLoop void channelRegistered(ChannelHandlerContext ctx) throws Exception; // 2. Channel从EventLoop注销 void channelUnregistered(ChannelHandlerContext ctx) throws Exception; // 3. Channel激活（连接建立） void channelActive(ChannelHandlerContext ctx) throws Exception; // 4. Channel失活（连接断开） void channelInactive(ChannelHandlerContext ctx) throws Exception; // 5. 读取数据 void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception; // 6. 读取完成 void channelReadComplete(ChannelHandlerContext ctx) throws Exception; // 7. 用户自定义事件 void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception; // 8. Channel可写状态改变 void channelWritabilityChanged(ChannelHandlerContext ctx) throws Exception; // 9. 异常捕获 void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception; } 5.1.3 生命周期顺序 channelRegistered → channelActive → channelRead → channelReadComplete → channelInactive → channelUnregistered 完整示例 ： public class LifecycleHandler extends ChannelInboundHandlerAdapter { @Override public void handlerAdded(ChannelHandlerContext ctx) { System.out.println(&amp;quot;1. handlerAdded: Handler被添加到Pipeline&amp;quot;); } @Override public void channelRegistered(ChannelHandlerContext ctx) { System.out.println(&amp;quot;2. channelRegistered: Channel注册到EventLoop&amp;quot;); ctx.fireChannelRegistered(); } @Override public void channelActive(ChannelHandlerContext ctx) { System.out.println(&amp;quot;3. channelActive: Channel激活（连接建立）&amp;quot;); System.out.println(&amp;quot; 本地地址: &amp;quot; + ctx.channel().localAddress()); System.out.println(&amp;quot; 远程地址: &amp;quot; + ctx.channel().remoteAddress()); ctx.fireChannelActive(); } @Override public void channelRead(ChannelHandlerContext ctx, Object msg) { System.out.println(&amp;quot;4. channelRead: 读取数据&amp;quot;); System.out.println(&amp;quot; 数据: &amp;quot; + msg); ctx.fireChannelRead(msg); } @Override public void channelReadComplete(ChannelHandlerContext ctx) { System.out.println(&amp;quot;5. channelReadComplete: 读取完成&amp;quot;); ctx.fireChannelReadComplete(); } @Override public void channelInactive(ChannelHandlerContext ctx) { System.out.println(&amp;quot;6. channelInactive: Channel失活（连接断开）&amp;quot;); ctx.fireChannelInactive(); } @Override public void channelUnregistered(ChannelHandlerContext ctx) { System.out.println(&amp;quot;7. channelUnregistered: Channel从EventLoop注销&amp;quot;); ctx.fireChannelUnregistered(); } @Override public void handlerRemoved(ChannelHandlerContext ctx) { System.out.println(&amp;quot;8. handlerRemoved: Handler从Pipeline移除&amp;quot;); } @Override public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) { System.out.println(&amp;quot;9. exceptionCaught: 捕获异常&amp;quot;); System.out.println(&amp;quot; 异常: &amp;quot; + cause.getMessage()); ctx.close(); } } 5.1.4 ChannelInboundHandlerAdapter 定义 ：提供默认实现的适配器类。 特点 ： 所有方法都有默认实现 默认实现会将事件传递给下一个 Handler 可以选择性地重写需要的方法 public class MyInboundHandler extends ChannelInboundHandlerAdapter { @Override public void channelActive(ChannelHandlerContext ctx) { System.out.println(&amp;quot;连接建立&amp;quot;); // 必须调用，否则事件不会传播 ctx.fireChannelActive(); } @Override public void channelRead(ChannelHandlerContext ctx, Object msg) { System.out.println(&amp;quot;读取数据: &amp;quot; + msg); // 传递给下一个Handler ctx.fireChannelRead(msg); // 注意：如果不传递，需要手动释放msg // ReferenceCountUtil.release(msg); } } 5.1.5 SimpleChannelInboundHandler 定义 ：泛型入站处理器，自动释放消息。 优势 ： 自动类型转换 自动释放消息，避免内存泄漏 代码更简洁 对比 ： // 方式1：使用ChannelInboundHandlerAdapter（需要手动释放） public class Handler1 extends ChannelInboundHandlerAdapter { @Override public void channelRead(ChannelHandlerContext ctx, Object msg) { try { ByteBuf buf = (ByteBuf) msg; /"
  },
  {
    "title": "第6章：ByteBuf 缓冲区",
    "url": "/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/6-bytebuf.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Netty教程",
    "seriesSlug": "netty",
    "group": "第二部分-_核心特性",
    "excerpt": "第6章：ByteBuf 缓冲区 本章导读 ByteBuf 是 Netty 的核心数据容器，相比 Java NIO 的 ByteBuffer，它提供了更强大的功能和更友好的 API。本章将深入讲解 ByteBuf 的优势、分类、读写操作、引用计数和内存管理。 6.1 ByteBuf 的优势 6.1.1 ByteBuffer vs ByteBuf Java NI...",
    "content": "第6章：ByteBuf 缓冲区 本章导读 ByteBuf 是 Netty 的核心数据容器，相比 Java NIO 的 ByteBuffer，它提供了更强大的功能和更友好的 API。本章将深入讲解 ByteBuf 的优势、分类、读写操作、引用计数和内存管理。 6.1 ByteBuf 的优势 6.1.1 ByteBuffer vs ByteBuf Java NIO ByteBuffer 的问题 ： 问题 说明 单一位置指针 position 既用于读又用于写，需要手动 flip() 容量固定 创建后容量不可变，无法动态扩容 API 不友好 方法命名不直观，容易出错 无引用计数 容易造成内存泄漏 Netty ByteBuf 的优势 ： 优势 说明 双指针 readerIndex 和 writerIndex 分离，无需 flip() 动态扩容 可以自动扩容，更灵活 链式调用 支持方法链式调用，代码更简洁 引用计数 自动内存管理，避免内存泄漏 零拷贝 支持 slice、duplicate、composite 等零拷贝操作 池化 支持内存池，减少 GC 压力 6.1.2 ByteBuf 的结构 ++++ | discardable bytes | readable bytes | writable bytes | | | (CONTENT) | | ++++ | | | | 0 &lt;= readerIndex &lt;= writerIndex &lt;= capacity 三个区域 ： 已读区域 （0 readerIndex）：可以丢弃 可读区域 （readerIndex writerIndex）：实际数据 可写区域 （writerIndex capacity）：可以写入 关键索引 ： readerIndex ：读指针，下一个读取的位置 writerIndex ：写指针，下一个写入的位置 capacity ：容量，最大可写位置 6.1.3 对比示例 ByteBuffer（需要 flip） ： ByteBuffer buffer = ByteBuffer.allocate(1024); // 写入数据 buffer.put(&quot;Hello&quot;.getBytes()); // 切换到读模式（必须） buffer.flip(); // 读取数据 while (buffer.hasRemaining()) { byte b = buffer.get(); } // 清空（准备下次写入） buffer.clear(); ByteBuf（无需 flip） ： ByteBuf buf = Unpooled.buffer(1024); // 写入数据 buf.writeBytes(&quot;Hello&quot;.getBytes()); // 直接读取（无需 flip） while (buf.isReadable()) { byte b = buf.readByte(); } // 清空 buf.clear(); 6.2 ByteBuf 的分类 6.2.1 按内存分配方式分类 1. 堆缓冲区（Heap Buffer） // 创建堆缓冲区 ByteBuf heapBuf = Unpooled.buffer(256); // 特点： // 数据存储在 JVM 堆内存 // 可以快速分配和释放 // 受 GC 管理 // 适合小数据量 // 判断是否是堆缓冲区 if (heapBuf.hasArray()) { byte[] array = heapBuf.array(); int offset = heapBuf.arrayOffset() + heapBuf.readerIndex(); int length = heapBuf.readableBytes(); // 处理数组... } 2. 直接缓冲区（Direct Buffer） // 创建直接缓冲区 ByteBuf directBuf = Unpooled.directBuffer(256); // 特点： // 数据存储在堆外内存（操作系统内存） // 分配和释放较慢 // 不受 GC 影响 // 适合大数据量和网络 I/O // 支持零拷贝 // 判断是否是直接缓冲区 if (directBuf.isDirect()) { // 直接缓冲区没有 backing array // 需要使用 getBytes() 或 readBytes() byte[] data = new byte[directBuf.readableBytes()]; directBuf.getBytes(directBuf.readerIndex(), data); } 3. 复合缓冲区（Composite Buffer） // 创建复合缓冲区 CompositeByteBuf compositeBuf = Unpooled.compositeBuffer(); // 添加多个 ByteBuf ByteBuf headerBuf = Unpooled.buffer(12); ByteBuf bodyBuf = Unpooled.buffer(256); compositeBuf.addComponents(headerBuf, bodyBuf); // 特点： // 聚合多个 ByteBuf // 避免内存拷贝 // 实现零拷贝 // 适合组合多个数据块 // 遍历所有组件 for (ByteBuf buf : compositeBuf) { System.out.println(buf.toString(CharsetUtil.UTF8)); } 6.2.2 按内存管理方式分类 1. 池化（Pooled） // 使用池化分配器 ByteBufAllocator allocator = PooledByteBufAllocator.DEFAULT; ByteBuf pooledBuf = allocator.buffer(256); // 特点： // 从内存池分配 // 减少内存分配开销 // 减少 GC 压力 // 性能更好 // 需要手动释放 // 使用完后释放 pooledBuf.release(); 2. 非池化（Unpooled） // 使用非池化分配器 ByteBuf unpooledBuf = Unpooled.buffer(256); // 特点： // 每次都分配新内存 // 使用简单 // 性能较池化差 // 适合小数据量 // 使用完后释放 unpooledBuf.release(); 6.2.3 分类对比 类型 内存位置 性能 GC影响 适用场景 Heap Buffer JVM堆 中 有 小数据量 Direct Buffer 堆外 高 无 大数据量、网络I/O Composite Buffer 混合 高 取决于组件 组合多个数据块 Pooled 内存池 高 小 高频分配场景 Unpooled 新分配 中 大 低频分配场景 6.3 读写操作与索引管理 6.3.1 创建 ByteBuf // 1. 使用 Unpooled 工具类 ByteBuf buf1 = Unpooled.buffer(256); // 堆缓冲区 ByteBuf buf2 = Unpooled.directBuffer(256); // 直接缓冲区 ByteBuf buf3 = Unpooled.copiedBuffer(&quot;Hello&quot;, CharsetUtil.UTF8); // 复制数据 // 2. 使用 ByteBufAllocator ByteBufAllocator allocator = PooledByteBufAllocator.DEFAULT; ByteBuf buf4 = allocator.buffer(256); // 池化缓冲区 ByteBuf buf5 = allocator.directBuffer(256); // 池化直接缓冲区 // 3. 在 ChannelHandlerContext 中 ctx.alloc().buffer(256); 6.3.2 写入操作 基本类型写入 ： ByteBuf buf = Unpooled.buffer(256); // 写入基本类型 buf.writeBoolean(true); // 1 字节 buf.writeByte(127); // 1 字节 buf.writeShort(32767); // 2 字节 buf.writeInt(2147483647); // 4 字节 buf.writeLong(9223372036854775807L); // 8 字节 buf.writeFloat(3.14f); // 4 字节 buf.writeDouble(3.14159); // 8 字节 buf.writeChar('A'); // 2 字节 // 写入字节数组 buf.writeBytes(&quot;Hello&quot;.getBytes()); // 写入另一个 ByteBuf ByteBuf source = Unpooled.copiedBuffer(&quot;World&quot;, CharsetUtil.UTF8); buf.writeBytes(source); // writerIndex 会自动增加 System.out.println(&quot;writerIndex: &quot; + buf.wri"
  },
  {
    "title": "第7章：编解码器（Codec）",
    "url": "/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/7.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Netty教程",
    "seriesSlug": "netty",
    "group": "第二部分-_核心特性",
    "excerpt": "第7章：编解码器（Codec） 本章导读 编解码器是 Netty 处理网络数据的核心组件。本章将讲解为什么需要编解码器、Netty 内置的编解码器、如何自定义编解码器，以及如何解决粘包/拆包问题。 7.1 为什么需要编解码器 7.1.1 网络传输的问题 问题 ：网络传输只能传输字节流 应用层对象 → 字节流 → 网络传输 → 字节流 → 应用层对象 编码 解...",
    "content": "第7章：编解码器（Codec） 本章导读 编解码器是 Netty 处理网络数据的核心组件。本章将讲解为什么需要编解码器、Netty 内置的编解码器、如何自定义编解码器，以及如何解决粘包/拆包问题。 7.1 为什么需要编解码器 7.1.1 网络传输的问题 问题 ：网络传输只能传输字节流 应用层对象 → 字节流 → 网络传输 → 字节流 → 应用层对象 编码 解码 示例 ： // 发送端：需要将对象转换为字节 User user = new User(&quot;Alice&quot;, 25); byte[] bytes = serialize(user); // 编码 channel.writeAndFlush(bytes); // 接收端：需要将字节转换为对象 byte[] bytes = receive(); User user = deserialize(bytes); // 解码 7.1.2 编解码器的作用 编码器（Encoder） ： 将消息对象转换为字节流 出站操作（写入数据时） 解码器（Decoder） ： 将字节流转换为消息对象 入站操作（读取数据时） 编解码器（Codec） ： 同时包含编码和解码功能 7.2 内置编解码器 7.2.1 字符串编解码器 pipeline.addLast(&quot;decoder&quot;, new StringDecoder(CharsetUtil.UTF8)); pipeline.addLast(&quot;encoder&quot;, new StringEncoder(CharsetUtil.UTF8)); // 使用 public class StringHandler extends SimpleChannelInboundHandler&lt;String&gt; { @Override protected void channelRead0(ChannelHandlerContext ctx, String msg) { System.out.println(&quot;收到字符串: &quot; + msg); ctx.writeAndFlush(&quot;回复: &quot; + msg); // 自动编码为字节 } } 7.2.2 对象编解码器 // Java 序列化（不推荐，性能差） pipeline.addLast(new ObjectDecoder(ClassResolvers.cacheDisabled(null))); pipeline.addLast(new ObjectEncoder()); // 使用 public class ObjectHandler extends SimpleChannelInboundHandler&lt;Serializable&gt; { @Override protected void channelRead0(ChannelHandlerContext ctx, Serializable msg) { System.out.println(&quot;收到对象: &quot; + msg); } } 7.2.3 Base64 编解码器 pipeline.addLast(new Base64Decoder()); pipeline.addLast(new Base64Encoder()); 7.2.4 压缩编解码器 // Gzip 压缩 pipeline.addLast(new JdkZlibEncoder(ZlibWrapper.GZIP)); pipeline.addLast(new JdkZlibDecoder(ZlibWrapper.GZIP)); // Snappy 压缩 pipeline.addLast(new SnappyFrameEncoder()); pipeline.addLast(new SnappyFrameDecoder()); 7.3 自定义编解码器 7.3.1 MessageToByteEncoder 定义 ：将消息对象编码为字节流 public class CustomMessageEncoder extends MessageToByteEncoder&lt;CustomMessage&gt; { @Override protected void encode(ChannelHandlerContext ctx, CustomMessage msg, ByteBuf out) { // 编码逻辑 out.writeInt(msg.getId()); byte[] nameBytes = msg.getName().getBytes(CharsetUtil.UTF8); out.writeInt(nameBytes.length); out.writeBytes(nameBytes); byte[] contentBytes = msg.getContent().getBytes(CharsetUtil.UTF8); out.writeInt(contentBytes.length); out.writeBytes(contentBytes); } } 完整示例 ： / 自定义消息格式： +++++++ | ID | Name Length | Name | Content | Len | Content | | 4字节| 4字节 | N字节| Length | 4字节| N字节 | +++++++ / public class Message { private int id; private String name; private String content; // getter/setter... } public class MessageEncoder extends MessageToByteEncoder&lt;Message&gt; { @Override protected void encode(ChannelHandlerContext ctx, Message msg, ByteBuf out) { // 1. 写入 ID out.writeInt(msg.getId()); // 2. 写入 Name byte[] nameBytes = msg.getName().getBytes(CharsetUtil.UTF8); out.writeInt(nameBytes.length); out.writeBytes(nameBytes); // 3. 写入 Content byte[] contentBytes = msg.getContent().getBytes(CharsetUtil.UTF8); out.writeInt(contentBytes.length); out.writeBytes(contentBytes); } } 7.3.2 ByteToMessageDecoder 定义 ：将字节流解码为消息对象 public class MessageDecoder extends ByteToMessageDecoder { @Override protected void decode(ChannelHandlerContext ctx, ByteBuf in, List&amp;lt;Object&amp;gt; out) { // 至少需要 12 字节（ID + Name Length + Content Length） if (in.readableBytes() &amp;lt; 12) { return; } // 标记读取位置 in.markReaderIndex(); // 1. 读取 ID int id = in.readInt(); // 2. 读取 Name int nameLength = in.readInt(); if (in.readableBytes() &amp;amp;lt; nameLength + 4) { in.resetReaderIndex(); return; } byte[] nameBytes = new byte[nameLength]; in.readBytes(nameBytes); String name = new String(nameBytes, CharsetUtil.UTF8); // 3. 读取 Content int contentLength = in.readInt(); if (in.readableBytes() &amp;amp;lt; contentLength) { in.resetReaderIndex(); return; } byte[] contentBytes = new byte[contentLength]; in.readBytes(contentBytes); String content = new String(contentBytes, CharsetUtil.UTF8); // 4. 创建消息对象 Message msg = new Message(); msg.setId(id); msg.setName(name); msg.setContent(content); out.add(msg); } } 7.3.3 MessageToMessageEncoder 定义 ：将一种消息类型转换为另一种消息类型 public class Inte"
  },
  {
    "title": "第8章：粘包与拆包解决方案",
    "url": "/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/8.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Netty教程",
    "seriesSlug": "netty",
    "group": "第二部分-_核心特性",
    "excerpt": "第8章：粘包与拆包解决方案 本章导读 粘包和拆包是 TCP 网络编程中的常见问题。本章将深入讲解问题产生的原因、多种解决方案的详细实现，以及在实际项目中的最佳实践。 8.1 TCP 粘包/拆包问题原理 8.1.1 问题现象 正常情况 ： 发送: [D1] [D2] [D3] 接收: [D1] [D2] [D3] 粘包 ： 发送: [D1] [D2] [D3]...",
    "content": "第8章：粘包与拆包解决方案 本章导读 粘包和拆包是 TCP 网络编程中的常见问题。本章将深入讲解问题产生的原因、多种解决方案的详细实现，以及在实际项目中的最佳实践。 8.1 TCP 粘包/拆包问题原理 8.1.1 问题现象 正常情况 ： 发送: [D1] [D2] [D3] 接收: [D1] [D2] [D3] 粘包 ： 发送: [D1] [D2] [D3] 接收: [D1D2D3] 拆包 ： 发送: [D1大包] 接收: [D1前半] [D1后半] 粘包+拆包 ： 发送: [D1] [D2大包] [D3] 接收: [D1D2前半] [D2后半D3] 8.1.2 产生原因 发送端原因 ： Nagle 算法 ：合并小包，减少网络传输次数 TCP 缓冲区 ：数据先写入缓冲区，达到一定量才发送 接收端原因 ： TCP 缓冲区 ：接收的数据先放入缓冲区 应用层读取速度 ：读取速度慢导致数据堆积 网络原因 ： MSS 限制 ：最大报文段大小限制，大包会被拆分 MTU 限制 ：最大传输单元限制 8.1.3 演示代码 // 服务端（未处理粘包/拆包） public class ProblematicServer { public static void main(String[] args) throws Exception { EventLoopGroup bossGroup = new NioEventLoopGroup(1); EventLoopGroup workerGroup = new NioEventLoopGroup(); try { ServerBootstrap bootstrap = new ServerBootstrap(); bootstrap.group(bossGroup, workerGroup) .channel(NioServerSocketChannel.class) .childHandler(new ChannelInitializer&amp;lt;SocketChannel&amp;gt;() { @Override protected void initChannel(SocketChannel ch) { ch.pipeline().addLast(new ProblematicHandler()); } }); bootstrap.bind(8080).sync().channel().closeFuture().sync(); } finally { bossGroup.shutdownGracefully(); workerGroup.shutdownGracefully(); } } } class ProblematicHandler extends ChannelInboundHandlerAdapter { private int count = 0; @Override public void channelRead(ChannelHandlerContext ctx, Object msg) { ByteBuf buf = (ByteBuf) msg; byte[] data = new byte[buf.readableBytes()]; buf.readBytes(data); String message = new String(data, CharsetUtil.UTF8); System.out.println(&amp;amp;quot;第&amp;amp;quot; + (++count) + &amp;amp;quot;次接收: &amp;amp;quot; + message); System.out.println(&amp;amp;quot;长度: &amp;amp;quot; + data.length); buf.release(); } } // 客户端（发送多个小包） public class ProblematicClient { public static void main(String[] args) throws Exception { EventLoopGroup group = new NioEventLoopGroup(); try { Bootstrap bootstrap = new Bootstrap(); bootstrap.group(group) .channel(NioSocketChannel.class) .handler(new ChannelInitializer&amp;lt;SocketChannel&amp;gt;() { @Override protected void initChannel(SocketChannel ch) { ch.pipeline().addLast(new ChannelInboundHandlerAdapter() { @Override public void channelActive(ChannelHandlerContext ctx) { // 快速发送10个小包 for (int i = 0; i &amp;lt; 10; i++) { String msg = &amp;quot;Message&amp;quot; + i + &amp;quot;\\n&amp;quot;; ctx.writeAndFlush(Unpooled.copiedBuffer(msg, CharsetUtil.UTF8)); } } }); } }); bootstrap.connect(&amp;amp;quot;localhost&amp;amp;quot;, 8080).sync().channel().closeFuture().sync(); } finally { group.shutdownGracefully(); } } } 可能的输出 （粘包）： 第1次接收: Message0 Message1 Message2 长度: 27 第2次接收: Message3 Message4 长度: 18 8.2 固定长度解码器（FixedLengthFrameDecoder） 8.2.1 原理 每个消息固定长度，不足的用空格或特殊字符填充。 消息格式： ++++ | Message1 | Message2 | Message3 | | 10字节 | 10字节 | 10字节 | ++++ 8.2.2 实现 // 服务端 pipeline.addLast(new FixedLengthFrameDecoder(10)); // 每个消息10字节 pipeline.addLast(new StringDecoder(CharsetUtil.UTF8)); pipeline.addLast(new FixedLengthHandler()); class FixedLengthHandler extends SimpleChannelInboundHandler&lt;String&gt; { @Override protected void channelRead0(ChannelHandlerContext ctx, String msg) { System.out.println(&quot;收到消息: [&quot; + msg.trim() + &quot;]&quot;); } } // 客户端 public class FixedLengthClient { public static void main(String[] args) throws Exception { EventLoopGroup group = new NioEventLoopGroup(); try { Bootstrap bootstrap = new Bootstrap(); bootstrap.group(group) .channel(NioSocketChannel.class) .handler(new ChannelInitializer&amp;lt;SocketChannel&amp;gt;() { @Override protected void initChannel(SocketChannel ch) { ch.pipeline().addLast(new ChannelInboundHandlerAdapter() { @Override public void channelActive(ChannelHandlerContext ctx) { // 发送固定长度消息 for (int i = 0; i &amp;lt; 5; i++) { String msg = String.format(&amp;quot;%10s&amp;quot;, &amp;quot;Msg&amp;quot; + i); // 左对齐，10字符 ctx.writeAndFlush(Unpooled.copiedBuffer(msg, CharsetUtil.UTF8)); } } }); } }); bootstrap.connect(&amp;amp;quot;localhost&amp;amp;quot;, 8080).sync().channel().closeFuture().sync(); } finally { group.shutdownGracefully(); } } } 优点 ： 实现"
  },
  {
    "title": "第9章：常用协议支持",
    "url": "/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/9.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Netty教程",
    "seriesSlug": "netty",
    "group": "第二部分-_核心特性",
    "excerpt": "第9章：常用协议支持 本章导读 Netty 内置了对多种常用协议的支持，包括 HTTP、WebSocket、SSL/TLS 等。本章将讲解如何使用这些内置支持快速构建应用。 9.1 HTTP 协议支持 9.1.1 HTTP 服务器 public class HttpServer { public static void main(String[] args)...",
    "content": "第9章：常用协议支持 本章导读 Netty 内置了对多种常用协议的支持，包括 HTTP、WebSocket、SSL/TLS 等。本章将讲解如何使用这些内置支持快速构建应用。 9.1 HTTP 协议支持 9.1.1 HTTP 服务器 public class HttpServer { public static void main(String[] args) throws Exception { EventLoopGroup bossGroup = new NioEventLoopGroup(1); EventLoopGroup workerGroup = new NioEventLoopGroup(); try { ServerBootstrap bootstrap = new ServerBootstrap(); bootstrap.group(bossGroup, workerGroup) .channel(NioServerSocketChannel.class) .childHandler(new ChannelInitializer&amp;lt;SocketChannel&amp;gt;() { @Override protected void initChannel(SocketChannel ch) { ChannelPipeline pipeline = ch.pipeline(); // HTTP 编解码器 pipeline.addLast(new HttpServerCodec()); // HTTP 聚合器（将多个HTTP消息聚合成一个完整的HTTP请求或响应） pipeline.addLast(new HttpObjectAggregator(65536)); // 业务Handler pipeline.addLast(new HttpServerHandler()); } }); ChannelFuture future = bootstrap.bind(8080).sync(); System.out.println(&amp;amp;quot;HTTP服务器启动: http://localhost:8080&amp;amp;quot;); future.channel().closeFuture().sync(); } finally { bossGroup.shutdownGracefully(); workerGroup.shutdownGracefully(); } } } class HttpServerHandler extends SimpleChannelInboundHandler&lt;FullHttpRequest&gt; { @Override protected void channelRead0(ChannelHandlerContext ctx, FullHttpRequest request) { // 获取请求信息 String uri = request.uri(); HttpMethod method = request.method(); System.out.println(&amp;amp;quot;收到请求: &amp;amp;quot; + method + &amp;amp;quot; &amp;amp;quot; + uri); // 构建响应 String content = &amp;amp;quot;&amp;amp;lt;html&amp;amp;gt;&amp;amp;lt;body&amp;amp;gt;&amp;amp;lt;h1&amp;amp;gt;Hello Netty HTTP!&amp;amp;lt;/h1&amp;amp;gt;&amp;amp;lt;/body&amp;amp;gt;&amp;amp;lt;/html&amp;amp;gt;&amp;amp;quot;; ByteBuf buf = Unpooled.copiedBuffer(content, CharsetUtil.UTF8); FullHttpResponse response = new DefaultFullHttpResponse( HttpVersion.HTTP11, HttpResponseStatus.OK, buf ); // 设置响应头 response.headers().set(HttpHeaderNames.CONTENTTYPE, &amp;amp;quot;text/html; charset=UTF8&amp;amp;quot;); response.headers().set(HttpHeaderNames.CONTENTLENGTH, buf.readableBytes()); // 发送响应 ctx.writeAndFlush(response).addListener(ChannelFutureListener.CLOSE); } } 9.1.2 HTTP 客户端 public class HttpClient { public static void main(String[] args) throws Exception { EventLoopGroup group = new NioEventLoopGroup(); try { Bootstrap bootstrap = new Bootstrap(); bootstrap.group(group) .channel(NioSocketChannel.class) .handler(new ChannelInitializer&amp;lt;SocketChannel&amp;gt;() { @Override protected void initChannel(SocketChannel ch) { ChannelPipeline pipeline = ch.pipeline(); // HTTP 编解码器 pipeline.addLast(new HttpClientCodec()); // HTTP 聚合器 pipeline.addLast(new HttpObjectAggregator(65536)); // 业务Handler pipeline.addLast(new HttpClientHandler()); } }); ChannelFuture future = bootstrap.connect(&amp;amp;quot;localhost&amp;amp;quot;, 8080).sync(); future.channel().closeFuture().sync(); } finally { group.shutdownGracefully(); } } } class HttpClientHandler extends SimpleChannelInboundHandler&lt;FullHttpResponse&gt; { @Override public void channelActive(ChannelHandlerContext ctx) { // 构建HTTP请求 FullHttpRequest request = new DefaultFullHttpRequest( HttpVersion.HTTP11, HttpMethod.GET, &amp;quot;/&amp;quot; ); request.headers().set(HttpHeaderNames.HOST, &amp;amp;quot;localhost&amp;amp;quot;); request.headers().set(HttpHeaderNames.CONNECTION, HttpHeaderValues.CLOSE); // 发送请求 ctx.writeAndFlush(request); } @Override protected void channelRead0(ChannelHandlerContext ctx, FullHttpResponse response) { System.out.println(&amp;quot;状态: &amp;quot; + response.status()); System.out.println(&amp;quot;响应内容: &amp;quot; + response.content().toString(CharsetUtil.UTF8)); } } 9.2 WebSocket 协议 9.2.1 WebSocket 服务器 public class WebSocketServer { public static void main(String[] args) throws Exception { EventLoopGroup bossGroup = new NioEventLoopGroup(1); EventLoopGroup workerGroup = new NioEventLoopGroup(); try { ServerBootstrap bootstrap = new ServerBootstrap(); bootstrap.group(bossGroup, workerGroup) .channel(NioServerSocketChannel.class) .childHandl"
  },
  {
    "title": "第10章：EventLoop 与线程模型",
    "url": "/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/10-eventloop.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Netty教程",
    "seriesSlug": "netty",
    "group": "第二部分-_核心特性",
    "excerpt": "第10章：EventLoop 与线程模型 本章导读 EventLoop 是 Netty 的核心，负责处理 I/O 事件和任务调度。本章将深入讲解 Reactor 线程模型、Netty 的线程模型实现、EventLoopGroup 的使用和线程池配置优化。 10.1 Reactor 线程模型 10.1.1 单线程 Reactor ┌─────────────┐...",
    "content": "第10章：EventLoop 与线程模型 本章导读 EventLoop 是 Netty 的核心，负责处理 I/O 事件和任务调度。本章将深入讲解 Reactor 线程模型、Netty 的线程模型实现、EventLoopGroup 的使用和线程池配置优化。 10.1 Reactor 线程模型 10.1.1 单线程 Reactor ┌─────────────┐ │ Reactor │ │ (单线程) │ └──────┬──────┘ │ ┌───┴───┐ │ Event │ │ Loop │ └───┬───┘ │ ┌───┴───────────┐ │ Accept/Read/ │ │ Write/Handler │ └───────────────┘ 特点 ： 所有操作在一个线程中完成 简单，但性能受限 适合连接数少的场景 10.1.2 多线程 Reactor ┌─────────────┐ │ Reactor │ │ (单线程) │ └──────┬──────┘ │ Accept ┌───┴────────────┐ │ Thread Pool │ │ (多线程处理) │ └────────────────┘ 特点 ： Reactor 负责接收连接 线程池处理 I/O 和业务 性能更好 10.1.3 主从 Reactor（Netty 使用） ┌──────────────┐ │ Main Reactor │ ← Boss线程组 │ (接收连接) │ └──────┬───────┘ │ ┌───┴──────────┐ │ Sub Reactor │ ← Worker线程组 │ (处理I/O) │ └──────────────┘ 特点 ： Boss 线程组负责接收连接 Worker 线程组负责处理 I/O 性能最好，Netty 默认模型 10.2 Netty 的线程模型 10.2.1 线程模型架构 ServerBootstrap ├── BossGroup (EventLoopGroup) │ └── EventLoop (线程1) │ └── Selector │ └── ServerSocketChannel │ └── WorkerGroup (EventLoopGroup) ├── EventLoop (线程1) │ └── Selector │ ├── SocketChannel A │ └── SocketChannel B ├── EventLoop (线程2) │ └── Selector │ ├── SocketChannel C │ └── SocketChannel D └── EventLoop (线程3) └── Selector └── SocketChannel E 10.2.2 EventLoop 的职责 1. I/O 事件处理 ： 接收连接（Accept） 读取数据（Read） 写入数据（Write） 2. 任务调度 ： 普通任务 定时任务 周期性任务 3. 保证线程安全 ： 一个 Channel 只绑定一个 EventLoop 一个 EventLoop 可以处理多个 Channel 同一个 Channel 的所有操作都在同一个线程中执行 10.2.3 线程模型示例 public class ThreadModelDemo { public static void main(String[] args) throws Exception { // 1. 创建线程组 EventLoopGroup bossGroup = new NioEventLoopGroup(1); // 1个线程 EventLoopGroup workerGroup = new NioEventLoopGroup(4); // 4个线程 try { ServerBootstrap bootstrap = new ServerBootstrap(); bootstrap.group(bossGroup, workerGroup) .channel(NioServerSocketChannel.class) .childHandler(new ChannelInitializer&amp;lt;SocketChannel&amp;gt;() { @Override protected void initChannel(SocketChannel ch) { ch.pipeline().addLast(new ChannelInboundHandlerAdapter() { @Override public void channelRead(ChannelHandlerContext ctx, Object msg) { // 打印线程信息 System.out.println(&amp;quot;处理线程: &amp;quot; + Thread.currentThread().getName()); System.out.println(&amp;quot;EventLoop: &amp;quot; + ctx.channel().eventLoop()); ctx.writeAndFlush(msg); } }); } }); ChannelFuture future = bootstrap.bind(8080).sync(); System.out.println(&amp;amp;quot;服务器启动成功&amp;amp;quot;); future.channel().closeFuture().sync(); } finally { bossGroup.shutdownGracefully(); workerGroup.shutdownGracefully(); } } } 输出 ： 服务器启动成功 处理线程: nioEventLoopGroup31 EventLoop: io.netty.channel.nio.NioEventLoop@12345678 处理线程: nioEventLoopGroup32 EventLoop: io.netty.channel.nio.NioEventLoop@87654321 10.3 EventLoopGroup 详解 10.3.1 创建 EventLoopGroup // 1. 默认线程数（CPU核心数 2） EventLoopGroup group1 = new NioEventLoopGroup(); // 2. 指定线程数 EventLoopGroup group2 = new NioEventLoopGroup(4); // 3. 指定线程工厂 EventLoopGroup group3 = new NioEventLoopGroup(4, new ThreadFactory() { private AtomicInteger index = new AtomicInteger(0); @Override public Thread newThread(Runnable r) { Thread thread = new Thread(r, &amp;quot;MyEventLoop&amp;quot; + index.getAndIncrement()); thread.setDaemon(true); // 设置为守护线程 return thread; } }); // 4. 指定线程工厂和选择器策略 EventLoopGroup group4 = new NioEventLoopGroup( 4, new DefaultThreadFactory(&quot;MyEventLoop&quot;), SelectorProvider.provider() ); 10.3.2 EventLoop 选择策略 默认策略（轮询） ： // Netty 默认使用 PowerOfTwoEventExecutorChooser // 如果线程数是2的幂次，使用位运算（更快） // 否则使用取模运算 // 示例：4个线程 Channel ch1 → EventLoop 0 Channel ch2 → EventLoop 1 Channel ch3 → EventLoop 2 Channel ch4 → EventLoop 3 Channel ch5 → EventLoop 0 // 循环 自定义选择策略 ： public class CustomEventExecutorChooserFactory implements EventExecutorChooserFactory { @Override public EventExecutorChooser newChooser(EventExecutor[] executors) { return new EventExecutorChooser() { private AtomicInteger idx = new AtomicInteger(); @Override public EventExecutor next() { // 自定义选择逻辑 return executors[Math.abs(idx.getAndIncrement() % executors.length)]; } }; } } 10.4 任务调度与定时任务 10.4.1 提交普通任务 public class TaskSubmitDemo extends Cha"
  },
  {
    "title": "第11章：零拷贝与高性能优化",
    "url": "/netty/E7_AC_AC_E4_B8_89_E9_83_A8_E5_88_86-_E9_AB_98_E7_BA_A7_E5_BA_94_E7_94_A8/11.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Netty教程",
    "seriesSlug": "netty",
    "group": "第三部分-_高级应用",
    "excerpt": "第11章：零拷贝与高性能优化 本章导读 零拷贝是 Netty 高性能的关键技术之一。本章将深入讲解零拷贝的原理、Netty 中的零拷贝实现、FileRegion 文件传输，以及各种性能优化技巧。 11.1 零拷贝技术原理 11.1.1 传统数据拷贝 传统方式（4次拷贝） ： 应用程序读取文件并发送到网络： DMA拷贝：磁盘 → 内核缓冲区 CPU拷贝：内核缓...",
    "content": "第11章：零拷贝与高性能优化 本章导读 零拷贝是 Netty 高性能的关键技术之一。本章将深入讲解零拷贝的原理、Netty 中的零拷贝实现、FileRegion 文件传输，以及各种性能优化技巧。 11.1 零拷贝技术原理 11.1.1 传统数据拷贝 传统方式（4次拷贝） ： 应用程序读取文件并发送到网络： DMA拷贝：磁盘 → 内核缓冲区 CPU拷贝：内核缓冲区 → 用户缓冲区（应用程序） CPU拷贝：用户缓冲区 → Socket缓冲区 DMA拷贝：Socket缓冲区 → 网卡 总计：4次拷贝，2次CPU拷贝，2次DMA拷贝 问题 ： CPU 参与拷贝，占用 CPU 资源 数据在内核态和用户态之间来回拷贝 性能低下 11.1.2 零拷贝方式 零拷贝（2次拷贝） ： 使用 sendfile 或 transferTo： DMA拷贝：磁盘 → 内核缓冲区 DMA拷贝：内核缓冲区 → 网卡 总计：2次拷贝，0次CPU拷贝，2次DMA拷贝 优势 ： CPU 不参与拷贝 减少上下文切换 性能提升 23 倍 11.2 Netty 中的零拷贝实现 11.2.1 CompositeByteBuf（组合缓冲区） / 零拷贝组合多个ByteBuf / public class CompositeByteBufDemo { public static void main(String[] args) { // 创建多个ByteBuf ByteBuf header = Unpooled.copiedBuffer(&quot;Header&quot;, CharsetUtil.UTF8); ByteBuf body = Unpooled.copiedBuffer(&quot;Body&quot;, CharsetUtil.UTF8); // 传统方式（需要拷贝） ByteBuf traditional = Unpooled.buffer(header.readableBytes() + body.readableBytes()); traditional.writeBytes(header); traditional.writeBytes(body); // 零拷贝方式（不需要拷贝） CompositeByteBuf composite = Unpooled.compositeBuffer(); composite.addComponents(true, header, body); // 性能对比 System.out.println(&amp;amp;quot;传统方式字节数: &amp;amp;quot; + traditional.readableBytes()); System.out.println(&amp;amp;quot;零拷贝方式字节数: &amp;amp;quot; + composite.readableBytes()); // 遍历组件 for (ByteBuf buf : composite) { System.out.println(buf.toString(CharsetUtil.UTF8)); } } } 11.2.2 ByteBuf.slice()（切片） / 零拷贝切片 / public class SliceDemo { public static void main(String[] args) { ByteBuf buf = Unpooled.copiedBuffer(&quot;Hello World&quot;, CharsetUtil.UTF8); // 创建切片（共享底层数组，不拷贝数据） ByteBuf slice1 = buf.slice(0, 5); // &amp;quot;Hello&amp;quot; ByteBuf slice2 = buf.slice(6, 5); // &amp;quot;World&amp;quot; System.out.println(slice1.toString(CharsetUtil.UTF8)); System.out.println(slice2.toString(CharsetUtil.UTF8)); // 修改切片会影响原ByteBuf slice1.setByte(0, 'h'); System.out.println(buf.toString(CharsetUtil.UTF8)); // &amp;amp;quot;hello World&amp;amp;quot; } } 11.2.3 ByteBuf.duplicate()（复制） / 零拷贝复制（共享数据，独立索引） / public class DuplicateDemo { public static void main(String[] args) { ByteBuf buf = Unpooled.copiedBuffer(&quot;Netty&quot;, CharsetUtil.UTF8); // 创建副本（共享数据，独立索引） ByteBuf duplicate = buf.duplicate(); // 修改索引不影响原ByteBuf duplicate.readerIndex(2); System.out.println(&amp;amp;quot;原ByteBuf readerIndex: &amp;amp;quot; + buf.readerIndex()); // 0 System.out.println(&amp;amp;quot;副本 readerIndex: &amp;amp;quot; + duplicate.readerIndex()); // 2 // 修改数据会互相影响 duplicate.setByte(0, 'n'); System.out.println(buf.toString(CharsetUtil.UTF8)); // &amp;amp;quot;netty&amp;amp;quot; } } 11.2.4 FileRegion（文件传输） / 零拷贝文件传输 / public class FileTransferServer { public static void main(String[] args) throws Exception { EventLoopGroup bossGroup = new NioEventLoopGroup(1); EventLoopGroup workerGroup = new NioEventLoopGroup(); try { ServerBootstrap bootstrap = new ServerBootstrap(); bootstrap.group(bossGroup, workerGroup) .channel(NioServerSocketChannel.class) .childHandler(new ChannelInitializer&amp;lt;SocketChannel&amp;gt;() { @Override protected void initChannel(SocketChannel ch) { ch.pipeline().addLast(new FileTransferHandler()); } }); ChannelFuture future = bootstrap.bind(8080).sync(); System.out.println(&amp;amp;quot;文件传输服务器启动&amp;amp;quot;); future.channel().closeFuture().sync(); } finally { bossGroup.shutdownGracefully(); workerGroup.shutdownGracefully(); } } } class FileTransferHandler extends ChannelInboundHandlerAdapter { @Override public void channelActive(ChannelHandlerContext ctx) throws Exception { // 打开文件 File file = new File(&amp;quot;largefile.dat&amp;quot;); if (!file.exists()) { file.createNewFile(); // 创建测试文件（100MB） try (RandomAccessFile raf = new RandomAccessFile(file, &amp;quot;rw&amp;quot;)) { raf.setLength(100 1024 1024); } } RandomAccessFile raf = new RandomAccessFile(file, &amp;amp;quot;r&amp;amp;quot;); FileChannel fileChannel = raf.getChannel(); // 创建FileRegion（零拷贝传输） long fileLength = fileChannel.size(); FileRegion region = new DefaultFileRegion(fileChannel, 0, fileLength); System.out.println(&amp;amp;"
  },
  {
    "title": "第12章：心跳检测与空闲连接管理",
    "url": "/netty/E7_AC_AC_E4_B8_89_E9_83_A8_E5_88_86-_E9_AB_98_E7_BA_A7_E5_BA_94_E7_94_A8/12.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Netty教程",
    "seriesSlug": "netty",
    "group": "第三部分-_高级应用",
    "excerpt": "第12章：心跳检测与空闲连接管理 本章导读 心跳检测是保持长连接稳定的重要机制。本章将讲解为什么需要心跳、IdleStateHandler 的使用、自定义心跳实现和断线重连机制。 12.1 为什么需要心跳机制 12.1.1 问题场景 问题1：假死连接 网络异常导致连接断开 但应用层不知道，仍然保持连接 浪费服务器资源 问题2：NAT超时 NAT设备会清除长时...",
    "content": "第12章：心跳检测与空闲连接管理 本章导读 心跳检测是保持长连接稳定的重要机制。本章将讲解为什么需要心跳、IdleStateHandler 的使用、自定义心跳实现和断线重连机制。 12.1 为什么需要心跳机制 12.1.1 问题场景 问题1：假死连接 网络异常导致连接断开 但应用层不知道，仍然保持连接 浪费服务器资源 问题2：NAT超时 NAT设备会清除长时间空闲的连接 导致连接断开 问题3：防火墙 防火墙可能关闭长时间空闲的连接 12.1.2 解决方案 心跳机制 ： 定期发送心跳包 检测连接是否存活 及时清理死连接 12.2 IdleStateHandler 空闲检测 12.2.1 基本用法 public class HeartbeatServer { public static void main(String[] args) throws Exception { EventLoopGroup bossGroup = new NioEventLoopGroup(1); EventLoopGroup workerGroup = new NioEventLoopGroup(); try { ServerBootstrap bootstrap = new ServerBootstrap(); bootstrap.group(bossGroup, workerGroup) .channel(NioServerSocketChannel.class) .childHandler(new ChannelInitializer&amp;lt;SocketChannel&amp;gt;() { @Override protected void initChannel(SocketChannel ch) { ChannelPipeline pipeline = ch.pipeline(); // 空闲检测Handler pipeline.addLast(new IdleStateHandler( 5, // readerIdleTime: 读空闲时间（秒） 10, // writerIdleTime: 写空闲时间（秒） 15 // allIdleTime: 读写空闲时间（秒） )); // 业务Handler pipeline.addLast(new HeartbeatServerHandler()); } }); ChannelFuture future = bootstrap.bind(8080).sync(); System.out.println(&amp;amp;quot;心跳服务器启动&amp;amp;quot;); future.channel().closeFuture().sync(); } finally { bossGroup.shutdownGracefully(); workerGroup.shutdownGracefully(); } } } class HeartbeatServerHandler extends SimpleChannelInboundHandler&lt;String&gt; { @Override protected void channelRead0(ChannelHandlerContext ctx, String msg) { System.out.println(&amp;quot;收到消息: &amp;quot; + msg); if (&amp;amp;quot;PING&amp;amp;quot;.equals(msg)) { ctx.writeAndFlush(&amp;amp;quot;PONG&amp;amp;quot;); } } @Override public void userEventTriggered(ChannelHandlerContext ctx, Object evt) { if (evt instanceof IdleStateEvent) { IdleStateEvent event = (IdleStateEvent) evt; String eventType = null; switch (event.state()) { case READERIDLE: eventType = &amp;amp;quot;读空闲&amp;amp;quot;; // 5秒没有读取到数据，关闭连接 System.out.println(&amp;amp;quot;读空闲，关闭连接&amp;amp;quot;); ctx.close(); break; case WRITERIDLE: eventType = &amp;amp;quot;写空闲&amp;amp;quot;; break; case ALLIDLE: eventType = &amp;amp;quot;读写空闲&amp;amp;quot;; break; } System.out.println(ctx.channel().remoteAddress() + &amp;amp;quot; &amp;amp;quot; + eventType); } } } 12.2.2 客户端心跳 public class HeartbeatClient { public static void main(String[] args) throws Exception { EventLoopGroup group = new NioEventLoopGroup(); try { Bootstrap bootstrap = new Bootstrap(); bootstrap.group(group) .channel(NioSocketChannel.class) .handler(new ChannelInitializer&amp;lt;SocketChannel&amp;gt;() { @Override protected void initChannel(SocketChannel ch) { ChannelPipeline pipeline = ch.pipeline(); pipeline.addLast(new StringDecoder()); pipeline.addLast(new StringEncoder()); // 空闲检测 pipeline.addLast(new IdleStateHandler(0, 3, 0)); // 业务Handler pipeline.addLast(new HeartbeatClientHandler()); } }); ChannelFuture future = bootstrap.connect(&amp;amp;quot;localhost&amp;amp;quot;, 8080).sync(); System.out.println(&amp;amp;quot;连接服务器成功&amp;amp;quot;); future.channel().closeFuture().sync(); } finally { group.shutdownGracefully(); } } } class HeartbeatClientHandler extends SimpleChannelInboundHandler&lt;String&gt; { @Override protected void channelRead0(ChannelHandlerContext ctx, String msg) { System.out.println(&amp;quot;收到响应: &amp;quot; + msg); } @Override public void userEventTriggered(ChannelHandlerContext ctx, Object evt) { if (evt instanceof IdleStateEvent) { IdleStateEvent event = (IdleStateEvent) evt; if (event.state() == IdleState.WRITERIDLE) { // 3秒没有写数据，发送心跳 System.out.println(&amp;amp;quot;发送心跳: PING&amp;amp;quot;); ctx.writeAndFlush(&amp;amp;quot;PING&amp;amp;quot;); } } } } 12.3 自定义心跳实现 public class CustomHeartbeatHandler extends ChannelInboundHandlerAdapter { private static final int HEARTBEATINTERVAL = 30; // 心跳间隔（秒） private static final int HEARTBEATTIMEOUT = 90; // 心跳超时（秒） private ScheduledFuture&amp;lt;?&amp;gt; heartbeatFuture; private long lastHeartbeatTime; @Override public void channelActive(ChannelHandlerContext ctx) { lastHeartbeatTime = System.currentTime"
  },
  {
    "title": "第13-15章：高级应用（流量整形、安全机制、Spring Boot集成）",
    "url": "/netty/E7_AC_AC_E4_B8_89_E9_83_A8_E5_88_86-_E9_AB_98_E7_BA_A7_E5_BA_94_E7_94_A8/13-15.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Netty教程",
    "seriesSlug": "netty",
    "group": "第三部分-_高级应用",
    "excerpt": "第1315章：高级应用（流量整形、安全机制、Spring Boot集成） 由于篇幅限制，本文档将第1315章合并为精简版本，涵盖核心内容。 第13章：流量整形与限流 13.1 为什么需要流量控制 问题 ： 突发流量导致服务器过载 恶意攻击消耗资源 需要保护后端服务 解决方案 ： 流量整形（Traffic Shaping） 限流（Rate Limiting） ...",
    "content": "第1315章：高级应用（流量整形、安全机制、Spring Boot集成） 由于篇幅限制，本文档将第1315章合并为精简版本，涵盖核心内容。 第13章：流量整形与限流 13.1 为什么需要流量控制 问题 ： 突发流量导致服务器过载 恶意攻击消耗资源 需要保护后端服务 解决方案 ： 流量整形（Traffic Shaping） 限流（Rate Limiting） 13.2 GlobalTrafficShapingHandler // 全局流量整形（所有Channel共享） public class TrafficShapingServer { public static void main(String[] args) throws Exception { EventLoopGroup bossGroup = new NioEventLoopGroup(1); EventLoopGroup workerGroup = new NioEventLoopGroup(); // 创建全局流量整形Handler GlobalTrafficShapingHandler trafficHandler = new GlobalTrafficShapingHandler( workerGroup, 10 1024 1024, // 写限制：10MB/s 10 1024 1024, // 读限制：10MB/s 1000 // 检查间隔：1秒 ); try { ServerBootstrap bootstrap = new ServerBootstrap(); bootstrap.group(bossGroup, workerGroup) .channel(NioServerSocketChannel.class) .childHandler(new ChannelInitializer&amp;amp;lt;SocketChannel&amp;amp;gt;() { @Override protected void initChannel(SocketChannel ch) { ch.pipeline().addLast(trafficHandler); ch.pipeline().addLast(new BusinessHandler()); } }); bootstrap.bind(8080).sync().channel().closeFuture().sync(); } finally { trafficHandler.release(); bossGroup.shutdownGracefully(); workerGroup.shutdownGracefully(); } } } 13.3 ChannelTrafficShapingHandler // 每个Channel独立限流 pipeline.addLast(new ChannelTrafficShapingHandler( 1024 1024, // 写限制：1MB/s 1024 1024, // 读限制：1MB/s 1000 // 检查间隔：1秒 )); 13.4 自定义限流器 public class RateLimiterHandler extends ChannelInboundHandlerAdapter { private final RateLimiter rateLimiter; public RateLimiterHandler(double permitsPerSecond) { this.rateLimiter = RateLimiter.create(permitsPerSecond); } @Override public void channelRead(ChannelHandlerContext ctx, Object msg) { if (rateLimiter.tryAcquire()) { // 允许通过 ctx.fireChannelRead(msg); } else { // 限流，拒绝请求 System.out.println(&amp;quot;请求被限流&amp;quot;); ReferenceCountUtil.release(msg); ctx.writeAndFlush(&amp;quot;请求过于频繁，请稍后再试&amp;quot;); } } } 第14章：Netty 安全机制 14.1 SSL/TLS 加密通信 public class SslServer { public static void main(String[] args) throws Exception { // 创建SSL上下文 SelfSignedCertificate ssc = new SelfSignedCertificate(); SslContext sslContext = SslContextBuilder .forServer(ssc.certificate(), ssc.privateKey()) .build(); EventLoopGroup bossGroup = new NioEventLoopGroup(1); EventLoopGroup workerGroup = new NioEventLoopGroup(); try { ServerBootstrap bootstrap = new ServerBootstrap(); bootstrap.group(bossGroup, workerGroup) .channel(NioServerSocketChannel.class) .childHandler(new ChannelInitializer&amp;amp;lt;SocketChannel&amp;amp;gt;() { @Override protected void initChannel(SocketChannel ch) { ChannelPipeline pipeline = ch.pipeline(); // SSL Handler（必须在最前面） pipeline.addLast(sslContext.newHandler(ch.alloc())); // 其他Handler pipeline.addLast(new StringDecoder()); pipeline.addLast(new StringEncoder()); pipeline.addLast(new BusinessHandler()); } }); bootstrap.bind(8443).sync().channel().closeFuture().sync(); } finally { bossGroup.shutdownGracefully(); workerGroup.shutdownGracefully(); } } } 14.2 IP 黑白名单 public class IpFilterHandler extends ChannelInboundHandlerAdapter { private final Set&amp;lt;String&amp;gt; whitelist = new HashSet&amp;lt;&amp;gt;(); private final Set&amp;lt;String&amp;gt; blacklist = new HashSet&amp;lt;&amp;gt;(); public IpFilterHandler() { // 白名单 whitelist.add(&amp;quot;127.0.0.1&amp;quot;); whitelist.add(&amp;quot;192.168.1.100&amp;quot;); // 黑名单 blacklist.add(&amp;amp;quot;10.0.0.1&amp;amp;quot;); } @Override public void channelActive(ChannelHandlerContext ctx) { InetSocketAddress address = (InetSocketAddress) ctx.channel().remoteAddress(); String ip = address.getAddress().getHostAddress(); if (blacklist.contains(ip)) { System.out.println(&amp;amp;quot;IP在黑名单中，拒绝连接: &amp;amp;quot; + ip); ctx.close(); return; } if (!whitelist.isEmpty() &amp;amp;amp;&amp;amp;amp; !whitelist.contains(ip)) { System.out.println(&amp;amp;quot;IP不在白名单中，拒绝连接: &amp;amp;quot; + ip); ctx.close(); return; } ctx.fireChannelActive(); } } 14.3 防止 DDoS 攻击 public class DDoSProtectionHandler extends ChannelInboundHandlerAdapter { private static final Map&amp;lt"
  },
  {
    "title": "第16-20章：实战项目合集",
    "url": "/netty/E7_AC_AC_E5_9B_9B_E9_83_A8_E5_88_86-_E5_AE_9E_E6_88_98_E9_A1_B9_E7_9B_AE/16-20.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Netty教程",
    "seriesSlug": "netty",
    "group": "第四部分-_实战项目",
    "excerpt": "第1620章：实战项目合集 本文档将第1620章的5个实战项目合并为精简版本，涵盖核心架构和关键代码。 第16章：实战项目1 即时通讯系统（IM） 16.1 系统架构 客户端 ←→ IM服务器 ←→ 消息存储 ↓ 用户会话管理 消息路由 离线推送 16.2 核心功能实现 消息协议定义 / IM消息协议 +++++ | Type | From | To | C...",
    "content": "第1620章：实战项目合集 本文档将第1620章的5个实战项目合并为精简版本，涵盖核心架构和关键代码。 第16章：实战项目1 即时通讯系统（IM） 16.1 系统架构 客户端 ←→ IM服务器 ←→ 消息存储 ↓ 用户会话管理 消息路由 离线推送 16.2 核心功能实现 消息协议定义 / IM消息协议 +++++ | Type | From | To | Content | | 1B | 8B | 8B | N bytes | +++++ / public class IMMessage { public enum Type { LOGIN(1), // 登录 LOGOUT(2), // 登出 SINGLECHAT(3), // 单聊 GROUPCHAT(4), // 群聊 HEARTBEAT(5); // 心跳 private final byte code; Type(int code) { this.code = (byte) code; } public byte getCode() { return code; } } private Type type; private long fromUserId; private long toUserId; // 单聊：目标用户ID，群聊：群组ID private String content; private long timestamp; // getter/setter... } // 编码器 public class IMMessageEncoder extends MessageToByteEncoder&lt;IMMessage&gt; { @Override protected void encode(ChannelHandlerContext ctx, IMMessage msg, ByteBuf out) { out.writeByte(msg.getType().getCode()); out.writeLong(msg.getFromUserId()); out.writeLong(msg.getToUserId()); out.writeLong(msg.getTimestamp()); byte[] content = msg.getContent().getBytes(CharsetUtil.UTF8); out.writeInt(content.length); out.writeBytes(content); } } // 解码器 public class IMMessageDecoder extends ByteToMessageDecoder { @Override protected void decode(ChannelHandlerContext ctx, ByteBuf in, List&lt;Object&gt; out) { if (in.readableBytes() &lt; 25) return; // 1+8+8+8 = 25 in.markReaderIndex(); byte typeCode = in.readByte(); long fromUserId = in.readLong(); long toUserId = in.readLong(); long timestamp = in.readLong(); if (in.readableBytes() &amp;amp;lt; 4) { in.resetReaderIndex(); return; } int contentLength = in.readInt(); if (in.readableBytes() &amp;amp;lt; contentLength) { in.resetReaderIndex(); return; } byte[] content = new byte[contentLength]; in.readBytes(content); IMMessage msg = new IMMessage(); msg.setType(IMMessage.Type.values()[typeCode 1]); msg.setFromUserId(fromUserId); msg.setToUserId(toUserId); msg.setTimestamp(timestamp); msg.setContent(new String(content, CharsetUtil.UTF8)); out.add(msg); } } IM服务器 @Component public class IMServer { private final SessionManager sessionManager; private final MessageRouter messageRouter; @PostConstruct public void start() throws Exception { EventLoopGroup bossGroup = new NioEventLoopGroup(1); EventLoopGroup workerGroup = new NioEventLoopGroup(); ServerBootstrap bootstrap = new ServerBootstrap(); bootstrap.group(bossGroup, workerGroup) .channel(NioServerSocketChannel.class) .childHandler(new ChannelInitializer&amp;amp;lt;SocketChannel&amp;amp;gt;() { @Override protected void initChannel(SocketChannel ch) { ch.pipeline() .addLast(new IMMessageDecoder()) .addLast(new IMMessageEncoder()) .addLast(new IdleStateHandler(60, 30, 0)) .addLast(new IMServerHandler(sessionManager, messageRouter)); } }); bootstrap.bind(8080).sync(); System.out.println(&amp;amp;quot;IM服务器启动成功&amp;amp;quot;); } } // 会话管理器 @Component public class SessionManager { private final Map&amp;lt;Long, Channel&amp;gt; userChannels = new ConcurrentHashMap&amp;lt;&amp;gt;(); private final Map&amp;lt;String, Long&amp;gt; channelUsers = new ConcurrentHashMap&amp;lt;&amp;gt;(); public void addSession(long userId, Channel channel) { userChannels.put(userId, channel); channelUsers.put( channel.id ().asLongText(), userId); channel.closeFuture().addListener(future &amp;amp;gt; { removeSession(userId); }); } public void removeSession(long userId) { Channel channel = userChannels.remove(userId); if (channel != null) { channelUsers.remove( channel.id ().asLongText()); } } public Channel getChannel(long userId) { return userChannels.get(userId); } public boolean isOnline(long userId) { return userChannels.containsKey(userId); } } // 消息路由器 @Component public class MessageRouter { private final SessionManager sessionManager; private final OfflineMessageService offlineMessageService; public void route(IMMessage message) { switch (message.getType()) { case SINGLECHAT: routeSingleChat(message); break; case GROUPCHAT: routeGroupChat(message); break; } } private void routeSingleChat(IMMessage message) { Channel channel = sessionManager.getCh"
  },
  {
    "title": "第21-30章：性能调优、源码分析、问题排查合集",
    "url": "/netty/E7_AC_AC_E4_BA_94_E5_85_AD_E4_B8_83_E9_83_A8_E5_88_86_E5_90_88_E9_9B_86/21-30.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Netty教程",
    "seriesSlug": "netty",
    "group": "第五六七部分合集",
    "excerpt": "第2130章：性能调优、源码分析、问题排查合集 本文档将第2130章（第五、六、七部分）合并为精简版本，涵盖性能调优、源码分析和问题排查的核心内容。 第五部分：性能调优（2123章） 第21章：Netty 性能调优实战 21.1 性能调优清单 // 1. 使用池化ByteBuf bootstrap.option(ChannelOption.ALLOCATOR...",
    "content": "第2130章：性能调优、源码分析、问题排查合集 本文档将第2130章（第五、六、七部分）合并为精简版本，涵盖性能调优、源码分析和问题排查的核心内容。 第五部分：性能调优（2123章） 第21章：Netty 性能调优实战 21.1 性能调优清单 // 1. 使用池化ByteBuf bootstrap.option(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT); bootstrap.childOption(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT); // 2. 禁用Nagle算法 bootstrap.childOption(ChannelOption.TCPNODELAY, true); // 3. 启用TCPKEEPALIVE bootstrap.childOption(ChannelOption.SOKEEPALIVE, true); // 4. 调整接收/发送缓冲区 bootstrap.childOption(ChannelOption.SORCVBUF, 128 1024); bootstrap.childOption(ChannelOption.SOSNDBUF, 128 1024); // 5. 设置backlog bootstrap.option(ChannelOption.SOBACKLOG, 1024); // 6. 使用自适应接收缓冲区 bootstrap.childOption(ChannelOption.RCVBUFALLOCATOR, new AdaptiveRecvByteBufAllocator(64, 2048, 65536)); // 7. 设置写缓冲区水位线 bootstrap.childOption(ChannelOption.WRITEBUFFERWATERMARK, new WriteBufferWaterMark(32 1024, 64 1024)); 21.2 线程池优化 // Boss线程组：12个线程 EventLoopGroup bossGroup = new NioEventLoopGroup(1); // Worker线程组：CPU核心数 2 int workerThreads = Runtime.getRuntime().availableProcessors() 2; EventLoopGroup workerGroup = new NioEventLoopGroup(workerThreads); // 业务线程池 ThreadPoolExecutor businessExecutor = new ThreadPoolExecutor( 10, // 核心线程数 20, // 最大线程数 60, TimeUnit.SECONDS, // 空闲时间 new LinkedBlockingQueue&lt;&gt;(1000), // 队列 new ThreadFactoryBuilder() .setNameFormat(&quot;business%d&quot;) .build(), new ThreadPoolExecutor.CallerRunsPolicy() // 拒绝策略 ); 21.3 内存优化 // 启用内存泄漏检测（开发环境） ResourceLeakDetector.setLevel(ResourceLeakDetector.Level.PARANOID); // 生产环境使用SIMPLE级别 ResourceLeakDetector.setLevel(ResourceLeakDetector.Level.SIMPLE); // 使用直接内存 ByteBuf directBuf = PooledByteBufAllocator.DEFAULT.directBuffer(1024); // 及时释放ByteBuf try { // 使用ByteBuf } finally { buf.release(); } 第22章：JVM 调优与监控 22.1 JVM 参数配置 堆内存设置 Xms4g Xmx4g 新生代设置 Xmn2g 元空间设置 XX:MetaspaceSize=256m XX:MaxMetaspaceSize=512m 垃圾回收器（G1） XX:+UseG1GC XX:MaxGCPauseMillis=200 XX:G1HeapRegionSize=16m 直接内存设置 XX:MaxDirectMemorySize=2g GC日志 Xloggc:gc.log XX:+PrintGCDetails XX:+PrintGCDateStamps XX:+PrintGCTimeStamps OOM时dump堆 XX:+HeapDumpOnOutOfMemoryError XX:HeapDumpPath=/path/to/dumps 22.2 监控指标 // 使用Micrometer监控 @Component public class NettyMetrics { private final MeterRegistry registry; public NettyMetrics(MeterRegistry registry) { this.registry = registry; // 注册指标 Gauge.builder(&amp;amp;quot;netty.connections.active&amp;amp;quot;, this, NettyMetrics::getActiveConnections) .register(registry); Counter.builder(&amp;amp;quot;netty.messages.received&amp;amp;quot;) .register(registry); Timer.builder(&amp;amp;quot;netty.request.duration&amp;amp;quot;) .register(registry); } private double getActiveConnections() { // 返回当前活跃连接数 return sessionManager.getActiveCount(); } } 第23章：压力测试与性能分析 23.1 压力测试 // 使用JMH进行基准测试 @BenchmarkMode(Mode.Throughput) @OutputTimeUnit(TimeUnit.SECONDS) @State(Scope.Benchmark) public class NettyBenchmark { private ByteBufAllocator pooled; private ByteBufAllocator unpooled; @Setup public void setup() { pooled = PooledByteBufAllocator.DEFAULT; unpooled = UnpooledByteBufAllocator.DEFAULT; } @Benchmark public void testPooledAllocator() { ByteBuf buf = pooled.buffer(1024); buf.writeInt(100); buf.release(); } @Benchmark public void testUnpooledAllocator() { ByteBuf buf = unpooled.buffer(1024); buf.writeInt(100); buf.release(); } } 23.2 性能分析工具 使用JProfiler 使用VisualVM 使用Arthas Arthas命令示例 查看线程状态 thread 查看JVM信息 jvm 监控方法调用 monitor c 5 com.example.Handler channelRead 查看内存使用 memory 第六部分：源码分析（2427章） 第24章：Netty 启动流程源码分析 24.1 ServerBootstrap 启动流程 // 1. 创建ServerBootstrap ServerBootstrap bootstrap = new ServerBootstrap(); // 2. 配置线程组 bootstrap.group(bossGroup, workerGroup) // 3. 设置Channel类型 .channel(NioServerSocketChannel.class) // 4. 设置Handler .childHandler(new ChannelInitializer&lt;SocketChannel&gt;() { @Override protected void initChannel(SocketChannel ch) { // 初始化Pipeline } }); // 5. 绑定端口 ChannelFuture future = bootstrap.bind(8080); / 源码分析： bind() → doBind() initAndRegister() → 创建Channel，初始化，注册到EventLoop doBind0() → 绑定端口 pipeline.fireCha"
  },
  {
    "title": "附录合集（A-E）",
    "url": "/netty/E9_99_84_E5_BD_95/E9_99_84_E5_BD_95_E5_90_88_E9_9B_86.html",
    "type": "tutorial",
    "priority": 60,
    "series": "Netty教程",
    "seriesSlug": "netty",
    "group": "附录",
    "excerpt": "附录合集（AE） 本文档包含 Netty 教程的所有附录内容，提供额外的参考资料和实用工具。 附录A：Netty API 速查表 A.1 核心类 类名 用途 常用方法 ServerBootstrap 服务端启动器 group(), channel(), childHandler(), bind() Bootstrap 客户端启动器 group(), chan...",
    "content": "附录合集（AE） 本文档包含 Netty 教程的所有附录内容，提供额外的参考资料和实用工具。 附录A：Netty API 速查表 A.1 核心类 类名 用途 常用方法 ServerBootstrap 服务端启动器 group(), channel(), childHandler(), bind() Bootstrap 客户端启动器 group(), channel(), handler(), connect() Channel 网络通道 read(), write(), close(), isActive() ChannelPipeline 处理器链 addLast(), addFirst(), remove() ByteBuf 字节缓冲区 readByte(), writeByte(), release() EventLoopGroup 事件循环组 next(), shutdownGracefully() A.2 常用Handler Handler 用途 StringDecoder 字符串解码 StringEncoder 字符串编码 LineBasedFrameDecoder 行分隔符解码 LengthFieldBasedFrameDecoder 长度字段解码 IdleStateHandler 空闲检测 HttpServerCodec HTTP编解码 WebSocketServerProtocolHandler WebSocket协议 A.3 ChannelOption 选项 说明 推荐值 SOBACKLOG 连接队列大小 1024 TCPNODELAY 禁用Nagle算法 true SOKEEPALIVE 启用TCP保活 true SORCVBUF 接收缓冲区大小 128KB SOSNDBUF 发送缓冲区大小 128KB ALLOCATOR ByteBuf分配器 PooledByteBufAllocator.DEFAULT 附录B：常见问题 FAQ B.1 基础问题 Q1: Netty 和 NIO 的关系？ A: Netty 是基于 Java NIO 的网络框架，封装了 NIO 的复杂性，提供更易用的 API。 Q2: 为什么选择 Netty？ A: 高性能、易用、稳定、社区活跃、被广泛应用于生产环境。 Q3: Netty 适合什么场景？ A: RPC 框架、IM 系统、游戏服务器、网关、消息中间件等高性能网络应用。 B.2 性能问题 Q4: 如何提升 Netty 性能？ A: 使用池化 ByteBuf 使用直接内存 禁用 Nagle 算法 增大缓冲区 使用零拷贝 业务逻辑异步化 Q5: 如何避免内存泄漏？ A: 使用 SimpleChannelInboundHandler 手动释放 ByteBuf 启用内存泄漏检测 B.3 开发问题 Q6: 如何解决粘包/拆包？ A: 使用 LengthFieldBasedFrameDecoder 或自定义协议。 Q7: 如何实现心跳检测？ A: 使用 IdleStateHandler 或自定义心跳机制。 Q8: 如何集成 Spring Boot？ A: 创建 @Component 组件，在 @PostConstruct 中启动服务器。 附录C：性能测试工具 C.1 压力测试工具 1. Apache JMeter 下载：https://jmeter.apache.org/ 用途：HTTP/WebSocket 压力测试 2. wrk 安装 brew install wrk macOS aptget install wrk Ubuntu 使用 wrk t12 c400 d30s http://localhost:8080 3. Gatling 下载：https://gatling.io/ 用途：高性能负载测试 C.2 性能分析工具 1. JProfiler CPU 分析 内存分析 线程分析 2. VisualVM JVM 监控 线程dump 堆dump 3. Arthas 启动 java jar arthasboot.jar 常用命令 dashboard 仪表板 thread 线程信息 jvm JVM信息 monitor 方法监控 附录D：学习资源 D.1 官方资源 官方网站 https://netty.io/ 官方文档 https://netty.io/wiki/ GitHub https://github.com/netty/netty D.2 推荐书籍 《Netty in Action》 作者：Norman Maurer, Marvin Allen Wolfthal 评价：Netty 官方推荐 《Netty 权威指南》 作者：李林锋 评价：中文经典 《Netty 实战》 作者：诺曼·毛瑞尔 评价：实战性强 D.3 在线教程 Netty 官方示例： https://github.com/netty/netty/tree/4.1/example Netty 用户指南： https://netty.io/wiki/userguide.html D.4 社区资源 Stack Overflow： https://stackoverflow.com/questions/tagged/netty Google Groups： https://groups.google.com/g/netty 附录E：开发工具推荐 E.1 IDE IntelliJ IDEA 推荐插件： Lombok Maven Helper Rainbow Brackets Key Promoter X Eclipse 推荐插件： Buildship (Gradle) M2Eclipse (Maven) E.2 构建工具 Maven &lt;dependency&gt; &lt;groupId&gt;io.netty&lt;/groupId&gt; &lt;artifactId&gt;nettyall&lt;/artifactId&gt; &lt;version&gt;4.1.100.Final&lt;/version&gt; &lt;/dependency&gt; Gradle implementation 'io.netty:nettyall:4.1.100.Final' E.3 调试工具 1. Wireshark 网络抓包分析 2. tcpdump tcpdump i any port 8080 w capture.pcap 3. netstat 查看连接状态 netstat an | grep 8080 查看连接数 netstat an | grep 8080 | wc l E.4 监控工具 1. Prometheus + Grafana 指标收集和可视化 2. Micrometer @Bean public MeterRegistry meterRegistry() { return new SimpleMeterRegistry(); } 3. Spring Boot Actuator management: endpoints: web: exposure: include: &quot;&quot; 附录总结 本附录提供了： ✅ API 速查表 快速查找常用 API ✅ 常见问题 FAQ 解答常见疑问 ✅ 性能测试工具 压力测试和性能分析 ✅ 学习资源 官方文档、书籍、教程 ✅ 开发工具 IDE、构建工具、调试工具、监控工具 🎓 学习建议 收藏本附录 ：作为日常开发的参考手册 实践为主 ：理论结合实践 持续学习 ：关注 Netty 社区动态 分享交流 ：参与社区讨论 📞 获取帮助 如果遇到问题，可以通过以下渠道获取帮助： 官方文档 ： https://netty.io/wiki/ Stack Overflow ：搜索或提问 GitHub Issues ：报告 bug 或提出建议 Google Groups ：参与讨论 祝您学习愉快，成为 Netty 专家！ 🚀"
  }
];
