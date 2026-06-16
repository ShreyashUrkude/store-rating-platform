const { check } = require('express-validator');

const standardEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

exports.validateSignup = [
    check('name')
        .isLength({ min: 20, max: 60 }).withMessage('Name must be between 20 and 60 characters'),
    check('email')
        .isEmail().withMessage('Provide a valid email address')
        .matches(standardEmailRegex).withMessage('Email must follow standard format layout rules (e.g., user@domain.com)'),
    check('address')
        .isLength({ max: 400 }).withMessage('Address cannot exceed 400 characters'),
    check('password')
        .isLength({ min: 8, max: 16 }).withMessage('Password must be 8-16 characters')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character')
];

exports.validatePasswordUpdate = [
    check('newPassword')
        .isLength({ min: 8, max: 16 }).withMessage('Password must be 8-16 characters')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character')
];