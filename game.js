const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = 256;
const HEIGHT = 192;

// ZX Spectrum Színpaletta
const PAL = {
  K: "#000000",
  W: "#ffffff",
  R: "#d80000",
  C: "#00d8d8",
  M: "#d800d8",
  G: "#00d800",
  Y: "#d8d800",
  B: "#0000d8"
};

// Mátrix kirajzolás opcionális színcserével (pl. üzemanyag miatti lila átszínezéshez)
function drawMatrix(mat, sx, sy, flipX = false, colorOverride = null) {
  const h = mat.length;
  const w = mat[0].length;
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const col = flipX ? (w - 1 - c) : c;
      let char = mat[r][col];
      if (char !== ".") {
        if (colorOverride && colorOverride[char]) {
          char = colorOverride[char];
        }
        if (PAL[char]) {
          ctx.fillStyle = PAL[char];
          ctx.fillRect(Math.floor(sx) + c, Math.floor(sy) + r, 1, 1);
        }
      }
    }
  }
}

// --- Autentikus Sprite-ok ---
const SPRITE_JETMAN_STAND = [
  ".....WWWWWW.....", "....WWWWWWWW....", "...WWKKWWWWWW...", "...WWKKWWWWWW...",
  "....WWWWWWWW....", ".....WWWWWW.....", "..WWWWWWWWWWWW..", "..WWWWWWWWWWWW..",
  "..WWWWWWWWWWWW..", "..WWWWWWWWWWWW..", "......WWWWWW....", "......WWWWWW....",
  "......WW..WW....", "......WW..WW....", ".....WWW..WWW...", "....WWWW..WWWW.."
];

const SPRITE_JETMAN_WALK = [
  ".....WWWWWW.....", "....WWWWWWWW....", "...WWKKWWWWWW...", "...WWKKWWWWWW...",
  "....WWWWWWWW....", ".....WWWWWW.....", "..WWWWWWWWWWWW..", "..WWWWWWWWWWWW..",
  "..WWWWWWWWWWWW..", "..WWWWWWWWWWWW..", "......WWWWWW....", "......WWWWWW....",
  ".....WWW..WWW...", "....WWW....WWW..", "...WWW......WWW.", "..WWWW......WWWW"
];

const SPRITE_JETMAN_FLY = [
  ".....WWWWWW.....", "....WWWWWWWW....", "...WWKKWWWWWW...", "...WWKKWWWWWW...",
  "....WWWWWWWW....", ".....WWWWWW.....", "..WWWWWWWWWWWW..", "..WWWWWWWWWWWW..",
  "..WWWWWWWWWWWW..", "..WWWWWWWWWWWW..", "......WWWWWW....", "....WWWWWWWW....",
  "...WWWWWWWW.....", "....WWWW........", "................", "................"
];

const SPRITE_ROCKET_TOP = [
  ".......WW.......", "......WWWW......", ".....WWKKWW.....", "....WWKKKKWW....",
  "....WWKKKKWW....", "...WWWWKKWWWW...", "..WWWWWWWWWWWW..", "..WWKKKKKKKKWW..",
  "..WWKKKKKKKKWW..", "..WWWWWWWWWWWW..", "..WWWWWWWWWWWW..", "..WWKKWWWWKKWW..",
  "..WWKKWWWWKKWW..", "..WWWWWWWWWWWW..", "..WWWWWWWWWWWW..", "..WWWWWWWWWWWW.."
];

const SPRITE_ROCKET_MID = [
  "..WWWWWWWWWWWW..", "..WWWWWWWWWWWW..", "..WWKKKKKKKKWW..", "..WWKWWWWWWKWW..",
  "..WWKWWWWWWKWW..", "..WWKKKKKKKKWW..", "..WWWWWWWWWWWW..", "..WWWWWWWWWWWW..",
  "..WWKKKKKKKKWW..", "..WWKWWWWWWKWW..", "..WWKWWWWWWKWW..", "..WWKKKKKKKKWW..",
  "..WWWWWWWWWWWW..", "..WWWWWWWWWWWW..", "..WWWWWWWWWWWW..", "..WWWWWWWWWWWW.."
];

