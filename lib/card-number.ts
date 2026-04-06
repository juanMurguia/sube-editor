export const getCardNumberGroups = (rawNumber: string) => {
  const fallback = "0000 0000 0000 0000"
  const base = rawNumber && rawNumber.trim().length > 0 ? rawNumber : fallback
  const digits = base.replace(/\D/g, "")

  if (!digits) {
    return fallback.split(" ")
  }

  const groups = digits.match(/.{1,4}/g)
  return groups && groups.length > 0 ? groups : [digits]
}