import type { Holding, TradeSelection } from '@/types';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from './ui/card';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

type HoldingDetailsPanelProps = {
    holding: Holding;
    onOpenTrade: (selection: TradeSelection) => void;
};

export default function HoldingDetailsPanel({
    holding,
    onOpenTrade,
}: HoldingDetailsPanelProps) {
    const costBasis = holding.quantity * holding.averageCost;
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const marketValue =
        currentPrice === null ? null : holding.quantity * currentPrice;

    const unrealizedPL = marketValue === null ? null : marketValue - costBasis;

    const returnPercentage =
        unrealizedPL === null || costBasis === 0
            ? null
            : (unrealizedPL / costBasis) * 100;

    useEffect(() => {
        fetch(
            `http://localhost:8080/stocks/${encodeURIComponent(holding.symbol)}/price`,
        )
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((message) => {
                        throw new Error(
                            message || 'Unable to get current price',
                        );
                    });
                }

                return response.json();
            })
            .then((data) => {
                setCurrentPrice(data.price);
                setError(null);
            })
            .catch((error: unknown) =>
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Unable to get current price',
                ),
            )
            .finally(() => setIsLoading(false));
    }, [holding.symbol]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Holding Details</CardTitle>
                <CardDescription>{holding.symbol}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
                <p>
                    Shares: {holding.quantity} @ $
                    {holding.averageCost.toFixed(2)}/per share
                </p>
                <p>Cost basis: ${costBasis.toFixed(2)}</p>
                {isLoading && <p>Loading current price...</p>}
                {error !== null && <p className='text-destructive'>{error}</p>}
                {!isLoading && error == null && currentPrice !== null && (
                    <p>Current price: ${currentPrice.toFixed(2)}</p>
                )}
                {marketValue !== null && (
                    <p>Market value: ${marketValue.toFixed(2)}</p>
                )}
                {unrealizedPL !== null && (
                    <p
                        className={
                            unrealizedPL > 0
                                ? 'text-green-500'
                                : unrealizedPL < 0
                                  ? 'text-destructive'
                                  : ''
                        }
                    >
                        Unrealized P/L: ${unrealizedPL.toFixed(2)}
                        {returnPercentage !== null && (
                            <> ({returnPercentage.toFixed(2)}%)</>
                        )}
                    </p>
                )}
                <div className='flex gap-3 border-t pt-4 justify-around'>
                    <Button
                        className='flex-1'
                        disabled={
                            isLoading || error !== null || currentPrice === null
                        }
                        onClick={() => {
                            if (currentPrice === null) return;

                            onOpenTrade({
                                symbol: holding.symbol,
                                price: currentPrice,
                                mode: 'Buy',
                            });
                        }}
                    >
                        BUY
                    </Button>
                    <Button
                        className='flex-1'
                        variant={'outline'}
                        disabled={
                            isLoading || error !== null || currentPrice === null
                        }
                        onClick={() => {
                            if (currentPrice === null) return;

                            onOpenTrade({
                                symbol: holding.symbol,
                                price: currentPrice,
                                maxSell: holding.quantity,
                                mode: 'Sell',
                            });
                        }}
                    >
                        SELL
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
