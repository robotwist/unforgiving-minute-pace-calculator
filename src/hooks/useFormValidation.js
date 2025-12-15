import { useState, useCallback } from 'react';

/**
 * Custom hook for real-time form field validation
 * Usage:
 *   const { values, errors, isValid, handleChange, handleBlur, setFieldError } = useFormValidation({
 *     email: { validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Invalid email' },
 *     name: { required: true, message: 'Name is required' }
 *   });
 */
export const useFormValidation = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((name, value) => {
    const rule = validationRules[name];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || value.trim() === '')) {
      return rule.message || `${name} is required`;
    }

    // Custom validation function
    if (rule.validate && value) {
      const isValid = rule.validate(value);
      if (!isValid) {
        return rule.message || `${name} is invalid`;
      }
    }

    return null;
  }, [validationRules]);

  const handleChange = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    
    // Real-time validation if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[name] = error;
        } else {
          delete newErrors[name];
        }
        return newErrors;
      });
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    const value = values[name];
    const error = validateField(name, value);
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });
  }, [values, validateField]);

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  }, []);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const isValid = Object.keys(validationRules).every((name) => {
    if (!validationRules[name].required) return true;
    return values[name] && values[name].trim() !== '';
  }) && Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    setFieldError,
    setFieldValue,
    setValues,
    reset
  };
};
