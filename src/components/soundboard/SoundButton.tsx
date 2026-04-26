import { DOG_IMAGE, type SoundDef } from './sounds';

type Props = {
  sound: SoundDef;
  idx: number;
  count: number;
  isPlaying: boolean;
  isPopped: boolean;
  onPlay: (sound: SoundDef) => void;
};

const SoundButton = ({ sound, idx, count, isPlaying, isPopped, onPlay }: Props) => {
  return (
    <div
      className="flex flex-col items-center gap-3 animate-slide-up"
      style={{ animationDelay: `${idx * 60}ms` }}
    >
      <button
        onClick={() => onPlay(sound)}
        className={`sound-btn group relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden transition-all duration-300 hover:-translate-y-1 active:scale-95 ${isPlaying ? 'playing ' + sound.glow : ''}`}
        style={{
          background: `radial-gradient(circle at 30% 25%, ${sound.accent}, ${sound.accent}99 55%, ${sound.accent}55 100%)`,
          boxShadow: isPlaying
            ? undefined
            : `0 14px 30px ${sound.accent}55, inset 0 -8px 20px rgba(0,0,0,0.25), inset 0 8px 20px rgba(255,255,255,0.25)`,
        }}
      >
        <img
          src={DOG_IMAGE}
          alt={sound.name}
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay transition-transform duration-500 group-hover:scale-110"
        />
        {/* Glossy highlight */}
        <span
          className="absolute top-2 left-1/2 -translate-x-1/2 w-3/4 h-1/3 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.55), transparent 70%)' }}
        />
        {/* Inner ring */}
        <span className="absolute inset-2 rounded-full ring-2 ring-white/30 pointer-events-none" />

        {/* Big emoji */}
        <div
          className={`absolute inset-0 flex items-center justify-center text-6xl md:text-7xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] ${isPlaying ? 'animate-float' : ''}`}
        >
          {sound.emoji}
        </div>

        {/* Counter badge */}
        <div className="absolute -top-1 -right-1 min-w-[28px] h-7 px-2 rounded-full bg-black/80 backdrop-blur-sm border border-white/20 text-xs font-black flex items-center justify-center text-white shadow-lg">
          <span className={isPopped ? 'count-pop inline-block' : ''}>{count}</span>
        </div>

        {isPlaying && (
          <span
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              animation: 'ripple 0.6s ease-out',
              border: `4px solid ${sound.accent}`,
            }}
          />
        )}
      </button>
      <div
        className="text-center font-bold text-sm md:text-base max-w-[10rem] leading-tight"
        style={{ color: sound.accent }}
      >
        {sound.name}
      </div>
    </div>
  );
};

export default SoundButton;
