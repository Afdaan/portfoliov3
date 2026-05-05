import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { Button } from '@/components/ui/button'

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('home')
  const [hoveredSection, setHoveredSection] = useState(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)

      // Scroll Spy Logic
      const sections = ['home', 'about', 'experience', 'skills', 'projects', 'contact']
      const scrollPosition = window.scrollY + 150

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
        setActiveSection('contact')
      } else {
        for (const section of sections) {
          const element = document.getElementById(section)
          if (element) {
            const offsetTop = element.offsetTop
            const height = element.offsetHeight
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
              setActiveSection(section)
            }
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 h-[3px] bg-primary z-[60]"
        style={{ width: `${scrollProgress}%` }}
      />

      <nav className="fixed top-6 sm:top-8 left-0 right-0 z-50 flex justify-center px-4">
        <motion.div 
          className={`flex items-center justify-between gap-4 lg:gap-10 px-4 sm:px-8 py-3 sm:py-3.5 rounded-full border transition-all duration-500 ${
            scrolled 
            ? 'w-full max-w-5xl bg-background/80 backdrop-blur-md border-border/50 shadow-xl' 
            : 'w-full max-w-6xl bg-background/40 backdrop-blur-sm border-border/20 shadow-none'
          }`}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <a href="#home" className="flex items-center gap-3 sm:gap-4 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-border group-hover:border-primary/50 transition-all duration-300 bg-card shadow-sm">
                <img src="/vivlos-rounded.png" alt="Vivlos Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-lg sm:text-xl font-bold tracking-tight hidden xs:block">
                Afdaan<span className="text-primary group-hover:animate-pulse">.</span>
              </span>
            </a>
          </div>

          {/* Desktop Nav Links (lg and above) */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 relative">
            {navLinks.map((link) => {
              const sectionId = link.href.replace('#', '')
              const isActive = activeSection === sectionId
              const isHovered = hoveredSection === sectionId
              
              return (
                <div 
                  key={link.name} 
                  className="relative px-0.5"
                  onMouseEnter={() => setHoveredSection(sectionId)}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <Button 
                    variant="ghost" 
                    asChild 
                    className={`text-[12px] xl:text-[13px] uppercase tracking-[0.15em] xl:tracking-[0.2em] font-black rounded-full px-4 xl:px-6 h-10 xl:h-11 relative z-10 transition-all duration-300 ${
                      isActive 
                      ? 'text-primary-foreground bg-primary shadow-[0_0_25px_rgba(var(--primary),0.4)]' 
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <a href={link.href}>{link.name}</a>
                  </Button>
                  
                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="nav-hover"
                      className="absolute inset-0 bg-primary/10 rounded-full z-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </div>
              )
            })}
            
            <div className="w-px h-5 bg-border/50 mx-2 xl:mx-3" />
            
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-10 h-10 xl:w-11 xl:h-11 hover:bg-primary/10 transition-colors"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>

          {/* Tablet & Mobile Toggle (below lg) */}
          <div className="flex lg:hidden items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-10 h-10 sm:w-11 sm:h-11 hover:bg-primary/10"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-10 h-10 sm:w-11 sm:h-11 hover:bg-primary/10"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </Button>
          </div>
        </motion.div>

        {/* Improved Mobile & Tablet Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Background Backdrop */}
              <motion.div 
                className="lg:hidden fixed inset-0 bg-background/40 backdrop-blur-sm z-[90]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              />
              
              <motion.div
                className="lg:hidden absolute top-24 left-4 right-4 bg-background/95 backdrop-blur-2xl border border-border rounded-[2.5rem] shadow-[0_25px_70px_rgba(0,0,0,0.4)] overflow-hidden p-8 z-[100]"
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              >
                <div className="flex flex-col gap-3">
                  {navLinks.map((link, i) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      className="group flex items-center justify-between px-6 py-5 text-2xl font-black uppercase tracking-tighter hover:bg-primary/10 rounded-2xl transition-all"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className={activeSection === link.href.replace('#', '') ? 'text-primary' : 'text-foreground'}>
                        {link.name}
                      </span>
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-primary"
                        initial={{ scale: 0 }}
                        animate={{ scale: activeSection === link.href.replace('#', '') ? 1 : 0 }}
                      />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}
