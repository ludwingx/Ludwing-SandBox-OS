"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  MapPin, 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Loader2,
  Music,
  Disc,
  ArrowRight,
  Globe
} from "lucide-react";

// Inline SVG brand icons
const Instagram = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const Youtube = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.54 12 3.54 12 3.54s-7.53 0-9.388.515a3.003 3.003 0 0 0-2.11 2.108C0 8.017 0 12 0 12s0 3.983.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.46 12 20.46 12 20.46s7.53 0 9.388-.515a3.003 3.003 0 0 0 2.11-2.108C24 15.983 24 12 24 12s0-3.983-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const Github = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const Linkedin = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Spotify & SoundCloud custom SVG icons
const Spotify = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.377-1.454-5.37-1.783-8.893-.982-.336.075-.668-.135-.744-.47-.077-.336.135-.668.47-.743 3.856-.88 7.15-.506 9.822 1.13.294.178.385.562.202.858zm1.226-2.723c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.082-1.182-.413.125-.85-.107-.975-.52-.125-.413.107-.85.52-.975 3.666-1.112 8.232-.57 11.35 1.348.366.226.486.707.26 1.07zm.106-2.833C14.385 8.71 8.534 8.514 5.15 9.54a.972.972 0 1 1-.563-1.862c3.878-1.178 10.347-.955 14.42 1.46.295.176.387.564.21 8.58-.175.297-.562.39-.858.213z"/>
  </svg>
);

const SoundCloud = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M11.56 16.75c0-.12.01-.24.01-.36 0-1.48-.48-2.84-1.28-3.96-.28-.39-.62-.73-1-.99-.9-.63-1.99-.99-3.17-.99-1.23 0-2.38.39-3.32 1.05v5.25h8.76zm1.12-6.52c0 .08.01.16.01.24 0 1.95-.79 3.73-2.07 5.03v1.25h2.24c.73 0 1.3-.59 1.3-1.3v-5.22zm2.24 1.12c0 2.23-1.12 4.1-2.8 5.15v1.25h4.48c.73 0 1.3-.59 1.3-1.3V11.35zm3.36 1.12v5.28h2.24c.73 0 1.3-.59 1.3-1.3v-2.68c0-.71-.57-1.3-1.3-1.3zm-10.08-.22v5.5h1.12V12.25zm-2.24 1.12v4.38h1.12V13.37zm-2.24 1.13v3.25h1.12v-3.25z"/>
  </svg>
);

// ==========================================
// MOCK DATA FOR SECTIONS
// ==========================================
const TABS = ["EVENTO", "MERCH", "CONTRIBUIDORES"] as const;
type Tab = typeof TABS[number];

const GENERAL_MERCH_ITEMS = [
  { id: "1", name: "Polera Blanca XL", image: "/images/poleraBlancaXL.svg", price: "Bs. 90.00", placeholderColor: "bg-white" },
  { id: "2", name: "Polera Negra XL", image: "/images/poleraNegraXL.svg", price: "Bs. 90.00", placeholderColor: "bg-neutral-900" },
  { id: "3", name: "Polera XL", image: "/images/poleraXL.svg", price: "Bs. 90.00", placeholderColor: "bg-neutral-800" },
  { id: "4", name: "Gorra XL v2", image: "/images/gorraXLv2.svg", price: "Bs. 50.00", placeholderColor: "bg-neutral-950" },
  { id: "5", name: "Vaso XL", image: "/images/vasoXL.svg", price: "Bs. 30.00", placeholderColor: "bg-neutral-200" },
];

