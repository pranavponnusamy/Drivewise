import React from "react";
import styles from "./Features.module.css";

import route from "../assets/route.png";
import chat from "../assets/chat.png";
import profile from "../assets/profile.png";
import score from "../assets/score.png";
import { FaCircleCheck } from "react-icons/fa6";

const featuresData = [
  {
    id: 1,
    title: "Route Planning",
    description:
      "Google Maps but optimized for safety over speed. Our AI model is trained on 22 years of historical accident data to create safer routes.",
    checks: [
      "3.1 million accidents analyzed",
      "Momentum-based route planning algorithm",
      "Variety of safety vs. efficiency levels to select",
    ],
    image: route,
  },
  {
    id: 2,
    title: "Driving Score",
    description:
      "Our AI model analyzes your driving habits and gives you a score based on your driving safety.",
    checks: [
      "Factors speed data to speed limits",
      "Detects sudden braking based on accelerometer data",
      "Detects driving infractions",
    ],
    image: score,
  },
  {
    id: 3,
    title: "New Driver Education",
    description:
      "Chat with an LLM trained on the new driver education handbook to learn the rules of the road.",
    checks: ["2 model MOE", "24/7 availability"],
    image: chat,
  },
  {
    id: 4,
    title: "Driver Profile",
    description: "We gamify driving safety to make learning fun.",
    checks: [
      "Streaks",
      "Trip data",
      "Skill-improvement challenges",
      "Difficulty Adjustments which changes route planning weights",
    ],
    image: profile,
  },
];

export const Features = () => {
  return (
    <div className={styles.container} id="features">
      {featuresData.map((feature) => {
        return (
          <div
            className={`${styles.feature} ${
              feature.id % 2 === 0 && styles.left
            }`}
            key={feature.id}
          >
            <div
              className={`${styles.content} ${
                feature.id & (2 == 0) && styles.leftContent
              }`}
            >
              <h1 className={styles.title}>{feature.title}</h1>
              <p className={styles.description}>{feature.description}</p>
              {feature.checks.map((check) => {
                return (
                  <div className={styles.check}>
                    <FaCircleCheck className={styles.icon} />
                    <p>{check}</p>
                  </div>
                );
              })}
            </div>
            <img
              src={feature.image}
              alt={feature.title}
              className={styles.featureImage}
            />
          </div>
        );
      })}
    </div>
  );
};
