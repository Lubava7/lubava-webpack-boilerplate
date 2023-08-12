import path from "path";
import webpack from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { BuildOptionsInterface } from "./types/config";

export function buildLoaders(
  options: BuildOptionsInterface
): webpack.RuleSetRule[] {
  const { isDev } = options;
  // Усли не исп Тс - нужен babel-loader
  const typescriptLoader = {
    test: /\.tsx?$/, // какие файлы будет обрабатывать - в нашем случае ts , tsx
    use: "ts-loader", // какой лоадер для этого нужен
    exclude: /node_modules/, // исключения при обработке
  };

  const cssLoader = {
    test: /\.s[ac]ss$/i,
    use: [
      isDev ? "style-loader" : MiniCssExtractPlugin.loader,
      {
        loader: "css-loader",
        options: {
          modules: {
            auto: (resPath: string) => Boolean(resPath.includes(".module")),
            localIdentName: isDev
              ? "[path][name]__[local]--[hash:base64:5]"
              : "[hash:base64:8]",
          },
        },
      },
      "sass-loader",
    ], // важен порядок в котором идут лоадеры
  };

  return [typescriptLoader, cssLoader];
}
