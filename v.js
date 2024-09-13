function showNextField() {
  let e = document.querySelectorAll(".text-field-wrapper");
  for (let t = 0; t < e.length; t++)
    if (e[t].classList.contains("hidden")) {
      e[t].classList.remove("hidden"), updateVisibleFieldsCount();
      break;
    }
}
function hideLastVisibleField() {
  let e = Array.from(
    document.querySelectorAll(".text-field-wrapper")
  ).reverse();
  for (let t = 0; t < e.length; t++)
    if (!e[t].classList.contains("hidden")) {
      e[t].classList.add("hidden"), updateVisibleFieldsCount();
      break;
    }
}
function updateVisibleFieldsCount() {
  let e = document.querySelectorAll(".text-field-wrapper:not(.hidden)").length;
  chrome.storage.local.set({ visibleFieldsCount: e }),
    chrome.runtime.lastError &&
      alert(
        "Quota error: The maximum amount of data to be saved has been exceeded."
      );
}
function initializeFields() {
  chrome.storage.local.get("visibleFieldsCount", function (e) {
    let t = e.visibleFieldsCount || 3;
    document.querySelectorAll(".text-field-wrapper").forEach((e, o) => {
      o < t ? e.classList.remove("hidden") : e.classList.add("hidden");
    });
  });
}
function loadVideoFileNames() {
  chrome.storage.local.get("videoFields", function (e) {
    (e.videoFields || []).forEach((e, t) => {
      e && updateVideoDisplay(t, e.name, e.preview, e.uploaded);
    });
  });
}
function handleVideoUpload(e, t) {
  let o = e.target.files[0];
  if (o) {
    if (!["video/mp4"].includes(o.type))
      return void alert("Invalid file type. Please upload a video file.");
    if (o.size > 104857600)
      return void alert(
        "File is too large. Please upload a video file smaller than 100MB."
      );
    let e = document.createElement("video");
    (e.preload = "metadata"),
      (e.onloadedmetadata = function () {
        if ((window.URL.revokeObjectURL(e.src), e.duration > 3))
          return void alert(
            "Video is too long. Please upload a video shorter than 3 seconds."
          );
        let i = new FileReader();
        (i.onload = function (e) {
          let i = e.target.result;
          chrome.storage.local.get(["videoFields"], function (e) {
            let l = e.videoFields || [];
            (l[t] = {
              name: o.name,
              type: o.type,
              data: i,
              preview: i,
              uploaded: !0,
            }),
              chrome.storage.local.set({ videoFields: l }, function () {
                chrome.runtime.lastError
                  ? alert(
                      "Quota error: The maximum amount of data to be saved has been exceeded."
                    )
                  : (updateVideoDisplay(t, o.name, i, !0),
                    chrome.runtime.sendMessage({ videoFields: l }));
              });
          });
        }),
          (i.onerror = function (e) {
            console.error("File reading error:", e);
          }),
          i.readAsDataURL(o);
      }),
      (e.src = URL.createObjectURL(o));
  } else console.error("No file selected.");
}
function handleClear() {
  chrome.storage.local.remove("videoFields", function () {
    clearVideoFields();
  }),
    chrome.storage.local.remove("textFields", function () {
      clearTextFields();
    }),
    chrome.storage.local.remove("visibleFieldsCount", function () {
      resetVisibleFields();
    }),
    chrome.runtime.sendMessage({ command: "clear" }),
    chrome.runtime.sendMessage({ command: "stop" }),
    (document.querySelector("#countdown-display").innerText =
      "Time before the next letter: 00:00");
}
function clearVideoFields() {
  for (let e = 1; e <= 50; e++) {
    let t = document.getElementById(`video-name-${e}`);
    t && (t.innerText = "No video");
    let o = document.getElementById(`video-preview-${e}`);
    o && ((o.src = ""), (o.style.display = "none"));
  }
}
function resetVisibleFields() {
  document.querySelectorAll(".text-field-wrapper").forEach((e, t) => {
    t < 3 ? e.classList.remove("hidden") : e.classList.add("hidden");
  });
}
function clearTextFields() {
  for (let e = 1; e <= 50; e++) {
    let t = document.getElementById(`text-${e}`);
    t && (t.value = "");
  }
}
function updateVideoDisplay(e, t, o, i) {
  let l = document.getElementById(`video-name-${e + 1}`);
  l && ((l.textContent = t), (l.title = t));
  let d = document.getElementById(`video-preview-${e + 1}`);
  d && ((d.src = o), (d.style.display = "block"));
}
document.addEventListener("DOMContentLoaded", function () {
  let e = document.getElementById("add-button");
  e.addEventListener("click", function () {
    showNextField();
  }),
    e.addEventListener("contextmenu", function (e) {
      e.preventDefault(), hideLastVisibleField();
    }),
    initializeFields(),
    document.querySelectorAll('input[type="file"]').forEach((e, t) => {
      e.addEventListener("change", function (e) {
        handleVideoUpload(e, t);
      });
    }),
    loadVideoFileNames(),
    Array.from(document.querySelectorAll('[id^="video-name-"]')).forEach(
      (e, t) => {
        e.addEventListener("click", function () {
          document.querySelector(`#video-${t + 1}`).click();
        });
      }
    );
});
let n = document.getElementById("clear-button");
n && n.addEventListener("click", handleClear);
