import type {
  MemberDashboard,
  MemberOnboarding,
  MemberProfile,
  MemberProfileUpdate,
  MemberSummary,
  MemberTierStatus,
  ConsentHistoryEntry,
  ConsentPurpose,
  MemberConsents,
  PrivacyRequests,
  NotificationPreferences,
  OnboardingStatus,
  PhoneVerificationRequest,
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
  applyLinePictureAsAvatar(memberId: string): Promise<MemberProfile>
  getNotificationPreferences(memberId: string): Promise<NotificationPreferences>
  updateNotificationPreferences(memberId: string, preferences: NotificationPreferences): Promise<NotificationPreferences>
  getConsents(memberId: string): Promise<MemberConsents>
  setConsent(memberId: string, purpose: ConsentPurpose, granted: boolean): Promise<MemberConsents>
  getConsentHistory(memberId: string): Promise<ConsentHistoryEntry[]>
  getPrivacyRequests(memberId: string): Promise<PrivacyRequests>
  requestDataExport(memberId: string): Promise<PrivacyRequests>
  requestAccountDeletion(memberId: string): Promise<PrivacyRequests>
  getOnboardingStatus(memberId: string): Promise<OnboardingStatus>
  // For LINE sign-ups: one phone number can belong to one account only, so a taken number fails with phone_in_use
  requestPhoneVerification(memberId: string, phone: string): Promise<PhoneVerificationRequest>
  verifyPhone(memberId: string, phone: string, code: string): Promise<MemberProfile>
  // The welcome bonus is awarded by the backend; the result reports how many points were actually given
  completeOnboarding(memberId: string, onboarding: MemberOnboarding): Promise<{ awardedPoints: number }>
}

export const MOCK_SEEDED_MEMBER_ID = 'mock-member-id'
const MOCK_NEW_MEMBER_ID_PREFIX = 'mock-member-'
export const MOCK_LINE_MEMBER_ID = 'mock-line-member'
const MOCK_OTP_RESEND_SECONDS = 60
const MOCK_OTP_EXPIRES_SECONDS = 5 * 60
const MOCK_WELCOME_BONUS_POINTS = 50
const MOCK_CURRENT_TERMS_VERSION = '1.2'

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
  consents: MemberConsents
  consentHistory: ConsentHistoryEntry[]
  privacyRequests: PrivacyRequests
  pointsBalance: number
  qualifyingSpendBaht: number
  qualifyingPoints: number
  onboardingCompletedAt: string | null
  isLineOfficialAccountFriend: boolean
}

function addOneYear(date: Date) {
  const nextYear = new Date(date)
  nextYear.setFullYear(date.getFullYear() + 1)
  return nextYear
}

function recordConsent(member: MockMemberRecord, purpose: ConsentPurpose, granted: boolean, recordedAt: string) {
  member.consentHistory.push({ id: `consent-${member.consentHistory.length + 1}`, purpose, granted, recordedAt })
}

function createSeededMemberRecord(): MockMemberRecord {
  return {
    profile: {
      id: MOCK_SEEDED_MEMBER_ID,
      firstName: 'มายด์',
      lastName: 'ใจดี',
      phone: '081-234-4521',
      isPhoneVerified: true,
      email: 'mind.jaidee@example.com',
      birthDate: '1996-02-14',
      gender: 'female',
      petOwnership: 'both',
      avatarUrl: null,
      memberCode: 'YY-204518',
      tier: 'Buddy',
      joinedAt: '2026-08-12',
      lineAccount: {
        displayName: 'Mind',
        pictureUrl: '/pets/khanompang-siamese-cat.jpg',
        linkedAt: '2026-02-14T10:22:00+07:00'
      },
      birthDateChangeAvailableAt: null
    },
    notificationPreferences: {
      topics: {
        pointsAndOrders: { line: true, web: true },
        redemptionAndShipping: { line: true, web: true },
        expiry: { line: true, web: true },
        tierAndTopSpender: { line: false, web: true },
        promotions: { line: false, web: false }
      }
    },
    consents: {
      terms: { version: MOCK_CURRENT_TERMS_VERSION, acceptedAt: '2026-02-14T10:22:00+07:00' },
      marketing: { granted: true, updatedAt: '2026-02-14T10:22:00+07:00' },
      petData: { granted: true, updatedAt: '2026-02-14T10:22:00+07:00' }
    },
    consentHistory: [
      { id: 'consent-1', purpose: 'marketing', granted: true, recordedAt: '2026-02-14T10:22:00+07:00' },
      { id: 'consent-2', purpose: 'petData', granted: true, recordedAt: '2026-02-14T10:22:00+07:00' }
    ],
    privacyRequests: { dataExportRequestedAt: null, accountDeletionRequestedAt: null },
    pointsBalance: 1280,
    qualifyingSpendBaht: 12800,
    qualifyingPoints: 1280,
    onboardingCompletedAt: '2026-08-12',
    isLineOfficialAccountFriend: false
  }
}

