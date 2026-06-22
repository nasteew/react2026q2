import { NextRequest, NextResponse } from 'next/server';

interface SelectedItem {
  id: string;
  name: string;
  types: string;
  height: number;
  weight: number;
  abilities: string;
  baseExperience: number;
  url: string;
}

function toCsv(items: SelectedItem[]): string {
  const separator = ';';
  const header = [
    'id',
    'name',
    'types',
    'height',
    'weight',
    'abilities',
    'base_experience',
    'url',
  ].join(separator);

  const rows = items.map((i) =>
    [
      i.id,
      i.name,
      i.types,
      i.height,
      i.weight,
      i.abilities,
      i.baseExperience,
      i.url,
    ]
      .map((val) => `"${String(val).replace(/"/g, '""')}"`)
      .join(separator)
  );

  return '\uFEFF' + [header, ...rows].join('\n');
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const formData = await request.formData();
  const raw = formData.get('items');

  let items: SelectedItem[] = [];
  try {
    items = raw ? (JSON.parse(String(raw)) as SelectedItem[]) : [];
  } catch {
    items = [];
  }

  const csv = toCsv(items);

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv;charset=utf-8',
      'Content-Disposition': `attachment; filename="${items.length}_items.csv"`,
    },
  });
}