const SPRITE_ROCKET_BASE = [
  "..WWWWWWWWWWWW..", "..WWWWWWWWWWWW..", "..WWKKKKKKKKWW..", "..WWKKKKKKKKWW..",
  "..WWWWWWWWWWWW..", "..WWWWWWWWWWWW..", ".WWWWWWWWWWWWWW.", "WWWWWWWWWWWWWWWW",
  "WW.WWKKKKKKWW.WW", "WW.WWKKKKKKWW.WW", "WW.WWWWWWWWWW.WW", "WW..WWWWWWWW..WW",
  "WW...WW..WW...WW", "WW...WW..WW...WW", "WW............WW", "WW............WW"
];

const SPRITE_ALIEN = [
  "....XXXXXX....", "..XXXXXXXXXX..", ".XXXXXXXXXXXX.", ".XXXXXXXXXXXX.",
  "XXXXXXXXXXXXXX", "XXXXXXXXXXXXXX", "XXXXXXXXXXXXXX", "XXXXXXXXXXXXXX",
  ".XXXXXXXXXXXX.", ".XXXXXXXXXXXX.", "..XXXXXXXXXX..", "....XXXXXX...."
];

const SPRITE_FUEL = [
  "....MMMM....", "...MMWWMM...", "..MMWWWWMM..", "..MMWWWWMM..",
  "..MMMMMMMM..", "..MMKKKKMM..", "..MMWWWWMM..", "..MMWWWWMM..",
  "...MMWWMM...", "....MMMM...."
];

const SPRITE_LIFE_ICON = [
  ".WW.", "WWWW", ".WW.", "WWWW", ".WW.", "W..W"
];

// --- Hanggenerálás ---
let audioCtx = null;
function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playTone(freq1, freq2, type, dur, vol = 0.15) {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq1, audioCtx.currentTime);
    if (freq2) osc.frequency.exponentialRampToValueAtTime(freq2, audioCtx.currentTime + dur);
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
  } catch (e) {}
}

const playLaser = () => playTone(950, 120, "sawtooth", 0.16, 0.12);
const playExplosion = () => playTone(130, 25, "square", 0.3, 0.2);
const playPickup = () => playTone(350, 700, "triangle", 0.1, 0.15);
const playSnap = () => playTone(180, 750, "square", 0.25, 0.18);
const playFuelFill = () => playTone(300, 800, "sine", 0.35, 0.22);

function requestFullScreen() {
  const el = document.documentElement;
  const rfs = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
  if (rfs && !document.fullscreenElement && !document.webkitFullscreenElement) {
    rfs.call(el).catch(() => {});
  }
}

// Pályaelemek
const platforms = [
  { x: 16, y: 76, w: 54, h: 10 },
  { x: 104, y: 112, w: 46, h: 10 },
  { x: 180, y: 58, w: 54, h: 10 }
];
const GROUND_Y = 172;

let gameState = "PLAYING";
let score = 0;
let hiScore = 10000;
let lives = 4;

// Kimért, autentikus fizika
const player = {
  x: 50,
  y: 130,
  w: 16,
  h: 16,
  vx: 0,
  vy: 0,
  facing: 1,
  onGround: false,
  carrying: null,
  invulnerable: 80,
  animTimer: 0,
  animFrame: 0
};

const ROCKET_X = 186;
const ROCKET_BASE_Y = 156;
let rocketStage = 1;

// 1. pályán 3 üzemanyag kell a teljes feltöltéshez
const REQUIRED_FUEL = 3;
let fuelCount = 0;
let rocketY = ROCKET_BASE_Y;
let liftoffSpeed = 0.05;
let liftoffTimer = 0;

let currentPiece = {
  type: "mid",
  sprite: SPRITE_ROCKET_MID,
  x: 34,
  y: 60,
  targetY: 140,
  state: "waiting"
};

let fuelPod = null;
let fuelTimer = 120;

// Lassabb ellenségek
let enemies = [
  { x: 20, y: 35, vx: 0.35, vy: 0.28, color: "R" },
  { x: 230, y: 45, vx: -0.32, vy: 0.32, color: "C" },
  { x: 15, y: 130, vx: 0.38, vy: -0.25, color: "G" },
  { x: 220, y: 120, vx: -0.35, vy: -0.28, color: "R" }
];

