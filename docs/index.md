---
template: home.html
page_type: home
title: 柏源 Infra · AI Infrastructure Wiki
hide:
  - navigation
  - toc
  - footer
  - reading-time
---

<section class="by-portal-hero" aria-labelledby="portal-title">
  <p class="by-portal-eyebrow">AI INFRASTRUCTURE · ENGINEERING KNOWLEDGE BASE</p>
  <h1 id="portal-title">柏源 Infra · AI Infrastructure Wiki</h1>
  <p class="by-portal-lead">面向智算中心、异构集群、RoCEv2 / InfiniBand 高速网络与大模型工程化的架构设计、配置取舍和实战知识库。</p>
  <div class="by-portal-actions">
    <a href="articles/" class="md-button md-button--primary">浏览文章库</a>
    <a href="network/" class="md-button">高速网络专题</a>
  </div>
</section>

## 知识矩阵

<div class="grid cards" markdown>

-   **L0 / L1 算力硬件与供电**

    GPU 服务器形态、CPU / NUMA、PCIe、OAM、GPU 互联、整机功率预算与冗余供电。

    [→ 物理与供电](server/index.md) · [→ 算力与 GPU](gpu/index.md)

-   **L2 高速智算网络**

    RDMA、RoCEv2、InfiniBand、无损以太网、拥塞控制与 Spine-Leaf 集群拓扑。

    [→ 进入网络专题](network/index.md)

-   **L3 高性能并行存储**

    并行文件系统、分布式存储、元数据路径、聚合带宽与 AI 数据流水线。

    [→ 进入存储专题](storage/index.md)

-   **L4 / L5 调度运维与大模型工程**

    MPI、集群调度、故障定位，以及 vLLM、SGLang、并行策略与 KV Cache。

    [→ 调度运维](hpc/index.md) · [→ 大模型工程](llm/index.md)

-   **AI Infra Simulator**

    模型 × GPU × 显存 × KV Cache × 并行策略部署分析工具。

    [→ 打开 Simulator](https://amooms.github.io/ai-infra-wiki/tools/simulator/)

</div>

## 推荐阅读路径

=== "新工程师入门"

    1. 从 [服务器与供电](server/index.md) 理解智算节点的物理边界。
    2. 阅读 [GPU 与互联](gpu/index.md) 掌握 PCIe、OAM、NVLink 与 NVSwitch。
    3. 进入 [高速智算网络](network/index.md) 建立 RDMA、RoCEv2 与 IB 的整体认知。

=== "集群排障速查 (Troubleshooting)"

    1. 检查节点功率、温度、PCIe 链路与 GPU 健康状态。
    2. 沿 [网络专题](network/index.md) 排查队列、拥塞、丢包、ECN / PFC 与 RDMA 路径。
    3. 结合 [存储](storage/index.md) 和 [调度运维](hpc/index.md) 判断瓶颈是否来自数据或资源分配。

=== "智算项目建设与落地"

    按 [服务器选型](project/server-selection.md)、[网络设计](project/network-design.md)、[供电与机柜](project/power-and-rack.md) 和 [部署实施](project/deployment.md) 的顺序推进方案设计与交付验收。

## 最近整理

<div class="home-article-list" role="list">
  <!-- AUTO_LATEST -->
</div>
