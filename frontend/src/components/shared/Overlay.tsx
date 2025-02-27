import { ReactNode } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  isTransparent?: boolean;
}

const Overlay = ({ children, onClick, isTransparent = false }: Props) => {
  useEffect(() => {
    const body = document.body;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = "auto";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-8"
      style={{ backgroundColor: isTransparent ? "transparent" : "" }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Overlay;
