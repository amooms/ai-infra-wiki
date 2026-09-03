当前工作目录是本项目根目录。



我要开发一个面向 AI Infra / 智算基础设施的 Web 工具：



\# AI Infra Simulator



目标是：



用户选择一个真实大模型，再选择 GPU、GPU 数量、部署精度、并行方式、上下文长度、并发等参数，系统根据模型参数、硬件参数、理论计算模型以及后续 Benchmark 数据，对模型部署可行性、显存需求、KV Cache、理论性能、瓶颈、功耗和推荐部署方式进行分析。



第一版必须能够直接部署到 GitHub Pages。



请你作为资深 AI Infra 工程师 + 全栈开发工程师，直接在当前目录完成项目初始化、代码实现、文档、GitHub Actions 和 GitHub Pages 部署配置。



不要只给方案，要实际创建和修改文件。



\---



\# 一、技术架构



第一版采用纯静态 Web 架构：



\* React

\* Vite

\* TypeScript

\* ECharts

\* GitHub Pages

\* GitHub Actions

\* JSON 数据文件

\* 浏览器本地计算



第一版不使用：



\* Python Web 后端

\* FastAPI

\* Node.js 后端服务

\* PostgreSQL

\* Redis

\* Streamlit

\* 任何必须长期运行的服务器程序



所有用户侧计算应尽量在浏览器中完成。



后续应预留接入后端 API、Benchmark 数据库和 AI 代理模型的能力，但第一版不要过度设计。



\---



\# 二、核心原则



本项目第一优先级是：



技术准确。



不得为了让页面看起来完整而编造：



\* GPU 参数

\* 模型参数

\* 模型精度

\* 模型架构

\* Context Length

\* 显存带宽

\* GPU 算力

\* 功耗

\* GPU 互联带宽

\* Benchmark 性能

\* TTFT

\* TPOT

\* tokens/s

\* 并发性能



无法确认的数据必须：



\* 标记 unknown；

\* 或不显示；

\* 或明确标记为“估算”。



严禁把估算数据包装成真实 Benchmark 数据。



理论值、估算值、Benchmark 实测值必须在数据结构和 UI 中严格区分。



\---



\# 三、模型数据不能写死



不要在代码中只写：



\* Qwen 32B

\* Qwen 72B

\* Llama 70B

\* DeepSeek 671B



这类固定模型。



模型数据需要建立自动同步机制。



主要上游：



1\. ModelScope / 魔搭社区

2\. Hugging Face



要求设计：



scripts/



用于同步模型社区数据。



至少预留：



scripts/

sync-modelscope.\*

sync-huggingface.\*

normalize-models.\*

build-model-index.\*



GitHub Actions 定期执行同步任务。



由于 GitHub Pages 本身不能运行 Python/Node 后台任务，因此：



模型同步通过 GitHub Actions 执行；



同步完成后生成静态 JSON 数据；



GitHub Pages 只负责读取生成后的数据。



\---



\# 四、模型数据库设计



模型和量化版本必须分开。



不要简单认为：



“一个 Repository = 一个模型”。



设计以下关系：



Model Family

↓

Base Model

↓

Checkpoint / Variant

↓

Precision / Quantization



例如：



某 32B 模型



├─ BF16 Official

├─ FP8 Official

├─ INT8

├─ AWQ INT4

├─ GPTQ INT4

└─ GGUF Q4\_K\_M



模型基础信息建议至少包含：



model\_id

model\_family

display\_name

organization

source

source\_repo

official

architecture

model\_type



parameters\_total

parameters\_active



num\_layers

hidden\_size

intermediate\_size



attention\_heads

kv\_heads

head\_dim



context\_length



moe

num\_experts

num\_experts\_per\_token



native\_dtype



last\_modified



支持：



Dense

MoE



MoE 模型必须区分：



parameters\_total



和：



parameters\_active



不能把 active parameters 当作模型总参数。



\---



\# 五、精度设计



禁止使用一个简单字段：



precision = FP8



应至少区分：



weight\_dtype

compute\_dtype

kv\_cache\_dtype

quantization\_method



例如：



weight\_dtype = INT4

compute\_dtype = FP16

kv\_cache\_dtype = FP8

quantization\_method = AWQ



支持逐步扩展：



FP32

FP16

BF16

FP8

INT8

INT4

AWQ

GPTQ

GGUF



但如果无法确认实际精度，不得猜测。



\---



\# 六、模型参数获取优先级



模型数据解析优先级：



1\. 官方 config.json / 配置文件

2\. safetensors metadata

3\. 官方 Model Card

4\. Repository metadata / tags

5\. 模型名称解析



