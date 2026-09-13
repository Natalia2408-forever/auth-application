import styles from './SocialAuthButtons.module.scss';

const API_URL = import.meta.env.VITE_API_URL;

const PROVIDERS = [
  {
    key: 'google',
    label: 'Google',
    icon: 'fa-brands fa-google',
    className: 'google',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    icon: 'fa-brands fa-facebook',
    className: 'facebook',
  },
  {
    key: 'github',
    label: 'GitHub',
    icon: 'fa-brands fa-github',
    className: 'github',
  },
];

export const SocialAuthButtons = () => {
  const goToProvider = provider => {
    window.location.assign(`${API_URL}/auth/${provider}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.separator}>
        <span>Or continue with</span>
      </div>

      <div className={styles.buttons}>
        {PROVIDERS.map(({ key, label, icon, className }) => (
          <button
            key={key}
            type="button"
            className={`${styles.btn} ${styles[className]}`}
            onClick={() => goToProvider(key)}
          >
            <i className={icon} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
