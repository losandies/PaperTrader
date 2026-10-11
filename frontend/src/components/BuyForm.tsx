import { useState } from 'react';

type BuyFormProps = {
    onTradeSuccess: () => void;
};

export default function BuyForm({ onTradeSuccess }: BuyFormProps) {

    const [symbol, setSymbol] = useState<string>('');
    const [quantity, setQuantity] = useState<string>('');

    

    return <></>;
}
