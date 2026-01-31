'use client';

import { useState } from 'react';
import Link from 'next/link';
import { generateMatchSlug } from '@/lib/slug-utils';
import { buildLocalePath } from '@/lib/supabase';
import Footer from '@/components/Footer';

// Translations
const translations: Record<string, Record<string, string>> = {
  EN: {
    title: 'Real Bet Results',
    subtitle: 'Verified Betting Records with PDF Proof',
    totalBets: 'Total Bets',
    totalProfit: 'Total Profit',
    totalMatches: 'Total Matches',
    betType: 'Bet Type',
    match: 'Match',
    profit: 'Profit',
    viewPdf: 'View PDF',
    noResults: 'No real bet results available yet.',
    backToPerformance: 'Back to Performance',
    verifiedBadge: 'PDF Verified',
    downloadProof: 'Download Proof',
    score: 'Score',
    league: 'League',
    // Footer translations
    footerDesc: 'AI-powered football odds analysis for smarter predictions.',
    product: 'Product',
    predictions: 'Predictions',
    leagues: 'Leagues',
    liveOdds: 'AI Performance',
    solution: 'Solution',
    popularLeagues: 'Popular Leagues',
    communityFooter: 'Community',
    community: 'Community',
    globalChat: 'Global Chat',
    userPredictions: 'User Predictions',
    company: 'Company',
    aboutUs: 'About Us',
    contact: 'Contact',
    blog: 'Blog',
    legal: 'Legal',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    responsibleGaming: 'Responsible Gaming',
    disclaimer: 'Disclaimer: OddsFlow provides AI-powered predictions for informational purposes only.',
    allRightsReserved: 'All rights reserved.',
    gamblingWarning: '18+ | Gambling involves risk. Please gamble responsibly.',
  },
  ES: {
    title: 'Resultados Reales',
    subtitle: 'Registros de Apuestas Verificados con Prueba PDF',
    totalBets: 'Apuestas Totales',
    totalProfit: 'Ganancia Total',
    totalMatches: 'Partidos Totales',
    betType: 'Tipo de Apuesta',
    match: 'Partido',
    profit: 'Ganancia',
    viewPdf: 'Ver PDF',
    noResults: 'Aún no hay resultados de apuestas reales.',
    backToPerformance: 'Volver al Rendimiento',
    verifiedBadge: 'PDF Verificado',
    downloadProof: 'Descargar Prueba',
    score: 'Resultado',
    league: 'Liga',
    footerDesc: 'Análisis de cuotas de fútbol impulsado por IA.',
    product: 'Producto',
    predictions: 'Predicciones',
    leagues: 'Ligas',
    liveOdds: 'Rendimiento IA',
    solution: 'Solución',
    popularLeagues: 'Ligas Populares',
    communityFooter: 'Comunidad',
    community: 'Comunidad',
    globalChat: 'Chat Global',
    userPredictions: 'Predicciones de Usuarios',
    company: 'Empresa',
    aboutUs: 'Sobre Nosotros',
    contact: 'Contacto',
    blog: 'Blog',
    legal: 'Legal',
    termsOfService: 'Términos de Servicio',
    privacyPolicy: 'Política de Privacidad',
    responsibleGaming: 'Juego Responsable',
    disclaimer: 'Aviso: OddsFlow proporciona predicciones con IA solo con fines informativos.',
    allRightsReserved: 'Todos los derechos reservados.',
    gamblingWarning: '18+ | El juego implica riesgo. Juega responsablemente.',
  },
  PT: {
    title: 'Resultados Reais',
    subtitle: 'Registros de Apostas Verificados com Prova PDF',
    totalBets: 'Apostas Totais',
    totalProfit: 'Lucro Total',
    totalMatches: 'Partidas Totais',
    betType: 'Tipo de Aposta',
    match: 'Partida',
    profit: 'Lucro',
    viewPdf: 'Ver PDF',
    noResults: 'Ainda não há resultados de apostas reais.',
    backToPerformance: 'Voltar ao Desempenho',
    verifiedBadge: 'PDF Verificado',
    downloadProof: 'Baixar Prova',
    score: 'Placar',
    league: 'Liga',
    footerDesc: 'Análise de odds de futebol com IA.',
    product: 'Produto',
    predictions: 'Previsões',
    leagues: 'Ligas',
    liveOdds: 'Desempenho IA',
    solution: 'Solução',
    popularLeagues: 'Ligas Populares',
    communityFooter: 'Comunidade',
    community: 'Comunidade',
    globalChat: 'Chat Global',
    userPredictions: 'Previsões de Usuários',
    company: 'Empresa',
    aboutUs: 'Sobre Nós',
    contact: 'Contato',
    blog: 'Blog',
    legal: 'Legal',
    termsOfService: 'Termos de Serviço',
    privacyPolicy: 'Política de Privacidade',
    responsibleGaming: 'Jogo Responsável',
    disclaimer: 'Aviso: OddsFlow fornece previsões com IA apenas para fins informativos.',
    allRightsReserved: 'Todos os direitos reservados.',
    gamblingWarning: '18+ | Apostas envolvem risco. Jogue com responsabilidade.',
  },
  DE: {
    title: 'Echte Wettergebnisse',
    subtitle: 'Verifizierte Wettaufzeichnungen mit PDF-Nachweis',
    totalBets: 'Gesamtwetten',
    totalProfit: 'Gesamtgewinn',
    totalMatches: 'Gesamtspiele',
    betType: 'Wettart',
    match: 'Spiel',
    profit: 'Gewinn',
    viewPdf: 'PDF Ansehen',
    noResults: 'Noch keine echten Wettergebnisse verfügbar.',
    backToPerformance: 'Zurück zur Leistung',
    verifiedBadge: 'PDF Verifiziert',
    downloadProof: 'Nachweis Herunterladen',
    score: 'Ergebnis',
    league: 'Liga',
    footerDesc: 'KI-gestützte Fußball-Quotenanalyse.',
    product: 'Produkt',
    predictions: 'Vorhersagen',
    leagues: 'Ligen',
    liveOdds: 'KI-Leistung',
    solution: 'Lösung',
    popularLeagues: 'Beliebte Ligen',
    communityFooter: 'Community',
    community: 'Community',
    globalChat: 'Globaler Chat',
    userPredictions: 'Benutzervorhersagen',
    company: 'Unternehmen',
    aboutUs: 'Über Uns',
    contact: 'Kontakt',
    blog: 'Blog',
    legal: 'Rechtliches',
    termsOfService: 'Nutzungsbedingungen',
    privacyPolicy: 'Datenschutz',
    responsibleGaming: 'Verantwortungsvolles Spielen',
    disclaimer: 'Hinweis: OddsFlow bietet KI-Vorhersagen nur zu Informationszwecken.',
    allRightsReserved: 'Alle Rechte vorbehalten.',
    gamblingWarning: '18+ | Glücksspiel birgt Risiken. Spielen Sie verantwortungsvoll.',
  },
  FR: {
    title: 'Résultats Réels',
    subtitle: 'Paris Vérifiés avec Preuve PDF',
    totalBets: 'Paris Totaux',
    totalProfit: 'Profit Total',
    totalMatches: 'Matchs Totaux',
    betType: 'Type de Pari',
    match: 'Match',
    profit: 'Profit',
    viewPdf: 'Voir PDF',
    noResults: 'Pas encore de résultats de paris réels.',
    backToPerformance: 'Retour aux Performances',
    verifiedBadge: 'PDF Vérifié',
    downloadProof: 'Télécharger la Preuve',
    score: 'Score',
    league: 'Ligue',
    footerDesc: 'Analyse des cotes de football par IA.',
    product: 'Produit',
    predictions: 'Prédictions',
    leagues: 'Ligues',
    liveOdds: 'Performance IA',
    solution: 'Solution',
    popularLeagues: 'Ligues Populaires',
    communityFooter: 'Communauté',
    community: 'Communauté',
    globalChat: 'Chat Global',
    userPredictions: 'Prédictions Utilisateurs',
    company: 'Entreprise',
    aboutUs: 'À Propos',
    contact: 'Contact',
    blog: 'Blog',
    legal: 'Légal',
    termsOfService: 'Conditions d\'Utilisation',
    privacyPolicy: 'Politique de Confidentialité',
    responsibleGaming: 'Jeu Responsable',
    disclaimer: 'Avertissement: OddsFlow fournit des prédictions IA à titre informatif uniquement.',
    allRightsReserved: 'Tous droits réservés.',
    gamblingWarning: '18+ | Le jeu comporte des risques. Jouez de manière responsable.',
  },
  JA: {
    title: '実際の賭け結果',
    subtitle: 'PDF証明付き検証済みベッティング記録',
    totalBets: '総ベット数',
    totalProfit: '総利益',
    totalMatches: '総試合数',
    betType: 'ベットタイプ',
    match: '試合',
    profit: '利益',
    viewPdf: 'PDF表示',
    noResults: 'まだ実際の賭け結果がありません。',
    backToPerformance: 'パフォーマンスに戻る',
    verifiedBadge: 'PDF検証済み',
    downloadProof: '証明をダウンロード',
    score: 'スコア',
    league: 'リーグ',
    footerDesc: 'AIによるサッカーオッズ分析。',
    product: '製品',
    predictions: '予測',
    leagues: 'リーグ',
    liveOdds: 'AIパフォーマンス',
    solution: 'ソリューション',
    popularLeagues: '人気リーグ',
    communityFooter: 'コミュニティ',
    community: 'コミュニティ',
    globalChat: 'グローバルチャット',
    userPredictions: 'ユーザー予測',
    company: '会社',
    aboutUs: '会社概要',
    contact: 'お問い合わせ',
    blog: 'ブログ',
    legal: '法的情報',
    termsOfService: '利用規約',
    privacyPolicy: 'プライバシーポリシー',
    responsibleGaming: '責任あるギャンブル',
    disclaimer: '免責事項：OddsFlowは情報提供のみを目的としたAI予測を提供します。',
    allRightsReserved: '全著作権所有。',
    gamblingWarning: '18歳以上 | ギャンブルにはリスクが伴います。責任を持ってプレイしてください。',
  },
  KO: {
    title: '실제 베팅 결과',
    subtitle: 'PDF 증명이 포함된 검증된 베팅 기록',
    totalBets: '총 베팅',
    totalProfit: '총 수익',
    totalMatches: '총 경기',
    betType: '베팅 유형',
    match: '경기',
    profit: '수익',
    viewPdf: 'PDF 보기',
    noResults: '아직 실제 베팅 결과가 없습니다.',
    backToPerformance: '퍼포먼스로 돌아가기',
    verifiedBadge: 'PDF 검증됨',
    downloadProof: '증명 다운로드',
    score: '점수',
    league: '리그',
    footerDesc: 'AI 기반 축구 배당률 분석.',
    product: '제품',
    predictions: '예측',
    leagues: '리그',
    liveOdds: 'AI 성과',
    solution: '솔루션',
    popularLeagues: '인기 리그',
    communityFooter: '커뮤니티',
    community: '커뮤니티',
    globalChat: '글로벌 채팅',
    userPredictions: '사용자 예측',
    company: '회사',
    aboutUs: '회사 소개',
    contact: '연락처',
    blog: '블로그',
    legal: '법적 정보',
    termsOfService: '이용약관',
    privacyPolicy: '개인정보처리방침',
    responsibleGaming: '책임감 있는 게임',
    disclaimer: '면책조항: OddsFlow는 정보 제공 목적으로만 AI 예측을 제공합니다.',
    allRightsReserved: '모든 권리 보유.',
    gamblingWarning: '18세 이상 | 도박에는 위험이 따릅니다. 책임감 있게 플레이하세요.',
  },
  '中文': {
    title: '真实投注结果',
    subtitle: '带PDF证明的已验证投注记录',
    totalBets: '总投注',
    totalProfit: '总利润',
    totalMatches: '总比赛',
    betType: '投注类型',
    match: '比赛',
    profit: '利润',
    viewPdf: '查看PDF',
    noResults: '暂无真实投注结果。',
    backToPerformance: '返回业绩',
    verifiedBadge: 'PDF已验证',
    downloadProof: '下载证明',
    score: '比分',
    league: '联赛',
    footerDesc: 'AI驱动的足球赔率分析。',
    product: '产品',
    predictions: '预测',
    leagues: '联赛',
    liveOdds: 'AI表现',
    solution: '解决方案',
    popularLeagues: '热门联赛',
    communityFooter: '社区',
    community: '社区',
    globalChat: '全球聊天',
    userPredictions: '用户预测',
    company: '公司',
    aboutUs: '关于我们',
    contact: '联系方式',
    blog: '博客',
    legal: '法律',
    termsOfService: '服务条款',
    privacyPolicy: '隐私政策',
    responsibleGaming: '负责任博彩',
    disclaimer: '免责声明：OddsFlow仅提供信息性AI预测。',
    allRightsReserved: '版权所有。',
    gamblingWarning: '18+ | 博彩有风险，请理性投注。',
  },
  '繁體': {
    title: '真實投注結果',
    subtitle: '帶PDF證明的已驗證投注記錄',
    totalBets: '總投注',
    totalProfit: '總利潤',
    totalMatches: '總比賽',
    betType: '投注類型',
    match: '比賽',
    profit: '利潤',
    viewPdf: '查看PDF',
    noResults: '暫無真實投注結果。',
    backToPerformance: '返回業績',
    verifiedBadge: 'PDF已驗證',
    downloadProof: '下載證明',
    score: '比分',
    league: '聯賽',
    footerDesc: 'AI驅動的足球賠率分析。',
    product: '產品',
    predictions: '預測',
    leagues: '聯賽',
    liveOdds: 'AI表現',
    solution: '解決方案',
    popularLeagues: '熱門聯賽',
    communityFooter: '社群',
    community: '社群',
    globalChat: '全球聊天',
    userPredictions: '用戶預測',
    company: '公司',
    aboutUs: '關於我們',
    contact: '聯絡方式',
    blog: '部落格',
    legal: '法律',
    termsOfService: '服務條款',
    privacyPolicy: '隱私政策',
    responsibleGaming: '負責任博彩',
    disclaimer: '免責聲明：OddsFlow僅提供資訊性AI預測。',
    allRightsReserved: '版權所有。',
    gamblingWarning: '18+ | 博彩有風險，請理性投注。',
  },
  ID: {
    title: 'Hasil Taruhan Nyata',
    subtitle: 'Catatan Taruhan Terverifikasi dengan Bukti PDF',
    totalBets: 'Total Taruhan',
    totalProfit: 'Total Keuntungan',
    totalMatches: 'Total Pertandingan',
    betType: 'Jenis Taruhan',
    match: 'Pertandingan',
    profit: 'Keuntungan',
    viewPdf: 'Lihat PDF',
    noResults: 'Belum ada hasil taruhan nyata.',
    backToPerformance: 'Kembali ke Performa',
    verifiedBadge: 'PDF Terverifikasi',
    downloadProof: 'Unduh Bukti',
    score: 'Skor',
    league: 'Liga',
    footerDesc: 'Analisis odds sepak bola berbasis AI.',
    product: 'Produk',
    predictions: 'Prediksi',
    leagues: 'Liga',
    liveOdds: 'Performa AI',
    solution: 'Solusi',
    popularLeagues: 'Liga Populer',
    communityFooter: 'Komunitas',
    community: 'Komunitas',
    globalChat: 'Obrolan Global',
    userPredictions: 'Prediksi Pengguna',
    company: 'Perusahaan',
    aboutUs: 'Tentang Kami',
    contact: 'Kontak',
    blog: 'Blog',
    legal: 'Hukum',
    termsOfService: 'Ketentuan Layanan',
    privacyPolicy: 'Kebijakan Privasi',
    responsibleGaming: 'Permainan Bertanggung Jawab',
    disclaimer: 'Penafian: OddsFlow menyediakan prediksi AI hanya untuk tujuan informasi.',
    allRightsReserved: 'Hak cipta dilindungi.',
    gamblingWarning: '18+ | Perjudian mengandung risiko. Bermainlah secara bertanggung jawab.',
  },
};

