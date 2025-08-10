// Progress Dashboard Integration
import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Target, TrendingUp, Award, Clock, MapPin, Heart } from 'lucide-react';

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

  useEffect(() => {
    // Calculate weekly progress from activities
    if (recentActivities && recentActivities.length > 0) {
      const thisWeek = recentActivities.filter(activity => {
        const activityDate = new Date(activity.date);
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        return activityDate >= weekStart;
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

  const formatTime = (minutes) => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (current, target) => {
    if (!target) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return colors.lightGreen;
    if (percentage >= 70) return colors.lightBlue;
    if (percentage >= 50) return colors.orange;
    return colors.violet;
  };

  const MetricCard = ({ icon: Icon, title, value, subtitle, progress, target }) => (
    <div 
      className={`munich-card cursor-pointer transition-all ${
        activeMetric === title.toLowerCase() ? 'ring-2' : ''
      }`}
      style={{ 
        borderColor: activeMetric === title.toLowerCase() ? colors.lightBlue : 'transparent'
      }}
      onClick={() => setActiveMetric(title.toLowerCase())}
    >
      <div className="munich-card-body">
        <div className="flex items-center justify-between mb-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.lightBlue + '20' }}
          >
            <Icon className="w-5 h-5" style={{ color: colors.lightBlue }} />
          </div>
          {progress && (
            <div className="text-right">
              <div 
                className="text-xs px-2 py-1 rounded-full"
                style={{ 
                  backgroundColor: getProgressColor(progress) + '20',
                  color: getProgressColor(progress)
                }}
              >
                {Math.round(progress)}%
              </div>
            </div>
          )}
        </div>
        
        <div>
          <div className="text-2xl font-bold mb-1" style={{ color: colors.black }}>
            {value}
          </div>
          <div className="text-sm" style={{ color: colors.darkGreen }}>
            {title}
          </div>
          {subtitle && (
            <div className="text-xs mt-1" style={{ color: colors.gray }}>
              {subtitle}
            </div>
          )}
        </div>

        {progress && (
          <div className="mt-3">
            <div 
              className="w-full h-1.5 rounded-full"
              style={{ backgroundColor: colors.gray + '30' }}
            >
              <div 
                className="h-1.5 rounded-full transition-all duration-500"
                style={{ 
                  backgroundColor: getProgressColor(progress),
                  width: `${progress}%`
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const milesProgress = getProgressPercentage(weeklyStats.milesThisWeek, weeklyStats.targetMiles);
  const workoutsProgress = getProgressPercentage(weeklyStats.workoutsCompleted, weeklyStats.targetWorkouts);

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

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={MapPin}
          title="Weekly Miles"
          value={weeklyStats.milesThisWeek.toFixed(1)}
          subtitle={`of ${weeklyStats.targetMiles} target`}
          progress={milesProgress}
        />
        
        <MetricCard
          icon={Activity}
          title="Workouts"
          value={weeklyStats.workoutsCompleted}
          subtitle={`of ${weeklyStats.targetWorkouts} planned`}
          progress={workoutsProgress}
        />
        
        <MetricCard
          icon={Clock}
          title="Avg Pace"
          value={weeklyStats.avgPace}
          subtitle="per mile this week"
        />
        
        <MetricCard
          icon={Target}
          title="Golden Pace"
          value={weeklyStats.goldenPaceHits}
          subtitle="hits this week"
        />
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
                          {new Date(activity.date).toLocaleDateString()} • {activity.distance} mi • {formatTime(activity.pace)} pace
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
