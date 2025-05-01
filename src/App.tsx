import React from 'react';
import { QuoteWizard } from './components/QuoteWizard';
import { QuoteProvider } from './context/QuoteContext';

function App() {
  return (
    <QuoteProvider>
      <QuoteWizard />
    </QuoteProvider>
  );
}

export default App;