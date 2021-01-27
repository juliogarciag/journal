import { DateTime } from "luxon";
import expressAsyncHandler from "express-async-handler";
import prisma from "lib/prismaClient";
import { MetricTemplate, MetricType, Entry } from "@prisma/client";
import { camelCase, sumBy } from "lodash";

function getDaysUntilDay(dayDate: Date) {
  const day = DateTime.fromJSDate(dayDate);
  const beginningOfYear = DateTime.fromObject({
    day: 1,
    month: 1,
    year: day.year,
  });
  return Math.abs(beginningOfYear.diff(day, "days").days);
}

async function getAverageMetric(associatedEntries: Array<Entry>, today: Date) {
  const sum = sumBy(associatedEntries, (entry) => entry.quantityValue);
  const totalCount = getDaysUntilDay(today);

  return { average: sum / totalCount };
}

function getProportionMetric(associatedEntries: Array<Entry>, today: Date) {
  const yesCount = associatedEntries.filter((entry) => entry.booleanValue)
    .length;
  const totalCount = getDaysUntilDay(today);

  return { yesCount, totalCount };
}

const METRIC_STRATEGIES: { [key in MetricType]: Function } = {
  [MetricType.AVERAGE]: getAverageMetric,
  [MetricType.PROPORTION]: getProportionMetric,
};

async function calculateMetrics(
  template: MetricTemplate,
  today: Date,
  year: number
) {
  const metricStrategy = METRIC_STRATEGIES[template.metricType];

  const todayForSql = DateTime.fromJSDate(today).toFormat("yyyy-MM-dd");
  const associatedEntries = await prisma.$queryRaw<Array<Entry>>(`
    SELECT * FROM "Entry"
      WHERE EXTRACT(year from day) = ${year}
      AND "entryTypeId" = ${template.entryTypeId}
      AND day < '${todayForSql}'
  `);

  return metricStrategy(associatedEntries, today);
}

export default expressAsyncHandler(async (request, response) => {
  const today = DateTime.fromISO(request.query.today as string).toJSDate();
  const year = Number(request.query.year);

  const metricTemplates = await prisma.metricTemplate.findMany({
    include: {
      entryType: true,
    },
  });

  const metrics = [];

  for (const template of metricTemplates) {
    const calculatedMetric = await calculateMetrics(template, today, year);

    metrics.push({
      ...template,
      [`${camelCase(template.metricType)}Data`]: calculatedMetric,
    });
  }

  response.json({ metrics });
});
