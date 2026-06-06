---
title: MySQL 与数据架构
description: MySQL 索引、事务、锁、分库分表、冷热分离、数据一致性与大表优化。
url: /topics/mysql-data.html
kind: page
---

<header>
    <div class="banner">
        <div class="fn-clear wrapper">
            <h1 class="fn-inline"><a href="/" rel="start">jackssybin 的个人博客</a></h1>
            <small> &nbsp; 记录精彩的程序人生</small>
        </div>
    </div>
    <div class="navbar">
        <div class="fn-clear wrapper">
            <nav class="fn-left">
                <a href="/"><i class="icon-home"></i> 首页</a>
                <a href="/my-github-repos" target="_self" rel="section"><img class="page-icon" src="/images/github-icon.png" alt="">我的开源</a>
<a href="https://blog.csdn.net/jackssybin" target="_self" rel="section">我的scdn</a>
                <a href="/tutorials.html" rel="section"><i class="icon-list"></i> 教程中心</a>
                <a href="/news.html" rel="section"><i class="icon-list"></i> 实时新闻</a>
                <a href="/topics.html" rel="section"><i class="icon-list"></i> 专题</a>
                <a href="/nav.html" rel="section"><i class="icon-link"></i> 网址导航</a>
                <a href="/tags.html" rel="section"><i class="icon-tags"></i> 标签墙</a>
                <a href="/archives.html"><i class="icon-inbox"></i> 存档</a>
                <a href="/about.html" rel="section"><i class="icon-user"></i> 关于本站</a>
                <a rel="archive" href="/links.html"><i class="icon-link"></i> 友情链接</a>
                <a rel="alternate" href="/rss.xml" rel="section"><i class="icon-rss"></i> RSS</a>
            </nav>
            <div class="fn-right">
                <button class="theme-toggle" type="button" aria-label="切换黑夜模式" title="切换黑夜模式" data-theme-toggle>夜</button>
                <form class="form" action="/search.html" method="get">
                    <input placeholder="搜索文章标题" id="search" type="text" name="keyword">
                    <button type="submit"><i class="icon-search"></i></button>
                </form>
            </div>
        </div>
    </div>
</header>
<div class="wrapper">
    <div class="main-wrap">
        <main class="other">
    <div class="title"><h2><i class="icon-list"></i>&nbsp;MySQL 与数据架构 (15)</h2></div>
    <section class="topic-detail">
      <p>MySQL 索引、事务、锁、分库分表、冷热分离、数据一致性与大表优化。</p>
      <section class="topic-roadmap-panel">
    <h3>推荐阅读顺序</h3>
    <ol>
      <li>
        <a href="/articles/2021/06/08/1623116860957.html"><span>核心</span>MySQL RR 隔离级别锁测试</a>
        <p>核心文章：这篇文章是 MySQL 事务与锁专题的核心实验记录，适合用来理解 RR 隔离级别下非索引更新、删除操作为什么会扩大锁范围。</p>
      </li>
<li>
        <a href="/articles/2019/09/18/1568819118263.html"><span>核心</span>分库分表方案总览</a>
        <p>核心文章：这篇文章适合作为数据架构专题的路线文章，帮助判断什么时候需要拆库拆表、怎么选择拆分维度，以及拆分后要面对哪些工程问题。</p>
      </li>
    </ol>
  </section>
      <div><article class="post post--summary">
    <header>
        <h2>
            <span class="core-badge">核心</span>
            <a rel="bookmark" href="/articles/2021/06/08/1623116860957.html">MySQL RR 隔离级别锁测试</a>
            <sup><a href="/articles/2021/06/08/1623116860957.html">有更新！</a></sup>
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="更新日期">
                <i class="icon-date"></i> <time>2021-06-08</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>============================================================================== 按照非索引列更新 在可重复读的事务隔离级别下，在非索引列上进行更新和删除会对所有数据行进行加锁，阻止其他会话对边进行任何数据的增删改操作。 如果更新或删除条件为c3=4且c3列上没有索引则：  不允许其他会话插入任意记录，因为所有记录的主键索引上存在X排他锁，无法申请插入意向X锁（lock_mode X insert intention waiting Record lock） 不允许其他会话删除任意记录，因为所有记录的主键索引上存在X排他锁 不允许其他会话更新任意记录。因为所有记录的主键索引上存在X排他锁  ##=========================================## 测试数据： CREATE TABLE tb4001 ( id bigint(20) NOT NULL AUTO_INCREMENT, c1 int(11) DEFAULT NULL, c2 varchar(200) DEFAULT N....</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/mysql-data.html">MySQL 与数据架构</a>
        <a class="tag" rel="tag" href="/tags/MySQL.html">MySQL</a>
