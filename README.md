# Martin Sports Visual

这是 `Martin Sports Visual / Martin 运动影像` 的手机 H5 运动摄影作品集和报价单项目。

项目用于微信、小红书、抖音私信中给客户查看案例、风格、服务方向和报价。页面是移动端优先设计，桌面端会居中显示为手机画布效果，适合手机截图、微信转发、浏览器导出 PDF 或长图。

## 如何本地打开

直接用浏览器打开以下文件即可：

- `index.html`：作品集页面
- `pricing.html`：报价单页面
- `desktop.html`：电脑端作品集页面

如果浏览器限制本地文件，也可以在项目目录启动一个简单静态服务：

```bash
python3 -m http.server 8080
```

然后访问：

```text
http://localhost:8080/index.html
http://localhost:8080/pricing.html
http://localhost:8080/desktop.html
```

## 图片替换说明

所有图片都放在：

```text
assets/images/
```

请保持文件名不变，直接替换同名图片即可。

- `cover-cycling-pink-pan.jpg`：建议使用最强封面图，例如粉色女骑手横向追焦。
- `speed-01.jpg`：高速追焦作品。
- `speed-02.jpg`：TT 或竞技姿态追焦作品。
- `speed-03.jpg`：另一张动态速度感作品。
- `night-01.jpg`：夜骑远景氛围图。
- `night-02.jpg`：夜景人物或车队图。
- `night-03.jpg`：城市灯光夜骑图。
- `portrait-01.jpg`：女性夜景半身运动肖像。
- `portrait-02.jpg`：男骑手人车站姿图。
- `portrait-03.jpg`：自然笑容或人物特写图。
- `relation-01.jpg`：骑手调整车辆或赛前准备图。
- `relation-02.jpg`：人车关系静态近景。
- `relation-03.jpg`：骑行状态或人物互动图。
- `gear-01.jpg`：整车装备大片，例如黄色 Dahon 夜景图。
- `gear-02.jpg`：装备局部细节图。
- `gear-03.jpg`：个性车架、涂装或轮组特写图。
- `team-01.jpg`：车队夜骑图。
- `team-02.jpg`：多人赛事或活动图。
- `team-03.jpg`：俱乐部 / 车队 / 活动记录图。
- `speed-04.jpg`：补充速度追焦作品，例如男骑手公路追焦。
- `speed-05.jpg`：补充速度追焦作品，例如白色女骑手追焦。
- `ai-visual-01.jpg`：AI 处理品牌海报图。
- `ai-visual-02.jpg`：AI 处理夜骑双重曝光或社交封面图。
- `cinema-01.jpg`：花景、色彩、人物状态类电影感图。
- `cinema-02.jpg`：人车特写、竞技特写或商业感图。
- `cinema-03.jpg`：人车关系、摄影师视角或叙事组图。
- `cinema-04.jpg`：电影感骑行组图或 HEIC 转 JPG 后的叙事作品。
- `social-douyin-qr.jpg`：抖音二维码裁切图，当前账号为 `潇潇乐 XXL_Martin`，抖音号 `624889043`。
- `social-douyin-card.jpg`：抖音完整二维码截图，作为备份素材保留。
- `social-xiaohongshu-qr-v2.png`：由 `IMG_5743.JPG` 裁切的小红书二维码图，当前小红书号 `551501728`。
- `social-xiaohongshu-card.jpg`：小红书完整名片截图，作为备份素材保留。

建议图片比例：

- 封面图：竖图或横图都可以，人物主体尽量在画面中部偏下。
- 作品图：优先使用竖图，比例接近 3:4 或 4:5。
- 夜骑与装备图：可以使用更暗、更有光线层次的照片。

页面已经加入图片缺失 fallback。即使图片暂时缺失或文件为空，版面也不会崩坏。

## 如何修改抖音 / 小红书入口

首页 `index.html` 和电脑端 `desktop.html` 都已经加入社交账号入口。

当前链接为：

- 抖音：`https://www.douyin.com/search/624889043`
- 小红书：`https://www.xiaohongshu.com/search_result?keyword=551501728`

