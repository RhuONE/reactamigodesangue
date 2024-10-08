import React from 'react';
import NavBar from '../../components/NavBar';
import HomeSection from '../../components/HomeSection';
import ConhecaSection from '../../components/ConhecaSection';
import Footer from '../../components/Footer';
import SobreNosSection from '../../components/SobreNosSection';
import SobreAppSection from '../../components/SobreAppSection';

const Home = () => {
  return (
    <div>
      <NavBar />
      <HomeSection />
      <ConhecaSection />
      <SobreAppSection />
      <SobreNosSection/>
      <Footer />
    </div>
  );
};

export default Home;
