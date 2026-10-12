export type Holding = {
    symbol: string;
    quantity: number;
    averageCost: number;
};

export type Portfolio = {
    cashBalance: number;
    holdings: Holding[];
};

export type SellPreview = {
    symbol: string;
    quantity: number;
    price: number;
    estimatedProceeds: number;
};

export type BuyPreview = {
    symbol: string;
    quantity: number;
    price: number;
    estimatedCost: number;
};

export type StockQuote = {
    symbol: string;
    name: string;
    exchange: string;
    currency: string;
    close: number;
    change: number;
    percent_change: number;
};

export type TickerPrice = {
    symbol: string;
    price: number;
};

export type TradeSelection = {
    symbol: string;
    price: number;
    maxSell?: number;
    mode: 'Buy' | 'Sell';
};
