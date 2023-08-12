import webpack from "webpack";
import path from "path";
import { BuildOptionsInterface } from "./types/config";
import { buildPlugins } from "./buildPlugins";
import { buildLoaders } from "./buildLoaders";
import { buildResolvers } from "./buildResolvers";
import { buildDevServer } from "./buildDevServer";

export function buildWebpackConfig(
  options: BuildOptionsInterface
): webpack.Configuration {
  const { paths, mode, isDev } = options;

  return {
    mode: mode,
    entry: paths?.entry,
    output: {
      filename: "[name].[contenthash].js",
      path: paths?.build,
      clean: true,
    },
    plugins: buildPlugins(options),
    module: {
      rules: buildLoaders(options),
    },
    resolve: buildResolvers(),
    // devtool: "inline-cheap-source-map",
    devtool: isDev ? "inline-source-map" : undefined,
    devServer: isDev ? buildDevServer(options) : undefined, // нужен для того чтобы вручную не пересобирать проект а видеть изменения сразу после сохранения
  };
}