let activeLaser = null;
let fireCooldown = 0;
let explosions = [];

const input = { left: false, right: false, thrust: false, fire: false };

// --- ANALÓG JOYSTICK KEZELÉS ---
const joystickZone = document.getElementById("joystick-zone");
const joystickBase = document.getElementById("joystick-base");
const joystickKnob = document.getElementById("joystick-knob");
let joystickTouchId = null;
const JOYSTICK_MAX_DIST = 36;

function handleJoystickMove(touchX, touchY) {
  const rect = joystickBase.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  let dx = touchX - centerX;
  let dy = touchY - centerY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > JOYSTICK_MAX_DIST) {
    dx = (dx / dist) * JOYSTICK_MAX_DIST;
    dy = (dy / dist) * JOYSTICK_MAX_DIST;
  }

  joystickKnob.style.transform = `translate(${dx}px, ${dy}px)`;

  input.left = dx < -14;
  input.right = dx > 14;
  input.thrust = dy < -16;
}

function resetJoystick() {
  joystickTouchId = null;
  joystickKnob.style.transform = "translate(0px, 0px)";
  input.left = false;
  input.right = false;
  input.thrust = false;
}

joystickZone.addEventListener("touchstart", (e) => {
  e.preventDefault();
  initAudio();
  requestFullScreen();
  if (joystickTouchId === null) {
    const touch = e.changedTouches[0];
    joystickTouchId = touch.identifier;
    handleJoystickMove(touch.clientX, touch.clientY);
  }
}, { passive: false });

window.addEventListener("touchmove", (e) => {
  if (joystickTouchId !== null) {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === joystickTouchId) {
        handleJoystickMove(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
        break;
      }
    }
  }
}, { passive: false });

window.addEventListener("touchend", (e) => {
  if (joystickTouchId !== null) {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === joystickTouchId) {
        resetJoystick();
        break;
      }
    }
  }
});

window.addEventListener("touchcancel", (e) => {
  if (joystickTouchId !== null) resetJoystick();
});

// Egér támogatás Desktophoz
let isMouseDown = false;
joystickBase.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  initAudio();
  handleJoystickMove(e.clientX, e.clientY);
});
window.addEventListener("mousemove", (e) => {
  if (isMouseDown) handleJoystickMove(e.clientX, e.clientY);
});
window.addEventListener("mouseup", () => {
  if (isMouseDown) {
    isMouseDown = false;
    resetJoystick();
  }
});

// --- TŰZGOMB ---
const fireButton = document.getElementById("fire-button");
function triggerFire(press) {
  if (press) {
    initAudio();
    requestFullScreen();
    if (gameState === "GAME_OVER") {
      resetGame();
      return;
    }
    input.fire = true;
    fireButton.classList.add("active");
  } else {
    input.fire = false;
    fireButton.classList.remove("active");
  }
}

fireButton.addEventListener("touchstart", (e) => { e.preventDefault(); triggerFire(true); }, { passive: false });
fireButton.addEventListener("touchend", (e) => { e.preventDefault(); triggerFire(false); }, { passive: false });
fireButton.addEventListener("mousedown", () => triggerFire(true));
fireButton.addEventListener("mouseup", () => triggerFire(false));

// Billentyűzet kezelés
window.addEventListener("keydown", (e) => {
  initAudio();
  if (gameState === "GAME_OVER" && (e.code === "Space" || e.code === "KeyW")) {
    resetGame();
    return;
  }
  if (e.code === "ArrowLeft" || e.code === "KeyA") input.left = true;
  if (e.code === "ArrowRight" || e.code === "KeyD") input.right = true;
  if (e.code === "ArrowUp" || e.code === "KeyW") input.thrust = true;
  if (e.code === "Space") input.fire = true;
});

window.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") input.left = false;
  if (e.code === "ArrowRight" || e.code === "KeyD") input.right = false;
  if (e.code === "ArrowUp" || e.code === "KeyW") input.thrust = false;
  if (e.code === "Space") input.fire = false;
});

