/* eslint-disable react-hooks/exhaustive-deps */
import { NftsList } from "../02-molecules";
import { SwapContext, SwapIcon } from "../01-atoms";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";

import { NFT, ChainInfo, NFTsQueryStatus } from "@/lib/client/constants";
import { getNftsFrom } from "@/lib/client/blockchain-data";
import { EthereumAddress } from "@/lib/shared/types";
import { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";

/**
 *
 * The Shelf component display the NFTs of given address.
 *
 * @returns Shelf Nfts based in status of given address
 */

interface INftsShelfProps {
  address: string | null;
}

export const NftsShelf = ({ address }: INftsShelfProps) => {
  const { chain } = useAccount();
  const [nftsList, setNftsList] = useState<NFT[]>();
  const [nftsQueryStatus, setNftsQueryStatus] = useState<NFTsQueryStatus>(
    NFTsQueryStatus.EMPTY_QUERY
  );

  const { authenticatedUserAddress } = useAuthenticatedUser();
  const { validatedAddressToSwap, inputAddress, destinyChain } =
    useContext(SwapContext);

  useEffect(() => {
    const chainId =
      address === authenticatedUserAddress?.address
        ? chain?.id
        : ChainInfo[destinyChain].id;

    if (address && chainId) {
      getNftsFrom(address, chainId, setNftsQueryStatus)
        .then((nftsList) => {
          setNftsList(nftsList);
        })
        .catch(() => {
          setNftsList([]);
        });
    }
  }, [address, chain, destinyChain]);

  useEffect(() => {
    if (
      authenticatedUserAddress &&
      address &&
      authenticatedUserAddress.equals(new EthereumAddress(address))
    ) {
      setNftsList([]);
      setNftsQueryStatus(NFTsQueryStatus.EMPTY_QUERY);
    }
  }, [destinyChain]);

  useEffect(() => {
    if (address !== authenticatedUserAddress?.address) {
      setNftsList([]);
      setNftsQueryStatus(NFTsQueryStatus.EMPTY_QUERY);
    }
  }, [chain]);

  useEffect(() => {
    if (
      address !== authenticatedUserAddress?.address &&
      validatedAddressToSwap !== authenticatedUserAddress?.address
    ) {
      setNftsList([]);
      setNftsQueryStatus(NFTsQueryStatus.EMPTY_QUERY);
    }
  }, [inputAddress]);

  useEffect(() => {
    if (!validatedAddressToSwap) {
      setNftsQueryStatus(NFTsQueryStatus.EMPTY_QUERY);
    }
  }, [validatedAddressToSwap]);

  return (
    <div className="w-full flex border-2 border-gray-200 border-t-0 rounded rounded-t-none overflow-auto bg-[#f8f8f8]">
      <div className="w-[100%] lg:max-w-[580px] h-[450px]">
        <div className="flex items-center">
          {nftsQueryStatus == NFTsQueryStatus.WITH_RESULTS && nftsList ? (
            <div className="w-full h-full">
              <NftsList ownerAddress={address} nftsList={nftsList} />
            </div>
          ) : nftsQueryStatus == NFTsQueryStatus.EMPTY_QUERY || !address ? (
            <div className="flex justify-center w-full h-[450px] bg-[#f8f8f8] p-4">
              <div className="flex flex-col items-center justify-center space-y-4">
                <SwapIcon className="w-[100px]" />
                <p className="text-[#4F4F4F]">
                  Select a user to start swapping
                </p>
              </div>
            </div>
          ) : nftsQueryStatus == NFTsQueryStatus.NO_RESULTS ? (
            <div className="flex justify-center w-full h-[450px] bg-[#f8f8f8] p-4">
              <div className="flex items-center">
                <p className="text-[#4F4F4F]">
                  Given address has no NFTs associated in the given network
                </p>
              </div>
            </div>
          ) : nftsQueryStatus == NFTsQueryStatus.LOADING ? (
            <div className="flex justify-center w-full h-[450px] bg-[#f8f8f8] p-4">
              <div className="flex items-center">
                <p className="text-[#4F4F4F]">
                  Loading NFTs of{" "}
                  {new EthereumAddress(address).getEllipsedAddress()}...
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
