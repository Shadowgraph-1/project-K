import { useEffect, useState } from "react";

export function useSearchBar() {
    const [focus, setFocus] = useState(false);
    
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                setFocus((prev) => !prev);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    return { focus, setFocus };
}