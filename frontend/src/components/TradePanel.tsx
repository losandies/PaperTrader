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
