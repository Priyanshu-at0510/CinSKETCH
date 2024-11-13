import { ModeToggle } from "./mode-toogel"
import { Button } from "./ui/button"
import { Avatar } from "./utils/avatar"
import { Search } from "./utils/search"
import { motion } from "framer-motion";
import { FiMenu, } from 'react-icons/fi';

function Header() {

  return (
    <motion.header 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-zinc-50 dark:bg-black text-whiteblack dark:text-white border-b border-gray-200 dark:border-gray-800"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <a href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 text-transparent bg-clip-text">
              CineDraw
            </a>
            <nav className="hidden md:flex space-x-6">
              <NavLink href="/explore">Explore</NavLink>
              <NavLink href="/create">Create</NavLink>
              <NavLink href="/community">Community</NavLink>
            </nav>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:block w-64 mr-8">
              <Search />
            </div>
              <ModeToggle/>
              
            <Button variant="ghost" className="rounded-full p-2 bg-gray-100 dark:bg-gray-800">
              <Avatar />
            </Button>
            <Button className="md:hidden" variant="ghost">
              <FiMenu size={24} />
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

//@ts-ignore
function NavLink({ href, children }) {
  return (
    <a 
      href={href} 
      className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200 relative group"
    >
      {children}
      <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
    </a>
  )
}

export default Header