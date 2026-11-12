import type {
  MemberDashboard,
  MemberOnboarding,
  MemberProfile,
  MemberProfileUpdate,
  MemberSummary,
  MemberTierStatus,
  NotificationPreferences,
  OnboardingStatus,
  TierBenefitComparisonRow,
  TierLevel
} from '~/types/member'

export interface MemberRepository {
  getSummary(memberId: string): Promise<MemberSummary | null>
  getDashboard(memberId: string): Promise<MemberDashboard | null>
  getTierLevels(): Promise<TierLevel[]>
  getTierBenefitComparison(): Promise<TierBenefitComparisonRow[]>
  getTierStatus(memberId: string): Promise<MemberTierStatus | null>
  getProfile(memberId: string): Promise<MemberProfile | null>
  updateProfile(memberId: string, update: MemberProfileUpdate): Promise<MemberProfile>
  uploadAvatar(memberId: string, file: File): Promise<MemberProfile>
  getNotificationPreferences(memberId: string): Promise<NotificationPreferences>
  updateNotificationPreferences(memberId: string, preferences: NotificationPreferences): Promise<NotificationPreferences>
  getOnboardingStatus(memberId: string): Promise<OnboardingStatus>
  // The welcome bonus is awarded by the backend; the result reports how many points were actually given
  completeOnboarding(memberId: string, onboarding: MemberOnboarding): Promise<{ awardedPoints: number }>
}

export const MOCK_SEEDED_MEMBER_ID = 'mock-member-id'
const MOCK_NEW_MEMBER_ID_PREFIX = 'mock-member-'
const MOCK_WELCOME_BONUS_POINTS = 50

const MOCK_TIER_LEVELS: TierLevel[] = [
  {
    name: 'Puppy',
    minPoints: 0,
    benefits: ['รับแต้ม 1 เท่า ทุกการสั่งซื้อ', 'คูปองต้อนรับสมาชิกใหม่'],
    perkHighlights: ['รับแต้มทุกการซื้อ', 'คูปองวันเกิด 5%']
  },
  {
    name: 'Buddy',
    minPoints: 1000,
    benefits: ['รับแต้ม 1.2 เท่า ทุกการสั่งซื้อ', 'คูปองวันเกิด 10% ทั้งตัวคุณและน้อง', 'ร่วมกิจกรรมพิเศษก่อนใคร'],
    perkHighlights: ['แต้ม 1.2 เท่า', 'คูปองวันเกิด 10%', 'ส่งฟรีเดือนละ 1 ครั้ง']
  },
  {
    name: 'Best Friend',
    minPoints: 2000,
    benefits: ['รับแต้ม 1.5 เท่า ทุกการสั่งซื้อ', 'คูปองวันเกิด 15% ทั้งตัวคุณและน้อง', 'ส่งฟรีทุกออเดอร์'],
    perkHighlights: ['แต้ม 1.5 เท่า', 'คูปองวันเกิด 15%', 'ส่งฟรีเดือนละ 2 ครั้ง', 'ของขวัญเลื่อนระดับ']
  },
  {
    name: 'Family',
    minPoints: 5000,
    benefits: ['รับแต้ม 2 เท่า ทุกการสั่งซื้อ', 'คูปองวันเกิด 20% ทั้งตัวคุณและน้อง', 'ของขวัญพิเศษประจำปี'],
    perkHighlights: ['แต้ม 2 เท่า', 'คูปองวันเกิด 20%', 'ส่งฟรีไม่จำกัด', 'สิทธิ์ซื้อสินค้าใหม่ก่อนใคร']
  }
]

const MOCK_TIER_BENEFIT_COMPARISON: TierBenefitComparisonRow[] = [
  { label: 'ตัวคูณแต้ม', valueByTier: { 'Puppy': '1 เท่า', 'Buddy': '1.2 เท่า', 'Best Friend': '1.5 เท่า', 'Family': '2 เท่า' } },
  { label: 'คูปองวันเกิด', valueByTier: { 'Puppy': '5%', 'Buddy': '10%', 'Best Friend': '15%', 'Family': '20%' } },
  { label: 'ส่งฟรีต่อเดือน', valueByTier: { 'Puppy': false, 'Buddy': '1 ครั้ง', 'Best Friend': '2 ครั้ง', 'Family': 'ไม่จำกัด' } },
  { label: 'ของขวัญเลื่อนระดับ', valueByTier: { 'Puppy': false, 'Buddy': true, 'Best Friend': true, 'Family': true } },
  { label: 'ซื้อสินค้าใหม่ก่อนใคร', valueByTier: { 'Puppy': false, 'Buddy': false, 'Best Friend': false, 'Family': true } }
]

// Mock stand-in for the backend tier rule: progress is measured from 0 toward the next tier's threshold
function calculateMockTierProgress(qualifyingPoints: number) {
  const currentTierIndex = Math.max(0, MOCK_TIER_LEVELS.findLastIndex(level => qualifyingPoints >= level.minPoints))
  const currentTier = MOCK_TIER_LEVELS[currentTierIndex]!
  const nextTier = MOCK_TIER_LEVELS[currentTierIndex + 1] ?? null
  return {
    currentTier: currentTier.name,
    nextTier: nextTier?.name ?? null,
    pointsToNextTier: nextTier ? nextTier.minPoints - qualifyingPoints : 0,
    progressPercent: nextTier ? Math.floor((qualifyingPoints / nextTier.minPoints) * 100) : 100
  }
}

