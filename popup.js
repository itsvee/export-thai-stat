window.addEventListener('DOMContentLoaded', function () {
    var exportBtn = document.getElementById('exportFile');
    exportBtn.addEventListener('click', function() {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            chrome.tabs.sendMessage(
                tabs[0].id,
                {method: "getDataTable"});
        });
    });
});