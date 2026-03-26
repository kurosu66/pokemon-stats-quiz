import enquirer from "enquirer";
import Pokemon from "./pokemon.js";

export default class Quiz {
  static CHOICE_COUNT = 4;
  #pokemon;

  constructor(pokemon = new Pokemon()) {
    this.#pokemon = pokemon;
  }

  async run() {
    const { correct, baseStats, candidates } = await this.#setupQuiz();
    const answer = await this.#askQuestion(baseStats, candidates);

    if (correct.ja === answer) {
      console.log("正解!");
    } else {
      console.log(`残念！正解は${correct.ja}でした`);
    }
  }

  async #setupQuiz() {
    const selectedGeneration = await this.#selectGeneration();
    const generationData =
      await this.#pokemon.fetchGeneration(selectedGeneration);
    const pokemonList = await this.#fetchPokemonList(generationData);
    const candidates = this.#selectCandidates(pokemonList);
    const correct = this.#pickRandom(candidates);
    const baseStats = await this.#pokemon.getBaseStats(correct.en);

    return { correct, candidates, baseStats };
  }

  async #selectGeneration() {
    const generationName = await this.#generationSelectPrompt().run();
    return Pokemon.GENERATIONS.find(
      (generation) => generation.name === generationName,
    ).value;
  }

  #selectCandidates(pokemonList) {
    return pokemonList
      .sort(() => Math.random() - 0.5)
      .slice(0, Quiz.CHOICE_COUNT);
  }

  async #fetchPokemonList(generationData) {
    return Promise.all(
      generationData.pokemon_species.map(async (species) => {
        const jaName = await this.#pokemon.getJapaneseName(species.url);
        return { ja: jaName, en: species.name };
      }),
    );
  }

  #pickRandom(candidates) {
    const correct = candidates[Math.floor(Math.random() * candidates.length)];
    return correct;
  }

  #generationSelectPrompt() {
    return new enquirer.Select({
      message: "出題する世代を選んでください",
      choices: Pokemon.GENERATIONS,
    });
  }

  async #askQuestion(baseStats, candidates) {
    const question = {
      HitPoint: baseStats[0],
      Attack: baseStats[1],
      Defense: baseStats[2],
      SpecialAttack: baseStats[3],
      SpecialDefense: baseStats[4],
      Speed: baseStats[5],
    };

    const prompt = new enquirer.Select({
      message: `この種族値のポケモンは?
      H:${question.HitPoint}
      A:${question.Attack}
      B:${question.Defense}
      C:${question.SpecialAttack}
      D:${question.SpecialDefense}
      S:${question.Speed}

      `,
      choices: candidates.map((p) => p.ja),
    });
    return prompt.run();
  }
}
