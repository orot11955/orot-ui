import type { LucideIcon } from 'lucide-react';
import {
  // General UI
  Search, X, XCircle, Check, CheckCircle,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  ChevronsUpDown, ChevronsLeft, ChevronsRight,
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown, ArrowUpRight,
  MoreHorizontal, MoreVertical, Menu as MenuIcon, SlidersHorizontal,
  Settings, Settings2, Maximize2, Minimize2, ExternalLink, Link, Copy,
  Clipboard, ClipboardCheck, Eye, EyeOff, Filter, SortAsc, SortDesc,
  RefreshCw, RotateCcw, Loader, Loader2, CircleDot,
  // Actions
  Plus, PlusCircle, Minus, MinusCircle,
  Edit as EditIcon, Edit2, Edit3, Pencil, Trash, Trash2,
  Save, Download, Upload as UploadIcon,
  Share, Share2, Send, Forward, Reply, Undo, Redo,
  Lock, Unlock, LogIn, LogOut, UserPlus, UserMinus,
  // Status / Feedback
  Info, AlertCircle, AlertTriangle, AlertOctagon,
  Ban, ShieldAlert, ShieldCheck, HelpCircle,
  Bell, BellOff, BellRing, Star, StarHalf,
  Heart, ThumbsUp, ThumbsDown, Bookmark,
  // File & Media
  File, FileText, FileImage, FilePlus, FileMinus, FileCheck, FileX,
  Folder, FolderOpen, FolderPlus,
  Image as ImageIcon, ImageOff, Video, Music, Paperclip, Archive, Package,
  // Communication
  Mail, MailOpen, MailCheck,
  MessageSquare, MessageCircle, MessageSquarePlus, MessagesSquare,
  Phone, PhoneCall, PhoneOff, AtSign, Hash,
  // Navigation
  Home, Map, MapPin, Navigation as NavigationIcon, Navigation2,
  Compass, Globe, Globe2,
  // Data / Analytics
  BarChart, BarChart2, BarChart3, BarChart4,
  LineChart, PieChart, TrendingUp, TrendingDown,
  Activity, Database, Table as TableIcon,
  LayoutGrid, LayoutList, List, Grid as GridIcon, Grid2X2, Grid3X3,
  // User / People
  User, User2, Users, Users2, UserCheck, UserX,
  Contact, Building, Building2,
  // Time
  Clock, Clock1, Calendar, CalendarDays, CalendarCheck, CalendarX,
  Timer, Hourglass,
  // Device / Tech
  Monitor, Laptop, Tablet, Smartphone, Keyboard, Mouse, Printer,
  Server, Cpu, HardDrive, Wifi, WifiOff, Bluetooth,
  Battery, BatteryLow, Power, Plug,
  Code, Code2, Terminal, GitBranch, GitCommit, GitMerge, GitPullRequest,
  // Misc
  Sun, Moon, Cloud, CloudRain, Zap, Flame, Snowflake, Leaf, Flower, TreePine,
  Tag as TagIcon, Tags, Flag, Layers,
  Layout as LayoutIcon, PanelLeft, PanelRight, PanelTop, PanelBottom,
  Sidebar, SidebarOpen, SidebarClose, Columns, Rows,
  ToggleLeft, ToggleRight, Sliders, Palette, Paintbrush, Scissors, Crop,
  ZoomIn, ZoomOut, Move, Grab, GripVertical, GripHorizontal,
} from 'lucide-react';
import { Icon } from 'orot-ui';
import { DocPage } from '../../components/DocPage';
import { Example } from '../../components/Example';
import { PropsTable } from '../../components/PropsTable';
import './IconPage.css';

type IconEntry = { name: string; Icon: LucideIcon };

