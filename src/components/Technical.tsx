"use client";

import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    ComposedChart,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
    Line,
    CartesianGrid,
} from "recharts";

interface TechnicalData {
    historical: {
        dates: string[];
        opens: number[];
        highs: number[];
        lows: number[];
        closes: number[];
        volumes: number[];
    };
    indicators: {
        rsi: number[];
        sma20: number[];
        ema20: number[];
        macd: { MACD: number; signal: number; histogram: number }[];
        bb: { lower: number; middle: number; upper: number }[];
        stoch: { k: number; d: number }[];
        atr: number[];
        williamsR: number[];
        cci: number[];
        obv: number[];
    };
}

export default function StockChart({ symbol }: { symbol: string }) {
    const [data, setData] = useState<TechnicalData | null>(null);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`/api/technical/${symbol}`);
            const json = await res.json();
            setData(json);

            const combined = json.historical.dates.map((date, i) => ({
                date: date.slice(0, 10),
                open: json.historical.opens[i],
                high: json.historical.highs[i],
                low: json.historical.lows[i],
                close: json.historical.closes[i],
                volume: json.historical.volumes[i],
                sma20: i >= json.historical.dates.length - json.indicators.sma20.length
                    ? json.indicators.sma20[i - (json.historical.dates.length - json.indicators.sma20.length)]
                    : null,
                ema20: i >= json.historical.dates.length - json.indicators.ema20.length
                    ? json.indicators.ema20[i - (json.historical.dates.length - json.indicators.ema20.length)]
                    : null,
                rsi: i >= json.historical.dates.length - json.indicators.rsi.length
                    ? json.indicators.rsi[i - (json.historical.dates.length - json.indicators.rsi.length)]
                    : null,
                macd: i >= json.historical.dates.length - json.indicators.macd.length
                    ? json.indicators.macd[i - (json.historical.dates.length - json.indicators.macd.length)].MACD
                    : null,
                signal: i >= json.historical.dates.length - json.indicators.macd.length
                    ? json.indicators.macd[i - (json.historical.dates.length - json.indicators.macd.length)].signal
                    : null,
                bb_upper: i >= json.historical.dates.length - json.indicators.bb.length
                    ? json.indicators.bb[i - (json.historical.dates.length - json.indicators.bb.length)].upper
                    : null,
                bb_middle: i >= json.historical.dates.length - json.indicators.bb.length
                    ? json.indicators.bb[i - (json.historical.dates.length - json.indicators.bb.length)].middle
                    : null,
                bb_lower: i >= json.historical.dates.length - json.indicators.bb.length
                    ? json.indicators.bb[i - (json.historical.dates.length - json.indicators.bb.length)].lower
                    : null,
                stoch_k: i >= json.historical.dates.length - json.indicators.stoch.length
                    ? json.indicators.stoch[i - (json.historical.dates.length - json.indicators.stoch.length)].k
                    : null,
                stoch_d: i >= json.historical.dates.length - json.indicators.stoch.length
                    ? json.indicators.stoch[i - (json.historical.dates.length - json.indicators.stoch.length)].d
                    : null,
                atr: i >= json.historical.dates.length - json.indicators.atr.length
                    ? json.indicators.atr[i - (json.historical.dates.length - json.indicators.atr.length)]
                    : null,
                williamsR: i >= json.historical.dates.length - json.indicators.williamsR.length
                    ? json.indicators.williamsR[i - (json.historical.dates.length - json.indicators.williamsR.length)]
                    : null,
                cci: i >= json.historical.dates.length - json.indicators.cci.length
                    ? json.indicators.cci[i - (json.historical.dates.length - json.indicators.cci.length)]
                    : null,
                obv: i >= json.historical.dates.length - json.indicators.obv.length
                    ? json.indicators.obv[i - (json.historical.dates.length - json.indicators.obv.length)]
                    : null,
            }));

            setChartData(combined);
        }

        fetchData();
    }, [symbol]);

    if (!data) return <p>Loading technical analysis...</p>;

    return (
        <div style={{ width: "100%", height: 1200 }}>
            <h2 className="text-lg font-semibold mb-2">{symbol} Technical Chart</h2>

            {/* Candlestick + SMA/EMA + Bollinger Bands */}
            <ResponsiveContainer height={300}>
                <ComposedChart data={chartData}>
                    <CartesianGrid stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" domain={["dataMin", "dataMax"]} />
                    <Tooltip />
                    <Bar
                        yAxisId="left"
                        dataKey="close"
                        fill="#4caf50"
                        shape={(props: any) => {
                            const { x, y, width, payload } = props;
                            const openY = y - (payload.open - payload.close);
                            const color = payload.close > payload.open ? "#4caf50" : "#f44336";
                            return (
                                <g>
                                    <line x1={x + width / 2} x2={x + width / 2} y1={y} y2={openY} stroke={color} strokeWidth={2} />
                                    <rect x={x} y={Math.min(y, openY)} width={width} height={Math.abs(openY - y) || 1} fill={color} />
                                </g>
                            );
                        }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="sma20" stroke="#0000ff" dot={false} />
                    <Line yAxisId="left" type="monotone" dataKey="ema20" stroke="#ff9900" dot={false} />
                    <Line yAxisId="left" type="monotone" dataKey="bb_upper" stroke="#8884d8" dot={false} />
                    <Line yAxisId="left" type="monotone" dataKey="bb_middle" stroke="#aaaaaa" dot={false} />
                    <Line yAxisId="left" type="monotone" dataKey="bb_lower" stroke="#8884d8" dot={false} />
                </ComposedChart>
            </ResponsiveContainer>

            {/* RSI */}
            <h3 className="text-md font-medium mt-4">RSI</h3>
            <ResponsiveContainer height={150}>
                <ComposedChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="rsi" stroke="#ff00ff" dot={false} />
                </ComposedChart>
            </ResponsiveContainer>

            {/* MACD */}
            <h3 className="text-md font-medium mt-4">MACD</h3>
            <ResponsiveContainer height={150}>
                <ComposedChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="macd" stroke="#00f" dot={false} />
                    <Line type="monotone" dataKey="signal" stroke="#f00" dot={false} />
                </ComposedChart>
            </ResponsiveContainer>

            {/* Stochastic */}
            <h3 className="text-md font-medium mt-4">Stochastic %K / %D</h3>
            <ResponsiveContainer height={150}>
                <ComposedChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="stoch_k" stroke="#ff9900" dot={false} />
                    <Line type="monotone" dataKey="stoch_d" stroke="#0099ff" dot={false} />
                </ComposedChart>
            </ResponsiveContainer>

            {/* ATR */}
            <h3 className="text-md font-medium mt-4">ATR</h3>
            <ResponsiveContainer height={100}>
                <ComposedChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="atr" stroke="#00cc66" dot={false} />
                </ComposedChart>
            </ResponsiveContainer>

            {/* Williams %R */}
            <h3 className="text-md font-medium mt-4">Williams %R</h3>
            <ResponsiveContainer height={100}>
                <ComposedChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis domain={[-100, 0]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="williamsR" stroke="#ff6600" dot={false} />
                </ComposedChart>
            </ResponsiveContainer>

            {/* CCI */}
            <h3 className="text-md font-medium mt-4">CCI</h3>
            <ResponsiveContainer height={100}>
                <ComposedChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="cci" stroke="#6600ff" dot={false} />
                </ComposedChart>
            </ResponsiveContainer>

            {/* OBV */}
            <h3 className="text-md font-medium mt-4">OBV</h3>
            <ResponsiveContainer height={100}>
                <ComposedChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="obv" stroke="#ff0066" dot={false} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
