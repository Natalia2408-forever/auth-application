import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './styles/global.scss';
import { AuthProvider } from './components/AuthContext';
import { Root } from './Root';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <HashRouter>
      <Root />
    </HashRouter>
  </AuthProvider>,
);
