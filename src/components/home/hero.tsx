"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: "banner",
    type: "image" as const,
    src: "/images/hero-makhana.png",
    kicker: "Farm fresh from Mithila, Bihar",
    title: "Pure fox nuts. Popped the traditional way.",
    cta: "Shop now",
    href: "/shop",
  },
  {
    id: "making",
    type: "video" as const,
    src: "/videos/making-process.mp4",
    kicker: "The craft",
    title: "How Mithila makhana is made",
    cta: "Explore products",
    href: "/shop",
  },
  {
    id: "production",
    type: "video" as const,
    src: "/videos/production-process.mp4",
    kicker: "The harvest",
    title: "From pond to pouch, in Bihar",
    cta: "Shop the harvest",
    href: "/shop",
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);
  const [needsTap, setNeedsTap] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const slide = slides[index];

  const go = useCallback((dir: number) => {
    setNeedsTap(false);
    setIndex((i) => (i + dir + slides.length) % slides.length);
  }, []);

  const tryPlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    el.play()
      .then(() => setNeedsTap(false))
      .catch(() => setNeedsTap(true));
  }, []);

  useEffect(() => {
    if (slide.type !== "video") {
      setNeedsTap(false);
      return;
    }
    const t = window.setTimeout(tryPlay, 40);
    return () => window.clearTimeout(t);
  }, [index, slide.type, tryPlay]);

  useEffect(() => {
    const t = window.setTimeout(() => go(1), slide.type === "video" ? 12000 : 6000);
    return () => window.clearTimeout(t);
  }, [index, slide.type, go]);

  return (
    <section className="relative overflow-hidden bg-muted">
      <div className="relative aspect-[16/9] min-h-[420px] w-full md:min-h-[520px] lg:min-h-[600px]">
        {slide.type === "video" ? (
          <video
            key={slide.id}
            ref={(el) => {
              videoRef.current = el;
              if (el) el.muted = true;
            }}
            src={slide.src}
            muted
            autoPlay
            loop
            playsInline
            className="absolute inset-0 size-full object-cover"
            onLoadedData={tryPlay}
            onPlaying={() => setNeedsTap(false)}
          />
        ) : (
          <Image src={slide.src} alt="" fill priority className="object-cover" sizes="100vw" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/35 to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-5 py-16 md:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-secondary">{slide.kicker}</p>
          <h1 className="mt-3 max-w-xl font-serif text-4xl text-background text-balance sm:text-5xl lg:text-6xl">
            {slide.title}
          </h1>
          <div className="mt-8">
            <Button asChild size="lg" variant="gold">
              <Link href={slide.href}>{slide.cta}</Link>
            </Button>
          </div>
        </div>
        {needsTap ? (
          <button
            type="button"
            aria-label="Play video"
            onClick={tryPlay}
            className="absolute inset-0 z-20 flex items-center justify-center bg-foreground/20"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-background">
              <Play className="ml-1 size-7 fill-current" />
            </span>
          </button>
        ) : null}
        <button
          type="button"
          aria-label="Previous"
          onClick={() => go(-1)}
          className="absolute top-1/2 left-3 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/85"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => go(1)}
          className="absolute top-1/2 right-3 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/85"
        >
          <ChevronRight className="size-4" />
        </button>
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn("h-1.5 rounded-full transition-all", i === index ? "w-8 bg-secondary" : "w-2.5 bg-background/60")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