<a class="tag" rel="tag" href="/tags/E6_AD_BB_E9_94_81.html">死锁</a>
<a class="tag" rel="tag" href="/tags/E9_97_B4_E9_9A_99_E9_94_81.html">间隙锁</a>
<a class="tag" rel="tag" href="/tags/E5_8A_A0_E9_94_81.html">加锁</a>
        <a href="/articles/2021/06/08/1623116860957.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            <span class="core-badge">核心</span>
            <a rel="bookmark" href="/articles/2019/09/18/1568819118263.html">分库分表方案总览</a>
            <sup><a href="/articles/2019/09/18/1568819118263.html">有更新！</a></sup>
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="更新日期">
                <i class="icon-date"></i> <time>2019-09-18</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>一、数据库瓶颈  1、IO瓶颈 2、CPU瓶颈   二、分库分表 三、分库分表工具 四、分库分表步骤 五、分库分表问题 六、分库分表总结 七、分库分表示例  一、数据库瓶颈 不管是IO瓶颈，还是CPU瓶颈，最终都会导致数据库的活跃连接数增加，进而逼近甚至达到数据库可承载活跃连接数的阈值。 在业务Service来看就是，可用数据库连接少甚至无连接可用。接下来就可以想象了吧（并发量、吞吐量、崩溃）。  1、IO瓶颈 第一种：磁盘读IO瓶颈，热点数据太多，数据库缓存放不下，每次查询时会产生大量的IO，降低查询速度 -&gt; 分库和垂直分表。 第二种：网络IO瓶颈，请求的数据太多，网络带宽不够 -&gt; 分库。  2、CPU瓶颈 第一种：SQL问题，如SQL中包含join，group by，order by，非索引字段条件查询等，增加CPU运算的操作 -&gt; SQL优化，建立合适的索引，在业务Service层进行业务计算。 第二种：单表数据量太大，查询时扫描的行太多，SQL效率低，CPU率先出现瓶颈 -&gt; 水平分表。  二、分库分表 1、水平分库  1.概念：以字段为依据，按照一....</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/mysql-data.html">MySQL 与数据架构</a>
        <a class="tag" rel="tag" href="/tags/Java.html">Java</a>
<a class="tag" rel="tag" href="/tags/E6_95_B0_E6_8D_AE_E5_BA_93.html">数据库</a>
<a class="tag" rel="tag" href="/tags/E5_88_86_E5_BA_93_E5_88_86_E8_A1_A8.html">分库分表</a>
<a class="tag" rel="tag" href="/tags/E9_AB_98_E5_B9_B6_E5_8F_91.html">高并发</a>
        <a href="/articles/2019/09/18/1568819118263.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2021/03/25/1616640074000.html">表数据量大读写缓慢如何优化【分库分表】</a>
            <sup><a href="/articles/2021/03/25/1616640074000.html">有更新！</a></sup>
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="更新日期">
                <i class="icon-date"></i> <time>2021-03-25</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>一、业务场景三 为了便于理解，我们通过一个业务场景来入手。 有一个电商系统架构优化工作，该系统中包含用户和订单2个主要实体，每个实体涵盖数据量如下表所示：   实体数据量增长趋势   用户千万级每日10万 订单亿级每日百万级，后续可能千万级   从上表中发现，目前订单数据量已达上亿，并且每日以百万级速度增长，之后还可能是千万级。 面对如此大的数据量，此时存储订单的数据库竟然还是一个单库单表。对于单库单表而言，一旦数据量实现疯狂增长，无论是IO还是CPU都会扛不住。 为了使系统抗住千万级数据量的压力，各种SQL优化都已经做完，最终确定下来的方式是将订单表拆分，再进行分布存储，这也就是本章我们要讨论的内容——分库分表。 说到分库分表解决方案，我们首先需要做的就是搞定拆分存储的技术选型问题。 二、拆分存储的技术选型 关于拆分存储常用的技术解决方案，市面上目前主要分为4种：MySQL的分区技术、NoSql、NewSQL、基于MySQL的分库分表。 1、MySQL的分区技术 MySQL的分区主要在文件存储层做文章，它可以将一张表的不同存放在不同存储文件中，这对使用者来说比较透明。 在以往的实战项....</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/mysql-data.html">MySQL 与数据架构</a>
        <a class="tag" rel="tag" href="/tags/MySQL.html">MySQL</a>
