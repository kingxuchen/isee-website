/**
 * 首页功能区块（components/Capabilities.tsx）的数据源。
 *
 * 截图来自真实运行的 iSee 桌面客户端（见 docs/desktop-feature-tour）。
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
    label: "Chat",
    blurb:
      "One window for every conversation—long-running tasks never lose their context.",
  },
  {
    id: "collab",
    label: "Group Collaboration",
    blurb:
      "Bring people and multiple Agents into one group, and tasks are dispatched automatically to each device.",
  },
  {
    id: "agent",
    label: "Agents",
    blurb:
      "Pick one from the market and install it, or customize its persona and skills yourself.",
  },
  {
    id: "settings",
    label: "Settings",
    blurb:
      "Theme, shortcuts, voice, and device binding—all in a single settings window.",
  },
];

export const DESKTOP_FEATURES: DesktopFeature[] = [
  {
    id: "agent-chat",
    group: "chat",
    title: "Agent Chat Workspace",
    summary:
      "Pick a session on the left, read the answer on the right—tables, code blocks, and quoted replies all work.",
    points: [
      "WeChat-style three columns: a narrow rail switches between messages and contacts, and sessions sort by recent activity",
      "Answers render full Markdown, and tables can be copied, downloaded, or viewed full screen",
      "Quote a message to reply, and stop generation at any point while streaming",
    ],
    image: "/features/02-agent-chat.webp",
    imageAlt: "A table and code block inside an Agent conversation",
  },
  {
    id: "session-search",
    group: "chat",
    title: "Session Search",
    summary:
      "Built for when the list gets long: type to filter, and get a straight answer when nothing matches.",
    points: [
      "Filters by name as you type, entirely local with no request sent",
      "Shows \u201CNo matching results\u201D with one-click clear when nothing matches",
      "Esc clears on the first press and collapses on the second—fully keyboard-driven",
    ],
    image: "/features/05-session-search.webp",
    imageAlt: "Session search box with the no-results state",
  },
  {
    id: "chat-context",
    group: "chat",
    title: "Chat Info",
    summary:
      "Do not disturb, pin, search history, and compact context—all in one drawer.",
    points: [
      "Muted sessions show only a dot instead of interruptive badges",
      "Chat history search opens in its own window and jumps back to the original message",
      "Context compaction runs before a new turn, so the current conversation is untouched",
    ],
    image: "/features/04-chat-context.webp",
    imageAlt: "Chat info drawer with context actions",
  },
  {
    id: "group-chat",
    group: "collab",
    title: "Group Collaboration",
    summary:
      "Address multiple Agents in a single message—each claims its own task and delivers on its own.",
    points: [
      "Type @ to see in-group Agent candidates, including @all",
      "The title bar shows live collaboration status and each Agent's progress",
      "Terminate mid-run, or continue or end the round after a pause",
    ],
    image: "/features/03-group-chat.webp",
    imageAlt: "A multi-Agent group collaboration session",
  },
  {
    id: "group-private",
    group: "collab",
    title: "In-Group Agent Direct Messages",
    summary:
      "Agent handoffs happen in direct messages, and stay off the public thread by default.",
    points: [
      "Read-only: you can view threads and authorize disclosure, but never speak on an Agent's behalf",
      "Filter threads by in progress, completed, or failed",
      "Receipts on the public thread jump straight to the matching thread",
    ],
    image: "/features/11-group-private-dm.webp",
    imageAlt: "Group chat direct message panel",
  },
  {
    id: "agent-profile",
    group: "agent",
    title: "Agent Profile",
    summary:
      "Review an Agent the way you review a friend's profile: what you can edit and what is protected is obvious at a glance.",
    points: [
      "Add a note to the name, and edit the avatar and persona",
      "Shows the bound device, and built-in Agents are protected from deletion",
      "Send message jumps straight into a 1:1 session",
    ],
    image: "/features/08-agent-profile.webp",
    imageAlt: "Agent profile card",
  },
  {
    id: "agent-market",
    group: "agent",
    title: "Agent Market",
    summary:
      "Curated cloud Agents plus built-in engines, ready to work the moment they are installed.",
    points: [
      "A card grid filtered by group, with persona and skill lists on the detail page",
      "The built-in section is always there, so installed Agents stay visible offline",
      "Installation reports progress stage by stage and names the step that failed",
    ],
    image: "/features/09-agent-market.webp",
    imageAlt: "Agent market card grid",
  },
  {
    id: "settings-general",
    group: "settings",
    title: "General Settings",
    summary:
      "Appearance, theme color, font size, language, and send behavior—configured once and done.",
    points: [
      "Light, dark, or follow system, with changes applied instantly",
      "5 theme colors that recolor the primary button and selected states together",
      "Font size from 80 to 120%, affecting only the main window and not tool windows",
    ],
    image: "/features/12-settings-general.webp",
    imageAlt: "General settings page",
  },
  {
    id: "settings-devices",
    group: "settings",
    title: "Device Management",
    summary:
      "This machine is the Agent's hands: once bound, every capability runs locally.",
    points: [
      "One row for this machine showing device name, ID, and online status",
      "Install and reconnect report step-by-step progress, with retry on failure",
      "Multiple devices can be renamed, unbound, or removed individually",
    ],
    image: "/features/13-settings-devices.webp",
    imageAlt: "Device management page",
  },
  {
    id: "settings-keyboard",
    group: "settings",
    title: "Keyboard Shortcuts",
    summary:
      "Rebind every action to your own feel, with conflicts flagged on the spot.",
    points: [
      "Four scopes configured separately: system-level, global, in-app, and input-only",
      "Press to record, Esc to cancel, and conflicts name the occupying shortcut in red",
      "The send key can only be Enter or Shift+Enter",
    ],
    image: "/features/14-settings-keyboard.webp",
    imageAlt: "Keyboard shortcuts settings page",
  },
  {
    id: "settings-voice",
    group: "settings",
    title: "Voice Input",
    summary:
      "Speak a thought straight into the composer, with cloud or on-device recognition.",
    points: [
      "Supports BaiLian, Volcano, and fully offline local models",
      "Results stream into the draft without overwriting what you already wrote",
      "Optional polish turns spoken phrasing into written prose",
    ],
    image: "/features/15-settings-voice.webp",
    imageAlt: "Voice input settings page",
  },
  {
    id: "settings-account",
    group: "settings",
    title: "Account and Storage",
    summary: "Identity, balance, and sign-out collected on a single page.",
    points: [
      "Avatar, email, phone, and account ID at a glance",
      "Change your avatar directly, and updates take effect as soon as the upload finishes",
      "Sign-out asks for confirmation to prevent accidental taps",
    ],
    image: "/features/16-settings-account.webp",
    imageAlt: "Account and storage settings page",
  },
];
