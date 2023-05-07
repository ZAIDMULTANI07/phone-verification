import React from 'react';
import VerificationPopup from './VerificationPopup';

function App() {
  return (
    <div className="App">
      <VerificationPopup onVerificationComplete={(otp) => console.log(otp)} />
    </div>
  );
}

export default App;
