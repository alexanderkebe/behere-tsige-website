import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ContentProvider } from './context/ContentContext';
import Home from './pages/Home';
import Admin from './pages/Admin';

export default function App() {
  return (
    <ContentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  );
}
