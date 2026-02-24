// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { sendPasswordResetEmail } from 'firebase/auth';
// // import { auth } from '../../config/firebase';
// import { auth } from '../config/firebase';
// import toast from 'react-hot-toast';

// const ForgotPassword = () => {
//     const [email, setEmail] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [emailSent, setEmailSent] = useState(false);
//     const [error, setError] = useState('');

//     const validateEmail = (email) => {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(email);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');

//         // Validation
//         if (!email) {
//             setError('Email is required');
//             toast.error('Email is required');
//             return;
//         }

//         if (!validateEmail(email)) {
//             setError('Please enter a valid email address');
//             toast.error('Please enter a valid email address');
//             return;
//         }

//         setLoading(true);

//         try {
//             // Firebase password reset
//             await sendPasswordResetEmail(auth, email, {
//                 url: `${window.location.origin}/login`, // Redirect URL after reset
//                 handleCodeInApp: false
//             });

//             setEmailSent(true);
//             toast.success('Password reset email sent! Check your inbox.');
//         } catch (error) {
//             let errorMessage = 'Failed to send reset email. Please try again.';
//             console.log(error,'err-49');

//             // Handle specific Firebase errors
//             if (error.code === 'auth/user-not-found') {
//                 errorMessage = 'No account found with this email address';
//             } else if (error.code === 'auth/invalid-email') {
//                 errorMessage = 'Invalid email address';
//             } else if (error.code === 'auth/too-many-requests') {
//                 errorMessage = 'Too many requests. Please try again later';
//             }
//             console.log(errorMessage, 'err');

//             setError(errorMessage);
//             toast.error(errorMessage);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleResend = async () => {
//         setLoading(true);
//         setError('');

//         try {
//             await sendPasswordResetEmail(auth, email, {
//                 url: `${window.location.origin}/login`,
//                 handleCodeInApp: false
//             });
//             toast.success('Reset email resent!');
//         } catch (error) {
//             toast.error('Failed to resend email. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex">
//             {/* Left Side - Branding (same as login) */}
//             <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 items-center justify-center p-12 relative overflow-hidden">
//                 <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48"></div>
//                 <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full -ml-36 -mb-36"></div>

//                 <div className="relative z-10 text-white max-w-md">
//                     <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-3xl font-bold mb-8 backdrop-blur-sm">
//                         T
//                     </div>
//                     <h1 className="text-5xl font-bold mb-6">TaskFlow AI</h1>
//                     <p className="text-xl text-white text-opacity-90 mb-8">
//                         Don't worry! Password recovery is quick and easy. We'll help you get back to managing your projects in no time.
//                     </p>

//                     <div className="space-y-4">
//                         <div className="flex items-center space-x-3">
//                             <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
//                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                                 </svg>
//                             </div>
//                             <span className="text-lg">Secure password reset</span>
//                         </div>
//                         <div className="flex items-center space-x-3">
//                             <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
//                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                                 </svg>
//                             </div>
//                             <span className="text-lg">Email verification</span>
//                         </div>
//                         <div className="flex items-center space-x-3">
//                             <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
//                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                                 </svg>
//                             </div>
//                             <span className="text-lg">Quick recovery process</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Right Side - Forgot Password Form */}
//             <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
//                 <div className="max-w-md w-full">
//                     {/* Mobile Logo */}
//                     <div className="lg:hidden text-center mb-8">
//                         <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
//                             T
//                         </div>
//                     </div>

//                     {!emailSent ? (
//                         <>
//                             <div className="text-center mb-8">
//                                 <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                     <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
//                                     </svg>
//                                 </div>
//                                 <h2 className="text-3xl font-bold text-gray-800 mb-2">Forgot password?</h2>
//                                 <p className="text-gray-600">No worries, we'll send you reset instructions</p>
//                             </div>

//                             {/* Error Message */}
//                             {error && (
//                                 <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
//                                     <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                     </svg>
//                                     <div className="text-sm text-red-700">{error}</div>
//                                 </div>
//                             )}

//                             <form onSubmit={handleSubmit} className="space-y-6">
//                                 <div>
//                                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                                         Email address
//                                     </label>
//                                     <input
//                                         type="email"
//                                         id="email"
//                                         value={email}
//                                         onChange={(e) => {
//                                             setEmail(e.target.value);
//                                             setError('');
//                                         }}
//                                         className={`w-full px-4 py-3 border rounded-lg outline-none transition ${error
//                                             ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent'
//                                             : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
//                                             }`}
//                                         placeholder="Enter your email address"
//                                     />
//                                 </div>

