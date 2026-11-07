import { NextResponse } from "next/server";
import { absolute } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      links: [
        {
          rel: "http://nodeinfo.diaspora.software/ns/schema/2.1",
          href: absolute("/nodeinfo/2.1")
        }
      ]
    },
    { headers: { "access-control-allow-origin": "*" } }
  );
}
