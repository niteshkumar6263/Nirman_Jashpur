const express = require('express');
const router = express.Router();
const { query, validationResult } = require('express-validator');
const reportsController = require('../controllers/reportsController');

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
router.get('/agency-wise', [
  query('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('Year must be a valid year'),
  query('agency').optional().isString().withMessage('Agency must be a string')
], handleValidationErrors, reportsController.getAgencyWiseReport);

router.get('/block-wise', [
  query('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('Year must be a valid year'),
  query('block').optional().isString().withMessage('Block must be a string')
], handleValidationErrors, reportsController.getBlockWiseReport);

router.get('/scheme-wise', [
  query('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('Year must be a valid year'),
  query('scheme').optional().isString().withMessage('Scheme must be a string')
], handleValidationErrors, reportsController.getSchemeWiseReport);

router.get('/pending', [
  query('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('Year must be a valid year')
], handleValidationErrors, reportsController.getPendingWorksReport);

router.get('/final-status', [
  query('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('Year must be a valid year')
], handleValidationErrors, reportsController.getFinalStatusReport);

router.get('/engineer-wise', [
  query('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('Year must be a valid year'),
  query('engineer').optional().isString().withMessage('Engineer must be a string')
], handleValidationErrors, reportsController.getEngineerWiseReport);

router.get('/photo-missing', [
  query('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('Year must be a valid year')
], handleValidationErrors, reportsController.getPhotoMissingReport);

module.exports = router;
