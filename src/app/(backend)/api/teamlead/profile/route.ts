// import { NextResponse } from "next/server";
// import { updateTeamLeadController } from "@/app/(backend)/controllers/teamlead.controller";

// export async function PUT(req: Request) {
//   try {
//     const { id, ...data } = await req.json();
//     return await updateTeamLeadController(id, data);
//   } catch (error) {
//     console.error("Error in PUT /teamlead/profile:", error);
//     return NextResponse.json(
//       { message: "Invalid request", error: (error as Error).message },
//       { status: 400 }
//     );
//   }
// }
