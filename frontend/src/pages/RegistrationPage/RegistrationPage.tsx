import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import cn from 'classnames';

import { authService } from '../../services/authService.js';
import { AuthContext } from '../../components/AuthContext/index.js';
import { AuthLayout } from '../../components/AuthLayout/index.js';
import { SocialAuthButtons } from '../../components/SocialAuthButtons/index.js';
import { usePageError } from '../../hooks/usePageError.js';
import { ROUTES } from '../../router/routes.js';
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validateName,
} from '../../utils/validators.js';
import styles from '../../styles/authForm.module.scss';

export const RegistrationPage = () => {
  const navigate = useNavigate();
  const [error, setError] = usePageError('');
  const { login } = useContext(AuthContext);

  return (
    <AuthLayout>
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          passwordConfirmation: '',
        }}
        validateOnMount
        onSubmit={({ name, email, password }, formikHelpers) => {
          formikHelpers.setSubmitting(true);

          authService
            .register({ name, email, password })
            .then(() => login({ email, password }))
            .then(() => navigate(ROUTES.todos))
            .catch(err => {
              const data = err.response?.data;

              if (data?.errors) {
                formikHelpers.setFieldError('email', data.errors.email);
                formikHelpers.setFieldError('password', data.errors.password);
              }

              setError(data?.message || 'Something went wrong');
            })
            .finally(() => formikHelpers.setSubmitting(false));
        }}
      >
        {({ touched, errors, isSubmitting, values, isValid }) => (
          <Form>
            <h2 className={styles.title}>Sign up</h2>
            <p className={styles.subtitle}>Create an account to get started</p>

            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>
                Name
              </label>

              <div className={styles.inputWrapper}>
                <FontAwesomeIcon
                  icon={faUser}
                  className={styles.icon}
                  aria-hidden="true"
                />

                <Field
                  validate={validateName}
                  name="name"
                  type="text"
                  id="name"
                  autoComplete="name"
                  placeholder="Your name"
                  className={cn(styles.input, {
                    [styles.inputDanger]: touched.name && errors.name,
                  })}
                />
              </div>

              {touched.name && errors.name && (
                <p className={styles.help}>{errors.name}</p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>

              <div className={styles.inputWrapper}>
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className={styles.icon}
                  aria-hidden="true"
                />

                <Field
                  validate={validateEmail}
                  name="email"
                  type="email"
                  id="email"
                  autoComplete="email"
                  placeholder="example@gmail.com"
                  className={cn(styles.input, {
                    [styles.inputDanger]: touched.email && errors.email,
                  })}
                />
              </div>

              {touched.email && errors.email && (
                <p className={styles.help}>{errors.email}</p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>

              <div className={styles.inputWrapper}>
                <FontAwesomeIcon
                  icon={faLock}
                  className={styles.icon}
                  aria-hidden="true"
                />

                <Field
                  validate={validatePassword}
                  name="password"
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={cn(styles.input, {
                    [styles.inputDanger]: touched.password && errors.password,
                  })}
                />
              </div>

              {touched.password && errors.password ? (
                <p className={styles.help}>{errors.password}</p>
              ) : (
                <p className={styles.hint}>
                  At least 6 characters, with a letter and a number
                </p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="passwordConfirmation" className={styles.label}>
                Confirm password
              </label>

              <div className={styles.inputWrapper}>
                <FontAwesomeIcon
                  icon={faLock}
                  className={styles.icon}
                  aria-hidden="true"
                />

                <Field
                  validate={(value: string) =>
                    validatePasswordConfirmation(value, values.password)
                  }
                  name="passwordConfirmation"
                  type="password"
                  id="passwordConfirmation"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={cn(styles.input, {
                    [styles.inputDanger]:
                      touched.passwordConfirmation &&
                      errors.passwordConfirmation,
                  })}
                />
              </div>

              {touched.passwordConfirmation && errors.passwordConfirmation && (
                <p className={styles.help}>{errors.passwordConfirmation}</p>
              )}
            </div>

            <button
              type="submit"
              className={styles.submit}
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? 'Signing up...' : 'Sign up'}
            </button>

            <p className={styles.switch}>
              Already have an account? <Link to={ROUTES.login}>Log in</Link>
            </p>
          </Form>
        )}
      </Formik>

      <SocialAuthButtons />

      {error && <p className={styles.notification}>{error}</p>}
    </AuthLayout>
  );
};
