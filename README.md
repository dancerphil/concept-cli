# concept-cli

概念图谱

## 预想的使用方式

开发者需要维护一个普通的 md 文件系统，比如 docs

1. 可以从 docs 渲染出一个 md 文件系统，比如 view

    ```bash
    concept make
    ```
    
    make 产出内联的 link 和脚注 usage
    
    如果概念冲突会 failed

2. 概念的属性

    一个概念可以 `# A | B`，所有的相关文档会被 link
    
    一个概念所在文件夹即是其索引，可以任意层级
