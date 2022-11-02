import type {HydratedDocument, Types} from 'mongoose';
import type {SensitivitySetting} from './model';
import SensitivitySettingModel from './model';
import UserCollection from '../user/collection';

/**
 * This file contains a class with functionality to change the sensitivity setting for a User
 *
 * Note: HydratedDocument<SensitivitySetting> is the output of the SensitivitySettingModel() constructor,
 * and contains all the information in SensitivitySetting. https://mongoosejs.com/docs/typescript.html
 */
class SensitivitySettingCollection {
  /**
   * Add a sensitivity setting (ss) to the collection
   *
   * @param {string} userId - The id of the user
   * @return {Promise<HydratedDocument<SensitivitySetting>>} - The newly created ss
   */
  static async addOne(userId: Types.ObjectId | string): Promise<HydratedDocument<SensitivitySetting>> {
    const sensitivitySetting = new SensitivitySettingModel({
      userId,
      showSensitiveContent: false,
      showHiddenFreet: false
    });
    await sensitivitySetting.save(); // Saves freet to MongoDB
    return sensitivitySetting.populate('userId');
  }

  /**
   * Find a sensitivity setting (ss) by userId
   *
   * @param {string} userId - The id of the user
   * @return {Promise<HydratedDocument<SensitivitySetting>> | Promise<null> } - The ss of the user
   */
  static async findUserSetting(userId: Types.ObjectId | string): Promise<HydratedDocument<SensitivitySetting>> {
    const user = await UserCollection.findOneByUserId(userId);
    return SensitivitySettingModel.findOne({userId: user._id}).populate('userId');
  }

  /**
   * Hides sensitive content
   *
   * @param {string} userId - The id of the user
   * @return {Promise<HydratedDocument<SensitivitySetting>>} - The ss of the user
   */
  static async hideSensitiveContent(userId: Types.ObjectId | string): Promise<HydratedDocument<SensitivitySetting>> {
    const setting = await this.findUserSetting(userId);
    setting.showSensitiveContent = false;
    await setting.save();
    return setting.populate('userId');
  }

  /**
   * Shows sensitive content
   *
   * @param {string} userId - The id of the user
   * @return {Promise<HydratedDocument<SensitivitySetting>>} - The ss of the user
   */
  static async showSensitiveContent(userId: Types.ObjectId | string): Promise<HydratedDocument<SensitivitySetting>> {
    const setting = await this.findUserSetting(userId);
    setting.showSensitiveContent = true;
    await setting.save();
    return setting.populate('userId');
  }

  /**
   * Hides hidden freets
   *
   * @param {string} userId - The id of the user
   * @return {Promise<HydratedDocument<SensitivitySetting>>} - The ss of the user
   */
  static async hideHiddenFreet(userId: Types.ObjectId | string): Promise<HydratedDocument<SensitivitySetting>> {
    const setting = await this.findUserSetting(userId);
    setting.showHiddenFreet = false;
    await setting.save();
    return setting.populate('userId');
  }

  /**
   * Shows hidden freets
   *
   * @param {string} userId - The id of the user
   * @return {Promise<HydratedDocument<SensitivitySetting>>} - The ss of the user
   */
  static async showHiddenFreet(userId: Types.ObjectId | string): Promise<HydratedDocument<SensitivitySetting>> {
    const setting = await this.findUserSetting(userId);
    setting.showHiddenFreet = true;
    await setting.save();
    return setting.populate('userId');
  }

  /**
   * Delete setting of a user
   *
   * @param {string} userId - The id of author of freets
   */
  static async deleteSetting(userId: Types.ObjectId | string): Promise<void> {
    await SensitivitySettingModel.deleteMany({userId});
  }
}

export default SensitivitySettingCollection;
