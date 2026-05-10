import { ModuleData } from '../types';

export const cppLargeBank: ModuleData = {
  title: "C++ DSA Mastery",
  slug: "cpp-dsa-mastery",
  language: "cpp",
  difficulty: "Hard",
  icon: "layers",
  questions: [
    // --- LEVEL 1: STL BASICS & ARRAYS ---
    {
      id: "cpp-l1-1",
      text: "Which function adds an element to the end of a vector?",
      options: ["push_back()", "append()", "insert_end()", "add()"],
      correctAnswer: "push_back()",
      explanation: "push_back() adds an element to the end and increases size by 1.",
      testCases: [{ input: "v.push_back(5); v.back()", output: "5" }]
    },
    {
      id: "cpp-l1-2",
      text: "Complexity of accessing an element in an array by index?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
      correctAnswer: "O(1)",
      explanation: "Arrays use contiguous memory, allowing direct index calculation.",
      testCases: [{ input: "int a[]={1,2}; a[1]", output: "2" }]
    },
    {
      id: "cpp-l1-3",
      text: "What does 'v.size()' return for a vector?",
      options: ["Memory allocated", "Number of elements", "Max capacity", "Pointer to head"],
      correctAnswer: "Number of elements",
      explanation: "size() returns the count of actual elements currently in the vector.",
      testCases: [{ input: "vector<int> v={1,2}; v.size()", output: "2" }]
    },
    {
      id: "cpp-l1-4",
      text: "Which STL container does not allow duplicate elements?",
      options: ["vector", "list", "set", "deque"],
      correctAnswer: "set",
      explanation: "std::set stores only unique elements in sorted order.",
      testCases: [{ input: "set<int> s={1,1,2}; s.size()", output: "2" }]
    },
    {
      id: "cpp-l1-5",
      text: "What is the time complexity of 'std::sort'?",
      options: ["O(n)", "O(n^2)", "O(n log n)", "O(log n)"],
      correctAnswer: "O(n log n)",
      explanation: "std::sort uses IntroSort, ensuring O(n log n) in all cases.",
      testCases: [{ input: "sort(v.begin(), v.end())", output: "Sorted" }]
    },
    {
      id: "cpp-l1-6",
      text: "How do you get the last element of a vector without removing it?",
      options: ["v.pop()", "v.end()", "v.back()", "v.last()"],
      correctAnswer: "v.back()",
      explanation: "v.back() returns a reference to the last element.",
      testCases: [{ input: "v={3,4}; v.back()", output: "4" }]
    },
    {
      id: "cpp-l1-7",
      text: "Which header is needed for 'std::accumulate'?",
      options: ["<vector>", "<algorithm>", "<numeric>", "<iostream>"],
      correctAnswer: "<numeric>",
      explanation: "Numeric algorithms like accumulate and iota are in <numeric>.",
      testCases: [{ input: "accumulate(v.begin(), v.end(), 0)", output: "Sum" }]
    },
    {
      id: "cpp-l1-8",
      text: "What is the result of 'v.front()' on an empty vector?",
      options: ["0", "NULL", "Undefined Behavior", "Runtime Error"],
      correctAnswer: "Undefined Behavior",
      explanation: "Calling front() on an empty container is not safety-checked by STL.",
      testCases: [{ input: "vector<int> v; v.front()", output: "Crash/UB" }]
    },
    {
      id: "cpp-l1-9",
      text: "How do you increase vector capacity manually?",
      options: ["resize()", "reserve()", "expand()", "allocate()"],
      correctAnswer: "reserve()",
      explanation: "reserve() allocates memory without changing the vector's size.",
      testCases: [{ input: "v.reserve(100); v.capacity()", output: "100" }]
    },
    {
      id: "cpp-l1-10",
      text: "Which loop is most efficient for read-only vector traversal (C++11)?",
      options: ["for(int i=0...)", "for(auto it...)", "for(const auto& x : v)", "while(v.size())"],
      correctAnswer: "for(const auto& x : v)",
      explanation: "Range-based for loop with const reference avoids unnecessary copies.",
      testCases: [{ input: "for(const auto& x : v) cout << x;", output: "elements" }]
    },

    // --- LEVEL 2: STRING & TWO POINTERS ---
    {
      id: "cpp-l2-1",
      text: "Time complexity of 'string::substr(pos, len)'?",
      options: ["O(1)", "O(len)", "O(pos)", "O(n)"],
      correctAnswer: "O(len)",
      explanation: "Creating a substring requires copying 'len' characters.",
      testCases: [{ input: "string('hello').substr(1,2)", output: "'el'" }]
    },
    {
      id: "cpp-l2-2",
      text: "How to convert a string to an integer in C++?",
      options: ["toInt()", "stoi()", "parse()", "static_cast<int>()"],
      correctAnswer: "stoi()",
      explanation: "stoi() (string to integer) is the standard C++11 way.",
      testCases: [{ input: "stoi('123')", output: "123" }]
    },
    {
      id: "cpp-l2-3",
      text: "Two-pointer technique is most commonly used on what?",
      options: ["Trees", "Sorted Arrays", "Stacks", "Heaps"],
      correctAnswer: "Sorted Arrays",
      explanation: "It exploits the sorted property to shrink the search space.",
      testCases: [{ input: "while(left < right)", output: "Result" }]
    },
    {
      id: "cpp-l2-4",
      text: "Which function checks if a character is alphanumeric?",
      options: ["isAlpha()", "isalnum()", "is_num()", "is_text()"],
      correctAnswer: "isalnum()",
      explanation: "Part of <cctype>, checks for A-Z, a-z, or 0-9.",
      testCases: [{ input: "isalnum('A')", output: "nonzero" }]
    },
    {
      id: "cpp-l2-5",
      text: "Best way to reverse a string 's' in-place?",
      options: ["s.reverse()", "reverse(s.begin(), s.end())", "sort(s.rbegin())", "s = s[::-1]"],
      correctAnswer: "reverse(s.begin(), s.end())",
      explanation: "Standard algorithm works on string iterators.",
      testCases: [{ input: "s='ab'; reverse(s.begin(), s.end())", output: "'ba'" }]
    },
    {
      id: "cpp-l2-6",
      text: "How to efficiently concatenate strings in a loop?",
      options: ["s = s + next", "s += next", "s.append(next)", "Both B and C"],
      correctAnswer: "Both B and C",
      explanation: "+= and append() are optimized to modify the original string memory.",
      testCases: [{ input: "s += 'a'", output: "sa" }]
    },
    {
      id: "cpp-l2-7",
      text: "What does 'string::npos' represent?",
      options: ["Start of string", "End of string", "Value not found", "Null terminator"],
      correctAnswer: "Value not found",
      explanation: "Returned by find() when the search fails.",
      testCases: [{ input: "s.find('z') == string::npos", output: "true" }]
    },
    {
      id: "cpp-l2-8",
      text: "Which of these is O(1) for a string?",
      options: ["length()", "find()", "erase()", "insert()"],
      correctAnswer: "length()",
      explanation: "Size is stored as a member variable in std::string.",
      testCases: [{ input: "s.length()", output: "n" }]
    },
    {
      id: "cpp-l2-9",
      text: "Complexity of Two Sum problem using a hash map?",
      options: ["O(n^2)", "O(n log n)", "O(n)", "O(1)"],
      correctAnswer: "O(n)",
      explanation: "One pass through the array with O(1) map lookups.",
      testCases: [{ input: "twoSum({2,7,11}, 9)", output: "{0,1}" }]
    },
    {
      id: "cpp-l2-10",
      text: "How to convert a single digit char '5' to int 5?",
      options: ["int(c)", "c - '0'", "stoi(c)", "atoi(c)"],
      correctAnswer: "c - '0'",
      explanation: "Subtracting the ASCII value of '0' yields the integer value.",
      testCases: [{ input: "'5' - '0'", output: "5" }]
    }
  ]
};