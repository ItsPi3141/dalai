# Dalai

Run LLaMA and Alpaca on your computer.

<a href="https://github.com/cocktailpeanut/dalai" class='inverse btn'><i class="fa-brands fa-github"></i> GitHub</a>
<a href="https://twitter.com/cocktailpeanut" class='inverse btn'><i class="fa-brands fa-twitter"></i> Twitter</a>
<a href="https://discord.gg/XahBUrbVwz" class='inverse btn'><i class="fa-brands fa-discord"></i> Discord</a>

## Info

This is a fork of Dalai to add a ChatGPT-style UI to it.  
**Also supports Alpaca 30B, you will need to download it manually from [here](https://huggingface.co/Pi3141/alpaca-30B-ggml)**

Please consider giving this project a star if you like it. It would motivate me to work on the fork and improve it further.

---

## Requirements

### RAM requirements

- 7B: ~5.6 GB
- 13B: ~9 GB
- 30B: ~20 GB
- 65B: ~40 GB

### Disk Space Requirements

### Alpaca:

7B: 4.21GB (pre-quantized)
13B: 8.14GB (pre-quantized)

### LLaMA

> Note: after quantizing the model, you can delete the rest of the files and keep only the quantized model.
> 7B

- Full: The model takes up 31.17GB
- Quantized: 4.21GB

13B

- Full: The model takes up 60.21GB
- Quantized: 4.07GB \* 2 = 8.14GB

30B

- Full: The model takes up 150.48GB
- Quantized: 5.09GB \* 4 = 20.36GB

65B

- Full: The model takes up 432.64GB
- Quantized: 5.11GB \* 8 = 40.88GB

---

# Get started

## Mac

1. Install Homebrew

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. Install dependencies with Homebrew

```sh
brew install cmake
brew install pkg-config
brew install git
brew install yarn
```

3. Download Dalai-Pi

```sh
git clone https://github.com/ItsPi3141/dalai ~/dalai_pi
```

4. Install required Nodejs modules

```sh
cd ~/dalai_pi
yarn install
```

5. Download LLaMA or Alpaca models
   > Note: replace "llama" with "alpaca" if you want Alpaca. Change "7B" to the model size that you want. Alpaca only has 7B and 13B while LLaMA has 7B, 13B, 30B, and 65B.

```sh
npx dalai llama install 7B
```

6. Start Dalai-Pi web UI

```sh
npx dalai serve
```

After the web UI has opened, go to http://localhost:3000 and enjoy!

---

## Windows

1. Install Visual Studio by downloading and running this script
   [dalai-install-vs2019-only-win.bat](https://github.com/ItsPi3141/dalai/blob/main/setup-scripts/dalai-install-vs2019-only-win.bat)

---

> **IMPORTANT**  
> On Windows, make sure to run all commands in **cmd**.  
> DO NOT run in **powershell**. Powershell has unnecessarily strict permissions and makes the script fail silently.

2. Install Git from [here](https://git-scm.com/downloads)

   > Note: Make sure you check the add to PATH option

3. Download Dalai-Pi

```cmd
git clone https://github.com/ItsPi3141/dalai %USERPROFILE%\dalai_pi
```

4. Install required Nodejs modules

```cmd
cd %USERPROFILE%\dalai_pi
npm install yarn -g
yarn install
```

5. Download LLaMA or Alpaca models
   > Note: replace "llama" with "alpaca" if you want Alpaca. Change "7B" to the model size that you want. Alpaca only has 7B and 13B while LLaMA has 7B, 13B, 30B, and 65B.

```sh
npx dalai llama install 7B
```

6. Start Dalai-Pi web UI

```sh
.\webui-start.bat
```

---

## Linux

1. Install dependencies
   Ubuntu/Debian:

```sh
sudo apt update
sudo apt install build-essential python3-venv -y
```

Fedora/CentOS:

```sh
sudo dnf upgrade --refresh
sudo dnf install -y make automake gcc gcc-c++ kernel-devel python3-virtualenv
```

2. Install Python and Node.js
   Ubuntu/Debian:

```sh
cd ~
curl -sL https://deb.nodesource.com/setup_18.x -o /tmp/nodesource_setup.sh
sudo bash /tmp/nodesource_setup.sh
sudo apt install nodejs python3 python-is-python3 -y
```

Fedora/CentOS:

```sh
sudo dnf install -y curl
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs python python3-pip python-numpy
```

3. Download Dalai-Pi

```sh
git clone https://github.com/ItsPi3141/dalai ~/dalai_pi
```

4. Install required Nodejs modules

```sh
cd ~/dalai_pi
yarn install
```

5. Download LLaMA or Alpaca models
   > Note: replace "llama" with "alpaca" if you want Alpaca. Change "7B" to the model size that you want. Alpaca only has 7B and 13B while LLaMA has 7B, 13B, 30B, and 65B.

```sh
npx dalai llama install 7B
```

6. Start Dalai-Pi web UI

```sh
npx dalai serve
```

After the web UI has opened, go to http://localhost:3000 and enjoy!

---

## Staying up to date

Have questions or feedback? Follow the project through the following outlets:

<a href="https://github.com/cocktailpeanut/dalai" class='inverse btn'><i class="fa-brands fa-github"></i> GitHub</a>
<a href="https://twitter.com/cocktailpeanut" class='inverse btn'><i class="fa-brands fa-twitter"></i> Twitter</a>
<a href="https://discord.gg/XahBUrbVwz" class='inverse btn'><i class="fa-brands fa-discord"></i> Discord</a>

---
