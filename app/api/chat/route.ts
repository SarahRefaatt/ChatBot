import { NextRequest, NextResponse } from "next/server";

const GROQ_KEY = process.env.GROQ_API_KEY; // use Groq key

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
console.log("GROQ KEY:", process.env.GROQ_API_KEY);

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile", // Groq model
      messages,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text }, { status: res.status });
  }

  const json = await res.json();
  const reply = json.choices?.[0]?.message?.content || "";
  return NextResponse.json({ reply });
}


export async function GET() {
const res = await fetch("https://api.groq.com/openai/v1/models", {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    "Content-Type": "application/json",
  },
});
const models = await res.json();
console.log(models);


}