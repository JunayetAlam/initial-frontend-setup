"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

type TOption = {
  name: string;
  value: string;
  image?: string | StaticImageData;
  isDisabled?: boolean;
  disableText?: string;
};

type TOptionComboboxProps = {
  name: string;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  isError?: boolean;
  required?: boolean;
  disabled?: boolean;
  options: TOption[];
  mode?: "single" | "multiple"; // <-- new prop
  className?: string;
  labelClassName?: string;
  buttonClassName?: string;
  onSearchChange?: (value: string) => void;
  debounceMs?: number;
  extraFunction?: any;
};

export default function CustomComboBoxMultiple({
  name,
  label,
  isLoading = false,
  isError = false,
  placeholder = "Search options...",
  searchPlaceholder = "Search by option, currency, or code...",
  emptyMessage = "No option found.",
  required,
  disabled,
  options,
  mode = "multiple", // default to multiple
  className,
  labelClassName,
  buttonClassName,
  onSearchChange,
  extraFunction,
  debounceMs = 300,
}: TOptionComboboxProps) {
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleListWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Keep wheel scrolling inside dropdown list instead of bubbling to page/modal.
    e.stopPropagation();

    const el = e.currentTarget;
    if (el.scrollHeight <= el.clientHeight) return;

    const nextScrollTop = el.scrollTop + e.deltaY;
    const maxScrollTop = el.scrollHeight - el.clientHeight;
    const clampedScrollTop = Math.max(0, Math.min(nextScrollTop, maxScrollTop));

    if (clampedScrollTop !== el.scrollTop) {
      e.preventDefault();
      el.scrollTop = clampedScrollTop;
    }
  };

  // Debounce search
  useEffect(() => {
    if (!onSearchChange) return;

    const timer = setTimeout(() => {
      onSearchChange(searchValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchValue, debounceMs, onSearchChange]);

  const newOptions = options.map((option, index) => ({
    ...option,
    id: index,
  }));

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? "This field is required" : false }}
      defaultValue={mode === "multiple" ? [] : ""}
      render={({ field }) => {
        const selectedValues: string[] = Array.isArray(field.value)
          ? field.value
          : field.value
            ? [field.value]
            : [];

        let selectedOptions = options.filter((o) =>
          selectedValues.includes(o.value),
        );

        if (mode === "single") {
          selectedOptions = selectedOptions.slice(0, 1);
        }

        const toggleSelect = (value: string) => {
          if (mode === "multiple") {
            if (selectedValues.includes(value)) {
              field.onChange(selectedValues.filter((v) => v !== value));
            } else {
              field.onChange([...selectedValues, value]);
            }
            if (extraFunction) {
              extraFunction(
                value,
                getValues("drawDownTexts"),
                setValue,
                getValues,
              );
            }
          } else {
            field.onChange(value);
            setOpen(false); // close popover on single select
          }
        };

        return (
          <div className={cn("flex w-full flex-col space-y-2", className)}>
            {label && (
              <label className={cn("text-sm font-medium", labelClassName)}>
                {label}
              </label>
            )}

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={disabled}
                  className={cn(
                    "h-max min-h-[42px] w-full justify-between",
                    selectedValues.length === 0 && "text-muted-foreground",
                    buttonClassName,
                  )}
                >
                  {selectedValues.length ? (
                    <div className="z-10 flex flex-wrap gap-1">
                      {selectedOptions.map((item) => (
                        <div
                          key={item.value}
                          className="bg-muted flex items-center gap-1 rounded px-2 py-1.5 text-xs"
                        >
                          {item.image && (
                            <div className="relative h-4 w-6 overflow-hidden">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={24}
                                height={16}
                                className="object-cover"
                              />
                            </div>
                          )}
                          {item.name}
                          {mode === "multiple" && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSelect(item.value);
                              }}
                            >
                              <X className="z-10 h-3 w-3 cursor-pointer" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span>{placeholder}</span>
                  )}

                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandList
                    className="max-h-64 overflow-y-auto overscroll-contain"
                    onWheel={handleListWheel}
                  >
                    {isLoading ? (
                      <CommandItem>Loading...</CommandItem>
                    ) : isError ? (
                      <CommandItem>Something went wrong</CommandItem>
                    ) : (
                      <>
                        <CommandEmpty>{emptyMessage}</CommandEmpty>
                        <CommandGroup>
                          {newOptions.map((option) => {
                            const isSelected = selectedValues.includes(
                              option.value,
                            );

                            return (
                              <CommandItem
                                key={option.id}
                                value={option.name}
                                disabled={option.isDisabled}
                                onSelect={() => toggleSelect(option.value)}
                                className="flex items-center gap-3 px-3 py-2.5"
                              >
                                <div
                                  className={cn(
                                    "border-primary flex h-4 w-4 items-center justify-center rounded-sm border",
                                    isSelected
                                      ? "bg-primary text-primary-foreground"
                                      : "opacity-50",
                                  )}
                                >
                                  {isSelected && <Check className="h-3 w-3" />}
                                </div>

                                {option.image && (
                                  <Image
                                    src={option.image}
                                    alt={option.name}
                                    width={24}
                                    height={16}
                                    className="h-4 w-6 rounded-sm object-cover"
                                  />
                                )}

                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {option.name}
                                  </span>

                                  {option.isDisabled && (
                                    <>({option.disableText})</>
                                  )}
                                </div>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

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
