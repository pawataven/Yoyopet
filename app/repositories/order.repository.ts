import type { PendingOrder } from '~/types/order'

export interface OrderRepository {
  getPendingOrders(memberId: string): Promise<PendingOrder[]>
}

export function createMockOrderRepository(): OrderRepository {
  return {
    async getPendingOrders() {
      return [
        {
          id: 'order-tiktok-576293011',
          marketplaceId: 'tiktok-shop',
          orderNumber: '576293011',
          status: 'in-return-window',
          points: 15,
          expectedCreditDate: '2026-11-16'
        },
        {
          id: 'order-lazada-1029384756',
          marketplaceId: 'lazada',
          orderNumber: '1029384756',
          status: 'verifying',
          points: 7,
          expectedCreditDate: null
        }
      ]
    }
  }
}
