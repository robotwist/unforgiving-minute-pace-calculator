// Progress Dashboard Integration
import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Target, Award, Clock, MapPin, Share2, CheckCircle, Sparkles } from 'lucide-react';
import { startOfWeek, weekKey } from '../../utils/trainingMetrics';
import MetricCard from './MetricCard';
import { trackWeeklyCheckInSubmitted, trackWeeklyRecapCopied } from '../../utils/analytics';

const ProgressDashboard = ({ colors, userProfile, currentPlan, recentActivities }) => {
  const [activeMetric, setActiveMetric] = useState('overview');
  const [weeklyStats, setWeeklyStats] = useState({
    milesThisWeek: 0,
    targetMiles: 0,
    workoutsCompleted: 0,
    targetWorkouts: 0,
    avgPace: '0:00',
    goldenPaceHits: 0
  });
  const [checkIn, setCheckIn] = useState({
    mood: 'Good',
    energy: 'Good',
    soreness: 'Low',
    confidence: 'Good',
    notes: '',
    nextFocus: ''
  });
  const [checkIns, setCheckIns] = useState([]);
  const [checkInSaved, setCheckInSaved] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');

  useEffect(() => {
    // Calculate weekly progress from activities
    if (recentActivities && recentActivities.length > 0) {
      const thisWeek = recentActivities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= startOfWeek(new Date());
      });

      const totalMiles = thisWeek.reduce((sum, activity) => sum + activity.distance, 0);
      const totalTime = thisWeek.reduce((sum, activity) => sum + activity.duration, 0);
      const avgPace = totalMiles > 0 ? formatTime(totalTime / totalMiles) : '0:00';

      setWeeklyStats({
        milesThisWeek: totalMiles,
        targetMiles: currentPlan?.weeklyMileage || 0,
        workoutsCompleted: thisWeek.length,
        targetWorkouts: currentPlan?.workoutsPerWeek || 0,
        avgPace,
        goldenPaceHits: thisWeek.filter(a => a.hitGoldenPace).length
      });
    }
  }, [recentActivities, currentPlan]);

  useEffect(() => {
    // Load weekly check-ins (retention feature)
    try {
      const saved = JSON.parse(localStorage.getItem('weekly_checkins') || '[]');
      setCheckIns(Array.isArray(saved) ? saved : []);
    } catch (e) {
      setCheckIns([]);
    }
  }, []);

  const formatTime = (minutes) => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (current, target) => {
    if (!target) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const milesProgress = getProgressPercentage(weeklyStats.milesThisWeek, weeklyStats.targetMiles);
  const workoutsProgress = getProgressPercentage(weeklyStats.workoutsCompleted, weeklyStats.targetWorkouts);
  const thisWeekKey = weekKey(new Date());
  const lastCheckInWeekKey = (checkIns[checkIns.length - 1]?.weekKey) || null;
  const needsCheckIn = lastCheckInWeekKey !== thisWeekKey;

  const buildWeeklyShareText = () => {
    const weekStart = startOfWeek(new Date()).toLocaleDateString();
    const planName = currentPlan?.name ? `Plan: ${currentPlan.name}\n` : '';
    const focus = checkIns[checkIns.length - 1]?.nextFocus
      ? `Next focus: ${checkIns[checkIns.length - 1].nextFocus}\n`
      : '';

    return (
      `Unforgiving Minute — Weekly Recap\n` +
      `Week of ${weekStart}\n` +
      planName +
      `Miles: ${weeklyStats.milesThisWeek.toFixed(1)}\n` +
      `Workouts: ${weeklyStats.workoutsCompleted}\n` +
      `Avg pace: ${weeklyStats.avgPace} /mi\n` +
      `Golden Pace hits: ${weeklyStats.goldenPaceHits}\n` +
      focus
    );
  };

  const copyWeeklyShareText = async () => {
    const text = buildWeeklyShareText();
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setCopyStatus('Copied!');
        trackWeeklyRecapCopied();
      } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopyStatus('Copied!');
        trackWeeklyRecapCopied();
      }
    } catch (e) {
      setCopyStatus('Copy failed');
    } finally {
      window.setTimeout(() => setCopyStatus(''), 1200);
    }
  };

  const computeAchievements = () => {
    const achievements = [
      {
        id: 'first_activity',
        title: 'First activity',
        description: 'Log your first training session',
        earned: (recentActivities?.length || 0) > 0
      },
      {
        id: 'three_workouts_week',
        title: '3 workouts this week',
        description: 'Hit 3 sessions in a week',
        earned: weeklyStats.workoutsCompleted >= 3
      },
      {
        id: 'ten_miles_week',
        title: '10 miles this week',
        description: 'Build consistency with 10+ miles',
        earned: weeklyStats.milesThisWeek >= 10
      },
      {
        id: 'plan_target_met',
        title: 'On-target week',
        description: 'Meet your plan’s weekly mileage or workouts goal',
        earned: (milesProgress >= 100 && weeklyStats.targetMiles > 0) || (workoutsProgress >= 100 && weeklyStats.targetWorkouts > 0)
      },
      {
        id: 'golden_pace_hit',
        title: 'Golden Pace hit',
        description: 'Score at least one Golden Pace hit',
        earned: weeklyStats.goldenPaceHits > 0
      }
    ];
    return achievements;
  };

  const achievements = computeAchievements();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: colors.black }}>
            Training Progress
          </h2>
          <p style={{ color: colors.darkGreen }}>
            Week {currentPlan?.currentWeek || 1} of {currentPlan?.duration || 12}
          </p>
        </div>
        <div 
          className="px-4 py-2 rounded-full"
          style={{ backgroundColor: colors.lightGreen + '20', color: colors.lightGreen }}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Weekly Check-In + Share */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="munich-card">
          <div className="munich-card-body">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: colors.black }}>
                  <CheckCircle className="w-5 h-5" style={{ color: colors.lightGreen }} />
                  Weekly check-in
                </h3>
                <p className="text-sm mt-1" style={{ color: colors.darkGreen }}>
                  {needsCheckIn ? '2 minutes now = better consistency next week.' : 'You’re checked in for this week.'}
                </p>
              </div>
              <div className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: colors.gray + '20', color: colors.darkGreen }}>
                Week of {startOfWeek(new Date()).toLocaleDateString()}
              </div>
            </div>

            {needsCheckIn ? (
              <form
                className="mt-4 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  const entry = {
                    id: Date.now(),
                    weekKey: thisWeekKey,
                    createdAt: new Date().toISOString(),
                    ...checkIn
                  };
                  const updated = [...(checkIns || []), entry];
                  setCheckIns(updated);
                  try {
                    localStorage.setItem('weekly_checkins', JSON.stringify(updated));
                  } catch (err) {}
                  setCheckInSaved(true);
                  trackWeeklyCheckInSubmitted();
                  window.setTimeout(() => setCheckInSaved(false), 1500);
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: colors.darkGreen }}>Mood</label>
                    <select
                      className="um-field"
                      value={checkIn.mood}
                      onChange={(e) => setCheckIn({ ...checkIn, mood: e.target.value })}
                    >
                      <option>Great</option>
                      <option>Good</option>
                      <option>Okay</option>
                      <option>Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: colors.darkGreen }}>Energy</label>
                    <select
                      className="um-field"
                      value={checkIn.energy}
                      onChange={(e) => setCheckIn({ ...checkIn, energy: e.target.value })}
                    >
                      <option>High</option>
                      <option>Good</option>
                      <option>Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: colors.darkGreen }}>Soreness</label>
                    <select
                      className="um-field"
                      value={checkIn.soreness}
                      onChange={(e) => setCheckIn({ ...checkIn, soreness: e.target.value })}
                    >
                      <option>None</option>
                      <option>Low</option>
                      <option>Moderate</option>
                      <option>High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: colors.darkGreen }}>Confidence</label>
                    <select
                      className="um-field"
                      value={checkIn.confidence}
                      onChange={(e) => setCheckIn({ ...checkIn, confidence: e.target.value })}
                    >
                      <option>High</option>
                      <option>Good</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: colors.darkGreen }}>Next week focus</label>
                  <input
                    className="um-field"
                    value={checkIn.nextFocus}
                    onChange={(e) => setCheckIn({ ...checkIn, nextFocus: e.target.value })}
                    placeholder="e.g., 3 easy runs + long run Sunday"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: colors.darkGreen }}>Notes</label>
                  <textarea
                    className="um-field"
                    rows={3}
                    value={checkIn.notes}
                    onChange={(e) => setCheckIn({ ...checkIn, notes: e.target.value })}
                    placeholder="Anything you want to remember?"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button type="submit" className="munich-btn munich-btn-primary">
                    Save check-in
                  </button>
                  {checkInSaved && (
                    <span className="text-sm" style={{ color: colors.lightGreen }}>
                      Saved
                    </span>
                  )}
                </div>
              </form>
            ) : (
              <div className="mt-4 text-sm" style={{ color: colors.darkGreen }}>
                Last check-in: {new Date(checkIns[checkIns.length - 1]?.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        <div className="munich-card">
          <div className="munich-card-body">
            <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: colors.black }}>
              <Share2 className="w-5 h-5" style={{ color: colors.lightBlue }} />
              Share your week
            </h3>
            <p className="text-sm mt-1" style={{ color: colors.darkGreen }}>
              Copy a clean weekly recap to send to a friend or coach.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <button type="button" onClick={copyWeeklyShareText} className="munich-btn munich-btn-outline">
                Copy recap
              </button>
              {copyStatus && (
                <span className="text-sm" style={{ color: copyStatus === 'Copied!' ? colors.lightGreen : colors.orange }}>
                  {copyStatus}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={MapPin}
          title="Weekly Miles"
          value={weeklyStats.milesThisWeek.toFixed(1)}
          subtitle={`of ${weeklyStats.targetMiles} target`}
          progress={milesProgress}
          colors={colors}
          activeMetric={activeMetric}
          onActivate={setActiveMetric}
        />
        
        <MetricCard
          icon={Activity}
          title="Workouts"
          value={weeklyStats.workoutsCompleted}
          subtitle={`of ${weeklyStats.targetWorkouts} planned`}
          progress={workoutsProgress}
          colors={colors}
          activeMetric={activeMetric}
          onActivate={setActiveMetric}
        />
        
        <MetricCard
          icon={Clock}
          title="Avg Pace"
          value={weeklyStats.avgPace}
          subtitle="per mile this week"
          colors={colors}
          activeMetric={activeMetric}
          onActivate={setActiveMetric}
        />
        
        <MetricCard
          icon={Target}
          title="Golden Pace"
          value={weeklyStats.goldenPaceHits}
          subtitle="hits this week"
          colors={colors}
          activeMetric={activeMetric}
          onActivate={setActiveMetric}
        />
      </div>

      {/* Achievements */}
      <div className="munich-card">
        <div className="munich-card-body">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: colors.black }}>
              <Sparkles className="w-5 h-5" style={{ color: colors.orange }} />
              Achievements
            </h3>
            <div className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: colors.orange + '15', color: colors.orange }}>
              {achievements.filter(a => a.earned).length}/{achievements.length}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {achievements.map((a) => (
              <div
                key={a.id}
                className="p-3 rounded-lg border"
                style={{
                  borderColor: a.earned ? colors.lightGreen + '55' : colors.gray + '40',
                  backgroundColor: a.earned ? colors.lightGreen + '10' : colors.gray + '10'
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold" style={{ color: colors.black }}>{a.title}</div>
                    <div className="text-xs mt-1" style={{ color: colors.darkGreen }}>{a.description}</div>
                  </div>
                  <div
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: a.earned ? colors.lightGreen : colors.gray,
                      color: colors.white
                    }}
                  >
                    {a.earned ? 'Earned' : 'Locked'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plan Overview Card */}
      {currentPlan && (
        <div className="munich-card">
          <div className="munich-card-body">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-4 mb-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.orange + '20' }}
                  >
                    <Award className="w-6 h-6" style={{ color: colors.orange }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: colors.black }}>
                      {currentPlan.name}
                    </h3>
                    <p style={{ color: colors.darkGreen }}>
                      {currentPlan.phase} Phase • {currentPlan.distance}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span style={{ color: colors.darkGreen }}>Plan Progress</span>
                      <span style={{ color: colors.black }}>
                        {Math.round(((currentPlan.currentWeek - 1) / currentPlan.duration) * 100)}%
                      </span>
                    </div>
                    <div 
                      className="w-full h-2 rounded-full"
                      style={{ backgroundColor: colors.gray + '30' }}
                    >
                      <div 
                        className="h-2 rounded-full transition-all duration-1000"
                        style={{ 
                          backgroundColor: colors.orange,
                          width: `${((currentPlan.currentWeek - 1) / currentPlan.duration) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div style={{ color: colors.darkGreen }}>Weeks Left</div>
                      <div className="font-bold" style={{ color: colors.black }}>
                        {currentPlan.duration - currentPlan.currentWeek + 1}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: colors.darkGreen }}>Target Miles</div>
                      <div className="font-bold" style={{ color: colors.black }}>
                        {currentPlan.weeklyMileage}/week
                      </div>
                    </div>
                    <div>
                      <div style={{ color: colors.darkGreen }}>Race Date</div>
                      <div className="font-bold" style={{ color: colors.black }}>
                        {currentPlan.raceDate || 'Not set'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold mb-2" style={{ color: colors.black }}>
                    This Week's Focus
                  </h4>
                  <p className="text-sm mb-3" style={{ color: colors.darkGreen }}>
                    {currentPlan.weeklyFocus || 'Build aerobic base with consistent mileage'}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold mb-2" style={{ color: colors.black }}>
                    Next Workout
                  </h4>
                  <div 
                    className="p-3 rounded-lg text-sm"
                    style={{ backgroundColor: colors.lightBlue + '10' }}
                  >
                    <div className="font-bold" style={{ color: colors.lightBlue }}>
                      {currentPlan.nextWorkout?.name || 'Easy Run'}
                    </div>
                    <div style={{ color: colors.darkGreen }}>
                      {currentPlan.nextWorkout?.description || '5-6 miles at conversational pace'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activities */}
      <div>
        <h3 className="text-lg font-bold mb-4" style={{ color: colors.black }}>
          Recent Activities
        </h3>
        
        {recentActivities && recentActivities.length > 0 ? (
          <div className="space-y-3">
            {recentActivities.slice(0, 5).map((activity, index) => (
              <div key={index} className="munich-card">
                <div className="munich-card-body">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ 
                          backgroundColor: activity.hitGoldenPace ? colors.lightGreen + '20' : colors.gray + '20'
                        }}
                      >
                        <Activity 
                          className="w-5 h-5" 
                          style={{ 
                            color: activity.hitGoldenPace ? colors.lightGreen : colors.gray
                          }} 
                        />
                      </div>
                      <div>
                        <div className="font-bold" style={{ color: colors.black }}>
                          {activity.name || 'Training Run'}
                        </div>
                        <div className="text-sm" style={{ color: colors.darkGreen }}>
                          {new Date(activity.date).toLocaleDateString()} • {Number(activity.distance || 0).toFixed(1)} mi • {formatTime(activity.pace)} pace
                        </div>
                      </div>
                    </div>
                    
                    {activity.hitGoldenPace && (
                      <div 
                        className="px-2 py-1 rounded-full text-xs font-bold"
                        style={{ 
                          backgroundColor: colors.lightGreen,
                          color: colors.white
                        }}
                      >
                        Golden Pace!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div 
            className="text-center py-8 rounded-lg"
            style={{ backgroundColor: colors.gray + '10' }}
          >
            <Activity className="w-8 h-8 mx-auto mb-2" style={{ color: colors.gray }} />
            <p style={{ color: colors.darkGreen }}>
              No activities logged yet. Start tracking your runs!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressDashboard;
