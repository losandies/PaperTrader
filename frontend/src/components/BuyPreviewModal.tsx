import type { BuyPreview } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

type BuyPreviewModalProps = {
    preview: BuyPreview | null;
    onCancel: () => void;
    onConfirm: () => void;
    isBuying: boolean;
    tradeError: string | null;
};

export default function BuyPreviewModal({
    preview,
    onCancel,
    onConfirm,
    isBuying,
    tradeError,
}: BuyPreviewModalProps) {
    if (preview == null) {
        return null;
    }
    return (
        <Dialog
            open={preview !== null}
            onOpenChange={(open) => {
                if (!open && !isBuying) onCancel();
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Order Review</DialogTitle>
                    <DialogDescription>
                        Review your estimated cost for the order. The execution
                        price may change before confirmation
                    </DialogDescription>
                </DialogHeader>
                <div className='space-y-6 py-4'>
                    <div className='text-center'>
                        <p className='text-sm text-muted-foreground'>
                            Estimated cost
                        </p>
                        <p className='mt-2 text-4xl font-semibold tracking-tight'>
                            {preview.estimatedCost.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            })}
                        </p>
                    </div>

                    <div className='grid grid-cols-2 gap-4 rounded-lg bg-muted p-4'>
                        <div>
                            <p className='text-sm text-muted-foreground'>
                                Symbol
                            </p>
                            <p className='font-medium'>{preview.symbol}</p>
                        </div>
                        <div>
                            <p className='text-sm text-muted-foreground'>
                                Shares
                            </p>
                            <p className='font-medium'>{preview.quantity}</p>
                        </div>
                        <div className='col-span-2'>
                            <p className='text-sm text-muted-foreground'>
                                Price per share
                            </p>
                            <p className='font-medium'>
                                ${preview.price.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
                {tradeError !== null && (
                    <p className='text-sm text-destructive'>{tradeError}</p>
                )}
                <DialogFooter>
                    <Button
                        onClick={onCancel}
                        variant={'outline'}
                        disabled={isBuying}
                    >
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} disabled={isBuying}>
                        {isBuying ? 'Buying...' : 'Confirm Purchase'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
