// import { useState, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext';
// import toast from 'react-hot-toast';

// const Register = () => {
//     const navigate = useNavigate();
//     const { register } = useContext(AuthContext);
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         password: '',
//         confirmPassword: ''
//     });
//     const [errors, setErrors] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [acceptTerms, setAcceptTerms] = useState(false);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value
//             // [e.target.name]: e.target.value
//         });

//         if (errors[name]) {
//             setErrors({
//                 ...errors,
//                 [name]: ''
//             });
//         }
//     };

//     const validateForm = () => {
//         const newErrors = {};

//         // Name validation
//         if (!formData.name) {
//             newErrors.name = 'Name is required';
//         } else if (formData.name.length < 2) {
//             newErrors.name = 'Name must be at least 2 characters';
//         }

//         // Email validation
//         if (!formData.email) {
//             newErrors.email = 'Email is required';
//         } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//             newErrors.email = 'Please enter a valid email address';
//         }

//         // Password validation
//         if (!formData.password) {
//             newErrors.password = 'Password is required';
//         } else if (formData.password.length < 6) {
//             newErrors.password = 'Password must be at least 6 characters';
//         }

//         // Confirm password validation
//         if (!formData.confirmPassword) {
//             newErrors.confirmPassword = 'Please confirm your password';
//         } else if (formData.password !== formData.confirmPassword) {
//             newErrors.confirmPassword = 'Passwords do not match';
//         }

//         // Terms validation
//         if (!acceptTerms) {
//             newErrors.terms = 'You must accept the terms and conditions';
//         }
//         setErrors(newErrors);

//         // Show toast for first error
//         if (Object.keys(newErrors).length > 0) {
//             const firstError = Object.values(newErrors)[0];
//             toast.error(firstError);
//         }

//         return Object.keys(newErrors).length === 0;

//         // return true;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!validateForm()) return;

//         setLoading(true);

//         try {
//             await register(formData.name, formData.email, formData.password);
//             toast.success('Account created successfully! 🎉');
//             navigate('/dashboard');
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex">
//             {/* Left Side - Branding */}
//             <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-blue-600 to-blue-700 items-center justify-center p-12 relative overflow-hidden">
//                 <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48"></div>
//                 <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full -ml-36 -mb-36"></div>

//                 <div className="relative z-10 text-white max-w-md">
//                     <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-3xl font-bold mb-8 backdrop-blur-sm">
//                         T
//                     </div>
//                     <h1 className="text-5xl font-bold mb-6">Join TaskFlow AI</h1>
//                     <p className="text-xl text-white text-opacity-90 mb-8">
//                         Start managing your projects smarter with AI-powered insights and real-time collaboration.
//                     </p>

//                     <div className="space-y-4">
//                         <div className="flex items-center space-x-3">
//                             <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
//                                 ⚡
//                             </div>
//                             <span className="text-lg">Get started in minutes</span>
//                         </div>
//                         <div className="flex items-center space-x-3">
//                             <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
//                                 🎯
//                             </div>
//                             <span className="text-lg">Free for personal use</span>
//                         </div>
//                         <div className="flex items-center space-x-3">
//                             <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
//                                 🚀
//                             </div>
//                             <span className="text-lg">Join 10,000+ teams</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Right Side - Register Form */}
//             <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
//                 <div className="max-w-md w-full">
//                     {/* Mobile Logo */}
//                     <div className="lg:hidden text-center mb-8">
//                         <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
//                             T
//                         </div>
//                     </div>

//                     <div className="text-center mb-8">
//                         <h2 className="text-3xl font-bold text-gray-800 mb-2">Create your account</h2>
//                         <p className="text-gray-600">Get started with TaskFlow AI today</p>
//                     </div>

//                     {/* Form-level error */}
//                     {errors.form && (
//                         <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
//                             <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                             <div className="text-sm text-red-700">{errors.form}</div>
//                         </div>
//                     )}

