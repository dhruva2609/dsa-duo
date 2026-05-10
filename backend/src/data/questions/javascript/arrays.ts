import { ModuleData } from '../types';

export const jsArrays: ModuleData = {
  title: "JS: Core Arrays",
  slug: "js-arrays",
  language: "javascript",
  difficulty: "Easy",
  icon: "code-braces",
  questions: [
    { 
      text: "What is the time complexity of arr.push() in JS?", 
      options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], 
      correctAnswer: "O(1)", 
      explanation: "Appending to the end is constant time." 
    },
    { 
      text: "Which method removes the first element?", 
      options: ["pop()", "shift()", "slice()", "splice()"], 
      correctAnswer: "shift()", 
      explanation: "shift() removes the element at index 0." 
    }
  ]
};
