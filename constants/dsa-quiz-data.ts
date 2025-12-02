// constants/dsa-quiz-data.ts

export const quizData = [
  {
    topic: "Core Concepts & Complexity",
    difficulty: "Easy",
    questions: [
      {
        q: "What does Big O notation describe in an algorithm?",
        options: ["The exact number of steps", "The best-case scenario", "The worst-case time or space complexity", "The physical memory used"],
        answer: "The worst-case time or space complexity",
        explanation: "Big O notation provides an upper bound on an algorithm's performance, helping us understand how it scales with more data."
      },
      {
        q: "What is the time complexity for accessing an element in an array by its index?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"],
        answer: "O(1)",
        explanation: "Accessing an array element by index is a constant time operation because the memory location is calculated directly."
      },
      {
        q: "In complexity analysis, what does 'n' typically represent?",
        options: ["The number of computers", "The size of the input", "A constant value", "The name of the algorithm"],
        answer: "The size of the input",
        explanation: "Great job! 'n' is used to represent the size of the input data, which helps us analyze how the algorithm's performance changes as the input grows."
      }
    ]
  },
  {
    topic: "Linked Lists",
    difficulty: "Medium",
    questions: [
      {
        q: "What is the primary difference between a singly and a doubly linked list?",
        options: ["Singly has one pointer per node, doubly has two", "Doubly lists are always circular", "Singly lists can't be empty", "Doubly lists store integers only"],
        answer: "Singly has one pointer per node, doubly has two",
        explanation: "Correct! A doubly linked list node points to both the next and the previous node, allowing for easier traversal in both directions."
      },
      {
        q: "What is the time complexity to insert a new node at the beginning of a singly linked list?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
        answer: "O(1)",
        explanation: "Inserting at the beginning is a constant time operation because you only need to update the head pointer."
      }
    ]
  },
  {
    topic: "Stacks & Queues",
    difficulty: "Easy",
    questions: [
      {
        q: "A stack follows which principle for adding and removing elements?",
        options: ["First-In, First-Out (FIFO)", "Last-In, First-Out (LIFO)", "First-In, Last-Out (FILO)", "Last-In, Last-Out (LILO)"],
        answer: "Last-In, First-Out (LIFO)",
        explanation: "Correct! A stack is like a pile of plates; the last one you add is the first one you take off."
      },
      {
        q: "A queue follows which principle for adding and removing elements?",
        options: ["Last-In, First-Out (LIFO)", "First-In, First-Out (FIFO)", "Last-In, Last-Out (LILO)", "Random-In, Random-Out (RIRO)"],
        answer: "First-In, First-Out (FIFO)",
        explanation: "You got it! A queue works like a line for a rollercoaster; the first person in line is the first person to get on."
      }
    ]
  },
  {
    topic: "Sorting Algorithms",
    difficulty: "Medium",
    questions: [
      {
        q: "What is the average-case time complexity of Bubble Sort?",
        options: ["O(n log n)", "O(n)", "O(log n)", "O(n^2)"],
        answer: "O(n^2)",
        explanation: "Bubble Sort has a quadratic time complexity, making it inefficient for large datasets but simple to understand."
      },
      {
        q: "Which of these sorting algorithms has a worst-case time complexity of O(n log n)?",
        options: ["Insertion Sort", "Bubble Sort", "Selection Sort", "Merge Sort"],
        answer: "Merge Sort",
        explanation: "Merge Sort consistently performs at O(n log n) by dividing the array and merging sorted halves."
      }
    ]
  },
  {
    topic: "Hash Maps & Sets",
    difficulty: "Medium",
    questions: [
      {
        q: "What is the main purpose of a hashing function in a hash map?",
        options: ["To sort the elements", "To convert a key into an array index", "To count the number of elements", "To encrypt the data"],
        answer: "To convert a key into an array index",
        explanation: "Exactly! A good hashing function quickly maps a key to a bucket, enabling fast lookups."
      },
      {
        q: "What occurs when a hashing function generates the same index for two different keys?",
        options: ["A hash collision", "A syntax error", "A load factor increase", "A memory leak"],
        answer: "A hash collision",
        explanation: "A hash collision is the correct term. It's a common problem that hash maps must handle."
      }
    ]
  },
  {
    topic: "Trees & Heaps",
    difficulty: "Hard",
    questions: [
      {
        q: "In a Binary Search Tree (BST), where are all nodes with values less than the root node found?",
        options: ["In the right subtree", "In the left subtree", "At the same level as the root", "Anywhere in the tree"],
        answer: "In the left subtree",
        explanation: "That's the key property of a BST! Values smaller than a node go to the left, and larger values go to the right."
      },
      {
        q: "What is the main property of a max-heap?",
        options: ["The root is the smallest value", "Every parent node is greater than or equal to its children", "All leaves are at the same level", "It is always a full binary tree"],
        answer: "Every parent node is greater than or equal to its children",
        explanation: "Correct! In a max-heap, the largest element is always at the root, and this property holds for all subtrees."
      }
    ]
  },
  {
    topic: "Graphs",
    difficulty: "Hard",
    questions: [
      {
        q: "What is a primary advantage of an adjacency list representation of a graph over an adjacency matrix?",
        options: ["It uses less space for sparse graphs", "It is faster to check for an edge between two nodes", "It is simpler to implement", "It can represent weighted edges more easily"],
        answer: "It uses less space for sparse graphs",
        explanation: "Adjacency lists are memory-efficient for graphs with few edges, as you only store the connections that exist."
      },
      {
        q: "Breadth-First Search (BFS) explores a graph in which manner?",
        options: ["By going as deep as possible down one path", "By exploring all neighbors of a node first", "By visiting nodes in a random order", "By following the path with the lowest edge weights"],
        answer: "By exploring all neighbors of a node first",
        explanation: "BFS explores layer by layer, making it great for finding the shortest path in an unweighted graph."
      }
    ]
  },
  {
    topic: "Advanced Techniques",
    difficulty: "Hard",
    questions: [
      {
        q: "Dynamic Programming is characterized by solving problems with optimal substructure and what other property?",
        options: ["Greedy choices", "Randomized selection", "Overlapping subproblems", "Divide and conquer"],
        answer: "Overlapping subproblems",
        explanation: "Yes! Dynamic Programming is powerful because it stores the results of subproblems to avoid re-computing them."
      },
      {
        q: "What is the key idea behind a 'Greedy' algorithm?",
        options: ["It finds the globally optimal solution", "It makes the locally optimal choice at each step", "It tries every possible solution", "It always backtracks if a choice is wrong"],
        answer: "It makes the locally optimal choice at each step",
        explanation: "A greedy algorithm hopes that by making the best choice at the moment, it will arrive at a global optimum."
      }
    ]
  }
];