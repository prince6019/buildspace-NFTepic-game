import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import Head from "next/head";
import "@/styles/globals.css";
import { MoralisProvider } from "react-moralis";
export default function App({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <Head>
        <title>Epic Game</title>
      </Head>
      <Component {...pageProps} />
      <Navbar />
      <Footer />
    </MoralisProvider>
  );
}
