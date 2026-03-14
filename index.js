#!/usr/bin/env node

import enquirer from "enquirer";

const NUM_CHOICES = 4;

const GENERATIONS = [
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

const generationSelectPrompt = new enquirer.Select({
  message: "出題する世代を選んでください",
  choices: GENERATIONS,
});

const generationName = await generationSelectPrompt.run();
const generationNumber = GENERATIONS.find(
  (generation) => generation.name === generationName,
).value;

const response = await fetch(
  `https://pokeapi.co/api/v2/generation/${generationNumber}`,
);
const generationData = await response.json();

async function getJapaneseName(url) {
  const response = await fetch(url);
  const species = await response.json();
  const jaName = species.names.find((n) => n.language.name === "ja");
  return jaName.name;
}

const pokemonList = await Promise.all(
  generationData.pokemon_species.map(async (pokemon) => {
    const jaName = await getJapaneseName(pokemon.url);
    return { ja: jaName, en: pokemon.name };
  }),
);

// PokemonListから4匹ランダムで格納
const shuffledPokemonList = pokemonList.sort(() => Math.random() - 0.5);
const selectedPokemon = shuffledPokemonList.slice(0, NUM_CHOICES);
const choices = selectedPokemon.map((pokemon) => pokemon.ja);

// 4匹の中から正解のポケモン1匹を選ぶ
const correctAnswerPokemon =
  selectedPokemon[Math.floor(Math.random() * selectedPokemon.length)];

async function getBaseStats(pokemonName) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
  );
  const pokemonData = await response.json();
  return pokemonData.stats.map((data) => data.base_stat);
}

const correctAnswerPokemonBaseStats = await getBaseStats(
  correctAnswerPokemon.en,
);

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
  choices,
});

const answer = await prompt.run();
if (correctAnswerPokemon.ja === answer) {
  console.log("正解!");
} else {
  console.log(`残念！正解は${correctAnswerPokemon.ja}でした`);
}
