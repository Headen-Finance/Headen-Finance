import { Poppins } from "@next/font/google";
import { AppProps } from "next/app";

import "@/styles/globals.css";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: "normal",
  subsets: ["latin"],
});

import { CustomToaster } from "@/components/toaster/CustomToaster";
import Web3Provider from "@/components/web3/Web3Provider";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={poppins.className}>
      <Web3Provider>
        <Component {...pageProps} />
        <CustomToaster />
      </Web3Provider>
    </div>
  );
}

export default MyApp;
