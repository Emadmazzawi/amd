import os
import torch
from datasets import load_dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from trl import SFTTrainer, SFTConfig

# Model Configuration
# Upgraded to Qwen 3.5 9B for bleeding edge logic synthesis
MODEL_NAME = "Qwen/Qwen3.5-9B"
DATASET_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../dataset/vlsi_dataset.jsonl")
OUTPUT_DIR = "./lora-vlsi-copilot"

def format_instruction(example):
    """
    Format the dataset into the ChatML or Instruction format expected by Llama 3.
    """
    prompt = f"<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nYou are an expert VLSI Verification Co-Pilot. Optimize the given Verilog code for synthesis, prevent latches, and fix testbench races.<|eot_id|><|start_header_id|>user<|end_header_id|>\n\nInstruction: {example['instruction']}\n\nCode:\n{example['input']}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n{example['output']}<|eot_id|>"
    return {"text": prompt}

def main():
    print("Loading Dataset...")
    dataset = load_dataset("json", data_files=DATASET_PATH, split="train")
    dataset = dataset.map(format_instruction)
    
    print("Loading Tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    tokenizer.pad_token = tokenizer.eos_token
    tokenizer.padding_side = "right"
    
    print("Loading Base Model (ROCm Optimized)...")
    # Load model. We rely on standard PyTorch + ROCm to handle the accelerator.
    # bitsandbytes supports ROCm in newer versions, allowing 4-bit quantization if needed.
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        device_map="auto",
        torch_dtype=torch.bfloat16 # Recommended for MI300X/AMD
    )
    
    print("Configuring LoRA...")
    peft_config = LoraConfig(
        r=16,
        lora_alpha=32,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM",
    )
    
    model = get_peft_model(model, peft_config)
    model.print_trainable_parameters()
    
    print("Setting up Trainer...")
    training_args = SFTConfig(
        output_dir=OUTPUT_DIR,
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        learning_rate=2e-4,
        lr_scheduler_type="cosine",
        save_strategy="epoch",
        logging_steps=5,
        num_train_epochs=3, # Since it's a small dataset, 3-5 epochs is ideal
        fp16=False,
        bf16=True, # Use bfloat16 for AMD hardware
        report_to="none",
        dataset_text_field="text",
        max_length=1024,
    )
    
    trainer = SFTTrainer(
        model=model,
        train_dataset=dataset,
        processing_class=tokenizer,
        args=training_args,
    )
    
    print("Starting Fine-Tuning...")
    trainer.train()
    
    print("Saving Model Adapters...")
    trainer.model.save_pretrained(f"{OUTPUT_DIR}/final")
    tokenizer.save_pretrained(f"{OUTPUT_DIR}/final")
    print("Training Complete! Adapters saved to", f"{OUTPUT_DIR}/final")

if __name__ == "__main__":
    main()