const CONTRIBUTORS_LIST = [
  {
    name: "Tyan XL",
    profetion: "Artista y Compositor",
    instagram: "https://www.instagram.com/tyan.xl/",
    youtube: "https://www.youtube.com/@tyanxl",
    soundCloud: "https://soundcloud.com/kid-tyan",
    spotify: "https://open.spotify.com/intl-es/artist/0CwAkk201F5GOYyUbcv6f9",
    photo: "/images/tyanPhoto.svg",
    placeholderColor: "bg-red-200"
  },
  {
    name: "Trucho",
    profetion: "Tienda de ropa",
    instagram: "https://www.instagram.com/trucho_clothing/",
    youtube: "https://www.youtube.com/@truchostudios",
    photo: "/images/truchoPhoto.svg",
    placeholderColor: "bg-neutral-200"
  },
  {
    name: "Ludwing",
    profetion: "Desarrollador Web",
    instagram: "https://www.instagram.com/ludwing.dev/",
    portfolio: "https://my-portfolio-ludwingxs-projects.vercel.app/",
    github: "https://github.com/ludwingx",
    linkedin: "https://www.linkedin.com/in/ludwingarmijosaavedra/",
    photo: "/images/ludwingPhoto.jpg",
    placeholderColor: "bg-blue-200"
  },
  {
    name: "Koketa",
    profetion: "Artista",
    instagram: "https://www.instagram.com/koketa.music.bo/",
    photo: "/images/koketaPhoto.jpg",
    placeholderColor: "bg-purple-200"
  },
  {
    name: "Casa Grande",
    profetion: "Cochabamba",
    instagram: "https://www.instagram.com/casagrande.cocha/",
    photo: "/images/casaGrandePhoto.jpg",
    placeholderColor: "bg-green-200"
  },
  {
    name: "DJ JC",
    profetion: "DJ",
    instagram: "https://www.instagram.com/jalim_carva/",
    photo: "/images/djJCPhoto.jpg",
    placeholderColor: "bg-yellow-200"
  },
];

const MERCH_OPTIONS = [
  { id: "1", name: "Polera Blanca", image: "/images/poleraBlancaXL.svg", placeholderColor: "bg-white" },
  { id: "2", name: "Polera Negra", image: "/images/poleraNegraXL.svg", placeholderColor: "bg-neutral-900" },
  { id: "3", name: "Polera XL", image: "/images/poleraXL.svg", placeholderColor: "bg-neutral-800" },
  { id: "4", name: "Gorra XL", image: "/images/gorraXL.svg", placeholderColor: "bg-neutral-950" },
  { id: "5", name: "Vaso XL", image: "/images/vasoXL.svg", placeholderColor: "bg-neutral-200" },
];

const KIT_OPTIONS = [
  { id: "1", name: "Kit 1", image: "/images/kitOne.svg", placeholderColor: "bg-red-500" },
  { id: "2", name: "Kit 2", image: "/images/kitTwo.svg", placeholderColor: "bg-neutral-900" },
  { id: "3", name: "Kit 3", image: "/images/kitThree.svg", placeholderColor: "bg-neutral-600" },
];

const TICKETS_LINKS = [
  { category: "L", text: "L- ENTRADA DE ACCESO GENERAL - BS. 0.00" },
  { category: "XL", text: "XL- ENTRADA + MERCH - BS. 90.00" },
  { category: "XXL", text: "XXL- ENTRADA + KIT - BS. 180.00" }
];

type CheckoutStep = "CATEGORY" | "SELECTION" | "REGISTRATION" | "PAYMENT" | "COMPLETED";

