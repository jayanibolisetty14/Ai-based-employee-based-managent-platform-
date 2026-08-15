import { Rarity } from '../types';

export const RARITY_CONFIG = {
  [Rarity.COMMON]: {
    color: 'text-slate-400',
    bg: 'bg-slate-400/10',
    border: 'border-slate-400/20',
    glow: 'shadow-[0_0_15px_rgba(148,163,184,0.3)]',
    label: 'Common',
    xpMultiplier: 1,
    baseXP: 50,
  },
  [Rarity.RARE]: {
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/20',
    glow: 'shadow-[0_0_15px_rgba(34,211,238,0.3)]',
    label: 'Rare',
    xpMultiplier: 2,
    baseXP: 100,
  },
  [Rarity.EPIC]: {
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
    glow: 'shadow-[0_0_15px_rgba(192,132,252,0.3)]',
    label: 'Epic',
    xpMultiplier: 5,
    baseXP: 250,
  },
  [Rarity.LEGENDARY]: {
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.4)]',
    label: 'Legendary',
    xpMultiplier: 10,
    baseXP: 500,
  },
};

export function getRarityTheme(rarity: Rarity) {
  return RARITY_CONFIG[rarity] || RARITY_CONFIG[Rarity.COMMON];
}

export const RARITY_THRESHOLDS = {
  [Rarity.COMMON]: 0,
  [Rarity.RARE]: 100,
  [Rarity.EPIC]: 250,
  [Rarity.LEGENDARY]: 500,
};

export function getUserRarity(totalXP: number): Rarity {
  if (totalXP >= RARITY_THRESHOLDS[Rarity.LEGENDARY]) return Rarity.LEGENDARY;
  if (totalXP >= RARITY_THRESHOLDS[Rarity.EPIC]) return Rarity.EPIC;
  if (totalXP >= RARITY_THRESHOLDS[Rarity.RARE]) return Rarity.RARE;
  return Rarity.COMMON;
}

export function getNextRarity(totalXP: number): { nextRarity: Rarity | null, xpNeeded: number, progressPercent: number, nextThreshold: number | null } {
  const current = getUserRarity(totalXP);
  let nextRarity: Rarity | null = null;
  let nextThreshold: number | null = null;
  const currentThreshold = RARITY_THRESHOLDS[current];

  if (current === Rarity.COMMON) {
    nextRarity = Rarity.RARE;
    nextThreshold = RARITY_THRESHOLDS[Rarity.RARE];
  } else if (current === Rarity.RARE) {
    nextRarity = Rarity.EPIC;
    nextThreshold = RARITY_THRESHOLDS[Rarity.EPIC];
  } else if (current === Rarity.EPIC) {
    nextRarity = Rarity.LEGENDARY;
    nextThreshold = RARITY_THRESHOLDS[Rarity.LEGENDARY];
  }

  if (!nextRarity || !nextThreshold) {
    return { nextRarity: null, xpNeeded: 0, progressPercent: 100, nextThreshold: null };
  }

  const xpNeeded = nextThreshold - totalXP;
  // Progress relative to current tier
  const tierSize = nextThreshold - currentThreshold;
  const progressInTier = totalXP - currentThreshold;
  const progressPercent = Math.max(0, Math.min(100, (progressInTier / tierSize) * 100));

  return { nextRarity, xpNeeded, progressPercent, nextThreshold };
}

export function getRarityProgress(totalXP: number) {
  return getNextRarity(totalXP);
}