const ICON_GROUPS: { group: string; icons: IconEntry[] }[] = [
  {
    group: 'General UI',
    icons: [
      { name: 'Search', Icon: Search },
      { name: 'X', Icon: X },
      { name: 'XCircle', Icon: XCircle },
      { name: 'Check', Icon: Check },
      { name: 'CheckCircle', Icon: CheckCircle },
      { name: 'ChevronDown', Icon: ChevronDown },
      { name: 'ChevronUp', Icon: ChevronUp },
      { name: 'ChevronLeft', Icon: ChevronLeft },
      { name: 'ChevronRight', Icon: ChevronRight },
      { name: 'ChevronsUpDown', Icon: ChevronsUpDown },
      { name: 'ChevronsLeft', Icon: ChevronsLeft },
      { name: 'ChevronsRight', Icon: ChevronsRight },
      { name: 'ArrowLeft', Icon: ArrowLeft },
      { name: 'ArrowRight', Icon: ArrowRight },
      { name: 'ArrowUp', Icon: ArrowUp },
      { name: 'ArrowDown', Icon: ArrowDown },
      { name: 'ArrowUpRight', Icon: ArrowUpRight },
      { name: 'MoreHorizontal', Icon: MoreHorizontal },
      { name: 'MoreVertical', Icon: MoreVertical },
      { name: 'Menu', Icon: MenuIcon },
      { name: 'SlidersHorizontal', Icon: SlidersHorizontal },
      { name: 'Settings', Icon: Settings },
      { name: 'Settings2', Icon: Settings2 },
      { name: 'Maximize2', Icon: Maximize2 },
      { name: 'Minimize2', Icon: Minimize2 },
      { name: 'ExternalLink', Icon: ExternalLink },
      { name: 'Link', Icon: Link },
      { name: 'Copy', Icon: Copy },
      { name: 'Clipboard', Icon: Clipboard },
      { name: 'ClipboardCheck', Icon: ClipboardCheck },
      { name: 'Eye', Icon: Eye },
      { name: 'EyeOff', Icon: EyeOff },
      { name: 'Filter', Icon: Filter },
      { name: 'SortAsc', Icon: SortAsc },
      { name: 'SortDesc', Icon: SortDesc },
      { name: 'RefreshCw', Icon: RefreshCw },
      { name: 'RotateCcw', Icon: RotateCcw },
      { name: 'Loader', Icon: Loader },
      { name: 'Loader2', Icon: Loader2 },
      { name: 'CircleDot', Icon: CircleDot },
    ],
  },
  {
    group: 'Actions',
    icons: [
      { name: 'Plus', Icon: Plus },
      { name: 'PlusCircle', Icon: PlusCircle },
      { name: 'Minus', Icon: Minus },
      { name: 'MinusCircle', Icon: MinusCircle },
      { name: 'Edit', Icon: EditIcon },
      { name: 'Edit2', Icon: Edit2 },
      { name: 'Edit3', Icon: Edit3 },
      { name: 'Pencil', Icon: Pencil },
      { name: 'Trash', Icon: Trash },
      { name: 'Trash2', Icon: Trash2 },
      { name: 'Save', Icon: Save },
      { name: 'Download', Icon: Download },
      { name: 'Upload', Icon: UploadIcon },
      { name: 'Share', Icon: Share },
      { name: 'Share2', Icon: Share2 },
      { name: 'Send', Icon: Send },
      { name: 'Forward', Icon: Forward },
      { name: 'Reply', Icon: Reply },
      { name: 'Undo', Icon: Undo },
      { name: 'Redo', Icon: Redo },
      { name: 'Lock', Icon: Lock },
      { name: 'Unlock', Icon: Unlock },
      { name: 'LogIn', Icon: LogIn },
      { name: 'LogOut', Icon: LogOut },
      { name: 'UserPlus', Icon: UserPlus },
      { name: 'UserMinus', Icon: UserMinus },
    ],
  },
  {
    group: 'Status / Feedback',
    icons: [
      { name: 'Info', Icon: Info },
      { name: 'AlertCircle', Icon: AlertCircle },
      { name: 'AlertTriangle', Icon: AlertTriangle },
      { name: 'AlertOctagon', Icon: AlertOctagon },
      { name: 'Ban', Icon: Ban },
      { name: 'ShieldAlert', Icon: ShieldAlert },
      { name: 'ShieldCheck', Icon: ShieldCheck },
      { name: 'HelpCircle', Icon: HelpCircle },
      { name: 'Bell', Icon: Bell },
      { name: 'BellOff', Icon: BellOff },
      { name: 'BellRing', Icon: BellRing },
      { name: 'Star', Icon: Star },
      { name: 'StarHalf', Icon: StarHalf },
      { name: 'Heart', Icon: Heart },
      { name: 'ThumbsUp', Icon: ThumbsUp },
      { name: 'ThumbsDown', Icon: ThumbsDown },
      { name: 'Bookmark', Icon: Bookmark },
    ],
  },
  {
    group: 'File & Media',
    icons: [
      { name: 'File', Icon: File },
      { name: 'FileText', Icon: FileText },
      { name: 'FileImage', Icon: FileImage },
      { name: 'FilePlus', Icon: FilePlus },
      { name: 'FileMinus', Icon: FileMinus },
      { name: 'FileCheck', Icon: FileCheck },
      { name: 'FileX', Icon: FileX },
      { name: 'Folder', Icon: Folder },
      { name: 'FolderOpen', Icon: FolderOpen },
      { name: 'FolderPlus', Icon: FolderPlus },
      { name: 'Image', Icon: ImageIcon },
      { name: 'ImageOff', Icon: ImageOff },
      { name: 'Video', Icon: Video },
      { name: 'Music', Icon: Music },
      { name: 'Paperclip', Icon: Paperclip },
      { name: 'Archive', Icon: Archive },
      { name: 'Package', Icon: Package },
    ],
  },
  {
    group: 'Communication',
    icons: [
      { name: 'Mail', Icon: Mail },
      { name: 'MailOpen', Icon: MailOpen },
      { name: 'MailCheck', Icon: MailCheck },
      { name: 'MessageSquare', Icon: MessageSquare },
      { name: 'MessageCircle', Icon: MessageCircle },
      { name: 'MessageSquarePlus', Icon: MessageSquarePlus },
      { name: 'MessagesSquare', Icon: MessagesSquare },
      { name: 'Phone', Icon: Phone },
      { name: 'PhoneCall', Icon: PhoneCall },
      { name: 'PhoneOff', Icon: PhoneOff },
      { name: 'AtSign', Icon: AtSign },
      { name: 'Hash', Icon: Hash },
    ],
  },
  {
    group: 'Navigation',
    icons: [
      { name: 'Home', Icon: Home },
      { name: 'Map', Icon: Map },
      { name: 'MapPin', Icon: MapPin },
      { name: 'Navigation', Icon: NavigationIcon },
      { name: 'Navigation2', Icon: Navigation2 },
      { name: 'Compass', Icon: Compass },
      { name: 'Globe', Icon: Globe },
      { name: 'Globe2', Icon: Globe2 },
    ],
  },
  {
    group: 'Data / Analytics',
    icons: [
      { name: 'BarChart', Icon: BarChart },
      { name: 'BarChart2', Icon: BarChart2 },
      { name: 'BarChart3', Icon: BarChart3 },
      { name: 'BarChart4', Icon: BarChart4 },
      { name: 'LineChart', Icon: LineChart },
      { name: 'PieChart', Icon: PieChart },
      { name: 'TrendingUp', Icon: TrendingUp },
      { name: 'TrendingDown', Icon: TrendingDown },
      { name: 'Activity', Icon: Activity },
      { name: 'Database', Icon: Database },
      { name: 'Table', Icon: TableIcon },
      { name: 'LayoutGrid', Icon: LayoutGrid },
      { name: 'LayoutList', Icon: LayoutList },
      { name: 'List', Icon: List },
      { name: 'Grid', Icon: GridIcon },
      { name: 'Grid2X2', Icon: Grid2X2 },
      { name: 'Grid3X3', Icon: Grid3X3 },
    ],
  },
  {
    group: 'User / People',
    icons: [
      { name: 'User', Icon: User },
      { name: 'User2', Icon: User2 },
      { name: 'Users', Icon: Users },
      { name: 'Users2', Icon: Users2 },
      { name: 'UserCheck', Icon: UserCheck },
      { name: 'UserX', Icon: UserX },
      { name: 'Contact', Icon: Contact },
      { name: 'Building', Icon: Building },
      { name: 'Building2', Icon: Building2 },
    ],
  },
  {
    group: 'Time',
    icons: [
      { name: 'Clock', Icon: Clock },
      { name: 'Clock1', Icon: Clock1 },
      { name: 'Calendar', Icon: Calendar },
      { name: 'CalendarDays', Icon: CalendarDays },
      { name: 'CalendarCheck', Icon: CalendarCheck },
      { name: 'CalendarX', Icon: CalendarX },
      { name: 'Timer', Icon: Timer },
      { name: 'Hourglass', Icon: Hourglass },
    ],
  },
  {
    group: 'Device / Tech',
    icons: [
      { name: 'Monitor', Icon: Monitor },
      { name: 'Laptop', Icon: Laptop },
      { name: 'Tablet', Icon: Tablet },
      { name: 'Smartphone', Icon: Smartphone },
      { name: 'Keyboard', Icon: Keyboard },
      { name: 'Mouse', Icon: Mouse },
      { name: 'Printer', Icon: Printer },
      { name: 'Server', Icon: Server },
      { name: 'Cpu', Icon: Cpu },
      { name: 'HardDrive', Icon: HardDrive },
      { name: 'Wifi', Icon: Wifi },
      { name: 'WifiOff', Icon: WifiOff },
      { name: 'Bluetooth', Icon: Bluetooth },
      { name: 'Battery', Icon: Battery },
      { name: 'BatteryLow', Icon: BatteryLow },
      { name: 'Power', Icon: Power },
      { name: 'Plug', Icon: Plug },
      { name: 'Code', Icon: Code },
      { name: 'Code2', Icon: Code2 },
      { name: 'Terminal', Icon: Terminal },
      { name: 'GitBranch', Icon: GitBranch },
      { name: 'GitCommit', Icon: GitCommit },
      { name: 'GitMerge', Icon: GitMerge },
      { name: 'GitPullRequest', Icon: GitPullRequest },
    ],
  },
  {
    group: 'Misc',
    icons: [
      { name: 'Sun', Icon: Sun },
      { name: 'Moon', Icon: Moon },
      { name: 'Cloud', Icon: Cloud },
      { name: 'CloudRain', Icon: CloudRain },
      { name: 'Zap', Icon: Zap },
      { name: 'Flame', Icon: Flame },
      { name: 'Snowflake', Icon: Snowflake },
      { name: 'Leaf', Icon: Leaf },
      { name: 'Flower', Icon: Flower },
      { name: 'TreePine', Icon: TreePine },
      { name: 'Tag', Icon: TagIcon },
      { name: 'Tags', Icon: Tags },
      { name: 'Flag', Icon: Flag },
      { name: 'Layers', Icon: Layers },
      { name: 'Layout', Icon: LayoutIcon },
      { name: 'PanelLeft', Icon: PanelLeft },
      { name: 'PanelRight', Icon: PanelRight },
      { name: 'PanelTop', Icon: PanelTop },
      { name: 'PanelBottom', Icon: PanelBottom },
      { name: 'Sidebar', Icon: Sidebar },
      { name: 'SidebarOpen', Icon: SidebarOpen },
      { name: 'SidebarClose', Icon: SidebarClose },
      { name: 'Columns', Icon: Columns },
      { name: 'Rows', Icon: Rows },
      { name: 'ToggleLeft', Icon: ToggleLeft },
      { name: 'ToggleRight', Icon: ToggleRight },
      { name: 'Sliders', Icon: Sliders },
      { name: 'Palette', Icon: Palette },
      { name: 'Paintbrush', Icon: Paintbrush },
      { name: 'Scissors', Icon: Scissors },
      { name: 'Crop', Icon: Crop },
      { name: 'ZoomIn', Icon: ZoomIn },
      { name: 'ZoomOut', Icon: ZoomOut },
      { name: 'Move', Icon: Move },
      { name: 'Grab', Icon: Grab },
      { name: 'GripVertical', Icon: GripVertical },
      { name: 'GripHorizontal', Icon: GripHorizontal },
    ],
  },
];

