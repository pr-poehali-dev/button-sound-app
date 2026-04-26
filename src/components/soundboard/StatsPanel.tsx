import Icon from '@/components/ui/icon';
import { SOUNDS, type SoundDef } from './sounds';

type RankedItem = SoundDef & { count: number };

type Props = {
  ranking: RankedItem[];
  maxCount: number;
  totalPlays: number;
  stats: Record<string, number>;
  onReset: () => void;
};

const StatsPanel = ({ ranking, maxCount, totalPlays, stats, onReset }: Props) => {
  return (
    <section className="grid lg:grid-cols-2 gap-6">
      <div
        className="rounded-3xl border border-border bg-card/60 backdrop-blur p-6 animate-slide-up"
        style={{ animationDelay: '400ms' }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #ffe500, #ff6b00)' }}
            >
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

      <div
        className="rounded-3xl border border-border bg-card/60 backdrop-blur p-6 animate-slide-up"
        style={{ animationDelay: '500ms' }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #bf5fff)' }}
            >
              <Icon name="BarChart3" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black">Статистика</h2>
              <p className="text-xs text-muted-foreground">Сколько ты тут провёл времени</p>
            </div>
          </div>
          <button
            onClick={onReset}
            className="text-xs px-3 py-1.5 rounded-lg border border-border hover:border-destructive hover:text-destructive transition-colors flex items-center gap-1.5"
          >
            <Icon name="RotateCcw" size={12} />
            Сбросить
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div
            className="p-4 rounded-2xl border border-border"
            style={{ background: 'linear-gradient(135deg, rgba(191,95,255,0.1), transparent)' }}
          >
            <div className="text-xs text-muted-foreground mb-1">Всего нажатий</div>
            <div className="text-3xl font-black" style={{ color: '#bf5fff' }}>{totalPlays}</div>
          </div>
          <div
            className="p-4 rounded-2xl border border-border"
            style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.1), transparent)' }}
          >
            <div className="text-xs text-muted-foreground mb-1">Уникальных</div>
            <div className="text-3xl font-black" style={{ color: '#00d4ff' }}>
              {Object.keys(stats).filter((k) => stats[k] > 0).length}
            </div>
          </div>
          <div
            className="p-4 rounded-2xl border border-border"
            style={{ background: 'linear-gradient(135deg, rgba(255,229,0,0.1), transparent)' }}
          >
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
          <div
            className="p-4 rounded-2xl border border-border"
            style={{ background: 'linear-gradient(135deg, rgba(57,255,20,0.1), transparent)' }}
          >
            <div className="text-xs text-muted-foreground mb-1">Среднее на звук</div>
            <div className="text-3xl font-black" style={{ color: '#39ff14' }}>
              {(totalPlays / SOUNDS.length).toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsPanel;