// A member who just signed up by phone: the backend has only the verified phone number so far
function createNewMemberRecord(memberId: string, sequence: number): MockMemberRecord {
  // A LINE sign-up arrives with a LINE profile but no phone; a phone sign-up is the reverse
  const isLineSignUp = memberId === MOCK_LINE_MEMBER_ID
  return {
    profile: {
      id: memberId,
      firstName: '',
      lastName: '',
      phone: isLineSignUp ? '' : formatThaiMobile(memberId.slice(MOCK_NEW_MEMBER_ID_PREFIX.length)),
      isPhoneVerified: !isLineSignUp,
      email: null,
      birthDate: null,
      gender: null,
      petOwnership: null,
      avatarUrl: null,
      memberCode: `YY-${String(300000 + sequence)}`,
      tier: 'Puppy',
      joinedAt: new Date().toISOString().slice(0, 10),
      lineAccount: isLineSignUp ? { displayName: 'Mind', pictureUrl: null, linkedAt: new Date().toISOString() } : null,
      birthDateChangeAvailableAt: null
    },
    notificationPreferences: {
      topics: {
        pointsAndOrders: { line: true, web: true },
        redemptionAndShipping: { line: true, web: true },
        expiry: { line: true, web: true },
        tierAndTopSpender: { line: true, web: true },
        promotions: { line: false, web: false }
      }
    },
    consents: {
      terms: null,
      marketing: { granted: false, updatedAt: null },
      petData: { granted: false, updatedAt: null }
    },
    consentHistory: [],
    privacyRequests: { dataExportRequestedAt: null, accountDeletionRequestedAt: null },
    pointsBalance: 0,
    qualifyingSpendBaht: 0,
    qualifyingPoints: 0,
    onboardingCompletedAt: null,
    // LINE Login can add the official account as a friend in the same consent screen
    isLineOfficialAccountFriend: isLineSignUp
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
      const member = getMember(memberId)
      const isRequired = member.onboardingCompletedAt === null
      return {
        isRequired,
        welcomeBonusPoints: isRequired ? MOCK_WELCOME_BONUS_POINTS : 0,
        // Terms and privacy are accepted on the sign-in screen before an account can be created
        hasAcceptedPrivacyPolicy: true,
        signUpMethod: member.profile.lineAccount && !member.profile.isPhoneVerified ? 'line' : 'phone',
        lineProfile: member.profile.lineAccount
          ? { displayName: member.profile.lineAccount.displayName, pictureUrl: member.profile.lineAccount.pictureUrl }
          : null,
        isLineOfficialAccountFriend: member.isLineOfficialAccountFriend
      }
    },

    async requestPhoneVerification(memberId, phone) {
      const isTakenByAnotherMember = [...members.entries()].some(([otherId, other]) =>
        otherId !== memberId && other.profile.isPhoneVerified && digitsOnly(other.profile.phone) === digitsOnly(phone)
      )
      if (isTakenByAnotherMember) throw new Error('phone_in_use')
      return { resendAfterSeconds: MOCK_OTP_RESEND_SECONDS, expiresInSeconds: MOCK_OTP_EXPIRES_SECONDS }
    },

    // Mock accepts any 6-digit code
    async verifyPhone(memberId, phone, code) {
      if (!/^\d{6}$/.test(code)) throw new Error('invalid_otp')
      const member = getMember(memberId)
      member.profile = { ...member.profile, phone: formatThaiMobile(phone), isPhoneVerified: true }
      return member.profile
    },

    async completeOnboarding(memberId, onboarding) {
      const member = getMember(memberId)
      if (member.onboardingCompletedAt) return { awardedPoints: 0 }
      if (!member.profile.isPhoneVerified) throw new Error('phone_not_verified')

      // TODO: the backend should credit the referrer when referralCode is valid; the mock ignores it
      const { firstName, lastName, birthDate, email, marketingOptIn } = onboarding
      member.profile = { ...member.profile, firstName, lastName, birthDate, email }
      const answeredAt = new Date().toISOString()
      member.consents = {
        ...member.consents,
        terms: { version: MOCK_CURRENT_TERMS_VERSION, acceptedAt: answeredAt },
        marketing: { granted: marketingOptIn, updatedAt: answeredAt }
      }
      recordConsent(member, 'marketing', marketingOptIn, answeredAt)
      if (marketingOptIn) {
        member.notificationPreferences = {
          topics: { ...member.notificationPreferences.topics, promotions: { line: true, web: true } }
        }
      }
      member.pointsBalance += MOCK_WELCOME_BONUS_POINTS
      member.onboardingCompletedAt = new Date().toISOString()
      return { awardedPoints: MOCK_WELCOME_BONUS_POINTS }
    },

    async getProfile(memberId) {
      return getMember(memberId).profile
    },

    async updateProfile(memberId, update) {
      const member = getMember(memberId)
      const previousBirthDate = member.profile.birthDate
      const isChangingBirthDate = previousBirthDate !== null && update.birthDate !== previousBirthDate
      const changeAvailableAt = member.profile.birthDateChangeAvailableAt
      if (isChangingBirthDate && changeAvailableAt && new Date(changeAvailableAt) > new Date()) {
        throw new Error('birth_date_change_locked')
      }

      member.profile = {
        ...member.profile,
        ...update,
        birthDateChangeAvailableAt: isChangingBirthDate ? addOneYear(new Date()).toISOString() : changeAvailableAt
      }
      return member.profile
    },

    async applyLinePictureAsAvatar(memberId) {
      const member = getMember(memberId)
      const linePictureUrl = member.profile.lineAccount?.pictureUrl
      if (linePictureUrl) member.profile = { ...member.profile, avatarUrl: linePictureUrl }
      return member.profile
    },

    // Mock only: a blob URL lives in this browser tab, the real upload goes to storage
    async uploadAvatar(memberId, file) {
      const member = getMember(memberId)
      member.profile = { ...member.profile, avatarUrl: URL.createObjectURL(file) }
      return member.profile
    },

    async getNotificationPreferences(memberId) {
      return structuredClone(getMember(memberId).notificationPreferences)
    },

    async updateNotificationPreferences(memberId, preferences) {
      const member = getMember(memberId)
      member.notificationPreferences = structuredClone(preferences)
      return structuredClone(member.notificationPreferences)
    },

    async getConsents(memberId) {
      return structuredClone(getMember(memberId).consents)
    },

    async setConsent(memberId, purpose, granted) {
      const member = getMember(memberId)
      const recordedAt = new Date().toISOString()
      member.consents = { ...member.consents, [purpose]: { granted, updatedAt: recordedAt } }
      recordConsent(member, purpose, granted, recordedAt)
      return structuredClone(member.consents)
    },

    async getConsentHistory(memberId) {
      return [...getMember(memberId).consentHistory].sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))
    },

    async getPrivacyRequests(memberId) {
      return { ...getMember(memberId).privacyRequests }
    },

    async requestDataExport(memberId) {
      const member = getMember(memberId)
      member.privacyRequests = { ...member.privacyRequests, dataExportRequestedAt: new Date().toISOString() }
      return { ...member.privacyRequests }
    },

    async requestAccountDeletion(memberId) {
      const member = getMember(memberId)
      member.privacyRequests = { ...member.privacyRequests, accountDeletionRequestedAt: new Date().toISOString() }
      return { ...member.privacyRequests }
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
