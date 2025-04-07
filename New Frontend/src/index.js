import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import SelectedZones from './components/SelectedZones';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NextPage from './components/NextPage';


ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/selected-zones" element={<SelectedZones />} />
      <Route path="/next-page" element={<NextPage />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);
