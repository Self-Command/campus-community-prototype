# 校园社区 App 原型（Campus Link）

高保真、可交互的校园社区原生 App 页面原型集合，共 **79 个页面**，覆盖认证引导、内容流、频道与权限、活动与投票、校园服务、个人中心与设置等完整业务链路。配套一份企业级完整需求分析 PRD（约 8.4 万字符）。

原型为纯静态 HTML / CSS / JavaScript，无构建步骤，直接用浏览器打开 `index.html` 即可浏览全部页面目录。

## 快速开始

```bash
# 方式一：直接打开入口页
start index.html        # Windows
open index.html         # macOS

# 方式二：起一个本地静态服务（推荐，避免 file:// 相对路径限制）
python -m http.server 8080
# 然后访问 http://127.0.0.1:8080/index.html
```

## 页面目录

### 认证与引导
- [启动页](campus-splash.html) — 登录态检查与首跳
- [登录页](campus-login.html) — 账号密码登录
- [注册页](campus-register.html) — 学生 / 教职工 / 工作人员三步注册
- [找回密码](campus-forgot-password.html) — 手机号校验与重置
- [资料完善](campus-onboarding.html) — 头像、用户名、学院与展示策略

### 主导航与内容
- [首页](campus-home.html) — 信息流、服务快捷入口、活动与投票卡片
- [频道](campus-channels.html) — 我加入的、我管理的、发现频道
- [消息](campus-messages.html) — 通知、私信、官方消息与新建私信
- [会话资料](campus-chat-profile.html) — 私信三点入口、聊天记录、媒体、举报与删除会话
- [我的](campus-profile.html) — 资料、草稿、收藏、服务发布与设置
- [搜索页](campus-search.html) — 帖子 / 用户 / 频道 / 活动分组结果
- [帖子详情](campus-post-detail.html) — 正文、互动与评论线程
- [帖子组件样本](campus-post-card-specimens.html) — 所有有效发布组合、权限矩阵与状态样本
- [话题详情](campus-topic-detail.html) — 话题聚合与排序

### 频道、活动、投票
- [频道详情](campus-channel-detail.html) — 频道主页、动态、活动、投票、成员、资料
- [频道设置](campus-channel-manage.html) — QQ 式设置总页；每个设置项独立跳转，待处理与帖子审核分开处理
- [待处理详情](campus-channel-ticket-detail.html) — 入群申请与认证补件进入详情页后再做通过、拒绝或补充
- [帖子审核详情](campus-post-review.html) — 从内容管理进入，完整查看帖子后决定通过、退回或下架
- [活动全链路](campus-activity-list.html) — 列表、详情、报名、签到、管理、我的活动
- [投票全链路](campus-vote-detail.html) — 发布、详情、结果、我的投票

### 校园服务
- [二手市场](campus-secondhand.html) — 列表、详情、发布、我的发布
- [失物招领](campus-lost-found.html) — 列表、详情、发布
- [校园招聘](campus-jobs.html) — 列表、详情、发布、投递简历
- [互助求助](campus-help.html) — 列表、详情、回复求助
- [校园新闻](campus-news.html) — 列表与详情

### 个人中心与设置
- [编辑资料](campus-edit-profile.html) — 用户名、签名、头像与展示说明
- [账号设置](campus-account-settings.html) — 隐私开关、改手机号、改密码、注销
- [帮助与反馈](campus-help-center.html) — FAQ、意见反馈、我的反馈
- [关于我们](campus-about.html) — 平台原则、版本与服务说明

完整页面清单见入口页 [index.html](index.html)。

## 设计基线

- **形态**：Android / iOS / 平板原生体验，`app-shell` + `appbar` + `page` 三段式布局。
- **视觉**：克制型信息层级，参考 X 的内容流与 Linear 的工作台秩序，不使用品牌资产与像素级复刻。
- **交互**：底部发布选择面板、动态 toast 委托、刷新忙碌态、搜索空态提示、焦点环、按压反馈、`prefers-reduced-motion` 降级。
- **规则**：实名注册、先审后发、频道权限分级、活动报名与签到、投票不可改、校园服务五类入口、账号隐私开关。

## 目录结构

```
.
├── index.html                       # 原型入口 / 全量页面目录
├── campus-*.html                    # 79 个功能页面
├── campus-native.css                # 全局设计系统与组件样式
├── campus-native.js                 # 全局交互：发布面板、toast、刷新态、空态
├── campus-posts.css / .js           # 信息流与帖子卡片
├── campus-channel.css               # 频道域样式
├── campus-services.css / .js        # 校园服务域样式与交互
├── campus-personal.css              # 个人中心样式
├── campus-activity-admin.css / .js  # 活动管理
├── campus-channel-admin-data.js     # 频道管理数据
├── campus-post-detail.js            # 帖子详情交互
├── campus-post-fixtures.js          # 帖子样本数据
├── *.artifact.json                  # 原型生成元数据
├── critique.json                    # 设计评审记录
└── 校园社区_企业级完整需求分析PRD.md  # 企业级 PRD
```

## 需求文档

[校园社区_企业级完整需求分析PRD.md](校园社区_企业级完整需求分析PRD.md) 覆盖执行摘要与不可变决策、角色与权限、信息架构、功能清单、内容安全与治理、Web 管理后台、业务流程、数据模型、API 与实时架构、UI/UX 强制约束、技术架构、非功能需求、测试与验收、里程碑规划、风险登记等 16 个章节及 3 个附录。

## 说明

本仓库为原型与需求产出，不含后端服务与真实数据；页面交互数据均为本地样本（fixtures）。`*.artifact.json` 与 `critique.json` 为原型工具生成的元数据与评审记录，随原型一并保留以便追溯。
