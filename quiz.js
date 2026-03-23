import enquirer from "enquirer";
import Pokemon from "./pokemon.js";

export default class Quiz {
  static CHOICE_COUNT = 4;

  async run() {
    const pokemon = new Pokemon();

    const selectedGeneration = await this.#selectGeneration();
    const generationData = await pokemon.fetchGeneration(selectedGeneration);

    const pokemonList = await this.#fetchPokemonList(pokemon, generationData);

    const candidates = this.#selectCandidates(pokemonList);

    const correct = candidates[Math.floor(Math.random() * candidates.length)];
    const correctAnswerPokemonBaseStats = await pokemon.getBaseStats(
      correct.en,
    );

    const answer = await this.#askQuestion(
      correctAnswerPokemonBaseStats,
      candidates,
    );

    if (correct.ja === answer) {
      console.log("正解!");
    } else {
      console.log(`残念！正解は${correct.ja}でした`);
    }
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

  async #fetchPokemonList(pokemon, generationData) {
    return await Promise.all(
      generationData.pokemon_species.map(async (species) => {
        const jaName = await pokemon.getJapaneseName(species.url);
        return { ja: jaName, en: species.name };
      }),
    );
  }

  #generationSelectPrompt() {
    return new enquirer.Select({
      message: "出題する世代を選んでください",
      choices: Pokemon.GENERATIONS,
    });
  }

  async #askQuestion(correctAnswerPokemonBaseStats, candidates) {
    const question = {
      HitPoint: correctAnswerPokemonBaseStats[0],
      Attack: correctAnswerPokemonBaseStats[1],
      Defense: correctAnswerPokemonBaseStats[2],
      SpecialAttack: correctAnswerPokemonBaseStats[3],
      SpecialDefense: correctAnswerPokemonBaseStats[4],
      Speed: correctAnswerPokemonBaseStats[5],
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
