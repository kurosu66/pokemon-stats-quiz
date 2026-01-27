#!/usr/bin/env node

import enquirer from "enquirer";

// todo APIから取得に変更する
const currentSeasonPokemonList = [
  "ミライドン",
  "コライドン",
  "ハバタクカミ",
  "キョジオーン",
  "ハッサム",
  "ランドロス",
  "パオジアン",
  "イーユイ",
  "ピカチュウ",
  "フシギダネ",
];

// currentSeasonPokemonListから4匹ランダムで格納
const shuffled_currentSeasonPokemonList = currentSeasonPokemonList.sort(
  () => Math.random() - 0.5,
);
const choices = shuffled_currentSeasonPokemonList.slice(0, 4);

// 4匹の中から正解のポケモン1匹を選ぶ
const correctAnswerPokemon =
  choices[Math.floor(Math.random() * choices.length)];

// todo correctAnswerPokemonから種族値取得に変更する
const question = {
  HitPoint: 100,
  Attack: 85,
  Defense: 100,
  SpecialAttack: 135,
  SpecialDefense: 115,
  Speed: 135,
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
if (correctAnswer === answer) {
  console.log("正解!");
} else {
  console.log("残念!");
}
