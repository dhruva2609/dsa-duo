import { ModuleData } from '../types';

export const pythonDictionaries: ModuleData = {
  title: "Python Dictionaries",
  slug: "py-dicts",
  language: "python",
  difficulty: "Medium",
  icon: "book-open-variant",
  questions: [
    {
      id: "py-dict-1",
      text: "What is the average time complexity for accessing a value by key in a Python dictionary?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
      correctAnswer: "O(1)",
      explanation: "Python dictionaries are implemented as hash tables, providing average constant-time complexity for lookups.",
      testCases: [
        { input: "d = {'a': 1}; d['a']", output: "1" },
        { input: "d = {}; d.get('x', 0)", output: "0" }
      ]
    },
    {
      id: "py-dict-2",
      text: "Which method is used to remove all items from a dictionary?",
      options: ["remove()", "delete()", "clear()", "popall()"],
      correctAnswer: "clear()",
      explanation: "The clear() method empties the dictionary in place.",
      testCases: [
        { input: "d = {1:1}; d.clear(); len(d)", output: "0" }
      ]
    }
  ]
};
