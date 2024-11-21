// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import SearchCourses from "./pages/search_courses/SearchCourses";
import Login from "./pages/login/Login";
import UploadExcel from "./pages/upload_excel/UploadExcel";
import CrudCurso from "./pages/CRUD_curso/crudCurso";
import CrudSeccion from "./pages/CRUD_seccion/crudSeccion";
import CrudProfesor from "./pages/CRUD_profesor/crudProfesor"
import CrudBloque from "./pages/CRUD_bloque/crudBloque";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Navbar />
          <main style={{ flex: "1" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search-courses" element={<SearchCourses />} />
              <Route path="/login" element={<Login />} />
              <Route path="/upload-excel" element={<UploadExcel />} />
              <Route path="/crud-curso" element={<CrudCurso />} />
              <Route path="/crud-seccion" element={<CrudSeccion />} />
              <Route path="/crud-profesor" element={<CrudProfesor />} />
              <Route path="/crud-bloque" element={<CrudBloque />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
};

export default App;
