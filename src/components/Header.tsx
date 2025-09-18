import { FaRocket } from "react-icons/fa";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <header className="relative text-center py-20 md:py-32 bg-gradient-to-b from-[var(--background)] to-[var(--background-secondary)] glass">
      <motion.h1
        className="relative text-5xl md:text-7xl font-extrabold text-gradient"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Selfheavenly
      </motion.h1>
      <p className="relative mt-6 text-xl md:text-2xl max-w-2xl mx-auto text-[var(--text-secondary)]">
        Embark on a journey where language mastery meets futuristic innovation.
      </p>
      <div className="relative mx-auto mt-8 text-4xl text-[var(--accent)]">
        <FaRocket />
      </div>
    </header>
  );
};

export default Header;
