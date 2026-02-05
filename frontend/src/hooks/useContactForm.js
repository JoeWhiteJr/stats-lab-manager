import { useState } from 'react';

export function useContactForm(initialValues = {}) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    organization: '',
    subject: '',
    message: '',
    ...initialValues,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validate = () => {
    const newErrors = {};

    if (!values.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!values.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(values.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!values.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e, onSubmit) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(values);
      }
      setIsSubmitted(true);
      setValues({
        name: '',
        email: '',
        organization: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setValues({
      name: '',
      email: '',
      organization: '',
      subject: '',
      message: '',
    });
    setErrors({});
    setIsSubmitted(false);
  };

  return {
    values,
    errors,
    isSubmitting,
    isSubmitted,
    handleChange,
    handleSubmit,
    reset,
  };
}

export default useContactForm;
