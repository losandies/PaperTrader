import { useState } from 'react';

export function useBuyStock(onTradeSuccess: () => void) {
    const [tradeError, setTradeError] = useState<string | null>(null);
    const [isBuying, setIsBuying] = useState<boolean>(false);

    const buyStock = (symbol: string, quantity: number): Promise<boolean> => {
        setTradeError(null);
        setIsBuying(true);

        const params = new URLSearchParams({
            symbol,
            quantity: quantity.toString(),
        });

        return fetch(`http://localhost:8080/accounts/1/buy?${params}`, {
            method: 'POST',
        })
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((message) => {
                        throw new Error(message || 'Unable to buy stock');
                    });
                }

                onTradeSuccess();
                return true;
            })
            .catch((error: unknown) => {
                setTradeError(
                    error instanceof Error
                        ? error.message
                        : 'Unable to buy stock',
                );
                return false;
            })
            .finally(() => setIsBuying(false));
    };

    return { buyStock, tradeError, isBuying };
}
