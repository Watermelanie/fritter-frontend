import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Report, PopulatedReport} from '../report/model';

// Update this if you add a property to the Report type!
type ReportResponse = {
  _id: string;
  author: string;
  freet: string;
  type: string;
  content: string;
};

/**
 * Transform a raw Report object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Report>} report - A report
 * @returns {ReportResponse} - The freet object formatted for the frontend
 */
const constructReportResponse = (report: HydratedDocument<Report>): ReportResponse => {
  const reportCopy: PopulatedReport = {
    ...report.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = reportCopy.authorId;
  const {_id} = reportCopy.freetId;
  delete reportCopy.authorId;
  delete reportCopy.freetId;
  return {
    ...reportCopy,
    _id: reportCopy._id.toString(),
    author: username,
    freet: _id.toString(),
    type: reportCopy.type
  };
};

export {
  constructReportResponse
};
