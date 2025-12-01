import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    const queryParams = new URLSearchParams();
    if (page) {
      queryParams.append('page', page);
    }
    if (limit) {
      queryParams.append('limit', limit);
    }
    if (year) {
      queryParams.append('year', year);
    }
    if (month) {
      queryParams.append('month', month);
    }

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/transactions/bills${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}

