#!/usr/bin/env node

import Quiz from "./quiz.js";

async function main() {
  const quiz = new Quiz();
  await quiz.run();
}

main();
