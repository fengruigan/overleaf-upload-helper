const init = () => {
    const toolbar = $("editor-navigation-toolbar-root > header > div.toolbar-right")[0]
    const uploadButton = $.parseHTML("<div class=\"toolbar-item\"><button class=\"btn btn-full-height\"><i class=\"fa fa-upload fa-fw\"></i><p class=\"toolbar-label\">Upload</p></button></div>")[0]
    uploadButton.addEventListener("click", upload)
    toolbar.insertBefore(uploadButton, toolbar.children[1])
}

const fetchWrapper = async (url, method, body, resultCallback) => {
    const res = await fetch(url, {
        method,
        body: body
    })
    if (res.ok) {
        if (resultCallback != null) {
            return await res[resultCallback]()
        } else {
            return res
        }
    } else {
        return { error: `Request to ${url} returned status ${res.status}` }
    }
}

const upload = async () => {
    const downloadLink = $("pdf-preview > div.pdf.full-size > div.toolbar.toolbar-pdf.toolbar-pdf-hybrid.btn-toolbar > div.toolbar-pdf-left > a")[0].href
    const storageResult = await chrome.storage.sync.get(["uploadEndpoint"])
    if (storageResult.uploadEndpoint == null) {
        alert("No endpoint specified");
        return
    }
    const pdfBlob = await fetchWrapper(downloadLink, "GET", null, "blob")
    const getPresignedUrl = await fetchWrapper(storageResult.uploadEndpoint, "GET", null, "json")
    const uploadToS3 = await fetchWrapper(getPresignedUrl.presignedUrl, "PUT", pdfBlob, null)
    if (uploadToS3.error == null) {
        alert("Upload successful")
    } else {
        alert(`Upload failed: ${uploadToS3.error}`)
    }
}

window.addEventListener("load", init, false); 
