import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';

const reportType = ['offensive', 'sensitive', 'misinformation'];

/**
 * Checks if the type of report in req.body is valid
 * spaces and not more than 140 characters
 */
const isValidReportType = async (req: Request, res: Response, next: NextFunction) => {
  const type_ = req.params.type;
  console.log(type_);

  if (type_ !== 'offensive' && type_ !== 'sensitive' && type_ !== 'misinformation') {
    res.status(404).json({
      error: 'Please select type of report.',
      yo: type_
    });
    return;
  }

  next();
};

export {
  isValidReportType
};
