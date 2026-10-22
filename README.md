# 专注番茄

单页番茄钟：一键开始 25 分钟倒计时，支持暂停、继续和重置，切到后台也能准确计时。

## 技术选型

| 方面 | 选择 | 理由 |
|---|---|---|
| 语言 | TypeScript（strict） | 类型检查能减少计时状态相关的错误 |
| 前端 | Vite + 原生 DOM | 只有一个页面、三种状态，用框架只会增加包体积和依赖 |
| 存储 | 浏览器 localStorage | 本期不需要登录和多端同步，所以不建后端 |
| 单元测试 | Vitest + jsdom + 假计时器 | 和 Vite 共用配置，可以快速验证倒计时逻辑 |
| 冒烟测试 | Playwright（Chromium） | 在真实浏览器里验证页面和后台场景 |
| 构建 | Vite 打包成静态文件 | 零配置，构建快 |
| 部署 | 静态托管（暂定 GitHub Pages，**待负责人评审确认**） | 免费，能一键发布 |

**备选方案**
- **Vue 3 / React + Vite**：团队更熟悉框架，或后续界面明显变复杂时改用，代价是包体积和依赖变多。
- **单个 HTML 文件，不做构建**：只适合演示原型，没有类型检查，也不方便测试，所以不选。

**浏览器支持**：Chrome / Edge / Firefox / Safari 最近两个版本，不支持 IE。

## 本地运行

需要 Node.js 22 及以上（见 `.nvmrc`）。

```bash
npm install          # CI 或想严格按 package-lock.json 安装时用 npm ci
npm run dev          # 打开终端输出的地址（默认 http://localhost:5173），页面显示 25:00
```

## 常用命令

| 命令 | 作用 |
|---|---|
| `npm run dev` | 启动开发服务器 |
| `npm test` | 运行 Vitest 单元测试 |
| `npm run test:watch` | 以监听模式运行单元测试 |
| `npm run typecheck` | TypeScript 类型检查 |
| `npm run build` | 类型检查并打包到 `dist/` |
| `npm run preview` | 本地预览打包结果 |
| `npm run test:e2e` | 运行 Playwright 冒烟测试（会自动构建并启动预览服务器） |

第一次运行冒烟测试前，先安装浏览器：`npx playwright install chromium`（CI 上用 `npx playwright install --with-deps chromium`）。默认端口是 4173，被占用时可以用环境变量 `E2E_PORT` 换一个端口。

冒烟测试默认会先执行 `npm run build`。如果已经构建过，可以设置 `E2E_SKIP_BUILD=1` 跳过构建，直接测试现有的 `dist/`。CI 上建议拆成两步：

```bash
npm ci
npm run build
npx playwright install --with-deps chromium
E2E_SKIP_BUILD=1 npm run test:e2e
# PowerShell: $env:E2E_SKIP_BUILD="1"; npm run test:e2e
```

冒烟测试会忽略环境里的 `BASE_PATH`，固定按根路径构建和预览。所以设置了 `E2E_SKIP_BUILD` 时，现有的 `dist/` 也必须是按根路径构建的，不能是带 `BASE_PATH` 的部署包。

## 目录约定

```
index.html            页面入口
src/
  main.ts             应用入口
  style.css           全局样式
  timer/              纯计时逻辑，不碰 DOM，方便单元测试
  ui/                 DOM 渲染和事件绑定（后续故事创建）
  storage/            localStorage 封装（后续故事创建）
e2e/                  Playwright 端到端测试
```

- 单元测试和源码放在一起，命名为 `*.test.ts`
- 端到端测试统一放在 `e2e/`，命名为 `*.spec.ts`

## 开发约定

- **计时方式**：浏览器会节流后台标签页的定时器，所以剩余时间一律用「结束时间戳 − `Date.now()`」来计算，`setInterval` 只负责触发刷新，不能靠累加它的次数来计时。
- **localStorage**：key 统一加 `zzf:` 前缀并带版本号，例如 `zzf:v1:today`，方便以后做数据迁移。
- **npm scripts** 要能跨平台运行，不要写 `rm -rf`、`VAR=x cmd` 这类 POSIX 专用写法。

## 部署

`npm run build` 会生成纯静态的 `dist/`，可以放到任意静态托管平台。部署到 GitHub Pages 时，要把资源路径设成仓库名，否则资源会 404：

```bash
# PowerShell: $env:BASE_PATH="/仓库名/"; npm run build
BASE_PATH=/仓库名/ npm run build
```

**待确认**：部署平台和访问域名需要负责人在评审时确认，确认后补充到这里，再接入 CI 和发布流程。
