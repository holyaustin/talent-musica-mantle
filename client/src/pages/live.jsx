import { Navbar, Footer, Stream } from "../components";

const about = () => (
  <div className="bg-gradient-to-b from-blue-700 to-black">
    <Navbar />
    <div className="text-4xl text-center text-white font-bold  mb-10" />
    <Stream />
    <Footer />
  </div>
);

export default about;
