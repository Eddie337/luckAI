export default async function handler(req, res) {
  const { birthday, gender, question } = req.body;
  const prompt = `你是一位结合东方神学的命理大师，请根据以下信息生成命理简批：\n生日：${birthday}\n性别：${gender}\n提问：${question}\n\n请生成一段300字以内、简洁优美、有情绪价值的命理分析。`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    })
  });

  const data = await response.json();
  res.status(200).json({ reply: data.choices[0].message.content });
}
