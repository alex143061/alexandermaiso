import React, { Suspense, lazy } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { textVariant, fadeIn } from "../utils/motion";

import { Cursor, useTypewriter } from "react-simple-typewriter";

import {
  BsTwitter,
  BsGithub,
  BsDiscord,
  BsInstagram,
  BsLinkedin,
  BsFacebook,
} from "react-icons/bs";

// three.js is heavy - load the hero canvas as a separate chunk.
const DeskCanvas = lazy(() => import("./canvas/Desk"));

const Hero = () => {
  const [text, count] = useTypewriter({
    words: [
     "<CreativeThinker />",
      "IoTEnthusiast & Innovator",
      "ML Explorer",
      "ProblemSolverByNature",
      "CodeCraftsman",
      "TinkeringWithTech",
      "ArduinoToAI",
      "FromPrototypeToProduction",
      "AlwaysLearning",
      "EngineeringImagination",
      
    ],
    loop: true,
    delaySpeed: 1000,
  });

  return (
    <section className="relative w-full h-screen mx-auto">
      <div
        className={`${styles.paddingX} absolute inset-0 top-[120px] max-w-7xl mx-auto flex flex-row items-start gap-5`}
      >
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500"></div>
          <div className="w-1 sm:h-80 h-40 animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500"></div>
        </div>

        <div>
          <motion.h1
            variants={textVariant()}
            initial="hidden"
            animate="show"
            className={`${styles.heroHeadText} text-white`}
          >
            Hi, I'm{" "}
            <span className="animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent font-black">
              Alex <span className="hidden sm:inline"></span>
            </span>
          </motion.h1>

          <motion.p
            variants={fadeIn("up", "spring", 0.4, 1)}
            initial="hidden"
            animate="show"
            className={`${styles.heroSubText} mt-2 sm:-mb-10 text-white-100 max-w-lg`}
          >
            {text}
            <Cursor cursorColor="#915eff" />
          </motion.p>
        </div>
      </div>
      <Suspense fallback={null}>
        <div className="absolute inset-0 z-0 pointer-events-none">
          <DeskCanvas />
        </div>
      </Suspense>


      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
        <a
          href="#about"
          aria-label="Scroll down to the About section"
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
            <motion.div
              animate={{ y: [0, 24, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-3 h-3 rounded-full bg-secondary mb-1"
            />
          </div>
        </a>
      </div>

      <div className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 flex flex-col gap-3 sm:gap-5 items-center md:mt-10 mt-5 md:gap-12">
        <a
          href="https://www.linkedin.com/in/alexander-maiso/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profile (opens in a new tab)"
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          <BsLinkedin
            size={30}
            aria-hidden="true"
            className="icon hover:text-[#0e76a8] hover:translate-y-[-2px] hover:cursor-pointer transition-all ease-in duration-100"
          />
        </a>

        <a
          href="https://github.com/alex143061"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profile (opens in a new tab)"
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          <BsGithub
            size={30}
            aria-hidden="true"
            className="icon hover:text-[#494646] hover:translate-y-[-2px] hover:cursor-pointer transition-all ease-in duration-100"
          />
        </a>

        <a
          href="https://x.com/IamAlex84766006"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (Twitter) profile (opens in a new tab)"
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          <BsTwitter
            size={30}
            aria-hidden="true"
            className="icon hover:text-[#1DA1F2] hover:translate-y-[-2px] hover:cursor-pointer transition-all ease-in duration-100"
          />
        </a>

        <a
          href="https://discord.com/channels/@dffs221"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Discord server (opens in a new tab)"
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          <BsDiscord
            size={30}
            aria-hidden="true"
            className="icon hover:text-[#5865F2] hover:translate-y-[-2px] hover:cursor-pointer transition-all ease-in duration-100"
          />
        </a>

        <a
          href="https://www.instagram.com/iamaleaxs"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram profile (opens in a new tab)"
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          <BsInstagram
            size={30}
            aria-hidden="true"
            className="icon hover:text-[#E1306C] hover:translate-y-[-2px] hover:cursor-pointer transition-all ease-in duration-100"
          />
        </a>

        <a
          href="https://www.facebook.com/alexander.beltran.713950"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook profile (opens in a new tab)"
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          <BsFacebook
            size={30}
            aria-hidden="true"
            className="icon hover:text-[#1877F2] hover:translate-y-[-2px] hover:cursor-pointer transition-all ease-in duration-100"
          />
        </a>
      </div>
    </section>
  );
};

export default Hero;
