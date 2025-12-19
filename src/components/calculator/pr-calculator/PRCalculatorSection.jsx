import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calculator } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import PRInputForm from './PRInputForm';
import PRProfileGraph from './PRProfileGraph';
import PRTrainingPacesResults from './PRTrainingPacesResults';
import SkeletonLoader from '../../common/SkeletonLoader';
import { HelpIcon } from '../../common/Tooltip';
import { calculatePRTrainingPaces } from '../../../utils/prCalculator';
import { DEFAULT_DISTANCES } from '../../../data/raceDistances';

const PRCalculatorSection = ({ colors, savedProfileData }) => {
  const { showToast } = useToast();
  const [calculating, setCalculating] = useState(false);
  
  const [prs, setPRs] = useState(() => {
    // Load from saved profile if available
    if (savedProfileData && savedProfileData.prs) {
      return savedProfileData.prs;
    }
    // Initialize with empty values for default distances
    const initial = {};
    DEFAULT_DISTANCES.forEach(dist => {
      initial[dist] = '';
    });
    return initial;
  });
  
  const [goalDistance, setGoalDistance] = useState('5K');
  const [errors, setErrors] = useState({});
  const [trainingPaces, setTrainingPaces] = useState(null);
  
  const handleCalculate = () => {
    // Validate that at least one PR is entered
    const hasAnyPR = Object.values(prs).some(time => time && time.trim());
    
    if (!hasAnyPR) {
      const errorMsg = 'Please enter at least one PR to calculate training paces';
      setErrors({ general: errorMsg });
      showToast(errorMsg, 'warning');
      return;
    }
    
    // Clear general error
    if (errors.general) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.general;
        return newErrors;
      });
    }
    
    // Show loading state
    setCalculating(true);
    
    // Simulate async calculation (for skeleton loader demo, though it's instant)
    setTimeout(() => {
      const result = calculatePRTrainingPaces(prs, goalDistance);
      setTrainingPaces(result);
      setCalculating(false);
      showToast('Training paces calculated successfully!', 'success');
    }, 300);
  };
  
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <div className="um-text-center um-space-y-4 sm:space-y-6">
        {/* Icon/Trophy visual */}
        <div className="inline-block">
          <div className="w-32 h-32 sm:w-40 sm:h-40 um-mx-auto um-relative">
            <div
              className="um-absolute um-inset-0 um-rounded-full border-4 flex um-items-center um-justify-center"
              style={{
                borderColor: colors.lightBlue,
                backgroundColor: `${colors.lightBlue}10`
              }}
            >
              <Trophy className="w-16 um-h-16 sm:w-20 sm:h-20" style={{ color: colors.lightBlue }} />
            </div>
          </div>
        </div>

        <h2 className="um-text-4xl um-sm-text-5xl um-lg-text-6xl um-font-black tracking-tight um-mb-6" style={{ color: colors.black, lineHeight: '1.1' }}>
          PR-Based Training Calculator
        </h2>

        <p className="um-text-xl um-sm-text-2xl um-lg-text-3xl max-w-4xl um-mx-auto um-px-4 leading-relaxed um-font-medium um-mb-8" style={{ color: colors.black, lineHeight: '1.4' }}>
          Use your actual race performances to set training paces. No formulas. No guessing. 
          Just your proven PRs mapped directly to training zones.
        </p>

        {/* Value proposition badges */}
        <div className="um-flex um-flex-wrap um-justify-center um-gap-3 mt-6 um-px-4">
          <div
            className="um-flex um-items-center gap-2 px-3 um-py-2 um-rounded-full border"
            style={{
              borderColor: colors.lightBlue,
              backgroundColor: colors.lightBlue + '10',
              color: colors.black,
            }}
          >
            <div className="w-2 h-2 um-rounded-full" style={{ backgroundColor: colors.lightBlue }} />
            <span className="um-text-sm um-font-medium">Proven Paces</span>
          </div>
          <div
            className="um-flex um-items-center gap-2 px-3 um-py-2 um-rounded-full border"
            style={{
              borderColor: colors.lightGreen,
              backgroundColor: colors.lightGreen + '10',
              color: colors.black,
            }}
          >
            <div className="w-2 h-2 um-rounded-full" style={{ backgroundColor: colors.lightGreen }} />
            <span className="um-text-sm um-font-medium">Multi-Distance</span>
          </div>
          <div
            className="um-flex um-items-center gap-2 px-3 um-py-2 um-rounded-full border"
            style={{
              borderColor: colors.orange,
              backgroundColor: colors.orange + '10',
              color: colors.black,
            }}
          >
            <div className="w-2 h-2 um-rounded-full" style={{ backgroundColor: colors.orange }} />
            <span className="um-text-sm um-font-medium">Simplified</span>
          </div>
        </div>

        <div className="um-mt-10 um-flex um-flex-col um-sm-flex-row um-gap-4 um-justify-center um-px-4">
          <Link
            to="/apply"
            className="munich-btn munich-btn-primary um-cta um-px-10 um-py-5 um-text-xl um-font-bold"
            style={{ textAlign: 'center' }}
            aria-label="Apply for personalized coaching"
          >
            Apply for personalized coaching
          </Link>
          <Link
            to="/coach"
            className="munich-btn munich-btn-outline um-px-10 um-py-5 um-text-xl um-font-bold"
            style={{ textAlign: 'center' }}
            aria-label="Meet the coach"
          >
            Meet the coach
          </Link>
        </div>
      </div>

      {/* Calculator Card */}
      <div className="max-w-4xl um-mx-auto">
        <div className="munich-card um-p-4 um-sm-p-8 space-y-6 um-relative um-z-10">
          <h3 className="um-text-lg um-sm-text-xl um-font-bold flex um-items-center gap-2" style={{ color: colors.black }}>
            <Calculator className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: colors.lightBlue }} />
            <span>Enter Your Personal Records</span>
            <HelpIcon 
              content="Enter your actual race times. The calculator uses these proven paces directly for training zones—no formulas needed."
              colors={colors}
            />
          </h3>

          <PRInputForm
            prs={prs}
            setPRs={setPRs}
            goalDistance={goalDistance}
            setGoalDistance={setGoalDistance}
            colors={colors}
            errors={errors}
            setErrors={setErrors}
          />
          
          {errors.general && (
            <div className="p-3 um-rounded um-border-2" style={{ borderColor: '#ef4444', backgroundColor: '#fef2f2' }}>
              <p className="um-text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <button
            onClick={handleCalculate}
            className="um-w-full munich-btn munich-btn-primary um-py-4 um-text-lg um-font-bold"
            aria-label="Calculate training paces from PRs"
          >
            Calculate Training Paces
          </button>
        </div>
      </div>

      {/* Results Section */}
      {calculating ? (
        <div className="max-w-6xl um-mx-auto space-y-8">
          <SkeletonLoader type="calculator" />
          <SkeletonLoader type="card" />
        </div>
      ) : trainingPaces ? (
        <div className="max-w-6xl um-mx-auto space-y-8">
          {/* PR Profile Graph */}
          <PRProfileGraph prs={prs} colors={colors} />
          
          {/* Training Paces Results */}
          <PRTrainingPacesResults
            trainingPaces={trainingPaces}
            colors={colors}
            goalDistance={goalDistance}
            prs={prs}
          />
        </div>
      ) : null}
    </div>
  );
};

export default PRCalculatorSection;
