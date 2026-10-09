import type { TickerPrice } from '@/types';
import { useState } from 'react';
import { Button } from './ui/button';

const symbols = ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'GOOGL'];

export default function TickerStrip() {
    const [tickerPrice, setTickerPrice] = useState<TickerPrice[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const loadPrices = () => {
        setIsLoading(true);
        setError(null);
        const requests = symbols.map((symbol) => {
            return fetch(`http://localhost:8080/stocks/${symbol}/price`)
                .then((response) => {
                    if (!response.ok) {
                        return response.text().then((message) => {
                            throw new Error(
                                message || 'Unable to load ticker prices',
                            );
                        });
                    }

                    return response.json();
                })
                .then(
                    (data): TickerPrice => ({
                        symbol,
                        price: data.price,
                    }),
                );
        });
        Promise.all(requests)
            .then((prices) => setTickerPrice(prices))
            .catch((error: unknown) => {
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Unable to load ticker prices',
                );
            })
            .finally(() => setIsLoading(false));
    };

    const displayPrices = [...tickerPrice, ...tickerPrice, ...tickerPrice];

    return (
        <>
            {tickerPrice.length === 0 && (
                <p className='text-sm text-muted-foreground'>
                    {isLoading
                        ? 'Loading prices...'
                        : 'Load prices to display the ticker.'}
                </p>
            )}
            <div className='overflow-hidden border-b py-3'>
                <div className='ticker-track flex w-max'>
                    <div className='flex shrink-0 gap-6 pr-6'>
                        {displayPrices.map((ticker, index) => (
                            <span
                                key={`${ticker.symbol}-${index}`}
                                className='shrink-0 text-gray-400'
                            >
                                {ticker.symbol}: ${ticker.price.toFixed(2)}
                            </span>
                        ))}
                    </div>
                    <div
                        aria-hidden='true'
                        className='flex shrink-0 gap-6 pr-6'
                    >
                        {displayPrices.map((ticker, index) => (
                            <span
                                key={`${ticker.symbol}-${index}`}
                                className='shrink-0 text-gray-400'
                            >
                                {ticker.symbol}: ${ticker.price.toFixed(2)}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <Button className='mt-4' disabled={isLoading} onClick={loadPrices}>
                {isLoading ? 'Loading...' : 'Load Prices'}
            </Button>
            {error && <p role='alert'>{error}</p>}
        </>
    );
}
