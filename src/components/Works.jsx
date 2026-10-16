import React, { useState, useEffect } from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { github, close } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import livelink from "../assets/liveLink.png";

const ImageModal = ({ project, isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl max-h-[85vh] bg-white/5 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors"
        >
          <img src={close} alt="close" className="w-5 h-5" />
        </button>
        <img
          src={project.image}
          alt={project.name}
          className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-xl border border-white/10"
        />
        <div className="mt-6 text-center">
          <h3 className="text-2xl font-bold text-white">{project.name}</h3>
          <p className="mt-2 text-gray-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed line-clamp-6 overflow-hidden">
            {project.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
  liveUrl,
  onImageClick,
}) => {
  return (
    <Tilt
      options={{
        max: 45,
        scale: 1,
        speed: 450,
      }}
      className="bg-tertiary p-5 rounded-2xl w-full cursor-pointer hover:scale-[1.02] transition-transform active:scale-95"
    >
      <div
        className="relative w-full h-[230px] overflow-hidden rounded-3xl group cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onImageClick();
        }}
      >
        <img
          src={image}
          alt="project_image"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 flex gap-2 justify-end m-3 z-20">
          <div
            onClick={(e) => {
              e.stopPropagation();
              window.open(source_code_link, "_blank");
            }}
            className="black-gradient w-8 h-8 rounded-full flex justify-center items-center cursor-pointer"
          >
            <img
              src={github}
              alt="source code"
              className="w-2/3 h-2/3 object-contain"
            />
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              window.open(liveUrl, "_blank");
            }}
            className="black-gradient w-8 h-8 rounded-full flex justify-center items-center cursor-pointer"
          >
            <img
              src={livelink}
              alt="live url"
              className="w-2/3 h-2/3 object-contain"
            />
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-white font-bold text-[24px]">{name}</h3>
        <p className="mt-2 text-secondary text-[14px] line-clamp-3 overflow-hidden">
          {description}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <p
            key={`${name}-${tag.name}`}
            className={`text-[14px] ${tag.color}`}
          >
            #{tag.name}
          </p>
        ))}
      </div>
    </Tilt>
  );
};

const Works = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <>
      <p className={`${styles.sectionSubText} `}>My work</p>
      <h2
        className={`${styles.sectionHeadText} animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent font-black`}
      >
        Projects.
      </h2>

      <div className="w-full flex">
        <p
          variants={fadeIn("", "", 1, 1)}
          className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]"
        >
          These projects reflect my skills and experience, offering real-world examples of my work. Each project is briefly described with links to the code repositories, showcasing my ability to tackle challenges, learn new technologies, and manage tasks effectively. I also have several other projects that I haven't included here yet, including my Computer Vision project and a mobile app, which was my thesis, but I hope to share them if I have the time.
        </p>
      </div>

      <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {projects.map((project, index) => (
          <ProjectCard
            key={`project-${index}`}
            index={index}
            {...project}
            onImageClick={() => setSelectedProject(project)}
          />
        ))}
      </div>

      {selectedProject && (
        <ImageModal
          project={selectedProject}
          isOpen={true}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
};

export default SectionWrapper(Works, "");
