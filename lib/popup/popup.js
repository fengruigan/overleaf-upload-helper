const init = () => {
    document.querySelector("#setEndpointButton").addEventListener("click", setUploadEndpoint)
}

const displayUploadEndpoint = () => {
    const currentUploadEndpointElement = document.querySelector("#currentUploadEndpoint")
    chrome.storage.sync.get(["uploadEndpoint"]).then(res => {
        currentUploadEndpointElement.innerHTML = res.uploadEndpoint
    })
}

const setUploadEndpoint = () => {
    const endpointInput = document.querySelector("#uploadEndpointInput")
    chrome.storage.sync.set({uploadEndpoint: endpointInput.value}).then(() => endpointInput.value = "")
}

window.addEventListener("load", init)
displayUploadEndpoint()
chrome.storage.onChanged.addListener(displayUploadEndpoint)