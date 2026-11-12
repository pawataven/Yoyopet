import { useRepositories } from '~/repositories'
import { RewardRedemptionError } from '~/repositories/reward.repository'
import type { RewardRedemptionResult } from '~/types/reward'

const redemptionErrorMessages: Record<RewardRedemptionError['reason'], string> = {
  not_found: 'ไม่พบของรางวัลนี้แล้ว',
  insufficient_points: 'แต้มไม่พอสำหรับจำนวนที่เลือก',
  out_of_stock: 'ของรางวัลเหลือไม่พอสำหรับจำนวนที่เลือก',
  missing_address: 'กรุณาเลือกที่อยู่จัดส่ง'
}

export function useRewardRedemption() {
  const { reward: rewardRepository } = useRepositories()
  const { userId } = useAuth()
  const { refresh: refreshMember } = useMember()

  const isRedeeming = ref(false)
  const errorMessage = ref<string | null>(null)

  async function redeem(rewardId: string, quantity: number, shippingAddressId: string | null): Promise<RewardRedemptionResult | null> {
    if (!userId.value || isRedeeming.value) return null
    isRedeeming.value = true
    errorMessage.value = null
    try {
      const result = await rewardRepository.redeemReward(userId.value, rewardId, quantity, shippingAddressId)
      await refreshMember()
      return result
    } catch (error) {
      errorMessage.value = error instanceof RewardRedemptionError
        ? redemptionErrorMessages[error.reason]
        : 'แลกของรางวัลไม่สำเร็จ ลองใหม่อีกครั้ง'
      return null
    } finally {
      isRedeeming.value = false
    }
  }

  function clearError() {
    errorMessage.value = null
  }

  return { redeem, isRedeeming: readonly(isRedeeming), errorMessage: readonly(errorMessage), clearError }
}
