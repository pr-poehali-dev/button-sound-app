import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const DOG_IMAGE = 'https://cdn.poehali.dev/projects/992f73ca-449c-4310-a18d-9b2cb00c5fc9/bucket/1efaf031-29cc-4221-9879-11469d6535f5.jpg';

type SoundDef = {
  id: string;
  name: string;
  emoji: string;
  glow: string;
  accent: string;
  play: (ctx: AudioContext) => void;
};

const playBeep = (ctx: AudioContext, freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.25) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
};

const playNoise = (ctx: AudioContext, duration: number, vol = 0.3, filterFreq = 2000) => {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = filterFreq;
  const gain = ctx.createGain();
  gain.gain.value = vol;
  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  src.start();
};

const SOUNDS: SoundDef[] = [
  {
    id: 'censor-beep',
    name: 'TV БИП',
    emoji: '🔇',
    glow: 'glow-red',
    accent: '#ff1744',
    play: (ctx) => playBeep(ctx, 1000, 1.0, 'sine', 0.32),
  },
  {
    id: 'censor-double',
    name: 'Двойной БИП',
    emoji: '🚫',
    glow: 'glow-orange',
    accent: '#ff6b00',
    play: (ctx) => {
      playBeep(ctx, 1200, 0.18, 'sine', 0.3);
      setTimeout(() => playBeep(ctx, 1200, 0.18, 'sine', 0.3), 220);
    },
  },
  {
    id: 'censor-honk',
    name: 'Гудок',
    emoji: '📯',
    glow: 'glow-yellow',
    accent: '#ffe500',
    play: (ctx) => {
      const honk = (start: number, freq: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        osc.frequency.linearRampToValueAtTime(freq * 0.9, ctx.currentTime + start + dur);
        filter.type = 'lowpass';
        filter.frequency.value = 1400;
        gain.gain.setValueAtTime(0, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + start + 0.03);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + start + dur - 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur);
      };
      honk(0, 280, 0.28);
      honk(0.32, 220, 0.42);
    },
  },
  {
    id: 'censor-whistle',
    name: 'Свисток',
    emoji: '🥷',
    glow: 'glow-pink',
    accent: '#ff2d78',
    play: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(3600, ctx.currentTime + 0.2);
      osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.45);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    },
  },
  {
    id: 'nut-crack',
    name: 'Раскол ореха',
    emoji: '🥜',
    glow: 'glow-orange',
    accent: '#ff6b00',
    play: (ctx) => {
      playNoise(ctx, 0.08, 0.5, 800);
      setTimeout(() => playNoise(ctx, 0.15, 0.4, 400), 30);
      setTimeout(() => playBeep(ctx, 120, 0.1, 'square', 0.2), 40);
    },
  },
  {
    id: 'steamboat',
    name: 'Гудок парохода',
    emoji: '🚢',
    glow: 'glow-blue',
    accent: '#2979ff',
    play: (ctx) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc1.frequency.value = 130;
      osc2.frequency.value = 165;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + 1.0);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.4);
      osc2.stop(ctx.currentTime + 1.4);
    },
  },
  {
    id: 'paper-crumple',
    name: 'Смятие бумаги',
    emoji: '📄',
    glow: 'glow-green',
    accent: '#39ff14',
    play: (ctx) => {
      for (let i = 0; i < 6; i++) {
        setTimeout(() => playNoise(ctx, 0.08, 0.18, 3000 + Math.random() * 2000), i * 60 + Math.random() * 40);
      }
    },
  },
  {
    id: 'laser',
    name: 'Лазер',
    emoji: '🔫',
    glow: 'glow-purple',
    accent: '#bf5fff',
    play: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    },
  },
  {
    id: 'censor-high',
    name: 'Высокий писк',
    emoji: '📡',
    glow: 'glow-cyan',
    accent: '#00e5ff',
    play: (ctx) => playBeep(ctx, 1500, 0.9, 'sine', 0.28),
  },
];

const STORAGE_KEY = 'soundboard-stats-v1';

