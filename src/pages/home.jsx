import SButton from "@/components/Cbutton";
import NewProducts from "@/components/newProducts";
import Card from "@/components/scroll";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Header from "../components/header";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="pb-20">
      <Header />

      <div className="py-10 bg-gray-50">
        <motion.div className="text-center pb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Yangi o‘yinchoqlarimiz
            </h2>
            <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
          </div>
          <p className="text-gray-500 text-sm sm:text-base">
            Faqat siz uchun eng so‘nggi va sifatli mahsulotlar
          </p>
        </motion.div>
        <NewProducts />
        <div className="w-full text-center my-10">
          <Link to="/barcha-maxsulotlar">
            <SButton />
          </Link>
        </div>
      </div>
      <div className="w-full h-auto pb-10">
        <motion.div className="text-center pb-6">
          <div className="flex items-center justify-center gap-2 ">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              🎠 O'yinchoqlar dunyosi
            </h2>
          </div>
          <p className="text-gray-500 text-sm sm:text-base">
            Faqat siz uchun eng so‘nggi va sifatli mahsulotlar
          </p>
        </motion.div>
        <Card />
      </div>
    </div>
  );
};

export default Home;
