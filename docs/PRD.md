# AI 辅助 TRPG 主持人工作台 PRD

## 0. 文档信息

**产品名称**：AI 辅助 TRPG 主持人工作台  
**英文名称**：AI-TRPG Collaboration Platform  
**文档类型**：产品需求文档（PRD）  
**当前版本**：V0.1 / MVP 版本  
**目标岗位展示方向**：AI 产品技术实习生 / FDE / 解决方案工程 / 全栈开发  
**核心定位**：面向 TRPG 主持人与玩家的 AI 协作跑团平台，围绕备团、角色管理、Session 记录和团后复盘提供轻量化工具。

---

## 1. 产品背景

TRPG，即桌面角色扮演游戏，是一种多人协作叙事游戏。通常由主持人负责世界观设定、剧情推进、NPC 扮演、规则裁定和信息记录，玩家通过角色扮演参与故事发展。

在实际跑团过程中，主持人需要同时维护剧本资料、角色信息、NPC 设定、线索状态、地点资料、规则说明和每次 Session 的剧情记录。现有工作流通常依赖 Notion、飞书文档、微信群 / Discord、骰子机器人、表格和个人笔记，信息分散且缺少统一结构。短团中，这种分散状态还能依靠主持人的记忆维持；长线跑团中，剧情跨度变长，NPC 关系复杂，玩家选择不断积累，信息割裂会直接导致剧情遗忘、线索丢失、复盘成本高和继续开团动力下降。

本产品希望提供一个面向主持人与玩家的 AI 协作跑团平台，将 Campaign 管理、角色卡、Session 记录、NPC 资料和 AI 摘要整合到同一工作流中，帮助主持人降低备团和复盘成本，提高长线跑团的连续性。

本产品第一阶段不追求成为大型跑团社区，而是优先验证一个核心命题：当主持人拥有一个围绕 Campaign 组织的信息工作台，并且 AI 能够基于 Session Log 生成结构化摘要时，跑团的记录、复盘和延续成本是否会下降。

---

## 2. 产品定位

### 2.1 一句话定位

AI 辅助 TRPG 主持人工作台是一个面向桌面角色扮演游戏主持人与玩家的 AI 协作平台，帮助主持人集中管理 Campaign、角色卡、Session 记录和团后摘要，降低备团、开团和复盘过程中的信息组织成本。

### 2.2 产品形态

本产品第一版是一个桌面端优先的 Web 应用，采用工作台式信息架构。用户登录后进入 Dashboard，查看自己创建或加入的 Campaign。每个 Campaign 是一个独立的跑团工作区，内部包含世界观、成员、角色卡、Session、NPC、AI 输出和设置。

### 2.3 核心价值

1. 将分散在文档、聊天记录、表格和个人笔记中的跑团信息集中到 Campaign 工作区；
2. 为主持人提供结构化的 Session 记录与历史回顾能力；
3. 使用 AI 生成团后摘要、关键线索、玩家决策和下次开团提醒；
4. 让玩家能够维护角色卡并查看历史剧情，减少长线跑团中的信息断裂；
5. 通过轻量级权限系统区分主持人与玩家，保证协作边界清晰。

---

## 3. 目标用户

### 3.1 核心用户：主持人 / KP / DM

主持人负责 Campaign 创建、剧情准备、NPC 管理、Session 记录和团后复盘，是平台第一阶段最重要的目标用户。

#### 典型特征

- 每周或每两周组织一次跑团；
- 需要长期维护剧情、角色、NPC、线索和地点；
- 经常使用多个工具进行资料管理；
- 在长线跑团中承担大量回顾、提醒和复盘工作；
- 对 AI 辅助生成摘要、NPC、剧情钩子和线索整理有明确需求；
- 对工具效率敏感，不愿为了管理工具额外付出太高学习成本。

#### 核心需求

- 快速创建并管理一个 Campaign；
- 在一个地方查看世界观、角色、NPC 和 Session 记录；
- 能够在跑团后快速整理剧情摘要；
- 能够回看历史 Session，追踪未解决问题和关键线索；
- 能够把 AI 输出作为初稿，再由主持人编辑确认。

---

### 3.2 次级用户：玩家

玩家通过角色卡、剧情记录和 Campaign 页面参与协作，主要需求是理解世界观、维护角色信息、回顾历史剧情。

#### 典型特征

- 加入主持人创建的 Campaign；
- 需要维护自己的角色卡；
- 需要查看 Campaign 的基础设定；
- 在长线跑团中需要回顾前情、NPC 和未完成任务；
- 通常不会主动承担复杂资料整理工作。

#### 核心需求

- 通过邀请链接加入 Campaign；
- 创建和编辑自己的角色卡；
- 查看主持人公开的 Session 摘要；
- 回顾关键线索、重要 NPC 和下次开团提醒。

