// Fonction serveur Vercel : /api/plan
// La clé ANTHROPIC_API_KEY reste côté serveur (variable d'environnement).
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: "Clé API manquante" });

  const { acts = [], start, end, energy, bed } = req.body || {};
  if (!Array.isArray(acts) || acts.length > 15) return res.status(400).json({ error: "Données invalides" });

  const prompt = `Crée un planning réaliste pour aujourd'hui.
Fenêtre libre : ${start} à ${end}. Énergie : ${energy} (high/mid/low). Coucher : ${bed}.
Activités (nom, durée souhaitée en min) : ${acts.map(a => `${a.n} (${a.m})`).join(", ")}.
Règles : pauses de 10 min entre activités, réduis les durées si le temps manque, activités exigeantes en premier si énergie haute, plus légères d'abord si énergie basse.
Réponds UNIQUEMENT par un tableau JSON, sans texte ni backticks. Chaque élément :
{"n":"emoji + nom","s":"HH:MM","d":durée_en_min,"m":durée_souhaitée,"done":false}
Termine par {"n":"😴 Coucher","s":"${bed}","d":0,"m":0,"done":false}.`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5-5",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await r.json();
    const text = (data.content || []).map(c => c.text || "").join("");
    const plan = JSON.parse(text.replace(/```json|```/g, "").trim());
    return res.status(200).json({ plan });
  } catch (e) {
    return res.status(500).json({ error: "Erreur IA" });
  }
}
