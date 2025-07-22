// app/page.tsx
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="p-8">
      <Button variant="default" size="default">
        Click me
      </Button>
      <div className="p-8">
        <button className="bg-red-500 text-white px-4 py-2 rounded">
          Hello
        </button>
      </div>
    </div>
  );
}
