'use client';

import React from 'react';
import { Prematch, ExclusiveReportData } from '@/lib/supabase';

interface ExclusiveReportTemplateProps {
  title: string;
  summary: string;
  publishedAt?: string;
  imageUrl?: string;
  matchInfo: Prematch | null;
  articleData: ExclusiveReportData;
  locale: string;
}

// Section type icons and colors
const sectionConfig: Record<string, { icon: React.ReactNode; color: string; bgColor: string }> = {
  intro: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
  },
  analysis: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10 border-cyan-500/20',
  },
  odds: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/20',
  },
  strategy: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20',
  },
  conclusion: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/20',
  },
};

// Helper to format date
function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ExclusiveReportTemplate({
  title,
  summary,
  publishedAt,
  imageUrl,
  matchInfo,
  articleData,
  locale,
}: ExclusiveReportTemplateProps) {
  const { sections, key_stats, verdict } = articleData;

  // Use provided image or default news image
  const backgroundImage = imageUrl || '/news/news.webp';

  return (
    <div className="exclusive-report">
      {/* Hero Image */}
      <div className="relative -mx-6 sm:-mx-8 lg:-mx-12 -mt-6 sm:-mt-8 lg:-mt-12 mb-8 h-48 sm:h-64 overflow-hidden rounded-t-3xl">
        <img
          src={backgroundImage}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e14] via-[#0a0e14]/70 to-transparent" />

        {/* Badge on Image */}
        <div className="absolute bottom-4 left-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-xs font-bold uppercase tracking-wider">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>
            <span>OddsFlow Exclusive</span>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="mb-8">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
          {title}
        </h1>

        {/* Meta */}
        {publishedAt && (
          <p className="text-gray-400 text-sm">{formatDate(publishedAt)}</p>
        )}
      </div>

      {/* Match Result Card */}
      {matchInfo && (
        <div className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-[#0f172a] to-[#0c1220] border border-white/10">
          {/* League Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-black/30 border-b border-white/5">
            <div className="flex items-center gap-2">
              {matchInfo.league_logo && (
                <img src={matchInfo.league_logo} alt="" className="w-5 h-5 object-contain" />
              )}
              <span className="text-white text-sm font-medium">{matchInfo.league_name}</span>
            </div>
            <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold">
              FULL TIME
            </span>
          </div>

          {/* Teams & Score */}
          <div className="px-6 py-8">
            <div className="flex items-center justify-between">
              {/* Home */}
              <div className="flex-1 flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 flex items-center justify-center mb-3">
                  {matchInfo.home_logo ? (
                    <img src={matchInfo.home_logo} alt="" className="w-12 h-12 sm:w-14 sm:h-14 object-contain" />
                  ) : (
                    <span className="text-2xl font-bold text-gray-400">{matchInfo.home_name?.charAt(0)}</span>
                  )}
                </div>
                <span className="text-white font-semibold text-sm text-center">{matchInfo.home_name}</span>
              </div>

              {/* Score */}
              <div className="px-6">
                <div className="flex items-center gap-4">
                  <span className="text-4xl sm:text-5xl font-bold text-white">{matchInfo.goals_home ?? 0}</span>
                  <span className="text-2xl text-gray-500">-</span>
                  <span className="text-4xl sm:text-5xl font-bold text-white">{matchInfo.goals_away ?? 0}</span>
                </div>
              </div>

              {/* Away */}
              <div className="flex-1 flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 flex items-center justify-center mb-3">
                  {matchInfo.away_logo ? (
                    <img src={matchInfo.away_logo} alt="" className="w-12 h-12 sm:w-14 sm:h-14 object-contain" />
                  ) : (
                    <span className="text-2xl font-bold text-gray-400">{matchInfo.away_name?.charAt(0)}</span>
                  )}
                </div>
                <span className="text-white font-semibold text-sm text-center">{matchInfo.away_name}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Stats Grid */}
      {key_stats && key_stats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {key_stats.map((stat, idx) => {
            const colorClass = {
              green: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
              red: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
              blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
              amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
            }[stat.color || 'blue'];

            return (
              <div key={idx} className={`p-4 rounded-xl border ${colorClass}`}>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Verdict Card - Simple WIN/LOSS indicator */}
      {verdict && (
        <div className={`mb-8 p-4 rounded-xl border flex items-center gap-3 ${
          verdict.prediction_result === 'WIN'
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : verdict.prediction_result === 'LOSS'
            ? 'bg-rose-500/10 border-rose-500/30'
            : 'bg-amber-500/10 border-amber-500/30'
        }`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            verdict.prediction_result === 'WIN'
              ? 'bg-emerald-500/20'
              : verdict.prediction_result === 'LOSS'
              ? 'bg-rose-500/20'
              : 'bg-amber-500/20'
          }`}>
            {verdict.prediction_result === 'WIN' ? (
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : verdict.prediction_result === 'LOSS' ? (
              <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            )}
          </div>
          <div>
            <p className="text-gray-400 text-xs">OddsFlow Prediction Result</p>
            <p className={`text-lg font-bold ${
              verdict.prediction_result === 'WIN'
                ? 'text-emerald-400'
                : verdict.prediction_result === 'LOSS'
                ? 'text-rose-400'
                : 'text-amber-400'
            }`}>
              {verdict.prediction_result}
            </p>
          </div>
        </div>
      )}

      {/* Summary Quote */}
      {summary && (
        <div className="mb-10 p-6 rounded-xl bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 border-l-4 border-emerald-500">
          <p className="text-lg text-gray-200 leading-relaxed italic">
            "{summary}"
          </p>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-8">
        {sections.map((section, idx) => {
          const config = sectionConfig[section.type] || sectionConfig.analysis;

          return (
            <div key={section.id || idx} className="section">
              {/* Section Header */}
              <div className={`flex items-center gap-3 mb-4 p-3 rounded-lg border ${config.bgColor}`}>
                <span className={config.color}>{config.icon}</span>
                <h2 className={`text-lg font-bold ${config.color}`}>{section.title}</h2>
              </div>

              {/* Section Content */}
              <div className="pl-4 border-l-2 border-white/10">
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-white/10">
        <div className="flex items-center gap-3">
          <img src="/homepage/OddsFlow Logo2.png" alt="OddsFlow" className="w-10 h-10 object-contain" />
          <div>
            <p className="text-white font-semibold">OddsFlow Analysis Team</p>
            <p className="text-gray-500 text-sm">AI-Powered Football Intelligence</p>
          </div>
        </div>
      </div>
    </div>
  );
}
