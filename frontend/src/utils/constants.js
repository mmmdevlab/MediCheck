import { createElement } from 'react';
import {
  Car,
  FileText,
  ShoppingBag,
  Utensils,
  Heart,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  Trash2,
  Plus,
  UserMinus,
  Calendar,
  ListEnd,
  CheckSquare,
  Square,
  Mail,
  ShieldAlert,
  HouseHeart,
  Route,
  CalendarFold,
  UserRound,
  LogOut,
  Phone,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  Pencil,
  Laugh,
  SmilePlus,
  Smile,
  Meh,
  Frown,
} from 'lucide-react';

export const DEFAULT_ICON_PROPS = {
  size: 20,
  strokeWidth: 2,
  className: 'text-current',
};

const withIcon = (IconComponent, overrides = {}) => {
  return (props = {}) => {
    const { className = '', size, strokeWidth, ...rest } = props;
    const mergedClass = [
      DEFAULT_ICON_PROPS.className,
      overrides.className,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return createElement(IconComponent, {
      ...DEFAULT_ICON_PROPS,
      ...overrides,
      size: size ?? DEFAULT_ICON_PROPS.size,
      strokeWidth: strokeWidth ?? DEFAULT_ICON_PROPS.strokeWidth,
      className: mergedClass,
      ...rest,
    });
  };
};

export const ICONS = {
  transport: withIcon(Car),
  notes: withIcon(FileText),
  pickup: withIcon(ShoppingBag),
  meal_prep: withIcon(Utensils),
  recovery_care: withIcon(Heart),
  other: withIcon(HelpCircle),
  check: withIcon(CheckCircle),
  alert: withIcon(AlertCircle),
  clock: withIcon(Clock),
  close: withIcon(X),
  trash: withIcon(Trash2),
  plus: withIcon(Plus),
  userMinus: withIcon(UserMinus),
  calendar: withIcon(Calendar),
  listEnd: withIcon(ListEnd),
  checkSquare: withIcon(CheckSquare),
  square: withIcon(Square),
  mail: withIcon(Mail),
  shieldAlert: withIcon(ShieldAlert),
  houseHeart: withIcon(HouseHeart),
  route: withIcon(Route),
  calendarFold: withIcon(CalendarFold),
  user: withIcon(UserRound),
  logout: withIcon(LogOut),
  phone: withIcon(Phone),
  chevronLeft: withIcon(ChevronLeft),
  chevronRight: withIcon(ChevronRight),
  chevronDown: withIcon(ChevronDown),
  chevronUp: withIcon(ChevronUp),
  mapPin: withIcon(MapPin),
  pencil: withIcon(Pencil),

  veryWell: withIcon(Laugh),
  good: withIcon(SmilePlus),
  okay: withIcon(Smile),
  unwell: withIcon(Meh),
  bad: withIcon(Frown),
};

export const FILTER_OPTIONS = [
  { value: 'ALL', label: 'ALL' },
  { value: 'scheduled', label: 'SCHEDULED' },
  { value: 'missed', label: 'MISSED' },
  { value: 'cancelled', label: 'CANCELLED' },
  { value: 'completed', label: 'COMPLETED' },
];

export const SUPPORT_REQUEST_MODE_CONFIG = {
  pending: {
    badgeColor: 'text-yellow-700',
    emptyMessage: 'No pending requests',
    badge: (count) => `${count} Pending Request${count === 1 ? '' : 's'}`,
  },
  accepted: {
    badgeColor: 'text-green-700',
    emptyMessage: 'No accepted requests',
    badge: (count) => `${count} Accepted Request${count === 1 ? '' : 's'}`,
  },
  history: {
    badgeColor: 'text-gray-700',
    emptyMessage: 'No request history',
    badge: (count) => `${count} Request${count === 1 ? '' : 's'} in History`,
  },
};

export const ROLES = {
  PATIENT: 'patient',
  CAREGIVER: 'caregiver',
  CLINIC: 'clinic',
};

export const REQUEST_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  COMPLETED: 'completed',
};

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const REQUEST_TYPE_CONFIG = {
  transport: {
    icon: ICONS.transport,
    label: 'Transport',
    color: 'bg-blue-100 text-blue-700',
  },
  notes: {
    icon: ICONS.notes,
    label: 'Note-Taking',
    color: 'bg-purple-100 text-purple-700',
  },
  pickup: {
    icon: ICONS.pickup,
    label: 'Pickup',
    color: 'bg-green-100 text-green-700',
  },
  meal_prep: {
    icon: ICONS.meal_prep,
    label: 'Meal Prep',
    color: 'bg-orange-100 text-orange-700',
  },
  recovery_care: {
    icon: ICONS.recovery_care,
    label: 'Recovery Care',
    color: 'bg-pink-100 text-pink-700',
  },
  other: {
    icon: ICONS.other,
    label: 'Other',
    color: 'bg-gray-100 text-gray-700',
  },
};

export const REQUEST_STATUS_BADGE = {
  [REQUEST_STATUS.COMPLETED]: 'bg-green-100 text-green-700',
  [REQUEST_STATUS.DECLINED]: 'bg-gray-100 text-gray-500',
  [REQUEST_STATUS.ACCEPTED]: 'bg-blue-100 text-blue-700',
  [REQUEST_STATUS.PENDING]: 'bg-yellow-100 text-yellow-700',
};

export const FEELING_SCORES = {
  5: {
    id: 5,
    label: 'Very Well',
    icon: ICONS.veryWell,
    color: '#C0FC80',
    bgColor: 'bg-[#C0FC80]',
    textColor: 'text-black',
  },
  4: {
    id: 4,
    label: 'Good',
    icon: ICONS.good,
    color: '#FFE46E',
    bgColor: 'bg-[#FFE46E]',
    textColor: 'text-black',
  },
  3: {
    id: 3,
    label: 'Okay',
    icon: ICONS.okay,
    color: '#FFA450',
    bgColor: 'bg-[#FFA450]',
    textColor: 'text-black',
  },
  2: {
    id: 2,
    label: 'Unwell',
    icon: ICONS.unwell,
    color: '#FF7650',
    bgColor: 'bg-[#FF7650]',
    textColor: 'text-white',
  },
  1: {
    id: 1,
    label: 'Bad',
    icon: ICONS.bad,
    color: '#E43737',
    bgColor: 'bg-[#E43737]',
    textColor: 'text-white',
  },
};

export const BADGE_COLORS = [
  'bg-pink-200 text-pink-900',
  'bg-blue-200 text-blue-900',
  'bg-yellow-200 text-yellow-900',
  'bg-green-200 text-green-900',
  'bg-purple-200 text-purple-900',
];

export default ICONS;