---

### 3.3 非第一阶段重点用户

以下用户暂不作为 MVP 的核心服务对象：

- 剧本作者；
- 公开内容创作者；
- 跑团社群管理员；
- 陌生人组队玩家；
- 付费剧本交易用户。

这些用户对应社区、内容分发、交易和组队能力，冷启动成本高，不适合作为 MVP 第一阶段目标。

---

## 4. 用户痛点

### 4.1 痛点 1：备团资料分散，主持人难以统一管理

#### 场景描述

主持人在备团时需要准备世界观、NPC、线索、地点、剧情节点、怪物、规则说明和玩家背景钩子。现实中，这些信息经常分散在多个文档、聊天记录、截图、表格和个人笔记中。

#### 当前解决方式

- 使用 Notion 或飞书文档记录世界观；
- 使用微信群、QQ 群或 Discord 沟通；
- 使用骰子机器人处理投骰；
- 使用个人文档记录 NPC 和线索；
- 使用表格或图片保存角色卡。

#### 问题

资料来源分散，开团时查找成本高；不同信息之间缺少结构化关联；主持人需要依赖个人记忆维持剧情连续性。

---

### 4.2 痛点 2：角色信息格式不统一，主持人缺少总览视图

#### 场景描述

玩家角色卡经常以图片、文档、表格或聊天消息形式存在。不同玩家的格式不同，更新频率不同，主持人需要临时查找角色背景、物品、状态和能力值。

#### 当前解决方式

- 玩家各自维护角色卡；
- 主持人手动收集截图或文档链接；
- 开团时通过聊天记录查找角色信息。

#### 问题

角色信息不统一，主持人无法快速查看全队状态；玩家更新角色卡后，主持人不一定知道；权限边界不清，信息容易混乱。

---

### 4.3 痛点 3：长线跑团中剧情连续性容易断裂

#### 场景描述

长线 Campaign 通常跨越多次 Session。随着剧情推进，NPC 关系、玩家选择、未解决线索和隐藏信息不断增加。间隔一到两周后，玩家和主持人都会遗忘上一局的细节。

#### 当前解决方式

- 开团前由主持人口头回顾；
- 玩家翻聊天记录；
- 主持人手动写总结；
- 依赖个别玩家记笔记。

#### 问题

回顾时间长，信息遗漏多，主持人负担重。剧情连续性下降会影响玩家沉浸感，也会降低长线 Campaign 的持续动力。

---

### 4.4 痛点 4：团后复盘依赖手动整理，主持人成本高

#### 场景描述

每次 Session 结束后，主持人需要整理剧情摘要、关键线索、玩家选择、NPC 状态变化、未完成任务和下次开团提醒。这类整理工作重复性强，但完全不整理又会影响下一次跑团。

#### 当前解决方式

- 主持人手动写复盘；
- 玩家自行记录；
- 不做正式整理，下一次开团前临时回顾。

#### 问题

手动复盘耗时，主持人容易拖延；玩家记录质量不稳定；长线剧情中的关键信息容易丢失。

---

## 5. 产品目标

### 5.1 用户目标

帮助主持人将 Campaign 资料、角色卡、Session 记录和团后摘要集中管理，降低备团、开团和复盘过程中的信息组织成本。

帮助玩家维护角色信息并查看历史剧情，减少长线跑团中的前情遗忘和信息不对称。

---

### 5.2 产品目标

完成一个围绕 Campaign 的最小可用工作流：

```text
主持人创建 Campaign
↓
添加或邀请玩家
↓
玩家创建角色卡
↓
主持人创建 Session
↓
记录本次跑团内容
↓
AI 生成结构化摘要
↓
主持人编辑确认
↓
摘要沉淀到 Campaign 历史中
```

MVP 阶段的产品目标不是覆盖所有跑团场景，而是验证 Campaign + Character + Session + AI Summary 这一闭环是否成立。

---

### 5.3 验证目标

第一阶段通过小范围用户测试验证以下问题：

1. 主持人是否愿意在平台中创建 Campaign 并维护 Session；
2. 玩家是否愿意在平台中创建和维护角色卡；
3. AI 摘要是否能减少主持人的团后整理时间；
4. Campaign + Character + Session 的结构是否符合实际跑团习惯；
5. 主持人是否愿意在下一次跑团继续使用该平台。

---

## 6. MVP 范围

### 6.1 本期包含功能

#### 6.1.1 用户认证

支持用户注册、登录和退出，为后续 Campaign 权限和成员管理提供基础。

#### 6.1.2 Campaign 管理

主持人可以创建、编辑、删除 Campaign，查看自己创建或加入的 Campaign。