<a class="tag" rel="tag" href="/tags/E5_86_B7_E7_83_AD_E5_88_86_E7_A6_BB.html">冷热分离</a>
<a class="tag" rel="tag" href="/tags/E5_A4_A7_E8_A1_A8_E4_BC_98_E5_8C_96.html">大表优化</a>
<a class="tag" rel="tag" href="/tags/E5_8D_83_E4_B8_87_E7_BA_A7_E8_A1_A8_E4_BC_98_E5_8C_96.html">千万级表优化</a>
        <a href="/articles/2021/03/25/1616640074000.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2021/03/25/1616638627630.html">表数据量大读写缓慢如何优化【查询分离】</a>
            
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="创建日期">
                <i class="icon-date"></i> <time>2021-03-25</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>业务场景二 某 SaaS 客服系统，系统里有一个工单查询功能，工单表中存放了几千万条数据，且查询工单表数据时需要关联十几个子表，每个子表的数据也是超亿条。 面对如此庞大的数据量，跟前面的冷热分离一样，每次客户查询数据时几十秒才能返回结果，即便我们使用了索引、SQL 等数据库优化技巧，效果依然不明显。 加上工单表中有些数据是几年前的，但是这些数据涉及诉讼问题，需要继续保持更新，因此无法将这些旧数据封存到别的地方，也就没法通过前面的冷热分离方案来解决。 最终采用了查询分离的解决方案，才得以将这个问题顺利解决：将更新的数据放在一个数据库里，而查询的数据放在另外一个系统里。因为数据的更新都是单表更新，不需要关联也没有外键，所以更新速度立马得到提升，数据的查询则通过一个专门处理大数据量的查询引擎来解决，也快速地满足了实际的查询需求。 通过这种解决方案处理后，每次查询数据时，500ms 内就可得到返回结果，客户再也不抱怨了。 通过上面这个例子，大家对查询分离的业务场景已经有了一定认知，但如果想掌握整个业务场景，继续往下看吧。 什么是查询分离？ 关于查询分离的概念，从简单的字面意思上也好理解，即每次....</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/mysql-data.html">MySQL 与数据架构</a>
        <a class="tag" rel="tag" href="/tags/MySQL.html">MySQL</a>
<a class="tag" rel="tag" href="/tags/E5_86_B7_E7_83_AD_E5_88_86_E7_A6_BB.html">冷热分离</a>
<a class="tag" rel="tag" href="/tags/E5_A4_A7_E8_A1_A8_E4_BC_98_E5_8C_96.html">大表优化</a>
<a class="tag" rel="tag" href="/tags/E5_8D_83_E4_B8_87_E7_BA_A7_E8_A1_A8_E4_BC_98_E5_8C_96.html">千万级表优化</a>
        <a href="/articles/2021/03/25/1616638627630.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2021/03/25/1616636082398.html">表数据量大读写缓慢如何优化【冷热分离】</a>
            
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="创建日期">
                <i class="icon-date"></i> <time>2021-03-25</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>业务场景一 曾经经历过供应链相关的架构优化，当时平台上有一个订单功能，里面的主表有几千万数据量，加上关联表，数据量达到上亿。 这么庞大的数据量，让平台的查询订单变得格外迟缓，查询一次都要二三十秒，而且多点击几次就会出现宕机。比如业务员多次查询时，数据库的 CPU 会立马狂飙，服务器线程也降不下来。 当时，我们尝试了优化表结构、业务代码、索引、SQL 语句等办法来提高响应速度，但这些方法治标不治本，查询速度还是很慢。 考虑到我们手头上还有其他优先级高的需求需要处理，为此，我们跟业务方反馈：“这功能以后你们能不用就不用，暂时先忍受一下。”可经过一段时间后，业务方实在受不了了，直接跟我们放狠话，无奈之下我们屈服了。 最终，我们决定采用一个性价比高的解决方案，简单方便地解决了这个问题。在处理数据时，我们将数据库分成了冷库和热库 2 个库，不常用数据放冷库，常用数据放热库。 通过这样的方法处理后，因为业务员查询的基本是近期常用的数据，常用的数据量大大减少了，就再也不会出现宕机的情况了，也大大提升了数据库响应速度。 其实上面这个方法，就是“冷热分离”。 一、什么是冷热分离  冷热分离就是在处理数据....</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/mysql-data.html">MySQL 与数据架构</a>
        <a class="tag" rel="tag" href="/tags/MySQL.html">MySQL</a>