//                     <form onSubmit={handleSubmit} className="space-y-5">
//                         <div>
//                             <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                                 Full name
//                             </label>
//                             <input
//                                 type="text"
//                                 id="name"
//                                 name="name"
//                                 value={formData.name}
//                                 onChange={handleChange}
//                                 required
//                                 placeholder="John Doe"
//                                 className={`w-full px-4 py-3 border rounded-lg outline-none transition ${errors.name
//                                     ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent'
//                                     : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
//                                     }`}
//                             />
//                             {errors.name && (
//                                 <p className="mt-1 text-sm text-red-600 flex items-center">
//                                     <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                     </svg>
//                                     {errors.name}
//                                 </p>
//                             )}
//                         </div>

//                         <div>
//                             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                                 Email address
//                             </label>
//                             <input
//                                 type="email"
//                                 id="email"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 required
//                                 placeholder="john@example.com"
//                                 className={`w-full px-4 py-3 border rounded-lg outline-none transition ${errors.email
//                                     ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent'
//                                     : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
//                                     }`}
//                             />
//                             {errors.email && (
//                                 <p className="mt-1 text-sm text-red-600 flex items-center">
//                                     <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                     </svg>
//                                     {errors.email}
//                                 </p>
//                             )}
//                         </div>

//                         <div>
//                             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                                 Password
//                             </label>
//                             <input
//                                 type="password"
//                                 id="password"
//                                 name="password"
//                                 value={formData.password}
//                                 onChange={handleChange}
//                                 required
//                                 placeholder="••••••••"
//                                 className={`w-full px-4 py-3 border rounded-lg outline-none transition ${errors.password
//                                     ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent'
//                                     : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
//                                     }`}
//                             />
//                             {errors.password && (
//                                 <p className="mt-1 text-sm text-red-600 flex items-center">
//                                     <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                     </svg>
//                                     {errors.password}
//                                 </p>
//                             )}
//                         </div>

//                         <div>
//                             <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
//                                 Confirm password
//                             </label>
//                             <input
//                                 type="password"
//                                 id="confirmPassword"
//                                 name="confirmPassword"
//                                 value={formData.confirmPassword}
//                                 onChange={handleChange}
//                                 required
//                                 placeholder="••••••••"
//                                 className={`w-full px-4 py-3 border rounded-lg outline-none transition ${errors.confirmPassword
//                                     ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent'
//                                     : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
//                                     }`}
//                             />
//                             {errors.confirmPassword && (
//                                 <p className="mt-1 text-sm text-red-600 flex items-center">
//                                     <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                     </svg>
//                                     {errors.confirmPassword}
//                                 </p>
//                             )}
//                         </div>

//                         <div className="flex items-start">
//                             <input
//                                 type="checkbox"
//                                 id="terms"
//                                 checked={acceptTerms}
//                                 onChange={(e) => setAcceptTerms(e.target.checked)}
//                                 className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1 cursor-pointer"
//                             />
//                             <label htmlFor="terms" className="ml-2 text-sm text-gray-600 cursor-pointer">
//                                 I agree to the{' '}
//                                 <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
//                                     Terms of Service
//                                 </a>{' '}
//                                 and{' '}
//                                 <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
//                                     Privacy Policy
//                                 </a>
//                             </label>
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//                         >
//                             {loading ? (
//                                 <>
//                                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                     Creating account...
//                                 </>
//                             ) : (
//                                 'Create account'
//                             )}
//                         </button>

//                         <div className="relative my-6">
//                             <div className="absolute inset-0 flex items-center">
//                                 <div className="w-full border-t border-gray-300"></div>
//                             </div>
//                             <div className="relative flex justify-center text-sm">
//                                 <span className="px-2 bg-gray-50 text-gray-500">Or sign up with</span>
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-2 gap-4">
//                             <button
//                                 type="button"
//                                 className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-white transition"
//                             >
//                                 <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                                     <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
//                                     <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
//                                     <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
//                                     <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
//                                 </svg>
//                                 <span className="text-sm font-medium text-gray-700">Google</span>
//                             </button>

