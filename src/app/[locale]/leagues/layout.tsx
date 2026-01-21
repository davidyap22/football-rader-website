import type { Metadata } from "next";

// Translations for metadata
const metaTitles: Record<string, string> = {
  en: "European League Predictions - EPL, Bundesliga, Serie A, La Liga, Ligue 1",
  es: "Predicciones Ligas Europeas - EPL, Bundesliga, Serie A, La Liga, Ligue 1",
  pt: "Previsoes Ligas Europeias - EPL, Bundesliga, Serie A, La Liga, Ligue 1",
  de: "Europaische Liga Vorhersagen - EPL, Bundesliga, Serie A, La Liga, Ligue 1",
  fr: "Predictions Ligues Europeennes - EPL, Bundesliga, Serie A, La Liga, Ligue 1",
  ja: "欧州リーグ予測 - EPL、ブンデスリーガ、セリエA、ラ・リーガ、リーグ1",
  ko: "유럽 리그 예측 - EPL, 분데스리가, 세리에 A, 라리가, 리그 1",
  zh: "欧洲联赛预测 - 英超、德甲、意甲、西甲、法甲",
  'zh-tw': "歐洲聯賽預測 - 英超、德甲、意甲、西甲、法甲",
  id: "Prediksi Liga Eropa - EPL, Bundesliga, Serie A, La Liga, Ligue 1",
};

const metaDescriptions: Record<string, string> = {
  en: "Top 5 betting predictions for all major European leagues. EPL top 5 betting predictions, Bundesliga AI betting predictions, Serie A artificial intelligence picks, La Liga & Ligue 1 AI prediction model.",
  es: "Las mejores 5 predicciones de apuestas para las principales ligas europeas. Predicciones de apuestas IA para EPL, Bundesliga, Serie A, La Liga y Ligue 1.",
  pt: "Top 5 previsoes de apostas para as principais ligas europeias. Previsoes de apostas IA para EPL, Bundesliga, Serie A, La Liga e Ligue 1.",
  de: "Top 5 Wettvorhersagen fur alle grossen europaischen Ligen. EPL KI-Wettvorhersagen, Bundesliga KI-Tipps, Serie A Kunstliche Intelligenz Picks.",
  fr: "Top 5 predictions de paris pour toutes les grandes ligues europeennes. Predictions de paris IA EPL, Bundesliga, Serie A, La Liga et Ligue 1.",
  ja: "主要欧州リーグのトップ5ベッティング予測。EPL、ブンデスリーガ、セリエA、ラ・リーガ、リーグ1のAI予測。",
  ko: "주요 유럽 리그 베팅 예측 Top 5. EPL, 분데스리가, 세리에 A, 라리가, 리그 1 AI 예측.",
  zh: "欧洲主要联赛投注预测Top 5。英超、德甲、意甲、西甲、法甲AI预测模型。",
  'zh-tw': "歐洲主要聯賽投注預測Top 5。英超、德甲、意甲、西甲、法甲AI預測模型。",
  id: "Top 5 prediksi taruhan untuk semua liga utama Eropa. Prediksi taruhan AI EPL, Bundesliga, Serie A, La Liga & Ligue 1.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = 'https://www.oddsflow.ai';
  const canonicalPath = locale === 'en' ? '/leagues' : `/${locale}/leagues`;

  const title = metaTitles[locale] || metaTitles.en;
  const description = metaDescriptions[locale] || metaDescriptions.en;

  return {
    title,
    description,
    keywords: [
      "EPL top 5 betting predictions",
      "Bundesliga top 5 betting predictions",
      "Serie A top 5 betting predictions",
      "La Liga top 5 betting predictions",
      "Ligue 1 top 5 betting predictions",
      "Premier League AI predictor",
      "Bundesliga AI betting predictions",
      "Serie A artificial intelligence picks",
      "Ligue 1 AI prediction model",
      "Champions League betting analysis AI",
      "European football AI tips",
    ],
    alternates: {
      canonical: `${baseUrl}${canonicalPath}`,
    },
    openGraph: {
      title,
      description,
    },
  };
}

export default function LeaguesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
