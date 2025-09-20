'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Image from 'next/image'
import React from 'react'
import { 
  ChevronDown, 
  Rocket, 
  Brain, 
  BarChart3, 
  Shield, 
  Monitor, 
  Zap, 
  ArrowRight, 
  Menu, 
  X, 
  Network, 
  Database,
  AlertTriangle,
  TrendingUp,
  Users,
  CheckCircle
} from 'lucide-react'
import logo_black from "../../public/logo-transparent.png"

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Throttled scroll handler for better performance
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    // Only update if scroll difference is significant (reduces re-renders)
    if (Math.abs(currentScrollY - scrollY) > 5) {
      setScrollY(currentScrollY)
    }
  }, [scrollY])

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth <= 768)
  }, [])

  useEffect(() => {
    // Throttle scroll events for better performance
    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    handleResize() // Set initial mobile state
    
    window.addEventListener('scroll', throttledScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('scroll', throttledScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [handleScroll, handleResize])

  // Memoize heavy calculations
  const parallaxStyles = useMemo(() => ({
    backgroundTransform: !isMobile ? `translateY(${scrollY * 0.5}px) scale(1.05)` : 'scale(1.0)',
    overlayTransform: !isMobile ? `translateY(${scrollY * 0.2}px)` : 'translateY(0px)',
    contentTransform: !isMobile ? `translateY(${scrollY * 0.1}px)` : 'translateY(0px)',
  }), [scrollY, isMobile])

  // SEO-optimized structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Space Supply Chain Management Platform",
    "description": "AI-powered aerospace supply chain optimization platform for space industry manufacturers, OEMs, and suppliers. Real-time tracking, predictive analytics, and mission-critical reliability.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }

  return (
    <>
      {/* SEO Head Section */}
      <head>
        <title>Space Supply Chain Management Platform | AI-Powered Aerospace Logistics Solutions</title>
        <meta name="description" content="Revolutionize your aerospace supply chain with AI-powered predictive analytics. Space industry supply chain management platform for OEMs, manufacturers, and suppliers. Eliminate delays, reduce costs, ensure mission success." />
        <meta name="keywords" content="space supply chain, aerospace logistics, supply chain management, space industry, OEM suppliers, aerospace manufacturing, predictive analytics, mission critical systems, space mission planning, supplier network optimization, aerospace parts tracking, space program management" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Space Supply Chain Management Platform | Aerospace Logistics Solutions" />
        <meta property="og:description" content="AI-powered supply chain platform for space industry. Real-time tracking, predictive alerts, and mission-critical reliability for aerospace manufacturers." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://yoursite.com" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </head>

      <div className="min-h-screen bg-black text-white overflow-hidden">
        {/* Navigation - SEO optimized with semantic HTML */}
        <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10" role="navigation" aria-label="Main navigation">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo Section */}
              <div className="flex items-center">
                <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                  <Image 
                    alt="Space Supply Chain Platform Logo"
                    src={logo_black}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="ml-2 text-lg font-bold hidden sm:block">Space Supply Chain</span>
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#solution" className="hover:text-blue-400 transition-colors" aria-label="Learn about our aerospace supply chain solution">Supply Chain Solution</a>
                <a href="#how-it-works" className="hover:text-blue-400 transition-colors" aria-label="How our space logistics platform works">How It Works</a>
                <a href="#network" className="hover:text-blue-400 transition-colors" aria-label="Aerospace supplier network advantages">Supplier Network</a>
                <a href="#contact" className="hover:text-blue-400 transition-colors" aria-label="Contact us about space supply chain management">Contact</a>
                <button className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition-all transform hover:scale-105" aria-label="Request early access to space supply chain platform">
                  Request Early Access
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#solution" className="block px-3 py-2 hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Supply Chain Solution</a>
                <a href="#how-it-works" className="block px-3 py-2 hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>How It Works</a>
                <a href="#network" className="block px-3 py-2 hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Supplier Network</a>
                <a href="#contact" className="block px-3 py-2 hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</a>
                <div className="px-3 pt-4 pb-2">
                  <button className="w-full bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition-colors">
                    Request Early Access
                  </button>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section - Enhanced SEO */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden" aria-labelledby="hero-heading">
          {/* Optimized Background Image */}
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0"
              style={{
                transform: parallaxStyles.backgroundTransform,
                willChange: 'transform'
              }}
            >
              <div className="w-full h-full relative">
                <img
                  src="https://images.pexels.com/photos/73871/rocket-launch-rocket-take-off-nasa-73871.jpeg"
                  alt="NASA rocket launch representing advanced aerospace supply chain management and space mission logistics"
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>

            {/* Optimized overlay */}
            <div 
              className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90"
              style={{
                transform: parallaxStyles.overlayTransform,
                willChange: 'transform'
              }}
            />

            {/* Reduced particle count for performance */}
            <div className="absolute inset-0 hidden md:block">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Hero Content - SEO Enhanced */}
          <div 
            className="relative z-10 text-center max-w-6xl mx-auto px-4 pt-16"
            style={{
              transform: parallaxStyles.contentTransform,
              willChange: 'transform'
            }}
          >
            <div className="animate-fade-in-up">
              <h1 id="hero-heading" className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 sm:mb-8 tracking-tight leading-none">
                Space Industry Supply Chain
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent block mt-2">
                  Management Platform
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed">
                AI-powered aerospace supply chain optimization for OEMs, manufacturers, and suppliers. 
                Real-time tracking, predictive analytics, mission-critical reliability. Eliminate delays, 
                reduce costs, ensure space mission success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-lg sm:max-w-none mx-auto">
                <button className="bg-white text-black px-8 sm:px-10 py-4 sm:py-5 rounded-full font-semibold text-base sm:text-lg hover:bg-gray-200 transition-all transform hover:scale-105 hover:shadow-2xl flex items-center justify-center group" aria-label="Request early access to space supply chain platform">
                  Request Early Access
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-semibold text-base sm:text-lg hover:bg-white hover:text-black transition-all transform hover:scale-105 flex items-center justify-center" aria-label="See how aerospace supply chain management works">
                  See How It Works
                  <ArrowRight className="ml-3 w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10 hidden sm:block">
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-400 mb-2">Discover aerospace solutions</span>
              <ChevronDown className="w-8 h-8 text-white/70" />
            </div>
          </div>
        </section>

        {/* Problem Section - Enhanced SEO */}
        <section className="py-16 sm:py-32 bg-gradient-to-b from-black via-red-950/10 to-gray-900 relative overflow-hidden" aria-labelledby="problem-heading">
          {/* Optimized background animations */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-32 h-32 bg-red-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-40 right-20 w-48 h-48 bg-orange-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600 rounded-full blur-3xl animate-pulse opacity-30" style={{ animationDelay: '4s' }}></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 sm:mb-24">
              <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 mb-8">
                <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                <span className="text-red-300 text-sm font-semibold">AEROSPACE SUPPLY CHAIN CRISIS</span>
              </div>
              <h2 id="problem-heading" className="text-4xl sm:text-6xl md:text-8xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  Space Mission Delays
                </span>
                <br />
                <span className="text-white">Cost Billions</span>
              </h2>
              <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto">
                Aerospace supply chain disruptions cause cascade failures across space programs, 
                delaying launches and burning through budgets
              </p>
            </div>

            {/* Problem visualization with better structure */}
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-red-400 to-transparent transform -translate-x-0.5 z-10">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <X className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                {/* Problem cascade */}
                <article className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-gradient-to-br from-red-900/40 to-orange-900/40 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-red-500/30 hover:border-red-400/50 transition-all duration-500 group-hover:transform group-hover:scale-[1.02]">
                    <header className="flex items-center mb-8">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mr-4">
                        <AlertTriangle className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-300 to-orange-300 bg-clip-text text-transparent">
                        Supply Chain Cascade Failures
                      </h3>
                    </header>
                    
                    <div className="space-y-6">
                      {[
                        { icon: "📊", text: "Disconnected aerospace supplier data across departments", delay: "0s" },
                        { icon: "📧", text: "Mission-critical updates lost in email chains", delay: "0.5s" },
                        { icon: "⏰", text: "Space program delays discovered months too late", delay: "1s" },
                        { icon: "🚀", text: "Launch windows missed, missions postponed", delay: "1.5s" },
                        { icon: "💰", text: "Billions burned with idle aerospace resources", delay: "2s" }
                      ].map((item, index) => (
                        <div 
                          key={index}
                          className="flex items-center space-x-4 animate-fade-in-left"
                          style={{ animationDelay: item.delay }}
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500/30 to-orange-500/30 border border-red-400/30 flex items-center justify-center text-lg">
                            {item.icon}
                          </div>
                          <p className="text-gray-300 text-lg leading-relaxed">{item.text}</p>
                          <div className="flex-1 h-px bg-gradient-to-r from-red-500/50 to-transparent"></div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-pulse">
                      <p className="text-red-300 text-center font-medium">
                        One aerospace supplier delay = Complete mission failure
                      </p>
                    </div>
                  </div>
                </article>

                {/* Financial impact */}
                <article className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-black/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-gradient-to-br from-gray-900/60 to-black/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-white/20 hover:border-white/30 transition-all duration-500 group-hover:transform group-hover:scale-[1.02]">
                    
                    <div className="text-center mb-8">
                      <div className="relative inline-block">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center mb-4 mx-auto">
                          <Rocket className="w-10 h-10 text-gray-400 transform rotate-45" />
                        </div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-gray-500 to-gray-700"></div>
                        <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 border-2 border-gray-500 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                        </div>
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-bold text-white mb-2">Space Missions Grounded</h3>
                      <p className="text-gray-400">Dreams deferred, aerospace programs delayed</p>
                    </div>

                    <div className="text-center mb-8">
                      <div className="text-6xl sm:text-7xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4 animate-pulse">
                        $50M+
                      </div>
                      <p className="text-gray-400 text-lg mb-2">Per delayed space launch</p>
                      
                      <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30">
                        <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
                        <span className="text-red-300 text-sm font-mono">AEROSPACE COSTS RISING</span>
                      </div>
                    </div>

                    <blockquote className="relative">
                      <div className="absolute -top-2 -left-2 text-4xl text-red-400/30">&ldquo;</div>
                      <div className="bg-gradient-to-br from-red-500/10 to-transparent rounded-2xl p-6 border border-red-500/20">
                        <p className="text-gray-300 italic text-lg leading-relaxed mb-4">
                          When tier-2 aerospace suppliers experience delays, OEMs remain unaware 
                          for months, causing cascade failures across entire space programs.
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-red-400 font-bold">Result:</div>
                          <div className="text-right text-gray-400 text-sm">
                            Launch windows missed<br/>
                            Engineers idle<br/>
                            Billions lost
                          </div>
                        </div>
                      </div>
                      <div className="absolute -bottom-2 -right-2 text-4xl text-red-400/30 transform rotate-180">&rdquo;</div>
                    </blockquote>

                    <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                        <div className="text-2xl font-bold text-red-400">73%</div>
                        <div className="text-xs text-gray-400">Space Projects Delayed</div>
                      </div>
                      <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                        <div className="text-2xl font-bold text-orange-400">6mo</div>
                        <div className="text-xs text-gray-400">Average Delay</div>
                      </div>
                      <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                        <div className="text-2xl font-bold text-yellow-400">$2B</div>
                        <div className="text-xs text-gray-400">Annual Loss</div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>

            <div className="mt-16 text-center">
              <div className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 backdrop-blur-sm">
                <span className="text-red-300 font-semibold text-lg">
                  Disconnected aerospace supply chains = Grounded space missions
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section - SEO Enhanced */}
        <section id="solution" className="py-16 sm:py-32 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden" aria-labelledby="solution-heading">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <header className="text-center mb-12 sm:mb-20">
              <h2 id="solution-heading" className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
                Collaborative Aerospace Platform for
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent block">
                  Space Supply Chain Management
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
                Unified aerospace supply chain data platform connecting suppliers, OEMs, and manufacturers. 
                Real-time lead times, capacity tracking, delay alerts, and logistics optimization. 
                AI-powered predictions prevent failures before they impact space missions.
              </p>
            </header>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-3xl p-8 sm:p-12 border border-white/10 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <article className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 mb-6">
                      <Rocket className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Aerospace OEMs & Primes</h3>
                    <p className="text-gray-400 text-sm">Real-time visibility into entire space industry supplier networks</p>
                  </article>

                  <article className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-400 mb-6 mx-auto">
                      <Network className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Unified Space Supply Chain Platform</h3>
                    <p className="text-gray-400 text-sm">Single source of truth with AI-powered aerospace logistics insights</p>
                  </article>

                  <article className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-400 mb-6">
                      <Monitor className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Aerospace Suppliers</h3>
                    <p className="text-gray-400 text-sm">Streamlined reporting and space industry collaboration tools</p>
                  </article>
                </div>

                {/* Connection visualization */}
                <div className="hidden md:block absolute inset-0 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="16.66" y1="50" x2="50" y2="50" stroke="url(#gradient1)" strokeWidth="0.5" opacity="0.6" />
                    <line x1="50" y1="50" x2="83.33" y2="50" stroke="url(#gradient2)" strokeWidth="0.5" opacity="0.6" />
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 sm:py-32 bg-gradient-to-b from-black to-gray-900 relative" aria-labelledby="how-it-works-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-12 sm:mb-20">
              <h2 id="how-it-works-heading" className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
                From Aerospace Data to Decisions,
                <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent block">
                  Seamlessly Optimized
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
                Our space supply chain management system transforms raw aerospace data into actionable insights
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Step 1 */}
              <article className="text-center group">
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 group-hover:scale-110 transition-transform">
                    <Database className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-400 text-black text-xs font-bold flex items-center justify-center">1</div>
                </div>
                <h3 className="text-lg font-bold mb-3">Aerospace Data Input</h3>
                <p className="text-gray-400 text-sm">
                  Space suppliers and OEMs input order statuses, capacity forecasts, manufacturing data
                </p>
              </article>

              {/* Step 2 */}
              <article className="text-center group">
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400 group-hover:scale-110 transition-transform">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-400 text-white text-xs font-bold flex items-center justify-center">2</div>
                </div>
                <h3 className="text-lg font-bold mb-3">AI Prediction Engine</h3>
                <p className="text-gray-400 text-sm">
                  Machine learning forecasts aerospace supply chain delays, identifies mission risks
                </p>
              </article>

              {/* Step 3 */}
              <article className="text-center group">
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-400 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-400 text-black text-xs font-bold flex items-center justify-center">3</div>
                </div>
                <h3 className="text-lg font-bold mb-3">Supply Chain Optimization</h3>
                <p className="text-gray-400 text-sm">
                  System suggests replans, alternative aerospace sourcing, inventory optimization
                </p>
              </article>

              {/* Step 4 */}
              <article className="text-center group">
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-400 group-hover:scale-110 transition-transform">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-orange-400 text-black text-xs font-bold flex items-center justify-center">4</div>
                </div>
                <h3 className="text-lg font-bold mb-3">Space Industry Collaboration</h3>
                <p className="text-gray-400 text-sm">
                  Unified dashboard and messaging eliminates buried emails in aerospace projects
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-16 sm:py-32 bg-gradient-to-b from-gray-900 to-black relative" aria-labelledby="social-proof-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-12 sm:mb-20">
              <h2 id="social-proof-heading" className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
                Trusted Aerospace Principles,
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent block">
                  Validated by NASA & DoD
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
                Our space supply chain management approach is grounded in proven aerospace industry standards
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <article className="bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-2xl p-8 border border-red-500/20">
                <div className="flex items-start mb-4">
                  <Shield className="w-8 h-8 text-red-400 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-red-400 mb-2">NASA Inspector General</h3>
                    <p className="text-gray-300 italic">
                      &ldquo;Space launch delays due to aerospace supply chain constraints have cost billions in program overruns.&rdquo;
                    </p>
                  </div>
                </div>
              </article>

              <article className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-8 border border-blue-500/20">
                <div className="flex items-start mb-4">
                  <BarChart3 className="w-8 h-8 text-blue-400 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-blue-400 mb-2">GAO Aerospace Reports</h3>
                    <p className="text-gray-300 italic">
                      &ldquo;Delays in tier-2/3 aerospace suppliers create cascading failures across space programs.&rdquo;
                    </p>
                  </div>
                </div>
              </article>
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-400 max-w-3xl mx-auto">
                These findings validate the critical need for unified aerospace supply chain transformation 
                in the space industry, supporting mission-critical reliability standards.
              </p>
            </div>
          </div>
        </section>

        {/* Network Advantage Section */}
        <section id="network" className="py-16 sm:py-32 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden" aria-labelledby="network-heading">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-20 w-64 h-64 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <header className="text-center mb-12 sm:mb-20">
              <h2 id="network-heading" className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
                Aerospace Supply Chain Network
                <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent block">
                  Gets Smarter With Every Supplier
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
                The more aerospace OEMs and space suppliers that connect, the more accurate forecasts become. 
                Network effects accelerate risk detection and strengthen the entire space industry ecosystem.
              </p>
            </header>

            <div className="relative">
              <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-3xl p-8 sm:p-12 border border-white/10 backdrop-blur-sm">
                {/* Network Visualization */}
                <div className="relative h-64 sm:h-80 mb-8" aria-label="Space industry network visualization">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Central Hub */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center z-10">
                      <Network className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Supplier Nodes */}
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 animate-pulse"
                        style={{
                          transform: `rotate(${i * 45}deg) translateY(-80px) rotate(-${i * 45}deg)`,
                          animationDelay: `${i * 0.5}s`,
                        }}
                      />
                    ))}
                    
                    {/* Extended Network */}
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={`outer-${i}`}
                        className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 animate-pulse opacity-60"
                        style={{
                          transform: `rotate(${i * 30}deg) translateY(-120px) rotate(-${i * 30}deg)`,
                          animationDelay: `${i * 0.3}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-3xl font-bold text-green-400 mb-2">+50%</div>
                    <p className="text-gray-400">Aerospace Forecast Accuracy Improvement</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-400 mb-2">-75%</div>
                    <p className="text-gray-400">Space Mission Risk Detection Time</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-400 mb-2">10x</div>
                    <p className="text-gray-400">Faster Supply Chain Problem Resolution</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-16 sm:py-32 bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-cyan-900/30 backdrop-blur-sm border-y border-white/10 relative overflow-hidden" aria-labelledby="cta-heading">
          <div className="absolute inset-0 opacity-20">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-px h-px bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${1 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>

          <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 id="cta-heading" className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
              Join the Future of Aerospace
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block">
                Supply Chain Management
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
              We are onboarding select aerospace OEMs and space suppliers into our early access program. 
              Join the transformation revolutionizing how space missions get built and launched.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-lg sm:max-w-none mx-auto">
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-semibold text-base sm:text-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 hover:shadow-2xl flex items-center justify-center group" aria-label="Join aerospace supply chain early access program">
                Join the Early Access
                <Rocket className="ml-3 w-5 h-5 group-hover:translate-y-[-2px] transition-transform" />
              </button>
              <button className="border-2 border-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-semibold text-base sm:text-lg hover:bg-white hover:text-black transition-all transform hover:scale-105 flex items-center justify-center" aria-label="Schedule aerospace supply chain demo">
                Schedule Demo
                <ArrowRight className="ml-3 w-5 h-5" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 sm:mt-16">
              <p className="text-gray-400 text-sm mb-6">Trusted by leading aerospace and space companies</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="text-2xl font-bold text-gray-400">NASA</div>
                <div className="text-2xl font-bold text-gray-400">SpaceX</div>
                <div className="text-2xl font-bold text-gray-400">Lockheed</div>
                <div className="text-2xl font-bold text-gray-400">ESA</div>
                <div className="text-2xl font-bold text-gray-400">DoD</div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 sm:py-32 bg-gradient-to-b from-gray-900 to-black relative" aria-labelledby="benefits-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-12 sm:mb-20">
              <h2 id="benefits-heading" className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
                Why Aerospace Industry Leaders
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent block">
                  Choose Our Space Supply Chain Platform
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
                Mission-critical advantages for space industry supply chain optimization
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Benefits with SEO-rich content */}
              <article className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-2xl p-8 border border-blue-500/20 hover:border-blue-400/40 transition-all">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 mb-6">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Eliminate Space Mission Surprises</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Real-time aerospace supply chain alerts prevent crises. Predictive system identifies 
                  potential space program delays weeks or months in advance.
                </p>
              </article>

              <article className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-2xl p-8 border border-green-500/20 hover:border-green-400/40 transition-all">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 mb-6">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Reduce Aerospace Costs</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Avoid millions in space launch delay penalties and idle resource costs. 
                  Optimize aerospace supply chains for maximum efficiency.
                </p>
              </article>

              <article className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-8 border border-purple-500/20 hover:border-purple-400/40 transition-all">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 mb-6">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Space Mission Assurance</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Built with aerospace-grade reliability standards. Mission-critical space operations 
                  deserve mission-critical supply chain tools.
                </p>
              </article>

              <article className="bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-2xl p-8 border border-orange-500/20 hover:border-orange-400/40 transition-all">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-400 mb-6">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Faster Aerospace Decisions</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Transform weeks of aerospace email chains into instant insights. Make informed 
                  space program decisions with real-time supply chain data.
                </p>
              </article>

              <article className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-2xl p-8 border border-cyan-500/20 hover:border-cyan-400/40 transition-all">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-400 mb-6">
                  <Network className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Space Industry Network Effects</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Join growing aerospace ecosystem where every new connection makes the entire 
                  space supply chain network smarter and more valuable.
                </p>
              </article>

              <article className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-2xl p-8 border border-indigo-500/20 hover:border-indigo-400/40 transition-all">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-400 mb-6">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">AI-Powered Aerospace Insights</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Machine learning algorithms trained on aerospace supply chain patterns 
                  predict and prevent space mission bottlenecks before they occur.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Footer - SEO Enhanced */}
        <footer className="py-16 border-t border-white/10 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Logo and Description */}
              <div className="lg:col-span-2">
                <div className="flex items-center mb-6">
                  <div className="relative w-8 h-8 mr-3">
                    <Image 
                      alt="Space Supply Chain Platform Logo"
                      src={logo_black}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <span className="text-xl font-bold">Space Supply Chain Platform</span>
                </div>
                <p className="text-gray-400 mb-6 max-w-md">
                  Revolutionizing aerospace supply chains with AI-powered insights, real-time collaboration, 
                  and predictive analytics. Built for the future of space exploration and mission success.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="LinkedIn">
                    <span className="text-sm font-bold">Li</span>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Twitter">
                    <span className="text-sm font-bold">Tw</span>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="GitHub">
                    <span className="text-sm font-bold">Gh</span>
                  </a>
                </div>
              </div>

              {/* Product Links */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Aerospace Solutions</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Supply Chain Features</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Aerospace Integrations</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Space Industry API</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Mission Security</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Platform Pricing</a></li>
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Space Supply Chain</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Aerospace Careers</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Industry News</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Support</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                <p>&copy; 2025 Space Supply Chain Platform. All rights reserved.</p>
                <p className="mt-1">Pioneering the future of aerospace logistics and space mission success.</p>
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </footer>

        {/* Optimized Custom Styles */}
        <style jsx global>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fade-in-left {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .animate-fade-in-up {
            animation: fade-in-up 1s ease-out forwards;
          }

          .animate-fade-in-left {
            animation: fade-in-left 0.8s ease-out forwards;
          }

          html {
            scroll-behavior: smooth;
          }

          /* Optimized scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }

          ::-webkit-scrollbar-track {
            background: #1a1a1a;
          }

          ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #3b82f6, #8b5cf6);
            border-radius: 4px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #2563eb, #7c3aed);
          }

          /* Performance optimizations */
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          .group:hover .group-hover\\:scale-110 {
            transform: scale(1.1);
          }

          .group:hover .group-hover\\:translate-x-1 {
            transform: translateX(4px);
          }

          .group:hover .group-hover\\:translate-y-\\[-2px\\] {
            transform: translateY(-2px);
          }

          /* Reduce motion for accessibility */
          @media (prefers-reduced-motion: reduce) {
            .animate-pulse,
            .animate-bounce,
            .animate-fade-in-up,
            .animate-fade-in-left {
              animation: none;
            }
            
            .transition-transform,
            .transition-all {
              transition: none;
            }
          }
        `}</style>
      </div>
    </>
  )
}