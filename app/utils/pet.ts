import type { PetSpecies } from '~/types/pet'

export const petSpeciesLabels: Record<PetSpecies, string> = {
  dog: 'สุนัข',
  cat: 'แมว',
  rabbit: 'กระต่าย',
  other: 'สัตว์เลี้ยง'
}

export const petSpeciesIcons: Record<PetSpecies, string> = {
  dog: 'lucide:dog',
  cat: 'lucide:cat',
  rabbit: 'lucide:rabbit',
  other: 'lucide:paw-print'
}

// TODO: confirm the breed lists with the business team; species without a list get a free-text field
export const petBreedsBySpecies: Record<PetSpecies, string[]> = {
  dog: ['โกลเด้น รีทรีฟเวอร์', 'ชิวาวา', 'ชิสุ', 'ไซบีเรียน ฮัสกี้', 'บางแก้ว', 'ปอมเมอเรเนียน', 'พุดเดิ้ล', 'เฟรนช์ บูลด็อก', 'ลาบราดอร์ รีทรีฟเวอร์', 'คอร์กี้', 'ไทยหลังอาน', 'พันธุ์ผสม'],
  cat: ['วิเชียรมาศ', 'สีสวาด', 'ขาวมณี', 'เปอร์เซีย', 'สก็อตติช โฟลด์', 'บริติช ช็อตแฮร์', 'อเมริกัน ช็อตแฮร์', 'เมนคูน', 'เบงกอล', 'แร็กดอลล์', 'พันธุ์ผสม'],
  rabbit: ['ฮอลแลนด์ ลอป', 'เนเธอร์แลนด์ ดวอร์ฟ', 'ไลอ้อนเฮด', 'มินิ เร็กซ์', 'ไทย', 'พันธุ์ผสม'],
  other: []
}
