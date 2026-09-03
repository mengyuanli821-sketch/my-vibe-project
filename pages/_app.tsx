import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";
import { I18nProvider } from "@/lib/i18n";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="#fbf9f4" name="theme-color" />
        <meta content="A mindful student notebook for yoga teachers" name="description" />
      </Head>
      <I18nProvider><Component {...pageProps} /></I18nProvider>
    </>
  );
}
