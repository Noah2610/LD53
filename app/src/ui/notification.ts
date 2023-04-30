export function addNotification(
    type: "error" | "warning" | "success" | "info",
    message: string,
    { timeoutMs }: { timeoutMs?: number } = {},
) {
    const notifsEl = document.querySelector(".notifications");
    if (!notifsEl) {
        throw new Error("Expected .notifications element");
    }

    const notifEl = document.createElement("div");
    notifEl.classList.add("notification", type);
    notifEl.innerText = message;

    const closeEl = document.createElement("button");
    closeEl.classList.add("notification-close");
    closeEl.innerText = "x";
    closeEl.addEventListener("click", () => notifEl.remove());

    notifEl.appendChild(closeEl);
    notifsEl.appendChild(notifEl);

    if (timeoutMs) {
        setTimeout(() => notifEl.remove(), timeoutMs);
    }
}
