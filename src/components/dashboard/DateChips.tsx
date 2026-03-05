import { Button } from "@/components/ui/button";

interface DateChipsProps {
  chips: string[];
  selectedChip: string;
  onChipSelect: (chip: string) => void;
}

export function DateChips({ chips, selectedChip, onChipSelect }: DateChipsProps) {
  return (
    <div className="flex gap-2 mb-6">
      {chips.map((chip) => (
        <Button
          key={chip}
          size="sm"
          variant={selectedChip === chip ? "default" : "outline"}
          onClick={() => onChipSelect(chip)}
          className="text-xs h-8"
        >
          {chip}
        </Button>
      ))}
    </div>
  );
}