//                             <button
//                                 type="button"
//                                 className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-white transition"
//                             >
//                                 <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
//                                     <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
//                                 </svg>
//                                 <span className="text-sm font-medium text-gray-700">GitHub</span>
//                             </button>
//                         </div>
//                     </form>

//                     <p className="mt-8 text-center text-sm text-gray-600">
//                         Already have an account?{' '}
//                         <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
//                             Sign in
//                         </Link>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Register;


// import { useState, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext';
// import toast from 'react-hot-toast';

// const Register = () => {
//     const navigate = useNavigate();
//     const { register } = useContext(AuthContext);
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//         avatar: '/avatars/avatar1.png'
//     });
//     const [errors, setErrors] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [acceptTerms, setAcceptTerms] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//     // Avatar options
//     const avatars = [
//         { id: 1, url: '/avatars/avatar1.png', emoji: '👨‍💼' },
//         { id: 2, url: '/avatars/avatar2.png', emoji: '👩‍💼' },
//         { id: 3, url: '/avatars/avatar3.png', emoji: '🧑‍💻' },
//         { id: 4, url: '/avatars/avatar4.png', emoji: '👨‍🎨' },
//         { id: 5, url: '/avatars/avatar5.png', emoji: '👩‍🔬' },
//         { id: 6, url: '/avatars/avatar6.png', emoji: '🧑‍🚀' },
//         { id: 7, url: '/avatars/avatar7.png', emoji: '👨‍🍳' },
//         { id: 8, url: '/avatars/avatar8.png', emoji: '👩‍🎤' },
//     ];

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value
//         });

//         if (errors[name]) {
//             setErrors({
//                 ...errors,
//                 [name]: ''
//             });
//         }
//     };

//     const handleAvatarSelect = (avatarUrl) => {
//         setFormData({
//             ...formData,
//             avatar: avatarUrl
//         });
//     };

//     const validateForm = () => {
//         const newErrors = {};

//         // Name validation
//         if (!formData.name) {
//             newErrors.name = 'Name is required';
//         } else if (formData.name.length < 2) {
//             newErrors.name = 'Name must be at least 2 characters';
//         }

//         // Email validation
//         if (!formData.email) {
//             newErrors.email = 'Email is required';
//         } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//             newErrors.email = 'Please enter a valid email address';
//         }

//         // Password validation
//         if (!formData.password) {
//             newErrors.password = 'Password is required';
//         } else if (formData.password.length < 6) {
//             newErrors.password = 'Password must be at least 6 characters';
//         }

//         // Confirm password validation
//         if (!formData.confirmPassword) {
//             newErrors.confirmPassword = 'Please confirm your password';
//         } else if (formData.password !== formData.confirmPassword) {
//             newErrors.confirmPassword = 'Passwords do not match';
//         }

//         // Terms validation
//         if (!acceptTerms) {
//             newErrors.terms = 'You must accept the terms and conditions';
//         }
//         setErrors(newErrors);

//         // Show toast for first error
//         if (Object.keys(newErrors).length > 0) {
//             const firstError = Object.values(newErrors)[0];
//             toast.error(firstError);
//         }

//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!validateForm()) return;

//         setLoading(true);

//         try {
//             await register(formData.name, formData.email, formData.password);
//             toast.success('Account created successfully! 🎉');
//             navigate('/dashboard');
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex">
//             {/* Left Side - Branding */}
//             <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-blue-600 to-blue-700 items-center justify-center p-12 relative overflow-hidden">
//                 <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48"></div>
//                 <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full -ml-36 -mb-36"></div>

//                 <div className="relative z-10 text-white max-w-md">
//                     <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-3xl font-bold mb-8 backdrop-blur-sm">
//                         T
//                     </div>
//                     <h1 className="text-5xl font-bold mb-6">Join TaskFlow AI</h1>
//                     <p className="text-xl text-white text-opacity-90 mb-8">
//                         Start managing your projects smarter with AI-powered insights and real-time collaboration.
//                     </p>

