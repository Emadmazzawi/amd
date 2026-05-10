import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import os

app = FastAPI()

MODEL_DIR = "./vlsi-copilot-merged"
print(f"Loading model {MODEL_DIR} onto GPU...")

tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_DIR, 
    device_map="auto", 
    torch_dtype=torch.bfloat16
)

class CompletionRequest(BaseModel):
    prompt: str
    max_tokens: int = 512
    temperature: float = 0.7

@app.post("/v1/completions")
def generate(req: CompletionRequest):
    inputs = tokenizer(req.prompt, return_tensors="pt").to("cuda")
    outputs = model.generate(
        **inputs, 
        max_new_tokens=req.max_tokens,
        temperature=req.temperature,
        do_sample=True,
        pad_token_id=tokenizer.eos_token_id
    )
    text = tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:], skip_special_tokens=True)
    return {
        "id": "cmpl-1",
        "object": "text_completion",
        "choices": [
            {"text": text, "index": 0, "logprobs": None, "finish_reason": "stop"}
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
