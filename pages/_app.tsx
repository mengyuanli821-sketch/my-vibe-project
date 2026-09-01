import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta content="#fbf9f4" name="theme-color" />
        <meta content="A mindful student notebook for yoga teachers" name="description" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
