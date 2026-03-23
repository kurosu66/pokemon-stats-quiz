export default class Pokemon {
  static GENERATIONS = [
    { name: "第1世代（赤・緑）", value: 1 },
    { name: "第2世代（金・銀）", value: 2 },
    { name: "第3世代（ルビー・サファイア）", value: 3 },
    { name: "第4世代（ダイヤモンド・パール）", value: 4 },
    { name: "第5世代（ブラック・ホワイト）", value: 5 },
    { name: "第6世代（X・Y）", value: 6 },
    { name: "第7世代（サン・ムーン）", value: 7 },
    { name: "第8世代（ソード・シールド）", value: 8 },
    { name: "第9世代（スカーレット・バイオレット）", value: 9 },
  ];

  async fetchGeneration(generationNumber) {
    const response = await fetch(
      `https://pokeapi.co/api/v2/generation/${generationNumber}`,
    );
    return await response.json();
  }

  async getJapaneseName(url) {
    const response = await fetch(url);
    const species = await response.json();
    const jaName = species.names.find((n) => n.language.name === "ja");
    return jaName.name;
  }

  async getBaseStats(pokemonName) {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
    );
    const pokemonData = await response.json();
    return pokemonData.stats.map((data) => data.base_stat);
  }
}
