import React, { useState, useCallback } from "react";
import { Canvas } from "./components/Canvas";
import { Goo } from "./components/Goo";
import { Intro } from "./components/Intro";
import { Toolbar } from "./components/Toolbar";
import { usePainter } from "./hooks/usePainter";
import ipfs from "./hooks/useIpfs";
import storehash from "./helpers/storeHash"

const App = () => {
  const [dateUrl, setDataUrl] = useState("#") as any; 
  const [txHash, setTxHash] = useState("");
  const [{ canvas, isReady, ...state }, { init, ...api }] = usePainter();

  const handleDownload = useCallback(async () => {
    if (!canvas || !canvas.current) return;

    canvas.current.toDataURL("image/png");

    const string = canvas.current.toDataURL("image/png")
    const regex = /^data:.+\/(.+);base64,(.*)$/;

    const matches = string.match(regex);
    const ext = matches[1];
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');

    const ipfsHash = await ipfs.add(buffer, (err: any, ipfsHash: any) => {
      setDataUrl(ipfsHash[0].hash as string);
      console.log(err,ipfsHash);
      //setState by setting ipfsHash to ipfsHash[0].hash 

      // call Ethereum contract method "sendHash" and .send IPFS hash to etheruem contract 
      //return the transaction hash from the ethereum contract
      //see, this https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send
      
      // storehash.methods.sendHash(dateUrl).send({
        //   from: accounts[0] 
        // }, (error, transactionHash) => {
          //   console.log(transactionHash);
          //   setTxHash(transactionHash);
          // })
          return
        })
        console.log(dateUrl)
  }, [canvas]);

  const toolbarProps = { ...state, ...api, dateUrl, handleDownload };

  return (
    <>
      <Intro isReady={isReady} init={init} />
      <Toolbar {...toolbarProps} />
      <Canvas width={state.currentWidth} canvasRef={canvas} />
      <Goo />
    </>
  );
};

export default App;