#### 6.1.3 成员与权限

Campaign 中区分主持人和玩家。主持人拥有管理权限，玩家可以维护自己的角色卡并查看公开信息。

#### 6.1.4 角色卡管理

玩家可以创建和编辑自己的角色卡。主持人可以查看 Campaign 下所有角色卡。

#### 6.1.5 Session 管理

主持人可以创建 Session，记录本次跑团内容，查看历史 Session。

#### 6.1.6 AI 剧情摘要

主持人可以基于 Session Log 生成结构化摘要，包括剧情概述、关键线索、玩家决策、NPC 状态变化、未解决问题和下次开团提醒。

#### 6.1.7 AI NPC 生成

主持人可以输入简单设定，生成 NPC 的身份、性格、秘密、动机和可用台词。

---

### 6.2 本期不包含功能

1. 不做大型社区、帖子广场和公开内容推荐；
2. 不做好友系统和私信系统；
3. 不做实时语音、视频和地图战棋；
4. 不做完整 DND / COC / PF 规则引擎；
5. 不做支付系统和商业化功能；
6. 不做移动端 App，仅优先支持桌面 Web；
7. 不做复杂匹配组队功能；
8. 不做公开剧本交易与创作者市场。

---

### 6.3 MVP 取舍说明

#### 为什么第一版不做社区

社区功能依赖用户规模、内容供给和关系链，冷启动成本高。第一版项目目标是验证单个跑团小组内部的协作价值，因此暂不做社区广场、好友系统和公开推荐。待工具价值被验证后，再考虑通过模板库和公开内容沉淀扩展社区能力。

#### 为什么第一版不做完整规则系统

不同规则系统的角色卡结构差异较大。第一版若直接适配 DND、COC、PF 等多种规则，会增加开发复杂度并拖慢 MVP 验证。通用角色卡可以覆盖角色身份、背景、状态、物品和备注等基础需求，后续再通过模板系统支持不同规则。

#### 为什么第一版优先做 AI 摘要

AI 写剧本属于创作型功能，输出质量受风格、设定和主持人偏好影响较大，评价标准不稳定。AI 摘要基于已发生的 Session Log，输入明确、输出结构清晰，更容易验证是否节省时间。因此第一版优先实现 AI 摘要，后续再扩展剧情钩子生成和更复杂的创作功能。

---

## 7. 核心业务对象

### 7.1 Campaign

Campaign 是产品的一级业务对象，是一场长期跑团的项目空间。所有角色、成员、NPC、Session、剧情记录和 AI 输出都围绕 Campaign 组织。

Campaign 类似 SaaS 产品中的 workspace，也类似 FDE 项目中的客户工作区。围绕 Campaign 建模可以避免产品功能散乱，并为后续权限、数据结构和页面导航提供清晰基础。

### 7.2 Character

Character 是玩家在 Campaign 中的角色信息。第一版采用通用角色卡结构，不绑定具体规则系统。

### 7.3 Session

Session 是一次具体跑团记录，包含标题、日期、原始记录、AI 摘要和历史回顾。

### 7.4 AI Output

AI Output 是 AI 生成内容的持久化记录，包括摘要、NPC、剧情钩子等类型。第一版至少保存 AI 摘要和 NPC 生成结果。

---

## 8. 信息架构与页面结构

### 8.1 页面路由

```text
/login
/dashboard
/campaigns
/campaigns/[id]
/campaigns/[id]/overview
/campaigns/[id]/characters
/campaigns/[id]/sessions
/campaigns/[id]/sessions/[sessionId]
/campaigns/[id]/npcs
/campaigns/[id]/ai
/campaigns/[id]/settings
/settings
```

### 8.2 Dashboard

Dashboard 是用户登录后的首页，展示用户创建和加入的 Campaign。

#### 页面内容

- 我创建的 Campaign；
- 我加入的 Campaign；
- 最近访问的 Campaign；
- 创建 Campaign 入口；
- 空状态引导。

### 8.3 Campaign 详情页

Campaign 详情页采用左侧导航 + 右侧内容区域的工作台布局。

#### 左侧导航

- Overview；
- Characters；
- Sessions；
- NPCs；
- AI Assistant；
- Settings。

### 8.4 Characters 页面

用于查看和维护角色卡。主持人可查看所有角色卡，玩家可编辑自己的角色卡。

### 8.5 Sessions 页面

用于查看历史 Session 列表、创建新 Session、进入 Session 详情页。

### 8.6 AI Assistant 页面

用于提供 AI 辅助能力。第一版包含 AI 摘要和 AI NPC 生成。后续扩展剧情钩子、线索整理和风格化生成。

---

## 9. 核心用户流程

### 9.1 流程 1：主持人创建 Campaign

