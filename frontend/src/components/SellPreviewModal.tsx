import type { SellPreview } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

type SellPreviewModalProps = {
    preview: SellPreview | null;
    onCancel: () => void;
    onConfirm: () => void;
    isSelling: boolean;
    tradeError: string | null;
};

export default function SellPreviewModal({
    preview,
    onCancel,
    onConfirm,
    isSelling,
    tradeError,
}: SellPreviewModalProps) {
    if (preview == null) {
        return null;
    }
    return (
        <Dialog
            open={preview !== null}
            onOpenChange={(open) => {
                if (!open && !isSelling) onCancel();
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Sale Preview</DialogTitle>
                    <DialogDescription>
                        Review your estimated sale proceeds. The execution price
                        may change before confirmation
                    </DialogDescription>
                </DialogHeader>
                <div className='space-y-6 py-4'>
                    <div className='text-center'>
                        <p className='text-sm text-muted-foreground'>
                            Estimated proceeds
                        </p>
                        <p className='mt-2 text-4xl font-semibold tracking-tight'>
                            {preview.estimatedProceeds.toLocaleString('en-US', {
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
                    <Button onClick={onCancel} variant={'outline'}>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} disabled={isSelling}>
                        {isSelling ? 'Selling' : 'Confirm Sale'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
