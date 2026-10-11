import type { SellPreview } from '@/types';
import { useState } from 'react';

type SellFormProps = {
    onTradeSuccess: () => void;
};

export default function SellForm({ onTradeSuccess }: SellFormProps) {
    const [symbol, setSymbol] = useState<string>('');
    const [quantity, setQuantity] = useState<string>('');
    const [tradeError, setTradeError] = useState<string | null>(null);
    const [isSelling, setIsSelling] = useState<boolean>(false);
    const [sellPreview, setSellPreview] = useState<SellPreview | null>(null);

    const previewSell = (symbol: string, quantity: string): void => {
        setTradeError(null);
        setSellPreview(null);
        setIsSelling(true);

        const params = new URLSearchParams({ symbol, quantity });
        fetch(`http://localhost:8080/accounts/1/sell/preview?${params}`)
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((message) => {
                        throw new Error(message || 'Unable to preview sale');
                    });
                }

                return response.json();
            })
            .then((data) => setSellPreview(data))
            .catch((error: unknown) =>
                setTradeError(
                    error instanceof Error
                        ? error.message
                        : 'Unable to preview sale',
                ),
            )
            .finally(() => setIsSelling(false));
    };

    const sellStock = (): void => {
        setTradeError(null);

        if (sellPreview == null) return;

        setIsSelling(true);

        const params = new URLSearchParams({
            symbol: sellPreview.symbol,
            quantity: sellPreview.quantity.toString(),
        });
        fetch(`http://localhost:8080/accounts/1/sell?${params}`, {
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
                setSymbol('');
                setQuantity('');
            })
            .catch((error: unknown) =>
                setTradeError(
                    error instanceof Error
                        ? error.message
                        : 'Unable to sell stock.',
                ),
            )
            .finally(() => setIsSelling(false));
    };

    return <></>;
}
