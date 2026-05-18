import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();

    // Transform to key-value object for convenience
    const settingsMap: Record<string, { value: string; type: string }> = {};
    for (const setting of settings) {
      settingsMap[setting.key] = { value: setting.value, type: setting.type };
    }

    return Response.json(settingsMap);
  } catch (error) {
    console.error("Settings fetch error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!Array.isArray(body)) {
      return Response.json(
        { error: "Request body must be an array of { key, value } pairs" },
        { status: 400 }
      );
    }

    for (const item of body) {
      if (!item.key || item.value === undefined) {
        return Response.json(
          { error: "Each item must have a key and value" },
          { status: 400 }
        );
      }
    }

    // Upsert each setting
    const results = await Promise.all(
      body.map((item: { key: string; value: string; type?: string }) =>
        prisma.siteSetting.upsert({
          where: { key: item.key },
          update: {
            value: item.value,
            ...(item.type !== undefined && { type: item.type }),
          },
          create: {
            key: item.key,
            value: item.value,
            type: item.type || "text",
          },
        })
      )
    );

    return Response.json(results);
  } catch (error) {
    console.error("Settings update error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
