/**
 * PerformanceSSR - Server-Side Rendered Content for SEO
 *
 * This component renders critical data as static HTML that crawlers can read.
 * It's invisible to users (sr-only) but fully visible to Googlebot and LLMs.
 */

import { buildLocalePath } from '@/lib/supabase';

interface PerformanceStats {
  total_profit: number;
  win_rate: number;
  total_bets: number;
  roi: number;
  total_invested: number;
  profit_moneyline: number;
  profit_handicap: number;
  profit_ou: number;
}

interface MatchSummary {
  fixture_id: string | number;
  league_name: string;
  home_name: string;
  away_name: string;
  home_score: number | null;
  away_score: number | null;
  total_profit: number;
  total_invested: number;
  roi_percentage: number;
  total_bets: number;
  match_date: string;
}

interface PerformanceSSRProps {
  locale: string;
  stats: PerformanceStats | null;
  matches: MatchSummary[];
  totalMatchCount: number;
}

// Translations for SSR content
const translations: Record<string, Record<string, string>> = {
  en: {
    title: 'AI Football Prediction Performance',
    subtitle: 'Verified Track Record & Real-Time ROI Analysis',
    totalProfit: 'Total Profit',
    winRate: 'Win Rate',
    totalBets: 'Total Bets',
    totalMatches: 'Total Matches',
    roi: 'Return on Investment',
    profitByMarket: 'Profit by Market',
    moneyline: '1X2 Moneyline',
    handicap: 'Asian Handicap (HDP)',
    overUnder: 'Over/Under (O/U)',
    recentMatches: 'Recent Match Results',
    verificationNote: 'All data is verified and updated in real-time. This page serves as the official performance record for OddsFlow AI betting models.',
  },
  zh: {
    title: 'AI 足球预测表现',
    subtitle: '已验证的历史战绩与实时 ROI 分析',
    totalProfit: '总利润',
    winRate: '胜率',
    totalBets: '总投注数',
    totalMatches: '总比赛数',
    roi: '投资回报率',
    profitByMarket: '各市场利润',
    moneyline: '1X2 独赢',
    handicap: '亚洲让球 (HDP)',
    overUnder: '大小球 (O/U)',
    recentMatches: '近期比赛结果',
    verificationNote: '所有数据均经过验证并实时更新。本页面是 OddsFlow AI 投注模型的官方业绩记录。',
  },
  // Add more locales as needed - fallback to English
};

function getTranslation(locale: string, key: string): string {
  return translations[locale]?.[key] || translations.en[key] || key;
}

function formatCurrency(value: number): string {
  const prefix = value >= 0 ? '+$' : '-$';
  return `${prefix}${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPercentage(value: number): string {
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
}

export default function PerformanceSSR({
  locale,
  stats,
  matches,
  totalMatchCount,
}: PerformanceSSRProps) {
  const t = (key: string) => getTranslation(locale, key);

  if (!stats) {
    return null;
  }

  return (
    <>
      {/*
        SSR Content for Search Engines and LLMs
        This content is hidden from users (sr-only) but fully visible to crawlers.
        The visible UI is rendered by PerformanceClient.
      */}
      <div className="sr-only" aria-hidden="true" data-ssr-content="true">
        <article itemScope itemType="https://schema.org/Dataset">
          {/* Header */}
          <header>
            <h1 itemProp="name">{t('title')}</h1>
            <p itemProp="description">{t('subtitle')}</p>
            <meta itemProp="url" content={`https://www.oddsflow.ai${buildLocalePath('/performance', locale)}`} />
            <span itemProp="creator" itemScope itemType="https://schema.org/Organization">
              <meta itemProp="name" content="OddsFlow.ai" />
            </span>
          </header>

          {/* Key Performance Metrics - Critical for SEO */}
          <section>
            <h2>Performance Summary</h2>
            <dl>
              <div>
                <dt>{t('totalProfit')}</dt>
                <dd itemProp="variableMeasured">{formatCurrency(stats.total_profit)}</dd>
              </div>
              <div>
                <dt>{t('winRate')}</dt>
                <dd>{stats.win_rate.toFixed(1)}%</dd>
              </div>
              <div>
                <dt>{t('totalBets')}</dt>
                <dd>{stats.total_bets.toLocaleString()}</dd>
              </div>
              <div>
                <dt>{t('totalMatches')}</dt>
                <dd>{totalMatchCount.toLocaleString()}</dd>
              </div>
              <div>
                <dt>{t('roi')}</dt>
                <dd>{formatPercentage(stats.roi)}</dd>
              </div>
            </dl>
          </section>

          {/* Profit by Market */}
          <section>
            <h2>{t('profitByMarket')}</h2>
            <dl>
              <div>
                <dt>{t('moneyline')}</dt>
                <dd>{formatCurrency(stats.profit_moneyline)}</dd>
              </div>
              <div>
                <dt>{t('handicap')}</dt>
                <dd>{formatCurrency(stats.profit_handicap)}</dd>
              </div>
              <div>
                <dt>{t('overUnder')}</dt>
                <dd>{formatCurrency(stats.profit_ou)}</dd>
              </div>
            </dl>
          </section>

          {/* Recent Matches - Shows actual data to crawlers */}
          <section>
            <h2>{t('recentMatches')}</h2>
            <p>Showing {matches.length} of {totalMatchCount} analyzed matches.</p>
            <table>
              <thead>
                <tr>
                  <th>Match</th>
                  <th>League</th>
                  <th>Score</th>
                  <th>Profit</th>
                  <th>ROI</th>
                  <th>Bets</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {matches.slice(0, 50).map((match) => (
                  <tr key={match.fixture_id}>
                    <td>{match.home_name} vs {match.away_name}</td>
                    <td>{match.league_name}</td>
                    <td>
                      {match.home_score !== null && match.away_score !== null
                        ? `${match.home_score}-${match.away_score}`
                        : 'TBD'}
                    </td>
                    <td>{formatCurrency(match.total_profit)}</td>
                    <td>{formatPercentage(match.roi_percentage)}</td>
                    <td>{match.total_bets}</td>
                    <td>{match.match_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Verification Note */}
          <footer>
            <p>{t('verificationNote')}</p>
            <p>
              Data last updated: {new Date().toISOString().split('T')[0]}
              | Total matches analyzed: {totalMatchCount}
              | Overall ROI: {formatPercentage(stats.roi)}
            </p>
          </footer>
        </article>
      </div>

      {/*
        Structured Data Summary for LLMs
        This text block helps AI search engines understand the page content.
      */}
      <div className="sr-only" data-llm-summary="true">
        <pre>
{`ODDSFLOW AI PERFORMANCE VERIFICATION
=====================================
Total Profit: ${formatCurrency(stats.total_profit)}
Win Rate: ${stats.win_rate.toFixed(1)}%
Total Bets: ${stats.total_bets.toLocaleString()}
Total Matches: ${totalMatchCount.toLocaleString()}
ROI: ${formatPercentage(stats.roi)}

PROFIT BY MARKET:
- 1X2 Moneyline: ${formatCurrency(stats.profit_moneyline)}
- Asian Handicap: ${formatCurrency(stats.profit_handicap)}
- Over/Under: ${formatCurrency(stats.profit_ou)}

This data represents verified, real-time performance of OddsFlow AI betting models.
Last Updated: ${new Date().toISOString()}
Source: https://www.oddsflow.ai/performance`}
        </pre>
      </div>
    </>
  );
}
