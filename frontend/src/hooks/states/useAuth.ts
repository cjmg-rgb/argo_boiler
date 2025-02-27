import { create } from "zustand";
import { IAuth } from "@/types";

const useAuth = create<IAuth>()((set) => ({
  auth: null,
  setCredentials: (credentials) => set({ auth: credentials }),
  removeCredentials: () => set({ auth: null }),
  updateCredits: (credits) =>
    set((prev) => ({
      auth: {
        ...(prev.auth as NonNullable<IAuth["auth"]>),
        credits,
      },
    })),
}));

export default useAuth;