```text
主持人登录
↓
进入 Dashboard
↓
点击 Create Campaign
↓
填写标题、系统类型、简介、世界观
↓
提交创建
↓
系统创建 Campaign
↓
当前用户自动成为 Campaign 主持人
↓
跳转到 Campaign Overview
```

### 9.2 流程 2：玩家加入 Campaign 并创建角色卡

```text
玩家登录
↓
通过邀请链接进入 Campaign
↓
加入 Campaign
↓
进入 Characters 页面
↓
点击 Create Character
↓
填写角色基础信息、背景、能力、物品和备注
↓
保存角色卡
↓
主持人可在 Characters 页面查看该角色
```

### 9.3 流程 3：主持人记录 Session 并生成摘要

```text
主持人进入 Campaign
↓
进入 Sessions 页面
↓
创建新 Session
↓
输入本次跑团记录
↓
点击 Generate Summary
↓
系统调用 AI 生成结构化摘要
↓
主持人编辑确认
↓
保存摘要
↓
玩家可查看保存后的历史摘要
```

### 9.4 流程 4：主持人生成 NPC

```text
主持人进入 Campaign
↓
进入 AI Assistant 或 NPCs 页面
↓
输入 NPC 所属地点、功能、风格和剧情作用
↓
点击 Generate NPC
↓
AI 返回 NPC 名字、身份、性格、秘密、动机和台词
↓
主持人编辑确认
↓
保存到 NPC 列表
```

---

## 10. 功能需求

## 10.1 用户认证

### 用户故事

作为用户，我希望能够注册和登录平台，以便创建或加入 Campaign，并保存自己的角色卡和跑团记录。

### 功能说明

用户可以通过邮箱注册、登录和退出系统。登录后进入 Dashboard。未登录用户访问私有页面时，系统应跳转至登录页。

### 字段设计

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| email | string | 是 | 用户邮箱 |
| password | string | 是 | 用户密码 |
| display_name | string | 否 | 用户展示名 |
| avatar_url | string | 否 | 用户头像 |

### 权限规则

- 未登录用户不可访问 Dashboard 和 Campaign 页面；
- 登录用户可以创建 Campaign；
- 登录用户可以通过邀请链接加入 Campaign。

### 异常处理

- 邮箱格式错误时提示用户修改；
- 密码为空时不可提交；
- 登录失败时显示错误提示；
- 登录成功后跳转至 Dashboard。

### 验收标准

- 用户可以完成注册、登录和退出；
- 未登录访问私有页面时跳转至登录页；
- 登录状态刷新页面后保持；
- 用户信息可以用于 Campaign 成员关联。

---

## 10.2 Campaign 创建与管理

### 用户故事

作为主持人，我希望创建一个 Campaign 工作区，用于统一管理本次跑团的世界观、角色、Session 记录和 AI 输出。

### 功能说明

用户点击 Dashboard 中的 Create Campaign 按钮后，进入创建页面。填写基础信息后，系统创建 Campaign，并将当前用户设置为该 Campaign 的 Owner / GM。

### 字段设计

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| title | string | 是 | Campaign 名称 |
| description | text | 否 | 简介 |
| system_type | string | 否 | 规则系统，如 COC、DND、原创 |
| world_setting | text | 否 | 世界观设定 |
| visibility | enum | 是 | private / invite-only |
| owner_id | uuid | 是 | 创建者 ID |

### 权限规则

- 登录用户可以创建 Campaign；
- 创建者自动成为主持人；
- 非成员不可查看 private Campaign；
- 主持人可以编辑 Campaign 基础信息；
- 主持人可以删除 Campaign；
- 玩家不可编辑 Campaign 基础信息。

### 交互规则

- Dashboard 提供创建入口；
- 创建成功后跳转 Campaign Overview；
- Campaign 列表区分“我创建的”和“我加入的”；
- 删除操作需要二次确认。

### 异常处理

- title 为空时不可提交；
- title 超过 80 字符时提示用户缩短；
- 创建失败时显示错误提示，并保留用户输入内容；
- 非成员访问私有 Campaign 时显示无权限页面。

### 验收标准

- 用户可以成功创建 Campaign；
- 创建成功后跳转到 Campaign 详情页；
- 数据库中正确写入 Campaign 记录；
- 当前用户自动写入 campaign_members 表，角色为 GM；
- 非成员无法访问 private Campaign。

---

## 10.3 成员与权限

### 用户故事

作为主持人，我希望管理 Campaign 成员，并区分主持人和玩家权限，以保证跑团资料和角色卡的编辑边界清晰。

### 功能说明

Campaign 成员分为 GM 和 Player。GM 拥有 Campaign 管理权限，Player 可以查看公开信息并维护自己的角色卡。

### 角色定义

