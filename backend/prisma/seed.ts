import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const dsaData = [
  {
    topic: "Core Concepts & Complexity",
    slug: "core-concepts-complexity",
    difficulty: "Easy",
    icon: "code-braces",
    questions: [
      { q: "What does Big O notation describe?", options: ["Exact steps", "Best case", "Worst-case complexity", "Memory"], answer: "Worst-case complexity", explanation: "Big O describes the upper bound." },
      { q: "Time complexity for array access by index?", options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], answer: "O(1)", explanation: "Direct memory access is constant time." },
      { q: "Which is most efficient?", options: ["O(n^2)", "O(n log n)", "O(n)", "O(log n)"], answer: "O(log n)", explanation: "Logarithmic grows very slowly." }
    ]
  },
  {
    topic: "Linked Lists",
    slug: "linked-lists",
    difficulty: "Medium",
    icon: "link-variant",
    questions: [
      { q: "Difference between singly and doubly linked list?", options: ["Singly has 1 pointer, doubly has 2", "Doubly is circular", "Singly is faster", "None"], answer: "Singly has 1 pointer, doubly has 2", explanation: "Doubly has prev and next pointers." },
      { q: "Insert at beginning complexity?", options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], answer: "O(1)", explanation: "Just update the head pointer." }
    ]
  },
  {
    topic: "Stacks & Queues",
    slug: "stacks-queues",
    difficulty: "Medium",
    icon: "layers",
    questions: [
        { q: "Stack principle?", options: ["FIFO", "LIFO", "FILO", "LILO"], answer: "LIFO", explanation: "Last In First Out." },
        { q: "Queue principle?", options: ["LIFO", "FIFO", "LILO", "Random"], answer: "FIFO", explanation: "First In First Out." }
    ]
  }
];

async function main() {
  console.log('Start seeding ...');
  for (const module of dsaData) {
    const createdModule = await prisma.module.upsert({
      where: { slug: module.slug },
      update: {},
      create: {
        slug: module.slug,
        title: module.topic,
        difficulty: module.difficulty,
        icon: module.icon,
        questions: {
          create: module.questions.map(q => ({
            text: q.q,
            options: q.options,
            correctAnswer: q.answer,
            explanation: q.explanation
          }))
        }
      },
    });
    console.log(`Created module with id: ${createdModule.id}`);
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });