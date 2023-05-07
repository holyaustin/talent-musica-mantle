import { Navbar, Footer } from "../components";
import CovalentMyNfts from "../components/covalent-get-nfts/CovalentGetNfts";

const MyNfts = () => (
  <div className="bg-gradient-to-b from-blue-700 to-black">
    <Navbar />

    <CovalentMyNfts />
    <Footer />
  </div>
);

export default MyNfts;
