 import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";

import "react-vertical-timeline-component/style.min.css";

import { styles } from "../styles";
import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";

// Important tech words worth highlighting inside experience descriptions
// (programming languages, frameworks, platforms and key tools — same style as Projects)
const HIGHLIGHT_WORDS = [
  "Elementor Containers",
  "Authorize.Net",
  "WooCommerce Subscriptions",
  "Tutor LMS Pro",
  "Twitter Card",
  "JavaScript",
  "Open Graph",
  "Elementor Pro",
  "WooCommerce",
  "WooPayments",
  "WordPress",
  "Tutor LMS",
  "Rank Math",
  "OiTech Theme",
  "Laravel",
  "Elementor",
  "Bluehost",
  "MySQL",
  "WPCode",
  "3D LiDAR",
  "Stripe",
  "LiDAR",
  "MVC",
  "HTML",
  "CSS",
  "Java",
  "PHP",
  "SSL",
  "IoT",
  "Zeffy",
  "API",
  "SEO",
  "JS",
  "C++",
];

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const HIGHLIGHT_PATTERN = new RegExp(
  `(${[...HIGHLIGHT_WORDS].sort((a, b) => b.length - a.length).map(escapeRegExp).join("|")})`,
  "gi"
);

const HIGHLIGHT_STYLES = [
  "pink-text-gradient font-semibold",
  "bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent font-semibold",
];

// Wraps tech keywords with color, alternating between the two styles
const highlightKeywords = (text) => {
  let keywordIndex = 0;
  return String(text || "")
    .split(HIGHLIGHT_PATTERN)
    .map((part, index, parts) => {
      const isKeyword = HIGHLIGHT_WORDS.some(
        (word) => word.toLowerCase() === part.toLowerCase()
      );
      if (!isKeyword) return part;
      // Skip matches glued inside other words (e.g. "CSS" must not light up inside "access")
      const beforeChar = (parts[index - 1] || "").slice(-1);
      const afterChar = (parts[index + 1] || "").charAt(0);
      if (/[\w]/.test(beforeChar) || /[\w]/.test(afterChar)) return part;
      const className = HIGHLIGHT_STYLES[keywordIndex % HIGHLIGHT_STYLES.length];
      keywordIndex += 1;
      return (
        <span key={index} className={className}>
          {part}
        </span>
      );
    });
};

const ExperienceCard = ({ experience }) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "#1d1836",
        color: "#fff",
      }}
      contentArrowStyle={{ borderRight: "7px solid  #232631" }}
      date={experience.date}
      iconStyle={{ background: experience.iconBg }}
      icon={
        <div className="flex justify-center items-center w-full h-full">
          <img
            src={experience.icon}
            alt={experience.company_name}
            className="w-[60%] h-[60%] object-contain"
          />
        </div>
      }
    >
      <div>
        <h3 className="text-white text-[24px] font-bold">{experience.title}</h3>
        <p
          className="text-secondary text-[16px] font-semibold"
          style={{ margin: 0 }}
        >
          {experience.company_name}
        </p>
      </div>

      <ul className="mt-5 list-disc ml-5 space-y-2">
        {experience.points.map((point, index) => (
          <li
            key={`experience-point-${index}`}
            className="text-white-100 text-[14px] pl-1 tracking-wider"
          >
            {highlightKeywords(point)}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>
          What I have done so far
        </p>
        <h2
          className={`${styles.sectionHeadText} animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent font-black text-center`}
        >
          Experience.
        </h2>
      </motion.div>

      <div className="mt-20 flex flex-col">
        <VerticalTimeline>
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={`experience-${index}`}
              experience={experience}
            />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");
