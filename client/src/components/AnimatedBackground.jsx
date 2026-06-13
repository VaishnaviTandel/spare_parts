export default function AnimatedBackground() {
  return (
    <div className="animated-background fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Base */}
      <div className="animated-background-base absolute inset-0 bg-gradient-to-br from-[#080d17] via-[#0c1322] to-[#080d17]" />

      {/* Floating orbs */}
      <div className="animated-background-orb-a absolute -top-48 -left-48 w-[550px] h-[550px] rounded-full bg-brand-green/10 blur-[110px] animate-float-a" />
      <div className="animated-background-orb-b absolute top-1/3 -right-36 w-[420px] h-[420px] rounded-full bg-blue-600/8 blur-[95px] animate-float-b" />
      <div className="animated-background-orb-c absolute -bottom-24 left-1/3 w-[380px] h-[380px] rounded-full bg-brand-green/7 blur-[85px] animate-float-c" />
      <div className="animated-background-orb-d absolute top-2/3 left-1/2 w-[300px] h-[300px] rounded-full bg-indigo-600/6 blur-[75px] animate-float-d" />

      {/* Subtle dot grid */}
      <div
        className="animated-background-grid absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Top fade */}
      <div className="animated-background-fade absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#080d17] to-transparent" />
    </div>
  )
}
