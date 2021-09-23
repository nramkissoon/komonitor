export function percentile(values: number[], perc: number) {
  values = values.filter((value) => value !== -1); // REQUIRED BECAUSE -1 REPRESENTS NO RESPONSE / FAILURE
  values.sort((a, b) => a - b);
  const index = Math.ceil((perc / 100) * values.length);
  return values.at(index - 1);
}
