"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "../public/images/logo.png";

// ─── Data ───────────────────────────────────────────────────────────────────

const NAV_LINKS = ["Products", "Solutions", "About", "Contact"];

const CATEGORIES = [
  { icon: "🚗", label: "Automotive",   sub: "Car & Truck Batteries" },
  { icon: "🏍️", label: "Motorbike",    sub: "Two-Wheeler Batteries" },
  { icon: "🔋", label: "Inverter",     sub: "Home & Office UPS"     },
  { icon: "☀️", label: "Solar",        sub: "Deep Cycle & Storage"  },
  { icon: "🏭", label: "Industrial",   sub: "Heavy-Duty Power"      },
  { icon: "⚡", label: "EV / Lithium", sub: "Electric Vehicles"     },
];

const FEATURED = [
  { name: "PowerMax Pro 65Ah", type: "Automotive",       price: "₹4,899",  tag: "Best Seller", tagColor: "bg-[#F53827] text-white", warranty: "36 months", cca: "550 CCA"  },
  { name: "SolarEdge 200Ah",   type: "Deep Cycle Solar", price: "₹12,499", tag: "New Arrival", tagColor: "bg-[#42BD00] text-white", warranty: "24 months", cca: "Gel VRLA" },
  { name: "UltraGuard 150Ah",  type: "Inverter / UPS",  price: "₹8,199",  tag: "Top Rated",   tagColor: "bg-[#42BD00] text-white", warranty: "48 months", cca: "Tubular"  },
  { name: "MotoFire 9Ah",      type: "Two-Wheeler",      price: "₹1,799",  tag: "Hot Deal",    tagColor: "bg-[#F53827] text-white", warranty: "18 months", cca: "140 CCA"  },
];

const STATS = [
  { number: "50,000+", label: "Batteries Sold" },
  { number: "15 Yrs",  label: "In Business"    },
  { number: "200+",    label: "Brands Stocked" },
  { number: "4.9★",   label: "Average Rating" },
];

const TESTIMONIALS = [
  { name: "Rajesh M.",  location: "Kolkata",  stars: 5, text: "Got my car battery replaced within 2 hours of ordering. Excellent service and the battery is still going strong 2 years later." },
  { name: "Priya D.",   location: "Howrah",   stars: 5, text: "Best prices in the city for inverter batteries. Free installation was a bonus. Highly recommended!" },
  { name: "Anirban S.", location: "Durgapur", stars: 5, text: "Needed a solar battery urgently. They delivered same day and helped me pick the right capacity. Top notch." },
];

const BRANDS = ["Exide", "Amaron", "Luminous", "Livguard", "Okaya", "SF Sonic", "Tata Green", "ACDelco"];

// ─── Sub-components ──────────────────────────────────────────────────────────

function BoltIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z" />
    </svg>
  );
}

