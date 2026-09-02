---
template: home.html
page_type: home
hide:
  - navigation
  - toc
  - footer
---

<div class="by-home-content">
  <section class="home-about" aria-labelledby="about-title">
    <h1 id="about-title">柏源 Infra <span>| About</span></h1>
    <div class="home-about__body">
      <div class="home-mark"><img src="assets/branding/about-infra.svg" alt="由服务器与网络节点构成的抽象标志"></div>
      <div class="home-about__copy">
        <p>这里主要整理 AI Infra、HPC、GPU、高速网络、存储和大模型基础设施相关技术资料。</p>
        <p>也会记录实际项目中的架构设计、硬件选型、配置取舍、模型部署和工程实践。</p>
        <p class="home-tags">AI Infra · HPC · GPU · RDMA · Storage · LLM</p>
      </div>
    </div>
  </section>

  <section class="home-section" id="topics" aria-labelledby="topics-title">
    <h2 id="topics-title">技术方向 <span>| Topics</span></h2>
    <div class="home-topics">
      <a href="server/"><h3>服务器架构</h3><p>CPU · 内存 · PCIe · 供电 · GPU 服务器形态</p></a>
      <a href="gpu/"><h3>GPU 与互联</h3><p>PCIe · OAM · 显存 · NVLink · NVSwitch</p></a>
      <a href="network/"><h3>高速网络</h3><p>RDMA · InfiniBand · RoCE · Fat Tree</p></a>
      <a href="storage/"><h3>存储与数据</h3><p>并行存储 · 分布式存储 · NVMe</p></a>
      <a href="hpc/"><h3>高性能计算</h3><p>MPI · 调度 · NUMA · 并行计算</p></a>
      <a href="llm/"><h3>大模型基础设施</h3><p>vLLM · SGLang · TP · PP · DP · EP · KV Cache</p></a>
      <a href="project/"><h3>智算项目实践</h3><p>服务器选型 · 网络规划 · 机柜供电 · 部署实施</p></a>
    </div>
  </section>

  <section class="home-section home-latest" aria-labelledby="latest-title">
    <h2 id="latest-title">最近整理 <span>| Latest</span></h2>
    <div class="home-article-list" role="list">
      <!-- AUTO_LATEST -->
    </div>
  </section>
</div>
