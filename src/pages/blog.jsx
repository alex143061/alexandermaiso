import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { FiArrowRight, FiCalendar, FiX } from "react-icons/fi";
import { StarsCanvas } from "../components/canvas";
import { usePageMeta } from "../hooks/usePageMeta";

import iotImg from "../blogimages/iot.webp";
import wraithKingImg from "../blogimages/wraith-king.webp";
import dota2Img from "../blogimages/dota2.webp";
import cybersecurityImg from "../blogimages/cybersecurity.webp";
import roboticsImg from "../blogimages/robotics.webp";
import gpsImg from "../blogimages/gps.webp";

const blogPosts = [
  {
    title: "Wraith King: My Favorite Hero in Dota 2",
    date: "August 5, 2025",
    image: wraithKingImg,
    summary:
      "Of all the heroes in Dota 2, Wraith King will always hold the top spot for me: simple to learn, brutal to master, and unstoppable when he gets going.",
    content: `If there is one hero I keep coming back to in Dota 2, it is Wraith King. There is something so satisfying about a strength hero who can just walk straight into a fight, crit people into oblivion, and come back from the dead when things go wrong. He was actually one of the first heroes I ever played, and he has been my favorite ever since.

What I love most about Wraith King is how beginner-friendly he is while still having real depth. His kit is straightforward: one active stun, a passive critical strike, an aura that raises skeleton warriors, and of course his ultimate, Reincarnation, which brings him back to life after death. That simplicity lets you focus on the things that actually win games: farming efficiently, picking the right fights, and learning map awareness. But don't let the simple kit fool you, because knowing WHEN to go in, how much punishment you can take, and when to back off is what separates a good Wraith King from a great one.

There is also something special about the Reincarnation mind games. Enemies waste cooldowns and resources trying to kill you, only for you to come right back with a slow aura that lets your team clean up. It completely changes how the enemy has to play around you. Pair that with the right items like Radiance, Assault Cuirass, and Black King Bar, and you become a raid boss that teams simply cannot ignore. That feeling of man-fighting everyone in the late game while your skeletons swarm the enemy base? Nothing else in Dota 2 compares.`,
  },
  {
    title: "The Internet of Things (IoT): How Smart Devices Are Changing the World",
    date: "July 15, 2025",
    image: iotImg,
    summary:
      "From smart homes to industrial sensors, the Internet of Things is quietly connecting everything around us, and it's only getting bigger.",
    content: `The Internet of Things, or IoT, refers to the growing network of everyday objects that are connected to the internet and can collect, share, and act on data. Think of smart watches that track your health, thermostats that learn your schedule, or sensors in factories that predict when a machine needs maintenance. What makes IoT special is that it turns ordinary objects into smart, communicating devices.

In my opinion, IoT is one of the most exciting fields in tech right now because it sits at the intersection of hardware, software, and real-world impact. Smart homes let us control lighting, security, and appliances from anywhere. In agriculture, IoT sensors monitor soil moisture and weather conditions to help farmers water crops more efficiently. In healthcare, wearable devices can alert doctors to problems before they become serious.

Of course, IoT also comes with challenges. With billions of connected devices, security and privacy become huge concerns: every smart device is a potential entry point for attackers if it is not properly secured. There is also the question of how all that data is handled. But overall, I believe IoT will keep shaping how we live and work, and learning about it is absolutely worth it.`,
  },
  {
    title: "ROADWATCH: Real-Time Pothole Geolocation and Mobile Monitoring System",
    date: "October 18, 2025",
    image: gpsImg,
    summary:
      "I built a portable, low-cost road inspection device with the ESP32-CAM and GPS that photographs road damage and automatically records where it is.",
    content: `ROADWATCH is a portable, low-cost road inspection device that I built using the ESP32-CAM and a u-blox NEO-6M GPS receiver. A single press of a button takes a JPEG picture and simultaneously reads the current position, capturing latitude, longitude, altitude, satellite count and HDOP. The image is uploaded to Google Drive, and the GPS fix is appended as a new row in a Google Sheet together with a clickable View on Map link.

What makes this project special to me is that everything runs on the ESP32-CAM itself. The board serves its own control web page with a live stream preview and capture button, plus a raw MJPEG video stream on a second port. There is no laptop, no router configuration and no cloud account to pay for, only a 2.4 GHz Wi-Fi hotspot and a free Google account. I also developed a companion Android app called Cammy that turns a phone into a handheld display and trigger, so the camera does not need a laptop to be operated on the road.

The complete loop I put together goes like this: capture, geotag, upload, then map. Road maintenance personnel can mount the rig on the dashboard of a vehicle, drive a route, tap the button whenever a pothole or road defect is seen, and end the day with a spreadsheet of geotagged photographs they can open directly in Google Maps. Google Apps Script acts as the cloud backend I set up, receiving the ESP32's JSON POST, decoding the Base64 JPEG, saving it to Drive, and appending the log row with a real HYPERLINK() formula, all for free. Building ROADWATCH taught me so much about embedded systems, GPS integration, and cloud workflows, and I'm proud of how it all came together.`,
  },
    {
        title: "Why Dota 2 Is More Than Just a Game",
        date: "June 5, 2025",
    image: dota2Img,
    summary:
      "Dota 2 isn’t just about quick reflexes, it's about teamwork, strategy, and constant learning.",
    content: `Dota 2 has been the game of my life ever since, and this is because there is much more beyond clicking onto heroes and farming creeps; it delves much deeper into strategy within which every decision counts and teamwork becomes the turning point of battle.

What I love most about it is that every game is unique. You are always adjusting. You are reading your enemies; you are regrouping with your teammates, and you are thinking so many steps ahead. It is most interesting and most difficult but very rewarding. Then there is the entire Dota 2 community, where so many enthusiastic gamers share their tips and tricks, making it much more exciting.`,
  },
  {
    title: "Cybersecurity in 2025: What Everyone Should Know",
    date: "May 20, 2025",
    image: cybersecurityImg,
    summary:
      "Cybersecurity isn’t just for tech experts, it's something we all need to understand in today’s connected world.",
    content: `Cybersecurity has not entered the great realm of buzzword any longer; the year is 2025, and it is now a necessity. With a connected lifestyle from smart homes all the way to mobile banking, the risks have also climbed higher.

The threats are vast and keep evolving, ranging from the usual theft of personal data to large-scale industrial attacks. The key factor is awareness, using strong passwords, two-factor authentication, and knowing how to identify phishing scams. This knowledge helps mitigate most of the problems. Whether you are a developer or a business owner or just someone browsing the Internet, keeping well-informed is your greatest defense.`,
  },
  {
    title: "How Robotics Is Changing Our Everyday Lives",
    date: "April 10, 2025",
    image: roboticsImg,
    summary:
      "Robots aren’t just sci-fi anymore, they're here, and they’re making real changes in healthcare, manufacturing, and even our homes.",
    content: `Since the good ol' days of futuristic movies, robotics has crossover from being an abstract fantasy to a legitimate tool altering various facets of everyday life. Surgical robots assist doctors in performing surgery with precision, while warehouse bots expedite the delivery process. Altogether, robots have contributed towards speed, safety, and efficiency.

One of the coolest is the way robotics has gone mainstream. Kits for education and DIY projects allow many more people to not only learn how these machines operate but build their own. With changing technology, I look forward to the day robots will essentially change the way we live and work.`,
  },
];

