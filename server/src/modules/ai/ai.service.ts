import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function summarizeText(content: string) {

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: "Summarize the following document clearly."
      },
      {
        role: "user",
        content
      }
    ]
  })

  return response.choices[0].message.content
}

export async function improveWriting(content: string) {

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: "Improve grammar and clarity of this text."
      },
      {
        role: "user",
        content
      }
    ]
  })

  return response.choices[0].message.content
}