import { useForm } from "react-hook-form";
import { SignInInput, signInInput } from '@adityaat2810/cine-draw';
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock } from 'react-icons/fi';

export const SignInForm = () => {
  const navigate = useNavigate();
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInInput),
    defaultValues: {
      email: '',
      passwordHash: ''
    },
  });

  const onSubmit = async (values: SignInInput) => {
    if (!values.email || !values.passwordHash) {
      alert('Please fill all details');
      return;
    }
    try {
      const res = await axios.post('http://localhost:3000/api/v1/user/signin', values);
      if (res.data.success) {
        localStorage.setItem('authentication-token', res.data.token);
        console.log(res.data.token);
        navigate('/'); // Navigate to the home page
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      alert('Sign-in failed. Please check your credentials and try again.');
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 ml-8">Welcome Back</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-sm mx-auto">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative"
        >
          <FiMail className="absolute top-3 left-3 text-gray-400" />
          <input
            {...form.register("email")}
            type="email"
            placeholder="Email address"
            className="w-full bg-gray-50 text-gray-800 border border-gray-200 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition duration-300"
          />
          {form.formState.errors.email && (
            <p className="text-xs text-red-500 mt-1">{form.formState.errors.email.message}</p>
          )}
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative"
        >
          <FiLock className="absolute top-3 left-3 text-gray-400" />
          <input
            {...form.register("passwordHash")}
            type="password"
            placeholder="Password"
            className="w-full bg-gray-50 text-gray-800 border border-gray-200 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition duration-300"
          />
          {form.formState.errors.passwordHash && (
            <p className="text-xs text-red-500 mt-1">{form.formState.errors.passwordHash.message}</p>
          )}
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition duration-300 mt-6"
        >
          Sign In
        </motion.button>
      </form>
    </div>
  );
};