//                                 <button
//                                     type="submit"
//                                     disabled={loading}
//                                     className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//                                 >
//                                     {loading ? (
//                                         <>
//                                             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
//                                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                             </svg>
//                                             Sending...
//                                         </>
//                                     ) : (
//                                         'Reset password'
//                                     )}
//                                 </button>

//                                 <Link
//                                     to="/login"
//                                     className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-800 font-medium"
//                                 >
//                                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                                     </svg>
//                                     Back to login
//                                 </Link>
//                             </form>
//                         </>
//                     ) : (
//                         <>
//                             {/* Success State */}
//                             <div className="text-center">
//                                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                     <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
//                                     </svg>
//                                 </div>
//                                 <h2 className="text-3xl font-bold text-gray-800 mb-2">Check your email</h2>
//                                 <p className="text-gray-600 mb-6">
//                                     We've sent password reset instructions to <span className="font-medium text-gray-800">{email}</span>
//                                 </p>

//                                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//                                     <div className="flex items-start">
//                                         <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                         </svg>
//                                         <div className="text-sm text-blue-700">
//                                             <p className="font-medium mb-1">Didn't receive the email?</p>
//                                             <p>Check your spam folder or click the resend button below</p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <button
//                                     onClick={handleResend}
//                                     disabled={loading}
//                                     className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
//                                 >
//                                     {loading ? 'Resending...' : 'Resend email'}
//                                 </button>

//                                 <Link
//                                     to="/login"
//                                     className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-800 font-medium"
//                                 >
//                                     <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                                     </svg>
//                                     Back to login
//                                 </Link>
//                             </div>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ForgotPassword;





import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!email) {
            setError('Email is required');
            toast.error('Email is required');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            toast.error('Please enter a valid email address');
            return;
        }

        setLoading(true);

        try {
            // ✅ Firebase password reset - uses Firebase's default hosted page
            await sendPasswordResetEmail(auth, email);

            setEmailSent(true);
            toast.success('Password reset email sent! Check your inbox.');
        } catch (error) {
            let errorMessage = 'Failed to send reset email. Please try again.';
            console.log(error, 'err-49');

            // Handle specific Firebase errors
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email address';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many requests. Please try again later';
            }
            console.log(errorMessage, 'err');

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setLoading(true);
        setError('');

        try {
            await sendPasswordResetEmail(auth, email);
            toast.success('Reset email resent!');
        } catch (error) {
            toast.error('Failed to resend email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                        Don't worry! Password recovery is quick and easy. We'll help you get back to managing your projects in no time.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-lg">Secure password reset</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-lg">Email verification</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-lg">Quick recovery process</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Forgot Password Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="max-w-md w-full">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                            T
                        </div>
                    </div>

                    {!emailSent ? (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">Forgot password?</h2>
                                <p className="text-gray-600">No worries, we'll send you reset instructions</p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                                    <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="text-sm text-red-700">{error}</div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setError('');
                                        }}
                                        className={`w-full px-4 py-3 border rounded-lg outline-none transition ${error
                                            ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent'
                                            : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            }`}
                                        placeholder="Enter your email address"
                                    />
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
                                            Sending...
                                        </>
                                    ) : (
                                        'Reset password'
                                    )}
                                </button>

                                <Link
                                    to="/login"
                                    className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-800 font-medium transition"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to login
                                </Link>
                            </form>
                        </>
                    ) : (
                        <>
                            {/* Success State */}
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">Check your email</h2>
                                <p className="text-gray-600 mb-6">
                                    We've sent password reset instructions to <span className="font-medium text-gray-800">{email}</span>
                                </p>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div className="text-sm text-blue-700">
                                            <p className="font-medium mb-1">Didn't receive the email?</p>
                                            <ul className="space-y-1 list-disc list-inside">
                                                <li>Check your spam/junk folder</li>
                                                <li>Make sure you entered the correct email</li>
                                                <li>Click the resend button below</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleResend}
                                    disabled={loading}
                                    className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                                >
                                    {loading ? 'Resending...' : 'Resend email'}
                                </button>

                                <Link
                                    to="/login"
                                    className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-800 font-medium transition"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to login
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;