function StarRow({ count }: { count: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-[#F53827]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-zinc-100" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          <div className="flex items-center gap-2">
            <Image src={Logo} alt="VoltaZone Logo" className="w-24" />
          </div>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a key={l} href="#"
                className="text-[#F53827] hover:text-[#42BD00] text-xl font-medium transition-colors">
                {l}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href="#" className="text-[#F53827] hover:text-[#42BD00] text-sm font-medium transition-colors">
              📞 +91 98300 00000
            </a>
            <a href="#"
              className="bg-[#42BD00] hover:bg-[#F53827] text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors">
              Log in
            </a>
          </div>

          {/* hamburger bar color now changes when scrolled */}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`block h-0.5 transition-all ${scrolled ? "bg-[#F53827]" : "bg-white"} ${open ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-0.5 transition-all ${scrolled ? "bg-[#F53827]" : "bg-white"} ${open ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 transition-all ${scrolled ? "bg-[#F53827]" : "bg-white"} ${open ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* mobile drawer — white bg added so links are readable */}
      {open && (
        <div className="md:hidden bg-white border-t border-zinc-100 shadow-lg px-4 py-4 space-y-1">
          {NAV_LINKS.map((l) => (
            <a key={l} href="#"
              className="block text-[#F53827] hover:text-[#42BD00] font-semibold py-2 text-base transition-colors">
              {l}
            </a>
          ))}
          <div className="pt-3 border-t border-zinc-100 mt-2 space-y-2">
            <a href="tel:+919830000000"
              className="block text-zinc-500 text-sm font-medium py-1">
              📞 +91 98300 00000
            </a>
            <a href="#"
              className="block bg-[#42BD00] hover:bg-[#F53827] text-white font-bold text-center py-3 rounded-full transition-colors">
              Log in
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <video autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover">
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 z-10 bg-[rgba(0,0,0,0.6)]" />

      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none select-none z-10">
        <svg viewBox="0 0 200 200" className="w-[500px] h-[500px] lg:w-[700px] lg:h-[700px] text-[#F53827]" fill="currentColor">
          <path d="M130 10L40 115H100L70 190L185 80H120L130 10Z" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-0 w-full z-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
              POWER THAT
              <br />
              <span className="text-[#F53827]">NEVER </span>
              QUITS.
            </h1>
            <p className="mt-6 text-white text-lg max-w-md leading-relaxed">
              India's most trusted battery shop. Automotive, inverter, solar and industrial batteries — delivered and installed at your doorstep.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#products"
                className="bg-[#F53827] hover:bg-[#42BD00] text-white font-black px-8 py-4 rounded-full text-base transition-all hover:scale-105">
                Shop Batteries
              </a>
              <a href="#contact"
                className="bg-[#42BD00] hover:bg-[#F53827] text-white font-bold px-8 py-4 rounded-full text-base transition-all hover:scale-105">
                Download App
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── StatsBar ────────────────────────────────────────────────────────────────

function StatsBar() {
  return (
    <section className="bg-[#F53827] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(({ number, label }) => (
            <div key={label}>
              <p className="text-white font-black text-3xl sm:text-4xl">{number}</p>
              <p className="text-white/80 text-sm font-semibold mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Categories ───────────────────────────────────────────────────────────────

function Categories() {
  return (
    <section id="products" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[#42BD00] text-sm font-bold uppercase tracking-widest mb-2">What We Carry</p>
          <h2 className="text-[#F53827] font-black text-4xl sm:text-5xl">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(({ icon, label, sub }) => (
            <a key={label} href="#"
              className="group bg-[#041A01] hover:bg-[#F53827] border border-zinc-700 hover:border-[#F53827] rounded-2xl p-5 text-center transition-all duration-200 hover:scale-105">
              <div className="text-4xl mb-3">{icon}</div>
              <p className="text-white font-black text-sm">{label}</p>
              <p className="text-zinc-400 group-hover:text-white/80 text-xs mt-0.5">{sub}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FeaturedProducts ────────────────────────────────────────────────────────

function FeaturedProducts() {
  return (
    <section className="bg-[#F9FFF6] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-[#42BD00] text-sm font-bold uppercase tracking-widest mb-2">Handpicked</p>
            <h2 className="text-[#F53827] font-black text-4xl sm:text-5xl">Featured Products</h2>
          </div>
          <a href="#" className="text-[#F53827] hover:text-[#42BD00] font-bold text-sm underline underline-offset-4 shrink-0 transition-colors">
            View All Products →
          </a>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {FEATURED.map((p) => (
            <div key={p.name}
              className="bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col hover:border-[#F53827] hover:shadow-lg hover:shadow-[#F53827]/10 transition-all">
              <div className="flex items-start justify-between mb-4">
                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${p.tagColor}`}>{p.tag}</span>
                <span className="text-zinc-400 text-xs">{p.type}</span>
              </div>

              <div className="h-28 flex items-center justify-center mb-5 border-b border-zinc-100">
                <div className="relative">
                  <div className="w-32 h-16 bg-zinc-100 rounded-lg border-2 border-zinc-200 flex items-center justify-center gap-1.5 px-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex-1 h-8 bg-[#F53827]/80 rounded-sm" />
                    ))}
                  </div>
                  <div className="absolute -top-2 left-4 w-3 h-2.5 bg-zinc-300 rounded-t-sm" />
                  <div className="absolute -top-2 left-11 w-3 h-2.5 bg-zinc-300 rounded-t-sm" />
                </div>
              </div>

              <h3 className="text-zinc-900 font-black text-lg leading-tight">{p.name}</h3>

              <div className="flex gap-3 mt-3">
                <span className="text-white text-xs bg-[#F53827] px-2.5 py-1 rounded-full">{p.warranty}</span>
                <span className="text-white text-xs bg-[#42BD00] px-2.5 py-1 rounded-full">{p.cca}</span>
              </div>

              <div className="mt-auto pt-5 flex items-center justify-between">
                <p className="text-[#F53827] font-black text-2xl">{p.price}</p>
                <button className="bg-[#42BD00] hover:bg-[#F53827] text-white font-bold text-sm px-4 py-2 rounded-full transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WhyUs ───────────────────────────────────────────────────────────────────

