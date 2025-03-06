function extractUniqueId(url) {
    const match = url.match(/-(\d+)(?=\?|$)/); // Matches a hyphen followed by digits, ensuring it's before "?" or end of string
    const id = match ? match[1] : null;
    return id;
}

(function () {
    const OriginalXHR = window.XMLHttpRequest;

    class InterceptedXHR extends OriginalXHR {
        constructor() {
            super();
            const id = extractUniqueId(window.location.href);
            // Monitor the request
            this.addEventListener("readystatechange", () => {
                if (
                    this.readyState === 4 && // Request is complete
                    this.status === 200 && // Request was successful
                    this.responseURL === `https://api2.maang.in/problems/user/${id}` // Match the target URL
                ) {
                    // Raise an event with the intercepted response
                    const eventData = {
                        url: this.responseURL,
                        status: this.status,
                        method: this.method || "GET",
                        response: this.responseText,
                    };
                    document.dispatchEvent(
                        new CustomEvent("xhrIntercept", { detail: eventData })
                    );
                }
            });
        }
    }

    // Override XMLHttpRequest
    window.XMLHttpRequest = InterceptedXHR;

})();
