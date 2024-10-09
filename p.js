let countdownDisplay,
  isScriptRunning = !1,
  selectedMode = "Online",
  selectedEmoji = "Emoji";
function formatTime(e) {
  return Math.floor(e / 60) + ":" + ((e %= 60) < 10 ? "0" : "") + e;
}
const AutoMessageButton = document.getElementById("autoReply");
const modalAutoReply = document.getElementById("modalAutoReply");
const saveAutoMessage = document.getElementById("saveAutoMessage");
const closeAutoMessage = document.getElementById("closeAutoMessage");
const AutoMessage = document.getElementById("AutoMessage");
const autoReplyIcon = document.getElementById("autoReplyIcon");

// Add debug logging
function debugLog(message) {
  console.log(`[DEBUG] ${message}`);
}

// Check stored message on load
chrome.storage.local.get(["AutoMessageReply"], function (result) {
  debugLog(`Initial AutoMessageReply: ${result.AutoMessageReply}`);
  if (result.AutoMessageReply) {
    AutoMessageButton.classList.remove("disabled");
    debugLog("AutoMessageButton enabled");
  } else {
    AutoMessageButton.classList.add("disabled");
    debugLog("AutoMessageButton disabled");
  }
});

const clearAutoFields = document.getElementById("clearAutoFields");

clearAutoFields.addEventListener("click", () => {
  AutoMessage.value = "";
  debugLog("Cleared AutoMessage input field");

  chrome.storage.local.remove(["AutoMessageReply"], function () {
    debugLog("AutoMessageReply has been cleared from storage");
  });

  AutoMessageButton.classList.add("disabled");
  debugLog("AutoMessageButton disabled after clearing");
});

AutoMessageButton.addEventListener("click", () => {
  modalAutoReply.style.display = "block";
  debugLog("Opened auto reply modal");

  chrome.storage.local.get(["AutoMessageReply"], function (result) {
    debugLog(`Retrieved AutoMessageReply: ${result.AutoMessageReply}`);
    AutoMessage.value = result.AutoMessageReply.join("\n") || "";
    debugLog(`Set AutoMessage input value to: ${AutoMessage.value}`);
  });
});

closeAutoMessage.addEventListener("click", () => {
  modalAutoReply.style.display = "none";
  debugLog("Closed auto reply modal");
});

modalAutoReply.addEventListener("mousedown", function (event) {
  if (event.target === modalAutoReply) {
    modalAutoReply.style.display = "none";
    debugLog("Closed auto reply modal by clicking outside");
  }
});

saveAutoMessage.addEventListener("click", () => {
  const AutoMessageReply = AutoMessage.value.trim();
  debugLog(`Attempting to save AutoMessageReply: ${AutoMessageReply}`);

  if (AutoMessageReply) {
    let formattedAutoMessage = AutoMessageReply.split("\n").filter(
      (msg) => msg.trim() !== ""
    );
    console.log("input saved: " + formattedAutoMessage),
      chrome.storage.local.set(
        { AutoMessageReply: formattedAutoMessage },
        function () {
          if (chrome.runtime.lastError) {
            debugLog(
              `Error saving AutoMessageReply: ${chrome.runtime.lastError.message}`
            );
          } else {
            debugLog("Successfully saved AutoMessageReply");
            AutoMessageButton.classList.remove("disabled");
            debugLog("AutoMessageButton enabled after saving");
            alert(
              "Ready to use current message to reply. Please enable notifications"
            );
            modalAutoReply.style.display = "none";
          }
        }
      );
  } else {
    alert("Please enter the text.");
    debugLog("Attempted to save empty AutoMessageReply");
  }
});

function updateScriptStatus() {
  let e = document.getElementById("script-status");
  isScriptRunning
    ? ((e.textContent = "Sending Started"),
      e.classList.remove("stopped"),
      e.classList.add("running"),
      (modeDisplay.textContent = "Mode: " + selectedMode),
      (emojiDisplay.textContent = "Emoji: " + selectedEmoji),
      modeDisplay.classList.remove("stopped"),
      modeDisplay.classList.add("running"),
      emojiDisplay.classList.remove("stopped"),
      emojiDisplay.classList.add("running"),
      countdownDisplay.classList.remove("stopped"),
      countdownDisplay.classList.add("running"))
    : ((e.textContent = "Sending Stopped"),
      e.classList.remove("running"),
      e.classList.add("stopped"),
      (modeDisplay.textContent = "Mode: " + selectedMode),
      (emojiDisplay.textContent = "Emoji: " + selectedEmoji),
      emojiDisplay.classList.add("stopped"),
      emojiDisplay.classList.remove("running"),
      modeDisplay.classList.add("stopped"),
      modeDisplay.classList.remove("running"),
      countdownDisplay.classList.add("stopped"),
      countdownDisplay.classList.remove("running"));
}
function disableControls(e) {
  document
    .querySelectorAll("#mode-select, #emoji-select, #timer")
    .forEach((t) => {
      t.disabled = e;
    });
}
function saveFavoriteShouldClick() {
  const favoriteShouldClick = document.getElementById(
    "favoriteShouldClick"
  ).checked;
  chrome.storage.local.set(
    { favoriteShouldClick: favoriteShouldClick },
    function () {
      console.log("Favorite should click is saved:", favoriteShouldClick);
    }
  );
}

