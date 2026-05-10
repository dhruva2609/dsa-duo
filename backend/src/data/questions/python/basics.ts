import { ModuleData } from '../types';

export const pyBasics: ModuleData = {
  title: "Py: List Comprehensions",
  slug: "py-lists",
  language: "python",
  difficulty: "Easy",
  icon: "language-python",
  questions: [
    { 
      text: "What is the output of [x*x for x in [1,2,3]]?", 
      options: ["[1,4,9]", "[1,2,3]", "[2,4,6]", "Error"], 
      correctAnswer: "[1,4,9]", 
      explanation: "It squares each element in the list." 
    }
  ]
};
