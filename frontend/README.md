# Uy-bozor — Ko'chmas mulk e'lonlari (Frontend)

Sotuv (SALE) va ijara (RENT) e'lonlari platformasining frontend qismi. Foydalanuvchilar e'lonlarni ko'radi, qidiradi, filterlaydi, sevimlilarga saqlaydi va sellerga murojaat yuboradi. Seller o'z e'lonlarini va unga kelgan murojaatlarni boshqaradi, Admin e'lonlarni moderatsiya qiladi.

Frontend haqiqiy backend API bilan ishlaydi (mock data yo'q).

- **Backend:** NestJS + PostgreSQL + Prisma (`uyma-uy-server`)
- **Deploy qilingan backend:** https://uyma-uy-server-production.up.railway.app
- **Frontend deploy:** Vercel _(havolani deploy'dan keyin shu yerga yozing)_

## Jamoa va rollar

| A'zo | Rol |
| --- | --- |
| _Ism Familiya_ | _Frontend / Backend_ |
| _Ism Familiya_ | _..._ |

> Topshirishdan oldin jamoa a'zolari bilan to'ldiring.

## Stack

- React 19 + TypeScript, Vite
- Tailwind CSS v4 (dizayn tokenlari: `src/tokens.css`)
- React Router (sahifalar `lazy` bilan alohida bo'lak sifatida yuklanadi; guard'lar: `ProtectedRoute`, `AdminGuard`)
- Axios (JWT interceptor, 401 → login'ga yo'naltirish)
- lucide-react (ikonlar)
- O'zimizning yengil i18n tizimi (qo'shimcha kutubxonasiz): **UZ / RU / EN**
- Yorug' / qorong'u rejim (tanlov `localStorage`'da saqlanadi)

## Ishga tushirish

```bash
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm run dev            # http://localhost:5173
```

Boshqa buyruqlar:

```bash
npm run build     # tsc + production build (dist/)
npm run preview   # production build'ni lokal ko'rish
npm run lint      # oxlint
```

### `.env` o'zgaruvchilari

| O'zgaruvchi | Tavsif | Misol |
| --- | --- | --- |
| `VITE_API_URL` | Backend manzili (oxirida `/` siz) | `http://localhost:3000` |

Backend CORS faqat o'zining `CORS_ORIGINS` sozlamasidagi originlarga ruxsat beradi. Dev server **5173** portida ishlashi kerak; deploy qilingan frontend manzili (masalan, Vercel domeni) backend `CORS_ORIGINS`'ga qo'shilishi shart.

## Deploy (Vercel)

1. Repo'ni Vercel'ga import qiling.
2. **Root Directory:** `frontend`. Framework — Vite (build: `npm run build`, output: `dist`).
3. Environment Variables: `VITE_API_URL=https://uyma-uy-server-production.up.railway.app`
4. `vercel.json` barcha yo'llarni `index.html`'ga yo'naltiradi, shuning uchun sahifani yangilaganda (`/properties/5` kabi) 404 chiqmaydi.
5. Deploy bo'lgach domenni backend `CORS_ORIGINS`'ga qo'shing.

## Sahifalar

| Sahifa | Route | Kirish |
| --- | --- | --- |
| Bosh sahifa (yangi e'lonlar, kategoriyalar) | `/` | Guest |
| E'lonlar ro'yxati (filter, sort, pagination — URL'da saqlanadi) | `/properties` | Guest |
| E'lon tafsiloti, ♥, rasm galereyasi (lightbox), murojaat formasi | `/properties/:id` | Guest (♥ va murojaat uchun login) |
| Ro'yxatdan o'tish / Kirish | `/register`, `/login` | Guest |
| Boshqaruv (kabinet umumiy ko'rinishi) | `/dashboard` | Login |
| Profil | `/profile` | Login |
| Mening e'lonlarim | `/my-properties` | Login |
| E'lon yaratish / tahrirlash | `/create-property`, `/edit-property/:id` | Login (tahrirlash — faqat egasi) |
| Sevimlilar | `/favorites` | Login |
| Yuborgan murojaatlarim | `/my-inquiries` (`/inquiries` shunga yo'naltiriladi) | Login |
| Menga kelgan murojaatlar | `/received-inquiries` | Login |
| Admin: dashboard, e'lonlar moderatsiyasi, kategoriyalar, foydalanuvchilar | `/admin`, `/admin/properties`, `/admin/categories`, `/admin/users` | Faqat ADMIN (aks holda 403 holati) |

Kabinet sahifalari chap sidebar'li umumiy maketda (`DashboardLayout`) ochiladi. Barcha ro'yxatlarda loading (skeleton) / empty / error holatlari bor; noma'lum URL — 404 sahifa.

## Loyiha tuzilishi

```
src/
├── components/   # Navbar, PropertyCard, PropertyForm, ImagePicker, Lightbox, guard'lar, ...
├── context/      # AuthContext (token, user, /auth/me bilan tiklash), favorites
├── hooks/        # useDebounce
├── i18n/         # translations.ts, dict/ (uz, ru, en matnlari bo'limlar bo'yicha)
├── pages/        # Home, Properties, PropertyDetail, Dashboard, Admin/, ...
├── services/     # API chaqiruvlari (axios): auth, property, image, inquiry, favorite, admin, ...
├── types/        # API javoblari uchun TypeScript turlari
├── utils/        # format.ts, apiErrors.ts
├── tokens.css    # ranglar, shriftlar (Charcoal / Bronze / Ivory / Sage)
└── base.css, index.css
```

## API shartnomasi (frontend nimaga tayanadi)

- Auth: `Authorization: Bearer <accessToken>`; token `localStorage`'da, sahifa yangilanganda user `GET /auth/me` bilan tiklanadi.
- `POST /auth/register` token qaytarmaydi — ro'yxatdan o'tgach login sahifasiga yo'naltiriladi.
- Pagination: `{ data, meta: { page, limit, total, totalPages } }`.
- Xatolar: NestJS formati; `message` matn yoki massiv. 400 massivi maydonlarga bo'linib, maydon ostida ko'rsatiladi (`src/utils/apiErrors.ts`).
- Kategoriya filteri `category` parametrida **slug** orqali yuboriladi.
- Rasm yuklash: `POST /properties/:id/images` — `multipart/form-data`, maydon nomi `image`, har so'rovda 1 ta fayl (jpg/png/webp, 5 MB gacha). Rasm URL'i: `VITE_API_URL + image.url`.
- Murojaatlar: `POST /properties/:id/inquiries` (yuborish), `GET /inquiries/my` (yuborganlarim), `GET /inquiries/received` (menga kelganlar).
- E'lonni tahrirlash uni qayta `PENDING` holatiga o'tkazadi (backend qoidasi).

## Test hisoblar

> Demo uchun hisoblarni shu yerga yozing (faqat test ma'lumotlari uchun parollar).

| Rol | Email | Parol |
| --- | --- | --- |
| Admin | _…_ | _…_ |
| Seller | _…_ | _…_ |

## Screenshotlar

> Asosiy sahifalar screenshotlarini `docs/` papkasiga qo'yib, shu yerga ulang.

## Cheklovlar

- Birinchi so'rov backend uyg'onishi sababli sekin bo'lishi mumkin.
- Yuklangan rasmlar backend diskida saqlanadi (Railway'da `/app/uploads` uchun Volume kerak); Volume bo'lmasa redeploy'dan keyin rasmlar yo'qolishi mumkin.
- Tarjimalar interfeys matnlari uchun; e'lon sarlavhasi va tavsifi foydalanuvchi kiritgan tilda qoladi.

## Tashqi manbalar

Tayyor template ishlatilmagan. Ikonlar — [lucide](https://lucide.dev), loyiha skeleti — Vite React-TS shabloni, shriftlar — Fontshare (Sentient) va Google Fonts (Hanken Grotesk).
