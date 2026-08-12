/** Small Web Audio engine: varied happy / sad jingles so the child never gets bored. */

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function note(c: AudioContext, freq: number, start: number, dur: number, type: OscillatorType, gain = 0.16) {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, c.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, c.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  osc.connect(g).connect(c.destination);
  osc.start(c.currentTime + start);
  osc.stop(c.currentTime + start + dur + 0.05);
}

const HAPPY: number[][] = [
  [523, 659, 784, 1047],
  [659, 784, 988],
  [587, 740, 880, 1175],
  [784, 988, 1319],
  [523, 622, 784, 1047, 1319],
  [440, 554, 659, 880],
];

const SAD: number[][] = [
  [392, 349, 294],
  [440, 392, 330],
  [330, 294, 247],
  [370, 311, 262],
];

export function playCorrect(seed = Math.floor(Math.random() * 999)) {
  const c = audio();
  if (!c) return;
  const melody = HAPPY[Math.abs(seed) % HAPPY.length]!;
  melody.forEach((f, i) => note(c, f, i * 0.1, 0.28, "triangle"));
}

export function playWrong(seed = Math.floor(Math.random() * 999)) {
  const c = audio();
  if (!c) return;
  const melody = SAD[Math.abs(seed) % SAD.length]!;
  melody.forEach((f, i) => note(c, f, i * 0.14, 0.3, "sawtooth", 0.1));
}

export function playTap() {
  const c = audio();
  if (!c) return;
  note(c, 660, 0, 0.08, "sine", 0.08);
}

export function playFinish() {
  const c = audio();
  if (!c) return;
  [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => note(c, f, i * 0.09, 0.4, "triangle"));
}
