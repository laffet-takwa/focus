import { FloatingDoc } from "./floating-doc";

export function Floating() {
  return (
    <div className="h-[6rem] flex items-center justify-center w-full">
      <FloatingDoc mobileClassName="translate-y-20" />
    </div>
  );
}