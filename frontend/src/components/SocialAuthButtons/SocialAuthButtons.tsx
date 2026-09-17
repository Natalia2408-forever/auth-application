import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faGoogle,
  faFacebook,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';
import styles from './SocialAuthButtons.module.scss';

const API_URL = import.meta.env.VITE_API_URL;

type Provider = 'google' | 'facebook' | 'github';

interface ProviderOption {
  key: Provider;
  label: string;
  icon: IconDefinition;
  className: string;
}

const PROVIDERS: ProviderOption[] = [
  { key: 'google', label: 'Google', icon: faGoogle, className: 'google' },
  {
    key: 'facebook',
    label: 'Facebook',
    icon: faFacebook,
    className: 'facebook',
  },
  { key: 'github', label: 'GitHub', icon: faGithub, className: 'github' },
];

export const SocialAuthButtons = () => {
  const goToProvider = (provider: Provider) => {
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
            <FontAwesomeIcon icon={icon} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
