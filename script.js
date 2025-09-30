/**
 * Filtra palavras comuns (stop words) em português.
 */
const stopWords = new Set([
    'a', 'o', 'as', 'os', 'um', 'uma', 'uns', 'umas',
    'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas',
    'por', 'pelo', 'pela', 'pelos', 'pelas', 'e', 'ou', 'mas', 
    'porque', 'que', 'se', 'é', 'para', 'com', 'sem', 'mais', 'menos', 
    'isso', 'este', 'esta', 'isto', 'aquele', 'aquela', 'aquilo',
    'meu', 'minha', 'teu', 'tua', 'seu', 'sua', 'nosso', 'nossa',
    'quem', 'onde', 'como', 'quando', 'qual', 'todo', 'toda', 'também',
    'ser', 'estar', 'ter', 'fazer', 'dizer', 'ir', 'vir', 'dar', 'ver',
    'dele', 'dela', 'nele', 'nela', 'ele', 'ela', 'nós', 'vós', 'eles', 'elas',
]);

/**
 * Função principal para extrair palavras-chave de um texto.
 */
function extractKeywords(text, topN = 10) {
    if (!text) return [];

    // 1. Limpar e tokenizar o texto
    const cleanText = text
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()0-9]/g, "")
        .replace(/\s{2,}/g, " ");

    const words = cleanText.split(/\s+/);

    // 2. Contar a frequência das palavras (ignorando stop words)
    const wordFrequency = new Map();
    words.forEach(word => {
        if (word.length > 2 && !stopWords.has(word)) {
            wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
        }
    });

    // 3. Classificar e retornar as N palavras mais frequentes
    const sortedWords = Array.from(wordFrequency.entries())
        .sort((a, b) => b[1] - a[1]);

    // Retorna apenas a palavra (índice 0)
    return sortedWords.slice(0, topN).map(item => item[0]);
}

// ----------------------------------------------------
// Lógica de manipulação do DOM
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // É uma boa prática adicionar 'async' ao botão para evitar cliques múltiplos
    const textInput = document.getElementById('entrada-de-texto');
    const extractButton = document.getElementById('botao-palavrachave');
    const resultDiv = document.getElementById('resultado-palavrachave');

    extractButton.addEventListener('click', () => {
        const text = textInput.value.trim();

        if (text.length === 0) {
            resultDiv.innerHTML = "<strong>Resultado:</strong> Por favor, insira algum texto para extrair.";
            return;
        }

        extractButton.disabled = true; // Desabilita o botão para evitar reenvios
        extractButton.textContent = "Extraindo...";

        // Pequeno timeout para simular um processamento e mostrar o "Extraindo..."
        setTimeout(() => {
            const keywords = extractKeywords(text, 10);

            if (keywords.length > 0) {
                const resultHtml = `
                    <strong>Palavras-Chave Encontradas:</strong>
                    ${keywords.join(' | ')}
                `;
                resultDiv.innerHTML = resultHtml;
            } else {
                resultDiv.innerHTML = "<strong>Resultado:</strong> Não foi possível extrair palavras-chave relevantes.";
            }

            extractButton.disabled = false;
            extractButton.textContent = "Extrair";
        }, 300); // 300ms de "processamento" simulado
    });
});