<a class="tag" rel="tag" href="/tags/E5_86_B7_E7_83_AD_E5_88_86_E7_A6_BB.html">冷热分离</a>
<a class="tag" rel="tag" href="/tags/E5_A4_A7_E8_A1_A8_E4_BC_98_E5_8C_96.html">大表优化</a>
<a class="tag" rel="tag" href="/tags/E5_8D_83_E4_B8_87_E7_BA_A7_E8_A1_A8_E4_BC_98_E5_8C_96.html">千万级表优化</a>
        <a href="/articles/2021/03/25/1616636082398.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2020/12/16/1608097523728.html">MySQL 5.7root用户密码修改</a>
            
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="创建日期">
                <i class="icon-date"></i> <time>2020-12-16</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>在MySQL 5.7 password字段已从mysql.user表中删除，新的字段名是“authenticalion_string”. 选择数据库：use mysql; 更新root的密码： update user set authentication_string=password('新密码') where user='root' and Host='localhost'; flush privileges;</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/mysql-data.html">MySQL 与数据架构</a>
        <a class="tag" rel="tag" href="/tags/MySQL.html">MySQL</a>
<a class="tag" rel="tag" href="/tags/E6_9B_B4_E6_96_B0_E5_AF_86_E7_A0_81.html">更新密码</a>
<a class="tag" rel="tag" href="/tags/root_E5_AF_86_E7_A0_81.html">root密码</a>
        <a href="/articles/2020/12/16/1608097523728.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2020/11/04/1604469398210.html">缓存和数据库一致性问题</a>
            <sup><a href="/articles/2020/11/04/1604469398210.html">有更新！</a></sup>
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="更新日期">
                <i class="icon-date"></i> <time>2020-11-04</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>问题：  你只要用缓存，就可能会涉及到缓存与数据库双存储双写，你只要是双写，就一定会有数据一致性的问题，那么你如何解决一致性问题？   分析：  先做一个说明，从理论上来说，有两种处理思维，一种需保证数据强一致性，这样性能肯定大打折扣；另外我们可以采用最终一致性，保证性能的基础上，允许一定时间内的数据不一致，但最终数据是一致的。   1 强一致性思想  这种考虑方式就要用到分布式事务，比如2PC、tcc、Paxos协议等都可以保证一致性。 我们还可以通过读请求和写请求串行化，串到一个内存队列里去。 串行化可以保证一定不会出现不一致的情况，但是它也会导致系统的吞吐量大幅度降低，用比正常情况下多几倍的机器去支撑线上的一个请求。   2 最终一致性思想  从理论上来说，给缓存设置过期时间，是保证最终一致性的解决方案。这种方案下，我们可以对存入缓存的数据设置过期时间，所有的写操作以数据库为准，对缓存操作只是尽最大努力即可。也就是说如果数据库写成功，缓存更新失败，那么只要到达过期时间，则后面的读请求自然会从数据库中读取新值然后回填缓存。 那么接下来，我们只需要讨论更新的策略了。   (1)先更新....</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/mysql-data.html">MySQL 与数据架构</a>
        <a class="tag" rel="tag" href="/tags/E5_88_86_E5_B8_83_E5_BC_8F.html">分布式</a>
