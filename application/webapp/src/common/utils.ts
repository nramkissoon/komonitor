export function percentile(values: number[], perc: number) {
  values.sort();
  const index = Math.ceil((perc / 100) * values.length);
  return values.at(index - 1);
}
