// 文件结构
// ├── pages
// │   ├── index.js        // 首页，用户填写信息
// │   ├── result.js       // 显示GPT生成报告
// │   └── api
// │       └── ask.js      // 调用GPT生成内容
// ├── .env.local         // 保存API KEY
// └── vercel.json        // 部署配置（可选）

// pages/index.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [question, setQuestion] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ birthday, gender, question })
    });
    const data = await res.json();
    localStorage.setItem('gpt_reply', data.reply);
    router.push('/result');
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>AI东方命理简批</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="出生日期：2002-04-04" onChange={e => setBirthday(e.target.value)} required /><br /><br />
        <input placeholder="性别：男 / 女" onChange={e => setGender(e.target.value)} required /><br /><br />
        <input placeholder="你想问什么？（可选）" onChange={e => setQuestion(e.target.value)} /><br /><br />
        <button type="submit">生成命理报告</button>
      </form>
    </div>
  );
}

// pages/result.js
import { useEffect, useState } from 'react';

export default function Result() {
  const [reply, setReply] = useState('');
  useEffect(() => {
    setReply(localStorage.getItem('gpt_reply'));
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h2>你的命理报告</h2>
      <pre>{reply}</pre>
    </div>
  );
}

// pages/api/ask.js
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

// .env.local
// OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
