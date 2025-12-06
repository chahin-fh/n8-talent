import React, { createContext, useEffect, useState, type ReactNode } from "react";

interface AuthContextType {
  active: boolean;
  set_active: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const verify_endpoint = "http://localhost:5000/verify";

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [active, set_active] = useState(false);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    const check_auth = async () => {
      try {
        const res = await fetch(verify_endpoint, {
          method: "GET",
          credentials: "include",
        });
        set_active(res.ok);
      } catch {
        set_active(false);
      } finally {
        set_loading(false);
      }
    };
    check_auth();
  }, []);

  return (
    <AuthContext.Provider value={{ active, set_active, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
