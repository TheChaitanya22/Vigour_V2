import React from "react";
import { Element } from "react-scroll";
function About() {
  return (
    <div>
      <Element name="about">
        <div className="py-20 px-6 bg-base-100 text-center">
          <h2 className="text-4xl font-bold mb-6">About Vigour</h2>
          <p className="max-w-3xl mx-auto text-lg mb-6">
            Vigour is more than just a fitness platform — it's a global
            community built for transformation. We connect users with certified
            trainers and experienced dieticians who offer structured,
            science-backed courses to help you reach your health goals.
          </p>
          <p className="max-w-3xl mx-auto text-lg mb-6">
            Whether you're starting your fitness journey or a professional
            looking to share your expertise, Vigour provides the tools,
            structure, and support needed to grow. Our mission is to make
            personalized wellness accessible for everyone, anywhere.
          </p>
          <p className="max-w-3xl mx-auto text-lg">
            Built by a passionate team of fitness lovers and technologists, we
            believe health is not one-size-fits-all. Join us and take control of
            your fitness — your way.
          </p>
        </div>
      </Element>
    </div>
  );
}

export default About;
