import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.formData();
  const file = body.get("image");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  const apiKey = process.env.REMOVE_BG_API_KEY;
  const apiUrl =
    process.env.REMOVE_BG_API_URL || "https://api.remove.bg/v1.0/removebg";

  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  const formData = new FormData();
  formData.append("image_file", file);
  formData.append("size", "auto");

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "X-Api-Key": apiKey as string,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessage =
      errorData.errors?.[0]?.title ||
      errorData.error ||
      "Failed to process image";
    return NextResponse.json({ error: errorMessage }, { status: res.status });
  } else {
    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return NextResponse.json({ result: base64 });
  }
}