function WhyUs() {
  const features = [
    { icon: "🏷️", title: "Best Price Guarantee", desc: "We match or beat any competitor's quote on identical batteries. Zero compromise on quality." },
    { icon: "⚡",  title: "Fast Delivery",         desc: "Order before 3 PM and get your battery delivered and installed the same day, in most pin codes." },
    { icon: "🔧", title: "Free Installation",      desc: "Our trained technicians install your battery free of charge, right at your doorstep." },
    { icon: "♻️", title: "Old Battery Exchange",   desc: "Hand in your old battery and get an instant cashback discount on your new purchase." },
    { icon: "📋", title: "Genuine Products Only",  desc: "100% authentic batteries directly sourced from authorized distributors and manufacturers." },
    { icon: "🛡️", title: "Extended Warranty",      desc: "All products come with manufacturer warranty. Pro customers get an additional 6-month cover." },
  ];

  return (
    <section className="bg-[#041A01] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[#42BD00] text-sm font-bold uppercase tracking-widest mb-2">Why Choose Us</p>
          <h2 className="text-white font-black text-4xl sm:text-5xl">The VoltaZone Difference</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon, title, desc }) => (
            <div key={title}
              className="bg-[#0a2a05] border border-zinc-700 hover:border-[#F53827] hover:bg-[#0d3306] rounded-2xl p-7 transition-all">
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="text-white font-black text-lg mb-2">{title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Brands ───────────────────────────────────────────────────────────────────

function Brands() {
  return (
    <section className="bg-white py-16 border-y border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[#F53827] text-sm font-semibold uppercase tracking-widest mb-10">
          Authorized Dealer for
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {BRANDS.map((b) => (
            <div key={b}
              className="bg-[#42BD00] hover:bg-[#F53827] border border-[#42BD00] hover:border-[#F53827] text-white font-black text-sm px-6 py-3 rounded-full transition-all cursor-pointer">
              {b}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  return (
    <section className="bg-[#F9FFF6] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[#42BD00] text-sm font-bold uppercase tracking-widest mb-2">Customers Love Us</p>
          <h2 className="text-[#F53827] font-black text-4xl sm:text-5xl">Real Reviews</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, location, text, stars }) => (
            <div key={name}
              className="bg-white border border-[#42BD00]/30 hover:border-[#F53827] rounded-2xl p-7 transition-colors shadow-sm">
              <StarRow count={stars} />
              <p className="text-zinc-600 text-sm leading-relaxed mt-4 mb-6">&ldquo;{text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F53827]/10 border border-[#F53827]/30 flex items-center justify-center text-[#F53827] font-black text-sm">
                  {name[0]}
                </div>
                <div>
                  <p className="text-[#F53827] font-bold text-sm">{name}</p>
                  <p className="text-[#42BD00] text-xs font-medium">{location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────────────

function CTA() {
  return (
    <section className="bg-[#F53827] py-20 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <BoltIcon className="w-14 h-14 text-white/20 mx-auto mb-6" />
        <h2 className="text-white font-black text-4xl sm:text-6xl leading-tight mb-4">
          Need a Battery
          <br />
          Right Now?
        </h2>
        <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
          Call us or request a callback. Our experts will help you find the perfect battery for your vehicle or home setup — fast.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://wa.me/919830000000" target="_blank" rel="noopener noreferrer"
            className="bg-[#42BD00] hover:bg-white text-white hover:text-[#42BD00] border-2 border-[#42BD00] hover:border-white font-black px-10 py-4 rounded-full text-lg transition-all">
            WhatsApp Us
          </a>
          <a href="tel:+919830000000"
            className="bg-transparent hover:bg-white/10 text-white border-2 border-white font-black px-10 py-4 rounded-full text-lg transition-all">
            📞 Call Now
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#041A01] border-t border-zinc-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src={Logo} alt="VoltaZone Logo" className="w-24" />
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Your trusted battery partner since 2009. Serving Kolkata, Howrah and all of West Bengal.
            </p>
          </div>

          {[
            { title: "Products", links: ["Automotive", "Inverter / UPS", "Solar", "Two-Wheeler", "Industrial", "EV / Lithium"] },
            { title: "Company",  links: ["About Us", "Careers", "Blog", "Press", "Partners"] },
            { title: "Support",  links: ["Track Order", "Warranty Claim", "Installation Guide", "FAQs", "Contact Us"] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-white font-black text-sm uppercase tracking-widest mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-zinc-400 hover:text-[#42BD00] text-sm transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-800 pt-8 flex flex-col sm:flex-row justify-between gap-4 text-zinc-500 text-xs">
          <p>© 2025 VoltaZone Battery Shop. All rights reserved.</p>
          <p>📍 12, Power House Road, Howrah, West Bengal 711101</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function BatteryShopHome() {
  return (
    <div className="font-sans antialiased">
      <Navbar />
      <Hero />
      <StatsBar />
      <Categories />
      <FeaturedProducts />
      <WhyUs />
      <Brands />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
