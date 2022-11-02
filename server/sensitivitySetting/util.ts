import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {SensitivitySetting, PopulatedSensitivitySetting} from '../SensitivitySetting/model';

// Update this if you add a property to the SensitivitySetting type!
type SensitivitySettingResponse = {
  _id: string;
  user: string;
  showSensitiveContent: boolean;
  showHiddenFreet: boolean;
};

/**
 * Transform a raw SensitivitySetting object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<SensitivitySetting>} sensitivitySetting - A SensitivitySetting
 * @returns {SensitivitySettingResponse} - The SensitivitySetting object formatted for the frontend
 */
const constructSensitivitySettingResponse = (sensitivitySetting: HydratedDocument<SensitivitySetting>): SensitivitySettingResponse => {
  const sensitivitySettingCopy: PopulatedSensitivitySetting = {
    ...sensitivitySetting.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = sensitivitySettingCopy.userId;
  delete sensitivitySettingCopy.userId;
  return {
    ...sensitivitySettingCopy,
    _id: sensitivitySettingCopy._id.toString(),
    user: username,
    showSensitiveContent: sensitivitySettingCopy.showSensitiveContent,
    showHiddenFreet: sensitivitySettingCopy.showHiddenFreet
  };
};

export {
  constructSensitivitySettingResponse
};
