let extraJackpotChance = 0;  // Variável que acumula a chance extra do fdp do jackpot
const maxJackpotChance = 0.50; // Limite máximo de 50% para a chance do jackpot

function getRandomSymbol() {
    const symbols = ['🍒', '🍋', '🔔', '⭐', '💎', '7️⃣'];
    const baseWeights = [0.30, 0.30, 0.15, 0.10, 0.10, 0.05]; // chances basicas

    // Ele aumenta a chance de jackpot com base na chance extra acumulada, respeitando o limite máximo
    const adjustedJackpotWeight = Math.min(baseWeights[5] + extraJackpotChance, maxJackpotChance);

    // Ajusta os pesos e distribui o excedente entre os outros símbolos para que a soma continue sendo 100%
    baseWeights[5] = adjustedJackpotWeight;
    const remainingWeight = 1 - adjustedJackpotWeight;
    const totalBaseWeightWithoutJackpot = baseWeights.slice(0, 5).reduce((sum, weight) => sum + weight, 0);
    for (let i = 0; i < 5; i++) {
        baseWeights[i] = (baseWeights[i] / totalBaseWeightWithoutJackpot) * remainingWeight;
    }

    const random = Math.random();
    let cumulative = 0;

    for (let i = 0; i < symbols.length; i++) {
        cumulative += baseWeights[i];
        if (random < cumulative) {
            return symbols[i];
        }
    }
}

function pullLever() {
    const reel1 = document.getElementById('reel1');
    const reel2 = document.getElementById('reel2');
    const reel3 = document.getElementById('reel3');
    const result = document.getElementById('result');

    const spinSound = document.getElementById('spin-sound');
    const winSound = document.getElementById('win-sound');
    const loseSound = document.getElementById('lose-sound');

    reel1.textContent = '';
    reel2.textContent = '';
    reel3.textContent = '';
    result.textContent = 'Sorteando...';

    reel1.classList.remove('spin-animation');
    reel2.classList.remove('spin-animation');
    reel3.classList.remove('spin-animation');

    spinSound.play();

    setTimeout(() => {
        reel1.textContent = getRandomSymbol();
        reel1.classList.add('spin-animation');
    }, 1500);

    setTimeout(() => {
        reel2.textContent = getRandomSymbol();
        reel2.classList.add('spin-animation');
    }, 2500);

    setTimeout(() => {
        reel3.textContent = getRandomSymbol();
        reel3.classList.add('spin-animation');

        // Verifica se há 3 símbolos iguais para determinar Jackpot
        if (reel1.textContent === reel2.textContent && reel2.textContent === reel3.textContent) {
            result.textContent = '🏆 Jackpot! Você Ganhou! 🏆';
            winSound.play();
            // Resetar a chance extra, pq teve jackpot
            extraJackpotChance = 0;
        } else if (reel1.textContent === reel2.textContent || reel2.textContent === reel3.textContent || reel1.textContent === reel3.textContent) {
            result.textContent = 'Quase lá! Continue tentando!';
            loseSound.play();
        } else {
            result.textContent = 'Tente novamente!';
            loseSound.play();
            // Aumenta a chance extra de jackpot em 5% (0.05) a cada falha, até o limite máximo. Evite fazer mudanças Leandro do futuro ;)
            extraJackpotChance = Math.min(extraJackpotChance + 0.05, maxJackpotChance);
        }
    }, 3500);
}
