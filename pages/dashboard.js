/* eslint-disable @next/next/no-page-custom-font */
import Head from "next/head";
import Script from "next/script";
import OwnAssestList from "../components/OwnAssestList";
import WaveFooter from "../components/WaveFooter.js";
import Footer from "../components/Footer.js";
import Dashboard from "../components/Dashboard.js";

export default function Home() {
  return (
    <div>
      <Script src="https://kit.fontawesome.com/a076d05399.js" />
      <Head>
        <title>Blockchain Based NFT Application</title>
        <meta name="description" content="Blockchain based NFT application" />
      </Head>
      <main
        style={{ marginTop: "30px", marginBottom: "50px", minHeight: "70vh" }}
      >
        <div className="container">
          <h1
            className="title-main text-center"
            style={{ marginBottom: "30px", fontWeight: "bold" }}
          >
            Products you created
          </h1>
          <Dashboard />
          <h1
            className="title-main text-center"
            style={{ marginBottom: "30px", fontWeight: "bold" }}
          >
            Your assets
          </h1>
          <OwnAssestList />
        </div>
      </main>

      <footer>
        <WaveFooter />
        <Footer />
      </footer>
    </div>
  );
}
