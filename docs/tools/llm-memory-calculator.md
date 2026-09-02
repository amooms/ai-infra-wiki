---
title: 大模型显存与卡数估算器
icon: material/calculator
template: article.html
page_type: article
category: tools
tags:
  - 智算工具箱
  - GPU
  - 大模型工程
---

# 🧠 大模型训练 / 推理显存与卡数估算器

<div class="engineering-calculator" data-calculator="llm">
  <div class="calculator-grid">
    <div class="calculator-field">
      <label for="llm-mode">工作模式</label>
      <select id="llm-mode" data-field="mode">
        <option value="infer">模型推理 (Inference)</option>
        <option value="train">全量微调 / 预训练 (Full Training, AdamW)</option>
        <option value="lora">LoRA 浅层微调 (LoRA Training)</option>
      </select>
      <small>推理计算权重与 KV Cache；全量训练计算梯度和优化器状态。</small>
    </div>

    <div class="calculator-field">
      <label for="llm-preset">模型参数量 (Billion)</label>
      <select id="llm-preset" data-field="preset">
        <option value="custom">自定义参数</option>
        <option value="7">Qwen 2.5 / LLaMA 3 - 7B / 8B</option>
        <option value="14">Qwen 2.5 - 14B</option>
        <option value="32">Qwen 2.5 - 32B</option>
        <option value="70">LLaMA 3 - 70B</option>
        <option value="671">DeepSeek V3 / R1 (671B MoE)</option>
      </select>
      <input type="number" data-field="params" value="7" step="0.5" min="0.1" aria-label="模型参数量" />
    </div>

    <div class="calculator-field">
      <label for="llm-precision">权重与计算精度</label>
      <select id="llm-precision" data-field="precision">
        <option value="2">FP16 / BF16 (2 Bytes/参数)</option>
        <option value="1">FP8 (1 Byte/参数)</option>
        <option value="0.5">INT4 (AWQ/GPTQ, 0.5 Byte/参数)</option>
      </select>
    </div>

    <div class="calculator-field">
      <label>上下文长度 (Tokens) 与并发 Batch</label>
      <div class="calculator-inline-fields">
        <input type="number" data-field="seqLen" value="4096" step="512" min="1" placeholder="上下文长度" aria-label="上下文长度" />
        <input type="number" data-field="batch" value="4" step="1" min="1" placeholder="并发数" aria-label="并发 Batch" />
      </div>
      <small>例如：4096 Token 上下文，并发 Batch Size 为 4。</small>
    </div>

    <div class="calculator-field">
      <label for="llm-gpu-spec">目标 GPU 单卡显存规格</label>
      <select id="llm-gpu-spec" data-field="gpuMem">
        <option value="80">80 GB (A100 / H100 / H800 / 昇腾 910B)</option>
        <option value="96">96 GB (H20)</option>
        <option value="141">141 GB (H200)</option>
        <option value="192">192 GB (B200)</option>
        <option value="48">48 GB (A40 / L40S)</option>
        <option value="24">24 GB (RTX 4090 / 3090)</option>
      </select>
    </div>
  </div>

  <div class="calculator-results" aria-live="polite">
    <div class="calculator-result"><span>静态模型权重显存</span><strong data-result="weight">0 GB</strong></div>
    <div class="calculator-result"><span>动态显存 (KV/激活/状态)</span><strong data-result="dynamic">0 GB</strong></div>
    <div class="calculator-result"><span>预估总显存开销 (含冗余)</span><strong data-result="total">0 GB</strong></div>
    <div class="calculator-result"><span>建议最少 GPU 卡数</span><strong class="calculator-result--critical" data-result="gpuCount">0 张</strong></div>
    <div class="calculator-result calculator-result--wide"><span>推荐切分策略 (Parallelism Strategy)</span><p data-result="strategy">-</p></div>
  </div>
</div>

## 计算逻辑说明

1. **推理显存构成**：静态模型参数显存 + 动态 KV Cache 显存 + 激活开销缓冲区。
2. **训练显存构成**：FP16 模型参数 + FP16 梯度 + FP32 Master 权重与 AdamW 一阶/二阶动量状态。
3. **显存安全水位**：按单卡 90% 可用显存估算，并在总开销中增加冗余，降低 CUDA OOM 风险。

!!! warning "工程估算说明"
    结果用于容量规划初算。实际显存还会受模型结构、GQA/MQA、框架、并行策略、量化元数据和 CUDA Kernel 工作区影响，上线前请以目标模型实测为准。