function firstDayOfNextMonth(now = new Date()) {
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-01`
}

interface MockMemberRecord {
  profile: MemberProfile
  notificationPreferences: NotificationPreferences
  pointsBalance: number
  qualifyingSpendBaht: number
  qualifyingPoints: number
  onboardingCompletedAt: string | null
  isLineOfficialAccountFriend: boolean
}

function createSeededMemberRecord(): MockMemberRecord {
  return {
    profile: {
      id: MOCK_SEEDED_MEMBER_ID,
      firstName: 'มายด์',
      lastName: 'ใจดี',
      phone: '081-234-4521',
      isPhoneVerified: true,
      email: null,
      birthDate: '1996-02-14',
      gender: 'female',
      petOwnership: 'both',
      avatarUrl: null,
      memberCode: 'YY-204518',
      tier: 'Buddy',
      joinedAt: '2026-08-12',
      isLineConnected: true
    },
    notificationPreferences: {
      orderAndPointsUpdates: true,
      pointsExpiry: true,
      promotions: false,
      petDataConsent: true
    },
    pointsBalance: 1280,
    qualifyingSpendBaht: 12800,
    qualifyingPoints: 1280,
    onboardingCompletedAt: '2026-08-12',
    isLineOfficialAccountFriend: false
  }
}

// A member who just signed up by phone: the backend has only the verified phone number so far
function createNewMemberRecord(memberId: string, sequence: number): MockMemberRecord {
  return {
    profile: {
      id: memberId,
      firstName: '',
      lastName: '',
      phone: formatThaiMobile(memberId.slice(MOCK_NEW_MEMBER_ID_PREFIX.length)),
      isPhoneVerified: true,
      email: null,
      birthDate: null,
      gender: null,
      petOwnership: null,
      avatarUrl: null,
      memberCode: `YY-${String(300000 + sequence)}`,
      tier: 'Puppy',
      joinedAt: new Date().toISOString().slice(0, 10),
      isLineConnected: false
    },
    notificationPreferences: {
      orderAndPointsUpdates: false,
      pointsExpiry: false,
      promotions: false,
      petDataConsent: false
    },
    pointsBalance: 0,
    qualifyingSpendBaht: 0,
    qualifyingPoints: 0,
    onboardingCompletedAt: null,
    isLineOfficialAccountFriend: false
  }
}

export function createMockMemberRepository(): MemberRepository {
  const members = new Map<string, MockMemberRecord>([[MOCK_SEEDED_MEMBER_ID, createSeededMemberRecord()]])

  function getMember(memberId: string) {
    let member = members.get(memberId)
    if (!member) {
      member = createNewMemberRecord(memberId, members.size)
      members.set(memberId, member)
    }
    return member
  }

  return {
    async getOnboardingStatus(memberId) {
      const isRequired = getMember(memberId).onboardingCompletedAt === null
      return {
        isRequired,
        welcomeBonusPoints: isRequired ? MOCK_WELCOME_BONUS_POINTS : 0,
        // Terms and privacy are accepted on the sign-in screen before an account can be created
        hasAcceptedPrivacyPolicy: true
      }
    },

    async completeOnboarding(memberId, onboarding) {
      const member = getMember(memberId)
      if (member.onboardingCompletedAt) return { awardedPoints: 0 }

      // TODO: the backend should credit the referrer when referralCode is valid; the mock ignores it
      const { firstName, lastName, birthDate, email, marketingOptIn } = onboarding
      member.profile = { ...member.profile, firstName, lastName, birthDate, email }
      member.notificationPreferences = { ...member.notificationPreferences, promotions: marketingOptIn }
      member.pointsBalance += MOCK_WELCOME_BONUS_POINTS
      member.onboardingCompletedAt = new Date().toISOString()
      return { awardedPoints: MOCK_WELCOME_BONUS_POINTS }
    },

    async getProfile(memberId) {
      return getMember(memberId).profile
    },

    async updateProfile(memberId, update) {
      const member = getMember(memberId)
      member.profile = { ...member.profile, ...update }
      return member.profile
    },

    // Mock only: a blob URL lives in this browser tab, the real upload goes to storage
    async uploadAvatar(memberId, file) {
      const member = getMember(memberId)
      member.profile = { ...member.profile, avatarUrl: URL.createObjectURL(file) }
      return member.profile
    },

    async getNotificationPreferences(memberId) {
      return getMember(memberId).notificationPreferences
    },

    async updateNotificationPreferences(memberId, preferences) {
      const member = getMember(memberId)
      member.notificationPreferences = { ...preferences }
      return member.notificationPreferences
    },

    async getTierLevels() {
      return MOCK_TIER_LEVELS
    },

    async getTierBenefitComparison() {
      return MOCK_TIER_BENEFIT_COMPARISON
    },

    async getTierStatus(memberId) {
      const { qualifyingSpendBaht, qualifyingPoints } = getMember(memberId)
      return {
        ...calculateMockTierProgress(qualifyingPoints),
        qualifyingSpendBaht,
        qualifyingPoints,
        nextReviewDate: firstDayOfNextMonth()
      }
    },

    async getSummary(memberId) {
      const { profile, pointsBalance } = getMember(memberId)
      return {
        id: memberId,
        displayName: profile.firstName,
        // Mock avatars are blob URLs, which the navbar's NuxtImg (ipx) can't fetch
        avatarUrl: null,
        points: pointsBalance,
        tier: profile.tier,
        memberCode: profile.memberCode,
        unreadNotificationCount: 1
      }
    },

    async getDashboard(memberId) {
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
          points: 22
        },
        isLineConnected: true,
        isLineOfficialAccountFriend: getMember(memberId).isLineOfficialAccountFriend
      }
    }
  }
}
