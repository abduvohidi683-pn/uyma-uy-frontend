const uz = {
  "auth.visual.eyebrow": "Ko'chmas mulk platformasi",
  "auth.visual.title": "Yangi hayotingiz shu yerdan boshlanadi.",
  "auth.visual.text":
    "Uy sotib oling, ijaraga oling yoki o'z mulkingizni minglab odamlarga ko'rsating.",
  "auth.email": "Email",
  "auth.emailPh": "Emailingizni kiriting",
  "auth.password": "Parol",
  "auth.passwordPh": "Parolingizni kiriting",
  "auth.passwordHint": "Kamida 8 ta belgi",
  "auth.showPassword": "Parolni ko'rsatish",
  "auth.hidePassword": "Parolni yashirish",

  "auth.login.title": "Xush kelibsiz",
  "auth.login.subtitle": "Hisobingizga kirish uchun ma'lumotlaringizni kiriting.",
  "auth.login.submit": "Kirish",
  "auth.login.loading": "Kirilmoqda...",
  "auth.login.noAccount": "Hisobingiz yo'qmi?",
  "auth.login.fail": "Email yoki parol noto'g'ri.",

  "auth.register.title": "Ro'yxatdan o'tish",
  "auth.register.subtitle":
    "Hisob yarating: e'lonlarni saqlang, murojaat yuboring va o'z e'lonlaringizni joylang.",
  "auth.register.fullName": "To'liq ism",
  "auth.register.fullNamePh": "Ism Familiya",
  "auth.register.phone": "Telefon (ixtiyoriy)",
  "auth.register.submit": "Ro'yxatdan o'tish",
  "auth.register.loading": "Yuklanmoqda...",
  "auth.register.haveAccount": "Akkauntingiz bormi?",
  "auth.register.phoneFormat": "Telefon formati: +998901234567",
  "auth.register.fail": "Ro'yxatdan o'tishda xatolik yuz berdi.",
} as const;

const ru: Record<keyof typeof uz, string> = {
  "auth.visual.eyebrow": "Платформа недвижимости",
  "auth.visual.title": "Ваша новая жизнь начинается здесь.",
  "auth.visual.text":
    "Покупайте, снимайте или покажите свою недвижимость тысячам людей.",
  "auth.email": "Email",
  "auth.emailPh": "Введите ваш email",
  "auth.password": "Пароль",
  "auth.passwordPh": "Введите пароль",
  "auth.passwordHint": "Не менее 8 символов",
  "auth.showPassword": "Показать пароль",
  "auth.hidePassword": "Скрыть пароль",

  "auth.login.title": "Добро пожаловать",
  "auth.login.subtitle": "Введите данные, чтобы войти в аккаунт.",
  "auth.login.submit": "Войти",
  "auth.login.loading": "Вход...",
  "auth.login.noAccount": "Нет аккаунта?",
  "auth.login.fail": "Неверный email или пароль.",

  "auth.register.title": "Регистрация",
  "auth.register.subtitle":
    "Создайте аккаунт: сохраняйте объявления, отправляйте запросы и размещайте свои.",
  "auth.register.fullName": "Полное имя",
  "auth.register.fullNamePh": "Имя Фамилия",
  "auth.register.phone": "Телефон (необязательно)",
  "auth.register.submit": "Зарегистрироваться",
  "auth.register.loading": "Загрузка...",
  "auth.register.haveAccount": "Уже есть аккаунт?",
  "auth.register.phoneFormat": "Формат телефона: +998901234567",
  "auth.register.fail": "Ошибка при регистрации.",
};

const en: Record<keyof typeof uz, string> = {
  "auth.visual.eyebrow": "Real estate marketplace",
  "auth.visual.title": "Your new life starts right here.",
  "auth.visual.text":
    "Buy, rent, or show your property to thousands of people.",
  "auth.email": "Email",
  "auth.emailPh": "Enter your email",
  "auth.password": "Password",
  "auth.passwordPh": "Enter your password",
  "auth.passwordHint": "At least 8 characters",
  "auth.showPassword": "Show password",
  "auth.hidePassword": "Hide password",

  "auth.login.title": "Welcome back",
  "auth.login.subtitle": "Enter your details to log in to your account.",
  "auth.login.submit": "Log in",
  "auth.login.loading": "Logging in...",
  "auth.login.noAccount": "Don't have an account?",
  "auth.login.fail": "Incorrect email or password.",

  "auth.register.title": "Sign up",
  "auth.register.subtitle":
    "Create an account: save listings, send inquiries and post your own.",
  "auth.register.fullName": "Full name",
  "auth.register.fullNamePh": "First Last",
  "auth.register.phone": "Phone (optional)",
  "auth.register.submit": "Sign up",
  "auth.register.loading": "Loading...",
  "auth.register.haveAccount": "Already have an account?",
  "auth.register.phoneFormat": "Phone format: +998901234567",
  "auth.register.fail": "Registration failed.",
};

export const auth = { uz, ru, en };
