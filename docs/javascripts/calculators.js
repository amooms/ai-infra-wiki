(() => {
  "use strict";

  const numberValue = (root, field, fallback) => {
    const value = Number.parseFloat(root.querySelector(`[data-field="${field}"]`)?.value);
    return Number.isFinite(value) && value > 0 ? value : fallback;
  };

  const setText = (root, result, value) => {
    const element = root.querySelector(`[data-result="${result}"]`);
    if (element) element.textContent = value;
  };

  const calculateLlm = (root) => {
    const mode = root.querySelector('[data-field="mode"]')?.value || "infer";
    const params = numberValue(root, "params", 7);
    const precision = numberValue(root, "precision", 2);
    const seqLen = numberValue(root, "seqLen", 4096);
    const batch = numberValue(root, "batch", 1);
    const gpuMem = numberValue(root, "gpuMem", 80);
    const weightMem = params * precision;
    let dynamicMem;
    let totalMem;

    if (mode === "infer") {
      const kvCache = (params * 0.06 * seqLen * batch) / 1024;
      dynamicMem = kvCache + 2;
      totalMem = (weightMem + dynamicMem) * 1.15;
    } else if (mode === "train") {
      const states = params * 16;
      const activationMem = seqLen * batch * 0.15 * Math.sqrt(params);
      dynamicMem = states - weightMem + activationMem;
      totalMem = (states + activationMem) * 1.2;
    } else {
      const states = weightMem + params * 0.05 * 16;
      const activationMem = seqLen * batch * 0.1;
      dynamicMem = states - weightMem + activationMem;
      totalMem = (states + activationMem) * 1.15;
    }

    const minimum = Math.max(1, Math.ceil(totalMem / (gpuMem * 0.9)));
    const recommended = minimum <= 1 ? 1 : minimum <= 2 ? 2 : minimum <= 4 ? 4 : Math.ceil(minimum / 8) * 8;
    let strategy;
    if (recommended === 1) strategy = "单卡独立运行，无需张量并行（TP=1，PP=1）。";
    else if (recommended <= 8) strategy = `建议设置张量并行 TP=${recommended}，优先使用单机 NVLink / NVSwitch 高速互联。`;
    else strategy = `建议机内 TP=8，跨机采用 PP=${recommended / 8}，或结合 ZeRO-3 / FSDP 进行分片。`;

    setText(root, "weight", `${weightMem.toFixed(1)} GB`);
    setText(root, "dynamic", `${dynamicMem.toFixed(1)} GB`);
    setText(root, "total", `${totalMem.toFixed(1)} GB`);
    setText(root, "gpuCount", `${recommended} 张 (${gpuMem}G)`);
    const strategyElement = root.querySelector('[data-result="strategy"]');
    if (strategyElement) strategyElement.innerHTML = `${strategy} <span class="calculator-badge">实战建议</span>`;
  };

  const calculateNetwork = (root) => {
    const nodes = numberValue(root, "nodes", 64);
    const nics = numberValue(root, "nics", 8);
    const switchPorts = numberValue(root, "switchPorts", 64);
    const ratio = numberValue(root, "ratio", 1);
    const totalComputePorts = Math.ceil(nodes * nics);
    const downPerLeaf = Math.max(1, Math.floor(switchPorts / (1 + 1 / ratio)));
    const upPerLeaf = switchPorts - downPerLeaf;
    const leafCount = Math.ceil(totalComputePorts / downPerLeaf);
    const totalUplinks = leafCount * upPerLeaf;
    const spineCount = Math.ceil(totalUplinks / switchPorts);
    const totalSwitches = leafCount + spineCount;
    const transceivers = totalComputePorts * 2 + totalUplinks * 2;
    const topology = ratio === 1
      ? `<strong>2 层 Fat-Tree（Spine-Leaf）无收敛拓扑</strong>：每台 Leaf 下行 ${downPerLeaf} 端口、上行 ${upPerLeaf} 端口，面向高带宽 AllReduce 通信。`
      : `<strong>${ratio}:1 收敛组网</strong>：每台 Leaf 下行 ${downPerLeaf} 端口、上行 ${upPerLeaf} 端口，适合以推理和零散训练为主的集群。`;

    setText(root, "downlinks", `${totalComputePorts} 端口`);
    setText(root, "leafCount", `${leafCount} 台`);
    setText(root, "spineCount", `${spineCount} 台`);
    setText(root, "totalSwitches", `${totalSwitches} 台`);
    setText(root, "transceivers", `约 ${transceivers} 只`);
    const topologyElement = root.querySelector('[data-result="topology"]');
    if (topologyElement) topologyElement.innerHTML = topology;
  };

  const initializeCalculators = () => {
    document.querySelectorAll('[data-calculator]').forEach((root) => {
      const calculate = root.dataset.calculator === "llm" ? calculateLlm : calculateNetwork;
      if (!root.dataset.calculatorBound) {
        root.dataset.calculatorBound = "true";
        root.addEventListener("input", () => calculate(root));
        root.addEventListener("change", (event) => {
          if (root.dataset.calculator === "llm" && event.target.matches('[data-field="preset"]')) {
            const preset = event.target.value;
            if (preset !== "custom") root.querySelector('[data-field="params"]').value = preset;
          }
          calculate(root);
        });
      }
      calculate(root);
    });
  };

  if (typeof document$ !== "undefined") document$.subscribe(initializeCalculators);
  else if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initializeCalculators, { once: true });
  else initializeCalculators();
})();
