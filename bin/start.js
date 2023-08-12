#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const https = require("https");
const { exec } = require("child_process");
const packageJson = require("../package.json");
const { program } = require("commander");
// import fs from "fs-extra";
// import path from "path";
// import https from "https";
// import { exec } from "child_process";
// import packageJson from "../package.json";

const scripts = `  
"start": "webpack serve --env port=3000",
"build:prod": "webpack --env mode=production",
"build:dev": "webpack --env mode=development"
`;

const getDeps = (deps) =>
  Object.entries(deps)
    .map((dep) => `${dep[0]}@${dep[1]}`)
    .toString()
    .replace(/,/g, " ")
    .replace(/^/g, "")
    // исключим зависимость, используемую только в этом файле, не относящуюся к шаблону
    .replace(/fs-extra[^\s]+/g, "");

console.log("Идет инициализация проекта ...");

exec(
  `mkdir ${process.argv[2] ? process.argv[2] : "lubava-bp"} && cd ${
    process.argv[2] ? process.argv[2] : "lubava-bp"
  } && npm init -f`,
  (initErr, initStdout, initStderr) => {
    if (initErr) {
      console.error(`Все было хорошо, но затем все сломалось:
${initErr}`);
      return;
    }
    const packageJSON = `${
      process.argv[2] ? process.argv[2] : "lubava-bp"
    }/package.json`;
    // заменим скрипты, задаваемые по умолчанию
    fs.readFile(packageJSON, (err, file) => {
      if (err) throw err;
      const data = file
        .toString()
        .replace(
          '"test": "echo \\"Error: no test specified\\" && exit 1"',
          scripts
        );
      fs.writeFile(packageJSON, data, (err2) => err2 || true);
    });

    const filesToCopy = ["webpack.config.ts"];

    for (let i = 0; i < filesToCopy.length; i += 1) {
      fs.createReadStream(path.join(__dirname, `../${filesToCopy[i]}`)).pipe(
        fs.createWriteStream(
          `${process.argv[2] ? process.argv[2] : "lubava-bp"}/${filesToCopy[i]}`
        )
      );
    }
    // npm, при установке пакета, удалит файл .gitignore, поэтому его нельзя скопировать из локальной папки шаблона; этот файл нужно загрузить. После отправки кода в GitHub-репозиторий пользуйтесь raw-файлом .gitignore
    https.get(
      //   "https://github.com/Lubava7/git-ignore-for-my-boilerplate/blob/main/.gitignore",
      "https://raw.githubusercontent.com/Lubava7/git-ignore-for-my-boilerplate/main/.gitignore",
      (res) => {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", (data) => {
          body += data;
        });
        res.on("end", () => {
          fs.writeFile(
            `${process.argv[2] ? process.argv[2] : "lubava-bp"}/.gitignore`,
            body,
            { encoding: "utf-8" },
            (err) => {
              if (err) throw err;
            }
          );
        });
      }
    );

    console.log("npm init -- done\n");

    // установка зависимостей
    console.log("Устанавливаем зависимости, это займет некоторое время ...");
    const devDeps = getDeps(packageJson.devDependencies);
    const deps = getDeps(packageJson.dependencies);
    exec(
      `cd ${
        process.argv[2] ? process.argv[2] : "lubava-bp"
      } && git init && node -v && npm -v && npm i -D ${devDeps}` &&
        `npm i ${deps}`,
      (npmErr, npmStdout, npmStderr) => {
        if (npmErr) {
          console.error(`Возникла ошибка при установке зависимостей
  ${npmErr}`);
          return;
        }
        console.log(npmStdout);
        console.log("Все зависимости успешно установлены.");

        console.log("Копируем дополнительные файлы ...");
        // копирование дополнительных файлов с кодом
        fs.copy(
          path.join(__dirname, "../src"),
          `${process.argv[2] ? process.argv[2] : "lubava-bp"}/src`
        )
          // .then(() =>
          //   console.log(
          //     `Все готово!\n\nПроект готов к работе\n\nИспользуй команду ниже, чтобы начать работу с проектом\n\ncd ${process.argv[2] ? process.argv[2] : "lubava-bp"}\nnpm start`
          //   )
          // )
          .catch((err) => console.error(err));
        fs.copy(
          path.join(__dirname, "../config"),
          `${process.argv[2] ? process.argv[2] : "lubava-bp"}/config`
        )
          // .then(() =>
          //   console.log(
          //     `Все готово!\n\nПроект готов к работе\n\nИспользуй команду ниже, чтобы начать работу с проектом\n\ncd ${process.argv[2] ? process.argv[2] : "lubava-bp"}\nnpm start`
          //   )
          // )
          .catch((err) => console.error(err));
        fs.copy(
          path.join(__dirname, "../public"),
          `${process.argv[2] ? process.argv[2] : "lubava-bp"}/public`
        )
          .then(() =>
            console.log(
              `Все готово!\n\nПроект готов к работе\n\nИспользуй команду ниже, чтобы начать работу с проектом\n\ncd ${
                process.argv[2] ? process.argv[2] : "lubava-bp"
              }\nnpm start`
            )
          )
          .catch((err) => console.error(err));
      }
    );
  }
);

// program
//   .command("create <project-name>")
//   .description("Create a new project using your template")
//   .action((projectName) => {
//     ///
//     exec(
//       `npx create-react-app ${projectName} --template lubava-webpack-template`,
//       (err, stdout, stderr) => {
//         if (err) {
//           console.error(`Error: ${err}`);
//           return;
//         }
//         console.log(stdout);
//         console.error(stderr);
//       }
//     );
//     // создадим папку и инициализируем npm-проект

//     ///
//   });

program.parse(process.argv);
