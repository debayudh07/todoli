"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { Menu, X, CheckCircle, List, Bell, Zap } from "lucide-react"

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col text-purple-400">
      {/* Navbar */}
      <motion.nav 
        className="bg-gray-900 p-4"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-purple-300">
             TODOX
          </Link>
          <div className="hidden md:flex space-x-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link href="/features" className="hover:text-purple-300 transition-colors">Features</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link href="/pricing" className="hover:text-purple-300 transition-colors">Pricing</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link href="/about" className="hover:text-purple-300 transition-colors">About</Link>
            </motion.div>
          </div>
          <motion.button 
            onClick={toggleMenu} 
            className="md:hidden text-purple-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        className={`md:hidden bg-gray-900 overflow-hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        initial="closed"
        animate={isMenuOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, height: "auto" },
          closed: { opacity: 0, height: 0 }
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4">
          <Link href="/features" className="block py-2 hover:text-purple-300 transition-colors">Features</Link>
          <Link href="/pricing" className="block py-2 hover:text-purple-300 transition-colors">Pricing</Link>
          <Link href="/about" className="block py-2 hover:text-purple-300 transition-colors">About</Link>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-purple-300"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          >
            Organize Your Life
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-md mx-auto"
            variants={fadeInUp}
          >
            Simple, elegant, and purple. Your tasks, your way.
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/todolist">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold transition-colors duration-300">
              Get Started
            </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.section 
          className="w-full max-w-4xl mx-auto"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold mb-6 text-center text-purple-300"
            variants={fadeInUp}
          >
            Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              className="bg-gray-900 p-6 rounded-lg"
              variants={fadeInUp}
            >
              <CheckCircle className="text-purple-500 mb-4 h-8 w-8" />
              <h3 className="text-xl font-semibold mb-2">Easy Task Management</h3>
              <p>Create, organize, and complete tasks with just a few clicks.</p>
            </motion.div>
            <motion.div 
              className="bg-gray-900 p-6 rounded-lg"
              variants={fadeInUp}
            >
              <List className="text-purple-500 mb-4 h-8 w-8" />
              <h3 className="text-xl font-semibold mb-2">Custom Lists</h3>
              <p>Create multiple lists to categorize your tasks efficiently.</p>
            </motion.div>
            <motion.div 
              className="bg-gray-900 p-6 rounded-lg"
              variants={fadeInUp}
            >
              <Bell className="text-purple-500 mb-4 h-8 w-8" />
              <h3 className="text-xl font-semibold mb-2">Reminders</h3>
              <p>Set reminders to never miss an important task or deadline.</p>
            </motion.div>
            <motion.div 
              className="bg-gray-900 p-6 rounded-lg"
              variants={fadeInUp}
            >
              <Zap className="text-purple-500 mb-4 h-8 w-8" />
              <h3 className="text-xl font-semibold mb-2">Quick Add</h3>
              <p>Rapidly add tasks with our intuitive quick-add feature.</p>
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer 
        className="bg-gray-900 text-center p-4 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="container mx-auto">
          <p className="text-sm sm:text-base">&copy; 2023 Purple Todo. All rights reserved.</p>
          <div className="mt-2 text-sm sm:text-base">
            <Link href="/privacy" className="hover:text-purple-300 transition-colors mr-4">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-purple-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}