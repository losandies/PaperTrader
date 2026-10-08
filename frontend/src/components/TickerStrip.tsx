import type { TickerPrice } from '@/types';
import { useState } from 'react';
import { Button } from './ui/button';

const symbols = ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'GOOGL'];

const samplePrices: TickerPrice[] = [
    { symbol: 'AAPL', price: 200 },
    { symbol: 'MSFT', price: 400 },
    { symbol: 'NVDA', price: 150 },
    { symbol: 'AMZN', price: 220 },
    { symbol: 'GOOGL', price: 180 },
    { symbol: 'META', price: 580 },
    { symbol: 'TSLA', price: 250 },
    { symbol: 'NFLX', price: 110 },
    { symbol: 'AMD', price: 160 },
    { symbol: 'INTC', price: 25 },
    { symbol: 'JPM', price: 240 },
    { symbol: 'V', price: 320 },
    { symbol: 'WMT', price: 95 },
    { symbol: 'DIS', price: 115 },
    { symbol: 'KO', price: 65 },
];

export default function TickerStrip() {
    const [tickerPrice, setTickerPrice] = useState<TickerPrice[]>(samplePrices);
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
    return (
        <>
            <p className='text-sm text-muted-foreground'>Sample prices</p>
            <div className='overflow-hidden border-b py-3'>
                <div className='ticker-track flex w-max'>
                    <div className='flex shrink-0 gap-6 pr-6'>
                        {samplePrices.map((ticker) => (
                            <span
                                key={ticker.symbol}
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
                        {samplePrices.map((ticker) => (
                            <span
                                key={ticker.symbol}
                                className='shrink-0 text-gray-400'
                            >
                                {ticker.symbol}: ${ticker.price.toFixed(2)}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <Button disabled onClick={loadPrices}>
                {isLoading ? 'Loading...' : 'Load Prices'}
            </Button>
            {error && <h2>{error}</h2>}
        </>
    );
}
