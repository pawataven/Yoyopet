import type { MemberDashboard, MemberSummary, TierLevel } from '~/types/member'

export interface MemberRepository {
  getSummary(memberId: string): Promise<MemberSummary | null>
  getDashboard(memberId: string): Promise<MemberDashboard | null>
  getTierLevels(): Promise<TierLevel[]>
}

export function createMockMemberRepository(): MemberRepository {
  return {
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
        displayName: 'มายด์',
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
