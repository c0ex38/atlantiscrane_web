export type ProductsHeroProps = {
  title: string;
  description: string;
};

export default function ProductsHero({ title, description }: ProductsHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#111122] pt-32 pb-20 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(253,197,32,0.08),transparent_50%)]" />
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]" />
      
      <div className="container-shell relative z-10 text-center max-w-3xl mx-auto space-y-6">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-[color:var(--cta)] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--cta)] animate-pulse" />
          Atlantis Crane // Marine Lifting Engineering
        </span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase leading-none">
          {title}
        </h1>
        <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
          {description}
        </p>
      </div>
    </section>
  );
}
