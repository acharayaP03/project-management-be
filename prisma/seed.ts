// import { PrismaClient } from '@prisma/client';
// import fs from 'fs';
// import path from 'path';
// const prisma = new PrismaClient();

// async function deleteAllData(orderedFileNames: string[]) {
//   const modelNames = orderedFileNames.map((fileName) => {
//     const modelName = path.basename(fileName, path.extname(fileName));
//     return modelName.charAt(0).toUpperCase() + modelName.slice(1);
//   });

//   for (const modelName of modelNames) {
//     const model: any = prisma[modelName as keyof typeof prisma];
//     try {
//       await model.deleteMany({});
//       console.log(`Cleared data from ${modelName}`);
//     } catch (error) {
//       console.error(`Error clearing data from ${modelName}:`, error);
//     }
//   }
// }

// async function main() {
//   const dataDirectory = path.join(__dirname, 'seedData');

//   const orderedFileNames = [
//     'team.json',
//     'project.json',
//     'projectTeam.json',
//     'user.json',
//     'task.json',
//     'attachment.json',
//     'comment.json',
//     'taskAssignment.json',
//   ];

//   await deleteAllData(orderedFileNames);

//   for (const fileName of orderedFileNames) {
//     const filePath = path.join(dataDirectory, fileName);
//     const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
//     const modelName = path.basename(fileName, path.extname(fileName));
//     const model: any = prisma[modelName as keyof typeof prisma];

//     try {
//       for (const data of jsonData) {
//         await model.create({ data });
//       }
//       console.log(`Seeded ${modelName} with data from ${fileName}`);
//     } catch (error) {
//       console.error(`Error seeding data for ${modelName}:`, error);
//     }
//   }
// }

// main()
//   .catch((e) => console.error(e))
//   .finally(async () => await prisma.$disconnect());
import { PrismaClient, User } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function seedWithValidation() {
  try {
    // Clear existing data in reverse order of dependencies
    await prisma.$transaction([
      prisma.comment.deleteMany({}),
      prisma.attachment.deleteMany({}),
      prisma.taskAssignment.deleteMany({}),
      prisma.task.deleteMany({}),
      prisma.projectTeam.deleteMany({}),
      prisma.user.deleteMany({}),
      prisma.project.deleteMany({}),
      prisma.team.deleteMany({}),
    ]);

    // 1. Create teams first
    const teamData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'seedData', 'team.json'), 'utf-8'),
    );
    const teams = await prisma.team.createMany({
      data: teamData,
      skipDuplicates: true,
    });
    console.log('✓ Teams created');

    // 2. Create users and store their IDs
    const userData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'seedData', 'user.json'), 'utf-8'),
    );
    const createdUsers: User[] = [];
    for (const user of userData) {
      const createdUser = await prisma.user.create({
        data: user,
      });
      createdUsers.push(createdUser);
    }
    console.log('✓ Users created');
    console.log(
      'Created user IDs:',
      createdUsers.map((u) => u.userId),
    );

    // 3. Create projects
    const projectData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, 'seedData', 'project.json'),
        'utf-8',
      ),
    );
    await prisma.project.createMany({
      data: projectData,
      skipDuplicates: true,
    });
    console.log('✓ Projects created');

    // 4. Create tasks with validated user IDs
    const taskData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'seedData', 'task.json'), 'utf-8'),
    );
    const validUserIds = new Set(createdUsers.map((u) => u.userId));

    // Validate and create tasks
    for (const task of taskData) {
      // Verify user IDs exist
      if (!validUserIds.has(task.authorUserId)) {
        console.warn(
          `Skipping task ${task.id}: Invalid authorUserId ${task.authorUserId}`,
        );
        continue;
      }
      if (task.assignedUserId && !validUserIds.has(task.assignedUserId)) {
        console.warn(
          `Skipping task ${task.id}: Invalid assignedUserId ${task.assignedUserId}`,
        );
        continue;
      }

      try {
        await prisma.task.create({
          data: task,
        });
      } catch (error) {
        console.error(`Error creating task ${task.id}:`, error);
        throw error;
      }
    }
    console.log('✓ Tasks created');

    // 5. Create attachments
    const attachmentData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, 'seedData', 'attachment.json'),
        'utf-8',
      ),
    );
    for (const attachment of attachmentData) {
      if (!validUserIds.has(attachment.uploadedById)) {
        console.warn(
          `Skipping attachment ${attachment.id}: Invalid uploadedById ${attachment.uploadedById}`,
        );
        continue;
      }

      try {
        await prisma.attachment.create({
          data: attachment,
        });
      } catch (error) {
        console.error(`Error creating attachment ${attachment.id}:`, error);
        throw error;
      }
    }
    console.log('✓ Attachments created');

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
}

seedWithValidation()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