如需修改，直接搜索以下内容即可：

- `624889043`
- `551501728`
- `social-douyin-qr.jpg`
- `social-xiaohongshu-qr-v2.png`

说明：抖音和小红书的外部直达规则经常变化，所以页面使用账号搜索入口，同时保留二维码，方便客户扫码跳转。

## 如何修改价格

打开 `pricing.html`，直接搜索价格数字即可修改，例如：

- `¥699`
- `¥1280`
- `¥1980-¥2680`
- `¥3999 起`

首页 `index.html` 底部也有价格入口，如需同步修改，可搜索：

- `699 元起`
- `1280 元起`
- `1980 元起`
- `3999 元起`

## 如何导出 PDF

1. 用 Chrome 打开 `index.html` 或 `pricing.html`。
2. 按 `Command + P`。
3. 目标打印机选择“保存为 PDF”。
4. 纸张选择 A4 或自定义尺寸。
5. 勾选“背景图形”。
6. 缩放选择“适合页面”，如果想保留手机长页视觉，可尝试 90%-100%。
7. 保存 PDF。

`pricing.html` 已加入打印样式，打印时会隐藏固定底部按钮和返回顶部按钮，并尽量避免套餐卡片被截断。

## 如何导出长图

可以使用以下方式：

- 浏览器自带截图工具。
- Chrome 开发者工具里的全页面截图。
- 后续用 Playwright 导出整页截图。

如果用 Chrome 开发者工具：

1. 打开页面。
2. 按 `Command + Option + I` 打开开发者工具。
3. 按 `Command + Shift + P`。
4. 搜索 `Capture full size screenshot`。
5. 选择后即可导出整页长图。

## 部署建议

这是一个纯静态项目，可以部署到：

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- 任意静态网站托管服务

部署后会得到一个链接，可以直接发给客户在手机上查看。

部署时请以项目根目录为静态站点根目录，首页入口就是 `index.html`。项目已加入 `.vercelignore` 和 `.gitignore`，会排除 `pics/`、`review/`、`tools/`、二维码原始截图和 `.DS_Store` 等本地素材，避免把 700MB+ 的筛选素材一起上传。

如果部署到 GitHub Pages，建议只提交以下运行必需文件：

- `index.html`
- `pricing.html`
- `desktop.html`
- `README.md`
- `assets/images/`
- `.gitignore`
- `.vercelignore`

## 文件结构

```text
martin-sports-visual/
├── .gitignore
├── .vercelignore
├── index.html
├── pricing.html
├── desktop.html
├── README.md
└── assets/
    └── images/
        ├── cover-cycling-pink-pan.jpg
        ├── speed-01.jpg
        ├── speed-02.jpg
        ├── speed-03.jpg
        ├── night-01.jpg
        ├── night-02.jpg
        ├── night-03.jpg
        ├── portrait-01.jpg
        ├── portrait-02.jpg
        ├── portrait-03.jpg
        ├── relation-01.jpg
        ├── relation-02.jpg
        ├── relation-03.jpg
        ├── gear-01.jpg
        ├── gear-02.jpg
        ├── gear-03.jpg
        ├── team-01.jpg
        ├── team-02.jpg
        ├── team-03.jpg
        ├── speed-04.jpg
        ├── speed-05.jpg
        ├── ai-visual-01.jpg
        ├── ai-visual-02.jpg
        ├── cinema-01.jpg
        ├── cinema-02.jpg
        ├── cinema-03.jpg
        ├── cinema-04.jpg
        ├── social-douyin-qr.jpg
        ├── social-douyin-card.jpg
        ├── social-xiaohongshu-qr-v2.png
        └── social-xiaohongshu-card.jpg
```

## 后续维护

- 修改文案：直接编辑 `index.html` 或 `pricing.html` 中对应中文内容。
- 修改按钮链接：搜索 `bottom-cta` 或按钮文案。
- 修改图片：替换 `assets/images/` 中同名图片。
- 修改视觉风格：两个页面的 CSS 都写在各自的 `<style>` 标签里，变量集中在 `:root`。
