import type { BuyPreview } from '@/types';
import { useState } from 'react';

export function useBuyStock(onTradeSuccess: () => void) {
    const [tradeError, setTradeError] = useState<string | null>(null);
    const [isBuying, setIsBuying] = useState<boolean>(false);

    const [buyPreview, setBuyPreview] = useState<BuyPreview | null>(null);

    const previewBuy = (symbol: string, quantity: number, price: number): void => {
        if (isBuying) return;
        setTradeError(null);
        setBuyPreview({ symbol, quantity, price, estimatedCost: quantity * price });
    };

    const cancelPreview = (): void => {
        if (!isBuying) setBuyPreview(null);
    };

    const buyStock = (): Promise<boolean> => {
        if (buyPreview === null || isBuying) return Promise.resolve(false);
        setTradeError(null);
        setIsBuying(true);

        const params = new URLSearchParams({
            symbol: buyPreview.symbol,
            quantity: buyPreview.quantity.toString(),
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
                setBuyPreview(null);
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

    return { previewBuy, buyStock, buyPreview, cancelPreview, tradeError, isBuying };
}
