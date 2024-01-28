import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        role: "admin",
      },
    });
    return Response.json({ message: "User is now admin" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
