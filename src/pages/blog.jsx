import React from "react";

import dota2Img from "../blogimages/dota2.jpg";
import cybersecurityImg from "../blogimages/cybersecurity.jpg";
import roboticsImg from "../blogimages/robotics.jpg";
import CanvasAI from "../aiAnimatedLines/alex"; // no .jsx extension here

const blogPosts = [
  {
    title: "Why Dota 2 Is More Than Just a Game",
    date: "June 5, 2025",
    image: dota2Img,
    summary:
      "Dota 2 isn’t just about quick reflexes—it’s about teamwork, strategy, and constant learning.",
    content: `Dota 2 has been the game of my life ever since, and this is because there is much more beyond clicking onto heroes and farming creeps; it delves much deeper into strategy within which every decision counts and teamwork becomes the turning point of battle.

What I love most about it is that every game is unique. You are always adjusting. You are reading your enemies; you are regrouping with your teammates, and you are thinking so many steps ahead. It is most interesting and most difficult but very rewarding. Then there is the entire Dota 2 community, where so many enthusiastic gamers share their tips and tricks, making it much more exciting.`,
  },
  {
    title: "Cybersecurity in 2025: What Everyone Should Know",
    date: "May 20, 2025",
    image: cybersecurityImg,
    summary:
      "Cybersecurity isn’t just for tech experts—it’s something we all need to understand in today’s connected world.",
    content: `Cybersecurity has not entered the great realm of buzzword any longer; the year is 2025, and it is now a necessity. With a connected lifestyle from smart homes all the way to mobile banking, the risks have also climbed higher.

The threats are vast and keep evolving, ranging from the usual theft of personal data to large-scale industrial attacks. The key factor is awareness, using strong passwords, two-factor authentication, and knowing how to identify phishing scams. This knowledge helps mitigate most of the problems. Whether you are a developer or a business owner or just someone browsing the Internet, keeping well-informed is your greatest defense.`,
  },
  {
    title: "How Robotics Is Changing Our Everyday Lives",
    date: "April 10, 2025",
    image: roboticsImg,
    summary:
      "Robots aren’t just sci-fi anymore—they’re here, and they’re making real changes in healthcare, manufacturing, and even our homes.",
    content: `Since the good ol' days of futuristic movies, robotics has crossover from being an abstract fantasy to a legitimate tool altering various facets of everyday life. Surgical robots assist doctors in performing surgery with precision, while warehouse bots expedite the delivery process. Altogether, robots have contributed towards speed, safety, and efficiency.

One of the coolest is the way robotics has gone mainstream—kits for education and DIY projects allow many more people to not only learn how these machines operate but build their own. With changing technology, I look forward to the day robots will essentially change the way we live and work.`,
  },
];

const Blog = () => {
  return (
    <div className="blog-wrapper relative min-h-screen px-4 py-10 text-white bg-primary">
      {/* AI Lines Canvas */}
      <CanvasAI />

      <h1 className="text-4xl font-bold mb-10 text-center">My Blog</h1>

      <div className="max-w-4xl mx-auto relative z-10">
        {blogPosts.map((post, index) => (
          <article
            key={index}
            className="mb-12 p-6 rounded-xl bg-[#273549] shadow-lg"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 object-cover rounded-xl mb-6"
            />
            <h2 className="text-2xl font-semibold text-teal-400 mb-2">{post.title}</h2>
            <p className="text-sm text-gray-400 mb-4">{post.date}</p>
            <p className="mb-4">{post.summary}</p>
            <details className="text-gray-300 cursor-pointer">
              <summary className="mb-2 underline text-orange-400">Read More</summary>
              <p className="mt-2 whitespace-pre-line">{post.content}</p>
            </details>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog;
