import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/chat', async (req, res) => {
  try {
    const { query, promptInstruction } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Você é um assistente proativo especializado em contabilidade, finanças corporativas e direito tributário brasileiro.
      Faça uma pesquisa atualizada na internet sobre o tema: "${query}".

      ${promptInstruction || ''}

      OBRIGATÓRIO: Retorne os dados estritamente em um JSON nativo, com a exata estrutura abaixo:
      {
        "markdownText": "Sua resposta explicativa formatada em Markdown (use tabelas em markdown aqui se ajudar). Inclua obrigatoriamente as fontes ao final.",
        "chart": {
           "title": "Título do Gráfico",
           "type": "bar", // ou "line" ou "pie"
           "data": [ { "name": "Rótulo", "value": 10 } ]
        }, // ou null se não houver dados quantitativos ou de valores comparáveis
        "timeline": {
           "title": "Acontecimentos Cronológicos",
           "items": [ { "date": "Data", "event": "Evento", "description": "Breve explicação" } ]
        } // ou null se não houver histórico para mostrar
      }
      
      Você deve identificar dados e criar ilustrações sempre que possível (por exemplo, construir um 'chart' para alíquotas ou valores ou quantidade, e 'timeline' para mostrar a linha do tempo de uma lei ou fato novo). Seja arrojado, se houver qualquer número que dê para preencher um gráfico, preencha.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      }
    });

    if (response.text) {
      let jsonStr = response.text.trim();
      if (jsonStr.startsWith("```json")) {
         jsonStr = jsonStr.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (jsonStr.startsWith("```")) {
         jsonStr = jsonStr.replace(/^```/, '').replace(/```$/, '').trim();
      }
      
      res.json(JSON.parse(jsonStr));
    } else {
      res.status(500).json({ error: 'Nenhum texto retornado pela IA.' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao processar a requisição no servidor.' });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
