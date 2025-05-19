import type { Position } from './types';

interface PositionListProps {
  positions: Position[];
}

export function PositionList({ positions }: PositionListProps) {
  if (!positions || positions.length === 0) return null;
  const hasMultiplePositions = positions.length > 1;
  return (
    <div className="space-y-1">
      {positions.map((position, index) => (
        <div key={index} className="flex justify-between items-center">
          <h4 className="font-medium tracking-tight">
            {position.title}
          </h4>
          {hasMultiplePositions && (
            <span className="text-xs whitespace-nowrap ml-4 tracking-tight">
              {position.period}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
