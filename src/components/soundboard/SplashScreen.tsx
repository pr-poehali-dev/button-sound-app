import Icon from '@/components/ui/icon';
import { DOG_AVATAR } from './sounds';

type Props = {
  state: 'visible' | 'leaving' | 'gone';
  onDismiss: () => void;
};

const SplashScreen = ({ state, onDismiss }: Props) => {
  if (state === 'gone') return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden ${state === 'leaving' ? 'splash-down' : ''}`}
      style={{
        background: 'radial-gradient(circle at 50% 30%, #2a1247 0%, #0d0817 70%)',
      }}
    >
      {/* Decorative animated blobs */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, #ff2d78, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, #00d4ff, transparent 70%)' }}
      />

      {/* Avatar */}
      <div className="avatar-pop mb-8 relative">
        <div className="absolute inset-0 rounded-full rainbow-bg blur-md opacity-70 scale-110" />
        <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white/90 shadow-2xl">
          <img src={DOG_AVATAR} alt="Песик" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Rising text from "floor" */}
      <div className="overflow-hidden px-6 mb-10">
        <h2
          className="text-rise text-3xl md:text-5xl font-black text-center leading-tight"
          style={{
            fontFamily: 'Rubik Mono One, sans-serif',
            background: 'linear-gradient(90deg, #ff1744, #ffe500, #39ff14, #00d4ff, #bf5fff, #ff2d78)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            animation: 'text-rise 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, rainbow-shift 4s linear infinite',
          }}
        >
          Хочешь поматериться?
        </h2>
      </div>

      {/* Big rainbow PLAY button */}
      <button
        onClick={onDismiss}
        className="rainbow-glow rainbow-bg relative flex items-center gap-4 px-10 py-5 md:px-14 md:py-6 rounded-full text-white font-black text-xl md:text-2xl uppercase tracking-wider border-4 border-white/80 active:scale-95 transition-transform"
        style={{ fontFamily: 'Rubik, sans-serif' }}
      >
        <span className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/95 shadow-inner">
          <Icon name="Play" size={22} className="text-black ml-0.5" fallback="CircleAlert" />
        </span>
        <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          Поматериться
        </span>
      </button>

      <p className="mt-8 text-white/60 text-sm uppercase tracking-widest">жми и поехали</p>

      {/* Floor "shadow" */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}
      />
    </div>
  );
};

export default SplashScreen;
