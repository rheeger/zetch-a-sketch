import React from "react";

interface Props {
  init?: any;
  isReady?: boolean;
}

export const Intro: React.FC<Props> = ({ init, isReady }) => {
  return (
    <header className={isReady ? "hidden intro" : "intro"}>
      <div className="intro__content">
        <h1>Zetch-A-Sketch</h1>
        <button onClick={init} className="blob-btn">
          <span className="blob-text">Start Sketching</span>
          <span className="blob-btn__inner">
            <span className="blob-btn__blobs">
              <span className="blob-btn__blob"></span>
              <span className="blob-btn__blob"></span>
              <span className="blob-btn__blob"></span>
              <span className="blob-btn__blob"></span>
            </span>
          </span>
        </button>
        <p>
          Built for Zora by <strong>Robbie Heeger</strong>      |      Magic-Painter by <strong>Adrian Bece</strong>
        </p>
      </div>
    </header>
  );
};
