import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClipboardList, ShieldCheck, Sparkles } from 'lucide-react';
import colors, { getAdaptiveColors } from '../data/colors';
import useScrollTheme from '../hooks/useScrollTheme';
import { useToast } from '../context/ToastContext';
import { useFormValidation } from '../hooks/useFormValidation';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import FormField from '../components/common/FormField';
import logger from '../utils/logger';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  primaryEvent: '',
  goal: '',
  experience: '',
  currentWeeklyMileage: '',
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
  availability: '',
  referrer: '',
  notes: '',
  consent: true,
};

export default function Apply() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isDark = localStorage.getItem('dark_mode_enabled') === 'true';
  const uiColors = useMemo(() => getAdaptiveColors(isDark), [isDark]);
  const { getThemeClass } = useScrollTheme();

  // Form validation with real-time feedback
  const {
    values: form,
    errors,
    isValid,
    handleChange,
    handleBlur,
    setFieldValue
  } = useFormValidation(initialForm, {
    name: { required: true, message: 'Name is required' },
    email: {
      required: true,
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Please enter a valid email address'
    },
    phone: {
      validate: (v) => !v || /^[\d\s\-+()]+$/.test(v),
      message: 'Please enter a valid phone number'
    },
    currentWeeklyMileage: {
      validate: (v) => !v || (!isNaN(v) && Number(v) >= 0 && Number(v) <= 300),
      message: 'Weekly mileage must be between 0 and 300'
    }
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem('coaching_application_draft');
    if (draft) {
      try {
        const draftData = JSON.parse(draft);
        Object.keys(draftData).forEach(key => {
          if (draftData[key] !== undefined) {
            setFieldValue(key, draftData[key]);
          }
        });
      } catch (err) {
        logger.error('Error loading draft:', err);
      }
    }
  }, [setFieldValue]);

  // Auto-save draft every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      localStorage.setItem('coaching_application_draft', JSON.stringify(form));
    }, 10000);
    return () => clearInterval(timer);
  }, [form]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'Meta+Enter': (e) => {
      if (isValid && !submitting) {
        submit(e);
      }
    },
    'Ctrl+Enter': (e) => {
      if (isValid && !submitting) {
        submit(e);
      }
    }
  }, [isValid, submitting]);

  const onChange = (key) => (e) => {
    const value = e?.target?.type === 'checkbox' ? e.target.checked : e.target.value;
    handleChange(key, value);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email.trim() || !form.name.trim()) {
      setError('Please enter your name and email.');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        ...form,
        currentWeeklyMileage: form.currentWeeklyMileage === '' ? undefined : Number(form.currentWeeklyMileage),
        source: 'coaching_application',
      };

      const res = await fetch('/api/coaching-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = 'Unable to submit. Please try again.';
        try {
          const data = await res.json();
          if (data?.error) msg = data.error;
        } catch (_) {
          // ignore
        }
        throw new Error(msg);
      }

      // Clear draft on successful submission
      localStorage.removeItem('coaching_application_draft');
      showToast('Application submitted successfully!', 'success');
      navigate('/apply/thanks');
    } catch (err) {
      const errorMsg = err?.message || 'Unable to submit. Please try again.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${getThemeClass('training', true)}`} style={{ backgroundColor: uiColors.white }}>
      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14 relative z-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link to="/coach" className="munich-btn munich-btn-outline" style={{ padding: '0.5rem 0.75rem' }}>
            Back
          </Link>
          <div className="text-sm" style={{ color: uiColors.darkGreen }}>
            Limited roster • Personalized coaching
          </div>
        </div>

        <div className="munich-card overflow-hidden">
          <div className="munich-card-body">
            <div className="flex items-start gap-3 mb-4">
              <div className="um-icon-badge" style={{ background: `${uiColors.lightBlue}18`, color: uiColors.lightBlue, border: `1px solid ${uiColors.lightBlue}35` }}>
                <ClipboardList size={18} />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: uiColors.black }}>
                  Apply for coaching
                </h1>
                <p className="mt-1" style={{ color: uiColors.darkGreen }}>
                  This intake helps me understand your goals, training context, and whether we’re a great fit.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <form onSubmit={submit} className="space-y-5">
                  {error && (
                    <div className="munich-card" style={{ borderColor: `${colors.orange}55` }}>
                      <div className="munich-card-body">
                        <div className="text-sm font-semibold" style={{ color: colors.orange }}>Submission issue</div>
                        <div className="text-sm mt-1" style={{ color: uiColors.darkGreen }}>{error}</div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="Name"
                      required
                      error={errors.name}
                      success={form.name && !errors.name}
                      colors={uiColors}
                    >
                      <input
                        type="text"
                        className="um-field"
                        value={form.name || ''}
                        onChange={onChange('name')}
                        onBlur={() => handleBlur('name')}
                        autoComplete="name"
                        style={{
                          borderColor: errors.name ? '#ef4444' : (form.name && !errors.name ? uiColors.lightGreen : uiColors.border)
                        }}
                      />
                    </FormField>
                    <FormField
                      label="Email"
                      required
                      error={errors.email}
                      success={form.email && !errors.email}
                      colors={uiColors}
                    >
                      <input
                        type="email"
                        className="um-field"
                        value={form.email || ''}
                        onChange={onChange('email')}
                        onBlur={() => handleBlur('email')}
                        autoComplete="email"
                        style={{
                          borderColor: errors.email ? '#ef4444' : (form.email && !errors.email ? uiColors.lightGreen : uiColors.border)
                        }}
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="Phone"
                      error={errors.phone}
                      success={form.phone && !errors.phone}
                      helpText="Optional"
                      colors={uiColors}
                    >
                      <input
                        type="tel"
                        inputMode="tel"
                        className="um-field"
                        value={form.phone || ''}
                        onChange={onChange('phone')}
                        onBlur={() => handleBlur('phone')}
                        autoComplete="tel"
                        style={{
                          borderColor: errors.phone ? '#ef4444' : (form.phone && !errors.phone ? uiColors.lightGreen : uiColors.border)
                        }}
                      />
                    </FormField>
                    <FormField
                      label="Primary event"
                      colors={uiColors}
                    >
                      <select 
                        className="um-field" 
                        value={form.primaryEvent || ''} 
                        onChange={onChange('primaryEvent')}
                        style={{
                          minHeight: '44px', // Better touch target
                          padding: '0.75rem'
                        }}
                      >
                        <option value="">Select…</option>
                        <option value="1500m">1500m</option>
                        <option value="Mile">Mile</option>
                        <option value="3K">3K</option>
                        <option value="5K">5K</option>
                        <option value="8K">8K</option>
                        <option value="10K">10K</option>
                        <option value="Half Marathon">Half Marathon</option>
                        <option value="Marathon">Marathon</option>
                        <option value="Trail">Trail</option>
                        <option value="Other">Other</option>
                      </select>
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="Current weekly mileage"
                      error={errors.currentWeeklyMileage}
                      success={form.currentWeeklyMileage && !errors.currentWeeklyMileage}
                      helpText="Miles per week (0-300)"
                      colors={uiColors}
                    >
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        max="300"
                        className="um-field"
                        value={form.currentWeeklyMileage || ''}
                        onChange={onChange('currentWeeklyMileage')}
                        onBlur={() => handleBlur('currentWeeklyMileage')}
                        placeholder="e.g., 35"
                        style={{
                          borderColor: errors.currentWeeklyMileage ? '#ef4444' : (form.currentWeeklyMileage && !errors.currentWeeklyMileage ? uiColors.lightGreen : uiColors.border)
                        }}
                      />
                    </FormField>
                    <FormField
                      label="Time zone"
                      helpText="Auto-detected from your browser"
                      colors={uiColors}
                    >
                      <input 
                        className="um-field" 
                        value={form.timeZone || ''} 
                        onChange={onChange('timeZone')} 
                        placeholder="e.g., America/Chicago"
                        style={{
                          minHeight: '44px', // Better touch target
                        }}
                      />
                    </FormField>
                  </div>

                  <div>
                    <label className="um-label">Primary goal (what outcome are you chasing?)</label>
                    <textarea className="um-field um-textarea" rows={4} value={form.goal} onChange={onChange('goal')} placeholder="Race goal, PR target, consistency, return from injury, etc." />
                  </div>

                  <div>
                    <label className="um-label">Training background (what’s worked / what hasn’t?)</label>
                    <textarea className="um-field um-textarea" rows={4} value={form.experience} onChange={onChange('experience')} placeholder="Experience level, recent PRs, typical training, limitations." />
                  </div>

                  <div>
                    <label className="um-label">Availability + communication preferences</label>
                    <textarea className="um-field um-textarea" rows={3} value={form.availability} onChange={onChange('availability')} placeholder="Best days/times to check in, travel schedule, preferred cadence." />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="How did you find me?"
                      colors={uiColors}
                    >
                      <input 
                        className="um-field" 
                        value={form.referrer || ''} 
                        onChange={onChange('referrer')} 
                        placeholder="Friend, Instagram, race, blog, etc."
                        style={{
                          minHeight: '44px',
                        }}
                      />
                    </FormField>
                    <FormField
                      label="Anything else I should know?"
                      colors={uiColors}
                    >
                      <input 
                        className="um-field" 
                        value={form.notes || ''} 
                        onChange={onChange('notes')} 
                        placeholder="Injuries, constraints, context."
                        style={{
                          minHeight: '44px',
                        }}
                      />
                    </FormField>
                  </div>

                  <label className="flex items-start gap-3">
                    <input type="checkbox" checked={form.consent} onChange={onChange('consent')} style={{ marginTop: 3 }} />
                    <span className="text-sm" style={{ color: uiColors.darkGreen }}>
                      I’m ready for personalized coaching, and I’m willing to communicate consistently (weekly check-ins).
                    </span>
                  </label>

                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <button
                      type="submit"
                      className="munich-btn munich-btn-primary um-cta"
                      disabled={submitting || !isValid}
                      style={{
                        opacity: (submitting || !isValid) ? 0.6 : 1,
                        cursor: (submitting || !isValid) ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {submitting ? 'Submitting…' : 'Submit application'}
                    </button>
                    <Link to="/coach" className="munich-btn munich-btn-outline" style={{ textAlign: 'center' }}>
                      Not ready? Learn more
                    </Link>
                  </div>

                  <div className="text-xs" style={{ color: uiColors.silver }}>
                    By submitting, you agree that I can contact you about coaching. No spam.
                  </div>
                </form>
              </div>

              <div className="space-y-4">
                <div className="munich-card">
                  <div className="munich-card-body">
                    <div className="flex items-center gap-2 mb-2" style={{ color: uiColors.black }}>
                      <Sparkles size={16} style={{ color: uiColors.lightGreen }} />
                      <div className="font-bold">What happens next</div>
                    </div>
                    <ol className="text-sm space-y-2" style={{ color: uiColors.darkGreen }}>
                      <li><b>1)</b> I review your application (usually within 24–48 hours).</li>
                      <li><b>2)</b> If it’s a fit, I’ll invite you to a short call.</li>
                      <li><b>3)</b> We map out expectations + your first 2 weeks.</li>
                    </ol>
                  </div>
                </div>

                <div className="munich-card">
                  <div className="munich-card-body">
                    <div className="flex items-center gap-2 mb-2" style={{ color: uiColors.black }}>
                      <ShieldCheck size={16} style={{ color: uiColors.lightBlue }} />
                      <div className="font-bold">Fit matters</div>
                    </div>
                    <p className="text-sm" style={{ color: uiColors.darkGreen }}>
                      I coach a limited number of athletes so I can stay hands-on. If we’re not a fit, I’ll point you to a better next step.
                    </p>
                  </div>
                </div>

                <div className="munich-card">
                  <div className="munich-card-body">
                    <div className="text-sm font-bold" style={{ color: uiColors.black }}>Prefer a quick call first?</div>
                    <p className="text-sm mt-1" style={{ color: uiColors.darkGreen }}>
                      You can also book a consult and I’ll direct you to the right next step.
                    </p>
                    <Link to="/coach" className="munich-btn munich-btn-outline" style={{ marginTop: 12, width: '100%', textAlign: 'center' }}>
                      Go to consult
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
