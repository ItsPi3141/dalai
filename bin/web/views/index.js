var gen = 0;
const config = {
  seed: -1,
  threads: 4,
  n_predict: 200,
  model: "7B",
  top_k: 40,
  top_p: 0.95,
  temp: 0.1,
  repeat_last_n: 64,
  repeat_penalty: 1,
  debug: false,
  // html: true,
  models: [],
};
const socket = io();
const form = document.getElementById("form");
const stopButton = document.getElementById("stop");
const input = document.getElementById("input");
const model = document.getElementById("model");
const messages = document.getElementById("messages");

input.addEventListener("keydown", () => {
  setTimeout(() => {
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
  });
});
input.addEventListener("keyup", () => {
  setTimeout(() => {
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
  });
});

const renderHeader = (config) => {
  const fields = [
    //{ key: "debug", type: "checkbox" },
    //"threads",
    "n_predict",
    "repeat_last_n",
    "repeat_penalty",
    "top_k",
    "top_p",
    "temp",
    "seed",
  ]
    .map((key) => {
      if (typeof key === "string") {
        return `
<div class='kv'>
<label>${key}</label>
<input 
  name="${key}" 
  type='number' 
  placeholder="${key}" 
  value="${config[key] || ""}"
>
</div>`;
      } else {
        if (key.type === "checkbox") {
          return `
<div class='kv'>
  <label>${key.key}</label>
  <label class="switch">
    <input name="${key.key}" type='checkbox' ${
            config[key.key] ? "checked" : ""
          }>
    <span class="slider round"></span>
  </label>
</div>`;
        }
      }
    })
    .join("");

  config.model = config.models[0];
  const models = config.models
    .map((model, i) => {
      return `<option value="${model}" ${
        i === 0 ? "selected" : ""
      }>${model}</option>`;
    })
    .join("");
  return `
<div class='config-container'>
  ${fields}
  <div class='kv'>
    <label>model</label>
    <label class="dropdown-arrow">
      <select id="model" name="model">${models}</select>
    </label>
  </div>
  <div class="kv">
    <label for="prompt-select">prompt</label>
    <label class="dropdown-arrow">
      <select id="prompt-select" name="prompt-select"></select>
    </label>
  </div>
</div>`;
};
let isRunningModel = false;
const loading = (on) => {
  if (on) {
    document.querySelector(".loading").classList.remove("hidden");
  } else {
    document.querySelector(".loading").classList.add("hidden");
  }
};
document.querySelector(".form-header").addEventListener("input", (e) => {
  if (e.target.tagName === "SELECT") {
    if (e.target.id == "model") {
      console.log(e.target.id);
      if (config[e.target.name] != config.models[e.target.selectedIndex]) {
        socket.emit("request", {
          method: "stop",
        });
      }
      config[e.target.name] = config.models[e.target.selectedIndex];
      console.log(config.models[e.target.selectedIndex]);
    }
  } else if (e.target.type === "checkbox") {
    config[e.target.name] = e.target.checked;
  } else {
    config[e.target.name] = e.target.value;
  }
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (input.value) {
    config.prompt = input.value
      .replaceAll("\n", "\\n")
      .replaceAll('"', '\\\\\\""');
    socket.emit("request", config);
    loading(config.prompt);
    input.value = "";
    isRunningModel = true;
    form.setAttribute("class", isRunningModel ? "running-model" : "");
    gen++;
    setTimeout(() => {
      input.style.height = "auto";
      input.style.height = input.scrollHeight + "px";
    });
  }
});
input.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    if (e.shiftKey) {
      document.execCommand("insertLineBreak");
    } else {
      form.requestSubmit();
    }
  }
});

stopButton.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  socket.emit("request", {
    method: "stop",
  });
  setTimeout(() => {
    isRunningModel = false;
    form.setAttribute("class", isRunningModel ? "running-model" : "");
    input.style.height = "34px";
  }, 500);
});

const sha256 = async (input) => {
  const textAsBuffer = new TextEncoder().encode(input);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", textAsBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray
    .map((item) => item.toString(16).padStart(2, "0"))
    .join("");
  return hash;
};
const say = (msg, id) => {
  let item = document.createElement("li");
  if (id) item.setAttribute("data-id", id);
  console.log(msg);
  item.innerHTML = msg;
  messages.append(item);
};
socket.emit("request", {
  method: "installed",
});
var responses = [];

