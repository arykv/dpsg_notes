/**
 * Where the old site's pages now live.
 *
 * The first version was a tree of hand-written HTML, and those links are still
 * sitting in class WhatsApp groups. Every one of them lands on the closest
 * equivalent here rather than a 404 — the whole point of the rebuild was that
 * nobody should have to hunt for a file twice.
 */
export const LEGACY_ROUTES: Record<string, string> = {
  '/index.html': '/',
  '/index2.html': '/',
  '/class.html': '/library',
  '/class11.html': '/library?grade=11',
  '/coming_soon.html': '/library',

  '/class11science.html': '/library?grade=11&stream=science',
  '/class11commerce.html': '/library?grade=11&stream=commerce',
  '/class11arts.html': '/library?grade=11&stream=arts',

  '/physics_student.html': '/library?subject=physics',
  '/chemistry_student.html': '/library?subject=chemistry',
  '/maths_student.html': '/library?subject=maths',
  '/computer_student.html': '/library?subject=computer-science',

  '/PhysicsUdayMultiple.html': '/library?subject=physics',
  '/Uday_Phy1.html': '/library/phy-11-uday-01',
  '/Uday_Phy2.html': '/library/phy-11-uday-02',
  '/Uday_Phy3.html': '/library/phy-11-uday-03',
  '/Uday_Phy4.html': '/library/phy-11-uday-04',
  '/Uday_Phy5.html': '/library/phy-11-uday-05',
  '/Uday_Chem.html': '/library/chem-11-uday-01',
  '/Uday_Maths.html': '/library/math-11-uday-01',
  '/Uday_Comp.html': '/library/cs-11-uday-01',
}

/** Case-insensitive lookup — shared links pick up all sorts of casing. */
export function legacyTarget(pathname: string): string | undefined {
  const key = Object.keys(LEGACY_ROUTES).find(
    (k) => k.toLowerCase() === pathname.toLowerCase(),
  )
  return key ? LEGACY_ROUTES[key] : undefined
}
