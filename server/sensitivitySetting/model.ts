import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a SensitivitySetting
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for SensitivitySetting on the backend
export type SensitivitySetting = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: Types.ObjectId;
  showSensitiveContent: boolean;
  showHiddenFreet: boolean;
};

export type PopulatedSensitivitySetting = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  userId: User;
  showSensitiveContent: boolean;
  showHiddenFreet: boolean;
};

// Mongoose schema definition for interfacing with a MongoDB table
// SensitivitySettings stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const SensitivitySettingSchema = new Schema<SensitivitySetting>({
// User that the setting is for
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // Show sensitive content
  showSensitiveContent: {
    type: Boolean,
    required: true
  },
  // Show hidden freets
  showHiddenFreet: {
    type: Boolean,
    required: true
  }
});

const SensitivitySettingModel = model<SensitivitySetting>('SensitivitySetting', SensitivitySettingSchema);
export default SensitivitySettingModel;
