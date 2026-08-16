import { BREAKPOINTS } from './GlobalWorkersStyles'

export function layoutFixes(
  classes: readonly string[],
  width: number
): object[] {
  const desktop = width >= BREAKPOINTS.desktop
  const tablet = width >= BREAKPOINTS.tablet
  const result: object[] = []

  const row = [
    'hero-numbers',
    'job-card-head',
    'job-meta',
    'job-actions',
    'tag-row',
    'detail-header',
    'mini-company',
    'review-head',
    'moderation-head',
    'between',
    'monthly-close',
    'toolbar',
    'page-title-actions',
    'form-actions',
    'attendance-hero',
    'clock-actions',
    'offer-head',
    'offer-details',
    'profile-cover',
    'candidate-mini',
    'evidence-box',
    'export-preview',
    'top-actions'
  ]
  if (classes.some(c => row.includes(c)))
    result.push({ flexDirection: 'row', alignItems: 'center', gap: 10 })
  if (
    classes.some(c =>
      ['tag-row', 'job-meta', 'toolbar', 'page-title-actions'].includes(c)
    )
  )
    result.push({ flexWrap: 'wrap' })
  if (classes.includes('section-heading'))
    result.push(
      desktop
        ? {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }
        : { flexDirection: 'column', alignItems: 'stretch' }
    )
  if (classes.includes('hero') || classes.includes('hero-search'))
    result.push(
      desktop ? { flexDirection: 'row' } : { flexDirection: 'column' }
    )
  if (
    classes.some(c =>
      [
        'job-grid',
        'feature-strip',
        'stats-grid',
        'pricing-grid',
        'document-grid',
        'permission-grid'
      ].includes(c)
    )
  ) {
    result.push({ flexDirection: 'row', flexWrap: 'wrap' })
  }
  if (
    classes.some(c =>
      [
        'search-layout',
        'detail-layout',
        'two-col',
        'review-summary',
        'contact-layout',
        'document-layout',
        'settings-layout',
        'role-grid',
        'org-layout',
        'editor-layout',
        'dashboard-grid'
      ].includes(c)
    )
  ) {
    result.push(
      desktop ? { flexDirection: 'row' } : { flexDirection: 'column' }
    )
  }
  if (classes.includes('form-grid'))
    result.push(
      tablet
        ? { flexDirection: 'row', flexWrap: 'wrap' }
        : { flexDirection: 'column' }
    )
  if (classes.includes('detail-facts'))
    result.push({ flexDirection: 'row', flexWrap: 'wrap' })
  if (classes.includes('message') && classes.includes('mine'))
    result.push({ alignSelf: 'flex-end' })
  return result
}
