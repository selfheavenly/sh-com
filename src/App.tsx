import AboutSection from "./components/AboutSection";
import AppSection from "./components/AppSection";
import ContactSection from "./components/ContactSection";
import Header from "./components/Header";
import PublicationsSection from "./components/PublicationsSection";
import { motion } from "framer-motion";

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <AppSection />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <AboutSection />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <PublicationsSection />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <ContactSection />
        </motion.div>
      </main>
      <footer className="text-center py-8 border-t border-white/10">
        <p className="text-sm opacity-70">
          &copy; 2025 SelfHeavenly.com | Pioneering Tomorrow's Realms
        </p>
      </footer>
    </div>
  );
}

export default App;
