/**
 * Asian Handicap Unrealized Profit Calculator
 *
 * Calculates the floating P&L for live matches by treating the current score
 * as the final result and applying standard Asian Handicap settlement rules.
 *
 * Supports all handicap types including quarter lines (0.25, 0.75, 1.25, etc.)
 */

export type UnrealizedStatus = 'WIN' | 'WIN_HALF' | 'PUSH' | 'LOSS_HALF' | 'LOSS';

export interface UnrealizedHdpResult {
  status: UnrealizedStatus;
  profit: number; // In dollars (stake * 1 unit = $1)
}

/**
 * Settles a single whole or half line bet
 * @param goalDiff - Goal difference from the perspective of the selected team (positive = winning)
 * @param line - The handicap line (can be whole, half, or quarter)
 * @param odds - Decimal odds
 * @param stake - Stake amount
 * @returns Settlement result with status and profit
 */
function settleSingleLine(
  goalDiff: number,
  line: number,
  odds: number,
  stake: number
): { status: UnrealizedStatus; profit: number } {
  // Adjusted goal difference with handicap
  const adjustedDiff = goalDiff + line;

  if (adjustedDiff > 0.25) {
    // Full win
    return { status: 'WIN', profit: stake * (odds - 1) };
  } else if (adjustedDiff === 0.25) {
    // Half win (quarter line edge case)
    return { status: 'WIN_HALF', profit: (stake / 2) * (odds - 1) };
  } else if (adjustedDiff === 0) {
    // Push - stake returned
    return { status: 'PUSH', profit: 0 };
  } else if (adjustedDiff === -0.25) {
    // Half loss (quarter line edge case)
    return { status: 'LOSS_HALF', profit: -(stake / 2) };
  } else {
    // Full loss
    return { status: 'LOSS', profit: -stake };
  }
}

/**
 * Checks if a line is a quarter line (needs to be split)
 */
function isQuarterLine(line: number): boolean {
  const absLine = Math.abs(line);
  const decimal = absLine - Math.floor(absLine);
  return Math.abs(decimal - 0.25) < 0.001 || Math.abs(decimal - 0.75) < 0.001;
}

/**
 * Splits a quarter line into two half lines
 * @param line - The quarter line (e.g., 0.25, 0.75, 1.25)
 * @returns Array of two lines [lowerLine, upperLine]
 */
function splitQuarterLine(line: number): [number, number] {
  const sign = line >= 0 ? 1 : -1;
  const absLine = Math.abs(line);
  const decimal = absLine - Math.floor(absLine);
  const base = Math.floor(absLine);

  if (Math.abs(decimal - 0.25) < 0.001) {
    // x.25 splits to x.0 and x.5
    return [sign * base, sign * (base + 0.5)];
  } else if (Math.abs(decimal - 0.75) < 0.001) {
    // x.75 splits to x.5 and (x+1).0
    return [sign * (base + 0.5), sign * (base + 1)];
  }

  // Shouldn't reach here, but return the line twice as fallback
  return [line, line];
}

/**
 * Main function to calculate Unrealized Profit for Asian Handicap bets
 *
 * @param currentScoreHome - Current home team score
 * @param currentScoreAway - Current away team score
 * @param selection - Which team was selected ('HOME' or 'AWAY')
 * @param handicapLine - The handicap line (supports quarter lines)
 * @param marketOdds - Decimal odds at time of bet
 * @param stakeUnits - Stake in units (1 unit = $1)
 * @returns UnrealizedHdpResult with status and profit in dollars
 *
 * @example
 * // Bet: Away +0.25 at 2.05 odds, 10.22 units stake
 * // Current score: Home 2 - Away 1
 * const result = calculateUnrealizedHdpPnL(2, 1, 'AWAY', 0.25, 2.05, 10.22);
 * // result = { status: 'LOSS', profit: -10.22 }
 */
export function calculateUnrealizedHdpPnL(
  currentScoreHome: number,
  currentScoreAway: number,
  selection: 'HOME' | 'AWAY',
  handicapLine: number,
  marketOdds: number,
  stakeUnits: number
): UnrealizedHdpResult {
  // Calculate stake in dollars (1 unit = $1)
  const stakeAmount = stakeUnits;

  // Calculate goal difference from the selected team's perspective
  // HOME selection: home goals - away goals
  // AWAY selection: away goals - home goals
  const goalDiff = selection === 'HOME'
    ? currentScoreHome - currentScoreAway
    : currentScoreAway - currentScoreHome;

  // Check if this is a quarter line that needs splitting
  if (isQuarterLine(handicapLine)) {
    const [line1, line2] = splitQuarterLine(handicapLine);
    const halfStake = stakeAmount / 2;

    // Settle each half independently
    const result1 = settleSingleLine(goalDiff, line1, marketOdds, halfStake);
    const result2 = settleSingleLine(goalDiff, line2, marketOdds, halfStake);

    // Combine profits
    const totalProfit = result1.profit + result2.profit;

    // Determine combined status
    let combinedStatus: UnrealizedStatus;

    if (result1.status === 'WIN' && result2.status === 'WIN') {
      combinedStatus = 'WIN';
    } else if (result1.status === 'LOSS' && result2.status === 'LOSS') {
      combinedStatus = 'LOSS';
    } else if (result1.status === 'PUSH' && result2.status === 'PUSH') {
      combinedStatus = 'PUSH';
    } else if (
      (result1.status === 'WIN' && result2.status === 'PUSH') ||
      (result1.status === 'PUSH' && result2.status === 'WIN')
    ) {
      combinedStatus = 'WIN_HALF';
    } else if (
      (result1.status === 'LOSS' && result2.status === 'PUSH') ||
      (result1.status === 'PUSH' && result2.status === 'LOSS')
    ) {
      combinedStatus = 'LOSS_HALF';
    } else if (
      (result1.status === 'WIN' && result2.status === 'LOSS') ||
      (result1.status === 'LOSS' && result2.status === 'WIN')
    ) {
      // One win, one loss - determine based on profit
      combinedStatus = totalProfit > 0 ? 'WIN_HALF' : totalProfit < 0 ? 'LOSS_HALF' : 'PUSH';
    } else {
      // Mixed results - determine based on profit
      combinedStatus = totalProfit > 0 ? 'WIN_HALF' : totalProfit < 0 ? 'LOSS_HALF' : 'PUSH';
    }

    return {
      status: combinedStatus,
      profit: Math.round(totalProfit * 100) / 100 // Round to 2 decimal places
    };
  }

  // Standard whole or half line
  const result = settleSingleLine(goalDiff, handicapLine, marketOdds, stakeAmount);

  return {
    status: result.status,
    profit: Math.round(result.profit * 100) / 100
  };
}

/**
 * Formats unrealized profit for display
 * @param profit - Profit amount in dollars
 * @returns Formatted string with + or - prefix
 */
export function formatUnrealizedProfit(profit: number): string {
  if (profit === 0) return '$0.00';
  const sign = profit > 0 ? '+' : '';
  return `${sign}$${profit.toFixed(2)}`;
}

/**
 * Gets the CSS color class for unrealized status
 * @param status - The unrealized status
 * @returns Tailwind CSS color class
 */
export function getUnrealizedStatusColor(status: UnrealizedStatus): string {
  switch (status) {
    case 'WIN':
      return 'text-emerald-400';
    case 'WIN_HALF':
      return 'text-emerald-400/70';
    case 'PUSH':
      return 'text-gray-400';
    case 'LOSS_HALF':
      return 'text-red-400/70';
    case 'LOSS':
      return 'text-red-400';
  }
}
