import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a ContentFilter
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for ContentFilter on the backend
export type ContentFilter = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freetId: Types.ObjectId;
  detect: boolean;
};

export type PopulatedContentFilter = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freetId: Freet;
  detect: boolean;
};

// Mongoose schema definition for interfacing with a MongoDB table
// ContentFilters stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ContentFilterSchema = new Schema<ContentFilter>({
  // The freet
  freetId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  // Whether inappropriate words were detected for the freet
  detect: {
    type: Boolean,
    required: true
  }
});

const ContentFilterModel = model<ContentFilter>('ContentFilter', ContentFilterSchema);
export default ContentFilterModel;
