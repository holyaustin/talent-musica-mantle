import React from "react";

import logo from "../assets/mic.png";

const Footer = () => (
  <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 bg-black">
    <div className="w-full flex sm:flex-row flex-col justify-between items-center my-4">
      <div className="flex flex-[0.5] justify-center items-center">
        <img src={logo} alt="logo" className="w-12" />
      </div>
      <div className="flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-5 w-full">
        <p className="text-white text-2xl text-center mx-2 cursor-pointer">Talent Musica: Onboarding new muisical talent into web3 ecosystem. </p>

      </div>
    </div>

    <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5 " />

    <div className="sm:w-[90%] w-full items-center mt-10">
      <p className="text-white text-center text-base">Talent Musica 2022. All rights reserved.</p>
    </div>
  </div>
);

export default Footer;
