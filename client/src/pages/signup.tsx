// Signup.tsx
import { SignupForm } from "@/components/authentication/signup-form";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Signup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row">
      {/* Left side - Animation and Text */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="lg:w-1/2 p-10 flex flex-col justify-center items-center lg:items-start space-y-8"
      >
        <h1 className="text-5xl font-bold mb-4">CineDraw</h1>
        <p className="text-xl mb-6">Where movies come to life, one sketch at a time.</p>
        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 animate-pulse"></div>
      </motion.div>

      {/* Right side - Signup Form */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="lg:w-1/2 bg-white text-black p-10 flex flex-col justify-center"
      >
        <div className="max-w-md mx-auto w-full 
       border border-purple-700
        rounded-lg
        px-3 py-10">
          <SignupForm />
          <div className="mt-6 text-center">
            Already have an account?{" "}
            <button
              onClick={() => navigate('/signin')}
              className="text-purple-600 font-semibold hover:text-purple-800 transition duration-300"
            >
              Sign In
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Signup;