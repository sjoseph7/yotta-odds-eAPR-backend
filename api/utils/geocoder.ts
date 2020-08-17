import NodeGeocoder, { Options } from "node-geocoder";

const options = {
  provider: process.env.GEOCODER_PROVIDER || "mapquest",
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY || "",
  formatter: null
};

export default NodeGeocoder(options as Options);
