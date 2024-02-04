// src/pages/Home.tsx

import React from 'react';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
  return (
    <div>
      <Navbar />
      <h1>Bem-vindo à Página Inicial</h1>
    </div>
  );
}

export default Home;
