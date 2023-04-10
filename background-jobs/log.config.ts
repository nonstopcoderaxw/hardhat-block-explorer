import { LogLevel } from "typescript-logging";
import { CategoryProvider, Category } from "typescript-logging-category-style";

const provider = CategoryProvider.createProvider("ExampleProvider", {
  level: LogLevel.Debug,
});

export const backgroundJobLog = provider.getCategory("background-job");
