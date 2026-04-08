import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type AuthModalContextType = {
  isOpen: boolean;
  openModal: (tab?: "login" | "signup") => void;
  closeModal: () => void;
  activeTab: "login" | "signup";
  setActiveTab: (tab: "login" | "signup") => void;
};

export const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined,
);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  const openModal = (tab: "login" | "signup" = "login") => {
    setActiveTab(tab);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <AuthModalContext.Provider
      value={{ isOpen, openModal, closeModal, activeTab, setActiveTab }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx)
    throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
}
