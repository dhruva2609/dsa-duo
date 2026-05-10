export interface TestCase {
  input: string;
  output: string;
}

export interface Question {
  id: string;
  text: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  testCases?: TestCase[];
}

export interface ModuleData {
  title: string;
  slug: string;
  language: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  icon: string;
  questions: Question[];
}
