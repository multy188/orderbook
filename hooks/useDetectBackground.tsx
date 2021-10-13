import { useEffect, useState } from "react"

export const useDetectBackground = (): boolean => {
    const [isHidden, setHidden] = useState(false)

    const handleTabFocus = () => {
        setHidden(document.hidden)
    };

    useEffect(() => {
        document.addEventListener('visibilitychange', handleTabFocus);
        return () => {
            document.removeEventListener('visibilitychange', handleTabFocus);
        }
    }, []);

    return isHidden;
}

