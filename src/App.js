import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Home from './pages/home/Home';
import SearchCourses from './pages/search_courses/SearchCourses';
import SchedulePreferences from './components/schedule_preferences/SchedulePreferences';
import Login from './pages/login/Login'; // Importa el componente de login

const App = () => {
    return (
        <Router>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <main style={{ flex: '1' }}>
                    <Routes>
                        <Route path="/" element={<Home />} /> 
                        <Route path="/search-courses" element={<SearchCourses />} />
                        <Route path="/schedule-preferences" element={<SchedulePreferences />} />
                        <Route path="/login" element={<Login />} /> {/* Nueva ruta para login */}
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