const TOTAL = ICON_GROUPS.reduce((s, g) => s + g.icons.length, 0);

export default function IconPage() {
  return (
    <DocPage
      title="Icon"
      description="lucide-react 아이콘 세트를 기반으로 합니다. 아이콘은 개별 import하거나 <Icon as={...}> 래퍼를 통해 사용합니다."
    >
      <Example
        title="직접 사용 (권장)"
        description="lucide-react 아이콘을 직접 import해서 사용하는 방식입니다. tree-shaking에 유리합니다."
        code={`
import { Search, Plus, Settings } from 'lucide-react';

<Search size={16} />
<Plus size={20} />
<Settings size={24} />
        `}
      >
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Search size={16} />
          <Plus size={20} />
          <Settings size={24} />
        </div>
      </Example>

      <Example
        title="Icon 래퍼 사용"
        description="<Icon as={...}> 래퍼로 orot-ui API와 통일된 방식으로 사용할 수 있습니다."
        code={`
import { Search } from 'lucide-react';
import { Icon } from 'orot-ui';

<Icon as={Search} size={16} />
<Icon as={Search} size={20} color="var(--orot-color-danger)" />
<Icon as={Search} size={24} strokeWidth={1} />
        `}
      >
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Icon as={Search} size={16} />
          <Icon as={Search} size={20} color="var(--orot-color-danger)" />
          <Icon as={Search} size={24} strokeWidth={1} />
        </div>
      </Example>

      <Example
        title={`아이콘 카탈로그 (${TOTAL}개)`}
        description="icons.ts에서 카테고리별로 re-export되는 전체 아이콘 목록입니다."
        code={`import { Search, Plus, ... } from 'lucide-react';
// 또는
import { Search, Plus, ... } from 'orot-ui';`}
      >
        <div className="icon-page__catalog">
          {ICON_GROUPS.map(({ group, icons }) => (
            <div key={group} className="icon-page__section">
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--orot-color-text-muted)',
                marginBottom: 12,
              }}>
                {group}
              </div>
              <div className="icon-page__grid">
                {icons.map(({ name, Icon: I }) => (
                  <div key={name} className="icon-page__item">
                    <I size={20} />
                    <span className="icon-page__name">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Example>

      <PropsTable
        title="Icon"
        rows={[
          { name: 'as', type: 'ComponentType<LucideProps>', required: true, description: 'lucide-react 아이콘 컴포넌트' },
          { name: 'size', type: 'number', default: '16', description: '아이콘 크기 (width / height)' },
          { name: 'color', type: 'string', description: '아이콘 색상. CSS color 값 또는 CSS 변수' },
          { name: 'strokeWidth', type: 'number', default: '2', description: '선 굵기' },
          { name: 'className', type: 'string', description: '추가 CSS 클래스' },
        ]}
      />
    </DocPage>
  );
}