function setHomepage() {
  if (
    document.getElementById("model").value.toLowerCase().startsWith("alpaca")
  ) {
    document.body.classList.remove("llama");
    document.body.classList.add("alpaca");
  } else if (
    document.getElementById("model").value.toLowerCase().startsWith("llama")
  ) {
    document.body.classList.remove("alpaca");
    document.body.classList.add("llama");
  }
}

socket.on("result", async ({ request, response, isRunning }) => {
  loading(false);
  if (request.method === "installed") {
    if (response == "\n\n<end>") {
      if (!document.querySelector(".form-header .config-container")) {
        var header = document.createElement("div");
        document.querySelector(".form-header").prepend(header);
        header.outerHTML = renderHeader(config);

        // Load prompts from files
        const promptSelect = document.getElementById("prompt-select");
        fetch("./prompts")
          .then((response) => response.json())
          .then((prompts) => {
            console.log(prompts);
            if (prompts.length === 0) {
              promptSelect.disabled = true;
              return;
            }
            // Populate prompt options
            prompts.forEach((prompt) => {
              const option = document.createElement("option");
              option.value = prompt.value;
              option.textContent = prompt.name;
              promptSelect.appendChild(option);
            });
            // Select the "default" prompt if it exists, otherwise select the first prompt
            const defaultPrompt = prompts.find(
              (prompt) => prompt.name.toLowerCase() === "none"
            );
            const initialPrompt = defaultPrompt || prompts[0];
            promptSelect.value = initialPrompt.value;
            input.value = initialPrompt.value;
            const promptIndex = input.value.indexOf(">PROMPT");
            // Focus the input
            input.focus();
            input.setSelectionRange(
              promptIndex,
              promptIndex + ">PROMPT".length
            );
            setTimeout(() => {
              input.style.height = "auto";
              input.style.height = input.scrollHeight + "px";
            });
            // Update the input text with the selected prompt value
            const handlePromptChange = () => {
              const selectedPromptValue = promptSelect.value;
              const currentInputValue = input.value;
              input.value = selectedPromptValue;
              // Move the cursor to the first instance of ">PROMPT" and select only the word ">PROMPT"
              const promptIndex = input.value.indexOf(">PROMPT");
              // Focus the input
              input.focus();
              input.setSelectionRange(
                promptIndex,
                promptIndex + ">PROMPT".length
              );
              setTimeout(() => {
                input.style.height = "auto";
                input.style.height = input.scrollHeight + "px";
              });
            };
            promptSelect.addEventListener("change", handlePromptChange);
            // Create a Reset button
            const resetButton = document.createElement("button");
            resetButton.textContent = "Reset";
            // Append the Reset button to the same container as the dropdown
            promptSelect.parentNode.appendChild(resetButton);
            resetButton.addEventListener("click", (e) => {
              e.preventDefault(); // Prevent form from submitting
              handlePromptChange();
            });
          })
          .catch((error) => {
            console.error("Error loading prompts:", error);
          });

        // document.querySelector(".form-header").innerHTML = renderHeader(config);
        setHomepage();
        document.getElementById("model").addEventListener("change", () => {
          if (document.body.classList.length != 0) {
            setHomepage();
          }
        });
      }
    } else {
      config.models.push(response);
    }
  } else {
    if (response == "\n\n<end>") {
      setTimeout(() => {
        isRunningModel = false;
        form.setAttribute("class", isRunningModel ? "running-model" : "");
      }, 200);
    } else {
      document.body.classList.remove("llama");
      document.body.classList.remove("alpaca");
      isRunningModel = true;
      form.setAttribute("class", isRunningModel ? "running-model" : "");
      const id = (await sha256(request.prompt)) + gen;
      let existing = document.querySelector(`[data-id='${id}']`);
      if (existing) {
        if (!responses[id]) {
          responses[id] = document.querySelector(`[data-id='${id}']`).innerHTML;
        }
        response = response.replaceAll(/</g, "&lt;");
        response = response.replaceAll(/>/g, "&gt;");
        console.log(response);

        responses[id] = responses[id] + response;

        if (responses[id].startsWith("<br>")) {
          responses[id] = responses[id].replace("<br>", "");
        }
        if (responses[id].startsWith("\n")) {
          responses[id] = responses[id].replace("\n", "");
        }

        responses[id] = responses[id].replaceAll(/\r?\n\x1B\[\d+;\d+H./g, "");
        responses[id] = responses[id].replaceAll(/\x08\r?\n?/g, "");

        // responses[id] = responses[id].replaceAll("ΓÇÖ", "'"); //apostrophe
        // responses[id] = responses[id].replaceAll("ΓÇ£", "“"); //left quote
        // responses[id] = responses[id].replaceAll("ΓÇ¥", "”"); //right quote
        // responses[id] = responses[id].replaceAll("ΓÇÿ", "‘"); //left single quote
        // responses[id] = responses[id].replaceAll("ΓÇª", ","); //comma, could also be question mark
        // responses[id] = responses[id].replaceAll("ΓÇô", "-"); //dash (not sure)
        // responses[id] = responses[id].replaceAll("ΓÇö", ","); //comma, could also be ampersand (not sure)
        // responses[id] = responses[id].replaceAll("ΓÇï", ";"); //semicolon

        // responses[id] = responses[id].replaceAll("ÔÇÖ", "'"); //apostrophe
        // responses[id] = responses[id].replaceAll("ÔÇ£", "“"); //left quote
        // responses[id] = responses[id].replaceAll("ÔÇØ", "”"); //right quote

        // responses[id] = responses[id].replaceAll("┬ú", "$"); //dollar sign
        // responses[id] = responses[id].replaceAll("Æs", "'s"); //apostrophe s
        // responses[id] = responses[id].replaceAll("IÆll", "I'll"); //I will

        // responses[id] = responses[id].replaceAll("&quot;", '"'); //quote

        responses[id] = responses[id].replaceAll(
          "\\t",
          "&nbsp;&nbsp;&nbsp;&nbsp;"
        ); //tab chracters
        responses[id] = responses[id].replaceAll("\\b", "&nbsp;"); //no break space
        responses[id] = responses[id].replaceAll("\\f", "&nbsp;"); //no break space
        responses[id] = responses[id].replaceAll("\\r", "\n"); //sometimes /r is used in codeblocks

        responses[id] = responses[id].replaceAll("\\n", "\n"); //convert line breaks back
        responses[id] = responses[id].replaceAll('\\"', '"'); //convert quotes back

        //support for codeblocks
        responses[id] = responses[id].replaceAll(
          "\\begin{code}",
          `<pre><code>`
        ); //start codeblock

        responses[id] = responses[id].replaceAll(
          "\\end{code}",
          `</code></pre>`
        ); //end codeblock
        if (
          document.getElementById("bottom").getBoundingClientRect().y <
          window.innerHeight
        ) {
          setTimeout(() => {
            bottom.scrollIntoView({ behavior: "smooth", block: "end" });
          }, 100);
        }
        existing.innerHTML = responses[id];
      } else {
        say(response, id);
      }
    }
  }
});

document
  .querySelectorAll("#feed-placeholder-llama button.card")
  .forEach((e) => {
    e.addEventListener("click", () => {
      let text = e.innerText.replace('"', "").replace('" →', "");
      input.value = text;
    });
  });
document
  .querySelectorAll("#feed-placeholder-alpaca button.card")
  .forEach((e) => {
    e.addEventListener("click", () => {
      let text = e.innerText.replace('"', "").replace('" →', "");
      input.value = text;
    });
  });

/*
const cpuText = document.querySelector("#cpu .text");
const ramText = document.querySelector("#ram .text");
const cpuBar = document.querySelector("#cpu .bar-inner");
const ramBar = document.querySelector("#ram .bar-inner");

var cpuCount, totalmem;
(async () => {
  cpuCount = await (await fetch("/sys/cpuCount")).json();
  cpuCount = cpuCount.data;
  totalmem = await (await fetch("/sys/totalmem")).json();
  totalmem = Math.round(totalmem.data / 102.4) / 10;
})();
setInterval(async () => {
  var cpuPercent = await (await fetch("/sys/cpuUsage")).json();
  var freemem = await (await fetch("/sys/freemem")).json();

  cpuPercent = Math.round(cpuPercent.data * 100);
  freemem = freemem.data;

  console.log(cpuPercent);
  console.log(freemem);

  cpuText.innerText = `CPU: ${cpuPercent}%, ${cpuCount} threads`;
  ramText.innerText = `RAM: ${
    Math.round((totalmem - freemem) * 10) / 10
  }GB/${totalmem}GB`;

  cpuBar.style.transform = `scaleX(${cpuPercent / 100})`;
  ramBar.style.transform = `scaleX(${(totalmem - freemem) / totalmem})`;
}, 1500);
*/

document.getElementById("clear").addEventListener("click", () => {
  input.value = "";
  setTimeout(() => {
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
  });
});
