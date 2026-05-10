import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel
import os

# Configuration (Ensure these match train.py)
BASE_MODEL_NAME = "Qwen/Qwen3.5-9B"
ADAPTER_DIR = "./lora-vlsi-copilot/final"
MERGED_OUTPUT_DIR = "./vlsi-copilot-merged"

def main():
    print(f"Loading base model: {BASE_MODEL_NAME}")
    # Load the base model with bfloat16 to match MI300X training precision
    base_model = AutoModelForCausalLM.from_pretrained(
        BASE_MODEL_NAME,
        torch_dtype=torch.bfloat16,
        device_map="cpu", # Load to CPU first to prevent VRAM OOM during merging
    )
    
    print("Loading tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(ADAPTER_DIR)

    print(f"Loading LoRA adapters from {ADAPTER_DIR}...")
    # Attach the trained adapters to the base model
    model = PeftModel.from_pretrained(base_model, ADAPTER_DIR)
    
    print("Merging adapters into base model weights...")
    # Merge and unload removes the LoRA layer wrappers, giving a standard HF model
    model = model.merge_and_unload()
    
    print(f"Saving merged model to {MERGED_OUTPUT_DIR}...")
    os.makedirs(MERGED_OUTPUT_DIR, exist_ok=True)
    model.save_pretrained(MERGED_OUTPUT_DIR, safe_serialization=True)
    tokenizer.save_pretrained(MERGED_OUTPUT_DIR)
    
    print("Merging Complete! The model in ./vlsi-copilot-merged is ready to be hosted via vLLM or Hugging Face Spaces.")

if __name__ == "__main__":
    main()
