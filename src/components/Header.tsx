import * as React from "react";
import styled from "styled-components";
import * as PropTypes from "prop-types";
import Blockie from "./Blockie";
import Banner from "./Banner";
import { ellipseAddress, getChainData } from "../helpers/utilities";
import { transitions } from "../styles";

const SHeader = styled.div`
  margin-top: -1px;
  margin-left: -12px;
  margin-bottom: 1px;
  height: 73px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
`;

const SActiveAccount = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  font-weight: 500;
`;

const SBlockie = styled(Blockie)`
  margin-right: 10px;
`;

interface IHeaderStyle {
  connected: boolean;
}

const SAddress = styled.p<IHeaderStyle>`
  transition: ${transitions.base};
  font-weight: bold;
  margin: ${({ connected }) => (connected ? "-2px auto 0.7em" : "0")};
`;

const SDisconnect = styled.div<IHeaderStyle>`
  transition: ${transitions.button};
  font-size: 10px;
  font-family: monospace;
  position: absolute;
  right: 0;
  top: 20px;
  opacity: 0.7;
  cursor: pointer;

  opacity: ${({ connected }) => (connected ? 1 : 0)};
  visibility: ${({ connected }) => (connected ? "visible" : "hidden")};
  pointer-events: ${({ connected }) => (connected ? "auto" : "none")};

  &:hover {
    transform: translateY(-1px);
    opacity: 0.5;
  }
`;

interface IHeaderProps {
  killSession: () => void;
  connected: boolean;
  address: string;
  chainId: number;
}

const Header = (props: IHeaderProps) => {
  const { connected, address, chainId, killSession } = props;
  const chainData = chainId ? getChainData(chainId) : null;
  return (
    <SHeader {...props}>
      {address && (
        <SActiveAccount>
          <SBlockie address={address} />
          <SAddress connected={connected}>{ellipseAddress(address)}</SAddress>
          <SDisconnect connected={connected} onClick={killSession}>
            {"Disconnect"}
          </SDisconnect>
        </SActiveAccount>
      )}
    </SHeader>
  );
};

Header.propTypes = {
  killSession: PropTypes.func.isRequired,
  address: PropTypes.string,
};

export default Header;
