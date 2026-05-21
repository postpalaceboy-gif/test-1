import { useEffect, useState, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { toast } from "sonner";

interface PasswordGateProps {
  storageKey: string;
  password: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function PasswordGate({ storageKey, password, title, description, children }: PasswordGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(storageKey) === "1") {
      setUnlocked(true);
    }
  }, [storageKey]);

  if (unlocked) return <>{children}</>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === password) {
      sessionStorage.setItem(storageKey, "1");
      setUnlocked(true);
      toast.success("Access granted");
    } else {
      toast.error("Incorrect password");
      setValue("");
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <form onSubmit={submit} className="glass-strong rounded-2xl p-8 space-y-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
            <Lock className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-serif text-2xl leading-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gate-password">Password</Label>
          <Input
            id="gate-password"
            type="password"
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter password"
          />
        </div>
        <Button type="submit" className="w-full">Unlock</Button>
      </form>
    </div>
  );
}