function resetGame() {
  lives = 4;
  score = 0;
  rocketStage = 1;
  fuelCount = 0;
  rocketY = ROCKET_BASE_Y;
  liftoffSpeed = 0.05;
  liftoffTimer = 0;
  fuelPod = null;
  currentPiece = {
    type: "mid",
    sprite: SPRITE_ROCKET_MID,
    x: 34,
    y: 60,
    targetY: 140,
    state: "waiting"
  };
  player.x = 50;
  player.y = 130;
  player.vx = 0;
  player.vy = 0;
  player.carrying = null;
  player.invulnerable = 100;
  gameState = "PLAYING";
}

function killPlayer() {
  if (player.invulnerable > 0 || gameState !== "PLAYING") return;
  lives--;
  playExplosion();
  explosions.push({ x: player.x, y: player.y, life: 25 });

  if (lives < 0) {
    lives = 0;
    gameState = "GAME_OVER";
    return;
  }

  player.x = 50;
  player.y = 130;
  player.vx = 0;
  player.vy = 0;
  player.invulnerable = 120;

  if (player.carrying) {
    player.carrying.state = "waiting";
    player.carrying = null;
  }
}

// --- FŐ JÁTÉKLOGIKA ---
function update() {
  if (gameState === "GAME_OVER") return;
  if (player.invulnerable > 0) player.invulnerable--;

  // 1. Játékos Fizika (Lassabb mozgás, tehetetlenség)
  if (gameState === "PLAYING") {
    if (input.left) {
      player.vx = Math.max(player.vx - 0.08, -0.65);
      player.facing = -1;
      player.animTimer++;
      if (player.animTimer % 10 === 0) player.animFrame = 1 - player.animFrame;
    } else if (input.right) {
      player.vx = Math.min(player.vx + 0.08, 0.65);
      player.facing = 1;
      player.animTimer++;
      if (player.animTimer % 10 === 0) player.animFrame = 1 - player.animFrame;
    } else {
      player.vx *= 0.85;
      if (Math.abs(player.vx) < 0.03) player.vx = 0;
      player.animFrame = 0;
    }

    if (input.thrust) {
      player.vy = Math.max(player.vy - 0.09, -1.1);
    }
    player.vy += 0.038;
    player.vy *= 0.985;
    if (player.vy > 1.2) player.vy = 1.2;

    player.x += player.vx;
    player.y += player.vy;

    if (player.x < -16) player.x = WIDTH;
    if (player.x > WIDTH) player.x = -16;

    player.onGround = false;

    if (player.y + 16 >= GROUND_Y) {
      player.y = GROUND_Y - 16;
      player.vy = 0;
      player.onGround = true;
    }

    for (let p of platforms) {
      if (
        player.x + 12 > p.x &&
        player.x + 4 < p.x + p.w &&
        player.y + 16 >= p.y &&
        player.y + 16 <= p.y + p.h + player.vy &&
        player.vy >= 0
      ) {
        player.y = p.y - 16;
        player.vy = 0;
        player.onGround = true;
      }
      if (
        player.x + 12 > p.x &&
        player.x + 4 < p.x + p.w &&
        player.y <= p.y + p.h &&
        player.y >= p.y + p.h + player.vy - 3 &&
        player.vy < 0
      ) {
        player.y = p.y + p.h;
        player.vy = 0.15;
      }
    }

    if (player.y < 0) { player.y = 0; player.vy = 0; }
  }

  // 2. Rakéta darabok finom ereszkedése
  if (currentPiece && currentPiece.state !== "placed") {
    if (currentPiece.state === "waiting" && !player.carrying) {
      if (Math.abs(player.x - currentPiece.x) < 14 && Math.abs(player.y - currentPiece.y) < 14) {
        currentPiece.state = "carried";
        player.carrying = currentPiece;
        playPickup();
      }
    }
    if (currentPiece.state === "carried") {
      currentPiece.x = player.facing === 1 ? player.x + 12 : player.x - 12;
      currentPiece.y = player.y + 2;

      if (Math.abs(currentPiece.x - ROCKET_X) < 8 && player.y < currentPiece.targetY - 14) {
        currentPiece.state = "falling";
        currentPiece.x = ROCKET_X;
        player.carrying = null;
      }
    }
    if (currentPiece.state === "falling") {
      // Ereszkedés lassú, állandó tempóval zuhanás helyett
      currentPiece.y += 0.38;
      if (currentPiece.y >= currentPiece.targetY) {
        currentPiece.y = currentPiece.targetY;
        currentPiece.state = "placed";
        rocketStage++;
        score += 250;
        playSnap();

        if (rocketStage === 2) {
          currentPiece = {
            type: "top",
            sprite: SPRITE_ROCKET_TOP,
            x: 196,
            y: 42,
            targetY: 124,
            state: "waiting"
          };
        } else if (rocketStage === 3) {
          currentPiece = null;
        }
      }
    }
  }

  // 3. Üzemanyag (Lassú hullás, 3 darab az 1. szinten)
  if (rocketStage === 3 && fuelCount < REQUIRED_FUEL) {
    if (!fuelPod) {
      fuelTimer--;
      if (fuelTimer <= 0) {
        fuelPod = { x: 20 + Math.random() * 200, y: -10, vy: 0.28, state: "falling" };
        fuelTimer = 160;
      }
    } else {
      if (fuelPod.state === "falling") {
        fuelPod.y += fuelPod.vy;
        if (fuelPod.y >= GROUND_Y - 10) {
          fuelPod.y = GROUND_Y - 10;
          fuelPod.state = "waiting";
        }
        for (let p of platforms) {
          if (fuelPod.x + 8 > p.x && fuelPod.x < p.x + p.w && fuelPod.y + 10 >= p.y && fuelPod.y <= p.y + 4) {
            fuelPod.y = p.y - 10;
            fuelPod.state = "waiting";
          }
        }
      }

      if (fuelPod.state === "waiting" && !player.carrying) {
        if (Math.abs(player.x - fuelPod.x) < 14 && Math.abs(player.y - fuelPod.y) < 14) {
          fuelPod.state = "carried";
          player.carrying = fuelPod;
          playPickup();
        }
      }

      if (fuelPod.state === "carried") {
        fuelPod.x = player.facing === 1 ? player.x + 12 : player.x - 8;
        fuelPod.y = player.y + 3;

        if (Math.abs(fuelPod.x - ROCKET_X) < 10 && player.y < 120) {
          fuelPod.state = "dropped";
          fuelPod.x = ROCKET_X + 4;
          player.carrying = null;
        }
      }

      if (fuelPod.state === "dropped") {
        fuelPod.y += 0.4;
        if (fuelPod.y >= 148) {
          fuelCount++;
          score += 250;
          playFuelFill();
          fuelPod = null;
        }
      }
    }
  }

  // 4. Beszállás és Lassú Felszállás
  if (rocketStage === 3 && fuelCount >= REQUIRED_FUEL) {
    if (gameState === "PLAYING") {
      if (Math.abs(player.x - ROCKET_X) < 12 && player.y > 120) {
        gameState = "LIFTOFF";
        score += 1000;
        liftoffSpeed = 0.04;
        liftoffTimer = 0;
        playTone(90, 650, "sawtooth", 3.0, 0.28);
      }
    } else if (gameState === "LIFTOFF") {
      liftoffTimer++;
      // Indítási remegés az első másodpercben
      let shakeOffset = 0;
      if (liftoffTimer < 50) {
        shakeOffset = (Math.random() - 0.5) * 1.2;
      } else {
        // Lassú, folyamatosan gyorsuló emelkedés
        liftoffSpeed += 0.005;
        rocketY -= liftoffSpeed;
      }

      if (rocketY < -60) {
        rocketStage = 1;
        fuelCount = 0;
        rocketY = ROCKET_BASE_Y;
        player.x = 50;
        player.y = 130;
        gameState = "PLAYING";
        currentPiece = {
          type: "mid",
          sprite: SPRITE_ROCKET_MID,
          x: 34,
          y: 60,
          targetY: 140,
          state: "waiting"
        };
      }
    }
  }

  // 5. Lézer fegyver
  if (fireCooldown > 0) fireCooldown--;
  if (input.fire && fireCooldown === 0 && gameState === "PLAYING") {
    playLaser();
    const beamLen = 120;
    const startX = player.facing === 1 ? player.x + 16 : player.x - beamLen;
    activeLaser = { x: startX, y: player.y + 7, w: beamLen, life: 10 };
    fireCooldown = 18;
  }
  if (activeLaser) {
    activeLaser.life--;
    if (activeLaser.life <= 0) activeLaser = null;
  }

  // 6. Ellenségek mozgása
  for (let e of enemies) {
    e.x += e.vx;
    e.y += e.vy;

    if (e.x < -14) e.x = WIDTH;
    if (e.x > WIDTH) e.x = -14;
    if (e.y < 24 || e.y > GROUND_Y - 14) e.vy *= -1;

    for (let p of platforms) {
      if (e.x + 12 > p.x && e.x < p.x + p.w && e.y + 12 > p.y && e.y < p.y + p.h) {
        e.vy *= -1;
      }
    }

    if (activeLaser && gameState === "PLAYING") {
      if (e.x + 12 > activeLaser.x && e.x < activeLaser.x + activeLaser.w && Math.abs(e.y + 6 - activeLaser.y) < 8) {
        score += 25;
        playExplosion();
        explosions.push({ x: e.x, y: e.y, life: 12 });
        e.x = Math.random() > 0.5 ? 0 : WIDTH - 14;
        e.y = 30 + Math.random() * 110;
      }
    }

    if (gameState === "PLAYING" && Math.abs((player.x + 8) - (e.x + 6)) < 10 && Math.abs((player.y + 8) - (e.y + 6)) < 10) {
      killPlayer();
    }
  }

  for (let i = explosions.length - 1; i >= 0; i--) {
    explosions[i].life--;
    if (explosions[i].life <= 0) explosions.splice(i, 1);
  }
}

