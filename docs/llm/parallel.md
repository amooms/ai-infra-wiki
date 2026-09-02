---
title: 并行策略
tags: [L5, 大模型训练, 并行计算]
template: article.html
page_type: article
category: llm
category_label: 大模型部署
---

# 并行策略

!!! info "本章节正在持续完善中 (WIP)"
    当前内容为知识骨架，将继续补充架构细节、选型边界与工程案例。

张量并行（TP）、流水线并行（PP）、数据并行（DP）和专家并行（EP）切分的对象不同，对显存、通信和调度的影响也不同。
