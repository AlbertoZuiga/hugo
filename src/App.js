import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Home from './pages/home/Home';
import Schedule from './pages/schedule/Schedule';
import SearchCourses from './pages/search_courses/SearchCourses';

const App = () => {
    return (
        <Router>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <main style={{ flex: '1' }}>
                    <Routes>
                        <Route path="/" element={<Home />} /> 
                        <Route path="/schedule" element={<Schedule />} />
                        <Route path="/search-courses" element={<SearchCourses />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
