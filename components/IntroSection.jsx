"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function IntroSection() {
  const [isDisplay, setIsDisplayed] = useState(true);

  useEffect(() => {
    const introSwitch = localStorage.getItem("introSwitch");

    if (!introSwitch) {
      localStorage.setItem("introSwitch", "on");
    } else if (introSwitch === "off") {
      setIsDisplayed(false);
    }
  }, []);

  const toggleSwitch = () => {
    localStorage.setItem("introSwitch", "off");
    setIsDisplayed(false);
  };

  if (!isDisplay) return "";

  return (
    <div className="mt-6 p-10 bg-gray-100 rounded-lg relative">
      <h1 className="text-2xl font-semibold">VoiceJournal</h1>
      <p className="mt-4">
        Journal your ideas, movements, thoughts or notes with your voice.
      </p>
      <p>You can record upto one minute of voice note.</p>
      <div className="z-10 absolute top-2 right-2">
        <button onClick={toggleSwitch} className="p-2">
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
