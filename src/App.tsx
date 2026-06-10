import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Custom Animated Stats Counter Component
function Counter({ target, label }: { target: number; label: string }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          let startTimestamp: number | null = null;
          const duration = 1800; // 1.8 seconds transition
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic transition
            setCount(Math.floor(eased * target));
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCount(target);
            }
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={elementRef} className="flex flex-col items-center">
      <div className="stat-num">{count}</div>
      <div className="text-[13px] text-zinc-400 font-semibold tracking-wider mt-1 uppercase">
        {label}
      </div>
    </div>
  );
}

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [tooltipState, setTooltipState] = useState<'hidden' | 'typing' | 'message'>('hidden');
  const [activeSection, setActiveSection] = useState<string>('');

  // Handle scroll offsets and detect active section
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolled(window.scrollY > 60);

      // Scroll Spy logic
      const sections = ['servicos', 'beneficios', 'contato'];
      const scrollPosition = window.scrollY + 220; // safe offset for navbar height

      let currentActive = '';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentActive = section;
            break;
          }
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle WhatsApp floating assistant timing
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setTooltipState('typing');
    }, 2500);

    const timer2 = setTimeout(() => {
      setTooltipState('message');
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const services = [
    {
      image: "assets/service_engine.png",
      title: "Motor",
      desc: "Verificação completa do motor: óleo, filtros, correia, velas e desempenho geral para garantir máxima potência."
    },
    {
      image: "assets/service_brakes.png",
      title: "Freios",
      desc: "Inspeção e substituição de pastilhas, discos e fluido de freio. Sua segurança começa em frear bem."
    },
    {
      image: "assets/service_chain.png",
      title: "Corrente e Transmissão",
      desc: "Tensionamento, lubrificação, troca de corrente e coroa. Transmissão eficiente = economia de combustível."
    },
    {
      image: "assets/service_tires.png",
      title: "Pneus",
      desc: "Calibragem, verificação de desgaste e troca de pneus. Aderência correta em qualquer pista."
    },
    {
      image: "assets/service_suspension.png",
      title: "Suspensão",
      desc: "Regulagem e manutenção de amortecedores e garfos. Conforto e controle em qualquer terreno."
    }
  ];

  return (
    <div id="moto-landing" className="bg-[#0A0A0A] text-[#F0F0F0] relative min-h-screen selection:bg-brand-red selection:text-white overflow-hidden font-sans">
      
      {/* ── NAVBAR ── */}
      <nav 
        id="navbar" 
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
          isScrolled ? 'bg-[rgba(10,10,10,0.92)] backdrop-blur-md border-b border-brand-red/30 shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between relative">
          <div className="flex items-center w-full md:w-auto justify-center md:justify-start">
            <img 
              src="logo_transparent.png" 
              alt="Carlinhos Motos" 
              style={{ 
                height: isScrolled ? '64px' : '82px', 
                width: 'auto', 
                objectFit: 'contain', 
                filter: 'drop-shadow(0 0 8px rgba(204,0,0,0.4))',
                transition: 'height 0.3s ease-in-out'
              }} 
            />
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a 
              href="#servicos" 
              className={`font-bebas text-[18px] tracking-wider uppercase transition-all duration-200 relative py-1 ${
                activeSection === 'servicos' ? 'text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              SERVIÇOS
              {activeSection === 'servicos' && (
                <motion.span 
                  layoutId="activeIndicator" 
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-red"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
            <a 
              href="#beneficios" 
              className={`font-bebas text-[18px] tracking-wider uppercase transition-all duration-200 relative py-1 ${
                activeSection === 'beneficios' ? 'text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              DIFERENCIAIS
              {activeSection === 'beneficios' && (
                <motion.span 
                  layoutId="activeIndicator" 
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-red"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
            <a 
              href="#contato" 
              className={`font-bebas text-[18px] tracking-wider uppercase transition-all duration-200 relative py-1 ${
                activeSection === 'contato' ? 'text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              CONTATO
              {activeSection === 'contato' && (
                <motion.span 
                  layoutId="activeIndicator" 
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-red"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
            <a 
              href="https://wa.me/5548998669011" 
              target="_blank" 
              rel="referrer"
              className="btn-red text-[14px] px-[22px] py-[10px]"
            >
              Agendar Revisão
            </a>
          </div>

          <button 
            id="menu-toggle-btn" 
            className="md:hidden absolute right-6 border-none bg-transparent text-white cursor-pointer"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
              <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
              <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            id="mobile-menu"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-[#0A0A0A]/98 z-50 flex flex-col items-center justify-center gap-8"
          >
            <button 
              className="absolute top-5 right-6 bg-transparent border-none text-white cursor-pointer text-[32px] hover:text-brand-red transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ✕
            </button>
            <a 
              href="#servicos" 
              className={`font-bebas text-[36px] tracking-wider transition-colors ${
                activeSection === 'servicos' ? 'text-brand-red' : 'text-white hover:text-brand-red'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              SERVIÇOS
            </a>
            <a 
              href="#beneficios" 
              className={`font-bebas text-[36px] tracking-wider transition-colors ${
                activeSection === 'beneficios' ? 'text-brand-red' : 'text-white hover:text-brand-red'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              DIFERENCIAIS
            </a>
            <a 
              href="#contato" 
              className={`font-bebas text-[36px] tracking-wider transition-colors ${
                activeSection === 'contato' ? 'text-brand-red' : 'text-white hover:text-brand-red'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              CONTATO
            </a>
            <a 
              href="https://wa.me/5548998669011" 
              target="_blank" 
              rel="referrer"
              className="btn-red text-[22px] mt-2 px-[32px] py-[14px]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Agendar Revisão
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section id="hero" className="relative min-h-[600px] h-screen flex items-center overflow-hidden pt-20">
        <div 
          id="hero-bg" 
          className="absolute inset-0 z-0 bg-radial-gradient"
          style={{ 
            backgroundImage: `radial-gradient(ellipse 80% 60% at 70% 50%, rgba(204,0,0,0.18) 0%, transparent 70%), linear-gradient(160deg, #0A0A0A 45%, #1a0000 100%)`,
            transform: `translateY(${Math.min(scrollY * 0.3, 300)}px)`
          }} 
        />
        <div className="hero-grid-lines absolute inset-0 z-0" />
        <div className="slash-accent absolute inset-0 z-0" />

        {/* Floating Logo Right */}
        <div id="hero-moto" className="absolute top-0 bottom-0 right-0 w-full md:w-[52%] pointer-events-none flex items-center justify-center z-2 max-md:opacity-18">
          <motion.img 
            src="logo_transparent.png" 
            alt="Carlinhos Motos" 
            className="w-[90%] max-w-[560px] h-auto object-contain" 
            style={{ filter: 'drop-shadow(0 0 40px rgba(204,0,0,0.5)) drop-shadow(0 0 80px rgba(204,0,0,0.25))' }}
            animate={{ translateY: [0, -12, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Content Mask */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/55 to-transparent pointer-events-none z-[1] max-md:hidden" />

        <div className="max-w-6xl mx-auto px-6 relative z-10 w-full">
          <div className="max-w-2xl text-left">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 bg-brand-red/12 border border-brand-red/35 rounded-full px-4 py-1.5 mb-6"
            >
              <span className="w-2 h-2 bg-brand-red-bright rounded-full inline-block animate-pulse" />
              <span className="text-[12px] font-semibold tracking-widest text-brand-red-bright uppercase">
                INGLESES – FLORIANÓPOLIS/SC
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="text-white text-5xl sm:text-7xl lg:text-8xl leading-[0.9] font-bebas mb-6"
            >
              PRECISANDO<br />
              <span className="text-brand-red">DE REVISÃO?</span><br />
              VENHA AQUI!
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-[17px] text-zinc-400 leading-relaxed max-w-[480px] mb-9"
            >
              Cuidado que você sente, confiança que você merece.<br />
              Sua moto em boas mãos <strong className="text-white">sempre!</strong>
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              className="flex flex-wrap gap-3.5 items-center z-20"
            >
              <a href="https://wa.me/5548998669011" target="_blank" rel="referrer" className="btn-red hover:scale-[1.02] transform transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                AGENDAR REVISÃO
              </a>
              <a href="tel:+5548998669011" className="btn-outline">
                📞 (48) 99866-9011
              </a>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator cue */}
        <AnimatePresence>
          {scrollY < 40 && (
            <motion.div 
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 0.45, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none"
            >
              <span className="text-[11px] tracking-widest font-semibold">SCROLL</span>
              <div className="w-[1px] h-9 bg-gradient-to-b from-white to-transparent animate-bounce" />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── MARQUEE ── */}
      <div className="marquee-wrap">
        <div className="marquee-track" id="marquee-track">
          <span>MOTOR</span><span className="sep">•</span>
          <span>FREIOS</span><span className="sep">•</span>
          <span>CORRENTE</span><span class="sep">•</span>
          <span>PNEUS</span><span className="sep">•</span>
          <span>SUSPENSÃO</span><span className="sep">•</span>
          <span>REVISÃO COMPLETA</span><span className="sep">•</span>
          <span>CARLINHOS MOTOS</span><span className="sep">•</span>
          {/* Double buffer for infinite scrolling trail sync */}
          <span>MOTOR</span><span className="sep">•</span>
          <span>FREIOS</span><span className="sep">•</span>
          <span>CORRENTE</span><span className="sep">•</span>
          <span>PNEUS</span><span className="sep">•</span>
          <span>SUSPENSÃO</span><span className="sep">•</span>
          <span>REVISÃO COMPLETA</span><span className="sep">•</span>
          <span>CARLINHOS MOTOS</span><span className="sep">•</span>
        </div>
      </div>

      {/* ── STATS COUNTER ── */}
      <section id="stats" className="bg-[#141414] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <Counter target={1500} label="MOTOS REVISADAS" />
            <Counter target={10} label="ANOS DE EXPERIÊNCIA" />
            <Counter target={98} label="% APROVAÇÃO CLIENTES" />
            <Counter target={6} label="SERVIÇOS ESPECIALIZADOS" />
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="servicos" className="py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7 }}
            className="mb-16 text-left"
          >
            <div className="text-[12px] font-semibold tracking-widest text-brand-red mb-3 uppercase">O QUE FAZEMOS</div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl leading-[0.95] mb-4 font-bebas">
              SERVIÇOS DE<br /><span className="text-brand-red">REVISÃO</span>
            </h2>
            <div className="red-bar w-[60px]" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 45, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  type: "spring",
                  stiffness: 90,
                  damping: 15,
                  delay: idx * 0.1 
                }}
                className="service-card group"
              >
                <div className="h-[140px] -mt-7 -mx-6 mb-5 overflow-hidden rounded-t-[8px]">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover filter saturate-60 brightness-[0.85] group-hover:scale-107 group-hover:saturate-90 group-hover:brightness-95 transition-all duration-400"
                  />
                </div>
                <h3 className="text-[22px] font-bebas mb-2.5 text-white">{item.title}</h3>
                <p className="text-[14px] text-zinc-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}

            {/* Extra Promo Service Card */}
            <motion.div 
              initial={{ opacity: 0, y: 45, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                type: "spring",
                stiffness: 90,
                damping: 15,
                delay: services.length * 0.1 
              }}
              className="service-card border-brand-red/35 bg-brand-red/6 flex flex-col justify-between"
            >
              <div>
                <div className="text-[38px] mb-4">✅</div>
                <h3 className="text-[22px] font-bebas mb-2.5 text-brand-red">E muito mais!</h3>
                <p className="text-[14px] text-zinc-400 leading-relaxed">
                  Elétrica, carburação, regulagem de válvulas, troca de relação, inspeção geral e diagnóstico completo.
                </p>
              </div>
              <a 
                href="https://wa.me/5548998669011" 
                target="_blank" 
                rel="referrer"
                className="inline-block mt-4 text-[13px] text-brand-red hover:text-brand-red-bright font-semibold tracking-wide transition-colors"
              >
                Consultar →
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA BAND 1 ── */}
      <div className="cta-band py-14 px-6">
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-5xl lg:text-5xl text-white leading-tight font-bebas text-left">
              VENHA FAZER SUA REVISÃO<br />
              <span className="opacity-80">NA CARLINHOS MOTOS</span>
            </h2>
          </motion.div>
          
          <motion.a 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            href="https://wa.me/5548998669011" 
            target="_blank" 
            rel="referrer"
            className="flex-shrink-0 inline-flex items-center gap-2.5 bg-black hover:bg-zinc-900 border-none text-white font-bebas text-lg tracking-wider px-8 py-4 rounded transition-all shadow-lg hover:-translate-y-0.5"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            FALAR NO WHATSAPP
          </motion.a>
        </div>
      </div>

      {/* ── PEÇAS E ACESSÓRIOS ── */}
      <section id="pecas" className="py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-14 text-left"
          >
            <div className="text-[12px] font-semibold tracking-widest text-brand-red mb-3 uppercase">LOJA CARLINHOS MOTOS</div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl leading-[0.95] mb-4 font-bebas">
              PEÇAS E<br /><span className="text-brand-red">ACESSÓRIOS</span>
            </h2>
            <div className="red-bar w-[60px]" />
          </motion.div>

          {/* Asymmetric Image Grid */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="gallery-grid"
          >
            {/* Large Hero Left Photo */}
            <div className="gallery-item g-main min-h-[300px] sm:min-h-[420px] relative">
              <img src="assets/acc_main_1781039612359.png" alt="Capacete e luvas premium" />
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent text-left">
                <span className="font-bebas text-lg tracking-widest text-white">EQUIPAMENTOS DE ALTA PERFORMANCE</span>
              </div>
            </div>
            
            {/* Smaller Items Grid */}
            <div className="gallery-item h-[150px] sm:h-[200px]">
              <img src="assets/acc_jacket_1781039622786.png" alt="Jaquetas de proteção" />
            </div>
            <div className="gallery-item h-[150px] sm:h-[200px]">
              <img src="assets/acc_exhaust_1781039633631.png" alt="Escapamentos esportivos" />
            </div>
            <div className="gallery-item h-[150px] sm:h-[200px]">
              <img src="assets/acc_store_1781039643689.png" alt="Acessórios na loja" />
            </div>
            <div className="gallery-item h-[150px] sm:h-[200px]">
              <img src="assets/acc_gloves_1781039653620.png" alt="Luvas e vestuário" />
            </div>
          </motion.div>

          <p className="text-center text-[13px] text-zinc-400 tracking-wide mt-5 uppercase">
            Capacetes, jaquetas, luvas, escapamentos e peças originais para você e sua moto andarem no estilo.
          </p>
        </div>
      </section>

      {/* ── BENEFÍCIOS ── */}
      <section id="beneficios" className="py-24 px-6 bg-[#141414]">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="text-[12px] font-semibold tracking-widest text-brand-red mb-3 uppercase">NOSSOS DIFERENCIAIS</div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl leading-[0.95] mb-4 font-bebas">
              POR QUE <span className="text-brand-red">ESCOLHER</span><br />A CARLINHOS MOTOS
            </h2>
            <div className="red-bar w-[60px] mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 45, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                type: "spring",
                stiffness: 90,
                damping: 15,
                delay: 0.1 
              }}
              className="benefit-card group"
            >
              <div className="benefit-icon p-2">🛡️</div>
              <h3 className="bebas text-[24px] mb-2.5">Mais Segurança</h3>
              <p className="text-[14px] text-zinc-400 leading-relaxed">
                Revisão completa para você andar sem preocupações. Cada parafuso no lugar certo.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 45, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                type: "spring",
                stiffness: 90,
                damping: 15,
                delay: 0.2 
              }}
              className="benefit-card group"
            >
              <div className="benefit-icon p-2">💰</div>
              <h3 className="bebas text-[24px] mb-2.5">Mais Economia</h3>
              <p className="text-[14px] text-zinc-400 leading-relaxed">
                Moto revisada consome menos combustível e evita consertos caros no futuro.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 45, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                type: "spring",
                stiffness: 90,
                damping: 15,
                delay: 0.3 
              }}
              className="benefit-card group"
            >
              <div className="benefit-icon p-2">⚡</div>
              <h3 className="bebas text-[24px] mb-2.5">Mais Desempenho</h3>
              <p className="text-[14px] text-zinc-400 leading-relaxed">
                Motor calibrado, transmissão afinada e freios na medida: sinta a diferença na aceleração.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 45, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                type: "spring",
                stiffness: 90,
                damping: 15,
                delay: 0.4 
              }}
              className="benefit-card group"
            >
              <div className="benefit-icon p-2">♾️</div>
              <h3 className="bebas text-[24px] mb-2.5">Maior Durabilidade</h3>
              <p className="text-[14px] text-zinc-400 leading-relaxed">
                Manutenção preventiva regular dobra a vida útil da sua moto. Cuide hoje, rode por anos.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CONFIANÇA INTRO ── */}
      <section className="py-20 px-6 bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="text-3xl sm:text-5xl font-bebas leading-tight text-zinc-400">
              " <span className="text-white">CUIDADO QUE VOCÊ SENTE,<br /></span>
              <span className="text-brand-red">CONFIANÇA QUE VOCÊ MERECE!</span> "
            </div>
            <div className="mt-6 w-[50px] h-[1px] bg-brand-red mx-auto" />
            <p className="mt-5 text-[14px] text-zinc-400 tracking-[0.1em] font-semibold">
              CARLINHOS MOTOS – INGLESES, FLORIANÓPOLIS
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CONTATO ── */}
      <section id="contato" className="py-24 px-6 bg-[#141414]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Info Column */}
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10 text-left"
              >
                <div className="text-[12px] font-semibold tracking-widest text-brand-red mb-3 uppercase">FALE COM A GENTE</div>
                <h2 className="text-4xl sm:text-6xl lg:text-7xl leading-[0.95] mb-4 font-bebas">
                  ENTRE EM<br /><span className="text-brand-red">CONTATO</span>
                </h2>
                <div className="red-bar w-[60px]" />
                <p className="mt-5 text-[16px] text-zinc-400 leading-relaxed">
                  Sua moto em boas mãos sempre.<br />Agende sua revisão agora mesmo!
                </p>
              </motion.div>

              <div className="flex flex-col gap-3.5">
                <motion.a 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  href="https://wa.me/5548998669011" 
                  target="_blank" 
                  rel="referrer"
                  className="contact-item cursor-pointer text-left"
                >
                  <div className="contact-icon text-brand-red">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[11.5px] text-zinc-500 tracking-wider font-semibold mb-0.5">WHATSAPP / TELEFONE</div>
                    <div className="text-[18px] font-bold text-white">(48) 99866-9011</div>
                  </div>
                </motion.a>

                <motion.a 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  href="https://instagram.com/carlinhos_motos01" 
                  target="_blank" 
                  rel="referrer"
                  className="contact-item cursor-pointer text-left"
                >
                  <div className="contact-icon text-brand-red">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[11.5px] text-zinc-500 tracking-wider font-semibold mb-0.5">INSTAGRAM</div>
                    <div className="text-[18px] font-bold text-white">@carlinhos_motos01</div>
                  </div>
                </motion.a>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="contact-item text-left"
                >
                  <div className="contact-icon text-xl text-brand-red">📍</div>
                  <div>
                    <div className="text-[11.5px] text-zinc-500 tracking-wider font-semibold mb-0.5">ENDEREÇO</div>
                    <div className="text-[16px] font-bold text-white leading-snug">
                      Intendente João Nunes Vieira, 155<br />
                      <span className="text-[14px] text-zinc-400 font-normal">Ingleses do Rio Vermelho – Florianópolis/SC</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Map Placeholder + Work Hour Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="h-full"
            >
              <div className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-brand-red/20 h-[340px] relative shadow-2xl">
                <iframe
                  src="https://maps.google.com/maps?q=Intendente+Jo%C3%A3o+Nunes+Vieira,+155+Ingleses+do+Rio+Vermelho+Florian%C3%B3polis&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%" 
                  height="100%"
                  style={{ border: '0', filter: 'grayscale(60%) invert(80%) contrast(90%)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-0 pointer-events-none border-2 border-brand-red/30 rounded-xl" />
              </div>

              <div className="mt-5 bg-brand-red/6 border border-brand-red/20 rounded-lg p-6 text-left">
                <div className="font-bebas text-[22px] tracking-wider mb-2 text-white">HORÁRIO DE ATENDIMENTO</div>
                <div className="text-[14px] text-zinc-400 leading-relaxed font-medium">
                  <span className="text-white">Segunda a Sexta</span> — 08h às 18h<br />
                  <span className="text-white">Sábado</span> — 08h às 12h<br />
                  <span className="text-brand-red-bright font-semibold">Domingo</span> — Fechado
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-6 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#1A1A1A] border border-brand-red/25 rounded-2xl px-8 py-14 sm:px-14 sm:py-16 text-center shadow-2xl"
          >
            <div className="text-[12px] font-semibold tracking-widest text-[#CC0000] mb-4 uppercase">SUA MOTO MERECE</div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl leading-none mb-5 font-bebas text-white">
              AGENDE SUA<br /><span className="text-brand-red">REVISÃO HOJE</span>
            </h2>
            <p className="text-[16px] text-zinc-400 max-w-[500px] mx-auto mb-9 leading-relaxed">
              Não espere dar problema para cuidar da sua moto.<br />Uma revisão preventiva vale muito mais do que um conserto.
            </p>
            <div className="flex flex-wrap gap-3.5 justify-center">
              <a href="https://wa.me/5548998669011" target="_blank" rel="referrer" className="btn-red text-[18px] px-9 py-4 font-bebas tracking-wide shadow-lg hover:scale-[1.02] transform transition">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-1">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                CHAMAR NO WHATSAPP
              </a>
              <a href="tel:+5548998669011" className="btn-outline text-[18px] px-9 py-4 font-bebas tracking-wide shadow-lg hover:scale-[1.02] transform transition">
                📞 LIGAR AGORA
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6 bg-[#050505] border-t border-brand-red/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center">
              <img 
                src="logo.png" 
                alt="Carlinhos Motos" 
                style={{ height: '70px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(204,0,0,0.35))' }} 
              />
            </div>
            <div className="text-[12px] text-zinc-500 text-center font-medium">
              © 2026 Carlinhos Motos. Todos os direitos reservados.
            </div>
            <div className="flex gap-3">
              <a 
                href="https://wa.me/5548998669011" 
                target="_blank" 
                rel="referrer"
                className="w-9 h-9 bg-white/6 hover:bg-brand-red/20 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a 
                href="https://instagram.com/carlinhos_motos01" 
                target="_blank" 
                rel="referrer"
                className="w-9 h-9 bg-white/6 hover:bg-brand-red/20 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── FLOATING WHATSAPP CHAT ── */}
      <div id="wa-container">
        <AnimatePresence>
          {tooltipState !== 'hidden' && (
            <motion.div 
              id="wa-tooltip"
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="font-sans"
            >
              {tooltipState === 'typing' && (
                <div id="wa-typing" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '13px', color: '#777', fontStyle: 'italic' }}>Carlinhos está digitando</span>
                  <div className="wa-dot"></div>
                  <div className="wa-dot"></div>
                  <div className="wa-dot"></div>
                </div>
              )}
              {tooltipState === 'message' && (
                <div id="wa-msg" className="flex items-center gap-2 text-[15px] text-zinc-800 tracking-wide font-semibold select-none">
                  <span>👋</span> Oi, como posso ajudar?
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        <a 
          href="https://wa.me/5548998669011" 
          target="_blank" 
          rel="referrer"
          id="float-wa" 
          className="w-[58px] h-[58px] bg-[#25D366] rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 active:scale-95 duration-200"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>

    </div>
  );
}
