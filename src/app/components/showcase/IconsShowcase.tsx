import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { TokenTable, type TokenGroup } from "./shared/TokenTable";

const {
  Zap, Bell, Settings, Search, Check, Plus, Download, Filter,
  MoreHorizontal, AlertCircle, CheckCircle, Clock,
} = LucideIcons;

/* ─────────────────────────────────────────────
   All icon categories
───────────────────────────────────────────── */
type IconEntry = { icon: React.ElementType; label: string };

const iconCategories: { name: string; icons: IconEntry[] }[] = [
  {
    name: "Navigation",
    icons: [
      { icon: LucideIcons.Home,               label: "Home" },
      { icon: LucideIcons.LayoutDashboard,    label: "LayoutDashboard" },
      { icon: LucideIcons.LayoutGrid,         label: "LayoutGrid" },
      { icon: LucideIcons.LayoutList,         label: "LayoutList" },
      { icon: LucideIcons.Menu,               label: "Menu" },
      { icon: LucideIcons.AlignLeft,          label: "AlignLeft" },
      { icon: LucideIcons.AlignCenter,        label: "AlignCenter" },
      { icon: LucideIcons.AlignRight,         label: "AlignRight" },
      { icon: LucideIcons.ChevronRight,       label: "ChevronRight" },
      { icon: LucideIcons.ChevronLeft,        label: "ChevronLeft" },
      { icon: LucideIcons.ChevronDown,        label: "ChevronDown" },
      { icon: LucideIcons.ChevronUp,          label: "ChevronUp" },
      { icon: LucideIcons.ChevronsRight,      label: "ChevronsRight" },
      { icon: LucideIcons.ChevronsLeft,       label: "ChevronsLeft" },
      { icon: LucideIcons.ChevronsUpDown,     label: "ChevronsUpDown" },
      { icon: LucideIcons.ArrowLeft,          label: "ArrowLeft" },
      { icon: LucideIcons.ArrowRight,         label: "ArrowRight" },
      { icon: LucideIcons.ArrowUp,            label: "ArrowUp" },
      { icon: LucideIcons.ArrowDown,          label: "ArrowDown" },
      { icon: LucideIcons.ArrowUpRight,       label: "ArrowUpRight" },
      { icon: LucideIcons.ArrowDownLeft,      label: "ArrowDownLeft" },
      { icon: LucideIcons.ArrowLeftRight,     label: "ArrowLeftRight" },
      { icon: LucideIcons.ArrowUpDown,        label: "ArrowUpDown" },
      { icon: LucideIcons.MoveRight,          label: "MoveRight" },
      { icon: LucideIcons.CornerDownRight,    label: "CornerDownRight" },
      { icon: LucideIcons.ExternalLink,       label: "ExternalLink" },
      { icon: LucideIcons.Link,               label: "Link" },
      { icon: LucideIcons.Link2,              label: "Link2" },
      { icon: LucideIcons.Unlink,             label: "Unlink" },
      { icon: LucideIcons.Compass,            label: "Compass" },
      { icon: LucideIcons.Map,                label: "Map" },
      { icon: LucideIcons.Navigation,         label: "Navigation" },
      { icon: LucideIcons.Navigation2,        label: "Navigation2" },
    ],
  },
  {
    name: "Actions",
    icons: [
      { icon: LucideIcons.Plus,               label: "Plus" },
      { icon: LucideIcons.PlusCircle,         label: "PlusCircle" },
      { icon: LucideIcons.PlusSquare,         label: "PlusSquare" },
      { icon: LucideIcons.Minus,              label: "Minus" },
      { icon: LucideIcons.MinusCircle,        label: "MinusCircle" },
      { icon: LucideIcons.X,                  label: "X" },
      { icon: LucideIcons.XCircle,            label: "XCircle" },
      { icon: LucideIcons.XSquare,            label: "XSquare" },
      { icon: LucideIcons.Check,              label: "Check" },
      { icon: LucideIcons.CheckSquare,        label: "CheckSquare" },
      { icon: LucideIcons.Search,             label: "Search" },
      { icon: LucideIcons.SearchX,            label: "SearchX" },
      { icon: LucideIcons.Filter,             label: "Filter" },
      { icon: LucideIcons.FilterX,            label: "FilterX" },
      { icon: LucideIcons.SortAsc,            label: "SortAsc" },
      { icon: LucideIcons.SortDesc,           label: "SortDesc" },
      { icon: LucideIcons.Edit,               label: "Edit" },
      { icon: LucideIcons.Edit2,              label: "Edit2" },
      { icon: LucideIcons.Edit3,              label: "Edit3" },
      { icon: LucideIcons.Pencil,             label: "Pencil" },
      { icon: LucideIcons.PenLine,            label: "PenLine" },
      { icon: LucideIcons.Trash,              label: "Trash" },
      { icon: LucideIcons.Trash2,             label: "Trash2" },
      { icon: LucideIcons.Copy,               label: "Copy" },
      { icon: LucideIcons.Clipboard,          label: "Clipboard" },
      { icon: LucideIcons.ClipboardCheck,     label: "ClipboardCheck" },
      { icon: LucideIcons.ClipboardList,      label: "ClipboardList" },
      { icon: LucideIcons.ClipboardCopy,      label: "ClipboardCopy" },
      { icon: LucideIcons.Download,           label: "Download" },
      { icon: LucideIcons.Upload,             label: "Upload" },
      { icon: LucideIcons.DownloadCloud,      label: "DownloadCloud" },
      { icon: LucideIcons.UploadCloud,        label: "UploadCloud" },
      { icon: LucideIcons.Share,              label: "Share" },
      { icon: LucideIcons.Share2,             label: "Share2" },
      { icon: LucideIcons.Send,               label: "Send" },
      { icon: LucideIcons.RefreshCw,          label: "RefreshCw" },
      { icon: LucideIcons.RefreshCcw,         label: "RefreshCcw" },
      { icon: LucideIcons.RotateCcw,          label: "RotateCcw" },
      { icon: LucideIcons.RotateCw,           label: "RotateCw" },
      { icon: LucideIcons.Undo,               label: "Undo" },
      { icon: LucideIcons.Undo2,              label: "Undo2" },
      { icon: LucideIcons.Redo,               label: "Redo" },
      { icon: LucideIcons.Redo2,              label: "Redo2" },
      { icon: LucideIcons.Save,               label: "Save" },
      { icon: LucideIcons.Bookmark,           label: "Bookmark" },
      { icon: LucideIcons.BookmarkPlus,       label: "BookmarkPlus" },
      { icon: LucideIcons.Star,               label: "Star" },
      { icon: LucideIcons.Heart,              label: "Heart" },
      { icon: LucideIcons.ThumbsUp,           label: "ThumbsUp" },
      { icon: LucideIcons.ThumbsDown,         label: "ThumbsDown" },
      { icon: LucideIcons.Flag,               label: "Flag" },
      { icon: LucideIcons.Pin,                label: "Pin" },
      { icon: LucideIcons.Scissors,           label: "Scissors" },
      { icon: LucideIcons.Crop,               label: "Crop" },
      { icon: LucideIcons.Maximize,           label: "Maximize" },
      { icon: LucideIcons.Minimize,           label: "Minimize" },
      { icon: LucideIcons.Maximize2,          label: "Maximize2" },
      { icon: LucideIcons.Minimize2,          label: "Minimize2" },
      { icon: LucideIcons.ZoomIn,             label: "ZoomIn" },
      { icon: LucideIcons.ZoomOut,            label: "ZoomOut" },
    ],
  },
  {
    name: "Status & Feedback",
    icons: [
      { icon: LucideIcons.AlertCircle,        label: "AlertCircle" },
      { icon: LucideIcons.AlertTriangle,      label: "AlertTriangle" },
      { icon: LucideIcons.AlertOctagon,       label: "AlertOctagon" },
      { icon: LucideIcons.Info,               label: "Info" },
      { icon: LucideIcons.CheckCircle,        label: "CheckCircle" },
      { icon: LucideIcons.CheckCircle2,       label: "CheckCircle2" },
      { icon: LucideIcons.XCircle,            label: "XCircle" },
      { icon: LucideIcons.HelpCircle,         label: "HelpCircle" },
      { icon: LucideIcons.Loader,             label: "Loader" },
      { icon: LucideIcons.Loader2,            label: "Loader2" },
      { icon: LucideIcons.Clock,              label: "Clock" },
      { icon: LucideIcons.Clock1,             label: "Clock1" },
      { icon: LucideIcons.Timer,              label: "Timer" },
      { icon: LucideIcons.TimerOff,           label: "TimerOff" },
      { icon: LucideIcons.Hourglass,          label: "Hourglass" },
      { icon: LucideIcons.Zap,                label: "Zap" },
      { icon: LucideIcons.ZapOff,             label: "ZapOff" },
      { icon: LucideIcons.Shield,             label: "Shield" },
      { icon: LucideIcons.ShieldCheck,        label: "ShieldCheck" },
      { icon: LucideIcons.ShieldAlert,        label: "ShieldAlert" },
      { icon: LucideIcons.ShieldOff,          label: "ShieldOff" },
      { icon: LucideIcons.Lock,               label: "Lock" },
      { icon: LucideIcons.Unlock,             label: "Unlock" },
      { icon: LucideIcons.KeyRound,           label: "KeyRound" },
      { icon: LucideIcons.Key,                label: "Key" },
      { icon: LucideIcons.Fingerprint,        label: "Fingerprint" },
      { icon: LucideIcons.BadgeCheck,         label: "BadgeCheck" },
      { icon: LucideIcons.BadgeAlert,         label: "BadgeAlert" },
      { icon: LucideIcons.BadgeX,             label: "BadgeX" },
      { icon: LucideIcons.BadgePlus,          label: "BadgePlus" },
      { icon: LucideIcons.CircleDot,          label: "CircleDot" },
      { icon: LucideIcons.Dot,                label: "Dot" },
    ],
  },
  {
    name: "Data & Analytics",
    icons: [
      { icon: LucideIcons.BarChart,           label: "BarChart" },
      { icon: LucideIcons.BarChart2,          label: "BarChart2" },
      { icon: LucideIcons.BarChart3,          label: "BarChart3" },
      { icon: LucideIcons.BarChart4,          label: "BarChart4" },
      { icon: LucideIcons.LineChart,          label: "LineChart" },
      { icon: LucideIcons.AreaChart,          label: "AreaChart" },
      { icon: LucideIcons.PieChart,           label: "PieChart" },
      { icon: LucideIcons.ScatterChart,       label: "ScatterChart" },
      { icon: LucideIcons.TrendingUp,         label: "TrendingUp" },
      { icon: LucideIcons.TrendingDown,       label: "TrendingDown" },
      { icon: LucideIcons.Activity,           label: "Activity" },
      { icon: LucideIcons.Gauge,              label: "Gauge" },
      { icon: LucideIcons.Database,           label: "Database" },
      { icon: LucideIcons.DatabaseBackup,     label: "DatabaseBackup" },
      { icon: LucideIcons.Table,              label: "Table" },
      { icon: LucideIcons.Table2,             label: "Table2" },
      { icon: LucideIcons.Grid,               label: "Grid" },
      { icon: LucideIcons.Grid2X2,            label: "Grid2X2" },
      { icon: LucideIcons.Grid3X3,            label: "Grid3X3" },
      { icon: LucideIcons.List,               label: "List" },
      { icon: LucideIcons.ListOrdered,        label: "ListOrdered" },
      { icon: LucideIcons.ListTree,           label: "ListTree" },
      { icon: LucideIcons.Layers,             label: "Layers" },
      { icon: LucideIcons.Layers2,            label: "Layers2" },
      { icon: LucideIcons.Hash,               label: "Hash" },
      { icon: LucideIcons.Binary,             label: "Binary" },
      { icon: LucideIcons.Sigma,              label: "Sigma" },
      { icon: LucideIcons.Percent,            label: "Percent" },
      { icon: LucideIcons.Calculator,         label: "Calculator" },
      { icon: LucideIcons.Network,            label: "Network" },
      { icon: LucideIcons.GitGraph,           label: "GitGraph" },
      { icon: LucideIcons.Workflow,           label: "Workflow" },
    ],
  },
  {
    name: "Files & Documents",
    icons: [
      { icon: LucideIcons.File,               label: "File" },
      { icon: LucideIcons.FileText,           label: "FileText" },
      { icon: LucideIcons.FileCode,           label: "FileCode" },
      { icon: LucideIcons.FileCode2,          label: "FileCode2" },
      { icon: LucideIcons.FileJson,           label: "FileJson" },
      { icon: LucideIcons.FileCog,            label: "FileCog" },
      { icon: LucideIcons.FileCheck,          label: "FileCheck" },
      { icon: LucideIcons.FileCheck2,         label: "FileCheck2" },
      { icon: LucideIcons.FileX,              label: "FileX" },
      { icon: LucideIcons.FileX2,             label: "FileX2" },
      { icon: LucideIcons.FilePlus,           label: "FilePlus" },
      { icon: LucideIcons.FilePlus2,          label: "FilePlus2" },
      { icon: LucideIcons.FileMinus,          label: "FileMinus" },
      { icon: LucideIcons.FileSearch,         label: "FileSearch" },
      { icon: LucideIcons.FileSearch2,        label: "FileSearch2" },
      { icon: LucideIcons.FileSpreadsheet,    label: "FileSpreadsheet" },
      { icon: LucideIcons.FileImage,          label: "FileImage" },
      { icon: LucideIcons.FileVideo,          label: "FileVideo" },
      { icon: LucideIcons.FileAudio,          label: "FileAudio" },
      { icon: LucideIcons.FileLock,           label: "FileLock" },
      { icon: LucideIcons.FileOutput,         label: "FileOutput" },
      { icon: LucideIcons.FileInput,          label: "FileInput" },
      { icon: LucideIcons.Folder,             label: "Folder" },
      { icon: LucideIcons.FolderOpen,         label: "FolderOpen" },
      { icon: LucideIcons.FolderPlus,         label: "FolderPlus" },
      { icon: LucideIcons.FolderMinus,        label: "FolderMinus" },
      { icon: LucideIcons.FolderSearch,       label: "FolderSearch" },
      { icon: LucideIcons.FolderCog,          label: "FolderCog" },
      { icon: LucideIcons.FolderLock,         label: "FolderLock" },
      { icon: LucideIcons.FolderGit,          label: "FolderGit" },
      { icon: LucideIcons.FolderGit2,         label: "FolderGit2" },
      { icon: LucideIcons.Archive,            label: "Archive" },
      { icon: LucideIcons.Package,            label: "Package" },
      { icon: LucideIcons.Package2,           label: "Package2" },
      { icon: LucideIcons.PackageOpen,        label: "PackageOpen" },
      { icon: LucideIcons.Paperclip,          label: "Paperclip" },
      { icon: LucideIcons.Printer,            label: "Printer" },
      { icon: LucideIcons.BookOpen,           label: "BookOpen" },
      { icon: LucideIcons.Book,               label: "Book" },
      { icon: LucideIcons.BookMarked,         label: "BookMarked" },
      { icon: LucideIcons.Newspaper,          label: "Newspaper" },
      { icon: LucideIcons.ScrollText,         label: "ScrollText" },
    ],
  },
  {
    name: "Media",
    icons: [
      { icon: LucideIcons.Image,              label: "Image" },
      { icon: LucideIcons.ImagePlus,          label: "ImagePlus" },
      { icon: LucideIcons.Images,             label: "Images" },
      { icon: LucideIcons.GalleryHorizontal,  label: "Gallery" },
      { icon: LucideIcons.Video,              label: "Video" },
      { icon: LucideIcons.VideoOff,           label: "VideoOff" },
      { icon: LucideIcons.Film,               label: "Film" },
      { icon: LucideIcons.Clapperboard,       label: "Clapperboard" },
      { icon: LucideIcons.Music,              label: "Music" },
      { icon: LucideIcons.Music2,             label: "Music2" },
      { icon: LucideIcons.Music4,             label: "Music4" },
      { icon: LucideIcons.Mic,                label: "Mic" },
      { icon: LucideIcons.MicOff,             label: "MicOff" },
      { icon: LucideIcons.Volume,             label: "Volume" },
      { icon: LucideIcons.Volume1,            label: "Volume1" },
      { icon: LucideIcons.Volume2,            label: "Volume2" },
      { icon: LucideIcons.VolumeX,            label: "VolumeX" },
      { icon: LucideIcons.Camera,             label: "Camera" },
      { icon: LucideIcons.CameraOff,          label: "CameraOff" },
      { icon: LucideIcons.Play,               label: "Play" },
      { icon: LucideIcons.Pause,              label: "Pause" },
      { icon: LucideIcons.StopCircle,         label: "StopCircle" },
      { icon: LucideIcons.SkipBack,           label: "SkipBack" },
      { icon: LucideIcons.SkipForward,        label: "SkipForward" },
      { icon: LucideIcons.Rewind,             label: "Rewind" },
      { icon: LucideIcons.FastForward,        label: "FastForward" },
      { icon: LucideIcons.Shuffle,            label: "Shuffle" },
      { icon: LucideIcons.Repeat,             label: "Repeat" },
      { icon: LucideIcons.Repeat1,            label: "Repeat1" },
      { icon: LucideIcons.Radio,              label: "Radio" },
      { icon: LucideIcons.Cast,               label: "Cast" },
      { icon: LucideIcons.Tv,                 label: "Tv" },
      { icon: LucideIcons.Tv2,                label: "Tv2" },
    ],
  },
  {
    name: "Communication",
    icons: [
      { icon: LucideIcons.Mail,               label: "Mail" },
      { icon: LucideIcons.MailOpen,           label: "MailOpen" },
      { icon: LucideIcons.MailCheck,          label: "MailCheck" },
      { icon: LucideIcons.MailPlus,           label: "MailPlus" },
      { icon: LucideIcons.MailX,              label: "MailX" },
      { icon: LucideIcons.MessageSquare,      label: "MessageSquare" },
      { icon: LucideIcons.MessageSquarePlus,  label: "MessageSquarePlus" },
      { icon: LucideIcons.MessageCircle,      label: "MessageCircle" },
      { icon: LucideIcons.MessagesSquare,     label: "MessagesSquare" },
      { icon: LucideIcons.Bell,               label: "Bell" },
      { icon: LucideIcons.BellOff,            label: "BellOff" },
      { icon: LucideIcons.BellPlus,           label: "BellPlus" },
      { icon: LucideIcons.BellRing,           label: "BellRing" },
      { icon: LucideIcons.BellDot,            label: "BellDot" },
      { icon: LucideIcons.Phone,              label: "Phone" },
      { icon: LucideIcons.PhoneOff,           label: "PhoneOff" },
      { icon: LucideIcons.PhoneCall,          label: "PhoneCall" },
      { icon: LucideIcons.PhoneMissed,        label: "PhoneMissed" },
      { icon: LucideIcons.AtSign,             label: "AtSign" },
      { icon: LucideIcons.Inbox,              label: "Inbox" },
      { icon: LucideIcons.Reply,              label: "Reply" },
      { icon: LucideIcons.ReplyAll,           label: "ReplyAll" },
      { icon: LucideIcons.Forward,            label: "Forward" },
      { icon: LucideIcons.Contact,            label: "Contact" },
      { icon: LucideIcons.Contact2,           label: "Contact2" },
    ],
  },
  {
    name: "Users & Identity",
    icons: [
      { icon: LucideIcons.User,               label: "User" },
      { icon: LucideIcons.UserCircle,         label: "UserCircle" },
      { icon: LucideIcons.UserCircle2,        label: "UserCircle2" },
      { icon: LucideIcons.UserSquare,         label: "UserSquare" },
      { icon: LucideIcons.UserSquare2,        label: "UserSquare2" },
      { icon: LucideIcons.Users,              label: "Users" },
      { icon: LucideIcons.Users2,             label: "Users2" },
      { icon: LucideIcons.UserPlus,           label: "UserPlus" },
      { icon: LucideIcons.UserMinus,          label: "UserMinus" },
      { icon: LucideIcons.UserCheck,          label: "UserCheck" },
      { icon: LucideIcons.UserX,              label: "UserX" },
      { icon: LucideIcons.UserCog,            label: "UserCog" },
      { icon: LucideIcons.UserSearch,         label: "UserSearch" },
      { icon: LucideIcons.Bot,                label: "Bot" },
      { icon: LucideIcons.Crown,              label: "Crown" },
      { icon: LucideIcons.Award,              label: "Award" },
      { icon: LucideIcons.Medal,              label: "Medal" },
      { icon: LucideIcons.Trophy,             label: "Trophy" },
      { icon: LucideIcons.Smile,              label: "Smile" },
      { icon: LucideIcons.Meh,                label: "Meh" },
      { icon: LucideIcons.Frown,              label: "Frown" },
    ],
  },
  {
    name: "System & Dev",
    icons: [
      { icon: LucideIcons.Settings,           label: "Settings" },
      { icon: LucideIcons.Settings2,          label: "Settings2" },
      { icon: LucideIcons.Sliders,            label: "Sliders" },
      { icon: LucideIcons.SlidersHorizontal,  label: "SlidersHorizontal" },
      { icon: LucideIcons.ToggleLeft,         label: "ToggleLeft" },
      { icon: LucideIcons.ToggleRight,        label: "ToggleRight" },
      { icon: LucideIcons.Monitor,            label: "Monitor" },
      { icon: LucideIcons.MonitorDot,         label: "MonitorDot" },
      { icon: LucideIcons.Laptop,             label: "Laptop" },
      { icon: LucideIcons.Laptop2,            label: "Laptop2" },
      { icon: LucideIcons.Smartphone,         label: "Smartphone" },
      { icon: LucideIcons.Tablet,             label: "Tablet" },
      { icon: LucideIcons.Watch,              label: "Watch" },
      { icon: LucideIcons.Cpu,                label: "Cpu" },
      { icon: LucideIcons.HardDrive,          label: "HardDrive" },
      { icon: LucideIcons.HardDriveDownload,  label: "HardDriveDownload" },
      { icon: LucideIcons.MemoryStick,        label: "MemoryStick" },
      { icon: LucideIcons.Globe,              label: "Globe" },
      { icon: LucideIcons.Globe2,             label: "Globe2" },
      { icon: LucideIcons.Wifi,               label: "Wifi" },
      { icon: LucideIcons.WifiOff,            label: "WifiOff" },
      { icon: LucideIcons.Bluetooth,          label: "Bluetooth" },
      { icon: LucideIcons.Cloud,              label: "Cloud" },
      { icon: LucideIcons.CloudUpload,        label: "CloudUpload" },
      { icon: LucideIcons.CloudDownload,      label: "CloudDownload" },
      { icon: LucideIcons.CloudOff,           label: "CloudOff" },
      { icon: LucideIcons.Server,             label: "Server" },
      { icon: LucideIcons.ServerCog,          label: "ServerCog" },
      { icon: LucideIcons.Terminal,           label: "Terminal" },
      { icon: LucideIcons.TerminalSquare,     label: "TerminalSquare" },
      { icon: LucideIcons.Code,               label: "Code" },
      { icon: LucideIcons.Code2,              label: "Code2" },
      { icon: LucideIcons.Braces,             label: "Braces" },
      { icon: LucideIcons.Brackets,           label: "Brackets" },
      { icon: LucideIcons.GitBranch,          label: "GitBranch" },
      { icon: LucideIcons.GitBranch2,         label: "GitBranch2" },
      { icon: LucideIcons.GitCommit,          label: "GitCommit" },
      { icon: LucideIcons.GitMerge,           label: "GitMerge" },
      { icon: LucideIcons.GitPullRequest,     label: "GitPullRequest" },
      { icon: LucideIcons.GitFork,            label: "GitFork" },
      { icon: LucideIcons.Bug,                label: "Bug" },
      { icon: LucideIcons.BugPlay,            label: "BugPlay" },
      { icon: LucideIcons.Webhook,            label: "Webhook" },
      { icon: LucideIcons.Power,              label: "Power" },
      { icon: LucideIcons.PowerOff,           label: "PowerOff" },
      { icon: LucideIcons.Plug,               label: "Plug" },
      { icon: LucideIcons.Plug2,              label: "Plug2" },
      { icon: LucideIcons.PlugZap,            label: "PlugZap" },
    ],
  },
  {
    name: "Commerce & Finance",
    icons: [
      { icon: LucideIcons.CreditCard,         label: "CreditCard" },
      { icon: LucideIcons.DollarSign,         label: "DollarSign" },
      { icon: LucideIcons.Euro,               label: "Euro" },
      { icon: LucideIcons.PoundSterling,      label: "PoundSterling" },
      { icon: LucideIcons.Bitcoin,            label: "Bitcoin" },
      { icon: LucideIcons.Banknote,           label: "Banknote" },
      { icon: LucideIcons.Coins,              label: "Coins" },
      { icon: LucideIcons.Wallet,             label: "Wallet" },
      { icon: LucideIcons.Wallet2,            label: "Wallet2" },
      { icon: LucideIcons.PiggyBank,          label: "PiggyBank" },
      { icon: LucideIcons.Receipt,            label: "Receipt" },
      { icon: LucideIcons.ShoppingCart,       label: "ShoppingCart" },
      { icon: LucideIcons.ShoppingBag,        label: "ShoppingBag" },
      { icon: LucideIcons.Store,              label: "Store" },
      { icon: LucideIcons.Tag,                label: "Tag" },
      { icon: LucideIcons.Tags,               label: "Tags" },
      { icon: LucideIcons.BadgePercent,       label: "BadgePercent" },
      { icon: LucideIcons.Truck,              label: "Truck" },
      { icon: LucideIcons.PackageCheck,       label: "PackageCheck" },
      { icon: LucideIcons.Handshake,          label: "Handshake" },
      { icon: LucideIcons.Building,           label: "Building" },
      { icon: LucideIcons.Building2,          label: "Building2" },
      { icon: LucideIcons.Landmark,           label: "Landmark" },
    ],
  },
  {
    name: "Interface & Layout",
    icons: [
      { icon: LucideIcons.Eye,                label: "Eye" },
      { icon: LucideIcons.EyeOff,             label: "EyeOff" },
      { icon: LucideIcons.Sidebar,            label: "Sidebar" },
      { icon: LucideIcons.PanelLeft,          label: "PanelLeft" },
      { icon: LucideIcons.PanelLeftOpen,      label: "PanelLeftOpen" },
      { icon: LucideIcons.PanelRight,         label: "PanelRight" },
      { icon: LucideIcons.PanelTop,           label: "PanelTop" },
      { icon: LucideIcons.PanelBottom,        label: "PanelBottom" },
      { icon: LucideIcons.MoreHorizontal,     label: "MoreHorizontal" },
      { icon: LucideIcons.MoreVertical,       label: "MoreVertical" },
      { icon: LucideIcons.Grip,               label: "Grip" },
      { icon: LucideIcons.GripVertical,       label: "GripVertical" },
      { icon: LucideIcons.GripHorizontal,     label: "GripHorizontal" },
      { icon: LucideIcons.Move,               label: "Move" },
      { icon: LucideIcons.MoveHorizontal,     label: "MoveHorizontal" },
      { icon: LucideIcons.MoveVertical,       label: "MoveVertical" },
      { icon: LucideIcons.Expand,             label: "Expand" },
      { icon: LucideIcons.Shrink,             label: "Shrink" },
      { icon: LucideIcons.Fullscreen,         label: "Fullscreen" },
      { icon: LucideIcons.Columns,            label: "Columns" },
      { icon: LucideIcons.Rows,               label: "Rows" },
      { icon: LucideIcons.SeparatorHorizontal,label: "SeparatorH" },
      { icon: LucideIcons.SeparatorVertical,  label: "SeparatorV" },
      { icon: LucideIcons.Component,          label: "Component" },
      { icon: LucideIcons.SquareStack,        label: "SquareStack" },
    ],
  },
  {
    name: "Maps & Transport",
    icons: [
      { icon: LucideIcons.MapPin,             label: "MapPin" },
      { icon: LucideIcons.MapPinOff,          label: "MapPinOff" },
      { icon: LucideIcons.Map,                label: "Map" },
      { icon: LucideIcons.Globe,              label: "Globe" },
      { icon: LucideIcons.Milestone,          label: "Milestone" },
      { icon: LucideIcons.Mountain,           label: "Mountain" },
      { icon: LucideIcons.Plane,              label: "Plane" },
      { icon: LucideIcons.PlaneTakeoff,       label: "PlaneTakeoff" },
      { icon: LucideIcons.PlaneLanding,       label: "PlaneLanding" },
      { icon: LucideIcons.Car,                label: "Car" },
      { icon: LucideIcons.Bus,                label: "Bus" },
      { icon: LucideIcons.Train,              label: "Train" },
      { icon: LucideIcons.Bike,               label: "Bike" },
      { icon: LucideIcons.Ship,               label: "Ship" },
      { icon: LucideIcons.Anchor,             label: "Anchor" },
      { icon: LucideIcons.Hotel,              label: "Hotel" },
    ],
  },
  {
    name: "Nature & Science",
    icons: [
      { icon: LucideIcons.Sun,                label: "Sun" },
      { icon: LucideIcons.Moon,               label: "Moon" },
      { icon: LucideIcons.Sunrise,            label: "Sunrise" },
      { icon: LucideIcons.Sunset,             label: "Sunset" },
      { icon: LucideIcons.CloudSun,           label: "CloudSun" },
      { icon: LucideIcons.CloudRain,          label: "CloudRain" },
      { icon: LucideIcons.CloudSnow,          label: "CloudSnow" },
      { icon: LucideIcons.CloudLightning,     label: "CloudLightning" },
      { icon: LucideIcons.Wind,               label: "Wind" },
      { icon: LucideIcons.Droplets,           label: "Droplets" },
      { icon: LucideIcons.Flame,              label: "Flame" },
      { icon: LucideIcons.Snowflake,          label: "Snowflake" },
      { icon: LucideIcons.Leaf,               label: "Leaf" },
      { icon: LucideIcons.TreePine,           label: "TreePine" },
      { icon: LucideIcons.Flower,             label: "Flower" },
      { icon: LucideIcons.Flower2,            label: "Flower2" },
      { icon: LucideIcons.Dna,                label: "Dna" },
      { icon: LucideIcons.Atom,               label: "Atom" },
      { icon: LucideIcons.Beaker,             label: "Beaker" },
      { icon: LucideIcons.Microscope,         label: "Microscope" },
      { icon: LucideIcons.TestTube,           label: "TestTube" },
      { icon: LucideIcons.Thermometer,        label: "Thermometer" },
      { icon: LucideIcons.Magnet,             label: "Magnet" },
    ],
  },
  {
    name: "Design & Text",
    icons: [
      { icon: LucideIcons.Palette,            label: "Palette" },
      { icon: LucideIcons.PaintBucket,        label: "PaintBucket" },
      { icon: LucideIcons.Paintbrush,         label: "Paintbrush" },
      { icon: LucideIcons.Paintbrush2,        label: "Paintbrush2" },
      { icon: LucideIcons.Pipette,            label: "Pipette" },
      { icon: LucideIcons.Pen,                label: "Pen" },
      { icon: LucideIcons.PenTool,            label: "PenTool" },
      { icon: LucideIcons.Ruler,              label: "Ruler" },
      { icon: LucideIcons.Scaling,            label: "Scaling" },
      { icon: LucideIcons.Shapes,             label: "Shapes" },
      { icon: LucideIcons.Type,               label: "Type" },
      { icon: LucideIcons.Bold,               label: "Bold" },
      { icon: LucideIcons.Italic,             label: "Italic" },
      { icon: LucideIcons.Underline,          label: "Underline" },
      { icon: LucideIcons.Strikethrough,      label: "Strikethrough" },
      { icon: LucideIcons.AlignJustify,       label: "AlignJustify" },
      { icon: LucideIcons.CaseSensitive,      label: "CaseSensitive" },
      { icon: LucideIcons.Baseline,           label: "Baseline" },
      { icon: LucideIcons.Wand,               label: "Wand" },
      { icon: LucideIcons.Wand2,              label: "Wand2" },
      { icon: LucideIcons.Sparkles,           label: "Sparkles" },
    ],
  },
  {
    name: "Fun & Misc",
    icons: [
      { icon: LucideIcons.Rocket,             label: "Rocket" },
      { icon: LucideIcons.Target,             label: "Target" },
      { icon: LucideIcons.Crosshair,          label: "Crosshair" },
      { icon: LucideIcons.Aperture,           label: "Aperture" },
      { icon: LucideIcons.Gem,                label: "Gem" },
      { icon: LucideIcons.Gift,               label: "Gift" },
      { icon: LucideIcons.PartyPopper,        label: "PartyPopper" },
      { icon: LucideIcons.Cake,               label: "Cake" },
      { icon: LucideIcons.Coffee,             label: "Coffee" },
      { icon: LucideIcons.Pizza,              label: "Pizza" },
      { icon: LucideIcons.Apple,              label: "Apple" },
      { icon: LucideIcons.Gamepad,            label: "Gamepad" },
      { icon: LucideIcons.Gamepad2,           label: "Gamepad2" },
      { icon: LucideIcons.Dices,              label: "Dices" },
      { icon: LucideIcons.Puzzle,             label: "Puzzle" },
      { icon: LucideIcons.Construction,       label: "Construction" },
      { icon: LucideIcons.Hammer,             label: "Hammer" },
      { icon: LucideIcons.Wrench,             label: "Wrench" },
      { icon: LucideIcons.Lightbulb,          label: "Lightbulb" },
      { icon: LucideIcons.Lamp,               label: "Lamp" },
      { icon: LucideIcons.QrCode,             label: "QrCode" },
      { icon: LucideIcons.Barcode,            label: "Barcode" },
      { icon: LucideIcons.ScanLine,           label: "ScanLine" },
      { icon: LucideIcons.Scan,               label: "Scan" },
    ],
  },
];

