import { DEFAULT_TRACKING_PARAMS } from "../lib/tracking";

// Unique ID offset for dynamic rules to avoid hitting static rules (id: 1)
const DYNAMIC_RULE_START_ID = 100;

document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("add-rule-form") as HTMLFormElement;
    const input = document.getElementById("new-param-input") as HTMLInputElement;
    const rulesList = document.getElementById("rules-list") as HTMLUListElement;

    // Render a rule in the list UI
    function renderRule(paramName: string, id: number) {
        const li = document.createElement("li");
        li.innerHTML = `
      <span>${paramName}</span>
      <button class="remove-btn" data-id="${id}" data-param="${paramName}" aria-label="Remove ${paramName}">
        ✕
      </button>
    `;
        rulesList.appendChild(li);

        // Attach listener for removal
        const btn = li.querySelector(".remove-btn") as HTMLButtonElement;
        btn.addEventListener("click", () => removeRule(id, paramName, li));
    }

    // Load existing dynamic rules
    async function loadExistingRules() {
        rulesList.innerHTML = "";
        const existingRules = await chrome.declarativeNetRequest.getDynamicRules();

        // Reverse sort so newest are at the top, or just render them
        for (const rule of existingRules) {
            if (rule.action.type === "redirect" && rule.action.redirect?.transform?.queryTransform?.removeParams) {
                // Technically our rules map 1 param to 1 rule for easy deletion
                const param = rule.action.redirect.transform.queryTransform.removeParams[0];
                renderRule(param, rule.id);
            }
        }
    }

    // Add a new dynamic tracking rule
    async function addRule(e: Event) {
        e.preventDefault();
        const paramName = input.value.trim().toLowerCase();

        // Valdiate
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

        // Generate unique ID based on timestamp
        const dynamicId = DYNAMIC_RULE_START_ID + Math.floor(Math.random() * 10000);

        // Insert to storage array for background.js to read when testing copy events
        customParams.push(paramName);
        await chrome.storage.local.set({ customParams });

        // Update DNR Engine
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

    // Remove a dynamic tracking rule
    async function removeRule(ruleId: number, paramName: string, liElement: HTMLLIElement) {
        const customParams = await getCustomParamsFromStorage();
        const newParams = customParams.filter(p => p !== paramName);

        await chrome.storage.local.set({ customParams: newParams });
        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [ruleId],
            addRules: []
        });

        liElement.style.opacity = "0";
        setTimeout(() => liElement.remove(), 200);
    }

    async function getCustomParamsFromStorage(): Promise<string[]> {
        const { customParams } = await chrome.storage.local.get("customParams");
        return customParams || [];
    }

    // Init
    form.addEventListener("submit", addRule);
    loadExistingRules();
});
