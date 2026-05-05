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
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

type TComboboxOption = {
  label: string;
  value: string;
  isDisabled?: boolean;
  disableText?: string;
};

type TCustomComboboxProps = {
  name: string;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  required?: boolean;
  disabled?: boolean;
  options?: TComboboxOption[];
  className?: string;
  labelClassName?: string;
  buttonClassName?: string;
  // Server-side search props
  onSearchChange?: (searchTerm: string) => void;
  isSearching?: boolean;
  debounceMs?: number;
  invalidValues?: { fieldName: string; value: unknown }[];
};

export default function CustomCombobox({
  name,
  label,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  required,
  disabled,
  options = [],
  className,
  labelClassName,
  buttonClassName,
  onSearchChange,
  isSearching = false,
  debounceMs = 200,
  invalidValues = [],
}: TCustomComboboxProps) {
  const { control, setValue } = useFormContext();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Debounce search
  useEffect(() => {
    if (!onSearchChange) return;

    const timer = setTimeout(() => {
      onSearchChange(searchValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchValue, debounceMs, onSearchChange]);

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? "This field is required" : false }}
      render={({ field, fieldState }) => {
        const selectedValue =
          field.value === undefined || field.value === null
            ? ""
            : String(field.value);

        const selectedOption = options.find(
          (opt) => String(opt.value) === selectedValue,
        );

        return (
          <div className={cn("flex w-full flex-col", className)}>
            {label && (
              <label
                htmlFor={name}
                className={cn(
                  "pb-2 text-sm font-semibold md:text-sm",
                  labelClassName,
                )}
              >
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
                    "w-full justify-between font-normal",
                    !field.value && "text-muted-foreground",
                    buttonClassName,
                  )}
                >
                  {selectedOption?.label || placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-[--radix-popover-trigger-width] p-0"
              >
                <Command shouldFilter={!onSearchChange} className="">
                  <CommandInput
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandList
                    className="max-h-75 overflow-y-auto overscroll-contain"
                    onWheel={(event) => {
                      event.stopPropagation();
                      const list = event.currentTarget;
                      list.scrollTop += event.deltaY;
                    }}
                  >
                    {isSearching ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
                        <span className="text-muted-foreground ml-2 text-sm">
                          Searching...
                        </span>
                      </div>
                    ) : (
                      <>
                        <CommandEmpty>{emptyMessage}</CommandEmpty>
                        <CommandGroup>
                          {options.map((option) => (
                            <CommandItem
                              key={option.value}
                              value={option.value}
                              disabled={option.isDisabled}
                              onSelect={(currentValue) => {
                                field.onChange(
                                  currentValue === selectedValue
                                    ? ""
                                    : currentValue,
                                );
                                if (invalidValues) {
                                  invalidValues.forEach((item) => {
                                    setValue(item.fieldName, item.value);
                                  });
                                }
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedValue === String(option.value)
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {option.label}
                              {option.isDisabled && option.disableText && (
                                <>({option.disableText})</>
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {fieldState.error?.message ? (
              <small className="text-destructive mt-1 text-sm">
                {fieldState.error.message}
              </small>
            ) : null}
          </div>
        );
      }}
    />
  );
}
