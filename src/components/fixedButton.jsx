import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneCall, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FloatingActionMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleSearchClick = () => {
    navigate("/barcha-maxsulotlar", { state: { openSearch: true } });
    setOpen(false);
  };

  const handlePhoneClick = () => {
    window.location.href = "tel:+998931374426";
    setOpen(false);
  };

  // 🧠 Tashqariga bosilganda menyuni yopish
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div
      ref={menuRef}
      className="fixed bottom-22 text-white right-6 z-50 flex flex-col items-end space-y-3"
    >
      {/* Tugmalar chiqadigan joy */}
      <AnimatePresence>
        {open && (
          <>
            {/* Search tugmasi */}
            <motion.button
              initial={{ opacity: 0, y: 20, scale: 0 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 12 }}
              onClick={handleSearchClick}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {/* Telefon tugmasi */}
            <motion.button
              initial={{ opacity: 0, y: 20, scale: 0 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 12,
                delay: 0.05,
              }}
              onClick={handlePhoneClick}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600"
            >
              <PhoneCall className="w-5 h-5" />
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* Asosiy plus tugmasi */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative flex items-center justify-center w-14 h-14 bg-blue-500 text-white rounded-full shadow-xl hover:bg-blue-600 transition-colors duration-300"
      >
        <span className="absolute inset-0 rounded-full bg-blue-400 opacity-30 animate-ping"></span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          <Plus className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </div>
  );
};

export default FloatingActionMenu;
