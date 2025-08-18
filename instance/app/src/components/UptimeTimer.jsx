import { useEffect, useState } from "react";
import { fetch_uptime } from "../services";

export default function UptimeTimer() {
  const [uptime, setUptime] = useState(101);

  useEffect(() => {
    const get_uptime = async () => {
      setUptime(await fetch_uptime());
    };

    get_uptime(); // fetch immediately
    const interval = setInterval(get_uptime, 1000); // refresh every 1s

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (uptime <= 0) {
        window.onbeforeunload = null;
        window.removeEventListener("beforeunload", () => {});
        window.location.href = "../survey";
    }
  }, [uptime])

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div>
      <p>Backend uptime: {formatTime(uptime)}</p>
    </div>
  );
}
