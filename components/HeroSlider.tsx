"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface HeroSlide {
  id: string;
  name: string;
  bg: string;
  product?: string;
  shoe?: string;
  text?: string;
  accessory?: string;
  href?: string;
}

export const defaultShoeSlides: HeroSlide[] = [
  {
    id: "birkenstock",
    name: "Birkenstock",
    bg: "/birkenbck.png",
    text: "/birkentxt.png",
    shoe: "/birkin.png",
    accessory: "/birkintag.png",
  },
  {
    id: "timberland",
    name: "Timberland",
    bg: "/timberbck.png",
    text: "/timbertxt.png",
    shoe: "/timber.png",
    accessory: "/timbertag.png",
  },
  {
    id: "puma",
    name: "Puma",
    bg: "/pumabck.png",
    text: "/pumatxt.png",
    shoe: "/puma.png",
  },
];

export const accessoriesSlides: HeroSlide[] = [
  {
    id: "whoop-already-late-black",
    name: "Whoop Already Late - Black",
    bg: "/bck1.png",
    product: "/pr1.png",
    href: "/product/whoop-already-late-black",
  },
  {
    id: "whoop-metallic",
    name: "Whoop Metallic",
    bg: "/bck2.png",
    product: "/pr2.png",
    href: "/product/whoop-metallic",
  },
  {
    id: "whoop-bear-lux",
    name: "Whoop Bear Lux",
    bg: "/bck3.png",
    product: "/pr3.png",
    href: "/product/whoop-bear-lux",
  },
  {
    id: "google-fitbit-already-late-black",
    name: "Google Fitbit Already Late - Black",
    bg: "/bck4.png",
    product: "/pr4.png",
    href: "/product/google-fitbit-already-late-black",
  },
];

interface HeroSliderProps {
  slides?: HeroSlide[];
  showNavLabels?: boolean;
}

