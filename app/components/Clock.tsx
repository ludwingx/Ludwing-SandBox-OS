"use client";

import { useState, useEffect } from "react";

/**
 * Functional clock for the Windows 2000 system tray.
 * Shows time in HH:MM AM/PM format, updates every minute.
 */
export default function Clock() {
  const [time, setTime] = useState<string>("");
  const [fullDate, setFullDate] = useState<string>("");

  useEffect(() => {
    function updateTime() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      setTime(`${displayHours}:${minutes} ${ampm}`);

      // Full date for tooltip
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      setFullDate(now.toLocaleDateString("en-US", options));
    }

    updateTime();
    const interval = setInterval(updateTime, 30000); // update every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="win2k-sunken-thin flex items-center px-2 h-[22px] text-[11px]"
      style={{ background: "#C0C0C0" }}
      title={fullDate}
    >
      <span className="select-none">{time}</span>
    </div>
  );
}