| 角色 | 权限说明 |
|---|---|
| GM | 创建、编辑、删除 Campaign；管理 Session；查看所有角色卡；生成 AI 摘要；生成 NPC |
| Player | 查看 Campaign；创建和编辑自己的角色卡；查看已公开的 Session 摘要 |

### 权限规则

- Campaign 创建者默认为 GM；
- GM 可以邀请玩家加入 Campaign；
- Player 不能编辑 Campaign 基础信息；
- Player 不能编辑他人角色卡；
- Player 不能生成 AI 摘要；
- 非成员不能访问 Campaign 内容。

### 验收标准

- 系统能够识别当前用户在 Campaign 中的角色；
- GM 和 Player 看到的操作入口不同；
- Player 无法通过接口编辑他人角色卡；
- 非成员访问 Campaign 时被拒绝。

---

## 10.4 角色卡管理

### 用户故事

作为玩家，我希望在 Campaign 中创建并维护自己的角色卡，方便主持人了解我的角色背景、状态和物品。

作为主持人，我希望查看所有玩家的角色卡，以便在剧情推进和规则判断时快速参考。

### 功能说明

玩家可以在 Campaign 的 Characters 页面创建角色卡。角色卡第一版采用通用模板，不绑定具体规则系统。主持人可以查看当前 Campaign 下所有角色卡，玩家只能编辑自己的角色卡。

### 字段设计

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| name | string | 是 | 角色名 |
| occupation | string | 否 | 职业 / 身份 |
| background | text | 否 | 背景故事 |
| personality | text | 否 | 性格描述 |
| stats | json | 否 | 能力值 |
| inventory | json/text | 否 | 物品 |
| notes | text | 否 | 备注 |
| campaign_id | uuid | 是 | 所属 Campaign |
| user_id | uuid | 是 | 所属玩家 |

### 交互规则

- Characters 页面展示角色卡列表；
- 点击角色卡进入详情页；
- 玩家可以创建自己的角色卡；
- 玩家可以编辑自己的角色卡；
- 主持人可以查看所有角色卡；
- 第一版中主持人不默认编辑玩家角色卡，后续可扩展“锁定 / 审核 / GM 编辑”能力。

### 权限规则

- 玩家可以创建自己的角色卡；
- 玩家只能编辑自己的角色卡；
- 主持人可以查看所有角色卡；
- 非 Campaign 成员无法访问角色卡页面。

### 异常处理

- name 为空时不可提交；
- 保存失败时保留用户输入；
- 非成员访问角色卡详情时显示无权限；
- 用户编辑他人角色卡时返回权限错误。

### 验收标准

- 玩家可以创建、编辑、保存角色卡；
- 主持人可以查看 Campaign 内所有角色卡；
- 非 Campaign 成员无法访问角色卡页面；
- 角色卡数据与 Campaign 绑定正确；
- 玩家无法编辑他人角色卡。

---

## 10.5 Session 记录

### 用户故事

作为主持人，我希望记录每次跑团的剧情进展、关键线索和玩家决策，方便后续复盘和继续开团。

### 功能说明

主持人在 Campaign 中创建 Session，并输入本次跑团的文本记录。系统支持保存原始记录，并作为 AI 摘要功能的输入。

### 字段设计

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| title | string | 是 | Session 标题 |
| session_date | date | 否 | 跑团日期 |
| raw_log | text | 是 | 本次跑团记录 |
| summary | text/json | 否 | AI 摘要结果 |
| campaign_id | uuid | 是 | 所属 Campaign |
| created_by | uuid | 是 | 创建者 |

### 交互规则

- Sessions 页面展示历史 Session 列表；
- GM 可以创建新 Session；
- GM 可以编辑 Session Log；
- GM 可以在 Session 详情页生成 AI 摘要；
- Player 可以查看 GM 保存后的摘要；
- raw_log 支持长文本输入。

### 权限规则

- GM 可以创建和编辑 Session；
- Player 可以查看已公开的 Session 摘要；
- Player 是否能编辑 Session Log 作为后续配置项；
- 非 Campaign 成员不可查看 Session。

### 异常处理

- title 为空时不可提交；
- raw_log 为空时可以创建 Session，但不能生成 AI 摘要；
- 保存失败时保留用户输入；
- 删除 Session 需要二次确认。

### 验收标准

- 主持人可以创建 Session；
- 主持人可以输入并保存 Session Log；
- Campaign 详情页可以展示历史 Session 列表；
- 点击某个 Session 可以查看详情；
- Player 可以查看保存后的摘要。

---

## 10.6 AI 剧情摘要

### 用户故事

作为主持人，我希望在每次跑团结束后，基于 Session Log 自动生成结构化摘要，减少手动整理复盘内容的时间。

