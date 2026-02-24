import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Project name is required'],
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['owner', 'admin', 'member', 'viewer'],
            default: 'member'
        }
    }],
    status: {
        type: String,
        enum: ['active', 'archived', 'completed',],
        default: 'active'
    },
    color: {
        type: String,
        default: '#3b82f6'
    },
    dueDate: {
        type: Date,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Project', projectSchema);