// --- RENDERELÉS ---
function render() {
  ctx.fillStyle = PAL.K;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Platformok
  ctx.fillStyle = PAL.G;
  for (let p of platforms) {
    ctx.fillRect(p.x, p.y, p.w, 4);
    for (let bx = p.x; bx < p.x + p.w - 3; bx += 4) {
      ctx.fillRect(bx, p.y + 4, 3, 3);
      ctx.fillRect(bx + 1, p.y + 7, 2, 2);
    }
  }

  // Talaj
  ctx.fillStyle = PAL.Y;
  ctx.fillRect(0, GROUND_Y + 4, WIDTH, HEIGHT - GROUND_Y);
  for (let x = 0; x < WIDTH; x += 4) {
    ctx.fillRect(x, GROUND_Y, 3, 4);
    ctx.fillRect(x + 1, GROUND_Y + 4, 2, 2);
    ctx.fillStyle = PAL.K;
    ctx.fillRect(x + 2, GROUND_Y + 8, 1, 2);
    ctx.fillStyle = PAL.Y;
  }

  // --- Rakéta kirajzolása Lila (Magenta) üzemanyagszínezéssel ---
  const rY = rocketY;
  const purpleOverride = { W: "M" };

  // Alap modul: 1 vagy több üzemanyagnál lila
  drawMatrix(SPRITE_ROCKET_BASE, ROCKET_X, rY, false, fuelCount >= 1 ? purpleOverride : null);

  // Középső modul: 2 vagy több üzemanyagnál lila
  if (rocketStage >= 2) {
    drawMatrix(SPRITE_ROCKET_MID, ROCKET_X, rY - 16, false, fuelCount >= 2 ? purpleOverride : null);
  }

  // Orrkúp modul: 3 üzemanyagnál (teljes töltöttség) lila
  if (rocketStage >= 3) {
    drawMatrix(SPRITE_ROCKET_TOP, ROCKET_X, rY - 32, false, fuelCount >= 3 ? purpleOverride : null);
  }

  // Felszállási lángok
  if (gameState === "LIFTOFF") {
    ctx.fillStyle = Math.random() > 0.5 ? PAL.Y : PAL.R;
    ctx.fillRect(ROCKET_X + 4, rY + 16, 8, 14 + Math.random() * 8);
    ctx.fillStyle = PAL.W;
    ctx.fillRect(ROCKET_X + 6, rY + 16, 4, 6);
  }

  // Ereszkedő vagy várakozó rakétaelem
  if (currentPiece && currentPiece.state !== "placed") {
    drawMatrix(currentPiece.sprite, currentPiece.x, currentPiece.y);
  }

  // Hulló üzemanyag
  if (fuelPod) {
    drawMatrix(SPRITE_FUEL, fuelPod.x, fuelPod.y);
  }

  // Ellenségek
  for (let e of enemies) {
    const origChar = "X";
    const h = SPRITE_ALIEN.length;
    const w = SPRITE_ALIEN[0].length;
    ctx.fillStyle = PAL[e.color];
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        if (SPRITE_ALIEN[r][c] === origChar) {
          ctx.fillRect(Math.floor(e.x) + c, Math.floor(e.y) + r, 1, 1);
        }
      }
    }
  }

  // Jetman
  if (gameState === "PLAYING") {
    if (player.invulnerable % 6 < 3) {
      let spr = SPRITE_JETMAN_STAND;
      if (!player.onGround) spr = SPRITE_JETMAN_FLY;
      else if (player.vx !== 0 && player.animFrame === 1) spr = SPRITE_JETMAN_WALK;

      drawMatrix(spr, player.x, player.y, player.facing === -1);

      if (input.thrust) {
        ctx.fillStyle = Math.random() > 0.5 ? PAL.Y : PAL.R;
        const fx = player.facing === 1 ? player.x - 2 : player.x + 14;
        ctx.fillRect(fx, player.y + 10, 3, 4);
      }
    }
  }

  // Lézersugár
  if (activeLaser) {
    ctx.fillStyle = PAL.W;
    ctx.fillRect(activeLaser.x, activeLaser.y, activeLaser.w, 1);
    ctx.fillStyle = PAL.C;
    for (let lx = activeLaser.x; lx < activeLaser.x + activeLaser.w; lx += 4) {
      ctx.fillRect(lx, activeLaser.y + (Math.random() > 0.5 ? 1 : -1), 2, 1);
    }
  }

  // Robbanások
  for (let ex of explosions) {
    ctx.fillStyle = Math.random() > 0.5 ? PAL.Y : PAL.R;
    for (let i = 0; i < 10; i++) {
      ctx.fillRect(ex.x + Math.random() * 16 - 2, ex.y + Math.random() * 16 - 2, 2, 2);
    }
  }

  // HUD
  ctx.font = "8px monospace";
  ctx.fillStyle = PAL.W;
  ctx.fillText("1UP", 24, 12);
  ctx.fillStyle = PAL.Y;
  ctx.fillText(String(score).padStart(6, "0"), 16, 22);

  ctx.fillStyle = PAL.W;
  ctx.fillText(String(lives), 58, 12);
  drawMatrix(SPRITE_LIFE_ICON, 68, 6);

  ctx.fillStyle = PAL.C;
  ctx.fillText("HI", 120, 12);
  ctx.fillStyle = PAL.Y;
  ctx.fillText(String(Math.max(score, hiScore)).padStart(6, "0"), 108, 22);

  ctx.fillStyle = PAL.W;
  ctx.fillText("2UP", 200, 12);
  ctx.fillStyle = PAL.Y;
  ctx.fillText("000000", 192, 22);

  if (rocketStage === 3 && gameState === "PLAYING") {
    ctx.fillStyle = fuelCount >= REQUIRED_FUEL ? PAL.G : PAL.M;
    const msg = fuelCount >= REQUIRED_FUEL ? "BOARD SHIP!" : `FUEL: ${fuelCount}/${REQUIRED_FUEL}`;
    ctx.fillText(msg, 96, 34);
  }

  if (gameState === "GAME_OVER") {
    ctx.fillStyle = PAL.R;
    ctx.font = "12px monospace";
    ctx.fillText("GAME OVER", 92, 90);
    ctx.fillStyle = PAL.Y;
    ctx.font = "8px monospace";
    ctx.fillText("PRESS FIRE TO PLAY", 72, 105);
  }
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);