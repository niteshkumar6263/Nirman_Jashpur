const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const administrativeApprovalController = require('../controllers/administrativeApprovalController');

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

// Routes
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sortBy').optional().isIn(['entryDate', 'lastModified', 'workName', 'approvalDate']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
], administrativeApprovalController.getAllApprovals);

router.get('/:id', administrativeApprovalController.getApprovalById);
router.post('/', validateAdministrativeApproval, handleValidationErrors, administrativeApprovalController.createApproval);
router.put('/:id', validateAdministrativeApproval, handleValidationErrors, administrativeApprovalController.updateApproval);
router.delete('/:id', administrativeApprovalController.deleteApproval);

module.exports = router;
