import streamlit as st
import requests
import json

# Set Page Config
st.set_page_config(
    page_title="VLSI Verification Co-Pilot",
    page_icon="🚀",
    layout="wide"
)

# Custom Styling
st.markdown("""
    <style>
    .main {
        background-color: #0e1117;
    }
    .stTextArea textarea {
        background-color: #1e1e1e;
        color: #dcdcdc;
        font-family: 'Courier New', Courier, monospace;
    }
    .stMarkdown h1, h2, h3 {
        color: #00d4ff;
    }
    </style>
    """, unsafe_allow_html=True)

# App Title
st.title("🚀 VLSI Verification Co-Pilot")
st.subheader("Fine-tuned on AMD MI300X for Hardware Synthesis Optimization")

st.divider()

# Sidebar for Configuration
with st.sidebar:
    st.header("⚙️ Configuration")
    api_url = st.text_input("vLLM Endpoint URL", value="http://localhost:8000/v1/completions")
    temperature = st.slider("Temperature", 0.0, 1.0, 0.2)
    max_tokens = st.number_input("Max Output Tokens", 512, 4096, 1024)
    
    st.info("Ensure your vLLM server is running on the AMD instance before connecting.")

# Main Layout
col1, col2 = st.columns(2)

with col1:
    st.header("📝 Input Verilog")
    user_code = st.text_area("Paste your Verilog module here...", height=500, placeholder="module my_design (...);")
    
    optimize_btn = st.button("✨ Optimize & Verify", use_container_width=True)

with col2:
    st.header("⚡ Optimized Output")
    if optimize_btn and user_code:
        with st.spinner("Analyzing synthesis risks and optimizing logic..."):
            try:
                # Prepare the prompt format used in training (Qwen tokens)
                prompt = f"<|im_start|>system\nYou are an expert VLSI Verification Co-Pilot. Optimize the given Verilog code for synthesis, prevent latches, and fix testbench races.<|im_end|>\n<|im_start|>user\nInstruction: Optimize the following Verilog module for hardware synthesis.\n\nCode:\n{user_code}<|im_end|>\n<|im_start|>assistant\n"
                
                payload = {
                    "prompt": prompt,
                    "temperature": temperature,
                    "max_tokens": max_tokens
                }
                
                response = requests.post(api_url, json=payload)
                if response.status_code == 200:
                    result = response.json()['choices'][0]['text']
                    st.markdown(result)
                else:
                    st.error(f"Server Error: {response.text}")
                
            except Exception as e:
                st.error(f"Error connecting to vLLM: {e}")
    else:
        st.info("Input Verilog code and click 'Optimize' to see results.")

st.divider()
st.caption("Built for the AMD Developer Hackathon 2026 | Powered by ROCm & MI300X")