/* Filter out any entries where the icon resolved to undefined/null */
const safeCategories = iconCategories.map(cat => ({
  ...cat,
  icons: cat.icons.filter(({ icon }) => icon != null),
}));

const totalIcons = safeCategories.reduce((acc, c) => acc + c.icons.length, 0);

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
const sizes = [
  { label: "XS",   px: 12 },
  { label: "SM",   px: 16 },
  { label: "MD",   px: 20 },
  { label: "LG",   px: 24 },
  { label: "XL",   px: 32 },
  { label: "2XL",  px: 40 },
];

const colorVariants = [
  { label: "Foreground",  cls: "text-foreground" },
  { label: "Muted",       cls: "text-muted-foreground" },
  { label: "Primary",     cls: "text-primary" },
  { label: "Success",     cls: "text-success" },
  { label: "Warning",     cls: "text-warning" },
  { label: "Info",        cls: "text-info" },
];

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-foreground mb-1">{title}</h2>
      {description && <p className="text-[0.9375rem] text-muted-foreground">{description}</p>}
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-5">{title}</h3>
      {children}
    </div>
  );
}

function ShowcaseCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-card rounded-[16px] border border-border p-6 ${className}`}
      style={{ boxShadow: "var(--shadow)" }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main export
───────────────────────────────────────────── */
export function IconsShowcase() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (label: string) => {
    navigator.clipboard.writeText(label).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const filtered = search.trim()
    ? safeCategories
        .map(cat => ({
          ...cat,
          icons: cat.icons.filter(ic =>
            ic.label.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter(cat => cat.icons.length > 0)
    : safeCategories;

  const filteredTotal = filtered.reduce((acc, c) => acc + c.icons.length, 0);

  return (
    <div className="space-y-16">

      {/* ── USAGE GUIDE ── */}
      <section id="icon-sizes">
        <SectionHeader
          title="Icons"
          description="Outline Lucide React icons only. Never use filled, skeuomorphic, or heavy-stroke icons."
        />

        <SubSection title="Sizes">
          <ShowcaseCard>
            <div className="flex flex-wrap items-end gap-8">
              {sizes.map(s => (
                <div key={s.label} className="flex flex-col items-center gap-3">
                  <Zap
                    style={{ width: s.px, height: s.px }}
                    className="text-foreground"
                    strokeWidth={1.75}
                  />
                  <div className="text-center">
                    <div className="text-[0.8125rem] font-semibold text-foreground">{s.label}</div>
                    <div className="text-[0.6875rem] text-muted-foreground font-mono">{s.px}px</div>
                  </div>
                </div>
              ))}
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title="Colors">
          <ShowcaseCard>
            <div className="flex flex-wrap gap-8">
              {colorVariants.map(v => (
                <div key={v.label} className="flex flex-col items-center gap-2">
                  <Bell className={`w-5 h-5 ${v.cls}`} strokeWidth={1.75} />
                  <span className="text-[0.75rem] text-muted-foreground">{v.label}</span>
                </div>
              ))}
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title="Stroke weight">
          <ShowcaseCard>
            <div className="flex flex-wrap gap-8">
              {[
                { label: "1.25",           sw: 1.25 },
                { label: "1.5",            sw: 1.5  },
                { label: "1.75 (default)",  sw: 1.75 },
                { label: "2.0",            sw: 2    },
              ].map(s => (
                <div key={s.label} className="flex flex-col items-center gap-2">
                  <Settings className="w-6 h-6 text-foreground" strokeWidth={s.sw} />
                  <span
                    className={`text-[0.75rem] ${
                      s.sw === 1.75
                        ? "font-semibold text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title="In context">
          <ShowcaseCard>
            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 h-10 px-4 rounded-[12px] bg-primary text-primary-foreground text-[0.9375rem] font-semibold hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4" strokeWidth={2} /> New
              </button>
              <button className="inline-flex items-center gap-2 h-10 px-4 rounded-[12px] border border-border bg-card text-foreground text-[0.9375rem] font-semibold hover:bg-accent transition-colors">
                <Download className="w-4 h-4" strokeWidth={1.75} /> Export
              </button>
              <button className="inline-flex items-center gap-2 h-10 px-4 rounded-[12px] border border-border bg-card text-foreground text-[0.9375rem] font-semibold hover:bg-accent transition-colors">
                <Filter className="w-4 h-4" strokeWidth={1.75} /> Filter
              </button>
              {([Search, Settings, Bell, MoreHorizontal] as React.ElementType[]).map((Icon, i) => (
                <button
                  key={i}
                  className="h-10 w-10 rounded-[12px] border border-border bg-card flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <Icon className="w-4 h-4" strokeWidth={1.75} />
                </button>
              ))}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-[0.8125rem] font-medium bg-success/10 text-success border border-success/20">
                <CheckCircle className="w-3.5 h-3.5" strokeWidth={2} /> Active
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-[0.8125rem] font-medium bg-primary/10 text-primary border border-primary/20">
                <AlertCircle className="w-3.5 h-3.5" strokeWidth={2} /> Alert
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-[0.8125rem] font-medium bg-warning/10 text-warning border border-warning/20">
                <Clock className="w-3.5 h-3.5" strokeWidth={2} /> Pending
              </span>
            </div>
          </ShowcaseCard>
        </SubSection>
      </section>

      {/* ── LIBRARY ── */}
      <section id="icon-library">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-foreground mb-1">
              Library
            </h2>
            <p className="text-[0.9375rem] text-muted-foreground">
              {search ? `${filteredTotal} of ${totalIcons}` : totalIcons} icons in{" "}
              {safeCategories.length} categories · Click to copy the name
            </p>
          </div>
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search icon..."
              className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground rounded-[10px] pl-9 pr-3 py-2 text-[0.875rem] outline-none focus:ring-2 focus:ring-ring focus:border-primary/60 transition-all"
            />
          </div>
        </div>

        <div className="space-y-8">
          {filtered.map(cat => (
            <div key={cat.name}>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {cat.name}
                </h3>
                <span className="text-[0.6875rem] text-muted-foreground/50 font-mono">
                  {cat.icons.length}
                </span>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(76px,1fr))] gap-1">
                {cat.icons.map(({ icon: Icon, label }) => (
                  <button
                    key={`${cat.name}-${label}`}
                    onClick={() => handleCopy(label)}
                    title={label}
                    className={`flex flex-col items-center gap-2 p-3 rounded-[10px] border transition-all duration-150 cursor-pointer
                      ${copied === label
                        ? "border-primary/40 bg-primary/5 text-primary"
                        : "border-transparent hover:border-border hover:bg-accent text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {copied === label
                      ? <Check className="w-5 h-5 text-primary" strokeWidth={2} />
                      : <Icon className="w-5 h-5" strokeWidth={1.75} />
                    }
                    <span className="text-[0.5625rem] font-medium text-center leading-tight w-full truncate">
                      {copied === label ? "Copied!" : label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Search className="w-8 h-8 opacity-30" />
              <p className="text-[0.9rem]">
                No icon found for{" "}
                <strong className="text-foreground">"{search}"</strong>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Tokens ── */}
      <section id="icons-tokens" className="space-y-5">
        <div>
          <h2 className="text-[1.125rem] font-black text-foreground tracking-[-0.025em]">Tokens</h2>
          <p className="text-[0.8125rem] text-muted-foreground mt-0.5">CSS custom properties for icon color, sizing, and context.</p>
        </div>
        <TokenTable groups={iconsTokenGroups} />
      </section>
    </div>
  );
}

const iconsTokenGroups: TokenGroup[] = [
  {
    group: "Icon Colors",
    tokens: [
      { name: "--foreground",       description: "Default / emphasis icon",    light: "#131A27", dark: "#E4E9F0", isColor: true },
      { name: "--muted-foreground", description: "Secondary / subdued icon",   light: "#627288", dark: "#8898B0", isColor: true },
      { name: "--foreground-subtle",description: "Decorative / disabled icon", light: "#8898B0", dark: "#627288", isColor: true },
      { name: "--primary",          description: "Accent / active icon",       light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "--success",          description: "Confirmation / done icon",   light: "#4fb57b", dark: "#22C55E", isColor: true },
      { name: "--warning",          description: "Caution / alert icon",       light: "#e5a94e", dark: "#f5b320", isColor: true },
      { name: "--error",            description: "Error / danger icon",        light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "--info",             description: "Informational icon",         light: "#448abc", dark: "#3B82F6", isColor: true },
      { name: "--violet",           description: "Purple accent icon",         light: "#ba69dc", dark: "#eb6cff", isColor: true },
      { name: "--orange",           description: "Orange accent icon",         light: "#fa9852", dark: "#ff8833", isColor: true },
    ],
  },
  {
    group: "Icon Containers",
    tokens: [
      { name: "--muted",            description: "Icon container background",  light: "#E8EDF3",              dark: "rgba(40,48,67,0.60)", isColor: true },
      { name: "--primary-muted",    description: "Primary icon container bg",  light: "rgba(212,77,77,0.10)", dark: "rgba(212,77,77,0.15)", isColor: true },
      { name: "--success-muted",    description: "Success icon container bg",  light: "rgba(79,181,123,0.10)",dark: "rgba(34,197,94,0.12)", isColor: true },
      { name: "--warning-muted",    description: "Warning icon container bg",  light: "rgba(229,169,78,0.10)",dark: "rgba(245,179,32,0.12)", isColor: true },
      { name: "--info-muted",       description: "Info icon container bg",     light: "rgba(68,138,188,0.10)",dark: "rgba(59,130,246,0.12)", isColor: true },
    ],
  },
  {
    group: "Sizing (Tailwind shortcuts)",
    tokens: [
      { name: "h-3 w-3",  description: "Extra small  (12px) — inline hint" },
      { name: "h-4 w-4",  description: "Small        (16px) — nav, labels" },
      { name: "h-5 w-5",  description: "Default      (20px) — body, buttons" },
      { name: "h-6 w-6",  description: "Medium       (24px) — section headers" },
      { name: "h-8 w-8",  description: "Large        (32px) — feature icons" },
      { name: "h-10 w-10",description: "Extra large  (40px) — hero / splash" },
    ],
  },
];
