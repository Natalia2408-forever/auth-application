import type { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import authCover from '../../images/auth-cover.webp';
import styles from './AuthLayout.module.scss';

export const AuthLayout = ({ children }: { children: ReactNode }) => (
  <div className={styles.page}>
    <section
      className={styles.image}
      style={{ backgroundImage: `url(${authCover})` }}
    />
    <section className={styles.content}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>
            <FontAwesomeIcon icon={faCircleNotch} aria-hidden="true" />
          </span>
          <span>Todoapp</span>
        </div>
        {children}
      </div>
    </section>
  </div>
);
