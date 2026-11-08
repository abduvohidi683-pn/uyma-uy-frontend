const uz = {
  "nav.home": "Bosh sahifa",
  "nav.buy": "Sotib olish",
  "nav.rent": "Ijaraga olish",
  "nav.post": "E'lon berish",
  "nav.login": "Kirish",
  "nav.register": "Ro'yxatdan o'tish",
  "nav.cabinet": "Kabinet",
  "nav.profile": "Profil",
  "nav.admin": "Admin panel",
  "nav.logout": "Chiqish",
  "nav.menuOpen": "Menyuni ochish",
  "nav.menuClose": "Menyuni yopish",
  "nav.language": "Til",
  "nav.themeDark": "Qorong'u rejim",
  "nav.themeLight": "Yorug' rejim",

  "footer.desc":
    "O'zbekiston bo'ylab ko'chmas mulklarni oson toping, sotib oling yoki ijaraga bering.",
  "footer.pages": "Sahifalar",
  "footer.account": "Hisob",
  "footer.properties": "Barcha uylar",
  "footer.rights": "Barcha huquqlar himoyalangan",
} as const;

const ru: Record<keyof typeof uz, string> = {
  "nav.home": "Главная",
  "nav.buy": "Купить",
  "nav.rent": "Снять",
  "nav.post": "Разместить объявление",
  "nav.login": "Войти",
  "nav.register": "Регистрация",
  "nav.cabinet": "Кабинет",
  "nav.profile": "Профиль",
  "nav.admin": "Админ-панель",
  "nav.logout": "Выйти",
  "nav.menuOpen": "Открыть меню",
  "nav.menuClose": "Закрыть меню",
  "nav.language": "Язык",
  "nav.themeDark": "Тёмная тема",
  "nav.themeLight": "Светлая тема",

  "footer.desc":
    "Находите, покупайте и сдавайте недвижимость по всему Узбекистану.",
  "footer.pages": "Страницы",
  "footer.account": "Аккаунт",
  "footer.properties": "Все объекты",
  "footer.rights": "Все права защищены",
};

const en: Record<keyof typeof uz, string> = {
  "nav.home": "Home",
  "nav.buy": "Buy",
  "nav.rent": "Rent",
  "nav.post": "Post a listing",
  "nav.login": "Log in",
  "nav.register": "Sign up",
  "nav.cabinet": "Dashboard",
  "nav.profile": "Profile",
  "nav.admin": "Admin panel",
  "nav.logout": "Log out",
  "nav.menuOpen": "Open menu",
  "nav.menuClose": "Close menu",
  "nav.language": "Language",
  "nav.themeDark": "Dark mode",
  "nav.themeLight": "Light mode",

  "footer.desc":
    "Find, buy or rent real estate across Uzbekistan with ease.",
  "footer.pages": "Pages",
  "footer.account": "Account",
  "footer.properties": "All properties",
  "footer.rights": "All rights reserved",
};

export const nav = { uz, ru, en };
