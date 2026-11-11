import type { FaqItem, PointsEarningRule } from '~/types/help'

export interface HelpRepository {
  getFaqs(): Promise<FaqItem[]>
  getPointsEarningRule(): Promise<PointsEarningRule>
}

// TODO: confirm the FAQ answers and earning rate with the YoYo team before launch
export function createMockHelpRepository(): HelpRepository {
  return {
    async getFaqs() {
      return [
        {
          id: 'faq-membership-fee',
          question: 'สมัครสมาชิกต้องเสียค่าใช้จ่ายไหม?',
          summary: 'ไม่มีค่าใช้จ่าย สมัครผ่าน LINE หรือเบอร์โทรได้ทันที',
          answer: 'สมัครสมาชิก YoYo Member ได้ฟรี ไม่มีค่าธรรมเนียมรายปี เพียงเข้าสู่ระบบด้วย LINE หรือยืนยันเบอร์โทรศัพท์ด้วยรหัส OTP ก็เริ่มสะสมแต้มได้เลย'
        },
        {
          id: 'faq-duplicate-order',
          question: 'กรอกเลขคำสั่งซื้อซ้ำได้ไหม?',
          summary: 'เลขคำสั่งซื้อ 1 เลข สะสมแต้มได้ครั้งเดียว',
          answer: 'แต่ละเลขคำสั่งซื้อใช้สะสมแต้มได้เพียงบัญชีเดียวและครั้งเดียว หากกรอกเลขที่เคยใช้แล้ว ระบบจะแจ้งว่าเลขนี้ถูกใช้สะสมแต้มไปแล้ว'
        },
        {
          id: 'faq-points-expiry',
          question: 'แต้มมีวันหมดอายุไหม?',
          summary: 'แต้มมีอายุ 12 เดือนนับจากวันที่ได้รับ',
          answer: 'แต้มแต่ละก้อนมีอายุ 12 เดือนนับจากวันที่แต้มเข้าบัญชี ระบบจะแจ้งเตือนผ่าน LINE ก่อนแต้มหมดอายุ และดูวันหมดอายุได้ที่หน้าแรกหรือประวัติแต้ม'
        },
        {
          id: 'faq-refund',
          question: 'ยกเลิกหรือคืนสินค้า แต้มจะเป็นยังไง?',
          summary: 'ระบบหักแต้มของคำสั่งซื้อนั้นออกอัตโนมัติ',
          answer: 'เมื่อคำสั่งซื้อถูกยกเลิกหรือคืนสินค้าบนแพลตฟอร์ม ระบบจะหักแต้มที่ได้จากคำสั่งซื้อนั้นออกโดยอัตโนมัติ หากแต้มยังอยู่ระหว่างตรวจสอบ คำสั่งซื้อจะไม่ได้รับแต้ม'
        },
        {
          id: 'faq-tier',
          question: 'ระดับสมาชิกคิดยังไง?',
          summary: 'คิดจากยอดซื้อสะสมย้อนหลัง 12 เดือน ปรับทุกต้นเดือน',
          answer: 'ระดับสมาชิกคำนวณจากยอดซื้อสะสม 12 เดือนล่าสุด และปรับระดับทุกวันที่ 1 ของเดือน ระดับที่สูงขึ้นจะได้ตัวคูณแต้มและสิทธิพิเศษมากขึ้น'
        },
        {
          id: 'faq-cancel-redemption',
          question: 'แลกของรางวัลแล้วยกเลิกได้ไหม?',
          summary: 'แลกแล้วยกเลิกหรือคืนแต้มไม่ได้',
          answer: 'เมื่อยืนยันการแลกของรางวัลแล้ว จะยกเลิกหรือขอคืนแต้มไม่ได้ กรุณาตรวจสอบของรางวัลและที่อยู่จัดส่งให้ถูกต้องก่อนกดยืนยัน'
        }
      ]
    },

    async getPointsEarningRule() {
      return {
        bahtPerPoint: 100,
        tierMultipliers: [
          { tier: 'Buddy', multiplier: 1.2 },
          { tier: 'Best Friend', multiplier: 1.5 },
          { tier: 'Family', multiplier: 2 }
        ]
      }
    }
  }
}
