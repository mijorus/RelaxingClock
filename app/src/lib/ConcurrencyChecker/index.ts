function handleUnload(e: BeforeUnloadEvent) {
    localStorage.removeItem('concurrency');
}

export class ConcurrencyChecker {
    constructor() {
        window.addEventListener('beforeunload', handleUnload);
    }

    isConcurrent() {
        if (!localStorage.getItem('concurrency')) {
            localStorage.setItem('concurrency', '1');
            return false
        }

        return true;
    }
}