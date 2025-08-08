import React from 'react';
import { Calculator, Target, TrendingUp } from 'lucide-react';
import { Button, Card, Input, Select } from '../common';
import { Section, Container } from '../layout';
import { MUNICH_COLORS, DISTANCE_OPTIONS } from '../../constants';
import { useGoldenPaceCalculator } from '../../hooks';

interface CalculatorProps {
  raceTime: string;
  setRaceTime: (time: string) => void;
  raceDistance: string;
  setRaceDistance: (distance: string) => void;
  goldenPace: number | null;
  trainingPaces: any;
  onCalculateGoldenPaces: () => void;
  onSaveProfile: () => void;
  showSaveForm: boolean;
  onToggleSaveForm: () => void;
}

export const CalculatorSection = ({
  raceTime,
  setRaceTime,
  raceDistance,
  setRaceDistance,
  goldenPace,
  trainingPaces,
  onCalculateGoldenPaces,
  onSaveProfile,
  showSaveForm,
  onToggleSaveForm
}) => {
  const { 
    calculatePaces,
    isValid
  } = useGoldenPaceCalculator();

  // Helper functions for validation and display
  const isValidTimeFormat = (time: string) => {
    const timePattern = /^(\d{1,2}):([0-5]?\d)(?::([0-5]?\d))?$/;
    return timePattern.test(time);
  };

  const formatTimeDisplay = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Section title="GoldenPace Calculator" variant="featured">
      <Container>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Calculator 
                className="w-6 h-6 mr-3" 
                style={{ color: MUNICH_COLORS.lightBlue }}
              />
              <h3 
                className="text-xl font-bold"
                style={{ color: MUNICH_COLORS.black }}
              >
                Enter Your Recent Race Performance
              </h3>
            </div>

            <div className="space-y-4">
              <Select
                label="Race Distance"
                value={raceDistance}
                onChange={setRaceDistance}
                options={DISTANCE_OPTIONS.map(distance => ({
                  value: distance,
                  label: distance
                }))}
                className="munich-input-group"
                error=""
              />

              <Input
                label="Race Time"
                placeholder="MM:SS or HH:MM:SS"
                value={raceTime}
                onChange={setRaceTime}
                className="munich-input-group"
                error={raceTime && !isValidTimeFormat(raceTime) ? 'Please enter time as MM:SS or HH:MM:SS' : undefined}
              />

              <Button
                onClick={calculatePaces}
                disabled={!raceTime || !raceDistance || !isValidTimeFormat(raceTime)}
                className="w-full"
                variant="primary"
                size="lg"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calculate GoldenPace & Training Zones
              </Button>
            </div>
          </Card>

          {/* Results Section */}
          <Card className="p-6">
            {goldenPace ? (
              <div>
                <div className="flex items-center mb-4">
                  <Target 
                    className="w-6 h-6 mr-3" 
                    style={{ color: MUNICH_COLORS.orange }}
                  />
                  <h3 
                    className="text-xl font-bold"
                    style={{ color: MUNICH_COLORS.black }}
                  >
                    Your GoldenPace Score
                  </h3>
                </div>

                <div 
                  className="text-center p-6 rounded-lg mb-6"
                  style={{ 
                    backgroundColor: MUNICH_COLORS.lightBlue + '20',
                    border: `2px solid ${MUNICH_COLORS.lightBlue}`
                  }}
                >
                  <div 
                    className="text-4xl font-bold mb-2"
                    style={{ color: MUNICH_COLORS.lightBlue }}
                  >
                    {goldenPace}
                  </div>
                  <p style={{ color: MUNICH_COLORS.darkGreen }}>
                    Your personalized fitness score
                  </p>
                </div>

                {trainingPaces && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div 
                      className="p-3 rounded text-center"
                      style={{ backgroundColor: MUNICH_COLORS.lightGreen }}
                    >
                      <div className="font-semibold text-sm mb-1">Easy Run</div>
                      <div 
                        className="text-lg font-bold"
                        style={{ color: MUNICH_COLORS.darkGreen }}
                      >
                        {trainingPaces.easy}/mile
                      </div>
                    </div>
                    <div 
                      className="p-3 rounded text-center"
                      style={{ backgroundColor: MUNICH_COLORS.yellow + '30' }}
                    >
                      <div className="font-semibold text-sm mb-1">Threshold</div>
                      <div 
                        className="text-lg font-bold"
                        style={{ color: MUNICH_COLORS.orange }}
                      >
                        {trainingPaces.threshold}/mile
                      </div>
                    </div>
                    <div 
                      className="p-3 rounded text-center"
                      style={{ backgroundColor: MUNICH_COLORS.orange + '30' }}
                    >
                      <div className="font-semibold text-sm mb-1">Interval</div>
                      <div 
                        className="text-lg font-bold"
                        style={{ color: MUNICH_COLORS.orange }}
                      >
                        {trainingPaces.interval}/400m
                      </div>
                    </div>
                    <div 
                      className="p-3 rounded text-center"
                      style={{ backgroundColor: MUNICH_COLORS.lightBlue + '30' }}
                    >
                      <div className="font-semibold text-sm mb-1">Repetition</div>
                      <div 
                        className="text-lg font-bold"
                        style={{ color: MUNICH_COLORS.lightBlue }}
                      >
                        {trainingPaces.repetition}/400m
                      </div>
                    </div>
                  </div>
                )}

                {/* Remove race predictions section for now */}

                <Button
                  onClick={onToggleSaveForm}
                  variant="secondary"
                  className="w-full"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {showSaveForm ? 'Hide' : 'Save Results & Create Profile'}
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calculator 
                  className="w-16 h-16 mx-auto mb-4 opacity-50"
                  style={{ color: MUNICH_COLORS.gray }}
                />
                <p style={{ color: MUNICH_COLORS.darkGreen }}>
                  Enter your race time and distance to calculate your GoldenPace and training zones
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Enhanced explanation section */}
        <Card className="mt-8 p-6">
          <h3 
            className="text-xl font-bold mb-4"
            style={{ color: MUNICH_COLORS.black }}
          >
            What is GoldenPace?
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 
                className="font-semibold mb-2"
                style={{ color: MUNICH_COLORS.darkGreen }}
              >
                Beyond Traditional VDOT
              </h4>
              <p className="text-sm mb-4" style={{ color: MUNICH_COLORS.black }}>
                GoldenPace improves upon Jack Daniels' VDOT system by incorporating individual race performance 
                patterns and physiological variations. While VDOT provides a foundation, GoldenPace personalizes 
                your training zones based on your actual race results.
              </p>
            </div>
            <div>
              <h4 
                className="font-semibold mb-2"
                style={{ color: MUNICH_COLORS.darkGreen }}
              >
                Precision Training Zones
              </h4>
              <p className="text-sm" style={{ color: MUNICH_COLORS.black }}>
                Each training zone is calibrated to your specific fitness level and race goals. Easy runs 
                build aerobic base, threshold runs improve lactate clearance, intervals boost VO2max, 
                and repetitions develop speed and form.
              </p>
            </div>
          </div>
        </Card>
      </Container>
    </Section>
  );
};
