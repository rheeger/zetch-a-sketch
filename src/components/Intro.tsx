import React from "react";

interface Props {
  init?: any;
  isReady?: boolean;
}

export const Intro: React.FC<Props> = ({ init, isReady }) => {
  return (
    <header className={isReady ? "hidden intro" : "intro"}>
      <div >
        <h1>zetch-a-sketch</h1>
        <button onClick={init} className="blob-btn">
          <span className="">Start Sketching</span>
        </button>
      </div>
    </header >
  );
};
