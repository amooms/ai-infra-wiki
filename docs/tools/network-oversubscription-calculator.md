---
title: 智算网络收敛比与拓扑估算器
icon: material/lan-connect
template: article.html
page_type: article
category: tools
tags:
  - 智算工具箱
  - 智算网络
  - Spine-Leaf
---

# 🌐 智算网络收敛比与拓扑估算器

<div class="engineering-calculator" data-calculator="network">
  <div class="calculator-grid">
    <div class="calculator-field">
      <label for="net-node-count">GPU 计算节点数 (服务器总台数)</label>
      <input id="net-node-count" type="number" data-field="nodes" value="64" min="1" step="8" />
      <small>例如：64 台标准 8 卡 GPU 服务器。</small>
    </div>

    <div class="calculator-field">
      <label for="net-nics">单台服务器计算网卡数</label>
      <select id="net-nics" data-field="nics">
        <option value="8">8 张计算网卡 (标准 1:1 卡网配比)</option>
        <option value="4">4 张计算网卡</option>
        <option value="2">2 张计算网卡</option>
      </select>
    </div>

    <div class="calculator-field">
      <label for="net-switch-ports">交换机单机端口规格</label>
      <select id="net-switch-ports" data-field="switchPorts">
        <option value="64">64 端口 (常见 64×400G / 64×800G)</option>
        <option value="32">32 端口 (32×400G / 32×800G)</option>
        <option value="128">128 端口 (高密机箱式模块)</option>
      </select>
    </div>

    <div class="calculator-field">
      <label for="net-ratio">目标网络收敛比 (Convergence Ratio)</label>
      <select id="net-ratio" data-field="ratio">
        <option value="1">1 : 1 (无收敛，大模型训练常用)</option>
        <option value="1.5">1.5 : 1 (轻度收敛)</option>
        <option value="2">2 : 1 (经济型推理集群)</option>
        <option value="3">3 : 1 (高收敛比)</option>
      </select>
    </div>
  </div>

  <div class="calculator-results" aria-live="polite">
    <div class="calculator-result"><span>集群计算总端口数 (下行)</span><strong data-result="downlinks">0 个</strong></div>
    <div class="calculator-result"><span>Leaf (ToR) 交换机需求量</span><strong data-result="leafCount">0 台</strong></div>
    <div class="calculator-result"><span>Spine (骨干) 交换机需求量</span><strong data-result="spineCount">0 台</strong></div>
    <div class="calculator-result"><span>交换机总台数</span><strong class="calculator-result--critical" data-result="totalSwitches">0 台</strong></div>
    <div class="calculator-result"><span>光模块 / AOC 端点预估</span><strong data-result="transceivers">0 只</strong></div>
    <div class="calculator-result calculator-result--wide"><span>组网方案与拓扑形态</span><p data-result="topology">-</p></div>
  </div>
</div>

## 核心公式

- **收敛比** = 下行总带宽（ToR 连接计算节点）÷ 上行总带宽（ToR 连接 Spine）。
- **训练网络建议**：大规模同步训练通常优先采用 **1:1 无收敛**。采用 2:1 等收敛设计时，应结合通信模型、业务并发、ECMP、拥塞控制和故障域进行仿真或压测。

!!! warning "工程估算说明"
    结果按端口数量进行初步容量估算，未包含设备冗余、双平面组网、端口 Breakout、管理网络、备件和实际布线约束。正式设计应结合交换机规格与故障域复核。
