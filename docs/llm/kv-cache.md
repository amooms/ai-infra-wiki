---
title: KV Cache
tags: [L5, 大模型推理, KV Cache]
template: article.html
page_type: article
category: llm
category_label: 大模型部署
---

# KV Cache

!!! info "本章节正在持续完善中 (WIP)"
    当前内容为知识骨架，将继续补充架构细节、选型边界与工程案例。

KV Cache 用显存或其他存储空间换取自回归解码中的重复计算。容量规划与序列长度、并发、层数、注意力结构及数据类型相关。
