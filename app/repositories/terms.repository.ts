import type { MembershipTermsDocument, MembershipTermsSection, MembershipTermsVersion } from '~/types/terms'

export interface TermsRepository {
  // Newest first; the first entry is the version members accept today
  getMembershipTermsVersions(): Promise<MembershipTermsVersion[]>
  getMembershipTerms(version: string): Promise<MembershipTermsDocument | null>
}

// TODO: replace with the store's final wording; every version below is sample text
const currentSections: MembershipTermsSection[] = [
  {
    id: 'points',
    topic: 'points',
    title: 'การสะสมแต้ม',
    terms: [
      'ทุกยอดซื้อ 100 บาท (ไม่รวมค่าส่ง) ได้ 1 แต้ม',
      'กรอกเลขคำสั่งซื้อได้ภายใน 30 วันหลังได้รับสินค้า',
      'เลขคำสั่งซื้อ 1 เลขใช้ได้ครั้งเดียวทั้งระบบ',
      'แต้มเข้าหลังพ้นระยะคืนสินค้า 7 วัน'
    ]
  },
  {
    id: 'points-expiry',
    topic: 'points',
    title: 'อายุแต้ม',
    terms: [
      'แต้มแต่ละก้อนมีอายุ 12 เดือนนับจากวันที่ได้รับ',
      'ตอนแลกระบบตัดก้อนที่จะหมดอายุก่อน'
    ]
  },
  {
    id: 'redemption',
    topic: 'redemption',
    title: 'การแลกของรางวัล',
    terms: [
      'หักแต้มทันทีเมื่อยืนยัน ยกเลิกเองไม่ได้',
      'หากร้านยกเลิก ระบบคืนแต้มอัตโนมัติ'
    ]
  },
  {
    id: 'cancellation',
    topic: 'points',
    title: 'การยกเลิกและคืนสินค้า',
    terms: [
      'คำสั่งซื้อที่คืนสินค้า ระบบหักแต้มคืน',
      'แต้มคงเหลืออาจติดลบได้หากใช้ไปแล้ว'
    ]
  },
  {
    id: 'coupons',
    topic: 'coupons',
    title: 'คูปอง',
    terms: [
      'คูปองแต่ละใบใช้ได้ตามเงื่อนไขและวันหมดอายุที่ระบุบนคูปอง',
      'คูปองที่หมดอายุแล้วใช้ไม่ได้และแลกคืนเป็นแต้มไม่ได้'
    ]
  },
  {
    id: 'tiers',
    topic: 'tiers',
    title: 'ระดับสมาชิก',
    terms: [
      'ระดับคิดจากยอดซื้อสะสม 12 เดือนล่าสุด ปรับทุกวันที่ 1 ของเดือน',
      'ระดับที่สูงขึ้นได้ตัวคูณแต้มและสิทธิพิเศษมากขึ้น'
    ]
  }
]

const mockTermsDocuments: MembershipTermsDocument[] = [
  { version: '1.2', effectiveAt: '2026-11-01', isSampleText: true, sections: currentSections },
  {
    version: '1.1',
    effectiveAt: '2026-02-01',
    isSampleText: true,
    sections: currentSections.map(section => section.id === 'points'
      ? { ...section, terms: section.terms.map(term => term.replace('7 วัน', '15 วัน')) }
      : section)
  }
]

export function createMockTermsRepository(): TermsRepository {
  return {
    async getMembershipTermsVersions() {
      return mockTermsDocuments.map(({ version, effectiveAt }) => ({ version, effectiveAt }))
    },

    async getMembershipTerms(version) {
      return mockTermsDocuments.find(document => document.version === version) ?? null
    }
  }
}