//                     <div className="space-y-4">
//                         <div className="flex items-center space-x-3">
//                             <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
//                                 ⚡
//                             </div>
//                             <span className="text-lg">Get started in minutes</span>
//                         </div>
//                         <div className="flex items-center space-x-3">
//                             <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
//                                 🎯
//                             </div>
//                             <span className="text-lg">Free for personal use</span>
//                         </div>
//                         <div className="flex items-center space-x-3">
//                             <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
//                                 🚀
//                             </div>
//                             <span className="text-lg">Join 10,000+ teams</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Right Side - Register Form */}
//             <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
//                 <div className="max-w-md w-full">
//                     {/* Mobile Logo */}
//                     <div className="lg:hidden text-center mb-8">
//                         <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
//                             T
//                         </div>
//                     </div>

//                     <div className="text-center mb-8">
//                         <h2 className="text-3xl font-bold text-gray-800 mb-2">Create your account</h2>
//                         <p className="text-gray-600">Get started with TaskFlow AI today</p>
//                     </div>

//                     {/* Form-level error */}
//                     {errors.form && (
//                         <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
//                             <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                             <div className="text-sm text-red-700">{errors.form}</div>
//                         </div>
//                     )}

//                     <form onSubmit={handleSubmit} className="space-y-5">
//                         {/* Avatar Selection */}
//                         {/* <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-3">
//                                 Choose your avatar
//                             </label>
//                             <div className="grid grid-cols-4 gap-3">
//                                 {avatars.map((avatar) => (
//                                     <button
//                                         key={avatar.id}
//                                         type="button"
//                                         onClick={() => handleAvatarSelect(avatar.url)}
//                                         className={`w-full aspect-square rounded-lg flex items-center justify-center text-3xl transition-all ${formData.avatar === avatar.url
//                                                 ? 'bg-blue-100 border-2 border-blue-500 scale-105 shadow-lg'
//                                                 : 'bg-gray-100 border-2 border-gray-200 hover:border-blue-300 hover:bg-gray-50'
//                                             }`}
//                                     >
//                                         {avatar.emoji}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div> */}

//                         {/* Name Field - Inline */}
//                         <div className="flex items-start gap-4">
//                             <label htmlFor="name" className="text-sm font-medium text-gray-700 pt-3 w-32 flex-shrink-0">
//                                 Full name
//                             </label>
//                             <div className="flex-1">
//                                 <input
//                                     type="text"
//                                     id="name"
//                                     name="name"
//                                     value={formData.name}
//                                     onChange={handleChange}
//                                     required
//                                     className={`w-full px-4 py-3 border rounded-lg outline-none transition ${errors.name
//                                         ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent'
//                                         : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
//                                         }`}
//                                 />
//                                 {errors.name && (
//                                     <p className="mt-1 text-sm text-red-600 flex items-center">
//                                         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                         </svg>
//                                         {errors.name}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Email Field - Inline */}
//                         <div className="flex items-start gap-4">
//                             <label htmlFor="email" className="text-sm font-medium text-gray-700 pt-3 w-32 flex-shrink-0">
//                                 Email address
//                             </label>
//                             <div className="flex-1">
//                                 <input
//                                     type="email"
//                                     id="email"
//                                     name="email"
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                     required
//                                     className={`w-full px-4 py-3 border rounded-lg outline-none transition ${errors.email
//                                         ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent'
//                                         : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
//                                         }`}
//                                 />
//                                 {errors.email && (
//                                     <p className="mt-1 text-sm text-red-600 flex items-center">
//                                         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                         </svg>
//                                         {errors.email}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Password Field - Inline */}
//                         {/* <div className="flex items-start gap-4">
//                             <label htmlFor="password" className="text-sm font-medium text-gray-700 pt-3 w-32 flex-shrink-0">
//                                 Password
//                             </label>
//                             <div className="flex-1">
//                                 <input
//                                     type="password"
//                                     id="password"
//                                     name="password"
//                                     value={formData.password}
//                                     onChange={handleChange}
//                                     required
//                                     placeholder="••••••••"
//                                     className={`w-full px-4 py-3 border rounded-lg outline-none transition ${errors.password
//                                         ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent'
//                                         : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
//                                         }`}
//                                 />
//                                 {errors.password && (
//                                     <p className="mt-1 text-sm text-red-600 flex items-center">
//                                         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                         </svg>
//                                         {errors.password}
//                                     </p>
//                                 )}
//                             </div>
//                         </div> */}

