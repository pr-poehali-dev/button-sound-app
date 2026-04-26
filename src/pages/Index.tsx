import { useState, useRef, useEffect } from 'react';
import SplashScreen from '@/components/soundboard/SplashScreen';
import SoundButton from '@/components/soundboard/SoundButton';
import StatsPanel from '@/components/soundboard/StatsPanel';
import { SOUNDS, STORAGE_KEY, type SoundDef } from '@/components/soundboard/sounds';

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
  const [splashState, setSplashState] = useState<'visible' | 'leaving' | 'gone'>('visible');
  const ctxRef = useRef<AudioContext | null>(null);

  const dismissSplash = () => {
    setSplashState('leaving');
    setTimeout(() => setSplashState('gone'), 900);
  };

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
      <SplashScreen state={splashState} onDismiss={dismissSplash} />

      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #bf5fff, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #00d4ff, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #ff2d78, transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-10 md:py-16">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 animate-slide-up">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold mb-4 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Live Soundboard
            </div>
            <h1
              className="text-5xl md:text-7xl font-black leading-none tracking-tight"
              style={{ fontFamily: 'Rubik Mono One, sans-serif' }}
            >
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #bf5fff, #ff2d78, #ffe500)' }}
              >
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
          {SOUNDS.map((sound, idx) => (
            <SoundButton
              key={sound.id}
              sound={sound}
              idx={idx}
              count={stats[sound.id] || 0}
              isPlaying={playingId === sound.id}
              isPopped={poppedId === sound.id}
              onPlay={handlePlay}
            />
          ))}
        </section>

        {/* Ranking + Stats */}
        <StatsPanel
          ranking={ranking}
          maxCount={maxCount}
          totalPlays={totalPlays}
          stats={stats}
          onReset={resetStats}
        />

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          Сделано с любовью к пёсику в веночке 🌼
        </footer>
      </div>
    </div>
  );
};

export default Index;
