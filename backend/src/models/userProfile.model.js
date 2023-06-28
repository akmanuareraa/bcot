const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      unique: false,
      trim: true,
      lowercase: true,
    },
    subscription: {
      type: Object,
      required: true,
      trim: true,
    },
    savedQueries: {
      type: Array,
      required: true,
      trim: true,
    },
    misc: {
      type: Object,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * @typedef UserProfile
 */
const UserProfile = mongoose.model('UserProfile', userSchema, "profiles");

module.exports = UserProfile;
