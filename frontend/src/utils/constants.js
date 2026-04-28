import { Frown, Meh, Smile, SmilePlus, Laugh } from 'lucide-react';

export const ROLES = {
  PATIENT: 'patient',
  CAREGIVER: 'caregiver',
};

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const REQUEST_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  COMPLETED: 'completed',
};

export const REQUEST_TYPES = {
  TRANSPORT: 'transport',
  NOTES: 'notes',
  PICKUP: 'pickup',
  OTHER: 'other',
};

export const FEELING_SCORES = {
  5: {
    label: 'Very Well',
    icon: Laugh,
    color: '#C0FC80',
    bgColor: 'bg-[#C0FC80]',
    textColor: 'text-black',
  },
  4: {
    label: 'Good',
    icon: SmilePlus,
    color: '#FFE46E',
    bgColor: 'bg-[#FFE46E]',
    textColor: 'text-black',
  },
  3: {
    label: 'Okay',
    icon: Smile,
    color: '#FFA450',
    bgColor: 'bg-[#FFA450]',
    textColor: 'text-black',
  },
  2: {
    label: 'Unwell',
    icon: Meh,
    color: '#FF7650',
    bgColor: 'bg-[#FF7650]',
    textColor: 'text-white',
  },
  1: {
    label: 'Bad',
    icon: Frown,
    color: '#E43737',
    bgColor: 'bg-[#E43737]',
    textColor: 'text-white',
  },
};
