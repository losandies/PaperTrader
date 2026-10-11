import type { BuyPreview, StockQuote } from '@/types';
import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RxCaretDown, RxCaretUp } from 'react-icons/rx';
import { useBuyStock } from '@/hooks/useBuyStock';
import BuyPreviewModal from './BuyPreviewModal';

type StockSearchProps = {
    onTradeSuccess: () => void;
};

export default function StockSearch({ onTradeSuccess }: StockSearchProps) {
    const { buyStock, tradeError, isBuying } = useBuyStock(onTradeSuccess);

    const [symbol, setSymbol] = useState<string>('');
    const [quote, setQuote] = useState<StockQuote | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const [buyPreview, setBuyPreview] = useState<BuyPreview | null>(null);

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

    const confirmBuy = async (): Promise<void> => {
        if (buyPreview == null || isBuying) return;

        const succeeded = await buyStock(
            buyPreview.symbol,
            buyPreview.quantity,
        );

        if (succeeded) {
            setBuyPreview(null);
            setQuantity(1);
        }
    };
    return (
        <Card className='min-h-40 self-start'>
            <CardHeader>
                <CardTitle>
                    <h2>Stock Lookup</h2>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <BuyPreviewModal
                    preview={buyPreview}
                    onCancel={() => setBuyPreview(null)}
                    onConfirm={confirmBuy}
                    isBuying={isBuying}
                    tradeError={tradeError}
                />
                <div className='space-y-2'>
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
                        <div className='flex mt-4 space-y-4 border-t pt-4 justify-between'>
                            <div className='flex-col space-y-2'>
                                <div className='space-y-1'>
                                    <h3 className='font-medium'>
                                        {quote.name}
                                    </h3>
                                    <p className='text-sm text-muted-foreground'>
                                        {quote.symbol} · {quote.exchange}
                                    </p>
                                </div>
                                <div className='flex items-baseline gap-3'>
                                    <p className='text-xl font-semibold'>
                                        ${quote.close.toFixed(2)}
                                    </p>
                                    <p
                                        className={
                                            quote.percent_change > 0
                                                ? 'text-green-500'
                                                : quote.percent_change < 0
                                                  ? 'text-destructive'
                                                  : ''
                                        }
                                    >
                                        {quote.percent_change.toFixed(2)}%
                                    </p>
                                </div>
                            </div>

                            <div className='flex w-full items-center justify-center ml-30 space-x-6'>
                                <div>
                                    <button
                                        type='button'
                                        aria-label='Increase quantity'
                                        className='flex h-6 w-9 items-center justify-center p-0 cursor-pointer'
                                        onClick={() =>
                                            setQuantity((q) => q + 1)
                                        }
                                    >
                                        <RxCaretUp className='text-4xl text-gray-300 hover:text-black' />
                                    </button>
                                    <button
                                        type='button'
                                        aria-label='Dncrease quantity'
                                        className='flex h-6 w-9 items-center justify-center p-0 cursor-pointer'
                                        onClick={() =>
                                            setQuantity((q) =>
                                                Math.max(1, q - 1),
                                            )
                                        }
                                    >
                                        <RxCaretDown className='text-4xl text-gray-300 hover:text-black' />
                                    </button>
                                </div>
                                <h2 className='text-3xl'>{quantity}</h2>
                                <Button
                                    variant={'outline'}
                                    className='w-18 h-10 ml-2 cursor-pointer'
                                    onClick={() => {
                                        setBuyPreview({
                                            symbol: quote.symbol,
                                            quantity,
                                            price: quote.close,
                                            estimatedCost:
                                                quantity * quote.close,
                                        });
                                    }}
                                >
                                    BUY
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
