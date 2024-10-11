"use client";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SunIcon, MoonIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="outline"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center space-x-2"
    >
      {theme === "dark" ? (
        <>
          <SunIcon className="h-5 w-5" />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <MoonIcon className="h-5 w-5" />
          <span>Dark Mode</span>
        </>
      )}
    </Button>
  );
}
