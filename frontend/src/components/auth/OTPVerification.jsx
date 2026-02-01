import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const OTPVerification = ({ registrationData, onBack }) => {
    const navigate = useNavigate();
    const { verifyOTPAndRegister, resendOTP } = useContext(AuthContext);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        // Countdown timer
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    // Auto-focus first input on mount
    useEffect(() => {
        document.getElementById('otp-0')?.focus();
    }, []);

    const handleChange = (index, value) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only take the last digit
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);

        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        for (let i = 0; i < pastedData.length && i < 6; i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);

        // Focus last filled input or next empty
        const nextIndex = Math.min(pastedData.length, 5);
        document.getElementById(`otp-${nextIndex}`)?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            toast.error('Please enter the complete 6-digit OTP');
            return;
        }

        setLoading(true);

        try {
            await verifyOTPAndRegister(
                registrationData.email,
                registrationData.name,
                registrationData.password,
                // registrationData.avatar,
                otpCode
            );

            toast.success('Email verified! Account created successfully 🎉');
            navigate('/dashboard');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Invalid OTP. Please try again.';
            toast.error(errorMessage);

            // Clear OTP on error
            setOtp(['', '', '', '', '', '']);
            document.getElementById('otp-0')?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!canResend) return;

        setResending(true);
        try {
            await resendOTP(registrationData.email, registrationData.name);
            toast.success('New OTP sent to your email');
            setTimeLeft(600); // Reset timer
            setCanResend(false);
            setOtp(['', '', '', '', '', '']);
            document.getElementById('otp-0')?.focus();
        } catch (error) {
            toast.error('Failed to resend OTP. Please try again.');
        } finally {
            setResending(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
                        <p className="text-gray-600">
                            We've sent a 6-digit code to
                        </p>
                        <p className="text-blue-600 font-medium">{registrationData.email}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* OTP Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                                Enter OTP Code
                            </label>
                            <div className="flex justify-center gap-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                        disabled={loading}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Timer */}
                        <div className="text-center">
                            {timeLeft > 0 ? (
                                <p className="text-sm text-gray-600">
                                    Code expires in{' '}
                                    <span className="font-semibold text-blue-600">
                                        {formatTime(timeLeft)}
                                    </span>
                                </p>
                            ) : (
                                <p className="text-sm text-red-600 font-medium">
                                    OTP has expired
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading || otp.join('').length !== 6}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </>
                            ) : (
                                'Verify & Create Account'
                            )}
                        </button>

                        {/* Resend OTP */}
                        <div className="text-center space-y-2">
                            <p className="text-sm text-gray-600">Didn't receive the code?</p>
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={!canResend || resending}
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed transition"
                            >
                                {resending ? 'Sending...' : 'Resend OTP'}
                            </button>
                        </div>

                        {/* Back Button */}
                        <button
                            type="button"
                            onClick={onBack}
                            className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 text-sm transition"
                        >
                            ← Back to registration
                        </button>
                    </form>

                    {/* Help Text */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-800">
                            💡 <strong>Tip:</strong> Check your spam folder if you don't see the email in your inbox.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OTPVerification;