const Index = () => {
  const [stats, setStats] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [poppedId, setPoppedId] = useState<string | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const handlePlay = (sound: SoundDef) => {
    if (!ctxRef.current) {
      const W = window as unknown as { webkitAudioContext: typeof AudioContext };
      ctxRef.current = new (window.AudioContext || W.webkitAudioContext)();
    }
    const ctx = ctxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    sound.play(ctx);
    setPlayingId(sound.id);
    setPoppedId(sound.id);
    setStats((s) => ({ ...s, [sound.id]: (s[sound.id] || 0) + 1 }));
    setTimeout(() => setPlayingId(null), 400);
    setTimeout(() => setPoppedId(null), 300);
  };

  const totalPlays = Object.values(stats).reduce((a, b) => a + b, 0);
  const ranking = [...SOUNDS]
    .map((s) => ({ ...s, count: stats[s.id] || 0 }))
    .sort((a, b) => b.count - a.count);
  const maxCount = Math.max(1, ...ranking.map((r) => r.count));

  const resetStats = () => {
    setStats({});
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl"
           style={{ background: 'radial-gradient(circle, #bf5fff, transparent 70%)' }} />
      <div className="pointer-events-none absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
           style={{ background: 'radial-gradient(circle, #00d4ff, transparent 70%)' }} />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
           style={{ background: 'radial-gradient(circle, #ff2d78, transparent 70%)' }} />

      <div className="relative max-w-7xl mx-auto px-6 py-10 md:py-16">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 animate-slide-up">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold mb-4 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Live Soundboard
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight"
                style={{ fontFamily: 'Rubik Mono One, sans-serif' }}>
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #bf5fff, #ff2d78, #ffe500)' }}>
                ГАВ
              </span>
              <span className="text-foreground">·BOARD</span>
            </h1>
            <p className="text-muted-foreground mt-3 max-w-md">
              Жми на пёсика — получай звук. Топ кнопок копит статистику.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="px-5 py-3 rounded-2xl border border-border bg-card/60 backdrop-blur">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Всего нажатий</div>
              <div className="text-3xl font-black" style={{ color: '#00d4ff' }}>{totalPlays}</div>
            </div>
            <div className="px-5 py-3 rounded-2xl border border-border bg-card/60 backdrop-blur">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Звуков</div>
              <div className="text-3xl font-black" style={{ color: '#bf5fff' }}>{SOUNDS.length}</div>
            </div>
          </div>
        </header>

        {/* Sound buttons grid — round style (Censorship Songs Prank vibe) */}
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 mb-16 place-items-center">
          {SOUNDS.map((sound, idx) => {
            const count = stats[sound.id] || 0;
            const isPlaying = playingId === sound.id;
            const isPopped = poppedId === sound.id;
            return (
              <div key={sound.id} className="flex flex-col items-center gap-3 animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
                <button
                  onClick={() => handlePlay(sound)}
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
                  <div className={`absolute inset-0 flex items-center justify-center text-6xl md:text-7xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] ${isPlaying ? 'animate-float' : ''}`}>
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
                <div className="text-center font-bold text-sm md:text-base max-w-[10rem] leading-tight" style={{ color: sound.accent }}>
                  {sound.name}
                </div>
              </div>
            );
          })}
        </section>

        {/* Ranking + Stats */}
        <section className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-border bg-card/60 backdrop-blur p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ffe500, #ff6b00)' }}>
                  <Icon name="Trophy" size={20} className="text-black" />
                </div>
                <div>
                  <h2 className="text-xl font-black">Топ-рейтинг</h2>
                  <p className="text-xs text-muted-foreground">Самые залипательные звуки</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {ranking.slice(0, 5).map((item, idx) => {
                const pct = (item.count / maxCount) * 100;
                const medals = ['🥇', '🥈', '🥉', '4', '5'];
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-8 text-center text-lg font-black">{medals[idx]}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold flex items-center gap-2">
                          <span>{item.emoji}</span>
                          {item.name}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">{item.count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            background: `linear-gradient(90deg, ${item.accent}, ${item.accent}80)`,
                            boxShadow: `0 0 10px ${item.accent}80`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card/60 backdrop-blur p-6 animate-slide-up" style={{ animationDelay: '500ms' }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4ff, #bf5fff)' }}>
                  <Icon name="BarChart3" size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black">Статистика</h2>
                  <p className="text-xs text-muted-foreground">Сколько ты тут провёл времени</p>
                </div>
              </div>
              <button
                onClick={resetStats}
                className="text-xs px-3 py-1.5 rounded-lg border border-border hover:border-destructive hover:text-destructive transition-colors flex items-center gap-1.5"
              >
                <Icon name="RotateCcw" size={12} />
                Сбросить
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl border border-border" style={{ background: 'linear-gradient(135deg, rgba(191,95,255,0.1), transparent)' }}>
                <div className="text-xs text-muted-foreground mb-1">Всего нажатий</div>
                <div className="text-3xl font-black" style={{ color: '#bf5fff' }}>{totalPlays}</div>
              </div>
              <div className="p-4 rounded-2xl border border-border" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.1), transparent)' }}>
                <div className="text-xs text-muted-foreground mb-1">Уникальных</div>
                <div className="text-3xl font-black" style={{ color: '#00d4ff' }}>
                  {Object.keys(stats).filter((k) => stats[k] > 0).length}
                </div>
              </div>
              <div className="p-4 rounded-2xl border border-border" style={{ background: 'linear-gradient(135deg, rgba(255,229,0,0.1), transparent)' }}>
                <div className="text-xs text-muted-foreground mb-1">Любимый</div>
                <div className="text-2xl font-black flex items-center gap-2">
                  {ranking[0].count > 0 ? (
                    <>
                      <span>{ranking[0].emoji}</span>
                      <span className="text-sm truncate" style={{ color: '#ffe500' }}>{ranking[0].name}</span>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </div>
              </div>
              <div className="p-4 rounded-2xl border border-border" style={{ background: 'linear-gradient(135deg, rgba(57,255,20,0.1), transparent)' }}>
                <div className="text-xs text-muted-foreground mb-1">Среднее на звук</div>
                <div className="text-3xl font-black" style={{ color: '#39ff14' }}>
                  {(totalPlays / SOUNDS.length).toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          Сделано с любовью к пёсику в веночке 🌼
        </footer>
      </div>
    </div>
  );
};

export default Index;