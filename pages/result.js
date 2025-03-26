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
