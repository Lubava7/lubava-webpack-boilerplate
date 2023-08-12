import { BuildOptionsInterface } from "./types/config";
import { Configuration as DevServerConfiguration } from "webpack-dev-server";

export function buildDevServer(
  options: BuildOptionsInterface
): DevServerConfiguration {
  const { port } = options;
  return {
    port: port,
    open: true,
    hot: true,
  };
}
