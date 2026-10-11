import { useState } from 'react';
import type { BuyPreview, TradeSelection } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { RxCaretDown, RxCaretUp } from 'react-icons/rx';
import { useBuyStock } from '@/hooks/useBuyStock';
import BuyPreviewModal from './BuyPreviewModal';

type TradePanelProps = {
    selection: TradeSelection;
    onClose: () => void;
    onTradeSuccess: () => void;
};

export default function TradePanel({
    selection,
    onClose,
    onTradeSuccess,
}: TradePanelProps) {
    const [quantity, setQuantity] = useState<number>(1);
    const [buyPreview, setBuyPreview] = useState<BuyPreview | null>(null);
    const { buyStock, isBuying, tradeError } = useBuyStock(onTradeSuccess);

    const confirmBuy = async (): Promise<void> => {
        if (buyPreview === null || isBuying) return;

        const succeeded = await buyStock(
            buyPreview.symbol,
            buyPreview.quantity,
        );

        if (succeeded) {
            setBuyPreview(null);
            onClose();
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {selection.mode} {selection.symbol}
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='flex flex-wrap items-center justify-between gap-6'>
                    <div className='space-y-1'>
                        <p className='font-medium'>{selection.symbol}</p>
                        <p className='text-xl font-semibold'>
                            ${selection.price.toFixed(2)}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                            Reference price per share
                        </p>
                    </div>
                    <div className='flex shrink-0 items-center gap-6'>
                        <div className='flex flex-col'>
                            <button
                                type='button'
                                aria-label='Increase quantity'
                                className='flex h-6 w-9 items-center justify-center p-0 cursor-pointer'
                                onClick={() => setQuantity((q) => q + 1)}
                            >
                                <RxCaretUp className='text-4xl text-gray-300 hover:text-foreground' />
                            </button>
                            <button
                                type='button'
                                aria-label='Decrease quantity'
                                className='flex h-6 w-9 items-center justify-center p-0 cursor-pointer'
                                onClick={() =>
                                    setQuantity((q) => Math.max(1, q - 1))
                                }
                            >
                                <RxCaretDown className='text-4xl text-gray-300 hover:text-foreground' />
                            </button>
                        </div>
                        <p
                            className='text-3xl'
                            aria-label={`${quantity} shares`}
                        >
                            {quantity}
                        </p>
                        <Button
                            variant='outline'
                            className='w-18 h-10 ml-2'
                            disabled={isBuying || selection.mode === 'Sell'}
                            onClick={() => {
                                setBuyPreview({
                                    symbol: selection.symbol,
                                    quantity,
                                    price: selection.price,
                                    estimatedCost: quantity * selection.price,
                                });
                            }}
                        >
                            {selection.mode.toUpperCase()}
                        </Button>
                    </div>
                </div>
                <Button
                    type='button'
                    variant='outline'
                    onClick={onClose}
                    disabled={isBuying}
                >
                    Close
                </Button>
            </CardContent>
            <BuyPreviewModal
                preview={buyPreview}
                onCancel={() => setBuyPreview(null)}
                tradeError={tradeError}
                onConfirm={confirmBuy}
                isBuying={isBuying}
            />
        </Card>
    );
}
