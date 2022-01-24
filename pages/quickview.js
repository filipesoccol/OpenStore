/* eslint-disable @next/next/no-page-custom-font */
import Head from "next/head";
import Script from "next/script";

import Navbar from "../components/Navbar";
import Itemview from "../components/ItemView";

import Footer from "../components/Footer";

export default function QuickView() {
    return (
        <div>
            <Script src="https://kit.fontawesome.com/a076d05399.js" async />
            <Head>
                <title>Blockchain Based NFT Application</title>
                <meta name="description" content="Blockchain based NFT application" />
                <link rel="icon" href="/favicon.png" />
                <link
                    rel="stylesheet"
                    href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
                    integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS"
                />
            </Head>

            <Navbar />
            <Itemview/>
          
            <main>
            </main>
            <footer>
                <Footer />
                <script
                    src="https://code.jquery.com/jquery-3.3.1.js"
                    integrity="sha256-2Kok7MbOyxpgUVvAk/HJ2jigOSYS2auK4Pfzbm7uH60="
                    async
                ></script>
                <script
                    src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js"
                    integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut"
                    async
                ></script>
                <script
                    src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js"
                    integrity="sha384-B0UglyR+jN6CkvvICOB2joaf5I4l3gm9GU6Hc1og6Ls7i6U/mkkaduKaBhlAXv9k"
                    async
                ></script>
            </footer>
        </div>
    );
}