//                         <div className="flex items-start gap-4">
//                             <label htmlFor="password" className="text-sm font-medium text-gray-700 pt-3 w-32 flex-shrink-0">
//                                 Password
//                             </label>
//                             <div className="flex-1">
//                                 <div className="relative">
//                                     <input
//                                         type={showPassword ? 'text' : 'password'}
//                                         id="password"
//                                         name="password"
//                                         value={formData.password}
//                                         onChange={handleChange}
//                                         className={`w-full px-4 py-3 pr-12 border rounded-lg outline-none transition ${errors.password
//                                             ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent'
//                                             : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
//                                             }`}
//                                         placeholder="••••••••"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
//                                     >
//                                         {showPassword ? (
//                                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                                             </svg>
//                                         ) : (
//                                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                             </svg>
//                                         )}
//                                     </button>
//                                 </div>
//                                 {errors.password && (
//                                     <p className="mt-1 text-sm text-red-600 flex items-center">
//                                         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                         </svg>
//                                         {errors.password}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Confirm Password Field - Inline */}
//                         {/* <div className="flex items-start gap-4">
//                             <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 pt-3 w-32 flex-shrink-0">
//                                 Confirm password
//                             </label>
//                             <div className="flex-1">
//                                 <input
//                                     type="password"
//                                     id="confirmPassword"
//                                     name="confirmPassword"
//                                     value={formData.confirmPassword}
//                                     onChange={handleChange}
//                                     required
//                                     placeholder="••••••••"
//                                     className={`w-full px-4 py-3 border rounded-lg outline-none transition ${errors.confirmPassword
//                                         ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent'
//                                         : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
//                                         }`}
//                                 />
//                                 {errors.confirmPassword && (
//                                     <p className="mt-1 text-sm text-red-600 flex items-center">
//                                         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                         </svg>
//                                         {errors.confirmPassword}
//                                     </p>
//                                 )}
//                             </div>
//                         </div> */}

//                         <div className="flex items-start gap-4">
//                             <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 pt-3 w-32 flex-shrink-0">
//                                 Password
//                             </label>
//                             <div className="flex-1">
//                                 <div className="relative">
//                                     <input
//                                         type={showConfirmPassword ? 'text' : 'password'}
//                                         id="confirmPassword"
//                                         name="confirmPassword"
//                                         value={formData.confirmPassword}
//                                         onChange={handleChange}
//                                         className={`w-full px-4 py-3 pr-12 border rounded-lg outline-none transition ${errors.confirmPassword
//                                             ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent'
//                                             : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
//                                             }`}
//                                         placeholder="••••••••"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
//                                     >
//                                         {showConfirmPassword ? (
//                                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                                             </svg>
//                                         ) : (
//                                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                             </svg>
//                                         )}
//                                     </button>
//                                 </div>
//                                 {errors.confirmPassword && (
//                                     <p className="mt-1 text-sm text-red-600 flex items-center">
//                                         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                         </svg>
//                                         {errors.confirmPassword}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="flex items-start">
//                             <input
//                                 type="checkbox"
//                                 id="terms"
//                                 checked={acceptTerms}
//                                 onChange={(e) => setAcceptTerms(e.target.checked)}
//                                 className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1 cursor-pointer"
//                             />
//                             <label htmlFor="terms" className="ml-2 text-sm text-gray-600 cursor-pointer">
//                                 I agree to the{' '}
//                                 <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
//                                     Terms of Service
//                                 </a>{' '}
//                                 and{' '}
//                                 <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
//                                     Privacy Policy
//                                 </a>
//                             </label>
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//                         >
//                             {loading ? (
//                                 <>
//                                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                     Creating account...
//                                 </>
//                             ) : (
//                                 'Create account'
//                             )}
//                         </button>