function loadFavoriteShouldClick() {
  chrome.storage.local.get(["favoriteShouldClick"], function (result) {
    if (result.favoriteShouldClick !== undefined) {
      document.getElementById("favoriteShouldClick").checked =
        result.favoriteShouldClick;
    }
  });
}
function toggleChatField(e) {
  const t = document.getElementById("ChattextField"),
    n = document.getElementById("textFieldLabel");
  "UserInput" === e
    ? (t.classList.remove("hidden"), n.classList.remove("hidden"))
    : (t.classList.add("hidden"), n.classList.add("hidden"));
}
function saveSettings() {
  let e = document.getElementById("ChattextField").value.split("\n");
  chrome.storage.local.set({
    isScriptRunning: isScriptRunning,
    selectedMode: selectedMode,
    selectedEmoji: selectedEmoji,
    ChattextField: e,
  });
}
document.getElementById("start-script").addEventListener("click", () => {
  (isScriptRunning = !0),
    updateScriptStatus(),
    disableControls(!0),
    chrome.runtime.sendMessage({ type: "START_SCRIPT" }),
    chrome.runtime.sendMessage({
      type: "SET_TIMER",
      value: parseInt(document.getElementById("timer").value, 10),
    }),
    saveSettings();
});
document.getElementById("stop-script").addEventListener("click", () => {
  (isScriptRunning = !1),
    updateScriptStatus(),
    disableControls(!1),
    chrome.runtime.sendMessage({ type: "STOP_SCRIPT" }),
    saveSettings();
}),
  document.getElementById("emoji-select").addEventListener("change", () => {
    (selectedEmoji = document.getElementById("emoji-select").value),
      (emojiDisplay.textContent = "Emoji: " + selectedEmoji),
      chrome.runtime.sendMessage({ type: "SET_EMOJI", emoji: selectedEmoji }),
      saveSettings();
  }),
  chrome.runtime.onMessage.addListener((e, t, n) => {
    "SCRIPT_STATUS" === e.type &&
      ((isScriptRunning = e.isScriptRunning),
      updateScriptStatus(),
      disableControls(isScriptRunning));
  }),
  (window.onload = () => {
    loadFavoriteShouldClick(),
      chrome.storage.local.get(
        ["timerValue", "sliderText", "ChattextField"],
        (e) => {
          e.timerValue &&
            ((document.getElementById("timer").value = e.timerValue),
            (document.getElementById("timerValue").textContent = e.sliderText)),
            e.ChattextField &&
              (document.getElementById("ChattextField").value =
                e.ChattextField.join("\n"));
        }
      ),
      (emojiDisplay = document.getElementById("emoji-selectP")),
      (modeDisplay = document.getElementById("mode-selectP")),
      (countdownDisplay = document.getElementById("countdown-display")),
      (modeDisplay.id = "mode-display"),
      (emojiDisplay.id = "emoji-display"),
      (modeDisplay.style.textAlign = "center"),
      (emojiDisplay.style.textAlign = "center"),
      document.body.appendChild(countdownDisplay),
      chrome.storage.local.get(
        ["isScriptRunning", "selectedMode", "selectedEmoji"],
        (e) => {
          (isScriptRunning = e.isScriptRunning || !1),
            (selectedMode = e.selectedMode || "Online"),
            (selectedEmoji = e.selectedEmoji || "Emoji"),
            updateScriptStatus(),
            (document.getElementById("mode-select").value = selectedMode),
            (document.getElementById("emoji-select").value = selectedEmoji),
            disableControls(isScriptRunning),
            toggleChatField(selectedMode);
        }
      );
    let e = document.getElementById("mode-select");
    e.addEventListener("change", () => {
      (selectedMode = e.value),
        (modeDisplay.textContent = "Mode: " + selectedMode),
        chrome.runtime.sendMessage({ type: "SET_MODE", mode: selectedMode }),
        saveSettings(),
        toggleChatField(selectedMode);
    }),
      document.getElementById("timer").addEventListener("input", function () {
        (document.getElementById("timerValue").textContent = this.value),
          chrome.storage.local.set({
            timerValue: this.value,
            sliderText: document.getElementById("timerValue").textContent,
          }),
          chrome.runtime.sendMessage({
            type: "SET_TIMER",
            value: parseInt(this.value, 10),
          });
      }),
      document
        .getElementById("ChattextField")
        .addEventListener("input", function () {
          let e = this.value.split("\n");
          console.log("input saved: " + e),
            chrome.storage.local.set({ ChattextField: e });
        });
  });
let popupPort = chrome.runtime.connect({ name: "popupChat" });
popupPort.onMessage.addListener(function (e) {
  e.countdownValue1 &&
    countdownDisplay &&
    (countdownDisplay.textContent = formatTime(e.countdownValue1));
});
document
  .getElementById("favoriteShouldClick")
  .addEventListener("change", saveFavoriteShouldClick);
