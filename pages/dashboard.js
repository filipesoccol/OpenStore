/* eslint-disable @next/next/no-page-custom-font */
import Head from "next/head";
import Script from "next/script";
import OwnAssestList from "../components/OwnAssetsList";
import Footer from "../components/Footer.js";
import CreatedAssetsList from "../components/CreatedAssetsList.js";

export default function Home() {
  return (
    <div>
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
            Created Assets
          </h1>
          <div className="d-flex flex-column gap-4">
              <CreatedAssetsList />
          </div>
          <h1
            className="title-main text-center"
            style={{ marginBottom: "30px", fontWeight: "bold" }}
          >
            Owned assets
          </h1>
          <div className="d-flex flex-column gap-4">
            <OwnAssestList />
          </div>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}
