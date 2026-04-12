import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// orot-ui global styles
import 'orot-ui/styles/global.css';
import 'orot-ui/themes/light.css';
import 'orot-ui/themes/dark.css';
import 'orot-ui/themes/sepia.css';
import 'orot-ui/themes/forest.css';
import 'orot-ui/themes/ocean.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