### 功能说明

主持人在 Session 详情页点击 Generate Summary 按钮，系统将当前 Session Log、Campaign 世界观和角色信息作为上下文，调用大模型生成结构化摘要。生成结果返回后，主持人可以编辑、保存或重新生成。

### 输入内容

- Campaign title；
- Campaign world_setting；
- Character list；
- Session raw_log。

### 输出结构

AI 输出需要包含：

1. 本次剧情概述；
2. 关键线索；
3. 玩家重要决策；
4. NPC 状态变化；
5. 未解决问题；
6. 下次开团提醒。

### Prompt 模板

```text
你是一名 TRPG 跑团记录助手。请根据以下 Campaign 信息、角色信息和本次跑团记录，生成结构化团后摘要。

请严格按照以下结构输出：

1. 本次剧情概述
2. 关键线索
3. 玩家重要决策
4. NPC 状态变化
5. 未解决问题
6. 下次开团提醒

要求：
- 不要编造跑团记录中没有出现的重要事实；
- 可以对零散信息进行整理和归类；
- 输出应便于主持人下次开团前快速回顾；
- 语言清晰，条目化呈现。

Campaign 信息：
{{campaign_context}}

角色信息：
{{character_list}}

本次跑团记录：
{{session_log}}
```

### 交互规则

- raw_log 为空时，不允许生成摘要；
- 生成中显示 loading 状态；
- 生成失败时提示用户重试；
- 生成结果默认进入可编辑状态；
- 用户点击保存后，摘要写入数据库；
- 用户可以重新生成，但需要提示会覆盖当前未保存内容；
- 保存后的摘要对 Campaign 成员可见。

### 权限规则

- 只有 GM 可以生成 AI 摘要；
- Player 可以查看 GM 保存后的摘要；
- 未保存的 AI 输出不对 Player 展示；
- 非成员不可访问 AI 摘要。

### 异常处理

- AI API 调用失败时提示重试；
- Session Log 超长时提示用户缩短或分段；
- AI 返回空内容时显示失败状态；
- 网络错误时保留原始 Session Log。

### 验收标准

- GM 点击按钮后可以成功生成摘要；
- 摘要按照固定结构输出；
- 用户可以编辑 AI 结果；
- 保存后摘要可在 Session 详情页查看；
- AI 输出记录写入 ai_outputs 表，便于后续追踪；
- Player 只能看到已保存摘要。

---

## 10.7 AI NPC 生成

### 用户故事

作为主持人，我希望根据 Campaign 世界观和剧情需要快速生成 NPC 初稿，以减少备团时的人设创作成本。

### 功能说明

主持人在 AI Assistant 或 NPCs 页面输入 NPC 的功能、所属地点、风格和剧情作用，AI 生成 NPC 的名字、身份、性格、秘密、动机和可用台词。主持人可以编辑并保存到 NPC 列表。

### 输入字段

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| location | string | 否 | NPC 所属地点 |
| role_in_story | string | 是 | NPC 在剧情中的作用 |
| tone | string | 否 | 风格，如悬疑、荒诞、黑暗、温暖 |
| secret | string | 否 | 是否需要隐藏秘密 |
| campaign_context | text | 否 | Campaign 世界观上下文 |

### 输出结构

AI 输出需要包含：

1. NPC 名字；
2. 身份；
3. 外貌特征；
4. 性格；
5. 表面目标；
6. 隐藏秘密；
7. 与玩家的关系；
8. 可用台词；
9. 可触发的剧情钩子。

### Prompt 模板

```text
你是一名 TRPG 主持人助理。请根据以下信息生成一个可用于跑团的 NPC 初稿。

请按照以下结构输出：

1. 名字
2. 身份
3. 外貌特征
4. 性格
5. 表面目标
6. 隐藏秘密
7. 与玩家的关系
8. 可用台词
9. 可触发的剧情钩子

要求：
- NPC 应符合 Campaign 世界观；
- 信息要便于主持人在开团时直接使用；
- 不要生成过长设定；
- 可以保留悬念和可扩展空间。

Campaign 世界观：
{{campaign_context}}

NPC 所属地点：
{{location}}

NPC 剧情作用：
{{role_in_story}}

风格：
{{tone}}
```

### 交互规则

- role_in_story 为空时不可生成；
- 生成结果默认可编辑；
- 用户可以保存到 NPC 列表；
- 用户可以重新生成；
- 保存后的 NPC 出现在 NPCs 页面。

### 权限规则

- 只有 GM 可以生成和保存 NPC；
- Player 是否能查看 NPC 由后续“公开 / 私密”字段决定；
- MVP 阶段 NPC 默认仅 GM 可见。

### 验收标准

