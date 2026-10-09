import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import type { SellPreview } from '@/types';
import SellPreviewModal from './SellPreviewModal';

type TradePanelProps = {
    onTradeSuccess: () => void;
};

export default function TradePanel({ onTradeSuccess }: TradePanelProps) {
    const [symbol, setSymbol] = useState<string>('');
    const [quantity, setQuantity] = useState<string>('');
    const [tradeError, setTradeError] = useState<string | null>(null);
    const [isBuying, setIsBuying] = useState<boolean>(false);
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

    const buyStock = (symbol: string, quantity: string): void => {
        setTradeError(null);
        setIsBuying(true);
        const params = new URLSearchParams({ symbol, quantity });
        fetch(`http://localhost:8080/accounts/1/buy?${params}`, {
            method: 'POST',
        })
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((message) => {
                        throw new Error(message || 'Unable to buy stock');
                    });
                }

                onTradeSuccess();
                setSymbol('');
                setQuantity('');
            })
            .catch((error: unknown) =>
                setTradeError(
                    error instanceof Error
                        ? error.message
                        : 'Unable to buy stock',
                ),
            )
            .finally(() => setIsBuying(false));
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>
                        <h2>Trade Panel</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                    <Input
                        type='text'
                        placeholder='Symbol'
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                    />
                    <Input
                        type='number'
                        step='any'
                        placeholder='Quantity'
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                    <Button
                        className='w-full'
                        disabled={isBuying || isSelling}
                        onClick={() => buyStock(symbol, quantity)}
                    >
                        {isBuying ? 'Buying...' : 'Buy'}
                    </Button>
                    <Button
                        variant={'secondary'}
                        className='w-full'
                        disabled={isBuying || isSelling}
                        onClick={() => previewSell(symbol, quantity)}
                    >
                        {isSelling ? 'Selling...' : 'Sell'}
                    </Button>

                    {tradeError != null && (
                        <p className={'text-destructive'}>{tradeError}</p>
                    )}
                </CardContent>
            </Card>
            <SellPreviewModal
                preview={sellPreview}
                onCancel={() => setSellPreview(null)}
                onConfirm={sellStock}
                isSelling={isSelling}
                tradeError={tradeError}
            />
        </>
    );
}
