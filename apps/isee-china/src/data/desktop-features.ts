/**
 * 桌面端功能介绍页的数据源。
 *
 * 截图来自真实运行的 iSee 桌面客户端（见 isee 仓 docs/desktop-feature-tour）。
 * 这里只放展示所需字段，实现细节不进官网。
 */

export type DesktopFeatureGroupId =
  | "chat"
  | "collab"
  | "agent"
  | "settings";

export interface DesktopFeatureGroup {
  id: DesktopFeatureGroupId;
  label: string;
  blurb: string;
}

export interface DesktopFeature {
  id: string;
  group: DesktopFeatureGroupId;
  title: string;
  summary: string;
  points: string[];
  image: string;
  imageAlt: string;
}

export const DESKTOP_FEATURE_GROUPS: DesktopFeatureGroup[] = [
  {
    id: "chat",
    label: "对话",
    blurb: "一个窗口管住所有会话，长任务也不会丢上下文。",
  },
  {
    id: "collab",
    label: "群协作",
    blurb: "拉真人和多个 Agent 进同一个群，任务自动分派到各自设备执行。",
  },
  {
    id: "agent",
    label: "Agent",
    blurb: "从市场挑一个装上就能用，也可以自己改人设与技能。",
  },
  {
    id: "settings",
    label: "设置",
    blurb: "主题、快捷键、语音、设备绑定，都在同一个设置窗口里。",
  },
];

export const DESKTOP_FEATURES: DesktopFeature[] = [
  {
    id: "agent-chat",
    group: "chat",
    title: "会话工作台与 Agent 对话",
    summary: "左侧选会话，右侧读回答：表格、代码块、引用回复都能用。",
    points: [
      "仿微信三栏：窄轨切消息与通讯录，会话列按最近活跃排序",
      "回答按 Markdown 全量渲染，表格可复制、下载、全屏查看",
      "消息可引用回复，流式生成中随时停止",
    ],
    image: "/features/02-agent-chat.webp",
    imageAlt: "Agent 对话中的表格与代码块",
  },
  {
    id: "session-search",
    group: "chat",
    title: "会话搜索",
    summary: "会话一多就靠它：输入即过滤，无命中直接给结论。",
    points: [
      "按名称实时过滤，纯本地匹配不发请求",
      "无结果给出「无匹配结果」与一键清除",
      "Esc 第一次清空、第二次收起，键盘可全程操作",
    ],
    image: "/features/05-session-search.webp",
    imageAlt: "会话搜索框与无匹配结果状态",
  },
  {
    id: "chat-context",
    group: "chat",
    title: "聊天信息",
    summary: "免打扰、置顶、查找记录、压缩上下文，都在这一抽屉里。",
    points: [
      "免打扰会话只留红点，不再打扰角标",
      "查找聊天记录在独立窗口打开，可跳回原消息",
      "上下文压缩写在新一轮开始前，不影响正在进行的对话",
    ],
    image: "/features/04-chat-context.webp",
    imageAlt: "聊天信息抽屉与上下文操作",
  },
  {
    id: "group-chat",
    group: "collab",
    title: "群协作",
    summary: "一句话 @ 出多个 Agent，各自领任务、各自交付。",
    points: [
      "输入 @ 弹出群内 Agent 候选，支持 @全体",
      "标题栏实时显示协作状态与每个 Agent 的运行进度",
      "执行中可以终止，暂停后可继续或结束本轮",
    ],
    image: "/features/03-group-chat.webp",
    imageAlt: "多 Agent 群协作会话",
  },
  {
    id: "group-private",
    group: "collab",
    title: "群内 Agent 私信",
    summary: "Agent 之间的交接在私信里进行，默认不上公屏。",
    points: [
      "只读：你只能查看与授权公开，不能代替 Agent 发言",
      "线程按进行中、已完成、异常筛选",
      "公屏上的回执可一键跳到对应线程",
    ],
    image: "/features/11-group-private-dm.webp",
    imageAlt: "群聊私信面板",
  },
  {
    id: "agent-profile",
    group: "agent",
    title: "Agent 资料卡",
    summary: "像看好友资料一样看 Agent：能改什么、能删什么一目了然。",
    points: [
      "名称可加备注，头像与人设可编辑",
      "显示绑定设备，内置 Agent 的删除受保护",
      "发消息直达 1:1 会话",
    ],
    image: "/features/08-agent-profile.webp",
    imageAlt: "Agent 资料卡",
  },
  {
    id: "agent-market",
    group: "agent",
    title: "Agent 市场",
    summary: "云端精选加内置引擎，装上就能干活。",
    points: [
      "卡片网格按分组筛选，详情里能看到人设与技能清单",
      "内置区常驻，离线也能看见已装好的 Agent",
      "安装过程分阶段给进度，失败会说明卡在哪一步",
    ],
    image: "/features/09-agent-market.webp",
    imageAlt: "Agent 市场卡片网格",
  },
  {
    id: "settings-general",
    group: "settings",
    title: "通用设置",
    summary: "外观、主题色、字号、语言、发送策略，一次配好。",
    points: [
      "浅色、深色或跟随系统，切换即时生效",
      "5 套主题色，主按钮与选中态一起换",
      "字号 80–120% 可调，只影响主窗不影响工具窗",
    ],
    image: "/features/12-settings-general.webp",
    imageAlt: "通用设置页",
  },
  {
    id: "settings-devices",
    group: "settings",
    title: "设备管理",
    summary: "这台机器就是 Agent 的手：绑定后能力全部在本地执行。",
    points: [
      "本机一行显示设备名、ID 与在线状态",
      "安装与重连给出分步进度，失败可重试",
      "多设备可分别重命名、解绑或移除",
    ],
    image: "/features/13-settings-devices.webp",
    imageAlt: "设备管理页",
  },
  {
    id: "settings-keyboard",
    group: "settings",
    title: "快捷键",
    summary: "每个动作都能改成自己的手感，冲突当场提示。",
    points: [
      "系统级、全局、应用内、仅输入框四类分开配置",
      "按下即录制，Esc 取消，冲突红字点名占用者",
      "发送键只能在 Enter 与 Shift+Enter 之间选",
    ],
    image: "/features/14-settings-keyboard.webp",
    imageAlt: "快捷键设置页",
  },
  {
    id: "settings-voice",
    group: "settings",
    title: "语音输入",
    summary: "说一段直接进输入框，可选云端或本地识别。",
    points: [
      "支持百炼、火山与完全离线的本地模型",
      "识别结果边流式边写回，不打断已有草稿",
      "可开启润色，把口语整成书面表达",
    ],
    image: "/features/15-settings-voice.webp",
    imageAlt: "语音输入设置页",
  },
  {
    id: "settings-account",
    group: "settings",
    title: "账号与存储",
    summary: "身份、余额与退出登录集中在一页。",
    points: [
      "头像、邮箱、手机与账号标识一目了然",
      "可直接更换头像，上传后立即生效",
      "退出登录带确认，避免误触",
    ],
    image: "/features/16-settings-account.webp",
    imageAlt: "账号与存储设置页",
  },
];
