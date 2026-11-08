import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useI18n } from "../i18n/I18nContext";

/** Parol maydoni: "ko'rsatish / yashirish" tugmasi bilan. Qolgan hamma xususiyatlar <input> ga o'tadi. */
function PasswordInput(props: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [visible, setVisible] = useState(false);
  const { t } = useI18n();

  return (
    <div className="relative">
      <input
        {...props}
        className={`input pr-12 ${props.className ?? ""}`}
        type={visible ? "text" : "password"}
      />
      <button
        type="button"
        className="absolute right-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-charcoal"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t("auth.hidePassword") : t("auth.showPassword")}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

export default PasswordInput;
