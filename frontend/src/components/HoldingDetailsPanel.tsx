import type { Holding } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useEffect, useState } from 'react';

type HoldingDetailsPanelProps = {
    holding: Holding;
};

export default function HoldingDetailsPanel({
    holding,
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
                <CardTitle>{holding.symbol} Details</CardTitle>
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
            </CardContent>
        </Card>
    );
}
