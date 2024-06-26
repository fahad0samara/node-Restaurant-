import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Middleware to handle validation errors
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }
  next();
};

export const validateMyUserRequest = [
  // Validation for user creation/update
  body("name").isString().notEmpty().withMessage("Name must be a non-empty string"),
  body("addressLine1").isString().notEmpty().withMessage("AddressLine1 must be a non-empty string"),
  body("city").isString().notEmpty().withMessage("City must be a non-empty string"),
  body("country").isString().notEmpty().withMessage("Country must be a non-empty string"),
  handleValidationErrors,
];

export const validateMyRestaurantRequest = [
  // Validation for restaurant creation/update
  body("restaurantName").notEmpty().withMessage("Restaurant name is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("country").notEmpty().withMessage("Country is required"),
  body("deliveryPrice").isFloat({ min: 0 }).withMessage("Delivery price must be a positive number"),
  body("estimatedDeliveryTime").isInt({ min: 0 }).withMessage("Estimated delivery time must be a positive integer"),
  body("cuisines")
    .isArray({ min: 1 }).withMessage("At least one cuisine is required")
    .custom((value: string[]) => value.every(item => typeof item === 'string')).withMessage("Cuisines must be an array of strings"),
  body("menuItems").isArray().withMessage("Menu items must be an array"),
  body("menuItems.*.name").notEmpty().withMessage("Menu item name is required"),
  body("menuItems.*.price").isFloat({ min: 0 }).withMessage("Menu item price must be a positive number"),
  handleValidationErrors,
];
