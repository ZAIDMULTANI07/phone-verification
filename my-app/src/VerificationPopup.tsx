import React, { useState, useRef, useEffect } from 'react';
import './VerificationPopup.css';

interface VerificationPopupProps {
  onVerificationComplete: (otp: string) => void;
}

const VerificationPopup: React.FC<VerificationPopupProps> = ({ onVerificationComplete }) => {
  const [otp, setOtp] = useState<string>('');
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (otp.length === 6) {
      onVerificationComplete(otp);
    }
  }, [otp, onVerificationComplete]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = event.target;

    // Only allow digits as input
    if (/^\d*$/.test(value)) {
      // Store the OTP and move focus to the next input field
      setOtp((prevOtp) => {
        const newOtp = prevOtp.substring(0, index) + value + prevOtp.substring(index + 1);
        return newOtp.length <= 6 ? newOtp : prevOtp;
      });
      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    switch (event.key) {
      case 'Backspace':
        event.preventDefault();
        // Delete the previous input field and move focus to it
        setOtp((prevOtp) => prevOtp.substring(0, index - 1) + prevOtp.substring(index));
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
        break;
      case 'ArrowLeft':
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
        break;
      case 'ArrowRight':
        if (index < inputRefs.current.length - 1) {
          inputRefs.current[index + 1]?.focus();
        }
        break;
      default:
        break;
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    event.preventDefault();
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedData = clipboardData.getData('text');
    // Only allow digits as input
    if (/^\d*$/.test(pastedData)) {
      const newOtp = otp.substring(0, index) + pastedData + otp.substring(index + pastedData.length);
      if (newOtp.length <= 6) {
        setOtp(newOtp);
        if (index < inputRefs.current.length - 1) {
          inputRefs.current[index + pastedData.length]?.focus();
        }
      }
    }
  };

  return (
    <div className="verification-popup">
      <div className="popup-content">
        <h2>Phone Verification</h2>
        <p>Please enter the 6 digit OTP sent to your phone number</p>
        <div className="otp-inputs">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={otp.charAt(index) || ''}
              onChange={(event) => handleInputChange(event, index)}
             
              onKeyDown={(event) => handleKeyDown(event, index)}
              onPaste={(event) => handlePaste(event, index)}
              ref={(el) => (inputRefs.current[index] = el)}
            />
          ))}
        </div>
        <button disabled={otp.length < 6}>Verify</button>
      </div>
    </div>
    );
};

export default VerificationPopup;