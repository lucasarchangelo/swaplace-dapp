import { wagmiConfig } from "../wallet/wallet-config";

export const capitalizeFirstLetter = (str: string) => {
  // Check if the input is a non-empty string
  if (typeof str !== "string" || str.length === 0) {
    return str;
  }

  // Capitalize the first letter and concatenate the rest of the string
  return str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase();
};

export const getTimestamp = async (chainId: any) => {
  const provider = await wagmiConfig.connectors[chainId].getProvider();
  const block = await (provider as any).getBlockNumber();
  const blockDetails = await (provider as any).getBlock({ blockNumber: block });
  return blockDetails.timestamp;
};
