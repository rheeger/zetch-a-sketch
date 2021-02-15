import React, { useState, useCallback } from "react";
import { Canvas } from "./components/Canvas";
import { Intro } from "./components/Intro";
import { Toolbar } from "./components/Toolbar";
import { usePainter } from "./hooks/usePainter";

const App = () => {
  const [dateUrl, setDataUrl] = useState("#") as any;
  const [{ canvas, isReady, ...state }, { init, ...api }] = usePainter();

  const handleDownload = useCallback(async () => {
    if (!canvas || !canvas.current) return;
    const string = canvas.current.toDataURL("image/png")
    const regex = /^data:.+\/(.+);base64,(.*)$/;

    const matches = string.match(regex);
    const ext = matches[1];
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');

    return buffer
  }, [canvas]);

  const toolbarProps = { ...state, ...api, dateUrl, handleDownload };

  return (
    <>
      <Intro isReady={isReady} init={init} />
      <Toolbar {...toolbarProps} />
      <Canvas width={state.currentWidth} canvasRef={canvas} />
    </>
  );
};

export default App;
