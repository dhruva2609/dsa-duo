// constants/Levels.ts

// 1. Define the shape of a Question
export type Question = {
  id: number;
  question: string;
  code?: string; // <--- The '?' makes this optional, fixing the error
  options: string[];
  answer: string;
  explanation: string;
};

// 2. Define the shape of a Level
export type LevelData = {
  title: string;
  color: string;
  questions: Question[];
};

// 3. Apply the type to your data
export const LEVEL_DATA: Record<string, LevelData> = {
  'arrays': {
    title: "Arrays",
    color: '#3F20F0',
    questions: [
      {
        id: 1,
        question: "How do you access the first element of an array?",
        code: "int[] arr = {10, 20, 30};",
        options: ["arr[0]", "arr[1]", "arr.first()", "arr(0)"],
        answer: "arr[0]",
        explanation: "Array indices start at 0 in most languages like C++, Java, and Python."
      },
      {
        id: 2,
        question: "What is the time complexity to access an element by index?",
        // No 'code' here, which is now allowed!
        options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"],
        answer: "O(1)",
        explanation: "Arrays store data in contiguous memory, allowing instant access."
      }
    ]
  },
  'linked-lists': {
    title: "Linked Lists",
    color: '#FF5C95',
    questions: [
      {
        id: 1,
        question: "What does a node in a singly linked list contain?",
        options: ["Data only", "Data and Reference to next", "Reference to prev", "Index"],
        answer: "Data and Reference to next",
        explanation: "A node stores the value and a pointer/reference to the next node in the sequence."
      },
      {
        id: 2,
        question: "Time complexity to insert at the beginning?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
        answer: "O(1)",
        explanation: "You only need to update the head pointer, which is a constant time operation."
      }
    ]
  },
  'stacks': {
    title: "Stacks",
    color: '#FFB800',
    questions: [
      {
        id: 1,
        question: "Which principle does a Stack follow?",
        options: ["LIFO", "FIFO", "FILO", "LILO"],
        answer: "LIFO",
        explanation: "Stack follows Last In First Out (LIFO)."
      }
    ]
  },
  'queues': {
    title: "Queues",
    color: '#00C48C',
    questions: [
      {
        id: 1,
        question: "Which principle does a Queue follow?",
        options: ["LIFO", "FIFO", "Ordered", "Random"],
        answer: "FIFO",
        explanation: "Queue follows First In First Out (FIFO)."
      }
    ]
  },
  'trees': {
    title: "Trees",
    color: '#7D5FFF',
    questions: [
      {
        id: 1,
        question: "What is the top node of a tree called?",
        options: ["Leaf", "Root", "Child", "Parent"],
        answer: "Root",
        explanation: "The topmost node in a tree is called the Root node."
      }
    ]
  },
  'graphs': {
    title: "Graphs",
    color: '#FF9F43',
    questions: [
      {
        id: 1,
        question: "Which algorithm is used to find the shortest path?",
        options: ["DFS", "BFS", "Dijkstra", "Prim's"],
        answer: "Dijkstra",
        explanation: "Dijkstra's algorithm is commonly used for finding the shortest paths between nodes in a graph."
      }
    ]
  }
};

export type TopicKey = keyof typeof LEVEL_DATA;