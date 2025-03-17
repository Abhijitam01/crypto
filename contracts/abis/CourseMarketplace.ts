/**
 * Course Marketplace ABI
 *
 * This file contains the ABI (Application Binary Interface) for the CourseMarketplace smart contract.
 * The CourseMarketplace contract handles course purchases, enrollments, and payments.
 *
 * Functions include:
 * - listCourse: List a course for sale
 * - purchaseCourse: Purchase and enroll in a course
 * - updateCoursePrice: Update the price of a course
 * - withdrawFunds: Withdraw earned funds (for instructors)
 * - getEnrollments: Get all enrollments for a user
 */

export const CourseMarketplaceABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_courseRegistry",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "courseId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "student",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "CoursePurchased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "courseId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "PriceUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "courseId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "student",
        "type": "address"
      }
    ],
    "name": "checkEnrollment",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type\": "\

