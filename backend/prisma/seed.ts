import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { questionBank } from '../src/data/questions';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding from Question Bank ...');
  
  // Clear existing
  await prisma.question.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.module.deleteMany();
  await prisma.user.deleteMany();

  // Create default user
  const hashedPassword = await bcrypt.hash('password123', 10);
  await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@test.com',
      password: hashedPassword,
      xp: 0,
      hearts: 5,
      streak: 0
    }
  });

  for (const module of questionBank) {
    await prisma.module.create({
      data: {
        slug: module.slug,
        title: module.title,
        language: module.language,
        difficulty: module.difficulty,
        icon: module.icon,
        questions: {
          create: module.questions.map(q => ({
            text: q.text,
            codeSnippet: q.codeSnippet || null,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation
          }))
        }
      },
    });
    console.log(`Successfully seeded: ${module.slug}`);
  }
  
  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });