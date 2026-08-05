export function nextPosition(existingCount: number): number {
  return existingCount;
}

export function positionsFromOrder(orderedIds: string[]): { id: string; position: number }[] {
  return orderedIds.map((id, position) => ({ id, position }));
}
