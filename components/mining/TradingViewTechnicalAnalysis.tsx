'use client';

import React, { useEffect, useRef, memo } from 'react';

function TradingViewTechnicalAnalysis() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current || container.current.querySelector('script')) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "interval": "1m",
      "width": "100%",
      "isCurve": false,
      "colorTheme": "dark",
      "isTransparent": true,
      "symbol": "KUCOIN:BTCUSDT",
      "showIntervalTabs": true,
      "displayMode": "single",
      "locale": "en",
      "support_host": "https://www.tradingview.com"
    });
    container.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewTechnicalAnalysis);
