"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  onAdd?: () => void;
  disabled: boolean;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  className?: string;
}

type State = "idle" | "loading" | "success";

// export function AddToCartButton({
//   onAdd,
//   disabled = true,
//   className,
// }: AddToCartButtonProps) {
//   const [state, setState] = useState<State>("idle");

//   const handleClick = async () => {
//     if (state !== "idle") return;

//     try {
//       setState("loading");

//       await onAdd?.(); // API call here

//       setTimeout(() => {
//         setState("success");

//         setTimeout(() => {
//           setState("idle");
//         }, 1200);
//       }, 600);
//     } catch {
//       setState("idle");
//     }
//   };

//   return (
//     <motion.button
//       onClick={handleClick}
//       whileTap={{ scale: 0.95 }}
//       className={cn(
//         "relative overflow-hidden flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium",
//         "bg-primary text-primary-foreground shadow-md",
//         "transition-colors",
//         className,
//       )}
//       disabled={disabled}
//     >
//       {/* Background Ripple */}
//       <motion.span
//         className="absolute inset-0 bg-white/10"
//         initial={{ scale: 0, opacity: 0 }}
//         animate={
//           state === "loading"
//             ? { scale: 2, opacity: 0 }
//             : { scale: 0, opacity: 0 }
//         }
//         transition={{ duration: 0.6 }}
//       />

//       <AnimatePresence mode="wait">
//         {state === "idle" && (
//           <motion.div
//             key="idle"
//             initial={{ opacity: 0, y: 6 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -6 }}
//             transition={{ duration: 0.2 }}
//             className="flex items-center gap-2"
//           >
//             <ShoppingCart size={18} />
//             <span>Add to Cart</span>
//           </motion.div>
//         )}

//         {state === "loading" && (
//           <motion.div
//             key="loading"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="flex items-center gap-2"
//           >
//             <motion.div
//               className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
//               animate={{ rotate: 360 }}
//               transition={{
//                 repeat: Infinity,
//                 duration: 0.8,
//                 ease: "linear",
//               }}
//             />
//             <span>Adding...</span>
//           </motion.div>
//         )}

//         {state === "success" && (
//           <motion.div
//             key="success"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ type: "spring", stiffness: 200 }}
//             className="flex items-center gap-2"
//           >
//             <Check size={18} />
//             <span>Added</span>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.button>
//   );
// }

export function AddToCartButton({
  onAdd,
  disabled,
  isLoading,
  isSuccess,
  isError,
  className,
}: AddToCartButtonProps) {
  const state: State = isLoading ? "loading" : isSuccess ? "success" : "idle";

  return (
    <motion.button
      onClick={onAdd}
      whileTap={{ scale: 0.95 }}
      disabled={disabled || isLoading}
      className={cn(
        "relative overflow-hidden flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium",
        "bg-primary text-primary-foreground shadow-md",
        "transition-colors",
        isError && "bg-red-500", // 🔥 error state
        className,
      )}
    >
      {/* Ripple */}
      <motion.span
        className="absolute inset-0 bg-white/10"
        initial={{ scale: 0, opacity: 0 }}
        animate={
          state === "loading"
            ? { scale: 2, opacity: 0 }
            : { scale: 0, opacity: 0 }
        }
        transition={{ duration: 0.6 }}
      />

      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2"
          >
            <ShoppingCart size={18} />
            <span>Add to Cart</span>
          </motion.div>
        )}

        {state === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <motion.div
              className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
                ease: "linear",
              }}
            />
            <span>Adding...</span>
          </motion.div>
        )}

        {state === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Check size={18} />
            <span>Added</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
