export const parseIsPublic = (isPublic: string) => {
  if (isPublic === 'oui') return true
  if (isPublic === 'non') return false
  return undefined
}
