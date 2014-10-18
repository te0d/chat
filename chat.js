var ws = new WebSocket("ws://127.0.0.1:8081");
var messages = document.getElementById("messages");
var sendButton = document.getElementById("sendButton");
var sendTextbox = document.getElementById("sendTextbox");


ws.onmessage = function (evt) {
  var received = evt.data;
  var row = document.createElement("tr");
  var metadata = document.createElement("td");
  var content = document.createElement("td");

  // consider using ArrayBuffer instead of parsing string
  var authorEndIndex = received.indexOf(":");

  var author;
  var msg;
  if (authorEndIndex > -1) {
    author = document.createTextNode(received.substr(0, authorEndIndex));
    msg = document.createTextNode(received.substr(authorEndIndex + 1).trim());
  }
  else {
    author = document.createTextNode("");
    msg = document.createTextNode(received);
  }

  metadata.appendChild(author);
  content.appendChild(msg);
  row.appendChild(metadata);
  row.appendChild(content);
  messages.appendChild(row);
  row.scrollIntoView();
};

sendButton.onclick = function () {
  var msg = sendTextbox.value;

  if (msg && msg != "") {
    ws.send(msg);
    sendTextbox.value = "";
  }
};

sendTextbox.keyup(function (evt) {
  if (evt.keyCode == 13) {  // Enter key
    sendButton.click();
  }
});
