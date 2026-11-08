import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../services/favorite";

interface FavoritesContextValue {
  isFavorite: (propertyId: number) => boolean;
  /** Qo'shadi yoki olib tashlaydi. Xatoda throw qiladi. */
  toggle: (propertyId: number) => Promise<void>;
  remove: (propertyId: number) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/** Login qilgan user sevimlilarining id'lari: ♥ holatini bitta joyda saqlaydi. */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [ids, setIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!isLoggedIn) {
      setIds(new Set());
      return;
    }

    let cancelled = false;

    getFavorites()
      .then((items) => {
        if (!cancelled) setIds(new Set(items.map((item) => item.propertyId)));
      })
      .catch(() => {
        // ♥ holati yuklanmasa ham sayt ishlayveradi
      });

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const remove = useCallback(async (propertyId: number) => {
    await removeFavorite(propertyId);
    setIds((prev) => {
      const next = new Set(prev);
      next.delete(propertyId);
      return next;
    });
  }, []);

  const toggle = useCallback(
    async (propertyId: number) => {
      if (ids.has(propertyId)) {
        await remove(propertyId);
        return;
      }

      try {
        await addFavorite(propertyId);
      } catch (err) {
        // 409: allaqachon saqlangan — holatni shunchaki to'g'rilaymiz
        if ((err as { response?: { status?: number } })?.response?.status !== 409) {
          throw err;
        }
      }

      setIds((prev) => new Set(prev).add(propertyId));
    },
    [ids, remove]
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({ isFavorite: (id) => ids.has(id), toggle, remove }),
    [ids, toggle, remove]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites faqat FavoritesProvider ichida ishlaydi");
  return ctx;
}
