import type {HydratedDocument, Types} from 'mongoose';
import type {ContentFilter} from './model';
import ContentFilterModel from './model';
import {CensorSensor} from 'censor-sensor';
import FreetCollection from '../freet/collection';

/**
 * This files contains a class that has the functionality to explore content filters
 * stored in MongoDB, including adding, running, and deleting content filters.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<ContentFilter> is the output of the ContentFilterModel() constructor,
 * and contains all the information in ContentFilter. https://mongoosejs.com/docs/typescript.html
 */
class ContentFilterCollection {
  /**
   * Add a content filter to the collection
   *
   * @param {string} freetId - The id of the freet
   * @param {boolean} detect - whether inappropriate words has been detected
   * @return {Promise<HydratedDocument<ContentFilter>>} - The newly created content filter
   */
  static async addOne(freetId: Types.ObjectId | string, detect: boolean): Promise<HydratedDocument<ContentFilter>> {
    const contentFilter = new ContentFilterModel({
      freetId,
      detect
    });
    await contentFilter.save(); // Saves report to MongoDB
    return contentFilter.populate('freetId');
  }

  /**
   * Get the status of detect for a content filter of a freet
   *
   * @param {string} freetId - The id of the freet
   * @return {Promise<boolean>} - The newly created content filter
   */
  static async getStatus(freetId: Types.ObjectId | string): Promise<boolean> {
    const freet = await FreetCollection.findOne(freetId);
    const contentFilter = await ContentFilterModel.findOne({freetId: freet._id}).populate('freetId');
    return contentFilter.detect;
  }

  /**
   * Update the status of detect for a content filter of a freet
   *
   * @param {string} freetId - The id of the freet
   * @param {boolean} detect - whether inappropriate words has been detected
   */
  static async updateStatus(freetId: Types.ObjectId | string, detect: boolean): Promise<void> {
    const freet = await FreetCollection.findOne(freetId);
    const contentFilter = await ContentFilterModel.findOne({freetId: freet._id}).populate('freetId');
    contentFilter.detect = detect;
    await contentFilter.save();
  }

  /**
   * Run a content filter
   *
   * @param {string} content - The content to filter
   * @return {Set<String>} - The of detected words, if any
   */
  static runFilter(content: string): Set<string> {
    const filter = new CensorSensor();
    filter.disableTier(2);
    filter.enableTier(1);
    filter.enableTier(3);
    filter.enableTier(4);
    let wordsDetected = new Set<string>();
    if (filter.isProfane(content)) {
      const wordsDetected_ = filter.profaneIshWords(content);
      wordsDetected = new Set(wordsDetected_);
    }

    return wordsDetected;
  }

  /**
   * Delete a content filter with given freetId
   *
   * @param {string} freetId - The freetId of content filter to delete
   */
  static async deleteFilter(freetId: Types.ObjectId | string): Promise<void> {
    await ContentFilterModel.deleteMany({freetId});
  }
}

export default ContentFilterCollection;
