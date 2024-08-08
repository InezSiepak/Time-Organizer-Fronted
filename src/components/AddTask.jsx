import { useState, useEffect } from "react";
import { showErrorToast, showSuccessToast } from "../utils/toastUtils"; // Importa tus funciones de toastUtils
import { useTranslation } from "react-i18next";
const AddTask = ({ setAddTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [colores, setColores] = useState([]);
  const [families, setFamilies] = useState([]);
  const [colorId, setColorId] = useState(null); // Asegúrate de que el valor inicial sea null
  const [familyId, setFamilyId] = useState(null); // Asegúrate de que el valor inicial sea null
  const { t } = useTranslation();
  const getColorIdByName = (colorName) => {
    const color = colores.find(
      (c) => c.name.toLowerCase() === colorName.toLowerCase()
    );
    return color ? color.color_id : null;
  };

  const getFamilyIdByName = (familyName) => {
    const family = families.find(
      (f) => f.name.toLowerCase() === familyName.toLowerCase()
    );
    return family ? family.family_id : null;
  };

  let formInfo = {
    title: title,
    description: description,
    start_on: start,
    finish_on: end,
    color_id: colorId, // Usa color_id
    family_id: familyId, // Usa family_id
  };

  const [body, setBody] = useState(formInfo);

  const validateForm = () => {
    const now = new Date();

    if (!title) {
      showErrorToast("Error: El título es requerido");
      return false;
    }

    if (!description) {
      showErrorToast("Error: La descripción es requerida");
      return false;
    }

    if (!start || !end) {
      showErrorToast("Error: Las fechas y horas son requeridas");
      return false;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate < now) {
      showErrorToast(
        "Error: La fecha y hora no puede ser anterior al día de hoy"
      );
      return false;
    }

    if (endDate < startDate) {
      showErrorToast(
        "Error: La fecha de fin no puede ser anterior a la fecha de inicio"
      );
      return false;
    }

    if (!colorId) {
      showErrorToast("Error: El color es requerido");
      return false;
    }

    if (!familyId) {
      showErrorToast("Error: La familia es requerida");
      return false;
    }

    return true;
  };

  const getColors = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}colors`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("AUTH_TOKEN_TJ"),
          },
          method: "GET",
        }
      );
      const info = await response.json();
      setColores(info.colors);
    } catch (error) {
      console.log(error);
      showErrorToast("Error al obtener los colores");
    }
  };

  const getFamilies = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}family`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("AUTH_TOKEN_TJ"),
          },
          method: "GET",
        }
      );
      const info = await response.json();
      setFamilies(info.taskFamilies);
    } catch (error) {
      console.log(error);
      showErrorToast("Error al obtener las familias");
    }
  };

  useEffect(() => {
    getColors();
    getFamilies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Valida el formulario antes de enviar

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}tasks`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("AUTH_TOKEN_TJ"),
        },
        method: "POST",
        body: JSON.stringify(body),
      });
      const res = await response.json();
      if (res.ok) {
        showSuccessToast("Tarea añadida exitosamente");
        setAddTask(false);
      } else {
        showErrorToast("Error al añadir la tarea");
      }
    } catch (error) {
      console.log(error);
      showErrorToast("Error al añadir la tarea");
    }
  };

  useEffect(() => {
    setBody(formInfo);
  }, [title, description, start, end, colorId, familyId]);

  return (
    <div
      className="fixed -inset-y-0 z-30 -inset-x-0 z-10 flex flex-col items-center justify-center 
     w-[100vw] h-[100vh] bg-gray-800 bg-opacity-85"
    >
      <h2
        className="bg-fondoPopup pt-4 text-white rounded-t-2xl w-[70vw] sm:w-[60vw] md:w-[50vw]
       text-center text-3xl sm:text-6xl"
      >
        Añadir Evento
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-evenly sm:justify-center content-center 
        space-y-10  bg-fondoPopup p-6 
        rounded-b-2xl shadow-lg w-[70vw] sm:w-[60vw] md:w-[50vw] h-[75vh] sm:text-2xl text-center"
      >
        <input
          type="text"
          placeholder="añade un titulo"
          className="text-3xl w-full bg-transparent border-b-4 text-center sm:text-6xl text-gray-400 font-bold mb-4"
          onChange={(e) => {
            setTitle(e.target.value);
            setBody(formInfo);
          }}
        />
        <input
          type="text"
          placeholder="añade una descripcion"
          className="mb-4 w-full bg-transparent border-b-4 text-gray-400 sm:text-5xl text-xl text-center"
          onChange={(e) => {
            setDescription(e.target.value);
            setBody(formInfo);
          }}
        />
        <div className="flex flex-col sm:flex-col sm:space-y-8 text-gray-400  space-y-4 ">
          <div>
            <label className="mb-2">
              <strong>Fecha de Inicio:</strong>
            </label>
            <input
              className="w-[46vw] bg-transparent sm:w-[23vw]"
              type="datetime-local"
              min={"1900-01-01T00:00:00"}
              max={"2040-01-01T00:00:00"}
              onChange={(e) => {
                setStart(e.target.value);
                setBody(formInfo);
              }}
            />
          </div>
          <div>
            <label className="mb-2">
              <strong>Fecha de Fin:</strong>
            </label>
            <input
              className="w-[46vw] bg-transparent sm:w-[23vw]"
              type="datetime-local"
              min={"1900-01-01T00:00:00"}
              max={"2040-01-01T00:00:00"}
              onChange={(e) => {
                setEnd(e.target.value);
                setBody(formInfo);
              }}
            />
          </div>
          <div>
            <label htmlFor="color">Elige un color:</label>
            <input
              list="color"
              id="exampleListInput"
              onChange={(e) => {
                e.preventDefault();
                const id = getColorIdByName(e.target.value);
                setColorId(id);
              }}
            />
            <datalist id="color">
              {colores.map((co, i) => (
                <option key={i} value={t(co.name)} />
              ))}
            </datalist>
          </div>
          <div>
            <label htmlFor="family">Elige una familia:</label>
            <input
              list="family"
              id="exampleListInput2"
              onChange={(e) => {
                e.preventDefault();
                const id = getFamilyIdByName(e.target.value);
                setFamilyId(id);
              }}
            />
            <datalist id="family">
              {families.map((fa, i) => (
                <option key={i} value={fa.name} />
              ))}
            </datalist>
          </div>
        </div>
        <button
          className="bg-green-600  px-4 py-2 rounded-2xl hover:bg-green-900 w-[30vw] transition duration-200"
          onClick={() => {
            setAddTask(false);
          }}
        >
          Cerrar
        </button>
        <button
          type="submit"
          className="bg-green-600  px-4 py-2 rounded-2xl hover:bg-green-900 w-[30vw] transition duration-200"
        >
          Añadir
        </button>
      </form>
    </div>
  );
};

export default AddTask;
