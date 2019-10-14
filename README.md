# concept-cli

[![version](https://img.shields.io/npm/v/concept-cli.svg?style=flat-square)](http://npm.im/concept-cli)

在现有的文档上生成[概念](.docs/概念.md)图谱。

## GetStarted

```bash
yarn add concept-cli -g
```

```bash
concept
// or
concept --sourceDir docs --targetDir .docs
```

`concept` 会读取当前目录下的 `docs` 文件夹，并在 `.docs` 生成一套携带了概念图谱的新文档。