export default function AstroboyXLApp() {
  const [activeTab, setActiveTab] = useState<Tab>("EVENTO");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("CATEGORY");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prefilled Form Data
  const [formData, setFormData] = useState({
    name: "Pedro",
    lastname: "Rojas",
    email: "pedro.rojas@ejemplo.com",
    phone: "78945612"
  });

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSelectedItem(null);
  };

  const handleCategoryContinue = () => {
    if (!selectedCategory) return;
    if (selectedCategory === "L") {
      setCurrentStep("REGISTRATION");
    } else {
      setCurrentStep("SELECTION");
    }
  };

  const handleItemSelect = (itemName: string) => {
    setSelectedItem(itemName);
  };

  const handleSelectionContinue = () => {
    if (!selectedItem) return;
    setCurrentStep("REGISTRATION");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (selectedCategory === "L") {
        setCurrentStep("COMPLETED");
      } else {
        setCurrentStep("PAYMENT");
      }
    }, 500);
  };

  const handlePaymentFinish = () => {
    setCurrentStep("COMPLETED");
  };

  const handleResetFlow = () => {
    setSelectedCategory(null);
    setSelectedItem(null);
    setCurrentStep("CATEGORY");
  };

  // Determine steps array and step index for visual tracker
  const steps = selectedCategory === "L" 
    ? ["Categoría", "Registro", "Completado"] 
    : ["Categoría", selectedCategory === "XL" ? "Merch" : "Kit", "Registro", "Pago", "Completado"];

  const getStepIndex = () => {
    if (selectedCategory === "L") {
      switch (currentStep) {
        case "CATEGORY": return 0;
        case "REGISTRATION": return 1;
        case "COMPLETED": return 2;
        default: return 0;
      }
    } else {
      switch (currentStep) {
        case "CATEGORY": return 0;
        case "SELECTION": return 1;
        case "REGISTRATION": return 2;
        case "PAYMENT": return 3;
        case "COMPLETED": return 4;
        default: return 0;
      }
    }
  };

  const getCategoryName = (cat: string) => {
    switch (cat) {
      case "L": return "L - ACCESO GENERAL (BS. 0.00)";
      case "XL": return "XL - ENTRADA + MERCH (BS. 90.00)";
      case "XXL": return "XXL - ENTRADA + KIT (BS. 180.00)";
      default: return cat;
    }
  };

  return (
    <div className="w-full h-full overflow-auto bg-white text-black font-sans relative flex flex-col justify-between">
      <div className="w-full relative">
        {/* Background Floating Elements - Locked in place on desktop, hidden on mobile/small window sizes */}
        {activeTab === "EVENTO" && (
          <>
            <div className="hidden lg:block absolute left-[calc(50%-480px)] top-[160px] z-0 animate-bounce pointer-events-none" style={{ animationDuration: '4s' }}>
              <img 
                src="/images/astroboy1event.svg" 
                alt="Astroboy Left" 
                className="w-[150px] h-[150px] object-contain opacity-80"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="w-[120px] h-[120px] bg-red-600 rounded-full blur-2xl opacity-10 absolute -bottom-4 -left-4 -z-10" />
            </div>
            <div className="hidden lg:block absolute left-[calc(50%+330px)] top-[340px] z-0 animate-bounce pointer-events-none" style={{ animationDuration: '5s' }}>
              <img 
                src="/images/astroboy2event.svg" 
                alt="Astroboy Right" 
                className="w-[150px] h-[150px] object-contain opacity-80"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="w-[120px] h-[120px] bg-red-600 rounded-full blur-2xl opacity-10 absolute -bottom-4 -right-4 -z-10" />
            </div>
          </>
        )}

        {/* Header / Navigation - Dynamic Tab Controller for Full Demo Navigation */}
        <nav className={`bg-white px-4 py-3 shadow-md border-b-[3px] border-black flex justify-between items-center relative transition-all ${isMenuOpen ? "z-[99999]" : "z-40"}`}>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("EVENTO")}>
            <img
              src="/images/logoTrucho.svg"
              alt="Logo de Astroboy XL"
              className="w-8 h-8 object-contain hover:scale-105 transition-transform"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          {/* Interactive tabs */}
          <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 font-bold text-[10px] sm:text-xs uppercase tracking-wider">
            {TABS.map((tab) => (
              <span
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer transition-all pb-1 relative ${
                  activeTab === tab
                    ? "text-[#ea2812] before:absolute before:left-0 before:right-0 before:bottom-0 before:h-[2px] before:bg-[#ea2812]"
                    : "text-black hover:text-[#ea2812]"
                }`}
              >
                {tab}
              </span>
            ))}
          </div>
        </nav>

        {/* TAB 1: EVENTO / TICKET FLOW */}
        {activeTab === "EVENTO" && (
          <>
            {/* Hero Header Section */}
            <div className="text-center py-8 px-4 z-10 relative">
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black mb-2 leading-none">
                ASTROBOY XL LISTENING PARTY
              </h1>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#ea2812]">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  CASA GRANDE / MOANA
                </span>
                <span className="hidden sm:inline text-neutral-400">•</span>
                <span className="flex items-center gap-1 text-black">
                  <Calendar size={14} />
                  31 AGOSTO
                </span>
              </div>
            </div>

            {/* Steps Container */}
            <div className="max-w-2xl mx-auto px-4 pb-10 z-20 relative">
              {/* CheckoutSteps Component */}
              <div className="flex justify-between items-center bg-white border-2 border-black p-3 mb-6 shadow-[4px_4px_0px_#000] overflow-x-auto gap-2">
                {steps.map((stepName, idx) => {
                  const isCompleted = idx < getStepIndex();
                  const isActive = idx === getStepIndex();
                  return (
                    <div key={idx} className="flex items-center space-x-2 shrink-0">
                      <div className={`w-5 h-5 flex items-center justify-center text-[10px] font-black border-2 border-black ${
                        isActive ? "bg-[#ea2812] text-white" : isCompleted ? "bg-black text-white" : "bg-white text-black"
                      }`}>
                        {isCompleted ? <Check size={10} strokeWidth={4} /> : idx + 1}
                      </div>
                      <span className={`text-[9px] uppercase font-bold tracking-wider ${
                        isActive ? "text-[#ea2812]" : "text-black"
                      }`}>
                        {stepName}
                      </span>
                      {idx < steps.length - 1 && (
                        <span className="text-neutral-400 font-bold text-[10px] px-1">/</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Steps Wrapper */}
              <div className="flex flex-col justify-start transition-all duration-300">
                
                {/* STEP 1: CATEGORY SELECTION */}
                {currentStep === "CATEGORY" && (
                  <div className="w-full transition-all">
                    <div className="text-center mb-6">
                      <h2 className="text-lg font-black uppercase mb-1">SELECCIONA TU ENTRADA</h2>
                      <p className="text-[11px] text-neutral-500 font-medium">
                        Elige el tipo de entrada que más te convenga. Cada opción te ofrece diferentes beneficios.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 max-w-xl mx-auto">
                      {TICKETS_LINKS.map((link) => (
                        <button
                          key={link.category}
                          onClick={() => handleCategoryClick(link.category)}
                          className={`w-full py-3.5 px-4 border-2 text-left font-black text-[11px] sm:text-xs uppercase transition-all duration-200 rounded-[0.5rem] ${
                            selectedCategory === link.category
                              ? "border-[#ea2812] bg-[#ea2812]/5 text-[#ea2812] shadow-[3px_3px_0px_#ea2812]"
                              : "border-black bg-white hover:bg-neutral-50 shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000]"
                          }`}
                        >
                          {link.text}
                        </button>
                      ))}

                      {selectedCategory && (
                        <div className="flex justify-center mt-4">
                          <button
                            onClick={handleCategoryContinue}
                            className="bg-[#ea2812] text-white border-2 border-black font-black uppercase text-[11px] px-8 py-2.5 rounded-[0.5rem] shadow-[3px_3px_0px_#000] hover:bg-black hover:shadow-[1px_1px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                          >
                            Continuar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 2: MERCH OR KIT SELECTION */}
                {currentStep === "SELECTION" && (
                  <div className="w-full text-center">
                    <h2 className="text-lg font-black uppercase mb-6">
                      ELIGE TU {selectedCategory === "XL" ? "MERCH" : "KIT"}:
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      {(selectedCategory === "XL" ? MERCH_OPTIONS : KIT_OPTIONS).map((item) => {
                        const isSelected = selectedItem === item.name;
                        const isAnySelected = selectedItem !== null;
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleItemSelect(item.name)}
                            className={`cursor-pointer border-2 transition-all duration-300 p-2 flex flex-col items-center rounded-[0.5rem] ${
                              isSelected 
                                ? "border-[#ea2812] shadow-[3px_3px_0px_#000] scale-[1.02]" 
                                : "border-black shadow-[4px_4px_0px_#000] hover:scale-[1.01]"
                            } ${isAnySelected && !isSelected ? "opacity-30 blur-[0.5px] grayscale" : "opacity-100"}`}
                          >
                            {/* Styled Placeholders for SVG Merch Items */}
                            <div className={`w-full h-28 ${item.placeholderColor} flex items-center justify-center border-b-2 border-black relative overflow-hidden rounded-t-[0.3rem]`}>
                              <span className="text-[9px] font-black uppercase opacity-20 text-neutral-100 absolute bottom-1 right-2">
                                {selectedCategory}
                              </span>
                              <Disc className="w-10 h-10 stroke-1 opacity-20 text-white animate-spin" style={{ animationDuration: '10s' }} />
                            </div>
                            <div className="w-full text-center py-1.5 bg-neutral-50 rounded-b-[0.3rem]">
                              <span className="text-[10px] font-black uppercase">{item.name}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-center gap-3">
                      <button
                        onClick={handleResetFlow}
                        className="border-2 border-black font-black uppercase text-[10px] px-6 py-2 rounded-[0.5rem] bg-white hover:bg-neutral-50 shadow-[2px_2px_0px_#000]"
                      >
                        Atrás
                      </button>
                      {selectedItem && (
                        <button
                          onClick={handleSelectionContinue}
                          className="bg-[#ea2812] text-white border-2 border-black font-black uppercase text-[10px] px-6 py-2 rounded-[0.5rem] shadow-[3px_3px_0px_#000] hover:bg-black hover:shadow-[1px_1px_0px_#000] transition-all"
                        >
                          Continuar
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 3: REGISTRATION FORM */}
                {currentStep === "REGISTRATION" && (
                  <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_#000] rounded-[0.5rem] max-w-xl mx-auto w-full">
                    <h2 className="text-lg font-black uppercase mb-4 text-center">REGISTRO DE ENTRADA</h2>

                    {/* Selection Summary */}
                    <div className="border-2 border-dashed border-black p-3 mb-4 bg-neutral-50 text-[11px] font-bold rounded-[0.3rem]">
                      <span className="text-neutral-500 block mb-1">RESUMEN DE TU SELECCIÓN:</span>
                      <div className="flex justify-between mb-1">
                        <span>CATEGORÍA:</span>
                        <span className="text-[#ea2812]">{getCategoryName(selectedCategory || "L")}</span>
                      </div>
                      {selectedCategory !== "L" && (
                        <div className="flex justify-between">
                          <span>OPCIÓN ELEGIDA:</span>
                          <span className="text-[#ea2812]">{selectedItem}</span>
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
                      {loading ? (
                        <div className="flex flex-col items-center justify-center py-8 gap-3">
                          <Loader2 className="w-6 h-6 animate-spin text-[#ea2812]" />
                          <span className="text-[10px] font-bold uppercase">Procesando registro...</span>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[9px] font-black uppercase block mb-1">Nombre</label>
                              <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-2 border-2 border-black focus:outline-none focus:border-[#ea2812] text-xs font-medium rounded-[0.3rem]"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-black uppercase block mb-1">Apellidos</label>
                              <input
                                type="text"
                                required
                                value={formData.lastname}
                                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                className="w-full p-2 border-2 border-black focus:outline-none focus:border-[#ea2812] text-xs font-medium rounded-[0.3rem]"
                              />
                            </div>
                          </div>

                      <div>
                        <label className="text-[9px] font-black uppercase block mb-1">Correo Electrónico</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full p-2 border-2 border-black focus:outline-none focus:border-[#ea2812] text-xs font-medium rounded-[0.3rem]"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-black uppercase block mb-1">Teléfono</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full p-2 border-2 border-black focus:outline-none focus:border-[#ea2812] text-xs font-medium rounded-[0.3rem]"
                        />
                      </div>

                      <div className="flex justify-center gap-3 mt-4">
                        <button
                          type="button"
                          onClick={handleResetFlow}
                          className="border-2 border-black font-black uppercase text-[10px] px-6 py-2 rounded-[0.5rem] bg-white hover:bg-neutral-50 shadow-[2px_2px_0px_#000]"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="bg-[#ea2812] text-white border-2 border-black font-black uppercase text-[10px] px-8 py-2 rounded-[0.5rem] shadow-[3px_3px_0px_#000] hover:bg-black hover:shadow-[1px_1px_0px_#000] transition-all"
                        >
                          Registrarse
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </div>
            )}

            {/* STEP 4: PAYMENT / QR CODE */}
            {currentStep === "PAYMENT" && (
              <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_#000] rounded-[0.5rem] text-center max-w-xl mx-auto w-full">
                <h2 className="text-lg font-black uppercase mb-3">PAGO CON CÓDIGO QR</h2>

                {/* Client Summary Box */}
                <div className="border-2 border-dashed border-black p-3 mb-4 mx-auto max-w-sm bg-neutral-50 text-left text-[11px] font-medium rounded-[0.3rem]">
                  <span className="text-[10px] font-black uppercase text-[#ea2812] block mb-2">DETALLES DEL CLIENTE:</span>
                  <p className="mb-0.5"><strong>Nombre:</strong> {formData.name} {formData.lastname}</p>
                  <p className="mb-0.5"><strong>Categoría:</strong> {getCategoryName(selectedCategory || "L")}</p>
                  <p className="mb-0.5"><strong>Opción elegida:</strong> {selectedItem}</p>
                  <p className="mb-0.5"><strong>Correo:</strong> {formData.email}</p>
                  <p><strong>Teléfono:</strong> {formData.phone}</p>
                </div>

                {/* QR Image Placeholder */}
                <div className="w-40 h-40 mx-auto my-3 border-2 border-black flex items-center justify-center bg-white p-2">
                  <div className="w-full h-full bg-neutral-100 flex flex-col items-center justify-center p-3 border border-dashed border-neutral-400">
                    <span className="font-mono text-neutral-400 text-[9px] font-black uppercase">MOCK QR CODE</span>
                    <span className="font-mono text-[#ea2812] text-[8px] font-bold mt-1">SCAN TO SIMULATE PAY</span>
                  </div>
                </div>

                <p className="text-[11px] font-bold text-neutral-600 mb-4">
                  Envía el comprobante al número de WhatsApp para finalizar tu entrada:
                </p>

                <div className="flex flex-col gap-2 max-w-xs mx-auto">
                  <a
                    href="https://wa.me/+59178340060"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#22c55e] text-white border-2 border-black font-black uppercase text-[10px] py-2 rounded-[0.5rem] shadow-[3px_3px_0px_#000] hover:bg-[#16a34a] hover:shadow-[1px_1px_0px_#000] transition-all flex items-center justify-center gap-2"
                  >
                    Enviar Comprobante
                  </a>
                  <button
                    onClick={handlePaymentFinish}
                    className="bg-[#ea2812] text-white border-2 border-black font-black uppercase text-[10px] py-2 rounded-[0.5rem] shadow-[3px_3px_0px_#000] hover:bg-black hover:shadow-[1px_1px_0px_#000] transition-all"
                  >
                    Finalizar Proceso
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: COMPLETED */}
            {currentStep === "COMPLETED" && (
              <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_#000] rounded-[0.5rem] text-center max-w-xl mx-auto w-full">
                <h2 className="text-xl font-black uppercase text-[#ea2812] mb-4">¡REGISTRO COMPLETADO!</h2>

                {/* Final Summary */}
                <div className="border-2 border-dashed border-black p-4 mb-6 mx-auto max-w-md bg-neutral-50 text-left text-[11px] font-medium rounded-[0.3rem]">
                  <span className="text-[10px] font-black uppercase text-[#ea2812] block mb-2">RESUMEN DE REGISTRO:</span>
                  <p className="mb-0.5"><strong>Nombre Completo:</strong> {formData.name} {formData.lastname}</p>
                  <p className="mb-0.5"><strong>Tipo de Entrada:</strong> {selectedCategory}</p>
                  {selectedCategory !== "L" && <p className="mb-0.5"><strong>Detalle Opción:</strong> {selectedItem}</p>}
                  <p className="mb-0.5"><strong>Teléfono:</strong> {formData.phone}</p>
                  <p><strong>Correo:</strong> {formData.email}</p>
                </div>

                <p className="text-[11px] text-neutral-500 mb-6 max-w-md mx-auto leading-relaxed font-medium">
                  Tu entrada simulada ha sido procesada correctamente. Dado que el evento original ya concluyó, esto funciona como una simulación interactiva completa de la Web.
                </p>

                <button
                  onClick={handleResetFlow}
                  className="bg-black text-white border-2 border-black font-black uppercase text-[10px] px-8 py-2.5 rounded-[0.5rem] shadow-[3px_3px_0px_#ea2812] hover:shadow-[1px_1px_0px_#ea2812] transition-all"
                >
                  Volver al Inicio
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Event Location Section */}
        <div className="bg-white py-8 px-4 text-center z-10 relative flex flex-col items-center">
          <h2 className="text-lg font-black uppercase mb-4 tracking-wider">UBICACIÓN</h2>
          <div className="w-[18rem] max-w-full h-[220px] border-[3px] border-black shadow-[6px_6px_0px_#000] relative bg-neutral-100 overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7615.288100852185!2d-66.15307155804686!3d-17.38085280116602!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93e3750029868f33%3A0x94e0e75735b7a526!2sCASA%20GRANDE%20%2F%20MOANA!5e0!3m2!1ses-419!2sbo!4v1723855838549!5m2!1ses-419!2sbo"
              className="w-full h-full border-0 absolute top-0 left-0"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </>
    )}

    {/* TAB 2: MERCH LISTING */}
    {activeTab === "MERCH" && (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">PRODUCTOS DE MERCH</h1>
          <p className="text-[11px] sm:text-xs text-neutral-500 font-medium mt-1">
            Pide tus productos exclusivos directamente por WhatsApp
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {GENERAL_MERCH_ITEMS.map((item) => (
            <div
              key={item.id}
              className="border-3 border-black bg-[#f0f0f0] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_15px_5px_rgba(252,40,18,0.35)] rounded-[0.5rem] flex flex-col justify-between overflow-hidden"
            >
              {/* Image box */}
              <div className="w-full h-52 bg-white flex items-center justify-center p-4 border-b-2 border-black relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {/* Fallback box if image fails */}
                <div className={`absolute inset-0 ${item.placeholderColor} flex items-center justify-center opacity-10 pointer-events-none`}>
                  <Disc className="w-20 h-20 animate-spin" style={{ animationDuration: "12s" }} />
                </div>
              </div>

              {/* Detail content */}
              <div className="p-4 flex flex-col justify-between items-center gap-3">
                <div className="text-center">
                  <h3 className="font-black text-xs sm:text-sm uppercase tracking-wide">{item.name}</h3>
                  <span className="font-bold text-neutral-500 text-xs mt-1 block">{item.price}</span>
                </div>

                <a
                  href={`https://wa.me/+59178340060?text=Hola,%20quiero%20pedir%20${encodeURIComponent(item.name)}%20por%20${item.price}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#ea2812] text-white border-2 border-black font-black uppercase text-[10px] py-2 rounded-[0.5rem] shadow-[3px_3px_0px_#000] hover:bg-black hover:shadow-[1px_1px_0px_#000] transition-all flex items-center justify-center gap-1.5"
                >
                  <Music size={14} />
                  PEDIR AHORA
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* TAB 3: CONTRIBUIDORES */}
    {activeTab === "CONTRIBUIDORES" && (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">CONTRIBUIDORES</h1>
          <p className="text-[11px] sm:text-xs text-neutral-500 font-medium mt-1">
            El equipo detrás del proyecto Astroboy XL
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {CONTRIBUTORS_LIST.map((contributor, index) => (
            <div
              key={index}
              className="border-3 border-black bg-white p-5 text-center rounded-[0.5rem] shadow-[6px_6px_0px_#000] flex flex-col items-center gap-4 hover:translate-y-[-2px] transition-all"
            >
              {/* Photo Box */}
              <div className="w-24 h-24 rounded-full border-2 border-black overflow-hidden bg-neutral-100 flex items-center justify-center relative shadow-[3px_3px_0px_#000]">
                <img
                  src={contributor.photo}
                  alt={contributor.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className={`absolute inset-0 ${contributor.placeholderColor} opacity-40 -z-10`} />
                <span className="font-black text-xs text-neutral-400">{contributor.name.slice(0,2).toUpperCase()}</span>
              </div>

              {/* Info */}
              <div>
                <h3 className="font-black text-sm uppercase tracking-wide">{contributor.name}</h3>
                <span className="text-[10px] text-[#ea2812] font-bold uppercase mt-0.5 block">{contributor.profetion}</span>
              </div>

              {/* Action Contact Icons */}
              <div className="flex gap-2 justify-center">
                {contributor.instagram && (
                  <a
                    href={contributor.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-[0.4rem] border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#000] bg-white hover:bg-[#ea2812] hover:text-white transition-all text-black"
                  >
                    <Instagram size={16} />
                  </a>
                )}
                {contributor.youtube && (
                  <a
                    href={contributor.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-[0.4rem] border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#000] bg-white hover:bg-[#ea2812] hover:text-white transition-all text-black"
                  >
                    <Youtube size={16} />
                  </a>
                )}
                {contributor.spotify && (
                  <a
                    href={contributor.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-[0.4rem] border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#000] bg-white hover:bg-[#ea2812] hover:text-white transition-all text-black"
                  >
                    <Spotify size={16} />
                  </a>
                )}
                {contributor.soundCloud && (
                  <a
                    href={contributor.soundCloud}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-[0.4rem] border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#000] bg-white hover:bg-[#ea2812] hover:text-white transition-all text-black"
                  >
                    <SoundCloud size={16} />
                  </a>
                )}
                {contributor.portfolio && (
                  <a
                    href={contributor.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-[0.4rem] border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#000] bg-white hover:bg-[#ea2812] hover:text-white transition-all text-black"
                  >
                    <Globe size={16} />
                  </a>
                )}
                {contributor.github && (
                  <a
                    href={contributor.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-[0.4rem] border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#000] bg-white hover:bg-[#ea2812] hover:text-white transition-all text-black"
                  >
                    <Github size={16} />
                  </a>
                )}
                {contributor.linkedin && (
                  <a
                    href={contributor.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-[0.4rem] border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#000] bg-white hover:bg-[#ea2812] hover:text-white transition-all text-black"
                  >
                    <Linkedin size={16} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
    </div>

      {/* Streetwear Footer */}
      <footer className="bg-black text-white border-t-4 border-[#ea2812] py-6 px-4 text-center font-bold tracking-tight z-10 relative w-full">
        <div className="max-w-2xl mx-auto">
          {/* Social Icons */}
          <div className="flex justify-center gap-4 mb-4">
            <a href="https://www.instagram.com/tyan.xl/" target="_blank" rel="noopener noreferrer" className="p-1 hover:text-[#ea2812] transition-colors">
              <Instagram size={20} />
            </a>
            <a href="https://www.youtube.com/@tyanxl" target="_blank" rel="noopener noreferrer" className="p-1 hover:text-[#ea2812] transition-colors">
              <Youtube size={20} />
            </a>
            <a href="https://open.spotify.com/intl-es/artist/0CwAkk201F5GOYyUbcv6f9" target="_blank" rel="noopener noreferrer" className="p-1 hover:text-[#ea2812] transition-colors">
              <Spotify size={20} />
            </a>
            <a href="https://soundcloud.com/kid-tyan" target="_blank" rel="noopener noreferrer" className="p-1 hover:text-[#ea2812] transition-colors">
              <SoundCloud size={20} />
            </a>
          </div>

          <p className="text-[9px] text-neutral-400 mb-1">
            Desarrollado por:{" "}
            <a href="https://www.instagram.com/ludwing.dev/" target="_blank" rel="noopener noreferrer" className="text-[#ea2812] underline font-black">
              Ludwing
            </a>
          </p>
          <p className="text-[8px] text-neutral-600">
            © {new Date().getFullYear()} ASTROBOY XL. Todos los derechos reservados. Edición Simulada.
          </p>
        </div>
      </footer>
    </div>
  );
}