const PostModal = ({ post, isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    // Lock body scroll when modal opens
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
      // Restore body scroll when modal closes or unmounts
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Create portal root if it doesn't exist
  let portalRoot = document.getElementById("modal-portal");
  if (!portalRoot) {
    portalRoot = document.createElement("div");
    portalRoot.id = "modal-portal";
    document.body.appendChild(portalRoot);
  }

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[85vh] flex flex-col bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl"
      >
        <button
          onClick={onClose}
          type="button"
          aria-label="Close article"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          <FiX size={20} className="text-white" aria-hidden="true" />
        </button>
        <div className="overflow-y-auto min-h-0 p-5 sm:p-6">
          <img
            src={post.image}
            alt={`Cover image for ${post.title}`}
            className="w-full max-h-[45vh] object-cover rounded-xl shadow-xl border border-white/10"
            loading="lazy"
            decoding="async"
          />
          <div className="mt-6 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-white/5 border border-white/10 text-teal-300 mb-3">
              <FiCalendar size={12} aria-hidden="true" />
              {post.date}
            </span>
            <h3 className="text-2xl font-bold text-white">{post.title}</h3>
            <p className="mt-3 text-gray-300 text-[15px] sm:text-[16px] leading-[26px] sm:leading-[28px] whitespace-pre-line">
              {post.content}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    portalRoot
  );
};

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  usePageMeta({
    title: "Blog | Alexander Maiso (Alex) — IoT, Cybersecurity, Robotics & Gaming",
    description:
      "Technical articles by Alexander Maiso on the Internet of Things, cybersecurity, robotics, GPS systems, and gaming. Practical notes from a full-stack developer and computer engineer.",
    path: "/blog",
  });

  // Structured data so search engines and AI answer engines can parse the
  // article list. Injected once the component mounts.
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-blog-schema", "true");
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Alexander Maiso (Alex) — Blog",
      url: "https://alexandermaiso.vercel.app/blog",
      description:
        "Technical articles by Alexander Maiso on the Internet of Things, cybersecurity, robotics, GPS systems, and gaming.",
      author: {
        "@type": "Person",
        name: "Alexander Maiso",
        url: "https://alexandermaiso.vercel.app/",
      },
      blogPost: blogPosts.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        datePublished: new Date(post.date).toISOString(),
        description: post.summary,
        author: { "@type": "Person", name: "Alexander Maiso" },
        publisher: { "@type": "Person", name: "Alexander Maiso" },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://alexandermaiso.vercel.app/blog",
        },
      })),
    });
    document.head.appendChild(script);

    return () => script.remove();
  }, []);

  return (
    <div className="relative w-full min-h-screen text-white p-4 sm:p-8">
      {/* Galaxy Stars Background: CSS nebula + animated star field */}
      <div className="fixed inset-0 z-[-1] w-full h-full galaxy-nebula">
        <StarsCanvas fixed />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 mb-4">
            My Blog
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Thoughts, stories, and insights on gaming, cybersecurity, and
            robotics, straight from my journey in tech.
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group relative flex flex-col bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl hover:border-teal-500/40 transition-colors duration-300"
            >
              {/* Post Image */}
              <div className="relative h-48 sm:h-52 overflow-hidden">
                <img
                  src={post.image}
                  alt={`Cover image for ${post.title}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="208"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/20 to-transparent" />
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-teal-300">
                  <FiCalendar size={12} aria-hidden="true" />
                  {post.date}
                </span>
              </div>

              {/* Post Content */}
              <div className="flex flex-col flex-1 p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-3 leading-snug group-hover:text-teal-400 transition-colors duration-300">
                  <button
                    type="button"
                    onClick={() => setSelectedPost(post)}
                    aria-label={`Read the article: ${post.title}`}
                    className="text-left rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                  >
                    {post.title}
                  </button>
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed mb-5 flex-1">
                  {post.summary}
                </p>

                {/* Read More Indicator */}
                <button
                  type="button"
                  onClick={() => setSelectedPost(post)}
                  className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-teal-400 group-hover:text-teal-300 transition-colors self-start rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                >
                  Read More
                  <FiArrowRight
                    size={16}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {selectedPost && (
        <PostModal
          post={selectedPost}
          isOpen={true}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
};

export default Blog;
