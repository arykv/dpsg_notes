export interface ToolMeta {
  id: string
  name: string
  blurb: string
  keywords: string
}

/**
 * The calculators, described once. The page renders from this list and the
 * command palette searches it, so a new tool shows up in both by adding a
 * component and one entry here.
 */
export const TOOLS: ToolMeta[] = [
  {
    id: 'percentage',
    name: 'Percentage & best of five',
    blurb: 'Enter your marks, get the aggregate CBSE actually prints on the certificate.',
    keywords: 'percentage marks aggregate best of five result total average',
  },
  {
    id: 'target',
    name: 'Target marks',
    blurb: 'Know the percentage you want? Find out what the last paper has to score.',
    keywords: 'target goal needed required marks final exam boards how much',
  },
  {
    id: 'attendance',
    name: 'Attendance',
    blurb: 'How many classes you can miss before 75% stops being possible.',
    keywords: 'attendance bunk skip classes 75 percent shortage eligible',
  },
  {
    id: 'grade',
    name: 'Grade points',
    blurb: 'Marks to CBSE grade points, and the CGPA they add up to.',
    keywords: 'cgpa gpa grade points a1 a2 b1 conversion 9.5 percentage',
  },
  {
    id: 'countdown',
    name: 'Exam countdown',
    blurb: 'Days left, and what that means in study sessions rather than dates.',
    keywords: 'countdown days left exam boards timer deadline revision plan',
  },
  {
    id: 'units',
    name: 'Unit converter',
    blurb: 'The conversions physics and chemistry papers assume you know.',
    keywords: 'unit converter si metric energy pressure length mass temperature joule',
  },
]
