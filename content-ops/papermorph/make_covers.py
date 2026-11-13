from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageStat

ROOT = Path(__file__).resolve().parents[2]
MEDIA = ROOT / "content-ops" / "papermorph" / "media"
STATIC = ROOT / "static" / "images" / "papermorph"
FONT_REGULAR = r"C:\Windows\Fonts\msyh.ttc"
FONT_BOLD = r"C:\Windows\Fonts\msyhbd.ttc"


def font(size, bold=False):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REGULAR, size)


def assert_clean(strings):
    for value in strings:
        assert "\ufffd" not in value
        assert "?" not in value
        for char in value:
            if char.strip():
                assert font(32).getlength(char) > 0, char


def save(image, name):
    STATIC.mkdir(parents=True, exist_ok=True)
    for folder in (MEDIA, STATIC):
        image.save(folder / name, optimize=True)
    assert ImageStat.Stat(image).var[0] > 100


def wechat():
    strings = ["Papermorph", "一份资料，", "变成会讲、会动、", "能互动的书", "4 个官方案例", "互动课程", "纸偶绘本", "知识纪录片", "历史地图"]
    assert_clean(strings)
    image = Image.new("RGB", (1080, 864), "#F5EFE4")
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((56, 46, 416, 100), radius=27, fill="#163D36")
    draw.text((82, 58), "OPEN SOURCE · PAPERMORPH", font=font(23, True), fill="#F5EFE4")
    draw.text((58, 146), strings[1], font=font(66, True), fill="#17332E")
    draw.text((58, 242), strings[2], font=font(66, True), fill="#17332E")
    draw.text((58, 338), strings[3], font=font(82, True), fill="#D25B36")
    draw.rounded_rectangle((756, 154, 1008, 260), radius=24, fill="#E4B94F")
    draw.text((790, 181), strings[4], font=font(37, True), fill="#17332E")
    labels = [("互动课程", "#C8DDD5"), ("纸偶绘本", "#F1C7B5"), ("知识纪录片", "#D8D2E8"), ("历史地图", "#E9D79C")]
    for index, (label, color) in enumerate(labels):
        x = 58 + (index % 2) * 492
        y = 520 + (index // 2) * 142
        draw.rounded_rectangle((x, y, x + 464, y + 112), radius=22, fill=color)
        draw.ellipse((x + 26, y + 31, x + 76, y + 81), fill="#17332E")
        draw.text((x + 104, y + 29), label, font=font(39, True), fill="#17332E")
    draw.text((60, 810), "教材 · 故事 · 书籍 · 观点", font=font(25), fill="#5C6A64")
    save(image, "cover-wechat.png")


def zhihu():
    strings = ["Papermorph", "互动内容的另一种做法", "教材 / 绘本 / 纪录片 / 历史地图", "4 个官方案例", "互动课程", "纸偶绘本", "纪录片", "历史地图"]
    assert_clean(strings)
    image = Image.new("RGB", (1600, 900), "#101C2B")
    draw = ImageDraw.Draw(image)
    draw.text((70, 72), strings[0], font=font(62, True), fill="#E8EEF4")
    draw.rectangle((72, 160, 176, 168), fill="#E8A74B")
    draw.text((70, 214), strings[1], font=font(52, True), fill="#E8EEF4")
    draw.text((72, 306), strings[2], font=font(28), fill="#AFC0CE")
    draw.rounded_rectangle((70, 396, 328, 458), radius=16, fill="#1F3C4B")
    draw.text((98, 409), strings[3], font=font(29, True), fill="#E8A74B")
    draw.text((72, 764), " beats → style.json → static site ", font=font(25), fill="#7892A5")
    cases = [
        ("case-linear-algebra.png", "互动课程"),
        ("case-little-horse.png", "纸偶绘本"),
        ("case-madness-documentary.png", "纪录片"),
        ("case-time-of-the-magicians.png", "历史地图"),
    ]
    for index, (filename, label) in enumerate(cases):
        x = 716 + (index % 2) * 414
        y = 88 + (index // 2) * 376
        thumb = ImageOps.fit(Image.open(MEDIA / filename).convert("RGB"), (386, 276), method=Image.Resampling.LANCZOS)
        mask = Image.new("L", thumb.size, 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, 385, 275), radius=20, fill=255)
        image.paste(thumb, (x, y), mask)
        draw.rounded_rectangle((x, y + 292, x + 386, y + 348), radius=12, fill="#1A3040")
        draw.text((x + 22, y + 301), label, font=font(27, True), fill="#D8E2EA")
    save(image, "cover-zhihu.png")


if __name__ == "__main__":
    wechat()
    zhihu()
    print("cover-wechat.png: 1080x864")
    print("cover-zhihu.png: 1600x900")
