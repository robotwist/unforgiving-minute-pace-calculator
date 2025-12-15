import React from 'react';
import { User, Activity, TrendingUp, Trophy, Calendar, CheckCircle, Clock } from 'lucide-react';

const ProfileDashboard = ({ 
  colors,
  userProfile,
  savedProfileData,
  trainingHistory = [],
  personalBests = {},
  trainingPlansCompleted = [],
  goldenPace,
  setRaceTime,
  setRaceDistance,
  setActiveTab,
  setShowProfileDashboard,
  setShowTrainingLogForm,
  generateGoldenPaceProgression,
  updatePersonalBest,
  addTrainingSession
}) => {
  const displayProfile = savedProfileData || userProfile;

  const addDemoData = () => {
    // Add demo data to showcase the full profile functionality
    updatePersonalBest('5K', '24:30');
    updatePersonalBest('10K', '51:45');
    updatePersonalBest('Half Marathon', '1:54:20');
    
    addTrainingSession({
      type: 'Tempo Run',
      distance: '6 miles',
      time: '42:00',
      feeling: 'Strong',
      effort: 'Comfortably Hard',
      location: 'City Park Loop',
      weather: 'Cool, 60°F',
      notes: 'Felt great today, negative split the last 2 miles',
      goldenPace: goldenPace,
      date: new Date().toISOString().split('T')[0]
    });
    
    addTrainingSession({
      type: 'Long Run',
      distance: '12 miles',
      time: '1:24:00',
      feeling: 'Good',
      effort: 'Easy',
      location: 'River Trail',
      weather: 'Sunny, 70°F',
      notes: 'Perfect weather for a long run, maintained steady effort',
      goldenPace: goldenPace,
      date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0] // 3 days ago
    });
  };

  return (
    <div className="space-y-6">
      <div className="munich-card">
        <div className="munich-card-header relative overflow-hidden" style={{ 
          backgroundColor: colors.lightGreen 
        }}>
          {/* Progressive Melange Background */}
          <div className="absolute inset-0 progressive-melange opacity-20"></div>
          
          {/* Geometric corner accent */}
          <div className="absolute top-0 right-0 w-6 h-6 geometric-diamond" style={{ 
            backgroundColor: colors.violet,
            opacity: 0.8
          }}></div>
          
          <div className="relative z-10">
            <h3 className="font-bold flex items-center" style={{ 
              color: colors.white,
              fontSize: 'var(--text-2xl)'
            }}>
              <User className="w-6 h-6 mr-3" />
              Welcome, {displayProfile?.name}!
            </h3>
            <p className="mt-2" style={{ 
              color: colors.white,
              opacity: 0.9,
              fontSize: 'var(--text-base)'
            }}>Your profile has been created successfully</p>
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Personal Info Card */}
            <div className="munich-card relative overflow-hidden">
              <div className="absolute inset-0 progressive-melange opacity-3"></div>
              <div className="absolute top-0 right-0 w-4 h-4 sm:w-6 sm:h-6 geometric-diamond geometric-float-counterclockwise" style={{ 
                backgroundColor: colors.lightBlue,
                opacity: 0.3
              }}></div>
              
              <div className="munich-card-body relative z-10">
                <h4 className="font-medium mb-4" style={{ 
                  color: colors.black,
                  fontSize: 'var(--text-lg)'
                }}>Personal Info</h4>
                <p className="mb-2" style={{ 
                  color: colors.black,
                  fontSize: 'var(--text-sm)'
                }}>Name: {displayProfile?.name}</p>
                <p className="mb-2" style={{ 
                  color: colors.black,
                  fontSize: 'var(--text-sm)'
                }}>Email: {displayProfile?.email}</p>
                <p className="mb-2" style={{ 
                  color: colors.black,
                  fontSize: 'var(--text-sm)'
                }}>Experience: {displayProfile?.experience}</p>
                <p style={{ 
                  color: colors.black,
                  fontSize: 'var(--text-sm)'
                }}>Member since: {displayProfile?.created_date || new Date().toISOString().split('T')[0]}</p>
              </div>
            </div>
            
            {/* Running Goals Card */}
            <div className="munich-card relative overflow-hidden">
              <div className="absolute inset-0 progressive-melange opacity-3"></div>
              <div className="absolute top-0 right-0 w-4 h-4 sm:w-6 sm:h-6 geometric-octagon geometric-float-counterclockwise" style={{ 
                backgroundColor: colors.lightGreen,
                opacity: 0.3,
                animationDelay: '1s'
              }}></div>
              
              <div className="munich-card-body relative z-10">
                <h4 className="font-medium mb-4" style={{ 
                  color: colors.black,
                  fontSize: 'var(--text-lg)'
                }}>Running Goals</h4>
                <p className="mb-2" style={{ 
                  color: colors.black,
                  fontSize: 'var(--text-sm)'
                }}>Goal Race: {displayProfile?.goalRaceDistance}</p>
                <p className="mb-2" style={{ 
                  color: colors.black,
                  fontSize: 'var(--text-sm)'
                }}>Goal Time: {displayProfile?.goalRaceTime || 'Not set'}</p>
                <p style={{ 
                  color: colors.black,
                  fontSize: 'var(--text-sm)'
                }}>Weekly Mileage: {displayProfile?.weekly_mileage || displayProfile?.weeklyMileage || 'Not set'} miles</p>
              </div>
            </div>
            
            {/* Optimal Progress Pace Progress Card */}
            <div className="munich-card relative overflow-hidden">
              <div className="absolute inset-0 progressive-melange opacity-3"></div>
              <div className="absolute top-0 right-0 w-4 h-4 sm:w-6 sm:h-6 geometric-square geometric-float-counterclockwise" style={{ 
                backgroundColor: colors.violet,
                opacity: 0.3,
                animationDelay: '2s'
              }}></div>
              
              <div className="munich-card-body relative z-10">
                <h4 className="font-medium mb-4 flex items-center" style={{ 
                  color: colors.black,
                  fontSize: 'var(--text-lg)'
                }}>
                  <Activity className="w-4 h-4 mr-2" />
                  Optimal Progress Pace Progress
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span style={{ 
                      color: colors.black,
                      fontSize: 'var(--text-sm)'
                    }}>Current Optimal Progress Pace:</span>
                    {displayProfile?.currentGoldenPace || goldenPace ? (
                      <span className="font-bold" style={{ 
                        color: colors.violet,
                        fontSize: 'var(--text-lg)'
                      }}>
                        {displayProfile?.currentGoldenPace || goldenPace}
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span style={{ 
                          color: colors.darkGray,
                          fontSize: 'var(--text-sm)'
                        }}>Not calculated</span>
                        {displayProfile?.goalRaceTime && displayProfile?.goalRaceDistance && (
                          <button
                            onClick={() => {
                              setRaceTime(displayProfile.goalRaceTime);
                              setRaceDistance(displayProfile.goalRaceDistance);
                              setActiveTab('calculator');
                            }}
                            className="px-2 py-1 text-xs rounded-md hover:opacity-80 transition-opacity"
                            style={{ 
                              backgroundColor: colors.lightBlue,
                              color: colors.white
                            }}
                            title="Calculate using your goal race"
                          >
                            Calculate
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {displayProfile?.projectedGoldenPace && (
                    <div className="flex justify-between items-center">
                      <span style={{ 
                        color: colors.black,
                        fontSize: 'var(--text-sm)'
                      }}>6-Week Projection:</span>
                      <span className="font-bold" style={{ 
                        color: colors.lightGreen,
                        fontSize: 'var(--text-lg)'
                      }}>
                        {displayProfile.projectedGoldenPace}
                      </span>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${colors.gray}` }}>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: colors.black }}>Training Sessions: {trainingHistory.length}</span>
                      <span style={{ color: colors.black }}>Personal Bests: {Object.keys(personalBests).length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Optimal Progress Pace Progression Chart */}
          {displayProfile?.currentGoldenPace && displayProfile?.trainingStartDate && generateGoldenPaceProgression && (
            <div className="mt-8">
              <div className="munich-card relative overflow-hidden">
                <div className="absolute inset-0 progressive-melange opacity-3"></div>
                <div className="absolute top-0 right-0 w-6 h-6 geometric-diamond" style={{ 
                  backgroundColor: colors.lightBlue,
                  opacity: 0.4
                }}></div>
                
                <div className="munich-card-body relative z-10">
                  <h4 className="font-medium mb-6 flex items-center" style={{ 
                    color: colors.black,
                    fontSize: 'var(--text-xl)'
                  }}>
                    <TrendingUp className="w-5 h-5 mr-2" style={{ color: colors.lightBlue }} />
                    Optimal Progress Pace Progression Forecast
                  </h4>
                  
                  <div className="mb-4 text-sm" style={{ color: colors.darkGreen }}>
                    <p>Projected improvement: +1 VDOT point every 6 weeks (average training consistency)</p>
                    <p>Based on {displayProfile.weekly_mileage || 20} miles/week at your experience level</p>
                  </div>
                  
                  {/* Simple ASCII-style progression chart */}
                  <div className="bg-white p-6 rounded-lg border" style={{ borderColor: colors.gray }}>
                    <div className="space-y-2">
                      {(() => {
                        const progression = generateGoldenPaceProgression(
                          displayProfile.currentGoldenPace, 
                          displayProfile.trainingStartDate, 
                          displayProfile.weekly_mileage || 20,
                          26 // 6 months
                        );
                        
                        return progression.filter((_, index) => index % 2 === 0).slice(0, 7).map((point, index) => {
                          const isCurrentWeek = point.week === 0;
                          const barWidth = Math.min(100, ((point.goldenPace - displayProfile.currentGoldenPace) / 6) * 100 + 20);
                          
                          return (
                            <div key={point.week} className="flex items-center space-x-3">
                              <div className="w-20 text-xs font-medium" style={{ color: colors.black }}>
                                {point.week === 0 ? 'Current' : `Week ${point.week}`}
                              </div>
                              <div className="flex-1 relative">
                                <div className="h-6 rounded" style={{ 
                                  backgroundColor: colors.lightGray,
                                  border: `1px solid ${colors.gray}`
                                }}>
                                  <div 
                                    className="h-full rounded transition-all duration-500"
                                    style={{ 
                                      width: `${barWidth}%`,
                                      backgroundColor: isCurrentWeek ? colors.violet : colors.lightBlue,
                                      backgroundImage: isCurrentWeek ? 'linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)' : 'none'
                                    }}
                                  />
                                </div>
                                <div className="absolute right-2 top-0 h-6 flex items-center">
                                  <span className="text-xs font-bold" style={{ 
                                    color: colors.black,
                                    textShadow: '0 0 3px white'
                                  }}>
                                    {point.goldenPace}
                                  </span>
                                </div>
                              </div>
                              <div className="w-16 text-xs" style={{ color: colors.darkGreen }}>
                                {point.week === 0 ? 'Current' : 
                                  point.goldenPace > displayProfile.currentGoldenPace ? 
                                  `+${(point.goldenPace - displayProfile.currentGoldenPace).toFixed(1)}` : '---'}
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                    
                    <div className="mt-4 pt-4 text-xs" style={{ 
                      borderTop: `1px solid ${colors.gray}`,
                      color: colors.darkGreen
                    }}>
                      <p>💡 <strong>Pro Tip:</strong> Consistency is key! Maintain your weekly mileage and training intensity for steady progression.</p>
                      <p>📈 Your projected Optimal Progress Pace in 6 months: <strong>{displayProfile.projectedGoldenPace || 'N/A'}</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Training Data Section */}
          <div className="mt-8 space-y-6">
            {/* Personal Bests Section */}
            {Object.keys(personalBests).length > 0 && (
              <div className="munich-card relative overflow-hidden">
                <div className="absolute inset-0 progressive-melange opacity-3"></div>
                <div className="absolute top-0 right-0 w-6 h-6 geometric-diamond" style={{ 
                  backgroundColor: colors.orange,
                  opacity: 0.4
                }}></div>
                
                <div className="munich-card-body relative z-10">
                  <h4 className="font-medium mb-4 flex items-center" style={{ 
                    color: colors.black,
                    fontSize: 'var(--text-lg)'
                  }}>
                    <Trophy className="w-5 h-5 mr-2" style={{ color: colors.orange }} />
                    Personal Bests
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(personalBests).map(([distance, time]) => (
                      <div key={distance} className="text-center p-3 rounded" style={{ 
                        backgroundColor: colors.lightGray,
                        border: `1px solid ${colors.gray}`
                      }}>
                        <div className="font-medium" style={{ 
                          color: colors.black,
                          fontSize: 'var(--text-sm)'
                        }}>{distance}</div>
                        <div className="font-bold" style={{ 
                          color: colors.orange,
                          fontSize: 'var(--text-lg)'
                        }}>{time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recent Training History */}
            {trainingHistory.length > 0 && (
              <div className="munich-card relative overflow-hidden">
                <div className="absolute inset-0 progressive-melange opacity-3"></div>
                <div className="absolute top-0 right-0 w-6 h-6 geometric-octagon" style={{ 
                  backgroundColor: colors.lightBlue,
                  opacity: 0.4
                }}></div>
                
                <div className="munich-card-body relative z-10">
                  <h4 className="font-medium mb-4 flex items-center" style={{ 
                    color: colors.black,
                    fontSize: 'var(--text-lg)'
                  }}>
                    <Calendar className="w-5 h-5 mr-2" style={{ color: colors.lightBlue }} />
                    Recent Training History
                  </h4>
                  <div className="space-y-3">
                    {trainingHistory.slice(-5).reverse().map((session, index) => (
                      <div key={index} className="p-4 rounded" style={{ 
                        backgroundColor: colors.lightGray,
                        border: `1px solid ${colors.gray}`
                      }}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium" style={{ 
                            color: colors.black,
                            fontSize: 'var(--text-sm)'
                          }}>{session.type}</span>
                          <span style={{ 
                            color: colors.gray,
                            fontSize: 'var(--text-xs)'
                          }}>{session.date}</span>
                        </div>
                        {session.distance && (
                          <div style={{ 
                            color: colors.black,
                            fontSize: 'var(--text-sm)'
                          }}>
                            Distance: {session.distance} • Time: {session.time}
                          </div>
                        )}
                        {(session.feeling || session.effort) && (
                          <div style={{ 
                            color: colors.lightBlue,
                            fontSize: 'var(--text-sm)'
                          }}>
                            Felt: {session.feeling} • Effort: {session.effort}
                          </div>
                        )}
                        {session.location && (
                          <div style={{ 
                            color: colors.black,
                            fontSize: 'var(--text-xs)',
                            opacity: 0.8
                          }}>
                            {session.location}
                            {session.weather && ` • ${session.weather}`}
                          </div>
                        )}
                        {session.goldenPace && (
                          <div style={{ 
                            color: colors.orange,
                            fontSize: 'var(--text-sm)',
                            fontWeight: '500'
                          }}>
                            Optimal Progress Pace: {session.goldenPace}
                          </div>
                        )}
                        {session.notes && (
                          <div className="mt-2" style={{ 
                            color: colors.gray,
                            fontSize: 'var(--text-xs)',
                            fontStyle: 'italic'
                          }}>
                            "{session.notes}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Completed Training Plans */}
            {trainingPlansCompleted.length > 0 && (
              <div className="munich-card relative overflow-hidden">
                <div className="absolute inset-0 progressive-melange opacity-3"></div>
                <div className="absolute top-0 right-0 w-6 h-6 geometric-square" style={{ 
                  backgroundColor: colors.violet,
                  opacity: 0.4
                }}></div>
                
                <div className="munich-card-body relative z-10">
                  <h4 className="font-medium mb-4 flex items-center" style={{ 
                    color: colors.black,
                    fontSize: 'var(--text-lg)'
                  }}>
                    <CheckCircle className="w-5 h-5 mr-2" style={{ color: colors.violet }} />
                    Completed Training Plans
                  </h4>
                  <div className="space-y-2">
                    {trainingPlansCompleted.map((plan, index) => (
                      <div key={index} className="flex justify-between items-center p-3 rounded" style={{ 
                        backgroundColor: colors.lightGray,
                        border: `1px solid ${colors.gray}`
                      }}>
                        <span style={{ 
                          color: colors.black,
                          fontSize: 'var(--text-sm)'
                        }}>{plan.name}</span>
                        <span style={{ 
                          color: colors.gray,
                          fontSize: 'var(--text-xs)'
                        }}>{plan.completedDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => {
                // Transfer profile data to calculator
                if (displayProfile?.goalRaceTime) {
                  setRaceTime(displayProfile.goalRaceTime);
                }
                if (displayProfile?.goalRaceDistance) {
                  setRaceDistance(displayProfile.goalRaceDistance);
                }
                setActiveTab('calculator');
              }}
              className="munich-btn munich-btn-primary relative"
              aria-label="Go to pace calculator with your goal race"
            >
              Calculate GoldenPace
              <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 geometric-diamond" style={{ 
                backgroundColor: colors.lightGreen
              }}></div>
            </button>
            
            <button
              onClick={() => setActiveTab('plans')}
              className="munich-btn munich-btn-secondary relative"
              aria-label="View training plans"
            >
              Get Training Plans
              <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 geometric-octagon" style={{ 
                backgroundColor: colors.violet
              }}></div>
            </button>
            
            <button
              onClick={() => setShowProfileDashboard(false)}
              className="munich-btn munich-btn-outline"
              aria-label="Close profile dashboard"
            >
              Edit Profile
            </button>
            
            <button
              onClick={() => setShowTrainingLogForm(true)}
              className="munich-btn munich-btn-outline relative"
              style={{ color: colors.lightBlue, borderColor: colors.lightBlue }}
            >
              Log Training Session
              <div className="absolute top-0 right-0 w-3 h-3 geometric-diamond" style={{ 
                backgroundColor: colors.lightBlue,
                opacity: 0.3
              }}></div>
            </button>
            
            <button
              onClick={addDemoData}
              className="munich-btn munich-btn-outline relative"
              style={{ color: colors.orange, borderColor: colors.orange }}
            >
              <Clock className="w-4 h-4 mr-2" />
              Add Demo Data
              <div className="absolute top-0 right-0 w-3 h-3 geometric-square" style={{ 
                backgroundColor: colors.orange,
                opacity: 0.3
              }}></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
