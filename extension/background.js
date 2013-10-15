/* tab ids which currently have an instance of our AI running */
activeTabs = [];

/**
 * Show the Hidden Machine toggleable icon on
 * simulator pages.
 */
function showAIIcon(tabId, changeInfo, tab) {
    if (tab.url.match(/^http:\/\/play\.pokemonshowdown\.com\//) ||
       tab.url.match(/^http:\/\/.*\.psim\.us\//)) {
	chrome.pageAction.show(tabId);
    }
};


/**
 * Toggle whether or not the AI is active
 * on the current tab.
 */
function toggleAI(tab) {
    if (activeTabs.indexOf(tab.id) < 0) {
	activeTabs.push(tab.id);
	console.log("[debug] Activating on tab " + tab.id + ". Currently active on: " + (activeTabs.length ? activeTabs : "none"));

    chrome.tabs.executeScript(tab.id, {file: "lib/jquery.min.js"}, function () {
            chrome.tabs.executeScript(tab.id, {file: "src/database.js"}, function () {
		chrome.tabs.executeScript(tab.id, {file: "src/human-learner.js"}, function () {
                    chrome.tabs.executeScript(tab.id, {file: "src/automation.js"}, function () {
			chrome.tabs.executeScript(tab.id, {file: "src/pokemon.js"}, function () {
                            chrome.tabs.executeScript(tab.id, {file: "src/auto-learner.js"}, function () {
				chrome.tabs.executeScript(tab.id, {file: "src/personality.js"}, function () {
                                    chrome.tabs.executeScript(tab.id, {file: "src/hidden-machine.js"}, function () {
					chrome.tabs.executeScript(tab.id, {code: "HM_activate();"});
                                    })
                                })
                            })
                        })
                    })
		})
            })
    });
    }
    else {
	activeTabs.splice(activeTabs.indexOf(tab.id), 1);
	console.log("[debug] Deactivating on tab " + tab.id + ". Current active on: " + (activeTabs.length ? activeTabs : "none"));
	
	chrome.tabs.executeScript(tab.id, {code: "HM_deactivate();"});
    }
}



chrome.pageAction.onClicked.addListener(toggleAI);
chrome.tabs.onUpdated.addListener(showAIIcon);
