export const BLITZ_CARDS = [
  {
    id: 1,
    code: `for(let i=0; i<n; i++) {\n  for(let j=0; j<n; j++) {\n    console.log(i,j);\n  }\n}`,
    claim: "Time Complexity is O(n)",
    isValid: false, 
    explanation: "Nested loops running 'n' times result in O(n²) complexity."
  },
  {
    id: 2,
    code: `const arr = [1, 2, 3];\narr.push(4);\nconsole.log(arr.length);`,
    claim: "Output is 4",
    isValid: true,
    explanation: "Array.push adds an element and returns the new length."
  },
  {
    id: 3,
    code: `const x = 10;\nx = 20;\nconsole.log(x);`,
    claim: "Runs without error",
    isValid: false,
    explanation: "You cannot reassign a variable declared with 'const'."
  },
  {
    id: 4,
    code: `// Check for even number\nfunction isEven(n) {\n  return n % 2 == 1;\n}`,
    claim: "Logic is correct",
    isValid: false,
    explanation: "n % 2 == 1 checks for odd numbers. Even numbers have a remainder of 0."
  },
  {
    id: 5,
    code: `let a = "5";\nlet b = 2;\nconsole.log(a - b);`,
    claim: "Output is 3",
    isValid: true,
    explanation: "JavaScript coerces the string '5' to a number during subtraction."
  }
];