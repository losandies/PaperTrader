import { useState } from 'react';
import type { TradeSelection } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { RxCaretDown, RxCaretUp } from 'react-icons/rx';
import { useBuyStock } from '@/hooks/useBuyStock';
import { useSellStock } from '@/hooks/useSellStock';
import BuyPreviewModal from './BuyPreviewModal';
import SellPreviewModal from './SellPreviewModal';

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
    const {
        previewBuy,
        buyStock,
        buyPreview,
        cancelPreview: cancelBuyPreview,
        isBuying,
        tradeError: buyError,
    } = useBuyStock(onTradeSuccess);
    const {
        previewSell,
        sellStock,
        sellPreview,
        cancelPreview: cancelSellPreview,
        tradeError: sellError,
        isSelling,
    } = useSellStock(onTradeSuccess);

    const [quantity, setQuantity] = useState<number>(1);

    const isBusy = isBuying || isSelling;

    const openPreview = (): void => {
        if (isBusy) return;

        if (selection.mode === 'Sell') {
            previewSell(selection.symbol, quantity);
        } else {
            previewBuy(selection.symbol, quantity, selection.price);
        }
    };

    const confirmBuy = async (): Promise<void> => {
        if (buyPreview === null || isBusy) return;

        const succeeded = await buyStock();

        if (succeeded) {
            onClose();
        }
    };

    const confirmSell = async (): Promise<void> => {
        if (sellPreview === null || isBusy) return;

        const succeeded = await sellStock();

        if (succeeded) {
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
                    <div className='relative shrink-0'>
                        <div className='flex items-center'>
                            <div className='flex flex-col'>
                                <button
                                    type='button'
                                    aria-label='Increase quantity'
                                    className='flex h-6 w-9 items-center justify-center p-0 cursor-pointer'
                                    onClick={() => setQuantity((q) => q + 1)}
                                    disabled={isBusy}
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
                                    disabled={isBusy}
                                >
                                    <RxCaretDown className='text-4xl text-gray-300 hover:text-foreground' />
                                </button>
                            </div>
                            <p
                                className='text-3xl w-20 shrink-0 text-center tabular-nums'
                                aria-label={`${quantity} shares`}
                            >
                                {quantity}
                            </p>
                            <Button
                                variant='outline'
                                className='w-18 h-10'
                                disabled={isBusy}
                                onClick={openPreview}
                            >
                                {selection.mode.toUpperCase()}
                            </Button>
                        </div>
                        {selection.mode === 'Sell' && (
                            <Button
                                className='absolute top-full left-0 mt-2 w-full'
                                disabled={
                                    isBusy || selection.maxSell === undefined
                                }
                                onClick={() => {
                                    if (selection.maxSell === undefined) return;
                                    previewSell(
                                        selection.symbol,
                                        selection.maxSell,
                                    );
                                }}
                            >
                                Sell All
                            </Button>
                        )}
                    </div>
                </div>
                {sellPreview === null && sellError !== null && (
                    <p role='alert' className='text-destructive'>
                        {sellError}
                    </p>
                )}
                <Button
                    type='button'
                    variant='outline'
                    onClick={onClose}
                    disabled={isBusy}
                >
                    Close
                </Button>
            </CardContent>
            <BuyPreviewModal
                preview={buyPreview}
                onCancel={cancelBuyPreview}
                tradeError={buyError}
                onConfirm={confirmBuy}
                isBuying={isBuying}
            />
            <SellPreviewModal
                preview={sellPreview}
                onCancel={cancelSellPreview}
                tradeError={sellError}
                onConfirm={confirmSell}
                isSelling={isSelling}
            />
        </Card>
    );
}
