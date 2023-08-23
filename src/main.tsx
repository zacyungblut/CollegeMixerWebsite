import React, { createContext, useReducer, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './hooks/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProcessedEmailsProvider } from './contexts/ProcessedEmailsContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastContainer />
      <BrowserRouter>
        <ProcessedEmailsProvider>
          <App /> 
        </ProcessedEmailsProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
