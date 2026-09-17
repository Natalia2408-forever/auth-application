import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import cn from 'classnames';

import { AuthContext } from '../../components/AuthContext';
import { AuthLayout } from '../../components/AuthLayout';
import { SocialAuthButtons } from '../../components/SocialAuthButtons';
import { usePageError } from '../../hooks/usePageError';
import { ROUTES } from '../../router/routes';
import { validateEmail, validateLoginPassword } from '../../utils/validators';
import styles from '../../styles/authForm.module.scss';

interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = usePageError('');
  const { login } = useContext(AuthContext);

  return (
    <AuthLayout>
      <Formik<LoginFormValues>
        initialValues={{
          email: '',
          password: '',
        }}
        validateOnMount
        onSubmit={({ email, password }, formikHelpers) => {
          formikHelpers.setSubmitting(true);

          login({ email, password })
            .then(() => navigate(ROUTES.todos))
            .catch((err: any) => {
              const data = err.response?.data;

              setError(data?.message || 'Invalid email or password');
            })
            .finally(() => formikHelpers.setSubmitting(false));
        }}
      >
        {({ touched, errors, isSubmitting, isValid }) => (
          <Form>
            <h2 className={styles.title}>Log in</h2>
            <p className={styles.subtitle}>Welcome back, please log in</p>

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
                  validate={validateLoginPassword}
                  name="password"
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={cn(styles.input, {
                    [styles.inputDanger]: touched.password && errors.password,
                  })}
                />
              </div>

              {touched.password && errors.password && (
                <p className={styles.help}>{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className={styles.submit}
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? 'Logging in...' : 'Log in'}
            </button>

            <p className={styles.switch}>
              Don&apos;t have an account?{' '}
              <Link to={ROUTES.register}>Sign up</Link>
            </p>
          </Form>
        )}
      </Formik>

      <SocialAuthButtons />

      {error && <p className={styles.notification}>{error}</p>}
    </AuthLayout>
  );
};
