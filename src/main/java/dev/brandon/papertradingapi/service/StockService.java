package dev.brandon.papertradingapi.service;

import dev.brandon.papertradingapi.model.Quote;
import dev.brandon.papertradingapi.model.StockPrice;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.client.RestClient;

@Service
public class StockService {

    private final RestClient restClient;
    private final String apiKey;

    public StockService(@Value("${twelvedata.api.key}") String apiKey) {
        this.restClient = RestClient.create();
        this.apiKey = apiKey;
    }

    public Quote getQuote(String symbol) {
        return restClient.get()
                .uri("https://api.twelvedata.com/quote?symbol=" + symbol + "&apikey=" + apiKey)
                .retrieve()
                .body(Quote.class);
    }

    public StockPrice getPrice(String symbol) {
        return restClient.get()
                .uri("https://api.twelvedata.com/price?symbol=" + symbol + "&apikey=" + apiKey)
                .retrieve()
                .body(StockPrice.class);
    }
}