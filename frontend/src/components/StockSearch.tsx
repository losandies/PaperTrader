import type { StockQuote } from '@/types';
import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export default function StockSearch() {
    const [symbol, setSymbol] = useState<string>('');
    const [quote, setQuote] = useState<StockQuote | null>(null);
    const [error, setError] = useState<string | null>(null);

    const lookupStock = (): void => {
        setError(null);
        setQuote(null);

        const symbolToSearch = symbol.trim().toUpperCase();

        fetch(
            `http://localhost:8080/stocks/${encodeURIComponent(symbolToSearch)}`,
        )
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((message) => {
                        throw new Error(message || 'Unable to look up stock');
                    });
                }

                return response.json();
            })
            .then((data) => setQuote(data))
            .catch((error: unknown) =>
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Unable to look up stock',
                ),
            );
    };

    return (
        <div className={'space-y-2'}>
            <h2>Stock Lookup</h2>
            <Input
                placeholder={'Symbol'}
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
            />
            <Button className={'w-full'} onClick={lookupStock}>
                Search
            </Button>

            {error !== null && (
                <div>
                    <p className='text-destructive'>{error}</p>
                </div>
            )}
            {quote !== null && (
                <div>
                    <h3>{quote.name}</h3>
                    <p>
                        {quote.symbol} · {quote.exchange}
                    </p>
                    <p>Quote price: ${quote.close.toFixed(2)}</p>
                    <p>Change: {quote.percent_change.toFixed(2)}%</p>
                </div>
            )}
        </div>
    );
}
