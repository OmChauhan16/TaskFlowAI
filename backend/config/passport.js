// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const GitHubStrategy = require('passport-github2').Strategy;
// const User = require('../models/User');
// import passport from 'passport';
// // Serialize user for session
// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// // Deserialize user from session
// passport.deserializeUser(async (id, done) => {
//     try {
//         const user = await User.findById(id);
//         done(null, user);
//     } catch (error) {
//         done(error, null);
//     }
// });

// // Google OAuth Strategy
// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//             callbackURL: '/auth/google/callback',
//             proxy: true
//         },
//         async (accessToken, refreshToken, profile, done) => {
//             try {
//                 // Check if user already exists
//                 let user = await User.findOne({ email: profile.emails[0].value });

//                 if (user) {
//                     // User exists, check if Google ID needs to be added
//                     if (!user.googleId) {
//                         user.googleId = profile.id;
//                         await user.save();
//                     }
//                     return done(null, user);
//                 }

//                 // Create new user
//                 user = await User.create({
//                     googleId: profile.id,
//                     name: profile.displayName,
//                     email: profile.emails[0].value,
//                     avatar: profile.photos[0].value,
//                     password: Math.random().toString(36).slice(-8), // Random password
//                     isEmailVerified: true // Google emails are verified
//                 });

//                 done(null, user);
//             } catch (error) {
//                 done(error, null);
//             }
//         }
//     )
// );

// // GitHub OAuth Strategy
// passport.use(
//     new GitHubStrategy(
//         {
//             clientID: process.env.GITHUB_CLIENT_ID,
//             clientSecret: process.env.GITHUB_CLIENT_SECRET,
//             callbackURL: '/auth/github/callback',
//             scope: ['user:email']
//         },
//         async (accessToken, refreshToken, profile, done) => {
//             try {
//                 // GitHub might not provide email directly
//                 const email = profile.emails && profile.emails[0]
//                     ? profile.emails[0].value
//                     : `${profile.username}@github.com`;

//                 let user = await User.findOne({ email });

//                 if (user) {
//                     if (!user.githubId) {
//                         user.githubId = profile.id;
//                         await user.save();
//                     }
//                     return done(null, user);
//                 }

//                 user = await User.create({
//                     githubId: profile.id,
//                     name: profile.displayName || profile.username,
//                     email,
//                     avatar: profile.photos[0].value,
//                     password: Math.random().toString(36).slice(-8),
//                     isEmailVerified: true
//                 });

//                 done(null, user);
//             } catch (error) {
//                 done(error, null);
//             }
//         }
//     )
// );

// module.exports = passport;

// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { Strategy as GitHubStrategy } from 'passport-github2';
// import User from '../models/User.js';

// // Serialize user for session
// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// // Deserialize user from session
// passport.deserializeUser(async (id, done) => {
//     try {
//         const user = await User.findById(id);
//         done(null, user);
//     } catch (error) {
//         done(error, null);
//     }
// });

// // Google OAuth Strategy
// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//             callbackURL: '/auth/google/callback',
//             proxy: true
//         },
//         async (accessToken, refreshToken, profile, done) => {
//             try {
//                 let user = await User.findOne({
//                     email: profile.emails[0].value
//                 });

//                 if (user) {
//                     if (!user.googleId) {
//                         user.googleId = profile.id;
//                         await user.save();
//                     }
//                     return done(null, user);
//                 }

//                 user = await User.create({
//                     googleId: profile.id,
//                     name: profile.displayName,
//                     email: profile.emails[0].value,
//                     avatar: profile.photos[0].value,
//                     password: Math.random().toString(36).slice(-8),
//                     isEmailVerified: true
//                 });

//                 done(null, user);
//             } catch (error) {
//                 done(error, null);
//             }
//         }
//     )
// );

// // GitHub OAuth Strategy
// passport.use(
//     new GitHubStrategy(
//         {
//             clientID: process.env.GITHUB_CLIENT_ID,
//             clientSecret: process.env.GITHUB_CLIENT_SECRET,
//             callbackURL: '/auth/github/callback',
//             scope: ['user:email']
//         },
//         async (accessToken, refreshToken, profile, done) => {
//             try {
//                 const email =
//                     profile.emails && profile.emails[0]
//                         ? profile.emails[0].value
//                         : `${profile.username}@github.com`;

//                 let user = await User.findOne({ email });

//                 if (user) {
//                     if (!user.githubId) {
//                         user.githubId = profile.id;
//                         await user.save();
//                     }
//                     return done(null, user);
//                 }

//                 user = await User.create({
//                     githubId: profile.id,
//                     name: profile.displayName || profile.username,
//                     email,
//                     avatar: profile.photos[0].value,
//                     password: Math.random().toString(36).slice(-8),
//                     isEmailVerified: true
//                 });

//                 done(null, user);
//             } catch (error) {
//                 done(error, null);
//             }
//         }
//     )
// );

// export default passport;
