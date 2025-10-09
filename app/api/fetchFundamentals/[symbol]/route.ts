// app/api/fetchFundamentals/[symbol]/route.ts
import { NextResponse } from "next/server";
import { getFundamentalAnalysis } from "@/utils/fundamental";

export async function GET(req: Request, { params }: { params: { symbol: string } }) {
    try {
        const symbol = params.symbol.toUpperCase();
        const data = await getFundamentalAnalysis(symbol);
        return NextResponse.json(data);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
