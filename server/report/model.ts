import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Report
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Report on the backend
export type Report = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  freetId: Types.ObjectId;
  type: string;
  content: string;
};

export type PopulatedReport = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  freetId: Freet;
  type: string;
  content: string;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Reports stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ReportSchema = new Schema<Report>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The freet's id
  freetId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  // The type of report
  type: {
    type: String,
    required: true
  },
  // The content of the report
  content: {
    type: String,
    required: false
  }
});

const ReportModel = model<Report>('Report', ReportSchema);
export default ReportModel;
