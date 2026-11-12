import type { ReferralSummary } from '~/types/referral'

// TODO: the sign-up flow doesn't read ?ref yet; wire it up when the backend handles referral codes
export function buildReferralSignUpUrl(origin: string, referralCode: string) {
  return `${origin}/login?ref=${encodeURIComponent(referralCode)}`
}

export function buildLineShareUrl(referral: ReferralSummary, signUpUrl?: string) {
  const message = `สมัครสมาชิก YoyoPet ด้วยโค้ด ${referral.referralCode} รับ ${formatNumber(referral.friendRewardPoints)} แต้ม`
  return `https://line.me/R/share?text=${encodeURIComponent(signUpUrl ? `${message}\n${signUpUrl}` : message)}`
}

export function buildFacebookShareUrl(signUpUrl: string) {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(signUpUrl)}`
}
