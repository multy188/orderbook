import { useEffect, useState } from "react"

export const useDetectBackround = (): boolean => {
    const [isHidden, setHidden] = useState(false)

    // Tab in Focus
    const onFocus = () => {
        console.log('Tab is in focus');
        setHidden(false)
    };

    // Tab switched
    const onBlur = () => {
        console.log('Tab out');
        setHidden(true)
    };

    useEffect(() => {
        window.addEventListener('focus', onFocus);
        window.addEventListener('blur', onBlur);
        // Specify how to clean up after this effect:
        return () => {
            window.removeEventListener('focus', onFocus);
            window.removeEventListener('blur', onBlur);
        };
    });

    return isHidden;
}

