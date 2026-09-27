'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { READING_PLANS } from '@vachanam/shared';
import { togglePlanDay, getPlanCompletedDays } from '@/lib/storage';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui/card';

export default function ReadingPlansPage() {
  const { language, t } = useI18n();
  const [activePlanId, setActivePlanId] = useState(READING_PLANS[0].id);
  const [completedDays, setCompletedDays] = useState([]);

  const activePlan = READING_PLANS.find(p => p.id === activePlanId) || READING_PLANS[0];

  useEffect(() => {
    loadProgress(activePlanId);
  }, [activePlanId]);

  const loadProgress = async (planId) => {
    const days = await getPlanCompletedDays(planId);
    setCompletedDays(days);
  };

  const handleToggleDay = async (day) => {
    await togglePlanDay(activePlan.id, day);
    await loadProgress(activePlan.id);
  };

  const planTitle = language === 'te'
    ? (activePlan.titleTelugu || activePlan.title)
    : language === 'hi'
    ? (activePlan.titleHindi || activePlan.title)
    : activePlan.title;

  const progressPercent = Math.round((completedDays.length / (activePlan.readings?.length || activePlan.durationDays)) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 min-h-screen pb-32">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
          {t('plans')}
        </h1>
        <p className="text-sm text-muted-foreground">
          Structured biblical reading plans to enrich your daily walk and spiritual discipline
        </p>
      </div>

      {/* Plan Selection Cards Carousel/Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {READING_PLANS.map((plan) => {
          const isSelected = plan.id === activePlanId;
          const title = language === 'te' ? (plan.titleTelugu || plan.title) : language === 'hi' ? (plan.titleHindi || plan.title) : plan.title;

          return (
            <div
              key={plan.id}
              onClick={() => setActivePlanId(plan.id)}
              className={`cursor-pointer p-5 rounded-3xl border transition-all ${
                isSelected
                  ? 'bg-primary-900/10 dark:bg-gold-400/10 border-gold-400 shadow-lg'
                  : 'bg-card border-border hover:border-gold-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <Badge variant={isSelected ? 'gold' : 'outline'} className="text-[10px]">
                  {plan.category}
                </Badge>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{plan.durationDays} Days</span>
                </div>
              </div>

              <h3 className="font-serif font-bold text-base text-foreground mt-3">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {plan.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Active Plan Detail & Checklist */}
      <Card className="border-border shadow-xl bg-card p-6 sm:p-8 space-y-6">
        {/* Plan Header & Progress Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400">
              Active Spiritual Journey
            </span>
            <h2 className="text-2xl font-serif font-bold text-foreground mt-1">{planTitle}</h2>
            <p className="text-xs text-muted-foreground mt-1">{activePlan.description}</p>
          </div>

          <div className="flex flex-col sm:items-end space-y-2">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-gold-500" />
              <span className="font-bold text-lg text-foreground">{progressPercent}% Completed</span>
            </div>
            <div className="w-full sm:w-48 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] text-muted-foreground">
              {completedDays.length} of {activePlan.readings?.length || activePlan.durationDays} days completed
            </span>
          </div>
        </div>

        {/* Daily Readings Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activePlan.readings?.map((reading) => {
            const isCompleted = completedDays.includes(reading.day);
            const firstRef = reading.references?.[0] || 'MAT.1';
            const [bCode, ch] = firstRef.split('.');

            return (
              <div
                key={reading.day}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isCompleted
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                    : 'bg-card border-border hover:border-gold-300'
                }`}
              >
                {/* Day Number and Title */}
                <div className="flex items-start space-x-3 min-w-0">
                  <button
                    onClick={() => handleToggleDay(reading.day)}
                    className="mt-0.5 text-muted-foreground hover:text-emerald-500 transition-colors flex-shrink-0"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <h4 className={`text-sm font-semibold truncate ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      Day {reading.day}: {reading.title}
                    </h4>
                    <p className="text-xs text-gold-600 dark:text-gold-400 font-mono mt-0.5">
                      {reading.references?.join(', ')}
                    </p>
                  </div>
                </div>

                {/* Read Button */}
                <Link href={`/reader?book=${bCode}&chapter=${ch || 1}`}>
                  <Button variant="outline" size="sm" className="text-xs rounded-xl h-8 px-3">
                    <BookOpen className="w-3.5 h-3.5 mr-1" />
                    Read
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
