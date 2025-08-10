import React from 'react';
import { Clock, Download } from 'lucide-react';

const TrainingPlansSection = ({ 
  colors,
  trainingPlans,
  setSelectedPlan,
  setShowPlanDetails,
  showPlanDetails,
  selectedPlan
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-gray-900">Training Plans</h2>
        <p className="text-xl text-gray-600">Structured programs tailored to your GoldenPace fitness level</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trainingPlans.map((plan, index) => (
          <div key={plan.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="flex items-center space-x-2 text-blue-600">
                  <Clock className="w-4 h-4" />
                  <span className="font-semibold">{plan.duration} weeks</span>
                </div>
              </div>
              <p className="text-gray-600 mb-2">Focus: {plan.phase}</p>
              <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
              {plan.goldenPaceLevel && (
                <div className="munich-alert munich-alert-info mb-4 relative">
                  {/* Geometric accent */}
                  <div className="absolute top-0 right-0 w-3 h-3 geometric-diamond" style={{ 
                    backgroundColor: colors.lightBlue,
                    opacity: 0.6
                  }}></div>
                  <p className="font-medium" style={{ color: colors.black }}>
                    Personalized for GoldenPace {plan.goldenPaceLevel}
                  </p>
                  <p className="mt-1" style={{ 
                    color: colors.lightBlue,
                    fontSize: 'var(--text-xs)'
                  }}>
                    Easy: {plan.trainingPaces?.easy} | Threshold: {plan.trainingPaces?.threshold}
                  </p>
                </div>
              )}
              <div className="flex space-x-3">
                <button 
                  onClick={() => {
                    setSelectedPlan(plan);
                    setShowPlanDetails(true);
                  }}
                  className="munich-btn munich-btn-primary flex-1"
                  aria-label={`Download ${plan.name} training plan`}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Plan
                </button>
                <button 
                  onClick={() => {
                    setSelectedPlan(plan);
                    setShowPlanDetails(true);
                  }}
                  className="munich-btn munich-btn-outline"
                  aria-label={`Preview ${plan.name} training plan details`}
                >
                  Preview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Details Modal */}
      {showPlanDetails && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{selectedPlan.name}</h3>
              <button 
                onClick={() => setShowPlanDetails(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900">Duration</h4>
                <p className="text-gray-600">{selectedPlan.duration} weeks</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900">Focus</h4>
                <p className="text-gray-600">{selectedPlan.phase}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900">Description</h4>
                <p className="text-gray-600">{selectedPlan.description}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900">Weekly Mileage</h4>
                <p className="text-gray-600">{selectedPlan.weeklyMileage} miles</p>
              </div>
              
              {selectedPlan.goldenPaceLevel && selectedPlan.trainingPaces && (
                <div>
                  <h4 className="font-semibold text-gray-900">Training Paces (GoldenPace {selectedPlan.goldenPaceLevel})</h4>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Easy/Long Run</p>
                      <p className="text-lg font-bold text-blue-600">{selectedPlan.trainingPaces.easy} per mile</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Threshold</p>
                      <p className="text-lg font-bold text-green-600">{selectedPlan.trainingPaces.threshold} per mile</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Interval (400m)</p>
                      <p className="text-lg font-bold text-orange-600">{selectedPlan.trainingPaces.interval}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Repetition (400m)</p>
                      <p className="text-lg font-bold text-red-600">{selectedPlan.trainingPaces.repetition}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-900">Workout Types</h4>
                <ul className="list-disc list-inside text-gray-600">
                  {selectedPlan.workouts.map((workout, weekIndex) => (
                    <li key={weekIndex} className="font-medium text-gray-900">Week {weekIndex + 1}:</li>
                  ))}
                </ul>
                <ul className="list-disc list-inside text-gray-600">
                  {selectedPlan.workouts.map((workout, weekIndex) => (
                    <li key={weekIndex}>
                      {workout.days.map((day, dayIndex) => (
                        <div key={dayIndex} className="flex items-start space-x-2">
                          <span className="font-medium text-gray-900">{day.day}:</span>
                          <span>{day.type} - {day.distance}</span>
                          {day.notes && <span className="text-xs text-gray-500"> ({day.notes})</span>}
                        </div>
                      ))}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => {
                  // Generate and download plan
                  let planContent = `Training Plan: ${selectedPlan.name}\n\nDuration: ${selectedPlan.duration} weeks\nFocus: ${selectedPlan.phase}\nWeekly Mileage: ${selectedPlan.weeklyMileage} miles\n\nDescription: ${selectedPlan.description}\n`;
                  
                  if (selectedPlan.goldenPaceLevel && selectedPlan.trainingPaces) {
                    planContent += `\nTRAINING PACES (GoldenPace ${selectedPlan.goldenPaceLevel}):\n`;
                    planContent += `Easy/Long Run: ${selectedPlan.trainingPaces.easy} per mile\n`;
                    planContent += `Threshold: ${selectedPlan.trainingPaces.threshold} per mile\n`;
                    planContent += `Interval (400m): ${selectedPlan.trainingPaces.interval}\n`;
                    planContent += `Repetition (400m): ${selectedPlan.trainingPaces.repetition}\n`;
                  }
                  
                  planContent += `\nWORKOUT SCHEDULE:\n`;
                  selectedPlan.workouts.forEach((workout, weekIndex) => {
                    planContent += `Week ${weekIndex + 1}:\n`;
                    workout.days.forEach((day, dayIndex) => {
                      planContent += `  ${day.day}: ${day.type} - ${day.distance}`;
                      if (day.notes) {
                        planContent += ` (${day.notes})`;
                      }
                      planContent += "\n";
                    });
                    planContent += "\n";
                  });
                  const blob = new Blob([planContent], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${selectedPlan.name.replace(/\s+/g, '_')}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="munich-btn munich-btn-primary flex-1"
                aria-label={`Download ${selectedPlan.name} as text file`}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Plan
              </button>
              <button 
                onClick={() => setShowPlanDetails(false)}
                className="munich-btn munich-btn-outline"
                aria-label="Close training plan details"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingPlansSection;
