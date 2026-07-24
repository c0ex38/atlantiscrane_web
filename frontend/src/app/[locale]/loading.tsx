import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070b14]/60 backdrop-blur-md">
      <div className="relative flex items-center justify-center p-2 w-48 h-48 md:w-56 md:h-56">
        {/* Outer glowing spinning ring */}
        <div className="absolute inset-0 rounded-full border border-cta/30 shadow-[0_0_15px_rgba(253,197,32,0.2)]" />
        <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-cta animate-spin" style={{ animationDuration: "1.5s" }} />
        
        {/* Inner reverse spinning ring */}
        <div className="absolute inset-3 rounded-full border-b-2 border-l-2 border-white/20 animate-[spin_3s_linear_infinite_reverse]" />
        
        {/* Center Logo Background */}
        <div className="absolute inset-4 rounded-full bg-[#070b14] shadow-inner" />

        {/* Logo */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <Image
            src="/atlantis-logo.svg"
            alt="Atlantis Crane"
            width={140}
            height={34}
            className="brightness-0 invert opacity-90 object-contain w-[70%] max-w-[140px]"
            priority
          />
        </div>
      </div>
    </div>
  );
}
