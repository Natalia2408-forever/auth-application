import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/global.scss';
import { AuthProvider } from './components/AuthContext';
import { AuthGate } from './components/AuthGate/AuthGate.jsx';
import { Root } from './Root';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <AuthGate>
      <HashRouter>
        <Root />
      </HashRouter>
    </AuthGate>
  </AuthProvider>,
);