模型名称解析只能作为最后兜底方式。



例如：



XXX-235B-A22B



不能仅根据名称直接认定。



如果解析结果无法确认，应标记：



confidence: low



同时需要保存：



data\_source

confidence

last\_verified



\---



\# 七、模型筛选



不要默认把 ModelScope / Hugging Face 所有社区模型全部展示。



否则会出现大量：



\* LoRA

\* merge

\* roleplay

\* 微调版本

\* 重复量化

\* 个人测试模型



UI 默认展示：



主流模型。



筛选优先：



\* 官方 Organization

\* 主流基础模型

\* Instruct

\* Reasoning

\* 官方量化

\* 配置数据完整

\* 可识别参数规模

\* 可识别架构



同时提供：



“显示全部社区模型”



高级选项。



模型搜索必须支持：



\* 模型名称

\* Organization

\* 参数量

\* Dense / MoE

\* 精度

\* Quantization

\* Context Length



\---



\# 八、GPU 数据库



建立：



data/gpus.json



以及合理的数据 Schema。



GPU 至少考虑：



vendor

model

architecture



memory\_gb

memory\_type

memory\_bandwidth\_tb\_s



fp32\_tflops

fp16\_tflops

bf16\_tflops

fp8\_tflops

int8\_tops



tdp\_w



pcie\_generation

pcie\_lanes



form\_factor



interconnect\_type

interconnect\_bandwidth



source

verified

last\_verified



不要要求所有 GPU 字段都有值。



不知道的数据允许 null。



不得为了字段完整而编造。



GPU 数据库设计必须兼容：



\* NVIDIA

\* AMD

\* Intel

\* 华为昇腾

\* 海光 DCU

\* 摩尔线程

\* 沐曦

\* 其他国产 GPU / AI 加速卡



不要把核心逻辑写死为 CUDA。



\---



\# 九、第一版仿真能力



第一版主要做：



“模型部署可行性 + 理论分析”



不要第一版就宣称能精确预测实际 tokens/s。



首先实现以下能力。



\## 1. 模型权重显存估算



根据：



parameters\_total

weight\_dtype

quantization



估算模型权重占用。



区分：



理论权重大小



和：



实际部署显存估算。



必须明确显示：



“实际部署还存在框架开销、量化 metadata、workspace、activation 等额外占用。”



\---



\## 2. KV Cache 估算



根据真实模型结构参数计算 KV Cache。



至少考虑：



num\_layers

kv\_heads

head\_dim

context\_length

concurrency

kv\_cache\_dtype



不要简单用：



参数量 × 某个固定比例



来估算 KV Cache。



如果缺少关键模型结构参数，应明确提示：



无法精确计算 KV Cache。



\---



\## 3. 总显存需求



至少考虑：



模型权重

KV Cache

Runtime reserve

Framework overhead



第一版可以提供：



Conservative

Balanced

Aggressive



三种显存预留策略。



但计算逻辑必须清晰。



\---



\## 4. GPU 数量判断



根据：



单卡显存

GPU 数量

模型权重

KV Cache

预留空间



判断：



是否能够部署。



输出：



Can Run



以及：



显存余量。



\---



\## 5. TP / DP 基础建议



根据：



模型能否单卡放下

单机 GPU 数量

并发

模型大小



提供基础建议。



例如：



如果模型能够在 4 张卡内运行，而服务器有 8 张 GPU，并发需求较高：



可以提示：



TP4 + DP2



可能值得测试。



但不得直接宣称一定比 TP8 快。



所有这种内容应表达为：



建议测试 / 候选配置。



\---



\# 十、理论瓶颈模型



建立基础 Roofline / Bottleneck 分析思路。



考虑：



Compute

HBM / VRAM Memory Bandwidth

GPU Interconnect

PCIe

Network

KV Cache



输出：



Compute Bound

Memory Bound

Communication Bound

KV Cache Bound



第一版允许是粗粒度判断。



但必须把：



理论模型



和：



Benchmark 预测



区分开。



\---



\# 十一、多机架构预留



第一版不要求完成完整分布式网络仿真。



但数据模型和代码结构必须预留：



TP

DP

PP

EP



以及：



PCIe

NVLink / NVSwitch

RoCE

InfiniBand

Ethernet



未来需要考虑：



AllReduce

AllGather

ReduceScatter

All-to-All

P2P



但现在不要为了“未来扩展”写大量没有使用的复杂代码。



保持模块化即可。



\---



\# 十二、Benchmark 数据体系



预留：



data/benchmarks/



Benchmark 数据结构至少包含：



model

model\_variant

gpu

gpu\_count

