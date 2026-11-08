# Uyma-uy — Ko'chmas mulk e'lonlari (Frontend)

Sotuv (SALE) va ijara (RENT) e'lonlari platformasining frontend qismi. Foydalanuvchilar e'lonlarni ko'radi, qidiradi, filterlaydi, sevimlilarga saqlaydi va sellerga murojaat yuboradi. Seller o'z e'lonlarini boshqaradi, Admin e'lonlarni moderatsiya qiladi.

Frontend haqiqiy backend API bilan ishlaydi (mock data yo'q).

- **Backend:** NestJS + PostgreSQL + Prisma (`uyma-uy-server`)
- **Deploy qilingan backend:** https://uyma-uy-server.onrender.com

## Jamoa va rollar

| A'zo | Rol |
| --- | --- |
| _Ism Familiya_ | _Frontend / Backend_ |
| _Ism Familiya_ | _..._ |
| _Ism Familiya_ | _..._ |

> README'ni topshirishdan oldin jamoa a'zolari bilan to'ldiring.

## Stack

- React 19 + TypeScript, Vite
- React Router (route guard'lar: `ProtectedRoute`, `AdminGuard`)
- Axios (JWT interceptor, 401 → login'ga yo'naltirish)
- lucide-react (ikonlar)

## Ishga tushirish

```bash
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm run dev            # http://localhost:5173
```

Boshqa buyruqlar:

```bash
npm run build   # tsc + production build
npm run lint    # oxlint
```

### `.env` o'zgaruvchilari

| O'zgaruvchi | Tavsif | Misol |
| --- | --- | --- |
| `VITE_API_URL` | Backend manzili (oxirida `/` siz) | `http://localhost:3000` |

Backend CORS faqat o'zining `CORS_ORIGINS` sozlamasidagi originlarga ruxsat beradi. Frontend boshqa manzilda (masalan, deploy) ishlasa, uni backend `.env`'idagi `CORS_ORIGINS`'ga qo'shing.

## Sahifalar

| Sahifa | Route | Kirish |
| --- | --- | --- |
| Bosh sahifa (yangi e'lonlar, kategoriyalar) | `/` | Guest |
| E'lonlar ro'yxati (filter, sort, pagination — URL'da saqlanadi) | `/properties` | Guest |
| E'lon tafsiloti, ♥, murojaat formasi | `/properties/:id` | Guest (♥ va murojaat uchun login) |
| Ro'yxatdan o'tish / Kirish | `/register`, `/login` | Guest |
| Profil | `/profile` | Login |
| Mening e'lonlarim (seller dashboard) | `/my-properties` | Login |
| E'lon yaratish / tahrirlash | `/create-property`, `/edit-property/:id` | Login (tahrirlash — faqat egasi) |
| Sevimlilar | `/favorites` | Login |
| Mening murojaatlarim | `/my-inquiries` | Login |
| Admin: dashboard, e'lonlar moderatsiyasi, kategoriyalar, foydalanuvchilar | `/admin`, `/admin/properties`, `/admin/categories`, `/admin/users` | Faqat ADMIN (aks holda 403 holati) |

Barcha ro'yxatlarda loading / empty / error holatlari bor; noma'lum URL — 404 sahifa.

## API shartnomasi (frontend nimaga tayanadi)

- Auth: `Authorization: Bearer <accessToken>`; token `localStorage`'da, sahifa yangilanganda user `GET /auth/me` bilan tiklanadi.
- `POST /auth/register` token qaytarmaydi — ro'yxatdan o'tgach login sahifasiga yo'naltiriladi.
- Pagination: `{ data, meta: { page, limit, total, totalPages } }`.
- Xatolar: NestJS formati; `message` matn yoki massiv. 400 massivi maydonlarga bo'linib, maydon ostida ko'rsatiladi (`src/utils/apiErrors.ts`).
- Kategoriya filteri `category` parametrida **slug** orqali yuboriladi.
- Rasm yuklash: `POST /properties/:id/images` — `multipart/form-data`, maydon nomi `image`, har so'rovda 1 ta fayl (jpg/png/webp, 5 MB gacha). Rasm URL'i: `VITE_API_URL + image.url`.
- E'lonni tahrirlash uni qayta `PENDING` holatiga o'tkazadi (backend qoidasi).

## Test hisoblar

> Demo uchun hisoblarni shu yerga yozing (parollarni faqat test ma'lumotlari uchun).

| Rol | Email | Parol |
| --- | --- | --- |
| Admin | _…_ | _…_ |
| Seller | _…_ | _…_ |

## Screenshotlar

> Asosiy sahifalar screenshotlarini `docs/` papkasiga qo'yib, shu yerga ulang.

## Cheklovlar

- Backend Render'ning bepul rejasida: birinchi so'rov uyg'onish uchun sekin bo'lishi mumkin.
- Yuklangan rasmlar backend diskida saqlanadi; Render'da disk vaqtinchalik, shuning uchun redeploy'dan keyin rasmlar yo'qolishi mumkin.
- Backend seller'ga kelgan murojaatlarni ko'rsatuvchi endpoint bermaydi, shuning uchun faqat "Mening murojaatlarim" (yuborilganlari) bor.

## Tashqi manbalar

Tayyor template ishlatilmagan. Ikonlar — [lucide](https://lucide.dev), loyiha skeleti — Vite React-TS shabloni.
