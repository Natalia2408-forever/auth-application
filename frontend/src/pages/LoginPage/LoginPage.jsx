import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import cn from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../components/AuthContext';
import { AuthLayout } from '../../components/AuthLayout';
import { SocialAuthButtons } from '../../components/SocialAuthButtons';
import { usePageError } from '../../hooks/usePageError.js';
import { ROUTES } from '../../router/routes.js';
import { validateEmail, validatePassword } from '../../utils/validators.js';
import styles from '../../styles/authForm.module.scss';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = usePageError('');
  const { login } = useContext(AuthContext);

  return (
    <AuthLayout>
      <Formik
        initialValues={{ email: '', password: '' }}
        validateOnMount
        onSubmit={({ email, password }, formikHelpers) =>
          login({ email, password })
            .then(() =>
              navigate(location.state?.from?.pathname || ROUTES.todos),
            )
            .catch(err => {
              setError(err.response?.data?.message || 'Something went wrong');
              formikHelpers.setFieldValue('password', '');
            })
        }
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <h2 className={styles.title}>Sign in</h2>
            <p className={styles.subtitle}>
              Enter your login details to sign in
            </p>

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
                  autoComplete="current-password"
                  placeholder="••••••••"
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
              disabled={
                isSubmitting ||
                Boolean(errors.email) ||
                Boolean(errors.password)
              }
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>

            <p className={styles.switch}>
              Don&apos;t have an account yet?{' '}
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