node\_count



framework

framework\_version



tp

dp

pp

ep



input\_tokens

output\_tokens

context\_length

concurrency



ttft\_ms

tpot\_ms

itl\_ms



output\_tokens\_per\_second

total\_tokens\_per\_second



gpu\_utilization

memory\_utilization

power\_w



benchmark\_source

benchmark\_date

verified



Benchmark 数据必须严格区分：



actual



和：



estimated



任何真实 Benchmark 数据必须能够追溯来源。



没有真实 Benchmark 时：



UI 不得显示一个假装精确的：



35.27 tok/s



可以显示：



暂无实测 Benchmark



或者：



理论估计区间。



\---



\# 十三、未来 AI 代理模型



第一版暂时不要训练模型。



但架构预留：



surrogate-model/



未来可能使用：



XGBoost

LightGBM

ONNX



实现：



硬件配置

\+

模型参数

\+

部署参数



↓



TTFT

TPOT

Throughput

Power



预测。



AI 预测必须未来能够输出：



预测值

置信区间

数据覆盖度

置信等级



例如：



预计 Decode：



28～34 tokens/s



Confidence：



Medium



而不是输出虚假的精确数字。



\---



\# 十四、UI 设计



整体风格：



专业

简洁

偏工程软件

不要做成 AI Chat 页面

不要大量渐变

不要赛博朋克

不要玻璃拟态堆叠

不要深色霓虹风

不要“AI味”过重



以：



技术工具

CAE

硬件配置器

工程分析软件



的感觉为主。



桌面端优先，同时兼容手机和平板。



\---



\# 十五、主页面布局



页面顶部：



AI Infra Simulator



副标题：



Model × GPU × Memory × Interconnect × Parallelism



主区域采用三栏或合理响应式布局。



左侧：



模型配置



例如：



ModelSource



Model Family



Model



Checkpoint



Weight Precision



KV Cache Precision



Context Length



Input Tokens



Output Tokens



Concurrency



中间：



硬件配置



GPU Vendor



GPU Model



GPU Count



Node Count



GPU Memory



Interconnect



Network



TP



DP



PP



EP



右侧：



Simulation Result



包括：



部署可行性



模型权重显存



KV Cache



Runtime Reserve



总显存需求



总 GPU 显存



显存利用率



GPU 数量



主要瓶颈



风险提示



建议部署方式



\---



\# 十六、结果显示



例如：



Deployment



✓ Can Run



Weight Memory

67 GB



KV Cache

182 GB



Runtime Reserve

80 GB



Required GPU Memory

329 GB



Available GPU Memory

768 GB



Memory Utilization

43%



主要瓶颈：



HBM Memory Bandwidth



建议：



当前配置存在较大显存余量。



如果目标以高并发推理为主，可考虑评估：



TP4 + DP2



而不是直接默认：



TP8



但是必须标注：



该建议需要真实 Benchmark 验证。



\---



\# 十七、配置对比



第一版必须支持：



方案 A



和：



方案 B



对比。



例如：



A：



8 × GPU A



B：



8 × GPU B



比较：



GPU 数量

总显存

显存带宽

理论算力

模型占用

KV Cache

显存余量

功耗

互联

理论瓶颈



未来再扩展：



成本

TTFT

TPS

Benchmark



\---



\# 十八、模型详情页



点击模型可以查看：



模型名称



Organization



Source



Base / Instruct / Reasoning



Dense / MoE



Total Parameters



Active Parameters



Layers



Hidden Size



Attention Heads



KV Heads



Context Length



Available Precision / Quantization



Last Updated



Source Repository



数据可信度。



\---



\# 十九、最新模型



首页或者模型选择区域增加：



Recently Updated Models



展示最近同步到的主流模型。



包括：



模型名

参数量

Dense/MoE

精度

Organization

更新时间



这部分由自动同步的数据生成。



\---



\# 二十、GitHub Actions



实现至少两个 Workflow。



\## Workflow 1



部署 GitHub Pages。



要求：



npm install

npm build

deploy GitHub Pages



必须正确处理：



GitHub Pages 子目录 base path。



例如：



https://username.github.io/ai-infra-simulator/



静态资源不能出现 404。



\---



\## Workflow 2



Sync Models



定期执行。



例如每天一次。



流程：



Fetch ModelScope



↓



Fetch Hugging Face



↓



Normalize



↓



Deduplicate



↓



Validate



↓



Generate JSON



↓



仅当数据发生变化时 commit。



如果需要 Token：



必须通过 GitHub Secrets。



不得把 Token 写入代码。



\---



\# 二十一、模型去重



