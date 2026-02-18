import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    avatar: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    avatarPublicId: { type: String, default: '' },  // Cloudinary public_id for deletion
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    // googleId: {
    //     type: String,
    //     sparse: true
    // },
    // githubId: {
    //     type: String,
    //     sparse: true
    // },
    firebaseUid: {
        type: String,
        sparse: true,
        unique: true
    },
    oauthProvider: {
        type: String,
        enum: ['google', 'github', 'local'],
        default: 'local'
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }]
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ email: 1 });
userSchema.index({ firebaseUid: 1 });
export default mongoose.model('User', userSchema);