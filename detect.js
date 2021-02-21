const iframe = document.createElement("iframe");
iframe.style.display='none';
iframe.src = chrome.extension.getURL("./audio.html")
iframe.allow = 'microphone'; //iframe 特性
document.body.appendChild(iframe);