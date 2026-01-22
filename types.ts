
export type Visibility = 'private' | 'school';
export type Category = 'meeting' | 'event' | 'deadline' | 'trip' | 'etc' | 'education' | 'official' | 'service';

export interface Event {
  id: string;
  tenantId: string;
  ownerUid: string;
  visibility: Visibility;
  title: string;
  startAt: string; // ISOString
  endAt: string;   // ISOString
  allDay: boolean;
  category: Category;
  location?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  schoolName: string;
  inviteCode: string;
}

export interface UserProfile {
  uid: string;
  tenantId: string | null;
  role: 'member' | 'admin';
  displayName: string;
}

export interface Settings {
  alwaysOnTop: boolean;
  opacity: number;
  autoLaunch: boolean;
  notifications: boolean;
}
