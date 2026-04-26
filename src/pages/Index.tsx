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
    name: 'Цензура: БИП',
    emoji: '🔇',
    glow: 'glow-red',
    accent: '#ff1744',
    play: (ctx) => playBeep(ctx, 1000, 0.6, 'sine', 0.3),
  },
  {
    id: 'censor-honk',
    name: 'Цензура: гудок',
    emoji: '📯',
    glow: 'glow-yellow',
    accent: '#ffe500',
    play: (ctx) => {
      playBeep(ctx, 440, 0.4, 'square', 0.25);
      setTimeout(() => playBeep(ctx, 380, 0.4, 'square', 0.25), 150);
    },
  },
  {
    id: 'censor-squeak',
    name: 'Цензура: писк',
    emoji: '🐭',
    glow: 'glow-pink',
    accent: '#ff2d78',
    play: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
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
    id: 'success',
    name: 'Успех',
    emoji: '✨',
    glow: 'glow-cyan',
    accent: '#00d4ff',
    play: (ctx) => {
      [523, 659, 784, 1047].forEach((f, i) => {
        setTimeout(() => playBeep(ctx, f, 0.15, 'sine', 0.2), i * 80);
      });
    },
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
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
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

        {/* Sound buttons grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-16">
          {SOUNDS.map((sound, idx) => {
            const count = stats[sound.id] || 0;
            const isPlaying = playingId === sound.id;
            const isPopped = poppedId === sound.id;
            return (
              <button
                key={sound.id}
                onClick={() => handlePlay(sound)}
                className={`sound-btn group relative aspect-square rounded-3xl overflow-hidden border-2 transition-all duration-300 hover:-translate-y-1 active:scale-95 animate-slide-up ${isPlaying ? 'playing ' + sound.glow : ''}`}
                style={{
                  borderColor: sound.accent + '60',
                  animationDelay: `${idx * 60}ms`,
                  boxShadow: isPlaying ? undefined : `0 8px 32px ${sound.accent}25`,
                }}
              >
                <img
                  src={DOG_IMAGE}
                  alt={sound.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 mix-blend-multiply transition-opacity duration-300 opacity-70 group-hover:opacity-50"
                  style={{ background: `linear-gradient(180deg, transparent 30%, ${sound.accent}90 100%)` }}
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl" />

                {/* Top-right counter */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-xs font-bold flex items-center gap-1">
                  <Icon name="Play" size={10} />
                  <span className={isPopped ? 'count-pop inline-block' : ''}>{count}</span>
                </div>

                {/* Big emoji */}
                <div className={`absolute top-4 left-4 text-4xl drop-shadow-lg ${isPlaying ? 'animate-float' : ''}`}>
                  {sound.emoji}
                </div>

                {/* Bottom label */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                  <div className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: sound.accent }}>
                    Track {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="text-white font-black text-lg leading-tight drop-shadow-md">
                    {sound.name}
                  </div>
                </div>

                {isPlaying && (
                  <span
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{
                      animation: 'ripple 0.6s ease-out',
                      border: `3px solid ${sound.accent}`,
                    }}
                  />
                )}
              </button>
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
