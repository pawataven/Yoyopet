import { MOCK_SEEDED_MEMBER_ID } from '~/repositories/member.repository'

export interface SignUpConsents {
  acceptedTerms: boolean
  marketingOptIn: boolean
}

const MOCK_SEEDED_MEMBER_PHONE = '0812344521'
const MOCK_OTP_RESEND_SECONDS = 60
const MOCK_OTP_EXPIRES_SECONDS = 5 * 60
const MOCK_NETWORK_DELAY_MS = 400

function waitForMockNetwork() {
  return new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS))
}

// TODO: replace with the backend auth session once connected
export function useAuth() {
  const userId = useState<string | null>('auth-user-id', () => MOCK_SEEDED_MEMBER_ID)

  async function signInWithLine(_consents: SignUpConsents) {
    await waitForMockNetwork()
    userId.value = MOCK_SEEDED_MEMBER_ID
  }

  async function requestPhoneOtp(_phone: string) {
    await waitForMockNetwork()
    return { resendAfterSeconds: MOCK_OTP_RESEND_SECONDS, expiresInSeconds: MOCK_OTP_EXPIRES_SECONDS }
  }

  // Mock accepts any 6-digit code; any number other than the seeded member's becomes its own new member
  async function verifyPhoneOtp(phone: string, code: string, _consents: SignUpConsents) {
    await waitForMockNetwork()
    if (!/^\d{6}$/.test(code)) throw new Error('invalid_otp')
    userId.value = phone === MOCK_SEEDED_MEMBER_PHONE ? MOCK_SEEDED_MEMBER_ID : `mock-member-${phone}`
  }

  async function signOut() {
    userId.value = null
    await navigateTo('/')
  }

  return {
    userId: readonly(userId),
    isLoggedIn: computed(() => userId.value !== null),
    signInWithLine,
    requestPhoneOtp,
    verifyPhoneOtp,
    signOut
  }
}
