import fetch from 'node-fetch';
async function main() {
  const res = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'hello' }],
      model: 'gemini-2.5-flash',
      mode: 'search'
    })
  });
  const text = await res.text();
  console.log(text);
}
main();
