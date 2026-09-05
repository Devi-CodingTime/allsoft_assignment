import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateOTP, validateOTP } from '../api/documentApi';
import { useAuth } from '../context/AuthContext';

const OTP_LENGTH = 6;

function Login() {
    const [step, setStep] = useState('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const otpRefs = useRef([]);
  const navigate = useNavigate();
  const { login } = useAuth();

  const isValidMobile = /^\d{10}$/.test(mobileNumber);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!isValidMobile) { setError('Enter a valid 10-digit mobile number.'); return; }
    setError(''); setLoading(true);
    try {
      await generateOTP(mobileNumber);
      setInfo(`An OTP was sent to ${mobileNumber}.`);
      setStep('otp');
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleOtpChange = (index, digit) => {
    if (!/^\d?$/.test(digit)) return;
    const next = [...otp]; next[index] = digit; setOtp(next);
    if (digit && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== OTP_LENGTH) { setError(`Enter the full ${OTP_LENGTH}-digit code.`); return; }
    setError(''); setLoading(true);
    try {
      const res = await validateOTP(mobileNumber, code);
      // Confirmed shape: { status, data: { token, user_id, user_name, roles } }
      const profile = res?.data?.data;
      if (!profile?.token) throw new Error('Login succeeded but no token was returned by the server.');
      login(profile, mobileNumber);
      navigate('/upload', { replace: true });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
      <div className="auth-shell">
      <div className="auth-side">
        <div className="auth-side-content">
          <h1>Every document, filed once, found forever.</h1>
          <p>Document Management System keeps personal and professional paperwork sorted by category, tag and date.</p>
        </div>
        <div>
          <div className="filing-marks">
            <span className={`filing-mark${step === 'mobile' ? ' active' : ''}`} />
            <span className={`filing-mark${step === 'otp' ? ' active' : ''}`} />
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card card card-pad">
          <div className="eyebrow">Sign in</div>
          <h2>{step === 'mobile' ? 'Enter your mobile number' : 'Enter the OTP'}</h2>
          <p style={{ marginBottom: 20 }}>
            {step === 'mobile' ? "We use this to verify it's you — no password needed." : `Sent to ${mobileNumber}.`}
          </p>

          {error && <div className="alert alert-danger">{error}</div>}
          {info && !error && step === 'otp' && <div className="alert alert-success">{info}</div>}

          {step === 'mobile' ? (
            <form onSubmit={handleSendOtp}>
              <div className="field">
                <label htmlFor="mobile">Mobile number</label>
                <input
                  id="mobile" className="input" inputMode="numeric" maxLength={10}
                  placeholder="98765 43210" value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading && <span className="spinner" />} Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div className="field">
                <label>One-time passcode</label>
                <div className="otp-boxes">
                  {otp.map((digit, i) => (
                    <input
                      key={i} ref={(el) => (otpRefs.current[i] = el)} className="otp-box"
                      inputMode="numeric" maxLength={1} value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    />
                  ))}
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading && <span className="spinner" />} Verify & continue
              </button>
              <button
                type="button" className="btn btn-ghost btn-block" style={{ marginTop: 8 }}
                onClick={() => { setStep('mobile'); setOtp(Array(OTP_LENGTH).fill('')); setInfo(''); }}
              >
                Use a different number
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
    
  )
}

export default Login
