/** @type {import('next').NextConfig} */

//const isProd = (process.env.NODE_ENV = "development");

const nextConfig = {
  //basePath: "/lignumNext",
  //assetPrefix: "/lignumNext/",
  //basePath: isProd ? "/lignumNext" : "",
  output: "export", //para que produsca paginas estaticas
  images: { unoptimized: true },
};
module.exports = nextConfig;
