import type {
  MemberDashboard,
  MemberProfile,
  MemberProfileUpdate,
  MemberSummary,
  NotificationPreferences,
  TierLevel
} from '~/types/member'

export interface MemberRepository {
  getSummary(memberId: string): Promise<MemberSummary | null>
  getDashboard(memberId: string): Promise<MemberDashboard | null>
  getTierLevels(): Promise<TierLevel[]>
  getProfile(memberId: string): Promise<MemberProfile | null>
  updateProfile(memberId: string, update: MemberProfileUpdate): Promise<MemberProfile>
  uploadAvatar(memberId: string, file: File): Promise<MemberProfile>
  getNotificationPreferences(memberId: string): Promise<NotificationPreferences>
  updateNotificationPreferences(memberId: string, preferences: NotificationPreferences): Promise<NotificationPreferences>
}

export function createMockMemberRepository(): MemberRepository {
  let profile: MemberProfile = {
    id: 'mock-member-id',
    firstName: 'มายด์',
    lastName: 'ใจดี',
    phone: '081-234-4521',
    isPhoneVerified: true,
    email: null,
    birthDate: '1996-02-14',
    gender: 'female',
    avatarUrl: null,
    memberCode: 'YY-204518',
    tier: 'Buddy',
    joinedAt: '2026-08-12',
    isLineConnected: true
  }

  let notificationPreferences: NotificationPreferences = {
    orderAndPointsUpdates: true,
    pointsExpiry: true,
    promotions: false,
    petDataConsent: true
  }

  return {
    async getProfile() {
      return profile
    },

    async updateProfile(_memberId, update) {
      profile = { ...profile, ...update }
      return profile
    },

    // Mock only: a blob URL lives in this browser tab, the real upload goes to storage
    async uploadAvatar(_memberId, file) {
      profile = { ...profile, avatarUrl: URL.createObjectURL(file) }
      return profile
    },

    async getNotificationPreferences() {
      return notificationPreferences
    },

    async updateNotificationPreferences(_memberId, preferences) {
      notificationPreferences = { ...preferences }
      return notificationPreferences
    },

    async getTierLevels() {
      return [
        {
          name: 'Puppy',
          minPoints: 0,
          benefits: ['รับแต้ม 1 เท่า ทุกการสั่งซื้อ', 'คูปองต้อนรับสมาชิกใหม่']
        },
        {
          name: 'Buddy',
          minPoints: 1000,
          benefits: ['รับแต้ม 1.2 เท่า ทุกการสั่งซื้อ', 'คูปองวันเกิด 10% ทั้งตัวคุณและน้อง', 'ร่วมกิจกรรมพิเศษก่อนใคร']
        },
        {
          name: 'Best Friend',
          minPoints: 2000,
          benefits: ['รับแต้ม 1.5 เท่า ทุกการสั่งซื้อ', 'คูปองวันเกิด 15% ทั้งตัวคุณและน้อง', 'ส่งฟรีทุกออเดอร์']
        },
        {
          name: 'Family',
          minPoints: 5000,
          benefits: ['รับแต้ม 2 เท่า ทุกการสั่งซื้อ', 'คูปองวันเกิด 20% ทั้งตัวคุณและน้อง', 'ของขวัญพิเศษประจำปี']
        }
      ]
    },

    async getSummary(memberId) {
      return {
        id: memberId,
        displayName: profile.firstName,
        avatarUrl: null,
        points: 1280,
        tier: 'Buddy',
        memberCode: 'YY-204518',
        unreadNotificationCount: 1
      }
    },

    async getDashboard() {
      return {
        tierProgress: {
          currentTier: 'Buddy',
          nextTier: 'Best Friend',
          pointsToNextTier: 720,
          progressPercent: 64
        },
        expiringPoints: {
          amount: 320,
          expiresAt: '2026-12-31'
        },
        pendingOrders: {
          count: 2,
          points: 150
        },
        isLineConnected: true
      }
    }
  }
}
