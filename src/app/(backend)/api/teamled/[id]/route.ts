import {
  getTeamLeadByIdController,
  updateTeamLeadController,
  deleteTeamLeadController,
} from "@/app/(backend)/controllers/teamlead.controller";

interface RouteContext {
  params: { id: string };
}

export async function GET(req: Request, context: RouteContext) {
  return getTeamLeadByIdController(req, context);
}

export async function PUT(req: Request, context: RouteContext) {
  return updateTeamLeadController(req, context);
}

export async function DELETE(req: Request, context: RouteContext) {
  return deleteTeamLeadController(req, context);
}
