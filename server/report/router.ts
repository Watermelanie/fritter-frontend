import type {Request, Response} from 'express';
import express from 'express';
import ReportCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as reportValidator from '../report/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the reports to a freet
 *
 * @name GET /api/reports/:freetId
 *
 * @return {ReportResponse[]} - A list of all the reports
 * @throws {404} - If no freet has given freetId
 */
router.get(
  '/:freetId?',
  [
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    // const allReports = await ReportCollection.findAll(req.params.freetId);
    // const response_ = allReports.map(util.constructReportResponse);
    const c1 = await ReportCollection.getCountofAll(req.params.freetId);
    const c2 = await ReportCollection.getCountofType(req.params.freetId, 'offensive');
    const c3 = await ReportCollection.getCountofType(req.params.freetId, 'sensitive');
    const c4 = await ReportCollection.getCountofType(req.params.freetId, 'misinformation');
    // const response = {reports: response_, count};
    const response = {totalCount: c1, offensiveCount: c2, sensitiveCount: c3, misinformationCount: c4};
    res.status(200).json(response);
  }
);

/**
 * Get reports of a certain type to a freet
 *
 * @name GET /api/reports/:freetId/:type
 *
 * @return {FreetResponse[]} - An array of freets created by user with id, authorId
 * @throws {404} - If no freet has given freetId
 * @throws {404} - If invalid type
 *
 */
router.get(
  '/:freetId?/:type?',
  [
    freetValidator.isFreetExists,
    reportValidator.isValidReportType
  ],
  async (req: Request, res: Response) => {
    const typeReports = await ReportCollection.findAllOfType(req.params.freetId, req.params.type);
    const response_ = typeReports.map(util.constructReportResponse);
    const count = await ReportCollection.getCountofType(req.params.freetId, req.params.type);
    const response = {reports: response_, count};
    res.status(200).json(response);
  }
);

/**
 * Create a new report.
 *
 * @name POST /api/reports/:freetId/:type
 *
 * @param {string} freetId - The id of the freet
 * @param {string} type - The type of the report
 * @param {string} content - The content of the report
 * @return {ReportResponse} - The created report
 * @throws {403} - If the user is not logged in
 * @throws {404} - If no freet has given freetId
 * @throws {404} - If invalid type
 */
router.post(
  '/:freetId?/:type?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    reportValidator.isValidReportType
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const report = await ReportCollection.addOne(userId, req.params.freetId, req.params.type, req.body.content);

    res.status(201).json({
      message: 'Your report was created successfully.',
      report: util.constructReportResponse(report)
    });
  }
);

export {router as reportRouter};
