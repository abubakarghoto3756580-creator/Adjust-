import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Loader from './components/Loader';
import HeroVisual from './components/HeroVisual';
import BuildCarousel from './components/BuildCarousel';
import BlogSection from './components/BlogSection';
import GpsHudMap from './components/GpsHudMap';
import { SERVICES_DATA, REVIEWS_DATA } from './data';
import { Booking } from './types';
import { 
  Wrench, Settings, Gauge, Activity, Wind, Sparkles, 
  Star, Clock, MessageSquare, ShieldCheck, Zap, Heart, 
  Send, Phone, CheckCircle, Clock3, Calendar, AlertTriangle, MessageCircle, RotateCw
} from 'lucide-react';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'tuning' | 'maintenance'>('all');
  const [activeFlippedCard, setActiveFlippedCard] = useState<string | null>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  
  // Real Local Storage booking persistence
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('dreamville_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Booking Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    carDetails: '',
    service: 'ECU Remapping & Performance Tuning',
    date: '',
    notes: '',
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Stats counting state simulation
  const [stats, setStats] = useState({ reviews: 0, rating: 0, experience: 0, satisfaction: 0 });

  useEffect(() => {
    if (!isLoaded) return;

    // Trigger stat counters to increment up when site loaded
    const duration = 1200; // ms
    const steps = 30;
    const stepTime = duration / steps;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      setStats({
        reviews: Math.min(135, Math.floor((stepCount / steps) * 135)),
        rating: Math.min(4.9, parseFloat(((stepCount / steps) * 4.9).toFixed(1))),
        experience: Math.min(10, Math.floor((stepCount / steps) * 10)),
        satisfaction: Math.min(100, Math.floor((stepCount / steps) * 100))
      });

      if (stepCount >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isLoaded]);

  // Persist bookings to localStorage
  useEffect(() => {
    localStorage.setItem('dreamville_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Helper mapping string icon names to Lucide icon components
  const renderServiceIcon = (iconName: string) => {
    const iconClass = "w-6 h-6 text-blood-red";
    switch (iconName) {
      case 'Wrench': return <Wrench className={iconClass} />;
      case 'Settings': return <Settings className={iconClass} />;
      case 'Gauge': return <Gauge className={iconClass} />;
      case 'Activity': return <Activity className={iconClass} />;
      case 'Wind': return <Wind className={iconClass} />;
      case 'Sparkles': return <Sparkles className={iconClass} />;
      default: return <Wrench className={iconClass} />;
    }
  };

  // Submit appointment booking
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date) {
      alert('Please fill out Name, Phone, and preferred Date.');
      return;
    }

    const newBooking: Booking = {
      id: 'bk_' + Date.now(),
      name: formData.name,
      phone: formData.phone,
      service: formData.service,
      date: formData.date,
      carDetails: formData.carDetails || 'Not Specified',
      notes: formData.notes,
      status: 'pending'
    };

    setBookings((prev) => [newBooking, ...prev]);
    setBookingSuccess(true);
    
    // Reset form fields
    setFormData({
      name: '',
      phone: '',
      carDetails: '',
      service: 'ECU Remapping & Performance Tuning',
      date: '',
      notes: '',
    });

    // Auto clear success dialog after 5 seconds
    setTimeout(() => {
      setBookingSuccess(false);
    }, 6000);
  };

  if (!isLoaded) {
    return <Loader onComplete={() => setIsLoaded(true)} />;
  }

  const handleScrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-void-black text-steel-white font-sans overflow-x-hidden selection:bg-blood-red selection:text-steel-white">
      
      {/* HEADER NAVIGATION */}
      <Header onBookNowClick={handleScrollToBooking} />

      {/* PHASE 3 — HERO SECTION */}
      <section id="home" ref={heroSectionRef} className="relative overflow-hidden">

        {/* ================= MOBILE HERO (< lg) — single section: car as full background, text anchored at the top ================= */}
        <div className="lg:hidden relative overflow-hidden min-h-[720px] flex flex-col">

          {/* Full-bleed car background — dedicated portrait crop with a built-in dark-sky zone up top, so text never lands on the car */}
          <div className="absolute inset-0 z-0">
            <picture>
              <source srcSet="/assets/hero/bmw-m3-mobile-portrait.webp" type="image/webp" />
              <img
                src="/assets/hero/bmw-m3-mobile-portrait.jpg"
                alt="Yas Marina Blue BMW M3 parked front three-quarter under a red LED-lit Shell canopy at night"
                className="absolute inset-0 w-full h-full object-cover object-[50%_50%]"
                loading="eager"
              />
            </picture>
            {/* Top-down dark fade so the text block stays legible; eases off toward the car below */}
            <div className="absolute inset-0 bg-gradient-to-b from-void-black via-void-black/50 to-transparent" />
            {/* Gentle bottom fade so the CTA row still reads clearly over the floor/reflection */}
            <div className="absolute inset-0 bg-gradient-to-t from-void-black/75 via-transparent to-transparent" />
          </div>

          {/* Content — anchored to the top of the section, overlapping the image */}
          <div className="relative z-10 pt-20 px-6 pb-8 flex flex-col items-center text-center">

            {/* Load-in line + eyebrow strip */}
            <div className="w-full max-w-[260px] flex flex-col items-center">
              <span className="hero-line-wipe block h-[2px] bg-blood-red w-20 mb-2" />
              <span className="font-mono text-xs tracking-[0.3em] text-chrome-silver uppercase block">
                BURNABY'S JDM & PERFORMANCE SPECIALISTS
              </span>
            </div>

            {/* Headline — three scale levels */}
            <div className="hero-rise-fade flex flex-col items-center gap-1 mt-4">
              <span className="font-bebas text-xl text-chrome-silver tracking-wide leading-none">
                Where your car gets
              </span>
              <h1 className="font-bebas text-6xl text-steel-white uppercase leading-[0.95]">
                DreamVille
              </h1>
              <span className="inline-block font-bebas text-lg text-blood-red uppercase border border-blood-red px-3 py-0.5 -rotate-2 neon-glow-red mt-1.5">
                Treatment
              </span>
            </div>

            {/* Description — concrete services + a real credibility number */}
            <p className="text-sm text-chrome-silver leading-relaxed mt-4 max-w-sm">
              AWD dyno tuning, full engine rebuilds, and paint-correction detailing — 
              handled in-house by the same crew for 10+ years, with most tuning jobs 
              turned around same-day.
            </p>

            {/* Review stat — clean horizontal row, secondary to the headline */}
            <div className="flex items-center justify-center gap-2 mt-5">
              <div className="flex gap-0.5 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <span className="font-mono text-xs text-chrome-silver uppercase tracking-wide">
                4.9 · 135+ Google Reviews
              </span>
            </div>
          </div>

          {/* CTAs — pinned toward the bottom of the same overlapping section */}
          <div className="relative z-10 mt-auto px-6 pb-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleScrollToBooking}
              className="btn-primary flex-1"
            >
              BOOK APPOINTMENT
            </button>

            <a
              href="tel:604-442-8265"
              className="btn-secondary flex-1"
            >
              CALL NOW
            </a>
          </div>
        </div>

        {/* ================= DESKTOP / TABLET HERO (lg+) — unchanged full-bleed composition ================= */}
        <div className="hidden lg:block relative min-h-screen pt-28 overflow-hidden">

          {/* Full-bleed BMW hero background — car focal point pushed right/center, leaving the left clear for text */}
          <div className="absolute inset-0 z-0">
            <HeroVisual className="w-full h-full" strongOverlay />
          </div>

          {/* Particle and techy floor guides */}
          <div className="absolute inset-0 carbon-texture opacity-10 pointer-events-none z-[1]" />

          {/* Content — confined to the left third, clear of grille/headlights/hood */}
          <div className="relative z-10 w-full min-h-screen flex items-center">
            <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex flex-col items-start gap-4 w-[38%] max-w-md pl-10">

                {/* Eyebrow tag — horizontal, readable (replaces the old 90°-rotated edge label) */}
                <span className="font-mono text-xs tracking-[0.3em] text-chrome-silver uppercase">
                  BURNABY'S JDM &amp; PERFORMANCE SPECIALISTS
                </span>

                {/* Load-in line */}
                <span className="hero-line-wipe block h-[2px] bg-blood-red w-28 -mt-2 mb-1" />

                {/* Headline — three distinct scale levels + inline review stat, single rise/fade with the line above */}
                <div className="hero-rise-fade flex flex-col items-start gap-1">
                  <span className="font-bebas text-2xl text-chrome-silver tracking-wide leading-none">
                    Where your car gets
                  </span>
                  <h1 className="font-bebas text-6xl text-steel-white tracking-normal uppercase leading-[0.95]">
                    DreamVille
                  </h1>
                  <span className="inline-block font-bebas text-xl text-blood-red uppercase border border-blood-red px-3 py-0.5 -rotate-2 neon-glow-red mt-1.5">
                    Treatment
                  </span>

                  {/* Review stat — inline, quiet, no box */}
                  <div className="flex items-center gap-1.5 mt-3">
                    <div className="flex gap-0.5 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill="currentColor" />
                      ))}
                    </div>
                    <span className="font-mono text-xs text-chrome-silver uppercase tracking-wide">
                      4.9★ · 135+ Google Reviews
                    </span>
                  </div>
                </div>

                {/* Description — concrete services + a real credibility number, no vague adjectives */}
                <p className="text-base text-chrome-silver max-w-md leading-relaxed">
                  AWD dyno tuning, full engine rebuilds, and paint-correction detailing — 
                  handled in-house by the same crew for 10+ years, with most tuning jobs 
                  turned around same-day.
                </p>

                {/* Hero CTAs */}
                <div className="flex flex-wrap gap-3.5 mt-2">
                  <button
                    onClick={handleScrollToBooking}
                    className="btn-primary"
                  >
                    BOOK APPOINTMENT
                  </button>

                  <a
                    href="tel:604-442-8265"
                    className="btn-secondary"
                  >
                    CALL NOW
                  </a>
                </div>

              </div>
            </div>
          </div>

          {/* Hairline divider separating Hero and Stats (desktop) */}
          <div className="absolute bottom-0 inset-x-0 h-[2px] bg-blood-red opacity-40 z-10" />
        </div>

        {/* Hairline divider separating Hero and Stats (mobile) */}
        <div className="lg:hidden h-[2px] bg-blood-red opacity-40" />
      </section>

      {/* PHASE 4 — STATS BAR (Trigger scroll count ups) */}
      <section className="relative z-10 bg-void-black border-y border-neutral-900 py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            
            <div className="bg-carbon-gray/25 border border-neutral-900/60 rounded-none p-5 md:p-6 text-center hover:border-blood-red/40 transition-all group duration-300 transform hover:-translate-y-1">
              <span className="font-bebas text-4xl md:text-5xl text-steel-white tracking-wider block">
                {stats.reviews === 135 ? '135+' : `${stats.reviews}+`}
              </span>
              <span className="font-rajdhani text-xs font-bold text-blood-red uppercase tracking-widest block mt-1">Google Reviews</span>
              <p className="font-mono text-xs text-chrome-silver mt-2">5★ Rated Tuning</p>
              <div className="h-0.5 bg-neutral-900 group-hover:bg-blood-red mt-3 transition-colors duration-300" />
            </div>

            <div className="bg-carbon-gray/25 border border-neutral-900/60 rounded-none p-5 md:p-6 text-center hover:border-blood-red/40 transition-all group duration-300 transform hover:-translate-y-1">
              <span className="font-bebas text-4xl md:text-5xl text-steel-white tracking-wider block">
                {stats.rating === 4.9 ? '4.9★' : `${stats.rating}★`}
              </span>
              <span className="font-rajdhani text-xs font-bold text-blood-red uppercase tracking-widest block mt-1">Overall Rating</span>
              <p className="font-mono text-xs text-chrome-silver mt-2">Precision Service</p>
              <div className="h-0.5 bg-neutral-900 group-hover:bg-blood-red mt-3 transition-colors duration-300" />
            </div>

            <div className="bg-carbon-gray/25 border border-neutral-900/60 rounded-none p-5 md:p-6 text-center hover:border-blood-red/40 transition-all group duration-300 transform hover:-translate-y-1">
              <span className="font-bebas text-4xl md:text-5xl text-steel-white tracking-wider block">
                {stats.experience === 10 ? '10+ Yrs' : `${stats.experience} Yrs`}
              </span>
              <span className="font-rajdhani text-xs font-bold text-blood-red uppercase tracking-widest block mt-1">Experience</span>
              <p className="font-mono text-xs text-chrome-silver mt-2">Burnaby Master Techs</p>
              <div className="h-0.5 bg-neutral-900 group-hover:bg-blood-red mt-3 transition-colors duration-300" />
            </div>

            <div className="bg-carbon-gray/25 border border-neutral-900/60 rounded-none p-5 md:p-6 text-center hover:border-blood-red/40 transition-all group duration-300 transform hover:-translate-y-1">
              <span className="font-bebas text-4xl md:text-5xl text-steel-white tracking-wider block">
                {stats.satisfaction}%
              </span>
              <span className="font-rajdhani text-xs font-bold text-blood-red uppercase tracking-widest block mt-1">Honest Guarantee</span>
              <p className="font-mono text-xs text-chrome-silver mt-2">No Hidden Fees</p>
              <div className="h-0.5 bg-neutral-900 group-hover:bg-blood-red mt-3 transition-colors duration-300" />
            </div>

          </div>
        </div>
      </section>

      {/* PHASE 5 — SERVICES SECTION (3D card flip on hover/click) */}
      <section id="services" className="relative py-24 md:py-32 bg-void-black">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-6">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs text-blood-red tracking-[0.25em] uppercase">EXPERTISE SPECS</span>
              <h2 className="font-bebas text-4xl md:text-6xl text-steel-white tracking-wider uppercase">
                PROFESSIONAL <span className="text-blood-red">SERVICES</span>
              </h2>
            </div>
            <p className="text-sm text-chrome-silver max-w-md leading-relaxed">
              We combine elite tuner knowledge with commercial-grade tooling.
            </p>
          </div>

          {/* Flip hint — sits right above the cards it refers to, not buried in the header copy */}
          <div className="flex items-center gap-2 mb-8 text-blood-red">
            <RotateCw size={14} />
            <span className="font-mono text-xs uppercase tracking-widest">
              Tap any card to flip — see rates &amp; turnaround
            </span>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES_DATA.map((service) => {
              const isFlipped = activeFlippedCard === service.id;
              return (
                <div 
                  key={service.id}
                  onClick={() => setActiveFlippedCard(isFlipped ? null : service.id)}
                  onMouseEnter={() => setActiveFlippedCard(service.id)}
                  onMouseLeave={() => setActiveFlippedCard(null)}
                  className="relative w-full h-[260px] cursor-pointer group"
                  style={{ perspective: '1000px' }}
                >
                  {/* Corner flip signifier — visible without hovering, so the interaction is discoverable */}
                  <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-void-black/70 border border-neutral-800 group-hover:border-blood-red flex items-center justify-center text-chrome-silver group-hover:text-blood-red transition-colors pointer-events-none">
                    <RotateCw size={13} />
                  </div>

                  {/* Card Flipper Inner Box */}
                  <div 
                    className="relative w-full h-full transition-transform duration-500 ease-out"
                    style={{ 
                      transformStyle: 'preserve-3d',
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}
                  >
                    
                    {/* FRONT SIDE */}
                    <div 
                      className="absolute inset-0 bg-carbon-gray border border-neutral-900 hover:border-blood-red/40 rounded-none p-6 flex flex-col justify-between"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-none bg-neutral-950 flex items-center justify-center border border-neutral-900 group-hover:border-blood-red/30 transition-all">
                          {renderServiceIcon(service.icon)}
                        </div>
                        <h3 className="font-rajdhani text-xl font-bold tracking-wider text-steel-white">
                          {service.title}
                        </h3>
                        <p className="text-xs text-chrome-silver leading-relaxed">
                          {service.shortDesc}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-neutral-900 pt-4 mt-2">
                        <span className="font-mono text-xs text-chrome-silver tracking-wider uppercase">VIEW DETAILS</span>
                        <span className="text-blood-red font-mono text-xs font-semibold group-hover:translate-x-1.5 transition-transform">&rarr;</span>
                      </div>
                    </div>

                    {/* BACK SIDE */}
                    <div 
                      className="absolute inset-0 bg-neutral-950 border border-blood-red/50 hover:border-blood-red rounded-none p-6 flex flex-col justify-between"
                      style={{ 
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    >
                      <div className="flex flex-col gap-3">
                        <span className="font-mono text-xs text-blood-red tracking-widest uppercase font-semibold">ESTIMATED PARAMETERS</span>
                        <h4 className="font-rajdhani text-lg font-bold text-steel-white leading-tight">{service.title}</h4>
                        <p className="text-xs text-chrome-silver leading-relaxed mt-1">
                          {service.details}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 border-t border-neutral-900 pt-3">
                        <div>
                          <span className="font-mono text-xs text-neutral-500 uppercase block">RATES FROM:</span>
                          <strong className="font-mono text-sm text-steel-white">{service.price}</strong>
                        </div>
                        <div>
                          <span className="font-mono text-xs text-neutral-500 uppercase block">EST_TIME:</span>
                          <strong className="font-mono text-sm text-blood-red">{service.turnaround}</strong>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* PHASE 7 — WORK GALLERY (3D Coverflow Carousel) */}
      <section id="gallery" className="relative py-24 md:py-32 bg-void-black border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16 gap-3">
            <span className="font-mono text-xs text-blood-red tracking-[0.25em] uppercase">TUNER PORTFOLIO</span>
            <h2 className="font-bebas text-4xl md:text-6xl text-steel-white tracking-wider uppercase">
              FRESH <span className="text-blood-red">BUILDS</span> & LOGS
            </h2>
            <p className="text-sm text-chrome-silver leading-relaxed">
              Discover recently customized vehicles out of our garage. 
              Swipe or click on side-cards to glide them into center stage.
            </p>
          </div>

          {/* Coverflow component */}
          <BuildCarousel />

        </div>
      </section>

      {/* BLOG SECTION */}
      <BlogSection onBookNowClick={handleScrollToBooking} />

      {/* PHASE 8 — WHY CHOOSE US (Horizontal scrolling lists) */}
      <section className="relative py-24 bg-void-black border-t border-neutral-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Section Titles */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs text-blood-red tracking-[0.25em] uppercase">THE COVENANT</span>
              <h2 className="font-bebas text-4xl md:text-6xl text-steel-white tracking-wider uppercase">
                WHY <span className="text-blood-red">DREAMVILLE</span>
              </h2>
            </div>
            <p className="text-sm text-chrome-silver max-w-md leading-relaxed">
              We hold ourselves to a standard of technical mastery and operational integrity. 
              No sales pitches, just elite car craftsmanship.
            </p>
          </div>

          {/* Elegant Horizontal Flow List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-carbon-gray border border-neutral-900 rounded-none p-6 hover:border-blood-red/40 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-10 h-10 bg-neutral-950 border border-neutral-900 rounded-none flex items-center justify-center text-blood-red mb-5">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-rajdhani text-lg font-bold text-steel-white tracking-wide mb-2">
                Honest Diagnostics
              </h3>
              <p className="text-xs text-chrome-silver leading-relaxed">
                We perform actual electronic checks and state logs. No imaginary parts lists or inflated invoices.
              </p>
            </div>

            <div className="bg-carbon-gray border border-neutral-900 rounded-none p-6 hover:border-blood-red/40 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-10 h-10 bg-neutral-950 border border-neutral-900 rounded-none flex items-center justify-center text-blood-red mb-5">
                <Clock size={20} />
              </div>
              <h3 className="font-rajdhani text-lg font-bold text-steel-white tracking-wide mb-2">
                Fast Turnarounds
              </h3>
              <p className="text-xs text-chrome-silver leading-relaxed">
                With master builders working in specialized dyno, mechanical, and detailing lanes, downtime is minimized.
              </p>
            </div>

            <div className="bg-carbon-gray border border-neutral-900 rounded-none p-6 hover:border-blood-red/40 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-10 h-10 bg-neutral-950 border border-neutral-900 rounded-none flex items-center justify-center text-blood-red mb-5">
                <Zap size={20} />
              </div>
              <h3 className="font-rajdhani text-lg font-bold text-steel-white tracking-wide mb-2">
                Expert Calibrations
              </h3>
              <p className="text-xs text-chrome-silver leading-relaxed">
                Our technicians are fully certified to tune state-of-the-art engine management chips on the AWD dyno.
              </p>
            </div>

            <div className="bg-carbon-gray border border-neutral-900 rounded-none p-6 hover:border-blood-red/40 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-10 h-10 bg-neutral-950 border border-neutral-900 rounded-none flex items-center justify-center text-blood-red mb-5">
                <Heart size={20} />
              </div>
              <h3 className="font-rajdhani text-lg font-bold text-steel-white tracking-wide mb-2">
                Tuner Enthusiasts
              </h3>
              <p className="text-xs text-chrome-silver leading-relaxed">
                We share your passion for motorsport engineering. We care for your project like it is our own track racer.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* PHASE 9 — GOOGLE REVIEWS */}
      <section id="reviews" className="relative py-24 bg-void-black border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16 gap-3">
            <span className="font-mono text-xs text-blood-red tracking-[0.25em] uppercase">OPERATOR FEEDBACK</span>
            <h2 className="font-bebas text-4xl md:text-6xl text-steel-white tracking-wider uppercase">
              WHAT CUSTOMERS <span className="text-blood-red">SAY</span>
            </h2>
            <p className="text-sm text-chrome-silver leading-relaxed">
              Real reviews from real performance drivers on Google. We pride ourselves on clean execution.
            </p>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS_DATA.map((rev) => (
              <div 
                key={rev.id}
                className="bg-carbon-gray border border-neutral-900 rounded-none p-6 hover:border-blood-red/30 transition-all duration-300 flex flex-col justify-between relative group"
              >
                {/* Giant quotation visual mark in background */}
                <div className="absolute right-4 top-4 font-bebas text-5xl text-neutral-800/15 pointer-events-none group-hover:text-blood-red/10 select-none">
                  “
                </div>

                <div className="flex flex-col gap-4">
                  {/* Google stars */}
                  <div className="flex gap-0.5 text-yellow-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" />
                    ))}
                  </div>

                  <p className="text-xs text-chrome-silver leading-relaxed italic">
                    "{rev.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t border-neutral-900/80 pt-4 mt-6">
                  <div className="w-8 h-8 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center font-mono text-xs text-blood-red font-semibold">
                    {rev.avatar}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-rajdhani text-sm font-bold text-steel-white leading-none">{rev.author}</span>
                    <span className="font-mono text-xs text-chrome-silver tracking-wider leading-none mt-1">{rev.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA to write review */}
          <div className="text-center mt-12">
            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-neutral-950 border border-neutral-900 hover:border-blood-red text-chrome-silver hover:text-steel-white px-5 py-2.5 rounded-none text-xs font-mono uppercase tracking-wider transition-colors"
            >
              <span>Write a Review on Google</span>
              <span className="text-blood-red font-bold">&rarr;</span>
            </a>
          </div>

        </div>
      </section>

      {/* PHASE 10 — BOOKING / CONTACT SECTION */}
      <section id="booking" className="relative py-24 bg-void-black border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left: Interactive Booking Form */}
            <div className="lg:col-span-7 flex flex-col gap-6" id="booking-section">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-blood-red tracking-[0.25em] uppercase">RESERVE STATION</span>
                <h2 className="font-bebas text-4xl md:text-5xl text-steel-white tracking-wider uppercase">
                  BOOK YOUR <span className="text-blood-red">APPOINTMENT</span>
                </h2>
                <p className="text-xs text-chrome-silver leading-relaxed">
                  Enter your project details below to lock in your diagnostic window. 
                  Our service advisors will contact you in less than 2 hours to confirm.
                </p>
              </div>

              {/* SUCCESS MESSAGE */}
              {bookingSuccess && (
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-none p-5 flex items-start gap-3.5 animate-slide-up">
                  <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                  <div className="flex flex-col gap-1">
                    <strong className="font-rajdhani text-sm font-bold text-emerald-400 uppercase tracking-wide">
                      APPOINTMENT PRIMED IN ENGINE MATRIX
                    </strong>
                    <p className="text-xs text-chrome-silver leading-relaxed">
                      We have successfully registered your request in our master schedules. 
                      A booking slot is reserved under pending approval. We will dial you shortly!
                    </p>
                  </div>
                </div>
              )}

              {/* Form element */}
              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-5 bg-carbon-gray/30 border border-neutral-900 rounded-none p-6 md:p-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="booking-name" className="font-mono text-xs text-chrome-silver uppercase tracking-wider font-semibold">Your Name *</label>
                    <input
                      id="booking-name"
                      type="text"
                      required
                      placeholder="e.g. Justin Chen"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-void-black/80 border border-neutral-800 text-sm text-steel-white rounded-none px-4 py-3 focus:outline-none focus:border-blood-red focus:ring-1 focus:ring-blood-red transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="booking-phone" className="font-mono text-xs text-chrome-silver uppercase tracking-wider font-semibold">Phone Number *</label>
                    <input
                      id="booking-phone"
                      type="tel"
                      required
                      placeholder="e.g. 604-555-0199"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="bg-void-black/80 border border-neutral-800 text-sm text-steel-white rounded-none px-4 py-3 focus:outline-none focus:border-blood-red focus:ring-1 focus:ring-blood-red transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="booking-car" className="font-mono text-xs text-chrome-silver uppercase tracking-wider font-semibold">Car Model &amp; Year</label>
                    <input
                      id="booking-car"
                      type="text"
                      placeholder="e.g. 2021 Toyota Supra A90"
                      value={formData.carDetails}
                      onChange={(e) => setFormData({...formData, carDetails: e.target.value})}
                      className="bg-void-black/80 border border-neutral-800 text-sm text-steel-white rounded-none px-4 py-3 focus:outline-none focus:border-blood-red focus:ring-1 focus:ring-blood-red transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="booking-service" className="font-mono text-xs text-chrome-silver uppercase tracking-wider font-semibold">Preferred Service</label>
                    <select
                      id="booking-service"
                      value={formData.service}
                      onChange={(e) => setFormData({...formData, service: e.target.value})}
                      className="bg-void-black/80 border border-neutral-800 text-sm text-steel-white rounded-none px-3 py-3 focus:outline-none focus:border-blood-red focus:ring-1 focus:ring-blood-red transition-all cursor-pointer"
                    >
                      <option>ECU Remapping &amp; Performance Tuning</option>
                      <option>Engine Diagnostics &amp; Maintenance</option>
                      <option>Turbo / Supercharger Upgrades</option>
                      <option>Custom Exhaust Hand-Fabrication</option>
                      <option>Suspension Corner Alignment</option>
                      <option>Full Detail &amp; Ceramic Shielding</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="booking-date" className="font-mono text-xs text-chrome-silver uppercase tracking-wider font-semibold">Target Booking Date *</label>
                  <input
                    id="booking-date"
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="bg-void-black/80 border border-neutral-800 text-sm text-steel-white rounded-none px-4 py-3 focus:outline-none focus:border-blood-red focus:ring-1 focus:ring-blood-red transition-all cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="booking-notes" className="font-mono text-xs text-chrome-silver uppercase tracking-wider font-semibold">Custom tuning goals / Notes</label>
                  <textarea
                    id="booking-notes"
                    rows={3}
                    placeholder="Describe specific performance parameters (e.g. Stage 2 burble remapping, track alignment goals)..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="bg-void-black/80 border border-neutral-800 text-sm text-steel-white rounded-none px-4 py-3 focus:outline-none focus:border-blood-red focus:ring-1 focus:ring-blood-red transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                >
                  <Send size={15} />
                  <span>SEND IT →</span>
                </button>

              </form>

              {/* REAL-TIME LOGGED ACTIVE REQUESTS (PERSISTENCE PROOF) */}
              {bookings.length > 0 && (
                <div className="flex flex-col gap-3 mt-4">
                  <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">ACTIVE SUBMITTED INVOICES (LOCAL SESSION)</span>
                  <div className="space-y-2.5 max-h-[160px] overflow-y-auto">
                    {bookings.map((b) => (
                      <div key={b.id} className="bg-neutral-950 border border-neutral-900 rounded-none p-4 flex justify-between items-center text-xs">
                        <div className="flex flex-col gap-1">
                          <strong className="text-steel-white">{b.name} ({b.carDetails})</strong>
                          <span className="text-chrome-silver font-mono text-xs">{b.service}</span>
                          <span className="text-xs text-neutral-500 flex items-center gap-1.5 mt-0.5">
                            <Calendar size={10} /> Reserved: {b.date}
                          </span>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className="bg-amber-950/50 border border-amber-600/30 text-amber-400 font-mono text-xs px-2 py-0.5 rounded-none uppercase">
                            {b.status}
                          </span>
                          <button
                            onClick={() => setBookings((prev) => prev.filter((bk) => bk.id !== b.id))}
                            className="text-xs text-neutral-600 hover:text-blood-red uppercase"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right: GPS HUD Radar Map & Contact Info */}
            <div className="lg:col-span-5 flex flex-col gap-8 justify-between">
              
              <div className="flex flex-col gap-3">
                <span className="font-mono text-xs text-blood-red tracking-[0.25em] uppercase font-semibold">HQ LOCATION</span>
                <h3 className="font-bebas text-2xl md:text-3xl text-steel-white tracking-wider uppercase">
                  STEP INTO DREAMVILLE
                </h3>
                <p className="text-xs text-chrome-silver leading-relaxed">
                  Located strategically on Beresford St in Burnaby, BC. Our headquarters features 
                  climate-controlled clean bays for detailing, fully exhausted ventilation Dyno chambers, 
                  and secure overnight structural storage.
                </p>
              </div>

              {/* Radar vector map */}
              <div className="flex-1 min-h-[300px]">
                <GpsHudMap />
              </div>

              {/* Key Contact Metrics */}
              <div className="grid grid-cols-2 gap-4 bg-carbon-gray/20 border border-neutral-900/60 p-4 rounded-none">
                <div>
                  <span className="font-mono text-xs text-neutral-500 uppercase block">PHONE INTAKE</span>
                  <a href="tel:604-442-8265" className="font-rajdhani text-lg font-bold text-steel-white hover:text-blood-red transition-colors block mt-0.5">
                    📞 604-442-8265
                  </a>
                </div>
                <div>
                  <span className="font-mono text-xs text-neutral-500 uppercase block">OPERATING HOURS</span>
                  <span className="font-rajdhani text-xs font-bold text-chrome-silver block mt-1">
                    Mon - Sat: 11 AM - 9 PM
                  </span>
                  <span className="font-sans text-xs text-neutral-600 block">
                    Sunday: 12 PM - 7 PM
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* PHASE 11 — FOOTER */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-16 text-chrome-silver font-mono text-xs relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col gap-10">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 justify-between items-start">
            
            {/* Column 1: Brand */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-carbon-gray border border-blood-red flex items-center justify-center">
                  <span className="font-bebas text-sm text-steel-white">D</span>
                </div>
                <h3 className="font-bebas text-xl text-steel-white tracking-widest leading-none">
                  DREAMVILLE<span className="text-blood-red">.</span>AUTO
                </h3>
              </div>
              <p className="text-xs text-neutral-500 max-w-xs leading-relaxed mt-1">
                Burnaby’s premier tuner and luxury auto garage. Dedicated to precision mechanical engineering, remapping, and ceramic preservation.
              </p>
            </div>

            {/* Column 2: Nav Quicklinks */}
            <div className="flex flex-col gap-3">
              <strong className="text-steel-white uppercase text-xs tracking-wider font-semibold border-b border-neutral-900 pb-1.5">
                DIRECTORY
              </strong>
              <div className="flex flex-col gap-2 text-xs">
                <a href="#home" className="hover:text-blood-red transition-colors">Home Page</a>
                <a href="#services" className="hover:text-blood-red transition-colors">TIG & ECU Services</a>
                <a href="#gallery" className="hover:text-blood-red transition-colors">Tuner Builds Logs</a>
                <a href="#blog" className="hover:text-blood-red transition-colors">Garage Blog Articles</a>
              </div>
            </div>

            {/* Column 3: Hours */}
            <div className="flex flex-col gap-3">
              <strong className="text-steel-white uppercase text-xs tracking-wider font-semibold border-b border-neutral-900 pb-1.5">
                TUNER HOURS
              </strong>
              <div className="flex flex-col gap-2 text-xs text-neutral-400">
                <p className="flex justify-between">
                  <span>Mon - Fri:</span>
                  <span className="text-steel-white">11:00 AM - 9:00 PM</span>
                </p>
                <p className="flex justify-between">
                  <span>Saturday:</span>
                  <span className="text-steel-white">11:00 AM - 9:00 PM</span>
                </p>
                <p className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="text-steel-white">12:00 PM - 7:00 PM</span>
                </p>
              </div>
            </div>

            {/* Column 4: Location */}
            <div className="flex flex-col gap-3">
              <strong className="text-steel-white uppercase text-xs tracking-wider font-semibold border-b border-neutral-900 pb-1.5">
                STATION COORDINATES
              </strong>
              <div className="flex flex-col gap-2 text-xs">
                <p className="text-neutral-400 leading-relaxed">
                  📍 6432 Beresford St<br />
                  Burnaby, BC V5E 1B6
                </p>
                <a href="tel:604-442-8265" className="text-blood-red font-bold hover:underline">📞 604-442-8265</a>
              </div>
            </div>

          </div>

          <div className="border-t border-neutral-900 pt-8 mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-600">
            <p>© 2026 Dreamville Auto. Crafted with absolute structural precision. All Rights Reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blood-red transition-colors">Privacy Policy</a>
              <span>·</span>
              <a href="#" className="hover:text-blood-red transition-colors">Terms of Use</a>
            </div>
          </div>

        </div>
      </footer>

      {/* FLOATING ACTION WHATSAPP TRIGGER */}
      <a
        href="https://wa.me/16044428265"
        target="_blank"
        rel="noopener noreferrer"
        style={{ bottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
        className="fixed right-5 sm:right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.45)] hover:scale-110 active:scale-95 transition-transform cursor-pointer animate-bounce group"
      >
        <MessageCircle size={24} className="group-hover:rotate-6 transition-transform" />
        <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-neutral-950/90 text-white font-mono text-xs px-2.5 py-1 rounded-none border border-neutral-900 uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Live WhatsApp Support
        </span>
      </a>

    </div>
  );
}
