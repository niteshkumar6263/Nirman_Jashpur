const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const workOrderController = require('../controllers/workOrderController');

// Validation middleware
const validateWorkOrder = [
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
  
  body('orderStatus')
    .optional()
    .isIn(['Pending', 'Issued', 'Completed'])
    .withMessage('Order status must be Pending, Issued, or Completed'),
  
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
    
  body('orderDate')
    .optional()
    .isISO8601()
    .withMessage('Order date must be a valid date'),
    
  body('completionDate')
    .optional()
    .isISO8601()
    .withMessage('Completion date must be a valid date')
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
  query('sortBy').optional().isIn(['entryDate', 'lastModified', 'workName', 'orderDate']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
], workOrderController.getAllWorkOrders);

router.get('/:id', workOrderController.getWorkOrderById);
router.post('/', validateWorkOrder, handleValidationErrors, workOrderController.createWorkOrder);
router.put('/:id', validateWorkOrder, handleValidationErrors, workOrderController.updateWorkOrder);
router.delete('/:id', workOrderController.deleteWorkOrder);

module.exports = router;
