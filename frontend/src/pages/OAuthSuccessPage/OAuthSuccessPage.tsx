import { useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { AuthContext } from '../../components/AuthContext';
import { Loader } from '../../components/Loader';
import { accessTokenService } from '../../services/accessTokenService.js';
import { ROUTES } from '../../router/routes.js';

export const OAuthSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isChecked, user } = useContext(AuthContext);

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');

    if (!accessToken) {
      navigate(ROUTES.login, { replace: true });
      return;
    }

    accessTokenService.save(accessToken);
  }, [searchParams, navigate]);

  useEffect(() => {
    if (!isChecked) {
      return;
    }

    navigate(user ? ROUTES.todos : ROUTES.login, { replace: true });
  }, [isChecked, user, navigate]);

  return <Loader />;
};
