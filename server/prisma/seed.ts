import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seed() {
  await prisma.entryType.create({
    data: {
      name: "Wake up time",
      dataType: "TIME",
      rowOrder: 0,
      icon: "sun",
    }
  })

  await prisma.entryType.create({
    data: {
      name: "Workout?",
      dataType: "BOOLEAN",
      rowOrder: 1,
      icon: "dumbbell",
      metricTemplates: {
        create: [
          { metricType: "PROPORTION" }
        ]
      }
    }
  })

  await prisma.entryType.create({
    data: {
      name: "Did you brush your teeth?",
      dataType: "BOOLEAN",
      rowOrder: 2,
      icon: "tooth",
      metricTemplates: {
        create: [
          { metricType: "PROPORTION" }
        ]
      }
    }
  })

  await prisma.entryType.create({
    data: {
      name: "Skin Care?",
      dataType: "BOOLEAN",
      rowOrder: 3,
      icon: "smile-beam",
      metricTemplates: {
        create: [
          { metricType: "PROPORTION" }
        ]
      }
    }
  })

  await prisma.entryType.create({
    data: {
      name: "Kraken Releases?",
      dataType: "QUANTITY",
      rowOrder: 4,
      icon: "pastafarianism",
      metricTemplates: {
        create: [
          { metricType: "AVERAGE" }
        ]
      }
    }
  })

  await prisma.entryType.create({
    data: {
      name: "Sleep time",
      dataType: "TIME",
      rowOrder: 5,
      icon: "moon",
    }
  })
}

seed()
