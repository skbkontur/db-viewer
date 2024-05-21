import { useEffect, useState } from "react";

export const useDeveloperMode = (defaultValue?: boolean): boolean => {
    const [isActivated, setIsActivated] = useState(defaultValue ?? false);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent): void => {
            if (event.key === "h") {
                setIsActivated(!isActivated);
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [isActivated]);

    return isActivated;
};
