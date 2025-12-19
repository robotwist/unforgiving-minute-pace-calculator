import React, { useState } from 'react';
import { Activity, Calendar, Clock, MapPin, Thermometer, Heart, Star } from 'lucide-react';

const TrainingLogForm = ({ 
  colors, 
  showTrainingLogForm, 
  setShowTrainingLogForm,
  userProfile,
  logTrainingSession
}) => {
  const [trainingLogData, setTrainingLogData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    distance: '',
    time: '',
    pace: '',
    effort: '',
    feeling: '',
    location: '',
    weather: '',
    notes: '',
    goldenPace: userProfile?.currentGoldenPace || null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!trainingLogData.type || !trainingLogData.distance || !trainingLogData.time) {
      alert('Please fill in required fields: workout type, distance, and time');
      return;
    }

    // Calculate pace if not provided
    let calculatedPace = trainingLogData.pace;
    if (!calculatedPace && trainingLogData.distance && trainingLogData.time) {
      const distance = parseFloat(trainingLogData.distance);
      const timeInMinutes = parseTimeToMinutes(trainingLogData.time);
      if (distance > 0 && timeInMinutes > 0) {
        const paceInMinutes = timeInMinutes / distance;
        const paceMinutes = Math.floor(paceInMinutes);
        const paceSeconds = Math.round((paceInMinutes - paceMinutes) * 60);
        calculatedPace = `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`;
      }
    }

    const sessionData = {
      ...trainingLogData,
      pace: calculatedPace,
      id: Date.now().toString()
    };

    logTrainingSession(sessionData);
    setShowTrainingLogForm(false);
    
    // Reset form
    setTrainingLogData({
      date: new Date().toISOString().split('T')[0],
      type: '',
      distance: '',
      time: '',
      pace: '',
      effort: '',
      feeling: '',
      location: '',
      weather: '',
      notes: '',
      goldenPace: userProfile?.currentGoldenPace || null
    });
  };

  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) + parseInt(parts[1]) / 60;
    } else if (parts.length === 3) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]) + parseInt(parts[2]) / 60;
    }
    return parseFloat(timeStr) || 0;
  };

  const workoutTypes = [
    'Easy Run', 'Tempo Run', 'Interval Training', 'Long Run', 'Recovery Run',
    'Race', 'Cross Training', 'Strength Training', 'Fartlek', 'Hill Training'
  ];

  const effortLevels = ['Easy', 'Moderate', 'Comfortably Hard', 'Hard', 'Very Hard', 'Max Effort'];
  const feelingOptions = ['Excellent', 'Good', 'Average', 'Tired', 'Struggled'];

  if (!showTrainingLogForm) return null;

  return (
    <div className="um-modal-overlay um-modal-overlay--dim">
      <div className="munich-card um-modal-panel um-modal-panel--2xl">
        <div className="munich-card-header um-relative um-overflow-hidden" style={{ 
          backgroundColor: colors.lightBlue 
        }}>
          <div className="progressive-melange um-melange-overlay um-melange-overlay--20"></div>
          <div className="um-absolute top-0 right-0 w-6 h-6 geometric-diamond" style={{ 
            backgroundColor: colors.orange,
            opacity: 0.8
          }}></div>
          
          <div className="um-relative um-z-10">
            <h3 className="um-font-bold flex um-items-center" style={{ 
              color: colors.white,
              fontSize: 'var(--text-2xl)'
            }}>
              <Activity className="w-6 h-6 mr-3" />
              Log Training Session
            </h3>
            <p className="mt-2" style={{ 
              color: colors.white,
              opacity: 0.9,
              fontSize: 'var(--text-base)'
            }}>
              Track your training to monitor progress and build your running history
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="munich-card-body space-y-6">
          {/* Essential Training Data */}
          <div className="um-grid um-grid-cols-1 um-md-grid-cols-2 um-gap-4">
            <div>
              <label className="block um-font-medium um-mb-2" style={{ 
                color: colors.black,
                fontSize: 'var(--text-sm)'
              }}>
                <Calendar className="w-4 h-4 inline mr-2" />
                Date *
              </label>
              <input
                type="date"
                value={trainingLogData.date}
                onChange={(e) => setTrainingLogData({...trainingLogData, date: e.target.value})}
                className="um-field"
                style={{ 
                  borderColor: colors.gray,
                  fontSize: 'var(--text-base)'
                }}
                required
                aria-label="Training session date"
              />
            </div>

            <div>
              <label className="block um-font-medium um-mb-2" style={{ 
                color: colors.black,
                fontSize: 'var(--text-sm)'
              }}>
                <Activity className="w-4 h-4 inline mr-2" />
                Workout Type *
              </label>
              <select
                value={trainingLogData.type}
                onChange={(e) => setTrainingLogData({...trainingLogData, type: e.target.value})}
                className="um-field"
                style={{ 
                  borderColor: colors.gray,
                  fontSize: 'var(--text-base)'
                }}
                required
                aria-label="Select workout type"
              >
                <option value="">Select Workout Type</option>
                {workoutTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Distance and Time */}
          <div className="um-grid um-grid-cols-1 um-md-grid-cols-3 um-gap-4">
            <div>
              <label className="block um-font-medium um-mb-2" style={{ 
                color: colors.black,
                fontSize: 'var(--text-sm)'
              }}>
                Distance * (miles)
              </label>
              <input
                type="number"
                step="0.1"
                value={trainingLogData.distance}
                onChange={(e) => setTrainingLogData({...trainingLogData, distance: e.target.value})}
                placeholder="e.g., 6.2"
                className="um-field"
                style={{ 
                  borderColor: colors.gray,
                  fontSize: 'var(--text-base)'
                }}
                required
                aria-label="Distance covered in miles"
              />
            </div>

            <div>
              <label className="block um-font-medium um-mb-2" style={{ 
                color: colors.black,
                fontSize: 'var(--text-sm)'
              }}>
                <Clock className="w-4 h-4 inline mr-2" />
                Time * (MM:SS or HH:MM:SS)
              </label>
              <input
                type="text"
                value={trainingLogData.time}
                onChange={(e) => setTrainingLogData({...trainingLogData, time: e.target.value})}
                placeholder="e.g., 45:30"
                className="um-field"
                style={{ 
                  borderColor: colors.gray,
                  fontSize: 'var(--text-base)'
                }}
                required
                aria-label="Total workout time"
              />
            </div>

            <div>
              <label className="block um-font-medium um-mb-2" style={{ 
                color: colors.black,
                fontSize: 'var(--text-sm)'
              }}>
                Pace (per mile)
              </label>
              <input
                type="text"
                value={trainingLogData.pace}
                onChange={(e) => setTrainingLogData({...trainingLogData, pace: e.target.value})}
                placeholder="Auto-calculated"
                className="um-field"
                style={{ 
                  borderColor: colors.gray,
                  fontSize: 'var(--text-base)',
                  backgroundColor: colors.lightGray
                }}
                aria-label="Average pace per mile"
              />
            </div>
          </div>

          {/* Subjective Data */}
          <div className="um-grid um-grid-cols-1 um-md-grid-cols-2 um-gap-4">
            <div>
              <label className="block um-font-medium um-mb-2" style={{ 
                color: colors.black,
                fontSize: 'var(--text-sm)'
              }}>
                <Heart className="w-4 h-4 inline mr-2" />
                Effort Level
              </label>
              <select
                value={trainingLogData.effort}
                onChange={(e) => setTrainingLogData({...trainingLogData, effort: e.target.value})}
                className="um-field"
                style={{ 
                  borderColor: colors.gray,
                  fontSize: 'var(--text-base)'
                }}
                aria-label="Perceived effort level"
              >
                <option value="">Select Effort</option>
                {effortLevels.map(effort => (
                  <option key={effort} value={effort}>{effort}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block um-font-medium um-mb-2" style={{ 
                color: colors.black,
                fontSize: 'var(--text-sm)'
              }}>
                <Star className="w-4 h-4 inline mr-2" />
                How You Felt
              </label>
              <select
                value={trainingLogData.feeling}
                onChange={(e) => setTrainingLogData({...trainingLogData, feeling: e.target.value})}
                className="um-field"
                style={{ 
                  borderColor: colors.gray,
                  fontSize: 'var(--text-base)'
                }}
                aria-label="Overall feeling during workout"
              >
                <option value="">How did you feel?</option>
                {feelingOptions.map(feeling => (
                  <option key={feeling} value={feeling}>{feeling}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Environmental Data */}
          <div className="um-grid um-grid-cols-1 um-md-grid-cols-2 um-gap-4">
            <div>
              <label className="block um-font-medium um-mb-2" style={{ 
                color: colors.black,
                fontSize: 'var(--text-sm)'
              }}>
                <MapPin className="w-4 h-4 inline mr-2" />
                Location
              </label>
              <input
                type="text"
                value={trainingLogData.location}
                onChange={(e) => setTrainingLogData({...trainingLogData, location: e.target.value})}
                placeholder="e.g., City Park, Gym, Track"
                className="um-field"
                style={{ 
                  borderColor: colors.gray,
                  fontSize: 'var(--text-base)'
                }}
                aria-label="Workout location"
              />
            </div>

            <div>
              <label className="block um-font-medium um-mb-2" style={{ 
                color: colors.black,
                fontSize: 'var(--text-sm)'
              }}>
                <Thermometer className="w-4 h-4 inline mr-2" />
                Weather
              </label>
              <input
                type="text"
                value={trainingLogData.weather}
                onChange={(e) => setTrainingLogData({...trainingLogData, weather: e.target.value})}
                placeholder="e.g., Sunny 70°F, Rainy, Hot and humid"
                className="um-field"
                style={{ 
                  borderColor: colors.gray,
                  fontSize: 'var(--text-base)'
                }}
                aria-label="Weather conditions"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block um-font-medium um-mb-2" style={{ 
              color: colors.black,
              fontSize: 'var(--text-sm)'
            }}>
              Notes
            </label>
            <textarea
              value={trainingLogData.notes}
              onChange={(e) => setTrainingLogData({...trainingLogData, notes: e.target.value})}
              placeholder="Any additional notes about the session..."
              rows={3}
              className="um-field um-textarea"
              style={{ 
                borderColor: colors.gray,
                fontSize: 'var(--text-base)'
              }}
              aria-label="Additional notes about the workout"
            />
          </div>

          {/* Form Actions (sticky footer for visibility) */}
          <div className="sticky bottom-0 bg-white pt-4">
            <div className="um-flex um-flex-col um-sm-flex-row um-gap-3 um-justify-end pt-4 um-border-t" style={{ borderColor: colors.gray }}>
              <button
                type="submit"
                className="munich-btn munich-btn-primary flex-1 um-sm-flex-none"
                style={{ 
                  backgroundColor: colors.lightBlue,
                  color: colors.white
                }}
                aria-label="Save training session to log"
              >
                <Activity className="w-4 h-4 mr-2" />
                Log Session
              </button>
              
              <button
                type="button"
                onClick={() => setShowTrainingLogForm(false)}
                className="munich-btn munich-btn-outline"
                aria-label="Cancel and close training log form"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainingLogForm;
