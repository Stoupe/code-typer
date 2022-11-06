import { faker } from "@faker-js/faker";

const functionGenerator = (
  functionName: string,
  /** Record with variable name as the key and optional type as the value */
  params: Record<string, string | null>,
  lines: string[]
): string => {
  const paramsString = Object.entries(params)
    .map(([name, type]) => `${name}${type ? `: ${type}` : ""}`)
    .join(", ");

  const allLines = [];

  const isExported = faker.datatype.boolean();
  const functionType = faker.helpers.arrayElement(["function", "const"]);

  switch (functionType) {
    case "function":
      allLines.push(
        `${
          isExported ? "export " : ""
        }function ${functionName}(${paramsString}) {`
      );
      break;
    case "const":
      allLines.push(
        `${
          isExported ? "export " : ""
        }const ${functionName} = (${paramsString}) => {`
      );
      break;
  }

  allLines.push(...lines.map((line) => (line ? `  ${line}` : "")));
  allLines.push("};");

  return allLines.join("\n");
};

const randomNumberBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const initialiseVariables = () => {
  const variableNames = [];
  const lines = [];
  for (let i = 0; i < randomNumberBetween(2, 4); i++) {
    const variableName = faker.name.firstName().toLowerCase();
    variableNames.push(variableName);
    lines.push(`const ${variableName} = "${faker.music.genre()}";`);
  }
  return { variableNames, lines };
};

const performActions = (variableNames: string[]) => {
  const lines = [];
  for (let i = 0; i < randomNumberBetween(1, 5); i++) {
    const variableName =
      variableNames[randomNumberBetween(0, variableNames.length - 1)];
    const action = faker.helpers.arrayElement([
      ".toUpperCase()",
      ".toLowerCase()",
      ".trim()",
    ]);
    lines.push(`${variableName}${action};`);
  }
  return lines;
};

export const generate = () => {
  const functionName: string = faker.word.verb();

  const numParams = randomNumberBetween(1, 3);
  const params: Record<string, string | null> = {};

  for (let i = 0; i < numParams; i++) {
    const paramName = faker.word.interjection();
    const paramType = faker.helpers.arrayElement([
      "string",
      "number",
      "boolean",
      "any",
      null,
    ]);
    params[paramName] = paramType;
  }

  const functionBody: string[] = [];

  const {
    variableNames: initialisedVariableNames,
    lines: initialiseVariablesCode,
  } = initialiseVariables();

  functionBody.push(...initialiseVariablesCode);
  functionBody.push("");
  functionBody.push(...performActions(initialisedVariableNames));

  const func = functionGenerator(functionName, params, functionBody);

  return func;
};
