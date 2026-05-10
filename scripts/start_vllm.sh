#!/bin/bash

# This script starts the vLLM OpenAI-compatible server using your merged fine-tuned model.
# Ensure you have run scripts/merge_weights.py first!

MODEL_DIR="./vlsi-copilot-merged"

echo "Starting vLLM server with model: $MODEL_DIR on AMD MI300X"

# We are bypassing vLLM due to ROCm 6.0 C++ extension compatibility issues
# and instead running a native Transformers FastAPI endpoint that serves 
# the exact same /v1/completions API format.
python3 scripts/serve_openai.py
