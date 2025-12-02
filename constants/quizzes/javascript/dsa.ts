const dsa = [
  {
    topic: "Core Concepts & Complexity",
    theory: [
      {
        title: "What is an Algorithm?",
        description: "An algorithm is a step-by-step procedure or formula for solving a problem. In computing, it's a sequence of instructions that a computer follows to perform a task, like sorting a list or searching for a value."
      },
      {
        title: "Big O Notation",
        description: "Big O notation is used to describe the performance or complexity of an algorithm. It tells you how the runtime or memory usage of an algorithm grows as the input size (n) increases. It describes the worst-case scenario."
      },
      {
        title: "Common Big O Complexities",
        description: "O(1) - Constant Time: Always takes the same amount of time, regardless of input size. (e.g., accessing an array index)\nO(log n) - Logarithmic Time: Runtime grows logarithmically. Very efficient. (e.g., binary search)\nO(n) - Linear Time: Runtime grows linearly with input size. (e.g., looping through an array)\nO(n^2) - Quadratic Time: Runtime grows quadratically. Becomes slow with large inputs. (e.g., nested loops)"
      },
      {
        title: "Space Complexity",
        description: "Space complexity measures the amount of memory an algorithm needs to run to completion, relative to the input size. It includes both the memory used by the input and any auxiliary memory used by the algorithm."
      }
    ],
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
        q: "Which of the following Big O notations represents the most efficient algorithm?",
        options: ["O(n^2)", "O(n log n)", "O(n)", "O(log n)"],
        answer: "O(log n)",
        explanation: "An O(log n) algorithm's runtime grows very slowly as the input size increases, making it highly efficient."
      },
      {
        q: "Space complexity refers to the amount of memory an algorithm needs to what?",
        options: ["Store its output", "Run to completion", "Store its variables", "Load into the CPU"],
        answer: "Run to completion",
        explanation: "Space complexity measures the total memory used by an algorithm, including input, output, and auxiliary space, as the input size grows."
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
      },
      {
        q: "A node in a singly linked list typically contains data and a pointer to what?",
        options: ["The previous node", "The head of the list", "The next node in the list", "The tail of the list"],
        answer: "The next node in the list",
        explanation: "That's right! Each node holds a reference to the next one, forming the chain of the list."
      },
      {
        q: "Which operation is more efficient in a doubly linked list compared to a singly linked list?",
        options: ["Accessing the first element", "Deleting the last node (with tail pointer)", "Traversing the list forwards", "Deleting a given node from the middle"],
        answer: "Deleting a given node from the middle",
        explanation: "With a doubly linked list, you can easily update the 'previous' pointer of the next node, which is harder in a singly linked list."
      },
      {
        q: "What is a common issue you need to handle when traversing a linked list?",
        options: ["The list being too large", "Reaching a null pointer at the end", "The list being sorted", "The list containing duplicate values"],
        answer: "Reaching a null pointer at the end",
        explanation: "Exactly! Your traversal loop must correctly handle the 'null' that marks the end of the list to avoid errors."
      }
    ]
  },
  {
    topic: "Stacks & Queues",
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
      },
      {
        q: "Which operation removes an element from the top of a stack?",
        options: ["enqueue", "dequeue", "push", "pop"],
        answer: "pop",
        explanation: "Pop is the correct term for removing the top element from a stack. Keep it up!"
      },
      {
        q: "Which data structure is commonly used to manage function calls in a program?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        answer: "Stack",
        explanation: "Yes! The call stack keeps track of active functions, with the most recent call at the top."
      },
      {
        q: "The 'enqueue' operation is associated with which data structure?",
        options: ["Stack", "Graph", "Queue", "Tree"],
        answer: "Queue",
        explanation: "Enqueue means adding an element to the back of the queue. You're doing great!"
      }
    ]
  },
  {
    topic: "Sorting Algorithms",
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
      },
      {
        q: "Insertion Sort is particularly efficient for what type of data?",
        options: ["Completely random data", "Reversed data", "Data that is already mostly sorted", "Very large datasets"],
        answer: "Data that is already mostly sorted",
        explanation: "Nice one! Insertion sort shines when it only has to shift a few elements to place a new one correctly."
      },
      {
        q: "Which sorting algorithm repeatedly finds the minimum element from the unsorted part and puts it at the beginning?",
        options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"],
        answer: "Selection Sort",
        explanation: "That's the one! Selection Sort 'selects' the smallest remaining element in each pass."
      },
      {
        q: "Which of the following is a 'divide and conquer' sorting algorithm?",
        options: ["Insertion Sort", "Merge Sort", "Bubble Sort", "Selection Sort"],
        answer: "Merge Sort",
        explanation: "You're on fire! Merge Sort is a classic example of the 'divide and conquer' strategy."
      }
    ]
  },
  {
    topic: "Hash Maps & Sets",
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
      },
      {
        q: "The 'chaining' method for collision resolution involves using what data structure at each index?",
        options: ["Another hash map", "A stack", "An array", "A linked list"],
        answer: "A linked list",
        explanation: "Correct! Chaining creates a linked list of all key-value pairs that hash to the same index."
      },
      {
        q: "What does the 'load factor' of a hash map measure?",
        options: ["How full the hash map is", "The speed of the hashing function", "The amount of memory used", "The number of collisions"],
        answer: "How full the hash map is",
        explanation: "The load factor helps decide when to resize the hash map to maintain performance. Great job!"
      },
      {
        q: "In a well-implemented hash map, what is the average time complexity for search, insert, and delete operations?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"],
        answer: "O(1)",
        explanation: "On average, hash map operations are constant time, which is what makes them so powerful!"
      }
    ]
  },
  {
    topic: "Trees & Heaps",
    questions: [
      {
        q: "In a Binary Search Tree (BST), where are all nodes with values less than the root node found?",
        options: ["In the right subtree", "In the left subtree", "At the same level as the root", "Anywhere in the tree"],
        answer: "In the left subtree",
        explanation: "That's the key property of a BST! Values smaller than a node go to the left, and larger values go to the right."
      },
      {
        q: "Which tree traversal visits the nodes of a Binary Search Tree in sorted, ascending order?",
        options: ["Pre-order", "Post-order", "In-order", "Level-order"],
        answer: "In-order",
        explanation: "In-order traversal (Left, Root, Right) on a BST will always produce a sorted list of its values. Awesome!"
      },
      {
        q: "What is the main property of a max-heap?",
        options: ["The root is the smallest value", "Every parent node is greater than or equal to its children", "All leaves are at the same level", "It is always a full binary tree"],
        answer: "Every parent node is greater than or equal to its children",
        explanation: "Correct! In a max-heap, the largest element is always at the root, and this property holds for all subtrees."
      },
      {
        q: "A pre-order traversal of a binary tree follows which pattern?",
        options: ["Left, Right, Root", "Left, Root, Right", "Root, Left, Right", "Right, Left, Root"],
        answer: "Root, Left, Right",
        explanation: "Pre-order traversal processes the root first, then recursively traverses the left and right subtrees. You've got it!"
      },
      {
        q: "In a min-heap, the element at the root of the tree is always what?",
        options: ["The largest element", "The median element", "The smallest element", "The last element added"],
        answer: "The smallest element",
        explanation: "That's right! A min-heap is structured to always keep the minimum element at the top for quick access."
      }
    ]
  },
  {
    topic: "Graphs",
    questions: [
      {
        q: "What is a primary advantage of an adjacency list representation of a graph over an adjacency matrix?",
        options: ["It uses less space for sparse graphs", "It is faster to check for an edge between two nodes", "It is simpler to implement", "It can represent weighted edges more easily"],
        answer: "It uses less space for sparse graphs",
        explanation: "Adjacency lists are memory-efficient for graphs with few edges, as you only store the connections that exist."
      },
      {
        q: "In graph theory, what is a 'vertex'?",
        options: ["A connection between two nodes", "A path that starts and ends at the same node", "A node or a point in the graph", "The weight of an edge"],
        answer: "A node or a point in the graph",
        explanation: "You're right! A vertex is the fundamental unit of a graph, representing an object or point."
      },
      {
        q: "Breadth-First Search (BFS) explores a graph in which manner?",
        options: ["By going as deep as possible down one path", "By exploring all neighbors of a node first", "By visiting nodes in a random order", "By following the path with the lowest edge weights"],
        answer: "By exploring all neighbors of a node first",
        explanation: "BFS explores layer by layer, making it great for finding the shortest path in an unweighted graph."
      },
      {
        q: "Which data structure is typically used to implement a Depth-First Search (DFS)?",
        options: ["A queue", "A stack", "A hash map", "A set"],
        answer: "A stack",
        explanation: "DFS uses a stack (often the call stack via recursion) to keep track of which node to visit next as it goes deeper."
      },
      {
        q: "A path in a graph that starts and ends at the same vertex is called a what?",
        options: ["A tree", "A component", "An edge", "A cycle"],
        answer: "A cycle",
        explanation: "Correct! Identifying cycles is an important part of many graph algorithms."
      }
    ]
  },
  {
    topic: "Advanced Techniques",
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
      },
      {
        q: "The 'optimal substructure' property means that an optimal solution to a problem can be constructed from what?",
        options: ["Random guesses", "Optimal solutions to its subproblems", "A single greedy choice", "A hash table"],
        answer: "Optimal solutions to its subproblems",
        explanation: "This property is fundamental to DP, allowing you to build up a correct solution from smaller pieces. Well done!"
      },
      {
        q: "Which of these problems is a classic example solved using Dynamic Programming?",
        options: ["Sorting an array", "Finding the shortest path in an unweighted graph", "Calculating the Fibonacci sequence", "Searching for an element in a BST"],
        answer: "Calculating the Fibonacci sequence",
        explanation: "The Fibonacci sequence has both optimal substructure and overlapping subproblems, making it a perfect fit for DP."
      },
      {
        q: "A key difference between Dynamic Programming and a simple Greedy approach is that DP usually does what?",
        options: ["Makes a single, final decision", "Considers multiple choices and finds the best one", "Runs faster", "Uses less memory"],
        answer: "Considers multiple choices and finds the best one",
        explanation: "DP is more exhaustive than a greedy algorithm, ensuring it finds the true optimal solution by exploring more options."
      }
    ]
  }
];

export default dsa;