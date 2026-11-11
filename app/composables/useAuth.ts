export interface SignUpConsents {
  acceptedTerms: boolean
  marketingOptIn: boolean
}

const MOCK_MEMBER_ID = 'mock-member-id'
const MOCK_OTP_RESEND_SECONDS = 60
const MOCK_OTP_EXPIRES_SECONDS = 5 * 60
const MOCK_NETWORK_DELAY_MS = 400

function waitForMockNetwork() {
  return new Promise(resolve => setTimeout(resolve, MOCK_NETWORK_DELAY_MS))
}

// TODO: replace with the backend auth session once connected
export function useAuth() {
  const userId = useState<string | null>('auth-user-id', () => MOCK_MEMBER_ID)

  async function signInWithLine(_consents: SignUpConsents) {
    await waitForMockNetwork()
    userId.value = MOCK_MEMBER_ID
  }

  async function requestPhoneOtp(_phone: string) {
    await waitForMockNetwork()
    return { resendAfterSeconds: MOCK_OTP_RESEND_SECONDS, expiresInSeconds: MOCK_OTP_EXPIRES_SECONDS }
  }

  // Mock accepts any 6-digit code
  async function verifyPhoneOtp(_phone: string, code: string, _consents: SignUpConsents) {
    await waitForMockNetwork()
    if (!/^\d{6}$/.test(code)) throw new Error('invalid_otp')
    userId.value = MOCK_MEMBER_ID
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
