const mongoose = require('mongoose');

const workTypeSchema = new mongoose.Schema({
  workType: {
    type: String,
    required: [true, 'Work type is required'],
    trim: true,
    maxlength: [200, 'Work type cannot exceed 200 characters']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
    maxlength: [200, 'Department name cannot exceed 200 characters']
  },
  constituency: {
    type: String,
    trim: true,
    maxlength: [100, 'Constituency cannot exceed 100 characters'],
    default: null
  },
  engineer: {
    type: String,
    trim: true,
    maxlength: [200, 'Engineer name cannot exceed 200 characters'],
    default: null
  },
  scheme: {
    type: String,
    trim: true,
    maxlength: [200, 'Scheme name cannot exceed 200 characters'],
    default: null
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: null
  },
  area: {
    type: String,
    trim: true,
    maxlength: [100, 'Area name cannot exceed 100 characters'],
    default: null
  },
  city: {
    type: String,
    trim: true,
    maxlength: [100, 'City name cannot exceed 100 characters'],
    default: null
  },
  ward: {
    type: String,
    trim: true,
    maxlength: [50, 'Ward number cannot exceed 50 characters'],
    default: null
  },
  estimatedCost: {
    type: Number,
    min: [0, 'Estimated cost cannot be negative'],
    default: null
  },
  priority: {
    type: String,
    enum: {
      values: ['Low', 'Medium', 'High', 'Critical'],
      message: 'Priority must be Low, Medium, High, or Critical'
    },
    default: 'Medium'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  entryDate: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update lastModified on save
workTypeSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

// Virtual for full location
workTypeSchema.virtual('fullLocation').get(function() {
  const locations = [this.area, this.city, this.ward].filter(Boolean);
  return locations.length > 0 ? locations.join(', ') : null;
});

// Index for better query performance
workTypeSchema.index({ workType: 1, department: 1 });
workTypeSchema.index({ area: 1, city: 1 });
workTypeSchema.index({ engineer: 1 });
workTypeSchema.index({ scheme: 1 });
workTypeSchema.index({ isActive: 1, priority: 1 });
workTypeSchema.index({ entryDate: -1 });

// Compound index for common queries
workTypeSchema.index({ workType: 'text', description: 'text' });

module.exports = mongoose.model('WorkType', workTypeSchema);
