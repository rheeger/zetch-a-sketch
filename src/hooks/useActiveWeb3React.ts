import { useWeb3React as useWeb3ReactCore } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

export function useActiveWeb3React() {
    const context = useWeb3ReactCore<Web3Provider>();
    return context;
}