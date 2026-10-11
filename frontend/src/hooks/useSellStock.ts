import type { SellPreview } from '@/types';
import { useState } from 'react';

export function useSellStock(onTradeSuccess: () => void) {
    const [tradeError, setTradeError] = useState<string | null>(null);
    const [isSelling, setIsSelling] = useState<boolean>(false);
    const [sellPreview, setSellPreview] = useState<SellPreview | null>(null);

    const previewSell = (symbol: string, quantity: number) => {
        setTradeError(null);
        setIsSelling(true);
        setSellPreview(null);

        const params = new URLSearchParams({
            symbol,
            quantity: quantity.toString(),
        });

        fetch(`http://localhost:8080/accounts/1/sell/preview?${params}`)
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((message) => {
                        throw new Error(
                            message || 'Unable to get sell preview',
                        );
                    });
                }

                return response.json();
            })
            .then((data) => setSellPreview(data))
            .catch((error: unknown) => {
                setTradeError(
                    error instanceof Error
                        ? error.message
                        : 'Unable to get sell preview',
                );
            })
            .finally(() => setIsSelling(false));
    };

    const sellStock = (): Promise<boolean> => {
        if (sellPreview === null || isSelling) {
            return Promise.resolve(false);
        }

        setTradeError(null);
        setIsSelling(true);

        const params = new URLSearchParams({
            symbol: sellPreview.symbol,
            quantity: sellPreview.quantity.toString(),
        });

        return fetch(`http://localhost:8080/accounts/1/sell?${params}`, {
            method: 'POST',
        })
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((message) => {
                        throw new Error(message || 'Unable to sell stock');
                    });
                }

                onTradeSuccess();
                setSellPreview(null);
                return true;
            })
            .catch((error: unknown) => {
                setTradeError(
                    error instanceof Error
                        ? error.message
                        : 'Unable to sell stock',
                );
                return false;
            })
            .finally(() => setIsSelling(false));
    };

    const cancelPreview = () => {
        if (!isSelling) setSellPreview(null);
    };

    return {
        previewSell,
        sellStock,
        sellPreview,
        cancelPreview,
        tradeError,
        isSelling,
    };
}
