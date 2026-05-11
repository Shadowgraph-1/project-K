"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/ui/chart";

export const description = "A bar chart with a label";

const chartData = [
  { day: "Пн", active: 186 },
  { day: "Вт", active: 305 },
  { day: "Ср", active: 237 },
  { day: "Чт", active: 73 },
  { day: "Пт", active: 209 },
  { day: "Сб", active: 214 },
  { day: "Вс", active: 214 },
];

const chartConfig = {
  active: {
    label: "Активность",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;


export function ChartBarLabel() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Продуктивность в неделю</CardTitle>
          <CardDescription>Июнь - Июль</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="active" fill="var(--color-active)" radius={8}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Ваши успехи улучшились, так держать!{" "}
            <TrendingUp className="size-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Статистика по дням недели
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