// Locale mapping
const localeMapping: Record<string, string> = {
  en: 'EN',
  es: 'ES',
  pt: 'PT',
  de: 'DE',
  fr: 'FR',
  ja: 'JA',
  ko: 'KO',
  zh: '中文',
  tw: '繁體',
  id: 'ID',
};

interface RealBetResult {
  id: number;
  fixture_id: number;
  bet_type: string;
  total_bets: number;
  profit_or_loss: number;
  pdf_link: string | null;
  created_at: string;
  match?: {
    home_name: string;
    away_name: string;
    league_name: string;
    goals_home: number | null;
    goals_away: number | null;
    start_date_msia: string;
  };
}

interface Props {
  locale: string;
  results: RealBetResult[];
  totalBets: number;
  totalProfit: number;
  totalMatches: number;
}

export default function RealBetResultsClient({
  locale,
  results,
  totalBets,
  totalProfit,
  totalMatches,
}: Props) {
  const selectedLang = localeMapping[locale] || 'EN';
  const t = (key: string) => translations[selectedLang]?.[key] || translations['EN'][key] || key;

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-yellow-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Back button */}
        <Link
          href={buildLocalePath('/performance', locale)}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('backToPerformance')}
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t('subtitle')}</p>

          {/* Verified Badge */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30">
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-yellow-400 font-medium">{t('verifiedBadge')}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-white/5 p-6 text-center">
            <p className="text-gray-400 text-sm mb-1">{t('totalBets')}</p>
            <p className="text-3xl font-bold text-white">{totalBets}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-white/5 p-6 text-center">
            <p className="text-gray-400 text-sm mb-1">{t('totalProfit')}</p>
            <p className={`text-3xl font-bold ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {totalProfit >= 0 ? '+' : '-'}${Math.abs(totalProfit).toFixed(2)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-white/5 p-6 text-center">
            <p className="text-gray-400 text-sm mb-1">{t('totalMatches')}</p>
            <p className="text-3xl font-bold text-white">{totalMatches}</p>
          </div>
        </div>

        {/* Results Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result) => {
              const matchSlug = result.match
                ? generateMatchSlug(result.match.home_name, result.match.away_name)
                : 'unknown-match';
              const matchDate = result.match?.start_date_msia
                ? new Date(result.match.start_date_msia).toISOString().split('T')[0]
                : new Date(result.created_at).toISOString().split('T')[0];

              return (
                <div
                  key={result.id}
                  className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-white/10 p-6 hover:border-yellow-500/30 transition-all group"
                >
                  {/* Match Info */}
                  {result.match && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        {result.match.league_name}
                      </p>
                      <p className="text-white font-semibold">
                        {result.match.home_name} vs {result.match.away_name}
                      </p>
                      {result.match.goals_home !== null && result.match.goals_away !== null && (
                        <p className="text-sm text-gray-400">
                          {t('score')}: {result.match.goals_home} - {result.match.goals_away}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Bet Type Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-4">
                    <span className="text-sm text-yellow-400 font-medium uppercase">{result.bet_type}</span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">{t('totalBets')}</p>
                      <p className="text-xl font-bold text-white">{result.total_bets}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">{t('profit')}</p>
                      <p className={`text-xl font-bold ${result.profit_or_loss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {result.profit_or_loss >= 0 ? '+' : '-'}${Math.abs(result.profit_or_loss).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {result.pdf_link && (
                      <a
                        href={result.pdf_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900 font-medium hover:scale-105 transition-transform"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {t('viewPdf')}
                      </a>
                    )}
                    {result.match && (
                      <Link
                        href={buildLocalePath(`/performance/${result.match.league_name?.toLowerCase().replace(/\s+/g, '-')}/profit-summary/${matchSlug}/${result.fixture_id}/${matchDate}`, locale)}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-400 text-lg">{t('noResults')}</p>
          </div>
        )}
      </div>

      <Footer
        localePath={(path: string) => buildLocalePath(path, locale)}
        t={t}
        locale={locale}
      />
    </main>
  );
}
