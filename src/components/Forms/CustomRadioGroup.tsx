"use client";

import { Label } from "@/components/ui/label";
import {
  RadioGroup as ShadCNRadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

type TRadioOption = {
  label: string;
  value: string;
};

type CustomRadioGroupProps = {
  name: string;
  label?: string;
  options: TRadioOption[];
  required?: boolean;
  className?: string;
  disabled?: boolean;
};

const CustomRadioGroup = ({
  name,
  label,
  options,
  required,
  className,
  disabled = false,
}: CustomRadioGroupProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={name} className="mb-2">
          {label} {required && <span className="text-red-500"> *</span>}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `${label || name} is required` : false,
        }}
        render={({ field: { onChange, value, ref } }) => (
          <ShadCNRadioGroup
            onValueChange={onChange}
            value={value ?? ""} // ✅ Prevents "undefined" → controlled error
            ref={ref}
            disabled={disabled}
            className="flex flex-wrap gap-2"
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${name}-${option.value}`}
                  disabled={disabled}
                />
                <Label
                  htmlFor={`${name}-${option.value}`}
                  className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </ShadCNRadioGroup>
        )}
      />

      {errors[name] && (
        <small className="mt-1 block text-sm text-red-500">
          {errors[name]?.message as string}
        </small>
      )}
    </div>
  );
};

export default CustomRadioGroup;
