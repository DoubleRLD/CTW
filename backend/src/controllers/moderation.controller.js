import * as ReportsModel from '../models/reviewReports.model.js';
import * as DormReviewsModel from '../models/dormReviews.model.js';
import * as ListingReviewsModel from '../models/listingReviews.model.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { resolveReportSchema, parseOrThrow } from '../middleware/validate.js';

// GET /api/moderation/reports  (admin only)
export const listReports = asyncHandler(async (req, res) => {
  const reports = await ReportsModel.findOpenReports();
  res.json(reports);
});

// POST /api/moderation/reports/:reportId/resolve  (admin only)
// body: { action: "dismiss" | "remove" }
export const resolveReport = asyncHandler(async (req, res) => {
  const reportId = Number(req.params.reportId);
  const report = await ReportsModel.findReportById(reportId);
  if (!report) throw new ApiError(404, 'Report not found.');
  if (report.status !== 'open') throw new ApiError(409, 'This report has already been resolved.');

  const { action } = parseOrThrow(resolveReportSchema, req.body, ApiError);

  if (action === 'remove') {
    if (report.review_type === 'dorm') {
      await DormReviewsModel.adminDeleteReview(report.review_id);
    } else {
      await ListingReviewsModel.adminDeleteReview(report.review_id);
    }
  }

  const updated = await ReportsModel.resolveReport(
    reportId,
    action === 'remove' ? 'resolved' : 'dismissed'
  );
  res.json(updated);
});
