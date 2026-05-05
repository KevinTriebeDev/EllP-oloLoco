const MAX_BOTTLES = 15;
const WORLD_WIDTH = 3600;
const CANVAS_W = 720;
const CANVAS_H = 480;

const ANIM = {
  pepeIdle: range("assets/img/2_character_pepe/1_idle/idle/I-", 1, 10),
  pepeSleep: range("assets/img/2_character_pepe/1_idle/long_idle/I-", 11, 20),
  pepeWalk: range("assets/img/2_character_pepe/2_walk/W-", 21, 26),
  pepeJump: range("assets/img/2_character_pepe/3_jump/J-", 31, 39),
  pepeHurt: range("assets/img/2_character_pepe/4_hurt/H-", 41, 43),
  chickenWalk: range(
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/",
    1,
    3,
    "_w.png",
  ),
  chickWalk: range(
    "assets/img/3_enemies_chicken/chicken_small/1_walk/",
    1,
    3,
    "_w.png",
  ),
  chickenDead: ["assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png"],
  chickDead: ["assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png"],
  bossWalk: range("assets/img/4_enemie_boss_chicken/1_walk/G", 1, 4),
  bossAttack: range("assets/img/4_enemie_boss_chicken/3_attack/G", 13, 20),
  bossHurt: range("assets/img/4_enemie_boss_chicken/4_hurt/G", 21, 23),
  bossDead: range("assets/img/4_enemie_boss_chicken/5_dead/G", 24, 26),
  bottleRot: range(
    "assets/img/6_salsa_bottle/bottle_rotation/",
    1,
    4,
    "_bottle_rotation.png",
  ),
  bottleSplash: range(
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/",
    1,
    6,
    "_bottle_splash.png",
  ),
};

const BG = {
  air: "assets/img/5_background/layers/air.png",
  cloud1: "assets/img/5_background/layers/4_clouds/1.png",
  cloud2: "assets/img/5_background/layers/4_clouds/2.png",
  third1: "assets/img/5_background/layers/3_third_layer/1.png",
  third2: "assets/img/5_background/layers/3_third_layer/2.png",
  second1: "assets/img/5_background/layers/2_second_layer/1.png",
  second2: "assets/img/5_background/layers/2_second_layer/2.png",
  first1: "assets/img/5_background/layers/1_first_layer/1.png",
  first2: "assets/img/5_background/layers/1_first_layer/2.png",
};

const SCREENS = {
  start: "assets/img/9_intro_outro_screens/start/startscreen_1.png",
  won: "assets/img/You won, you lost/You won A.png",
  lost: "assets/img/9_intro_outro_screens/game_over/game over.png",
};

const ALL_IMAGE_PATHS = [
  ...Object.values(BG),
  ...Object.values(ANIM).flat(),
  "assets/img/8_coin/coin_1.png",
  "assets/img/8_coin/coin_2.png",
  "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
  "assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  SCREENS.start,
  SCREENS.won,
  SCREENS.lost,
];

const ENEMY_SPAWN_POSITIONS = [
  { type: "chicken", x: 500 },
  { type: "small", x: 840 },
  { type: "chicken", x: 1180 },
  { type: "small", x: 1540 },
  { type: "chicken", x: 1900 },
  { type: "small", x: 2250 },
  { type: "chicken", x: 2600 },
];

const COIN_POSITIONS = [
  { x: 360, dy: 0 },
  { x: 430, dy: -20 },
  { x: 500, dy: 0 },
  { x: 920, dy: 0 },
  { x: 990, dy: -30 },
  { x: 1060, dy: 0 },
  { x: 1650, dy: 0 },
  { x: 1720, dy: -15 },
  { x: 1790, dy: 0 },
  { x: 2440, dy: 0 },
  { x: 2510, dy: -25 },
  { x: 2580, dy: 0 },
];

const STATUS_PATHS = {
  health: (v) =>
    `assets/img/7_statusbars/1_statusbar/2_statusbar_health/orange/${v}.png`,
  coin: (v) =>
    `assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/${v}.png`,
  bottle: (v) =>
    `assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/${v}.png`,
  boss: (v) =>
    `assets/img/7_statusbars/2_statusbar_endboss/orange/orange${v}.png`,
};
