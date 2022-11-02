import type {Request, Response} from 'express';
import express from 'express';
import SensitivitySettingCollection from './collection';
import * as userValidator from '../user/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get sensitivity setting of user.
 *
 * @name GET /api/sensitivitySettings
 *
 * @return {SensitivitySettingResponse}
 * @throws {403} - If the user is not logged in
 *
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const settings = await SensitivitySettingCollection.findUserSetting(req.session.userId);
    res.status(200).json({
      settings: util.constructSensitivitySettingResponse(settings)
    });
  }
);

/**
 * Change sensitivity setting of user.
 *
 * @name PATCH /api/sensitivitySettings/hideSensitiveContent
 *
 * @return {SensitivitySettingResponse}
 * @throws {403} - If the user is not logged in
 *
 */
router.patch(
  '/hideSensitiveContent',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const settings = await SensitivitySettingCollection.hideSensitiveContent(req.session.userId);
    res.status(200).json({
      message: 'Your settings was updated successfully.',
      settings: util.constructSensitivitySettingResponse(settings)
    });
  }
);

/**
 * Change sensitivity setting of user.
 *
 * @name PATCH /api/sensitivitySettings/showSensitiveContent
 *
 * @return {SensitivitySettingResponse}
 * @throws {403} - If the user is not logged in
 *
 */
router.patch(
  '/showSensitiveContent',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const settings = await SensitivitySettingCollection.showSensitiveContent(req.session.userId);
    res.status(200).json({
      message: 'Your settings was updated successfully.',
      settings: util.constructSensitivitySettingResponse(settings)
    });
  }
);

/**
 * Change sensitivity setting of user.
 *
 * @name PATCH /api/sensitivitySettings/hideHiddenFreet
 *
 * @return {SensitivitySettingResponse}
 * @throws {403} - If the user is not logged in
 *
 */
router.patch(
  '/hideHiddenFreet',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const settings = await SensitivitySettingCollection.hideHiddenFreet(req.session.userId);
    res.status(200).json({
      message: 'Your settings was updated successfully.',
      settings: util.constructSensitivitySettingResponse(settings)
    });
  }
);
/**
 * Change sensitivity setting of user.
 *
 * @name PATCH /api/sensitivitySettings/showHiddenFreet
 *
 * @return {SensitivitySettingResponse}
 * @throws {403} - If the user is not logged in
 *
 */
router.patch(
  '/showHiddenFreet',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const settings = await SensitivitySettingCollection.showHiddenFreet(req.session.userId);
    res.status(200).json({
      message: 'Your settings was updated successfully.',
      settings: util.constructSensitivitySettingResponse(settings)
    });
  }
);

export {router as sensitivitySettingRouter};
