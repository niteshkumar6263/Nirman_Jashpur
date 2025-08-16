const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const AdministrativeApproval = require('../models/AdministrativeApproval');

// Validation middleware
const validateAdministrativeApproval = [
  body('workName')
    .trim()
    .notEmpty()
    .withMessage('Work name is required')
    .isLength({ max: 500 })
    .withMessage('Work name cannot exceed 500 characters'),
  
  body('area')
    .trim()
    .notEmpty()
    .withMessage('Area is required')
    .isLength({ max: 100 })
    .withMessage('Area cannot exceed 100 characters'),
  
  body('workAgency')
    .trim()
    .notEmpty()
    .withMessage('Work agency is required')
    .isLength({ max: 200 })
    .withMessage('Work agency cannot exceed 200 characters'),
  
  body('scheme')
    .trim()
    .notEmpty()
    .withMessage('Scheme is required')
    .isLength({ max: 200 })
    .withMessage('Scheme cannot exceed 200 characters'),
  
  body('technicalApproval')
    .trim()
    .notEmpty()
    .withMessage('Technical approval is required')
    .isLength({ max: 100 })
    .withMessage('Technical approval cannot exceed 100 characters'),
  
  body('administrativeApproval')
    .trim()
    .notEmpty()
    .withMessage('Administrative approval is required')
    .isLength({ max: 100 })
    .withMessage('Administrative approval cannot exceed 100 characters'),
  
  body('workProgressStage')
    .optional()
    .isIn(['Pending', 'In Progress', 'Completed'])
    .withMessage('Work progress stage must be Pending, In Progress, or Completed'),
  
  body('workDetails')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Work details cannot exceed 1000 characters'),
  
  body('tenderApproval')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Tender approval cannot exceed 100 characters'),
    
  body('approvalDate')
    .optional()
    .isISO8601()
    .withMessage('Approval date must be a valid date'),
    
  body('approvalAuthority')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Approval authority cannot exceed 200 characters'),
    
  body('approvalAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Approval amount must be a positive number'),
    
  body('approvalStatus')
    .optional()
    .isIn(['Pending', 'Approved', 'Rejected', 'Under Review'])
    .withMessage('Invalid approval status'),
    
  body('remarks')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Remarks cannot exceed 500 characters')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Helper function to build filter query
const buildFilterQuery = (queryParams) => {
  const filter = {};
  
  if (queryParams.area) {
    filter.area = new RegExp(queryParams.area, 'i');
  }
  
  if (queryParams.scheme) {
    filter.scheme = new RegExp(queryParams.scheme, 'i');
  }
  
  if (queryParams.status) {
    filter.workProgressStage = queryParams.status;
  }
  
  if (queryParams.approvalStatus) {
    filter.approvalStatus = queryParams.approvalStatus;
  }
  
  if (queryParams.workAgency) {
    filter.workAgency = new RegExp(queryParams.workAgency, 'i');
  }
  
  if (queryParams.approvalAuthority) {
    filter.approvalAuthority = new RegExp(queryParams.approvalAuthority, 'i');
  }
  
  return filter;
};

// GET /administrative-approvals - Get all administrative approvals
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sortBy').optional().isIn(['entryDate', 'lastModified', 'workName', 'approvalDate']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
], async (req, res) => {
  try {
    handleValidationErrors(req, res, () => {});
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'entryDate';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    const filter = buildFilterQuery(req.query);
    
    const [approvals, total] = await Promise.all([
      AdministrativeApproval.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      AdministrativeApproval.countDocuments(filter)
    ]);
    
    res.json({
      data: approvals,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /administrative-approvals/:id - Get single administrative approval
router.get('/:id', async (req, res) => {
  try {
    const approval = await AdministrativeApproval.findById(req.params.id);
    
    if (!approval) {
      return res.status(404).json({ message: 'Administrative approval not found' });
    }
    
    res.json({ data: approval });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid administrative approval ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /administrative-approvals - Create new administrative approval
router.post('/', validateAdministrativeApproval, handleValidationErrors, async (req, res) => {
  try {
    const approval = new AdministrativeApproval(req.body);
    await approval.save();
    
    res.status(201).json({
      message: 'Administrative approval created successfully',
      data: approval
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => ({ field: err.path, message: err.message }))
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /administrative-approvals/:id - Update administrative approval
router.put('/:id', validateAdministrativeApproval, handleValidationErrors, async (req, res) => {
  try {
    const approval = await AdministrativeApproval.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!approval) {
      return res.status(404).json({ message: 'Administrative approval not found' });
    }
    
    res.json({
      message: 'Administrative approval updated successfully',
      data: approval
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid administrative approval ID' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => ({ field: err.path, message: err.message }))
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /administrative-approvals/:id - Delete administrative approval
router.delete('/:id', async (req, res) => {
  try {
    const approval = await AdministrativeApproval.findByIdAndDelete(req.params.id);
    
    if (!approval) {
      return res.status(404).json({ message: 'Administrative approval not found' });
    }
    
    res.json({ message: 'Administrative approval deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid administrative approval ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
