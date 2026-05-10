# AMD Developer Cloud - GPU Droplet Setup Guide

Use this guide when you are ready to come back and spin up your AMD MI300X instance for the hackathon.

## Step 1: Claim Your Credits
1. You have already filled out the request form. Wait for the approval email from the **AMD AI Developer Program**.
2. **CRITICAL:** Click the unique activation link inside that email. This is what actually deposits the $100 into your account.
3. Verify your credits by clicking the **Billing** tab on the left sidebar of the AMD Cloud dashboard.

## Step 2: Clear Billing Verification
* Even with $100 in credits, DigitalOcean (which powers the platform) requires a valid payment method on file to prevent bot/crypto abuse. 
* Click the **Billing (Action Needed)** tab and add a card/PayPal. You will **not** be charged as long as you stay within the $100 limit.

## Step 3: Create the GPU Droplet
1. Go to **GPU Droplets** -> **Create GPU Droplet**.
2. **Region:** Choose whatever is closest to you.
3. **Image (Quick Start Packages):** Select **PyTorch 2.10.0 (ROCm 7.2)**. 
   * *Why?* This comes with PyTorch and the AMD GPU drivers pre-installed. Do not choose the CPU JupyterLab ones.
4. **GPU Type:** Select a single GPU instance like **MI300X x1** or **MI210 x1** (around $1.99/hr). 
   * *WARNING:* Do not leave it on the default 8x GPU ($15.92/hr), or your hackathon credits will run out in 6 hours!
5. **Authentication:** Select **SSH Key**. 
   * Click "Add an SSH Key"
   * Paste the *entire* key starting with `ssh-ed25519`: 
     `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBgikAjkZUET1ztHk1iIF5R96mamtSPdjywWq5lSORhQ emadm@aabbcc`
   * Give it a name and save.
6. Click the blue **Create Droplet** button.

## Step 4: Connect to Your Server
Once the server is created, it will display a public IP address.
1. Open your Windows PowerShell or terminal.
2. Type: `ssh root@<YOUR_DROPLET_IP>`
3. Type `yes` to accept the fingerprint.

You are now ready to upload your project files and run the training script!