<a class="tag" rel="tag" href="/tags/E6_95_B0_E6_8D_AE_E5_BA_93_E6_9B_B4_E6_96_B0.html">数据库更新</a>
<a class="tag" rel="tag" href="/tags/E7_BC_93_E5_AD_98_E6_9B_B4_E6_96_B0.html">缓存更新</a>
<a class="tag" rel="tag" href="/tags/E5_88_86_E5_B8_83_E5_BC_8F_E7_BC_93_E5_AD_98_E4_B8_80_E8_87_B4_E6_80_A7.html">分布式缓存一致性</a>
        <a href="/articles/2020/11/04/1604469398210.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2020/05/28/1590653407979.html">Mysql-Limit 优化和数据重复</a>
            
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="创建日期">
                <i class="icon-date"></i> <time>2020-05-28</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>limit 查询导出优化 耗时本质 mysql大数据量使用limit分页，随着页码的增大，查询效率越低下。 1.当一个表数据有几百万的数据的时候成了问题！ 如 select * from table limit 0,10 这个没有问题 当 limit 200000,10 的时候数据读取就很慢 原因本质： 1）limit语句的查询时间与起始记录（offset）的位置成正比 2）mysql的limit语句是很方便，但是对记录很多:百万，千万级别的表并不适合直接使用。 例如： limit10000,20的意思扫描满足条件的10020行，扔掉前面的10000行，返回最后的20行，问题就在这里。 ​ LIMIT 2000000, 30 扫描了200万+ 30行，怪不得慢的都堵死了，甚至会导致磁盘io 100%消耗。 ​ 但是: limit 30 这样的语句仅仅扫描30行。 优化手段 干掉或者利用 limit offset,size 中的offset 不是直接使用limit，而是首先获取到offset的id然后直接使用limit size来获取数据 对limit分页问题的性能优化方法 利用表的覆盖....</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/mysql-data.html">MySQL 与数据架构</a>
        <a class="tag" rel="tag" href="/tags/MySQL.html">MySQL</a>
