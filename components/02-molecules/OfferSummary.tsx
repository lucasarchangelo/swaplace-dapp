import { NftCard, SwapContext } from "../01-atoms";
import { EthereumAddress } from "@/lib/shared/types";
import { useAuthenticatedUser } from "@/lib/client/hooks/useAuthenticatedUser";
import { ChainInfo } from "@/lib/client/constants";
import { useEnsName, useAccount } from "wagmi";
import { useContext } from "react";

interface IOfferSummary {
  forAuthedUser: boolean;
}

export const OfferSummary = ({ forAuthedUser }: IOfferSummary) => {
  const { validatedAddressToSwap, nftAuthUser, nftInputUser, destinyChain } =
    useContext(SwapContext);
  const { chain } = useAccount();
  const { data } = useEnsName({
    address: validatedAddressToSwap as `0x${string}`,
  });

  const { authenticatedUserAddress } = useAuthenticatedUser();

  return (
    <div className="w-full flex flex-col gap-4 px-3 pt-2 pb-4 bg-[rgba(217,217,217,0.40)] rounded">
      <div className="flex justify-between items-center h-9 gap-2">
        <div className="flex space-x-2">
          <div className="w-6 h-6 bg-[#d9d9d9] rounded-full" />
          <div className="items-center">
            <p className="font-medium">
              {forAuthedUser
                ? "You give"
                : !forAuthedUser && !validatedAddressToSwap
                ? "Use the search bar!"
                : `${
                    data
                      ? data
                      : new EthereumAddress(
                          validatedAddressToSwap
                        ).getEllipsedAddress()
                  } gives`}
            </p>
          </div>
        </div>
        {!forAuthedUser && !validatedAddressToSwap ? null : (
          <div>
            {forAuthedUser ? nftAuthUser.length : nftInputUser.length} item
            {forAuthedUser
              ? nftAuthUser.length !== 1
                ? "s"
                : ""
              : nftInputUser.length !== 1
              ? "s"
              : ""}
          </div>
        )}
      </div>

      <div className="w-full h-full min-h-[144px] bg-[#f8f8f8] rounded p-4">
        <div className="grid grid-cols-6 gap-3">
          {(forAuthedUser && !authenticatedUserAddress?.address) ||
          (!forAuthedUser && !validatedAddressToSwap) ? null : (
            <NftCard
              withSelectionValidation={false}
              ownerAddress={
                forAuthedUser
                  ? authenticatedUserAddress
                    ? authenticatedUserAddress.address
                    : null
                  : validatedAddressToSwap
              }
              nftData={forAuthedUser ? nftAuthUser[0] : nftInputUser[0]}
            />
          )}
        </div>
      </div>

      <div className="ml-auto flex space-x-1 mr-1 text-gray-700 font-medium text-sm">
        <p>from</p>
        <p>
          {forAuthedUser ? (
            <>{chain?.name}</>
          ) : (
            <>{ChainInfo[destinyChain].name}</>
          )}
        </p>
      </div>
    </div>
  );
};
