// Copyright 2016 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

window.VRSamplesUtil = (function () {

  "use strict";

  var containerElement = document.body;

  function setContainerElementId (containerElementId) {
    containerElement = document.getElementById(containerElementId);
  }

  // Lifted from the WebVR Polyfill
  function isMobile () {
    return /Android/i.test(navigator.userAgent) ||
      /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  function getMessageContainer () {
    var messageContainer = document.getElementById("vr-sample-message-container");
    if (!messageContainer) {
      messageContainer = document.createElement("div");
      messageContainer.id = "vr-sample-message-container";
      messageContainer.style.fontFamily = "sans-serif";
      messageContainer.style.position = "absolute";
      messageContainer.style.zIndex = "999";
      messageContainer.style.left = "0";
      messageContainer.style.top = "10px";
      messageContainer.style.right = "0";
      messageContainer.style.margin = "0";
      messageContainer.style.padding = "0";
      messageContainer.align = "center";
      containerElement.appendChild(messageContainer);
    }
    return messageContainer;
  }

  function addMessageElement (message, backgroundColor) {
    var messageElement = document.createElement("div");
    messageElement.classList.add = "vr-sample-message";
    messageElement.style.color = "#FFF";
    messageElement.style.backgroundColor = backgroundColor;
    messageElement.style.fontSize = "18px";
    messageElement.style.lineHeight = "28px";
    messageElement.style.borderRadius = "6px";
    messageElement.style.position = "relative";
    messageElement.style.display = "inline-block";
    messageElement.style.margin = "10px";
    messageElement.style.padding = "10px 20px";

    messageElement.innerHTML = message;

    getMessageContainer().appendChild(messageElement);

    return messageElement;
  }

  // Makes the given element fade out and remove itself from the DOM after the
  // given timeout.
  function makeToast (element, timeout) {
    element.style.transition = "opacity 0.5s ease-in-out";
    element.style.opacity = "1";
    setTimeout(function () {
      element.style.opacity = "0";
      setTimeout(function () {
        if (element.parentElement)
          element.parentElement.removeChild(element);
      }, 500);
    }, timeout);
  }

  function addError (message, timeout) {
    var element = addMessageElement(
      "<h2>ERROR!</h2><p>" + message + "</p>", "#F44336");

    if (timeout) {
      makeToast(element, timeout);
    }

    return element;
  }

  function addInfo (message, timeout) {
    var element = addMessageElement(message, "#3F51B5");

    if (timeout) {
      makeToast(element, timeout);
    }

    return element;
  }

  function getButtonContainer () {
    var buttonContainer = document.getElementById("vr-sample-button-container");
    if (!buttonContainer) {
      buttonContainer = document.createElement("div");
      buttonContainer.id = "vr-sample-button-container";
      buttonContainer.style.fontFamily = "Roboto, arial, sans-serif";
      buttonContainer.style.position = "absolute";
      buttonContainer.style.zIndex = "999";
      buttonContainer.style.left = "0";
      buttonContainer.style.bottom = "10px";
      buttonContainer.style.right = "0";
      buttonContainer.style.margin = "0";
      buttonContainer.style.padding = "0";
      buttonContainer.align = "center";
      containerElement.appendChild(buttonContainer);
    }
    return buttonContainer;
  }

  function addButtonElement (message, key, icon) {
    var buttonElement = document.createElement("div");
    buttonElement.classList.add = "vr-sample-button";
    buttonElement.style.color = "#FFF";
    buttonElement.style.fontSize = "1.0em";
    buttonElement.style.fontWeight = "normal";
    buttonElement.style.backgroundColor = "none";
    buttonElement.style.borderRadius = "6px";
    buttonElement.style.border = "2px solid #FFF";
    buttonElement.style.position = "relative";
    buttonElement.style.display = "inline-block";
    buttonElement.style.margin = "0.5em";
    buttonElement.style.padding = "0.6em";
    buttonElement.style.cursor = "pointer";
    buttonElement.align = "center";

    if (icon) {
      buttonElement.innerHTML = "<img src='" + icon + "'/><br/>" + message;
    } else {
      buttonElement.innerHTML = message;
    }

    if (key) {
      var keyElement = document.createElement("span");
      keyElement.classList.add = "vr-sample-button-accelerator";
      keyElement.style.fontSize = "0.75em";
      keyElement.style.fontStyle = "italic";
      keyElement.innerHTML = " (" + key + ")";

      buttonElement.appendChild(keyElement);
    }

    getButtonContainer().appendChild(buttonElement);

    return buttonElement;
  }

  function addButton (message, key, icon, callback) {
    var keyListener = null;
    if (key) {
      var keyCode = key.charCodeAt(0);
      keyListener = function (event) {
        if (event.keyCode === keyCode) {
          callback(event);
        }
      };
      document.addEventListener("keydown", keyListener, false);
    }
    var element = addButtonElement(message, key, icon);
    element.addEventListener("click", function (event) {
      callback(event);
      event.preventDefault();
    }, false);

    return {
      element: element,
      keyListener: keyListener
    };
  }

  function removeButton (button) {
    if (!button)
      return;
    if (button.element.parentElement)
      button.element.parentElement.removeChild(button.element);
    if (button.keyListener)
      document.removeEventListener("keydown", button.keyListener, false);
  }

  return {
    setContainerElementId: setContainerElementId,
    isMobile: isMobile,
    addError: addError,
    addInfo: addInfo,
    addButton: addButton,
    removeButton: removeButton,
    makeToast: makeToast
  };
})();
