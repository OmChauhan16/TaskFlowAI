import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../config/firebase';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const oobCode = searchParams.get('oobCode'); // Firebase reset code from URL

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [invalidCode, setInvalidCode] = useState(false);

    // Verify the reset code on mount
    useEffect(() => {
        const verifyCode = async () => {
            if (!oobCode) {
                setInvalidCode(true);
                setVerifying(false);
                toast.error('Invalid or missing reset code');
                return;
            }

            try {
                // Verify the reset code and get the email
                const userEmail = await verifyPasswordResetCode(auth, oobCode);
                setEmail(userEmail);
                setVerifying(false);
            } catch (error) {
                setInvalidCode(true);
                setVerifying(false);

                let errorMessage = 'Invalid or expired reset link';
                if (error.code === 'auth/invalid-action-code') {
                    errorMessage = 'This reset link has expired or has already been used';
                } else if (error.code === 'auth/expired-action-code') {
                    errorMessage = 'This reset link has expired. Please request a new one';
                }

                toast.error(errorMessage);
            }
        };

        verifyCode();
    }, [oobCode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one lowercase letter';
        } else if (!/(?=.*[A-Z])/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one number';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            const firstError = Object.values(newErrors)[0];
            toast.error(firstError);
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Reset the password using Firebase
            await confirmPasswordReset(auth, oobCode, formData.password);

            toast.success('Password reset successful! Please login with your new password.');
            navigate('/login');
        } catch (error) {
            let errorMessage = 'Failed to reset password. Please try again.';

            if (error.code === 'auth/invalid-action-code') {
                errorMessage = 'This reset link has expired or has already been used';
            } else if (error.code === 'auth/expired-action-code') {
                errorMessage = 'This reset link has expired. Please request a new one';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak. Please choose a stronger password';
            }

            toast.error(errorMessage);
            setErrors({ form: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    // Loading state while verifying code
    if (verifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying reset link...</p>
                </div>
            </div>
        );
    }

    // Invalid code state
    if (invalidCode) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Invalid Reset Link</h2>
                    <p className="text-gray-600 mb-6">
                        This password reset link is invalid or has expired. Please request a new one.
                    </p>
                    <button
                        onClick={() => navigate('/forgot-password')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition"
                    >
                        Request new reset link
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full -ml-36 -mb-36"></div>

                <div className="relative z-10 text-white max-w-md">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-3xl font-bold mb-8 backdrop-blur-sm">
                        T
                    </div>
                    <h1 className="text-5xl font-bold mb-6">TaskFlow AI</h1>
                    <p className="text-xl text-white text-opacity-90 mb-8">
                        Create a strong new password to secure your account and get back to managing your projects.
                    </p>

                    <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                        <h3 className="font-semibold mb-2">Password Requirements:</h3>
                        <ul className="space-y-1 text-sm">
                            <li>• At least 8 characters long</li>
                            <li>• One uppercase letter</li>
                            <li>• One lowercase letter</li>
                            <li>• One number</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Right Side - Reset Password Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="max-w-md w-full">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                            T
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Set new password</h2>
                        <p className="text-gray-600">
                            for <span className="font-medium text-gray-800">{email}</span>
                        </p>
                    </div>

                    {/* Form-level error */}
                    {errors.form && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                            <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-sm text-red-700">{errors.form}</div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* New Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                New password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 pr-12 border rounded-lg outline-none transition ${errors.password
                                            ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent'
                                            : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 pr-12 border rounded-lg outline-none transition ${errors.confirmPassword
                                            ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent'
                                            : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Password Requirements */}
                        <div className="lg:hidden bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-blue-900 mb-2">Password must contain:</h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li className="flex items-center">
                                    <span className={`mr-2 ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                                        {formData.password.length >= 8 ? '✓' : '○'}
                                    </span>
                                    At least 8 characters
                                </li>
                                <li className="flex items-center">
                                    <span className={`mr-2 ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                                        {/(?=.*[A-Z])/.test(formData.password) ? '✓' : '○'}
                                    </span>
                                    One uppercase letter
                                </li>
                                <li className="flex items-center">
                                    <span className={`mr-2 ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                                        {/(?=.*[a-z])/.test(formData.password) ? '✓' : '○'}
                                    </span>
                                    One lowercase letter
                                </li>
                                <li className="flex items-center">
                                    <span className={`mr-2 ${/(?=.*\d)/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                                        {/(?=.*\d)/.test(formData.password) ? '✓' : '○'}
                                    </span>
                                    One number
                                </li>
                            </ul>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Resetting password...
                                </>
                            ) : (
                                'Reset password'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;