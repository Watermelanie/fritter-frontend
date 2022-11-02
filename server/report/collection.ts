import type {HydratedDocument, Types} from 'mongoose';
import type {Report} from './model';
import ReportModel from './model';
import FreetCollection from '../freet/collection';
import ContentFilterCollection from '../contentFilter/collection';

/**
 * This files contains a class that has the functionality to explore reports
 * stored in MongoDB, including adding and finding reports.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Report> is the output of the ReportModel() constructor,
 * and contains all the information in Report. https://mongoosejs.com/docs/typescript.html
 */
class ReportCollection {
  /**
   * Add a report to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} freetId - The id of the freet
   * @param {string} type - The type of the report
   * @param {string} content - The id of the content of the report
   * @return {Promise<HydratedDocument<Report>>} - The newly created report
   */
  static async addOne(authorId: Types.ObjectId | string, freetId: Types.ObjectId | string, type: string, content: string): Promise<HydratedDocument<Report>> {
    const report = new ReportModel({
      authorId,
      freetId,
      type,
      content
    });
    await report.save(); // Saves report to MongoDB
    return report.populate('authorId', 'freetId');
  }

  /**
   * Get all the reports of a freet in the database
   *
   * @param {string} freetId - The id of the freet
   * @return {Promise<HydratedDocument<Report>[]>} - An array of all of the reports
   */
  static async findAll(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Report>>> {
    const freet = await FreetCollection.findOne(freetId);
    return ReportModel.find({freetId: freet._id}).populate('freetId');
  }

  /**
   * Get the count of all reports to a freet
   *
   * @param {string} freetId - The id of the freet
   * @return {Promise<number>} - An count of all of the reports
   */
  static async getCountofAll(freetId: Types.ObjectId | string): Promise<number> {
    const detect = await ContentFilterCollection.getStatus(freetId);
    let count = (await this.findAll(freetId)).length;
    if (detect) {
      count += 10;
    }

    return count;
  }

  /**
   * Get all the certain type of reports of a freet in the database
   *
   * @param {string} freetId - The id of the freet
   * @param {string} type - The type of report
   * @return {Promise<HydratedDocument<Report>[]>} - An array of all of the reports
   */
  static async findAllOfType(freetId: Types.ObjectId | string, type: string): Promise<Array<HydratedDocument<Report>>> {
    const freet = await FreetCollection.findOne(freetId);
    return ReportModel.find({freetId: freet._id, type}).populate('freetId');
  }

  /**
   * Get the count of a type of reports to a freet
   *
   * @param {string} freetId - The id of the freet
   * @param {string} type - The type of report
   * @return {Promise<number>} - An count of the type of report
   */
  static async getCountofType(freetId: Types.ObjectId | string, type: string): Promise<number> {
    const count = (await this.findAllOfType(freetId, type)).length;
    return count;
  }

  /**
   * Delete all the reports of a freet
   *
   * @param {string} freetId - The id of author of freets
   */
  static async deleteManyByFreet(freetId: Types.ObjectId | string): Promise<void> {
    await ReportModel.deleteMany({freetId});
  }

  /**
   * Delete all the reports by an author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteManyByAuthor(authorId: Types.ObjectId | string): Promise<void> {
    await ReportModel.deleteMany({authorId});
  }
}

export default ReportCollection;
