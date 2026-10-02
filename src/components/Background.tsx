import React from "react";
import  LightRays  from "./LightRays";

const Background: React.FC = () => {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }}>
      <LightRays
        raysColor="#ff6ec7" // Light color
        raysSpeed={0.2} // Animation speed
        lightSpread={0.5} // Light intensity
      />
    </div>
  );
};

export default Background;
