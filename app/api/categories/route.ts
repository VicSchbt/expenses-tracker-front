 import type { NextRequest } from 'next/server';
 import { NextResponse } from 'next/server';

 const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

 export async function GET(request: NextRequest) {
   try {
     const authHeader = request.headers.get('authorization');
     if (!authHeader) {
       return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
     }

     const url = `${API_BASE_URL}/categories`;

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

 export async function POST(request: NextRequest) {
   try {
     const authHeader = request.headers.get('authorization');
     if (!authHeader) {
       return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
     }

     const body = await request.json();
     const url = `${API_BASE_URL}/categories`;

     const response = await fetch(url, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         Authorization: authHeader,
       },
       body: JSON.stringify(body),
     });

     const data = await response.json();
     return NextResponse.json(data, { status: response.status });
   } catch (error) {
     return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
   }
 }

