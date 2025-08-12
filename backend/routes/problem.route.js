const express = require('express');
const router = express.Router();
const { createProblem, getAllProblems, updateProblem, deleteProblem, getOneProblem } = require('../controllers/problem.controller');
const authenticate = require('../middleware/jwtVerify');
const authorizeAdmin = require('../middleware/adminCheck');

// Admin-only protected routes
router.post('/', authenticate, authorizeAdmin, createProblem);
router.get('/', getAllProblems);
router.put('/:id', authenticate, authorizeAdmin, updateProblem);
router.delete('/:id', authenticate, authorizeAdmin, deleteProblem);
router.get('/:id', getOneProblem);


module.exports = router;
