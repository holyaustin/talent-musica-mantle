import { Navbar, Footer, Talents } from "../components";

const explore = () => (
  <div className="bg-gray-100">
    <Navbar />
    <div className="text-4xl text-center text-black font-bold mt-10 mb-2">
      <h1> Explore Talents </h1>
    </div>
    <Talents />
    <Footer />
  </div>
);

export default explore;