- GM 可以输入设定并生成 NPC；
- 输出结构稳定；
- 生成结果可以编辑；
- 保存后写入 NPC 表；
- NPC 与 Campaign 正确关联。

---

## 11. 数据结构草案

### 11.1 users

```text
users
- id
- email
- display_name
- avatar_url
- created_at
```

### 11.2 campaigns

```text
campaigns
- id
- title
- description
- system_type
- world_setting
- visibility
- owner_id
- created_at
- updated_at
```

### 11.3 campaign_members

```text
campaign_members
- id
- campaign_id
- user_id
- role
- joined_at
```

### 11.4 characters

```text
characters
- id
- campaign_id
- user_id
- name
- occupation
- background
- personality
- stats
- inventory
- notes
- created_at
- updated_at
```

### 11.5 sessions

```text
sessions
- id
- campaign_id
- title
- session_date
- raw_log
- summary
- created_by
- created_at
- updated_at
```

### 11.6 npcs

```text
npcs
- id
- campaign_id
- name
- role
- description
- secrets
- generated_by_ai
- visibility
- created_at
- updated_at
```

### 11.7 ai_outputs

```text
ai_outputs
- id
- campaign_id
- session_id
- type
- prompt
- output
- created_by
- created_at
```

---

## 12. 非功能需求

### 12.1 性能

- Dashboard 和 Campaign 列表页面首屏加载时间控制在 3 秒以内；
- AI 摘要生成允许较长等待，但需要显示明确 loading 状态；
- Session Log 支持至少 10,000 字文本输入；
- Campaign 详情页在基础数据量下应保持流畅加载。

### 12.2 安全与权限

- 非登录用户不可访问私有页面；
- 非 Campaign 成员不可访问 Campaign 数据；
- Player 不可编辑他人角色卡；
- Player 不可调用 GM 专属 AI 功能；
- AI API Key 不暴露在前端；
- 数据库访问需要进行行级权限或服务端鉴权控制。

### 12.3 可用性

- 表单提交失败后保留用户已输入内容；
- 所有删除操作需要二次确认；
- AI 生成失败时提供重试入口；
- 空状态页面需要引导用户创建 Campaign、角色卡或 Session；
- loading、success、error 状态需要清晰展示。

### 12.4 可维护性

- AI Prompt 使用模板管理；
- 核心业务对象统一围绕 Campaign ID 关联；
- 数据库表命名保持一致；
- 前后端字段命名保持一致；
- 组件按业务模块拆分；
- AI 输出保存到 ai_outputs 表，方便后续调试和评估。

---

## 13. 效果指标

### 13.1 使用指标

- 创建 Campaign 数量；
- 每个 Campaign 的角色卡数量；
- 每个 Campaign 的 Session 数量；
- AI 摘要生成次数；
- AI 摘要保存率；
- NPC 生成次数；
- 用户回访次数。

### 13.2 体验指标

- 主持人完成一次 Session 复盘所需时间；
- AI 摘要结果可用性评分；
- 用户是否愿意在下一次跑团继续使用；
- 玩家是否通过平台查看历史剧情摘要；
- 主持人对角色卡总览的满意度。

### 13.3 MVP 验证标准

第一阶段用户测试中，如果满足以下条件，则认为 MVP 方向成立：

- 至少 5 名用户完成核心流程测试；
- 至少 2 名主持人认为 AI 摘要能减少复盘时间；
- AI 摘要保存率达到 50% 以上；
- 用户能在无指导情况下完成 Campaign 创建、角色卡创建和 Session 摘要生成；
- 至少 1 个 Campaign 完成从创建到 Session 摘要保存的完整闭环。

---

## 14. 后续迭代计划

### 14.1 V1.1：AI 能力增强

- AI 剧情钩子生成；
- AI 线索整理；
- AI 下次开团准备清单；
- 支持不同风格 Prompt，如克苏鲁、奇幻、赛博朋克、轻喜剧。

### 14.2 V1.2：协作能力增强

- 玩家可提交个人视角记录；
- 主持人可合并多名玩家记录；
- Session 摘要支持评论和修订；
- 玩家可标记自己关注的线索和任务。

### 14.3 V1.3：规则系统模板

- 通用角色卡模板；
- COC 模板；
- DND 模板；
- 自定义字段配置；
- 角色卡字段锁定和主持人审核。

### 14.4 V1.4：内容沉淀与社区能力

- 公开剧本模板；
- NPC 模板库；
- Campaign 复制功能；
- 优秀摘要案例展示；
- 可分享的公开 Campaign 页面。

---

## 15. 产品决策说明

### 15.1 为什么第一版聚焦主持人

