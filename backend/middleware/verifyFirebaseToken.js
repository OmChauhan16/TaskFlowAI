import admin from '../config/firebaseAdmin.js';

export const verifyFirebaseToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing Firebase token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.firebaseUser = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid Firebase token' });
    }
};
