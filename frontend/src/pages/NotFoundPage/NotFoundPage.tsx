import { Link } from 'react-router-dom';

import { ROUTES } from '../../router/routes.js';
import styles from './NotFoundPage.module.scss';

export const NotFoundPage = () => (
  <div className={styles.wrapper}>
    <h2 className={styles.code}>404</h2>
    <p className={styles.text}>Page not found</p>
    <Link to={ROUTES.home} className={styles.link}>
      Go home
    </Link>
  </div>
);
