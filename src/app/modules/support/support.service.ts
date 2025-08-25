import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { ISupport } from "./support.interface";
import { Support } from "./support.model";
import QueryBuilder from "../../builder/queryBuilder";
import { SupportStatus } from "./support.constants";
import { emailHelper } from "../../../helpers/emailHelper";
import config from "../../../config";
import { z } from "zod";

// create support
const createSupportIntoDB = async (payload: ISupport) => {
  const result = await Support.create(payload);
  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Failed to create support ticket"
    );
  }
  return result;
};

// update support status
const updateSupportIntoDB = async (id: string, payload: Partial<ISupport>) => {
  const existingSupport = await Support.findById(id);
  if (!existingSupport) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Support ticket not found");
  }

  const result = await Support.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Failed to update support ticket"
    );
  }

  return result;
};

// get all support
const getAllSupportFromDB = async (query: Record<string, unknown>) => {
  const supportQuery = new QueryBuilder(Support.find({}), query)
    .search(["name", "email", "phone", "subject"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await supportQuery.modelQuery;
  const total = await Support.countDocuments(
    supportQuery.modelQuery.getFilter()
  );

  return {
    meta: {
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
      total,
    },
    data: result,
  };
};

// get support overview
const getSupportOverviewFromDB = async () => {
  // Get total tickets count
  const totalTickets = await Support.countDocuments({});

  // Get tickets by status
  const openTickets = await Support.countDocuments({
    status: SupportStatus.OPEN,
  });

  const pendingTickets = await Support.countDocuments({
    status: SupportStatus.PENDING,
  });

  const resolvedTickets = await Support.countDocuments({
    status: SupportStatus.RESOLVED,
  });

  // Calculate resolution rate (percentage of resolved tickets)
  const resolutionRate =
    totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0;

  // Calculate average resolution time for resolved tickets
  let avgResolutionTime = 0;

  const resolvedTicketsWithTimestamps = await Support.find({
    status: SupportStatus.RESOLVED,
  });

  if (resolvedTicketsWithTimestamps.length > 0) {
    const totalResolutionTime = resolvedTicketsWithTimestamps.reduce(
      (sum, ticket: ISupport) => {
        // Calculate time difference between creation and last update (resolution)
        const creationTime = new Date(ticket.createdAt || 0).getTime();
        const resolutionTime = new Date(ticket.updatedAt || 0).getTime();
        return sum + (resolutionTime - creationTime);
      },
      0
    );
    // Average resolution time in hours
    avgResolutionTime = Math.round(
      totalResolutionTime /
        resolvedTicketsWithTimestamps.length /
        (1000 * 60 * 60)
    );
  }

  // Calculate average response time (time to move from OPEN to PENDING)
  // This assumes that when a ticket moves to PENDING, it has received a first response
  let avgResponseTime = 0;

  // We need to add a query to find tickets that have moved from OPEN to another status
  // Since we don't have a field tracking when status changed, we can use updatedAt as an approximation
  // for tickets that are not in OPEN status
  const respondedTickets = await Support.find({
    status: { $ne: SupportStatus.OPEN },
  });

  if (respondedTickets.length > 0) {
    const totalResponseTime = respondedTickets.reduce((sum, ticket) => {
      const creationTime = new Date(ticket.createdAt || 0).getTime();
      const responseTime = new Date(ticket.updatedAt || 0).getTime();
      return sum + (responseTime - creationTime);
    }, 0);

    // Average response time in hours
    avgResponseTime = Math.round(
      totalResponseTime / respondedTickets.length / (1000 * 60 * 60)
    );
  }

  return {
    totalTickets,
    byStatus: {
      open: openTickets,
      pending: pendingTickets,
      resolved: resolvedTickets,
    },
    metrics: {
      resolutionRate,
      avgResolutionTime,
      avgResponseTime,
    },
  };
};

const replaySupportMessageFromDB = async ({
  email: recipientEmail,
  message,
  subject = "Support Reply",
}: ISupport) => {
  const emailValidation = z.string().email().safeParse(recipientEmail);

  if (!emailValidation.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Invalid email address: ${recipientEmail}`
    );
  }

  const userWithOpenTicket = await Support.findOne({
    email: recipientEmail,
  });

  if (!userWithOpenTicket) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "No support ticket found");
  }

  await emailHelper.sendEmail({
    to: recipientEmail,
    subject,
    html: `<p>${message}</p>`,
  });
  await userWithOpenTicket.updateOne({
    status: SupportStatus.PENDING,
  });
};

export const SupportServices = {
  createSupportIntoDB,
  updateSupportIntoDB,
  getAllSupportFromDB,
  getSupportOverviewFromDB,
  replaySupportMessageFromDB,
};
