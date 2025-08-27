'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import React from 'react'
import { ChevronDown, Rocket, Brain, BarChart3, Shield, Monitor, Zap, ArrowRight, Menu, X, Orbit, Cpu, Database } from 'lucide-react'
import logo_black from "../../public/logo-transparent.png"

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    
    // Set initial mobile state
    handleResize()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const features = [
    {
      icon: <Brain className="w-12 h-12" />,
      title: "AI-Driven Cargo Manifesting",
      subtitle: "Intelligent Optimization Engine",
      description: "Our advanced AI module automatically generates optimized cargo manifests for launch vehicles using sophisticated machine learning algorithms. The system intelligently balances factors like redundancy for critical items, mission parameters, and vehicle constraints to ensure maximum efficiency.",
      details: [
        "Linear programming optimization for complex cargo arrangements",
        "3D visualization of cargo layouts with interactive manifests",
        "Automated prioritization based on mission criticality",
        "Exportable reports for mission planning teams"
      ],
      gradient: "from-blue-500 to-cyan-400",
      img: "https://images.pexels.com/photos/586065/pexels-photo-586065.jpeg",
    },
    {
      icon: <Monitor className="w-12 h-12" />,
      title: "Digital Twin Inventory",
      subtitle: "Real-Time Asset Tracking",
      description: "Every item in your inventory gets a comprehensive digital twin - a virtual representation tracked through advanced sensor integration. Our system provides autonomous monitoring capabilities that eliminate human error and enable instant asset location.",
      details: [
        "RFID and computer vision integration for seamless tracking",
        "Real-time inventory dashboards with status monitoring",
        "Instant queries for any item location or status",
        "Automated alerts for misplaced or damaged items"
      ],
      gradient: "from-purple-500 to-pink-400",
      img: "https://images.pexels.com/photos/33546084/pexels-photo-33546084.jpeg",
    },
    {
      icon: <BarChart3 className="w-12 h-12" />,
      title: "Consumption Modeling",
      subtitle: "Predictive Resource Analytics",
      description: "Machine learning-powered consumption modeling analyzes resource usage patterns to predict depletion timelines with unprecedented accuracy. Our system learns from historical data to provide data-backed resupply recommendations.",
      details: [
        "ML algorithms for consumption pattern recognition",
        "Automated low-stock alerts with precise timing",
        "Crew and equipment-specific usage modeling",
        "Adjustable prediction models with user inputs"
      ],
      gradient: "from-green-500 to-emerald-400",
      img: "https://images.pexels.com/photos/586045/pexels-photo-586045.jpeg",
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Mission Simulation",
      subtitle: "Risk Assessment Platform",
      description: "Advanced Monte Carlo simulations model the impact of various scenarios on your supply chain. From dust storms to equipment failures, our system helps you prepare for every contingency with detailed risk assessments.",
      details: [
        "Monte Carlo methods for scenario modeling",
        "Criticality scoring for missions and items",
        "User-configurable event probability settings",
        "Comprehensive scenario impact reports"
      ],
      gradient: "from-orange-500 to-red-400",
      img: "https://images.pexels.com/photos/256219/pexels-photo-256219.jpeg",
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Secure Earth Monitoring",
      subtitle: "Mission Control Integration",
      description: "Cloud-based dashboard enables Earth-based teams to maintain oversight during communication windows while preserving autonomous operations. Secure data synchronization ensures mission control stays informed without compromising on-site autonomy.",
      details: [
        "Encrypted data transmission during comm windows",
        "Read-only access for Earth-based oversight",
        "Comprehensive data export capabilities",
        "Hybrid model balancing autonomy and control"
      ],
      gradient: "from-violet-500 to-purple-400",
      img: "https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg",
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="relative w-30 h-30 sm:w-40 sm:h-40">
                <Image 
                  alt="AetherLogistics Logo"
                  src={logo_black}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-gray-300 transition-colors">Features</a>
              <a href="#technology" className="hover:text-gray-300 transition-colors">Technology</a>
              <a href="#technology" className="hover:text-gray-300 transition-colors">Work with us</a>
              <a href="#contact" className="hover:text-gray-300 transition-colors">Contact</a>
              <button className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition-all transform hover:scale-105">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-md border-b border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 hover:text-gray-300 transition-colors" onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#technology" className="block px-3 py-2 hover:text-gray-300 transition-colors" onClick={() => setIsMenuOpen(false)}>Technology</a>
              <a href="#technology" className="block px-3 py-2 hover:text-gray-300 transition-colors" onClick={() => setIsMenuOpen(false)}>Work with us</a>
              <a href="#contact" className="block px-3 py-2 hover:text-gray-300 transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</a>
              <div className="px-3 pt-4 pb-2">
                <button className="w-full bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Multiple Parallax Layers */}
        <div className="absolute inset-0">
          {/* Background Image Layer */}
          <div 
            className="absolute inset-0"
            style={{
              transform: !isMobile ? `translateY(${scrollY * 0.5}px) scale(1.05)` : 'scale(1.0)',
            }}
          >
            <div className="w-full h-full relative">
              <img
                src="https://images.pexels.com/photos/73871/rocket-launch-rocket-take-off-nasa-73871.jpeg"
                alt="Rocket Launch"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
          
          {/* Overlay Gradients */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80"
            style={{
              transform: !isMobile ? `translateY(${scrollY * 0.2}px)` : 'translateY(0px)',
            }}
          />
          
          {/* Animated Particles - Hidden on mobile for performance */}
          <div className="absolute inset-0 hidden md:block">
            {[...Array(20)].map((_, i) => (
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

        {/* Hero Content */}
        <div 
          className="relative z-10 text-center max-w-5xl mx-auto px-4 pt-16"
          style={{
            transform: !isMobile ? `translateY(${scrollY * 0.1}px)` : 'translateY(0px)',
          }}
        >
          <div className="animate-fade-in-up">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 sm:mb-8 tracking-tight leading-none">
              The Future of
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent block mt-2">
                Space Logistics
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
              Autonomous inventory management and supply chain optimization engineered for Mars missions, lunar bases, and the infinite frontier beyond
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-lg sm:max-w-none mx-auto">
              <button className="bg-white text-black px-8 sm:px-10 py-4 sm:py-5 rounded-full font-semibold text-base sm:text-lg hover:bg-gray-200 transition-all transform hover:scale-105 hover:shadow-2xl flex items-center justify-center group">
                Explore Platform
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                className="border-2 border-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-semibold text-base sm:text-lg hover:bg-white hover:text-black transition-all transform hover:scale-105 flex items-center justify-center"
                onClick={() => setIsVideoModalOpen(true)}
              >
                <Orbit className="mr-3 w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10 hidden sm:block">
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-400 mb-2">Scroll to explore</span>
            <ChevronDown className="w-8 h-8 text-white/70" />
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="h-16 sm:h-32 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent"></div>
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent"></div>
        </div>
      </div>

      {/* Features Overview */}
      <section id="features" className="py-16 sm:py-32 bg-gradient-to-b from-gray-900 to-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
              Revolutionary
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Technology
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
              Built for the unforgiving environment of space, our platform combines cutting-edge AI, predictive analytics, 
              and autonomous systems to ensure mission success across the solar system.
            </p>
          </div>
        </div>
      </section>

      {/* Individual Feature Sections */}
      {features.map((feature, index) => (
        <section 
          key={index} 
          className={`py-16 sm:py-32 relative overflow-hidden ${
            index % 2 === 0 ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-black to-gray-900'
          }`}
        >
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-5">
            <div className={`absolute top-20 ${index % 2 === 0 ? 'right-20' : 'left-20'} w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br ${feature.gradient} rounded-full blur-3xl`}></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
              index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
            }`}>
              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className={`inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 sm:mb-8`}>
                  <div className="text-white">
                    {React.cloneElement(feature.icon, { className: "w-8 sm:w-12 h-8 sm:h-12" })}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {feature.subtitle}
                  </h3>
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                    {feature.title}
                  </h2>
                </div>
                
                <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="space-y-3 sm:space-y-4">
                  {feature.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-start space-x-4">
                      <div className={`w-2 h-2 rounded-full mt-2 sm:mt-3 flex-shrink-0 bg-gradient-to-r ${feature.gradient}`}></div>
                      <p className="text-sm sm:text-base text-gray-400">{detail}</p>
                    </div>
                  ))}
                </div>
                
                <button className={`mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg bg-gradient-to-r ${feature.gradient} text-white hover:scale-105 transition-all transform hover:shadow-2xl flex items-center`}>
                  Learn More
                  <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5" />
                </button>
              </div>
              
              {/* Visual */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''} order-first lg:order-none`}>
                <div className="relative">
                  <div className={`relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br ${feature.gradient} p-1`}>
                    <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden relative">
                      <img
                        src={feature.img}
                        alt={`${feature.title} Technology`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20"></div>
                      
                      <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-4 border border-white/20">
                          <div className={`text-xs sm:text-sm font-mono bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                            SYSTEM ACTIVE
                          </div>
                          <div className="text-white text-base sm:text-lg font-semibold mt-1">
                            {feature.title}
                          </div>
                          <div className="text-gray-300 text-xs sm:text-sm mt-1">
                            Ready for deployment
                          </div>
                        </div>
                      </div>

                      <div className={`absolute top-4 sm:top-6 right-4 sm:right-6 inline-flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-br ${feature.gradient} backdrop-blur-md border border-white/20`}>
                        <div className="text-white">
                          {React.cloneElement(feature.icon, { className: "w-5 sm:w-6 h-5 sm:h-6" })}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating elements */}
                  <div className={`absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gradient-to-br ${feature.gradient} opacity-60 animate-pulse`}></div>
                  <div className={`absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-4 sm:w-6 h-4 sm:h-6 rounded-full bg-gradient-to-br ${feature.gradient} opacity-40 animate-pulse`} style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Technology Showcase */}
      <section id="technology" className="py-16 sm:py-32 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-48 sm:w-72 h-48 sm:h-72 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-cyan-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8">
              Built for the
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent block">
                Red Planet
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              Every component designed to withstand the harshest conditions in the solar system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-20">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Autonomous Operation</h3>
              <p className="text-sm sm:text-base text-gray-400">Functions independently during communication blackouts with Earth, ensuring continuous mission support</p>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400 mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Database className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Predictive Intelligence</h3>
              <p className="text-sm sm:text-base text-gray-400">ML-powered consumption modeling and risk assessment for mission-critical decision making</p>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-400 mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Zero-Failure Tolerance</h3>
              <p className="text-sm sm:text-base text-gray-400">Mission-critical reliability engineered for extreme environments and extended isolation</p>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10">
              <img
                src="https://images.pexels.com/photos/73871/rocket-launch-rocket-take-off-nasa-73871.jpeg"
                alt="Mars Mission Technology"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8">
                <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div>
                      <div className="text-green-400 text-xs sm:text-sm font-mono">SYSTEM STATUS</div>
                      <div className="text-white text-lg sm:text-xl font-semibold">OPERATIONAL</div>
                    </div>
                    <div>
                      <div className="text-blue-400 text-xs sm:text-sm font-mono">MISSION TIMELINE</div>
                      <div className="text-white text-lg sm:text-xl font-semibold">847 DAYS</div>
                    </div>
                    <div>
                      <div className="text-purple-400 text-xs sm:text-sm font-mono">INVENTORY STATUS</div>
                      <div className="text-white text-lg sm:text-xl font-semibold">OPTIMAL</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-16 sm:py-32 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-cyan-900/20 backdrop-blur-sm border-y border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          {[...Array(50)].map((_, i) => (
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
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
            Ready to Launch Your
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block">
              Mission?
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
            Join the next generation of space logistics. Experience autonomous inventory management 
            designed for the final frontier, tested for Mars, and ready for anywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-lg sm:max-w-none mx-auto">
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-semibold text-base sm:text-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 hover:shadow-2xl flex items-center justify-center group">
              Request Demo
              <Rocket className="ml-3 w-5 h-5 group-hover:translate-y-[-2px] transition-transform" />
            </button>
            <button className="border-2 border-white px-10 py-5 rounded-full font-semibold text-lg hover:bg-white hover:text-black transition-all transform hover:scale-105">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <span className="text-xl font-bold tracking-tight"><div className="relative w-10 h-10 sm:w-32 sm:h-32">
                <Image 
                  alt="AetherLogistics Logo"
                  src={logo_black}
                  fill
                  className="object-contain"
                  priority
                />
              </div></span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>&copy; 2025 AetherLogistics. Pioneering the future of space logistics.</p>
              <p className="text-sm mt-2">Built for Mars. Tested on Earth. Ready for anywhere.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-6xl mx-auto px-4">
            {/* Close Button */}
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute -top-16 right-4 z-10 bg-white/10 backdrop-blur-md rounded-full p-3 border border-white/20 hover:bg-white/20 transition-all"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            {/* Video Container */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/20 bg-black">
              <iframe
                src="https://www.youtube.com/embed/ujX6CuRELFE?autoplay=1&rel=0&modestbranding=1"
                title="AetherLogistics Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            
            {/* Modal Background Click to Close */}
            <div 
              className="absolute inset-0 -z-10"
              onClick={() => setIsVideoModalOpen(false)}
            />
          </div>
        </div>
      )}

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
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  )
}