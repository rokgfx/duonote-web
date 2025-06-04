interface DividerProps {
  className?: string;
}

export default function Divider({ className = "w-full h-1 bg-accent mt-2 mb-2" }: DividerProps) {
  return <div className={className}></div>;
}