# YoyoPet design system


Tailwind's default palette is disabled (`--color-*: initial`), so classes like `text-gray-500` or `bg-red-500` won't generate. Use only these tokens:

| Token | Hex | Thai name | Use |
|---|---|---|---|
| `primary` | `#ED492E` | แดงหลัก | Brand, navbar, primary CTA. Also the logo background, so keep them identical |
| `primary-dark` | `#C93A22` | แดงเข้ม | Hover or pressed state on primary, emphasis |
| `primary-soft` | `#FDE8E3` | ชมพูอ่อน | Soft badges, icon tiles, hover on white buttons |
| `cream` | `#FFF8F5` | ครีม | Soft section and card backgrounds |
| `ink` | `#2A1D1A` | ตัวอักษร | Default text |
| `cocoa` | `#2C1F1D` | น้ำตาลเข้ม | Dark surfaces (e.g. the dark order-entry card) |
| `muted` | `#6E5A55` | ข้อความรอง | Secondary text, captions |
| `border` | `#EFE2DE` | เส้น | Borders and dividers (also the default `border` color) |
| `success` | `#2F7A3A` | สำเร็จ | Success states |
| `pending` | `#8A5A00` | รอ | Pending or awaiting states |
| `gold` | `#FFD43B` | ทอง | Points star, notification dot, highlights |
| `line-green` | `#06C755` | LINE | LINE brand only (connect or log in with LINE) |
| `medal-gold` / `medal-silver` / `medal-bronze` | `#F2B705` / `#AEB8C2` / `#D08A4C` | เหรียญ | Leaderboard rank 1–3 badges only |
| `white` | `#FFFFFF` | | Surfaces. On `primary`, translucent white (`bg-white/15`, hover `/25`) gives the navbar pills and bell their lighter red. Don't add a separate color for it |

Fonts (loaded in `nuxt.config.ts` under `fonts.families`):

| Class | Font | Use | Weight · size |
|---|---|---|---|
| `font-heading` | Mitr | Headings, important buttons | Medium 500 · 18–26px |
| `font-sans` (default) | Anuphan | Body text, labels, buttons | 400–600 · 11–16px |
| `font-number` | Fredoka | Point numbers and codes (`1,280`, `YY-204518`) | Semibold 600 · 13–44px |

- `h1`–`h6` get `font-heading font-medium` by default in the base layer.
- **Mitr's digit 0 looks wrong.** Headings that contain digits must use Anuphan 600 instead: `class="font-sans font-semibold"`.
- **Fredoka has no `฿` and no Thai glyphs.** Write "บาท" instead of `฿`. Wrap only the number in `font-number` and keep units like "แต้ม" outside that span.
- Only the weights listed above are loaded. Don't use `font-bold`, `font-extrabold`, or any other unlisted weight, because the browser would fake it.

