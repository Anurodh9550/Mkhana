import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { TRACK_STEPS, stepState } from "@/lib/tracking";
import type { OrderStatus } from "@/types";

export function ShipmentStepper({ status }: { status: OrderStatus }) {
  return (
    <ol className="hidden md:flex">
      {TRACK_STEPS.map((step, i) => {
        const state = stepState(status, step.key);
        const done = state === "done" || state === "current";
        return (
          <li key={step.key} className="flex min-w-0 flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <span className={cn("h-0.5 flex-1", i === 0 ? "bg-transparent" : done ? "bg-primary" : "bg-border")} />
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border-2 text-xs font-semibold",
                  state === "done" && "border-primary bg-primary text-primary-foreground",
                  state === "current" && "border-primary bg-primary text-primary-foreground ring-4 ring-primary/20",
                  (state === "upcoming" || state === "idle") && "border-border bg-card text-muted-foreground",
                )}
              >
                {state === "done" ? <Check className="size-4" strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={cn(
                  "h-0.5 flex-1",
                  i === TRACK_STEPS.length - 1 ? "bg-transparent" : state === "done" ? "bg-primary" : "bg-border",
                )}
              />
            </div>
            <p
              className={cn(
                "mt-2 px-1 text-center text-[11px] font-medium sm:text-xs",
                done ? "text-primary" : "text-muted-foreground",
              )}
            >
              {step.label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
