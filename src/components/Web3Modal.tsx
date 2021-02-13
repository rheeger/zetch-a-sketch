import * as React from "react";
import styled from "styled-components";
import Web3 from "web3";

import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Header from "./Header";
import ConnectButton from "./ConnectButton";

import {
  getChainData
} from "../helpers/utilities";

import ipfs from "../hooks/useIpfs";
import { constructMediaData, sha256FromBuffer, generateMetadata, constructBidShares, Zora } from '@zoralabs/zdk';

const SLayout = styled.div`
  position: relative;
  width: 100%;
  text-align: center;
`;
interface IAppState {
  fetching: boolean;
  address: string;
  web3: any;
  provider: any;
  connected: boolean;
  chainId: number;
  networkId: number;
  showModal: boolean;
  pendingRequest: boolean;
  result: any | null;
}

const INITIAL_STATE: IAppState = {
  fetching: false,
  address: "",
  web3: null,
  provider: null,
  connected: false,
  chainId: 1,
  networkId: 1,
  showModal: false,
  pendingRequest: false,
  result: null
};

function initWeb3(provider: any) {
  const web3: any = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: "chainId",
        call: "eth_chainId",
        outputFormatter: web3.utils.hexToNumber
      }
    ]
  });

  return web3;
}
class WalletConnectionModal extends React.Component<any, any> {
  // @ts-ignore
  public web3Modal: Web3Modal;
  public state: IAppState;

  constructor(props: any) {
    super(props);
    this.state = {
      ...INITIAL_STATE
    };

    this.web3Modal = new Web3Modal({
      network: this.getNetwork(),
      cacheProvider: true,
      providerOptions: this.getProviderOptions()
    });
  }

  public componentDidMount() {
    if (this.web3Modal.cachedProvider) {
      this.onConnect();
    }
  }

  public onConnect = async () => {
    const provider = await this.web3Modal.connect();
    await this.subscribeProvider(provider);
    const web3: any = initWeb3(provider);
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];
    const networkId = await web3.eth.net.getId();
    const chainId = await web3.eth.chainId();
    await this.setState({
      web3,
      provider,
      connected: true,
      address,
      chainId,
      networkId
    });
  };

  public subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return;
    }
    provider.on("close", () => this.resetApp());
    provider.on("accountsChanged", async (accounts: string[]) => {
      await this.setState({ address: accounts[0] });
    });
    provider.on("chainChanged", async (chainId: number) => {
      const { web3 } = this.state;
      const networkId = await web3.eth.net.getId();
      await this.setState({ chainId, networkId });
    });

    provider.on("networkChanged", async (networkId: number) => {
      const { web3 } = this.state;
      const chainId = await web3.eth.chainId();
      await this.setState({ chainId, networkId });
    });
  };

  public getNetwork = () => getChainData(this.state.chainId).network;

  public getProviderOptions = () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "6c3c2b62c28f43e39145fc5e002dd2db"
        }
      }
    };
    return providerOptions;
  };

  public toggleModal = () =>
    this.setState({ showModal: !this.state.showModal });


  public resetApp = async () => {
    const { web3 } = this.state;
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await this.web3Modal.clearCachedProvider();
    this.setState({ ...INITIAL_STATE });
  };

  public zoraMint = async (buffer: Buffer) => {
    const { web3, chainId, address } = this.state;
    const nonce = "1"

    const metadataJSON = generateMetadata('zora-20210101', {
      description: `An artwork made by: ${address}`,
      mimeType: 'image/png',
      name: `ZaS #: ${nonce}`,
      version: 'zora-20210101',
    })

    const metadataHash = sha256FromBuffer(Buffer.from(metadataJSON))
    const contentHash = sha256FromBuffer(buffer)
    const ipfsMetadataHash = await ipfs.add(Buffer.from(metadataJSON))
    const ipfsContentHash = await ipfs.add(buffer)
    console.log(metadataHash, ipfsMetadataHash, contentHash, ipfsContentHash)
    const mediaData = constructMediaData(
      `https://ipfs.io/ipfs/${ipfsContentHash[0].hash}`,
      `https://ipfs.io/ipfs/${ipfsMetadataHash[0].hash}`,
      contentHash,
      metadataHash
    )

    console.log(mediaData)
    const bidShares = constructBidShares(
      48, // creator share
      51, // owner share
      1 // prevOwner share
    )
    console.log(web3)
    const zora = new Zora(web3.eth.currentProvider, chainId)
    const tx = await zora.mint(mediaData, bidShares)
    await tx.wait(8) // 8 confirmations to finalize
  }

  public render = () => {
    const {
      address,
      connected,
      chainId,
    } = this.state;
    return (
      <SLayout>
        {address ? <Header
          connected={connected}
          address={address}
          chainId={chainId}
          killSession={this.resetApp}
        /> : <ConnectButton text="Connect Wallet" onClick={this.onConnect} />}
        <a
          className="btn btn--main btn--block"
          download="image.png"
          onClick={async () => {
            const imageData = await this.props.handleDownload()
            this.zoraMint(imageData)
          }
          }
        >
          Mint
        </a>
      </SLayout>
    );
  };
}

export default WalletConnectionModal;