第一版优先服务主持人，因为主持人承担了 Campaign 创建、资料维护、剧情推进和团后复盘的大部分工作，是跑团流程中的核心组织者。只要主持人愿意使用平台，玩家就会自然进入 Campaign 完成角色卡和查看摘要。因此 MVP 优先解决主持人的高频痛点，而不是平均覆盖所有玩家需求。

### 15.2 为什么以 Campaign 为中心

Campaign 是长线跑团的基本组织单位。角色、NPC、Session、AI 摘要和成员权限都天然依附于 Campaign。以 Campaign 为中心建模，可以让产品结构、数据库结构和权限系统保持一致，避免功能分散。

### 15.3 为什么先做 AI 摘要，而不是 AI 写剧本

AI 写剧本属于创作型功能，输出质量受风格、设定和主持人偏好影响较大，评价标准不稳定。AI 摘要基于已发生的 Session Log，输入明确、输出结构清晰，更容易验证是否节省时间。因此第一版优先实现 AI 摘要，后续再扩展 NPC 生成、剧情钩子生成和创作辅助。

### 15.4 为什么角色卡先做通用模板

不同规则系统的角色卡结构差异较大。第一版如果强行适配多种规则，会增加开发复杂度并拖慢 MVP 验证。通用角色卡可以覆盖角色身份、背景、状态、物品和备注等基础需求，后续再通过模板系统支持 COC、DND 等规则。

### 15.5 为什么不做大型社区

社区功能依赖用户规模、内容供给和关系链，冷启动成本高。第一版项目目标是验证单个跑团小组内部的协作价值，因此暂不做社区广场、好友系统和公开推荐。待工具价值被验证后，再考虑通过模板库和公开内容沉淀扩展社区能力。

---

## 16. 面试讲述角度

### 16.1 产品经理角度

该项目可以体现用户场景分析、痛点抽象、MVP 取舍、用户流程设计、指标设计和产品验证意识。重点讲清楚为什么第一版聚焦主持人、为什么不做社区、为什么 AI 摘要优先级最高。

### 16.2 全栈工程师角度

该项目可以体现前后端开发、数据库建模、权限系统、AI API 集成、数据持久化和部署能力。重点讲清楚 Campaign 作为核心业务对象如何影响表结构、路由结构和权限设计。

### 16.3 FDE / 解决方案工程角度

该项目可以包装成一个面向 TRPG 社群的 AI 协作解决方案。客户场景是主持人备团和复盘成本高，交付方案是一个 Web 工作台，核心价值是将分散流程结构化，并引入 AI 生成复盘初稿。重点讲清楚如何从模糊需求拆成可交付系统。

---

## 17. 当前 MVP 开发优先级

### P0：必须完成

- 用户认证；
- Campaign 创建与管理；
- 成员权限；
- 角色卡管理；
- Session 创建与记录；
- AI 剧情摘要；
- 部署上线。

### P1：优先增强

- AI NPC 生成；
- AI 输出历史记录；
- 邀请链接；
- Session 摘要编辑；
- Dashboard 最近访问。

### P2：后续扩展

- 玩家个人视角记录；
- 规则模板；
- 线索管理；
- 剧情钩子生成；
- 公开模板库。

### P3：暂不考虑

- 大型社区；
- 复杂好友系统；
- 地图战棋；
- 语音房；
- 支付；
- 移动端 App。

---

## 18. 结论

本 PRD 的核心不是设计一个“大而全的跑团网站”，而是设计一个围绕主持人工作流的 AI 协作工具。第一版产品应聚焦 Campaign、角色卡、Session 记录和 AI 摘要四个核心对象，形成从创建 Campaign 到生成团后摘要的最小闭环。

项目的求职价值来自三点：

1. 产品上，它展示了从用户痛点到 MVP 取舍的完整思考；
2. 工程上，它展示了全栈开发、权限建模、数据库设计和 AI API 集成能力；
3. FDE 上，它展示了将垂直场景中的模糊问题转化为可交付解决方案的能力。

第一版成功的标准不是功能数量多，而是用户问题清楚、业务流程完整、技术实现真实、AI 价值可验证。

---

## MVP Session Model Correction

Session content is split into three distinct fields:

- `gm_notes`: GM-only Session Prep notes. These are private preparation notes and must not be shown to Players.
- `transcript`: the actual Session play record. In the MVP, the GM manually pastes the transcript. In a future version, it may come from voice transcription, but voice capture and speech-to-text are not part of this task.
- `raw_log`: legacy field retained for existing data. New product flows should not depend on `raw_log` as the primary Session input.

AI Summary generation must use `transcript` as the factual source. GM notes are not a factual source for what happened during play, and the AI must not infer that prepared content happened unless it appears in the transcript.

Players can view saved AI Summary content after the GM generates it, but they cannot view GM notes or Session transcript in the MVP.