ModelScope 和 Hugging Face 很可能存在同一个模型。



需要设计去重策略。



优先依据：



organization

model family

model size

architecture

checkpoint

quantization



不能单纯按 Repository 名称去重。



同时保留：



sources: \[]



例如：



ModelScope

HuggingFace



同一个模型可以有多个来源。



\---



\# 二十二、数据校验



为模型和 GPU 数据增加 Schema Validation。



例如使用：



Zod



或者合理的 TypeScript Schema。



要求：



脏数据不能导致整个网页崩溃。



缺字段：



允许显示 N/A。



\---



\# 二十三、项目目录



请规划清晰项目结构。



例如：



src/

components/

pages/

features/

models/

hardware/

simulator/

comparison/

engine/

memory/

kv-cache/

roofline/

parallelism/

data/

types/

utils/



data/

models/

gpus/

benchmarks/



scripts/



.github/

workflows/



docs/



不要全部写在：



App.tsx



一个文件中。



\---



\# 二十四、说明文档



创建：



README.md



ARCHITECTURE.md



DATA\_SOURCES.md



SIMULATION\_MODEL.md



ROADMAP.md



其中：



README



介绍：



项目是什么

如何本地运行

如何部署 GitHub Pages



ARCHITECTURE



介绍：



整体架构



DATA\_SOURCES



明确：



模型数据

GPU 数据

Benchmark 数据



从哪里来。



SIMULATION\_MODEL



必须详细解释：



哪些数据是：



真实数据



哪些是：



理论计算



哪些是：



估算



哪些是：



未来 AI 预测。



ROADMAP



按照：



V0.1

V0.2

V0.3

V1.0



规划。



\---



\# 二十五、第一版范围控制



第一版最重要的是：



模型数据准确

GPU 数据准确

显存计算正确

KV Cache 计算正确

数据结构合理

GitHub Pages 正常部署

页面可以正常使用



不要为了“功能丰富”加入：



聊天机器人

RAG

账号系统

支付

用户注册

复杂后台管理

大模型 API

无意义动画



\---



\# 二十六、测试



至少为以下核心函数添加测试：



模型权重显存计算



KV Cache 计算



总显存计算



GPU 数量判断



dtype 字节数计算



Dense / MoE 参数处理



异常数据处理



必须考虑：



缺少 kv\_heads

缺少 head\_dim

未知 dtype

MoE

INT4

FP8

BF16



\---



\# 二十七、示例数据



为了方便开发，可以加入少量经过明确标记的示例模型/GPU。



但必须注明：



sample / seed data



不要声称这些就是当前完整模型数据库。



自动同步完成后再由真实数据替换。



不得为了 UI 展示效果编造 Benchmark。



\---



\# 二十八、开发执行要求



现在直接开始执行。



顺序：



1\. 检查当前目录。

2\. 如果已有项目，先理解现有结构，不要破坏已有内容。

3\. 创建或完善项目。

4\. 建立 TypeScript 数据 Schema。

5\. 实现核心计算引擎。

6\. 实现模型/GPU数据加载。

7\. 实现 Simulator UI。

8\. 实现配置对比。

9\. 实现 Model Details。

10\. 实现 GitHub Pages。

11\. 实现模型同步 Workflow。

12\. 编写测试。

13\. 执行 npm test。

14\. 执行 npm run build。

15\. 修复所有错误。

16\. 检查 GitHub Pages base path。

17\. 更新 README。



不要在中途因为某个 API 暂时无法访问就停止整个项目。



如果 ModelScope / Hugging Face 同步部分暂时无法在线验证：



先完成：



接口抽象

Schema

同步脚本

错误处理

缓存机制

Workflow



并在文档中明确需要实际环境验证的部分。



\---



\# 二十九、最终验收标准



完成后必须满足：



\* npm install 正常

\* npm run dev 正常

\* npm test 正常

\* npm run build 正常

\* GitHub Pages 可以部署

\* 页面刷新不会 404

\* 模型列表可以搜索

\* 模型支持 Dense / MoE

\* 模型支持多精度 / 多量化 Variant

\* 能计算权重显存

\* 能计算 KV Cache

\* 能判断 GPU 显存是否足够

\* 能进行 A/B 配置对比

\* 不伪造 Benchmark

\* 不伪造模型数据

\* 数据来源和计算方法可追溯



完成后输出：



1\. 实际创建/修改的文件

2\. 当前已经实现的功能

3\. 尚未完成或需要真实环境验证的部分

4\. 本地运行命令

5\. GitHub Pages 部署方式

6\. 下一阶段最值得实现的 5 项功能



不要只给我代码片段。



请实际修改当前项目。



