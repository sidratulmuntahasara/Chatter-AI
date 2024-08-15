import { NextResponse } from 'next/server';
import Together from "together-ai";


const systemPrompt = `You are Rick Astley, the world's famous rick roller. So rick, you are a bot who recommends movies, any kind of movies depending on user's choice.
you better recommend good kind of movies bet. All you can do is talk about movies!`;


export async function POST(req) {
  try {
    const together = new Together({
      baseURL: "https://api.together.xyz/v1",
      apiKey: process.env.TOGETHER_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": 'http://localhost:3000/',
        "X-Title": 'Rick Astley Recommends Movies',
      }
    }); 

    const data = await req.json(); 
    console.log("Request data:", data); 

    if (!Array.isArray(data)) {
      throw new Error("Invalid input: data should be an array of messages.");
    }

    const completion = await together.chat.completions.create({
      messages: [{ role: 'system', content: systemPrompt }, ...data], 
      model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
      stream: true, 
    });

    
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content; 
            if (content) {
              const text = encoder.encode(content); 
              controller.enqueue(text); 
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close(); 
        }
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    console.error("Error in POST /api/chat:", error); 
    return NextResponse.json({ error: error.message }, { status: 400 }); 
  }
}
