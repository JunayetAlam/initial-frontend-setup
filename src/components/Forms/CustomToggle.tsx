"use client";

import { cn } from "@/lib/utils";
import { Controller, useFormContext } from "react-hook-form";
import { Switch } from "@/components/ui/switch";

type TToggleProps = {
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
};

export default function CustomToggle({
  name,
  label,
  disabled,
  className,
  labelClassName,
}: TToggleProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <div className={cn("flex items-center justify-between", className)}>
            {label && (
              <label
                className={cn(
                  "text-sm font-semibold md:text-sm",
                  labelClassName,
                )}
              >
                {label}
              </label>
            )}

            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />

            {errors?.[name] && (
              <small className="text-sm text-red-500">
                {errors?.[name]?.message as string}
              </small>
            )}
          </div>
        );
      }}
    />
  );
}
