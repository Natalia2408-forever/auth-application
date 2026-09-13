import authCover from '../../images/auth-cover.jpg';
import styles from './AuthLayout.module.scss';

export const AuthLayout = ({ children }) => (
  <div className={styles.page}>
    <section
      className={styles.image}
      style={{ backgroundImage: `url(${authCover})` }}
    />
    <section className={styles.content}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>
            <i className="fa-solid fa-circle-notch" aria-hidden="true" />
          </span>
          <span>Todoapp</span>
        </div>
        {children}
      </div>
    </section>
  </div>
);
