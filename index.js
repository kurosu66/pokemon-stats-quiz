#!/usr/bin/env node

import enquirer from "enquirer";

// todo APIから取得に変更する
const question = {
  HitPoint: 100,
  Attack: 85,
  Defense: 100,
  SpecialAttack: 135,
  SpecialDefense: 115,
  Speed: 135,
};

// todo ランダムな選択肢にする
const choices = [
  "カイリュー",
  "サーフゴー",
  "ハバタクカミ",
  "ミライドン",
  "オーガポン",
];

const prompt = new enquirer.Select({
  message: `これ、何?  
  HP:${question.HitPoint}
  こうげき:${question.Attack} 
  ぼうぎょ:${question.Defense} 
  とくこう:${question.SpecialAttack} 
  とくぼう:${question.SpecialDefense}
  すばやさ:${question.Speed}
  
  
  `,
  choices,
});

const answer = await prompt.run();
console.log(answer);
