import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

// crear el contexto y darle un valor inicial
export const AuthContext = createContext({
  currentUser: "",
  signIn: (token = "") => {
    console.log(token);
  },
  signOut: () => {},
  recoverPassword: async (email) => {},
});

// crear el proveedor (provider) y luego implementarlo para envuelva a toda la aplicación (rutas)
export function AuthContextProvider({ children }) {
  // crear lo estados pertinentes y funciones que desee que estén disponibles en el contexto

  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  function signIn(token) {
    localStorage.setItem("AUTH_TOKEN_TJ", token);

    const user = jwtDecode(token);
    setCurrentUser(user);
  }

  function signOut() {
    localStorage.removeItem("AUTH_TOKEN_TJ");
    setCurrentUser(null);
  }

  async function recoverPassword(email) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}users/password/recover`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Solicitud de recuperación de contraseña enviada:", data);
    } catch (error) {
      console.error(
        "Error al enviar solicitud de recuperación de contraseña:",
        error
      );
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("AUTH_TOKEN_TJ");

    if (token) {
      const user = jwtDecode(token);

      if (user.exp * 1000 < Date.now()) {
        localStorage.removeItem("AUTH_TOKEN_TJ");
        navigate("/sign-in");
      } else {
        setCurrentUser(user);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key == "AUTH_TOKEN_TJ") {
        if (event.newValue) {
          const user = jwtDecode(event.newValue);
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // retornar el context con su provider

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signIn,
        signOut,
        recoverPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthContextProvider.propTypes = {
  children: PropTypes.element,
};