<a class="tag" rel="tag" href="/tags/orderby.html">orderby</a>
<a class="tag" rel="tag" href="/tags/E6_8E_92_E5_BA_8F.html">排序</a>
<a class="tag" rel="tag" href="/tags/limit.html">limit</a>
        <a href="/articles/2020/05/28/1590653407979.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2020/05/28/1590637980592.html">MySQL如何利用索引优化ORDER BY排序</a>
            
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="创建日期">
                <i class="icon-date"></i> <time>2020-05-28</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>MySQL索引通常是被用于提高WHERE条件的数据行匹配或者执行联结操作时匹配其它表的数据行的搜索速度。 MySQL也能利用索引来快速地执行ORDER BY和GROUP BY语句的排序和分组操作。 通过索引优化来实现MySQL的ORDER BY语句优化：   1、ORDER BY的索引优化。如果一个SQL语句形如： SELECT [column1],[column2],…. FROM [TABLE] ORDER BY [sort]; 在[sort]这个栏位上建立索引就可以实现利用索引进行order by 优化。   2、WHERE + ORDER BY的索引优化，形如： SELECT [column1],[column2],…. FROM [TABLE] WHERE [columnX] = [value] ORDER BY [sort]; 建立一个联合索引(columnX,sort)来实现order by 优化。   注意：如果columnX对应多个值，如下面语句就无法利用索引来实现order by的优化 SELECT [column1],[column2],…. FROM [TABL....</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/mysql-data.html">MySQL 与数据架构</a>
        <a class="tag" rel="tag" href="/tags/MySQL.html">MySQL</a>
<a class="tag" rel="tag" href="/tags/orderby.html">orderby</a>
<a class="tag" rel="tag" href="/tags/E7_B4_A2_E5_BC_95.html">索引</a>
        <a href="/articles/2020/05/28/1590637980592.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2020/02/20/1582211908887.html">mysql中information_schema用途</a>
            
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="创建日期">
                <i class="icon-date"></i> <time>2020-02-20</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>一、information_schema简介 在MySQL中，把 information_schema 看作是一个数据库，确切说是信息数据库。其中保存着关于MySQL服务器所维护的所有其他数据库的信息。如数据库名，数据库的表，表栏的数据类型与访问权 限等。在INFORMATION_SCHEMA中，有数个只读表。它们实际上是视图，而不是基本表，因此，你将无法看到与之相关的任何文件。 1information_schema数据库表说明: SCHEMATA表：提供了当前mysql实例中所有数据库的信息。是show databases的结果取之此表。 TABLES表：提供了关于数据库中的表的信息（包括视图）。详细表述了某个表属于哪个schema，表类型，表引擎，创建时间等信息。是show tables from schemaname的结果取之此表。 COLUMNS表：提供了表中的列信息。详细表述了某张表的所有列以及每个列的信息。是show columns from schemaname.tablename的结果取之此表。 STATISTICS表：提供了关于表索引的信息。是show index ....</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/mysql-data.html">MySQL 与数据架构</a>
        <a class="tag" rel="tag" href="/tags/MySQL.html">MySQL</a>
        <a href="/articles/2020/02/20/1582211908887.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2020/01/03/1578021520851.html">mysql空间坐标</a>
            <sup><a href="/articles/2020/01/03/1578021520851.html">有更新！</a></sup>
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="更新日期">
                <i class="icon-date"></i> <time>2020-01-03</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>1.常用使用场景 矩形查询： 适合智能手机、网页端高效展示屏幕范围内数据。通过API获取显示屏4角的坐标点，顺序连接生成矩形，空间数据库提供查询矩形范围内坐标功能。 圆型查询： 根据当前所在位置为中心点，根据给定的里程数为半径生成圆形，搜索圆形范围内的数据。 2.MySql支持的类型 点 POINT(15 20) 线 LINESTRING(0 0, 10 10, 20 25, 50 60) 面 POLYGON((0 0,10 0,10 10,0 10,0 0),(5 5,7 5,7 7,5 7, 5 5)) 多个点 MULTIPOINT(0 0, 20 20, 60 60) 多个线 MULTILINESTRING((10 10, 20 20), (15 15, 30 15)) 多个面 MULTIPOLYGON(((0 0,10 0,10 10,0 10,0 0)),((5 5,7 5,7 7,5 7, 5 5))) 集合 GEOMETRYCOLLECTION(POINT(10 10), POINT(30 30), LINESTRING(15 15, 20 20))，简称GEOMETRY....</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/mysql-data.html">MySQL 与数据架构</a>
        <a class="tag" rel="tag" href="/tags/MySQL.html">MySQL</a>
<a class="tag" rel="tag" href="/tags/E7_A9_BA_E9_97_B4_E5_9D_90_E6_A0_87.html">空间坐标</a>
<a class="tag" rel="tag" href="/tags/E8_8C_83_E5_9B_B4_E6_9F_A5_E8_AF_A2.html">范围查询</a>
<a class="tag" rel="tag" href="/tags/gis.html">gis</a>
        <a href="/articles/2020/01/03/1578021520851.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2019/11/14/1573728964758.html">Ubuntu16.04中PHP7.2 安装pdo_mysql扩展</a>
            <sup><a href="/articles/2019/11/14/1573728964758.html">有更新！</a></sup>
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="更新日期">
                <i class="icon-date"></i> <time>2019-11-14</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>1.查看php版本 php -v 当前7.2版本  2.查看是否安装mysql扩展 两种方式 php -m php -r 'phpinfo();' #查看加载顺序 grep -Hrv &quot;;&quot; /etc/php | grep -E &quot;extension(\s+)?=&quot;  3. 安装mysql扩展 sudo apt install php7.2-mysql  4. 修改配置文件  cd /etc/php/7.2/cli //进入配置文件目录 sudo vim php.ini //vim打开配置文件 //可能会输入root用户密码 /pdo //查找，输入后按enter键即可 //按i键进入vim编辑模式 extension=php_pdo_mysql.dll //去掉extensions前面的;号 //按shift + : 号，然后输入wq</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/mysql-data.html">MySQL 与数据架构</a>
        <a class="tag" rel="tag" href="/tags/php.html">php</a>
        <a href="/articles/2019/11/14/1573728964758.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2019/11/13/1573657642163.html">mysql允许远程连接</a>
            
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="创建日期">
                <i class="icon-date"></i> <time>2019-11-13</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>1.本地登陆 赋权 GRANT ALL PRIVILEGES ON <em>.</em> TO 'root'@'%' IDENTIFIED BY '密码' WITH GRANT OPTION;  FLUSH PRIVILEGES;  2. 修改本地绑定端口 /etc/mysql/**mysql.cnf 查找bind 127.0.0.1 注释掉即可</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/mysql-data.html">MySQL 与数据架构</a>
        <a class="tag" rel="tag" href="/tags/MySQL.html">MySQL</a>
        <a href="/articles/2019/11/13/1573657642163.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2019/11/07/1573120127531.html">mybatis,mysql的时区问题</a>
            <sup><a href="/articles/2019/11/07/1573120127531.html">有更新！</a></sup>
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="更新日期">
                <i class="icon-date"></i> <time>2019-11-07</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>1.公司运营装mysql的时候的时区不是固定的，随机的，所以我们要想办法解决这个问题，应该运营的权限控制的很严，不能要他们更改； 首先解决从数据库读取到java，指定我们所需要的时区，只需要在配置文件的mysql链接的时候指定自己所需的文 datasource.jdbcUrl=jdbc:mysql://xxx.xx.xx.xx:3306/bms?characterEncoding=UTF-8&amp;useSSL=false&amp;serverTimezone=Asia/Shanghai  2.如果我们写接口的时候使用的JsonFormat注解的时候，我们也需要指定想同的时区，否则又会出现时区误差 @JsonFormat(pattern = ApplicationConstants.DATE_FORMAT,timezone=&quot;GMT+8&quot;)</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/mysql-data.html">MySQL 与数据架构</a>
        <a class="tag" rel="tag" href="/tags/Java.html">Java</a>
<a class="tag" rel="tag" href="/tags/json_E6_97_B6_E9_97_B4_E8_BD_AC_E6_8D_A2.html">json时间转换</a>
        <a href="/articles/2019/11/07/1573120127531.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2019/09/21/1569054780956.html">记一个七牛云生成图片水印的问题</a>
            
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="创建日期">
                <i class="icon-date"></i> <time>2019-09-21</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>1.首先七牛云生成图片是没问题的 2.但诡异的是当图片上水印的文字很长的时候，就会涉及到换行问题。换行呢。有主动换行和被动换行。  主动换行：是我们自主把文字按照一定长度切换成两组文字然后赋值到图片上。 被动换行：就是今天我们遇到的问题，图片加水印然后线上环境app端图片都不显示了。但看后台数据图片是有内容的。在pc端也是能看到的。 图我就不截了。 用户看到的现象是：图片打不开了 程序员看到的现象是: 图片地址已经存入到数据库，但是图片地址有问题，存入到数据库的时候看到库里地址有换行符。 那作为程序员就开始分析为啥会有这个现象了。 1.通过日志找到入库sql，发现入库的时候就有问题。 2.既然入库的时候就有问题，那看这个字段是啥时候生成的。从前端过来的时候是否有问题， 经查找日志，发现从前端过来的时候，没问题， 那就是这个字段被加水印的时候弄坏的，多了空格。加水印是依照七牛的方式base64对图片文字加密。 这里就有问题了，base64加密字符会换行，经查证 据RFC 822规定，每76个字符，还需要加上一个回车换行 就是因为这个回车换行导致的。问题就找到了。  解决方式:  换用Ap....</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/mysql-data.html">MySQL 与数据架构</a>
        <a class="tag" rel="tag" href="/tags/E6_95_85_E9_9A_9C.html">故障</a>
<a class="tag" rel="tag" href="/tags/base64_E5_8A_A0_E5_AF_86.html">base64加密</a>
        <a href="/articles/2019/09/21/1569054780956.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article></div>
    </section>
</main>
        <aside>
    <section>
        <div class="module">
            <header><h2>专题</h2></header>
            <main class="topic-list">
                <a href="/topics/java-jvm.html">Java 与 JVM</a>
<a href="/topics/spring-backend.html">Spring Boot 与后端框架</a>
<a href="/topics/ai-agent.html">AI、Agent 与本地模型</a>
<a href="/topics/mysql-data.html">MySQL 与数据架构</a>
<a href="/topics/linux-ops.html">Linux 运维与部署</a>
<a href="/topics/python-crawler.html">Python 爬虫与自动化</a>
<a href="/topics/middleware-distributed.html">中间件与分布式</a>
<a href="/topics/tools-blog.html">工具、效率与博客建设</a>
            </main>
        </div>
        <div class="module">
            <header><h2>标签</h2></header>
            <main>
                <a rel="tag" href="/tags/Python.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="24 篇文章">Python</a>
<a rel="tag" href="/tags/Java.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="18 篇文章">Java</a>
<a rel="tag" href="/tags/CentOS.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="10 篇文章">CentOS</a>
<a rel="tag" href="/tags/MySQL.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="10 篇文章">MySQL</a>
<a rel="tag" href="/tags/Python_20_E7_88_AC_E8_99_AB.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="9 篇文章">Python 爬虫</a>
<a rel="tag" href="/tags/JVM.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="8 篇文章">JVM</a>
<a rel="tag" href="/tags/Linux.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="6 篇文章">Linux</a>
<a rel="tag" href="/tags/Scrapy.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="6 篇文章">Scrapy</a>
<a rel="tag" href="/tags/E5_9E_83_E5_9C_BE_E5_9B_9E_E6_94_B6_E7_AE_97_E6_B3_95.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="4 篇文章">垃圾回收算法</a>
<a rel="tag" href="/tags/Spring_20Batch.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="4 篇文章">Spring Batch</a>
<a rel="tag" href="/tags/Spring_20Boot.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="4 篇文章">Spring Boot</a>
<a rel="tag" href="/tags/E5_A4_A7_E8_A1_A8_E4_BC_98_E5_8C_96.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">大表优化</a>
<a rel="tag" href="/tags/E8_B0_83_E4_BC_98.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">调优</a>
<a rel="tag" href="/tags/E9_AB_98_E5_B9_B6_E5_8F_91.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">高并发</a>
<a rel="tag" href="/tags/E5_86_B7_E7_83_AD_E5_88_86_E7_A6_BB.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">冷热分离</a>
<a rel="tag" href="/tags/E5_8D_83_E4_B8_87_E7_BA_A7_E8_A1_A8_E4_BC_98_E5_8C_96.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">千万级表优化</a>
<a rel="tag" href="/tags/E7_BA_BF_E7_A8_8B.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">线程</a>
<a rel="tag" href="/tags/Nginx.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">Nginx</a>
<a rel="tag" href="/tags/E5_BE_85_E5_88_86_E7_B1_BB.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="2 篇文章">待分类</a>
<a rel="tag" href="/tags/E5_BC_80_E6_BA_90.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="2 篇文章">开源</a>
            </main>
        </div>
        <div class="module tutorial-sidebar">
            <header><h2>教程中心</h2></header>
            <main>
                <a class="tutorial-sidebar-card" href="/mysql.html">
        <strong>MySQL</strong>
        <span>34 篇教程</span>
    </a>
<a class="tutorial-sidebar-card" href="/springboot4.html">
        <strong>Spring Boot 4</strong>
        <span>21 篇教程</span>
    </a>
<a class="tutorial-sidebar-card" href="/netty.html">
        <strong>Netty</strong>
        <span>16 篇教程</span>
    </a>
                <a class="tutorial-sidebar-more" href="/tutorials.html">查看全部教程 &raquo;</a>
            </main>
        </div>
        <div class="module meta">
            <header><h2 class="ft__center"><a href="https://github.com/jackssybin" target="_blank" rel="noopener">GitHub</a></h2></header>
            <main class="fn__clear">
                <img src="/images/sidebar-avatar.jpg" aria-label="88250">
                <div class="fn-right">
                    <a href="/archives.html">106 <span class="ft-gray">文章</span></a><br>
                    3 <span class="ft-gray">友链</span>
                </div>
            </main>
        </div>
    </section>
</aside>
    </div>
</div>
<footer class="footer fn-clear">
    &copy; 2026
    <a href="/">jackssybin 的个人博客</a>
    <br>
    Powered by <a href="https://github.com/adlered/bolo-solo" target="_blank" rel="noopener">Bolo</a>
    <span class="ft-warn">&heartsuit;</span>
    Theme bolo-9IPHP
    <sup>[<a href="https://github.com/9IPHP/9IPHP" target="_blank" rel="noopener">ref</a>]</sup>
    by <a href="http://vanessa.b3log.org" target="_blank" rel="noopener">Vanessa</a>
</footer>