//                         <div className="relative my-6">
//                             <div className="absolute inset-0 flex items-center">
//                                 <div className="w-full border-t border-gray-300"></div>
//                             </div>
//                             <div className="relative flex justify-center text-sm">
//                                 <span className="px-2 bg-gray-50 text-gray-500">Or sign up with</span>
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-2 gap-4">
//                             <button
//                                 type="button"
//                                 className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-white transition"
//                             >
//                                 <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                                     <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
//                                     <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
//                                     <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
//                                     <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
//                                 </svg>
//                                 <span className="text-sm font-medium text-gray-700">Google</span>
//                             </button>

//                             <button
//                                 type="button"
//                                 className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-white transition"
//                             >
//                                 <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
//                                     <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
//                                 </svg>
//                                 <span className="text-sm font-medium text-gray-700">GitHub</span>
//                             </button>
//                         </div>
//                     </form>

//                     <p className="mt-8 text-center text-sm text-gray-600">
//                         Already have an account?{' '}
//                         <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
//                             Sign in
//                         </Link>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Register;



import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import OTPVerification from './OTPVerification';

const Register = () => {
    const { register, loginWithGoogle, loginWithGithub } = useContext(AuthContext);
    const [showOTPScreen, setShowOTPScreen] = useState(false);
    const [registrationData, setRegistrationData] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        avatar: '/avatars/avatar1.png'
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const avatars = [
        { id: 1, url: '/avatars/avatar1.png', emoji: '👨‍💼' },
        { id: 2, url: '/avatars/avatar2.png', emoji: '👩‍💼' },
        { id: 3, url: '/avatars/avatar3.png', emoji: '🧑‍💻' },
        { id: 4, url: '/avatars/avatar4.png', emoji: '👨‍🎨' },
        { id: 5, url: '/avatars/avatar5.png', emoji: '👩‍🔬' },
        { id: 6, url: '/avatars/avatar6.png', emoji: '🧑‍🚀' },
        { id: 7, url: '/avatars/avatar7.png', emoji: '👨‍🍳' },
        { id: 8, url: '/avatars/avatar8.png', emoji: '👩‍🎤' },
    ];

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

    const handleAvatarSelect = (avatarUrl) => {
        setFormData({
            ...formData,
            avatar: avatarUrl
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!acceptTerms) {
            newErrors.terms = 'You must accept the terms and conditions';
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
        

        if (!validateForm()) return;

        setLoading(true);

        try {
            // Register will send OTP to email
            const result = await register(
                formData.name,
                formData.email,
                formData.password,
                // formData.avatar
            );
            

            if (result.requiresOTP) {
                // Show OTP verification screen
                setRegistrationData(result);
                setShowOTPScreen(true);
                toast.success('OTP sent to your email! Please check your inbox.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleBackFromOTP = () => {
        setShowOTPScreen(false);
        setRegistrationData(null);
    };

    // Google OAuth handler
    const handleGoogleSignup = async () => {
        try {
            await loginWithGoogle();
            toast.success('Account created successfully! 🎉');
        } catch (error) {
            let errorMessage = 'Google signup failed';

            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Signup cancelled';
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = 'Please allow popups for this site';
            } else if (error.code === 'auth/account-exists-with-different-credential') {
                errorMessage = 'An account already exists with this email';
            }

            toast.error(errorMessage);
        }
    };

    // GitHub OAuth handler
    const handleGithubSignup = async () => {
        try {
            await loginWithGithub();
            toast.success('Account created successfully! 🎉');
        } catch (error) {
            let errorMessage = 'GitHub signup failed';

            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Signup cancelled';
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = 'Please allow popups for this site';
            } else if (error.code === 'auth/account-exists-with-different-credential') {
                errorMessage = 'An account already exists with this email';
            }

            toast.error(errorMessage);
        }
    };

    // Show OTP verification screen if needed
    if (showOTPScreen && registrationData) {
        return <OTPVerification registrationData={registrationData} onBack={handleBackFromOTP} />;
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-blue-600 to-blue-700 items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full -ml-36 -mb-36"></div>

                <div className="relative z-10 text-white max-w-md">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-3xl font-bold mb-8 backdrop-blur-sm">
                        T
                    </div>
                    <h1 className="text-5xl font-bold mb-6">Join TaskFlow AI</h1>
                    <p className="text-xl text-white text-opacity-90 mb-8">
                        Start managing your projects smarter with AI-powered insights and real-time collaboration.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                ⚡
                            </div>
                            <span className="text-lg">Get started in minutes</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                🎯
                            </div>
                            <span className="text-lg">Free for personal use</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                🚀
                            </div>
                            <span className="text-lg">Join 10,000+ teams</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
                <div className="max-w-md w-full">
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                            T
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create your account</h2>
                        {/* <p className="text-gray-600">Get started with TaskFlow AI today</p> */}
                    </div>

                    {errors.form && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                            <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-sm text-red-700">{errors.form}</div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Avatar Selection */}
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Choose your avatar
                            </label>
                            <div className="grid grid-cols-4 gap-3">
                                {avatars.map((avatar) => (
                                    <button
                                        key={avatar.id}
                                        type="button"
                                        onClick={() => handleAvatarSelect(avatar.url)}
                                        className={`w-full aspect-square rounded-lg flex items-center justify-center text-3xl transition-all ${formData.avatar === avatar.url
                                                ? 'bg-blue-100 border-2 border-blue-500 scale-105 shadow-lg'
                                                : 'bg-gray-100 border-2 border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {avatar.emoji}
                                    </button>
                                ))}
                            </div>
                        </div> */}

                        {/* Name Field */}
                        <div className="flex items-start gap-4">
                            <label htmlFor="name" className="text-sm font-medium text-gray-700 pt-3 w-32 flex-shrink-0">
                                Full name
                            </label>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-3 py-2 border rounded-lg outline-none transition ${errors.name
                                        ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent'
                                        : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="flex items-start gap-4">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700 pt-3 w-32 flex-shrink-0">
                                Email address
                            </label>
                            <div className="flex-1">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-3 py-2 border rounded-lg outline-none transition ${errors.email
                                        ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent'
                                        : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="flex items-start gap-4">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700 pt-3 w-32 flex-shrink-0">
                                Password
                            </label>
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className={`w-full px-3 py-2 pr-12 border rounded-lg outline-none transition ${errors.password
                                            ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent'
                                            : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            }`}
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
                        </div>

                        {/* Confirm Password Field */}
                        <div className="flex items-start gap-4">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 pt-3 w-32 flex-shrink-0">
                                Confirm password
                            </label>
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className={`w-full px-3 py-2 pr-12 border rounded-lg outline-none transition ${errors.confirmPassword
                                            ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent'
                                            : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            }`}
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
                        </div>

                        {/* Terms Checkbox */}
                        {/* <div className="flex items-start">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={acceptTerms}
                                onChange={(e) => setAcceptTerms(e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1 cursor-pointer"
                            />
                            <label htmlFor="terms" className="ml-2 text-sm text-gray-600 cursor-pointer">
                                I agree to the{' '}
                                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Privacy Policy
                                </a>
                            </label>
                        </div> */}

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending OTP...
                                </>
                            ) : (
                                'Continue →'
                            )}
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-50 text-gray-500">Or sign up with</span>
                            </div>
                        </div>

                        {/* OAuth Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={handleGoogleSignup}
                                className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-white hover:shadow-sm transition"
                            >
                                <svg className="w-4 h-54mr-2" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700">Google</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleGithubSignup}
                                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-white hover:shadow-sm transition"
                            >
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700">GitHub</span>
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;