import type { PointsEarningRule } from '~/types/help'

export interface TermSection {
  title: string
  terms: string[]
}

function buildEarningRateTerms(earningRule: PointsEarningRule | null) {
  if (!earningRule) return []
  const multipliers = earningRule.tierMultipliers
    .map(({ tier, multiplier }) => `${tier} ${formatNumber(multiplier)}`)
    .join(' · ')
  return [
    `ทุกยอดซื้อ ${formatNumber(earningRule.bahtPerPoint)} บาท = 1 แต้ม (ไม่รวมค่าจัดส่ง) ปัดเศษลง`,
    ...(multipliers ? [`ตัวคูณแต้มตามระดับสมาชิก: ${multipliers} เท่า`] : [])
  ]
}

// TODO: confirm the final terms with the YoYo team before launch
export function buildPointsEarningTermSections(earningRule: PointsEarningRule | null): TermSection[] {
  return [
    {
      title: 'การได้รับแต้ม',
      terms: [
        ...buildEarningRateTerms(earningRule),
        'สะสมได้เฉพาะสินค้าจากร้าน YoYo บน Shopee, TikTok Shop และ Lazada'
      ]
    },
    {
      title: 'การกรอกเลขคำสั่งซื้อ',
      terms: [
        'กรอกได้ภายใน 30 วันหลังได้รับสินค้า',
        'เลขคำสั่งซื้อ 1 เลข ใช้สะสมแต้มได้ครั้งเดียว',
        'แต้มใช้ได้เมื่อคำสั่งซื้อสำเร็จและพ้นระยะคืนสินค้า'
      ]
    },
    {
      title: 'การยกเลิกและคืนสินค้า',
      terms: [
        'คำสั่งซื้อที่ยกเลิกหรือคืนสินค้า ระบบจะหักแต้มออกอัตโนมัติ',
        'หากแต้มถูกใช้ไปแล้ว แต้มคงเหลืออาจติดลบได้'
      ]
    },
    {
      title: 'อายุแต้ม',
      terms: [
        'แต้มมีอายุ 12 เดือนนับจากวันที่ได้รับ',
        'บริษัทขอสงวนสิทธิ์เปลี่ยนแปลงเงื่อนไขโดยแจ้งล่วงหน้า 30 วัน'
      ]
    }
  ]
}
