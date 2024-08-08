import { AuthContext, AuthContextProvider } from "./context/auth.context.jsx";
import "./utils/i18n.js";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Importa los estilos de react-toastify

import MyCalendar from "./pages/Calendar.jsx";
import Login from "./pages/Login.jsx";
import ConfirmUser from "./pages/ConfirmUser.jsx";
import SignUp from "./pages/SignUp.jsx";
import RecoverPassword from "./pages/RecoverPassword.jsx";
import Home from "./pages/Home.jsx";
import NotFound from "./components/NotFound.jsx";
import Help from "./pages/Help.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import AdminProfile from "./pages/AdminProfile.jsx";
import Administrator from "./pages/Administrator.jsx";

import Listas from "./pages/Listas.jsx";

import ConfirmRecoverPassword from "./pages/ConfirmRecoverPassword.jsx";

function App() {
  return (
    <AuthContextProvider>
      <>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/calendar" element={<MyCalendar />} />
          <Route path="/login" element={<Login />} />
          <Route path="/list" element={<Listas />} />
          <Route path="/" element={<Home />} />
          <Route path="/confirm/:validationCode" element={<ConfirmUser />} />
          <Route path="/recover-password" element={<RecoverPassword />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/help" element={<Help />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/admin-profile" element={<AdminProfile />} />
          <Route path="/administrator" element={<Administrator />} />
          <Route
            path="/confirmation-recover-password"
            element={<ConfirmRecoverPassword />}
          />
        </Routes>
        <ToastContainer />
      </>
    </AuthContextProvider>
  );
}

export default App;
