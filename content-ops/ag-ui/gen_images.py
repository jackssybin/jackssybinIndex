#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ag-ui-protocol/ag-ui 三端推广配图
靛蓝品牌色(#6963ff) + 协议规范文档风（区别于深空蓝科技/画廊紫/学院墨绿）
01 三协议分层：MCP（工具）/ A2A（agent间）/ AG-UI（agent到用户）
02 一条事件流：RunAgentInput → 31事件/8家族
03 schema-first：一份 JSON Schema 代码生成三语言 SDK + conformance 测试
04 生态版图与适用判断：23 集成 / 三语言+8社区 SDK / 谁该用谁缓行
严格 yy += 游标、手动语义断行、先画底再写字、Noto Sans CJK。
"""
import os
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(__file__), "media")
os.makedirs(OUT, exist_ok=True)
FB = "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Bold.ttc"
FR = "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc"
FM = "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Medium.ttc"
def F(s, w="b"):
    return ImageFont.truetype({"b": FB, "m": FM, "r": FR}[w], s)

# 浅底协议文档风
PAPER=(247,247,251); CARD=(255,255,255); INK=(28,28,40); INK2=(86,88,110); GREY=(140,142,162); LINE=(228,228,238)
BRAND=(105,99,255); BRANDBG=(238,237,255)       # AG-UI 品牌靛蓝
TEAL=(22,150,140); TEALBG=(228,246,244)
AMBER=(196,138,40); AMBERBG=(252,244,228)
VIOLET=(148,88,200); VIOLETBG=(246,236,252)
RED=(200,78,72); REDBG=(252,236,235)
GREEN=(44,150,108); GREENBG=(230,246,238)

def make(w,h):
    img=Image.new("RGB",(w,h),PAPER); return img,ImageDraw.Draw(img)
def rrect(d,box,fill,outline=None,w=2):
    d.rounded_rectangle(box,radius=16,fill=fill,outline=outline,width=w)
def title(d,w,main,sub,accent=BRAND):
    d.rectangle([0,0,w,134],fill=INK); d.rectangle([0,134,w,140],fill=accent)
    d.text((56,32),main,font=F(38),fill=(247,247,251))
    d.text((56,90),sub,font=F(23,"r"),fill=(178,180,198))

# ===== 图1：三协议分层 =====
def fig1():
    w,h=1280,980
    img,d=make(w,h)
    title(d,w,"Agent 栈的三层协议：别再把它们混为一谈","MCP 向下接工具、A2A 横向连 agent、AG-UI 向上接用户")
    layers=[
        ("用户界面层","Web / 移动端 / 终端 / Slack / Teams",BRAND,BRANDBG,"AG-UI","把 agent 的事件流实时送到用户，渲染流式文本、生成式 UI、人在环"),
        ("Agent 协作层","多个 agent 之间互相发现与委托",VIOLET,VIOLETBG,"A2A","agent-to-agent，让不同框架的 agent 能彼此调用、分工协作"),
        ("工具与数据层","文件、数据库、API、外部系统",TEAL,TEALBG,"MCP","model context protocol，给 agent 标准化地接工具和上下文"),
    ]
    y0,ch,gap=186,200,26
    for i,(name,scope,col,bg,tag,desc) in enumerate(layers):
        y=y0+i*(ch+gap)
        rrect(d,[56,y,1224,y+ch],bg,col)
        # 左标签
        rrect(d,[88,y+40,268,y+110],col,col)
        d.text((178,y+75),tag,font=F(34,"b"),fill=(255,255,255),anchor="mm")
        d.text((310,y+44),name,font=F(28,"b"),fill=INK)
        d.text((310,y+90),scope,font=F(21,"r"),fill=GREY)
        d.text((310,y+138),desc,font=F(22,"r"),fill=INK2)
        # 层级箭头
        if i<2:
            d.text((640,y+ch+2),"▲ 同一 agent 常常三层一起用",font=F(18,"r"),fill=GREY,anchor="mm")
    # 底部
    rrect(d,[56,886,1224,948],BRANDBG,BRAND)
    d.text((84,902),"AG-UI 可以给讲 MCP 或 A2A 的 agent 做前端，三者互补而非竞争",font=F(22,"m"),fill=BRAND,anchor="lm")
    img.save(os.path.join(OUT,"01-protocol-layers.png")); print("01-protocol-layers.png")

# ===== 图2：一条事件流 31 事件 8 家族 =====
def fig2():
    w,h=1280,1040
    img,d=make(w,h)
    title(d,w,"一次 Run：一个输入，一条 31 个事件的类型化流","客户端发 RunAgentInput，agent 按 8 大家族回吐事件，传输无关")
    # 输入
    rrect(d,[56,176,1224,256],INK,INK)
    d.text((88,196),"客户端 → RunAgentInput",font=F(26,"b"),fill=(255,255,255))
    d.text((88,234),"messages 对话 · tools 前端工具 · state 共享状态 · context 上下文",font=F(20,"r"),fill=(180,182,200))
    d.polygon([(620,258),(660,258),(640,286)],fill=BRAND)
    # 8 家族网格
    fams=[
        ("运行生命周期","RUN_STARTED / FINISHED / ERROR、STEP_*",5,BRAND,BRANDBG),
        ("文本消息","TEXT_MESSAGE_START/CONTENT/END/CHUNK",4,TEAL,TEALBG),
        ("工具调用","TOOL_CALL_START/ARGS/END/RESULT/CHUNK",5,AMBER,AMBERBG),
        ("状态同步","STATE_SNAPSHOT / STATE_DELTA(JSON Patch)",3,VIOLET,VIOLETBG),
        ("推理过程","REASONING_START/MESSAGE_*/ENCRYPTED/END",5,RED,REDBG),
        ("活动进度","ACTIVITY_SNAPSHOT / ACTIVITY_DELTA",2,GREEN,GREENBG),
        ("子 Agent","SUBAGENT_STARTED / FINISHED / ERROR",3,BRAND,BRANDBG),
        ("透传","RAW / CUSTOM 自定义事件",2,INK,(238,238,244)),
    ]
    cw,chh,gx,gy=568,140,32,18
    x0,y0=56,296
    for i,(name,evs,num,col,bg) in enumerate(fams):
        r,c=divmod(i,2)
        x=x0+c*(cw+gx); y=y0+r*(chh+gy)
        rrect(d,[x,y,x+cw,y+chh],bg,col)
        d.ellipse([x+20,y+22,x+58,y+60],fill=col)
        d.text((x+39,y+41),str(num),font=F(22,"b"),fill=(255,255,255),anchor="mm")
        d.text((x+76,y+20),name,font=F(23,"b"),fill=INK)
        d.text((x+76,y+62),evs,font=F(16,"r"),fill=INK2)
    # 底部统计
    rrect(d,[56,962,1224,1014],BRANDBG,BRAND)
    d.text((84,974),"合计 31 个事件类型 · 仅运行生命周期为必选，最小 agent 发几个事件即可起步",font=F(21,"m"),fill=BRAND,anchor="lm")
    img.save(os.path.join(OUT,"02-event-stream.png")); print("02-event-stream.png")

# ===== 图3：schema-first 代码生成 + 一致性测试 =====
def fig3():
    w,h=1280,1000
    img,d=make(w,h)
    title(d,w,"协议为什么不分叉：一份 Schema，生成三语言 SDK","AG-UI 用 schema-first 加一致性测试，治住了开源协议最常见的死法")
    # 顶层 schema
    rrect(d,[360,178,920,262],INK,INK)
    d.text((640,204),"spec/1.0/schema.json（94KB，唯一事实来源）",font=F(24,"b"),fill=(255,255,255),anchor="mm")
    d.text((640,238),"JSON Schema 冻结规范 · 1.0 双向向后兼容",font=F(19,"r"),fill=(180,182,200),anchor="mm")
    # 生成器
    d.text((640,290),"↓ spec/generator 代码生成",font=F(20,"m"),fill=GREY,anchor="mm")
    sdks=[("TypeScript SDK","242 文件 / 75,624 行\nnpm @ag-ui/client",BRAND,BRANDBG),
          ("Python SDK","38 文件 / 11,225 行\npip ag-ui-protocol（_generated）",TEAL,TEALBG),
          (".NET SDK","362 文件 / 57,343 行\nAGUI.Client",VIOLET,VIOLETBG)]
    cw,gap=372,24; x0,y0=56,330
    for i,(name,desc,col,bg) in enumerate(sdks):
        x=x0+i*(cw+gap)
        rrect(d,[x,y0,x+cw,y0+170],bg,col)
        d.text((x+24,y0+24),name,font=F(25,"b"),fill=col)
        l1,l2=desc.split("\n")
        d.text((x+24,y0+78),l1,font=F(20,"r"),fill=INK2)
        d.text((x+24,y0+114),l2,font=F(19,"r"),fill=GREY)
    # 一致性测试
    d.text((640,540),"↓ 同一份测试卡所有实现的行为",font=F(20,"m"),fill=GREY,anchor="mm")
    rrect(d,[56,576,1224,748],CARD,BRAND)
    d.text((88,600),"Conformance 一致性测试",font=F(26,"b"),fill=INK)
    d.text((88,648),"68 个流测试用例 + 303 个 fixtures",font=F(22,"m"),fill=BRAND)
    d.text((88,690),"三级判定：fatal（必须报错）/ tolerated（容忍）/ warns（告警）",font=F(20,"r"),fill=INK2)
    # 规则举例
    examples=[("首个事件不是 RUN_STARTED","fatal"),("收到未知事件","dropped 丢弃"),("状态补丁未知操作","dropped 并告警"),("版本号无法识别","warns 后继续")]
    yy=784
    for rule,level in examples:
        rrect(d,[56,yy,1224,yy+44],BRANDBG,None,1)
        d.text((84,yy+22),rule,font=F(20,"r"),fill=INK,anchor="lm")
        col=RED if level=="fatal" else (AMBER if "告警" in level or "warns" in level else TEAL)
        d.text((1140,yy+22),level,font=F(20,"b"),fill=col,anchor="rm")
        yy+=52
    img.save(os.path.join(OUT,"03-schema-first.png")); print("03-schema-first.png")

# ===== 图4：生态版图与适用判断 =====
def fig4():
    w,h=1280,1060
    img,d=make(w,h)
    title(d,w,"生态版图与上手判断：23 个框架集成，谁该现在用","先看它接了谁，再看你的场景到底需不需要 UI 协议")
    # 上：生态数据卡
    stats=[("23","框架/协议集成",BRAND,BRANDBG),("3+8","官方+社区 SDK",TEAL,TEALBG),
           ("6","中间件",VIOLET,VIOLETBG),("2.1万","GitHub Stars",AMBER,AMBERBG)]
    cw,gap=276,14; x0,y0=56,180
    for i,(big,small,col,bg) in enumerate(stats):
        x=x0+i*(cw+gap)
        rrect(d,[x,y0,x+cw,y0+150],bg,col)
        d.text((x+cw//2,y0+48),big,font=F(42,"b"),fill=col,anchor="mm")
        d.text((x+cw//2,y0+108),small,font=F(19,"r"),fill=INK2,anchor="mm")
    # 中：代表集成
    rrect(d,[56,360,1224,500],CARD,LINE,1)
    d.text((84,382),"代表集成（每个在 Dojo 都有 live demo）",font=F(23,"b"),fill=INK)
    line1="LangChain · LangGraph · CrewAI · Google ADK/Antigravity · Microsoft Agent Framework"
    line2="AWS Strands · Pydantic AI · Mastra · Agno · AG2 · LlamaIndex · OpenAI Agents · Claude SDK · watsonx"
    d.text((84,426),line1,font=F(19,"r"),fill=INK2)
    d.text((84,460),line2,font=F(19,"r"),fill=INK2)
    d.text((84,490-8),"大厂：Google / Microsoft / Amazon / Oracle；Bedrock AgentCore 已原生支持",font=F(18,"r"),fill=GREY)
    # 下：适合/缓行
    rrect(d,[56,524,620,920],GREENBG,GREEN)
    d.rounded_rectangle([56,524,620,586],radius=16,fill=GREEN); d.rectangle([56,564,620,586],fill=GREEN)
    d.text((84,536),"适合现在上手",font=F(28),fill=(255,255,255))
    yy=616
    for t in ["把 agent 接入真实产品 UI 的工程师","需要流式/工具调用/人在环/共享状态",
              "多框架并存、想复用同一套前端","做框架或平台、想接入事实标准",
              "研究 schema-first 协议工程化"]:
        d.ellipse([86,yy+9,100,yy+23],fill=GREEN); d.text((116,yy),t,font=F(21,"r"),fill=INK); yy+=56
    rrect(d,[662,524,1224,920],REDBG,RED)
    d.rounded_rectangle([662,524,1224,586],radius=16,fill=RED); d.rectangle([662,564,1224,586],fill=RED)
    d.text((690,536),"建议先缓一缓",font=F(28),fill=(255,255,255))
    yy=616
    for t in ["纯后端、无界面的一次性脚本 agent","已深度绑定厂商专有协议且无跨框架需求",
              "想要完全不再变化的稳定规范（617 个 issue，draft 仍演进）",
              "生产前没在 Dojo 实测过具体框架集成",
              "注意发起方 CopilotKit 的中立性张力"]:
        d.ellipse([692,yy+9,706,yy+23],fill=RED); d.text((722,yy),t,font=F(21,"r"),fill=INK); yy+=56
    # 底部命令
    rrect(d,[56,944,1224,1010],BRANDBG,BRAND)
    d.text((84,962),"最小起步：npx create-ag-ui-app@latest  或  pip install ag-ui-protocol 起 30 行 SSE server",font=F(21,"m"),fill=BRAND,anchor="lm")
    img.save(os.path.join(OUT,"04-ecosystem-verdict.png")); print("04-ecosystem-verdict.png")

if __name__=="__main__":
    fig1(); fig2(); fig3(); fig4()
    print("ALL DONE ->",OUT)
