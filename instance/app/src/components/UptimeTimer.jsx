import { useEffect, useState } from "react";
import { fetch_uptime } from "../services";
import FinishButton from "./FinishButton";

export default function UptimeTimer({children}) {
  const [remainingTime, setRemainingTime] = useState(101);

  useEffect(() => {
    const get_uptime = async () => {
      let rem_time = await fetch_uptime();
      rem_time = rem_time >= 0 ? rem_time : 0;
      setRemainingTime(rem_time);
    };

    get_uptime(); // fetch immediately
    const interval = setInterval(get_uptime, 1000); // refresh every 1s

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <>
      <p
        id="timer"
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          backgroundColor: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "8px 12px",
          borderRadius: "5px",
          fontFamily: "sans-serif",
          fontSize: "16px",
          zIndex: 9999, // make sure it's above everything
        }}
      >
        Time Remaining: {formatTime(remainingTime)}
      </p>
      {remainingTime > 0 ? (
        children
      ) : (
        <div style={{
          fontSize: "200%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "0 auto",
          color: "black",
        }}>
          <h1>Times up!</h1>
          <FinishButton></FinishButton>
        </div>
      )}
    </>);
}
