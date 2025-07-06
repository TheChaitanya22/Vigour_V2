import React from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import Footer from "../components/Footer";
import NavbarV2 from "../components/NavbarV2";

function Home() {
  return (
    <div>
      <NavbarV2 />
      <Hero />
      <About />
      <Footer />
    </div>
  );
}

export default Home;
