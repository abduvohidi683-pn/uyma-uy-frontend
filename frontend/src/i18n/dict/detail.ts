const uz = {
  "detail.back": "Barcha e'lonlar",
  "detail.notFound.title": "E'lon topilmadi",
  "detail.notFound.text": "E'lon topilmadi yoki hali tasdiqlanmagan.",
  "detail.loadFail": "E'lonni yuklashda xatolik yuz berdi. Qayta urinib ko'ring.",
  "detail.backToList": "E'lonlarga qaytish",
  "detail.about": "Uy haqida",
  "detail.price": "Narxi",
  "detail.owner": "E'lon egasi",
  "detail.call": "Qo'ng'iroq qilish",

  "detail.inquiry.title": "Uy egasiga murojaat",
  "detail.inquiry.loginPre": "Murojaat yuborish uchun",
  "detail.inquiry.loginLink": "tizimga kiring",
  "detail.inquiry.own":
    "Bu sizning e'loningiz. O'z e'loningizga murojaat yubora olmaysiz.",
  "detail.inquiry.phone": "Telefon raqamingiz",
  "detail.inquiry.message": "Xabaringiz",
  "detail.inquiry.messagePh":
    "Assalomu alaykum, uy haqida ma'lumot bersangiz...",
  "detail.inquiry.send": "Murojaat yuborish",
  "detail.inquiry.sending": "Yuborilmoqda...",
  "detail.inquiry.success": "Murojaatingiz muvaffaqiyatli yuborildi!",
  "detail.inquiry.errMessage": "Xabar 10–1000 ta belgidan iborat bo'lishi kerak.",
  "detail.inquiry.errPhone": "Telefon raqamini to'g'ri kiriting (+998901234567).",
  "detail.inquiry.fail": "Murojaat yuborilmadi. Qayta urinib ko'ring.",

  "detail.fav.add": "Sevimlilarga qo'shish",
  "detail.fav.remove": "Sevimlilardan olib tashlash",
  "detail.fav.fail": "Amal bajarilmadi.",

  "detail.admin.title": "Admin amallari",
  "detail.admin.current": "Joriy holat:",
  "detail.admin.approve": "Tasdiqlash",
  "detail.admin.reject": "Rad etish",
  "detail.admin.fail": "Holatni o'zgartirib bo'lmadi.",

  "gallery.open": "Rasmni kattalashtirish",
  "gallery.close": "Yopish",
  "gallery.prev": "Oldingi rasm",
  "gallery.next": "Keyingi rasm",
  "gallery.imageN": "{n}-rasm",
  "gallery.counter": "{i} / {n}",
} as const;

const ru: Record<keyof typeof uz, string> = {
  "detail.back": "Все объявления",
  "detail.notFound.title": "Объявление не найдено",
  "detail.notFound.text": "Объявление не найдено или ещё не одобрено.",
  "detail.loadFail": "Не удалось загрузить объявление. Попробуйте ещё раз.",
  "detail.backToList": "К объявлениям",
  "detail.about": "Об объекте",
  "detail.price": "Цена",
  "detail.owner": "Владелец",
  "detail.call": "Позвонить",

  "detail.inquiry.title": "Написать владельцу",
  "detail.inquiry.loginPre": "Чтобы отправить запрос,",
  "detail.inquiry.loginLink": "войдите в аккаунт",
  "detail.inquiry.own":
    "Это ваше объявление. Вы не можете отправить запрос самому себе.",
  "detail.inquiry.phone": "Ваш телефон",
  "detail.inquiry.message": "Ваше сообщение",
  "detail.inquiry.messagePh": "Здравствуйте, расскажите, пожалуйста, об объекте...",
  "detail.inquiry.send": "Отправить запрос",
  "detail.inquiry.sending": "Отправка...",
  "detail.inquiry.success": "Ваш запрос успешно отправлен!",
  "detail.inquiry.errMessage": "Сообщение должно содержать от 10 до 1000 символов.",
  "detail.inquiry.errPhone": "Введите корректный телефон (+998901234567).",
  "detail.inquiry.fail": "Не удалось отправить запрос. Попробуйте ещё раз.",

  "detail.fav.add": "В избранное",
  "detail.fav.remove": "Убрать из избранного",
  "detail.fav.fail": "Не удалось выполнить действие.",

  "detail.admin.title": "Действия администратора",
  "detail.admin.current": "Текущий статус:",
  "detail.admin.approve": "Одобрить",
  "detail.admin.reject": "Отклонить",
  "detail.admin.fail": "Не удалось изменить статус.",

  "gallery.open": "Увеличить фото",
  "gallery.close": "Закрыть",
  "gallery.prev": "Предыдущее фото",
  "gallery.next": "Следующее фото",
  "gallery.imageN": "Фото {n}",
  "gallery.counter": "{i} / {n}",
};

const en: Record<keyof typeof uz, string> = {
  "detail.back": "All listings",
  "detail.notFound.title": "Listing not found",
  "detail.notFound.text": "The listing was not found or has not been approved yet.",
  "detail.loadFail": "Could not load the listing. Please try again.",
  "detail.backToList": "Back to listings",
  "detail.about": "About this property",
  "detail.price": "Price",
  "detail.owner": "Listed by",
  "detail.call": "Call",

  "detail.inquiry.title": "Contact the owner",
  "detail.inquiry.loginPre": "To send an inquiry,",
  "detail.inquiry.loginLink": "log in",
  "detail.inquiry.own":
    "This is your listing. You cannot send an inquiry to yourself.",
  "detail.inquiry.phone": "Your phone number",
  "detail.inquiry.message": "Your message",
  "detail.inquiry.messagePh": "Hello, could you tell me more about the property...",
  "detail.inquiry.send": "Send inquiry",
  "detail.inquiry.sending": "Sending...",
  "detail.inquiry.success": "Your inquiry was sent successfully!",
  "detail.inquiry.errMessage": "The message must be between 10 and 1000 characters.",
  "detail.inquiry.errPhone": "Enter a valid phone number (+998901234567).",
  "detail.inquiry.fail": "The inquiry could not be sent. Please try again.",

  "detail.fav.add": "Add to favourites",
  "detail.fav.remove": "Remove from favourites",
  "detail.fav.fail": "The action could not be completed.",

  "detail.admin.title": "Admin actions",
  "detail.admin.current": "Current status:",
  "detail.admin.approve": "Approve",
  "detail.admin.reject": "Reject",
  "detail.admin.fail": "Could not change the status.",

  "gallery.open": "Enlarge photo",
  "gallery.close": "Close",
  "gallery.prev": "Previous photo",
  "gallery.next": "Next photo",
  "gallery.imageN": "Photo {n}",
  "gallery.counter": "{i} / {n}",
};

export const detail = { uz, ru, en };