export default function HeroSlider({
  slides = defaultShoeSlides,
  showNavLabels = true,
}: HeroSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const [activeDot, setActiveDot] = useState(0);
  const isAnimatingRef = useRef(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const isHeroInView = useRef(false);
  const autoplayTimerRef = useRef<gsap.core.Tween | null>(null);
  const idleTweensRef = useRef<gsap.core.Tween[]>([]);

  // Gesture handling for touch swipes
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const hasSwipedRef = useRef(false);

  const killAutoplay = () => {
    if (autoplayTimerRef.current) {
      autoplayTimerRef.current.kill();
      autoplayTimerRef.current = null;
    }
  };

  const { contextSafe } = useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      // Set initial states
      slides.forEach((_, i) => {
        if (i !== 0) {
          gsap.set(`.slide-${i}`, { autoAlpha: 0, zIndex: 1 });
        } else {
          gsap.set(`.slide-${i}`, { autoAlpha: 1, zIndex: 10 });
        }
      });

      // Start initial idle animation for Slide 0
      startIdleAnimations(0);

      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => {
          isHeroInView.current = true;
          resetAutoplay();
        },
        onLeave: () => {
          isHeroInView.current = false;
          killAutoplay();
        },
        onEnterBack: () => {
          isHeroInView.current = true;
          resetAutoplay();
        },
        onLeaveBack: () => {
          isHeroInView.current = false;
          killAutoplay();
        },
      });

      return () => {
        trigger.kill();
      };
    },
    { scope: containerRef, dependencies: [slides] }
  );

  // Complete cleanup on unmount
  useEffect(() => {
    return () => {
      killAutoplay();
      idleTweensRef.current.forEach((t) => t.kill());
      idleTweensRef.current = [];
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
    };
  }, []);

  const resetAutoplay = contextSafe(() => {
    killAutoplay();
    if (isHeroInView.current) {
      autoplayTimerRef.current = gsap.delayedCall(4.5, () => {
        if (isAnimatingRef.current) {
          resetAutoplay();
          return;
        }
        let nextIndex = activeIndexRef.current + 1;
        if (nextIndex >= slides.length) nextIndex = 0;

        goToSlide(nextIndex, 1);
        resetAutoplay();
      });
    }
  });

  const startIdleAnimations = contextSafe((index: number) => {
    idleTweensRef.current.forEach((t) => t.kill());
    idleTweensRef.current = [];

    const currentShoe = sliderRef.current?.querySelector(`.slide-${index} .slide-shoe`);
    const currentAccessory = sliderRef.current?.querySelector(`.slide-${index} .slide-accessory`);

    if (currentShoe) {
      idleTweensRef.current.push(
        gsap.to(currentShoe, {
          rotation: 2.5,
          y: -8,
          duration: 3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      );
    }

    if (currentAccessory) {
      idleTweensRef.current.push(
        gsap.to(currentAccessory, {
          rotation: -4,
          y: 12,
          duration: 3.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      );
    }
  });

  const goToSlide = contextSafe((index: number, direction: number) => {
    if (index === activeIndexRef.current) return;

    if (tlRef.current && tlRef.current.isActive()) {
      tlRef.current.progress(1);
      tlRef.current.kill();
    }

    // Kill idle animations right before exit begins
    idleTweensRef.current.forEach((t) => t.kill());
    idleTweensRef.current = [];

    const tl = gsap.timeline();
    tlRef.current = tl;
    isAnimatingRef.current = true;

    const prevIndex = activeIndexRef.current;

    tl.eventCallback("onComplete", () => {
      isAnimatingRef.current = false;
      setActiveDot(index);
      const oldSlide = sliderRef.current?.querySelector(`.slide-${prevIndex}`);
      if (oldSlide) gsap.set(oldSlide, { autoAlpha: 0 });

      // Start idle animations for the new active slide
      startIdleAnimations(index);
    });

    const prevSlide = sliderRef.current?.querySelector(`.slide-${prevIndex}`);
    const nextSlide = sliderRef.current?.querySelector(`.slide-${index}`);

    if (!prevSlide || !nextSlide) return;

    const prevBg = prevSlide.querySelector(".slide-bg");
    const prevShoe = prevSlide.querySelector(".slide-shoe");
    const prevText = prevSlide.querySelector(".slide-text");
    const prevAccessory = prevSlide.querySelector(".slide-accessory");

    const nextBg = nextSlide.querySelector(".slide-bg");
    const nextShoe = nextSlide.querySelector(".slide-shoe");
    const nextText = nextSlide.querySelector(".slide-text");
    const nextAccessory = nextSlide.querySelector(".slide-accessory");

    // Prepare next slide
    gsap.set(nextSlide, { autoAlpha: 1, zIndex: 10 });
    gsap.set(prevSlide, { zIndex: 1 });

    tl.addLabel("start", 0);
    const entryLabel = "start+=0.2";

    // 1. Background
    if (prevBg) {
      tl.to(prevBg, { autoAlpha: 0, duration: 0.8, ease: "power2.inOut" }, "start");
    }
    if (nextBg) {
      tl.fromTo(
        nextBg,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.8, ease: "power2.inOut" },
        entryLabel
      );
    }

    const exitX = direction === 1 ? -100 : 100;
    const entryX = direction === 1 ? 100 : -100;

    // Exit Dip
    if (prevShoe) {
      tl.to(
        prevShoe,
        { scale: 0.85, rotation: direction === 1 ? -10 : 10, duration: 0.15, ease: "power1.inOut" },
        "start"
      );
    }
    if (prevText) {
      tl.to(prevText, { scale: 0.9, duration: 0.15, ease: "power1.inOut" }, "start");
    }

    // Exit Fly
    if (prevShoe) {
      tl.to(
        prevShoe,
        { x: `${exitX}vw`, rotation: direction === 1 ? -90 : 90, duration: 0.65, ease: "back.in(1)" },
        "start+=0.15"
      );
    }
    if (prevText) {
      tl.to(
        prevText,
        {
          rotateY: direction === 1 ? -90 : 90,
          scale: 0.8,
          autoAlpha: 0,
          duration: 0.65,
          ease: "back.in(1)",
        },
        "start+=0.15"
      );
    }

    // Accessory Exit (if present)
    if (prevAccessory) {
      tl.to(
        prevAccessory,
        { scale: 0.9, rotation: direction === 1 ? -5 : 5, duration: 0.15, ease: "power1.inOut" },
        "start+=0.1"
      );
      tl.to(
        prevAccessory,
        {
          x: `${exitX * 0.6}vw`,
          rotation: direction === 1 ? -45 : 45,
          autoAlpha: 0,
          duration: 0.65,
          ease: "back.in(1)",
        },
        "start+=0.25"
      );
    }

    // Entry
    if (nextShoe) {
      tl.fromTo(
        nextShoe,
        { x: `${entryX}vw`, rotation: direction === 1 ? 90 : -90, scale: 1 },
        { x: "0vw", rotation: 0, duration: 0.8, ease: "back.out(1.2)" },
        entryLabel
      );
    }
    if (nextText) {
      tl.fromTo(
        nextText,
        { rotateY: direction === 1 ? 90 : -90, scale: 0.8, autoAlpha: 0 },
        { rotateY: 0, scale: 1, autoAlpha: 1, duration: 0.8, ease: "back.out(1.2)" },
        entryLabel
      );
    }

    // Accessory Entry (if present)
    if (nextAccessory) {
      tl.fromTo(
        nextAccessory,
        { x: `${entryX * 0.6}vw`, rotation: direction === 1 ? 45 : -45, scale: 0.8, autoAlpha: 0 },
        { x: "0vw", rotation: 0, scale: 1, autoAlpha: 1, duration: 0.8, ease: "back.out(1.2)" },
        "start+=0.35"
      );
    }

    activeIndexRef.current = index;
  });

  const handleDotClick = (index: number) => {
    if (index === activeIndexRef.current || isAnimatingRef.current) return;
    resetAutoplay();
    goToSlide(index, index > activeIndexRef.current ? 1 : -1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    hasSwipedRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartXRef.current;
    const dy = e.touches[0].clientY - touchStartYRef.current;
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      hasSwipedRef.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartXRef.current;
    const dy = e.changedTouches[0].clientY - touchStartYRef.current;

    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        // Swiped left -> next slide
        let nextIndex = activeIndexRef.current + 1;
        if (nextIndex >= slides.length) nextIndex = 0;
        goToSlide(nextIndex, 1);
        resetAutoplay();
      } else {
        // Swiped right -> prev slide
        let prevIndex = activeIndexRef.current - 1;
        if (prevIndex < 0) prevIndex = slides.length - 1;
        goToSlide(prevIndex, -1);
        resetAutoplay();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[50vh] min-h-[480px] bg-black overflow-hidden select-none"
    >
      <div ref={sliderRef} className="relative w-full h-full">
        {slides.map((slide, i) => {
          const productSrc = slide.product || slide.shoe;
          const isActive = activeDot === i;

          return (
            <div
              key={slide.id}
              className={`slide-${i} absolute inset-0 w-full h-full ${
                isActive ? "pointer-events-auto" : "pointer-events-none"
              }`}
              style={{ perspective: "1000px" }}
            >
              {/* Background Layer */}
              <div className="slide-bg absolute inset-0 w-full h-full pointer-events-none">
                <Image
                  src={slide.bg}
                  alt={`${slide.name} Background`}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Text Layer (Optional CSS Centered Wrapper) */}
              {slide.text && (
                <div className="absolute inset-0 flex items-start justify-center pt-8 md:pt-12 pointer-events-none">
                  <div className="slide-text relative w-[180%] md:w-[115%] max-w-[1600px] aspect-[16/10] md:aspect-[21/9]">
                    <Image
                      src={slide.text}
                      alt={slide.name}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              )}

              {/* Product / Shoe Layer (CSS Centered Wrapper) */}
              {productSrc && (
                <div className="absolute top-[48%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[115%] md:h-[105%] max-w-[95vw] aspect-square pointer-events-none z-10">
                  <div className="slide-shoe w-full h-full relative">
                    {slide.href ? (
                      <Link
                        href={slide.href}
                        onClick={(e) => {
                          if (isAnimatingRef.current || hasSwipedRef.current) {
                            e.preventDefault();
                          }
                        }}
                        className={`block w-full h-full relative ${
                          isActive
                            ? "pointer-events-auto cursor-pointer"
                            : "pointer-events-none"
                        }`}
                        aria-label={`Shop ${slide.name}`}
                      >
                        <Image
                          src={productSrc}
                          alt={`${slide.name} Product`}
                          fill
                          className="object-contain drop-shadow-2xl"
                          priority
                        />
                      </Link>
                    ) : (
                      <Image
                        src={productSrc}
                        alt={`${slide.name} Product`}
                        fill
                        className="object-contain drop-shadow-2xl"
                        priority
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Floating Accessory Layer (Optional) */}
              {slide.accessory && (
                <div className="absolute top-[62%] md:top-[60%] right-[2%] md:right-[15%] w-[45%] md:w-[25%] max-w-[220px] md:max-w-[300px] aspect-square pointer-events-none z-20">
                  <div className="slide-accessory w-full h-full relative">
                    <Image
                      src={slide.accessory}
                      alt={`${slide.name} Accessory`}
                      fill
                      className="object-contain drop-shadow-xl"
                      priority
                    />
                  </div>
                </div>
              )}

              {/* Visible "Shop now" button on active slide */}
              {slide.href && isActive && (
                <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
                  <Link
                    href={slide.href}
                    onClick={(e) => {
                      if (isAnimatingRef.current || hasSwipedRef.current) {
                        e.preventDefault();
                      }
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-gray-900 font-bold text-xs md:text-sm shadow-xl hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    <span>Shop now</span>
                    <span className="text-base leading-none">→</span>
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 md:gap-6 pointer-events-auto">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => handleDotClick(i)}
            aria-label={`Go to slide ${i + 1}: ${slide.name}`}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            {showNavLabels && (
              <span
                className={`text-sm font-bold tracking-widest transition-colors duration-300 ${
                  activeDot === i ? "text-white" : "text-white/50 group-hover:text-white/80"
                }`}
              >
                {slide.name.toUpperCase()}
              </span>
            )}
            <div
              className={`h-1.5 transition-all duration-300 rounded-full ${
                activeDot === i
                  ? showNavLabels
                    ? "w-12 bg-white"
                    : "w-8 bg-white"
                  : showNavLabels
                  ? "w-4 bg-white/50 group-hover:bg-white/80"
                  : "w-3 bg-white/40 group-hover:bg-white/70"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
