import { useState } from "react";
import { toast } from "react-toastify"; // Importa ToastContainer y toast
import "react-toastify/dist/ReactToastify.css";

const EditPassword = ({setEditPassword}) => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let body = {
      password:password,
      newPassword:newPassword,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}users/password/reset`, 
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("AUTH_TOKEN_TJ"),
          },
          method: "PUT",
          body: JSON.stringify( body ),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error en la respuesta de la API:", errorResponse);
        toast.error("Error al actualizar la contraseña"); // Notificación de error
        return;
      } else {
        toast.success("Contraseña actualizada con éxito"); // Notificación de éxito
        setEditPassword();
      }
    } catch (error) {
      console.error("Error al cambiar tu contraseña:", error);
      toast.error("No se pudo actualizar la contraseña"); // Notificación de error
    }
  };
  return (
    <div
      className="fixed -inset-y-0 z-30 -inset-x-0 flex flex-col items-center justify-center 
     w-[100vw] h-[100vh] bg-gray-800 bg-opacity-85"
    >
      <h2
        className="bg-fondoPopup pt-14 text-white rounded-t-2xl w-[90vw] md:w-[50vw] lg:w-[70vw] text-center sm:text-5xl md:text-5xl lg:text-6xl"
      >
        Cambia tu contraseña
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-evenly sm:justify-center content-center 
        space-y-12  bg-fondoPopup p-6 
        rounded-b-2xl shadow-lg w-[90vw] md:w-[50vw] lg:w-[70vw] h-[70vh] sm:text-4xl text-center"
      >
        <input
          type="password"
          placeholder="Introduce tu contraseña"
          className="w-full text-2xl  bg-transparent border-b-4 text-center sm:text-xl md:text-2xl lg:text-3xl text-gray-400 font-bold mb-4"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Introduce tu NUEVA contraseña (mín 8 caracteres)"
          className="mb-4 w-full bg-transparent border-b-4 text-gray-400 sm:text-xl md:text-2xl lg:text-3xl text-center"
          onChange={(e) => {
            setNewPassword(e.target.value);
          }}
        />

        <button
          type="button"
          className="bg-[url('/avatarDefault.jpg')] bg-cover bg-top px-4 py-2 rounded-2xl hover:bg-green-900 w-[30vw]  text-center transition duration-200"
          onClick={() => {
            setEditPassword(false);
          }}
        >
          Cerrar
        </button>
        <button
          type="submit"
          className="bg-[url('/avatarDefault.jpg')] bg-cover bg-left px-4 py-2 rounded-2xl hover:bg-green-900 w-[30vw] transition duration-200"
          
        >
          Cambiar
        </button>
      </form>
    </div>
  );
};

export default EditPassword;