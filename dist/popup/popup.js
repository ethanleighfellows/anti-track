"use strict";
(() => {
  // src/lib/tracking.ts
  var DEFAULT_TRACKING_PARAMS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "utm_id",
    "utm_source_platform",
    "si",
    "gclid",
    "fbclid",
    "igshid",
    "ttclid",
    "yclid",
    "msclkid",
    "mc_cid",
    "mc_eid",
    "_bta_tid",
    "_bta_c",
    "trk_contact",
    "trk_msg",
    "trk_module",
    "trk_sid"
  ];

  // src/popup/popup.ts
  var DYNAMIC_RULE_START_ID = 100;
  document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("add-rule-form");
    const input = document.getElementById("new-param-input");
    const rulesList = document.getElementById("rules-list");
    function renderRule(paramName, id) {
      const li = document.createElement("li");
      li.innerHTML = `
      <span>${paramName}</span>
      <button class="remove-btn" data-id="${id}" data-param="${paramName}" aria-label="Remove ${paramName}">
        \u2715
      </button>
    `;
      rulesList.appendChild(li);
      const btn = li.querySelector(".remove-btn");
      btn.addEventListener("click", () => removeRule(id, paramName, li));
    }
    async function loadExistingRules() {
      rulesList.innerHTML = "";
      const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
      for (const rule of existingRules) {
        if (rule.action.type === "redirect" && rule.action.redirect?.transform?.queryTransform?.removeParams) {
          const param = rule.action.redirect.transform.queryTransform.removeParams[0];
          renderRule(param, rule.id);
        }
      }
    }
    async function addRule(e) {
      e.preventDefault();
      const paramName = input.value.trim().toLowerCase();
      if (!paramName || !/^[a-z0-9_-]+$/.test(paramName)) {
        alert("Invalid parameter name. Use letters, numbers, hyphens, or underscores.");
        return;
      }
      if (DEFAULT_TRACKING_PARAMS.includes(paramName)) {
        alert("This parameter is already blocked by default rules.");
        input.value = "";
        return;
      }
      const customParams = await getCustomParamsFromStorage();
      if (customParams.includes(paramName)) {
        alert("This custom parameter is already blocked.");
        input.value = "";
        return;
      }
      const dynamicId = DYNAMIC_RULE_START_ID + Math.floor(Math.random() * 1e4);
      customParams.push(paramName);
      await chrome.storage.local.set({ customParams });
      await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [{
          id: dynamicId,
          priority: 1,
          action: {
            type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
            redirect: {
              transform: {
                queryTransform: { removeParams: [paramName] }
              }
            }
          },
          condition: {
            resourceTypes: [
              chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
              chrome.declarativeNetRequest.ResourceType.SUB_FRAME,
              chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
              chrome.declarativeNetRequest.ResourceType.PING,
              chrome.declarativeNetRequest.ResourceType.SCRIPT,
              chrome.declarativeNetRequest.ResourceType.IMAGE
            ]
          }
        }],
        removeRuleIds: []
      });
      renderRule(paramName, dynamicId);
      input.value = "";
    }
    async function removeRule(ruleId, paramName, liElement) {
      const customParams = await getCustomParamsFromStorage();
      const newParams = customParams.filter((p) => p !== paramName);
      await chrome.storage.local.set({ customParams: newParams });
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [ruleId],
        addRules: []
      });
      liElement.style.opacity = "0";
      setTimeout(() => liElement.remove(), 200);
    }
    async function getCustomParamsFromStorage() {
      const { customParams } = await chrome.storage.local.get("customParams");
      return customParams || [];
    }
    form.addEventListener("submit", addRule);
    loadExistingRules();
  });
})();
