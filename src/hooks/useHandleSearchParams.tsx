'use client'
import { useRouter, useSearchParams } from 'next/navigation';

export default function useHandleSearchParams() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const handleSetSearchParams = (
        values: Record<string, any>,
        endpoints?: string
    ) => {
        const params = new URLSearchParams(searchParams.toString());

        for (const [key, value] of Object.entries(values)) {
            if (value === "") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        }
        if (endpoints) {
            router.push(`${endpoints}/?${params.toString()}`, { scroll: false });
        } else {
            router.push(`?${params.toString()}`, { scroll: false });
        }

    };

    const clearSearchParams = () => {
        router.push("?", { scroll: false });
    };
    return {
        handleSetSearchParams,
        clearSearchParams
    };
}