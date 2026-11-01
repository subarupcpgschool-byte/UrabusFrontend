import type { CompanySearchItem } from '@/components/search/types';

/** Search result snapshots also allow map results to open their known basic data. */
export function companyHref(company: CompanySearchItem) {
  return { pathname: '/companies/[id]' as const, params: { id: String(company.id), snapshot: JSON.stringify(company) } };
}
export function parseCompanySnapshot(raw: string | undefined, id: string): CompanySearchItem | undefined {
  if (!raw || raw.length > 50000) return;
  try {
    const item = JSON.parse(raw);
    if (String(item.id) !== id || typeof item.companyName !== 'string' || typeof item.location !== 'string') return;
    return { id, companyName: item.companyName, location: item.location,
      mark: item.companyName.slice(0,1), markColor: '#2563EB', industry: typeof item.industry==='string'?item.industry:'',
      description: typeof item.description==='string'?item.description:'', rating:0,reviewCount:0,openJobCount:0,reviewParticipationRate:0,employeeRange:typeof item.employeeRange==='string'?item.employeeRange:'',scores:[] };
  } catch { return; }
}
