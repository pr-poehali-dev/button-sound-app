export const DOG_IMAGE = 'https://cdn.poehali.dev/projects/992f73ca-449c-4310-a18d-9b2cb00c5fc9/bucket/1efaf031-29cc-4221-9879-11469d6535f5.jpg';
export const DOG_AVATAR = 'https://cdn.poehali.dev/projects/992f73ca-449c-4310-a18d-9b2cb00c5fc9/bucket/de7a2082-20ac-4553-b9ae-710a5a9ee600.jpg';

export const STORAGE_KEY = 'soundboard-stats-v1';

export type SoundDef = {
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

export const SOUNDS: SoundDef[] = [
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
    name: 'Цензура (ролик)',
    emoji: '🥜',
    glow: 'glow-orange',
    accent: '#ff6b00',
    play: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 0.005);
      gain.gain.setValueAtTime(0.32, ctx.currentTime + 0.22);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.26);
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
      const osc3 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc3.type = 'triangle';
      osc1.frequency.value = 75;
      osc2.frequency.value = 92;
      osc3.frequency.value = 110;
      filter.type = 'lowpass';
      filter.frequency.value = 600;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.32, ctx.currentTime + 1.6);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2);
      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start();
      osc3.start();
      osc1.stop(ctx.currentTime + 2.2);
      osc2.stop(ctx.currentTime + 2.2);
      osc3.stop(ctx.currentTime + 2.2);
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
    id: 'censor-high',
    name: 'Высокий писк',
    emoji: '📡',
    glow: 'glow-cyan',
    accent: '#00e5ff',
    play: (ctx) => playBeep(ctx, 1500, 0.9, 'sine', 0.28),
  },
];
