Here is your master, end-to-end execution plan for building the VLSI Verification Co-Pilot. Since the hackathon submissions close on May 10, 2026, you have time to prep your dataset now and execute the fine-tuning as soon as the compute instances open up.

Because you write your code yourself and don't have to wait on team dependencies, you can move extremely fast through these phases.

Phase 1: Environment & Infrastructure Setup
The goal here is to establish a frictionless pipeline from your local machine to AMD's hardware.

Claim Your Compute: Sign up for the AMD AI Developer Program immediately to secure your $100 in AMD Developer Cloud credits.

Establish the Pipeline: From your Windows PC, open your Ubuntu environment. You will use this terminal to SSH directly into the AMD Instinct MI300X GPU instance once you spin it up in the cloud.

Install ROCm Dependencies: Once inside the AMD instance, set up a PyTorch environment optimized for ROCm (AMD’s equivalent of CUDA). You will heavily rely on Hugging Face Optimum-AMD and vLLM for training and serving.

Phase 2: The Domain-Specific Dataset (The Secret Sauce)
An LLM is only as good as its training data. Generic models fail at hardware synthesis because they lack niche ASIC verification knowledge. You will build a highly specialized JSONL dataset containing instruction-response pairs.

Format: Use the standard Alpaca or ChatML format (System, User, Assistant).

Dataset Composition (50-100 high-quality examples):

The Mux Logic Examples: Create multiple prompts where the user inputs a Verilog module containing an inefficient repeat loop. Train the assistant to output exactly how this maps at the gate level (e.g., explaining that it essentially synthesizes down to two 2:1 muxes connected to a 4:1 mux) and provide the optimized, synthesis-friendly Verilog alternative.

Linter Escapes: Feed it code that passes standard syntax checks but would fail or create massive timing bottlenecks in Synopsys Fusion Compiler.

VCS Testbench Errors: Include examples of stimulus setups that won't trigger the right edge cases in a VCS simulation, alongside the corrected testbenches.

Open Source the Dataset: If your examples don't contain proprietary company code, publish this dataset to Hugging Face. Open-sourcing niche datasets is highly respected and boosts your "Build in Public" credibility.

Phase 3: Fine-Tuning the Model
You will perform Parameter-Efficient Fine-Tuning (PEFT) using LoRA (Low-Rank Adaptation). This trains the model incredibly fast while retaining its base intelligence.

Select a Base Model: Go to Hugging Face and choose a strong open-weights model in the 7B-8B parameter range (like Llama-3-8B-Instruct or Mistral-v0.3).

The Training Script: Write a Python script using the trl (Transformer Reinforcement Learning) and peft libraries.

Execute on MI300X: Run the training job on your AMD instance. With the massive VRAM of the MI300X and a dataset of ~100 examples, this fine-tuning run will likely take less than an hour.

Phase 4: Application Wrapper (The UI)
Hackathon judges need to interact with your model easily. Skip complex front-end frameworks and use Python to build a clean web app.

Streamlit Interface: Write a app.py script using Streamlit.

The Layout: * Left column: A text area where an engineer pastes raw Verilog code.

Right column: The AI’s output, highlighting identified synthesis risks, gate-level schematic breakdowns, and optimized code blocks.

Inference Backend: Connect the Streamlit app to your fine-tuned model's inference endpoint (using vLLM for fast token generation).

Phase 5: Hugging Face Deployment & Submission Prep
To qualify for the Hugging Face category prize, the project must live in their ecosystem.

Merge Weights: Merge your fine-tuned LoRA adapters with the base model weights.

Create a HF Space: Join the Lablab.ai AMD Hackathon Hugging Face Organization. Spin up a new "Gradio" or "Streamlit" Space under that org.

Push the App: Upload your app.py, your merged model weights (or load them dynamically via the Hugging Face Hub), and your requirements.txt.

Architecture Diagram: For your final slide presentation, create a simple diagram showing your pipeline: `Raw Verilog -> Streamlit UI -> vLLM Inference on AMD MI300X -> Optimized Output`. This makes your deep tech project easy for judges to digest.

Phase 6: The "Build in Public" Multiplier
Lablab.ai has a dedicated prize pool for the "Ship It + Build in Public" track. You can easily knock this out while waiting for your model to train.

Update 1 (Start of Hackathon): Post a screenshot on X/LinkedIn of your Ubuntu terminal SSH'd into the AMD instance, mentioning how you are leveraging the MI300X to solve ASIC verification bottlenecks. Tag @lablab, @AIatAMD, etc.

Update 2 (Mid-Hackathon): Post a snippet of your dataset—specifically the hardware routing logic optimizations—explaining why base models fail at this and why domain-specific fine-tuning on ROCm is necessary.

The Video Demo ("Before & After"): Record a crisp 2-minute video. Crucially, explicitly show the *base* model failing to optimize a tricky Verilog block, and then show your *fine-tuned* model nailing it. This concretely proves the value of your fine-tuning on the AMD hardware. Submit this with your final project link.