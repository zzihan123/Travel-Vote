export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL이 없어요' });

  const GEMINI_KEY = process.env.GEMINI_KEY;
  if (!GEMINI_KEY) return res.status(500).json({ error: 'API 키가 설정되지 않았어요' });

  const prompt = `다음 숙소 링크의 정보를 웹 검색으로 찾아서 JSON으로만 응답해줘. 다른 설명은 절대 하지 마.

URL: ${url}

반환 형식 (JSON만, 마크다운 코드블록 없이):
{
  "name": "숙소 전체 이름",
  "bed": "더블 또는 각침대 또는 벙커침대 또는 기타",
  "bath": "방안(인실) 또는 셰어드",
  "station": "가장 가까운 지하철역명과 도보 시간 (예: 신주쿠역 도보 5분)",
  "price": 숫자만 (원화 기준 1박 또는 전체 금액, 없으면 null),
  "img": "대표 이미지 URL 또는 null",
  "memo": "침대 수, 체크인 시간, 조식 포함 여부 등 핵심 특징 1~2줄"
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          tools: [{ google_search: {} }],  // Google Search grounding — 실시간 웹 검색
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: err?.error?.message || `Gemini API 오류 ${response.status}`,
      });
    }

    const data = await response.json();

    const text = data.candidates?.[0]?.content?.parts
      ?.filter(p => p.text)
      ?.map(p => p.text)
      ?.join('') || '';

    if (!text) return res.status(500).json({ error: 'AI 응답이 비어 있어요' });

    const jsonStr = text.replace(/```json|```/g, '').trim();
    const info = JSON.parse(jsonStr);

    return res.status(200).json(info);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
