import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ProductCategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function ProductCategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange
}: ProductCategoryFilterProps) {
  return (
    <div className="w-48 shrink-0">
      <h3 className="text-sm font-semibold mb-3">카테고리</h3>
      <RadioGroup value={selectedCategory} onValueChange={onCategoryChange}>
        {categories.map((cat) => (
          <div key={cat} className="flex items-center gap-2 py-1">
            <RadioGroupItem value={cat} id={`cat-${cat}`} />
            <Label htmlFor={`cat-${cat}`} className="text-sm cursor-pointer">{cat}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
