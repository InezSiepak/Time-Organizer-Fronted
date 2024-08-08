import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth.jsx";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import DataTable from "react-data-table-component";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils"; // Importa las funciones de notificación

const Administrator = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  console.log(users);
  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Última conexión",
      selector: (row) => row.updatedAt,
      sortable: true,
    },
  ];
  const data = [
    {
      username: "beatriz",
      email: "beatriztejerocruz@gmail.com",
      updatedAt: "2024-08-05 14:40:50",
    },
    {
      username: "pepito",
      email: "ejemplo1@gmail.com",
      updatedAt: "2024-08-05 14:40:50",
    },
    {
      username: "juanito",
      email: "ejemplo2@gmail.com",
      updatedAt: "2024-08-05 14:40:50",
    },
    {
      username: "lolito",
      email: "ejemplo3@gmail.com",
      updatedAt: "2024-08-05 14:40:50",
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}users/`,
          {
            method: "GET",
            headers: {
              Authorization: localStorage.getItem("AUTH_TOKEN_TJ"),
            },
          }
        );
        const info = await response.json();

        //setUsers(response.data);

        setUsers(
          info.users.map((users) => ({
            username: users.username,
            email: users.email,
            role: users.role,
            updatedAt: users.updatedAt,
          }))
        );
      } catch (error) {
        showErrorToast("Error al cargar los usuarios.");
      }
    };
    fetchUsers();
  }, []);

  const toggleUserStatus = async (username, enable) => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}users/admin/status`, {
        method: "PUT",
        headers: {
          Authorization: localStorage.getItem("AUTH_TOKEN_TJ"),
        },
      });
      showSuccessToast(
        `Usuario ${enable ? "habilitado" : "deshabilitado"} correctamente.`
      );
    } catch (error) {
      showErrorToast("Error al cambiar el estado del usuario.");
    }
  };

  const deleteUser = async (user_id) => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}users/${user_id}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("AUTH_TOKEN_TJ"),
        },
      });
      setUsers(users.filter((user) => user.id !== user_id));
      showSuccessToast("Usuario eliminado correctamente.");
    } catch (error) {
      showErrorToast("Error al eliminar el usuario.");
    }
  };
  useEffect(() => {
    !currentUser && navigate("/login");
  }, [currentUser]);

  return (
    <div className="relative sm:w-[70vw] bg-black border-solid border-2 border-black rounded-3xl place-content-center">
      <Header />
      <section className="flex flex-col rounded-3xl w-[80vw] sm:w-full h-[90vh] sm:h-[90vh] sm:flex-row">
        <div className="flex flex-col md:flex-row w-full md:w-[55vw] h-[75vh] md:h-full pb-20 rounded-bl-3xl text-center text-lg md:text-2xl bg-white">
          <div className="flex justify-start items-center md:bg-fondo rounded-bl-3xl md:h-[90vh] p-4 md:w-[24vw] lg:w-[20vw] md:space-y-20">
            <button
              className="rounded-3xl text-center text-xl lg:text-2xl text-white bg-black h-[7vh] w-[22vw] md:w-[15vw] lg:w-[16vw] transition duration-200"
              onClick={() => navigate("/admin-profile")}
            >
              Volver
            </button>
          </div>
          <div className="flex  flex-col h-full w-full md:w-[30vw] justify-evenly content-center">
            <div>
              <DataTable
                title="VISUALIZAR USUARIOS"
                columns={columns}
                data={users}
                selectableRows
                pagination
                paginationPerPage={8}
                fixedHeader
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center md:justify-end md:bg-fondo rounded-br-3xl h-[8vh] md:h-full py-4 md:w-[22vw] lg:w-[20vw] md:space-y-20">
          <button
            type="button"
            onClick={() => toggleUserStatus(currentUser.username, false)}
            className="rounded-3xl text-xl lg:text-2xl text-white bg-black md:h-[7vh] md:w-[14vw] lg:w-[16vw] transition duration-200"
          >
            Deshabilitar
          </button>
          <button
            type="button"
            onClick={() => toggleUserStatus(currentUser.username, true)}
            className="rounded-3xl text-xl lg:text-2xl text-white bg-black md:h-[7vh] md:w-[14vw] lg:w-[16vw] transition duration-200"
          >
            Habilitar
          </button>
          <button
            type="button"
            onClick={() => deleteUser(currentUser.user_id)}
            className="rounded-3xl text-xl lg:text-2xl text-white bg-black md:h-[7vh] md:w-[14vw] lg:w-[16vw] transition duration-200"
          >
            Eliminar
          </button>
        </div>
      </section>
    </div>
  );
};

export default Administrator;
