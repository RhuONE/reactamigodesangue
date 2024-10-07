import React from 'react';
import NavBar from '../../components/NavBar';
import HomeSection from '../../components/HomeSection';
import ConhecaSection from '../../components/ConhecaSection';
import Footer from '../../components/Footer';

const Home = () => {
  return (
    <div>
      <NavBar />
      <HomeSection />
      <ConhecaSection />
      <Footer />
    </div>
  );
};

export default Home;
