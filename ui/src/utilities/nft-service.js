import { axios } from "axios";
import { NFTStorage, File } from "nft.storage";
import { Buffer } from "buffer";
const createImage = async (description) => {
  // You can replace this with different model API's
  const URL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2`;
  // Send the request
  const response = await axios({
    url: URL,
    method: "POST",
    headers: {
      Authorization: `Bearer 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`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      inputs: description,
      options: { wait_for_model: true },
    }),
    responseType: "arraybuffer",
  });
  const type = response.headers["content-type"];
  const data = response.data;
  const base64data = Buffer.from(data).toString("base64");
  const img = `data:${type};base64,` + base64data; // <-- This is so we can render it on the page
  return [data, img];
};

const uploadImage = async (imageData, imageDescription) => {
  // Create instance to NFT.Storage
  const nftstorage = new NFTStorage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDE0YTM1ODMxNmE1MzRDNTkzNUMyNDgzNEQzOGNDM0E4ODA2M0MzNEEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4MzQ4NTIyMDQ0MCwibmFtZSI6Ik5GVF9TVE9SQUdFIn0.XLfI7A5T6MSkJR2tHklaG_AyIHnne2AJM25M_pwL400",
  });
  // Send request to store image
  const { ipnft } = await nftstorage.store({
    image: new File([imageData], "image.jpeg", { type: "image/jpeg" }),
    name: name,
    description: imageDescription,
  });
  // Save the URL
  const url = `https://ipfs.io/ipfs/${ipnft}/metadata.json`;
  return url;
};
const mintNFT = async (provider, contract, url) => {};