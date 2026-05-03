import { useState, useEffect } from "react";

export function useLocalStorage(key: string, initialValue: string) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? item : initialValue;
        } catch (error) {
            console.error("Error reading localStorage", error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, String(storedValue));
        } catch (error) {
            console.error("Error setting localStorage", error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue] as const; 
}