# 姿势 depth 集 · POSE-DB-02

中文参考姿势深度图（depth）图库。界面为简体中文，纯静态实现，无需构建、无第三方运行时依赖。

> 288 个姿势 · 1,439 张多角度深度图 · 无脸灰色人体模型（3:4）· 越白越靠前

与 [ai-pose-gallery-zh](https://github.com/fairyliuying/ai-pose-gallery-zh)（POSE-DB-01）为同一批姿势的深度图版本，可配合线稿图库对照使用。

## 功能

- 按系列筛选：全身单人·性感风 / 全身单人·标准风 / 上半身单人 / 双人互动
- 按分类、角度（正面 / 俯视 / 仰视 / 侧面 / 斜侧）筛选，支持「按姿势 / 按单张」两种显示
- 按姿势名、编号、ID 搜索
- 点击卡片在灯箱内查看大图，并可下载原尺寸 depth PNG
- 键盘操作：`←` `→` 切换角度，`↑` `↓` 切换姿势，`Esc` 关闭
- 响应式布局

## 使用

### 直接打开

用浏览器打开根目录的 `index.html` 即可，无需服务器。

### 本地服务器（可选）

个别浏览器对 `file://` 下的资源加载较严格，可启动一个静态服务器：

```powershell
# Python
python -m http.server 8000

# 或 Node.js
npx serve .
```

然后访问 <http://localhost:8000>。

### Docker

仓库根目录提供 `Dockerfile`，基于 `nginx:alpine` 托管静态页面：

```powershell
docker build -t ai-pose-depth-gallery-zh .
docker run --rm -p 8080:80 ai-pose-depth-gallery-zh
```

然后访问 <http://localhost:8080>。也可用 Docker Compose：

```powershell
docker compose up -d --build
```

镜像只包含页面与图片；`.git`、`data/` 等维护文件不会进入构建上下文。

### 其他静态托管

本仓库为纯静态页面，无需构建。发布目录为仓库根目录，可部署到 GitHub Pages、Cloudflare Pages、Vercel 或任意静态托管服务。

## 目录结构

```text
.
├── index.html          # 页面入口
├── styles.css          # 样式
├── app.js              # 筛选、搜索、灯箱等交互
├── poses-data.js       # 前端数据（META + D）
├── data/
│   └── manifest.json   # 图片清单（thumbs / imgs 路径列表）
├── thumbs/             # 1,439 张缩略图 JPG（约 16 MB）
├── img/                # 1,439 张原尺寸深度图 PNG（约 136 MB）
├── Dockerfile          # nginx:alpine 镜像定义
├── nginx.conf          # 容器内 nginx 站点配置
├── docker-compose.yml  # 可选：一条命令构建并运行
├── .dockerignore       # 构建上下文排除项
├── README.md
├── .gitattributes
├── .editorconfig
└── .gitignore
```

## 数据格式

`poses-data.js` 以两个全局常量提供数据：

```js
const META = { lines: ['全身单人·性感风', '全身单人·标准风', '上半身单人', '双人互动'] };
const D = [
  {
    id: 'full_sexy_P001_front',
    line: '全身单人·性感风',
    num: 'P001',
    cat: '站姿',
    name: 'S形站姿·胯向侧顶出',
    ang: '正面',
    thumb: 'thumbs/full_sexy_P001_front.jpg',
    full: 'img/full_sexy_P001_front.png',
    name_jp: 'S字立ち・腰を横に突き出す'
  }
  // ...
];
```

| 字段 | 说明 |
| --- | --- |
| `id` | 单张唯一 ID（系列_编号_角度） |
| `line` | 系列 |
| `num` | 姿势编号（同一姿势多角度共用） |
| `cat` | 姿势分类 |
| `name` | 姿势中文名 |
| `ang` | 角度：正面 / 俯视 / 仰视 / 侧面 / 斜侧 |
| `thumb` | 缩略图相对路径（`thumbs/`） |
| `full` | 原尺寸图相对路径（`img/`） |
| `name_jp` | 姿势日文原名（供检索参考） |

## 内容统计

| 系列 | 姿势数 | 深度图数 |
| --- | ---: | ---: |
| 全身单人·性感风 | 80 | 399 |
| 全身单人·标准风 | 73 | 365 |
| 上半身单人 | 80 | 400 |
| 双人互动 | 55 | 275 |
| **合计** | **288** | **1,439** |

每个姿势含正面、俯视、仰视、侧面、斜侧 5 个角度（个别姿势缺 1 个角度，故总数为 1,439 而非 1,440）。

## 已做处理

- 界面翻译为简体中文
- 去除推广、社群引流、开放聊天室等广告向内容
- 图片使用相对路径，可直接部署到任意静态托管服务

## 许可与使用注意

- depth 是前后关系示意；可免费用于作品创作（含商用、编辑、参考）
- 图像数据本身（含原尺寸与加工后）禁止再分发、转载、转售
- 禁止批量下载（含工具自动抓取）后再分发 / 转载 / 销售
- 无需署名（自愿）；按原样提供，不附带保证
- 原图为人体模型姿势，并非真人；请勿用于指代真人 / 未成年人，或违反公序良俗的用途
